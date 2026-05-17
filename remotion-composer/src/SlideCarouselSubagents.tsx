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

type Slide = {
  kind: "hook" | "mcp" | "bonus" | "cta";
  num?: string;
  total?: string;
  icon?: string;
  title?: string;
  stars?: string;
  badge?: string;
  desc?: string[];
  cmd?: string;
  color?: string;
  note?: string;
  hookHeadline?: string;
  hookSub?: string;
  hookTag?: string;
  ctaTitle?: string;
  ctaLines?: string[];
};

const SLIDES: Slide[] = [
  {
    kind: "hook", num: "1", total: "9",
    hookTag: "⚡ Claude Code · Tip",
    hookHeadline: "5 SUBAGENT MUST-HAVE",
    hookSub: "cho Claude Code 2026",
    note: "Subagent + MCP = workflow pro\ndata verified · official docs 05/2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "mcp", num: "2", total: "9",
    icon: "🔍", title: "EXPLORE",
    stars: "Built-in", badge: "Official · Anthropic · Haiku-powered",
    desc: ["Fast read-only codebase search", "3 levels: quick · medium · thorough", "Auto-delegate 'where is X' tasks"],
    cmd: "Agent(subagent_type='Explore',\n  description='Find auth flow',\n  prompt='Locate JWT validation')",
    note: "Tiết kiệm token cho main context",
    color: ACCENT_BLUE,
  },
  {
    kind: "mcp", num: "3", total: "9",
    icon: "🛠️", title: "GENERAL-PURPOSE",
    stars: "Built-in", badge: "Official · workhorse multi-step",
    desc: ["Research + modify + reason", "Inherit model + all tools", "Default khi không có agent specific"],
    cmd: "Agent(subagent_type='general-purpose',\n  description='Refactor auth',\n  prompt='Migrate JWT to OAuth')",
    note: "Fork point cho parallel agents",
    color: ACCENT_CYAN,
  },
  {
    kind: "mcp", num: "4", total: "9",
    icon: "🗺️", title: "PLAN",
    stars: "Built-in", badge: "Official · plan-mode research",
    desc: ["Auto-invoke trong plan mode", "Gather context trước khi plan", "Read-only · no nesting"],
    cmd: "Shift+Tab → Plan mode\n→ Claude tự delegate sang Plan agent",
    note: "Anthropic standard workflow",
    color: ACCENT_VIOLET,
  },
  {
    kind: "mcp", num: "5", total: "9",
    icon: "👀", title: "CODE-REVIEWER",
    stars: "1,680 ⬇", badge: "wshobson/agents · 94/100 popularity",
    desc: ["Auto-invoke sau khi sửa code", "Quality · security · maintainability", "Senior engineer FREE 24/7"],
    cmd: "/plugin marketplace add wshobson/agents\n/plugin install code-review",
    note: "Anthropic có version 5-reviewer plugin",
    color: GOLD,
  },
  {
    kind: "mcp", num: "6", total: "9",
    icon: "🐛", title: "DEBUGGER",
    stars: "957 ⬇", badge: "wshobson/agents · proactive",
    desc: ["Systematic root-cause analysis", "Auto-trigger khi error/test fail", "Pair với superpowers debugging"],
    cmd: "/plugin install debugger",
    note: "Biến debugging thành methodical",
    color: GREEN,
  },
  {
    kind: "bonus", num: "7", total: "9",
    icon: "🏗️", title: "BACKEND-ARCHITECT",
    stars: "1,756 ⬇", badge: "BONUS · top-3 download",
    desc: ["Design REST API · microservice", "Database schema", "Force design-first, tránh rework"],
    cmd: "/plugin install backend-development",
    color: ACCENT_PINK,
  },
  {
    kind: "bonus", num: "8", total: "9",
    icon: "🎨", title: "FRONTEND-DEVELOPER",
    stars: "2,433 ⬇", badge: "BONUS · #1 download all-time",
    desc: ["React/Vue/Angular components", "State mgmt · responsive · a11y", "Hợp Remotion + Next.js workflow"],
    cmd: "/plugin install frontend-developer",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta", num: "9", total: "9",
    ctaTitle: "ĐÃ XÀI SUBAGENT NÀO?",
    ctaLines: ["💾  Save bài này", "💬  Comment subagent bạn xài", "🔗  Follow tip Claude Code daily"],
    note: "Data verified · 2026-05-15",
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

const NumberBadge: React.FC<{ num: string; total: string; color: string }> = ({ num, total, color }) => (
  <g transform="translate(960, 80)">
    <rect x={-110} y={-26} width={110} height={52} rx={12} fill={BG_SURFACE} stroke={color} strokeWidth={2} />
    <text x={-55} y={11} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
      {num}/{total}
    </text>
  </g>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W/2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ claude-code · tip series
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W/2}, 380)`}>
      <rect x={-260} y={-38} width={520} height={76} rx={38} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={11} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W/2}, 700)`}>
      <text x={0} y={0} fontSize={240} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-4">
        5
      </text>
      <text x={0} y={130} fontSize={78} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="0">
        {s.hookHeadline?.split(" ").slice(1).join(" ") || "MUST-HAVE"}
      </text>
    </g>
    <g transform={`translate(${W/2}, 1080)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        {s.hookSub}
      </text>
    </g>
    {s.note && (
      <g transform={`translate(${W/2}, 1450)`}>
        <rect x={-420} y={-80} width={840} height={160} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
        {s.note.split("\n").map((ln, i) => (
          <text key={i} x={0} y={-18 + i * 44} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            {ln}
          </text>
        ))}
      </g>
    )}
  </g>
);

const McpSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(80, 150)`}>
      <rect x={0} y={0} width={340} height={64} rx={12} fill={BG_ELEVATED} stroke={s.color} strokeWidth={2} />
      <text x={170} y={42} fontSize={28} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.stars}
      </text>
    </g>
    {s.badge && (
      <g transform={`translate(80, 250)`}>
        <text x={0} y={0} fontSize={22} fill={TEXT_SEC} fontFamily="'Inter', sans-serif" fontWeight={600}>
          {s.badge}
        </text>
      </g>
    )}
    <g transform={`translate(${W/2}, 480)`}>
      <text x={0} y={0} fontSize={210} textAnchor="middle">{s.icon}</text>
    </g>
    <g transform={`translate(${W/2}, 660)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 14 ? 60 : (s.title || "").length > 10 ? 72 : 84} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>
    {s.desc && (
      <g transform={`translate(${W/2}, 780)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-420, ${i * 56})`}>
            <circle cx={0} cy={-8} r={5} fill={s.color} />
            <text x={26} y={0} fontSize={32} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}
    {s.cmd && (
      <g transform={`translate(${W/2}, 1320)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">terminal</text>
        {s.cmd.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 36} fontSize={22} fill={i === 0 ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {i === 0 ? `$ ${line}` : `  ${line}`}
          </text>
        ))}
      </g>
    )}
    {s.note && (
      <g transform={`translate(${W/2}, 1700)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
          → {s.note}
        </text>
      </g>
    )}
  </g>
);

const CtaSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W/2}, 600)`}>
      <text x={0} y={0} fontSize={120} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={140} fontSize={120} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(-1)[0]}
      </text>
    </g>
    {s.ctaLines && (
      <g transform={`translate(${W/2}, 1080)`}>
        {s.ctaLines.map((ln, i) => (
          <g key={i} transform={`translate(0, ${i * 120})`}>
            <rect x={-420} y={-45} width={840} height={90} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
            <text x={0} y={14} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
              {ln}
            </text>
          </g>
        ))}
      </g>
    )}
    {s.note && (
      <g transform={`translate(${W/2}, 1640)`}>
        <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.note}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselSubagents: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* Number badge removed per user feedback */}
        {s.kind === "hook" && <HookSlide s={s} />}
        {(s.kind === "mcp" || s.kind === "bonus") && <McpSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
