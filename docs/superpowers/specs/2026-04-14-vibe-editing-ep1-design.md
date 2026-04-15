# Vibe Editing — Ep1: Setup & Lệnh Đầu Tiên

**Date:** 2026-04-14
**Status:** Design approved, ready for implementation planning
**Series:** Vibe Editing (4 tập, Ep1 of 4)
**Format:** Portrait 1080×1920, ~4-5 phút, YouTube-leaning (reup TikTok ngắn sau)
**Style lock:** kế thừa intro 51s — paper cream `#F3EAD8` + thầy giáo người que blue shirt + ink stroke `#1A1820`
**Voice:** EverAI `vi_male_minhkhang_mb` @ 1.0x — **PHẢI match intro**, KHÔNG đổi sang giọng khác
**Vibe / persona:** **"CHỒNG nói với VỢ"** — tự xưng `chồng`/`anh`, gọi viewer là `vợ`/`các vợ`. Tone: flirty-protective-big-brother, tự tin, hơi cocky, nuông chiều. **KHÔNG** dùng `tao/mày` (rough) hay `mình/bạn` (generic).
**Phonetic VN cho TTS** (EverAI đọc tiếng Anh kém): `vibe editing` → `vai bờ ê đít tinh`; `framework` → `phrây uốc`; `API` → `ây pi i`; `AI` → `ây ai`; `API key` → `ây pi i ki`; `.env` → `chấm i en vi`; `npm` → `en pi em`; `pip` → `pi pi`; `MP4` → `em pi bốn`; `github.com` → `github chấm com`; `Canva` → `Can va`.
**Music:** nhạc nhẹ lofi/acoustic, volume ~0.08, fade in/out

---

## 1. Mục tiêu video

Dạy viewer zero-to-first-video:

1. Hiểu OpenMontage / Vibe Editing là gì (instruction-driven video, AI viết code + Remotion render)
2. Biết chọn AI agent nào (recommend Claude Code + Codex, mention alt)
3. Biết cách clone repo + install + setup `.env` API keys
4. Chạy được 1 lệnh đầu tiên ra video thật

**Success criteria:** viewer xem xong có thể clone repo bro và ra được 1 video đầu tiên trong 15 phút.

---

## 2. Beat sheet (8 beats, ~4min 40s)

| # | Time | Beat name | Narration VN | Visual | Asset type |
|---|------|-----------|--------------|--------|-----------|
| 1 | 0–16s | **HOOK mạnh** | "Các vợ ơi. Ai còn ngồi edit 3 tiếng cho một cái video 30 giây thì lại đây chồng bày. Chồng làm video chỉ bằng miệng. Không Premiere, không After Effects, không Can va. Tập một bắt đầu rồi nha các vợ." | Cold open: mascot đứng chỉ tay ra ngoài màn như "Ê, vợ!". Sau 2s chia đôi: **VỢ HAY LÀM** (icon editor + đồng hồ xoay 3:00:00) / **CHỒNG LÀM** (icon terminal + 1 dòng lệnh + mũi tên → MP4). Red X đè lên cột trái. | Remotion fake |
| 2 | 16–48s | **Vai bờ ê đít tinh là gì** | "Nhắc lại cho vợ nào chưa xem intro. Cái này gọi là vai bờ ê đít tinh. Không phải phần mềm, mà là một cái repo code. Ây ai đọc lệnh tự nhiên của vợ, nó tự viết code, Remotion render ra video. Vợ không cần biết code — chỉ cần biết mô tả thôi là xong. Toàn đồ open source và ây pi i có sẵn, chồng chỉ lắp ráp lại cho vợ xài thôi." | Sơ đồ 3 ô ngang: `VỢ NÓI` → `ÂY AI VIẾT CODE` → `EM PI BỐN`. Arrow động. Dưới: sticker "Built on" row logo: **Remotion · Claude · Codex · EverAI · FAL · Piper · FFmpeg**. Mascot đứng cạnh chỉ vào sticker. | Remotion fake |
| 3 | 48–88s | **Chọn ây ai nào** | "Giờ vợ chọn ây ai nào làm cho mình. Có nhiều thằng — chồng kể: Claude Code, Codex, Cursor, Aider, Continue, Gemini CLI. Chồng khuyên 2 thằng thôi: Claude Code và Codex. Hai thằng này hiểu repo lớn, gọi tool ổn, ít ảo tưởng. Vợ nào mới bắt đầu thì chọn một trong hai đi nha. Tập này chồng xài Claude Code cho vợ xem." | Bảng 6 ô AI agent. 2 ô đầu (Claude Code, Codex) có ⭐ vàng glow + sticker "CHỒNG CHỌN". 4 ô sau (Cursor, Aider, Continue, Gemini CLI) mờ 60%. Mascot chỉ tay vào Claude Code, wink. | Remotion fake |
| 4 | 88–148s | **Clone + install** | "Bước một cho vợ: trước khi clone, máy vợ cần có sẵn ba thứ — git, nốt jây es, và ép ép em peg. Ba cái này là nền, không có thì đừng nói chuyện. Có rồi thì clone repo của chồng về. Chồng đã fork từ bản gốc, thêm vài tool cho tiện làm tiếng Việt. Link để ở mô tả video nha vợ. Clone xong chạy pi pi install chấm -r requirements chấm txt. Rồi vào thư mục remotion composer chạy en pi em install. Xong. Repo của chồng là ăn sẵn — requirements đã có đủ mọi tool Claude cần dùng, vợ không phải cài tay từng cái." | Paper terminal gõ 3 lệnh: `git clone https://github.com/tanncsn00/AI-Editer.git` → `cd AI-Editer && pip install -r requirements.txt` → `cd remotion-composer && npm install`. Bên trên terminal: 3 icon prerequisite "CẦN SẴN" — **Git · Node.js · FFmpeg**. Card góc phải: "Fork từ: calesthio/OpenMontage ♥". Dưới requirements install: sticker "ĐÃ GÓI SẴN: yt-dlp · faster-whisper · opencv · ... — không phải cài thêm" | Remotion fake |
| 5 | 150–200s | **Chấm i en vi + API key** | "Bước hai: mở file chấm i en vi, paste ây pi i ki. Chồng cần đúng hai cái cho vợ: FAL cho ảnh và video ây ai, EverAI cho giọng tiếng Việt. Thêm một cái free cho footage: Pexels hoặc Pixabay. Mấy cái khác có thì paste vô, không có cũng chạy. Đơn giản vậy thôi." | Card `.env` paper show các dòng. Sticker đỏ "VỢ CẦN" trên 3 dòng: `FAL_KEY`, `EVERAI_API_KEY`, `PEXELS_API_KEY`. Sticker xanh "CÓ CŨNG ĐƯỢC" trên các dòng còn lại mờ hơn. Mascot cầm 3 chìa khoá vàng (required). | Remotion fake |
| 6 | 200–262s | **Lệnh đầu tiên — REAL CLIP** | "Bước ba — phần vui nhất. Vợ mở Claude Code lên, gõ câu tự nhiên như nói chuyện với chồng. Ví dụ chồng nè: 'làm cho anh video reup từ cái link TikTok này sang tiếng Việt, cho chồng duyệt kịch bản trước khi lồng tiếng'. Xong. Nó tự tải video, transcribe, dịch, gọi EverAI lồng tiếng, thêm sub Remotion, render ra em pi bốn. Vợ không đụng dòng code nào hết." | **[BRO QUAY]** screen recording 30-45s: mở Claude Code, gõ prompt, nhấn Enter, tool calls scrolling, kết thúc "final.mp4 saved". Mình speed-up 2-3x + overlay highlight tool call name + add typing sound fx. | Real clip |
| 7 | 262–294s | **Kết quả** | "Đây các vợ. Bốn phút sau ra video. Có giọng đọc tiếng Việt, có sub chữ nhảy theo lời, có nhạc nền, sạch logo watermark. Từ một câu lệnh thôi đấy. Vợ thấy chồng chiều vợ chưa nào." | **[BRO QUAY]** screen recording 8-10s: double-click file mp4, player mở, play 5-7s. Mình overlay sticker corner: "FILE: final.mp4 · 10s · 3.8MB". Mascot giơ ngón cái + heart pop. | Real clip |
| 8 | 294–360s | **Teaser đồ chơi + Outro** | "Tập một chồng mới show cho vợ xem một mẩu bé tí thôi. Trong repo này còn nguyên cả kho đồ chơi chồng chưa kịp khoe: Veo 3 của Google để gen video ây ai chuẩn xi nê ma, Kling với MiniMax cho video động phong cách khác nhau, Runway Gen 4 cho hiệu ứng cinematic, HeyGen với Wav2Lip cho avatar người nói chuyện lip sync, FLUX với Imagen cho ảnh, Suno gen nhạc có lời ra cả bài hát, rồi còn green screen tự động, auto reframe ngang dọc, cắt đoạn im lặng tự động... Kể không xuể. Tập hai tuần sau chồng dạy vợ cách ra lệnh cho chuẩn để moi hết mấy món này ra xài. Follow chồng đi các vợ. Chồng yêu các vợ." | Card fullscreen: grid 3×3 icon đồ chơi chưa khám phá — **Veo 3 · Kling · Runway · HeyGen · FLUX · Imagen · Suno · Auto-reframe · Green screen**. Mỗi icon pulse nhẹ theo nhịp narration. Cuối card: "Ep2 · Tuần sau · Ra lệnh chuẩn" pulse + mascot vẫy tay to + heart bay. Credit nhỏ dưới chân: "Based on calesthio/OpenMontage ♥" — không cần đọc URL. | Remotion fake |

**Tổng:** ~5min 50s (350s). Vẫn dưới 6min. Nếu muốn rút về <5min: cắt beat 1 còn 10s + beat 3 còn 30s + beat 8 còn 30s → về ~4min 55s.

---

## 3. Assets cần chuẩn bị

### 3A. Recording bro tự quay (2 clip)

**Clip 1 — Terminal chạy lệnh (Beat 6):**
- **Thời lượng raw:** 30-60s (mình sẽ speed-up)
- **Flow:**
  1. Mở Claude Code CLI hoặc IDE extension (bro chọn cái nào đẹp hơn)
  2. Gõ prompt: `làm cho tao video reup từ link này sang tiếng Việt: https://www.xiaohongshu.com/explore/69d63f3f00000000210046f3` (hoặc link khác mà bro đã test chạy được)
  3. Enter → để claude work, tool calls cuộn
  4. Đợi đến khi có message "video saved at projects/xxx/final.mp4"
- **Setting quay:** full screen window, font terminal to (14-16pt), tắt notification, background tối (dark theme IDE càng nhìn code rõ)
- **Format output:** mp4, 1080p hoặc cao hơn, 30fps ổn

**Clip 2 — Play file output (Beat 7):**
- **Thời lượng raw:** 10-15s
- **Flow:**
  1. Mở File Explorer đến `projects/xxx/`
  2. Double-click file `final.mp4` (hoặc kéo vào VLC / Windows Media Player)
  3. Video phát → để ~5s
- **Setting:** có thể quay cả Explorer (đẹp) hoặc chỉ player (đơn giản). Bro quyết.

**Nộp format:** mp4 hoặc mkv bất kỳ, mình re-encode. Gửi path khi quay xong.

### 3B. Assets mình tự dựng (Remotion)

- **Thầy giáo người que** — đã có sẵn từ intro, reuse component
- **Fake terminal paper-style** — build mới, kiểu ASCII typewriter trên nền paper cream. Support:
  - Gõ lệnh animated (char-by-char)
  - Progress bar paper-style cho `pip install` / `npm install`
  - Output block colored
- **`.env` card** — paper card 6 dòng, sticker BẮT BUỘC/OPTIONAL
- **AI agent grid** — 6 ô, 2 ô highlighted
- **CTA card** — GitHub URL + QR code + logo row + outro text
- **Music bed** — lofi acoustic, Pixabay search "acoustic vlog loop"

---

## 4. Script — narration VN cuối cùng (persona "chồng nói với vợ")

> **[Beat 1, 0–16s · HOOK]** Các vợ ơi. Ai còn ngồi edit ba tiếng cho một cái video ba mươi giây thì lại đây chồng bày. Chồng làm video chỉ bằng miệng. Không Premiere, không After Effects, không Can va. Tập một bắt đầu rồi nha các vợ.
>
> **[Beat 2, 16–48s · LÀ GÌ]** Nhắc lại cho vợ nào chưa xem intro. Cái này gọi là vai bờ ê đít tinh. Không phải phần mềm, mà là một cái repo code. Ây ai đọc lệnh tự nhiên của vợ, nó tự viết code, Remotion render ra video. Vợ không cần biết code — chỉ cần biết mô tả thôi là xong. Toàn đồ open source và ây pi i có sẵn, chồng chỉ lắp ráp lại cho vợ xài thôi.
>
> **[Beat 3, 48–88s · CHỌN AI]** Giờ vợ chọn ây ai nào làm cho mình. Có nhiều thằng — chồng kể: Claude Code, Codex, Cursor, Aider, Continue, Gemini CLI. Chồng khuyên hai thằng thôi — Claude Code và Codex. Hai thằng này hiểu repo lớn, gọi tool ổn, ít ảo tưởng. Vợ nào mới bắt đầu thì chọn một trong hai đi nha. Tập này chồng xài Claude Code cho vợ xem.
>
> **[Beat 4, 88–148s · CLONE]** Bước một cho vợ: trước khi clone, máy vợ cần có sẵn ba thứ — git, nốt jây es, và ép ép em peg. Ba cái này là nền, không có thì đừng nói chuyện. Có rồi thì clone repo của chồng về. Chồng đã fork từ bản gốc, thêm vài tool cho tiện làm tiếng Việt. Link để ở mô tả video nha vợ. Clone xong chạy pi pi install chấm -r requirements chấm txt. Rồi vào thư mục remotion composer chạy en pi em install. Xong. Repo của chồng là ăn sẵn — requirements đã có đủ mọi tool Claude cần dùng, vợ không phải cài tay từng cái.
>
> **[Beat 5, 150–200s · ENV]** Bước hai: mở file chấm i en vi, paste ây pi i ki. Chồng cần đúng hai cái cho vợ — FAL cho ảnh và video ây ai, EverAI cho giọng tiếng Việt. Thêm một cái free cho footage — Pexels hoặc Pixabay. Mấy cái khác có thì paste vô, không có cũng chạy. Đơn giản vậy thôi.
>
> **[Beat 6, 200–262s · LỆNH ĐẦU]**
 Bước ba — phần vui nhất. Vợ mở Claude Code lên, gõ câu tự nhiên như nói chuyện với chồng. Ví dụ chồng nè: *làm cho anh video reup từ cái link TikTok này sang tiếng Việt, cho chồng duyệt kịch bản trước khi lồng tiếng*. Xong. Nó tự tải video, transcribe, dịch, gọi EverAI lồng tiếng, thêm sub Remotion, render ra em pi bốn. Vợ không đụng dòng code nào hết.
>
> **[Beat 7, 262–294s · KẾT QUẢ]** Đây các vợ. Bốn phút sau ra video. Có giọng đọc tiếng Việt, có sub chữ nhảy theo lời, có nhạc nền, sạch logo watermark. Từ một câu lệnh thôi đấy. Vợ thấy chồng chiều vợ chưa nào.
>
> **[Beat 8, 294–360s · OUTRO]** Tập một chồng mới show cho vợ xem một mẩu bé tí thôi. Trong repo này còn nguyên cả kho đồ chơi chồng chưa kịp khoe — Veo 3 của Google để gen video ây ai chuẩn xi nê ma, Kling với MiniMax cho video động nhiều phong cách, Runway Gen bốn cho hiệu ứng cinematic, HeyGen với Wav2Lip cho avatar nói chuyện lip sync, FLUX với Imagen gen ảnh, Suno gen nhạc có lời ra cả bài hát, rồi còn green screen tự động, auto reframe ngang dọc, cắt đoạn im lặng tự động. Kể không xuể. Tập hai tuần sau chồng dạy vợ cách ra lệnh cho chuẩn để moi hết mấy món này ra xài. Follow chồng đi các vợ. Chồng yêu các vợ.

**Word count:** ~530 từ VN, duration estimate với `vi_male_minhkhang_mb` @ 1.0x: ~5min 10s. Có thể ra ~6min sau silence pauses. Nếu cần gọn hơn thì cắt bớt list đồ chơi ở beat 8 (giữ 4-5 item nổi bật nhất thay vì 9).

---

## 5. Ghi chú kỹ thuật

- **Background music:** lofi acoustic Pixabay, process qua `ffmpeg -af "lowpass=f=4000,volume=0.08"` để không át voice
- **Voice processing:** EverAI output MP3 → `ffmpeg -af "volume=0.85"` → mix với music
- **Timing sync:** sau TTS chạy `faster-whisper small` với `word_timestamps=True` + `initial_prompt=<script>` → override word text bằng script gốc (per memory rule VN whisper sai) → save `vibe_ep1_words.json`
- **Caption style:** **dùng `reference_social_caption_style.md`** (Remotion bottom, Be Vietnam Pro, spring reveal, #F4B860 highlight) — không phải Tịnh Đạo center
- **Big word drops:** KHÔNG dùng (đây là tutorial, không phải philosophical)
- **Hành vi Remotion composition:** 1 composition mới `VibeEditingEp1` ở Root.tsx, 1080×1920 @30fps, duration = 30 * ceil(audio_duration + 2)

---

## 6. Deliverables (theo memory `feedback_general_deliverables.md`)

Phải có đủ 3 output, verify trước khi báo done:

1. **`projects/vibe-editing-ep1/final.mp4`** — video render cuối
2. **`projects/vibe-editing-ep1/thumbnail.png`** — designed 1080×1920, không phải frame extract. Style: mascot cầm laptop + text "EP1 · SETUP · AI LÀM VIDEO" + paper background
3. **`projects/vibe-editing-ep1/caption.md`** — mô tả + hashtag + handle + link repo

---

## 7. Rules áp dụng từ memory

- ✅ **feedback_general_approve_script**: script duyệt xong mới render — bước này đang làm
- ✅ **feedback_general_deliverables**: mp4 + thumbnail + caption.md
- ✅ **feedback_caption_whisper_verify**: forced-align + diff whisper vs script, fix VN mis-spellings
- ✅ **feedback_tts_vn_short_syllables**: tránh từ VN đơn âm lạc lõng, đã check script sạch
- ✅ **reference_social_caption_style**: Remotion + Be Vietnam Pro + spring reveal (không ASS, không Tịnh Đạo)
- ❌ **feedback_general_no_tap_label**: SERIES có tập nhưng KHÔNG show "TẬP 1" label to. Dùng `EP1` nhỏ trong thumbnail + mention trong narration thôi, không đặt big-word

---

## 8. Next actions

1. Bro confirm design này (pass) hoặc yêu cầu chỉnh
2. Bro record 2 clip raw (terminal + player), gửi path
3. Song song mình build Remotion composition + TTS + asset
4. Ghép clip real vào đúng beat 6 & 7, render final
5. Design thumbnail + viết caption.md
6. QC → ship
