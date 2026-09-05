"""TTS template for reup-cartoon-dub. Copy to projects/<slug>/run_tts.py, edit voice/speed."""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent
SCRIPT = HERE / "script.txt"
OUTPUT = HERE / "voice.mp3"

# --- CONFIG ---
VOICE = "vi_male_minhkhang_mb"    # bright male, default for comedy
# Alternatives:
#   vi_female_thuytrang_mb (warm female)
#   vi_female_halinh_mb (clear female)
#   vi_female_kieunhi_mn (South female)
MODEL = "everai-v1.6"              # minhkhang/minhtriet require v1.6
SPEED = 1.1                        # comedy pace 1.0-1.2x typical

API = "https://www.everai.vn/api/v1/tts"
POLL = "https://www.everai.vn/api/v1/tts/{}"

API_KEY = os.environ.get("EVERAI_API_KEY")
if not API_KEY:
    cur = HERE
    for _ in range(5):
        env_path = cur / ".env"
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                if line.startswith("EVERAI_API_KEY="):
                    API_KEY = line.split("=", 1)[1].strip()
                    break
            if API_KEY:
                break
        cur = cur.parent

if not API_KEY:
    print("Missing EVERAI_API_KEY", file=sys.stderr)
    sys.exit(1)

text = SCRIPT.read_text(encoding="utf-8").strip()
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
payload = {
    "input_text": text,
    "voice_code": VOICE,
    "model_id": MODEL,
    "audio_type": "mp3",
    "bitrate": 128,
    "speed_rate": SPEED,
    "pitch_rate": 1.0,
    "volume": 100,
    "generate_srt": False,
}
print(f"TTS {VOICE} @ {SPEED}x ({len(text)} chars)")
r = requests.post(API, headers=headers, json=payload, timeout=120)
r.raise_for_status()
body = r.json()
if body.get("status") != 1:
    print(f"FAIL: {body.get('error_code')} {body.get('error_message')}")
    sys.exit(2)
res = body.get("result", {})
audio_link = res.get("audio_link")
req_id = res.get("request_id")
if not audio_link and req_id:
    for i in range(60):
        time.sleep(2)
        pr = requests.get(POLL.format(req_id), headers=headers, timeout=30)
        if pr.status_code != 200:
            continue
        pb = pr.json().get("result", {})
        status = (pb.get("status") or "").lower()
        audio_link = pb.get("audio_link")
        if audio_link and status in ("done", "success", "finished"):
            break
        if status in ("failed", "error"):
            print("TTS failed")
            sys.exit(3)
if not audio_link:
    print("No audio link")
    sys.exit(4)
ar = requests.get(audio_link, timeout=120)
OUTPUT.write_bytes(ar.content)
print(f"Saved: {OUTPUT} ({len(ar.content)} bytes)")
