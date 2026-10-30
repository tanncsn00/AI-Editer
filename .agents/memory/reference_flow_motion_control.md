---
name: reference_flow_motion_control
description: Motion control rẻ nhất = Google Flow Omni 1.1 Flash (3 nhân vật cùng lúc, 15 tín dụng/10s 720p); phải tách nền video mẫu trước; user tự bấm xác nhận quyền; mỗi khổ 1 clip 720p riêng
metadata:
  type: reference
---

Skill đầy đủ: `.agents/skills/flow-motion-control/` (SKILL.md + scripts tách nền, lấy mốc lời, co giãn theo nhạc). Golden ref `projects/ai-happy-kids/` (2026-10-30).

- **Chọn tool:** Google Flow · Omni 1.1 Flash (ảnh nhân vật + video mẫu ≤10s) thắng Kling Motion Control (Unifically $0.11/giây, chỉ 1 người/lần) và Muse/Veo text-to-video (không theo đúng mốc giây, tự mọc thêm người).
- **Giá:** có video thành phần → 720p 15 tín dụng/10s, 360p 10. Tín dụng PRO reset ngày 20 hằng tháng.
- **Bắt buộc tách người khỏi video mẫu, ghép lên nền trống** (Nano Banana xoá nhân vật khỏi ảnh gốc, 0 tín dụng) — không thì Omni chép cả nền, phụ đề, logo.
- **Hộp thoại "Quyền sử dụng video này"** khi tải video lên Flow: auto-mode chặn Claude bấm "Tôi đồng ý" → báo user tự bấm "Tôi đồng ý, không hiện lại".
- **Chất lượng:** user đánh giá clip 720p chạy thẳng là "khớp", bản 360p ghép thì "động tác sai", bản lặp 1 clip thì "chán" → chuẩn là **mỗi khổ 1 clip 720p riêng**; báo user số tín dụng cần trước khi chạy.

**Why:** 2026-10-30 thử lần lượt Muse cắt ghép → Kling → Flow mới ra video liền mạch giống mẫu TikTok 900k view; user muốn tái dùng cho video giáo viên (phễu "AI TEACHER").
**How to apply:** user muốn nhân vật AI nhảy/bắt chước video → load skill `flow-motion-control`, ước tín dụng, xin user xác nhận quyền upload.
