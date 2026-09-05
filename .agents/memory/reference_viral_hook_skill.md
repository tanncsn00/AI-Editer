---
name: Viral Hook skill
description: Skill `.claude/skills/viral-hook` chuyên audit + generate hook viral cho video short-form. Áp dụng kèm the-review / tinh-dao / loi-thu-nhan-vat. Data từ Brock Johnson 1300 hook study + 118k OpusClip retention research.
type: reference
originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
modified: 2026-08-13T04:28:27.534Z
---
Skill ENHANCEMENT cho khâu hook video. Không thay thế skill format video — chỉ tăng cường.

**Vị trí:** `.claude/skills/viral-hook/SKILL.md` (bản cũ còn ở `.agents/skills/viral-hook/`)

**Khi nào dùng:**
- Trước khi finalize Beat 1 ở GATE 3 của bất kỳ skill format nào
- User cần generate 5 hook variant để A/B test
- User có hook draft cần audit

**7 viral rules (LOCK):**
1. 5-8 từ (Brock data: trung bình viral 7.7 từ)
2. Lớp 5 đọc hiểu (drunk grandma rule → 2× view)
3. Negative wins (ĐỪNG/STOP > MUA/THỬ — não sợ mất hơn thèm được)
4. Visual > Text (MrBeast: viral nhất = không nói)
5. First 1.5s catch
6. Specific number > vague
7. Originality (algo Sept 2025 punish recycled -40-60%)

**5 Pattern chính:** Pattern Interrupt · Curiosity Gap · Outcome/Data · Storytelling · Negative Words

**15 Template** chia 5 group: Curiosity / Controversy / Outcome / Direct Address / Story-POV

**Stop-Stack formula 1.5s đầu:** Visual + Audio + Text + Statement stack đồng thời

**10-point audit checklist** chấm hook bất kỳ → score 9-10 viral, <5 viết lại

**Reference video sample:** `projects/1300-hook-tiktok/final.mp4` — chính dùng skill này dựng

**Source data:**
- Brock Johnson 1300 hook study (YT QTgabAQ9kCU)
- OpusClip 118k+ retention
- Virvid 10 templates
- vidIQ Stop-Stack
