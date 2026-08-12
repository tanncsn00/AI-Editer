import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./cuda_truyen_ky_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

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
const SLATE = "#A4B5D0";
const NV_GREEN = "#76B900";
const NV_GREEN_BRIGHT = "#A6E227";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 18) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = NV_GREEN }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="cdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="cdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="cdglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={NV_GREEN} stopOpacity="0" />
            <stop offset="50%" stopColor={NV_GREEN} stopOpacity="0.06" />
            <stop offset="100%" stopColor={NV_GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cdgrid)" />
        <rect width={W} height={H} fill="url(#cdgrid2)" />
        <rect width={W} height={H} fill="url(#cdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#cdscan)" />
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

// GPU chip glyph
const Chip: React.FC<{ cx: number; cy: number; s: number; color: string; label: string; entry: number; glow?: boolean }> = ({ cx, cy, s, color, label, entry, glow }) => {
  const a = useScaleIn(entry, 14);
  const pins = 5;
  const pinGap = s / (pins + 1);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      {/* pins */}
      {Array.from({ length: pins }).map((_, i) => {
        const off = -s / 2 + pinGap * (i + 1);
        return (
          <g key={i} fill={color} opacity={0.8}>
            <rect x={cx + off - 5} y={cy - s / 2 - 16} width={10} height={16} rx={2} />
            <rect x={cx + off - 5} y={cy + s / 2} width={10} height={16} rx={2} />
            <rect x={cx - s / 2 - 16} y={cy + off - 5} width={16} height={10} rx={2} />
            <rect x={cx + s / 2} y={cy + off - 5} width={16} height={10} rx={2} />
          </g>
        );
      })}
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={14} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <rect x={cx - s / 2 + 16} y={cy - s / 2 + 16} width={s - 32} height={s - 32} rx={8} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
      {glow && <circle cx={cx} cy={cy} r={s * 0.62} fill={color} opacity={0.08} />}
      <text x={cx} y={cy + s * 0.13} fontSize={s * 0.32} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
    </g>
  );
};

// resource / item card
const ResCard: React.FC<{ cx: number; y: number; w?: number; name: string; sub: string; color: string; entry: number }> = ({ cx, y, w = 560, name, sub, color, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${y + 36}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={y} width={w} height={72} rx={10} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <rect x={cx - w / 2} y={y} width={8} height={72} rx={3} fill={color} />
      <text x={cx - w / 2 + 34} y={y + 47} fontSize={32} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{name}</text>
      <text x={cx + w / 2 - 26} y={y + 46} fontSize={22} fill={NV_GREEN_BRIGHT} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{sub}</text>
    </g>
  );
};

const Bubble: React.FC<{ y: number; side: "L" | "R"; speaker: string; text: string; color: string; entry: number; size?: number }> = ({ y, side, speaker, text, color, entry, size = 32 }) => {
  const a = useScaleIn(entry, 12);
  const bw = 800;
  const x = side === "L" ? W / 2 - bw / 2 - 20 : W / 2 - bw / 2 + 20;
  return (
    <g style={{ ...a, transformOrigin: `${x + bw / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={bw} height={100} rx={14} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <rect x={side === "L" ? x : x + bw - 8} y={y + 24} width={8} height={52} fill={color} />
      <text x={x + 30} y={y + 38} fontSize={18} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{speaker}</text>
      <text x={x + 30} y={y + 78} fontSize={size} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{text}</text>
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const arts = ["Java", "Linux", "Docker", "Kubernetes"];
  const artCol = [JADE, ACCENT_BLUE, VIOLET, ORANGE];
  const q = useFadeUp(220, 12);
  const reveal = useScaleIn(330, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE ART BEHIND AN EMPIRE" />
          <text x={W / 2} y={270} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Vạn công pháp từng chấn động tam giới:</text>
          <g>
            {arts.map((t, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              const cx = col === 0 ? W / 2 - 230 : W / 2 + 230;
              const y = 330 + row * 110;
              const a = useScaleIn(60 + i * 30, 12);
              return (
                <g key={i} style={{ ...a, transformOrigin: `${cx}px ${y + 40}px`, transformBox: "fill-box" }}>
                  <rect x={cx - 200} y={y} width={400} height={80} rx={10} fill={BG_CARD} stroke={artCol[i]} strokeWidth={2} />
                  <text x={cx} y={y + 53} fontSize={36} fill={artCol[i]} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
                </g>
              );
            })}
          </g>
          <text x={W / 2} y={650} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={q}>Nhưng công pháp nào biến tông môn nhỏ bé</text>
          <text x={W / 2} y={696} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={q}>→ thành BÁ CHỦ AI giới? 🤔</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <Chip cx={W / 2} cy={900} s={170} color={NV_GREEN} label="CUDA" entry={0} glow />
            <text x={W / 2} y={1080} fontSize={84} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">CUDA</text>
          </g>
          <FigFooter label="công pháp làm nên đế quốc NVIDIA" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 GPU ORIGIN ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const chip = useScaleIn(40, 14);
  const role = useScaleIn(130, 14);
  const punch = useFadeUp(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="GPU · A GAMER'S TOY" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Thời thượng cổ · GPU chỉ là pháp khí của:</text>
          <g style={{ ...chip, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <Chip cx={W / 2} cy={470} s={150} color={ACCENT_BLUE} label="GPU" entry={0} />
          </g>
          <g style={{ ...role, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={640} width={760} height={160} rx={14} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={700} fontSize={56} textAnchor="middle">🎮</text>
            <text x={W / 2} y={760} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhiệm vụ duy nhất: đánh boss mượt hơn</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={900} w={940} h={170} color={NV_GREEN} thick={2.5} />
            <text x={W / 2} y={965} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">không ai nghĩ một ngày…</text>
            <text x={W / 2} y={1020} fontSize={36} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>nó thành nền móng cách mạng AI ⚡</text>
          </g>
          <FigFooter label="khởi nguyên · chỉ để chơi game" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 CUDA BIRTH 2006 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const year = useScaleIn(30, 14);
  const insight = useFadeUp(120, 14);
  const born = useScaleIn(250, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="2006 · THE AWAKENING" />
          <g style={{ ...year, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 170} y={270} width={340} height={100} rx={12} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={338} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800} letterSpacing="3">2006</text>
          </g>
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={insight}>Trưởng lão NVIDIA lĩnh ngộ thiên cơ:</text>
          <g style={insight}>
            <rect x={W / 2 - 440} y={490} width={880} height={170} rx={14} fill={BG_TERM} stroke={NV_GREEN} strokeWidth={2} />
            <text x={W / 2} y={550} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>GPU không chỉ để VẼ HÌNH</text>
            <text x={W / 2} y={610} fontSize={32} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ tu luyện VẠN phép tính cùng lúc</text>
          </g>
          <g style={{ ...born, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <Chip cx={W / 2} cy={830} s={140} color={NV_GREEN} label="CUDA" entry={0} glow />
            <text x={W / 2} y={1000} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một công pháp mới KHAI SINH 🌱</text>
          </g>
          <FigFooter label="thiên cơ vỡ lẽ · CUDA ra đời" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 INTEL DOMINANCE ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const sun = useScaleIn(60, 16);
  const doubt = useFadeUp(200, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE AGE OF CPU" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Ban đầu · thiên hạ không để tâm. Vì sao?</text>
          <g style={{ ...sun, transformOrigin: `${W / 2}px 520px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={520} r={130} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <circle cx={W / 2} cy={520} r={148} fill="none" stroke={AMBER} strokeWidth={1.5} opacity={0.4} />
            <text x={W / 2} y={508} fontSize={50} textAnchor="middle">☀️</text>
            <text x={W / 2} y={570} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>INTEL</text>
          </g>
          <text x={W / 2} y={730} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(140, 12)}>CPU Tông thống trị · như mặt trời ban ngày</text>
          <g style={doubt}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={170} color={SLATE} thick={2.5} />
            <text x={W / 2} y={895} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">"không ai tin một pháp khí chơi game</text>
            <text x={W / 2} y={950} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>có thể thay đổi thiên hạ" 😏</text>
          </g>
          <FigFooter label="kẻ thống trị · không thấy bão sắp tới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 AI DISCOVERY ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const before = useScaleIn(60, 14);
  const after = useScaleIn(150, 14);
  const join = useFadeUp(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="MONTHS BECOME DAYS" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Học giả AI phát hiện điều kỳ lạ:</text>
          <g style={{ ...before, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={390} width={840} height={150} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={448} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>thuật toán cũ · tu luyện</text>
            <text x={W / 2} y={508} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NHIỀU THÁNG 🐌</text>
          </g>
          <text x={W / 2} y={600} fontSize={36} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(130, 12)}>↓ chuyển sang CUDA ↓</text>
          <g style={{ ...after, transformOrigin: `${W / 2}px 730px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={650} width={840} height={150} rx={14} fill={BG_CARD} stroke={NV_GREEN} strokeWidth={3} />
            <text x={W / 2} y={708} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>cũng thuật toán đó · chỉ còn</text>
            <text x={W / 2} y={768} fontSize={48} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VÀI NGÀY 🚀</text>
          </g>
          <g style={join}>
            <text x={W / 2} y={900} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Việc từ KHÔNG THỂ → thành CÓ THỂ</text>
            <text x={W / 2} y={952} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">vô số AI tu sĩ nhập môn CUDA Đạo 🏯</text>
          </g>
          <FigFooter label="bí kíp gia tốc · cả giới AI đổ về" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 DEEP LEARNING DEP ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const dl = useScaleIn(40, 14);
  const deps = ["TensorFlow", "PyTorch", "Training", "Inference"];
  const depCol = [ORANGE, WARNING_RED, ACCENT_BLUE, VIOLET];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="EVERYTHING NEEDS CUDA" />
          <g style={{ ...dl, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 360} y={250} width={720} height={86} rx={12} fill={BG_CARD} stroke={NV_GREEN} strokeWidth={3} />
            <text x={W / 2} y={307} fontSize={38} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚡ DEEP LEARNING xuất thế</text>
          </g>
          <text x={W / 2} y={410} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>Công pháp AI mạnh nhất · đều xây trên CUDA:</text>
          {deps.map((d, i) => (
            <ResCard key={i} cx={W / 2} y={460 + i * 100} name={d} sub="→ cần CUDA" color={depCol[i]} entry={140 + i * 45} />
          ))}
          <g style={useScaleIn(340, 14)}>
            <TechBox x={W / 2 - 470} y={900} w={940} h={120} color={NV_GREEN} thick={3} />
            <text x={W / 2} y={975} fontSize={36} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tất cả · đều quỳ dưới CUDA 👑</text>
          </g>
          <FigFooter label="cả ngành AI · build trên một nền" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 LINH MẠCH ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const chip = useScaleIn(10, 14);
  const reveal = useFadeUp(70, 14);
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 360 / 8 - 90) * Math.PI / 180;
    return [W / 2 + 360 * Math.cos(a), 640 + 320 * Math.sin(a)];
  });
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE BLOODLINE" />
          {nodes.map((n, i) => (
            <g key={i} opacity={frame > 40 + i * 4 ? 1 : 0}>
              <line x1={W / 2} y1={640} x2={n[0]} y2={n[1]} stroke={NV_GREEN} strokeWidth={2} opacity={0.5} />
              <circle cx={n[0]} cy={n[1]} r={26} fill={BG_CARD} stroke={NV_GREEN} strokeWidth={2} />
              <text x={n[0]} y={n[1] + 8} fontSize={24} textAnchor="middle">🤖</text>
            </g>
          ))}
          <g style={{ ...chip, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <Chip cx={W / 2} cy={640} s={150} color={NV_GREEN} label="CUDA" entry={0} glow />
          </g>
          <g style={reveal}>
            <text x={W / 2} y={1080} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>CUDA không còn là công pháp…</text>
            <text x={W / 2} y={1136} fontSize={42} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là LINH MẠCH của cả AI giới 🩸</text>
          </g>
          <FigFooter label="dòng máu chảy ngầm · nuôi toàn bộ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 FAILED REBELLION ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const rebel = useFadeUp(20, 14);
  const roots = ["vô số thư viện", "vô số framework", "vô số hệ thống"];
  const mountain = useScaleIn(330, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE IMMOVABLE MOUNTAIN" />
          <g style={rebel}>
            <text x={W / 2} y={290} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nhiều tông môn thử phản kháng ⚔️</text>
            <text x={W / 2} y={340} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">muốn xây công pháp riêng · thoát CUDA Đạo</text>
          </g>
          <text x={W / 2} y={430} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(90, 12)}>nhưng CUDA đã ăn sâu vào…</text>
          {roots.map((r, i) => (
            <ResCard key={i} cx={W / 2} y={490 + i * 100} name={`✗ ${r}`} sub="bị khóa" color={WARNING_RED} entry={140 + i * 45} />
          ))}
          <g style={{ ...mountain, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={895} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>muốn thay thế CUDA…</text>
            <text x={W / 2} y={950} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">= muốn DỜI một ngọn núi ⛰️</text>
          </g>
          <FigFooter label="lock-in · gông xiềng vô hình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 NVIDIA COLLECTS ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const left = useFadeUp(20, 14);
  const right = useScaleIn(90, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="NVIDIA COLLECTS ALL" />
          <g style={left}>
            <text x={W / 2} y={340} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Trong khi thiên hạ tranh luận:</text>
            <text x={W / 2} y={400} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"model nào mạnh hơn?" 🥊</text>
          </g>
          <g style={{ ...right, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={500} width={880} height={280} rx={16} fill={BG_CARD} stroke={NV_GREEN} strokeWidth={3} />
            <text x={W / 2} y={570} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>NVIDIA âm thầm…</text>
            <text x={W / 2} y={645} fontSize={48} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>thu thập TOÀN BỘ</text>
            <g opacity={frame > 140 ? 1 : 0}>
              <text x={W / 2} y={720} fontSize={48} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>linh thạch 💎💎💎</text>
            </g>
          </g>
          <text x={W / 2} y={880} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" style={useFadeUp(170, 12)}>// bán cuốc trong cơn sốt vàng 🪙</text>
          <FigFooter label="ai thắng cũng được · miễn mua GPU" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const praise = useFadeUp(30, 14);
  const names = ["OpenAI", "Anthropic", "Gemini", "Claude"];
  const nameCol = [JADE, ORANGE, ACCENT_BLUE, VIOLET];
  const hidden = useFadeUp(280, 14);
  const truth = useScaleIn(470, 16);
  const cta = useFadeUp(680, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NV_GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE AGE OF CUDA" />
          <text x={W / 2} y={270} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={praise}>Người người ca tụng các mô hình AI:</text>
          <g>
            {names.map((n, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              const cx = col === 0 ? W / 2 - 230 : W / 2 + 230;
              const y = 320 + row * 100;
              const a = useScaleIn(60 + i * 35, 12);
              return (
                <g key={i} style={{ ...a, transformOrigin: `${cx}px ${y + 36}px`, transformBox: "fill-box" }}>
                  <rect x={cx - 200} y={y} width={400} height={72} rx={10} fill={BG_CARD} stroke={nameCol[i]} strokeWidth={2} />
                  <text x={cx} y={y + 48} fontSize={32} fill={nameCol[i]} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{n}</text>
                </g>
              );
            })}
          </g>
          <g style={hidden}>
            <text x={W / 2} y={580} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng ẩn sau TẤT CẢ mô hình kia…</text>
            <text x={W / 2} y={628} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">vẫn một công pháp viết từ gần 2 thập kỷ trước ⏳</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <Chip cx={W / 2} cy={750} s={120} color={NV_GREEN} label="CUDA" entry={0} glow />
            <TechBox x={W / 2 - 480} y={840} w={960} h={210} color={NV_GREEN} thick={3} />
            <text x={W / 2} y={900} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nhiều người nghĩ đang sống thời đại AI…</text>
            <text x={W / 2} y={970} fontSize={42} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thực ra · là thời đại CUDA 🏯</text>
            <text x={W / 2} y={1022} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// truyền kỳ lớn nhất của NVIDIA</text>
          </g>
          <g transform={`translate(${W / 2}, 1130)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu nghĩ sao? 👇</text>
            <line x1={-240} y1={42} x2={240} y2={42} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={88} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="đế quốc thầm lặng · phía sau cơn sốt AI" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const CudaTruyenKy: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("cuda_truyen_ky/voice.mp3")} />
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
