---
name: EverAI TTS VN short-syllable pronunciation
description: Avoid short/isolated VN syllables like "ý", "ờ", "ạ" at unnatural positions — EverAI drops tone marks on pronunciation
type: feedback
---

EverAI TTS (especially `vi_male_ductrong_mb` and `vi_male_minhtriet_mb`) sometimes drops the tone mark on short VN syllables when spoken in fast phrasing — e.g. "để ý" is pronounced as "để y", "không ờ" sounds like "không o".

**Why:** Confirmed in Cô Độc production — opening "Bạn có để ý" was rendered by TTS with unclear "ý" that whisper also heard as "y". User caught it on playback and asked for fix.

**How to apply:**
- When writing scripts for Tịnh Đạo / comedy TTS, avoid isolated short syllables ("ý", "ờ", "ạ", "ừ") in fast-flowing sentence positions.
- Prefer multi-syllable equivalents: "nhận ra" instead of "để ý", "rồi à" instead of "à", "đồng ý" instead of just "ý".
- **Verification step:** after TTS, re-run whisper (beam 5, vad_filter=False) on the narration and scan transcript for suspicious tone-dropping. If whisper shows a word without its tone mark at a position the script has tones, that's a TTS pronunciation issue — rewrite script wording.
- Caption data (word_timings.json) is correct because we use script-as-ground-truth alignment. The problem is the AUDIO, not the data. Fix = rewrite script + re-TTS, not re-align.

**Related:** see `feedback_caption_whisper_verify.md` — similar but different failure mode (that one is about whisper mis-transcription, this one is about TTS mis-pronunciation that whisper catches).
