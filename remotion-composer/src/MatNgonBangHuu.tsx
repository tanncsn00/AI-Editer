import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mnbh_beats.json";
import T from "./mnbh_timings.json";

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

const Pair: React.FC<{ ec: Record<string, number>; outside: string; friend: string; friendSize?: number }> = ({ ec, outside, friend, friendSize = 58 }) => (
  <Stage gap={26}>
    <Says e={ec.a_who} who="NGƯỜI NGOÀI NGHE" text={outside} color={SEC} size={44} />
    <div style={{ height: 2 }} />
    <Says e={ec.b_who} who="BẰNG HỮU NGHE" text={friend} color={RED} size={friendSize} align="flex-end" />
    <Skull e={ec.skull} />
  </Stage>
);

const ChapterHead: React.FC<{ dot: number; q: number; num: string; quote: string }> = ({ dot, q, num, quote }) => {
  const f = useCurrentFrame();
  return (
    <Stage gap={38}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 12, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Quote e={q} size={62}>{quote}</Quote>
    </Stage>
  );
};

const Modau: React.FC = () => {
  const e = E.MODAU;
  return (
    <Stage gap={26}>
      <Line e={e.l0}>Tương truyền…</Line>
      <Line e={e.l1} size={62} color={GOLD} weight={800}>trong CÔNG SỞ GIỚI,</Line>
      <Line e={e.l2}>có một loại quan hệ…</Line>
      <Line e={e.l3} size={54} color={TEXT} weight={800}>không ghi trong HỢP ĐỒNG.</Line>
    </Stage>
  );
};

const Modau2: React.FC = () => {
  const e = E.MODAU2;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={50}>Không cùng huyết thống.</Line>
      <Big e={e.big} size={72} color={JADE}>{"Nhưng lại cùng\nMỘT TÔNG MÔN."}</Big>
    </Stage>
  );
};

const Modau3: React.FC = () => {
  const e = E.MODAU3;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={50}>Ngày ngày cùng nhau tu luyện.</Line>
      <Big e={e.big} size={76} color={RED}>{"Cùng nhau\nCHỊU KIẾP."}</Big>
    </Stage>
  );
};

const Modau4: React.FC = () => {
  const e = E.MODAU4;
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Line e={e.top}>Người đời gọi đó là…</Line>
      <div style={{ ...pop(f, e.big, 14), fontSize: 62 }}>📜</div>
      <Big e={e.big} size={82} color={GOLD}>{"MẬT NGÔN\nBẰNG HỮU."}</Big>
    </Stage>
  );
};

const M1Reveal: React.FC = () => {
  const e = E.M1_REVEAL;
  return (
    <Stage gap={24}>
      <Line e={e.l0} size={46}>Không cần biết chuyện gì.</Line>
      <Line e={e.l1} size={46}>Không cần biết ai.</Line>
      <div style={{ height: 8 }} />
      <Line e={e.mid} size={44} color={MUTE}>Chỉ cần biết…</Line>
      <Big e={e.big} size={80} color={RED}>{"DRAMA\nĐANG Ở ĐÂU."}</Big>
    </Stage>
  );
};

const M2Reveal: React.FC = () => {
  const e = E.M2_REVEAL;
  return (
    <Stage gap={20}>
      <Line e={e.l0} size={48} color={TEXT}>Một bữa cơm.</Line>
      <Line e={e.l1} size={48} color={TEXT}>Ba món ăn.</Line>
      <Big e={e.big1} size={66} color={GOLD}>{"BỐN TẦNG NHÂN QUẢ."}</Big>
      <div style={{ height: 10 }} />
      <Line e={e.l2} size={42}>Và một vị Trưởng lão…</Line>
      <Big e={e.big2} size={58} color={RED}>{"lại trở thành\nCHỦ ĐỀ LUẬN ĐẠO."}</Big>
    </Stage>
  );
};

const M3Mat: React.FC = () => {
  const e = E.M3_MAT;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={46}>Khoảnh khắc này…</Line>
      <Big e={e.big} size={72} color={JADE}>{"ngươi đã bước vào\nMẬT CẢNH."}</Big>
    </Stage>
  );
};

const M3Truyen: React.FC = () => {
  const e = E.M3_TRUYEN;
  return (
    <Stage gap={24}>
      <Line e={e.l0} size={44}>Bởi bí mật của Bằng Hữu…</Line>
      <Line e={e.l1} size={48} color={TEXT} weight={700}>{"không bao giờ được\ntruyền trong group."}</Line>
      <div style={{ height: 8 }} />
      <Line e={e.mid} size={42} color={MUTE}>Nó được truyền bằng…</Line>
      <Big e={e.big} size={74} color={GOLD}>{"MẬT TRUYỀN ÂM."}</Big>
    </Stage>
  );
};

const M3Lan: React.FC = () => {
  const e = E.M3_LAN;
  return (
    <Stage gap={20}>
      <Line e={e.l0} size={48} color={TEXT}>Người thứ ba biết.</Line>
      <Line e={e.l1} size={48} color={TEXT}>Người thứ tư biết.</Line>
      <div style={{ height: 10 }} />
      <Line e={e.mid} size={42} color={MUTE}>Đến cuối ngày…</Line>
      <Big e={e.big} size={68} color={RED}>{"cả tông môn\nđều biết."}</Big>
      <Skull e={e.skull} />
    </Stage>
  );
};

const M3Reveal: React.FC = () => {
  const e = E.M3_REVEAL;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={48} color={TEXT}>Bằng hữu không làm lộ bí mật.</Line>
      <div style={{ height: 8 }} />
      <Line e={e.mid} size={44} color={MUTE}>Bằng hữu chỉ…</Line>
      <Big e={e.big} size={72} color={JADE}>{"giúp bí mật\nPHI THĂNG."}</Big>
    </Stage>
  );
};

const M4Dung: React.FC = () => {
  const e = E.M4_DUNG;
  const f = useCurrentFrame();
  const Item: React.FC<{ ee: number; txt: string }> = ({ ee, txt }) => (
    <div style={{ ...fadeUp(f, ee, 12, 16), fontFamily: "Be Vietnam Pro", fontSize: 52, fontWeight: 800, color: TEXT, textAlign: "left", width: "100%", paddingLeft: 26, borderLeft: "3px solid " + RED + "66" }}>{txt}</div>
  );
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={44}>Khoảnh khắc này…</Line>
      <div style={{ height: 6 }} />
      <Item ee={e.l1} txt="đừng hỏi đúng sai." />
      <Item ee={e.l2} txt="Đừng hỏi đầu đuôi." />
      <Item ee={e.l3} txt="Đừng hỏi ai gây chuyện." />
    </Stage>
  );
};

const M4Phe: React.FC = () => {
  const e = E.M4_PHE;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={50} color={TEXT} weight={700}>{"Bởi Bằng Hữu đã\nXUẤT QUAN."}</Line>
      <Big e={e.big} size={88} color={RED}>{"PHE ĐÃ CHỌN."}</Big>
      <Skull e={e.skull} />
    </Stage>
  );
};

const M4Reveal: React.FC = () => {
  const e = E.M4_REVEAL;
  return (
    <Stage gap={18}>
      <Line e={e.l0} size={48} color={TEXT}>Sai thì cùng chịu.</Line>
      <Line e={e.l1} size={48} color={TEXT}>Đúng thì cùng cãi.</Line>
      <Line e={e.l2} size={44} color={MUTE}>Có biến…</Line>
      <Line e={e.l3} size={52} color={JADE} weight={800}>cùng nhau chạy.</Line>
      <div style={{ height: 12 }} />
      <Line e={e.mid} size={42} color={MUTE}>Đây chính là…</Line>
      <Big e={e.big} size={72} color={GOLD}>{"HỘ ĐẠO\nCHI THUẬT."}</Big>
    </Stage>
  );
};

const M5Gio: React.FC = () => {
  const e = E.M5_GIO;
  const f = useCurrentFrame();
  return (
    <Stage gap={30}>
      <div
        style={{
          ...pop(f, e.big1, 14),
          fontFamily: "JetBrains Mono",
          fontSize: 106,
          fontWeight: 700,
          color: RED,
          letterSpacing: -2,
          textShadow: "0 0 50px " + RED + "55",
        }}
      >
        5:59
      </div>
      <Line e={e.l0} size={46}>Cả tông môn đã phi thăng.</Line>
      <Big e={e.big2} size={64} color={JADE}>{"Chỉ còn HAI NGƯỜI\ntrong đại điện."}</Big>
    </Stage>
  );
};

const M5Hai: React.FC = () => {
  const e = E.M5_HAI;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={48} color={TEXT}>Một người chưa xong việc.</Line>
      <div style={{ height: 6 }} />
      <Line e={e.l1} size={44}>Một người vốn đã xong từ lâu…</Line>
      <Big e={e.big} size={72} color={JADE}>{"nhưng vẫn\nNGỒI LẠI."}</Big>
    </Stage>
  );
};

const M5Reveal: React.FC = () => {
  const e = E.M5_REVEAL;
  return (
    <Stage gap={22}>
      <Line e={e.l0} size={48} color={TEXT}>Không phải vì KPI.</Line>
      <Line e={e.l1} size={48} color={TEXT}>Không phải vì tiền.</Line>
      <div style={{ height: 10 }} />
      <Line e={e.mid} size={42} color={MUTE}>Mà bởi…</Line>
      <Line e={e.l2} size={46} color={SEC}>bằng hữu độ kiếp một mình…</Line>
      <Big e={e.big} size={64} color={JADE}>{"thì còn gì\nlà bằng hữu."}</Big>
    </Stage>
  );
};

const M6Nhan: React.FC = () => {
  const e = E.M6_NHAN;
  return (
    <Stage gap={22}>
      <Line e={e.l0} size={48} color={TEXT}>Không cần cảm ơn.</Line>
      <Line e={e.l1} size={48} color={TEXT}>Không cần khách sáo.</Line>
      <div style={{ height: 10 }} />
      <Line e={e.l2} size={56} color={GOLD} weight={800}>Cứ nhận lấy.</Line>
      <Big e={e.l3} size={62} color={RED}>Mai còn đi làm.</Big>
    </Stage>
  );
};

const M6Reveal: React.FC = () => {
  const e = E.M6_REVEAL;
  const f = useCurrentFrame();
  return (
    <Stage gap={20}>
      <div style={{ ...pop(f, e.l0, 14), fontSize: 56 }}>🏯</div>
      <Line e={e.l0} size={44}>Bởi trong Công Sở Giới…</Line>
      <div style={{ height: 6 }} />
      <Line e={e.l1} size={46} color={TEXT} weight={700}>{"Bằng Hữu chân chính\nkhông chỉ cùng ngươi…"}</Line>
      <Big e={e.big1} size={70} color={JADE}>ĐỘ KIẾP.</Big>
      <div style={{ height: 8 }} />
      <Line e={e.l2} size={44}>Hắn còn phải đảm bảo…</Line>
      <Big e={e.big2} size={50} color={GOLD}>{"ngươi có PHÁP BẢO\nđể uống cà phê\ntrong lúc độ kiếp."}</Big>
    </Stage>
  );
};

const PANEL_H = 1040;

const ProductPanel: React.FC<{ rate: number }> = ({ rate }) => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: PANEL_H, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("mnbh/product.mp4")}
        playbackRate={rate}
        muted
        style={{ width: 1080, height: PANEL_H, objectFit: "cover" }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        top: PANEL_H,
        left: 0,
        width: 1080,
        height: 3,
        background: "linear-gradient(90deg, transparent, " + GOLD + "AA, transparent)",
      }}
    />
  </>
);

const TextBelow: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 20 }) => (
  <div
    style={{
      position: "absolute",
      top: PANEL_H,
      left: 0,
      width: 1080,
      height: 1920 - PANEL_H,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap,
      padding: "0 74px",
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

const M6Bao1: React.FC = () => {
  const e = E.M6_BAO1;
  return (
    <AbsoluteFill>
      <ProductPanel rate={0.763} />
      <TextBelow gap={18}>
        <Line e={e.l0} size={40}>Pháp bảo này, phàm trần gọi là</Line>
        <Big e={e.big} size={58} color={GOLD}>{"BÌNH GIỮ NHIỆT\nINOX 316."}</Big>
        <Line e={e.l1} size={48} color={TEXT} weight={800}>800ml —</Line>
        <Line e={e.l2} size={42}>đủ nước cho trọn một kiếp nạn.</Line>
      </TextBelow>
    </AbsoluteFill>
  );
};

const M6Bao2: React.FC = () => {
  const e = E.M6_BAO2;
  return (
    <AbsoluteFill>
      <ProductPanel rate={0.719} />
      <TextBelow gap={16}>
        <Line e={e.l0} size={42}>Trà rót từ sớm…</Line>
        <Big e={e.big1} size={52} color={JADE}>{"độ kiếp tới đâu,\nvẫn còn ấm tới đó."}</Big>
        <div style={{ height: 6 }} />
        <Line e={e.l1} size={40}>Có dây đeo, gắn được cả lên xe —</Line>
        <Big e={e.big2} size={48} color={GOLD}>hạ sơn không rời tay.</Big>
      </TextBelow>
    </AbsoluteFill>
  );
};

const M6Cta: React.FC = () => {
  const e = E.M6_CTA;
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ProductPanel rate={1} />
      <TextBelow gap={24}>
      <div style={{ ...pop(f, e.btn, 14), fontSize: 68 }}>👇</div>
      <div
        style={{
          ...pop(f, e.btn, 16),
          fontFamily: "Be Vietnam Pro",
          fontSize: 56,
          fontWeight: 900,
          color: BG,
          background: JADE,
          borderRadius: 28,
          padding: "28px 52px",
          lineHeight: 1.14,
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {"PHÁP BẢO\nDƯỚI CHÂN NÚI."}
      </div>
      </TextBelow>
    </AbsoluteFill>
  );
};

const Ket: React.FC = () => {
  const e = E.KET;
  const f = useCurrentFrame();
  return (
    <Stage gap={26}>
      <div style={{ ...pop(f, e.l0, 14), fontSize: 62 }}>🏯</div>
      <Line e={e.l0} size={42}>{"Cho nên người trong\nCông Sở Giới mới nói:"}</Line>
      <div style={{ height: 10 }} />
      <Line e={e.l1} size={50} color={SEC}>Đồng nghiệp…</Line>
      <Big e={e.big} size={68} color={GOLD}>{"là người\nCÙNG TÔNG MÔN."}</Big>
    </Stage>
  );
};

const Ket2: React.FC = () => {
  const e = E.KET2;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={54} color={JADE} weight={800}>Bằng hữu…</Line>
      <Big e={e.l1} size={58} color={TEXT}>{"là người biết ngươi\nMUỐN NGHỈ VIỆC…"}</Big>
      <Big e={e.big} size={54} color={RED}>{"trước cả khi\nngươi nói ra."}</Big>
    </Stage>
  );
};

const Ket3: React.FC = () => {
  const e = E.KET3;
  return (
    <Stage gap={34}>
      <Line e={e.top} size={44}>Đây chính là…</Line>
      <Big e={e.big} size={82} color={GOLD}>{"THIÊN CƠ\nMẬT NGÔN."}</Big>
    </Stage>
  );
};

const Cta: React.FC = () => {
  const e = E.CTA;
  const f = useCurrentFrame();
  return (
    <Stage gap={28}>
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
      <Line e={e.l0} size={42}>để mỗi ngày…</Line>
      <Line e={e.l1} size={46} color={JADE} weight={700}>độ kiếp cùng những bằng hữu…</Line>
      <Line e={e.l2} size={44} color={SEC}>cùng công ty, cùng một nghiệp.</Line>
    </Stage>
  );
};

export const MatNgonBangHuu: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const S: Array<[string, React.FC]> = [
    ["MODAU", Modau],
    ["MODAU2", Modau2],
    ["MODAU3", Modau3],
    ["MODAU4", Modau4],
    ["M1_REVEAL", M1Reveal],
    ["M2_REVEAL", M2Reveal],
    ["M3_MAT", M3Mat],
    ["M3_TRUYEN", M3Truyen],
    ["M3_LAN", M3Lan],
    ["M3_REVEAL", M3Reveal],
    ["M4_DUNG", M4Dung],
    ["M4_PHE", M4Phe],
    ["M4_REVEAL", M4Reveal],
    ["M5_GIO", M5Gio],
    ["M5_HAI", M5Hai],
    ["M5_REVEAL", M5Reveal],
    ["M6_NHAN", M6Nhan],
    ["M6_BAO1", M6Bao1],
    ["M6_BAO2", M6Bao2],
    ["M6_REVEAL", M6Reveal],
    ["M6_CTA", M6Cta],
    ["KET", Ket],
    ["KET2", Ket2],
    ["KET3", Ket3],
    ["CTA", Cta],
  ];
  const HEADS: Array<[string, string, string]> = [
    ["M1_HEAD", "ĐỆ NHẤT MẬT NGÔN", "“ÔNG NGHE GÌ CHƯA?”"],
    ["M2_HEAD", "ĐỆ NHỊ MẬT NGÔN", "“CHIỀU NAY ĐI ĂN KHÔNG?”"],
    ["M3_HEAD", "ĐỆ TAM MẬT NGÔN", "“ĐỪNG NÓI VỚI AI NHÉ.”"],
    ["M4_HEAD", "ĐỆ TỨ MẬT NGÔN", "“TAO ĐỨNG VỀ PHÍA MÀY.”"],
    ["M5_HEAD", "ĐỆ NGŨ MẬT NGÔN", "“THÔI, ĐỂ TAO Ở LẠI VỚI MÀY.”"],
    ["M6_HEAD", "ĐỆ LỤC MẬT NGÔN", "“TAO MUA CHO MÀY CÁI NÀY.”"],
  ];
  const PAIRS: Array<[string, string, string, number]> = [
    ["M1_PAIR", "“Có chuyện gì?”", "“PHÒNG NÀO?”", 58],
    ["M2_PAIR", "“Một lời mời.”", "“TAO CÓ CHUYỆN.”", 58],
    ["M6_PAIR", "“Một món quà.”", "“Đạo hữu, pháp bảo của ngươi\nđã đến lúc thay rồi.”", 44],
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      <Audio src={staticFile("mnbh/voice.mp3")} />
      {bgm ? <Audio src={staticFile("mnbh/bgm.mp3")} /> : null}
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
      {PAIRS.map(([name, outside, friend, friendSize]) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <Pair ec={E[name]} outside={outside} friend={friend} friendSize={friendSize} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
