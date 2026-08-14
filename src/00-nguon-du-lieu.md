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
| 11 | [cgcookie.com — Maximizing your Unity game's performance](https://cgcookie.com/posts/maximizing-your-unity-games-performance) | ✅ **ĐÃ GỠ CHẶN ở audit 3** — Cloudflare chặn `curl`, nhưng **Jina reader lấy được toàn văn (29 KB)**. 12 mục của bài: mục **3, 4, 5, 6, 10, 11, 12** (batching, atlas, culling, LOD/mipmap, bake light, shader, imposter) → **M4 §7.2, §10.6**; mục **2, 7, 8, 9** (Profiler, audio, physics, code) đã được phủ bằng nguồn Unity chính thức tương đương ở **M1, M2** |

---

## 🚀 MODULE 2 — Junior: UI & Physics Deep Dive

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 12 | [learn.unity.com — Optimizing Unity UI](https://learn.unity.com/tutorial/optimizing-unity-ui) | ✅ ⭐ **Nguồn chính M2** — cào đủ **6/6 chương** + **7/7 ảnh** (audit 2 xác nhận đủ). Bổ sung: hoàn chỉnh shader `UI/Fast-Default` (bản cũ **thiếu `appdata_t`/`v2f`/`vert()` nên KHÔNG compile được**), địa chỉ repo Bitbucket của UGUI |
| 13 | [learn.unity.com — Physics Best Practices](https://learn.unity.com/tutorial/physics-best-practices) | ⚠️ **HTTP 404** — Unity Learn đã xóa. Thay bằng e-book Unity (tr.45–47) + ghi chú raw |
| 14 | [tvd12.com — S.O.L.I.D](https://tvd12.com/solid) | ✅ Cào qua **API `tvd12.com/api/v1/posts/solid`** (trang HTML là SPA render 404) — nguyên văn tiếng Việt |
| 15 | [kodeco.com — Introduction to Unity Unit Testing](https://www.kodeco.com/9454-introduction-to-unity-unit-testing) | ⚠️ **Paywall một phần** — cào được phần khái niệm + setup; code test nửa sau bị chặn |
| 16 | [jacksondunstan.com — C# event vs UnityEvent](https://www.jacksondunstan.com/articles/3335) | ✅ **3 bảng benchmark đầy đủ** + comments. **Audit 2 sửa một chỗ tài liệu nói SAI**: tác giả đã đính chính *"UnityEvent chỉ tạo rác ở lần dispatch ĐẦU TIÊN"* — bản cũ viết "136 B × số lần dispatch mỗi frame". Bổ sung: bảng chạy lại 2023 trên Unity 2021.3 (hiệu ứng "nhiều tham số càng đắt" đã BIẾN MẤT), benchmark Mono vs IL2CPP, bẫy đo GC trong Editor, 4 khác biệt hành vi (UnityEvent **KHÔNG** giữ weak reference) |
| 17 | [GitHub — thefuntastic/Unity3d-Finite-State-Machine](https://github.com/thefuntastic/Unity3d-Finite-State-Machine) | ✅ README + Driver deep-dive. **Audit 2 bổ sung 4 mục cuối README bị bỏ trắng**: Async Transitions (`StateTransition.Safe`/`.Overwrite`), anti-pattern gọi `ChangeState` từ ngoài + bảng transition ngầm, Performance & Limitations (ngưỡng *tens of thousands*, Windows Store không tương thích), bước nâng cấp v4.0 |
| 18 | [gamedevbeginner.com — State Machines in Unity](https://gamedevbeginner.com/state-machines-in-unity-how-and-when-to-use-them/) | ✅ **Cào được qua Jina reader** (`r.jina.ai`) sau khi curl bị 403 WAF — 34.8 KB + **5 sơ đồ**; 3 cách cài FSM (Interface/Inheritance/Hierarchical). **Audit 2 bổ sung các bước CODE trung gian bị bỏ**: biến thể `IState` truyền `StateController` + `PatrolState`, nhược điểm của Interface, base `State` tách đủ 4 cặp hàm + giải thích `protected` |
| 19 | [GitHub — aniketrajnish/Unity-Collider-Optimizer](https://github.com/aniketrajnish/Unity-Collider-Optimizer) | ✅ README + **6 ảnh so sánh** + số liệu (3032→918 tris, 214→23 paths) + **mục Presets** (bổ sung ở audit 2) |
| 20 | [GitHub — QianMo/Unity-Design-Pattern](https://github.com/QianMo/Unity-Design-Pattern) | ✅ Catalog **23 GoF + 9 Game Programming Patterns** |
| 21 | 📕 E-book Mobile Perf — ch. *User interface* (tr.37–40), *Physics* (tr.45–47), *Animation* (tr.43–44) | ✅ Bóc tách toàn văn + **15 ảnh trích từ PDF**. ⚠️ **Audit 2 sửa 3 ảnh đặt SAI**: `anim-animation-system` ↔ `anim-generic-vs-humanoid` bị **HOÁN VAI** (một cái thực chất là Physics Debugger, cái kia là sơ đồ Animation System), và `physics-fixed-timestep-settings` thực chất là bảng Physics **không có chữ Fixed Timestep nào** |

---

## ⚔️ MODULE 3 — Senior: Memory, Addressables & Networking

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 22 | [discussions.unity.com — Effective Asset Management with Addressables](https://discussions.unity.com/t/effective-asset-management-in-unity-with-addressables/1621379) | ✅ ⭐ Bài viết + **toàn bộ Q&A reply** (gồm câu trả lời về *Requested Assets and Dependencies* và cảnh báo `Resources.UnloadUnusedAssets`) + **9 ảnh** |
| 23 | [educba.com — Protobuf vs JSON](https://www.educba.com/protobuf-vs-json/) | ✅ Bảng so sánh + ưu/nhược điểm đầy đủ |
| 24 | [docs.colyseus.io](https://docs.colyseus.io/colyseus/) | ✅ URL raw **404** → tìm ra `docs.colyseus.io/getting-started/unity`; cào qua Jina reader. **Audit 2 bổ sung 5 mục còn thiếu**: `npx schema-codegen` (bước BẮT BUỘC để code C# biên dịch được), `DynamicSchema`, Message Types Codegen, Room Inspector, bẫy `pingInterval` (breakpoint ⇒ WebSocket rớt sau 3 s), cài bản legacy `.unitypackage` + *seat reservation* |
| 25 | [learn.unity.com — Memory Management in Unity](https://learn.unity.com/tutorial/memory-management-in-unity) | ✅ ⭐ **Nguồn chính M3** — cào đủ **12/12 chương** (Unity 2022.3) + **2 ảnh** *(ảnh thứ 3 là thumbnail cover, không phải nội dung)*. **Audit 2 bổ sung**: `Cloned Materials` (`sharedMaterial`), `UnloadScene()` không unload asset, 2/6 cách giảm native memory, 2 khối `dumpsys meminfo` đầy đủ, output `procrank` + `/proc/meminfo`, 3 tài liệu nền |
| 26 | [codelearn.io — Sử dụng Reflection trong C#](https://codelearn.io/sharing/su-dung-reflection-trong-csharp) | ⚠️ **CAPTCHA** — curl và Jina reader đều bị chặn. Thay bằng #27 + ghi chú raw |
| 27 | [gucheng0712.github.io — C# Reflection in Unity](https://gucheng0712.github.io/unity/csharp/2019/04/19/C-Reflection-in-Unity-copy.html) | ✅ Toàn văn: System.Type, BindingFlags, Assembly, tạo object động |
| 28 | 📕 E-book Mobile Perf — ch. *Assets* (tr.24–28), *Audio* (tr.41–42) · 📙 E-book Console/PC — ch. *Assets* (tr.30–37) | ✅ Bóc tách toàn văn + **14 ảnh trích PDF**. **Audit 2 bổ sung**: polygon *density* / microtriangles / art pass / bake specular vào texture (Console tr.33), con số nén **16 MB → 2,7 MB DXT1**, texture packer ⇒ 1 draw call, Addressables + Cloud Content Delivery/DLC, ví dụ ADPCM *footsteps/gunshots*. ⚠️ **Sửa 1 ảnh đặt SAI**: `asset-polygon-count.png` thực chất là bản thấp-res của `asset-mesh-import-settings.png` → thay bằng ảnh *Remove unseen faces* đúng |
| — | *Bổ sung từ ghi chú raw (không có URL):* Service Locator, WebSocket Lock-step, Wei = 10⁻¹⁸, MLAPI/Mirror, Android plugin, UnityWebRequest | ✅ Đã đưa vào §10, §12, §13 + **§12.4 Observer** (mẫu đi cặp với Service Locator, bổ sung ở audit 2) |

---

## 👑 MODULE 4 — Tech Lead: GPU, URP & Advanced Rendering

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 29 | [Unity Blog — Animation Instancing for SkinnedMeshRenderer](https://blog.unity.com/technology/animation-instancing-instancing-for-skinnedmeshrenderer) | ⚠️ **404 ở MỌI biến thể URL** (Unity đã gỡ). **Audit đã thử Wayback qua `curl` (timeout), `WebFetch` (bị chặn domain), Jina (chặn truy cập ẩn danh `web.archive.org`)** → khôi phục từ README repo + trích raw · M4 §12 |
| 30 | [GitHub — Unity-Technologies/Animation-Instancing](https://github.com/Unity-Technologies/Animation-Instancing) | ✅ README bóc tách → M4 §12 (VertexCache) |
| 31 | [docs.unity3d.com — GPU Instancing](https://docs.unity3d.com/Manual/GPUInstancing.html) | ✅ M4 §11 + §11.1 (bảng tương thích, 3 giới hạn) |
| 32 | [Unity Blog — Understanding the Async Upload Pipeline (AUP)](https://blog.unity.com/technology/optimizing-loading-performance-understanding-the-async-upload-pipeline) | ✅ **TOÀN VĂN + 6 ảnh gốc** → M4 §25–§30 (5 bước command, 3 tham số, benchmark 575→245 ms, FAQ 4 câu) |
| 33 | [ronja-tutorials.com](https://www.ronja-tutorials.com/) | ⚠️ **KHÔNG kết nối được — thử lại 3 cách trong audit**: `curl` → `SSL_ERROR_SYSCALL` · Jina → `ERR_CONNECTION_CLOSED` · `WebFetch` → `Socket is closed`. **Server đóng kết nối, không phải bị chặn phía mình.** Chủ đề được phủ bằng nguồn Unity chính thức → M4 §38, §23.2 |
| 34 | [theslidefactory.com — See-through objects with Stencil Buffers (URP)](https://www.theslidefactory.com/post/see-through-objects-with-stencil-buffers-using-unity-urp) | ✅ M4 §15 + §15.1 (shader Custom/Mask, cấu hình Forward Renderer, 3 cảnh báo) |
| 35 | [Unity Blog — Expert tips on graphics and assets](https://blog.unity.com/technology/optimize-your-mobile-game-performance-expert-tips-on-graphics-and-assets) | ✅ Bóc tách → M4 Phần B, C |
| 36 | [learn.unity.com — Optimizing Graphics in Unity](https://learn.unity.com/tutorial/optimizing-graphics-in-unity) | ⚠️ **404 — Unity đã gỡ** → nội dung khôi phục từ ghi chú raw + e-book, viết ở M4 §39.1 (Clear Flags, Skybox, Render Texture) |
| 37 | [docs.unity3d.com — Baked Light Mode](https://docs.unity3d.com/Manual/LightMode-Baked.html) | ✅ M4 §17, §32.9 (Baked Indirect / Subtractive / Shadowmask) |
| 38 | [gamedev.net — GPU Performance for Game Artists](https://www.gamedev.net/articles/programming/graphics/gpu-performance-for-game-artists-r4632/) | ✅ **TOÀN VĂN** → M4 Phần A + B (5 giai đoạn GPU, overshading 75%, bandwidth/mipmap). ⚠️ Ảnh sơ đồ **bị chặn hotlink** → diễn giải thành bảng. **Audit 4 bổ sung §2.2**: texture atlas ↔ draw call, instancing/clustering, mesh merging + bẫy bounding volume, case study **XCOM 2**, D3D12/Vulkan & Assassin's Creed |
| 39 | [thegamedev.guru/blog](https://thegamedev.guru/blog) — Ruben Torres Bonet | ✅ **Audit 3 cào lại THÀNH CÔNG qua Jina** → 3 bài chuyên sâu vào M4: *Draw Call Batching Ultimate Guide* (**§10.2–§10.6**: Batches vs SetPass, GPU Resident Drawer, Run-Time Batching API, 9 điều kiện phá dynamic batching) · *Static Batching May Not Reduce Draw Calls* (**§10.3**) · *Occlusion Culling The Sneaky Way* (**§21.1–§21.2**: Umbra, 3 tham số bake) |
| 39b | ↩︎ [cgcookie.com — Maximizing Your Unity Game's Performance](https://cgcookie.com/posts/maximizing-your-unity-games-performance) *(đã liệt kê ở mục 11)* | ✅ Phần GPU → M4 **§10.6** (9 điều kiện phá dynamic batching, texture atlas/Megatexture, emissive fake lighting, imposter) và **§7.2** (mipmap bật mặc định) |
| 40 | [forum.unity.com — URP e-book for advanced creators](https://forum.unity.com/threads/new-free-e-book-introduction-to-the-universal-render-pipeline-for-advanced-unity-creators.1323774/) | ✅ Từ đây tìm ra link PDF thật (mục 41) |
| 41 | 📗 [**E-book PDF** — Introduction to URP for advanced creators, **125 trang**](https://cdn.bfldr.com/S5BC9Y64/at/5rmgtzhmbk347bj6pvqskb/Introduction_to_the_Universal_Render_Pipeline_for_advanced_Unity_creators_2021_LTS_edition.pdf) | ✅ **BÓC TÁCH TOÀN BỘ 125 TRANG — MỌI chương** → M4 §8, §16–§22, §31–§38. **BÓC TÁCH 100%** sau audit 4 (bổ sung: SRP evolution + 5 luận điểm chọn URP, dự án URP mới, walkthrough Viking Village + 7 bước test Quality, Lighting Settings Asset + 3 nơi A/B/C, Camera/Pipeline settings, `Debug Level`, native Profiler API, ghi chú 2D Renderer) · **72 ảnh trích từ PDF** |
| 42 | [YouTube — T-HXmQAMhG0](https://www.youtube.com/watch?v=T-HXmQAMhG0) | ➖ Video shader — không bóc tách được văn bản; chủ đề đã phủ ở M4 §36 (viết custom shader URP) |
| 43 | 📕 [**E-book PDF** — Optimize your console and PC game performance, 94 tr.](https://content.cdntwrk.com/files/aT0xNDI0NjkzJnY9MSZpc3N1ZU5hbWU9b3B0aW1pemUteW91ci1jb25zb2xlLWFuZC1wYy1nYW1lLXBlcmZvcm1hbmNlJmNtZD1kJnNpZz1hYjFkYjE2OTRhZWZhNzI4OTFkM2FiZjIyNTIyNTkyMQ%253D%253D) | ✅ ch. *Graphics* (tr.38–51) + ***GPU optimization* (tr.52–69)** → M4 Phần C, E, F, G. **Audit bổ sung TOÀN BỘ mục còn thiếu**: Benchmark the GPU (§3.1), Alternative debugging techniques (§3.2), Draw order & render queues (§5.4), Dynamic resolution (§22.2), Profile post-processing (§35.3). **Audit 4 bổ sung §23.0** (Reduce the batch count + Profile the post-processing cho console) và **25 ảnh** |
| 44 | [unity.com — Optimize your console and PC game performance (landing)](https://unity.com/resources/optimize-your-console-and-pc-game-performance) | ➖ Landing page rỗng (JS-render + form gate) → PDF thật ở mục 43 |
| 45 | 📕 E-book Mobile Perf — ch. *Graphics and GPU optimization* (tr.29–36) | ✅ **Bóc tách TOÀN BỘ chương** → M4 §8, §10, §13, §22 + **bổ sung sau audit**: `Screen.SetResolution` (§22.2), `BakeMesh` SkinnedMeshRenderer (§22.3), Limit Post-processing (§35) |
| 21b | 📙 E-book Console/PC — ch. *User interface* (tr.70–72) · ***Physics* (tr.77–85, 14 mục)** · ***Animation* (tr.86–88)** | ✅ Bóc tách toàn văn + **10 ảnh** — chương Physics/Animation là phần **bổ sung sau audit** |
| 46 | 📘 [**E-book PDF** — The Definitive Guide to Lighting in HDRP, 83 tr.](https://cdn.bfldr.com/S5BC9Y64/at/g9f4kvk4pk99t38jx86ph696/Unity_DefinitiveGuideToLightingInHDRP_eBook.pdf) | ✅ **Bóc tách chương *Optimizing HDRP* + *Rendering Debugger* + mọi *Performance/Optimization tip*** → M4 **§26** + bổ sung SSR `Minimum Smoothness`/`Max Ray Steps`, shadow `Update Mode`, cảnh báo ghép MSAA+post-AA (kèm **13 ảnh**) · §8 · §18 · §22.1 · §23.4 |
| 47 | 📘 [**E-book PDF** — HDRP Lighting 2021 LTS, 100 tr.](https://cdn.bfldr.com/S5BC9Y64/at/2tcfx5bgpknjvp3bksq8hcr/JW10283_Unity_ABMCampaign_Final.pdf) | ✅ Bóc tách — **hai danh sách tính năng cần TẮT (HDRP Asset + Frame Settings), bẫy Global Settings ↔ Pipeline Asset** → M4 **§26.0–§26.2** (bổ sung quan hệ nhiều Pipeline Asset ↔ Quality Level, cảnh báo `Lit Shader Mode = Both` tốn bộ nhớ GPU) + **1 ảnh** |
| 48 | 📕 [**E-book PDF** — Definitive guide to creating advanced VFX, 120 tr.](https://cdn.bfldr.com/S5BC9Y64/at/6qfsbqs59798rprm563f/The_definitive_guide_to_creating_advanced_visual_effects_in_Unity.pdf) | ✅ **Bóc tách TOÀN BỘ chương OPTIMIZATION (tr.98–110)** — 7 nghi phạm, Bounds, Mesh LOD, octagon/low-res transparency, case study Spaceship → M4 **§25** — phủ **100%**, kèm **17 ảnh** · §24 · §40.1 |
| 49 | [create.unity3d.com — Unity for Technical Artists](https://create.unity3d.com/tech-artists-key-toolsets) | ✅ Bộ công cụ TA (Shader Graph, VFX Graph, 2D Renderer) đã phủ ở M4 §37, §38 từ e-book URP |

---

## 👑 MODULE 5 — Tech Lead: CyberAgent Bible & Sentry ANR

| # | Nguồn / Source | Trạng thái |
|---|---|---|
| 50 | 📕 [**PDF bản tiếng Anh, 323 trang, 12 chương** — CyberAgent Unity Performance Tuning Bible v1.0.5](https://github.com/CyberAgentGameEntertainment/UnityPerformanceTuningBible/releases/download/v1.0.5/UnityPerformanceTuningBible_EN.pdf) | ✅ **Tải + bóc tách TOÀN VĂN (267 hình)** → M5 Phần A–E · **198/232 ảnh nội dung đã nhúng**, 34 ảnh còn lại là bìa chương/ảnh trùng đã duyệt loại |
| 51 | [blog.sentry.io — Fixing Unity ANRs with Sentry (Amanotes)](https://blog.sentry.io/fixing-unity-anrs-with-sentry-amanotes/) | ✅ **Toàn văn + 9 ảnh** → M5 Phần F. Số liệu đã đối chiếu với nguồn: **p95 24,18s · 17,8s → 3,71s · ANR 0,98% → 0,46%** |
| 52 | 📕 [**E-book PDF** — Unity Gamedev Field Guide (79 tr.)](https://content.cdntwrk.com/files/aT0xNDMwNzIwJnY9MSZpc3N1ZU5hbWU9dW5pdHktZ2FtZS1kZXYtZmllbGQtZ3VpZGUmY21kPWQmc2lnPTJmNGI2NGQzMzEyNDU4ODA1ODA0MWFiOTAwOTU3M2Qz) | ✅ ch. *Version control* + *Project organization* → M5 **Phần G** + **11 ảnh** (đã phủ 11/11 ảnh nội dung của hai chương này) |
| 53 | 📘 [**E-book PDF** — Version Control and Project Organization Best Practice Guide, **52 trang**](https://cdn.bfldr.com/S5BC9Y64/at/pr233rvht6m6rwxpp8kjkn8/2022_ABMVersionControlandProjectOrganizationinUnity_EBook_Final.pdf) | ✅ **Tải + bóc tách toàn văn** (grep landing page ra link PDF) → M5 **Phần H** (13 thuật ngữ, **4 hệ VCS Git/Perforce/SVN/Plastic + ma trận so sánh 18 tiêu chí**, 6 quy tắc thư mục, 5 chuẩn đặt tên, `.meta`, Git LFS, 7 thông lệ, Git Flow, **chuẩn CODE + script `KeywordReplace`**) + **29 ảnh** |
| 54 | 📗 [**E-book PDF** — 70+ tips to increase productivity with Unity 2020 LTS, **62 trang**](https://create.unity3d.com/ebook-improve-workflow) | ✅ **Tải + bóc tách toàn văn** → M5 **Phần I** — **bóc tách 100%**: Shortcuts Manager · Focused Inspector · Presets · SceneVisibility · Scene picking · `t:`/`l:` · Inspector Debug · QuickSearch · Sprite Atlas · **10 mẹo 2D** · Prefab/Nested/Variant · TextMeshPro · Snapping · Animation · Gizmos · Progressive Lightmapper · Light Probes · **9 Attribute** · Custom window/menu · Script templates · Addressables + CCD · `#define` · ScriptableObject · Assembly · IDE · Debugging (8 mẹo) · phím tắt VS · Device Simulator · Console Log Entry · Custom Compiler status + **79 ảnh** |
| 55 | 📕 E-book Mobile Perf — ch. *Project configuration* (tr.22–23), *Workflow and collaboration* (tr.48–49) | ✅ Bóc tách → M5 **Phần G** (§55–§56) |

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
| **M1 — Fresher** | 11 | 0 | 0 | 1 | **12** |
| **M2 — Junior** | 9 | 0 | 0 | 2 | **11** |
| **M3 — Senior** | 7 | 0 | 0 | 1 | **8** |
| **M4 — Tech Lead** | 19 | 0 | 0 | 2 | **23** * |
| **M5 — Tech Lead** | 6 | 0 | 0 | 0 | **6** |
| Tham khảo ➖ | — | — | — | — | **2** |

> \* M4 còn **2 mục ➖** (landing page rỗng · video YouTube) đã có nguồn thay thế — xem bảng M4 ở trên.

!!! note "Ghi chú về e-book PDF"
    3 file PDF trên `content.cdntwrk.com` là **tài liệu gốc đầy đủ**, giá trị cao hơn hẳn các trang landing page (vốn chỉ có form đăng ký). Cả 3 đã tải thành công và bóc tách được toàn văn bằng `pdftotext -layout`. Vì mỗi e-book trải nội dung qua nhiều Module, chúng được đánh dấu 🟡 và sẽ được khai thác dần theo từng Module.

    **Đã lưu trữ trong repo tại `_ebooks/`** (kèm bản `.txt` đã bóc tách sẵn, đã thêm vào `.gitignore` để không đẩy 22 MB binary lên Git):

    | File | Dung lượng | Số trang |
    |---|---|---|
    | `unity-optimize-mobile-game-performance.pdf` | 9.2 MB | 52 |
    | `unity-gamedev-field-guide.pdf` | 6.4 MB | 79 |
    | `unity-optimize-console-pc-performance.pdf` | 6.9 MB | — |
