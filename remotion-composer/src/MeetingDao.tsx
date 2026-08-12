import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./md_beats.json";
import T from "./md_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD / Sci-Fi FUI · Meeting (violet + đỏ · đạo tâm tan vỡ) =====
const BG = "#0A0814";
const CARD = "#140F26";
const CARD2 = "#1A1236";
const RED = "#FF5470";     // kiếp / danger / punchline
const VIO = "#A78BFF";     // primary / structure / trưởng lão
const CYAN = "#2BE2FF";    // tech / PM / roles
const AMBER = "#FFC24B";   // đạo lý reveal
const TEAL = "#2EE6C2";    // khách / accent
const TEXT = "#E7E4F7";
const SEC = "#A9A4D4";
const MUTE = "#5E578A";
const HUDC = VIO;

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

const HudBG: React.FC<{ tint?: string }> = ({ tint = HUDC }) => {
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
          <pattern id="mdGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.05" />
          </pattern>
          <radialGradient id="mdGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mdScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.06" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="mdVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#mdGrid)" />
        <rect width={W} height={H} fill="url(#mdGlow)" />
        <g stroke={HUDC} strokeWidth={1} opacity={0.14}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#mdScan)" />
        <rect width={W} height={H} fill="url(#mdVig)" />
        <g stroke={HUDC} strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={HUDC} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="mdTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = HUDC }) => {
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
        <text x={W - 108} y={143} fontSize={18} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">MEET</text>
        <circle cx={W - 92} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.18} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · chốn công sở</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = HUDC, fill = CARD, thick = 2, rx = 10, children }) => {
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
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mdTextGlow)">{name}</text>
      <line x1={W / 2 - 90} y1={y + 110} x2={W / 2 + 90} y2={y + 110} stroke={c} strokeWidth={2} opacity={0.7} />
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
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = AMBER, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 52} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={38} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={VIO} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 150)">
            <text x={W / 2} y={320} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>NHỮNG CUỘC HỌP KHIẾN</text>
            <text x={W / 2} y={402} fontSize={78} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mdTextGlow)" style={useFadeUp(12, 12)} opacity={0.9 + 0.1 * glow}>ĐẠO TÂM TAN VỠ</text>
            <text x={W / 2} y={462} fontSize={27} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(16, 12)}>trong Software Đạo có một loại bí cảnh…</text>
            <g style={usePop(T.HOOK.nokiep, 12)}>
              <Card x={W / 2 - 470} y={510} w={455} h={110} c={MUTE} rx={9} thick={1.5} />
              <text x={W / 2 - 242} y={578} fontSize={32} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕ YÊU THÚ</text>
              <Card x={W / 2 + 15} y={510} w={455} h={110} c={MUTE} rx={9} thick={1.5} />
              <text x={W / 2 + 242} y={578} fontSize={32} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕ SÁT TRẬN</text>
            </g>
            <g style={usePop(T.HOOK.crack, 14)}>
              <Card x={W / 2 - 470} y={650} w={940} h={140} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={706} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng hễ ai bước vào…</text>
              <text x={W / 2} y={762} fontSize={44} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">ĐẠO TÂM ĐỀU RẠN NỨT 💀</text>
            </g>
            <g style={usePop(T.HOOK.meeting, 15)}>
              <Card x={W / 2 - 340} y={830} w={680} h={140} c={VIO} fill={CARD2} thick={3} />
              <text x={W / 2} y={882} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi nơi ấy là</text>
              <text x={W / 2} y={942} fontSize={58} fill={VIO} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4" filter="url(#mdTextGlow)">MEETING</text>
            </g>
          </g>
          <Footer label="bí cảnh Meeting · nơi đạo tâm đi để tan vỡ" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NAMPHUT ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const glitch = ["\"nghe rõ không?\"", "\"anh đang mute\" 🔇", "\"đợi em share màn hình\""];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={VIO} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · &quot;HỌP NHANH 5 PHÚT&quot;" color={RED} />
          <g transform="translate(0, 150)">
            <Say y={270} who="TRƯỞNG LÃO" whoC={VIO} text="&quot;họp nhanh 5 phút thôi&quot; 🙂" entry={T.NAMPHUT.quote} big />
            <text x={W / 2} y={420} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade((T.NAMPHUT.glitch as number[])[0] - 6, 10)}>cả tông môn mừng rỡ vào… 5 phút sau:</text>
            <g>
              {glitch.map((t, i) => (
                <g key={i} style={usePop((T.NAMPHUT.glitch as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470} y={450 + i * 84} w={940} h={68} c={RED} rx={9} thick={2} />
                  <text x={W / 2} y={493 + i * 84} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{t}</text>
                </g>
              ))}
            </g>
            <g style={usePop(T.NAMPHUT.start, 14)}>
              <Card x={W / 2 - 470} y={715} w={940} h={100} c={CYAN} fill={CARD2} thick={2} />
              <text x={W / 2} y={778} fontSize={31} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⏱️ 15 phút sau… cuộc họp MỚI BẮT ĐẦU</text>
            </g>
            <Reveal y={840} top="một trưởng lão lặng lẽ…" big="XÓA LỊCH CUỘC HỌP TIẾP THEO 💀" entry={T.NAMPHUT.delete} c={AMBER} h={130} />
          </g>
          <Footer label="'5 phút' · đơn vị thời gian dài nhất giới IT" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 YNHO ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const react = ["🪑 đồng loạt ngồi xuống", "💻 mở lại laptop", "☕ gọi thêm cà phê"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={VIO} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · &quot;EM CÓ MỘT Ý NHỎ&quot;" color={RED} />
          <g transform="translate(0, 135)">
            <Say y={250} who="PM" whoC={CYAN} text="&quot;còn ai có ý kiến gì không?&quot;" entry={T.YNHO.ask} />
            <Say y={348} who="PM (cả điện lặng như tờ)" whoC={CYAN} text="&quot;vậy chốt&quot; ✅" entry={T.YNHO.chot} />
            <g style={usePop(T.YNHO.idea, 13)}>
              <Card x={W / 2 - 470} y={446} w={940} h={90} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={503} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">"à… em có một ý nhỏ" 💀</text>
            </g>
            <g>
              {react.map((t, i) => (
                <g key={i} style={usePop((T.YNHO.react as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470} y={556 + i * 76} w={940} h={62} c={VIO} rx={9} thick={1.5} />
                  <text x={W / 2} y={595 + i * 76} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <Reveal y={800} top='mọi tu sĩ đều hiểu · câu "ý nhỏ"…' big="luôn dẫn tới MỘT CUỘC HỌP MỚI 🤣" entry={T.YNHO.reveal} h={140} />
          </g>
          <Footer label="'ý nhỏ' · hai chữ giữ cả tông môn ở lại" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 CHIMOTCHUT ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const changes = ["giao diện", "API · Database", "quy trình"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={TEAL} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · &quot;CHỈ SỬA MỘT CHÚT&quot;" color={TEAL} />
          <g transform="translate(0, 120)">
            <Say y={250} who="KHÁCH HÀNG" whoC={TEAL} text="&quot;em chỉ sửa một chút thôi&quot; 🙂" entry={T.CHIMOTCHUT.quote} />
            <text x={W / 2} y={372} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(T.CHIMOTCHUT.react1, 10)}>FE cười 😄 · BE cười 😄 · QA vẫn bình thản uống trà 🍵</text>
            <text x={W / 2} y={430} fontSize={24} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1" opacity={useFade((T.CHIMOTCHUT.changes as number[])[0] - 6, 10)}>[ 30 PHÚT SAU ] 1 nút bấm → kéo theo:</text>
            <g>
              {changes.map((t, i) => (
                <g key={i} style={usePop((T.CHIMOTCHUT.changes as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470 + i * 316} y={455} w={296} h={78} c={RED} rx={9} thick={2} />
                  <text x={W / 2 - 322 + i * 316} y={501} fontSize={i === 1 ? 24 : 28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <g style={usePop(T.CHIMOTCHUT.allchange, 13)}>
              <Card x={W / 2 - 470} y={553} w={940} h={92} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={610} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">TẤT CẢ ĐỀU PHẢI ĐỔI · TEST LẠI TỪ ĐẦU 💀</text>
            </g>
            <text x={W / 2} y={700} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(T.CHIMOTCHUT.react2, 10)}>QA đặt trà xuống · FE mở Figma · BE mở IDE · PM dời release</text>
            <Reveal y={740} top="không một ai lên tiếng · chỉ có deadline…" big="ÂM THẦM LÙI THÊM 2 TUẦN 🤣" entry={T.CHIMOTCHUT.deadline} c={AMBER} h={140} />
          </g>
          <Footer label="'chỉ sửa một chút' · câu thần chú dời deadline" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 PHUONGANB ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={VIO} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · PHƯƠNG ÁN B" color={RED} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.PHUONGANB.agreeA, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={100} c={CYAN} rx={10} thick={2} />
            <text x={W / 2} y={315} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>3 canh giờ họp → cuối cùng cả điện thống nhất:</text>
            <text x={W / 2} y={352} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>PHƯƠNG ÁN A ✅</text>
          </g>
          <Say y={400} who="CEO (bước vào, xem biên bản)" whoC={RED} text="…khẽ gật đầu 🤔" entry={T.PHUONGANB.ceoIn} />
          <g style={usePop(T.PHUONGANB.ceoAsk, 14)}>
            <Card x={W / 2 - 470} y={500} w={940} h={96} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={560} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">"sao không làm phương án B?" 💀</text>
          </g>
          <g style={usePop(T.PHUONGANB.file, 13)}>
            <Card x={W / 2 - 470} y={616} w={940} h={130} c={VIO} rx={10} thick={2} />
            <text x={W / 2} y={668} fontSize={23} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} style={{ textDecoration: "line-through" }}>Meeting_Final.docx</text>
            <text x={W / 2} y={716} fontSize={25} fill={VIO} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🗑️ → Meeting_Final_V2.docx</text>
          </g>
          <Reveal y={770} top="không ai cười · không ai khóc · chỉ nghe thấy…" big="tiếng đạo tâm NỨT THÊM MỘT ĐƯỜNG" entry={T.PHUONGANB.crack} c={AMBER} h={140} />
        </g>
        <Footer label="phương án A → Z · rồi quay lại A" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 TIENDAY ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP CUỐI · &quot;TIỆN ĐÂY…&quot;" color={RED} />
        <g transform="translate(0, 150)">
          <text x={W / 2} y={280} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(T.TIENDAY.standup, 10)}>họp xong · mọi người vừa đứng dậy, cầm balo… 🎒</text>
          <g style={usePop(T.TIENDAY.tienday, 14)}>
            <Card x={W / 2 - 470} y={320} w={940} h={116} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2 - 448} y={352} fontSize={18} fill={RED} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">TRƯỞNG LÃO</text>
            <text x={W / 2} y={398} fontSize={33} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">"à… tiện đây, nói luôn việc khác" 💀</text>
          </g>
          <g style={usePop(T.TIENDAY.react, 12)}>
            <Card x={W / 2 - 470} y={456} w={455} h={104} c={VIO} rx={9} thick={1.5} />
            <text x={W / 2 - 242} y={498} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đặt balo</text>
            <text x={W / 2 - 242} y={534} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>xuống 🎒</text>
            <Card x={W / 2 + 15} y={456} w={455} h={104} c={VIO} rx={9} thick={1.5} />
            <text x={W / 2 + 242} y={498} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tắt laptop…</text>
            <text x={W / 2 + 242} y={534} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rồi bật lại 💻</text>
          </g>
          <g style={usePop(T.TIENDAY.pm, 14)}>
            <Card x={W / 2 - 470} y={580} w={940} h={110} c={CYAN} fill={CARD2} thick={2} />
            <text x={W / 2} y={628} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>PM không nói gì, chỉ lặng lẽ đổi:</text>
            <text x={W / 2} y={670} fontSize={31} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>họp 30 phút → 90 phút ⏳</text>
          </g>
          <Reveal y={714} top="cả tông môn đứng nhìn…" big="đạo tâm của nhau VỠ VỤN TỪNG MẢNH 🤣" entry={T.TIENDAY.shatter} c={AMBER} h={140} />
        </g>
        <Footer label="'tiện đây' · hai chữ huỷ diệt giờ tan làm" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 DAOLY ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const notin = ["Production", "Bug", "Deadline"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="ĐẠO LÝ" color={AMBER} />
          <g transform="translate(0, 175)">
            <text x={W / 2} y={300} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thiên kiếp lớn nhất KHÔNG nằm trong…</text>
            <g>
              {notin.map((t, i) => (
                <g key={i} style={usePop((T.DAOLY.notin as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470 + i * 316} y={330} w={296} h={78} c={MUTE} rx={9} thick={1.5} />
                  <text x={W / 2 - 322 + i * 316} y={368} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✕ {t}</text>
                </g>
              ))}
            </g>
            <text x={W / 2} y={470} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={useFade((T.DAOLY.phrases as number[])[0] - 6, 10)}>mà nằm trong 2 câu nói:</text>
            <g style={usePop((T.DAOLY.phrases as number[])[0] ?? 0, 12)}>
              <Card x={W / 2 - 470} y={500} w={940} h={82} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={550} fontSize={31} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">"anh chỉ xin thêm một ý nhỏ" 💀</text>
            </g>
            <g style={usePop((T.DAOLY.phrases as number[])[1] ?? 0, 12)}>
              <Card x={W / 2 - 470} y={596} w={940} h={82} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={646} fontSize={31} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mdTextGlow)">"à… tiện đây…" 💀</text>
            </g>
            <Reveal y={706} top="chỉ cần 2 câu ấy xuất hiện, cả tông môn đều biết…" big="HÔM NAY LẠI KHÔNG TAN LÀM ĐÚNG GIỜ 🤣" entry={T.DAOLY.reveal} c={AMBER} h={150} />
          </g>
          <Footer label="thiên kiếp không ở Production · ở trong lời nói" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

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
      <HudBG tint={VIO} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={590} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi từng dính thiên kiếp</text>
            <text x={W / 2} y={654} fontSize={52} fill={VIO} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" filter="url(#mdTextGlow)">MEETING</text>
            <text x={W / 2} y={716} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"tiện đây…" hay "em có một ý nhỏ"? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={VIO} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={VIO} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={VIO} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#mdTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(128, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi trưởng lão nói 'tiện đây'" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const MeetingDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("meeting_dao/voice.mp3")} />
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
