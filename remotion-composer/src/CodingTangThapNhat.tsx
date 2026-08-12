import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./coding_tang_thap_nhat_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// Blueprint palette
const BG_NAVY = "#0F1B2E";
const BG_NAVY_LIGHT = "#1A2942";
const BG_CARD = "#15243B";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

// ========== ANIMATION UTILS ==========
const useFadeUp = (entryFrame: number, durationFrames = 14) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(frame, [entryFrame, entryFrame + durationFrames], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};

const useScaleIn = (entryFrame: number, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};

const useLineDraw = (entryFrame: number, durationFrames = 20) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { strokeDasharray: 1000, strokeDashoffset: 1000 * (1 - progress) };
};

// ========== BLUEPRINT BG ==========
const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="bpgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="bpglow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.05" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scanline" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#bpgrid)" />
        <rect width={W} height={H} fill="url(#bpgrid2)" />
        <rect width={W} height={H} fill="url(#bpglow)" />
        {/* Scanline */}
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#scanline)" />
        {/* Corner markers */}
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

// Section header [XX / 08]
const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const anim1 = useFadeUp(0, 10);
  const anim2 = useFadeUp(4, 10);
  const anim3 = useFadeUp(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={anim1}>
        [{num} / 08]
      </text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={0.5} style={anim2} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={anim3}>
        {label}
      </text>
    </g>
  );
};

// Footer figure label
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
      ⚡ truyền kỳ · software engineering · 2026
    </text>
  </g>
);

// Tech box with bracket corners
const TechBox: React.FC<{ x: number; y: number; w: number; h: number; color?: string; thick?: number }> = ({ x, y, w, h, color = AMBER, thick = 2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={thick} />
    {/* Corner bracket accents */}
    <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y} x2={x + w + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y + h} x2={x + 6} y2={y + h} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y + h} x2={x + w + 6} y2={y + h} stroke={color} strokeWidth={thick} />
  </g>
);

// ============ SLIDE 1: JUNIOR ASSUMPTION · 15.54s ============
// Voice frames:
// 0-90: chapter + "Thuở mới nhập code đạo, rất nhiều kiếm tu đều cho rằng:"
// 90-180: "ai viết code nhanh hơn, người đó mạnh hơn" → big quote
// 180-240: "Cho nên ngày đêm khổ luyện:" → list intro
// 240-270: "LeetCode" → item 1
// 270-300: "thuật toán" → item 2
// 300-340: "framework mới" → item 3
// 340-380: "tốc độ gõ phím như tàn ảnh" → item 4
// 380-466: "Lúc ấy bọn họ tin rằng: chỉ cần code đủ mạnh, ta sẽ chứng đạo" → conclusion
const Slide1Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const title1 = useFadeUp(30, 14);
  const title2 = useScaleIn(60, 18);
  const title3 = useFadeUp(110, 14);

  const quote = useScaleIn(150, 18);

  const listIntro = useFadeUp(220, 12);
  const item1 = useScaleIn(245, 12);
  const item2 = useScaleIn(275, 12);
  const item3 = useScaleIn(305, 12);
  const item4 = useScaleIn(345, 12);

  const conclusion = useFadeUp(395, 14);

  const items = [
    { x: -340, t: "LeetCode", anim: item1 },
    { x: -110, t: "thuật toán", anim: item2 },
    { x: 130, t: "framework", anim: item3 },
    { x: 360, t: "typing speed", anim: item4 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="JUNIOR ASSUMPTION" />

          {/* Massive title */}
          <text x={W / 2} y={340} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="3" fontStyle="italic" style={title1}>
            Vì sao
          </text>
          <g style={{ ...title2, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={440} fontSize={88} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              CODING
            </text>
          </g>
          <text x={W / 2} y={520} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2" fontStyle="italic" style={title3}>
            chỉ là
          </text>
          <text x={W / 2} y={620} fontSize={88} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" style={title3}>
            TẦNG THẤP NHẤT
          </text>

          {/* Quote */}
          <g style={{ ...quote, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={780} w={880} h={140} color={AMBER} thick={1.5} />
            <text x={W / 2} y={830} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">
              // junior assumption
            </text>
            <text x={W / 2} y={890} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              "code nhanh hơn = mạnh hơn"
            </text>
          </g>

          {/* List intro */}
          <text x={W / 2} y={1060} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={listIntro}>
            ▸ NGÀY ĐÊM KHỔ LUYỆN
          </text>

          {/* 4 items */}
          {items.map((it, i) => (
            <g key={i} style={{ ...it.anim, transformOrigin: `${W / 2 + it.x}px 1180px`, transformBox: "fill-box" }}>
              <TechBox x={W / 2 + it.x - 100} y={1140} w={200} h={80} color={ACCENT_BLUE} thick={1.5} />
              <text x={W / 2 + it.x} y={1188} fontSize={20} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Conclusion */}
          <text x={W / 2} y={1480} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={conclusion}>
            "Code đủ mạnh · ta sẽ chứng đạo"
          </text>

          <FigFooter num="1" label="junior assumption · false premise" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 2: TIME ALLOCATION · 10.03s ============
// 0-100: "Nhưng càng tu luyện lâu... càng phát hiện một sự thật rất kỳ lạ"
// 100-200: "Những đại năng thật sự, thường không dành quá nhiều thời gian để viết code"
const Slide2Time: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(30, 14);
  const factTitle = useScaleIn(80, 18);
  const codeBar = useFadeUp(160, 18);
  const thinkBar = useFadeUp(190, 18);
  const reveal = useFadeUp(230, 14);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="TIME ALLOCATION" />

          <text x={W / 2} y={340} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Càng tu luyện lâu · càng phát hiện sự thật:
          </text>

          {/* Big stat */}
          <g style={{ ...factTitle, transformOrigin: `${W / 2}px 500px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={500} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">
              SENIOR ENGINEER · TIME SPLIT
            </text>
          </g>

          {/* Bar chart */}
          <g>
            {/* CODE bar */}
            <g style={codeBar}>
              <text x={W / 2 - 440} y={700} fontSize={24} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                CODING
              </text>
              <text x={W / 2 + 440} y={700} fontSize={32} fill={ACCENT_BLUE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>
                20%
              </text>
              <rect x={W / 2 - 440} y={720} width={880} height={36} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
              <rect x={W / 2 - 440} y={720} width={176} height={36} fill={ACCENT_BLUE} opacity={0.6} />
            </g>

            {/* THINK bar */}
            <g style={thinkBar}>
              <text x={W / 2 - 440} y={840} fontSize={24} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                THINKING · DESIGNING · TRADE-OFF
              </text>
              <text x={W / 2 + 440} y={840} fontSize={32} fill={AMBER} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>
                80%
              </text>
              <rect x={W / 2 - 440} y={860} width={880} height={36} fill={BG_CARD} stroke={AMBER} strokeWidth={1.5} />
              <rect x={W / 2 - 440} y={860} width={704} height={36} fill={AMBER} opacity={0.6} />
            </g>
          </g>

          {/* Reveal */}
          <g style={reveal}>
            <TechBox x={W / 2 - 460} y={1080} w={920} h={200} color={AMBER} thick={2} />
            <text x={W / 2} y={1140} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // observation
            </text>
            <text x={W / 2} y={1200} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              Đại năng không viết code nhiều
            </text>
            <text x={W / 2} y={1250} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              → họ THINK trước, code sau
            </text>
          </g>

          <FigFooter num="2" label="senior time allocation · empirical" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 3: PRE-CODE LAYER · 18.23s ============
// 0-90: "Bởi coding chỉ là bước cuối cùng" + "Trước khi viết... vô số thứ phải suy diễn:"
// 90-150: "hệ thống sẽ scale thế nào"
// 150-210: "dữ liệu chảy ra sao"
// 210-270: "service nào sẽ trở thành điểm chết"
// 270-330: "latency tăng ở đâu"
// 330-390: "production sập thì ai gánh thiên kiếp"
// 390-547: "Đó mới là đại đạo thật sự của software engineering"
const Slide3PreCode: React.FC<{ duration: number }> = ({ duration }) => {
  const headerLine = useFadeUp(30, 14);
  const codingBox = useScaleIn(60, 16);
  const arrow = useFadeUp(90, 12);

  const item1 = useFadeUp(100, 12);
  const item2 = useFadeUp(160, 12);
  const item3 = useFadeUp(220, 12);
  const item4 = useFadeUp(280, 12);
  const item5 = useFadeUp(340, 12);

  const reveal = useScaleIn(400, 18);

  const items = [
    { y: -120, q: "scale?", t: "hệ thống sẽ scale thế nào", anim: item1 },
    { y: -60, q: "data flow?", t: "dữ liệu chảy ra sao", anim: item2 },
    { y: 0, q: "failure?", t: "service nào trở thành điểm chết", anim: item3 },
    { y: 60, q: "latency?", t: "latency tăng ở đâu", anim: item4 },
    { y: 120, q: "ownership?", t: "production sập · ai gánh thiên kiếp", anim: item5 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="PRE-CODE LAYER" />

          {/* Coding as last step */}
          <text x={W / 2} y={330} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={headerLine}>
            ▸ CODING IS ONLY THE LAST STEP
          </text>

          <g style={{ ...codingBox, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 160} y={370} w={320} h={80} color={ACCENT_BLUE} thick={2} />
            <text x={W / 2} y={420} fontSize={32} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
              [ write code ]
            </text>
          </g>

          {/* Arrow up indicating prerequisites */}
          <g style={arrow}>
            <line x1={W / 2} y1={490} x2={W / 2} y2={550} stroke={AMBER} strokeWidth={1.5} strokeDasharray="6 4" />
            <text x={W / 2 + 20} y={530} fontSize={16} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              ← requires
            </text>
          </g>

          {/* 5 questions */}
          {items.map((it, i) => (
            <g key={i} transform={`translate(${W / 2}, ${850 + it.y})`} opacity={it.anim.opacity}>
              <rect x={-460} y={-22} width={920} height={44} fill={BG_CARD} stroke={AMBER} strokeWidth={1.5} />
              <text x={-440} y={10} fontSize={20} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">
                ▸ {it.q}
              </text>
              <text x={-180} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
                {it.t}
              </text>
            </g>
          ))}

          {/* Big reveal */}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 1380px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={1320} w={920} h={140} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1370} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // the real đại đạo
            </text>
            <text x={W / 2} y={1420} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              đó mới là SOFTWARE ENGINEERING
            </text>
          </g>

          <FigFooter num="3" label="pre-code considerations · 5 layers" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 4: MINDSET DIFF · 6.24s ============
// 0-90: "Junior kiếm tu thường nghĩ: code chạy là được"
// 90-187: "Senior đại năng lại nghĩ: năm sau còn ai dám sửa không?"
const Slide4Mindset: React.FC<{ duration: number }> = ({ duration }) => {
  const labelJ = useFadeUp(15, 10);
  const boxJ = useScaleIn(25, 14);
  const quoteJ = useFadeUp(50, 12);

  const labelS = useFadeUp(95, 10);
  const boxS = useScaleIn(105, 14);
  const quoteS = useFadeUp(130, 12);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="MINDSET DIFF" />

          {/* Junior */}
          <text x={W / 2} y={420} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" style={labelJ}>
            ▸ JUNIOR
          </text>

          <g style={{ ...boxJ, transformOrigin: `${W / 2}px 550px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={470} w={920} h={160} color={ACCENT_BLUE} thick={2} />
            <text x={W / 2} y={530} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // thinks:
            </text>
            <text x={W / 2} y={595} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              "code chạy là được"
            </text>
          </g>

          {/* Senior */}
          <text x={W / 2} y={1000} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" style={labelS}>
            ▸ SENIOR
          </text>

          <g style={{ ...boxS, transformOrigin: `${W / 2}px 1130px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={1050} w={920} h={160} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1110} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // thinks:
            </text>
            <text x={W / 2} y={1175} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              "năm sau còn ai dám sửa?"
            </text>
          </g>

          {/* Diff arrow */}
          <g style={quoteJ}>
            <line x1={W / 2 - 60} y1={830} x2={W / 2 + 60} y2={830} stroke={AMBER} strokeWidth={1.5} strokeDasharray="5 5" />
            <text x={W / 2} y={870} fontSize={20} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="3">
              · time horizon ·
            </text>
          </g>

          <FigFooter num="4" label="cognitive scope difference" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 5: SENIOR VOCABULARY · 16.51s ============
// 0-150: chapter + "Cho nên càng lên cảnh giới cao... ít nói về syntax. Bọn họ nói về:"
// 210-240: trade-off
// 240-270: architecture
// 270-300: reliability
// 300-360: maintainability
// 360-400: con người
// 400-450: thời gian
// 450-495: "Bởi thứ khó nhất chưa bao giờ là viết code. Xây hệ thống sống sót qua thời gian"
const Slide5Vocab: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const less = useFadeUp(80, 14);
  const v1 = useScaleIn(210, 12);
  const v2 = useScaleIn(240, 12);
  const v3 = useScaleIn(270, 12);
  const v4 = useScaleIn(300, 12);
  const v5 = useScaleIn(360, 12);
  const v6 = useScaleIn(400, 12);
  const reveal = useFadeUp(450, 14);

  const vocab = [
    { x: -330, y: 0, t: "trade-off", anim: v1 },
    { x: 0, y: 0, t: "architecture", anim: v2 },
    { x: 330, y: 0, t: "reliability", anim: v3 },
    { x: -330, y: 100, t: "maintainability", anim: v4 },
    { x: 0, y: 100, t: "team people", anim: v5 },
    { x: 330, y: 100, t: "time", anim: v6 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="SENIOR VOCABULARY" />

          <text x={W / 2} y={340} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={intro}>
            Càng lên cảnh giới cao...
          </text>

          {/* What they say less */}
          <g style={less}>
            <text x={W / 2} y={460} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">
              ▾ less talk · syntax
            </text>
          </g>

          {/* What they say MORE */}
          <text x={W / 2} y={580} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={intro}>
            ▴ more talk · the deep stuff
          </text>

          {/* 6 vocab cards grid */}
          {vocab.map((v, i) => (
            <g key={i} transform={`translate(${W / 2 + v.x}, ${770 + v.y})`} opacity={v.anim.opacity}>
              <TechBox x={-140} y={-32} w={280} h={64} color={AMBER} thick={1.5} />
              <text x={0} y={10} fontSize={22} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {v.t}
              </text>
            </g>
          ))}

          {/* Big reveal */}
          <g style={reveal}>
            <TechBox x={W / 2 - 480} y={1130} w={960} h={220} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1185} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // the hardest part is NEVER coding
            </text>
            <text x={W / 2} y={1240} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Xây hệ thống có thể
            </text>
            <text x={W / 2} y={1300} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="2">
              SỐNG SÓT QUA THỜI GIAN
            </text>
          </g>

          <FigFooter num="5" label="senior vocabulary · what they discuss" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 6: CODE HALF-LIFE · 17.12s ============
// 0-120: "Có những đoạn code, viết trong một đêm là xong"
// 120-240: "Nhưng hậu quả của nó, có thể khiến cả tông môn trả giá nhiều năm"
// 240-360: "Cho nên một vị kiếm tu chỉ biết code"
// 360-420: "giống như người chỉ biết vung kiếm"
// 420-450: "Có thể thắng vài trận nhỏ"
// 450-514: "Nhưng không thể dựng nên đại tông môn"
const Slide6HalfLife: React.FC<{ duration: number }> = ({ duration }) => {
  const tlLabel = useFadeUp(30, 14);
  const night = useScaleIn(60, 14);
  const arrowR = useFadeUp(150, 12);
  const years = useScaleIn(180, 14);

  const analogy = useFadeUp(290, 14);
  const swordsman = useScaleIn(340, 16);
  const winSmall = useFadeUp(420, 12);
  const cantBuild = useScaleIn(450, 16);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="CODE HALF-LIFE" />

          {/* Timeline label */}
          <text x={W / 2} y={340} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" style={tlLabel}>
            ▸ TIMELINE · COST
          </text>

          {/* Timeline */}
          <g transform={`translate(0, 460)`}>
            {/* 1 night box */}
            <g style={{ ...night, transformOrigin: `${W / 2 - 280}px 50px`, transformBox: "fill-box" }}>
              <TechBox x={W / 2 - 420} y={0} w={280} h={100} color={ACCENT_BLUE} thick={2} />
              <text x={W / 2 - 280} y={40} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
                effort
              </text>
              <text x={W / 2 - 280} y={80} fontSize={32} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
                1 đêm
              </text>
            </g>

            {/* Arrow */}
            <g style={arrowR}>
              <line x1={W / 2 - 130} y1={50} x2={W / 2 + 130} y2={50} stroke={AMBER} strokeWidth={2} strokeDasharray="8 4" />
              <text x={W / 2} y={30} fontSize={18} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
                consequence →
              </text>
              <polygon points={`${W / 2 + 130},44 ${W / 2 + 145},50 ${W / 2 + 130},56`} fill={AMBER} />
            </g>

            {/* Years box */}
            <g style={{ ...years, transformOrigin: `${W / 2 + 280}px 50px`, transformBox: "fill-box" }}>
              <TechBox x={W / 2 + 140} y={0} w={280} h={100} color={WARNING_RED} thick={2.5} />
              <text x={W / 2 + 280} y={40} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
                cost
              </text>
              <text x={W / 2 + 280} y={80} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
                MANY YEARS
              </text>
            </g>
          </g>

          {/* Analogy */}
          <text x={W / 2} y={840} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={analogy}>
            Kiếm tu chỉ biết code...
          </text>

          <g style={{ ...swordsman, transformOrigin: `${W / 2}px 970px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={960} fontSize={108} textAnchor="middle">⚔️</text>
            <text x={W / 2} y={1050} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              ~ người chỉ biết vung kiếm
            </text>
          </g>

          {/* Win/Lose */}
          <g transform={`translate(${W / 2}, 1250)`}>
            <g style={winSmall}>
              <text x={-440} y={-20} fontSize={24} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                ✓ thắng vài trận nhỏ
              </text>
            </g>
            <g style={cantBuild}>
              <line x1={-460} y1={20} x2={460} y2={20} stroke={WARNING_RED} strokeWidth={1.5} opacity={0.5} />
              <text x={-440} y={70} fontSize={28} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
                ✗ KHÔNG dựng đại tông môn
              </text>
            </g>
          </g>

          <FigFooter num="6" label="code half-life · 1 night → years cost" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 7: SYSTEM SCOPE · 10.77s ============
// 0-120: "Đại năng thật sự là người hiểu: kỹ thuật chỉ là một phần của hệ thống"
// 120-180: "Phần còn lại là:"
// 180-210: con người
// 210-240: vận hành
// 240-270: tài nguyên
// 270-300: thời gian
// 300-323: "trade-off không có đáp án hoàn hảo"
const Slide7Scope: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const tech = useScaleIn(70, 16);
  const rest = useFadeUp(135, 14);

  const c1 = useScaleIn(180, 12);
  const c2 = useScaleIn(210, 12);
  const c3 = useScaleIn(240, 12);
  const c4 = useScaleIn(270, 12);
  const c5 = useScaleIn(300, 12);

  const components = [
    { angle: 0, label: "con người", anim: c1 },
    { angle: 72, label: "vận hành", anim: c2 },
    { angle: 144, label: "tài nguyên", anim: c3 },
    { angle: 216, label: "thời gian", anim: c4 },
    { angle: 288, label: "trade-off", anim: c5 },
  ];

  const radius = 290;
  const cx = W / 2;
  const cy = 1050;

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="SYSTEM SCOPE" />

          <text x={W / 2} y={340} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={intro}>
            Kỹ thuật chỉ là 1 phần của hệ thống
          </text>

          {/* Center tech node */}
          <g style={{ ...tech, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
            <circle cx={cx} cy={cy} r={90} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={cx} y={cy - 10} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>tech</text>
            <text x={cx} y={cy + 22} fontSize={30} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>20%</text>
          </g>

          {/* Surrounding components */}
          {components.map((c, i) => {
            const a = (c.angle - 90) * Math.PI / 180;
            const x = cx + radius * Math.cos(a);
            const y = cy + radius * Math.sin(a);
            return (
              <g key={i} style={{ ...c.anim, transformOrigin: `${x}px ${y}px`, transformBox: "fill-box" }}>
                <line x1={cx + 90 * Math.cos(a)} y1={cy + 90 * Math.sin(a)} x2={x - 60 * Math.cos(a)} y2={y - 60 * Math.sin(a)} stroke={AMBER} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
                <circle cx={x} cy={y} r={56} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
                <text x={x} y={y + 6} fontSize={18} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.label}</text>
              </g>
            );
          })}

          {/* Bottom note */}
          <text x={W / 2} y={1500} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" style={rest}>
            // không có đáp án hoàn hảo
          </text>

          <FigFooter num="7" label="system scope · tech is only one node" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 8: DEEP LAYER · 22.02s ============
// 0-60: "Rất nhiều junior hỏi: làm sao để trở thành senior?"
// 60-180: "Nhưng bọn họ không biết rằng, khoảnh khắc suy nghĩ vượt ra ngoài code, mới là lúc bước vào software engineering"
// 180-240: "Coding chỉ là viết ra công pháp"
// 240-360: "Còn software engineering, là hiểu vì sao công pháp đó tồn tại"
// 360-420: "nó sẽ huỷ diệt ai"
// 420-580: "và liệu tông môn có sống sót sau lần độ kiếp tiếp theo hay không"
const Slide8Final: React.FC<{ duration: number }> = ({ duration }) => {
  const question = useFadeUp(20, 14);
  const reveal1 = useScaleIn(180, 18);

  const coding = useScaleIn(220, 14);
  const se = useScaleIn(280, 14);

  const q1 = useFadeUp(330, 12);
  const q2 = useFadeUp(395, 12);
  const q3 = useFadeUp(450, 12);

  const cta = useFadeUp(560, 14);

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="DEEP LAYER · WISDOM" />

          {/* Question */}
          <text x={W / 2} y={340} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={question}>
            "Làm sao để trở thành senior?"
          </text>

          {/* Answer comparison */}
          <g transform={`translate(${W / 2}, 530)`}>
            <g style={{ ...coding, transformOrigin: `-240px 0px`, transformBox: "fill-box" }}>
              <TechBox x={-440} y={-50} w={400} h={100} color={ACCENT_BLUE} thick={2} />
              <text x={-240} y={-15} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// coding</text>
              <text x={-240} y={25} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>viết công pháp</text>
            </g>

            <text x={0} y={5} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>vs</text>

            <g style={{ ...se, transformOrigin: `240px 0px`, transformBox: "fill-box" }}>
              <TechBox x={40} y={-50} w={400} h={100} color={AMBER} thick={2.5} />
              <text x={240} y={-15} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// engineering</text>
              <text x={240} y={25} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hiểu công pháp</text>
            </g>
          </g>

          {/* The 3 questions of SE */}
          <text x={W / 2} y={770} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" style={reveal1}>
            ▾ SE = ANSWER 3 QUESTIONS
          </text>

          <g transform={`translate(${W / 2}, 920)`} opacity={q1.opacity}>
            <TechBox x={-460} y={-30} w={920} h={60} color={AMBER} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>01 ▸</text>
            <text x={-380} y={10} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Vì sao công pháp tồn tại?</text>
          </g>
          <g transform={`translate(${W / 2}, 1020)`} opacity={q2.opacity}>
            <TechBox x={-460} y={-30} w={920} h={60} color={WARNING_RED} thick={1.5} />
            <text x={-440} y={10} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>02 ▸</text>
            <text x={-380} y={10} fontSize={24} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nó sẽ huỷ diệt ai?</text>
          </g>
          <g transform={`translate(${W / 2}, 1120)`} opacity={q3.opacity}>
            <TechBox x={-460} y={-30} w={920} h={60} color={AMBER_BRIGHT} thick={2} />
            <text x={-440} y={10} fontSize={20} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>03 ▸</text>
            <text x={-380} y={10} fontSize={22} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tông môn sống sót độ kiếp?</text>
          </g>

          {/* CTA */}
          <g transform={`translate(${W / 2}, 1500)`} style={cta}>
            <line x1={-200} y1={-30} x2={200} y2={-30} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={10} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
              save · follow · truyền kỳ AI hằng tuần
            </text>
            <line x1={-200} y1={40} x2={200} y2={40} stroke={AMBER} strokeWidth={1} />
          </g>

          <FigFooter num="8" label="software engineering · the deep layer" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [Slide1Intro, Slide2Time, Slide3PreCode, Slide4Mindset, Slide5Vocab, Slide6HalfLife, Slide7Scope, Slide8Final];

export const CodingTangThapNhat: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("coding_tang_thap_nhat/voice.mp3")} />
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
