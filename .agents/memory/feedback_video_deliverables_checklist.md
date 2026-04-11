---
name: Video deliverables checklist — MANDATORY
description: Every video project MUST deliver .mp4 + designed thumbnail + caption.md in final step — never frame-extract thumbnail, never skip metadata
type: feedback
---

**EVERY video production task** (Tịnh Đạo, comedy animation, reup dub, reup cartoon, Giải Thích Kiểu Lười, or any new series) MUST deliver these 3 artifacts in the final step. Not optional. Not "if there's time". Every single video.

## Mandatory deliverables — all 3 or task NOT complete

### 1. `<slug>.mp4` — final render
- H.264 codec
- 1080×1920 portrait (default) or requested aspect
- Verified playable, not corrupted

### 2. `thumbnail.png` — **DESIGNED composition, NOT frame extract**
- Build a dedicated `<Episode>Thumbnail.tsx` Remotion composition
- Render with `npx remotion still <id> --frame=0`
- Layout MUST include:
  - Big hook text (80-100px serif or bold)
  - Character(s) prominent
  - Background matching video aesthetic
  - Sub-hook / punchline line
  - Corner marks or border frame
- **NEVER use `ffmpeg -ss ... -frames:v 1`** to extract a frame from the video. Frame extracts look bland and don't clickbait.
- Reference compositions: `ReupTT01Thumbnail.tsx`, `GtlTap01Thumbnail.tsx`, `HonThuaTapTrung.tsx`

### 3. `caption.md` — metadata + post caption + hashtags
Must contain:
- **Metadata block:** duration, format, file size, voice config, music, characters
- **Post caption** — copy-paste ready for TikTok/FB with emoji structure, hook line, bullet points, CTA
- **Pin comment** — separate block for first-pinned comment (often with character intro or tag challenge)
- **Scene breakdown table** — time range × beat × character × notes
- **Hashtag set** grouped: core · topic · character · viral · audience (10-15 total to mix)
- **Files list** at bottom

## Why this rule exists

User feedback across 3+ episodes: "mày vẫn thiếu caption.md và thumbnail", "thubnail nào nó đặng biệt cái", "toàn quên ?". Forgetting these artifacts = incomplete deliverable = user has to remind every time = wasted cycles.

## Execution pattern

After `npx remotion render <Episode>` completes, IMMEDIATELY in the next tool calls:

```
1. Build/update `<Episode>Thumbnail.tsx` composition if not exists
2. Register in Root.tsx with durationInFrames={1}
3. `npx remotion still <EpisodeThumbnail> .../thumbnail.png --frame=0`
4. Write `projects/<slug>/caption.md` using full template above
5. Verify all 3 files exist with correct sizes
6. Only THEN report "done" to user
```

## Task tracking

When creating task list for a video project, ALWAYS include the step:
> **"Render + thumbnail composition + caption.md + verify deliverables"**

NOT just "render". The verify step forces the check.

## Related skills that inherit this rule

- `tinh-dao-video/SKILL.md`
- `comedy-animation/SKILL.md`
- `reup-cartoon-dub/SKILL.md`
- `reup-comedy-dub/SKILL.md`
- `giai-thich-luoi-series/SKILL.md`

All these skills' 8-step workflow has "Step 8 — Render + deliverables" — this rule enforces what Step 8 actually means.

## Anti-patterns

- ❌ Using `ffmpeg -ss` to grab a thumbnail from the rendered video
- ❌ Reporting "done" with only the .mp4 file
- ❌ Writing caption.md but forgetting thumbnail (or vice versa)
- ❌ Skipping pin comment section in caption.md
- ❌ Omitting scene breakdown table
- ❌ Thumbnail with no hook text, just characters standing
- ❌ Caption without hashtags
