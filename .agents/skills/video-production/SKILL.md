---
name: video-production
description: Quy trình sản xuất video từ A-Z — brainstorming, kịch bản, design spec, implementation plan, generate assets, render. Áp dụng cho mọi loại video, mọi platform, mọi chủ đề.
metadata:
  openclaw:
    emoji: "🎬"
    skillKey: "video-production"
    os: ["darwin", "linux", "win32"]
    requires:
      bins: ["node", "npx"]
---

# Video Production — Quy Trình Chuẩn

Skill này là **entry point duy nhất** cho mọi yêu cầu sản xuất video trong OpenMontage. Mọi video PHẢI đi qua pipeline system — không ngoại lệ.

**Nguyên tắc cốt lõi:**
- KHÔNG BAO GIỜ skip bước duyệt kịch bản
- KHÔNG BAO GIỜ tự ý render mà chưa có user approval
- KHÔNG BAO GIỜ gộp nhiều câu hỏi — hỏi từng câu một
- KHÔNG BAO GIỜ gọi tool mà chưa đọc Layer 3 skill của nó

---

## Tổng Quan Pipeline

```
User nhập ý tưởng
    ↓
Phase 0: Discovery — hỏi user về kỹ thuật muốn dùng
    ↓
Phase 1: Research — tìm data, audience, angles (free)
    ↓
Phase 2: Proposal — 3+ concepts, cost estimate, tool plan → USER APPROVE
    ↓
Phase 3: Script — kịch bản có timing + enhancement cues → USER APPROVE
    ↓
Phase 4: Scene Plan — visual breakdown, asset requirements → USER APPROVE
    ↓
Phase 5: Assets — generate TTS, images, music, video clips ($$)
    ↓
Phase 6: Edit — EDL, subtitle, audio layering
    ↓
Phase 7: Compose — render final video (FFmpeg hoặc Remotion)
    ↓
Phase 8: Publish — SEO metadata, chapters, export → USER APPROVE
    ↓
Video hoàn thành
```

Mỗi phase tạo ra **1 canonical artifact** (JSON) → được review → checkpoint → feed vào phase tiếp theo.

---

## Phase 0: Discovery — Hỏi User Về Kỹ Thuật

**Mục đích:** Hiểu user muốn gì VÀ muốn dùng kỹ thuật nào, TRƯỚC KHI chạy pipeline.

### Bước 1: Chạy Preflight

```bash
cd E:/tvk/OpenMontage
python -c "
from tools.tool_registry import registry
import json
registry.discover()
print(json.dumps(registry.provider_menu(), indent=2))
"
```

Trình bày capability menu cho user:

```
NĂNG LỰC HIỆN TẠI

  Video Generation:  X/Y configured
  Image Generation:  X/Y configured
  Text-to-Speech:    X/Y configured
  Music Generation:  X/Y configured
  Composition:       X/Y configured
  Enhancement:       X/Y configured
  Avatar:            X/Y configured
```

### Bước 2: Hỏi User Về Ý Tưởng

Hỏi từng câu một, ưu tiên multiple choice:

**Câu 1: Chủ đề / Mục đích video là gì?**

**Câu 2: Audience — ai xem video này?**
- Developer, business owner, gen Z, học sinh...

**Câu 3: Platform & format?**
- YouTube 16:9, TikTok 9:16, Instagram Reels 9:16, LinkedIn 16:9...

**Câu 4: Thời lượng?**
- 15s, 30s, 45-60s, 90s, 2-3 phút...

### Bước 3: Hỏi User Về Kỹ Thuật Muốn Dùng

Dựa trên capability menu ở Bước 1, hỏi user chọn kỹ thuật cho từng layer. Chỉ hỏi những capability có nhiều hơn 1 provider available, hoặc có lựa chọn quan trọng.

**Câu 5: Visual — bạn muốn dùng kỹ thuật gì cho hình ảnh?**

Trình bày các option available, ví dụ:
- A) Ảnh stock (Pexels/Pixabay) — free, ảnh thật
- B) AI generate (FLUX/DALL-E/Imagen) — $0.01-0.05/ảnh, tuỳ chỉnh được
- C) Remotion animated components (text card, stat card, chart) — free, motion graphics
- D) Mix — stock + AI + Remotion tuỳ scene
- E) Tự cung cấp ảnh/video

Nếu user chọn AI gen, hỏi thêm provider preference nếu có nhiều option.

**Câu 6: Giọng đọc (TTS)?**
- A) Không cần lồng tiếng
- B) ElevenLabs — chất lượng cao, ~$0.015/1K chars
- C) OpenAI TTS — multilingual, ~$0.015/1K chars
- D) Google TTS — free tier 1M chars/tháng
- E) Piper (local) — free, chất lượng trung bình
- F) Tự cung cấp file audio

Chỉ show option nào AVAILABLE trong registry. Nếu chỉ có 1 provider → tự chọn, thông báo cho user.

**Câu 7: Nhạc nền?**
- A) Không cần nhạc
- B) Chọn từ music_library/ (nếu có tracks)
- C) Pixabay Music — free, không cần API key
- D) AI generate (Suno/ElevenLabs Music) — nếu available
- E) Tự cung cấp file nhạc

**Câu 8: Video generation (nếu cần clip video)?**
- Chỉ hỏi nếu concept cần video clips (trailer, cinematic, talking head...)
- List các provider available: Kling, Runway, HeyGen, LTX, WAN, etc.
- Kèm giá mỗi provider

**Câu 9: Phong cách visual (playbook)?**
- A) Clean Professional — corporate, education, SaaS
- B) Flat Motion Graphics — social media, TikTok, startups
- C) Minimalist Diagram — technical deep-dives
- D) Custom — mô tả phong cách riêng

**Câu 10: Composition engine?**
- A) Remotion — animated text cards, charts, spring physics (nếu available)
- B) FFmpeg — Ken Burns pan-zoom trên ảnh tĩnh
- C) Để agent tự chọn tuỳ content

### Bước 4: Xác Nhận Tổng Hợp

Sau khi hỏi xong, tổng hợp lại toàn bộ lựa chọn:

```
TÓM TẮT YÊU CẦU

  Chủ đề:        [...]
  Audience:       [...]
  Platform:       TikTok 9:16
  Thời lượng:     30-45s
  Visual:         Stock ảnh Pexels + Remotion text cards
  Giọng đọc:      ElevenLabs Vietnamese
  Nhạc:           Pixabay Music — ambient
  Playbook:       Flat Motion Graphics
  Composition:    Remotion
  
  Estimated cost: $0.15-0.30
```

User confirm → chuyển sang Phase 1.

---

## Phase 1: Research

**Đọc trước:** Stage director skill của pipeline được chọn (`skills/pipelines/<pipeline>/research-director.md` hoặc `idea-director.md`).

**Mục đích:** Thu thập data, audience insights, trending angles — TRƯỚC KHI viết bất kỳ nội dung nào.

**Canonical artifact:** `research_brief.json` hoặc `brief.json`

**Nội dung research:**
1. Content landscape — video/bài viết nào đã có? Gap ở đâu?
2. Trending — chuyện gì đang hot liên quan đến chủ đề?
3. Data points — ít nhất 3-5 facts có source, số liệu cụ thể
4. Audience insights — câu hỏi thật từ forum, misconceptions, pain points
5. Angles — ít nhất 3 góc tiếp cận khác nhau

**Human approval:** KHÔNG (informational only)

**Checkpoint:** CÓ — lưu artifact, không cần user approve

---

## Phase 2: Proposal

**Đọc trước:** `skills/pipelines/<pipeline>/proposal-director.md`

**Mục đích:** Đề xuất 3+ concept khác nhau, kèm cost estimate và production plan chi tiết.

**Canonical artifact:** `proposal_packet.json`

**Nội dung:**
1. **3+ concept options** — mỗi concept có hook, narrative structure, visual approach, duration, playbook
2. **Production plan** cho concept được chọn — tools cụ thể, provider, cost per tool
3. **Music plan** — bắt buộc, surface sớm (đừng để đến stage assets mới phát hiện)
4. **Cost estimate** — itemized per-tool, tổng cost, so sánh với budget cap
5. **Quality/cost tradeoffs** — premium vs standard vs budget vs free paths

**Trình bày cho user:**
- Lead với recommended concept
- Giải thích trade-offs
- Chờ user chọn concept + approve budget

**Human approval:** CÓ — **CRITICAL GATE**. Pipeline KHÔNG ĐƯỢC tiến nếu chưa có approval.

**Checkpoint:** CÓ

---

## Phase 3: Script

**Đọc trước:** `skills/pipelines/<pipeline>/script-director.md`

**Mục đích:** Viết kịch bản hoàn chỉnh với timing, speaker directions, và enhancement cues.

**Canonical artifact:** `script.json`

**Nội dung:**
1. **Narrative arc:** HOOK (0-5s) → SETUP → BUILD → CLIMAX → LANDING
2. **Sections** với timing chính xác (start_seconds, end_seconds)
3. **Full narration text** — word budget = 150 wpm × duration
4. **Enhancement cues** — visual gì cần tạo cho mỗi section (ít nhất 1 cue mỗi 8-10s)
5. **Speaker directions** — tone, pace, emphasis

**Validation:**
- Word count ±10% so với target duration
- Enhancement cue density: 1 per 8-10s
- Narrative arc đầy đủ

**Human approval:** CÓ

**Checkpoint:** CÓ

---

## Phase 4: Scene Plan

**Đọc trước:** `skills/pipelines/<pipeline>/scene-director.md`

**Mục đích:** Chuyển script thành visual scenes cụ thể, xác định asset cần generate.

**Canonical artifact:** `scene_plan.json`

**Nội dung:**
1. **Scenes** — mỗi script section → 1-3 visual scenes
2. **Scene types** — chọn từ library: hero_title, stat_card, bar_chart, line_chart, pie_chart, kpi_grid, comparison, callout, text_card, typewriter, anime_scene, generated (AI image), diagram, broll...
3. **Transitions** — fade, dissolve, cut
4. **Required assets** — mỗi scene list rõ cần generate gì (image prompt, diagram spec, etc.)
5. **Duration coverage** — KHÔNG có gap

**Validation:**
- Full duration covered, no gaps
- Visual variety: không 3+ scene liên tiếp cùng type
- Mỗi required_asset dùng tool có trong production plan

**Human approval:** CÓ

**Checkpoint:** CÓ

---

## Phase 5: Assets

**Đọc trước:** `skills/pipelines/<pipeline>/asset-director.md`
**Đọc thêm:** Layer 3 skill của TỪNG tool trước khi gọi (check `agent_skills` field)

**Mục đích:** Generate tất cả assets: TTS, images, music, video clips.

**Canonical artifact:** `asset_manifest.json`

**Quy trình:**

1. **Inventory** — list tất cả assets cần generate, estimate cost
2. **Budget check** — tổng cost ≤ approved budget?
3. **Sample preview** — trước khi batch generate:
   - TTS: generate 1 section → user confirm voice/pace
   - Image: generate 1 ảnh → user confirm style
   - Music: 1 clip → user confirm mood
   - Max 3 iterations mỗi loại
4. **Batch generate** — sau khi user approve samples
5. **Build manifest** — path, duration, cost, source_tool cho mỗi asset

**QUAN TRỌNG — Narration Duration Feedback Loop:**
Sau khi generate TTS, probe actual duration. Nếu actual > planned × 1.15:
- Option A: Quay lại Phase 3 sửa script (giảm word count)
- Option B: Adjust scene_plan timing (nếu chênh lệch ≤ 25%)

**Human approval:** KHÔNG (auto-proceed nếu budget OK)

**Checkpoint:** CÓ

---

## Phase 6: Edit

**Đọc trước:** `skills/pipelines/<pipeline>/edit-director.md`

**Mục đích:** Tạo Edit Decision List — map assets lên timeline.

**Canonical artifact:** `edit_decisions.json`

**Nội dung:**
1. **Cuts** — visual nào hiện khi nào (source, in/out seconds, layer, transition)
2. **Subtitles** — word-by-word timing từ narration audio
3. **Audio config** — narration segments + music (volume, fade, ducking)
4. **Timeline verification** — 0 đến total_duration, không gap, không overlap

**Human approval:** KHÔNG

**Checkpoint:** CÓ

---

## Phase 7: Compose

**Đọc trước:** `skills/pipelines/<pipeline>/compose-director.md`

**Mục đích:** Render video final.

**Canonical artifact:** `render_report.json`

**Quy trình:**

1. **Chọn render engine:**
   - **Remotion** — nếu available VÀ có animated components (text card, chart, stat card...)
   - **FFmpeg** — nếu chỉ có static images + audio

2. **Verify inputs:**
   - Tất cả asset files tồn tại?
   - Narration duration fits video duration?
   - Music covers full duration?

3. **Build props/EDL** → chuyển edit_decisions thành format render engine hiểu

4. **Still frame test** — render 2-3 frame kiểm tra visual trước khi full render

5. **Full render:**
   ```bash
   # Remotion
   npx remotion render src/index.tsx <Composition> --props=<props.json> --output=<output.mp4> --codec=h264
   
   # FFmpeg
   python -c "from tools.video.video_compose import VideoCompose; ..."
   ```

6. **Verify output:**
   - Duration ±5% target
   - Resolution đúng
   - Audio present
   - File playable

**Human approval:** KHÔNG

**Checkpoint:** CÓ

---

## Phase 8: Publish

**Đọc trước:** `skills/pipelines/<pipeline>/publish-director.md`

**Mục đích:** Chuẩn bị metadata, SEO, chapters, export package.

**Canonical artifact:** `publish_log.json`

**Nội dung:**
1. **SEO metadata** — title (max 60 chars), description, tags, hashtags
2. **Chapter markers** — từ script sections
3. **Thumbnail concept** — high contrast, 3-5 words
4. **Export package:**
   ```
   exports/<project>/
     video/output.mp4
     metadata/
       metadata.json
       chapters.txt
       description.txt
       tags.txt
     thumbnails/
       concept.json
   ```

**Human approval:** CÓ — không gì được publish mà chưa có approval

**Checkpoint:** CÓ

---

## Chọn Pipeline

| Yêu cầu | Pipeline | Stages |
|----------|----------|--------|
| Explainer / education / topic-based | `animated-explainer` | 8 (có research + proposal) |
| Animation-first / motion graphics | `animation` | 8 (có research + proposal) |
| Talking head / speaker-led | `talking-head` | 7 |
| Screen recording / demo | `screen-demo` | 7 |
| Nhiều clip từ 1 source dài | `clip-factory` | 7 |
| Podcast highlights | `podcast-repurpose` | 7 |
| Cinematic / trailer / mood-led | `cinematic` | 7 |
| Footage + support visuals | `hybrid` | 7 |
| Avatar / lip sync presenter | `avatar-spokesperson` | 7 |
| Dịch / dub video có sẵn | `localization-dub` | 7 |

Nếu user không rõ → recommend `animated-explainer` (full pipeline, phù hợp nhất cho content từ ý tưởng).

---

## Protocols Xuyên Suốt

### Review Protocol

Sau MỖI phase:
1. Schema validation — artifact hợp lệ?
2. Review focus — check items từ pipeline manifest
3. Success criteria — tất cả criteria met?
4. Playbook rules — colors, transitions, pacing đúng?
5. Quyết định: PASS / REVISE (max 2 rounds) / PASS_WITH_WARNINGS

### Checkpoint Protocol

Sau review pass:
1. Lưu checkpoint JSON: `projects/<project>/checkpoint_<stage>.json`
2. Nếu `human_approval_default: true` → trình bày summary, chờ user approve/revise/abort
3. Nếu approved → `get_next_stage()` → chạy phase tiếp

### Decision Communication Contract

Trước MỌI tool call tốn tiền:
- Thông báo: tool name, provider, model, lý do chọn, sample hay batch
- KHÔNG tự ý đổi provider/model mà không hỏi user
- Nếu bị block → báo ngay, đề xuất alternatives, chờ user approve

### Layer 3 — Bắt Buộc Đọc Trước Khi Gọi Tool

Mỗi generation tool có `agent_skills` field. **PHẢI đọc** skill tương ứng trước khi viết prompt:
- Image gen → đọc `flux-best-practices`, `bfl-api`
- Video gen → đọc `ai-video-gen`, `ltx2`
- TTS → đọc `text-to-speech`, `elevenlabs`
- Music → đọc `music`, `acestep`
- Remotion → đọc `remotion-best-practices`, `remotion`
- Diagram → đọc `beautiful-mermaid`

Sự khác biệt giữa prompt generic và prompt được inform bởi Layer 3 skill = sự khác biệt giữa "tạm được" và "chuyên nghiệp".

---

## Checklist Nhanh

Trước khi bắt đầu bất kỳ video nào:

- [ ] Chạy preflight — biết tools nào available
- [ ] Hỏi user về ý tưởng (từng câu một)
- [ ] Hỏi user về kỹ thuật muốn dùng (visual, TTS, music, engine)
- [ ] Tổng hợp lựa chọn → user confirm
- [ ] Chọn pipeline phù hợp
- [ ] Đọc pipeline manifest
- [ ] Chạy từng phase theo thứ tự
- [ ] Đọc stage director skill TRƯỚC mỗi phase
- [ ] Đọc Layer 3 skill TRƯỚC mỗi tool call
- [ ] Review + checkpoint sau mỗi phase
- [ ] Human approval ở các phase: proposal, script, scene_plan, publish

**KHÔNG BAO GIỜ:**
- Skip phase
- Gộp nhiều câu hỏi
- Gọi tool mà không đọc Layer 3 skill
- Tự ý đổi provider mà không hỏi
- Render mà chưa có approval trên script + scene plan
- Bypass preflight, checkpoint, hay review
