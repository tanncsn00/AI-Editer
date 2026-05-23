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
    hookTag: "⚠️ Dev Confession · 1 năm",
    hookNote: "Hê lô các con vợ iu · chồng nói thẳng\n10 kỹ năng dev mất vì Claude · không gáy",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🔥",
    cmdLabel: "Đọc error message",
    title: "PASTE STACK TRACE",
    subtitle: "Không tự đọc, paste hết vô Claude",
    desc: [
      "Trước: đọc từng dòng tìm root cause",
      "Giờ: paste cả stack trace vô Claude",
      "Quên cách phân tích error pattern",
    ],
    demo: "❌ Cũ: đọc → suy luận → tìm bug\n✓ Giờ: paste 50 dòng → \"fix giúp tao\"",
    punchline: "Như quên cách nấu cơm vì có app gọi đồ ăn!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "🖨️",
    cmdLabel: "print / console.log",
    title: "DEBUG BẰNG TAY",
    subtitle: "Rải print trace từng bước → teo dần",
    desc: [
      "Trước: rải print khắp code, trace step",
      "Giờ: paste code → Claude find bug",
      "Cơ chế debug bằng tay atrophy",
    ],
    demo: "❌ Cũ: console.log(x), console.log(y)...\n✓ Giờ: paste 200 dòng → \"find bug\"",
    punchline: "Như cơ tay không tập gym — teo dần!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "📝",
    cmdLabel: "Syntax language phụ",
    title: "QUÊN BASH / RUBY",
    subtitle: "Trước thuộc lòng, giờ hỏi Claude mỗi lần",
    desc: [
      "Bash, Ruby, Lua — trước thuộc",
      "Giờ mỗi đoạn code là hỏi Claude",
      "Multi-language proficiency biến mất",
    ],
    demo: "❌ \"awk -F: '{print $1}'\" — quên\n✓ \"viết awk in cột 1\" → copy Claude",
    punchline: "Như quên số điện thoại nhà vì có danh bạ!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "📚",
    cmdLabel: "Đọc docs từ đầu",
    title: "GETTING STARTED",
    subtitle: "Bỏ thói quen đào sâu doc gốc",
    desc: [
      "Trước: framework mới → đọc getting started",
      "Giờ: hỏi Claude tóm tắt 5 dòng",
      "Mất intuition về tool design",
    ],
    demo: "❌ Cũ: đọc 50 trang docs framework\n✓ Giờ: \"X framework là gì, tóm tắt\"",
    punchline: "Như quên đường về quê vì có Google Maps!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🧩",
    cmdLabel: "LeetCode + Algorithm",
    title: "GIẢI BÀI MEDIUM",
    subtitle: "Pattern recognition giảm — vã interview",
    desc: [
      "Bài medium 30 phút → giờ 5 phút hỏi AI",
      "Pattern recognition kém đi",
      "Interview FAANG không AI = vã mồ hôi",
    ],
    demo: "❌ Cũ: tự nghĩ binary search, two pointer\n✓ Giờ: \"giải bài này\" → Claude xuất",
    punchline: "Như VĐV quên cách chạy không giày tốt!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "📄",
    cmdLabel: "File blank paralysis",
    title: "EMPTY EDITOR FEAR",
    subtitle: "Không tự gõ — phải hỏi Claude scaffold",
    desc: [
      "Trước: mở file blank → tự gõ luôn",
      "Giờ: hỏi Claude scaffold trước, edit sau",
      "Cold start ability mất dần",
    ],
    demo: "❌ Cũ: \"function foo() { ...\" — tự gõ\n✓ Giờ: \"scaffold module X\" trước đã",
    punchline: "Tờ giấy trắng — không biết bắt đầu từ đâu. Tệ thật!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "👀",
    cmdLabel: "Code review sâu",
    title: "ACCEPT DIFF SKIM 10S",
    subtitle: "Bug slip vô prod, không biết",
    desc: [
      "Trước: đọc từng dòng, hỏi why",
      "Giờ: Claude show diff → skim → accept",
      "Habit phản biện code biến mất",
    ],
    demo: "❌ Cũ: review 30 phút, comment chi tiết\n✓ Giờ: skim 10s → click \"Accept\"",
    punchline: "Bug slip vô prod mà chồng không biết!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🗺️",
    cmdLabel: "Mental map repo",
    title: "QUÊN CODEBASE",
    subtitle: "Claude đọc cho — sang tuần quên hết",
    desc: [
      "Trước: nắm cả repo trong đầu",
      "Giờ: Claude grep cho, skim summary",
      "Onboard 1 ngày, mất 1 tuần",
    ],
    demo: "❌ Cũ: \"file auth ở src/lib/auth.ts\"\n✓ Giờ: \"file auth đâu?\" mỗi tuần",
    punchline: "Bộ nhớ làm việc atrophy!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "⚙️",
    cmdLabel: "Regex + grep/sed/awk",
    title: "POWER-USER CLI MẤT",
    subtitle: "Quên pipe complex, hỏi Claude generate",
    desc: [
      "Trước: thuộc grep, sed, awk như uống nước",
      "Giờ: mỗi cái hỏi Claude",
      "Không tự type pipe complex được",
    ],
    demo: "❌ Cũ: gõ \"grep -rn 'foo' | awk ...\" liền\n✓ Giờ: \"viết bash đếm X\" → copy",
    punchline: "Power-user CLI biến mất — đáng buồn!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🧘",
    cmdLabel: "Patience + Grit",
    title: "MẤT KIÊN NHẪN",
    subtitle: "15 phút stuck = hỏi Claude, grit yếu",
    desc: [
      "Trước: bug khó debug 3 tiếng",
      "Giờ: 15 phút stuck → hỏi AI",
      "Persistence + grit teo đi",
    ],
    demo: "❌ Cũ: debug 3h, học 5 thứ mới mỗi bug\n✓ Giờ: 15 phút stuck → \"giúp\"",
    punchline: "Trở thành dev fragile khi không có AI!",
    color: ACCENT_PINK,
  },
  {
    kind: "cta",
    ctaTitle: "VỢ ĐÃ MẤT?",
    ctaLines: ["💾  Save bài này", "💬  Comment kỹ năng vợ đã mất", "🔗  Follow tip trung thực daily"],
    ctaNote: "Hê lô các con vợ iu · chồng giận thật nếu vợ không follow · 2026",
    color: RED,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={RED} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ORANGE} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={RED} strokeWidth="1" opacity="0.05" />
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
      ⚠️ claude · dev confession · 1 year usage
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
      <text x={0} y={140} fontSize={88} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        KỸ NĂNG
      </text>
      <text x={0} y={220} fontSize={62} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        DEV MẤT vì Claude
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Hê lô các con vợ iu · chồng nói thẳng
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        1 năm xài thật · cảnh báo dev junior
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
      <rect x={-420} y={-50} width={840} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 30 : (s.cmdLabel || "").length > 16 ? 38 : 46} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        ⚠ {s.cmdLabel}
      </text>
    </g>

    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={180} textAnchor="middle">{s.icon}</text>
    </g>

    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 52 : (s.title || "").length > 14 ? 62 : 72} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
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
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">before / after</text>
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
      <text x={0} y={0} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={128} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
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

export const SlideCarouselTop10SkillLost: React.FC = () => {
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
