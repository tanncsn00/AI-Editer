import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./ttt_beats.json";
import T from "./ttt_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#0A0913";
const GOLD = "#E5B54C";
const VIOLET = "#A78BFA";
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
  const pulse = 0.5 + 0.5 * Math.sin(f / 46);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle 900px at 50% 34%, " + VIOLET + "1A 0%, transparent 60%)",
          opacity: 0.55 + 0.45 * pulse,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 88%, " + GOLD + "12 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 90px " + BG }} />
    </AbsoluteFill>
  );
};

const SeriesTag: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 64,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: "JetBrains Mono",
      fontSize: 24,
      color: GOLD,
      letterSpacing: 6,
      opacity: 0.5,
    }}
  >
    📜 GIẢ THUYẾT TU TIÊN GIỚI
  </div>
);

const HookBanner: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 12, dur], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 128,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: o,
        fontFamily: "Be Vietnam Pro",
        fontSize: 50,
        fontWeight: 900,
        color: GOLD,
        lineHeight: 1.16,
        letterSpacing: -1,
        whiteSpace: "pre-line",
        textShadow: "0 0 50px " + GOLD + "55",
      }}
    >
      {"NẾU SẾP ĐỌC ĐƯỢC\nSUY NGHĨ NHÂN VIÊN"}
    </div>
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

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 68, color = RED, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>
      {children}
    </div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 50, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 16),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 1.24,
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

const Thought: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 44, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...fadeUp(f, e, 12, 16),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 700,
        color: RED,
        lineHeight: 1.26,
        whiteSpace: "pre-line",
        border: "2px dashed " + RED + "55",
        background: RED + "0E",
        borderRadius: 26,
        padding: "18px 28px",
        maxWidth: 900,
      }}
    >
      {children}
    </div>
  );
};

const Skull: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 12), fontSize: 76 }}>💀</div>;
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 68, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 14), fontSize: size }}>{children}</div>;
};

type El = { k: "l" | "big" | "quote" | "thought" | "skull" | "icon" | "gap"; key?: string; t?: string; size?: number; color?: string; weight?: number; delay?: number; h?: number };

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const th = (key: string, t: string, size?: number): El => ({ k: "thought", key, t, size });
const ic = (key: string, t: string, size?: number, delay?: number): El => ({ k: "icon", key, t, size, delay });
const relBig = (key: string, t: string, delay: number, size?: number, color?: string): El => ({ k: "big", key, t, delay, size, color });

const SCENES: Record<string, { gap: number; els: El[] }> = {
  MODAU: {
    gap: 26,
    els: [
      ln("l0", "Nếu một ngày…", 46, SEC),
      ln("l1", "Chưởng môn của một đại tông môn\nđột nhiên lĩnh ngộ được", 46, TEXT),
      ic("big", "🧠", 70, -4),
      bg("big", "THA TÂM THÔNG.", 72, VIOLET),
    ],
  },
  MODAU2: {
    gap: 28,
    els: [ln("l0", "Một bí thuật…", 46, SEC), ln("l1", "có thể đọc được suy nghĩ", 48, TEXT), bg("big", "CỦA TOÀN BỘ ĐỆ TỬ.", 62, VIOLET)],
  },
  MODAU3: {
    gap: 28,
    els: [ln("l0", "Ban đầu…", 46, SEC), ln("l1", "Chưởng môn", 48, TEXT), bg("big", "VÔ CÙNG MỪNG RỠ.", 62, JADE)],
  },
  MODAU4: {
    gap: 28,
    els: [ln("l0", "Ngài bước vào", 46, SEC), bg("big", "ĐẠI ĐIỆN.", 78, GOLD)],
  },
  DD_HOI: {
    gap: 30,
    els: [qt("q0", "“Các đệ tử.”", 52), qt("q1", "“Bổn tọa muốn biết…\ncác ngươi thực sự nghĩ gì\nvề tông môn?”", 46)],
  },
  DD_CUI: {
    gap: 28,
    els: [ln("l0", "Toàn bộ đệ tử", 46, TEXT), bg("big", "ĐỒNG LOẠT CÚI ĐẦU.", 62, SEC)],
  },
  DD_VO: {
    gap: 28,
    els: [ln("l0", "Đạo tâm của ngài", 46, TEXT), bg("big", "XUÝT NỮA VỠ VỤN.", 64, RED)],
  },
  N1_HOI: {
    gap: 30,
    els: [ln("l0", "Ngài quay sang một đệ tử.", 44, SEC), qt("q0", "“Ngươi có nguyện ý\nnhận thêm nhiệm vụ không?”", 48)],
  },
  N1_HA: {
    gap: 24,
    els: [ln("lab", "CHƯỞNG MÔN:", 34, MUTE, 700), bg("big", "“hả...”", 78, SEC)],
  },
  N2_HOI: {
    gap: 26,
    els: [ln("l0", "Ngài tiếp tục đi kiểm tra.", 44, SEC), ln("l1", "Gặp vị TRƯỞNG LÃO.", 48, TEXT), qt("q0", "“Đạo hữu thấy kế hoạch này\nthế nào?”", 46)],
  },
  N2_IM: {
    gap: 28,
    els: [ln("l0", "Chưởng môn", 46, TEXT), bg("big", "BẮT ĐẦU IM LẶNG.", 64, SEC)],
  },
  N3_HOI: {
    gap: 22,
    els: [
      ln("l0", "Sau đó ngài nhìn sang", 44, SEC),
      bg("big", "PHÒNG DEV.", 64, VIOLET),
      ln("l1", "Một đệ tử đang cúi đầu\ntrước pháp khí.", 42, TEXT),
      ln("lab", "Chưởng môn hỏi:", 32, MUTE, 700),
      qt("q0", "“Ngươi đang tu luyện?”", 48),
    ],
  },
  N3_KINH: {
    gap: 26,
    els: [ln("l0", "Chưởng môn", 46, TEXT), bg("big", "KINH HÃI.", 74, RED), ln("l1", "Ngài lập tức rời khỏi\nphòng Dev.", 44, SEC)],
  },
  N4_HOI: {
    gap: 22,
    els: [
      ln("l0", "Bởi vì bên cạnh…", 44, SEC),
      ln("l1", "Một nữ đệ tử đang ngồi\ntrước bàn trang điểm.", 46, TEXT),
      ln("lab", "Chưởng môn hỏi:", 32, MUTE, 700),
      qt("q0", "“Ngươi đang làm gì?”", 48),
    ],
  },
  N4_CHAN: {
    gap: 28,
    els: [ln("l0", "Chưởng môn", 46, TEXT), bg("big", "LẬP TỨC CHẤN ĐỘNG.", 62, RED)],
  },
  N5_HOI: {
    gap: 26,
    els: [ln("l0", "Đi thêm vài bước…", 44, SEC), ln("l1", "Ngài gặp đệ tử\nphụ trách NHÂN SỰ.", 46, TEXT), qt("q0", "“Tháng này tình hình\nnhân sự thế nào?”", 46)],
  },
  N5_ON: {
    gap: 24,
    els: [ln("lab", "CHƯỞNG MÔN:", 34, MUTE, 700), bg("big", "“Ổn định dữ chưa…”", 62, SEC)],
  },
  N6_HOI: {
    gap: 22,
    els: [
      ln("l0", "Ngài quay sang", 44, SEC),
      bg("big", "PHÒNG SALES.", 64, VIOLET),
      ln("l1", "Một đệ tử đang cầm\npháp khí truyền âm.", 42, TEXT),
      qt("q0", "“Khách hàng đã đồng ý chưa?”", 46),
    ],
  },
  N6_TRAM: {
    gap: 28,
    els: [ln("l0", "Trưởng môn", 46, TEXT), bg("big", "LẬP TỨC TRẦM MẶC.", 62, SEC)],
  },
  N7_HOI: {
    gap: 28,
    els: [ln("l0", "Rồi ngài đi ngang\nphòng KẾ TOÁN.", 46, TEXT), qt("q0", "“Cuối tháng rồi,\ntài chính tông môn thế nào?”", 46)],
  },
  N7_IM: {
    gap: 24,
    els: [ln("lab", "CHƯỞNG MÔN:", 34, MUTE, 700), relBig("lab", "“…”", 14, 86, SEC)],
  },
  KET1: {
    gap: 28,
    els: [ln("l0", "Ngài bắt đầu cảm thấy…", 44, SEC), ln("l1", "Tha Tâm Thông này hình như", 46, TEXT), bg("big", "KHÔNG PHẢI THẦN THÔNG.", 60, VIOLET)],
  },
  KET2: {
    gap: 26,
    els: [ln("l0", "Mà là", 48, SEC), bg("big", "NGHIỆP BÁO.", 100, RED)],
  },
  DD_PAIR: {
    gap: 24,
    els: [ln("lab", "Ngoài miệng:", 34, MUTE, 700), qt("spoken", "“Đệ tử một lòng\nphụng sự tông môn!”", 50, JADE)],
  },
  DD_TRONG: {
    gap: 18,
    els: [
      ln("lab", "TRONG ĐẦU HỌ:", 34, MUTE, 700),
      th("t1", "“Bao giờ tăng lương...”", 44),
      th("t2", "“công ty tuất này\ntôi chan được không...”", 44),
      th("t3", "“ta mà tìm được việc mới\nta chan thằng leader\nngay trong hôm nay...”", 42),
      th("t4", "“lát nữa xem phim gì nhỉ ...”", 44),
    ],
  },
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const spec = SCENES[name];
  const ec = E[name] ?? {};
  return (
    <Stage gap={spec.gap}>
      {spec.els.map((el, i) => {
        if (el.k === "gap") return <div key={i} style={{ height: el.h }} />;
        const e = Math.max(0, (ec[el.key!] ?? 0) + (el.delay ?? 0));
        if (el.k === "skull") return <Skull key={i} e={e} />;
        if (el.k === "icon") return <Icon key={i} e={e} size={el.size}>{el.t}</Icon>;
        if (el.k === "thought") return <Thought key={i} e={e} size={el.size}>{el.t}</Thought>;
        if (el.k === "quote") return <Quote key={i} e={e} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "big") return <Big key={i} e={e} size={el.size} color={el.color}>{el.t}</Big>;
        return <Line key={i} e={e} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
      })}
    </Stage>
  );
};

const Says: React.FC<{ e: number; text: string; color: string; size?: number; dashed?: boolean }> = ({ e, text, color, size = 44, dashed = false }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...fadeUp(f, e),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 700,
        color,
        lineHeight: 1.26,
        border: "2px " + (dashed ? "dashed " : "solid ") + color + (dashed ? "55" : "45"),
        background: color + (dashed ? "0E" : "0F"),
        borderRadius: dashed ? 26 : 20,
        padding: "20px 28px",
        maxWidth: 900,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

const Who: React.FC<{ e: number; children: React.ReactNode }> = ({ e, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...fadeUp(f, e, 10, 12), fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{children}</div>;
};

const Pair: React.FC<{ ec: Record<string, number>; whoA: string; spoken: string; whoB: string; thought: string; aSize?: number; bSize?: number }> = ({
  ec,
  whoA,
  spoken,
  whoB,
  thought,
  aSize = 44,
  bSize = 48,
}) => (
  <Stage gap={20}>
    {whoA ? <Who e={ec.a_who}>{whoA}</Who> : null}
    <Says e={ec.a_text} text={spoken} color={JADE} size={aSize} />
    <div style={{ height: 8 }} />
    <Who e={ec.b_who}>{whoB}</Who>
    <Says e={ec.b_text} text={thought} color={RED} size={bSize} dashed />
    <Skull e={(ec.b_text ?? 0) + 16} />
  </Stage>
);

const PAIRS: Array<[string, string, string, string, string, number, number]> = [
  ["N1_PAIR", "Đệ tử:", "“Đệ tử nguyện ý!”", "Trong đầu hắn:", "“NGUYỆN CÁI ĐẦU TA.”", 46, 54],
  ["N2_PAIR", "Trưởng lão:", "“Bổn tọa thấy rất hợp lý.”", "Trong đầu:", "“KẾ HOẠCH NGU NHẤT\nTA TỪNG NGHE.”", 44, 50],
  ["N3_PAIR", "Đệ tử:", "“Bẩm chưởng môn, đệ tử\nđang xử lý một chút vấn đề.”", "Trong đầu:", "“ĐÉO HIỂU TẠI SAO CODE\nCỦA THẰNG TIỀN NHIỆM\nLẠI CHẠY ĐƯỢC.”", 42, 46],
  ["N4_PAIR", "", "“Bẩm chưởng môn, đệ tử đang\nchuẩn bị tài liệu cho khách hàng.”", "Trong đầu:", "“KHÁCH HÀNG NÀY MÀ SỬA\nTHÊM LẦN NỮA,\nTA SẼ CHAN HẮN.”", 42, 48],
  ["N5_PAIR", "Nữ đệ tử mỉm cười:", "“Rất ổn định ạ.”", "Trong đầu:", "“BA NGƯỜI SẮP NGHỈ,\nHAI NGƯỜI ĐANG PHỎNG VẤN\nCÔNG TY KHÁC,\nCÒN MỘT NGƯỜI CHỈ ĐANG\nCHỜ NHẬN LƯƠNG.”", 46, 42],
  ["N6_PAIR", "Đệ tử:", "“Dạ… khách đang cân nhắc.”", "Trong đầu:", "“NÓ GHOST EM\nGẦN TUẦN NAY RỒI.”", 44, 52],
  ["N7_PAIR", "Kế toán cúi đầu:", "“Bẩm chưởng môn, mọi thứ\nđều trong tầm kiểm soát.”", "Trong đầu:", "“CHƯỞNG MÔN MÀ MUA THÊM\nCÁI GÌ NỮA LÀ\nTHÁNG NÀY ĂN MÌ.”", 42, 46],
];

const Cta: React.FC = () => {
  const e = E.CTA;
  const f = useCurrentFrame();
  return (
    <Stage gap={26}>
      <div
        style={{
          ...pop(f, e.btn, 16),
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
        ▶ FOLLOW BẦN ĐẠO
      </div>
      <Line e={e.l0} size={46}>Để độ kiếp</Line>
      <Big e={e.big} size={72} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

export const ThaTamThong: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("ttt/voice.mp3")} />
    {bgm ? <Audio src={staticFile("ttt/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    {PAIRS.map(([name, whoA, spoken, whoB, thought, aSize, bSize]) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Pair ec={E[name]} whoA={whoA} spoken={spoken} whoB={whoB} thought={thought} aSize={aSize} bSize={bSize} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
    <Sequence from={0} durationInFrames={at("MODAU2").from + at("MODAU2").dur}>
      <HookBanner dur={at("MODAU2").from + at("MODAU2").dur} />
    </Sequence>
    <SeriesTag />
  </AbsoluteFill>
);
