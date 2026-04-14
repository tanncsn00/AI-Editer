---
name: Tịnh Đạo Caption + BigWord exact style lock
description: All Tịnh Đạo series videos MUST copy Caption + BigWord pattern from ImLangFull.tsx verbatim — exact fontSize/letterSpacing/textShadow/spring config — only swap palette color per episode mood
type: feedback
originSessionId: 2a0427d9-ac2c-40d3-81b6-da81290e9ead
---
All Tịnh Đạo series videos must match the exact Caption + BigWord rendering pattern established in `remotion-composer/src/ImLangFull.tsx`. Don't invent a new style per episode — copy the component shape verbatim and only swap the emphasis/body color per episode mood.

**Why:** User feedback 2026-04-14 on BaoHieu v1: "sao các chữ nó không giống như serie tĩnh đạo?" — I had invented a new caption style (marginRight gap, no blur fade-in, weak textShadow, smaller fontSize) instead of matching the locked series look. All episodes must share one recognizable caption/big-word language so the series feels cohesive.

**How to apply:** When building any new Tịnh Đạo episode, start by opening `ImLangFull.tsx` and copying:

1. **Caption component shape** (lines ~106-147):
   - `AbsoluteFill` with `justifyContent: center, alignItems: center`
   - Inner div: `display: flex, flexWrap: wrap, gap: "0 18px", maxWidth: 920, padding: "0 60px"`
   - Per-word `<span>` with:
     - `fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif"`
     - `fontWeight: emph ? 800 : 600`
     - `fontSize: emph ? 64 : 54`
     - `letterSpacing: emph ? "0.4px" : "0"`
     - `lineHeight: 1.3`
     - `textShadow: emph ? "0 0 26px rgba(<emph-rgb>,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)"`
     - Spring: `damping: 14, stiffness: 230, mass: 0.4`
     - On-appear: opacity 0→sp, `translateY(12→0)`, `blur(4→0)px`
   - LEAD offset: 0.1-0.12s
   - Active sentence logic: walks SENTENCES array, matches with 0.15s pre-roll and next-start boundary

2. **BigWord component shape** (lines ~149-188):
   - `AbsoluteFill justify/align center`
   - Spring: `damping: 12, stiffness: 80, mass: 1.5`
   - Scale 1.8→1.0, blur 16→0
   - Big text:
     - `fontFamily: "'EB Garamond', Georgia, serif"`
     - `fontWeight: 500` (NOT 800 — Garamond weighted feels clunky)
     - `fontSize: 260-440` (depends on word length; ImLang uses 440 for "IM.")
     - `letterSpacing: "18-22px"` (wide)
     - `textShadow: "0 0 60px rgba(<color>,0.3-0.45), 0 0 180px rgba(<color>,0.3-0.4), 0 10px 30px rgba(0,0,0,0.95)"` — THREE layers
     - `lineHeight: 1`
   - Subtitle (italic):
     - `EB Garamond italic, fontWeight 500, fontSize 28-46`
     - `letterSpacing 3-5px`
     - `marginTop 38-40`
     - `color: body ivory, opacity 0.85-0.9`
   - Fade-out 20 frames before BIG_END

3. **Palette per episode mood — ONLY change these two constants:**
   - Winter/cold (IM, BayCuu): `EMPHASIS = #C0CCD4` steel, `BODY = #EEEEEA`
   - Warm/family (BáoHiếu, CoDoc): `EMPHASIS = #F4B860` gold, `BODY = #F5F5F0` ivory
   - Match textShadow glow RGB to emphasis color

4. **Footage filter (locked):** `brightness(0.4) saturate(0.65) contrast(1.08)` — do NOT brighten even if footage looks dark; the vignette + caption shadow do the heavy lifting

5. **Audio volumes (locked):** voice 0.75-0.80, music 0.08-0.12 (after `lowpass=3500 + bass=+4dB` processing)

6. **NO "TỊNH ĐẠO" title / "Tập X" label** shown on video (existing rule, restated)

**Don't re-invent. Copy from ImLangFull, swap colors, done.** Reference project for warm palette: `BaoHieuFull.tsx` after 2026-04-14 rewrite.
