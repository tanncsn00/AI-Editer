import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./rc_beats.json";
import T from "./rc_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD · 2 luồng (sư huynh cyan / sư đệ violet) · collision đỏ · solution green =====
const BG = "#070A12";
const CARD = "#0D1420";
const CARD2 = "#10192B";
const RED = "#FF5470";     // collision / kiếp
const A = "#2BE2FF";       // Thread A · sư huynh
const B = "#A78BFF";       // Thread B · sư đệ
const GREEN = "#2EE6A8";   // solution · khóa · trật tự
const GOLD = "#FFC24B";    // reveal · đạo lý
const TEXT = "#E4EEF7";
const SEC = "#93AEC4";
const MUTE = "#54708C";
const HUDC = "#3E6C8C";

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

const HudBG: React.FC<{ tint?: string }> = ({ tint = A }) => {
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
          <pattern id="rcGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="rcGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rcScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rcVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#02030A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#rcGrid)" />
        <rect width={W} height={H} fill="url(#rcGlow)" />
        <g strokeWidth={1} opacity={0.14}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#rcScan)" />
        <rect width={W} height={H} fill="url(#rcVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={A} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={B} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={A} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={B} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="rcTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = A }) => {
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
        <text x={W - 112} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">RACE</text>
        <circle cx={W - 96} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = A, fill = CARD, thick = 2, rx = 10, children }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.74} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
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
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; big?: boolean }> = ({ y, who, whoC, text, entry, big }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={big ? 96 : 78} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + (big ? 68 : 58)} fontSize={big ? 33 : 28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = GOLD, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 52} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={37} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · GIỚI IT" />
          <g transform="translate(0, 175)">
            <text x={W / 2} y={330} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>THIÊN KIẾP QUỶ DỊ NHẤT</text>
            <text x={W / 2} y={412} fontSize={78} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#rcTextGlow)" style={useFadeUp(12, 12)} opacity={0.9 + 0.1 * glow}>RACE CONDITION</text>
            <g style={usePop(T.HOOK.worst, 13)}>
              <Card x={W / 2 - 470} y={480} w={940} h={100} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={544} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>loại kiếp ngươi <tspan fill={RED} fontWeight={900}>KHÔNG BAO GIỜ</tspan> bắt được 💀</text>
            </g>
            <g style={usePop(T.HOOK.odds, 14)}>
              <Card x={W / 2 - 470} y={600} w={455} h={120} c={GREEN} rx={9} thick={1.5} />
              <text x={W / 2 - 242} y={650} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chạy 1000 lần</text>
              <text x={W / 2 - 242} y={692} fontSize={30} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>999 lần bình an ✅</text>
              <Card x={W / 2 + 15} y={600} w={455} h={120} c={RED} rx={9} thick={1.5} />
              <text x={W / 2 + 242} y={650} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đúng 1 lần</text>
              <text x={W / 2 + 242} y={692} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cả tông môn RA TRO 💀</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 380} y={780} w={760} h={140} c={GOLD} fill={CARD2} thick={3} />
              <text x={W / 2} y={832} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi loại kiếp ấy là</text>
              <text x={W / 2} y={890} fontSize={50} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" filter="url(#rcTextGlow)">RACE CONDITION</text>
            </g>
          </g>
          <Footer label="lúc có lúc không · kiếp không ai bắt được" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 HAISUDE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="HAI SƯ ĐỆ · = 2 LUỒNG" />
        <g transform="translate(0, 165)">
          <g style={usePop(T.HAISUDE.book, 13)}>
            <Card x={W / 2 - 470} y={280} w={455} h={120} c={A} />
            <text x={W / 2 - 242} y={334} fontSize={34} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧵 SƯ HUYNH</text>
            <text x={W / 2 - 242} y={374} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Luồng 1</text>
            <Card x={W / 2 + 15} y={280} w={455} h={120} c={B} />
            <text x={W / 2 + 242} y={334} fontSize={34} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧵 SƯ ĐỆ</text>
            <text x={W / 2 + 242} y={374} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Luồng 2</text>
            <text x={W / 2} y={340} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>
          </g>
          <g style={usePop(T.HAISUDE.rule, 13)}>
            <Card x={W / 2 - 470} y={430} w={940} h={130} c={GREEN} rx={10} thick={2} />
            <text x={W / 2} y={480} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cùng canh 1 cuốn sổ linh thạch · ai tới phiên thì:</text>
            <text x={W / 2} y={524} fontSize={28} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>mở sổ → cộng phần mình → ghi lại ✅</text>
          </g>
          <Reveal y={620} top="ngàn năm chưa lệch một đồng… nhưng kẻ nào cũng nghĩ mình nhanh hơn:" big="chẳng ai chịu nhường ai → MẦM HỌA 💀" entry={T.HAISUDE.seed} c={RED} h={150} />
        </g>
        <Footer label="hai luồng · một tài nguyên chung" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 THIENKIEP ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP GIÁNG · LOST UPDATE" color={RED} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.THIENKIEP.both, 13)}>
            <Card x={W / 2 - 470} y={260} w={455} h={92} c={A} rx={9} thick={1.5} />
            <text x={W / 2 - 242} y={300} fontSize={22} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sư huynh mở sổ</text>
            <text x={W / 2 - 242} y={334} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>thấy 100</text>
            <Card x={W / 2 + 15} y={260} w={455} h={92} c={B} rx={9} thick={1.5} />
            <text x={W / 2 + 242} y={300} fontSize={22} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sư đệ mở sổ (cùng lúc)</text>
            <text x={W / 2 + 242} y={334} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>cũng thấy 100</text>
          </g>
          <g style={usePop(T.THIENKIEP.add, 12)}>
            <Card x={W / 2 - 470} y={366} w={940} h={70} c={RED} rx={9} thick={1.5} />
            <text x={W / 2} y={410} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>cả hai cùng +50 → cùng ghi <tspan fill={RED} fontWeight={900}>150</tspan></text>
          </g>
          <g style={usePop(T.THIENKIEP.should, 13)}>
            <Card x={W / 2 - 470} y={450} w={940} h={90} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={506} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>đáng lẽ phải là <tspan fill={GREEN} fontWeight={900}>200</tspan> · sổ chỉ ghi <tspan fill={RED} fontWeight={900}>150</tspan> 💀</text>
          </g>
          <g style={usePop(T.THIENKIEP.vanish, 15)}>
            <Card x={W / 2 - 470} y={556} w={940} h={100} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={618} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">50 linh thạch · BỐC HƠI khỏi nhân gian 💀</text>
          </g>
          <Reveal y={696} top="không ai lấy, không ai trộm… chỉ đơn giản biến mất" big="đạo tâm cả hai · rạn đúng một đường 🤣" entry={T.THIENKIEP.crack} c={GOLD} h={140} />
        </g>
        <Footer label="hai lượt ghi · một cái đè lên cái kia" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 PHAMTRAN ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={B} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="PHÀM TRẦN CŨNG DÍNH" color={RED} />
        <g transform="translate(0, 165)">
          <g style={usePop(T.PHAMTRAN.ticket, 13)}>
            <Card x={W / 2 - 470} y={290} w={940} h={100} c={B} rx={10} thick={2} />
            <text x={W / 2} y={352} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🎫 một sạp vé · còn đúng <tspan fill={B} fontWeight={900}>1 vé cuối</tspan> → 2 người cùng bấm mua</text>
          </g>
          <g style={usePop(T.PHAMTRAN.both2, 14)}>
            <Card x={W / 2 - 470} y={410} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={462} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hệ thống gật đầu với cả hai: "mua thành công"</text>
            <text x={W / 2} y={512} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">một vé — HAI chủ nhân 🤣</text>
          </g>
          <Reveal y={600} top="tông môn thì của cải BỐC HƠI · phàm trần thì ĐẺ ra từ hư không" big="cùng một tội đồ — hai gương mặt 💀" entry={T.PHAMTRAN.contrast} c={GOLD} h={150} />
        </g>
        <Footer label="bán 1 vé cho 2 người · rút 1 tài khoản 2 nơi" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 HEISENBUG ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · HEISENBUG" color={RED} />
        <g transform="translate(0, 150)">
          <Say y={280} who="TRƯỞNG LÃO (chạy thử 100 lần · bình thường)" whoC={A} text="&quot;trên máy ta chạy tốt&quot; 😌" entry={T.HEISENBUG.report} />
          <g style={usePop(T.HEISENBUG.boom, 14)}>
            <Card x={W / 2 - 470} y={386} w={940} h={90} c={RED} fill={CARD2} thick={3} />
            <text x={W / 2} y={444} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">💥 vừa quay lưng — PRODUCTION nổ cái đùng</text>
          </g>
          <g style={usePop(T.HEISENBUG.vanish2, 13)}>
            <Card x={W / 2 - 470} y={490} w={940} h={110} c={B} rx={10} thick={2} />
            <text x={W / 2} y={538} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>quay lại nhìn → lỗi đã biến mất 😨</text>
            <text x={W / 2} y={578} fontSize={26} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">cứ như nó biết ta đang nhìn…</text>
          </g>
          <Reveal y={660} top="QA tra 3 ngày 3 đêm · bắt không được 1 lần tái hiện" big="✨ con quỷ ẩn hiện ấy — HEISENBUG" entry={T.HEISENBUG.name} c={GOLD} h={150} />
        </g>
        <Footer label="nhìn vào thì hết lỗi · quay đi thì nổ" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 NGO ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGỘ RA TỘI ĐỒ" color={GOLD} />
        <g transform="translate(0, 165)">
          <g style={usePop(T.NGO.nocode, 13)}>
            <Card x={W / 2 - 470} y={290} w={940} h={130} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={342} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hóa ra không ai code sai cả…</text>
            <text x={W / 2} y={392} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">tội đồ thật sự — 2 chữ "CÙNG LÚC" 💀</text>
          </g>
          <g style={usePop(T.NGO.who, 13)}>
            <Card x={W / 2 - 470} y={440} w={940} h={110} c={B} rx={10} thick={2} />
            <text x={W / 2} y={488} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ai xong trước ai xong sau — chẳng do họ định</text>
            <text x={W / 2} y={528} fontSize={26} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà do Thiên Cơ vô hình · tung một con xúc xắc 🎲</text>
          </g>
          <Reveal y={610} top="người đời gọi vị thần đỏng đảnh ấy là:" big="🎲 BỘ ĐIỀU PHỐI (scheduler) · xúc xắc đổi → kết quả đổi" entry={T.NGO.scheduler} c={GOLD} h={150} />
        </g>
        <Footer label="thứ tự thực thi · do scheduler quyết, mỗi lần một khác" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 LOCK (Mutex / Critical Section) ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="PHÁP MÔN ① · KHÓA (MUTEX)" color={GREEN} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.LOCK.root, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={78} c={RED} rx={10} thick={1.5} />
            <text x={W / 2} y={298} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>gốc của loạn = 2 người <tspan fill={RED} fontWeight={900}>CÙNG</tspan> chạm 1 cuốn sổ</text>
          </g>
          <g style={usePop(T.LOCK.grab, 13)}>
            <Card x={W / 2 - 470} y={344} w={940} h={108} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={394} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đặt 1 chiếc 🔒 khóa: muốn sửa phải <tspan fill={GREEN} fontWeight={900}>GIÀNH khóa</tspan></text>
            <text x={W / 2} y={430} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ai không có khóa → đứng đợi ⏳</text>
          </g>
          <g style={usePop(T.LOCK.gone, 13)}>
            <Card x={W / 2 - 470} y={468} w={940} h={70} c={A} rx={9} thick={1.5} />
            <text x={W / 2} y={512} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>2 người không thể cùng cầm 1 khóa → cảnh "cùng lúc" <tspan fill={A} fontWeight={900}>biến mất</tspan></text>
          </g>
          <g style={usePop(T.LOCK.coarse, 13)}>
            <Card x={W / 2 - 470} y={554} w={940} h={92} c={MUTE} rx={10} thick={1.5} />
            <text x={W / 2 - 448} y={584} fontSize={17} fill={MUTE} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">THÔ</text>
            <text x={W / 2} y={614} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔒 khóa <tspan fill={MUTE} fontWeight={900}>CẢ KHO</tspan> → Race tắt, nhưng chậm như rùa bò 🐢</text>
          </g>
          <g style={usePop(T.LOCK.mutex, 13)}>
            <Card x={W / 2 - 470} y={662} w={940} h={120} c={GREEN} fill={CARD2} thick={2.5} />
            <text x={W / 2 - 448} y={692} fontSize={17} fill={GREEN} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">TINH</text>
            <text x={W / 2} y={722} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ khóa <tspan fill={GREEN} fontWeight={900}>ĐÚNG TRANG</tspan> đang sửa = MUTEX ✅</text>
            <text x={W / 2} y={756} fontSize={22} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} opacity={useFade(T.LOCK.critical, 10)}>vùng chỉ-1-người-được-vào = CRITICAL SECTION</text>
          </g>
        </g>
        <Footer label="đặt khóa → giành mới được sửa → chặn cùng lúc" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 DEADLOCK (phản đòn của khóa) ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="PHẢN ĐÒN CỦA KHÓA · DEADLOCK" color={RED} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.DEADLOCK.need2, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={80} c={RED} rx={10} thick={1.5} />
            <text x={W / 2} y={318} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>1 việc cần <tspan fill={RED} fontWeight={900}>2 khóa</tspan> → sinh ra cảnh ÔM CHÉO</text>
          </g>
          <g style={usePop(T.DEADLOCK.cross, 14)}>
            <Card x={W / 2 - 470} y={366} w={455} h={130} c={A} fill={CARD2} thick={2} />
            <text x={W / 2 - 242} y={412} fontSize={26} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧵 SƯ HUYNH</text>
            <text x={W / 2 - 242} y={452} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giữ 🔒A</text>
            <text x={W / 2 - 242} y={482} fontSize={22} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đợi 🔒B</text>
            <Card x={W / 2 + 15} y={366} w={455} h={130} c={B} fill={CARD2} thick={2} />
            <text x={W / 2 + 242} y={412} fontSize={26} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧵 SƯ ĐỆ</text>
            <text x={W / 2 + 242} y={452} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giữ 🔒B</text>
            <text x={W / 2 + 242} y={482} fontSize={22} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đợi 🔒A</text>
            <text x={W / 2} y={440} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>
          </g>
          <g style={usePop(T.DEADLOCK.stuck, 14)}>
            <Card x={W / 2 - 470} y={512} w={940} h={96} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={548} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ai cũng giữ thứ kẻ kia cần, đứng chết trân tới rạng đông</text>
            <text x={W / 2} y={590} fontSize={35} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">😱 kiếp mới — DEADLOCK</text>
          </g>
          <Reveal y={640} top="trị: mọi người giành khóa theo CÙNG 1 THỨ TỰ (luôn A trước B) →" big="vòng đợi không khép kín · Deadlock tự tan" entry={T.DEADLOCK.order} c={GOLD} h={160} />
        </g>
        <Footer label="A↔B ôm chéo · phá bằng thứ tự nhất quán" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 ATOMIC (gộp 3 nhịp thành 1) ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="PHÁP MÔN ② · ATOMIC" color={GREEN} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.ATOMIC.why, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={92} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={296} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vì sao thiên cơ chen được? vì</text>
            <text x={W / 2} y={330} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>ĐỌC → CỘNG → GHI = <tspan fill={A} fontWeight={800}>3 NHỊP RỜI</tspan></text>
          </g>
          <g style={usePop(T.ATOMIC.gap, 12)}>
            <Card x={W / 2 - 470} y={356} w={940} h={70} c={RED} rx={9} thick={1.5} />
            <text x={W / 2} y={400} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 cái khe giữa 3 nhịp = chỗ tai họa lọt vào</text>
          </g>
          <g style={usePop(T.ATOMIC.merge, 13)}>
            <Card x={W / 2 - 470} y={440} w={940} h={96} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={476} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>gộp 3 nhịp thành 1:</text>
            <text x={W / 2} y={514} fontSize={29} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đọc-cộng-ghi dính liền, KHÔNG THỂ cắt rời ⚡</text>
          </g>
          <g style={usePop(T.ATOMIC.cmd, 13)}>
            <Card x={W / 2 - 470} y={550} w={940} h={110} c={GREEN} rx={10} thick={2} />
            <text x={W / 2} y={596} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>ra lệnh thẳng: <tspan fill={GREEN} fontWeight={800}>số dư += 50</tspan> trong ĐÚNG 1 CÂU</text>
            <text x={W / 2} y={632} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ chính cái kho tự đảm bảo không ai chen vào giữa</text>
          </g>
          <Reveal y={678} top="nhát bút liền mạch, bất khả phân ấy — người đời gọi:" big="⚡ ATOMIC · chẳng khóa ai mà loạn không sinh" entry={T.ATOMIC.name} c={GOLD} h={140} />
        </g>
        <Footer label="3 nhịp rời → 1 nhịp bất khả phân = atomic" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 OPTIMISTIC (dấu triện phiên bản) ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={B} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="PHÁP MÔN ③ · OPTIMISTIC" color={B} />
        <g transform="translate(0, 115)">
          <g style={usePop(T.OPTIMISTIC.why, 13)}>
            <Card x={W / 2 - 470} y={248} w={940} h={92} c={B} fill={CARD2} thick={2} />
            <text x={W / 2} y={288} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"cớ gì phải khóa khi hiếm khi đụng?"</text>
            <text x={W / 2} y={322} fontSize={27} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ KHÔNG khóa, chỉ đóng DẤU TRIỆN (version)</text>
          </g>
          <g style={usePop(T.OPTIMISTIC.stamp, 12)}>
            <Card x={W / 2 - 470} y={354} w={940} h={78} c={A} rx={9} thick={1.5} />
            <text x={W / 2} y={402} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>đọc sổ: <tspan fill={A} fontWeight={800}>100</tspan> · triện <tspan fill={A} fontWeight={800}>#7</tspan></text>
          </g>
          <g style={usePop(T.OPTIMISTIC.cond, 13)}>
            <Card x={W / 2 - 470} y={448} w={940} h={88} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={502} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>lúc ghi dặn sổ: "ghi <tspan fill={GREEN} fontWeight={900}>150</tspan> — CHỈ KHI triện vẫn <tspan fill={GREEN} fontWeight={900}>#7</tspan>"</text>
          </g>
          <g style={usePop(T.OPTIMISTIC.fail, 14)}>
            <Card x={W / 2 - 470} y={552} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={598} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sư đệ ghi trước (triện→#8) → lời dặn vô hiệu →</text>
            <text x={W / 2} y={638} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">💀 GHI HỤT → biết mình thua → đọc lại, làm lại</text>
          </g>
          <g style={usePop(T.OPTIMISTIC.phil, 15)}>
            <Card x={W / 2 - 470} y={678} w={940} h={150} c={GOLD} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={734} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>khóa-trước = <tspan fill={B} fontWeight={900}>PESSIMISTIC</tspan> · làm-trước = <tspan fill={GOLD} fontWeight={900}>OPTIMISTIC</tspan></text>
            <text x={W / 2} y={782} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>⚖️ ít đụng → optimistic nhàn · đụng nhiều → khóa lại hơn</text>
          </g>
        </g>
        <Footer label="không khóa · dấu triện version · đụng thì retry" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 DAOLY ============
const S11: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GOLD} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.DAOLY.always, 13)}>
            <Card x={W / 2 - 470} y={270} w={455} h={116} c={GREEN} rx={10} thick={2} />
            <text x={W / 2 - 242} y={322} fontSize={27} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>bug LUÔN sai</text>
            <text x={W / 2 - 242} y={360} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>dễ bắt, không sợ 🤣</text>
          </g>
          <g style={usePop(T.DAOLY.sometimes, 13)}>
            <Card x={W / 2 + 15} y={270} w={455} h={116} c={RED} rx={10} thick={2} />
            <text x={W / 2 + 242} y={322} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>bug THỈNH THOẢNG sai</text>
            <text x={W / 2 + 242} y={360} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tuyệt kiếp giết người 💀</text>
          </g>
          <g style={usePop(T.DAOLY.threeways, 14)}>
            <Card x={W / 2 - 470} y={406} w={940} h={186} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={446} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trị race, chung quy 3 đường:</text>
            <text x={W / 2} y={490} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>① KHÓA — chặn 2 người cùng lúc</text>
            <text x={W / 2} y={528} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>② ATOMIC — gộp thành 1 nhịp, hết khe hở</text>
            <text x={W / 2} y={566} fontSize={26} fill={B} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>③ OPTIMISTIC — cứ đụng rồi làm lại</text>
          </g>
          <Reveal y={620} top="khóa càng to càng tắc → kẻ mạnh nhất không phải kẻ nhanh nhất:" big="mà là kẻ biết XẾP HÀNG, chờ tới lượt mình 🤣" entry={T.DAOLY.strong} c={GOLD} h={160} />
        </g>
        <Footer label="khóa nhỏ nhất · hoặc chẳng thèm khóa · biết xếp hàng" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(48, 14);
  const btn = usePop(84, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={610} fontSize={36} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi đã từng gặp con bug</text>
            <text x={W / 2} y={672} fontSize={40} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#rcTextGlow)">lúc hiện lúc ẩn này chưa? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={802} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#rcTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi kiếp giáng lúc 3 giờ sáng" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const RaceCondition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("race_condition/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <SlideFade duration={b.duration}>
              <Slide duration={b.duration} />
            </SlideFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
