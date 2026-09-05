---
name: reference_blueprint_skill
description: "Blueprint tech-video skill — navy+grid+amber engineering vibe, fully animated voice-synced"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
  modified: 2026-08-14T04:50:01.485Z
---

Skill `.claude/skills/blueprint-tech-video` cho video kỹ thuật/tech-explainer/truyền kỳ-tech vibe **Architectural Blueprint**: nền navy #0F1B2E + lưới đo đạc + amber #FFC857 + scanline + corner brackets, **fully animated voice-synced reveals** (useFadeUp/useScaleIn), 8 figure (fig.X), bracket-corner TechBox. JetBrains Mono cho label kỹ thuật + Be Vietnam Pro cho content.

**Golden refs:** `ClaudeOpus48Blueprint.tsx` (truyền kỳ tech-release), `CodingTangThapNhat.tsx` (explainer gốc), `EngineerSongSotAi.tsx` (listicle + green/purple/orange accent).

**CRITICAL BUG (đã dính 2 lần):** KHÔNG mix `transform="translate()"` (SVG attr) + `style={useFadeUp()}` (CSS transform) trên cùng `<g>` → CSS đè SVG, element nhảy về góc (0,0). Fix: g có transform attr → dùng `opacity={anim.opacity}` only; g cần scale-in → KHÔNG transform attr, dùng transformOrigin+transformBox, đặt con bằng toạ độ tuyệt đối.

**CĂN GIỮA DỌC (bắt buộc):** content KHÔNG được dồn lên nửa trên khung 1080×1920 (user 2026-06-23 chửi "lệch hết ko flex ra giữa"). Nội dung mỗi slide phải nằm giữa khung dọc. Vì SectionHeader (top ~180) + FigFooter/BrandMark (bottom ~1780) cố định, bọc TẤT CẢ content giữa chúng trong `<g transform="translate(0, ~330-380)">` để đẩy xuống giữa (slide có Hero/nhiều box dùng ~330, slide thưa ~380, CTA ~150). Wrap group translate (SVG attr) bọc NGOÀI group có `style` scale/opacity là AN TOÀN (khác element, không dính bug transform). Tự test still ở frame ~88% beat (đã populate hết) để soi căn giữa, đừng test frame đầu beat (chưa hiện item → tưởng lệch).

Render cần **Node ≥16** (`nvm use 24`, path `C:\Users\tranv\AppData\Local\nvm\v24.14.0`) — default shell có Node 14 sẽ fail Remotion. ⚠️ Chạy `npx remotion` PHẢI `cd` vào `remotion-composer` trước (thư mục khác → "could not determine executable to run"). Render nhiều still song song → giành copy public 2GB → npm error; chạy tuần tự.

Variant của [[reference_truyen_ky_skill]] (tu tiên purple/gold) — cùng pipeline TTS Adam + whisper verify (speed theo [[feedback_tts_speed_1x]]), khác visual lock.
