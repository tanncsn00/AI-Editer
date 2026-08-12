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

// 7 cảnh giới colors
const C_LV1_WHITE = "#E8E8E8";   // Luyện Khí
const C_LV2_GREEN = "#3FD68A";   // Trúc Cơ
const C_LV3_BLUE = "#4FA8FF";    // Kết Đan
const C_LV4_PURPLE = "#9D5BFF";  // Nguyên Anh
const C_LV5_ORANGE = "#FF8A3D";  // Hoá Thần
const C_LV6_RED = "#FF4747";     // Độ Kiếp
const C_LV7_BLACK = "#1A1424";   // Phi Thăng (display tone)

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="fabg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={C_LV4_PURPLE} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="fabg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="fabg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={C_LV6_RED} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="fagrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="famaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="fagm"><rect width={W} height={H} fill="url(#famaskg)" /></mask>
      <filter id="faglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#fagrid)" mask="url(#fagm)" />
    <rect width={W} height={H} fill="url(#fabg1)" />
    <rect width={W} height={H} fill="url(#fabg2)" />
    <rect width={W} height={H} fill="url(#fabg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · cảnh giới FA · 2026
    </text>
  </g>
);

// Big tag header with level + SVG dot
const LevelHeader: React.FC<{ emoji: string; lv: string; name: string; color: string }> = ({ lv, name, color }) => (
  <g transform={`translate(${W / 2}, 150)`}>
    <rect x={-490} y={-66} width={980} height={132} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
    <g transform={`translate(-420, 0)`}>
      <rect x={-60} y={-44} width={130} height={88} rx={16} fill={color} />
      <text x={4} y={16} fontSize={32} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        {lv}
      </text>
    </g>
    <circle cx={-300} cy={0} r={22} fill={color} stroke={TEXT_PRI} strokeWidth={2} filter="url(#faglow)" />
    <text x={-260} y={14} fontSize={32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
      {name}
    </text>
  </g>
);

// ============ SLIDE 1: INTRO HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-400} y={-46} width={800} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Trong tiên giới công nghệ...
      </text>
    </g>

    <g transform={`translate(${W / 2}, 470)`}>
      <text x={0} y={0} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#faglow)" letterSpacing="1">
        có 1 loại tu sĩ rất kỳ lạ
      </text>
    </g>

    {/* Bullet abilities */}
    <g transform={`translate(${W / 2}, 760)`}>
      <text x={0} y={-100} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Bọn họ có thể:
      </text>
      {[
        { y: -30, t: "💻 thức 3 ngày debug production", c: JADE },
        { y: 30, t: "📖 đọc thiên thư documentation", c: C_LV3_BLUE },
        { y: 90, t: "⚡ luyện hoá vạn dòng code", c: C_LV4_PURPLE },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-440} y={-30} width={880} height={60} rx={12} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
          <text x={-410} y={12} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* But */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={0} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Nhưng vừa gặp nữ tu...
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1320)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={4} filter="url(#faglow)" />
      <text x={0} y={-30} fontSize={48} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        ⚠️ ĐẠO TÂM ĐẠI LOẠN
      </text>
      <text x={0} y={30} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Code chuẩn — tình cảm lỗi 404
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        7 cảnh giới FA dân IT · bạn ở đâu?
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: LV1 LUYỆN KHÍ FA ============
const Slide2LuyenKhi: React.FC = () => (
  <g>
    <LevelHeader emoji="⚪" lv="LV1" name="LUYỆN KHÍ FA" color={C_LV1_WHITE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Vẫn còn 1 tia chấp niệm với tình ái
      </text>
    </g>

    {/* Day vs night routine */}
    <g transform={`translate(${W / 2}, 580)`}>
      <g transform={`translate(-230, 0)`}>
        <rect x={-180} y={-100} width={360} height={200} rx={16} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
        <text x={0} y={-30} fontSize={64} textAnchor="middle">☀️</text>
        <text x={0} y={30} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BAN NGÀY</text>
        <text x={0} y={70} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>luyện code</text>
      </g>
      <g transform={`translate(230, 0)`}>
        <rect x={-180} y={-100} width={360} height={200} rx={16} fill={BG_SURFACE} stroke={C_LV4_PURPLE} strokeWidth={3} />
        <text x={0} y={-30} fontSize={64} textAnchor="middle">🌙</text>
        <text x={0} y={20} fontSize={22} fill={C_LV4_PURPLE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐÊM</text>
        <text x={0} y={50} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nghe podcast</text>
        <text x={0} y={76} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khởi nghiệp</text>
      </g>
    </g>

    {/* Quote */}
    <g transform={`translate(${W / 2}, 920)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
      <text x={0} y={-30} fontSize={24} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎤 MIỆNG LUÔN NÓI
      </text>
      <text x={0} y={30} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Bần đạo nay lấy tu hành làm trọng"
      </text>
    </g>

    {/* Reality */}
    <g transform={`translate(${W / 2}, 1240)`}>
      <text x={0} y={-60} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Nhưng sự thật là...
      </text>
      <rect x={-490} y={-10} width={980} height={130} rx={20} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={4} filter="url(#faglow)" />
      <text x={0} y={50} fontSize={36} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        không nữ tu nào chú ý
      </text>
      <text x={0} y={92} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        kể cả em sale insurance auto rep
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: LV2 TRÚC CƠ ============
const Slide3TrucCo: React.FC = () => (
  <g>
    <LevelHeader emoji="🟢" lv="LV2" name="TRÚC CƠ CÔ ĐỘC" color={C_LV2_GREEN} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Sau vài năm code đạo · bắt đầu động phàm tâm
      </text>
    </g>

    {/* iMessage mock - story reply */}
    <g transform={`translate(${W / 2}, 620)`}>
      <rect x={-340} y={-160} width={680} height={320} rx={32} fill={BG_SURFACE} stroke={C_LV2_GREEN} strokeWidth={3} />
      <text x={-300} y={-120} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>📸 Story của @em_xinh_xinh</text>
      {/* Story bubble */}
      <g transform={`translate(-200, -40)`}>
        <rect x={-100} y={-40} width={200} height={80} rx={20} fill={BG_ELEVATED} />
        <text x={0} y={10} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
          em rep: haha
        </text>
      </g>
      <text x={20} y={4} fontSize={32} fill={C_LV2_GREEN} fontWeight={900}>👁️</text>
      <text x={120} y={8} fontSize={20} fill={C_LV2_GREEN} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ 2 chữ</text>
      <text x={0} y={120} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        ⚡ THIÊN MỆNH ĐÃ TỚI ⚡
      </text>
    </g>

    {/* Asks ChatGPT */}
    <g transform={`translate(${W / 2}, 1110)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={C_LV3_BLUE} strokeWidth={3} />
      <text x={0} y={-66} fontSize={36} textAnchor="middle">💬</text>
      <text x={0} y={-22} fontSize={24} fill={C_LV3_BLUE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
        Đêm đó mở ChatGPT hỏi:
      </text>
      <text x={0} y={22} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        "Bần đạo nên khai khẩu thế nào"
      </text>
      <text x={0} y={62} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        "mới không tổn đạo tâm?"
      </text>
    </g>

    {/* Below */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        — ChatGPT prompt 3000 token để rep 1 câu "chào em"
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: LV3 KẾT ĐAN ============
const Slide4KetDan: React.FC = () => (
  <g>
    <LevelHeader emoji="🔵" lv="LV3" name="KẾT ĐAN TÌNH KIẾP" color={C_LV3_BLUE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nhìn qua tưởng đạo tâm viên mãn
      </text>
    </g>

    {/* Achievements */}
    <g transform={`translate(${W / 2}, 540)`}>
      {[
        { x: -320, t: "💰 Linh thạch", s: "$$$" },
        { x: 0, t: "🚀 Side project", s: "built" },
        { x: 320, t: "🌍 Remote", s: "toàn cầu" },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x}, 0)`}>
          <rect x={-140} y={-60} width={280} height={120} rx={16} fill={BG_SURFACE} stroke={JADE} strokeWidth={2} />
          <text x={0} y={-15} fontSize={22} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {p.t}
          </text>
          <text x={0} y={25} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            {p.s}
          </text>
        </g>
      ))}
    </g>

    {/* BUT face-to-face */}
    <g transform={`translate(${W / 2}, 820)`}>
      <text x={0} y={0} fontSize={32} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        NHƯNG gặp nữ tu ngoài đời...
      </text>
    </g>

    {/* Tech metaphor system meltdown */}
    <g transform={`translate(${W / 2}, 1140)`}>
      <rect x={-490} y={-220} width={980} height={440} rx={20} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={4} filter="url(#faglow)" />
      <text x={0} y={-170} fontSize={22} fill={C_LV6_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ⚠️  SYSTEM ERROR
      </text>
      {[
        { y: -110, l: "🔥 CPU", v: "QUÁ NHIỆT 99°C", c: C_LV6_RED },
        { y: -50, l: "📡 PING", v: "TĂNG CAO 999ms", c: C_LV5_ORANGE },
        { y: 10, l: "🧠 THẦN THỨC", v: "HỖN LOẠN", c: C_LV4_PURPLE },
        { y: 70, l: "💧 MỒ HÔI >", v: "MEMORY LEAK", c: C_LV3_BLUE },
      ].map((r, i) => (
        <g key={i} transform={`translate(-440, ${r.y})`}>
          <text x={0} y={6} fontSize={22} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            {r.l}
          </text>
          <text x={400} y={6} fontSize={22} fill={r.c} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
            {r.v}
          </text>
        </g>
      ))}
      <text x={0} y={150} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        $ kernel panic — đạo tâm crashed
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: LV4 NGUYÊN ANH ============
const Slide5NguyenAnh: React.FC = () => (
  <g>
    <LevelHeader emoji="🟣" lv="LV4" name="NGUYÊN ANH VÔ TÌNH" color={C_LV4_PURPLE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Dev phong bế thất tình lục dục
      </text>
    </g>

    {/* iMessage mock - she text */}
    <g transform={`translate(${W / 2}, 590)`}>
      <text x={-460} y={-100} fontSize={18} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>21:30 · nữ tu</text>
      <g transform={`translate(-180, -40)`}>
        <rect x={-180} y={-40} width={360} height={80} rx={32} fill={BG_ELEVATED} stroke={C_LV4_PURPLE} strokeWidth={2} />
        <text x={0} y={10} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          "anh ngủ chưa? 🥺"
        </text>
      </g>
    </g>

    {/* Delay timer */}
    <g transform={`translate(${W / 2}, 800)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={3} />
      <text x={0} y={-30} fontSize={24} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⏳ HẮN REP SAU
      </text>
      <text x={0} y={30} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#faglow)">
        3 CANH GIỜ
      </text>
    </g>

    {/* His reply */}
    <g transform={`translate(${W / 2}, 1080)`}>
      <text x={460} y={-100} fontSize={18} fill={TEXT_MUTE} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={600}>3:00am · hắn</text>
      <g transform={`translate(180, -40)`}>
        <rect x={-200} y={-50} width={400} height={100} rx={32} fill={C_LV2_GREEN} />
        <text x={0} y={-10} fontSize={22} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          "Xin lỗi..."
        </text>
        <text x={0} y={22} fontSize={20} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          "vừa độ kiếp production"
        </text>
      </g>
    </g>

    {/* Result */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_LV4_PURPLE} strokeWidth={3} />
      <text x={0} y={-30} fontSize={24} fill={C_LV4_PURPLE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📜 KẾT QUẢ
      </text>
      <text x={0} y={20} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        1 đoạn nhân duyên tan biến
      </text>
      <text x={0} y={56} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        giữa dòng thời gian
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: LV5 HOÁ THẦN ============
const Slide6HoaThan: React.FC = () => (
  <g>
    <LevelHeader emoji="🟠" lv="LV5" name="HOÁ THẦN TẨU HOẢ" color={C_LV5_ORANGE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={28} fill={C_LV5_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🕑 2:00 AM · Hắn mở Facebook
      </text>
    </g>

    {/* News feed of others */}
    <g transform={`translate(${W / 2}, 700)`}>
      <text x={0} y={-150} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Thiên hạ kết thành đạo lữ:
      </text>
      {[
        { y: -80, t: "💍 Khoe hỷ sự — cưới hỏi rần rần" },
        { y: -20, t: "🍼 Khoe hài tử — con đầu lòng" },
        { y: 40, t: "✈️ Khoe du ngoạn — Bali Phú Quốc" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-440} y={-30} width={880} height={60} rx={12} fill={BG_SURFACE} stroke={C_LV5_ORANGE} strokeWidth={2} />
          <text x={-410} y={10} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* VS him alone */}
    <g transform={`translate(${W / 2}, 1100)`}>
      <text x={0} y={-90} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Chỉ có bản thân hắn:
      </text>
      <rect x={-490} y={-30} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={3} />
      <text x={0} y={15} fontSize={40} textAnchor="middle">🖥️</text>
      <text x={0} y={70} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        sửa bug timezone lúc 2h sáng
      </text>
    </g>

    {/* Deep question */}
    <g transform={`translate(${W / 2}, 1490)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Đời này ta phải phi thăng...
      </text>
      <text x={0} y={40} fontSize={32} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        một mình?"
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: LV6 ĐỘ KIẾP ============
const Slide7DoKiep: React.FC = () => (
  <g>
    <LevelHeader emoji="🔴" lv="LV6" name="ĐỘ KIẾP FA" color={C_LV6_RED} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Hắn đã không còn sợ:
      </text>
    </g>

    {/* No longer afraid */}
    <g transform={`translate(${W / 2}, 580)`}>
      {[
        { y: -80, t: "🔥 Production sập lúc 3AM", e: "không sợ ✓" },
        { y: -20, t: "💀 Startup phá diệt · gọi vốn fail", e: "không sợ ✓" },
        { y: 40, t: "⚡ Layoff đại kiếp · cắt 30%", e: "không sợ ✓" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-440} y={-30} width={880} height={60} rx={12} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={-410} y={10} fontSize={24} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
          <text x={410} y={10} fontSize={20} fill={JADE} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={800}>
            {r.e}
          </text>
        </g>
      ))}
    </g>

    {/* The only thing */}
    <g transform={`translate(${W / 2}, 940)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Thứ duy nhất khiến đạo tâm dao động:
      </text>
    </g>

    {/* Mom message - the boss-level threat */}
    <g transform={`translate(${W / 2}, 1240)`}>
      <text x={-460} y={-180} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>👵 Mẹ · 18:00</text>
      <rect x={-490} y={-140} width={980} height={280} rx={32} fill={BG_SURFACE} stroke={C_LV6_RED} strokeWidth={4} filter="url(#faglow)" />
      <text x={0} y={-60} fontSize={30} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ THIÊN KIẾP CẤP CAO ⚡
      </text>
      <text x={0} y={10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Bao giờ mới mang
      </text>
      <text x={0} y={50} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        đạo lữ về tông môn?"
      </text>
      <text x={0} y={100} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ☠️ uy lực &gt; thiên kiếp production
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: LV7 PHI THĂNG ============
const Slide8PhiThang: React.FC = () => (
  <g>
    <LevelHeader emoji="⚫" lv="LV7" name="PHI THĂNG CÔ ĐỘC" color={GOLD} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Lĩnh ngộ thiên đạo · từ bỏ hồng trần
      </text>
    </g>

    {/* New disciples */}
    <g transform={`translate(${W / 2}, 600)`}>
      <text x={0} y={-100} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Hắn lấy:
      </text>
      {[
        { y: -40, label: "ĐẠO LỮ", val: "Cursor", c: "#28A0F0" },
        { y: 20, label: "TÌNH KIẾP", val: "Production", c: C_LV6_RED },
        { y: 80, label: "LINH DƯỢC", val: "Caffeine ☕", c: "#A0522D" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-440} y={-25} width={880} height={50} rx={10} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
          <text x={-410} y={8} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {r.label}:
          </text>
          <text x={-180} y={9} fontSize={26} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.val}
          </text>
        </g>
      ))}
    </g>

    {/* Bế quan room */}
    <g transform={`translate(${W / 2}, 1010)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} filter="url(#faglow)" />
      <text x={0} y={-50} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🖥️ MONITOR = TIÊN QUANG HỘ THỂ
      </text>
      <text x={0} y={0} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Ngày ngày bế quan · căn phòng tối
      </text>
      <text x={0} y={36} fontSize={20} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        WiFi + RGB = đạo tràng linh thiêng
      </text>
    </g>

    {/* The verdict */}
    <g transform={`translate(${W / 2}, 1290)`}>
      <text x={0} y={0} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#faglow)">
        🏯 MỘT NIỆM CHỨNG ĐẠO
      </text>
      <text x={0} y={70} fontSize={56} fill={C_LV6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        MỘT ĐỜI FA
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        💬 Đạo hữu đang ở cảnh giới nào?
      </text>
      <text x={0} y={36} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Comment LV mấy + Follow nghe truyền kỳ tuần
      </text>
    </g>
  </g>
);

export const SlideCarouselItFaCanhGioi: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2LuyenKhi />}
        {slideNum === 3 && <Slide3TrucCo />}
        {slideNum === 4 && <Slide4KetDan />}
        {slideNum === 5 && <Slide5NguyenAnh />}
        {slideNum === 6 && <Slide6HoaThan />}
        {slideNum === 7 && <Slide7DoKiep />}
        {slideNum === 8 && <Slide8PhiThang />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
