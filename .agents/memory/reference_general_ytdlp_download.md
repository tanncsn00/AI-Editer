---
name: yt-dlp for social video download (no watermark)
description: Use installed yt-dlp pip library to download TikTok/FB/YT/IG videos without watermark — no wrapper tool needed
type: reference
originSessionId: 2a0427d9-ac2c-40d3-81b6-da81290e9ead
---
`yt-dlp` là pip library đã cài global (không có trong `tools/` của project). Dùng để download video từ TikTok, Facebook, YouTube, Instagram, Reddit, X, và 1000+ site khác.

**Cách gọi:**
```bash
cd E:/tvk/OpenMontage
python -m yt_dlp "<URL>" -o "projects/<slug>/source.%(ext)s"
```

**Đặc điểm:**
- **TikTok:** auto extract bản **không watermark** từ `playAddr` — default behavior, không cần flag
- **Facebook reels:** dùng được với URL dạng `https://www.facebook.com/reel/<id>` — tự download video + audio, merge
- **YouTube:** default MP4 1080p, dùng `-f 'bestvideo+bestaudio'` nếu muốn max quality
- **Tự handle JS challenge** cho TikTok qua challenge cookie
- **Không cần API key** cho video public
- **Cần cookies browser** cho video private: `--cookies-from-browser chrome`

**Use cases trong pipeline Tịnh Đạo:**
1. Download 1 FB/TikTok reel của kênh tham khảo → Whisper transcribe → lấy cảm hứng thesis (KHÔNG copy nguyên văn — viết lại script riêng)
2. Download footage candidate để dùng làm b-roll (cắt qua ffmpeg)
3. Download TikTok của mình để re-edit hoặc extract caption

**Rule quan trọng:** Khi transcribe để lấy cảm hứng, LUÔN viết lại script riêng. Không reproduce nguyên văn từ source. Dùng thesis + quote đắt làm bệ phóng, nội dung và cách diễn đạt phải là của mình.

**KHÔNG cần tạo wrapper tool trong `tools/video/`** — yt-dlp là pip library, gọi trực tiếp là đủ. Không làm bloat codebase.
