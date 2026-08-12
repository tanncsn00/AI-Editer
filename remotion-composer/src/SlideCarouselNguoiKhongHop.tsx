import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

// Deep cinematic night palette
const BG_DEEP = "#050818";
const BG_SURFACE = "#0D1124";
const BG_ELEVATED = "#16193A";
const BORDER = "#2A2E55";
const TEXT_PRI = "#E8EEFF";
const TEXT_SEC = "#8B95C0";
const TEXT_MUTE = "#4A5275";

const GOLD = "#F4C04A";
const WARM = "#FFAB52";
const COLD_BLUE = "#4FA8FF";
const DEEP_PURPLE = "#6B5BFF";
const MYSTIC = "#B385FF";
const SOUL_TEAL = "#5BE8C8";
const DRAGON_RED = "#FF5E5E";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG · cinematic night ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="nkbg1" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stopColor={MYSTIC} stopOpacity="0.18" />
        <stop offset="60%" stopColor={DEEP_PURPLE} stopOpacity="0.06" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="nkbg2" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={COLD_BLUE} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="nkbg3" cx="80%" cy="50%" r="40%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.06" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="nkstars" width="120" height="120" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="35" r="0.8" fill={TEXT_PRI} opacity="0.6" />
        <circle cx="78" cy="22" r="0.5" fill={MYSTIC} opacity="0.5" />
        <circle cx="100" cy="80" r="0.6" fill={COLD_BLUE} opacity="0.5" />
        <circle cx="50" cy="95" r="0.4" fill={TEXT_PRI} opacity="0.4" />
        <circle cx="10" cy="100" r="0.5" fill={GOLD} opacity="0.4" />
      </pattern>
      <filter id="nkglow">
        <feGaussianBlur stdDeviation="10" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="nkwarmglow">
        <feGaussianBlur stdDeviation="18" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#nkbg1)" />
    <rect width={W} height={H} fill="url(#nkbg2)" />
    <rect width={W} height={H} fill="url(#nkbg3)" />
    <rect width={W} height={H} fill="url(#nkstars)" opacity="0.6" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">
      ⚡ truyền kỳ giới ai · tu sĩ giữa nhân gian · 2026
    </text>
  </g>
);

// SVG laptop with warm glow
const LaptopGlow: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Glow halo */}
    <ellipse cx={0} cy={-30} rx={220} ry={120} fill={WARM} opacity="0.15" filter="url(#nkwarmglow)" />
    {/* Laptop body */}
    <rect x={-130} y={-90} width={260} height={170} rx={8} fill={BG_ELEVATED} stroke={WARM} strokeWidth={3} />
    <rect x={-118} y={-78} width={236} height={146} rx={4} fill={BG_DEEP} />
    {/* Screen content lines */}
    <rect x={-100} y={-60} width={130} height={4} fill={SOUL_TEAL} />
    <rect x={-100} y={-44} width={170} height={4} fill={TEXT_MUTE} opacity="0.6" />
    <rect x={-100} y={-28} width={90} height={4} fill={GOLD} />
    <rect x={-100} y={-12} width={140} height={4} fill={TEXT_MUTE} opacity="0.6" />
    <rect x={-100} y={4} width={110} height={4} fill={COLD_BLUE} />
    <rect x={-100} y={20} width={170} height={4} fill={TEXT_MUTE} opacity="0.6" />
    <rect x={-100} y={36} width={80} height={4} fill={MYSTIC} />
    <rect x={-100} y={52} width={120} height={4} fill={TEXT_MUTE} opacity="0.6" />
    {/* Keyboard base */}
    <path d={`M -150 80 L 150 80 L 130 100 L -130 100 Z`} fill={BG_ELEVATED} stroke={WARM} strokeWidth={2} />
  </g>
);

// Window scene
const WindowScene: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Window frame */}
    <rect x={-180} y={-220} width={360} height={440} rx={6} fill="none" stroke={COLD_BLUE} strokeWidth={3} />
    {/* Cross */}
    <line x1={0} y1={-220} x2={0} y2={220} stroke={COLD_BLUE} strokeWidth={2} />
    <line x1={-180} y1={0} x2={180} y2={0} stroke={COLD_BLUE} strokeWidth={2} />
    {/* Moon in window */}
    <circle cx={80} cy={-130} r={36} fill={GOLD} opacity="0.85" filter="url(#nkwarmglow)" />
    <circle cx={70} cy={-138} r={30} fill={BG_DEEP} opacity="0.4" />
    {/* Tiny stars */}
    <circle cx={-100} cy={-150} r={2} fill={TEXT_PRI} />
    <circle cx={-60} cy={-180} r={1.5} fill={TEXT_PRI} />
    <circle cx={120} cy={-50} r={1.5} fill={TEXT_PRI} />
    <circle cx={-130} cy={70} r={1.5} fill={TEXT_PRI} />
    <circle cx={140} cy={130} r={2} fill={TEXT_PRI} />
  </g>
);

// ============ SLIDE 1: INTRO ============
const Slide1Intro: React.FC = () => (
  <g>
    {/* Top tag */}
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-380} y={-40} width={760} height={80} rx={40} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
      <text x={0} y={10} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="4">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    {/* Big mood title */}
    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="2" fontStyle="italic">
        Những người
      </text>
      <text x={0} y={100} fontSize={86} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        SINH RA
      </text>
      <text x={0} y={200} fontSize={72} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#nkglow)">
        KHÔNG HỢP
      </text>
      <text x={0} y={285} fontSize={64} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
        NHÂN GIAN
      </text>
    </g>

    {/* Window scene */}
    <g transform={`translate(${W / 2}, 950)`}>
      <WindowScene x={0} y={0} scale={0.85} />
    </g>

    {/* Subtitle */}
    <g transform={`translate(${W / 2}, 1420)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Sống giữa nhân gian.
      </text>
      <text x={0} y={48} fontSize={28} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nhưng đạo tâm chưa từng thuộc về đây.
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1620)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
        — đạo hữu đang đọc dòng này...
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: BAN NGÀY / ĐÊM ============
const Slide2NgayDem: React.FC = () => (
  <g>
    {/* Top label */}
    <g transform={`translate(${W / 2}, 140)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
        2 KHUÔN MẶT · 1 ĐẠO HỮU
      </text>
    </g>

    {/* Day side */}
    <g transform={`translate(${W / 2}, 380)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={2} />
      <g transform={`translate(-400, 0)`}>
        <circle cx={0} cy={0} r={40} fill={WARM} opacity="0.8" />
      </g>
      <text x={-320} y={-30} fontSize={22} fill={WARM} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">
        BAN NGÀY
      </text>
      <text x={-320} y={6} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Đi làm · nói chuyện · cười
      </text>
      <text x={-320} y={40} fontSize={20} fill={TEXT_MUTE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        hoà vào dòng người như bao phàm nhân
      </text>
    </g>

    {/* Transition */}
    <g transform={`translate(${W / 2}, 600)`}>
      <text x={0} y={0} fontSize={32} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nhưng khi thiên hạ chìm vào mộng cảnh...
      </text>
    </g>

    {/* Night side */}
    <g transform={`translate(${W / 2}, 820)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={MYSTIC} strokeWidth={3} filter="url(#nkglow)" />
      <g transform={`translate(-400, 0)`}>
        <circle cx={0} cy={0} r={40} fill={DEEP_PURPLE} opacity="0.9" filter="url(#nkglow)" />
        <circle cx={-12} cy={-12} r={24} fill={BG_DEEP} opacity="0.5" />
      </g>
      <text x={-320} y={-50} fontSize={22} fill={MYSTIC} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">
        ĐÊM
      </text>
      <text x={-320} y={-12} fontSize={32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Đạo tâm thật sự
      </text>
      <text x={-320} y={28} fontSize={32} fill={GOLD} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        thức tỉnh
      </text>
      <text x={-320} y={70} fontSize={20} fill={TEXT_MUTE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        không ai thấy mặt này của hắn
      </text>
    </g>

    {/* Big drop */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <text x={0} y={0} fontSize={64} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#nkglow)">
        ĐẠO TÂM
      </text>
      <text x={0} y={90} fontSize={52} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        CHỈ THỨC TỈNH
      </text>
      <text x={0} y={170} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        KHI ĐÊM XUỐNG
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: CANH BA ============
const Slide3CanhBa: React.FC = () => (
  <g>
    {/* Top tag */}
    <g transform={`translate(${W / 2}, 130)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
        03:00 AM · CANH BA ĐÊM TỐI
      </text>
    </g>

    {/* Laptop in window */}
    <g transform={`translate(${W / 2}, 480)`}>
      <LaptopGlow x={0} y={0} scale={1.2} />
    </g>

    {/* Big drop */}
    <g transform={`translate(${W / 2}, 830)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Màn hình laptop phát sáng...
      </text>
      <text x={0} y={88} fontSize={68} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#nkglow)">
        NHƯ TRẬN PHÁP
      </text>
    </g>

    {/* Activity list */}
    <g transform={`translate(${W / 2}, 1140)`}>
      {[
        { y: -90, t: "🎵  Nghe nhạc một mình", c: SOUL_TEAL },
        { y: -30, t: "💻  Viết vài dòng code", c: GOLD },
        { y: 30, t: "🤖  Đọc về AI · thiên cơ tương lai", c: COLD_BLUE },
        { y: 90, t: "🌌  Suy diễn vận mệnh nhân loại", c: MYSTIC },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={-450} y={10} fontSize={28} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Inner thought */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Cảm giác khó gọi tên:
      </text>
      <text x={0} y={46} fontSize={28} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Nhân gian này · không phải nơi mình thuộc về"
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: KHÓ HÒA NHẬP ============
const Slide4KhoHoaNhap: React.FC = () => (
  <g>
    {/* Top */}
    <g transform={`translate(${W / 2}, 130)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
        TU SĨ NÀY · RẤT KHÓ HOÀ NHẬP
      </text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 260)`}>
      <text x={0} y={0} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        2 THẾ GIỚI · 1 LỰA CHỌN
      </text>
    </g>

    {/* Don't like list */}
    <g transform={`translate(${W / 2}, 520)`}>
      <rect x={-490} y={-160} width={980} height={320} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={2} />
      <text x={0} y={-110} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        ❌  KHÔNG THÍCH
      </text>
      {[
        { y: -50, t: "Xã giao vô nghĩa" },
        { y: 0, t: "Trò chuyện hời hợt" },
        { y: 50, t: "Cuộc sống lặp lại ngày qua ngày" },
      ].map((r, i) => (
        <text key={i} x={0} y={r.y + 10} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
          {r.t}
        </text>
      ))}
      <text x={0} y={130} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        — phàm nhân truy cầu ổn định
      </text>
    </g>

    {/* But */}
    <g transform={`translate(${W / 2}, 770)`}>
      <text x={0} y={0} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Nhưng họ bị HẤP DẪN bởi...
      </text>
    </g>

    {/* Attracted list */}
    <g transform={`translate(${W / 2}, 1140)`}>
      <rect x={-490} y={-220} width={980} height={440} rx={20} fill={BG_SURFACE} stroke={MYSTIC} strokeWidth={3} filter="url(#nkglow)" />
      <text x={0} y={-170} fontSize={26} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🔥  THỨ THAY ĐỔI THỜI ĐẠI
      </text>
      {[
        { y: -100, t: "🌐  Công nghệ", c: COLD_BLUE },
        { y: -40, t: "🕸️  Internet", c: SOUL_TEAL },
        { y: 20, t: "🚀  Startup", c: WARM },
        { y: 80, t: "🤖  AI", c: GOLD },
        { y: 140, t: "🌌  Những thứ phá bỏ giới hạn nhân loại", c: MYSTIC },
      ].map((r, i) => (
        <g key={i} transform={`translate(-380, ${r.y})`}>
          <text x={0} y={10} fontSize={28} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.t}
          </text>
        </g>
      ))}
    </g>
  </g>
);

// ============ SLIDE 5: TÂM MA / TIÊN CĂN ============
const Slide5TamMaTienCan: React.FC = () => (
  <g>
    {/* Big question */}
    <g transform={`translate(${W / 2}, 300)`}>
      <text x={0} y={0} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Có người nói...
      </text>
    </g>

    {/* Option A */}
    <g transform={`translate(${W / 2}, 600)`}>
      <rect x={-490} y={-160} width={980} height={320} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} filter="url(#nkglow)" />
      <text x={0} y={-90} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
        Ý KIẾN 1
      </text>
      <text x={0} y={20} fontSize={80} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="5" filter="url(#nkglow)">
        TÂM MA
      </text>
      <text x={0} y={90} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        không hoà với người · là lỗi của hắn
      </text>
    </g>

    {/* VS divider */}
    <g transform={`translate(${W / 2}, 870)`}>
      <text x={0} y={0} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
        — HAY —
      </text>
    </g>

    {/* Option B */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <rect x={-490} y={-180} width={980} height={360} rx={20} fill={BG_SURFACE} stroke={MYSTIC} strokeWidth={3} filter="url(#nkglow)" />
      <text x={0} y={-110} fontSize={26} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
        Ý KIẾN 2
      </text>
      <text x={0} y={-20} fontSize={68} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#nkglow)">
        TIÊN CĂN
      </text>
      <text x={0} y={50} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" fontStyle="italic">
        khác biệt từ khi sinh ra
      </text>
      <text x={0} y={120} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        sinh ra để truy cầu đại đạo · không phải bình thường
      </text>
    </g>

    {/* Bottom */}
    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Đạo hữu nghiêng về ý kiến nào?
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: CÔ ĐỘC KIẾM TU ============
const Slide6CoDoc: React.FC = () => (
  <g>
    {/* Top */}
    <g transform={`translate(${W / 2}, 130)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
        BỌN HỌ THƯỜNG · CÔ ĐỘC
      </text>
    </g>

    {/* Massive sword title */}
    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Không phải vì không có người bên cạnh...
      </text>
      <text x={0} y={56} fontSize={36} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Mà vì không ai hiểu đạo tâm
      </text>
    </g>

    {/* Sword icon center */}
    <g transform={`translate(${W / 2}, 680)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">🗡️</text>
    </g>

    {/* Big drop */}
    <g transform={`translate(${W / 2}, 970)`}>
      <text x={0} y={0} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#nkglow)">
        KIẾM TU
      </text>
      <text x={0} y={68} fontSize={54} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        GIỮA PHÀM TRẦN
      </text>
    </g>

    {/* Quiet explanation */}
    <g transform={`translate(${W / 2}, 1250)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={DEEP_PURPLE} strokeWidth={2} />
      <text x={0} y={-50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Xung quanh vô cùng náo nhiệt.
      </text>
      <text x={0} y={0} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Nhưng không ai hiểu hắn
      </text>
      <text x={0} y={40} fontSize={32} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        đang nhìn về phương nào.
      </text>
      <text x={0} y={84} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        — phương đó không ai nhìn thấy
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: ĐÊM TU HÀNH ============
const Slide7DemTuHanh: React.FC = () => (
  <g>
    {/* Top */}
    <g transform={`translate(${W / 2}, 130)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
        CHO NÊN · RẤT NHIỀU ĐÊM
      </text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 280)`}>
      <text x={0} y={0} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#nkglow)">
        LẶNG LẼ MỞ LAPTOP
      </text>
      <text x={0} y={70} fontSize={36} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Tu hành trong thế giới riêng
      </text>
    </g>

    {/* Big laptop center */}
    <g transform={`translate(${W / 2}, 660)`}>
      <LaptopGlow x={0} y={0} scale={1.1} />
    </g>

    {/* Activities */}
    <g transform={`translate(${W / 2}, 1080)`}>
      {[
        { y: -70, t: "// Viết vài dòng code", c: SOUL_TEAL },
        { y: 0, t: "// Xem video về tương lai nhân loại", c: COLD_BLUE },
        { y: 70, t: "// Suy nghĩ về những chuyện quá lớn", c: MYSTIC },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={-450} y={10} fontSize={26} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Big drop */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <text x={0} y={0} fontSize={58} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        THẾ GIỚI
      </text>
      <text x={0} y={84} fontSize={68} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#nkglow)">
        RIÊNG CỦA HẮN
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: KẾT LUẬN + CTA ============
const Slide8KetLuan: React.FC = () => (
  <g>
    {/* Opening */}
    <g transform={`translate(${W / 2}, 220)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Có lẽ...
      </text>
      <text x={0} y={60} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        bọn họ không thật sự khác thường.
      </text>
    </g>

    {/* Main reveal */}
    <g transform={`translate(${W / 2}, 530)`}>
      <rect x={-490} y={-140} width={980} height={280} rx={20} fill={BG_SURFACE} stroke={MYSTIC} strokeWidth={3} filter="url(#nkglow)" />
      <text x={0} y={-80} fontSize={24} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        💡 SỰ THẬT
      </text>
      <text x={0} y={-20} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Thiên địa này tạo ra cho
      </text>
      <text x={0} y={20} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        số đông phàm nhân yên ổn
      </text>
      <text x={0} y={88} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        — không phải cho kẻ truy cầu đại đạo
      </text>
    </g>

    {/* The 3 traits */}
    <g transform={`translate(${W / 2}, 900)`}>
      <text x={0} y={-100} fontSize={26} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Còn kẻ luôn muốn:
      </text>
      {[
        { y: -30, t: "🌌  Truy cầu ĐẠI ĐẠO", c: GOLD },
        { y: 30, t: "⚔️  PHÁ BỎ giới hạn", c: MYSTIC },
        { y: 90, t: "👁️  NHÌN THẤY tương lai", c: COLD_BLUE },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={-440} y={12} fontSize={30} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Final wisdom */}
    <g transform={`translate(${W / 2}, 1260)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Từ đầu đã rất khó
      </text>
      <text x={0} y={50} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#nkglow)">
        HOÀ HỢP NHÂN GIAN
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
      <text x={0} y={-30} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💬  Đạo hữu thấy mình trong câu chuyện này?
      </text>
      <text x={0} y={20} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Save · Tag · Comment để cùng nhau tu hành
      </text>
      <text x={0} y={56} fontSize={20} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Follow · nghe truyền kỳ giới AI mỗi tuần
      </text>
    </g>
  </g>
);

export const SlideCarouselNguoiKhongHop: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Intro />}
        {slideNum === 2 && <Slide2NgayDem />}
        {slideNum === 3 && <Slide3CanhBa />}
        {slideNum === 4 && <Slide4KhoHoaNhap />}
        {slideNum === 5 && <Slide5TamMaTienCan />}
        {slideNum === 6 && <Slide6CoDoc />}
        {slideNum === 7 && <Slide7DemTuHanh />}
        {slideNum === 8 && <Slide8KetLuan />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
