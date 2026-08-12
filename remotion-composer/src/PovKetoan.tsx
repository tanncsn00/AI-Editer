import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_ketoan_beats.json";
import T from "./pov_ketoan_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const BG_RED = "#2A1010";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = ACCENT_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ktgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ktgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ktglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ktscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ktgrid)" />
        <rect width={W} height={H} fill="url(#ktgrid2)" />
        <rect width={W} height={H} fill="url(#ktglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ktscan)" />
        <g stroke={AMBER} strokeWidth={1.5} opacity={0.5}>
          <path d="M 30 30 L 30 60 M 30 30 L 60 30" fill="none" />
          <path d={`M ${W - 30} 30 L ${W - 30} 60 M ${W - 30} 30 L ${W - 60} 30`} fill="none" />
          <path d={`M 30 ${H - 30} L 30 ${H - 60} M 30 ${H - 30} L 60 ${H - 30}`} fill="none" />
          <path d={`M ${W - 30} ${H - 30} L ${W - 30} ${H - 60} M ${W - 30} ${H - 30} L ${W - 60} ${H - 30}`} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.03], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const a1 = useFadeUp(0, 10), a2 = useFade(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g>
      <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.5 * a2} />
      <text x={80} y={180} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="5" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 140} x2={W - 80} y2={H - 140} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={W / 2} y={H - 110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · chốn công sở · blueprint</text>
);
const TechBox: React.FC<{ x: number; y: number; w: number; h: number; color?: string; thick?: number }> = ({ x, y, w, h, color = AMBER, thick = 2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y} x2={x + w + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y + h} x2={x + 6} y2={y + h} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y + h} x2={x + w + 6} y2={y + h} stroke={color} strokeWidth={thick} />
  </g>
);
const Hero: React.FC<{ cy: number; cn: string; en: string; sub?: string; color: string; entry: number }> = ({ cy, cn, en, sub, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 84} width={980} height={168} rx={18} fill={BG_TERM} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy - 28} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      <text x={W / 2} y={cy + 30} fontSize={44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{en}</text>
      {sub && <text x={W / 2} y={cy + 66} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const KiepTag: React.FC<{ y: number; n: string; name: string; entry: number }> = ({ y, n, name, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 430} y={y} width={860} height={100} rx={14} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
      <text x={W / 2} y={y + 42} fontSize={22} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{n}</text>
      <text x={W / 2} y={y + 80} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="00" label="POV · THIÊN LAO DỰ BỊ" />
        <g transform="translate(0, 330)">
        <g style={useFadeUp(8, 12)}>
          <text x={W / 2} y={290} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">🏯 POV: TA LÀ MỘT</text>
          <text x={W / 2} y={372} fontSize={58} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">THIÊN LAO DỰ BỊ</text>
          <text x={W / 2} y={432} fontSize={46} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">CHÂN NHÂN</text>
          <text x={W / 2} y={478} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// Người đời gọi là Kế Toán</text>
        </g>
        <g style={useScaleIn(T.INTRO.gan, 14)}>
          <rect x={W / 2 - 490} y={560} width={980} height={150} rx={18} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={612} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không tự kiếm 1 đồng · không tiêu của mình 1 đồng</text>
          <text x={W / 2} y={668} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng gánh NHÂN QUẢ của mọi đồng tiền 💀</text>
        </g>
        <g style={useScaleIn(T.INTRO.name, 14)}>
          <rect x={W / 2 - 490} y={740} width={980} height={120} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={812} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lúc nào cũng chừa 1 chân… chờ vào THIÊN LAO ⛓️</text>
        </g>
        </g>
        <FigFooter label="kế toán · bậc chân nhân dự bị thiên lao" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="01" label="NHẬP MÔN · NGÂY THƠ" />
        <g transform="translate(0, 330)">
        <text x={W / 2} y={300} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(16, 12)}>ngày mới nhập môn Kế Toán Đạo · cứ ngỡ rất đơn giản:</text>
        <g style={useScaleIn(T.SETUP.naive, 14)}>
          <rect x={W / 2 - 470} y={360} width={940} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={412} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💰 Tiền vào · ghi vào</text>
          <text x={W / 2} y={458} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💸 Tiền ra · ghi ra</text>
          <text x={W / 2} y={498} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>…rồi an nhàn tu luyện 🍵</text>
        </g>
        <g style={useScaleIn(T.SETUP.oath, 14)}>
          <rect x={W / 2 - 490} y={680} width={980} height={150} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={735} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau này mới biết…</text>
          <text x={W / 2} y={795} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mỗi con số = một LỜI THỀ trước Thiên Đạo 💀</text>
        </g>
        </g>
        <FigFooter label="kế toán · mỗi con số là một lời thề" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 K1 · Nhất Đồng Kiếp ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="THIÊN KIẾP ① · NHẤT ĐỒNG" />
        <g transform="translate(0, 330)">
        <KiepTag y={235} n="THIÊN KIẾP ĐẦU TIÊN" name="Nhất Đồng Kiếp" entry={T.K1.kiep} />
        <g style={useScaleIn(T.K1.lech, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={140} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={450} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sổ sách lệch đúng MỘT đồng</text>
          <text x={W / 2} y={500} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người thường: "1 đồng thôi, bỏ qua" · kế toán: KHÔNG 🤨</text>
        </g>
        <g style={useScaleIn(T.K1.why, 14)}>
          <rect x={W / 2 - 480} y={565} width={960} height={150} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={618} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngồi tới 3h sáng · lật từng trang · không phải vì 1 đồng…</text>
          <text x={W / 2} y={672} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà vì: nếu 1 đồng đã sai →</text>
          <text x={W / 2} y={706} fontSize={27} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG biết còn bao nhiêu chỗ sai nữa</text>
        </g>
        <text x={W / 2} y={800} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K1.ngo, 12)}>với kế toán · sai một ly · đi một… BẢN ÁN ⚖️</text>
        </g>
        <FigFooter label="lệch 1 đồng = dấu hiệu của những lỗi chưa thấy" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 K2 · Truyền Âm Mật Chỉ ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="THIÊN KIẾP ② · MẬT CHỈ" />
        <g transform="translate(0, 330)">
        <KiepTag y={235} n="THIÊN KIẾP THỨ HAI" name="Truyền Âm Mật Chỉ" entry={T.K2.kiep} />
        <g style={useScaleIn(T.K2.quote, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={150} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={450} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chưởng môn gọi vào · hạ giọng thật khẽ:</text>
          <text x={W / 2} y={508} fontSize={33} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Khoản này em lo liệu cho khéo. Đừng để lòi ra."</text>
        </g>
        <g style={useScaleIn(T.K2.cuff, 14)}>
          <rect x={W / 2 - 490} y={575} width={980} height={130} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={625} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>6 chữ nhẹ như gió thoảng…</text>
          <text x={W / 2} y={678} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nhưng ta nghe ra tiếng CÒNG SỐ TÁM ⛓️</text>
        </g>
        <text x={W / 2} y={790} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K2.why, 12)}>sếp ăn · ta ký · sếp hưởng · ta gánh 💀</text>
        </g>
        <FigFooter label="vì sao gọi là Thiên Lao Dự Bị" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 K3 · Quyết Toán Đại Kiếp ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ORANGE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="04" label="THIÊN KIẾP ③ · QUYẾT TOÁN" />
        <g transform="translate(0, 330)">
        <KiepTag y={235} n="THIÊN KIẾP THỨ BA · 1 NĂM/LẦN" name="Quyết Toán Đại Kiếp" entry={T.K3.kiep} />
        <g style={useScaleIn(T.K3.contrast, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={170} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={452} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cả tông môn vui Tết 🎉</text>
          <text x={W / 2} y={502} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>riêng kế toán BẾ QUAN · thức trắng 3 đêm</text>
          <text x={W / 2} y={544} fontSize={25} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>sum vầy cùng… cái máy tính và 1 núi hóa đơn 🧾</text>
        </g>
        <g style={useScaleIn(T.K3.ngo, 14)}>
          <rect x={W / 2 - 490} y={620} width={980} height={150} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={675} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>lịch của thiên hạ · có Tết</text>
          <text x={W / 2} y={732} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lịch của kế toán · chỉ có KỲ QUYẾT TOÁN 🤣</text>
        </g>
        </g>
        <FigFooter label="quyết toán · cái Tết không bao giờ trọn vẹn" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 K4 · Đoàn Thanh Tra ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="05" label="THIÊN KIẾP ④ · THANH TRA" />
        <g transform="translate(0, 330)">
        <KiepTag y={235} n="THIÊN KIẾP ĐÁNG SỢ NHẤT" name="Đoàn Thanh Tra" entry={T.K4.kiep} />
        <g style={useScaleIn(T.K4.scene, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={170} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={452} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cả phòng nín thở · không ai dám gõ phím mạnh 😶</text>
          <text x={W / 2} y={505} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>họ lật đúng 1 trang sổ của 3 NĂM TRƯỚC</text>
          <text x={W / 2} y={544} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trang mà chính ta cũng đã quên 🥶</text>
        </g>
        <text x={W / 2} y={650} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useScaleIn(T.K4.scene + 20, 12)}>mồ hôi lạnh chảy dọc sống lưng…</text>
        <g style={useScaleIn(T.K4.ngo, 14)}>
          <rect x={W / 2 - 490} y={700} width={980} height={140} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={778} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nghiệp gieo hôm nay · 3 năm sau thiên đạo mới tới đòi ⚖️</text>
        </g>
        </g>
        <FigFooter label="thanh tra · nghiệp cũ ngủ yên rồi bất chợt thức dậy" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 K5 · Hóa Đơn Đỏ ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="06" label="PHÙ VĂN TỐI THƯỢNG" />
        <g transform="translate(0, 330)">
        <Hero cy={300} cn="Phù Văn Tối Thượng" en="HÓA ĐƠN ĐỎ" sub="// mất 1 tờ = mất 1 mảnh linh hồn" color={WARNING_RED} entry={T.K5.hero} />
        <g style={useScaleIn(T.K5.lost, 14)}>
          <rect x={W / 2 - 480} y={450} width={960} height={130} rx={16} fill={BG_RED} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={502} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>1 tờ bỗng bay đâu mất → lật tung cả động phủ</text>
          <text x={W / 2} y={548} fontSize={29} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>suýt TẨU HỎA NHẬP MA 😵</text>
        </g>
        <g style={useScaleIn(T.K5.found, 14)}>
          <rect x={W / 2 - 480} y={605} width={960} height={110} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={672} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">tìm thấy: kẹp dưới cốc cà phê đồng môn ☕🤣</text>
        </g>
        <text x={W / 2} y={800} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K5.ngo, 12)}>thứ giữ ngươi khỏi thiên lao · đôi khi chỉ là 1 mảnh giấy con 📄</text>
        </g>
        <FigFooter label="chứng từ · mong manh mà định mệnh" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 K6 · cả tông môn tiêu, một mình gánh ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const spend = ["🏷️ Kinh doanh tiêu như nước", "🔥 Marketing đốt tiền như đốt vàng mã"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="AI CŨNG TIÊU · MỘT MÌNH GÁNH" />
          <g transform="translate(0, 330)">
          <g>
            {spend.map((t, i) => (
              <g key={i} style={useScaleIn((T.K6.spend as number[])[i], 11)}>
                <rect x={W / 2 - 470} y={250 + i * 96} width={940} height={80} rx={13} fill={BG_CARD} stroke={[ORANGE, WARNING_RED][i]} strokeWidth={2.5} />
                <text x={W / 2} y={298 + i * 96} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.K6.boss, 14)}>
            <rect x={W / 2 - 480} y={460} width={960} height={110} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={527} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sếp phất tay: "cứ chi đi · có gì kế toán lo" 🙃</text>
          </g>
          <g style={useScaleIn(T.K6.recon, 14)}>
            <rect x={W / 2 - 480} y={600} width={960} height={120} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2} y={652} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cuối tháng · 1 mình đối soát nhân quả cả tông môn</text>
            <text x={W / 2} y={692} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ai cũng tiêu · chỉ mình ta giải trình từng đồng đi đâu</text>
          </g>
          <text x={W / 2} y={800} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K6.ngo, 12)}>kẻ KHÔNG cầm dao · lại là kẻ phải đứng LAU MÁU 🔪</text>
          </g>
          <FigFooter label="kế toán · gánh nhân quả chi tiêu của cả công ty" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING · tier list ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { p: "Hạ phẩm", s: "biết ghi sổ", c: TEXT_SEC },
    { p: "Trung phẩm", s: "biết cân đối", c: ACCENT_BLUE },
    { p: "Thượng phẩm", s: "biết tối ưu", c: JADE },
    { p: "Cực phẩm", s: "ký xong vẫn ngủ ngon 😴", c: AMBER_BRIGHT },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="ĐẠI ĐẠO · CẢNH GIỚI" />
          <g transform="translate(0, 330)">
          <g style={useScaleIn(T.ENDING.truth, 14)}>
            <rect x={W / 2 - 490} y={250} width={980} height={150} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={302} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không kiếm ra tiền · không tiêu tiền</text>
            <text x={W / 2} y={356} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng gánh nhân quả từng đồng người khác xài</text>
          </g>
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.ENDING.tiers as number[])[i], 10)}>
                <rect x={W / 2 - 470} y={450 + i * 86} width={940} height={72} rx={11} fill={i === 3 ? BG_TERM : BG_CARD} stroke={t.c} strokeWidth={i === 3 ? 3 : 2} />
                <text x={W / 2 - 440} y={494 + i * 86} fontSize={27} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.p}</text>
                <text x={W / 2 + 440} y={494 + i * 86} fontSize={27} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.s}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={870} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.ENDING.lost, 12)}>tiếc thay · cảnh giới ấy đã THẤT TRUYỀN 🤣</text>
          </g>
          <FigFooter label="cực phẩm kế toán = ký xong vẫn ngủ ngon (đã thất truyền)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(60, 14);
  const btn = useScaleIn(100, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g transform="translate(0, 150)">
          <g style={ask}>
            <text x={W / 2} y={470} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Muốn nghe POV</text>
            <text x={W / 2} y={525} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nghề nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={655} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇 (Nhân sự? Sale? Bác sĩ?)</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={740} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={752} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={828} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={960} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(140, 12)}>để không bỏ lỡ truyền kỳ chốn công sở 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const PovKetoan: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_ketoan/voice.mp3")} />
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
