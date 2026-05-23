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
  kind: "hook" | "cmd" | "bonus" | "cta";
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
  bonusItems?: { icon: string; name: string; tag: string }[];
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⚡ MCP · Automation",
    hookNote: "Hê lô các con vợ iu · 5 MCP biến Claude\nthành robot điều khiển máy · + 2 bonus cuối",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🎭",
    cmdLabel: "Playwright MCP",
    title: "BROWSER STANDARD",
    subtitle: "Microsoft official · de facto cho mọi dev",
    desc: [
      "Tự mở browser, click, fill form",
      "Chụp screenshot, chạy JavaScript",
      "Auto đăng bài, scrape giá, fill captcha",
    ],
    demo: "npx @playwright/mcp\n→ navigate · click · type · screenshot · eval",
    punchline: "Như có em thực tập sinh tin học làm việc miễn phí!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🔓",
    cmdLabel: "Browser MCP (Chrome ext)",
    title: "AUTHENTICATED SESSION",
    subtitle: "Dùng session login sẵn — không cần đăng nhập lại",
    desc: [
      "Auto reply Zalo · auto crawl Facebook",
      "Auto chạy job logged-in",
      "Bypass login flow + 2FA · keep cookies",
    ],
    demo: "Install Chrome ext → connect MCP\n→ Claude sees your logged-in tabs",
    punchline: "Chìa khoá điện thoại vợ — đọc hết, không sợ login fail!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🪟",
    cmdLabel: "Windows-MCP",
    title: "OS-LEVEL CONTROL",
    subtitle: "Click chuột + gõ phím + mở app + kéo file",
    desc: [
      "Native UI snapshot — 0.2-0.9s latency",
      "Excel, Word, Photoshop, mọi app Windows",
      "Legacy app, ứng dụng cũ → automate được",
    ],
    demo: "uvx windows-mcp\n→ snapshot UI tree · click_at(x,y) · type_text",
    punchline: "Vợ chỉ chỉ đạo, chồng tay click — automate!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "🖱️",
    cmdLabel: "Computer Control MCP",
    title: "CROSS-PLATFORM",
    subtitle: "Windows · Mac · Linux · PyAutoGUI + OCR",
    desc: [
      "PyAutoGUI input automation",
      "RapidOCR đọc text màn hình",
      "Click theo pixel, không cần vision model",
    ],
    demo: "pip install computer-control-mcp\n→ screenshot · ocr · click · type · drag",
    punchline: "Robot làm thay tất cả việc lặt vặt máy tính!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "✨",
    cmdLabel: "Stagehand MCP",
    title: "NL → ACTION",
    subtitle: "Natural language thẳng vô action · Browserbase",
    desc: [
      "Bảo: \"mua iPhone giá thấp nhất Tiki\"",
      "Bảo: \"đặt vé Đà Lạt cuối tuần\"",
      "Tự navigate · tự click · tự checkout",
    ],
    demo: 'page.act("buy cheapest iPhone on Tiki")\n→ Stagehand: navigate + click + form',
    punchline: "Như có thư ký riêng của Tony Stark!",
    color: ACCENT_PINK,
  },
  {
    kind: "bonus",
    cmdLabel: "🎁 BONUS",
    title: "PLUS 2 TOOLS",
    subtitle: "Built-in + cloud headless",
    bonusItems: [
      { icon: "🤖", name: "Anthropic Computer Use", tag: "Built-in · ko cần MCP · Cowork ngầm xài" },
      { icon: "☁️", name: "Browserbase MCP", tag: "Cloud headless · 24/7 production · CI/CD agent" },
    ],
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "VỢ THỬ CÁI NÀO?",
    ctaLines: ["💾  Save bài này", "💬  Comment MCP vợ sẽ thử trước", "🔗  Follow tip automation daily"],
    ctaNote: "Chồng giận thật nếu vợ không follow · MCP 2026",
    color: ACCENT_VIOLET,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_VIOLET} strokeWidth="1" opacity="0.05" />
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
      ⚡ mcp · automation · claude agent
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-300} y={-44} width={600} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={32} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={360} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-12">
        5
      </text>
      <text x={0} y={140} fontSize={108} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        MCP
      </text>
      <text x={0} y={228} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        AUTOMATION
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Claude điều khiển máy như robot
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        + 2 bonus cuối · save liền liền
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
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-440} y={-50} width={880} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 42 : 50} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={180} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 54 : (s.title || "").length > 14 ? 64 : 74} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

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

    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">install / demo</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 40} fontSize={22} fill={i === 0 || line.startsWith("$") ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const BonusSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 240)`}>
      <rect x={-260} y={-60} width={520} height={120} rx={24} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={22} fontSize={68} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 500)`}>
      <text x={0} y={0} fontSize={100} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 590)`}>
        <text x={0} y={0} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.bonusItems && (
      <g transform={`translate(${W / 2}, 850)`}>
        {s.bonusItems.map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 380})`}>
            <rect x={-480} y={-150} width={960} height={300} rx={24} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
            <text x={0} y={-60} fontSize={140} textAnchor="middle">{item.icon}</text>
            <text x={0} y={50} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              {item.name}
            </text>
            <text x={0} y={108} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
              {item.tag}
            </text>
          </g>
        ))}
      </g>
    )}
  </g>
);

const CtaSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={96} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={124} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
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
        <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop5McpAuto: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "cmd" && <CmdSlide s={s} />}
        {s.kind === "bonus" && <BonusSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
