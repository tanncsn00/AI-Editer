---
name: Stick figures must animate — not static
description: For cartoon/stick figure videos, characters must have mouth sync + eye blink + body bob when speaking, not stand static
type: feedback
---

Stick figure / cartoon characters in videos MUST animate when on screen — static poses feel dead and unprofessional. Minimum required animation:

1. **Mouth sync** — when character is speaking in a beat, mouth must open/close at ~4Hz (sine wave, `mouthOpen = Math.sin(phase * 6) > 0`). Use ellipse shape when open, line when closed. Makes character feel alive.
2. **Eye blink** — periodic blink every ~3-4s for 0.2-0.3s (closed lines instead of pupils). Breaks the "dead stare" uncanny valley.
3. **Body bob** — vertical breathing sine wave, amplitude 1.5px idle / 3px when speaking. Slow (~0.5Hz).
4. **Head tilt** — subtle ~1-2° sine tilt.
5. **Arm gesture sway** — when speaking, slight arm x-offset oscillation (optional, per `gestureLevel` prop 0-1).

**Why:** User feedback on Giải Thích Kiểu Lười Tập 1 v1 — "người que phải cử động như người thật miệng nói chuyện chứ? chi tiết thật vào". Static characters = feel cheap = low retention.

**How to apply:**
- Add `speaking: boolean` prop to character components
- Add `phase: number` driven by `useCurrentFrame() / constant` in parent
- Calculate `mouthOpen`, `blinking`, `bob`, `tilt` internally from phase + speaking
- Wrap mouth rendering in conditional: `speaking && mouthOpen ? <ellipse/> : <line/>`
- Reference implementation: `remotion-composer/src/GiaiThichLuoiChars.tsx` → `CastCharacter` (Giải Thích Kiểu Lười series)

**When to skip animation:** only in thumbnails (static rendering), or in ensemble shots with 4+ background characters where animation isn't the focus.

**Parent composition must pass `speaking={true}`** when the character is the active speaker in that beat. Non-speaking characters in ensemble = `speaking={false}` (breathe only).

**Related rules:**
- `feedback_tts_vn_short_syllables.md` — TTS pronunciation quality
- `feedback_general_approve_script.md` — script gating before animation
- Skill: `stick-figure-creative` technique #1 (body bob) + this rule (mouth sync)
