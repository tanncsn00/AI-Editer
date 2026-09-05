---
name: feedback_tts_tech_phonetic
description: "Tech term trong script TTS phải ĐỌC ÂM tiếng Anh, cấm dịch nghĩa sang tiếng Việt — tra bảng phonetic ở docs/PHONETIC_DICT.md"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fc965a61-9035-42e6-9240-c57856fe47a1
  modified: 2026-08-14T08:33:28.856Z
---

## 📖 Bảng tra: `docs/PHONETIC_DICT.md`

**Trước khi viết bất kỳ script TTS nào có tech term/acronym → ĐỌC file đó.** Bảng ~90 term đã whisper-verify (acronym, infra, dev/concurrency, design/business, UI Việt hóa) nằm ở đấy, không nằm trong memory này nữa. Term mới chưa có trong bảng → **hỏi user**, đừng bịa; xong thì bổ sung vào bảng.

## 🚨 RULE TỐI THƯỢNG — ĐỌC tiếng Anh, KHÔNG DỊCH

User chửi 2 lần (2026-07-06). Term tiếng Anh phải để voice bật ra **ÂM tiếng Anh**:
- **(a) Viết LITERAL English** — ưu tiên. EverAI đọc cụm English tech phổ biến rất sạch (`feature`, `Critical Section`, `Deadlock`, `Atomic`, `Production`, `build`, `unit test`, `code review`).
- **(b) Phonetic Việt tạo ÂM English** — khi (a) hỏng. bug→"bấc/bức", Mutex→"Mutech".
- **CẤM dịch NGHĨA chỉ để né phát âm:** ❌ Screen Record→"Quay Màn Hình" · ❌ Timestamp→"dấu thời gian" · ❌ Reproduce→"Bất Tái Hiện" · ❌ **bug→"lỗi"** (bug PHẢI đọc "bấc/bức").
- Display luôn giữ English nguyên ([[feedback_caption_phonetic_display]]).

**✅ Ngoại lệ — TÊN PHÁP BẢO (chốt 2026-08-14):** Việt hóa ĐƯỢC phép khi nó là **thủ pháp đặt tên** của video truyền kỳ/tu tiên, không phải cách chữa phát âm. Đây là kỹ thuật "đặt tên HAI TẦNG" của [[reference_truyen_ky_it_skill]]: tên KIẾP + tên CÔNG PHÁP + reveal *"Người đời gọi nó là `<tech>`"* (Loạn Cảnh Kiếp → Vạn Cảnh Quy Nhất Đạo → Docker). Điều kiện: (1) tên Hán-Việt đóng vai pháp bảo/công pháp/kiếp nạn trong mạch truyện, (2) **có reveal tên English ngay sau**, (3) display giữ English.

**Test phân biệt:** bỏ tên Việt đi, câu còn nghĩa không? Chỉ mất *cách đọc* → đang chữa phát âm → CẤM (`bug`→"bấc"). Mất cả *hình tượng/mạch truyện* → là thủ pháp → ĐƯỢC (`Git Blame`→"Truy Tội Kính").

**Why:** user feedback "đm mày xem lại full đi như lol" vì bịa "Nờ pi em" cho NPM, "Em Cê Pi" cho MCP, "Jê Sờ Ô Ên" cho JSON. Dev VN không nói thế.

## Quy tắc chọn dạng

- **Cụm/câu English nhiều từ → LITERAL English.** EverAI v1.5 đọc nguyên câu tiếng Anh tự nhiên rất tốt; phonetic từng âm ("goai đít gọc") thì méo.
- **Từ đơn / acronym / tên riêng → PHẢI phonetic.** Từ đơn English hay sai (Cache→"cách", works→"guạc").
- **Acronym có 2 hệ tên chữ cái, chọn đúng hệ người VN dùng cho acronym ĐÓ:** nghề nghiệp/đời thường (HR, FTP) → hệ VN ("hát-rờ", "ép-tê-pê"); tech thuần dev (API/MCP/NPM) → hệ Anh ("ây-pi-ai", "em-xi-pi"). Không chắc → hỏi, đừng mặc định hệ Anh.
- **UI/design term → Việt hóa hết** (icon→biểu tượng, font→phông chữ, layout→bố cục...). Audio Việt cho êm, display vẫn English.

## Quy trình

1. Thử LITERAL English trước → whisper sai nhiều thì mới chuyển phonetic-Việt-của-âm-English. Pipeline per-beat nên fix 1 beat rất rẻ ([[feedback_tts_per_beat_pipeline]]).
2. Audit từng tech term theo bảng trước khi gửi script cho TTS.
3. Verify whisper diff post-TTS — **nhưng whisper VN không reliable cho tech term**, ưu tiên tai user.

Liên quan: [[feedback_tts_pronunciation_pitfalls]] · [[feedback_caption_phonetic_display]] · [[reference_truyen_ky_it_skill]]
