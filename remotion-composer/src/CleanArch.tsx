import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./clean_arch_beats.json";
import T from "./clean_arch_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "12";

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
          <pattern id="cagrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="cagrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="caglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cascan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cagrid)" />
        <rect width={W} height={H} fill="url(#cagrid2)" />
        <rect width={W} height={H} fill="url(#caglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#cascan)" />
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
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · giới IT · blueprint</text>
);

// Pillar header: số cột + tên Hán-Việt + reveal English principle
const Pillar: React.FC<{ cy: number; col: string; cn: string; en: string; entry: number; heart?: boolean }> = ({ cy, col, cn, en, entry, heart }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 84} width={980} height={168} rx={18} fill={BG_TERM} stroke={heart ? WARNING_RED : AMBER} strokeWidth={4} />
      <text x={W / 2} y={cy - 40} fontSize={20} fill={heart ? WARNING_RED : AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">{col}</text>
      <text x={W / 2} y={cy + 6} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>《{cn}》</text>
      <text x={W / 2} y={cy + 56} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// {en}</text>
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  const powers = ["🗄️ đổi Database", "🧩 đổi Framework", "🎨 đổi UI", "👤 thay người giữ Tàng Kinh Các"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="SOFTWARE ĐẠO · ĐẠI TRẬN TỐI THƯỢNG" />
          <g transform="translate(0, 300)">
          <text x={W / 2} y={250} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(8, 12)}>một đại trận được xem là tuyệt học tối thượng — tương truyền:</text>
          <g>
            {powers.map((t, i) => (
              <g key={i} style={useScaleIn((T.HOOK.powers as number[])[i], 9)}>
                <rect x={W / 2 - 460} y={290 + i * 78} width={920} height={64} rx={11} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                <text x={W / 2} y={331 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.HOOK.name, 16)}>
            <rect x={W / 2 - 490} y={620} width={980} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={5} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={672} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà NGHIỆP VỤ vẫn bất động như núi 😳</text>
            <text x={W / 2} y={740} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">CLEAN ARCHITECTURE</text>
          </g>
          </g>
          <FigFooter label="đổi mọi thứ · nghiệp vụ vẫn bất động như núi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const layers = ["Controller", "Use Case", "Repository", "Infrastructure"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="TÂN NHÂN · TẨU HỎA NHẬP MA" />
          <g transform="translate(0, 300)">
          <g style={useScaleIn(T.SETUP.diagram, 13)}>
            {layers.map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 230} y={235 + i * 92} width={460} height={68} rx={11} fill={BG_CARD} stroke={[ACCENT_BLUE, AMBER, JADE, TEXT_MUTE][i]} strokeWidth={2.5} />
                <text x={W / 2} y={278 + i * 92} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
                {i < 3 && <text x={W / 2} y={318 + i * 92} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">↓</text>}
              </g>
            ))}
          </g>
          <text x={W / 2} y={650} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade(T.SETUP.diagram + 12, 10)}>"ta nhìn sơ đồ · sơ đồ nhìn lại ta" 🤣</text>
          <g style={useScaleIn(T.SETUP.ngo, 14)}>
            <rect x={W / 2 - 490} y={690} width={980} height={150} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={742} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngộ ra: Clean Architecture chưa từng là công pháp</text>
            <text x={W / 2} y={800} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ là ĐẠI TRẬN dựng từ Ngũ Đại Pháp Tắc — SOLID 🔥</text>
          </g>
          </g>
          <FigFooter label="Clean Architecture = đại trận dựng từ SOLID" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 SRP ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const roles = ["Controller → chỉ nhận request", "Use Case → chỉ xử lý nghiệp vụ", "Repository → chỉ lấy dữ liệu"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="CỘT TRỤ ① · ĐƠN TÂM" />
          <g transform="translate(0, 300)">
          <Pillar cy={270} col="CỘT TRỤ THỨ NHẤT" cn="Đơn Tâm Đạo" en="Single Responsibility" entry={T.SRP.pillar} />
          <g>
            {roles.map((t, i) => (
              <g key={i} style={useScaleIn((T.SRP.roles as number[])[i], 9)}>
                <rect x={W / 2 - 460} y={400 + i * 76} width={920} height={64} rx={11} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={441 + i * 76} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.SRP.buffalo, 14)}>
            <rect x={W / 2 - 490} y={650} width={980} height={170} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={700} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1 class ôm hết: thanh toán + email + log + upload</text>
            <text x={W / 2} y={744} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ không phải tu sĩ · mà là TRÂU NGỰA 🐃</text>
            <text x={W / 2} y={790} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sửa email · thanh toán cũng NỔ 💥 — khe nứt đầu tiên</text>
          </g>
          </g>
          <FigFooter label="Single Responsibility · mỗi class một bổn phận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 OCP ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="CỘT TRỤ ② · DIỄN SINH" />
        <g transform="translate(0, 300)">
        <Pillar cy={270} col="CỘT TRỤ THỨ HAI" cn="Vạn Pháp Diễn Sinh" en="Open – Closed Principle" entry={T.OCP.pillar} />
        <g style={useScaleIn(T.OCP.problem, 14)}>
          <rect x={W / 2 - 490} y={400} width={980} height={150} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={452} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>bỏ MySQL → đổi PostgreSQL</text>
          <text x={W / 2} y={508} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà Use Case cũng phải sửa → ĐẠI TRẬN THẤT BẠI 💀</text>
        </g>
        <g style={useScaleIn(T.OCP.rule, 14)}>
          <rect x={W / 2 - 490} y={580} width={980} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={632} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ thay kẻ giữ Tàng Kinh Các · không động đạo pháp bên trong</text>
          <text x={W / 2} y={690} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>MỞ cửa cho cái mới ✅</text>
          <text x={W / 2} y={730} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐÓNG cửa với việc mổ bụng cái cũ ⛔</text>
        </g>
        </g>
        <FigFooter label="Open–Closed · thêm bằng viết thêm, không sửa cái cũ" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 LSP ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const keepers = ["MySQL ✅", "PostgreSQL ✅", "SQL Server ✅"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="CỘT TRỤ ③ · TRUYỀN THỪA" />
          <g transform="translate(0, 300)">
          <Pillar cy={270} col="CỘT TRỤ THỨ BA" cn="Truyền Thừa Đạo" en="Liskov Substitution" entry={T.LSP.pillar} />
          <g style={useScaleIn(T.LSP.vow, 13)}>
            <text x={W / 2} y={420} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Repository là một LỜI THỀ · ai cũng phải giữ được:</text>
            {keepers.map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 470 + i * 320} y={450} width={290} height={70} rx={11} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2 - 325 + i * 320} y={494} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.LSP.betray, 14)}>
            <rect x={W / 2 - 490} y={580} width={980} height={170} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={645} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đổi người → mà đại trận SỤP</text>
            <text x={W / 2} y={705} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không phải truyền thừa · mà là PHẢN TÔNG 🗡️</text>
          </g>
          </g>
          <FigFooter label="Liskov · con thay cha mà thiên hạ không nhận ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 ISP ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const burden = ["Upload Image", "Export Excel", "Print PDF", "Gửi SMS"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="CỘT TRỤ ④ · KHẾ ƯỚC" />
          <g transform="translate(0, 300)">
          <Pillar cy={270} col="CỘT TRỤ THỨ TƯ" cn="Khế Ước Đạo" en="Interface Segregation" entry={T.ISP.pillar} />
          <text x={W / 2} y={420} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(T.ISP.pillar + 10, 10)}>tìm một người · đừng bắt hắn học LUÔN:</text>
          <g>
            {burden.map((t, i) => (
              <g key={i} style={useScaleIn((T.ISP.burden as number[])[i], 8)}>
                <rect x={W / 2 - 460 + (i % 2) * 480} y={450 + Math.floor(i / 2) * 84} width={450} height={68} rx={11} fill={BG_RED} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2 - 235 + (i % 2) * 480} y={493 + Math.floor(i / 2) * 84} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t} ❌</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.ISP.rule, 14)}>
            <rect x={W / 2 - 490} y={650} width={980} height={120} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={722} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lời thề càng NHỎ · càng ít nghiệp lực, ít nhân quả 🪶</text>
          </g>
          </g>
          <FigFooter label="Interface Segregation · chẻ interface to thành nhiều cái nhỏ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DIP ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const blind = ["không biết MySQL là ai", "không biết Redis là ai", "không biết Mongo là ai"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="CỘT TRỤ ⑤ · VÔ TƯỚNG · TRÁI TIM" />
          <g transform="translate(0, 300)">
          <Pillar cy={262} col="CỘT TRỤ CUỐI · TRÁI TIM ĐẠI TRẬN" cn="Vô Tướng Đạo" en="Dependency Inversion" entry={T.DIP.pillar} heart />
          <g>
            {blind.map((t, i) => (
              <g key={i} style={useScaleIn((T.DIP.blind as number[])[i], 9)}>
                <rect x={W / 2 - 440} y={395 + i * 72} width={880} height={60} rx={11} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
                <text x={W / 2} y={433 + i * 72} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Use Case · {t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.DIP.vohinh, 14)}>
            <rect x={W / 2 - 490} y={630} width={980} height={190} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={682} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nó chỉ biết MỘT lời thề ·</text>
            <text x={W / 2} y={726} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ai giữ đúng lời thề → đều thành người giữ Tàng Kinh Các</text>
            <text x={W / 2} y={782} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">VÔ TƯỚNG — thấy hình mà không chấp hình 🧘</text>
          </g>
          </g>
          <FigFooter label="Dependency Inversion · cùng dựa vào trừu tượng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 NHINLAI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const recap = ["Controller → không chứa nghiệp vụ", "Use Case → không biết Database", "Repository → chỉ là lời thề", "Infrastructure → thay sao cũng được"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="NHÌN LẠI ĐẠI TRẬN" />
          <g transform="translate(0, 300)">
          <g style={useScaleIn(T.NHINLAI.recap, 13)}>
            {recap.map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 470} y={250 + i * 84} width={940} height={68} rx={11} fill={BG_CARD} stroke={[ACCENT_BLUE, AMBER, JADE, TEXT_MUTE][i]} strokeWidth={2.5} />
                <text x={W / 2} y={293 + i * 84} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.NHINLAI.bind, 15)}>
            <rect x={W / 2 - 490} y={620} width={980} height={200} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
            <text x={W / 2} y={682} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mọi thứ LIÊN KẾT với nhau</text>
            <text x={W / 2} y={732} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>nhưng không ai TRÓI BUỘC ai</text>
            <text x={W / 2} y={788} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">đó · mới là điều đáng sợ nhất 😳</text>
          </g>
          </g>
          <FigFooter label="liên kết mà không trói buộc · decoupling" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 CHONGTHEM ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const items = [
    { n: "CQRS", d: "tách đọc · tách ghi", c: ACCENT_BLUE },
    { n: "Domain Driven Design", d: "phân lãnh địa theo nghiệp vụ", c: JADE },
    { n: "Hexagonal Architecture", d: "phong bế mọi ngoại đạo", c: VIOLET },
    { n: "Event Driven", d: "lấy nhân quả làm cầu nối", c: ORANGE },
    { n: "Microservice", d: "một tông môn hóa vạn phân thân", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="VÔ SỐ ĐẠI TRẬN CHỒNG THÊM" />
          <g transform="translate(0, 280)">
          <text x={W / 2} y={210} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade(T.CHONGTHEM.intro, 12)}>đừng tưởng xong Clean là phi thăng — còn chồng thêm:</text>
          <g>
            {items.map((t, i) => (
              <g key={i} style={useScaleIn((T.CHONGTHEM.items as number[])[i], 9)}>
                <rect x={W / 2 - 470} y={250 + i * 84} width={940} height={70} rx={11} fill={BG_CARD} stroke={t.c} strokeWidth={2.5} />
                <text x={W / 2 - 440} y={294 + i * 84} fontSize={28} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{t.n}</text>
                <text x={W / 2 + 440} y={294 + i * 84} fontSize={24} fill={TEXT_SEC} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{t.d}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.CHONGTHEM.base, 14)}>
            <rect x={W / 2 - 490} y={690} width={980} height={110} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={758} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tất cả xây trên nền móng NGŨ ĐẠI PHÁP TẮC 🔥</text>
          </g>
          </g>
          <FigFooter label="CQRS · DDD · Hexagonal · Event · Microservice" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 DAOLY ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="ĐẠO LÝ · TRĂM NĂM" />
          <g transform="translate(0, 300)">
          <g style={useScaleIn(T.DAOLY.learn, 13)}>
            <rect x={W / 2 - 480} y={245} width={960} height={130} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={295} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhiều người học SOLID · không biết dùng ở đâu</text>
            <text x={W / 2} y={345} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vẽ Clean Architecture · không biết vì sao đứng vững</text>
          </g>
          <g style={useScaleIn(T.DAOLY.reveal, 15)}>
            <rect x={W / 2 - 490} y={400} width={980} height={160} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={5} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={458} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>SOLID = 5 CÂY CỘT</text>
            <text x={W / 2} y={518} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Clean Architecture = ĐẠI TRẬN</text>
          </g>
          <g style={useScaleIn(T.DAOLY.collapse, 14)}>
            <rect x={W / 2 - 490} y={590} width={980} height={170} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={645} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thiếu một cây cột · đại trận vẫn dựng được</text>
            <text x={W / 2} y={705} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đến ngày YÊU CẦU THAY ĐỔI kéo tới…</text>
            <text x={W / 2} y={745} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>nó tự mình SỤP XUỐNG 💀</text>
          </g>
          </g>
          <FigFooter label="thiếu cột · gặp thay đổi là sụp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 TIER ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { p: "🥉 Hạ phẩm Dev", s: "viết code CHẠY", c: TEXT_SEC },
    { p: "🥈 Trung phẩm", s: "viết code DỄ SỬA", c: ACCENT_BLUE },
    { p: "🥇 Thượng phẩm", s: "dựng đại trận CLEAN", c: JADE },
    { p: "🔥 Cực phẩm", s: "đọc lại sau 3 năm không bị nguyền rủa", c: AMBER_BRIGHT },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="CẢNH GIỚI DEV" />
          <g transform="translate(0, 310)">
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.TIER.tiers as number[])[i], 10)}>
                <rect x={W / 2 - 480} y={250 + i * 96} width={960} height={80} rx={12} fill={i === 3 ? BG_TERM : BG_CARD} stroke={t.c} strokeWidth={i === 3 ? 3.5 : 2.5} />
                <text x={W / 2 - 450} y={290 + i * 96} fontSize={27} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{t.p}</text>
                <text x={W / 2 + 450} y={290 + i * 96} fontSize={i === 3 ? 21 : 25} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.s}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={690} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(T.TIER.lost - 6, 10)}>cực phẩm = để người khác đọc code mình sau 3 năm mà không nguyền rủa tổ tiên 😇</text>
          <text x={W / 2} y={745} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.TIER.lost, 12)}>tiếc thay · cảnh giới ấy đã THẤT TRUYỀN 💀</text>
          </g>
          <FigFooter label="cực phẩm Dev · đã thất truyền từ thượng cổ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(54, 14);
  const btn = useScaleIn(96, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g transform="translate(0, 150)">
          <g style={ask}>
            <text x={W / 2} y={450} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi ở cảnh giới nào?</text>
            <text x={W / 2} y={510} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">đã dựng đại trận Clean · hay vẫn gánh 1 class TRÂU NGỰA? 🐃</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 630px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={645} fontSize={29} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 đại trận nào tiếp — DDD hay Microservice? 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={730} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={742} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={818} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={950} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(132, 12)}>nghe tiếp truyền kỳ giới IT 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export const CleanArch: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("clean_arch/voice.mp3")} />
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
