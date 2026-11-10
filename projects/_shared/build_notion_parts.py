"""Pack notion-avatar preview parts (1080x1080 canvas, CC0) into remotion-composer/src/toon/notion_parts.json.
Usage: python projects/_shared/build_notion_parts.py
Output: {"filter": "<defs>...</defs>", "parts": {"mouth": {"11": "<g>...</g>", ...}, ...}}
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AVATAR = ROOT / "projects" / "_shared" / "doodle_assets" / "notion-avatar"
PREVIEW = AVATAR / "public" / "avatar" / "preview"
OUT = ROOT / "remotion-composer" / "src" / "toon" / "notion_parts.json"
PART_TYPES = ["face", "nose", "mouth", "eyes", "eyebrows", "glasses", "hair", "accessories", "details", "beard"]


def inner_svg(path: Path) -> str:
    raw = path.read_text(encoding="utf-8")
    body = re.sub(r"<svg[^>]*>", "", raw, count=1).replace("</svg>", "")
    return re.sub(r"\s*\n\s*", "", body)


def main():
    const_ts = (AVATAR / "src" / "const.ts").read_text(encoding="utf-8")
    svg_filter = re.search(r"SVGFilter = `(.*?)`", const_ts, re.S).group(1)
    parts = {
        part: {p.stem: inner_svg(p) for p in sorted((PREVIEW / part).glob("*.svg"))}
        for part in PART_TYPES
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"filter": re.sub(r"\s*\n\s*", "", svg_filter), "parts": parts}, ensure_ascii=False), encoding="utf-8")
    print(f"{OUT} | " + " | ".join(f"{k} {len(v)}" for k, v in parts.items()))


if __name__ == "__main__":
    main()
