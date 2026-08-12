import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

// Zen minimal palette
const BG_CREAM = "#F5F1E8";
const BG_CREAM_DARK = "#ECE4D0";
const INK = "#0D0D0D";
const INK_SOFT = "#2A2A2A";
const INK_MUTE = "#6B6B6B";
const INK_FAINT = "#A8A8A8";
const SEAL = "#C8362B";
const SEAL_DARK = "#8C2419";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ BG · subtle paper texture ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="zenbg1" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor="#FFFCF5" stopOpacity="1" />
        <stop offset="100%" stopColor={BG_CREAM} stopOpacity="1" />
      </radialGradient>
      <radialGradient id="zenbg2" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stopColor={BG_CREAM_DARK} stopOpacity="0.4" />
        <stop offset="100%" stopColor={BG_CREAM} stopOpacity="0" />
      </radialGradient>
      {/* Subtle grain pattern */}
      <pattern id="zengrain" width="200" height="200" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="40" r="0.5" fill={INK_FAINT} opacity="0.3" />
        <circle cx="120" cy="80" r="0.4" fill={INK_FAINT} opacity="0.25" />
        <circle cx="170" cy="50" r="0.6" fill={INK_FAINT} opacity="0.3" />
        <circle cx="60" cy="160" r="0.4" fill={INK_FAINT} opacity="0.25" />
        <circle cx="140" cy="180" r="0.5" fill={INK_FAINT} opacity="0.3" />
      </pattern>
    </defs>
    <rect width={W} height={H} fill="url(#zenbg1)" />
    <rect width={W} height={H} fill="url(#zenbg2)" />
    <rect width={W} height={H} fill="url(#zengrain)" />
  </svg>
);

// Roman numeral chapter mark + seal
const ChapterMark: React.FC<{ roman: string; label: string }> = ({ roman, label }) => (
  <g transform={`translate(${W / 2}, 180)`}>
    {/* Thin top line */}
    <line x1={-60} y1={-40} x2={60} y2={-40} stroke={INK} strokeWidth={1.5} />
    {/* Roman numeral */}
    <text x={0} y={20} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
      {roman}
    </text>
    {/* Label below */}
    <text x={0} y={66} fontSize={16} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
      {label}
    </text>
    {/* Thin bottom line */}
    <line x1={-60} y1={86} x2={60} y2={86} stroke={INK} strokeWidth={1.5} />
  </g>
);

// Tiny dots divider
const DotsDivider: React.FC<{ y: number }> = ({ y }) => (
  <g transform={`translate(${W / 2}, ${y})`}>
    <circle cx={-22} cy={0} r={3.5} fill={INK_MUTE} />
    <circle cx={0} cy={0} r={3.5} fill={SEAL} />
    <circle cx={22} cy={0} r={3.5} fill={INK_MUTE} />
  </g>
);

// Red seal stamp (square with text)
const SealStamp: React.FC<{ x: number; y: number; rotation?: number; label?: string }> = ({ x, y, rotation = -4, label = "簡 道" }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    <rect x={-44} y={-44} width={88} height={88} rx={6} fill="none" stroke={SEAL} strokeWidth={4} />
    <text x={0} y={-2} fontSize={26} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
      {label.split(" ")[0]}
    </text>
    <text x={0} y={30} fontSize={26} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
      {label.split(" ")[1] || ""}
    </text>
  </g>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={18} fill={INK_FAINT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
      truyền kỳ · 簡 道 · 2026
    </text>
  </g>
);

// ============ SLIDE 1: I. THUỞ MỚI NHẬP ============
const Slide1Intro: React.FC = () => (
  <g>
    <ChapterMark roman="I." label="THUỞ MỚI NHẬP CODE ĐẠO" />

    {/* Massive zen title */}
    <g transform={`translate(${W / 2}, 480)`}>
      <text x={0} y={0} fontSize={42} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="3" fontStyle="italic">
        Khi dev bắt đầu hiểu...
      </text>
      <text x={0} y={130} fontSize={138} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        ĐƠN GIẢN
      </text>
      <text x={0} y={210} fontSize={36} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="6" fontStyle="italic">
        mới là
      </text>
      <text x={0} y={320} fontSize={120} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
        ĐẠI ĐẠO
      </text>
    </g>

    <DotsDivider y={970} />

    {/* The complexity stack */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={-100} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        Một cái API nhỏ. Nhưng phải...
      </text>
      <g transform={`translate(0, 0)`}>
        {[
          { x: -300, y: -30, t: "microservice" },
          { x: 0, y: -30, t: "queue" },
          { x: 300, y: -30, t: "event bus" },
          { x: -300, y: 50, t: "Kubernetes" },
          { x: 0, y: 50, t: "monitoring" },
          { x: 300, y: 50, t: "AI agent" },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y})`}>
            <rect x={-130} y={-26} width={260} height={52} rx={4} fill="none" stroke={INK_MUTE} strokeWidth={1.5} />
            <text x={0} y={9} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              {c.t}
            </text>
          </g>
        ))}
      </g>
      <text x={0} y={140} fontSize={22} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        — linh áp ngập trời · nghịch thiên cải mệnh
      </text>
    </g>

    {/* Bottom seal */}
    <SealStamp x={W - 140} y={H - 200} label="簡 道" />
  </g>
);

// ============ SLIDE 2: II. JUNIOR CHẤP NIỆM ============
const Slide2JuniorChapNiem: React.FC = () => (
  <g>
    <ChapterMark roman="II." label="CHẤP NIỆM CỦA JUNIOR" />

    {/* Quote frame */}
    <g transform={`translate(${W / 2}, 700)`}>
      {/* Big opening quote */}
      <text x={-380} y={-100} fontSize={140} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        "
      </text>

      <text x={0} y={-80} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        Nếu người khác
      </text>
      <text x={0} y={-10} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        đọc không hiểu code
      </text>
      <text x={0} y={60} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        của ta...
      </text>

      <line x1={-200} y1={130} x2={200} y2={130} stroke={SEAL} strokeWidth={2} />

      <text x={0} y={200} fontSize={56} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        Chứng tỏ cảnh giới
      </text>
      <text x={0} y={270} fontSize={56} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        của ta ĐỦ CAO.
      </text>

      <text x={380} y={290} fontSize={140} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        "
      </text>
    </g>

    <DotsDivider y={1230} />

    {/* Attribution */}
    <g transform={`translate(${W / 2}, 1320)`}>
      <text x={0} y={0} fontSize={22} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
        — junior kiếm tu, ẩn danh
      </text>
    </g>

    {/* Bottom irony */}
    <g transform={`translate(${W / 2}, 1500)`}>
      <text x={0} y={0} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        ai cũng từng nghĩ vậy
      </text>
    </g>
  </g>
);

// ============ SLIDE 3: III. PRODUCTION TÂM MA ============
const Slide3ProductionTamMa: React.FC = () => (
  <g>
    <ChapterMark roman="III." label="PRODUCTION · TÂM MA HIỆN HÌNH" />

    {/* Symptoms */}
    <g transform={`translate(${W / 2}, 440)`}>
      <text x={0} y={0} fontSize={28} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
        Cho tới một ngày...
      </text>
    </g>

    {/* 3 symptoms */}
    <g transform={`translate(${W / 2}, 700)`}>
      {[
        { y: -100, n: "01", t: "Bug sinh ra từ nơi không ai ngờ" },
        { y: 0, n: "02", t: "1 thay đổi nhỏ · sập cả trận pháp" },
        { y: 100, n: "03", t: "Mỗi lần deploy · mở ra thiên kiếp" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={-440} y={12} fontSize={28} fill={SEAL} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
            {r.n}
          </text>
          <line x1={-360} y1={0} x2={-340} y2={0} stroke={INK_MUTE} strokeWidth={2} />
          <text x={-320} y={12} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
            {r.t}
          </text>
        </g>
      ))}
    </g>

    <DotsDivider y={1020} />

    {/* Midnight scene */}
    <g transform={`translate(${W / 2}, 1140)`}>
      <text x={0} y={0} fontSize={24} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
        ĐÊM KHUYA · MỞ LẠI CODE 6 THÁNG TRƯỚC
      </text>
    </g>

    {/* The question */}
    <g transform={`translate(${W / 2}, 1370)`}>
      <text x={-380} y={-80} fontSize={120} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        "
      </text>
      <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="2">
        Đây rốt cuộc là
      </text>
      <text x={0} y={75} fontSize={64} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="3">
        công pháp gì?
      </text>
      <text x={380} y={130} fontSize={120} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        "
      </text>
    </g>
  </g>
);

// ============ SLIDE 4: IV. ĐẠO LÝ TÀN NHẪN ============
const Slide4DaoLyTanNhan: React.FC = () => (
  <g>
    <ChapterMark roman="IV." label="ĐẠO LÝ TÀN NHẪN" />

    {/* The first truth */}
    <g transform={`translate(${W / 2}, 530)`}>
      <text x={0} y={0} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2">
        Viết code chạy được...
      </text>
      <text x={0} y={120} fontSize={104} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        KHÔNG KHÓ
      </text>
    </g>

    {/* Separator */}
    <g transform={`translate(${W / 2}, 900)`}>
      <line x1={-180} y1={0} x2={180} y2={0} stroke={INK} strokeWidth={2} />
      <text x={0} y={50} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="6" fontStyle="italic">
        nhưng
      </text>
      <line x1={-180} y1={100} x2={180} y2={100} stroke={INK} strokeWidth={2} />
    </g>

    {/* The hard truth */}
    <g transform={`translate(${W / 2}, 1240)`}>
      <text x={0} y={0} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2">
        Ba tháng sau...
      </text>
      <text x={0} y={120} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        VẪN CÒN NGƯỜI
      </text>
      <text x={0} y={220} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        DÁM SỬA = KHÓ
      </text>
    </g>

    <SealStamp x={W - 140} y={H - 200} label="難 道" />
  </g>
);

// ============ SLIDE 5: V. ĐẠI NĂNG ĐƠN GIẢN ============
const Slide5DaiNangDonGian: React.FC = () => (
  <g>
    <ChapterMark roman="V." label="ĐẠI NĂNG · CỰC KỲ ĐƠN GIẢN" />

    {/* Subtitle */}
    <g transform={`translate(${W / 2}, 440)`}>
      <text x={0} y={0} fontSize={28} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        Tu lâu trong tiên giới công nghệ...
      </text>
    </g>

    {/* 3 NOT */}
    <g transform={`translate(${W / 2}, 800)`}>
      {[
        { y: -180, t: "không thích FLEX framework" },
        { y: -20, t: "không thích KHOE architecture" },
        { y: 140, t: "không biến mọi thứ thành ĐẠI TRẬN" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={-440} y={12} fontSize={36} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            ×
          </text>
          <text x={-380} y={14} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="1">
            {r.t}
          </text>
        </g>
      ))}
    </g>

    <DotsDivider y={1230} />

    {/* The reason */}
    <g transform={`translate(${W / 2}, 1430)`}>
      <text x={0} y={0} fontSize={28} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        Họ đã nhìn quá nhiều tông môn
      </text>
      <text x={0} y={50} fontSize={32} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
        tự huỷ diệt bởi chính kỹ thuật mình tôn thờ
      </text>
    </g>
  </g>
);

// ============ SLIDE 6: VI. QUY LUẬT KỲ LẠ ============
const Slide6QuyLuat: React.FC = () => (
  <g>
    <ChapterMark roman="VI." label="QUY LUẬT KỲ LẠ" />

    {/* Two sides */}
    <g transform={`translate(${W / 2}, 700)`}>
      {/* Phàm nhân */}
      <g transform={`translate(0, -200)`}>
        <text x={0} y={0} fontSize={28} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
          PHÀM NHÂN
        </text>
        <line x1={-180} y1={30} x2={180} y2={30} stroke={INK_MUTE} strokeWidth={1.5} />
        <text x={0} y={110} fontSize={84} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
          thích PHỨC TẠP
        </text>
      </g>

      {/* Divider */}
      <g transform={`translate(0, 130)`}>
        <text x={0} y={0} fontSize={42} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8">
          ↕
        </text>
      </g>

      {/* Đại năng */}
      <g transform={`translate(0, 320)`}>
        <text x={0} y={0} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">
          ĐẠI NĂNG
        </text>
        <line x1={-180} y1={30} x2={180} y2={30} stroke={SEAL} strokeWidth={1.5} />
        <text x={0} y={110} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
          truy cầu ĐƠN GIẢN
        </text>
      </g>
    </g>

    <DotsDivider y={1500} />
  </g>
);

// ============ SLIDE 7: VII. CẢNH GIỚI THẬT SỰ ============
const Slide7CanhGioi: React.FC = () => (
  <g>
    <ChapterMark roman="VII." label="CẢNH GIỚI THẬT SỰ" />

    {/* 3 truths */}
    <g transform={`translate(${W / 2}, 720)`}>
      {[
        { y: -200, big: "Một hàm", small: "dễ đọc" },
        { y: 0, big: "Một hệ thống", small: "ổn định" },
        { y: 200, big: "Một service", small: "ba năm · không ai phải đụng" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={0} y={0} fontSize={68} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            {r.big}
          </text>
          <text x={0} y={48} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" letterSpacing="3">
            {r.small}
          </text>
        </g>
      ))}
    </g>

    <DotsDivider y={1540} />
  </g>
);

// ============ SLIDE 8: VIII. ĐẠI ĐẠO TỐI CAO ============
const Slide8DaiDao: React.FC = () => (
  <g>
    <ChapterMark roman="VIII." label="ĐẠI ĐẠO TỐI CAO" />

    {/* Massive final wisdom */}
    <g transform={`translate(${W / 2}, 480)`}>
      <text x={0} y={0} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
        Càng về cuối...
      </text>
      <text x={0} y={130} fontSize={92} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
        ĐẠI ĐẠO TỐI CAO
      </text>
      <text x={0} y={220} fontSize={36} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" letterSpacing="3">
        thường nhìn qua cực kỳ bình thường
      </text>
    </g>

    <DotsDivider y={960} />

    {/* 3 truths of best code */}
    <g transform={`translate(${W / 2}, 1180)`}>
      <text x={0} y={-100} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2">
        Những dòng code tốt nhất:
      </text>
      {[
        { y: -30, t: "không PHÔ TRƯƠNG" },
        { y: 30, t: "không HÀO NHOÁNG" },
        { y: 90, t: "âm thầm CHỐNG ĐỠ cả thế giới" },
      ].map((r, i) => (
        <g key={i} transform={`translate(0, ${r.y})`}>
          <text x={0} y={12} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
            — {r.t}
          </text>
        </g>
      ))}
    </g>

    {/* CTA bottom */}
    <g transform={`translate(${W / 2}, 1560)`}>
      <line x1={-180} y1={-40} x2={180} y2={-40} stroke={INK} strokeWidth={1.5} />
      <text x={0} y={0} fontSize={22} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
        save · share · follow truyền kỳ
      </text>
      <line x1={-180} y1={26} x2={180} y2={26} stroke={INK} strokeWidth={1.5} />
    </g>

    <SealStamp x={W - 140} y={H - 200} label="簡 道" />
  </g>
);

export const SlideCarouselDonGianDaiDao: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Intro />}
        {slideNum === 2 && <Slide2JuniorChapNiem />}
        {slideNum === 3 && <Slide3ProductionTamMa />}
        {slideNum === 4 && <Slide4DaoLyTanNhan />}
        {slideNum === 5 && <Slide5DaiNangDonGian />}
        {slideNum === 6 && <Slide6QuyLuat />}
        {slideNum === 7 && <Slide7CanhGioi />}
        {slideNum === 8 && <Slide8DaiDao />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
