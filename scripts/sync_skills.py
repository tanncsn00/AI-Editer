#!/usr/bin/env python3
import argparse
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CANONICAL = REPO_ROOT / ".agents" / "skills"
MIRRORS = (
    REPO_ROOT / ".claude" / "skills",
    REPO_ROOT / ".agent" / "skills",
)
CODEX_SKILLS = Path.home() / ".codex" / "skills"
IGNORED = shutil.ignore_patterns("__pycache__", "*.pyc")


def skill_names(directory):
    if not directory.is_dir():
        return set()
    return {entry.name for entry in directory.iterdir() if entry.is_dir()}


def skill_files(skill_dir):
    return {
        path.relative_to(skill_dir): path
        for path in skill_dir.rglob("*")
        if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc"
    }


def skill_differs(source, target):
    source_files = skill_files(source)
    target_files = skill_files(target)
    if source_files.keys() != target_files.keys():
        return True
    return any(
        source_files[relative].read_bytes() != target_files[relative].read_bytes()
        for relative in source_files
    )


def drift(target):
    expected = skill_names(CANONICAL)
    present = skill_names(target)
    missing = expected - present
    unexpected = present - expected
    changed = {
        name for name in expected & present
        if skill_differs(CANONICAL / name, target / name)
    }
    return missing, unexpected, changed


def mirror(target):
    target.mkdir(parents=True, exist_ok=True)
    for name in skill_names(CANONICAL):
        destination = target / name
        if destination.exists():
            shutil.rmtree(destination)
        shutil.copytree(CANONICAL / name, destination, ignore=IGNORED)
    for name in skill_names(target) - skill_names(CANONICAL):
        shutil.rmtree(target / name)


def main():
    parser = argparse.ArgumentParser(
        description="Mirror agent skills from .agents/skills into every agent-specific path."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Report drift and exit non-zero instead of writing.",
    )
    parser.add_argument(
        "--codex",
        action="store_true",
        help="Also install skills into ~/.codex/skills, where Codex CLI looks.",
    )
    arguments = parser.parse_args()

    if not CANONICAL.is_dir():
        print(f"canonical skills directory missing: {CANONICAL}", file=sys.stderr)
        return 1

    total = len(skill_names(CANONICAL))
    drifted = False

    for target in MIRRORS:
        label = target.relative_to(REPO_ROOT).as_posix()
        if arguments.check:
            missing, unexpected, changed = drift(target)
            if missing or unexpected or changed:
                drifted = True
                print(f"{label}: DRIFT")
                for name in sorted(missing):
                    print(f"  missing:    {name}")
                for name in sorted(unexpected):
                    print(f"  unexpected: {name}")
                for name in sorted(changed):
                    print(f"  changed:    {name}")
            else:
                print(f"{label}: ok ({total} skills)")
        else:
            mirror(target)
            print(f"{label}: synced {total} skills")

    if drifted:
        print("\nrun 'make sync-skills' to fix", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
