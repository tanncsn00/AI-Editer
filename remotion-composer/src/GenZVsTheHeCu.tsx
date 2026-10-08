import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./gvtc_beats.json";
import T from "./gvtc_timings.json";

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
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 20%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 84%, " + JADE + "14 0%, transparent 62%)" }} />
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
  return <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>;
};

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 78, color = RED, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 8), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>
      {children}
    </div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 54, color = GOLD, children }) => {
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

const Says: React.FC<{ e: number; who: string; text: string; color: string; size?: number; align?: "flex-start" | "flex-end" }> = ({ e, who, text, color, size = 46, align = "flex-start" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...fadeUp(f, e), width: "100%", display: "flex", flexDirection: "column", alignItems: align, gap: 10, textAlign: align === "flex-end" ? "right" : "left" }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{who}</div>
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
          padding: "18px 26px",
          maxWidth: 860,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Icon: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 62, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 7), fontSize: size }}>{children}</div>;
};

const ChapterHead: React.FC<{ dot: number; q: number; num: string; quote: string; qSize?: number }> = ({ dot, q, num, quote, qSize = 58 }) => {
  const f = useCurrentFrame();
  return (
    <Stage gap={38}>
      <div style={{ ...fadeUp(f, dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>⚔️</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, fontWeight: 700, color: GOLD, letterSpacing: 5 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, dot, 7, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Big e={q} size={qSize} color={TEXT}>{quote}</Big>
    </Stage>
  );
};

type El =
  | { k: "l"; key: string; t: string; size?: number; color?: string; weight?: number }
  | { k: "big"; key: string; t: string; size?: number; color?: string }
  | { k: "quote"; key: string; t: string; size?: number; color?: string }
  | { k: "icon"; key: string; t: string; size?: number }
  | { k: "says"; key: string; who: string; t: string; color: string; size?: number; align?: "flex-start" | "flex-end" };

const ln = (key: string, t: string, size?: number, color?: string, weight?: number): El => ({ k: "l", key, t, size, color, weight });
const bg = (key: string, t: string, size?: number, color?: string): El => ({ k: "big", key, t, size, color });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const ic = (key: string, t: string, size?: number): El => ({ k: "icon", key, t, size });
const tl = (key: string, t: string, size?: number): El => ({ k: "says", key, who: "TRƯỞNG LÃO", t, color: GOLD, size, align: "flex-start" });
const gz = (key: string, t: string, size?: number): El => ({ k: "says", key, who: "GEN Z", t, color: JADE, size, align: "flex-end" });
const dc = (key: string, t: string, size?: number): El => ({ k: "says", key, who: "ĐỆ TỬ THẾ HỆ CŨ", t, color: SEC, size, align: "flex-start" });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  HOOK: { gap: 20, els: [bg("big", "17 GIỜ\n59 PHÚT.", 130, GOLD)] },
  LENH: { gap: 24, els: [ln("l0", "Trưởng Lão truyền xuống\nmột đạo lệnh:", 44, SEC), tl("s0", "“Em.”\n“Cái này tối nay làm xong nhé.”", 44)] },
  DETU_CU: { gap: 24, els: [dc("s0", "“Dạ.”", 52)] },
  GENZ_DONG: { gap: 24, els: [ln("l0", "Nhưng Gen Z…", 48, TEXT), ic("i0", "💻", 74), ln("l1", "đóng laptop.", 46, SEC), bg("big", "“DẠ KHÔNG Ạ.”", 76, JADE)] },
  AM1: { gap: 26, els: [bg("am", "ẦM!!!", 126, RED), ln("l0", "Cả Công Sở Giới…", 46, SEC), bg("big", "IM LẶNG.", 84, TEXT)] },
  TL_HOI: { gap: 24, els: [tl("s0", "“Ngươi vừa nói cái gì?”", 50)] },
  GENZ_TRA: { gap: 22, els: [gz("s0", "“Em không làm tối nay.”\n“Mai em làm.”", 46)] },
  TL_NGAYXUA: { gap: 24, els: [tl("s0", "“Ngày xưa bọn anh…”", 50)] },
  GENZ_DA: { gap: 22, els: [gz("s0", "“Dạ.”\n“Nhưng…”", 48)] },
  NGAYXUA_LA: { gap: 28, els: [bg("b0", "“NGÀY XƯA\nLÀ NGÀY XƯA.”", 74, JADE), bg("b1", "“KIẾP NÀY…\nEM LÀM KHÁC.”", 74, RED)] },
  KHOANHKHAC: { gap: 26, els: [ln("l0", "Và đó…\nlà khoảnh khắc…", 44, SEC), ic("i0", "⚔️", 72), bg("big", "ĐẠI CHIẾN\nGEN Z vs THẾ HỆ CŨ", 66, GOLD), ln("l1", "chính thức khai màn.", 44, SEC)] },
  HAI_DAO: { gap: 26, els: [ln("l0", "Một bên tu theo…", 42, SEC), qt("q0", "CỔ ĐẠO CÔNG SỞ.", 54, GOLD), ln("l1", "Một bên tu theo…", 42, SEC), qt("q1", "ĐẠO RANH GIỚI.", 54, JADE)] },
  KHONG_LUOI: { gap: 26, els: [ln("l0", "Không phải vì ai lười hơn.", 46, TEXT), ln("l1", "Mà vì…", 44, SEC), bg("big", "hai thế hệ đang dùng\nHAI BỘ CÔNG PHÁP KHÁC NHAU\nđể định nghĩa thế nào là\nmột người đi làm tốt.", 44, TEXT)] },

  CG1_GAP: { gap: 24, els: [tl("s0", "“Việc gấp.”", 50), gz("s1", "“GẤP TỪ KHI NÀO Ạ?”", 50)] },
  CG1_PHATSINH: { gap: 22, els: [tl("s0", "“Giờ mới phát sinh.”", 44), gz("s1", "“Vậy nếu thật sự cần tối nay…”\n“mình thống nhất OT\nvà ưu tiên việc này.”", 42)] },
  CG1_CONKHONG: { gap: 24, els: [gz("s0", "“Còn không…”\n“em làm trong giờ ngày mai.”", 44), bg("am", "ẦM!", 110, RED)] },
  CG1_CHANDONG: { gap: 26, els: [ln("l0", "Đạo tâm các trưởng lão…", 46, SEC), bg("big", "CHẤN ĐỘNG.", 96, RED)] },
  CG1_NGAYTRUOC: { gap: 24, els: [ln("l0", "Ngày trước…", 44, SEC), bg("big", "nhiều người coi\nở lại lâu là TẬN TÂM.", 50, GOLD)] },
  CG1_HOI: { gap: 24, els: [ln("l0", "Gen Z lại hỏi:", 44, SEC), bg("b0", "“KẾT QUẢ ĐÂU?”", 64, JADE), bg("b1", "“DEADLINE ĐÂU?”", 64, JADE)] },
  CG1_TAISAO: { gap: 24, els: [bg("big", "“Và tại sao\nthời gian cá nhân của em\nmặc định là\nTHỜI GIAN LÀM VIỆC?”", 50, JADE)] },
  CG1_RANHGIOI: { gap: 26, els: [ln("l0", "Không phải không làm.", 46, TEXT), ln("l1", "Mà là…", 44, SEC), bg("big", "RANH GIỚI\nPHẢI ĐƯỢC NÓI RÕ.", 70, JADE)] },
  CG1_CONGHIEN: { gap: 22, els: [tl("s0", "“Ngươi không có\ntinh thần cống hiến?”", 44), gz("s1", "“Có ạ.”", 48)] },
  CG1_ONLINE: { gap: 24, els: [ln("l0", "“Nhưng cống hiến…”", 46, SEC), bg("big", "“không có nghĩa là\nLÚC NÀO CŨNG ONLINE.”", 54, JADE)] },
  CG1_IMLANG: { gap: 26, els: [tl("s0", "“……”", 56), qt("q0", "CỔ ĐẠO TẬN TÂM…\ngặp ĐẠO RANH GIỚI.", 50, GOLD)] },

  CG2_DOI: { gap: 22, els: [tl("s0", "“Đổi toàn bộ trận pháp này.”", 44), gz("s1", "“TẠI SAO Ạ?”", 54)] },
  CG2_CULAM: { gap: 24, els: [tl("s0", "“Cứ làm đi.”", 50), gz("s1", "“Nhưng mục tiêu là gì?”", 46)] },
  CG2_REQ: { gap: 22, els: [gz("s0", "“Requirement cuối là gì?”\n“Ưu tiên việc này\nhay việc kia?”", 44)] },
  CG2_NGAYXUA: { gap: 24, els: [tl("s0", "“Ngày xưa bọn ta…”\n“được giao việc là làm.”", 46)] },
  CG2_EMHIEU: { gap: 22, els: [gz("s0", "“Em hiểu.”\n“Nhưng em không muốn…”\n“làm rất đúng…”", 44)] },
  CG2_KHONGAICAN: { gap: 26, els: [bg("big", "“MỘT THỨ\nKHÔNG AI CẦN.”", 78, RED), bg("am", "ẦM!", 100, RED)] },
  CG2_CAITA: { gap: 22, els: [tl("s0", "“Ngươi đang cãi ta?”", 48), gz("s1", "“Không ạ.”", 48)] },
  CG2_VANDE: { gap: 24, els: [ln("l0", "“Em đang hỏi…”", 46, SEC), bg("big", "“EM ĐANG GIẢI QUYẾT\nVẤN ĐỀ GÌ?”", 64, JADE)] },
  CG2_VANHAU: { gap: 26, els: [ln("l0", "Và đây mới là thứ…", 44, SEC), bg("big", "khiến hai thế hệ\nDỄ VA NHAU.", 62, RED)] },
  CG2_QUEN: { gap: 24, els: [ln("l0", "Người cũ có thể quen:", 44, SEC), qt("q0", "“ĐƯỢC GIAO THÌ LÀM.”", 56, GOLD)] },
  CG2_CONTEXT: { gap: 24, els: [ln("l0", "Gen Z lại muốn:", 44, SEC), qt("q0", "“CHO EM CONTEXT.”", 60, JADE)] },
  CG2_TOANG: { gap: 24, els: [ln("l0", "Bởi vì…", 42, SEC), ln("l1", "làm đúng requirement…\nnhưng sai mục tiêu…", 46, TEXT), bg("big", "thì vẫn TOANG.", 76, RED)] },
  CG2_EMOI: { gap: 22, els: [ln("l0", "Rồi Trưởng Lão lại truyền xuống:", 40, SEC), tl("s0", "“Em ơi…”\n“À tiện thể hỗ trợ anh cái này.”\n“Cái này nhỏ thôi.”", 42)] },
  CG2_5PHUT: { gap: 24, els: [ln("l0", "Năm phút sau…", 44, SEC), tl("s0", "“Làm luôn cái kia nhé.”", 44), ln("l1", "Ba mươi phút sau…", 44, SEC)] },
  CG2_7NGHIEP: { gap: 24, els: [bg("big", "MỘT VIỆC NHỎ\nSINH RA\nBẢY NGHIỆP LỚN.", 72, RED)] },
  CG2_TASKLIST: { gap: 22, els: [ln("l0", "Gen Z nhìn task list:", 42, SEC), gz("s0", "“Được ạ.”\n“Nhưng thêm việc này…”", 44), bg("big", "“THÌ VIỆC NÀO BỎ?”", 62, JADE)] },
  CG2_LINHDONG: { gap: 20, els: [tl("s0", "“Em linh động một chút.”", 44), gz("s1", "“Được.”\n“Nhưng người…”", 44), bg("big", "“VẪN CHỈ CÓ MỘT.”", 62, JADE)] },
  CG2_AM: { gap: 26, els: [bg("am", "ẦM!!!", 118, RED), ln("l0", "Đó chính là\nkiểu thẳng rất đặc trưng:", 44, SEC)] },
  CG2_KHONGOM: { gap: 24, els: [ln("l0", "Không ôm hết.", 50, TEXT), ln("l1", "Không giả vờ:", 44, SEC), qt("q0", "“Dạ em cố.”", 52, MUTE)] },
  CG2_HOITHANG: { gap: 22, els: [ln("l0", "Mà hỏi thẳng:", 44, SEC), bg("b0", "“VIỆC NÀO ƯU TIÊN?”", 56, JADE), bg("b1", "“DEADLINE NÀO THẬT?”", 56, JADE), bg("b2", "“CÁI NÀO BỎ?”", 56, JADE)] },
  CG2_TRACHNHIEM: { gap: 26, els: [ln("l0", "Không phải để chống đối.", 46, TEXT), ln("l1", "Mà để…", 42, SEC), bg("big", "biến một đống mệnh lệnh mơ hồ\nthành thứ\nCÓ THỂ CHỊU TRÁCH NHIỆM.", 48, GOLD)] },

  CG3_LONNHAT: { gap: 24, els: [ln("l0", "Nhưng trận chiến lớn nhất…", 46, SEC), ln("l1", "không nằm ở OT.\nKhông nằm ở deadline.", 46, TEXT), bg("big", "Mà nằm ở…\nCÁCH NÓI CHUYỆN.", 62, GOLD)] },
  CG3_HOI: { gap: 24, els: [tl("s0", "“Em thấy kế hoạch này\nthế nào?”", 46)] },
  CG3_DETUCU: { gap: 22, els: [dc("s0", "“Dạ…”\n“Em thấy cũng ổn ạ.”", 46)] },
  CG3_CHACLA: { gap: 22, els: [tl("s0", "“Có vấn đề gì không?”", 46), dc("s1", "“Dạ…”\n“Chắc là không ạ.”", 44)] },
  CG3_DEOON: { gap: 26, els: [ln("l0", "Ra khỏi đại điện…", 44, SEC), bg("big", "“ĐÉO ỔN TÍ NÀO.”", 78, RED)] },
  CG3_GENZVAO: { gap: 24, els: [ln("l0", "Rồi Gen Z bước vào.", 48, TEXT), tl("s0", "“Em thấy kế hoạch này\nthế nào?”", 44)] },
  CG3_COVANDE: { gap: 22, els: [gz("s0", "“Em thấy có vấn đề.”", 48), tl("s1", "“Vấn đề gì?”", 48)] },
  CG3_LIETKE: { gap: 20, els: [bg("b0", "“Deadline quá ngắn.”", 54, JADE), bg("b1", "“Scope quá rộng.”", 54, JADE), bg("b2", "“Thiếu người.”", 54, JADE)] },
  CG3_CATSCOPE: { gap: 26, els: [ln("l0", "“Nếu giữ deadline…”", 48, SEC), bg("big", "“PHẢI CẮT SCOPE.”", 76, JADE)] },
  CG3_PHANDOI: { gap: 22, els: [tl("s0", "“Ngươi đang phản đối ta?”", 44), gz("s1", "“Không.”", 48), bg("big", "“EM ĐANG PHẢN ĐỐI\nCÁI KẾ HOẠCH.”", 58, RED)] },
  CG3_BUM: { gap: 26, els: [bg("am", "BÙM!!!", 124, RED), ln("l0", "Cả đại điện…", 46, SEC), bg("big", "IM PHĂNG PHẮC.", 74, TEXT)] },
  CG3_KHACBIET: { gap: 24, els: [ln("l0", "Đây chính là khác biệt.", 46, TEXT), ln("l1", "Thế hệ cũ đôi khi quen với:", 42, SEC), qt("q0", "“THẲNG VỚI CẤP TRÊN\n= HỖN.”", 52, GOLD)] },
  CG3_CHUYENNGHIEP: { gap: 24, els: [ln("l0", "Gen Z lại muốn:", 44, SEC), qt("q0", "“THẲNG VÀO VẤN ĐỀ\n= CHUYÊN NGHIỆP.”", 52, JADE)] },
  CG3_NGU: { gap: 24, els: [ln("l0", "Nhưng nhớ…", 44, SEC), qt("q0", "“Anh ngu như tuất.”", 52, MUTE), ln("l1", "Không phải thẳng.\nĐấy là…", 44, TEXT), bg("big", "TỰ SÁT NGHỀ NGHIỆP.", 62, RED)] },
  CG3_THANGLA: { gap: 20, els: [ln("l0", "Thẳng là:", 44, SEC), gz("s0", "“Em không đồng ý vì…”\n“Rủi ro nằm ở đây.”\n“Phương án này có vấn đề.”\n“Em đề xuất cách khác.”", 40)] },
  CG3_NOIVAOVIEC: { gap: 28, els: [bg("big", "NÓI VÀO VIỆC.", 88, JADE), ln("l0", "Không đánh vào người.", 50, SEC)] },

  KET_BATRAN: { gap: 26, els: [ln("l0", "Và sau ba trận…", 46, SEC), bg("big", "Công Sở Giới mới hiểu.", 58, TEXT)] },
  KET_KINHNGHIEM: { gap: 24, els: [ln("l0", "Thế hệ cũ có…", 42, SEC), bg("b0", "KINH NGHIỆM.", 72, GOLD), ln("l1", "Gen Z có…", 42, SEC), bg("b1", "CÂU HỎI.", 72, JADE)] },
  KET_CHIUDUNG: { gap: 24, els: [ln("l0", "Thế hệ cũ biết…", 42, SEC), bg("b0", "CHỊU ĐỰNG.", 72, GOLD), ln("l1", "Gen Z biết…", 42, SEC), bg("b1", "ĐẶT GIỚI HẠN.", 68, JADE)] },
  KET_HAIBEN: { gap: 22, els: [ln("l0", "Một bên nói:", 40, SEC), qt("q0", "“Ngày xưa bọn anh\nvẫn làm thế.”", 46, GOLD), ln("l1", "Một bên hỏi:", 40, SEC), qt("q1", "“Nhưng cách đó còn hợp\nvới kiếp này không?”", 46, JADE)] },
  KET_DAIKIEP: { gap: 26, els: [ln("l0", "Và đó…", 44, SEC), bg("big", "mới là\nĐẠI KIẾP THẬT SỰ.", 72, RED)] },
  KET_KHONGAITHANG: { gap: 24, els: [ln("l0", "Không phải Gen Z thắng.", 48, JADE), ln("l1", "Cũng không phải\nthế hệ cũ thắng.", 48, GOLD), ln("l2", "Mà là…", 44, SEC)] },
  KET_CONGPHAP: { gap: 26, els: [bg("b0", "CÔNG PHÁP CŨ\nCÓ THỂ TRUYỀN LẠI.", 58, GOLD), ln("l0", "Nhưng không phải công pháp nào…", 42, SEC), bg("b1", "cũng phải TU CẢ ĐỜI.", 58, TEXT)] },
  KET_CHAPTAY: { gap: 22, els: [ln("l0", "Còn Trưởng Lão vẫn nói:", 40, SEC), tl("s0", "“Ngày xưa bọn anh…”", 44), ln("l1", "Gen Z chỉ chắp tay:", 40, SEC), gz("s1", "“Dạ em hiểu.”\n“Nhưng…”", 44)] },
  KET_FINAL: { gap: 28, els: [bg("b0", "“NGÀY XƯA\nLÀ NGÀY XƯA.”", 72, GOLD), bg("b1", "“KIẾP NÀY…\nĐỂ EM THỬ CÁCH KHÁC.”", 66, JADE)] },
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
        return <Says key={el.key} e={entry} who={el.who} text={el.t} color={el.color} size={el.size} align={el.align} />;
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
          ...pop(f, e.btn ?? 0, 9),
          fontFamily: "Be Vietnam Pro",
          fontSize: 56,
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
      <Line e={e.l0 ?? 0} size={46}>để sống sót</Line>
      <Big e={e.big ?? 0} size={72} color={GOLD}>CHỐN CÔNG SỞ</Big>
    </Stage>
  );
};

const HEADS: Array<[string, string, string, number]> = [
  ["CG1_HEAD", "CẢNH GIỚI THỨ NHẤT", "18 GIỜ", 92],
  ["CG2_HEAD", "CẢNH GIỚI THỨ HAI", "“TẠI SAO?”", 88],
  ["CG3_HEAD", "CẢNH GIỚI THỨ BA", "ĐẠO THẲNG", 88],
];

export const GenZVsTheHeCu: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("gvtc/voice.mp3")} />
    {bgm ? <Audio src={staticFile("gvtc/bgm.mp3")} /> : null}
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
      const e = E[name] ?? {};
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <ChapterHead dot={e.dot ?? 0} q={e.q ?? 0} num={num} quote={quote} qSize={qSize} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
