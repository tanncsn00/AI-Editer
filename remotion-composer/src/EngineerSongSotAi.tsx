import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./engineer_song_sot_ai_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const SURVIVOR_GREEN = "#5BE8A8";
const PURPLE = "#B47AFF";
const ORANGE = "#FFA552";
const GRID = "#FFFFFF";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

// Animation utils — opacity-based only (avoid SVG transform conflicts)
const useFade = (entryFrame: number, durationFrames = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const useScale = (entryFrame: number, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, scale };
};

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="esgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="esgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="esglow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.05" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="esscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#esgrid)" />
        <rect width={W} height={H} fill="url(#esgrid2)" />
        <rect width={W} height={H} fill="url(#esglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#esscan)" />
        <g stroke={AMBER} strokeWidth={1.5} opacity={0.5}>
          <path d="M 30 30 L 30 60 M 30 30 L 60 30" fill="none" />
          <path d={`M ${W - 30} 30 L ${W - 30} 60 M ${W - 30} 30 L ${W - 60} 30`} fill="none" />
          <path d={`M 30 ${H - 30} L 30 ${H - 60} M 30 ${H - 30} L 60 ${H - 30}`} fill="none" />
          <path d={`M ${W - 30} ${H - 30} L ${W - 30} ${H - 60} M ${W - 30} ${H - 30} L ${W - 60} ${H - 30}`} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const totalFrames = duration * FPS;
  const scale = interpolate(frame, [0, totalFrames], [1.0, 1.03], { extrapolateRight: "clamp" });
  return (
    <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>
      {children}
    </div>
  );
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const o1 = useFade(0, 10);
  const o2 = useFade(4, 10);
  const o3 = useFade(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={o1}>
        [{num} / 08]
      </text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={o2 * 0.5} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" opacity={o3}>
        {label}
      </text>
    </g>
  );
};

const FigFooter: React.FC<{ num: string; label: string }> = ({ num, label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
      fig.{num} · {label}
    </text>
  </g>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
      ⚡ truyền kỳ · engineer survival · AGI 2026
    </text>
  </g>
);

const TechBox: React.FC<{ x: number; y: number; w: number; h: number; color?: string; thick?: number }> = ({ x, y, w, h, color = AMBER, thick = 2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y} x2={x + w + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y + h} x2={x + 6} y2={y + h} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y + h} x2={x + w + 6} y2={y + h} stroke={color} strokeWidth={thick} />
  </g>
);

// Loại badge - large pill
const LoaiBadge: React.FC<{ num: string; name: string; color: string; entryFrame: number }> = ({ num, name, color, entryFrame }) => {
  const o = useFade(entryFrame, 12);
  const s = useScale(entryFrame, 16);
  return (
    <g opacity={o} transform={`translate(${W / 2}, 310) scale(${s.scale})`}>
      <rect x={-460} y={-50} width={920} height={100} rx={50} fill={BG_CARD} stroke={color} strokeWidth={3} />
      <g>
        <circle cx={-380} cy={0} r={28} fill={color} />
        <text x={-380} y={9} fontSize={22} fill={BG_NAVY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>{num}</text>
      </g>
      <text x={-310} y={12} fontSize={32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {name}
      </text>
    </g>
  );
};

// ============ SLIDE 1: AI THIÊN KIẾP · 16.15s ============
// Voice frames:
// 0-90: chapter + "Trong tiên giới công nghệ, AI đang giống một trận thiên kiếp chưa từng có"
// 90-140: "Mỗi ngày đều có người nói:"
// 140-210: "lập trình viên sắp bị thay thế"
// 210-280: "AI viết code nhanh hơn con người"
// 280-360: "Software engineer sắp tuyệt chủng"
// 360-484: "Nghe lâu ngày, rất nhiều junior đạo tâm bắt đầu bất ổn"
const Slide1Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const title1 = useFade(20, 14);
  const title2 = useScale(60, 18);

  const quoteIntro = useFade(95, 12);
  const q1 = useFade(145, 12);
  const q2 = useFade(215, 12);
  const q3 = useFade(285, 12);

  const result = useFade(365, 14);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="AI THIÊN KIẾP" />

          {/* Massive title */}
          <text x={W / 2} y={350} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="3" fontStyle="italic" opacity={title1}>
            Các loại engineer
          </text>
          <g opacity={title2.opacity} transform={`translate(${W / 2}, 460) scale(${title2.scale})`}>
            <text x={0} y={0} fontSize={84} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              SỐNG SÓT
            </text>
            <text x={0} y={100} fontSize={84} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              QUA ĐẠI KIẾP AI
            </text>
          </g>

          {/* Quote intro */}
          <text x={W / 2} y={780} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={quoteIntro}>
            ▸ MỖI NGÀY ĐỀU CÓ NGƯỜI NÓI:
          </text>

          {/* 3 doom quotes */}
          <g transform={`translate(${W / 2}, 900)`} opacity={q1}>
            <TechBox x={-460} y={-30} w={920} h={60} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"</text>
            <text x={-410} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              Lập trình viên sắp bị thay thế.
            </text>
          </g>

          <g transform={`translate(${W / 2}, 1000)`} opacity={q2}>
            <TechBox x={-460} y={-30} w={920} h={60} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"</text>
            <text x={-410} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              AI viết code nhanh hơn con người.
            </text>
          </g>

          <g transform={`translate(${W / 2}, 1100)`} opacity={q3}>
            <TechBox x={-460} y={-30} w={920} h={60} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"</text>
            <text x={-410} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              SE sắp tuyệt chủng.
            </text>
          </g>

          {/* Result */}
          <g opacity={result}>
            <TechBox x={W / 2 - 460} y={1280} w={920} h={140} color={AMBER} thick={2} />
            <text x={W / 2} y={1330} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // junior reaction
            </text>
            <text x={W / 2} y={1390} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              Đạo tâm bắt đầu BẤT ỔN
            </text>
          </g>

          <FigFooter num="1" label="ai doomsday narrative" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 2: ĐẠI NĂNG HIỂU · 18.65s ============
// 0-100: "Nhưng các đại năng thật sự lại hiểu một chuyện"
// 100-180: "AI không huỷ diệt toàn bộ engineer"
// 180-240: "Nó chỉ đào thải những kẻ:"
// 240-300: "không hiểu mình đang làm gì"
// 300-360: "chỉ copy công pháp của người khác"
// 360-440: "chưa từng thật sự lĩnh ngộ đại đạo software engineering"
// 440-559: "Cho nên sau đại kiếp AI, vẫn sẽ có những loại engineer sống sót"
const Slide2DaiNangHieu: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFade(30, 14);
  const reveal = useScale(110, 18);
  const filterIntro = useFade(190, 12);

  const k1 = useFade(245, 12);
  const k2 = useFade(305, 12);
  const k3 = useFade(365, 12);

  const result = useFade(445, 14);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="AI ONLY ELIMINATES NON-UNDERSTANDERS" />

          <text x={W / 2} y={350} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={intro}>
            Đại năng thật sự lại hiểu:
          </text>

          {/* Big reveal */}
          <g opacity={reveal.opacity} transform={`translate(${W / 2}, 500) scale(${reveal.scale})`}>
            <text x={0} y={0} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              AI KHÔNG HUỶ DIỆT
            </text>
            <text x={0} y={80} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              TOÀN BỘ ENGINEER
            </text>
          </g>

          {/* Filter intro */}
          <text x={W / 2} y={730} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={filterIntro}>
            ▸ NÓ CHỈ ĐÀO THẢI:
          </text>

          {/* 3 kinds being eliminated */}
          <g transform={`translate(${W / 2}, 880)`} opacity={k1}>
            <TechBox x={-470} y={-32} w={940} h={64} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={12} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ 01</text>
            <text x={-360} y={12} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              không hiểu mình đang làm gì
            </text>
          </g>

          <g transform={`translate(${W / 2}, 1000)`} opacity={k2}>
            <TechBox x={-470} y={-32} w={940} h={64} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={12} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ 02</text>
            <text x={-360} y={12} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              chỉ copy công pháp người khác
            </text>
          </g>

          <g transform={`translate(${W / 2}, 1120)`} opacity={k3}>
            <TechBox x={-470} y={-32} w={940} h={64} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={12} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ 03</text>
            <text x={-360} y={12} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              chưa lĩnh ngộ đại đạo SE
            </text>
          </g>

          {/* Result */}
          <g opacity={result}>
            <TechBox x={W / 2 - 470} y={1280} w={940} h={140} color={SURVIVOR_GREEN} thick={2.5} />
            <text x={W / 2} y={1330} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // survivors
            </text>
            <text x={W / 2} y={1390} fontSize={32} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              Vẫn có 5 LOẠI engineer sống sót
            </text>
          </g>

          <FigFooter num="2" label="elimination criteria · 3 traits" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 3: LOẠI 1 GỐC RỄ · 15.52s ============
// 0-60: chapter + "Loại thứ nhất. Kiếm tu hiểu gốc rễ."
// 60-100: "Loại engineer này hiểu:"
// 100-130: "network"
// 130-160: "operating system"
// 160-200: "database"
// 200-220: "memory"
// 220-260: "architecture"
// 260-466: "AI có thể viết code nhanh. Nhưng khi production xuất hiện tâm ma, vẫn phải có người hiểu thiên đạo hệ thống để cứu thế"
const Slide3GocRe: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFade(70, 12);

  const it1 = useScale(100, 12);
  const it2 = useScale(130, 12);
  const it3 = useScale(160, 12);
  const it4 = useScale(200, 12);
  const it5 = useScale(220, 12);

  const reveal = useFade(275, 14);
  const reveal2 = useScale(330, 16);

  const items = [
    { x: -270, y: 0, t: "network", anim: it1 },
    { x: 0, y: 0, t: "OS", anim: it2 },
    { x: 270, y: 0, t: "database", anim: it3 },
    { x: -140, y: 110, t: "memory", anim: it4 },
    { x: 140, y: 110, t: "architecture", anim: it5 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="KIẾM TU HIỂU GỐC RỄ" />

          <LoaiBadge num="01" name="HIỂU GỐC RỄ" color={ACCENT_BLUE} entryFrame={5} />

          <text x={W / 2} y={500} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={intro}>
            ▾ LOẠI ENGINEER NÀY HIỂU:
          </text>

          {/* 5 fundamentals */}
          {items.map((it, i) => (
            <g key={i} transform={`translate(${W / 2 + it.x}, ${640 + it.y}) scale(${it.anim.scale})`} opacity={it.anim.opacity} style={{ transformOrigin: `${W / 2 + it.x}px ${640 + it.y}px`, transformBox: "view-box" }}>
              <rect x={-120} y={-35} width={240} height={70} rx={4} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
              <text x={0} y={11} fontSize={22} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Reveal */}
          <text x={W / 2} y={1010} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={reveal}>
            AI viết code nhanh. Nhưng khi production tâm ma...
          </text>

          <g opacity={reveal2.opacity} transform={`translate(${W / 2}, 1240) scale(${reveal2.scale})`}>
            <TechBox x={-470} y={-100} w={940} h={200} color={AMBER} thick={2.5} />
            <text x={0} y={-50} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // who saves production?
            </text>
            <text x={0} y={10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Vẫn phải có người hiểu
            </text>
            <text x={0} y={60} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              THIÊN ĐẠO HỆ THỐNG
            </text>
          </g>

          <FigFooter num="3" label="kiếm tu · fundamentals layer" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 4: LOẠI 2 TRẬN PHÁP SƯ · 15.27s ============
// 0-60: chapter + "Loại thứ hai. Trận pháp sư hệ thống."
// 60-100: "Những người thật sự hiểu:"
// 100-130: "scalability"
// 130-170: "distributed system"
// 170-200: "infra"
// 200-240: "reliability"
// 240-458: "AI rất giỏi viết từng đoạn nhỏ. Nhưng dựng đại trận chống đỡ hàng triệu người dùng, vẫn là lĩnh vực của đại năng"
const Slide4TranPhap: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFade(70, 12);

  const it1 = useScale(100, 12);
  const it2 = useScale(130, 12);
  const it3 = useScale(170, 12);
  const it4 = useScale(200, 12);

  const reveal = useFade(255, 14);
  const reveal2 = useScale(310, 16);

  const items = [
    { x: -240, y: 0, t: "scalability", anim: it1 },
    { x: 240, y: 0, t: "distributed", anim: it2 },
    { x: -240, y: 130, t: "infra", anim: it3 },
    { x: 240, y: 130, t: "reliability", anim: it4 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="TRẬN PHÁP SƯ HỆ THỐNG" />

          <LoaiBadge num="02" name="TRẬN PHÁP SƯ" color={SURVIVOR_GREEN} entryFrame={5} />

          <text x={W / 2} y={500} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={intro}>
            ▾ NHỮNG NGƯỜI HIỂU:
          </text>

          {/* 4 vocab cards 2x2 grid */}
          {items.map((it, i) => (
            <g key={i} transform={`translate(${W / 2 + it.x}, ${670 + it.y}) scale(${it.anim.scale})`} opacity={it.anim.opacity}>
              <rect x={-200} y={-44} width={400} height={88} rx={4} fill={BG_CARD} stroke={SURVIVOR_GREEN} strokeWidth={2} />
              <text x={0} y={14} fontSize={26} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Reveal */}
          <text x={W / 2} y={1030} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={reveal}>
            AI giỏi viết đoạn nhỏ. Nhưng đại trận triệu user...
          </text>

          <g opacity={reveal2.opacity} transform={`translate(${W / 2}, 1240) scale(${reveal2.scale})`}>
            <TechBox x={-470} y={-100} w={940} h={200} color={AMBER} thick={2.5} />
            <text x={0} y={-50} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // who builds the empire?
            </text>
            <text x={0} y={10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Vẫn là lĩnh vực của
            </text>
            <text x={0} y={60} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              ĐẠI NĂNG
            </text>
          </g>

          <FigFooter num="4" label="system architects · scale guardians" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 5: LOẠI 3 TRADE-OFF · 18.02s ============
// 0-60: chapter + "Loại thứ ba. Thiên cơ sư biết trade-off."
// 60-130: "Junior thường nghĩ kỹ thuật có đúng sai"
// 130-200: "Senior biết: mọi thứ chỉ là trade-off"
// 200-260: "Nhanh hơn thì khó maintain hơn"
// 260-320: "Scale tốt hơn thì phức tạp hơn"
// 320-380: "Ship nhanh hơn thì technical debt nhiều hơn"
// 380-541: "Loại engineer hiểu được cân bằng này, rất khó bị thay thế"
const Slide5TradeOff: React.FC<{ duration: number }> = ({ duration }) => {
  const jr = useFade(70, 12);
  const sr = useFade(140, 12);

  const t1 = useFade(210, 12);
  const t2 = useFade(275, 12);
  const t3 = useFade(335, 12);

  const reveal = useScale(395, 18);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THIÊN CƠ SƯ TRADE-OFF" />

          <LoaiBadge num="03" name="HIỂU TRADE-OFF" color={ACCENT_BLUE} entryFrame={5} />

          {/* Jr vs Sr */}
          <g transform={`translate(${W / 2}, 500)`} opacity={jr}>
            <text x={-440} y={0} fontSize={24} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>JR ▸</text>
            <text x={-360} y={0} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
              kỹ thuật có ĐÚNG / SAI
            </text>
          </g>

          <g transform={`translate(${W / 2}, 580)`} opacity={sr}>
            <text x={-440} y={0} fontSize={24} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>SR ▸</text>
            <text x={-360} y={0} fontSize={26} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              mọi thứ chỉ là TRADE-OFF
            </text>
          </g>

          {/* 3 trade-offs */}
          <g transform={`translate(${W / 2}, 770)`} opacity={t1}>
            <TechBox x={-470} y={-38} w={940} h={76} color={ACCENT_BLUE} thick={1.5} />
            <text x={-440} y={14} fontSize={22} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>
            <text x={-390} y={14} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              nhanh hơn  ⇆  khó maintain hơn
            </text>
          </g>

          <g transform={`translate(${W / 2}, 880)`} opacity={t2}>
            <TechBox x={-470} y={-38} w={940} h={76} color={ACCENT_BLUE} thick={1.5} />
            <text x={-440} y={14} fontSize={22} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>
            <text x={-390} y={14} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              scale tốt hơn  ⇆  phức tạp hơn
            </text>
          </g>

          <g transform={`translate(${W / 2}, 990)`} opacity={t3}>
            <TechBox x={-470} y={-38} w={940} h={76} color={ACCENT_BLUE} thick={1.5} />
            <text x={-440} y={14} fontSize={22} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>
            <text x={-390} y={14} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              ship nhanh hơn  ⇆  tech debt nhiều hơn
            </text>
          </g>

          {/* Reveal */}
          <g opacity={reveal.opacity} transform={`translate(${W / 2}, 1310) scale(${reveal.scale})`}>
            <TechBox x={-470} y={-100} w={940} h={200} color={AMBER} thick={2.5} />
            <text x={0} y={-50} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // balance master
            </text>
            <text x={0} y={10} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Hiểu được cân bằng này
            </text>
            <text x={0} y={60} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              RẤT KHÓ BỊ THAY THẾ
            </text>
          </g>

          <FigFooter num="5" label="trade-off masters · the balance dao" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 6: LOẠI 4 CON NGƯỜI · 19.78s ============
// 0-60: chapter + "Loại thứ tư. Đạo tu con người."
// 60-110: "Đây là loại junior ít để ý nhất"
// 110-180: "Nhưng càng lên cao càng đáng sợ"
// 180-220: "Bọn họ:"
// 220-260: "giao tiếp tốt"
// 260-300: "giải thích rõ ràng"
// 300-340: "dẫn dắt team"
// 340-380: "hiểu business"
// 380-450: "giữ cho tông môn không tự huỷ diệt vì drama"
// 450-540: "AI có thể generate code"
// 540-593: "Nhưng chưa thể dẫn một đội ngũ vượt qua thiên kiếp production lúc 3 giờ sáng"
const Slide6ConNguoi: React.FC<{ duration: number }> = ({ duration }) => {
  const intro1 = useFade(70, 12);
  const intro2 = useFade(115, 12);
  const listIntro = useFade(180, 12);

  const s1 = useScale(225, 10);
  const s2 = useScale(265, 10);
  const s3 = useScale(305, 10);
  const s4 = useScale(345, 10);
  const s5 = useScale(385, 10);

  const reveal = useFade(460, 14);
  const reveal2 = useScale(540, 16);

  const skills = [
    { x: -340, y: 0, t: "giao tiếp", anim: s1 },
    { x: -110, y: 0, t: "giải thích", anim: s2 },
    { x: 130, y: 0, t: "dẫn dắt team", anim: s3 },
    { x: 360, y: 0, t: "business", anim: s4 },
    { x: 0, y: 110, t: "anti-drama", anim: s5, big: true },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="ĐẠO TU CON NGƯỜI" />

          <LoaiBadge num="04" name="ĐẠO TU CON NGƯỜI" color={PURPLE} entryFrame={5} />

          <text x={W / 2} y={490} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" opacity={intro1}>
            ▸ junior ít để ý nhất
          </text>

          <text x={W / 2} y={530} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" opacity={intro2}>
            ▸ NHƯNG LÊN CAO CÀNG ĐÁNG SỢ
          </text>

          <text x={W / 2} y={640} fontSize={24} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={listIntro}>
            ▾ HỌ CÓ:
          </text>

          {/* 5 skills */}
          {skills.map((sk, i) => (
            <g key={i} transform={`translate(${W / 2 + sk.x}, ${750 + sk.y}) scale(${sk.anim.scale})`} opacity={sk.anim.opacity}>
              <rect x={sk.big ? -200 : -110} y={-32} width={sk.big ? 400 : 220} height={64} rx={4} fill={BG_CARD} stroke={PURPLE} strokeWidth={2} />
              <text x={0} y={11} fontSize={sk.big ? 24 : 20} fill={PURPLE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {sk.t}
              </text>
            </g>
          ))}

          {/* Reveal */}
          <text x={W / 2} y={1080} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={reveal}>
            AI generate code được. Nhưng...
          </text>

          <g opacity={reveal2.opacity} transform={`translate(${W / 2}, 1310) scale(${reveal2.scale})`}>
            <TechBox x={-470} y={-130} w={940} h={260} color={AMBER} thick={2.5} />
            <text x={0} y={-80} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // 3AM production crash · who leads?
            </text>
            <text x={0} y={-20} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              AI chưa thể dẫn 1 đội ngũ
            </text>
            <text x={0} y={30} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              vượt thiên kiếp lúc 3AM
            </text>
            <text x={0} y={80} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              — humans only zone
            </text>
          </g>

          <FigFooter num="6" label="people · leadership · drama-prevention" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 7: LOẠI 5 VÔ TÌNH HỌC ĐẠO · 21.72s ============
// 0-60: chapter + "Loại thứ năm. Vô tình học đạo."
// 60-120: "Đây mới là cảnh giới đáng sợ nhất"
// 120-180: "Loại engineer này không cố chống lại AI"
// 180-240: "Bọn họ trực tiếp luyện hoá AI thành pháp bảo của bản thân"
// 240-280: "Để AI viết phần lặp lại"
// 280-320: "Để AI generate boilerplate"
// 320-360: "Để AI tăng tốc tu luyện"
// 360-420: "Nhưng phần kiến trúc"
// 420-460: "quyết định"
// 460-500: "tư duy hệ thống"
// 500-560: "và trách nhiệm cuối cùng, vẫn do chính mình nắm giữ"
const Slide7VoTinh: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFade(70, 12);
  const fearful = useScale(130, 18);
  const noResist = useFade(190, 14);

  // Use AI for
  const useHeader = useFade(245, 12);
  const u1 = useScale(245, 10);
  const u2 = useScale(290, 10);
  const u3 = useScale(330, 10);

  // Keep
  const keepHeader = useFade(380, 12);
  const k1 = useScale(385, 10);
  const k2 = useScale(425, 10);
  const k3 = useScale(465, 10);
  const k4 = useScale(505, 10);

  const useItems = [
    { x: -310, t: "viết lặp", anim: u1 },
    { x: 0, t: "boilerplate", anim: u2 },
    { x: 310, t: "tăng tốc", anim: u3 },
  ];

  const keepItems = [
    { x: -340, t: "kiến trúc", anim: k1 },
    { x: -115, t: "quyết định", anim: k2 },
    { x: 115, t: "tư duy hệ thống", anim: k3 },
    { x: 340, t: "trách nhiệm", anim: k4 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="VÔ TÌNH HỌC ĐẠO" />

          <LoaiBadge num="05" name="LUYỆN HOÁ AI" color={ORANGE} entryFrame={5} />

          <text x={W / 2} y={490} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={intro}>
            ▾ CẢNH GIỚI ĐÁNG SỢ NHẤT
          </text>

          <g opacity={fearful.opacity} transform={`translate(${W / 2}, 600) scale(${fearful.scale})`}>
            <text x={0} y={0} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" fontStyle="italic">
              KHÔNG CHỐNG AI
            </text>
            <text x={0} y={70} fontSize={44} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" fontStyle="italic">
              → LUYỆN AI THÀNH PHÁP BẢO
            </text>
          </g>

          {/* Use AI for */}
          <text x={W / 2} y={840} fontSize={22} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={useHeader}>
            ✓ DELEGATE TO AI:
          </text>

          {useItems.map((it, i) => (
            <g key={i} transform={`translate(${W / 2 + it.x}, 930) scale(${it.anim.scale})`} opacity={it.anim.opacity}>
              <rect x={-100} y={-30} width={200} height={60} rx={4} fill={BG_CARD} stroke={SURVIVOR_GREEN} strokeWidth={1.5} />
              <text x={0} y={9} fontSize={20} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Keep for self */}
          <text x={W / 2} y={1080} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={keepHeader}>
            ✗ KEEP FOR HUMAN:
          </text>

          {keepItems.map((it, i) => (
            <g key={i} transform={`translate(${W / 2 + it.x}, 1170) scale(${it.anim.scale})`} opacity={it.anim.opacity}>
              <rect x={-100} y={-30} width={200} height={60} rx={4} fill={BG_CARD} stroke={AMBER} strokeWidth={1.5} />
              <text x={0} y={9} fontSize={18} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Final */}
          <g opacity={keepHeader}>
            <TechBox x={W / 2 - 470} y={1340} w={940} h={130} color={ORANGE} thick={2.5} />
            <text x={W / 2} y={1380} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // human keeps control
            </text>
            <text x={W / 2} y={1430} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              AI = pháp bảo · không phải đạo
            </text>
          </g>

          <FigFooter num="7" label="ai as tool · human keeps soul" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 8: SỐNG SÓT SAU AGI · 29.73s ============
// 0-100: chapter + "Cho nên đại kiếp AI thật sự rất tàn nhẫn"
// 100-180: "Nó khiến rất nhiều người nhận ra:"
// 180-280: "thứ mình từng gọi là kỹ năng, thật ra chỉ là lao động lặp lại"
// 280-360: "Nhưng cũng chính vì vậy"
// 360-460: "những engineer thật sự hiểu đại đạo công nghệ, sẽ trở nên giá trị hơn bao giờ hết"
// 460-540: "Trong tương lai, code có thể được AI sinh ra vô hạn"
// 540-640: "Nhưng những người hiểu:"
// 640-690: "vì sao hệ thống tồn tại"
// 690-740: "nên xây gì"
// 740-790: "không nên xây gì"
// 790-850: "và hậu quả của từng quyết định kỹ thuật"
// 850-892: "vẫn sẽ là những kẻ sống sót cuối cùng sau đại kiếp AGI"
const Slide8FinalAGI: React.FC<{ duration: number }> = ({ duration }) => {
  const realize = useFade(110, 14);
  const truth = useScale(190, 18);

  const but = useFade(290, 12);
  const value = useScale(370, 18);

  const future = useFade(470, 14);

  const q1 = useFade(640, 12);
  const q2 = useFade(695, 12);
  const q3 = useFade(745, 12);
  const q4 = useFade(795, 12);

  const final = useScale(855, 18);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="SỐNG SÓT SAU AGI" />

          <text x={W / 2} y={310} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={realize}>
            Đại kiếp AI rất tàn nhẫn. Nó khiến nhận ra:
          </text>

          <g opacity={truth.opacity} transform={`translate(${W / 2}, 430) scale(${truth.scale})`}>
            <TechBox x={-470} y={-60} w={940} h={120} color={WARNING_RED} thick={2.5} />
            <text x={0} y={-10} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // harsh truth
            </text>
            <text x={0} y={40} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              "kỹ năng" = lao động lặp lại
            </text>
          </g>

          <text x={W / 2} y={680} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="3" fontStyle="italic" opacity={but}>
            NHƯNG ↓
          </text>

          <g opacity={value.opacity} transform={`translate(${W / 2}, 800) scale(${value.scale})`}>
            <TechBox x={-470} y={-60} w={940} h={120} color={SURVIVOR_GREEN} thick={2.5} />
            <text x={0} y={-10} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // survivors
            </text>
            <text x={0} y={40} fontSize={28} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              Engineer hiểu đại đạo · GIÁ TRỊ HƠN
            </text>
          </g>

          {/* Future statement */}
          <text x={W / 2} y={1000} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" opacity={future}>
            // future: AI generates code infinitely
          </text>
          <text x={W / 2} y={1040} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" opacity={future}>
            ▾ NHƯNG NHỮNG NGƯỜI HIỂU:
          </text>

          {/* 4 questions */}
          <g transform={`translate(${W / 2}, 1130)`} opacity={q1}>
            <TechBox x={-470} y={-26} w={940} h={52} color={AMBER} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>01 ▸</text>
            <text x={-380} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              Vì sao hệ thống tồn tại?
            </text>
          </g>
          <g transform={`translate(${W / 2}, 1200)`} opacity={q2}>
            <TechBox x={-470} y={-26} w={940} h={52} color={AMBER} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>02 ▸</text>
            <text x={-380} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              Nên xây gì?
            </text>
          </g>
          <g transform={`translate(${W / 2}, 1270)`} opacity={q3}>
            <TechBox x={-470} y={-26} w={940} h={52} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>03 ▸</text>
            <text x={-380} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              KHÔNG nên xây gì?
            </text>
          </g>
          <g transform={`translate(${W / 2}, 1340)`} opacity={q4}>
            <TechBox x={-470} y={-26} w={940} h={52} color={AMBER_BRIGHT} thick={2} />
            <text x={-440} y={10} fontSize={20} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>04 ▸</text>
            <text x={-380} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
              Hậu quả của từng quyết định
            </text>
          </g>

          {/* Final */}
          <g opacity={final.opacity} transform={`translate(${W / 2}, 1500) scale(${final.scale})`}>
            <text x={0} y={0} fontSize={28} fill={SURVIVOR_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="2">
              KẺ SỐNG SÓT CUỐI CÙNG SAU AGI
            </text>
          </g>

          <FigFooter num="8" label="post-AGI survivors · the deep ones" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [Slide1Intro, Slide2DaiNangHieu, Slide3GocRe, Slide4TranPhap, Slide5TradeOff, Slide6ConNguoi, Slide7VoTinh, Slide8FinalAGI];

export const EngineerSongSotAi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("engineer_song_sot_ai/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <Slide duration={b.duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
