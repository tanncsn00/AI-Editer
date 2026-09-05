---
name: feedback_tts_per_beat_pipeline
description: "TTS TÁCH TỪNG BEAT (mỗi slide 1 file mp3) thay vì full 1 lần — user đề xuất 2026-07-03; hết hallucination, isolate lỗi, biên chính xác."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
  modified: 2026-08-14T04:49:26.893Z
---

**Từ 2026-07-03 (moigioi-dao): TTS mỗi BEAT thành 1 file mp3 riêng, KHÔNG gen full script 1 lần.** User đề xuất ("tách ra thành từng chunk... slide 1 chunk 1 chứ ko full mp3") sau khi chán EverAI lỗi liên miên ở bài dài.

**Why (lợi ích lớn):**
- **Hết whisper subscribe-hallucination** — nó sinh ra do whisper chunk 35s trên audio DÀI. Beat ngắn (10-30s) whisper cả clip 1 lần, sạch.
- **Isolate lỗi:** beat nào đọc lỗi/nuốt/lắp → chỉ `python tts_everai.py <index>` re-gen ĐÚNG beat đó (30s), không phải re-TTS + re-verify cả 3-4 phút.
- **Biên slide CHÍNH XÁC tuyệt đối** = độ dài từng file (segments.json), KHÔNG cần đoán OPEN-anchor bằng whisper nữa.
- **Nhịp đẹp hơn:** chèn GAP 0.3s silence giữa beat → SlideFade fade trong khoảng lặng, cắt slide tự nhiên.

**How (pipeline mới, đã chạy ở `projects/moigioi-dao/`):**
1. `tts_everai.py` — loop beats, mỗi beat POST `text_phonetic` riêng → `tts/beat_NN.mp3`; pad mỗi file `apad=pad_dur=0.30` + `aformat=44100:mono` → wav; concat demuxer → `voice_full.mp3`; ghi `segments.json` {index,name,start,content_dur,duration=content+GAP,total}. CLI: `all` ép gen hết, `3 6` ép beat 3+6, không tham số = gen file thiếu.
2. `whisper_words.py` — whisper TỪNG `beat_NN.mp3` (KHÔNG chunk, `condition_on_previous_text=False`), timestamp + `segment.start` offset → global `whisper_words.json`. Sạch, không hallucination.
3. `gen_sync.py` — boundary lấy TỪ `segments.json` (bs[name]=start, content_dur), bỏ hẳn phần dò OPEN-anchor + HOLD. Item vẫn `e()/arr()` global find + LEAD 8f. Cap = `content_dur*30-4`.
4. Remotion `Sequence from=round(start*30) duration=round(duration*30)` (duration đã gồm GAP). SlideFade fade in/out trong GAP.

**Lưu ý:** whisper vẫn ghi 1 term KHÁC NHAU mỗi lần gen (Call Margin → "cot margin"/"maxine"/"mark zinn"; "ba hôm" ↔ "3 hôm") → sau mỗi lần re-gen beat phải re-check anchor NONE của beat đó, sửa theo token thực. Speed hiện **1.0** (user chốt 2026-08-14, xem [[feedback_tts_speed_1x]] — con số 0.95 cũ đã bỏ). Vẫn ISOLATE/nghe từng beat để bắt nuốt-lắp; dấu chấm vụn nhiều → smooth bằng phẩy trong `text_phonetic` (display giữ nguyên). Related [[feedback_sync_voice_workflow]] · [[feedback_tts_tech_phonetic]].
