---
name: reference_neon_pov_style
description: Style neon (karaoke + creator vibrant) ngoài blueprint + workflow ui-ux-pro-max — golden ref pov-ktv, pov-creator
metadata: 
  node_type: memory
  type: reference
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
  modified: 2026-08-13T04:27:01.778Z
---

⭐ **WORKFLOW ĐỔI STYLE (khi user chê blueprint "nhàn quá"):** dùng skill `/ui-ux-pro-max:ui-ux-pro-max` (plugin cache, script ở `…/2.5.0/src/ui-ux-pro-max/scripts/search.py`, gọi `python <script> "<vibe>" --design-system` + `--domain color/style/typography`) để DERIVE design system mới (style category + palette + font + effects). 2026-06-30 user bảo "dùng skill này làm slide đẹp hơn cái cũ nhàn quá" → ra **Vibrant & Block-based × Dark/OLED** cho pov-creator. ⚠️ Skill recommend font (Righteous/Poppins…) nhưng GIỮ **Be Vietnam Pro** vì tiếng Việt cần đủ dấu — chỉ mượn style/palette/effects, không mượn font.

**Style DARK HUD / Sci-Fi FUI** (TSX `PovCreator.tsx` + thumbnail, golden ref `projects/pov-creator/`, POV Content Creator, 2026-06-30): nền void xanh-đen `#060B14` · **Tron perspective floor grid** (lines hội tụ về vanishing point) + tech grid mảnh · **HUD corner brackets** (góc khung + góc mỗi panel) · scanline sweep động · "REC ●" góc trên · `Card` = glass panel (fill translucent 0.72 + viền mảnh + 4 corner bracket) · `cTextGlow` filter cho chữ glow theo màu fill. **Palette cohesive:** base cyan `#2BE2FF` + holo blue `#3E8FE0`, accent SEMANTIC: đỏ `#FF5470` (alert/danger), amber `#FFB347` (nhấn), teal `#2EE6C2` (win) — KHÔNG rainbow.
⚠️ **Bài học (user 2026-06-30):** bản ĐẦU làm Vibrant Neon (aurora tím-hồng-cyan rainbow) → user chê **"màu mè quá"**, yêu cầu "màu tối theme tương lai hiệu ứng công nghệ" → đổi sang HUD/FUI cohesive cyan. ⇒ Khi user muốn "đẹp/xịn" cho tech/trẻ → ưu tiên **HUD sci-fi cohesive 1 màu chủ + accent semantic**, TRÁNH rainbow nhiều màu rực. Query ui-ux-pro-max `--domain style "dark futuristic HUD sci-fi"` ra đúng "HUD / Sci-Fi FUI" (thin 1px cyan, brackets, mono). Giữ Be Vietnam Pro. CĂN GIỮA: bọc content mỗi slide `translate(0, DY 50-140)`.
---

Style visual **NEON KARAOKE** (TSX `PovKtv.tsx` + `PovKtvThumbnail.tsx`, golden ref `projects/pov-ktv/`, 2026-06-25): nền tím-đen `#0B0613` · glow hồng `#FF2D95` / tím `#B24BF3` / cyan `#2DE2FF` / gold `#FFD24A` · **equalizer bar động** dưới đáy (sin theo frame) · bokeh club lights mờ · neon corner frame · `NeonCard` = rect glow (fill color opacity 0.12) + rect viền. Dùng cho chủ đề **đêm khuya / quán bar / dịch vụ / giải trí** — KHÁC blueprint navy+amber (dành cho IT).

Format **POV-NGHỀ tu-tiên-hóa NGOÀI IT**: cùng công thức [[reference_truyen_ky_it_skill]] (nhân cách hóa, kiếp có tên + công pháp + reveal, nhân quả vi mô, deadpan, running gag, kết tier cảnh giới) nhưng áp cho nghề thường (tiếp viên, bảo vệ, shipper, lễ tân, bartender…). pov-ktv: tiếp viên KTV = "Bán Tiếu Chân Nhân"; mỗi loại khách = 1 thiên kiếp (Túy Khốc/Hư Vinh/Si Mộng/Hà Tiện/Ma Âm Kiếp); công pháp nhập môn (Bất Diệt Tiếu Diện/Thiên Bôi Bất Đảo/Tứ Lạng Bạt Thiên Cân); running gag "dạ anh" + "thêm một tăng nữa".

**Bài học tone (user dạy qua 3 vòng sửa, 2026-06-25):** (1) chủ đề nhạy cảm (gái KTV) → giữ tasteful, KHÔNG 18+, KHÔNG miệt thị; "đi tăng 2" xử lý bằng công pháp NÉ khéo. (2) user CHỐT **full meme nhân quả, BỎ đạo lý sướt mướt** ("bỏ đạo lý đi lấy nhân quả meme như bình thường") — kết bằng tier cảnh giới hài, không giảng đạo. (3) CẤM liệt kê "khách thứ 1/2/3" — phải kể HÀNH TRÌNH nối câu ("Đêm nọ…/Lại một đêm khác…/Con kiếp nguy hiểm nhất…").

⚠️ POV nữ nhưng vẫn dùng voice Adam (nam) vì không có voice nữ EverAI sẵn (user chấp nhận). Nếu sau này có voice nữ → ưu tiên cho POV nữ.

Pipeline + sync giống hệt [[feedback_sync_voice_workflow]] · [[reference_blueprint_skill]] (chỉ khác lớp visual).
