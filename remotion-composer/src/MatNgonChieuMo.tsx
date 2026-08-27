import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mncm_beats.json";
import T from "./mncm_timings.json";

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
    <Skull e={ec.skull} />
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
  MODAU: { gap: 26, els: [ln("l0", "Tương truyền…"), ln("l1", "trong CÔNG SỞ GIỚI,", 60, GOLD, 800), ln("l2", "có một nhóm tu sĩ…"), ln("l3", "không trực tiếp làm việc.", 52, TEXT, 700)] },
  MODAU2: { gap: 22, els: [ln("l0", "Không trực tiếp quản lý.", 48), gp(14), ln("l1", "Nhưng ngày ngày…", 46), ln("l2", "đi khắp nhân gian…", 46), bg("big", "TÌM KIẾM NGƯỜI\nCÓ LINH CĂN.", 62, GOLD)] },
  MODAU3: { gap: 18, els: [ln("l0", "Thấy kẻ có thiên phú…", 46), ln("l1", "liền truyền âm.", 50, TEXT, 700), gp(16), ln("l2", "Thấy người có căn cốt…", 46), ln("l3", "liền gửi thiệp.", 50, TEXT, 700)] },
  MODAU4: { gap: 26, els: [ln("l0", "Đưa về tông môn…", 48), ln("l1", "rồi giao cho Trưởng lão…", 46), bg("big", "ĐỘ KIẾP.", 88, RED)] },
  MODAU5: { gap: 28, els: [ln("top", "Người đời gọi đó là…"), ic("big", "📜"), bg("big", "MẬT NGÔN\nCHIÊU MỘ.", 84, GOLD)] },

  M1_VUI: { gap: 18, els: [ln("l0", "Ngươi vui mừng.", 50, TEXT, 700), ln("l1", "Sửa lại CV.", 46), ln("l2", "Chải chuốt LinkedIn.", 46), ln("l3", "Mở laptop.", 46), ln("l4", "Chuẩn bị đạo tâm.", 48, JADE, 700)] },
  M1_TRUYEN: { gap: 26, els: [ln("l0", "Recruiter truyền âm:", 46, SEC, 700), qt("q", "“Chị muốn trao đổi với em\nvề một cơ hội.”", 50)] },
  M1_HOI: { gap: 20, els: [ln("l0", "Ngươi hỏi:", 44), qt("q0", "“Dạ, vị trí gì ạ?”", 48), gp(14), ln("l1", "“À…”", 52, MUTE, 700), qt("q1", "“Chị gửi JD cho em nhé.”", 48)] },
  M1_JD: { gap: 26, els: [ln("l0", "Ngươi mở JD.", 52, TEXT, 700), ln("l1", "Yêu cầu:", 46)] },
  M1_YEU1: { gap: 20, els: [ln("l0", "3 năm kinh nghiệm.", 50, TEXT, 600), ln("l1", "5 kỹ năng.", 50, TEXT, 600), ln("l2", "7 công nghệ.", 50, TEXT, 600)] },
  M1_YEU2: { gap: 18, els: [ln("l0", "Tiếng Anh.", 48, TEXT, 600), ln("l1", "Lãnh đạo.", 48, TEXT, 600), ln("l2", "Giao tiếp.", 48, TEXT, 600), ln("l3", "Chịu áp lực.", 48, TEXT, 600)] },
  M1_YEU3: { gap: 18, els: [ln("l0", "Làm việc độc lập.", 48, TEXT, 600), ln("l1", "Làm việc nhóm.", 48, TEXT, 600), gp(16), ln("l2", "Và một chút…", 46), bg("big", "ĐAM MÊ.", 92, RED), sk("skull")] },
  M1_REVEAL: { gap: 20, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ:"), gp(12), ln("l2", "CV của ngươi…", 48), ln("l3", "không phải ấn tượng.", 50, TEXT, 700), gp(12), ln("l4", "Nó chỉ vừa đủ…", 46), bg("big", "ĐỂ BƯỚC VÀO\nCỬA THIÊN KIẾP.", 60, RED)] },

  M2_HOI1: { gap: 20, els: [ln("l0", "Ngươi hỏi:", 44), qt("q0", "“Range cụ thể\nkhoảng bao nhiêu ạ?”", 46), gp(14), ln("l1", "Recruiter:", 44, SEC, 700), qt("q1", "“Còn tùy vào\nkinh nghiệm của em.”", 46)] },
  M2_NOI: { gap: 20, els: [ln("l0", "Ngươi nói mức mong muốn.", 46), ln("l1", "Recruiter im lặng.", 46, SEC, 700), gp(14), ln("l2", "Một hồi sau…", 44), qt("q0", "“Ồ…”", 52), qt("q1", "“Mức đó hơi cao.”", 48, RED)] },
  M2_HOI2: { gap: 20, els: [ln("l0", "Ngươi hỏi:", 44), qt("q0", "“Vậy range bên mình\nkhoảng bao nhiêu ạ?”", 46), gp(14), ln("l1", "Recruiter mỉm cười:", 44, SEC, 700), qt("q1", "“Bên chị khá linh hoạt.”", 48)] },
  M2_LINH: { gap: 24, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ:")] },
  M2_LINHHOAT: { gap: 22, els: [ln("l0", "Lương có thể linh hoạt.", 50, TEXT, 600), ln("l1", "Deadline có thể linh hoạt.", 50, TEXT, 600), ln("l2", "Scope có thể linh hoạt.", 50, TEXT, 600)] },
  M2_REVEAL: { gap: 26, els: [ln("l0", "Nhưng kỳ lạ thay…", 48), bg("big", "NGÂN SÁCH LUÔN LINH HOẠT\nTHEO MỘT HƯỚNG.", 54, RED), sk("skull")] },

  M3_VONG1: { gap: 16, els: [ln("l0", "Vòng một:", 44), ln("r0", "Recruiter.", 54, GOLD, 800), gp(16), ln("l1", "Vòng hai:", 44), ln("r1", "Hiring Manager.", 54, GOLD, 800)] },
  M3_VONG2: { gap: 16, els: [ln("l0", "Vòng ba:", 44), ln("r0", "Team Lead.", 54, GOLD, 800), gp(16), ln("l1", "Vòng bốn:", 44), ln("r1", "Director.", 54, GOLD, 800)] },
  M3_VONG3: { gap: 16, els: [ln("l0", "Vòng năm:", 44), ln("r0", "CEO.", 54, GOLD, 800), gp(16), ln("l1", "Vòng sáu…", 44), bg("big", "MỘT VỊ TRƯỞNG LÃO\nMÀ NGƯƠI CHƯA TỪNG\nĐƯỢC BÁO TRƯỚC.", 50, RED)] },
  M3_LAM: { gap: 18, els: [ln("l0", "Ngươi làm test.", 48, TEXT, 600), ln("l1", "Phỏng vấn.", 48, TEXT, 600), ln("l2", "Làm assignment.", 48, TEXT, 600), ln("l3", "Trình bày.", 48, TEXT, 600), ln("l4", "Phỏng vấn lại.", 48, TEXT, 600)] },
  M3_CUOI: { gap: 24, els: [ln("l0", "Cuối cùng…", 46), ln("l1", "Recruiter truyền âm:", 46, SEC, 700), qt("q", "“Bên chị muốn\nhiểu thêm về em.”", 48)] },
  M3_LICH: { gap: 20, els: [ln("l0", "Ngươi nhìn lịch.", 46), ln("l1", "Nhìn lại lịch sử phỏng vấn.", 46), gp(14), ln("l2", "Rồi chợt nhận ra…", 46), bg("big", "TÔNG MÔN ĐÃ HIỂU NGƯƠI\nGẦN HẾT CUỘC ĐỜI.", 54, RED), sk("skull")] },
  M3_REVEAL: { gap: 20, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ:"), gp(12), ln("l2", "“Process hơi dài”…", 48, GOLD, 800), ln("l3", "không phải quy trình tuyển dụng.", 44), gp(12), ln("l4", "Đó là…", 46), bg("big", "MỘT TIỂU THIÊN KIẾP.", 62, RED)] },

  M4_CHO: { gap: 16, els: [ln("l0", "Ngươi chờ.", 52, TEXT, 700), gp(18), ln("l1", "Một ngày.", 46), ln("l2", "Ba ngày.", 46), ln("l3", "Một tuần.", 46), ln("l4", "Hai tuần.", 48, RED, 700)] },
  M4_KHONG: { gap: 22, els: [ln("l0", "Không tin nhắn.", 50, SEC, 600), ln("l1", "Không email.", 50, SEC, 600), ln("l2", "Không tín hiệu.", 50, SEC, 600)] },
  M4_TUHOI: { gap: 26, els: [ln("l0", "Ngươi bắt đầu tự hỏi:", 46), qt("q", "“Hay mình fail?”", 54, RED)] },
  M4_TING: { gap: 24, els: [ln("l0", "Rồi đúng lúc đạo tâm\nchuẩn bị tan vỡ…", 46), bg("big", "TING.", 96, JADE), ln("l1", "Một đạo truyền âm xuất hiện.", 46)] },
  M4_MO: { gap: 22, els: [qt("q0", "“Hi em…”", 52), ln("l0", "Ngươi mở ra.", 46), qt("q1", "“Chị xin lỗi vì\nphản hồi muộn…”", 46)] },
  M4_KEO: { gap: 20, els: [ln("l0", "Ngươi mừng.", 48, JADE, 700), ln("l1", "Kéo xuống.", 46), gp(14), qt("q", "“…hiện tại bên chị đang\ntạm dừng tuyển vị trí này.”", 46, RED), sk("skull")] },
  M4_DAT: { gap: 22, els: [ln("l0", "Ngươi đặt điện thoại xuống.", 46), ln("l1", "Nhìn xa xăm.", 46), gp(14), ln("l2", "Một chiếc lá rơi\nngoài cửa sổ.", 48, SEC, 600)] },
  M4_REVEAL: { gap: 18, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi hiểu:"), gp(12), bg("big1", "“PHẢN HỒI SỚM”", 62, GOLD), ln("l2", "là một loại thần thông…", 46), gp(12), ln("l3", "mà chỉ có…", 44), bg("big2", "THIÊN ĐẠO MỚI BIẾT\nKHI NÀO KÍCH HOẠT.", 54, RED)] },

  M5_GUI1: { gap: 20, els: [ln("l0", "CV đã gửi.", 50, TEXT, 600), ln("l1", "LinkedIn đã gửi.", 50, TEXT, 600), ln("l2", "Portfolio đã gửi.", 50, TEXT, 600)] },
  M5_GUI2: { gap: 20, els: [ln("l0", "GitHub đã gửi.", 50, TEXT, 600), ln("l1", "Email đã gửi.", 50, TEXT, 600), ln("l2", "Số điện thoại đã gửi.", 50, TEXT, 600)] },
  M5_DU: { gap: 28, els: [ln("l0", "Ngươi tưởng…", 48), bg("big", "ĐỦ RỒI.", 88, JADE)] },
  M5_FORM: { gap: 22, els: [ln("l0", "Recruiter truyền âm:", 46, SEC, 700), qt("q", "“Em điền giúp chị\nform này nhé.”", 48), gp(12), ln("l1", "Ngươi mở form.", 48, TEXT, 700)] },
  M5_DIEN1: { gap: 20, els: [ln("l0", "Họ tên.", 48, SEC, 600), ln("l1", "Kinh nghiệm.", 48, SEC, 600), ln("l2", "Mức lương.", 48, SEC, 600)] },
  M5_DIEN2: { gap: 20, els: [ln("l0", "Ngày có thể nhận việc.", 48, SEC, 600), ln("l1", "Lý do nghỉ việc.", 48, SEC, 600), ln("l2", "Thông tin liên hệ.", 48, SEC, 600)] },
  M5_UPLOAD: { gap: 24, els: [ln("l0", "Rồi kéo xuống cuối…", 46), bg("big", "UPLOAD CV.", 82, RED), ln("l1", "Ngươi đứng hình.", 48, TEXT, 700), sk("skull")] },
  M5_BOI: { gap: 22, els: [ln("l0", "Bởi thứ được yêu cầu upload…", 44), ln("l1", "chính là thứ…", 46), gp(12), bg("big", "NGƯƠI VỪA GỬI\nTỪ MƯỜI PHÚT TRƯỚC.", 58, RED)] },
  M5_REVEAL: { gap: 18, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ:"), gp(12), ln("l2", "Chiêu Mộ không chỉ là tìm người.", 44), gp(12), ln("l3", "Nó còn là…", 46), bg("big", "THU THẬP HỒ SƠ\nĐỂ NGHIỆP LỰC\nCÓ ĐỦ DỮ LIỆU.", 56, GOLD)] },

  KET1: { gap: 26, els: [ln("l0", "Năm câu.", 56, TEXT, 700), ln("l1", "Năm mật ngôn.", 60, GOLD, 800)] },
  KET2: { gap: 24, els: [ln("l0", "Người ngoài nghe thấy…", 46), ln("l1", "chỉ tưởng là những\ncâu nói rất lịch sự.", 48, SEC, 600)] },
  KET3: { gap: 22, els: [ln("l0", "Còn người từng đi tìm việc\nnghe thấy…", 46), ln("l1", "đã biết…", 46), gp(12), bg("big", "ĐẠI KIẾP ĐANG Ở\nNGAY PHÍA TRƯỚC.", 60, RED)] },
  KET4: { gap: 22, els: [ln("l0", "Bởi trong Công Sở Giới…", 46), ln("l1", "Chiêu Mộ không quyết định\nngươi có được nhận hay không.", 44), gp(12), bg("big", "Chiêu Mộ chỉ\nMỞ CÁNH CỬA.", 58, GOLD)] },
  KET5: { gap: 14, els: [ln("l0", "Còn phía sau cánh cửa ấy…", 46), gp(16), ln("r0", "là Recruiter.", 48, GOLD, 800), ln("r1", "Hiring Manager.", 48, GOLD, 800), ln("r2", "Team Lead.", 48, GOLD, 800), ln("r3", "Director.", 48, GOLD, 800), ln("r4", "CEO.", 48, GOLD, 800)] },
  KET6: { gap: 28, els: [ln("l0", "Và vô số tầng…", 48), bg("big", "NHÂN QUẢ.", 92, RED)] },
  KET7: { gap: 20, els: [ln("l0", "Đến cuối cùng…", 46), ln("l1", "nếu ngươi vượt qua tất cả…", 46), gp(14), ln("l2", "Recruiter truyền xuống một câu:", 42, SEC, 700), qt("q", "“CHÚC MỪNG EM,\nBÊN CHỊ MUỐN GỬI OFFER.”", 46, JADE)] },
  KET8: { gap: 20, els: [ln("l0", "Ngươi bật khóc.", 48, TEXT, 700), ln("l1", "Đạo tâm rung chuyển.", 46), gp(14), ln("l2", "Bao nhiêu ngày chờ đợi…", 46), ln("l3", "cuối cùng cũng có kết quả.", 48, JADE, 700)] },
  KET9: { gap: 24, els: [ln("l0", "Ngươi mở Offer.", 48, TEXT, 700), ln("l1", "Mức lương:", 46), bg("big", "THẤP HƠN MỨC NGƯƠI\nĐÃ NÓI TỪ VÒNG ĐẦU.", 54, RED), sk("skull")] },
  KET10: { gap: 22, els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi mới thực sự hiểu…"), gp(12), bg("big", "CHIÊU MỘ…", 72, GOLD), ln("l2", "không phải con đường tìm việc.", 46)] },
  KET11: { gap: 28, els: [ln("l0", "Đó là…", 48), bg("big", "CON ĐƯỜNG\nTU LUYỆN Ý CHÍ.", 66, GOLD)] },
  KET12: { gap: 28, els: [ln("top", "Đây chính là…", 48), ic("big", "🏯"), bg("big", "THIÊN CƠ\nMẬT NGÔN.", 80, GOLD)] },
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
      <Line e={e.l0} size={44}>để mỗi ngày…</Line>
      <Line e={e.l1} size={46} color={JADE} weight={700}>cùng các tu sĩ Công Sở…</Line>
      <Big e={e.big} size={54} color={GOLD}>{"ĐỘ KIẾP TRÊN\nCON ĐƯỜNG CHIÊU MỘ."}</Big>
    </Stage>
  );
};

const HEADS: Array<[string, string, string, number]> = [
  ["M1_HEAD", "ĐỆ NHẤT MẬT NGÔN", "“CV CỦA EM\nRẤT ẤN TƯỢNG.”", 58],
  ["M2_HEAD", "ĐỆ NHỊ MẬT NGÔN", "“RANGE LƯƠNG BÊN CHỊ\nKHÁ CẠNH TRANH.”", 50],
  ["M3_HEAD", "ĐỆ TAM MẬT NGÔN", "“PROCESS BÊN CHỊ\nHƠI DÀI MỘT CHÚT.”", 52],
  ["M4_HEAD", "ĐỆ TỨ MẬT NGÔN", "“CHỊ SẼ PHẢN HỒI\nSỚM NHÉ.”", 58],
  ["M5_HEAD", "ĐỆ NGŨ MẬT NGÔN", "“EM CÓ THỂ CHO CHỊ XIN\nTHÊM MỘT CHÚT\nTHÔNG TIN KHÔNG?”", 44],
];

const PAIRS: Array<[string, string, string, string, string, number]> = [
  ["M1_PAIR", "NGƯỜI MỚI NGHE", "TU SĨ LÂU NĂM NGHE", "“Cuối cùng cũng có người\nđọc CV của mình.”", "“NGƯƠI ĐÃ ĐƯỢC\nTÔNG MÔN ĐỂ Ý.”", 48],
  ["M2_PAIR", "NGƯỜI MỚI NGHE", "TU SĨ LÂU NĂM NGHE", "“Chắc lương cao.”", "“ĐỪNG HỎI CON SỐ.”", 56],
  ["M3_PAIR", "NGƯỜI MỚI NGHE", "TU SĨ LÂU NĂM NGHE", "“Chắc hai vòng.”", "“NGƯƠI SẮP GẶP\nCẢ TÔNG MÔN.”", 52],
  ["M4_PAIR", "NGƯỜI MỚI NGHE", "TU SĨ LÂU NĂM NGHE", "“Mai chắc có kết quả.”", "“THIÊN ĐẠO CHƯA QUYẾT.”", 50],
  ["M5_PAIR", "NGƯỜI MỚI NGHE", "TU SĨ LÂU NĂM NGHE", "“Một câu hỏi\nbình thường.”", "“HỒ SƠ NGƯƠI\nCHƯA ĐỦ.”", 54],
];

export const MatNgonChieuMo: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("mncm/voice.mp3")} />
    {bgm ? <Audio src={staticFile("mncm/bgm.mp3")} /> : null}
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
