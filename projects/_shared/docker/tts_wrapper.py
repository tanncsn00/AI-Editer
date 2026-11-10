"""TTS wrapper inside Docker container — VieNeu-TTS or F5-TTS fallback.

Usage:
  python tts_wrapper.py --ref /refs/adam_ref.wav --ref-text /refs/adam_ref.txt \
      --text "Cloudflare vừa..." --out /out/voice.wav
"""
import argparse, subprocess, sys
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("--ref", required=True, help="reference audio wav")
p.add_argument("--ref-text", required=True, help="path to file with reference text")
p.add_argument("--text", required=True, help="text to synthesize (Vietnamese)")
p.add_argument("--out", required=True, help="output wav path")
p.add_argument("--model", default="F5TTS_v1_Base", help="F5-TTS model name")
args = p.parse_args()

ref = Path(args.ref)
ref_text = Path(args.ref_text).read_text(encoding="utf-8").strip()
out = Path(args.out)

if not ref.exists():
    print(f"ERROR: ref audio not found: {ref}", file=sys.stderr)
    sys.exit(1)

cmd = [
    "f5-tts_infer-cli",
    "-m", "F5TTS_Base",
    "-r", str(ref),
    "-s", ref_text,
    "-t", args.text,
    "-o", str(out.parent),
    "-w", out.name,
    "--ckpt_file", "/app/vn_model/model_last.pt",
    "--vocab_file", "/app/vn_model/vocab.txt",
    "--vocoder_name", "vocos",
    "--device", "cpu",
    "--remove_silence",
]
print("→", " ".join(cmd[:6]), "...")
result = subprocess.run(cmd, capture_output=False)
sys.exit(result.returncode)
