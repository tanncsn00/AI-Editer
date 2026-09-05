---
name: video-production-gate
description: CỔNG BẮT BUỘC cho MỌI video TikTok/Reels/Shorts trong repo này. Dùng NGAY khi user yêu cầu làm video, dựng video, làm clip, render video, hoặc đưa script để làm thành video — BẤT KỂ format nào (quảng cáo, thơ, hài, explainer, reup, truyền kỳ). Không phải preset hình ảnh; đây là checklist quy trình chặn từng bước, ép chạy đúng pipeline TTS → whisper → sync word-timestamp → verify cặp frame → deliverables. Gọi TRƯỚC mọi skill format (the-review / blueprint-tech-video / tinh-dao-video / comedy-animation...), không thay thế chúng.
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

## GATE 1 · script.json + phiên âm

- [ ] `speed: 1.0` mặc định. **Ngoại lệ duy nhất: video THƠ → 0.95.**
- [ ] Mỗi beat có `text_phonetic` (cho TTS) và `text_display` (cho hình).
- [ ] **Tra `docs/PHONETIC_DICT.md` cho MỌI thuật ngữ tiếng Anh.** Không tự bịa phiên âm.
- [ ] Quy tắc phiên âm: đọc âm tiếng Anh, **cấm dịch nghĩa để né** (`bug` → "bấc", KHÔNG phải "lỗi").
- [ ] Ngoại lệ: thuật ngữ **UI/Design** thì đọc tiếng Việt, chữ hiện vẫn English (`font` → đọc "phông chữ", hiện "font"). Chỉ giữ phiên âm cho Figma / React / pixel / Frontend / Designer.
- [ ] Thuật ngữ không có trong dict và không chắc → **hỏi user**, đừng đoán.

---

## GATE 2 · TTS per-beat

- [ ] **Copy script từ `projects/_shared/`**, KHÔNG copy từ project cũ. Bản `_shared` là bản đã vá.
- [ ] Chạy `tts_everai.py` — mỗi beat 1 file mp3, concat gap 0.3s.
- [ ] Re-gen được từng beat riêng (`python tts_everai.py 3 6`), không phải render lại cả bài.
- [ ] Ghi lại `total` để đối chiếu về sau.

### ⚠️ Bẫy TTS giữ file cũ — đã cắn một lần

`tts_everai.py` **bỏ qua beat đã có mp3**. Nếu script đổi mà tên beat giữ nguyên, nó im lặng giữ giọng cũ, log vẫn báo `DONE N beats`, tổng thời lượng vẫn ra con số trông hợp lý. Đã xảy ra thật: 7/13 beat đọc nội dung của script cũ, chỉ transcript mới lộ ra.

- [ ] Bản `_shared` đã vá bằng **chữ ký nội dung** (`tts/_sig.json`, hash của `voice|speed|text_phonetic`). Đổi chữ / đổi giọng / đổi speed đều buộc re-gen, in ra `noi dung DA DOI`.
- [ ] Nếu dùng bản chưa vá, hoặc script thay đổi lớn → **`rm -rf tts` trước khi chạy**.
- [ ] Bị ngắt giữa chừng (Ctrl-C, user dừng) → coi như tts bẩn, xoá rồi chạy lại. File sinh dở vẫn được tính là "đã có".

---

## GATE 3 · Whisper verify — TRƯỚC khi dựng hình

- [ ] Chạy `whisper_words.py` (`word_timestamps=True`, `condition_on_previous_text=False`).
- [ ] **In transcript theo từng beat và ĐỌC bằng mắt.** Không tin cờ boolean.
- [ ] Soi 4 loại lỗi:
  - **Nuốt/gộp chữ** — whisper KHÔNG bắt được, phải nghe/soi từng beat cô lập
  - **Lặp chữ (DUP)**
  - **Thuật ngữ English đọc sai**
  - **Hallucination** — whisper hay chèn spam kiểu "đăng ký kênh", thường ở beat gần cuối. Audio vẫn sạch → patch transcript, ĐỪNG re-TTS.
- [ ] Có lỗi phát âm → sửa phonetic → re-TTS beat đó → **quay lại GATE 3**.

---

## GATE 4 · 🔴 SYNC WORD-TIMESTAMP — chỗ hay bị bỏ nhất

> Đây là gate bị vi phạm nhiều nhất. Đọc kỹ `feedback_sync_voice_workflow.md` trong memory TRƯỚC khi viết dòng code Remotion đầu tiên.

- [ ] **TUYỆT ĐỐI KHÔNG ước lượng timing.** Cấm `base + i*step`. Cấm rải đều. Cấm char-proportional. Mọi cách đoán đều lệch 1–6 giây.
- [ ] Viết `gen_sync.py`: dò anchor **tuần tự** (mỗi anchor tìm SAU vị trí anchor trước) → xuất `timings.json` là mảng entry tường minh.
- [ ] `entry = max(0, round((word_start − beat_start) × 30) − LEAD)`
- [ ] **LEAD theo tốc độ animation:** fade nhanh 5–6f → LEAD 0. Pop/scale 12–15f → LEAD ≈ 8f.
- [ ] Anchor neo vào **chữ nhấn đơn** của nội dung box, không neo vào câu tóm/câu chốt, không neo vào cụm có filler đứng trước.
- [ ] **THOẠI QUA LẠI → đo TỪNG câu riêng.** Mỗi bong bóng một key. Đây chính là lỗi đã xảy ra ở `designer-vs-fe` và lặp lại ở `hoa-ngon`.
- [ ] **LIST/cascade → đo TỪNG item.** 7 dòng file = 7 anchor, không phải 1 anchor rồi cộng dồn.
- [ ] Guard `entry < beat_dur × 30` kẻo dòng không kịp hiện.
- [ ] Chạy gen_sync, **đọc báo cáo MISS**. Còn MISS → sửa anchor, chạy lại. Cụm nhiều MISS cùng vùng = dấu hiệu whisper nuốt đoạn đó.

### ⚠️ Bẫy asset cũ trong `public/` — đã cắn một lần

`tts_everai.py` ghi ra `tts/voice_full.mp3` **trong thư mục project**, còn Remotion đọc `remotion-composer/public/<slug>/voice.mp3`. Hai chỗ khác nhau. Sửa script → re-TTS → quên copy → **render ra video có giọng cũ, lệch tiếng vài giây, mà mọi gate khác vẫn xanh** (verify frame chỉ soi hình, không soi tiếng). Đã xảy ra thật khi bỏ 1 beat: giọng lệch 2.93s.

- [ ] Bản `_shared/gen_sync.py.template` đã vá: `sync_voice()` tự copy khi khác nội dung và **chết ngay** nếu `voice.mp3` lệch `beats total` quá 0.05s. Đặt `SLUG` đúng tên thư mục trong `public/`.
- [ ] Sau mỗi lần re-TTS, đọc dòng `voice.mp3 ... — <giây>` và đối chiếu với `total_duration`.
- [ ] Đổi số beat → **phải đổi `durationInFrames` trong Root.tsx và cắt lại nhạc nền** cho khớp độ dài mới.

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

Gọi **kèm** skill format phù hợp, không thay thế: `the-review` · `blueprint-tech-video` · `tinh-dao-video` · `comedy-animation` · `truyen-ky-it` · `truyen-ky-tu-tien` · `loi-thu-nhan-vat` · `reup-comedy-dub` · `viral-hook`.

Memory nền: `feedback_sync_voice_workflow` · `feedback_tts_per_beat_pipeline` · `feedback_tts_pronunciation_pitfalls` · `feedback_tts_tech_phonetic` · `feedback_export_nobgm_tiktok` · `feedback_general_deliverables` · `feedback_user_script_verbatim`.
