---
name: whiteboard-doodle
description: "Dựng hình kiểu TRANH VẼ TAY (whiteboard / doodle) cho video script của kênh: mỗi câu thoại = chữ viết tay + 1 hình doodle được bàn tay cầm bút dạ vẽ ra từng nét, kèm SFX tình huống neo theo dòng. Nền tối #0B0A12 của kênh. Hình lấy từ thư viện open-source CC0 (CocoMaterial) + vẽ code rough.js cho vật thiếu. MẶC ĐỊNH bước dựng hình cho video script (Mật Ngôn, truyền kỳ, POV, top N) từ 2026-10-20. Dùng khi user nói: vẽ, tranh vẽ, doodle, whiteboard, tay vẽ, minh hoạ, 'làm video như video lốp'."
---

# Whiteboard doodle · tay vẽ + SFX tình huống

Golden ref: `projects/top-5-loai-lop/` (Truyền Kỳ Luân Tông · 5 cảnh giới lốp) — component `remotion-composer/src/LopWhiteboard.tsx`.

Skill này là **bước dựng hình**, chạy SAU khi script đã duyệt và `tts_lines.py` đã ra `timeline.json` (xem `video-production-gate` GATE 0–3). Không thay gate — gọi kèm.

---

## Engine (đã có sẵn, KHÔNG viết lại)

| File | Vai trò |
|---|---|
| `remotion-composer/src/whiteboard/WhiteboardVideo.tsx` | Engine: đọc timeline → mỗi dòng viết tay tại `onset − 4f`, xong chữ thì tay vẽ doodle của dòng đó; tay cầm bút chạy theo đầu nét; tiếng bút dạ tự phát mỗi lần vẽ; SFX neo theo dòng; nền + chrome + font |
| `remotion-composer/src/whiteboard/shapes.ts` | Palette kênh + primitive vẽ code: `C` tròn · `E` elip · `R` chữ nhật · `L` đường · `P` path · `T` chữ tay · `A` doodle thư viện · `place/tint` + helper chung `bubble` `sparkle` `burst(text)` `summon` `stairs` `speed` `cross` `followButton` |
| `projects/_shared/find_doodles.py` | Tìm doodle theo từ khoá → in tên + trang xem `doodle_assets/_preview/find.html` |
| `projects/_shared/build_doodles.py` | `doodles.txt` → `src/<slug>_doodles.json` (path đã chuẩn hoá, giữ thân trắng + nét mực) |
| `projects/_shared/doodle_assets/` | CocoMaterial 3.382 SVG (CC0) + `index.json` · Excalidraw libraries (MIT) · notion-avatar (CC0) · doodle-icons (MIT). Gitignored |
| `projects/_shared/sfx/` → mirror `remotion-composer/public/sfx/` | Kho SFX theo nhóm `punch` `fail` `funny` `win` `ui` `draw` — đọc `README.md` |

---

## Quy trình — mỗi bước có ô tick

### B1 · Lập bảng cảnh (trước khi code)
- [ ] Liệt kê mọi page trong `timeline.json` (`BEAT:pageIndex`), mỗi dòng ghi: **hình gì** (tình huống cụ thể, hình hoá đúng câu nói) + có **SFX** không.
- [ ] Dòng `cue` ("Người đời gọi nó là…") → không vẽ. Dòng `term` → `"box"` (dấu đỏ quanh chữ). Dòng 📜 tên có ngoặc kép → `"banner"`.
- [ ] Mỗi page 1 bố cục: doodle nằm vùng **y 250–1040**, chữ tự xếp vùng **1080–1790** (engine lo). Bên trái/giữa/phải, không chồng.

### B2 · Lấy hình đẹp — KHÔNG tự vẽ người bằng que
- [ ] `python projects/_shared/find_doodles.py phone sleep cat ...` → mở trang `find.html` (serve `python -m http.server 8765 --bind 127.0.0.1 --directory projects/_shared/doodle_assets`) → chọn tên.
- [ ] Ghi tên vào `projects/<dir>/doodles.txt` (mỗi dòng 1 tên, đúng chính tả) → `python ../_shared/build_doodles.py <slug>`.
- [ ] Người, đồ vật, cảm xúc → **luôn lấy thư viện** (user chê hình người que tự vẽ là "xấu", 2026-10-20).
- [ ] Vật thư viện không có (lốp, cốp xe, cầu thang, vụ nổ, vật đặc thù đề tài) → vẽ code bằng primitive trong file video, nét đậm khớp style.
- [ ] **CẤM dùng AI sinh ảnh** cho bước này (user: "vẽ bằng code mà?").

### B3 · Viết component
- [ ] Copy `LopWhiteboard.tsx` → `src/<Name>Whiteboard.tsx`; đổi import `<slug>_timeline.json` + `<slug>_doodles.json`, `slug`, `footer`; viết lại `SCENES` + `SFX`, giữ helper đặc thù đề tài trong file này.
- [ ] `A(name, x, y, h, col?)` — `h` = chiều cao hiển thị (px), `col` = màu mực (mặc định INK). Tên sai → render **chết ngay** với thông báo rõ (không im lặng).
- [ ] Đăng ký Root: `<Name>Whiteboard` (bgm) · `<Name>WhiteboardNoBgm` · thumbnail; `durationInFrames = whiteboardFrames(timeline)`.

### B4 · SFX tình huống — neo theo DÒNG, không gõ giây tay
```ts
const SFX: Sfx[] = [{ line: "L1:1:0", offset: 1.2, src: "sfx/ui/iphone-ding.mp3", vol: 0.5 }];
```
- [ ] `line` = `BEAT:pageIndex:lineIndex` trong timeline; `offset` = giây tính từ lúc dòng bắt đầu đọc (đặt ngay SAU chữ cần nhấn). Anchor sai → render chết ngay.
- [ ] Mật độ ~1 SFX / 30–40s, chỉ đặt ở **khoảnh khắc tình huống**, không rải đều.

| Tình huống | SFX | vol |
|---|---|---|
| Tin nhắn / thông báo / điện thoại sáng | `sfx/ui/iphone-ding.mp3` · `sfx/ui/discord-ping.mp3` | 0.5 |
| Khựng lại, chi tiết vô lý ("cũng bên trái") | `sfx/funny/record-scratch.mp3` | 0.35 |
| Câu chốt đau / bị phũ | `sfx/punch/emotional-damage.mp3` | 0.45 |
| Nổ, sập, twist mạnh | `sfx/punch/vine-boom.mp3` | 0.5 |
| Đập, phủ nhận, "sai rồi" | `sfx/punch/bonk.mp3` | 0.5 |
| Thất bại, quê | `sfx/fail/fail-trombone.mp3` · `sfx/fail/roblox-oof.mp3` | 0.4 |
| Tiền, mua sắm | `sfx/win/cash-register.mp3` | 0.45 |
| Thăng cấp, lên đời | `sfx/win/level-up.mp3` | 0.45 |
| Im lặng ngượng | `sfx/funny/crickets.mp3` | 0.25 |
| Tiếng bút vẽ | `sfx/draw/scribble.mp3` — engine tự phát, KHÔNG thêm tay | 0.32 |

### B5 · Kiểm bằng mắt trước render dài
- [ ] Render still **frame cuối mỗi page** (`page.start` của page sau − 10f) → ghép contact sheet → soi chồng hình, chữ đè hình, nhãn đè nét.
- [ ] Render 1–2 frame **giữa lúc vẽ** → nét lộ dần, đầu bút đúng chỗ đang vẽ.
- [ ] Render dùng `--public-dir` tạm chứa **`<slug>/` + `sfx/`** (copy `remotion-composer/public/sfx`), không trỏ `public/` thật 2.3 GB.

### B6 · Gate còn lại
- [ ] GATE 5 cặp frame: onset − 5 chữ vắng, onset chữ bắt đầu được viết (bút ở chữ đầu).
- [ ] GATE 6–8 như thường: nobgm −91 dB ở mốc chỉ có nhạc, Flat factor 0, thumbnail **cùng style vẽ tay nền tối** (`LopWhiteboardThumbnail.tsx` làm mẫu — vẽ tĩnh doodle bằng `lop_doodles.json`).

---

## Khoá style (đừng đổi khi user chưa yêu cầu)

- **Nền tối kênh** `#0B0A12` + lưới vàng trôi + glow vàng/đỏ (user 2026-10-20: "màu nền bg là nền tối cũ cơ mà" — KHÔNG nền giấy trắng).
- Mực `#F2ECE0`; GOLD `#E5B54C` punchline + CTA · RED `#FF4D5E` đau/term · JADE `#4FD1A5` lĩnh ngộ · AMBER `#FF9F45` bần đạo · GREY cue.
- Font **Pangolin** (đủ dấu ư/ơ). **Patrick Hand mất móc ư/ơ** — cấm dùng cho tiếng Việt.
- Doodle thư viện: phần trắng → vẽ màu nền (che hình phía sau), phần đen → màu mực; vùng đen đặc lớn (tóc, bàn tay) thành mảng kem — chấp nhận được, hoặc chọn hình khác.

## Bẫy đã gặp

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| Tự vẽ người que bằng code | User chê "vẽ xấu thế" | B2: người/đồ vật lấy thư viện |
| Gọi API AI sinh ảnh | User gạt: muốn vẽ bằng code; FAL hết credit, Google hết quota | Chỉ dùng thư viện open-source |
| Nền giấy trắng | Lệch nhận diện kênh | Khoá nền tối |
| Patrick Hand | "ngươi" thành "nguơi", "mưa" thành "mua" | Pangolin |
| SFX gõ giây tuyệt đối | Đổi script là lệch | Neo `line` + `offset` |
| Không soi contact sheet | Chữ "x400" đè chân nhân vật, "6 tiếng" đè đồng hồ | B5 bắt buộc |
