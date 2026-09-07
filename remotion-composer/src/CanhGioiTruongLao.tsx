import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./cgtl_beats.json";
import T from "./cgtl_timings.json";

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
const BLUE = "#6FA8FF";
const TEXT = "#F2ECE0";
const SEC = "#A79FB8";
const MUTE = "#6E6780";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name);
  if (!b) throw new Error("beat khong co trong cgtl_beats.json: " + name);
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};

const E = T as Record<string, Record<string, number>>;
const entry = (scene: string, key: string) => {
  const v = E[scene]?.[key];
  if (v === undefined) throw new Error("thieu timing " + scene + "." + key + " trong cgtl_timings.json");
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
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 84%, " + BLUE + "12 0%, transparent 62%)" }} />
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
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 500, color: SEC, background: "#00000055", border: "1px solid " + MUTE + "44", borderRadius: 999, padding: "10px 26px", letterSpacing: 1, textAlign: "center", whiteSpace: "pre-line" }}>{t}</div>
  </Slot>
);

const Seen: React.FC<{ e: number; t: string }> = ({ e, t }) => (
  <Slot e={e} align="flex-end">
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 30, fontWeight: 700, color: MUTE, paddingRight: 8 }}>{t}</div>
  </Slot>
);

const Sys: React.FC<{ e: number; t: string; color?: string; size?: number }> = ({ e, t, color = MUTE, size = 34 }) => (
  <Slot e={e} align="center">
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 800, color, letterSpacing: 2, whiteSpace: "pre-line", textAlign: "center" }}>{t}</div>
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
            <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 38, fontWeight: 800, color: TEXT, letterSpacing: -0.5 }}>{spec.who}</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: spec.accent, letterSpacing: 2, marginTop: 4 }}>{spec.status}</div>
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

const CHAT: Record<string, { who: string; avatar: string; accent: string; status: string; msgs: Msg[] }> = {
  C1_A: {
    who: "Trưởng Lão “Tùy Ngươi”",
    avatar: "⚔️",
    accent: VIOLET,
    status: "KHÔNG NÓI ĐÁP ÁN",
    msgs: [
      { k: "meta", key: "a0", t: "Trưởng Lão giao nhiệm vụ" },
      { k: "r", key: "a1", t: "Em cứ chủ động xử lý." },
      { k: "sys", key: "b1", t: "❌  Không deadline." },
      { k: "sys", key: "b2", t: "❌  Không yêu cầu." },
      { k: "sys", key: "b3", t: "❌  Không tiêu chí." },
      { k: "meta", key: "c1", t: "Ngươi tự suy diễn…\nba ngày ba đêm." },
      { k: "meta", key: "d0", t: "Đến lúc giao bài" },
      { k: "r", key: "d1", t: "Sao em lại làm thế này?" },
    ],
  },

  C2_A: {
    who: "Trưởng Lão “Thiên Lý Truyền Âm”",
    avatar: "👁️",
    accent: BLUE,
    status: "ĐÃ XEM · KHÔNG TRẢ LỜI",
    msgs: [
      { k: "meta", key: "a0", t: "Ngươi gửi tin" },
      { k: "seen", key: "a1", t: "Seen." },
      { k: "meta", key: "a2", t: "Gửi tiếp" },
      { k: "seen", key: "a3", t: "Seen." },
      { k: "meta", key: "b0", t: "Ba ngày không hồi âm." },
      { k: "meta", key: "c0", t: "17:58" },
      { k: "r", key: "c1", t: "Em ơi, cái này làm gấp giúp anh nhé." },
    ],
  },

  C3_A: {
    who: "Trưởng Lão “Không Gấp”",
    avatar: "⏳",
    accent: AMBER,
    status: "ONLINE LÚC 17:57",
    msgs: [
      { k: "meta", key: "a0", t: "Thứ Hai" },
      { k: "r", key: "a1", t: "Không gấp đâu em." },
      { k: "meta", key: "b0", t: "Thứ Tư" },
      { k: "r", key: "b1", t: "Em làm tới đâu rồi?" },
      { k: "meta", key: "c0", t: "Thứ Sáu · 17:57" },
      { k: "r", key: "c1", t: "Cố gắng xong hôm nay nhé." },
    ],
  },

  C4_A: {
    who: "Trưởng Lão “Cái Này Dễ Mà”",
    avatar: "🧙",
    accent: RED,
    status: "ƯỚC LƯỢNG BẰNG NIỀM TIN",
    msgs: [
      { k: "l", key: "a1", t: "Việc này chắc cần 2 ngày.", nm: "Ngươi" },
      { k: "r", key: "b1", t: "Hai ngày?", nm: "Trưởng Lão" },
      { k: "r", key: "b2", t: "Cái này đơn giản mà." },
      { k: "r", key: "b3", t: "Anh nghĩ 2 tiếng là xong." },
    ],
  },

  C4_F: {
    who: "Trưởng Lão “Cái Này Dễ Mà”",
    avatar: "🧙",
    accent: RED,
    status: "ƯỚC LƯỢNG BẰNG NIỀM TIN",
    msgs: [
      { k: "meta", key: "f0", t: "Đến khi làm xong" },
      { k: "r", key: "f1", t: "Ủa, sao lâu vậy em?" },
    ],
  },

  C5_D: {
    who: "Trưởng Lão Hộ Đạo",
    avatar: "🔥",
    accent: GOLD,
    status: "LUÔN ĐỨNG TRƯỚC",
    msgs: [
      { k: "meta", key: "d0", t: "Khách hàng nổi giận?" },
      { k: "r", key: "d1", t: "Trưởng Lão đứng ra." },
      { k: "meta", key: "e0", t: "Dự án gặp đại kiếp?" },
      { k: "r", key: "e1", t: "Cùng đệ tử giải quyết." },
      { k: "meta", key: "f0", t: "Đệ tử phạm sai lầm?" },
      { k: "meta", key: "f1", t: "Không hỏi:" },
      { k: "l", key: "f2", t: "Ai chịu trách nhiệm?" },
      { k: "meta", key: "g0", t: "Mà hỏi:" },
      { k: "r", key: "g1", t: "Giờ chúng ta phá kiếp thế nào?" },
    ],
  },
};

type El = { k: "n" | "big" | "quote" | "icon"; key: string; t: string; size?: number; color?: string; weight?: number; delay?: number };
const n = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "n", key, t, size, color, weight });
const b = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const q = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const ic = (key: string, t: string, delay?: number): El => ({ k: "icon", key, t, delay });

const NARR: Record<string, { gap?: number; els: El[] }> = {
  TRIG1: { gap: 26, els: [n("l0", "Ai đi làm cũng có một vị Trưởng Lão...", 46, TEXT), n("l1", "chỉ cần thấy tin nhắn:", 44), q("q", "“Em ơi.”", 72, RED)] },
  TRIG2: { gap: 24, els: [n("l0", "là linh lực trong người...", 46), b("big", "tự động tụt 30%.", 72, RED), ic("sk", "💀")] },
  TRIG3: { gap: 26, els: [n("l0", "Nếu trong đầu ngươi vừa hiện lên\nmột cái tên...", 46, TEXT), b("big", "CHÚC MỪNG.", 76, GOLD)] },
  TRIG4: { gap: 26, els: [n("l0", "Ngươi đã gặp...", 46), b("big", "một trong NGŨ ĐẠI\nCẢNH GIỚI TRƯỞNG LÃO.", 54, GOLD)] },

  ATT1: { gap: 22, els: [n("l0", "Nhưng đáng sợ ở chỗ...", 46), n("l1", "có những cảnh giới...", 46, TEXT), n("l2", "ngươi tưởng mình chưa từng gặp.", 48, TEXT, 700)] },
  ATT2: { gap: 26, els: [n("l0", "Cho đến một ngày...", 46), b("big", "ngươi nhận ra mình đang\nTU LUYỆN DƯỚI TRƯỚNG VỊ ẤY.", 48, RED)] },
  ATT3: { gap: 24, els: [n("l0", "Và tin ta đi...", 46), n("l1", "ít nhất một trong năm cảnh giới này...", 44, TEXT), b("big", "đã từng ĐỘ KIẾP CÙNG NGƯƠI.", 52, GOLD)] },

  C1_E: { gap: 28, els: [n("l0", "Đây chính là...", 46), b("big", "VÔ TƯỚNG\nKIẾM ĐẠO.", 82, VIOLET)] },
  C1_F: { gap: 24, els: [n("l0", "Trưởng Lão không nói đáp án.", 48, TEXT), b("big", "Nhưng ngươi vẫn phải\nĐOÁN ĐÚNG.", 58, VIOLET), ic("sk", "💀")] },

  C2_D: { gap: 28, els: [n("l0", "Trưởng Lão đã lĩnh ngộ:", 46), b("big", "THIÊN LÝ TRUYỀN ÂM\nĐƠN HƯỚNG.", 58, BLUE)] },
  C2_E: { gap: 24, els: [n("l0", "Ngươi có thể truyền âm tới Trưởng Lão.", 44, TEXT), n("l1", "Nhưng...", 46), b("big", "Trưởng Lão KHÔNG CẦN\nTRUYỀN ÂM LẠI.", 54, BLUE)] },

  C3_D: { els: [b("big", "THIÊN KIẾP\nGIÁNG THẾ.", 88, AMBER)] },
  C3_E: { gap: 28, els: [n("l0", "Đây là công pháp:", 46), b("big", "ĐẢO NGƯỢC\nTHỜI KHÔNG.", 78, AMBER)] },
  C3_F: {
    gap: 20,
    els: [n("l0", "Biến một nhiệm vụ...", 46), n("l1", "không gấp", 52, SEC, 700), n("l2", "thành nhiệm vụ...", 46), b("big", "GẤP NHẤT NHÂN GIAN.", 60, RED), ic("sk", "💀")],
  },

  C4_C: { gap: 20, els: [n("l0", "Ngươi nhìn công việc.", 48, TEXT), n("l1", "Nhìn đồng hồ.", 48, TEXT), n("l2", "Nhìn đống việc đang chờ.", 48, TEXT)] },
  C4_D: { gap: 26, els: [n("l0", "Rồi nhìn sang...", 46), b("big", "ánh mắt đầy KỲ VỌNG\ncủa Trưởng Lão.", 54, RED)] },
  C4_E: { gap: 22, els: [n("l0", "Ngươi hít sâu.", 48, TEXT), n("l1", "Vận chuyển toàn bộ linh lực.", 46, TEXT), b("big", "BẮT ĐẦU LAO VÀO\nTHIÊN KIẾP.", 58, RED)] },
  C4_G: {
    gap: 20,
    els: [n("l0", "Ngươi lúc này mới ngộ ra:", 44), n("l1", "Cái dễ...", 52, TEXT, 700), n("l2", "thường là cái...", 46), b("big", "NGƯỜI KHÁC LÀM.", 68, RED), ic("sk", "💀")],
  },

  C5_A: { gap: 26, els: [n("l0", "Nhưng trong Tu Tiên Giới...", 46), b("big", "không phải Trưởng Lão nào\ncũng đáng sợ.", 52, GOLD)] },
  C5_B: { gap: 22, els: [n("l0", "Có những vị yêu cầu rất cao.", 48, TEXT), n("l1", "Ép ngươi trưởng thành.", 48, TEXT, 700)] },
  C5_C: { gap: 26, els: [n("l0", "Nhưng khi Thiên Kiếp giáng xuống...", 44, TEXT), b("big", "vị ấy KHÔNG ĐỂ ĐỆ TỬ\nCHỊU TRẬN MỘT MÌNH.", 52, GOLD)] },
  C5_H: { gap: 28, els: [n("l0", "Đây chính là...", 46), b("big", "HỘ ĐẠO\nCHÂN QUÂN.", 84, GOLD)] },
  C5_I: { els: [n("l0", "Không nhất thiết là\nvị Trưởng Lão dễ tính nhất.", 48, TEXT)] },
  C5_J: {
    gap: 22,
    els: [n("l0", "Nhưng là người...", 46), n("l1", "khi ngươi sắp tẩu hỏa nhập ma...", 44, TEXT), n("l2", "vẫn đứng bên cạnh...", 46), b("big", "HỘ PHÁP CHO NGƯƠI.", 60, GOLD)],
  },

  PAY1: { gap: 26, els: [n("l0", "Tu hành nơi nhân gian...", 46), b("big", "gặp Trưởng Lão khó\nKHÔNG ĐÁNG SỢ.", 56, TEXT)] },
  PAY2: { gap: 26, els: [n("l0", "Đáng sợ nhất...", 46), b("big", "là gặp người\nKHÔNG CHỈ ĐẠO,\nKHÔNG BẢO VỆ,\ncũng KHÔNG CHỊU TRÁCH NHIỆM.", 48, RED)] },
  PAY3: { gap: 26, els: [n("l0", "Còn một vị Trưởng Lão\nthật sự đáng kính...", 46, TEXT), b("big", "có thể bắt ngươi chịu\nTHIÊN KIẾP.", 54, GOLD)] },
  PAY4: { gap: 26, els: [n("l0", "Nhưng khi Thiên Kiếp giáng xuống...", 44), b("big", "người ấy\nVẪN ĐỨNG CÙNG NGƯƠI.", 58, GOLD)] },
  PAY5: { gap: 26, els: [n("l0", "Đó mới là...", 46), b("big", "TRƯỞNG LÃO\nCHÂN CHÍNH.", 80, GOLD)] },

  SOC1: { els: [b("big", "Giờ đừng vội\nTAG TRƯỞNG LÃO.", 62, RED)] },
  SOC2: { gap: 24, els: [n("l0", "Hãy quay sang đạo hữu bên cạnh...", 46), n("l1", "và hỏi:", 44), q("q", "“Trưởng Lão của ngươi\nđang ở cảnh giới nào?”", 50, GOLD)] },
  SOC3: { gap: 24, els: [n("l0", "Nếu hai người nhìn nhau...", 46), n("l1", "không nói một lời...", 46, TEXT), b("big", "CHÚC MỪNG.", 72, GOLD)] },
  SOC4: { gap: 24, els: [b("big", "Hai ngươi đã cùng\nNGỘ ĐẠO.", 62, GOLD), ic("sk", "💀")] },
  SOC5: { els: [n("l0", "Còn nếu ngươi tag thẳng\nTrưởng Lão vào...", 50, TEXT, 700)] },
  SOC6: { els: [b("big", "Bần đạo xin phép\nRỜI KHỎI TÔNG MÔN TRƯỚC.", 54, RED)] },
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
  { name: "C1_HEAD", num: "CẢNH GIỚI 1", icon: "⚔️", title: "TRƯỞNG LÃO\n“TÙY NGƯƠI”", accent: VIOLET },
  { name: "C2_HEAD", num: "CẢNH GIỚI 2", icon: "👁️", title: "TRƯỞNG LÃO\n“THIÊN LÝ\nTRUYỀN ÂM”", accent: BLUE },
  { name: "C3_HEAD", num: "CẢNH GIỚI 3", icon: "⏳", title: "TRƯỞNG LÃO\n“KHÔNG GẤP”", accent: AMBER },
  { name: "C4_HEAD", num: "CẢNH GIỚI 4", icon: "🧙", title: "TRƯỞNG LÃO\n“CÁI NÀY DỄ MÀ”", accent: RED },
  { name: "C5_HEAD", num: "CẢNH GIỚI 5", icon: "🔥", title: "TRƯỞNG LÃO\nHỘ ĐẠO", accent: GOLD },
];

const ChapterHead: React.FC<{ name: string; num: string; icon: string; title: string; accent: string }> = ({ name, num, icon, title, accent }) => {
  const f = useCurrentFrame();
  const dot = entry(name, "dot");
  const qq = entry(name, "q");
  return (
    <Stage gap={34}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 48 }}>{icon}</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: accent, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 12, 0), width: 200, height: 2, background: "linear-gradient(90deg, transparent, " + accent + "99, transparent)" }} />
      <div style={{ ...pop(f, qq, 16), fontFamily: "Be Vietnam Pro", fontSize: 72, fontWeight: 900, color: accent, lineHeight: 1.08, letterSpacing: -2, whiteSpace: "pre-line", textShadow: "0 0 60px " + accent + "44" }}>
        {title}
      </div>
    </Stage>
  );
};

const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage gap={20}>
      <div style={{ ...pop(f, 0, 10), fontSize: 84 }}>🏯</div>
      <div style={{ ...fadeUp(f, 3, 10), fontFamily: "Be Vietnam Pro", fontSize: 104, fontWeight: 900, color: GOLD, lineHeight: 0.98, letterSpacing: -4 }}>5 CẢNH GIỚI</div>
      <div style={{ ...fadeUp(f, 6, 10), fontFamily: "Be Vietnam Pro", fontSize: 68, fontWeight: 900, color: TEXT, lineHeight: 1.1, letterSpacing: -2, textAlign: "center" }}>TRƯỞNG LÃO</div>
      <div style={{ ...fadeUp(f, 9, 10), fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 800, color: MUTE, lineHeight: 1.2, textAlign: "center" }}>
        {"MÀ DÂN TU TIÊN ĐI LÀM ĐỀU GẶP"}
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
      <Line e={entry("CTA", "l0")} size={46}>để được độ kiếp</Line>
      <Big e={entry("CTA", "big")} size={76} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

const SlideFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [dur - 9, dur], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const CanhGioiTruongLao: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    {bgm ? <Audio src={staticFile("cgtl/bgm.mp3")} /> : null}
    <Sequence from={0} durationInFrames={TITLE_FRAMES + 8}>
      <SlideFade dur={TITLE_FRAMES + 8}>
        <TitleCard />
      </SlideFade>
    </Sequence>
    <Sequence from={TITLE_FRAMES}>
      <Audio src={staticFile("cgtl/voice.mp3")} />
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
