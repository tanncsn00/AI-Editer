"""Print word timestamps of a sung track so lines can be anchored on a repeated word.

Usage: python word_anchors.py <audio_or_video> [--word happy] [--lyrics "If you're happy ..."]
Prints every word, then the start times of --word (one per sung line) as a JSON list.
"""
import argparse, json, sys
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--word", default="happy")
    ap.add_argument("--lyrics", default="")
    ap.add_argument("--lang", default="en")
    a = ap.parse_args()
    m = WhisperModel("medium", device="cpu", compute_type="int8")
    segs, _ = m.transcribe(a.src, language=a.lang, word_timestamps=True, beam_size=5,
                           vad_filter=False, condition_on_previous_text=False, initial_prompt=a.lyrics or None)
    words = [(w.start, w.word.strip()) for s in segs for w in s.words]
    print(" ".join(f"{t:.2f}:{w}" for t, w in words))
    anchors = [round(t, 2) for t, w in words if w.lower().strip(",.!?") == a.word.lower()]
    print(json.dumps(anchors))


if __name__ == "__main__":
    main()
