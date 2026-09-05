---
name: reference_roblox_studio_pipeline
description: "Pipeline làm video Roblox thật (thay cho kit blocky dựng bằng code): Roblox Studio + MCP + Luau + OBS → Remotion overlay. Kèm vị trí cài đặt bất thường trên máy user."
metadata:
  node_type: memory
  type: reference
  originSessionId: 337d5b26-65b4-47f5-8ae0-a5c94e492c1a
  modified: 2026-08-25T06:47:04.726Z
---

Hướng đi mới cho video Roblox meme, chốt 2026-08-25 sau khi dựng bằng code tỏ ra quá chậm.

## ⚠️ Cài đặt trên máy — KHÔNG chuẩn, đừng cài lại

Ổ **C: chỉ còn ~5 GB**, nên Roblox Studio được cài sang E: bằng **directory junction**:

```
C:\Users\tranv\AppData\Local\Roblox   →   E:\Roblox     (junction)
```

- Installer Roblox **không cho chọn ổ** — bắt buộc tạo junction TRƯỚC khi chạy installer thì nó mới ghi sang E:.
- Studio exe: `E:\Roblox\Versions\version-*\RobloxStudioBeta.exe` (~1.36 GB)
- Installer giữ lại ở `E:\_installers\RobloxStudioInstaller.exe`
- Protocol handler `roblox-studio` + `roblox-studio-auth` đã đăng ký (trỏ qua đường C:, tự chuyển sang E:)
- Gỡ junction: `rmdir "C:\Users\tranv\AppData\Local\Roblox"` — chỉ xoá liên kết, dữ liệu trên E: còn nguyên
- **Update Roblox sau này tự đi vào E:**, không phải làm lại

**OBS đã có sẵn**: `C:\Program Files\obs-studio\bin\64bit\obs64.exe` v32.1.2.
`obs-websocket` **đang bật, cổng 4455, có mật khẩu** (đọc ở `%APPDATA%\obs-studio\plugin_config\obs-websocket\config.json`) → điều khiển được nút ghi bằng code, **không cần user bấm tay**.

## Pipeline

```
USER  → viết kịch bản shot-by-shot (luật brain-rot: user viết gag)
USER  → đăng nhập Studio + bật MCP (một lần duy nhất)
─────────────────────────────────────────────
CLAUDE → Luau dựng set + spawn rig + pose + camera theo timeline
CLAUDE → OBS ghi qua websocket (55s video = 55s ghi)
CLAUDE → Remotion overlay chữ + ghép SFX + thumbnail
CLAUDE → verify cặp frame + đo dB từng cue
```

**Bật MCP:** Studio → `Assistant` → `…` → `Manage MCP Servers` → *Enable Studio as MCP server* → quick connect **Claude Code** → restart Claude Code → `/mcp`.

MCP làm được: chạy Luau · đọc/sửa instance · search+insert Creator Store · **đặt camera + chụp viewport** · playtest. **KHÔNG xuất video** → phải qua OBS.

Hai đường lấy hình:
| | Screenshot qua MCP | OBS |
|---|---|---|
| Tốc độ | 55s video ≈ 40 phút (ước lượng, **chưa đo**) | 55s = 55s |
| Khung dọc 1080×1920 | kiểm soát được | phải set canvas + crop cửa sổ Studio |

→ **Ưu tiên OBS.** Việc đầu tiên khi nối được MCP: dựng cảnh nhỏ, quay 5s, đo rớt frame + crop dọc TRƯỚC khi làm cả bài.

## 🔴 Animation ỉa đái: Roblox KHÔNG có sẵn

Animation mặc định chỉ có idle/walk/run/jump/fall/climb/swim/sit.

- Dùng `Animator` thì animation **bắt buộc upload lên Roblox → qua kiểm duyệt** → nội dung tục gần như chắc chắn bị chặn.
- ✅ **Cách né: pose thẳng bằng Luau** (`Motor6D.Transform` / CFrame từng frame). Không upload, Roblox không soi, vì file chỉ chạy local.
- **Tuyệt đối không upload animation/asset tự làm.** Không publish game → kiểm duyệt Roblox không tham gia.
- Cảnh "phọt" thực ra không cần animation: đổi `BrickColor` chân + `ParticleEmitter` nâu + khói + mặt đơ. Cái buồn cười nằm ở phản ứng đám đông.
- Roblox thắng tuyệt đối ở physics: văng người chỉ cần `AssemblyLinearVelocity`, engine tự lo cú ngã.

## Cloudflare chặn `www.roblox.com` (2026-08-25)

Chặn **đúng một hostname**, IP `58.186.69.232`. `create.roblox.com`, `auth.roblox.com`, `apis.roblox.com`, `setup.rbxcdn.com` đều thông.
Nguyên nhân nhiều khả năng: **mình bắn `Invoke-WebRequest` (UA PowerShell) vào roblox.com** để dò link trước khi tải → trip bot detection.
→ **Bài học: tải một lần bằng UA trình duyệt, đừng HEAD dò trước.**
→ Gỡ: phát 4G điện thoại đăng nhập một lần, hoặc restart router lấy IP mới.

Liên quan: [[reference_blocky_pov_meme_kit]] · [[feedback_brainrot_user_writes_beats]] · [[feedback_export_nobgm_tiktok]]
