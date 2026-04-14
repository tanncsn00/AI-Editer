## General

- [Approve script first](feedback_general_approve_script.md) — never skip brainstorming/script flow when making videos
- [Background continuity](feedback_general_bg_continuity.md) — all footage clips in a video must share same environment/mood, not random mix
- [Video deliverables checklist](feedback_general_deliverables.md) — MANDATORY mp4 + designed thumbnail (NOT frame extract) + caption.md for every video task; verify before reporting done
- [No "Tập X" label](feedback_general_no_tap_label.md) — never show episode index in thumbnails or big-word outro
- [yt-dlp social download](reference_general_ytdlp_download.md) — pip library for TikTok/FB/YT no-watermark download, no wrapper tool needed

## TTS & Caption

- [TTS VN short syllables](feedback_tts_vn_short_syllables.md) — EverAI drops tone marks on isolated short VN syllables ("ý", "ờ"); rewrite to multi-syllable equivalents + verify via whisper post-TTS
- [Whisper VN caption verify](feedback_caption_whisper_verify.md) — faster-whisper mis-transcribes Vietnamese; always diff against script and fix before rendering

## Tịnh Đạo

- [Caption + BigWord lock](feedback_tinhdao_caption_lock.md) — copy Caption+BigWord from ImLangFull.tsx verbatim, only swap EMPHASIS/BODY colors per mood; never invent new style
- [Tịnh Đạo skill](reference_tinhdao_skill.md) — preset workflow at .agents/skills/tinh-dao-video for VN philosophical TikTok videos

## Comedy animation

- [Gated 8-step workflow](feedback_comedy_workflow_gated.md) — comedy videos follow same gated flow as Tịnh Đạo: character lock → brainstorm → beat sheet → script → voice → storyboard → TTS → render
- [Mouth sync word timings](feedback_comedy_mouth_sync.md) — mouth animation MUST use word_timings.json (parabolic per-word), never independent phase sine; chars need action per beat not just idle bob
- [Stick figures must animate](feedback_comedy_stick_animate.md) — cartoon characters MUST have mouth sync + eye blink + body bob when speaking, never static
- [Comedy animation skill](reference_comedy_skill.md) — preset at .agents/skills/comedy-animation, Em Mít Ướt × Anh Gạch + Sigma/Derp characters built-in
- [Stick figure creative catalog](reference_comedy_stickfigure_skill.md) — catalog of 34 techniques + viral format ranking for cartoon/stick figure content

## Reup / Dub

- [Reup comedy dub skill](reference_reup_comedy_skill.md) — preset at .agents/skills/reup-comedy-dub for Douyin/TikTok reup with VN voice + karaoke, 2 modes (faithful / commentary)
- [Reup cartoon dub skill](reference_reup_cartoon_skill.md) — preset at .agents/skills/reup-cartoon-dub for reup with SVG cartoon visual replacement + designed thumbnail (not frame extract)

## Series presets

- [Giải Thích Kiểu Lười](reference_series_giaithichluoi_skill.md) — 4-character deadpan explainer cast (Thuốc Lá / Nón Cối / Cục Gạch / Bát Phở) with locked bible + topic matrix
