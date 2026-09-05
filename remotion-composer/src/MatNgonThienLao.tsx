import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mntl_beats.json";
import T from "./mntl_timings.json";

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
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 22%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 82%, " + JADE + "12 0%, transparent 62%)" }} />
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
    <div style={{ ...pop(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>{children}</div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 58, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 16),
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
  return <div style={{ ...pop(f, e, 12), fontSize: 76 }}>💀</div>;
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 62, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 14), fontSize: size }}>{children}</div>;
};

const Says: React.FC<{ e: number; who: string; text: string; color: string; size?: number; align?: "flex-start" | "flex-end" }> = ({ e, who, text, color, size = 46, align = "flex-start" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fadeUp(f, e), width: "100%", display: "flex", flexDirection: "column", alignItems: align, gap: 10, textAlign: align === "flex-end" ? "right" : "left" }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{who}</div>
      <div
        style={{
          fontFamily: "Be Vietnam Pro",
          fontSize: size,
          fontWeight: 700,
          color,
          lineHeight: 1.26,
          border: "2px solid " + color + "45",
          background: color + "0F",
          borderRadius: 20,
          padding: "20px 28px",
          maxWidth: 880,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Pair: React.FC<{ ec: Record<string, number>; whoA: string; whoB: string; outside: string; sword: string; swordSize?: number }> = ({ ec, whoA, whoB, outside, sword, swordSize = 56 }) => (
  <Stage gap={26}>
    <Says e={ec.a_who} who={whoA} text={outside} color={SEC} size={44} />
    <div style={{ height: 2 }} />
    <Says e={ec.b_who} who={whoB} text={sword} color={RED} size={swordSize} align="flex-end" />
    <Skull e={(ec.b_who ?? 0) + 18} />
  </Stage>
);

const ChapterHead: React.FC<{ dot: number; q: number; num: string; quote: string; qSize?: number }> = ({ dot, q, num, quote, qSize = 62 }) => {
  const f = useCurrentFrame();
  return (
    <Stage gap={38}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 12, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Quote e={q} size={qSize}>{quote}</Quote>
    </Stage>
  );
};

type El = {
  k: "l" | "big" | "skull" | "gap" | "icon" | "quote";
  key?: string;
  t?: string;
  size?: number;
  color?: string;
  weight?: number;
  delay?: number;
  h?: number;
};

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const rel = (key: string, t: string, delay: number, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, delay, size, color, weight });
const sk = (key: string, delay?: number): El => ({ k: "skull", key, delay });
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const gp = (h = 14): El => ({ k: "gap", h });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  MODAU: { els: [ln("l0", "Tương truyền…", 46), ln("l1", "Trong Công Sở Giới…\ncó một loại mật ngôn.", 48, TEXT)] },
  MODAU2: { els: [ln("l0", "Người ngoài nghe thấy…", 46), ln("l1", "chỉ tưởng là những câu nói\nrất bình thường.", 48, TEXT)] },
  MODAU3: {
    els: [ln("l0", "Nhưng với một nhóm người…", 46), ln("l1", "chỉ cần nghe được một câu…", 46, TEXT), bg("big", "LÀ BIẾT HÔM NAY CÓ BIẾN.", 58, GOLD)],
  },
  MODAU4: { gap: 24, els: [ln("l0", "Người đời gọi đó là…", 46), ic("big", "📜", 72), bg("big", "MẬT NGÔN TÙ TỘI", 74, GOLD)] },
  MODAU5: {
    gap: 26,
    els: [
      ln("l0", "Và đây…", 46),
      ln("l1", "là năm câu mà Thiên Lao nghe xong…", 46, TEXT),
      ln("l2", "đã biết đường về hôm nay…", 46, TEXT),
      bg("big", "HƠI XA.", 86, RED),
    ],
  },

  M1_L1: {
    gap: 22,
    els: [ln("l1", "Mở file.", 54, TEXT, 700), ln("l2", "Tìm.", 54, TEXT, 700), ln("l3", "Đối chiếu.", 54, TEXT, 700), ln("l4", "Lật lại chứng từ.", 54, TEXT, 700)],
  },
  M1_TIM: { els: [ln("l0", "Tìm đến tận dòng cuối…", 46), bg("big", "VẪN KHÔNG THẤY.", 68, RED)] },
  M1_PHAT: { els: [ln("l0", "Đến lúc phát hiện ra…", 46), ln("l1", "nó sai từ", 46, TEXT), bg("big", "THÁNG TRƯỚC.", 76, RED)] },
  M1_LINH: {
    gap: 24,
    els: [
      ln("l0", "Khoảnh khắc ấy…", 44),
      ln("l1", "Thiên Lao lĩnh ngộ:", 44, GOLD, 700),
      ln("l2", "Có những nghiệp…\nkhông tự biến mất.", 48, TEXT),
      bg("big", "NÓ CHỈ CHỜ NGƯƠI TÌM THẤY.", 56, JADE),
    ],
  },

  M2_N1: {
    gap: 22,
    els: [
      ln("n1", "Hồ sơ nằm đó.", 52, TEXT, 700),
      ln("n2", "Khoản tiền nằm đó.", 52, TEXT, 700),
      ln("n3", "Mọi thứ đều nằm đó…", 52, TEXT, 700),
      ln("n3b", "chỉ thiếu đúng MỘT THỨ\nkhông ai biết đang ở đâu.", 46, SEC),
    ],
  },
  M2_HOI: {
    gap: 22,
    els: [
      ln("lab1", "Hỏi người này:", 38, MUTE, 700),
      qt("q1", "“Em chưa nhận được.”", 48),
      ln("lab2", "Hỏi người kia:", 38, MUTE, 700),
      qt("q2", "“Chị tưởng gửi rồi.”", 48),
    ],
  },
  M2_CUOI: { els: [ln("l0", "Cuối cùng…", 46), bg("big", "CẢ TÔNG MÔN CÙNG NHÌN NHAU.", 54, RED)] },
  M2_LINH: {
    gap: 24,
    els: [
      ln("l0", "Khoảnh khắc ấy…", 44),
      ln("l1", "Thiên Lao hiểu được một chân lý:", 44, GOLD, 700),
      ln("l2", "Thứ khó tìm nhất trong Công Sở Giới…\nkhông phải tiền.", 46, TEXT),
      bg("big", "MÀ LÀ NGƯỜI ĐANG GIỮ CHỨNG TỪ.", 52, JADE),
    ],
  },

  M3_SO: {
    gap: 24,
    els: [ln("l0", "Bởi đáng sợ nhất…", 46), ln("l1", "không phải là “sai”.", 48, TEXT), ln("l2", "Mà là…", 46), bg("big", "“HÌNH NHƯ.”", 82, RED)],
  },
  M3_PHUONG: {
    gap: 26,
    els: [ln("l0", "“Sai” còn có phương hướng.", 48, TEXT), ln("l1", "“Hình như”…", 52, RED, 700), bg("big", "LÀ MỘT BÍ CẢNH VÔ TẬN.", 58, GOLD)],
  },
  M3_TRUY: {
    gap: 22,
    els: [ln("lab", "Thiên Lao bắt đầu truy.", 46, GOLD, 700), qt("q1", "Ai nhập?", 50), qt("q2", "Nhập lúc nào?", 50), qt("q3", "Đối chiếu với đâu?", 50)],
  },
  M3_KEO: {
    gap: 20,
    els: [
      ln("l0", "Rồi phát hiện…", 44),
      ln("l1", "một con số sai kéo theo\nmột con số khác.", 44, TEXT),
      ln("l2", "Con số khác kéo theo\nmột bảng khác.", 44, TEXT),
      ln("l3", "Và bảng khác…", 44),
      bg("big", "KÉO NGƯỢC VỀ CÁI FILE\nHÔM QUA VỪA SỬA.", 50, RED),
    ],
  },
  M3_LINH: {
    gap: 24,
    els: [
      ln("l0", "Khoảnh khắc ấy…", 44),
      ln("l1", "ngươi lĩnh ngộ:", 44, GOLD, 700),
      ln("l2", "Một chữ “hình như”…", 48, TEXT),
      bg("big", "CÓ THỂ MỞ RA CẢ MỘT ĐẠI KIẾP.", 54, JADE),
    ],
  },

  M4_D1: {
    gap: 20,
    els: [
      ln("d1", "Một con số đổi.", 50, TEXT, 700),
      ln("d2", "Rồi một dòng đổi.", 50, TEXT, 700),
      ln("d3", "Rồi một chỗ khác lệch.", 50, TEXT, 700),
      ln("d4", "Sửa tiếp.", 50, TEXT, 700),
      ln("d5", "Lại lệch.", 56, RED, 800),
    ],
  },
  M4_QUAY: {
    gap: 24,
    els: [ln("l0", "Đến lúc quay về nhìn bản cũ…", 46), ln("l1", "Thiên Lao chợt nhận ra…", 46, TEXT), bg("big", "CÁI BAN ĐẦU HÌNH NHƯ LẠI ĐÚNG.", 52, RED)],
  },
  M4_LINH: {
    gap: 22,
    els: [
      ln("l0", "Khoảnh khắc ấy…", 44),
      ln("l1", "ngươi lĩnh ngộ:", 44, GOLD, 700),
      ln("l2", "Trong Công Sở Giới…", 46, TEXT),
      bg("big", "“MỘT CHÚT” LÀ ĐƠN VỊ ĐO\nMỨC ĐỘ MẤT NGỦ CỦA KẾ TOÁN.", 48, RED),
      sk("big", 18),
    ],
  },

  M5_G1: {
    gap: 22,
    els: [
      ln("g1", "Những người cả tháng\nchưa gửi chứng từ…\nbắt đầu gửi.", 46, TEXT),
      ln("g2", "Những khoản chưa đối chiếu…\nbắt đầu xuất hiện.", 46, TEXT),
      ln("g3", "Những con số tưởng đã yên ổn…\nbắt đầu LỆCH.", 46, TEXT),
    ],
  },
  M5_UA: {
    gap: 24,
    els: [ln("l0", "Và đâu đó…", 44), ln("l1", "sẽ luôn có một người hỏi:", 44, TEXT), qt("q0", "“ỦA CÁI NÀY THÁNG TRƯỚC\nCHƯA TÍNH HẢ?”", 48, RED)],
  },
  M5_KHONG: {
    gap: 26,
    els: [ln("l0", "Thiên Lao không trả lời.", 48, TEXT), ln("l1", "Bởi họ biết…", 44), bg("big", "CUỐI THÁNG KHÔNG PHẢI NGÀY.", 54, GOLD)],
  },
  M5_LINH: { gap: 26, els: [ln("l0", "Cuối tháng là ngày nghiệp lực…", 48, TEXT), bg("big", "ĐỒNG LOẠT TÌM VỀ CHỦ CŨ.", 60, RED)] },

  KET1: { gap: 26, els: [ln("l0", "Năm câu.", 52, TEXT, 700), bg("big", "NĂM MẬT NGÔN.", 72, GOLD)] },
  KET2: { els: [ln("l0", "Người ngoài nghe thấy…", 46), ln("l1", "chỉ là những câu nói bình thường.", 48, TEXT)] },
  KET3: {
    gap: 26,
    els: [ln("l0", "Còn Thiên Lao Dự Bị Chân Nhân\nnghe thấy…", 46, TEXT), bg("big", "ĐÃ BIẾT THIÊN KIẾP\nSẮP GIÁNG LÂM.", 62, RED)],
  },
  KET4: {
    gap: 24,
    els: [ln("l0", "Bởi trong Công Sở Giới…", 44), ln("l1", "có những người làm việc bằng sức.", 46, TEXT), ln("l2", "Có những người làm việc bằng trí.", 46, TEXT)],
  },
  KET5: { gap: 26, els: [ln("l0", "Còn Thiên Lao…", 48, TEXT), bg("big", "LÀM VIỆC BẰNG CÁCH TÌM XEM\nHÔM NAY CON SỐ NÀO\nMUỐN HẠI MÌNH.", 50, RED)] },
  KET6: { gap: 24, els: [ln("l0", "Đây chính là…", 46), ic("big", "🏯", 70), bg("big", "THIÊN CƠ MẬT NGÔN —\nTHIÊN LAO DỰ BỊ CHÂN NHÂN.", 50, GOLD)] },
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
      <Line e={e.l0} size={46}>để độ kiếp</Line>
      <Big e={e.big} size={72} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

const HEADS: Array<[string, string, string, number]> = [
  ["M1_HEAD", "ĐỆ NHẤT MẬT NGÔN", "“EM ƠI, KIỂM TRA GIÚP CHỊ\nCÁI NÀY VỚI.”", 50],
  ["M2_HEAD", "ĐỆ NHỊ MẬT NGÔN", "“CÁI NÀY THIẾU MỖI\nMỘT CHỨNG TỪ THÔI.”", 52],
  ["M3_HEAD", "ĐỆ TAM MẬT NGÔN", "“CHỊ THẤY SỐ NÀY\nHÌNH NHƯ KHÔNG ĐÚNG.”", 52],
  ["M4_HEAD", "ĐỆ TỨ MẬT NGÔN", "“CHỈ SỬA MỘT CHÚT\nTHÔI EM.”", 58],
  ["M5_HEAD", "ĐỆ NGŨ MẬT NGÔN", "“CUỐI THÁNG MÌNH\nCHỐT SỔ NHÉ.”", 58],
];

const PAIRS: Array<[string, string, string, string, string, number]> = [
  ["M1_PAIR", "NGƯỜI NGOÀI NGHE", "THIÊN LAO NGHE", "“À, kiểm tra một chút thôi.”", "“CÓ MỘT CON SỐ ĐANG SAI.\nNHƯNG BỔN TỌA CHƯA BIẾT\nNÓ SAI Ở ĐÂU.”", 42],
  ["M2_PAIR", "NGƯỜI NGOÀI NGHE", "THIÊN LAO NGHE", "“Một tờ giấy thôi mà.”", "“ĐƯỜNG PHI THĂNG ĐÃ MỞ…\nNHƯNG NGƯƠI QUÊN MANG\nGIẤY THÔNG HÀNH.”", 42],
  ["M3_PAIR", "NGƯỜI NGOÀI NGHE", "THIÊN LAO NGHE", "“Chắc sửa lại là xong.”", "“CÓ DỊ BIẾN.”", 64],
  ["M4_PAIR", "NGƯỜI NGOÀI NGHE", "THIÊN LAO NGHE", "“Có gì đâu, sửa tí là xong.”", "“BỔN TỌA CHỈ MUỐN THAY ĐỔI\nMỘT VIÊN ĐÁ TRONG TRẬN PHÁP.”", 42],
  ["M5_PAIR", "NGƯỜI NGOÀI NGHE", "THIÊN LAO NGHE", "“Ừ, công việc định kỳ thôi.”", "“ĐẠI KIẾP ĐÃ ĐẾN.”", 62],
];

export const MatNgonThienLao: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("mntl/voice.mp3")} />
    {bgm ? <Audio src={staticFile("mntl/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    {HEADS.map(([name, num, quote, qSize]) => {
      const { from, dur } = at(name);
      const e = E[name];
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <ChapterHead dot={e.dot} q={e.q} num={num} quote={quote} qSize={qSize} />
        </Sequence>
      );
    })}
    {PAIRS.map(([name, whoA, whoB, outside, sword, swordSize]) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Pair ec={E[name]} whoA={whoA} whoB={whoB} outside={outside} sword={sword} swordSize={swordSize} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
