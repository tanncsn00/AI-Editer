---
name: Reup cartoon dub skill
description: Preset at .agents/skills/reup-cartoon-dub for reup with pure SVG cartoon replacement visuals + VN voice + designed thumbnail
type: reference
---

Reup Cartoon Dub skill at `.agents/skills/reup-cartoon-dub/SKILL.md` — replaces original video visual with SVG cartoon scenes instead of muting overlay (that's reup-comedy-dub).

**Scope:** Short viral clips (or text inspiration) → rewrite 30% → VN voice → pure SVG cartoon scenes → karaoke caption → designed thumbnail (not frame extract).

**Reference episode:** `projects/reup-tt-01/` — "Tưởng Là Vậy" (34s observational humor, 9 scenes)

**Reference files:**
- `remotion-composer/src/ReupTT01.tsx` — full composition with 9 scene switchers (Dog, Cat, Sofa, Fridge, House, MoneyBill, RunPerson, Bubble primitives inline)
- `remotion-composer/src/ReupTT01Thumbnail.tsx` — designed thumbnail with split before/after + big hook text + black divider
- `.agents/skills/reup-cartoon-dub/templates/run_tts.py` + `run_align.py`

**Key differentiators vs reup-comedy-dub:**
- Replaces visual entirely → transformative, lower legal risk
- Designed thumbnail composition (not ffmpeg extract)
- Voice: `vi_male_minhkhang_mb` bright (NOT minhtriet/ductrong deep)
- Background: paper cream `#F3EAD8` + grain + vignette
- Character reuse: Em/Anh Gạch from CoupleChars, Sigma/Derp from FigureStyles

**When to use:** observational/listicle/expectation-vs-reality humor, satirical reups, anything where original visuals are generic and can be creatively replaced with cartoon.
