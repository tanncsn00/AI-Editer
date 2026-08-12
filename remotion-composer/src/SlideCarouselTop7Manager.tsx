import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const BG_ELEVATED = "#1E1830";
const BORDER = "#3A2F50";
const TEXT_PRI = "#F5EDD8";
const TEXT_SEC = "#A89BC0";
const TEXT_MUTE = "#5A4F70";

const GOLD = "#F4C04A";
const JADE = "#3FD68A";

const C_L1_WHITE = "#E8E8E8";   // Thiên Cơ
const C_L2_GREEN = "#3FD68A";   // Vô Thượng Họp Đạo
const C_L3_BLUE = "#4FA8FF";    // Vi Mô
const C_L4_PURPLE = "#9D5BFF";  // Không biết tech
const C_L5_ORANGE = "#FF8A3D";  // KPI
const C_L6_RED = "#FF4747";     // Ẩn Thế
const C_L7_BUDDHA = "#FFD66B";  // Phật Tu Tích Cực (gold-warm)

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="mgbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={C_L4_PURPLE} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="mgbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="mgbg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={C_L6_RED} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="mggrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="mgmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="mggm"><rect width={W} height={H} fill="url(#mgmaskg)" /></mask>
      <filter id="mgglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#mggrid)" mask="url(#mggm)" />
    <rect width={W} height={H} fill="url(#mgbg1)" />
    <rect width={W} height={H} fill="url(#mgbg2)" />
    <rect width={W} height={H} fill="url(#mgbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · 7 manager nhập ma · 2026
    </text>
  </g>
);

const LoaiHeader: React.FC<{ loai: string; name: string; color: string }> = ({ loai, name, color }) => {
  const fs = name.length > 18 ? 24 : name.length > 14 ? 28 : 32;
  return (
    <g transform={`translate(${W / 2}, 150)`}>
      <rect x={-490} y={-66} width={980} height={132} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
      <g transform={`translate(-405, 0)`}>
        <rect x={-80} y={-44} width={160} height={88} rx={16} fill={color} />
        <text x={0} y={14} fontSize={30} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
          {loai}
        </text>
      </g>
      <circle cx={-275} cy={0} r={22} fill={color} stroke={TEXT_PRI} strokeWidth={2} filter="url(#mgglow)" />
      <text x={-238} y={12} fontSize={fs} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {name}
      </text>
    </g>
  );
};

// ============ SLIDE 1: INTRO HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 140)`}>
      <rect x={-380} y={-46} width={760} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    {/* Massive title */}
    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
        TOP 7 LOẠI
      </text>
      <text x={0} y={120} fontSize={100} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#mgglow)">
        MANAGER
      </text>
      <text x={0} y={230} fontSize={48} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        KHIẾN DEV NHẬP MA
      </text>
    </g>

    {/* Trait cards */}
    <g transform={`translate(${W / 2}, 940)`}>
      <text x={0} y={-130} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Ngoài bug + deadline thiên kiếp...
      </text>
      {[
        { y: -50, t: "🐛 Bug production", c: TEXT_MUTE },
        { y: 20, t: "⏰ Deadline thiên kiếp", c: TEXT_MUTE },
        { y: 90, t: "👔 MANAGER · sinh vật đáng sợ nhất", c: C_L6_RED },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-450} y={-32} width={900} height={64} rx={14} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Warning */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-30} fontSize={36} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        ⚠️ KHÔNG NHẤT ĐỊNH BIẾT CODE
      </text>
      <text x={0} y={30} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Nhưng đạo tâm dev lập tức bất ổn
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1610)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Tag sếp · đoán xem hắn là LOẠI nào 🏯
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: LOẠI 1 THIÊN CƠ ============
const Slide2ThienCo: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 1" name="THIÊN CƠ QUẢN LÝ" color={C_L1_WHITE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Mỗi ngày · hỏi đúng 1 câu
      </text>
    </g>

    {/* Manager bubble */}
    <g transform={`translate(${W / 2}, 540)`}>
      <text x={-460} y={-90} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>👔 Manager · 09:00</text>
      <g transform={`translate(-180, 0)`}>
        <rect x={-260} y={-50} width={520} height={100} rx={28} fill={BG_ELEVATED} stroke={C_L1_WHITE} strokeWidth={2} />
        <text x={0} y={12} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          "Task này estimate bao lâu?"
        </text>
      </g>
    </g>

    {/* Dev reply */}
    <g transform={`translate(${W / 2}, 760)`}>
      <text x={460} y={-90} fontSize={20} fill={TEXT_MUTE} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={600}>👨‍💻 Dev · 09:01</text>
      <g transform={`translate(180, 0)`}>
        <rect x={-220} y={-50} width={440} height={100} rx={28} fill={JADE} />
        <text x={0} y={12} fontSize={28} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          "Khoảng 3 ngày."
        </text>
      </g>
    </g>

    {/* Manager smile */}
    <g transform={`translate(${W / 2}, 990)`}>
      <text x={-460} y={-90} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>👔 Manager · mỉm cười 😊</text>
      <g transform={`translate(-180, 0)`}>
        <rect x={-280} y={-50} width={560} height={100} rx={28} fill={BG_ELEVATED} stroke={C_L6_RED} strokeWidth={3} filter="url(#mgglow)" />
        <text x={0} y={12} fontSize={28} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
          "Thế mai xong nhé."
        </text>
      </g>
    </g>

    {/* Impact */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-50} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💥 1 CÂU NÓI
      </text>
      <text x={0} y={20} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        CHẤN VỠ
      </text>
      <text x={0} y={70} fontSize={42} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        NGUYÊN THẦN
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: LOẠI 2 HỌP ĐẠO ============
const Slide3HopDao: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 2" name="VÔ THƯỢNG HỌP ĐẠO" color={C_L2_GREEN} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Không code · không docs · CHỈ HỌP
      </text>
    </g>

    {/* Calendar mock */}
    <g transform={`translate(${W / 2}, 700)`}>
      <rect x={-490} y={-220} width={980} height={440} rx={20} fill={BG_SURFACE} stroke={C_L2_GREEN} strokeWidth={3} />
      <text x={0} y={-180} fontSize={26} fill={C_L2_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📅 CALENDAR · phong thiên đại trận
      </text>
      {[
        { y: -120, t: "08:30 — Daily standup · 45 phút", c: C_L6_RED },
        { y: -68, t: "09:30 — Sprint kickoff · 1 giờ", c: C_L5_ORANGE },
        { y: -16, t: "11:00 — Roadmap review · 1.5 giờ", c: C_L5_ORANGE },
        { y: 36, t: "13:00 — Lunch & learn · 1 giờ", c: C_L4_PURPLE },
        { y: 88, t: "14:30 — Cross-team sync · 2 giờ", c: C_L6_RED },
        { y: 140, t: "17:00 — Retro · 1 giờ", c: C_L5_ORANGE },
      ].map((m, i) => (
        <g key={i} transform={`translate(0, ${m.y})`}>
          <rect x={-440} y={-22} width={880} height={44} rx={8} fill={BG_DEEP} stroke={m.c} strokeWidth={2} />
          <text x={-410} y={10} fontSize={20} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {m.t}
          </text>
        </g>
      ))}
    </g>

    {/* Result */}
    <g transform={`translate(${W / 2}, 1300)`}>
      <text x={0} y={-100} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        1 task 15 phút · sau 3 canh giờ họp:
      </text>
      <rect x={-490} y={-30} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={20} fontSize={36} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        🌀 KHÔNG AI BIẾT
      </text>
      <text x={0} y={70} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        PHẢI LÀM GÌ
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: LOẠI 3 ĐẠI NĂNG VI MÔ ============
const Slide4ViMo: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 3" name="ĐẠI NĂNG VI MÔ" color={C_L3_BLUE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        ⚠️ Đáng sợ nhất với SENIOR DEV
      </text>
    </g>

    {/* Skills */}
    <g transform={`translate(${W / 2}, 540)`}>
      {[
        { y: -60, t: "✏️ Review từng dòng code", c: C_L3_BLUE },
        { y: 0, t: "🔍 Soi từng dấu chấm phẩy", c: C_L4_PURPLE },
        { y: 60, t: "🎯 Mọi thứ đều muốn quản", c: C_L5_ORANGE },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-450} y={-32} width={900} height={64} rx={14} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Timeline */}
    <g transform={`translate(${W / 2}, 900)`}>
      <rect x={-490} y={-50} width={980} height={100} rx={20} fill={BG_SURFACE} stroke={JADE} strokeWidth={2} />
      <text x={0} y={14} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⏱️ Dev vừa push commit...
      </text>
    </g>

    {/* 3 sec later */}
    <g transform={`translate(${W / 2}, 1060)`}>
      <text x={0} y={0} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚡ 3 GIÂY SAU ⚡
      </text>
    </g>

    {/* Manager comment */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <text x={-460} y={-130} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={600}>👔 Manager · GitHub comment</text>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_L3_BLUE} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-15} fontSize={26} fill={C_L3_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "Anh nghĩ em nên rename
      </text>
      <text x={0} y={25} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        variable này."
      </text>
    </g>

    {/* Impact */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Đạo tâm trực tiếp xuất hiện TÂM MA
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: LOẠI 4 KHÔNG BIẾT TECH ============
const Slide5KhongBietTech: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 4" name="KHÔNG BIẾT TECH" color={C_L4_PURPLE} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nghe AI buzzword 3 ngày · liền tuyên bố:
      </text>
    </g>

    {/* Big buzzword stack */}
    <g transform={`translate(${W / 2}, 700)`}>
      <rect x={-490} y={-220} width={980} height={440} rx={20} fill={BG_SURFACE} stroke={C_L4_PURPLE} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-170} fontSize={24} fill={C_L4_PURPLE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎤 "TA MUỐN TÍCH HỢP..."
      </text>
      {[
        { y: -100, t: "BLOCKCHAIN", c: "#F5B829" },
        { y: -30, t: "AI AGENT", c: C_L2_GREEN },
        { y: 40, t: "METAVERSE", c: C_L4_PURPLE },
        { y: 110, t: "+ web3 + DAO + crypto + NFT", c: C_L6_RED },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={0} y={14} fontSize={i === 3 ? 24 : 42} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing={i === 3 ? "1" : "3"}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Reaction */}
    <g transform={`translate(${W / 2}, 1250)`}>
      <text x={0} y={-80} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Cả dev team:
      </text>
      <rect x={-490} y={-30} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={3} />
      <text x={0} y={20} fontSize={36} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        😶 ĐỨNG LẶNG HỒI LÂU
      </text>
      <text x={0} y={70} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        không biết giải thích từ đâu trước
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: LOẠI 5 KPI ============
const Slide6KPI: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 5" name="ĐẠI ĐẠO KPI" color={C_L5_ORANGE} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Velocity sprint &gt; thiên đạo
      </text>
    </g>

    {/* Doesn't care */}
    <g transform={`translate(${W / 2}, 620)`}>
      <text x={0} y={-130} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ❌ KHÔNG QUAN TÂM:
      </text>
      {[
        { x: -240, y: -50, t: "💥 Production sập" },
        { x: 240, y: -50, t: "🏚️ Technical debt" },
        { x: -240, y: 50, t: "🔥 Burnout" },
        { x: 240, y: 50, t: "🐛 Bug" },
      ].map((r, i) => (
        <g key={i} transform={`translate(${r.x}, ${r.y})`}>
          <rect x={-200} y={-32} width={400} height={64} rx={12} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={0} y={12} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Only asks */}
    <g transform={`translate(${W / 2}, 1010)`}>
      <text x={0} y={-90} fontSize={28} fill={C_L5_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ✅ CHỈ HỎI 1 CÂU:
      </text>
      <rect x={-490} y={-30} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={C_L5_ORANGE} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={40} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Tuần này output đâu?"
      </text>
    </g>

    {/* Result */}
    <g transform={`translate(${W / 2}, 1370)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={3} filter="url(#mgglow)" />
      <text x={0} y={-30} fontSize={24} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💀 TU SĨ DƯỚI TRƯỚNG LÂU NGÀY
      </text>
      <text x={0} y={30} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        MẤT SẠCH SINH KHÍ
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: LOẠI 6 ẨN THẾ ============
const Slide7AnThe: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 6" name="ẨN THẾ BIẾN MẤT" color={C_L6_RED} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Biến hình theo ngữ cảnh
      </text>
    </g>

    {/* Status 1 */}
    <g transform={`translate(${W / 2}, 540)`}>
      <rect x={-490} y={-50} width={980} height={100} rx={16} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={2} />
      <text x={-440} y={-8} fontSize={20} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// Project ổn định:</text>
      <text x={-440} y={28} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>👻 KHÔNG THẤY ĐÂU</text>
    </g>

    {/* Status 2 */}
    <g transform={`translate(${W / 2}, 700)`}>
      <rect x={-490} y={-50} width={980} height={100} rx={16} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={2} />
      <text x={-440} y={-8} fontSize={20} fill={C_L6_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// Production sập 3AM:</text>
      <text x={-440} y={28} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔕 OFFLINE</text>
    </g>

    {/* Status 3 */}
    <g transform={`translate(${W / 2}, 870)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={16} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} filter="url(#mgglow)" />
      <text x={-440} y={-14} fontSize={20} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// Demo với trưởng lão cấp cao:</text>
      <text x={-440} y={22} fontSize={26} fill={GOLD} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✨ THẦN TIÊN GIÁNG THẾ</text>
      <text x={-440} y={50} fontSize={18} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">→ "Anh nói team đã làm rất tốt"</text>
    </g>

    {/* Famous quote */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={-120} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎙️ CÂU NÓI CỦA HẮN
      </text>
      <rect x={-490} y={-80} width={980} height={160} rx={32} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Team CHÚNG TÔI
      </text>
      <text x={0} y={40} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        đã làm rất tốt"
      </text>
    </g>

    {/* Dev reaction */}
    <g transform={`translate(${W / 2}, 1490)`}>
      <text x={0} y={0} fontSize={28} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        Dev chỉ muốn NHẬP MA tại chỗ
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: LOẠI 7 PHẬT TU ============
const Slide8PhatTu: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 7" name="PHẬT TU TÍCH CỰC" color={C_L7_BUDDHA} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={C_L7_BUDDHA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        ⚠️ NGUY HIỂM NHẤT TRONG 7 LOẠI ⚠️
      </text>
    </g>

    {/* Crisis scenarios */}
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={-130} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Dù chuyện gì xảy ra:
      </text>
      {[
        { y: -60, t: "🔥 Deadline cháy" },
        { y: 0, t: "💥 Production nổ" },
        { y: 60, t: "💀 Dev thức trắng 3 ngày" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-450} y={-32} width={900} height={64} rx={12} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Famous quote */}
    <g transform={`translate(${W / 2}, 1020)`}>
      <text x={0} y={-130} fontSize={24} fill={C_L7_BUDDHA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🧘 HẮN VẪN MỈM CƯỜI ÔN HOÀ
      </text>
      <rect x={-490} y={-90} width={980} height={180} rx={32} fill={BG_SURFACE} stroke={C_L7_BUDDHA} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-10} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Guys đừng stress
      </text>
      <text x={0} y={42} fontSize={42} fill={C_L7_BUDDHA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        nhé ❤️"
      </text>
    </g>

    {/* Damage */}
    <g transform={`translate(${W / 2}, 1330)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#mgglow)" />
      <text x={0} y={-50} fontSize={24} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ☠️ UY LỰC &gt; THIÊN KIẾP PRODUCTION
      </text>
      <text x={0} y={10} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Tâm ma toàn bộ dev team
      </text>
      <text x={0} y={55} fontSize={32} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        TRIỆT ĐỂ THỨC TỈNH
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        💬 Sếp bạn là LOẠI nào?
      </text>
      <text x={0} y={36} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Comment + Tag · Follow truyền kỳ tuần 🏯
      </text>
    </g>
  </g>
);

export const SlideCarouselTop7Manager: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2ThienCo />}
        {slideNum === 3 && <Slide3HopDao />}
        {slideNum === 4 && <Slide4ViMo />}
        {slideNum === 5 && <Slide5KhongBietTech />}
        {slideNum === 6 && <Slide6KPI />}
        {slideNum === 7 && <Slide7AnThe />}
        {slideNum === 8 && <Slide8PhatTu />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
