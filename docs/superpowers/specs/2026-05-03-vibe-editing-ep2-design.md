# Vibe Editing — Ep2: AI Tự Cài Cho Vợ (Chỉ Cần Gõ Lệnh)

**Date:** 2026-05-03
**Status:** Design draft v3 — pending bro approval
**Series:** Vibe Editing (Ep2 of 4)
**Replaces:** `2026-04-29-vibe-editing-ep2-design.md` (slide carousel — bỏ)

---

## 0. Big Idea

**Concept:** Vợ chỉ cần làm DUY NHẤT một việc — tải IDE về. Còn lại AI tự cài hết.

Không Next-Next-Done. Không click installer. Không gõ `winget install` từng cái. Chỉ:
1. Tải IDE (Cursor / Antigravity / Claude Code)
2. Mở chat với AI
3. Kéo file `README.md` của repo vào chat
4. Bảo AI: *"kiểm tra máy giúp anh, thiếu gì thì cài hộ"*
5. AI tự đọc README → tự `git clone` (nếu chưa có Git thì AI cài Git trước) → tự `pip install` / `npm install` → báo xong

**Mức ngu của vợ cần:** = 0. Chỉ biết tải file + kéo file vào chat.

---

## 1. Format

- **Aspect:** 9:16 portrait 1080×1920
- **Duration:** ~4-5 phút (240-300s)
- **Quay:** **1 video continuous** — bro screen + voice 1 take, mình hậu kỳ cắt + speed-up + add overlay
- **Style:** kế thừa Ep1 — paper cream slide xen kẽ với screen recording thật
- **Voice persona:** **chồng-vợ** (lock từ Ep1 — `chồng/anh` xưng + `vợ/các vợ` gọi)
- **Music:** lofi acoustic ~0.08, sidechain duck với voice

---

## 2. Beat Sheet — 5 Beat

| # | Time | Beat | Loại | Tóm tắt |
|---|------|------|------|---------|
| 0 | 0–20s | **HOOK** | 🎥 Face-cam (đã quay) | `7786038092972.mp4` — bóc phốt tool/dịch vụ trả tiền |
| 1 | 20–40s | **VÀO BÀI + LỜI HỨA** | 🎨 Slide Remotion | "Vợ chỉ làm 1 việc — tải IDE. Còn lại AI tự cài." |
| 2 | 40–80s | **BƯỚC 1 — TẢI IDE** | 🎬 Screen rec browser | Cursor / Antigravity / Claude Code — vợ chọn 1, tải về cài |
| 3 | 80–120s | **BƯỚC 2 — MỞ CHAT + KÉO README** | 🎬 Screen rec IDE | Mở conversation, kéo file `README.md` từ repo (hoặc URL GitHub) vào chat |
| 4 | 120–215s | **BƯỚC 3 — AI CHECK ENV + CLONE + TẠO `.env`** | 🎬 Clip 45s đã có + slide phụ | **DÙNG TRỰC TIẾP clip 45s bro đã quay** — clip này có ĐỦ: lệnh chat AI check môi trường + AI clone + trỏ vào `env.example`. Mình thêm slide intro 8s + slide chuyển tiếp `env.example → .env` 12s + slide hướng dẫn 3 API key free 30s xen kẽ + voice over đầy đủ |
| 5 | 215–320s | **BƯỚC 4 — DÙNG SKILL ĐẺ VIDEO + MENTION DOWNLOAD** | 🎬 Screen rec live | Bro show `/the-review` (Claude Code) hoặc kéo folder skill (Cursor/Antigravity). Quay debate AI lên kịch bản Ep2 này. **Lúc đang quay debate, bro mention nhanh 20s**: paste link YT/TT/FB → AI tải sạch watermark + warning đừng ăn cắp (sẽ làm clip riêng tập sau). KHÔNG demo, chỉ giới thiệu qua. |

**Total:** ~5 phút 20s. **KHÔNG có outro** — Beat 5 cut thẳng END.

**Bỏ:**
- Beat test render standalone (`VibeEditingIntro`) → vào thẳng demo skill the-review thật
- Outro face cam → face cam đã ở Beat 0
- Outro Remotion mascot + Ep3 teaser → KHÔNG hứa moi tool trả phí (Veo/Kling/FLUX/Suno) vì vợ không có tiền mua key

---

## 3. Script Narration — Persona Chồng-Vợ

### 🎬 BEAT 1 — VÀO BÀI (20s)
> *"Quay lại đây các vợ. Tập này chồng dạy theo kiểu MỚI — vợ chỉ làm đúng MỘT việc thôi: tải IDE về máy. Còn lại ây ai tự cài hết. Không Next Next Done, không gõ lệnh `winget` gì hết. Vợ chỉ kéo thả file. Sẵn sàng chưa? Vô."*

### 🎬 BEAT 2 — TẢI IDE (40s) | *Screen rec browser*

| T | Voice | Action |
|---|-------|--------|
| 0–6s | "Bước một. Vợ cần một con ây ai làm thư ký. Có ba lựa chọn cho vợ." | Slide intro Remotion |
| 6–16s | "Đứa số một — Antigravity của Google. MIỄN PHÍ giới hạn token. Vợ nào tiết kiệm xài cái này. Vào antigravity chấm google chấm com, bấm Download." | Browser → Antigravity site → Download click |
| 16–24s | "Đứa số hai — Cursor. Đẹp, dễ xài cho vợ mới. Hai mươi đô một tháng. Vào cursor chấm com, bấm Download." | Tab Cursor → Download |
| 24–32s | "Đứa số ba — Claude Code, chồng đang xài. Hai mươi đô. Vào claude chấm ai slash code." | Tab Claude Code → page |
| 32–40s | "Vợ chọn MỘT thôi nha — đừng tham cài hết. Tải về, cài vào máy như cài Word vậy. Cài xong mở lên." | Click installer, double-click cài, mở IDE |

### 🎬 BEAT 3 — KÉO README VÀO CHAT (40s) | *Screen rec IDE*

| T | Voice | Action |
|---|-------|--------|
| 0–8s | "Bước hai. Mở cửa sổ chat trong IDE. Bên phải hoặc phía dưới — tuỳ con vợ chọn. Có ô nhập tin nhắn." | IDE mở, point vào chat panel |
| 8–18s | "Giờ vợ làm cho chồng cái này: vào github chấm com slash calesthio slash OpenMontage. Mở file README chấm em đê." | Browser → GitHub repo → click `README.md` |
| 18–28s | "Bấm RAW ở góc trên — sẽ ra trang text. Vợ kéo cái link đó về chat. Hoặc tải file README chấm em đê về máy rồi kéo file vào ô chat." | Click Raw button, copy URL hoặc download .md → drag vào chat IDE |
| 28–40s | "Mục đích là cho ây ai biết dự án này cần gì để chạy. Đọc README là nó hiểu hết. Như vợ đưa thực đơn cho người giúp việc — họ tự đi chợ." | Quay file README đã được paste vào chat |

### 🎬 BEAT 4 — AI CHECK ENV + CLONE + TẠO `.env` (95s) | *Clip 45s sẵn + slide phụ*

> 📹 **Bro đã có clip 45s** chứa ĐỦ: bro gõ lệnh vào chat AI để AI tự kiểm tra môi trường + clone + trỏ vào `env.example`. Beat này = clip đó + voice over + 3 slide phụ mình tự dựng để đủ thời lượng + giải thích thêm 3 API key.

**Cấu trúc 95s:**

| T | Layer | Nội dung |
|---|-------|----------|
| 0–8s | 🎨 Slide intro Remotion | Title "BƯỚC 3 — AI TỰ CÀI HẾT" + voice intro |
| 8–53s | 🎬 **Source `0:35–0:45` (10s raw)** stretch + freeze frame + zoom transitions | Visual split: file `.env.example` (trái) + chat panel AI báo bảng `Kết quả kiểm tra môi trường` Python/Node/FFmpeg/Git/pip ✅ OK + "Môi trường hoàn toàn sẵn sàng" (phải). Mình đóng băng + Ken Burns zoom vào từng phần để dài 45s. |
| 53–65s | 🎨 Slide chuyển tiếp + zoom | Slide "TẠO FILE `.env`" — 2 cách: (1) copy `.env.example` rename, (2) bảo AI tạo hộ |
| 65–95s | 🎨 Slide 3 API key + voice | 3 ô paper card cho FAL / EverAI / Pexels — mỗi ô có URL + sticker "FREE TIER" + 1 dòng note |

---

**Voice over đầy đủ (sync timing):**

| T | Voice (chồng nói) |
|---|-------------------|
| 0–8s | *"Bước ba — phần thần thánh. Vợ gõ một câu vô chat ây ai, nó tự lo hết — kiểm tra máy, cài đồ thiếu, tải repo về. Coi đây."* |
| 8–25s | *"Đây là chồng đang gõ thật vô khung chat. Câu lệnh cho ây ai: kiểm tra máy thiếu gì cài hộ, clone repo OpenMontage theo link chồng để ở video tập một về Desktop. Cài xong báo."* |
| 25–45s | *"Nó tự check Git, Nốt, Ép ép, Python. Thiếu thì `winget install` — Mac thì `brew install`. Có rồi nó `git clone`, `pip install`, `npm install`. Vợ ngồi nhìn thôi, hai-ba phút. Lúc nó hỏi `tiếp tục không` thì gõ `có`. Hỏi `Y/N` thì gõ `Y`. Đơn giản vậy thôi."* |
| 45–53s | *"Đây — cài xong, ây ai trỏ vô file chấm i en vi chấm example để vợ biết cần chìa khoá ây pi i nào."* |
| 53–65s | *"Vợ tự copy file đó, đổi tên thành chấm i en vi. HOẶC LƯỜI thì gõ vô chat: 'Anh tạo hộ em file chấm i en vi từ chấm i en vi chấm example, để trống các giá trị, em điền sau.' Ây ai làm trong nửa giây."* |
| 65–80s | *"Ba chìa khoá ây pi i bắt buộc cho vợ — cả ba đều có FREE TIER, không tốn xu nào. FAL chấm ai cho ảnh và video. Ever ai chấm vn cho giọng tiếng Việt. Pexels chấm com cho footage free."* |
| 80–95s | *"Vợ vô từng web đăng ký ba phút lấy key, paste vô chấm i en vi. Mấy dòng khác có thì paste, không có cũng chạy được — đừng đụng vô lo lắm cho mệt. Link đăng ký chồng để comment ghim."* |

---

**Slide phụ mình dựng (paper-cream Remotion):**

1. **Slide intro 8s:** Title cam `BƯỚC 3 — AI TỰ CÀI HẾT` + sub `1 câu lệnh • AI lo hết` + mascot pointing
2. **Slide chuyển tiếp 12s:** Title `TẠO FILE .env` + 2 ô:
   - Ô A: `📝 Cách 1 — Copy file rename` + icon
   - Ô B: `🤖 Cách 2 — Bảo AI tạo hộ` + icon (highlight gold "LƯỜI THÌ XÀI CÁI NÀY")
3. **Slide 3 API key 30s:** Title `3 CHÌA KHOÁ FREE` + 3 paper card:
   - 🎨 FAL · `fal.ai` · "ảnh + video AI"
   - 🎙️ EverAI · `everai.vn` · "giọng VN"
   - 📷 Pexels · `pexels.com/api` · "footage free"
   - Sticker "FREE TIER" cả 3 ô + arrow vào file `.env`

> 💡 **Note Mac:** AI tự dùng `brew install` thay `winget` — voice không cần đổi.

> 🔴 **Bro check trước:** clip 45s có lộ key thật không? Nếu có → mình blur trong post.


### 🎬 BEAT 5 — DÙNG SKILL ĐẺ VIDEO (META DEMO) (105s) | *Screen rec live — quay tự nhiên*

> 💡 **Đây là phần META — bro show cách dùng skill bằng cách QUAY LẠI quá trình thật đang làm Ep2 này.** Không phải demo giả. Vợ thấy được chính cái workflow đẻ ra video họ đang xem.

| T | Voice (chồng nói) | Action |
|---|-------------------|--------|
| 0–10s | "Bước cuối — đẻ video. Repo của chồng có sẵn skill — mỗi skill là một preset cho một kiểu video. Vợ chọn skill, ra lệnh, ây ai tự dựng." | Slide intro |
| 10–25s | "Ví dụ vợ muốn làm video kiểu THE REVIEW như cái vợ đang xem đây. Trong Claude Code vợ gõ slash the dash review — nó load preset luôn. Vợ xài Cursor hay Antigravity thì kéo cả folder skill `.agents/skills/the-review` vào ô chat — ây ai sẽ đọc và biết cách làm." | Quay Claude Code: bro gõ `/the-review` → skill load. Cut sang Cursor: bro kéo folder `the-review` vào chat. |
| 25–40s | "Skill có sẵn quy trình tám bước — chọn format, viết script, chạy giọng, dựng Remotion, render. Vợ tự xào nấu lại theo ý vợ — đổi topic, đổi tone, đổi giọng. Skill là khung sườn, vợ là đầu bếp." | Quay nội dung file `SKILL.md` scroll qua 8 bước (mình overlay highlight) |
| 40–75s | "Đây — chính cái Ep2 vợ đang xem là chồng làm bằng skill này nè. Đây là cuộc nói chuyện thật giữa chồng với ây ai để lên kịch bản. Chồng debate, sửa, ép nó chỉnh — đến khi ra cái spec vừa ý." | **Quay lại cuộc chat thật giữa bro với AI lên kịch bản Ep2 này.** Bro stop/continue lúc quay. Mình hậu kỳ cắt đoạn AI suy nghĩ (loading), giữ phần debate có voice. |
| 75–95s | *"À tiện chồng nói luôn — repo này còn làm được cái này: vợ paste link YouTube, TikTok, Facebook gì cũng được vào chat, ây ai tự tải về SẠCH LOGO sạch watermark, dùng làm chất liệu cho video mới. Nhưng TUYỆT ĐỐI ĐỪNG ăn cắp đăng lại nguyên văn nha — TikTok YouTube quét bản quyền bằng ây ai, banned account như chơi. Lấy về phân tích, làm B-roll, viết lại giọng mình thôi. Tập sau chồng làm clip riêng dạy cách này."* | **KHÔNG demo** — bro vừa nói vừa tiếp tục quay debate Ep2. Mình overlay 1 slide nhỏ góc 8s "📥 PASTE LINK YT/TT/FB → AI tải sạch logo" + 1 slide đỏ 5s "❌ ĐỪNG ĂN CẮP — BANNED ACCOUNT" + 1 slide xanh 5s "✅ CHẤT LIỆU → VIẾT LẠI" |
| 95–105s | *"Có spec rồi — chồng quay video, ây ai dựng Remotion, caption, nhạc. Hai tiếng có em pi bốn cuối cùng. Cái vợ đang xem nè."* | Cut nhanh sang screen recording bro render final.mp4 (hoặc transition về thumbnail Ep2) |

**🔴 Quay tip cho Beat 5:**
- Bro **bấm STOP record khi AI đang suy nghĩ/chạy tool**, **CONTINUE khi AI bắt đầu trả lời** — mình ghép liền mạch
- Đoạn debate giữ realtime, đừng speed-up — đó là phần thật nhất của video
- Để chat panel rõ chữ, cuộn chậm để mình highlight được

### ❌ KHÔNG CÓ OUTRO

- Không Remotion mascot card
- Không Ep3 teaser hứa moi đồ chơi Veo/Kling/FLUX/Suno — đó là tool TRẢ PHÍ, vợ làm gì có tiền mua key
- Không face cam outro (face cam đã ở Beat 0)
- Beat 6 cuối câu cut thẳng → END. Cảm giác raw, "tao show xong, tự xài", không sales pitch.

Nếu muốn tease tập sau → tease nội dung **FREE** thôi: skill mới, workflow mới, mẹo tiết kiệm token. KHÔNG hứa cái cần trả tiền.

---

## 4. Chuẩn Bị Trước Khi Quay

### 4A. Bro test trước (CRITICAL)
- [ ] (Optional) Test scenario máy sạch trên VM/máy phụ → screen rec đoạn AI tự `winget install Git` + `git clone` để mình overlay vào Beat 4
- [ ] Có sẵn cuộc chat AI debate kịch bản Ep2 này → để Beat 6 quay lại
- [ ] Chuẩn bị 3 API key thật (FAL/EverAI/Pexels) hoặc key giả `xxx-xxx` — KHÔNG leak key thật trong post

### 4B. Setup quay
- Screen rec **1920×1080** OBS, font IDE 18pt, dark theme, full screen
- Mic gần (lavalier hoặc shotgun), KHÔNG mic laptop
- Tắt notification Windows, đóng Slack/Discord/Telegram
- Browser: tab fresh, không bookmark cá nhân hiện
- Voice tone: **chồng-vợ**, gần gũi, hơi cocky, nuông chiều

### 4C. Danh sách clip cần (đã có vs cần quay mới)
- ✅ **Beat 0 hook face cam:** `projects/video/7786038092972.mp4` (19.8s, 720×1280)
- ✅ **Beat 4 + Beat 5 source:** `projects/video/screen_1777795526446.mp4` (6:58, 1920×1040)
  - **Beat 4 segment:** `0:35 – 0:45` (10s raw — split screen `.env.example` + AI báo "môi trường sẵn sàng" ✅). Stretch ra 95s bằng freeze frame + zoom + slide overlay
  - **Beat 5 segment (debate):** time-range CHƯA CHỐT — bro chỉ tiếp
- 🎬 **Cần quay mới — Beat 2 (Tải IDE):** screen rec browser ~40s, 3 tab Antigravity/Cursor/Claude Code
- 🎬 **Cần quay mới — Beat 3 (Kéo README):** screen rec IDE ~40s
- 🎙️ **Voice over** (Beat 1 + Beat 4 + Beat 5 mention 20s + Beat 5 outro 10s): bro tự thu HOẶC dùng EverAI TTS như Ep1?
- ❌ **KHÔNG có outro** — Beat 5 cut thẳng END.

---

## 5. Hậu Kỳ (mình lo)

- **Beat 4** = clip 45s gốc (giữa) + slide intro 8s (đầu) + slide chuyển tiếp `.env` 12s + slide 3 API key 30s (cuối) + voice over xuyên suốt
- **Beat 5** cắt đoạn AI loading/suy nghĩ — nối liền mạch các đoạn AI trả lời + bro debate
- Highlight + zoom + red arrow vào moment quan trọng (click Download IDE, drag README vào chat, point `env.example`)
- Slide Remotion intro/transition cho Beat 1, 2, 4
- Caption sentence-based spring reveal từ `ImLangFull.tsx` (emphasis `#E5A53B` gold)
- Music lofi acoustic, sidechain duck với voice
- Blur API key trong clip 45s nếu bro lỡ paste key thật

---

## 6. Deliverables

`projects/vibe-editing-ep2/`:
1. **`final.mp4`** — 9:16 1080×1920 @30fps, ~4-5 phút
2. **`thumbnail.png`** — designed (NOT frame extract): mascot kéo file README vào chat AI, big text "AI TỰ CÀI · VỢ CHỈ KÉO THẢ"
3. **`caption.md`** — caption TikTok/FB + 6-8 hashtag VN + pin comment với 4 link (Antigravity / Cursor / Claude Code / repo) + 3 link API (FAL/EverAI/Pexels)

---

## 7. Caption Template

```
🪄 CÀI VAI BỜ ÊĐÍT TINH — VỢ CHỈ KÉO THẢ FILE

Vợ chỉ làm DUY NHẤT 2 việc:
1️⃣ Tải IDE (Antigravity FREE / Cursor / Claude Code)
2️⃣ Kéo file README vào chat AI

Còn lại AI tự cài hết — Git, Node, FFmpeg, Python, repo. 
Vợ ngồi uống cà phê, AI làm. Free 100%.

🔗 Repo: github.com/calesthio/OpenMontage
📌 Link IDE + API keys free ở comment ghim

#vibeediting #aimakevideo #remotion #claudecode #cursor #antigravity #aitiktok #huongdan
```

---

## 8. Pin Comment

```
🛠️ TẢI IDE (chọn 1):
• Antigravity (FREE giới hạn): antigravity.google
• Cursor ($20/tháng): cursor.com
• Claude Code ($20/tháng): claude.ai/code

🔑 ĐĂNG KÝ 3 API KEY:
• FAL (ảnh + video AI): fal.ai/dashboard
• EverAI (giọng VN): everai.vn
• Pexels (footage free): pexels.com/api

📂 REPO: github.com/calesthio/OpenMontage
💬 Kẹt ở đâu comment chồng trả lời

Tập sau: Cách ra lệnh chuẩn để moi đồ chơi (Veo 3, Kling, FLUX, Suno).
```

---

## 9. Rules Tuân Thủ (memory)

- ✅ `feedback_general_approve_script` — bro duyệt script này trước khi quay
- ✅ `feedback_general_deliverables` — final.mp4 + designed thumbnail + caption.md
- ✅ `feedback_caption_universal_lock` — caption sentence-based spring reveal từ ImLangFull
- ✅ `feedback_caption_phonetic_display` — TTS phonetic (`vai bờ ê đít tinh`), caption hiển thị `vibe editing`
- ✅ `feedback_tts_vn_short_syllables` — script clean, không syllable đơn lạc
- ✅ `feedback_general_no_tap_label` — KHÔNG show "TẬP 2" big-word; chỉ EP2 badge nhỏ outro

---

## 10. Next Actions

1. **GATE — Bro confirm spec này** (pass / chỉnh chỗ nào)
2. Bro test prompt Beat 4 trên máy sạch → confirm AI cài được không lỗi
3. Bro quay 2 take (continuous setup + face cam outro) → gửi path
4. Mình hậu kỳ: speed-up + slide Remotion + caption + music + thumbnail + caption.md
5. Preview frames → bro review → final mp4 → ship

---

## 11. Open Questions Cho Bro

1. **IDE thứ tự giới thiệu Beat 2:** Antigravity (free) trước → Cursor → Claude Code? Hay Claude Code trước (vì bro xài)?
2. **Beat 6 — đoạn debate AI lên kịch bản Ep2:** bro dùng cuộc chat HIỆN TẠI (giữa bro và mình) để quay, hay mở session mới và replay lại?
3. **Mình xuất teleprompter file** `Ep2_teleprompter.md` (1 dòng/câu cue time, font to) cho bro đọc khi quay không?
