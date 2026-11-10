# Voice Library — `_shared/voice_refs/`

Bộ tham chiếu giọng cho F5-TTS Docker pipeline. Mỗi giọng = `<name>_ref.wav` (mono 24kHz, 8-12s) + `<name>_ref.txt` (transcript).

## Cách dùng

```bash
cd projects/<slug>
VOICE_REF=vn_m_news_anchor python ../_shared/run_tts_docker.py
```

`VOICE_REF` mặc định = `adam` (legacy). Set env var để pick giọng khác.

---

## Catalog

| `VOICE_REF` | Ngôn ngữ | Giới | Style | Use case |
|---|---|---|---|---|
| `adam` | EN | M | Casual male | EN content gốc, ElevenLabs Adam clone |
| `trabeoo` | VI | F | Brand voice trẻ | TikTok creator, casual brand, đời thường |
| `vn_m_news_anchor` | VI | M | News anchor | Tin tức nghiêm, breaking news, review-vibe-future |
| `vn_m_podcast` | VI | M | Podcast calm | Knowledge share, finance, self-help, Format C explainer |
| `vn_m_tech_review` | VI | M | Tech reviewer | SaaS/AI review, tech explainer, Format A |
| `vn_m_audiobook` | VI | M | Audiobook narrator | Sách nói nam, knowledge share, storytelling dài |
| `vn_m_old_wise` | VI | M | Trầm cổ điển | Triết lý đồ vật, lời thú nhận, narration cổ |
| `vn_f_news` | VI | F | News anchor | Tin tức nữ trang trọng, finance/business |
| `vn_f_warm` | VI | F | Warm narrator | Tịnh Đạo, triết lý chiêm nghiệm, storytelling |
| `vn_f_genz` | VI | F | Gen-Z casual | Comedy, lifestyle, vlog, review trẻ |
| `en_f_narrator` | EN | F | Audiobook narrator | EN storytelling, LibriVox style |
| `en_m_podcast` | EN | M | Podcast serious | EN business explainer, podcast monologue |

---

## Voice picker theo skill

| Skill / Format | Recommended `VOICE_REF` |
|---|---|
| `the-review` Format A (tool review) | `vn_m_tech_review` / `trabeoo` |
| `the-review` Format B (tutorial) | `vn_m_audiobook` / `vn_m_podcast` |
| `the-review` Format C (knowledge share) | `vn_m_podcast` / `vn_f_warm` |
| `the-review` Format D (comparison) | `vn_m_news_anchor` / `vn_m_podcast` |
| `review-vibe-future` (tech news) | `vn_m_news_anchor` / `trabeoo` |
| `tinh-dao-video` | `vn_f_warm` / `vn_m_old_wise` |
| `loi-thu-nhan-vat` (POV đồ vật) | `vn_m_old_wise` / `vn_f_warm` |
| `comedy-animation` | `vn_f_genz` / `trabeoo` |
| Bản tin AI hàng ngày | `vn_f_news` / `vn_m_news_anchor` |

---

## Thêm giọng mới

Edit `voices_config.json`, thêm entry:

```json
{
  "name": "vn_m_custom",
  "source": "youtube_search" | "youtube" | "tiktok" | "librivox" | "direct",
  "query": "...",           // for youtube_search
  "url": "https://...",     // for youtube/tiktok/librivox/direct
  "trim_start": 30.0,
  "trim_duration": 10.0,
  "lang": "vi" | "en",
  "gender": "male" | "female",
  "style": "...",
  "use_case": "..."
}
```

Rồi chạy:

```bash
python download_lib.py vn_m_custom
```

Hoặc redo tất cả: `python download_lib.py` (skip nếu đã tồn tại).

## Re-transcribe

Nếu chỉ muốn refresh `.txt` không re-download:

```bash
python download_lib.py --transcribe-only
```

---

## Quy tắc chọn ref tốt cho F5-TTS

1. **Single speaker only** — không có background music ầm ầm, không có người khác xen.
2. **8-12s** — đủ dài để model học prosody, không quá dài để loãng.
3. **Clean studio prefer** — ưu tiên YouTube voice-over / podcast / sách nói. Tránh livestream nhiều noise.
4. **Match accent target** — clone giọng miền Bắc dùng ref miền Bắc, đừng mix.
5. **Verify transcript** — `.txt` phải khớp WAV. Whisper có thể sai vài chữ — đọc lại sửa tay nếu cần.

## Files structure

```
voice_refs/
├── README.md                 # bạn đang đọc
├── voices_config.json        # config 12 voice
├── download_lib.py           # downloader + whisper transcribe
├── _cache/                   # tmp download (gitignored)
├── adam_ref.wav + .txt       # EN male casual (ElevenLabs Adam clone)
├── trabeoo_ref.wav + .txt    # VN brand female (TikTok @tra.beoo)
├── vn_m_*_ref.wav + .txt     # 5 VN male voices
├── vn_f_*_ref.wav + .txt     # 3 VN female voices
└── en_*_ref.wav + .txt       # 2 EN voices (besides Adam)
```
