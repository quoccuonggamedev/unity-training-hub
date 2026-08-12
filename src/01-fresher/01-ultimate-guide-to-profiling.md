# 🌱 Module 1 — Ultimate Guide to Profiling (Hướng dẫn Profiling toàn tập)

!!! abstract "Nguồn / Sources"
    - [Ultimate guide to profiling Unity games — Unity Technologies](https://unity.com/resources/ultimate-guide-to-profiling-unity-games)
    - [Optimize your mobile game performance: tips on profiling, memory, and code architecture — Unity Blog](https://blog.unity.com/technology/optimize-your-mobile-game-performance-tips-on-profiling-memory-and-code-architecture)
    - [Everything you need to know about Memory Profiler 1.0.0 — Unity Blog](https://blog.unity.com/technology/everything-you-need-to-know-about-memory-profiler)
    - [Optimization of Unity Game — makaka.org](https://makaka.org/unity-tutorials/optimization)
    - [How To Optimize Unity Game — Awesome Tuts](https://awesometuts.com/blog/optimize-unity-game/)

---

## 1. Tư duy nền tảng: Vì sao FPS là một metric TỆ

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Đừng dùng FPS làm thước đo chính.</strong> FPS (khung hình/giây) là một đại lượng <em>phi tuyến</em> — nó che giấu chi phí thật sự của mỗi khung hình. Metric đúng phải là <strong>Frame Time (ms)</strong>.</p>
<p>Ví dụ kinh điển: giảm từ 900 FPS xuống 450 FPS nghe có vẻ "mất một nửa hiệu năng", nhưng thực chất bạn chỉ tốn thêm <strong>1.1 ms</strong>. Ngược lại, rơi từ 60 FPS xuống 30 FPS cũng là "mất một nửa" — nhưng bạn đã tốn thêm <strong>16.6 ms</strong>, gấp 15 lần.</p>
<p>Vì thế: <strong>luôn đo bằng mili-giây, luôn so sánh với ngân sách khung hình (frame budget)</strong>.</p>
</div>
<div class="col-en">
<p><strong>Don't use FPS as your primary metric.</strong> Frames per second is a <em>non-linear</em> quantity — it hides the true cost of each frame. The correct metric is <strong>Frame Time (ms)</strong>.</p>
<p>Classic example: dropping from 900 FPS to 450 FPS sounds like "losing half your performance", but you actually only spent an extra <strong>1.1 ms</strong>. Conversely, falling from 60 FPS to 30 FPS is also "half" — but you spent an extra <strong>16.6 ms</strong>, 15× more.</p>
<p>Therefore: <strong>always measure in milliseconds, always compare against the frame budget</strong>.</p>
</div>
</div>

### 1.1. Bảng ngân sách khung hình (Frame Budget)

<div class="bilingual-row">
<div class="col-vi">
<p>Ngân sách lý thuyết = <code>1000 ms ÷ FPS mục tiêu</code>.</p>
<p><strong>Nhưng trên mobile bạn KHÔNG được dùng hết.</strong> Điện thoại không có tản nhiệt chủ động; nếu chạy full budget liên tục, OS sẽ <em>thermal throttle</em> (hạ xung CPU/GPU) và FPS sụt thảm hại sau 5–10 phút chơi.</p>
<p>Unity khuyến nghị chỉ dùng khoảng <strong>65%</strong> ngân sách, phần còn lại để máy "thở" và hạ nhiệt.</p>
</div>
<div class="col-en">
<p>Theoretical budget = <code>1000 ms ÷ target FPS</code>.</p>
<p><strong>But on mobile you must NOT consume all of it.</strong> Phones have no active cooling; running at full budget continuously makes the OS <em>thermal throttle</em> the CPU/GPU, and FPS collapses after 5–10 minutes of play.</p>
<p>Unity recommends using only about <strong>65%</strong> of the available time, leaving the remainder to allow for cooldown between frames.</p>
</div>
</div>

| Target FPS | Ngân sách lý thuyết / Theoretical budget | Ngân sách mobile an toàn (~65%) / Safe mobile budget |
|---|---|---|
| 30 FPS | 33.33 ms | **~22 ms** |
| 60 FPS | 16.66 ms | **~11 ms** |
| 72 FPS (VR) | 13.88 ms | ~9 ms |
| 90 FPS (VR) | 11.11 ms | ~7 ms |

!!! tip "Chiến thuật thực chiến / Field tactic"
    **VI:** Màn hình Idle / Menu / khi user ít tương tác → hạ `Application.targetFrameRate` từ 60 xuống 30 để giảm nhiệt độ máy, kéo dài pin, và "trả lại" ngân sách nhiệt cho lúc gameplay cao điểm.

    **EN:** On idle screens / menus / low-interaction moments → drop `Application.targetFrameRate` from 60 to 30 to reduce device heat, extend battery, and "bank" thermal headroom for peak gameplay.

```csharp
// Điều tiết FPS theo ngữ cảnh — Context-aware frame rate throttling
using UnityEngine;

public class ThermalGovernor : MonoBehaviour
{
    private const int FpsGameplay = 60;   // 16.66 ms budget
    private const int FpsIdle     = 30;   // 33.33 ms budget

    void Awake()
    {
        QualitySettings.vSyncCount = 0;   // Bắt buộc: vSync ghi đè targetFrameRate
        Application.targetFrameRate = FpsGameplay;
    }

    public void EnterIdleScreen()  => Application.targetFrameRate = FpsIdle;
    public void EnterGameplay()    => Application.targetFrameRate = FpsGameplay;
}
```

---

## 2. Chu trình Profiling chuẩn (The Profiling Cycle)

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Profile early, profile often, profile on the target device.</strong></p>
<ol>
<li><strong>Đo trước (Baseline):</strong> Profile ngay từ sớm trong quá trình phát triển, không phải lúc sắp ship. Bạn cần xây dựng "chữ ký hiệu năng" (performance signature) cho dự án để phát hiện bất thường.</li>
<li><strong>Tìm bottleneck thật:</strong> Đừng đoán. Đừng tối ưu dựa trên giả định. Dùng Profiler để định vị chính xác nguồn gây lag.</li>
<li><strong>Lưu file <code>.data</code> TRƯỚC khi sửa.</strong></li>
<li><strong>Sửa MỘT thứ.</strong></li>
<li><strong>Đo lại &amp; so sánh</strong> với file <code>.data</code> đã lưu.</li>
<li>Lặp lại: <em>profile → optimize → compare</em>.</li>
</ol>
</div>
<div class="col-en">
<p><strong>Profile early, profile often, profile on the target device.</strong></p>
<ol>
<li><strong>Baseline first:</strong> Profile your project early in development, not just when you are close to shipping. You need to develop a "performance signature" for your project to spot new issues easily.</li>
<li><strong>Find the real bottleneck:</strong> Don't guess or make assumptions about what is slowing down your game. Use the Profiler to locate the precise source of a lag.</li>
<li><strong>Save the Profiler <code>.data</code> file BEFORE optimizing.</strong></li>
<li><strong>Implement ONE change.</strong></li>
<li><strong>Re-measure &amp; compare</strong> against the saved <code>.data</code>.</li>
<li>Rinse and repeat: <em>profile → optimize → compare</em>.</li>
</ol>
</div>
</div>

### 2.1. Phân loại vấn đề hiệu năng (Problem Taxonomy)

<div class="bilingual-row">
<div class="col-vi">
<p><strong>① SPIKE (Gai nhọn):</strong> Sụt FPS đột ngột trong một khung hình. Người chơi cảm nhận như game "khựng lại". Nguyên nhân: tính toán nặng dồn vào 1 frame (load asset, instantiate hàng loạt, pathfinding). Rất tai hại với game FPS/đua xe cần frame rate ổn định.</p>
<p><strong>② GC SPIKE (Gai do Garbage Collector):</strong> Loại spike đặc biệt do hệ thống thu gom rác. Xảy ra khi bộ nhớ rác chạm ngưỡng. Tần suất phụ thuộc lượng rác sinh ra mỗi frame. Cách triệt tiêu hoàn toàn duy nhất: <strong>không sinh rác lúc runtime</strong> — việc này phải tính từ đầu dự án.</p>
<p><strong>③ EVERY-FRAME COST (Chi phí mỗi khung hình):</strong> Các phép tính chạy mỗi frame (physics, AI, animation). Không gây giật, nhưng kéo tụt FPS trung bình, làm game "nặng nề". Nếu game chạy chậm đều đều → đây là vùng cần xử lý.</p>
<p><strong>④ MEMORY (Bộ nhớ):</strong> RAM cho CPU, VRAM cho GPU. Thiếu bộ nhớ → stuttering hoặc crash Out-Of-Memory.</p>
</div>
<div class="col-en">
<p><strong>① SPIKE:</strong> A sudden drop in frame rate. The game suddenly stops and doesn't move for a noticeable time. Caused by complex calculations or difficult operations performed during a single frame. This can break player immersion — a serious problem in high-intensity games needing a stable frame rate, such as driving or shooting games.</p>
<p><strong>② GC SPIKE:</strong> Frame rate drops specifically caused by Unity's garbage collection system. The spikes happen when the memory garbage limits are met and the collection runs. Their frequency is mandated by how much garbage the game generates each frame. The only way of preventing these spikes completely is to generate no garbage during runtime — a huge undertaking that must be considered from the very beginning of a project.</p>
<p><strong>③ EVERY-FRAME COST:</strong> Calculations run every single frame — physics, AI behavior, character animation. They slow down the general frame rate and make the game feel less fluid. If a game just generally runs poorly, this is the area that needs work.</p>
<p><strong>④ MEMORY:</strong> RAM is what your CPU uses, VRAM is what your GPU uses. When there is not enough memory, stuttering may occur.</p>
</div>
</div>

---

## 3. Unity Profiler — Công cụ chủ lực

<img src="../assets/profiler-window-overview.png" alt="Unity Profiler Window">
<p><em>VI: Cửa sổ Unity Profiler — dùng để kiểm tra hiệu năng và phân bổ tài nguyên. / EN: Use the Unity Profiler to test performance and resource allocation for your application.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Mở:</strong> <code>Window &gt; Analysis &gt; Profiler</code>, hoặc phím tắt <strong>Ctrl+7</strong> (Windows) / <strong>Cmd+7</strong> (macOS).</p>
<p><strong>Bản chất:</strong> Đây là <em>instrumentation-based profiler</em> — nó đo các đoạn code được bọc tường minh bằng <code>ProfilerMarker</code> (ví dụ <code>Start</code>, <code>Update</code> của MonoBehaviour, hoặc các lời gọi API cụ thể).</p>
<p>Bật mặc định track <strong>CPU</strong> và <strong>Memory</strong>. Các module bổ sung (Renderer, Audio, Physics) bật theo nhu cầu game.</p>
<p><strong>Số frame ghi lại:</strong> mặc định <strong>300 frames</strong>. Tăng tối đa lên <strong>2000</strong> tại <code>Unity &gt; Preferences &gt; Analysis &gt; Profiler &gt; Frame Count</code>. Đánh đổi: Editor tốn thêm CPU và RAM.</p>
</div>
<div class="col-en">
<p><strong>Open:</strong> <code>Window &gt; Analysis &gt; Profiler</code>, or shortcut <strong>Ctrl+7</strong> (Windows) / <strong>Cmd+7</strong> (macOS).</p>
<p><strong>Nature:</strong> This is an <em>instrumentation-based profiler</em> that profiles code timings explicitly wrapped in ProfileMarkers (such as MonoBehaviour's <code>Start</code> or <code>Update</code> methods, or specific API calls).</p>
<p>Enable the <strong>CPU</strong> and <strong>Memory</strong> tracks by default. Monitor supplementary Profiler Modules like Renderer, Audio, and Physics as needed for your game.</p>
<p><strong>Recorded frames:</strong> The Record button tracks <strong>300 frames</strong> by default. Go to <code>Unity &gt; Preferences &gt; Analysis &gt; Profiler &gt; Frame Count</code> to increase this as far as <strong>2000</strong>. Trade-off: the Editor has to do more CPU work and take up more memory.</p>
</div>
</div>

### 3.1. Các category Profiler theo dõi / Profiler categories

| Category | Nội dung / Content |
|---|---|
| CPU & GPU Usage | Thời gian xử lý mỗi luồng / Per-thread processing time |
| Rendering | Draw calls, batches, triangles, vertices |
| Memory | Managed heap, native memory, assets |
| Audio & Video | Voices, DSP load, clip memory |
| Physics (2D & 3D) | Rigidbody count, contacts, queries |
| Network | Messages & Operations |
| UI | Canvas rebuild, layout, batching |
| Global Illumination | Lightmap & realtime GI cost |

### 3.2. Hierarchy vs Timeline — Chọn view nào?

<img src="../assets/profiler-hierarchy-view.png" alt="Profiler Hierarchy View">
<p><em>VI: Hierarchy view cho phép sắp xếp ProfileMarkers theo chi phí thời gian. / EN: The Hierarchy view allows you to sort ProfileMarkers by time cost.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>TIMELINE</strong> — hiển thị trực quan phân bổ thời gian trong 1 frame theo <em>trục thời gian và theo luồng (thread)</em>. Sự kiện bên trái xảy ra trước, bên phải xảy ra sau.</p>
<ul>
<li>👉 Dùng để xác định bạn đang <strong>CPU-bound hay GPU-bound</strong>.</li>
<li>👉 Click vào một block sẽ cho biết GameObject nào liên quan (rất hữu ích với Skinned Mesh Renderer hoặc Animator).</li>
<li>👉 Tốt cho <strong>bức tranh tổng thể</strong>: ví dụ thấy render rất nhanh nhưng phải chờ CPU gửi lệnh.</li>
</ul>
<p><strong>HIERARCHY</strong> — gom nhóm các ProfileMarker thành cây phân cấp, sắp xếp theo chi phí.</p>
<ul>
<li><strong>Time ms</strong>: tổng thời gian (bao gồm hàm con).</li>
<li><strong>Self ms</strong>: thời gian riêng của hàm đó (không tính hàm con).</li>
<li><strong>Calls</strong>: số lần gọi trong frame.</li>
<li><strong>GC Alloc</strong>: lượng rác managed heap sinh ra trong frame.</li>
<li>👉 Tốt cho <strong>soi chi tiết</strong> một phần cụ thể.</li>
</ul>
<p><strong>HIERARCHY RAW MODE</strong> — tách các lời gọi hàm global của Unity thành từng dòng riêng. Khó đọc hơn, nhưng hữu ích để: hiểu cách Unity Engine hoạt động, đếm số lần một global method được gọi, xác định lời gọi nào tốn CPU/Memory bất thường.</p>
</div>
<div class="col-en">
<p><strong>TIMELINE</strong> — shows the visual breakdown of timing for a specific frame <em>across time and across threads</em>. Events on the left happened first, those on the right last.</p>
<ul>
<li>👉 Use this option to determine if you are <strong>CPU- or GPU-bound</strong>.</li>
<li>👉 Clicking a block tells you what GameObject is connected to it (e.g., for Skinned Mesh Renderer or Animator).</li>
<li>👉 Better for the <strong>general picture</strong>: e.g., you can notice rendering is taking very little but is waiting a lot for the CPU to send commands.</li>
</ul>
<p><strong>HIERARCHY</strong> — shows the hierarchy of ProfileMarkers, grouped together and sortable by cost.</p>
<ul>
<li><strong>Time ms</strong>: total time including inner functions.</li>
<li><strong>Self ms</strong>: time without inner functions.</li>
<li><strong>Calls</strong>: number of calls to the function in the frame.</li>
<li><strong>GC Alloc</strong>: managed heap memory allocated on the frame.</li>
<li>👉 Better when you are <strong>focusing on specific parts</strong>.</li>
</ul>
<p><strong>HIERARCHY RAW MODE</strong> — separates global Unity function calls into individual lines. This tends to make profiled data more difficult to read, but helps to: understand how the Unity Engine works, count how many times a particular global method has been invoked, and determine if one of these calls is costing more CPU/Memory than expected.</p>
</div>
</div>

### 3.3. 🔑 Metric vàng: Xác định CPU-bound hay GPU-bound

<div class="bilingual-row">
<div class="col-vi">
<p>Profiler phát ra các marker tiền tố <code>Gfx</code> để tiết lộ ai đang chờ ai:</p>
<ul>
<li><strong><code>Gfx.WaitForCommands</code></strong> → Render thread đã <em>sẵn sàng</em> nhưng phải <strong>chờ Main Thread</strong> gửi lệnh. ⇒ Bạn đang <strong>CPU-bound</strong>. Đi tối ưu script, physics, animation, GC.</li>
<li><strong><code>Gfx.WaitForPresent</code></strong> → Main thread đã <em>sẵn sàng</em> nhưng phải <strong>chờ GPU</strong> trình bày frame. ⇒ Bạn đang <strong>GPU-bound</strong>. Đi tối ưu shader, overdraw, fill rate, độ phân giải, số draw call.</li>
</ul>
<p>Đây là bước chẩn đoán quan trọng nhất — làm sai bước này bạn sẽ tối ưu nhầm phía và tốn hàng tuần vô ích.</p>
</div>
<div class="col-en">
<p>The Profiler emits markers prefixed with <code>Gfx</code> that reveal who is waiting on whom:</p>
<ul>
<li><strong><code>Gfx.WaitForCommands</code></strong> → The render thread is <em>ready</em>, but you might be <strong>waiting for a bottleneck on the main thread</strong>. ⇒ You are <strong>CPU-bound</strong>. Optimize scripts, physics, animation, GC.</li>
<li><strong><code>Gfx.WaitForPresent</code></strong> → The main thread was <em>ready</em> but was <strong>waiting for the GPU</strong> to present the frame. ⇒ You are <strong>GPU-bound</strong>. Optimize shaders, overdraw, fill rate, resolution, draw call count.</li>
</ul>
<p>This is the single most important diagnostic step — getting it wrong means optimizing the wrong side and wasting weeks.</p>
</div>
</div>

### 3.4. Deep Profiling

<div class="bilingual-row">
<div class="col-vi">
<p>Bật <strong>Deep Profiling</strong> để Unity đo <em>điểm bắt đầu và kết thúc của MỌI lời gọi hàm</em> trong code script, chỉ đích danh phần nào gây chậm.</p>
<p>⚠️ <strong>Cảnh báo:</strong> Deep Profiling tạo overhead khổng lồ, làm sai lệch số liệu tuyệt đối. Chỉ dùng để <em>khoanh vùng tương đối</em>, sau đó tắt đi và đo lại bằng <code>ProfilerMarker</code> thủ công.</p>
</div>
<div class="col-en">
<p>Enable <strong>Deep Profiling</strong> and Unity will profile <em>the beginning and end of every function call</em> in your script code, to tell you exactly which part of your application is causing a slowdown.</p>
<p>⚠️ <strong>Warning:</strong> Deep Profiling adds enormous overhead and distorts absolute numbers. Use it only to <em>narrow down relatively</em>, then turn it off and re-measure with manual <code>ProfilerMarker</code>s.</p>
</div>
</div>

```csharp
// ProfilerMarker thủ công — chính xác hơn Deep Profiling rất nhiều
// Manual ProfilerMarker — far more accurate than Deep Profiling
using Unity.Profiling;
using UnityEngine;

public class EnemyAI : MonoBehaviour
{
    // static readonly: tạo 1 lần, không sinh rác
    static readonly ProfilerMarker s_PathfindMarker =
        new ProfilerMarker("EnemyAI.Pathfind");

    void Update()
    {
        using (s_PathfindMarker.Auto())   // tự động Begin/End
        {
            Pathfind();
        }
    }

    void Pathfind() { /* ... */ }
}
```

---

## 4. Build để Profiling & Profiling trên thiết bị thật

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Profiling trong Editor là KHÔNG chính xác.</strong> Editor tự nó tiêu tốn CPU/RAM và làm nhiễu số liệu. Muốn dữ liệu đáng tin, phải tạo build riêng.</p>
<p><strong>Cách làm:</strong> Trong <code>Build Settings</code>, bật:</p>
<ul>
<li>☑️ <strong>Development Build</strong></li>
<li>☑️ <strong>Autoconnect Profiler</strong> (hoặc kết nối thủ công để app khởi động nhanh hơn)</li>
</ul>
<p><strong>Kết nối thiết bị ngoài:</strong> Cách dễ nhất là cho 2 máy dùng chung mạng LAN. Chọn thiết bị trong dropdown "Editor" của Profiler / Frame Debugger / Console. Trên mobile cũng có thể profile qua cáp USB.</p>
<p>Profile trên cả máy <strong>cấu hình cao nhất và thấp nhất</strong> mà bạn dự định hỗ trợ.</p>
</div>
<div class="col-en">
<p><strong>Profiling in the Editor is NOT accurate.</strong> The editor itself affects the performance of the project and the profiling information can be inaccurate. For accurate data, a separate build should be created.</p>
<p><strong>How:</strong> In <code>Build Settings</code>, enable:</p>
<ul>
<li>☑️ <strong>Development Build</strong></li>
<li>☑️ <strong>Autoconnect Profiler</strong> (or connect manually to accelerate app startup time)</li>
</ul>
<p><strong>Connecting external devices:</strong> The easiest way is to have the two devices share the same local network. Select the device in the "Editor" dropdown menu of the Profiler, Frame Debugger or Console. Mobile devices can also be profiled through a USB cable.</p>
<p>Remember to profile and optimize for both the <strong>highest- and lowest-spec devices</strong> that you plan to support.</p>
</div>
</div>

### 4.1. ⚠️ Quy tắc nhiệt độ khi profiling mobile

<div class="bilingual-row">
<div class="col-vi">
<p>Trên mobile, <strong>hiệu năng tỉ lệ nghịch trực tiếp với nhiệt độ máy</strong>. Máy vừa bật → hiệu năng đỉnh. Máy nóng lên → hiệu năng tụt vì hệ thống tự làm mát. Máy nguội lại → hiệu năng hồi phục.</p>
<p><strong>Hai trường phái (cả hai đều đúng, tùy mục tiêu):</strong></p>
<ul>
<li><strong>Đo trải nghiệm thực tế:</strong> Cho build chạy <strong>10 phút</strong> để máy nóng đúng mức người dùng thật gặp, rồi mới đo. Số liệu lúc này mới phản ánh trải nghiệm thật.</li>
<li><strong>Đo để so sánh A/B:</strong> Profile theo từng <em>đợt ngắn</em>, giữ máy nguội <strong>10–15 phút</strong> giữa các lần đo, để nhiệt độ không làm nhiễu phép so sánh.</li>
</ul>
<p>👉 Nếu máy đang nóng, Profiler có thể báo hiệu năng tệ mà thực chất không phải vấn đề dài hạn.</p>
</div>
<div class="col-en">
<p>On mobile, <strong>performance is directly comparable to the heat level of the device</strong>. Device just turned on → performance at its best. Once warmed up, performance starts to fall as the device tries to cool itself. Once cooled down, performance improves again.</p>
<p><strong>Two schools (both valid, depending on your goal):</strong></p>
<ul>
<li><strong>Measuring real experience:</strong> Let the build run for <strong>10 minutes</strong> so the device warms up as a real user's would, then profile. Only then is the data applicable to actual user experience.</li>
<li><strong>Measuring for A/B comparison:</strong> Profile in <em>short bursts</em>, keeping the device cool for <strong>10–15 minutes</strong> between runs, so temperature doesn't contaminate the comparison.</li>
</ul>
<p>👉 If the device is running hot, the Profiler might perceive and report poor performance even if it is not cause for long-term concern.</p>
</div>
</div>

### 4.2. Công cụ profiling native theo nền tảng

| Platform | Tools |
|---|---|
| **iOS** | Xcode + Instruments |
| **Android** | Android Studio + Android Profiler |
| **Arm GPU** | Arm Mobile Studio |
| **Intel** | Intel VTune |
| **Qualcomm** | Snapdragon Profiler |

---

## 5. Profile Analyzer — Từ 1 frame lên hàng nghìn frame

<img src="../assets/profile-analyzer.png" alt="Profile Analyzer">
<p><em>VI: Profile Analyzer bổ trợ Profiler, cho phép phân tích sâu nhiều frame và dữ liệu marker. / EN: Take an even deeper dive into frames and marker data with the Profile Analyzer, which complements the existing Profiler.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p>Unity Profiler chỉ phân tích <strong>một frame</strong> tại một thời điểm. <strong>Profile Analyzer</strong> (package) mở rộng khả năng đó ra <strong>nhiều frame cùng lúc</strong>.</p>
<p><strong>Khi nào cần dùng:</strong></p>
<ul>
<li>Nâng cấp phiên bản Unity (so sánh trước/sau).</li>
<li>Kiểm chứng lợi ích của một tối ưu.</li>
<li>Theo dõi hiệu năng như một phần của chu trình phát triển.</li>
</ul>
<p><strong>Dữ liệu thống kê cho mỗi marker:</strong> minimum, maximum, mean (trung bình), instance count (số lần xuất hiện), range (biên độ), và frame đầu tiên marker xuất hiện. Hiển thị dạng <em>histogram</em> và <em>box-and-whisker plot</em>.</p>
<p><strong>Compare view:</strong> nạp 2 bộ dữ liệu cùng lúc để đo chính xác tác động của một thay đổi. Có hệ thống filter đầy đủ theo marker, thread, frame, và stack depth.</p>
<p><strong>Cài đặt (Unity 2018.3+):</strong> <code>Window &gt; Package Manager</code> → nếu không thấy, mở dropdown "Advanced" và bật "Show Preview Packages" → chọn "Profile Analyzer" → Install → mở tại <code>Window &gt; Analysis &gt; Profile Analyzer</code>.</p>
</div>
<div class="col-en">
<p>The Unity Profiler analyzes <strong>a single frame</strong> at a time. The <strong>Profile Analyzer</strong> package extends this by adding the ability to <strong>analyze multiple frames at once</strong>.</p>
<p><strong>When it's useful:</strong></p>
<ul>
<li>Upgrading Unity versions.</li>
<li>Testing optimization benefits.</li>
<li>Tracking performance as part of your development cycle.</li>
</ul>
<p><strong>Per-marker statistics:</strong> minimum, maximum, mean, instance count, range, and which frame the marker first appeared in. Summarized and graphed using <em>histograms</em> and <em>box-and-whisker plots</em>.</p>
<p><strong>Compare view:</strong> lets you load two data sets at once to measure the effect of an optimization, settings change, or Unity version update. A comprehensive filtering system is available in both Single and Compare views to limit analysis by marker, thread, frame, and stack depth.</p>
<p><strong>Install (Unity 2018.3+):</strong> <code>Window &gt; Package Manager</code> → if not listed, open the "Advanced" drop-down and enable "Show Preview Packages" → select "Profile Analyzer" → Install → open at <code>Window &gt; Analysis &gt; Profile Analyzer</code>.</p>
</div>
</div>

!!! info "Highlights Module (Unity 2023.2+)"
    **VI:** Module **Highlights** hiển thị ngay: ứng dụng có đạt frame rate mục tiêu không, đang bị giới hạn bởi CPU hay GPU, và nên bắt đầu điều tra từ đâu. Module này **không bật mặc định** — mở Profiler window → dropdown "Profiler Modules" → tick "Highlights".

    **EN:** The **Highlights** module displays whether your application is meeting its target frame rate, whether performance is bound by the CPU or GPU, and where to begin investigating. It is **not enabled by default** — open the Profiler window → "Profiler Modules" drop-down → toggle Highlights on.

---

## 6. Memory Profiler 1.0.0 — Toàn cảnh bộ nhớ

<img src="../assets/memory-profiler-snapshot.png" alt="Memory Profiler snapshot">
<p><em>VI: Chụp, kiểm tra và so sánh snapshot trong Memory Profiler. / EN: Capture, inspect, and compare snapshots in the Memory Profiler.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Memory Profiler</strong> chụp <em>snapshot</em> bộ nhớ của game tại một thời điểm cụ thể, giúp bạn thấy cái gì đang chiếm nhiều bộ nhớ nhất và phát hiện vấn đề gây crash.</p>
<p><strong>Cột mốc:</strong> Từ tháng 9/2022, package chuyển từ <em>Experimental</em> sang <em>Verified</em>, khả dụng cho mọi người dùng Unity 2022.2 Tech Stream.</p>
<p>⚠️ <strong>Lưu ý phiên bản:</strong> Tính năng đầy đủ và memory tracking chỉ có từ 2022.2 trở đi. Tuy nhiên bạn <em>vẫn có thể</em> dùng UI mới để soi snapshot cũ: mở Memory Profiler trong một project 2022+ trống rồi import snapshot cũ vào.</p>
<p><strong>Tại sao quan trọng:</strong> Tối ưu bộ nhớ là sống còn với thiết bị cấu hình giới hạn — để tránh crash Out-Of-Memory. Nếu ship đa nền tảng, memory footprint cần tinh chỉnh riêng cho từng platform.</p>
</div>
<div class="col-en">
<p>The <strong>Memory Profiler</strong> takes a <em>snapshot</em> of your game and lets you review memory usage at a specific moment in time, so you can see what is occupying most of its memory or identify problems that might cause applications to crash.</p>
<p><strong>Milestone:</strong> As of September 2022, the Memory Profiler package moved from <em>Experimental</em> to <em>Verified</em> and is accessible for everyone using the Unity 2022.2 Tech Stream.</p>
<p>⚠️ <strong>Version note:</strong> Complete features and memory tracking are only available for 2022.2 onwards. However, you <em>can</em> take advantage of the new UI to inspect older captures by opening Memory Profiler in an empty 2022+ project and importing older snapshots.</p>
<p><strong>Why it matters:</strong> Optimizing memory is crucial for applications that run on devices with limited capabilities in order to prevent them from crashing out of memory. If you're shipping on multiple devices, your memory footprint might need fine tuning to get the best out of each platform.</p>
</div>
</div>

### 6.1. Cấu trúc 3 phần của Memory Profiler

<div class="bilingual-row">
<div class="col-vi">
<p>Memory Profiler gồm 3 khu vực chính:</p>
<ol>
<li><strong>Snapshot list</strong> — danh sách snapshot</li>
<li><strong>Main section</strong> — chia thành 3 view: Summary, Unity Objects, All of Memory</li>
<li><strong>Selection Details</strong> — chi tiết mục đang chọn</li>
</ol>
</div>
<div class="col-en">
<p>Memory Profiler consists of three main sections:</p>
<ol>
<li><strong>Snapshot list</strong></li>
<li><strong>A Main section</strong>, itself divided into three workflow views: Summary, Unity Objects, and All of Memory</li>
<li><strong>Selection Details</strong></li>
</ol>
</div>
</div>

#### ① Snapshot List

<img src="../assets/memprof-snapshot-list.png" alt="Memory Profiler snapshot list">

<div class="bilingual-row">
<div class="col-vi">
<p>Nơi bạn chụp và xem các snapshot đã lấy, kèm thông tin tổng quan về mức dùng bộ nhớ và thời điểm chụp.</p>
<p>Chụp bằng nút <strong>"Capture"</strong> trên toolbar, hoặc — nếu chưa có snapshot nào — bằng nút snapshot ở Main section.</p>
<p>Bạn thấy được bộ nhớ có thay đổi giữa các snapshot hay không, từ đó cảm nhận dự án đang tốt lên hay xấu đi.</p>
<p>Đây cũng là nơi chọn chế độ xem <strong>1 snapshot</strong> hay <strong>so sánh 2 snapshot</strong>.</p>
</div>
<div class="col-en">
<p>The area where you capture and see snapshots taken in your game, along with high-level information about memory usage and date of capture.</p>
<p>Capture snapshots with the <strong>"Capture"</strong> button in the toolbar or — if no snapshot is available — through the snapshot button in the Main section.</p>
<p>You can also see whether memory usage is changing across snapshots and get a sense of whether project performance is improving or not.</p>
<p>Use the Snapshot list to select whether you want to look at single snapshots or compared snapshots.</p>
</div>
</div>

#### ② Summary View

<img src="../assets/memprof-summary-view.png" alt="Memory Profiler Summary view">

<div class="bilingual-row">
<div class="col-vi">
<p>View mặc định khi mở/chụp snapshot. Cung cấp:</p>
<ul>
<li>Bạn đang dùng bao nhiêu bộ nhớ.</li>
<li>Bao nhiêu là <strong>resident</strong> (thực sự nằm trên thiết bị).</li>
<li>Bao nhiêu là <strong>committed</strong> nhưng hiện <em>không</em> nằm trên thiết bị.</li>
<li>Bộ nhớ phân bố ra sao theo từng category — giúp chọn điểm bắt đầu điều tra.</li>
</ul>
<p>Đồng thời có các entry point cho phân tích sâu hơn: <strong>"Top Unity Objects in Memory"</strong> và <strong>"Managed memory breakdown"</strong>.</p>
</div>
<div class="col-en">
<p>The default view when you load or capture a snapshot. It provides:</p>
<ul>
<li>How much memory you are using.</li>
<li>How much is <strong>resident</strong> on the device.</li>
<li>How much is <strong>committed</strong> but <em>not</em> currently on device.</li>
<li>How memory is distributed across categories, to simplify choosing where to start your investigation.</li>
</ul>
<p>It also provides entry points for more detailed analysis, such as <strong>"Top Unity Objects in Memory"</strong> and the <strong>"Managed memory breakdown"</strong>.</p>
</div>
</div>

#### ③ Unity Objects View

<img src="../assets/memprof-unity-objects.png" alt="Memory Profiler Unity Objects view">

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Đây là nơi bạn sẽ dành nhiều thời gian nhất.</strong></p>
<p>Liệt kê toàn bộ các loại object đang nạp trong bộ nhớ: textures, shaders, fonts, v.v.</p>
<p>Thường đây là chỗ bạn phát hiện những object:</p>
<ul>
<li>Quá lớn (texture khổng lồ, audio clip chưa nén).</li>
<li>Không cần có mặt — bị nạp nhầm.</li>
<li>Bị giữ lại trong bộ nhớ bởi một <em>hanging reference</em> (tham chiếu treo) — nguyên nhân kinh điển của memory leak.</li>
</ul>
<p>Trong Tree Map view, click để truy vết một biến ngược về native object đang giữ bộ nhớ, từ đó phát hiện texture quá lớn hoặc asset bị trùng lặp.</p>
</div>
<div class="col-en">
<p><strong>This is where you will likely spend the most time.</strong></p>
<p>It lists all the main types of objects loaded in memory, such as textures, shaders, fonts, and so on.</p>
<p>Usually, this is where you identify objects that:</p>
<ul>
<li>Are too big.</li>
<li>Don't need to be there because they have been loaded mistakenly.</li>
<li>Were kept in memory by some <em>hanging reference</em> — the classic cause of memory leaks.</li>
</ul>
<p>In the Tree Map view, click to trace a variable to the native object holding onto memory. Here you can identify common memory consumption issues, like excessively large textures or duplicate assets.</p>
</div>
</div>

#### ④ All of Memory View

<img src="../assets/memprof-all-of-memory.png" alt="Memory Profiler All of Memory view">

<div class="bilingual-row">
<div class="col-vi">
<p>Cho phép nhìn <strong>toàn bộ</strong> bộ nhớ, chia theo 4 category:</p>
<ul>
<li><strong>Native</strong> — bộ nhớ engine C++ (assets, GameObjects, components).</li>
<li><strong>Managed</strong> — managed heap của C# (nơi GC hoạt động).</li>
<li><strong>Graphics</strong> — VRAM (textures, meshes, render targets).</li>
<li><strong>Executables</strong> — mã thực thi và thư viện đã nạp.</li>
</ul>
<p>Bạn xem được dữ liệu Memory Profiler thu thập và đi sâu vào từng khía cạnh cụ thể cấu thành bộ nhớ dự án.</p>
</div>
<div class="col-en">
<p>Enables you to see <strong>all</strong> memory, divided by category:</p>
<ul>
<li><strong>Native</strong> — C++ engine memory (assets, GameObjects, components).</li>
<li><strong>Managed</strong> — the C# managed heap (where the GC operates).</li>
<li><strong>Graphics</strong> — VRAM (textures, meshes, render targets).</li>
<li><strong>Executables</strong> — executable code and loaded libraries.</li>
</ul>
<p>You can see the data captured by the Memory Profiler and investigate more specific aspects to see what is composing your project's memory.</p>
</div>
</div>

#### ⑤ Selection Details

<img src="../assets/memprof-selection-details.png" alt="Memory Profiler Selection Details">

<div class="bilingual-row">
<div class="col-vi">
<p>Cung cấp thông tin chi tiết về mục đang chọn ở Main section: mô tả từng category bộ nhớ, các tham chiếu tiềm năng (potential references), và chi tiết object.</p>
<p>Phần này giúp bạn hiểu <strong>tại sao</strong> object đó lại nằm trong bộ nhớ.</p>
<p>👉 Nếu project đang mở trong Editor, bạn có thể <strong>"ping"</strong> object và kiểm tra asset trực tiếp trong cửa sổ Scene hoặc Project.</p>
</div>
<div class="col-en">
<p>Offers more information about items selected in the Main section, including descriptions of different categories of memory and potential references or details of selected objects.</p>
<p>This section helps you understand <strong>why</strong> an object is in memory.</p>
<p>👉 If you have the project open in the Editor, you can <strong>"ping"</strong> objects and inspect assets directly in the Scene or Project window.</p>
</div>
</div>

### 6.2. So sánh Snapshot (Compare Mode) — Vũ khí săn Memory Leak

<img src="../assets/memprof-compare.png" alt="Memory Profiler Compare mode">

<div class="bilingual-row">
<div class="col-vi">
<p>Mọi view ở trên đều dùng được cho cả 1 snapshot lẫn chế độ so sánh.</p>
<p><strong>Cách dùng:</strong> chọn <strong>"Compare"</strong> trong snapshot list, rồi chọn snapshot thứ hai. Vào tab compare sẽ tự động chuyển mọi view sang Compare mode.</p>
<ul>
<li><strong>Summary view</strong> hiển thị breakdown của 2 bản chụp cạnh nhau (đặt tên "A" và "B") để thấy khác biệt chính.</li>
<li><strong>Unity Objects</strong> và <strong>All of Memory</strong> có UI riêng cho biết mỗi category đã thay đổi kích thước hoặc số lượng object ra sao. Chọn một category ở bảng trên → xem chênh lệch chi tiết A/B ở các bảng dưới.</li>
</ul>
<p>Quay lại xem đơn lẻ bằng cách chọn <strong>"Single"</strong>. Snapshot thứ hai vẫn được giữ nạp ngầm để bạn chuyển qua lại nhanh.</p>
<p>💡 <strong>Quy trình săn leak:</strong> Snapshot A ở Main Menu → vào gameplay → thoát về Main Menu → Snapshot B → Compare. Bất cứ thứ gì tăng lên mà lẽ ra phải được giải phóng chính là leak.</p>
</div>
<div class="col-en">
<p>Each view above is available for inspecting single snapshots or for comparing them.</p>
<p><strong>How:</strong> select <strong>"Compare"</strong> in the snapshot list, then select a second snapshot. Being in the compare tab automatically turns all views into Compare mode.</p>
<ul>
<li><strong>Summary view</strong> provides the two captures' memory breakdown side by side (named "A" and "B") so you can see the main differences.</li>
<li><strong>Unity Objects</strong> and <strong>All of Memory</strong> have a dedicated UI showing how different memory categories changed in size or in the number of objects contained. Select a category in the top table to inspect individual differences for A and B in the tables below.</li>
</ul>
<p>Go back to a single snapshot by selecting <strong>"Single"</strong>. The second snapshot stays latently loaded so you can quickly switch between the two.</p>
<p>💡 <strong>Leak-hunting workflow:</strong> Snapshot A at Main Menu → enter gameplay → return to Main Menu → Snapshot B → Compare. Anything that grew but should have been released is your leak.</p>
</div>
</div>

---

## 7. Garbage Collection — Kẻ thù số 1 của Frame Time

<div class="bilingual-row">
<div class="col-vi">
<p>Unity dùng quản lý bộ nhớ tự động cho code do bạn viết:</p>
<ul>
<li>Dữ liệu nhỏ, biến local kiểu value → cấp phát trên <strong>stack</strong> (rẻ, tự động thu hồi).</li>
<li>Dữ liệu lớn, lưu trữ dài hạn → cấp phát trên <strong>managed heap</strong>.</li>
</ul>
<p>Garbage collector định kỳ xác định và giải phóng vùng heap không dùng. Việc này tự động, <strong>nhưng quá trình duyệt toàn bộ object trong heap khiến game khựng hoặc chạy chậm.</strong></p>
<p>Unity dùng <strong>Boehm–Demers–Weiser garbage collector</strong> — loại <em>stop-the-world</em>: nó <strong>dừng hẳn code của bạn</strong> và chỉ cho chạy tiếp khi đã xong việc.</p>
<p>👉 Tối ưu bộ nhớ = ý thức rõ <em>khi nào</em> bạn cấp phát/giải phóng heap, và <em>giảm thiểu</em> ảnh hưởng của GC.</p>
</div>
<div class="col-en">
<p>Unity employs automatic memory management for your user-generated code:</p>
<ul>
<li>Small pieces of data, like value-typed local variables, are allocated to the <strong>stack</strong>.</li>
<li>Larger pieces of data and longer-term storage are allocated to the <strong>managed heap</strong>.</li>
</ul>
<p>The garbage collector periodically identifies and deallocates unused heap memory. While this runs automatically, <strong>the process of examining all the objects in the heap can cause the game to stutter or run slowly.</strong></p>
<p>Unity uses the <strong>Boehm–Demers–Weiser garbage collector</strong>, which is <em>stop-the-world</em>: it <strong>stops running your program code</strong> and only resumes normal execution once its work is complete.</p>
<p>👉 Optimizing memory means being conscious of <em>when</em> you allocate and deallocate heap memory, and how you <em>minimize</em> the effect of garbage collection.</p>
</div>
</div>

### 7.1. 🚨 5 nguồn sinh rác cần loại bỏ / 5 sources of unnecessary heap allocation

<div class="bilingual-row">
<div class="col-vi">
<p><strong>① STRINGS</strong> — Trong C#, string là <em>reference type</em>, không phải value type. Mỗi lần nối chuỗi là tạo object mới.</p>
<ul>
<li>Giảm tối đa việc tạo/xử lý chuỗi.</li>
<li>Tránh parse file dữ liệu dạng chuỗi như JSON, XML lúc runtime.</li>
<li>Thay bằng <strong>ScriptableObject</strong>, hoặc định dạng <strong>MessagePack</strong> / <strong>Protobuf</strong>.</li>
<li>Dùng <code>StringBuilder</code> nếu buộc phải dựng chuỗi lúc runtime.</li>
</ul>
</div>
<div class="col-en">
<p><strong>① STRINGS</strong> — In C#, strings are reference types, not value types. Every concatenation creates a new object.</p>
<ul>
<li>Reduce unnecessary string creation or manipulation.</li>
<li>Avoid parsing string-based data files such as JSON and XML at runtime.</li>
<li>Store data in <strong>ScriptableObjects</strong> or formats like <strong>MessagePack</strong> or <strong>Protobuf</strong> instead.</li>
<li>Use the <code>StringBuilder</code> class if you need to build strings at runtime.</li>
</ul>
</div>
</div>

```csharp
// ❌ SAI — sinh 1 object rác MỖI FRAME (60 object/giây!)
// WRONG — allocates one garbage object EVERY FRAME
private void Update()
{
    timerCount += Time.deltaTime;
    timerTxt.text = "Time: " + (int)timerCount;   // string concat = new object
}
```

```csharp
// ✅ ĐÚNG — StringBuilder tái sử dụng buffer, không sinh rác
// CORRECT — StringBuilder reuses its buffer, no allocation
using System.Text;
using UnityEngine;
using UnityEngine.UI;

public class TimerDisplay : MonoBehaviour
{
    [SerializeField] private Text timerTxt;
    private float timerCount;
    private readonly StringBuilder timerTxtBuilder = new StringBuilder();

    private void Update() => CountTime();

    void CountTime()
    {
        timerCount += Time.deltaTime;
        timerTxtBuilder.Length = 0;          // reset, KHÔNG cấp phát mới
        timerTxtBuilder.Append("Time: ");
        timerTxtBuilder.Append((int)timerCount);
        timerTxt.text = timerTxtBuilder.ToString();
    }
}
```

<div class="bilingual-row">
<div class="col-vi">
<p><strong>② UNITY FUNCTION CALLS</strong> — Một số hàm Unity cấp phát heap khi được gọi.</p>
<ul>
<li>Cache tham chiếu tới mảng thay vì cấp phát chúng giữa vòng lặp.</li>
<li>Tận dụng các hàm không sinh rác. Ví dụ kinh điển: dùng <code>GameObject.CompareTag</code> thay vì so sánh chuỗi thủ công với <code>GameObject.tag</code> — vì <code>.tag</code> trả về một string mới ⇒ sinh rác.</li>
</ul>
</div>
<div class="col-en">
<p><strong>② UNITY FUNCTION CALLS</strong> — Some functions create heap allocations.</p>
<ul>
<li>Cache references to arrays rather than allocating them in the middle of a loop.</li>
<li>Take advantage of functions that avoid generating garbage. Classic example: use <code>GameObject.CompareTag</code> instead of manually comparing a string with <code>GameObject.tag</code> — returning a new string creates garbage.</li>
</ul>
</div>
</div>

```csharp
// ❌ SAI — collision.tag cấp phát một string mới mỗi lần va chạm
private void OnTriggerEnter2D(Collider2D collision)
{
    if (collision.tag == "Player") { /* ... */ }
}

// ✅ ĐÚNG — CompareTag so sánh nội bộ, zero allocation
private void OnTriggerEnter2D(Collider2D collision)
{
    if (collision.CompareTag("Player")) { /* ... */ }
}

// ❌ SAI — "" tạo string instance mới
private string playerName = "";
// ✅ ĐÚNG — string.Empty là hằng số dùng chung
private string playerName = string.Empty;
```

<div class="bilingual-row">
<div class="col-vi">
<p><strong>③ BOXING (Đóng hộp)</strong> — Truyền một biến value-type vào chỗ mong đợi reference-type. Việc này tạo object tạm và ngầm chuyển value type thành object.</p>
<p>Ví dụ: <code>int i = 123; object o = i;</code></p>
<p><strong>Giải pháp:</strong> cung cấp overload cụ thể cho đúng value type bạn muốn truyền, hoặc dùng <strong>Generics</strong> cho các overload đó.</p>
</div>
<div class="col-en">
<p><strong>③ BOXING</strong> — Passing a value-typed variable in place of a reference-typed variable. This creates a temporary object and implicitly converts the value type to a type object.</p>
<p>Example: <code>int i = 123; object o = i;</code></p>
<p><strong>Fix:</strong> provide concrete overrides with the value type you want to pass in. Generics can also be used for these overrides.</p>
</div>
</div>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>④ COROUTINES</strong> — Bản thân <code>yield</code> KHÔNG sinh rác, nhưng <code>new WaitForSeconds(...)</code> thì CÓ.</p>
<p><strong>Giải pháp:</strong> cache và tái dùng object <code>WaitForSeconds</code> thay vì tạo mới ngay trên dòng <code>yield</code>.</p>
</div>
<div class="col-en">
<p><strong>④ COROUTINES</strong> — Though <code>yield</code> does not produce garbage, creating a <code>new WaitForSeconds</code> object does.</p>
<p><strong>Fix:</strong> cache and reuse the <code>WaitForSeconds</code> object rather than creating it in the yield line.</p>
</div>
</div>

```csharp
// ❌ SAI — cấp phát WaitForSeconds mới mỗi vòng lặp
IEnumerator SpawnLoopBad()
{
    while (true)
    {
        Spawn();
        yield return new WaitForSeconds(1f);   // GC Alloc mỗi giây
    }
}

// ✅ ĐÚNG — cache 1 lần, tái sử dụng vô hạn
private readonly WaitForSeconds _wait1s = new WaitForSeconds(1f);

IEnumerator SpawnLoopGood()
{
    while (true)
    {
        Spawn();
        yield return _wait1s;                  // 0 B GC Alloc
    }
}
```

<div class="bilingual-row">
<div class="col-vi">
<p><strong>⑤ LINQ &amp; REGULAR EXPRESSIONS</strong> — Cả hai đều sinh rác từ việc boxing diễn ra ngầm bên dưới.</p>
<p>Tránh dùng LINQ và Regex ở các đoạn nóng nếu hiệu năng là vấn đề. Viết vòng <code>for</code> thủ công và dùng <code>List</code> thay vì tạo mảng mới.</p>
</div>
<div class="col-en">
<p><strong>⑤ LINQ &amp; REGULAR EXPRESSIONS</strong> — Both generate garbage from behind-the-scenes boxing.</p>
<p>Avoid LINQ and Regular Expressions in hot paths if performance is an issue. Write <code>for</code> loops and use lists as an alternative to creating new arrays.</p>
</div>
</div>

### 7.2. Incremental Garbage Collector

<img src="../assets/incremental-gc.png" alt="Incremental Garbage Collector setting">
<p><em>VI: Bật Incremental GC để giảm GC spike. / EN: Use the Incremental Garbage Collector to reduce GC spikes.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p>Thay vì tạo <strong>một</strong> gián đoạn dài duy nhất, Incremental GC dùng <strong>nhiều</strong> gián đoạn ngắn hơn nhiều, trải khối lượng công việc ra qua nhiều frame.</p>
<p>Nếu GC đang ảnh hưởng hiệu năng, hãy bật tùy chọn này. <strong>Rồi dùng Profile Analyzer để kiểm chứng nó có thực sự có lợi cho ứng dụng của bạn hay không</strong> — nó không phải lúc nào cũng thắng.</p>
<p><strong>Vị trí:</strong> <code>Edit &gt; Project Settings &gt; Player &gt; Other Settings &gt; Use Incremental GC</code>.</p>
</div>
<div class="col-en">
<p>Rather than creating a single, long interruption during your program's execution, incremental garbage collection uses multiple, much shorter interruptions that distribute the workload over many frames.</p>
<p>If garbage collection is impacting performance, try enabling this option. <strong>Use the Profile Analyzer to verify its benefit to your application</strong> — it is not always a win.</p>
<p><strong>Location:</strong> <code>Edit &gt; Project Settings &gt; Player &gt; Other Settings &gt; Use Incremental GC</code>.</p>
</div>
</div>

### 7.3. Chủ động kích hoạt GC / Timing garbage collection

<div class="bilingual-row">
<div class="col-vi">
<p>Nếu bạn <strong>chắc chắn</strong> rằng một lần đóng băng do GC sẽ không ảnh hưởng tới một thời điểm cụ thể trong game (màn hình loading, cutscene, menu pause), bạn có thể chủ động gọi GC.</p>
</div>
<div class="col-en">
<p>If you are certain that a garbage collection freeze won't affect a specific point in your game (loading screen, cutscene, pause menu), you can trigger garbage collection yourself.</p>
</div>
</div>

```csharp
// Gọi GC ở nơi an toàn — ví dụ sau khi unload scene
// Trigger GC at a safe point — e.g. after unloading a scene
System.GC.Collect();
Resources.UnloadUnusedAssets();   // giải phóng native assets không còn tham chiếu
```

---

## 8. PlayerLoop & Kiến trúc Code

<img src="../assets/playerloop-profiler.png" alt="PlayerLoop in Profiler">
<p><em>VI: Profiler hiển thị script, settings và graphics của bạn trong bối cảnh thực thi của toàn engine. / EN: The Profiler shows your custom scripts, settings, and graphics in the context of the entire engine's execution.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Unity PlayerLoop</strong> chứa các hàm tương tác với lõi engine — bao gồm nhiều hệ thống xử lý khởi tạo và cập nhật mỗi frame. Mọi script của bạn đều dựa vào PlayerLoop để tạo nên gameplay.</p>
<p>Khi profiling, code của bạn nằm dưới <strong>PlayerLoop</strong>; các thành phần Editor nằm dưới <strong>EditorLoop</strong>.</p>
<p>Bạn phải hiểu rõ thứ tự thực thi của frame loop: sự khác nhau giữa <code>Awake</code>, <code>OnEnable</code>, <code>Start</code>, <code>Update</code>, <code>FixedUpdate</code>, <code>LateUpdate</code>. Tham khảo <em>Script Lifecycle Flowchart</em> trong tài liệu Unity.</p>
</div>
<div class="col-en">
<p>The <strong>Unity PlayerLoop</strong> contains functions for interacting with the core of the game engine, including systems that handle initialization and per-frame updates. All of your scripts rely on this PlayerLoop to create gameplay.</p>
<p>When profiling, your project's user code appears under the <strong>PlayerLoop</strong>, with Editor components under the <strong>EditorLoop</strong>.</p>
<p>Make sure you understand the execution order of Unity's frame loop — the difference between <code>Awake</code>, <code>OnEnable</code>, <code>Start</code>, <code>Update</code>, <code>FixedUpdate</code>, and <code>LateUpdate</code>. Refer to the <em>Script Lifecycle Flowchart</em> in the Unity documentation.</p>
</div>
</div>

### 8.1. Time Slicing — Giảm code chạy mỗi frame

<div class="bilingual-row">
<div class="col-vi">
<p>Hãy tự hỏi: <strong>code này có THỰC SỰ cần chạy mỗi frame không?</strong></p>
<p>Dời logic không cần thiết ra khỏi <code>Update</code>, <code>LateUpdate</code>, <code>FixedUpdate</code>. Khi có thể, chỉ chạy logic khi có thứ gì đó <em>thay đổi</em> (event-driven thay vì polling).</p>
<p>Nếu buộc phải dùng <code>Update</code>, hãy cân nhắc chạy code <strong>mỗi n frame</strong>. Đây chính là <strong>time slicing</strong> — kỹ thuật phổ biến để trải một khối lượng công việc nặng ra nhiều frame.</p>
</div>
<div class="col-en">
<p>Ask yourself: <strong>does this code REALLY need to run every frame?</strong></p>
<p>Move unnecessary logic out of <code>Update</code>, <code>LateUpdate</code>, and <code>FixedUpdate</code>. Whenever possible, only execute logic when things change (event-driven rather than polling).</p>
<p>If you do need to use <code>Update</code>, consider running the code <strong>every n frames</strong>. This is <strong>time slicing</strong> — a common technique of distributing a heavy workload across multiple frames.</p>
</div>
</div>

```csharp
// Time slicing: chạy hàm nặng 1 lần mỗi 3 frame
// Time slicing: run the expensive function once every three frames
private int interval = 3;

void Update()
{
    if (Time.frameCount % interval == 0)
    {
        ExampleExpensiveFunction();
    }
}
```

### 8.2. Caching — Không bao giờ GetComponent trong Update

<div class="bilingual-row">
<div class="col-vi">
<p><code>GameObject.Find</code>, <code>GameObject.GetComponent</code>, và <code>Camera.main</code> (ở phiên bản trước 2020.2) đều tốn kém. Tránh gọi chúng trong <code>Update</code> — hãy gọi trong <code>Start</code>/<code>Awake</code> và cache kết quả.</p>
<p>Quy tắc này áp dụng cho <em>mọi</em> loại biến: vectors, components, class tự viết — và cả float, int, bool, string.</p>
<p>⚠️ Đặc biệt lưu ý <code>transform</code>: truy cập property này thực chất gọi <code>GetComponent&lt;Transform&gt;()</code> ở tầng dưới.</p>
</div>
<div class="col-en">
<p><code>GameObject.Find</code>, <code>GameObject.GetComponent</code>, and <code>Camera.main</code> (in versions prior to 2020.2) can be expensive, so avoid calling them in <code>Update</code> methods. Call them in <code>Start</code>/<code>Awake</code> and cache the results.</p>
<p>This rule applies to <em>all</em> variable types: vectors, components, custom classes — and also floats, ints, booleans, and strings.</p>
<p>⚠️ Note especially <code>transform</code>: accessing this property internally calls <code>GetComponent&lt;Transform&gt;()</code>.</p>
</div>
</div>

```csharp
// ❌ SAI — GetComponent gọi lại mỗi frame
void Update()
{
    Renderer myRenderer = GetComponent<Renderer>();
    ExampleFunction(myRenderer);
}
```

```csharp
// ✅ ĐÚNG — cache toàn bộ ở Awake/Start
using UnityEngine;

public class CachedBehaviour : MonoBehaviour
{
    private Renderer  myRenderer;
    private Transform myTransform;
    private Camera    mainCam;
    private float     distance;      // cache cả biến value-type dùng lặp

    void Awake()
    {
        myRenderer  = GetComponent<Renderer>();
        myTransform = transform;      // tránh GetComponent<Transform> ngầm
        mainCam     = Camera.main;    // Camera.main rất đắt ở bản < 2020.2
    }

    void Update()
    {
        distance = Vector3.Distance(myTransform.position, enemyPosition);
        ExampleFunction(myRenderer);
    }
}
```

### 8.3. Awake / Start — Tránh logic nặng

<div class="bilingual-row">
<div class="col-vi">
<p>Khi scene đầu tiên nạp, các hàm sau được gọi cho <em>mỗi</em> object: <code>Awake</code> → <code>OnEnable</code> → <code>Start</code>.</p>
<p>Tránh logic đắt đỏ trong các hàm này cho tới khi ứng dụng render được frame đầu tiên. Nếu không, thời gian loading sẽ dài hơn cần thiết.</p>
</div>
<div class="col-en">
<p>When your first scene loads, these functions get called for <em>each</em> object: <code>Awake</code> → <code>OnEnable</code> → <code>Start</code>.</p>
<p>Avoid expensive logic in these functions until your application renders its first frame. Otherwise, you might encounter longer loading times than necessary.</p>
</div>
</div>

### 8.4. Xóa Unity Event rỗng & Debug.Log

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Empty Unity events:</strong> Ngay cả MonoBehaviour rỗng cũng tốn tài nguyên — Unity vẫn phải gọi qua cầu nối C++/C#. Hãy xóa các method <code>Update</code>/<code>LateUpdate</code> trống.</p>
<p>Nếu bạn cần chúng để test, dùng preprocessor directive.</p>
<p><strong>Debug.Log:</strong> Lệnh log (đặc biệt trong <code>Update</code>, <code>LateUpdate</code>, <code>FixedUpdate</code>) làm chậm hiệu năng nghiêm trọng. <strong>Tắt hết log trước khi build.</strong></p>
<p>Cách gọn nhất: tạo class wrapper với thuộc tính <code>[Conditional]</code>. Chỉ cần bỏ define <code>ENABLE_LOG</code> trong Player Settings là toàn bộ lệnh Log biến mất trong một nốt nhạc.</p>
</div>
<div class="col-en">
<p><strong>Empty Unity events:</strong> Even empty MonoBehaviours require resources — Unity still has to cross the C++/C# bridge. Remove blank <code>Update</code> or <code>LateUpdate</code> methods.</p>
<p>If you employ these methods for testing, use preprocessor directives.</p>
<p><strong>Debug.Log:</strong> Log statements (especially in <code>Update</code>, <code>LateUpdate</code>, or <code>FixedUpdate</code>) can bog down performance. <strong>Disable your Log statements before making a build.</strong></p>
<p>The cleanest way: make a wrapper class using a <code>[Conditional]</code> attribute. Disable the <code>ENABLE_LOG</code> preprocessor in Player Settings and all of your Log statements disappear in one fell swoop.</p>
</div>
</div>

<img src="../assets/preprocessor-directives.png" alt="Custom preprocessor directives in Player Settings">
<p><em>VI: Thêm preprocessor directive tùy chỉnh để phân vùng script. / EN: Adding a custom preprocessor directive lets you partition your scripts.</em></p>

```csharp
// Update chỉ tồn tại trong Editor, không lọt vào build
#if UNITY_EDITOR
void Update()
{
}
#endif
```

```csharp
// Log wrapper — tắt toàn bộ bằng 1 define
public static class Logging
{
    [System.Diagnostics.Conditional("ENABLE_LOG")]
    static public void Log(object message)
    {
        UnityEngine.Debug.Log(message);
    }
}
```

### 8.5. Hash ID thay vì string parameter

<div class="bilingual-row">
<div class="col-vi">
<p>Unity <strong>không</strong> dùng tên chuỗi để địa chỉ hóa property của Animator, Material, và Shader ở tầng nội bộ. Vì tốc độ, mọi tên property đều được <em>hash</em> thành <strong>property ID</strong>, và chính ID này mới được dùng để truy cập property.</p>
<p>Khi gọi Set/Get trên Animator, Material, hoặc Shader, hãy dùng phiên bản nhận <strong>int</strong> thay vì phiên bản nhận <strong>string</strong>. Các phương thức string chỉ đơn giản là hash chuỗi rồi chuyển tiếp ID đã hash sang phương thức int — bạn trả giá cho việc hash mỗi lần gọi.</p>
<ul>
<li><code>Animator.StringToHash</code> — cho tên property của Animator.</li>
<li><code>Shader.PropertyToID</code> — cho tên property của Material và Shader.</li>
</ul>
</div>
<div class="col-en">
<p>Unity does <strong>not</strong> use string names to address Animator, Material, and Shader properties internally. For speed, all property names are hashed into <strong>property IDs</strong>, and these IDs are actually used to address the properties.</p>
<p>When using a Set or Get method on an Animator, Material, or Shader, harness the <strong>integer-valued</strong> method instead of the <strong>string-valued</strong> methods. The string methods simply perform string hashing and then forward the hashed ID to the integer-valued methods — you pay for the hash on every call.</p>
<ul>
<li><code>Animator.StringToHash</code> — for Animator property names.</li>
<li><code>Shader.PropertyToID</code> — for Material and Shader property names.</li>
</ul>
</div>
</div>

```csharp
using UnityEngine;

public class HashedProperties : MonoBehaviour
{
    // Hash 1 lần, dùng mãi mãi — static readonly
    private static readonly int SpeedHash    = Animator.StringToHash("Speed");
    private static readonly int JumpHash     = Animator.StringToHash("Jump");
    private static readonly int BaseColorId  = Shader.PropertyToID("_BaseColor");

    [SerializeField] private Animator animator;
    private MaterialPropertyBlock mpb;
    private Renderer rend;

    void Awake()
    {
        rend = GetComponent<Renderer>();
        mpb  = new MaterialPropertyBlock();
    }

    void Update()
    {
        // ❌ animator.SetFloat("Speed", v);   ← hash lại chuỗi MỖI FRAME
        animator.SetFloat(SpeedHash, currentSpeed);   // ✅
    }

    public void SetTint(Color c)
    {
        // MaterialPropertyBlock: đổi màu KHÔNG clone material, KHÔNG phá batching
        rend.GetPropertyBlock(mpb);
        mpb.SetColor(BaseColorId, c);
        rend.SetPropertyBlock(mpb);
    }
}
```

### 8.6. Object Pooling

<img src="../assets/object-pool-hierarchy.png" alt="Object pool in hierarchy">
<p><em>VI: Pool gồm các object PlayerLaser đang tắt, sẵn sàng bắn. / EN: The pool of PlayerLaser objects is inactive and ready to shoot.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><code>Instantiate</code> và <code>Destroy</code> sinh rác, gây GC spike, và bản thân chúng vốn đã chậm.</p>
<p>Thay vì liên tục tạo/hủy GameObject (ví dụ đạn bắn ra từ súng), hãy dùng <strong>pool</strong> các object đã cấp phát sẵn để tái sử dụng và tái chế.</p>
<p><strong>Quy trình chuẩn:</strong></p>
<ol>
<li>Tạo sẵn instance ở thời điểm CPU spike ít bị nhận ra (màn hình menu, loading).</li>
<li>Theo dõi "pool" object này bằng một collection.</li>
<li>Trong gameplay: <strong>bật</strong> instance tiếp theo còn rảnh khi cần.</li>
<li><strong>Tắt</strong> object thay vì hủy, rồi trả về pool.</li>
</ol>
<p>Cách này giảm số lượng managed allocation và ngăn được các vấn đề về GC.</p>
<p>💡 <em>Lưu ý thực chiến:</em> Có developer đã dùng <code>Instantiate</code> trong gameplay ở game mobile và profile thấy vẫn chạy mượt, không tụt dưới 60 FPS. Điều đó cho thấy: <strong>luôn quay lại Profiler và số liệu thực tế</strong> thay vì tin vào giáo điều. Nhưng với thứ spawn liên tục (đạn, item nhặt), pooling vẫn luôn là lựa chọn tốt hơn.</p>
</div>
<div class="col-en">
<p><code>Instantiate</code> and <code>Destroy</code> can generate garbage and GC spikes, and are generally slow processes.</p>
<p>Rather than regularly instantiating and destroying GameObjects (e.g., shooting bullets from a gun), use <strong>pools</strong> of preallocated objects that can be reused and recycled.</p>
<p><strong>Standard workflow:</strong></p>
<ol>
<li>Create the reusable instances at a point in the game (e.g., during a menu screen) when a CPU spike is less noticeable.</li>
<li>Track this "pool" of objects with a collection.</li>
<li>During gameplay, simply <strong>enable</strong> the next available instance when needed.</li>
<li><strong>Disable</strong> objects instead of destroying them, and return them to the pool.</li>
</ol>
<p>This reduces the number of managed allocations in your project and can prevent garbage collection problems.</p>
<p>💡 <em>Field note:</em> One developer used <code>Instantiate</code> during gameplay in a mobile game and, when profiled, it ran smoothly, never going below 60 FPS. This shows you should <strong>always revert back to the Profiler and the stats you see there</strong> rather than trusting dogma. But for anything spawned constantly (bullets, collectables), pooling is still the better idea.</p>
</div>
</div>

```csharp
// Object Pool cơ bản — Basic object pool
using System.Collections.Generic;
using UnityEngine;

public class BasicPool : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private int poolSize = 20;      // ví dụ: 20 PlayerLaser

    private readonly Queue<GameObject> pool = new Queue<GameObject>();

    void Awake()
    {
        // Cấp phát sẵn ở lúc CPU spike không bị nhận ra
        for (int i = 0; i < poolSize; i++)
        {
            GameObject go = Instantiate(bulletPrefab, transform);
            go.SetActive(false);
            pool.Enqueue(go);
        }
    }

    public GameObject Get(Vector3 pos, Quaternion rot)
    {
        GameObject go = pool.Count > 0
            ? pool.Dequeue()
            : Instantiate(bulletPrefab, transform);   // fallback nếu pool cạn

        go.transform.SetPositionAndRotation(pos, rot);
        go.SetActive(true);                            // BẬT, không Instantiate
        return go;
    }

    public void Release(GameObject go)
    {
        go.SetActive(false);                           // TẮT, không Destroy
        pool.Enqueue(go);
    }
}
```

!!! tip "Unity 2021+ có pool dựng sẵn"
    **VI:** Từ Unity 2021, dùng `UnityEngine.Pool.ObjectPool<T>` trong namespace `UnityEngine.Pool` — đã tối ưu sẵn, có callback `actionOnGet` / `actionOnRelease` / `actionOnDestroy`.

    **EN:** From Unity 2021, use the built-in `UnityEngine.Pool.ObjectPool<T>` — already optimized, with `actionOnGet` / `actionOnRelease` / `actionOnDestroy` callbacks.

### 8.7. ScriptableObject & AddComponent

<img src="../assets/scriptableobject-inventory.png" alt="ScriptableObject Inventory">
<p><em>VI: ScriptableObject tên "Inventory" lưu settings cho nhiều GameObject. / EN: A ScriptableObject called Inventory holds settings for various GameObjects.</em></p>

<div class="bilingual-row">
<div class="col-vi">
<p><strong>ScriptableObject:</strong> Lưu các giá trị/cài đặt bất biến trong ScriptableObject thay vì MonoBehaviour. ScriptableObject là một <em>asset</em> nằm trong project, bạn chỉ cần thiết lập một lần và <strong>không</strong> gắn trực tiếp vào GameObject được.</p>
<p>Tạo field trong ScriptableObject để lưu giá trị, rồi tham chiếu ScriptableObject đó trong các MonoBehaviour. Cách này ngăn việc <strong>nhân bản dữ liệu không cần thiết</strong> mỗi lần instantiate một object mang MonoBehaviour ấy.</p>
<p><strong>AddComponent lúc runtime:</strong> Gọi <code>AddComponent</code> khi chạy có chi phí — Unity phải kiểm tra component trùng lặp hoặc component bắt buộc. <strong>Instantiate một Prefab đã gắn sẵn component thường nhanh hơn.</strong></p>
<p><strong>Cấu trúc dữ liệu:</strong> Lựa chọn <code>List</code> / <code>Array</code> / <code>Dictionary</code> ảnh hưởng lớn khi bạn duyệt hàng nghìn lần mỗi frame. Tham khảo hướng dẫn data structure của MSDN.</p>
</div>
<div class="col-en">
<p><strong>ScriptableObject:</strong> Store unchanging values or settings in a ScriptableObject instead of a MonoBehaviour. The ScriptableObject is an <em>asset</em> that lives inside the project which you only need to set up once, and it <strong>cannot</strong> be directly attached to a GameObject.</p>
<p>Create fields in the ScriptableObject to store your values, then reference the ScriptableObject in your MonoBehaviours. This prevents <strong>unnecessary duplication of data</strong> every time you instantiate an object with that MonoBehaviour.</p>
<p><strong>AddComponent at runtime:</strong> Invoking <code>AddComponent</code> at runtime comes with some cost — Unity must check for duplicate or other required components. <strong>Instantiating a Prefab with the desired components already set up is generally more performant.</strong></p>
<p><strong>Data structures:</strong> Your choice of <code>List</code> / <code>Array</code> / <code>Dictionary</code> impacts efficiency as you iterate thousands of times per frame. Follow the MSDN guide to data structures in C#.</p>
</div>
</div>

---

## 9. Checklist Fresher — Bỏ túi

<div class="bilingual-row">
<div class="col-vi">
<ul>
<li>☑️ Đo bằng <strong>ms</strong>, không đo bằng FPS.</li>
<li>☑️ Biết ngân sách: 30 FPS → 22 ms; 60 FPS → 11 ms (mobile).</li>
<li>☑️ Luôn build <strong>Development Build + Autoconnect Profiler</strong>.</li>
<li>☑️ Profile trên <strong>thiết bị thật</strong>, cả máy mạnh lẫn máy yếu.</li>
<li>☑️ Xác định <code>Gfx.WaitForCommands</code> (CPU-bound) hay <code>Gfx.WaitForPresent</code> (GPU-bound) TRƯỚC khi tối ưu.</li>
<li>☑️ Lưu <code>.data</code> trước khi sửa, so sánh sau khi sửa.</li>
<li>☑️ Cột <strong>GC Alloc</strong> trong Hierarchy phải là <strong>0 B</strong> ở frame gameplay ổn định.</li>
<li>☑️ Cache <code>GetComponent</code>, <code>transform</code>, <code>Camera.main</code> ở <code>Awake</code>.</li>
<li>☑️ Dùng <code>CompareTag</code>, <code>StringBuilder</code>, <code>string.Empty</code>.</li>
<li>☑️ Cache <code>WaitForSeconds</code>, hash <code>Animator.StringToHash</code> / <code>Shader.PropertyToID</code>.</li>
<li>☑️ Xóa <code>Update</code> rỗng, tắt <code>Debug.Log</code> trước khi build.</li>
<li>☑️ Pool thay vì Instantiate/Destroy trong gameplay.</li>
<li>☑️ Hạ FPS xuống 30 ở màn hình idle để chống nóng máy.</li>
</ul>
</div>
<div class="col-en">
<ul>
<li>☑️ Measure in <strong>ms</strong>, not FPS.</li>
<li>☑️ Know the budget: 30 FPS → 22 ms; 60 FPS → 11 ms (mobile).</li>
<li>☑️ Always build with <strong>Development Build + Autoconnect Profiler</strong>.</li>
<li>☑️ Profile on <strong>real devices</strong>, both highest- and lowest-spec.</li>
<li>☑️ Determine <code>Gfx.WaitForCommands</code> (CPU-bound) vs <code>Gfx.WaitForPresent</code> (GPU-bound) BEFORE optimizing.</li>
<li>☑️ Save the <code>.data</code> before changes, compare after.</li>
<li>☑️ The <strong>GC Alloc</strong> column in Hierarchy should read <strong>0 B</strong> on a steady gameplay frame.</li>
<li>☑️ Cache <code>GetComponent</code>, <code>transform</code>, <code>Camera.main</code> in <code>Awake</code>.</li>
<li>☑️ Use <code>CompareTag</code>, <code>StringBuilder</code>, <code>string.Empty</code>.</li>
<li>☑️ Cache <code>WaitForSeconds</code>; hash with <code>Animator.StringToHash</code> / <code>Shader.PropertyToID</code>.</li>
<li>☑️ Remove empty <code>Update</code>s; strip <code>Debug.Log</code> before building.</li>
<li>☑️ Pool instead of Instantiate/Destroy during gameplay.</li>
<li>☑️ Drop to 30 FPS on idle screens to fight thermal throttling.</li>
</ul>
</div>
</div>
