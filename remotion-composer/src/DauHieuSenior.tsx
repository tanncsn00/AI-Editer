import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./dau_hieu_senior_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "12";

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
          <pattern id="dsgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="dsgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="dsglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dsscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dsgrid)" />
        <rect width={W} height={H} fill="url(#dsgrid2)" />
        <rect width={W} height={H} fill="url(#dsglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#dsscan)" />
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
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · senior dev · 2026</text>
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
const SignBadge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 165} y={260} width={330} height={68} rx={6} fill={color} />
      <text x={W / 2} y={306} fontSize={30} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">DẤU HIỆU {num}</text>
      <text x={W / 2} y={394} fontSize={(name || "").length > 24 ? 34 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// reusable junior → senior shift slide
const ShiftSlide: React.FC<{
  duration: number; num: string; sec: string; name: string; color: string;
  oldLab: string; oldT: string[]; newLab: string; newT: string[]; extra?: string;
}> = ({ duration, num, sec, name, color, oldLab, oldT, newLab, newT, extra }) => {
  const oldA = useFadeUp(70, 14);
  const arrow = useFadeUp(120, 10);
  const newA = useScaleIn(150, 14);
  const ex = useFadeUp(210, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num={num} label={sec} />
          <SignBadge num={`${parseInt(num) - 1}`} name={name} color={color} entry={15} />
          {/* old (junior) */}
          <g style={oldA}>
            <rect x={W / 2 - 470} y={490} width={940} height={oldT.length > 1 ? 180 : 130} rx={10} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <text x={W / 2 - 440} y={535} fontSize={20} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{oldLab}</text>
            {oldT.map((t, i) => (
              <text key={i} x={W / 2} y={580 + i * 48} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{t}</text>
            ))}
          </g>
          <text x={W / 2} y={oldT.length > 1 ? 740 : 700} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={arrow}>▼ trở thành ▼</text>
          {/* new (senior) */}
          <g style={{ ...newA, transformOrigin: `${W / 2}px ${(oldT.length > 1 ? 860 : 820) + 65}px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={oldT.length > 1 ? 800 : 760} w={940} h={newT.length > 1 ? 190 : 140} color={color} thick={2.5} />
            <text x={W / 2 - 440} y={(oldT.length > 1 ? 800 : 760) + 44} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{newLab}</text>
            {newT.map((t, i) => (
              <text key={i} x={W / 2} y={(oldT.length > 1 ? 800 : 760) + 96 + i * 50} fontSize={t.length > 28 ? 30 : 36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">{t}</text>
            ))}
          </g>
          {extra && (
            <text x={W / 2} y={1120} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={ex}>{extra}</text>
          )}
          <FigFooter label={`dấu hiệu ${parseInt(num) - 1} · junior → senior`} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const m1 = useFadeUp(110, 10), m2 = useFadeUp(150, 10), m3 = useFadeUp(190, 10);
  const reveal = useScaleIn(290, 16);
  const myth = [
    { y: 0, t: "biết nhiều framework hơn", anim: m1 },
    { y: 70, t: "biết nhiều thuật pháp hơn", anim: m2 },
    { y: 140, t: "code nhanh hơn", anim: m3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="SENIOR · THE REAL SIGNS" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 420px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={390} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHỮNG DẤU HIỆU ngươi đã</text>
            <text x={W / 2} y={465} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">TRỞ THÀNH SENIOR</text>
          </g>
          <text x={W / 2} y={600} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1" style={m1}>// junior nghĩ senior là:</text>
          {myth.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${680 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-380} y={-28} width={760} height={56} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">{r.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 1040px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={950} w={940} h={180} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1015} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Senior CHÂN CHÍNH</text>
            <text x={W / 2} y={1075} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">có những dấu hiệu rất KỲ LẠ 👇</text>
          </g>
          <FigFooter label="10 dấu hiệu senior chân chính" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// S2 DH1
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <ShiftSlide duration={duration} num="02" sec="SCOPE WISDOM" name="'Có thật sự cần không?'" color={SLATE}
    oldLab="// junior hỏi:" oldT={["\"Làm thế nào để THÊM tính năng này?\""]}
    newLab="// senior hỏi:" newT={["\"Ta có THẬT SỰ cần nó không?\""]} />
);
// S3 DH2
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <ShiftSlide duration={duration} num="03" sec="MAINTENANCE FORESIGHT" name="'3 năm nữa ai bảo trì?'" color={JADE}
    oldLab="// nghe 'framework mới':" oldT={["junior: hưng phấn 🎉"]}
    newLab="// senior:" newT={["lo lắng: 'ba năm nữa ai bảo trì?' 😰"]} />
);
// S4 DH3
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const icon = useScaleIn(70, 14);
  const punch = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="SIMPLIFY INSTINCT" />
          <SignBadge num="3" name="'Làm sao bỏ bớt đi?'" color={ACCENT_BLUE} entry={15} />
          <g style={{ ...icon, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={620} fontSize={120} textAnchor="middle">🌀</text>
            <text x={W / 2} y={720} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Thấy giải pháp CỰC KỲ phức tạp</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={170} color={ACCENT_BLUE} thick={2.5} />
            <text x={W / 2} y={870} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// bản năng đầu tiên:</text>
            <text x={W / 2} y={935} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Làm sao BỎ BỚT đi?"</text>
          </g>
          <FigFooter label="dấu hiệu 3 · less is more" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S5 DH4
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <ShiftSlide duration={duration} num="05" sec="FEAR EVOLUTION" name="Sợ thứ 'trông có vẻ ổn'" color={VIOLET}
    oldLab="// junior sợ:" oldT={["BUG 🐛 (bug nào cũng sửa được)"]}
    newLab="// senior sợ:" newT={["thứ 'trông có vẻ đang chạy ổn' 😨"]} />
);
// S6 DH5 — coffee
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(40, 12);
  const a = useScaleIn(95, 14);
  const b = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="STAY CALM · PROD DOWN" />
          <SignBadge num="5" name="Prod sập → đi pha cà phê" color={ORANGE} entry={15} />
          <text x={W / 2} y={510} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={intro}>⚡ Production xảy ra THIÊN KIẾP</text>
          <g style={{ ...a, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={600} width={940} height={120} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 440} y={650} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// người mới</text>
            <text x={W / 2} y={695} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>😱 HOẢNG LOẠN</text>
          </g>
          <g style={{ ...b, transformOrigin: `${W / 2}px 840px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={780} w={940} h={150} color={ORANGE} thick={2.5} />
            <text x={W / 2 - 440} y={830} fontSize={22} fill={ORANGE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// còn ngươi</text>
            <text x={W / 2} y={885} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">☕ đi pha cà phê</text>
          </g>
          <FigFooter label="dấu hiệu 5 · panic is for juniors" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S7 DH6 — rewrite warning
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const u = useScaleIn(70, 14);
  const warn = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="REWRITE ALARM" />
          <SignBadge num="6" name="'Em vừa rewrite toàn bộ'" color={WARNING_RED} entry={15} />
          <g style={u}>
            <rect x={W / 2 - 470} y={520} width={940} height={130} rx={18} fill={BG_CARD} stroke={SLATE} strokeWidth={2.5} />
            <text x={W / 2 - 440} y={565} fontSize={18} fill={SLATE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🧑‍💻 Đồng môn ▸</text>
            <text x={W / 2 - 440} y={615} fontSize={32} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Em vừa rewrite toàn bộ hệ thống"</text>
          </g>
          <g style={{ ...warn, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={200} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={835} fontSize={56} textAnchor="middle">🚨</text>
            <text x={W / 2} y={910} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">linh giác cảnh báo NGUY HIỂM</text>
          </g>
          <FigFooter label="dấu hiệu 6 · big rewrite = red flag" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S8 DH7 — quote
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const l1 = useFadeUp(70, 14);
  const l2 = useScaleIn(150, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="CODE FOR HUMANS" />
          <SignBadge num="7" name="Code cho người kế nhiệm" color={AMBER} entry={15} />
          <g style={l1}>
            <text x={W / 2} y={560} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Code viết ra không phải để</text>
            <text x={W / 2} y={612} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">máy tính đọc</text>
          </g>
          <g style={{ ...l2, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={720} w={960} h={250} color={AMBER} thick={2.5} />
            <text x={W / 2} y={785} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà để NGƯỜI KẾ NHIỆM</text>
            <text x={W / 2} y={855} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không nguyền rủa</text>
            <text x={W / 2} y={912} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tổ tiên ngươi 🙏</text>
          </g>
          <FigFooter label="dấu hiệu 7 · readability > cleverness" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S9 DH8
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <ShiftSlide duration={duration} num="09" sec="EGO DEATH" name="Chỉ muốn đơn giản" color={SLATE}
    oldLab="// junior:" oldT={["cố chứng minh mình THÔNG MINH"]}
    newLab="// senior:" newT={["chỉ muốn mọi thứ ĐƠN GIẢN"]}
    extra="đã thấy quá nhiều công pháp hoa mỹ → thiên kiếp production" />
);
// S10 DH9 — no debate
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(40, 12);
  const r1 = useFadeUp(110, 9), r2 = useFadeUp(145, 9), r3 = useFadeUp(180, 9);
  const punch = useScaleIn(240, 14);
  const rows = [
    { y: 0, t: "ngôn ngữ nào mạnh hơn", anim: r1 },
    { y: 70, t: "framework nào tốt hơn", anim: r2 },
    { y: 140, t: "IDE nào chính đạo hơn", anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="NO HOLY WARS" />
          <SignBadge num="9" name="Không tranh luận vô nghĩa" color={JADE} entry={15} />
          <text x={W / 2} y={500} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1" style={intro}>// không còn tranh luận:</text>
          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${580 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-420} y={-28} width={840} height={58} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">{r.t}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={170} color={JADE} thick={2.5} />
            <text x={W / 2} y={895} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ quyết định SINH TỬ dự án</text>
            <text x={W / 2} y={955} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thường KHÔNG nằm ở đó</text>
          </g>
          <FigFooter label="dấu hiệu 9 · tools don't decide fate" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S11 DH10 — reveal "Đơn giản"
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(20, 16);
  const m1 = useFadeUp(140, 9), m2 = useFadeUp(180, 9), m3 = useFadeUp(220, 9);
  const reveal = useScaleIn(310, 18);
  const mem = [
    { y: 0, t: "vô số đêm production độ kiếp", anim: m1 },
    { y: 50, t: "vô số lần hệ thống sụp đổ", anim: m2 },
    { y: 100, t: "vô số lần thức trắng", anim: m3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="11" label="THE FINAL ANSWER" />
          <g style={{ ...q, transformOrigin: `${W / 2}px 420px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={350} w={940} h={150} color={VIOLET} thick={2.5} />
            <text x={W / 2} y={405} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// có người hỏi:</text>
            <text x={W / 2} y={458} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Cảnh giới cao nhất của SE là gì?"</text>
          </g>
          {mem.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${590 + r.y})`} style={r.anim}>
              <text x={0} y={0} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">· {r.t}</text>
            </g>
          ))}
          <text x={W / 2} y={800} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} style={m3}>// trầm mặc hồi lâu... rồi chỉ đáp một câu:</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 960px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 400} y={860} w={800} h={200} color={AMBER} thick={3} />
            <text x={W / 2} y={990} fontSize={96} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">"Đơn giản"</text>
          </g>
          <FigFooter label="dấu hiệu 10 · simplicity is the peak" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S12 ENDING
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const j = useScaleIn(40, 14);
  const s = useScaleIn(130, 14);
  const cta = useFadeUp(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="12" label="VERDICT · JUNIOR vs SENIOR" />
          <g style={{ ...j, transformOrigin: `${W / 2}px 500px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={420} width={940} height={150} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2 - 440} y={468} fontSize={24} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>JUNIOR</text>
            <text x={W / 2} y={530} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhiều năm học cách VIẾT code</text>
          </g>
          <g style={{ ...s, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={640} w={940} h={160} color={AMBER} thick={3} />
            <text x={W / 2 - 440} y={690} fontSize={24} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>SENIOR</text>
            <text x={W / 2} y={752} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">phần đời còn lại học viết ÍT code hơn</text>
          </g>
          <g transform={`translate(${W / 2}, 980)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu trúng mấy dấu hiệu rồi? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="senior · viết ít code hơn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export const DauHieuSenior: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("dau_hieu_senior/voice.mp3")} />
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
