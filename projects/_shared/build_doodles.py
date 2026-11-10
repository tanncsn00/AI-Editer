"""Flatten picked CocoMaterial SVGs into normalized path data for whiteboard/WhiteboardVideo.tsx.
Usage (from projects/<slug-dir>/): python ../_shared/build_doodles.py <public_slug>
Input : doodles.txt  (one CocoMaterial name per line, exactly as find_doodles.py prints it)
Output: remotion-composer/src/<slug>_doodles.json  {name: {w, h, parts: [{fill, rule, subs: [d, ...]}]}}  (height normalized to 1000)
"""
import io, json, os, sys
from pathlib import Path
from svgelements import SVG, Path as SvgPath, Shape, Move, Line, CubicBezier, QuadraticBezier, Arc, Close

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ASSETS = Path(__file__).resolve().parent / "doodle_assets" / "cocomaterial"
SRC = Path(__file__).resolve().parents[2] / "remotion-composer" / "src"
UNIT = 1000.0


def fmt(p):
    return f"{p.x:.1f},{p.y:.1f}"


def subpaths(path: SvgPath):
    subs, cur = [], []
    for seg in path:
        if isinstance(seg, Move):
            if cur:
                subs.append(cur)
            cur = [f"M{fmt(seg.end)}"]
        elif isinstance(seg, Line):
            cur.append(f"L{fmt(seg.end)}")
        elif isinstance(seg, CubicBezier):
            cur.append(f"C{fmt(seg.control1)} {fmt(seg.control2)} {fmt(seg.end)}")
        elif isinstance(seg, QuadraticBezier):
            cur.append(f"Q{fmt(seg.control)} {fmt(seg.end)}")
        elif isinstance(seg, Arc):
            for c in seg.as_cubic_curves():
                cur.append(f"C{fmt(c.control1)} {fmt(c.control2)} {fmt(c.end)}")
        elif isinstance(seg, Close):
            cur.append("Z")
    if cur:
        subs.append(cur)
    return [" ".join(s) for s in subs if len(s) > 1]


def convert(svg_file: Path):
    svg = SVG.parse(str(svg_file), reify=True)
    paths = []
    for el in svg.elements():
        if isinstance(el, Shape) and not isinstance(el, SVG):
            fill = el.fill
            if fill is None or fill.value is None:
                continue
            p = SvgPath(el)
            p.reify()
            paths.append((p, fill.hex[:7], el.values.get("fill-rule", "nonzero")))
    if not paths:
        sys.exit(f"FATAL: no filled paths in {svg_file.name}")
    boxes = [p.bbox() for p, _, _ in paths if p.bbox()]
    x0, y0 = min(b[0] for b in boxes), min(b[1] for b in boxes)
    x1, y1 = max(b[2] for b in boxes), max(b[3] for b in boxes)
    s = UNIT / (y1 - y0)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    parts = []
    for p, fill, rule in paths:
        q = SvgPath(p)
        q *= f"translate({-cx},{-cy})"
        q *= f"scale({s})"
        q.reify()
        parts.append({"fill": fill, "rule": rule, "subs": subpaths(q)})
    return {"w": round((x1 - x0) * s, 1), "h": UNIT, "parts": parts}


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python ../_shared/build_doodles.py <public_slug>")
    slug = sys.argv[1]
    picks = [ln.strip() for ln in Path("doodles.txt").read_text(encoding="utf-8").splitlines() if ln.strip()]
    index = json.loads((ASSETS / "index.json").read_text(encoding="utf-8"))
    by_name = {x["name"]: x for x in index if x.get("name") and x.get("svg")}
    missing = [n for n in picks if n not in by_name]
    if missing:
        sys.exit(f"FATAL: not in CocoMaterial index (check spelling with find_doodles.py): {missing}")
    out = {}
    for name in dict.fromkeys(picks):
        out[name] = convert(ASSETS / "svg" / os.path.basename(by_name[name]["svg"]))
        print(f"{name:28} parts={[(pt['fill'], len(pt['subs'])) for pt in out[name]['parts']]} w={out[name]['w']}")
    dest = SRC / f"{slug}_doodles.json"
    dest.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    print(f"-> {dest} ({dest.stat().st_size // 1024} KB, {len(out)} doodles)")


if __name__ == "__main__":
    main()
