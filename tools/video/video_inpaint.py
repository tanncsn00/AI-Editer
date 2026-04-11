"""Video inpainting utility for removing burned text/watermark from footage.

Modes:
- crop     : Fastest. Cut away the region containing text (if at edge).
- delogo   : ffmpeg built-in inpaint via neighboring pixels. Good for static small text.
- overlay  : Cover with dark box + optionally new Vietnamese text. No removal, just hide.
- propainter: AI video inpaint (best quality). Requires ProPainter setup — see video_inpaint_setup.md.

CLI:
  python tools/video/video_inpaint.py crop     --input src.mp4 --output out.mp4 --crop 1080:1640:0:160
  python tools/video/video_inpaint.py delogo   --input src.mp4 --output out.mp4 --region 40:1400:1000:120
  python tools/video/video_inpaint.py overlay  --input src.mp4 --output out.mp4 --region 0:1300:1080:180 --text "Tiêu đề mới"
  python tools/video/video_inpaint.py propainter --input src.mp4 --mask mask_dir/ --output out_dir/
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROPAINTER_DIR = ROOT / "tools" / "vendor" / "ProPainter"


def run(cmd: list[str]) -> int:
    print("$", " ".join(cmd))
    return subprocess.run(cmd).returncode


def mode_crop(args: argparse.Namespace) -> int:
    """Crop out a region (typically bottom strip with text)."""
    # crop=w:h:x:y
    crop_spec = args.crop
    cmd = [
        "ffmpeg", "-y", "-i", args.input,
        "-vf", f"crop={crop_spec}",
        "-c:a", "copy", "-c:v", "libx264", "-crf", "20",
        args.output,
    ]
    return run(cmd)


def mode_delogo(args: argparse.Namespace) -> int:
    """Use ffmpeg's delogo filter to inpaint a region.

    Good for small static watermarks. Not great for large text areas or moving text.
    """
    # region: x:y:w:h
    parts = args.region.split(":")
    if len(parts) != 4:
        print("--region must be x:y:w:h", file=sys.stderr)
        return 1
    x, y, w, h = parts
    cmd = [
        "ffmpeg", "-y", "-i", args.input,
        "-vf", f"delogo=x={x}:y={y}:w={w}:h={h}",
        "-c:a", "copy", "-c:v", "libx264", "-crf", "20",
        args.output,
    ]
    return run(cmd)


def mode_overlay(args: argparse.Namespace) -> int:
    """Cover a region with a dark box + optional new text overlay.

    Fastest approach for affiliate videos: don't try to remove original,
    just place new Vietnamese headline over it with a dark backdrop.
    """
    parts = args.region.split(":")
    if len(parts) != 4:
        print("--region must be x:y:w:h", file=sys.stderr)
        return 1
    x, y, w, h = parts

    filters = [
        f"drawbox=x={x}:y={y}:w={w}:h={h}:color={args.box_color}:t=fill",
    ]

    if args.text:
        # Draw centered text inside the box
        fontfile_arg = ""
        if args.font:
            # ffmpeg drawtext needs forward slashes + escape colons on Windows
            font_path = args.font.replace("\\", "/").replace(":", "\\:")
            fontfile_arg = f":fontfile='{font_path}'"
        text_filter = (
            f"drawtext=text='{args.text}'"
            f":fontcolor={args.text_color}"
            f":fontsize={args.font_size}"
            f":x={x}+({w}-text_w)/2"
            f":y={y}+({h}-text_h)/2"
            f"{fontfile_arg}"
        )
        filters.append(text_filter)

    cmd = [
        "ffmpeg", "-y", "-i", args.input,
        "-vf", ",".join(filters),
        "-c:a", "copy", "-c:v", "libx264", "-crf", "20",
        args.output,
    ]
    return run(cmd)


def mode_propainter(args: argparse.Namespace) -> int:
    """Run ProPainter video inpainting. Requires setup first."""
    if not PROPAINTER_DIR.exists():
        print(
            f"ProPainter not found at {PROPAINTER_DIR}\n"
            f"See tools/video/video_inpaint_setup.md for install steps.",
            file=sys.stderr,
        )
        return 2

    script = PROPAINTER_DIR / "inference_propainter.py"
    cmd = [
        sys.executable, str(script),
        "--video", args.input,
        "--mask", args.mask,
        "--output", args.output,
    ]
    if args.fp16:
        cmd.append("--fp16")
    return subprocess.run(cmd, cwd=str(PROPAINTER_DIR)).returncode


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Video inpainting utility")
    sub = p.add_subparsers(dest="mode", required=True)

    p_crop = sub.add_parser("crop", help="Crop region out (edge text)")
    p_crop.add_argument("--input", required=True)
    p_crop.add_argument("--output", required=True)
    p_crop.add_argument("--crop", required=True, help="ffmpeg crop spec: w:h:x:y")
    p_crop.set_defaults(func=mode_crop)

    p_del = sub.add_parser("delogo", help="ffmpeg delogo inpaint")
    p_del.add_argument("--input", required=True)
    p_del.add_argument("--output", required=True)
    p_del.add_argument("--region", required=True, help="x:y:w:h")
    p_del.set_defaults(func=mode_delogo)

    p_ov = sub.add_parser("overlay", help="Cover region with box + optional text")
    p_ov.add_argument("--input", required=True)
    p_ov.add_argument("--output", required=True)
    p_ov.add_argument("--region", required=True, help="x:y:w:h")
    p_ov.add_argument("--text", default="", help="New text to draw over the box")
    p_ov.add_argument("--font", default="", help="Path to .ttf font file")
    p_ov.add_argument("--font-size", type=int, default=56)
    p_ov.add_argument("--text-color", default="white")
    p_ov.add_argument("--box-color", default="black@0.85")
    p_ov.set_defaults(func=mode_overlay)

    p_pp = sub.add_parser("propainter", help="AI video inpaint (ProPainter)")
    p_pp.add_argument("--input", required=True)
    p_pp.add_argument("--mask", required=True, help="Mask frames directory")
    p_pp.add_argument("--output", required=True)
    p_pp.add_argument("--fp16", action="store_true")
    p_pp.set_defaults(func=mode_propainter)

    return p


def main() -> int:
    args = build_parser().parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
