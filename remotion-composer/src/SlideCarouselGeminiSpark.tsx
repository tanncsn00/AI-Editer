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
const ACCENT_AMBER = "#F4B860";

type Slide = {
  kind: "hook" | "card" | "compare3" | "cta";
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
  cols?: { label: string; items: string[]; color: string }[];
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "🌟 GOOGLE I/O · NEW 2026",
    hookBig: "SPARK",
    hookSub: "AGENT 24/7",
    hookNote: "Chạy lúc bạn ngủ\nGoogle vừa thả · 19-05-2026",
    color: G_YELLOW,
  },
  {
    kind: "card",
    icon: "☁️",
    cmdLabel: "Spark là gì?",
    title: "AGENT TRÊN CLOUD",
    subtitle: "KHÔNG cần máy bạn bật · Google Cloud VM 24/7",
    desc: [
      "Bạn nhắn task → đóng máy → đi ngủ",
      "Spark tiếp tục làm trong background",
      "Sáng dậy có kết quả sẵn",
    ],
    demo: "Workflow:\n→ 22h: bạn giao task cho Spark\n→ 23h: đóng laptop, đi ngủ\n→ 7h sáng: kết quả sẵn trong Gmail\n→ Bạn chỉ check + duyệt",
    punchline: "Đây là agent đầu tiên thật sự HOẠT ĐỘNG khi bạn ngủ!",
    color: G_BLUE,
  },
  {
    kind: "card",
    icon: "📧",
    cmdLabel: "Demo #1 · Lead capture",
    title: "EMAIL → SHEET → DRIVE",
    subtitle: "Tự động hóa toàn workflow khách hàng",
    desc: [
      "Email khách báo giá → Spark đọc",
      "Extract tên, ngày, dịch vụ → log Sheet",
      "Tạo folder Drive đặt tên khách",
    ],
    demo: "📧 'Tôi muốn báo giá web bán hàng'\n     ↓ Spark đọc + extract\n📊 Client Tracker.xlsx + row mới\n     ↓ Auto\n📁 /Clients/Nguyen Van A/ folder\n→ Bạn ngủ · Spark làm",
    punchline: "1 email = 3 action tự động · 0 tay người",
    color: G_RED,
  },
  {
    kind: "card",
    icon: "💸",
    cmdLabel: "Demo #2 · Monitor sub",
    title: "TỔNG KẾT TIÊU XÀI",
    subtitle: "Spark theo dõi tất cả subscription",
    desc: [
      "Bạn nhắn: 'tuần này dùng sub bao nhiêu'",
      "Spark check Netflix/Spotify/YouTube/...",
      "Auto email report sáng hôm sau",
    ],
    demo: "📩 Subscription Report - 22/05\n→ Netflix:  $14.99 (dùng 8h)\n→ Spotify:  $9.99  (dùng 25h)\n→ YouTube:  $13.99 (dùng 4h)\n→ Total: $38.97 · → Khuyến nghị: cut YT",
    punchline: "Tự động tài chính cá nhân — không phải mở app từng cái!",
    color: G_GREEN,
  },
  {
    kind: "card",
    icon: "🔌",
    cmdLabel: "Connect được gì?",
    title: "TOÀN BỘ ĐỜI SỐ",
    subtitle: "Native Google + 30+ app bên thứ ba",
    desc: [
      "Google native: Gmail · Calendar · Drive · Docs · Sheets · Slides · YouTube · Maps",
      "MCP connectors mới: Adobe · Asana · Box · Canva · Dropbox · HubSpot",
      "Sắp ra: Intuit · Monday · Pandora · Spotify · Wix",
    ],
    demo: "Spark workflow chains:\n→ HubSpot lead → Calendar invite\n→ Asana task → Docs spec → Slack ping\n→ Canva design → Drive folder → Email client\n→ Spotify playlist → meeting context",
    punchline: "Tất cả app bạn xài hằng ngày — Spark quản hết!",
    color: ACCENT_AMBER,
  },
  {
    kind: "card",
    icon: "💰",
    cmdLabel: "Giá bao nhiêu?",
    title: "$100 - $200 / THÁNG",
    subtitle: "Google AI Ultra subscription · US only",
    desc: [
      "AI Ultra Entry: $100/mo (mới)",
      "AI Ultra Top: $200/mo (cắt từ $249.99)",
      "VN: cần VPN US + tài khoản US",
    ],
    demo: "So sánh giá agent 2026:\n→ Google AI Ultra:    $100-200/mo\n→ Claude Max:         $100-200/mo\n→ ChatGPT Pro+:       $200/mo\n→ Tất cả ngang nhau · diff feature",
    punchline: "Giá cao nhưng ngang đối thủ · chọn theo ecosystem",
    color: G_YELLOW,
  },
  {
    kind: "compare3",
    icon: "🥊",
    cmdLabel: "vs Cowork vs Atlas",
    title: "3 AGENT · CHỌN GÌ?",
    subtitle: "Khác biệt rõ ràng · pick theo nhu cầu",
    cols: [
      {
        label: "🌟 SPARK",
        color: G_BLUE,
        items: ["Google native", "Gmail/Docs/Drive", "Cloud 24/7", "Schedule task", "Best for: Workspace user"],
      },
      {
        label: "🤝 COWORK",
        color: G_YELLOW,
        items: ["File generation", "Word/Excel/PDF", "Desktop VM", "Real deliverable", "Best for: Office worker"],
      },
      {
        label: "🌐 ATLAS",
        color: G_RED,
        items: ["Web browse", "Agent on web", "Buy online", "Form fill", "Best for: Research/shop"],
      },
    ],
    punchline: "Không có winner — chọn theo workflow!",
    color: G_GREEN,
  },
  {
    kind: "cta",
    ctaTitle: "GIAO VIỆC GÌ?",
    ctaLines: [
      "💬  Comment task đầu tiên cho Spark",
      "💾  Save video tin AI hot",
      "🔗  Follow cập nhật agent battle 2026",
    ],
    ctaNote: "VN: VPN US + Ultra subscription · gửi đồng nghiệp cùng biết",
    color: G_YELLOW,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="sbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={G_BLUE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={G_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sbg3" cx="50%" cy="100%" r="50%">
        <stop offset="0%" stopColor={G_GREEN} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sbg4" cx="10%" cy="90%" r="40%">
        <stop offset="0%" stopColor={G_YELLOW} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="sgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={G_BLUE} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="smaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="sgm"><rect width={W} height={H} fill="url(#smaskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#sgrid)" mask="url(#sgm)" />
    <rect width={W} height={H} fill="url(#sbg1)" />
    <rect width={W} height={H} fill="url(#sbg2)" />
    <rect width={W} height={H} fill="url(#sbg3)" />
    <rect width={W} height={H} fill="url(#sbg4)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ ai weekly · gemini spark · cn deep dive
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
      <text x={0} y={0} fontSize={300} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-10">
        {s.hookBig}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 980)`}>
      <text x={0} y={0} fontSize={96} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
        {s.hookSub}
      </text>
    </g>
    {/* 4-color google bar */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <rect x={-220} y={-14} width={100} height={28} fill={G_BLUE} rx={6} />
      <rect x={-110} y={-14} width={100} height={28} fill={G_RED} rx={6} />
      <rect x={0} y={-14} width={100} height={28} fill={G_YELLOW} rx={6} />
      <rect x={110} y={-14} width={100} height={28} fill={G_GREEN} rx={6} />
    </g>
    <g transform={`translate(${W / 2}, 1280)`}>
      <text x={0} y={0} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Personal AI agent · 24/7 cloud
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

const CardSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : 40} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 400)`}>
      <text x={0} y={0} fontSize={150} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 22 ? 50 : 62} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 660)`}>
        <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 780)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-470, ${i * 56})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.demo && (
      <g transform={`translate(${W / 2}, 1380)`}>
        <rect x={-490} y={-140} width={980} height={280} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-114} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-114} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-114} r={6} fill="#27C93F" />
        <text x={-406} y={-108} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">spark · workflow</text>
        {s.demo.split("\n").map((line, i) => {
          const isArrow = line.startsWith("→") || line.includes("↓");
          const color = isArrow ? s.color : TEXT_PRI;
          return (
            <text key={i} x={-470} y={-60 + i * 34} fontSize={18} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              {line}
            </text>
          );
        })}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1710)`}>
        <text x={0} y={0} fontSize={24} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const Compare3Slide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={40} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 360)`}>
      <text x={0} y={0} fontSize={64} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 430)`}>
        <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {/* 3 columns */}
    {s.cols && s.cols.map((col, ci) => {
      const xCenter = 200 + ci * 340;
      return (
        <g key={ci} transform={`translate(${xCenter}, 580)`}>
          <rect x={-150} y={-50} width={300} height={100} rx={16} fill={BG_SURFACE} stroke={col.color} strokeWidth={3} />
          <text x={0} y={14} fontSize={30} fill={col.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {col.label}
          </text>
          {col.items.map((it, i) => (
            <g key={i} transform={`translate(-140, ${110 + i * 65})`}>
              <text x={0} y={0} fontSize={20} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
                {it}
              </text>
            </g>
          ))}
        </g>
      );
    })}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1700)`}>
        <text x={0} y={0} fontSize={28} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
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
            <text x={0} y={14} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
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

export const SlideCarouselGeminiSpark: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "card" && <CardSlide s={s} />}
        {s.kind === "compare3" && <Compare3Slide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
