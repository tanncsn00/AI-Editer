# Skill: Reup Comedy Dub (VN voice-over for short clips)

Re-purpose short viral clips (Douyin/Xiaohongshu/Kuaishou/TikTok/FB) with a Vietnamese voice-over + karaoke captions. Proven viral format for VN audience — content is already proven elsewhere, just translated / re-narrated.

**⚠️ Legal note:** User is responsible for copyright compliance (permission, fair use, attribution). This pipeline is for personal/educational use. Do not post commercially without rights clearance.

## Aesthetic Lock

- **Format:** Original clip (muted) + VN narration overlay + big karaoke caption
- **Caption:** Be Vietnam Pro 800 weight, bottom 260px padding, yellow highlight `#F4B860` on active word, 3px black stroke
- **Voice:** EverAI minhtriet (deep deadpan) for commentary style, or thuytrang (warm) for storytelling
- **Speed rate:** Match TTS duration to clip duration (usually 1.2-1.5x for commentary)
- **No effects:** Keep original footage untouched — the joke is in the voice, not visuals

## Pipeline (reusable)

```
1. DOWNLOAD       yt-dlp from Douyin/TikTok/FB/Kuaishou/Xiaohongshu
2. TRANSCRIBE     whisper original audio (Chinese or source lang) → transcript_src.json
3. WRITE/TRANSLATE  Write VN narration (either translate dialogue OR write fresh commentary)
4. TTS            EverAI minhtriet/thuytrang → voice.mp3
5. ALIGN          whisper VN voice + script as ground truth → words.json
6. COMPOSE        Remotion: <OffthreadVideo muted> + <Audio voice> + karaoke <Caption>
7. RENDER         H.264 MP4
```

## 2 narrative modes

### Mode A — Faithful translation
Translate the source dialogue line-by-line to VN. Best for: storytelling clips, educational content, farmer/craftsman vlogs, food content.

- Duration must match source — chunk translate per sentence to keep timing
- Keep voice neutral matching source tone
- Example: `projects/xhs-01/` (Xiaohongshu farmer)

### Mode B — Commentary dub
Ignore source dialogue entirely, write fresh VN commentary reacting to the visuals. Best for: silent action clips, cosplay, parkour, fails, music videos.

- Deadpan voice over absurd commentary = comedy
- Usually deep voice (minhtriet) for contrast
- Example: `projects/reup-comedy-demo-01/` (cosplay action + commentary)

## Workflow steps in detail

### 1. Download source
```bash
cd projects/<episode-slug>/
mkdir source && cd source
python -m yt_dlp "<URL>" -o "original.%(ext)s"
```

- Douyin: need cookies sometimes, or use `douyin.wtf` / `snaptik` fallbacks
- TikTok reposts of Douyin often work without auth
- Facebook reels: work out-of-box
- Xiaohongshu: may need custom scraper (see `projects/xhs-01/`)
- If codec is AV1 and ffmpeg can't extract frames: re-encode to h264:
  ```bash
  ffmpeg -i original.mp4 -c:v libx264 -crf 20 -c:a copy original_h264.mp4
  ```

### 2. Transcribe source
```python
# run_transcribe_src.py
from faster_whisper import WhisperModel
m = WhisperModel('medium', device='cpu', compute_type='int8')
segs, info = m.transcribe('source/original.mp4', language='zh', beam_size=5, vad_filter=True)
# Dump to transcript_src.json
```

- Set `language` correctly: `zh` Chinese, `ko` Korean, `ja` Japanese, `en` English
- Check if source is actually silent or has only music — if so, skip to Mode B (commentary)

### 3. Write VN script
- **Mode A:** open `transcript_src.json`, translate each line to VN matching timing budget
- **Mode B:** ignore source, write 3-5 commentary lines that match the visuals
- Save to `script_vn.txt` with paragraph breaks per sentence group

**Target duration:** voice should be ≤ source video duration. Narration budget = 95% of clip length (leave fade in/out).

### 4. TTS via EverAI
```python
# run_tts.py (template in skill dir)
voice = "vi_male_minhtriet_mb"  # or vi_female_thuytrang_mb
model = "everai-v1.6"  # minhtriet requires v1.6
speed = 1.0  # iterate until duration fits
```

- Known issue: `vi_female_huyenanh_mb` does not work with any model → fall back to `thuytrang`
- Iterate speed_rate: if voice too long, bump speed up 0.1 and re-render

### 5. Whisper align VN voice
```python
# run_align.py
# whisper VN voice → word timings
# difflib.SequenceMatcher maps script (ground truth) to whisper timings
# Fix VN mis-transcriptions via script-as-truth alignment
```

**Critical:** DO NOT pass `initial_prompt=script_text` to whisper — causes phantom word merging (learned from TuDuyMo project, only got 32/104 words first try).

### 6. Remotion composition
Copy assets:
```bash
mkdir -p remotion-composer/public/<slug>/
cp source/original.mp4 remotion-composer/public/<slug>/video.mp4
cp voice.mp3 remotion-composer/public/<slug>/voice.mp3
cp words.json remotion-composer/src/<slug>_words.json
```

Component structure:
```tsx
<AbsoluteFill backgroundColor="#000">
  <OffthreadVideo src={staticFile("<slug>/video.mp4")} muted />
  <div className="dim-overlay" /> {/* bottom gradient */}
  <Caption words={words} />        {/* karaoke bottom center */}
  <Audio src={staticFile("<slug>/voice.mp3")} volume={1.0} />
</AbsoluteFill>
```

Reference: `remotion-composer/src/ReupDemo.tsx` or `XhsFarmer.tsx`

### 7. Register composition in Root.tsx
```tsx
<Composition
  id="<EpisodeName>"
  component={<EpisodeName>}
  durationInFrames={Math.ceil(<dur> * 30)}
  fps={30}
  width={1080}
  height={1920}
/>
```

### 8. Render
```bash
cd remotion-composer
npx remotion render <EpisodeName> ../projects/<slug>/final.mp4 --codec=h264
```

## Known issues + fixes

| Issue | Fix |
|---|---|
| ffmpeg can't extract frames from AV1 | Re-encode with `libx264` first |
| Whisper returns few words with `initial_prompt` | Remove initial_prompt, use script-as-ground-truth alignment instead |
| `vi_female_huyenanh_mb` returns 406 | Fallback to `vi_female_thuytrang_mb` |
| Minhtriet voice returns 406 on old models | Use `model_id: everai-v1.6` |
| TTS voice longer than clip | Bump `speed_rate` to 1.2-1.5 |
| Douyin needs cookies | Use TikTok reposts or alternative scrapers |
| Landscape source on portrait composition | `OffthreadVideo objectFit: cover` — fills viewport, crops sides |

## File layout

```
projects/<episode-slug>/
  source/
    original.mp4         # yt-dlp output
    transcript_src.json  # whisper original audio
    prev_<n>.jpg         # preview frames
  script_vn.txt          # VN narration script
  voice.mp3              # EverAI TTS output
  words.json             # whisper-aligned word timings
  run_tts.py             # TTS script (template in skill)
  run_align.py           # Align script (template in skill)
  final.mp4              # rendered output

remotion-composer/
  src/<Episode>.tsx      # composition
  src/<slug>_words.json  # word timings for import
  public/<slug>/
    video.mp4
    voice.mp3
```

## Reference episodes

- **Mode A (faithful):** `projects/xhs-01/` — Xiaohongshu Chinese farmer showing red sticky rice, VN voice translation, used `XhsFarmer.tsx` composition
- **Mode B (commentary):** `projects/reup-comedy-demo-01/` — TikTok cosplay action, VN deadpan commentary, used `ReupDemo.tsx` composition

## Anti-patterns

- ❌ Reproduce source dialogue verbatim if translating — causes timing overflow, tone off
- ❌ Use `initial_prompt` in whisper align
- ❌ Skip script-as-ground-truth fix (Vietnamese mis-transcription is common)
- ❌ Post without attribution to original creator (even if legally OK)
- ❌ Reuse same clip on multiple platforms without variation — looks lazy
- ❌ Long narration that doesn't match visuals — audience notices sync gap
- ❌ Use plain SVG `<text>` for captions (doesn't wrap) — use HTML div
- ❌ Match caption style to Tịnh Đạo (Cormorant/EB Garamond serif) — this format uses Be Vietnam Pro 800 bold
