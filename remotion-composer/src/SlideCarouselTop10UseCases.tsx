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
  hookHeadline?: string;
  hookSub?: string;
  hookTag?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⚡ Claude Code · Beyond Code",
    hookHeadline: "10 USE CASE",
    hookSub: "Claude Code NGOÀI CODE — chồng xài hằng ngày",
    hookNote: "Vợ tưởng chỉ để code à? Sai bét nhè\nhọc 1 lần · xài cả năm · 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "📕",
    cmdLabel: "Drag PDF",
    title: "ĐỌC PDF 200 TRANG",
    subtitle: "Tóm tắt 3 ý chính trong 30 giây",
    desc: [
      "Kéo PDF/Word/MD vào cửa sổ chat",
      "Bảo Claude tóm tắt theo ý vợ cần",
      "Hỏi follow-up không cần đọc lại",
    ],
    demo: "[drag report.pdf — 200 pages]\n→ tóm tắt 3 bullet + key insight",
    punchline: "Vợ đọc cả tối còn không bằng Claude 30 giây — buồn cho vợ á!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "📊",
    cmdLabel: "Drag CSV / Excel",
    title: "PHÂN TÍCH DATA",
    subtitle: "1000 dòng → bảng pivot + chart auto",
    desc: [
      "Kéo file Excel/CSV vào Claude",
      "Bảo \"phân tích doanh thu tháng này\"",
      "Claude xuất bảng + biểu đồ + insight",
    ],
    demo: "[drag sales.csv — 1.2k rows]\n→ pivot table + bar chart + top product",
    punchline: "Khỏi mở Excel — sức khoẻ tâm thần được cứu!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "📧",
    cmdLabel: "Paste email/Zalo",
    title: "REPLY HÀNG LOẠT",
    subtitle: "50 tin nhắn → draft tone vợ trong 1 phút",
    desc: [
      "Paste batch email/Zalo/inbox vào",
      "Bảo Claude reply tone thân thiện giữ giọng",
      "Sửa nhẹ → gửi đi luôn",
    ],
    demo: "[paste 50 email]\n→ 50 reply giữ giọng vợ + tone thân thiện",
    punchline: "Reply nhanh hơn vợ trả tin nhắn chồng khi đang giận!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "✍️",
    cmdLabel: "Brief 1 dòng",
    title: "VIẾT BLOG / CAPTION",
    subtitle: "1500 chữ SEO + caption đa nền tảng",
    desc: [
      "Brief 1 dòng — Claude xuất full bài",
      "SEO heading + meta description chuẩn",
      "Gen luôn caption TikTok/IG/FB/LinkedIn",
    ],
    demo: "\"viết blog về AI agency cho founder VN\"\n→ 1500 chữ + 4 caption đa platform",
    punchline: "Nhanh hơn chồng đặt nick cho vợ trong group bạn thân!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "🌐",
    cmdLabel: "Drag → dịch",
    title: "DỊCH GIỮ FORMAT",
    subtitle: "Word/PDF/MD — heading + bullet + bảng nguyên",
    desc: [
      "Kéo file Word/PDF/Markdown vào",
      "Bảo dịch sang Anh/Việt/Trung/Nhật",
      "Format gốc giữ nguyên — không copy paste",
    ],
    demo: "[drag contract.docx]\n→ dịch xong giữ heading + bullet + table",
    punchline: "Tiết kiệm 2 tiếng — chồng có time tâm sự với vợ tối nay!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "📄",
    cmdLabel: "Paste JD + CV",
    title: "TỐI ƯU CV ATS",
    subtitle: "Match keyword JD → pass ATS 100%",
    desc: [
      "Paste mô tả công việc (JD)",
      "Paste CV hiện tại của vợ",
      "Claude rewrite match keyword + format ATS",
    ],
    demo: "[paste JD] + [paste CV]\n→ CV optimized · ATS score 92/100",
    punchline: "CV vợ đẹp như profile Tinder ngày Valentine — sợ gì!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "🧾",
    cmdLabel: "Drag ảnh hóa đơn",
    title: "OCR BIÊN LAI",
    subtitle: "30 ảnh hóa đơn → Excel auto, khỏi nhập tay",
    desc: [
      "Kéo ảnh hóa đơn/biên lai vào Claude",
      "Bảo trích xuất ngày, số tiền, tên cửa hàng",
      "Xuất luôn file CSV để import vào sổ sách",
    ],
    demo: "[drag 30 receipt images]\n→ CSV: date · amount · merchant · category",
    punchline: "Nhanh hơn vợ kiểm ví chồng mỗi tối — mà chính xác hơn!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "💡",
    cmdLabel: "\"50 idea X\"",
    title: "BRAINSTORM + RANK",
    subtitle: "Gen 50 idea → chấm điểm viral/novelty",
    desc: [
      "\"50 idea content/sản phẩm/quà sinh nhật\"",
      "Score theo viral, độ mới, độ chạm cảm xúc",
      "Claude tự rank top 5 cho vợ pick liền",
    ],
    demo: "\"50 idea quà sinh nhật vợ 25 tuổi 1tr\"\n→ rank top 5 + lý do từng cái",
    punchline: "Brainstorm quà sinh nhật vợ chuẩn hơn mẹ ruột chồng!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "📁",
    cmdLabel: "!bash rename",
    title: "ĐỔI TÊN HÀNG LOẠT",
    subtitle: "500 IMG_001.jpg → tên theo nội dung",
    desc: [
      "Bảo Claude viết bash/python script",
      "Đổi tên theo OCR nội dung ảnh hoặc EXIF",
      "Apply một phát — 500 file đổi sạch",
    ],
    demo: "$ !python rename.py ./photos/\n→ IMG_001 → cafe_dalat_2025_08.jpg",
    punchline: "Nhanh như chồng đổi tên contact ex thành \"ĐỪNG ALO\"!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🗺️",
    cmdLabel: "\"3 ngày Đà Lạt 5tr\"",
    title: "LẬP KẾ HOẠCH",
    subtitle: "Itinerary travel/học/ăn uống chi tiết",
    desc: [
      "Brief: địa điểm + thời gian + ngân sách",
      "Claude gen lịch trình từng giờ",
      "Kèm gợi ý quán, homestay, budget từng bữa",
    ],
    demo: "\"3 ngày Đà Lạt 5tr · 2 người\"\n→ lịch + quán + homestay + chi tiết bữa",
    punchline: "Chuẩn hơn vợ lập kế hoạch ngày cưới chồng — khỏi hỏi mẹ chồng!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "USE CASE NÀO?",
    ctaLines: ["💾  Save bài này", "💬  Comment use case vợ xài nhiều", "🔗  Follow tip Claude daily"],
    ctaNote: "Chồng giận luôn nếu vợ không follow · 2026",
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
      ⚡ claude-code · beyond code · tip series
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 290)`}>
      <rect x={-300} y={-44} width={600} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={240} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-8">
        10
      </text>
      <text x={0} y={130} fontSize={92} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        USE CASE
      </text>
      <text x={0} y={210} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        NGOÀI CODE
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Claude Code không chỉ để code
      </text>
      <text x={0} y={60} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        chồng xài hằng ngày · vợ chưa biết
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1480)`}>
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
    {/* Top: command literal in pill */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-360} y={-50} width={720} height={100} rx={22} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={20} fontSize={(s.cmdLabel || "").length > 16 ? 38 : (s.cmdLabel || "").length > 12 ? 46 : 54} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={200} textAnchor="middle">{s.icon}</text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 16 ? 56 : (s.title || "").length > 14 ? 64 : 74} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {/* Subtitle */}
    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
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
            <text x={26} y={0} fontSize={29} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {/* Terminal demo */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">demo</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 40} fontSize={22} fill={i === 0 ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
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
        <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10UseCases: React.FC = () => {
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
