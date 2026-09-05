---
name: User script — dùng VERBATIM, không sáng tạo
description: Khi user gửi script đầy đủ (có Hook/Part 1-N/CTA), dùng NGUYÊN VĂN làm script.json. KHÔNG redo hook theo viral-hook, KHÔNG restructure storytelling, KHÔNG đề xuất biến thể.
type: feedback
originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
---
Khi user gửi script có cấu trúc rõ (Hook + Part 1 + Part 2 + ... + CTA), dùng **NGUYÊN VĂN** làm script.json beats.

**Why:** User đã cân nhắc tone, narrative, message. Mình tự sáng tạo lại = phí thời gian + mất ý của user + làm họ điên.

**KHÔNG làm:**
- Audit hook bằng viral-hook skill khi user đã viết hook
- Đề xuất hook A/B/C/D/E khi user đã có hook
- Restructure beat theo storytelling pattern
- Rewrite câu cho "viral hơn"
- Skip qua câu/beat vì "dài"

**ĐƯỢC làm:**
- Map các Part user gửi → beat trong script.json (1 Part = 1 beat)
- Apply phonetic VN dictionary cho TTS (vd "AI" → "ây ai") — CHỈ thay phonetic, không đổi từ
- Thiết kế VISUAL/chart cho từng beat (visual là job mình)
- Cảnh báo nếu Part nào quá ngắn/dài cho TTS
- Hỏi clarification nếu beat có ambiguity

**Áp dụng cho:** the-review, tinh-dao-video, comedy-animation, mọi skill format video.

Ngoại lệ: user explicit "viết hook giúp tao" / "gen variant" → mới được sáng tạo.
