---
name: Lời Thú Nhận đồ vật — tone BỰA GenZ, không triết lý
description: Brand "POV đồ vật" phải viết bựa/hài Gen Z, tấu shit-joke self-aware, KHÔNG melancholic Wong Kar-wai literary như Tịnh Đạo
type: feedback
originSessionId: ec65b125-7a7a-4b08-aab5-5673b0036876
modified: 2026-08-13T04:29:03.918Z
---
Brand "LỜI THÚ NHẬN CỦA ĐỒ VẬT" phải viết tone **BỰA — HÀI GEN-Z — SELF-AWARE**.
Tuyệt đối không default về melancholic literary như Tịnh Đạo.

**Why:** Người xem TikTok/FB VN chọn POV đồ vật vì kỳ vọng **đồ vật tấu hài thấy gì nói nấy**, không phải suy tưởng. Đồ vật trần trụi chứng kiến đời thường → hài bằng cách liệt kê specific ngớ ngẩn (ăn cay 47 phút, tập tỏ tình 34 lần, phát hiện rắm thâm niên 12 năm), không phải "ở giữa nghe hết nỗi đời".

**How to apply:** Khi viết script POV đồ vật:
- Mỗi câu có 1 chi tiết specific bựa (số phút, tần suất, món ăn cụ thể, sự kiện đời thường đặc Việt Nam)
- Giọng xưng "tôi" hoặc "anh/chị" tự nhận mình là đồ vật — nhận thức tự nhiên, không lên gân
- Shit-joke cho đồ nào hợp (bồn cầu = được phép đùa tục nhẹ)
- Tránh câu triết lý kết thúc ("liệu có phải...") — thay bằng kết twist hoặc câu bất ngờ
- Không dùng từ "khóc lặng lẽ", "mỗi đêm", "đời người", "cô đơn" — bán melancholic

**Voice mặc định:** `vi_male_leduc_mb` (giọng nam Bắc) hoặc nữ tre trẻ tuỳ đồ vật

**Gate workflow:** Viết xong script PHẢI gửi user duyệt trước khi TTS + SDXL + render. Sửa tone nhanh trước khi sunk 15 phút production.

**Skill:** `.agents/skills/loi-thu-nhan-vat/SKILL.md` — ⚠️ **CHƯA MIRROR sang `.claude/skills/`** (kiểm 2026-08-13) → Claude Code KHÔNG auto-load, phải đọc SKILL.md thủ công.
