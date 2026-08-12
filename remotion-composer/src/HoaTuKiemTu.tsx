import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./dvf_beats.json";
import T from "./dvf_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD / Sci-Fi FUI =====
const BG = "#060B14";
const CARD = "#0A1626";
const CARD2 = "#0C1C30";
const RED = "#FF5470";
const BLUE = "#3E8FE0";
const CYAN = "#2BE2FF";   // Kiếm Tu / Frontend / code
const AMBER = "#FFB347";  // Họa Tu / Designer / art
const TEAL = "#2EE6C2";
const TEXT = "#DCEBF7";
const SEC = "#8FB2D0";
const MUTE = "#4F6E90";
const HOA = AMBER; // Họa Tu = Designer
const KIEM = CYAN; // Kiếm Tu = Frontend

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.7, e + d], [0.8, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const HudBG: React.FC<{ tint?: string }> = ({ tint = CYAN }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 5) % (H + 360)) - 180;
  const vx = W / 2, vy = 760;
  const floorCols = Array.from({ length: 13 }, (_, i) => -6 + i);
  const floorRows = [0, 70, 160, 280, 440, 660, 980];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dgGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={CYAN} strokeWidth="0.6" opacity="0.05" />
          </pattern>
          <radialGradient id="dgGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.11" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dgScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
            <stop offset="50%" stopColor={CYAN} stopOpacity="0.07" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="dgVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#01030A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#dgGrid)" />
        <rect width={W} height={H} fill="url(#dgGlow)" />
        <g stroke={CYAN} strokeWidth={1} opacity={0.16}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#dgScan)" />
        <rect width={W} height={H} fill="url(#dgVig)" />
        <g stroke={CYAN} strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={CYAN} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="dgTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = CYAN }) => {
  const frame = useCurrentFrame();
  const a1 = useFadeUp(0, 10), a2 = useFade(5, 10);
  const blink = Math.sin(frame / 9) > -0.3 ? 1 : 0.25;
  return (
    <g>
      <g style={a1}>
        <path d="M 80 114 L 80 150 L 100 150" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 108} y={143} fontSize={18} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">WAR</text>
        <circle cx={W - 92} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={CYAN} strokeWidth={1} opacity={0.18} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = CYAN, fill = CARD, thick = 2, rx = 10, children }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.72} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
      <g stroke={c} strokeWidth={2.5} fill="none" opacity={0.9} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      {children}
    </g>
  );
};
// HUD kiep banner
const KiepBanner: React.FC<{ y: number; tag: string; name: string; c?: string; entry: number }> = ({ y, tag, name, c = RED, entry }) => {
  const a = usePop(entry, 14);
  const x = W / 2 - 470, w = 940, h = 120, b = 22;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 60}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={CARD2} fillOpacity={0.78} stroke={c} strokeWidth={1.5} strokeOpacity={0.45} />
      <g stroke={c} strokeWidth={3} fill="none" opacity={0.95} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      <text x={W / 2} y={y + 44} fontSize={19} fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#dgTextGlow)">{name}</text>
      <line x1={W / 2 - 90} y1={y + 110} x2={W / 2 + 90} y2={y + 110} stroke={c} strokeWidth={2} opacity={0.7} />
    </g>
  );
};
// dialogue line: who = HOA/KIEM/KHACH color + label
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; big?: boolean }> = ({ y, who, whoC, text, entry, big }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={big ? 96 : 78} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + (big ? 68 : 58)} fontSize={big ? 33 : 28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 700} fontStyle="italic">{text}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={CYAN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ GIỚI IT" />
          <g transform="translate(0, 190)">
          <text x={W / 2} y={330} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>ĐẠI CHIẾN</text>
          <g style={useFadeUp(12, 12)}>
            <text x={W / 2 - 250} y={430} fontSize={70} fill={HOA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#dgTextGlow)" opacity={0.9 + 0.1 * glow}>HỌA TU</text>
            <text x={W / 2} y={430} fontSize={44} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>vs</text>
            <text x={W / 2 + 250} y={430} fontSize={70} fill={KIEM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#dgTextGlow)" opacity={0.9 + 0.1 * glow}>KIẾM TU</text>
          </g>
          <g style={usePop(T.HOOK.hoa, 13)}>
            <Card x={W / 2 - 470} y={520} w={455} h={220} c={HOA} />
            <text x={W / 2 - 242} y={578} fontSize={40} fill={HOA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🎨 HỌA TU</text>
            <text x={W / 2 - 242} y={622} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vẽ nên vạn tượng</text>
            <text x={W / 2 - 242} y={680} fontSize={30} fill={HOA} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>= DESIGNER</text>
          </g>
          <g style={usePop(T.HOOK.kiem, 13)}>
            <Card x={W / 2 + 15} y={520} w={455} h={220} c={KIEM} />
            <text x={W / 2 + 242} y={578} fontSize={40} fill={KIEM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚔️ KIẾM TU</text>
            <text x={W / 2 + 242} y={622} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hiện thực hóa công pháp</text>
            <text x={W / 2 + 242} y={680} fontSize={30} fill={KIEM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>= FRONTEND</text>
          </g>
          <g style={usePop(T.HOOK.war, 15)}>
            <Card x={W / 2 - 470} y={790} w={940} h={150} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={846} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người ngoài tưởng hai phái là đồng minh…</text>
            <text x={W / 2} y={902} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">thật ra GIAO CHIẾN gần như mỗi ngày 💀</text>
          </g>
          </g>
          <Footer label="Designer vs Frontend · cuộc chiến ngàn năm" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SUAMOTCHUT ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const changes = ["nút", "icon", "font", "spacing", "layout", "animation", "dark mode"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={HOA} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · CHỈ SỬA MỘT CHÚT" color={HOA} />
          <g transform="translate(0, 165)">
          <Say y={280} who="HỌA TU" whoC={HOA} text="&quot;ta chỉ sửa một chút&quot;" entry={T.SUAMOTCHUT.quote} big />
          <Say y={392} who="KIẾM TU" whoC={KIEM} text="&quot;được.&quot; 🙂" entry={T.SUAMOTCHUT.ok} />
          <text x={W / 2} y={512} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" opacity={useFade(T.SUAMOTCHUT.changes ? (T.SUAMOTCHUT.changes as number[])[0] - 6 : 0, 10)}>[ 10:00 SAU ] nụ cười biến mất 💀</text>
          <g>
            {changes.map((t, i) => (
              <g key={i} style={usePop((T.SUAMOTCHUT.changes as number[])[i] ?? 0, 7)}>
                <Card x={W / 2 - 470 + (i % 2) * 480} y={545 + Math.floor(i / 2) * 74} w={i === 6 ? 940 : 450} h={60} c={RED} rx={8} thick={1.5} />
                <text x={i === 6 ? W / 2 : W / 2 - 245 + (i % 2) * 480} y={583 + Math.floor(i / 2) * 74} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t} → ĐỔI ✖</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.SUAMOTCHUT.reveal, 15)}>
            <Card x={W / 2 - 470} y={880} w={940} h={130} c={AMBER} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={934} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trong Họa Đạo, "chỉ sửa một chút" chính là:</text>
            <text x={W / 2} y={984} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">LÀM LẠI TỪ ĐẦU 🤣</text>
          </g>
          </g>
          <Footer label="'chỉ sửa mỗi giao diện' = đổi cả thế giới" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 THIENNHAN ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const nits = ["padding lệch 4px", "border dày +1px", "shadow chưa đúng", "line-height hơi cao"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={KIEM} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · THIÊN NHÃN" color={KIEM} />
          <g transform="translate(0, 165)">
          <Say y={280} who="KIẾM TU" whoC={KIEM} text="&quot;pixel nào cũng giống rồi&quot;" entry={T.THIENNHAN.claim} big />
          <text x={W / 2} y={430} fontSize={26} fill={HOA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade((T.THIENNHAN.nits as number[])[0] - 6, 10)}>Họa Tu nhìn một cái · thở dài… 😮‍💨</text>
          <g>
            {nits.map((t, i) => (
              <g key={i} style={usePop((T.THIENNHAN.nits as number[])[i] ?? 0, 8)}>
                <Card x={W / 2 - 470} y={470 + i * 82} w={940} h={66} c={HOA} rx={9} thick={2} />
                <text x={W / 2} y={512 + i * 82} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚠ {t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.THIENNHAN.zoom, 15)}>
            <Card x={W / 2 - 470} y={820} w={940} h={190} c={AMBER} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={872} fontSize={27} fill={KIEM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"ngươi nhìn kiểu gì vậy?!"</text>
            <text x={W / 2} y={928} fontSize={38} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">"ta zoom 400%" 🔍</text>
            <text x={W / 2} y={978} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ Họa Tu đều tu THIÊN NHÃN THUẬT</text>
          </g>
          </g>
          <Footer label="mắt Designer = kính hiển vi pixel" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 MOBILE ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const pile = ["12 card", "8 bảng", "3 biểu đồ", "1 sidebar"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={KIEM} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · KHÔNG GIAN CHIẾT ĐIỆP" color={KIEM} />
          <g transform="translate(0, 200)">
          <Say y={280} who="KIẾM TU" whoC={KIEM} text="&quot;mobile đâu?&quot;" entry={T.MOBILE.ask} />
          <Say y={378} who="HỌA TU" whoC={HOA} text="&quot;cứ thu nhỏ lại là được&quot; 🙂" entry={T.MOBILE.shrink} />
          <text x={W / 2} y={500} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade((T.MOBILE.pile as number[])[0] - 6, 10)}>nhét TẤT CẢ xuống màn hình điện thoại:</text>
          <g>
            {pile.map((t, i) => (
              <g key={i} style={usePop((T.MOBILE.pile as number[])[i] ?? 0, 8)}>
                <Card x={W / 2 - 460 + (i % 2) * 480} y={535 + Math.floor(i / 2) * 90} w={440} h={72} c={RED} rx={9} thick={2} />
                <text x={W / 2 - 240 + (i % 2) * 480} y={580 + Math.floor(i / 2) * 90} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.MOBILE.punch, 15)}>
            <Card x={W / 2 - 470} y={745} w={940} h={165} c={AMBER} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={800} fontSize={28} fill={KIEM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"thu kiểu gì đây?!"</text>
            <text x={W / 2} y={856} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">"đó là chuyện của ngươi" 😌</text>
            <text x={W / 2} y={900} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>→ Không Gian Chiết Điệp Đạo</text>
          </g>
          </g>
          <Footer label="responsive · nỗi đau muôn thuở của Frontend" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 FONT ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={HOA} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · PHÔNG (FONT)" color={HOA} />
          <g transform="translate(0, 200)">
        <Say y={340} who="HỌA TU" whoC={HOA} text="&quot;font sao lại khác thế này?&quot;" entry={T.FONT.q1} />
        <Say y={438} who="KIẾM TU" whoC={KIEM} text="&quot;máy em không có font đó&quot;" entry={T.FONT.q2} />
        <Say y={536} who="HỌA TU" whoC={HOA} text="&quot;thế sao không cài?&quot;" entry={T.FONT.q3} />
        <g style={usePop(T.FONT.react1, 15)}>
          <Card x={W / 2 - 470} y={640} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
          <text x={W / 2} y={706} fontSize={33} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">"em tưởng font nào cũng giống nhau" 💀</text>
        </g>
        <g style={usePop(T.FONT.react2, 14)}>
          <Card x={W / 2 - 470} y={780} w={940} h={140} c={AMBER} fill={CARD2} thick={2.5} />
          <text x={W / 2} y={834} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Họa Tu đạo tâm bất ổn…</text>
          <text x={W / 2} y={888} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">lần đầu tiên · muốn TỰ HỌC REACT 🤣</text>
        </g>
        </g>
          <Footer label="'font nào cũng giống' · câu nói khiến Designer nhập ma" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 KHACHHANG ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const demand = ["logo to hơn", "màu xanh hơn chút", "làm giống web đối thủ"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KẺ THÙ THẬT SỰ" color={RED} />
          <g transform="translate(0, 175)">
          <KiepBanner y={250} tag="XUẤT HIỆN" name="KHÁCH HÀNG" c={RED} entry={T.KHACHHANG.enter} />
          <g style={usePop(T.KHACHHANG.feedback, 13)}>
            <Card x={W / 2 - 470} y={400} w={940} h={130} c={RED} rx={10} thick={2} />
            <text x={W / 2} y={452} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"đẹp… cơ mà nó chưa có điểm nhấn"</text>
            <text x={W / 2} y={502} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">— "điểm nhấn là gì?" — "ta cũng không biết" 💀</text>
          </g>
          <g>
            {demand.map((t, i) => (
              <g key={i} style={usePop((T.KHACHHANG.demand as number[])[i] ?? 0, 8)}>
                <Card x={W / 2 - 470} y={560 + i * 78} w={940} h={64} c={RED} rx={9} thick={1.5} />
                <text x={W / 2} y={601 + i * 78} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"{t}"</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.KHACHHANG.truth, 15)}>
            <Card x={W / 2 - 470} y={810} w={940} h={150} c={AMBER} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={862} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Họa Tu nhìn Kiếm Tu · Kiếm Tu nhìn Họa Tu…</text>
            <text x={W / 2} y={918} fontSize={33} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">kẻ thù thật sự · chưa bao giờ là ĐỐI PHƯƠNG</text>
          </g>
          </g>
          <Footer label="Designer & Frontend đoàn kết trước 1 câu của khách" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DAOLY ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={CYAN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" />
          <g transform="translate(0, 205)">
        <g style={usePop(T.DAOLY.want, 13)}>
          <Card x={W / 2 - 470} y={270} w={455} h={150} c={HOA} />
          <text x={W / 2 - 242} y={320} fontSize={24} fill={HOA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HỌA TU muốn</text>
          <text x={W / 2 - 242} y={362} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Kiếm Tu code</text>
          <text x={W / 2 - 242} y={396} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>giống hệt Figma</text>
          <Card x={W / 2 + 15} y={270} w={455} h={150} c={KIEM} />
          <text x={W / 2 + 242} y={320} fontSize={24} fill={KIEM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KIẾM TU muốn</text>
          <text x={W / 2 + 242} y={362} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Họa Tu</text>
          <text x={W / 2 + 242} y={396} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tự code lấy</text>
        </g>
        <g style={usePop(T.DAOLY.unite, 15)}>
          <Card x={W / 2 - 470} y={450} w={940} h={160} c={RED} fill={CARD2} thick={2.5} />
          <text x={W / 2} y={502} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khách nói "làm giống web kia" / "sửa một chút thôi"</text>
          <text x={W / 2} y={550} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ 2 phái lập tức hóa giải ân oán, đồng thanh:</text>
          <text x={W / 2} y={594} fontSize={31} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dgTextGlow)">"Lại đổi yêu cầu nữa à?!" 💀</text>
        </g>
        <g style={usePop(T.DAOLY.file, 15)}>
          <Card x={W / 2 - 480} y={650} w={960} h={200} c={AMBER} fill={CARD2} thick={3} />
          <text x={W / 2} y={702} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không có Họa Tu bất bại · không có Kiếm Tu vô địch</text>
          <text x={W / 2} y={748} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ có phiên bản thiết kế cuối cùng:</text>
          <text x={W / 2} y={796} fontSize={21} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>final_final_v2_ok_last_edit_real_final.fig</text>
          <text x={W / 2} y={832} fontSize={24} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">…vẫn chưa phải bản cuối 🤣</text>
        </g>
        </g>
          <Footer label="final_final_v2_ok_last_edit_real_final.fig" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 CTA ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(52, 14);
  const btn = usePop(92, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={CYAN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={600} fontSize={40} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi là <tspan fill={HOA}>HỌA TU</tspan> hay <tspan fill={KIEM}>KIẾM TU</tspan>?</text>
            <text x={W / 2} y={664} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">hay chính là KHÁCH HÀNG nói "chỉ sửa một chút"? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={792} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={870} width={620} height={146} rx={20} fill={CYAN} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={882} width={584} height={122} rx={14} fill={CARD2} stroke={CYAN} strokeWidth={3} />
              <text x={W / 2} y={962} fontSize={48} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#dgTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1090} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(128, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi khách đổi yêu cầu lần nữa" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

export const HoaTuKiemTu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("designer_vs_fe/voice.mp3")} />
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
