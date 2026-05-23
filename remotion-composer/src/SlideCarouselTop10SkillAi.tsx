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
    hookTag: "⚡ AI ERA · 2026",
    hookNote: "Cũ chết · mới sống · không học = tụt hậu 2 năm\ndev + knowledge worker · career skill 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "✍️",
    cmdLabel: "Prompt Engineering",
    title: "PROMPT CẤU TRÚC",
    subtitle: "system + context + constraint + output",
    desc: [
      "Prompt chay = dev cũ · lương cũ",
      "Structured prompt = dev mới · lương 2-3x",
      "Pattern verified eng FAANG/Anthropic",
    ],
    demo: "system: bạn là senior reviewer\ncontext: codebase X\nconstraint: tối đa 50 LOC\noutput: diff + reasoning",
    punchline: "Prompt structured = đầu vào chuẩn = output chuẩn!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "Context Engineering",
    title: "FEED AI ĐÚNG CONTEXT",
    subtitle: "RAG + memory + retrieval pattern",
    desc: [
      "Token limit không phải vấn đề nữa",
      "Context tốt = output tốt · model nào cũng vậy",
      "RAG vector + memory persist + retrieval smart",
    ],
    demo: "❌ Stuff full context → lost-in-middle\n✓ RAG retrieve top-K + memory MCP",
    punchline: "Context engineering > prompt engineering trong 2026!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🔍",
    cmdLabel: "Critical Thinking",
    title: "VERIFY · ĐỪNG TIN MÙ",
    subtitle: "AI bịa code/fact/API endpoint",
    desc: [
      "AI hallucinate → verify từng output",
      "Filter sự thật quan trọng hơn biết code",
      "Trust but verify · luôn",
    ],
    demo: "❌ accept Claude code → ship prod\n✓ test + types + lint + manual review",
    punchline: "Kỹ năng filter sự thật = competitive edge!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🧩",
    cmdLabel: "Tool Composition",
    title: "LEGO MINDSET",
    subtitle: "Chain MCP + skill + tool + subagent",
    desc: [
      "Mỗi component đơn giản — combine ra phức tạp",
      "Không build monolith — compose nhỏ",
      "Workflow scale: agent + tool + memory + RAG",
    ],
    demo: "MCP(browser) + skill(brainstorm) +\nsubagent(reviewer) + tool(exec)\n→ workflow auto research + ship",
    punchline: "Lego > monolith · 2026 mindset!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🤖",
    cmdLabel: "Agent Design",
    title: "CONTROL FLOW PATTERN",
    subtitle: "Routing · chaining · orchestrator · ReAct",
    desc: [
      "10 pattern xương sống agent production",
      "Single-agent: ReAct + Reflexion default 2026",
      "Multi-agent: orchestrator-workers enterprise",
    ],
    demo: "Single: ReAct + Reflexion\nMulti: orchestrator-workers + plan-execute\n→ production-grade agent",
    punchline: "Học pattern trước, code sau!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "✨",
    cmdLabel: "Vibe Coding",
    title: "SHIP MVP KO DEEP CODE",
    subtitle: "Founder VN tự build · ko thuê dev $30k",
    desc: [
      "Brief Claude · iterate · ship trong 1 tuần",
      "Không cần master language sâu",
      "Skill mới — democratize software building",
    ],
    demo: "\"Build chatbot RAG cho công ty\"\n→ 1 tuần · 500 dòng · ship beta\n✓ founder không phải dev cũng làm được",
    punchline: "Founder + vibe coding = unfair advantage!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "💰",
    cmdLabel: "Cost Economics",
    title: "OPUS · HAIKU · CACHE",
    subtitle: "Pick model + cache đúng = -80% cost",
    desc: [
      "Opus: heavy reasoning · $15/M input",
      "Haiku: simple task · $1/M input (5x cheap)",
      "Prompt cache: -90% input cost",
    ],
    demo: "Solo Opus: $1500/month heavy\nMix Haiku 80% + cache: $400/month\n→ save 73% · founder bền vững",
    punchline: "Founder serious phải master cost!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🔄",
    cmdLabel: "AI-Native Process",
    title: "RE-ARCHITECT QUY TRÌNH",
    subtitle: "Đừng add AI vô cũ — design lại từ đầu",
    desc: [
      "Quy trình cũ: 10 bước manual → add AI = vẫn 10",
      "AI-native: re-design từ ground-up · còn 3",
      "Distinguishes pro vs amateur thời này",
    ],
    demo: "❌ Add AI vô spreadsheet workflow cũ\n✓ Redesign: AI ingests + decides + acts\n→ 10 steps → 3 steps",
    punchline: "Re-architect > automate cái cũ!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "📢",
    cmdLabel: "Build-in-Public",
    title: "PERSONAL BRAND",
    subtitle: "Share công khai · network > skill",
    desc: [
      "Người không biết bạn tồn tại = vô hình",
      "Share progress, learning, fail công khai",
      "Network effect compound theo thời gian",
    ],
    demo: "Share weekly: ship · lesson · fail\n→ audience trust → DM inbound\n→ client/job/cofounder tự đến",
    punchline: "Brand > skill trong AI era · serious!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "📚",
    cmdLabel: "Continuous Learning",
    title: "AI UPDATE THEO TUẦN",
    subtitle: "Đọc release note · follow eng tweet",
    desc: [
      "AI release model + feature weekly",
      "Đứng yên = tụt hậu · không exception",
      "Follow Anthropic eng + công nghệ news",
    ],
    demo: "Daily: scroll Twitter eng AI\nWeekly: đọc release note + thử new\nMonthly: build 1 thing new",
    punchline: "Curiosity > knowledge cũ — luôn!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cta",
    ctaTitle: "KỸ NĂNG NÀO YẾU?",
    ctaLines: ["💾  Save bài này", "💬  Comment skill bạn yếu nhất", "🔗  Follow tip career AI daily"],
    ctaNote: "Cũ chết · mới sống · 2026 · save bài cùng học",
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
      ⚡ ai era · skill 2026 · career
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-280} y={-44} width={560} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={100} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        KỸ NĂNG
      </text>
      <text x={0} y={224} fontSize={54} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        MỚI · AI era 2026
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Cũ chết · mới sống
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        không học là tụt hậu hai năm
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
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-440} y={-50} width={880} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 42 : 50} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={180} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 54 : (s.title || "").length > 14 ? 64 : 74} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

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

    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">pattern / example</text>
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
        <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10SkillAi: React.FC = () => {
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
