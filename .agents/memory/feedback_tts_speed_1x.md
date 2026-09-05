---
name: feedback_tts_speed_1x
description: "TTS speed mặc định là 1.0, KHÔNG phải 0.95 — video có nhạc nền cần nhịp nhanh để khớp nhạc"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: de89418b-8cb4-4201-9c0e-19a68e6c18d2
  modified: 2026-08-14T07:49:05.322Z
---

Từ 2026-08-14: `speed` trong `script.json` mặc định **1.0**, không dùng 0.95 nữa. User nói rõ "từ giờ không bảo bạn nữa" — tự set, đừng hỏi lại.

**Why:** video có nhạc nền cần giọng đọc nhanh hơn để bắt nhịp với nhạc. 0.95 nghe lê thê, lệch nhịp so với beat của nhạc.

**How to apply:** khi tạo `script.json` mới thì set `"speed": 1.0` ngay từ đầu. Nếu kế thừa script cũ đang để 0.95 thì đổi lên 1.0 rồi re-gen toàn bộ TTS (`python tts_everai.py all`) — nhớ rebuild `beats.json`, cắt lại nhạc nền theo tổng thời lượng mới, và cập nhật `durationInFrames` trong `Root.tsx`.

Ghi đè con số 0.95 ghi trong [[feedback_tts_per_beat_pipeline]]; phần còn lại của pipeline đó (per-beat + gap 0.3s) vẫn giữ nguyên.

**NGOẠI LỆ — video THƠ dùng 0.95** (chốt 2026-08-14 ở project `tu-code`). Thơ lục bát / ngâm / chiêm nghiệm cần đọc chậm mới ra chất; 1.0 nghe như đọc báo. Chỉ áp dụng cho content dạng thơ-vần, KHÔNG áp cho explainer/quảng cáo/news.

⚠️ Đánh đổi đã biết: ở 1.0 thì chữ đơn ngắn CUỐI mệnh đề trước dấu chấm rất dễ bị nuốt ("dòng tiền. Rồi định giá" → "dòng định giá"). KHÔNG hạ speed để chữa — chống bằng BUFFER chữ theo [[feedback_tts_pronunciation_pitfalls]].
