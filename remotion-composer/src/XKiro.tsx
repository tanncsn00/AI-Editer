import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./xk_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const BG = "#05090A";
const PANEL = "#0C1412";
const PANEL2 = "#101C18";
const GREEN = "#22C55E";
const GREEN_DIM = "#15803D";
const GOLD = "#F0B23C";
const RED = "#FF4D5E";
const TEXT = "#E8F2EC";
const SEC = "#8FA79A";
const MUTE = "#4E635A";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};

const useFadeUp = (e: number, d = 13, dy = 30) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [dy, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(f, [e, e + d * 0.65, e + d], [0.74, 1.07, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${s})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.35) % 90;
  const pulse = 0.5 + 0.5 * Math.sin(f / 44);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${GREEN}0E 1px, transparent 1px), linear-gradient(90deg, ${GREEN}0E 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${drift}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 1100px at 50% 34%, ${GREEN}${pulse > 0.5 ? "1C" : "14"} 0%, transparent 62%)`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 1200px 900px at 50% 100%, #00000088 0%, transparent 60%)` }} />
    </AbsoluteFill>
  );
};

const Wrap: React.FC<{ children: React.ReactNode; pad?: number }> = ({ children, pad = 84 }) => (
  <AbsoluteFill style={{ padding: pad, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>{children}</AbsoluteFill>
);

const Kicker: React.FC<{ e: number; text: string; color?: string }> = ({ e, text, color = GREEN }) => {
  const st = useFadeUp(e, 12, 18);
  return (
    <div style={{ ...st, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 58, height: 4, background: color, borderRadius: 2 }} />
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, fontWeight: 700, color, letterSpacing: 5 }}>{text}</div>
    </div>
  );
};

const Line: React.FC<{ e: number; children: React.ReactNode; size?: number; weight?: number; color?: string; lh?: number }> = ({
  e,
  children,
  size = 60,
  weight = 700,
  color = TEXT,
  lh = 1.25,
}) => {
  const st = useFadeUp(e);
  return (
    <div style={{ ...st, fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: lh, letterSpacing: -0.5 }}>{children}</div>
  );
};

const BigWord: React.FC<{ e: number; text: string; color?: string; size?: number }> = ({ e, text, color = GREEN, size = 128 }) => {
  const st = usePop(e, 15);
  const f = useCurrentFrame();
  const glow = 0.55 + 0.45 * Math.sin((f - e) / 9);
  return (
    <div
      style={{
        ...st,
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 900,
        color,
        lineHeight: 1.02,
        letterSpacing: -3,
        textShadow: `0 0 ${28 + glow * 34}px ${color}88, 0 0 ${70 + glow * 60}px ${color}44`,
      }}
    >
      {text}
    </div>
  );
};

const Chip: React.FC<{ e: number; text: string; color?: string; mono?: boolean }> = ({ e, text, color = GREEN, mono }) => {
  const st = usePop(e, 12);
  return (
    <div
      style={{
        ...st,
        display: "inline-flex",
        alignItems: "center",
        padding: "16px 30px",
        borderRadius: 16,
        background: `${color}18`,
        border: `2px solid ${color}66`,
        fontFamily: mono ? "JetBrains Mono" : "Be Vietnam Pro",
        fontSize: 38,
        fontWeight: 700,
        color,
      }}
    >
      {text}
    </div>
  );
};

const Gate: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  const op = useFade(e, 20);
  const rise = interpolate(f, [e, e + 46], [46, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sway = Math.sin(f / 52) * 5;
  return (
    <div style={{ opacity: op * 0.5, transform: `translateY(${rise + sway}px)`, display: "flex", justifyContent: "center" }}>
      <svg width={620} height={340} viewBox="0 0 620 340">
        <g stroke={GREEN} strokeWidth={3} fill="none" opacity={0.85}>
          <path d="M40 300 L40 130 M580 300 L580 130" />
          <path d="M10 130 L610 130" strokeWidth={5} />
          <path d="M60 130 L310 46 L560 130" />
          <path d="M150 300 L150 160 M470 300 L470 160" opacity={0.5} />
          <path d="M310 300 L310 130" opacity={0.35} strokeDasharray="10 12" />
        </g>
        <circle cx={310} cy={92} r={13} fill={GREEN} opacity={0.9} />
      </svg>
    </div>
  );
};

const PROVIDERS = [
  { f: "Claude_ai.svg", n: "Claude" },
  { f: "OpenAI_dark.svg", n: "GPT" },
  { f: "gemini.svg", n: "Gemini" },
  { f: "deepseek.svg", n: "DeepSeek" },
  { f: "glm_logo.png", n: "GLM" },
  { f: "Grok_dark.svg", n: "Grok" },
  { f: "Qwen-Ai-Logo.png", n: "Qwen" },
  { f: "Ollama_dark.svg", n: "Ollama" },
];

const ProviderOrbit: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: 640, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {PROVIDERS.map((p, i) => {
        const enter = e + 6 + i * 7;
        const op = interpolate(f, [enter, enter + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pull = interpolate(f, [enter + 14, enter + 54], [1.25, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const a = (i / PROVIDERS.length) * Math.PI * 2 - Math.PI / 2 + f / 320;
        const R = 262 * pull;
        const x = Math.cos(a) * R;
        const y = Math.sin(a) * R * 0.9;
        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              opacity: op,
              transform: `translate(${x}px, ${y}px)`,
              width: 108,
              height: 108,
              borderRadius: 26,
              background: PANEL2,
              border: `2px solid ${GREEN}3A`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 34px ${GREEN}22`,
            }}
          >
            <Img src={staticFile(`xkiro/${p.f}`)} style={{ width: 64, height: 64, objectFit: "contain" }} />
          </div>
        );
      })}
      <div style={{ ...usePop(e + 58, 16), position: "absolute", zIndex: 5 }}>
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: 46,
            background: PANEL,
            border: `3px solid ${GREEN}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 78px ${GREEN}66, inset 0 0 44px ${GREEN}18`,
          }}
        >
          <Img src={staticFile("xkiro/logo-xKiro-green.png")} style={{ width: 126, height: 126, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ e: number }> = ({ e }) => {
  const st = useFadeUp(e, 14, 26);
  const swap = useFade(e + 30, 14);
  return (
    <div
      style={{
        ...st,
        background: "#080E0C",
        border: `2px solid ${GREEN}33`,
        borderRadius: 22,
        padding: "34px 38px",
        fontFamily: "JetBrains Mono",
        fontSize: 33,
        lineHeight: 1.72,
      }}
    >
      <div style={{ color: MUTE }}>client = OpenAI(</div>
      <div style={{ color: SEC, paddingLeft: 40 }}>api_key=<span style={{ color: GOLD }}>"..."</span>,</div>
      <div style={{ paddingLeft: 40 }}>
        <span style={{ color: SEC }}>base_url=</span>
        {swap < 0.5 ? (
          <span style={{ color: RED, textDecoration: "line-through" }}>"api.openai.com"</span>
        ) : (
          <span style={{ color: GREEN, fontWeight: 700, textShadow: `0 0 22px ${GREEN}77` }}>"xkiro.ai/v1"</span>
        )}
      </div>
      <div style={{ color: MUTE }}>)</div>
    </div>
  );
};

const FailoverRow: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  const dead = useFade(e, 12);
  const shake = Math.sin((f - e) / 2.2) * (interpolate(f, [e + 6, e + 30], [7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const arrow = useFade(e + 26, 12);
  const alive = usePop(e + 36, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div
        style={{
          opacity: dead,
          transform: `translateX(${shake}px)`,
          width: 200,
          height: 200,
          borderRadius: 34,
          background: `${RED}14`,
          border: `3px solid ${RED}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Img src={staticFile("xkiro/Claude_ai.svg")} style={{ width: 66, height: 66, opacity: 0.4 }} />
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, fontWeight: 700, color: RED }}>DOWN</div>
      </div>
      <div style={{ opacity: arrow, fontSize: 74, color: GREEN, fontWeight: 900 }}>→</div>
      <div
        style={{
          ...alive,
          width: 200,
          height: 200,
          borderRadius: 34,
          background: `${GREEN}14`,
          border: `3px solid ${GREEN}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: `0 0 54px ${GREEN}55`,
        }}
      >
        <Img src={staticFile("xkiro/gemini.svg")} style={{ width: 66, height: 66 }} />
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, fontWeight: 700, color: GREEN }}>LIVE</div>
      </div>
    </div>
  );
};

const TokenCounter: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  const st = usePop(e, 16);
  const v = Math.round(interpolate(f, [e + 8, e + 54], [0, 5_000_000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const glow = 0.5 + 0.5 * Math.sin(f / 8);
  return (
    <div style={{ ...st, textAlign: "center" }}>
      <div
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 128,
          fontWeight: 700,
          color: GREEN,
          letterSpacing: -4,
          textShadow: `0 0 ${34 + glow * 40}px ${GREEN}77`,
        }}
      >
        {v.toLocaleString("en-US")}
      </div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 42, fontWeight: 700, color: SEC, letterSpacing: 8, marginTop: 6 }}>TOKEN / NGÀY</div>
    </div>
  );
};

const Footer: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 62,
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.45,
    }}
  >
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 25, color: SEC, letterSpacing: 3 }}>ĐỘ KIẾP CÙNG GIỚI IT</div>
  </div>
);

const Hook: React.FC = () => (
  <Wrap>
    <Gate e={0} />
    <Kicker e={6} text="THIÊN CƠ CÁC" />
    <Line e={14} size={64}>
      Có một <span style={{ color: GREEN }}>Thiên Cơ Các</span>...
    </Line>
    <Line e={62} size={50} weight={600} color={SEC}>
      cho ngươi triệu hồi <span style={{ color: GOLD, fontWeight: 800 }}>FREE</span> hơn <span style={{ color: TEXT, fontWeight: 800 }}>20 vị đại năng AI</span>
    </Line>
    <div style={{ ...useFadeUp(122), display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Chip e={122} text="5 TRIỆU TOKEN / NGÀY" color={GOLD} />
    </div>
    <Line e={186} size={46} weight={500} color={MUTE}>
      làm Đạo Nguyên để tu luyện.
    </Line>
    <BigWord e={252} text="Nghe như TÀ ĐẠO." color={RED} size={82} />
  </Wrap>
);

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const logoSt = usePop(64, 20);
  const ring = interpolate(f, [64, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Wrap>
      <Line e={0} size={54} weight={600} color={SEC}>
        Nhưng điều đáng sợ là...
      </Line>
      <BigWord e={26} text="tà đạo này CÓ THẬT." color={TEXT} size={76} />
      <div style={{ height: 30 }} />
      <div style={{ ...logoSt, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: 420 * (0.6 + ring * 0.7),
            height: 420 * (0.6 + ring * 0.7),
            borderRadius: "50%",
            border: `2px solid ${GREEN}`,
            opacity: (1 - ring) * 0.6,
          }}
        />
        <Img src={staticFile("xkiro/logo-xKiro-green.png")} style={{ width: 250, height: 250, filter: `drop-shadow(0 0 60px ${GREEN}99)` }} />
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 108, fontWeight: 900, color: GREEN, letterSpacing: -3 }}>xKiro</div>
      </div>
    </Wrap>
  );
};

const MotDao: React.FC = () => (
  <Wrap pad={70}>
    <Kicker e={0} text="MỘT ĐẠO API" />
    <Line e={10} size={58}>
      Chỉ <span style={{ color: GREEN }}>MỘT</span> đạo API...
    </Line>
    <ProviderOrbit e={34} />
    <Line e={200} size={46} weight={600} color={SEC}>
      hơn <span style={{ color: GOLD, fontWeight: 800 }}>20 vị đại năng AI</span> — trong cùng một cửa.
    </Line>
  </Wrap>
);

const KhongCan: React.FC = () => (
  <Wrap>
    <div style={{ ...useFadeUp(4), display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ fontSize: 62, color: RED }}>✕</div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 56, fontWeight: 700, color: TEXT }}>
        Không cần mỗi vị một <span style={{ color: GOLD }}>API Key</span>.
      </div>
    </div>
    <div style={{ ...useFadeUp(62), display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ fontSize: 62, color: RED }}>✕</div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 56, fontWeight: 700, color: TEXT }}>Không cần bái nhập từng tông môn.</div>
    </div>
  </Wrap>
);

const TauHoa: React.FC = () => (
  <Wrap>
    <Line e={0} size={52} weight={600} color={SEC}>
      Thậm chí...
    </Line>
    <BigWord e={18} text="một vị đại năng TẨU HỎA NHẬP MA" color={RED} size={62} />
    <div style={{ height: 20 }} />
    <FailoverRow e={56} />
    <Line e={126} size={50} weight={600} color={GREEN}>
      Thiên Cơ Các tìm <span style={{ fontWeight: 900 }}>đường lui</span> cho ngươi.
    </Line>
  </Wrap>
);

const BaseUrl: React.FC = () => (
  <Wrap>
    <Kicker e={0} text="NHẬP MÔN" />
    <Line e={8} size={56}>
      Đang tu <span style={{ color: GOLD }}>OpenAI SDK</span>?
    </Line>
    <Line e={54} size={46} weight={600} color={SEC}>
      Không cần đổi cả bộ công pháp.
    </Line>
    <CodeBlock e={104} />
    <Line e={186} size={50} weight={700} color={GREEN}>
      Chỉ cần đổi <span style={{ fontFamily: "JetBrains Mono" }}>base_url</span> — là nhập môn.
    </Line>
  </Wrap>
);

const NhanRa: React.FC = () => (
  <Wrap>
    <Line e={0} size={48} weight={600} color={SEC}>
      Nhưng khi bần đạo nhìn thấy
    </Line>
    <BigWord e={20} text="KHO ĐẠO NGUYÊN" color={GOLD} size={82} />
    <TokenCounter e={44} />
    <Line e={112} size={46} weight={600} color={SEC}>
      bần đạo bắt đầu hiểu. Thiên Cơ Các này...
    </Line>
    <BigWord e={150} text="KHÔNG TU ĐẠO." color={TEXT} size={78} />
  </Wrap>
);

const PhatTaiNguyen: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <Wrap>
      <div style={{ ...useFadeUp(0, 8, 20), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ fontSize: 92 }}>🏯</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 600, color: SEC }}>Nó đang</div>
        <div
          style={{
            ...usePop(10, 12),
            fontFamily: "Be Vietnam Pro",
            fontSize: 106,
            fontWeight: 900,
            color: GREEN,
            letterSpacing: -3,
            textAlign: "center",
            lineHeight: 1.05,
            textShadow: `0 0 ${34 + glow * 44}px ${GREEN}99, 0 0 ${88 + glow * 50}px ${GREEN}44`,
          }}
        >
          PHÁT TÀI NGUYÊN
        </div>
      </div>
    </Wrap>
  );
};

const Chot: React.FC = () => (
  <Wrap>
    <div style={{ ...useFadeUp(0), display: "flex", alignItems: "center", gap: 18, marginBottom: 8 }}>
      <Img src={staticFile("xkiro/144.png")} style={{ width: 64, height: 64, borderRadius: 14 }} />
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 800, color: GREEN, letterSpacing: 2 }}>xKiro</div>
    </div>
    {[
      { t: "Một đạo API.", e: 14 },
      { t: "Hơn 20 vị đại năng.", e: 52 },
      { t: "5 TRIỆU Đạo Nguyên mỗi ngày.", e: 92 },
    ].map((r) => (
      <div
        key={r.t}
        style={{
          ...useFadeUp(r.e),
          background: PANEL,
          border: `2px solid ${GREEN}2E`,
          borderLeft: `7px solid ${GREEN}`,
          borderRadius: 18,
          padding: "28px 34px",
          fontFamily: "Be Vietnam Pro",
          fontSize: 52,
          fontWeight: 700,
          color: TEXT,
        }}
      >
        {r.t}
      </div>
    ))}
  </Wrap>
);

const CanhBao: React.FC = () => {
  const f = useCurrentFrame();
  const drain = interpolate(f, [120, 200], [1, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Wrap>
      <Kicker e={0} text="CẢNH BÁO" color={RED} />
      <Line e={10} size={52} weight={600} color={SEC}>
        Đạo hữu nào còn nuôi <span style={{ color: TEXT, fontWeight: 800 }}>từng con AI một gói</span>...
      </Line>
      <BigWord e={72} text="xin hãy COI CHỪNG." color={RED} size={72} />
      <div style={{ height: 16 }} />
      <div style={{ ...useFadeUp(118), display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 42, fontWeight: 600, color: MUTE }}>Linh thạch chưa kịp phi thăng...</div>
        <div style={{ height: 30, background: "#0D1512", borderRadius: 15, overflow: "hidden", border: `2px solid ${RED}44` }}>
          <div style={{ height: "100%", width: `${drain * 100}%`, background: `linear-gradient(90deg, ${RED}, ${GOLD})`, borderRadius: 15 }} />
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 52, fontWeight: 800, color: RED }}>đã bị Thiên Đạo TRỪ SẠCH.</div>
      </div>
    </Wrap>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const btn = usePop(40, 16);
  const pulse = 1 + Math.sin(f / 7) * 0.028;
  return (
    <Wrap>
      <div style={{ ...useFadeUp(0), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ fontSize: 118 }}>🏯</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 52, fontWeight: 600, color: SEC, textAlign: "center" }}>
          Follow bần đạo... để mỗi ngày
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 74, fontWeight: 900, color: GREEN, textAlign: "center", letterSpacing: -1 }}>
          ĐỘ KIẾP CÙNG GIỚI IT
        </div>
        <div
          style={{
            ...btn,
            transform: `${btn.transform} scale(${pulse})`,
            marginTop: 18,
            padding: "26px 74px",
            borderRadius: 20,
            background: GREEN,
            color: "#04140B",
            fontFamily: "Be Vietnam Pro",
            fontSize: 50,
            fontWeight: 900,
            letterSpacing: 3,
            boxShadow: `0 0 70px ${GREEN}77`,
          }}
        >
          FOLLOW
        </div>
      </div>
    </Wrap>
  );
};

export const XKiro: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const SEQ: [string, React.FC][] = [
    ["HOOK", Hook],
    ["REVEAL", Reveal],
    ["MOTDAO", MotDao],
    ["KHONGCAN", KhongCan],
    ["TAUHOA", TauHoa],
    ["BASEURL", BaseUrl],
    ["NHANRA", NhanRa],
    ["PHATTN", PhatTaiNguyen],
    ["CHOT", Chot],
    ["CANHBAO", CanhBao],
    ["CTA", Cta],
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      <Audio src={staticFile("xkiro/voice.mp3")} />
      {bgm ? <Audio src={staticFile("xkiro/bgm.mp3")} volume={0.14} /> : null}
      {SEQ.map(([name, C]) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <C />
          </Sequence>
        );
      })}
      <Footer />
    </AbsoluteFill>
  );
};
