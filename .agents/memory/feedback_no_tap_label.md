---
name: Never show "Tập X" label in videos or thumbnails
description: Drop the "TẬP 1/2/3/4" episode label from big-word outro and thumbnail — user prefers clean without series index
type: feedback
originSessionId: 2a0427d9-ac2c-40d3-81b6-da81290e9ead
---
Không bao giờ show label `TẬP 1`, `TẬP 2`, `tập 3 · ...`, v.v. trong thumbnail hay big-word outro của video Tịnh Đạo style.

**Why:** User feedback session 2026-04-10: *"bỏ cái Tập đi cmm"*. Label "Tập X" làm loãng thiết kế và trông giống compilation/series hơn là video đứng riêng. Mỗi video nên cảm giác tự đủ, không ép buộc viewer phải biết thứ tự series.

**How to apply:**
- Thumbnail: bỏ `<div>Tập X</div>` khỏi top của stack. Divider + hook question vẫn giữ.
- Big word outro (BigWordLayer): bỏ `tập X · subtitle` khỏi dưới big word. Chỉ giữ big word + optional 1-line tagline nếu cần (không chứa số tập).
- Metadata: trong description file có thể note internal tracking nhưng KHÔNG hiển thị trên video.
- Áp dụng ngay cho các video đang render + tất cả video sau này.
