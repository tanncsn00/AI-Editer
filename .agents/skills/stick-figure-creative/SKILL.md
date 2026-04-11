# Skill: Stick Figure Creative Techniques

Complete library of creative techniques for building stick figure / cartoon animation content in Remotion + pure SVG. This is a **reference skill** (catalog of techniques), not a workflow skill.

Use alongside:
- `comedy-animation` skill (Em × Anh Gạch duo workflow)
- `reup-cartoon-dub` skill (reup format with cartoon replacement)
- `tinh-dao-video` skill (if mixing cartoon into Tịnh Đạo series)

## Character libraries already built

| File | Characters | Use case |
|---|---|---|
| `FigureStyles.tsx` | Sigma, Derp, Hành Giả, Reader, Noodle | Meme mascots, poses, walk cycle |
| `CoupleChars.tsx` | Em Mít Ướt, Anh Gạch | Couple drama skits, 6 emotion states |
| `ReupTT01.tsx` (inline) | Dog, Cat, Mouse, Sofa, Fridge, House, MoneyBill, RunPerson, Bubble | Observational humor props |

---

# 🎨 SECTION 1 — Drawing Style Variations

Different visual treatments for the same character system.

## 1. Hand-drawn wobble
Per-frame jitter on SVG path coordinates → feels drawn on paper. Use deterministic pseudo-random seeded by frame.
```tsx
const jitter = (seed: number) => (rnd(seed + frame) - 0.5) * 2.5;
<line x1={0 + jitter(1)} y1={0 + jitter(2)} x2={10 + jitter(3)} y2={10 + jitter(4)} />
```

## 2. Whiteboard explainer
`strokeDasharray` + `strokeDashoffset` animate → chữ/hình hiện như đang vẽ tay real-time.
```tsx
const len = 500;
const progress = interpolate(frame, [0, 60], [0, 1]);
<path d="..." strokeDasharray={len} strokeDashoffset={len * (1 - progress)} />
```

## 3. Chalkboard
Bg `#1A3028` dark green + white chalk stroke + erase transition (blur stroke out). Font `Courier` or `Caveat` for chalk feel.

## 4. Ink splash reveal
Character emerges from ink splash. Use `clip-path` with expanding irregular blob.
```tsx
const clipR = interpolate(frame, [0, 30], [0, 800]);
<g clipPath={`circle(${clipR}px at 540px 960px)`}>...character...</g>
```

## 5. Paper cutout layered
Rigid SVG with subtle drop shadow offset (4px dark brown) → feels cut from paper and glued in layers.
```tsx
<g style={{ filter: "drop-shadow(4px 6px 0 rgba(60,40,20,0.35))" }}>...</g>
```

## 6. Watercolor bleed
SVG `feTurbulence` + `feDisplacementMap` → ink bleed effect on fills. Use inside `<defs><filter>`.

## 7. Outline-only minimal
Zero fill, only strokes. Cực minimal, match với wisdom/philosophy content.

## 8. Duotone Frank Miller
2 colors only — black + 1 accent (red/yellow). High contrast. Good for dramatic tension.
Example: noir comic book style.

## 9. Cel-shaded (hard edges)
Each body part has flat base color + single hard-edge darker zone for shadow → fake 3D feel.
```tsx
<path d="...body..." fill="#E8D0A8" />
<path d="...shadow side..." fill="#B89068" />
```

## 10. Pixel art mode
Render stick figure inside pixel grid. Use small squares aligned to 8x8 grid instead of smooth paths.

---

# 🎬 SECTION 2 — Storytelling Techniques

How to convey more story with same character system.

## 11. Comic panel split
Divide frame into 4-6 comic panels, each showing a moment in sequence. Use `<g>` groups with `<clipPath>` rectangles.
```tsx
// 4 panels: top-left, top-right, bottom-left, bottom-right
const panels = [
  { x: 0, y: 0, w: W/2, h: H/2 },
  { x: W/2, y: 0, w: W/2, h: H/2 },
  // ...
];
```

## 12. Parallax walking
Character stays center, 3 background layers scroll at different speeds (far slow, mid medium, close fast). Creates depth while walking in place.
```tsx
const far = interpolate(frame, [0, 300], [0, -100]);
const mid = interpolate(frame, [0, 300], [0, -300]);
const near = interpolate(frame, [0, 300], [0, -600]);
```

## 13. Thought bubble zoom
Character has thought bubble → bubble expands → fills screen → becomes new scene. Zoom in from bubble position.

## 14. Timeline walk
Character walks along horizontal timeline, events appear at each step (milestones, life stages, history).

## 15. Growth montage
Same character across multiple life stages (baby → kid → adult → old). Use scale + hair + props progression.

## 16. Mirror / Shadow mimicry
Character has shadow/reflection that moves opposite or differently. Tells parallel story.

## 17. Twin before/after
Same character morphs into before + after version side-by-side. Good for transformation content.

## 18. Pop-up book
2D flat layout where layers rise (translateZ fake) when scene triggers. Each prop pops up from flat.

## 19. Isometric 3/4 view
Pseudo-3D room / scene at 30° angle. Gives depth without actual 3D. Good for office/home/cafe settings.
```tsx
<g transform="skew(0,-30) scale(1, 0.866)">...flat scene becomes isometric...</g>
```

## 20. Breaking 4th wall
Character notices they're in a frame. Pulls speech bubble, pushes UI element, walks out of panel. Meta comedy.

---

# 💫 SECTION 3 — Motion + VFX

## 21. Rubber stretch squash (cartoon physics)
Character body scales non-uniformly when jumping/falling — squash on impact, stretch on launch.
```tsx
const squash = isImpact ? 1.5 : 1;
const stretch = isLaunch ? 1.4 : 1;
<g transform={`scale(${squash}, ${stretch})`}>...</g>
```

## 22. Ghost trail afterimage
Motion leaves residual copies with decreasing opacity.
```tsx
{[0, -2, -4, -6].map(offset => (
  <g transform={`translate(${x - offset * 5}, ${y})`} opacity={(4 + offset) / 4 * 0.3}>...</g>
))}
```

## 23. Anime impact freeze
Freeze frame + screen flash + speed lines + big text "BAM!" / "POW!" / "BỊCH!"
```tsx
{impact && (
  <>
    <rect fill="#FFF" opacity={0.7} />  // flash
    <g className="speedLines">...</g>
    <text fontSize={180}>BAM!</text>
  </>
)}
```

## 24. Rube Goldberg chain
Props trigger each other sequentially. Domino 1 falls → ball rolls → lever flips → character reacts. Timed animation chain.

## 25. Liquid morph transition
Between scenes, one dissolves into another via path interpolation. Use `<animate>` on path `d` attribute or interpolate control points.

## 26. Heartbeat pulse deform
Body scales slightly with emotion beat. Good for fear/excitement.
```tsx
const beat = 1 + Math.sin(frame / 5) * 0.03;
<g transform={`scale(${beat})`}>...</g>
```

## 27. Scale character up/down emotionally
Body gets literally bigger when angry/excited. Smaller when sad/shy.

## 28. Emoji face swap
Character's face temporarily replaced by emoji (🤯 😵 💀 🥵) for reaction.

## 29. Stat bar HUD
Game-like health/mood bar floats above character head. Bar fills/drains based on emotion.
```tsx
<rect x={-40} y={-80} width={80} height={8} fill="#333" />
<rect x={-40} y={-80} width={80 * mood} height={8} fill="#4ADE80" />
```

---

# 📺 SECTION 4 — Composition Techniques

## 30. Split screen parallel
2 characters in parallel columns doing opposite things. See `HonThuaTapTrung.tsx` for reference.

## 31. Cinema bars (letterbox)
Black bars top + bottom → 16:9 crop in 9:16 frame. Nhấn drama moment.

## 32. Zoom punch-in reaction
Sudden scale up on face + vignette tighten → emphasize shock/realization.
```tsx
const zoom = isReaction ? 1.6 : 1;
```

## 33. Rotating POV
Camera rotates around scene via scene transform. Use `rotate` around center.

## 34. Crowd procedural
30+ background figures generated with seed-based positions.
```tsx
const crowd = Array.from({ length: 30 }, (_, i) => ({
  x: rnd(i * 7) * W,
  y: 1400 + rnd(i * 11) * 100,
  scale: 0.4 + rnd(i * 13) * 0.3,
}));
```

---

# 🎯 SECTION 5 — Viral format recommendations (VN 2026)

## Ranking by viral rate for stick figure cartoon style:

### 🥇 **TIER S — proven viral**

**1. "Tưởng là / Hóa ra" observational humor**
- Format: 30-40s, 6-10 scene swap
- Structure: Setup 3 expectations → NHƯNG pivot → 3 reality punchlines → Life extension → 3 more observations
- Reference: `ReupTT01.tsx`
- Skill: `reup-cartoon-dub`
- **Why viral:** parallel structure, instant relatable, infinite scale (every topic works)
- **Topics:** relationships, work, parenting, money, health, tech, dating, marriage

**2. Split screen comparison infographic**
- Format: static PNG (FB/IG post) or 10-15s animated
- Structure: Left "HƠN X" red | Right "TỐT Y" blue/green
- Reference: `HonThuaTapTrung.tsx`
- **Why viral:** save-worthy, share-worthy, stops scroll in 0.3s
- **Topics:** red/green flag, rich/poor mindset, weak/strong, sai/đúng, dại/khôn
- **Scale:** 3-5 posts per day easy

**3. Couple skit running gag**
- Format: 25-35s, 2-character dialog
- Structure: Cold open → setup → triple silence → punchline → aftermath → callback
- Reference: `CauHoiTuThan.tsx`, skill `comedy-animation`
- **Why viral:** character brand builds over episodes, VN audience loves couple drama
- **Running gag slots:** "Em có mập không?" / "Anh nhớ ngày này không?" / "Anh yêu em hay mẹ anh?"

### 🥈 **TIER A — high viral potential**

**4. "Luật ngầm" instructional list**
- Format: 60-90s, narrator + illustration per rule
- Structure: Hook question → 5-8 rules with visual → landing
- Reference: `QuyTacFull.tsx`
- **Why viral:** save-worthy wisdom, harsh-truth register VN audience loves
- **Topics:** luật đàn ông, luật công sở, luật tình yêu, luật tiền bạc

**5. POV skit single-character**
- Format: 15-25s, 1 character, big emotion
- Structure: "POV: khi [tình huống]" + character full reaction
- **Why viral:** relatable in 2 seconds
- **Topics:** POV khi mẹ hỏi crush, POV khi sếp nhắn 11h tối, POV khi bạn thân cưới

**6. Before/After transformation**
- Format: 15-20s, 1 character morphing
- Structure: Current state → trigger event → new state
- **Why viral:** visual payoff, glow-up satisfaction
- **Topics:** đọc sách vs không đọc, sáng sớm dậy vs ngủ nướng, tuổi 20 vs 30

### 🥉 **TIER B — niche viral**

**7. Life explained infographic animated**
- Format: 45-60s, complex topic simplified with flow diagrams
- Structure: Problem → 3 steps → outcome
- **Topics:** "Tại sao giàu vẫn không vui", "Tại sao làm thuê không thoát nghèo"

**8. Couple red/green flag split**
- Format: 30s split screen compare
- Structure: Left bf red flag | Right bf green flag, same situation
- **Why viral:** girls share aggressively

**9. Comic strip 4-panel**
- Format: static 4-panel image, meme style
- Structure: Setup → build → twist → punch
- **Why viral:** static → shareable, screenshot-able

**10. Growth montage**
- Format: 20s, character aging through life stages
- Structure: baby → kid → teen → adult → old, each with pain point
- **Topics:** "Mỗi tuổi 1 nỗi đau riêng", "Tiến hóa của đàn ông VN"

---

## Content + Technique pairing matrix

| Content topic | Best techniques |
|---|---|
| Wisdom reel | Outline-only + parallax walking + thought bubble zoom |
| Couple drama | Rubber squash + impact freeze + emoji face swap + stat HUD |
| Observational humor | Comic panel split + split screen + whiteboard reveal |
| Rule list instructional | Whiteboard explainer + timeline walk + stat HUD |
| POV skit | Zoom punch-in + rubber squash + cinema bars |
| Before/After | Twin morph + growth montage + duotone |
| Infographic | Isometric view + split screen + pop-up book |

---

## Recommended weekly output mix (for stick figure channel)

- **Daily (1-2x):** Split screen infographic (5-10 min per post)
- **3x/week:** "Tưởng là / Hóa ra" cartoon (2h per episode)
- **1x/week:** Couple skit with running gag (3h per episode)
- **1x/week:** Luật ngầm instructional list (2h per episode)
- **Occasional:** POV skit or growth montage

Target: 8-12 content pieces per week across formats. Volume play → algorithm reach.

---

## Anti-patterns (skill-specific)

- ❌ Using TOO MANY techniques in 1 video — pick 2-3 max per episode
- ❌ Changing character design mid-series — lock after Character Sheet
- ❌ Skipping caption for "cinematic" look — VN TikTok NEEDS caption for retention
- ❌ Full silence — always have at least light bg music
- ❌ Complex poses when simple reads better — stick figure should be legible in 1 second
- ❌ More than 1 signature prop per character — dilutes identity
- ❌ Realistic proportions — stick figures are ABSTRACT, 3-4 heads tall chibi reads best
- ❌ Muted colors — stick figure needs high contrast to pop on feed

---

## Reference files to learn from

- `remotion-composer/src/FigureStyles.tsx` — character rig patterns, walk cycle, mouth sync
- `remotion-composer/src/CoupleChars.tsx` — emotion state machine
- `remotion-composer/src/TuDuyMoStick.tsx` — first scene composition pattern
- `remotion-composer/src/CauHoiTuThan.tsx` — 2-character dialog + camera zoom per beat
- `remotion-composer/src/ReupTT01.tsx` — 9-scene observational humor with inline props
- `remotion-composer/src/HonThuaTapTrung.tsx` — split screen infographic pattern
- `remotion-composer/src/ReupTT01Thumbnail.tsx` — designed thumbnail composition
