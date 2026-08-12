import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./khong_thua_nhan_beats.json";

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
          <pattern id="ktgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ktgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ktglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
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
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · code đạo · confession · 2026</text>
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

// rotated confession stamp
const Stamp: React.FC<{ entry: number }> = ({ entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W - 210}px 210px`, transformBox: "fill-box" }}>
      <g transform={`translate(${W - 210}, 205) rotate(-9)`}>
        <rect x={-118} y={-40} width={236} height={80} rx={6} fill="none" stroke={WARNING_RED} strokeWidth={3} strokeDasharray="6 4" />
        <text x={0} y={-6} fontSize={20} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800} letterSpacing="1">🤫 KHÔNG AI</text>
        <text x={0} y={22} fontSize={20} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800} letterSpacing="1">THỪA NHẬN</text>
      </g>
    </g>
  );
};

const ChuyenBadge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 130} y={280} width={260} height={70} rx={6} fill={color} />
      <text x={W / 2} y={328} fontSize={34} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">CHUYỆN {num}</text>
      <text x={W / 2} y={416} fontSize={(name || "").length > 24 ? 34 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

const Bubble: React.FC<{ y: number; side: "user" | "ai"; who: string; lines: string[]; color: string; anim: { opacity: number; transform?: string }; big?: boolean }> = ({ y, side, who, lines, color, anim, big }) => {
  const w = 700;
  const x = side === "user" ? W / 2 + 440 - w : W / 2 - 440;
  const h = 54 + lines.length * (big ? 56 : 44);
  return (
    <g style={anim}>
      <rect x={x} y={y} width={w} height={h} rx={18} fill={BG_CARD} stroke={color} strokeWidth={2.5} />
      <text x={side === "user" ? x + w - 24 : x + 24} y={y + 34} fontSize={18} fill={color} textAnchor={side === "user" ? "end" : "start"} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{who}</text>
      {lines.map((ln, i) => (
        <text key={i} x={x + 30} y={y + 78 + i * (big ? 56 : 44)} fontSize={big ? 38 : 30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 700}>{ln}</text>
      ))}
    </g>
  );
};

const Punch: React.FC<{ y: number; lines: { t: string; c?: string; size?: number; it?: boolean }[]; anim: { opacity: number } }> = ({ y, lines, anim }) => (
  <g transform={`translate(${W / 2}, ${y})`} opacity={anim.opacity}>
    {lines.map((l, i) => (
      <text key={i} x={0} y={i * 52} fontSize={l.size || 30} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.it ? "italic" : "normal"}>{l.t}</text>
    ))}
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const sub = useFadeUp(90, 14);
  const reveal = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="CONFESSIONS · KHÔNG AI THỪA NHẬN" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={420} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Điều mọi kiếm tu CODE ĐẠO</text>
            <text x={W / 2} y={495} fontSize={52} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đều từng làm</text>
            <text x={W / 2} y={567} fontSize={50} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">nhưng KHÔNG AI THỪA NHẬN</text>
          </g>
          <text x={W / 2} y={720} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Gần như mọi dev đều từng trải qua...
          </text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 980px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={850} w={940} h={260} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={920} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">🤫 CLASSIFIED</text>
            <text x={W / 2} y={985} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nhưng khi bị hỏi tới</text>
            <text x={W / 2} y={1040} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ai cũng giả vờ như chưa từng</text>
            <text x={W / 2} y={1082} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">xảy ra 🙈</text>
          </g>
          <FigFooter label="7 confession không ai dám thừa nhận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 C1 AI PRAYER ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(60, 12);
  const u = useScaleIn(95, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="CONFESSION 01 · PRAY TO AI" />
          <ChuyenBadge num="1" name="Gặp bug → tế khí linh AI" color={SLATE} entry={15} />
          <Stamp entry={40} />
          <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Gặp bug → không nghĩ → không debug →
          </text>
          <Bubble y={640} side="user" who="Ngươi ▸" color={SLATE} anim={u} big lines={["Đạo hữu, cứu ta 🙏"]} />
          <Bubble y={870} side="ai" who="🤖 AI" color={JADE} anim={useFadeUp(150, 12)} lines={["Tất nhiên rồi, để mình", "phân tích bug này nhé..."]} />
          <text x={W / 2} y={1120} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(150, 12)}>
            … trực tiếp tế ra khí linh AI 🛐
          </text>
          <FigFooter label="chuyện 1 · debug = cầu AI" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 C2 BEFORE/AFTER ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const before = useScaleIn(70, 14);
  const after = useScaleIn(170, 14);
  const note = useFadeUp(240, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="CONFESSION 02 · CODE HUBRIS" />
          <ChuyenBadge num="2" name="Viết xong thấy mình đỉnh" color={JADE} entry={15} />
          <Stamp entry={40} />
          <g style={{ ...before, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={530} w={940} h={170} color={JADE} thick={2} />
            <text x={W / 2 - 440} y={580} fontSize={22} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// tối qua, viết xong:</text>
            <text x={W / 2} y={640} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Ta như ĐẠO TỔ chuyển thế" 😎</text>
          </g>
          <text x={W / 2} y={760} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▼ sáng hôm sau mở lại ▼</text>
          <g style={{ ...after, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={170} color={WARNING_RED} thick={2.5} />
            <text x={W / 2 - 440} y={860} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// đọc lại code đó:</text>
            <text x={W / 2} y={920} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"nên TRUY NÃ người viết" 😡</text>
          </g>
          <text x={W / 2} y={1070} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            (người viết... chính là ngươi 🫠)
          </text>
          <FigFooter label="chuyện 2 · self-code review trauma" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 C3 TIMELINE ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const s1 = useFadeUp(70, 10), s2 = useFadeUp(120, 10), s3 = useFadeUp(170, 10), s4 = useFadeUp(220, 10);
  const reveal = useScaleIn(280, 14);
  const steps = [
    { y: 0, t: "🐛 bug lúc 2h sáng", anim: s1 },
    { y: 76, t: "🔍 3 canh giờ truy tìm · không ra", anim: s2 },
    { y: 152, t: "🛌 quyết định đi ngủ", anim: s3 },
    { y: 228, t: "☀️ sáng mở máy → lỗi TỰ HẾT ✨", anim: s4 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="CONFESSION 03 · SLEEP-DRIVEN DEV" />
          <ChuyenBadge num="3" name="Đi ngủ → lỗi tự hết" color={ACCENT_BLUE} entry={15} />
          <Stamp entry={40} />
          {steps.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${540 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-440} y={-30} width={880} height={62} fill={BG_CARD} stroke={i === 3 ? JADE : ACCENT_BLUE} strokeWidth={1.5} />
              <text x={-410} y={10} fontSize={28} fill={i === 3 ? AMBER_BRIGHT : TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 1000px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1015} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ tin vào THIÊN MỘNG ĐẠI ĐẠO 🌙</text>
          </g>
          <FigFooter label="chuyện 3 · giấc ngủ chữa lành prod" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 C4 COPY ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(70, 12);
  const r1 = useFadeUp(120, 9), r2 = useFadeUp(150, 9), r3 = useFadeUp(185, 9);
  const punch = useScaleIn(235, 14);
  const rows = [
    { y: 0, t: "Ngươi", v: "✗ không hiểu", c: WARNING_RED, anim: r1 },
    { y: 70, t: "Người đăng", v: "✗ không hiểu", c: WARNING_RED, anim: r2 },
    { y: 140, t: "Production", v: "✓ hiểu", c: JADE, anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="CONFESSION 04 · COPY-PASTE FAITH" />
          <ChuyenBadge num="4" name="Copy code · không ai hiểu" color={VIOLET} entry={15} />
          <Stamp entry={40} />
          <text x={W / 2} y={550} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Copy code từ internet → chạy được ✓
          </text>
          {rows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${650 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-400} y={-28} width={800} height={58} fill={BG_CARD} stroke={r.c} strokeWidth={1.5} />
              <text x={-370} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
              <text x={370} y={10} fontSize={28} fill={r.c} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.v}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1000px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1015} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">production hiểu — vậy là ĐỦ 🤝</text>
          </g>
          <FigFooter label="chuyện 4 · it just works™" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 C5 ARCHAEOLOGY ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const icon = useScaleIn(70, 16);
  const punch = useFadeUp(170, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="CONFESSION 05 · CODE ARCHAEOLOGY" />
          <ChuyenBadge num="5" name="Đọc code mình viết 6 tháng" color={ORANGE} entry={15} />
          <Stamp entry={40} />
          <g style={{ ...icon, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={640} fontSize={130} textAnchor="middle">🏺</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={770} w={940} h={280} color={ORANGE} thick={2.5} />
            <text x={W / 2} y={835} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// đọc code của chính mình</text>
            <text x={W / 2} y={895} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giống đang KHAI QUẬT</text>
            <text x={W / 2} y={945} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bí cảnh thượng cổ</text>
            <text x={W / 2} y={1010} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">mỗi dòng mang khí tức của một kẻ xa lạ</text>
          </g>
          <FigFooter label="chuyện 5 · who wrote this?? (you did)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 C6 SHARE SCREEN ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(60, 12);
  const a = useScaleIn(110, 14);
  const punch = useFadeUp(190, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="CONFESSION 06 · HEISENBUG WATCHED" />
          <ChuyenBadge num="6" name="Share màn hình → bug biến mất" color={WARNING_RED} entry={15} />
          <Stamp entry={40} />
          <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Share màn hình cho trưởng lão → bug LẬP TỨC biến mất
          </text>
          <Bubble y={640} side="ai" who="👴 Trưởng lão" color={ACCENT_BLUE} anim={a} big lines={["Lỗi đâu? 🤨"]} />
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={870} w={940} h={180} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={930} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ngươi đứng đó...</text>
            <text x={W / 2} y={990} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">như ma tu bị thiên đạo BÓC TRẦN 😳</text>
          </g>
          <FigFooter label="chuyện 6 · observer effect on bugs" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 C7 PHONG ẤN ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(60, 12);
  const seq = ["commit", "push", "merge", "deploy"];
  const seqFrames = [120, 150, 180, 210];
  const seal = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="CONFESSION 07 · SEAL THE SCENE" />
          <ChuyenBadge num="7" name="Sửa được mà không biết sao" color={AMBER} entry={15} />
          <Stamp entry={40} />
          <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Sửa bug thành công · nhưng KHÔNG biết vì sao →
          </text>
          {seq.map((s, i) => {
            const a = useScaleIn(seqFrames[i], 8);
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2 - 345 + i * 230}px 690px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 345 + i * 230 - 95} y={650} width={190} height={80} rx={8} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
                <text x={W / 2 - 345 + i * 230} y={700} fontSize={24} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{s}</text>
              </g>
            );
          })}
          <g style={{ ...seal, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={840} w={940} h={210} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={910} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🔒 PHONG ẤN HIỆN TRƯỜNG</text>
            <text x={W / 2} y={975} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không cho bất kỳ ai</text>
            <text x={W / 2} y={1018} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">điều tra thêm</text>
          </g>
          <FigFooter label="chuyện 7 · don't touch, just ship" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const a1 = useFadeUp(20, 14);
  const e1 = useScaleIn(110, 12), e2 = useScaleIn(150, 12), e3 = useScaleIn(190, 12), e4 = useScaleIn(230, 12);
  const cta = useFadeUp(330, 14);
  const els = [
    { x: -245, y: -55, t: "kinh nghiệm", c: ACCENT_BLUE, anim: e1 },
    { x: 245, y: -55, t: "trực giác", c: JADE, anim: e2 },
    { x: -245, y: 65, t: "nhân quả", c: VIOLET, anim: e3 },
    { x: 245, y: 65, t: "chút khí vận", c: ORANGE, anim: e4 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="VERDICT · CODE ĐẠO" />
          <g style={a1}>
            <text x={W / 2} y={400} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Code đạo chưa bao giờ</text>
            <text x={W / 2} y={452} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chỉ là kỹ thuật</text>
          </g>
          <text x={W / 2} y={560} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={a1}>// mà là sự kết hợp của:</text>
          <g transform={`translate(0, 720)`}>
            {els.map((el, i) => (
              <g key={i} style={{ ...el.anim, transformOrigin: `${W / 2 + el.x}px ${el.y}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 + el.x - 220} y={el.y - 44} width={440} height={88} rx={8} fill={BG_CARD} stroke={el.c} strokeWidth={2} />
                <text x={W / 2 + el.x} y={el.y + 10} fontSize={32} fill={el.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{el.t}</text>
              </g>
            ))}
          </g>
          <g transform={`translate(${W / 2}, 1080)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu trúng mấy chuyện rồi? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="code đạo · kỹ thuật + trực giác + khí vận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const DieuKhongAiThuaNhan: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("khong_thua_nhan/voice.mp3")} />
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
