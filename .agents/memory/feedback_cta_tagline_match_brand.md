---
name: feedback_cta_tagline_match_brand
description: "CTA tagline cuối video phải khớp brand/title video — IT thuần → 'giới IT', không mặc định 'chốn công sở'"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
  modified: 2026-08-13T04:26:58.937Z
---

Tagline đóng khung series ("Theo dõi · nghe tiếp truyền kỳ ...") ở **footer + outro CTA + thumbnail + voice + caption** PHẢI khớp brand của chính video đó — đừng copy-paste mặc định "chốn công sở" cho mọi bài.

**Why:** 2026-07-07 user bắt: QA vs Dev + Race Condition có `title` = "truyền kỳ **giới IT**" nhưng phần kết lại ghi "chốn công sở" → lệch. "chốn công sở" chỉ hợp video office-drama (sales, môi giới, họp hành); còn IT/dev thuần (race condition, QA, mutex, HTTP...) → "**giới IT**".

**How to apply:**
- Lấy tagline từ `title` field trong script.json (đã có "giới IT" / "chốn công sở" sẵn) — đừng bịa.
- Đổi ĐỒNG BỘ 5 chỗ: `text_phonetic` (voice, cần re-TTS beat CTA) + `text_display` + footer TSX + outro CTA TSX + thumbnail TSX + caption.md.
- Vì CTA là beat CUỐI, đổi đuôi tagline chỉ cần re-TTS beat cuối (`python tts_everai.py <last_idx>`), không xê dịch beat trước.
- "IT" trong voice: viết phonetic "**Ai Ti**" → EverAI đọc "ai-ti" (whisper ghi lại "IT") = đọc English chuẩn, khớp [[feedback_tts_tech_phonetic]].
- Liên quan [[feedback_sync_voice_workflow]], [[reference_truyen_ky_it_skill]].
