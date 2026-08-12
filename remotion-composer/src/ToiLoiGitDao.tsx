import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./toi_loi_git_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

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
          <pattern id="tlgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tlgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tlglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tlscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tlgrid)" />
        <rect width={W} height={H} fill="url(#tlgrid2)" />
        <rect width={W} height={H} fill="url(#tlglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tlscan)" />
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
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · git đạo · 2026</text>
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
const Badge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 110} y={260} width={220} height={68} rx={6} fill={color} />
      <text x={W / 2} y={306} fontSize={32} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">TỘI {num}</text>
      <text x={W / 2} y={392} fontSize={(name || "").length > 24 ? 34 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// git terminal showing a command
const GitTerm: React.FC<{ y: number; cmd: string; out?: string; outColor?: string; color: string; entry: number }> = ({ y, cmd, out, outColor, color, entry }) => {
  const a = useScaleIn(entry, 14);
  const frame = useCurrentFrame();
  const x = W / 2 - 440;
  const w = 880;
  const h = out ? 170 : 120;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={BG_TERM} stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={48} rx={10} fill={BG_CARD} />
      <rect x={x} y={y + 38} width={w} height={10} fill={BG_CARD} />
      <circle cx={x + 26} cy={y + 24} r={7} fill={WARNING_RED} />
      <circle cx={x + 50} cy={y + 24} r={7} fill={AMBER} />
      <circle cx={x + 74} cy={y + 24} r={7} fill={JADE} />
      <text x={x + w / 2} y={y + 30} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1">bash</text>
      <text x={x + 28} y={y + 95} fontSize={28} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{cmd}</text>
      {out && <text x={x + 28} y={y + 140} fontSize={26} fill={outColor || WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > entry + 22 ? 1 : 0}>{out}</text>}
    </g>
  );
};

const Conseq: React.FC<{ y: number; color: string; lines: { t: string; c?: string; size?: number; it?: boolean }[]; entry: number }> = ({ y, color, lines, entry }) => {
  const a = useScaleIn(entry, 14);
  const h = 80 + lines.length * 52;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <TechBox x={W / 2 - 470} y={y} w={940} h={h} color={color} thick={2.5} />
      <text x={W / 2} y={y + 46} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// ⚠ hậu quả</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 96 + i * 52} fontSize={l.size || 32} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.it ? "italic" : "normal"}>{l.t}</text>
      ))}
    </g>
  );
};

// reusable sin slide
const SinSlide: React.FC<{
  duration: number; num: string; sec: string; name: string; color: string;
  cmd: string; out?: string; outColor?: string; conseq: { t: string; c?: string; size?: number; it?: boolean }[]; fig: string;
}> = ({ duration, num, sec, name, color, cmd, out, outColor, conseq, fig }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num={num} label={sec} />
        <Badge num={`${parseInt(num) - 1}`} name={name} color={color} entry={15} />
        <GitTerm y={500} cmd={cmd} out={out} outColor={outColor} color={color} entry={75} />
        <Conseq y={out ? 760 : 710} color={WARNING_RED} lines={conseq} entry={160} />
        <FigFooter label={fig} />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const r1 = useFadeUp(120, 10), r2 = useFadeUp(150, 10), r3 = useFadeUp(180, 10);
  const note = useFadeUp(230, 12);
  const rec = [
    { y: 0, t: "mọi commit", anim: r1 },
    { y: 64, t: "mọi merge", anim: r2 },
    { y: 128, t: "mọi sai lầm", anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="GIT ĐẠO · THE LEDGER OF KARMA" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 450px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={400} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHỮNG TỘI LỖI ai cũng phạm</text>
            <text x={W / 2} y={478} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">TRONG GIT ĐẠO</text>
          </g>
          <text x={W / 2} y={620} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={note}>
            Git đạo lưu giữ TOÀN BỘ nhân quả của tông môn...
          </text>
          <text x={W / 2} y={750} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1" style={r1}>// thiên đạo ghi lại:</text>
          {rec.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${830 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-380} y={-26} width={760} height={54} fill={BG_CARD} stroke={AMBER} strokeWidth={1.5} />
              <text x={0} y={9} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📜 {r.t}</text>
            </g>
          ))}
          <text x={W / 2} y={1110} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={note}>
            … không gì thoát khỏi git history 👁️
          </text>
          <FigFooter label="8 tội lỗi trong git đạo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2-S4, S6-S8 via SinSlide ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="02" sec="DIRECT TO PROD" name="Commit thẳng lên prod" color={SLATE}
    cmd="$ git push origin production" out="# no review · no test" outColor={TEXT_MUTE}
    conseq={[{ t: "Định sửa 1 dòng → 10 phút sau", c: TEXT_PRI }, { t: "sát khí lan khắp tông môn 💀", c: AMBER_BRIGHT, size: 36 }]} fig="tội 1 · YOLO deploy" />
);
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="03" sec="USELESS MESSAGE" name="Commit 'fix bug'" color={JADE}
    cmd={'$ git commit -m "fix bug"'} conseq={[{ t: "Bug nào? Sửa gì? Không ai biết", c: TEXT_PRI }, { t: "kể cả ngươi · 3 ngày sau cũng quên", c: AMBER_BRIGHT, size: 32, it: true }]} fig="tội 2 · zero context" />
);
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="04" sec="WRONG BRANCH" name="Push nhầm branch" color={ACCENT_BLUE}
    cmd="$ git push" out="✗ pushed to WRONG branch!" conseq={[{ t: "Đạo tâm xuất hiện VẾT NỨT", c: TEXT_PRI }, { t: "nhân quả bắt đầu vận chuyển 🌀", c: AMBER_BRIGHT, size: 34 }]} fig="tội 3 · oops, wrong branch" />
);
// S5 custom (conflict)
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const term = useScaleIn(60, 14);
  const btn = useScaleIn(160, 14);
  const punch = useFadeUp(240, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="MERGE CONFLICT · BLIND FAITH" />
          <Badge num="4" name="'Accept Incoming'" color={VIOLET} entry={15} />
          <g style={{ ...term, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={490} width={880} height={230} rx={10} fill={BG_TERM} stroke={VIOLET} strokeWidth={2} />
            <text x={W / 2 - 410} y={540} fontSize={24} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{"<<<<<<< HEAD"}</text>
            <text x={W / 2 - 410} y={585} fontSize={24} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>  code của ngươi...</text>
            <text x={W / 2 - 410} y={630} fontSize={24} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{"======="}</text>
            <text x={W / 2 - 410} y={675} fontSize={24} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>  code người khác...</text>
            <text x={W / 2 - 410} y={710} fontSize={24} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{">>>>>>> incoming"}</text>
          </g>
          <text x={W / 2} y={790} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={btn}>không đọc · không phân tích · chỉ niệm chú 🙏 rồi:</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 200} y={830} width={400} height={80} rx={10} fill={JADE} />
            <text x={W / 2} y={882} fontSize={32} fill={BG_NAVY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>✓ Accept Incoming</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={980} w={940} h={130} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1060} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vận mệnh production rời khỏi tay ngươi 🎲</text>
          </g>
          <FigFooter label="tội 4 · accept and pray" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="06" sec="THE ETERNAL TODO" name="'Mai sẽ dọn dẹp lại'" color={ORANGE}
    cmd="// TODO: dọn dẹp lại sau" conseq={[{ t: "Lời hứa cuối của vô số kiếm tu", c: TEXT_PRI, it: true }, { t: "tới hôm nay · CHƯA AI quay lại 🪦", c: AMBER_BRIGHT, size: 34 }]} fig="tội 5 · temporary = permanent" />
);
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="07" sec="THE CULPRIT IS YOU" name="Git blame ra chính mình" color={WARNING_RED}
    cmd="$ git blame legacy.js" out="b7f2  ← YOU  (2 năm trước)" conseq={[{ t: "Định nguyền rủa kẻ viết đoạn này", c: TEXT_PRI }, { t: "hung thủ... chính là BẢN THÂN ngươi 😱", c: AMBER_BRIGHT, size: 32 }]} fig="tội 6 · plot twist: it's you" />
);
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <SinSlide duration={duration} num="08" sec="THE FORBIDDEN ART" name="Force push" color={SLATE}
    cmd="$ git push --force" out="⚠ rewriting history..." conseq={[{ t: "Trưởng lão cảm nhận thiên cơ bất ổn", c: TEXT_PRI }, { t: "vội mở backup + tụng hộ tâm chú 🚨", c: AMBER_BRIGHT, size: 34 }]} fig="tội 7 · here be dragons" />
);
// S9 custom — branch escalation
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const branches = ["final", "final_v2", "final_v3", "final_v3_final", "final_v3_final_fix", "final_v3_final_fix_new"];
  const punch = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="BRANCH HELL" />
          <Badge num="8" name="Branch final → final_v3..." color="#A4B5D0" entry={15} />
          <g style={{ ...useScaleIn(70, 14), transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={480} width={880} height={340} rx={10} fill={BG_TERM} stroke={SLATE} strokeWidth={2} />
            <rect x={W / 2 - 440} y={480} width={880} height={46} rx={10} fill={BG_CARD} />
            <text x={W / 2} y={510} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>$ git branch</text>
            {branches.map((b, i) => (
              <text key={i} x={W / 2 - 410} y={575 + i * 44} fontSize={25} fill={i === branches.length - 1 ? WARNING_RED : SLATE} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 100 + i * 20 ? 1 : 0}>🌿 {b}</text>
            ))}
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1000px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={890} w={940} h={210} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={950} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Git không còn lưu MÃ NGUỒN</text>
            <text x={W / 2} y={1015} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là nơi PHONG ẤN tâm ma 🔮</text>
            <text x={W / 2} y={1065} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">từ nhiều đời trước</text>
          </g>
          <FigFooter label="tội 8 · final is never final" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};
// S10 ENDING
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const n1 = useFadeUp(90, 10), n2 = useFadeUp(130, 10);
  const term = useScaleIn(210, 14);
  const reveal = useScaleIn(300, 16);
  const cta = useFadeUp(420, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="VERDICT · THE TRUTH" />
          <text x={W / 2} y={360} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Bug không đáng sợ. Conflict cũng không.
          </text>
          <text x={W / 2} y={440} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={n1}>
            Điều đáng sợ nhất là một ngày...
          </text>
          <g style={{ ...term, transformOrigin: `${W / 2}px 590px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={520} width={760} height={120} rx={10} fill={BG_TERM} stroke={AMBER} strokeWidth={2} />
            <rect x={W / 2 - 380} y={520} width={760} height={44} rx={10} fill={BG_CARD} />
            <text x={W / 2} y={548} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash</text>
            <text x={W / 2 - 350} y={612} fontSize={30} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ git log --oneline</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={210} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={765} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>và phát hiện: toàn bộ nhân quả</text>
            <text x={W / 2} y={835} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều do CHÍNH MÌNH tạo ra 😱</text>
          </g>
          <g transform={`translate(${W / 2}, 1030)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu phạm mấy tội rồi? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="git đạo · nhân quả do chính mình tạo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const ToiLoiGitDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("toi_loi_git/voice.mp3")} />
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
