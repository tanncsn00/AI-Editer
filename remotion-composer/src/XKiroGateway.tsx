import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./xkgw_beats.json";
import T from "./xkgw_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#05090A";
const GREEN = "#22C55E";
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
const E = T as Record<string, Record<string, number>>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeUp = (f: number, e: number, d = 10, dy = 30) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
const pop = (f: number, e: number, d = 10) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.65, e + d], [0.74, 1.07, 1], clamp) + ")",
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.18) % 140;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(90deg, " + GREEN + "0A 1px, transparent 1px), linear-gradient(0deg, " + GREEN + "07 1px, transparent 1px)",
          backgroundSize: "140px 140px",
          backgroundPosition: drift + "px " + drift + "px",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 840px 780px at 50% 20%, " + GREEN + "1A 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 840px 780px at 50% 84%, " + GOLD + "10 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px 100px " + BG }} />
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
  return <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>;
};

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 76, color = GREEN, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.14, letterSpacing: -1.4, whiteSpace: "pre-line", textShadow: "0 0 50px " + color + "44" }}>
      {children}
    </div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 52, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 1.24,
        whiteSpace: "pre-line",
        border: "2px solid " + color + "55",
        background: color + "10",
        borderRadius: 20,
        padding: "22px 30px",
      }}
    >
      {children}
    </div>
  );
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 64, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 10), fontSize: size }}>{children}</div>;
};

const Model: React.FC<{ e: number; name: string }> = ({ e, name }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 10),
        fontFamily: "JetBrains Mono",
        fontSize: 50,
        fontWeight: 700,
        color: TEXT,
        border: "2px solid " + GREEN + "45",
        background: GREEN + "0E",
        borderRadius: 16,
        padding: "14px 34px",
        letterSpacing: 1,
      }}
    >
      {name}
    </div>
  );
};

const QA: React.FC<{ eq: number; ea: number; q: string; a: string }> = ({ eq, ea, q, a }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <div style={{ ...fadeUp(f, eq), fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 600, color: SEC, lineHeight: 1.24 }}>{q}</div>
      <div style={{ ...pop(f, ea, 10), fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 900, color: GREEN, lineHeight: 1.18 }}>{a}</div>
    </div>
  );
};

type El =
  | { k: "l"; key: string; t: string; size?: number; color?: string; weight?: number }
  | { k: "big"; key: string; t: string; size?: number; color?: string }
  | { k: "quote"; key: string; t: string; size?: number; color?: string }
  | { k: "icon"; key: string; t: string; size?: number }
  | { k: "model"; key: string; t: string }
  | { k: "qa"; key: string; key2: string; q: string; a: string };

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const md = (key: string, t: string): El => ({ k: "model", key, t });
const qa = (key: string, key2: string, q: string, a: string): El => ({ k: "qa", key, key2, q, a });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  HOOK: { gap: 26, els: [ln("l0", "Có một THIÊN CƠ CÁC…", 50, TEXT), ln("l1", "đang phát", 42), bg("big", "30 TRIỆU\nTOKEN", 118, GOLD), ln("l2", "cho người mới.", 44)] },
  KHONG30K: { gap: 24, els: [ln("l0", "Không phải 30 nghìn.", 48, SEC), ln("l1", "Không phải 300 nghìn.", 48, SEC), bg("big", "30 TRIỆU.", 104, GOLD)] },
  MOTTHANG: { gap: 26, els: [ln("l0", "Trong một tháng.\n\n…", 48, TEXT), ln("l1", "Nghe như…", 44), bg("big", "TÀ ĐẠO.", 96, RED)] },
  COTHAT: { gap: 28, els: [ln("l0", "Nhưng lần này…", 48, SEC), bg("big", "NÓ CÓ THẬT.", 92, GREEN)] },
  REVEAL: { gap: 30, els: [ln("l0", "Đó chính là…", 46, SEC), bg("big", "xKiro.", 150, GREEN)] },
  THUVI: { gap: 24, els: [ic("i0", "🏯", 66), ln("l0", "Thiên Cơ Các này\ncó một thứ khá thú vị.", 46, TEXT), ln("l1", "Nó không tự luyện ra\nmột đại năng AI.", 46, SEC)] },
  CANHCONG: { gap: 26, els: [ln("l0", "Mà giống như…", 44, SEC), bg("big", "MỘT CÁNH CỔNG\nnối tới rất nhiều đại năng.", 52, GREEN)] },
  MODELS: { gap: 16, els: [md("m0", "Claude"), md("m1", "GPT"), md("m2", "Gemini"), md("m3", "DeepSeek"), ln("l0", "Muốn gọi vị nào…", 44, SEC), bg("big", "THÌ GỌI VỊ ĐÓ.", 60, GREEN)] },
  THAYVI: { gap: 22, els: [ln("l0", "Thay vì mỗi vị một đạo API,", 44, TEXT), ln("l1", "mỗi vị một chiếc chìa khóa,", 44, TEXT), ln("l2", "mỗi lần đổi model\nlại phải sửa cả trận pháp…", 44, RED)] },
  GOM: { gap: 26, els: [ln("l0", "xKiro gom chúng về một chỗ.", 46, TEXT), ln("l1", "Ngươi chỉ cần đổi model.", 46, SEC), bg("big", "TRẬN PHÁP VẪN CHẠY.", 62, GREEN)] },
  NAOLOAN: { gap: 24, els: [ln("l0", "Mà đợt này…", 44, SEC), ln("l1", "thứ khiến Thiên Cơ Các này\nnáo loạn…", 44, TEXT), bg("big", "lại là 30 TRIỆU TOKEN.", 58, GOLD)] },
  VAINGHIN: { gap: 24, els: [ln("l0", "Không phải vài nghìn.", 48, SEC), ln("l1", "Không phải vài trăm nghìn.", 48, SEC), bg("big", "30 TRIỆU.", 104, GOLD)] },
  DUDE: { gap: 24, els: [ln("l0", "Đủ để mấy đạo hữu…", 44, SEC), ln("l1", "bình thường chỉ dám\nnhìn model xịn từ xa…", 44, TEXT), bg("big", "BẮT ĐẦU MẠNH DẠN\nTRIỆU HỒI.", 62, GREEN)] },
  CANHGIOILA: { gap: 22, els: [ic("i0", "💀", 64), ln("l0", "Vì dân tu AI\ncó một cảnh giới rất lạ.", 46, TEXT), ln("l1", "Đang code…\nAI vừa bắt đầu hiểu vấn đề…", 44, SEC), bg("big", "đệ tử nhìn số Token.", 56, GOLD)] },
  THOI: { gap: 26, els: [qt("q0", "“Thôi.”", 62, MUTE), qt("q1", "“Để mai hỏi tiếp.”", 54, MUTE)] },
  HETLINHTHACH: { gap: 26, els: [ln("l0", "Không phải\nđạo tâm thanh tịnh.", 48, SEC), bg("big", "MÀ LÀ HẾT LINH THẠCH.", 64, RED)] },
  DANGNOI: { gap: 26, els: [ln("l0", "Nhưng cái đáng nói ở xKiro…", 48, TEXT), ln("l1", "không chỉ là\nđống linh thạch kia.", 46, SEC)] },
  MOTCHO: { gap: 24, els: [ln("l0", "Mà là chuyện…", 44, SEC), ln("l1", "ngươi có thể đứng ở một chỗ…", 46, TEXT), bg("big", "rồi gọi những vị\nđại năng khác nhau.", 56, GREEN)] },
  DOIMODEL: { gap: 26, els: [qa("q0", "a0", "Việc này không ổn?", "→ ĐỔI MODEL."), qa("q1", "a1", "Vị này code không hợp?", "→ GỌI VỊ KHÁC.")] },
  THU: { gap: 28, els: [ln("l0", "Muốn thử một model mới?", 48, SEC), bg("big", "→ THỬ.", 96, GREEN)] },
  AGENT: { gap: 24, els: [ln("l0", "Đặc biệt khi bắt đầu\ndùng AI Agent…", 46, TEXT), ln("l1", "ngươi sẽ dần không còn hỏi:", 44, SEC), qt("q0", "“Con AI nào mạnh nhất?”", 50, MUTE)] },
  GOITHANGNAO: { gap: 28, els: [ln("l0", "Mà sẽ hỏi:", 44, SEC), bg("big", "“VIỆC NÀY…\nNÊN GỌI THẰNG NÀO?”", 60, GREEN)] },
  CANHGIOITHOIDAI: { gap: 22, els: [ic("i0", "🏯", 62), ln("l0", "Và đó mới là cảnh giới\nthú vị của thời đại này.", 46, TEXT), ln("l1", "Ngày xưa tu tiên…\nngười ta tranh nhau\nmột thanh tiên kiếm.", 44, SEC)] },
  DANIT: { gap: 26, els: [ln("l0", "Bây giờ dân IT…", 46, SEC), bg("big", "TRANH NHAU XEM\nCON AI NÀO CODE GIỎI HƠN.", 54, GREEN)] },
  DUNGSAN: { gap: 24, els: [ic("i0", "💀", 60), ln("l0", "xKiro…", 58, TEXT), ln("l1", "chỉ đơn giản là\ndựng sẵn cho ngươi…", 44, SEC), bg("big", "MỘT CÁNH CỔNG.", 76, GREEN)] },
  BUOCVAO: { gap: 24, els: [ln("l0", "Bên trong có đủ loại đại năng.", 46, TEXT), ln("l1", "Còn bước vào…\ngọi vị nào…", 44, SEC), bg("big", "LÀ CHUYỆN CỦA NGƯƠI.", 64, GOLD)] },
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const cfg = SCENES[name];
  const e = E[name] ?? {};
  return (
    <Stage gap={cfg.gap}>
      {cfg.els.map((el) => {
        const entry = e[el.key] ?? 0;
        if (el.k === "l") return <Line key={el.key} e={entry} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
        if (el.k === "big") return <Big key={el.key} e={entry} size={el.size} color={el.color}>{el.t}</Big>;
        if (el.k === "quote") return <Quote key={el.key} e={entry} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "icon") return <Icon key={el.key} e={entry} size={el.size}>{el.t}</Icon>;
        if (el.k === "model") return <Model key={el.key} e={entry} name={el.t} />;
        return <QA key={el.key} eq={entry} ea={e[el.key2] ?? 0} q={el.q} a={el.a} />;
      })}
    </Stage>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.CTA ?? {};
  return (
    <Stage gap={30}>
      <div
        style={{
          ...pop(f, e.btn ?? 0),
          fontFamily: "Be Vietnam Pro",
          fontSize: 54,
          fontWeight: 900,
          color: BG,
          background: GREEN,
          borderRadius: 999,
          padding: "24px 56px",
          letterSpacing: 1,
        }}
      >
        ▶ FOLLOW BẦN ĐẠO
      </div>
      <Line e={e.l0 ?? 0} size={46}>để độ kiếp</Line>
      <Big e={e.big ?? 0} size={72} color={GREEN}>cùng GIỚI IT</Big>
    </Stage>
  );
};

export const XKiroGateway: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("xkgw/voice.mp3")} />
    {bgm ? <Audio src={staticFile("xkgw/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
