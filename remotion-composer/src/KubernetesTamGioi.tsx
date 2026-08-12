import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./kubernetes_tam_gioi_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

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
const K8S_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const SLATE = "#A4B5D0";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = K8S_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="kbgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="kbgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="kbglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kbscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#kbgrid)" />
        <rect width={W} height={H} fill="url(#kbgrid2)" />
        <rect width={W} height={H} fill="url(#kbglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#kbscan)" />
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

// kubernetes helm wheel
const Wheel: React.FC<{ cx: number; cy: number; r: number; color: string; spin?: number }> = ({ cx, cy, r, color, spin = 0 }) => {
  const pts = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * 360 / 7 + spin) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const inner = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * 360 / 7 + spin) * Math.PI) / 180;
    return [cx + r * 0.42 * Math.cos(a), cy + r * 0.42 * Math.sin(a)];
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={color} strokeWidth={2} opacity={0.35} />
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={BG_CARD} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <line key={i} x1={inner[i][0]} y1={inner[i][1]} x2={p[0]} y2={p[1]} stroke={color} strokeWidth={4} strokeLinecap="round" />
      ))}
      <polygon points={inner.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r * 0.16} fill={color} />
    </g>
  );
};

// resource card
const ResCard: React.FC<{ cx: number; y: number; w?: number; name: string; sub: string; color: string; entry: number }> = ({ cx, y, w = 540, name, sub, color, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${y + 36}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={y} width={w} height={72} rx={10} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <rect x={cx - w / 2} y={y} width={8} height={72} rx={3} fill={color} />
      <text x={cx - w / 2 + 34} y={y + 47} fontSize={32} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{name}</text>
      <text x={cx + w / 2 - 28} y={y + 46} fontSize={20} fill={TEXT_MUTE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>
    </g>
  );
};

const Bubble: React.FC<{ y: number; side: "L" | "R"; speaker: string; text: string; color: string; entry: number; size?: number }> = ({ y, side, speaker, text, color, entry, size = 32 }) => {
  const a = useScaleIn(entry, 12);
  const bw = 760;
  const x = side === "L" ? W / 2 - bw / 2 - 30 : W / 2 - bw / 2 + 30;
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
  const frame = useCurrentFrame();
  const arts = [
    { t: "xây trang web", c: JADE, e: 80 },
    { t: "luyện AI", c: VIOLET, e: 150 },
    { t: "quản lý cơ sở dữ liệu", c: ORANGE, e: 220 },
  ];
  const but = useFadeUp(300, 12);
  const reveal = useScaleIn(440, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={K8S_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE MOST FEARED ART" />
          <text x={W / 2} y={270} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Tiên giới công nghệ · có vạn công pháp:</text>
          {arts.map((a, i) => (
            <ResCard key={i} cx={W / 2} y={320 + i * 92} name={`> ${a.t}`} sub="công pháp" color={a.c} entry={a.e} />
          ))}
          <text x={W / 2} y={690} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={but}>Nhưng chỉ có MỘT công pháp…</text>
          <text x={W / 2} y={734} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={but}>khiến kỹ sư vừa kính sợ · vừa đau đầu</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <Wheel cx={W / 2} cy={920} r={96} color={K8S_BLUE} spin={frame * 0.4} />
            <text x={W / 2} y={1110} fontSize={68} fill={K8S_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">KUBERNETES</text>
          </g>
          <FigFooter label="công pháp khiến vạn kỹ sư tâm ma" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 ORIGIN ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const goog = useScaleIn(50, 14);
  const term = useScaleIn(120, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={K8S_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="BORN AT GOOGLE" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Tương truyền · sáng tạo từ thượng cổ bởi:</text>
          <g style={{ ...goog, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 260} y={400} width={520} height={140} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={460} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>đại năng tại</text>
            <text x={W / 2} y={510} fontSize={52} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">GOOGLE 🏛️</text>
          </g>
          <g style={{ ...term, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={620} width={840} height={200} rx={12} fill={BG_TERM} stroke={K8S_BLUE} strokeWidth={2} />
            <rect x={W / 2 - 420} y={620} width={840} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={650} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>mục đích ban đầu — rất đơn giản</text>
            <text x={W / 2 - 390} y={720} fontSize={28} fill={K8S_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ quản lý thật nhiều server</text>
            <text x={W / 2 - 390} y={772} fontSize={24} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{`  ${"▪".repeat(14)}`}</text>
            <text x={W / 2 - 390} y={804} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" opacity={frame > 160 ? 1 : 0}>// chỉ vậy thôi... lúc đầu</text>
          </g>
          <FigFooter label="khởi nguyên · chỉ để quản lý server" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 GROWTH ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const steps = [
    { t: "ngày càng hoàn thiện", e: 40 },
    { t: "ngày càng mạnh", e: 80 },
    { t: "ngày càng huyền diệu", e: 120 },
  ];
  const punch = useScaleIn(190, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="TOO POWERFUL TO GRASP" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Theo năm tháng · công pháp tiến hóa…</text>
          {steps.map((s, i) => {
            const a = useFadeUp(s.e, 12);
            const sz = 34 + i * 8;
            return (
              <g key={i} style={a}>
                <text x={W / 2} y={430 + i * 110} fontSize={sz} fill={i === 2 ? VIOLET : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i === 2 ? 900 : 700}>↑ {s.t}</text>
              </g>
            );
          })}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={200} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={830} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// cho tới một ngày…</text>
            <text x={W / 2} y={892} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>không còn AI hiểu</text>
            <text x={W / 2} y={940} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">toàn bộ nó nữa 🌀</text>
          </g>
          <FigFooter label="mạnh tới mức · vượt khỏi tầm hiểu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 DEPLOY → POD ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const pod = useScaleIn(130, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={K8S_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label='"JUST DEPLOY ONE APP"' />
          <Bubble y={360} side="L" speaker="⚪ NGƯỜI MỚI" text="Ta chỉ muốn deploy 1 ứng dụng." color={SLATE} entry={30} size={30} />
          <Bubble y={520} side="R" speaker="🧙 TRƯỞNG LÃO" text="Vậy ngươi hãy học…" color={AMBER} entry={90} />
          <g style={{ ...pod, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 220} y={710} width={440} height={180} rx={16} fill={BG_CARD} stroke={K8S_BLUE} strokeWidth={3} />
            <text x={W / 2} y={800} fontSize={80} fill={K8S_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">POD</text>
            <text x={W / 2} y={855} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// đơn vị nhỏ nhất</text>
          </g>
          <text x={W / 2} y={1000} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(170, 12)}>"chỉ một thôi mà, dễ ấy mà" — ngươi nghĩ 😌</text>
          <FigFooter label="hành trình bắt đầu · từ một Pod" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 SERVICE → INGRESS ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={K8S_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE LADDER BEGINS" />
          <text x={W / 2} y={340} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(6, 10)}>Học xong cái này… lại lòi ra cái khác:</text>
          <ResCard cx={W / 2} y={440} name="✓ Pod" sub="đã học" color={JADE} entry={12} />
          <text x={W / 2} y={560} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontWeight={700}>↓</text>
          <ResCard cx={W / 2} y={590} name="Service" sub="lại xuất hiện" color={ACCENT_BLUE} entry={30} />
          <text x={W / 2} y={710} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontWeight={700}>↓</text>
          <ResCard cx={W / 2} y={740} name="Ingress" sub="lại xuất hiện" color={VIOLET} entry={90} />
          <g style={useFadeUp(120, 12)}>
            <text x={W / 2} y={910} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>…hết chưa? 🤔</text>
          </g>
          <FigFooter label="cái thang vô tận · vừa mới bắt đầu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 THE FLOOD ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const flood = [
    { t: "ConfigMap", c: ORANGE, e: 20 },
    { t: "Secret", c: WARNING_RED, e: 40 },
    { t: "Volume", c: JADE, e: 60 },
    { t: "Helm", c: ACCENT_BLUE, e: 80 },
    { t: "Operator", c: VIOLET, e: 100 },
    { t: "CRD", c: AMBER, e: 120 },
  ];
  const punch = useScaleIn(190, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE AVALANCHE" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(6, 10)}>Học xong Ingress · lại đổ ập xuống:</text>
          {flood.map((r, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx = col === 0 ? W / 2 - 240 : W / 2 + 240;
            const y = 360 + row * 130;
            const a = useScaleIn(r.e, 12);
            return (
              <g key={i} style={{ ...a, transformOrigin: `${cx}px ${y + 48}px`, transformBox: "fill-box" }}>
                <rect x={cx - 220} y={y} width={440} height={96} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2.5} />
                <text x={cx} y={y + 62} fontSize={42} fill={r.c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.t}</text>
              </g>
            );
          })}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={800} w={940} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={865} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tới đây…</text>
            <text x={W / 2} y={920} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đạo tâm bắt đầu DAO ĐỘNG 😵‍💫</text>
          </g>
          <FigFooter label="học hoài không hết · như giếng không đáy" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 "RẤT ĐƠN GIẢN" ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const sage = useScaleIn(140, 14);
  const crack = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label='"IT&apos;S ACTUALLY SIMPLE"' />
          <text x={W / 2} y={310} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Mỗi lần ngươi định từ bỏ…</text>
          <text x={W / 2} y={362} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(50, 12)}>sẽ có một đại năng xuất hiện · mỉm cười 🙂</text>
          <g style={{ ...sage, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 430} y={450} width={860} height={220} rx={18} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={520} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>🧙 đại năng nói:</text>
            <text x={W / 2} y={590} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Thực ra Kubernetes</text>
            <text x={W / 2} y={642} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>rất đơn giản." 😌</text>
          </g>
          <g style={{ ...crack, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={780} w={940} h={200} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={845} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nghe xong…</text>
            <text x={W / 2} y={905} fontSize={42} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đạo tâm 𝗩𝗘̂́𝗧 𝗡𝗨̛́𝗧 ⚡</text>
            <text x={W / 2} y={952} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">(đơn giản cái nỗi gì…)</text>
          </g>
          <FigFooter label="câu nói ám ảnh nhất giới DevOps" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 3 CẢNH GIỚI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const realms = [
    { n: "1", t: "Không hiểu gì", s: "nhưng vẫn deploy được 🤷", c: JADE, e: 70 },
    { n: "2", t: "Tưởng rằng mình đã hiểu", s: "(giai đoạn tự tin ảo)", c: ORANGE, e: 180 },
    { n: "3", t: "Hiểu rằng mình KHÔNG hiểu", s: "← cảnh giới tối cao 🧘", c: WARNING_RED, e: 290 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THREE REALMS · DEVOPS SECT" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Theo ghi chép DevOps Tông · 3 cảnh giới:</text>
          {realms.map((r, i) => {
            const a = useScaleIn(r.e, 14);
            const y = 380 + i * 220;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 90}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 460} y={y} width={920} height={180} rx={14} fill={BG_CARD} stroke={r.c} strokeWidth={2.5} />
                <circle cx={W / 2 - 380} cy={y + 90} r={48} fill={r.c} />
                <text x={W / 2 - 380} y={y + 108} fontSize={56} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.n}</text>
                <text x={W / 2 - 300} y={y + 78} fontSize={38} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.t}</text>
                <text x={W / 2 - 300} y={y + 128} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">{r.s}</text>
              </g>
            );
          })}
          <FigFooter label="vòng tròn giác ngộ · của mọi kỹ sư" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const intro = useFadeUp(16, 14);
  const term = useScaleIn(180, 14);
  const punch = useScaleIn(280, 16);
  const cta = useFadeUp(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={K8S_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="FAMED ACROSS THREE REALMS" />
          <text x={W / 2} y={300} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={intro}>Kubernetes nổi danh tam giới</text>
          <text x={W / 2} y={352} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={intro}>không phải vì mạnh nhất… mà vì:</text>
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(80, 12)}>là công pháp duy nhất khiến hàng triệu kỹ sư</text>
          <text x={W / 2} y={486} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(110, 12)}>cùng lúc xuất hiện chung một loại tâm ma 👇</text>
          <g style={{ ...term, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={560} width={840} height={160} rx={12} fill={BG_TERM} stroke={K8S_BLUE} strokeWidth={2} />
            <rect x={W / 2 - 420} y={560} width={840} height={44} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={588} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash — kubectl</text>
            <text x={W / 2 - 390} y={650} fontSize={26} fill={K8S_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ kubectl get pods</text>
            <text x={W / 2 - 390} y={696} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 230 ? 1 : 0}>No resources found 😱</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={855} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Container của ta đâu rồi?" 🫠</text>
          </g>
          <g transform={`translate(${W / 2}, 1010)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu ở cảnh giới mấy? 👇</text>
            <line x1={-240} y1={46} x2={240} y2={46} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={96} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="k8s · nỗi đau chung của nhân loại dev" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const KubernetesTamGioi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("kubernetes_tam_gioi/voice.mp3")} />
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
