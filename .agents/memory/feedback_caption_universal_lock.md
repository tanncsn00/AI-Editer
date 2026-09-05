---
name: Caption style UNIVERSAL LOCK (all VN video types)
description: ONE caption style for EVERY Vietnamese video — Tinh Dao sentence-based spring reveal, verbatim from ImLangFull.tsx. Never invent new per-video caption patterns.
type: feedback
originSessionId: ec65b125-7a7a-4b08-aab5-5673b0036876
---
**Rule:** Mọi video tiếng Việt (triết lý, reup, dub, comedy, tutorial, review, explainer) dùng **một kiểu caption duy nhất** — copy verbatim `Caption` component từ `remotion-composer/src/ImLangFull.tsx`.

**Why:** User feedback 2026-04-20 — "sao thi thoảng cứ thấy sai kiểu sub bực quá, thống nhất 1 kiểu thôi". Mỗi video làm style khác (karaoke sliding, bottom center, center sentence) gây nhiễu, phí thời gian chỉnh đi chỉnh lại. Một kiểu duy nhất = nhận diện brand.

**How to apply:**

1. **Copy `Caption` component verbatim** từ `ImLangFull.tsx` (không edit logic, chỉ đổi màu theo palette video)
2. **Sentence-based:** render TOÀN BỘ câu một lúc, các từ spring-in tuần tự (không phải karaoke sliding window, không phải word-by-word highlight jump)
3. **Spring:** `{ damping: 14, stiffness: 230, mass: 0.4 }` — translate Y 12→0, blur 4→0, opacity theo spring
4. **Sentence split:** break trên `.!?` hoặc dấu `,` khi buffer ≥ 8 từ
5. **Position:** CENTER (justifyContent: center + alignItems: center) cho Tịnh Đạo; BOTTOM cho các video có diagram/visual bận (tutorial, explainer, reup) — paddingBottom 160
6. **Font:** `'Be Vietnam Pro'` Bold 600 body / 800 emph. Size: body 52-54 / emph 62-64 (1080×1920) hoặc 44-48 / 54-58 (720×1280)
7. **Color:** body `#F5F5F0` ivory / `#EEEEEA`, emph **màu đổi theo mood** (Tịnh Đạo bright=yellow `#F4B860`, cold=steel `#C0CCD4`, Vibe Editing=gold `#E5A53B`, harsh=red `#D03020`)
8. **textShadow:** body `0 3px 12px rgba(0,0,0,0.95)`; emph thêm glow matching emph color `0 0 26px rgba(R,G,B,0.55)`
9. **Emph set:** curated list 10-20 từ per video (brand names, tech terms, punch words). Không quá nhiều, không quá ít.
10. **Lead offset:** 0.10s (text leads voice để bù spring rise time)
11. **Display form rule:** caption text = DISPLAY form (English brand như `Claude`, `vibe editing`, `MP4`), KHÔNG phải phonetic form (`vai bờ ê đít tinh`, `em pi bốn`) — phonetic chỉ dùng cho TTS audio input. Merge phonetic word-sequences → display form trước khi render (post-process words.json).

**Forbidden patterns:**
- ❌ Karaoke per-word color jump (active word vàng, đổi từng từ)
- ❌ Sliding window last-N-words
- ❌ SRT burn via ffmpeg ASS subtitle filter
- ❌ Per-video invented caption styles
- ❌ Different font per video (always Be Vietnam Pro)

**Reference implementations:**
- `remotion-composer/src/ImLangFull.tsx` — canonical Caption component
- `remotion-composer/src/VibeEditingEp1.tsx` — tutorial/explainer bottom-position variant
- `remotion-composer/src/BayCuuFull.tsx`, `DanOngFull.tsx`, `GiaTocFull.tsx` — center-position Tịnh Đạo variants

**When building a new video:** copy Caption từ ImLangFull.tsx → điều chỉnh position (center/bottom) + màu emph + emph set. KHÔNG viết lại logic.
