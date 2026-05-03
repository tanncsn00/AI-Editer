# Vibe Editing — Ep2: Cài Đặt Chuẩn Cho Người Non-Tech

**Date:** 2026-04-29
**Status:** Design draft — pending user approval
**Series:** Vibe Editing (Ep2 of 4)
**Format:** **Slide carousel TikTok/FB** (13 slide PNG 1080×1920) + recap reel 60–90s
**Style lock:** kế thừa Ep1 — paper cream `#F3EAD8` + thầy giáo người que blue shirt + ink stroke `#1A1820`
**Voice:** EverAI `vi_male_minhkhang_mb` @ 1.0x — match Ep1 (chỉ dùng cho recap reel)
**Persona:** "CHỒNG nói với VỢ" — flirty-protective-big-brother, kiên nhẫn dắt từng bước
**Phonetic VN cho TTS:** kế thừa Ep1 (`vai bờ ê đít tinh`, `phrây uốc`, `ây pi i`, `ây ai`, `chấm i en vi`, `en pi em`, `pi pi`, `em pi bốn`, `github chấm com`, `ép ép em peg`, `nốt jây es`)
**Music:** lofi acoustic, volume ~0.08

---

## 1. Mục tiêu

Giải lỗ hổng từ Ep1: viewer non-tech xem Ep1 vẫn không cài được vì Ep1 chỉ nói lướt "cần git, node, ffmpeg". Ep2 cầm tay từng bước.

**Output không phải video screen-recording dài** — là **bộ slide post TikTok/FB** + recap reel ngắn. Lý do:
- Tutorial cài đặt = viewer cần PIN slide để xem lại từng bước
- Slide carousel có save rate cao hơn video dài
- Ít chi phí render, không cần quay screen từng tool

**Success criteria:** viewer non-tech xem slide xong mở web browser cài được Git/Node/FFmpeg/Python + chọn AI IDE + clone repo + chạy được composition đầu tiên.

---

## 2. Format chi tiết

### 2A. Bộ slide post (output chính)

- **13 slide PNG 1080×1920** export từ Remotion (mỗi slide là 1 frame)
- Style giữ nguyên Ep1: paper cream + mascot + ink stroke
- Mỗi slide tự đứng độc lập (không animation) — viewer scroll như đọc carousel
- File output: `projects/vibe-editing-ep2/slides/01.png` … `13.png`

### 2B. Recap reel 60–90s (output phụ)

- Ghép 13 slide thành mp4, mỗi slide ~5s
- Mascot lướt qua từng slide với voice-over recap nhanh
- Mục đích: thả lên Reel/Short để dẫn traffic về post slide đầy đủ
- File output: `projects/vibe-editing-ep2/recap.mp4`

### 2C. KHÔNG có

- ❌ KHÔNG quay screen recording cài từng tool (như user yêu cầu — "ngáo")
- ❌ KHÔNG demo cài Git/Node/Python từng bước trong video — chỉ ghi link tải + 1 dòng note "Next-Next-Next"
- ❌ KHÔNG cover Linux

---

## 3. Cấu trúc bộ 13 slide

| # | Slide | Title | Nội dung chính | Visual |
|---|-------|-------|-----------------|--------|
| 1 | **COVER** | "CÀI VAI BỜ ÊĐÍT TINH TỪ SỐ 0" | Subtitle "Máy trắng tinh — ra video. Không bỏ bước nào." + EP2 badge nhỏ | Mascot cầm laptop + paper cream BG + ink frame |
| 2 | **CHECKLIST** | "VỢ CẦN 6 THỨ" | List 6 thứ: 1️⃣ Git · 2️⃣ Node.js · 3️⃣ FFmpeg · 4️⃣ Python · 5️⃣ AI IDE · 6️⃣ API Keys | Mascot tích từng ô + 6 icon row |
| 3 | **OS** | "WINDOWS hay MAC?" | 2 cột: Win dùng `winget` / Mac dùng `brew`. Cả 2 dùng terminal verify giống nhau | 2 logo OS song song + arrow |
| 4 | **GIT** | "1️⃣ GIT" | URL `git-scm.com` + "Tải xong: Next → Next → Done" + verify `git --version` (paper terminal) | Logo Git + URL card + checkmark |
| 5 | **NODE.JS** | "2️⃣ NODE.JS" | URL `nodejs.org` + "Chọn bản LTS" + verify `node -v` & `npm -v` | Logo Node + URL card + LTS sticker đỏ |
| 6 | **FFMPEG** | "3️⃣ FFMPEG" | Win: `winget install ffmpeg` (1 lệnh). Mac: `brew install ffmpeg`. Verify `ffmpeg -version` | Logo FFmpeg + 2 cột Win/Mac |
| 7 | **PYTHON** | "4️⃣ PYTHON" | URL `python.org` + ⚠️ **TÍCH ô "Add Python to PATH"** (đỏ to highlight) + verify `python --version` | Logo Python + screenshot fake checkbox với arrow đỏ to |
| 8 | **AI IDE** | "5️⃣ CHỌN AI IDE" | Bảng 4 ô: Claude Code (CLI, $20/m, ⭐ recommend) / Cursor (IDE, $20/m) / Antigravity (Google, **FREE giới hạn token**) / Codex (CLI, free tier). Mỗi ô: tên + link tải + giá + 1 dòng pro | 4 ô paper-card |
| 9 | **CLONE REPO** | "6️⃣ CLONE REPO" | 3 lệnh: `git clone https://github.com/calesthio/OpenMontage.git` → `cd OpenMontage && pip install -r requirements.txt` → `cd remotion-composer && npm install`. Note "Based on calesthio/OpenMontage ♥" | Paper terminal 3 dòng + repo URL highlight |
| 10 | **API KEYS** | "7️⃣ API KEYS" | Card `.env`: 3 dòng VỢ CẦN — `FAL_KEY` (fal.ai/dashboard) / `EVERAI_API_KEY` (everai.vn) / `PEXELS_API_KEY` (pexels.com/api). 1 dòng note: "mở `.env.example` → đổi tên thành `.env`" | `.env` paper card + 3 chìa khoá vàng |
| 11 | **TEST CHẠY** | "TEST 1 LỆNH" | "Mở AI IDE — gõ: *render giúp anh composition VibeEditingIntro trong remotion-composer*" + "Đợi ~1 phút — ra mp4 intro 51s. Xong cài." (Note: intro chính của series — viewer chạy ra cái họ đã xem ở Ep1) | Mascot giơ ngón cái + paper terminal mock |
| 12 | **TROUBLESHOOT** | "KẸT? COI ĐÂY" | 3 lỗi phổ biến: (1) `ffmpeg: command not found` → restart terminal hoặc add PATH thủ công. (2) `python is not recognized` → cài lại + tích PATH. (3) `npm install fail node-gyp` → cài Visual Studio Build Tools (Win) hoặc `xcode-select --install` (Mac) | Paper warning card 3 ô đỏ |
| 13 | **OUTRO** | "FOLLOW CHỒNG" | "Lưu post này vợ ơi. Ep3 chồng dạy CÁCH RA LỆNH CHUẨN — moi hết kho đồ chơi (Veo 3, Kling, FLUX, Suno…)" + handle `@vibeediting` (placeholder) | Mascot wink + heart pop + Ep3 teaser pulse |

---

## 4. Recap reel 60–90s — script

| Slide ref | Time | Voice-over VN |
|-----------|------|----------------|
| 1 | 0–5s | "Vợ ơi — tập 2 chồng dạy cài vai bờ ê đít tinh từ số 0." |
| 2 | 5–10s | "Sáu thứ thôi: git, nốt, ép ép, python, ây ai, ây pi i ki." |
| 3 | 10–14s | "Win xài winget. Mac xài brew. Cả hai chồng đều bày." |
| 4 | 14–19s | "Một — git. Vào git chấm es si em chấm com tải về. Next next next." |
| 5 | 19–24s | "Hai — nốt jây es. Vào nốt jây es chấm o ơ gờ. Chọn bản LTS." |
| 6 | 24–29s | "Ba — ép ép em peg. Win gõ winget install ffmpeg. Mac gõ brew install ffmpeg." |
| 7 | 29–35s | "Bốn — python chấm o ơ gờ. Quan trọng — phải tích ô Add Python to PATH. Không tích là chết." |
| 8 | 35–43s | "Năm — chọn ây ai. Bốn thằng: Claude Code, Cursor, Antigravity miễn phí, Codex. Vợ chọn một." |
| 9 | 43–53s | "Sáu — clone repo. Git clone github của calesthio. Pi pi install. En pi em install. Xong." |
| 10 | 53–62s | "Bảy — paste ây pi i ki: FAL, EverAI, Pexels. Ba cái thôi vợ ơi." |
| 11 | 62–70s | "Test một lệnh: render composition vai bờ ê đít tinh i tờ rô. Một phút ra em pi bốn." |
| 12 | 70–78s | "Kẹt? Slide 12 chồng để sẵn ba lỗi hay gặp." |
| 13 | 78–88s | "Lưu post chồng pin. Ep3 — ra lệnh chuẩn. Follow chồng đi các vợ." |

**Tổng:** ~88s. EverAI 1.0x estimate ~85–95s. Trong giới hạn reel (≤90s là tốt).

---

## 5. Assets

### 5A. Asset cần tạo mới

- **`SlideEp2.tsx`** — Remotion composition export từng frame ra PNG. 13 frame static (không animation), mỗi frame 1 slide.
- **`Ep2RecapReel.tsx`** — Remotion composition cho mp4 recap. Reuse asset của `SlideEp2.tsx` + voice-over + nhạc nền.
- **Mascot SVG** — đã có từ Ep1, reuse component
- **Logo components** — 8 logo cần draw paper-style (không dùng raster): Git, Node.js, FFmpeg, Python, Claude Code, Cursor, Antigravity, Codex. Hand-draw paper-style ink stroke matching Ep1.
- **Paper terminal component** — đã có từ Ep1 (`PaperTerminal.tsx`?), reuse
- **Voice-over MP3** — chạy `run_tts_ep2.py` qua EverAI với phonetic dictionary

### 5B. Asset reuse từ Ep1

- Mascot thầy giáo người que (full body + face poses)
- Paper cream background `#F3EAD8`
- Ink stroke style + frame
- Color palette (cream + ink + accent gold `#F4B860` + danger red)
- Font stack: Be Vietnam Pro 500/800 + Caveat (handwritten accent)

### 5C. KHÔNG cần

- Không screen recording
- Không thumbnail riêng cho từng slide (slide 1 = cover = dùng làm thumbnail)
- Không big-word drops

---

## 6. Deliverables (theo memory `feedback_general_deliverables.md`)

Trong `projects/vibe-editing-ep2/`:

1. **`slides/01.png` … `13.png`** — bộ slide carousel 1080×1920 PNG
2. **`recap.mp4`** — reel 60–90s với voice-over + nhạc nền
3. **`thumbnail.png`** — `slides/01.png` chính là cover/thumbnail (designed, không phải frame extract)
4. **`caption.md`** — caption TikTok/FB + hashtag + handle + chú thích từng slide

**Caption layout:**

```
🔧 CÀI VAI BỜ ÊĐÍT TINH TỪ SỐ 0 — EP2

Có vợ nhắn chồng — Ep1 nói clone là clone kiểu gì?
Tập này chồng cài lại từ máy trắng tinh.

Lưu post này lại vợ ơi. 13 slide đủ bộ.

📌 6 thứ phải cài:
1️⃣ Git → git-scm.com
2️⃣ Node.js → nodejs.org (LTS)
3️⃣ FFmpeg → winget install ffmpeg
4️⃣ Python → python.org (TÍCH PATH!)
5️⃣ AI IDE → Claude Code / Cursor / Antigravity / Codex
6️⃣ API Keys → FAL + EverAI + Pexels

🔗 Repo: github.com/calesthio/OpenMontage
💬 Kẹt chỗ nào comment chồng trả lời.

Ep3 tuần sau: cách ra lệnh chuẩn để moi hết kho đồ chơi (Veo 3, Kling, FLUX, Suno).

#vibeediting #aimakevideo #remotion #claudecode #cursor #aitiktok #huongdan
```

---

## 7. Rules áp dụng từ memory

- ✅ **feedback_general_approve_script** — gate user duyệt slide content trước khi build Remotion
- ✅ **feedback_general_deliverables** — slides + recap.mp4 + thumbnail (= slide 1) + caption.md
- ✅ **feedback_caption_whisper_verify** — recap reel forced-align + diff whisper vs script
- ✅ **feedback_tts_vn_short_syllables** — script clean, không syllable đơn lạc
- ✅ **feedback_caption_universal_lock** — recap reel dùng caption style từ ImLangFull (sentence-based spring reveal)
- ❌ **feedback_general_no_tap_label** — KHÔNG show "TẬP 2" big-word. Chỉ "EP2" badge nhỏ ở slide 1 + slide 13.

---

## 8. Next actions

1. **GATE — User confirm spec này (pass / chỉnh)**
2. Mày confirm xong → tao build Remotion components (slide + recap)
3. Run TTS (EverAI vi_male_minhkhang_mb) cho recap voice-over
4. Render bộ 13 PNG + 1 recap.mp4
5. Viết caption.md
6. Preview cho mày review trước khi báo done

---

## 9. Locked decisions

- ✅ **Handle outro:** `@vibeediting`
- ✅ **Antigravity:** ghi rõ "FREE giới hạn token" — không nói "FREE tuyệt đối" để tránh viewer bị hụt
- ✅ **Slide 11 test command:** composition `VibeEditingIntro` (đã exist trong `Root.tsx:44`) — viewer render ra chính cái intro 51s của series. Có ý nghĩa branding + chạy được thật ngay lần đầu.
