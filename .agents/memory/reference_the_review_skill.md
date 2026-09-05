---
name: The Review skill (universal)
description: Skill CHUNG ở .claude/skills/the-review cho mọi video giới thiệu/chia sẻ kiến thức/review/tutorial dạng "thầy người que paper-cream". 4 format variant (REVIEW / TUTORIAL / EXPLAINER / COMPARISON). Vibe Editing chỉ là 1 ví dụ.
type: reference
originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
modified: 2026-08-13T04:28:03.522Z
---
Preset workflow CHUNG ở `.claude/skills/the-review/SKILL.md` cho format **"The Review — thầy người que paper-cream"** trên TikTok/Reels 9:16.

**Brand:** **The Review** (user đặt tên — KHÔNG BAO GIỜ dùng "thầy review" / "Thầy Review" / "thay-review" / "vibe-editing-tutorial". Trong voice script VN gọi "the review" giữ nguyên English, không Việt hoá thành "thầy".)

**Đây là skill UNIVERSAL** — không gắn với 1 series cụ thể. Vibe Editing chỉ là 1 application example (Format B Tutorial mẫu tại `projects/vibe-editing-ep1/`).

**Khi nào dùng:**
- Review tool/app/SaaS/khoá học/sách/sản phẩm
- Chia sẻ kiến thức (finance, sức khoẻ, productivity, tâm lý, marketing, đầu tư...)
- Tutorial setup / hướng dẫn step-by-step
- So sánh 2-N options (tool vs tool, framework vs framework)
- User nói "the review", "kiểu Vibe Editing", "kiểu Ep1", "thầy người que", "paper cream"

**Khi nào KHÔNG dùng:**
- Hài → `comedy-animation`
- Triết lý → `tinh-dao-video`
- POV đồ vật → `loi-thu-nhan-vat`
- Reup → `reup-comedy-dub` / `reup-cartoon-dub`
- 4-character deadpan → `giai-thich-luoi-series`

**4 Format variant (chọn theo loại video):**
- **A — REVIEW**: HOOK → LÀ GÌ → TÍNH NĂNG → DEMO REAL → ƯU/NHƯỢC → GIÁ → VERDICT+SCORE → OUTRO (60-90s)
- **B — TUTORIAL/SETUP**: HOOK → LÀ GÌ → CHỌN GÌ → SETUP → CONFIG → DEMO REAL → KẾT QUẢ → OUTRO (90-180s) — Vibe Editing Ep1 là mẫu
- **C — KNOWLEDGE SHARE/EXPLAINER**: HOOK+VẤN ĐỀ → CONTEXT → CORE 1 → CORE 2 → CORE 3 → VÍ DỤ → TAKEAWAY → OUTRO (60-120s)
- **D — COMPARISON**: HOOK+STAKES → OPTION A → OPTION B → DEMO A → DEMO B → BẢNG SO SÁNH → CHỌN AI? → VERDICT (90-150s)

**5 Persona variant (chọn theo audience):**
- "Chồng dạy vợ" (default Vibe Editing — đời thường, không jargon)
- "Anh Hai chia sẻ" (life/finance/health knowledge)
- "Thầy giáo Gen-Z" (audience trẻ, slang nhẹ)
- "Senior dev review" (dev/tech, có opinion)
- "Tư vấn viên" (neutral data-driven, comparison)

**Visual fingerprint LOCK (universal):**
- Paper cream `#F3EAD8` + noise + vignette
- Stick teacher áo xanh `#4A7AC8` góc phải-dưới (poses: pointing/waving/thumbs/idle)
- Title cam `#E85838` uppercase Be Vietnam Pro 700
- Card cream-white border ink, terminal mock dark
- Top-right badge "🔴 REAL · ___" cho real screen recording
- Caption block từ `ImLangFull.tsx` verbatim (emphasis `#E5A53B` gold)

**Composition shared:**
- `remotion-composer/src/VibeEditingEp1.tsx` — Format B mẫu (copy + sửa)
- `remotion-composer/src/VibeEditingLayout.tsx` — Teacher + Bg shared
- `remotion-composer/src/ImLangFull.tsx` — Caption + BigWord (verbatim)

**Workflow 8 bước (gated):**
1. Chọn FORMAT + topic + persona → GATE 1
2. Brainstorm 8 beat theo format → GATE 2
3. Script TTS (length theo format) → GATE 3 PHẢI duyệt trước TTS
4. Chuẩn bị asset (real-screen optional cho Format C)
5. TTS EverAI + whisper align + diff
6. Build Remotion (copy template + reuse component)
7. Render + preview frames
8. Deliverables MANDATORY: final.mp4 + designed thumbnail + caption.md
