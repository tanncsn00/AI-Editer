import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./dao_to_xuyen_khong_beats.json";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = AMBER }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dkgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="dkgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="dkglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dkscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dkgrid)" />
        <rect width={W} height={H} fill="url(#dkgrid2)" />
        <rect width={W} height={H} fill="url(#dkglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#dkscan)" />
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

// master glyph circle
const Master: React.FC<{ cx: number; cy: number; r: number; color: string; emoji: string; label: string; entry: number }> = ({ cx, cy, r, color, emoji, label, entry }) => {
  const a = useScaleIn(entry, 16);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
      <circle cx={cx} cy={cy} r={r} fill={BG_CARD} stroke={color} strokeWidth={3} />
      <text x={cx} y={cy + r * 0.34} fontSize={r * 0.95} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">{emoji}</text>
      <text x={cx} y={cy + r + 48} fontSize={26} fill={color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{label}</text>
    </g>
  );
};

// dialogue bubble
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
  const title = useScaleIn(14, 16);
  const tag = useFadeUp(60, 12);
  const skills = ["Java", "C++", "Python", "Database", "Distributed Systems"];
  const skillCol = [JADE, ACCENT_BLUE, AMBER, VIOLET, ORANGE];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE GRANDMASTER OF SOFTWARE" />
          <Master cx={W / 2} cy={360} r={92} color={AMBER} emoji="🧙" label="ĐẠO TỔ" entry={14} />
          <g style={{ ...title, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={580} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NẾU MỘT ĐẠO TỔ CÔNG NGHỆ</text>
            <text x={W / 2} y={648} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">XUYÊN KHÔNG 100 NĂM SAU</text>
          </g>
          <text x={W / 2} y={736} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={tag}>Tu vi thông thiên · tinh thông vạn pháp:</text>
          {skills.map((s, i) => {
            const op = useFade(150 + i * 22, 10);
            return (
              <g key={i} opacity={op}>
                <rect x={W / 2 - 300} y={800 + i * 96} width={600} height={76} rx={8} fill={BG_CARD} stroke={skillCol[i]} strokeWidth={2} />
                <text x={W / 2 - 270} y={848 + i * 96} fontSize={26} fill={skillCol[i]} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{">"}</text>
                <text x={W / 2} y={848 + i * 96} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s}</text>
              </g>
            );
          })}
          <FigFooter label="một huyền thoại bế quan trăm năm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 XUYÊN KHÔNG ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const term = useScaleIn(20, 14);
  const arrow = useFade(80, 16);
  const dest = useScaleIn(120, 14);
  const beam = interpolate(frame, [80, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="TIME JUMP · +100 YEARS" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Trong lúc bế quan nghiên cứu công pháp…</text>
          <g style={{ ...term, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 360} y={400} width={720} height={150} rx={12} fill={BG_TERM} stroke={VIOLET} strokeWidth={2} />
            <rect x={W / 2 - 360} y={400} width={720} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={430} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash — bế quan</text>
            <text x={W / 2 - 330} y={500} fontSize={28} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ deep-meditation --years +100</text>
            <text x={W / 2 - 330} y={534} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// vô tình xuyên không...</text>
          </g>
          {/* time arrow */}
          <g opacity={arrow}>
            <line x1={W / 2 - 280} y1={760} x2={W / 2 + 220} y2={760} stroke={VIOLET} strokeWidth={3} strokeDasharray="10 8" opacity={beam} />
            <rect x={W / 2 - 360} y={690} width={200} height={140} rx={10} fill={BG_CARD} stroke={SLATE} strokeWidth={2} />
            <text x={W / 2 - 260} y={745} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NĂM</text>
            <text x={W / 2 - 260} y={795} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>2026</text>
          </g>
          <g style={{ ...dest, transformOrigin: `${W / 2 + 260}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 + 160} y={690} width={200} height={140} rx={10} fill={BG_CARD} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2 + 260} y={745} fontSize={24} fill={VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NĂM</text>
            <text x={W / 2 + 260} y={795} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>2126</text>
          </g>
          <g style={useFadeUp(140, 14)}>
            <text x={W / 2} y={980} fontSize={44} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>vô tình XUYÊN KHÔNG</text>
            <text x={W / 2} y={1044} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tới một trăm năm sau 🌌</text>
          </g>
          <FigFooter label="bế quan một giấc · thế gian đổi dời" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 KHÔNG AI VIẾT CODE ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const term = useScaleIn(30, 14);
  const cursorOn = Math.floor(frame / 16) % 2 === 0;
  const punch = useScaleIn(140, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="NO ONE IS CODING" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Vừa mở mắt · ngài đi tìm kiếm tu thời đại mới…</text>
          <g style={{ ...term, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={420} width={840} height={400} rx={12} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2} />
            <rect x={W / 2 - 420} y={420} width={840} height={48} rx={12} fill={BG_CARD} />
            <circle cx={W / 2 - 392} cy={444} r={7} fill={WARNING_RED} />
            <circle cx={W / 2 - 368} cy={444} r={7} fill={AMBER} />
            <circle cx={W / 2 - 344} cy={444} r={7} fill={JADE} />
            <text x={W / 2} y={450} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>editor — main.js</text>
            <text x={W / 2 - 390} y={530} fontSize={26} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>1</text>
            <text x={W / 2 - 340} y={530} fontSize={26} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic">// đợi ai đó gõ phím...</text>
            <text x={W / 2 - 390} y={580} fontSize={26} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>2</text>
            <text x={W / 2 - 340} y={580} fontSize={26} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{cursorOn ? "▋" : ""}</text>
            <text x={W / 2} y={720} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>0 humans typing</text>
            <text x={W / 2} y={764} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic">// khắp nơi · tịnh không một bóng coder</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 980px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={900} w={920} h={150} color={ACCENT_BLUE} thick={2.5} />
            <text x={W / 2} y={965} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ngài nhìn khắp nơi…</text>
            <text x={W / 2} y={1020} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chẳng thấy ai VIẾT CODE 😳</text>
          </g>
          <FigFooter label="thời đại mới · không một dòng tay viết" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 AI VIẾT GIÚP ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const gen = useScaleIn(220, 14);
  const stunned = useFadeUp(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="AI WRITES IT" />
          <Bubble y={280} side="L" speaker="🧙 ĐẠO TỔ" text="Ngươi không tu luyện sao?" color={AMBER} entry={30} />
          <Bubble y={410} side="R" speaker="🧑 HẬU BỐI" text="Vẫn tu. Chỉ là AI viết giúp rồi." color={JADE} entry={110} size={30} />
          {/* generate system */}
          <g style={{ ...gen, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={560} width={840} height={320} rx={12} fill={BG_TERM} stroke={JADE} strokeWidth={2} />
            <rect x={W / 2 - 420} y={560} width={840} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={590} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ai-agent — gõ vài câu</text>
            <text x={W / 2 - 390} y={650} fontSize={24} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{"> tạo cho ta một hệ thống hoàn chỉnh"}</text>
            {["✓ backend  · API + auth", "✓ database · migrated", "✓ frontend · deployed", "✓ tests    · 100% pass"].map((l, i) => (
              <text key={i} x={W / 2 - 390} y={710 + i * 42} fontSize={24} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 250 + i * 14 ? 1 : 0}>{l}</text>
            ))}
          </g>
          <g style={stunned}>
            <TechBox x={W / 2 - 460} y={950} w={920} h={150} color={SLATE} thick={2.5} />
            <text x={W / 2} y={1015} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Đạo Tổ đứng tại chỗ hồi lâu…</text>
            <text x={W / 2} y={1068} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không nói nên lời 😶</text>
          </g>
          <FigFooter label="gõ vài câu · cả hệ thống hiện ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 KHÔNG AI DEBUG ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const term = useScaleIn(120, 14);
  const doubt = useFadeUp(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="NO ONE DEBUGS" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Một chuyện còn đáng sợ hơn…</text>
          <Bubble y={360} side="L" speaker="🧙 ĐẠO TỔ" text="Bug ở đâu? Ai đi sửa?" color={AMBER} entry={40} />
          <g style={{ ...term, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={500} width={840} height={330} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <rect x={W / 2 - 420} y={500} width={840} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={530} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ai-debugger — auto</text>
            <text x={W / 2 - 390} y={592} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>● bug detected: null pointer</text>
            <text x={W / 2 - 390} y={646} fontSize={26} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={600} opacity={frame > 180 ? 1 : 0}>{"> AI tự phân tích..."}</text>
            <text x={W / 2 - 390} y={700} fontSize={26} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 210 ? 1 : 0}>✓ AI tự tìm rồi</text>
            <text x={W / 2 - 390} y={754} fontSize={26} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 240 ? 1 : 0}>✓ AI tự sửa luôn · committed</text>
            <text x={W / 2 - 390} y={800} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" opacity={frame > 260 ? 1 : 0}>// con người không cần đụng tay</text>
          </g>
          <g style={doubt}>
            <TechBox x={W / 2 - 460} y={920} w={920} h={160} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={985} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Đạo Tổ bắt đầu nghi ngờ</text>
            <text x={W / 2} y={1040} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cả trăm năm tu luyện của mình 😰</text>
          </g>
          <FigFooter label="bug tự hiện · tự diệt · không cần kiếm tu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 HẬU BỐI TÂN THỦ ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const barA = interpolate(frame, [150, 200], [0, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barB = interpolate(frame, [230, 290], [0, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = useFadeUp(380, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="1 MONTH = 3 YEARS" />
          <text x={W / 2} y={310} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(8, 12)}>Thứ khiến ngài xuất hiện tâm ma…</text>
          <g style={useFadeUp(60, 12)}>
            <text x={W / 2} y={400} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Một hậu bối mới nhập môn · tu chưa đầy 1 tháng</text>
          </g>
          {/* power bars */}
          <g opacity={useFade(140, 12)}>
            <text x={W / 2 - 380} y={520} fontSize={26} fill={ORANGE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🌱 TÂN THỦ + khí linh AI</text>
            <rect x={W / 2 - 380} y={540} width={760} height={56} rx={6} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <rect x={W / 2 - 380} y={540} width={barA} height={56} rx={6} fill={ORANGE} />
            <text x={W / 2 - 360} y={578} fontSize={26} fill={BG_NAVY} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={frame > 195 ? 1 : 0}>1 tháng tu</text>
          </g>
          <g opacity={useFade(220, 12)}>
            <text x={W / 2 - 380} y={680} fontSize={26} fill={SLATE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚔️ KIẾM TU 3 NĂM trước</text>
            <rect x={W / 2 - 380} y={700} width={760} height={56} rx={6} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <rect x={W / 2 - 380} y={700} width={barB} height={56} rx={6} fill={SLATE} />
            <text x={W / 2 - 360} y={738} fontSize={26} fill={BG_NAVY} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={frame > 285 ? 1 : 0}>3 năm tu</text>
          </g>
          <text x={W / 2} y={850} fontSize={48} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={useScaleIn(310, 12)}>= NGANG NHAU ⚡</text>
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={930} w={920} h={150} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={995} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tu vi trăm năm của Đạo Tổ</text>
            <text x={W / 2} y={1050} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">suýt nữa PHẢN PHỆ 💥</text>
          </g>
          <FigFooter label="khí linh AI · rút ngắn vạn dặm tu hành" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 MỘT NGƯỜI QUỐC GIA ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const human = useScaleIn(60, 14);
  const punch = useFadeUp(380, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE ONE-PERSON NATION" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Một người · vận hành hệ thống quy mô…</text>
          <text x={W / 2} y={356} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={useScaleIn(40, 12)}>BẰNG CẢ MỘT QUỐC GIA 🌐</text>
          {/* one human node */}
          <g style={{ ...human, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={480} r={60} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={3} />
            <text x={W / 2} y={500} fontSize={56} textAnchor="middle">🧑‍💻</text>
            <text x={W / 2} y={576} fontSize={22} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>1 CON NGƯỜI</text>
          </g>
          {/* AI grid behind */}
          <g opacity={useFade(150, 16)}>
            <text x={W / 2} y={660} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic">// phía sau · hàng trăm AI âm thầm làm việc</text>
            {Array.from({ length: 40 }).map((_, i) => {
              const col = i % 10, row = Math.floor(i / 10);
              const x = W / 2 - 432 + col * 96, y = 700 + row * 80;
              return (
                <g key={i} opacity={frame > 170 + i * 3 ? 1 : 0}>
                  <rect x={x} y={y} width={76} height={62} rx={8} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
                  <text x={x + 38} y={y + 44} fontSize={32} textAnchor="middle">🤖</text>
                </g>
              );
            })}
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={1050} w={920} h={130} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1108} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Đồng môn đâu?" — "Không có."</text>
            <text x={W / 2} y={1156} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ngài không còn hiểu thời đại nữa 🫥</text>
          </g>
          <FigFooter label="một mình · chỉ huy trăm vạn khí linh" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 AI DẠY AI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const steps = [
    { e: 120, c: ACCENT_BLUE, icon: "🤖", t: "AI #1 · giải thích code" },
    { e: 180, c: VIOLET, icon: "🤖", t: "AI #2 · phản biện" },
    { e: 240, c: AMBER, icon: "🤖", t: "AI #3 · review" },
    { e: 300, c: JADE, icon: "🤖", t: "AI #4 · approve ✓" },
  ];
  const human = useFadeUp(370, 14);
  const punch = useFadeUp(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="AI REVIEWS AI" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Thiên địa vẫn chưa dừng lại…</text>
          {steps.map((s, i) => {
            const a = useScaleIn(s.e, 12);
            const y = 380 + i * 130;
            return (
              <g key={i}>
                {i < 3 && <line x1={W / 2} y1={y + 92} x2={W / 2} y2={y + 130} stroke={s.c} strokeWidth={2.5} strokeDasharray="6 5" opacity={frame > s.e + 30 ? 0.6 : 0} />}
                <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 46}px`, transformBox: "fill-box" }}>
                  <rect x={W / 2 - 380} y={y} width={760} height={92} rx={12} fill={BG_CARD} stroke={s.c} strokeWidth={2} />
                  <text x={W / 2 - 330} y={y + 62} fontSize={42} textAnchor="middle">{s.icon}</text>
                  <text x={W / 2 - 280} y={y + 60} fontSize={34} fill={s.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.t}</text>
                </g>
              </g>
            );
          })}
          <g style={human}>
            <text x={W / 2} y={960} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">🧑 con người chỉ đứng bên cạnh quan sát…</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={1010} w={920} h={140} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1072} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Đạo Tổ đứng yên thật lâu</text>
            <text x={W / 2} y={1122} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">suýt nghi ngờ cả THIÊN ĐẠO 🌀</text>
          </g>
          <FigFooter label="AI dạy AI · con người ngoài cuộc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 HỌC ĐIỀU KHIỂN AI ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const card = useScaleIn(140, 16);
  const sky = useFadeUp(360, 14);
  const dark = useScaleIn(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE NEW DISCIPLINE" />
          <Bubble y={290} side="L" speaker="🧙 ĐẠO TỔ" text="Kiếm tu các ngươi còn học gì?" color={AMBER} entry={40} size={30} />
          {/* the revelation card */}
          <g style={{ ...card, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={440} width={940} height={320} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={510} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// chân lý thời đại mới</text>
            <text x={W / 2} y={576} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">Không còn học cách VIẾT code</text>
            <text x={W / 2} y={656} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Học cách ĐIỀU KHIỂN</text>
            <text x={W / 2} y={716} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>thứ biết viết code 🎴</text>
          </g>
          <text x={W / 2} y={870} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={sky}>Đạo Tổ nghe xong · ngẩng đầu nhìn trời ☁️</text>
          <g style={{ ...dark, transformOrigin: `${W / 2}px 1010px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={930} w={920} h={160} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={995} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Lần đầu sau trăm năm · một ý nghĩ đáng sợ:</text>
            <text x={W / 2} y={1052} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"thời đại của mình… đã kết thúc" 🥀</text>
          </g>
          <FigFooter label="không viết code nữa · điều khiển thứ viết code" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(16, 14);
  const nots = ["framework", "ngôn ngữ", "công cụ"];
  const reveal = useScaleIn(230, 16);
  const cta = useFadeUp(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE ONLY CONSTANT" />
          <text x={W / 2} y={330} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={intro}>Thứ thay đổi nhanh nhất giới công nghệ…</text>
          {nots.map((n, i) => {
            const op = useFade(90 + i * 40, 10);
            return (
              <g key={i} opacity={op}>
                <rect x={W / 2 - 380} y={400 + i * 86} width={760} height={70} rx={8} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2 - 350} y={444 + i * 86} fontSize={34} fill={WARNING_RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗</text>
                <text x={W / 2} y={444 + i * 86} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không phải {n}</text>
              </g>
            );
          })}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={760} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// mà là:</text>
            <text x={W / 2} y={822} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>điều hôm nay tưởng KHÔNG THỂ</text>
            <text x={W / 2} y={888} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">100 năm sau · thành bình thường 🌌</text>
          </g>
          <g transform={`translate(${W / 2}, 1050)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu nghĩ sao? 👇</text>
            <line x1={-240} y1={46} x2={240} y2={46} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={96} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="cái duy nhất bất biến · là sự đổi thay" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const DaoToXuyenKhong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("dao_to_xuyen_khong/voice.mp3")} />
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
