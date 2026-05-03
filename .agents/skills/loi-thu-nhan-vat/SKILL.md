# LỜI THÚ NHẬN CỦA ĐỒ VẬT — 8-step gated workflow

Brand: `@clawconfess`
Concept: POV 1 món đồ vật VN đời thường kể lại những gì nó chứng kiến chủ nhân.
Tone: **BỰA — HÀI GEN-Z — SELF-AWARE — SPECIFIC NGỚ NGẨN**. KHÔNG melancholic literary.
Platform: TikTok / FB Reels / Shorts 9:16 — 40-60s.
Format: SDXL cinematic scenes + EverAI TTS (Lê Đức hoặc Thuỳ Trang) + Remotion timeline.
Monetize: Merch stickers/poster, sponsored từ brands đồ gia dụng, sách tuyển tập "52 lời thú nhận".

---

## GATED WORKFLOW — 8 bước. Không skip.

### BƯỚC 1 — CHỌN ĐỒ VẬT
- Pick 1 món đồ VN specific, đời thường (bồn cầu, nón bảo hiểm cưới, ghế nhựa đỏ quán cóc, dép tổ ong, ví da 5 chủ, điện thoại Nokia, đôi guốc, bàn phím cơ, khung xe đạp...).
- Đặt tên tập: "Tôi là ___ · TẬP ___"
- GATE: Confirm với user 1 món đồ + tên tập trước khi qua bước 2.

### BƯỚC 2 — STORY ANGLE (HOOK + TWIST)
- Chọn 1 angle bựa:
  - **Observer** (chứng kiến 100 chủ qua 10 năm)
  - **Abused** (bị đối xử ngược đãi, kể lại bất công)
  - **Guilty witness** (biết bí mật chủ mà không nói)
  - **Unrequited companion** (yêu chủ đơn phương)
  - **Conspiracy theorist** (nghĩ đời sâu xa nhưng vẫn là đồ vật)
- GATE: Confirm angle trước khi viết script.

### BƯỚC 3 — VIẾT SCRIPT (TONE BỰA GENZ)
- 7-10 dòng narrator, tổng 40-55s khi đọc 0.92-1.0x.
- **BẮT BUỘC** mỗi dòng có 1 chi tiết SPECIFIC ngớ ngẩn:
  - Số phút cụ thể (47 phút, 34 lần, 12 năm)
  - Hành động đời thường đặc VN (ăn hủ tiếu cay, gọi điện mẹ, tỏ tình qua gương)
  - Sự việc lặt vặt mà ai cũng từng làm
- Tránh câu triết lý ẻo lả ("ở giữa — nghe hết", "mỗi đêm tôi nghĩ", "cô đơn thấm").
- Hook đầu: giới thiệu mình là đồ vật + địa điểm cụ thể VN ("Tôi là cái ghế đỏ quán cóc Q5, bàn số 3").
- Kết: twist/câu châm biếm, KHÔNG kết triết lý.
- GATE: **PHẢI gửi user duyệt script TRƯỚC khi chạy TTS + SDXL.** User có thể sửa câu, giọng điệu, thêm joke.

### BƯỚC 4 — PROMPT SDXL (8-10 cảnh)
- Sau khi user duyệt script → viết prompt cho mỗi dòng narrator.
- Style chung: "cinematic photograph, 35mm film grain, intimate, specific VN setting, warm bulb vs cold night light, shallow DOF".
- Mỗi cảnh match câu narrator — show HÀNH ĐỘNG ngớ ngẩn cụ thể (anh ngồi toilet lướt FB, chị khóc trước gương, sinh viên tập nói).
- Dùng negative prompt loại "cartoon, anime, bright, cheerful, smiling" nếu cần mood.

### BƯỚC 5 — RUN TTS
- Voice mặc định: `vi_male_leduc_mb` (Lê Đức, Bắc) cho đồ vật nam vô tri, hoặc `vi_female_thuytrang_mb` cho đồ vật nữ.
- `speed_rate`: 0.92 cho mood bình thản, 1.0 cho năng lượng cao, 0.85 cho suy tư mỉa mai.
- Tạo narration_full.mp3 bằng `adelay` mix với time offsets trong script.json.

### BƯỚC 6 — BATCH SDXL
- Dùng `projects/sdxl-cartoon/batch_scenes.py` với `--model Lykon/dreamshaper-8`.
- 9 frames ~2-3 phút CPU RTX 2060.

### BƯỚC 7 — BUILD REMOTION COMPOSITION
- Template: `remotion-composer/src/PovBonCau.tsx` — COPY + sửa SCENES/SUBS/CLOSE_CARD.
- Signature visual LOCK (không đổi):
  - Channel badge top-left: `lời thú nhận — của đồ vật` vàng Playfair italic + meta subtitle
  - Title card mở 3s: "TÔI LÀ ___" Playfair 96px trắng + "TẬP ___ · ___" gold
  - Subtitle bottom: Be Vietnam Pro 500/800, emph gold `#F5D98A`, body `#F0EDE3`
  - Closing stinger: "Tập kế sau..." + handle `@clawconfess`
  - Palette: đen #050405, vàng cổ #F5D98A, cream #F0EDE3
  - Letterbox 110px trên+dưới, vignette radial
  - Nhạc nền `bh_music.mp3` volume 0.18
- Register vào Root.tsx với id `PovXXX`.

### BƯỚC 8 — RENDER + DELIVERABLES (MANDATORY)
- Render mp4 9:16 1080x1920 @ 30fps qua `npx remotion render`.
- **Bắt buộc theo memory `feedback_general_deliverables`:**
  - `/projects/pov-<name>/<name>_v1.mp4`
  - `thumbnail.png` designed 1080x1920 (KHÔNG phải frame extract) — title + 1 SDXL scene key + channel brand
  - `caption.md` — caption TikTok/FB + hashtags + hook ngắn + pinned comment bait ("Bạn là đồ vật gì trong đời ai đó? Comment ⬇️")
- Preview 3-5 frames cho user review.

---

## TONE CHEAT-SHEET — Dos / Don'ts

### ✅ DOS (bựa, Gen-Z, specific)
- "Ngồi trên tôi 47 phút — đọc xong 3 chương truyện, lướt hết Facebook, gọi điện tâm sự với mẹ"
- "Tập tỏ tình trong gương 34 lần. Cuối cùng không dám gọi"
- "12 năm tôi chứng kiến 27 chủ nhân. Không ai rửa tay đúng kỹ thuật"
- "Anh sinh viên năm nhất nghĩ tôi không biết. Nhưng tôi biết anh cầm điện thoại cả lúc đang..."

### ❌ DON'TS (melancholic literary, triết lý chán)
- ~~"Ở giữa — nghe hết nỗi đời"~~
- ~~"Mỗi đêm tôi tự hỏi liệu có phải..."~~
- ~~"Người ta bỏ đi, tôi ở lại"~~
- ~~"Chìm trong ánh trăng cô đơn"~~
- ~~"Đau khổ... nhẹ nhõm... tôi ở giữa"~~

---

## REFERENCE

Tập 01 (needs tone redo — hiện đang melancholic, bị user phản hồi):
- `/projects/pov-boncau/boncau_v1.mp4` — POV bồn cầu nhà trọ

Template Remotion:
- `remotion-composer/src/PovBonCau.tsx` — layout + vignette + subtitle

Memory reference:
- `feedback_loithunhan_tone.md` — tone lock bựa Gen-Z

Tone reference video: chưa ai làm → tao là người đầu tiên. Tham khảo twitter "objects in my house" threads hoặc "inanimate objects I've made eye contact with" comedy Reddit.
