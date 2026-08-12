import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./hd_beats.json";
import T from "./hd_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV Hộ Đạo Tu (security) · ta=cyan · đồng môn=gold · kiếp/lỗ hổng=đỏ · bí cảnh/danh hiệu=violet · ngộ=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";     // kiếp · lỗ hổng · hacker
const A = "#2BE2FF";       // TA (Hộ Đạo Tu)
const GOLD = "#FFC24B";    // đồng môn · đại năng
const GREEN = "#2EE6A8";   // ngộ · đạo lý
const VIOLET = "#A78BFF";  // bí cảnh · danh hiệu
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
          <pattern id="hdGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="hdGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hdScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hdVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#hdGrid)" />
        <rect width={W} height={H} fill="url(#hdGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#hdScan)" />
        <rect width={W} height={H} fill="url(#hdVig)" />
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
    <filter id="hdTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hdTextGlow)">{big}</text>
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
          <g transform="translate(0, 146)">
            <text x={W / 2} y={286} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT HỘ ĐẠO TU</text>
            <g style={usePop(T.HOOK.roles, 13)}>
              <Card x={W / 2 - 470} y={326} w={940} h={116} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={372} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một tông môn KHÔNG tạo tính năng · KHÔNG thiết kế giao diện</text>
              <text x={W / 2} y={412} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cũng không trực tiếp kiếm linh thạch 🤣</text>
            </g>
            <g style={usePop(T.HOOK.vanish, 14)}>
              <Card x={W / 2 - 470} y={460} w={940} h={92} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={516} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">💀 bọn họ biến mất → cả tông KHÔNG CÒN linh thạch để kiếm</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 430} y={572} w={860} h={150} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={624} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi bọn họ là:</text>
              <text x={W / 2} y={694} fontSize={52} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hdTextGlow)" opacity={0.9 + 0.1 * glow}>CYBER SECURITY TÔNG</text>
            </g>
          </g>
          <Footer label="không tạo linh thạch · nhưng mất họ thì mất tất cả" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NHAPMON ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="NHẬP MÔN · HỘ ĐẠO TÔNG" />
          <g transform="translate(0, 150)">
            <g style={usePop(T.NHAPMON.join, 13)}>
              <Card x={W / 2 - 470} y={330} w={940} h={92} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={386} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>năm ấy ta gia nhập <tspan fill={A} fontWeight={900}>HỘ ĐẠO TÔNG</tspan></text>
            </g>
            <g style={usePop(T.NHAPMON.believe, 14)}>
              <Card x={W / 2 - 470} y={442} w={940} h={92} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={498} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ta luôn tin: "kẻ địch đều ở BÊN NGOÀI" 🤣</text>
            </g>
            <g style={usePop(T.NHAPMON.naive, 15)}>
              <Card x={W / 2 - 400} y={572} w={800} h={130} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={626} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 sau này mới biết…</text>
              <text x={W / 2} y={680} fontSize={52} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hdTextGlow)" opacity={0.9 + 0.1 * glow}>TA ĐÃ QUÁ NGÂY THƠ</text>
            </g>
          </g>
          <Footer label="tưởng kẻ địch ở ngoài · hóa ra ngay trong sơn môn" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 HACKER ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGÀY ĐẦU · CÂU HỎI CỦA TRƯỞNG LÃO" color={GOLD} />
        <g transform="translate(0, 116)">
          <Say y={244} who="👴 trưởng lão chỉ vào hệ thống" whoC={GOLD} text="&quot;nếu ngươi là HACKER — tấn công từ đâu?&quot;" entry={T.HACKER.ask} h={100} />
          <g style={usePop(T.HACKER.ask, 13)}>
            <Card x={W / 2 - 470} y={356} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={404} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta nhìn: API · Database · Server · Firewall · VPN → <tspan fill={A} fontWeight={900}>"Server."</tspan></text>
          </g>
          <g style={usePop(T.HACKER.email, 14)}>
            <Card x={W / 2 - 470} y={452} w={940} h={92} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={508} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💀 ngài cười: "Không. Ta sẽ gửi một EMAIL."</text>
          </g>
          <Reveal y={566} top="ngày hôm đó — đạo tâm của ta:" big="🔥 xuất hiện VẾT NỨT ĐẦU TIÊN" entry={T.HACKER.crack} c={VIOLET} h={150} />
        </g>
        <Footer label="ta canh Server · hacker gõ cửa bằng 1 cái email" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 EMAIL ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP · PHONG THƯ" color={RED} />
        <g transform="translate(0, 116)">
          <g style={usePop(T.EMAIL.title, 13)}>
            <Card x={W / 2 - 470} y={244} w={940} h={92} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={274} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">📩 CẢ TÔNG NHẬN 1 PHONG THƯ · TIÊU ĐỀ:</text>
            <text x={W / 2} y={314} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"THÔNG BÁO TĂNG LƯƠNG" 💰</text>
          </g>
          <g style={usePop(T.EMAIL.victims, 14)}>
            <Card x={W / 2 - 470} y={352} w={940} h={160} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={398} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>① mở email · ② tải file đính kèm 💀</text>
            <text x={W / 2} y={440} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>③ điền tài khoản</text>
            <text x={W / 2} y={484} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">④ còn nhiệt tình SHARE cả nhóm 🤣</text>
          </g>
          <Reveal y={534} top="trưởng lão nhìn cảnh ấy, lặng lẽ thở dài:" big="😮‍💨 &quot;Hacker — vừa bước vào SƠN MÔN&quot;" entry={T.EMAIL.sigh} c={VIOLET} h={160} />
        </g>
        <Footer label="chưa cần phá tường lửa · chỉ cần 1 dòng tiêu đề" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 NGUOIDUNG ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="MẮT XÍCH YẾU NHẤT" />
        <g transform="translate(0, 104)">
          <g style={usePop(T.NGUOIDUNG.human, 13)}>
            <Card x={W / 2 - 470} y={222} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={270} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>yếu nhất — không phải Server/Database · mà là <tspan fill={A} fontWeight={900}>CON NGƯỜI</tspan></text>
          </g>
          <g style={usePop(T.NGUOIDUNG.quotes, 14)}>
            <Card x={W / 2 - 470} y={316} w={940} h={200} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={362} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 Dev: "mật khẩu 123456, mai đổi sau" 💀</text>
            <text x={W / 2} y={404} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 QA: "tắt xác thực cho tiện test"</text>
            <text x={W / 2} y={446} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 PM: "OTP nhiều bước quá, bỏ bớt đi"</text>
            <text x={W / 2} y={490} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">💬 CEO: "đăng nhập sao khó vậy?" 🤣</text>
          </g>
          <Reveal y={548} top="ta lĩnh ngộ một chân lý:" big="🔥 TIỆN LỢI & BẢO MẬT — hai đường khó song tu" entry={T.NGUOIDUNG.truth} c={VIOLET} h={160} />
        </g>
        <Footer label="tường xây cao mấy · cũng thua 1 câu 'cho tiện'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 QUEN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="LỖ HỔNG · &quot;ĐỂ TEST&quot;" color={GOLD} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.QUEN.api, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={78} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={298} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta kiểm tra → 1 API <tspan fill={RED} fontWeight={900}>KHÔNG CẦN ĐĂNG NHẬP</tspan> 💀</text>
          </g>
          <Say y={344} who="💬 ta: &quot;ai làm?&quot; → Dev" whoC={GOLD} text="&quot;để test.&quot;" entry={T.QUEN.api} />
          <g style={usePop(T.QUEN.forget, 13)}>
            <Card x={W / 2 - 470} y={448} w={940} h={92} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={492} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "sao chưa xóa?" → Dev trầm mặc…</text>
            <text x={W / 2} y={528} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Quên." 🤣</text>
          </g>
          <Reveal y={556} top="ngày đó ta lĩnh ngộ:" big="🔥 QUÊN — cũng là một loại LỖ HỔNG" entry={T.QUEN.name} c={VIOLET} h={150} />
        </g>
        <Footer label="cửa hậu 'để test' · quên xóa · thành cửa chính cho hacker" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 LEGACY ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐÁNG SỢ HƠN CẢ HACKER" color={RED} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.LEGACY.prod, 13)}>
            <Card x={W / 2 - 470} y={228} w={940} h={78} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={276} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đáng sợ nhất KHÔNG phải hacker — mà là <tspan fill={RED} fontWeight={900}>PRODUCTION chạy 3 NĂM</tspan></text>
          </g>
          <g style={usePop(T.LEGACY.nobody, 14)}>
            <Card x={W / 2 - 470} y={322} w={940} h={190} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={368} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Server không ai dám tắt · API không ai dám sửa</text>
            <text x={W / 2} y={410} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Script không ai biết ai viết 💀</text>
            <text x={W / 2} y={456} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">💬 ta: "đây là gì?" → trưởng lão: "ĐỪNG ĐỤNG" 🤣</text>
          </g>
          <Reveal y={552} top="ngày đó ta bước vào:" big="🔥 THƯỢNG CỔ BÍ CẢNH · Legacy System" entry={T.LEGACY.name} c={VIOLET} h={160} />
        </g>
        <Footer label="hệ thống 3 năm · không ai hiểu · không ai dám động" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 COPHAP ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THƯỢNG CỔ BÍ CẢNH · CÔNG PHÁP THẤT TRUYỀN" color={VIOLET} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.COPHAP.inside, 13)}>
            <Card x={W / 2 - 470} y={280} w={940} h={200} c={VIOLET} fill={CARD2} thick={2} />
            <text x={W / 2} y={326} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bên trong — đầy rẫy công pháp thất truyền:</text>
            <text x={W / 2} y={376} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>💀 MD5 · SHA-1 · FTP</text>
            <text x={W / 2} y={424} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>HTTP (không TLS)</text>
            <text x={W / 2} y={464} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Root (không mật khẩu)</text>
          </g>
          <Reveal y={510} top="mỗi lần nhìn thấy một cổ công pháp:" big="🤣 TIM TA NGỪNG ĐẬP một nhịp" entry={T.COPHAP.heart} c={GOLD} h={150} />
        </g>
        <Footer label="mật mã đời tống · cửa mở toang · chờ hacker ghé thăm" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 THIENKIEP ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="HỆ THỐNG NGHÊNH THIÊN KIẾP" color={RED} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.THIENKIEP.morning, 13)}>
            <Card x={W / 2 - 470} y={228} w={940} h={78} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={276} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💀 một sáng — cả hệ thống BỊ HACK</text>
          </g>
          <g style={usePop(T.THIENKIEP.questions, 14)}>
            <Card x={W / 2 - 470} y={322} w={940} h={190} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={368} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 CEO: "sao lại bị hack?"</text>
            <text x={W / 2} y={410} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 PM: "khôi phục được không?" · Dev: "commit nào?"</text>
            <text x={W / 2} y={454} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 QA: "em có cần test lại không?" 🤣</text>
          </g>
          <Reveal y={552} top="chỉ có ta — lặng lẽ mở LOG:" big="🔥 lần theo dấu vết như TRUY MA KHÍ" entry={T.THIENKIEP.log} c={A} h={160} />
        </g>
        <Footer label="cả tông hỏi loạn · chỉ 1 người lặng lẽ đọc log" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 HUNGTHU ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="HUNG THỦ LỘ DIỆN" color={GOLD} />
        <g transform="translate(0, 116)">
          <g style={usePop(T.HUNGTHU.reveal, 13)}>
            <Card x={W / 2 - 470} y={244} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={292} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 ngày sau — hung thủ <tspan fill={A} fontWeight={900}>cuối cùng cũng lộ diện</tspan></text>
          </g>
          <g style={usePop(T.HUNGTHU.not, 14)}>
            <Card x={W / 2 - 470} y={338} w={940} h={150} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={384} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❌ không phải Zero-day</text>
            <text x={W / 2} y={426} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❌ không phải APT</text>
            <text x={W / 2} y={468} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❌ không phải hacker nghịch thiên</text>
          </g>
          <Reveal y={510} top="mà là… chính phong EMAIL — tiêu đề:" big='🔥 "THÔNG BÁO TĂNG LƯƠNG" 💀' entry={T.HUNGTHU.email} c={VIOLET} h={130} />
          <g style={usePop(T.HUNGTHU.email, 13)}>
            <text x={W / 2} y={686} fontSize={25} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">😱 đúng phong thư trưởng lão đưa xem ngày đầu nhập môn</text>
          </g>
        </g>
        <Footer label="soi 3 ngày · thủ phạm là cái email ai cũng bấm" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 DAOLY ============
const S11: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GREEN} />
        <g transform="translate(0, 128)">
          <g style={usePop(T.DAOLY.first, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={78} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={318} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ <tspan fill={A} fontWeight={900}>ĐẦU TIÊN</tspan> bị hacker xâm nhập —</text>
          </g>
          <g style={usePop(T.DAOLY.notwhat, 13)}>
            <Card x={W / 2 - 470} y={364} w={940} h={78} c={SEC} rx={10} thick={1.5} />
            <text x={W / 2} y={412} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>KHÔNG phải Server · KHÔNG phải Database · KHÔNG phải Firewall</text>
          </g>
          <Reveal y={458} top="mà là… niềm tin của một đồng môn —" big="🔥 đối với MỘT EMAIL 💀" entry={T.DAOLY.trust} c={GREEN} h={170} />
        </g>
        <Footer label="tường lửa vá được · niềm tin đặt sai thì không" />
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
            <text x={W / 2} y={620} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi đã từng CLICK vào</text>
            <text x={W / 2} y={682} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hdTextGlow)">phong email lạ nào chưa? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#hdTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi bấm vào email 'tăng lương' tiếp theo" />
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

export const HoDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("ho_dao/voice.mp3")} />
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
