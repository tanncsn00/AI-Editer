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
  hookTag?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⚡ Claude Code · Ecosystem",
    hookNote: "Default đã đỉnh — lắp 10 plugin Claude bay Sao Hỏa\nchính chủ + cộng đồng · 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "🦅",
    cmdLabel: "claudeclaw",
    title: "HEARTBEAT BOT",
    subtitle: "Telegram + Discord + cron job 24/7",
    desc: [
      "Plugin chạy nền liên tục, không cần mở terminal",
      "Chat Claude qua Telegram/Discord từ điện thoại",
      "Setup cron — auto run lệnh theo lịch",
    ],
    demo: "$ /heartbeat:start\n→ Telegram bot ready · Discord ready\n→ cron: daily review @ 9am",
    punchline: "Như chồng có trợ lý cá nhân theo dõi mọi việc!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🟦",
    cmdLabel: "VS Code Extension",
    title: "OFFICIAL IDE",
    subtitle: "Anthropic — sidebar + diff + chat",
    desc: [
      "Cài qua marketplace VS Code, official",
      "Claude live trong sidebar — edit, accept diff",
      "Chat side panel — không cần thoát ra terminal",
    ],
    demo: "$ code --install-extension anthropic.claude-code\n→ Claude in sidebar · accept/reject diff",
    punchline: "Kéo Claude vô bếp, vừa nấu vừa hỏi — không phải chạy terminal!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🟧",
    cmdLabel: "JetBrains Plugin",
    title: "INTELLIJ FAMILY",
    subtitle: "IntelliJ · PyCharm · WebStorm",
    desc: [
      "Plugin official cho toàn JetBrains family",
      "Inline edit + diff preview như VS Code",
      "Hỗ trợ Java/Kotlin/Python/JS một plugin",
    ],
    demo: "Settings → Plugins → Claude Code → Install\n→ available trong toàn JetBrains IDEs",
    punchline: "Dev Java đỡ ghen tị với TypeScript dev có Cursor!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "superpowers",
    title: "SKILL FRAMEWORK",
    subtitle: "Brainstorm · TDD · debug discipline",
    desc: [
      "Bộ skill bằng tài liệu — Claude tự pick & follow",
      "TDD lock cứng · brainstorming structured",
      "Code review tự động · debug systematic",
    ],
    demo: "$ /plugin install superpowers\n→ skills: brainstorming, TDD, debug, review",
    punchline: "Chồng có sổ tay quy tắc — không ai cãi được!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "💰",
    cmdLabel: "ccusage",
    title: "COST DASHBOARD",
    subtitle: "Token + $ real-time per session/project",
    desc: [
      "CLI tool theo dõi chi tiêu API",
      "Phân tích token/cost theo session, project, tháng",
      "Dashboard đẹp + export CSV",
    ],
    demo: "$ npx ccusage daily\n→ Today: $4.20 · 156k input · 42k output\n→ This month: $87.50",
    punchline: "Coi tiền liên tục — như coi tin nhắn người yêu cũ!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "📟",
    cmdLabel: "cc-statusline",
    title: "STATUS BAR ĐẸP",
    subtitle: "model · token · cost · git · project all-in-one",
    desc: [
      "Bộ template status bar siêu phong phú",
      "Hiện model, token, cost, git branch, project name",
      "Customize màu, icon — fit aesthetic của vợ",
    ],
    demo: '"statusLine": {\n  "command": "ccstatusline"\n}\n→ 💎 opus | 🔵 main | $2.34 | 124k tok',
    punchline: "Status bar mặc định cô đơn — set cái này sáng đèn LED Tết!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "🎨",
    cmdLabel: "ui-ux-pro-max",
    title: "DESIGN INTELLIGENCE",
    subtitle: "50 styles · 161 palettes · 99 UX guidelines",
    desc: [
      "Plugin design system cho web/mobile",
      "shadcn/ui MCP search component + example",
      "Build app đẹp sẵn không cần thuê designer",
    ],
    demo: "$ /plugin install ui-ux-pro-max\n→ build landing → claymorphism + bento + dark",
    punchline: "Có designer FAANG ngồi cạnh — vợ chỉ chỉ đạo!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🔥",
    cmdLabel: "firecrawl",
    title: "WEB SCRAPE/SEARCH",
    subtitle: "Real-time internet · bypass knowledge cutoff",
    desc: [
      "Scrape page bất kỳ · search Google · crawl docs",
      "Bypass knowledge cutoff — đọc internet hiện tại",
      "Skills: scrape, map, crawl, search, agent",
    ],
    demo: "/firecrawl-search latest Anthropic features\n→ scrape + search + return markdown",
    punchline: "Chồng có thư viện vô tận — tra cái gì cũng ra!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "💬",
    cmdLabel: "Claudia / Happy Coder",
    title: "DESKTOP GUI CHAT",
    subtitle: "Như ChatGPT desktop — non-techie friendly",
    desc: [
      "Giao diện chat đẹp trên desktop",
      "Không cần terminal — click chuột giao tiếp Claude",
      "Mẹ chồng cũng dùng được",
    ],
    demo: "Download Claudia.app → install → done\n→ desktop GUI · projects · history",
    punchline: "Mẹ chồng cũng dùng được — không sợ techno phobia!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🚦",
    cmdLabel: "claude-code-router",
    title: "MULTI-PROVIDER",
    subtitle: "Anthropic · Bedrock AWS · Vertex Google",
    desc: [
      "Route Claude giữa nhiều provider",
      "Fail over khi rate limit / save cost",
      "Cùng API, chuyển provider 1 dòng config",
    ],
    demo: "$ npx claude-code-router\n→ route opus → bedrock\n→ route haiku → vertex (cheap)",
    punchline: "Multi-provider như có nhiều bồ — không sợ một bên giận!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "PLUGIN BÁ ĐẠO?",
    ctaLines: ["💾  Save bài này", "💬  Comment plugin vợ đã xài", "🔗  Follow tip Claude daily"],
    ctaNote: "Chồng giận thật nếu vợ không follow · 2026",
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
      ⚡ claude-code · ecosystem · tip series
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-320} y={-44} width={640} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={32} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={106} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        PLUGIN
      </text>
      <text x={0} y={224} fontSize={44} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ecosystem 2026
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Claude Code · chính chủ + cộng đồng
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        không lắp = phí cả tài năng của Claude
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
    {/* Top: plugin name pill */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-440} y={-50} width={880} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 40 : 50} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={180} textAnchor="middle">{s.icon}</text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 54 : (s.title || "").length > 14 ? 64 : 74} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {/* Subtitle */}
    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {/* Description bullets */}
    {s.desc && (
      <g transform={`translate(${W / 2}, 820)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-460, ${i * 60})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={28} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {/* Terminal/demo */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">install</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 40} fontSize={22} fill={i === 0 || line.startsWith('$') || line.startsWith('"') ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
      </g>
    )}

    {/* Punchline */}
    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
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

export const SlideCarouselTop10Plugins: React.FC = () => {
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
