# Adam Voice Local Pipeline (Docker · F5-TTS Vietnamese)

✅ **WORKING**: Adam voice reading Vietnamese, $0 cost, no API, local Docker.

## Setup (one-time, ~5 min)

```bash
cd projects/_shared/docker
bash build.sh
```

This builds Docker image `vieneutts:latest` with:
- F5-TTS framework
- `hynt/F5-TTS-Vietnamese-ViVoice` model (1000h VN training)
- Vocos vocoder

The Adam reference audio is already at `voice_refs/adam_ref.wav` (downloaded from `SyntheticVoicess/Adam_11labs` HuggingFace).

## Usage in any project

```bash
cd projects/<your-slug>
python ../_shared/run_tts_docker.py
```

Reads `script.json` → writes `tts/beat_*.mp3` in Adam voice.

## Performance

- CPU (no GPU): ~76s per beat
- For an 8-beat video: ~10 minutes total TTS
- GPU (CUDA): would be ~5s per beat (need Dockerfile mod)

## Verification

After TTS, ALWAYS whisper-verify per `feedback_caption_whisper_verify`:
```bash
python verify.py  # diff whisper transcript vs script
```

## Files

- `docker/Dockerfile` — image definition
- `docker/build.sh` — one-time build
- `docker/tts_wrapper.py` — inside-container TTS script
- `run_tts_docker.py` — host-side runner (replaces EverAI run_tts.py)
- `voice_refs/adam_ref.wav` — 11.7s mono 24kHz Adam clip
- `voice_refs/adam_ref.txt` — English transcript of ref

## Swap reference voice

To use a different voice (e.g. another deep male):
1. Drop clean WAV (mono 24kHz, 5-25s) at `voice_refs/<name>.wav`
2. Transcribe to `voice_refs/<name>.txt`
3. Set env: `VOICE_REF_WAV=voice_refs/<name>.wav python run_tts_docker.py`

## Trade-offs vs paid options

| | Adam Docker (this) | EverAI lehoang | ElevenLabs API |
|---|---|---|---|
| Cost | $0 forever | per call | 10K free/mo then $5+ |
| VN tone | American accent | Native VN | American accent |
| Quality | MOS ~4.3 | MOS ~4.0 | MOS 4.8 |
| Speed CPU | 76s/beat | 2s/beat | 1s/beat |
| Offline | ✓ | ✗ | ✗ |
| Brand voice | Adam | lehoang | Adam (real) |
