"""Run F5-TTS Adam via Docker — drop-in replacement for EverAI run_tts.py.

Prerequisites:
1. Docker Desktop running
2. Built image: bash docker/build.sh
3. Adam ref audio in voice_refs/adam_ref.wav + adam_ref.txt

Usage:
   cd projects/<slug>
   python ../_shared/run_tts_docker.py
"""
from __future__ import annotations
import json, os, subprocess, sys
from pathlib import Path

HERE = Path.cwd()
SCRIPT = HERE / "script.json"
OUTPUT_DIR = HERE / "tts"
OUTPUT_DIR.mkdir(exist_ok=True)

SHARED = Path(__file__).resolve().parent
REFS = SHARED / "voice_refs"
DOCKER_IMAGE = "vieneutts:latest"

REF_NAME = os.environ.get("VOICE_REF", "adam")
REF_WAV = REFS / f"{REF_NAME}_ref.wav"
REF_TXT = REFS / f"{REF_NAME}_ref.txt"

if not REF_WAV.exists():
    print(f"FATAL: {REF_WAV} not found", file=sys.stderr)
    sys.exit(2)

# Check Docker
try:
    r = subprocess.run(["docker", "image", "inspect", DOCKER_IMAGE],
                       capture_output=True, text=True, timeout=10)
    if r.returncode != 0:
        print(f"FATAL: Image {DOCKER_IMAGE} not found. Run: bash {SHARED}/docker/build.sh", file=sys.stderr)
        sys.exit(2)
except Exception as e:
    print(f"FATAL: Docker not running? {e}", file=sys.stderr)
    sys.exit(2)


def tts_one(text: str, out: Path) -> bool:
    # Volume mounts (Windows path → POSIX for Docker Desktop)
    refs_host = str(REFS).replace("\\", "/")
    out_host = str(out.parent).replace("\\", "/")
    cmd = [
        "docker", "run", "--rm",
        "-v", f"{refs_host}:/refs",
        "-v", f"{out_host}:/out",
        DOCKER_IMAGE,
        "--ref", f"/refs/{REF_NAME}_ref.wav",
        "--ref-text", f"/refs/{REF_NAME}_ref.txt",
        "--text", text,
        "--out", f"/out/{out.name}",
    ]
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode == 0 and out.exists() and out.stat().st_size > 1024


def main():
    data = json.loads(SCRIPT.read_text(encoding="utf-8"))
    beats = data["beats"]
    print(f"=== F5-TTS Adam Docker · {len(beats)} beats ===")

    for beat in beats:
        idx = beat["index"]
        name = beat["name"]
        text = beat["text_phonetic"]
        out = OUTPUT_DIR / f"beat_{idx}.mp3"
        if out.exists() and out.stat().st_size > 1024:
            print(f"SKIP beat_{idx} ({name})")
            continue
        # F5-TTS outputs WAV — write to .wav then convert if mp3 expected
        out_wav = out.with_suffix(".wav")
        print(f"TTS beat_{idx} ({name}) [{len(text)} chars]")
        if not tts_one(text, out_wav):
            print(f"  FAIL beat_{idx}")
            sys.exit(3)
        # Convert wav → mp3 for compatibility
        subprocess.run(["ffmpeg", "-y", "-i", str(out_wav), "-b:a", "128k", str(out)],
                       capture_output=True)
        out_wav.unlink(missing_ok=True)
        print(f"  -> {out} ({out.stat().st_size} bytes)")

    print("\nALL DONE. Next: python build_words.py && bash concat_voice.sh")


if __name__ == "__main__":
    main()
