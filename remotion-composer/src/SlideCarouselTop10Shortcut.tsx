import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#06070D";
const BG_SURFACE = "#10121C";
const BG_ELEVATED = "#171A28";
const BORDER = "#252A3A";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9BA0B5";
const TEXT_MUTE = "#5A6075";
const ACCENT_CYAN = "#3DD9D6";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_AMBER = "#F4B860";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_GREEN = "#3FD68A";
const ACCENT_RED = "#FF6B6B";

type Slide = {
  kind: "hook" | "rank" | "cta";
  rank?: number;
  keyLabel?: string;
  keyEmoji?: string;
  title?: string;
  subtitle?: string;
  desc?: string[];
  demo?: string;
  punchline?: string;
  color?: string;
  hookTag?: string;
  hookBig?: string;
  hookSub?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⌨️ TOP 10 · CLAUDE CODE · 2026",
    hookBig: "10",
    hookSub: "SHORTCUT KING",
    hookNote: "Chồng dạy vợ tăng tốc 2x\nĐếm ngược 10 → 1 · #1 sốc",
    color: ACCENT_CYAN,
  },
  {
    kind: "rank",
    rank: 10,
    keyEmoji: "⬆️⬇️",
    keyLabel: "Arrow Up / Down",
    title: "CYCLE LỊCH SỬ MESSAGE",
    subtitle: "Đỡ phải gõ lại prompt dài",
    desc: [
      "Lên = lệnh cũ hơn",
      "Xuống = lệnh mới hơn",
      "Cơ bản nhưng dễ quên",
    ],
    demo: "$ ⬆️ → 'fix bug authentication'\n$ ⬆️ → 'add login flow'\n$ ⬇️ → 'fix bug authentication'\n→ Recall prompt cũ trong 1 giây",
    punchline: "Cơ bản nhất nhưng 50% vợ chưa biết!",
    color: TEXT_SEC,
  },
  {
    kind: "rank",
    rank: 9,
    keyEmoji: "⏎",
    keyLabel: "Shift + Enter",
    title: "NEWLINE KHÔNG GỬI",
    subtitle: "Soạn prompt nhiều dòng dễ hơn",
    desc: [
      "Native: iTerm2, WezTerm, Warp, Windows Terminal",
      "VS Code/Cursor/Windsurf: chạy /terminal-setup 1 lần",
      "Fallback: \\ + Enter hoặc Option+Enter (Mac)",
    ],
    demo: "Hãy phân tích codebase{Shift+Enter}\n- Check bug auth{Shift+Enter}\n- List file quan trọng{Shift+Enter}\n- Suggest refactor{Enter}\n→ Prompt nhiều dòng đẹp",
    punchline: "Tip pro: /terminal-setup config 1 phát ăn cả đời!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "rank",
    rank: 8,
    keyEmoji: "🔍",
    keyLabel: "Ctrl + R",
    title: "REVERSE HISTORY SEARCH",
    subtitle: "Gõ keyword → pop lệnh cũ",
    desc: [
      "Như reverse search trong terminal",
      "Search xuyên qua hàng trăm prompt cũ",
      "Vợ không phải nhớ chính xác",
    ],
    demo: "(reverse-i-search): 'auth'\n→ 'fix bug authentication flow'\n(reverse-i-search): 'docker'\n→ 'docker compose up logs'\n→ Recall nhanh hơn typing 10x",
    punchline: "Search lệnh trong 2 giây thay vì scroll!",
    color: ACCENT_GREEN,
  },
  {
    kind: "rank",
    rank: 7,
    keyEmoji: "/",
    keyLabel: "Slash Command",
    title: "MENU LỆNH TÍCH HỢP",
    subtitle: "Gõ / → full slash menu",
    desc: [
      "/resume — mở session cũ",
      "/clear — xóa context (giảm token)",
      "/help — list lệnh cho vợ mới",
      "/terminal-setup, /init, /agents...",
    ],
    demo: "$ /\n  /resume    ← mở session cũ\n  /clear     ← xóa context\n  /help      ← list lệnh\n  /init      ← setup CLAUDE.md\n  /agents    ← list agent",
    punchline: "1 phím / mở cánh cửa toàn vũ trụ Claude!",
    color: ACCENT_CYAN,
  },
  {
    kind: "rank",
    rank: 6,
    keyEmoji: "@",
    keyLabel: "At Prefix",
    title: "MENTION FILE TRỰC TIẾP",
    subtitle: "Tag file vô prompt · tiết kiệm token",
    desc: [
      "Claude đọc luôn không cần Read tool",
      "Hỗ trợ autocomplete tên file",
      "Cũng tag được @directory",
    ],
    demo: "$ Hãy fix bug trong @src/auth.ts\n$ So sánh @file1.py với @file2.py\n$ Đọc @docs/ và summarize\n→ Tiết kiệm 1 tool call mỗi @\n→ Output nhanh hơn 30%",
    punchline: "1 ký tự @ = bớt 1 tool call!",
    color: ACCENT_AMBER,
  },
  {
    kind: "rank",
    rank: 5,
    keyEmoji: "!",
    keyLabel: "Bang Prefix",
    title: "BASH INLINE",
    subtitle: "Chạy bash trong prompt → Claude phân tích",
    desc: [
      "Output bash về Claude tự xử lý",
      "Không phải copy-paste output sang",
      "Dùng để debug nhanh",
    ],
    demo: "$ !git status\n$ !ls -la src/\n$ !npm run test\n→ Output về Claude phân tích\n→ Pipeline: bash → AI → action",
    punchline: "Bash + AI = combo OP nhất 2026!",
    color: ACCENT_PINK,
  },
  {
    kind: "rank",
    rank: 4,
    keyEmoji: "#",
    keyLabel: "Hash Prefix",
    title: "QUICK MEMORY ADD",
    subtitle: "Auto save vào CLAUDE.md",
    desc: [
      "Note nhanh không mở file",
      "Claude tự ghi vào memory",
      "Hỏi vị trí save (project/user)",
    ],
    demo: "$ # User dùng pnpm thay yarn\n$ # Test framework: Vitest\n$ # Deploy via vercel CLI\n→ Auto append CLAUDE.md\n→ Persist qua session sau",
    punchline: "Memory không cần mở editor!",
    color: ACCENT_GREEN,
  },
  {
    kind: "rank",
    rank: 3,
    keyEmoji: "⎋",
    keyLabel: "Escape",
    title: "INTERRUPT NOW",
    subtitle: "Cắt ngang khi Claude sai hướng",
    desc: [
      "Stop ngay lập tức (không chờ)",
      "Đỡ tốn token chồng phải trả",
      "Quan trọng cho dài-running task",
    ],
    demo: "$ Claude: 'Đang refactor 50 files...'\n$ [Esc] ← STOP\n$ User: 'Khoan, làm 1 file thôi'\n→ Pivot direction trong tích tắc\n→ Không tốn token phí",
    punchline: "Esc = phanh khẩn cấp cho ví bạn!",
    color: ACCENT_RED,
  },
  {
    kind: "rank",
    rank: 2,
    keyEmoji: "⎋⎋",
    keyLabel: "Escape Escape",
    title: "REWIND + FORK",
    subtitle: "Quay về tin nhắn cũ + đi hướng khác",
    desc: [
      "Như Git checkout — quay lại điểm cũ",
      "Fork conversation từ đó",
      "Khi đi sai hướng và muốn undo",
    ],
    demo: "msg1: 'Fix auth bug'\nmsg2: 'Add login'\nmsg3: 'Refactor everything' ← sai!\n[Esc Esc] → quay về msg2\n→ Fork direction khác → 'Add OAuth'",
    punchline: "Undo trong conversation = superpower!",
    color: ACCENT_AMBER,
  },
  {
    kind: "rank",
    rank: 1,
    keyEmoji: "👑",
    keyLabel: "Shift + Tab",
    title: "CYCLE 3 MODE · KING",
    subtitle: "Default → Plan → Auto-accept",
    desc: [
      "Default: hỏi trước mỗi action",
      "Plan mode: Claude NGHĨ trước khi code",
      "Auto-accept: tự gõ Enter — vợ ngồi xem",
    ],
    demo: "[Shift+Tab] → default mode\n[Shift+Tab] → ⏸️ plan mode\n[Shift+Tab] → 🚀 auto-accept\n→ Mọi pro dev đều dùng\n→ Shortcut quan trọng nhất 2026",
    punchline: "1 phím = 3 superpower!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cta",
    ctaTitle: "SHORTCUT NÀO?",
    ctaLines: [
      "💾  Save video tip",
      "💬  Comment shortcut yêu thích",
      "🔗  Follow chồng · tip Claude Code mới",
    ],
    ctaNote: "Gửi các con vợ khác cùng biết · chồng update tip mới mỗi tuần",
    color: ACCENT_VIOLET,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="kbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.16" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kbg3" cx="50%" cy="100%" r="50%">
        <stop offset="0%" stopColor={ACCENT_AMBER} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="kgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_CYAN} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="kmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="kgm"><rect width={W} height={H} fill="url(#kmaskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#kgrid)" mask="url(#kgm)" />
    <rect width={W} height={H} fill="url(#kbg1)" />
    <rect width={W} height={H} fill="url(#kbg2)" />
    <rect width={W} height={H} fill="url(#kbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ chồng dạy vợ · claude code workflow
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 230)`}>
      <rect x={-380} y={-46} width={760} height={92} rx={46} fill={BG_SURFACE} stroke={s.color} strokeWidth={3} />
      <text x={0} y={14} fontSize={28} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={520} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20">
        {s.hookBig}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 980)`}>
      <text x={0} y={0} fontSize={88} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
        {s.hookSub}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={20} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={2} />
      <text x={0} y={-10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ⬆⬇ · ⏎ · ⌃R · / · @ · ! · # · ⎋ · ⎋⎋ · ⇧⇥
      </text>
      <text x={0} y={28} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        10 superpower trong 2 phút
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1510)`}>
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

const RankSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    {/* Rank badge top-left */}
    <g transform={`translate(120, 190)`}>
      <rect x={-60} y={-50} width={140} height={100} rx={20} fill={s.color} />
      <text x={10} y={20} fontSize={62} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        #{s.rank}
      </text>
    </g>

    {/* Key label box top */}
    <g transform={`translate(620, 190)`}>
      <rect x={-260} y={-50} width={520} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={16} fontSize={(s.keyLabel || "").length > 14 ? 36 : 44} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
        {s.keyLabel}
      </text>
    </g>

    {/* Emoji */}
    <g transform={`translate(${W / 2}, 420)`}>
      <text x={0} y={0} fontSize={160} textAnchor="middle">{s.keyEmoji}</text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 620)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 24 ? 50 : (s.title || "").length > 18 ? 60 : 72} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 700)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 820)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-470, ${i * 56})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={26} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.demo && (
      <g transform={`translate(${W / 2}, 1370)`}>
        <rect x={-490} y={-150} width={980} height={300} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-124} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-124} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-124} r={6} fill="#27C93F" />
        <text x={-406} y={-118} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">claude-code · demo</text>
        {s.demo.split("\n").map((line, i) => {
          const isArrow = line.startsWith("→");
          const isCmd = line.startsWith("$");
          const color = isArrow ? s.color : isCmd ? ACCENT_GREEN : TEXT_PRI;
          return (
            <text key={i} x={-470} y={-60 + i * 36} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              {line}
            </text>
          );
        })}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={26} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const CtaSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={108} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={128} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(-1)[0]}
      </text>
    </g>
    {s.ctaLines && (
      <g transform={`translate(${W / 2}, 1060)`}>
        {s.ctaLines.map((ln, i) => (
          <g key={i} transform={`translate(0, ${i * 120})`}>
            <rect x={-440} y={-45} width={880} height={90} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
            <text x={0} y={14} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
              {ln}
            </text>
          </g>
        ))}
      </g>
    )}
    {s.ctaNote && (
      <g transform={`translate(${W / 2}, 1640)`}>
        <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10Shortcut: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "rank" && <RankSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
