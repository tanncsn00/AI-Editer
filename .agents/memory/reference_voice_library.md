---
name: Voice library shared
description: Bộ 12 voice references trong _shared/voice_refs/ cho F5-TTS Docker — dùng VOICE_REF env var để switch
type: reference
originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
---
12 voice refs sẵn ở `e:\tvk\OpenMontage\projects\_shared\voice_refs\`:

**EN (3):** `adam` (casual male) · `en_f_narrator` (audiobook) · `en_m_podcast` (Lex Fridman style serious)

**VN female (4):** `trabeoo` (brand voice trẻ) · `vn_f_news` (news anchor) · `vn_f_warm` (warm narrator, Tịnh Đạo style) · `vn_f_genz` (Gen-Z casual)

**VN male (5):** `vn_m_news_anchor` (VTV tin tức) · `vn_m_podcast` (calm chia sẻ) · `vn_m_tech_review` (Schannel-style) · `vn_m_audiobook` (sách nói narrator) · `vn_m_old_wise` (VOV trầm cổ điển)

**Usage:**
```bash
cd projects/<slug>
VOICE_REF=vn_m_news_anchor python ../_shared/run_tts_docker.py
```

**Re-download/add voice:** Edit `voice_refs/voices_config.json` → `python download_lib.py [name]`.

**Recommend mapping theo skill:** See `voice_refs/README.md` cho bảng skill → voice. Quick:
- `review-vibe-future` → `vn_m_news_anchor` / `trabeoo`
- `tinh-dao-video` → `vn_f_warm` / `vn_m_old_wise`
- `the-review` Format A (review tool) → `vn_m_tech_review` / `trabeoo`
- `the-review` Format C (knowledge) → `vn_m_podcast` / `vn_f_warm`
- `loi-thu-nhan-vat` → `vn_m_old_wise` / `vn_f_warm`
- `comedy-animation` → `vn_f_genz` / `trabeoo`

All refs là 8-12s mono 24kHz WAV + matching `.txt` (whisper-verified, sửa tay khi cần).
