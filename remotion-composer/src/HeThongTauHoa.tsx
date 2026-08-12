import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./he_thong_tau_hoa_beats.json";

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
          <pattern id="htgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="htgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="htglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.06" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="htscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#htgrid)" />
        <rect width={W} height={H} fill="url(#htgrid2)" />
        <rect width={W} height={H} fill="url(#htglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#htscan)" />
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
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · legacy system · 2026</text>
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
      <rect x={W / 2 - 165} y={260} width={330} height={68} rx={6} fill={color} />
      <text x={W / 2} y={306} fontSize={30} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">DẤU HIỆU {num}</text>
      <text x={W / 2} y={392} fontSize={(name || "").length > 24 ? 34 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// terminal box (file list / git blame)
const Terminal: React.FC<{ y: number; h: number; title: string; color: string; entry: number; children: React.ReactNode }> = ({ y, h, title, color, entry, children }) => {
  const a = useScaleIn(entry, 14);
  const x = W / 2 - 440;
  const w = 880;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={BG_TERM} stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={52} rx={10} fill={BG_CARD} />
      <rect x={x} y={y + 42} width={w} height={10} fill={BG_CARD} />
      <circle cx={x + 28} cy={y + 26} r={7} fill={WARNING_RED} />
      <circle cx={x + 52} cy={y + 26} r={7} fill={AMBER} />
      <circle cx={x + 76} cy={y + 26} r={7} fill={JADE} />
      <text x={x + w / 2} y={y + 32} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1">{title}</text>
      {children}
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
  const t = useScaleIn(20, 16);
  const sub = useFadeUp(90, 14);
  const reveal = useScaleIn(190, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="SYSTEM · DEATH OMENS" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={415} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHỮNG DẤU HIỆU một HỆ THỐNG</text>
            <text x={W / 2} y={490} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">SẮP TẨU HỎA NHẬP MA</text>
          </g>
          <text x={W / 2} y={650} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={sub}>
            Mọi hệ thống đều có tuổi thọ...
          </text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={800} w={940} h={240} color={AMBER} thick={2.5} />
            <text x={W / 2} y={865} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Trước khi tẩu hỏa nhập ma</text>
            <text x={W / 2} y={925} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nó phát ra điềm báo rõ ràng</text>
            <text x={W / 2} y={990} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ là không ai muốn tin 🙈</text>
          </g>
          <FigFooter label="7 điềm báo hệ thống sắp sụp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 DH1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const q1 = useFadeUp(80, 10), q2 = useFadeUp(130, 10), q3 = useFadeUp(180, 10);
  const punch = useScaleIn(250, 14);
  const quotes = [
    { y: 0, t: "\"Đừng đụng vào\"", anim: q1 },
    { y: 96, t: "\"Đang chạy là được\"", anim: q2 },
    { y: 192, t: "\"Để đời sau xử lý\"", anim: q3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="FORBIDDEN ZONE" />
          <Badge num="1" name="Không còn ai dám động vào" color="#A4B5D0" entry={15} />
          <text x={W / 2} y={500} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1" style={q1}>// mỗi lần mở file:</text>
          {quotes.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${580 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-420} y={-34} width={840} height={72} rx={14} fill={BG_CARD} stroke="#A4B5D0" strokeWidth={1.5} />
              <text x={0} y={10} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">{r.t}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 960px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={880} w={940} h={170} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={945} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Code thành 🚫 CẤM ĐỊA</text>
            <text x={W / 2} y={1005} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ thiên kiếp đã ở rất gần</text>
          </g>
          <FigFooter label="dấu hiệu 1 · nobody dares touch it" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 DH2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const c1 = useScaleIn(80, 12), c2 = useScaleIn(120, 12), c3 = useScaleIn(160, 12);
  const punch = useScaleIn(240, 14);
  const cards = [
    { x: -300, t: "Frontend", anim: c1, c: VIOLET },
    { x: 0, t: "Backend", anim: c2, c: ACCENT_BLUE },
    { x: 300, t: "DevOps", anim: c3, c: ORANGE },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="NOBODY SEES THE WHOLE" />
          <Badge num="2" name="Không ai thấy toàn bộ" color="#5BE8A8" entry={15} />
          <text x={W / 2} y={520} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={c1}>Mỗi người chỉ hiểu MỘT PHẦN:</text>
          {cards.map((c, i) => (
            <g key={i} style={{ ...c.anim, transformOrigin: `${W / 2 + c.x}px 680px`, transformBox: "fill-box" }}>
              <rect x={W / 2 + c.x - 145} y={600} width={290} height={170} rx={12} fill={BG_CARD} stroke={c.c} strokeWidth={2} />
              <text x={W / 2 + c.x} y={668} fontSize={48} textAnchor="middle">🧩</text>
              <text x={W / 2 + c.x} y={735} fontSize={26} fill={c.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.t}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 970px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={880} w={940} h={180} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={945} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ghép cả 3 lại →</text>
            <text x={W / 2} y={1010} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vẫn KHÔNG ai biết nó chạy thế nào ❓</text>
          </g>
          <FigFooter label="dấu hiệu 2 · no single owner" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 DH3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const icon = useScaleIn(60, 16);
  const punch = useFadeUp(140, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="DEPLOY = PRAYER" />
          <Badge num="3" name="Mỗi lần deploy = cầu nguyện" color="#5BB8FF" entry={15} />
          <g style={{ ...icon, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={620} fontSize={130} textAnchor="middle">🙏</text>
            <text x={W / 2} y={720} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Mỗi lần deploy → cả tông môn cầu nguyện</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={830} w={940} h={180} color={AMBER} thick={2.5} />
            <text x={W / 2} y={895} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Không ai chắc chuyện gì xảy ra</text>
            <text x={W / 2} y={960} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">kể cả người vừa BẤM deploy 😰</text>
          </g>
          <FigFooter label="dấu hiệu 3 · pray and pray" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 DH4 — temp files ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const files = ["temp_final_v2", "temp_final_v2_final", "temp_final_v2_final_new", "temp_final_v2_final_new_fix"];
  const punch = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="ANCIENT ARTIFACTS" />
          <Badge num="4" name="Cổ thần thượng cổ xuất hiện" color="#B47AFF" entry={15} />
          <Terminal y={490} h={360} title="$ ls legacy/" color={VIOLET} entry={75}>
            {files.map((f, i) => (
              <g key={i} opacity={frame > 95 + i * 22 ? 1 : 0}>
                <text x={W / 2 - 410} y={580 + i * 72} fontSize={26} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📜 {f}</text>
              </g>
            ))}
          </Terminal>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1030px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={910} w={940} h={240} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={970} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// không ai biết · không ai dám xóa</text>
            <text x={W / 2} y={1030} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rất có thể chúng đang TRẤN ÁP</text>
            <text x={W / 2} y={1090} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">một tâm ma nào đó trong production 🔮</text>
          </g>
          <FigFooter label="dấu hiệu 4 · cursed leftover files" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 DH5 — đạo tổ phi thăng ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const icon = useScaleIn(40, 16);
  const k1 = useFadeUp(130, 10), k2 = useFadeUp(170, 10), k3 = useFadeUp(210, 10);
  const mat = useScaleIn(300, 16);
  const knows = [
    { y: 0, t: "vì sao service này tồn tại", anim: k1 },
    { y: 64, t: "vì sao đoạn code kia không được đụng", anim: k2 },
    { y: 128, t: "vì sao production vẫn còn sống", anim: k3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE KEEPER LEFT" />
          <Badge num="5" name="Đạo Tổ đã phi thăng" color="#FFA552" entry={15} />
          <g style={{ ...icon, transformOrigin: `${W / 2}px 510px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={520} fontSize={90} textAnchor="middle">🧙‍♂️✨</text>
            <text x={W / 2} y={580} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Người DUY NHẤT biết:</text>
          </g>
          {knows.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${660 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-450} y={-28} width={900} height={56} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
              <text x={-420} y={9} fontSize={22} fill={ORANGE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>▸</text>
              <text x={-380} y={9} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <g style={{ ...mat, transformOrigin: `${W / 2}px 960px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={930} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Ngày ngài nghỉ việc →</text>
            <text x={W / 2} y={1000} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thời kỳ MẠT PHÁP ⚰️</text>
          </g>
          <FigFooter label="dấu hiệu 5 · bus factor = 1, gone" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DH6 — git blame ma ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const lines = [
    { h: "a1f9", who: "ghost_dev_2014", t: "👻" },
    { h: "0e2c", who: "???_unknown", t: "👻" },
    { h: "b77a", who: "đã_nghỉ_lâu_rồi", t: "👻" },
  ];
  const punch = useScaleIn(260, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="GIT BLAME · GHOSTS" />
          <Badge num="6" name="Git blame toàn tên người mất tích" color="#FF6B6B" entry={15} />
          <Terminal y={500} h={300} title="$ git blame app.py" color={WARNING_RED} entry={75}>
            {lines.map((l, i) => (
              <g key={i} opacity={frame > 100 + i * 26 ? 1 : 0}>
                <text x={W / 2 - 410} y={590 + i * 70} fontSize={24} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{l.h}</text>
                <text x={W / 2 - 320} y={590 + i * 70} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{l.who} {l.t}</text>
              </g>
            ))}
          </Terminal>
          <text x={W / 2} y={880} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(180, 12)}>
            không online · không email · không dấu vết
          </text>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 1000px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={930} w={940} h={150} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1000} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng code họ vẫn ÂM THẦM</text>
            <text x={W / 2} y={1045} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vận hành toàn bộ production 👻</text>
          </g>
          <FigFooter label="dấu hiệu 6 · code by missing ancestors" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 DH7 — rewrite ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(70, 14);
  const react = useFadeUp(150, 12);
  const punch = useScaleIn(220, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE DEATH RATTLE" />
          <Badge num="7" name="'Hay là rewrite toàn bộ?'" color="#FFC857" entry={15} />
          <g style={{ ...q, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={500} width={880} height={150} rx={18} fill={BG_CARD} stroke="#FFC857" strokeWidth={2.5} />
            <text x={W / 2 - 410} y={545} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🙋 Có người đứng lên ▸</text>
            <text x={W / 2} y={610} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Hay là rewrite toàn bộ?"</text>
          </g>
          <text x={W / 2} y={760} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={react}>
            Các trưởng lão đồng loạt TRẦM MẶC 😶
          </text>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={860} w={940} h={170} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={925} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// khi câu này xuất hiện</text>
            <text x={W / 2} y={985} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bệnh đã vào tận CĂN CƠ</text>
          </g>
          <FigFooter label="dấu hiệu 7 · 'let's rewrite' = terminal" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const n1 = useFadeUp(90, 10), n2 = useFadeUp(130, 10);
  const reveal = useScaleIn(220, 16);
  const cta = useFadeUp(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="VERDICT · DEATH BY DELAY" />
          <text x={W / 2} y={380} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>
            Hệ thống tẩu hỏa nhập ma KHÔNG phải do:
          </text>
          <g transform={`translate(${W / 2}, 480)`} opacity={n1.opacity}>
            <rect x={-360} y={-28} width={720} height={56} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <text x={0} y={9} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">✗ một con bug</text>
          </g>
          <g transform={`translate(${W / 2}, 550)`} opacity={n2.opacity}>
            <rect x={-360} y={-28} width={720} height={56} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
            <text x={0} y={9} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">✗ một commit</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={650} w={940} h={230} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={710} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là kết quả của HÀNG NGHÌN lần:</text>
            <text x={W / 2} y={795} fontSize={64} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"để sau sửa" 🔁</text>
            <text x={W / 2} y={850} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ đại kiếp production giáng lâm</text>
          </g>
          <g transform={`translate(${W / 2}, 1050)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu trúng mấy dấu hiệu rồi? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="legacy · chết vì hàng nghìn lần để sau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const HeThongTauHoa: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("he_thong_tau_hoa/voice.mp3")} />
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
