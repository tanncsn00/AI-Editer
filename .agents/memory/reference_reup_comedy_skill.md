---
name: Reup comedy dub skill
description: Preset at .agents/skills/reup-comedy-dub for reupping Chinese/Douyin/TikTok clips with VN voice-over + karaoke caption
type: reference
---

Reup Comedy Dub skill at `.agents/skills/reup-comedy-dub/SKILL.md` — 8-step pipeline for reupping short viral clips with Vietnamese narration.

**Scope:** Short viral clips from Douyin / Xiaohongshu / Kuaishou / TikTok / FB → muted + VN voice-over + yellow karaoke caption.

**2 modes:**
- **Mode A (faithful):** translate source dialogue line-by-line, match timing. Ref: `projects/xhs-01/` (XhsFarmer composition)
- **Mode B (commentary):** ignore source, write fresh VN deadpan commentary over visuals. Ref: `projects/reup-comedy-demo-01/` (ReupDemo composition)

**Templates in skill folder:** `templates/run_tts.py`, `templates/run_align.py` — copy to project, edit, run.

**Pipeline:** download → transcribe source → write/translate VN → TTS → align → compose → render.

**Key technical notes:**
- AV1 codec from Douyin: re-encode to h264 first (ffmpeg can't extract frames)
- whisper align: NEVER use `initial_prompt=script_text` (causes word merging)
- Use script as ground truth via `difflib.SequenceMatcher` to fix VN mis-transcription
- Caption style: Be Vietnam Pro 800, yellow `#F4B860` highlight on active word, 3px black stroke
- `vi_female_huyenanh_mb` broken → fallback `thuytrang`
- Minhtriet requires `everai-v1.6`

**When to use:** any "dub this video into VN" or "reup short clip with VN voice" request.
