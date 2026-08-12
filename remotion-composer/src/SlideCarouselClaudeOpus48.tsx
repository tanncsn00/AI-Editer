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

// Brand accents
const CLAUDE = "#D97757"; // Anthropic orange
const CLAUDE_BRIGHT = "#F0936E";
const OPENAI_COLOR = "#10A37F";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="cobg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={VIOLET} stopOpacity="0.20" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cobg2" cx="90%" cy="8%" r="50%">
        <stop offset="0%" stopColor={CLAUDE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cobg3" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="cogrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="comaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="cogm"><rect width={W} height={H} fill="url(#comaskg)" /></mask>
      <filter id="coglow">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#cogrid)" mask="url(#cogm)" />
    <rect width={W} height={H} fill="url(#cobg1)" />
    <rect width={W} height={H} fill="url(#cobg2)" />
    <rect width={W} height={H} fill="url(#cobg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ truyền kỳ giới ai · claude opus 4.8 · 2026
    </text>
  </g>
);

const Avatar: React.FC<{ letter: string; color: string; size: number }> = ({ letter, color, size }) => (
  <g>
    <circle cx={0} cy={0} r={size} fill={color} />
    <text x={0} y={size * 0.35} fontSize={size * 1.05} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
      {letter}
    </text>
  </g>
);

const SceneHeader: React.FC<{ tag: string; title: string; color: string }> = ({ tag, title, color }) => (
  <g transform={`translate(${W / 2}, 140)`}>
    <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={color} strokeWidth={4} />
    <g transform={`translate(-400, 0)`}>
      <rect x={-78} y={-40} width={156} height={80} rx={16} fill={color} />
      <text x={0} y={11} fontSize={26} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        {tag}
      </text>
    </g>
    <text x={-290} y={13} fontSize={(title || "").length > 22 ? 28 : 34} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
      {title}
    </text>
  </g>
);

// ============ SLIDE 1: HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 130)`}>
      <rect x={-360} y={-46} width={720} height={92} rx={46} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={14} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        🏯 TRUYỀN KỲ GIỚI AI · 2026
      </text>
    </g>

    <g transform={`translate(${W / 2}, 300)`}>
      <text x={0} y={0} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Canh ba · đêm 28 tháng 5 năm 2026
      </text>
    </g>

    {/* Claude orb */}
    <g transform={`translate(${W / 2}, 540)`}>
      <circle cx={0} cy={0} r={140} fill={BG_ELEVATED} stroke={CLAUDE} strokeWidth={5} filter="url(#coglow)" />
      <text x={0} y={42} fontSize={150} fill={CLAUDE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        C
      </text>
    </g>

    <g transform={`translate(${W / 2}, 760)`}>
      <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        CLAUDE OPUS 4.8
      </text>
    </g>

    {/* Mega title */}
    <g transform={`translate(${W / 2}, 920)`}>
      <text x={0} y={0} fontSize={110} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#coglow)">
        XUẤT THẾ
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1060)`}>
      <text x={0} y={0} fontSize={48} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#coglow)">
        CHẤN ĐỘNG TAM GIỚI AI
      </text>
    </g>

    {/* Identity card */}
    <g transform={`translate(${W / 2}, 1280)`}>
      <rect x={-490} y={-90} width={980} height={180} rx={20} fill={BG_SURFACE} stroke={CLAUDE} strokeWidth={3} />
      <text x={0} y={-34} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Anthropic chính thức thả ra
      </text>
      <text x={0} y={26} fontSize={34} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚔️ Một tôn đại năng mới của cốt đạo
      </text>
    </g>

    {/* Story preview */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Không phải chatbot war — mà là đại chiến thiên đạo AGI
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: KHÔNG PHẢI CHATBOT ============
const Slide2NotChatbot: React.FC = () => (
  <g>
    <SceneHeader tag="THIÊN CƠ" title="ĐÂY KHÔNG PHẢI CHATBOT" color={VIOLET} />

    <g transform={`translate(${W / 2}, 340)`}>
      <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Cùng một sự kiện · hai cách nhìn
      </text>
    </g>

    {/* Outsider view */}
    <g transform={`translate(${W / 2}, 600)`}>
      <rect x={-490} y={-150} width={980} height={300} rx={20} fill={BG_SURFACE} stroke={TEXT_MUTE} strokeWidth={3} />
      <text x={0} y={-95} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        👁️ NGƯỜI NGOÀI NHÌN VÀO
      </text>
      <text x={0} y={-20} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        "À, lại thêm
      </text>
      <text x={0} y={40} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        một model AI mới."
      </text>
      <text x={0} y={110} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        — chỉ là một bản cập nhật
      </text>
    </g>

    {/* VS */}
    <g transform={`translate(${W / 2}, 830)`}>
      <circle cx={0} cy={0} r={42} fill={BG_ELEVATED} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={12} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VS</text>
    </g>

    {/* Cultivator view */}
    <g transform={`translate(${W / 2}, 1090)`}>
      <rect x={-490} y={-160} width={980} height={320} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={4} filter="url(#coglow)" />
      <text x={0} y={-105} fontSize={26} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        ⚔️ KIẾM TU CÔNG NGHỆ ĐỀU HIỂU
      </text>
      <text x={0} y={-40} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Đây không còn là chatbot
      </text>
      <text x={0} y={36} fontSize={52} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#coglow)">
        ĐẠI CHIẾN
      </text>
      <text x={0} y={108} fontSize={38} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        tranh đoạt thiên đạo AGI
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1520)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Một bên thấy sản phẩm · một bên thấy thiên cơ
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: HONESTY ============
const Slide3Honesty: React.FC = () => (
  <g>
    <SceneHeader tag="ĐỘT PHÁ" title="HONESTY · ĐẠO TÂM" color={JADE} />

    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Không chỉ mạnh hơn — mà còn một thứ đáng sợ:
      </text>
    </g>

    {/* Big concept */}
    <g transform={`translate(${W / 2}, 470)`}>
      <text x={0} y={0} fontSize={96} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#coglow)">
        HONESTY
      </text>
    </g>

    {/* 3 traits */}
    <g transform={`translate(${W / 2}, 720)`}>
      {[
        { y: 0, t: "✓ Thành thật hơn rất nhiều" },
        { y: 90, t: "✓ Ít bịa hơn (ít ảo giác)" },
        { y: 180, t: "✓ Biết thừa nhận khi không chắc" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-460} y={-36} width={920} height={72} rx={14} fill={BG_SURFACE} stroke={JADE} strokeWidth={2} />
          <text x={-430} y={11} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
        </g>
      ))}
    </g>

    {/* Counter-cultivation */}
    <g transform={`translate(${W / 2}, 1080)`}>
      <rect x={-490} y={-80} width={980} height={160} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-22} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        ⚡ NGHỊCH THIÊN CẢI MỆNH
      </text>
      <text x={0} y={36} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
        càng mạnh · LLM càng dễ sinh tâm ma ảo giác
      </text>
    </g>

    {/* Two roads */}
    <g transform={`translate(${W / 2}, 1370)`}>
      <text x={0} y={-115} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Hai con đường khác nhau:
      </text>
      <g transform={`translate(-245, 0)`}>
        <rect x={-205} y={-60} width={410} height={120} rx={16} fill={BG_SURFACE} stroke={OPENAI_COLOR} strokeWidth={3} />
        <text x={0} y={-16} fontSize={24} fill={OPENAI_COLOR} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>OpenAI</text>
        <text x={0} y={26} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>"thông minh hơn?"</text>
      </g>
      <g transform={`translate(245, 0)`}>
        <rect x={-205} y={-60} width={410} height={120} rx={16} fill={BG_SURFACE} stroke={CLAUDE} strokeWidth={3} />
        <text x={0} y={-16} fontSize={24} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>Anthropic</text>
        <text x={0} y={26} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>"đáng tin hơn?"</text>
      </g>
    </g>

    <g transform={`translate(${W / 2}, 1560)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Không biết · nhưng vẫn trả lời như tổ sư chuyển thế
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: CODE ĐẠO ============
const Slide4CodeDao: React.FC = () => (
  <g>
    <SceneHeader tag="CỐT ĐẠO" title="DEV GIỚI PHÁT CUỒNG" color={CLAUDE} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Theo các tông môn thử nghiệm nội bộ
      </text>
    </g>

    {/* 4 capabilities */}
    <g transform={`translate(${W / 2}, 700)`}>
      {[
        { x: -245, y: -140, t: "🐞 Debug", s: "tốt hơn", c: JADE },
        { x: 245, y: -140, t: "🔁 Ít loop", s: "vô tận hơn", c: COSMIC },
        { x: -245, y: 60, t: "📋 Follow task", s: "dài tốt hơn", c: GOLD },
        { x: 245, y: 60, t: "🤖 Agent workflow", s: "ổn định hơn", c: CLAUDE },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${b.y})`}>
          <rect x={-225} y={-85} width={450} height={170} rx={18} fill={BG_SURFACE} stroke={b.c} strokeWidth={3} />
          <text x={0} y={-15} fontSize={34} fill={b.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{b.t}</text>
          <text x={0} y={38} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>{b.s}</text>
        </g>
      ))}
    </g>

    {/* Quote */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} filter="url(#coglow)" />
      <text x={0} y={-75} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💬 CÓ ĐẠI NĂNG CÒN NÓI
      </text>
      <text x={0} y={-5} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        "Model này bắt đầu biết tự kiểm tra
      </text>
      <text x={0} y={45} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        công pháp của chính mình
      </text>
      <text x={0} y={95} fontSize={34} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        trước khi xuất thủ."
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1520)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Tự phản tỉnh công pháp — cảnh giới mới của code đạo
      </text>
    </g>
  </g>
);

// ============ SLIDE 5: DYNAMIC WORKFLOW ============
const Slide5DynamicWorkflow: React.FC = () => (
  <g>
    <SceneHeader tag="TRẬN PHÁP" title="DYNAMIC WORKFLOW" color={COSMIC} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Một loại trận pháp mới của Anthropic
      </text>
    </g>

    {/* Diagram: 1 Claude -> many agents */}
    <g transform={`translate(${W / 2}, 560)`}>
      <circle cx={0} cy={-30} r={70} fill={CLAUDE} filter="url(#coglow)" />
      <text x={0} y={-15} fontSize={64} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>C</text>
      <text x={0} y={90} fontSize={24} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>Claude chủ tôn</text>
    </g>

    {/* fan-out lines + agents */}
    <g transform={`translate(${W / 2}, 880)`}>
      {[-340, -170, 0, 170, 340].map((x, i) => (
        <g key={i}>
          <line x1={x * 0.18} y1={-120} x2={x} y2={-10} stroke={COSMIC} strokeWidth={2} opacity={0.5} />
          <circle cx={x} cy={20} r={42} fill={BG_SURFACE} stroke={COSMIC} strokeWidth={3} />
          <text x={x} y={32} fontSize={34} textAnchor="middle">🤖</text>
        </g>
      ))}
      <text x={0} y={130} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        → hàng trăm phân thân agent chạy song song
      </text>
    </g>

    {/* Feature vs reality */}
    <g transform={`translate(${W / 2}, 1240)`}>
      <rect x={-490} y={-140} width={980} height={280} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-85} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Nghe qua tưởng chỉ là "feature"
      </text>
      <line x1={-380} y1={-50} x2={380} y2={-50} stroke={BORDER} strokeWidth={2} />
      <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Nhưng đây chính là bước tiến tới:
      </text>
      <text x={0} y={70} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#coglow)">
        AI TỰ VẬN HÀNH QUY MÔ LỚN
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1540)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Một tông môn agent · vận hành như đại trận
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: CLAUDE MYTHOS ============
const Slide6Mythos: React.FC = () => (
  <g>
    <SceneHeader tag="BÓNG MA" title="CLAUDE MYTHOS" color={DRAGON_RED} />

    <g transform={`translate(${W / 2}, 310)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        Phía sau Opus 4.8 · còn một bóng ma đáng sợ hơn
      </text>
    </g>

    {/* Codename */}
    <g transform={`translate(${W / 2}, 480)`}>
      <rect x={-360} y={-58} width={720} height={116} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={4} filter="url(#coglow)" />
      <text x={0} y={-8} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">MẬT DANH</text>
      <text x={0} y={34} fontSize={38} fill={DRAGON_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Project Glasswing</text>
    </g>

    {/* 3 fears */}
    <g transform={`translate(${W / 2}, 820)`}>
      <text x={0} y={-130} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Tin đồn nói rằng Mythos mạnh tới mức:
      </text>
      {[
        { y: -50, t: "🔓 Phát hiện lỗ hổng bảo mật cấp cao" },
        { y: 40, t: "🧠 Tự suy diễn chiến thuật cyber" },
        { y: 130, t: "⏸️ Anthropic phải trì hoãn vì lo ngại an toàn" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-470} y={-34} width={940} height={70} rx={14} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={2} />
          <text x={-440} y={11} fontSize={27} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
        </g>
      ))}
    </g>

    {/* Pháp thân */}
    <g transform={`translate(${W / 2}, 1310)`}>
      <rect x={-490} y={-130} width={980} height={260} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
      <text x={0} y={-70} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        💀 RẤT NHIỀU NGƯỜI BẮT ĐẦU HIỂU
      </text>
      <text x={0} y={0} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Opus 4.8 có thể chỉ là PHÁP THÂN
      </text>
      <text x={0} y={58} fontSize={32} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        trước khi chân thân AGI giáng thế
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1560)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Pháp thân lộ diện · chân thân còn ẩn trong vân vụ
      </text>
    </g>
  </g>
);

// ============ SLIDE 7: QUY LUẬT TÀN NHẪN ============
const Slide7QuyLuat: React.FC = () => (
  <g>
    <SceneHeader tag="QUY LUẬT" title="ĐIỀU ĐÁNG SỢ NHẤT" color={GOLD} />

    <g transform={`translate(${W / 2}, 320)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Không phải AI mạnh hơn con người
      </text>
      <text x={0} y={48} fontSize={30} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        Mà là AI bắt đầu tự biết:
      </text>
    </g>

    {/* 4 self-abilities */}
    <g transform={`translate(${W / 2}, 620)`}>
      {[
        { x: -245, y: -90, t: "🧩 Tự chia việc" },
        { x: 245, y: -90, t: "🔍 Tự kiểm tra" },
        { x: -245, y: 30, t: "🛠️ Tự sửa lỗi" },
        { x: 245, y: 30, t: "🤝 Phối hợp agent" },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${b.y})`}>
          <rect x={-225} y={-48} width={450} height={96} rx={16} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={12} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.t}</text>
        </g>
      ))}
      <text x={0} y={130} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        … phối hợp như một tông môn thật sự
      </text>
    </g>

    {/* Ruthless law */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <rect x={-490} y={-150} width={980} height={300} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={4} filter="url(#coglow)" />
      <text x={0} y={-95} fontSize={28} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        ⚠️ MỘT QUY LUẬT RẤT TÀN NHẪN
      </text>
      <text x={0} y={-25} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Ngươi có thể chưa dùng Claude
      </text>
      <text x={0} y={50} fontSize={36} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        Nhưng đối thủ của ngươi
      </text>
      <text x={0} y={108} fontSize={34} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
        đã dùng nó để tu luyện
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1540)`}>
      <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Kẻ chậm chân · sẽ bị bỏ lại trong đại kiếp
      </text>
    </g>
  </g>
);

// ============ SLIDE 8: ENDING CTA ============
const Slide8CTA: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 230)`}>
      <text x={0} y={0} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Code không còn khan hiếm.
      </text>
      <text x={0} y={62} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        Engineer thường — cũng vậy.
      </text>
    </g>

    {/* Only value */}
    <g transform={`translate(${W / 2}, 560)`}>
      <rect x={-490} y={-180} width={980} height={360} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} filter="url(#coglow)" />
      <text x={0} y={-135} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        🏯 THỨ DUY NHẤT CÒN GIÁ TRỊ
      </text>
      {[
        { y: -55, t: "🧭 Tư duy hệ thống", c: COSMIC },
        { y: 35, t: "⚖️ Khả năng ra quyết định", c: JADE },
        { y: 125, t: "🧘 Đạo tâm đủ vững — không bị AI nuốt", c: CLAUDE },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <rect x={-440} y={-34} width={880} height={70} rx={14} fill={BG_DEEP} stroke={r.c} strokeWidth={2} />
          <text x={0} y={11} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
        </g>
      ))}
    </g>

    {/* Big closer */}
    <g transform={`translate(${W / 2}, 900)`}>
      <text x={0} y={0} fontSize={34} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#coglow)">
        ⚔️ TAM GIỚI AI · VÒNG ĐẠI KIẾP MỚI
      </text>
    </g>

    {/* CTA buttons */}
    <g transform={`translate(${W / 2}, 1130)`}>
      {[
        "💬  Đạo hữu nghĩ sao? Comment bên dưới",
        "💾  Save · xem lại truyền kỳ",
        "🔗  Follow · truyền kỳ giới AI mỗi tuần",
      ].map((ln, i) => (
        <g key={i} transform={`translate(0, ${i * 100})`}>
          <rect x={-440} y={-40} width={880} height={80} rx={18} fill={BG_SURFACE} stroke={GOLD} strokeWidth={2} />
          <text x={0} y={12} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            {ln}
          </text>
        </g>
      ))}
    </g>

    <g transform={`translate(${W / 2}, 1560)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ⚡ Truyền kỳ giới AI · Claude Opus 4.8 xuất thế
      </text>
    </g>
  </g>
);

export const SlideCarouselClaudeOpus48: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2NotChatbot />}
        {slideNum === 3 && <Slide3Honesty />}
        {slideNum === 4 && <Slide4CodeDao />}
        {slideNum === 5 && <Slide5DynamicWorkflow />}
        {slideNum === 6 && <Slide6Mythos />}
        {slideNum === 7 && <Slide7QuyLuat />}
        {slideNum === 8 && <Slide8CTA />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
