"""Per-beat EverAI TTS — mỗi beat 1 file → concat có gap. Lỗi beat nào chỉ re-TTS beat đó.
Usage:
  python tts_everai.py            # gen beat còn thiếu + concat
  python tts_everai.py 3 6        # ép re-gen beat index 3 và 6 rồi concat
  python tts_everai.py all        # ép re-gen tất cả
"""
from __future__ import annotations
import hashlib, io, json, os, sys, time, subprocess
from pathlib import Path
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

def load_env():
    root = Path(__file__).resolve().parent
    while root.parent != root:
        env_file = root / ".env"
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            return
        root = root.parent
load_env()

API_KEY = os.environ.get("EVERAI_API_KEY")
if not API_KEY:
    print("FATAL: EVERAI_API_KEY missing", file=sys.stderr); sys.exit(2)

HERE = Path(__file__).resolve().parent
TTS = HERE / "tts"; TTS.mkdir(exist_ok=True)
API = "https://www.everai.vn/api/v1/tts"
POLL = "https://www.everai.vn/api/v1/tts/{}"
GAP = 0.30  # giây silence giữa các beat (nhịp)

data = json.loads((HERE / "script.json").read_text(encoding="utf-8"))
voice = data["voice"]; speed = data.get("speed", 1.0)
beats = data["beats"]

force = set()
args = sys.argv[1:]
if args == ["all"]:
    force = {b["index"] for b in beats}
else:
    for a in args:
        try: force.add(int(a))
        except ValueError: pass

SIGFILE = TTS / "_sig.json"
sigs = json.loads(SIGFILE.read_text(encoding="utf-8")) if SIGFILE.exists() else {}

def sig_of(b):
    raw = f"{voice}|{speed}|{b['text_phonetic'].strip()}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]

def gen_beat(b):
    idx = b["index"]; out = TTS / f"beat_{idx:02d}.mp3"
    cur = sig_of(b)
    if out.exists() and idx not in force:
        if sigs.get(str(idx)) == cur:
            return out
        print(f"[beat {idx:02d} {b['name']}] noi dung DA DOI -> bat buoc re-gen")
    sigs[str(idx)] = cur
    SIGFILE.write_text(json.dumps(sigs, ensure_ascii=False, indent=1), encoding="utf-8")
    t = b["text_phonetic"].strip()
    if not t.endswith((".", "!", "?")): t += "."
    payload = {"input_text": t, "voice_code": voice, "model_id": "everai-v1.6",
               "audio_type": "mp3", "bitrate": 128, "speed_rate": speed,
               "pitch_rate": 1.0, "volume": 100, "generate_srt": False}
    print(f"[beat {idx:02d} {b['name']}] TTS {len(t.split())}w speed={speed}...")
    r = requests.post(API, headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}, json=payload, timeout=180)
    r.raise_for_status(); body = r.json()
    if body.get("status") != 1:
        print(f"  FATAL: {body.get('error_code')} {body.get('error_message')}", file=sys.stderr); sys.exit(3)
    res = body.get("result", {}); rid = res.get("request_id")
    link = res.get("audio_link") or body.get("audio_link")
    if not link and rid:
        for _ in range(80):
            time.sleep(3)
            pb = requests.get(POLL.format(rid), headers={"Authorization": f"Bearer {API_KEY}"}, timeout=30).json()
            link = (pb.get("result") or {}).get("audio_link") or pb.get("audio_link")
            if link: break
    if not link:
        print("  FATAL: no audio_link", file=sys.stderr); sys.exit(4)
    out.write_bytes(requests.get(link, timeout=120).content)
    print(f"  saved {out.name}")
    return out

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(p)], text=True).strip())

# 1) generate each beat
paths = [gen_beat(b) for b in beats]

# 2) pad each with trailing GAP silence, uniform format → wav
padded = []
for p in paths:
    w = TTS / (p.stem + "_pad.wav")
    subprocess.run(["ffmpeg","-v","error","-i",str(p),"-af",f"apad=pad_dur={GAP},aformat=sample_rates=44100:channel_layouts=mono",str(w),"-y"], check=True)
    padded.append(w)

# 3) concat → voice_full.mp3
lst = TTS / "_concat.txt"
lst.write_text("".join(f"file '{w.as_posix()}'\n" for w in padded), encoding="utf-8")
full = TTS / "voice_full.mp3"
subprocess.run(["ffmpeg","-v","error","-f","concat","-safe","0","-i",str(lst),"-b:a","128k",str(full),"-y"], check=True)

# 4) segments.json (start/duration mỗi beat = nội dung + GAP)
segs = []; t = 0.0
for b, p in zip(beats, paths):
    d = dur(p)
    segs.append({"index": b["index"], "name": b["name"], "start": round(t,3), "content_dur": round(d,3), "duration": round(d+GAP,3)})
    t += d + GAP
json.dump({"segments": segs, "total": round(t,3), "gap": GAP}, open(HERE/"segments.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"DONE. total={t:.2f}s ({len(beats)} beats + gap {GAP}s)")
for s in segs: print(f"  {s['name']:<11} start={s['start']:7.2f} content={s['content_dur']:6.2f}")
