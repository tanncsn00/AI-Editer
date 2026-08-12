import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mg_beats.json";
import T from "./mg_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD · Trading terminal (green ↔ đỏ bảng điện) =====
const BG = "#060D0A";
const CARD = "#0C1A14";
const CARD2 = "#0E2018";
const RED = "#FF5470";     // đỏ · giảm · sợ hãi · kiếp
const GREEN = "#26E0A0";   // xanh · tăng · hy vọng · primary
const GOLD = "#FFC24B";    // linh thạch · reveal đạo lý
const CYAN = "#2BE2FF";    // trung tính / khách
const TEXT = "#E4F0EA";
const SEC = "#9FC0B0";
const MUTE = "#5A7565";
const HUDC = GREEN;

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
  // candlestick strip (trading flavor)
  const candles = [58, 40, 66, 48, 30, 52, 72, 44, 60, 36, 68, 50];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="mgGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.05" />
          </pattern>
          <radialGradient id="mgGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mgScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.06" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="mgVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#010604" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#mgGrid)" />
        <rect width={W} height={H} fill="url(#mgGlow)" />
        {/* faint candlestick chart bottom */}
        <g opacity={0.1}>
          {candles.map((h, i) => {
            const x = 90 + i * 82; const up = i % 2 === 0; const c = up ? GREEN : RED;
            const cy = 1560 - h; return (
              <g key={i} stroke={c} fill={c}>
                <line x1={x} y1={cy - 22} x2={x} y2={cy + h + 22} strokeWidth={2} />
                <rect x={x - 16} y={cy} width={32} height={h} rx={2} />
              </g>
            );
          })}
        </g>
        <g stroke={HUDC} strokeWidth={1} opacity={0.12}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#mgScan)" />
        <rect width={W} height={H} fill="url(#mgVig)" />
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
    <filter id="mgTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
        <text x={W - 118} y={143} fontSize={18} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">LIVE</text>
        <circle cx={W - 100} cy={136} r={6} fill={RED} opacity={blink} />
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
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mgTextGlow)">{name}</text>
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
    <text x={W / 2} y={y + h - 34} fontSize={37} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mgTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 120)">
            <text x={W / 2} y={300} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT</text>
            <text x={W / 2} y={382} fontSize={64} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mgTextGlow)" style={useFadeUp(12, 12)} opacity={0.9 + 0.1 * glow}>MÔI GIỚI CHỨNG KHOÁN</text>
            <text x={W / 2} y={440} fontSize={26} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(16, 12)}>gia nhập Chứng Đạo Tông · ta tưởng việc rất đơn giản…</text>
            <g style={usePop(T.HOOK.simple, 12)}>
              <Card x={W / 2 - 470} y={490} w={455} h={104} c={GREEN} rx={9} thick={1.5} />
              <text x={W / 2 - 242} y={532} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách mua</text>
              <text x={W / 2 - 242} y={568} fontSize={25} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ nhập lệnh</text>
              <Card x={W / 2 + 15} y={490} w={455} h={104} c={RED} rx={9} thick={1.5} />
              <text x={W / 2 + 242} y={532} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách bán</text>
              <text x={W / 2 + 242} y={568} fontSize={25} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ nhập lệnh</text>
            </g>
            <g style={usePop(T.HOOK.salary, 12)}>
              <Card x={W / 2 - 470} y={614} w={940} h={82} c={GOLD} rx={9} thick={1.5} />
              <text x={W / 2} y={664} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cuối tháng lĩnh linh thạch 💎 · <tspan fill={GOLD}>tưởng đơn giản</tspan></text>
            </g>
            <g style={usePop(T.HOOK.ask, 12)}>
              <Card x={W / 2 - 470} y={720} w={940} h={78} c={GREEN} rx={10} thick={2} />
              <text x={W / 2 - 448} y={750} fontSize={18} fill={GREEN} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">TRƯỞNG LÃO</text>
              <text x={W / 2} y={778} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"ngươi nghĩ mình bán cổ phiếu?"</text>
            </g>
            <Reveal y={820} top="ngài chỉ cười… &quot;không&quot;" big="ngươi bán — NIỀM TIN 💀" entry={T.HOOK.twist} c={RED} h={140} />
          </g>
          <Footer label="Chứng Đạo Tông · nơi bán niềm tin" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 KHACH1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const analysis = ["báo cáo tài chính", "dòng tiền", "định giá", "triển vọng"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · VỊ KHÁCH ĐẦU TIÊN" color={RED} />
          <g transform="translate(0, 120)">
            <Say y={250} who="KHÁCH" whoC={CYAN} text="&quot;mã nào sắp tăng?&quot;" entry={T.KHACH1.q} />
            <text x={W / 2} y={372} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade((T.KHACH1.analysis as number[])[0] - 6, 10)}>ta phân tích gần nửa canh giờ:</text>
            <g>
              {analysis.map((t, i) => (
                <g key={i} style={usePop((T.KHACH1.analysis as number[])[i] ?? 0, 8)}>
                  <Card x={W / 2 - 470 + (i % 2) * 480} y={400 + Math.floor(i / 2) * 76} w={450} h={62} c={GREEN} rx={8} thick={1.5} />
                  <text x={W / 2 - 245 + (i % 2) * 480} y={438 + Math.floor(i / 2) * 76} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📊 {t}</text>
                </g>
              ))}
            </g>
            <g style={usePop(T.KHACH1.buy, 14)}>
              <Card x={W / 2 - 470} y={562} w={940} h={92} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={620} fontSize={31} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mgTextGlow)">…rồi hắn mua MỘT MÃ HOÀN TOÀN KHÁC 💀</text>
            </g>
            <Say y={670} who="KHÁCH (hôm sau mã đó giảm sàn 📉)" whoC={RED} text="&quot;sao hôm qua em không cản anh?&quot;" entry={T.KHACH1.blame} />
            <Reveal y={772} top="công pháp đầu tiên ta lĩnh ngộ:" big="KHUYÊN không ai nghe · LỖ ai cũng nhớ" entry={T.KHACH1.reveal} c={GOLD} h={140} />
          </g>
          <Footer label="phân tích nửa canh giờ · khách mua mã khác" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 CHACKHONG ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · &quot;CHẮC KHÔNG?&quot;" color={RED} />
        <g transform="translate(0, 175)">
          <Say y={300} who="KHÁCH" whoC={CYAN} text="&quot;cổ phiếu này có lên không?&quot;" entry={T.CHACKHONG.q1} />
          <Say y={398} who="TA" whoC={GREEN} text="&quot;có khả năng&quot;" entry={T.CHACKHONG.a1} />
          <Say y={496} who="KHÁCH" whoC={CYAN} text="&quot;chắc không?&quot;" entry={T.CHACKHONG.q2} />
          <Say y={594} who="TA" whoC={GREEN} text="&quot;không ai chắc cả&quot; 💀" entry={T.CHACKHONG.a2} />
          <Reveal y={700} top="hắn im lặng… 10 phút sau:" big="chuyển sang CÔNG TY CHỨNG KHOÁN KHÁC 🤣" entry={T.CHACKHONG.leave} c={GOLD} h={140} />
        </g>
        <Footer label="'không ai chắc cả' · câu thật thà nhất, mất khách nhanh nhất" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 NHIEULOAI ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const losses = [
    { p: "lỗ 20%", s: "\"đầu tư dài hạn\"" },
    { p: "lỗ 50%", s: "\"đầu tư giá trị\"" },
    { p: "lỗ 80%", s: "\"có mã nào gỡ nhanh không?\"" },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · MUÔN LOẠI KHÁCH" color={RED} />
          <g transform="translate(0, 120)">
            <g style={usePop(T.NHIEULOAI.chot, 12)}>
              <Card x={W / 2 - 470} y={255} w={940} h={76} c={GREEN} rx={9} thick={2} />
              <text x={W / 2} y={302} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>lãi <tspan fill={GREEN} fontWeight={900}>+3%</tspan> → đã hô "CHỐT!" 🙂</text>
            </g>
            <g style={usePop(T.NHIEULOAI.up50, 13)}>
              <Card x={W / 2 - 470} y={347} w={940} h={110} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={392} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>3 ngày sau cổ phiếu tăng thêm <tspan fill={GREEN} fontWeight={800}>+50%</tspan></text>
              <text x={W / 2} y={432} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"sao hôm đó em không giữ anh lại?" 💀</text>
            </g>
            <g>
              {losses.map((l, i) => (
                <g key={i} style={usePop((T.NHIEULOAI.losses as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470} y={473 + i * 84} w={940} h={70} c={RED} rx={9} thick={1.5} />
                  <text x={W / 2 - 448} y={516 + i * 84} fontSize={27} fill={RED} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{l.p}</text>
                  <text x={W / 2 + 60} y={516 + i * 84} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{l.s}</text>
                </g>
              ))}
            </g>
            <Reveal y={745} top="lần đầu ta chứng kiến…" big="nhân tính biến hoá nhanh hơn BẢNG ĐIỆN 🤣" entry={T.NHIEULOAI.reveal} c={GOLD} h={140} />
          </g>
          <Footer label="lãi thì 'chốt non' · lỗ thì 'đầu tư dài hạn'" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 CUOCGOI ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const calls = ["\"mai có mã nào tím không?\"", "\"có tin nội bộ gì không?\"", "\"mai thị trường xanh hay đỏ?\""];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · CUỘC GỌI TỐI MUỘN" color={RED} />
          <g transform="translate(0, 165)">
            <g style={usePop(T.CUOCGOI.intro, 13)}>
              <Card x={W / 2 - 470} y={280} w={940} h={90} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={337} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đáng sợ nhất không phải thị trường… 📞</text>
            </g>
            <g>
              {calls.map((t, i) => (
                <g key={i} style={usePop((T.CUOCGOI.calls as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470} y={400 + i * 92} w={940} h={78} c={CYAN} rx={9} thick={2} />
                  <text x={W / 2 - 448} y={432 + i * 92} fontSize={17} fill={CYAN} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">"EM ƠI…"</text>
                  <text x={W / 2} y={448 + i * 92} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{t}</text>
                </g>
              ))}
            </g>
            <Reveal y={700} top="ta ngộ ra một chân lý:" big="biết ngày mai thị trường đi đâu → ta đã KHÔNG làm môi giới 🤣" entry={T.CUOCGOI.reveal} c={GOLD} h={150} />
          </g>
          <Footer label="'em ơi mai có mã nào tím không' · nỗi ám ảnh lúc 11h đêm" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 CALLMARGIN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="⚡ THIÊN KIẾP" color={RED} />
        <g transform="translate(0, 150)">
          <KiepBanner y={255} tag="THIÊN KIẾP GIÁNG XUỐNG" name="⚡ CALL MARGIN ⚡" c={RED} entry={T.CALLMARGIN.kiep} />
          <g style={usePop(T.CALLMARGIN.nocontact, 12)}>
            <Card x={W / 2 - 470} y={410} w={940} h={78} c={RED} rx={9} thick={2} />
            <text x={W / 2} y={457} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>gọi điện · nhắn tin → khách KHÔNG nghe máy 📵</text>
          </g>
          <Say y={508} who="KHÁCH (nếu nghe máy)" whoC={CYAN} text="&quot;để anh tính…&quot; 🫠" entry={T.CALLMARGIN.excuse} />
          <Say y={606} who="KHÁCH (1 canh giờ sau, giảm tiếp → gọi lại)" whoC={RED} text="&quot;em đừng tạo áp lực&quot;" entry={T.CALLMARGIN.pressure} />
          <Reveal y={708} top="lần đầu ta hiểu · thiên kiếp không đánh vào tài khoản…" big="mà đánh thẳng vào ĐẠO TÂM 💀" entry={T.CALLMARGIN.reveal} c={GOLD} h={150} />
        </g>
        <Footer label="Call Margin · nơi đạo tâm môi giới đi để vỡ" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 BONGBONG ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const gurus = ["nhập môn 3 hôm → giảng đạo", "lãi 2 tuần → dạy đầu tư", "trúng 1 con sóng → tưởng thấu thiên cơ"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · AI CŨNG LÀ ĐẠI NĂNG" color={GREEN} />
          <g transform="translate(0, 135)">
            <g style={usePop(T.BONGBONG.boom, 12)}>
              <Card x={W / 2 - 470} y={255} w={940} h={82} c={GREEN} fill={CARD2} thick={2} />
              <text x={W / 2} y={305} fontSize={29} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🚀 thị trường tăng điên cuồng → ai cũng là đại năng</text>
            </g>
            <g>
              {gurus.map((t, i) => (
                <g key={i} style={usePop((T.BONGBONG.gurus as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470} y={352 + i * 84} w={940} h={70} c={CYAN} rx={9} thick={1.5} />
                  <text x={W / 2} y={395 + i * 84} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <g style={usePop(T.BONGBONG.crash, 13)}>
              <Card x={W / 2 - 470} y={620} w={940} h={100} c={RED} fill={CARD2} thick={2} />
              <text x={W / 2} y={665} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>📉 rồi thị trường giảm → đồng loạt bế quan</text>
              <text x={W / 2} y={702} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhóm chat im lặng như cổ mộ 🪦</text>
            </g>
            <Reveal y={745} top='người từng hô "ALL IN"…' big='nay đăng "tiền không quan trọng" 🤣' entry={T.BONGBONG.allin} c={GOLD} h={140} />
          </g>
          <Footer label="uptrend ai cũng là thần · downtrend ai cũng bế quan" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 DAOLY ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const pairs = [
    { l: "hy vọng 💚", r: "sợ hãi 💀" },
    { l: "lòng tham", r: "nỗi sợ" },
    { l: "hưng phấn nhất", r: "tuyệt vọng nhất" },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="ĐẠO LÝ" color={GOLD} />
          <g transform="translate(0, 175)">
            <g style={usePop(T.DAOLY.notpredict, 13)}>
              <Card x={W / 2 - 470} y={300} w={940} h={130} c={GREEN} rx={10} thick={2} />
              <text x={W / 2} y={352} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>môi giới KHÔNG phải người đoán tương lai</text>
              <text x={W / 2} y={396} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cũng KHÔNG điều khiển thị trường</text>
            </g>
            <text x={W / 2} y={480} fontSize={27} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={useFade((T.DAOLY.between as number[])[0] - 6, 10)}>mà là người ngày nào cũng đứng GIỮA:</text>
            <g>
              {pairs.map((p, i) => (
                <g key={i} style={usePop((T.DAOLY.between as number[])[i] ?? 0, 10)}>
                  <Card x={W / 2 - 470} y={510 + i * 88} w={940} h={74} c={i === 0 ? GREEN : i === 2 ? RED : GOLD} rx={9} thick={2} />
                  <text x={W / 2 - 250} y={555 + i * 88} fontSize={29} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.l}</text>
                  <text x={W / 2} y={555 + i * 88} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>↔</text>
                  <text x={W / 2 + 250} y={555 + i * 88} fontSize={29} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.r}</text>
                </g>
              ))}
            </g>
          </g>
          <Footer label="đứng giữa lòng tham và nỗi sợ · mỗi ngày" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 KET ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={GREEN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KẾT" color={GOLD} />
          <g transform="translate(0, 150)">
            <g style={usePop(T.KET.laugh, 14)}>
              <Card x={W / 2 - 470} y={300} w={940} h={110} c={GREEN} fill={CARD2} thick={2} />
              <text x={W / 2} y={350} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nếu gặp một môi giới vẫn còn…</text>
              <text x={W / 2} y={390} fontSize={34} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mgTextGlow)">CƯỜI được sau nhiều năm 🙂</text>
            </g>
            <g style={usePop(T.KET.dont, 12)}>
              <Card x={W / 2 - 470} y={430} w={940} h={76} c={MUTE} rx={9} thick={1.5} />
              <text x={W / 2} y={478} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={{ textDecoration: "line-through" }}>đừng hỏi "mã nào sẽ tăng"</text>
            </g>
            <g style={usePop(T.KET.askq, 14)}>
              <Card x={W / 2 - 470} y={526} w={940} h={130} c={GOLD} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={576} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hãy hỏi hắn đã vượt qua bao nhiêu thiên kiếp…</text>
              <text x={W / 2} y={620} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mgTextGlow)">mới giữ được ĐẠO TÂM đến hôm nay 🙏</text>
            </g>
            <g style={{ ...usePop(T.KET.follow, 14), transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
              <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 300} y={694} width={600} height={132} rx={18} fill={GREEN} opacity={0.16 + 0.12 * glow} />
                <rect x={W / 2 - 284} y={706} width={568} height={108} rx={12} fill={CARD2} stroke={GREEN} strokeWidth={3} />
                <text x={W / 2} y={776} fontSize={44} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#mgTextGlow)">🔔 THEO DÕI</text>
              </g>
            </g>
            <text x={W / 2} y={890} fontSize={26} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(T.KET.follow + 20, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          </g>
          <Footer label="đừng hỏi mã nào tăng · hỏi đã qua bao thiên kiếp" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const MoiGioiDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("moigioi_dao/voice.mp3")} />
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
