# Kho SFX meme

23 file, tải bằng `python fetch_sfx.py` (chạy lại thì tự skip file đã có). Bản copy dùng cho render nằm ở `remotion-composer/public/sfx/`.

## Cách dùng trong Remotion

```tsx
import { Sfx } from "./Sfx";

<Sfx name="punch/vine-boom" at={12.4} />
<Sfx name="funny/duck-quack" at={20.1} volume={0.5} />
<Sfx name="ui/typing" at={30.0} trim={2.5} />
```

`at` tính bằng **giây** (không phải frame). `volume` mặc định 0.7. `trim` cắt ngắn khi file dài hơn nhu cầu.

## Danh mục

### punch — nhấn mạnh, cú đấm
| File | Dài | Dùng khi |
|---|---|---|
| `vine-boom` | 1.25s | Zoom mạnh vào chữ / mặt, cú twist |
| `bonk` | 1.62s | Đập, phủ nhận, "sai rồi" |
| `metal-pipe` | 3.17s | Rơi, sập, thất bại kịch tính |
| `airhorn` | 2.97s | Hype, khoe số liệu to |
| `emotional-damage` | 3.32s | Câu chốt cay, punchline đau |

### fail — hỏng, sai
| File | Dài | Dùng khi |
|---|---|---|
| `windows-error` | 0.99s | Lỗi, cảnh báo, chặn |
| `wrong-buzzer` | 1.06s | Đáp án sai |
| `roblox-oof` | 1.00s | Chết, toang nhẹ |
| `sad-violin` | 4.55s | Thảm, tự thương thân |
| `fail-trombone` | 3.63s | Hụt hẫng, quê |

### funny — hài
| File | Dài | Dùng khi |
|---|---|---|
| `duck-quack` | 1.15s | Chốt câu bựa (cái bạn hỏi) |
| `laugh-track` | 6.43s | Sitcom, cười giả trân |
| `crickets` | 4.44s | Im lặng ngượng, không ai cười |
| `record-scratch` | 0.78s | Khựng lại, "khoan đã" |
| `goofy-ahh` | 3.02s | Ngớ ngẩn, troll |

### win — thắng, đạt
| File | Dài | Dùng khi |
|---|---|---|
| `ding-correct` | 2.95s | Đúng, tick xanh |
| `level-up` | 1.96s | Nâng cấp, tiến bộ |
| `cash-register` | 2.43s | Tiền, tiết kiệm, giá |
| `angelic` | 12.53s | Cứu tinh, giải pháp xuất hiện |

### ui — giao diện
| File | Dài | Dùng khi |
|---|---|---|
| `discord-ping` | 0.48s | Thông báo, tin nhắn |
| `iphone-ding` | 4.62s | Thông báo điện thoại |
| `typing` | 10.06s | Đang gõ code, nền cho cảnh terminal |
| `whoosh` | 2.16s | Chuyển cảnh |

### draw — tiếng vẽ (video whiteboard)
| File | Dài | Dùng khi |
|---|---|---|
| `scribble` | 3.00s | Tiếng bút dạ mỗi lần tay vẽ doodle — engine `whiteboard/WhiteboardVideo.tsx` tự phát, volume 0.32. Tự tổng hợp, không bản quyền: `ffmpeg -f lavfi -i "anoisesrc=color=pink:amplitude=0.7:d=3:seed=7" -af "highpass=f=1500,lowpass=f=5500,tremolo=f=11:d=0.85,afade=t=in:d=0.04,afade=t=out:st=2.9:d=0.1,volume=0.9" -ar 44100 -ac 1 scribble.mp3` |

## Mức volume gợi ý

- Nhấn mạnh (`vine-boom`, `airhorn`): 0.5–0.6 — dễ chói, đừng để 1.0
- Hài (`duck-quack`, `record-scratch`): 0.6–0.7
- Nền (`typing`, `crickets`): 0.2–0.3, có thể `trim`
- Chuyển cảnh (`whoosh`): 0.4–0.5

Nếu video đã có nhạc nền ở 0.14 thì SFX để 0.5–0.7 là nổi rõ mà không át giọng đọc.

## Bản quyền — đọc trước khi đăng

Nguồn tải là **myinstants.com**, site này lưu clip cắt từ nguồn gốc chứ không cấp phép. Nhiều file ở đây là trích từ tác phẩm có bản quyền: `vine-boom` từ Vine, `roblox-oof` của Roblox, `windows-error` của Microsoft, `laugh-track` từ sitcom.

Thực tế: SFX ngắn dưới 2 giây hầu như không bị hệ thống nhận dạng bắt, và cả nền tảng short-form đang dùng tràn lan. Rủi ro thấp nhưng **không bằng không**.

Đường sạch nếu cần chắc chắn:
- **pixabay.com/sound-effects** — free, dùng thương mại, không cần ghi nguồn
- **mixkit.co/free-sound-effects** — tương tự
- **freesound.org** — kho lớn nhất, nhưng phải đọc license từng file (có loại buộc ghi nguồn)

Riêng `roblox-oof` là ca nhạy cảm nhất — Roblox từng gỡ chính âm thanh này khỏi game vì tranh chấp bản quyền với tác giả. Cân nhắc thay bằng bản tương đương trên Pixabay.

## Thêm âm mới

Mở `fetch_sfx.py`, thêm dòng vào `CATALOG` theo dạng `("tên-file", "từ khoá tìm")`, chạy lại script. File đã có sẽ được bỏ qua nên không tải lại từ đầu.
