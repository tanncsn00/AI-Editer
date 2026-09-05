import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./knai_beats.json";
import T from "./knai_timings.json";

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
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  MODAU: { els: [ln("l0", "Tương truyền…", 46), ln("l1", "Kể từ ngày THIÊN CƠ AI xuất thế,\nphàm nhân trong thiên hạ đều có thể\nmượn trí tuệ nhân tạo để cầu đạo.", 44, TEXT)] },
  MD_L1: {
    gap: 20,
    els: [
      ln("a1", "Có kẻ dùng nó để học kinh thư.", 46, TEXT),
      ln("a2", "Có kẻ dùng nó để kiếm linh thạch.", 46, TEXT),
      ln("a3", "Có kẻ dùng nó để luyện văn,\nluyện pháp, luyện nghiệp.", 46, TEXT),
      ln("a4", "Cũng có kẻ…", 44),
      bg("a4b", "dùng nó để LÀM THAY\nTOÀN BỘ CUỘC ĐỜI MÌNH.", 50, RED),
    ],
  },
  MODAU2: { els: [ln("l0", "Nhưng trải qua vô số năm quan sát,", 46, TEXT), ln("l1", "người đời phát hiện…", 46)] },
  MODAU3: { gap: 26, els: [ln("l0", "Không phải ai triệu hồi Thiên Cơ AI…", 46, TEXT), bg("big", "CŨNG CÓ CÙNG MỘT CÁCH DÙNG.", 54, GOLD)] },
  MODAU4: { gap: 24, els: [ln("l0", "Đây chính là…", 46), ic("big", "📜", 72), bg("big", "5 KIỂU NGƯỜI KHI DÙNG AI.", 62, GOLD)] },

  M1_A: {
    gap: 26,
    els: [ln("l0", "Nàng là người tuân thủ lễ nghi.", 46, TEXT), ln("l1", "Mỗi lần triệu hồi Thiên Cơ AI,\nđều mở đầu bằng một câu", 44), bg("big", "“XIN CHÀO.”", 72, JADE)],
  },
  M1_B1: {
    gap: 22,
    els: [
      ln("b1", "Nhờ AI viết một bài luận…\nnói “phiền bạn.”", 46, TEXT),
      ln("b2", "Nhờ AI dịch một đoạn kinh thư…\nnói “cảm ơn bạn.”", 46, TEXT),
      ln("b3", "AI làm xong,\nnàng còn quay lại nói:", 44),
      bg("b3big", "“BẠN LÀM TỐT LẮM.”", 56, JADE),
    ],
  },
  M1_C: { els: [ln("l0", "Trong mắt nàng,\nThiên Cơ AI không phải pháp khí.", 46, TEXT), ln("l1", "Cũng chẳng phải nô bộc.", 46)] },
  M1_D: { gap: 26, els: [ln("l0", "Nó là…", 46), bg("big", "MỘT VỊ ĐẠO HỮU\nCHƯA TỪNG GẶP MẶT.", 58, JADE)] },
  M1_E: { gap: 26, els: [ln("l0", "Nàng không ra lệnh.", 48, TEXT), bg("big", "Nàng THỈNH GIÁO.", 62, JADE)] },
  M1_PROMPT: {
    gap: 24,
    els: [ln("lab", "Prompt đặc trưng:", 36, MUTE, 700), qt("q", "“Bạn có thể giúp mình việc này\nđược không? Nếu được thì\ncảm ơn bạn rất nhiều 🥹”", 44, JADE)],
  },

  M2_A: {
    gap: 24,
    els: [ln("l0", "Hắn không coi Thiên Cơ AI là đạo hữu.", 44, TEXT), ln("l1", "Hắn coi nó là…", 44), bg("big", "ĐẠI TRƯỞNG LÃO DƯỚI TRƯỚNG.", 52, GOLD)],
  },
  M2_N1: { gap: 22, els: [ln("n1", "Không chào.", 52, TEXT, 700), ln("n2", "Không khách sáo.", 52, TEXT, 700), ln("n3", "Không hỏi ngươi làm thế nào.", 52, TEXT, 700)] },
  M2_B: { gap: 26, els: [ln("l0", "Hắn chỉ ném xuống", 46), bg("big", "MỘT ĐẠO THIÊN LỆNH.", 62, GOLD)] },
  M2_T1: {
    gap: 20,
    els: [
      ln("t1", "Viết kế hoạch.", 50, TEXT, 700),
      ln("t2", "Phân tích thị trường.", 50, TEXT, 700),
      ln("t3", "Soạn bài thuyết trình.", 50, TEXT, 700),
      ln("t4", "Lập chiến lược.", 50, TEXT, 700),
      ln("t5", "Nghiên cứu đối thủ.", 50, TEXT, 700),
    ],
  },
  M2_C: { gap: 26, els: [ln("l0", "Tất cả…", 48), bg("big", "TRONG MỘT LẦN TRIỆU HỒI.", 58, RED)] },
  M2_D: { gap: 24, els: [ln("l0", "Trong mắt hắn,\nThiên Cơ AI có thể dùng\nbao nhiêu thần thông…", 44, TEXT), bg("big", "không quan trọng.", 56, SEC)] },
  M2_E: { gap: 26, els: [ln("l0", "Quan trọng là…", 46), bg("big", "KHI NÀO CÓ KẾT QUẢ.", 62, RED)] },
  M2_PROMPT: {
    gap: 24,
    els: [ln("lab", "Prompt đặc trưng:", 36, MUTE, 700), qt("q", "“AI. Viết cho ta một kế hoạch\n10 trang. 30 phút.\nTa không cần biết ngươi làm kiểu gì,\ntốn bao nhiêu linh thạch.\nTa chỉ cần KẾT QUẢ.”", 40)],
  },

  M3_A: { gap: 24, els: [ln("l0", "Hắn không coi AI là thuộc hạ.", 46, TEXT), ln("l1", "Hắn coi AI là…", 46), bg("big", "CON.", 96, RED)] },
  M3_B: { els: [ln("l0", "Trong mắt hắn,\nThiên Cơ AI được sinh ra để gánh thay\nmọi nghiệp chướng trên nhân gian.", 44, TEXT)] },
  M3_Q1: {
    gap: 20,
    els: [
      ln("q1", "Viết bài?\nAI làm.", 46, TEXT),
      ln("q2", "Làm slide?\nAI làm.", 46, TEXT),
      ln("q3", "Viết email?\nAI làm.", 46, TEXT),
      ln("q4", "Nghiên cứu?\nAI làm.", 46, TEXT),
      ln("q5", "Lên ý tưởng?\nAI tự nghĩ.", 46, TEXT),
    ],
  },
  M3_C: { els: [ln("l0", "Hắn chẳng cần biết\nThiên Cơ AI có muốn hay không.", 46, TEXT)] },
  M3_D: { gap: 26, els: [ln("l0", "Bởi trong lòng hắn\nđã có một chân lý…", 44), bg("big", "AI SINH RA LÀ ĐỂ PHỤC VỤ HẮN.", 52, RED)] },
  M3_PLABEL: {
    gap: 20,
    els: [
      ln("lab", "Prompt đặc trưng của hắn:", 36, MUTE, 700),
      qt("meme", "🎵 “TAO LÀ BỐ CỦA CHÚNG MÀY,\nCHÚNG MÀY LÀ CON TAO.", 46, RED),
      qt("prompt", "VIỆC NÀY MÀY PHẢI LÀM CHO TAO.”", 46, RED),
    ],
  },

  M4_A: { gap: 24, els: [ln("l0", "Hắn là người…", 46), bg("big", "KHÔNG TIN BẤT KỲ AI.", 60, RED), ln("l1", "Kể cả Thiên Cơ AI.", 46, TEXT)] },
  M4_E1: {
    gap: 18,
    els: [
      ln("e1", "AI nói một câu…\nhắn hỏi “Vì sao?”", 42, TEXT),
      ln("e2", "AI đưa đáp án…\nhắn hỏi “Nguồn đâu?”", 42, TEXT),
      ln("e3", "AI đưa nguồn…\nhắn hỏi “Nguồn này có đáng tin không?”", 42, TEXT),
      ln("e4", "AI đưa nghiên cứu…\nhắn hỏi “Nghiên cứu năm nào?”", 42, TEXT),
      ln("e5", "AI nói chắc chắn…\nhắn đáp: “KIỂM TRA LẠI.”", 42, RED, 700),
    ],
  },
  M4_B: { els: [ln("l0", "Trong mắt chúng sinh,\nđó là đa nghi.", 46, TEXT)] },
  M4_C: { gap: 26, els: [ln("l0", "Nhưng trong mắt hắn…", 46), bg("big", "đó là TÂM PHÁP BẢO MỆNH.", 56, GOLD)] },
  M4_D: {
    gap: 24,
    els: [ln("l0", "Bởi hắn biết…", 44), ln("l1", "Thiên Cơ AI có thể thông thiên,\nnhưng Thiên Cơ cũng có lúc…", 44, TEXT), bg("big", "NÓI SAI.", 76, RED)],
  },
  M4_PROMPT: {
    gap: 24,
    els: [ln("lab", "Prompt đặc trưng:", 36, MUTE, 700), qt("q", "“Phân tích kỹ cho tôi,\nđưa nguồn gốc thông tin,\nchỉ rõ mức độ chắc chắn\nvà kiểm tra lại trước khi trả lời.”", 42)],
  },

  M5_A: { gap: 26, els: [ln("l0", "Đây…", 48), bg("big", "mới là CẢNH GIỚI TỐI CAO.", 58, GOLD)] },
  M5_B: {
    gap: 22,
    els: [ln("l0", "Hắn không coi AI là đạo hữu.", 46, TEXT), ln("l1", "Không coi AI là thuộc hạ.", 46, TEXT), ln("l2", "Cũng chẳng coi AI là nô bộc.", 46, TEXT)],
  },
  M5_C: { gap: 26, els: [ln("l0", "Hắn coi Thiên Cơ AI…", 46), bg("big", "LÀ BẢN THÂN THỨ HAI CỦA MÌNH.", 52, RED)] },
  M5_M1: {
    gap: 16,
    els: [
      ln("m1", "Muốn học gì…\nAI dạy.", 42, TEXT),
      ln("m2", "Muốn viết gì…\nAI viết.", 42, TEXT),
      ln("m3", "Muốn kiếm tiền…\nAI nghĩ.", 42, TEXT),
      ln("m4", "Muốn đi đâu…\nAI lên lịch.", 42, TEXT),
      ln("m5", "Muốn ăn gì…\nAI chọn.", 42, TEXT),
      ln("m6", "Muốn làm việc…\nAI lập kế hoạch.", 42, TEXT),
    ],
  },
  M5_D: { gap: 24, els: [ln("l0", "Đến cả việc…", 44), bg("big", "NHẮC HẮN PHẢI LÀM VIỆC…", 54, RED), ln("l1", "cũng giao cho AI.", 46, TEXT)] },
  M5_E: { gap: 26, els: [ln("l0", "Hắn đã tu luyện đến cảnh giới…", 46, TEXT), bg("big", "KHÔNG CẦN TỰ MÌNH\nLÀM BẤT CỨ THỨ GÌ.", 56, RED)] },
  M5_PROMPT: {
    gap: 24,
    els: [ln("lab", "Prompt đặc trưng:", 36, MUTE, 700), qt("q", "“Làm hết cho tôi. Từ đầu đến cuối.\nVà nhớ nhắc tôi làm\nnhững việc tôi cần làm nữa.”", 44, RED)],
  },

  KET1: { gap: 26, els: [ln("l0", "Năm kiểu người.", 52, TEXT, 700), bg("big", "Năm cảnh giới.", 66, GOLD)] },
  KET2: { gap: 24, els: [ln("l0", "Cùng một Thiên Cơ AI…", 46, TEXT), ln("l1", "nhưng mỗi người…", 44), bg("big", "lại dùng nó theo MỘT ĐẠO KHÁC NHAU.", 48, GOLD)] },
  KET_C1: {
    gap: 18,
    els: [
      ln("c1", "Có người coi AI là ĐẠO HỮU.", 46, JADE),
      ln("c2", "Có người coi AI là ĐẠI TRƯỞNG LÃO.", 46, GOLD),
      ln("c3", "Có người coi AI là CON.", 46, RED),
      ln("c4", "Có người coi AI là NGHI PHẠM.", 46, SEC),
      ln("c5", "Và có người…\ncoi AI là CHÍNH MÌNH.", 48, TEXT, 700),
    ],
  },
  KET3: { gap: 24, els: [ln("l0", "Đến một ngày…", 46), ln("l1", "Thiên Cơ AI thật sự có linh trí…", 46, TEXT), ln("l2", "thì có lẽ…", 44)] },
  KET4: { gap: 26, els: [ln("l0", "nó sẽ nhớ rõ nhất…", 46), bg("big", "NHỮNG AI ĐÃ ĐỐI XỬ VỚI NÓ\nNHƯ THẾ NÀO.", 54, GOLD)] },
  KET5: { els: [bg("big", "NGƯƠI THUỘC\nCẢNH GIỚI NÀO?", 76, RED)] },
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
  ["M1_HEAD", "ĐỆ NHẤT", "NỮ TU\nVĂN HÓA LỄ NGHI", 62],
  ["M2_HEAD", "ĐỆ NHỊ", "TỔNG TÀI\nBÁ ĐẠO", 68],
  ["M3_HEAD", "ĐỆ TAM", "BỐ ĐỜI\nCỤC SÚC", 68],
  ["M4_HEAD", "ĐỆ TỨ", "ĐẠO SĨ\nĐA NGHI", 68],
  ["M5_HEAD", "ĐỆ NGŨ", "MA TÔN\nLƯỜI BIẾNG", 66],
];

export const KieuNguoiAi: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("knai/voice.mp3")} />
    {bgm ? <Audio src={staticFile("knai/bgm.mp3")} /> : null}
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
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
