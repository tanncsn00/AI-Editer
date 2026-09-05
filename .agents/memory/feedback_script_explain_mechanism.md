---
name: feedback_script_explain_mechanism
description: "Script tech-explainer: phần GIẢI PHÁP phải giải thích CƠ CHẾ nó chạy sao, không chỉ gọi tên khái niệm"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
---

Trong video truyền kỳ IT / tech-explainer, phần GIẢI PHÁP phải đi sâu **CƠ CHẾ** — người xem phải hiểu *nó chạy như thế nào*, chứ không phải chỉ *biết đến tên* nó.

**Why:** 2026-07-07 user (Race Condition): "script chỉ giới thiệu 2 thằng sau thôi à ko đi sâu à? tôi cần sâu về cả giải pháp nữa để mọi người hiểu cơ chế của giải pháp đó hơn là việc chỉ biết đến nó." Bản đầu name-drop Atomic/Optimistic bằng ví von ("một nhát bút trọn vẹn" / "ai đụng thì làm lại") mà không nói CƠ CHẾ thật.

**How to apply:**
- Cân đối beat: đừng để phần VẤN ĐỀ 6 beat mà GIẢI PHÁP dồn 1-2 beat name-drop. Tách mỗi giải pháp 1 beat riêng nếu cần (Race: solution 2→4 beat: LOCK · DEADLOCK · ATOMIC · OPTIMISTIC).
- Mỗi giải pháp trả lời: **vì sao lỗi xảy ra → cơ chế này chặn nó ở đâu → cái giá phải trả**. VD: Atomic = "đọc→cộng→ghi vốn 3 nhịp rời, khe giữa là chỗ lọt → gộp thành 1 câu lệnh bất khả phân"; Optimistic = "gắn dấu triện version, ghi 'chỉ khi triện vẫn cũ', ai ghi trước thì kẻ sau ghi hụt→làm lại"; nêu cả **đối lập tư tưởng** (Pessimistic khóa-trước vs Optimistic làm-trước-đụng-thì-lại) + khi nào dùng cái nào.
- Vẫn giữ giọng truyền kỳ (nhân cách hóa), nhưng metaphor phải MAP đúng cơ chế thật để vừa kể chuyện vừa hiểu.
- Liên quan [[reference_truyen_ky_it_skill]], [[feedback_script_storytelling]].
