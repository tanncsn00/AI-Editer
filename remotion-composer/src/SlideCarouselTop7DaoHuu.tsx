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
const PINK = "#FF7AB6";

// 7 loại colors
const C_L1_WHITE = "#E8E8E8";   // Refactor
const C_L2_GREEN = "#3FD68A";   // AI Bro
const C_L3_BLUE = "#4FA8FF";    // Friday Deploy
const C_L4_PURPLE = "#9D5BFF";  // Overengineering
const C_L5_ORANGE = "#FF8A3D";  // Họp đạo
const C_L6_RED = "#FF4747";     // Silent Bug
const C_L7_PINK = "#FF7AB6";    // Xinh đẹp biết code

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="dhbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={C_L4_PURPLE} stopOpacity="0.22" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="dhbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="dhbg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={C_L6_RED} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="dhgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="dhmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="dhgm"><rect width={W} height={H} fill="url(#dhmaskg)" /></mask>
      <filter id="dhglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#dhgrid)" mask="url(#dhgm)" />
    <rect width={W} height={H} fill="url(#dhbg1)" />
    <rect width={W} height={H} fill="url(#dhbg2)" />
    <rect width={W} height={H} fill="url(#dhbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · 7 đạo hữu nguy hiểm · 2026
    </text>
  </g>
);

// Header with LOẠI badge + SVG dot + name
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
      <circle cx={-275} cy={0} r={22} fill={color} stroke={TEXT_PRI} strokeWidth={2} filter="url(#dhglow)" />
      <text x={-238} y={12} fontSize={fs} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {name}
      </text>
    </g>
  );
};

// ============ SLIDE 1: INTRO HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    {/* Top tag */}
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
      <text x={0} y={120} fontSize={100} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#dhglow)">
        ĐẠO HỮU
      </text>
      <text x={0} y={220} fontSize={52} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        NGUY HIỂM NHẤT
      </text>
    </g>

    {/* Subtitle */}
    <g transform={`translate(${W / 2}, 700)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        trong mỗi tông môn công nghệ
      </text>
    </g>

    {/* Trait cards */}
    <g transform={`translate(${W / 2}, 950)`}>
      {[
        { y: -80, t: "Không nhất định mạnh nhất", c: TEXT_MUTE },
        { y: 0, t: "Nhưng chỉ cần xuất hiện...", c: GOLD },
        { y: 80, t: "Đạo tâm cả team bất ổn", c: C_L6_RED },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-450} y={-32} width={900} height={64} rx={14} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* Warning bottom */}
    <g transform={`translate(${W / 2}, 1320)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={-30} fontSize={42} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        ⚠️ DANH SÁCH SẮP HIỆN RA
      </text>
      <text x={0} y={30} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Bạn đã gặp loại nào ở công ty?
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Comment LOẠI nào ám ảnh nhất 🏯
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: LOẠI 1 REFACTOR ============
const Slide2Refactor: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 1" name="ĐẠO HỮU REFACTOR" color={C_L1_WHITE} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        "Để ta refactor cho · code này nhìn khó chịu"
      </text>
    </g>

    {/* BEFORE state */}
    <g transform={`translate(${W / 2}, 540)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
      <text x={0} y={-40} fontSize={26} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ✅ TRƯỚC KHI REFACTOR
      </text>
      <text x={0} y={6} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
        Project ổn định · User happy
      </text>
      <text x={0} y={46} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        uptime 99.9% · không 1 lời than phiền
      </text>
    </g>

    {/* Quote bubble */}
    <g transform={`translate(${W / 2}, 820)`}>
      <text x={0} y={-100} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Đột nhiên vị này đứng dậy:
      </text>
      <rect x={-460} y={-50} width={920} height={120} rx={28} fill={C_L1_WHITE} />
      <text x={0} y={-2} fontSize={30} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Code này nhìn hơi khó chịu"
      </text>
      <text x={0} y={42} fontSize={20} fill="#3A2F50" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        — đạo hữu refactor
      </text>
    </g>

    {/* Timer */}
    <g transform={`translate(${W / 2}, 1140)`}>
      <rect x={-490} y={-50} width={980} height={100} rx={20} fill={BG_SURFACE} stroke={C_L5_ORANGE} strokeWidth={2} />
      <text x={0} y={14} fontSize={28} fill={C_L5_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⏳ 3 NGÀY SAU...
      </text>
    </g>

    {/* AFTER disaster */}
    <g transform={`translate(${W / 2}, 1390)`}>
      <rect x={-490} y={-110} width={980} height={220} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={-55} fontSize={28} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        💀 ENTIRE PRODUCTION
      </text>
      <text x={0} y={10} fontSize={48} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        SỤP ĐỔ
      </text>
      <text x={0} y={62} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        $ kubectl get pods — ALL CRASHED
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: LOẠI 2 AI BRO ============
const Slide3AiBro: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 2" name="ĐẠO HỮU AI BRO" color={C_L2_GREEN} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Mọi vấn đề · 1 đáp án · "DÙNG AI ĐI"
      </text>
    </g>

    {/* 4 question → AI rows */}
    <g transform={`translate(${W / 2}, 750)`}>
      {[
        { y: -180, q: "🐛 Bug?", a: "AI" },
        { y: -60, q: "🏛️ Architecture?", a: "AI" },
        { y: 60, q: "🚀 Startup?", a: "AI" },
        { y: 180, q: "💔 Tình yêu?", a: "AI" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-460} y={-44} width={920} height={88} rx={18} fill={BG_SURFACE} stroke={C_L2_GREEN} strokeWidth={2} />
          <text x={-420} y={14} fontSize={32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.q}
          </text>
          <text x={-50} y={16} fontSize={36} fill={GOLD} fontWeight={900}>→</text>
          <g transform={`translate(280, 0)`}>
            <rect x={-150} y={-30} width={300} height={60} rx={14} fill={C_L2_GREEN} />
            <text x={0} y={14} fontSize={28} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              🤖 {r.a}
            </text>
          </g>
        </g>
      ))}
    </g>

    {/* Conclusion */}
    <g transform={`translate(${W / 2}, 1430)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={C_L2_GREEN} strokeWidth={3} filter="url(#dhglow)" />
      <text x={0} y={-30} fontSize={26} fill={C_L2_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💡 LUẬT TỰ NHIÊN
      </text>
      <text x={0} y={30} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        1 ngày không nhắc AGI · đạo tâm bất ổn
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: LOẠI 3 FRIDAY DEPLOY ============
const Slide4FridayDeploy: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 3" name="DEPLOY THỨ SÁU" color={C_L3_BLUE} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Toàn tông môn cấm độ kiếp production thứ Sáu
      </text>
    </g>

    {/* Calendar mock */}
    <g transform={`translate(${W / 2}, 600)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={C_L3_BLUE} strokeWidth={3} />
      <text x={0} y={-80} fontSize={24} fill={C_L3_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📅 TUẦN TU LUYỆN
      </text>
      {/* Days row */}
      <g transform={`translate(0, 10)`}>
        {[
          { x: -360, d: "T2", c: JADE },
          { x: -216, d: "T3", c: JADE },
          { x: -72, d: "T4", c: JADE },
          { x: 72, d: "T5", c: JADE },
          { x: 216, d: "T6", c: C_L6_RED },
          { x: 360, d: "T7", c: TEXT_MUTE },
        ].map((day, i) => (
          <g key={i} transform={`translate(${day.x}, 0)`}>
            <rect x={-60} y={-50} width={120} height={100} rx={12} fill={BG_DEEP} stroke={day.c} strokeWidth={2} />
            <text x={0} y={-12} fontSize={24} fill={day.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{day.d}</text>
            <text x={0} y={24} fontSize={18} fill={day.c} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
              {day.d === "T6" ? "CẤM 🚫" : day.d === "T7" ? "nghỉ" : "OK"}
            </text>
          </g>
        ))}
      </g>
    </g>

    {/* But this one */}
    <g transform={`translate(${W / 2}, 950)`}>
      <text x={0} y={0} fontSize={28} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Nhưng vị này...
      </text>
    </g>

    {/* Clock 5PM Friday */}
    <g transform={`translate(${W / 2}, 1150)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={-75} fontSize={64} textAnchor="middle">🕔</text>
      <text x={0} y={-5} fontSize={32} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        Thứ Sáu · 17:00
      </text>
      <text x={0} y={40} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        $ git push --force
      </text>
      <text x={0} y={85} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        deploying to PROD...
      </text>
    </g>

    {/* Then vanished */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Sau đó biến mất khỏi Slack · không ai biết hắn còn sống
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: LOẠI 4 OVERENGINEERING ============
const Slide5Overengineering: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 4" name="OVERENGINEERING" color={C_L4_PURPLE} />

    {/* Task input */}
    <g transform={`translate(${W / 2}, 340)`}>
      <rect x={-450} y={-50} width={900} height={100} rx={16} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
      <text x={-400} y={6} fontSize={22} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ TASK:</text>
      <text x={-180} y={8} fontSize={28} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={700}>
        "làm login đơn giản"
      </text>
    </g>

    {/* Arrow down */}
    <g transform={`translate(${W / 2}, 480)`}>
      <text x={0} y={0} fontSize={42} fill={C_L4_PURPLE} textAnchor="middle" fontWeight={900}>↓</text>
    </g>

    {/* Result */}
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={26} fill={C_L4_PURPLE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        KẾT QUẢ KIẾN TRÚC:
      </text>
    </g>

    {/* 5 architecture badges */}
    <g transform={`translate(${W / 2}, 850)`}>
      {[
        { x: -270, y: -100, n: "MICROSERVICE", e: "🧩" },
        { x: 0, y: -100, n: "EVENT BUS", e: "📡" },
        { x: 270, y: -100, n: "KUBERNETES", e: "☸️" },
        { x: -135, y: 80, n: "DISTRIBUTED CACHE", e: "💾" },
        { x: 135, y: 80, n: "AI RECOMMENDATION", e: "🤖" },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${b.y})`}>
          <rect x={-130} y={-70} width={260} height={140} rx={16} fill={BG_SURFACE} stroke={C_L4_PURPLE} strokeWidth={2} />
          <text x={0} y={-15} fontSize={44} textAnchor="middle">{b.e}</text>
          <text x={0} y={35} fontSize={18} fill={C_L4_PURPLE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>{b.n}</text>
        </g>
      ))}
    </g>

    {/* Final punchline */}
    <g transform={`translate(${W / 2}, 1320)`}>
      <text x={0} y={-60} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Một cái login...
      </text>
      <rect x={-490} y={-10} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={50} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        🏯 Kiến trúc thống trị TAM GIỚI
      </text>
      <text x={0} y={100} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        ship sau 6 tháng · vẫn chưa xong
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: LOẠI 5 HỌP ĐẠO ============
const Slide6HopDao: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 5" name="ĐẠO HỮU HỌP ĐẠO" color={C_L5_ORANGE} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Không code · chỉ triệu tập hội nghị
      </text>
    </g>

    {/* Calendar packed mock */}
    <g transform={`translate(${W / 2}, 670)`}>
      <rect x={-490} y={-200} width={980} height={400} rx={20} fill={BG_SURFACE} stroke={C_L5_ORANGE} strokeWidth={3} />
      <text x={0} y={-160} fontSize={24} fill={C_L5_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📅 CALENDAR · Thứ Hai
      </text>
      {/* Meeting slots */}
      {[
        { y: -110, t: "09:00 — All-hands · 1 giờ", c: C_L6_RED },
        { y: -60, t: "10:00 — Sprint planning · 2 giờ", c: C_L5_ORANGE },
        { y: -10, t: "12:00 — Lunch meeting · 1.5 giờ", c: C_L5_ORANGE },
        { y: 40, t: "13:30 — 1-on-1 · 30 phút", c: C_L4_PURPLE },
        { y: 90, t: "14:00 — Tech sync · 1 giờ", c: C_L5_ORANGE },
        { y: 140, t: "15:00 — Architecture review", c: C_L6_RED },
      ].map((m, i) => (
        <g key={i} transform={`translate(0, ${m.y})`}>
          <rect x={-440} y={-22} width={880} height={44} rx={8} fill={BG_DEEP} stroke={m.c} strokeWidth={2} />
          <text x={-410} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {m.t}
          </text>
        </g>
      ))}
    </g>

    {/* Time waste comparison */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <text x={0} y={-100} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        1 task nhỏ · tốn bao lâu?
      </text>
      <g transform={`translate(-240, 0)`}>
        <rect x={-200} y={-60} width={400} height={120} rx={16} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
        <text x={0} y={-15} fontSize={22} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>THỰC TẾ</text>
        <text x={0} y={28} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>15 phút</text>
      </g>
      <g transform={`translate(240, 0)`}>
        <rect x={-200} y={-60} width={400} height={120} rx={16} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={3} />
        <text x={0} y={-15} fontSize={22} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SAU HỌP</text>
        <text x={0} y={28} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>3 canh giờ</text>
      </g>
    </g>

    {/* Punch */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Calendar kín đặc · thiên la địa võng
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: LOẠI 6 SILENT BUG ============
const Slide7SilentBug: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 6" name="ĐẠO HỮU SILENT BUG" color={C_L6_RED} />

    <g transform={`translate(${W / 2}, 350)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nhìn ngoài cực kỳ ôn hoà
      </text>
    </g>

    {/* Stats card */}
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={-110} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        📊 STATS PROFILE:
      </text>
      <g transform={`translate(-240, 0)`}>
        <rect x={-200} y={-60} width={400} height={120} rx={16} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
        <text x={0} y={-15} fontSize={20} fill={JADE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>COMMITS / WEEK</text>
        <text x={0} y={28} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>3</text>
      </g>
      <g transform={`translate(240, 0)`}>
        <rect x={-200} y={-60} width={400} height={120} rx={16} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={3} />
        <text x={0} y={-15} fontSize={20} fill={C_L6_RED} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>BUGS GÂY RA</text>
        <text x={0} y={28} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>47</text>
      </g>
    </g>

    {/* Mid */}
    <g transform={`translate(${W / 2}, 850)`}>
      <text x={0} y={0} fontSize={26} fill={C_L6_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Mỗi lần push code · production loạn
      </text>
    </g>

    {/* Famous quote */}
    <g transform={`translate(${W / 2}, 1170)`}>
      <text x={0} y={-160} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🎙️ CÂU NÓI HUYỀN THOẠI
      </text>
      <rect x={-490} y={-100} width={980} height={240} rx={32} fill={BG_SURFACE} stroke={C_L6_RED} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={-30} fontSize={26}>💬</text>
      <text x={0} y={20} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        "Máy em chạy
      </text>
      <text x={0} y={70} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        bình thường mà?"
      </text>
      <text x={0} y={115} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        — trước khi tắt máy ra về
      </text>
    </g>

    {/* Below */}
    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        DevOps thức 3 đêm fix bug · hắn ngủ ngon
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: LOẠI 7 XINH ĐẸP BIẾT CODE ============
const Slide8XinhDep: React.FC = () => (
  <g>
    <LoaiHeader loai="LOẠI 7" name="XINH ĐẸP BIẾT CODE" color={C_L7_PINK} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={C_L7_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        ⚠️ TỒN TẠI NGUY HIỂM NHẤT ⚠️
      </text>
    </g>

    {/* Female avatar */}
    <g transform={`translate(${W / 2}, 510)`}>
      <circle cx={0} cy={0} r={90} fill={BG_ELEVATED} stroke={C_L7_PINK} strokeWidth={4} filter="url(#dhglow)" />
      <text x={0} y={28} fontSize={96} fill={C_L7_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        Q
      </text>
      <text x={0} y={130} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
        @em_dev_xinh
      </text>
    </g>

    {/* Effects on nam tu */}
    <g transform={`translate(${W / 2}, 870)`}>
      <text x={0} y={-30} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Khi nàng xuất hiện · nam tu IT lập tức:
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1090)`}>
      {[
        { x: -240, y: -90, t: "🌅 Online sớm hơn" },
        { x: 240, y: -90, t: "💪 Chăm tập gym" },
        { x: -240, y: 30, t: "🌸 Dùng nước hoa" },
        { x: 240, y: 30, t: "⚡ Fix bug 3x" },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${b.y})`}>
          <rect x={-200} y={-44} width={400} height={88} rx={16} fill={BG_SURFACE} stroke={C_L7_PINK} strokeWidth={2} />
          <text x={0} y={14} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {b.t}
          </text>
        </g>
      ))}
    </g>

    {/* Velocity chart */}
    <g transform={`translate(${W / 2}, 1340)`}>
      <rect x={-490} y={-70} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={C_L7_PINK} strokeWidth={3} filter="url(#dhglow)" />
      <text x={0} y={-20} fontSize={26} fill={C_L7_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        📈 VELOCITY SPRINT
      </text>
      <text x={0} y={30} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        TĂNG GẤP 3 · KỶ LỤC TÔNG MÔN
      </text>
    </g>

    {/* CTA */}
    <g transform={`translate(${W / 2}, 1560)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        💬 Đạo hữu gặp LOẠI nào nhiều nhất?
      </text>
      <text x={0} y={36} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Comment + Follow nghe truyền kỳ tuần 🏯
      </text>
    </g>
  </g>
);

export const SlideCarouselTop7DaoHuu: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2Refactor />}
        {slideNum === 3 && <Slide3AiBro />}
        {slideNum === 4 && <Slide4FridayDeploy />}
        {slideNum === 5 && <Slide5Overengineering />}
        {slideNum === 6 && <Slide6HopDao />}
        {slideNum === 7 && <Slide7SilentBug />}
        {slideNum === 8 && <Slide8XinhDep />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
