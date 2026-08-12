# CLAUDE.md — Unity Training Hub

Dự án MkDocs xây dựng trang đào tạo Unity song ngữ Việt–Anh, nội dung bóc tách từ các URL trong `src/raw-optimization-data.txt`.

---

## 🔁 RULE BẮT BUỘC — Chạy TRƯỚC MỖI PROMPT

Trước khi bắt tay thực hiện **bất kỳ** yêu cầu nào của user, luôn chạy đủ 3 bước sau theo đúng thứ tự:

### Bước 1 — Reindex codebase

```
mcp__codebase-memory__index_repository(repo_path="/Users/playviet/Documents/_BZ/unity-training-hub", mode="full")
```

Đảm bảo knowledge graph phản ánh đúng trạng thái hiện tại của repo trước khi truy vấn.

### Bước 2 — Lookup trong codebase

Dùng knowledge graph để nắm ngữ cảnh liên quan tới yêu cầu **trước khi** viết/sửa file:

```
mcp__codebase-memory__search_code(project="Users-playviet-Documents-_BZ-unity-training-hub", pattern="<từ khóa liên quan>")
mcp__codebase-memory__get_architecture(project="Users-playviet-Documents-_BZ-unity-training-hub")
```

Mục tiêu: biết nội dung nào **đã có sẵn** để không viết trùng lặp, và biết file nào cần cập nhật kèm theo.

### Bước 3 — Lookup trong `raw-optimization-data.txt`

Luôn tra file nguồn gốc trước khi tổng hợp nội dung:

```bash
grep -oE 'https?://[^ )>"]+' src/raw-optimization-data.txt | sed 's/[.,]$//' | sort -u   # liệt kê URL
grep -n -i "<từ khóa>" src/raw-optimization-data.txt                                     # tra ghi chú
```

Đối chiếu thêm với `src/00-nguon-du-lieu.md` (bảng kiểm 55 URL) để biết nguồn nào đã cào, nguồn nào còn thiếu.

### Bước 4 — Mới thực thi prompt

Chỉ sau khi hoàn tất 3 bước trên mới bắt đầu thực hiện yêu cầu của user.

> ⚠️ **Không bỏ qua rule này kể cả với yêu cầu trông có vẻ đơn giản.** Lý do rule tồn tại: đã từng xảy ra việc đánh dấu một URL là "đã cào" trong khi trang đó thực chất rỗng (JS-rendered), khiến bỏ sót e-book PDF 75 trang là nguồn chính của cả Module.

---

## 📁 Cấu trúc dự án

```
src/                              # docs_dir — nguồn Markdown
├── index.md                      # trang chủ
├── 00-nguon-du-lieu.md           # bảng kiểm 55 URL ↔ 5 Module
├── raw-optimization-data.txt     # ⭐ FILE NGUỒN GỐC — luôn tra trước khi viết
├── 01-fresher/                   # Module 1
├── 02-junior/                    # Module 2
├── 03-senior/                    # Module 3
├── 04-tech-lead/                 # Module 4 & 5
├── assets/                       # ảnh local (.png)
└── stylesheets/custom.css        # định nghĩa .bilingual-row / .col-vi / .col-en

docs/                             # site_dir — HTML build ra, đẩy lên GitHub Pages
_ebooks/                          # PDF gốc + bản .txt đã bóc tách (gitignored)
.venv/                            # môi trường Python (gitignored)
```

---

## ✍️ Quy ước nội dung

### Định dạng 2 cột song ngữ

```html
<div class="bilingual-row">
<div class="col-vi">...tiếng Việt...</div>
<div class="col-en">...English (nguyên văn nguồn)...</div>
</div>
```

- Cột VI **trước**, cột EN **sau** (khớp thứ tự trong `custom.css`).
- Bên trong dùng HTML thô (`<p>`, `<ul>`, `<code>`) — **không** dùng cú pháp Markdown, vì `md_in_html` không xử lý trừ khi có `markdown="1"`.
- Code block C# đặt **ngoài** `bilingual-row`, dùng fenced ```` ```csharp ```` để có syntax highlight + nút copy.

### Ảnh

- Tải về `src/assets/`, nhúng bằng `<img src="../assets/<tên>.png">`.
- `mkdocs.yml` đặt `use_directory_urls: false` — **bắt buộc** để `../assets/` resolve đúng, vì MkDocs không rewrite `src` trong HTML thô.
- Trích ảnh từ PDF: `pdfimages -png -f <trang> -l <trang> file.pdf out` hoặc `pdftoppm -png -r 150 -f <trang> -l <trang> [-x -y -W -H]` cho hình vector.
- **Luôn xem ảnh bằng tool Read trước khi nhúng** để đặt tên và viết caption đúng.

---

## 🛠️ Lệnh thường dùng

```bash
.venv/bin/mkdocs build --strict     # build, phải sạch lỗi
.venv/bin/mkdocs serve              # xem local
```

Kiểm tra ảnh không bị hỏng đường dẫn sau khi build:

```bash
python3 -c "
import re,os,glob
for p in glob.glob('docs/**/*.html',recursive=True):
    b=os.path.dirname(p)
    bad=[s for s in re.findall(r'<img src=\"([^\"]+)\"',open(p).read())
         if not s.startswith(('http','data:')) and not os.path.exists(os.path.normpath(os.path.join(b,s)))]
    if bad: print(p,bad)
"
```

Cào web (`html-to-text` cài global, không có CLI — dùng wrapper Node):

```bash
curl -sL -A "Mozilla/5.0 ..." "<URL>" -o page.html
node -e "const{convert}=require('/opt/homebrew/lib/node_modules/html-to-text');\
let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(convert(d,{wordwrap:false})))" < page.html
```

---

## ⚠️ Bẫy đã gặp

| Bẫy | Cách xử lý |
|---|---|
| Trang `unity.com/resources/*` và `resources.unity.com/*` rỗng nội dung | JS-rendered + form gate. **Grep HTML tìm link PDF**: `grep -oE 'https?://[^"]*\.pdf' page.html` |
| `learn.unity.com/tutorial/*` trả 404 | Unity Learn đã tái cấu trúc, nhiều tutorial cũ không còn |
| `cgcookie.com` trả ~5 KB | Cloudflare JS challenge — không cào được bằng curl |
| Nav `mkdocs.yml` dạng `01-fresher/` | Không hợp lệ với MkDocs thuần (cần plugin `awesome-pages`) — khai báo file tường minh |
| `pdftotext` / `pdfimages` thiếu | `brew install poppler` |
| `blog.unity.com` trả HTML nhưng `h2t.js` xuất ra **rỗng** | Dùng **Jina reader**: `curl -sL "https://r.jina.ai/<URL>" -o out.md` — trả về Markdown sạch kèm URL ảnh gốc (`cdn.sanity.io`) |
| Ảnh trong bài blog Unity | Grep HTML: `grep -oE 'https?://[^"]+\.(png|jpg)' page.html`, lọc bỏ `logo|icon|favicon|avatar|sprite`, rồi tải từ `cdn.sanity.io` (KHÔNG qua `blog.unity.com/_next/image`) |
| `pdfimages` xuất **hàng chục ảnh rác** (smask, icon) | Lọc theo dung lượng: xoá file `< 60 KB` rồi `ls -S` để duyệt các ảnh lớn nhất trước |
| Anchor `#tên-mục` bị vỡ trong tiếng Việt | MkDocs **BỎ ký tự `đ`/`Đ`** khi slugify (`đ` → rỗng): `19. Shadow — Point Light tốn GẤP 6 LẦN` → `#19-shadow-point-light-ton-gap-6-lan`. **Luôn verify bằng script**: đối chiếu `href="#..."` trong `.md` với `id="..."` trong `docs/*.html` |
| Chèn phần mới vào GIỮA tài liệu làm **lệch số chương** | Tách file tại tiêu đề mốc, renumber phần đuôi bằng regex qua **token trung gian** (31→A→33) để tránh va chạm, rồi sửa các anchor trỏ tới phần đuôi |
