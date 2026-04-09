# Tử Vi Tình Duyên — TikTok Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a 30-second TikTok video (9:16) about "3 dấu hiệu tử vi cho thấy bạn sắp gặp người định mệnh" — cosmic background images, text overlay, ambient music, no voiceover.

**Architecture:** Download 6 cosmic stock images from Pexels → download 1 dark ambient music track from Pixabay Music → build `props.json` with 6 text_card scenes using `backgroundImage` → render via Remotion TikTok composition.

**Tech Stack:** Remotion (TikTok composition), Pexels API (stock images), Pixabay Music (ambient track), Python tool registry.

**Spec:** `docs/superpowers/specs/2026-04-09-tu-vi-tinh-duyen-design.md`

---

### File Map

| File | Action | Purpose |
|------|--------|---------|
| `projects/tu-vi-tinh-duyen/assets/images/` | Create dir | 6 cosmic stock images |
| `projects/tu-vi-tinh-duyen/assets/music/` | Create dir | Ambient music track |
| `remotion-composer/public/tu-vi-tinh-duyen/` | Create dir | Symlink/copy assets for Remotion |
| `remotion-composer/public/tu-vi-tinh-duyen/props.json` | Create | Scene definitions, audio config |
| `remotion-composer/out/tu-vi-tinh-duyen.mp4` | Output | Final rendered video |

---

### Task 1: Preflight — Check Tool Availability

**Files:** None (read-only)

- [ ] **Step 1: Run preflight to check available tools**

```bash
cd E:/tvk/OpenMontage
python -c "
from tools.tool_registry import registry
import json
registry.discover()
envelope = registry.support_envelope()
# Check key tools
for name in ['pexels_image', 'pixabay_music', 'video_compose']:
    tool = envelope.get(name, {})
    print(f'{name}: {tool.get(\"status\", \"NOT FOUND\")}')
"
```

Expected: `pexels_image: AVAILABLE`, `pixabay_music: AVAILABLE`, `video_compose: AVAILABLE`

- [ ] **Step 2: Verify Remotion is working**

```bash
cd E:/tvk/OpenMontage/remotion-composer
npx remotion compositions src/index.tsx 2>&1 | head -20
```

Expected: Output listing compositions including `TikTok`.

- [ ] **Step 3: Verify PEXELS_API_KEY is set**

```bash
cd E:/tvk/OpenMontage
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
key = os.environ.get('PEXELS_API_KEY', '')
if '#' in key:
    key = key[:key.index('#')].strip()
print('PEXELS_API_KEY:', 'SET' if key else 'MISSING')
"
```

Expected: `PEXELS_API_KEY: SET`. If MISSING, set it in `.env` before proceeding.

- [ ] **Step 4: Create project directories**

```bash
mkdir -p E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/images
mkdir -p E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/music
mkdir -p E:/tvk/OpenMontage/remotion-composer/public/tu-vi-tinh-duyen
```

---

### Task 2: Download Cosmic Stock Images (6 images)

**Files:**
- Create: `projects/tu-vi-tinh-duyen/assets/images/scene-*.jpg` (6 files)

- [ ] **Step 1: Search and download 6 cosmic/galaxy images from Pexels**

```python
import os, sys
sys.path.insert(0, "E:/tvk/OpenMontage")
from dotenv import load_dotenv
load_dotenv("E:/tvk/OpenMontage/.env")

from tools.graphics.pexels_image import PexelsImage

tool = PexelsImage()
base = "E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/images"

queries = [
    ("dark galaxy cosmos", "scene-1-hook.jpg"),
    ("purple nebula space", "scene-2-intro.jpg"),
    ("pink nebula stars", "scene-3-dh1.jpg"),
    ("starfield deep space", "scene-4-dh2.jpg"),
    ("constellation night sky", "scene-5-dh3.jpg"),
    ("galaxy universe dark", "scene-6-cta.jpg"),
]

for query, filename in queries:
    result = tool.execute({
        "query": query,
        "orientation": "portrait",
        "size": "large",
        "per_page": 3,
        "output_path": f"{base}/{filename}",
    })
    if result.success:
        print(f"OK: {filename}")
    else:
        print(f"FAIL: {filename} — {result.error}")
```

Expected: 6 files downloaded to `projects/tu-vi-tinh-duyen/assets/images/`.

- [ ] **Step 2: Verify images exist and are reasonable size**

```bash
ls -lh E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/images/
```

Expected: 6 JPG files, each 100KB-2MB.

- [ ] **Step 3: Copy images to Remotion public directory**

```bash
cp E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/images/*.jpg \
   E:/tvk/OpenMontage/remotion-composer/public/tu-vi-tinh-duyen/
```

---

### Task 3: Download Ambient Music Track

**Files:**
- Create: `projects/tu-vi-tinh-duyen/assets/music/ambient.mp3`

- [ ] **Step 1: Check music_library for existing tracks**

```bash
ls E:/tvk/OpenMontage/music_library/ 2>/dev/null || echo "No music_library directory"
```

If tracks exist, pick one and skip to Step 3. Otherwise continue to Step 2.

- [ ] **Step 2: Download dark ambient track from Pixabay Music**

```python
import sys
sys.path.insert(0, "E:/tvk/OpenMontage")

from tools.audio.pixabay_music import PixabayMusic

tool = PixabayMusic()
result = tool.execute({
    "query": "dark ambient mysterious space",
    "min_duration": 30,
    "max_duration": 120,
    "output_path": "E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/music/ambient.mp3",
})
print("OK" if result.success else f"FAIL: {result.error}")
if result.success:
    print(result.data)
```

Expected: MP3 file saved. If Pixabay Music fails (scraper broken), manually download a free ambient track and place it at the output path.

- [ ] **Step 3: Copy music to Remotion public directory**

```bash
cp E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/assets/music/ambient.mp3 \
   E:/tvk/OpenMontage/remotion-composer/public/tu-vi-tinh-duyen/
```

---

### Task 4: Build props.json

**Files:**
- Create: `remotion-composer/public/tu-vi-tinh-duyen/props.json`

- [ ] **Step 1: Write the props.json file**

```json
{
  "cuts": [
    {
      "id": "scene-1-hook",
      "source": "",
      "in_seconds": 0,
      "out_seconds": 3,
      "type": "text_card",
      "text": "3 DẤU HIỆU TỬ VI\nCHO THẤY BẠN SẮP\nGẶP NGƯỜI ĐỊNH MỆNH",
      "fontSize": 72,
      "color": "#FFD700",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-1-hook.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    },
    {
      "id": "scene-2-intro",
      "source": "",
      "in_seconds": 3,
      "out_seconds": 6,
      "type": "text_card",
      "text": "Nếu lá số bạn có 1 trong 3 điều này...\nTÌNH DUYÊN đang đến RẤT GẦN",
      "fontSize": 48,
      "color": "#FFFFFF",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-2-intro.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    },
    {
      "id": "scene-3-dh1",
      "source": "",
      "in_seconds": 6,
      "out_seconds": 12,
      "type": "text_card",
      "text": "DẤU HIỆU 1\n\nCung Phu Thê có\nHỒNG LOAN hoặc THIÊN HỈ\nchiếu vào",
      "fontSize": 52,
      "color": "#FFFFFF",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-3-dh1.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    },
    {
      "id": "scene-4-dh2",
      "source": "",
      "in_seconds": 12,
      "out_seconds": 18,
      "type": "text_card",
      "text": "DẤU HIỆU 2\n\nĐại vận đi qua cung có\nTHAM LANG + ĐÀO HOA\nđồng cung",
      "fontSize": 52,
      "color": "#FFFFFF",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-4-dh2.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    },
    {
      "id": "scene-5-dh3",
      "source": "",
      "in_seconds": 18,
      "out_seconds": 24,
      "type": "text_card",
      "text": "DẤU HIỆU 3\n\nNăm nay THIÊN KHÔI\nhoặc THIÊN VIỆT\nchiếu mệnh",
      "fontSize": 52,
      "color": "#FFFFFF",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-5-dh3.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    },
    {
      "id": "scene-6-cta",
      "source": "",
      "in_seconds": 24,
      "out_seconds": 30,
      "type": "text_card",
      "text": "Follow để xem thêm\nBÍ MẬT TỬ VI mỗi ngày 🔮",
      "fontSize": 52,
      "color": "#FFD700",
      "backgroundColor": "transparent",
      "backgroundImage": "tu-vi-tinh-duyen/scene-6-cta.jpg",
      "backgroundOverlay": 0.65,
      "transition_in": "fade",
      "transition_out": "fade"
    }
  ],
  "overlays": [],
  "captions": [],
  "audio": {
    "music": {
      "src": "tu-vi-tinh-duyen/ambient.mp3",
      "volume": 0.35,
      "fadeInSeconds": 1,
      "fadeOutSeconds": 2,
      "loop": true
    }
  }
}
```

Save this to `remotion-composer/public/tu-vi-tinh-duyen/props.json`.

- [ ] **Step 2: Validate JSON is parseable**

```bash
cd E:/tvk/OpenMontage
python -c "import json; json.load(open('remotion-composer/public/tu-vi-tinh-duyen/props.json')); print('Valid JSON')"
```

Expected: `Valid JSON`

---

### Task 5: Still Frame Test

**Files:** None (read-only verification)

- [ ] **Step 1: Render a still frame from the hook scene (frame 45 = 1.5s)**

```bash
cd E:/tvk/OpenMontage/remotion-composer
npx remotion still src/index.tsx TikTok \
  --props=public/tu-vi-tinh-duyen/props.json \
  --frame=45 \
  --output=out/tu-vi-tinh-duyen-test-hook.png
```

Expected: PNG file at `out/tu-vi-tinh-duyen-test-hook.png`. Open and verify:
- Gold text "3 DẤU HIỆU TỬ VI..." visible
- Cosmic background image behind dark overlay
- Text centered and readable

- [ ] **Step 2: Render a still frame from scene 3 (frame 270 = 9s)**

```bash
cd E:/tvk/OpenMontage/remotion-composer
npx remotion still src/index.tsx TikTok \
  --props=public/tu-vi-tinh-duyen/props.json \
  --frame=270 \
  --output=out/tu-vi-tinh-duyen-test-dh1.png
```

Expected: White text "DẤU HIỆU 1" with pink nebula background.

- [ ] **Step 3: Review still frames and adjust if needed**

Open both PNGs. Check:
- Text not clipped at edges
- Background overlay dark enough for readability
- Font size appropriate for mobile (9:16)
- Colors match spec (#FFD700 gold for hook/CTA, #FFFFFF for content)

If adjustments needed, edit `props.json` and re-render stills.

---

### Task 6: Full Render

**Files:**
- Output: `remotion-composer/out/tu-vi-tinh-duyen.mp4`

- [ ] **Step 1: Render the full video**

```bash
cd E:/tvk/OpenMontage/remotion-composer
npx remotion render src/index.tsx TikTok \
  --props=public/tu-vi-tinh-duyen/props.json \
  --output=out/tu-vi-tinh-duyen.mp4 \
  --codec=h264
```

Expected: MP4 file rendered. Duration ~30s, 1080x1920, H264.

- [ ] **Step 2: Verify output**

```bash
ffprobe -v quiet -print_format json -show_format -show_streams \
  E:/tvk/OpenMontage/remotion-composer/out/tu-vi-tinh-duyen.mp4 \
  2>/dev/null | python -c "
import sys, json
data = json.load(sys.stdin)
fmt = data['format']
vid = [s for s in data['streams'] if s['codec_type'] == 'video'][0]
print(f'Duration: {float(fmt[\"duration\"]):.1f}s')
print(f'Resolution: {vid[\"width\"]}x{vid[\"height\"]}')
print(f'FPS: {vid[\"r_frame_rate\"]}')
print(f'Codec: {vid[\"codec_name\"]}')
print(f'Size: {int(fmt[\"size\"]) / 1024 / 1024:.1f}MB')
"
```

Expected:
- Duration: ~30s
- Resolution: 1080x1920
- FPS: 30/1
- Codec: h264

- [ ] **Step 3: Copy final render to project directory**

```bash
mkdir -p E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/renders
cp E:/tvk/OpenMontage/remotion-composer/out/tu-vi-tinh-duyen.mp4 \
   E:/tvk/OpenMontage/projects/tu-vi-tinh-duyen/renders/final.mp4
```

- [ ] **Step 4: Commit project assets config (not generated files)**

```bash
cd E:/tvk/OpenMontage
git add remotion-composer/public/tu-vi-tinh-duyen/props.json
git commit -m "feat: add tu-vi-tinh-duyen TikTok video props"
```
