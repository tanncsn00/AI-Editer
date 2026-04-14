# Skill: Comedy Animation (VN bựa meme)

Character-based animated comedy sketches in Vietnamese meme style. Duo or ensemble casts, 25-35s setup + punchline format, rendered in Remotion with SVG characters (no footage).

## Aesthetic Lock

- **Medium:** Pure code SVG characters — no Pexels footage, no photo stock
- **Style:** Flat vector + bold black outlines (stroke 3-5px), paper/stage BG with grain
- **Tone:** Vietnamese internet meme humor — relatable couple/social situations, deadpan + overreact contrast
- **Rhythm:** Setup + silence hold + punchline + callback. Silence is the joke.

## The 8-Step Gated Workflow (DO NOT SKIP)

**Every step is gated on user approval.** Skipping any step produces aimless/bland output — this was learned the hard way in `comedy-pilot-01` (first "Tắt Điện Thoại" pilot was rendered ad-hoc, user feedback: "hài như cc chán thế").

### Step 1 — CHARACTER LOCK
Finalize mascot(s):
- **a. Concept:** personality + role in comedy (e.g. drama queen vs straight man)
- **b. Visual direction:** body proportions, face style, signature details, palette
- **c. Render character sheet:** multi-expression grid + palette swatches + name labels
- User approves → design is LOCKED, no changes mid-production

### Step 2 — CONCEPT BRAINSTORM
Present **3 distinct pitches** for episode 1 (2-3 lines each):
- Each showcases different comedy mechanics (setup type, payoff style, effects used)
- User picks 1

### Step 3 — BEAT SHEET
5-8 beats timeline, each 3-6s:
- Name, time range, action + emotion, music/SFX cue
- Structure: Cold open → Setup escalation → Tension hold → Punchline → Decay → Callback → Outro
- User approves BEFORE any dialogue written

### Step 4 — SCRIPT APPROVAL
Full dialogue with:
- Line number, time window, character, exact text, tone direction
- Total speech should be <30% of duration — silence + reaction shots carry the rest
- User approves line-by-line BEFORE TTS

### Step 5 — VOICE CASTING
- Present recommended voices per character (from EverAI VN list)
- Note fallbacks (some voices don't support all model IDs, see known issues)
- User confirms voice assignment

### Step 6 — STORYBOARD MINI
1 rough frame per beat showing:
- Character positions, poses, bubbles, camera framing
- For simple 1-location sketches: at minimum a smoke-test frame
- User reviews layout → catches positioning issues before full render

### Step 7 — TTS + ASSEMBLE
- TTS all dialogue lines, check actual durations (EverAI async polling)
- Copy assets to `remotion-composer/public/<slug>/`
- Build composition: Bg → characters → captions → audio sequences → outro
- Smoke-test 1 frame → sanity check before full render

### Step 8 — RENDER + REVIEW
- Full render, extract 5-9 preview frames covering key moments
- Gather feedback: timing, pacing, acting, content
- Iterate content OR lock → next episode

## Comedy Mechanics Vocabulary

**Structure patterns:**
- **Rule of 3** — 3 escalating beats before payoff (classic stand-up)
- **Subverted expectation** — serious setup → absurd punchline
- **Silence as joke** — 2-5s dead silence before word (give audience time to process)
- **Callback** — punchline references setup phrase (e.g. Em rage callback repeats Anh's "ờ")
- **Running gag loop** — ending returns to opening position → infinite episode potential
- **Contrast sustained** — 1 char max intensity, other char zero — maintained throughout

**Movement types** (implemented in Remotion):
- walk (leg swing + body bob + arm counter-swing)
- stomp · float (love hover) · slide · tiptoe · jump · fall · freeze · tremble · floor drop
- enter/exit from off-screen via `interpolate(x, [t0,t1], [offscreen, onscreen])`

**Effects vocabulary:**
- 💬 Speech bubbles (use `<foreignObject>` + HTML flex for auto-wrap, NEVER plain SVG `<text>`)
- 💭 Thought bubbles
- 💕 Heart float · 💧 Sweat drops · 🔥 Fire aura · 💢 Anger vein · ✨ Sparkles
- Motion lines (whoosh) · Freeze frame + dim · Text pop caption flash
- Zoom punch-in reaction · Whip pan · Screen shake · Red/blue flash tint

## Character Library (built-in)

- **Sigma** (`FigureStyles.tsx` → `SigmaHead`, `SigmaBody`) — gigachad chiseled, supports `mouthOpen` + `blink` + `walkPhase`
- **Derp** (`FigureStyles.tsx` → `DerpHead`, `DerpHero`) — goofy meme face
- **Em Mít Ướt** (`CoupleChars.tsx` → `EmMituOt`) — chibi drama queen, 6 emotion states (neutral/cry/sparkle/angry/shocked/love)
- **Anh Gạch** (`CoupleChars.tsx` → `AnhGach`) — straight man, face never changes (joke), supports `walk` pose

## Known EverAI Voice Issues

- `vi_female_huyenanh_mb` — **does not work** with any model_id (returns 406). Use `vi_female_thuytrang_mb` as default female.
- `vi_male_minhtriet_mb` — requires `everai-v1.6` (NOT `everai-v1`)
- Most default voices work with `everai-v1` or `everai-v1.5`
- Premium voices (minhtriet, ductrong) need `everai-v1.6`

## File Layout

```
projects/<episode-slug>/
  run_tts.py                # TTS script with 4+ dialogue lines
  L1_anh.mp3                # individual line files
  L2_em.mp3
  L3_anh.mp3
  L4_em.mp3
  smoke.png                 # smoke test frame
  <episode>.mp4             # final render
  <episode>_v2.mp4          # iterated versions
  f1.jpg ... f9.jpg         # preview frames from render

remotion-composer/
  src/<Episode>.tsx         # composition file
  src/CoupleChars.tsx       # OR character file if new chars
  public/comedy_<slug>/     # audio assets staticFile path
    L1_anh.mp3
    L2_em.mp3
    ...
    music.mp3
```

## Anti-patterns (NEVER do)

- ❌ Skip step 1 (character lock) — if design is still draft you can't commit voice/behavior
- ❌ Skip step 2 (brainstorm) — 1 concept = no alternatives to compare
- ❌ Skip step 3 (beat sheet) — jumping to dialogue without structure = aimless
- ❌ Skip step 4 (script approval) — TTS without user OK = wasted credits
- ❌ Skip step 6 (storyboard) — rendering blind = layout bugs discovered at step 8
- ❌ Use plain `<text>` in speech bubbles (doesn't wrap) — always `<foreignObject>` + HTML
- ❌ Voice talking all 30s — silence + reactions carry 70% of comedy
- ❌ Change character design mid-production — lock means lock
- ❌ Show "Tập X" in outro (memory rule `feedback_general_no_tap_label`)

## Reference Episode

See `projects/comedy-cau-hoi-tu-than/`:
- `run_tts.py` — 4-line TTS script with speed_rate per character
- `cau_hoi_tu_than_v2.mp4` — final render with bubble wrap fix
- Composition: `remotion-composer/src/CauHoiTuThan.tsx`
- Character file: `remotion-composer/src/CoupleChars.tsx`
- Timeline format: `T = { beatName: [start, end] }` constants at top of composition
