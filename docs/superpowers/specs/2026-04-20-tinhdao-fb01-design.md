# Tịnh Đạo · Chỗ Dựa Vững Nhất Là Trong Tâm Mình

**Date:** 2026-04-20
**Status:** Design draft, awaiting approval
**Source:** facebook.com/reel/929590530060730 (Trạm Suy Ngẫm — bài lục bát 4 câu, 18s)
**Mode:** Faithful — giữ nguyên 4 câu thơ, render lại bằng style Tịnh Đạo
**Format:** 1080×1920 portrait, 30fps, ~35-45s
**Style lock:** Tịnh Đạo skill `.agents/skills/tinh-dao-video` — winter/dark cinematic, EB Garamond drops, #F4B860 emphasis

---

## Voice & Music Lock

- **Voice:** EverAI `vi_male_minhtriet_mb` @ 0.9x rate, model `everai-v1.6`
- **Music:** Pixabay melancholy ambient (search `melancholy ambient`/`cinematic emotional`), process `lowpass=3500,bass=g=4,volume=0.09`

---

## Script (faithful — 4 câu lục bát giữ nguyên)

```
1. Sa cơ đừng kiếm bạn hiền — đó là những kẻ sợ phiền trước tiên.
2. Cứ theo quy luật tự nhiên — tự bương tự trải, tuỳ duyên ý trời.
3. Dựa núi núi hoá thành vôi — dựa nước nước chảy nước trôi theo dòng.
4. Dựa người người đổi thay lòng — chỗ dựa vững nhất là trong tâm mình.
```

**Estimated duration với minhtriet 0.9x:** ~32-38s narration + 5-7s outro big-word = **~40s total**

---

## Beat Sheet (5 beats)

| # | Time | Beat | Line | Big word | Visual cue |
|---|------|------|------|----------|------------|
| 1 | 0–9s | LINE 1 — Sa cơ | "Sa cơ đừng kiếm bạn hiền — đó là những kẻ sợ phiền trước tiên." | — | Lone man walking away in dark night street, back view, distant lights |
| 2 | 9–17s | LINE 2 — Tự nhiên | "Cứ theo quy luật tự nhiên — tự bương tự trải, tuỳ duyên ý trời." | — | Lone walker snowy forest path, foot prints behind, mist |
| 3 | 17–25s | LINE 3 — Dựa núi nước | "Dựa núi núi hoá thành vôi — dựa nước nước chảy nước trôi theo dòng." | — | Mountain at dawn timelapse / waterfall flowing / clouds time-lapse |
| 4 | 25–34s | LINE 4 — Dựa tâm | "Dựa người người đổi thay lòng — chỗ dựa vững nhất là trong tâm mình." | — | Man sitting alone on mountain top, back to camera, sunrise |
| 5 | 34–40s | OUTRO — TÂM | (silence, music swell) | **TÂM** | Same shot continues, fade to black with `TÂM.` big word EB Garamond #F4B860 |

**Background continuity check:** all clips = "lone man / nature / dawn / introspection" — single environment ✓ (per memory `feedback_general_bg_continuity`)

---

## Caption (Tịnh Đạo lock per memory `feedback_tinhdao_caption_lock`)

Copy `Caption` + `BigWord` từ `ImLangFull.tsx` verbatim. Chỉ swap:
- `EMPHASIS = "#F4B860"` (warm yellow — bright wisdom mood, không cold steel)
- `BODY = "#F5F5F0"` ivory
- Big word: `TÂM.` EB Garamond size ~440, letterSpacing 22px

EMPH set (key punch words):
- `hiền.`, `phiền`, `tiên.`
- `nhiên`, `trời.`
- `vôi`, `dòng.`
- `lòng`, `tâm`, `mình.`

---

## Pexels footage queries (per beat)

| Beat | Query |
|------|-------|
| 1 | `lone man walking street night back`, `back silhouette neon city night` |
| 2 | `lone walker snowy forest`, `single footprints snow path`, `winter foggy mountain trail` |
| 3 | `mountain dawn timelapse`, `waterfall flowing close up`, `clouds time lapse mountain` |
| 4 | `man sitting mountain top sunrise back`, `lone meditator mountain dawn`, `man back rock cliff sunrise` |

Filter: portrait/9:16 only, brightness `0.36-0.40 saturate(0.5) contrast(1.14)` (Tịnh Đạo lock).

---

## Deliverables

1. `projects/tinhdao-fb01/final.mp4` — 1080×1920 @30fps, ~40s
2. `projects/tinhdao-fb01/thumbnail.png` — designed (mascot KHÔNG có; dùng hook text + dark mountain bg + TÂM big-word preview)
3. `projects/tinhdao-fb01/caption.md` — short viral hook + #tinhdao #suyngam hashtags + credit `fb/tramSN1l` original

---

## Rules áp dụng từ memory

- ✅ `feedback_general_approve_script` — đang ở gate này
- ✅ `feedback_general_deliverables` — mp4 + designed thumbnail + caption.md
- ✅ `feedback_general_bg_continuity` — single env "lone man / dawn / nature"
- ✅ `feedback_caption_universal_lock` — copy Caption từ ImLangFull.tsx verbatim
- ✅ `feedback_caption_whisper_verify` — print whisper + diff với script trước render
- ✅ `feedback_tinhdao_caption_lock` — chỉ đổi color, không invent style
- ✅ `feedback_general_no_tap_label` — không show "Tập X"
- ✅ Credit nguồn `fb/tramSN1l` (Trạm Suy Ngẫm) trong caption.md outro

---

## Next actions
1. Bro confirm spec
2. TTS 4 line + whisper align (parallel với fetch Pexels)
3. Build composition `TinhDaoFB01.tsx` reuse ImLangFull pattern
4. Render → thumbnail → caption → ship
