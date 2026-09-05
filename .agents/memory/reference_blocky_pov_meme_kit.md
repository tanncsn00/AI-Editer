---
name: blocky-pov-meme-kit-rig-roblox-style-thu-n-code
description: "Bộ dựng video 3D low-poly kiểu Roblox (tham chiếu @ricarroyt) trong remotion-composer. KHÔNG dùng file model 3D — toàn bộ nhân vật sinh bằng boxGeometry, thêm nhân vật = thêm preset màu."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 337d5b26-65b4-47f5-8ae0-a5c94e492c1a
  modified: 2026-08-25T01:01:31.631Z
---

Kit dựng video **3D low-poly kiểu Roblox** (POV meme bẩn bựa), build 2026-08-21 trong `remotion-composer/`.

**Điểm cốt lõi: KHÔNG có file model 3D nào.** Không `.glb`, không Blender. Nhân vật Roblox vốn LÀ các khối hộp nên sinh hết bằng `<boxGeometry>`. Thêm nhân vật mới = thêm **một preset màu ~8 dòng**.

| File | Nội dung |
|---|---|
| `src/fx/BlockyRig.tsx` | Nhân vật: rig phân cấp (đầu/thân/tay/chân), 6 mặt (`neutral/angry/shock/smug/dead/grin`), tai sói/tròn, mõm, tóc dài + nơ, gi-lê. `BlockyCam` để set camera từng frame. |
| `src/fx/BlockyProps.tsx` | `Room` (sàn caro), `Toilet`, `Stall`, `Door`, `StinkCloud`, `Flies`, `StinkLines`, `Geyser`, `Puddle`, `Drips` |
| `src/fx/BlockyStage.tsx` | `frameSubject` (tự tính camera, luôn nằm dưới dải tiêu đề), `faceCamera` (yaw hướng mặt về camera), `tumble` (xoay quanh TÂM người), `centroid`/`spreadX` cho nhiều nhân vật |
| `src/BlockyCharSheet.tsx` · `src/BlockyStageTest.tsx` | Comp kiểm chứng |

**4 bug đã trả giá, đã có helper chặn — đừng tự tính camera bằng tay nữa:**
- `camera` prop của `ThreeCanvas` **bỏ qua trục Y** → phải dùng `BlockyCam`
- Chữ tiêu đề **đè lên đầu** nhân vật → `frameSubject` có `TITLE_SAFE`
- Nhân vật **quay lưng vào camera** ở đúng cảnh đắt nhất → `faceCamera`
- Cú văng xoay quanh **bàn chân** nên bay ra ngoài khung → `tumble`

**⚡ Render chậm là do copy `public/` 2 GB mỗi lần.** Thêm `--public-dir=<thư mục rỗng>` khi comp không đọc `staticFile` → **900 frame full-res còn ~41 giây** (trước đó ~90 giây cho MỘT frame).

Video đầu tiên: `projects/pov-noflush/` (30.0s, SFX-only). Video tham chiếu gốc lưu ở `projects/pov-noflush/ref/ricarroyt_reference.mp4`.

Liên quan: [[feedback_brainrot_user_writes_beats]] · [[feedback_export_nobgm_tiktok]]
