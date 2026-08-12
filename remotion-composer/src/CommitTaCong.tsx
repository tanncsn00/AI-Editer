import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./commit_ta_cong_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

// Blueprint palette
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

// ===== anim utils =====
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
const useType = (e: number, n: number) => {
  // returns how many of n lines should be visible at current frame (typewriter), 1 line / 8 frames
  const f = useCurrentFrame();
  return Math.max(0, Math.min(n, Math.floor((f - e) / 8) + 1));
};

// ===== BG =====
const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ctglow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ctscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ctgrid)" />
        <rect width={W} height={H} fill="url(#ctgrid2)" />
        <rect width={W} height={H} fill="url(#ctglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ctscan)" />
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

// Type badge: LOẠI X pill + name
const TypeBadge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 130} y={250} width={260} height={70} rx={6} fill={color} />
      <text x={W / 2} y={298} fontSize={34} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">LOẠI {num}</text>
      <text x={W / 2} y={385} fontSize={46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// git-log terminal box (the visual gag). lines reveal typewriter-style.
const CommitTerminal: React.FC<{ y: number; color: string; lines: { h: string; m: string }[]; entry: number }> = ({ y, color, lines, entry }) => {
  const a = useScaleIn(entry, 14);
  const visible = useType(entry + 6, lines.length);
  const x = W / 2 - 430;
  const w = 860;
  const head = 56;
  const lineH = 64;
  const h = head + lines.length * lineH + 24;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      {/* window */}
      <rect x={x} y={y} width={w} height={h} rx={10} fill={BG_TERM} stroke={color} strokeWidth={2} />
      {/* header bar */}
      <rect x={x} y={y} width={w} height={head} rx={10} fill={BG_CARD} />
      <rect x={x} y={y + head - 10} width={w} height={10} fill={BG_CARD} />
      <circle cx={x + 28} cy={y + head / 2} r={8} fill={WARNING_RED} />
      <circle cx={x + 54} cy={y + head / 2} r={8} fill={AMBER} />
      <circle cx={x + 80} cy={y + head / 2} r={8} fill={JADE} />
      <text x={x + w / 2} y={y + head / 2 + 6} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">git log --oneline</text>
      {/* lines */}
      {lines.map((ln, i) => (
        <g key={i} opacity={i < visible ? 1 : 0}>
          <text x={x + 30} y={y + head + 42 + i * lineH} fontSize={26} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{ln.h}</text>
          <text x={x + 160} y={y + head + 42 + i * lineH} fontSize={28} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{ln.m}</text>
        </g>
      ))}
    </g>
  );
};

// ============ SLIDE 1: HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t1 = useScaleIn(20, 16), t2 = useFadeUp(60, 14);
  const r1 = useFadeUp(150, 12), r2 = useFadeUp(210, 12), r3 = useFadeUp(270, 12);
  const reacts = [
    { y: 0, who: "senior engineer", what: "lập tức trầm mặc", c: ACCENT_BLUE, anim: r1 },
    { y: 110, who: "DevOps", what: "tụng hộ tâm chú", c: JADE, anim: r2 },
    { y: 220, who: "production", what: "chuẩn bị độ kiếp", c: WARNING_RED, anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="CURSED COMMITS · TÀ CÔNG" />
          <g style={{ ...t1, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={400} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">NHỮNG LOẠI</text>
            <text x={W / 2} y={490} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">COMMIT MESSAGE</text>
            <text x={W / 2} y={565} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">TÀ CÔNG CẤM THUẬT</text>
          </g>
          <text x={W / 2} y={700} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={t2}>
            Mỗi codebase thượng cổ đều có vài commit cực tà môn...
          </text>
          <text x={W / 2} y={830} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={t2}>
            // chỉ cần nhìn thấy:
          </text>
          {reacts.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${950 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-440} y={-42} width={880} height={84} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
              <text x={-410} y={9} fontSize={28} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>{r.who}</text>
              <text x={420} y={9} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.what}</text>
            </g>
          ))}
          <FigFooter num="1" label="7 loại commit tà môn nhất giới IT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// generic punchline text block
const Punch: React.FC<{ y: number; lines: { t: string; c?: string; size?: number; it?: boolean }[]; anim: { opacity: number } }> = ({ y, lines, anim }) => (
  <g transform={`translate(${W / 2}, ${y})`} opacity={anim.opacity}>
    {lines.map((l, i) => (
      <text key={i} x={0} y={i * 52} fontSize={l.size || 28} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 800 : 600} fontStyle={l.it ? "italic" : "normal"}>{l.t}</text>
    ))}
  </g>
);

// ============ SLIDE 2: LOẠI 1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useFadeUp(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="DENIAL · ĐOẠN TUYỆT HẬU LỘ" />
          <TypeBadge num="1" name="ĐOẠN TUYỆT HẬU LỘ" color={SLATE} entry={15} />
          <CommitTerminal y={470} color={SLATE} entry={90} lines={[
            { h: "a3f10c2", m: "final_final" },
            { h: "7e9b441", m: "final_v2" },
            { h: "c1d802a", m: "final_v2_last" },
            { h: "0ffae31", m: "final_ok_real" },
          ]} />
          <Punch y={1170} anim={punch} lines={[
            { t: "Sửa cùng một bug · suốt ba canh giờ", c: TEXT_SEC, it: true },
            { t: "\"lần này thật sự kết thúc rồi\"", c: TEXT_PRI, size: 32 },
            { t: "— nhưng production xưa nay khó đoán", c: AMBER_BRIGHT, size: 26, it: true },
          ]} />
          <FigFooter num="2" label="loại 1 · không bao giờ là final" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 3: LOẠI 2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useFadeUp(190, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="MYSTERY · THIÊN CƠ BẤT KHẢ TIẾT LỘ" />
          <TypeBadge num="2" name="THIÊN CƠ BẤT KHẢ TIẾT LỘ" color={JADE} entry={15} />
          <CommitTerminal y={490} color={JADE} entry={85} lines={[
            { h: "9b2c7df", m: "update logic" },
          ]} />
          <g transform={`translate(${W / 2}, 850)`} opacity={punch.opacity}>
            <text x={0} y={0} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Logic gì? → không ai biết</text>
            <text x={0} y={70} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Sửa ở đâu? → thiên cơ bất khả tiết lộ</text>
          </g>
          <Punch y={1100} anim={punch} lines={[
            { t: "Ngay cả người viết commit", c: TEXT_SEC, it: true },
            { t: "một tuần sau cũng không nhớ mình làm gì", c: AMBER_BRIGHT, size: 30, it: true },
          ]} />
          <FigFooter num="3" label="loại 2 · zero thông tin" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 4: LOẠI 3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(95, 12);
  const st1 = useFadeUp(150, 10), st2 = useFadeUp(185, 10), st3 = useFadeUp(220, 10);
  const status = [
    { y: 0, t: "Linh khí cạn kiệt", anim: st1 },
    { y: 86, t: "CPU quá nhiệt", anim: st2 },
    { y: 172, t: "Đạo tâm bắt đầu tan vỡ", anim: st3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="BURNOUT · TẨU HỎA NHẬP MA" />
          <TypeBadge num="3" name="TẨU HỎA NHẬP MA" color={ACCENT_BLUE} entry={15} />
          <CommitTerminal y={470} color={ACCENT_BLUE} entry={85} lines={[
            { h: "ee10a3b", m: "aaa" },
            { h: "4c7f902", m: "test" },
            { h: "b88d1e0", m: "asdasd" },
            { h: "1a0c5fe", m: "fuckkkkk" },
            { h: "77e2bb9", m: "cmn" },
          ]} />
          <text x={W / 2} y={1290} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Dev kia đã thức quá lâu →
          </text>
          {status.map((s, i) => (
            <g key={i} transform={`translate(${W / 2}, ${1380 + s.y})`} opacity={s.anim.opacity}>
              <text x={0} y={0} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>▾ {s.t}</text>
            </g>
          ))}
          <FigFooter num="4" label="loại 3 · 3AM commit" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 5: LOẠI 4 ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const punch = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="TECH DEBT · HIẾN TẾ THỌ NGUYÊN" />
          <TypeBadge num="4" name="HIẾN TẾ THỌ NGUYÊN" color={VIOLET} entry={15} />
          <CommitTerminal y={490} color={VIOLET} entry={85} lines={[
            { h: "3df88a1", m: "quick fix" },
            { h: "9021ee4", m: "temp fix" },
            { h: "c4b7700", m: "fix for now" },
          ]} />
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1180px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1080} w={940} h={200} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1135} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// không gì sống dai hơn "fix tạm"</text>
            <text x={W / 2} y={1195} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Rất nhiều legacy system</text>
            <text x={W / 2} y={1248} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bắt đầu từ câu "mai sửa sau"</text>
          </g>
          <FigFooter num="5" label="loại 4 · temp = permanent" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 6: LOẠI 5 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const l2 = useFadeUp(210, 12);
  const warn = useScaleIn(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="ANCIENT SEAL · THƯỢNG CỔ PHONG ẤN" />
          <TypeBadge num="5" name="THƯỢNG CỔ PHONG ẤN" color={ORANGE} entry={15} />
          <CommitTerminal y={490} color={ORANGE} entry={85} lines={[
            { h: "00dead0", m: "it works dont touch" },
          ]} />
          <text x={W / 2} y={830} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={l2}>
            Phong ấn cuối của một vị cổ thần engineer
          </text>
          <text x={W / 2} y={890} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} style={l2}>
            // không ai hiểu code bên trong chạy ra sao
          </text>
          <g style={{ ...warn, transformOrigin: `${W / 2}px 1120px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1020} w={940} h={200} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1080} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚠ MỖI LẦN CÓ NGƯỜI CỐ SỬA</text>
            <text x={W / 2} y={1150} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>production trực tiếp</text>
            <text x={W / 2} y={1200} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">xuất hiện thiên kiếp</text>
          </g>
          <FigFooter num="6" label="loại 5 · do not touch" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 7: LOẠI 6 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const r1 = useFadeUp(150, 12), r2 = useFadeUp(210, 12), r3 = useFadeUp(270, 12);
  const reacts = [
    { y: 0, who: "senior engineer", what: "lạnh sống lưng", c: ACCENT_BLUE, anim: r1 },
    { y: 100, who: "DevOps", what: "backup database", c: JADE, anim: r2 },
    { y: 200, who: "PM", what: "soạn slide cho khách", c: WARNING_RED, anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="GREAT REWRITE · NGHỊCH THIÊN CẢI MỆNH" />
          <TypeBadge num="6" name="NGHỊCH THIÊN CẢI MỆNH" color={WARNING_RED} entry={15} />
          <CommitTerminal y={470} color={WARNING_RED} entry={85} lines={[
            { h: "f00ba12", m: "rewrite all" },
            { h: "9deadc3", m: "refactor core" },
            { h: "ba5eba1", m: "remove old system" },
          ]} />
          {reacts.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${1130 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-440} y={-40} width={880} height={80} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
              <text x={-410} y={9} fontSize={27} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>{r.who}</text>
              <text x={420} y={9} fontSize={27} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ {r.what}</text>
            </g>
          ))}
          <FigFooter num="7" label="loại 6 · here be dragons" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 8: LOẠI 7 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const q1 = useFadeUp(110, 10), q2 = useFadeUp(140, 10), q3 = useFadeUp(170, 10);
  const qa = [
    { y: 0, q: "Bug gì?", a: "không nói", anim: q1 },
    { y: 96, q: "Fix ở đâu?", a: "không biết", anim: q2 },
    { y: 192, q: "Ảnh hưởng hệ thống nào?", a: "hữu duyên mới hiểu", anim: q3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="FINAL BOSS · TÂM MA CUỐI CÙNG" />
          <TypeBadge num="7" name="TÂM MA CUỐI CÙNG" color={AMBER} entry={15} />
          <CommitTerminal y={490} color={AMBER} entry={70} lines={[
            { h: "deadbef", m: "fix bug" },
          ]} />
          {qa.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${900 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-460} y={-36} width={920} height={72} fill={BG_CARD} stroke={AMBER} strokeWidth={1.5} />
              <text x={-435} y={9} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.q}</text>
              <text x={435} y={9} fontSize={26} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">→ {r.a}</text>
            </g>
          ))}
          <FigFooter num="8" label="loại 7 · the ultimate void" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 9: ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const big = useScaleIn(20, 16);
  const insight = useScaleIn(120, 16);
  const punch = useFadeUp(300, 14);
  const clock = useScaleIn(400, 14);
  const cta = useFadeUp(490, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="GIT ĐẠO · CẢNH GIỚI TỐI CAO" />
          <g style={{ ...big, transformOrigin: `${W / 2}px 360px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={360} fontSize={108} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">GIT ĐẠO</text>
          </g>
          <g style={insight}>
            <TechBox x={W / 2 - 470} y={460} w={940} h={160} color={AMBER} thick={2} />
            <text x={W / 2} y={520} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// một commit ngắn ngủi</text>
            <text x={W / 2} y={578} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">ẩn chứa nhân quả toàn tam giới production</text>
          </g>
          <Punch y={760} anim={punch} lines={[
            { t: "Muốn nhìn thấu đạo tâm một dev", c: TEXT_SEC, size: 30, it: true },
            { t: "đừng xem CV", c: WARNING_RED, size: 38 },
          ]} />
          <g style={{ ...clock, transformOrigin: `${W / 2}px 1000px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={920} w={940} h={170} color={AMBER} thick={2.5} />
            <text x={W / 2} y={985} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Hãy xem commit message của hắn</text>
            <text x={W / 2} y={1045} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lúc 2 giờ sáng 🌙</text>
          </g>
          <g transform={`translate(${W / 2}, 1280)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu thuộc loại nào? 👇</text>
            <line x1={-220} y1={50} x2={220} y2={50} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={100} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter num="9" label="git đạo · commit lúc 2AM tiết lộ đạo tâm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const CommitTaCong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("commit_ta_cong/voice.mp3")} />
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
