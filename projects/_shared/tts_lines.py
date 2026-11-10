"""Per-line EverAI TTS -> timeline.json. No whisper: each line is its own clip, so onsets are exact.
Usage (from projects/<slug-dir>/):
  python ../_shared/tts_lines.py <public_slug>            # gen changed/missing lines, rebuild timeline
  python ../_shared/tts_lines.py <public_slug> --force    # re-gen every line
Input : script.md  (## NAME | Header per beat, blank line = new page, each line starts with a style emoji; 📜 = chapter title / saying card;
                     💬 "LABEL: text" chat line = voiced without the label · 🎬 screen text = silent, held by text length)
        phonetic.json (optional {"display substring": "spoken form"})
        voices.json   (optional {"SPEAKER LABEL": {"pitch": 1.3}} for 💬 lines written as "LABEL: text"; the label is not read)
Output: tts/voice_full.mp3, timeline.json, remotion-composer/public/<slug>/voice.mp3, remotion-composer/src/<slug>_timeline.json
"""
from __future__ import annotations
import hashlib, io, json, os, re, shutil, statistics, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

VOICE = "voice-739e9501-c06f-4cbf"
MODEL = "everai-v1.6"
SPEED = 1.0
API = "https://www.everai.vn/api/v1/tts"
LEAD_IN = 0.30
GAP_LINE = 0.22
GAP_PAGE = 0.34
GAP_BEAT = 0.55
KEEP_HEAD = 0.04
KEEP_TAIL = 0.08
SILENCE = "silencedetect=noise=-35dB:d=0.05"
STYLES = {"🏯": "narr", "💀": "red", "🤣": "gold", "🔥": "jade", "🙏": "amber", "🔔": "cta", "📜": "scroll", "💬": "chat", "🎬": "screen"}
SILENT_STYLES = {"screen"}
CHAT_LABEL = re.compile(r"^([^:]{2,24}): (.+)$")
SILENT_BASE = 0.3
SILENT_CHARS_PER_SEC = 40
SILENT_MIN = 0.8
TERM_CUE = re.compile(r"^Người đời gọi (nó|chiêu này) là")
PACE_TOLERANCE = 0.40

HERE = Path.cwd()
REPO = Path(__file__).resolve().parents[2]
TTS = HERE / "tts"


def load_env():
    for line in (REPO / ".env").read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def parse_script(path: Path):
    beats, title = [], ""
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("# "):
            title = line[2:].strip()
        elif line.startswith("## "):
            name, _, header = line[3:].partition("|")
            name, _, speed = name.strip().partition("@")
            beats.append({"name": name, "header": header.strip(), "speed": float(speed or SPEED), "pages": [[]]})
        elif not line:
            if beats and beats[-1]["pages"][-1]:
                beats[-1]["pages"].append([])
        else:
            emoji = next((e for e in STYLES if line.startswith(e)), None)
            if emoji is None:
                sys.exit(f"FATAL: line without style emoji: {line}")
            beats[-1]["pages"][-1].append({"style": STYLES[emoji], "t": line[len(emoji):].strip(), "speed": beats[-1]["speed"]})
    for b in beats:
        b["pages"] = [p for p in b["pages"] if p]
        for p in b["pages"]:
            for i, ln in enumerate(p):
                ln["kind"] = "term" if i > 0 and TERM_CUE.match(p[i - 1]["t"]) else ("cue" if TERM_CUE.match(ln["t"]) else ln["style"])
    return title, beats


def spoken(text: str, phon: dict) -> str:
    for k in sorted(phon, key=len, reverse=True):
        text = text.replace(k, phon[k])
    text = re.sub(r"[\U0001F300-\U0001FAFF☀-➿]", "", text).replace("“", "").replace("”", "").replace('"', "")
    text = re.sub(r"\s+", " ", text).strip()
    return text if text.endswith((".", "!", "?", "…")) else text + "."


def sig(text: str, speed: float) -> str:
    return hashlib.sha1(f"{VOICE}|{MODEL}|{speed}|{text}".encode("utf-8")).hexdigest()[:16]


def synth(text: str, out: Path, speed: float):
    h = {"Authorization": f"Bearer {os.environ['EVERAI_API_KEY']}"}
    body = {"input_text": text, "voice_code": VOICE, "model_id": MODEL, "audio_type": "mp3", "bitrate": 128, "speed_rate": speed}
    for attempt in range(3):
        try:
            r = requests.post(API, headers=h, json=body, timeout=60).json()
            if r.get("status") != 1:
                raise RuntimeError(f"{r.get('error_code')} {r.get('error_message')}")
            rid = r["result"]["request_id"]
            for _ in range(120):
                time.sleep(1.5)
                res = requests.get(f"{API}/{rid}", headers=h, timeout=30).json()["result"]
                if res.get("audio_link"):
                    out.write_bytes(requests.get(res["audio_link"], timeout=60).content)
                    return
            raise RuntimeError("timeout waiting for audio_link")
        except Exception as ex:
            print(f"  retry {attempt + 1}/3 [{text[:40]}]: {ex}")
            time.sleep(2)
    sys.exit(f"FATAL: TTS failed for: {text}")


def duration(p: Path) -> float:
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], text=True))


def speech_bounds(p: Path):
    d = duration(p)
    log = subprocess.run(["ffmpeg", "-i", str(p), "-af", SILENCE, "-f", "null", "-"], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    onset = ends[0] if starts and starts[0] < 0.01 and ends else 0.0
    tail = [s for s, e in zip(starts, ends + [d]) if e >= d - 0.02 and s > onset]
    return onset, (tail[-1] if tail else d)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug, force = sys.argv[1], "--force" in sys.argv
    load_env()
    TTS.mkdir(exist_ok=True)
    phon_file = HERE / "phonetic.json"
    phon = json.loads(phon_file.read_text(encoding="utf-8")) if phon_file.exists() else {}
    voices_file = HERE / "voices.json"
    speakers = json.loads(voices_file.read_text(encoding="utf-8")) if voices_file.exists() else {}
    title, beats = parse_script(HERE / "script.md")
    lines = [ln for b in beats for p in b["pages"] for ln in p]
    voiced = [ln for ln in lines if ln["style"] not in SILENT_STYLES]
    for ln in voiced:
        label = CHAT_LABEL.match(ln["t"]) if ln["style"] == "chat" else None
        ln["say"] = spoken(label.group(2) if label else ln["t"], phon)
        ln["pitch"] = float(speakers.get(label.group(1), {}).get("pitch", 1.0)) if label else 1.0
        ln["raw"] = TTS / f"line_{sig(ln['say'], ln['speed'])}.mp3"
        ln["clip"] = ln["raw"] if ln["pitch"] == 1.0 else TTS / f"line_{sig(ln['say'], ln['speed'])}_p{ln['pitch']:g}.mp3"
    todo = [ln for ln in voiced if force or not ln["raw"].exists()]
    print(f"{len(lines)} lines ({len(lines) - len(voiced)} silent) · {len(todo)} to generate · model {MODEL} speed {SPEED}")
    t0 = time.time()
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(lambda ln: synth(ln["say"], ln["raw"], ln["speed"]), todo))
    for ln in voiced:
        if ln["clip"] != ln["raw"] and (force or not ln["clip"].exists()):
            r = ln["pitch"]
            subprocess.run(["ffmpeg", "-v", "error", "-i", str(ln["raw"]), "-af", f"asetrate=44100*{r},aresample=44100,atempo={1 / r:.6f}", str(ln["clip"]), "-y"], check=True)
    print(f"generated in {time.time() - t0:.1f}s")

    parts, cursor, flags = [], LEAD_IN, []
    parts.append(("silence", LEAD_IN))
    for bi, b in enumerate(beats):
        b["start"] = cursor
        for pi, p in enumerate(b["pages"]):
            for li, ln in enumerate(p):
                if ln["style"] in SILENT_STYLES:
                    hold = max(SILENT_MIN, SILENT_BASE + len(ln["t"]) / SILENT_CHARS_PER_SEC)
                    ln["start"], ln["end"] = round(cursor, 3), round(cursor + hold, 3)
                    parts.append(("silence", hold))
                    cursor += hold
                else:
                    onset, end = speech_bounds(ln["clip"])
                    a, z = max(0.0, onset - KEEP_HEAD), end + KEEP_TAIL
                    ln["start"] = round(cursor + (onset - a), 3)
                    ln["end"] = round(cursor + (end - a), 3)
                    parts.append((ln["clip"], a, z))
                    cursor += z - a
                    ln["cps"] = len(ln["say"]) / max(0.05, end - onset) / ln["speed"]
                last_line = li == len(p) - 1
                last_page = pi == len(b["pages"]) - 1
                gap = GAP_BEAT if last_line and last_page else GAP_PAGE if last_line else GAP_LINE
                parts.append(("silence", gap))
                cursor += gap
            p_start = p[0]["start"]
            b["pages"][pi] = {"start": p_start, "lines": [{k: ln[k] for k in ("t", "kind", "start", "end")} for ln in p]}
        b["end"] = round(cursor, 3)
        b["start"] = round(b["start"], 3)

    pieces = []
    for i, part in enumerate(parts):
        w = TTS / f"_p{i:04d}.wav"
        if part[0] == "silence":
            cmd = ["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", f"{part[1]:.3f}", str(w), "-y"]
        else:
            clip, a, z = part
            cmd = ["ffmpeg", "-v", "error", "-i", str(clip), "-af", f"atrim={a:.3f}:{z:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono", str(w), "-y"]
        subprocess.run(cmd, check=True)
        pieces.append(w)
    lst = TTS / "_concat.txt"
    lst.write_text("".join(f"file '{w.as_posix()}'\n" for w in pieces), encoding="utf-8")
    full = TTS / "voice_full.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-b:a", "128k", str(full), "-y"], check=True)
    for w in pieces:
        w.unlink()

    median = statistics.median(ln["cps"] for ln in voiced)
    for ln in voiced:
        if abs(ln["cps"] / median - 1) > PACE_TOLERANCE:
            flags.append(f"{ln['cps']:.1f} chars/s · {ln['t']}")

    total = round(cursor, 3)
    real = duration(full)
    if abs(real - total) > 0.05:
        sys.exit(f"FATAL: voice_full {real:.3f}s != timeline {total:.3f}s")
    timeline = {"title": title, "total": total, "beats": beats}
    (HERE / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1), encoding="utf-8")
    pub = REPO / "remotion-composer" / "public" / slug
    pub.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(full, pub / "voice.mp3")
    shutil.copyfile(HERE / "timeline.json", REPO / "remotion-composer" / "src" / f"{slug}_timeline.json")

    print(f"DONE total={total:.2f}s voice={real:.2f}s · {len(beats)} beats · {len(lines)} lines -> public/{slug}/voice.mp3")
    for b in beats:
        print(f"  {b['name']:<10} {b['start']:7.2f} → {b['end']:7.2f}  pages={len(b['pages'])}")
    print(f"pace median {median:.1f} chars/s · lines off by >{PACE_TOLERANCE:.0%} (swallowed / stalled?): {len(flags)}")
    for f in flags:
        print("  ⚠", f)


if __name__ == "__main__":
    main()
