import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./nodao_beats.json";
import T from "./nodao_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const BG = "#0A0705";
const CARD = "#16100B";
const CARD2 = "#1E150D";
const GOLD = "#F0B429";
const JADE = "#3FBF9F";
const CRIMSON = "#E5484D";
const PAPER = "#F2E8D5";
const SEC = "#C4A97E";
const MUTE = "#7A6448";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const timings = T as Record<string, Record<string, number>>;
const at = (beat: string, key: string) => timings[beat]?.[key] ?? 0;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.7, e + d], [0.82, 1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
const useStamp = (e: number, d = 12) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.45, e + d], [2.2, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = interpolate(f, [e, e + d], [-14, -7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale}) rotate(${rot}deg)` };
};

const LedgerBG: React.FC<{ accent?: string }> = ({ accent = GOLD }) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.35) % 90;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 20);
  const motes = Array.from({ length: 14 }, (_, i) => ({
    x: 90 + ((i * 137) % (W - 180)),
    y: (((i * 311) % H) + frame * (0.5 + (i % 4) * 0.22)) % H,
    r: 1.6 + (i % 3) * 1.1,
    o: 0.16 + (i % 5) * 0.05,
  }));
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ndGlow" cx="50%" cy="26%" r="66%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ndVig" cx="50%" cy="44%" r="76%">
            <stop offset="54%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.86" />
          </radialGradient>
          <filter id="ndTextGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <g stroke={accent} strokeWidth={1} opacity={0.07}>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1={0} y1={i * 90 - drift} x2={W} y2={i * 90 - drift} />
          ))}
          <line x1={148} y1={0} x2={148} y2={H} stroke={CRIMSON} strokeWidth={2} opacity={0.5} />
          <line x1={W - 148} y1={0} x2={W - 148} y2={H} stroke={CRIMSON} strokeWidth={2} opacity={0.5} />
        </g>
        <rect width={W} height={H} fill="url(#ndGlow)" />
        <g>
          {motes.map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={GOLD} opacity={m.o} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#ndVig)" />
        <g stroke={accent} strokeWidth={2.5} fill="none" opacity={0.55} strokeLinecap="round">
          <path d="M 46 96 L 46 50 L 92 50" />
          <path d={`M ${W - 46} 96 L ${W - 46} 50 L ${W - 92} 50`} />
          <path d={`M 46 ${H - 96} L 46 ${H - 50} L 92 ${H - 50}`} />
          <path d={`M ${W - 46} ${H - 96} L ${W - 46} ${H - 50} L ${W - 92} ${H - 50}`} />
        </g>
        <circle cx={W - 74} cy={H - 74} r={6} fill={GOLD} opacity={0.35 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const Glow: React.FC = () => (
  <defs>
    <filter id="ndGlowF" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.035], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = GOLD }) => {
  const a1 = useFadeUp(0, 10);
  return (
    <g style={a1}>
      <path d="M 82 116 L 82 152 L 102 152" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
      <text x={114} y={145} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
      <line x1={82} y1={168} x2={W - 82} y2={168} stroke={color} strokeWidth={1} opacity={0.22} />
    </g>
  );
};

const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={82} y1={H - 138} x2={W - 82} y2={H - 138} stroke={GOLD} strokeWidth={1} opacity={0.18} />
    <text x={W / 2} y={H - 98} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 56} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// nợ đạo · thiên đạo vẫn nhớ</text>
  </g>
);

const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number }> = ({ x, y, w, h, c = GOLD, fill = CARD, thick = 2, rx = 12 }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.78} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
      <g stroke={c} strokeWidth={2.5} fill="none" opacity={0.9} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
    </g>
  );
};

const RealmBanner: React.FC<{ y: number; num: string; name: string; emoji: string; c?: string; entry: number }> = ({ y, num, name, emoji, c = GOLD, entry }) => {
  const a = usePop(entry, 14);
  const x = W / 2 - 470;
  const w = 940;
  const h = 132;
  const b = 22;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 66}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={CARD2} fillOpacity={0.85} stroke={c} strokeWidth={1.5} strokeOpacity={0.45} />
      <g stroke={c} strokeWidth={3} fill="none" opacity={0.95} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      <text x={W / 2} y={y + 46} fontSize={20} fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="5">{emoji}  CẢNH GIỚI {num}</text>
      <text x={W / 2} y={y + 104} fontSize={50} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">{name}</text>
    </g>
  );
};

const Line: React.FC<{ y: number; text: string; entry: number; c?: string; size?: number; weight?: number; italic?: boolean }> = ({ y, text, entry, c = PAPER, size = 33, weight = 700, italic = false }) => (
  <text
    x={W / 2}
    y={y}
    fontSize={size}
    fill={c}
    textAnchor="middle"
    fontFamily="'Be Vietnam Pro', sans-serif"
    fontWeight={weight}
    fontStyle={italic ? "italic" : "normal"}
    style={useFadeUp(entry, 12)}
  >
    {text}
  </text>
);

// Cat chuoi dai thanh nhieu dong roi co font cho vua be ngang the.
const CHAR_RATIO = 0.62;

const wrapText = (text: string, maxChars: number): string[] => {
  if (text.length <= maxChars) return [text];
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if (cur && (cur + " " + word).length > maxChars) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cur ? cur + " " + word : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

const fitSize = (lines: string[], maxSize: number, boxW: number) => {
  const longest = Math.max(...lines.map((l) => l.length));
  return Math.min(maxSize, Math.floor(boxW / (CHAR_RATIO * longest)));
};

const BigText: React.FC<{ y: number; text: string; c: string; maxSize?: number; boxW?: number; maxChars?: number }> = ({ y, text, c, maxSize = 46, boxW = 860, maxChars = 30 }) => {
  const lines = wrapText(text, maxChars);
  const size = fitSize(lines, maxSize, boxW);
  const step = size * 1.16;
  const top = y - ((lines.length - 1) * step) / 2;
  return (
    <g>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={top + i * step} fontSize={size} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">{l}</text>
      ))}
    </g>
  );
};

const punchHeight = (small: string | undefined, big: string, maxChars = 30) => {
  const lines = wrapText(big, maxChars).length;
  return (small ? 96 : 42) + lines * 62 + 42;
};

const bigCardHeight = (big: string, maxChars = 30) => 84 + wrapText(big, maxChars).length * 62;

const PunchCard: React.FC<{ y: number; small?: string; big: string; entry: number; c?: string }> = ({ y, small, big, entry, c = CRIMSON }) => {
  const a = usePop(entry, 16);
  const h = punchHeight(small, big);
  return (
    <g style={{ ...a, transformOrigin: "center", transformBox: "fill-box" }}>
      <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={4} />
      {small ? (
        <text x={W / 2} y={y + 62} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{small}</text>
      ) : null}
      <BigText y={small ? y + 96 + (punchHeight(small, big) - 96 - 42) / 2 + 12 : y + h / 2 + 14} text={big} c={c === CRIMSON ? GOLD : c} />
    </g>
  );
};

const Skull: React.FC<{ x: number; y: number; entry: number; glyph?: string; size?: number }> = ({ x, y, entry, glyph = "💀", size = 76 }) => (
  <text x={x} y={y} fontSize={size} textAnchor="middle" style={{ ...useStamp(entry, 12), transformOrigin: "center", transformBox: "fill-box" }}>{glyph}</text>
);

// ============ 1 · TRIGGER ============
const S_TRIGGER: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "TRIGGER";
  const negs = ["không cần trả góp", "không cần ngân hàng gọi", "không cần xã hội đen tìm đến"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={CRIMSON} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="NỢ ĐẠO · KHAI MỞ" color={CRIMSON} />
          <g style={useFadeUp(at(B, "think"), 12)}>
            <text x={W / 2} y={478} fontSize={36} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ngươi tưởng trên đời này</text>
            <text x={W / 2} y={568} fontSize={82} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">CHỈ CÓ NỢ TIỀN?</text>
          </g>
          <g style={usePop(at(B, "wrong"), 12)}>
            <text x={W / 2} y={690} fontSize={64} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">SAI RỒI.</text>
          </g>
          {negs.map((t, i) => (
            <g key={i} style={usePop(at(B, `n${i}`), 10)}>
              <Card x={W / 2 - 400} y={800 + i * 104} w={800} h={82} c={[SEC, SEC, SEC][i]} rx={16} thick={2} />
              <text x={W / 2} y={850 + i * 104} fontSize={31} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
            </g>
          ))}
          <PunchCard y={1180} small="nhưng…" big="THIÊN ĐẠO VẪN NHỚ" entry={at(B, "remember")} c={GOLD} />
          <Footer label="có những món nợ không ai đòi" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ 2 · ATTENTION ============
const S_ATTENTION: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "ATTENTION";
  const frame = useCurrentFrame();
  const glow = 0.75 + 0.25 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="TU TIÊN GIỚI" />
          <Line y={470} text="Trong Tu Tiên Giới, loại nợ này gọi chung là" entry={at(B, "called")} c={SEC} size={31} weight={600} />
          <g style={usePop(at(B, "nodao"), 16)}>
            <text x={W / 2} y={620} fontSize={132} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#ndGlowF)" opacity={glow}>NỢ ĐẠO</text>
          </g>
          <g style={usePop(at(B, "open"), 14)}>
            <Card x={W / 2 - 400} y={760} w={800} h={130} c={JADE} rx={16} thick={3} />
            <text x={W / 2} y={812} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bần đạo sẽ khai mở</text>
            <text x={W / 2} y={866} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">7 CẢNH GIỚI</text>
          </g>
          <Line y={1010} text="cảnh giới đầu tiên…" entry={at(B, "first")} c={PAPER} size={36} weight={800} italic />
          <PunchCard y={1090} small="" big="99% ĐẠO HỮU TỪNG TRẢI QUA" entry={at(B, "exp")} c={CRIMSON} />
          <Skull x={W / 2} y={1360} entry={at(B, "exp") + 8} />
          <Footer label="bảy tầng nợ · một sổ ghi" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

type GagCfg = {
  beat: string;
  num: string;
  name: string;
  emoji: string;
  color: string;
  lines: { t: string; k: string; c?: string; size?: number }[];
  punchSmall?: string;
  punchBig: string;
  punchKey: string;
  footer: string;
  skull?: boolean;
};

const RealmGag: React.FC<{ duration: number; cfg: GagCfg }> = ({ duration, cfg }) => {
  const B = cfg.beat;
  const top = 400;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={cfg.color} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag={`CẢNH GIỚI ${cfg.num} / 7`} color={cfg.color} />
          <RealmBanner y={top} num={cfg.num} name={cfg.name} emoji={cfg.emoji} c={cfg.color} entry={at(B, "title")} />
          {cfg.lines.map((l, i) => (
            <Line
              key={i}
              y={top + 214 + i * 74}
              text={l.t}
              entry={at(B, l.k)}
              c={l.c ?? PAPER}
              size={l.size ?? 32}
              weight={700}
            />
          ))}
          <PunchCard
            y={top + 236 + cfg.lines.length * 74}
            small={cfg.punchSmall}
            big={cfg.punchBig}
            entry={at(B, cfg.punchKey)}
            c={CRIMSON}
          />
          {cfg.skull === false ? null : (
            <Skull
              x={W / 2}
              y={top + 236 + cfg.lines.length * 74 + punchHeight(cfg.punchSmall, cfg.punchBig) + 104}
              entry={at(B, cfg.punchKey) + 10}
            />
          )}
          <Footer label={cfg.footer} />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

type LesCfg = {
  beat: string;
  color: string;
  head: string;
  lines: { t: string; k: string }[];
  bigKey: string;
  big: string;
  footer: string;
};

const RealmLesson: React.FC<{ duration: number; cfg: LesCfg }> = ({ duration, cfg }) => {
  const B = cfg.beat;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="ĐẠO LÝ" color={JADE} />
          <g style={useFadeUp(2, 12)}>
            <text x={W / 2} y={520} fontSize={26} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="6">{cfg.head}</text>
          </g>
          {cfg.lines.map((l, i) => (
            <g key={i} style={usePop(at(B, l.k), 12)}>
              <Card x={W / 2 - 420} y={610 + i * 122} w={840} h={98} c={JADE} rx={18} thick={2.5} />
              <text x={W / 2} y={672 + i * 122} fontSize={33} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{l.t}</text>
            </g>
          ))}
          <g style={{ ...usePop(at(B, cfg.bigKey), 16), transformOrigin: "center", transformBox: "fill-box" }}>
            <Card
              x={W / 2 - 470}
              y={640 + cfg.lines.length * 122}
              w={940}
              h={bigCardHeight(cfg.big)}
              c={GOLD}
              fill={CARD2}
              thick={4}
            />
            <BigText y={640 + cfg.lines.length * 122 + bigCardHeight(cfg.big) / 2 + 14} text={cfg.big} c={GOLD} maxSize={44} />
          </g>
          <Footer label={cfg.footer} />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ 17 · PAYOFF 1 ============
const S_PAYOFF1: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "PAYOFF1";
  const gifts = [
    { t: "TIỀN", k: "i0" },
    { t: "CƠ HỘI", k: "i1" },
    { t: "KIẾN THỨC", k: "i2" },
    { t: "THỜI GIAN", k: "i3" },
    { t: "TÌNH NGHĨA", k: "i4" },
    { t: "LỜI HỨA", k: "i5" },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="TỔNG KẾT SỔ NỢ" />
          <g style={usePop(at(B, "q1"), 14)}>
            <text x={W / 2} y={430} fontSize={30} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">đừng hỏi: “ta đang nợ ai?”</text>
          </g>
          <g style={usePop(at(B, "q2"), 16)}>
            <text x={W / 2} y={520} fontSize={35} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>hãy hỏi: “ta đang sống nhờ những thứ</text>
            <text x={W / 2} y={572} fontSize={35} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>AI ĐÃ TỪNG TRAO CHO TA?”</text>
          </g>
          {gifts.map((g, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx = W / 2 + (col === 0 ? -232 : 232);
            return (
              <g key={i} style={{ ...usePop(at(B, g.k), 10), transformOrigin: `${cx}px ${700 + row * 128}px`, transformBox: "fill-box" }}>
                <Card x={cx - 212} y={660 + row * 128} w={424} h={100} c={GOLD} rx={18} thick={2.5} />
                <text x={cx} y={722 + row * 128} fontSize={36} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{g.t}</text>
              </g>
            );
          })}
          <PunchCard y={1090} small="và cả…" big="NHỮNG LẦN NGƯỜI KHÁC THA THỨ" entry={at(B, "forgive")} c={JADE} />
          <Footer label="ngươi đang sống nhờ rất nhiều người" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ 18 · PAYOFF 2 ============
const S_PAYOFF2: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "PAYOFF2";
  const frame = useCurrentFrame();
  const glow = 0.7 + 0.3 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="ĐẠO CHÂN CHÍNH" />
          <g style={useFadeUp(at(B, "strong"), 14)}>
            <text x={W / 2} y={700} fontSize={38} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tu tiên không phải chỉ là</text>
            <text x={W / 2} y={780} fontSize={58} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CÀNG TU CÀNG MẠNH</text>
          </g>
          <g style={usePop(at(B, "know"), 18)}>
            <text x={W / 2} y={940} fontSize={38} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là</text>
            <text x={W / 2} y={1036} fontSize={62} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)" opacity={glow}>CÀNG MẠNH CÀNG BIẾT</text>
            <text x={W / 2} y={1124} fontSize={62} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)" opacity={glow}>MÌNH PHẢI TRẢ LẠI</text>
            <text x={W / 2} y={1212} fontSize={62} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)" opacity={glow}>ĐIỀU GÌ</text>
          </g>
          <Footer label="đạo không nằm ở sức mạnh" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ 19 · SOCIAL TRANSMISSION ============
const S_TRANSMIT: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "TRANSMIT";
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={CRIMSON} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <Header tag="KHOAN ĐÃ" color={CRIMSON} />
          <g style={useFadeUp(at(B, "name"), 14)}>
            <text x={W / 2} y={520} fontSize={34} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nếu nghe đến đây trong đầu ngươi</text>
            <text x={W / 2} y={584} fontSize={34} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vừa hiện lên</text>
            <text x={W / 2} y={680} fontSize={72} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">MỘT CÁI TÊN</text>
          </g>
          <g style={usePop(at(B, "dont"), 14)}>
            <Card x={W / 2 - 400} y={800} w={800} h={150} c={CRIMSON} fill={CARD2} thick={4} />
            <text x={W / 2} y={898} fontSize={68} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">ĐỪNG TAG HỌ</text>
          </g>
          <Line y={1046} text="họ mà xem được, họ lại tưởng" entry={at(B, "why")} c={SEC} size={32} weight={600} />
          <g style={usePop(at(B, "why") + 6, 12)}>
            <text x={W / 2} y={1132} fontSize={56} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NGƯƠI ĐÒI NỢ</text>
          </g>
          <Skull x={W / 2} y={1230} entry={at(B, "why") + 14} />
          <PunchCard y={1290} small="hãy tự hỏi mình trước:" big="TA ĐANG NỢ AI?" entry={at(B, "ask")} c={GOLD} />
          <Footer label="hỏi mình trước · rồi hãy hỏi người" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ 20 · CTA ============
const S_CTA: React.FC<{ duration: number }> = ({ duration }) => {
  const B = "CTA";
  const frame = useCurrentFrame();
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <LedgerBG accent={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <Glow />
          <g style={usePop(at(B, "follow"), 16)}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 330} y={790} width={660} height={180} rx={22} fill={GOLD} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 310} y={806} width={620} height={148} rx={16} fill={CARD2} stroke={GOLD} strokeWidth={3} />
              <text x={W / 2} y={904} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#ndGlowF)">🔔 THEO DÕI</text>
            </g>
          </g>
          <g style={useFadeUp(at(B, "cta"), 14)}>
            <text x={W / 2} y={1090} fontSize={44} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>để được</text>
            <text x={W / 2} y={1176} fontSize={62} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ndGlowF)">ĐỘ KIẾP MỖI NGÀY</text>
          </g>
          <Footer label="bần đạo cáo lui" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const GAGS: GagCfg[] = [
  {
    beat: "CG1GAG", num: "1", name: "KIM TIỀN NỢ", emoji: "🪙", color: GOLD,
    lines: [
      { t: "“cho ta mượn 500 linh thạch”", k: "borrow" },
      { t: "“bao giờ trả?” → “MAI”", k: "when" },
      { t: "1 tháng sau: “linh thạch của ta đâu?” → “à… MAI”", k: "month", size: 29 },
      { t: "1 năm sau: “đạo hữu?!”", k: "year" },
    ],
    punchSmall: "đột phá thành công cảnh giới", punchBig: "VÔ LIÊM SỈ", punchKey: "punch",
    footer: "mai · mai · mai",
  },
  {
    beat: "CG2GAG", num: "2", name: "NHÂN TÌNH NỢ", emoji: "🤝", color: JADE,
    lines: [
      { t: "có người kéo ngươi lên khi còn ở ĐÁY", k: "bottom" },
      { t: "cho cơ hội · giới thiệu quan hệ · giúp lúc khó khăn", k: "help", size: 29 },
      { t: "“sau này ta nhất định BÁO ĐÁP!”", k: "promise" },
      { t: "rồi ngươi thành công · họ nhắn: “dạo này khỏe không?”", k: "msg", size: 28 },
    ],
    punchBig: "“AI HACK NICK ĐẠO HỮU VẬY?”", punchKey: "punch",
    footer: "người kéo ngươi lên · ngươi quên mặt",
  },
  {
    beat: "CG3GAG", num: "3", name: "TRI THỨC NỢ", emoji: "📚", color: JADE,
    lines: [
      { t: "đại năng truyền cho ngươi BÍ PHÁP", k: "teach" },
      { t: "ngươi ra giang hồ kiếm tiền bằng chính bí pháp ấy", k: "earn", size: 30 },
      { t: "“huynh học ở đâu?”", k: "ask" },
    ],
    punchBig: "“TỰ NGHIÊN CỨU”", punchKey: "punch",
    footer: "đại năng đứng phía sau 👁️👄👁️",
  },
  {
    beat: "CG4GAG", num: "4", name: "THỜI GIAN NỢ", emoji: "⏳", color: CRIMSON,
    lines: [
      { t: "cha mẹ: “bao giờ về nhà?” → “để con bận xong đã”", k: "parent", size: 29 },
      { t: "bạn bè: “bao giờ gặp?” → “để tao rảnh đã”", k: "friend", size: 29 },
      { t: "người yêu: “anh có thời gian cho em không?”", k: "lover", size: 29 },
      { t: "“anh đang tu luyện…”", k: "cultivate" },
    ],
    punchSmall: "đến lúc ngẩng đầu lên…", punchBig: "10 NĂM ĐÃ ĐỘN THỔ", punchKey: "punch",
    footer: "cảnh giới cực kỳ nguy hiểm",
  },
  {
    beat: "CG5GAG", num: "5", name: "LỜI HỨA NỢ", emoji: "📜", color: GOLD,
    lines: [
      { t: "“mai ta làm” · “tuần sau ta trả”", k: "p0" },
      { t: "“tháng sau ta bắt đầu” · “cuối năm ta sẽ thay đổi”", k: "p1", size: 30 },
      { t: "📋 +1   📋 +1   📋 +1   📋 +1", k: "tally", c: GOLD, size: 40 },
      { t: "cuối năm Thiên Đạo mở sổ: “tổng cộng 47 LỜI HỨA”", k: "book", size: 29 },
    ],
    punchBig: "“CÓ GIẢM GIÁ KHI TRẢ MỘT LẦN KHÔNG?”", punchKey: "punch",
    footer: "thiên đạo ghi sổ · không quên dòng nào",
  },
  {
    beat: "CG6GAG", num: "6", name: "TÌNH NGHĨA NỢ", emoji: "🍻", color: GOLD,
    lines: [
      { t: "thường xuất hiện trong HỘI HUYNH ĐỆ", k: "group" },
      { t: "lúc ngươi giàu: “huynh đệ! lâu quá không gặp!”", k: "rich", size: 29 },
      { t: "lúc ngươi có chuyện: “huynh đệ ơi CỨU TA!”", k: "need", size: 29 },
      { t: "nhưng lúc bằng hữu gặp nạn…", k: "trouble" },
    ],
    punchBig: "“ĐẠO TÂM TA HÔM NAY BẤT ỔN”", punchKey: "punch",
    footer: "chỉ xuất hiện khi mình cần",
  },
  {
    beat: "CG7GAG", num: "7", name: "NHÂN QUẢ NỢ", emoji: "☠️", color: CRIMSON,
    lines: [
      { t: "cảnh giới CUỐI CÙNG", k: "last" },
      { t: "ngươi LỪA người khác", k: "a0" },
      { t: "LỢI DỤNG người khác", k: "a1" },
      { t: "LÀM TỔN THƯƠNG người khác", k: "a2" },
      { t: "rồi tự nhủ: “chuyện qua rồi”", k: "excuse" },
    ],
    punchSmall: "Thiên Đạo:", punchBig: "“QUA ĐÂU?”", punchKey: "punch",
    footer: "sổ chưa đóng · nợ chưa xoá",
  },
];

const LESSONS: LesCfg[] = [
  {
    beat: "CG1LES", color: GOLD, head: "NHƯNG NÓI NGHIÊM TÚC",
    lines: [{ t: "nợ tiền thì TRẢ ĐÚNG HẠN", k: "pay" }, { t: "không trả được thì NÓI", k: "say" }],
    bigKey: "silence", big: "IM LẶNG PHÁ HỎNG LÒNG TIN NHANH NHẤT",
    footer: "im lặng đắt hơn tiền",
  },
  {
    beat: "CG2LES", color: JADE, head: "ĐÂY LÀ CẢNH GIỚI QUÊN ƠN",
    lines: [{ t: "không phải ân tình nào cũng trả bằng TIỀN", k: "money" }],
    bigKey: "remember", big: "ĐÔI KHI CHỈ CẦN NHỚ NGƯỜI ĐÃ GIÚP MÌNH",
    footer: "nhớ · là đã trả một phần",
  },
  {
    beat: "CG3LES", color: JADE, head: "KHI DÙNG KIẾN THỨC NGƯỜI KHÁC",
    lines: [{ t: "GHI NGUỒN", k: "src" }, { t: "CẢM ƠN", k: "thanks" }, { t: "hoặc TRẢ CÔNG XỨNG ĐÁNG", k: "pay" }],
    bigKey: "cost", big: "“MIỄN PHÍ” CÓ THỂ ĐÃ ĐƯỢC TRẢ BẰNG 10 NĂM CUỘC ĐỜI",
    footer: "thứ ngươi học không tự sinh ra",
  },
  {
    beat: "CG4LES", color: CRIMSON, head: "TIỀN MẤT CÒN KIẾM LẠI ĐƯỢC",
    lines: [{ t: "nhưng THỜI GIAN thì không", k: "time" }, { t: "Thiên Đạo không có Ctrl + Z", k: "undo" }],
    bigKey: "who", big: "THỜI GIAN DÀNH CHO NGƯỜI QUAN TRỌNG",
    footer: "không có nút hoàn tác",
  },
  {
    beat: "CG5LES", color: GOLD, head: "HỨA MÀ KHÔNG LÀM NHIỀU LẦN",
    lines: [{ t: "người khác KHÔNG CÒN TIN LỜI NGƯƠI", k: "trust" }, { t: "làm được thì NÓI", k: "do" }],
    bigKey: "straight", big: "KHÔNG LÀM ĐƯỢC THÌ NÓI THẲNG",
    footer: "đừng hứa cho hay",
  },
  {
    beat: "CG6LES", color: GOLD, head: "TÌNH NGHĨA KHÔNG PHẢI AI NHỜ GÌ CŨNG GIÚP",
    lines: [{ t: "nhưng đã xem nhau là BẰNG HỮU", k: "friend" }],
    bigKey: "only", big: "THÌ ĐỪNG CHỈ XUẤT HIỆN KHI MÌNH CẦN",
    footer: "bằng hữu không phải dịch vụ",
  },
  {
    beat: "CG7LES", color: CRIMSON, head: "NHÂN QUẢ KHÔNG PHẢI GƯƠNG SOI",
    lines: [
      { t: "mà là MỌI HÀNH ĐỘNG ĐỀU ĐỂ LẠI HẬU QUẢ", k: "conseq" },
      { t: "mất NIỀM TIN · mất QUAN HỆ · mất CƠ HỘI", k: "lose" },
      { t: "hoặc biến mình thành người ai cũng tránh", k: "become" },
    ],
    bigKey: "karma", big: "ĐÓ MỚI LÀ NGHIỆP LỚN NHẤT",
    footer: "nghiệp không nằm ở quả báo",
  },
];

const SLIDES: React.FC<{ duration: number }>[] = [
  S_TRIGGER,
  S_ATTENTION,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[0]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[0]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[1]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[1]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[2]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[2]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[3]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[3]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[4]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[4]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[5]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[5]} />,
  ({ duration }) => <RealmGag duration={duration} cfg={GAGS[6]} />,
  ({ duration }) => <RealmLesson duration={duration} cfg={LESSONS[6]} />,
  S_PAYOFF1,
  S_PAYOFF2,
  S_TRANSMIT,
  S_CTA,
];

export const NoDao: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Audio src={staticFile("nodao/voice.wav")} />
    {bgm ? <Audio src={staticFile("nodao/bgm.mp3")} volume={0.14} /> : null}
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
