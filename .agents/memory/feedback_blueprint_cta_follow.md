---
name: feedback_blueprint_cta_follow
description: Mọi video Blueprint truyền kỳ phải có câu chốt kêu gọi follow ở cuối
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
---

Mọi video series Blueprint truyền kỳ giới IT PHẢI kết bằng **câu chốt kêu gọi follow** — cả narration LẪN visual (slide CTA riêng có nút FOLLOW + "theo dõi để nghe tiếp truyền kỳ giới IT" + chọn phe nếu là versus).

**Why:** User dặn 2026-06-03 "có thêm câu chốt kêu gọi follow như mọi video nhé" — trước đó nhiều video chỉ có CTA visual mờ ở slide cuối, không có lời đọc kêu gọi follow rõ ràng.

**How to apply:** Khi script user gửi KHÔNG có sẵn CTA, tự thêm 1 beat CTA cuối (narration: thả tim + theo dõi bần đạo + nghe tiếp truyền kỳ giới IT + comment phe nào). Đây là ngoại lệ được phép thêm ngoài [[feedback_user_script_verbatim]] vì user yêu cầu rõ. Golden ref: `projects/sales-vs-engineering` beat 10. Liên quan [[reference_blueprint_skill]].
