import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./cr_beats.json";
import T from "./cr_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · Code Review · ta=cyan · reviewer đại năng=gold · kiếp=đỏ · danh hiệu=violet · ngộ=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";     // kiếp · đạo tâm nứt
const A = "#2BE2FF";       // TA (đệ tử)
const GOLD = "#FFC24B";    // reviewer đại năng
const GREEN = "#2EE6A8";   // ngộ · đạo lý
const VIOLET = "#A78BFF";  // danh hiệu · công pháp
const TEXT = "#ECE6F5";
const SEC = "#B0A8C4";
const MUTE = "#6E6685";
const HUDC = "#5B4E78";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.7, e + d], [0.8, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const HudBG: React.FC<{ tint?: string }> = ({ tint = A }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 5) % (H + 360)) - 180;
  const vx = W / 2, vy = 760;
  const floorCols = Array.from({ length: 13 }, (_, i) => -6 + i);
  const floorRows = [0, 70, 160, 280, 440, 660, 980];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="crGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="crGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="crScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="crVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#crGrid)" />
        <rect width={W} height={H} fill="url(#crGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#crScan)" />
        <rect width={W} height={H} fill="url(#crVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={A} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={GOLD} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={A} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={GOLD} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="crTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = A }) => {
  const frame = useCurrentFrame();
  const a1 = useFadeUp(0, 10), a2 = useFade(5, 10);
  const blink = Math.sin(frame / 9) > -0.3 ? 1 : 0.25;
  return (
    <g>
      <g style={a1}>
        <path d="M 80 114 L 80 150 L 100 150" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 112} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
        <circle cx={W - 96} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = A, fill = CARD, thick = 2, rx = 10, children }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.74} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
      <g stroke={c} strokeWidth={2.5} fill="none" opacity={0.9} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      {children}
    </g>
  );
};
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; h?: number }> = ({ y, who, whoC, text, entry, h = 92 }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + h - 26} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = VIOLET, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 50} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · GIỚI IT" />
          <g transform="translate(0, 148)">
            <text x={W / 2} y={286} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>NHỮNG LOẠI ĐẠO HỮU TRONG…</text>
            <g style={usePop(T.HOOK.rule, 13)}>
              <Card x={W / 2 - 470} y={326} w={940} h={116} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={372} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một nơi <tspan fill={GOLD} fontWeight={900}>KHÔNG phân cảnh giới</tspan> · không phân bối phận</text>
              <text x={W / 2} y={412} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngoại môn đệ tử hay trưởng lão — bước vào đều có thể…</text>
            </g>
            <g style={usePop(T.HOOK.broken, 14)}>
              <Card x={W / 2 - 400} y={460} w={800} h={92} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={518} fontSize={44} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)">💀 ĐẠO TÂM VỠ VỤN</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 420} y={572} w={840} h={150} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={624} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nơi ấy được gọi là:</text>
              <text x={W / 2} y={694} fontSize={68} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)" opacity={0.9 + 0.1 * glow}>CODE REVIEW</text>
            </g>
          </g>
          <Footer label="nơi không phân cảnh giới · ai cũng có thể vỡ đạo tâm" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 THIENCO ① ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="🔮 LOẠI ① · THIÊN CƠ TRƯỞNG LÃO" color={GOLD} />
        <g transform="translate(0, 112)">
          <g style={usePop(T.THIENCO.oneline, 13)}>
            <Card x={W / 2 - 470} y={236} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={284} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngươi chỉ sửa <tspan fill={A} fontWeight={900}>1 DÒNG CODE</tspan> → ngài nhìn 1 cái:</text>
          </g>
          <g style={usePop(T.THIENCO.ifs, 14)}>
            <Card x={W / 2 - 470} y={330} w={940} h={220} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={378} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu sau này hệ thống <tspan fill={GOLD} fontWeight={900}>100 TRIỆU user</tspan>?"</text>
            <text x={W / 2} y={420} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu mai này đổi Database?"</text>
            <text x={W / 2} y={462} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu Microservice tách riêng?"</text>
            <text x={W / 2} y={504} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu đội khác dùng lại đoạn code này?" 💀</text>
          </g>
          <Reveal y={566} top="ngươi vừa sửa 1 dòng code — hay đang viết:" big="🤣 GIA PHẢ CHO HẬU THẾ" entry={T.THIENCO.name} c={VIOLET} h={150} />
        </g>
        <Footer label="sửa 1 dòng · nghe như đang thiết kế cho 100 năm sau" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 NHANQUA ② ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="☯️ LOẠI ② · NHÂN QUẢ KIẾM TIÊN" color={GOLD} />
        <g transform="translate(0, 118)">
          <g style={usePop(T.NHANQUA.button, 13)}>
            <Card x={W / 2 - 470} y={242} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={290} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngươi thêm <tspan fill={A} fontWeight={900}>1 NÚT BẤM</tspan> → ngài hỏi:</text>
          </g>
          <g style={usePop(T.NHANQUA.ifs, 14)}>
            <Card x={W / 2 - 470} y={336} w={940} h={160} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={386} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu user bấm 2 lần? · lag? · retry? · timeout? · rollback?"</text>
            <text x={W / 2} y={438} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💬 "nếu PRODUCTION nổ lúc 3 GIỜ SÁNG?" 💀</text>
            <text x={W / 2} y={478} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>… hỏi đến đây thì tay đã run</text>
          </g>
          <Reveal y={520} top="đến câu cuối cùng, ngươi bắt đầu:" big="🤣 XIN LỖI TỔ TIÊN · vì đã viết dòng code ấy" entry={T.NHANQUA.name} c={VIOLET} h={160} />
        </g>
        <Footer label="mỗi nút bấm · kéo theo 6 câu 'nếu' nhân quả" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 TAMMA ③ ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="👴 LOẠI ③ · TÂM MA CỔ TU" color={RED} />
        <g transform="translate(0, 118)">
          <g style={usePop(T.TAMMA.notcode, 13)}>
            <Card x={W / 2 - 470} y={242} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={290} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngài không review CODE — ngài review… <tspan fill={RED} fontWeight={900}>NHÂN SINH</tspan> 🤣</text>
          </g>
          <g style={usePop(T.TAMMA.history, 14)}>
            <Card x={W / 2 - 470} y={336} w={940} h={190} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={382} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "hồi bản tọa viết Java…"</text>
            <text x={W / 2} y={424} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"chưa có Spring · chưa có Docker · chưa có AI"</text>
            <text x={W / 2} y={466} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"deploy bằng FTP" 💀</text>
            <text x={W / 2} y={506} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngươi chỉ hỏi: "anh thấy đoạn này sao?"</text>
          </g>
          <Reveal y={556} top="và rồi ngài kể:" big="🤣 30 NĂM LỊCH SỬ SOFTWARE GIỚI" entry={T.TAMMA.name} c={VIOLET} h={150} />
        </g>
        <Footer label="hỏi 1 câu code · nhận về 30 năm hồi ký" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 TICHTU ④ ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="📜 LOẠI ④ · TÍCH TỰ MA QUÂN" color={GOLD} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.TICHTU.pr, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={116} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={296} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Pull Request của ngươi: <tspan fill={A} fontWeight={900}>200 DÒNG</tspan></text>
            <text x={W / 2} y={338} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">comment của ngài: 3.000 CHỮ 💀</text>
          </g>
          <g style={usePop(T.TICHTU.forget, 13)}>
            <Card x={W / 2 - 470} y={382} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={430} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🤣 đọc đến giữa — ngươi <tspan fill={A} fontWeight={900}>QUÊN LUÔN</tspan> mình định sửa gì</text>
          </g>
          <Reveal y={476} top="đọc đến cuối, ngươi lĩnh ngộ thêm:" big="✨ 3 Design Pattern · 2 Clean Code · và 1 chút NHÂN SINH" entry={T.TICHTU.learn} c={VIOLET} h={170} />
        </g>
        <Footer label="PR 200 dòng · review 3.000 chữ · bonus triết học" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 BEQUAN ⑤ ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="🪨 LOẠI ⑤ · BẾ QUAN LÃO TỔ" />
        <g transform="translate(0, 120)">
          <g style={usePop(T.BEQUAN.wait, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={190} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={296} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngươi tạo Pull Request → 1 ngày… 3 ngày… <tspan fill={RED} fontWeight={900}>7 NGÀY</tspan> 💀</text>
            <text x={W / 2} y={344} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không một tia thần niệm</text>
            <text x={W / 2} y={382} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không một đạo comment</text>
            <text x={W / 2} y={420} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không một dấu LGTM 🤣</text>
          </g>
          <g style={usePop(T.BEQUAN.merge, 13)}>
            <Card x={W / 2 - 400} y={456} w={800} h={78} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={504} fontSize={30} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ đến lúc ngươi TỰ MERGE…</text>
          </g>
          <Say y={556} who="👴 ngài đột nhiên xuất hiện" whoC={RED} text="&quot;sao merge rồi?&quot; 💀🤣" entry={T.BEQUAN.appear} h={110} />
        </g>
        <Footer label="7 ngày im lặng · tự merge phát là hiện hồn ngay" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 NHATKIEM ⑥ ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="⚔️ LOẠI ⑥ · NHẤT KIẾM PHONG HẦU" color={RED} />
        <g transform="translate(0, 118)">
          <g style={usePop(T.NHATKIEM.swords, 13)}>
            <Card x={W / 2 - 470} y={242} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={290} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngài cả đời chỉ dùng <tspan fill={A} fontWeight={900}>5 THỨC KIẾM</tspan>:</text>
          </g>
          <g style={usePop(T.NHATKIEM.five, 14)}>
            <Card x={W / 2 - 470} y={336} w={940} h={200} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={388} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🗡 "Rename." · "Extract."</text>
            <text x={W / 2} y={434} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🗡 "Magic Number." · "Duplicate."</text>
            <text x={W / 2} y={490} fontSize={38} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)">🗡 "Why?" 💀</text>
          </g>
          <Reveal y={562} top="mỗi kiếm đều KHÔNG lấy mạng —" big="🤣 nhưng đủ khiến ĐẠO TÂM NGƯƠI RỈ MÁU" entry={T.NHATKIEM.bleed} c={VIOLET} h={150} />
        </g>
        <Footer label="5 chữ · không câu nào chửi · mà nhức nhối vô cùng" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 TRUYENDAO ⑦ ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="✨ LOẠI ⑦ · TRUYỀN ĐẠO CHÂN NHÂN" color={GREEN} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.TRUYENDAO.highest, 12)}>
            <Card x={W / 2 - 470} y={228} w={940} h={78} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={276} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cảnh giới <tspan fill={GREEN} fontWeight={900}>CAO NHẤT</tspan> — ngài không nói "đoạn này sai" 💀</text>
          </g>
          <g style={usePop(T.TRUYENDAO.suggest, 14)}>
            <Card x={W / 2 - 470} y={322} w={940} h={200} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={370} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu đổi cách này → sau dễ mở rộng hơn"</text>
            <text x={W / 2} y={414} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu tách hàm → lần sau người khác dễ hiểu hơn"</text>
            <text x={W / 2} y={458} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "nếu xử lý nhân quả ở đây →</text>
            <text x={W / 2} y={496} fontSize={25} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tránh được 1 trận production độ kiếp"</text>
          </g>
          <Reveal y={552} top="review xong → cả tông môn ít phải thức đêm:" big="🔥 CODE tốt hơn · NGƯƠI mạnh hơn" entry={T.TRUYENDAO.result} c={GREEN} h={160} />
        </g>
        <Footer label="không chê · chỉ dẫn đường · cả tông môn cùng mạnh" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 NGO ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGỘ RA" />
        <g transform="translate(0, 120)">
          <g style={usePop(T.NGO.comments, 13)}>
            <Card x={W / 2 - 470} y={260} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đệ tử trẻ mở Code Review → thấy <tspan fill={GOLD} fontWeight={900}>20 COMMENT</tspan></text>
            <text x={W / 2} y={344} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">💀 liền cảm thấy ĐẠO TÂM TAN VỠ</text>
          </g>
          <g style={usePop(T.NGO.realize, 13)}>
            <Card x={W / 2 - 470} y={386} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={434} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng sau nhiều năm — thứ <tspan fill={A} fontWeight={900}>ĐÁNG SỢ NHẤT</tspan> không phải bị review</text>
          </g>
          <Reveal y={480} top="mà là…" big="💀 KHÔNG CÒN AI MUỐN REVIEW NỮA" entry={T.NGO.noone} c={RED} h={150} />
        </g>
        <Footer label="bị review nhiều · vẫn hơn bị bỏ mặc không ai ngó" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 DAOLY ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GREEN} />
        <g transform="translate(0, 116)">
          <g style={usePop(T.DAOLY.each, 13)}>
            <Card x={W / 2 - 470} y={248} w={940} h={110} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={292} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi COMMENT = 1 lần đại năng nhìn thấy <tspan fill={A} fontWeight={900}>NHÂN QUẢ</tspan></text>
            <text x={W / 2} y={332} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ trước khi PRODUCTION nhìn thấy ✨</text>
          </g>
          <g style={usePop(T.DAOLY.trial, 13)}>
            <Card x={W / 2 - 470} y={374} w={940} h={78} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={422} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi dòng GÓP Ý = 1 trận thiên kiếp <tspan fill={GOLD} fontWeight={900}>bị chặn tại Sơn Môn</tspan></text>
          </g>
          <Reveal y={468} top='mỗi câu "sửa đoạn này đi" = 1 đêm…' big="🔥 KHÔNG phải thức dậy lúc 3 GIỜ SÁNG" entry={T.DAOLY.night} c={GREEN} h={160} />
        </g>
        <Footer label="1 comment hôm nay · đổi 1 đêm ngủ yên mai sau" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 VETSEO ============
const S11: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="VẾT SẸO" />
        <g transform="translate(0, 108)">
          <g style={usePop(T.VETSEO.meet, 12)}>
            <Card x={W / 2 - 470} y={228} w={940} h={78} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={276} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>gặp đồng môn review RẤT KỸ → <tspan fill={RED} fontWeight={900}>đừng vội sinh tâm ma</tspan></text>
          </g>
          <g style={usePop(T.VETSEO.help, 14)}>
            <Card x={W / 2 - 470} y={322} w={940} h={150} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={368} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>rất có thể hắn vừa dùng TU VI NHIỀU NĂM của mình</text>
            <text x={W / 2} y={410} fontSize={27} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>để giúp ngươi tránh một đoạn nhân quả ✨</text>
            <text x={W / 2} y={450} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà chính hắn ĐÃ TỪNG TỰ MÌNH ĐỘ QUA</text>
          </g>
          <g style={usePop(T.VETSEO.scar, 15)}>
            <Card x={W / 2 - 470} y={488} w={940} h={186} c={VIOLET} fill={CARD2} thick={3} />
            <text x={W / 2} y={534} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cảnh giới cao nhất — KHÔNG phải tìm lỗi</text>
            <text x={W / 2} y={584} fontSize={30} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)">mà là dùng VẾT SẸO của chính mình 🔥</text>
            <text x={W / 2} y={632} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>để người sau — KHÔNG PHẢI ĐỔ MÁU thêm lần nữa</text>
          </g>
        </g>
        <Footer label="review kỹ không phải làm khó · là chắn kiếp giùm ngươi" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(48, 14);
  const btn = usePop(84, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={600} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi từng gặp loại đạo hữu nào</text>
            <text x={W / 2} y={662} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crTextGlow)">trong 7 loại trên? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={792} fontSize={30} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#crTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi mở Pull Request tiếp theo" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const CodeReview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("code_review/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <SlideFade duration={b.duration}>
              <Slide duration={b.duration} />
            </SlideFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
