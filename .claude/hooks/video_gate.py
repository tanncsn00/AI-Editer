import json
import re
import sys
import unicodedata

REMINDER = (
    "🚦 YÊU CẦU LIÊN QUAN SẢN XUẤT VIDEO ĐƯỢC PHÁT HIỆN.\n"
    "BẮT BUỘC: gọi skill `video-production-gate` TRƯỚC khi làm bất cứ việc gì khác "
    "(trước cả khi đọc file, tách beat, hay viết code Remotion).\n"
    "Skill đó là checklist 10 cổng chặn. Các lỗi đã trả giá và bị chặn ở đó:\n"
    "  · GATE 0 — script user đưa phải dùng NGUYÊN VĂN, đếm dòng đối chiếu, không tự cắt nội dung\n"
    "  · GATE 3 — whisper verify TRƯỚC khi dựng hình\n"
    "  · GATE 4 — sync theo word-timestamp thật; CẤM base + i*step, thoại đo từng câu, list đo từng item\n"
    "  · GATE 5 — verify cặp frame (onset hiện / −5 vắng), không nói suông\n"
    "  · GATE 6 — cắt nhạc phải đặt -ss TRƯỚC -i; đo theo mốc thời gian, không đo mean toàn file\n"
    "  · GATE 7 — xuất thêm bản nobgm để đăng TikTok\n"
    "Không được bỏ qua gate nào. Nếu đang nghĩ 'cái này đơn giản khỏi cần' — đó chính là lúc lỗi xảy ra."
)

ACTION = (
    "(lam|dung|render|xuat|edit|cat|ghep|tao|sua|tach|doi|them|bo|chen|long|"
    "make|build|create|produce|export|swap|replace)"
)
SUBJECT = "(video|clip|reel|short|tiktok)"
GAP = "[\\w\\s\\.,\\-\"']{0,30}"
BND = "(^|[^a-z])"

PATTERNS = [
    BND + ACTION + GAP + SUBJECT,
    SUBJECT + GAP + BND + ACTION,
    "remotion",
    "script\\s*(nay|moi|json)",
    "(beat|caption)\\.?(md|json)?\\s*(cho|nay)",
    "(tts|voice[\\s_-]?over|long tieng|phien am)",
    "thumbnail",
    "(sync|dong bo)[\\w\\s]{0,20}(voice|tieng|chu|text)",
]

WORD_ACTION = "(^|[^a-z])" + ACTION + "([^a-z]|$)"
LONG_DROP_CHARS = 400


def strip_accents(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s.replace("đ", "d")


def should_fire(prompt):
    if not isinstance(prompt, str) or not prompt.strip():
        return False
    flat = strip_accents(prompt)
    if any(re.search(p, flat) for p in PATTERNS):
        return True
    return len(prompt) > LONG_DROP_CHARS and bool(re.search(WORD_ACTION, flat))


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return
    if not should_fire(data.get("prompt") or ""):
        return
    out = {
        "hookSpecificOutput": {
            "hookEventName": "UserPromptSubmit",
            "additionalContext": REMINDER,
        },
        "systemMessage": "🚦 video-production-gate: chạy checklist trước khi dựng video",
    }
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
