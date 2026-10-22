---
name: video-production-gate
description: CỔNG BẮT BUỘC cho MỌI video TikTok/Reels/Shorts trong repo này. Dùng NGAY khi user yêu cầu làm video, dựng video, làm clip, render video, hoặc đưa script để làm thành video — BẤT KỂ format nào (quảng cáo, thơ, hài, explainer, reup, truyền kỳ). Không phải preset hình ảnh; đây là checklist quy trình chặn từng bước, ép chạy đúng pipeline script.md → TTS per-line (tts_lines.py, không whisper) → sync từ timeline.json → verify cặp frame → deliverables. Gọi TRƯỚC mọi skill format (the-review / blueprint-tech-video / tinh-dao-video / comedy-animation...), không thay thế chúng.
metadata:
  openclaw:
    emoji: "🚦"
    skillKey: "video-production-gate"
---

# 🚦 Video Production Gate

Skill này **không dạy làm đẹp**. Nó chặn những lỗi đã lặp lại nhiều lần và bị user chửi.

> **Luật số 0 — không bỏ qua bước nào.** Mỗi mục có ô tick. Tạo TodoWrite một todo cho mỗi GATE. Chưa tick GATE trước thì không được sang GATE sau. Nếu thấy mình đang nghĩ "cái này đơn giản, khỏi cần" — đó chính là lúc lỗi xảy ra.

---

## GATE 0 · Xác định nguồn script

- [ ] **User đưa script?** → dùng **NGUYÊN VĂN**. Không sửa hook, không restructure, không cắt bớt, không "tối ưu".
- [ ] Đối chiếu số dòng/đoạn script gốc với `script.json` sau khi tách beat. **Đếm cho khớp.** Lỗi thật đã xảy ra: bỏ mất 7 dòng tên file khỏi lời đọc mà không báo.
- [ ] Nội dung nào chỉ hiện trên hình mà **không có trong lời đọc** → phải hỏi user, không tự quyết.
- [ ] User chưa có script → chạy flow brainstorm → duyệt script TRƯỚC, không nhảy thẳng vào dựng.

---

## GATE 1 · script.md + phiên âm

- [ ] Script nằm ở **`projects/<slug>/script.md`** — nguồn DUY NHẤT cho cả voice lẫn chữ trên hình:
  - `# Tiêu đề` · `## TÊN_BEAT | Header hiển thị` mỗi beat
  - **mỗi dòng = một câu đọc = một reveal**, bắt đầu bằng emoji chỉ đạo: 🏯 dẫn · 💀 đau/nguy · 🤣 punchline · 🔥 cao trào · 🙏 trầm · 🔔 CTA · 📜 tiêu đề chương / thẻ câu mật ngôn (có ngoặc kép → thẻ lớn)
  - **dòng trống = sang trang** (một màn hình chữ), mỗi trang 2–5 dòng
  - dòng ngay sau dòng bắt đầu bằng `Người đời gọi nó là` hoặc `Người đời gọi chiêu này là` tự thành ô reveal thuật ngữ — viết 2 dòng riêng
- [ ] Chữ trên hình = chữ đọc (bỏ emoji) → GATE 0 tự khớp, không còn `text_display` lệch `text_phonetic`.
- [ ] `speed: 1.0` mặc định. **Ngoại lệ duy nhất: video THƠ → 0.95.**
- [ ] Model **`everai-v1.6`** — đọc tiếng Anh chuẩn hơn v1.5 và CHẠY ĐƯỢC với giọng clone Adam (đã thử 2026-10-19). Thử **viết literal English trước**; chỉ khi nghe sai mới thêm `phonetic.json` `{"chữ hiển thị": "cách đọc"}` — chữ trên hình vẫn giữ nguyên.
- [ ] Phiên âm (khi cần): tra `docs/PHONETIC_DICT.md`, **cấm dịch nghĩa để né** (`bug` → "bấc", KHÔNG phải "lỗi"). Thuật ngữ UI/Design đọc tiếng Việt. Không chắc → **hỏi user**.

---

## GATE 2 · TTS per-LINE — `tts_lines.py`

```
cd projects/<slug>
python ../_shared/tts_lines.py <public_slug>           # gen dòng mới/đổi, dựng lại timeline
python ../_shared/tts_lines.py <public_slug> --force   # gen lại tất cả
```

- [ ] Mỗi dòng 1 clip, **song song 8 luồng** (107 dòng ≈ 1 phút). Clip đặt tên theo hash `voice|model|speed|câu đọc` → sửa câu nào chỉ gen lại câu đó, **không thể dính bẫy giữ mp3 cũ**.
- [ ] Script tự: cắt lặng đầu/đuôi từng clip (silencedetect), chèn gap chuẩn (dòng 0.22s · trang 0.34s · beat 0.55s), concat → `tts/voice_full.mp3`, ghi `timeline.json`, **copy thẳng** sang `remotion-composer/public/<slug>/voice.mp3` và `src/<slug>_timeline.json`, và **chết ngay** nếu voice lệch timeline > 0.05s.
- [ ] Đọc báo cáo cuối: tổng thời lượng + danh sách **pace flag** (dòng có tốc độ lệch > 40% so với median của chính video → nghi nuốt chữ / ngắc). Có flag → nghe dòng đó, sửa câu hoặc `phonetic.json`, chạy lại.
- [ ] Tổng thời lượng dài hơn dự tính → báo user TRƯỚC khi render (đếm ~0.1s/chữ + gap).

> **Không whisper, không gen_sync.** Mỗi dòng là một clip riêng nên onset của nó = vị trí trong concat, chính xác tuyệt đối. EverAI `generate_srt` chỉ trả timing CỤM ƯỚC LƯỢNG (lệch 0.4–1s so với pause thật, đo 2026-10-19) — KHÔNG dùng để sync.

---

## GATE 3 · Nghe kiểm — thay cho whisper

- [ ] Nghe `tts/voice_full.mp3`, ưu tiên: các dòng có **English**, các dòng bị **pace flag**, các dòng **thoại**.
- [ ] Lỗi phát âm → sửa `phonetic.json` (hoặc câu trong script.md nếu user cho phép) → chạy lại `tts_lines.py` (chỉ dòng đổi bị gen lại) → nghe lại dòng đó.
- [ ] Whisper chỉ còn dùng khi cần **transcript** (reup/dub footage có sẵn) — không dùng cho video tự TTS.

---

## GATE 4 · 🔴 SYNC — đọc thẳng `timeline.json`

- [ ] Remotion import `<slug>_timeline.json`; mỗi dòng có `start`/`end` tuyệt đối (giây). **Cấm** tự gõ entry frame, cấm `base + i*step`, cấm ước lượng.
- [ ] `entry = round((line.start − seq_start) × 30) − LEAD`. **LEAD 4 + fadeUp 8f / pop 10f** → onset hiện ~50%, onset−5 vắng hẳn. (Thử LEAD 6 + fade 12f: onset−5 đã lộ bóng mờ → rớt GATE 5, 2026-10-19.)
- [ ] `durationInFrames` lấy từ `timeline.total` (export hằng số từ component, Root dùng lại) — đổi script không phải sửa Root.
- [ ] Một dòng chứa cả nhãn lẫn thứ cần reveal riêng → **tách thành 2 dòng** trong script.md (chữ giữ nguyên), không đo trong dòng.
- [ ] Render still/video dùng **`--public-dir` tối giản** (thư mục tạm chỉ chứa `<slug>/`) — `public/` thật 2.3 GB, copy mỗi lần render mất cả phút.

### Pipeline cũ (per-beat + whisper) — chỉ còn cho project cũ

`tts_everai.py` (đã lên v1.6) + `whisper_words.py` + `gen_sync.py.template` vẫn ở `_shared/` để re-render project cũ. Project mới **không** dùng.

---

## GATE 4b · 🎨 HÌNH VẼ TAY + SFX TÌNH HUỐNG (bước dựng hình mặc định, từ 2026-10-20)

> Video script (Mật Ngôn, truyền kỳ, POV, top N) dựng bằng skill **`whiteboard-doodle`** trừ khi user chọn style khác. Chi tiết từng bước ở skill đó.

- [ ] Bảng cảnh: mỗi page/dòng ghi rõ **hình gì** (đúng tình huống câu nói) + **SFX** nếu có. Dòng cue không vẽ, term → `"box"`, tên 📜 → `"banner"`.
- [ ] Người / đồ vật / cảm xúc lấy từ thư viện open-source (`find_doodles.py` → `doodles.txt` → `build_doodles.py <slug>`). **Cấm** tự vẽ người que, **cấm** AI sinh ảnh.
- [ ] Engine dùng chung `src/whiteboard/WhiteboardVideo.tsx` — component video chỉ chứa `SCENES` + `SFX` + helper đặc thù đề tài.
- [ ] SFX neo theo dòng `{ line: "BEAT:page:line", offset, src: "sfx/<nhóm>/<tên>.mp3" }` — **cấm** gõ giây tuyệt đối. Tiếng bút vẽ engine tự phát.
- [ ] Nền tối kênh `#0B0A12`, font Pangolin. Soi **contact sheet frame cuối mỗi page** + 1 frame giữa lúc vẽ TRƯỚC khi render dài.
- [ ] `--public-dir` tạm phải chứa cả `<slug>/` lẫn `sfx/`.

---

## GATE 5 · Verify cặp frame — bắt buộc, không nói suông

- [ ] Chọn ít nhất **3 reveal đại diện** (1 thoại, 1 list item, 1 punchline).
- [ ] Render frame tại **đúng word-onset** (`round(beat_start×30) + entry + LEAD`) → item PHẢI đang hiện rõ hoặc materialize 50–80%.
- [ ] Render frame **−5** trước đó → item PHẢI vắng.
- [ ] Không được render `+7f` rồi kết luận là sync.
- [ ] Sai → sửa anchor/LEAD → quay lại GATE 4.

---

## GATE 6 · Audio

- [ ] Cắt nhạc nền: **`-ss` đặt TRƯỚC `-i`**, hoặc thêm `asetpts=PTS-STARTPTS`. Đặt sau `-i` thì timestamp không reset → `afade` kích hoạt sai chỗ → nhạc chết giữa chừng mà không báo lỗi. Lỗi thật đã xảy ra.
- [ ] Verify nhạc bằng cách **đo theo mốc thời gian**, không đo mean toàn file. Mean che mất nửa file câm.
  ```
  for t in 0 20 40 60 ...; do ffmpeg -ss $t -t 1 -i bgm.mp3 -af volumedetect -f null - ; done
  ```
- [ ] SFX: đo `max_volume` tại đúng giây đã cài để chắc chắn có kêu.
- [ ] Kiểm clipping bằng `astats` → `Flat factor` phải là 0. `max -0.0 dB` một mình chưa phải rè.

---

## GATE 7 · Xuất bản

- [ ] Component nhận prop `bgm?: boolean` → đăng ký **2 composition** (`X` và `XNoBgm`).
- [ ] Render **cả hai**: `final_bgm.mp4` (duyệt) và `final_nobgm.mp4` (**bản đăng thật**).
- [ ] **GIỮ SFX trong bản nobgm** — SFX là nội dung, không phải nhạc nền.
- [ ] Verify bản nobgm: tại mốc chỉ có nhạc phải ra **−91 dB**; tại mốc có giọng/SFX phải giữ nguyên như bản bgm.
- [ ] Lý do: nhúng nhạc bản quyền → TikTok **chặn phân phối, 0 view** (đã kiểm chứng thật), không phải chỉ mute.

---

## GATE 8 · Deliverables — thiếu một cái là chưa xong

- [ ] `final_bgm.mp4` + `final_nobgm.mp4`
- [ ] `thumbnail.png` — **thiết kế riêng**, TUYỆT ĐỐI không cắt frame từ video
- [ ] `caption.md` — caption bản đăng + title A/B + comment ghim + thông số + ghi chú dựng
- [ ] Dòng 1 của caption là title thật (feed chỉ hiện ~60–70 ký tự), phải chứa từ khoá người ta gõ tìm kiếm
- [ ] Hashtag 5–8 cái, chia tầng rộng/vừa/hẹp. Bỏ `#xuhuong` `#fyp`
- [ ] **CTA tagline khớp tệp người xem:** IT thuần → "giới IT"; drama công sở / marketing / design → "chốn công sở". Đừng mặc định.
- [ ] Không hiện "Tập X" ở thumbnail hay outro
- [ ] Verify bằng `ffprobe` (duration, resolution) và xem thumbnail bằng mắt trước khi báo xong

---

## GATE 9 · Báo cáo

- [ ] Nêu **số đo thật** (duration, dB tại các mốc, số anchor hit/miss), không nói "đã sync" suông
- [ ] Nêu rõ thứ **tự quyết định** và thứ **cần user duyệt**
- [ ] Có thứ nào tự thêm ngoài script gốc → nói thẳng để user gỡ được

---

## Bảng lỗi đã trả giá

| Lỗi | Hậu quả thật |
|---|---|
| Ước lượng timing thay vì đo | Chữ lệch tiếng 1–6s, user bắt được nhiều lần |
| Dùng whisper để đo timing cho TTS tự sinh | Chậm, hallucination, anchor trượt — thay bằng TTS per-line (2026-10-19) |
| Dùng `srt_link` của EverAI để sync | Timing ước lượng, lệch 0.4–1s |
| TTS giữ mp3 cũ khi script đổi | 7/13 beat đọc nội dung cũ, log vẫn báo DONE bình thường |
| Anchor neo theo chữ trong script | Whisper ghi khác hẳn (`42` dạng số, `banner`→`ba`+`nơ`) → anchor trượt |
| Verify khi asset đang bị ghi đè | Whisper đọc file dở, timing sai mà không biết |
| Re-TTS xong quên copy sang `public/` | Render ra giọng cũ, lệch tiếng 2.93s, mọi gate khác vẫn xanh vì verify frame không soi tiếng |
| Dùng `base + i*step` cho thoại | Mỗi câu lệch một kiểu, phải làm lại từ đầu |
| Bỏ nội dung khỏi lời đọc mà không báo | Hình hiện thứ voice không đọc |
| `-ss` sau `-i` khi cắt nhạc | Nhạc chết từ 1/3 video, đo mean không phát hiện ra |
| Nhúng nhạc bản quyền | TikTok chặn phân phối → 0 view |
| Đo mean toàn file rồi kết luận | Che mất nửa file câm |
| `grep` không có `--line-buffered` khi theo dõi log | Mù hoàn toàn, mất cả tiếng |
| Báo "xong" khi chưa verify | Giao hàng lỗi |

---

## Liên quan

Gọi **kèm** skill format phù hợp, không thay thế: `whiteboard-doodle` (mặc định cho video script) · `the-review` · `blueprint-tech-video` · `tinh-dao-video` · `comedy-animation` · `truyen-ky-it` · `truyen-ky-tu-tien` · `loi-thu-nhan-vat` · `reup-comedy-dub` · `viral-hook`.

Memory nền: `feedback_sync_voice_workflow` · `feedback_tts_per_beat_pipeline` · `feedback_tts_pronunciation_pitfalls` · `feedback_tts_tech_phonetic` · `feedback_export_nobgm_tiktok` · `feedback_general_deliverables` · `feedback_user_script_verbatim`.
