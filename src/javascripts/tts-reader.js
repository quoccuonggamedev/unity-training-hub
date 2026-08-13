/* =============================================================================
 * tts-reader.js — Trình đọc tiếng Việt cho Unity Training Hub
 *
 * Dùng Web Speech API (window.speechSynthesis) — API này KHÔNG tự tổng hợp
 * giọng nói mà gọi thẳng xuống engine TTS của HỆ ĐIỀU HÀNH:
 *   macOS / iOS  → AVSpeechSynthesizer   (giọng "Linh", …)
 *   Windows      → SAPI / OneCore        ("Microsoft An", "HoaiMy", "NamMinh")
 *   Android      → android.speech.tts.TextToSpeech (Google TTS tiếng Việt)
 * ⇒ đúng yêu cầu "dùng text-to-speech của phần cứng".
 *
 * Chỉ đọc phần TIẾNG VIỆT: .col-vi, tiêu đề, và các đoạn "VI: … / EN: …".
 * Bỏ qua: .col-en, <pre>, <table>, phần "EN:".
 * ========================================================================== */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var Utterance = window.SpeechSynthesisUtterance;
  if (!synth || !Utterance) return;         // trình duyệt không hỗ trợ

  var LS = 'uth-tts';
  var MAX_LEN = 180;                        // cắt câu ngắn → tránh bug Chrome dừng ~15s
  var isApple = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
                /iPad|iPhone|iPod/.test(navigator.userAgent);

  var chunks = [];        // [{el, text}]
  var idx = -1;           // chunk đang đọc
  var queue = [];         // các câu của chunk hiện tại
  var qi = 0;
  var playing = false;
  var voices = [];
  var prefs = { voiceURI: '', rate: 1 };
  var charDone = 0, charTotal = 1, rafId = null, tStart = 0, gotBoundary = false;
  var keepAlive = null;

  /* ---------------------------------------------------------------- prefs -- */
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(LS) || '{}')); } catch (e) {}
  function savePrefs() { try { localStorage.setItem(LS, JSON.stringify(prefs)); } catch (e) {} }

  /* ------------------------------------------------------- gom nội dung VI -- */
  var SKIP_TAG = { PRE: 1, TABLE: 1, CODE: 1, SCRIPT: 1, STYLE: 1, IMG: 1, SVG: 1 };

  function cleanText(t) {
    return t
      .replace(/¶/g, ' ')                                   // permalink ¶
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, ' ')
      .replace(/✓/g, ' bật ').replace(/✗|✘/g, ' tắt ')
      .replace(/§\s*/g, ' mục ')                            // § → "mục"
      .replace(/[→⇒➔]/g, ' , ')                   // → ⇒
      .replace(/[—–]/g, ' , ')                         // — –
      .replace(/·/g, ' , ')                                 // ·
      .replace(/µs/g, ' micro giây')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var DIACRITIC = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

  // "VI: abc / EN: xyz" → "abc" ; "EN: xyz" → null ; còn lại → nguyên văn
  function viPart(t) {
    var m = t.match(/^\s*VI\s*:\s*([\s\S]*?)(?:\s*\/\s*EN\s*:[\s\S]*)?$/i);
    if (m) return m[1];
    if (/^\s*EN\s*:/i.test(t)) return null;
    return t.split(/\s*\/\s*EN\s*:/i)[0];
  }

  // Tiêu đề in đậm dạng "**Tiêu đề tiếng Việt / English title**" → bỏ vế sau.
  function stripBoldPair(el, t) {
    var only = el.children.length === 1 && el.firstElementChild.tagName === 'STRONG' &&
               el.firstElementChild.textContent.trim() === t.trim();
    if (!only) return t;
    var p = t.split(' / ');
    if (p.length === 2 && p[0].trim().length >= 12 && p[1].trim().length >= 12 &&
        !DIACRITIC.test(p[1])) return p[0];
    return t;
  }

  function push(el, raw) {
    if (!raw) return;
    var t = cleanText(raw);
    if (t.length < 2 || !/[a-zA-ZÀ-ỹ0-9]/.test(t)) return;
    chunks.push({ el: el, text: t });
  }

  function collectInside(root) {                 // bên trong .col-vi: mọi p/li
    var kids = root.querySelectorAll('p, li, blockquote > p, dd, dt');
    if (!kids.length) { push(root, root.textContent); return; }
    kids.forEach(function (el) {
      if (el.closest('pre, table, code')) return;
      if (el.querySelector('p, li')) return;     // tránh lồng nhau
      push(el, el.textContent);
    });
  }

  function walk(node) {
    for (var i = 0; i < node.children.length; i++) {
      var el = node.children[i];
      var tag = el.tagName;
      if (SKIP_TAG[tag]) continue;
      if (el.classList.contains('col-en') || el.classList.contains('tts-panel')) continue;
      if (el.classList.contains('col-vi')) { collectInside(el); continue; }
      if (/^H[1-4]$/.test(tag)) { push(el, el.textContent); continue; }
      if (tag === 'P' || tag === 'LI') {
        if (el.querySelector('p, li, div')) { walk(el); continue; }
        var vi = viPart(el.textContent);
        if (vi) vi = stripBoldPair(el, vi);
        push(el, vi);
        continue;
      }
      walk(el);                                   // div, ul, ol, details, admonition…
    }
  }

  /* --------------------------------------------------------------- giọng --- */
  var SOUTH = ['south', 'mien nam', 'miền nam', 'saigon', 'sài gòn', 'hcm', 'sg'];

  function loadVoices() {
    var all = synth.getVoices() || [];
    voices = all.filter(function (v) { return /^vi(-|_|$)/i.test(v.lang || ''); });
    if (!voices.length) voices = all.filter(function (v) { return /viet/i.test(v.name || ''); });
    voices.sort(function (a, b) {
      var sa = SOUTH.some(function (k) { return (a.name || '').toLowerCase().indexOf(k) >= 0; });
      var sb = SOUTH.some(function (k) { return (b.name || '').toLowerCase().indexOf(k) >= 0; });
      if (sa !== sb) return sa ? -1 : 1;
      return (a.name || '').localeCompare(b.name || '');
    });
    return voices;
  }

  function currentVoice() {
    if (!voices.length) return null;
    for (var i = 0; i < voices.length; i++) if (voices[i].voiceURI === prefs.voiceURI) return voices[i];
    return voices[0];
  }

  /* ------------------------------------------------------------ tách câu --- */
  function splitSentences(text) {
    var parts = text.match(/[^.!?;:]+[.!?;:]*\s*/g) || [text];
    var out = [], buf = '';
    parts.forEach(function (p) {
      if ((buf + p).length > MAX_LEN && buf) { out.push(buf.trim()); buf = ''; }
      if (p.length > MAX_LEN) {                       // câu quá dài → cắt theo dấu phẩy
        (p.match(new RegExp('[\\s\\S]{1,' + MAX_LEN + '}(,|\\s|$)', 'g')) || [p])
          .forEach(function (s) { if (s.trim()) out.push(s.trim()); });
      } else buf += p;
    });
    if (buf.trim()) out.push(buf.trim());
    return out.filter(Boolean);
  }

  /* ----------------------------------------------------------- highlight --- */
  function setProgress(pct) {
    if (idx < 0 || !chunks[idx]) return;
    chunks[idx].el.style.setProperty('--tts-progress', Math.max(0, Math.min(100, pct)) + '%');
  }

  function clearHighlight() {
    document.querySelectorAll('.tts-active').forEach(function (el) {
      el.classList.remove('tts-active');
      el.style.removeProperty('--tts-progress');
    });
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function highlight(i) {
    clearHighlight();
    var el = chunks[i] && chunks[i].el;
    if (!el) return;
    el.classList.add('tts-active');
    el.style.setProperty('--tts-progress', '0%');
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    catch (e) { el.scrollIntoView(); }
  }

  // Ước lượng tiến độ theo thời gian; nếu event `boundary` chạy thì nhường cho nó.
  function tickFallback() {
    if (!playing || gotBoundary) { rafId = null; return; }
    var est = (charTotal / (12 * (prefs.rate || 1))) * 1000;      // ~12 ký tự/giây
    var pct = ((performance.now() - tStart) / est) * 100;
    setProgress(pct);
    rafId = requestAnimationFrame(tickFallback);
  }

  /* --------------------------------------------------------------- phát --- */
  function speakSentence() {
    if (qi >= queue.length) { next(true); return; }
    var u = new Utterance(queue[qi]);
    var v = currentVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'vi-VN'; }
    u.rate = prefs.rate || 1;
    u.pitch = 1;

    u.onboundary = function (e) {
      if (typeof e.charIndex !== 'number') return;
      gotBoundary = true;
      setProgress(((charDone + e.charIndex) / charTotal) * 100);
    };
    u.onend = function () {
      if (!playing) return;
      charDone += queue[qi].length + 1;
      qi++;
      setProgress((charDone / charTotal) * 100);
      speakSentence();
    };
    u.onerror = function (e) {
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      if (!playing) return;
      charDone += queue[qi].length + 1; qi++; speakSentence();
    };
    synth.speak(u);
  }

  function playChunk(i) {
    if (i < 0 || i >= chunks.length) { stop(); return; }
    synth.cancel();
    idx = i;
    queue = splitSentences(chunks[i].text);
    qi = 0; charDone = 0; charTotal = chunks[i].text.length || 1;
    gotBoundary = false; tStart = performance.now();
    playing = true;
    highlight(i);
    render();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tickFallback);
    speakSentence();
  }

  function play() {
    if (!chunks.length) build();
    if (!voices.length) loadVoices();
    if (synth.paused && idx >= 0) { synth.resume(); playing = true; startKeepAlive(); render(); return; }
    playChunk(idx >= 0 ? idx : nearestChunkToViewport());
    startKeepAlive();
  }

  function pause() {
    playing = false;
    try { synth.pause(); } catch (e) { synth.cancel(); }
    stopKeepAlive();
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    render();
  }

  function stop() {
    playing = false; synth.cancel(); stopKeepAlive(); clearHighlight(); render();
  }

  function next(auto) {
    if (idx + 1 >= chunks.length) { stop(); idx = -1; return; }
    if (playing || !auto) playChunk(idx + 1); else { idx++; highlight(idx); }
  }

  function prev() {
    playChunk(Math.max(0, idx - 1));
  }

  function nearestChunkToViewport() {
    for (var i = 0; i < chunks.length; i++) {
      var r = chunks[i].el.getBoundingClientRect();
      if (r.bottom > 80) return i;
    }
    return 0;
  }

  /* Chrome/Edge cắt tiếng sau ~15 s — nhịp pause/resume giữ cho engine sống. */
  function startKeepAlive() {
    if (isApple || keepAlive) return;
    keepAlive = setInterval(function () {
      if (playing && synth.speaking && !synth.paused) { synth.pause(); synth.resume(); }
    }, 10000);
  }
  function stopKeepAlive() { if (keepAlive) { clearInterval(keepAlive); keepAlive = null; } }

  /* ---------------------------------------------------------------- UI ----- */
  var panel, btnPlay, selVoice, selRate, lblPos, warn;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm12 0v12l-9-6z"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 6l9 6-9 6z"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 4a7.4 7.4 0 0 1-.1 1.2l2 1.6-1.9 3.3-2.4-1a7.6 7.6 0 0 1-2 1.2l-.4 2.6h-3.8l-.4-2.6a7.6 7.6 0 0 1-2-1.2l-2.4 1L2.7 14.8l2-1.6A7.4 7.4 0 0 1 4.6 12c0-.4 0-.8.1-1.2l-2-1.6 1.9-3.3 2.4 1a7.6 7.6 0 0 1 2-1.2L9.4 3h3.8l.4 2.6c.7.3 1.4.7 2 1.2l2.4-1 1.9 3.3-2 1.6c.1.4.1.8.1 1.3z"/></svg>'
  };

  function buildUI() {
    panel = el('div', 'tts-panel');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Trình đọc tiếng Việt');

    /* Thanh chính: viên thuốc gọn — ⏮ ▶ ⏭ ⚙ */
    var bar = el('div', 'tts-bar');
    var bPrev = el('button', 'tts-btn', ICON.prev); bPrev.title = 'Đoạn trước (←)'; bPrev.onclick = prev;
    btnPlay = el('button', 'tts-btn tts-main', ICON.play);
    btnPlay.title = 'Phát / Tạm dừng (Space) · Esc để dừng';
    btnPlay.onclick = function () { playing ? pause() : play(); };
    var bNext = el('button', 'tts-btn', ICON.next); bNext.title = 'Đoạn sau (→)';
    bNext.onclick = function () { next(false); };
    var bGear = el('button', 'tts-btn tts-gear', ICON.gear); bGear.title = 'Giọng & tốc độ';
    bGear.onclick = function (e) { e.stopPropagation(); panel.classList.toggle('tts-open'); };
    [bPrev, btnPlay, bNext, bGear].forEach(function (b) { bar.appendChild(b); });
    panel.appendChild(bar);

    /* Khay tuỳ chọn — chỉ hiện khi bấm ⚙ */
    var pop = el('div', 'tts-pop');
    pop.onclick = function (e) { e.stopPropagation(); };

    selVoice = el('select', 'tts-sel');
    selVoice.title = 'Giọng đọc (lấy từ hệ điều hành)';
    selVoice.onchange = function () {
      prefs.voiceURI = selVoice.value; savePrefs();
      if (playing) playChunk(idx);
    };
    pop.appendChild(selVoice);

    selRate = el('select', 'tts-sel');
    [['0.8', '0.8×'], ['0.9', '0.9×'], ['1', '1×'], ['1.15', '1.15×'], ['1.3', '1.3×'], ['1.5', '1.5×'], ['1.75', '1.75×']]
      .forEach(function (o) {
        var op = el('option', null, o[1]); op.value = o[0];
        if (parseFloat(o[0]) === parseFloat(prefs.rate)) op.selected = true;
        selRate.appendChild(op);
      });
    selRate.onchange = function () {
      prefs.rate = parseFloat(selRate.value); savePrefs();
      if (playing) playChunk(idx);
    };
    pop.appendChild(selRate);

    var foot = el('div', 'tts-foot');
    lblPos = el('span', 'tts-pos', '');
    var bStop = el('button', 'tts-stop', 'Dừng'); bStop.title = 'Dừng hẳn (Esc)'; bStop.onclick = stop;
    foot.appendChild(lblPos); foot.appendChild(bStop);
    pop.appendChild(foot);

    warn = el('div', 'tts-warn', '');   // chỉ dùng khi máy KHÔNG có giọng Việt nào
    pop.appendChild(warn);

    panel.appendChild(pop);
    document.body.appendChild(panel);

    document.addEventListener('click', function () { panel.classList.remove('tts-open'); });
  }

  function fillVoices() {
    if (!selVoice) return;
    selVoice.innerHTML = '';
    warn.innerHTML = '';
    if (!voices.length) {
      selVoice.appendChild(el('option', null, 'Chưa có giọng tiếng Việt'));
      selVoice.disabled = true;
      warn.innerHTML = 'Cài gói giọng <b>Tiếng Việt</b> trong cài đặt máy để dùng.';
      return;
    }
    selVoice.disabled = false;
    voices.forEach(function (v) {
      var op = el('option', null, v.name + (v.localService ? '' : ' (mạng)'));
      op.value = v.voiceURI;
      if (v.voiceURI === prefs.voiceURI) op.selected = true;
      selVoice.appendChild(op);
    });
    if (!prefs.voiceURI) { prefs.voiceURI = voices[0].voiceURI; selVoice.value = prefs.voiceURI; }
  }

  function render() {
    if (!btnPlay) return;
    btnPlay.innerHTML = playing ? ICON.pause : ICON.play;
    panel.classList.toggle('tts-playing', playing);
    lblPos.textContent = chunks.length
      ? (idx >= 0 ? idx + 1 : 0) + ' / ' + chunks.length
      : '';
  }

  /* ------------------------------------------------------------- khởi tạo -- */
  function build() {
    chunks = [];
    var root = document.querySelector('.md-content__inner') || document.querySelector('article') || document.body;
    walk(root);
    // double-click vào đoạn nào thì đọc từ đó
    chunks.forEach(function (c, i) {
      if (c.el.dataset.ttsBound) return;
      c.el.dataset.ttsBound = '1';
      c.el.classList.add('tts-chunk');
      c.el.addEventListener('dblclick', function () { playChunk(i); });
    });
    render();
  }

  function init() {
    buildUI();
    build();
    loadVoices(); fillVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = function () { loadVoices(); fillVoices(); };
    }

    document.addEventListener('keydown', function (e) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'ArrowRight' && playing) { e.preventDefault(); next(false); }
      else if (e.key === 'ArrowLeft' && playing) { e.preventDefault(); prev(); }
      else if (e.key === 'Escape') { stop(); }
    });

    window.addEventListener('beforeunload', function () { synth.cancel(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
