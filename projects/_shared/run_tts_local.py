"""LOCAL F5-TTS + Adam reference — drop-in replacement for run_tts.py
No API, no cost. CPU works (~30s/beat) or GPU (~3s/beat).

Setup once: bash setup_f5tts_adam.sh

Then in any project dir:
   cd projects/<slug>
   python ../_shared/run_tts_local.py
"""
from __future__ import annotations
import json, os, sys, subprocess, shutil
from pathlib import Path

HERE = Path.cwd()
SCRIPT = HERE / "script.json"
OUTPUT_DIR = HERE / "tts"
OUTPUT_DIR.mkdir(exist_ok=True)

SHARED = Path(__file__).resolve().parent
REFS = SHARED / "voice_refs"
ADAM_REF_WAV = REFS / "adam_ref.wav"
ADAM_REF_TXT = REFS / "adam_ref.txt"  # transcript of the ref audio (English)

# Allow override via env var
REF_WAV = Path(os.environ.get("VOICE_REF_WAV", ADAM_REF_WAV))
REF_TXT = Path(os.environ.get("VOICE_REF_TXT", ADAM_REF_TXT))

if not REF_WAV.exists():
    print(f"FATAL: reference audio not found at {REF_WAV}", file=sys.stderr)
    print("Run setup once: bash _shared/setup_f5tts_adam.sh", file=sys.stderr)
    print("Or manually place adam_ref.wav (mono 24kHz, 5-25s) in _shared/voice_refs/", file=sys.stderr)
    sys.exit(2)

if not REF_TXT.exists():
    print(f"FATAL: ref text not found at {REF_TXT}", file=sys.stderr)
    print("Create adam_ref.txt with transcript of adam_ref.wav (English).", file=sys.stderr)
    sys.exit(2)

REF_TEXT = REF_TXT.read_text(encoding="utf-8").strip()

# Check f5-tts CLI available
if not shutil.which("f5-tts_infer-cli"):
    try:
        import f5_tts  # noqa
    except ImportError:
        print("FATAL: F5-TTS not installed. Run: pip install f5-tts", file=sys.stderr)
        sys.exit(2)

data = json.loads(SCRIPT.read_text(encoding="utf-8"))
beats = data["beats"]


def tts_one(text: str, out: Path) -> bool:
    """Generate one beat via F5-TTS CLI."""
    cmd = [
        "f5-tts_infer-cli",
        "--model", "F5TTS_v1_Base",
        "--ref_audio", str(REF_WAV),
        "--ref_text", REF_TEXT,
        "--gen_text", text,
        "--output_file", str(out),
        "--remove_silence",
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            print(f"  CLI fail: {result.stderr[:300]}")
            return False
        return out.exists() and out.stat().st_size > 1024
    except subprocess.TimeoutExpired:
        print("  TIMEOUT after 5 minutes")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def main():
    print(f"=== F5-TTS Adam local TTS ===")
    print(f"Ref audio: {REF_WAV}")
    print(f"Ref text:  {REF_TEXT[:80]}...")
    print(f"Beats: {len(beats)}")
    print()

    for beat in beats:
        idx = beat["index"]
        name = beat["name"]
        text = beat["text_phonetic"]
        # F5-TTS works best with <500 chars per call — chunk by sentence if needed
        if len(text) > 500:
            print(f"WARN beat_{idx} {len(text)} chars exceed 500. Consider splitting.")
        out = OUTPUT_DIR / f"beat_{idx}.mp3"
        if out.exists() and out.stat().st_size > 1024:
            print(f"SKIP beat_{idx} ({name}) — already exists")
            continue
        print(f"TTS beat_{idx} ({name}) [{len(text)} chars]")
        ok = tts_one(text, out)
        if ok:
            print(f"  -> {out} ({out.stat().st_size} bytes)")
        else:
            print(f"  FAIL beat_{idx}")
            sys.exit(3)

    print()
    print("ALL DONE — Adam local voice generated")
    print("Next: python build_words.py && bash concat_voice.sh")


if __name__ == "__main__":
    main()
