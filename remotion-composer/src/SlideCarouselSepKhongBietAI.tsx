import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#08070D";
const BG_SURFACE = "#13121C";
const BG_ELEVATED = "#1A1923";
const BORDER = "#2A2735";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9BA0B5";
const TEXT_MUTE = "#5A5570";
const RED_CRIT = "#FF4747";
const RED_DEEP = "#C81C1C";
const ORANGE_WARN = "#FF8A3D";
const YELLOW_CAUTION = "#FFD23D";
const GREEN_OK = "#3FD68A";
const BLUE_INFO = "#5B8CFF";
const GOLD = "#F4B860";

type Slide = {
  kind: "hook" | "data" | "list" | "compare" | "opp" | "cta";
  icon?: string;
  cmdLabel?: string;
  title?: string;
  subtitle?: string;
  bigNumber?: string;
  bigNumberLabel?: string;
  desc?: string[];
  demo?: string;
  punchline?: string;
  color?: string;
  hookTag?: string;
  hookBig?: string;
  hookSub?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
  compareLeft?: { label: string; items: string[]; color: string };
  compareRight?: { label: string; items: string[]; color: string };
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "🔒 BÁO CÁO McKINSEY · 2026",
    hookBig: "95%",
    hookSub: "AI doanh nghiệp FAIL",
    hookNote: "MIT confirm · Gartner đồng ý\nBóc trần trong 2 phút",
    color: RED_CRIT,
  },
  {
    kind: "data",
    icon: "📊",
    cmdLabel: "Sự thật #1 · McKinsey",
    title: "CHƯA CÓ LỘ TRÌNH",
    subtitle: "Sếp thấy hot, bắt nhân viên dùng — nhưng để làm gì?",
    bigNumber: "75%",
    bigNumberLabel: "công ty lớn KHÔNG có roadmap AI rõ ràng",
    desc: [
      "Source: McKinsey survey 500+ enterprise 2026",
      "Sếp đăng LinkedIn 'we adopt AI'",
      "Dưới đất nhân viên copy paste ChatGPT lén",
    ],
    punchline: "Giống crush bạn chưa quyết dứt khoát — vừa muốn vừa ko biết bắt đầu!",
    color: ORANGE_WARN,
  },
  {
    kind: "data",
    icon: "📉",
    cmdLabel: "Sự thật #2 · KPI",
    title: "KHÔNG ĐO ĐƯỢC ROI",
    subtitle: "Chi tiền cho ChatGPT — không biết để làm gì",
    bigNumber: "82%",
    bigNumberLabel: "không track chỉ số hiệu quả AI",
    desc: [
      "Không biết tiết kiệm bao nhiêu giờ",
      "Không biết tăng doanh thu bao nhiêu",
      "Không có baseline so sánh trước/sau",
    ],
    punchline: "Tiền cứ chi · kết quả không ai dám hỏi!",
    color: YELLOW_CAUTION,
  },
  {
    kind: "data",
    icon: "💀",
    cmdLabel: "Đỉnh điểm · MIT 2025",
    title: "95% PILOT THẤT BẠI",
    subtitle: "Không đem lại lợi nhuận đo được",
    bigNumber: "95%",
    bigNumberLabel: "GenAI enterprise pilot FAIL hoàn toàn",
    desc: [
      "Source: MIT NANDA report 2025",
      "Gartner: 40% agent project HỦY đến 2027",
      "60% AI hủy chỉ vì data không sẵn sàng",
    ],
    punchline: "Hype 1 đường · production 1 nẻo!",
    color: RED_CRIT,
  },
  {
    kind: "list",
    icon: "🚧",
    cmdLabel: "Vì sao thất bại?",
    title: "3 LÝ DO CHÍNH",
    subtitle: "Không phải vì AI yếu — vì cách triển khai sai",
    desc: [
      "1️⃣  Thiếu kỹ thuật — demo đẹp, production gãy",
      "2️⃣  Data dirty — 60% hủy vì data không sạch",
      "3️⃣  Mục tiêu mơ hồ — 'phải có AI' nhưng giải vấn đề gì?",
    ],
    demo: "Bug phổ biến:\n→ Agent crash khi gặp ambiguity\n→ Tool integration fragile\n→ Maintenance ăn 30-50% budget\n→ Schema drift sau mỗi update LLM",
    punchline: "Anthropic + OpenAI cũng confirm — engineering quan trọng hơn model!",
    color: ORANGE_WARN,
  },
  {
    kind: "compare",
    icon: "⚖️",
    cmdLabel: "Cái gì work · cái gì chưa?",
    title: "MIỀN HẸP THÌ OK",
    subtitle: "Toàn workflow phức tạp · CHƯA tới",
    compareLeft: {
      label: "✅ WORK NOW",
      items: ["Code (Cursor/Claude Code)", "Viết content", "Customer support", "Doc summarization", "Code review", "Narrow agent + HITL"],
      color: GREEN_OK,
    },
    compareRight: {
      label: "❌ CHƯA TỚI",
      items: ["Auto full workflow", "Multi-agent autonomous", "Replace knowledge worker", "Long horizon planning", "Open-ended task", "Production reliability"],
      color: RED_CRIT,
    },
    punchline: "Anthropic + OpenAI confirm — agent CẦN con người trong vòng lặp!",
    color: BLUE_INFO,
  },
  {
    kind: "opp",
    icon: "🎯",
    cmdLabel: "Cơ hội cho BẠN",
    title: "TOP 10% WORLD",
    subtitle: "Bạn biết dùng AI = lương cao nhất 2026",
    desc: [
      "Sếp công ty bạn cũng đang MÒ",
      "Freelancer biết Claude + GPT + MCP = hiếm",
      "Người dùng AI hiệu quả = trả lương cao nhất",
    ],
    demo: "Đối tượng đang được săn 2026:\n→ AI engineer ($200k+/year US)\n→ Prompt + agent designer\n→ Vibe coder (Claude Code/Cursor)\n→ AI workflow consultant ($200-500/hour)\n→ Bạn — nếu biết dùng AI hiệu quả",
    punchline: "Sếp đang mò · bạn đang biết — vị thế tốt nhất 5 năm tới!",
    color: GOLD,
  },
  {
    kind: "cta",
    ctaTitle: "CÔNG TY BẠN CÓ?",
    ctaLines: [
      "💬  Comment: công ty có AI roadmap?",
      "💾  Save video bóc trần sự thật",
      "🔗  Follow · T5 hàng tuần · AI reality",
    ],
    ctaNote: "Mỗi T5 mình bóc 1 sự thật AI không ai dám nói",
    color: RED_CRIT,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="rbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={RED_CRIT} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ORANGE_WARN} stopOpacity="0.12" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rbg3" cx="50%" cy="100%" r="50%">
        <stop offset="0%" stopColor={RED_DEEP} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="rgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={RED_CRIT} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="rmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="rgm"><rect width={W} height={H} fill="url(#rmaskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#rgrid)" mask="url(#rgm)" />
    <rect width={W} height={H} fill="url(#rbg1)" />
    <rect width={W} height={H} fill="url(#rbg2)" />
    <rect width={W} height={H} fill="url(#rbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ ai weekly · sự thật ai t5 · 2026
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 230)`}>
      <rect x={-380} y={-46} width={760} height={92} rx={46} fill={BG_SURFACE} stroke={s.color} strokeWidth={3} />
      <text x={0} y={14} fontSize={28} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={460} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20">
        {s.hookBig}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1000)`}>
      <text x={0} y={0} fontSize={68} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        {s.hookSub}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1180)`}>
      <rect x={-440} y={-58} width={880} height={116} rx={20} fill={BG_SURFACE} stroke={RED_DEEP} strokeWidth={2} />
      <text x={0} y={-12} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        McKinsey · MIT · Gartner
      </text>
      <text x={0} y={28} fontSize={26} fill={ORANGE_WARN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        3 báo cáo · 1 sự thật shock
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1500)`}>
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

const DataSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 170)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : 40} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 360)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">{s.icon}</text>
    </g>

    {/* Big number */}
    <g transform={`translate(${W / 2}, 680)`}>
      <text x={0} y={0} fontSize={340} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-15">
        {s.bigNumber}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 880)`}>
      <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        {s.bigNumberLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 980)`}>
      <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 1050)`}>
        <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 1170)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-460, ${i * 56})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={26} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1620)`}>
        <rect x={-490} y={-50} width={980} height={100} rx={16} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
        <text x={0} y={10} fontSize={26} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const ListSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={42} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 400)`}>
      <text x={0} y={0} fontSize={140} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={70} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 660)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 800)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-480, ${i * 80})`}>
            <text x={0} y={0} fontSize={32} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.demo && (
      <g transform={`translate(${W / 2}, 1320)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">bug-log · production</text>
        {s.demo.split("\n").map((line, i) => {
          const isArrow = line.startsWith("→");
          const color = isArrow ? s.color : (i === 0 ? s.color : TEXT_PRI);
          return (
            <text key={i} x={-470} y={-50 + i * 38} fontSize={22} fill={color} fontFamily="'Inter', sans-serif" fontWeight={600}>
              {line}
            </text>
          );
        })}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1640)`}>
        <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const CompareSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={38} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 380)`}>
      <text x={0} y={0} fontSize={70} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 460)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {/* Left column */}
    {s.compareLeft && (
      <g transform={`translate(270, 580)`}>
        <rect x={-230} y={-50} width={460} height={100} rx={16} fill={BG_SURFACE} stroke={s.compareLeft.color} strokeWidth={3} />
        <text x={0} y={14} fontSize={36} fill={s.compareLeft.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          {s.compareLeft.label}
        </text>
        {s.compareLeft.items.map((it, i) => (
          <g key={i} transform={`translate(-220, ${110 + i * 70})`}>
            <text x={0} y={0} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {it}
            </text>
          </g>
        ))}
      </g>
    )}

    {/* Right column */}
    {s.compareRight && (
      <g transform={`translate(810, 580)`}>
        <rect x={-230} y={-50} width={460} height={100} rx={16} fill={BG_SURFACE} stroke={s.compareRight.color} strokeWidth={3} />
        <text x={0} y={14} fontSize={36} fill={s.compareRight.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          {s.compareRight.label}
        </text>
        {s.compareRight.items.map((it, i) => (
          <g key={i} transform={`translate(-220, ${110 + i * 70})`}>
            <text x={0} y={0} fontSize={24} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {it}
            </text>
          </g>
        ))}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1640)`}>
        <rect x={-490} y={-50} width={980} height={100} rx={16} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
        <text x={0} y={10} fontSize={26} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const OppSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 180)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={44} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 400)`}>
      <text x={0} y={0} fontSize={160} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={110} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        {s.title}
      </text>
    </g>

    {s.subtitle && (
      <g transform={`translate(${W / 2}, 670)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {s.desc && (
      <g transform={`translate(${W / 2}, 790)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-460, ${i * 56})`}>
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
        <rect x={-490} y={-140} width={980} height={280} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-114} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-114} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-114} r={6} fill="#27C93F" />
        <text x={-406} y={-108} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">opportunity · 2026</text>
        {s.demo.split("\n").map((line, i) => {
          const isArrow = line.startsWith("→");
          const color = isArrow ? s.color : (i === 0 ? s.color : TEXT_PRI);
          return (
            <text key={i} x={-470} y={-60 + i * 36} fontSize={22} fill={color} fontFamily="'Inter', sans-serif" fontWeight={600}>
              {line}
            </text>
          );
        })}
      </g>
    )}

    {s.punchline && (
      <g transform={`translate(${W / 2}, 1700)`}>
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
      <text x={0} y={0} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={128} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(-1)[0]}
      </text>
    </g>
    {s.ctaLines && (
      <g transform={`translate(${W / 2}, 1060)`}>
        {s.ctaLines.map((ln, i) => (
          <g key={i} transform={`translate(0, ${i * 120})`}>
            <rect x={-440} y={-45} width={880} height={90} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
            <text x={0} y={14} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
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

export const SlideCarouselSepKhongBietAI: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "data" && <DataSlide s={s} />}
        {s.kind === "list" && <ListSlide s={s} />}
        {s.kind === "compare" && <CompareSlide s={s} />}
        {s.kind === "opp" && <OppSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
