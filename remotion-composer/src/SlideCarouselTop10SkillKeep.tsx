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
    hookTag: "⚡ AI ERA · EDGE NGƯỜI",
    hookNote: "Sau video skill dev mất vì AI · giờ ngược lại\n10 kỹ năng AI vĩnh viễn KHÔNG thay được",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "❓",
    cmdLabel: "Asking Right Question",
    title: "ĐẶT CÂU HỎI ĐÚNG",
    subtitle: "AI giỏi trả lời, không giỏi hỏi",
    desc: [
      "Câu hỏi sai → output sai (AI bias theo input)",
      "Frame problem đúng = nửa giải pháp",
      "Underrated nhất trong AI era 2026",
    ],
    demo: '❌ "viết code giúp tao"\n✓ "tao cần build X, constraint Y, output Z"\n→ same AI, output khác 10x',
    punchline: "Người hỏi giỏi luôn thắng người trả lời giỏi!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🎨",
    cmdLabel: "Taste + Aesthetic",
    title: "JUDGMENT THẨM MỸ",
    subtitle: "Pick đúng từ 100 design AI gen",
    desc: [
      "AI gen 100 design generic — bạn pick cái fit",
      "Taste = năm tháng tích lũy, ko shortcut",
      "Designer FAANG vẫn ko lo mất việc",
    ],
    demo: "AI gen: 100 landing page mockups\n→ bạn pick 3 fit brand voice\n→ trade tasteful judgment ko transferable",
    punchline: "Taste = competitive advantage vĩnh viễn!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "💙",
    cmdLabel: "Empathy + EQ",
    title: "CẢM XÚC NGƯỜI THẬT",
    subtitle: "Nhân viên khóc/khách giận — AI ko handle",
    desc: [
      "AI mô phỏng cảm xúc nhưng ko thực sự cảm",
      "Conflict resolution, comfort, presence",
      "Human-to-human moment ko replicate",
    ],
    demo: "❌ AI: \"Sorry to hear that, here are 5 tips\"\n✓ Human: ngồi yên, lắng nghe, hugging\n→ EQ thật ko fake được",
    punchline: "Empathy là human privilege!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🤝",
    cmdLabel: "Negotiation + Persuasion",
    title: "ĐÀM PHÁN NUANCE",
    subtitle: "Body language · adapt · biết khi nào im",
    desc: [
      "AI gửi email được, deal triệu đô bạn đi",
      "Read room, adapt tone, leverage timing",
      "Sales nuance ko thay được 5 năm tới",
    ],
    demo: "❌ AI email: template, no read situation\n✓ Human meeting: pause, eye contact, pivot\n→ deal closes",
    punchline: "Deal lớn vẫn human-to-human!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "💡",
    cmdLabel: "Original Creativity",
    title: "NOVEL SYNTHESIS",
    subtitle: "AI chỉ pattern match training data",
    desc: [
      "AI: pattern match, ko tạo idea hoàn toàn mới",
      "Combine 2 lĩnh vực xa = original",
      "Steve Jobs: calligraphy + máy tính cá nhân",
    ],
    demo: "AI: optimize cái đã có (variation)\nHuman: combine 2 ngành xa nhau (synthesis)\n→ true innovation",
    punchline: "Original synthesis = edge người vĩnh viễn!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🎓",
    cmdLabel: "Deep Domain Expertise",
    title: "20 NĂM TACIT KNOWLEDGE",
    subtitle: "Ko transfer qua text được",
    desc: [
      "Bác sĩ 20 năm phẫu thuật · luật sư loophole",
      "Engineer 15 năm hiểu legacy codebase",
      "AI vẫn lệ thuộc bạn trong ngành sâu",
    ],
    demo: "Surface knowledge: AI dạy nhanh\nTacit knowledge: chỉ học qua experience\n→ years compound · ko shortcut",
    punchline: "Domain sâu = AI vẫn hỏi bạn!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "☕",
    cmdLabel: "In-Person Trust",
    title: "NETWORK QUA CÀ PHÊ",
    subtitle: "Deal lớn vẫn người gặp người",
    desc: [
      "Eye contact + handshake + ăn tối",
      "Network thật xây qua năm tháng",
      "Founder VN: Cowork tốt, deal lớn vẫn gặp",
    ],
    demo: "AI: schedule meeting, send email\nHuman: cà phê 2h, kể chuyện gia đình\n→ deal $50k+ ký",
    punchline: "Trust thật ko replicate qua màn hình!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "👑",
    cmdLabel: "Leadership + Motivation",
    title: "TEAM CONFLICT + HIRE",
    subtitle: "AI advise · decision human",
    desc: [
      "Inspire team qua khó khăn",
      "Resolve conflict 2 dev senior",
      "Hire/layoff đúng người đúng lúc",
    ],
    demo: "AI: data + recommendation\nHuman: judgment + execution\n→ decision human, accountability human",
    punchline: "Leadership ko outsource cho AI được!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🏃",
    cmdLabel: "Discipline + Consistency",
    title: "HABIT POWER",
    subtitle: "AI ko bắt bạn ngồi xuống làm",
    desc: [
      "AI giúp 10x productive khi bạn làm",
      "Daily habit, ship weekly, ko bỏ cuộc",
      "Power compounding chỉ thuộc người",
    ],
    demo: "AI: 10x speed khi bạn ngồi vô\nHuman: ngồi vô mỗi ngày 30 ngày liền\n→ compound > AI assist",
    punchline: "Habit người + AI tool = unbeatable!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🔗",
    cmdLabel: "Cross-Domain Synthesis",
    title: "POLYMATH ADVANTAGE",
    subtitle: "Connect dot · AI specialize 1 ngành",
    desc: [
      "Engineer + design + marketing + tâm lý",
      "Connect dot giữa ngành khác nhau",
      "AI vertical, human horizontal",
    ],
    demo: "AI specialist: ML expert ⊥ marketing expert\nHuman polymath: combine cross-domain\n→ unique insight ko AI có",
    punchline: "Polymath vẫn thắng specialist trong 2026!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "SKILL MẠNH NHẤT?",
    ctaLines: ["💾  Save bài này", "💬  Comment skill bạn mạnh nhất", "🔗  Follow tip career AI daily"],
    ctaNote: "Edge dài hạn của bạn · build từ giờ · 2026",
    color: GREEN,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GREEN} strokeWidth="1" opacity="0.05" />
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
      ⚡ ai era · edge người · skill vĩnh viễn
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-320} y={-44} width={640} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={32} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
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
      <text x={0} y={224} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        AI KHÔNG thay
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Edge dài hạn của bạn
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        build từ giờ · 2026
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
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">AI vs Human</text>
        {s.demo.split("\n").map((line, i) => {
          const isFail = line.startsWith("❌");
          const isPass = line.startsWith("✓");
          const color = isFail ? RED : isPass ? GREEN : (i === 0 ? s.color : TEXT_PRI);
          return (
            <text key={i} x={-470} y={-44 + i * 38} fontSize={20} fill={color} fontFamily="'Inter', sans-serif" fontWeight={600}>
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

export const SlideCarouselTop10SkillKeep: React.FC = () => {
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
