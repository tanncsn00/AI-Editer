---
name: Always verify whisper VN captions against script before render
description: faster-whisper mis-transcribes Vietnamese — always print full transcript and fix against ground-truth script before using as caption text
type: feedback
originSessionId: 2a0427d9-ac2c-40d3-81b6-da81290e9ead
---
Khi làm video Vietnamese với narration + forced-alignment bằng `faster-whisper small`, LUÔN LUÔN print full transcript ra và so sánh với script gốc TRƯỚC KHI render final. Fix lỗi inline trong `word_timings.json` (giữ timing, sửa text).

**Lỗi whisper tiếng Việt phổ biến:**
- `cừu` → `cựu` / `cứu`
- `giàu` → `dầu`
- `ba mươi` → `ba` hoặc `30`
- `sáu` → `6`
- `không con` → `không có`
- `khoá` → `khóa`

**Why:** Session 2026-04-10 render full 107s video "Bầy Cừu" với caption từ whisper trực tiếp — user phát hiện "dầu hơn ngay" (should be "giàu"), "6 giờ 3 sáng" (should be "ba mươi sáng"). Phải render lại. User feedback: "lạy bố" + "rút kinh nghiệm nhé". Từ nay không lặp lại.

**How to apply:** Ngay sau khi chạy faster-whisper và lưu `word_timings.json`:
1. Print `' '.join(w['word'] for w in words)` ra terminal
2. Visual diff với script.txt
3. Fix lỗi bằng script Python: load JSON, sửa word.word cho các index sai, ghi lại
4. Best practice: dùng `initial_prompt=script_text` khi gọi faster-whisper để giảm sai số
5. Better practice: align script ground-truth với whisper timings (script là nguồn text, whisper chỉ cung cấp start/end), không dùng whisper text trực tiếp
