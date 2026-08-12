import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./fix_bug_beats.json";

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
          <pattern id="fbgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="fbgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="fbglow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fbscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#fbgrid)" />
        <rect width={W} height={H} fill="url(#fbgrid2)" />
        <rect width={W} height={H} fill="url(#fbglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#fbscan)" />
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
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · code đạo · 2026</text>
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
      <rect x={W / 2 - 130} y={250} width={260} height={70} rx={6} fill={color} />
      <text x={W / 2} y={298} fontSize={34} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">KIỂU {num}</text>
      <text x={W / 2} y={388} fontSize={(name || "").length > 20 ? 38 : 46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// the universal gag console: action → ✓ bug gone → # why? unknown
const FixConsole: React.FC<{ y: number; color: string; action: string; entry: number }> = ({ y, color, action, entry }) => {
  const a = useScaleIn(entry, 14);
  const frame = useCurrentFrame();
  const x = W / 2 - 430;
  const w = 860;
  const head = 54;
  const lineH = 72;
  const h = head + 3 * lineH + 22;
  const okShow = frame > entry + 22;
  const whyShow = frame > entry + 40;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={BG_TERM} stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={head} rx={10} fill={BG_CARD} />
      <rect x={x} y={y + head - 10} width={w} height={10} fill={BG_CARD} />
      <circle cx={x + 28} cy={y + head / 2} r={8} fill={WARNING_RED} />
      <circle cx={x + 54} cy={y + head / 2} r={8} fill={AMBER} />
      <circle cx={x + 80} cy={y + head / 2} r={8} fill={JADE} />
      <text x={x + w / 2} y={y + head / 2 + 6} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">bash — fixing bug</text>
      {/* action */}
      <text x={x + 30} y={y + head + 50} fontSize={28} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{action}</text>
      {/* bug gone */}
      <text x={x + 30} y={y + head + 50 + lineH} fontSize={28} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={okShow ? 1 : 0}>✓ bug resolved</text>
      {/* why */}
      <text x={x + 30} y={y + head + 50 + 2 * lineH} fontSize={26} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} opacity={whyShow ? 1 : 0}># vì sao? → không ai biết 🤷</text>
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

// reusable type slide
const TypeSlide: React.FC<{
  duration: number; num: string; sec: string; name: string; color: string; action: string;
  punchY: number; punch: { t: string; c?: string; size?: number; it?: boolean }[]; fig: string;
}> = ({ duration, num, sec, name, color, action, punchY, punch, fig }) => {
  const p = useFadeUp(160, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num={num} label={sec} />
          <TypeBadge num={`${parseInt(num) - 1}`} name={name} color={color} entry={15} />
          <FixConsole y={490} color={color} action={action} entry={75} />
          <Punch y={punchY} anim={p} lines={punch} />
          <FigFooter num={fig} label={`kiểu ${parseInt(num) - 1} · self-healing bug`} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const k1 = useFadeUp(110, 10), k2 = useFadeUp(150, 10), k3 = useFadeUp(190, 10);
  const reveal = useScaleIn(270, 16);
  const kho = [
    { y: 0, t: "Không cần hiểu thiên cơ", anim: k1 },
    { y: 78, t: "Không cần giải thích nhân quả", anim: k2 },
    { y: 156, t: "Chỉ cần... bug biến mất", anim: k3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="SELF-HEALING BUG · CODE ĐẠO" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={390} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">TOP 7 KIỂU FIX BUG</text>
            <text x={W / 2} y={470} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">NHƯNG KHÔNG BIẾT</text>
            <text x={W / 2} y={540} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">VÌ SAO HẾT LỖI</text>
          </g>
          {kho.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${700 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-430} y={-30} width={860} height={60} fill={BG_CARD} stroke={i === 2 ? AMBER : TEXT_MUTE} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={28} fill={i === 2 ? AMBER_BRIGHT : TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{r.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 1180px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1080} w={940} h={200} color={JADE} thick={2.5} />
            <text x={W / 2} y={1140} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// người ta gọi đó là</text>
            <text x={W / 2} y={1210} fontSize={52} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"thiên đạo tự chữa lành"</text>
          </g>
          <FigFooter num="1" label="7 kiểu bug tự khỏi không rõ lý do" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2-S8 TYPES ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="02" sec="RESTART · TẮT BẬT LUÂN HỒI" name="Tắt bật luân hồi" color={SLATE} action="$ restart service" punchY={1030}
    punch={[{ t: "Ngay lập tức · tâm ma tan biến", c: TEXT_PRI, size: 34 }, { t: "không ai hiểu · cũng không ai dám hỏi", c: AMBER_BRIGHT, size: 28, it: true }]} fig="2" />
);
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="03" sec="ADD A LOG · PHÙ CHÚ LOG" name="Phù chú log thiên nhãn" color={JADE} action={'+ logger.debug("here")'} punchY={1030}
    punch={[{ t: "Thêm 1 dòng log → bug biến mất", c: TEXT_PRI, size: 34 }, { t: "chân lý: log càng nhiều · tà ma càng sợ", c: AMBER_BRIGHT, size: 28, it: true }]} fig="3" />
);
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="04" sec="1 CHAR EDIT · CHỈNH NHẸ" name="Chỉnh nhẹ phong ấn" color={ACCENT_BLUE} action={'~ edit: " , " + 1 space'} punchY={1030}
    punch={[{ t: "Chỉ 1 dấu phẩy · production ổn định", c: TEXT_PRI, size: 32 }, { t: "Trưởng lão DevOps: \"không được hỏi vì sao\"", c: AMBER_BRIGHT, size: 27, it: true }]} fig="4" />
);
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="05" sec="DELETE & RETYPE · NGUYÊN BẢN" name="Trả về nguyên bản thượng cổ" color={VIOLET} action="$ rm file && paste (y hệt)" punchY={1030}
    punch={[{ t: "Xóa code · paste lại Y HỆT", c: TEXT_PRI, size: 34 }, { t: "lần này thiên đạo chấp nhận · bug siêu độ", c: AMBER_BRIGHT, size: 28, it: true }]} fig="5" />
);
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="06" sec="DO NOTHING · THIÊN THỜI" name="Thiên thời luân hồi" color={ORANGE} action="# do nothing · sleep 1 night" punchY={1030}
    punch={[{ t: "Để qua 1 đêm → bug tự viên tịch", c: TEXT_PRI, size: 34 }, { t: "đó là lúc hệ thống tự tu luyện", c: AMBER_BRIGHT, size: 28, it: true }]} fig="6" />
);
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="07" sec="REORDER · ĐỔI HÌNH TRẬN" name="Đổi hình trận pháp" color={WARNING_RED} action="~ reorder import + format" punchY={1030}
    punch={[{ t: "Không sửa logic · chỉ đổi thứ tự", c: TEXT_PRI, size: 34 }, { t: "không ai hiểu · nhưng ai cũng gật đầu", c: AMBER_BRIGHT, size: 28, it: true }]} fig="7" />
);
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="08" sec="ROLLBACK · NGHỊCH NHÂN QUẢ" name="Rollback nghịch nhân quả" color={AMBER} action="$ git checkout v-prev" punchY={1030}
    punch={[{ t: "Quay về bản cũ → bug biến mất", c: TEXT_PRI, size: 34 }, { t: "như chưa từng sinh ra trong dòng thời gian", c: AMBER_BRIGHT, size: 28, it: true }]} fig="8" />
);

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const box = useScaleIn(110, 16);
  const big = useScaleIn(200, 16);
  const cta = useFadeUp(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE TRUTH · CODE ĐẠO" />
          <text x={W / 2} y={400} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Trong cốt đạo...
          </text>
          <g style={box}>
            <TechBox x={W / 2 - 470} y={500} w={940} h={150} color={AMBER} thick={2} />
            <text x={W / 2} y={560} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// có những loại bug</text>
            <text x={W / 2} y={615} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG cần bị diệt</text>
          </g>
          <g style={{ ...big, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={790} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Chỉ cần thiên đạo tạm thời...</text>
            <text x={W / 2} y={880} fontSize={64} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">QUÊN nó đi 🌙</text>
          </g>
          <g transform={`translate(${W / 2}, 1130)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu hay fix bug kiểu nào? 👇</text>
            <line x1={-230} y1={50} x2={230} y2={50} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={100} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter num="9" label="code đạo · để thiên đạo quên bug đi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const Top7FixBug: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("fix_bug/voice.mp3")} />
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
