import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mncn_beats.json";
import T from "./mncn_timings.json";

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

const QaRow: React.FC<{ eq: number; ea: number; q: string; a: string }> = ({ eq, ea, q, a }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <div style={{ ...fadeUp(f, eq), fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 700, color: TEXT, lineHeight: 1.22 }}>{q}</div>
      <div style={{ ...pop(f, ea, 7), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 900, color: RED, lineHeight: 1.18 }}>{a}</div>
    </div>
  );
};

const ChapterHead: React.FC<{ dot: number; q: number; num: string; quote: string; qSize?: number }> = ({ dot, q, num, quote, qSize = 58 }) => {
  const f = useCurrentFrame();
  return (
    <Stage gap={38}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 32, fontWeight: 700, color: GOLD, letterSpacing: 5 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 7, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
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
const sk = (key: string, delay?: number): El => ({ k: "skull", key, delay });
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  MODAU: {
    gap: 28,
    els: [ln("l0", "Nếu đồng nghiệp nói với ngươi\n5 câu này…", 48, TEXT), bg("big", "CHẠY.", 130, RED)],
  },
  MODAU2: {
    gap: 26,
    els: [
      ln("l0", "Không phải vì hắn muốn nhờ.", 48, TEXT),
      ln("l1", "Mà vì…", 46),
      bg("big", "HẮN ĐANG TÌM CHỦ NHÂN MỚI\nCHO NGHIỆP LỰC CỦA MÌNH.", 54, GOLD),
    ],
  },

  M1_TIEN: {
    gap: 26,
    els: [ln("l0", "Tiện?", 56, TEXT, 700), ln("l1", "Ủa…", 46), bg("big", "TIỆN CHO AI?", 88, RED)],
  },
  M1_QUA: {
    gap: 24,
    els: [
      ln("l0", "Ngươi chỉ định đi ngang qua.", 46, TEXT),
      ln("l1", "Hắn tiện miệng một câu…", 46),
      bg("big", "NGƯƠI TIỆN TAY NHẬN LUÔN\nMỘT CÁI TASK.", 56, RED),
    ],
  },
  M1_REVEAL: {
    gap: 24,
    els: [ln("l0", "Đây chính là…", 46), ic("icon", "⚔️", 70), bg("big", "TIỆN THỦ\nCHUYỂN NGHIỆP ĐẠI PHÁP", 62, GOLD)],
  },

  M2_DUNG: {
    gap: 24,
    els: [
      ln("l0", "Đúng.", 54, TEXT, 700),
      ln("l1", "Tao làm nhanh hơn.", 50, TEXT, 700),
      bg("big", "VÌ TAO ĐÃ LÀM 38 LẦN RỒI,\nSƯ PHỤ.", 56, JADE),
    ],
  },
  M2_KHEN: {
    gap: 24,
    els: [
      ln("l0", "Ngươi tưởng hắn đang khen ngươi?", 46, TEXT),
      ln("l1", "Không.", 56, RED, 800),
      ln("l2", "Đây là…", 44),
      bg("big", "⚔️ MƯỢN TU VI ĐẠI PHÁP", 58, GOLD),
    ],
  },
  M2_END: {
    gap: 26,
    els: [ln("l0", "Tu vi của hắn không tăng.", 48, TEXT), ln("l1", "Nhưng workload của ngươi…", 46), bg("big", "PHI THĂNG.", 96, RED)],
  },

  M3_DONVI: {
    gap: 24,
    els: [
      ln("l0", "“Một chút”…", 54, TEXT, 700),
      ln("l1", "Trong CÔNG SỞ GIỚI…", 46),
      bg("big", "LÀ ĐƠN VỊ ĐO LƯỜNG\nKHÔNG ĐƯỢC PHÁP LUẬT\nCÔNG NHẬN.", 52, RED),
    ],
  },
  M3_LIST: {
    gap: 20,
    els: [
      qt("q1", "“Check giúp mình một chút.”", 46),
      qt("q2", "“Fix giúp mình một chút.”", 46),
      qt("q3", "“Làm hộ mình một chút.”", 46),
    ],
  },
  M3_END: {
    gap: 22,
    els: [
      ln("l0", "Ba tiếng sau…", 46),
      ln("l1", "ngươi nhìn lại task.", 48, TEXT),
      ln("l2", "Ủa?", 62, RED, 800),
      bg("big", "“SAO TÊN NGƯỜI THỰC HIỆN\nLẠI LÀ MÌNH?”", 52, RED),
    ],
  },

  M4_TINH: {
    gap: 24,
    els: [
      ln("l0", "Á à…", 50, TEXT, 700),
      bg("big", "⚔️ TÌNH ĐỒNG MÔN", 66, GOLD),
      ln("l1", "Một trong những tuyệt kỹ\nđạo đức cao nhất Công Sở Giới.", 44),
    ],
  },
  M4_GIU: {
    gap: 26,
    els: [ln("l0", "Đồng nghiệp giữ được deadline.", 48, TEXT), ln("l1", "Ngươi giữ được…", 46), bg("big", "MỘT CỤC NGHIỆP.", 76, RED)],
  },
  M4_PUNCH: {
    gap: 24,
    els: [ln("l0", "Teamwork kiểu này…", 48, TEXT), bg("big", "TEAM hưởng,\nWORK ngươi làm.", 72, RED), sk("big", 20)],
  },

  M5_REVEAL: {
    gap: 24,
    els: [ln("l0", "Nhưng hắn đã thành công thi triển…", 46), ic("icon", "⚡", 74), bg("big", "NHẤT NIỆM\nCHUYỂN NGHIỆP!", 80, RED)],
  },
  M5_LIST: {
    gap: 20,
    els: [
      ln("l1", "Một câu nói.", 52, TEXT, 700),
      ln("l2", "Một cú ping.", 52, TEXT, 700),
      ln("l3", "Một cái tag.", 52, TEXT, 700),
      bg("big", "NGHIỆP LỰC LẬP TỨC NHẬP THỂ.", 52, RED),
    ],
  },
  M5_PUNCH: {
    gap: 22,
    els: [
      ln("l0", "Và đáng sợ nhất…", 46),
      ln("l1", "ngươi còn trả lời:", 46, TEXT),
      qt("q", "“Ok.”", 76, TEXT),
      bg("big", "ĐẠO TÂM VỠ VỤN.", 72, RED),
      sk("big", 16),
    ],
  },

  KET1: {
    gap: 22,
    els: [
      ln("l0", "Nhưng nhớ kỹ.", 48, TEXT, 700),
      ln("l1", "Giúp đồng môn…", 46),
      bg("big1", "KHÔNG SAI.", 74, JADE),
      ln("l2", "Sai là…", 46),
      bg("big2", "NHẬN TASK MÀ KHÔNG HỎI RÕ\nMÌNH ĐANG NHẬN CÁI GÌ.", 50, RED),
    ],
  },
  KET2: {
    gap: 20,
    els: [
      ln("l0", "Lần sau cứ hỏi:", 46, GOLD, 700),
      qt("q1", "“Phần nào?”", 50, JADE),
      qt("q2", "“Deadline nào?”", 50, JADE),
      qt("q3", "“Anh/chị vẫn phụ trách phần nào?”", 44, JADE),
    ],
  },
  KET3: {
    gap: 20,
    els: [
      ln("l0", "Nếu đối phương bắt đầu…", 46),
      qt("q1", "“À thì…”", 50, RED),
      qt("q2", "“Cũng không hẳn…”", 50, RED),
      qt("q3", "“Em cứ làm trước đi…”", 50, RED),
    ],
  },
  KET4: {
    gap: 26,
    els: [bg("big0", "CHÚC MỪNG.", 80, JADE), ln("l0", "Ngươi vừa phát hiện…", 46), bg("big", "MỘT QUẢ NGHIỆP\nĐANG TÌM CHỦ.", 62, RED)],
  },
  KET5: {
    gap: 20,
    els: [
      ic("icon", "🏯", 64),
      ln("l0", "Trong Công Sở Giới…", 46),
      ln("l1", "người tu vi cao\nkhông phải người làm được tất cả.", 46, TEXT),
      ln("l2", "Mà là người…", 46),
      ln("l3", "nhìn thấy nghiệp lực đang bay tới", 48, GOLD, 700),
      bg("big", "NÉ.", 150, JADE),
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
        if (el.k === "quote") return <Quote key={i} e={e} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "icon") return <Icon key={i} e={e} size={el.size}>{el.t}</Icon>;
        if (el.k === "big") return <Big key={i} e={e} size={el.size} color={el.color}>{el.t}</Big>;
        return <Line key={i} e={e} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
      })}
    </Stage>
  );
};

const Dialog: React.FC = () => {
  const ec = E.M4_DIALOG;
  return (
    <Stage gap={30}>
      <Says e={ec.a_who} who="NGƯƠI TỪ CHỐI" text={"“Team mà…”"} color={SEC} size={50} />
      <div style={{ height: 2 }} />
      <Says e={ec.b_who} who="NGƯƠI NHẬN" text={"“Cảm ơn bro ❤️”"} color={GOLD} size={50} align="flex-end" />
    </Stage>
  );
};

const Hoi: React.FC = () => {
  const ec = E.M5_HOI;
  return (
    <Stage gap={30}>
      <QaRow eq={ec.q1} ea={ec.a1} q="Việc khác là việc gì?" a="→ Không biết." />
      <QaRow eq={ec.q2} ea={ec.a2} q="Deadline?" a="→ Không biết." />
      <QaRow eq={ec.q3} ea={ec.a3} q="Tại sao tao phải làm?" a="→ Càng không biết." />
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
        ▶ FOLLOW BẦN ĐẠO
      </div>
      <Line e={e.l0} size={46}>để độ kiếp</Line>
      <Big e={e.big} size={72} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

const HEADS: Array<[string, string, string, number]> = [
  ["M1_HEAD", "ĐỆ NHẤT CẢNH", "“TIỆN THÌ LÀM GIÚP MÌNH\nCÁI NÀY NHÉ.”", 52],
  ["M2_HEAD", "ĐỆ NHỊ CẢNH", "“BẠN LÀM CÁI NÀY\nNHANH HƠN MÌNH MÀ.”", 52],
  ["M3_HEAD", "ĐỆ TAM CẢNH", "“BẠN HỖ TRỢ MÌNH\nMỘT CHÚT THÔI.”", 54],
  ["M4_HEAD", "ĐỆ TỨ CẢNH", "“TEAM MÀ,\nGIÚP NHAU THÔI.”", 58],
  ["M5_HEAD", "ĐỆ NGŨ CẢNH — ĐẠI KIẾP", "“BẠN LÀM LUÔN CÁI NÀY NHÉ,\nMÌNH ĐANG BẬN VIỆC KHÁC.”", 46],
];

export const MatNgonChuyenNghiep: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("mncn/voice.mp3")} />
    {bgm ? <Audio src={staticFile("mncn/bgm.mp3")} /> : null}
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
    <Sequence from={at("M4_DIALOG").from} durationInFrames={at("M4_DIALOG").dur}>
      <Dialog />
    </Sequence>
    <Sequence from={at("M5_HOI").from} durationInFrames={at("M5_HOI").dur}>
      <Hoi />
    </Sequence>
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
