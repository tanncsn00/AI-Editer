import io
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

HERE = Path(__file__).resolve().parent
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
BASE = "https://www.myinstants.com"

CATALOG = {
    "punch": [
        ("vine-boom", "vine boom"),
        ("bonk", "bonk sound effect"),
        ("metal-pipe", "metal pipe falling"),
        ("airhorn", "air horn"),
        ("emotional-damage", "emotional damage"),
    ],
    "fail": [
        ("windows-error", "windows error"),
        ("wrong-buzzer", "wrong buzzer"),
        ("roblox-oof", "roblox oof"),
        ("sad-violin", "sad violin"),
        ("fail-trombone", "sad trombone"),
    ],
    "funny": [
        ("duck-quack", "duck quack"),
        ("laugh-track", "sitcom laugh track"),
        ("crickets", "crickets awkward"),
        ("record-scratch", "record scratch"),
        ("goofy-ahh", "goofy ahh car horn"),
    ],
    "win": [
        ("ding-correct", "correct ding"),
        ("level-up", "level up"),
        ("cash-register", "cash register"),
        ("angelic", "angelic choir"),
    ],
    "ui": [
        ("discord-ping", "discord notification"),
        ("iphone-ding", "iphone notification"),
        ("typing", "keyboard typing"),
        ("whoosh", "transition whoosh"),
    ],
}


def find_mp3(query: str) -> str | None:
    url = f"{BASE}/en/search/?name={urllib.parse.quote(query)}"
    try:
        html = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=25).read().decode("utf-8", "replace")
    except Exception as e:
        print(f"    search fail: {e}")
        return None
    hits = re.findall(r"/media/sounds/[^\"']+\.mp3", html)
    return BASE + hits[0] if hits else None


def main():
    total = ok = 0
    for group, items in CATALOG.items():
        outdir = HERE / group
        outdir.mkdir(parents=True, exist_ok=True)
        for name, query in items:
            total += 1
            dest = outdir / f"{name}.mp3"
            if dest.exists():
                print(f"  [skip] {group}/{name}")
                ok += 1
                continue
            print(f"  [get ] {group}/{name}  <- {query}")
            link = find_mp3(query)
            if not link:
                print("    no result")
                continue
            try:
                data = urllib.request.urlopen(urllib.request.Request(link, headers=UA), timeout=30).read()
            except Exception as e:
                print(f"    download fail: {e}")
                continue
            if len(data) < 2000:
                print(f"    too small ({len(data)}b), skip")
                continue
            dest.write_bytes(data)
            ok += 1
            print(f"    saved {len(data)//1024} KB")
            time.sleep(0.6)
    print(f"\nDONE {ok}/{total}")


if __name__ == "__main__":
    main()
