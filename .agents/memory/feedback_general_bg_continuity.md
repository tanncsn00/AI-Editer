---
name: Background footage must be continuous within theme
description: Video backgrounds must be thematically consistent — all clips in a scene share same environment, not random mix
type: feedback
originSessionId: 2a0427d9-ac2c-40d3-81b6-da81290e9ead
---
Khi fetch Pexels/stock footage cho video, các clip trong cùng 1 scene (hoặc cùng 1 theme lớn) PHẢI cùng environment / mood / location. KHÔNG được mix ngẫu nhiên.

**Quy tắc:**
- Nếu scene là "đi 1 mình trong tuyết" → tất cả clip trong scene đó phải là người/vật đi trong tuyết, không cut sang văn phòng, không cut sang căn phòng ấm.
- Nếu scene là "người đàn ông đêm thành phố" → tất cả clip phải lone figure night city, không cut sang rural, không cut sang morning.
- Mỗi beat có thể có environment riêng, nhưng **trong 1 beat** các cut phải nhất quán.
- Tốt nhất: pick **1 core environment** cho cả video (ví dụ "lone man at night") và dùng variations của nó xuyên suốt, đổi góc chứ không đổi bối cảnh.

**Why:** Session 2026-04-10, user feedback sau khi xem 4 video — các bg thay đổi loạn (tuyết → đường phố → phòng → rạng đông → xe) gây mất continuity, cảm giác rời rạc như compilation random clips thay vì 1 câu chuyện liền mạch. User nói: *"nếu là đi đường trong tuyết 1 mình thì các video cx như thế bg như nhau"*.

**How to apply:**
1. Trước khi fetch Pexels, quyết định **1 core environment** cho video (ví dụ: winter forest lone walker, or night city lone man, or dark room introspection)
2. Tất cả queries Pexels phải bám sát environment đó — khác góc, khác khoảnh khắc, không khác bối cảnh
3. Trong composition, khi cut giữa các beat, ưu tiên clip cùng environment. Chỉ đổi environment khi thật sự cần shift scene lớn.
4. Kiểm tra lần cuối trước khi render: 5 clip bất kỳ lấy ra xem riêng — có cảm giác cùng 1 thế giới không? Nếu không → refetch.
