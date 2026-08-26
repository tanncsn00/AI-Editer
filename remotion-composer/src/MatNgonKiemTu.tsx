import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mnkt_beats.json";
import T from "./mnkt_timings.json";

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
  k: "l" | "big" | "skull" | "gap" | "icon";
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
const gp = (h = 14): El => ({ k: "gap", h });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  MODAU: {
    gap: 26,
    els: [
      ln("l0", "Tương truyền…"),
      ln("l1", "trong CÔNG NGHỆ TÔNG,", 62, GOLD, 800),
      ln("l2", "có một loại tu sĩ…"),
      ln("l3", "không luyện đan.", 54, TEXT, 800),
    ],
  },
  MODAU2: {
    gap: 30,
    els: [ln("l0", "Không luyện khí.", 50), bg("big", "KHÔNG NGỘ ĐẠO.", 76, JADE)],
  },
  MODAU3: {
    gap: 24,
    els: [
      ln("l0", "Bọn họ chỉ ngồi trước\nmột pháp khí phát sáng…", 46),
      ln("l1", "gõ từng dòng cổ văn…", 48, TEXT, 600),
      ln("l2", "rồi chờ Thiên Đạo…", 48),
      bg("big", "BÁO LỖI.", 86, RED),
    ],
  },
  MODAU4: {
    gap: 28,
    els: [ln("top", "Người đời gọi đó là…"), ic("big", "📜"), bg("big", "MẬT NGÔN\nKIẾM TU.", 84, GOLD)],
  },

  M1_TANG: {
    gap: 30,
    els: [ln("l0", "Một câu hỏi.", 50), bg("big", "BA TẦNG NHÂN QUẢ.", 76, RED)],
  },
  M1_MAY: {
    gap: 16,
    els: [
      ln("l0", "Ngươi mở máy.", 48, TEXT, 600),
      ln("l1", "Chạy.", 44),
      ln("l2", "Không lỗi.", 48, JADE, 700),
      gp(18),
      ln("l3", "Đồng môn mở máy.", 48, TEXT, 600),
      ln("l4", "Chạy.", 44),
      bg("big", "LỖI.", 84, RED),
    ],
  },
  M1_KIEM1: {
    gap: 16,
    els: [
      ln("l0", "Ngươi kiểm tra code.", 48, TEXT, 600),
      ln("l1", "Không thấy gì.", 44),
      gp(18),
      ln("l2", "Kiểm tra package.", 48, TEXT, 600),
      ln("l3", "Không thấy gì.", 44),
    ],
  },
  M1_KIEM2: {
    gap: 16,
    els: [
      ln("l0", "Kiểm tra database.", 48, TEXT, 600),
      ln("l1", "Không thấy gì.", 44),
      gp(18),
      ln("l2", "Kiểm tra environment.", 48, TEXT, 600),
      bg("big", "VẪN KHÔNG THẤY GÌ.", 70, RED),
    ],
  },
  M1_PACK: {
    gap: 22,
    els: [
      ln("l0", "Cuối cùng…"),
      ln("l1", "ngươi phát hiện…"),
      ln("l2", "máy mình đang dùng một package…", 44, TEXT, 600),
      bg("big", "KHÁC VERSION\nTỪ HAI NĂM TRƯỚC.", 66, RED),
      sk("skull"),
    ],
  },
  M1_LINH: {
    gap: 24,
    els: [
      ln("l0", "Khoảnh khắc ấy…"),
      ln("l1", "ngươi lĩnh ngộ:"),
      gp(10),
      ln("l2", "“Nó chạy ở máy ta”…", 54, GOLD, 800),
      ln("l3", "không phải lời giải thích.", 46, TEXT, 600),
    ],
  },
  M1_REVEAL: {
    gap: 30,
    els: [ln("l0", "Đó là…", 48), bg("big", "LỜI CÁO PHÓ CỦA MỘT\nDEVOPS PIPELINE.", 62, RED)],
  },

  M2_TRUONG: {
    gap: 24,
    els: [
      ln("l0", "Trưởng lão phất tay.", 48, TEXT, 600),
      ln("l1", "“Chỉ sửa cái nút này.”", 52, GOLD, 700),
      gp(10),
      ln("l2", "Ngươi mở code.", 48),
    ],
  },
  M2_MOT: {
    gap: 22,
    els: [
      ln("l0", "Một component.", 56, TEXT, 700),
      ln("l1", "Một function.", 56, TEXT, 700),
      ln("l2", "Một dòng logic.", 56, TEXT, 700),
    ],
  },
  M2_SUA: {
    gap: 18,
    els: [
      ln("l0", "Ngươi sửa.", 48),
      ln("l1", "Chạy lại.", 48),
      bg("big", "HẾT BUG.", 76, JADE),
      gp(12),
      ln("l2", "Ngươi mỉm cười.", 46),
    ],
  },
  M2_THA: {
    gap: 26,
    els: [ln("l0", "Thiên Đạo có vẻ…", 48), ln("l1", "đã tha mạng.", 54, JADE, 700), gp(12), ln("l2", "Cho đến khi…", 50)],
  },
  M2_DOMINO1: {
    gap: 16,
    els: [
      ln("l0", "login không hoạt động.", 48, RED, 700),
      ln("l1", "Ngươi sửa login.", 44),
      gp(18),
      ln("l2", "Thanh toán chết.", 48, RED, 700),
      ln("l3", "Ngươi sửa thanh toán.", 44),
    ],
  },
  M2_DOMINO2: {
    gap: 16,
    els: [
      ln("l0", "Cart biến mất.", 48, RED, 700),
      ln("l1", "Ngươi sửa cart.", 44),
      gp(18),
      bg("l2", "Database timeout.", 62, RED),
    ],
  },
  M2_MANHINH: {
    gap: 26,
    els: [ln("l0", "Ngươi nhìn màn hình.", 50), bg("big", "MÀN HÌNH NHÌN LẠI.", 72, RED), sk("skull")],
  },
  M2_LUAT: {
    gap: 24,
    els: [ln("l0", "Bởi trong Công Nghệ Tông…"), ln("l1", "có một định luật bất diệt:", 50, TEXT, 700)],
  },
  M2_REVEAL: {
    gap: 24,
    els: [
      bg("big1", "BUG KHÔNG TỰ SINH RA\nVÀ MẤT ĐI", 62, GOLD),
      gp(8),
      ln("l0", "mà nó chỉ…", 46),
      bg("big2", "CHUYỂN TỪ MODULE NÀY\nSANG MODULE KHÁC", 58, RED),
    ],
  },

  M3_MAT: {
    gap: 28,
    els: [ln("l0", "Ngươi vừa mất hai canh giờ…", 46), bg("big", "để tìm MỘT BUG.", 68, RED)],
  },
  M3_DA: {
    gap: 24,
    els: [ln("l0", "Đã log.", 56, TEXT, 700), ln("l1", "Đã trace.", 56, TEXT, 700), ln("l2", "Đã console.", 56, TEXT, 700)],
  },
  M3_NGHI: {
    gap: 20,
    els: [
      ln("l0", "Đã nghi ngờ database.", 50, TEXT, 600),
      ln("l1", "Đã nghi ngờ API.", 50, TEXT, 600),
      gp(14),
      bg("l2", "Đã nghi ngờ\nCHÍNH CUỘC ĐỜI.", 62, RED),
    ],
  },
  M3_PULL: {
    gap: 18,
    els: [
      ln("l0", "Cuối cùng đồng môn bước tới.", 44),
      ln("l1", "“Em pull code mới chưa?”", 52, GOLD, 700),
      gp(14),
      ln("l2", "Ngươi pull.", 46),
      ln("l3", "Chạy.", 44),
      bg("big", "HẾT.", 84, JADE),
    ],
  },
  M3_KHONG: {
    gap: 16,
    els: [
      ln("l0", "Không bug.", 50, JADE, 700),
      ln("l1", "Không error.", 50, JADE, 700),
      ln("l2", "Không warning.", 50, JADE, 700),
      gp(18),
      ln("l3", "Chỉ còn…", 46),
      bg("big", "ĐẠO TÂM.", 82, GOLD),
    ],
  },
  M3_COMMIT: {
    gap: 20,
    els: [
      ln("l0", "Bởi hai giờ vừa rồi…"),
      ln("l1", "ngươi không debug code.", 50, TEXT, 700),
      gp(12),
      ln("l2", "Ngươi debug…", 46),
      bg("big", "MỘT COMMIT CŨ.", 74, RED),
    ],
  },
  M3_LINH: {
    gap: 24,
    els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ một chân lý:", 48, TEXT, 700)],
  },
  M3_REVEAL: {
    gap: 26,
    els: [bg("big1", "GIT KHÔNG CHỈ\nLƯU CODE.", 70, GOLD), gp(8), ln("l0", "Nó lưu…", 46), bg("big2", "NGHIỆP.", 96, RED)],
  },

  M4_PR: {
    gap: 16,
    els: [
      ln("l0", "Pull Request mở.", 50, TEXT, 700),
      ln("l1", "Bảy file thay đổi.", 46),
      gp(18),
      ln("l2", "Ba người review.", 46),
      ln("l3", "Hai người comment.", 46),
    ],
  },
  M4_LGTM: {
    gap: 22,
    els: [ln("l0", "Một người approve.", 48), ln("l1", "Một người nói:", 48), gp(10), bg("big", "“LGTM.”", 86, GOLD)],
  },
  M4_DIFF: {
    gap: 16,
    els: [
      ln("l0", "Ngươi nhìn diff.", 46),
      ln("l1", "Không hiểu.", 46),
      ln("l2", "Nhưng vẫn approve.", 50, TEXT, 700),
      gp(18),
      ln("l3", "Bởi người approve trước…", 44),
      bg("big", "là TRƯỞNG LÃO.", 70, RED),
    ],
  },
  M4_XANH: {
    gap: 14,
    els: [
      ln("l0", "Merge.", 50, TEXT, 700),
      ln("l1", "CI xanh.", 46, JADE, 700),
      ln("l2", "Deploy xanh.", 46, JADE, 700),
      ln("l3", "Monitor xanh.", 46, JADE, 700),
      gp(16),
      ln("l4", "Toàn bộ Công Nghệ Tông…", 44),
      bg("big", "THỞ PHÀO.", 72, JADE),
    ],
  },
  M4_DO: {
    gap: 28,
    els: [ln("l0", "Ba phút sau…", 50), bg("big", "PRODUCTION ĐỎ.", 82, RED), sk("big", 16)],
  },
  M4_AI: {
    gap: 24,
    els: [ln("l0", "Trưởng lão hỏi:", 48), ln("l1", "“Ai merge?”", 58, GOLD, 800), gp(12), ln("l2", "Tất cả im lặng.", 52, SEC, 700)],
  },
  M4_NHIN: {
    gap: 14,
    els: [
      ln("l0", "Ngươi nhìn người bên cạnh.", 44),
      ln("l1", "Người bên cạnh nhìn người kia.", 44),
      ln("l2", "Người kia nhìn Pull Request.", 44),
      gp(18),
      ln("l3", "Pull Request nhìn…", 48, TEXT, 700),
      bg("big", "NGƯƠI.", 96, RED),
    ],
  },
  M4_LINH: {
    gap: 24,
    els: [ln("l0", "Khoảnh khắc ấy…"), ln("l1", "ngươi lĩnh ngộ:")],
  },
  M4_REVEAL: {
    gap: 24,
    els: [
      bg("big1", "CODE REVIEW\nKHÔNG XÓA NGHIỆP.", 64, GOLD),
      gp(8),
      ln("l0", "Nó chỉ…", 46),
      bg("big2", "CHIA NHỎ NGHIỆP\nCHO NHIỀU NGƯỜI.", 60, RED),
    ],
  },

  M5_IMLANG: {
    gap: 26,
    els: [ln("l0", "Khoảnh khắc này…", 50), ln("l1", "không ai nói gì.", 56, SEC, 700)],
  },
  M5_TEAM: {
    gap: 16,
    els: [
      ln("l0", "DevOps mở backup.", 46, TEXT, 600),
      ln("l1", "QA mở test.", 46, TEXT, 600),
      ln("l2", "Backend nhìn database.", 46, TEXT, 600),
      gp(16),
      rel("big", "Frontend…", -14, 48, SEC, 500),
      bg("big", "TẮT SLACK.", 76, RED),
      sk("big", 16),
    ],
  },
  M5_HOI1: {
    gap: 20,
    els: [ln("l0", "Developer hỏi:", 46), ln("l1", "“Đã test chưa?”", 54, GOLD, 700), ln("l2", "“Rồi.”", 50, SEC, 700)],
  },
  M5_HOI2: {
    gap: 18,
    els: [
      ln("l0", "“Staging ổn?”", 54, GOLD, 700),
      ln("l1", "“Ổn.”", 50, SEC, 700),
      gp(16),
      ln("l2", "“Rollback?”", 54, GOLD, 700),
      ln("l3", "“Có.”", 50, SEC, 700),
    ],
  },
  M5_NHIN: {
    gap: 16,
    els: [
      ln("l0", "Ngươi nhìn production.", 46),
      ln("l1", "Nhìn đồng môn.", 46),
      ln("l2", "Nhìn thiên đạo.", 46),
      gp(18),
      ln("l3", "Rồi…", 50),
      bg("big", "DEPLOY.", 90, RED),
    ],
  },
  M5_GIAY: {
    gap: 14,
    els: [
      ln("l0", "Mười giây đầu…", 46),
      ln("l1", "bình thường.", 50, JADE, 700),
      gp(12),
      ln("l2", "Hai mươi giây…", 46),
      ln("l3", "bình thường.", 50, JADE, 700),
      gp(12),
      ln("l4", "Ba mươi giây…", 46),
      bg("big", "SERVER BẮT ĐẦU KHÓC.", 62, RED),
    ],
  },
  M5_CHET: {
    gap: 18,
    els: [
      ln("l0", "CPU phi thăng.", 50, RED, 700),
      ln("l1", "RAM nhập ma.", 50, RED, 700),
      gp(14),
      ln("l2", "Database bắt đầu lĩnh ngộ…", 44),
      bg("big", "NIRVANA.", 90, JADE),
    ],
  },
  M5_GROUP: {
    gap: 18,
    els: [
      ln("l0", "Group công ty sáng đèn.", 46),
      ln("l1", "Trưởng lão xuất quan:", 46),
      gp(12),
      ln("l2", "“AI DEPLOY?”", 58, GOLD, 800),
      ln("l3", "Không ai trả lời.", 46, SEC, 600),
    ],
  },
  M5_REVEAL: {
    gap: 18,
    els: [
      ln("l0", "Bởi trong Công Nghệ Tông…", 44),
      ln("l1", "người gây ra thiên kiếp…", 46),
      ln("l2", "không đáng sợ.", 50, TEXT, 700),
      gp(16),
      ln("l3", "Đáng sợ là…", 46),
      bg("big", "NGƯỜI BIẾT AI GÂY RA…", 56, RED),
      ln("l4", "nhưng đang NGHỈ PHÉP.", 54, GOLD, 800),
      sk("skull"),
    ],
  },

  KET1: {
    gap: 22,
    els: [
      ln("l0", "Cho nên người trong\nCông Nghệ Tông mới nói:", 44),
      gp(10),
      ln("l1", "Developer…", 54, TEXT, 800),
      ln("l2", "không phải người không có bug.", 46),
    ],
  },
  KET2: {
    gap: 22,
    els: [
      ln("l0", "Developer…", 54, TEXT, 800),
      ln("l1", "là người đã nhìn thấy bug…", 46),
      gp(10),
      bg("big", "NHIỀU ĐẾN MỨC\nKHÔNG CÒN SỢ BUG.", 60, RED),
    ],
  },
  KET3: {
    gap: 24,
    els: [ln("l0", "Hắn sợ…", 50), ln("l1", "một câu rất đơn giản:", 46), gp(10), bg("big", "“HÌNH NHƯ CÓ CÁI NÀY…”", 58, GOLD)],
  },
  KET4: {
    gap: 14,
    els: [
      ln("l0", "Bởi sau câu đó…", 46),
      ln("l1", "sẽ có một task.", 50, TEXT, 700),
      gp(12),
      ln("l2", "Sau task…", 46),
      ln("l3", "một branch.", 50, TEXT, 700),
      gp(12),
      ln("l4", "Sau branch…", 46),
      ln("l5", "một Pull Request.", 50, TEXT, 700),
    ],
  },
  KET5: {
    gap: 20,
    els: [
      ln("l0", "Sau Pull Request…", 46),
      ln("l1", "một cuộc họp.", 50, TEXT, 700),
      gp(14),
      ln("l2", "Sau cuộc họp…", 46),
      bg("big", "MỘT REQUIREMENT MỚI.", 62, RED),
      sk("skull"),
    ],
  },
  KET6: {
    gap: 20,
    els: [
      ln("l0", "Và sau requirement mới…", 44),
      ln("l1", "Trưởng lão sẽ nhìn Kiếm Tu…", 46),
      ln("l2", "rồi nhẹ nhàng nói:", 46),
      gp(12),
      bg("big", "“CÁI NÀY FIX NHANH THÔI.”", 56, GOLD),
    ],
  },
  KET7: {
    gap: 14,
    els: [
      ln("l0", "Khoảnh khắc ấy…", 46),
      ln("l1", "Kiếm Tu không phản kháng.", 48, TEXT, 700),
      ln("l2", "Không chạy trốn.", 46),
      ln("l3", "Không cầu cứu.", 46),
      gp(18),
      ln("l4", "Hắn chỉ…", 48),
      bg("big", "RÚT KIẾM.", 94, RED),
    ],
  },
  KET8: {
    gap: 18,
    els: [
      ln("l0", "Bởi hắn biết…", 46),
      ln("l1", "bug hôm nay…", 48, TEXT, 700),
      ln("l2", "là nghiệp từ commit hôm qua.", 46, GOLD, 700),
      gp(16),
      ln("l3", "Production hôm nay…", 48, TEXT, 700),
      ln("l4", "là nhân quả từ\nquyết định tháng trước.", 46, GOLD, 700),
    ],
  },
  KET9: {
    gap: 22,
    els: [
      ln("l0", "Và người ngồi cạnh hắn…", 46),
      ln("l1", "chính là người đã nói:", 46),
      gp(12),
      bg("big", "“MERGE ĐI,\nANH REVIEW RỒI.”", 62, GOLD),
    ],
  },
  KET10: {
    gap: 28,
    els: [ln("top", "Đây chính là…", 48), ic("big", "🏯"), bg("big", "MẬT NGÔN\nKIẾM TU.", 84, GOLD)],
  },
  KET11: {
    gap: 22,
    els: [
      ln("l0", "Một đạo…", 50),
      ln("l1", "nơi mỗi dòng code\nđều có nhân quả.", 46, TEXT, 600),
      gp(12),
      ln("l2", "Mỗi commit\nđều có nghiệp lực.", 46, GOLD, 700),
    ],
  },
  KET12: {
    gap: 26,
    els: [ln("l0", "Và mỗi lần deploy…", 48), ln("l1", "đều là một lần…", 46), bg("big", "ĐỘ KIẾP.", 94, GOLD)],
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
    <Stage gap={30}>
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
      <Line e={e.l0} size={48} color={JADE} weight={700}>để độ kiếp mỗi ngày</Line>
    </Stage>
  );
};

const HEADS: Array<[string, string, string, number]> = [
  ["M1_HEAD", "ĐỆ NHẤT MẬT NGÔN", "“SAO Ở MÁY ANH\nNÓ VẪN CHẠY?”", 60],
  ["M2_HEAD", "ĐỆ NHỊ MẬT NGÔN", "“CÁI NÀY FIX NHANH THÔI.”", 54],
  ["M3_HEAD", "ĐỆ TAM MẬT NGÔN", "“EM PULL CODE MỚI CHƯA?”", 54],
  ["M4_HEAD", "ĐỆ TỨ MẬT NGÔN", "“ANH MERGE NHÉ?”", 64],
  ["M5_HEAD", "ĐỆ NGŨ MẬT NGÔN", "“DEPLOY PRODUCTION ĐI,\nCHẮC KHÔNG SAO ĐÂU.”", 50],
];

const PAIRS: Array<[string, string, string, string, string, number]> = [
  ["M1_PAIR", "NGƯỜI NGOÀI NGHE", "KIẾM TU NGHE", "“Chắc máy khác\nmôi trường.”", "“TA KHÔNG BIẾT\nLỖI Ở ĐÂU.”", 54],
  ["M2_PAIR", "NGƯỜI MỚI NGHE", "KIẾM TU NGHE", "“Một bug nhỏ.”", "“TỐI NAY KHỎI VỀ.”", 56],
  ["M3_PAIR", "NGƯỜI MỚI NGHE", "KIẾM TU LÂU NĂM NGHE", "“Một câu hỏi\nbình thường.”", "“NGƯƠI ĐANG DEBUG\nMỘT VŨ TRỤ ĐÃ BỊ BỎ.”", 44],
  ["M4_PAIR", "NGƯỜI NGOÀI NGHE", "KIẾM TU NGHE", "“Một câu hỏi\nlịch sự.”", "“AI MUỐN CÙNG TA\nĐỐT PRODUCTION?”", 50],
];

export const MatNgonKiemTu: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("mnkt/voice.mp3")} />
    {bgm ? <Audio src={staticFile("mnkt/bgm.mp3")} /> : null}
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
