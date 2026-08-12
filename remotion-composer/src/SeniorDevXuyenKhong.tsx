import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./xuyen_khong_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "08";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
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
const useScaleIn = (e: number, d = 18) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 14) => {
  const f = useCurrentFrame();
  return { opacity: interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
};

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="xkgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="xkgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="xkglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="xkscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#xkgrid)" />
        <rect width={W} height={H} fill="url(#xkgrid2)" />
        <rect width={W} height={H} fill="url(#xkglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#xkscan)" />
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
  const a1 = useFadeUp(0, 10), a2 = useFadeUp(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={0.5} style={a2} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · senior dev xuyên không · 2026</text>
  </g>
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
const SceneTitle: React.FC<{ t: string; color?: string; entry: number }> = ({ t, color = AMBER, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
      <text x={W / 2} y={314} fontSize={(t.length > 22 ? 42 : 52)} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{t}</text>
    </g>
  );
};

// ============ S1 SETUP ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const portal = useScaleIn(120, 16);
  const calm = useFadeUp(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="ISEKAI · XUYÊN KHÔNG" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={400} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Nếu một SENIOR DEV</text>
            <text x={W / 2} y={478} fontSize={58} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">XUYÊN KHÔNG</text>
            <text x={W / 2} y={548} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">VỀ NĂM 2000</text>
          </g>
          <g style={{ ...portal, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={760} r={110} fill={BG_CARD} stroke={VIOLET} strokeWidth={3} />
            <circle cx={W / 2} cy={760} r={80} fill="none" stroke={ACCENT_BLUE} strokeWidth={2} opacity={0.6} strokeDasharray="8 6" />
            <text x={W / 2} y={748} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>YEAR</text>
            <text x={W / 2} y={800} fontSize={52} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>2000</text>
          </g>
          <g style={calm}>
            <TechBox x={W / 2 - 470} y={970} w={940} h={180} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1030} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// ban đầu hắn rất bình tĩnh</text>
            <text x={W / 2} y={1095} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vì hắn là ĐẠI NĂNG</text>
            <text x={W / 2} y={1140} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">kỹ thuật phần mềm</text>
          </g>
          <FigFooter label="senior dev · trải vô số production độ kiếp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 IDE HOẢNG ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const term = useScaleIn(60, 14);
  const tools = ["ChatGPT", "Claude", "Cursor", "Stack Overflow"];
  const toolFrames = [95, 150, 200, 250];
  const drop = useScaleIn(305, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="OPEN IDE · PANIC" />
          <SceneTitle t="Mở IDE... và HOẢNG" color={WARNING_RED} entry={20} />
          {/* terminal */}
          <g style={{ ...term, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={440} width={880} height={500} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <rect x={W / 2 - 440} y={440} width={880} height={54} rx={12} fill={BG_CARD} />
            <rect x={W / 2 - 440} y={484} width={880} height={10} fill={BG_CARD} />
            <circle cx={W / 2 - 410} cy={467} r={8} fill={WARNING_RED} />
            <circle cx={W / 2 - 384} cy={467} r={8} fill={AMBER} />
            <circle cx={W / 2 - 358} cy={467} r={8} fill={JADE} />
            <text x={W / 2} y={473} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">terminal — year 2000</text>
          </g>
          {tools.map((t, i) => {
            const a = useFade(toolFrames[i], 8);
            return (
              <g key={i} style={a}>
                <text x={W / 2 - 410} y={560 + i * 88} fontSize={30} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ {t}</text>
                <text x={W / 2 + 410} y={560 + i * 88} fontSize={28} fill={WARNING_RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>not found ✗</text>
              </g>
            );
          })}
          <g style={{ ...drop, transformOrigin: `${W / 2}px 1080px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={1010} w={880} h={150} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1065} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Đại năng rơi thẳng:</text>
            <text x={W / 2} y={1120} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Hóa Thần ↓ Luyện Khí</text>
          </g>
          <FigFooter label="scene 2 · không còn pháp bảo nào" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 GẶP BUG ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const bar = useScaleIn(60, 14);
  const frame = useCurrentFrame();
  const load = interpolate(frame, [120, 230], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = useFadeUp(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="HIT A BUG · DIAL-UP ERA" />
          <SceneTitle t="Gặp bug → mở trình duyệt" color={ACCENT_BLUE} entry={20} />
          {/* browser bar */}
          <g style={{ ...bar, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={500} width={880} height={120} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2} />
            <circle cx={W / 2 - 390} cy={560} r={18} fill="none" stroke={TEXT_MUTE} strokeWidth={3} />
            <line x1={W / 2 - 378} y1={572} x2={W / 2 - 360} y2={590} stroke={TEXT_MUTE} strokeWidth={3} />
            <text x={W / 2 - 330} y={572} fontSize={34} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>how to fix...</text>
          </g>
          {/* loading */}
          <g>
            <rect x={W / 2 - 440} y={690} width={880} height={26} rx={13} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <rect x={W / 2 - 440} y={690} width={880 * load} height={26} rx={13} fill={WARNING_RED} opacity={0.7} />
            <text x={W / 2} y={760} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>🐌 loading... {Math.round(load * 100)}%</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={880} w={940} h={180} color={AMBER} thick={2.5} />
            <text x={W / 2} y={940} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Rồi hắn chợt nhớ ra...</text>
            <text x={W / 2} y={1000} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Internet thời này còn chậm hơn</text>
            <text x={W / 2} y={1042} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cả linh điểu truyền thư 🕊️</text>
          </g>
          <FigFooter label="scene 3 · dial-up 56k độ kiếp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 KHÔNG CÓ GÌ ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const r1 = useFadeUp(75, 10), r2 = useFadeUp(120, 10), r3 = useFadeUp(165, 10);
  const doc = useScaleIn(210, 14);
  const rows = [
    { y: 0, t: "Muốn copy code", v: "✗ no Github", anim: r1 },
    { y: 84, t: "Muốn hỏi AI", v: "✗ no AI", anim: r2 },
    { y: 168, t: "Muốn hỏi Reddit", v: "✗ no Reddit", anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="NO TOOLS · BACK TO BASICS" />
          <SceneTitle t="Không có gì cả..." color={WARNING_RED} entry={20} />
          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${480 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-440} y={-34} width={880} height={68} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={-410} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
              <text x={410} y={10} fontSize={28} fill={WARNING_RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.v}</text>
            </g>
          ))}
          <g style={{ ...doc, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={780} w={940} h={200} color={AMBER} thick={3} />
            <text x={W / 2} y={840} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// cuối cùng hắn phải...</text>
            <text x={W / 2} y={905} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>📖 ĐỌC DOCUMENTATION</text>
            <text x={W / 2} y={955} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">đạo tâm suýt tan vỡ tại chỗ</text>
          </g>
          <FigFooter label="scene 4 · raw documentation only" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 THIÊN TÀI ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const q1 = useScaleIn(120, 14), q2 = useScaleIn(210, 14), q3 = useScaleIn(300, 14);
  const quotes = [
    { y: 0, q: "\"Đừng hardcode\"", r: "→ mọi người chấn động", c: ACCENT_BLUE, anim: q1 },
    { y: 200, q: "\"Nhớ backup\"", r: "→ mọi người ghi chép", c: JADE, anim: q2 },
    { y: 400, q: "\"Code chạy được chưa chắc xong\"", r: "→ toàn tông môn ngộ đạo", c: AMBER, anim: q3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="SEEN AS A GENIUS" />
          <text x={W / 2} y={310} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={intro}>
            Người xung quanh nhìn hắn như THIÊN TÀI 🤯
          </text>
          {quotes.map((r, i) => (
            <g key={i} style={{ ...r.anim, transformOrigin: `${W / 2}px ${480 + r.y}px`, transformBox: "fill-box" }}>
              <TechBox x={W / 2 - 470} y={420 + r.y} w={940} h={150} color={r.c} thick={2} />
              <text x={W / 2} y={485 + r.y} fontSize={r.q.length > 22 ? 32 : 42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">{r.q}</text>
              <text x={W / 2} y={538 + r.y} fontSize={26} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
          <FigFooter label="scene 5 · wisdom của tương lai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TRƯỞNG LÃO ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const crown = useScaleIn(40, 16);
  const punch = useScaleIn(120, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="BECOMES AN ELDER" />
          <g style={{ ...crown, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={470} fontSize={120} textAnchor="middle">👑</text>
            <text x={W / 2} y={580} fontSize={48} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Vài năm → TRƯỞNG LÃO</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={720} w={940} h={260} color={AMBER} thick={2.5} />
            <text x={W / 2} y={790} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">không phải vì code mạnh</text>
            <text x={W / 2} y={860} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà vì BIẾT TRƯỚC</text>
            <text x={W / 2} y={915} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">những sai lầm thiên hạ</text>
            <text x={W / 2} y={960} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">sắp mắc phải</text>
          </g>
          <FigFooter label="scene 6 · oracle của bug tương lai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 CÂU HỎI ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(20, 16);
  const x1 = useFadeUp(210, 10), x2 = useFadeUp(255, 10), x3 = useFadeUp(300, 10);
  const ask = useFadeUp(355, 12);
  const nope = [
    { y: 0, t: "AI", anim: x1 },
    { y: 84, t: "framework", anim: x2 },
    { y: 168, t: "microservice", anim: x3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE QUESTION" />
          <g style={{ ...q, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={360} w={940} h={170} color={VIOLET} thick={2.5} />
            <text x={W / 2} y={415} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// đệ tử hỏi:</text>
            <text x={W / 2} y={470} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Cảnh giới cao nhất</text>
            <text x={W / 2} y={512} fontSize={34} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>của lập trình là gì?"</text>
          </g>
          <text x={W / 2} y={640} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={ask}>
            Đại năng trầm mặc rất lâu... rồi đáp:
          </text>
          {nope.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${730 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-360} y={-30} width={720} height={62} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} textDecoration="line-through">✗ không phải {r.t}</text>
            </g>
          ))}
          <g transform={`translate(${W / 2}, 1080)`} opacity={ask.opacity}>
            <text x={0} y={0} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Vậy... là gì?"</text>
          </g>
          <FigFooter label="scene 7 · không phải thứ ngươi nghĩ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 ĐÁP ÁN + ENDING ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const m1 = useFade(40, 10), m2 = useFade(75, 10), m3 = useFade(110, 10);
  const reveal = useScaleIn(240, 18);
  const bow = useScaleIn(360, 16);
  const cta = useFadeUp(470, 14);
  const mem = [
    { y: 0, t: "vô số đêm production độ kiếp", anim: m1 },
    { y: 56, t: "hàng ngàn bug", anim: m2 },
    { y: 112, t: "deploy lúc nửa đêm", anim: m3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE ANSWER · ĐẠO TỔ" />
          <text x={W / 2} y={310} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="1">// hắn nhìn xa xăm, nhớ lại:</text>
          {mem.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${370 + r.y})`} style={r.anim}>
              <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">· {r.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={600} w={960} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={660} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// rồi đáp:</text>
            <text x={W / 2} y={735} fontSize={70} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>BIẾT ĐỌC</text>
            <text x={W / 2} y={815} fontSize={70} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">ERROR MESSAGE</text>
          </g>
          <g style={{ ...bow, transformOrigin: `${W / 2}px 970px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={960} fontSize={50} textAnchor="middle">🙇‍♂️🙇‍♀️🙇</text>
            <text x={W / 2} y={1030} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>toàn tông môn hành lễ · tôn làm <tspan fill={AMBER}>ĐẠO TỔ</tspan></text>
          </g>
          <g transform={`translate(${W / 2}, 1180)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu nghĩ cảnh giới cao nhất là gì? 👇</text>
            <line x1={-240} y1={50} x2={240} y2={50} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={100} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="scene 8 · cảnh giới tối cao = đọc error message" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8];

export const SeniorDevXuyenKhong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("xuyen_khong/voice.mp3")} />
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
