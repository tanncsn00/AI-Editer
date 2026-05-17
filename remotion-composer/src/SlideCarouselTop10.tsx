import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#08080F";
const BG_SURFACE = "#13131C";
const BG_ELEVATED = "#1A1A26";
const BORDER = "#252535";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9090A5";
const TEXT_MUTE = "#5A5A70";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_CYAN = "#3DD9D6";
const ACCENT_SOLID = "#7E5BFF";
const GOLD = "#F4B860";
const GREEN = "#34D399";
const ORANGE = "#FF9F4D";
const RED = "#FF6B6B";

type Slide = {
  kind: "hook" | "cmd" | "cta";
  icon?: string;
  cmdLabel?: string;
  title?: string;
  subtitle?: string;
  desc?: string[];
  demo?: string;
  punchline?: string;
  color?: string;
  hookHeadline?: string;
  hookSub?: string;
  hookTag?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⚡ Claude Code · Tip",
    hookHeadline: "10 LỆNH",
    hookSub: "PHẢI BIẾT — học 2 phút, xài cả đời",
    hookNote: "Chồng kể vợ · ai mới xài cũng nên save\nofficial Anthropic docs · verified 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "🗺️",
    cmdLabel: "Shift + Tab",
    title: "PLAN MODE",
    subtitle: "Claude lên kế hoạch trước khi code",
    desc: [
      "Bấm Shift+Tab để cycle qua Plan Mode",
      "Claude tự gather context, lập plan",
      "Vợ duyệt plan rồi nó mới execute",
    ],
    demo: "[Default] → Shift+Tab → [Plan Mode]\n? Claude plan first, ask before action",
    punchline: "Đừng để Claude code liều như vợ tiêu tiền chồng!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "📝",
    cmdLabel: "# + câu",
    title: "QUICK MEMORY",
    subtitle: "Lưu vào CLAUDE.md trong 1 giây",
    desc: [
      "Gõ # trước câu → Claude tự append vô CLAUDE.md",
      "Claude đọc file đó mỗi session — nhớ mãi",
      "Personalize Claude theo style của vợ",
    ],
    demo: "# tôi thích cà phê đen\n→ saved to ./CLAUDE.md",
    punchline: "Cách duy nhất ây ai nhớ vợ — người yêu cũ chồng còn quên!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🧹",
    cmdLabel: "/clear",
    title: "WIPE CONTEXT",
    subtitle: "Xóa sạch context, bắt đầu fresh",
    desc: [
      "Khi đổi task mới không liên quan",
      "Tránh Claude lú vì context cũ chen vô",
      "Token usage reset về 0",
    ],
    demo: "$ /clear\n→ Context wiped. Fresh session ready.",
    punchline: "Claude tỉnh táo sạch bong như chồng tắm xong vậy!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "🗜️",
    cmdLabel: "/compact",
    title: "SUMMARIZE",
    subtitle: "Nén context dài, giữ key facts",
    desc: [
      "Chat 2 tiếng Claude quên đầu đuôi?",
      "/compact tự tóm tắt, giữ thông tin chính",
      "Save token, tiếp tục task không reset",
    ],
    demo: "$ /compact\n→ History compressed · key facts kept",
    punchline: "Tiết kiệm token, chồng để dành tiền đẻ thêm con!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🖼️",
    cmdLabel: "Drag · Ctrl+V",
    title: "DROP FILE / IMAGE",
    subtitle: "Claude đọc trực tiếp file & screenshot",
    desc: [
      "Kéo file/folder vào cửa sổ chat",
      "Ctrl+V dán ảnh screenshot từ clipboard",
      "OCR + debug ảnh + đọc PDF tức thì",
    ],
    demo: "[drag main.py] → Claude reads file\n[Ctrl+V image] → Claude OCRs & analyzes",
    punchline: "Đỉnh hơn cả mẹ chồng giải quyết drama!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🎯",
    cmdLabel: "@file",
    title: "FILE MENTION",
    subtitle: "Pin file để Claude focus",
    desc: [
      "@filename → Claude inject full content",
      "Tab để auto-complete tên file",
      "Tránh Claude lan man đọc nhầm tài liệu khác",
    ],
    demo: "@main.py refactor logic check error\n→ Claude focus đúng file đó",
    punchline: "Như chồng nhìn vợ mặc đồ ngủ — không lan man!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "⚡",
    cmdLabel: "!command",
    title: "BASH INLINE",
    subtitle: "Chạy shell ngay trong chat",
    desc: [
      "Prefix dấu ! → Claude exec bash",
      "Output trả về làm context cho turn tiếp",
      "Không cần thoát Claude → mở terminal",
    ],
    demo: "!ls -la\n!git status\n!npm install lodash",
    punchline: "Tiện như chồng order đồ ăn không cần ra khỏi giường!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "↩️",
    cmdLabel: "Esc · Esc",
    title: "UNDO REVERT",
    subtitle: "Quay về bước trước, như chưa làm gì",
    desc: [
      "Bấm Esc 1 lần → interrupt tool đang chạy",
      "Bấm Esc 2 lần → rewind prompt trước",
      "Edit prompt cũ rồi resubmit",
    ],
    demo: "[Esc] interrupt current action\n[Esc + Esc] rewind to previous prompt",
    punchline: "Như cãi nhau xong vợ chồng vẫn đi ngủ chung — undo magic!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "💰",
    cmdLabel: "/cost",
    title: "USAGE TRACKER",
    subtitle: "Xem session đốt bao xu API",
    desc: [
      "Số token in/out + chi phí $",
      "Session-level và daily",
      "Quản lý ví trước khi cuối tháng ngất",
    ],
    demo: "$ /cost\n→ Total: $2.34 · 124k input · 38k output",
    punchline: "Coi tiền như coi tin nhắn người yêu cũ — phải coi đều!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "/model",
    title: "SWITCH BRAIN",
    subtitle: "Opus · Sonnet · Haiku — chọn não đúng task",
    desc: [
      "Opus 4 — task khó, suy luận sâu",
      "Sonnet 4 — balanced default",
      "Haiku 4 — đơn giản, nhanh + rẻ 5x",
    ],
    demo: "$ /model opus\n$ /model haiku\n$ /model sonnet",
    punchline: "Gặp sếp dùng Opus, gặp bạn thân Haiku quẩy tới bến!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "ĐÃ XÀI LỆNH NÀO?",
    ctaLines: ["💾  Save bài này", "💬  Comment lệnh vợ xài nhiều nhất", "🔗  Follow tip Claude Code daily"],
    ctaNote: "Verified · official docs · 2026-05-15",
    color: ACCENT_SOLID,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="maskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="gm"><rect width={W} height={H} fill="url(#maskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#grid)" mask="url(#gm)" />
    <rect width={W} height={H} fill="url(#g1)" />
    <rect width={W} height={H} fill="url(#g2)" />
    <rect width={W} height={H} fill="url(#g3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ claude-code · tip series
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 320)`}>
      <rect x={-220} y={-38} width={440} height={76} rx={38} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={11} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 760)`}>
      <text x={0} y={0} fontSize={360} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-12">
        10
      </text>
      <text x={0} y={130} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        LỆNH
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1170)`}>
      <text x={0} y={0} fontSize={46} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Claude Code phải biết
      </text>
      <text x={0} y={66} fontSize={36} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        học 2 phút · xài cả đời
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1490)`}>
        <rect x={-420} y={-80} width={840} height={160} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
        {s.hookNote.split("\n").map((ln, i) => (
          <text key={i} x={0} y={-16 + i * 44} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            {ln}
          </text>
        ))}
      </g>
    )}
  </g>
);

const CmdSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    {/* Top: command literal in pill */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-360} y={-50} width={720} height={100} rx={22} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={20} fontSize={(s.cmdLabel || "").length > 14 ? 44 : (s.cmdLabel || "").length > 10 ? 52 : 60} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={200} textAnchor="middle">{s.icon}</text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 14 ? 64 : 78} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {/* Subtitle */}
    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {/* Description bullets */}
    {s.desc && (
      <g transform={`translate(${W / 2}, 820)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-440, ${i * 60})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={30} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {/* Terminal demo */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">terminal</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 40} fontSize={24} fill={i === 0 ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
      </g>
    )}

    {/* Punchline */}
    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const CtaSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={128} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(-1)[0]}
      </text>
    </g>
    {s.ctaLines && (
      <g transform={`translate(${W / 2}, 1080)`}>
        {s.ctaLines.map((ln, i) => (
          <g key={i} transform={`translate(0, ${i * 120})`}>
            <rect x={-440} y={-45} width={880} height={90} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
            <text x={0} y={14} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
              {ln}
            </text>
          </g>
        ))}
      </g>
    )}
    {s.ctaNote && (
      <g transform={`translate(${W / 2}, 1640)`}>
        <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "cmd" && <CmdSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
