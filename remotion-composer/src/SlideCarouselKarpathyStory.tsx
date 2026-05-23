import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

// Tu tiên theme
const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const BG_ELEVATED = "#1E1830";
const BORDER = "#3A2F50";
const TEXT_PRI = "#F5EDD8";
const TEXT_SEC = "#A89BC0";
const TEXT_MUTE = "#5A4F70";

const GOLD = "#F4C04A";
const GOLD_DARK = "#B8862E";
const JADE = "#3FD68A";
const CRIMSON = "#E85655";
const VIOLET = "#9D5BFF";
const COSMIC = "#6B8DFF";
const DRAGON_RED = "#FF4747";

// Brand colors
const OPENAI_COLOR = "#10A37F";
const ANTHROPIC_COLOR = "#D97757";
const TESLA_COLOR = "#CC0000";
const YOUTUBE_RED = "#FF0000";
const EUREKA_COLOR = "#FFB300";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="kpbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={VIOLET} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kpbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kpbg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="kpgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="kpmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="kpgm"><rect width={W} height={H} fill="url(#kpmaskg)" /></mask>
      <filter id="kpgoldglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#kpgrid)" mask="url(#kpgm)" />
    <rect width={W} height={H} fill="url(#kpbg1)" />
    <rect width={W} height={H} fill="url(#kpbg2)" />
    <rect width={W} height={H} fill="url(#kpbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · karpathy · 2026
    </text>
  </g>
);

// Avatar with first letter
const Avatar: React.FC<{ letter: string; color: string; size: number }> = ({ letter, color, size }) => (
  <g>
    <circle cx={0} cy={0} r={size} fill={color} />
    <text x={0} y={size * 0.35} fontSize={size * 1.1} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
      {letter}
    </text>
  </g>
);

// Section header with year + scene
const SceneHeader: React.FC<{ year: string; title: string; color: string }> = ({ year, title, color }) => (
  <g transform={`translate(${W / 2}, 140)`}>
    <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
    <g transform={`translate(-410, 0)`}>
      <rect x={-70} y={-40} width={140} height={80} rx={16} fill={color} />
      <text x={0} y={12} fontSize={32} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        {year}
      </text>
    </g>
    <text x={-280} y={14} fontSize={(title || "").length > 22 ? 28 : 36} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
      {title}
    </text>
  </g>
);

// ============ SLIDE 1: HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    {/* Top tag */}
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-380} y={-46} width={760} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    {/* Big shock title */}
    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={48} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Cả thiên hạ chấn động
      </text>
    </g>

    {/* Avatar Karpathy */}
    <g transform={`translate(${W / 2}, 560)`}>
      <circle cx={0} cy={0} r={130} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={4} filter="url(#kpgoldglow)" />
      <text x={0} y={42} fontSize={140} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        K
      </text>
    </g>

    <g transform={`translate(${W / 2}, 760)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        ANDREJ KARPATHY
      </text>
    </g>

    {/* Story arrow flow */}
    <g transform={`translate(${W / 2}, 960)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <text x={0} y={-10} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        1 trong 11 sáng lập OpenAI
      </text>
      <text x={0} y={30} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⚠️ vừa quy thuận Anthropic
      </text>
    </g>

    {/* Brand vs */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <g transform={`translate(-220, 0)`}>
        <rect x={-130} y={-50} width={260} height={100} rx={20} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
        <text x={0} y={-6} fontSize={20} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>OpenAI</text>
        <text x={0} y={26} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>2015 khai sơn</text>
      </g>
      <g transform={`translate(0, 0)`}>
        <text x={0} y={12} fontSize={48} fill={GOLD} textAnchor="middle" fontWeight={900}>→</text>
      </g>
      <g transform={`translate(220, 0)`}>
        <rect x={-130} y={-50} width={260} height={100} rx={20} fill={BG_SURFACE} stroke={ANTHROPIC_COLOR} strokeWidth={3} />
        <text x={0} y={-6} fontSize={20} fill={ANTHROPIC_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Anthropic</text>
        <text x={0} y={26} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>2026 quy thuận</text>
      </g>
    </g>

    {/* Big question */}
    <g transform={`translate(${W / 2}, 1450)`}>
      <text x={0} y={0} fontSize={68} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#kpgoldglow)" letterSpacing="2">
        KẺ PHẢN MÔN?
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1620)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Truyền kỳ 11 năm phá quan
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: 2015 KHAI SƠN ============
const Slide2Khaison: React.FC = () => (
  <g>
    <SceneHeader year="2015" title="KHAI SƠN OPENAI" color={OPENAI_COLOR} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        AI vẫn là tà thuật trong mắt thế nhân
      </text>
    </g>

    {/* 4 founder avatars */}
    <g transform={`translate(${W / 2}, 580)`}>
      {[
        { x: -380, letter: "S", name: "Sam Altman", role: "Kinh tài", color: "#000000" },
        { x: -130, letter: "I", name: "Ilya Sutskever", role: "Đại sư huynh", color: VIOLET },
        { x: 130, letter: "E", name: "Elon Musk", role: "Hộ pháp", color: TESLA_COLOR },
        { x: 380, letter: "K", name: "Karpathy", role: "28 tuổi", color: GOLD },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x}, 0)`}>
          <Avatar letter={p.letter} color={p.color} size={70} />
          <text x={0} y={110} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            {p.name}
          </text>
          <text x={0} y={140} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            {p.role}
          </text>
        </g>
      ))}
    </g>

    {/* Sub label */}
    <g transform={`translate(${W / 2}, 880)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        11 vị kỳ tài tụ họp Silicon Valley
      </text>
    </g>

    {/* Karpathy spotlight */}
    <g transform={`translate(${W / 2}, 1100)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-80} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎯 KARPATHY · 28 TUỔI
      </text>
      <text x={0} y={-30} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Đệ tử trực hệ Geoffrey Hinton
      </text>
      <text x={0} y={10} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Tổ sư đại đạo neural network
      </text>
      <text x={0} y={70} fontSize={22} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        "Thiên tài nhìn thấy tương lai của AI"
      </text>
    </g>

    {/* Timeline marker */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <rect x={-440} y={-50} width={880} height={100} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
      <text x={-400} y={12} fontSize={32}>📜</text>
      <text x={-340} y={16} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        2015 · Year 0 · OpenAI khai sơn lập phái
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: 2017 TRANSFORMER ============
const Slide3Transformer: React.FC = () => (
  <g>
    <SceneHeader year="2017" title="TRANSFORMER XUẤT THẾ" color={VIOLET} />

    {/* The famous paper */}
    <g transform={`translate(${W / 2}, 460)`}>
      <rect x={-380} y={-140} width={760} height={280} rx={20} fill={BG_SURFACE} stroke={VIOLET} strokeWidth={4} filter="url(#kpgoldglow)" />
      <text x={0} y={-80} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        📜 BÍ KÍP NĂM 2017
      </text>
      <text x={0} y={-30} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Attention Is All
      </text>
      <text x={0} y={20} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        You Need"
      </text>
      <text x={0} y={80} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        — 8 nhà sư Google ·  Vaswani et al.
      </text>
    </g>

    {/* Earthquake */}
    <g transform={`translate(${W / 2}, 820)`}>
      <text x={0} y={0} fontSize={42} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ TRANSFORMER XUẤT THẾ ⚡
      </text>
      <text x={0} y={50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Giang hồ đổi triều đại sau 1 đêm
      </text>
    </g>

    {/* Karpathy + Ilya bế quan */}
    <g transform={`translate(${W / 2}, 1100)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <g transform={`translate(-340, 0)`}>
        <Avatar letter="K" color={GOLD} size={50} />
        <text x={0} y={-78} fontSize={18} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Karpathy</text>
      </g>
      <text x={-220} y={10} fontSize={32} fill={JADE} textAnchor="middle">+</text>
      <g transform={`translate(-100, 0)`}>
        <Avatar letter="I" color={VIOLET} size={50} />
        <text x={0} y={-78} fontSize={18} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Ilya</text>
      </g>
      <text x={40} y={10} fontSize={32} fill={GOLD} textAnchor="middle">→</text>
      <g transform={`translate(220, 0)`}>
        <rect x={-100} y={-50} width={200} height={100} rx={16} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={2} />
        <text x={0} y={4} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>GPT-1</text>
        <text x={0} y={36} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>thành hình</text>
      </g>
    </g>

    {/* Closing */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Không ai biết — thứ họ tạo ra
      </text>
      <text x={0} y={36} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        sẽ thay đổi cả thế giới
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: TESLA ============
const Slide4Tesla: React.FC = () => (
  <g>
    <SceneHeader year="2017" title="TESLA · 5 NĂM LUYỆN KIẾM" color={TESLA_COLOR} />

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">🚗</text>
    </g>

    {/* Status: Karpathy moves */}
    <g transform={`translate(${W / 2}, 580)`}>
      <Avatar letter="K" color={GOLD} size={50} />
      <text x={140} y={10} fontSize={48} fill={GOLD} textAnchor="middle">→</text>
      <g transform={`translate(280, 0)`}>
        <rect x={-100} y={-50} width={200} height={100} rx={16} fill={BG_ELEVATED} stroke={TESLA_COLOR} strokeWidth={3} />
        <text x={0} y={4} fontSize={28} fill={TESLA_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>TESLA</text>
        <text x={0} y={36} fontSize={14} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>Director AI</text>
      </g>
    </g>

    {/* Mission */}
    <g transform={`translate(${W / 2}, 820)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={TESLA_COLOR} strokeWidth={3} />
      <text x={0} y={-30} fontSize={24} fill={TESLA_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎯 NHIỆM VỤ
      </text>
      <text x={0} y={14} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Dạy xe TỰ NHÌN thế giới
      </text>
      <text x={0} y={50} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Vision system + Autopilot · 5 năm
      </text>
    </g>

    {/* Compare */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={-150} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Khó hơn chat bot gấp 100 lần
      </text>
      <g transform={`translate(-220, 0)`}>
        <rect x={-180} y={-70} width={360} height={140} rx={16} fill={BG_SURFACE} stroke={VIOLET} strokeWidth={3} />
        <text x={0} y={-30} fontSize={22} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Một bên</text>
        <text x={0} y={4} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Mô hình</text>
        <text x={0} y={36} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>ngôn ngữ</text>
      </g>
      <g transform={`translate(220, 0)`}>
        <rect x={-180} y={-70} width={360} height={140} rx={16} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
        <text x={0} y={-30} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Một bên</text>
        <text x={0} y={4} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>SINH TỬ</text>
        <text x={0} y={36} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>trên xa lộ</text>
      </g>
    </g>

    {/* Year span */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <rect x={-440} y={-50} width={880} height={100} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
      <text x={-400} y={12} fontSize={32}>⏳</text>
      <text x={-340} y={16} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        2017 - 2022 · 5 năm bế quan tu luyện
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: 2022 ẨN CƯ ============
const Slide5AnCu: React.FC = () => (
  <g>
    <SceneHeader year="2022" title="ẨN CƯ · GIẢNG ĐẠO" color={YOUTUBE_RED} />

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">🧘</text>
    </g>

    {/* "Không" anti-pattern */}
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Không như những kẻ xây đế chế AI khác:
      </text>
      <g transform={`translate(0, 50)`}>
        {["Không startup", "Không gọi vốn", "Không tranh quyền"].map((t, i) => (
          <g key={i} transform={`translate(${(i - 1) * 300}, 0)`}>
            <rect x={-130} y={-40} width={260} height={80} rx={12} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={2} />
            <text x={0} y={10} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              ❌ {t.replace("Không ", "")}
            </text>
          </g>
        ))}
      </g>
    </g>

    {/* YouTube hit */}
    <g transform={`translate(${W / 2}, 920)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={YOUTUBE_RED} strokeWidth={3} />
      <text x={0} y={-50} fontSize={36}>▶️</text>
      <text x={0} y={-2} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        "Let's build GPT from scratch"
      </text>
      <text x={0} y={32} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Video YouTube · giảng đạo cho thế hệ mới
      </text>
      <text x={0} y={64} fontSize={22} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🔥 Hàng triệu lượt xem
      </text>
    </g>

    {/* Realization */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-50} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💡 GIANG HỒ NHẬN RA
      </text>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Karpathy không xây đế chế
      </text>
      <text x={0} y={44} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        Hắn là người truyền đạo
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1560)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ⏳ Tháng 7 năm 2022 · biến mất khỏi Tesla
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: PHỤC MÔN + EUREKA ============
const Slide6Eureka: React.FC = () => (
  <g>
    <SceneHeader year="23-24" title="PHỤC MÔN · LẬP EUREKA" color={EUREKA_COLOR} />

    {/* Timeline 2 events */}
    <g transform={`translate(${W / 2}, 380)`}>
      {/* 2023 return */}
      <g transform={`translate(-250, 0)`}>
        <rect x={-200} y={-100} width={400} height={200} rx={20} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
        <text x={0} y={-50} fontSize={24} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          02/2023
        </text>
        <text x={0} y={0} fontSize={32}>🔙</text>
        <text x={0} y={40} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Quay lại OpenAI
        </text>
        <text x={0} y={70} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          tưởng hồi sơn
        </text>
      </g>

      {/* arrow */}
      <text x={0} y={10} fontSize={42} fill={GOLD} textAnchor="middle">→</text>

      {/* 2024 leave */}
      <g transform={`translate(250, 0)`}>
        <rect x={-200} y={-100} width={400} height={200} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
        <text x={0} y={-50} fontSize={24} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          02/2024
        </text>
        <text x={0} y={0} fontSize={32}>👋</text>
        <text x={0} y={40} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Rời môn lần 2
        </text>
        <text x={0} y={70} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          chỉ sau 1 năm
        </text>
      </g>
    </g>

    {/* Famous quote */}
    <g transform={`translate(${W / 2}, 740)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-32} fontSize={20} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        🎙️ KARPATHY ĐỂ LẠI MỘT CÂU
      </text>
      <text x={0} y={20} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Đã đến lúc lập đạo riêng"
      </text>
      <text x={0} y={56} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        không drama · không đấu tố · không tuyên chiến
      </text>
    </g>

    {/* Eureka Labs */}
    <g transform={`translate(${W / 2}, 1080)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={EUREKA_COLOR} strokeWidth={4} />
      <text x={0} y={-80} fontSize={28} fill={EUREKA_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        🏫 EUREKA LABS
      </text>
      <text x={0} y={-36} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Môn phái giáo dục AI · 07/2024
      </text>
      <rect x={-300} y={20} width={600} height={70} rx={16} fill={BG_DEEP} stroke={EUREKA_COLOR} strokeWidth={2} />
      <text x={0} y={48} fontSize={24} fill={EUREKA_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎯 Mục tiêu: dạy 1 TỶ người học AI
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1540)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        Phục môn rồi lại rời đi · ẩn ý gì?
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: QUY CHÂN ANTHROPIC ============
const Slide7Anthropic: React.FC = () => (
  <g>
    <SceneHeader year="5/26" title="QUY CHÂN ANTHROPIC" color={ANTHROPIC_COLOR} />

    {/* Shock announcement */}
    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={36} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ GIANG HỒ LẠI NỔI PHONG BA
      </text>
    </g>

    {/* Karpathy tweet */}
    <g transform={`translate(${W / 2}, 540)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={ANTHROPIC_COLOR} strokeWidth={4} />
      <g transform={`translate(-430, -80)`}>
        <Avatar letter="K" color={GOLD} size={32} />
      </g>
      <text x={-380} y={-72} fontSize={20} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
        Andrej Karpathy · 5/2026
      </text>
      <text x={0} y={20} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#kpgoldglow)">
        "Tôi gia nhập Anthropic"
      </text>
      <text x={0} y={80} fontSize={22} fill={ANTHROPIC_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        team pre-training
      </text>
    </g>

    {/* Connection diagram */}
    <g transform={`translate(${W / 2}, 950)`}>
      <text x={0} y={-100} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        🔗 Anthropic = cựu đồng môn OpenAI
      </text>
      <g transform={`translate(-300, 0)`}>
        <rect x={-150} y={-50} width={300} height={100} rx={16} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
        <text x={0} y={-8} fontSize={20} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>OpenAI</text>
        <text x={0} y={28} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>"Sư phụ cũ"</text>
      </g>
      <text x={-90} y={10} fontSize={32} fill={GOLD} textAnchor="middle">→</text>
      <g transform={`translate(60, 0)`}>
        <Avatar letter="K" color={GOLD} size={50} />
      </g>
      <text x={150} y={10} fontSize={32} fill={GOLD} textAnchor="middle">→</text>
      <g transform={`translate(300, 0)`}>
        <rect x={-150} y={-50} width={300} height={100} rx={16} fill={BG_SURFACE} stroke={ANTHROPIC_COLOR} strokeWidth={3} />
        <text x={0} y={-8} fontSize={20} fill={ANTHROPIC_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Anthropic</text>
        <text x={0} y={28} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>"Đệ tử cũ"</text>
      </g>
    </g>

    {/* Dario boss */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <g transform={`translate(-420, 0)`}>
        <Avatar letter="D" color={ANTHROPIC_COLOR} size={50} />
      </g>
      <text x={-350} y={-20} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
        Dario Amodei
      </text>
      <text x={-350} y={10} fontSize={18} fill={TEXT_SEC} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Tổ sư Anthropic · cựu đồng môn
      </text>
      <text x={-350} y={42} fontSize={18} fill={DRAGON_RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        ⚠️ Karpathy giờ dưới trướng Dario
      </text>
    </g>

    {/* Big punch */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        11 năm sau khai sơn OpenAI...
      </text>
      <text x={0} y={36} fontSize={28} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        chọn đứng bên ĐỐI THỦ
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: ENDING CTA ============
const Slide8CTA: React.FC = () => (
  <g>
    {/* Question */}
    <g transform={`translate(${W / 2}, 250)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Đây là PHẢN MÔN?
      </text>
      <text x={0} y={70} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Hay con đường riêng?
      </text>
    </g>

    {/* Timeline summary */}
    <g transform={`translate(${W / 2}, 580)`}>
      <rect x={-490} y={-180} width={980} height={360} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-140} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🏯 11 NĂM PHÁ QUAN
      </text>
      {[
        { y: -80, year: "2015", t: "Khai sơn OpenAI", c: OPENAI_COLOR },
        { y: -36, year: "2017", t: "Rời sang Tesla · 5 năm", c: TESLA_COLOR },
        { y: 8, year: "2022", t: "Ẩn cư · YouTube giảng đạo", c: YOUTUBE_RED },
        { y: 52, year: "2023", t: "Quay lại OpenAI · ngắn", c: OPENAI_COLOR },
        { y: 96, year: "2024", t: "Lập Eureka Labs", c: EUREKA_COLOR },
        { y: 140, year: "2026", t: "Quy thuận Anthropic", c: ANTHROPIC_COLOR },
      ].map((r, i) => (
        <g key={i} transform={`translate(-440, ${r.y})`}>
          <rect x={-50} y={-15} width={100} height={30} rx={6} fill={r.c} />
          <text x={0} y={6} fontSize={18} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            {r.year}
          </text>
          <text x={70} y={8} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* CTA buttons */}
    <g transform={`translate(${W / 2}, 1130)`}>
      {[
        "💬  Comment đạo hữu nghĩ sao",
        "💾  Save · xem lại truyền kỳ",
        "🔗  Follow · truyền kỳ giới AI hằng tuần",
      ].map((ln, i) => (
        <g key={i} transform={`translate(0, ${i * 110})`}>
          <rect x={-440} y={-42} width={880} height={84} rx={18} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
          <text x={0} y={12} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            {ln}
          </text>
        </g>
      ))}
    </g>

    <g transform={`translate(${W / 2}, 1620)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ⚡ Truyền kỳ giới AI · series mỗi tuần
      </text>
    </g>
  </g>
);

export const SlideCarouselKarpathyStory: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2Khaison />}
        {slideNum === 3 && <Slide3Transformer />}
        {slideNum === 4 && <Slide4Tesla />}
        {slideNum === 5 && <Slide5AnCu />}
        {slideNum === 6 && <Slide6Eureka />}
        {slideNum === 7 && <Slide7Anthropic />}
        {slideNum === 8 && <Slide8CTA />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
