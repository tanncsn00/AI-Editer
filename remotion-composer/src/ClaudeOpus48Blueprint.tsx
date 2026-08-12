import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./claude_opus_48_truyen_ky_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// Blueprint palette
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

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

// ========== ANIMATION UTILS ==========
const useFadeUp = (entryFrame: number, durationFrames = 14) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(frame, [entryFrame, entryFrame + durationFrames], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};

const useScaleIn = (entryFrame: number, durationFrames = 18) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};

const useFade = (entryFrame: number, durationFrames = 14) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [entryFrame, entryFrame + durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity };
};

// pulsing glow for emphasis nodes
const usePulse = (entryFrame: number) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [entryFrame, entryFrame + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = 0.5 + 0.5 * Math.sin((frame - entryFrame) / 14);
  return { opacity: o, pulse: 0.5 + 0.5 * p };
};

// ========== BLUEPRINT BG ==========
const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bp2grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="bp2grid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="bp2glow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bp2scan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#bp2grid)" />
        <rect width={W} height={H} fill="url(#bp2grid2)" />
        <rect width={W} height={H} fill="url(#bp2glow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#bp2scan)" />
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
  const totalFrames = duration * FPS;
  const scale = interpolate(frame, [0, totalFrames], [1.0, 1.03], { extrapolateRight: "clamp" });
  return (
    <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>
      {children}
    </div>
  );
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const a1 = useFadeUp(0, 10);
  const a2 = useFadeUp(4, 10);
  const a3 = useFadeUp(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>
        [{num} / 08]
      </text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={0.5} style={a2} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={a3}>
        {label}
      </text>
    </g>
  );
};

const FigFooter: React.FC<{ num: string; label: string }> = ({ num, label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
      fig.{num} · {label}
    </text>
  </g>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
      ⚡ truyền kỳ · claude opus 4.8 · 2026
    </text>
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

// ============ SLIDE 1: HOOK · 8.85s (266f) ============
// 0-75: "Canh ba đêm 28/5/2026"
// 75-130: "Tiên giới AI chấn động"
// 130-200: "Anthropic thả ra Claude Opus 4.8"
// 200-266: "tôn đại năng mới của cốt đạo"
const Slide1Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const stamp = useFadeUp(8, 12);
  const quake = useScaleIn(70, 14);
  const prod1 = useScaleIn(125, 16);
  const prod2 = useScaleIn(150, 18);
  const sub = useFadeUp(205, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="BREAKING · TIÊN GIỚI AI" />

          <text x={W / 2} y={330} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={stamp}>
            ▸ canh ba · 28.05.2026
          </text>

          <g style={{ ...quake, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={440} fontSize={52} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              TIÊN GIỚI AI CHẤN ĐỘNG
            </text>
          </g>

          {/* Claude node */}
          <g style={{ ...prod1, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={660} r={95} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={700} fontSize={110} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>C</text>
          </g>

          <g style={{ ...prod2, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={870} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              CLAUDE OPUS 4.8
            </text>
            <text x={W / 2} y={990} fontSize={104} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
              XUẤT THẾ
            </text>
          </g>

          {/* Subtitle box */}
          <g style={sub}>
            <TechBox x={W / 2 - 460} y={1130} w={920} h={120} color={AMBER} thick={1.5} />
            <text x={W / 2} y={1180} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // anthropic chính thức thả ra
            </text>
            <text x={W / 2} y={1222} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              một tôn đại năng mới của cốt đạo
            </text>
          </g>

          <text x={W / 2} y={1420} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            không phải chatbot war — mà là đại chiến thiên đạo AGI
          </text>

          <FigFooter num="1" label="release · claude opus 4.8" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 2: PERSPECTIVE · 11.52s (346f) ============
// 0-135: "người ngoài: à lại thêm 1 model AI mới"
// 135-200: "kiếm tu công nghệ đều hiểu"
// 200-255: "không còn là chatbot"
// 255-346: "đại chiến tranh đoạt thiên đạo AGI"
const Slide2Perspective: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(15, 12);
  const out = useScaleIn(30, 16);
  const vs = useScaleIn(150, 12);
  const cult = useScaleIn(205, 16);
  const big = useScaleIn(260, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="PERSPECTIVE · TWO VIEWS" />

          <text x={W / 2} y={330} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Cùng một sự kiện · hai cách nhìn
          </text>

          {/* Outsider */}
          <g style={{ ...out, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={430} w={940} h={260} color={TEXT_MUTE} thick={1.5} />
            <text x={W / 2} y={490} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">
              // người ngoài nhìn vào
            </text>
            <text x={W / 2} y={560} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              "à, lại thêm
            </text>
            <text x={W / 2} y={612} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              một model AI mới."
            </text>
            <text x={W / 2} y={668} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              just another update
            </text>
          </g>

          {/* VS */}
          <g style={{ ...vs, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={770} r={42} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
            <text x={W / 2} y={782} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>VS</text>
          </g>

          {/* Cultivator */}
          <g style={{ ...cult, transformOrigin: `${W / 2}px 1050px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={870} w={940} h={360} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={930} fontSize={22} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
              // kiếm tu công nghệ đều hiểu
            </text>
            <text x={W / 2} y={990} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Đây không còn là chatbot
            </text>
          </g>
          <g style={{ ...big, transformOrigin: `${W / 2}px 1100px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1085} fontSize={68} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
              ĐẠI CHIẾN
            </text>
            <text x={W / 2} y={1160} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              tranh đoạt thiên đạo AGI
            </text>
          </g>

          <FigFooter num="2" label="perspective · product vs thiên cơ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 3: HONESTY · 31.24s (937f) ============
// 0-90 mạnh hơn / 90-195 Honesty / 270 thành thật / 320 ít bịa / 420 thừa nhận
// 545 nghịch thiên / 660 tâm ma ảo giác / 850 two roads
const Slide3Honesty: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(30, 14);
  const big = useScaleIn(150, 18);
  const t1 = useFadeUp(270, 12);
  const t2 = useFadeUp(320, 12);
  const t3 = useFadeUp(420, 12);
  const counter = useScaleIn(545, 16);
  const tamma = useFadeUp(660, 14);
  const roads = useFadeUp(850, 14);

  const traits = [
    { y: 0, t: "thành thật hơn rất nhiều", anim: t1 },
    { y: 90, t: "ít bịa hơn · ít ảo giác", anim: t2 },
    { y: 180, t: "biết thừa nhận khi không chắc", anim: t3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="HONESTY · ĐẠO TÂM" />

          <text x={W / 2} y={320} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Không chỉ mạnh hơn — mà còn một thứ đáng sợ:
          </text>

          <g style={{ ...big, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={485} fontSize={104} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              HONESTY
            </text>
          </g>

          {/* 3 traits */}
          {traits.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${640 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-460} y={-32} width={920} height={64} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={-430} y={9} fontSize={24} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓</text>
              <text x={-380} y={9} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}

          {/* Counter-cultivation */}
          <g style={counter}>
            <TechBox x={W / 2 - 470} y={970} w={940} h={130} color={AMBER} thick={2} />
            <text x={W / 2} y={1025} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" letterSpacing="2">
              ⚡ NGHỊCH THIÊN CẢI MỆNH
            </text>
            <text x={W / 2} y={1072} fontSize={23} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              càng mạnh · LLM càng dễ tâm ma ảo giác
            </text>
          </g>

          <text x={W / 2} y={1180} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={tamma}>
            không biết · nhưng vẫn trả lời như tổ sư chuyển thế
          </text>

          {/* Two roads */}
          <g transform={`translate(${W / 2}, 1380)`} opacity={roads.opacity}>
            <text x={0} y={-90} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">▾ TWO ROADS</text>
            <g transform={`translate(-240, 0)`}>
              <TechBox x={-210} y={-50} w={420} h={110} color={ACCENT_BLUE} thick={2} />
              <text x={0} y={-12} fontSize={24} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>OpenAI</text>
              <text x={0} y={28} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">"thông minh hơn?"</text>
            </g>
            <g transform={`translate(240, 0)`}>
              <TechBox x={-210} y={-50} w={420} h={110} color={AMBER} thick={2.5} />
              <text x={0} y={-12} fontSize={24} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>Anthropic</text>
              <text x={0} y={28} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"đáng tin hơn?"</text>
            </g>
          </g>

          <FigFooter num="3" label="honesty · reliability over raw power" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 4: CODE MASTERY · 18.71s (561f) ============
// 0-120 dev phát cuồng / 150 nội bộ / 225 debug / 280 loop / 335 task / 395 agent / 430 quote
const Slide4Code: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useFadeUp(20, 14);
  const note = useFadeUp(150, 12);
  const b1 = useScaleIn(225, 12);
  const b2 = useScaleIn(280, 12);
  const b3 = useScaleIn(335, 12);
  const b4 = useScaleIn(395, 12);
  const quote = useScaleIn(440, 16);

  const caps = [
    { x: -235, y: -95, t: "debug", s: "tốt hơn", c: JADE, anim: b1 },
    { x: 235, y: -95, t: "ít vòng lặp", s: "vô tận hơn", c: ACCENT_BLUE, anim: b2 },
    { x: -235, y: 55, t: "follow task", s: "dài tốt hơn", c: AMBER, anim: b3 },
    { x: 235, y: 55, t: "agent workflow", s: "ổn định hơn", c: VIOLET, anim: b4 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="CODE MASTERY · CỐT ĐẠO" />

          <text x={W / 2} y={320} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" style={title}>
            DEV GIỚI PHÁT CUỒNG
          </text>
          <text x={W / 2} y={420} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" style={note}>
            // theo các tông môn thử nghiệm nội bộ
          </text>

          {/* 4 capability boxes */}
          <g transform={`translate(0, 640)`}>
            {caps.map((c, i) => (
              <g key={i} style={{ ...c.anim, transformOrigin: `${W / 2 + c.x}px ${c.y}px`, transformBox: "fill-box" }}>
                <TechBox x={W / 2 + c.x - 220} y={c.y - 62} w={440} h={124} color={c.c} thick={2} />
                <text x={W / 2 + c.x} y={c.y - 12} fontSize={32} fill={c.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{c.t}</text>
                <text x={W / 2 + c.x} y={c.y + 32} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{c.s}</text>
              </g>
            ))}
          </g>

          {/* Quote */}
          <g style={quote}>
            <TechBox x={W / 2 - 470} y={1180} w={940} h={230} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1235} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // có đại năng còn nói
            </text>
            <text x={W / 2} y={1295} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
              "model này biết tự kiểm tra công pháp
            </text>
            <text x={W / 2} y={1345} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
              của chính mình trước khi xuất thủ"
            </text>
          </g>

          <FigFooter num="4" label="coding · self-verify before output" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 5: DYNAMIC WORKFLOW · 15.80s (474f) ============
// 0-90 dynamic / 120 trận pháp / 200-280 fan-out / 360 feature / 430 quy mô lớn
const Slide5Dynamic: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useFadeUp(20, 14);
  const node = useScaleIn(120, 16);
  const reveal = useScaleIn(360, 16);

  const agentAnims = [
    useScaleIn(200, 10),
    useScaleIn(220, 10),
    useScaleIn(240, 10),
    useScaleIn(260, 10),
    useScaleIn(280, 10),
  ];
  const fan = useFade(300, 12);
  const xs = [-340, -170, 0, 170, 340];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="DYNAMIC WORKFLOW · TRẬN PHÁP" />

          <text x={W / 2} y={330} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" style={title}>
            DYNAMIC WORKFLOW
          </text>
          <text x={W / 2} y={400} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={title}>
            một loại trận pháp mới của Anthropic
          </text>

          {/* Central Claude */}
          <g style={{ ...node, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={560} r={70} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={585} fontSize={64} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>C</text>
          </g>

          {/* Fan-out lines */}
          <g style={fan}>
            {xs.map((x, i) => (
              <line key={i} x1={W / 2} y1={630} x2={W / 2 + x} y2={820} stroke={ACCENT_BLUE} strokeWidth={1.5} opacity={0.5} strokeDasharray="5 4" />
            ))}
          </g>

          {/* Agents */}
          {xs.map((x, i) => (
            <g key={i} style={{ ...agentAnims[i], transformOrigin: `${W / 2 + x}px 850px`, transformBox: "fill-box" }}>
              <rect x={W / 2 + x - 44} y={806} width={88} height={88} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
              <text x={W / 2 + x} y={868} fontSize={40} textAnchor="middle">🤖</text>
            </g>
          ))}

          <text x={W / 2} y={970} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={fan}>
            → hàng trăm phân thân agent chạy song song
          </text>

          {/* Reveal */}
          <g style={reveal}>
            <TechBox x={W / 2 - 470} y={1080} w={940} h={280} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1140} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // nghe tưởng chỉ là "feature"
            </text>
            <text x={W / 2} y={1205} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              thực ra là bước tiến tới:
            </text>
            <text x={W / 2} y={1290} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
              AI TỰ VẬN HÀNH
            </text>
            <text x={W / 2} y={1340} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
              QUY MÔ LỚN
            </text>
          </g>

          <FigFooter num="5" label="dynamic workflow · agent fan-out" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 6: HIDDEN MODEL · 24.65s (740f) ============
// 0-135 bóng ma / 150-230 mythos+codename / 370 lỗ hổng / 450 cyber / 560 trì hoãn / 660 pháp thân
const Slide6Mythos: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(20, 14);
  const code = useScaleIn(150, 16);
  const f1 = useFadeUp(370, 12);
  const f2 = useFadeUp(450, 12);
  const f3 = useFadeUp(560, 12);
  const reveal = useScaleIn(660, 16);

  const fears = [
    { y: 0, t: "phát hiện lỗ hổng bảo mật cấp cao", anim: f1 },
    { y: 90, t: "tự suy diễn chiến thuật cyber", anim: f2 },
    { y: 180, t: "Anthropic phải trì hoãn vì an toàn", anim: f3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="HIDDEN MODEL · BÓNG MA" />

          <text x={W / 2} y={320} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Phía sau Opus 4.8 · còn một bóng ma đáng sợ hơn
          </text>

          {/* Codename */}
          <g style={{ ...code, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 380} y={400} w={760} h={140} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={450} fontSize={44} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
              CLAUDE MYTHOS
            </text>
            <text x={W / 2} y={500} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">
              codename · Project Glasswing
            </text>
          </g>

          <text x={W / 2} y={640} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" style={f1}>
            // tin đồn nói rằng Mythos mạnh tới mức:
          </text>

          {/* 3 fears */}
          {fears.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${730 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-470} y={-32} width={940} height={64} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={-440} y={9} fontSize={22} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▸</text>
              <text x={-400} y={9} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}

          {/* Reveal */}
          <g style={reveal}>
            <TechBox x={W / 2 - 470} y={1130} w={940} h={210} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1185} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              // rất nhiều người bắt đầu hiểu
            </text>
            <text x={W / 2} y={1245} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              Opus 4.8 chỉ là PHÁP THÂN
            </text>
            <text x={W / 2} y={1300} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              trước khi chân thân AGI giáng thế
            </text>
          </g>

          <FigFooter num="6" label="hidden model · pháp thân vs chân thân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 7: RUTHLESS LAW · 19.07s (572f) ============
// 0-120 không phải mạnh hơn / 150 chia / 220 kiểm tra / 270 sửa lỗi / 370 phối hợp / 470 quy luật
const Slide7Law: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(20, 14);
  const s1 = useScaleIn(150, 12);
  const s2 = useScaleIn(220, 12);
  const s3 = useScaleIn(270, 12);
  const s4 = useScaleIn(370, 12);
  const note = useFadeUp(420, 12);
  const law = useScaleIn(470, 16);

  const skills = [
    { x: -235, y: -75, t: "tự chia việc", anim: s1 },
    { x: 235, y: -75, t: "tự kiểm tra", anim: s2 },
    { x: -235, y: 45, t: "tự sửa lỗi", anim: s3 },
    { x: 235, y: 45, t: "phối hợp agent", anim: s4 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="RUTHLESS LAW · QUY LUẬT" />

          <text x={W / 2} y={310} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} style={sub}>
            Không phải AI mạnh hơn con người
          </text>
          <text x={W / 2} y={358} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={sub}>
            mà là AI bắt đầu TỰ BIẾT:
          </text>

          {/* 4 self-abilities */}
          <g transform={`translate(0, 580)`}>
            {skills.map((c, i) => (
              <g key={i} style={{ ...c.anim, transformOrigin: `${W / 2 + c.x}px ${c.y}px`, transformBox: "fill-box" }}>
                <TechBox x={W / 2 + c.x - 220} y={c.y - 44} w={440} h={88} color={AMBER} thick={2} />
                <text x={W / 2 + c.x} y={c.y + 10} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.t}</text>
              </g>
            ))}
          </g>

          <text x={W / 2} y={780} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={note}>
            … phối hợp như một tông môn thật sự
          </text>

          {/* Ruthless law */}
          <g style={law}>
            <TechBox x={W / 2 - 470} y={900} w={940} h={320} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={960} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
              ⚠ MỘT QUY LUẬT RẤT TÀN NHẪN
            </text>
            <text x={W / 2} y={1030} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              Ngươi có thể chưa dùng Claude
            </text>
            <text x={W / 2} y={1100} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
              Nhưng đối thủ của ngươi
            </text>
            <text x={W / 2} y={1160} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">
              đã dùng nó để tu luyện
            </text>
          </g>

          <FigFooter num="7" label="ruthless law · adopt or fall behind" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ SLIDE 8: NEW ERA · 36.77s (1103f) ============
// 0-120 autocomplete / 345 kỷ nguyên khác / 420 code / 480 ý tưởng / 585 engineer
// 680 tư duy / 740 quyết định / 840 đạo tâm / 990 đại kiếp / 1050 cta
const Slide8Era: React.FC<{ duration: number }> = ({ duration }) => {
  const head = useFadeUp(20, 14);
  const era = useScaleIn(300, 16);
  const sc1 = useFadeUp(400, 10);
  const sc2 = useFadeUp(470, 10);
  const sc3 = useFadeUp(560, 10);
  const valBox = useScaleIn(640, 16);
  const v1 = useFadeUp(680, 10);
  const v2 = useFadeUp(740, 10);
  const v3 = useFadeUp(830, 10);
  const closer = useScaleIn(975, 16);
  const cta = useFadeUp(1045, 14);

  const scarce = [
    { y: 0, t: "code", anim: sc1 },
    { y: 64, t: "ý tưởng", anim: sc2 },
    { y: 128, t: "engineer bình thường", anim: sc3 },
  ];
  const values = [
    { y: 0, t: "tư duy hệ thống", c: ACCENT_BLUE, anim: v1 },
    { y: 70, t: "khả năng ra quyết định", c: JADE, anim: v2 },
    { y: 140, t: "đạo tâm đủ vững · không bị AI nuốt", c: AMBER, anim: v3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="NEW ERA · ĐẠI KIẾP" />

          <text x={W / 2} y={300} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={head}>
            Nhiều dev nghĩ AI chỉ là autocomplete mạnh hơn...
          </text>

          {/* Era */}
          <g style={{ ...era, transformOrigin: `${W / 2}px 400px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={415} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
              MỘT KỶ NGUYÊN MỚI
            </text>
          </g>

          {/* Scarcity strikethrough */}
          <text x={W / 2} y={520} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} style={sc1}>
            // không còn khan hiếm:
          </text>
          {scarce.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${590 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-360} y={-26} width={720} height={52} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.2} />
              <text x={0} y={9} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">{r.t}</text>
            </g>
          ))}

          {/* Only value */}
          <g style={valBox}>
            <TechBox x={W / 2 - 470} y={840} w={940} h={300} color={AMBER} thick={2.5} />
            <text x={W / 2} y={895} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
              ▾ THỨ DUY NHẤT CÒN GIÁ TRỊ
            </text>
          </g>
          {values.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${955 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-430} y={-28} width={860} height={56} fill={BG_NAVY} stroke={r.c} strokeWidth={1.5} />
              <text x={0} y={9} fontSize={25} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}

          {/* Closer */}
          <g style={{ ...closer, transformOrigin: `${W / 2}px 1280px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={1295} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
              ⚔ TAM GIỚI AI · VÒNG ĐẠI KIẾP MỚI
            </text>
          </g>

          {/* CTA */}
          <g transform={`translate(${W / 2}, 1480)`} opacity={cta.opacity}>
            <line x1={-220} y1={-30} x2={220} y2={-30} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={10} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">
              comment · save · follow · truyền kỳ AI hằng tuần
            </text>
            <line x1={-220} y1={40} x2={220} y2={40} stroke={AMBER} strokeWidth={1} />
          </g>

          <FigFooter num="8" label="new era · đạo tâm is the moat" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [Slide1Hook, Slide2Perspective, Slide3Honesty, Slide4Code, Slide5Dynamic, Slide6Mythos, Slide7Law, Slide8Era];

export const ClaudeOpus48Blueprint: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("claude_opus_48_truyen_ky/voice.mp3")} />
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
