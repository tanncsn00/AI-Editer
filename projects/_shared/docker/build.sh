#!/usr/bin/env bash
# Build VieNeu-TTS Docker image (one-time, ~5-10 min)
set -e
cd "$(dirname "$0")"

echo "=== Building vieneutts Docker image ==="
docker build -t vieneutts:latest .
echo
echo "✓ Built. Image: vieneutts:latest"
echo
echo "Test:"
echo "  docker run --rm \\"
echo "    -v $(pwd)/../voice_refs:/refs \\"
echo "    -v $(pwd)/test_out:/out \\"
echo "    vieneutts \\"
echo "    --ref /refs/adam_ref.wav \\"
echo "    --ref-text /refs/adam_ref.txt \\"
echo "    --text \"Xin chào, đây là giọng Adam đọc tiếng Việt.\" \\"
echo "    --out /out/test.wav"
