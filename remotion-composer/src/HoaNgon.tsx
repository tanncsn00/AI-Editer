import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./hn_beats.json";
import T from "./hn_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#08060E";
const HOA = "#A78BFF";
const NGON = "#F0B23C";
const TEXT = "#EDE8F5";
const SEC = "#9C93B0";
const MUTE = "#5F5876";
const RED = "#FF5470";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};
const E = T as Record<string, Record<string, number>>;

const fadeUp = (f: number, e: number, d = 12, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const }),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const }) + "px)",
});
const pop = (f: number, e: number, d = 14) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const }),
  transform: "scale(" + interpolate(f, [e, e + d * 0.6, e + d], [0.78, 1.06, 1], { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const }) + ")",
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.3) % 80;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(" + HOA + "0C 1px, transparent 1px), linear-gradient(90deg, " + HOA + "0C 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "0 " + drift + "px",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 780px 720px at 50% 26%, " + HOA + "1E 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 780px 720px at 50% 78%, " + NGON + "16 0%, transparent 62%)" }} />
    </AbsoluteFill>
  );
};

const Sigil: React.FC<{ side: "hoa" | "ngon"; e: number }> = ({ side, e }) => {
  const f = useCurrentFrame();
  const c = side === "hoa" ? HOA : NGON;
  const st = pop(f, e, 16);
  const spin = f * (side === "hoa" ? 0.28 : -0.28);
  return (
    <div style={{ ...st, position: "relative", width: 170, height: 170 }}>
      <svg width={170} height={170} viewBox="0 0 170 170" style={{ transform: "rotate(" + spin + "deg)" }}>
        <circle cx={85} cy={85} r={74} fill="none" stroke={c + "55"} strokeWidth={2} strokeDasharray="13 9" />
        <circle cx={85} cy={85} r={56} fill="none" stroke={c + "33"} strokeWidth={1.5} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>
        {side === "hoa" ? "🎨" : "✍️"}
      </div>
    </div>
  );
};

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.MODAU;
  const Card: React.FC<{ side: "hoa" | "ngon"; sig: number; nm: number; dao: string; who: string }> = ({ side, sig, nm, dao, who }) => {
    const c = side === "hoa" ? HOA : NGON;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Sigil side={side} e={sig} />
        <div style={{ ...fadeUp(f, sig + 4, 11, 12), fontFamily: "Be Vietnam Pro", fontSize: 38, fontWeight: 800, color: c }}>{dao}</div>
        <div style={{ ...pop(f, nm, 12), fontFamily: "JetBrains Mono", fontSize: 27, fontWeight: 700, color: TEXT, letterSpacing: 2, border: "2px solid " + c + "66", borderRadius: 12, padding: "8px 18px", background: c + "12" }}>
          {who}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44, padding: 60 }}>
      <div style={{ ...fadeUp(f, e.title, 14), textAlign: "center" }}>
        <div style={{ fontSize: 76, marginBottom: 14 }}>🏯</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 66, fontWeight: 900, color: TEXT, lineHeight: 1.14, letterSpacing: -2 }}>
          ĐẠI CHIẾN
          <br />
          <span style={{ color: HOA }}>HỌA TU</span> <span style={{ color: SEC, fontSize: 46 }}>vs</span> <span style={{ color: NGON }}>NGÔN TỪ TU</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 34, alignItems: "flex-start" }}>
        <Card side="hoa" sig={e.sigA} nm={e.nameA} dao="HỌA ĐẠO" who="DESIGNER" />
        <Card side="ngon" sig={e.sigB} nm={e.nameB} dao="NGÔN TỪ ĐẠO" who="CONTENT" />
      </div>
    </AbsoluteFill>
  );
};

const Clash: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.GIAOCHIEN;
  const gap = interpolate(f, [e.top + 10, e.big], [200, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [e.big - 6, e.big + 4, e.big + 24], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, padding: 70 }}>
      <div style={{ ...fadeUp(f, e.top), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 500, color: SEC, textAlign: "center", lineHeight: 1.34 }}>
        Người ngoài tưởng
        <br />
        họ là đồng minh.
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 230, width: "100%" }}>
        <div style={{ position: "absolute", transform: "translateX(-" + gap + "px)", fontSize: 92 }}>🎨</div>
        <div style={{ position: "absolute", transform: "translateX(" + gap + "px)", fontSize: 92 }}>✍️</div>
        <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #fff 0%, " + HOA + " 40%, transparent 70%)", opacity: flash }} />
      </div>
      <div style={{ ...pop(f, e.big, 14), fontFamily: "Be Vietnam Pro", fontSize: 74, fontWeight: 900, color: RED, textAlign: "center", lineHeight: 1.18, textShadow: "0 0 50px " + RED + "55" }}>
        GIAO CHIẾN
        <br />
        MỖI NGÀY.
      </div>
    </AbsoluteFill>
  );
};

const ChapterHead: React.FC<{ e: number; label: string }> = ({ e, label }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ ...pop(f, e, 13), fontSize: 58 }}>⚔️</div>
      <div style={{ ...fadeUp(f, e + 5), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color: TEXT, letterSpacing: 1, textAlign: "center", textShadow: "0 0 40px " + HOA + "44" }}>
        {label}
      </div>
      <div style={{ ...fadeUp(f, e + 10), width: 150, height: 3, background: "linear-gradient(90deg, transparent, " + HOA + ", transparent)", marginBottom: 8 }} />
    </>
  );
};

const Bubble: React.FC<{ e: number; side: "hoa" | "ngon"; text: string }> = ({ e, side, text }) => {
  const f = useCurrentFrame();
  const isHoa = side === "hoa";
  const c = isHoa ? HOA : NGON;
  return (
    <div
      style={{
        ...fadeUp(f, e, 12, 16),
        alignSelf: isHoa ? "flex-start" : "flex-end",
        maxWidth: "88%",
        background: c + "14",
        border: "2px solid " + c + "55",
        borderRadius: 22,
        borderBottomLeftRadius: isHoa ? 6 : 22,
        borderBottomRightRadius: isHoa ? 22 : 6,
        padding: "18px 26px",
      }}
    >
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 21, color: c, letterSpacing: 3, marginBottom: 7 }}>{isHoa ? "🎨 HỌA TU" : "✍️ NGÔN TỪ TU"}</div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 41, fontWeight: 600, color: TEXT, lineHeight: 1.28 }}>{text}</div>
    </div>
  );
};

const BigLine: React.FC<{ e: number; text: string; color: string; size?: number }> = ({ e, text, color, size = 76 }) => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f / 8);
  return (
    <div
      style={{
        ...pop(f, e, 15),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 900,
        color,
        textAlign: "center",
        lineHeight: 1.16,
        letterSpacing: -2,
        whiteSpace: "pre-line",
        textShadow: "0 0 " + (32 + glow * 38) + "px " + color + "77",
      }}
    >
      {text}
    </div>
  );
};

const K1A: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K1A;
  const n = Math.round(interpolate(f, [e.num, e.num + 20], [0, 42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22, padding: 66 }}>
      <ChapterHead e={e.dot} label={"KIẾP NẠN\n“ÍT CHỮ THÔI”"} />
      <div style={{ ...pop(f, e.num, 14), textAlign: "center", marginTop: 16 }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 150, fontWeight: 700, color: NGON, letterSpacing: -4, textShadow: "0 0 54px " + NGON + "66" }}>{n}</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 700, color: SEC, letterSpacing: 8 }}>DÒNG</div>
      </div>
    </AbsoluteFill>
  );
};

const K1B: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K1B;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 18, padding: 62 }}>
      <Bubble e={e.l0} side="hoa" text="Đây là ít chữ?" />
      <Bubble e={e.l1} side="ngon" text="Đó là toàn bộ thông điệp." />
      <Bubble e={e.l2} side="hoa" text="Ta chỉ có một cái banner." />
      <Bubble e={e.l3} side="ngon" text="Thu nhỏ font." />
      <div style={{ ...pop(f, e.bot, 14), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color: RED, textAlign: "center", marginTop: 12 }}>
        💀 Đạo tâm nứt một đường.
      </div>
    </AbsoluteFill>
  );
};

const K2A: React.FC = () => {
  const e = E.K2A;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 18, padding: 62 }}>
      <ChapterHead e={e.dot} label={"KIẾP NẠN\n“FONT CÓ CẢM XÚC”"} />
      <Bubble e={e.l0} side="ngon" text="Font này không có personality." />
      <Bubble e={e.l1} side="hoa" text="Font là chữ." />
      <Bubble e={e.l2} side="ngon" text="Ta muốn nó có cảm xúc." />
    </AbsoluteFill>
  );
};

const K2B: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K2B;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, padding: 70 }}>
      <div style={{ ...fadeUp(f, Math.max(0, e.big - 20)), fontSize: 74 }}>🎨</div>
      <BigLine e={e.big} text={"“Ngươi muốn ta thiết kế font\nhay NUÔI NÓ?”"} color={HOA} size={64} />
      <div style={{ ...pop(f, e.bot, 14), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 800, color: RED, textAlign: "center", marginTop: 8 }}>
        💀 Ngôn Từ Tu trực tiếp nghẹn đạo.
      </div>
    </AbsoluteFill>
  );
};

const K3A: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K3A;
  const rows: { e: number; ask: string }[] = [
    { e: e.l0, ask: "Thêm một câu." },
    { e: e.l1, ask: "Thu nhỏ font." },
    { e: e.l2, ask: "Bỏ khoảng trắng." },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 20, padding: 62 }}>
      <ChapterHead e={e.dot} label={"KIẾP NẠN\n“THÊM MỘT CÂU”"} />
      {rows.map((r, i) => (
        <div key={i} style={{ ...fadeUp(f, r.e, 11, 14), width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, background: "#120F1C", border: "2px solid #241F35", borderRadius: 18, padding: "18px 26px" }}>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 600, color: NGON }}>{r.ask}</div>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 900, color: RED }}>KHÔNG.</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const K3B: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K3B;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, padding: 70 }}>
      <div style={{ ...fadeUp(f, e.q), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 600, color: NGON, textAlign: "center" }}>“Vậy bỏ gì?”</div>
      <BigLine e={e.big} text={"⚔️ “BỎ CÂU CỦA NGƯƠI.”"} color={HOA} size={70} />
      <div style={{ ...pop(f, e.bot, 14), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 900, color: RED, textAlign: "center", marginTop: 8 }}>
        💥 Họa Đạo chính thức khai chiến.
      </div>
    </AbsoluteFill>
  );
};

const K4A: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K4A;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22, padding: 64 }}>
      <ChapterHead e={e.dot} label={"KIẾP NẠN\nKHÁCH HÀNG XUẤT QUAN"} />
      <div style={{ ...pop(f, e.l0, 13), fontSize: 64 }}>🧑‍💼</div>
      <div style={{ ...fadeUp(f, e.l0 + 4), fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 800, color: TEXT }}>“Đẹp.”</div>
      <div style={{ ...fadeUp(f, e.l1), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 600, color: SEC }}>“Nhưng…”</div>
      <BigLine e={e.big} text={"“CHƯA ĐỦ VIBE.”"} color={RED} size={72} />
    </AbsoluteFill>
  );
};

const K4B: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.K4B;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 24, padding: 66 }}>
      <div style={{ ...fadeUp(f, e.q), fontFamily: "Be Vietnam Pro", fontSize: 52, fontWeight: 700, color: HOA, textAlign: "center" }}>“Vibe gì?”</div>
      <div style={{ ...fadeUp(f, e.a), fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 800, color: TEXT, textAlign: "center" }}>“Ta cũng không biết.”</div>
      <div style={{ ...fadeUp(f, e.a + 18), display: "flex", gap: 26, marginTop: 10, fontSize: 66 }}>
        <span>🎨</span>
        <span>✍️</span>
      </div>
      <BigLine e={e.big} text={"⚡ KẺ THÙ CHUNG\nĐÃ XUẤT HIỆN."} color={NGON} size={62} />
    </AbsoluteFill>
  );
};

const Daoly: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.DAOLY;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26, padding: 70 }}>
      <div style={{ ...fadeUp(f, Math.max(0, e.top - 24)), fontFamily: "JetBrains Mono", fontSize: 28, color: MUTE, letterSpacing: 8 }}>🏯 ĐẠO LÝ</div>
      <div style={{ ...fadeUp(f, e.top), fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 600, color: TEXT, textAlign: "center", lineHeight: 1.34 }}>
        <span style={{ color: HOA }}>Họa Tu</span> muốn <span style={{ color: NGON }}>Content</span> viết ít.
        <br />
        <span style={{ color: NGON }}>Content</span> muốn <span style={{ color: HOA }}>Designer</span> để nhiều chỗ.
      </div>
      <div style={{ ...fadeUp(f, e.mid), fontFamily: "Be Vietnam Pro", fontSize: 42, color: SEC, textAlign: "center" }}>
        Hai bên tranh nhau cả đời…
        <br />
        cho tới khi khách hàng nói:
      </div>
      <BigLine e={e.big} text={"💀 “CHỈ SỬA MỘT CHÚT THÔI.”"} color={RED} size={58} />
    </AbsoluteFill>
  );
};

const Chot: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.CHOT;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, padding: 68 }}>
      <div style={{ ...fadeUp(f, e.top, 10, 14), display: "flex", gap: 24, fontSize: 76, alignItems: "center" }}>
        <span>🎨</span>
        <span style={{ fontSize: 46, color: SEC }}>+</span>
        <span>✍️</span>
      </div>
      <div style={{ ...fadeUp(f, e.top + 4), fontFamily: "Be Vietnam Pro", fontSize: 44, color: SEC }}>đồng thanh:</div>
      <BigLine e={e.big} text={"“LẠI ĐỔI\nYÊU CẦU NỮA À?”"} color={RED} size={84} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.CTA;
  const btn = pop(f, e.btn, 14);
  const pulse = 1 + Math.sin(f / 7) * 0.03;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ ...fadeUp(f, e.top), fontSize: 70 }}>🏯</div>
      <div style={{ ...fadeUp(f, e.top + 4), fontFamily: "Be Vietnam Pro", fontSize: 48, color: SEC, textAlign: "center" }}>Follow bần đạo…</div>
      <div
        style={{
          ...btn,
          transform: btn.transform + " scale(" + pulse + ")",
          padding: "22px 58px",
          borderRadius: 20,
          background: HOA,
          color: "#140C24",
          fontFamily: "Be Vietnam Pro",
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: 2,
          textAlign: "center",
          boxShadow: "0 0 66px " + HOA + "66",
        }}
      >
        ĐỘ KIẾP CÙNG BẦN ĐẠO
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22, opacity: interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ fontSize: 66 }}>🏯</div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, color: SEC, textAlign: "center" }}>Bạn là Họa Tu hay Ngôn Từ Tu?</div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, color: MUTE, letterSpacing: 5, marginTop: 6 }}>ĐỘ KIẾP CÙNG BẦN ĐẠO</div>
    </AbsoluteFill>
  );
};

export const HoaNgon: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const SEQ: [string, React.FC][] = [
    ["MODAU", Title],
    ["GIAOCHIEN", Clash],
    ["K1A", K1A],
    ["K1B", K1B],
    ["K2A", K2A],
    ["K2B", K2B],
    ["K3A", K3A],
    ["K3B", K3B],
    ["K4A", K4A],
    ["K4B", K4B],
    ["DAOLY", Daoly],
    ["CHOT", Chot],
    ["CTA", Cta],
    ["OUTRO", Outro],
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      <Audio src={staticFile("hoangon/voice.mp3")} />
      {bgm ? <Audio src={staticFile("hoangon/bgm.mp3")} volume={0.11} /> : null}
      {SEQ.map((entry) => {
        const { from, dur } = at(entry[0]);
        const C = entry[1];
        return (
          <Sequence key={entry[0]} from={from} durationInFrames={dur}>
            <C />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
