#!/usr/bin/env bash
# One-time setup: install F5-TTS + download Adam reference audio
# Run this once before using run_tts_local.py
set -e

SHARED_DIR="$(cd "$(dirname "$0")" && pwd)"
REFS_DIR="$SHARED_DIR/voice_refs"
mkdir -p "$REFS_DIR"

echo "=== F5-TTS Adam Local Setup ==="
echo

# 1. Install F5-TTS
echo "[1/3] Installing F5-TTS..."
pip install -q f5-tts huggingface_hub

# 2. Download Adam reference audio from SyntheticVoicess
echo "[2/3] Downloading Adam reference audio..."
cd "$REFS_DIR"

# Use huggingface_hub to download sample files
python -c "
from huggingface_hub import hf_hub_download
import os

# Try to find Adam sample wav from SyntheticVoicess
# The repo has audio samples + best_model.pth (for XTTS, we want samples)
files_to_try = ['adam_sample.wav', 'sample.wav', 'reference.wav', 'adam.wav', 'demo.wav']
got = False
for f in files_to_try:
    try:
        p = hf_hub_download(repo_id='SyntheticVoicess/Adam_11labs', filename=f, local_dir='.')
        print(f'Downloaded: {p}')
        got = True
        break
    except Exception as e:
        pass

if not got:
    print('WARN: no Adam sample found in HF repo automatically.')
    print('Download manually from one of:')
    print('  - https://huggingface.co/SyntheticVoicess/Adam_11labs/tree/main')
    print('  - https://www.101soundboards.com/tts/1299441-adam-elevenlabs-and-capcut-tts-computer-ai-voice')
    print('Save as: $REFS_DIR/adam_ref.wav (mono, 24kHz preferred, 5-25s)')
"

# 3. Verify F5-TTS install
echo "[3/3] Verifying F5-TTS..."
python -c "
import f5_tts
print(f'F5-TTS version: {f5_tts.__version__}')
print('Ready.')
" 2>&1 || echo "F5-TTS import issue. Try: pip install --upgrade f5-tts"

echo
echo "=== Setup complete ==="
echo
echo "Adam reference audio should be at: $REFS_DIR/adam_ref.wav"
echo "Edit adam_ref.txt with the transcript of that audio (English text)."
echo
echo "Then in any project dir:"
echo "  python /e/tvk/OpenMontage/projects/_shared/run_tts_local.py"
