import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./ht_beats.json";
import T from "./ht_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV Họa Tu (designer) · ta=cyan · khách/PM/CEO=gold · kiếp=đỏ · công pháp=violet =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";     // kiếp · đạo tâm nứt
const A = "#2BE2FF";       // TA (Họa Tu)
const GOLD = "#FFC24B";    // khách · PM · CEO
const GREEN = "#2EE6A8";   // đạo lý
const VIOLET = "#A78BFF";  // công pháp · họa nghệ
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
          <pattern id="htGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="htGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="htScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="htVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#htGrid)" />
        <rect width={W} height={H} fill="url(#htGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#htScan)" />
        <rect width={W} height={H} fill="url(#htVig)" />
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
    <filter id="htTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · chốn công sở</text>
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
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#htTextGlow)">{big}</text>
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
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 150)">
            <text x={W / 2} y={296} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT HỌA TU · designer</text>
            <g style={usePop(T.HOOK.join, 13)}>
              <Card x={W / 2 - 470} y={340} w={940} h={92} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={396} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>năm ấy ta gia nhập <tspan fill={A} fontWeight={900}>HỌA TU TÔNG</tspan></text>
            </g>
            <g style={usePop(T.HOOK.believe, 14)}>
              <Card x={W / 2 - 470} y={452} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={500} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta luôn tin:</text>
              <text x={W / 2} y={540} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"chỉ cần họa công đủ cao → tung hoành Software Giới" 🤣</text>
            </g>
            <g style={usePop(T.HOOK.naive, 15)}>
              <Card x={W / 2 - 400} y={600} w={800} h={130} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={654} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 sau này mới biết…</text>
              <text x={W / 2} y={708} fontSize={52} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#htTextGlow)" opacity={0.9 + 0.1 * glow}>TA ĐÃ QUÁ NGÂY THƠ</text>
            </g>
          </g>
          <Footer label="họa công cao · chưa chắc sống sót chốn công sở" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 VOTU ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGÀY ĐẦU · NGỌC GIẢN" color={GOLD} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.VOTU.demands, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={130} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={300} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">📜 NGỌC GIẢN CỦA TRƯỞNG LÃO</text>
            <text x={W / 2} y={342} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"đẹp lên · hiện đại hơn · sang hơn"</text>
            <text x={W / 2} y={378} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"có cảm xúc hơn…"</text>
          </g>
          <g style={usePop(T.VOTU.contra, 13)}>
            <Card x={W / 2 - 470} y={418} w={940} h={82} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={468} fontSize={27} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">💀 "nhưng phải TỐI GIẢN · đừng giống app khác"</text>
          </g>
          <Reveal y={520} top="đó là lần đầu tiên ta được đọc:" big="🔥 VÔ TỰ HỌA KINH (kinh không một chữ) 🤣" entry={T.VOTU.name} c={VIOLET} h={150} />
        </g>
        <Footer label="brief mâu thuẫn · yêu cầu không một dòng cụ thể" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 LUYENHOA ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="7 NGÀY BẾ QUAN · LUYỆN HỌA QUYỂN" color={VIOLET} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.LUYENHOA.skills, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={280} c={VIOLET} fill={CARD2} thick={2} />
            <text x={W / 2} y={306} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📐 Lưu Bạch Tâm Pháp <tspan fill={SEC} fontWeight={600}>= whitespace</tspan></text>
            <text x={W / 2} y={352} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🎨 Ngũ Sắc Đạo Điển <tspan fill={SEC} fontWeight={600}>= màu sắc</tspan></text>
            <text x={W / 2} y={398} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔤 Thư Pháp Chân Kinh <tspan fill={SEC} fontWeight={600}>= typography</tspan></text>
            <text x={W / 2} y={444} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📏 Cửu Cung Trận <tspan fill={SEC} fontWeight={600}>= grid</tspan></text>
            <text x={W / 2} y={490} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✨ Tự Diễn Trận <tspan fill={SEC} fontWeight={600}>= animation</tspan></text>
          </g>
          <Reveal y={556} top="cuối cùng, một bức Họa Quyển:" big="🔥 HOÀN MỸ VÔ KHUYẾT · ra đời ✨" entry={T.LUYENHOA.done} c={VIOLET} h={150} />
        </g>
        <Footer label="5 tuyệt học của Họa Tu · đổ vào một bức" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 LOGO ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ①· LOGO" color={GOLD} />
        <g transform="translate(0, 130)">
          <Say y={260} who="PM 👑 (nhìn 1 cái)" whoC={GOLD} text="&quot;Logo. TO HƠN.&quot;" entry={T.LOGO.bigger} />
          <g style={usePop(T.LOGO.notyet, 14)}>
            <Card x={W / 2 - 470} y={376} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={420} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta sửa → "TO THÊM." → sửa tiếp →</text>
            <text x={W / 2} y={464} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"vẫn chưa đủ nổi bật." 💀</text>
          </g>
          <Reveal y={548} top="ta nhìn logo… rồi nhìn toàn bộ giao diện → suýt lĩnh ngộ:" big="🔥 LOGO TRẤN ÁP THIÊN ĐỊA ĐẠI PHÁP 🤣" entry={T.LOGO.name} c={VIOLET} h={160} />
        </g>
        <Footer label="logo to hơn · to thêm · to nữa · nuốt cả UI" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 KHO ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ②· DEVELOPER" />
        <g transform="translate(0, 130)">
          <g style={usePop(T.KHO.receive, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={318} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Họa Quyển hoàn thành → <tspan fill={A} fontWeight={900}>Developer Tông</tspan> tiếp nhận</text>
          </g>
          <Say y={364} who="DEVELOPER ⚙️ (3 ngày sau)" whoC={RED} text="&quot;cái này làm KHÔNG ĐƯỢC.&quot;" entry={T.KHO.cannot} />
          <g style={usePop(T.KHO.cannot, 13)}>
            <text x={W / 2} y={486} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">ta: "vì sao?" → Developer: <tspan fill={RED} fontWeight={900}>"Khó."</tspan> 🤣</text>
          </g>
          <Reveal y={540} top="ngày đó ta mới hiểu — trong giới Dev:" big='🔥 "KHÓ" là một loại CÔNG PHÁP' entry={T.KHO.name} c={VIOLET} h={150} />
        </g>
        <Footer label="'khó' — chiêu thức vạn năng của Developer" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 BUILD ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="BẢN BUILD · HỌA QUYỂN VỠ VỤN" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.BUILD.broken, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={190} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={280} fontSize={18} fill={RED} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">💀 TA MỞ BẢN BUILD</text>
            <text x={W / 2} y={322} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Padding lệch 2px · Font sai</text>
            <text x={W / 2} y={362} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Border Radius mất · Shadow biến mất</text>
            <text x={W / 2} y={406} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✨ Animation chưa kịp xuất thế — đã bị phong ấn</text>
          </g>
          <g style={usePop(T.BUILD.dev, 14)}>
            <Card x={W / 2 - 470} y={456} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={500} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta gửi ảnh so sánh → Developer đáp:</text>
            <text x={W / 2} y={542} fontSize={29} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"nhìn mắt thường, không ai nhận ra đâu" 🤣</text>
          </g>
          <Reveal y={600} top="khoảnh khắc ấy, đạo tâm Họa Tu của ta:" big="💀 xuất hiện VẾT NỨT ĐẦU TIÊN" entry={T.BUILD.crack} c={RED} h={140} />
        </g>
        <Footer label="thiết kế 100% · build ra 80% · 'không ai nhận ra'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 CAMXUC ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ③· THIẾU CẢM XÚC" color={GOLD} />
        <g transform="translate(0, 130)">
          <Say y={260} who="PM 👑" whoC={GOLD} text="&quot;anh thấy… THIẾU CẢM XÚC.&quot;" entry={T.CAMXUC.lack} />
          <g style={usePop(T.CAMXUC.lack, 13)}>
            <Card x={W / 2 - 470} y={376} w={940} h={92} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={420} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "cảm xúc gì?" →</text>
            <text x={W / 2} y={456} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"không biết. nhưng nhìn vào — PHẢI CÓ." 💀</text>
          </g>
          <Reveal y={488} top="ngày đó ta lĩnh ngộ:" big="🔥 HƯ VÔ Ý CẢNH" entry={T.CAMXUC.name} c={VIOLET} h={118} />
          <g style={usePop(T.CAMXUC.musknow, 13)}>
            <Card x={W / 2 - 470} y={624} w={940} h={82} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={674} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách không biết muốn gì · PM cũng không biết · nhưng <tspan fill={A} fontWeight={900}>HỌA TU PHẢI BIẾT</tspan></text>
          </g>
        </g>
        <Footer label="'thiếu cảm xúc' — cái brief không thể đo" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 MAU ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ④· CEO ĐỔI MÀU" color={RED} />
        <g transform="translate(0, 120)">
          <Say y={250} who="CEO 👑 (trầm mặc hồi lâu)" whoC={GOLD} text="&quot;màu này, đổi sang XANH.&quot;" entry={T.MAU.ceo} />
          <g style={usePop(T.MAU.otherblue, 14)}>
            <Card x={W / 2 - 470} y={366} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={410} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta đổi →</text>
            <text x={W / 2} y={452} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"không phải xanh này. là xanh. nhưng XANH KHÁC." 💀</text>
          </g>
          <Say y={492} who="CEO 👑 (3 ngày sau)" whoC={GOLD} text="&quot;thôi. đổi LẠI NHƯ CŨ.&quot; 💀💀💀" entry={T.MAU.revert} />
          <Reveal y={608} top="10 năm tu vi Họa Tu của ta:" big="🤣 suýt nữa TRỰC TIẾP SỤP ĐỔ" entry={T.MAU.collapse} c={VIOLET} h={140} />
        </g>
        <Footer label="'xanh nhưng xanh khác' · rồi về lại như cũ" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 GIONGKHAC ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP LỚN NHẤT" color={RED} />
        <g transform="translate(0, 130)">
          <g style={usePop(T.GIONGKHAC.biggest, 13)}>
            <Card x={W / 2 - 470} y={260} w={940} h={78} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={308} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 không phải sửa màu — mà là khách gửi 1 app khác:</text>
          </g>
          <g style={usePop(T.GIONGKHAC.sameother, 13)}>
            <Card x={W / 2 - 470} y={354} w={940} h={82} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={404} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"làm GIỐNG thế này… nhưng phải KHÁC" 🤣</text>
          </g>
          <g style={usePop(T.GIONGKHAC.dilemma, 15)}>
            <Card x={W / 2 - 470} y={452} w={940} h={230} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={506} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>😱 giống quá → bị bảo <tspan fill={RED} fontWeight={900}>đạo nhái</tspan></text>
            <text x={W / 2} y={552} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khác quá → bị bảo <tspan fill={RED} fontWeight={900}>không thích</tspan></text>
            <text x={W / 2} y={598} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đẹp quá → bị bảo <tspan fill={RED} fontWeight={900}>khó dùng</tspan></text>
            <text x={W / 2} y={644} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đơn giản quá → bị bảo <tspan fill={RED} fontWeight={900}>thiếu điểm nhấn</tspan></text>
          </g>
        </g>
        <Footer label="làm gì cũng sai · đó mới là đại kiếp" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 NGO ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGỘ RA" color={GREEN} />
        <g transform="translate(0, 155)">
          <g style={usePop(T.NGO.hardest, 13)}>
            <Card x={W / 2 - 470} y={300} w={940} h={92} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={356} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ khó nhất — <tspan fill={A} fontWeight={900}>KHÔNG phải họa công</tspan></text>
          </g>
          <Reveal y={430} top="mà là biến một câu 'làm đẹp hơn · sang hơn · có cảm xúc hơn'" big="🔥 thành MỘT THỨ THẬT SỰ TỒN TẠI" entry={T.NGO.transform} c={GREEN} h={180} />
        </g>
        <Footer label="dịch lời nói mơ hồ → thành pixel có thật" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 DAOLY ============
const S11: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" />
        <g transform="translate(0, 120)">
          <g style={usePop(T.DAOLY.notdrawer, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={78} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={298} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Họa Tu — <tspan fill={A} fontWeight={900}>không phải người vẽ giao diện</tspan></text>
          </g>
          <g style={usePop(T.DAOLY.translate, 14)}>
            <Card x={W / 2 - 470} y={344} w={940} h={110} c={VIOLET} fill={CARD2} thick={2} />
            <text x={W / 2} y={388} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mà là người dùng hàng vạn PIXEL để DỊCH</text>
            <text x={W / 2} y={428} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>những ý tưởng chưa từng được nói rõ → thành hình ✨</text>
          </g>
          <g style={usePop(T.DAOLY.pixel, 13)}>
            <Card x={W / 2 - 470} y={470} w={940} h={92} c={SEC} rx={10} thick={1.5} />
            <text x={W / 2} y={514} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thấy Họa Tu dời 1 nút sang trái 1px, rồi phải 1px →</text>
            <text x={W / 2} y={548} fontSize={26} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐỪNG CƯỜI HẮN</text>
          </g>
          <Reveal y={594} top="rất có thể hắn không hề chỉnh cái nút —" big="🤣 mà đang cứu ĐẠO TÂM của chính mình" entry={T.DAOLY.save} c={GOLD} h={150} />
        </g>
        <Footer label="1 pixel · không phải cái nút · là đạo tâm" />
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
            <text x={W / 2} y={620} fontSize={36} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi là HỌA TU —</text>
            <text x={W / 2} y={682} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#htTextGlow)">hay kẻ từng nói "làm đẹp hơn đi"? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#htTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi khách nói 'làm sang hơn đi'" />
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

export const HoaTu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("hoa_tu/voice.mp3")} />
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
