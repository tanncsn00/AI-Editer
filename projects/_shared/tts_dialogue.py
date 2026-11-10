"""Dialogue TTS for toon shorts: one EverAI voice per speaker, Rhubarb mouth cues per line.
Usage (from projects/<slug-dir>/): python ../_shared/tts_dialogue.py <public_slug> [--force]
Input : dialogue.md  ("SPEAKER: text" per line, "[pause 1.5]" for silent beats, "# Title" optional)
        cast.json    {"SPEAKER": {"voice": "<voice_code>", "speed": 1.0, "pitch": 1.0}}
Output: tts/voice_full.mp3, dialogue.json,
        remotion-composer/public/<slug>/voice.mp3, remotion-composer/src/<slug>_dialogue.json
"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests

from tts_lines import API, KEEP_HEAD, KEEP_TAIL, MODEL, duration, load_env, speech_bounds

RHUBARB = Path(__file__).resolve().parent / "tools" / "Rhubarb-Lip-Sync-1.14.0-Windows" / "rhubarb.exe"
LEAD_IN = 0.25
GAP_LINE = 0.25
PAUSE = re.compile(r"^\[pause ([\d.]+)\]$")
SPEAKER_LINE = re.compile(r"^([A-Z0-9_]+):\s*(.+)$")

HERE = Path.cwd()
REPO = Path(__file__).resolve().parents[2]
TTS = HERE / "tts"


def parse(path: Path, cast: dict):
    title, items = "", []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("# "):
            title = line[2:].strip()
        elif m := PAUSE.match(line):
            items.append({"kind": "pause", "seconds": float(m.group(1))})
        elif m := SPEAKER_LINE.match(line):
            if m.group(1) not in cast:
                sys.exit(f"FATAL: speaker {m.group(1)} missing from cast.json")
            items.append({"kind": "line", "speaker": m.group(1), "t": m.group(2).strip()})
        else:
            sys.exit(f"FATAL: unparsable line: {line}")
    return title, items


def sig(text: str, role: dict) -> str:
    key = f"{role['voice']}|{MODEL}|{role['speed']}|{role['pitch']}|{text}"
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]


def synth(text: str, role: dict, out: Path):
    h = {"Authorization": f"Bearer {os.environ['EVERAI_API_KEY']}"}
    body = {"input_text": text, "voice_code": role["voice"], "model_id": MODEL, "audio_type": "mp3", "bitrate": 128,
            "speed_rate": role["speed"], "pitch_rate": role["pitch"]}
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


def mouth_cues(wav16: Path, offset: float):
    out = wav16.with_suffix(".mouth.json")
    subprocess.run([str(RHUBARB), "-q", "-r", "phonetic", "-f", "json", "-o", str(out), str(wav16)], check=True)
    cues = json.loads(out.read_text(encoding="utf-8"))["mouthCues"]
    out.unlink()
    return [{"start": round(c["start"] + offset, 3), "end": round(c["end"] + offset, 3), "value": c["value"]} for c in cues]


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug, force = sys.argv[1], "--force" in sys.argv
    load_env()
    TTS.mkdir(exist_ok=True)
    cast = json.loads((HERE / "cast.json").read_text(encoding="utf-8"))
    title, items = parse(HERE / "dialogue.md", cast)
    lines = [it for it in items if it["kind"] == "line"]
    for ln in lines:
        ln["clip"] = TTS / f"line_{sig(ln['t'], cast[ln['speaker']])}.mp3"
    todo = [ln for ln in lines if force or not ln["clip"].exists()]
    print(f"{len(lines)} lines · {len(todo)} to generate")
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(lambda ln: synth(ln["t"], cast[ln["speaker"]], ln["clip"]), todo))

    pieces, cursor = [], LEAD_IN
    silence = lambda sec: ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", f"{sec:.3f}"]
    specs = [silence(LEAD_IN)]
    for i, it in enumerate(items):
        if it["kind"] == "pause":
            it["start"], it["end"] = round(cursor, 3), round(cursor + it["seconds"], 3)
            specs.append(silence(it["seconds"]))
            cursor += it["seconds"]
            continue
        onset, end = speech_bounds(it["clip"])
        a, z = max(0.0, onset - KEEP_HEAD), end + KEEP_TAIL
        it["start"], it["end"] = round(cursor + (onset - a), 3), round(cursor + (end - a), 3)
        trim = ["-i", str(it["clip"]), "-af", f"atrim={a:.3f}:{z:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono"]
        specs.append(trim)
        wav16 = TTS / f"_m{i:03d}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(it["clip"]), "-af", f"atrim={a:.3f}:{z:.3f},asetpts=PTS-STARTPTS", "-ar", "16000", "-ac", "1", str(wav16), "-y"], check=True)
        it["mouth"] = mouth_cues(wav16, cursor)
        wav16.unlink()
        cursor += z - a
        next_is_line = i + 1 < len(items) and items[i + 1]["kind"] == "line"
        if next_is_line:
            specs.append(silence(GAP_LINE))
            cursor += GAP_LINE

    parts = []
    for i, spec in enumerate(specs):
        w = TTS / f"_p{i:04d}.wav"
        subprocess.run(["ffmpeg", "-v", "error", *spec, str(w), "-y"], check=True)
        parts.append(w)
    lst = TTS / "_concat.txt"
    lst.write_text("".join(f"file '{w.as_posix()}'\n" for w in parts), encoding="utf-8")
    full = TTS / "voice_full.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-b:a", "128k", str(full), "-y"], check=True)
    for w in parts:
        w.unlink()

    total = round(cursor, 3)
    real = duration(full)
    if abs(real - total) > 0.05:
        sys.exit(f"FATAL: voice_full {real:.3f}s != timeline {total:.3f}s")
    out_items = [{k: v for k, v in it.items() if k not in ("clip", "seconds")} for it in items]
    timeline = {"title": title, "total": total, "items": out_items}
    (HERE / "dialogue.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1), encoding="utf-8")
    pub = REPO / "remotion-composer" / "public" / slug
    pub.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(full, pub / "voice.mp3")
    shutil.copyfile(HERE / "dialogue.json", REPO / "remotion-composer" / "src" / f"{slug}_dialogue.json")

    print(f"DONE total={total:.2f}s voice={real:.2f}s -> public/{slug}/voice.mp3")
    for i, it in enumerate(items):
        label = f"{it['speaker']}: {it['t']}" if it["kind"] == "line" else "[pause]"
        print(f"  {i:2d} {it['start']:6.2f} → {it['end']:6.2f}  {label}")


if __name__ == "__main__":
    main()
