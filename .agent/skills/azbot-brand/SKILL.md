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
- Series kể chuyện (Đại chiến Inbox, Khách nói – Shop hiểu): người dẫn **đọc tagline làm câu chốt câu chuyện** ("…nhưng không ai bán hàng một mình."). Tin nóng / Hậu trường: tagline chỉ chữ ở khung kết.
- **Câu CTA LUÔN được đọc thành lời ở MỌI series** (dòng 🔔 cuối script.md), đúng câu gợi nhắn tin của series + chữ khoá. Vd Đại chiến Inbox: `🔔 Shop bạn đã gặp "vị khách" này chưa? Nhắn chữ Đại Chiến, kể mình nghe nhé!`
- Video vòng ngoài (thuế, luật) vẫn phải kết bằng một câu kéo về inbox / đơn hàng.

### Quy tắc nguồn — series Tin nóng
- Chỉ văn bản gốc (Luật / Nghị định / Thông tư — ghi số hiệu + ngày) hoặc cổng chính thức.
- Số liệu các nguồn còn mâu thuẫn → KHÔNG nêu (vd ngưỡng miễn thuế 500 triệu hay 1 tỷ).
- Không tư vấn từng trường hợp; cuối video: "Thông tin tham khảo, kiểm tra lại với cơ quan thuế."

## 5. Khung kết dùng chung

Component `remotion-composer/src/azbot/AZbotEndCard.tsx` (3 giây, 90 frame @30fps), composition `AZbotEndCard` (mặc định) và `AZbotEndCardDaiChien`.

Props: `cta` (câu gợi nhắn tin **không kèm 👇** — component tự vẽ mũi tên), `keyword?` (chữ khoá series → dòng "Nhắn KEYWORD cho mình"), `sting` (tiếng "ting" nhận diện; hiện tạm dùng `sfx/ui/iphone-ding.mp3`), `taglineAt?` (frame trong khung kết bắt đầu hiện tagline, mặc định 18), `ctaAt?` (frame hiện nút CTA, mặc định 46).

**Đồng bộ với lời đọc (bắt buộc khi tagline/CTA được đọc):** khung kết bắt đầu tại `entry(dòng tagline) − END_CARD_TAGLINE_AT` để chữ tagline lên đúng lúc người dẫn đọc; `ctaAt = entry(dòng CTA) − điểm bắt đầu khung kết`; Sequence kéo dài tới hết câu CTA + 1s. Series không đọc tagline: khung kết bắt đầu ~1.5s trước dòng CTA. Mẫu: `OUTRO_START` / `END_CARD_CTA_FRAME` trong `DaiChienInbox.tsx`.

Thứ tự hiện: robot ăn mừng nảy vào → logo quét ra → tagline từng chữ ("MỘT MÌNH." tô cam) → pill câu mời → chữ khoá → mũi tên 👇. Vùng dưới ~400px để trống cho UI TikTok/Facebook.

Dùng trong video mới: ghép `<AZbotEndCard cta=… keyword=… sting />` vào 90 frame cuối (Sequence), `--public-dir` tạm phải chứa `azbot-brand/` và `sfx/`.

## 6. Thumbnail

Component `remotion-composer/src/azbot/AZbotThumbnail.tsx` — mọi video dùng cùng công thức:

```
┌─────────── 1080×1920 (vùng chính 3:4: y 240–1680) ───────────┐
│              [ PILL ĐỎ: TÊN SERIES ]                          │
│          HOOK DÒNG 1 (kem, Anton viền nâu)                   │
│          HOOK DÒNG 2 (cam, to hơn)                            │
│        [ hình bằng chứng: ô chat / số liệu / màn hình ]       │
│  ┌ Gặp khách khó? ┐                    🤖 mascot to          │
│  └ Có AZ lo!      ┘◀                   (cờ lê / ăn mừng)     │
│  AZBOT (logo nhỏ)                                             │
└───────────────────────────────────────────────────────────────┘
```

- Props: `series`, `hookTop`, `hookBottom`, `mascot` (`doi_dich_vu_co_le` | `an_mung`), `bubble?` (mặc định "Gặp khách khó?\nCó AZ lo!"), `children` = hình bằng chứng.
- Hook thumbnail = **nỗi đau bằng chữ người ta tự gõ tìm** (vd "Khách hỏi giá / rồi biến mất"), ≤ 2 dòng, không ghi số tập.
- Mọi thứ quan trọng nằm trong vùng 3:4 (lưới profile TikTok cắt theo tỉ lệ này). Thiết kế riêng, KHÔNG cắt frame từ video.
- Mẫu: `DaiChienInboxThumbnail` trong `DaiChienInbox.tsx`.

## 7. Đăng & caption (SEO)

- Cùng 1 file 9:16 lên **TikTok + Facebook**, **20:30**, upload file gốc lên từng nền tảng (không dùng file tải từ TikTok có watermark). Luôn bản **không nhạc nền bản quyền**, giữ SFX.

### Công thức caption TikTok (5 dòng)
```
L1  <cụm từ khoá người ta gõ tìm> — <hook>            (≤ 70 ký tự, feed chỉ hiện ~60–70)
L2  1 câu kể tiếp tình huống / con số trong video
L3  Câu gợi nhắn tin của series + "Nhắn <CHỮ KHOÁ>" 👇
L4  Dòng từ khoá tự nhiên: "Chuyện thật nghề bán online · <từ khoá 1> · <từ khoá 2>"
L5  8 hashtag theo công thức bên dưới
```
TikTok Search đọc caption + chữ trên hình + lời đọc → cụm từ khoá chính (vd "chủ shop", "khách hỏi giá") phải có ở L1, trên hình và trong lời đọc 3 giây đầu.

### Bộ hashtag (8 cái, đúng thứ tự)
| Tầng | Số lượng | Chọn từ |
|---|---|---|
| Thương hiệu | 2 · luôn có | **#azbot #KhongAiBanHangMotMinh** |
| Danh mục | 2 | #chatbotbanhang #aitrucpage #chatbot #AIbanhang #traloitinnhantudong |
| Khán giả | 2 | #chushop #banhangonline #kinhdoanhonline #chushoponline |
| Series | 1 | #daichieninbox · #khachnoishophieu · #tinnongchushop · #hautruongdonghanh |
| Chủ đề tập | 1 | theo nội dung tập (vd #khachhoigia #phiship #thuekhoan) |

Không dùng #fyp #xuhuong #viral. Không hashtag có chữ "miễn phí", "free", "sale".

### Caption Facebook
L1 giống TikTok · 1 đoạn kể dài hơn · CTA "Nhắn Messenger chữ <CHỮ KHOÁ>" · dòng tagline "Không ai bán hàng một mình." · 4 hashtag: #azbot #KhongAiBanHangMotMinh + series + 1 khán giả.

Mẫu đầy đủ: `projects/dai-chien-inbox-1/caption.md`.
- Profile: bio ở mục 1 · 3 video ghim (hay nhất · "AZbot là ai" · bằng chứng bot chạy thật) · ẩn (không xoá) video có giá.
- Fanpage: ảnh cover = mascot + tagline + "Gặp khách khó? Có AZ lo"; câu đầu phần giới thiệu = tagline.

## 8. Phân vai

Marketing lo video → profile → **người xem bấm nhắn tin**. **Đội sale trả lời tin nhắn**, lọc khách, ghi nguồn (chữ khoá / "biết AZbot qua đâu"). KPI marketing dừng ở **số người thật sự gửi tin**.

## 9. Checklist trước khi giao một video AZbot

- [ ] Hook ≤3 giây có chữ; độ dài 1:00–1:30
- [ ] Không giá / miễn phí / dùng thử / khuyến mãi
- [ ] Đúng giọng "mình – anh chị chủ shop"; số liệu có nguồn
- [ ] Che tên, SĐT, địa chỉ khách (video hậu trường / demo)
- [ ] Tin nóng: có số hiệu văn bản + câu "thông tin tham khảo"
- [ ] Khung kết đủ: mascot + logo + tagline + câu gợi nhắn tin đúng series + chữ khoá; **câu CTA được đọc** và nút CTA hiện đúng lúc đọc (verify cặp frame)
- [ ] Thumbnail dùng `AZbotThumbnail` (có mascot), caption theo công thức SEO 5 dòng + 8 hashtag
- [ ] Bản không nhạc bản quyền; caption có #KhongAiBanHangMotMinh
- [ ] Đi đủ `video-production-gate` (TTS per-line, sync timeline, verify cặp frame, deliverables)
