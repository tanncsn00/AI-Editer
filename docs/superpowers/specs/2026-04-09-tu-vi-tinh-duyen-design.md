# Design Spec: Tử Vi Tình Duyên — 3 Dấu Hiệu Gặp Người Định Mệnh

**Date:** 2026-04-09
**Pipeline:** animated-explainer
**Platform:** TikTok (9:16)
**Duration:** ~30s

---

## 1. Visual & Typography

- **Resolution:** 1080x1920 (9:16)
- **Ảnh nền:** 6 ảnh cosmic stock tải từ Pexels/Pixabay (galaxy, nebula, starfield, constellation, dark space)
- **Overlay:** Black gradient 60-70% trên ảnh để text dễ đọc
- **Palette:**
  - Text chính: `#FFFFFF`
  - Text accent/highlight: `#FFD700` (vàng gold)
- **Font:** Bold sans-serif (Be Vietnam Pro hoặc Montserrat)
  - Tiêu đề/hook: 72-80px
  - Nội dung: 48-56px
  - Từ khóa impact: viết hoa
- **Animation:**
  - Text: fade-in hoặc scale-in (spring) từng dòng
  - Transition: crossfade 0.5s giữa scene
  - Ảnh: subtle Ken Burns zoom-in chậm

## 2. Audio

- **Lồng tiếng:** Không
- **Nhạc nền:** Dark ambient / mysterious / space atmosphere
  - Volume: 0.3-0.4
  - Fade in: 1s
  - Fade out: 2s
  - Loop: có
  - Source: `music_library/` → fallback generate/tải free
- **SFX:** Không

## 3. Script & Scene Breakdown

| Scene | Thời gian | Text | Visual |
|-------|-----------|------|--------|
| 1 - HOOK | 0-3s | **"3 DẤU HIỆU TỬ VI / CHO THẤY BẠN SẮP / GẶP NGƯỜI ĐỊNH MỆNH"** | Text vàng gold, galaxy dramatic |
| 2 - Intro | 3-6s | "Nếu lá số bạn có 1 trong 3 điều này... / TÌNH DUYÊN đang đến RẤT GẦN" | Nebula deep |
| 3 - Dấu hiệu 1 | 6-12s | **"DẤU HIỆU 1"** / "Cung Phu Thê có / HỒNG LOAN hoặc THIÊN HỈ / chiếu vào" | Nebula tím/hồng |
| 4 - Dấu hiệu 2 | 12-18s | **"DẤU HIỆU 2"** / "Đại vận đi qua cung có / THAM LANG + ĐÀO HOA / đồng cung" | Starfield |
| 5 - Dấu hiệu 3 | 18-24s | **"DẤU HIỆU 3"** / "Năm nay THIÊN KHÔI / hoặc THIÊN VIỆT / chiếu mệnh" | Constellation |
| 6 - CTA | 24-30s | "Follow để xem thêm / BÍ MẬT TỬ VI mỗi ngày 🔮" | Galaxy wrap-up |

**Tổng:** ~30s, 6 scene, 6 ảnh cosmic stock.

## 4. Technical

- **Composition:** `TikTok` (1080x1920, 9:16)
- **FPS:** 30
- **Codec:** H264
- **Asset pipeline:**
  - Ảnh: tải stock từ Pexels/Pixabay — 6 ảnh cosmic
  - Nhạc: check `music_library/` → fallback generate/free
  - Text: Remotion render trực tiếp
- **Component:** Remotion text card + backgroundImage + dark overlay
- **Output:** `remotion-composer/out/tu-vi-tinh-duyen.mp4`
