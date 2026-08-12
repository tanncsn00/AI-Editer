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
const JADE = "#3FD68A";
const VIOLET = "#9D5BFF";
const DRAGON_RED = "#FF4747";
const COSMIC = "#6B8DFF";

// Era brand colors
const STANFORD_RED = "#8C1515";
const LOOPT_GREY = "#7A8694";
const YC_ORANGE = "#FF6600";
const OPENAI_COLOR = "#10A37F";
const CHATGPT_GREEN = "#1FAE6F";
const MICROSOFT_BLUE = "#0078D4";
const ANTHROPIC_COLOR = "#D97757";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="sabg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={VIOLET} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sabg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sabg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="sagrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="samaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="sagm"><rect width={W} height={H} fill="url(#samaskg)" /></mask>
      <filter id="sagoldglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#sagrid)" mask="url(#sagm)" />
    <rect width={W} height={H} fill="url(#sabg1)" />
    <rect width={W} height={H} fill="url(#sabg2)" />
    <rect width={W} height={H} fill="url(#sabg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · sam altman · 2026
    </text>
  </g>
);

const Avatar: React.FC<{ letter: string; color: string; size: number }> = ({ letter, color, size }) => (
  <g>
    <circle cx={0} cy={0} r={size} fill={color} />
    <text x={0} y={size * 0.35} fontSize={size * 1.1} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
      {letter}
    </text>
  </g>
);

const SceneHeader: React.FC<{ year: string; title: string; color: string }> = ({ year, title, color }) => (
  <g transform={`translate(${W / 2}, 140)`}>
    <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
    <g transform={`translate(-410, 0)`}>
      <rect x={-70} y={-40} width={140} height={80} rx={16} fill={color} />
      <text x={0} y={12} fontSize={28} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        {year}
      </text>
    </g>
    <text x={-280} y={14} fontSize={(title || "").length > 24 ? 26 : 32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
      {title}
    </text>
  </g>
);

// ============ SLIDE 1: HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-380} y={-46} width={760} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Giáo chủ bị phế rồi đăng cơ
      </text>
    </g>

    <g transform={`translate(${W / 2}, 560)`}>
      <circle cx={0} cy={0} r={130} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={4} filter="url(#sagoldglow)" />
      <text x={0} y={42} fontSize={140} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        S
      </text>
    </g>

    <g transform={`translate(${W / 2}, 760)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        SAM ALTMAN
      </text>
    </g>

    {/* Story arc */}
    <g transform={`translate(${W / 2}, 980)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <text x={0} y={-40} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        20 năm trước — bỏ học Stanford
      </text>
      <text x={0} y={4} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Hôm nay — đế chế AI 300 tỷ đô
      </text>
      <text x={0} y={48} fontSize={24} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⚠️ Bị phế 1 lần · quay lại mạnh hơn
      </text>
    </g>

    {/* Stanford → OpenAI */}
    <g transform={`translate(${W / 2}, 1240)`}>
      <g transform={`translate(-220, 0)`}>
        <rect x={-130} y={-50} width={260} height={100} rx={20} fill={BG_SURFACE} stroke={STANFORD_RED} strokeWidth={3} />
        <text x={0} y={-6} fontSize={20} fill={STANFORD_RED} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Stanford</text>
        <text x={0} y={26} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>2005 bỏ học</text>
      </g>
      <g transform={`translate(0, 0)`}>
        <text x={0} y={12} fontSize={48} fill={GOLD} textAnchor="middle" fontWeight={900}>→</text>
      </g>
      <g transform={`translate(220, 0)`}>
        <rect x={-130} y={-50} width={260} height={100} rx={20} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
        <text x={0} y={-6} fontSize={20} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>OpenAI</text>
        <text x={0} y={26} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>$300B đế chế</text>
      </g>
    </g>

    {/* Big question */}
    <g transform={`translate(${W / 2}, 1490)`}>
      <text x={0} y={0} fontSize={64} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#sagoldglow)" letterSpacing="2">
        KẺ ĐỘC TÀI?
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1620)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Truyền kỳ 20 năm phá quan
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: 2005 STANFORD DROPOUT ============
const Slide2NienThieu: React.FC = () => (
  <g>
    <SceneHeader year="2005" title="STANFORD DROPOUT" color={STANFORD_RED} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        AI khi ấy chỉ là khoa học viễn tưởng
      </text>
    </g>

    {/* Sam avatar 19 */}
    <g transform={`translate(${W / 2}, 530)`}>
      <circle cx={0} cy={0} r={100} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={4} />
      <text x={0} y={32} fontSize={110} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        S
      </text>
      <g transform={`translate(0, 150)`}>
        <rect x={-90} y={-30} width={180} height={60} rx={30} fill={STANFORD_RED} />
        <text x={0} y={12} fontSize={26} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          19 TUỔI
        </text>
      </g>
    </g>

    {/* Action */}
    <g transform={`translate(${W / 2}, 870)`}>
      <text x={0} y={0} fontSize={34} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ❌ Bỏ học Stanford giữa năm 2
      </text>
      <text x={0} y={50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Cùng đồng môn lập startup
      </text>
    </g>

    {/* Loopt card */}
    <g transform={`translate(${W / 2}, 1130)`}>
      <rect x={-490} y={-140} width={980} height={280} rx={20} fill={BG_SURFACE} stroke={LOOPT_GREY} strokeWidth={3} />
      <text x={0} y={-90} fontSize={32} fill={LOOPT_GREY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        📱 LOOPT
      </text>
      <text x={0} y={-50} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Ứng dụng location đời đầu
      </text>
      {/* 3 stat cards */}
      <g transform={`translate(-280, 30)`}>
        <rect x={-110} y={-40} width={220} height={80} rx={12} fill={BG_DEEP} stroke={BORDER} strokeWidth={2} />
        <text x={0} y={-8} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>tu hành</text>
        <text x={0} y={26} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>7 năm</text>
      </g>
      <g transform={`translate(0, 30)`}>
        <rect x={-110} y={-40} width={220} height={80} rx={12} fill={BG_DEEP} stroke={BORDER} strokeWidth={2} />
        <text x={0} y={-8} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>gọi vốn</text>
        <text x={0} y={26} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>$30M</text>
      </g>
      <g transform={`translate(280, 30)`}>
        <rect x={-110} y={-40} width={220} height={80} rx={12} fill={BG_DEEP} stroke={BORDER} strokeWidth={2} />
        <text x={0} y={-8} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>exit</text>
        <text x={0} y={26} fontSize={26} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>$43M</text>
      </g>
      <text x={0} y={110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        bán cho Green Dot · 2012
      </text>
    </g>

    {/* Realization */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Giới tu chân Silicon Valley bắt đầu nhớ tên
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: 2014 Y COMBINATOR ============
const Slide3YC: React.FC = () => (
  <g>
    <SceneHeader year="2014" title="Y COMBINATOR · 28 TUỔI" color={YC_ORANGE} />

    {/* Truyền y bát */}
    <g transform={`translate(${W / 2}, 360)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Paul Graham truyền y bát
      </text>
      <text x={0} y={42} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        — Tổ sư lò luyện startup lớn nhất thế giới
      </text>
    </g>

    {/* Handover */}
    <g transform={`translate(${W / 2}, 560)`}>
      <g transform={`translate(-240, 0)`}>
        <Avatar letter="P" color="#000000" size={70} />
        <text x={0} y={110} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Paul Graham</text>
        <text x={0} y={138} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>tổ sư YC</text>
      </g>
      <text x={0} y={20} fontSize={64} fill={YC_ORANGE} textAnchor="middle" fontWeight={900}>→</text>
      <g transform={`translate(240, 0)`}>
        <Avatar letter="S" color={GOLD} size={70} />
        <text x={0} y={110} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Sam Altman</text>
        <text x={0} y={138} fontSize={16} fill={YC_ORANGE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>chủ tịch 28 tuổi</text>
      </g>
    </g>

    {/* Underlings */}
    <g transform={`translate(${W / 2}, 900)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={YC_ORANGE} strokeWidth={3} />
      <text x={0} y={-80} fontSize={26} fill={YC_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🏯 ĐỆ TỬ DƯỚI TRƯỚNG
      </text>
      {/* 4 logos */}
      {[
        { x: -340, name: "Airbnb", c: "#FF5A5F" },
        { x: -110, name: "Stripe", c: "#635BFF" },
        { x: 110, name: "Reddit", c: "#FF4500" },
        { x: 340, name: "Dropbox", c: "#0061FF" },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, 30)`}>
          <rect x={-95} y={-38} width={190} height={76} rx={12} fill={BG_DEEP} stroke={b.c} strokeWidth={2} />
          <text x={0} y={10} fontSize={22} fill={b.c} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>{b.name}</text>
        </g>
      ))}
      <text x={0} y={100} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        + hàng nghìn startup khác
      </text>
    </g>

    {/* Insight */}
    <g transform={`translate(${W / 2}, 1320)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-50} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💡 TIÊN GIỚI NHẬN RA
      </text>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Sam không phải founder
      </text>
      <text x={0} y={50} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        Hắn là kẻ CHỌN founder
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ⏳ 2014 - 2019 · 5 năm chưởng môn YC
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: 2015 KHAI SƠN OPENAI ============
const Slide4Khaison: React.FC = () => (
  <g>
    <SceneHeader year="2015" title="KHAI SƠN OPENAI" color={OPENAI_COLOR} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        11 vị kỳ tài tụ họp Silicon Valley
      </text>
    </g>

    {/* 4 founder avatars */}
    <g transform={`translate(${W / 2}, 540)`}>
      {[
        { x: -380, letter: "S", name: "Sam Altman", role: "Kinh tài", color: GOLD },
        { x: -130, letter: "E", name: "Elon Musk", role: "Hộ pháp", color: "#000000" },
        { x: 130, letter: "I", name: "Ilya Sutskever", role: "Đại đệ tử", color: VIOLET },
        { x: 380, letter: "G", name: "Greg Brockman", role: "Chấp pháp", color: OPENAI_COLOR },
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

    {/* Manifesto */}
    <g transform={`translate(${W / 2}, 880)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
      <text x={0} y={-50} fontSize={24} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📜 TUYÊN NGÔN
      </text>
      <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "AGI vì lợi ích toàn nhân loại"
      </text>
      <text x={0} y={50} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        non-profit · open research · không vì tiền
      </text>
    </g>

    {/* Funding + enemy */}
    <g transform={`translate(${W / 2}, 1220)`}>
      <g transform={`translate(-240, 0)`}>
        <rect x={-180} y={-70} width={360} height={140} rx={16} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
        <text x={0} y={-30} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💰 CAM KẾT</text>
        <text x={0} y={20} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>$1 tỷ</text>
      </g>
      <g transform={`translate(240, 0)`}>
        <rect x={-180} y={-70} width={360} height={140} rx={16} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
        <text x={0} y={-30} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🎯 ĐỐI THỦ</text>
        <text x={0} y={20} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Google</text>
      </g>
    </g>

    <g transform={`translate(${W / 2}, 1490)`}>
      <text x={0} y={0} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Không ai tin non-profit thắng được tập đoàn nghìn tỷ
      </text>
      <text x={0} y={40} fontSize={28} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        Trừ Sam.
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: 30/11/2022 CHATGPT ============
const Slide5ChatGPT: React.FC = () => (
  <g>
    <SceneHeader year="11/22" title="CHATGPT XUẤT THẾ" color={CHATGPT_GREEN} />

    {/* Date drop */}
    <g transform={`translate(${W / 2}, 320)`}>
      <rect x={-360} y={-50} width={720} height={100} rx={20} fill={BG_SURFACE} stroke={CHATGPT_GREEN} strokeWidth={3} />
      <text x={0} y={12} fontSize={32} fill={CHATGPT_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ 30/11/2022 · âm thầm
      </text>
    </g>

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 510)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">💬</text>
    </g>

    {/* Growth stats */}
    <g transform={`translate(${W / 2}, 780)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={CHATGPT_GREEN} strokeWidth={3} />
      <text x={0} y={-65} fontSize={24} fill={CHATGPT_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🔥 TĂNG TRƯỞNG NHANH NHẤT LỊCH SỬ INTERNET
      </text>
      {/* 2 stat cards */}
      <g transform={`translate(-200, 50)`}>
        <rect x={-160} y={-40} width={320} height={80} rx={12} fill={BG_DEEP} stroke={JADE} strokeWidth={2} />
        <text x={-130} y={10} fontSize={28} fill={JADE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>5 ngày</text>
        <text x={20} y={4} fontSize={20} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>→ 1 triệu user</text>
      </g>
      <g transform={`translate(200, 50)`}>
        <rect x={-160} y={-40} width={320} height={80} rx={12} fill={BG_DEEP} stroke={DRAGON_RED} strokeWidth={2} />
        <text x={-130} y={10} fontSize={28} fill={DRAGON_RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>2 tháng</text>
        <text x={20} y={4} fontSize={20} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>→ 100 triệu</text>
      </g>
    </g>

    {/* Sam transformation */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={-110} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Sam Altman trong 60 ngày:
      </text>
      <g transform={`translate(-240, 0)`}>
        <rect x={-180} y={-60} width={360} height={120} rx={16} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={2} />
        <text x={0} y={-15} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>TRƯỚC</text>
        <text x={0} y={25} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>nhà đầu tư</text>
      </g>
      <text x={0} y={10} fontSize={48} fill={GOLD} textAnchor="middle">→</text>
      <g transform={`translate(240, 0)`}>
        <rect x={-180} y={-60} width={360} height={120} rx={16} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
        <text x={0} y={-15} fontSize={20} fill={GOLD} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>SAU</text>
        <text x={0} y={25} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>gương mặt AI toàn cầu</text>
      </g>
    </g>

    {/* Realm */}
    <g transform={`translate(${W / 2}, 1520)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#sagoldglow)">
        ⚡ Tiên giới gọi là PHÁ QUAN KỲ
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: 17/11/2023 BINH BIẾN ============
const Slide6BinhBien: React.FC = () => (
  <g>
    <SceneHeader year="11/23" title="BINH BIẾN · 5 NGÀY" color={DRAGON_RED} />

    {/* Date */}
    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={32} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚔️ 17/11/2023 · giữa trưa
      </text>
    </g>

    {/* Coup attack */}
    <g transform={`translate(${W / 2}, 500)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={4} filter="url(#sagoldglow)" />
      <text x={0} y={-60} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        4 TRƯỞNG LÃO PHÁN QUYẾT
      </text>
      <text x={0} y={0} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        SAM ALTMAN BỊ PHẾ TRUẤT
      </text>
      <text x={0} y={50} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Không thành thật trong giao tiếp"
      </text>
    </g>

    {/* Knife holder */}
    <g transform={`translate(${W / 2}, 830)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={VIOLET} strokeWidth={3} />
      <g transform={`translate(-400, 0)`}>
        <Avatar letter="I" color={VIOLET} size={55} />
      </g>
      <text x={-330} y={-30} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
        Ilya Sutskever
      </text>
      <text x={-330} y={0} fontSize={18} fill={TEXT_SEC} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Đại đệ tử chân truyền
      </text>
      <text x={-330} y={30} fontSize={20} fill={DRAGON_RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        🗡️ Người cầm dao đầu tiên
      </text>
      <text x={-330} y={60} fontSize={16} fill={TEXT_MUTE} fontStyle="italic" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Lý do: lo Sam đẩy AI quá nhanh
      </text>
    </g>

    {/* 770 loyalty */}
    <g transform={`translate(${W / 2}, 1160)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={-340} y={-30} fontSize={72} fill={GOLD} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>770</text>
      <text x={-340} y={20} fontSize={20} fill={TEXT_SEC} fontFamily="'Inter', sans-serif" fontWeight={600}>/ 800 đệ tử</text>
      <text x={80} y={-20} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
        ký thư đe doạ ly khai
      </text>
      <text x={80} y={20} fontSize={22} fill={MICROSOFT_BLUE} fontFamily="'Inter', sans-serif" fontWeight={700}>
        Microsoft dang tay đón Sam
      </text>
      <text x={80} y={50} fontSize={18} fill={TEXT_MUTE} fontStyle="italic" fontFamily="'Inter', sans-serif" fontWeight={500}>
        cả môn phái treo trên sợi tóc
      </text>
    </g>

    {/* Return */}
    <g transform={`translate(${W / 2}, 1490)`}>
      <text x={0} y={0} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ 5 NGÀY SAU · Sam đăng cơ trở lại
      </text>
      <text x={0} y={40} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Trưởng lão hội cũ bị thay máu toàn bộ
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: 2024-26 HỒI SƠN ============
const Slide7HoiSon: React.FC = () => (
  <g>
    <SceneHeader year="26" title="ĐẾ CHẾ $300 TỶ ĐÔ" color={GOLD} />

    {/* Stronger comeback */}
    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Sau binh biến · MẠNH HƠN bao giờ hết
      </text>
    </g>

    {/* Product wave */}
    <g transform={`translate(${W / 2}, 530)`}>
      <text x={0} y={-60} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        🔥 Sản phẩm liên tục xuất thế:
      </text>
      {[
        { x: -360, name: "GPT-4o", c: CHATGPT_GREEN },
        { x: -120, name: "o1", c: VIOLET },
        { x: 120, name: "o3", c: COSMIC },
        { x: 360, name: "Sora", c: DRAGON_RED },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x}, 0)`}>
          <rect x={-95} y={-40} width={190} height={80} rx={12} fill={BG_SURFACE} stroke={p.c} strokeWidth={3} />
          <text x={0} y={12} fontSize={26} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{p.name}</text>
        </g>
      ))}
    </g>

    {/* Valuation */}
    <g transform={`translate(${W / 2}, 770)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} filter="url(#sagoldglow)" />
      <text x={0} y={-55} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💰 OPENAI ĐỊNH GIÁ
      </text>
      <text x={0} y={20} fontSize={92} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        $300 TỶ
      </text>
      <text x={0} y={70} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        AI startup giá trị nhất hành tinh
      </text>
    </g>

    {/* Defectors */}
    <g transform={`translate(${W / 2}, 1130)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <text x={0} y={-85} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🏃 KẺ CHỐNG SAM · LY KHAI HẾT
      </text>
      {[
        { y: -35, n: "Ilya Sutskever", to: "→ Safe Superintelligence", c: VIOLET },
        { y: 15, n: "Mira Murati", to: "→ Thinking Machines", c: ANTHROPIC_COLOR },
        { y: 65, n: "Karpathy", to: "→ Anthropic", c: ANTHROPIC_COLOR },
      ].map((r, i) => (
        <g key={i} transform={`translate(-440, ${r.y})`}>
          <Avatar letter={r.n[0]} color={r.c} size={20} />
          <text x={40} y={6} fontSize={20} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
            {r.n}
          </text>
          <text x={240} y={6} fontSize={18} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
            {r.to}
          </text>
        </g>
      ))}
    </g>

    {/* Final */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        Chỉ Sam vẫn ngồi vững trên ngôi giáo chủ
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: ENDING CTA ============
const Slide8CTA: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 240)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Kẻ KIẾN TẠO của thời đại?
      </text>
      <text x={0} y={70} fontSize={42} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Hay kẻ ĐỘC TÀI may mắn?
      </text>
    </g>

    {/* Timeline summary */}
    <g transform={`translate(${W / 2}, 600)`}>
      <rect x={-490} y={-200} width={980} height={400} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-160} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🏯 20 NĂM PHÁ QUAN
      </text>
      {[
        { y: -100, year: "2005", t: "Bỏ học Stanford · Loopt", c: STANFORD_RED },
        { y: -56, year: "2014", t: "Chủ tịch Y Combinator", c: YC_ORANGE },
        { y: -12, year: "2015", t: "Khai sơn OpenAI", c: OPENAI_COLOR },
        { y: 32, year: "2022", t: "ChatGPT phá quan", c: CHATGPT_GREEN },
        { y: 76, year: "2023", t: "Bị phế · đăng cơ trở lại", c: DRAGON_RED },
        { y: 120, year: "2026", t: "$300 tỷ đô · giáo chủ AI", c: GOLD },
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
    <g transform={`translate(${W / 2}, 1180)`}>
      {[
        "💬  Comment đạo hữu nghĩ sao",
        "💾  Save · xem lại truyền kỳ",
        "🔗  Follow · truyền kỳ giới AI hằng tuần",
      ].map((ln, i) => (
        <g key={i} transform={`translate(0, ${i * 100})`}>
          <rect x={-440} y={-40} width={880} height={80} rx={18} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
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

export const SlideCarouselSamAltmanStory: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2NienThieu />}
        {slideNum === 3 && <Slide3YC />}
        {slideNum === 4 && <Slide4Khaison />}
        {slideNum === 5 && <Slide5ChatGPT />}
        {slideNum === 6 && <Slide6BinhBien />}
        {slideNum === 7 && <Slide7HoiSon />}
        {slideNum === 8 && <Slide8CTA />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
