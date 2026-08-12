import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./gpu_than_khi_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "08";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
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
const NVGREEN = "#76B900";

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
const useFade = (e: number, d = 14) => {
  const f = useCurrentFrame();
  return { opacity: interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
};

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="gpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="gpgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="gpglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={JADE} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gpscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#gpgrid)" />
        <rect width={W} height={H} fill="url(#gpgrid2)" />
        <rect width={W} height={H} fill="url(#gpglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#gpscan)" />
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
  const a1 = useFadeUp(0, 10), a2 = useFadeUp(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={0.5} style={a2} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · gpu · thần khí ai · 2026</text>
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
const SceneTitle: React.FC<{ t: string; color?: string; entry: number; y?: number }> = ({ t, color = AMBER, entry, y = 300 }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y}px`, transformBox: "fill-box" }}>
      <text x={W / 2} y={y + 14} fontSize={(t.length > 26 ? 38 : 48)} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{t}</text>
    </g>
  );
};

// core grid (cpu = few big, gpu = many small)
const CoreGrid: React.FC<{ cx: number; cy: number; cols: number; rows: number; cell: number; gap: number; color: string }> = ({ cx, cy, cols, rows, cell, gap, color }) => {
  const totalW = cols * cell + (cols - 1) * gap;
  const totalH = rows * cell + (rows - 1) * gap;
  const x0 = cx - totalW / 2;
  const y0 = cy - totalH / 2;
  const items = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    items.push(<rect key={`${r}-${c}`} x={x0 + c * (cell + gap)} y={y0 + r * (cell + gap)} width={cell} height={cell} rx={Math.min(4, cell / 5)} fill={color} opacity={0.85} />);
  }
  return <g>{items}</g>;
};

// ============ S1 SETUP ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const card = useScaleIn(70, 16);
  const i1 = useFadeUp(150, 10), i2 = useFadeUp(180, 10), i3 = useFadeUp(210, 10);
  const note = useFadeUp(250, 12);
  const icons = [
    { x: -300, e: "🎮", t: "đánh quái", anim: i1 },
    { x: 0, e: "🔫", t: "bắn súng", anim: i2 },
    { x: 300, e: "📺", t: "anime 4K", anim: i3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="BEFORE · JUST A GAMING CARD" />
          <SceneTitle t="Vài năm trước, GPU chỉ là..." color={TEXT_SEC} entry={20} y={310} />
          {/* gpu card */}
          <g style={{ ...card, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 240} y={470} width={480} height={180} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={3} />
            <circle cx={W / 2 - 130} cy={560} r={52} fill="none" stroke={JADE} strokeWidth={3} />
            <circle cx={W / 2 + 60} cy={560} r={52} fill="none" stroke={JADE} strokeWidth={3} />
            <text x={W / 2 - 130} y={575} fontSize={44} textAnchor="middle">🌀</text>
            <text x={W / 2 + 60} y={575} fontSize={44} textAnchor="middle">🌀</text>
            <text x={W / 2 + 175} y={500} fontSize={22} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>GPU</text>
          </g>
          <text x={W / 2} y={740} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1" style={i1}>// pháp bảo dành cho game thủ:</text>
          {icons.map((c, i) => (
            <g key={i} transform={`translate(${W / 2 + c.x}, 880)`} opacity={c.anim.opacity}>
              <rect x={-130} y={-70} width={260} height={170} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
              <text x={0} y={5} fontSize={64} textAnchor="middle">{c.e}</text>
              <text x={0} y={70} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c.t}</text>
            </g>
          ))}
          <text x={W / 2} y={1120} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            … không mấy ai để ý 🤷
          </text>
          <FigFooter label="gpu = card chơi game" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BÍ MẬT ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const no = useScaleIn(110, 14);
  const yes = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE SECRET · AI NEEDS THIS" />
          <text x={W / 2} y={350} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={intro}>
            Đại năng AI phát hiện bí mật động trời:
          </text>
          <text x={W / 2} y={460} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={intro}>
            Thứ cần để tu luyện AI...
          </text>
          <g style={{ ...no, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={560} width={840} height={150} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2} y={620} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ KHÔNG phải</text>
            <text x={W / 2} y={680} fontSize={64} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} textDecoration="line-through">CPU</text>
          </g>
          <text x={W / 2} y={790} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▼ mà là ▼</text>
          <g style={{ ...yes, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 420} y={840} w={840} h={180} color={JADE} thick={3} />
            <text x={W / 2} y={905} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓ CHÍNH LÀ</text>
            <text x={W / 2} y={985} fontSize={88} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">GPU</text>
          </g>
          <FigFooter label="bí mật · ai chạy bằng gpu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 CPU ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const core = useScaleIn(60, 16);
  const traits = useFadeUp(140, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="CPU · THE LONE SWORDSMAN" />
          <SceneTitle t="CPU = một KIẾM TU" color={ACCENT_BLUE} entry={20} y={300} />
          <g style={{ ...core, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={520} fontSize={120} textAnchor="middle">⚔️</text>
            <CoreGrid cx={W / 2} cy={650} cols={2} rows={2} cell={70} gap={16} color={ACCENT_BLUE} />
            <text x={W / 2} y={770} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>~ vài nhân (cores) mạnh</text>
          </g>
          <g style={traits}>
            <TechBox x={W / 2 - 470} y={850} w={940} h={210} color={ACCENT_BLUE} thick={2} />
            <text x={W / 2} y={905} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ Rất mạnh · rất thông minh</text>
            <text x={W / 2} y={955} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ Xử lý nhiệm vụ phức tạp</text>
            <text x={W / 2} y={1015} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nhưng chỉ có VÀI thanh phi kiếm</text>
          </g>
          <FigFooter label="cpu · ít nhân · cực mạnh" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 GPU ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const grid = useScaleIn(60, 16);
  const cmp = useFadeUp(180, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="GPU · TEN THOUSAND SWORDS" />
          <SceneTitle t="GPU = VẠN KIẾM tề xuất" color={JADE} entry={20} y={300} />
          <g style={{ ...grid, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <CoreGrid cx={W / 2} cy={580} cols={12} rows={8} cell={48} gap={10} color={JADE} />
            <text x={W / 2} y={790} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>~ hàng nghìn nhân chạy SONG SONG</text>
          </g>
          <g style={cmp}>
            <g transform={`translate(-245, 0)`}>
              <TechBox x={W / 2 - 210} y={870} w={420} h={170} color={ACCENT_BLUE} thick={2} />
              <text x={W / 2} y={920} fontSize={24} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>1 phép tính · CPU</text>
              <text x={W / 2} y={985} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tự mình làm</text>
            </g>
            <g transform={`translate(245, 0)`}>
              <TechBox x={W / 2 - 210} y={870} w={420} h={170} color={JADE} thick={2.5} />
              <text x={W / 2} y={920} fontSize={24} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>1 phép tính · GPU</text>
              <text x={W / 2} y={985} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>gọi CẢ TÔNG MÔN</text>
            </g>
          </g>
          <FigFooter label="gpu · nghìn nhân · song song" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 SCALE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const b1 = useScaleIn(120, 12), b2 = useScaleIn(160, 12), b3 = useScaleIn(200, 12);
  const reveal = useScaleIn(330, 16);
  const bars = [
    { y: 0, t: "10 tỷ", w: 180, c: ACCENT_BLUE, anim: b1 },
    { y: 90, t: "100 tỷ", w: 420, c: AMBER, anim: b2 },
    { y: 180, t: "1000 tỷ", w: 700, c: WARNING_RED, anim: b3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="SCALE · BIGGER & BIGGER" />
          <text x={W / 2} y={330} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            AI ngày càng lớn → tham số bùng nổ
          </text>
          <g transform={`translate(0, 480)`}>
            {bars.map((r, i) => (
              <g key={i} transform={`translate(0, ${r.y})`} opacity={r.anim.opacity}>
                <rect x={W / 2 - 410} y={-25} width={r.w} height={50} rx={8} fill={r.c} opacity={0.75} />
                <rect x={W / 2 - 410} y={-25} width={r.w} height={50} rx={8} fill="none" stroke={r.c} strokeWidth={2} />
                <text x={W / 2 - 410 + r.w + 24} y={12} fontSize={30} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={895} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Thứ giới hạn AI không còn là</text>
            <text x={W / 2} y={945} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">thuật pháp · ý tưởng</text>
            <text x={W / 2} y={1010} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là:</text>
            <text x={W / 2} y={1058} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ai sở hữu NHIỀU GPU hơn</text>
          </g>
          <FigFooter label="scale · gpu = giới hạn thật sự" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 GOM GPU ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const cFrames = [100, 130, 160, 190];
  const companies = [
    { x: -245, y: -70, t: "OpenAI", c: "#10A37F" },
    { x: 245, y: -70, t: "Google", c: "#4285F4" },
    { x: -245, y: 60, t: "Meta", c: "#0668E1" },
    { x: 245, y: 60, t: "Anthropic", c: "#D97757" },
  ];
  const quote = useScaleIn(280, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE GPU RUSH" />
          <text x={W / 2} y={330} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={intro}>
            Các đại tông môn ĐIÊN CUỒNG gom thần khí 🏃
          </text>
          <g transform={`translate(0, 560)`}>
            {companies.map((c, i) => {
              const a = useScaleIn(cFrames[i], 12);
              return (
                <g key={i} style={{ ...a, transformOrigin: `${W / 2 + c.x}px ${c.y}px`, transformBox: "fill-box" }}>
                  <rect x={W / 2 + c.x - 220} y={c.y - 50} width={440} height={100} rx={12} fill={BG_CARD} stroke={c.c} strokeWidth={2.5} />
                  <text x={W / 2 + c.x - 185} y={c.y + 10} fontSize={30} fill={c.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.t}</text>
                  <text x={W / 2 + c.x + 185} y={c.y + 10} fontSize={26} fill={JADE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>→ gom GPU</text>
                </g>
              );
            })}
          </g>
          <g style={quote}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={230} color={AMBER} thick={2.5} />
            <text x={W / 2} y={890} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// đại năng nói đùa:</text>
            <text x={W / 2} y={945} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"AI không phải cuộc chiến thuật toán</text>
            <text x={W / 2} y={1000} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là ai mua nhiều GPU hơn"</text>
          </g>
          <FigFooter label="gpu rush · ai = cuộc chiến phần cứng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 NVIDIA ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const nv = useScaleIn(40, 16);
  const r1 = useFadeUp(150, 12), r2 = useFadeUp(210, 12), r3 = useFadeUp(270, 12);
  const rows = [
    { y: 0, a: "Người khác ĐÀO VÀNG", b: "hắn bán CUỐC ⛏️", anim: r1 },
    { y: 96, a: "Người khác ĐÁNH NHAU", b: "hắn bán VŨ KHÍ ⚔️", anim: r2 },
    { y: 192, a: "Người khác ĐỐT linh thạch", b: "hắn THU linh thạch 💎", anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="NVIDIA · SELLS THE SHOVELS" />
          <g style={{ ...nv, transformOrigin: `${W / 2}px 400px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 280} y={330} width={560} height={130} rx={12} fill={BG_CARD} stroke={NVGREEN} strokeWidth={3} />
            <text x={W / 2} y={395} fontSize={48} fill={NVGREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">NVIDIA</text>
            <text x={W / 2} y={435} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">đứng một bên · bán cuốc cho tất cả</text>
          </g>
          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${600 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-470} y={-38} width={940} height={76} fill={BG_CARD} stroke={NVGREEN} strokeWidth={1.5} />
              <text x={-440} y={9} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{r.a}</text>
              <text x={440} y={9} fontSize={28} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.b}</text>
            </g>
          ))}
          <g style={r3}>
            <text x={W / 2} y={1000} fontSize={30} fill={NVGREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ ai thắng cũng phải mua GPU của hắn 💰</text>
          </g>
          <FigFooter label="nvidia · người bán cuốc trong cơn sốt vàng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 ENDING ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(30, 14);
  const n1 = useFadeUp(110, 9), n2 = useFadeUp(150, 9), n3 = useFadeUp(190, 9);
  const reveal = useScaleIn(290, 18);
  const t1 = useFadeUp(420, 10), t2 = useFadeUp(450, 10), t3 = useFadeUp(480, 10);
  const cta = useFadeUp(560, 14);
  const nope = [
    { y: 0, t: "ChatGPT", anim: n1 },
    { y: 64, t: "Claude", anim: n2 },
    { y: 128, t: "Gemini", anim: n3 },
  ];
  const traits = [
    { x: -300, e: "🔥", t: "nóng 80°C", anim: t1 },
    { x: 0, e: "⚡", t: "ăn điện như yêu thú", anim: t2 },
    { x: 300, e: "🏠", t: "giá = 1 căn nhà", anim: t3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="VERDICT · THE TRUE THẦN KHÍ" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Thần khí mạnh nhất thời đại AI không phải:
          </text>
          {nope.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${390 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-300} y={-26} width={600} height={54} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">✗ {r.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 360} y={630} w={720} h={180} color={JADE} thick={3} />
            <text x={W / 2} y={690} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// thứ đứng sau TẤT CẢ</text>
            <text x={W / 2} y={775} fontSize={96} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">GPU</text>
          </g>
          {traits.map((r, i) => (
            <g key={i} transform={`translate(${W / 2 + r.x}, 920)`} opacity={r.anim.opacity}>
              <rect x={-145} y={-50} width={290} height={150} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={0} y={-2} fontSize={52} textAnchor="middle">{r.e}</text>
              <text x={0} y={66} fontSize={23} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <g transform={`translate(${W / 2}, 1140)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ai sẽ thắng cuộc chiến GPU? 👇</text>
            <line x1={-240} y1={50} x2={240} y2={50} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={100} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới AI</text>
          </g>
          <FigFooter label="gpu · thần khí thật sự thời đại ai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

export const GpuThanKhi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("gpu_than_khi/voice.mp3")} />
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
