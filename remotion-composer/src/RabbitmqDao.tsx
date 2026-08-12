import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./rabbitmq_dao_beats.json";

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
          <pattern id="rqgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="rqgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="rqglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rqscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#rqgrid)" />
        <rect width={W} height={H} fill="url(#rqgrid2)" />
        <rect width={W} height={H} fill="url(#rqglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#rqscan)" />
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
  const w = big ? 620 : 440;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 52 : 46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 38} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const sync = useFadeUp(60, 14);
  const fail = useScaleIn(280, 14);
  const reveal = useScaleIn(480, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="THE SYNCHRONOUS WAY" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>thượng cổ · mỗi việc đều phải tự xử lý:</text>
          <g style={sync}>
            <rect x={W / 2 - 460} y={350} width={920} height={130} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={400} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người gửi 📤 phải trực tiếp tìm người nhận</text>
            <text x={W / 2} y={445} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người nhận 📥 phải LẬP TỨC có mặt</text>
          </g>
          <g style={fail}>
            {["🚪 đối phương bế quan → công việc MẮC KẸT", "💀 đối phương độ kiếp → nhân quả ĐÌNH TRỆ"].map((t, i) => (
              <g key={i} opacity={useFade(300 + i * 40, 10)}>
                <rect x={W / 2 - 460} y={520 + i * 84} width={920} height={70} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={563 + i * 84} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={800} label="ĐỒNG BỘ ĐẠO" sub="// synchronous · phải chờ nhau" color={ORANGE} entry={0} big />
          </g>
          <FigFooter label="rabbitmq · hộ pháp trưởng lão của tam giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 PROBLEM ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const grow = useFadeUp(40, 14);
  const chain = useScaleIn(160, 14);
  const collapse = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE DEATH CHAIN" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={grow}>tông môn lớn mạnh · trăm vạn đệ tử xuất hiện…</text>
          <g style={{ ...chain, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            {[0, 1, 2, 3].map((i) => {
              const x = W / 2 - 360 + i * 240;
              return (
                <g key={i}>
                  <rect x={x - 75} y={410} width={150} height={110} rx={14} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
                  <text x={x} y={460} fontSize={32} textAnchor="middle">⚙️</text>
                  <text x={x} y={498} fontSize={20} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>svc</text>
                  {i < 3 && <text x={x + 120} y={478} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontWeight={700}>→</text>}
                </g>
              );
            })}
            <text x={W / 2} y={580} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">nhân quả chằng chịt · khí cơ liên kết 🕸️</text>
          </g>
          <g style={{ ...collapse, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={650} w={940} h={190} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={715} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ cần MỘT vị ngã xuống…</text>
            <text x={W / 2} y={775} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cả CHUỖI cùng nghênh đón thiên kiếp 💀</text>
          </g>
          <FigFooter label="tight coupling · 1 service chết kéo theo tất cả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 RABBITMQ ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(40, 16);
  const mid = useFadeUp(200, 14);
  const queue = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="A NEW WAY" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>một truyền thừa cổ xưa xuất thế…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={440} label="RABBITMQ ĐẠO" sub="// không ép các đồng môn gặp nhau" color={JADE} entry={0} big />
          </g>
          <text x={W / 2} y={580} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={mid}>thay vào đó · dựng lên một NƠI TRUNG GIAN 🏛️</text>
          <g style={{ ...queue, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={660} w={940} h={200} color={AMBER} thick={3} />
            <text x={W / 2} y={720} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>các đại năng gọi nơi đó là:</text>
            <text x={W / 2} y={775} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Hàng Đợi Thiên Cơ</text>
            <text x={W / 2} y={835} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900} letterSpacing="2">= QUEUE 📬</text>
          </g>
          <FigFooter label="message queue · nơi trung gian giữa các bên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 HOW ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const send = useScaleIn(40, 14);
  const queue = useScaleIn(160, 14);
  const recv = useScaleIn(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="PRODUCER · QUEUE · CONSUMER" />
          <g style={send}>
            <rect x={W / 2 - 460} y={300} width={920} height={150} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={350} fontSize={24} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📤 NGƯỜI GỬI</text>
            <text x={W / 2} y={395} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không cần biết AI xử lý · chỉ đặt</text>
            <text x={W / 2} y={430} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">nhiệm vụ vào Queue → rồi rời đi 🚶</text>
          </g>
          <g style={{ ...queue, transformOrigin: `${W / 2}px 545px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 300} y={490} width={600} height={110} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={540} fontSize={30} textAnchor="middle">📜 📜 📜</text>
            <text x={W / 2} y={580} fontSize={24} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// ngọc giản ở Vạn Bảo Các</text>
          </g>
          <g style={recv}>
            <rect x={W / 2 - 460} y={640} width={920} height={170} rx={16} fill="#0E1F35" stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={690} fontSize={24} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📥 NGƯỜI NHẬN</text>
            <text x={W / 2} y={735} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không cần lập tức xuất hiện</text>
            <text x={W / 2} y={780} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>khi xuất quan → tự tới lấy · tự lĩnh nhiệm vụ</text>
          </g>
          <FigFooter label="async · gửi và nhận không cần cùng lúc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 DECOUPLE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const cut = useScaleIn(20, 14);
  const free = useScaleIn(90, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="DECOUPLED" />
          <g style={{ ...cut, transformOrigin: `${W / 2}px 450px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={400} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhân quả được TÁCH RỜI</text>
            <text x={W / 2} y={465} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>khí cơ được CẮT ĐỨT ✂️</text>
          </g>
          <g style={{ ...free, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={560} w={940} h={180} color={JADE} thick={3} />
            <text x={W / 2} y={625} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>các service KHÔNG còn</text>
            <text x={W / 2} y={680} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">trói buộc lẫn nhau 🚀</text>
            <text x={W / 2} y={722} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// 1 service chết · các service khác vẫn sống</text>
          </g>
          <FigFooter label="decoupling · sức mạnh thật của message queue" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 CAVEATS ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const law = useScaleIn(30, 14);
  const risks = useFadeUp(160, 14);
  const ack = useScaleIn(380, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE PRICE OF POWER" />
          <g style={{ ...law, transformOrigin: `${W / 2}px 280px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={290} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thần thông càng mạnh · nhân quả càng lớn ⚖️</text>
          </g>
          <g style={risks}>
            {["📥 không ai nhận → ngọc giản chất thành NÚI", "💀 người nhận chết giữa đường → nhân quả thất lạc"].map((t, i) => (
              <g key={i} opacity={useFade(180 + i * 40, 10)}>
                <rect x={W / 2 - 460} y={350 + i * 90} width={920} height={76} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={395 + i * 90} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...ack, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={560} width={940} height={290} rx={18} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={615} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>xử lý xong mà QUÊN xác nhận (ACK):</text>
            <text x={W / 2} y={670} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ RabbitMQ tưởng ngươi CHƯA xong</text>
            <text x={W / 2} y={720} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ tiếp tục giao lại… 🔁🔁🔁</text>
            <text x={W / 2} y={790} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cho tới khi ngươi cảm ngộ thiên đạo 🤣</text>
          </g>
          <FigFooter label="at-least-once · phải ACK kẻo nhận lại hoài" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 PHÁP TẮC ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const head = useFadeUp(20, 14);
  const rules = useScaleIn(110, 14);
  const els = useFadeUp(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE SUPREME RULE" />
          <text x={W / 2} y={330} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={head}>pháp tắc tối cao của RabbitMQ Đạo:</text>
          <g style={rules}>
            <rect x={W / 2 - 460} y={400} width={920} height={110} rx={14} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={468} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhận nhiệm vụ → phải XÁC NHẬN ✅</text>
            <rect x={W / 2 - 460} y={530} width={920} height={110} rx={14} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={598} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>làm xong việc → phải HỒI BÁO 📨</text>
          </g>
          <g style={{ ...els, transformOrigin: `${W / 2}px 730px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={680} w={940} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={752} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nếu không → thiên đạo cho làm LẠI 🤣</text>
          </g>
          <FigFooter label="ack/nack · giao kèo giữa consumer và queue" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 USECASE ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const apps = useFadeUp(40, 14);
  const danger = useScaleIn(280, 14);
  const cases = ["📧 Email", "💳 Thanh toán", "🔔 Thông báo", "🌐 hệ phân tán"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="EVERYONE USES IT" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(8, 12)}>RabbitMQ ngày càng hưng thịnh:</text>
          <g style={apps}>
            {cases.map((c, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <g key={i} opacity={useFade(60 + i * 30, 10)}>
                  <rect x={W / 2 - 460 + col * 470} y={350 + row * 100} width={440} height={84} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                  <text x={W / 2 - 240 + col * 470} y={402 + row * 100} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c}</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...danger, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={610} w={960} h={220} color={AMBER} thick={3} />
            <text x={W / 2} y={672} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ nguy hiểm nhất 1 đại tông môn…</text>
            <text x={W / 2} y={725} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không phải công việc QUÁ NHIỀU</text>
            <text x={W / 2} y={785} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là tất cả phải ĐỨNG CHỜ NHAU ⏳</text>
          </g>
          <FigFooter label="async messaging · không ai phải chờ ai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const q = useFadeUp(30, 14);
  const reveal = useScaleIn(180, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE GUARDIAN ELDER" />
          <g style={q}>
            <text x={W / 2} y={320} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Queue KHÔNG làm công việc biến mất</text>
            <text x={W / 2} y={375} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">nó chỉ giúp nhân quả XẾP HÀNG theo thứ tự 📬</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={460} width={960} height={350} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={530} fontSize={70} textAnchor="middle">🐰</text>
            <text x={W / 2} y={600} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn RabbitMQ · chính là vị</text>
            <text x={W / 2} y={665} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">HỘ PHÁP TRƯỞNG LÃO</text>
            <text x={W / 2} y={720} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đứng giữa tam giới</text>
            <text x={W / 2} y={770} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">âm thầm điều phối mọi nhân quả 🏯</text>
          </g>
          <FigFooter label="message broker · trái tim của hệ phân tán" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const head = useFadeUp(6, 12);
  const btn = useScaleIn(36, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={620} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={head}>Còn vô số công pháp giới IT…</text>
          <text x={W / 2} y={685} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={head}>đang chờ giảng giải kiểu tu tiên 🏯</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={810} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={822} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={898} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1030} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>để gặp thêm công pháp giới IT 👇</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const RabbitmqDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("rabbitmq_dao/voice.mp3")} />
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
