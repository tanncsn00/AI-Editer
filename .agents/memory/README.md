# Portable Memory — Vibe Editing

Backup of Claude Code persistent memory cho project này. Mọi rule, feedback, reference đã học được trong các session đều lưu ở đây và **đi cùng git repo**.

## Naming convention

```
{type}_{domain}_{topic}.md
```

- **type**: `feedback` (rule/do-this-not-that) | `reference` (pointer tới skill/tool) | `project` | `user`
- **domain**: `general` | `tinhdao` | `comedy` | `reup` | `tts` | `caption` | `series`
- **topic**: short snake_case

Ví dụ: `feedback_comedy_mouth_sync.md`, `reference_tinhdao_skill.md`.

**MUST stay flat** — `sync_memory.py` dùng `glob("*.md")` không đệ quy. Đừng tạo subfolder.

## Structure

```
.agents/memory/
  MEMORY.md           # Index grouped by section — Claude auto-loads
  README.md           # File này
  sync_memory.py      # Sync script (push / pull / status)
  feedback_*.md       # Do's and don'ts
  reference_*.md      # Pointers to skills / tools / external resources
```

## Setup trên máy mới

Sau khi `git clone`, sync vào Claude dir để auto-load:

```bash
python .agents/memory/sync_memory.py push
```

Cross-platform fallback (PowerShell / Bash):

```powershell
# Windows
$dest = "$env:USERPROFILE\.claude\projects\E--tvk-OpenMontage\memory"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path .\.agents\memory\*.md -Destination $dest -Force
```

```bash
# Mac / Linux
DEST="$HOME/.claude/projects/E--tvk-OpenMontage/memory"
mkdir -p "$DEST"
cp .agents/memory/*.md "$DEST/"
```

## Sync 2 chiều

- Claude thêm memory mới trong session → `python .agents/memory/sync_memory.py pull` → git commit
- Máy khác pull repo → `python .agents/memory/sync_memory.py push`
- Check diff → `python .agents/memory/sync_memory.py status`

## ⚠️ Gotcha: rename / delete

`sync_memory.py` **chỉ copy, không xóa**. Nếu rename hoặc xóa file trong repo, Claude memory dir (`~/.claude/projects/E--tvk-OpenMontage/memory/`) sẽ còn file tên cũ → duplicate trong context.

Sau khi rename/delete, **xóa thủ công** file tên cũ ở Claude dir, hoặc xóa nguyên thư mục rồi `push` lại sạch:

```bash
# Windows
Remove-Item -Recurse "$env:USERPROFILE\.claude\projects\E--tvk-OpenMontage\memory"
python .agents/memory/sync_memory.py push
```

## Vì sao không symlink

Symlink OK trên Mac/Linux nhưng Windows cần admin/Developer Mode. Copy 2 chiều đơn giản và cross-platform hơn.

## Nội dung

Xem `MEMORY.md` để biết index (grouped: General / TTS & Caption / Tịnh Đạo / Comedy animation / Reup-Dub / Series presets). Mỗi file là 1 rule/feedback/reference riêng biệt. Đừng sửa trực tiếp khi đang trong session — Claude tự update khi cần.
