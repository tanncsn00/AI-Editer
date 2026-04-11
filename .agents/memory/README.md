# Portable Memory — OpenMontage

Backup of Claude Code persistent memory cho project này. Mọi rule, feedback, reference đã học được trong các session đều lưu ở đây và **đi cùng git repo**.

## Cấu trúc

```
.agents/memory/
  MEMORY.md                              # Index — load tự động vào mỗi session
  feedback_always_approve_script.md      # Không skip script approval gate
  feedback_whisper_vn_caption_verify.md  # Verify whisper VN captions vs script
  feedback_bg_continuity.md              # Background phải continuous trong 1 video
  feedback_no_tap_label.md               # Không show "Tập X" trong thumbnail/big-word
  reference_tinh_dao_skill.md            # Pointer tới skill tinh-dao-video
  reference_yt_dlp_social_download.md    # yt-dlp dùng cho download social video
  README.md                              # File này
```

## Setup trên máy mới

Sau khi `git clone` repo về máy mới, chạy script đồng bộ để Claude Code load được memory:

### Windows (PowerShell)
```powershell
$dest = "$env:USERPROFILE\.claude\projects\E--tvk-OpenMontage\memory"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path .\.agents\memory\*.md -Destination $dest -Force
```

### Mac / Linux
```bash
DEST="$HOME/.claude/projects/E--tvk-OpenMontage/memory"
mkdir -p "$DEST"
cp .agents/memory/*.md "$DEST/"
```

Hoặc chạy script `sync_memory.py` (xem dưới).

## Sync 2 chiều

Nếu trong session bạn (hoặc Claude) thêm memory mới ở `~/.claude/projects/E--tvk-OpenMontage/memory/`, **PHẢI sync ngược lại vào `.agents/memory/`** để commit git.

Workflow:
1. Sau session có thêm memory → `python .agents/memory/sync_memory.py push`
2. Git add + commit
3. Trên máy khác: pull → `python .agents/memory/sync_memory.py pull`

## Vì sao không symlink

Symlink hoạt động trên Mac/Linux nhưng Windows cần admin/Developer Mode. Copy 2 chiều đơn giản và cross-platform hơn.

## Nội dung memory

Xem `MEMORY.md` để biết index. Mỗi file là 1 rule/feedback/reference riêng biệt. Đừng sửa trực tiếp khi đang trong session — Claude tự update khi cần.
