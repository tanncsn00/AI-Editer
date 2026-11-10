---
name: azbot-brand
description: "Bộ quy chuẩn thương hiệu AZbot (AI trực page / chatbot bán hàng của AIBUS) cho TikTok + Facebook: định vị Shop-owner-first, tagline 'Không ai bán hàng một mình.', bio, giọng nói, hình ảnh, mascot robot trắng-cam, 4 series (Đại chiến Inbox · Khách nói – Shop hiểu · Tin nóng chủ shop · Hậu trường đồng hành), công thức video 1:00–1:30, khung kết dùng chung, câu gợi nhắn tin + chữ khoá. Dùng MỖI KHI làm video, kịch bản, caption, thumbnail, bài Facebook, ảnh cover hay bất kỳ nội dung nào cho AZbot / AZChatbot / azbotchatbotai, để mọi thứ thống nhất."
---

# AZbot · Brand skill

Skill này giữ **tính thống nhất** cho mọi nội dung AZbot. Đây là quyết định đã chốt qua workshop 10/11/2026 — không tự đổi; muốn đổi thì hỏi user.

Pipeline dựng/TTS/sync vẫn đi qua `video-production-gate`. Skill này lo **thương hiệu + nội dung + khung kết**, không thay gate.

Chiến lược nội bộ (KPI, bàn giao sale, đối thủ, câu hỏi để mở): `references/strategy.md` nếu có trong máy; bản đầy đủ ở `.local/azbot-brand/` (gitignored).

---

## 1. Nền tảng — đã CHỐT

| Thành phần | Nội dung |
|---|---|
| Định vị | **Shop-owner-first**: kênh hiểu nghề bán hàng online — nói về đúng điều chủ shop đang lo, công nghệ là bằng chứng. KHÔNG phải kênh "kinh doanh" chung chung, KHÔNG phải catalogue chatbot. |
| Khán giả | Chủ shop online & người vận hành shop **trên mọi kênh bán** (không nhấn mạnh riêng Facebook). |
| Khác biệt | "AZbot hiểu chuyện inbox của chủ shop — chạy ngay trong công cụ shop đang dùng, và có người đồng hành chỉnh bot tới khi nó trả lời đúng ý bạn." (A tính cách người trong nghề · B không đổi quy trình · C đội dịch vụ đồng hành tới khi đúng ý) |
| **Tagline** | **Không ai bán hàng một mình.** — nguyên câu, không biến tấu. Ký tên phụ khi cần nhắc tên: "Đồng hành từ A đến Z". |
| **Bio** | Đồng hành cùng chủ shop từ tin nhắn đầu tiên 🧡 / Gặp khách khó? Có AZ lo 👇 |
| Câu mời mặc định | **Gặp khách khó? Có AZ lo 👇** |
| Hashtag thương hiệu | **#KhongAiBanHangMotMinh** (dòng cuối mọi caption) |
| Tên hiển thị | Chưa chọn: "AZbot · Bạn đồng hành chủ shop" hoặc "Chuyện nghề kinh doanh online" (TikTok ≤30 ký tự). Hỏi user trước khi dùng. |
| Kênh | TikTok **@azbotchatbotai** + Fanpage Facebook, chạy song song. Instagram tạm bỏ. Website chỉ gắn bio khi đủ follower. |

## 2. Giọng nói

| Nên | Không nên |
|---|---|
| Xưng "mình – anh chị chủ shop", nói như người trong nghề | Giọng giảng bài, giọng doanh nghiệp |
| Hài kiểu dân buôn bán, tình huống thật | Thuật ngữ AI không giải thích |
| Thẳng thắn, nói cả cái AI chưa làm được | Hứa "AI thay toàn bộ nhân viên", số liệu không nguồn |
| Một video · một ý · một lời mời nhắn tin | Dồn tính năng, ép mua |

**Cấm tuyệt đối trên video / caption TikTok:** giá, "miễn phí", "dùng thử", khuyến mãi, số gói (TikTok bóp/gỡ). Offer chỉ do sale nói trong tin nhắn.

## 3. Hình ảnh

- Nền **giấy nhàu be**, chữ tiêu đề **Anton cam #FF8A00 viền nâu #3B1D06** gõ từng chữ, pill cam chữ trắng lướt vào có motion blur, sticker 3D (Fluent 3D Emoji, MIT), chat Messenger / khung bình luận dựng bằng code. Mẫu tham chiếu: `remotion-composer/src/DaiChienInbox.tsx`.
- **Mascot duy nhất:** robot trắng-cam có chữ "AZbot" trên ngực. Tư thế có sẵn (nền trong suốt, tách bằng code): ăn mừng `azbot_an_mung.png` · đội dịch vụ cầm cờ lê `azbot_doi_dich_vu_co_le.png` (dùng cho lời hứa đồng hành) — đặt ở `remotion-composer/public/azbot-brand/`. Robot nón lá cờ Việt Nam: kiểu vẽ khác, chỉ dịp lễ. Robot tím trên trang chat website: KHÔNG dùng.
- Logo + tagline chỉ ở **khung kết**, không đóng dấu suốt video, không đặt ở 3 giây đầu.
- Chữ trên hình là **chữ khoá**, không chép nguyên câu thoại.

## 4. Nội dung

### Pillar (3 vòng)
| Vòng | Pillar | Tỷ lệ |
|---|---|---|
| Lõi 50% | Chuyện inbox | 30% |
| | Giải mã khách | 20% |
| Giữa 30% | Vận hành shop (phí sàn ~25%, chi phí người trực page, ads ra tin nhắn, mùa sale/Tết) | 20% |
| | Hậu trường đồng hành (đội chỉnh bot, trước/sau) | 10% |
| Ngoài 20% | Tin nóng chủ shop (thuế, luật TMĐT, chính sách) | 20% |

### 4 series
| Series | Hình thức | Câu gợi nhắn tin (khung kết + caption) | Chữ khoá |
|---|---|---|---|
| **Đại chiến Inbox** | Motion graphic, thuyết minh hùng tráng pha hài kiểu phim tài liệu chiến tranh | Shop bạn đã gặp 'vị khách' này chưa? Nhắn kể mình nghe 👇 | ĐẠI CHIẾN |
| **Khách nói – Shop hiểu** | Khách nói X → thật ra nghĩa là Y → shop nên đáp Z (công thức Mật Ngôn — xem `mat-ngon-script`) | Khách shop bạn hay nói câu gì khó đỡ? Nhắn mình giải mã 👇 | GIẢI MÃ |
| **Tin nóng chủ shop** | Chữ khoá + số hiệu văn bản, kết bằng câu kéo về inbox | Shop bạn đang lo khoản nào? Nhắn mình 👇 | TIN NÓNG |
| **Hậu trường đồng hành** | Quay màn hình trước/sau khi đội chỉnh bot, mascot cờ lê | Muốn bot trả lời đúng giọng shop bạn? Nhắn mình 👇 | ĐÚNG Ý |

### Công thức mọi video — **1:00–1:30**
```
HOOK ≤3s có chữ  →  TÌNH HUỐNG chủ shop nào cũng gặp  →  GÓC NHÌN người trong nghề  →  KHUNG KẾT
(nỗi đau / nghịch lý)                                                                   mascot + logo + tagline + 'ting'
                                                                                         + câu gợi nhắn tin + chữ khoá
```
- Series kể chuyện (Đại chiến Inbox, Khách nói – Shop hiểu): người dẫn **đọc tagline làm câu chốt câu chuyện** ("…nhưng không ai bán hàng một mình."). Tin nóng / Hậu trường: chỉ chữ ở khung kết.
- Video vòng ngoài (thuế, luật) vẫn phải kết bằng một câu kéo về inbox / đơn hàng.

### Quy tắc nguồn — series Tin nóng
- Chỉ văn bản gốc (Luật / Nghị định / Thông tư — ghi số hiệu + ngày) hoặc cổng chính thức.
- Số liệu các nguồn còn mâu thuẫn → KHÔNG nêu (vd ngưỡng miễn thuế 500 triệu hay 1 tỷ).
- Không tư vấn từng trường hợp; cuối video: "Thông tin tham khảo, kiểm tra lại với cơ quan thuế."

## 5. Khung kết dùng chung

Component `remotion-composer/src/azbot/AZbotEndCard.tsx` (3 giây, 90 frame @30fps), composition `AZbotEndCard` (mặc định) và `AZbotEndCardDaiChien`.

Props: `cta` (câu gợi nhắn tin **không kèm 👇** — component tự vẽ mũi tên), `keyword?` (chữ khoá series → dòng "Nhắn KEYWORD cho mình"), `sting` (tiếng "ting" nhận diện; hiện tạm dùng `sfx/ui/iphone-ding.mp3`).

Thứ tự hiện: robot ăn mừng nảy vào → logo quét ra → tagline từng chữ ("MỘT MÌNH." tô cam) → pill câu mời → chữ khoá → mũi tên 👇. Vùng dưới ~400px để trống cho UI TikTok/Facebook.

Dùng trong video mới: ghép `<AZbotEndCard cta=… keyword=… sting />` vào 90 frame cuối (Sequence), `--public-dir` tạm phải chứa `azbot-brand/` và `sfx/`.

## 6. Đăng & caption

- Cùng 1 file 9:16 lên **TikTok + Facebook**, **20:30**, upload file gốc lên từng nền tảng (không dùng file tải từ TikTok có watermark). Luôn bản **không nhạc nền bản quyền**, giữ SFX.
- Caption TikTok: ngắn, có chữ khoá, hashtag, dòng cuối #KhongAiBanHangMotMinh. Caption Facebook: dài hơn được, CTA "nhắn Messenger".
- Profile: bio ở mục 1 · 3 video ghim (hay nhất · "AZbot là ai" · bằng chứng bot chạy thật) · ẩn (không xoá) video có giá.
- Fanpage: ảnh cover = mascot + tagline + "Gặp khách khó? Có AZ lo"; câu đầu phần giới thiệu = tagline.

## 7. Phân vai

Marketing lo video → profile → **người xem bấm nhắn tin**. **Đội sale trả lời tin nhắn**, lọc khách, ghi nguồn (chữ khoá / "biết AZbot qua đâu"). KPI marketing dừng ở **số người thật sự gửi tin**.

## 8. Checklist trước khi giao một video AZbot

- [ ] Hook ≤3 giây có chữ; độ dài 1:00–1:30
- [ ] Không giá / miễn phí / dùng thử / khuyến mãi
- [ ] Đúng giọng "mình – anh chị chủ shop"; số liệu có nguồn
- [ ] Che tên, SĐT, địa chỉ khách (video hậu trường / demo)
- [ ] Tin nóng: có số hiệu văn bản + câu "thông tin tham khảo"
- [ ] Khung kết đủ: mascot + logo + tagline + câu gợi nhắn tin đúng series + chữ khoá
- [ ] Bản không nhạc bản quyền; caption có #KhongAiBanHangMotMinh
- [ ] Đi đủ `video-production-gate` (TTS per-line, sync timeline, verify cặp frame, deliverables)
