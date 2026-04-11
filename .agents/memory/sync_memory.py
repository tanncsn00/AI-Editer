"""Sync Claude Code memory between repo (.agents/memory) and local Claude dir.

push : repo  → ~/.claude/projects/<project>/memory/   (use on a new machine after git clone)
pull : ~/.claude/projects/<project>/memory/  → repo   (use after a session that added memory)

Cross-platform (Windows / Mac / Linux). Always copies, never symlinks.

Usage:
    python .agents/memory/sync_memory.py push
    python .agents/memory/sync_memory.py pull
    python .agents/memory/sync_memory.py status   # show diff between the two
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent  # .agents/memory/
PROJECT_ROOT = REPO_DIR.parents[1]           # OpenMontage/
PROJECT_SLUG = "E--tvk-OpenMontage"          # Claude's encoding of the project path

CLAUDE_MEMORY = Path.home() / ".claude" / "projects" / PROJECT_SLUG / "memory"


def list_md(d: Path) -> set[str]:
    if not d.exists():
        return set()
    return {p.name for p in d.glob("*.md")}


def copy_dir(src: Path, dst: Path) -> tuple[int, int]:
    dst.mkdir(parents=True, exist_ok=True)
    copied = 0
    skipped = 0
    for f in src.glob("*.md"):
        if f.name == "README.md":
            continue
        target = dst / f.name
        if target.exists() and target.read_bytes() == f.read_bytes():
            skipped += 1
            continue
        shutil.copy2(f, target)
        copied += 1
        print(f"  + {f.name}")
    return copied, skipped


def cmd_push() -> int:
    print(f"PUSH: {REPO_DIR}  →  {CLAUDE_MEMORY}")
    if not REPO_DIR.exists():
        print("Source not found.", file=sys.stderr)
        return 1
    copied, skipped = copy_dir(REPO_DIR, CLAUDE_MEMORY)
    print(f"Done: {copied} copied, {skipped} unchanged.")
    return 0


def cmd_pull() -> int:
    print(f"PULL: {CLAUDE_MEMORY}  →  {REPO_DIR}")
    if not CLAUDE_MEMORY.exists():
        print("No Claude memory found at expected path.", file=sys.stderr)
        return 1
    copied, skipped = copy_dir(CLAUDE_MEMORY, REPO_DIR)
    print(f"Done: {copied} copied, {skipped} unchanged.")
    print("Remember to git add + commit the changes.")
    return 0


def cmd_status() -> int:
    repo_files = list_md(REPO_DIR) - {"README.md"}
    claude_files = list_md(CLAUDE_MEMORY)
    only_repo = repo_files - claude_files
    only_claude = claude_files - repo_files
    common = repo_files & claude_files

    print(f"Repo:   {REPO_DIR}")
    print(f"Claude: {CLAUDE_MEMORY}")
    print()
    print(f"Total in repo:    {len(repo_files)}")
    print(f"Total in Claude:  {len(claude_files)}")
    print(f"Only in repo:     {len(only_repo)}  {sorted(only_repo)}")
    print(f"Only in Claude:   {len(only_claude)}  {sorted(only_claude)}")

    differ = []
    for name in sorted(common):
        if (REPO_DIR / name).read_bytes() != (CLAUDE_MEMORY / name).read_bytes():
            differ.append(name)
    print(f"Differ in content:{len(differ)}  {differ}")
    return 0


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in ("push", "pull", "status"):
        print(__doc__)
        return 2
    return {"push": cmd_push, "pull": cmd_pull, "status": cmd_status}[sys.argv[1]]()


if __name__ == "__main__":
    sys.exit(main())
