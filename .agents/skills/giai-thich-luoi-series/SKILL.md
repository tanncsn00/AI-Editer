# Skill: "Giải Thích Kiểu Lười" Series

Vietnamese adaptation of **Casually Explained** format — deadpan stick-figure explainer videos with an ensemble cast of 4 recurring characters, each representing a different worldview / topic specialty.

**Series name:** Giải Thích Kiểu Lười (literally: "Lazy Explanations")
**Format inspiration:** Casually Explained + Sam O'Nella Academy + Exurb1a
**Target audience:** VN Gen Z + Millennials 22-35
**Channel positioning:** Blue ocean — no Vietnamese Casually Explained exists

## Related skills
- `stick-figure-creative` — technique catalog (34 techniques)
- `comedy-animation` — 8-step gated workflow (same flow applies)
- `reup-cartoon-dub` — pipeline for voice + SVG scene rendering
- `tinh-dao-video` — inspiration for wisdom tone
- `INSPIRATION.md` in stick-figure-creative/ — research basis

## Aesthetic Lock

- **Background:** Paper cream `#FAFAF5` + SVG `feTurbulence` grain filter (opacity 0.7)
- **Ink:** `#1A1A20` — all outlines + text
- **Accent:** `#4A90C8` (pale blue — ice tea theme)
- **Character stroke width:** 5px (intentionally crude)
- **Font — title:** EB Garamond serif 600
- **Font — captions:** Be Vietnam Pro 700
- **Font — diagram labels:** Be Vietnam Pro 500 small (18px)
- **Corner marks:** editorial frame brackets at 4 corners (L-shape, 60px arm, 3px stroke)
- **Style motto:** "intentionally crude" — don't polish away the ugly, it's the point

## Character Cast (LOCKED — do not change designs)

### 1. 🚬 **Anh Thuốc Lá** — philosophical existential
- **Body:** gầy, vai thụng, slouched posture (slouch=8)
- **Hair:** shaggy spiky dài on top + 1 fringe strand
- **Signature prop:** điếu thuốc lá cháy + smoke curl
- **Personality:** ít nói, suy ngẫm đời, drags on cigarette between sentences
- **Topic specialty:** đời sống, tình yêu cũ, tuổi trẻ qua đi, hối tiếc, triết lý cá nhân
- **Voice:** `vi_male_minhkhang_mb` @ 1.0x (default series voice, keeps it consistent)
- **⚠️ Platform note:** cigarette may get demonetized on TikTok/FB — consider using him for YouTube episodes primarily, or swap cigarette → cigarette-like pen/stick if flagged

### 2. 👨‍🌾 **Chú Nón Cối** — traditional OG
- **Body:** thấp vững, wider stance (legSpread=22)
- **Signature prop:** nón cối lớn đội trên đầu (raised to not cover face)
- **Signature feature:** **ria mép bushy 2-tier** — big mustache + small mouth
- **Personality:** ông già làng, kể chuyện "ngày xưa...", truyền thống preservationist
- **Topic specialty:** phong tục VN, Tết, folklore, lịch sử, bà kể chuyện, "thời ông cha"
- **Voice:** `vi_male_ductrong_mb` @ 0.95x (grounded older male voice) OR `vi_male_lehoang_mb`

### 3. 👓 **Bác Cục Gạch** — anti-modern boomer
- **Body:** neutral proportion, slight slouch (slouch=3)
- **Hair:** 3 strand buzz cut (short top)
- **Signature features:** **kính vuông** (square glasses) + **Nokia brick phone** in hand
- **Personality:** ghét smartphone, không hiểu TikTok, "hồi xưa điện thoại tao không có internet mà vẫn sống được"
- **Topic specialty:** công nghệ, mạng xã hội, Gen Z habits, social media trap, phone addiction
- **Voice:** `vi_male_minhkhang_mb` @ 0.95x (slightly slower for grumpy feel) OR `vi_male_echo_default`

### 4. 🍜 **Chú Bát Phở** — practical foodie
- **Body:** **pot belly** smooth curve, wide sturdy stance (legSpread=26)
- **Hair:** bald top + 2 side tuft + shiny hint
- **Signature prop:** bát phở steam + chopsticks, bưng bằng 2 tay
- **Personality:** practical daily-life uncle, nói về đồ ăn, chợ búa, quán xá, không triết lý cao siêu
- **Topic specialty:** ẩm thực VN, đi chợ, quán nhậu, cơm mẹ nấu, street food, "cứ ăn đi đã"
- **Voice:** `vi_female_thuytrang_mb` @ 1.05x (warm female aunty feel, breaks male monotony) OR `vi_male_minhkhang_mb`

### Character pairing chemistry
- **Thuốc Lá × Nón Cối** = old-school philosophers (2 generations wisdom)
- **Cục Gạch × Bát Phở** = anti-modern vs practical (boomer debate club)
- **Thuốc Lá × Cục Gạch** = pessimist duo (both cynical, different angles)
- **Nón Cối × Bát Phở** = rural life duo (both traditional VN)
- **All 4 together** = "4 ông bàn trà đá" ensemble

## Series episode formats

### Format A — **Solo explainer** (default, 80% of episodes)
- 1 character explains 1 topic in their specialty
- Duration: 2-5 minutes (TikTok) or 4-8 minutes (YouTube)
- Structure: Hook question → deadpan observation → 3-5 bullet points → callback punchline
- Art: character + diagram arrows + labels (Casually Explained style)

### Format B — **Duo debate** (15% of episodes)
- 2 characters discuss same topic from opposing angles
- Duration: 3-6 minutes
- Structure: Topic intro → character A's take → character B's counter → punchline
- Art: split screen or alternating shots

### Format C — **Ensemble council** (5% of episodes — rare)
- All 4 characters gather to discuss a big topic
- Used for: season finale, viral hot topic, community Q&A episodes
- Duration: 5-10 minutes
- Character spots: thuốc lá left, nón cối center-left, cục gạch center-right, bát phở right
- Reference image: `projects/anh_luoi_ensemble_v2.png`

## 8-step workflow (inherits from comedy-animation)

1. **Episode concept** — pick topic + pick character(s) → brainstorm 3 angles
2. **Beat sheet** — 5-8 beats, each 20-60s
3. **Script approval** — full dialogue per beat, user approves line-by-line
4. **Voice casting** — confirm which character(s) + voice
5. **Storyboard mini** — rough sketch per beat (positions, diagrams, labels)
6. **TTS + align** — EverAI → whisper align with script as ground truth
7. **Remotion compose** — use existing `AnhLuoi` / `CastCharacter` components from `GiaiThichLuoiChars.tsx`, layout diagram arrows + labels
8. **Render + caption + thumbnail** — designed thumbnail (not frame extract)

## Topic matrix — which character for which topic

| Topic | Best character | Backup |
|---|---|---|
| Tình yêu cũ, hối tiếc | Thuốc Lá | Cục Gạch |
| Tết, cỗ, phong tục | Nón Cối | Bát Phở |
| Công nghệ, smartphone, TikTok | Cục Gạch | Nón Cối |
| Ẩm thực, quán ăn, chợ | Bát Phở | Nón Cối |
| Triết lý, nhân sinh quan | Thuốc Lá | — |
| Lịch sử VN, folklore | Nón Cối | — |
| Gen Z behavior | Cục Gạch | Thuốc Lá |
| Dating apps | Cục Gạch × Thuốc Lá (duo) | — |
| Công sở | Bác Cục Gạch | Thuốc Lá |
| Cha mẹ generational gap | Nón Cối × Cục Gạch (duo) | — |
| Sức khỏe, sống lâu | Bát Phở | Nón Cối |
| Money / làm giàu | Cục Gạch | Thuốc Lá |

## Component usage

```tsx
import { CastCharacter, AnhLuoi, TraDaCup, Cigarette, NonCoi, CucGach, BatPho }
  from "./GiaiThichLuoiChars";

// Solo episode
<CastCharacter x={540} y={960} scale={2.5} member="thuocla" expression="deadpan" />

// Duo episode
<CastCharacter x={360} y={960} scale={2.2} member="cucgach" />
<CastCharacter x={720} y={960} scale={2.2} member="batpho" />

// Diagram arrow pointing to something
<g transform="translate(780, 520)">
  <line x1={0} y1={0} x2={-60} y2={30} stroke="#1A1A20" strokeWidth={2} />
  <text x={4} y={4} fontSize={18} fontFamily="'Be Vietnam Pro', sans-serif">
    thứ ai cũng giả vờ hiểu
  </text>
</g>
```

## Diagram conventions (Casually Explained signature)

- Arrows point FROM label TO character/object
- Labels on LEFT of arrow line, simple Be Vietnam Pro 18-22px
- Sometimes sub-label italic below in 14px opacity 0.6
- Arrow line 2-2.5px stroke, rarely curved — usually straight
- Often multiple arrows labeling different parts at once (create diagram feel)

## Anti-patterns (DO NOT)

- ❌ Change character design mid-series — lock is LOCK
- ❌ Use deep philosophical voice (minhtriet/ductrong) for Thuốc Lá or Cục Gạch — they need minhkhang bright
- ❌ Add color fills to characters — intentionally crude = B&W outline only
- ❌ Make the art "pretty" — the joke is it LOOKS amateur
- ❌ Skip the diagram arrows — they're the signature visual hook
- ❌ Character body differs across episodes — lock proportions
- ❌ Forget the tagline at end — each episode ends with 1-liner in dashed box
- ❌ Use "Tập X" label (memory rule)

## File references

- **Character components:** `remotion-composer/src/GiaiThichLuoiChars.tsx`
  - `AnhLuoi` — single character with expression + prop options (legacy, use `CastCharacter` for series)
  - `CastCharacter` — main component for series, takes `member: "thuocla" | "noncoi" | "cucgach" | "batpho"`
  - `TraDaCup`, `Cigarette`, `NonCoi`, `CucGach`, `BatPho` — prop components
  - `GiaiThichLuoiEnsemble` — ensemble cast sheet composition (reference)
- **Cast sheet:** `projects/anh_luoi_ensemble_v2.png`
- **Inspiration doc:** `.agents/skills/stick-figure-creative/INSPIRATION.md`

## Voice config reference

```python
# Default series voices per character
VOICES = {
    "thuocla":  ("vi_male_minhkhang_mb", "everai-v1.6", 1.0),
    "noncoi":   ("vi_male_ductrong_mb",  "everai-v1.6", 0.95),
    "cucgach":  ("vi_male_minhkhang_mb", "everai-v1.6", 0.95),
    "batpho":   ("vi_female_thuytrang_mb", "everai-v1.6", 1.05),
}
```

## Future expansion (when channel scales)

**Potential new cast members to add later:**
- **Chị Chợ Búa** — female counterpart, street market / practical women life
- **Bà Hàng Xôi** — elderly aunty, wisdom + nostalgia
- **Anh Gen Z** — Gen Z stand-in for generational gap duo
- **Thầy Giáo Làng** — village teacher, educational takes

Don't add until ensemble of 4 is established (min 10 episodes each character).

## First-episode strategy

**Recommendation for Tập 1:** Ensemble intro episode (Format C)
- Why: audience meets all 4 at once, context for future solo episodes
- Topic: something universally relatable where each character has a distinct take
- Example topic: "Tại sao người lớn lúc nào cũng mệt?" — each character gives different reason
- Duration: 3-4 minutes
- Payoff: ends with 4 ông cùng thở dài, zoom out, title card

**Alternative for Tập 1:** Bác Cục Gạch solo on "TikTok là gì?" — anti-tech angle is the most meme-friendly opener, targets Gen Z directly, single character so cheaper to produce.
