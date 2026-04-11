---
name: Mouth sync must use word_timings not phase sine
description: Stick figure mouth animation MUST be driven by word_timings.json, never independent phase-based sine wave (too fast, unnatural chattering)
type: feedback
---

**Problem:** First implementation of stick figure mouth sync used `Math.sin(phase * 6) > 0` — independent 3Hz binary toggle. User feedback: "mồm cũng đang bị nhép nhanh quá" — mouth looks like unnatural fast chattering, doesn't match speech rhythm.

**Rule:** Mouth animation MUST be driven by actual word timings from `word_timings.json` aligned via whisper. Never use independent sine oscillation.

## Correct pattern

```tsx
type Word = { word: string; start: number; end: number };
const words: Word[] = wordsData;

// Compute mouth open amount at time t (seconds)
const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t < w.end) {
      // Parabolic: 0 at edges, 1 at midpoint
      const progress = (t - w.start) / (w.end - w.start);
      return Math.sin(progress * Math.PI); // 0 → 1 → 0 within word
    }
  }
  return 0; // gap between words = mouth closed
};

// In character render:
const mouthOpen = mouthOpenAt(frame / FPS);
{mouthOpen > 0.15 ? (
  <ellipse cx={0} cy={-17} rx={4 + mouthOpen * 3} ry={1 + mouthOpen * 3} fill={CHALK} />
) : (
  <line x1={-5} y1={-18} x2={5} y2={-18} stroke={CHALK} strokeWidth={3} />
)}
```

**Why parabolic:**
- Mouth closed at word start (0)
- Max open at mid-word (1)
- Closed at word end (0)
- Matches natural speech phoneme arc

## Anti-patterns

- ❌ `speaking && Math.sin(phase * 6) > 0` — 3Hz binary, too fast
- ❌ Fixed period toggle independent of audio content
- ❌ Single mouth state for whole beat duration (looks dead)
- ❌ Mouth open during silent gaps between words

## Related rules

- `feedback_stick_figures_must_animate.md` — characters must move (body bob, blink, head tilt) — THIS rule refines mouth specifically
- `feedback_video_deliverables_checklist.md` — deliverables verify

## Reference implementation

`remotion-composer/src/GtlTap02.tsx` — first composition using word_timings-driven mouth sync.

**Also:** in addition to mouth sync, characters need **purposeful action per beat** — not just idle bob. If metaphor is "chicken following rice", character must throw rice visibly, chickens walk/run. If metaphor is "bee and flower", bees must fly with wing flap cycle, flower must wilt. Each beat = one visible action.
