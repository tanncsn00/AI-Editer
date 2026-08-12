import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_devops_beats.json";
import T from "./pov_devops_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "14";

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
          <pattern id="pdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="pdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="pdglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#pdgrid)" />
        <rect width={W} height={H} fill="url(#pdgrid2)" />
        <rect width={W} height={H} fill="url(#pdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#pdscan)" />
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
const TechBox: React.FC<{ x: number; y: number; w: number; h: number; color?: string; thick?: number }> = ({ x, y, w, h, color = AMBER, thick = 2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y} x2={x + w + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y + h} x2={x + 6} y2={y + h} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y + h} x2={x + w + 6} y2={y + h} stroke={color} strokeWidth={thick} />
  </g>
);
// Hero: cn = tên công pháp (cultivation) · en = tên lớn · sub = tech term thật
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
// KiepTag: nhãn thiên kiếp (vấn đề) màu đỏ
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
        <SectionHeader num="00" label="POV · TRẬN PHÁP SƯ" />
        <g transform="translate(0, 330)">
        <g style={useFadeUp(8, 12)}>
          <text x={W / 2} y={300} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="3">🏯 POV: TA LÀ MỘT</text>
          <text x={W / 2} y={385} fontSize={76} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">TRẬN PHÁP SƯ</text>
          <text x={W / 2} y={435} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// Người đời gọi là DevOps</text>
        </g>
        <g style={useScaleIn(T.INTRO.invisible, 14)}>
          <rect x={W / 2 - 480} y={520} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={570} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khi đại trận vận hành trơn tru:</text>
          <text x={W / 2} y={612} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không ai nhớ tới bọn họ 🫥</text>
        </g>
        <g style={useScaleIn(T.INTRO.summon, 14)}>
          <rect x={W / 2 - 490} y={680} width={980} height={150} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={735} fontSize={29} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng đại trận vừa DỊ BIẾN:</text>
          <text x={W / 2} y={795} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">toàn tam giới đồng loạt GỌI TÊN 💀💀💀</text>
        </g>
        </g>
        <FigFooter label="trong giới tu chân · gọi là Trận Pháp Sư" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const naive = ["🖥️ dựng vài cái server", "📦 deploy vài bộ công pháp", "🍵 rồi an nhàn tu luyện"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="NHẬP MÔN · NGÂY THƠ" />
          <g transform="translate(0, 330)">
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(16, 12)}>ngày mới nhập môn Trận Pháp Đạo · cứ ngỡ rất đơn giản:</text>
          <g>
            {naive.map((t, i) => (
              <g key={i} style={useScaleIn((T.SETUP.naive as number[])[i], 11)}>
                <rect x={W / 2 - 430} y={360 + i * 92} width={860} height={76} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={407 + i * 92} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.SETUP.kiep, 14)}>
            <rect x={W / 2 - 490} y={690} width={980} height={150} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
            <text x={W / 2} y={745} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau này mới biết…</text>
            <text x={W / 2} y={805} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mỗi lần DEPLOY = một lần ĐỘ KIẾP 💀</text>
          </g>
          </g>
          <FigFooter label="DevOps · mỗi deploy là một lần độ kiếp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 K1A · Loạn Cảnh Kiếp ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="THIÊN KIẾP ① · LOẠN CẢNH" />
        <g transform="translate(0, 330)">
        <KiepTag y={250} n="THIÊN KIẾP ĐẦU TIÊN" name="Loạn Cảnh Kiếp" entry={T.K1A.kiep} />
        <g style={useScaleIn(T.K1A.quote, 14)}>
          <rect x={W / 2 - 480} y={420} width={960} height={150} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={470} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Kiếm Tu Backend xuất quan · vô cùng tự tin:</text>
          <text x={W / 2} y={528} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Trên máy ta chạy rất tốt" 🤣</text>
        </g>
        <text x={W / 2} y={650} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.K1A.tin, 12)}>Ta tin. Toàn bộ tông môn đều tin. → đưa vào đại trận</text>
        <g style={useScaleIn(T.K1A.boom, 14)}>
          <rect x={W / 2 - 490} y={700} width={980} height={140} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={788} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💥 PRODUCTION nổ tung tại chỗ</text>
        </g>
        </g>
        <FigFooter label="'máy tao chạy được' · lời nguyền dối trá nhất" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 K1B · Vạn Cảnh Quy Nhất = Docker ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="CÔNG PHÁP ① · DOCKER" />
        <g transform="translate(0, 330)">
        <g style={useFadeUp(10, 12)}>
          <text x={W / 2} y={250} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cả hai kinh hãi · ngài buông một câu TIÊN NGÔN:</text>
        </g>
        <g style={useScaleIn(T.K1B.prophecy, 14)}>
          <rect x={W / 2 - 470} y={280} width={940} height={96} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={338} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Ơ… trên máy ta vẫn chạy mà" 💀</text>
        </g>
        <Hero cy={500} cn="Vạn Cảnh Quy Nhất Đạo" en="DOCKER" sub="// đóng gói càn khôn vào 1 hồ lô" color={AMBER} entry={T.K1B.hero} />
        <g style={useScaleIn(T.K1B.seal, 14)}>
          <rect x={W / 2 - 480} y={630} width={960} height={96} rx={14} fill={BG_TERM} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={678} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Dev · Test · Production → phong ấn cùng 1 hồ lô 🏺</text>
        </g>
        <text x={W / 2} y={800} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K1B.hunt, 12)}>ai còn nói "máy ta chạy được" → bị thiên hạ TRUY SÁT 🤣</text>
        </g>
        <FigFooter label="Docker · môi trường y hệt trên mọi máy" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 K2A · Nhân Thủ Kiếp ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="04" label="THIÊN KIẾP ② · NHÂN THỦ" />
        <g transform="translate(0, 330)">
        <KiepTag y={240} n="THIÊN KIẾP THỨ HAI" name="Nhân Thủ Kiếp" entry={T.K2A.kiep} />
        <g style={useScaleIn(T.K2A.manual, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={140} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={448} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi lần deploy · trưởng lão đứng trước terminal:</text>
          <text x={W / 2} y={500} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>gõ chú ngữ · copy phù văn · chỉnh từng dòng config</text>
        </g>
        <g style={useScaleIn(T.K2A.typo, 14)}>
          <rect x={W / 2 - 490} y={570} width={980} height={150} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={620} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nửa đêm · gõ 100 câu lệnh · sai đúng 1 ký tự</text>
          <text x={W / 2} y={680} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ PRODUCTION trực tiếp phi thăng 💀</text>
        </g>
        <text x={W / 2} y={800} fontSize={31} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.K2A.culprit, 12)}>không biết trách ai · hung thủ chính là NGÓN TAY của ta 🫣</text>
        </g>
        <FigFooter label="deploy thủ công · sai 1 ký tự là độ kiếp" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 K2B · Tự Động Luân Hồi = CI/CD ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const gates = ["Build", "Test", "Scan", "Review"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="CÔNG PHÁP ② · CI/CD" />
          <g transform="translate(0, 330)">
          <Hero cy={290} cn="Tự Động Luân Hồi Trận" en="CI / CD" sub="// code tự vượt khảo nghiệm" color={JADE} entry={T.K2B.hero} />
          <text x={W / 2} y={440} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(T.K2B.gateintro, 10)}>code muốn vào Production Giới · phải qua từng cửa ải:</text>
          {gates.map((t, i) => (
            <g key={i} style={useScaleIn((T.K2B.gates as number[])[i], 9)}>
              <rect x={70 + i * 240} y={470} width={210} height={70} rx={11} fill={BG_CARD} stroke={[VIOLET, JADE, ACCENT_BLUE, AMBER][i]} strokeWidth={2.5} />
              <text x={175 + i * 240} y={514} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
            </g>
          ))}
          <text x={W / 2} y={605} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useScaleIn(T.K2B.phongsat, 12)}>sai 1 bước → trận pháp PHONG SÁT · cấm tiến nửa bước ⛔</text>
          <g style={useScaleIn(T.K2B.truth, 14)}>
            <rect x={W / 2 - 490} y={680} width={980} height={160} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={730} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người sai · máy cũng sai · nhưng máy móc…</text>
            <text x={W / 2} y={790} fontSize={33} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ít nhất phạm CÙNG MỘT sai lầm mỗi lần 🤣</text>
          </g>
          </g>
          <FigFooter label="CI/CD · pipeline tự động chặn lỗi trước prod" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 K3A · Thiên Nhãn Kiếp ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const know = ["Khách hàng biết", "PM biết", "CEO biết"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THIÊN KIẾP ③ · THIÊN NHÃN" />
          <g transform="translate(0, 330)">
          <KiepTag y={220} n="THIÊN KIẾP THỨ BA" name="Thiên Nhãn Kiếp" entry={T.K3A.kiep} />
          <g style={useScaleIn(T.K3A.leave, 13)}>
            <rect x={W / 2 - 480} y={370} width={960} height={120} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={418} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>CPU · Memory · Request → đều BÌNH ỔN ✅</text>
            <text x={W / 2} y={462} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">ta hài lòng · tan làm sớm 🤣 → 3 giờ sau PROD SẬP 💀</text>
          </g>
          <g>
            {know.map((t, i) => (
              <g key={i} style={useScaleIn((T.K3A.know as number[])[i], 9)}>
                <rect x={W / 2 - 436 + i * 296} y={540} width={280} height={72} rx={11} fill={BG_RED} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2 - 296 + i * 296} y={585} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.K3A.onlyme, 14)}>
            <rect x={W / 2 - 490} y={720} width={980} height={120} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={794} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ có TA · không biết 🤡</text>
          </g>
          </g>
          <FigFooter label="không có cảnh báo · ta là người biết cuối cùng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 K3B · Thiên Cơ Quan Trắc = Monitoring ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const alerts = ["CPU tăng → báo", "Memory đầy → báo", "DB hấp hối → báo", "Network loạn → báo"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="CÔNG PHÁP ③ · MONITORING" />
          <g transform="translate(0, 330)">
          <Hero cy={280} cn="Thiên Cơ Quan Trắc Thuật" en="MONITORING" sub="// thiên nhãn soi mọi mạch máu" color={ACCENT_BLUE} entry={T.K3B.hero} />
          <g>
            {alerts.map((t, i) => (
              <g key={i} style={useScaleIn((T.K3B.alerts as number[])[i], 9)}>
                <rect x={W / 2 - 270 + (i % 2) * 280} y={430 + Math.floor(i / 2) * 80} width={260} height={64} rx={11} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2 - 140 + (i % 2) * 280} y={470 + Math.floor(i / 2) * 80} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.K3B.karma, 14)}>
            <rect x={W / 2 - 490} y={620} width={980} height={220} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={4} />
            <text x={W / 2} y={668} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Thiên Nhãn mở càng lớn · NGHIỆP LỰC càng sâu 💀</text>
            <text x={W / 2} y={730} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 giờ sáng · nó báo · 4 giờ sáng · nó báo</text>
            <text x={W / 2} y={788} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Chủ nhật · ngày lễ · NÓ VẪN BÁO 🔔😭</text>
          </g>
          </g>
          <FigFooter label="monitoring · thấy hết, và réo cả lúc 3h sáng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 DIETHE · Diệt Thế Nhất Chỉ ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="08" label="2H SÁNG · TRUY TRA" />
        <g transform="translate(0, 330)">
        <g style={useScaleIn(T.DIETHE.wake, 14)}>
          <rect x={W / 2 - 480} y={250} width={960} height={150} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={300} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Thiên Nhãn réo lúc 2 GIỜ SÁNG · ta bật dậy:</text>
          <text x={W / 2} y={358} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>CPU 100% · MEM 99% · DB hấp hối 💀</text>
        </g>
        <g style={useScaleIn(T.DIETHE.intern, 14)}>
          <rect x={W / 2 - 480} y={440} width={960} height={170} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={492} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>2 canh giờ truy tra · cuối cùng phát hiện:</text>
          <text x={W / 2} y={540} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một THỰC TẬP SINH · đang chạy</text>
          <text x={W / 2} y={585} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>query · KHÔNG có WHERE 😱</text>
        </g>
        <g style={useScaleIn(T.DIETHE.name, 14)}>
          <rect x={W / 2 - 490} y={660} width={980} height={150} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={712} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngày hôm đó · ta lĩnh ngộ:</text>
          <text x={W / 2} y={772} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DIỆT THẾ NHẤT CHỈ 🤣</text>
        </g>
        </g>
        <FigFooter label="DELETE thiếu WHERE · một ngón xóa sạch thiên hạ" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 FRIDAY1 ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ORANGE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="09" label="THIÊN KIẾP LỚN NHẤT" />
        <g transform="translate(0, 330)">
        <text x={W / 2} y={250} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(10, 12)}>nhưng thiên kiếp lớn nhất · vẫn chưa xuất hiện 💀</text>
        <g style={useScaleIn(T.FRIDAY1.ask, 14)}>
          <rect x={W / 2 - 480} y={300} width={960} height={140} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={350} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Kiếm Tu Dev vội vàng chạy tới:</text>
          <text x={W / 2} y={405} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"sửa lỗi nhỏ thôi · deploy giúp ta" 🙏</text>
        </g>
        <g style={useScaleIn(T.FRIDAY1.clock, 14)}>
          <TechBox x={W / 2 - 320} y={480} w={640} h={150} color={WARNING_RED} thick={4} />
          <text x={W / 2} y={535} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta nhìn đồng hồ…</text>
          <text x={W / 2} y={600} fontSize={56} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>THỨ 6 · 17:55</text>
        </g>
        <g style={useScaleIn(T.FRIDAY1.taboo, 14)}>
          <rect x={W / 2 - 490} y={680} width={980} height={160} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={732} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">⛔ CẤM KỴ THƯỢNG CỔ</text>
          <text x={W / 2} y={792} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">KHÔNG AI ĐƯỢC DEPLOY CHIỀU THỨ SÁU</text>
        </g>
        </g>
        <FigFooter label="luật bất thành văn · No Deploy Friday" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 FRIDAY2 ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const tl = ["18:10 · Production bốc cháy", "18:15 · CEO xuất hiện", "18:20 · PM xuất hiện", "18:30 · toàn tông môn xuất hiện"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="ĐẠI HỎA · THỨ SÁU" />
          <g transform="translate(0, 330)">
          <g style={useScaleIn(T.FRIDAY2.trust, 13)}>
            <rect x={W / 2 - 480} y={235} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={283} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta mềm lòng · ta tin hắn…</text>
            <text x={W / 2} y={328} fontSize={31} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sai lầm lớn nhất đời ta 💀</text>
          </g>
          <g>
            {tl.map((t, i) => (
              <g key={i} style={useScaleIn((T.FRIDAY2.timeline as number[])[i], 10)}>
                <rect x={W / 2 - 470} y={385 + i * 80} width={940} height={66} rx={11} fill={BG_RED} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={427 + i * 80} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.FRIDAY2.drink, 14)}>
            <rect x={W / 2 - 490} y={730} width={980} height={130} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={778} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>kẻ gây họa: ngoài vùng phủ sóng · đã đi nhậu 🍺</text>
            <text x={W / 2} y={826} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">còn sống hay đã phi thăng — không ai hay 🤣</text>
          </g>
          </g>
          <FigFooter label="prod cháy thứ Sáu · hung thủ đã ở quán bia" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 NODEPLOY ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="11" label="CẤM THUẬT CUỐI CÙNG" />
          <g transform="translate(0, 330)">
          <text x={W / 2} y={400} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>ngày hôm đó · ta lĩnh ngộ cấm thuật cuối cùng:</text>
          <g style={useScaleIn(T.NODEPLOY.name, 16)}>
            <rect x={W / 2 - 490} y={470} width={980} height={170} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={5} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={540} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《 Bất Động Như Sơn 》</text>
            <text x={W / 2} y={600} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>QUY TẮC 🔥</text>
          </g>
          <g style={useScaleIn(T.NODEPLOY.eng, 14)}>
            <TechBox x={W / 2 - 360} y={700} w={720} h={120} color={JADE} thick={4} />
            <text x={W / 2} y={748} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tên gọi khác là:</text>
            <text x={W / 2} y={798} fontSize={46} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>No Deploy Friday</text>
          </g>
          </g>
          <FigFooter label="bất động như sơn · thứ Sáu thì đừng đụng prod" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S13 ENDING · tier list ============
const S13: React.FC<{ duration: number }> = ({ duration }) => {
  const roles = ["⚔️ Kiếm Tu tạo công pháp", "🧭 PM hoạch định tương lai", "🔍 QA truy tìm bug"];
  const tiers = [
    { p: "Hạ phẩm", s: "biết Deploy", c: TEXT_SEC },
    { p: "Trung phẩm", s: "biết Scale", c: ACCENT_BLUE },
    { p: "Thượng phẩm", s: "biết Tự Động Hóa", c: JADE },
    { p: "Cực phẩm", s: "ngủ xuyên đêm 😴", c: AMBER_BRIGHT },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="12" label="ĐẠI ĐẠO · CẢNH GIỚI" />
          <g transform="translate(0, 330)">
          <g>
            {roles.map((t, i) => (
              <g key={i} opacity={useFade((T.ENDING.roles as number[])[i], 10)}>
                <text x={W / 2} y={245 + i * 44} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.ENDING.fame, 14)}>
            <rect x={W / 2 - 490} y={400} width={980} height={110} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={445} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>DevOps · âm thầm chống đỡ thiên địa</text>
            <text x={W / 2} y={485} fontSize={25} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>trận hoàn mỹ: không ai nhớ · trận sụp: cả tam giới nhớ</text>
          </g>
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.ENDING.tiers as number[])[i], 10)}>
                <rect x={W / 2 - 470} y={545 + i * 78} width={940} height={64} rx={11} fill={i === 3 ? BG_TERM : BG_CARD} stroke={t.c} strokeWidth={i === 3 ? 3 : 2} />
                <text x={W / 2 - 440} y={585 + i * 78} fontSize={26} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.p}</text>
                <text x={W / 2 + 440} y={585 + i * 78} fontSize={26} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.s}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={895} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.ENDING.lost, 12)}>tiếc thay · cảnh giới ấy đã THẤT TRUYỀN 🤣</text>
          </g>
          <FigFooter label="cực phẩm DevOps = ngủ xuyên đêm (đã thất truyền)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S14 CTA ============
const S14: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={655} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇 (Backend? SRE? Tester?)</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={740} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={752} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={828} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={960} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(140, 12)}>để không bỏ lỡ truyền kỳ giới IT tiếp theo 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14];

export const PovDevops: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_devops/voice.mp3")} />
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
