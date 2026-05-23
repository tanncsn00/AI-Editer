import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#06070D";
const BG_SURFACE = "#10121C";
const BG_ELEVATED = "#171A28";
const BORDER = "#252A3A";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9BA0B5";
const TEXT_MUTE = "#5A6075";
const G_BLUE = "#4285F4";
const G_RED = "#EA4335";
const G_YELLOW = "#FBBC04";
const G_GREEN = "#34A853";
const ACCENT_CYAN = "#3DD9D6";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";

type Slide = {
  kind: "hook" | "ctx" | "prod" | "insight" | "cta";
  icon?: string;
  cmdLabel?: string;
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
    hookTag: "🚨 GOOGLE I/O · 19-05-2026",
    hookBig: "4 ĐÒN",
    hookSub: "AI · 1 NGÀY",
    hookNote: "Google đáp trả Claude + GPT\nMass appeal · verified 2026",
    color: G_BLUE,
  },
  {
    kind: "ctx",
    icon: "🔥",
    cmdLabel: "Vì sao Google nóng ruột?",
    title: "AI RACE 2026",
    subtitle: "Anthropic định giá kỷ lục · OpenAI giữ thế",
    desc: [
      "Anthropic vừa định giá $900B",
      "OpenAI giữ thị phần consumer",
      "Google bị bỏ xa cảm thấy không yên",
    ],
    demo: "Anthropic: $900B valuation ✓\nOpenAI: market share leader\nGoogle: all-in 4 đòn cùng lúc",
    punchline: "Google: tỏ tình muộn nhưng đem cả vườn hoa 🌹",
    color: G_RED,
  },
  {
    kind: "prod",
    icon: "⚡",
    cmdLabel: "Đòn #1 · Gemini 3.5 Flash",
    title: "ĐẬP CẢ FLAGSHIP CŨ",
    subtitle: "Nhỏ-rẻ-nhanh nhưng vượt Gemini 3.1 Pro",
    desc: [
      "Output 4x nhanh hơn frontier khác",
      "Context 1M token · text/ảnh/audio/video/PDF",
      "Giá $1.5 input · $9 output / 1M token",
    ],
    demo: "Terminal-Bench 2.1: 76.2% ✓\nGDPval-AA: 1656 Elo ✓\nMCP Atlas: 83.6% ✓\nCharXiv: 84.2% ✓\n→ Shopify, Salesforce, Macquarie production",
    punchline: "Model rẻ mới giờ mạnh hơn flagship cũ!",
    color: G_YELLOW,
  },
  {
    kind: "prod",
    icon: "🌟",
    cmdLabel: "Đòn #2 · Gemini Spark",
    title: "AGENT 24/7 CLOUD",
    subtitle: "Đọc Gmail · Docs · Calendar thay bạn",
    desc: [
      "Chạy trên Google Cloud VM",
      "Bạn KHÔNG cần mở máy",
      "Tổng hợp meeting · soạn email · làm việc khi bạn ngủ",
    ],
    demo: "Spark workflow:\n→ Đọc email + chat\n→ Tổng hợp meeting note\n→ Soạn Google Docs\n→ Đối thủ trực tiếp Claude Cowork",
    punchline: "Beta cho AI Ultra subscribers · rollout 19/05!",
    color: G_GREEN,
  },
  {
    kind: "prod",
    icon: "🌌",
    cmdLabel: "Đòn #3 · Gemini Omni",
    title: "WORLD MODEL THẬT",
    subtitle: "AI hiểu vật lý · không chỉ generate",
    desc: [
      "Dự đoán hệ quả hành động trong môi trường",
      "Combine Veo + Nano Banana + Genie từ DeepMind",
      "Video có logic vật lý thật (ko fake như Sora)",
    ],
    demo: "Omni capabilities:\n→ Text + audio + image + video input\n→ Physical world simulation\n→ YouTube Shorts có Omni tuần tới\n→ Dev API · vài tuần nữa",
    punchline: "AI giờ HIỂU vật lý chứ không chỉ vẽ video!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "prod",
    icon: "🚀",
    cmdLabel: "Đòn #4 · Antigravity 2.0",
    title: "vs CLAUDE CODE",
    subtitle: "IDE + CLI Go + SDK · rebuild from scratch",
    desc: [
      "Chạy Gemini 3.5 Flash @ 289 t/s",
      "Multi-agent parallel · browser tích hợp",
      "Cross-platform Mac/Linux/Windows",
    ],
    demo: "Antigravity 2.0 vs Claude Code:\n→ Agent-first IDE vs Terminal-first\n→ Gemini 3.5 Flash vs Opus 4.7\n→ Multi-agent + browser vs deep reasoning\n→ Claude Code vẫn dẫn reasoning sâu",
    punchline: "Google đang đuổi RẤT gấp — dev cần để ý!",
    color: ACCENT_CYAN,
  },
  {
    kind: "insight",
    icon: "🎯",
    cmdLabel: "Google đang xây gì?",
    title: "FULL STACK AI",
    subtitle: "Model + Agent + World + IDE — 4 tầng",
    desc: [
      "Model: Gemini 3.5 Flash",
      "Agent: Spark personal AI",
      "World: Omni physical simulation",
      "Coding: Antigravity 2.0 IDE",
    ],
    demo: "Google không thua trận AGI:\n→ Đang xây full stack cho 2027\n→ AI race nóng — tuần nào cũng drama\n→ Anthropic + OpenAI + Google = top 3",
    punchline: "2027 sẽ là năm của AGI — Google chuẩn bị xong!",
    color: G_BLUE,
  },
  {
    kind: "cta",
    ctaTitle: "DÙNG AI NÀO?",
    ctaLines: [
      "💬  Comment: Gemini / Claude / GPT?",
      "💾  Save video tin AI nóng",
      "🔗  Follow CN cập nhật mỗi tuần",
    ],
    ctaNote: "Mỗi Chủ Nhật mình bóc tin AI nóng nhất tuần",
    color: G_YELLOW,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="gbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={G_BLUE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={G_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gbg3" cx="50%" cy="100%" r="50%">
        <stop offset="0%" stopColor={G_GREEN} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gbg4" cx="10%" cy="90%" r="40%">
        <stop offset="0%" stopColor={G_YELLOW} stopOpacity="0.08" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="ggrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={G_BLUE} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="gmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="ggm"><rect width={W} height={H} fill="url(#gmaskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#ggrid)" mask="url(#ggm)" />
    <rect width={W} height={H} fill="url(#gbg1)" />
    <rect width={W} height={H} fill="url(#gbg2)" />
    <rect width={W} height={H} fill="url(#gbg3)" />
    <rect width={W} height={H} fill="url(#gbg4)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ ai weekly · google i/o 2026 · cn news
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 230)`}>
      <rect x={-360} y={-46} width={720} height={92} rx={46} fill={BG_SURFACE} stroke={s.color} strokeWidth={3} />
      <text x={0} y={14} fontSize={28} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={520} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20">
        4
      </text>
    </g>
    <g transform={`translate(${W / 2}, 980)`}>
      <text x={0} y={0} fontSize={120} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
        ĐÒN AI
      </text>
      <text x={0} y={80} fontSize={56} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        trong 1 NGÀY
      </text>
    </g>
    <g transform={`translate(540, 1200)`}>
      <circle cx={-180} cy={0} r={52} fill={G_BLUE} />
      <text x={-180} y={16} fontSize={46} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1</text>
      <circle cx={-60} cy={0} r={52} fill={G_RED} />
      <text x={-60} y={16} fontSize={46} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>2</text>
      <circle cx={60} cy={0} r={52} fill={G_YELLOW} />
      <text x={60} y={16} fontSize={46} fill="#222" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>3</text>
      <circle cx={180} cy={0} r={52} fill={G_GREEN} />
      <text x={180} y={16} fontSize={46} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>4</text>
    </g>
    <g transform={`translate(${W / 2}, 1360)`}>
      <text x={0} y={0} fontSize={38} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Flash · Spark · Omni · Antigravity
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1540)`}>
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

const CardSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 24 ? 30 : (s.cmdLabel || "").length > 18 ? 36 : 42} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 420)`}>
      <text x={0} y={0} fontSize={160} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 600)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 56 : (s.title || "").length > 14 ? 66 : 78} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 680)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 800)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-460, ${i * 58})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={28} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.demo && (
      <g transform={`translate(${W / 2}, 1380)`}>
        <rect x={-490} y={-150} width={980} height={300} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-124} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-124} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-124} r={6} fill="#27C93F" />
        <text x={-406} y={-118} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">verified · 2026-05-19</text>
        {s.demo.split("\n").map((line, i) => {
          const isFail = line.includes("✗") || line.includes("❌");
          const isPass = line.includes("✓") && !line.includes("✗");
          const isArrow = line.startsWith("→");
          const color = isFail ? G_RED : isPass ? G_GREEN : isArrow ? s.color : (i === 0 ? s.color : TEXT_PRI);
          return (
            <text key={i} x={-470} y={-60 + i * 38} fontSize={20} fill={color} fontFamily="'Inter', sans-serif" fontWeight={600}>
              {line}
            </text>
          );
        })}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={26} fill={G_YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
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

export const SlideCarouselGoogleIO: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {(s.kind === "ctx" || s.kind === "prod" || s.kind === "insight") && <CardSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
