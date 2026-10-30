"""Retime Flow motion-control clips onto a song, line by line, and compose the 9:16 post.

Usage: python retime_to_song.py <config.json>

config.json:
{
  "clips": ["flow/k0.mp4", "flow/k1.mp4"],      // generated in reference order, each covers clip_len seconds of the reference
  "clip_len": 10.0,
  "pieces": [[0.0, 1.96, 1.63, 3.24], ...],     // [ref_start, ref_end, song_start, song_end]; ref time is continuous across clips
  "song": "music/song.mp3",
  "song_end": 41.4,
  "card": "out/card.png",                       // optional 1080x1920 RGBA overlay (title box, CTA)
  "out": "out/final.mp4"
}
Pieces are concatenated in order; each is sped up/slowed down so its ref span fills its song span.
A piece may not cross a clip boundary — split it at clip_len multiples.
"""
import json, subprocess, sys
from pathlib import Path

FPS = 24
FADE_OUT = 1.2


def main():
    cfg = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    base = Path(sys.argv[1]).parent
    clips, L, pieces = [base / c for c in cfg["clips"]], cfg["clip_len"], cfg["pieces"]
    for a, b in zip(pieces, pieces[1:]):
        if abs(a[3] - b[2]) > 1e-6:
            sys.exit(f"FATAL: song gap/overlap between {a} and {b}")

    inputs = [x for c in clips for x in ("-i", str(c))]
    chains, labels = [], []
    for n, (ra, rb, sa, sb) in enumerate(pieces):
        k = int(ra // L)
        if k >= len(clips) or rb - k * L > L + 1e-6:
            sys.exit(f"FATAL: piece {n} {ra}-{rb} crosses a clip boundary or has no clip")
        chains.append(f"[{k}:v]trim={ra - k * L:.3f}:{rb - k * L:.3f},setpts=(PTS-STARTPTS)*{(sb - sa) / (rb - ra):.5f},fps={FPS}[p{n}]")
        labels.append(f"[p{n}]")
    strip = base / (Path(cfg["out"]).stem + "_strip.mp4")
    subprocess.run(["ffmpeg", "-v", "error", *inputs, "-filter_complex", ";".join(chains) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0[v]",
                    "-map", "[v]", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(strip), "-y"], check=True)

    start, end, song_end = pieces[0][2], pieces[-1][3], cfg["song_end"]
    dur = song_end - start
    vy = (1920 - 608) // 2 + 40
    graph = (f"color=c=black:s=1080x1920:r=30:d={dur}[bg];"
             f"[0:v]scale=1080:608:flags=lanczos,unsharp=5:5:0.6,tpad=stop_mode=clone:stop_duration={dur - (end - start) + 0.1},fps=30[v];"
             f"[bg][v]overlay=0:{vy}[b]")
    cmd = ["ffmpeg", "-v", "error", "-i", str(strip)]
    if cfg.get("card"):
        cmd += ["-loop", "1", "-i", str(base / cfg["card"])]
        graph += ";[b][1:v]overlay=0:0,format=yuv420p[out]"
        audio_idx = 2
    else:
        graph += ";[b]format=yuv420p[out]"
        audio_idx = 1
    cmd += ["-i", str(base / cfg["song"])]
    graph += f";[{audio_idx}:a]atrim={start}:{song_end},asetpts=PTS-STARTPTS,afade=t=out:st={dur - FADE_OUT}:d={FADE_OUT}[a]"
    subprocess.run(cmd + ["-filter_complex", graph, "-map", "[out]", "-map", "[a]", "-t", f"{dur}", "-c:v", "libx264", "-crf", "18", "-r", "30",
                          "-c:a", "aac", "-b:a", "192k", str(base / cfg["out"]), "-y"], check=True)
    print(f"music {start:.2f}-{song_end} · {len(pieces)} pieces -> {cfg['out']}")


if __name__ == "__main__":
    main()
