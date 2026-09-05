---
name: feedback_tts_pronunciation_pitfalls
description: "Catalog lỗi phát âm EverAI TTS (nuốt chữ, lắp chữ, rớt dấu, đọc sai English) + cách fix và verify"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fc965a61-9035-42e6-9240-c57856fe47a1
  modified: 2026-08-25T09:20:00.000Z
---

Catalog các lỗi EverAI TTS đã bắt được trong production + cách fix. Sửa ở `text_phonetic`, GIỮ nguyên `text_display` ([[feedback_caption_phonetic_display]]).

## ⚡ Speed = 1.0 (chốt 2026-08-14 — xem [[feedback_tts_speed_1x]])
Trước đây là 0.95; giờ mặc định **1.0** để giọng bắt nhịp nhạc nền. Đổi lại là nuốt chữ nhiều hơn — **KHÔNG hạ speed để chữa**, chống bằng BUFFER chữ + TTS per-beat ([[feedback_tts_per_beat_pipeline]]).

## Đọc sai English
⚠️ Luật hiện hành là **RULE TỐI THƯỢNG** ở [[feedback_tts_tech_phonetic]]: đọc ÂM tiếng Anh, **CẤM dịch nghĩa sang tiếng Việt**.
- **bug → "bấc" / "bức"** (âm English). ❌ **KHÔNG dịch thành "lỗi"** — luật "bug→lỗi" từ 2026-06-19 đã bị user bác 2026-07-06 (chửi 2 lần). Display giữ "BUG".
- **edge case**: phonetic "ét giơ kêi sờ"/"ép giơ kêi" đều vỡ ("SZKS"/"S-Case"). Thử **literal English "edge case"** trước (EverAI đọc cụm English tech phổ biến sạch); vỡ nữa mới hạ xuống "trường hợp biên". Display luôn giữ "EDGE CASE".
- Đọc CHUẨN với phonetic, không cần đổi: production→"pờ rô đắc sần", Rollback→"rôn béc", Monitoring→"mo ni tơ ring", Alert→"a lớt", Regression→"ri grét sần", commit→"com mít", log→"lốc", checkbox→"chéc bốc", Unit Test→"diu nít tét", release literal. Từ điển đầy đủ: [[feedback_tts_tech_phonetic]].

## Lắp chữ (lặp/nhân đôi âm)
Xảy ra ở chữ đơn đầu câu sau dấu chấm ("Khi"→"khinh khi") hoặc nuốt-đổi phụ âm ("Dự"→"giữ").
- Đổi "Khi X" → "**Thời mà** X".
- Thêm "là" để tách: "phải Dự Kiếp Thuật" → "phải **là** Dự Kiếp Thuật".

## Nuốt chữ / nuốt cụm
- **Chữ đơn ngắn CUỐI mệnh đề trước "."**: "dòng tiền. Rồi định giá" → "dòng định giá". Fix: thêm đuôi ("dòng tiền" → "dòng tiền **mặt**") hoặc đổi từ nối mở đầu mạnh phụ âm ("Rồi" → "Đến/Từ/Sau đó").
- **Cụm 2-3 chữ giữa 2 câu hoặc ngay sau "?"** (2026-07-02 sales-dao): "Bao nhiêu tiền? Ta báo giá" → nghe "Bao nhiêu báo giá". Fix: chèn buffer — "Bao nhiêu tiền **vậy**? Ta **bèn** báo giá" · "Bắt tay ta **thật chặt**. Rồi **mới** nói".
- **Script staccato dày** (nhiều câu 1-2 chữ ngắt liên tục + term phonetic) → rụt/nuốt âm hàng loạt (2026-07-01 designer-vs-fe: "nuốt chữ nhiều lắm thề").

## Rớt dấu thanh ở âm tiết ngắn
Voice `vi_male_ductrong_mb` / `vi_male_minhtriet_mb` rớt dấu trên âm tiết ngắn đọc nhanh: "để **ý**" → "để y", "không **ờ**" → "không o" (Cô Độc).
- Tránh âm tiết đơn ngắn ("ý", "ờ", "ạ", "ừ") ở vị trí câu chảy nhanh.
- Dùng bản đa âm tiết: "nhận ra" thay "để ý", "đồng ý" thay "ý", "rồi à" thay "à".

## Voice lehoang nuốt "nghìn"
`vi_male_lehoang_mb` nuốt "nghìn" trong chuỗi `một nghìn một trăm` → "một một trăm". Trigger là chuỗi `một X một`.
- ✗ "một nghìn một trăm" · ✗ "1.100" · ✗ "hơn một nghìn" (→ "hơn 1.000")
- ✓ **"một nghìn, một trăm"** (thêm dấu phẩy) · ✓ "một ngàn một trăm" (giọng Nam)
- Cùng luật cho năm: "hai nghìn, không trăm hai mươi tư" (2024).

## Phụ âm cuối bị nuốt khi trùng phụ âm đầu chữ sau (gemination)
Phát hiện 2026-08-25 (mat-ngon-bang-huu, voice Adam): **"Đệ tam mật ngôn" → nghe "Đệ TA mật ngôn"** — chữ `tam` mất hẳn phụ âm cuối /m/ vì chữ sau (`mật`) cũng mở đầu bằng /m/. Tái hiện y hệt qua **2 lần gen độc lập** → lỗi hệ thống, không phải nhiễu ngẫu nhiên. Quyển I cùng cụm này lại đọc đúng, nên đừng cho rằng "lần trước chạy được là an toàn".
- Fix: **chèn dấu phẩy tách hai âm** — `"Đệ tam, mật ngôn."`. Sửa 1 lần là hết.
- Cùng luật cho mọi cặp trùng phụ âm giáp ranh: `tam`+`mật`, `năm`+`mươi`, `ngàn`+`nghìn`…
- Display giữ nguyên `ĐỆ TAM MẬT NGÔN`.

## 🔬 Test phân biệt: lỗi AUDIO hay lỗi whisper?
Khi whisper ghi sai một chữ mà tai không nghe được, **transcribe lại đúng file đó 2 lần** — một lần không prompt, một lần có `initial_prompt` chứa từ vựng đúng:
```python
m.transcribe(mp3, language="vi", beam_size=5, condition_on_previous_text=False,
             initial_prompt="bằng hữu, tông môn, mật ngôn")
```
- **Có prompt thì ra đúng, không prompt thì sai** → âm vị CÓ trong audio, chỉ là phát âm mờ ranh giới; language-model của whisper mới là bên quyết định. Lỗi nhẹ — nhưng nếu là chữ chủ đề của video thì vẫn nên re-gen.
- **Cả hai đều sai** → lỗi audio thật, phải sửa `text_phonetic` rồi re-TTS.
- Bổ sung: đo `volumedetect` ở đúng cửa sổ thời gian của token lạ. Mean thấp hơn vùng thoại kề bên ~5 dB = tiếng thở/đuôi âm, không phải chữ thật.

## EverAI KHÔNG deterministic — re-gen là cách chữa hợp lệ
Cùng `text_phonetic`, gen lại cho ra audio khác. Beat "Bằng hữu…" sai ở 3 lần gen đầu, **lần thứ 4 ra đúng** mà không đổi một chữ nào. Với pipeline per-beat, re-gen 1 beat rất rẻ → gặp lỗi biên (borderline) thì cứ gen lại vài lần trước khi đi bẻ phonetic.

## ⚠️ Verify — whisper KHÔNG đủ
- **BẮT BUỘC quét DUP:** sau TTS chạy whisper `condition_on_previous_text=False`, quét 2 token chuẩn-hoá giống nhau liền nhau, per-segment. NONE = sạch lắp.
- **NHƯNG whisper KHÔNG bắt được nuốt/rụt** — nó "đoán" ra chữ đúng dù voice mumble. Whisper sạch ≠ tai nghe sạch.
- Với script staccato/POV: phải **ISOLATE-transcribe** vùng nghi (cắt clip ffmpeg riêng, no `initial_prompt`) rồi so từng câu ngắn xem có mất cụm không. Bước này bắt buộc.
- Rớt dấu thì whisper CÓ bắt được (transcript hiện chữ mất dấu ở vị trí script có dấu) → đây là lỗi AUDIO, fix = sửa script + re-TTS, không phải re-align.

Liên quan: [[feedback_tts_tech_phonetic]] · [[feedback_tts_per_beat_pipeline]] · [[feedback_caption_whisper_verify]] · [[feedback_sync_voice_workflow]]
