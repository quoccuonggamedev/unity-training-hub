# 📋 Bảng kiểm nguồn dữ liệu — Source Coverage Tracker

> Toàn bộ **55 URL duy nhất** được trích từ `src/raw-optimization-data.txt`, ánh xạ vào từng Module và theo dõi trạng thái cào dữ liệu.

**Chú giải trạng thái / Status legend**

| Ký hiệu | Ý nghĩa / Meaning |
|---|---|
| ✅ | Đã cào & bóc tách vào nội dung / Scraped & synthesized |
| 🟡 | Đã tải về, chờ Module tương ứng / Downloaded, pending its module |
| ⏳ | Nằm trong plan, chưa tới lượt / Planned, not yet due |
| ⚠️ | Cào lỗi — xem ghi chú / Fetch failed — see note |
| ➖ | Ngoài phạm vi 5 Module (tham khảo) / Out of scope (reference only) |

---

## 🌱 MODULE 1 — Fresher: Ultimate Guide to Profiling

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 1 | 📕 [**E-book PDF** — Optimize Your Mobile Game Performance (52 tr.)](https://content.cdntwrk.com/files/aT0xMzg4ODYxJnY9MSZpc3N1ZU5hbWU9dW5pdHktZS1ib29rLW9wdGltaXplLXlvdXItbW9iaWxlLWdhbWUtcGVyZm9ybWFuY2UmY21kPWQmc2lnPWU3NWYzMDQxZjdkNTk4ZDc4NjVhMjZiZTVmM2E1ODQ4) | ✅ ch. Profiling / Memory / Adaptive Performance / Code architecture |
| 2 | 📗 [**E-book PDF** — Ultimate Guide to Profiling Unity Games (**75 tr.**)](https://cdn.bfldr.com/S5BC9Y64/at/jmv8gbjf4gc35jptsnmrrsz/Ultimate_Guide_to_Profiling_Unity_Games.pdf) | ✅ ⭐ **Nguồn chính** — toàn văn + 11 ảnh trích từ PDF |
| 3 | 📗 [**E-book PDF** — Ultimate Guide to Profiling Games, Unity 6 ed. (**93 tr.**)](https://cdn.bfldr.com/S5BC9Y64/at/8t9r5hwz38rrbrw4x8zcq2c/Ultimate_Guide_to_Profiling_Games_e-book_-_Unity_6_edition.pdf) | ✅ **Đã đối chiếu 100%** — 13 mục riêng của bản này đã bóc tách hết |
| 4 | [unity.com — Ultimate guide to profiling (landing page)](https://unity.com/resources/ultimate-guide-to-profiling-unity-games) · [bản Unity 6](https://unity.com/resources/ultimate-guide-to-profiling-unity-games-unity-6) | ✅ Trang landing **không có nội dung** (JS-rendered + form gate) — giá trị duy nhất là chứa link PDF ở #2/#3 |
| 4b | [resources.unity.com — Ultimate Guide to Profiling](https://resources.unity.com/games/ultimate-guide-to-profiling-unity-games) | ✅ Trùng #4 |
| 5 | [Unity Blog — Tips on profiling, memory, and code architecture](https://blog.unity.com/technology/optimize-your-mobile-game-performance-tips-on-profiling-memory-and-code-architecture) | ✅ |
| 6 | [Unity Blog — Everything about Memory Profiler 1.0.0](https://blog.unity.com/technology/everything-you-need-to-know-about-memory-profiler) | ✅ |
| 7 | [makaka.org — Optimization of Unity Game](https://makaka.org/unity-tutorials/optimization) | ✅ |
| 8 | [awesometuts.com — Optimize Unity Game](https://awesometuts.com/blog/optimize-unity-game/) | ✅ |
| 9 | [unity.com — E-book: Optimize Your Mobile Game Performance (landing)](https://unity.com/resources/unity-e-book-optimize-your-mobile-game-performance) | ✅ (PDF ở #1) |
| 10 | [learn.unity.com — Profiling Applications Made with Unity](https://learn.unity.com/tutorial/profiling-applications-made-with-unity) | ⚠️ **HTTP 404** — Unity Learn đã tái cấu trúc, tutorial không còn tồn tại |
| 11 | [cgcookie.com — Maximizing your Unity game's performance](https://cgcookie.com/posts/maximizing-your-unity-games-performance) | ⚠️ Chặn bởi **Cloudflare JS challenge** (trả về 5.7 KB "Enable JavaScript") |

---

## 🚀 MODULE 2 — Junior: UI & Physics Deep Dive

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 12 | [learn.unity.com — Optimizing Unity UI](https://learn.unity.com/tutorial/optimizing-unity-ui) | ✅ ⭐ **Nguồn chính M2** — cào đủ **6/6 chương** + 5 ảnh |
| 13 | [learn.unity.com — Physics Best Practices](https://learn.unity.com/tutorial/physics-best-practices) | ⚠️ **HTTP 404** — Unity Learn đã xóa. Thay bằng e-book Unity (tr.45–47) + ghi chú raw |
| 14 | [tvd12.com — S.O.L.I.D](https://tvd12.com/solid) | ✅ Cào qua **API `tvd12.com/api/v1/posts/solid`** (trang HTML là SPA render 404) — nguyên văn tiếng Việt |
| 15 | [kodeco.com — Introduction to Unity Unit Testing](https://www.kodeco.com/9454-introduction-to-unity-unit-testing) | ⚠️ **Paywall một phần** — cào được phần khái niệm + setup; code test nửa sau bị chặn |
| 16 | [jacksondunstan.com — C# event vs UnityEvent](https://www.jacksondunstan.com/articles/3335) | ✅ **3 bảng benchmark đầy đủ** + tranh luận trong comments |
| 17 | [GitHub — thefuntastic/Unity3d-Finite-State-Machine](https://github.com/thefuntastic/Unity3d-Finite-State-Machine) | ✅ README đầy đủ + Driver deep-dive |
| 18 | [gamedevbeginner.com — State Machines in Unity](https://gamedevbeginner.com/state-machines-in-unity-how-and-when-to-use-them/) | ✅ **Cào được qua Jina reader** (`r.jina.ai`) sau khi curl bị 403 WAF — 34.8 KB + **5 sơ đồ**; 3 cách cài FSM (Interface/Inheritance/Hierarchical) |
| 19 | [GitHub — aniketrajnish/Unity-Collider-Optimizer](https://github.com/aniketrajnish/Unity-Collider-Optimizer) | ✅ README + **6 ảnh so sánh** + số liệu (3032→918 tris, 214→23 paths) |
| 20 | [GitHub — QianMo/Unity-Design-Pattern](https://github.com/QianMo/Unity-Design-Pattern) | ✅ Catalog **23 GoF + 9 Game Programming Patterns** |
| 21 | 📕 E-book Mobile Perf — ch. *User interface* (tr.37–40), *Physics* (tr.45–47), *Animation* (tr.43–44) | ✅ Bóc tách toàn văn + **11 ảnh trích từ PDF** |

---

## ⚔️ MODULE 3 — Senior: Memory, Addressables & Networking

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 22 | [discussions.unity.com — Effective Asset Management with Addressables](https://discussions.unity.com/t/effective-asset-management-in-unity-with-addressables/1621379) | ✅ ⭐ Bài viết + **toàn bộ Q&A reply** (gồm câu trả lời về *Requested Assets and Dependencies* và cảnh báo `Resources.UnloadUnusedAssets`) + **9 ảnh** |
| 23 | [educba.com — Protobuf vs JSON](https://www.educba.com/protobuf-vs-json/) | ✅ Bảng so sánh + ưu/nhược điểm đầy đủ |
| 24 | [docs.colyseus.io](https://docs.colyseus.io/colyseus/) | ✅ URL raw **404** → tìm ra `docs.colyseus.io/getting-started/unity`; cào qua Jina reader, có code SDK Unity đầy đủ |
| 25 | [learn.unity.com — Memory Management in Unity](https://learn.unity.com/tutorial/memory-management-in-unity) | ✅ ⭐ **Nguồn chính M3** — cào đủ **12/12 chương** (Unity 2022.3) + **3 ảnh** |
| 26 | [codelearn.io — Sử dụng Reflection trong C#](https://codelearn.io/sharing/su-dung-reflection-trong-csharp) | ⚠️ **CAPTCHA** — curl và Jina reader đều bị chặn. Thay bằng #27 + ghi chú raw |
| 27 | [gucheng0712.github.io — C# Reflection in Unity](https://gucheng0712.github.io/unity/csharp/2019/04/19/C-Reflection-in-Unity-copy.html) | ✅ Toàn văn: System.Type, BindingFlags, Assembly, tạo object động |
| 28 | 📕 E-book Mobile Perf — ch. *Assets* (tr.24–28), *Audio* (tr.41–42) · 📙 E-book Console/PC — ch. *Assets* (tr.30–37) | ✅ Bóc tách toàn văn + **10 ảnh trích PDF** |
| — | *Bổ sung từ ghi chú raw (không có URL):* Service Locator, WebSocket Lock-step, Wei = 10⁻¹⁸, MLAPI/Mirror, Android plugin, UnityWebRequest | ✅ Đã đưa vào §10, §12, §13 |

---

## 👑 MODULE 4 — Tech Lead: GPU, URP & Advanced Rendering

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 29 | [Unity Blog — Animation Instancing for SkinnedMeshRenderer](https://blog.unity.com/technology/animation-instancing-instancing-for-skinnedmeshrenderer) | ⏳ |
| 30 | [GitHub — Unity-Technologies/Animation-Instancing](https://github.com/Unity-Technologies/Animation-Instancing) | ⏳ VertexCache |
| 31 | [docs.unity3d.com — GPU Instancing](https://docs.unity3d.com/Manual/GPUInstancing.html) | ⏳ |
| 32 | [Unity Blog — Understanding the Async Upload Pipeline (AUP)](https://blogs.unity3d.com/2018/10/08/optimizing-loading-performance-understanding-the-async-upload-pipeline/) | ⏳ **TimeSlice=4, BufferSize=16, PersistentBuffer=true** |
| 33 | [ronja-tutorials.com](https://www.ronja-tutorials.com/) | ⏳ Raymarching / shader |
| 34 | [theslidefactory.com — See-through objects with Stencil Buffers (URP)](https://www.theslidefactory.com/post/see-through-objects-with-stencil-buffers-using-unity-urp) | ⏳ URP Stencil Mask |
| 35 | [Unity Blog — Expert tips on graphics and assets](https://blog.unity.com/technology/optimize-your-mobile-game-performance-expert-tips-on-graphics-and-assets) | ⏳ |
| 36 | [learn.unity.com — Optimizing Graphics in Unity](https://learn.unity.com/tutorial/optimizing-graphics-in-unity) | ⏳ Camera Clear Flags, Render Texture |
| 37 | [docs.unity3d.com — Baked Light Mode](https://docs.unity3d.com/Manual/LightMode-Baked.html) | ⏳ |
| 38 | [gamedev.net — GPU Performance for Game Artists](https://www.gamedev.net/articles/programming/graphics/gpu-performance-for-game-artists-r4632/) | ⏳ |
| 39 | [thegamedev.guru/blog](https://thegamedev.guru/blog) | ⏳ Draw call batching, Overdraw, PSO |
| 40 | [forum.unity.com — URP e-book for advanced creators](https://forum.unity.com/threads/new-free-e-book-introduction-to-the-universal-render-pipeline-for-advanced-unity-creators.1323774/) | ⏳ |
| 41 | [resources.unity.com — Introduction to URP for advanced creators](https://resources.unity.com/games/introduction-universal-render-pipeline-for-advanced-unity-creators?UNGATED=TRUE) | ⏳ |
| 42 | [YouTube — T-HXmQAMhG0](https://www.youtube.com/watch?v=T-HXmQAMhG0) | ⏳ |
| 43 | 📕 [**E-book PDF** — Optimize your console and PC game performance](https://content.cdntwrk.com/files/aT0xNDI0NjkzJnY9MSZpc3N1ZU5hbWU9b3B0aW1pemUteW91ci1jb25zb2xlLWFuZC1wYy1nYW1lLXBlcmZvcm1hbmNlJmNtZD1kJnNpZz1hYjFkYjE2OTRhZWZhNzI4OTFkM2FiZjIyNTIyNTkyMQ%253D%253D) | 🟡 Đã tải (`_ebooks/`) |
| 44 | [unity.com — Optimize your console and PC game performance (landing)](https://unity.com/resources/optimize-your-console-and-pc-game-performance) | ⏳ |
| 45 | 📕 E-book Mobile Perf — ch. *Graphics and GPU optimization* (tr.29–36) | 🟡 PDF đã tải |
| 21b | 📙 E-book Console/PC — ch. *User interface* (tr.70–72) · ***Physics* (tr.77–85, 14 mục)** · ***Animation* (tr.86–88)** | ✅ Bóc tách toàn văn + **10 ảnh** — chương Physics/Animation là phần **bổ sung sau audit** |
| 46 | [resources.unity.com — HDRP Definitive Guide to Lighting (2020 LTS)](https://resources.unity.com/games/hdrp-guide) | ⏳ |
| 47 | [resources.unity.com — HDRP Lighting (2021 LTS)](https://resources.unity.com/games/the-definitive-guide-to-lighting-in-the-high-definition-render-pipeline-unity-2021-lts-edition) | ⏳ |
| 48 | [resources.unity.com — Definitive Guide to Creating VFX](https://resources.unity.com/games/definitive-guide-to-creating-visual-effects?ungated=true) | ⏳ |
| 49 | [create.unity3d.com — Unity for Technical Artists](https://create.unity3d.com/tech-artists-key-toolsets) | ⏳ |

---

## 👑 MODULE 5 — Tech Lead: CyberAgent Bible & Sentry ANR

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 50 | [GitHub — CyberAgent Unity Performance Tuning Bible v1.0.5](https://github.com/CyberAgentGameEntertainment/UnityPerformanceTuningBible/releases/tag/v1.0.5) | ⏳ |
| 51 | [blog.sentry.io — Fixing Unity ANRs with Sentry (Amanotes)](https://blog.sentry.io/fixing-unity-anrs-with-sentry-amanotes/) | ⏳ **Deadlock Main Thread** |
| 52 | 📕 [**E-book PDF** — Unity Gamedev Field Guide (79 tr.)](https://content.cdntwrk.com/files/aT0xNDMwNzIwJnY9MSZpc3N1ZU5hbWU9dW5pdHktZ2FtZS1kZXYtZmllbGQtZ3VpZGUmY21kPWQmc2lnPTJmNGI2NGQzMzEyNDU4ODA1ODA0MWFiOTAwOTU3M2Qz) | 🟡 Đã tải — ch. Version control, Project organization |
| 53 | [resources.unity.com — Version control & project organization best practices](https://resources.unity.com/games/version-control-project-organization-best-practices-ebook) | ⏳ |
| 54 | [create.unity3d.com — 70+ tips to improve workflow](https://create.unity3d.com/ebook-improve-workflow) | ⏳ |
| 55 | 📕 E-book Mobile Perf — ch. *Project configuration* (tr.22–23), *Workflow and collaboration* (tr.48–49) | 🟡 PDF đã tải |

---

## ➖ Ngoài phạm vi 5 Module (lưu để tham khảo)

| Nguồn | Ghi chú |
|---|---|
| [resources.unity.com — Game Designer Playbook](https://resources.unity.com/games/game-designer-playbook) | Game design, không phải tối ưu hóa |
| [resources.unity.com — 2D Game Art, Animation & Lighting](https://resources.unity.com/games/2d-game-art-animation-lighting-for-artists-ebook) | Nội dung dành cho artist 2D |

---

## 📊 Tổng kết tiến độ / Progress summary

| Module | Đã cào ✅ | Đã tải 🟡 | Chờ ⏳ | Lỗi ⚠️ | Tổng |
|---|---|---|---|---|---|
| **M1 — Fresher** | 10 | 0 | 0 | 2 | **12** |
| **M2 — Junior** | 9 | 0 | 0 | 2 | **11** |
| **M3 — Senior** | 7 | 0 | 0 | 1 | **8** |
| **M4 — Tech Lead** | 0 | 1 | 20 | 0 | **21** |
| **M5 — Tech Lead** | 0 | 2 | 4 | 0 | **6** |
| Tham khảo ➖ | — | — | — | — | **2** |

!!! note "Ghi chú về e-book PDF"
    3 file PDF trên `content.cdntwrk.com` là **tài liệu gốc đầy đủ**, giá trị cao hơn hẳn các trang landing page (vốn chỉ có form đăng ký). Cả 3 đã tải thành công và bóc tách được toàn văn bằng `pdftotext -layout`. Vì mỗi e-book trải nội dung qua nhiều Module, chúng được đánh dấu 🟡 và sẽ được khai thác dần theo từng Module.

    **Đã lưu trữ trong repo tại `_ebooks/`** (kèm bản `.txt` đã bóc tách sẵn, đã thêm vào `.gitignore` để không đẩy 22 MB binary lên Git):

    | File | Dung lượng | Số trang |
    |---|---|---|
    | `unity-optimize-mobile-game-performance.pdf` | 9.2 MB | 52 |
    | `unity-gamedev-field-guide.pdf` | 6.4 MB | 79 |
    | `unity-optimize-console-pc-performance.pdf` | 6.9 MB | — |
