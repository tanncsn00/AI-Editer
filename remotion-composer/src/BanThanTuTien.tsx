import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./btt_beats.json";
import T from "./btt_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;
const TITLE_FRAMES = 36;

const BG = "#0B0A12";
const PANEL = "#141221";
const GOLD = "#E5B54C";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const AMBER = "#FF9F45";
const VIOLET = "#B18CFF";
const TEXT = "#F2ECE0";
const SEC = "#A79FB8";
const MUTE = "#6E6780";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name);
  if (!b) throw new Error("beat khong co trong btt_beats.json: " + name);
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};

const E = T as Record<string, Record<string, number>>;
const entry = (scene: string, key: string) => {
  const v = E[scene]?.[key];
  if (v === undefined) throw new Error("thieu timing " + scene + "." + key + " trong btt_timings.json");
  return v;
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeUp = (f: number, e: number, d = 12, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
const pop = (f: number, e: number, d = 14) => ({
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
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 20%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 84%, " + VIOLET + "14 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 90px " + BG }} />
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <AbsoluteFill style={{ padding: "0 74px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

/* ---------------- narration elements ---------------- */

const Line: React.FC<{ e: number; size?: number; color?: string; weight?: number; children: React.ReactNode }> = ({ e, size = 46, color = SEC, weight = 500, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>;
};

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 78, color = RED, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>
      {children}
    </div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 52, color = SEC, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 16),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 700,
        color,
        lineHeight: 1.24,
        whiteSpace: "pre-line",
        border: "2px solid " + color + "55",
        background: color + "10",
        borderRadius: 22,
        padding: "24px 32px",
      }}
    >
      {children}
    </div>
  );
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 76, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 12), fontSize: size }}>{children}</div>;
};

/* ---------------- chat elements ---------------- */

const REVEAL = 10;

const Slot: React.FC<{ e: number; align: "flex-start" | "flex-end" | "center"; out?: number; children: React.ReactNode }> = ({ e, align, out, children }) => {
  const f = useCurrentFrame();
  const t = Math.min(
    interpolate(f, [e, e + REVEAL], [0, 1], clamp),
    out === undefined ? 1 : interpolate(f, [out - 4, out], [1, 0], clamp)
  );
  // flexShrink 0: khong co no thi thread dai bi flexbox BOP DEP tung bong bong lai
  return (
    <div style={{ flexShrink: 0, overflow: "hidden", maxHeight: interpolate(t, [0, 1], [0, 600]), marginTop: interpolate(t, [0, 1], [0, 18]), display: "flex", justifyContent: align, width: "100%" }}>
      <div style={{ opacity: t, transform: "translateY(" + interpolate(t, [0, 1], [16, 0]) + "px) scale(" + interpolate(t, [0, 1], [0.92, 1]) + ")", transformOrigin: align === "flex-end" ? "right bottom" : "left bottom", maxWidth: "86%" }}>
        {children}
      </div>
    </div>
  );
};

const Bubble: React.FC<{ e: number; side: "l" | "r"; accent: string; nm?: string; t: string }> = ({ e, side, accent, nm, t }) => {
  const right = side === "r";
  return (
    <Slot e={e} align={right ? "flex-end" : "flex-start"}>
      {nm ? (
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, color: MUTE, letterSpacing: 2, marginBottom: 8, textAlign: right ? "right" : "left" }}>{nm.toUpperCase()}</div>
      ) : null}
      <div
        style={{
          fontFamily: "Be Vietnam Pro",
          fontSize: 44,
          fontWeight: right ? 800 : 500,
          color: right ? BG : TEXT,
          background: right ? accent : "#232036",
          lineHeight: 1.26,
          padding: "22px 30px",
          borderRadius: 28,
          borderBottomRightRadius: right ? 8 : 28,
          borderBottomLeftRadius: right ? 28 : 8,
          whiteSpace: "pre-line",
          boxShadow: right ? "0 0 40px " + accent + "3A" : "none",
        }}
      >
        {t}
      </div>
    </Slot>
  );
};

const Meta: React.FC<{ e: number; t: string }> = ({ e, t }) => (
  <Slot e={e} align="center">
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 500, color: SEC, background: "#00000055", border: "1px solid " + MUTE + "44", borderRadius: 999, padding: "10px 26px", letterSpacing: 1 }}>{t}</div>
  </Slot>
);

const Seen: React.FC<{ e: number; t: string }> = ({ e, t }) => (
  <Slot e={e} align="flex-end">
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 28, fontWeight: 600, color: MUTE, paddingRight: 8 }}>{t}</div>
  </Slot>
);

const Sys: React.FC<{ e: number; t: string; color?: string; size?: number }> = ({ e, t, color = MUTE, size = 34 }) => (
  <Slot e={e} align="center">
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 800, color, letterSpacing: 3 }}>{t}</div>
  </Slot>
);

const Typing: React.FC<{ e: number; out?: number }> = ({ e, out }) => {
  const f = useCurrentFrame();
  return (
    <Slot e={e} align="flex-end" out={out}>
      <div style={{ display: "flex", gap: 10, background: "#232036", borderRadius: 28, padding: "24px 30px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 999, background: SEC, opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((f - e) * 0.32 - i * 0.9)) }} />
        ))}
      </div>
    </Slot>
  );
};

type Msg =
  | { k: "l" | "r"; key: string; t: string; nm?: string; delay?: number }
  | { k: "meta" | "seen" | "sys" | "typing"; key: string; t?: string; color?: string; size?: number; delay?: number };

const ChatScene: React.FC<{ name: string }> = ({ name }) => {
  const spec = CHAT[name];
  const ec = E[name];
  if (!ec) throw new Error("thieu timings cho chat scene " + name);
  const msgs: any[] = spec.msgs.map((m) => {
    const v = ec[m.key];
    if (v === undefined) throw new Error("thieu timing " + name + "." + m.key);
    return { ...m, _e: v + (m.delay ?? 0) };
  });
  // typing indicator phai tat khi tin nhan ke tiep toi
  msgs.forEach((m, i) => {
    if (m.k === "typing") m._out = msgs[i + 1]?._e;
  });
  return (
    <AbsoluteFill style={{ padding: "0 46px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ background: PANEL, border: "2px solid " + spec.accent + "3A", borderRadius: 46, overflow: "hidden", boxShadow: "0 40px 120px #00000099", height: 1430, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 32px", borderBottom: "2px solid " + spec.accent + "26", background: "#1B1830" }}>
          <div style={{ fontSize: 50, width: 84, height: 84, borderRadius: 999, background: spec.accent + "22", border: "2px solid " + spec.accent + "55", display: "flex", alignItems: "center", justifyContent: "center" }}>{spec.avatar}</div>
          <div>
            <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 800, color: TEXT, letterSpacing: -0.5 }}>{spec.who}</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 23, color: spec.accent, letterSpacing: 2, marginTop: 4 }}>{spec.status ?? "ĐANG HOẠT ĐỘNG"}</div>
          </div>
        </div>
        {/* column-reverse: tin moi nhat luon o DAY, tin cu tran len TREN roi bi cat */}
        <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", padding: "10px 32px 34px", display: "flex", flexDirection: "column-reverse" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(" + PANEL + " 22%, transparent)", zIndex: 2, pointerEvents: "none" }} />
          {msgs.slice().reverse().map((m: any, i: number) => {
            if (m.k === "meta") return <Meta key={i} e={m._e} t={m.t} />;
            if (m.k === "seen") return <Seen key={i} e={m._e} t={m.t} />;
            if (m.k === "typing") return <Typing key={i} e={m._e} out={m._out} />;
            if (m.k === "sys") return <Sys key={i} e={m._e} t={m.t} color={m.color} size={m.size} />;
            return <Bubble key={i} e={m._e} side={m.k} accent={spec.accent} nm={m.nm} t={m.t} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- scene tables ---------------- */

const CHAT: Record<string, { who: string; avatar: string; accent: string; status?: string; msgs: Msg[] }> = {
  C1_A: {
    who: "Đại Đế Bùng Kèo",
    avatar: "⚔️",
    accent: RED,
    msgs: [
      { k: "l", key: "a1", t: "Huynh đệ tối nay đi nhậu không?" },
      { k: "r", key: "a2", t: "CHIẾN!" },
      { k: "l", key: "a3", t: "8 giờ nhé?" },
      { k: "r", key: "a4", t: "Bản tọa nhất định tới." },
      { k: "meta", key: "b0", t: "7:30" },
      { k: "r", key: "b1", t: "Đang đến." },
      { k: "meta", key: "b2", t: "8:00" },
      { k: "l", key: "b3", t: "Đâu?" },
      { k: "r", key: "b4", t: "Sắp tới." },
      { k: "meta", key: "c0", t: "9:00" },
      { k: "l", key: "c0", t: "???", delay: 8 },
      { k: "seen", key: "c2", t: "Đã xem." },
      { k: "meta", key: "c3", t: "10:00" },
      { k: "sys", key: "c4", t: "Offline.", color: RED },
      { k: "meta", key: "d0", t: "Sáng hôm sau" },
      { k: "r", key: "d1", t: "Xin lỗi huynh đệ." },
      { k: "r", key: "d2", t: "Ta hôm qua có việc." },
      { k: "l", key: "d3", t: "Việc gì?" },
      { k: "typing", key: "d3", delay: 12 },
      { k: "r", key: "e1", t: "Chưa nghĩ ra." },
      { k: "sys", key: "e1", t: "💀", delay: 16, size: 60 },
    ],
  },

  C2_B: {
    who: "Thao Thiết Đạo Nhân",
    avatar: "🍜",
    accent: AMBER,
    msgs: [
      { k: "l", key: "q1", t: "Đi xem phim không?" },
      { k: "r", key: "q2", t: "Có ăn không?" },
      { k: "l", key: "q3", t: "Đi cafe?" },
      { k: "r", key: "q4", t: "Có ăn không?" },
      { k: "l", key: "q5", t: "Đi tập?" },
      { k: "r", key: "q6", t: "Tập xong ăn gì?" },
      { k: "l", key: "q7", t: "Đi tu luyện?" },
      { k: "r", key: "q8", t: "Tu luyện xong ăn gì?" },
      { k: "sys", key: "q8", t: "💀", delay: 22, size: 60 },
    ],
  },

  C2_D: {
    who: "Thao Thiết Đạo Nhân",
    avatar: "🍜",
    accent: AMBER,
    status: "ĐANG Ở QUÁN",
    msgs: [
      { k: "meta", key: "d0", t: "Đến quán" },
      { k: "l", key: "d1", t: "Huynh đệ gọi gì?" },
      { k: "r", key: "d2", t: "Ta ăn nhẹ." },
      { k: "meta", key: "e0", t: "5 phút sau…" },
      { k: "r", key: "e1", t: "🍲  Một nồi lẩu" },
      { k: "r", key: "e2", t: "🥩  Ba đĩa thịt" },
      { k: "r", key: "e3", t: "🍜  Hai bát mì" },
      { k: "r", key: "e4", t: "🥤  Bốn cốc nước" },
      { k: "l", key: "f1", t: "Mày bảo ăn nhẹ mà?", nm: "Ngươi" },
      { k: "r", key: "f2", t: "Đúng.", nm: "Hắn" },
      { k: "l", key: "g1", t: "Nhẹ cái gì?" },
      { k: "r", key: "g2", t: "Nhẹ nhàng." },
      { k: "sys", key: "g2", t: "💀", delay: 18, size: 60 },
      { k: "meta", key: "h0", t: "Đến lúc tính tiền" },
      { k: "r", key: "h1", t: "Ta vừa nhập định.", nm: "Thao Thiết" },
    ],
  },

  C3_B: {
    who: "Thiên Cơ Các Chủ",
    avatar: "🕵️",
    accent: VIOLET,
    status: "BIẾT TRƯỚC MỌI THỨ",
    msgs: [
      { k: "meta", key: "b0", t: "Ngươi vừa chia tay" },
      { k: "r", key: "b1", t: "Tao biết rồi." },
      { k: "l", key: "b1", t: "???", delay: 12 },
      { k: "meta", key: "b3", t: "Ngươi đổi việc" },
      { k: "r", key: "b4", t: "Tao biết rồi." },
      { k: "l", key: "b4", t: "???", delay: 12 },
      { k: "meta", key: "c0", t: "Ngươi crush ai" },
      { k: "r", key: "c1", t: "Tao biết rồi." },
      { k: "l", key: "c2", t: "ĐM ai nói?" },
      { k: "r", key: "c3", t: "Thiên cơ bất khả lộ.", nm: "Hắn" },
      { k: "l", key: "d1", t: "Thế bao giờ trả tao 500 nghìn?", nm: "Ngươi hỏi" },
      { k: "typing", key: "d1", delay: 20 },
      { k: "r", key: "d2", t: "Thiên cơ này chưa tính.", nm: "Hắn" },
      { k: "sys", key: "d2", t: "💀", delay: 18, size: 60 },
    ],
  },

  C4_B: {
    who: "Miệng Độc Tâm Thiện",
    avatar: "🗿",
    accent: JADE,
    status: "KHÔNG BIẾT AN ỦI",
    msgs: [
      { k: "l", key: "b1", t: "Bro tao vừa fail phỏng vấn." },
      { k: "r", key: "b2", t: "Biết ngay." },
      { k: "l", key: "b2", t: "...", delay: 14 },
      { k: "l", key: "c1", t: "Tao buồn." },
      { k: "r", key: "c2", t: "Buồn gì, trình mày có tới đâu." },
      { k: "l", key: "c3", t: "ĐM." },
      { k: "meta", key: "d0", t: "Nhưng tối hôm đó…" },
      { k: "r", key: "d1", t: "Mai phỏng vấn lại đúng không?" },
      { k: "l", key: "d2", t: "Ừ." },
      { k: "r", key: "d3", t: "Tao mock cho." },
      { k: "sys", key: "d3", t: "💀", delay: 16, size: 60 },
      { k: "meta", key: "e0", t: "Ngươi thất tình" },
      { k: "r", key: "e1", t: "Ngu." },
      { k: "meta", key: "e2", t: "Ngươi thất nghiệp" },
      { k: "r", key: "e3", t: "Ngu." },
      { k: "meta", key: "e4", t: "Ngươi gặp chuyện" },
      { k: "r", key: "e5", t: "Ở đâu?" },
    ],
  },

  C5_B: {
    who: "Đại Năng “Để Ta Lo”",
    avatar: "🔥",
    accent: GOLD,
    status: "LUÔN CÓ MẶT",
    msgs: [
      { k: "l", key: "b1", t: "Bro tao đang kẹt vụ này.", nm: "Ngươi" },
      { k: "r", key: "b2", t: "Đưa đây." },
      { k: "l", key: "b3", t: "Không cần, tao tự xử lý được." },
      { k: "r", key: "b4", t: "Đưa đây." },
      { k: "meta", key: "c0", t: "5 phút sau" },
      { k: "r", key: "c1", t: "Xong." },
      { k: "l", key: "c2", t: "Ủa?" },
      { k: "r", key: "c3", t: "Có gì đâu." },
      { k: "meta", key: "d0", t: "Ngươi gặp chuyện lớn hơn" },
      { k: "l", key: "d1", t: "Bro tao không biết phải làm gì." },
      { k: "meta", key: "e0", t: "Hắn không giảng đạo." },
      { k: "meta", key: "e1", t: "Không hỏi 7749 câu." },
      { k: "meta", key: "e2", t: "Chỉ nói:" },
      { k: "r", key: "e3", t: "Ở đâu?" },
    ],
  },
};

type El = { k: "n" | "big" | "quote" | "icon"; key: string; t: string; size?: number; color?: string; weight?: number; delay?: number };
const n = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "n", key, t, size, color, weight });
const b = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const q = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const ic = (key: string, t: string, delay?: number): El => ({ k: "icon", key, t, delay });

const NARR: Record<string, { gap?: number; els: El[] }> = {
  TRIG1: { gap: 26, els: [n("l0", "Ai cũng có một thằng bạn…", 48), n("l1", "rủ đi đâu cũng:", 46, TEXT), b("big", "“ĐI!”", 96, RED)] },
  TRIG2: { gap: 26, els: [n("l0", "Hỏi mấy giờ:", 46), b("big", "“Mày chọn đi,\ntao theo.”", 62, GOLD)] },
  TRIG3: { gap: 26, els: [n("l0", "Nhưng đến đúng giờ...", 46), b("big", "Nó BIẾN MẤT\nkhỏi nhân gian.", 62, RED)] },
  TRIG4: { gap: 26, els: [n("l0", "Nếu ngươi vừa nghĩ ra\nmột cái tên...", 48, TEXT), n("l1", "Xin chúc mừng.", 50, SEC)] },
  TRIG5: { els: [b("big", "Ngươi đã tìm thấy\nĐẠI ĐẾ BÙNG KÈO.", 62, RED)] },

  ATT1: { gap: 26, els: [n("l0", "Nhưng đó mới chỉ là...", 46), b("big", "một trong 5 loại bằng hữu\nĐÁNG SỢ NHẤT NHÂN GIAN.", 50, GOLD)] },
  ATT2: {
    gap: 22,
    els: [
      n("a1", "Có loại…\năn một bữa có thể khiến ngươi PHÁ SẢN.", 44, TEXT),
      n("a2", "Có loại…\nbiết DRAMA của ngươi trước cả chính ngươi.", 44, TEXT),
      n("a3", "Có loại…\nmồm chửi ngươi như kẻ thù…", 44, TEXT),
      n("a3b", "nhưng gặp chuyện lại là\nngười ĐẦU TIÊN xuất hiện.", 46, GOLD, 700),
    ],
  },
  CUR1: { gap: 28, els: [n("l0", "Tu tiên giới gọi chúng là...", 46), b("big", "NGŨ ĐẠI\nCẢNH GIỚI BẰNG HỮU.", 64, GOLD)] },
  CUR2: { gap: 26, els: [n("l0", "Và hãy xem...", 46), b("big", "bằng hữu thân nhất của ngươi\nđang ở CẢNH GIỚI NÀO.", 48, GOLD)] },

  C1_F: { gap: 26, els: [n("l0", "Đại Đế Bùng Kèo\ncó một thần thông...", 46, TEXT), b("big", "ĐẠI NA DI —\nDỊCH CHUYỂN KHỎI CUỘC HẸN.", 48, RED)] },
  C1_G: { gap: 26, els: [n("l0", "Đặc biệt:", 46), b("big", "không bao giờ\nTỪ CHỐI KÈO.", 60, TEXT)] },
  C1_H: { gap: 26, els: [n("l0", "Bởi vì...", 46), b("big", "từ chối thì\nlàm sao BÙNG?", 64, RED)] },

  C2_A: { gap: 26, els: [n("l0", "Ai cũng có một đứa bạn...", 46), b("big", "đi đâu cũng hỏi\nMỘT CÂU.", 60, AMBER)] },

  C3_A: { gap: 26, els: [n("l0", "Ai cũng có một đứa bạn...", 46), b("big", "ngươi CHƯA KỂ\nnhưng nó ĐÃ BIẾT.", 56, VIOLET)] },
  C3_E: { gap: 28, els: [n("l0", "Cảnh giới này còn được gọi là:", 44, TEXT), b("big", "BÁT QUÁI\nĐẠI THỪA.", 76, VIOLET)] },
  C3_F: { gap: 26, els: [n("l0", "Không cần mạng xã hội.", 48, TEXT), b("big", "Bản thân nó CHÍNH LÀ\nMẠNG XÃ HỘI.", 52, VIOLET)] },

  C4_A: { gap: 26, els: [n("l0", "Ai cũng có một đứa bạn...", 46), b("big", "mồm nó KHÔNG CÓ\nCHỨC NĂNG AN ỦI.", 52, JADE)] },
  C4_F: { gap: 26, els: [n("l0", "Đây là...", 48), b("big", "HỘ ĐẠO\nCHÂN QUÂN.", 76, JADE)] },
  C4_G: { gap: 20, els: [n("l0", "Miệng thì:", 44), b("b1", "MA ĐẠO.", 72, RED), n("l1", "Nhưng hành động:", 44), b("b2", "CHÍNH ĐẠO.", 72, JADE)] },

  C5_A: { gap: 26, els: [n("l0", "Đây là loại bằng hữu...", 46), b("big", "càng lớn\nCÀNG QUÝ.", 68, GOLD)] },
  C5_F: { gap: 24, els: [n("l0", "Và xuất hiện.", 48, TEXT), n("l1", "Đây là...", 46), b("big", "HỘ ĐẠO\nĐẠI NĂNG.", 70, GOLD)] },
  C5_G: { gap: 24, els: [n("l0", "Không cần nói:", 44), q("q", "“Tao luôn ở bên mày.”", 48, MUTE), n("l1", "Bởi vì...", 44), b("big", "hắn THỰC SỰ Ở ĐÓ.", 60, GOLD)] },

  PAY1: { gap: 26, els: [n("l0", "Sau này ngươi sẽ nhận ra...", 46), b("big", "bạn bè KHÔNG NHẤT THIẾT\nphải HOÀN HẢO.", 50, TEXT)] },
  PAY2: {
    gap: 20,
    els: [
      n("p1", "Có người khiến ngươi CƯỜI.", 46, TEXT),
      n("p2", "Có người khiến ngươi PHÁT ĐIÊN.", 46, TEXT),
      n("p3", "Có người khiến ngươi CHÁY VÍ.", 46, AMBER, 700),
      n("p4", "Có người khiến ngươi MẤT NIỀM TIN\nVÀO NHÂN LOẠI.", 46, RED, 700),
    ],
  },
  PAY4: { gap: 24, els: [n("l0", "Nhưng nếu may mắn...", 46), n("l1", "ngươi sẽ có một người...", 46, TEXT), n("l2", "khi cả thế giới hỏi:", 44), q("q", "“Mày tự lo được không?”", 48, MUTE)] },
  PAY5: { gap: 26, els: [n("l0", "thì hắn chỉ hỏi:", 46), b("big", "“MÀY ĐANG\nỞ ĐÂU?”", 88, GOLD)] },
  PAY6: { gap: 26, els: [n("l0", "Đó mới là...", 46), b("big", "bằng hữu\nĐÁNG GIỮ CẢ ĐỜI.", 62, GOLD)] },

  SOC1: { gap: 26, els: [n("l0", "Nhưng đạo hữu tuyệt đối...", 46), b("big", "Đừng tag thằng tuất\nbạn thân vào đây...", 52, RED)] },
  SOC2: { gap: 26, els: [n("l0", "Bởi nếu hắn thấy video này...", 46, TEXT), b("big", "hắn sẽ biết\nngươi ĐANG NÓI HẮN.", 54, RED)] },
  SOC3: { gap: 26, els: [n("l0", "Và điều đáng sợ nhất là...", 46), b("big", "nó sẽ KHÔNG PHẢN BÁC.", 58, RED)] },
  SOC4: {
    gap: 22,
    els: [n("l0", "Nó chỉ xem.", 48, TEXT), n("l1", "Thả một cái haha.", 48, TEXT), n("l2", "Rồi nhắn riêng:", 44), q("q", "“Mày muốn chết à?”", 54, RED), ic("sk", "💀", 14)],
  },
  SOC5: { gap: 26, els: [n("l0", "Nhưng nếu trong đầu ngươi...", 46), b("big", "đã hiện lên\nĐÚNG MỘT CÁI TÊN...", 54, GOLD)] },
  SOC6: { gap: 22, els: [n("l0", "Thì đừng giữ trong lòng.", 46, TEXT), b("b1", "TAG NÓ VÀO.", 70, GOLD), n("l1", "Để nó biết...", 44), b("b2", "THIÊN ĐẠO CÓ MẮT.", 58, GOLD)] },

  EXP1: { gap: 24, els: [n("l0", "Và nếu ngươi muốn biết...", 46), b("big", "5 KIỂU ĐỒNG NGHIỆP\nTRONG TU TIÊN GIỚI...", 54, AMBER), n("l1", "thì chuẩn bị tâm lý.", 44)] },
  EXP2: { gap: 24, els: [n("l0", "Bởi vì...", 44), n("l1", "bằng hữu làm ngươi TỨC.", 48, TEXT), b("big", "Đồng nghiệp làm ngươi\nMUỐN PHI THĂNG.", 54, RED)] },
};

const NarrScene: React.FC<{ name: string }> = ({ name }) => {
  const spec = NARR[name];
  return (
    <Stage gap={spec.gap}>
      {spec.els.map((el, i) => {
        const e = Math.max(0, entry(name, el.key) + (el.delay ?? 0));
        if (el.k === "quote") return <Quote key={i} e={e} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "icon") return <Icon key={i} e={e}>{el.t}</Icon>;
        if (el.k === "big") return <Big key={i} e={e} size={el.size} color={el.color}>{el.t}</Big>;
        return <Line key={i} e={e} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
      })}
    </Stage>
  );
};

const HEADS: Array<{ name: string; num: string; icon: string; title: string; accent: string }> = [
  { name: "C1_HEAD", num: "CẢNH GIỚI 1", icon: "⚔️", title: "ĐẠI ĐẾ\nBÙNG KÈO", accent: RED },
  { name: "C2_HEAD", num: "CẢNH GIỚI 2", icon: "🍜", title: "THAO THIẾT\nĐẠO NHÂN", accent: AMBER },
  { name: "C3_HEAD", num: "CẢNH GIỚI 3", icon: "🕵️", title: "THIÊN CƠ\nCÁC CHỦ", accent: VIOLET },
  { name: "C4_HEAD", num: "CẢNH GIỚI 4", icon: "🗿", title: "MIỆNG ĐỘC\nTÂM THIỆN", accent: JADE },
  { name: "C5_HEAD", num: "CẢNH GIỚI 5", icon: "🔥", title: "ĐẠI NĂNG\n“ĐỂ TA LO”", accent: GOLD },
];

const ChapterHead: React.FC<{ name: string; num: string; icon: string; title: string; accent: string }> = ({ name, num, icon, title, accent }) => {
  const f = useCurrentFrame();
  const dot = entry(name, "dot");
  const qq = entry(name, "q");
  return (
    <Stage gap={36}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 48 }}>{icon}</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: accent, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 12, 0), width: 200, height: 2, background: "linear-gradient(90deg, transparent, " + accent + "99, transparent)" }} />
      <div style={{ ...pop(f, qq, 16), fontFamily: "Be Vietnam Pro", fontSize: 84, fontWeight: 900, color: accent, lineHeight: 1.06, letterSpacing: -2, whiteSpace: "pre-line", textShadow: "0 0 60px " + accent + "44" }}>
        {title}
      </div>
    </Stage>
  );
};

const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={22}>
      <div style={{ ...pop(f, 0, 10), fontSize: 84 }}>🏯</div>
      <div style={{ ...fadeUp(f, 3, 10), fontFamily: "Be Vietnam Pro", fontSize: 118, fontWeight: 900, color: GOLD, lineHeight: 0.98, letterSpacing: -4 }}>5 KIỂU</div>
      <div style={{ ...fadeUp(f, 6, 10), fontFamily: "Be Vietnam Pro", fontSize: 56, fontWeight: 900, color: TEXT, lineHeight: 1.12, letterSpacing: -1.2, textAlign: "center" }}>
        {"BẠN THÂN\nTRONG TU TIÊN GIỚI"}
      </div>
    </Stage>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={26}>
      <div style={{ ...pop(f, entry("CTA", "btn"), 16), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color: BG, background: GOLD, borderRadius: 999, padding: "24px 56px", letterSpacing: 1 }}>
        ▶ FOLLOW BẦN ĐẠO
      </div>
      <Line e={entry("CTA", "l0")} size={46}>Để được độ kiếp</Line>
      <Big e={entry("CTA", "big")} size={76} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

const SlideFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [dur - 9, dur], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const BanThanTuTien: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    {bgm ? <Audio src={staticFile("btt/bgm.mp3")} /> : null}
    <Sequence from={0} durationInFrames={TITLE_FRAMES + 8}>
      <SlideFade dur={TITLE_FRAMES + 8}>
        <TitleCard />
      </SlideFade>
    </Sequence>
    <Sequence from={TITLE_FRAMES}>
      <Audio src={staticFile("btt/voice.mp3")} />
      {Object.keys(NARR).map((name) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <SlideFade dur={dur}>
              <NarrScene name={name} />
            </SlideFade>
          </Sequence>
        );
      })}
      {Object.keys(CHAT).map((name) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <SlideFade dur={dur}>
              <ChatScene name={name} />
            </SlideFade>
          </Sequence>
        );
      })}
      {HEADS.map((h) => {
        const { from, dur } = at(h.name);
        return (
          <Sequence key={h.name} from={from} durationInFrames={dur}>
            <SlideFade dur={dur}>
              <ChapterHead {...h} />
            </SlideFade>
          </Sequence>
        );
      })}
      <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
        <SlideFade dur={at("CTA").dur}>
          <Cta />
        </SlideFade>
      </Sequence>
    </Sequence>
  </AbsoluteFill>
);
