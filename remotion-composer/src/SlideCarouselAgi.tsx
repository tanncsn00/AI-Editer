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
    hookTag: "⚡ AGI · CLARITY 2 PHÚT",
    hookNote: "Elon Musk + CEO Anthropic dự đoán AGI 2026\nnhưng số liệu nói khác — verified 2026",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🎯",
    cmdLabel: "AI hiện tại = narrow AI",
    title: "CHỈ GIỎI 1 VIỆC",
    subtitle: "Mỗi AI chuyên đúng một sở trường",
    desc: [
      "Tesla tự lái → cho vô bếp đứng nhìn",
      "Alpha Fold giải protein thắng Nobel → ko biết hỏi 'khỏe ko'",
      "Stockfish thắng kiện tướng cờ → viết thơ thua cấp ba",
    ],
    demo: "Tesla: lái xe ✓ | nấu cơm ✗\nAlphaFold: protein ✓ | small talk ✗\nStockfish: chess ✓ | tỏ tình ✗",
    punchline: "Narrow AI = chuyên gia một ngành duy nhất!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "💔",
    cmdLabel: "Ẩn dụ: Người yêu cũ",
    title: "GIỎI 1 VIỆC THÔI",
    subtitle: "Nấu ngon ko massage · massage giỏi ko nấu",
    desc: [
      "Mỗi đứa giỏi MỘT chuyện",
      "Không đứa nào biết hết",
      "Đó chính là AI hôm nay!",
    ],
    demo: "Người yêu A: nấu ngon ✓ | massage ✗\nNgười yêu B: massage ✓ | nấu ✗\n→ Không có ai biết hết tất cả",
    punchline: "AI hôm nay = người yêu cũ specialist!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "AGI là gì",
    title: "TRÍ TUỆ TỔNG QUÁT",
    subtitle: "Artificial General Intelligence",
    desc: [
      "Biết HẾT như người trưởng thành",
      "Code · viết · vẽ · đàm phán · lái xe · nấu ăn · dạy con",
      "Học 1 lần → áp dụng mọi lĩnh vực",
    ],
    demo: "AGI = code ✓ + viết ✓ + vẽ ✓\n      + đàm phán ✓ + lái ✓ + dạy con ✓\n      + KO cần retrain task mới",
    punchline: "AGI = polymath máy · biết hết mọi thứ!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "💖",
    cmdLabel: "Ẩn dụ: Người yêu hoàn hảo",
    title: "BIẾT HẾT MỌI THỨ",
    subtitle: "Vấn đề: chưa tồn tại 2026",
    desc: [
      "Vừa nấu phở · vừa massage · vừa kiếm tiền",
      "Vừa nghe bạn kể 2 tiếng ko ngắt",
      "Đứa nào đến = cưới liền ko cần nghĩ",
    ],
    demo: "AGI = người yêu hoàn hảo (tưởng tượng)\n→ nấu ✓ + massage ✓ + kiếm tiền ✓\n→ nghe vợ kể 2h ko cắt ✓\n→ CHƯA TỒN TẠI",
    punchline: "AGI = giấc mơ chưa thực hiện!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "📊",
    cmdLabel: "Khi nào có AGI?",
    title: "DATA 2026 NÓI GÌ",
    subtitle: "Twist drama: 2 benchmark ngược nhau",
    desc: [
      "Amodei (Anthropic): AGI tới 2026-27",
      "Elon Musk: dự đoán 2026",
      "Nhưng số liệu nói khác...",
    ],
    demo: "ARC-AGI-2: GPT-5.5 85% (vượt human 66%) ✓\nARC-AGI-3: best model 0.4% | human 100% ✗\n→ Khác biệt 250 lần",
    punchline: "AGI vẫn xa hơn nhiều người tưởng!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🌊",
    cmdLabel: "Khi AGI đến",
    title: "KINH TẾ ĐẢO LỘN",
    subtitle: "Productivity 10x-100x · nhiều nghề biến mất",
    desc: [
      "Nhiều nghề thay đổi mãi mãi",
      "Năng suất nhảy 10-100 lần",
      "Anthropic xây ASL (cấp độ an toàn)",
    ],
    demo: "Khi AGI tới:\n→ jobs disrupted (nhiều)\n→ productivity 10-100x\n→ risks cao → safety control needed",
    punchline: "Câu chuyện AGI vẫn đang viết · ko ai biết chính xác!",
    color: ORANGE,
  },
  {
    kind: "cta",
    ctaTitle: "AGI TỚI 2027?",
    ctaLines: ["💾  Save video", "💬  Comment AGI tới 2027 ko", "🔗  Follow tip AI clarity daily"],
    ctaNote: "Hôm nay 2026 vẫn narrow AI · học dùng hiệu quả đủ giàu",
    color: ACCENT_VIOLET,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_VIOLET} strokeWidth="1" opacity="0.05" />
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
      ⚡ ai clarity · agi explained · 2026
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-320} y={-44} width={640} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 740)`}>
      <text x={0} y={0} fontSize={420} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20">
        AGI
      </text>
      <text x={0} y={130} fontSize={70} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        là gì?
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        2 phút bóc tách deep
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        data 2026 chuẩn · không clickbait
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
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 40 : 48} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
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
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">example</text>
        {s.demo.split("\n").map((line, i) => {
          const isFail = line.includes("✗") || line.includes("❌");
          const isPass = line.includes("✓") && !line.includes("✗");
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

export const SlideCarouselAgi: React.FC = () => {
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
