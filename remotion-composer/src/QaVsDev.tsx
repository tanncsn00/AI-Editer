import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./qvd_beats.json";
import T from "./qvd_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== DARK HUD · Developer(cyan) vs QA(green) · Production=thiên đạo(đỏ) =====
const BG = "#080B12";
const CARD = "#0E1622";
const CARD2 = "#111E2E";
const RED = "#FF5470";     // Production / thiên đạo / kiếp
const DEV = "#2BE2FF";     // Developer Tông
const QA = "#2EE6A8";      // QA Tông
const GOLD = "#FFC24B";    // reveal / đạo lý
const TEXT = "#E4EEF7";
const SEC = "#93AEC4";
const MUTE2 = "#54708C";
const HUDC = "#3E6C8C";

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

const HudBG: React.FC<{ tint?: string }> = ({ tint = DEV }) => {
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
          <pattern id="qdGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="qdGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="qdScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="qdVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#02040A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#qdGrid)" />
        <rect width={W} height={H} fill="url(#qdGlow)" />
        <g strokeWidth={1} opacity={0.14}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#qdScan)" />
        <rect width={W} height={H} fill="url(#qdVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={DEV} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={QA} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={DEV} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={QA} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="qdTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = DEV }) => {
  const frame = useCurrentFrame();
  const a1 = useFadeUp(0, 10), a2 = useFade(5, 10);
  const blink = Math.sin(frame / 9) > -0.3 ? 1 : 0.25;
  return (
    <g>
      <g style={a1}>
        <path d="M 80 114 L 80 150 L 100 150" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 108} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">WAR</text>
        <circle cx={W - 92} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE2} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE2} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = DEV, fill = CARD, thick = 2, rx = 10, children }) => {
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
const KiepBanner: React.FC<{ y: number; tag: string; name: string; c?: string; entry: number }> = ({ y, tag, name, c = RED, entry }) => {
  const a = usePop(entry, 14);
  const x = W / 2 - 470, w = 940, h = 120, b = 22;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 60}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={CARD2} fillOpacity={0.8} stroke={c} strokeWidth={1.5} strokeOpacity={0.45} />
      <g stroke={c} strokeWidth={3} fill="none" opacity={0.95} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      <text x={W / 2} y={y + 44} fontSize={19} fill={c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
      <text x={W / 2} y={y + 96} fontSize={44} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#qdTextGlow)">{name}</text>
      <line x1={W / 2 - 90} y1={y + 110} x2={W / 2 + 90} y2={y + 110} stroke={c} strokeWidth={2} opacity={0.7} />
    </g>
  );
};
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; big?: boolean }> = ({ y, who, whoC, text, entry, big }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={big ? 96 : 78} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + (big ? 68 : 58)} fontSize={big ? 33 : 28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = GOLD, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 52} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={37} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={DEV} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 175)">
            <text x={W / 2} y={330} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>ĐẠI CHIẾN NGÀN NĂM</text>
            <g style={useFadeUp(12, 12)}>
              <text x={W / 2 - 250} y={430} fontSize={58} fill={DEV} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#qdTextGlow)" opacity={0.9 + 0.1 * glow}>DEVELOPER</text>
              <text x={W / 2} y={430} fontSize={40} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>vs</text>
              <text x={W / 2 + 250} y={430} fontSize={62} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#qdTextGlow)" opacity={0.9 + 0.1 * glow}>QA</text>
            </g>
            <g style={usePop(T.HOOK.sects, 13)}>
              <Card x={W / 2 - 470} y={500} w={455} h={150} c={DEV} />
              <text x={W / 2 - 242} y={556} fontSize={38} fill={DEV} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚔️ DEVELOPER TÔNG</text>
              <text x={W / 2 - 242} y={606} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"nó không hỏng"</text>
              <Card x={W / 2 + 15} y={500} w={455} h={150} c={QA} />
              <text x={W / 2 + 242} y={556} fontSize={38} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🛡️ QA TÔNG</text>
              <text x={W / 2 + 242} y={606} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"nó hỏng"</text>
            </g>
            <g style={usePop(T.HOOK.notranh, 13)}>
              <Card x={W / 2 - 470} y={670} w={940} h={90} c={MUTE2} rx={9} thick={1.5} />
              <text x={W / 2} y={726} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✕ bí cảnh · ✕ linh mạch · ✕ truyền thừa</text>
            </g>
            <g style={usePop(T.HOOK.fight, 15)}>
              <Card x={W / 2 - 470} y={790} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={842} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ duy nhất bọn họ tranh…</text>
              <text x={W / 2} y={892} fontSize={46} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">AI ĐÚNG 💀</text>
            </g>
          </g>
          <Footer label="hai tông môn · chinh chiến vô số kỷ nguyên" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BUGPHU ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const pass = ["Build ✅", "Unit Test ✅", "Code Review ✅"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={DEV} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · BUG PHÙ" color={RED} />
          <g transform="translate(0, 120)">
            <text x={W / 2} y={252} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(T.BUGPHU.pass - 6, 10)}>Developer bế quan 3 ngày · viết công pháp hoàn mỹ:</text>
            <g>
              {pass.map((t, i) => (
                <g key={i} style={usePop(T.BUGPHU.pass + i * 6, 8)}>
                  <Card x={W / 2 - 470 + i * 316} y={280} w={296} h={66} c={DEV} rx={8} thick={1.5} />
                  <text x={W / 2 - 322 + i * 316} y={321} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <Say y={366} who="DEVELOPER" whoC={DEV} text="&quot;thiên hạ thái bình&quot; 😌" entry={T.BUGPHU.taibinh} />
            <g style={usePop(T.BUGPHU.bugphu, 13)}>
              <Card x={W / 2 - 470} y={470} w={940} h={92} c={QA} fill={CARD2} thick={2} />
              <text x={W / 2 - 448} y={500} fontSize={18} fill={QA} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">TRƯỞNG LÃO QA · 🪧 BUG PHÙ</text>
              <text x={W / 2} y={540} fontSize={34} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Bug." 💀</text>
            </g>
            <Say y={586} who="DEVELOPER" whoC={DEV} text="&quot;không thể nào, ta đã tự kiểm tra&quot;" entry={T.BUGPHU.notmine - 60 > 586 ? T.BUGPHU.notmine - 60 : (T.BUGPHU.bugphu + 40)} />
            <Say y={686} who="DEVELOPER (QA mở Video + Log tái hiện)" whoC={DEV} text="&quot;…máy ta không bị&quot; 😐" entry={T.BUGPHU.notmine} />
            <Reveal y={790} top="QA suýt bóp nát truyền âm phù… lần đầu Developer thi triển:" big="✨ KHÔNG REPRODUCE KẾT GIỚI" entry={T.BUGPHU.norepro} c={DEV} h={140} />
          </g>
          <Footer label="'máy ta không bị' · chiêu thức trấn phái của Developer" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 FEATURE ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const ev = ["Video", "Log", "Database", "Timestamp", "nhân chứng", "vật chứng"];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={QA} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · &quot;KHÔNG PHẢI BUG, LÀ FEATURE&quot;" color={QA} />
          <g transform="translate(0, 150)">
            <g style={usePop(T.FEATURE.evidence, 13)}>
              <text x={W / 2} y={286} fontSize={26} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🛡️ QA tế ra SCREEN RECORD ĐẠI PHÁP — chứng cứ đầy đủ:</text>
              {ev.map((t, i) => (
                <g key={i}>
                  <Card x={W / 2 - 470 + (i % 3) * 316} y={310 + Math.floor(i / 3) * 74} w={296} h={62} c={QA} rx={8} thick={1.5} />
                  <text x={W / 2 - 322 + (i % 3) * 316} y={348 + Math.floor(i / 3) * 74} fontSize={24} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📎 {t}</text>
                </g>
              ))}
            </g>
            <Say y={468} who="DEVELOPER (nhìn tất cả, gật đầu)" whoC={DEV} text="&quot;đúng là lỗi. Nhưng…&quot;" entry={T.FEATURE.itsbug} />
            <g style={usePop(T.FEATURE.feature, 15)}>
              <Card x={W / 2 - 470} y={566} w={940} h={100} c={RED} fill={CARD2} thick={2.5} />
              <text x={W / 2} y={628} fontSize={38} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">"không phải bug. Đó là FEATURE." 💀</text>
            </g>
            <Reveal y={700} top="ngay khoảnh khắc ấy…" big="đạo tâm QA · NỨT VẾT THỨ NHẤT 🤣" entry={T.FEATURE.crack} c={QA} h={140} />
          </g>
          <Footer label="'nó là feature' · phản đòn kinh điển của Developer" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 BUGSINHBUG ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={DEV} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · BUG SINH BUG" color={RED} />
        <g transform="translate(0, 165)">
          <g style={usePop(T.BUGSINHBUG.fix, 13)}>
            <Card x={W / 2 - 470} y={300} w={940} h={100} c={DEV} rx={10} thick={2} />
            <text x={W / 2} y={348} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Developer sửa: một dòng · hai dòng · ba dòng…</text>
            <text x={W / 2} y={386} fontSize={30} fill={DEV} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>10 phút sau — "xong" 🤣</text>
          </g>
          <g style={usePop(T.BUGSINHBUG.test, 14)}>
            <Card x={W / 2 - 470} y={420} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={472} fontSize={28} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>QA test lại: bug cũ biến mất ✅…</text>
            <text x={W / 2} y={522} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">…HAI BUG MỚI xuất hiện 💀💀</text>
          </g>
          <Reveal y={610} top="hai người cùng trầm mặc… Developer lĩnh ngộ:" big="🏯 BUG SINH BUG ĐẠI PHÁP" entry={T.BUGSINHBUG.reveal} c={GOLD} h={150} />
        </g>
        <Footer label="sửa 1 bug · đẻ 2 bug · luân hồi bất tận" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 KHONGAIBAM ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · &quot;KHÔNG AI BẤM NHƯ VẬY&quot;" color={RED} />
        <g transform="translate(0, 165)">
          <Say y={290} who="DEVELOPER" whoC={DEV} text="&quot;không ai bấm như vậy đâu&quot; 😏" entry={T.KHONGAIBAM.noone} />
          <g style={usePop(T.KHONGAIBAM.users, 13)}>
            <Card x={W / 2 - 470} y={396} w={940} h={130} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={446} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>[ 3 NGÀY SAU · Production đón thiên kiếp ]</text>
            <text x={W / 2} y={492} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 người bấm đúng vậy → rồi <tspan fill={RED} fontWeight={900}>10 VẠN người</tspan> 💀</text>
          </g>
          <g style={usePop(T.KHONGAIBAM.boom, 15)}>
            <Card x={W / 2 - 470} y={546} w={940} h={96} c={RED} fill={CARD2} thick={3} />
            <text x={W / 2} y={606} fontSize={40} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">💥 PRODUCTION NỔ TUNG</text>
          </g>
          <Reveal y={686} top="khoảnh khắc ấy…" big="thiên đạo đích thân đứng về phía QA 🤣" entry={T.KHONGAIBAM.side} c={QA} h={140} />
        </g>
        <Footer label="'không ai bấm như vậy' · lời nguyền tự ứng" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 HAIDONGTHOIGIAN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const toggle = [
    { who: "QA thao tác", r: "bug XUẤT HIỆN", c: QA },
    { who: "Developer thao tác", r: "bug BIẾN MẤT", c: DEV },
    { who: "QA lần nữa", r: "bug lại XUẤT HIỆN", c: QA },
    { who: "Developer lần nữa", r: "…vẫn không thấy gì", c: DEV },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={DEV} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="KIẾP · HAI DÒNG THỜI GIAN" color={RED} />
          <g transform="translate(0, 150)">
            <text x={W / 2} y={280} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade((T.HAIDONGTHOIGIAN.toggle as number[])[0] - 6, 10)}>hai người · đứng trước cùng một màn hình:</text>
            <g>
              {toggle.map((t, i) => (
                <g key={i} style={usePop((T.HAIDONGTHOIGIAN.toggle as number[])[i] ?? 0, 9)}>
                  <Card x={W / 2 - 470} y={310 + i * 84} w={940} h={70} c={t.c} rx={9} thick={2} />
                  <text x={W / 2 - 448} y={353 + i * 84} fontSize={24} fill={t.c} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{t.who}</text>
                  <text x={W / 2 + 448} y={353 + i * 84} fontSize={27} fill={TEXT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.r}</text>
                </g>
              ))}
            </g>
            <Reveal y={670} top="cùng nhìn một màn hình…" big="nhưng sống ở HAI DÒNG THỜI GIAN 🤣" entry={T.HAIDONGTHOIGIAN.reveal} c={GOLD} h={150} />
          </g>
          <Footer label="cùng một màn hình · hai thực tại song song" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 GITBLAME ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="KIẾP · GIT BLAME" color={RED} />
        <g transform="translate(0, 165)">
          <g style={usePop(T.GITBLAME.whodid, 13)}>
            <Card x={W / 2 - 470} y={300} w={940} h={130} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={350} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Production lại nổ · PM · CEO · Khách hàng xuất hiện</text>
            <text x={W / 2} y={400} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">toàn Tam Giới hỏi: "AI LÀM?" 💀</text>
          </g>
          <g style={usePop(T.GITBLAME.mirror, 14)}>
            <Card x={W / 2 - 470} y={450} w={940} h={90} c={GOLD} rx={10} thick={2} />
            <text x={W / 2} y={506} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Dev ⚔️ nhìn QA 🛡️ · cùng mở ✨ GIT BLAME KÍNH</text>
          </g>
          <Reveal y={560} top="sau vài hơi thở… một cái tên hiện ra:" big="chính là DEVELOPER — HAI NĂM TRƯỚC 🤣" entry={T.GITBLAME.name} c={RED} h={150} />
        </g>
        <Footer label="git blame · tấm gương chiếu ra chính mình" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 NGO ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const no = ["✕ \"máy em không bị\"", "✕ \"không reproduce\"", "✕ \"nó là feature\"", "✕ \"không ai bấm vậy\""];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="NGỘ ĐẠO" color={GOLD} />
          <g transform="translate(0, 120)">
            <g style={usePop(T.NGO.fear, 13)}>
              <Card x={W / 2 - 470} y={250} w={940} h={88} c={DEV} fill={CARD2} thick={2} />
              <text x={W / 2} y={302} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>kẻ đáng sợ nhất không phải QA — mà là <tspan fill={RED} fontWeight={900}>CHÍNH MÌNH 2 năm trước</tspan> 💀</text>
            </g>
            <g style={usePop(T.NGO.strong, 13)}>
              <Card x={W / 2 - 470} y={352} w={940} h={88} c={QA} fill={CARD2} thick={2} />
              <text x={W / 2} y={404} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>kẻ mạnh nhất không phải Log/Video — mà là <tspan fill={RED} fontWeight={900}>PRODUCTION THIÊN ĐẠO</tspan></text>
            </g>
            <text x={W / 2} y={492} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(T.NGO.nolist - 6, 10)}>trước mặt Production — không tồn tại:</text>
            <g>
              {no.map((t, i) => (
                <g key={i} style={usePop(T.NGO.nolist + i * 8, 8)}>
                  <Card x={W / 2 - 470 + (i % 2) * 480} y={520 + Math.floor(i / 2) * 74} w={450} h={60} c={MUTE2} rx={8} thick={1.5} />
                  <text x={W / 2 - 245 + (i % 2) * 480} y={558 + Math.floor(i / 2) * 74} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              ))}
            </g>
            <Reveal y={700} top="Production chỉ có đúng một câu:" big="&quot;NÓ HỎNG.&quot; 💀" entry={T.NGO.broke} c={RED} h={140} />
          </g>
          <Footer label="trước Production · mọi lý lẽ đều vô nghĩa" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 DAOLY ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GOLD} />
        <g transform="translate(0, 175)">
          <g style={usePop(T.DAOLY.notenemy, 13)}>
            <text x={W / 2} y={310} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>QA và Developer — từ đầu chưa từng là kẻ thù 🤝</text>
          </g>
          <g style={usePop((T.DAOLY.proofs as number[])[0] ?? 0, 12)}>
            <Card x={W / 2 - 470} y={350} w={455} h={130} c={QA} />
            <text x={W / 2 - 242} y={402} fontSize={26} fill={QA} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>QA · cả đời</text>
            <text x={W / 2 - 242} y={446} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"nó hỏng"</text>
          </g>
          <g style={usePop((T.DAOLY.proofs as number[])[1] ?? 0, 12)}>
            <Card x={W / 2 + 15} y={350} w={455} h={130} c={DEV} />
            <text x={W / 2 + 242} y={402} fontSize={26} fill={DEV} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Developer · cả đời</text>
            <text x={W / 2 + 242} y={446} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"nó không hỏng"</text>
          </g>
          <g style={usePop(T.DAOLY.punch, 15)}>
            <Card x={W / 2 - 480} y={520} w={960} h={180} c={RED} fill={CARD2} thick={3} />
            <text x={W / 2} y={576} fontSize={27} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn Production — chỉ dùng đúng 5 phút để chứng minh:</text>
            <text x={W / 2} y={638} fontSize={44} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#qdTextGlow)">CẢ HAI ĐỀU PHẢI TĂNG CA</text>
            <text x={W / 2} y={682} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🤣🤣🤣</text>
          </g>
        </g>
        <Footer label="kẻ phán xử cuối cùng · luôn là Production" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(56, 14);
  const btn = usePop(96, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={DEV} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={590} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi là đệ tử <tspan fill={DEV}>DEVELOPER</tspan> hay <tspan fill={QA}>QA</tspan>?</text>
            <text x={W / 2} y={654} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">hay chính là PRODUCTION — kẻ phán xử tất cả? 💀</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={802} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={880} width={620} height={146} rx={20} fill={DEV} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={892} width={584} height={122} rx={14} fill={CARD2} stroke={DEV} strokeWidth={3} />
              <text x={W / 2} y={972} fontSize={48} fill={DEV} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#qdTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1100} fontSize={28} fill={MUTE2} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(132, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi Production nổ lần nữa" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const QaVsDev: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("qa_vs_dev/voice.mp3")} />
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
