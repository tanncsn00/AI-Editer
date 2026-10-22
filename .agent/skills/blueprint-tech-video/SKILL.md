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
- `remotion-composer/src/PovBds.tsx` — **data-driven** POV truyền kỳ: đọc `pov_bds_timeline.json`, tự dựng trang/dòng, không gõ entry tay (mẫu cho pipeline per-line)

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
1. Import `<slug>_timeline.json` (sinh bởi `tts_lines.py`): beat → page → line, mỗi line có `start`/`end` tuyệt đối.
2. Mỗi beat một `<Sequence>`; trong đó mỗi line reveal tại `round((line.start − seq_start)×30) − LEAD`.
3. KHÔNG gõ entry frame tay, KHÔNG ước lượng theo char offset — xem `PovBds.tsx`.

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
2. **TTS per-LINE** (từ 2026-10-19): script ở `projects/<slug>/script.md` (một dòng = một câu = một reveal, emoji = style, dòng trống = trang) → `python ../_shared/tts_lines.py <public_slug>`. EverAI **everai-v1.6** + Adam `voice-739e9501-c06f-4cbf` speed 1.0, gen song song, tự copy `voice.mp3` + `<slug>_timeline.json` sang Remotion. Chi tiết + checklist: `video-production-gate` GATE 1–4.
3. **Timing** = `timeline.json` (start/end tuyệt đối mỗi dòng). **Không whisper, không gen_sync, không entry frame gõ tay.** `entry = round((line.start − seq_start)×30) − LEAD`, LEAD 4 + fadeUp 8f / pop 10f (fade dài hơn thì onset−5 lộ bóng).
4. **Nghe kiểm** dòng English + dòng pace flag → sửa `phonetic.json` → chạy lại (chỉ dòng đổi bị gen lại).
5. **Slides** copy 1 golden ref `.tsx`, đổi content + entry frame + màu. Giữ nguyên BlueprintBG/SectionHeader/FigFooter/TechBox/hook anim.
6. **Register** 2 composition trong `Root.tsx`: main (fps=30, durationInFrames=ceil(total*30)) + Thumbnail (fps=30, frames=1).
7. **Audit** render still cuối mỗi beat → check overlap + bug transform. Sửa hết TRƯỚC khi render mp4 (rule: audit chủ động mọi slide, không đợi user chỉ).
8. **Render** `npx remotion render <id> final.mp4`. **Node ≥16** (PATH: `nvm use 24` / `/c/Users/<u>/AppData/Local/nvm/v24.14.0`).
9. **Thumbnail** designed (navy+grid+node "C"+mega title+3 chip), KHÔNG frame-extract.
10. **caption.md** — caption + pin breakdown + scene table + alt hooks + hashtag.

---

## 🚨 CẤM
- ❌ **TTS one-shot full script** — dùng `tts_lines.py` per-line. One-shot đọc bài dài lỗi nhiều, mất timing.
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
- ✓ Voice Adam/Tào Tháo, speed 1.0 (thơ 0.95)
