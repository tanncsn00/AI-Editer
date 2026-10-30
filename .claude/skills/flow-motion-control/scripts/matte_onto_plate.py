"""Cut people out of a video and composite them onto a still background plate.

Two uses in the Flow motion-control workflow:
  people  : clean the motion reference BEFORE Flow (removes its backdrop, captions, logo)
  cartoon : clean a Flow output whose backdrop leaked from the reference

Usage:
  python matte_onto_plate.py <src.mp4> <plate.jpg> <out.mp4> [--mode people|cartoon]
         [--start S] [--dur D] [--cut-below Y] [--size 1280x720] [--fps 24]
"""
import argparse, subprocess, sys
import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

MODELS = {"people": "u2net_human_seg", "cartoon": "isnet-general-use"}
KERNEL = np.ones((7, 7), np.uint8)
MIN_BLOB = 0.25


def backdrop_colors(frame):
    h, s, v = cv2.split(cv2.cvtColor(frame, cv2.COLOR_RGB2HSV))
    grass = (h >= 35) & (h <= 85) & (s > 90)
    sky = (h >= 88) & (h <= 108) & (s > 80) & (v > 170)
    sun = (h >= 12) & (h <= 34) & (s > 150) & (v > 150)
    hit = cv2.morphologyEx((grass | sky | sun).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(hit.astype(np.float32), (5, 5), 0)


def keep_main_blobs(mask):
    solid = cv2.morphologyEx((mask > 0.5).astype(np.uint8), cv2.MORPH_OPEN, KERNEL)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(solid)
    if n <= 1:
        return mask * 0
    biggest = stats[1:, cv2.CC_STAT_AREA].max()
    keep = np.isin(labels, [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= MIN_BLOB * biggest])
    keep = cv2.dilate(keep.astype(np.uint8), KERNEL).astype(np.float32)
    return mask * cv2.GaussianBlur(keep, (9, 9), 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("plate"); ap.add_argument("out")
    ap.add_argument("--mode", choices=MODELS, default="people")
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--dur", type=float)
    ap.add_argument("--cut-below", type=int, help="zero the mask below this row (burned-in captions)")
    ap.add_argument("--size", default="1280x720")
    ap.add_argument("--fps", type=int, default=24)
    a = ap.parse_args()
    W, H = map(int, a.size.split("x"))
    plate = np.asarray(Image.open(a.plate).convert("RGB").resize((W, H), Image.LANCZOS), dtype=np.float32)
    session = new_session(MODELS[a.mode])

    cmd = ["ffmpeg", "-v", "error", "-ss", str(a.start), "-i", a.src]
    if a.dur:
        cmd += ["-t", str(a.dur)]
    src = subprocess.Popen(cmd + ["-vf", f"scale={W}:{H},fps={a.fps}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    dst = subprocess.Popen(["ffmpeg", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(a.fps), "-i", "-",
                            "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", a.out, "-y"], stdin=subprocess.PIPE)
    n = 0
    while True:
        raw = src.stdout.read(W * H * 3)
        if len(raw) < W * H * 3:
            break
        frame = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
        mask = np.asarray(remove(Image.fromarray(frame), session=session, only_mask=True), dtype=np.float32) / 255.0
        if a.cut_below:
            mask[a.cut_below:, :] = 0
        if a.mode == "cartoon":
            mask = keep_main_blobs(mask * (1 - backdrop_colors(frame)))
        dst.stdin.write((frame * mask[..., None] + plate * (1 - mask[..., None])).astype(np.uint8).tobytes())
        n += 1
    dst.stdin.close(); dst.wait()
    if src.wait() != 0 or dst.returncode != 0 or n == 0:
        sys.exit(f"FATAL: matte failed after {n} frames")
    print(f"done {n} frames -> {a.out}")


if __name__ == "__main__":
    main()
