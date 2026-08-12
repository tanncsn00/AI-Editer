import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_creator_beats.json";
import T from "./pov_creator_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "11";

// ===== DARK HUD / Sci-Fi FUI palette (ui-ux-pro-max: HUD/Sci-Fi FUI) — cohesive cyan + semantic accents =====
const BG = "#060B14";
const CARD = "#0A1626";
const CARD2 = "#0C1C30";
const INK = "#060B14";
const PINK = "#FF5470";   // RED ALERT (danger)
const PURPLE = "#3E8FE0"; // holo blue (secondary structure)
const CYAN = "#2BE2FF";   // primary HUD cyan
const AMBER = "#FFB347";  // warm emphasis / highlight
const GREEN = "#2EE6C2";  // teal (positive / win)
const TEXT = "#DCEBF7";
const SEC = "#8FB2D0";
const MUTE = "#4F6E90";

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

// Dark HUD / Sci-Fi FUI background — void + tech grid + perspective floor + scan sweep + HUD brackets
const VibrantBG: React.FC<{ a?: string; b?: string }> = ({ a = CYAN, b = CYAN }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 5) % (H + 360)) - 180;
  const vx = W / 2, vy = 760; // vanishing point for perspective floor
  const floorCols = Array.from({ length: 13 }, (_, i) => -6 + i); // -6..6
  const floorRows = [0, 70, 160, 280, 440, 660, 980]; // receding distances
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="cbGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={CYAN} strokeWidth="0.6" opacity="0.05" />
          </pattern>
          <radialGradient id="cbGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.10" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cbScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
            <stop offset="50%" stopColor={CYAN} stopOpacity="0.07" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="cbVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#01030A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#cbGrid)" />
        <rect width={W} height={H} fill="url(#cbGlow)" />
        {/* perspective floor (Tron) lower half */}
        <g stroke={CYAN} strokeWidth={1} opacity={0.16}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {floorRows.map((d, i) => {
            const y = vy + d;
            return <line key={i} x1={0} y1={y} x2={W} y2={y} opacity={0.6 - i * 0.05} />;
          })}
        </g>
        {/* scanline sweep */}
        <rect x={0} y={sweep} width={W} height={150} fill="url(#cbScan)" />
        <rect width={W} height={H} fill="url(#cbVig)" />
        {/* HUD corner brackets */}
        <g stroke={CYAN} strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} />
        </g>
        {/* edge tick markers */}
        <g stroke={CYAN} strokeWidth={1.5} opacity={0.3}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={34} y1={620 + i * 80} x2={48} y2={620 + i * 80} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`r${i}`} x1={W - 34} y1={620 + i * 80} x2={W - 48} y2={620 + i * 80} />
          ))}
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={CYAN} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="cTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="cCardGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#FF2D78" floodOpacity="0.5" />
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
        <text x={W - 108} y={143} fontSize={18} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">REC</text>
        <circle cx={W - 92} cy={136} r={6} fill={PINK} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={CYAN} strokeWidth={1} opacity={0.18} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · chốn nhân gian</text>
  </g>
);
// HUD glass panel with corner brackets
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
const KiepBanner: React.FC<{ y: number; tag: string; name: string; c?: string; entry: number }> = ({ y, tag, name, c = CYAN, entry }) => {
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
      <text x={W / 2} y={y + 44} fontSize={19} fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="5">{tag}</text>
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cTextGlow)">{name}</text>
      <line x1={W / 2 - 90} y1={y + 110} x2={W / 2 + 90} y2={y + 110} stroke={c} strokeWidth={2} opacity={0.7} />
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  const traits = ["👁️ không nhìn thấy", "✋ không cầm được", "💎 không mua bằng linh thạch"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={PURPLE} b={PINK} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="POV · SÁNG TÁC ĐẠO" />
          <g style={useFadeUp(8, 12)}>
            <text x={W / 2} y={470} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">POV: TA LÀ MỘT</text>
            <text x={W / 2} y={566} fontSize={84} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#cTextGlow)" opacity={0.9 + 0.1 * glow}>CONTENT</text>
            <text x={W / 2} y={660} fontSize={84} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" opacity={0.92}>CREATOR</text>
          </g>
          <text x={W / 2} y={760} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade((T.HOOK.hunt as number[])[0] - 4, 10)}>mỗi ngày đi săn một thứ:</text>
          <g>
            {traits.map((t, i) => (
              <g key={i} style={usePop((T.HOOK.hunt as number[])[i] ?? 0, 10)}>
                <Card x={W / 2 - 380} y={800 + i * 92} w={760} h={74} c={[PURPLE, CYAN, AMBER][i]} rx={16} thick={2.5} />
                <text x={W / 2} y={847 + i * 92} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.HOOK.vanish, 16)}>
            <Card x={W / 2 - 470} y={1110} w={940} h={170} c={PINK} fill={CARD2} thick={4} />
            <text x={W / 2} y={1164} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>săn không được nó → tu vi bắt đầu tan biến 💀</text>
            <text x={W / 2} y={1228} fontSize={50} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cTextGlow)">thứ đó: Ý TƯỞNG</text>
          </g>
          <Footer label="con-ten cri-ây-tơ · kẻ đi săn ý tưởng" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const belief = ["🎬 quay vài video", "🗣️ nói vài câu", "📤 đăng lên", "💰 tiền tự chảy về"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={CYAN} b={PURPLE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="NHẬP MÔN" color={CYAN} />
          <g transform="translate(0, 50)">
          <text x={W / 2} y={500} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" opacity={useFade(10, 12)}>người đời thường nói: "làm content sướng nhỉ!" 🤣</text>
          <g>
            {belief.map((t, i) => (
              <g key={i} style={usePop((T.SETUP.belief as number[])[i] ?? 0, 10)}>
                <Card x={W / 2 - 400} y={560 + i * 104} w={800} h={84} c={[PURPLE, CYAN, GREEN, AMBER][i]} rx={18} thick={2.5} />
                <text x={W / 2} y={612 + i * 104} fontSize={31} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.SETUP.truth, 16)}>
            <Card x={W / 2 - 470} y={1010} w={940} h={190} c={PINK} fill={CARD2} thick={4} />
            <text x={W / 2} y={1066} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đến khi đạo tâm tan vỡ, suýt tẩu hỏa nhập ma…</text>
            <text x={W / 2} y={1124} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>khó nhất Sáng Tác Đạo</text>
            <text x={W / 2} y={1172} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">CHƯA BAO GIỜ là quay video</text>
          </g>
          </g>
          <Footer label="ngây thơ · rồi vỡ mộng" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 LINHCAM ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <VibrantBG a={PURPLE} b={PINK} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP ① · LINH CẢM" />
          <g transform="translate(0, 130)">
        <KiepBanner y={460} tag="THIÊN KIẾP ĐẦU TIÊN" name="Linh Cảm Khô Kiệt Kiếp" c={PINK} entry={T.LINHCAM.kiep} />
        <g style={usePop(T.LINHCAM.flow, 14)}>
          <Card x={W / 2 - 470} y={700} w={940} h={170} c={CYAN} thick={3} />
          <text x={W / 2} y={758} fontSize={32} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🌙 3 giờ sáng · ý tưởng tuôn ra như suối</text>
          <text x={W / 2} y={818} fontSize={29} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ghi kín 3 trang giấy… rồi ngủ 😴</text>
        </g>
        <g style={usePop(T.LINHCAM.wtf, 16)}>
          <Card x={W / 2 - 470} y={910} w={940} h={200} c={PINK} fill={CARD2} thick={4} />
          <text x={W / 2} y={968} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sáng hôm sau, mở ra đọc lại…</text>
          <text x={W / 2} y={1032} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">"không hiểu tối qua</text>
          <text x={W / 2} y={1082} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">THẰNG NÀO viết" 🤣</text>
        </g>
        </g>
          <Footer label="ý tưởng lúc nửa đêm · sáng ra thành mật mã" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 THUATTOAN ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <VibrantBG a={CYAN} b={PINK} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP ② · THUẬT TOÁN" color={CYAN} />
          <g transform="translate(0, 140)">
        <KiepBanner y={420} tag="THIÊN KIẾP THỨ HAI" name="Thuật Toán Vô Thường Kiếp" c={CYAN} entry={T.THUATTOAN.kiep} />
        <g style={usePop(T.THUATTOAN.hard, 14)}>
          <Card x={W / 2 - 470} y={650} w={460} h={230} c={MUTE} fill={CARD} thick={3} />
          <text x={W / 2 - 240} y={700} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>làm 3 NGÀY</text>
          <text x={W / 2 - 240} y={736} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>kịch bản·quay·edit·thumbnail·phụ đề</text>
          <text x={W / 2 - 240} y={812} fontSize={56} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>327</text>
          <text x={W / 2 - 240} y={852} fontSize={24} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VIEW 😭</text>
        </g>
        <g style={usePop(T.THUATTOAN.lazy, 14)}>
          <Card x={W / 2 + 10} y={650} w={460} h={230} c={GREEN} fill={CARD2} thick={3.5} />
          <text x={W / 2 + 240} y={700} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>quay BỪA lúc ăn cơm</text>
          <text x={W / 2 + 240} y={736} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>không mic · không đèn · không edit</text>
          <text x={W / 2 + 240} y={814} fontSize={50} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} filter="url(#cTextGlow)">3.000.000</text>
          <text x={W / 2 + 240} y={852} fontSize={24} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VIEW 🤯</text>
        </g>
        <g style={usePop(T.THUATTOAN.ngo, 16)}>
          <Card x={W / 2 - 470} y={920} w={940} h={150} c={AMBER} fill={CARD2} thick={4} />
          <text x={W / 2} y={978} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cTextGlow)">Thuật Toán = THIÊN CƠ</text>
          <text x={W / 2} y={1030} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phải nhân loại muốn hiểu là hiểu</text>
        </g>
        </g>
          <Footer label="cày 3 ngày thua quay bừa 1 phút" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 BINHLUAN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <VibrantBG a={PINK} b={PURPLE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP ③ · BÌNH LUẬN" />
          <g transform="translate(0, 130)">
        <KiepBanner y={500} tag="THIÊN KIẾP THỨ BA" name="Bình Luận Tâm Ma Kiếp" c={PURPLE} entry={T.BINHLUAN.kiep} />
        <g style={usePop(T.BINHLUAN.praise, 14)}>
          <Card x={W / 2 - 470} y={740} w={450} h={150} c={GREEN} thick={3} />
          <text x={W / 2 - 245} y={800} fontSize={54} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>1000</text>
          <text x={W / 2 - 245} y={848} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người KHEN 👍</text>
          <Card x={W / 2 + 20} y={740} w={450} h={150} c={PINK} fill={CARD2} thick={4} />
          <text x={W / 2 + 245} y={800} fontSize={54} fill={PINK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} filter="url(#cTextGlow)">1</text>
          <text x={W / 2 + 245} y={848} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"content nhảm" 💀</text>
        </g>
        <g style={usePop(T.BINHLUAN.focus, 16)}>
          <Card x={W / 2 - 470} y={930} w={940} h={150} c={AMBER} fill={CARD2} thick={4} />
          <text x={W / 2} y={988} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đạo tâm lập tức…</text>
          <text x={W / 2} y={1042} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">chỉ nhìn thấy ĐÚNG một dòng đó 🤡</text>
        </g>
        </g>
          <Footer label="ngàn lời khen không cứu nổi một lời chê" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 VIDEONUA ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const demand = ["\"ra phần 2 đi!\"", "\"ra phần 3 đi!\"", "\"làm series đi!\""];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={AMBER} b={PINK} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP ④ · MỘT VIDEO NỮA" color={AMBER} />
          <g transform="translate(0, 110)">
          <KiepBanner y={440} tag="THIÊN KIẾP THỨ TƯ" name="Một Video Nữa Đi Kiếp" c={AMBER} entry={T.VIDEONUA.kiep} />
          <g>
            {demand.map((t, i) => (
              <g key={i} style={usePop((T.VIDEONUA.demand as number[])[i] ?? 0, 10)}>
                <Card x={W / 2 - 360 + i * 12} y={670 + i * 80} w={720} h={64} c={[CYAN, PURPLE, GREEN][i]} rx={16} thick={2.5} />
                <text x={W / 2} y={711 + i * 80} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.VIDEONUA.capcut, 16)}>
            <Card x={W / 2 - 470} y={940} w={940} h={190} c={PINK} fill={CARD2} thick={4} />
            <text x={W / 2} y={996} fontSize={29} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta vô cùng cảm động → mở CapCut</text>
            <text x={W / 2} y={1058} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhìn timeline…</text>
            <text x={W / 2} y={1106} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">3 TIẾNG · chưa cắt xong 🫠</text>
          </g>
          </g>
          <Footer label="khán giả đòi phần 2 · timeline còn chưa render phần 1" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 NGHIHO ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const asks = ["\"viết hộ tao kịch bản\"", "\"quay hộ tao\"", "\"edit hộ tao\"", "\"làm hộ cái thumbnail\"", "\"làm hộ luôn cái kênh\""];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={PURPLE} b={CYAN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP ⑤ · ĐẠO HỮU NGHĨ HỘ" />
          <g transform="translate(0, 80)">
          <KiepBanner y={360} tag="THIÊN KIẾP THỨ NĂM" name="Đạo Hữu Nghĩ Hộ Ta Kiếp" c={CYAN} entry={T.NGHIHO.kiep} />
          <text x={W / 2} y={580} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(T.NGHIHO.kiep + 8, 10)}>"làm video dễ mà · ý tưởng thiếu gì · AI làm hết rồi" 🙄</text>
          <g>
            {asks.map((t, i) => (
              <g key={i} style={usePop((T.NGHIHO.asks as number[])[i] ?? 0, 8)}>
                <Card x={W / 2 - 430} y={615 + i * 78} w={860} h={64} c={PINK} fill={CARD} rx={15} thick={2.5} />
                <text x={W / 2} y={656 + i * 78} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.NGHIHO.ngo, 16)}>
            <Card x={W / 2 - 470} y={1030} w={940} h={150} c={AMBER} fill={CARD2} thick={4} />
            <text x={W / 2} y={1086} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trong mắt người ngoài, Content Creator =</text>
            <text x={W / 2} y={1140} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">người biết dùng ChatGPT 💀</text>
          </g>
          </g>
          <Footer label="ai cũng tưởng dễ · tới khi tự làm thử" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TRONGRONG ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const ready = ["timeline mở sẵn", "máy quay mở sẵn", "micro mở sẵn", "CapCut mở sẵn"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={PINK} b={PURPLE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="THIÊN KIẾP LỚN NHẤT" />
          <g transform="translate(0, 140)">
          <g style={useFadeUp(T.TRONGRONG.notalg, 12)}>
            <text x={W / 2} y={470} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phải Thuật Toán · cũng không phải anti-fan…</text>
            <text x={W / 2} y={520} fontSize={31} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">mà là ngồi trước màn hình SUỐT 8 CANH GIỜ 🪑</text>
          </g>
          <g>
            {ready.map((t, i) => (
              <g key={i} style={usePop((T.TRONGRONG.ready as number[])[i] ?? 0, 9)}>
                <Card x={W / 2 - 460 + (i % 2) * 480} y={580 + Math.floor(i / 2) * 100} w={440} h={80} c={[CYAN, PURPLE, GREEN, AMBER][i]} rx={16} thick={2.5} />
                <text x={W / 2 - 240 + (i % 2) * 480} y={628 + Math.floor(i / 2) * 100} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✅ {t}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.TRONGRONG.empty, 18)}>
            <rect x={W / 2 - 472} y={829} width={944} height={224} rx={26} fill={PINK} opacity={0.18} />
            <Card x={W / 2 - 470} y={830} w={940} h={220} c={PINK} fill={CARD2} thick={4.5} />
            <text x={W / 2} y={910} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng trong đầu…</text>
            <text x={W / 2} y={980} fontSize={64} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cTextGlow)">TRỐNG RỖNG</text>
            <text x={W / 2} y={1028} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">ý tưởng · một cái cũng không có 🌀</text>
          </g>
          </g>
          <Footer label="mọi thứ sẵn sàng · trừ cái đầu" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 DAOLY ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={CYAN} b={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="ĐẠO LÝ" color={CYAN} />
          <g transform="translate(0, 120)">
          <text x={W / 2} y={520} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(10, 12)}>sau nhiều năm hành tẩu, ta cuối cùng ngộ ra:</text>
          <g style={usePop(T.DAOLY.notsell, 13)}>
            <text x={W / 2} y={610} fontSize={32} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">không phải nghề bán video</text>
          </g>
          <g style={usePop(T.DAOLY.attention, 16)}>
            <Card x={W / 2 - 480} y={650} w={960} h={170} c={AMBER} fill={CARD2} thick={4.5} />
            <text x={W / 2} y={712} fontSize={32} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mà là nghề…</text>
            <text x={W / 2} y={780} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cTextGlow)" opacity={0.9 + 0.1 * glow}>BÁN SỰ CHÚ Ý</text>
          </g>
          <g style={usePop(T.DAOLY.forget, 14)}>
            <Card x={W / 2 - 470} y={860} w={940} h={200} c={PINK} fill={CARD} thick={3.5} />
            <text x={W / 2} y={920} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi ngày tranh đoạt với HÀNG TRIỆU video khác</text>
            <text x={W / 2} y={978} fontSize={29} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hôm nay ngươi không xuất hiện…</text>
            <text x={W / 2} y={1028} fontSize={33} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">ngày mai · thiên hạ đã quên ngươi 💀</text>
          </g>
          </g>
          <Footer label="bán sự chú ý · thứ khan hiếm nhất thời đại" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 TIER ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { p: "🥉 Hạ phẩm", s: "biết QUAY", c: SEC },
    { p: "🥈 Trung phẩm", s: "biết EDIT", c: CYAN },
    { p: "🥇 Thượng phẩm", s: "biết KỂ CHUYỆN", c: PURPLE },
    { p: "🔥 Cực phẩm", s: "khiến người KHÔNG THỂ LƯỚT QUA", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={PURPLE} b={PINK} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="CẢNH GIỚI SÁNG TÁC ĐẠO" color={AMBER} />
          <g transform="translate(0, 110)">
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={usePop((T.TIER.tiers as number[])[i] ?? 0, 11)}>
                <Card x={W / 2 - 470} y={500 + i * 108} w={940} h={88} c={t.c} fill={i === 3 ? CARD2 : CARD} thick={i === 3 ? 4 : 2.5} rx={18} />
                <text x={W / 2 - 430} y={552 + i * 108} fontSize={30} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{t.p}</text>
                <text x={W / 2 + 430} y={552 + i * 108} fontSize={i === 3 ? 24 : 27} fill={TEXT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.s}</text>
              </g>
            ))}
          </g>
          <g style={usePop(T.TIER.daotam, 16)}>
            <Card x={W / 2 - 480} y={985} w={960} h={150} c={PINK} fill={CARD2} thick={4} />
            <text x={W / 2} y={1043} fontSize={29} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cảnh giới ấy KHÔNG nằm trong thuật toán</text>
            <text x={W / 2} y={1097} fontSize={38} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#cTextGlow)">mà nằm trong ĐẠO TÂM ✨</text>
          </g>
          </g>
          <Footer label="cực phẩm = khiến người không thể lướt qua" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 CTA ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(52, 14);
  const btn = usePop(92, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <VibrantBG a={PINK} b={CYAN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={620} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi ở cảnh giới nào</text>
            <text x={W / 2} y={676} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>của Sáng Tác Đạo?</text>
            <text x={W / 2} y={742} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">từng ngồi 8 canh giờ mà ý tưởng = 0 chưa? 🌀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={862} fontSize={30} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 1010px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 1010px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={940} width={620} height={146} rx={20} fill={CYAN} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={952} width={584} height={122} rx={14} fill={CARD2} stroke={CYAN} strokeWidth={3} />
              <text x={W / 2} y={1032} fontSize={48} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#cTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1170} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(128, 12)}>nghe tiếp truyền kỳ chốn nhân gian ✦</text>
          <Footer label="theo dõi · đừng để thiên hạ quên ngươi" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

export const PovCreator: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("pov_creator/voice.mp3")} />
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
