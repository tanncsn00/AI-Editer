"""Whisper align template for reup-comedy-dub skill.

Copy to projects/<slug>/run_align.py, run after TTS.
Uses script as ground truth, whisper only for timings.
"""
from __future__ import annotations

import io
import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

HERE = Path(__file__).resolve().parent
SCRIPT = HERE / "script_vn.txt"
AUDIO = HERE / "voice.mp3"
OUT = HERE / "words.json"


def tokenize(text: str) -> list[str]:
    return [w for w in re.split(r"\s+", text.strip()) if w]


def clean(w: str) -> str:
    return re.sub(r"[^\wÀ-ỹ]", "", w, flags=re.UNICODE).lower()


def main() -> int:
    from faster_whisper import WhisperModel

    script_text = SCRIPT.read_text(encoding="utf-8").strip()
    script_words = tokenize(script_text)
    print(f"Script: {len(script_words)} words")

    print("Loading whisper medium...")
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    # CRITICAL: do NOT pass initial_prompt — causes word merging in VN
    segs, info = model.transcribe(
        str(AUDIO),
        language="vi",
        beam_size=5,
        word_timestamps=True,
        vad_filter=False,
    )

    whisper_words = []
    for s in segs:
        if not s.words:
            continue
        for w in s.words:
            whisper_words.append({
                "word": w.word.strip(),
                "start": round(w.start, 3),
                "end": round(w.end, 3),
            })
    print(f"Whisper: {len(whisper_words)} words, duration={info.duration:.2f}s")

    # Align script → whisper timings via sequence matcher on cleaned tokens
    script_clean = [clean(w) for w in script_words]
    whisper_clean = [clean(w["word"]) for w in whisper_words]
    sm = SequenceMatcher(None, script_clean, whisper_clean)
    aligned: list[dict] = [None] * len(script_words)  # type: ignore
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                w = whisper_words[j1 + k]
                aligned[i1 + k] = {
                    "word": script_words[i1 + k],
                    "start": w["start"],
                    "end": w["end"],
                }
        elif tag in ("replace", "delete", "insert"):
            src_n = max(i2 - i1, 0)
            dst_n = max(j2 - j1, 0)
            if src_n == 0 or dst_n == 0:
                continue
            w_start = whisper_words[j1]["start"]
            w_end = whisper_words[j2 - 1]["end"]
            total = max(w_end - w_start, 0.01)
            per = total / src_n
            for k in range(src_n):
                aligned[i1 + k] = {
                    "word": script_words[i1 + k],
                    "start": round(w_start + k * per, 3),
                    "end": round(w_start + (k + 1) * per, 3),
                }

    last_end = 0.0
    for i, a in enumerate(aligned):
        if a is None:
            aligned[i] = {
                "word": script_words[i],
                "start": round(last_end, 3),
                "end": round(last_end + 0.2, 3),
            }
        last_end = aligned[i]["end"]

    OUT.write_text(json.dumps(aligned, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(aligned)} words)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
