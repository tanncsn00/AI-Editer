# TikTok Triết Lý: "Sự Cô Đơn" — Design Spec

## Overview

Video TikTok 9:16 dạng triết lý làm người. Chủ đề: **Sự cô đơn** — đánh vào cái tôi, cảm xúc, chủ nghĩa cá nhân. Phong cách tối giản, nền đen, chữ trắng typewriter, cảm giác xưa cũ.

## Audience

Người Việt 18-35 trên TikTok — đang tìm content tâm lý/triết lý, dễ đồng cảm với nỗi cô đơn. Đánh vào cảm xúc cá nhân để thu hút tương tác.

## Visual Style

- **Nền:** Đen thuần `#000000`, không gradient, không background image
- **Chữ:** Trắng ngà `#E5E5E5`, font Courier New (monospace)
- **Font size:** 52px cho hook (scene 1), 42px cho thân bài và kết
- **Typewriter effect:** Gõ từng ký tự, tốc độ 15 chars/giây
- **Cursor:** `|` nhấp nháy 2 lần/giây, biến mất khi câu gõ xong
- **Chữ căn giữa** cả ngang lẫn dọc
- **Transition giữa các câu:** Fade to black 0.5s → black 0.3s → câu mới typewriter
- **Không overlay, không particle, không animation khác** — tối giản tuyệt đối

## Audio

- **Giọng đọc:** Piper TTS tiếng Việt, model `vi_VN-vais1000-medium` (nam)
- **Tốc độ:** Mặc định Piper (~1.0 length_scale)
- **Sentence silence:** 0.5s giữa các câu
- **Nhạc nền:** Ambient drone từ Pixabay, keyword "dark ambient drone"
- **Music volume:** 0.06 (rất nhẹ)
- **Music fade:** Fade in 2s đầu, fade out 3s cuối
- **Không SFX** — không tiếng gõ phím, không hiệu ứng âm thanh

## Output

- **Resolution:** 1080x1920 (9:16 TikTok)
- **Duration:** 45-60 giây (adjust theo TTS thực tế)
- **FPS:** 30
- **Format:** MP4 (H.264)

## Pipeline

Remotion `TikTok` composition (1080x1920) sử dụng Explainer component với TypewriterCard mới.

## Script

8 câu, mỗi câu = 1 scene typewriter riêng.

### Scene 1 — Hook (0-6s)
> "Có một loại cô đơn... không ai nhìn thấy."

Font size: 52px. Câu mở — cần gây tò mò ngay.

### Scene 2 (6-14s)
> "Bạn ngồi giữa đám đông, cười nói... nhưng bên trong trống rỗng."

### Scene 3 (14-22s)
> "Bạn có hàng trăm người quen. Nhưng không ai thực sự hiểu bạn."

### Scene 4 (22-28s)
> "Ban ngày bạn mạnh mẽ. Đêm về... bạn mệt."

Câu ngắn nhất — nhịp nghỉ mạnh, impact cao.

### Scene 5 (28-35s)
> "Cô đơn thật sự không phải là không có ai bên cạnh."

### Scene 6 (35-43s)
> "Mà là có người bên cạnh... nhưng vẫn thấy mình một mình."

Câu đánh mạnh nhất thân bài — kết hợp với scene 5 tạo twist.

### Scene 7 — Kết (43-49s)
> "Nhưng có lẽ... cô đơn không phải là kẻ thù."

### Scene 8 — Kết (49-57s)
> "Nó là tấm gương. Để bạn nhìn thấy mình thật sự cần gì."

Kết bằng góc nhìn tích cực: cô đơn = cơ hội tự nhận thức, không phải an ủi sáo rỗng.

**Timing chính xác sẽ adjust sau khi generate TTS.**

## Remotion Scene Plan

| Scene | Duration (est.) | Component | Props |
|-------|----------------|-----------|-------|
| 1 — Hook | ~6s | TypewriterCard | fontSize: 52, charsPerSecond: 15 |
| 2 | ~8s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 3 | ~8s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 4 | ~6s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 5 | ~7s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 6 | ~8s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 7 | ~6s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |
| 8 | ~8s | TypewriterCard | fontSize: 42, charsPerSecond: 15 |

Tất cả scene: `color: "#E5E5E5"`, `backgroundColor: "#000000"`.

## Technical Requirements

### Component mới: TypewriterCard

**File:** `remotion-composer/src/components/TypewriterCard.tsx`

**Props:**
- `text: string` — nội dung hiển thị
- `fontSize?: number` — default 42
- `color?: string` — default `#E5E5E5`
- `backgroundColor?: string` — default `#000000`
- `charsPerSecond?: number` — tốc độ gõ, default 15
- `cursorBlinkRate?: number` — số lần nhấp nháy/giây, default 2

**Logic:**
- Dùng `useCurrentFrame()` + `fps` để tính số ký tự hiện tại: `chars = Math.floor(frame / fps * charsPerSecond)`
- Hiển thị `text.slice(0, chars)`
- Cursor `|` nhấp nháy dùng `Math.floor(frame / (fps / cursorBlinkRate / 2)) % 2`
- Cursor biến mất khi đã gõ hết text + 0.5s
- Font: Courier New, monospace
- Căn giữa màn hình, `maxWidth: 85%`, `lineHeight: 1.5`

### Đăng ký trong Explainer.tsx

Thêm vào SceneRenderer:
- `type === "typewriter"` → render `<TypewriterCard>`
- Map props: `text`, `fontSize`, `color`, `backgroundColor`

### TTS Model

- Download `vi_VN-vais1000-medium.onnx` + `.onnx.json` từ HuggingFace
- Lưu tại `~/.piper/models/`
- Gọi Piper với `--model <path>` + `--sentence-silence 0.5`

### Audio Assembly

- Generate 8 file WAV riêng (1 per scene)
- Concat thành 1 `narration.wav` với gap 1-1.5s giữa các scene
- Pad tổng duration theo video length

## Budget

| Asset | Provider | Cost |
|-------|----------|------|
| Voiceover | Piper (local) | $0.00 |
| Background music | Pixabay (free) | $0.00 |
| Remotion render | Local | $0.00 |
| **Total** | | **$0.00** |

## Success Criteria

1. Video 9:16, duration 45-60s
2. Typewriter effect rõ ràng — từng ký tự hiện ra, cursor nhấp nháy
3. Nền đen thuần, chữ trắng ngà, font monospace
4. Giọng đọc tiếng Việt nghe rõ, phát âm chấp nhận được
5. Nhạc ambient drone nhẹ, không lấn giọng đọc
6. Sync: text typewriter xuất hiện cùng lúc giọng đọc câu đó
7. Transition mượt giữa các câu — fade to black, không giật
