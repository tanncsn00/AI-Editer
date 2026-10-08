import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./clcsg_beats.json";
import T from "./clcsg_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const SEC = "#A79FB8";
const MUTE = "#6E6780";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};
const E = T as Record<string, Record<string, number>>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeUp = (f: number, e: number, d = 7, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
const pop = (f: number, e: number, d = 8) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.6, e + d], [0.8, 1.05, 1], clamp) + ")",
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.22) % 120;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(90deg, " + GOLD + "0A 2px, transparent 2px)",
          backgroundSize: "120px 100%",
          backgroundPosition: drift + "px 0",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 22%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 82%, " + RED + "12 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 90px " + BG }} />
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <AbsoluteFill style={{ padding: "0 74px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

const Line: React.FC<{ e: number; size?: number; color?: string; weight?: number; children: React.ReactNode }> = ({ e, size = 46, color = SEC, weight = 500, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>
  );
};

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 78, color = RED, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 8), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>{children}</div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 58, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 9),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 1.22,
        letterSpacing: -0.5,
        whiteSpace: "pre-line",
        border: "2px solid " + color + "59",
        background: color + "12",
        borderRadius: 22,
        padding: "26px 34px",
      }}
    >
      {children}
    </div>
  );
};

const Skull: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 7), fontSize: 76 }}>💀</div>;
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 62, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 8), fontSize: size }}>{children}</div>;
};

const Tag: React.FC<{ e: number; children: React.ReactNode }> = ({ e, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fadeUp(f, e), display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 40 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, fontWeight: 700, color: GOLD, letterSpacing: 5 }}>{children}</div>
      </div>
      <div style={{ width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
    </div>
  );
};

type El = {
  k: "l" | "big" | "skull" | "icon" | "quote" | "tag";
  key?: string;
  t?: string;
  size?: number;
  color?: string;
  weight?: number;
};

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const sk = (key: string): El => ({ k: "skull", key });
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const tag = (t: string): El => ({ k: "tag", t });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  TITLE: {
    gap: 22,
    els: [ic("icon", "📜", 74), ln("l0", "NHỮNG CHÂN LÝ TRONG", 50, TEXT, 700), bg("big", "CÔNG SỞ GIỚI", 104, GOLD), ln("l1", "AI CŨNG CẦN BIẾT", 46)],
  },
  HOOK_SO: {
    gap: 24,
    els: [ln("l0", "Và điều đáng sợ nhất…", 48, TEXT), bg("big", "LÀ KHÔNG MỘT\nCÂU NÀO SAI.", 84, RED), sk("skull")],
  },

  L_DIRIENG: { gap: 26, els: [tag("CHÂN LÝ #1"), ln("l0", "Muốn đi riêng…", 54, TEXT, 700), bg("big", "THÌ ĐI MỘT MÌNH.", 84, RED)] },
  L_DICHUNG: { gap: 26, els: [tag("CHÂN LÝ #2"), ln("l0", "Muốn đi chung…", 54, TEXT, 700), bg("big", "THÌ ĐỪNG ĐI RIÊNG.", 80, RED)] },
  L_DEADLINE: { gap: 26, els: [tag("CHÂN LÝ #3"), ln("l0", "Muốn không trễ deadline…", 52, TEXT, 700), bg("big", "THÌ ĐỪNG ĐẶT\nDEADLINE.", 84, RED)] },
  L_TRUOCHAN: {
    gap: 26,
    els: [tag("CHÂN LÝ #4"), ln("l0", "Người hoàn thành công việc\ntrước hạn…", 50, TEXT, 700), bg("big", "LÀ NGƯỜI\nCHƯA ĐẾN HẠN.", 80, RED)],
  },
  L_BANNHAT: {
    gap: 26,
    els: [tag("CHÂN LÝ #5"), ln("l0", "Người bận nhất Công Sở Giới…", 50, TEXT, 700), bg("big", "THƯỜNG LÀ NGƯỜI\nCÓ NHIỀU VIỆC NHẤT.", 66, RED)],
  },
  L_GIAOTHEM: {
    gap: 26,
    els: [tag("CHÂN LÝ #6"), ln("l0", "Muốn không bị giao thêm việc…", 50, TEXT, 700), bg("big", "THÌ ĐỪNG ĐỂ NGƯỜI KHÁC BIẾT\nMÌNH ĐÃ XONG VIỆC.", 54, RED)],
  },
  L_XONGCHUA: { gap: 30, els: [tag("CHÂN LÝ #7"), ln("l0", "Muốn không bị hỏi:", 52, TEXT, 700), qt("q", "“Xong chưa em?”", 76, GOLD)] },
  L_XONGTRUOC: { gap: 26, els: [tag("CHÂN LÝ #7"), ln("l0", "…thì hãy", 52, TEXT, 700), bg("big", "XONG TRƯỚC KHI\nTRƯỞNG LÃO HỎI.", 72, JADE)] },
  L_CHUYENGIA: {
    gap: 24,
    els: [
      tag("CHÂN LÝ #8"),
      ln("l0", "Các chuyên gia quản lý thời gian\nđều đồng ý rằng…", 46, TEXT),
      ln("l1", "người đến muộn…", 50, TEXT, 700),
      ln("l2", "thường có một điểm chung.", 50, GOLD, 700),
    ],
  },
  L_DUNGGIO: { gap: 24, els: [tag("CHÂN LÝ #8"), ln("l0", "Đó là…", 52, TEXT, 700), bg("big", "HỌ KHÔNG ĐẾN\nĐÚNG GIỜ.", 84, RED), sk("skull")] },
  L_CUNGVAY: { gap: 26, els: [tag("CHÂN LÝ #9"), ln("l0", "Trong công việc cũng vậy.", 56, TEXT, 700)] },
  L_LAMNGAY: {
    gap: 26,
    els: [tag("CHÂN LÝ #9"), ln("l0", "Nếu một việc cần làm ngay…", 50, TEXT, 700), bg("big", "THÌ NÓ KHÔNG CÒN LÀ VIỆC\nCÓ THỂ LÀM SAU.", 56, RED)],
  },
  L_BATDAU: {
    gap: 26,
    els: [tag("CHÂN LÝ #10"), ln("l0", "Nếu ngươi chưa bắt đầu…", 52, TEXT, 700), bg("big", "THÌ RÕ RÀNG NGƯƠI\nCHƯA THỂ HOÀN THÀNH.", 60, RED)],
  },
  L_HOANTHANH: {
    gap: 26,
    els: [tag("CHÂN LÝ #11"), ln("l0", "Và nếu công việc đã hoàn thành…", 48, TEXT, 700), bg("big", "THÌ KHÔNG CẦN TIẾP TỤC\nHOÀN THÀNH NÓ.", 60, RED)],
  },

  DAIDAO: { gap: 24, els: [ln("l0", "Đây chính là…", 50), ic("icon", "🏯", 84), bg("big", "ĐẠI ĐẠO\nCÔNG SỞ.", 110, GOLD)] },
  VODUNG: {
    gap: 24,
    els: [ln("l0", "Nghe thì vô dụng.", 54, TEXT, 700), ln("l1", "Nhưng kỳ lạ thay…", 48), bg("big", "KHÔNG AI CÓ THỂ\nPHẢN BÁC.", 76, JADE)],
  },
  KET_THANHCONG: {
    gap: 26,
    els: [ln("l0", "Bởi vì trong Công Sở Giới…", 48), ln("l1", "chân lý không nhất thiết\nphải giúp ngươi thành công.", 54, TEXT, 700)],
  },
  KET_DUNG: { gap: 26, els: [ln("l0", "Nó chỉ cần…", 54, TEXT, 700), bg("big", "ĐÚNG.", 190, JADE)] },
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const spec = SCENES[name];
  const ec = E[name] ?? {};
  return (
    <Stage gap={spec.gap}>
      {spec.els.map((el, i) => {
        if (el.k === "tag") return <Tag key={i} e={0}>{el.t}</Tag>;
        const e = Math.max(0, ec[el.key!] ?? 0);
        if (el.k === "skull") return <Skull key={i} e={e} />;
        if (el.k === "quote") return <Quote key={i} e={e} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "icon") return <Icon key={i} e={e} size={el.size}>{el.t}</Icon>;
        if (el.k === "big") return <Big key={i} e={e} size={el.size} color={el.color}>{el.t}</Big>;
        return <Line key={i} e={e} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
      })}
    </Stage>
  );
};

const Cta: React.FC = () => {
  const e = E.CTA;
  const f = useCurrentFrame();
  return (
    <Stage gap={26}>
      <div
        style={{
          ...pop(f, e.btn, 9),
          fontFamily: "Be Vietnam Pro",
          fontSize: 50,
          fontWeight: 900,
          color: BG,
          background: GOLD,
          borderRadius: 999,
          padding: "24px 56px",
          letterSpacing: 1,
        }}
      >
        ▶ THEO DÕI
      </div>
      <Line e={e.l0} size={46}>để nghe thêm</Line>
      <Big e={e.big} size={64} color={GOLD}>{"CHÂN LÝ\nCHỐN CÔNG SỞ"}</Big>
    </Stage>
  );
};

export const ChanLyCongSoGioi: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("clcsg/voice.mp3")} />
    {bgm ? <Audio src={staticFile("clcsg/bgm.mp3")} volume={0.5} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur + 12}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
