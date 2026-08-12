import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./sd_beats.json";
import T from "./sd_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD / Sci-Fi FUI · Thương Đạo (gold) =====
const BG = "#060B14";
const CARD = "#0A1626";
const CARD2 = "#0C1C30";
const RED = "#FF5470";     // kiếp / danger / punchline
const GOLD = "#FFC24B";    // TA · Sales · Thương Đạo (hero)
const CYAN = "#2BE2FF";    // KHÁCH · tech accent
const TEAL = "#2EE6C2";    // sư phụ / trưởng lão / tiền bạc
const TEXT = "#DCEBF7";
const SEC = "#8FB2D0";
const MUTE = "#4F6E90";
const HUDC = GOLD;         // structural HUD color

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
          <pattern id="sdGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.05" />
          </pattern>
          <radialGradient id="sdGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sdScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.06" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sdVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#01030A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#sdGrid)" />
        <rect width={W} height={H} fill="url(#sdGlow)" />
        <g stroke={HUDC} strokeWidth={1} opacity={0.14}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#sdScan)" />
        <rect width={W} height={H} fill="url(#sdVig)" />
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
    <filter id="sdTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
        <text x={W - 108} y={143} fontSize={18} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">POV</text>
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
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#sdTextGlow)">{name}</text>
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
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = GOLD, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 52} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={38} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#sdTextGlow)">{big}</text>
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
            <text x={W / 2} y={330} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>POV: TA TU</text>
            <text x={W / 2} y={412} fontSize={76} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#sdTextGlow)" style={useFadeUp(12, 12)} opacity={0.9 + 0.1 * glow}>THƯƠNG ĐẠO</text>
            <text x={W / 2} y={470} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(16, 12)}>một tông môn kỳ lạ · đệ tử không dùng binh khí</text>
            <g style={usePop(T.HOOK.nokiem, 12)}>
              <Card x={W / 2 - 470} y={520} w={455} h={110} c={MUTE} rx={9} thick={1.5} />
              <text x={W / 2 - 242} y={588} fontSize={34} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕ KIẾM</text>
              <Card x={W / 2 + 15} y={520} w={455} h={110} c={MUTE} rx={9} thick={1.5} />
              <text x={W / 2 + 242} y={588} fontSize={34} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕ PHÁP BẢO</text>
            </g>
            <g style={usePop(T.HOOK.mouth, 14)}>
              <Card x={W / 2 - 470} y={660} w={940} h={150} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={716} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ lợi hại nhất của bọn họ là…</text>
              <text x={W / 2} y={772} fontSize={46} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#sdTextGlow)">CÁI MIỆNG 💀</text>
            </g>
            <g style={usePop(T.HOOK.sales, 15)}>
              <Card x={W / 2 - 340} y={850} w={680} h={140} c={GOLD} fill={CARD2} thick={3} />
              <text x={W / 2} y={902} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi bọn họ là</text>
              <text x={W / 2} y={962} fontSize={58} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="6" filter="url(#sdTextGlow)">SALES</text>
            </g>
          </g>
          <Footer label="tông môn Sales · vũ khí là cái miệng" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BAOGIA ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · BÁO GIÁ VÔ ẢNH" />
        <g transform="translate(0, 120)">
          <g style={usePop(T.BAOGIA.teach, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={130} c={TEAL} rx={10} thick={2} />
            <text x={W / 2 - 448} y={280} fontSize={18} fill={TEAL} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">SƯ PHỤ</text>
            <text x={W / 2} y={314} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"đừng cố bán hàng…"</text>
            <text x={W / 2} y={356} fontSize={27} fill={TEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"hãy giải quyết vấn đề của khách"</text>
          </g>
          <Say y={410} who="KHÁCH" whoC={CYAN} text="&quot;bao nhiêu tiền?&quot; 💰" entry={T.BAOGIA.price} />
          <g style={usePop(T.BAOGIA.vanish, 13)}>
            <Card x={W / 2 - 470} y={510} w={940} h={90} c={RED} rx={9} thick={1.5} />
            <text x={W / 2} y={567} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>báo giá → "được" → 🫥 <tspan fill={RED} fontWeight={900}>BIẾN MẤT</tspan></text>
          </g>
          <g style={usePop(T.BAOGIA.appear, 13)}>
            <Card x={W / 2 - 470} y={630} w={940} h={165} c={CYAN} rx={10} thick={2} />
            <text x={W / 2} y={682} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>[ 3 THÁNG SAU · đột nhiên xuất hiện ]</text>
          </g>
          <text x={W / 2} y={724} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade(T.BAOGIA.resend, 10)}>"gửi lại báo giá giúp anh"</text>
          <text x={W / 2} y={768} fontSize={28} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" opacity={useFade(T.BAOGIA.discount, 10)}>"bên kia rẻ hơn, giảm thêm nhé?" 💀</text>
          <Reveal y={830} top='trong Thương Đạo, khách hàng không bao giờ biến mất…' big="họ chỉ ĐI XIN THÊM BÁO GIÁ 🤣" entry={T.BAOGIA.truth} h={150} />
        </g>
        <Footer label="báo giá xong · khách hoá hư vô" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 DEMO ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · TRÌ HOÃN ĐẠI PHÁP" />
        <g transform="translate(0, 150)">
          <g style={usePop(T.DEMO.prep, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={110} c={GOLD} rx={10} thick={2} />
            <text x={W / 2} y={318} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>demo <tspan fill={GOLD} fontWeight={900}>3 ngày</tspan> · chuẩn bị <tspan fill={GOLD} fontWeight={900}>7 đêm</tspan></text>
            <text x={W / 2} y={356} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thuộc lòng từng slide, từng công pháp</text>
          </g>
          <Say y={410} who="KHÁCH (vừa mở slide đầu)" whoC={CYAN} text="&quot;bao giờ tới phần giá?&quot; 💀" entry={T.DEMO.askprice} />
          <Say y={510} who="KHÁCH (demo xong, cười tươi)" whoC={CYAN} text="&quot;hay lắm, đúng cái anh cần&quot; 🥹" entry={T.DEMO.praise} />
          <Say y={610} who="KHÁCH" whoC={CYAN} text="&quot;để anh bàn thêm với sếp&quot; 🫠" entry={T.DEMO.boss} />
          <Reveal y={720} top="ta vui đến run người… rồi lĩnh ngộ:" big="TRÌ HOÃN ĐẠI PHÁP" entry={T.DEMO.reveal} h={150} />
        </g>
        <Footer label="'để anh bàn với sếp' · câu chú vô hạn" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 CHODON ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const demand = ["bớt thêm 10% nhé", "có quà tặng không?", "hỗ trợ trọn đời nhé", "thanh toán sang năm nhé"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="&quot;ANH CHỐT&quot;" color={GOLD} />
          <g transform="translate(0, 150)">
            <KiepBanner y={250} tag="KHÁCH GỌI ĐIỆN" name="&quot;ANH CHỐT&quot; 💥" c={GOLD} entry={T.CHODON.close} />
            <text x={W / 2} y={430} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade((T.CHODON.demand as number[])[0] - 6, 10)}>đạo tâm rung động · tay run run mở hợp đồng… khách nói tiếp:</text>
            <g>
              {demand.map((t, i) => (
                <g key={i} style={usePop((T.CHODON.demand as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470} y={470 + i * 82} w={940} h={66} c={RED} rx={9} thick={2} />
                  <text x={W / 2} y={512 + i * 82} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"{t}"</text>
                </g>
              ))}
            </g>
            <Reveal y={815} top='trong Thương Đạo, hai chữ "chốt đơn"…' big="chỉ là BẮT ĐẦU 🤣" entry={T.CHODON.reveal} h={140} />
          </g>
          <Footer label="chốt đơn = tiếng chuông mở màn" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 KPI ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · KPI VÔ TẬN ĐẠO" />
        <g transform="translate(0, 150)">
          <g style={usePop(T.KPI.sign, 13)}>
            <Card x={W / 2 - 470} y={270} w={940} h={110} c={TEAL} rx={10} thick={2} />
            <text x={W / 2} y={318} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau vô số lần cúi đầu · cuối cùng…</text>
            <text x={W / 2} y={358} fontSize={30} fill={TEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KÝ ĐƯỢC 1 HỢP ĐỒNG ✍️</text>
          </g>
          <g style={usePop(T.KPI.four, 14)}>
            <Card x={W / 2 - 470} y={410} w={940} h={130} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={462} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>báo trưởng lão → "giỏi" 😊</text>
            <text x={W / 2} y={512} fontSize={31} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#sdTextGlow)">"thế… bốn đơn còn lại đâu?" 💀</text>
          </g>
          <Reveal y={570} top="ngày hôm đó ta lĩnh ngộ:" big="KPI VÔ TẬN ĐẠO" entry={T.KPI.reveal} h={140} c={GOLD} />
          <g style={usePop(T.KPI.newkpi, 14)}>
            <Card x={W / 2 - 470} y={735} w={940} h={130} c={GOLD} rx={10} thick={2} />
            <text x={W / 2} y={788} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ cần ngươi đạt KPI…</text>
            <text x={W / 2} y={834} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thiên đạo lập tức ban MỘT KPI MỚI ♾️</text>
          </g>
        </g>
        <Footer label="đạt KPI · phần thưởng là KPI" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 SUYNGHI ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const photos = ["✈️ đi du lịch", "⛳ đánh golf", "☕ uống cà phê"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · SUY NGHĨ VÔ LƯỢNG ĐẠO" />
          <g transform="translate(0, 150)">
            <g style={usePop(T.SUYNGHI.praise, 13)}>
              <Card x={W / 2 - 470} y={270} w={940} h={130} c={CYAN} rx={10} thick={2} />
              <text x={W / 2 - 448} y={300} fontSize={18} fill={CYAN} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">KHÁCH</text>
              <text x={W / 2} y={336} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"sản phẩm tốt · công ty uy tín"</text>
              <text x={W / 2} y={378} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"anh rất thích" 🥹</text>
            </g>
            <Say y={430} who="KHÁCH (bắt tay ta thật chặt)" whoC={RED} text="&quot;để anh… suy nghĩ thêm&quot; 💀" entry={T.SUYNGHI.think} />
            <text x={W / 2} y={556} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} opacity={useFade((T.SUYNGHI.photos as number[])[0] - 6, 10)}>[ 3 THÁNG SAU · vẫn thấy ngài đăng ảnh ]</text>
            <g>
              {photos.map((t, i) => (
                <g key={i} style={usePop((T.SUYNGHI.photos as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470 + i * 316} y={585} w={296} h={80} c={GOLD} rx={9} thick={1.5} />
                  <text x={W / 2 - 322 + i * 316} y={633} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <Reveal y={695} top='chỉ là… vẫn "chưa nghĩ xong"' big="SUY NGHĨ VÔ LƯỢNG ĐẠO 🤣" entry={T.SUYNGHI.reveal} h={150} />
          </g>
          <Footer label="'để anh suy nghĩ thêm' · suy nghĩ đến vô cực" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DAOLY ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { t: "HẠ PHẨM", d: "đi tìm khách", c: MUTE },
    { t: "TRUNG PHẨM", d: "khiến khách rep tin nhắn", c: SEC },
    { t: "THƯỢNG PHẨM", d: "khiến khách chủ động gọi lại", c: TEAL },
    { t: "TRUYỀN THUYẾT", d: 'khách KHÔNG hỏi "giảm thêm được không?"', c: GOLD },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="ĐẠO LÝ" />
          <g transform="translate(0, 120)">
            <g style={usePop(T.DAOLY.fear, 13)}>
              <Card x={W / 2 - 470} y={250} w={940} h={150} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={300} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ đáng sợ nhất — không phải bị từ chối, không phải chê đắt</text>
              <text x={W / 2} y={344} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">mà là: "anh rất thích…</text>
              <text x={W / 2} y={382} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">…để anh suy nghĩ thêm" 💀</text>
            </g>
            <g>
              {tiers.map((r, i) => (
                <g key={i} style={usePop((T.DAOLY.tiers as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470} y={430 + i * 92} w={940} h={78} c={r.c} rx={9} thick={i === 3 ? 2.5 : 1.5} fill={i === 3 ? CARD2 : CARD} />
                  <text x={W / 2 - 448} y={430 + i * 92 + 48} fontSize={26} fill={r.c} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{r.t}</text>
                  <text x={W / 2 + 448} y={430 + i * 92 + 48} fontSize={i === 3 ? 24 : 25} fill={TEXT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i === 3 ? 800 : 600}>{r.d}</text>
                </g>
              ))}
            </g>
            <g style={usePop(T.DAOLY.lost, 15)}>
              <text x={W / 2} y={860} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#sdTextGlow)">…đáng tiếc, cảnh giới ấy đã THẤT TRUYỀN từ thời thượng cổ 💀</text>
            </g>
          </g>
          <Footer label="cảnh giới tối cao · khách không xin giảm giá" />
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
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={590} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi đã gặp vị khách nói</text>
            <text x={W / 2} y={654} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"anh rất thích… để anh suy nghĩ thêm"</text>
            <text x={W / 2} y={706} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">…chưa? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={GOLD} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={GOLD} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#sdTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(128, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi khách 'suy nghĩ thêm' lần nữa" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

// nhịp giữa các slide: fade-in đầu + fade-out cuối → có "beat" trước khi sang slide sau
const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const SalesDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("sales_dao/voice.mp3")} />
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
