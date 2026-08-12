# 👑 Module 4 — GPU, URP & Advanced Rendering

!!! abstract "Nguồn đã cào / Sources scraped"
    **E-book PDF gốc (đã tải & bóc tách toàn văn + trích ảnh):**

    - 📗 [**Introduction to the Universal Render Pipeline for advanced Unity creators** — 2021 LTS Edition, **125 trang**](https://cdn.bfldr.com/S5BC9Y64/at/5rmgtzhmbk347bj6pvqskb/Introduction_to_the_Universal_Render_Pipeline_for_advanced_Unity_creators_2021_LTS_edition.pdf) — ⭐ **nguồn chính về URP**
    - 📙 **Optimize your game performance for consoles and PC** — ch. *Graphics* (tr.38–51) + ***GPU optimization* (tr.52–69)** — chương lớn nhất về GPU
    - 📕 **Optimize Your Mobile Game Performance** — ch. *Graphics and GPU optimization* (tr.29–36)
    - 📘 [**The Definitive Guide to Lighting in HDRP**, 83 tr.](https://cdn.bfldr.com/S5BC9Y64/at/g9f4kvk4pk99t38jx86ph696/Unity_DefinitiveGuideToLightingInHDRP_eBook.pdf) · [**HDRP Lighting 2021 LTS**, 100 tr.](https://cdn.bfldr.com/S5BC9Y64/at/2tcfx5bgpknjvp3bksq8hcr/JW10283_Unity_ABMCampaign_Final.pdf) · [**Definitive guide to creating advanced VFX**, 120 tr.](https://cdn.bfldr.com/S5BC9Y64/at/6qfsbqs59798rprm563f/The_definitive_guide_to_creating_advanced_visual_effects_in_Unity.pdf)

    **Bài viết & tài liệu:**

    - 🎨 [**GPU Performance for Game Artists** — Keith O'Conor, gamedev.net](https://www.gamedev.net/articles/programming/graphics/gpu-performance-for-game-artists-r4632/) — ⭐ nền tảng kiến trúc GPU
    - ⚡ [**Optimizing loading performance: Understanding the Async Upload Pipeline** — Unity Blog](https://blog.unity.com/technology/optimizing-loading-performance-understanding-the-async-upload-pipeline) — nguồn của 3 tham số AUP
    - 🔁 [**GPU instancing** — Unity Manual](https://docs.unity3d.com/Manual/GPUInstancing.html)
    - 🎭 [**See-through objects with Stencil Buffers using Unity URP** — SlideFactory](https://www.theslidefactory.com/post/see-through-objects-with-stencil-buffers-using-unity-urp)
    - 🦴 [**Animation-Instancing** — Unity-Technologies (GitHub)](https://github.com/Unity-Technologies/Animation-Instancing)
    - 💡 [**Baked Light Mode** — Unity Manual](https://docs.unity3d.com/Manual/LightMode-Baked.html)

    ⚠️ **Không cào được:** bài blog [`animation-instancing-instancing-for-skinnedmeshrenderer`](https://blog.unity.com/technology/animation-instancing-instancing-for-skinnedmeshrenderer) → **404 ở MỌI biến thể URL** (Unity đã gỡ). Nội dung được khôi phục từ **README của repo chính thức** + **đoạn trích nguyên văn trong `raw-optimization-data.txt`**. · `ronja-tutorials.com` → **không kết nối được** (curl và Jina reader đều timeout). · Ảnh sơ đồ của `gamedev.net` → **chặn hotlink**; nội dung đã được diễn giải thành bảng và sơ đồ văn bản.

    📝 **Bổ sung từ `raw-optimization-data.txt`**: static/dynamic batching, occlusion culling, compute shader trên render texture, `MaterialPropertyBlock`, cấu hình Lighting/Camera, `Texture2D.ReadPixels` & color space.

---

# PHẦN A — KIẾN TRÚC GPU

## 1. Đường ống Rendering nhìn từ 10.000 feet

<div class="bilingual-row">
<div class="col-vi">
<p>Để hiểu tác động của art lên hiệu năng game, bạn cần biết <strong>một mesh đi từ phần mềm dựng hình lên màn hình game như thế nào</strong>. Nghĩa là phải hiểu <strong>GPU</strong> — con chip vận hành card đồ họa và làm cho rendering 3D thời gian thực trở nên khả thi.</p>
<p>🔑 <strong>Năm giai đoạn của GPU pipeline:</strong></p>
</div>
<div class="col-en">
<p>To appreciate the impact your art has on the game's performance, you need to know <strong>how a mesh makes its way from your modelling package onto the screen</strong>. That means understanding the <strong>GPU</strong> — the chip that powers your graphics card and makes real-time 3D rendering possible.</p>
<p>🔑 <strong>The five stages of the GPU pipeline:</strong></p>
</div>
</div>

| # | Giai đoạn / Stage | Cơ chế / Mechanism |
|---|---|---|
| **①** | **Input Assembly** | GPU **đọc vertex và index buffer từ bộ nhớ**, xác định các vertex nối với nhau thế nào để tạo thành tam giác, rồi cấp cho phần còn lại của pipeline |
| **②** | **Vertex Shading** | Vertex shader chạy **MỘT LẦN cho MỖI vertex**, xử lý từng vertex một. Mục đích chính: **BIẾN ĐỔI (transform)** vertex — lấy vị trí của nó và dùng camera/viewport hiện tại để tính nó sẽ nằm ở đâu trên màn hình |
| **③** | **Rasterization** | Khi GPU biết tam giác xuất hiện ở đâu, nó được **rasterize** — chuyển thành **tập hợp pixel riêng lẻ**. Các giá trị per-vertex (UV, vertex color, normal…) được **NỘI SUY** qua các pixel của tam giác |
| **④** | **Pixel Shading** | Mỗi pixel đã rasterize chạy qua pixel shader *(kỹ thuật mà nói ở giai đoạn này nó chưa phải pixel mà là **fragment** — nên còn gọi là fragment shader)*. 🚨 **Vì có QUÁ NHIỀU pixel (render target 1080p có hơn 2 TRIỆU) và mỗi cái phải được shade ít nhất một lần, pixel shader thường là nơi GPU tốn NHIỀU thời gian nhất** |
| **⑤** | **Render Target Output** | Pixel được ghi vào render target — **nhưng phải qua một số phép TEST trước**. Ví dụ: **depth test** loại bỏ pixel xa hơn pixel đã có trong render target. Nếu pixel vượt qua mọi test (**depth, alpha, stencil**…), nó được ghi vào render target trong bộ nhớ |

<div class="bilingual-row">
<div class="col-vi">
<p>💡 <strong>Vì sao GPU nhanh hơn CPU ở việc đồ họa:</strong></p>
<blockquote>
<p><em>"Bạn có thể để ý các bước shader được <strong>CÁCH LY</strong> tới mức nào — mỗi shader làm việc trên MỘT vertex hoặc pixel <strong>mà KHÔNG cần biết gì về các vertex/pixel xung quanh</strong>.</em></p>
<p><em>Đây là <strong>CỐ Ý</strong>, và nó cho phép GPU <strong>xử lý SONG SONG một lượng KHỔNG LỒ vertex và pixel ĐỘC LẬP</strong> — đây là một phần lý do GPU nhanh hơn CPU rất nhiều ở công việc đồ họa."</em></p>
</blockquote>
</div>
<div class="col-en">
<p>💡 <strong>Why GPUs beat CPUs at graphics:</strong></p>
<blockquote>
<p><em>"You might notice how <strong>ISOLATED</strong> the shader steps are — each shader works on a single vertex or pixel <strong>without needing to know anything about the surrounding vertices/pixels</strong>.</em></p>
<p><em>This is <strong>INTENTIONAL</strong> and allows the GPU to <strong>process HUGE numbers of INDEPENDENT vertices and pixels IN PARALLEL</strong>, which is part of what makes GPUs so fast at doing graphics work compared to CPUs."</em></p>
</blockquote>
</div>
</div>

```hlsl
// Pixel shader Lambertian đơn giản — ví dụ nguyên văn từ bài viết
// A simple Lambertian pixel shader — verbatim from the article
float3      MaterialColor;
Texture2D   MaterialTexture;
SamplerState TexSampler;
float3      LightDirection;
float3      LightColor;

float4 MyPixelShader( float2 vUV : TEXCOORD0, float3 vNorm : NORMAL0 ) : SV_Target
{
    float3 vertexNormal = normalize(vNorm);
    float3 lighting = LightColor * dot( vertexNormal, LightDirection );
    float3 material = MaterialColor * MaterialTexture.Sample( TexSampler, vUV ).rgb;
    float3 color = material * lighting;
    float  alpha = 1;
    return float4(color, alpha);
}
// MaterialTexture và LightColor do CPU điền vào;
// vUV và vNorm là thuộc tính vertex được NỘI SUY qua tam giác lúc rasterization.
```

```
; Shader compiler sinh ra các lệnh này để chạy trên GPU
; Chương trình DÀI HƠN ⇒ NHIỀU lệnh HƠN ⇒ GPU phải làm NHIỀU việc HƠN
dp3 r0.x, v1.xyzx, v1.xyzx
rsq r0.x, r0.x
mul r0.xyz, r0.xxxx, v1.xyzx
dp3 r0.x, r0.xyzx, cb0[1].xyzx
mul r0.xyz, r0.xxxx, cb0[2].xyzx
sample_indexable(texture2d)(float,float,float,float) r1.xyz, v0.xyxx, t0.xyzw, s0
mul r1.xyz, r1.xyzx, cb0[0].xyzx
mul o0.xyz, r0.xyzx, r1.xyzx
mov o0.w, l(1.000000)
ret
```

---

## 2. CPU & Draw Call — Nút thắt đầu tiên

<div class="bilingual-row">
<div class="col-vi">
<p>🔑 <strong>GPU KHÔNG làm việc một mình.</strong> Nó dựa vào code game chạy trên <strong>CPU</strong> để bảo nó render CÁI GÌ và render THẾ NÀO. CPU và GPU (thường) là <em>2 chip riêng biệt, chạy độc lập và song song</em>.</p>
<p>Để đạt frame rate mục tiêu — phổ biến nhất là <strong>30 fps</strong> — <em>CẢ CPU và GPU</em> đều phải hoàn thành công việc tạo một frame trong thời gian cho phép (ở 30fps là <strong>33 mili-giây/frame</strong>).</p>
<p><strong>Cơ chế Pipelining giữa CPU và GPU:</strong></p>
<blockquote>
<p><em>"Để đạt điều này, frame thường được <strong>PIPELINE</strong>: CPU dùng <strong>TRỌN frame</strong> để làm việc của nó (AI, physics, input, animation…) rồi <strong>gửi lệnh cho GPU ở CUỐI frame</strong>, để GPU bắt tay vào <strong>frame TIẾP THEO</strong>.</em></p>
<p><em>Điều này cho <strong>mỗi bộ xử lý TRỌN 33 ms</strong> để làm việc — <strong>đánh đổi là thêm ĐỘ TRỄ một frame</strong>."</em></p>
</blockquote>
<p>💡 <em>Độ trễ này có thể là vấn đề với game nhạy thời gian như FPS — ví dụ Call of Duty chạy <strong>60fps để GIẢM độ trễ</strong> giữa input người chơi và render. Nhưng nhìn chung người chơi không nhận ra frame thừa này.</em></p>
<p>🚨 <strong>Điều gì xảy ra khi trễ VSync:</strong> Nếu GPU mất hơn 33 ms để render xong ⇒ <strong>bỏ lỡ cửa sổ cơ hội, màn hình không có frame mới để hiển thị</strong> ⇒ <em>screen tearing hoặc giật, frame rate không đều</em>. <strong>Kết quả TƯƠNG TỰ nếu CPU chậm</strong> — nó có hiệu ứng dây chuyền vì GPU không nhận lệnh đủ nhanh.</p>
<p>👉 <strong>Frame rate ổn định phụ thuộc vào CẢ CPU lẫn GPU.</strong> <em>(Liên hệ <a href="../01-fresher/01-ultimate-guide-to-profiling.md">Module 1 §1.3</a> — sơ đồ anatomy of a frame.)</em></p>
</div>
<div class="col-en">
<p>🔑 <strong>The GPU cannot work alone.</strong> It relies on the game code running on the <strong>CPU</strong> to tell it what to render and how. The CPU and GPU are (usually) <em>separate chips, running independently and in parallel</em>.</p>
<p>To hit the target frame rate — most commonly <strong>30 fps</strong> — <em>both the CPU and GPU</em> have to do all the work to produce a frame within the time allowed (at 30fps that's just <strong>33 milliseconds per frame</strong>).</p>
<p><strong>The CPU/GPU pipelining mechanism:</strong></p>
<blockquote>
<p><em>"To achieve this, frames are often <strong>PIPELINED</strong>: the CPU will take the <strong>WHOLE frame</strong> to do its work (AI, physics, input, animation etc.) and then <strong>send instructions to the GPU at the END of the frame</strong> so it can get to work on the <strong>NEXT frame</strong>.</em></p>
<p><em>This gives <strong>each processor a full 33ms</strong> to do its work <strong>at the expense of introducing a frame's worth of LATENCY</strong>."</em></p>
</blockquote>
<p>💡 <em>This may matter for twitchy games — the Call of Duty series runs at <strong>60fps to reduce the latency</strong> between player input and rendering. But in general the extra frame is not noticeable.</em></p>
<p>🚨 <strong>What happens on a missed VSync:</strong> If the GPU takes longer than 33ms, it <strong>misses this window and the monitor won't have any new frame to display</strong> ⇒ <em>screen tearing or stuttering and an uneven framerate</em>. <strong>We get the SAME result if the CPU takes too long</strong> — a knock-on effect since the GPU doesn't get commands quickly enough.</p>
<p>👉 <strong>A solid framerate relies on BOTH the CPU and GPU performing well.</strong> <em>(Connects to <a href="../01-fresher/01-ultimate-guide-to-profiling.md">Module 1 §1.3</a> — the anatomy of a frame.)</em></p>
</div>
</div>

### 2.1. 🔑 GPU State — Vì sao mỗi thay đổi cần một Draw Call mới

<div class="bilingual-row">
<div class="col-vi">
<p>Để hiển thị một mesh, CPU phát ra một <strong>draw call</strong> — đơn giản là <em>một chuỗi lệnh nói cho GPU biết vẽ gì và vẽ thế nào</em>.</p>
<p>Khi draw call đi qua GPU pipeline, nó dùng các setting cấu hình được chỉ định trong draw call — chủ yếu do <em>material của mesh và tham số của nó</em> quyết định. Các setting này gọi là <strong>GPU STATE</strong>.</p>
<p><strong>GPU state gồm những gì (quan trọng nhất với chúng ta):</strong></p>
<ul>
<li><strong>Vertex/index buffer hiện tại</strong></li>
<li><strong>Chương trình vertex/pixel shader hiện tại</strong></li>
<li><strong>Toàn bộ shader input</strong> (ví dụ <code>MaterialTexture</code> hay <code>LightColor</code> trong code trên)</li>
</ul>
<p>🚨 <strong>HỆ QUẢ QUAN TRỌNG NHẤT:</strong></p>
<blockquote>
<p><em>"Điều này nghĩa là <strong>để thay đổi MỘT mẩu GPU state</strong> (ví dụ đổi texture hay đổi shader), <strong>PHẢI phát ra một DRAW CALL MỚI</strong>."</em></p>
</blockquote>
<p>💰 <strong>Và draw call KHÔNG miễn phí đối với CPU:</strong></p>
<ul>
<li>Tốn thời gian để <em>thiết lập các thay đổi GPU state mong muốn</em> rồi phát draw call</li>
<li>Ngoài công việc engine phải làm cho mỗi lời gọi, còn có <strong>chi phí kiểm tra lỗi và ghi sổ (bookkeeping) do GRAPHICS DRIVER</strong> — lớp code trung gian do nhà sản xuất GPU (NVIDIA, AMD…) viết, dịch draw call thành lệnh phần cứng cấp thấp</li>
</ul>
<p>💀 <strong>Quá nhiều draw call ⇒ gánh nặng quá lớn cho CPU ⇒ vấn đề hiệu năng nghiêm trọng.</strong></p>
</div>
<div class="col-en">
<p>To display a mesh, the CPU issues a <strong>draw call</strong> — simply <em>a series of commands that tells the GPU what to draw and how</em>.</p>
<p>As the draw call goes through the pipeline, it uses the configurable settings specified in it — mostly determined by <em>the mesh's material and its parameters</em>. These settings are called <strong>GPU STATE</strong>.</p>
<p><strong>What GPU state includes (most significantly for us):</strong></p>
<ul>
<li>The <strong>current vertex/index buffers</strong></li>
<li>The <strong>current vertex/pixel shader programs</strong></li>
<li><strong>All the shader inputs</strong> (e.g. <code>MaterialTexture</code> or <code>LightColor</code> in the code above)</li>
</ul>
<p>🚨 <strong>THE MOST IMPORTANT CONSEQUENCE:</strong></p>
<blockquote>
<p><em>"This means that <strong>to change a piece of GPU state</strong> (for example changing a texture or switching shaders), <strong>a NEW DRAW CALL must be issued</strong>."</em></p>
</blockquote>
<p>💰 <strong>And draw calls are NOT free for the CPU:</strong></p>
<ul>
<li>It costs time to <em>set up the desired GPU state changes</em> and then issue the draw call</li>
<li>Beyond whatever the engine does per call, extra error checking and bookkeeping cost is introduced by the <strong>graphics DRIVER</strong> — an intermediate layer written by the GPU vendor (NVIDIA, AMD etc.) that translates the draw call into low-level hardware instructions</li>
</ul>
<p>💀 <strong>Too many draw calls can put too much of a burden on the CPU and cause serious performance problems.</strong></p>
</div>
</div>

!!! danger "📊 Ngân sách Draw Call thực tế trên console"
    <div class="bilingual-row">
    <div class="col-vi">
    <blockquote>
    <p><em>"Do overhead này, chúng ta thường đặt <strong>giới hạn TRÊN cho số draw call chấp nhận được mỗi frame</strong>. Nếu vượt giới hạn trong lúc test gameplay, phải có biện pháp: giảm số object, giảm draw distance, v.v.</em></p>
    <p><em>📊 <strong>Game console thường cố giữ draw call trong khoảng 2000–3000</strong> — ví dụ trên <strong>Far Cry Primal</strong> chúng tôi cố giữ <strong>dưới 2500 mỗi frame</strong>.</em></p>
    <p><em>⚠️ Con số đó nghe có vẻ nhiều, nhưng nó <strong>BAO GỒM cả các kỹ thuật render đặc biệt</strong> — ví dụ <strong>cascaded shadows có thể DỄ DÀNG NHÂN ĐÔI số draw call</strong> trong một frame."</em></p>
    </blockquote>
    <p><strong>Nguồn draw call thừa phổ biến nhất — đọc kỹ:</strong></p>
    <blockquote>
    <p><em>"Mặc dù bạn có thể đã tạo <strong>MỘT mesh duy nhất</strong> trong phần mềm dựng hình, <strong>nếu MỘT NỬA mesh dùng texture albedo này và nửa kia dùng texture khác, nó sẽ được render thành HAI draw call riêng biệt</strong>.</em></p>
    <p><em>Tương tự nếu mesh gồm <strong>nhiều material</strong> — cần set shader khác nhau ⇒ phải phát nhiều draw call.</em></p>
    <p><em>🔑 <strong>Trên thực tế, nguồn thay đổi state RẤT PHỔ BIẾN — và do đó là draw call thừa — chính là ĐỔI TEXTURE MAP.</strong> Thường cả mesh dùng cùng material (nên cùng shader), nhưng <strong>các phần khác nhau của mesh dùng bộ albedo/normal/roughness map KHÁC NHAU</strong>."</em></p>
    </blockquote>
    </div>
    <div class="col-en">
    <blockquote>
    <p><em>"Due to this overhead, we generally set an <strong>upper limit to the number of draw calls acceptable per frame</strong>. If this limit is exceeded during gameplay testing, steps must be taken: reducing the number of objects, reducing draw distance, etc.</em></p>
    <p><em>📊 <strong>Console games typically try to keep draw calls in the 2000–3000 range</strong> — e.g. on <strong>Far Cry Primal</strong> we tried to keep it <strong>below 2500 per frame</strong>.</em></p>
    <p><em>⚠️ That might sound like a lot, but it <strong>also INCLUDES any special rendering techniques</strong> — <strong>cascaded shadows for example can EASILY DOUBLE the number of draw calls</strong> in a frame."</em></p>
    </blockquote>
    <p><strong>The most common source of extra draw calls — read carefully:</strong></p>
    <blockquote>
    <p><em>"Although you may have created a <strong>SINGLE mesh</strong> in your modelling package, <strong>if one HALF of the mesh uses one texture for the albedo map and the other half uses a different texture, it will be rendered as TWO separate draw calls</strong>.</em></p>
    <p><em>The same goes if the mesh is made up of <strong>multiple materials</strong>; different shaders need to be set, so multiple draw calls must be issued.</em></p>
    <p><em>🔑 <strong>In practice, a VERY COMMON source of state change — and therefore extra draw calls — is SWITCHING TEXTURE MAPS.</strong> Typically the whole mesh uses the same material (and therefore the same shaders), but <strong>different parts of the mesh use different sets of albedo/normal/roughness maps</strong>."</em></p>
    </blockquote>
    </div>
    </div>

---

## 3. Bottleneck — Khái niệm nền tảng

<div class="bilingual-row">
<div class="col-vi">
<p><strong>Bước ĐẦU TIÊN trong tối ưu là XÁC ĐỊNH bottleneck hiện tại</strong> để bạn có thể giảm hoặc loại bỏ nó. <em>Bottleneck là phần của pipeline đang làm chậm mọi thứ khác.</em></p>
<p>💡 <strong>Ví dụ:</strong> Trong trường hợp quá nhiều draw call tốn quá nhiều thời gian ⇒ <strong>CPU là bottleneck</strong>. Kể cả khi bạn thực hiện các tối ưu khác làm GPU nhanh hơn, <em>điều đó KHÔNG ảnh hưởng gì tới frame rate</em> vì CPU vẫn chạy quá chậm để tạo một frame trong thời gian yêu cầu.</p>
<p><strong>Hình dung GPU pipeline như một DÂY CHUYỀN LẮP RÁP:</strong> khi mỗi giai đoạn xong việc, nó chuyển kết quả cho giai đoạn tiếp theo và làm tiếp phần việc mới. <em>Lý tưởng: mọi giai đoạn đều bận rộn suốt thời gian</em> — vertex shader liên tục xử lý vertex, rasterizer liên tục rasterize pixel, v.v.</p>
<p>🚨 <strong>Nhưng điều gì xảy ra khi MỘT giai đoạn mất nhiều thời gian hơn hẳn?</strong></p>
<blockquote>
<p><em>"Một vertex shader ĐẮT ĐỎ <strong>KHÔNG thể cấp dữ liệu cho các giai đoạn sau đủ nhanh</strong>, và do đó trở thành bottleneck. Nếu bạn có một draw call hành xử như vậy, <strong>làm pixel shader nhanh hơn sẽ KHÔNG tạo ra nhiều khác biệt</strong> cho tổng thời gian render draw call đó.</em></p>
<p><em>🔑 <strong>Cách DUY NHẤT để làm mọi thứ nhanh hơn là GIẢM thời gian ở trong vertex shader.</strong>"</em></p>
</blockquote>
<p>⚖️ <strong>Sự thật cần chấp nhận:</strong></p>
<blockquote>
<p><em>"Bạn nên nhớ rằng <strong>gần như LUÔN LUÔN sẽ có một bottleneck nào đó</strong> — nếu bạn loại bỏ một cái, cái khác sẽ thế chỗ.</em></p>
<p><em>Mẹo là <strong>biết KHI NÀO bạn có thể làm gì đó về nó, và KHI NÀO bạn phải sống chung với nó</strong> vì đó đơn giản là cái giá để render thứ bạn muốn render.</em></p>
<p><em>👉 <strong>Khi tối ưu, bạn thực sự đang cố loại bỏ những bottleneck KHÔNG CẦN THIẾT.</strong>"</em></p>
</blockquote>
</div>
<div class="col-en">
<p><strong>The very FIRST step in optimization is to IDENTIFY the current bottleneck</strong> so you can reduce or eliminate it. <em>A bottleneck is the section of the pipeline that is slowing everything else down.</em></p>
<p>💡 <strong>Example:</strong> In the case where too many draw calls cost too much, <strong>the CPU is the bottleneck</strong>. Even if you performed other optimizations that made the GPU faster, <em>it wouldn't matter to the framerate</em> because the CPU is still too slow to produce a frame in the required time.</p>
<p><strong>Think of the GPU pipeline as an ASSEMBLY LINE:</strong> as each stage finishes with its data, it forwards results to the following stage and proceeds with the next piece of work. <em>Ideally every stage is busy working all the time</em> — the vertex shader constantly processing vertices, the rasterizer constantly rasterizing pixels, and so on.</p>
<p>🚨 <strong>But what happens if ONE stage takes much longer than the others?</strong></p>
<blockquote>
<p><em>"An expensive vertex shader <strong>can't feed the following stages fast enough</strong>, and so becomes the bottleneck. If you had a draw call that behaved like this, <strong>making the pixel shader faster is NOT going to make much of a difference</strong> to the time it takes for the entire draw call to be rendered.</em></p>
<p><em>🔑 <strong>The ONLY way to make things faster is to REDUCE the time spent in the vertex shader.</strong>"</em></p>
</blockquote>
<p>⚖️ <strong>The truth to accept:</strong></p>
<blockquote>
<p><em>"You should keep in mind that <strong>there will ALMOST ALWAYS be a bottleneck of some kind</strong> — if you eliminate one, another will just take its place.</em></p>
<p><em>The trick is <strong>knowing WHEN you can do something about it, and WHEN you have to live with it</strong> because that's just what it costs to render what you want to render.</em></p>
<p><em>👉 <strong>When you optimize, you're really trying to get rid of UNNECESSARY bottlenecks.</strong>"</em></p>
</blockquote>
</div>
</div>

!!! tip "Công cụ profiling GPU theo nền tảng"
    **VI:** Bài viết liệt kê: **NVIDIA Nsight** · **AMD GPU PerfStudio** · **Intel GPA** · **RenderDoc** *(hiện là công cụ tốt nhất để debug đồ họa trên PC, nhưng không có tính năng profiling nâng cao)* · **PIX** *(Microsoft đang mở rộng công cụ profiling Xbox cho Windows, tuy chỉ cho ứng dụng D3D12)*.

    ⚠️ *"Đáng tiếc, đây là chỗ mọi thứ hơi mơ hồ, vì **một số công cụ hiệu năng TỐT NHẤT chỉ có trên console và do đó thuộc diện NDA**."* — Xem thêm bảng công cụ đầy đủ ở [Module 1 §17](../01-fresher/01-ultimate-guide-to-profiling.md).

    **EN:** The article lists: **NVIDIA Nsight** · **AMD GPU PerfStudio** · **Intel GPA** · **RenderDoc** *(currently the best tool for graphics debugging on PC, but without advanced profiling features)* · **PIX**. ⚠️ *"Some of the best performance tools available are only available for the consoles and therefore under NDA."*
