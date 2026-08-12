import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./network_truyen_am_beats.json";

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
const useScaleIn = (e: number, d = 16) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = ACCENT_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ntgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ntgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ntglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ntscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ntgrid)" />
        <rect width={W} height={H} fill="url(#ntgrid2)" />
        <rect width={W} height={H} fill="url(#ntglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ntscan)" />
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

const Reveal: React.FC<{ cx: number; cy: number; label: string; sub?: string; color: string; entry: number; big?: boolean }> = ({ cx, cy, label, sub, color, entry, big }) => {
  const a = useScaleIn(entry, 14);
  const w = big ? 560 : 420;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 56 : 44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 38} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const two = useScaleIn(40, 14);
  const q = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE ANCIENT PROBLEM" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Vấn đề làm khó đại năng từ thượng cổ:</text>
          <g style={two}>
            <rect x={W / 2 - 440} y={420} width={300} height={180} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={3} />
            <text x={W / 2 - 290} y={510} fontSize={56} textAnchor="middle">🏯</text>
            <text x={W / 2 - 290} y={565} fontSize={26} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tông A</text>
            <text x={W / 2} y={520} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>· · · vạn dặm · · ·</text>
            <rect x={W / 2 + 140} y={420} width={300} height={180} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2 + 290} y={510} fontSize={56} textAnchor="middle">🏯</text>
            <text x={W / 2 + 290} y={565} fontSize={26} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tông B</text>
          </g>
          <g style={{ ...q, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={770} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Làm sao 2 tông cách vạn dặm</text>
            <text x={W / 2} y={825} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vẫn truyền tin cho nhau? 📡</text>
          </g>
          <FigFooter label="bài toán muôn đời · truyền tin đường xa" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NGÀY XƯA ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const path = useScaleIn(40, 14);
  const dangers = [
    { t: "🐉 yêu thú đầy rẫy", e: 160 },
    { t: "⚡ thiên kiếp bất ngờ", e: 210 },
  ];
  const lost = useScaleIn(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE OLD WAY" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Ngày xưa · chỉ có một cách:</text>
          <g style={{ ...path, transformOrigin: `${W / 2}px 450px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={360} width={880} height={170} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={440} fontSize={56} textAnchor="middle">🧝‍♂️📜</text>
            <text x={W / 2} y={500} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cử đệ tử mang sách lên đường</text>
          </g>
          <text x={W / 2} y={620} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(110, 12)}>nhưng đường xa vạn dặm…</text>
          {dangers.map((d, i) => (
            <g key={i} opacity={useFade(d.e, 10)}>
              <rect x={W / 2 - 340} y={660 + i * 80} width={680} height={64} rx={10} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={W / 2} y={702 + i * 80} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{d.t}</text>
            </g>
          ))}
          <g style={{ ...lost, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={840} w={940} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={912} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ bí tịch thất lạc giữa đường 💀</text>
          </g>
          <FigFooter label="1 người · 1 sách · vô vàn rủi ro" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 NETWORK ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const reveal = useScaleIn(120, 16);
  const swords = useFade(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="THE GREAT FORMATION" />
          <text x={W / 2} y={320} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Trận pháp sư lĩnh ngộ một đại trận mới…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={480} label="NETWORK" sub="// đại trận truyền âm" color={ACCENT_BLUE} entry={0} big />
          </g>
          <text x={W / 2} y={640} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(200, 12)}>tin không còn vận chuyển bằng người…</text>
          <g opacity={swords}>
            <text x={W / 2} y={760} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà bằng vô số PHI KIẾM TRUYỀN THƯ 🗡️</text>
            {Array.from({ length: 7 }).map((_, i) => {
              const x = interpolate((frame - 260 + i * 14) % 120, [0, 120], [W / 2 - 420, W / 2 + 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <text key={i} x={x} y={850 + (i % 3) * 40} fontSize={34} opacity={0.8}>🗡️</text>;
            })}
          </g>
          <FigFooter label="network · mạng lưới truyền tin vô hình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 PACKET ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const bad = useScaleIn(40, 14);
  const split = useScaleIn(180, 14);
  const reveal = useScaleIn(330, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="DIVIDE THE SCROLL" />
          <g style={{ ...bad, transformOrigin: `${W / 2}px 400px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={310} width={840} height={170} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={385} fontSize={52} textAnchor="middle">🗡️📚</text>
            <text x={W / 2} y={445} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cả bộ bí tịch / 1 phi kiếm → kiếm hủy = mất sạch</text>
          </g>
          <text x={W / 2} y={560} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(150, 12)}>↓ chia nhỏ ↓</text>
          <g style={split}>
            {Array.from({ length: 8 }).map((_, i) => {
              const col = i % 4, row = Math.floor(i / 4);
              const x = W / 2 - 300 + col * 200, y = 640 + row * 110;
              return (
                <g key={i} opacity={useFade(180 + i * 12, 10)}>
                  <rect x={x - 80} y={y - 45} width={160} height={90} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                  <text x={x} y={y + 8} fontSize={32} textAnchor="middle">📦</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={920} label="PACKET" sub="// mỗi mảnh nhỏ của bí tịch" color={JADE} entry={0} big />
          </g>
          <FigFooter label="chia nhỏ · mất 1 mảnh ≠ mất tất cả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 IP ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const card = useScaleIn(30, 14);
  const src = useScaleIn(130, 14);
  const dst = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="TWO SEALS ON EACH PACKET" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Mỗi Packet mang 2 đạo ấn:</text>
          <g style={{ ...card, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 360} y={380} width={720} height={360} rx={18} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={3} />
            <text x={W / 2} y={440} fontSize={44} textAnchor="middle">📦</text>
            <line x1={W / 2 - 320} y1={470} x2={W / 2 + 320} y2={470} stroke={TEXT_MUTE} strokeWidth={1} opacity={0.4} />
            <text x={W / 2} y={700} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// dữ liệu bên trong</text>
          </g>
          <g style={src}>
            <rect x={W / 2 - 330} y={490} width={660} height={86} rx={10} fill="#0E2A1A" stroke={JADE} strokeWidth={2} />
            <text x={W / 2 - 300} y={524} fontSize={20} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>FROM · từ đâu</text>
            <text x={W / 2 - 300} y={556} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Source IP</text>
          </g>
          <g style={dst}>
            <rect x={W / 2 - 330} y={588} width={660} height={86} rx={10} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 300} y={622} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>TO · tới đâu</text>
            <text x={W / 2 - 300} y={654} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Destination IP</text>
          </g>
          <text x={W / 2} y={830} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(330, 12)}>như 1 phong thư · có người gửi & người nhận ✉️</text>
          <FigFooter label="địa chỉ · để phi kiếm biết đường về" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 ROUTER ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const q = useScaleIn(40, 14);
  const nodes = useFade(260, 16);
  const reveal = useScaleIn(540, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="WHO KNOWS THE WAY?" />
          <g style={{ ...q, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>biết NƠI ĐẾN ≠ biết ĐƯỜNG ĐI 🧭</text>
            <text x={W / 2} y={360} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">vô số giới vực · vô số ngã rẽ…</text>
          </g>
          {/* hop diagram */}
          <g opacity={nodes}>
            <line x1={W / 2 - 380} y1={520} x2={W / 2 + 380} y2={520} stroke={VIOLET} strokeWidth={2} strokeDasharray="8 6" opacity={0.5} />
            {[0, 1, 2, 3].map((i) => {
              const x = W / 2 - 330 + i * 220;
              return (
                <g key={i} opacity={frame > 270 + i * 25 ? 1 : 0}>
                  <rect x={x - 60} y={470} width={120} height={100} rx={12} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
                  <text x={x} y={515} fontSize={30} textAnchor="middle">🧭</text>
                  <text x={x} y={550} fontSize={16} fill={VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>kiểm tra</text>
                </g>
              );
            })}
            <text x={W / 2} y={620} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">Truyền Tống Điện · đọc địa chỉ → chọn tuyến tiếp</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={760} label="ROUTER" sub="// trạm định tuyến cho Packet" color={VIOLET} entry={0} big />
          </g>
          <text x={W / 2} y={900} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(620, 12)}>Packet nhảy qua từng Router để tới đích 🐇</text>
          <FigFooter label="router · người gác đường mỗi ngã rẽ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 PROBLEMS ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const probs = [
    { t: "📭 bị thất lạc", e: 160 },
    { t: "🐌 tới quá muộn", e: 230 },
    { t: "🔀 đi nhầm đường", e: 300 },
    { t: "💨 biến mất giữa thiên địa", e: 370 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="WHAT COULD GO WRONG" />
          <text x={W / 2} y={310} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Packet qua 1 hay hàng chục Router… mới tới đích</text>
          <text x={W / 2} y={400} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(90, 12)}>nhưng thiên đạo thích tạo phiền phức ⚠️</text>
          {probs.map((p, i) => {
            const a = useScaleIn(p.e, 12);
            const y = 470 + i * 120;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 45}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 440} y={y} width={880} height={90} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={y + 58} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{p.t}</text>
              </g>
            );
          })}
          <FigFooter label="mạng = nơi không gì chắc chắn 100%" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TCP/ACK ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(30, 14);
  const ack = useScaleIn(170, 14);
  const resend = useScaleIn(360, 14);
  const intact = useScaleIn(480, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="RELIABLE DELIVERY" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={290} label="TCP ĐẠO" sub="// giao hàng đảm bảo" color={JADE} entry={0} />
          </g>
          <g style={ack}>
            <rect x={W / 2 - 440} y={400} width={880} height={180} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 400} y={450} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📦 gửi Packet →</text>
            <text x={W / 2 + 400} y={510} fontSize={26} fill={JADE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>← "Ta đã nhận được" ✓</text>
            <text x={W / 2} y={555} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>tín hiệu xác nhận = ACK</text>
          </g>
          <g style={resend}>
            <rect x={W / 2 - 440} y={620} width={880} height={130} rx={14} fill="#2A1810" stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={672} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⏱ lâu không thấy ACK?</text>
            <text x={W / 2} y={718} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ GỬI LẠI Packet lần nữa 🔁</text>
          </g>
          <g style={{ ...intact, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={790} w={940} h={120} color={JADE} thick={3} />
            <text x={W / 2} y={862} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ dù chia ngàn Packet · vẫn tới NGUYÊN VẸN ✨</text>
          </g>
          <FigFooter label="tcp · chậm hơn nhưng chắc chắn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 UDP ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const cases = useFadeUp(40, 12);
  const reveal = useScaleIn(330, 14);
  const no = useFadeUp(470, 14);
  const fire = useScaleIn(620, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="SPEED OVER PERFECTION" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>khi không cần đầy đủ · chỉ cần NHANH:</text>
          <g style={cases}>
            {["⚔️ truyền âm khi giao chiến", "📺 livestream đại hội tông môn", "🔭 hình ảnh từ Thiên Lý Kính"].map((c, i) => (
              <g key={i} opacity={useFade(60 + i * 50, 10)}>
                <rect x={W / 2 - 380} y={340 + i * 82} width={760} height={66} rx={10} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={383 + i * 82} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={660} label="UDP ĐẠO" sub="// bắn đi · không quay đầu" color={ORANGE} entry={0} />
          </g>
          <g style={no}>
            <text x={W / 2} y={780} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ không ACK · ✗ không xác nhận · ✗ không gửi lại</text>
          </g>
          <g style={{ ...fire, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={140} color={ORANGE} thick={3} />
            <text x={W / 2} y={868} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>phi kiếm lao thẳng · tới được thì tốt</text>
            <text x={W / 2} y={918} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không tới = hữu duyên vô phận 🍃</text>
          </g>
          <FigFooter label="udp · nhanh · chấp nhận mất mát" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const real = useScaleIn(140, 14);
  const stats = useFadeUp(330, 14);
  const truth = useScaleIn(600, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE GRAND FORMATION" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Nhiều người nghĩ Network chỉ là công cụ…</text>
          <g style={{ ...real, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={395} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>thực ra · là một ĐẠI TRẬN khổng lồ 🌐</text>
          </g>
          <g style={stats}>
            {["⚡ hàng TỶ Packet mỗi giây", "🗡️ hóa thành vô số phi kiếm", "🧭 xuyên hàng TRIỆU Router"].map((s, i) => (
              <g key={i} opacity={useFade(360 + i * 55, 10)}>
                <rect x={W / 2 - 400} y={450 + i * 86} width={800} height={70} rx={10} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                <text x={W / 2} y={494 + i * 86} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s}</text>
              </g>
            ))}
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={750} w={940} h={210} color={AMBER} thick={3} />
            <text x={W / 2} y={810} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Packet không cần biết thiên hạ rộng lớn ra sao</text>
            <text x={W / 2} y={865} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nó chỉ cần biết: mình TỪ ĐÂU · phải ĐI ĐÂU</text>
            <text x={W / 2} y={920} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">phần còn lại · để Đại Trận Truyền Âm dẫn đường 🏯</text>
          </g>
          <FigFooter label="network · đại trận thầm lặng nối cả thế giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const NetworkTruyenAm: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("network_truyen_am/voice.mp3")} />
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
