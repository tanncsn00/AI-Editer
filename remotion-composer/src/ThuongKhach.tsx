import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tk_beats.json";
import T from "./tk_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV Thượng Khách · khách=gold 💰 · ta=cyan · kiếp=đỏ · công pháp=gold =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";     // kiếp · đạo tâm vỡ
const A = "#2BE2FF";       // TA (đệ tử)
const GOLD = "#FFC24B";    // Thượng Khách · linh thạch · công pháp
const GREEN = "#2EE6A8";   // đạo lý · kỹ năng
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

const HudBG: React.FC<{ tint?: string }> = ({ tint = GOLD }) => {
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
          <pattern id="tkGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="tkGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tkScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="tkVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#tkGrid)" />
        <rect width={W} height={H} fill="url(#tkGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#tkScan)" />
        <rect width={W} height={H} fill="url(#tkVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={GOLD} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={A} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={GOLD} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={A} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={GOLD} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="tkTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = GOLD }) => {
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
        <text x={W - 112} y={143} fontSize={18} fill={GOLD} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
        <circle cx={W - 96} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · chốn công sở</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = GOLD, fill = CARD, thick = 2, rx = 10, children }) => {
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
// Dialogue line: speaker chip + quote
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; h?: number }> = ({ y, who, whoC, text, entry, h = 92 }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + h - 26} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = GOLD, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 50} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tkTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 150)">
            <text x={W / 2} y={300} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>CÔNG NGHỆ TÔNG · có một loại tu sĩ</text>
            <g style={usePop(T.HOOK.intro, 13)}>
              <Card x={W / 2 - 470} y={340} w={940} h={100} c={MUTE} fill={CARD2} thick={1.5} />
              <text x={W / 2} y={392} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❌ không luyện kiếm · ❌ không luyện đan</text>
              <text x={W / 2} y={424} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>❌ không thi triển pháp thuật</text>
            </g>
            <g style={usePop(T.HOOK.roles, 14)}>
              <Card x={W / 2 - 470} y={460} w={940} h={140} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={506} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 chỉ một đạo truyền âm gửi xuống →</text>
              <text x={W / 2} y={548} fontSize={27} fill={A} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Backend · Frontend · QA · DevOps</text>
              <text x={W / 2} y={584} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hàng trăm đệ tử LẬP TỨC xuất quan</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 400} y={640} w={800} h={150} c={GOLD} fill={CARD2} thick={3} />
              <text x={W / 2} y={694} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💰 người đời gọi họ là</text>
              <text x={W / 2} y={758} fontSize={64} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tkTextGlow)" opacity={0.9 + 0.1 * glow}>THƯỢNG KHÁCH</text>
            </g>
          </g>
          <Footer label="không code · không test · nhưng gánh cả nhân quả" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THUỞ BAN ĐẦU" />
        <g transform="translate(0, 165)">
          <g style={usePop(T.SETUP.respect, 13)}>
            <Card x={W / 2 - 470} y={300} w={940} h={150} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={356} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🏯 thuở đầu ta rất <tspan fill={GOLD} fontWeight={900}>KÍNH TRỌNG</tspan> Thượng Khách</text>
            <text x={W / 2} y={406} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">"không có họ, tông môn lấy đâu ra linh thạch?" 💰</text>
          </g>
          <Reveal y={500} top="nhưng nhiều năm hành tẩu, ta mới hiểu — mỗi khối linh thạch:" big="💀 đều mang theo MỘT LẦN khảo nghiệm đạo tâm 🤣" entry={T.SETUP.test} c={RED} h={160} />
        </g>
        <Footer label="linh thạch nuôi tông môn · nhưng mỗi khối một cái giá" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 MOHO ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VỊ THỨ NHẤT · YÊU CẦU MƠ HỒ" />
        <g transform="translate(0, 120)">
          <Say y={250} who="THƯỢNG KHÁCH 💰" whoC={GOLD} text="&quot;việc này đơn giản.&quot; 🤣" entry={T.MOHO.simple} />
          <Say y={356} who="THƯỢNG KHÁCH 💰" whoC={GOLD} text="&quot;cứ làm giống hệ thống kia.&quot;" entry={T.MOHO.likethat} />
          <Say y={462} who="THƯỢNG KHÁCH 💰 (hệ thống nào?)" whoC={RED} text="&quot;à… ta cũng không nhớ.&quot; 💀" entry={T.MOHO.forgot} />
          <Reveal y={578} top="ngày đó ta lĩnh ngộ công pháp đầu tiên:" big="🔥 KHAI THIÊN MƠ HỒ QUYẾT" entry={T.MOHO.name} c={GOLD} h={120} />
          <g style={usePop(T.MOHO.truth, 13)}>
            <Card x={W / 2 - 470} y={710} w={940} h={82} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={760} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>yêu cầu không rõ — càng làm nhanh, càng đi xa khỏi đích</text>
          </g>
        </g>
        <Footer label="requirement mơ hồ · thảm họa bắt đầu từ đây" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 CHISUA ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VỊ THỨ HAI · CHỈ SỬA MỘT CHÚT" color={RED} />
        <g transform="translate(0, 130)">
          <Say y={250} who="THƯỢNG KHÁCH 💰" whoC={GOLD} text="&quot;chỉ sửa một chút thôi.&quot; (ta nhẹ nhõm)" entry={T.CHISUA.little} />
          <g style={usePop(T.CHISUA.everything, 14)}>
            <Card x={W / 2 - 470} y={366} w={940} h={150} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={410} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 mở Thiên Cơ Đồ ra mới chết lặng — "một chút" =</text>
            <text x={W / 2} y={452} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đổi GIAO DIỆN · đổi LOGIC</text>
            <text x={W / 2} y={490} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đổi DATABASE · đổi cả QUY TRÌNH NGHIỆP VỤ</text>
          </g>
          <g style={usePop(T.CHISUA.nochu, 13)}>
            <Card x={W / 2 - 470} y={534} w={940} h={82} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={584} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🏯 trưởng lão thở dài: "Công Nghệ Tông — không có chữ <tspan fill={A} fontWeight={900}>'chỉ'</tspan>." 🤣</text>
          </g>
          <Reveal y={634} top="ngày đó ta ngộ ra:" big="🔥 NHẤT ĐIỂM CẢI BIẾN ĐẠI PHÁP" entry={T.CHISUA.name} c={GOLD} h={120} />
        </g>
        <Footer label="scope creep · 'một chút' = cả hệ thống" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 KHONGDOC ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VỊ THỨ BA · THIÊN KIẾP" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.KHONGDOC.steps, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={280} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">📜 NGỌC GIẢN</text>
            <text x={W / 2} y={312} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"bấm vào đây · chọn cái này · làm bước tiếp theo"</text>
            <text x={W / 2} y={344} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>(ta tưởng lần này CÙNG rõ ràng) → làm xong, gửi kết quả</text>
          </g>
          <Say y={392} who="THƯỢNG KHÁCH 💰 (5 phút sau)" whoC={GOLD} text="&quot;sao ta không thấy?&quot;" entry={T.KHONGDOC.notsee} />
          <g style={usePop(T.KHONGDOC.notdone, 14)}>
            <Card x={W / 2 - 470} y={498} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={542} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "ngài làm đúng từng bước chưa?"</text>
            <text x={W / 2} y={584} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tkTextGlow)">"ta chưa làm." 💀💀💀</text>
          </g>
          <Reveal y={630} top="ta nhìn trời · nhìn đất · nhìn bàn phím → lĩnh ngộ:" big="🔥 BẤT ĐỌC THIÊN THƯ KIẾP" entry={T.KHONGDOC.name} c={GOLD} h={130} />
        </g>
        <Footer label="gửi hướng dẫn · mà chính mình chưa từng làm" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 CANGAP ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VỊ ĐÁNG SỢ NHẤT · TA CẦN GẤP" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.CANGAP.urgent, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={92} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={296} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tkTextGlow)">💬 "TA CẦN GẤP."</text>
            <text x={W / 2} y={328} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ba chữ ấy — là tiếng chuông thiên kiếp</text>
          </g>
          <g style={usePop(T.CANGAP.grind, 13)}>
            <Card x={W / 2 - 470} y={358} w={940} h={82} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={408} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta xuất quan: 3 canh giờ · ☕ 5 ly cà phê · 1 đêm không ngủ → gửi đi</text>
          </g>
          <g style={usePop(T.CANGAP.days, 13)}>
            <Card x={W / 2 - 470} y={456} w={940} h={70} c={MUTE} rx={9} thick={1.5} />
            <text x={W / 2} y={500} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⏳ 1 ngày · 2 ngày · 3 ngày — không hồi âm</text>
          </g>
          <Say y={542} who="THƯỢNG KHÁCH 💰 (ngày thứ 4)" whoC={GOLD} text="&quot;À. Ta mới xem.&quot; 🤣" entry={T.CANGAP.day4} />
          <Reveal y={648} top="ngày đó ta hiểu — có thứ không đáng sợ vì KHÓ:" big="🔥 mà đáng sợ vì CHƯA TỪNG ĐƯỢC MỞ RA" entry={T.CANGAP.lesson} c={GOLD} h={130} />
        </g>
        <Footer label="'cần gấp' của khách · và 4 ngày im lặng" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 THIENBIEN ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN BIẾN VẠN HÓA ĐẠO" color={VIOLET} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.THIENBIEN.master, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={78} c={VIOLET} fill={CARD2} thick={2} />
            <text x={W / 2} y={298} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một vị truyền nhân của <tspan fill={VIOLET} fontWeight={900}>THIÊN BIẾN VẠN HÓA ĐẠO</tspan></text>
          </g>
          <g style={usePop(T.THIENBIEN.colors, 14)}>
            <Card x={W / 2 - 470} y={344} w={940} h={140} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={388} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🌅 sáng: "ta muốn màu <tspan fill={A} fontWeight={900}>XANH</tspan>"</text>
            <text x={W / 2} y={424} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🌇 chiều: "đổi <tspan fill={RED} fontWeight={900}>ĐỎ</tspan> đi"</text>
            <text x={W / 2} y={460} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🌄 mai: "hay quay lại màu <tspan fill={GOLD} fontWeight={900}>BAN ĐẦU</tspan>"</text>
          </g>
          <g style={usePop(T.THIENBIEN.versions, 14)}>
            <Card x={W / 2 - 470} y={500} w={940} h={92} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={544} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 một tháng · 32 phiên bản →</text>
            <text x={W / 2} y={580} fontSize={29} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>cuối cùng quay về ĐÚNG bản đầu tiên</text>
          </g>
          <Reveal y={608} top="ta bật khóc — không phải vì mệt, mà vì ta đã thấy…" big="🌀 LUÂN HỒI" entry={T.THIENBIEN.cry} c={GOLD} h={140} />
        </g>
        <Footer label="đổi tới đổi lui · 32 bản · về lại bản gốc" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 TUSANGTAO ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VỊ CUỐI CÙNG · KHÔNG BIẾT MÌNH MUỐN GÌ" color={RED} />
        <g transform="translate(0, 120)">
          <Say y={250} who="THƯỢNG KHÁCH 💰" whoC={GOLD} text="&quot;đạo hữu tự sáng tạo đi.&quot;" entry={T.TUSANGTAO.create} />
          <g style={usePop(T.TUSANGTAO.create, 13)}>
            <text x={W / 2} y={372} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">ta dốc toàn tu vi, dựng một đại trận hoàn chỉnh, mang tới…</text>
          </g>
          <Say y={396} who="THƯỢNG KHÁCH 💰 (trầm mặc 3 hơi thở)" whoC={RED} text="&quot;không phải cái này.&quot;" entry={T.TUSANGTAO.notthis} />
          <g style={usePop(T.TUSANGTAO.dunno, 14)}>
            <Card x={W / 2 - 470} y={502} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={546} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "vậy ý ngài là gì?"</text>
            <text x={W / 2} y={588} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tkTextGlow)">"ta chưa biết. nhưng chắc chắn không phải vậy." 💀</text>
          </g>
          <Reveal y={634} top="ngày đó, đạo tâm ta chính thức đạt cảnh giới:" big="🤣 MUỐN XUẤT GIA KHỎI NGÀNH IT" entry={T.TUSANGTAO.name} c={GOLD} h={130} />
        </g>
        <Footer label="'tự sáng tạo đi' · nhưng 'không phải cái này'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 DAOLY ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GREEN} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.DAOLY.test, 13)}>
            <Card x={W / 2 - 470} y={280} w={940} h={92} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={330} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Thượng Khách không phải kẻ thù — họ là <tspan fill={GOLD} fontWeight={900}>BÀI KIỂM TRA</tspan></text>
          </g>
          <g style={usePop(T.DAOLY.quotes, 13)}>
            <Card x={W / 2 - 470} y={388} w={940} h={110} c={MUTE} rx={10} thick={1.5} />
            <text x={W / 2} y={430} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nếu không có "chỉ sửa một chút" · "anh cần gấp"</text>
            <text x={W / 2} y={466} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"anh tưởng nó đơn giản" · "muốn giống cái kia"</text>
          </g>
          <Reveal y={520} top="🔥 sẽ không có những đại năng biết THIẾT KẾ · HỎI · PHÂN TÍCH" big="biết bảo vệ hệ thống khỏi chính yêu cầu của nhân gian" entry={T.DAOLY.skills} c={GREEN} h={170} />
        </g>
        <Footer label="khách khó · rèn ra đại năng biết hỏi & bảo vệ hệ thống" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 TIERLIST ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="BẢNG CẢNH GIỚI" color={GOLD} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.TIERLIST.ha, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={72} c={MUTE} rx={9} thick={1.5} />
            <text x={W / 2} y={296} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🥉 Hạ phẩm — sợ <tspan fill={A} fontWeight={900}>CODE</tspan> khó</text>
          </g>
          <g style={usePop(T.TIERLIST.trung, 13)}>
            <Card x={W / 2 - 470} y={334} w={940} h={72} c={A} rx={9} thick={1.5} />
            <text x={W / 2} y={380} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🥈 Trung phẩm — sợ <tspan fill={A} fontWeight={900}>BUG</tspan> khó</text>
          </g>
          <g style={usePop(T.TIERLIST.thuong, 13)}>
            <Card x={W / 2 - 470} y={418} w={940} h={72} c={RED} rx={9} thick={1.5} />
            <text x={W / 2} y={464} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🥇 Thượng phẩm — sợ <tspan fill={RED} fontWeight={900}>REQUIREMENT</tspan> khó 💀</text>
          </g>
          <g style={usePop(T.TIERLIST.cuc, 14)}>
            <Card x={W / 2 - 470} y={502} w={940} h={130} c={GOLD} fill={CARD2} thick={2.5} />
            <text x={W / 2 - 448} y={532} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">👑 CỰC PHẨM</text>
            <text x={W / 2} y={566} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nghe "anh chỉ muốn một thay đổi nhỏ thôi"</text>
            <text x={W / 2} y={606} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà VẪN GIỮ ĐƯỢC NỤ CƯỜI 🔥</text>
          </g>
          <Reveal y={654} top="cảnh giới ấy —" big="🤣 đã thất truyền từ thời thượng cổ" entry={T.TIERLIST.lost} c={GOLD} h={120} />
        </g>
        <Footer label="code < bug < requirement < giữ nụ cười trước khách" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 CTA ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(48, 14);
  const btn = usePop(84, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={620} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi đã gặp loại THƯỢNG KHÁCH nào</text>
            <text x={W / 2} y={680} fontSize={38} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tkTextGlow)">khiến đạo tâm rạn vỡ? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={802} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={GOLD} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={GOLD} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tkTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi khách nhắn 'chỉ sửa một chút'" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const ThuongKhach: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("thuong_khach/voice.mp3")} />
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
