---
name: review-vibe-future
description: "Video news/explainer tech kiểu dark-tech futuristic — Tron grid + neural orb + holographic text + MC người que animated mouth-sync. Dùng cho tin AI/tech, drama ngành, product leak, rò rỉ sản phẩm; 60-90s 9:16; voice lehoang 1.15x giọng phóng viên điều tra. KHÔNG dùng cho hài, triết lý, hay tutorial."
---

# /review-vibe-future — Futuristic Tech News Video Skill

> Stick teacher + Tron grid + neural orb + holographic text + animated MC
> Formula: tech news / AI scandal / product leak / dev drama → 60-90s 9:16 explainer

## Khi nào dùng

User nói:
- "review vibe future" / "/review-vibe-future" / "futuristic tech news"
- Tin AI/tech scandal hoặc breaking (sa thải, drama, model release, leak, IPO)
- Tin về Apple, OpenAI, Anthropic, Google, Meta, Cloudflare, Microsoft, NVIDIA, etc.
- Bất kỳ tin nào cần "tech tương lai · hiệu ứng ngập tràn · MC nói chuyện"

**KHÔNG dùng:**
- Tutorial setup → `the-review` Format B
- Triết lý chiêm nghiệm → `tinh-dao-video`
- Hài stick figure → `comedy-animation`
- POV đồ vật → `loi-thu-nhan-vat`
- Bản tin nhiều tin → BanTinAI multi-news pattern

---

## Visual LOCK (futuristic dark tech)

| Element | Setting |
|---------|---------|
| Aspect | 9:16 · 1080×1920 · 30fps |
| Duration | 60-90s |
| **BG layer 1** | Vertical gradient `#020012` → `#050018` → `#0A0530` → `#1A0840` |
| **BG layer 2** | Tron-style perspective grid floor cyan `#00F0FF` từ horizonY=0.55*H, lines extend to vanishing point `(W/2, H+100)` + horizon glow line strokeWidth=2 + duplicate stroke=6 blurred |
| **BG layer 3** | Neural orb center-back: radial orange→purple→indigo + 8 nodes orbiting + connection lines purple opacity~0.4 + center white glow circle |
| **BG layer 4** | 14 floating cyan particles drifting upward with sine drift |
| **BG layer 5** | Animated cyan scan beam sweeping from top→bottom every 8s |
| **BG layer 6** | Subtle micro grid 48px overlay opacity 0.025 |
| **BG layer 7** | Radial vignette từ 50%-100% black 0.6 |
| Title font | Inter 800-900 cho heroes, JetBrains Mono cho code/labels/dates |
| Body | Be Vietnam Pro 700 (Vietnamese support) |
| **Color palette** | TEXT `#FFFFFF` · TEXT_DIM `#9CA3C9` · ACCENT `#FF6B35` · NEON_BLUE `#6366F1` · NEON_PURPLE `#A855F7` · NEON_PINK `#EC4899` · NEON_CYAN `#06B6D4` · GOLD `#FFC93C` · RED `#FF3B5C` · GREEN `#10F2A6` · PANEL `#0F1028` |
| **Card** | rx=14 (sharp), fill=PANEL, stroke=brand color strokeWidth=2, drop-shadow color tinted with 88-cc opacity |
| **CornerBrackets** | ┌ ┐ └ ┘ on every major card, len=14-26, strokeWidth=3 |
| **Status dot** | `● LABEL TEXT` centered with textAnchor=middle, brand color, JetBrains Mono fontWeight=700 |
| **HoloText** | Rainbow gradient sweep: orange→gold→cyan→purple→pink, animate sweep offset by frame, dual drop-shadow (orange + purple). Use cho ALL hero text (numbers, big nouns, "GAME OVER", "Extensions", "$1B", "WWDC", "MÙA THU 2026", etc.) |
| **GlowPulse** | Halo behind logos: 2 circles concentric với gaussianBlur stdDeviation=14, opacity 0.3+0.5, scale pulse 1+sin(frame*0.04)*0.15 |
| **ScanLines** | Subtle CRT horizontal stripes pattern overlay on dark cards (opacity 0.06+0.03) |
| **ParticleBurst** | 12 dots fly out radial từ center on reveal, 60-frame duration, fade out, used cho hero entrance |
| **RotatingRing** | Optional dashed circle stroke rotating around logo (decorative) |
| **MC anchor** | Stick teacher bottom-right (x=920, y=1640, scale=1.6) — see Animation section |

## Caption (UNIVERSAL LOCK)

Per `feedback_caption_universal_lock` — copy verbatim from `ImLangFull.tsx` sentence-based spring reveal. Swap colors:
- EMPHASIS_COLOR = `#FFC93C` (GOLD)
- BODY_COLOR = `#FFFFFF` (TEXT)
- Stroke INK 8px outline

## Voice (default)

- **Voice:** EverAI `vi_male_lehoang_mb` @ 1.15x · model `everai-v1.6`
- **Persona:** Investigative reporter, có opinion, tone serious + drama
- **Pronoun:** "bạn" (NOT "mày")
- **End:** "Theo dõi nhé, tin AI nóng nhất mỗi ngày"

### Voice number rules (CRITICAL — verified via whisper)

⚠️ **lehoang voice swallows "nghìn"** in `X nghìn Y trăm` patterns. ALWAYS use comma:
- ❌ "một nghìn một trăm" → reads "một một trăm"
- ❌ "1.100" → reads "một một trăm"
- ✅ **"một nghìn, một trăm"** → reads correct
- ✅ "một ngàn một trăm" (Southern dialect) → also works

For years like 2024:
- ❌ "hai nghìn không trăm hai mươi tư" → reads disjointed
- ✅ "hai nghìn, không trăm hai mươi tư" (with comma)
- ✅ "cuối năm hai mươi tư" (colloquial)

### English phonetic dictionary

| Form | TTS phonetic | Display |
|------|--------------|---------|
| iOS | ai-ô-ét | iOS |
| iPadOS | ai-pát-ô-ét | iPadOS |
| macOS | mác-ô-ét | macOS |
| ChatGPT | natural (lehoang reads OK) | ChatGPT |
| Claude | natural (lehoang OK, Northern accent) | Claude |
| Gemini | natural OK | Gemini |
| Grok | natural OK | Grok |
| Apple | natural OK | Apple |
| iPhone | natural OK or "ai-phôn" | iPhone |
| Google | natural OK | Google |
| Microsoft | natural OK | Microsoft |
| Cloudflare | natural OK | Cloudflare |
| API | ây-pi-ai | API |
| MCP | em-xi-pi | MCP |
| SVG | ét-vi-gi | SVG |
| GPU | gi-pi-yu | GPU |
| CEO | xi-i-ô | CEO |
| WWDC | natural OK | WWDC |
| Foundation model | natural OK | foundation model |

**Numbers ALWAYS in Vietnamese words** with comma between thousand+hundred. NEVER send "1100" or "1.100" digit form to TTS.

## 8-beat structure (Format C — Investigative explainer)

| # | Beat | Pattern | Hero element |
|---|------|---------|--------------|
| 1 | HOOK | Drama claim + struck-through old paradigm | HoloText + struck-line + 4 brand cards intro |
| 2 | CONTEXT/WHAT | Tech reveal: 3 platform pills + feature highlight | 3 pills with brackets + Extensions hero card |
| 3 | WHERE/HOW | Real product mockup (iPhone/Settings/UI) | Phone/UI mock + 3 feature pills |
| 4 | OUSTED/PAIN | Timeline + GAME OVER stamp / negative consequence | Timeline 2-point + RED stamp rotated -3° + brackets |
| 5 | DEEP DIVE | Big number reveal (deal/fund/metric) | HoloText giant number + brand logo + foundation pill |
| 6 | OTHERS/COMP | 4 brand cards 2×2 grid + terminal command | Cards với CornerBrackets + ScanLines + GlowPulse + terminal |
| 7 | WHEN/PROOF | WWDC/event card + release date | HoloText event name + tech-bordered date box |
| 8 | CTA | Vote pills with brand logos + Follow card | 3 vote rows + FOLLOW card with neon border |

## Animated MC (mandatory)

**Per memory `feedback_comedy_mouth_sync`** + `feedback_comedy_stick_animate`:

```tsx
// Mouth sync — parabolic per word
const useMouthOpen = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t < w.end) {
      const local = (t - w.start) / (w.end - w.start);
      return 4 * local * (1 - local);  // parabola 0→1→0
    }
  }
  return 0;
};

// Body bob + sway (always alive)
const bob = Math.sin(frame * 0.06) * 3;
const swayDeg = Math.sin(frame * 0.045) * 2.5;

// Talk boost (when speaking, hand gesture amplifies)
const talking = mouth > 0.15;
const talkBoost = talking ? Math.sin(frame * 0.22) * 6 : 0;

// Head nod (continuous + faster when talking)
const headNod = Math.sin(frame * 0.08) * 1.5 + (talking ? Math.sin(frame * 0.3) * 1.5 : 0);

// Hand sway (always-on for all poses)
const handSway = Math.sin(frame * 0.18) * 6;

// Eye blink (4s cycle)
const blinking = (frame % 120) / 120 > 0.97;
```

### Pose per beat

```tsx
const POSE_BY_BEAT: Record<number, { pose: Pose; expression: Expression }> = {
  1: { pose: 'wave', expression: 'smile' },          // intro
  2: { pose: 'point-up-right', expression: 'smile' }, // showing platform
  3: { pose: 'point-left', expression: 'smile' },    // pointing at UI mock
  4: { pose: 'thumbs-down', expression: 'surprised' }, // game over reaction
  5: { pose: 'point-up-right', expression: 'smile' }, // pointing at money
  6: { pose: 'open-arms', expression: 'smile' },     // wide gesture
  7: { pose: 'point-up-right', expression: 'smile' }, // pointing at date
  8: { pose: 'thumbs-up', expression: 'smile' },     // closer
};
```

### Pose types
- `wave` — hand waving up-down with sin
- `point-up-right` — right arm up, hand pointing
- `point-left` — left arm up, hand pointing
- `thumbs-up` / `thumbs-down` — small thumb line off hand
- `open-arms` — both arms wide

### Expression types
- `smile` — default upward Q curve
- `surprised` — bigger eyes (r=4) + O mouth
- `serious` — angled eyebrows

## Workflow (8-step gated)

### BƯỚC 1 — TOPIC + ANGLE
- Pick a tech news/scandal that fits "futuristic" vibe (not philosophy, not POV).
- Determine: drama angle / paradigm shift / product reveal / industry pattern
- Project slug: `<topic>-<vibe-future>-<YYYY>` or simpler `<topic>-2026`
- **GATE 1**: Confirm topic with user.

### BƯỚC 2 — RESEARCH (firecrawl/WebSearch)
- Get 3+ sources with date verification
- Extract: who/when/numbers/quotes/conflict
- Confirm date is recent (current month preferred)
- **GATE 2**: User picks angle (if multiple options found).

### BƯỚC 3 — 8-BEAT BRAINSTORM
- Fill template above with specific content
- Identify hero element per beat (number, quote, brand, etc.)
- 1-line outline per beat
- **GATE 3**: User approves beat sheet.

### BƯỚC 4 — SCRIPT TTS
- Length: 60-90s ≈ 280-450 từ
- Apply phonetic dictionary
- **CRITICAL number rule**: comma between thousand+hundred
- Persona: investigative reporter "bạn" tone
- End with "Theo dõi nhé, tin AI nóng nhất mỗi ngày"
- **GATE 4 (MANDATORY per `feedback_general_approve_script`)**: Send script for user approval BEFORE TTS.

### BƯỚC 5 — TTS + WHISPER VERIFY
- Run EverAI lehoang 1.15x
- **MANDATORY whisper diff** per `feedback_caption_whisper_verify` to verify pronunciation
- If "nghìn" swallowed → fix with comma
- If English brand mispronounced → swap to phonetic from dictionary
- Iterate until whisper transcript matches script

### BƯỚC 6 — BUILD COMPOSITION
- Copy `AppleIos27Swap.tsx` → `<NameSlug>.tsx`
- Reuse SVG components: `Bg`, `CornerBrackets`, `HoloText`, `GlowPulse`, `ScanLines`, `RotatingRing`, `ParticleBurst`, `CardEffects`, `CharFilters`, `Teacher`, `POSE_BY_BEAT`
- Brand logos: `ClaudeLogo`, `OpenAILogo`, `GeminiLogo`, `GrokLogo`, `GoogleG`, `AppleLogo` (copy as needed)
- Build 8 beats with hero element pattern
- Register in `Root.tsx` with `id`

### BƯỚC 7 — RENDER + VERIFY
- Render still PNG of 3-4 beats first (preview before full)
- Check: text centered (textAnchor="middle"), no overlap, brand logos correct, MC pose changes per beat
- Full render: `npx remotion render <id> draft.mp4 --concurrency=4 --jpeg-quality=85`
- Iterate based on user feedback

### BƯỚC 8 — DELIVERABLES
**Per `feedback_general_deliverables`:**
- ✅ `final.mp4` — 9:16 1080×1920 @ 30fps · 60-90s
- ✅ `thumbnail.png` — designed (NOT frame extract): same futuristic style with key beat highlights, holographic title, brand cards, Tron grid bg
- ✅ `caption.md` — hook + pin comment + scene breakdown + 4 alt hooks + hashtag pool

## Reference

**Golden reference video:**
- `projects/apple-ios27-ai-swap-2026/final.mp4` — Apple iOS 27 AI swap (62s, dark futuristic, full effects + animated MC)

**Composition source:**
- `remotion-composer/src/AppleIos27Swap.tsx` — full futuristic + MC animation reference
- `remotion-composer/src/AppleIos27SwapThumbnail.tsx` — futuristic thumbnail reference
- `remotion-composer/src/CloudflareLayoff.tsx` — drama/data variant (no Tron, paper-cream)

**Critical memory to follow:**
- `feedback_tts_lehoang_thousand_skip` — comma fix for "nghìn" + verify with whisper
- `feedback_caption_whisper_verify` — always diff whisper after TTS
- `feedback_caption_universal_lock` — caption style verbatim from ImLangFull.tsx
- `feedback_caption_phonetic_display` — phonetic vs display merge
- `feedback_general_no_tap_label` — no "Tập X" in thumbnail
- `feedback_general_deliverables` — mp4 + thumbnail + caption.md
- `feedback_general_approve_script` — gate user before TTS
- `feedback_comedy_mouth_sync` — word_timings parabolic mouth, never sine
- `feedback_comedy_stick_animate` — char must mouth + blink + bob

## Tone DOs / DON'Ts

### ✅ DOS
- Drama opener (struck-through paradigm, big claim with numbers)
- HoloText for hero numbers/words (rainbow gradient sweep)
- Real brand SVG logos (NEVER emojis or letter placeholders)
- CornerBrackets on every important card
- Status dots ● centered with textAnchor middle
- MC actively gestures per beat + mouth sync per word
- End with question/insight + Follow CTA
- Voice "bạn" tone, reporter serious

### ❌ DON'TS
- ~~Paper-cream bg~~ (that's the-review style, not futuristic)
- ~~Static MC~~ — must mouth + bob + sway + per-beat pose
- ~~Emoji logos~~ — use SVG paths
- ~~Letter placeholders~~ for brand (e.g. "C" for Claude — use real sparkle)
- ~~Send "1100" digit to TTS~~ — always Vietnamese words with comma
- ~~"mày" pronoun~~ — use "bạn"
- ~~Center text via x-offset~~ — always textAnchor="middle"
- ~~Bullet listicle "1, 2, 3..."~~ — use storytelling/drama flow
- ~~Skip whisper verify~~ — TTS pronunciation MUST be diff'd
