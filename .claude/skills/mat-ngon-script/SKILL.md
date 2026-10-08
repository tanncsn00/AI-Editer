---
name: mat-ngon-script
description: "Công thức VIẾT SCRIPT series Thiên Cơ Mật Ngôn — giải mã câu nói đời thường (người ngoài nghe X / người trong cuộc nghe Y) bằng giọng tu tiên. Mặc định 1 câu = 1 short 35–50s để đạt reach triệu view; có bản ghép dài. Dùng khi user muốn làm Mật Ngôn mới (sếp, người yêu, mẹ, khách hàng, họ hàng Tết...) hoặc audit script Mật Ngôn."
---

# Thiên Cơ Mật Ngôn · công thức viết script

Skill này lo **CHỮ**. Thủ pháp văn tu tiên (nhịp câu ngắn, emoji chỉ đạo cảm xúc, phản ứng đạo tâm, lặp ba + đảo ngược, mốc giờ chính xác) lấy từ `truyen-ky-it` — đọc phần "KỸ THUẬT VÀNG" ở đó, KHÔNG chép lại ở đây. Hook audit chạy `viral-hook`. Pipeline dựng/TTS/sync đi qua `video-production-gate`.

**Golden refs:** `projects/thien-co-mat-ngon/` (Quyển I — sếp, video tốt nhất kênh ~700k) · `projects/mat-ngon-bang-huu/` · `projects/mat-ngon-dao-lu/` (bản short lẻ đầu tiên).

**Bài học từ số liệu kênh (đo 2026-10-02):** Quyển I dài 2:14 về *sếp* (ai cũng có) → 700k. Các quyển sau dài dần 2:40 → 5:09 và hẹp dần (dev, recruiter, kế toán) → không vượt. Skill này sửa đúng 2 lỗi đó.

---

## 1. GATE CHỌN ĐỀ TÀI — "ai cũng có người này không?"

Người nói câu mật ngôn phải là người **đa số khán giả VN đều có**: sếp, người yêu, mẹ, bố, họ hàng, khách hàng, đồng nghiệp, chủ nhà trọ, giáo viên.

- ✅ Đạt: >50% người xem tự nhận ra mình trong 1 giây.
- ⚠️ Ngách (dev, kế toán, recruiter): chỉ làm khi cần nuôi tệp lõi, KHÔNG kỳ vọng triệu view.
- Bám lịch: 20/10 (người yêu, chị em công sở) · 20/11 (giáo viên, phụ huynh) · tháng 12 (đánh giá cuối năm) · tháng 1 (thưởng Tết, họ hàng ngày Tết).
- Mỗi quyển nên có câu của **cả hai phía** (vd người yêu: câu của nàng + câu của chàng) để hai bên tag nhau, comment cãi nhau.

## 2. FORMAT MẶC ĐỊNH — 1 câu mật ngôn = 1 short 35–50s

Một quyển 5 câu → **5 short lẻ**, không phải 1 video dài. Lý do: nhóm 10% video top TikTok có trung vị 41s (OpusClip, 4/2026); tỷ lệ xem hết là tín hiệu số 1; đăng 6–10 bài/tuần tăng ~29% view/bài (Buffer, 11,4 triệu bài, 10/2025).

**Ngân sách chữ:** ~110–150 từ/short. Tốc độ đo được từ Quyển I ≈ 3,3 từ/giây (đã gồm ngắt nghỉ). Quá 160 từ → cắt.

Bản ghép dài (~4–5 phút) theo **khung "5 kiểu bạn thân"** — xem mục 3b. KHÔNG mở bằng "Tương truyền…".

## 3b. BẢN GHÉP DÀI — khung "Ngũ Đại" (user chọn 2026-10-02)

User chỉ định hook kiểu `projects/5-kieu-ban-than/` là "hook oke nhất với kênh này". Golden ref Mật Ngôn: `projects/mat-ngon-dao-lu-full/` (`full_draft.md` là script đã duyệt).

| Phần | Làm gì | ~ |
|---|---|---|
| **TRIGGER** | "Ai cũng có một [người]…" + đúng 1 tình huống của câu số 1 → "Nếu bên tai ngươi vừa vang lên đúng giọng một người… Xin chúc mừng. Ngươi vừa lĩnh ngộ Đệ Nhất Mật Ngôn." — người xem tự nhận ra một người thật | 15s |
| **ATTENTION** | "Nhưng đó mới chỉ là một trong 5…" + 3 lần "Có câu…" nhá trước câu 2/3/5, mỗi lần một hình ảnh cụ thể | 18s |
| **CURIOSITY** | Đặt tên bộ ("NGŨ ĐẠI MẬT NGÔN") + "Và hãy xem… [người] của ngươi đang dùng câu nào." | 6s |
| 5 mật ngôn | Tiêu đề đọc to "Đệ X mật ngôn: [câu]" + emoji riêng → vào thẳng cảnh mở của short đó → thân short, BỎ CTA từng short | 3 phút |
| **PAYOFF** | Lật nghĩa: mỗi câu thật ra "là muốn được…" → chốt ấm | 17s |
| **SOCIAL** | Nói ngược "đừng tag… vào đây" → kịch bản người được tag phản ứng (callback câu số 1) → lật "Tag vào." | 23s |
| **EXPANSION** | Nhá quyển đối xứng (phía chàng / phía sếp…) bằng một cặp so sánh đắt | 11s |
| CTA | Follow bần đạo, để độ kiếp mỗi ngày | 3s |

Khi dựng: TTS tái dùng mp3 của beat trùng chữ với các short (cùng voice + speed) để không thu lại; beat chưa từng whisper-verify thì vẫn phải verify lại trong project bản ghép.

## 3. CẤU TRÚC 1 SHORT (6 nhịp)

| # | Nhịp | Thời lượng | Quy tắc |
|---|---|---|---|
| 1 | **HOOK (giữa cảnh)** | 0–2s | Frame 0 là hình xung đột/hình lạ + SFX + chữ 3–5 từ + 1–2 câu thoại/dẫn đang giữa sự việc. CẤM mở bằng "Tương truyền…" |
| 2 | **Câu mật ngôn** | 1.5–4s | 📜 + câu IN HOA, kèm 1–2 dòng phóng đại tu tiên |
| 3 | **Giải mã** | 5–10s | "Người ngoài nghe: …" / "[Người trong cuộc] lâu năm nghe: …IN HOA…" — dòng 2 phải là nỗi sợ thật |
| 4 | **Cảnh độ kiếp** | 10–35s | 1 tình huống cụ thể: lặp ba + đảo ngược, hoặc mốc giờ leo thang. Ít nhất 1 phản ứng đạo tâm 💀 tự chế, leo thang |
| 5 | **Lĩnh ngộ** | 35–42s | 🏯 1 câu chân lý quotable, đối xứng, lạnh ("Không phải câu trả lời. Nó là đề thi.") |
| 6 | **CTA + loop** | 42–50s | Tag/comment → "Follow bần đạo." → câu cuối dẫn ngược về hook |

### Quy tắc nhịp 1 — hook hài = mở giữa cảnh xung đột, không phải câu đùa

Đọc câu mật ngôn ở giây đầu là chưa có hook: người xem đã biết câu đó, không có gì giữ họ lại (user bắt lỗi 2026-10-02). Hook kiểu giáo dục ("99% đàn ông trả lời sai câu này") cũng bị user loại: đó là khuôn explainer, không phải hài.

Căn cứ (nghiên cứu 2026-10-02):
- Quyết định ở lại hay lướt nằm trong ~2 giây đầu (TikTok/MediaScience; Meta Reels 11/2024).
- Chữ mới hiện phải ~2 giây sau mới được đọc (eye-tracking) → **frame 0 phải tự là hook bằng HÌNH**, chữ và lời chỉ đỡ thêm.
- Hài: mở **giữa hành động/xung đột**, không mở bằng punchline — giữ cú lừa cho cuối (Chewkz trên blog YouTube; thực hành comedy creator).
- Một nghiên cứu 2025 trên 4.983 hook TikTok không thấy từ ngữ/cảm xúc lời nói ảnh hưởng view → đừng tốn công đánh bóng chữ, dồn công vào hình + tình huống.
- Hình, chữ, lời phải nói CÙNG một ý; chữ trên màn hình 3–5 từ; hook không hứa quá những gì video trả (MrBeast guide, Kallaway).

Bốn cách mở đã dùng ở `projects/mat-ngon-dao-lu/`:

| Cách mở | Ví dụ | Vì sao giữ người xem |
|---|---|---|
| Khán giả biết trước sai lầm | Nàng: "Em không sao." → Ngươi: "Ừ, em ngủ ngon nhé." | Người xem biết hắn toang, muốn xem hậu quả |
| Nhảy tới cao trào rồi tua lại | "Phút thứ bốn mươi. Vẫn chưa được ăn." | Hỏi ngay: vì sao? |
| Hình ảnh lạ cần giải thích | Cô gái dưới lầu đã hóa tượng đá, rêu mọc lên giày | Frame 0 là một câu hỏi bằng hình |
| Đang giữa thiên kiếp | "Anh thấy em có gì khác không?" + đồng hồ 3 giây | Áp lực thời gian thật |

Đối chiếu video người yêu thật (đo 2026-10-02): các hit lớn gần đây mở giữa cảnh không chữ (@huyseoul_idol 8,5M) hoặc "POV: lời hứa của nàng" rồi cảnh lật lại (@_ngvanann 4,3M). Kiểu thẻ chữ "Ngôn ngữ của con gái: …" vẫn có 1–2M nhưng chủ yếu là hit 2019–2022, đã cũ. Không hit triệu view nào mở bằng "tag người yêu" — tag để ở cuối. Cặp đôi nam/nữ đăng thành cặp ("Ngôn ngữ đàn ông" 8,5M → "Ngôn ngữ phụ nữ" 4,1M) → quyển nào cũng nên có quyển đối xứng.

Bắt buộc viết dòng `🪝 [HÌNH 0s]` trong script: frame đầu vẽ gì, SFX gì, chữ 3–5 từ gì. Mỗi short trong một quyển dùng cách mở khác nhau.

### Quy tắc nhịp 6 — CTA ba lớp
1. **Share trigger nói to:** "Tag [người đó] vào đây." — share/save nặng hơn like.
2. **Comment trigger:** hỏi thứ khán giả tự kể được ("Comment món người yêu ngươi hay chê nhất"). Comment hay → nguồn câu cho quyển sau.
3. **Loop:** câu cuối bỏ lửng để vòng lại đúng câu hook ("Còn tối nay ăn gì à?" → "TÙY ANH."). Dùng ngắt "—" hoặc câu hỏi.

Không cần cả tag LẪN comment trong cùng 1 short — chọn cái hợp cảnh, nhưng "Follow bần đạo" luôn có.

## 4. GIỌNG VĂN

- Ngôi: bần đạo kể, gọi khán giả là "ngươi"; nhân vật kia là "nàng/hắn/Trưởng lão" tùy đề tài.
- Đặt tên thế giới theo đề tài: Công Sở Giới, Đạo Lữ Giới, Gia Tộc Giới, Khách Hàng Giới...
- Từ khóa tìm kiếm thật ("người yêu", "sếp", "thưởng Tết") phải được **đọc to ít nhất 1 lần** — TikTok index lời nói + chữ trên màn hình. Tên series "Thiên Cơ Mật Ngôn" không ai search → để trong hình, không phải dòng đầu caption.
- Tình huống phải **cụ thể đến mức xấu hổ** (trả lời "Ok" không icon, tóc còn ướt, tỉa lông mày 2mm). Chung chung = không ai tag.
- Không tái dùng punchline cũ của quyển trước ("tí là đơn vị nghiệp lực" đã dùng ở Quyển I).
- Không sexist một chiều: chọc cả hai phía, kết quyển nên có cú lật đổi vai.

## 5. CAPTION (theo mẫu `projects/thien-co-mat-ngon/caption.md`)

```
[Câu mật ngôn] — [nghĩa thật ngắn] 🏯         ← dòng 1 ≤70 ký tự, chứa từ khóa search
Người ngoài nghe: … / [Người trong cuộc] nghe: …
[1 câu hỏi comment]
#[từ khóa đề tài] #[nhóm người] #congso/#nguoiyeu … (6–8 tag)
```
Comment ghim: poll "câu nào đúng nhất với bạn" để kéo comment.

## 6. CHECKLIST TRƯỚC KHI ĐƯA USER DUYỆT

```
□ Người nói câu này đa số khán giả đều có?
□ Hook mở giữa cảnh xung đột, có dòng 🪝 [HÌNH 0s] tự đứng được không cần chữ, hình–chữ–lời cùng một ý, không hứa quá nội dung?
□ 110–150 từ (≈35–50s)?
□ Có cặp "Người ngoài nghe / … lâu năm nghe"?
□ Cảnh độ kiếp có chi tiết cụ thể + ≥1 phản ứng đạo tâm tự chế?
□ Câu lĩnh ngộ quotable, không phải lời khuyên?
□ Có tag hoặc comment trigger nói to + "Follow bần đạo"?
□ Câu cuối loop về hook?
□ Từ khóa search được đọc to?
□ Không lặp punchline quyển trước?
```

Script viết xong → user duyệt VERBATIM (rule `feedback_general_approve_script`) → mới sang TTS.

## Nguồn số liệu
- OpusClip, độ dài video TikTok 2026: https://www.opus.pro/blog/how-long-should-a-tiktok-be-2026
- Buffer, tần suất đăng (11,4 triệu bài): https://buffer.com/resources/how-often-should-you-post-on-tiktok/
- Thứ tự tín hiệu thuật toán: https://buffer.com/library/tiktok-algorithm/
- TikTok/MediaScience 2 giây đầu: https://ads.tiktok.com/business/vi/blog/mediascience-study-brands-memorable-tiktok
- Meta Reels 11/2024: https://developers.facebook.com/blog/post/2024/11/07/unlock-the-power-of-reel-ads/
- Hook lời nói không tương quan view (2025, 4.983 hook): https://mmi.sumdu.edu.ua/volume-16-issue-4/article-4/
- Ngưỡng kiểu "35% xem hết + 1,5% share" chỉ là số blog, không có nguồn gốc — chỉ dùng để so video của kênh với nhau.
