---
name: blueprint-tech-video
description: "Dựng video kỹ thuật/tech-explainer/truyền kỳ-tech kiểu Architectural Blueprint — nền navy + lưới kỹ thuật + amber, fully animated voice-synced reveals, 8 figure (fig.X), bracket-corner TechBox. Dùng cho content engineering depth, AI/tech news, explainer dev. 9:16 TikTok/Reels."
---

# Architectural Blueprint · video kỹ thuật animated

Skill dựng video **vibe bản vẽ kỹ thuật** (engineering blueprint): nền navy thẫm, lưới đo đạc, scanline chạy, text amber mono, mọi element **xuất hiện đồng bộ theo lời thoại**. Cảm giác "đang đọc một bản thiết kế kỹ thuật sống động" → stop-scroll cao, save-worthy cho dev/tech audience.

**Golden references:**
- `remotion-composer/src/ClaudeOpus48Blueprint.tsx` — truyền kỳ tech-release (Claude Opus 4.8), 8 fig animated
- `remotion-composer/src/CodingTangThapNhat.tsx` — explainer (coding tầng thấp nhất SE), nguồn gốc style
- `remotion-composer/src/EngineerSongSotAi.tsx` — listicle engineer types (thêm green/purple/orange accent)

---

## 🎯 Khi nào dùng

- Video **engineering / software / system design** depth (vì sao X, trade-off, kiến trúc)
- **Tech/AI news + explainer** cần cảm giác "report kỹ thuật" (model release, breakthrough)
- **Truyền kỳ tech** muốn look kỹ thuật thay vì cổ phong tu tiên (variant của `truyen-ky-tu-tien`)
- Listicle "N loại / N thứ" về dev/tech

**KHÔNG dùng cho:** philosophical/nhân sinh (→ `tinh-dao-video`), tu tiên cổ phong thuần (→ `truyen-ky-tu-tien` purple/gold), comedy, POV đồ vật, reup.

---

## 🎨 VISUAL LOCK (copy verbatim, chỉ đổi content)

### Palette
```
BG_NAVY      #0F1B2E   nền chính
BG_CARD      #15243B   nền box/node
GRID         #FFFFFF   lưới (opacity rất thấp)
TEXT_PRI     #E8F0FF   chữ chính
TEXT_SEC     #A4B5D0   chữ phụ
TEXT_MUTE    #5E7090   chú thích // comment mono
AMBER        #FFC857   accent chính (primary)
AMBER_BRIGHT #FFD980   nhấn mạnh
ACCENT_BLUE  #5BB8FF   secondary / "junior" / data
WARNING_RED  #FF6B6B   nguy hiểm / cost / phản đề
JADE         #5BE8A8   positive / "honesty" / survive (optional)
VIOLET       #B47AFF   variant accent (optional)
```

### Fonts
- **Be Vietnam Pro** (900/800/700) — content tiếng Việt, title lớn
- **JetBrains Mono** (700/500) — label kỹ thuật, `[XX / 08]`, `// comment`, `fig.X`, số liệu

### Component bắt buộc (copy từ golden ref)
1. **BlueprintBG** — double grid (`60px` opacity 0.08 + `240px` opacity 0.12) + radial glow amber + **scanline** chạy dọc (`scanLineY = (frame*4) % (H+200) - 100`) + 4 **corner bracket** ở góc màn.
2. **SectionHeader** `[XX / 08]` + đường kẻ amber + label mono letterspacing 6 (góc trên trái, translate(80,130)).
3. **FigFooter** `fig.X · label` + đường kẻ ngang (đáy, H-110).
4. **BrandMark** `⚡ truyền kỳ · <topic> · 2026` (đáy, H-60).
5. **TechBox** — rect viền + **bracket-corner accent** (4 cặp line nhô ra ở góc). Đây là "chữ ký" visual của style.
6. **KenBurns** — zoom nhẹ 1.0→1.03 suốt mỗi beat.

### Ngôn ngữ visual
- Label kỹ thuật tiếng Anh mono: `// observation`, `▸ REQUIRES`, `▾ ANSWER 3 QUESTIONS`, `[ write code ]`
- Content tiếng Việt Be Vietnam Pro
- Box = TechBox bracket-corner, KHÔNG dùng rounded rect mềm mại
- Mỗi slide là 1 "figure" đánh số fig.1 → fig.8

---

## ⚡ ANIMATION SYSTEM (điểm cốt lõi — voice-synced)

Mỗi slide là **1 component animated** trong 1 `<Sequence>`, KHÔNG phải PNG tĩnh. Element xuất hiện theo **entry frame nội bộ** của beat (Sequence reset `useCurrentFrame()` về 0 ở đầu beat).

### 3 hook animation
```tsx
const useFadeUp  = (entry, dur=14) => fade + translateY(20→0)   // dòng chữ, list item
const useScaleIn = (entry, dur=18) => fade + scale(0.75→1)      // box, node, title lớn
const useFade    = (entry, dur=14) => opacity only              // line, group nền
```

### Cách sync với lời thoại
1. Đọc `beats.json` lấy `duration` mỗi beat → `frames = duration * 30`.
2. Map từng câu/cụm trong narration → vị trí frame trong beat (ước lượng theo char offset hoặc nghe).
3. Đặt `entryFrame` cho element khớp lúc câu đó được đọc. **Comment timeline ngay trong code** (xem golden ref):
```tsx
// 0-90: "câu A" → title
// 150-195: "câu B" → big word
// 270: "thành thật hơn" → trait 1
```
4. Stagger list item cách nhau ~30-60 frame để "gõ" ra lần lượt khớp giọng.

---

## 🚨 BUG CẢNH BÁO (đã dính 2 lần — PHẢI tránh)

**KHÔNG bao giờ** vừa đặt `transform="translate(...)"` (SVG attr) vừa `style={useFadeUp(...)}` (CSS transform) trên CÙNG 1 `<g>`. CSS `transform: translateY()` **đè** SVG `transform` attribute → element nhảy về gốc (0,0) góc trên trái, biến mất khỏi vị trí.

| Tình huống | Cách đúng |
|---|---|
| `<g>` cần **scale-in** | `<g style={{...useScaleIn(), transformOrigin:'Xpx Ypx', transformBox:'fill-box'}}>` + **đặt con bằng toạ độ tuyệt đối** (x={W/2+...}), KHÔNG có transform attr |
| `<g transform="translate()">` cần fade | dùng `opacity={anim.opacity}` (CHỈ opacity), KHÔNG dùng `style={fadeUp}` |
| `<text>`/`<g>` KHÔNG có transform attr | `style={useFadeUp()}` thoải mái (translateY không xung đột) |

→ Render still kiểm tra **cuối mỗi beat** (frame ~`(beat.start+beat.duration)*30 - 15`); nếu element thiếu/ở góc trên → dính bug này.

---

## 📐 8-FIGURE STRUCTURE (template)

| fig | Vai trò | Layout gợi ý |
|---|---|---|
| 1 | HOOK / xuất thế | stamp → big shock line → node "C"/icon → mega title + subtitle box |
| 2 | Contrast / 2 góc nhìn | box A (mute) → VS circle → box B (red/amber) reveal |
| 3 | Concept lớn #1 | big word + 3 trait rows (TechBox) + reveal box + 2-road compare |
| 4 | Capability / 4 ô | 2×2 grid TechBox màu khác nhau + quote box |
| 5 | Diagram | central node → fan-out lines → N children → reveal box |
| 6 | Hidden / danger | codename box → 3 fear rows (red) → reveal "pháp thân" |
| 7 | Listicle / quy luật | 2×2 self-ability + warning law box (red) |
| 8 | ENDING + CTA | strikethrough scarcity → value box (3 rows) → closer line → CTA (comment·save·follow) |

Số fig linh hoạt 6-8 theo số beat. Mỗi fig: SectionHeader trên + FigFooter + BrandMark dưới.

---

## ⚙️ PRODUCTION PIPELINE

1. **Script** → `projects/<slug>/script.json` (8 beat, `text_phonetic` + `text_display`). Nếu user gửi script → VERBATIM (rule `feedback_user_script_verbatim`). Gate user duyệt trước TTS.
2. **TTS — BẮT BUỘC TÁCH TỪNG BEAT** (`tts_everai.py` per-beat, KHÔNG one-shot full script). Adam EverAI `voice-739e9501-c06f-4cbf` **speed 0.95**. Mỗi beat POST `text_phonetic` riêng → `tts/beat_NN.mp3`; concat với **gap 0.3s** → `voice_full.mp3` + ghi `segments.json`. CLI: `tts_everai.py all` (gen hết) · `tts_everai.py 4` (chỉ re-gen beat 4 khi lỗi). ⇒ hết whisper subscribe-hallucination, lỗi beat nào chỉ re-gen beat đó, biên slide chính xác tuyệt đối. Template chuẩn ở `projects/moigioi-dao/{tts_everai,whisper_words,gen_sync}.py` — COPY từ đó. Tech term → phonetic đúng dev VN (rule `feedback_tts_tech_phonetic`); dấu chấm vụn nhiều → smooth bằng phẩy trong `text_phonetic`. Chi tiết: rule `feedback_tts_per_beat_pipeline`.
3. **Whisper + Timing** `whisper_words.py` (whisper TỪNG beat mp3, sạch) → `gen_sync.py`: boundary lấy TỪ `segments.json` (chính xác, không đoán anchor), item = word-timestamp + LEAD 8f (rule `feedback_reveal_sync_voice`). **ISOLATE/nghe từng beat** bắt nuốt-lắp; sau mỗi re-gen beat phải re-check anchor NONE (whisper ghi term khác mỗi lần: Call Margin→margin/maxine, "ba hôm"↔"3 hôm").
4. **Stage** copy `voice_full.mp3` → `public/<slug>/voice.mp3`; `beats.json` → `src/<slug>_beats.json`; `timings.json` → `src/<slug>_timings.json`.
5. **Slides** copy 1 golden ref `.tsx`, đổi content + entry frame + màu. Giữ nguyên BlueprintBG/SectionHeader/FigFooter/TechBox/hook anim.
6. **Register** 2 composition trong `Root.tsx`: main (fps=30, durationInFrames=ceil(total*30)) + Thumbnail (fps=30, frames=1).
7. **Audit** render still cuối mỗi beat → check overlap + bug transform. Sửa hết TRƯỚC khi render mp4 (rule: audit chủ động mọi slide, không đợi user chỉ).
8. **Render** `npx remotion render <id> final.mp4`. **Node ≥16** (PATH: `nvm use 24` / `/c/Users/<u>/AppData/Local/nvm/v24.14.0`).
9. **Thumbnail** designed (navy+grid+node "C"+mega title+3 chip), KHÔNG frame-extract.
10. **caption.md** — caption + pin breakdown + scene table + alt hooks + hashtag.

---

## 🚨 CẤM
- ❌ **TTS one-shot full script** — PHẢI tách từng beat (`tts_everai.py` per-beat + concat gap). One-shot đọc bài dài lỗi nhiều + sinh whisper subscribe-hallucination.
- ❌ Mix `transform` attr + `style` transform trên cùng `<g>` (bug ở trên)
- ❌ PNG slide tĩnh — style này PHẢI animated voice-synced
- ❌ Render bằng Node <16 (Remotion fail)
- ❌ Bịa fact; sửa wording user đã lock VERBATIM
- ❌ Bỏ audit still cuối beat trước khi render mp4
- ❌ Rounded-soft card — dùng TechBox bracket-corner

## ✓ Adjust được
- ✓ Thêm JADE/VIOLET/ORANGE accent cho variety (như EngineerSongSotAi)
- ✓ 6-8 fig tuỳ độ dài
- ✓ Diagram tuỳ nội dung (fan-out, radial node, timeline, bar chart)
- ✓ Voice Adam/Tào Tháo, speed 0.90-0.95
