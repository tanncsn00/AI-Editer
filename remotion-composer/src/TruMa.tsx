import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tm_beats.json";
import T from "./tm_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV Trừ Ma Sư (security) · ta=cyan · đồng môn/dev/CEO=gold · kiếp/hắc khí=đỏ · danh hiệu=violet · ngộ=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";
const A = "#2BE2FF";
const GOLD = "#FFC24B";
const GREEN = "#2EE6A8";
const VIOLET = "#A78BFF";
const TEXT = "#ECE6F5";
const SEC = "#B0A8C4";
const MUTE = "#6E6685";
const HUDC = "#5B4E78";

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
          <pattern id="tmGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="tmGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tmScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="tmVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#tmGrid)" />
        <rect width={W} height={H} fill="url(#tmGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#tmScan)" />
        <rect width={W} height={H} fill="url(#tmVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={A} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={GOLD} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={A} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={GOLD} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="tmTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 112} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
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
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; h?: number }> = ({ y, who, whoC, text, entry, h = 92 }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + h - 26} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = VIOLET, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 50} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tmTextGlow)">{big}</text>
  </g>
);
const RevealTech: React.FC<{ y: number; top: string; big: string; tech: string; entry: number; c?: string; h?: number }> = ({ y, top, big, tech, entry, c = VIOLET, h = 160 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 44} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + 90} fontSize={33} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tmTextGlow)">{big}</text>
    <text x={W / 2} y={y + h - 26} fontSize={26} fill={A} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">// {tech}</text>
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
          <g transform="translate(0, 144)">
            <text x={W / 2} y={284} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT TRỪ MA SƯ · security engineer</text>
            <g style={usePop(T.HOOK.shadow, 13)}>
              <Card x={W / 2 - 470} y={324} w={940} h={116} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={370} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một tu sĩ cả đời sống <tspan fill={A} fontWeight={900}>TRONG BÓNG TỐI</tspan></text>
              <text x={W / 2} y={410} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đại trận bình yên → không ai gọi tên 💀</text>
            </g>
            <g style={usePop(T.HOOK.trigger, 14)}>
              <Card x={W / 2 - 470} y={458} w={940} h={92} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={514} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">nhưng 1 phong thư lạ được mở · 1 mật khẩu bị lộ →</text>
            </g>
            <g style={usePop(T.HOOK.summon, 15)}>
              <Card x={W / 2 - 430} y={572} w={860} h={140} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={624} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>toàn tông đồng loạt hét lên:</text>
              <text x={W / 2} y={688} fontSize={48} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tmTextGlow)" opacity={0.9 + 0.1 * glow}>"TRIỆU HỒI TRỪ MA SƯ!"</text>
            </g>
          </g>
          <Footer label="bình yên thì vô hình · có sự cố thì cả tông gọi tên" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NHAPMON ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NHẬP MÔN · TRỪ MA TÔNG" />
        <g transform="translate(0, 128)">
          <g style={usePop(T.NHAPMON.enemy, 13)}>
            <Card x={W / 2 - 470} y={260} w={940} h={116} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={306} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta tưởng kẻ thù là <tspan fill={RED} fontWeight={900}>HACKER Ma Đạo</tspan></text>
            <text x={W / 2} y={346} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>yêu nhân bên ngoài · kẻ ngày đêm phá trận</text>
          </g>
          <g style={usePop(T.NHAPMON.prepare, 13)}>
            <Card x={W / 2 - 470} y={394} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={442} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🛡️ ta thủ sẵn: nghìn đạo pháp · trăm kết giới · vô số trận phòng thủ</text>
          </g>
          <Reveal y={490} top="💀 nhưng kẻ khiến đạo tâm ta TAN VỠ NHẤT…" big="🔥 lại là một ĐỒNG MÔN 🤣" entry={T.NHAPMON.colleague} c={RED} h={160} />
        </g>
        <Footer label="thủ nghìn tầng trận · địch lại ở ngay trong nhà" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 METAM ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ① · MÊ TÂM KIẾP" color={GOLD} />
        <g transform="translate(0, 104)">
          <Say y={220} who="💬 đồng môn (hớn hở)" whoC={GOLD} text="&quot;thư trưởng lão — ta được thưởng linh thạch!&quot;" entry={T.METAM.open} h={96} />
          <g style={usePop(T.METAM.title, 14)}>
            <Card x={W / 2 - 470} y={328} w={940} h={116} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={372} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "biết người gửi không?" → "không" → "sao mở?"</text>
            <text x={W / 2} y={414} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"vì tiêu đề ghi: CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG" 💀</text>
          </g>
          <g style={usePop(T.METAM.insight, 13)}>
            <Card x={W / 2 - 470} y={462} w={940} h={72} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={506} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔥 hacker không phá cửa — chỉ cần viết "bạn nhận được quà"</text>
          </g>
          <RevealTech y={552} top="ta lĩnh ngộ:" big="🔥 NHÂN TÂM PHÒNG NGỰ THUẬT" tech="Security Awareness" entry={T.METAM.reveal} c={VIOLET} h={158} />
        </g>
        <Footer label="tường lửa mạnh mấy · thua 1 dòng 'bạn đã trúng thưởng'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 SCAN ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ② · CÔNG PHÁP HẮC KHÍ" color={RED} />
        <g transform="translate(0, 104)">
          <Say y={220} who="💬 Developer Tông (mang công pháp mới)" whoC={GOLD} text="&quot;ta vừa tạo 1 đạo pháp mới, nhỏ thôi&quot;" entry={T.SCAN.dev} h={96} />
          <g style={usePop(T.SCAN.silence, 14)}>
            <Card x={W / 2 - 470} y={328} w={940} h={150} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={370} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta nhìn → một tia HẮC KHÍ xuất hiện 💀</text>
            <text x={W / 2} y={410} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"kiểm tra bảo mật?" → im lặng</text>
            <text x={W / 2} y={450} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Code Review?" · "Scan lỗ hổng?" → im lặng</text>
          </g>
          <g style={usePop(T.SCAN.runs, 13)}>
            <Card x={W / 2 - 470} y={496} w={940} h={64} c={RED} rx={10} thick={2} />
            <text x={W / 2} y={536} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💬 "nhưng trên máy ta CHẠY ĐƯỢC" 💀💀💀</text>
          </g>
          <RevealTech y={578} top="ta suýt tẩu hỏa nhập ma → lĩnh ngộ:" big="🔥 THIÊN NHÃN TRUY MA THUẬT" tech="Security Scan" entry={T.SCAN.reveal} c={VIOLET} h={150} />
        </g>
        <Footer label="1 dòng code nhỏ · đủ triệu hồi cả một đại kiếp" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 MATKHAU ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ③ · MẬT KHẨU" color={GOLD} />
        <g transform="translate(0, 116)">
          <g style={usePop(T.MATKHAU.pw, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={116} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={296} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ đáng sợ HƠN hacker — <tspan fill={RED} fontWeight={900}>MẬT KHẨU</tspan></text>
            <text x={W / 2} y={338} fontSize={27} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">1 trưởng lão đang dùng: "123456" 🤣</text>
          </g>
          <g style={usePop(T.MATKHAU.reason, 14)}>
            <Card x={W / 2 - 470} y={384} w={940} h={130} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={426} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "vì sao?" → "dễ nhớ" 💀 — bao Firewall · mã hóa · phòng thủ</text>
            <text x={W / 2} y={472} fontSize={28} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÔNG thắng nổi 1 người thích mật khẩu DỄ NHỚ</text>
          </g>
          <Reveal y={534} top="ngày đó ta lĩnh ngộ:" big="🔥 CẤM KỴ MẬT LỆNH ĐẠI PHÁP" entry={T.MATKHAU.reveal} c={VIOLET} h={150} />
        </g>
        <Footer label="mắt xích yếu nhất · luôn là người thích cho tiện" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 CEO ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP CUỐI · 3 GIỜ SÁNG" color={RED} />
        <g transform="translate(0, 100)">
          <g style={usePop(T.CEO.night, 13)}>
            <Card x={W / 2 - 470} y={214} w={940} h={78} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={262} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📞 3 giờ sáng — điện thoại: <tspan fill={RED} fontWeight={900}>"hệ thống có DỊ BIẾN"</tspan></text>
          </g>
          <g style={usePop(T.CEO.hunt, 13)}>
            <Card x={W / 2 - 470} y={308} w={940} h={116} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={352} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta mở Thiên Nhãn truy dấu: 2 giờ truy tra · 3 tầng kết giới · 4 lớp Log</text>
            <text x={W / 2} y={394} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔍 hung thủ: 1 tài khoản lạ đăng nhập từ NƠI BÍ ẨN</text>
          </g>
          <g style={usePop(T.CEO.suspect, 13)}>
            <Card x={W / 2 - 470} y={442} w={940} h={72} c={GOLD} rx={10} thick={1.5} />
            <text x={W / 2} y={486} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta mở toàn bộ pháp trận chuẩn bị chiến đấu → phát hiện…</text>
          </g>
          <g style={usePop(T.CEO.ceo, 15)}>
            <Card x={W / 2 - 470} y={532} w={940} h={168} c={VIOLET} fill={CARD2} thick={3} />
            <text x={W / 2} y={584} fontSize={34} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tmTextGlow)">🤣 đó là CEO đi CÔNG TÁC NƯỚC NGOÀI</text>
            <text x={W / 2} y={628} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phải mọi thứ đáng ngờ đều là hacker —</text>
            <text x={W / 2} y={666} fontSize={27} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>có khi chỉ là SẾP QUÊN BÁO TRƯỚC</text>
          </g>
        </g>
        <Footer label="soi 2 tiếng bắt hacker · hóa ra sếp quên báo đi công tác" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 DAOLY ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GREEN} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.DAOLY.roles, 13)}>
            <Card x={W / 2 - 470} y={244} w={940} h={116} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={288} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Developer tạo công pháp · DevOps vận hành đại trận</text>
            <text x={W / 2} y={330} fontSize={26} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Trừ Ma Tông — kẻ suốt ngày nhìn vào BÓNG TỐI</text>
          </g>
          <g style={usePop(T.DAOLY.watch, 13)}>
            <Card x={W / 2 - 470} y={378} w={940} h={72} c={GOLD} rx={10} thick={1.5} />
            <text x={W / 2} y={422} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chờ 1 ngày có người BẤM NHẦM thứ không nên bấm 🤣</text>
          </g>
          <RevealTech y={468} top="câu lưu truyền — KHÔNG hệ thống nào bị hacker đánh bại trước:" big="🔥 rất nhiều hệ thống ĐÃ TỰ MỞ CỬA" tech="cho hacker bước vào" entry={T.DAOLY.truth} c={GREEN} h={176} />
        </g>
        <Footer label="hacker ít khi phá cửa · thường là ta tự mở cho họ" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 CTA ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={620} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi từng bấm nhầm phong thư</text>
            <text x={W / 2} y={682} fontSize={38} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tmTextGlow)">"trúng thưởng" nào chưa? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tmTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi bấm vào 'bạn đã trúng thưởng' tiếp theo" />
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

export const TruMa: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("tru_ma/voice.mp3")} />
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
