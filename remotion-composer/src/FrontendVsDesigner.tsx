import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./frontend_vs_designer_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const WARNING_RED = "#FF6B6B";
const SLATE = "#A4B5D0";
const FE = "#5BB8FF"; // frontend blue
const FE_DK = "#1E3A52";
const DS = "#FF6FB5"; // designer pink
const DS_DK = "#4A1E38";

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
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = AMBER }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="fvgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="fvgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <linearGradient id="fvsplit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={FE} stopOpacity="0.07" />
            <stop offset="50%" stopColor={BG_NAVY} stopOpacity="0" />
            <stop offset="100%" stopColor={DS} stopOpacity="0.07" />
          </linearGradient>
          <linearGradient id="fvscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#fvgrid)" />
        <rect width={W} height={H} fill="url(#fvgrid2)" />
        <rect width={W} height={H} fill="url(#fvsplit)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#fvscan)" />
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

// VS divider
const VsBadge: React.FC<{ cx: number; cy: number; entry: number }> = ({ cx, cy, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <circle cx={cx} cy={cy} r={56} fill={BG_NAVY} stroke={AMBER} strokeWidth={4} />
      <text x={cx} y={cy + 16} fontSize={46} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VS</text>
    </g>
  );
};

// fighter card (one side)
const Fighter: React.FC<{ cx: number; cy: number; emoji: string; role: string; name: string; color: string; bg: string; entry: number }> = ({ cx, cy, emoji, role, name, color, bg, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - 230} y={cy - 170} width={460} height={340} rx={18} fill={bg} stroke={color} strokeWidth={3} />
      <text x={cx} y={cy - 40} fontSize={110} textAnchor="middle">{emoji}</text>
      <text x={cx} y={cy + 70} fontSize={26} fill={color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{role}</text>
      <text x={cx} y={cy + 130} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// speech line (left = frontend / right = designer)
const Speech: React.FC<{ y: number; side: "FE" | "DS"; text: string; entry: number; size?: number; h?: number }> = ({ y, side, text, entry, size = 32, h = 96 }) => {
  const a = useScaleIn(entry, 12);
  const color = side === "FE" ? FE : DS;
  const bg = side === "FE" ? FE_DK : DS_DK;
  const label = side === "FE" ? "⚔️ KIẾM TU FRONTEND" : "🎨 HỌA TU DESIGNER";
  const bw = 820;
  const x = side === "FE" ? W / 2 - bw / 2 - 16 : W / 2 - bw / 2 + 16;
  return (
    <g style={{ ...a, transformOrigin: `${x + bw / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={bw} height={h} rx={14} fill={bg} stroke={color} strokeWidth={2} />
      <rect x={side === "FE" ? x : x + bw - 8} y={y + 22} width={8} height={h - 44} fill={color} />
      <text x={side === "FE" ? x + 28 : x + bw - 28} y={y + 34} fontSize={17} fill={color} textAnchor={side === "FE" ? "start" : "end"} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{label}</text>
      <text x={side === "FE" ? x + 28 : x + bw - 28} y={y + 74} fontSize={size} fill={TEXT_PRI} textAnchor={side === "FE" ? "start" : "end"} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{text}</text>
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const nots = [
    { t: "❌ Backend vs Frontend", e: 60 },
    { t: "❌ DevOps vs Production", e: 110 },
  ];
  const title = useScaleIn(14, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="AN ETERNAL WAR" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 280px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={270} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐẠI CHIẾN VÔ SỐ KỶ NGUYÊN</text>
          </g>
          <text x={W / 2} y={350} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(40, 12)}>cuộc chiến không phải giữa:</text>
          {nots.map((n, i) => (
            <text key={i} x={W / 2} y={410 + i * 56} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through" opacity={useFade(n.e, 10)}>{n.t}</text>
          ))}
          <text x={W / 2} y={580} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(240, 12)}>… mà là giữa 2 tông môn này:</text>
          <Fighter cx={W / 2 - 268} cy={850} emoji="⚔️" role="KIẾM TU" name="FRONTEND" color={FE} bg={FE_DK} entry={280} />
          <Fighter cx={W / 2 + 268} cy={850} emoji="🎨" role="HỌA TU" name="DESIGNER" color={DS} bg={DS_DK} entry={320} />
          <VsBadge cx={W / 2} cy={850} entry={360} />
          <FigFooter label="hai môn phái · ngàn năm khẩu chiến" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SAME GOAL ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const goal = useScaleIn(60, 14);
  const split = useFadeUp(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="SAME GOAL · DIFFERENT PATH" />
          <text x={W / 2} y={330} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Hai bên · chung MỘT mục tiêu:</text>
          <g style={{ ...goal, transformOrigin: `${W / 2}px 500px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={420} width={760} height={160} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={490} fontSize={48} textAnchor="middle">🏆</text>
            <text x={W / 2} y={550} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>giao diện đẹp nhất tam giới</text>
          </g>
          <g style={split}>
            <text x={W / 2} y={720} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng CON ĐƯỜNG tu luyện…</text>
            <g>
              <rect x={W / 2 - 420} y={780} width={400} height={120} rx={12} fill={FE_DK} stroke={FE} strokeWidth={2} />
              <text x={W / 2 - 220} y={835} fontSize={40} textAnchor="middle">⚔️</text>
              <text x={W / 2 - 220} y={878} fontSize={24} fill={FE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>code · logic</text>
              <rect x={W / 2 + 20} y={780} width={400} height={120} rx={12} fill={DS_DK} stroke={DS} strokeWidth={2} />
              <text x={W / 2 + 220} y={835} fontSize={40} textAnchor="middle">🎨</text>
              <text x={W / 2 + 220} y={878} fontSize={24} fill={DS} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>pixel · cảm xúc</text>
            </g>
            <text x={W / 2} y={970} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">… hoàn toàn KHÁC NHAU ⚡</text>
          </g>
          <FigFooter label="cùng đích đến · khác cách đi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 FIRST DIFF ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="SAME SCREEN · DIFFERENT EYES" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Cùng nhìn một giao diện…</text>
          <Speech y={380} side="DS" text="'Icon này lệch 2 pixel' 🔍" entry={80} />
          <Speech y={540} side="FE" text="'Nó... chạy được' ✅" entry={200} />
          <g style={{ ...punch, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={720} w={940} h={150} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={785} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngay khoảnh khắc đó…</text>
            <text x={W / 2} y={840} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">NHÂN QUẢ bắt đầu hình thành 🌀</text>
          </g>
          <FigFooter label="cùng cảnh · hai thế giới quan" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 PIXEL WAR ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const crack = useFadeUp(290, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE PIXEL WAR · 24 vs 23.7" />
          <Speech y={300} side="DS" text="'Khoảng cách phải là 24'" entry={50} />
          <Speech y={440} side="FE" text="'Hiện tại là 23.7'" entry={110} />
          <Speech y={580} side="DS" text="'Ta nhìn ra.' 👁️" entry={180} h={86} size={34} />
          <Speech y={700} side="FE" text="'Không thể nào.' 😵" entry={230} h={86} size={34} />
          <g style={crack}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={130} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={905} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đạo tâm hai bên · VẾT NỨT 💔</text>
          </g>
          <FigFooter label="0.3 pixel · đủ gây chiến tranh" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 FONT vs CẢM XÚC ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useScaleIn(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="FONT vs FEELING" />
          <Speech y={300} side="DS" text="'Chữ này chưa đúng cảm xúc'" entry={40} size={30} />
          <Speech y={440} side="FE" text="'... đây là font.'" entry={100} />
          <Speech y={580} side="DS" text="'Không. Đây là CẢM XÚC.'" entry={160} size={30} />
          <g style={{ ...punch, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={720} w={940} h={170} color={FE} thick={3} />
            <text x={W / 2} y={785} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nghe xong · Kiếm Tu Frontend</text>
            <text x={W / 2} y={845} fontSize={38} fill={FE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">TẨU HỎA NHẬP MA 🤯</text>
          </g>
          <FigFooter label="font hay cảm xúc · cuộc tranh vô tận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 FIGMA ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const open = useScaleIn(40, 14);
  const stats = [
    { n: "17", t: "màn hình", e: 110 },
    { n: "42", t: "component", e: 150 },
    { n: "83", t: "trạng thái", e: 190 },
  ];
  const note = useScaleIn(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={DS} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="'JUST A SMALL TWEAK'" />
          <text x={W / 2} y={300} fontSize={30} fill={DS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(8, 12)}>🎨 Designer gửi Figma mới…</text>
          <g style={{ ...open, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={360} width={880} height={360} rx={14} fill={BG_TERM} stroke={DS} strokeWidth={2} />
            <rect x={W / 2 - 440} y={360} width={880} height={46} rx={14} fill={BG_CARD} />
            <text x={W / 2} y={390} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>design-final-v3.fig</text>
            {stats.map((s, i) => (
              <g key={i} opacity={useFade(s.e, 10)}>
                <text x={W / 2 - 400} y={485 + i * 78} fontSize={56} fill={DS} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{s.n}</text>
                <text x={W / 2 - 280} y={485 + i * 78} fontSize={38} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...note, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={760} width={760} height={86} rx={10} fill={DS_DK} stroke={DS} strokeWidth={2} />
            <text x={W / 2} y={814} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"chỉ chỉnh nhẹ thôi" 😇</text>
          </g>
          <text x={W / 2} y={930} fontSize={32} fill={FE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(340, 12)}>→ đạo tâm Frontend · VẾT NỨT thứ 2 💔</text>
          <FigFooter label="'nhẹ' của designer · = tháng của frontend" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 CHƯA GIỐNG FIGMA ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const said = useScaleIn(60, 14);
  const screens = useFadeUp(150, 14);
  const zoom = useScaleIn(250, 14);
  const punch = useFadeUp(340, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={DS} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="'DOESN'T MATCH FIGMA'" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Frontend làm xong mọi thứ · Designer:</text>
          <g style={{ ...said, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={330} width={760} height={94} rx={12} fill={DS_DK} stroke={DS} strokeWidth={2.5} />
            <text x={W / 2} y={390} fontSize={36} fill={DS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Trông chưa giống Figma" 🤨</text>
          </g>
          <g style={screens}>
            <rect x={W / 2 - 420} y={490} width={380} height={260} rx={12} fill={BG_CARD} stroke={DS} strokeWidth={2} />
            <text x={W / 2 - 230} y={520} fontSize={20} fill={DS} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>FIGMA</text>
            <rect x={W / 2 - 395} y={545} width={330} height={28} rx={4} fill={SLATE} opacity={0.3} />
            <rect x={W / 2 - 395} y={590} width={250} height={20} rx={4} fill={SLATE} opacity={0.3} />
            <rect x={W / 2 - 395} y={680} width={150} height={44} rx={8} fill={DS} opacity={0.5} />
            <rect x={W / 2 + 40} y={490} width={380} height={260} rx={12} fill={BG_CARD} stroke={FE} strokeWidth={2} />
            <text x={W / 2 + 230} y={520} fontSize={20} fill={FE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>CODE</text>
            <rect x={W / 2 + 65} y={545} width={330} height={28} rx={4} fill={SLATE} opacity={0.3} />
            <rect x={W / 2 + 65} y={590} width={250} height={20} rx={4} fill={SLATE} opacity={0.3} />
            <rect x={W / 2 + 65} y={680} width={150} height={44} rx={8} fill={FE} opacity={0.5} />
            <text x={W / 2} y={628} fontSize={40} textAnchor="middle">🟰</text>
          </g>
          <text x={W / 2} y={830} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={zoom}>Frontend nhìn trái · nhìn phải · 🔍 zoom 500%</text>
          <g style={punch}>
            <text x={W / 2} y={920} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">… vẫn KHÔNG thấy khác chỗ nào 😶‍🌫️</text>
          </g>
          <FigFooter label="khác biệt mà chỉ designer nhìn ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 SPRINT vs CÔNG LỰC ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const c1 = useScaleIn(50, 14);
  const c2 = useScaleIn(200, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="TWO DEADLY CURSES" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Hai câu nói · hai lời nguyền:</text>
          <g style={{ ...c1, transformOrigin: `${W / 2}px 490px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={360} width={920} height={250} rx={16} fill={DS_DK} stroke={DS} strokeWidth={3} />
            <text x={W / 2} y={415} fontSize={24} fill={DS} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🎨 DESIGNER niệm chú:</text>
            <text x={W / 2} y={475} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"cho em chỉnh 1 chi tiết nhỏ"</text>
            <text x={W / 2} y={555} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ 1 SPRINT biến mất ⏳💨</text>
          </g>
          <g style={{ ...c2, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={660} width={920} height={250} rx={16} fill={FE_DK} stroke={FE} strokeWidth={3} />
            <text x={W / 2} y={715} fontSize={24} fill={FE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚔️ FRONTEND niệm chú:</text>
            <text x={W / 2} y={775} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"user không nhận ra đâu"</text>
            <text x={W / 2} y={855} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ 1 Designer mất 100 năm công lực 💀</text>
          </g>
          <FigFooter label="hai câu cấm kỵ · giết người vô hình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const truth = useFadeUp(30, 14);
  const without = useScaleIn(280, 14);
  const unite = useScaleIn(480, 16);
  const cta = useFadeUp(640, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE FINAL TRUTH" />
          <g style={truth}>
            <text x={W / 2} y={280} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">Sau vô số cuộc chiến · cả hai lĩnh ngộ:</text>
            <text x={W / 2} y={344} fontSize={26} fill={DS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>🎨 Designer: "sao Frontend làm khó thế?"</text>
            <text x={W / 2} y={388} fontSize={26} fill={FE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>⚔️ Frontend: "sao Designer khó tính thế?"</text>
          </g>
          <text x={W / 2} y={470} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(200, 12)}>nhưng nếu THIẾU một bên:</text>
          <g style={without}>
            <rect x={W / 2 - 460} y={510} width={448} height={130} rx={12} fill={DS_DK} stroke={DS} strokeWidth={2} />
            <text x={W / 2 - 236} y={565} fontSize={30} fill={DS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đẹp 🎨</text>
            <text x={W / 2 - 236} y={608} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng không chạy</text>
            <rect x={W / 2 + 12} y={510} width={448} height={130} rx={12} fill={FE_DK} stroke={FE} strokeWidth={2} />
            <text x={W / 2 + 236} y={565} fontSize={30} fill={FE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Chạy ⚔️</text>
            <text x={W / 2 + 236} y={608} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng ai muốn nhìn</text>
          </g>
          <g style={{ ...unite, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={690} w={940} h={160} color={AMBER} thick={3} />
            <text x={W / 2} y={748} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>dù giao chiến vô số lần · vẫn phải:</text>
            <text x={W / 2} y={810} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">⚔️ + 🎨 cùng trấn thủ PRODUCTION 🤝</text>
          </g>
          <g transform={`translate(${W / 2}, 940)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu phe nào? ⚔️ hay 🎨 👇</text>
            <line x1={-240} y1={44} x2={240} y2={44} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={92} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="kẻ thù truyền kiếp · mà không thể thiếu nhau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const FrontendVsDesigner: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("frontend_vs_designer/voice.mp3")} />
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
