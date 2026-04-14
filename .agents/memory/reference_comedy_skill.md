---
name: Comedy animation skill
description: Preset workflow at .agents/skills/comedy-animation for VN meme-style comedy sketches with SVG characters
type: reference
---

Comedy animation skill at `.agents/skills/comedy-animation/SKILL.md` — full 8-step workflow adapted from tinh-dao-video.

**Scope:** Character-based animated comedy sketches, VN meme style, 25-35s setup + punchline, pure SVG characters (no footage).

**Built-in characters:**
- `Sigma` / `Derp` (FigureStyles.tsx) — meme mascots
- `Em Mít Ướt` / `Anh Gạch` (CoupleChars.tsx) — drama queen + straight man couple

**Reference episode:** `projects/comedy-cau-hoi-tu-than/cau_hoi_tu_than_v2.mp4` — "Câu Hỏi Tử Thần" tập 1

**Key technical notes documented in the skill:**
- Speech bubbles MUST use `<foreignObject>` + HTML flex (SVG `<text>` doesn't wrap)
- `vi_female_huyenanh_mb` does not work → fallback `vi_female_thuytrang_mb`
- Minhtriet voice requires `everai-v1.6`, most others `everai-v1` or `v1.5`

**When to use:** any request for animated comedy skits, character-based storytelling, couple/duo humor content.
