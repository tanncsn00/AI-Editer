# Skill: Reup Cartoon Dub (VN voice + stick figure cartoons)

Re-purpose short viral clips (or source text/reel inspiration) with **pure SVG cartoon visuals** + Vietnamese voice-over + karaoke caption. Differs from `reup-comedy-dub` which keeps the original video muted — this one **replaces visuals entirely** with stick-figure scenes, making it transformative and legally safer while being funnier.

**Reference episode:** `projects/reup-tt-01/` — "Tưởng Là Vậy" (34s satirical observational humor)
**Reference composition:** `remotion-composer/src/ReupTT01.tsx`
**Reference thumbnail:** `remotion-composer/src/ReupTT01Thumbnail.tsx`

## When to use this vs reup-comedy-dub

| Factor | reup-cartoon-dub (this) | reup-comedy-dub |
|---|---|---|
| Original footage | **Replaced** with SVG cartoons | Muted + overlay |
| Legal risk | **Low** — transformative | Medium — derivative |
| Effort | Higher (build scenes) | Lower (just audio) |
| Virality | Same or higher | Same |
| Brand identity | Strong mascot buildup | Weak (no visual ID) |
| Good for | Observational humor, listicle, expectation-vs-reality | Talking head, tutorial, storytime |

## Aesthetic Lock

- **Background:** Warm paper cream `#F3EAD8` + SVG `feTurbulence` grain filter + radial vignette (`#7A5838` 45%)
- **Characters:** All filled SVG with `#1A1820` ink stroke 3-5px, rounded caps
- **Palette:** paper `#F3EAD8` · ink `#1A1820` · accent red `#E85838` / `#E03A2A` · gold `#E5A53B`
- **Type:** EB Garamond serif for transition/pivot text (italic) + Be Vietnam Pro 800 bold for caption
- **Rhythm:** 30-45s total, 6-10 scenes, each scene 2-5s with fade cross-dissolve

## 8-step Workflow (gated, no skip)

Follows same 8-step pattern as `tinh-dao-video` and `comedy-animation`. **Never skip script approval.**

### Step 1 — SOURCE ANALYSIS
- Download reel/clip with `yt-dlp`
- Re-encode AV1 → h264 if needed for frame extraction
- Whisper transcribe (auto-detect language, usually `vi` or `zh`)
- Identify: content type (observational/storytime/list/dialogue), key structure (parallel, rule-of-3, setup-punchline), target duration

### Step 2 — CONCEPT DIRECTION
Present 2 options:
- **A. Copy 100%** — voice-swap only (high legal risk, flag it)
- **B. Rewrite 30%** — keep structure + meaning, reword 30% of wording (RECOMMENDED)

User picks. Tui recommend B by default.

### Step 3 — BEAT SHEET
Map each sentence/observation to a scene beat:
- Beat name · time range · action/visual · emotion
- Target: 6-10 beats for 30s clip
- Pivot beats (transition text) between main beats for pacing

### Step 4 — SCRIPT APPROVAL
Full rewritten VN script with sentence breaks per scene. User approves line by line BEFORE TTS.

### Step 5 — VOICE CASTING
Options (NOT deep — different from Tịnh Đạo):
- `vi_male_minhkhang_mb` (bright male, everai-v1.6) — **default for comedy**
- `vi_female_thuytrang_mb` (warm female)
- `vi_female_halinh_mb` (clear female, crisp punchlines)
- `vi_female_kieunhi_mn` (South female, different vibe)

Avoid: minhtriet / ductrong / lehoang (too deep for comedy).

### Step 6 — STORYBOARD SCENES
Sketch each scene visually:
- Characters (reuse library: Sigma, Derp, Em Mít Ướt, Anh Gạch, dog/cat/props)
- Position, pose, speech bubble, motion hint
- Smoke-test 1 frame per scene

### Step 7 — TTS + ALIGN + ASSEMBLE
- Run TTS, verify duration fits target, bump `speed_rate` if needed (usually 1.0-1.2x for comedy)
- Whisper align with script-as-ground-truth (NO `initial_prompt`)
- Copy assets to `remotion-composer/public/<slug>/`
- Build `<Episode>.tsx` composition with scene switcher
- Register in Root.tsx

### Step 8 — RENDER + CAPTION + THUMBNAIL + METADATA
- Render .mp4
- Build **designed thumbnail composition** (not a frame extract) — see below
- Write `caption.md` with post text + pin comment + hashtags
- Deliver: .mp4 + .png thumbnail + .md caption + script + words

## Scene / character building blocks

**Reusable from existing files:**
- `SigmaHead`, `SigmaBody` (FigureStyles.tsx) — gigachad
- `DerpHead`, `DerpHero` (FigureStyles.tsx) — goofy
- `EmMituOt` (CoupleChars.tsx) — drama queen chibi, 6 emotions
- `AnhGach` (CoupleChars.tsx) — straight man deadpan

**Inline SVG primitives** (copy from ReupTT01.tsx):
- `Dog` — brown tongue-out pet
- `Cat` — grey lazy bored
- `Mouse` — grey small
- `Sofa` — 3-cushion couch
- `Fridge` — 2-door with open state + moldy food swap
- `House` — cartoon cottage
- `MoneyBill` — green $ bill
- `RunPerson` — running stressed character with motion lines
- `Bubble` — speech bubble with foreignObject HTML text (auto-wrap)

## Scene structure pattern

For observational "expectation vs reality" format:

1. **SETUP (7-8s):** 3 mini panels showing expectations with labels
2. **PIVOT text (2-3s):** Big "NHƯNG..." typography drop
3. **REALITY scene 1 (2-3s):** contradicts setup 1 with humor
4. **REALITY scene 2 (2-3s):** contradicts setup 2
5. **REALITY scene 3 (3-4s):** contradicts setup 3 (biggest joke)
6. **LIFE PIVOT (2-3s):** "cuộc đời cũng y chang..." transition
7. **EXTENSION scene 4-6 (4-5s each):** apply same pattern to life (đồ ăn, nhà, hôn nhân, etc)

## Caption karaoke style

Use HTML `<div>` inside `<foreignObject>` for auto-wrap. **NEVER use plain SVG `<text>`** — it doesn't wrap and overflows bubble rects.

```tsx
<AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 180 }}>
  <div style={{
    display: "flex", flexWrap: "wrap", justifyContent: "center",
    gap: "0 12px", maxWidth: 980, padding: "18px 40px",
    backgroundColor: "rgba(255,248,236,0.92)",
    borderRadius: 24,
    border: "5px solid #1A1820",
  }}>
    {words.map(w => (
      <span style={{
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 800, fontSize: 42,
        color: isActive ? ACCENT : INK,
      }}>{w.word}</span>
    ))}
  </div>
</AbsoluteFill>
```

## Designed thumbnail pattern

**NEVER use `ffmpeg -ss` to extract thumbnail from video.** Frame extracts look bland and don't clickbait. Instead, build a dedicated `<Episode>Thumbnail.tsx` composition following this structure:

```
┌──────────────────────┐
│  — TƯỞNG LÀ —         │  ← top hook text (small serif italic)
│                       │
│   [expectation         │  ← SVG scene showing expected outcome
│      scene small]      │
│                       │
├──── black strip ──────┤  ← diagonal torn divider
│      HÓA RA...        │  ← pivot text (reversed color)
├──────────────────────┤
│                       │
│   [reality scene       │  ← SVG scene showing punchline
│     MEDIUM bigger]     │  ← 40% larger than expectation
│                       │
│   [speech bubble       │  ← foreignObject auto-wrap
│     with punchline]    │
│                       │
├──── accent banner ────┤
│      BIG HOOK         │  ← massive serif (80-100px)
│  ...PUNCHLINE SMALL   │  ← smaller italic sans
└──────────────────────┘
```

Corner marks (editorial frame) on 4 corners. Paper BG with grain + vignette matching video style.

## File layout

```
projects/<slug>/
  source/
    original.mp4         # yt-dlp output
    original_h264.mp4    # re-encode if AV1
    prev_<t>.jpg         # preview frames
    transcript_src.json  # whisper source
  script.txt             # rewritten VN script
  voice.mp3              # EverAI TTS
  words.json             # aligned word timings
  run_tts.py             # from templates/
  run_align.py           # from templates/
  smoke.png              # smoke-test frame
  <slug>.mp4             # final render
  thumbnail.png          # designed thumbnail
  caption.md             # metadata + post caption

remotion-composer/
  src/<Episode>.tsx              # main composition
  src/<Episode>Thumbnail.tsx     # designed thumbnail
  src/<slug>_words.json          # words import
  public/<slug>/
    voice.mp3
    music.mp3
```

## Anti-patterns (DO NOT)

- ❌ Extract thumbnail with `ffmpeg -ss` — use dedicated thumbnail composition
- ❌ Use plain SVG `<text>` in speech bubbles — use `<foreignObject>` + HTML div
- ❌ Reuse original video footage (that's `reup-comedy-dub`, not this skill)
- ❌ Skip step 4 script approval — user catches TTS pronunciation issues + tone mismatch
- ❌ Use deep philosophical voice (minhtriet/ductrong) — this format needs lighter voice
- ❌ Use SVG `<text>` with literal variable names like `"W"` instead of `${W}` — renders nothing
- ❌ Let voice duration exceed target — bump speed_rate 1.1-1.5x
- ❌ Target 1:1 caption to voice — whisper VN mis-transcribes, use script-as-ground-truth
- ❌ Post without attribution if content inspired from another creator

## Known issues + fixes

- **AV1 codec from Douyin/FB:** `ffmpeg -i input.mp4 -c:v libx264 -crf 22 output.mp4` first
- **Whisper `initial_prompt=script` drops words:** NEVER pass initial_prompt, use difflib alignment instead
- **`vi_female_huyenanh_mb` returns 406:** fallback to `thuytrang`
- **Minhtriet / minhkhang require `everai-v1.6`:** not v1 or v1.5
- **Bubble text overflow:** use `foreignObject` + HTML flex center — never plain `<text>`
- **EverAI drops short VN tone marks:** avoid isolated "ý", "ờ", "ạ" — use multi-syllable equivalents
- **Landscape source on portrait composition:** `objectFit: cover` fills viewport, crops sides

## Reference files

- **Composition:** `remotion-composer/src/ReupTT01.tsx` — full 9-scene cartoon dub
- **Thumbnail:** `remotion-composer/src/ReupTT01Thumbnail.tsx` — designed split before/after
- **Characters inline:** Dog, Cat, Mouse, Sofa, Fridge, House, MoneyBill, RunPerson, Bubble (in ReupTT01.tsx)
- **Character library reuse:** `CoupleChars.tsx` (Em Mít Ướt, Anh Gạch), `FigureStyles.tsx` (Sigma, Derp)
- **TTS template:** `.agents/skills/reup-cartoon-dub/templates/run_tts.py`
- **Align template:** `.agents/skills/reup-cartoon-dub/templates/run_align.py`
