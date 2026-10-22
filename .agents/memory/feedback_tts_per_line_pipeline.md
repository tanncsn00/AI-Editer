---
name: feedback_tts_per_line_pipeline
description: "Từ 2026-10-19: TTS mỗi DÒNG 1 clip (EverAI v1.6) → timeline.json chính xác, BỎ whisper + gen_sync cho video tự TTS. User chê whisper chậm/thừa."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0aa39df9-41cd-4e00-8112-f9a6f536bafc
  modified: 2026-10-19T05:54:21.380Z
---

**Video tự TTS dùng `projects/_shared/tts_lines.py`, không whisper, không gen_sync.** Thay [[feedback_tts_per_beat_pipeline]]; phần đo word-timestamp của [[feedback_sync_voice_workflow]] không còn cần cho loại video này.

**Why:** user 2026-10-19: "dùng whisper thừa quá… gạt bớt quy trình whisper đi, cái đó lâu quá". Đã thử EverAI `generate_srt`: chỉ trả timing CỤM tách theo dấu câu, và là ƯỚC LƯỢNG — lệch 0.4–1s so với pause thật (đo bằng silencedetect), trôi dần → không dùng sync được. Còn mỗi dòng 1 clip thì onset = vị trí trong concat, chính xác tuyệt đối. Clip EverAI luôn có đúng 0.2s lặng đầu + ~0.54s lặng đuôi → cắt bằng silencedetect ổn định.

**How to apply:**
- Script = `projects/<slug>/script.md`: `## NAME | Header`, mỗi dòng 1 câu bắt đầu emoji style (🏯💀🤣🔥🙏🔔📜), dòng trống = trang. Chữ hình = chữ đọc. Dòng sau `Người đời gọi nó là` = ô reveal thuật ngữ.
- `python ../_shared/tts_lines.py <public_slug>` → song song 8 luồng (107 dòng ≈ 57s), cache theo hash câu đọc, tự copy voice + timeline sang Remotion, chết nếu lệch > 0.05s, báo pace flag (lệch > 40% median chars/s → nghi nuốt/ngắc).
- Model **everai-v1.6** chạy được với clone Adam (`model_id` chỉ ghi "giọng tiêu chuẩn" trong docs nhưng response echo v1.6). Viết literal English trước; sai mới thêm `phonetic.json`.
- Remotion đọc `<slug>_timeline.json`; ref data-driven `remotion-composer/src/PovBds.tsx` (blueprint) · `MatNgonDiaOc.tsx` (Mật Ngôn) (LEAD 4 + fadeUp 8f / pop 10f — LEAD 6 + fade 12f rớt GATE 5 vì onset−5 lộ bóng). Render dùng `--public-dir` thư mục tạm chỉ chứa `<slug>/` (public thật 2.3 GB).
- Bẫy: JetBrains Mono phải load subset `vietnamese` + `latin-ext`, không thì chữ có dấu vỡ.
- Kiểm tra bằng tai thay whisper: dòng English, dòng pace flag, dòng thoại.
