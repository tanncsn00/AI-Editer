import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tcmn_beats.json";
import T from "./tcmn_timings.json";

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

const Says: React.FC<{ e: number; who: string; text: string; color: string; align?: "flex-start" | "flex-end" }> = ({ e, who, text, color, align = "flex-start" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fadeUp(f, e), width: "100%", display: "flex", flexDirection: "column", alignItems: align, gap: 10, textAlign: align === "flex-end" ? "right" : "left" }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{who}</div>
      <div
        style={{
          fontFamily: "Be Vietnam Pro",
          fontSize: 46,
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

const ChapterHead: React.FC<{ dot: number; q: number; num: string; quote: string }> = ({ dot, q, num, quote }) => {
  const f = useCurrentFrame();
  return (
    <Stage gap={38}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 12, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Quote e={q} size={64}>{quote}</Quote>
    </Stage>
  );
};

const Modau: React.FC = () => {
  const e = E.MODAU;
  return (
    <Stage gap={26}>
      <Line e={e.l0}>Tương truyền…</Line>
      <Line e={e.l1} size={62} color={GOLD} weight={800}>trong CÔNG SỞ GIỚI,</Line>
      <Line e={e.l2}>có một loại ngôn ngữ…</Line>
    </Stage>
  );
};

const Modau2: React.FC = () => {
  const e = E.MODAU2;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={50} color={TEXT}>Trưởng lão chỉ cần nói MỘT CÂU,</Line>
      <Line e={e.l1}>đệ tử phía dưới…</Line>
      <Line e={e.l2}>liền tự động hiểu thêm</Line>
      <Big e={e.big} size={76} color={GOLD}>{"BA TẦNG\nNHÂN QUẢ."}</Big>
    </Stage>
  );
};

const Modau3: React.FC = () => {
  const e = E.MODAU3;
  return (
    <Stage gap={34}>
      <Line e={e.top}>Người đời gọi nó là…</Line>
      <Big e={e.big} size={82} color={GOLD}>{"THIÊN CƠ\nMẬT NGÔN."}</Big>
    </Stage>
  );
};

const M1New: React.FC = () => {
  const e = E.M1_NEW;
  return (
    <Stage gap={30}>
      <Says e={e.who} who="NGƯỜI MỚI NHẬP MÔN" text="“Dạ, em rảnh ạ.”" color={JADE} />
      <Skull e={e.say} />
    </Stage>
  );
};

const M1Old: React.FC = () => {
  const e = E.M1_OLD;
  return (
    <Stage gap={30}>
      <Line e={e.l0}>Đệ tử lâu năm vừa nghe…</Line>
      <Big e={e.l1} size={70} color={RED}>{"đạo tâm lập tức\nBÁO ĐỘNG."}</Big>
    </Stage>
  );
};

const M1Reveal: React.FC = () => {
  const e = E.M1_REVEAL;
  return (
    <Stage gap={24}>
      <Line e={e.l0} size={40}>Bởi trong Thiên Cơ Mật Ngôn,</Line>
      <Line e={e.l1} size={50} color={GOLD} weight={800}>“Em có rảnh không?”</Line>
      <Line e={e.l2} size={40}>không phải hỏi ngươi có rảnh.</Line>
      <Line e={e.mid} size={40} color={MUTE}>Mà là…</Line>
      <Big e={e.big} size={62}>{"“NGƯƠI CÓ THỂ\nNHẬN THÊM\nMỘT KIẾP NẠN KHÔNG?”"}</Big>
    </Stage>
  );
};

const M2Ti: React.FC = () => {
  const e = E.M2_TI;
  return (
    <Stage gap={24}>
      <Line e={e.l0} size={50} color={GOLD} weight={800}>Một chữ “tí”…</Line>
      <Line e={e.l1} size={42}>nghe nhẹ tựa hồng mao.</Line>
      <Line e={e.l2} size={48} color={TEXT} weight={700}>Nhưng trong SẾP GIỚI…</Line>
      <Line e={e.l3} size={42}>nó có thể kéo dài từ một canh giờ…</Line>
      <Big e={e.l4} size={62} color={RED}>{"đến tận khi\nMẶT TRỜI ĐỔI CA."}</Big>
    </Stage>
  );
};

const M2Hoi: React.FC = () => {
  const e = E.M2_HOI;
  return (
    <Stage gap={22}>
      <Says e={e.q0} who="NGƯƠI HỎI" text="“Bao giờ cần ạ?”" color={JADE} />
      <div style={{ height: 4 }} />
      <Says e={e.q2} who="TRƯỞNG LÃO ĐÁP" text="“CÀNG SỚM CÀNG TỐT.”" color={GOLD} align="flex-end" />
      <Skull e={e.q3} />
    </Stage>
  );
};

const M2Reveal: React.FC = () => {
  const e = E.M2_REVEAL;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={42}>{"Khoảnh khắc ấy…\nngươi lĩnh ngộ:"}</Line>
      <Line e={e.l2} size={48} color={TEXT} weight={700}>“Tí” không phải đơn vị thời gian.</Line>
      <Big e={e.big} size={74} color={RED}>{"“Tí”…\nlà ĐƠN VỊ\nNGHIỆP LỰC."}</Big>
    </Stage>
  );
};

const M3Two: React.FC = () => {
  const e = E.M3_TWO;
  return (
    <Stage gap={22}>
      <Says e={e.a0} who="NGƯỜI MỚI NGHE" text="“Được tự quyết!”" color={JADE} />
      <Says e={e.b0} who="ĐỆ TỬ LÂU NĂM NGHE" text="“Ta giao quyền…”" color={GOLD} align="flex-end" />
      <Big e={e.b2} size={54}>{"“…nhưng KHÔNG GIAO\nTRÁCH NHIỆM.”"}</Big>
    </Stage>
  );
};

const M3Loop: React.FC = () => {
  const e = E.M3_LOOP;
  const f = useCurrentFrame();
  const Row: React.FC<{ ec: number; er: number; cond: string; resp: string }> = ({ ec, er, cond, resp }) => (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...fadeUp(f, ec), fontFamily: "Be Vietnam Pro", fontSize: 38, fontWeight: 600, color: SEC, textAlign: "left" }}>{cond}</div>
      <div style={{ ...fadeUp(f, er, 12, 14), fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 800, color: GOLD, textAlign: "left", paddingLeft: 30, borderLeft: "3px solid " + GOLD + "55" }}>{resp}</div>
    </div>
  );
  return (
    <Stage gap={34}>
      <Row ec={e.r0} er={e.s0} cond="Làm ĐÚNG ý Trưởng lão:" resp="“Ừ, tốt.”" />
      <Row ec={e.r1} er={e.s1} cond="Làm KHÁC ý Trưởng lão:" resp="“Anh nghĩ em nên hỏi anh trước.”" />
      <Row ec={e.r2} er={e.s2} cond="Hỏi trước:" resp="“Anh bảo em chủ động mà?”" />
    </Stage>
  );
};

const M3End: React.FC = () => {
  const e = E.M3_END;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={46}>Trưởng lão im lặng.</Line>
      <Line e={e.l1} size={46}>Ngươi cũng im lặng.</Line>
      <Line e={e.l2} size={42} color={MUTE}>Đạo tâm…</Line>
      <Big e={e.big} size={84}>NỨT BA ĐƯỜNG.</Big>
    </Stage>
  );
};

const M4Dien: React.FC = () => {
  const e = E.M4_DIEN;
  return (
    <Stage gap={20}>
      <Line e={e.l0} size={40}>Khoảnh khắc câu này truyền xuống…</Line>
      <Line e={e.l1} size={40}>toàn bộ tu sĩ trong đại điện…</Line>
      <Line e={e.l2} size={44} color={TEXT} weight={700}>đồng loạt nhìn nhau.</Line>
      <div style={{ height: 10 }} />
      <Line e={e.l3} size={40}>Bởi người nói câu này…</Line>
      <Line e={e.l4} size={40}>thường là người…</Line>
      <Big e={e.big} size={68}>{"KHÔNG PHẢI\nNGƯỜI LÀM."}</Big>
    </Stage>
  );
};

const M4Doc: React.FC = () => {
  const e = E.M4_DOC;
  const f = useCurrentFrame();
  const Step: React.FC<{ ee: number; txt: string; hot?: boolean }> = ({ ee, txt, hot }) => (
    <div style={{ ...fadeUp(f, ee, 12, 16), fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: hot ? 800 : 600, color: hot ? RED : TEXT, textAlign: "left", width: "100%" }}>{txt}</div>
  );
  return (
    <Stage gap={18}>
      <Says e={e.l0} who="TRƯỞNG LÃO PHẤT TAY" text="“Em cứ thử làm đi.”" color={GOLD} />
      <div style={{ height: 12 }} />
      <Step ee={e.c0} txt="Ngươi mở task." />
      <Step ee={e.c1} txt="Đọc yêu cầu." />
      <Step ee={e.c2} txt="Đọc lại lần hai." />
      <Step ee={e.c3} txt="Đọc lần ba." hot />
    </Stage>
  );
};

const M4Reveal: React.FC = () => {
  const e = E.M4_REVEAL;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={42}>Cuối cùng lĩnh ngộ:</Line>
      <Line e={e.l1} size={56} color={GOLD} weight={800}>“Không khó…”</Line>
      <Big e={e.big} size={60} color={RED}>{"là cảnh giới mà chỉ\nNGƯỜI ĐỨNG NGOÀI\nmới đạt được."}</Big>
    </Stage>
  );
};

const M5Doi: React.FC = () => {
  const e = E.M5_DOI;
  const f = useCurrentFrame();
  const Item: React.FC<{ ee: number; txt: string; hot?: boolean }> = ({ ee, txt, hot }) => (
    <div
      style={{
        ...fadeUp(f, ee, 10, 14),
        fontFamily: "Be Vietnam Pro",
        fontSize: 46,
        fontWeight: hot ? 800 : 700,
        color: hot ? RED : TEXT,
        textAlign: "left",
        width: "100%",
      }}
    >
      {txt}
    </div>
  );
  return (
    <Stage gap={14}>
      <Says e={e.l0} who="ĐỆ TỬ NGHE XONG" text="“Dạ.”" color={JADE} />
      <div style={{ ...fadeUp(f, e.l1), width: "100%", textAlign: "left", fontFamily: "Be Vietnam Pro", fontSize: 38, fontWeight: 500, color: MUTE }}>Mở file.</div>
      <div style={{ height: 8 }} />
      <Item ee={e.d0} txt="Đổi headline." />
      <Item ee={e.d1} txt="Đổi layout." />
      <Item ee={e.d2} txt="Đổi màu." />
      <Item ee={e.d3} txt="Đổi logic." />
      <Item ee={e.d4} txt="Đổi flow." hot />
      <Item ee={e.d5} txt="Đổi luôn cả phương án ban đầu." hot />
    </Stage>
  );
};

const M5Reveal: React.FC = () => {
  const e = E.M5_REVEAL;
  return (
    <Stage gap={24}>
      <Line e={e.l0} size={42}>Ba canh giờ sau…</Line>
      <Line e={e.l1} size={42}>ngươi nhìn thành quả.</Line>
      <Line e={e.l2} size={46} color={TEXT} weight={700}>Đây không còn là “sửa một chút”.</Line>
      <Line e={e.mid} size={40} color={MUTE}>Đây là…</Line>
      <Big e={e.big} size={60}>{"MỘT PHIÊN BẢN KHÁC\nCỦA VŨ TRỤ."}</Big>
    </Stage>
  );
};

const Ket: React.FC = () => {
  const e = E.KET;
  const f = useCurrentFrame();
  return (
    <Stage gap={22}>
      <div style={{ ...pop(f, e.l0, 14), fontSize: 60 }}>🏯</div>
      <Line e={e.l0} size={54} color={GOLD} weight={800}>Năm câu. Năm mật ngôn.</Line>
      <div style={{ height: 6 }} />
      <Line e={e.l1} size={40}>Người ngoài nghe thấy…</Line>
      <Line e={e.l2} size={40}>chỉ tưởng là lời nói bình thường.</Line>
      <div style={{ height: 6 }} />
      <Line e={e.l3} size={40}>Còn tu sĩ công sở nghe thấy…</Line>
      <Line e={e.l4} size={40} color={MUTE}>đã biết…</Line>
      <Big e={e.big} size={66}>{"THIÊN KIẾP\nSẮP GIÁNG LÂM."}</Big>
    </Stage>
  );
};

const Cta: React.FC = () => {
  const e = E.CTA;
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Line e={e.top} size={42}>Đây chính là…</Line>
      <Big e={e.big} size={76} color={GOLD}>{"THIÊN CƠ\nMẬT NGÔN."}</Big>
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
      <Line e={e.sub} size={38} color={SEC}>để độ kiếp mỗi ngày</Line>
    </Stage>
  );
};

export const ThienCoMatNgon: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const S: Array<[string, React.FC]> = [
    ["MODAU", Modau],
    ["MODAU2", Modau2],
    ["MODAU3", Modau3],
    ["M1_NEW", M1New],
    ["M1_OLD", M1Old],
    ["M1_REVEAL", M1Reveal],
    ["M2_TI", M2Ti],
    ["M2_HOI", M2Hoi],
    ["M2_REVEAL", M2Reveal],
    ["M3_TWO", M3Two],
    ["M3_LOOP", M3Loop],
    ["M3_END", M3End],
    ["M4_DIEN", M4Dien],
    ["M4_DOC", M4Doc],
    ["M4_REVEAL", M4Reveal],
    ["M5_DOI", M5Doi],
    ["M5_REVEAL", M5Reveal],
    ["KET", Ket],
    ["CTA", Cta],
  ];
  const HEADS: Array<[string, string, string]> = [
    ["M1_HEAD", "ĐỆ NHẤT MẬT NGÔN", "“EM CÓ RẢNH KHÔNG?”"],
    ["M2_HEAD", "ĐỆ NHỊ MẬT NGÔN", "“EM XEM GIÚP ANH TÍ.”"],
    ["M3_HEAD", "ĐỆ TAM MẬT NGÔN", "“EM CỨ CHỦ ĐỘNG ĐI.”"],
    ["M4_HEAD", "ĐỆ TỨ MẬT NGÔN", "“ANH NGHĨ CÁI NÀY\nKHÔNG KHÓ ĐÂU.”"],
    ["M5_HEAD", "ĐỆ NGŨ MẬT NGÔN", "“CHỈ SỬA MỘT CHÚT THÔI.”"],
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      <Audio src={staticFile("tcmn/voice.mp3")} />
      {bgm ? <Audio src={staticFile("tcmn/bgm.mp3")} /> : null}
      {S.map(([name, C]) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <C />
          </Sequence>
        );
      })}
      {HEADS.map(([name, num, quote]) => {
        const { from, dur } = at(name);
        const e = E[name];
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <ChapterHead dot={e.dot} q={e.q} num={num} quote={quote} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
