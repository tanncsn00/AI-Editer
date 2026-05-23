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
    hookTag: "⚡ Anthropic · Cowork GA",
    hookNote: "Hê lô các con vợ iu · 9-Apr-2026 GA\nClaude Cowork = team văn phòng AI · paid plan included",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "📁",
    cmdLabel: "File Organization",
    title: "DỌN DOWNLOADS LOẠN",
    subtitle: "Rename + dedupe + sort tự động",
    desc: [
      "Point Claude vô folder bất kỳ",
      "Bảo rename theo nội dung, dedupe trùng",
      "Sort theo type, date, project",
    ],
    demo: "📂 Downloads/ → 47 files chaos\n→ Cowork: rename + sort + dedupe\n✓ 30 phút xong",
    punchline: "Như mẹ chồng dọn nhà sau Tết — đỡ vợ luôn!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "💼",
    cmdLabel: "Payroll Planning",
    title: "LẬP LƯƠNG NHÂN VIÊN",
    subtitle: "QuickBooks · thuế · bonus · OT auto",
    desc: [
      "Connect QuickBooks → Cowork đọc data",
      "Tính lương + thuế + bonus + OT tháng",
      "Xuất bảng approve duyệt → gửi",
    ],
    demo: "📊 15 employees · monthly cycle\n→ Cowork: salary + tax + bonus + OT\n✓ approve & disburse",
    punchline: "Đỡ vợ tính tay Chủ Nhật — nhân viên vẫn được lương!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "📊",
    cmdLabel: "Reconciliation",
    title: "ĐỐI CHIẾU SỔ SÁCH",
    subtitle: "Bank vs QuickBooks · match + flag",
    desc: [
      "Connect bank statement + QuickBooks",
      "Cowork match từng giao dịch",
      "Flag discrepancy, missing entries",
    ],
    demo: "🏦 Bank · 247 txn\n📒 QB · 245 txn\n→ Cowork: 2 missing flagged · 5 min",
    punchline: "Như chồng nhớ chính xác vợ tiêu bao nhiêu ở Shopee!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "📈",
    cmdLabel: "Margin Report",
    title: "DOANH THU + MARGIN",
    subtitle: "Dashboard · chart · top SP · LTV",
    desc: [
      "Cho Cowork data sales tháng",
      "Gen dashboard + chart + top product",
      "Customer LTV + churn + cohort",
    ],
    demo: "📊 sales_oct.csv (8.2k rows)\n→ Cowork: dashboard + 5 chart\n+ LTV by cohort + top 10 SKU",
    punchline: "Có CFO riêng pha cà phê đưa cho mỗi sáng!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "📣",
    cmdLabel: "Campaign Marketing",
    title: "ĐA KÊNH AUTO",
    subtitle: "HubSpot + Canva · gen + A/B test",
    desc: [
      "Brief 1 dòng concept → Cowork take over",
      "Gen content, schedule post, multi-platform",
      "Track A/B test, attribute conversion",
    ],
    demo: "🎯 \"Black Friday campaign\"\n→ HubSpot + Canva + 4 channel\n→ A/B + attribution dashboard",
    punchline: "Có agency marketing nội bộ — sếp marketing thừa luôn!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "📜",
    cmdLabel: "Contract Review",
    title: "EXTRACT KEY TERMS",
    subtitle: "PDF contract → bên + giá + deadline + penalty",
    desc: [
      "Drag PDF contract vô Cowork",
      "Extract: parties, value, deadline",
      "Penalty clause, auto-renewal flag",
    ],
    demo: "📄 vendor_agreement.pdf (32 pages)\n→ Cowork: structured summary\n• value · term · auto-renewal: YES ⚠",
    punchline: "Đỡ vợ ký nhầm điều khoản như bị scam — luật sư phí cao tiết kiệm!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🔬",
    cmdLabel: "Research Synthesis",
    title: "10 PDF → KEY INSIGHT",
    subtitle: "Question + sources → summary structured",
    desc: [
      "Cho Cowork question + N nguồn PDF/doc",
      "Đọc hết, identify key insight",
      "Return summary structured · ready for review",
    ],
    demo: "❓ \"market trend AI VN 2026?\"\n+ 10 reports + 20 articles\n→ Cowork: 3-page exec summary",
    punchline: "Như có em bạn giỏi tóm tắt sách hộ đi thi!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "📧",
    cmdLabel: "Email Triage",
    title: "INBOX ZERO 10 PHÚT",
    subtitle: "Gmail · classify + draft reply",
    desc: [
      "Connect Gmail → Cowork đọc inbox",
      "Phân loại: urgent / deferred / ignore",
      "Draft reply tone vợ cho urgent",
    ],
    demo: "📥 200 emails morning\n→ urgent: 12 (draft reply ready)\n→ deferred: 45 · ignore: 143",
    punchline: "Có thư ký riêng đứng phía sau lưng giúp việc!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "🧾",
    cmdLabel: "Tax Season",
    title: "QUYẾT TOÁN THUẾ",
    subtitle: "Organize hóa đơn + sao kê + payroll",
    desc: [
      "Cowork crawl hết hóa đơn + sao kê",
      "Sort + categorize + missing items flag",
      "Structure sẵn cho kế toán / phần mềm",
    ],
    demo: "💼 12 tháng hóa đơn rời rạc\n→ Cowork: structured tax package\n✓ ready cho kế toán filing",
    punchline: "Đỡ tháng 3 vợ ngất vì thiếu giấy tờ!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "💰",
    cmdLabel: "Invoice Chase",
    title: "ĐÒI NỢ TỰ ĐỘNG",
    subtitle: "PayPal + Stripe + QB · auto reminder",
    desc: [
      "Connect PayPal/Stripe/QuickBooks",
      "Cowork track invoice quá hạn",
      "Auto reminder polite · escalate sau X ngày",
    ],
    demo: "💸 Overdue: 18 invoices · $12k\n→ Cowork: reminder day 7/14/30\n✓ cash flow tự về",
    punchline: "Đỡ vợ phải mặt dày nhắn khách — cash flow tự về!",
    color: GREEN,
  },
  {
    kind: "cta",
    ctaTitle: "VIỆC BÁ ĐẠO?",
    ctaLines: ["💾  Save bài này", "💬  Comment việc bá đạo nhất", "🔗  Follow tip Cowork daily"],
    ctaNote: "Claude Cowork GA · 9-Apr-2026 · bundled tất cả paid plans",
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
      ⚡ claude · cowork · GA 9-Apr-2026
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-340} y={-44} width={680} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={96} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        COWORK
      </text>
      <text x={0} y={224} fontSize={54} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        thay team văn phòng
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Kế toán · marketer · sales · lễ tân
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        Cowork xử hết · bundled tất cả paid plan
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
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 32 : (s.cmdLabel || "").length > 16 ? 42 : 50} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
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
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">cowork demo</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 38} fontSize={20} fill={line.startsWith("✓") ? GREEN : (i === 0 ? s.color : TEXT_PRI)} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
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

export const SlideCarouselTop10Cowork: React.FC = () => {
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
