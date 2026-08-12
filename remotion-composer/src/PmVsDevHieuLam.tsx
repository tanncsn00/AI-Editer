import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pm_vs_dev_hieu_lam_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "08";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";

// faction colors
const PM_C = ACCENT_BLUE;
const DEV_C = JADE;

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 16) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = ACCENT_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="pdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="pdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="pdglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#pdgrid)" />
        <rect width={W} height={H} fill="url(#pdgrid2)" />
        <rect width={W} height={H} fill="url(#pdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#pdscan)" />
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
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.03], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const a1 = useFadeUp(0, 10), a2 = useFade(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g>
      <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.5 * a2} />
      <text x={80} y={180} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="5" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 140} x2={W - 80} y2={H - 140} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={W / 2} y={H - 110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · giới IT · blueprint</text>
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

// badge for each misunderstanding
const Badge: React.FC<{ dot: string; text: string; color: string; entry?: number }> = ({ dot, text, color, entry = 0 }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 245px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 380} y={210} width={760} height={72} rx={36} fill={BG_TERM} stroke={color} strokeWidth={2.5} />
      <text x={W / 2} y={257} fontSize={28} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">{dot}  {text}</text>
    </g>
  );
};

// a side "thought" card — PM or Dev thinks something
const Think: React.FC<{ x: number; y: number; w: number; who: string; whoColor: string; quote: string; emoji: string; style?: React.CSSProperties }> = ({ x, y, w, who, whoColor, quote, emoji, style }) => (
  <g style={style}>
    <rect x={x} y={y} width={w} height={150} rx={14} fill={BG_CARD} stroke={whoColor} strokeWidth={2.5} />
    <text x={x + 28} y={y + 44} fontSize={22} fill={whoColor} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{who} nghĩ {emoji}</text>
    <text x={x + 28} y={y + 100} fontSize={29} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“{quote}”</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useFadeUp(20, 14);
  const fac = useScaleIn(60, 16);
  const bottom = useScaleIn(170, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="TWO FACTIONS · ONE PROJECT" />
          <g style={title}>
            <text x={W / 2} y={330} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Trong vô số tông môn công nghệ…</text>
            <text x={W / 2} y={395} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>2 nhánh tu sĩ hay hiểu lầm nhất:</text>
          </g>
          <g style={fac}>
            <rect x={W / 2 - 470} y={470} width={420} height={260} rx={18} fill={BG_CARD} stroke={PM_C} strokeWidth={3} />
            <text x={W / 2 - 260} y={580} fontSize={72} textAnchor="middle">📋</text>
            <text x={W / 2 - 260} y={650} fontSize={42} fill={PM_C} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>PM ĐẠO</text>
            <text x={W / 2 - 260} y={695} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// quản dự án</text>

            <text x={W / 2} y={612} fontSize={46} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>

            <rect x={W / 2 + 50} y={470} width={420} height={260} rx={18} fill={BG_CARD} stroke={DEV_C} strokeWidth={3} />
            <text x={W / 2 + 260} y={580} fontSize={72} textAnchor="middle">💻</text>
            <text x={W / 2 + 260} y={650} fontSize={42} fill={DEV_C} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DEV ĐẠO</text>
            <text x={W / 2 + 260} y={695} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// viết code</text>
          </g>
          <g style={{ ...bottom, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={790} w={960} h={210} color={AMBER} thick={3} />
            <text x={W / 2} y={855} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Cả hai đều muốn dự án thành công…</text>
            <text x={W / 2} y={915} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng luôn thấy đối phương</text>
            <text x={W / 2} y={968} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đang muốn mình… ĐỘ KIẾP ⚡</text>
          </g>
          <FigFooter label="PM vs Dev · 7 hiểu lầm kinh điển" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 HL1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const pm = useFadeUp(30, 14);
  const dev = useFadeUp(110, 14);
  const punch = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="UNDERESTIMATE" />
          <Badge dot="⚪" text="HIỂU LẦM THỨ NHẤT" color={TEXT_PRI} entry={0} />
          <Think x={W / 2 - 480} y={350} w={960} who="PM" whoColor={PM_C} emoji="📋" quote="Dev chỉ cần viết code." style={pm} />
          <Think x={W / 2 - 480} y={540} w={960} who="Dev" whoColor={DEV_C} emoji="💻" quote="PM chỉ cần viết tài liệu." style={dev} />
          <g style={{ ...punch, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={760} w={960} h={210} color={AMBER} thick={3} />
            <text x={W / 2} y={825} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tới ngày tự làm việc của nhau…</text>
            <text x={W / 2} y={885} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cả hai mới phát hiện:</text>
            <text x={W / 2} y={940} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã đánh giá thiên kiếp QUÁ ĐƠN GIẢN 😵</text>
          </g>
          <FigFooter label="đứng núi này · trông núi nọ thấp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 HL2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const ask = useFadeUp(30, 14);
  const hears = useScaleIn(200, 14);
  const means = useScaleIn(280, 14);
  const punch = useFadeUp(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="THE ESTIMATE TRAP" />
          <Badge dot="🟢" text="HIỂU LẦM THỨ HAI" color={JADE} entry={0} />
          <g style={ask}>
            <rect x={W / 2 - 480} y={340} width={960} height={120} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 440} y={388} fontSize={24} fill={PM_C} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM hỏi 📋</text>
            <text x={W / 2 - 440} y={432} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“Mất bao lâu?”  →  Dev: “Khoảng một tuần.”</text>
          </g>
          <g style={hears}>
            <rect x={W / 2 - 480} y={490} width={960} height={110} rx={14} fill="#0E1F35" stroke={PM_C} strokeWidth={2.5} />
            <text x={W / 2} y={530} fontSize={22} fill={PM_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM NGHE THẤY:</text>
            <text x={W / 2} y={575} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“CHẮC CHẮN một tuần.” ✅</text>
          </g>
          <g style={means}>
            <rect x={W / 2 - 480} y={620} width={960} height={250} rx={14} fill="#1A2410" stroke={DEV_C} strokeWidth={2.5} />
            <text x={W / 2} y={662} fontSize={22} fill={DEV_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>DEV THỰC RA MUỐN NÓI:</text>
            <text x={W / 2} y={708} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“NẾU thiên thời địa lợi nhân hòa…</text>
            <text x={W / 2} y={748} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không có bug · không đổi yêu cầu</text>
            <text x={W / 2} y={788} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phát sinh nghiệp lực…</text>
            <text x={W / 2} y={836} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>THÌ có thể một tuần.”</text>
          </g>
          <text x={W / 2} y={935} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={punch}>→ từ đó · nhân quả bắt đầu hình thành 🌀</text>
          <FigFooter label="estimate · lời tiên tri dễ vỡ nhất" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 HL3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const quote = useFadeUp(30, 14);
  const fear = useScaleIn(140, 14);
  const stats = [
    { n: "12", t: "SERVICE", c: ACCENT_BLUE },
    { n: "3", t: "DATABASE", c: VIOLET },
    { n: "27", t: "TICKET", c: WARNING_RED },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="'IT'S VERY SIMPLE'" />
          <Badge dot="🔵" text="HIỂU LẦM THỨ BA" color={ACCENT_BLUE} entry={0} />
          <g style={quote}>
            <rect x={W / 2 - 480} y={340} width={960} height={130} rx={14} fill={BG_CARD} stroke={PM_C} strokeWidth={2.5} />
            <text x={W / 2} y={388} fontSize={24} fill={PM_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM nói 📋</text>
            <text x={W / 2} y={438} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“Cái này rất ĐƠN GIẢN.”</text>
          </g>
          <g style={{ ...fear, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={528} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Dev nghe xong · đạo tâm rung động 😨</text>
            <text x={W / 2} y={580} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thứ nhìn ĐƠN GIẢN nhất = thứ ĐÁNG SỢ nhất</text>
          </g>
          <text x={W / 2} y={680} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(190, 12)}>1 nút bấm nhỏ · có thể kéo theo:</text>
          {stats.map((s, i) => (
            <g key={i} style={{ ...useScaleIn(230 + i * 45, 12), transformOrigin: `${W / 2}px ${800}px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 480 + i * 330} y={730} width={300} height={170} rx={16} fill={BG_TERM} stroke={s.c} strokeWidth={3} />
              <text x={W / 2 - 330 + i * 330} y={825} fontSize={66} fill={s.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{s.n}</text>
              <text x={W / 2 - 330 + i * 330} y={872} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{s.t}</text>
            </g>
          ))}
          <text x={W / 2} y={965} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(370, 12)}>“đơn giản” chỉ là phần nổi của tảng băng 🧊</text>
          <FigFooter label="iceberg · cái thấy ≠ cái phải làm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 HL4 ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const done = useFadeUp(30, 14);
  const pm = useFadeUp(110, 14);
  const levels = [
    { t: "“Xong rồi”", s: "// code chạy trên máy mình", c: JADE, e: 180 },
    { t: "“Deploy được rồi”", s: "// đã đẩy lên server", c: ORANGE, e: 230 },
    { t: "“Production ổn rồi”", s: "// thật sự sống sót ngoài đời", c: WARNING_RED, e: 280 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THREE REALMS OF 'DONE'" />
          <Badge dot="🟣" text="HIỂU LẦM THỨ TƯ" color={VIOLET} entry={0} />
          <g style={done}>
            <rect x={W / 2 - 480} y={340} width={960} height={110} rx={14} fill={BG_CARD} stroke={DEV_C} strokeWidth={2.5} />
            <text x={W / 2} y={408} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Dev nói 💻 “Xong rồi.”</text>
          </g>
          <text x={W / 2} y={510} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={pm}>PM vui mừng · chuẩn bị báo cáo trưởng lão 🎉</text>
          <text x={W / 2} y={585} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(150, 12)}>nhưng trong Dev Đạo · đó là 3 CẢNH GIỚI:</text>
          {levels.map((l, i) => {
            const y = 630 + i * 110;
            return (
              <g key={i} style={{ ...useScaleIn(l.e, 12), transformOrigin: `${W / 2}px ${y + 45}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 480} y={y} width={960} height={92} rx={14} fill={BG_CARD} stroke={l.c} strokeWidth={2.5} />
                <text x={W / 2 - 440} y={y + 40} fontSize={30} fill={l.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{l.t}</text>
                <text x={W / 2 - 440} y={y + 74} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{l.s}</text>
                <text x={W / 2 + 430} y={y + 58} fontSize={34} textAnchor="end">{["🟢", "🟠", "🔴"][i]}</text>
              </g>
            );
          })}
          <text x={W / 2} y={1010} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(330, 12)}>→ hoàn toàn KHÁC NHAU 😅</text>
          <FigFooter label="'done' · 1 từ · 3 thế giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 HL5 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const wrong = useFadeUp(30, 14);
  const correct = useScaleIn(140, 14);
  const real = useScaleIn(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="DEV & MEETINGS" />
          <Badge dot="🟠" text="HIỂU LẦM THỨ NĂM" color={ORANGE} entry={0} />
          <g style={wrong}>
            <rect x={W / 2 - 480} y={350} width={960} height={120} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={398} fontSize={24} fill={PM_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM nghĩ 📋</text>
            <text x={W / 2} y={442} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Dev ghét họp.”</text>
          </g>
          <g style={{ ...correct, transformOrigin: `${W / 2}px 545px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={560} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>✗ thực ra · Dev KHÔNG ghét họp</text>
          </g>
          <g style={{ ...real, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={620} width={960} height={250} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={678} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Dev ghét cuộc họp dài</text>
            <text x={W / 2} y={745} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1 GIỜ ⏰</text>
            <text x={W / 2} y={800} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>để quyết định một việc</text>
            <text x={W / 2} y={848} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đáng lẽ xong bằng 2 TIN NHẮN 💬</text>
          </g>
          <text x={W / 2} y={945} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(310, 12)}>“tâm ma phổ biến nhất giới kỹ sư”</text>
          <FigFooter label="meeting · nơi thời gian bốc hơi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 HL6 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const dev = useFadeUp(30, 14);
  const pm = useFadeUp(100, 14);
  const truth = useScaleIn(200, 14);
  const punch = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="CHANGE vs REFUSE" />
          <Badge dot="🔴" text="HIỂU LẦM THỨ SÁU" color={WARNING_RED} entry={0} />
          <Think x={W / 2 - 480} y={340} w={960} who="Dev" whoColor={DEV_C} emoji="💻" quote="PM thích đổi yêu cầu." style={dev} />
          <Think x={W / 2 - 480} y={510} w={960} who="PM" whoColor={PM_C} emoji="📋" quote="Dev thích từ chối yêu cầu." style={pm} />
          <g style={truth}>
            <rect x={W / 2 - 480} y={690} width={465} height={140} rx={14} fill="#0E1F35" stroke={PM_C} strokeWidth={2.5} />
            <text x={W / 2 - 247} y={740} fontSize={24} fill={PM_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM đang chống</text>
            <text x={W / 2 - 247} y={788} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÁCH HÀNG</text>
            <rect x={W / 2 + 15} y={690} width={465} height={140} rx={14} fill="#2A1010" stroke={DEV_C} strokeWidth={2.5} />
            <text x={W / 2 + 247} y={740} fontSize={24} fill={DEV_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Dev đang chống</text>
            <text x={W / 2 + 247} y={788} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>THỰC TẠI</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 925px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={910} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cả hai đều đang TRẢ NGHIỆP</text>
            <text x={W / 2} y={960} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ khác chiến trường ⚔️</text>
          </g>
          <FigFooter label="không ai rảnh · ai cũng đang chống thứ gì đó" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 ENDING ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const mutual = useScaleIn(40, 14);
  const chaos = useFadeUp(180, 14);
  const dis = useScaleIn(380, 14);
  const look = useFadeUp(680, 14);
  const reveal = useScaleIn(870, 18);
  const symptoms = [
    { t: "📊 Monitoring bắt đầu rung động", e: 450 },
    { t: "📜🔥 Log bắt đầu hóa ma", e: 510 },
    { t: "📞 Khách hàng bắt đầu truyền âm", e: 570 },
  ];
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE REAL TRIBULATION" />
          <text x={W / 2} y={235} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1" style={useFadeUp(0, 10)}>🏴  HIỂU LẦM CUỐI CÙNG</text>
          {/* mutual: each thinks the other is the tribulation */}
          <g style={mutual}>
            <rect x={W / 2 - 480} y={278} width={465} height={140} rx={14} fill="#0E1F35" stroke={PM_C} strokeWidth={2} />
            <text x={W / 2 - 247} y={322} fontSize={22} fill={PM_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>PM cho rằng 📋</text>
            <text x={W / 2 - 247} y={366} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Dev là THIÊN KIẾP</text>
            <text x={W / 2 - 247} y={398} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>lớn nhất của mình ⚡</text>
            <rect x={W / 2 + 15} y={278} width={465} height={140} rx={14} fill="#1A2410" stroke={DEV_C} strokeWidth={2} />
            <text x={W / 2 + 247} y={322} fontSize={22} fill={DEV_C} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Dev cho rằng 💻</text>
            <text x={W / 2 + 247} y={366} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PM là THIÊN KIẾP</text>
            <text x={W / 2 + 247} y={398} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>lớn nhất của mình ⚡</text>
          </g>
          <text x={W / 2} y={465} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={chaos}>luận đạo quanh năm · Ticket bay khắp thiên hạ · Meeting bất tận 🎫</text>
          {/* production dị tượng panel */}
          <g style={{ ...dis, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={510} width={960} height={300} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={562} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚠️ một ngày · PRODUCTION xuất hiện DỊ TƯỢNG</text>
            {symptoms.map((s, i) => (
              <g key={i} opacity={useFade(s.e, 12)}>
                <rect x={W / 2 - 430} y={595 + i * 66} width={860} height={56} rx={10} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={632 + i * 66} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={862} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={look}>PM &amp; Dev đồng thời ngẩng đầu nhìn lên bầu trời 👀</text>
          {/* final realization */}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 985px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={900} width={960} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={945} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ngày Production sụp đổ · cả hai mới hiểu:</text>
            <text x={W / 2} y={1003} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">THIÊN KIẾP thật sự</text>
            <text x={W / 2} y={1048} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">vốn chưa bao giờ là ĐỐI PHƯƠNG 🏯</text>
          </g>
          <FigFooter label="thiên kiếp thật · là bug · deadline · production lúc 2h sáng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

export const PmVsDevHieuLam: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pm_vs_dev_hieu_lam/voice.mp3")} />
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
