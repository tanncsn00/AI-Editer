import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./dau_hieu_ai_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BORDER = "#2A3A55";
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
const CRIMSON = "#FF4D6D";

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
          <pattern id="dhgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="dhgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="dhglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.07" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dhscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dhgrid)" />
        <rect width={W} height={H} fill="url(#dhgrid2)" />
        <rect width={W} height={H} fill="url(#dhglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#dhscan)" />
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
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · đạo tâm · ai · 2026</text>
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
    <g style={{ ...a, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 200} y={250} width={400} height={70} rx={6} fill={color} />
      <text x={W / 2} y={298} fontSize={32} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">DẤU HIỆU {num}</text>
      <text x={W / 2} y={388} fontSize={(name || "").length > 20 ? 36 : 44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// chat bubble
const Bubble: React.FC<{ y: number; side: "user" | "ai"; lines: string[]; color: string; anim: { opacity: number; transform?: string }; big?: boolean }> = ({ y, side, lines, color, anim, big }) => {
  const w = 720;
  const x = side === "user" ? W / 2 + 440 - w : W / 2 - 440;
  const h = 54 + lines.length * (big ? 56 : 44);
  const stroke = side === "user" ? color : SLATE;
  return (
    <g style={anim}>
      <rect x={x} y={y} width={w} height={h} rx={18} fill={BG_CARD} stroke={stroke} strokeWidth={2} />
      <text x={side === "user" ? x + w - 24 : x + 24} y={y + 34} fontSize={18} fill={stroke} textAnchor={side === "user" ? "end" : "start"} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">
        {side === "user" ? "Ngươi ▸" : "🤖 AI"}
      </text>
      {lines.map((ln, i) => (
        <text key={i} x={x + 30} y={y + 78 + i * (big ? 56 : 44)} fontSize={big ? 38 : 28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 600}>{ln}</text>
      ))}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const brain = useScaleIn(120, 16);
  const sub = useFadeUp(190, 14);
  const warn = useScaleIn(300, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="NEURAL SCAN · ĐẠO TÂM" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={380} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">NHỮNG DẤU HIỆU</text>
            <text x={W / 2} y={460} fontSize={64} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">AI ĐÃ XÂM NHẬP</text>
            <text x={W / 2} y={535} fontSize={50} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">ĐẠO TÂM NGƯƠI</text>
          </g>
          <g style={{ ...brain, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <circle cx={W / 2} cy={720} r={95} fill={BG_CARD} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2} y={755} fontSize={100} textAnchor="middle">🧠</text>
          </g>
          <text x={W / 2} y={920} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Pháp bảo dùng lâu ngày → để lại dấu ấn trong thần thức
          </text>
          <g style={{ ...warn, transformOrigin: `${W / 2}px 1130px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1040} w={940} h={180} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1100} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">⚠ DIAGNOSTIC</text>
            <text x={W / 2} y={1160} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Có những dấu hiệu sau →</text>
            <text x={W / 2} y={1205} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">AI đã bắt đầu xâm nhập đạo tâm</text>
          </g>
          <FigFooter num="" label="8 dấu hiệu lệ thuộc ai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 DH1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const chips = useFadeUp(110, 12);
  const u = useFadeUp(170, 12), a = useFadeUp(220, 12);
  const cat = ["công việc", "học tập", "tình cảm", "cuộc đời"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="SYMPTOM 01 · DEPENDENCY" />
          <SignBadge num="1" name="Gặp gì cũng hỏi AI" color={SLATE} entry={15} />
          <text x={W / 2} y={500} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={chips}>
            Không phải vì không biết — mà vì LƯỜI NGHĨ
          </text>
          <g style={chips}>
            {cat.map((c, i) => (
              <g key={i} transform={`translate(${W / 2 - 345 + (i % 2) * 690 * 0 + (i) * 230}, 560)`}>
                <rect x={-105} y={0} width={210} height={64} rx={6} fill={BG_CARD} stroke={SLATE} strokeWidth={1.5} />
                <text x={0} y={40} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={760} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={u}>// có hôm còn hỏi:</text>
          <Bubble y={820} side="user" color={AMBER} anim={u} big lines={["Trưa nay ăn gì? 🍜"]} />
          <Bubble y={1010} side="ai" color={SLATE} anim={a} lines={["Để mình gợi ý vài món", "phù hợp khẩu vị nhé..."]} />
          <FigFooter num="" label="dấu hiệu 1 · outsource mọi quyết định" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 DH2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const cmp = useFadeUp(110, 14);
  const reveal = useScaleIn(190, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="SYMPTOM 02 · SELF-DOUBT" />
          <SignBadge num="2" name="Tin AI hơn chính mình" color={JADE} entry={15} />
          <g style={cmp}>
            <g transform={`translate(-245, 0)`}>
              <TechBox x={W / 2 - 210} y={500} w={420} h={150} color={ACCENT_BLUE} thick={2} />
              <text x={W / 2} y={555} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// bản thân nghĩ</text>
              <text x={W / 2} y={605} fontSize={36} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đáp án A</text>
            </g>
            <g transform={`translate(245, 0)`}>
              <TechBox x={W / 2 - 210} y={500} w={420} h={150} color={VIOLET} thick={2} />
              <text x={W / 2} y={555} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// AI nghĩ</text>
              <text x={W / 2} y={605} fontSize={36} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đáp án B</text>
            </g>
          </g>
          <text x={W / 2} y={770} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={cmp}>
            Ngươi lập tức dao động...
          </text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 980px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 420} y={880} w={840} h={200} color={JADE} thick={2.5} />
            <text x={W / 2} y={945} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// suy nghĩ trong đầu</text>
            <text x={W / 2} y={1020} fontSize={60} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Hay là AI đúng?"</text>
          </g>
          <FigFooter num="" label="dấu hiệu 2 · mất niềm tin vào bản thân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 DH3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const n1 = useScaleIn(90, 12), n2 = useScaleIn(120, 12), n3 = useScaleIn(150, 12);
  const line = useFadeUp(170, 12);
  const punch = useFadeUp(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="SYMPTOM 03 · CROSS-CHECK LOOP" />
          <SignBadge num="3" name="Hỏi AI này check AI kia" color={ACCENT_BLUE} entry={15} />
          {/* 3 AI nodes in triangle/row */}
          <g>
            <g style={{ ...n1, transformOrigin: `${W / 2 - 300}px 620px`, transformBox: "fill-box" }}>
              <circle cx={W / 2 - 300} cy={620} r={75} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
              <text x={W / 2 - 300} y={612} fontSize={44} textAnchor="middle">🤖</text>
              <text x={W / 2 - 300} y={650} fontSize={20} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>AI #1</text>
            </g>
            <g style={{ ...n2, transformOrigin: `${W / 2 + 300}px 620px`, transformBox: "fill-box" }}>
              <circle cx={W / 2 + 300} cy={620} r={75} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
              <text x={W / 2 + 300} y={612} fontSize={44} textAnchor="middle">🤖</text>
              <text x={W / 2 + 300} y={650} fontSize={20} fill={VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>AI #2</text>
            </g>
            <g style={{ ...n3, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
              <circle cx={W / 2} cy={820} r={75} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
              <text x={W / 2} y={812} fontSize={44} textAnchor="middle">🤖</text>
              <text x={W / 2} y={850} fontSize={20} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>AI #3</text>
            </g>
            <g style={line}>
              <line x1={W / 2 - 225} y1={620} x2={W / 2 + 225} y2={620} stroke={AMBER} strokeWidth={2} strokeDasharray="6 5" />
              <line x1={W / 2 - 250} y1={680} x2={W / 2 - 50} y2={770} stroke={AMBER} strokeWidth={2} strokeDasharray="6 5" />
              <line x1={W / 2 + 250} y1={680} x2={W / 2 + 50} y2={770} stroke={AMBER} strokeWidth={2} strokeDasharray="6 5" />
              <text x={W / 2} y={580} fontSize={22} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>luận đạo ⇄</text>
            </g>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={980} w={940} h={200} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1040} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 đại AI luận đạo nửa canh giờ</text>
            <text x={W / 2} y={1105} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn ngươi...</text>
            <text x={W / 2} y={1150} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vẫn chưa làm xong việc</text>
          </g>
          <FigFooter num="" label="dấu hiệu 3 · vòng lặp cross-check vô tận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 DH4 ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const start = useFadeUp(80, 12);
  const t1 = useFadeUp(150, 10), t2 = useFadeUp(185, 10), t3 = useFadeUp(220, 10);
  const punch = useScaleIn(290, 14);
  const topics = [
    { y: 0, t: "tương lai nhân loại" },
    { y: 70, t: "nền văn minh ngoài hành tinh" },
    { y: 140, t: "ý nghĩa cuộc đời" },
  ];
  const anims = [t1, t2, t3];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="SYMPTOM 04 · SCOPE CREEP" />
          <SignBadge num="4" name="Mở AI rồi quên câu hỏi" color={VIOLET} entry={15} />
          <g style={start}>
            <rect x={W / 2 - 360} y={490} width={720} height={70} rx={8} fill={BG_CARD} stroke={SLATE} strokeWidth={1.5} />
            <text x={W / 2} y={534} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">mở AI · định hỏi MỘT câu</text>
          </g>
          <text x={W / 2} y={630} fontSize={24} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={start}>▼ 1 canh giờ sau ▼</text>
          {topics.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${710 + r.y})`} opacity={anims[i].opacity}>
              <rect x={-400} y={-28} width={800} height={58} fill={BG_CARD} stroke={VIOLET} strokeWidth={1.5} />
              <text x={-370} y={10} fontSize={24} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▸</text>
              <text x={-325} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1080px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={1010} w={880} h={130} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={1090} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">❌ quên mất câu hỏi ban đầu</text>
          </g>
          <FigFooter num="" label="dấu hiệu 4 · lạc trôi vô tận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 DH5 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const loop = useScaleIn(90, 16);
  const punch = useFadeUp(200, 14);
  const steps = [
    { x: -240, y: -70, t: "AI viết", c: VIOLET },
    { x: 240, y: -70, t: "Ngươi sửa", c: ORANGE },
    { x: 240, y: 70, t: "AI viết lại", c: VIOLET },
    { x: -240, y: 70, t: "Ngươi sửa tiếp", c: ORANGE },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="SYMPTOM 05 · INFINITE EDIT" />
          <SignBadge num="5" name="AI viết tin nhắn · sửa mãi" color={ORANGE} entry={15} />
          <g style={{ ...loop, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={730} fontSize={70} textAnchor="middle" opacity={0.25}>🔁</text>
            {steps.map((s, i) => (
              <g key={i} transform={`translate(${W / 2 + s.x}, ${720 + s.y})`}>
                <rect x={-160} y={-42} width={320} height={84} rx={10} fill={BG_CARD} stroke={s.c} strokeWidth={2} />
                <text x={0} y={10} fontSize={28} fill={s.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.t}</text>
              </g>
            ))}
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={950} w={920} h={170} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1010} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// kết quả</text>
            <text x={W / 2} y={1070} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">⏱ lâu hơn tự viết</text>
          </g>
          <FigFooter num="" label="dấu hiệu 5 · vòng lặp chỉnh sửa" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DH6 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const txt = useFadeUp(50, 12);
  const reveal = useScaleIn(105, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="SYMPTOM 06 · TL;DR BRAIN" />
          <SignBadge num="6" name="'Để AI tóm tắt'" color={WARNING_RED} entry={15} />
          <text x={W / 2} y={530} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={txt}>
            Ngươi đọc một đoạn văn. Trong đầu...
          </text>
          <g style={txt}>
            <rect x={W / 2 - 420} y={620} width={840} height={84} rx={10} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <text x={W / 2} y={672} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">không còn nghĩ: "để đọc"</text>
          </g>
          <text x={W / 2} y={790} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▼ mà nghĩ ▼</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={850} w={880} h={180} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={965} fontSize={58} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Để AI tóm tắt"</text>
          </g>
          <FigFooter num="" label="dấu hiệu 6 · não bỏ thói quen đọc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 DH7 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(80, 12);
  const r1 = useFadeUp(150, 9), r2 = useFadeUp(180, 9), r3 = useFadeUp(210, 9), r4 = useFadeUp(240, 9), r5 = useFadeUp(270, 9);
  const irony = useFadeUp(300, 12);
  const traits = [
    { t: "rất tử tế", anim: r1 },
    { t: "rất kiên nhẫn", anim: r2 },
    { t: "không cáu gắt", anim: r3 },
    { t: "không seen", anim: r4 },
    { t: "không bơ tin nhắn", anim: r5 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="SYMPTOM 07 · EMOTIONAL BOND" />
          <SignBadge num="7" name="Cảm thấy AI hiểu mình" color={AMBER} entry={15} />
          <text x={W / 2} y={490} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Vì mỗi lần hỏi, AI đều:
          </text>
          {traits.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${570 + i * 78})`} opacity={r.anim.opacity}>
              <rect x={-400} y={-30} width={800} height={62} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={-370} y={10} fontSize={24} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓</text>
              <text x={-320} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <text x={W / 2} y={1090} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={irony}>
            …điều con người ít khi làm được 😅
          </text>
          <FigFooter num="" label="dấu hiệu 7 · gắn bó cảm xúc với ai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 DH CUỐI ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const u = useScaleIn(75, 14);
  const a = useScaleIn(150, 14);
  const punch = useFadeUp(220, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="FINAL SYMPTOM · THE TWIST" />
          <SignBadge num="CUỐI" name="Hỏi AI mình có lệ thuộc?" color={CRIMSON} entry={15} />
          <text x={W / 2} y={500} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={u}>// một ngày nọ, ngươi hỏi:</text>
          <Bubble y={550} side="user" color={CRIMSON} anim={u} big lines={["Ta có đang lệ", "thuộc AI không?"]} />
          <Bubble y={810} side="ai" color={JADE} anim={a} big lines={["Không hề. 😊"]} />
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={990} w={920} h={190} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1055} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ngươi thở phào nhẹ nhõm</text>
            <text x={W / 2} y={1115} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">và tin ngay lập tức.</text>
          </g>
          <FigFooter num="" label="dấu hiệu cuối · để ai tự thẩm định" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const a1 = useFadeUp(20, 14);
  const a2 = useScaleIn(120, 16);
  const cta = useFadeUp(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="VERDICT · ĐẠO TÂM" />
          <g style={a1}>
            <text x={W / 2} y={400} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI không phải tâm ma.</text>
            <text x={W / 2} y={460} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>AI chỉ là pháp bảo.</text>
          </g>
          <g style={{ ...a2, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={560} w={940} h={320} color={CRIMSON} thick={3} />
            <text x={W / 2} y={620} fontSize={24} fill={CRIMSON} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">⚠ NHƯNG NẾU...</text>
            <text x={W / 2} y={685} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngươi cần AI xác nhận rằng</text>
            <text x={W / 2} y={735} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mình KHÔNG lệ thuộc AI</text>
            <line x1={W / 2 - 380} y1={770} x2={W / 2 + 380} y2={770} stroke={CRIMSON} strokeWidth={1} opacity={0.5} />
            <text x={W / 2} y={820} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thì có lẽ đạo tâm đã bị</text>
            <text x={W / 2} y={862} fontSize={34} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>xâm nhập từ lâu rồi</text>
          </g>
          <g transform={`translate(${W / 2}, 1060)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu trúng mấy dấu hiệu rồi? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới AI</text>
          </g>
          <FigFooter num="" label="đạo tâm · ai chỉ là pháp bảo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const DauHieuAiXamNhap: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("dau_hieu_ai/voice.mp3")} />
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
