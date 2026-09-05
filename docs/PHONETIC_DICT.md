# Từ điển phonetic TTS tiếng Việt (EverAI)

Tra cứu cách viết `text_phonetic` cho tech term / tên riêng khi làm script TTS.
`text_display` LUÔN giữ nguyên form English — xem quy tắc phonetic-vs-display trong memory.

> **Đọc file này TRƯỚC khi viết bất kỳ script TTS nào có tech term.** Term mới chưa có trong bảng → hỏi user cách họ phát âm, đừng bịa.

---

## 🚨 RULE TỐI THƯỢNG — ĐỌC tiếng Anh, KHÔNG DỊCH sang tiếng Việt

User chửi 2 lần (2026-07-06). Term tiếng Anh phải để voice bật ra **ÂM tiếng Anh**, bằng một trong hai cách:

**(a) Viết LITERAL English** — ưu tiên. EverAI đọc cụm English tech phổ biến rất tốt: `feature`, `Critical Section`, `Deadlock`, `Atomic`, `Screen Record`, `Timestamp`, `Reproduce`, `Optimistic`, `Production`, `build`, `unit test`, `code review` đều đọc sạch.

**(b) Phonetic Việt tạo ÂM English** — khi (a) hỏng. bug→"bấc/bức", Mutex→"Mutech", Heisenbug→"Heisenbug"/"Heisbuk".

**CẤM dịch NGHĨA sang tên tiếng Việt CHỈ ĐỂ NÉ PHÁT ÂM:**
| ❌ Sai | ✅ Đúng |
|---|---|
| Screen Record → "Quay Màn Hình" | literal English |
| Timestamp → "dấu thời gian" | literal English |
| Reproduce → "Bất Tái Hiện" | literal English |
| **bug → "lỗi"** | **"bấc" / "bức"** |

**Quy trình:** thử LITERAL English trước → whisper sai nhiều thì mới chuyển phonetic-Việt-của-âm-English. Với pipeline per-beat, fix lại 1 beat rất rẻ.

### ✅ Ngoại lệ: TÊN PHÁP BẢO (video truyền kỳ / tu tiên)

Việt hóa **được phép** khi nó là **thủ pháp đặt tên**, không phải cách chữa phát âm. Đây chính là kỹ thuật "đặt tên HAI TẦNG" của skill `truyen-ky-it`: tên KIẾP (vấn đề) + tên CÔNG PHÁP (giải pháp) + reveal *"Người đời gọi nó là `<tech>`"*. VD: Loạn Cảnh Kiếp → Vạn Cảnh Quy Nhất Đạo → **Docker**.

Đủ 3 điều kiện thì dùng:
1. Tên Hán-Việt đóng vai pháp bảo / công pháp / kiếp nạn trong mạch truyện
2. **Có reveal tên English** ngay sau đó — khán giả không được mất term thật
3. Display vẫn giữ English

**Test phân biệt:** bỏ tên Việt đi, câu còn nghĩa không?
- Chỉ mất *cách đọc* → đang chữa phát âm → **CẤM**, quay về âm English (`bug`→"bấc").
- Mất cả *hình tượng / mạch truyện* → là thủ pháp → **ĐƯỢC** (`Git Blame`→"Truy Tội Kính").

---

## Acronym & brand

| Term | Phonetic chuẩn | ❌ Bịa sai |
|---|---|---|
| AGI | **ây di ai** | A gờ y |
| GPT | **gi pi ti** | Gờ Pê Tê |
| ChatGPT | **Chat gi pi ti** (không viết thẳng "ChatGPT") | Chát Gờ Pờ Tê |
| JSON | **jay sờn** | Jê Sờ Ô Ên |
| NPM | **en pi em** | Nờ pi em |
| API | **ây pi ai** (3 chữ) | Ây Pi (2 chữ) |
| MCP | **em xi pi** | Em Cê Pi |
| CSV | **xi ét vi** / giữ "CSV" | — |
| CV | **xi vi** | — |
| PDF | **pi đi ép** | Pê Đê Ép |
| SEO | **ét i ô** | — |
| ATS | **ây ti ét** | — |
| OCR | **ô xi a** | — |
| JD | **mô tả công việc** | — |
| AI | **ây ai** | — |
| **HR** | **hát-rờ** (tên chữ cái VN — user sửa 2026-07-24) | ❌ **Ết-Rờ** ("HR là Hát R sao lại ẾT R?") |
| FTP | **ép-tê-pê** (tên chữ cái VN) | ép-ti-pi |
| PM / QA / CEO / IDE | **Pi-Em / Kiu-Ây / Xi-I-Âu / ai-đi-i** | — |
| KPI | **kê-pi-ai** | — |
| GPU / CPU | **Gi Pi Iu / Xi Pi Iu** | — |
| **Helpdesk** | **Hép Đét** (chốt 2026-08-04) | ❌ Heo-Đét (mất âm p); ❌ Hép-sờ Đét-sờ (dư đuôi) |
| .xlsx / .docx / .pdf / .pptx | **file Excel / file Word / file PDF / file PowerPoint** | ích xờ lưu / đốc xơ |
| ARC-AGI | **Ác ây di ai** | — |
| GitHub | **gít hấp** | — |
| Claude | **Cờ lau** (/klɔːd/) | Cờ-lốt |
| Opus / Sonnet / Haiku | **Ô pớt / Sô nét / Hai cu** | — |
| token | **tâu cân** / giữ "token" | — |
| OpenAI / Anthropic / Gemini | **Ô-pen Ây-Ai / An-thrô-pic / Giê-mi-nai** | — |
| Netflix / Facebook / Google | **Nét-flíc / Phây-buc / Gu-gồ** | — |
| NVIDIA / CUDA | **En-vi-đi-a / Cu-đa** (CUDA cần buffer "Đó là" nếu cuối câu) | — |
| PreToolUse / PostToolUse | **pri tu húc / pót tu húc** (bỏ "Use") | Pri Tu Úc Húc |
| apiKeyHelper | **API key helper** (giữ English) | Ây Pi Ky Hép Pờ |
| additionalDirectories | **additional directories** (English) | Additional Đai rếch tô ri |
| settings.json | **settings chấm jay sờn** | settings chấm Jê Sờ Ô Ên |

## Infra / system design

| Term | Phonetic chuẩn | ❌ Bịa sai |
|---|---|---|
| Cache | **Kếch** (chốt 2026-06-04) | Két (→"kết"), Cát-sơ (→"cắt sơ") |
| Database | **Đa-ta-bây** (chốt 2026-06-04) | Đây-ta-bết, Đây-ta-bê-sờ |
| Backend | **Béc-èn** | — |
| Frontend | **Phờ Rôn Teng** (tách Phr thành phơ/rôn/teng) | ❌ Phrọn-Teng (→"đon ten") |
| Kubernetes | **Ku-bơ-nê-tít** | — |
| framework | **phờ-rêm-uốc** | phrêm-uộc (→"khân uộc") |
| Stack Overflow | **Sì-tác Ô-vơ-flâu** | Ô-vơ-phlâu (→"overload") |
| TensorFlow / PyTorch | **Ten-xơ Phlâu / Pai-toóc** | — |
| Inference | **In-phơ-rân-sờ** | In-phơ-rừn (→"Infusion") |
| deploy | **đép-loi** | — |
| Sprint | **sờ-prin-tờ** | sờ-prin (→"Spring") |
| **production** | viết **LITERAL "Production"** | ❌ prô-đắc-sần → **"Coduction"** (verified 2026-08-12, buffer cũng không cứu) |
| rollback | Việt hóa **"khôi phục"** | rôn-bách (→"dôn bách") |
| Software | **Sóp-goe**; Software Engineering → **"kỹ sư phần mềm"** | sóp-goe en-gi-ni-ờ-ring |
| engineering / engineer | **en-gi-ni-ơ** (KHÔNG thêm "-ring") | en-gi-ni-ờ-ring (→"ờ ring") |
| Software Đạo | **"Phần Mềm Đạo"** | ❌ Sóp-goe Đạo → rác "thòng mít"/"shop qua đạo" |
| code | **cốt** | code (đọc cứng) |

## Dev / concurrency / QA

| Term | Phonetic chuẩn | ❌ Bịa sai |
|---|---|---|
| Race Condition | viết **literal "Race Condition"** | ❌ Rếch/Rết Con-đi-sần (→"Z-condition") |
| Critical Section / Deadlock / Atomic | viết **literal English** — đọc sạch | — |
| Mutex | **Miu-Tếch** | — |
| Heisenbug | **Hai-Xừn-Bấc** (→"Heisenberg", đúng gốc pun) | — |
| Developer | **Đép** (cách dev VN tự gọi) | Đì-Vê-Lốp-Pơ (dài, dễ lỗi) |
| feature | **phi-chơ** | — |
| Build / Unit Test / Code Review | **Biu / Diu-Nít-Tét / Cốt Ri-Viu** ⚠️ "bản biu"→"bản bưu", viết "bản **build** mới" | — |
| deadline | **đét-lai** | — |
| Optimistic (locking) | video thường: **literal "Optimistic"**. Video truyền kỳ: **"phép Lạc Quan"** (tên pháp bảo, phải reveal English kèm) | — |
| Git Blame | video thường: **literal "Git Blame"**. Video truyền kỳ: **"Truy Tội Kính"** (tên pháp bảo, phải reveal English kèm). ⚠️ phonetic "Bờ-Lêm"/"Blêm" HỎNG →"lên" | Gít Bờ-Lêm |
| **post:read** (và mọi `x:y`) | tách bằng dấu phẩy: **"pốt, rít"** | ❌ `pốt rít` viết liền → **"portrait"** (dính ở 4 beat) |
| **Constraints** | giữ literal **"Constraints"** | ❌ "Con Sờ Trên" → nghe thành tiếng Việt vô nghĩa *"còn sờ trên"* |
| **Least Privilege** | giữ literal | ❌ "Lít Pri Vi Lết" → "**Lead** Privilege" |
| **Resource** | ⚠️ **chưa có cách nào chuẩn** — "Ri Sọt"→"Resort", "Ri Sọt Xơ"→"Rest". Chấp nhận nếu chữ hiện trên hình | — |
| Permission / Session | **Pơ Mít Sần / Sét Sần** (suy từ `tcp-dao`: Transmission→"Tran Sờ Mít Sần", Congestion→"Con Giét Sần") | — |
| Role / User / Admin | **Rôn / Diu Dơ / Át Min** | — |
| **merge** | ⚠️ **PHỤ THUỘC TỪ ĐỨNG SAU** (đo 2026-08-25). Sau dấu câu + từ KHÔNG bắt đầu bằng đ/d thì literal `Merge` đọc sạch: "Anh, Merge, nhé?" ✓ · "Ai. Merge? Tất cả" ✓ · "Merge. xi ai xanh." ✓. Nhưng **`merge` + `đi` → "must"** ở cả 3 lần gen — /dʒ/ cuối bị "đi" nuốt. Chấp nhận được vì dev VN cũng đọc "mớt", nhưng phải có chữ MERGE trên hình cùng lúc | `merge` giữa câu không có dấu câu → "Musk" / "Murs" / "I must" |
| **pull** | **pun** ("Em pun cốt mới chưa") | ❌ `pull` → "phù"/"pu"; ⚠️ whisper hay ghi lại thành "phun" dù âm ĐÚNG — phải test primed mới biết |
| **timeout** | **tai-mao** | ❌ `timeout` → "Timiak" |
| **cart** | **cát** | ❌ `cart` → "Các" (thành từ chỉ số nhiều) |
| **Pull Request** | giữ literal **"Pull Request"** — đọc sạch, khác hẳn `pull` đứng một mình | — |
| **Prompt** | **"Prôm"** (đo `5-kieu-nguoi-ai` 2026-09-04) | ❌ literal `Prompt` → **"Prop"** (5/5 beat, priming KHÔNG cứu được); ❌ "Phờ-rôm" → **"From"** (ph = /f/, sai phụ âm đầu). "Pờ-rôm" cũng ra "Prom" ✓ nhưng "Prôm" gọn hơn |
| **Sinh** (trong tên chiêu) | ⚠️ "Lỗi **Sinh** Lỗi" → đọc "lỗi **xin** lỗi" → đổi **"Đẻ Ra"** | Sinh (→"xin") |

## Design / business / đời thường

| Term | Phonetic chuẩn | Ghi chú |
|---|---|---|
| Designer | **Đi-Dai-Nơ** | — |
| Figma | **Phích-Ma** | — |
| React | **Ri-Ắc** | — |
| pixel | **pi-xeo** | — |
| slide | **sờ-lai** | — |
| laptop | **láp-tóp** | — |
| Meeting | **Mít-tinh** | — |
| golf | **gôn** | dev/biz VN gọi vậy |
| All in | **Ôn-in** | — |
| **Sales** | **Sêu** | ⚠️ "Sêu." cuối câu + từ sau bắt đầu bằng "Đ" → garble "sale rắc". Chèn phẩy + buffer: "Hạ phẩm Sêu, phải đi tìm khách" |
| **demo** | **đì-mô** | ⚠️ "đì-mô ba ngày" → **"đi mua"**. Phải chèn phụ âm mạnh sau: "đì-mô **suốt** ba ngày" ✓ |
| Call Margin | **Cọt Mác-gin** | → "cọt mark zinn"/"maxine", nghe ra ✓ |
| **mute** | Việt hóa **"tắt tiếng"** | ❌ "muýt"/"mute" → "mít"/"meet" |
| share màn hình | Việt hóa **"chia sẻ màn hình"** | — |

## 🎨 UI / Design terms → VIỆT HÓA HẾT

User 2026-07-01: *"English đọc chuối quá sai nhiều vãi... Việt hóa lên đọc cho chuẩn"*.

icon→**biểu tượng** · font→**phông chữ** · spacing→**khoảng cách** · layout→**bố cục** · animation→**hiệu ứng** · dark mode→**chế độ tối** · padding→**khoảng đệm** · border→**viền** · shadow→**bóng đổ** · line-height→**dòng chữ giãn** · zoom→**phóng to** · card→**thẻ** · sidebar→**thanh bên** · website→**trang web** · mobile→**mô-bai**/điện thoại

Display VẪN hiện English (dev đọc), audio Việt (đọc êm). Chỉ giữ phonetic cho tech-term dev bắt buộc: Figma / React / pixel / Frontend / Designer.

---

## ⚡ Cụm dài vs từ đơn

**Câu/cụm English NHIỀU TỪ → viết LITERAL English.** EverAI v1.5 đọc nguyên câu tiếng Anh rất tự nhiên: *"I have no idea why this works"*, *"If this breaks, I'm sorry"*, *"Quick fix"*, *"Do not remove"* → whisper đọc lại chuẩn. Phonetic kiểu "goai đít gọc" / "Íp đít brếch" thì méo.

**Từ đơn / acronym / tên riêng → PHẢI phonetic.** EverAI đọc từ đơn English hay sai: Cache→"cách", works đơn lẻ→"guạc". (Học 2026-06-06, comment-chan-dong)

## ⚠️ Glitch: list staccato lặp cấu trúc

2026-07-01 — "Nút bấm đổi. Biểu tượng đổi. Phông chữ đổi. ..." (7× "X đổi" giống hệt) → EverAI **tự chèn rác** vào giữa ("...phông chữ đổi, TRONG WEB, khoảng cách đổi").

**Fix:** liệt kê DANH TỪ rồi chốt một lần — "Nút bấm. Biểu tượng. Phông chữ. ... Cho đến cả chế độ tối. Tất cả. Đều đổi." Hết glitch, sync cũng sạch hơn (mỗi thẻ = mỗi danh từ).

Whisper KHÔNG bắt được glitch này → phải isolate-transcribe `word_timestamps` vùng nghi để soi rác.

---

## Nguyên tắc chọn phonetic

1. **Acronym chữ cái** (NPM, API, MCP, CSV, PDF, CV): đọc từng chữ theo cách dev VN gọi tự nhiên, KHÔNG ghép vần kiểu lớp 1.
   - ⚠️ **Có 2 hệ tên chữ cái — phải chọn đúng hệ người VN dùng cho acronym ĐÓ:**
     - **Hệ VN**: H="hát", R="rờ", F="ép", T="tê", P="pê", G="giê", L="lờ" → HR = "hát-rờ", FTP = "ép-tê-pê"
     - **Hệ Anh**: A="ây", P="pi", I="ai", M="em", X="xi" → API = "ây-pi-ai", MCP = "em-xi-pi"
   - Acronym **nghề nghiệp/đời thường** (HR, FTP) → thường hệ VN. Acronym **tech thuần dev** (API/MCP/NPM/GPT) → thường hệ Anh. Không chắc → **hỏi user, đừng bịa**.
2. **Word-acronym** (JSON, JWT, SQL): đọc như 1 từ — jay-sờn, đáp-bồ-iu-ti, ét-quy-eo.
3. **CamelCase tech** (PreToolUse, apiKeyHelper): hoặc Việt hóa rút gọn ("pri tu húc"), hoặc giữ English nguyên ("API key helper") — Adam EverAI premium handle được.
4. **Brand/tool name**: dùng phonetic VN có sẵn — gít hấp / Ô pớt / Sô nét / Hai cu.
5. **Không chắc:** đưa script cho user duyệt trước khi burn TTS.

## ⚖️ LITERAL hay PHIÊN ÂM? — KHÔNG có luật chung, phải ĐO từng từ

Đo ở `mat-ngon-chieu-mo` (2026-08-26). Cùng là **từ đơn tiếng Anh**, kết quả ngược nhau hoàn toàn:

| Để LITERAL mới đúng | Phiên âm Việt mới đúng |
|---|---|
| **Recruiter** — "Ri Crút Tơ" sai **7/9 lần** (*Retrooter · Rechuter · Rita · Retutor · Retroader · Researcher*) | **deadline** → "đét-lai" ✅ |
| **Range** — "Reng" sai **3/3** (*ranh · rank · gen*) | **scope** → "sờ cốp" ✅ |
| **assignment** — "ơ-sai-mần" → *"ơ Simon"* | **laptop** → "láp-tóp" ✅ |
| **Director** — "Đi Rếc Tơ" → *"digester" / "Dezeter"* | **form** → "phom" ✅ |
| **Team Lead** — "Tim Lít" → whisper ghi *"tim lít"*, để literal thì ra *"Team Lead"* | **upload** → "úp-lôt" ✅ |

→ **Quy trình đúng: viết bản đầu bằng phán đoán, rồi GATE 3 đo, rồi lật những từ sai sang phương án còn lại.** Đừng tin một luật chung nào cả. Từ nào lặp nhiều lần trong bài (Recruiter 9 lần) thì phải ưu tiên đo trước.

⚠️ **Vẫn phải kiểm ngay cả khi phiên âm "trông có vẻ ổn":** `Chiêu Mộ` (tiếng Việt thuần!) đọc thành **"triều mộ"** đúng ngay beat xướng tên tập. Chèn dấu phẩy `"Mật Ngôn, Chiêu Mộ"` là hết. Tên tập/tên series sai thì hỏng cả video mà nghe lướt rất khó bắt.

## 🔠 Đánh vần acronym: chữ **R** và chữ **A** ĐỤNG NHAU

Trả giá ở `rbac-dao` (2026-08-26). Viết **RBAC → "A Bi Ây Xi"** vì tưởng R hệ Anh đọc là "a" (/ɑːr/). Đánh vần ra lại thành **A-B-A-C = ABAC**. Whisper đọc lại **9/9 lần đều ra "ABAC"** — mà video đó có hẳn một đoạn đối chiếu RBAC ≠ ABAC ≠ ReBAC, tức là ý chính bị xoá sạch.

| Acronym | ✅ Đúng | ❌ Sai |
|---|---|---|
| RBAC | **Rờ Bi Ây Xi** | ~~A Bi Ây Xi~~ (= ABAC) |
| ABAC | **Ây Bi Ây Xi** | — |
| ReBAC | **Rờ I Bi Ây Xi** | ~~A I Bi Ây Xi~~ |

**Luật:** chữ **R** trong acronym luôn viết **"Rờ"** (hệ VN), đừng dùng "a". Chỉ chữ **A** mới được là "Ây".

→ **Trước khi chốt phiên âm acronym, đánh vần ngược lại xem có ra đúng acronym đó không.** Nhất là khi trong cùng script có 2+ acronym gần giống nhau.

## 🔢 Whisper LUÔN ghi số bằng CHỮ SỐ — bẫy chọn anchor

Đọc "bảy file" → whisper ghi **`7 file`**. Tương tự `hai`→2, `ba`→3, `mười`→10, `hai mươi`→20, `ba mươi`→30, `tám trăm`→800.

→ **Không bao giờ neo anchor vào một con số viết bằng chữ.** Neo vào danh từ đi kèm (`file`, `giây`, `người`, `phút`). Đã cắn ở `mat-ngon-bang-huu` (800ml) và suýt cắn 5 anchor ở `mat-ngon-kiem-tu`.

## 🎯 `ch` ↔ `tr`: whisper trộn nặng — dùng PRIMED-FLIP để tách lỗi thật khỏi lỗi đoán

Đo ở `tha-tam-thong` (2026-08-28). Whisper tiếng Việt gộp `ch` và `tr` rất nặng, nên **đọc lại thấy chữ khác thì CHƯA phải TTS sai**. Suýt re-gen thừa 2 beat vì tin thẳng transcript.

**Cách tách:** transcribe cùng một beat HAI lần — một lần `initial_prompt=None`, một lần `initial_prompt` có chứa từ đang nghi (`primed_tr.py`).

| Từ | Không prime | Có prime | Kết luận |
|---|---|---|---|
| `chan` | *"tràn"* | **`chan`** ✅ | whisper đoán bậy → **giữ nguyên** |
| `ghost em` | *"gốt stem"* | **`ghost em`** ✅ | whisper đoán bậy → **giữ nguyên** |
| `Chưởng môn` | *"Trưởng môn"* | *"Trưởng môn"* ❌ | **lỗi TTS thật** (13/13 lần) |

> **LUẬT: primed mà FLIP về đúng = whisper đoán bậy, đừng re-gen. Primed mà KHÔNG flip = lỗi TTS thật.**

`Chưởng` → giọng Adam nhập `ch` vào `tr` ở vần `ưởng`. Không chữa được, và cũng **không đáng chữa**: gần đồng âm trong giọng Bắc, chữ trên hình vẫn hiện `CHƯỞNG MÔN`. Chấp nhận + ghi lại, đúng luật "ổn định qua nhiều lần gen = lỗi cấu trúc".

## ❗ Chỗ NGẮT CÂU MẠNH → EverAI chèn CHỮ RÁC

Đo ở `tha-tam-thong` (2026-08-28). `"Đệ tử nguyện ý! Trong đầu hắn: ..."` đọc ra **"nguyện ý, *kinh*, trong đầu hắn"** — thừa hẳn một từ vô nghĩa, đúng ngay beat punchline.

Đo lần 2 ở `mat-ngon-thien-lao` (2026-08-28) — **lỗi này KHÔNG chỉ ở dấu `!`**. Dấu chấm cũng dính: `"Thiên Lao nghe. Có một con số đang sai."` đọc ra **"Thiên Lao nghe, *chúng* có một con số…"** — thừa hẳn chữ "chúng", đúng beat mở màn mật ngôn thứ nhất. Đổi thành **dấu hai chấm** `"Thiên Lao nghe: Có một..."` là hết.

| Dính ở | Sửa thành | Video |
|---|---|---|
| `nguyện ý! Trong đầu hắn` → thừa *"kinh"* | `!` → `.` | `tha-tam-thong` |
| `nghe. Có một con số` → thừa *"chúng"* | `.` → `:` | `mat-ngon-thien-lao` |

→ **Quy tắc chung: thấy chữ rác xuất hiện, nhìn ngay dấu câu NGAY TRƯỚC nó và đổi sang dấu nhẹ hơn** (`!` → `.` → `:` → `,`). Rẻ hơn nhiều so với viết lại câu. Bốn beat đối đáp còn lại trong cùng video dùng y hệt cấu trúc `"... nghe. <câu>"` mà KHÔNG dính — nên đây là tương tác với **từ đứng ngay sau**, không phải lỗi của cấu trúc.

## 🅰️ `AI` (English) vs `ai` (tiếng Việt) — bẫy của check_coverage

`5-kieu-nguoi-ai`: script có cả `AI` (viết hoa, đọc **"ây ai"**) lẫn chữ **"ai"** tiếng Việt (*"không tin bất kỳ ai"*, *"những ai đã đối xử"*). Nếu `check_coverage.py` lowercase TRƯỚC rồi mới thay thì hai chữ này dính làm một, phiên âm sai toàn bộ.

→ **Thay `AI` (case-sensitive) TRƯỚC khi lowercase.** Áp dụng cho mọi acronym trùng mặt chữ với từ tiếng Việt: `AI`/`ai`, `CÓ`/`co`, `BA`/`ba`.

⚠️ Whisper cũng hay ghi `ây ai` thành **"ai ai"** khi xung quanh toàn tiếng Việt — nhưng primed lại ra `AI` ✅, tức **audio đúng**. Đừng re-gen.

## 🔂 Beat chỉ có MỘT TỪ → whisper gần như chắc chắn đoán sai

`mat-ngon-thien-lao`: beat `"Tìm."` đứng riêng → whisper ghi **"Team"**. Primed lại ra `Tìm.` ✅ → **audio đúng, KHÔNG phải lỗi TTS**, chỉ là whisper không có ngữ cảnh để đoán.

→ Đừng re-gen. Nhưng **anchor phải neo theo token whisper GHI** (`team`), không theo chữ trong script — nếu không sẽ MISS. Ghi chú lại trong `gen_sync.py` để người sau không tưởng là gõ nhầm.

→ **Trong `text_phonetic` đừng dùng `!` giữa câu, đổi thành `.`** — `text_display` vẫn giữ `!` bình thường. Cùng họ với glitch "list staccato lặp cấu trúc" ở trên: EverAI hay đẻ rác ở chỗ ngắt nhịp mạnh.

## Verify

Whisper diff post-TTS là bắt buộc, **nhưng whisper VN không reliable cho tech term** — ưu tiên user feedback. Whisper cũng không bắt được nuốt/rụt âm; xem quy trình isolate-transcribe trong memory TTS pitfalls.
