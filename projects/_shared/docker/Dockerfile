# VieNeu-TTS Docker — Vietnamese voice cloning with Adam reference
# Build: docker build -t vieneutts .
# Run: docker run -v /path/to/voice_refs:/refs -v /path/to/output:/out vieneutts \
#        --ref /refs/adam_ref.wav --ref-text /refs/adam_ref.txt --text "..." --out /out/voice.wav
FROM python:3.10-slim

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    libsndfile1 \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install F5-TTS (compatible w/ VieNeu via F5-TTS framework)
RUN pip install --no-cache-dir \
    torch==2.4.0+cpu \
    torchaudio==2.4.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install F5-TTS + VieNeu compatible deps (pin transformers compatible with torch 2.4)
RUN pip install --no-cache-dir \
    "transformers>=4.40,<4.48" \
    "tokenizers>=0.19,<0.21" \
    "numpy<2" \
    f5-tts \
    huggingface_hub \
    soundfile \
    librosa

# Pre-download F5-TTS Vietnamese (hynt/F5-TTS-Vietnamese-ViVoice — 1000h VN)
RUN python -c "from huggingface_hub import snapshot_download; \
    snapshot_download(repo_id='hynt/F5-TTS-Vietnamese-ViVoice', local_dir='/app/vn_model')" \
    && cp /app/vn_model/config.json /app/vn_model/vocab.txt \
    && ls -la /app/vn_model/

# Copy wrapper script
COPY tts_wrapper.py /app/tts_wrapper.py

# Volume mount points
VOLUME ["/refs", "/out"]

ENTRYPOINT ["python", "/app/tts_wrapper.py"]
