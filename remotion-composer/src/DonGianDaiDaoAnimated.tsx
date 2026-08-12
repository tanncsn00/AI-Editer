import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./don_gian_dai_dao_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;
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

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

// ========== ANIMATION UTILS ==========
const useFadeUp = (entryFrame: number, durationFrames = 14) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(frame, [entryFrame, entryFrame + durationFrames], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};

const useScaleIn = (entryFrame: number, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};

const useStampIn = (entryFrame: number, config: { fps: number }) => {
  const frame = useCurrentFrame();
  const t = spring({ frame: frame - entryFrame, fps: config.fps, config: { damping: 8, stiffness: 80, mass: 0.8 } });
  const opacity = interpolate(frame, [entryFrame, entryFrame + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(t, [0, 1], [2, 1]);
  const rotate = interpolate(t, [0, 1], [-20, -4]);
  return { opacity, scale, rotate };
};

// ========== ANIMATED BG ==========
const AnimatedBG: React.FC = () => {
  const frame = useCurrentFrame();
  const dustY = (offset: number) => ((frame * 0.4 + offset) % H) - 30;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="anbg1" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#FFFCF5" stopOpacity="1" />
            <stop offset="100%" stopColor={BG_CREAM} stopOpacity="1" />
          </radialGradient>
          <radialGradient id="anbg2" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor={BG_CREAM_DARK} stopOpacity="0.4" />
            <stop offset="100%" stopColor={BG_CREAM} stopOpacity="0" />
          </radialGradient>
          <pattern id="angrain" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="40" r="0.5" fill={INK_FAINT} opacity="0.3" />
            <circle cx="120" cy="80" r="0.4" fill={INK_FAINT} opacity="0.25" />
            <circle cx="170" cy="50" r="0.6" fill={INK_FAINT} opacity="0.3" />
            <circle cx="60" cy="160" r="0.4" fill={INK_FAINT} opacity="0.25" />
            <circle cx="140" cy="180" r="0.5" fill={INK_FAINT} opacity="0.3" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#anbg1)" />
        <rect width={W} height={H} fill="url(#anbg2)" />
        <rect width={W} height={H} fill="url(#angrain)" />

        {Array.from({ length: 24 }).map((_, i) => {
          const x = ((i * 137) % W);
          const seed = (i * 53) % 300;
          const y = dustY(seed);
          const r = 1 + ((i * 7) % 3);
          const opacity = 0.2 + ((i * 11) % 30) / 100;
          return (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 5 === 0 ? SEAL : INK_MUTE} opacity={opacity} />
          );
        })}

        <line x1={W * 0.7} y1={0} x2={W * 0.55} y2={H} stroke={SEAL} strokeWidth={0.3} opacity={0.06 + 0.04 * Math.sin(frame * 0.04)} />
      </svg>
    </AbsoluteFill>
  );
};

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const totalFrames = duration * FPS;
  const scale = interpolate(frame, [0, totalFrames], [1.0, 1.04], { extrapolateRight: "clamp" });
  const ty = interpolate(frame, [0, totalFrames], [0, -15], { extrapolateRight: "clamp" });
  return (
    <div style={{ width: "100%", height: "100%", transform: `scale(${scale}) translateY(${ty}px)`, transformOrigin: "center" }}>
      {children}
    </div>
  );
};

// Chapter mark animations - chapter always shows at start
const AnimatedChapterMark: React.FC<{ roman: string; label: string }> = ({ roman, label }) => {
  const line1 = useFadeUp(0, 10);
  const numAnim = useScaleIn(4, 14);
  const labelAnim = useFadeUp(8, 10);
  const line2 = useFadeUp(12, 10);

  return (
    <g transform={`translate(${W / 2}, 180)`}>
      <line x1={-60} y1={-40} x2={60} y2={-40} stroke={INK} strokeWidth={1.5} style={line1} />
      <g style={{ ...numAnim, transformOrigin: "50% 50%", transformBox: "fill-box" }}>
        <text x={0} y={20} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
          {roman}
        </text>
      </g>
      <text x={0} y={66} fontSize={16} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={labelAnim}>
        {label}
      </text>
      <line x1={-60} y1={86} x2={60} y2={86} stroke={INK} strokeWidth={1.5} style={line2} />
    </g>
  );
};

const AnimatedDotsDivider: React.FC<{ y: number; entryFrame: number }> = ({ y, entryFrame }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.2 * Math.sin(frame * 0.1);
  const d1 = useFadeUp(entryFrame, 8);
  const d2 = useFadeUp(entryFrame + 3, 8);
  const d3 = useFadeUp(entryFrame + 6, 8);
  return (
    <g transform={`translate(${W / 2}, ${y})`}>
      <circle cx={-22} cy={0} r={3.5} fill={INK_MUTE} style={d1} />
      <circle cx={0} cy={0} r={3.5 * pulse} fill={SEAL} style={d2} />
      <circle cx={22} cy={0} r={3.5} fill={INK_MUTE} style={d3} />
    </g>
  );
};

const AnimatedSealStamp: React.FC<{ x: number; y: number; entryFrame: number; label?: string }> = ({ x, y, entryFrame, label = "簡 道" }) => {
  const config = useVideoConfig();
  const anim = useStampIn(entryFrame, { fps: config.fps });
  return (
    <g transform={`translate(${x}, ${y}) rotate(${anim.rotate}) scale(${anim.scale})`} opacity={anim.opacity}>
      <rect x={-44} y={-44} width={88} height={88} rx={6} fill="none" stroke={SEAL} strokeWidth={4} />
      <text x={0} y={-2} fontSize={26} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        {label.split(" ")[0]}
      </text>
      <text x={0} y={30} fontSize={26} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        {label.split(" ")[1] || ""}
      </text>
    </g>
  );
};

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={18} fill={INK_FAINT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
      truyền kỳ · 簡 道 · 2026
    </text>
  </g>
);

// ============ SLIDE 1: I. THUỞ MỚI NHẬP · 22.81s ============
// Voice timing (frame):
//   0-15: "Thuở mới nhập code đạo" → chapter
//   15-55: "ai cũng từng nghĩ:" → subtitle "Khi dev bắt đầu hiểu"
//   55-120: "kiến trúc càng phức tạp" → "ĐƠN GIẢN"
//   120-180: "thì bản thân càng giống đại năng" → "mới là ĐẠI ĐẠO"
//   ...continues talking about complexity...
//   360-400: "Một cái API nhỏ. Nhưng phải:" → header line
//   400-420: "microservice"
//   420-440: "queue"
//   440-465: "event bus"
//   465-490: "Kubernetes"
//   490-515: "monitoring"
//   515-540: "AI agent"
//   540-620: "linh áp ngập trời · nghịch thiên cải mệnh"
const Slide1Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const sub1 = useFadeUp(20, 14);
  const big1 = useScaleIn(55, 22);
  const middle = useFadeUp(110, 14);
  const big2 = useScaleIn(140, 22);
  const dots = useFadeUp(310, 12);
  const stackHeader = useFadeUp(355, 12);

  const item1 = useScaleIn(400, 10);
  const item2 = useScaleIn(420, 10);
  const item3 = useScaleIn(440, 10);
  const item4 = useScaleIn(465, 10);
  const item5 = useScaleIn(490, 10);
  const item6 = useScaleIn(515, 10);

  const linhAp = useFadeUp(560, 14);

  const stackItems = [
    { x: -300, y: 0, t: "microservice", anim: item1 },
    { x: 0, y: 0, t: "queue", anim: item2 },
    { x: 300, y: 0, t: "event bus", anim: item3 },
    { x: -300, y: 80, t: "Kubernetes", anim: item4 },
    { x: 0, y: 80, t: "monitoring", anim: item5 },
    { x: 300, y: 80, t: "AI agent", anim: item6 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="I." label="THUỞ MỚI NHẬP CODE ĐẠO" />

          <text x={W / 2} y={480} fontSize={42} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="3" fontStyle="italic" style={sub1}>
            Khi dev bắt đầu hiểu...
          </text>
          <g style={{ ...big1, transformOrigin: `${W / 2}px 610px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={610} fontSize={138} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              ĐƠN GIẢN
            </text>
          </g>
          <text x={W / 2} y={690} fontSize={36} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="6" fontStyle="italic" style={middle}>
            mới là
          </text>
          <g style={{ ...big2, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={800} fontSize={120} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
              ĐẠI ĐẠO
            </text>
          </g>

          <AnimatedDotsDivider y={970} entryFrame={310} />

          <text x={W / 2} y={1080} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={stackHeader}>
            Một cái API nhỏ. Nhưng phải...
          </text>

          {stackItems.map((c, i) => (
            <g key={i} style={{ ...c.anim, transformOrigin: `${W / 2 + c.x}px ${1180 + c.y}px`, transformBox: "fill-box" }}>
              <rect x={W / 2 + c.x - 130} y={1180 + c.y - 26} width={260} height={52} rx={4} fill="none" stroke={INK_MUTE} strokeWidth={1.5} />
              <text x={W / 2 + c.x} y={1180 + c.y + 9} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
                {c.t}
              </text>
            </g>
          ))}

          <text x={W / 2} y={1410} fontSize={22} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={linhAp}>
            — linh áp ngập trời · nghịch thiên cải mệnh
          </text>

          <AnimatedSealStamp x={W - 140} y={H - 200} entryFrame={600} label="簡 道" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 2: II. CHẤP NIỆM · 8.55s ============
// Voice timing (frame):
//   0-90: "Lúc đó các junior kiếm tu luôn có một loại chấp niệm." → chapter
//   90-100: "Rằng:" → opening quote
//   100-130: "nếu người khác đọc không hiểu code của ta," → 3 lines
//   170-180: line separator
//   180-220: "chứng tỏ cảnh giới của ta đủ cao." → punchline
const Slide2Junior: React.FC<{ duration: number }> = ({ duration }) => {
  const q1 = useFadeUp(85, 8);
  const l1 = useFadeUp(95, 10);
  const l2 = useFadeUp(115, 10);
  const l3 = useFadeUp(140, 10);
  const line = useFadeUp(165, 10);
  const r1 = useScaleIn(180, 12);
  const r2 = useScaleIn(200, 12);
  const q2 = useFadeUp(220, 10);
  const attr = useFadeUp(235, 10);
  const irony = useFadeUp(245, 10);

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="II." label="CHẤP NIỆM CỦA JUNIOR" />

          <g transform={`translate(${W / 2}, 700)`}>
            <text x={-380} y={-100} fontSize={140} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={q1}>"</text>
            <text x={0} y={-80} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1" style={l1}>Nếu người khác</text>
            <text x={0} y={-10} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1" style={l2}>đọc không hiểu code</text>
            <text x={0} y={60} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1" style={l3}>của ta...</text>
            <line x1={-200} y1={130} x2={200} y2={130} stroke={SEAL} strokeWidth={2} style={line} />
            <g style={{ ...r1, transformOrigin: `0px 200px`, transformBox: "fill-box" }}>
              <text x={0} y={200} fontSize={56} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">Chứng tỏ cảnh giới</text>
            </g>
            <g style={{ ...r2, transformOrigin: `0px 270px`, transformBox: "fill-box" }}>
              <text x={0} y={270} fontSize={56} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">của ta ĐỦ CAO.</text>
            </g>
            <text x={380} y={290} fontSize={140} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={q2}>"</text>
          </g>

          <AnimatedDotsDivider y={1230} entryFrame={235} />

          <text x={W / 2} y={1320} fontSize={22} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4" style={attr}>
            — junior kiếm tu, ẩn danh
          </text>
          <text x={W / 2} y={1500} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={irony}>
            ai cũng từng nghĩ vậy
          </text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 3: III. PRODUCTION · 22.50s ============
// Voice timing (frame):
//   0-30: "Cho tới một ngày" → chapter
//   30-95: "Production bắt đầu xuất hiện tâm ma" → intro
//   95-170: "Bug sinh ra từ những nơi không ai ngờ tới" → row 01
//   170-260: "Một thay đổi nhỏ, kéo sập cả dây chuyền trận pháp" → row 02
//   260-336: "Mỗi lần deploy, đều giống mở ra thiên kiếp" → row 03
//   336-555: "Đêm khuya. Vị dev kia ngồi trước màn hình. Mở lại đoạn code do chính mình viết nửa năm trước. Nhìn hồi lâu. Trong lòng chỉ còn một câu:"
//   555-608: "đây rốt cuộc là công pháp gì?"
const Slide3Production: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 12);
  const row1 = useFadeUp(95, 12);
  const row2 = useFadeUp(175, 12);
  const row3 = useFadeUp(265, 12);
  const midnight = useFadeUp(345, 14);
  const q1 = useFadeUp(530, 10);
  const qLine1 = useScaleIn(545, 14);
  const qLine2 = useScaleIn(575, 14);
  const q2 = useFadeUp(610, 10);

  const symptoms = [
    { y: -100, n: "01", t: "Bug sinh ra từ nơi không ai ngờ", anim: row1 },
    { y: 0, n: "02", t: "1 thay đổi nhỏ · sập cả trận pháp", anim: row2 },
    { y: 100, n: "03", t: "Mỗi lần deploy · mở ra thiên kiếp", anim: row3 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="III." label="PRODUCTION · TÂM MA HIỆN HÌNH" />

          <text x={W / 2} y={440} fontSize={28} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Cho tới một ngày...
          </text>

          {symptoms.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${700 + r.y})`} style={r.anim}>
              <text x={-440} y={12} fontSize={28} fill={SEAL} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{r.n}</text>
              <line x1={-360} y1={0} x2={-340} y2={0} stroke={INK_MUTE} strokeWidth={2} />
              <text x={-320} y={12} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{r.t}</text>
            </g>
          ))}

          <AnimatedDotsDivider y={1020} entryFrame={330} />

          <text x={W / 2} y={1140} fontSize={24} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4" style={midnight}>
            ĐÊM KHUYA · MỞ LẠI CODE 6 THÁNG TRƯỚC
          </text>

          <g transform={`translate(${W / 2}, 1370)`}>
            <text x={-380} y={-80} fontSize={120} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={q1}>"</text>
            <g style={{ ...qLine1, transformOrigin: `0px 0px`, transformBox: "fill-box" }}>
              <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="2">Đây rốt cuộc là</text>
            </g>
            <g style={{ ...qLine2, transformOrigin: `0px 75px`, transformBox: "fill-box" }}>
              <text x={0} y={75} fontSize={64} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="3">công pháp gì?</text>
            </g>
            <text x={380} y={130} fontSize={120} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={q2}>"</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 4: IV. ĐẠO LÝ TÀN NHẪN · 9.11s ============
// Voice timing (frame):
//   0-120: "Từ khoảnh khắc đó, hắn mới bắt đầu hiểu được một đạo lý rất tàn nhẫn" → chapter
//   120-150: "Viết code chạy được" → intro line
//   150-175: "không khó" → big
//   175-180: pause
//   180-200: "Khó là:" → "nhưng" separator + "Ba tháng sau..."
//   200-225: "ba tháng sau" → intro2
//   225-249: "vẫn còn người dám sửa" → big 2 lines
const Slide4DaoLy: React.FC<{ duration: number }> = ({ duration }) => {
  const intro1 = useFadeUp(100, 12);
  const big1 = useScaleIn(125, 16);
  const sep = useFadeUp(165, 10);
  const but = useScaleIn(175, 12);
  const intro2 = useFadeUp(195, 12);
  const big2 = useScaleIn(215, 16);
  const big3 = useScaleIn(235, 16);

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="IV." label="ĐẠO LÝ TÀN NHẪN" />

          <text x={W / 2} y={530} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2" style={intro1}>
            Viết code chạy được...
          </text>
          <g style={{ ...big1, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={650} fontSize={104} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              KHÔNG KHÓ
            </text>
          </g>

          <g transform={`translate(${W / 2}, 900)`} style={sep}>
            <line x1={-180} y1={0} x2={180} y2={0} stroke={INK} strokeWidth={2} />
            <g style={{ ...but, transformOrigin: `0px 50px`, transformBox: "fill-box" }}>
              <text x={0} y={50} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="6" fontStyle="italic">nhưng</text>
            </g>
            <line x1={-180} y1={100} x2={180} y2={100} stroke={INK} strokeWidth={2} />
          </g>

          <text x={W / 2} y={1240} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2" style={intro2}>
            Ba tháng sau...
          </text>
          <g style={{ ...big2, transformOrigin: `${W / 2}px 1360px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1360} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              VẪN CÒN NGƯỜI
            </text>
          </g>
          <g style={{ ...big3, transformOrigin: `${W / 2}px 1460px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1460} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              DÁM SỬA = KHÓ
            </text>
          </g>

          <AnimatedSealStamp x={W - 140} y={H - 200} entryFrame={250} label="難 道" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 5: V. ĐẠI NĂNG ĐƠN GIẢN · 18.04s ============
// Voice timing (frame):
//   0-150: "Cho nên càng tu luyện lâu trong tiên giới công nghệ, nhiều đại năng càng trở nên cực kỳ đơn giản" → chapter + sub
//   150-200: "Không thích flex framework" → row 1
//   200-260: "Không thích khoe architecture" → row 2
//   260-340: "Không thích biến mọi thứ thành đại trận thượng cổ" → row 3
//   340-400: "Bởi họ đã nhìn quá nhiều tông môn" → reason1
//   400-540: "tự huỷ diệt bởi chính kỹ thuật mình tôn thờ" → reason2
const Slide5DaiNang: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(30, 14);
  const r1 = useFadeUp(155, 12);
  const r2 = useFadeUp(210, 12);
  const r3 = useFadeUp(270, 12);
  const reason1 = useFadeUp(345, 12);
  const reason2 = useScaleIn(400, 16);

  const rows = [
    { y: -180, t: "không thích FLEX framework", anim: r1 },
    { y: -20, t: "không thích KHOE architecture", anim: r2 },
    { y: 140, t: "không biến mọi thứ thành ĐẠI TRẬN", anim: r3 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="V." label="ĐẠI NĂNG · CỰC KỲ ĐƠN GIẢN" />

          <text x={W / 2} y={440} fontSize={28} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Tu lâu trong tiên giới công nghệ...
          </text>

          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${800 + r.y})`} style={r.anim}>
              <text x={-440} y={12} fontSize={36} fill={SEAL} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>×</text>
              <text x={-380} y={14} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} letterSpacing="1">{r.t}</text>
            </g>
          ))}

          <AnimatedDotsDivider y={1230} entryFrame={335} />

          <text x={W / 2} y={1430} fontSize={28} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={reason1}>
            Họ đã nhìn quá nhiều tông môn
          </text>
          <g style={{ ...reason2, transformOrigin: `${W / 2}px 1480px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1480} fontSize={32} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              tự huỷ diệt bởi chính kỹ thuật mình tôn thờ
            </text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 6: VI. QUY LUẬT · 5.97s ============
// Voice timing (frame):
//   0-77: "Trong code đạo có một quy luật rất kỳ lạ" → chapter
//   77-122: "Phàm nhân thích phức tạp" → top side
//   122-171: "Đại năng truy cầu đơn giản" → bottom side
const Slide6QuyLuat: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const arrowPulse = 1 + 0.15 * Math.sin(frame * 0.15);

  const top1 = useFadeUp(80, 8);
  const topLine = useFadeUp(88, 8);
  const topBig = useScaleIn(95, 14);
  const arrow = useScaleIn(115, 10);
  const bot1 = useFadeUp(125, 8);
  const botLine = useFadeUp(133, 8);
  const botBig = useScaleIn(140, 14);

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="VI." label="QUY LUẬT KỲ LẠ" />

          <g transform={`translate(${W / 2}, 500)`}>
            <text x={0} y={0} fontSize={28} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4" style={top1}>PHÀM NHÂN</text>
            <line x1={-180} y1={30} x2={180} y2={30} stroke={INK_MUTE} strokeWidth={1.5} style={topLine} />
            <g style={{ ...topBig, transformOrigin: `0px 110px`, transformBox: "fill-box" }}>
              <text x={0} y={110} fontSize={84} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">thích PHỨC TẠP</text>
            </g>
          </g>

          <g transform={`translate(${W / 2}, 830) scale(${arrowPulse})`} style={{ ...arrow, transformOrigin: `${W / 2}px 830px` }}>
            <text x={0} y={0} fontSize={42} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8">↕</text>
          </g>

          <g transform={`translate(${W / 2}, 1020)`}>
            <text x={0} y={0} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" style={bot1}>ĐẠI NĂNG</text>
            <line x1={-180} y1={30} x2={180} y2={30} stroke={SEAL} strokeWidth={1.5} style={botLine} />
            <g style={{ ...botBig, transformOrigin: `0px 110px`, transformBox: "fill-box" }}>
              <text x={0} y={110} fontSize={84} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">truy cầu ĐƠN GIẢN</text>
            </g>
          </g>

          <AnimatedDotsDivider y={1500} entryFrame={155} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 7: VII. CẢNH GIỚI · 7.16s ============
// Voice timing (frame):
//   0-30: chapter
//   30-50: "Một hàm dễ đọc" → row 1
//   50-100: "Một hệ thống ổn định" → row 2
//   100-180: "Một service chạy ba năm không ai phải đụng tới" → row 3
//   180-215: "Đó mới là cảnh giới thật sự" → dots
const Slide7CanhGioi: React.FC<{ duration: number }> = ({ duration }) => {
  const big1 = useScaleIn(30, 14);
  const small1 = useFadeUp(40, 10);
  const big2 = useScaleIn(60, 14);
  const small2 = useFadeUp(70, 10);
  const big3 = useScaleIn(105, 14);
  const small3 = useFadeUp(125, 10);

  const rows = [
    { y: -200, big: "Một hàm", small: "dễ đọc", bigAnim: big1, smallAnim: small1 },
    { y: 0, big: "Một hệ thống", small: "ổn định", bigAnim: big2, smallAnim: small2 },
    { y: 200, big: "Một service", small: "ba năm · không ai phải đụng", bigAnim: big3, smallAnim: small3 },
  ];

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="VII." label="CẢNH GIỚI THẬT SỰ" />

          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${720 + r.y})`}>
              <g style={{ ...r.bigAnim, transformOrigin: `0px 0px`, transformBox: "fill-box" }}>
                <text x={0} y={0} fontSize={68} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
                  {r.big}
                </text>
              </g>
              <text x={0} y={48} fontSize={28} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" letterSpacing="3" style={r.smallAnim}>
                {r.small}
              </text>
            </g>
          ))}

          <AnimatedDotsDivider y={1540} entryFrame={175} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 8: VIII. ĐẠI ĐẠO TỐI CAO · 13.76s ============
// Voice timing (frame):
//   0-75: "Càng về cuối, kiếm tu code đạo càng hiểu:" → chapter + intro
//   75-105: "đại đạo tối cao" → big title
//   105-170: "thường nhìn qua cực kỳ bình thường" → subtitle
//   170-235: "Giống như những dòng code tốt nhất" → "Những dòng code tốt nhất:"
//   235-265: "Không phô trương" → row 1
//   265-295: "Không hào nhoáng" → row 2
//   295-390: "Nhưng lại âm thầm chống đỡ cả một thế giới phía sau" → row 3
const Slide8DaiDao: React.FC<{ duration: number }> = ({ duration }) => {
  const sub1 = useFadeUp(20, 12);
  const big = useScaleIn(75, 16);
  const sub2 = useFadeUp(115, 14);
  const intro = useFadeUp(185, 12);
  const r1 = useFadeUp(240, 10);
  const r2 = useFadeUp(270, 10);
  const r3 = useFadeUp(300, 12);
  const cta = useFadeUp(380, 12);

  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <AnimatedBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <AnimatedChapterMark roman="VIII." label="ĐẠI ĐẠO TỐI CAO" />

          <text x={W / 2} y={480} fontSize={32} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub1}>
            Càng về cuối...
          </text>
          <g style={{ ...big, transformOrigin: `${W / 2}px 610px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={610} fontSize={92} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              ĐẠI ĐẠO TỐI CAO
            </text>
          </g>
          <text x={W / 2} y={700} fontSize={36} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" letterSpacing="3" style={sub2}>
            thường nhìn qua cực kỳ bình thường
          </text>

          <AnimatedDotsDivider y={960} entryFrame={170} />

          <text x={W / 2} y={1080} fontSize={26} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="2" style={intro}>
            Những dòng code tốt nhất:
          </text>
          <text x={W / 2} y={1150} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2" style={r1}>
            — không PHÔ TRƯƠNG
          </text>
          <text x={W / 2} y={1210} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2" style={r2}>
            — không HÀO NHOÁNG
          </text>
          <text x={W / 2} y={1270} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2" style={r3}>
            — âm thầm CHỐNG ĐỠ cả thế giới
          </text>

          <g transform={`translate(${W / 2}, 1560)`} style={cta}>
            <line x1={-180} y1={-40} x2={180} y2={-40} stroke={INK} strokeWidth={1.5} />
            <text x={0} y={0} fontSize={22} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
              save · share · follow truyền kỳ
            </text>
            <line x1={-180} y1={26} x2={180} y2={26} stroke={INK} strokeWidth={1.5} />
          </g>

          <AnimatedSealStamp x={W - 140} y={H - 200} entryFrame={395} label="簡 道" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [Slide1Intro, Slide2Junior, Slide3Production, Slide4DaoLy, Slide5DaiNang, Slide6QuyLuat, Slide7CanhGioi, Slide8DaiDao];

export const DonGianDaiDaoAnimated: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <Audio src={staticFile("don_gian_dai_dao/voice.mp3")} />
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
