import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "./Sfx";
import { BG, GOLD, JADE, RED, TEXT, SEC, MUTE, PHONE, HER, HIM, clamp, fadeUp, pop, Backdrop, Stage, Line, Big, Quote, Emoji, Says, Bubble, Typing, Bolt, FPS, LEAD_IN, makeAt } from "./MatNgonDaoLuKit";
import beatsData from "./mndlf_beats.json";
import T from "./mndlf_timings.json";

const at = makeAt(beatsData);
const E = T as Record<string, Record<string, number>>;
const abs = (beat: string, key: string) => LEAD_IN + at(beat).from + E[beat][key];

type El =
  | { k: "ln"; key: string; t: string; size?: number; color?: string; weight?: number }
  | { k: "big"; key: string; t: string; size?: number; color?: string }
  | { k: "qt"; key: string; t: string; size?: number; color?: string }
  | { k: "emo"; key: string; t: string; size?: number; delay?: number }
  | { k: "says"; whoKey: string; key: string; who: string; t: string; color: string; align?: "flex-start" | "flex-end" }
  | { k: "bub"; key: string; t: string; mine?: boolean; size?: number }
  | { k: "row"; key: string; aKey: string; q: string; a: string; color: string }
  | { k: "pair"; key: string; aKey: string; q: string; a: string; color: string }
  | { k: "tl"; key: string; bKey: string; time: string; t: string }
  | { k: "photo"; key: string };

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "ln", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "qt", key, t, size, color });
const em = (key: string, t: string, size?: number, delay?: number): El => ({ k: "emo", key, t, size, delay });
const bu = (key: string, t: string, mine?: boolean, size?: number): El => ({ k: "bub", key, t, mine, size });
const giaiMa = (outer: string, inner: string): El[] => [
  { k: "says", whoKey: "a_who", key: "a", who: "NGƯỜI NGOÀI NGHE", t: outer, color: SEC },
  { k: "says", whoKey: "b_who", key: "b", who: "NGƯỜI YÊU LÂU NĂM NGHE", t: inner, color: RED, align: "flex-end" },
];

const Row: React.FC<{ eq: number; ea: number; q: string; a: string; color: string }> = ({ eq, ea, q, a, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
      <div style={{ ...fadeUp(f, eq), fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 600, color: TEXT }}>{q}</div>
      <div style={{ ...pop(f, ea, 7), fontFamily: "Be Vietnam Pro", fontSize: 48, fontWeight: 900, color }}>{a}</div>
    </div>
  );
};

const Pair: React.FC<{ eq: number; ea: number; q: string; a: string; color: string }> = ({ eq, ea, q, a, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ ...fadeUp(f, eq), fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 800, color: GOLD }}>{q}</div>
      <div style={{ ...fadeUp(f, ea), fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 600, color }}>{a}</div>
    </div>
  );
};

const TimeRow: React.FC<{ et: number; eb: number; time: string; t: string }> = ({ et, eb, time, t }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ ...fadeUp(f, et), fontFamily: "JetBrains Mono", fontSize: 44, fontWeight: 700, color: GOLD, width: 170, textAlign: "right" }}>{time}</div>
      <div style={{ flex: 1 }}>
        <Bubble e={eb} mine size={46}>
          {t}
        </Bubble>
      </div>
    </div>
  );
};

const PhotoBubble: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
      <div style={{ ...pop(f, e, 8), transformOrigin: "left bottom", width: 400, height: 280, borderRadius: "34px 34px 34px 8px", background: "linear-gradient(135deg, #F4A6C0, #8E7CF0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110 }}>
        🤳
      </div>
    </div>
  );
};

const Scene: React.FC<{ name: string; gap?: number; els: El[] }> = ({ name, gap = 28, els }) => {
  const ec = E[name];
  const e = (key: string, delay = 0) => Math.max(0, ec[key] + delay);
  return (
    <Stage gap={gap}>
      {els.map((el, i) => {
        if (el.k === "ln") return <Line key={i} e={e(el.key)} size={el.size} color={el.color} weight={el.weight}>{el.t}</Line>;
        if (el.k === "big") return <Big key={i} e={e(el.key)} size={el.size} color={el.color}>{el.t}</Big>;
        if (el.k === "qt") return <Quote key={i} e={e(el.key)} size={el.size} color={el.color}>{el.t}</Quote>;
        if (el.k === "emo") return <Emoji key={i} e={e(el.key, el.delay)} size={el.size}>{el.t}</Emoji>;
        if (el.k === "says") return <Says key={i} eWho={e(el.whoKey)} e={e(el.key)} who={el.who} text={el.t} color={el.color} size={48} align={el.align} />;
        if (el.k === "bub") return <Bubble key={i} e={e(el.key)} mine={el.mine} size={el.size ?? 46}>{el.t}</Bubble>;
        if (el.k === "row") return <Row key={i} eq={e(el.key)} ea={e(el.aKey)} q={el.q} a={el.a} color={el.color} />;
        if (el.k === "pair") return <Pair key={i} eq={e(el.key)} ea={e(el.aKey)} q={el.q} a={el.a} color={el.color} />;
        if (el.k === "tl") return <TimeRow key={i} et={e(el.key)} eb={e(el.bKey)} time={el.time} t={el.t} />;
        return <PhotoBubble key={i} e={e(el.key)} />;
      })}
    </Stage>
  );
};

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  TRIG4: { els: [ln("l0", "Nếu bên tai ngươi vừa vang lên\nđúng giọng một người…", 48, TEXT), ln("l1", "Xin chúc mừng.", 50), bg("big", "NGƯƠI VỪA LĨNH NGỘ\nĐỆ NHẤT MẬT NGÔN.", 66, GOLD)] },
  ATT1: { els: [ln("l0", "Nhưng đó mới chỉ là…", 48), bg("big", "1 TRONG 5 CÂU MẬT NGÔN\nĐÁNG SỢ NHẤT\nĐẠO LỮ GIỚI.", 64, RED)] },
  ATT2: { els: [em("l0", "🍜", 90), ln("l0", "Có câu…", 48), bg("big", "khiến ngươi chạy 3 vòng quanh phố\nmà vẫn chưa được ăn.", 52, TEXT)] },
  ATT3: { els: [em("l0", "🗿", 90), ln("l0", "Có câu…", 48), bg("big", "biến vô số nữ tu\nthành tượng đá dưới chân lầu.", 54, TEXT)] },
  ATT4: { els: [em("l0", "⚡", 90), ln("l0", "Có câu…", 48), bg("big", "chỉ 7 chữ\nmà đủ khiến ngươi\ntụt 3 tầng cảnh giới.", 56, RED)] },
  CUR1: { els: [ln("l0", "Đạo Lữ Giới gọi chúng là…", 48), bg("big", "NGŨ ĐẠI\nMẬT NGÔN", 130, GOLD)] },
  CUR2: { els: [ln("l0", "Và hãy xem…", 48), bg("big", "người yêu ngươi\nđang dùng câu nào.", 66, TEXT), em("big", "👇", 90, 12)] },

  M1_B: { els: [ln("l0", "Và nam nhân thiên hạ…", 50, TEXT), bg("big", "ĐÃ SAI SUỐT\nBA NGÀN NĂM.", 80, RED)] },
  M1_GIAIMA: { gap: 44, els: giaiMa("“Không sao thật.”", "“NGƯƠI CÒN BA KHẮC\nĐỂ TỰ BIẾT MÌNH SAI Ở ĐÂU.”") },
  M1_LUC: {
    gap: 44,
    els: [
      ln("l0", "Ngươi lục lại ký ức.", 54, GOLD, 700),
      { k: "row", key: "q1", aKey: "a1", q: "Sáng nay: chúc buổi sáng.", a: "ĐỦ ✓", color: JADE },
      { k: "row", key: "q2", aKey: "a2", q: "Trưa nay: hỏi ăn chưa.", a: "ĐỦ ✓", color: JADE },
    ],
  },
  M1_TOIQUA: { gap: 30, els: [ln("l0", "Tối qua…", 50, TEXT, 700), { k: "photo", key: "photo" }, ln("l1", "Ngươi trả lời:", 46), bu("ok", "Ok.", true, 72)] },
  M1_RAN: { gap: 24, els: [ln("l0", "Hai chữ.", 60, TEXT, 800), ln("l1", "Không icon.", 50, TEXT), ln("l2", "Không dấu chấm than.", 50, TEXT), ln("l3", "Đạo tâm…", 46), bg("big", "RẠN MỘT ĐƯỜNG.", 84, RED), em("big", "💀", 72, 14)] },
  M1_NGO: {
    gap: 22,
    els: [em("l0", "🏯", 62), ln("l0", "Khoảnh khắc ấy ngươi lĩnh ngộ:", 44), qt("q", "“Không sao”…", 58), ln("l1", "không phải câu trả lời.", 46, TEXT), bg("big", "NÓ LÀ ĐỀ THI.", 78, GOLD), ln("l2", "Và ngươi…", 46), bg("big2", "ĐÃ NỘP GIẤY TRẮNG.", 70, RED)],
  },
  M1_DAPAN: { els: [ln("l0", "Đáp án đúng?", 60, GOLD, 800), ln("l1", "Không nằm trên bàn phím.", 48, TEXT), ln("l2", "Mà là…", 46), bg("big", "XUẤT HIỆN\nTRƯỚC CỬA NHÀ NÀNG\nVỚI MỘT BÓ HOA.", 62, JADE), em("big", "💐", 110, 12)] },

  M2_B: { els: [ln("l0", "Câu nói tự do nhất thế gian…", 50, TEXT), bg("big", "cho đến khi ngươi\nthật sự chọn.", 70, GOLD)] },
  M2_GIAIMA: { gap: 44, els: giaiMa("“Anh quyết đi.”", "“ĐÁP ÁN CÓ RỒI.\nNGƯƠI ĐOÁN ĐI.”") },
  M2_THOAI: {
    gap: 16,
    els: [
      bu("b1", "Ăn bún đậu nhé?", true),
      bu("b2", "Thôi."),
      bu("b3", "Lẩu?", true),
      bu("b4", "Nóng lắm."),
      bu("b5", "Đồ nướng?", true),
      bu("b6", "Ám mùi tóc."),
      bu("b7", "Vậy em muốn ăn gì?", true),
      bu("b8", "Tùy anh.", false, 60),
    ],
  },
  M2_VONG: { els: [ln("l0", "Bốn mươi phút.", 54, TEXT, 700), ln("l1", "Ba vòng quanh phố.", 54, TEXT, 700), bg("big", "KINH MẠCH BẮT ĐẦU\nNGHỊCH HÀNH.", 70, RED), em("big", "🌀", 90, 12)] },
  M2_CHOT: { els: [ln("l0", "Cuối cùng nàng chỉ tay:", 48), bu("b", "Hay mình ăn bún đậu đi.", false, 54), ln("l1", "Món ngươi nói…", 48, TEXT), bg("big", "NGAY CÂU ĐẦU TIÊN.", 76, RED), em("big", "💀", 72, 14)] },
  M2_NGO: {
    gap: 24,
    els: [em("l0", "🏯", 62), ln("l0", "Ngươi lĩnh ngộ:", 46), qt("q", "“Tùy anh”\nkhông phải trao quyền.", 54), bg("big", "ĐÓ LÀ MÊ TRẬN.", 80, GOLD), ln("l1", "Lối ra duy nhất…", 46), bg("big2", "là đáp án nàng chọn\ntừ trước khi ngươi hỏi.", 54, RED)],
  },

  M3_B: { els: [ln("l0", "Nó đã biến vô số nữ tu…", 50, TEXT), bg("big", "THÀNH TƯỢNG ĐÁ\nDƯỚI CHÂN LẦU.", 76, RED), em("big", "🗿", 110, 12)] },
  M3_GIAIMA: { gap: 44, els: giaiMa("“Năm phút nữa.”", "“HẮN CHƯA RA KHỎI NHÀ.”") },
  M3_TIMELINE: {
    gap: 36,
    els: [
      { k: "tl", key: "t1", bKey: "m1", time: "19:00", t: "Anh sắp tới rồi." },
      { k: "tl", key: "t2", bKey: "m2", time: "19:20", t: "Anh đang dắt xe." },
      { k: "tl", key: "t3", bKey: "m3", time: "19:45", t: "Kẹt xe quá em ơi." },
    ],
  },
  M3_XUATHIEN: { els: [ln("l0", "Hai mươi giờ.", 54, GOLD, 700), ln("l1", "Hắn xuất hiện.", 52, TEXT, 700), ln("l2", "Tóc…", 48), bg("big", "VẪN CÒN ƯỚT.", 92, RED), em("big", "💧", 90, 12)] },
  M3_GUONG: { gap: 22, els: [ln("l0", "Nàng nhìn hắn.", 52, TEXT, 700), ln("l1", "Hắn nhìn nàng.", 52, TEXT, 700), ln("l2", "Cả hai đều biết…", 46), ln("l3", "kẹt xe…", 50, TEXT), bg("big", "LÀ KẸT\nTRONG PHÒNG TẮM.", 76, RED), em("big", "🚿", 90, 12)] },
  M3_NGO: { gap: 24, els: [em("l0", "🏯", 62), ln("l0", "Trong Đạo Lữ Giới…", 46), qt("q", "“Sắp tới”\nkhông đo bằng cây số.", 56), ln("l1", "Nó đo bằng…", 46), bg("big", "SỨC CHỊU ĐỰNG\nCỦA NGƯỜI ĐỨNG CHỜ.", 64, GOLD)] },

  M4_DETHI: { els: [bg("big", "ĐỀ THI KHÓ NHẤT\nĐẠO LỮ GIỚI.", 76, GOLD), ln("l0", "Không tài liệu.", 50, TEXT), ln("l1", "Không được hỏi bài.", 50, TEXT)] },
  M4_GIAIMA: { gap: 44, els: giaiMa("“Hỏi cho vui.”", "“THIÊN KIẾP ĐÃ GIÁNG.\nNGƯƠI CÓ BA GIÂY.”") },
  M4_THOAI: {
    gap: 14,
    els: [
      ln("l0", "Ngươi nhìn nàng.", 46, TEXT, 700),
      ln("l1", "Nàng nhìn ngươi.", 46, TEXT, 700),
      bu("b1", "Em cắt tóc à?", true, 44),
      bu("b2", "Không.", false, 44),
      bu("b3", "Son mới?", true, 44),
      bu("b4", "Không.", false, 44),
      bu("b5", "Áo mới?", true, 44),
      bu("b6", "Áo này anh tặng em năm ngoái.", false, 44),
    ],
  },
  M4_HOA: { gap: 24, els: [ln("l0", "Nguyên thần…", 48), bg("big", "SUÝT XUẤT KHIẾU.", 76, RED), em("big", "👻", 90, 10), ln("l1", "Hóa ra…\nnàng chỉ tỉa lông mày.", 50, TEXT), bg("big2", "HAI MI-LI-MÉT.", 80, GOLD)] },
  M4_NGO: { gap: 24, els: [em("l0", "🏯", 62), ln("l0", "Ngươi lĩnh ngộ:", 46), qt("q", "Câu hỏi này\nkhông chấm đáp án.", 56), ln("l1", "Nó chấm…", 46), bg("big", "NGƯƠI NGẬP NGỪNG\nBAO LÂU.", 72, RED)] },

  M5_B: { els: [ln("l0", "Đủ làm bất kỳ ai…", 50, TEXT), bg("big", "TỤT BA TẦNG\nCẢNH GIỚI.", 88, RED)] },
  M5_GIAIMA: { gap: 44, els: giaiMa("“Một cuộc trò chuyện.”", "“THIÊN LÔI THẨM PHÁN ĐẠI HỘI.\nKHAI MẠC.”") },
  M5_RA: {
    gap: 34,
    els: [
      ln("l0", "Trong ba phút ấy…", 46),
      ln("l1", "ngươi rà lại ba tháng ký ức.", 50, TEXT, 700),
      { k: "row", key: "q1", aKey: "a1", q: "Quên sinh nhật mẹ nàng?", a: "KHÔNG ✓", color: JADE },
      { k: "row", key: "q2", aKey: "a2", q: "Thả tim ảnh người cũ?", a: "…KHÔNG CHẮC.", color: RED },
    ],
  },
  M5_KHI: { gap: 30, els: [bg("big", "KHÍ HUYẾT\nĐẢO LỘN.", 86, RED), bg("big2", "THIÊN LINH CÁI\nBỐC KHÓI.", 76, GOLD), em("big2", "💨", 90, 12)] },
  M5_TIN: { gap: 30, els: [ln("l0", "Tin nhắn đến:", 48), bu("b1", "Tối nay ăn gì?", false, 58), ln("l1", "Ngươi thở ra…\ngõ hai chữ:", 48, TEXT), bu("b2", "Tùy em.", true, 64)] },
  M5_LUOT: { els: [ln("l0", "Lần này…", 50), bg("big", "ĐẾN LƯỢT NÀNG\nĐỘ KIẾP.", 88, JADE), em("big", "🔥", 100, 12)] },
  M5_NGO: { gap: 24, els: [em("l0", "🏯", 62), ln("l0", "Trong Đạo Lữ Giới…", 46), qt("q", "Thứ đáng sợ nhất\nkhông phải cãi nhau.", 56), ln("l1", "Mà là…", 46), bg("big", "BA DẤU CHẤM\nĐANG GÕ.", 88, RED), em("big", "💬", 90, 12)] },

  PAY1: { els: [ln("l0", "Sau này ngươi sẽ nhận ra…", 48), bg("big", "mật ngôn không sinh ra\nđể làm khó ngươi.", 60, JADE)] },
  PAY2: {
    gap: 40,
    els: [
      { k: "pair", key: "q1", aKey: "a1", q: "“Không sao”…", a: "là muốn được hỏi thêm một lần.", color: TEXT },
      { k: "pair", key: "q2", aKey: "a2", q: "“Tùy anh”…", a: "là muốn được ngươi hiểu.", color: TEXT },
      { k: "pair", key: "q3", aKey: "a3", q: "“Có gì khác không”…", a: "là muốn được ngươi nhìn thấy.", color: TEXT },
    ],
  },
  PAY3: { els: [ln("l0", "Người yêu không cần ngươi\ngiải đúng mọi câu.", 50, TEXT), ln("l1", "Chỉ cần ngươi…", 48), bg("big", "VẪN CÒN\nMUỐN GIẢI.", 96, JADE), em("big", "❤️", 90, 12)] },
  SOC1: { els: [ln("l0", "Nhưng đạo hữu tuyệt đối…", 48), bg("big", "ĐỪNG TAG\nNGƯỜI YÊU VÀO ĐÂY.", 74, RED), em("big", "🚫", 90, 12)] },
  SOC2: { els: [ln("l0", "Bởi nếu nàng thấy video này…", 48), bg("big", "nàng sẽ biết ngươi\nđã giải được mật ngôn.", 62, GOLD)] },
  SOC3: { gap: 22, els: [ln("l0", "Và điều đáng sợ nhất là…", 46), ln("l1", "nàng sẽ không nói gì.", 50, TEXT, 700), ln("l2", "Chỉ thả một cái haha.", 50, TEXT), ln("l3", "Rồi nhắn riêng:", 46), bu("b", "Em không sao.", false, 62), em("b", "💀", 72, 16)] },
  SOC4: { gap: 26, els: [ln("l0", "Nhưng nếu bên tai ngươi vừa vang lên\nđúng giọng một người…", 44, TEXT), ln("l1", "Thì đừng giữ trong lòng.", 48), bg("big", "TAG VÀO.", 130, JADE), ln("l2", "Để nàng biết…\nngươi đã bắt đầu tu luyện.", 48, GOLD, 700)] },
  EXP1: { els: [ln("l0", "Và nếu ngươi muốn biết…", 48), bg("big", "5 CÂU MẬT NGÔN\nCỦA PHÍA CHÀNG…", 72, GOLD), ln("l1", "thì chuẩn bị tâm lý.", 50, TEXT, 700)] },
  EXP2: {
    gap: 40,
    els: [
      ln("l0", "Bởi vì…", 48),
      { k: "pair", key: "q1", aKey: "a1", q: "Nàng nói “không sao”…", a: "là có chuyện.", color: TEXT },
      { k: "pair", key: "q2", aKey: "a2", q: "Chàng nói “để anh tính”…", a: "là chưa tính gì cả.", color: RED },
    ],
  },
};

const HEADS: Array<[string, string, string, string]> = [
  ["M1_HEAD", "📜", "ĐỆ NHẤT MẬT NGÔN", "“EM KHÔNG SAO.”"],
  ["M2_HEAD", "🍜", "ĐỆ NHỊ MẬT NGÔN", "“TÙY ANH.”"],
  ["M3_HEAD", "🗿", "ĐỆ TAM MẬT NGÔN", "“ANH SẮP TỚI RỒI.”"],
  ["M4_HEAD", "⏳", "ĐỆ TỨ MẬT NGÔN", "“ANH THẤY EM\nCÓ GÌ KHÁC KHÔNG?”"],
  ["M5_HEAD", "⚡", "ĐỆ NGŨ MẬT NGÔN · ĐẠI KIẾP", "“MÌNH NÓI CHUYỆN CHÚT\nĐƯỢC KHÔNG?”"],
];

const Head: React.FC<{ name: string; icon: string; num: string; quote: string }> = ({ name, icon, num, quote }) => {
  const f = useCurrentFrame();
  const e = E[name];
  return (
    <Stage gap={36}>
      <div style={{ ...pop(f, e.dot, 8), fontSize: 110 }}>{icon}</div>
      <div style={{ ...fadeUp(f, e.dot), fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 5 }}>{num}</div>
      <div style={{ ...fadeUp(f, e.dot, 7, 0), width: 220, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Quote e={e.q} size={70}>{quote}</Quote>
    </Stage>
  );
};

const ChatCard: React.FC<{ top: number; height: number; status: string; statusColor: string; alarm?: boolean; children: React.ReactNode }> = ({ top, height, status, statusColor, alarm = false, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 70,
      right: 70,
      height,
      background: PHONE,
      border: "3px solid " + (alarm ? RED : "#2E2A3E"),
      borderRadius: 64,
      boxShadow: "0 40px 120px #00000099" + (alarm ? ", 0 0 90px " + RED + "55" : ""),
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "34px 44px", borderBottom: "2px solid #2E2A3E" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: "#3A2F4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>🌸</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 800, color: TEXT }}>Nàng ❤️</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 26, fontWeight: 500, color: statusColor }}>{status}</div>
      </div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, padding: "36px 40px" }}>{children}</div>
  </div>
);

const Trigger: React.FC = () => {
  const f = useCurrentFrame();
  const e1 = abs("TRIG1", "l0");
  const eB2 = abs("TRIG2", "b2");
  const e3 = abs("TRIG3", "l0");
  const eBig = abs("TRIG3", "big");
  const caption = f < abs("TRIG2", "l0") ? "Ai cũng có một người yêu…\nhỏi gì cũng:" : f < e3 ? "Hỏi lại lần nữa:" : "Nhưng tối hôm đó…";
  const capStart = f < abs("TRIG2", "l0") ? e1 : f < e3 ? abs("TRIG2", "l0") : e3;
  const dim = interpolate(f, [e3, e3 + 12], [1, 0.45], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>
        THIÊN CƠ MẬT NGÔN · ĐẠO LỮ
      </div>
      <div key={caption} style={{ ...fadeUp(f, capStart), position: "absolute", top: 210, left: 60, right: 60, textAlign: "center", fontFamily: "Be Vietnam Pro", fontSize: 52, fontWeight: 700, color: TEXT, whiteSpace: "pre-line", lineHeight: 1.3 }}>
        {caption}
      </div>
      <div style={{ opacity: dim }}>
        <ChatCard top={430} height={820} status={f >= e3 ? "Hoạt động 3 giờ trước" : "Đang hoạt động"} statusColor={f >= e3 ? MUTE : JADE}>
          <Bubble e={-6} size={64}>Em không sao.</Bubble>
          <Bubble e={eB2} size={60}>Em bảo không sao mà.</Bubble>
        </ChatCard>
      </div>
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" }}>
        <Big e={eBig} size={84} color={RED}>
          {"KHÔNG MỘT\nTIN NHẮN."}
        </Big>
      </div>
    </AbsoluteFill>
  );
};

const M1Chat: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M1_A;
  const eBoom = ec.boom;
  const shake = f >= eBoom && f < eBoom + 14 ? Math.sin(f * 2.7) * interpolate(f, [eBoom, eBoom + 14], [22, 0], clamp) : 0;
  const flash = interpolate(f, [eBoom, eBoom + 3, eBoom + 16], [0, 0.3, 0], clamp);
  const seen = f >= ec.reply + 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: "translate(" + shake + "px," + shake * 0.4 + "px)" }}>
        <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontSize: 140 }}>⛈️</div>
        <ChatCard top={330} height={960} status={seen ? "Đã xem · 22:47" : "Đang hoạt động"} statusColor={seen ? RED : JADE} alarm={f >= eBoom}>
          <div style={{ ...fadeUp(f, ec.say), textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 30, color: SEC, letterSpacing: 2 }}>— nàng quay lưng 🙍‍♀️ —</div>
          <Bubble e={ec.say} size={64}>Em không sao.</Bubble>
          <Typing from={ec.say + 8} to={ec.reply} />
          <Bubble e={ec.reply} mine size={60}>Ừ, vậy anh đi ngủ. 😴</Bubble>
        </ChatCard>
        <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" }}>
          <Big e={eBoom} size={96} color={RED}>
            {"SAI LẦM\nCHÍ MẠNG"}
          </Big>
        </div>
        <Bolt x={60} e={eBoom} />
        <Bolt x={800} e={eBoom + 3} flip />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: RED, opacity: flash }} />
    </AbsoluteFill>
  );
};

const M2Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M2_HOOK;
  const secs = Math.min(40 * 60, 39 * 60 + 52 + Math.floor((f - ec.timer) / 4));
  const mm = String(Math.floor(Math.max(0, secs) / 60)).padStart(2, "0");
  const ss = String(Math.max(0, secs) % 60).padStart(2, "0");
  const ang = f * 0.12;
  return (
    <Stage gap={36}>
      <div style={{ ...pop(f, ec.timer, 8), fontFamily: "JetBrains Mono", fontSize: 150, fontWeight: 700, color: RED, letterSpacing: 4 }}>{mm + ":" + ss}</div>
      <div style={{ ...pop(f, ec.timer, 8), position: "relative", width: 420, height: 420 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 210, border: "4px dashed " + GOLD + "66" }} />
        <div style={{ position: "absolute", left: 160, top: 150, fontSize: 110 }}>🍜</div>
        <div style={{ position: "absolute", left: 180 + Math.cos(ang) * 200, top: 170 + Math.sin(ang) * 200, fontSize: 80, transform: "translate(-20px,-20px)" }}>🛵</div>
      </div>
      <Line e={ec.l0} size={56} color={TEXT} weight={800}>Vẫn chưa được ăn.</Line>
      <Big e={ec.big} size={70} color={GOLD}>TẤT CẢ… VÌ HAI CHỮ.</Big>
    </Stage>
  );
};

const M3Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M3_HOOK;
  const card = (children: React.ReactNode, e: number) => (
    <div style={{ ...pop(f, e, 8), flex: 1, height: 720, background: PHONE, border: "3px solid #2E2A3E", borderRadius: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 30 }}>
      {children}
    </div>
  );
  const waited = Math.min(3600, 3540 + Math.floor((f - ec.l0) / 2));
  const hh = String(Math.floor(waited / 3600)).padStart(2, "0");
  const mi = String(Math.floor((waited % 3600) / 60)).padStart(2, "0");
  return (
    <Stage gap={40}>
      <Big e={ec.l0} size={84} color={RED}>CHỜ 1 TIẾNG</Big>
      <div style={{ width: "100%", display: "flex", gap: 30 }}>
        {card(
          <>
            <div style={{ fontSize: 170 }}>🗿</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>NÀNG · DƯỚI CHÂN LẦU</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, fontWeight: 700, color: GOLD }}>{hh + ":" + mi}</div>
          </>,
          ec.l0,
        )}
        {card(
          <>
            <div style={{ fontSize: 150 }}>🚿</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>HẮN · TRONG PHÒNG TẮM</div>
            <div style={{ ...pop(f, ec.msg, 7), fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 700, color: "#FFFFFF", background: HIM, borderRadius: "28px 28px 8px 28px", padding: "18px 24px" }}>Anh sắp tới rồi.</div>
          </>,
          ec.l0,
        )}
      </div>
    </Stage>
  );
};

const M4Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M4_HOOK;
  const t = f - ec.l0;
  const n = t < 0 ? 3 : Math.max(1, 3 - Math.floor(t / 14));
  const phase = t < 0 ? 0 : (t % 14) / 14;
  return (
    <Stage gap={30}>
      <div style={{ ...pop(f, ec.l0, 8), position: "relative", width: 520, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={520} height={520} style={{ position: "absolute", inset: 0 }}>
          <circle cx={260} cy={260} r={230} stroke={MUTE} strokeWidth={10} fill="none" />
          <circle cx={260} cy={260} r={230} stroke={RED} strokeWidth={14} fill="none" strokeDasharray={2 * Math.PI * 230} strokeDashoffset={2 * Math.PI * 230 * phase} transform="rotate(-90 260 260)" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 300, fontWeight: 900, color: TEXT, transform: "scale(" + (1.15 - phase * 0.15) + ")" }}>{n}</div>
      </div>
      <div style={{ ...fadeUp(f, ec.l0), fontSize: 90 }}>😰</div>
      <Big e={ec.big} size={100} color={RED}>SAI LÀ CHẾT.</Big>
    </Stage>
  );
};

const M5Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M5_HOOK;
  const drop = interpolate(f, [ec.drop, ec.drop + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div
        style={{
          ...fadeUp(f, ec.phone, 8, -60),
          position: "absolute",
          top: 200,
          left: 70,
          right: 70,
          background: "#1E1B2B",
          border: "2px solid #3A3550",
          borderRadius: 40,
          padding: "28px 34px",
          display: "flex",
          gap: 22,
          alignItems: "center",
          boxShadow: "0 30px 80px #00000099",
        }}
      >
        <div style={{ fontSize: 60 }}>🌸</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 32, fontWeight: 800, color: TEXT }}>Nàng ❤️ · vừa xong</div>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 600, color: TEXT }}>Mình nói chuyện chút được không?</div>
        </div>
      </div>
      <Stage gap={30}>
        <div style={{ height: 260 }} />
        <Line e={ec.l0} size={52} color={TEXT} weight={700}>Ngươi đang xỏ giày đi nhậu.</Line>
        <div style={{ ...pop(f, ec.l0, 8), fontSize: 180, transform: "translateY(" + drop * 200 + "px) rotate(" + drop * 40 + "deg)", opacity: 1 - drop }}>👟</div>
        <Big e={ec.drop} size={70} color={RED}>CHIẾC GIÀY… RƠI XUỐNG.</Big>
      </Stage>
    </AbsoluteFill>
  );
};

const M5Soan: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.M5_SOAN;
  const on = (f >= ec.dots && f < ec.off) || f >= ec.on;
  return (
    <Stage gap={34}>
      <Line e={ec.l0} size={52} color={TEXT} weight={700}>Nàng đang soạn tin…</Line>
      <div style={{ height: 120, display: "flex", alignItems: "center" }}>
        {on ? (
          <div style={{ display: "flex", gap: 22, background: HER, borderRadius: 60, padding: "34px 46px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: "#FFFFFF", opacity: 0.35 + 0.65 * Math.abs(Math.sin(f / 5 + i * 0.9)) }} />
            ))}
          </div>
        ) : null}
      </div>
      <Line e={ec.dots} size={48}>Ba dấu chấm.</Line>
      <Line e={ec.off} size={52} color={RED} weight={800}>Rồi tắt.</Line>
      <Line e={ec.on} size={52} color={GOLD} weight={800}>Rồi lại hiện.</Line>
    </Stage>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const ec = E.CTA;
  return (
    <Stage gap={26}>
      <div style={{ ...pop(f, ec.btn, 9), fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 900, color: BG, background: GOLD, borderRadius: 999, padding: "26px 60px", letterSpacing: 1 }}>▶ FOLLOW BẦN ĐẠO</div>
      <Line e={ec.l0} size={48}>để độ kiếp</Line>
      <Big e={ec.big} size={80} color={GOLD}>MỖI NGÀY</Big>
    </Stage>
  );
};

const SPECIAL: Array<[string, React.FC]> = [
  ["M1_A", M1Chat],
  ["M2_HOOK", M2Hook],
  ["M3_HOOK", M3Hook],
  ["M4_HOOK", M4Hook],
  ["M5_HOOK", M5Hook],
  ["M5_SOAN", M5Soan],
  ["CTA", Cta],
];

export const MatNgonDaoLuFull: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const trigEnd = LEAD_IN + at("TRIG4").from;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      {bgm ? <Audio src={staticFile("mndlf/bgm.mp3")} /> : null}
      <Audio src={staticFile("mndl1/rumble.mp3")} volume={0.5} />
      <Sfx name="punch/vine-boom" at={abs("M1_A", "boom") / FPS} volume={0.55} />
      <Sfx name="punch/vine-boom" at={abs("M5_HOOK", "drop") / FPS} volume={0.5} />
      <Sequence from={0} durationInFrames={trigEnd}>
        <Trigger />
      </Sequence>
      <Sequence from={LEAD_IN}>
        <Audio src={staticFile("mndlf/voice.mp3")} />
        {Object.entries(SCENES).map(([name, spec]) => {
          const { from, dur } = at(name);
          return (
            <Sequence key={name} from={from} durationInFrames={dur}>
              <Scene name={name} gap={spec.gap} els={spec.els} />
            </Sequence>
          );
        })}
        {HEADS.map(([name, icon, num, quote]) => {
          const { from, dur } = at(name);
          return (
            <Sequence key={name} from={from} durationInFrames={dur}>
              <Head name={name} icon={icon} num={num} quote={quote} />
            </Sequence>
          );
        })}
        {SPECIAL.map(([name, C]) => {
          const { from, dur } = at(name);
          return (
            <Sequence key={name} from={from} durationInFrames={dur}>
              <C />
            </Sequence>
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};
