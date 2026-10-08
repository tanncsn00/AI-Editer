import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BG, GOLD, JADE, RED, TEXT, SEC, MUTE, PHONE, HER, HIM, clamp, fadeUp, pop, Backdrop, Stage, Line, Big, Quote, Emoji, Says, Bubble, Typing, Bolt, LEAD_IN, makeAt, ShortShell } from "./MatNgonDaoLuKit";
import beatsData from "./mndl1_beats.json";
import T from "./mndl1_timings.json";

const at = makeAt(beatsData);
const E = T as Record<string, Record<string, number>>;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const g = at("HOOK_NGUOI").from + LEAD_IN;
  const eReply = g + E.HOOK_NGUOI.reply;
  const eBoom = g + E.HOOK_NGUOI.boom;
  const shake = f >= eBoom && f < eBoom + 14 ? Math.sin(f * 2.7) * interpolate(f, [eBoom, eBoom + 14], [22, 0], clamp) : 0;
  const flash = interpolate(f, [eBoom, eBoom + 3, eBoom + 16], [0, 0.3, 0], clamp);
  const cloud = interpolate(f, [0, eBoom], [0.75, 1], clamp);
  const seen = f >= eReply + 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: "translate(" + shake + "px," + shake * 0.4 + "px)" }}>
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>
          THIÊN CƠ MẬT NGÔN · ĐẠO LỮ
        </div>
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 70,
            right: 70,
            height: 960,
            background: PHONE,
            border: "3px solid " + (f >= eBoom ? RED : "#2E2A3E"),
            borderRadius: 64,
            boxShadow: "0 40px 120px #00000099" + (f >= eBoom ? ", 0 0 90px " + RED + "55" : ""),
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "38px 44px", borderBottom: "2px solid #2E2A3E" }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: "#3A2F4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🌸</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 800, color: TEXT }}>Nàng ❤️</div>
              <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 26, fontWeight: 500, color: seen ? RED : JADE }}>{seen ? "Đã xem · 22:47" : "Đang hoạt động"}</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, padding: "40px 40px" }}>
            <div style={{ textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 30, color: SEC, letterSpacing: 2 }}>— nàng quay lưng 🙍‍♀️ —</div>
            <Bubble e={-6} size={64}>Em không sao.</Bubble>
            <Typing from={6} to={eReply} />
            <Bubble e={eReply} mine size={60}>Ừ, vậy anh đi ngủ. 😴</Bubble>
            <div style={{ ...fadeUp(f, eReply + 10, 6, 8), textAlign: "right", fontFamily: "Be Vietnam Pro", fontSize: 26, color: SEC }}>✓✓ Đã gửi</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" }}>
          <Big e={eBoom} size={96} color={RED}>
            {"SAI LẦM\nCHÍ MẠNG"}
          </Big>
        </div>
        <div style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontSize: 150, opacity: cloud, transform: "translateX(" + Math.sin(f / 6) * 6 + "px)" }}>⛈️</div>
        <Bolt x={60} e={eBoom} />
        <Bolt x={800} e={eBoom + 3} flip />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: RED, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Head: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.HEAD;
  return (
    <Stage gap={34}>
      <div style={{ ...fadeUp(f, e.q), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 32, fontWeight: 700, color: GOLD, letterSpacing: 5 }}>MẬT NGÔN ĐẠO LỮ</div>
      </div>
      <Quote e={e.q} size={72}>“EM KHÔNG SAO.”</Quote>
      <Line e={e.l0} size={48} color={TEXT}>Và nam nhân thiên hạ…</Line>
      <Big e={e.big} size={74} color={RED}>
        {"ĐÃ SAI SUỐT\nBA NGÀN NĂM."}
      </Big>
    </Stage>
  );
};

const GiaiMa: React.FC = () => {
  const e = E.GIAIMA;
  return (
    <Stage gap={44}>
      <Says eWho={e.a_who} e={e.a} who="NGƯỜI NGOÀI NGHE" text="“Không sao thật.”" color={SEC} size={50} />
      <Says eWho={e.b_who} e={e.b} who="NGƯỜI YÊU LÂU NĂM NGHE" text={"“NGƯƠI CÒN BA KHẮC\nĐỂ TỰ BIẾT MÌNH SAI Ở ĐÂU.”"} color={RED} size={52} align="flex-end" />
    </Stage>
  );
};

const Row: React.FC<{ eq: number; ea: number; q: string }> = ({ eq, ea, q }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, justifyContent: "center" }}>
      <div style={{ ...fadeUp(f, eq), fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 600, color: TEXT }}>{q}</div>
      <div style={{ ...pop(f, ea, 7), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color: JADE }}>ĐỦ ✓</div>
    </div>
  );
};

const Luc: React.FC = () => {
  const e = E.LUC;
  return (
    <Stage gap={44}>
      <Line e={e.l0} size={54} color={GOLD} weight={700}>Ngươi lục lại ký ức.</Line>
      <Row eq={e.q1} ea={e.a1} q="Sáng nay: chúc buổi sáng." />
      <Row eq={e.q2} ea={e.a2} q="Trưa nay: hỏi ăn chưa." />
    </Stage>
  );
};

const PhotoBubble: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
      <div style={{ ...pop(f, e, 8), transformOrigin: "left bottom", width: 420, height: 300, borderRadius: "34px 34px 34px 8px", background: "linear-gradient(135deg, #F4A6C0, #8E7CF0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120 }}>
        🤳
      </div>
    </div>
  );
};

const ToiQua: React.FC = () => {
  const e = E.TOIQUA;
  return (
    <Stage gap={30}>
      <Line e={e.l0} size={50} color={TEXT} weight={700}>Tối qua…</Line>
      <PhotoBubble e={e.photo} />
      <Line e={e.l1} size={46}>Ngươi trả lời:</Line>
      <Bubble e={e.ok} mine size={72}>Ok.</Bubble>
    </Stage>
  );
};

const Ran: React.FC = () => {
  const e = E.RAN;
  return (
    <Stage gap={26}>
      <Line e={e.l0} size={60} color={TEXT} weight={800}>Hai chữ.</Line>
      <Line e={e.l1} size={50} color={TEXT}>Không icon.</Line>
      <Line e={e.l2} size={50} color={TEXT}>Không dấu chấm than.</Line>
      <Line e={e.l3} size={46}>Đạo tâm…</Line>
      <Big e={e.big} size={84} color={RED}>RẠN MỘT ĐƯỜNG.</Big>
      <Emoji e={e.big + 14}>💀</Emoji>
    </Stage>
  );
};

const Ngo: React.FC = () => {
  const e = E.NGO;
  return (
    <Stage gap={22}>
      <Emoji e={e.l0} size={62}>🏯</Emoji>
      <Line e={e.l0} size={44}>Khoảnh khắc ấy ngươi lĩnh ngộ:</Line>
      <Quote e={e.q} size={58}>“Không sao”…</Quote>
      <Line e={e.l1} size={46} color={TEXT}>không phải câu trả lời.</Line>
      <Big e={e.big} size={78} color={GOLD}>NÓ LÀ ĐỀ THI.</Big>
      <Line e={e.l2} size={46}>Và ngươi…</Line>
      <Big e={e.big2} size={70} color={RED}>ĐÃ NỘP GIẤY TRẮNG.</Big>
    </Stage>
  );
};

const DapAn: React.FC = () => {
  const e = E.DAPAN;
  return (
    <Stage gap={28}>
      <Line e={e.l0} size={60} color={GOLD} weight={800}>Đáp án đúng?</Line>
      <Line e={e.l1} size={48} color={TEXT}>Không nằm trên bàn phím.</Line>
      <Line e={e.l2} size={46}>Mà là…</Line>
      <Big e={e.big} size={64} color={JADE}>
        {"XUẤT HIỆN\nTRƯỚC CỬA NHÀ NÀNG\nVỚI MỘT BÓ HOA."}
      </Big>
      <Emoji e={e.big + 12} size={110}>💐</Emoji>
    </Stage>
  );
};

const Cta: React.FC = () => {
  const e = E.CTA;
  const f = useCurrentFrame();
  return (
    <Stage gap={34}>
      <Line e={e.l0} size={50} color={TEXT} weight={700}>
        {"Tag người yêu hay nói\ncâu này vào đây 👇"}
      </Line>
      <div style={{ ...pop(f, e.btn, 9), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color: BG, background: GOLD, borderRadius: 999, padding: "24px 56px", letterSpacing: 1 }}>
        ▶ FOLLOW BẦN ĐẠO
      </div>
      <Line e={e.l1} size={46}>trước khi nàng lại nói—</Line>
      <div style={{ width: 760 }}>
        <Bubble e={e.loop}>Em không sao.</Bubble>
      </div>
    </Stage>
  );
};

const SCENES: Array<[string, React.FC]> = [
  ["HEAD", Head],
  ["GIAIMA", GiaiMa],
  ["LUC", Luc],
  ["TOIQUA", ToiQua],
  ["RAN", Ran],
  ["NGO", Ngo],
  ["DAPAN", DapAn],
  ["CTA", Cta],
];

export const MatNgonDaoLu1: React.FC<{ bgm?: boolean; cta?: boolean }> = ({ bgm = true, cta = true }) => (
  <ShortShell
    slug="mndl1"
    beatsData={beatsData}
    hook={Hook}
    scenes={SCENES}
    booms={[LEAD_IN + at("HOOK_NGUOI").from + E.HOOK_NGUOI.boom]}
    bgm={bgm}
    cta={cta}
  />
);
