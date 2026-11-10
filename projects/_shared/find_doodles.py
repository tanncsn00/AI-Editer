"""Search the CocoMaterial doodle library by keyword and build a picker page.
Usage: python projects/_shared/find_doodles.py phone sleep cat ...
Prints matching names (copy them into the project's doodles.txt) and writes doodle_assets/_preview/find.html.
View: python -m http.server 8765 --bind 127.0.0.1 --directory projects/_shared/doodle_assets  ->  http://127.0.0.1:8765/_preview/find.html
"""
import html, io, json, os, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ASSETS = Path(__file__).resolve().parent / "doodle_assets"
PER_KEYWORD = 30


def text_of(item):
    tags = [t if isinstance(t, str) else str(t.get("name", "")) for t in (item.get("tags") or [])]
    return f"{item.get('name') or ''} {' '.join(tags)}".lower()


def main():
    words = [w.lower() for w in sys.argv[1:]]
    if not words:
        sys.exit("usage: python projects/_shared/find_doodles.py <keyword> [keyword ...]")
    items = [x for x in json.loads((ASSETS / "cocomaterial" / "index.json").read_text(encoding="utf-8")) if x.get("svg") and x.get("name")]
    sections = []
    for w in words:
        hits = [x for x in items if w in text_of(x)][:PER_KEYWORD]
        print(f"\n## {w} ({len(hits)})")
        for h in hits:
            print(f"  {h['name']}")
        cells = "".join(
            f'<figure><img src="../cocomaterial/svg/{os.path.basename(h["svg"])}"><figcaption>{html.escape(h["name"])}</figcaption></figure>' for h in hits
        )
        sections.append(f"<h3>{html.escape(w)}</h3><div class=g>{cells or 'no match'}</div>")
    page = (
        "<!doctype html><meta charset=utf-8><title>Find doodles</title><style>body{font-family:system-ui;margin:12px;background:#0B0A12;color:#F2ECE0}"
        ".g{display:flex;flex-wrap:wrap;gap:6px}figure{margin:0;width:130px;text-align:center}"
        "img{width:130px;height:110px;object-fit:contain;background:#fff;border-radius:6px}figcaption{font-size:11px}</style>"
        + "".join(sections)
    )
    out = ASSETS / "_preview" / "find.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(f"\n-> {out}")


if __name__ == "__main__":
    main()
