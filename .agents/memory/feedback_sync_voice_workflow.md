---
name: feedback_sync_voice_workflow
description: QUY TRÌNH BẮT BUỘC sync slide + reveal theo word-timestamp cho MỌI video — không bao giờ ước lượng timing
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fc965a61-9035-42e6-9240-c57856fe47a1
  modified: 2026-08-13T04:25:57.553Z
---

**BẮT BUỘC cho MỌI video** (user ra lệnh 2026-06-20: "làm video BẮT BUỘC chạy như nãy làm chuẩn slide cho voice"): đo word-timestamp thật, **KHÔNG ước lượng / đoán / char-proportional**.

**Why:** User chửi nhiều lần vì lệch. Mọi cách đoán đều SAI: char-proportional lệch tích luỹ 2-3.4s; rải-đều-theo-câu lệch 3-6s vì lead-in mỗi beat dài ngắn khác nhau; `base + i*step` lệch tới 1s. Tai-mắt cực nhạy với **hình hiện TRƯỚC tiếng** — đó là cảm giác "lệch ngố" rõ nhất.

## Quy trình 6 bước (chạy đủ, đúng thứ tự)

**1. TTS → whisper → làm sạch transcript TRƯỚC khi build**
- TTS per-beat ([[feedback_tts_per_beat_pipeline]]) → whisper `condition_on_previous_text=False`, `word_timestamps=True`.
- Quét DUP (lắp), kiểm English term, kiểm NUỐT/GỘP chữ ("Cuối tháng. Than nghèo" → đọc "Cuối nghèo"). Sai phát âm → sửa phonetic + re-TTS TRƯỚC khi build ([[feedback_tts_pronunciation_pitfalls]]).

**2. BEAT BOUNDARY theo word-timestamp**
- `start` = giây voice bắt đầu câu mở đầu beat (anchor) − 0.12s. `duration` = start beat sau − start beat này.
- → slide ở lại trọn câu chốt, không nhảy sớm.

**3. MỖI reveal đo entry RIÊNG**
- `entry = max(0, round((word_start − beat_start) × 30) − LEAD)`.
- Anchor vào **CHỮ ĐẦU của NỘI DUNG BOX HIỂN THỊ**, không phải câu tóm/câu chốt.

**4. VERIFY bằng cặp frame** (bắt buộc, không nói suông)
- Render tại **ĐÚNG frame word-onset** (`round(beat_start×30) + entry + LEAD`) → item PHẢI đang hiện rõ/materialize.
- Và frame `−5` trước đó → phải VẮNG.
- Đừng render `+7f` rồi tưởng sync (lỗi 2026-07-02: tại chữ item còn 0%, user bắt đúng).

**5. Audit slide đầy + frame check trước câu chốt**, rồi mới render final.

**6. Re-TTS → recompute LẠI từ bước 2** (beats + mọi entry đổi theo timing mới). ⚠️ COPY voice/beats/timings sang `remotion-composer` sau khi re-gen rồi mới render — dễ quên → verify trên asset cũ, chẩn sai.

## LEAD — canh theo thời gian animation

Không có con số cứng. `LEAD ≈ nửa → trọn pop_duration`:
- **Fade nhanh (5-6f)** → LEAD = 0. Item rõ ~0.2s sau chữ = tự nhiên.
- **Pop/scale chậm (12-15f = 0.4-0.5s)** → LEAD ≈ 8f (0.27s). Nếu để LEAD 0, item chỉ rõ hẳn 0.5s SAU chữ → user thấy "trễ, chưa sync" (2026-07-02 sales-dao).
- Tại đúng frame word-onset item nên đã hiện 50-80% (đang materialize) → cảm giác khớp. Đây không vi phạm "đừng hiện trước tiếng" vì lúc chữ vang item mới đang mờ hiện.

## Bẫy whisper hallucination

- Whisper chèn **subscribe-spam** ("đăng ký kênh ủng hộ", "Ghiền Mì Gõ", "Hãy đăng ký kênh để nhận thông tin") ăn mất 20-30s nội dung thật, thường ở beat GẦN CUỐI. Tái diễn liên tục (pov-ktv, pov-creator, clean-arch, designer-vs-fe, moigioi). **Audio VẪN SẠCH** — patch transcript, đừng re-TTS.
- **Cờ auto không đáng tin cả 2 chiều:** false-negative (whisper viết "đăng **kí**" → check "đăng ký" trượt); false-positive ("ung ho" khớp nhầm substring "n**hưng H**ọa").
- **Detector đáng tin nhất = CỤM REVEAL MISS trong gen_sync** — khi nhiều anchor của cùng 1 vùng đều MISS → gần như chắc chắn hallucination nuốt đoạn đó.
- Fix: `patch_words.py` re-transcribe CLIP CÔ LẬP rồi splice. Vùng patch phải **RỘNG** (bao trọn tới khi content thật resume, +vài giây) — cắt giữa câu → mất anchor OPEN → beat nhảy nhầm. Vùng nhiều SỐ thì **ĐỪNG dùng `initial_prompt`** (whisper echo lại prompt). Sau patch chạy lại NONE-check. Luôn EYEBALL tail + full transcript, đừng tin boolean.

## Bẫy chọn anchor

- **2 beat liền dùng chung anchor** (vd cả hai "thiên kiếp thứ") → `find(after=prev)` với `>=` trả CÙNG vị trí → beat sau dài 0.95s. Phải cho mỗi beat anchor PHÂN BIỆT ("thứ hai" vs "thứ ba").
- **Anchor có filler-prefix = bung SỚM 0.5-0.9s** (2026-07-06): `find()` trả chữ đầu cụm, nên "**đó là** feature" bung ngay tại "đó". Neo vào **CHỮ NHẤN đơn** (chữ to nhất trên box): `e("FEATURE","feature")` chứ đừng `"do la feature"`.
- **Whisper ghi SỐ dạng digit** ("Ba tháng"→"3 thang", "thứ 2", "18 giờ 15 phút") và **đồng âm** ("chưởng"→"trưởng", "Sếp"→"Xếp", "réo"→"déo", "Quan Trắc"→"quan chắc") → đối chiếu transcript thật rồi đổi anchor né. Anchor list nên theo text đi kèm ("ceo xuất hiện") thay vì số.
- **Cụm đọc nhanh bị merge** ("API Database"→"epitabay") → 1 anchor cho cả 2, thiết kế card gộp.
- `norm()` strip "%" cuối token → anchor bỏ % ("lai 3%"→"lai 3").
- **HOLD đụng OPEN-anchor:** HOLD đẩy `start` trễ → anchor nằm TRƯỚC start mới → MISS/NONE. Giữ `HOLD ≤ (anchor_time − raw_start)` (≈0.44s), hoặc neo item vào chữ muộn hơn trong câu mở beat.

## Bẫy nhiều item / nhiều dòng

- **LIST/cascade = đo TỪNG item bằng `arr()`** → mảng entry tường minh `const TENTRY=[226,254,284,316]`. **TUYỆT ĐỐI KHÔNG `base + i*step`** (2026-06-22 pov-devops, user: "mem mày ko bảo item phải map voice à?") — khoảng cách thật không đều.
- **THOẠI QUA LẠI = đo TỪNG câu riêng** (2026-07-01 designer-vs-fe): slide nhiều dòng đối thoại phải có key riêng mỗi câu (q1/q2/q3), không `entry+6/+12` offset cứng.
- **Box tóm 1 list** → anchor lúc list BẮT ĐẦU, không phải câu kết (2026-06-20 grpc: box "User/Order/Payment" anchor nhầm vào "tất cả đều sống chung 1 nhà" → trễ 4s).
- **Box nhiều dòng cách xa >3s** → tách reveal riêng.
- Rào cũ vẫn giữ: `entry < beat_dur×30` (kẻo dòng không hiện).
- Căn giữa grid hàng lẻ (5 item = 3+2) → center hàng cuối: `cx = W/2 − (rowN×step−gap)/2 + …`.

## 🥁 NHỊP giữa slide

Hard-cut ngay sau reveal punchline → cụt ("sang luôn nên ko có nhịp", 2026-07-02 sales-dao). Fix: (a) **SlideFade** fade-in 8f đầu + fade-out 9f cuối mỗi Sequence; (b) giữ reveal chốt thở thêm ~0.5s bằng **HOLD** boundary. Áp cho slide có punchline mạnh.

Liên quan: [[feedback_tts_per_beat_pipeline]] · [[feedback_tts_pronunciation_pitfalls]] · [[feedback_caption_whisper_verify]] · [[reference_blueprint_skill]]
