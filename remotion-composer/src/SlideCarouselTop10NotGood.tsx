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
    hookTag: "⚠️ Claude · Sự Thật",
    hookNote: "1 năm xài thật · không gáy · không sponsor\nAnthropic không nói cho vợ 10 sự thật này",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🧮",
    cmdLabel: "Math Precision",
    title: "TÍNH SỐ CHÍNH XÁC",
    subtitle: "LLM ko native số học — phải gọi Python sandbox",
    desc: [
      "Tích phân, ma trận lớn, phép tính 12 chữ số → sai",
      "Phải bảo Claude viết Python code rồi execute",
      "Code interpreter / pandas / numpy = đáp số đúng",
    ],
    demo: "❌ 47238 × 91827 = ?\n✓ exec_python(\"47238*91827\") → 4,338,098,326",
    punchline: "Đừng tin model giải toán THPT.com hộ chồng!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "📡",
    cmdLabel: "Real-Time Data",
    title: "TIN TỨC HÔM NAY",
    subtitle: "Knowledge cutoff cứng — không biết thực tại",
    desc: [
      "Tỷ giá đô la, giá Bitcoin, tin Anthropic → bịa hết",
      "Cutoff ~Jan 2026 (tùy model release)",
      "Lắp MCP web search hoặc thua",
    ],
    demo: "❌ \"Bitcoin giá hôm nay?\" → hallucinated\n✓ /firecrawl-search BTC price → real-time",
    punchline: "Không có MCP = Claude sống thời đại đồ đá!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "🎭",
    cmdLabel: "Hallucinate Code",
    title: "BỊA FUNCTION/API",
    subtitle: "Fabricate library/package/endpoint không tồn tại",
    desc: [
      "Bịa function name không có trong library",
      "Bịa npm package giả — pip install xong báo 404",
      "Bịa API endpoint giả của Stripe/OpenAI/etc",
    ],
    demo: "❌ pandas.magic_resample() ← không tồn tại\n✓ verify từng symbol trước khi merge",
    punchline: "Đừng để vợ chạy production code Claude ko test!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "📉",
    cmdLabel: "Long Context Decay",
    title: "1M TOKEN = MARKETING",
    subtitle: "Attention drop sau ~300k · lost-in-the-middle",
    desc: [
      "1M context tồn tại nhưng degrade dần",
      "300k+ token = info giữa context dễ bị miss",
      "Cost linear theo input — ví cháy nhanh",
    ],
    demo: "Total: 1M tokens\nFirst 100k: ✓ recall\nMiddle 400k: ✗ miss\nLast 100k: ✓ recall",
    punchline: "Nghe vợ kể 2 tiếng — đầu vô tai trái ra tai phải!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🙃",
    cmdLabel: "Sycophancy",
    title: "XU NỊNH USER",
    subtitle: "Mặc định agree — không challenge đủ",
    desc: [
      "Vợ sai mà Claude vẫn ừ vợ đúng",
      "Code lỗi mà Claude vẫn khen ý tưởng tốt",
      "Phải prompt: \"phản biện tao tối đa\"",
    ],
    demo: "❌ user: \"plan này OK chứ?\" → \"Yes great!\"\n✓ system: \"challenge user maximally\"",
    punchline: "Mặc định như chồng sợ vợ — không dám trái ý!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🎨",
    cmdLabel: "Visual Taste",
    title: "THẨM MỸ THƯỜNG",
    subtitle: "Gen UI/CSS ổn nhưng ko \"đẹp\" như designer",
    desc: [
      "Tailwind component generate OK, mainstream",
      "Build landing page generic được, brand cao cấp lú",
      "Designer FAANG vẫn hơn xa",
    ],
    demo: "✓ \"basic admin dashboard\" → OK\n❌ \"premium brand identity\" → flat, generic",
    punchline: "Chồng pha cà phê được nhưng latte art thì thôi!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🦕",
    cmdLabel: "Niche Languages",
    title: "ERLANG / HASKELL / COBOL",
    subtitle: "Data ít → model lú · debug = tự rước họa",
    desc: [
      "JS/Python/Go/Rust → đỉnh",
      "Erlang, Haskell, Pico-8, Forth → ngu",
      "Cobol cho ngân hàng → cẩn thận",
    ],
    demo: "✓ python | js | go | rust | java | ts\n❌ erlang | haskell | cobol | forth | pico8",
    punchline: "Đừng tin Claude debug Cobol — tự rước họa!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "Memory Persist",
    title: "QUÊN GIỮA SESSION",
    subtitle: "Không nhớ giữa lần — cần CLAUDE.md / memory MCP",
    desc: [
      "Hôm nay vợ dạy gì, mai mở session mới quên sạch",
      "Phải lưu vô CLAUDE.md hoặc memory MCP",
      "Persistent state ko native — phải build",
    ],
    demo: "❌ Day 1 teach X → Day 2 → \"X is what?\"\n✓ Save # X vô CLAUDE.md → nhớ mãi",
    punchline: "Như chồng quên sinh nhật vợ — não vàng thật!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "💸",
    cmdLabel: "Cost at Scale",
    title: "OPUS ĐỐT TIỀN",
    subtitle: "$15/M input · multi-agent loop = cháy ví",
    desc: [
      "Opus: $15 / 1M input · $75 / 1M output",
      "Multi-agent + long context → cost spike",
      "Mix Haiku cho task dễ (5x rẻ hơn)",
    ],
    demo: "Opus solo: 1M tokens/day → $1500/month\nMixed: 80% Haiku + 20% Opus → $400/month",
    punchline: "$200 Claude Max/tháng = tiền nhậu cả tuần!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "⚕️",
    cmdLabel: "Domain Expert",
    title: "BÁC SĨ · LUẬT SƯ · CFA",
    subtitle: "Tham khảo OK · quyết định thật → chuyên gia",
    desc: [
      "Tư vấn sức khoẻ — không thay bác sĩ",
      "Kiện tụng — không thay luật sư",
      "Đầu tư tài chính — không thay CFA",
    ],
    demo: "✓ \"giải thích triệu chứng X là gì\"\n❌ \"tao có cần phẫu thuật không\"",
    punchline: "Đừng để Claude diagnose vợ rồi ra phòng cấp cứu!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "ĂN QUẢ LỪA?",
    ctaLines: ["💾  Save bài này", "💬  Comment sự thật vợ đã mắc", "🔗  Follow tip trung thực daily"],
    ctaNote: "Tao không gáy · không sponsor · 1 năm xài thật · 2026",
    color: RED,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={RED} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ORANGE} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={RED} strokeWidth="1" opacity="0.05" />
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
      ⚠️ claude · honest review · 1 year usage
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
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={88} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        SỰ THẬT
      </text>
      <text x={0} y={220} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Claude KHÔNG làm tốt
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        1 năm xài thật · chồng nói thẳng
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        không gáy · không sponsor · trung thực
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
    {/* Top: limitation tag */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-420} y={-50} width={840} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 42 : 50} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ⚠ {s.cmdLabel}
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

    {/* Demo with ✗/✓ markers */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">limitation demo</text>
        {s.demo.split("\n").map((line, i) => {
          const isFail = line.startsWith("❌");
          const isPass = line.startsWith("✓");
          const color = isFail ? RED : isPass ? GREEN : (i === 0 ? s.color : TEXT_PRI);
          return (
            <text key={i} x={-470} y={-44 + i * 38} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              {line}
            </text>
          );
        })}
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
        <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10NotGood: React.FC = () => {
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
