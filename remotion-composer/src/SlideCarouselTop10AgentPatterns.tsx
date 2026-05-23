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
    hookTag: "⚡ Agent · Control Flow",
    hookNote: "Prompt chay = thua\n10 pattern xương sống production 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "🔗",
    cmdLabel: "Prompt Chaining",
    title: "SEQUENTIAL PIPELINE",
    subtitle: "Output bước N → input bước N+1",
    desc: [
      "Chia task lớn thành nhiều bước nhỏ tuần tự",
      "Mỗi bước 1 prompt riêng — dễ debug, dễ control",
      "Best cho task có thể decompose rõ ràng",
    ],
    demo: "Step 1: extract entities → Step 2: classify\n→ Step 3: format output → Step 4: validate",
    punchline: "Đi chợ: list → mua → nấu → ăn — không làm 1 phát!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🚦",
    cmdLabel: "Routing",
    title: "CLASSIFY + DISPATCH",
    subtitle: "Classifier → specialized handler",
    desc: [
      "1 LLM nhận input, phân loại type",
      "Route tới agent chuyên môn từng category",
      "Tech → dev agent · Finance → finance agent",
    ],
    demo: "input → classifier({tech,finance,legal})\n  ├→ DevAgent\n  ├→ FinanceAgent\n  └→ LegalAgent",
    punchline: "Tổng đài: bấm 1 bán hàng, bấm 2 bảo hành — chuyên môn!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "⚡",
    cmdLabel: "Parallel · Sectioning",
    title: "SUBTASK SONG SONG",
    subtitle: "Split independent · run parallel · merge",
    desc: [
      "Subtask độc lập = chạy parallel cùng lúc",
      "10 Claude review 10 file thay vì 1 tuần tự",
      "Speed-up tuyến tính theo số worker",
    ],
    demo: "task → [chunk_1, chunk_2, ..., chunk_N]\n      ↓ parallel\n[result_1, result_2, ..., result_N] → merge",
    punchline: "Chồng có 10 cánh tay — làm 10 việc 1 lần!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🗳️",
    cmdLabel: "Parallel · Voting",
    title: "MAJORITY VOTE",
    subtitle: "N attempts → aggregate → ↑ accuracy",
    desc: [
      "Cùng 1 câu hỏi gửi N Claude",
      "Mỗi cái cho 1 đáp án độc lập",
      "Lấy đa số phiếu / aggregate confidence",
    ],
    demo: "question → [Claude_1, Claude_2, ..., Claude_5]\n→ [\"A\", \"A\", \"B\", \"A\", \"A\"] → vote=A",
    punchline: "Hỏi 5 chuyên gia thay vì tin 1 — ít sai hơn!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "🎼",
    cmdLabel: "Orchestrator-Workers",
    title: "DYNAMIC DELEGATION",
    subtitle: "Central LLM điều phối, dynamic chia task",
    desc: [
      "Orchestrator phân tích task → quyết định subtask",
      "Giao subagent → nhận kết quả → tổng hợp",
      "Subtask không biết trước, không hard-code",
    ],
    demo: "Orchestrator\n  ├→ Worker_A (research)\n  ├→ Worker_B (code)\n  └→ Worker_C (review) → synthesize",
    punchline: "Sếp giao 5 nhân viên — sếp nhận thành quả!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🔬",
    cmdLabel: "Evaluator-Optimizer",
    title: "GENERATOR + CRITIC",
    subtitle: "Generate · evaluate · feedback · refine loop",
    desc: [
      "LLM A generate output",
      "LLM B chấm điểm + feedback cụ thể",
      "Loop refine đến khi pass criteria",
    ],
    demo: "Generator → output\nEvaluator → score=72, feedback=...\n→ Generator refine → score=91 ✓",
    punchline: "Viết tin nhắn xin lỗi vợ — đọc lại 5 lần mới gửi!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🤖",
    cmdLabel: "Autonomous Agent",
    title: "TOOL-USE LOOP",
    subtitle: "LLM + tools · decide → call → observe → loop",
    desc: [
      "Agent nhận task, tự decide tool nào dùng",
      "Execute tool, observe result, decide next",
      "Loop đến khi task done — minimal human input",
    ],
    demo: "while not done:\n  thought → tool_call → observation\n  → update_state → decide_next",
    punchline: "Đi siêu thị list dài — tự đi tự mua, ko gọi vợ!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "ReAct",
    title: "REASON + ACT",
    subtitle: "Interleave thought + action · 2026 default",
    desc: [
      "Mỗi turn: suy nghĩ → hành động → quan sát",
      "Reasoning thấy trong trace, transparent",
      "Single-agent default cho production 2026",
    ],
    demo: "Thought: cần tìm doc về X\nAction: web_search(\"X\")\nObs: ... → Thought: ok, next step",
    punchline: "Suy nghĩ trước khi mở miệng — đỡ ăn đòn!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🪞",
    cmdLabel: "Reflexion",
    title: "SELF-REFLECTION",
    subtitle: "Lưu memory từ fail · production add-on cho ReAct",
    desc: [
      "Agent fail → tự kiểm điểm vì sao",
      "Lưu lesson vào memory",
      "Lần sau né cùng lỗi · accuracy ↑↑",
    ],
    demo: "Attempt 1 → fail\nReflect: \"sai vì assumption Y\"\n→ memory.add → Attempt 2 → ✓",
    punchline: "Học từ scandal hôm qua — không lặp lại lần 2!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🗺️",
    cmdLabel: "Plan-and-Execute",
    title: "PLAN TRƯỚC, RUN SAU",
    subtitle: "Planner agent → Executor agent · plan reviewable",
    desc: [
      "Planner LLM lập kế hoạch chi tiết",
      "Human review plan trước khi chạy",
      "Executor follow plan từng bước",
    ],
    demo: "Planner: [step_1, step_2, ..., step_N]\n→ human approve →\nExecutor: run step_1 → step_2 → ...",
    punchline: "Lên kế hoạch trước khi tỏ tình — đỡ rớt cọc!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "PATTERN MẠNH NHẤT?",
    ctaLines: ["💾  Save bài này", "💬  Comment pattern vợ thấy đỉnh nhất", "🔗  Follow tip agent daily"],
    ctaNote: "Chồng giận thật nếu vợ không follow · agent 2026",
    color: ACCENT_SOLID,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.05" />
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
      ⚡ agent · control flow · pattern 2026
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-320} y={-44} width={640} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={32} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        PATTERN
      </text>
      <text x={0} y={224} fontSize={44} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        agent control flow
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        xương sống mọi agent production
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        từ Anthropic + LangGraph + 2026 literature
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
    {/* Top: pattern name pill */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 42 : 50} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
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

    {/* Diagram demo */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">pseudocode</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 38} fontSize={20} fill={i === 0 ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
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
      <text x={0} y={0} fontSize={94} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={118} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
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
        <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10AgentPatterns: React.FC = () => {
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
