---
name: tinh-dao-video
description: Quy trình làm video triết lý / nhân sinh quan kiểu "Tịnh Đạo" trên TikTok/Reels 9:16 — tone chiêm nghiệm, winter cinematic, big-word drops, Vietnamese narration trầm chậm. Dùng khi user muốn làm content triết lý, chiêm nghiệm, phản tư về cuộc sống, công việc, tự do, xã hội — không dùng cho video giải trí/education thuần số liệu.
metadata:
  openclaw:
    emoji: "🌲"
    skillKey: "tinh-dao-video"
---

# Tịnh Đạo Style Video — Philosophical Reflection on TikTok/Reels

Skill này là một **preset workflow** cho phong cách video triết lý/chiêm nghiệm Vietnamese. Nó kế thừa pipeline chuẩn từ `video-production` skill nhưng đã lock sẵn các lựa chọn kỹ thuật cho style cụ thể này.

Dùng khi user nói những cụm kiểu:
- "nhân sinh quan", "triết lý", "chiêm nghiệm", "phản tư"
- "bẫy làm thuê", "cái bẫy của...", "sự thật về..."
- "Tịnh Đạo", "Tĩnh Tâm", "chậm lại"
- Hoặc reference image là cảnh tối + 1 chữ Vietnamese ở giữa

**KHÔNG dùng** cho: video hài, giáo dục số liệu, review sản phẩm, tutorial code.

---

## Aesthetic Lock — Đặc trưng nhận dạng

| Element | Setting |
|---------|---------|
| Aspect ratio | 9:16 (1080×1920) |
| FPS | 30 |
| Duration | 90-150s (TikTok long-form short) |
| Background footage | Winter/night/forest/misty — Pexels portrait search |
| Footage filter | `brightness(0.4) saturate(0.65) contrast(1.08)` |
| Ken Burns | Slow scale 1.02→1.14 per cut |
| Vignette | Radial 22% → 82% + bottom gradient for caption |
| Big-word font | **EB Garamond** (NOT Cormorant — doesn't support VN diacritics) |
| Caption font | **Be Vietnam Pro** weight 600/800 |
| Emphasis color | `#F4B860` warm yellow |
| Body color | `#F5F5F0` ivory |
| Music | Cinematic melancholy / ambient piano, **lowpass 3500Hz + bass +4dB** for trầm feel, volume ~0.09 |
| Voice | **EverAI `vi_male_minhtriet_mb` 0.9x** speed, model `everai-v1.6`, volume ~0.75-0.80 |
| Narration tone | Slow, contemplative, no sales pitch, no "khởi nghiệp"/"tiền" |

---

## Required assets library

Mỗi video cần fetch sẵn các nhóm footage sau từ Pexels (portrait):

- **Winter nature:** `winter snow footsteps forest`, `snowy path trees night`, `dark winter forest snow`
- **Morning routine:** `alarm clock bedroom morning`, `waking up window morning light`, `person closing apartment door`
- **Crowd/commute:** `crowd commute subway morning`, `crowd walking street busy`, `city traffic timelapse dawn`
- **Mirror/introspection:** `tired face subway window reflection`, `sheep eye closeup`, `walking crowd behind`
- **Warm trap:** `warm cabin window snow`, `empty office lights night`, `office worker typing desk`
- **Time/weight:** `clock ticking close up`, `calendar pages flipping`, `tired man office desk evening`
- **Turn/reveal:** `door opening bright light`, `forest path two directions`
- **Landing/lone walker:** `lone person walking snow forest`, `single footprints snow path`

---

## 🔥 Lessons Learned — QUAN TRỌNG không quên

### 1. Whisper ASR sai tiếng Việt
`faster-whisper small` có lỗi transcription tiếng Việt phổ biến:
- `cừu` → `cựu` / `cứu`
- `giàu` → `dầu`
- `ba mươi` → `ba` hoặc `30`
- `sáu` → `6`
- `không con` → `không có`

**GIẢI PHÁP BẮT BUỘC:** KHÔNG dùng whisper text làm caption trực tiếp. Phải **align script (ground truth) với whisper timing**:

```python
# Cách đúng: dùng script làm text, whisper chỉ cung cấp timing
script_words = script.split()
whisper_words = faster_whisper_output  # chỉ lấy start/end
# Align bằng sequence matcher (sửa tay nếu count không khớp)
aligned = [{'word': script_words[i], 'start': whisper_words[i]['start'], 'end': whisper_words[i]['end']}]
```

Hoặc dùng `initial_prompt=script` khi gọi faster-whisper để giảm sai sót.

**Quy tắc:** Luôn print full whisper transcript ra **TRƯỚC** khi render, so sánh với script, fix inline.

### 2. EverAI TTS là ASYNC
- `POST /api/v1/tts` trả về `request_id` + `status: "new"`, KHÔNG có `audio_link` ngay
- PHẢI poll `GET /api/v1/tts/{request_id}` (không phải `/callback-result`) tới khi `status == "done"` và có `audio_link`
- `vi_male_minhtriet_mb` chỉ hoạt động với `model_id: everai-v1.6` hoặc `everai-v1.5` (KHÔNG phải `everai-v1`)
- Default voices (`vi_male_echo_default`) chỉ hoạt động với `everai-v1`
- Adapter chuẩn: `tools/audio/everai_tts.py` với `_poll_result()` đã implement đúng

### 3. Font Vietnamese
- **Cormorant Garamond KHÔNG có đầy đủ glyph tiếng Việt** — dấu huyền/sắc trên Ầ/Ấ/Ế bị tách thành ký tự riêng
- **DÙNG `EB Garamond`** qua `@remotion/google-fonts/EBGaramond` với `subsets: ["vietnamese", "latin", "latin-ext"]`
- Sans: `Be Vietnam Pro` qua `@remotion/google-fonts/BeVietnamPro`

### 4. Big word overlay trung tâm (không ở dưới)
User đã feedback: caption text phải ở **giữa màn hình**, không ở đáy. `justifyContent: "center"`, không phải `"flex-end"`.

### 5. Big word drops — ít hơn là hơn
User đã feedback: **chỉ 1 big word drop ở cuối video** (TỰ DO / KẾT / chốt). KHÔNG rải 5-6 drops giữa video — gây loãng. Big word giữa video chỉ dùng khi là hook opening (BẦY trong 5-7s đầu).

### 6. Music phải xử lý trầm
Pixabay track gốc thường bright quá. Luôn chạy qua ffmpeg:
```bash
ffmpeg -i input.mp3 -af "lowpass=f=3500,bass=g=4:f=100,volume=0.9" deep.mp3
```
Volume trong Remotion: `0.08–0.12` (nhỏ, chỉ là bed).

### 7. Text lead voice -0.1 đến -0.15s
Spring animation có rise time ~4 frames. Shift word start time earlier (`LEAD_OFFSET = 0.12`) để chữ xuất hiện đúng lúc speak thay vì trễ.

### 8. Script duration compress
Script ~320 từ với minhtriet 0.9x ra ~103s thôi, không phải 150s. Đừng estimate quá lạc quan.

### 9. Background continuity — CRITICAL
Tất cả clip footage trong **1 video** phải **cùng 1 environment lớn** (lone walker snow / night city man / dark room introspection / mountain dawn destiny...). KHÔNG được mix loạn: snow → office → kitchen → beach.

**Process:**
1. Trước khi fetch Pexels, quyết định **core environment** cho video
2. Tất cả query bám environment đó — khác angle/moment, KHÔNG khác context
3. Ví dụ: "dan_ong" dùng core = "đàn ông đêm một mình" → tất cả clips là car night / office night / rooftop night / dark room. KHÔNG mix sang morning alarm / kitchen / beach.
4. Mỗi beat có thể đổi angle nhưng phải giữ environment consistency

**Reason:** User feedback session 2026-04-10: mix loạn gây cảm giác rời rạc, compilation random clips thay vì 1 câu chuyện. Video trước "Bầy Cừu" mix snow → morning bedroom → crowd subway → office → clock → forest → footprints = 6 environments khác nhau = loãng.

**Rule of thumb:** 5 clip bất kỳ lấy ra xem riêng → phải có cảm giác cùng 1 thế giới.

### 10. KHÔNG show "Tập X" label
KHÔNG BAO GIỜ hiển thị `TẬP 1`, `TẬP 2`, `tập 3 · ...` trong thumbnail hay big-word outro. User feedback 2026-04-10: *"bỏ cái Tập đi cmm"* — label số tập làm loãng design + trông như compilation.

- Thumbnail: bỏ `<div>TẬP X</div>` top label. Giữ divider + hook question.
- BigWordLayer: bỏ `tập X · subtitle`. Giữ big word + optional 1-line tagline không chứa số tập.
- Series tracking chỉ trong file name / metadata, không show trên màn hình.

### 11. Social video source download (inspiration)
Khi user gửi link FB reel / TikTok / YouTube làm reference, dùng `yt-dlp` (pip library đã cài, KHÔNG có wrapper trong `tools/`):

```bash
cd E:/tvk/OpenMontage
python -m yt_dlp "<URL>" -o "projects/<slug>_source/source.%(ext)s"
```

- **TikTok:** auto no-watermark (extract `playAddr`)
- **FB reels:** work out-of-box với URL `facebook.com/reel/<id>`
- **YouTube/IG/X:** tất cả OK
- Không cần API key
- Auto handle JS challenge (TikTok)

Sau download → `faster-whisper` transcribe → tóm tắt thesis chính + extract quote đắt. **LUÔN viết lại script riêng, không reproduce nguyên văn.** Dùng source làm bệ phóng cảm hứng, không làm template copy.

---

## Workflow chuẩn (8 bước)

### Bước 1 — Hỏi brainstorm (từng câu 1)
Bắt buộc hỏi tuần tự, KHÔNG gộp câu:
1. **POV** — 6 option (người từng sập bẫy / phân tích / phản biện / kể chuyện / thầy dạy / combo)
2. **Platform & format** — TikTok 45-60s / TikTok 2-3 phút / YouTube 5-8 phút...
3. **Thesis cốt lõi** — 5-6 option cụ thể. Nếu contrarian, phải là phản biện sắc thật, không nửa mùa.
4. **Audience** — sinh viên / mới đi làm / mid-career / đã follow... → xác định tone sharpness
5. **Cảm xúc người xem mang ra** — giật mình / buồn man mác / truyền cảm hứng / hiểu lạnh lùng / giận dữ / combo
6. Nếu user show reference image → xác định visual lock từ đó

### Bước 2 — Propose 3 concept
Mỗi concept khác nhau ở **metaphor cốt lõi** (không phải ở tone/length). Lead với recommendation. Concept 1 = tốt nhất, không phải 3.

### Bước 3 — Beat sheet (bảng timing)
Format chuẩn (8 beat):
| # | Time | Beat name | Narration draft | Big word | Visual |

Narrative arc: **HOOK → SETUP (2 beats) → MIRROR → TRAP → WEIGHT → TURN → LANDING**

6 big-word drops: `HOOK_WORD → MÊ → BẪY → MẤT → TỈNH → [FINAL_WORD]`

### Bước 4 — Voice + Music sample (song song)
- **Voice:** Generate 1 sample HOOK với `vi_male_minhtriet_mb 0.9x` — user preview
- **Music:** Download 4-5 Pixabay candidates → ffmpeg process trầm → user pick

User pick voice + music → lock.

### Bước 5 — Full script approval (GATE)
**BẮT BUỘC** show full script + user phải OK trước khi burn TTS credit. Không skip gate này.

### Bước 6 — TTS + forced align + footage fetch (song song)
1. EverAI full narration (1 call, chars ~1400-1700)
2. `faster-whisper small` + `word_timestamps=True` + `initial_prompt=script`
3. **BẮT BUỘC:** print full whisper transcript → eyeball compare với script → fix lỗi trong JSON (cựu→cừu, dầu→giàu, v.v.)
4. Parse beat boundaries bằng unique anchor words
5. Pexels fetch ~18-22 portrait clips (3 per beat)

### Bước 7 — Build Remotion composition

Component pattern (3 layers):
```tsx
// Layer 1: Background cuts với crossfade + Ken Burns
<CutLayer cut={...} />  // brightness(0.4), slow scale, 8-frame crossfade

// Layer 2: Caption (word-by-word, center, active sentence only)
<Caption hide={bigActive} />  // group words by sentence, spring reveal, emphasis yellow

// Layer 3: Big word drops (only 1-2 total for most videos)
<BigWordLayer bw={...} />  // EB Garamond, spring scale 1.7→1.0, blur 14→0
```

Registered trong `Root.tsx` với duration = `total_audio_seconds + 4` (buffer cho outro).

### Bước 8 — Render + Thumbnail + Metadata
- Render: `npx remotion render src/index.tsx <Id> out/<name>.mp4 --codec=h264`
- Thumbnail: `npx remotion still` với composition riêng, duration 1 frame
- Metadata: title (3-4 option), description, hashtags VN (~10-12), thumbnail concept

---

## File layout chuẩn mỗi project

```
projects/<slug>/
  script.txt                    # Full narration
  narration_full.mp3            # EverAI output
  word_timings.json             # Whisper alignment (FIXED)
  beats.json                    # Beat boundaries
  footage/                      # Pexels clips per beat
  samples/
    voice/                      # Voice samples (HOOK test)
    music/                      # Music candidates + deep version

remotion-composer/
  public/
    <slug>_full_voice.mp3       # Copied narration
    <slug>_music.mp3            # Copied deep music
    <slug>/*.mp4                # Copied footage
  src/
    <Slug>Full.tsx              # Main composition
    <Slug>Thumbnail.tsx         # Thumbnail still
    <slug>_words.json           # Imported word timings
    <slug>_beats.json           # Imported beats
  out/
    <slug>_full_v<N>.mp4        # Render output
    <slug>_thumbnail.png
```

---

## Hashtag set chuẩn (TikTok Vietnam philosophical)

**Core:** `#nhansinhquan` `#triethoc` `#tinhdao` `#tudo`
**Audience:** `#congso` `#dilam` `#lamthue` `#nhanvienvanphong` `#sunghiep`
**Mood:** `#suytrongdem` `#doisong` `#nhinlaicuocdoi` `#thucgiac` `#tamly`

Chọn 10-12 cho mỗi video, trộn core + audience + mood.

---

## Anti-patterns (KHÔNG làm)

- ❌ Gộp nhiều câu hỏi brainstorm
- ❌ Skip script approval gate
- ❌ Dùng whisper text trực tiếp làm caption
- ❌ Cormorant Garamond cho text Vietnamese
- ❌ Hơn 2 big-word drops trong 1 video
- ❌ Caption ở bottom padding (luôn center)
- ❌ Music volume > 0.15
- ❌ Voice volume > 0.85
- ❌ Nhắc "khởi nghiệp" / "tiền" / "làm chủ" trong narration
- ❌ Tone sắc/chửi hệ thống (phải thương cảm)
- ❌ Render full trước khi user duyệt HOOK proof-of-concept

---

## Reference project

Xem `projects/bay_cuu/` làm ví dụ hoàn chỉnh:
- Script: `projects/bay_cuu/script.txt`
- Composition: `remotion-composer/src/BayCuuFull.tsx`
- Thumbnail: `remotion-composer/src/BayCuuThumbnail.tsx`
- Output: `remotion-composer/out/bay_cuu_full_v2.mp4`
