---
name: feedback-chong-vo-voice-v2
description: "Chồng-vợ persona voice rules cho VN tip series Claude Code. Updated 2026-05-19 với opening 'Hê lô các con vợ iu' + 'chồng-only' self-reference."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
  modified: 2026-08-13T04:29:00.709Z
---

> 🔻 **KHÔNG PHẢI DEFAULT NỮA.** Từ 2026-05-20 persona mặc định là **mình-bạn** ([[feedback_minh_ban_voice]]). File này chỉ dùng khi: (a) user nói rõ "quay lại chồng-vợ", hoặc (b) video confession/personal kiểu "Top 10 kỹ năng MẤT vì Claude". Video cũ giữ nguyên, không re-render.

Chồng-vợ persona Adam EverAI cho TikTok tip series Claude Code đã evolved qua nhiều video. Đây là rule current state (2026-05-19):

**Self-reference rule:**
- Dùng **"chồng"** xưng mình (KHÔNG dùng "tao")
- "Tao" có thể OK cho intro ngắn hoặc punchline đặc biệt
- User explicitly said: "dừng xưng tao nhé chồng thôi"

**Opening hook variant:**
- **"Hê lô các con vợ iu!"** — confession/honest content (Top 10 kỹ năng mất, sự thật ko làm tốt)
- **"Vợ ơi!"** — power-user/tip content (Top 10 lệnh, settings, plugin)
- Original "Chào các con vợ iuuuu" (multi u) bị reject từ video 1 — quá cheesy
- "Hê lô các con vợ iu" (1u) OK cho honest tone — verified 2026-05-19

**Vibe rules:**
- Savage mất dạy nhẹ — playful raunchy không thô
- KHÔNG dùng "iuuuu" multi-u (cheesy)
- KHÔNG dùng "90% người không biết" (clickbaity quá)
- Analogy chồng-vợ relatable cho từng beat (mẹ chồng, tin nhắn ex, ngủ ngoài thềm)
- CTA cuối luôn: "Save · Comment · Follow · không follow là chồng giận thật!"

**How to apply:**
- Khi user pick content type → check tone (honest = "Hê lô con vợ iu" / tip = "Vợ ơi")
- Throughout script dùng "chồng" cho self-reference
- Cuối CTA giữ pattern "save liền · ngủ ngoài thềm · comment · follow"
- Related: [[feedback_user_script_verbatim]], [[feedback_tts_tech_phonetic]], [[feedback_tinhdao_caption_lock]]
