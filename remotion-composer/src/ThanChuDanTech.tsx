import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./than_chu_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
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
const SLATE = "#A4B5D0";

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

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tcgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tcgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tcglow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tcscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tcgrid)" />
        <rect width={W} height={H} fill="url(#tcgrid2)" />
        <rect width={W} height={H} fill="url(#tcglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tcscan)" />
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
const FigFooter: React.FC<{ num: string; label: string }> = ({ num, label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">fig.{num} · {label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · thần chú dân tech · 2026</text>
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

const TypeBadge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 165} y={250} width={330} height={70} rx={6} fill={color} />
      <text x={W / 2} y={298} fontSize={32} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">THẦN CHÚ {num}</text>
      <text x={W / 2} y={388} fontSize={(name || "").length > 18 ? 40 : 48} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

const SpellCard: React.FC<{ y: number; color: string; num: string; quote: string; entry: number }> = ({ y, color, num, quote, entry }) => {
  const a = useScaleIn(entry, 14);
  const x = W / 2 - 470;
  const w = 940;
  const h = 230;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={BG_CARD} stroke={color} strokeWidth={2.5} />
      <text x={x + 24} y={y + 44} fontSize={34} fill={color} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>「</text>
      <text x={x + w - 24} y={y + h - 20} fontSize={34} fill={color} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>」</text>
      <text x={x + w / 2} y={y + 46} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="3">▸ niệm chú #{num}</text>
      <text x={x + w / 2} y={y + 145} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"{quote}"</text>
      <text x={x + w / 2} y={y + 200} fontSize={18} fill={color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">— incantation cast —</text>
    </g>
  );
};

const Punch: React.FC<{ y: number; lines: { t: string; c?: string; size?: number; it?: boolean }[]; anim: { opacity: number } }> = ({ y, lines, anim }) => (
  <g transform={`translate(${W / 2}, ${y})`} opacity={anim.opacity}>
    {lines.map((l, i) => (
      <text key={i} x={0} y={i * 54} fontSize={l.size || 30} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.it ? "italic" : "normal"}>{l.t}</text>
    ))}
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16), sub = useFadeUp(70, 14);
  const e1 = useFadeUp(210, 12), e2 = useFadeUp(300, 12), e3 = useFadeUp(390, 12);
  const eff = [
    { y: 0, t: "production độ kiếp", c: WARNING_RED, anim: e1 },
    { y: 110, t: "sprint kéo dài 3 đời", c: AMBER, anim: e2 },
    { y: 220, t: "dev team đạo tâm bất ổn", c: ACCENT_BLUE, anim: e3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="DEV INCANTATIONS · THẦN CHÚ" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 450px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={410} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">TOP 7 CÂU</text>
            <text x={W / 2} y={500} fontSize={86} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">THẦN CHÚ</text>
            <text x={W / 2} y={575} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="3">CỦA DÂN TECH</text>
          </g>
          <text x={W / 2} y={710} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Câu nói bình thường — nhưng niệm ra là kéo theo nhân quả
          </text>
          <text x={W / 2} y={850} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={sub}>
            // có câu vừa xuất hiện:
          </text>
          {eff.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${960 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-440} y={-42} width={880} height={84} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
              <text x={-410} y={9} fontSize={28} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>▸ khiến</text>
              <text x={420} y={9} fontSize={30} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.t}</text>
            </g>
          ))}
          <FigFooter num="1" label="7 câu thần chú tà môn của dân tech" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 TC1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useFadeUp(150, 14);
  const tail = useFadeUp(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="OVERCONFIDENCE" />
          <TypeBadge num="1" name="Chắc không sao đâu" color={SLATE} entry={15} />
          <SpellCard y={500} color={SLATE} num="01" quote="Chắc không sao đâu" entry={70} />
          <Punch y={910} anim={punch} lines={[
            { t: "Trong cốt đạo — câu thần chú mở đầu", c: TEXT_SEC, it: true },
            { t: "NHIỀU TRẬN THIÊN KIẾP NHẤT lịch sử", c: WARNING_RED, size: 34 },
          ]} />
          <g transform={`translate(${W / 2}, 1170)`} opacity={tail.opacity}>
            <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Người niệm chú thì rất tự tin</text>
            <text x={0} y={56} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Production thì không.</text>
          </g>
          <FigFooter num="2" label="thần chú 1 · famous last words" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 TC2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const note = useFadeUp(140, 12);
  const c1 = useScaleIn(165, 10), c2 = useScaleIn(185, 10), c3 = useScaleIn(205, 10);
  const tail = useFadeUp(230, 12);
  const chips = [
    { x: -300, t: "15 phút", c: JADE, anim: c1 },
    { x: 0, t: "3 giờ", c: AMBER, anim: c2 },
    { x: 300, t: "3 ngày", c: WARNING_RED, anim: c3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="TIME ESTIMATE · FIX NHANH" />
          <TypeBadge num="2" name="Fix nhanh thôi" color={JADE} entry={15} />
          <SpellCard y={500} color={JADE} num="02" quote="Fix nhanh thôi" entry={70} />
          <text x={W / 2} y={900} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            Loại thời gian bí ẩn nhất giới công nghệ →
          </text>
          {chips.map((c, i) => (
            <g key={i} style={{ ...c.anim, transformOrigin: `${W / 2 + c.x}px 1050px`, transformBox: "fill-box" }}>
              <rect x={W / 2 + c.x - 130} y={1000} width={260} height={100} rx={6} fill={BG_CARD} stroke={c.c} strokeWidth={2.5} />
              <text x={W / 2 + c.x} y={1063} fontSize={40} fill={c.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{c.t}</text>
            </g>
          ))}
          <text x={W / 2} y={1230} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={tail}>
            … đều từng xuất hiện.
          </text>
          <FigFooter num="3" label="thần chú 2 · estimate vô định" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TC3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const tag = useScaleIn(140, 12);
  const punch = useFadeUp(190, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="WORKS ON MY MACHINE" />
          <TypeBadge num="3" name="Ở local em chạy mà" color={ACCENT_BLUE} entry={15} />
          <SpellCard y={500} color={ACCENT_BLUE} num="03" quote="Ở local em chạy mà" entry={70} />
          <g style={{ ...tag, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 230} y={860} width={460} height={80} rx={6} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={910} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">⚠ TAM ĐẠI CẤM CHÚ</text>
          </g>
          <Punch y={1110} anim={punch} lines={[
            { t: "Local vẫn chạy bình thường...", c: TEXT_SEC, it: true },
            { t: "nhưng vừa lên PRODUCTION", c: TEXT_PRI, size: 34 },
            { t: "thiên cơ bắt đầu hỗn loạn", c: AMBER_BRIGHT, size: 38, it: true },
          ]} />
          <FigFooter num="4" label="thần chú 3 · local ≠ production" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 TC4 ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useScaleIn(140, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="ONE LINE CHANGE" />
          <TypeBadge num="4" name="Chỉ sửa một dòng thôi" color={VIOLET} entry={15} />
          <SpellCard y={500} color={VIOLET} num="04" quote="Chỉ sửa một dòng thôi" entry={70} />
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1080px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={950} w={940} h={260} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1015} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// trong lịch sử phần mềm</text>
            <text x={W / 2} y={1080} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rất nhiều ĐẠI KIẾP</text>
            <text x={W / 2} y={1135} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đều bắt đầu từ</text>
            <text x={W / 2} y={1185} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">một dòng code "vô hại"</text>
          </g>
          <FigFooter num="5" label="thần chú 4 · the harmless one-liner" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TC5 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useFadeUp(150, 14);
  const p1 = useFadeUp(210, 10), p2 = useFadeUp(240, 10), p3 = useFadeUp(270, 10);
  const prep = [
    { y: 0, t: "Monitoring được mở ra", anim: p1 },
    { y: 78, t: "Log được chuẩn bị", anim: p2 },
    { y: 156, t: "Hộ tâm đan được uống", anim: p3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="FRIDAY DEPLOY" />
          <TypeBadge num="5" name="Deploy thứ Sáu đi" color={ORANGE} entry={15} />
          <SpellCard y={480} color={ORANGE} num="05" quote="Deploy thứ Sáu đi" entry={70} />
          <Punch y={870} anim={punch} lines={[
            { t: "Các trưởng lão DevOps", c: TEXT_SEC, it: true },
            { t: "đồng loạt MỞ MẮT", c: WARNING_RED, size: 36 },
          ]} />
          {prep.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${1050 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-400} y={-30} width={800} height={60} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
              <text x={-370} y={10} fontSize={24} fill={ORANGE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▸</text>
              <text x={-325} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <FigFooter num="6" label="thần chú 5 · never deploy on friday" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 TC6 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const note = useFadeUp(150, 12);
  const before = useScaleIn(190, 14);
  const after = useScaleIn(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="AI WROTE IT · TÀ CHÚ MỚI" />
          <TypeBadge num="6" name="AI viết rồi, chắc đúng" color={WARNING_RED} entry={15} />
          <SpellCard y={470} color={WARNING_RED} num="06" quote="AI viết rồi, chắc đúng" entry={70} />
          <text x={W / 2} y={860} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            Tà chú mới nổi của thời đại AI
          </text>
          {/* Before */}
          <g style={{ ...before, transformOrigin: `${W / 2}px 985px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={915} w={940} h={140} color={JADE} thick={2} />
            <text x={W / 2 - 440} y={965} fontSize={22} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// lúc mới niệm</text>
            <text x={W / 2} y={1015} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cảm giác sắp ✦ PHI THĂNG</text>
          </g>
          {/* arrow */}
          <text x={W / 2} y={1105} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} style={{ opacity: after.opacity }}>▼ 3 canh giờ sau ▼</text>
          {/* After */}
          <g style={{ ...after, transformOrigin: `${W / 2}px 1240px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1140} w={940} h={200} color={WARNING_RED} thick={2.5} />
            <text x={W / 2 - 440} y={1190} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// ngồi debug code AI viết</text>
            <text x={W / 2} y={1245} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đạo tâm bắt đầu</text>
            <text x={W / 2} y={1300} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">xuất hiện VẾT NỨT</text>
          </g>
          <FigFooter num="7" label="thần chú 6 · AI code debt at 3AM" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TC7 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const note = useFadeUp(150, 12);
  const punch = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="LATER · ĐỂ SAU REFACTOR" />
          <TypeBadge num="7" name="Để sau refactor" color={AMBER} entry={15} />
          <SpellCard y={500} color={AMBER} num="07" quote="Để sau refactor" entry={70} />
          <text x={W / 2} y={900} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            Lời hứa lâu đời nhất tiên giới công nghệ
          </text>
          <text x={W / 2} y={960} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} style={note}>
            // "sau" là khi nào? không ai biết
          </text>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1150px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1050} w={940} h={200} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1115} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Rất nhiều đoạn code hôm nay</text>
            <text x={W / 2} y={1175} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã chờ refactor từ thời thượng cổ</text>
          </g>
          <FigFooter num="8" label="thần chú 7 · the eternal 'later'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const n1 = useFadeUp(110, 10), n2 = useFadeUp(170, 10);
  const scary = useScaleIn(250, 16);
  const q1 = useFadeUp(330, 12), q2 = useFadeUp(420, 12);
  const cta = useFadeUp(500, 14);
  const notScary = [
    { y: 0, t: "Bug", anim: n1 },
    { y: 78, t: "Deadline", anim: n2 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE REAL FEAR · ĐẠI NĂNG" />
          <text x={W / 2} y={310} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Đại năng kỹ thuật phần mềm đều hiểu:
          </text>
          <text x={W / 2} y={420} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={n1}>// KHÔNG đáng sợ:</text>
          {notScary.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${490 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-320} y={-28} width={640} height={58} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={0} y={9} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ {r.t} — không đáng sợ</text>
            </g>
          ))}
          {/* scary */}
          <g style={scary}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={400} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={758} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">⚠ ĐÁNG SỢ NHẤT</text>
            <text x={W / 2} y={812} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">nghe đồng môn nói:</text>
          </g>
          <g transform={`translate(${W / 2}, 880)`} opacity={q1.opacity}>
            <text x={0} y={0} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Yên tâm."</text>
          </g>
          <g transform={`translate(${W / 2}, 955)`} opacity={q2.opacity}>
            <text x={0} y={0} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Ta biết mình đang làm gì."</text>
          </g>
          <g transform={`translate(${W / 2}, 1050)`} opacity={q2.opacity}>
            <text x={0} y={0} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngay trước khi</text>
            <text x={0} y={48} fontSize={38} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">DEPLOY PRODUCTION ĐỘ KIẾP</text>
          </g>
          <g transform={`translate(${W / 2}, 1270)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu đã niệm câu nào rồi? 👇</text>
            <line x1={-230} y1={50} x2={230} y2={50} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={100} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter num="9" label="thần chú dân tech · cấm niệm trước deploy" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const ThanChuDanTech: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("than_chu/voice.mp3")} />
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
