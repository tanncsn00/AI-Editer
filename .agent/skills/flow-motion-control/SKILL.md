---
name: flow-motion-control
description: "Làm video NHÂN VẬT AI NHẢY THEO VIDEO MẪU (motion control / motion transfer) bằng Google Flow, model Omni 1.1 Flash — rẻ hơn Kling/Viggle nhiều, làm được 3 nhân vật cùng lúc. Quy trình: ảnh nhân vật → nền trống → tách người video mẫu ghép lên nền trống → Flow từng đoạn 10s → nhạc Suno → co giãn từng câu cho khớp nhạc → khung 9:16. Dùng khi user nói: motion control, nhân vật nhảy theo video, bắt chước điệu nhảy, video nhảy khởi động, AI dance, các bé nhảy, 'làm như video TikTok kia', Google Flow, Omni."
---

# Flow motion control · nhân vật AI nhảy theo video mẫu

Golden ref: `projects/ai-happy-kids/` (3 bé chibi nhảy "If You're Happy and You Know It", 2026-10-30). Bản đẹp nhất là clip 720p chạy thẳng từ Flow (`ref/flow_seg23.mp4`) — **mỗi khổ 1 clip 720p riêng là chuẩn**; vòng lặp 1 clip chỉ là phương án hết tín dụng.

Script trong skill này: `scripts/matte_onto_plate.py` · `scripts/word_anchors.py` · `scripts/retime_to_song.py`.

---

## Vì sao Flow, không phải tool khác (đã thử thật)

| Cách | Kết quả |
|---|---|
| Muse / Veo text-to-video, tả động tác theo mốc giây | ❌ Không làm đúng mốc, tự thêm người thứ 4, tối đa 10s/lần |
| Muse tạo clip từng động tác rồi cắt ghép theo phách | ⚠️ Khớp phách nhưng cắt vụn — user chê "cắt nhiều quá" |
| Kling 3.0 Motion Control (Unifically) | ✅ Đẹp nhưng **$0.11/giây**, **chỉ 1 người/lần** (video mẫu nhiều người → "No valid characters detected"), ảnh phải JPEG/PNG thật |
| **Google Flow · Omni 1.1 Flash** | ✅ **3 người cùng lúc**, map trái/giữa/phải đúng, 10 tín dụng/10s ở 360p, 15 ở 720p |

Tín dụng Flow gói PRO reset ngày **20 hằng tháng**. Kiểm số dư: bấm avatar góc phải.

---

## Quy trình — mỗi bước có ô tick

### B1 · Ảnh nhân vật (Flow · Nano Banana · 0 tín dụng, hoặc Muse)
- [ ] Khung 16:9, toàn thân từ tóc đến giày, **các nhân vật đứng giãn cách** (≈ 1 thân người), tư thế đứng thẳng tay buông, máy quay chính diện.
- [ ] Số nhân vật = số người trong video mẫu, cùng thứ tự trái → phải. Mỗi nhân vật phải khác nhau rõ (tóc, kính, chiều cao) — Flow/Muse hay đúc 2 người giống hệt.
- [ ] Prompt dẫn bằng phong cách + góc máy (skill `ai-camera-shots`). Cute kiểu kênh: "eyes closed in a happy crescent eye-smile, fair porcelain skin, rosy blush".
- [ ] File từ Muse thực chất là **WebP** dù đuôi `.png` → convert sang JPEG trước khi đưa Kling (`PIL ... .convert('RGB').save('x.jpg')`).

### B2 · Nền trống (Flow · Nano Banana · 0 tín dụng)
- [ ] Gắn ảnh B1, prompt: "Edit this exact image: remove all the characters completely and show the empty stage… keep framing, perspective, lighting… The stage is empty." → tải về, resize 1280×720 = `plate.jpg`.

### B3 · Video mẫu
- [ ] Người thật, **thấy toàn thân**, máy quay đứng yên, số người = số nhân vật. Rối / hoạt hình / chỉ nửa người → không dùng được.
- [ ] Tải YouTube: `python -m yt_dlp --js-runtimes node -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o ref/src.%(ext)s <url>` (thiếu `--js-runtimes node` → báo "not available"). Lệnh có `--cookies-from-browser` thì để **user tự chạy bằng `!`**.
- [ ] **Tách người ghép lên nền trống TRƯỚC khi đưa Flow** — bắt buộc, vì Omni chép luôn nền, phụ đề, logo của video mẫu (đã dính: nền trời xanh + chữ "clap your hands" + logo KineMaster):
  `python scripts/matte_onto_plate.py ref/src.mp4 ref/plate.jpg ref/clean.mp4 --mode people --start 16 --dur 40 --cut-below 640`
- [ ] Cắt thành đoạn 10s **tắt tiếng**: `ffmpeg -ss 0 -i ref/clean.mp4 -t 10 -an ... ref/mref_0.mp4` …

### B4 · Flow · Omni 1.1 Flash
- [ ] Tắt "Tác nhân". Chọn **Video → Thành phần → 16:9 → Omni 1.1 Flash → 720p → x1** (độ dài tự theo video thành phần).
- [ ] Gắn **ảnh B1 + 1 đoạn mref**, prompt (đổi mô tả nhân vật):
  > Motion control. Use the uploaded video only as the motion reference and the uploaded image as the visual reference. Replace the three adult dancers with the three cute 3D cartoon children from the image: the left dancer becomes …, the center dancer becomes …, the right dancer becomes …. Each child copies their dancer's body movements, arm moves, claps, steps and timing exactly, frame by frame. The children keep their faces, … and child proportions exactly as in the image. The classroom stage … stay exactly as in the video. Static camera, locked-off tripod, the whole frame stays fixed. Bright, soft 3D animation lighting.
- [ ] Mỗi lần tải video lên hiện hộp thoại **"Quyền sử dụng video này"** → **user tự bấm** "Tôi đồng ý, không hiện lại" (auto-mode chặn Claude bấm thay). Báo user trước khi tải.
- [ ] Ước tín dụng trước: số đoạn × 15 (720p) hoặc × 10 (360p). Không đủ → báo user, đừng hạ xuống 360p âm thầm (360p phóng lên 1080 bị mềm).
- [ ] Tải kết quả: hover thẻ video để lộ `<video>` rồi `curl` URL `flow-content.google/...` (có chữ ký, hết hạn vài giờ).
- [ ] Nếu kết quả vẫn lộ nền cũ: `scripts/matte_onto_plate.py <flow.mp4> plate.jpg fixed.mp4 --mode cartoon --cut-below 655` (lọc thêm màu cỏ/trời/nắng + bỏ mảng rời).

### B5 · Nhạc (Suno qua Unifically · $0.06/lần, ra 2 bản)
- [ ] Lời **cùng thứ tự khổ** với video mẫu. Không dùng bản thu của kênh khác (bị nhận diện bản quyền → 0 view).
- [ ] Style tags: "children's song, nursery rhyme, cheerful kids choir, bright bubbly pop, ukulele, glockenspiel, real handclaps, steady tempo, clear English diction".

### B6 · Khớp nhạc — co giãn từng câu, không cắt theo phách
- [ ] Lấy mốc đầu câu (từ lặp mỗi câu, vd "happy") cho cả audio video mẫu lẫn bài Suno:
  `python scripts/word_anchors.py ref/audio.wav --word happy --lyrics "If you're happy and you know it, clap your hands. …"`
  (`vad_filter=False` + lời bài làm initial prompt, không thì whisper nuốt mất nửa bài.)
- [ ] Viết `config.json` cho `scripts/retime_to_song.py`: mỗi piece `[ref_a, ref_b, song_a, song_b]` = 1 câu; tách piece ở mốc 10s giữa các clip. Tốc độ mỗi piece nên trong 0,8–1,25.
- [ ] `python scripts/retime_to_song.py config.json` → khung 9:16 (video 16:9 giữa, overlay `card` phía trên/dưới).
- [ ] Card tiêu đề + CTA: hộp vàng "Khởi động tiết học…" + khung "Bình luận AI TEACHER" — mẫu hàm `overlay()` trong `projects/ai-happy-kids/build.py`.

### B7 · Kiểm & giao
- [ ] Soi khung tại mỗi chữ hành động trong nhạc ("hands", "feet"…) → tay chạm / chân chạm sàn đúng lúc.
- [ ] Soi có còn mảng nền cũ, người thứ 4, chữ chép lại không.
- [ ] Âm lượng đo theo mốc (không đo mean toàn file), Flat factor = 0.
- [ ] Deliverables như `video-production-gate` GATE 8: mp4 + thumbnail thiết kế riêng + caption.md (CTA "AI TEACHER" nếu video cho giáo viên).

---

## Bẫy đã gặp

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| Đưa video mẫu gốc thẳng vào Omni | Nền trời xanh, phụ đề, logo hiện giữa clip | B3 tách người lên nền trống trước |
| Video mẫu nhiều người vào Kling | "No valid characters detected" | Dùng Flow; hoặc Kling từng người một |
| Ảnh WebP đội tên `.png` vào Kling | "Unsupported image format 'webp'" | Convert JPEG |
| Upload file vào trang Unifically bằng `upload` | "Please upload video files only" | Gán `File([...],{type:'video/mp4'})` qua DataTransfer |
| Omni với câu "turn around" | Không xoay lưng, ra chắp tay | Chọn video mẫu ít động tác quay lưng |
| Tả động tác theo mốc giây cho model text/image-to-video | Sai mốc, thêm người | Phải có video mẫu (motion control) |
| Lặp 1 clip cho cả bài | Mọi khổ cùng 1 động tác, user chê "chán" | 1 clip 720p riêng cho mỗi khổ |
