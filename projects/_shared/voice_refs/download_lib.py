"""Voice library downloader.

Sources: vivos (HF) / youtube_search / youtube / tiktok / librivox / direct
Output: voice_refs/<name>_ref.wav (mono 24kHz, 8-12s) + <name>_ref.txt (whisper transcript)

Usage:
    python download_lib.py                    # all voices in voices_config.json
    python download_lib.py vn_m_news_anchor   # one voice only
    python download_lib.py --transcribe-only  # re-run whisper on existing wavs
"""
from __future__ import annotations
import json, os, sys, subprocess, tempfile, shutil
from pathlib import Path

# Force UTF-8 stdout on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
CONFIG = HERE / "voices_config.json"
CACHE = HERE / "_cache"
CACHE.mkdir(exist_ok=True)

FFMPEG = shutil.which("ffmpeg") or "ffmpeg"
YTDLP = shutil.which("yt-dlp") or "yt-dlp"


def run(cmd, **kw):
    print(f"  $ {' '.join(str(c) for c in cmd[:6])}{'...' if len(cmd) > 6 else ''}")
    return subprocess.run(cmd, check=True, **kw)


def normalize_wav(src: Path, dst: Path, start: float, duration: float):
    """Trim, mono, 24kHz, normalize loudness, fade in/out 100ms."""
    run([
        FFMPEG, "-y", "-loglevel", "error",
        "-ss", str(start), "-t", str(duration),
        "-i", str(src),
        "-ac", "1", "-ar", "24000",
        "-af", f"afade=t=in:st=0:d=0.05,afade=t=out:st={duration-0.1}:d=0.1,loudnorm=I=-16:LRA=11:TP=-1.5",
        "-c:a", "pcm_s16le",
        str(dst),
    ])


EXCLUDE_CHANNELS = ["Ghiền Mì Gõ", "ghienmigo", "GMG"]


def download_youtube(query_or_url: str, out_dir: Path, is_search=False, search_count=1, exclude=None) -> Path:
    """Download to out_dir as mp3, return path."""
    exclude = exclude or EXCLUDE_CHANNELS
    if is_search:
        tag = f"ytsearch{search_count}:" + query_or_url
    else:
        tag = query_or_url
    out_tpl = str(out_dir / "%(id)s.%(ext)s")
    cmd = [
        YTDLP, "-x", "--audio-format", "mp3", "--audio-quality", "0",
        "--no-playlist", "-o", out_tpl,
        # Skip GMG and similar contaminating channels
        "--playlist-items", "1:5",  # for ytsearch5, allow yt-dlp to pick first match
    ]
    if exclude:
        # Build match-filter: reject if channel or uploader matches
        exclude_re = "|".join(exclude)
        cmd += ["--match-filter", f"channel!~='(?i){exclude_re}'&uploader!~='(?i){exclude_re}'"]
    cmd.append(tag)
    run(cmd)
    mp3s = sorted(out_dir.glob("*.mp3"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not mp3s:
        raise RuntimeError(f"yt-dlp produced no mp3 for {tag}")
    return mp3s[0]


def download_direct(url: str, out: Path):
    import urllib.request
    print(f"  ↓ {url}")
    urllib.request.urlretrieve(url, str(out))


def download_vivos(speaker_id: str, n_utt: int, out_dir: Path) -> Path:
    """Stream VIVOS, grab n utterances from speaker, concat to single wav."""
    from datasets import load_dataset
    print(f"  ↓ VIVOS streaming, picking {n_utt} utterances from {speaker_id}")
    ds = load_dataset("AILAB-VNUHCM/vivos", split="train", streaming=True)
    picks = []
    for ex in ds:
        if ex["speaker_id"] == speaker_id:
            picks.append(ex)
            if len(picks) >= n_utt:
                break
    if not picks:
        raise RuntimeError(f"No utterances for speaker {speaker_id}")

    parts = []
    for i, ex in enumerate(picks):
        audio = ex["audio"]
        part = out_dir / f"vivos_{speaker_id}_{i}.wav"
        import soundfile as sf
        sf.write(str(part), audio["array"], audio["sampling_rate"])
        parts.append(part)

    # concat with 200ms silence between
    concat_list = out_dir / "concat.txt"
    with concat_list.open("w") as f:
        for p in parts:
            f.write(f"file '{p.as_posix()}'\n")
    concat_out = out_dir / f"vivos_{speaker_id}_concat.wav"
    run([FFMPEG, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
         "-i", str(concat_list), "-c", "copy", str(concat_out)])
    return concat_out


def transcribe(wav: Path) -> str:
    """faster-whisper transcribe to text."""
    from faster_whisper import WhisperModel
    if not hasattr(transcribe, "_model"):
        print("  loading whisper model (medium)...")
        transcribe._model = WhisperModel("medium", device="cpu", compute_type="int8")
    # detect language: vi if filename starts with vn_, en otherwise
    lang = "vi" if wav.name.startswith("vn_") else "en"
    segs, _info = transcribe._model.transcribe(str(wav), language=lang, beam_size=5)
    text = " ".join(s.text.strip() for s in segs).strip()
    return text


def process_voice(v: dict, transcribe_only=False):
    name = v["name"]
    out_wav = HERE / f"{name}_ref.wav"
    out_txt = HERE / f"{name}_ref.txt"

    if transcribe_only:
        if not out_wav.exists():
            print(f"[{name}] SKIP — no wav")
            return
        print(f"[{name}] re-transcribe...")
        text = transcribe(out_wav)
        out_txt.write_text(text, encoding="utf-8")
        print(f"  → {text[:80]}...")
        return

    if out_wav.exists() and out_txt.exists():
        print(f"[{name}] EXISTS, skip")
        return

    print(f"[{name}] downloading from {v['source']}...")
    work = CACHE / name
    work.mkdir(exist_ok=True)

    try:
        src = v["source"]
        start = v.get("trim_start", 0.0)
        dur = v.get("trim_duration", 10.0)

        if src == "vivos":
            raw = download_vivos(v["speaker_id"], v.get("n_utterances", 3), work)
            start = 0.0  # vivos concat already clean
            normalize_wav(raw, out_wav, start, dur)
        elif src == "youtube_search":
            sc = v.get("search_count", 5)
            raw = download_youtube(v["query"], work, is_search=True, search_count=sc)
            normalize_wav(raw, out_wav, start, dur)
        elif src in ("youtube", "tiktok"):
            raw = download_youtube(v["url"], work, is_search=False)
            normalize_wav(raw, out_wav, start, dur)
        elif src == "librivox" or src == "direct":
            raw = work / "src.mp3"
            download_direct(v["url"], raw)
            normalize_wav(raw, out_wav, start, dur)
        else:
            raise ValueError(f"unknown source: {src}")

        print(f"  ✓ wav saved: {out_wav.name}")

        # transcribe
        text = transcribe(out_wav)
        out_txt.write_text(text, encoding="utf-8")
        print(f"  ✓ txt: {text[:80]}{'...' if len(text) > 80 else ''}")
    except Exception as e:
        print(f"  ✗ FAIL: {e}")


def main():
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    transcribe_only = "--transcribe-only" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    voices = cfg["voices"]
    if args:
        voices = [v for v in voices if v["name"] in args]
        if not voices:
            print(f"No voices match: {args}")
            sys.exit(1)

    for v in voices:
        process_voice(v, transcribe_only=transcribe_only)
        print()


if __name__ == "__main__":
    main()
