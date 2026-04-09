---
name: video-production
description: Quy trình sản xuất video từ A-Z — brainstorming, kịch bản, design spec, implementation plan, generate assets, render. Áp dụng cho mọi loại video, mọi platform, mọi chủ đề.
metadata:
  openclaw:
    emoji: "🎬"
    skillKey: "video-production"
    os: ["darwin", "linux", "win32"]
    requires:
      bins: ["node", "npx"]
---

# Video Production — Quy Trình Tổng Quát

Skill này mô tả flow sản xuất video hoàn chỉnh trong OpenMontage. Áp dụng cho mọi loại video (explainer, TikTok, education, marketing, triết lý...), mọi platform (YouTube, TikTok, Instagram, LinkedIn...), mọi chủ đề.

**Nguyên tắc cốt lõi:** KHÔNG BAO GIỜ skip bước duyệt kịch bản. Luôn hỏi user approve trước khi generate assets.

## Flow Tổng Quan

```
Phase 1: Brainstorming (hỏi → hiểu → đề xuất)
    ↓
Phase 2: Design Spec (kịch bản + visual + audio → tài liệu)
    ↓
Phase 3: Implementation Plan (các bước kỹ thuật cụ thể)
    ↓
Phase 4: Production (generate assets → build props → render)
    ↓
Phase 5: Review & Deliver
```

---

## Phase 1: Brainstorming

**Skill:** `superpowers:brainstorming`

Hỏi user từng câu một, KHÔNG hỏi nhiều câu cùng lúc. Ưu tiên multiple choice.

### Câu hỏi bắt buộc (theo thứ tự):

1. **Chủ đề / Mục đích video là gì?**
   - Explainer sản phẩm, education, triết lý, tutorial, marketing...

2. **Audience — ai xem video này?**
   - Developer, business owner, gen Z, học sinh...

3. **Platform & format?**
   - YouTube 16:9, TikTok 9:16, Instagram Reels 9:16, LinkedIn 16:9...

4. **Thời lượng?**
   - 15s, 30s, 45-60s, 90s, 2-3 phút...

5. **Phong cách visual?**
   - Clean professional, nền đen tối giản, motion graphics, cinematic, anime...

6. **Giọng đọc?**
   - Ngôn ngữ (Việt/Anh), nam/nữ, tone (trầm/nhẹ nhàng/energetic)

7. **Nhạc nền?**
   - Corporate, ambient, piano, upbeat, drone, im lặng...

8. **Kịch bản — ai viết?**
   - Agent viết draft → user duyệt
   - User paste sẵn
   - Cùng viết từng đoạn

### Đề xuất approach

Sau khi hiểu yêu cầu, đề xuất **2-3 cách tiếp cận** khác nhau với trade-offs. Lead với recommendation.

Ví dụ:
- A) Pure typewriter trên nền đen — tối giản
- B) Typewriter + film grain — vintage hơn
- C) Typewriter + background ảnh — visual phong phú hơn

User chọn → chuyển sang Phase 2.

---

## Phase 2: Design Spec

**Output:** File `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

Trình bày từng section, hỏi user approve sau mỗi section:

### Section 1: Visual & Typography
- Palette (màu nền, chữ, accent)
- Font family & size
- Animation/effect (typewriter, spring, fade, ken burns...)
- Transition giữa các scene

### Section 2: Audio
- TTS provider & model (check available tools trước)
- Tốc độ nói, ngôn ngữ
- Nhạc nền (source, volume, fade)
- SFX (có/không)

### Section 3: Script & Scene Breakdown
- Toàn bộ kịch bản
- Mỗi câu/đoạn = 1 scene
- Estimated timing cho từng scene
- Tổng thời lượng

### Section 4: Technical
- Remotion Composition (Explainer, TikTok, CinematicRenderer...)
- Resolution & FPS
- Component nào cần tạo mới (nếu có)
- Asset pipeline (TTS tool, image tool, music tool)
- Output path

### Section 5: Budget & Success Criteria
- Cost estimate per asset type
- Checklist kiểm tra khi hoàn thành

**Sau khi user approve tất cả section → viết spec file → user review spec file.**

---

## Phase 3: Implementation Plan

**Skill:** `superpowers:writing-plans`

**Output:** File `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`

Các bước cụ thể, có code/command, theo TDD nếu cần tạo component mới.

### Bước điển hình:

1. **Setup** — tạo thư mục assets, check tools
2. **Component mới** (nếu cần) — tạo, đăng ký trong Explainer.tsx, test still frame
3. **Download TTS model** (nếu dùng Piper local)
4. **Generate TTS** — từng scene riêng, đo duration
5. **Concat audio** — ghép narration với timing gaps, pad đúng tổng duration
6. **Download/generate assets** — ảnh, video, nhạc
7. **Copy assets** → `remotion-composer/public/<project>/`
8. **Build props.json** — cuts, overlays, captions, audio config
9. **Still frame test** — render 2-3 frame kiểm tra visual
10. **Full render** — `npx remotion render`
11. **Verify** — check duration, audio sync, visual quality

---

## Phase 4: Production

### 4.1 Preflight — Check Available Tools

```bash
cd E:/tvk/OpenMontage
python -c "
from tools.tool_registry import registry
registry.discover('tools')
menu = registry.provider_menu()
for cap, info in menu.items():
    if info['configured'] > 0:
        avail = [t['name'] for t in info['available']]
        print(f'{cap}: {avail}')
"
```

**QUAN TRỌNG:** Phải clean-parse `.env` — nhiều key có inline comment `# ...` sẽ bị lẫn vào value. Luôn strip comment trước khi dùng:
```python
if '#' in val:
    val = val[:val.index('#')].strip()
```

### 4.2 TTS Providers (ưu tiên)

| Provider | Ngôn ngữ | Chất lượng | Cost | Ghi chú |
|----------|----------|-----------|------|---------|
| Piper (local) | EN, VI, 20+ ngôn ngữ | Medium | Free | Cần download model trước |
| Google TTS | 50+ ngôn ngữ | High | Free tier 1M chars/tháng | Cần enable API |
| ElevenLabs | EN chủ yếu | Very High | Free tier 10k chars/tháng | Voice cloning |
| OpenAI TTS | Multilingual | High | ~$0.015/1K chars | 6 voices |

**Piper Vietnamese models:**
- `vi_VN-vais1000-medium` — nam, chất lượng tốt nhất
- `vi_VN-25hours_single-low` — low quality
- `vi_VN-vivos-x_low` — extra low quality

Download model:
```python
from urllib.request import urlretrieve
base = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/vi/vi_VN/vais1000/medium'
urlretrieve(f'{base}/vi_VN-vais1000-medium.onnx', '~/.piper/models/vi_VN-vais1000-medium.onnx')
urlretrieve(f'{base}/vi_VN-vais1000-medium.onnx.json', '~/.piper/models/vi_VN-vais1000-medium.onnx.json')
```

Generate:
```bash
piper --model ~/.piper/models/vi_VN-vais1000-medium.onnx --output_file scene.wav --sentence-silence 0.5 <<< "Nội dung tiếng Việt"
```

### 4.3 Music Sources

| Source | Cost | Ghi chú |
|--------|------|---------|
| Pixabay Music | Free | Scrape web, không cần API key |
| ElevenLabs Music | Paid | AI gen, cần API key |
| Suno | Paid | Full songs, cần API key |

### 4.4 Image/Video Sources

| Source | Cost | Ghi chú |
|--------|------|---------|
| Pexels | Free | Stock ảnh/video, cần PEXELS_API_KEY |
| Pixabay | Free | Stock ảnh/video, không cần key |
| FLUX | ~$0.01/ảnh | AI gen qua FAL_KEY |
| Google Imagen | Paid | Cần GOOGLE_API_KEY |

### 4.5 Audio Assembly

Concat nhiều WAV thành 1 narration track:
```python
import wave

# Đọc từng file → concat với gaps
# Gap giữa scenes: 1-2s tuỳ nhịp
# Pad cuối: đủ tổng duration video
# Output: narration.wav
```

### 4.6 Remotion Compositions

| Composition | Resolution | Dùng cho |
|-------------|-----------|----------|
| `Explainer` | 1920x1080 (16:9) | YouTube, LinkedIn, explainer |
| `TikTok` | 1080x1920 (9:16) | TikTok, Instagram Reels, YouTube Shorts |
| `CinematicRenderer` | 1920x1080 | Trailers, cinematic |
| `TalkingHead` | 1080x1920 | Talking head vertical |

### 4.7 Props JSON Structure

```json
{
  "cuts": [
    {
      "id": "scene-1",
      "type": "text_card | callout | hero_title | comparison | stat_card | kpi_grid | bar_chart | line_chart | pie_chart | progress_bar | typewriter | anime_scene",
      "source": "",
      "in_seconds": 0,
      "out_seconds": 8,
      "text": "Nội dung",
      "fontSize": 42,
      "color": "#FFFFFF",
      "backgroundColor": "#000000",
      "backgroundImage": "path/to/image.jpg",
      "backgroundOverlay": 0.7,
      "transition_in": "fade",
      "transition_out": "fade"
    }
  ],
  "overlays": [],
  "captions": [],
  "audio": {
    "narration": { "src": "path/narration.wav", "volume": 1 },
    "music": {
      "src": "path/music.mp3",
      "volume": 0.08,
      "fadeInSeconds": 2,
      "fadeOutSeconds": 3,
      "loop": true
    }
  }
}
```

### 4.8 Render

```bash
cd E:/tvk/OpenMontage/remotion-composer

# Still frame test
npx remotion still src/index.tsx <Composition> --props=public/<project>/props.json --frame=100 --output=/tmp/test.png

# Full render
npx remotion render src/index.tsx <Composition> --props=public/<project>/props.json --output=out/<filename>.mp4 --codec=h264
```

---

## Phase 5: Review & Deliver

1. **Check duration** — đúng target ±2s
2. **Check audio** — giọng đọc rõ, nhạc không lấn
3. **Check visual** — text không bị cắt, transition mượt
4. **Check sync** — text/visual xuất hiện đúng lúc với giọng đọc
5. **Output file** — `remotion-composer/out/<filename>.mp4`

---

## Checklist Nhanh

Trước khi bắt đầu bất kỳ video nào:

- [ ] Hỏi chủ đề, audience, platform, thời lượng, visual style, giọng đọc, nhạc
- [ ] Hỏi từng câu một, KHÔNG gộp
- [ ] Đề xuất 2-3 approach, user chọn
- [ ] Viết kịch bản → user duyệt
- [ ] Trình bày design từng section → user approve
- [ ] Viết spec file → user review
- [ ] Viết implementation plan
- [ ] Preflight check tools
- [ ] Generate assets (TTS, music, images)
- [ ] Build props → still frame test → full render
- [ ] Verify output

**KHÔNG BAO GIỜ:** Skip kịch bản, tự ý render mà chưa duyệt, gộp nhiều câu hỏi.
