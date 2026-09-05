---
name: feedback-export-nobgm-tiktok
description: "LUÔN xuất bản không nhạc để đăng TikTok — nhúng nhạc bản quyền bị chặn phân phối, 0 view (đã kiểm chứng 2026-08-14)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: de89418b-8cb4-4201-9c0e-19a68e6c18d2
  modified: 2026-08-21T09:42:34.819Z
---

Mỗi video đăng TikTok phải xuất **2 bản**: `final_bgm.mp4` (duyệt nội bộ) và `final_nobgm.mp4` (bản đăng thật, chỉ giọng đọc + SFX). Bản đăng luôn là bản không nhạc, user tự chọn sound trong app.

**Why — đã kiểm chứng thật, không phải suy đoán:** video nhúng nhạc remix có bản quyền bị **0 view**, chặn hẳn khỏi luồng đề xuất. Gỡ nhạc ra, chọn sound trong app → lên view bình thường ngay. Hậu quả nặng hơn "bị mute" như tài liệu mô tả: TikTok chặn phân phối chứ không chỉ tắt tiếng.

**How to apply:**
- Component Remotion nhận prop `bgm?: boolean`, đăng ký 2 composition (`X` và `XNoBgm` với `defaultProps={{ bgm: false }}`) → render 2 lần, không phải dựng lại.
- GIỮ lại SFX (tiếng vịt, whoosh…) trong bản nobgm — đó là hiệu ứng thuộc nội dung, không phải nhạc nền, và không gây chặn.
- Verify bằng `volumedetect` ở mốc chỉ có nhạc (VD giây 1 lúc dạo đầu): bản nobgm phải ra **-91 dB**. Đo mean toàn file KHÔNG phát hiện được lỗi.
- Nhắc user canh đoạn nhạc trong app cho khớp: video thường có vài giây đầu/cuối không lời.

**Tìm sound trong app TikTok (2026-08-21):** nhạc Trung trong `projects/nhac_nen/` phải search bằng **tên gốc chữ Hán**, không phải tên Việt. Gõ `难却` ra ngay, gõ "Nan Khước" trượt hoàn toàn. Luôn đưa user chữ Hán + tên ca sĩ Trung kèm tên Việt khi báo tên nhạc.

Hai nguyên nhân khác khi không thấy sound: (1) tài khoản đang là **Business** → TikTok chỉ cho thấy Commercial Music Library, không có nhạc hot, không override được, phải Switch to Personal Account; (2) search TikTok vốn tệ — cách chắc ăn là mở video khác đã dùng bài đó, bấm đĩa xoay góc dưới phải, Add to Favorites.

**Quy trình nên đảo:** để user chọn sound trong app TikTok TRƯỚC, rồi mới dựng video theo nhịp bài đó. Chọn nhạc từ folder trước rồi mới đi tìm trên app là đi ngược, dễ kẹt.

Xem thêm [[reference-tiktok-nhac-nen-policy]] nếu file đó còn tồn tại.
