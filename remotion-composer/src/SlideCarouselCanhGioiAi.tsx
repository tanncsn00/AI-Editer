import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

// Tu tiên theme — deep purple/black + gold
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
const CYAN_QI = "#5FE0D4";
const COSMIC = "#6B8DFF";
const DRAGON_RED = "#FF4747";

// Cảnh giới colors (progression)
const CG_COLORS = ["#666666", "#8B7355", "#C5A572", "#E85655", "#F4C04A", "#9D5BFF", "#FF4747"];

const TEXT_GOLD = "#F4C04A";
const TERM_BG = "#06030A";

const SLIDES = Array.from({ length: 10 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="cgbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={VIOLET} stopOpacity="0.20" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cgbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cgbg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="cggrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="cgmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="cggm"><rect width={W} height={H} fill="url(#cgmaskg)" /></mask>
      <filter id="goldglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#cggrid)" mask="url(#cggm)" />
    <rect width={W} height={H} fill="url(#cgbg1)" />
    <rect width={W} height={H} fill="url(#cgbg2)" />
    <rect width={W} height={H} fill="url(#cgbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ ai weekly · 7 cảnh giới · tu tiên dev
    </text>
  </g>
);

// Cảnh giới header
const LevelHeader: React.FC<{ lv: number; nameVN: string; nameCN: string; color: string; emoji: string }> = ({ lv, nameVN, nameCN, color, emoji }) => (
  <g transform={`translate(${W / 2}, 130)`}>
    <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
    <g transform={`translate(-410, 0)`}>
      <circle cx={0} cy={0} r={42} fill={color} />
      <text x={0} y={14} fontSize={36} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fill={BG_DEEP}>
        {lv}
      </text>
    </g>
    <text x={-340} y={-8} fontSize={22} fill={TEXT_SEC} fontFamily="'Inter', sans-serif" fontWeight={600}>
      CẢNH GIỚI {lv}
    </text>
    <text x={-340} y={26} fontSize={28} fill={color} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
      {emoji} {nameVN}
    </text>
    <g transform={`translate(440, 0)`}>
      <text x={0} y={16} fontSize={42} fill={GOLD} textAnchor="end" fontFamily="serif" fontWeight={900}>
        {nameCN}
      </text>
    </g>
  </g>
);

// ============ SLIDE 1: HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    {/* Top tag */}
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-380} y={-44} width={760} height={88} rx={44} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🐉 7 CẢNH GIỚI · DÙNG AI CODE
      </text>
    </g>

    {/* Mega title */}
    <g transform={`translate(${W / 2}, 290)`}>
      <text x={0} y={0} fontSize={88} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#goldglow)">
        90%
      </text>
      <text x={0} y={56} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        dev còn ở
      </text>
      <text x={0} y={108} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        "ĐÁY XÃ HỘI AI" 💀
      </text>
    </g>

    {/* 7-level ladder visualization */}
    <g transform={`translate(${W / 2}, 720)`}>
      {[
        { lv: 1, name: "Luyện Khí", emoji: "💀", color: CG_COLORS[0] },
        { lv: 2, name: "Trúc Cơ", emoji: "🐣", color: CG_COLORS[1] },
        { lv: 3, name: "Kết Đan", emoji: "☕", color: CG_COLORS[2] },
        { lv: 4, name: "Nguyên Anh", emoji: "🔥", color: CG_COLORS[3] },
        { lv: 5, name: "Hoá Thần", emoji: "👑", color: CG_COLORS[4] },
        { lv: 6, name: "Tiên Đế", emoji: "🌌", color: CG_COLORS[5] },
        { lv: 7, name: "Đại Đế", emoji: "🐉", color: CG_COLORS[6] },
      ].map((cg, i) => (
        <g key={i} transform={`translate(0, ${i * 90})`}>
          <rect x={-440} y={-32} width={880} height={64} rx={32} fill={BG_SURFACE} stroke={cg.color} strokeWidth={3} />
          <circle cx={-400} cy={0} r={24} fill={cg.color} />
          <text x={-400} y={9} fontSize={24} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            {cg.lv}
          </text>
          <text x={-340} y={10} fontSize={30} fontFamily="'Inter', sans-serif" fontWeight={500}>
            {cg.emoji}
          </text>
          <text x={-280} y={14} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            {cg.name}
          </text>
          {i === 0 && (
            <text x={420} y={10} fontSize={20} fill={TEXT_MUTE} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={600}>
              ← Đáy
            </text>
          )}
          {i === 6 && (
            <text x={420} y={10} fontSize={20} fill={GOLD} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={800}>
              ← Đỉnh 🏆
            </text>
          )}
        </g>
      ))}
    </g>

    {/* Bottom CTA */}
    <g transform={`translate(${W / 2}, 1480)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Đạo hữu ở cảnh giới nào?
      </text>
    </g>

    {/* Xem hết video */}
    <g transform={`translate(${W / 2}, 1640)`}>
      <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        🔍 Xem hết video — biết đáp án
      </text>
    </g>
  </g>
);

// ============ LV 1: LUYỆN KHÍ ============
const Slide2Lv1: React.FC = () => (
  <g>
    <LevelHeader lv={1} nameVN="LUYỆN KHÍ" nameCN="炼气" color={CG_COLORS[0]} emoji="💀" />

    {/* Big multiplier badge */}
    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="3">
        NĂNG SUẤT
      </text>
    </g>
    <g transform={`translate(${W / 2}, 540)`}>
      <text x={0} y={0} fontSize={150} fill={CG_COLORS[0]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-4">
        1.5x
      </text>
    </g>
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        tiết kiệm 30% thời gian
      </text>
    </g>

    {/* Workflow visual — chat box */}
    <g transform={`translate(${W / 2}, 870)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={20} fill={TERM_BG} stroke={CG_COLORS[0]} strokeWidth={2} />
      <text x={-470} y={-20} fontSize={22} fill={CG_COLORS[0]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔧 Tool stack
      </text>
      <text x={-470} y={20} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        ChatGPT web · Claude.ai · Gemini web
      </text>
      <text x={-470} y={50} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Browser → ask → copy → paste IDE → run
      </text>
    </g>

    {/* Workflow flow */}
    <g transform={`translate(${W / 2}, 1100)`}>
      <rect x={-490} y={-50} width={980} height={100} rx={16} fill={BG_ELEVATED} stroke={BORDER} strokeWidth={2} />
      <text x={0} y={10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
        💬 → 📋 → 📝 → 🐛 → 💬
      </text>
    </g>

    {/* Stats */}
    <g transform={`translate(${W / 2}, 1340)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <text x={0} y={-40} fontSize={28} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⚠️ 70% đồng đạo ở đây
      </text>
      <text x={0} y={4} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        AI không thấy code · không biết context
      </text>
      <text x={0} y={44} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Tu sĩ sơ khai — chưa nhập môn"
      </text>
    </g>
  </g>
);

// ============ LV 2: TRÚC CƠ ============
const Slide3Lv2: React.FC = () => (
  <g>
    <LevelHeader lv={2} nameVN="TRÚC CƠ" nameCN="筑基" color={CG_COLORS[1]} emoji="🐣" />

    {/* Big multiplier */}
    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="3">
        NĂNG SUẤT
      </text>
    </g>
    <g transform={`translate(${W / 2}, 540)`}>
      <text x={0} y={0} fontSize={150} fill={CG_COLORS[1]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-4">
        2-3x
      </text>
    </g>
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        1 ngày = 2 ngày tay
      </text>
    </g>

    {/* Tool stack */}
    <g transform={`translate(${W / 2}, 870)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={20} fill={TERM_BG} stroke={CG_COLORS[1]} strokeWidth={2} />
      <text x={-470} y={-20} fontSize={22} fill={CG_COLORS[1]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔧 Tool stack — chỉ AUTOCOMPLETE
      </text>
      <text x={-470} y={20} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        GitHub Copilot · Tabnine · Cursor Tab
      </text>
      <text x={-470} y={50} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Tab Tab Tab · ghost text suggestion
      </text>
    </g>

    {/* Tab demo */}
    <g transform={`translate(${W / 2}, 1100)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={16} fill={TERM_BG} stroke={CG_COLORS[1]} strokeWidth={2} />
      <text x={-470} y={-50} fontSize={20} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        // index.ts
      </text>
      <text x={-470} y={-12} fontSize={22} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        function calculateTax(amount: number) {`{`}
      </text>
      <text x={-450} y={20} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic">
        return amount * 0.1; // ghost suggest
      </text>
      <text x={-470} y={52} fontSize={22} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        {`}`}
      </text>
      <text x={400} y={68} fontSize={26} fill={CG_COLORS[1]} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
          [Tab ⇥]
      </text>
    </g>

    {/* Limit */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-490} y={-70} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
      <text x={0} y={-26} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        ⚠️ Suggest từng line · ko cross-file
      </text>
      <text x={0} y={18} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Đôi khi hallucinate API ko tồn tại
      </text>
      <text x={0} y={52} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Xây nền tảng · vừa nhập môn"
      </text>
    </g>
  </g>
);

// ============ LV 3: KẾT ĐAN ============
const Slide4Lv3: React.FC = () => (
  <g>
    <LevelHeader lv={3} nameVN="KẾT ĐAN" nameCN="结丹" color={CG_COLORS[2]} emoji="☕" />

    {/* Big multiplier */}
    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="3">
        NĂNG SUẤT
      </text>
    </g>
    <g transform={`translate(${W / 2}, 560)`}>
      <text x={0} y={0} fontSize={180} fill={CG_COLORS[2]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-4">
        5x
      </text>
    </g>
    <g transform={`translate(${W / 2}, 660)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        1 tuần tay = 1 ngày AI
      </text>
    </g>

    {/* Tool stack */}
    <g transform={`translate(${W / 2}, 870)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={TERM_BG} stroke={CG_COLORS[2]} strokeWidth={2} />
      <text x={-470} y={-50} fontSize={22} fill={CG_COLORS[2]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔧 Agent TRONG EDITOR
      </text>
      <text x={-470} y={-12} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        Cursor <tspan fill={CG_COLORS[2]} fontWeight={800}>Composer</tspan> · Windsurf <tspan fill={CG_COLORS[2]} fontWeight={800}>Cascade</tspan>
      </text>
      <text x={-470} y={24} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        Cline · Copilot <tspan fill={CG_COLORS[2]} fontWeight={800}>Workspace</tspan>
      </text>
      <text x={-470} y={60} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Cmd+I · multi-file edit · tạo file mới · refactor
      </text>
    </g>

    {/* Diff view mock */}
    <g transform={`translate(${W / 2}, 1190)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={16} fill={TERM_BG} stroke={CG_COLORS[2]} strokeWidth={2} />
      <text x={-470} y={-50} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
        diff · 3 files changed
      </text>
      <text x={-470} y={-12} fontSize={22} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        + auth.ts · NEW · 142 lines
      </text>
      <text x={-470} y={20} fontSize={22} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        + middleware.ts · +28 -4
      </text>
      <text x={-470} y={52} fontSize={22} fill={CRIMSON} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ~ index.ts · refactor router
      </text>
    </g>

    {/* Limit */}
    <g transform={`translate(${W / 2}, 1440)`}>
      <rect x={-490} y={-70} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
      <text x={0} y={-22} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        👀 Đa số senior dừng ở đây
      </text>
      <text x={0} y={22} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Ko terminal · ko git commit auto · approve diff tay
      </text>
      <text x={0} y={56} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Đan điền ngưng tụ Kim Đan"
      </text>
    </g>
  </g>
);

// ============ LV 4: NGUYÊN ANH ============
const Slide5Lv4: React.FC = () => (
  <g>
    <LevelHeader lv={4} nameVN="NGUYÊN ANH" nameCN="元婴" color={CG_COLORS[3]} emoji="🔥" />

    {/* Big multiplier */}
    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="3">
        NĂNG SUẤT
      </text>
    </g>
    <g transform={`translate(${W / 2}, 560)`}>
      <text x={0} y={0} fontSize={170} fill={CG_COLORS[3]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-4">
        10x
      </text>
    </g>
    <g transform={`translate(${W / 2}, 660)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        1 dev = team 10 người
      </text>
    </g>

    {/* Tool stack */}
    <g transform={`translate(${W / 2}, 870)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={TERM_BG} stroke={CG_COLORS[3]} strokeWidth={2} />
      <text x={-470} y={-40} fontSize={22} fill={CG_COLORS[3]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔧 CLI Agent · autonomous
      </text>
      <text x={-470} y={0} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
        Claude Code · Codex CLI · Aider · Goose
      </text>
      <text x={-470} y={32} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        Terminal first · bash thật · git commit thật
      </text>
      <text x={-470} y={62} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        1M token context · Plan mode + auto-accept
      </text>
    </g>

    {/* Terminal mock */}
    <g transform={`translate(${W / 2}, 1170)`}>
      <rect x={-490} y={-100} width={980} height={200} rx={16} fill={TERM_BG} stroke={CG_COLORS[3]} strokeWidth={2} />
      <circle cx={-470} cy={-74} r={6} fill="#FF5F56" />
      <circle cx={-448} cy={-74} r={6} fill="#FFBD2E" />
      <circle cx={-426} cy={-74} r={6} fill="#27C93F" />
      <text x={-406} y={-68} fontSize={16} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">claude-code · plan mode</text>
      {[
        { l: "$ claude --plan 'fix all auth bugs'", c: JADE },
        { l: "→ [Plan] Read 47 files in /src", c: CG_COLORS[3] },
        { l: "→ [Plan] Found 12 issues across 8 files", c: CG_COLORS[3] },
        { l: "→ [Auto-accept] Fixing 12 bugs...", c: GOLD },
        { l: "✓ All bugs fixed · 14 commits pushed", c: JADE },
      ].map((r, i) => (
        <text key={i} x={-470} y={-30 + i * 28} fontSize={18} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
          {r.l}
        </text>
      ))}
    </g>

    {/* Stats */}
    <g transform={`translate(${W / 2}, 1440)`}>
      <rect x={-490} y={-70} width={980} height={140} rx={20} fill={BG_SURFACE} stroke={JADE} strokeWidth={3} />
      <text x={0} y={-22} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        🏆 Claude Code · SWE-bench 80.8%
      </text>
      <text x={0} y={22} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        #1 ranking · LogRocket Feb 2026
      </text>
      <text x={0} y={56} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Phôi thai sinh ý thức riêng"
      </text>
    </g>
  </g>
);

// ============ LV 5: HOÁ THẦN ⭐ ============
const Slide6Lv5: React.FC = () => (
  <g>
    <LevelHeader lv={5} nameVN="HOÁ THẦN ⭐" nameCN="化神" color={CG_COLORS[4]} emoji="👑" />

    {/* Multiplier */}
    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={110} fill={CG_COLORS[4]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#goldglow)">
        20-30x
      </text>
      <text x={0} y={50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        1 sprint 2 tuần = 1 ngày
      </text>
    </g>

    {/* File tree .claude/ */}
    <g transform={`translate(${W / 2}, 740)`}>
      <rect x={-490} y={-260} width={980} height={520} rx={16} fill={TERM_BG} stroke={CG_COLORS[4]} strokeWidth={3} />
      <circle cx={-470} cy={-234} r={6} fill="#FF5F56" />
      <circle cx={-448} cy={-234} r={6} fill="#FFBD2E" />
      <circle cx={-426} cy={-234} r={6} fill="#27C93F" />
      <text x={-406} y={-228} fontSize={16} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">~/my-project/.claude</text>
      {[
        { l: "📁 .claude/", c: GOLD },
        { l: "  📁 agents/        # subagent custom roles", c: TEXT_PRI },
        { l: "    ├── reviewer.md", c: TEXT_SEC },
        { l: "    ├── tester.md", c: TEXT_SEC },
        { l: "  📁 skills/        # domain knowledge", c: TEXT_PRI },
        { l: "    ├── react-patterns/", c: TEXT_SEC },
        { l: "    ├── api-conventions/", c: TEXT_SEC },
        { l: "  📁 commands/      # /slash commands", c: TEXT_PRI },
        { l: "  📁 hooks/         # PreToolUse · PostToolUse", c: TEXT_PRI },
        { l: "  📁 plugins/       # marketplace plugins", c: TEXT_PRI },
        { l: "  📄 settings.json  # model · permissions", c: GOLD },
        { l: "📄 CLAUDE.md       # project rules ⭐", c: GOLD },
        { l: "📄 .mcp.json       # MCP servers", c: GOLD },
      ].map((row, i) => (
        <text key={i} x={-470} y={-190 + i * 33} fontSize={18} fill={row.c} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
          {row.l}
        </text>
      ))}
    </g>

    {/* Bottom */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-490} y={-60} width={980} height={120} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-10} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⭐ STEP QUAN TRỌNG NHẤT
      </text>
      <text x={0} y={26} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Luyện thần thức riêng · bần đạo đang dùng
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1580)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Nguyên anh ngưng kết nguyên thần"
      </text>
    </g>
  </g>
);

// ============ LV 6: TIÊN ĐẾ ============
const Slide7Lv6: React.FC = () => (
  <g>
    <LevelHeader lv={6} nameVN="TIÊN ĐẾ" nameCN="仙帝" color={CG_COLORS[5]} emoji="🌌" />

    {/* Multiplier */}
    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={140} fill={CG_COLORS[5]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#goldglow)">
        50x
      </text>
      <text x={0} y={50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        1 tuần research = 1 buổi sáng
      </text>
    </g>

    {/* RAG flow diagram */}
    <g transform={`translate(${W / 2}, 740)`}>
      <rect x={-490} y={-180} width={980} height={360} rx={16} fill={TERM_BG} stroke={CG_COLORS[5]} strokeWidth={3} />

      {/* Step 1: Embed */}
      <g transform={`translate(-380, -100)`}>
        <rect x={-90} y={-40} width={180} height={80} rx={12} fill={BG_ELEVATED} stroke={JADE} strokeWidth={2} />
        <text x={0} y={-6} fontSize={32} textAnchor="middle">📚</text>
        <text x={0} y={28} fontSize={18} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Sources
        </text>
      </g>

      <text x={-240} y={-92} fontSize={40} fill={GOLD} textAnchor="middle" fontWeight={900}>→</text>

      <g transform={`translate(-100, -100)`}>
        <rect x={-90} y={-40} width={180} height={80} rx={12} fill={BG_ELEVATED} stroke={CG_COLORS[5]} strokeWidth={2} />
        <text x={0} y={-6} fontSize={32} textAnchor="middle">🧬</text>
        <text x={0} y={28} fontSize={18} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Embed
        </text>
      </g>

      <text x={40} y={-92} fontSize={40} fill={GOLD} textAnchor="middle" fontWeight={900}>→</text>

      <g transform={`translate(180, -100)`}>
        <rect x={-90} y={-40} width={180} height={80} rx={12} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={2} />
        <text x={0} y={-6} fontSize={32} textAnchor="middle">🗄️</text>
        <text x={0} y={28} fontSize={18} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Vector DB
        </text>
      </g>

      <text x={334} y={-92} fontSize={40} fill={GOLD} textAnchor="middle" fontWeight={900}>→</text>

      <g transform={`translate(420, -100)`}>
        <circle cx={0} cy={0} r={48} fill={CG_COLORS[5]} />
        <text x={0} y={-3} fontSize={16} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>AI</text>
        <text x={0} y={18} fontSize={16} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Query</text>
      </g>

      {/* Stack detail */}
      <text x={-470} y={50} fontSize={20} fill={CG_COLORS[5]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔧 Vector DB: Pinecone · Chroma · Qdrant · pgvector
      </text>
      <text x={-470} y={85} fontSize={20} fill={CG_COLORS[5]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ✂️ Chunking: sliding window · tree-sitter code-aware
      </text>
      <text x={-470} y={120} fontSize={20} fill={CG_COLORS[5]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🔍 Hybrid search: BM25 + vector + reranker
      </text>
      <text x={-470} y={155} fontSize={20} fill={TEXT_MUTE} fontFamily="'Inter', sans-serif" fontWeight={500}>
        📥 Sources: codebase · docs · tickets · Slack history
      </text>
    </g>

    {/* Use case */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={CG_COLORS[5]} strokeWidth={3} />
      <text x={0} y={-30} fontSize={24} fill={CG_COLORS[5]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💡 AI biết pattern dự án của đạo hữu
      </text>
      <text x={0} y={10} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Hỏi: "Tại sao team chọn JWT thay session?"
      </text>
      <text x={0} y={42} fontSize={20} fill={JADE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        → AI tra ADR doc cũ · trả lời chính xác
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1530)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Siêu phàm nhập thánh"
      </text>
    </g>
  </g>
);

// ============ LV 7: ĐẠI ĐẾ 🏆 ============
const Slide8Lv7: React.FC = () => (
  <g>
    <LevelHeader lv={7} nameVN="ĐẠI ĐẾ 🏆" nameCN="大帝" color={CG_COLORS[6]} emoji="🐉" />

    {/* Multiplier */}
    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={150} fill={CG_COLORS[6]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#goldglow)">
        100x
      </text>
      <text x={0} y={50} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Team agent 24/7 không ngủ
      </text>
    </g>

    {/* Multi-agent pipeline */}
    <g transform={`translate(${W / 2}, 780)`}>
      <rect x={-490} y={-200} width={980} height={400} rx={16} fill={TERM_BG} stroke={CG_COLORS[6]} strokeWidth={3} />
      <text x={-470} y={-160} fontSize={20} fill={CG_COLORS[6]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🤖 MULTI-AGENT PIPELINE
      </text>

      {/* Agent nodes */}
      {[
        { x: -360, y: -80, label: "Planner", desc: "phân chia", color: COSMIC, emoji: "🎯" },
        { x: -120, y: -80, label: "Worker × N", desc: "parallel", color: JADE, emoji: "👷" },
        { x: 120, y: -80, label: "Reviewer", desc: "code review", color: GOLD, emoji: "🔍" },
        { x: 360, y: -80, label: "Tester", desc: "viết test", color: VIOLET, emoji: "🧪" },
      ].map((node, i) => (
        <g key={i} transform={`translate(${node.x}, ${node.y})`}>
          <circle cx={0} cy={0} r={50} fill={BG_ELEVATED} stroke={node.color} strokeWidth={3} />
          <text x={0} y={-2} fontSize={28} textAnchor="middle">{node.emoji}</text>
          <text x={0} y={26} fontSize={12} fill={node.color} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            {node.label}
          </text>
          <text x={0} y={75} fontSize={16} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            {node.desc}
          </text>
          {i < 3 && (
            <text x={120} y={5} fontSize={32} fill={GOLD} textAnchor="middle">→</text>
          )}
        </g>
      ))}

      {/* Stack list */}
      <text x={-470} y={40} fontSize={18} fill={CG_COLORS[6]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🚇 MCP tunnels → private network
      </text>
      <text x={-470} y={70} fontSize={18} fill={CG_COLORS[6]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        🛡️ Self-hosted sandbox in VPC
      </text>
      <text x={-470} y={100} fontSize={18} fill={CG_COLORS[6]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ⚙️ Orchestration: LangGraph · CrewAI · AutoGen
      </text>
      <text x={-470} y={130} fontSize={18} fill={CG_COLORS[6]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        📊 Observability: Langfuse · Helicone
      </text>
      <text x={-470} y={160} fontSize={18} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
        🏢 Managed Agents (Anthropic platform)
      </text>
    </g>

    {/* Stats */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} />
      <text x={0} y={-30} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        🌍 50% code thế giới 2026
      </text>
      <text x={0} y={10} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Multi-agent autonomous = standard enterprise
      </text>
      <text x={0} y={42} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        "Chí tôn vô địch · phi thăng thành tiên"
      </text>
    </g>
  </g>
);

// ============ SLIDE 9: INSIGHT ============
const Slide9Insight: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-360} y={-46} width={720} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        🎯 ĐẠO HỮU NÊN PHÁ QUAN TỚI ĐÂU?
      </text>
    </g>

    {/* 3-role table */}
    <g transform={`translate(${W / 2}, 600)`}>
      {[
        { role: "🧙 Solo dev", target: "Kết Đan → Hoá Thần", emoji: "☕ → 👑", color: CG_COLORS[4] },
        { role: "🏯 Startup team", target: "Hoá Thần → Tiên Đế", emoji: "👑 → 🌌", color: CG_COLORS[5] },
        { role: "🏛️ Enterprise", target: "Tiên Đế → Đại Đế", emoji: "🌌 → 🐉", color: CG_COLORS[6] },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${i * 200})`}>
          <rect x={-460} y={-80} width={920} height={160} rx={20} fill={BG_SURFACE} stroke={r.color} strokeWidth={3} />
          <text x={-440} y={-30} fontSize={36} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            {r.role}
          </text>
          <text x={-440} y={20} fontSize={28} fill={r.color} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            target: {r.target}
          </text>
          <text x={420} y={10} fontSize={64} textAnchor="end">{r.emoji}</text>
        </g>
      ))}
    </g>

    {/* Note */}
    <g transform={`translate(${W / 2}, 1450)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
      <text x={0} y={-40} fontSize={28} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⚠️ Đừng SKIP cảnh giới
      </text>
      <text x={0} y={4} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Mỗi cảnh giới cần thời gian phá quan
      </text>
      <text x={0} y={42} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
        Luyện Khí → Hoá Thần ~6 tháng nếu chịu học
      </text>
    </g>
  </g>
);

// ============ SLIDE 10: CTA ============
const Slide10CTA: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={64} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
        ĐẠO HỮU
      </text>
      <text x={0} y={80} fontSize={84} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#goldglow)">
        CẢNH GIỚI MẤY?
      </text>
    </g>

    {/* CTA buttons */}
    <g transform={`translate(${W / 2}, 950)`}>
      {[
        "💬  Comment cảnh giới của đạo hữu",
        "💾  Save video · xem khi muốn phá quan",
        "🔗  Follow bần đạo · tutorial mỗi cảnh giới",
      ].map((ln, i) => (
        <g key={i} transform={`translate(0, ${i * 130})`}>
          <rect x={-460} y={-48} width={920} height={96} rx={18} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
          <text x={0} y={14} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            {ln}
          </text>
        </g>
      ))}
    </g>

    {/* Bottom note */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={CG_COLORS[6]} strokeWidth={3} />
      <text x={0} y={-30} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Gửi đồng đạo dev · biết nhau ở cảnh giới nào
      </text>
      <text x={0} y={14} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Tutorial cụ thể mỗi cảnh giới · weekly
      </text>
      <text x={0} y={50} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        💀 → 🐣 → ☕ → 🔥 → 👑 → 🌌 → 🐉
      </text>
    </g>
  </g>
);

export const SlideCarouselCanhGioiAi: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2Lv1 />}
        {slideNum === 3 && <Slide3Lv2 />}
        {slideNum === 4 && <Slide4Lv3 />}
        {slideNum === 5 && <Slide5Lv4 />}
        {slideNum === 6 && <Slide6Lv5 />}
        {slideNum === 7 && <Slide7Lv6 />}
        {slideNum === 8 && <Slide8Lv7 />}
        {slideNum === 9 && <Slide9Insight />}
        {slideNum === 10 && <Slide10CTA />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
