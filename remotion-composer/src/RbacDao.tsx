import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./rbac_beats.json";
import T from "./rbac_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#080B12";
const GOLD = "#E5B54C";
const CYAN = "#5AD1E8";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const SEC = "#96A0B8";
const MUTE = "#5A6478";

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
  const drift = (f * 0.16) % 90;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(" + CYAN + "0A 1px, transparent 1px), linear-gradient(90deg, " + CYAN + "0A 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: "0 " + drift + "px",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 780px at 50% 20%, " + GOLD + "18 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 780px at 50% 84%, " + CYAN + "12 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 100px " + BG }} />
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <AbsoluteFill style={{ padding: "0 70px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

const Line: React.FC<{ e: number; size?: number; color?: string; weight?: number; children: React.ReactNode }> = ({ e, size = 46, color = SEC, weight = 500, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>;
};

const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 72, color = TEXT, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.14, letterSpacing: -1.2, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "40" }}>{children}</div>
  );
};

const Code: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 50, color = CYAN, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 12),
        fontFamily: "JetBrains Mono",
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: -0.5,
        border: "2px solid " + color + "4D",
        background: color + "14",
        borderRadius: 14,
        padding: "14px 26px",
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </div>
  );
};

const RoleChip: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 52, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 13),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        border: "2px solid " + color + "55",
        background: color + "12",
        borderRadius: 999,
        padding: "12px 40px",
        letterSpacing: 0.5,
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </div>
  );
};

const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 52, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 15),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 1.24,
        letterSpacing: -0.5,
        whiteSpace: "pre-line",
        border: "2px solid " + color + "4D",
        background: color + "10",
        borderRadius: 20,
        padding: "22px 30px",
      }}
    >
      {children}
    </div>
  );
};

const Arrow: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  return <div style={{ ...fadeUp(f, e, 8, 6), fontSize: 40, color: MUTE, lineHeight: 0.7 }}>↓</div>;
};

type El = {
  k: "l" | "big" | "code" | "role" | "quote" | "arrow" | "gap";
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
const cd = (key: string, t: string, size?: number, color?: string): El => ({ k: "code", key, t, size, color });
const rl = (key: string, t: string, size?: number, color?: string): El => ({ k: "role", key, t, size, color });
const qt = (key: string, t: string, size?: number, color?: string): El => ({ k: "quote", key, t, size, color });
const ar = (key: string, delay: number): El => ({ k: "arrow", key, delay });
const gp = (h = 14): El => ({ k: "gap", h });

const SCENES: Record<string, { gap?: number; els: El[] }> = {
  MODAU: { gap: 26, els: [ln("l0", "Tương truyền..."), ln("l1", "trong CODE ĐẠO.", 60, GOLD, 800), ln("l2", "Có một tông môn..."), ln("l3", "sở hữu HÀNG VẠN ĐỆ TỬ.", 54, TEXT, 800)] },
  TONG1: { gap: 28, els: [ln("l0", "Đệ tử ngoại môn\nđược xem bí kíp.", 48), ln("l1", "Đệ tử nội môn\nđược luyện công.", 48)] },
  TONG2: { gap: 26, els: [ln("l0", "Trưởng lão được sửa bí kíp.", 46), ln("l1", "Tông chủ...", 46), bg("big", "có thể động vào\nGẦN NHƯ MỌI THỨ.", 64, GOLD)] },
  KIEP1: { gap: 28, els: [ln("l0", "Nhưng tông môn càng lớn...", 48), bg("big", "quyền hạn càng trở thành\nMỘT ĐẠI KIẾP.", 62, RED)] },
  KIEP2: { gap: 26, els: [ln("l0", "Nếu mỗi khi có một\nđệ tử mới nhập môn...", 46), gp(10), ln("l1", "trưởng lão phải ngồi\ncấp TỪNG QUYỀN cho hắn...", 48, TEXT, 700)] },
  KIEP3: { gap: 24, els: [ln("l0", "Một vạn đệ tử.", 56, TEXT, 700), ln("l1", "Mỗi người vài chục quyền.", 52)] },
  KIEP4: { gap: 28, els: [ln("l0", "Chưa cần kẻ địch tới.", 48), bg("big", "Tông môn đã tự\nTẨU HỎA NHẬP MA.", 66, RED)] },
  RBAC_RA: { gap: 26, els: [ln("l0", "Cho nên các đại năng\nsáng lập ra một công pháp:", 44), bg("big", "RBAC", 110, GOLD), ln("l1", "Role-Based Access Control", 40, CYAN, 600)] },
  TUTUONG: { gap: 28, els: [ln("l0", "Công pháp này có một\ntư tưởng cực kỳ đơn giản:", 44), bg("big", "Đừng cấp quyền\nTRỰC TIẾP cho từng người.", 58, TEXT)] },
  TAOROLE: { gap: 30, els: [ln("l0", "Hãy tạo ra...", 50), bg("big", "ROLE.", 116, GOLD)] },
  VIDU_ROLE: { gap: 22, els: [ln("l0", "Ví dụ tông môn có:", 46), gp(10), rl("r0", "Viewer."), rl("r1", "Editor."), rl("r2", "Admin.")] },
  GAN1: { gap: 24, els: [ln("l0", "Sau đó gán quyền cho Role.", 46), gp(10), rl("l1", "Viewer được:", 46), cd("c0", "read(post)")] },
  GAN2: { gap: 22, els: [rl("l0", "Editor được:", 46), cd("c0", "read(post)"), cd("c1", "update(post)")] },
  GAN3: { gap: 20, els: [rl("l0", "Admin được:", 46), cd("c0", "read(post)"), cd("c1", "update(post)"), cd("c2", "delete(post)", 50, RED)] },
  GANDT: { gap: 26, els: [ln("l0", "Cuối cùng...", 48), ln("l1", "mới gán đệ tử vào Role.", 52, TEXT, 700)] },
  DETU: { gap: 16, els: [ln("l0", "Đệ tử A:", 42), rl("r0", "Viewer.", 46), gp(12), ln("l1", "Đệ tử B:", 42), rl("r1", "Editor.", 46), gp(12), ln("l2", "Đệ tử C:", 42), rl("r2", "Admin.", 46)] },
  NHANQUA: { gap: 30, els: [ln("l0", "Vậy là hình thành nhân quả:", 46), bg("big", "User → Role\n→ Permission", 66, GOLD)] },
  PERM1: { gap: 22, els: [ln("l0", "Nhưng Permission ở đây...", 46), ln("l1", "không phải một thứ quyền mơ hồ.", 44), gp(12), ln("l2", "Nó thường thể hiện:", 44), bg("big", "Operation + Object", 60, CYAN)] },
  PERM2: { gap: 22, els: [ln("l0", "Ví dụ:", 44), cd("c0", "read + post"), gp(8), ln("l1", "nghĩa là:", 44), ln("l2", "được đọc bài viết.", 52, TEXT, 700)] },
  PERM3: { gap: 22, els: [cd("c0", "delete + post", 50, RED), gp(8), ln("l0", "nghĩa là:", 44), ln("l1", "được xóa bài viết.", 52, TEXT, 700)] },
  REQ1: { gap: 28, els: [ln("l0", "Cho nên khi một User\ngửi request:", 46), cd("c0", "DELETE /posts/123", 52, RED)] },
  REQ2: { gap: 26, els: [ln("l0", "Hệ thống không chỉ hỏi:", 46), qt("q", "“Ngươi là ai?”", 60)] },
  REQ3: { gap: 26, els: [bg("l0", "Authentication\nđã trả lời câu đó.", 58, CYAN)] },
  REQ4: { gap: 26, els: [ln("l0", "Nó hỏi tiếp:", 46), qt("q", "“Role của ngươi là gì?”", 54)] },
  REQ5: { gap: 26, els: [ln("l0", "Database trả lời:", 46), rl("r0", "Editor.", 56)] },
  REQ6: { gap: 26, els: [ln("l0", "Hệ thống lại hỏi:", 46), qt("q", "“Editor có permission\ndelete trên post không?”", 48)] },
  REQ7: { gap: 28, els: [ln("l0", "Câu trả lời:", 46), bg("big", "KHÔNG.", 104, RED)] },
  REQ8: { gap: 28, els: [ln("l0", "Kết quả:", 46), cd("c0", "403 Forbidden", 64, RED)] },
  AUTH1: { gap: 24, els: [ln("l0", "Đạo hữu lúc này\nphải hiểu một điều:", 44), gp(10), ln("l1", "Authentication nói:", 46, CYAN, 700), qt("q", "“Đúng là ngươi.”", 56)] },
  AUTH2: { gap: 24, els: [ln("l0", "Authorization nói:", 46, JADE, 700), qt("q", "“Nhưng ngươi có được phép\nlàm việc này không?”", 48)] },
  AUTH3: { gap: 26, els: [bg("big", "RBAC chính là một cách\ntổ chức phần quyền hạn đó.", 56, TEXT)] },
  MULTI1: { gap: 26, els: [ln("l0", "Nhưng...", 48), ln("l1", "tông môn càng lớn...", 48), bg("big", "lại xuất hiện\nMỘT VẤN ĐỀ.", 66, RED)] },
  MULTI2: { gap: 26, els: [bg("big", "Một người có thể\nGIỮ NHIỀU CHỨC VỊ.", 64, TEXT)] },
  MULTI3: { gap: 20, els: [ln("l0", "Ví dụ một đệ tử vừa là:", 44), rl("r0", "Editor", 50), gp(8), ln("l1", "vừa là:", 44), rl("r1", "Reviewer.", 50)] },
  MULTI4: { gap: 20, els: [rl("l0", "Editor có:", 46), cd("c0", "post:read"), cd("c1", "post:update")] },
  MULTI5: { gap: 22, els: [rl("l0", "Reviewer có:", 46), cd("c0", "post:approve", 50, JADE)] },
  MULTI6: { gap: 28, els: [ln("l0", "Vậy User này...", 48), bg("big", "sở hữu quyền từ\nCẢ HAI ROLE.", 64, JADE)] },
  MULTI7: { gap: 26, els: [ln("l0", "Không cần tạo ra\nmột Role quái vật:", 46), cd("c0", "EditorReviewer\nUltimateFinalAdmin", 40, RED)] },
  MULTI8: { gap: 28, els: [ln("l0", "Chỉ cần...", 48), bg("big", "một User được assign\nNHIỀU ROLE.", 60, JADE)] },
  MULTI9: { gap: 26, els: [bg("big", "Đó mới là nhân quả\ncủa RBAC.", 62, GOLD)] },
  HIER1: { gap: 24, els: [ln("l0", "Nhưng rồi...", 46), ln("l1", "Tông chủ lại sáng tạo ra\nmột cảnh giới khác:", 44), bg("big", "Role Hierarchy", 66, GOLD)] },
  HIER2: { gap: 12, els: [ln("l0", "Ví dụ:", 42), gp(8), rl("r0", "Viewer", 46), ar("r1", -6), rl("r1", "Editor", 46), ar("r2", -6), rl("r2", "Manager", 46), ar("r3", -6), rl("r3", "Admin", 46)] },
  HIER3: { gap: 24, els: [rl("l0", "Viewer có:", 46), cd("c0", "post:read")] },
  HIER4: { gap: 20, els: [ln("l0", "Editor kế thừa Viewer.", 46, TEXT, 700), ln("l1", "Nên Editor cũng có:", 42), cd("c0", "post:read", 46, MUTE), gp(8), ln("l2", "và thêm:", 42), cd("c1", "post:update", 50, JADE)] },
  HIER5: { gap: 24, els: [ln("l0", "Manager kế thừa Editor.", 46, TEXT, 700), ln("l1", "Nên Manager có toàn bộ\nquyền phía dưới...", 44), ln("l2", "và thêm quyền quản lý.", 46, JADE, 700)] },
  HIER6: { gap: 26, els: [bg("big", "Admin đứng trên cùng.", 66, GOLD)] },
  HIER7: { gap: 28, els: [ln("l0", "Đây là cách Role cấp cao...", 46), bg("big", "thừa hưởng permission\ncủa Role cấp thấp.", 58, TEXT)] },
  HIER8: { gap: 26, els: [ln("l0", "Tông môn bắt đầu\nvận hành trơn tru.", 54, JADE, 700)] },
  SESS1: { gap: 24, els: [ln("l0", "Nhưng...", 48), ln("l1", "một ngày kia.", 48), bg("big", "Một trưởng lão\ncó BA CHỨC VỊ.", 62, TEXT)] },
  SESS2: { gap: 20, els: [rl("r0", "Admin.", 50), rl("r1", "Auditor.", 50), rl("r2", "Reviewer.", 50)] },
  SESS3: { gap: 26, els: [ln("l0", "Người này đăng nhập.", 56, TEXT, 700)] },
  SESS4: { gap: 26, els: [ln("l0", "Không có nghĩa...", 46), bg("big", "mọi Role đều nhất thiết\nphải được kích hoạt\ntrong cùng một phiên hoạt động.", 46, TEXT)] },
  SESS5: { gap: 30, els: [ln("l0", "Đây chính là:", 48), bg("big", "SESSION.", 100, CYAN)] },
  SESS6: { gap: 22, els: [ln("l0", "Một User có thể được\nassign nhiều Role.", 46), gp(10), ln("l1", "Nhưng trong một session...", 44), ln("l2", "hệ thống có thể xác định\nnhững Role nào đang được sử dụng.", 44, TEXT, 600)] },
  SESS7: { gap: 16, els: [ln("l0", "Nói cách khác:", 42), gp(8), ln("l1", "User có những Role nào", 46, GOLD, 700), ln("l2", "và", 38), ln("l3", "Session đang activate Role nào", 46, CYAN, 700), gp(10), bg("big", "là hai chuyện khác nhau\ntrong mô hình RBAC đầy đủ.", 48, TEXT)] },
  SESS8: { gap: 26, els: [ln("l0", "Đạo hữu bắt đầu tiến vào\ncảnh giới sâu hơn.", 52, GOLD, 700)] },
  CONS1: { gap: 24, els: [ln("l0", "Nhưng đại kiếp\nvẫn chưa kết thúc.", 46), ln("l1", "Tông chủ phát hiện", 46), bg("big", "MỘT LỖ HỔNG.", 74, RED)] },
  CONS2: { gap: 20, els: [ln("l0", "Một đệ tử có thể\nvừa được cấp:", 44), cd("c0", "payment:create"), ln("l1", "và", 38), cd("c1", "payment:approve", 50, RED)] },
  CONS3: { gap: 26, els: [ln("l0", "Nghĩa là...", 46), ln("l1", "hắn TỰ TẠO giao dịch.", 52, TEXT, 700), bg("big", "Rồi TỰ PHÊ DUYỆT.", 66, RED)] },
  CONS4: { gap: 24, els: [ln("l0", "Không cần ma tu tấn công.", 46), ln("l1", "Chính hắn...", 46), bg("big", "đã có thể tự mở cửa\ncho chính mình.", 58, RED)] },
  CONS5: { gap: 30, els: [ln("l0", "Cho nên tông môn dựng lên:", 46), bg("big", "CONSTRAINTS.", 76, CYAN)] },
  CONS6: { gap: 24, els: [ln("l0", "Một trong những\ncông pháp nổi tiếng nhất:", 44), bg("big", "Separation of Duties", 56, GOLD), ln("l1", "Phân tách nhiệm vụ.", 48, TEXT, 700)] },
  CONS7: { gap: 18, els: [ln("l0", "Ngươi có thể là người:", 44), ln("l1", "tạo giao dịch.", 50, JADE, 700), gp(12), ln("l2", "Nhưng không được\nđồng thời là người:", 44), ln("l3", "phê duyệt chính giao dịch đó.", 50, RED, 700)] },
  CONS8: { gap: 26, els: [ln("l0", "Hai quyền có thể tồn tại...", 46), bg("big", "nhưng không được để MỘT NGƯỜI\nsở hữu cả hai\ntrong cùng điều kiện.", 48, TEXT)] },
  CONS9: { gap: 26, els: [ln("l0", "Đây chính là lúc RBAC\nbước sang cảnh giới:", 44), bg("big", "Constrained RBAC", 62, GOLD)] },
  CONS10: { gap: 16, els: [ln("l0", "Không còn đơn giản là:", 40), qt("q0", "“Role nào có permission gì?”", 42, MUTE), gp(10), ln("l1", "Mà còn phải hỏi:", 40), qt("q1", "“Những Role nào\nđược phép cùng tồn tại?”", 42), gp(10), ln("l2", "Và:", 40), qt("q2", "“Có điều kiện nào cấm\nviệc kết hợp chúng không?”", 42)] },
  BEY1: { gap: 26, els: [ln("l0", "Đến đây...", 48), ln("l1", "ngươi tưởng RBAC\nđã vô địch?", 50, TEXT, 700), bg("big", "CHƯA.", 104, RED)] },
  BEY2: { gap: 20, els: [ln("l0", "Một Editor có quyền:", 44), cd("c0", "post:update", 50, JADE), gp(10), ln("l1", "Nhưng hắn gửi request sửa:", 44), cd("c1", "post/999", 54, RED)] },
  BEY3: { gap: 28, els: [ln("l0", "Bài viết này...", 48), bg("big", "KHÔNG PHẢI CỦA HẮN.", 62, RED)] },
  BEY4: { gap: 18, els: [ln("l0", "Hệ thống nói:", 42), qt("q0", "“Ngươi có quyền update post.”", 44, JADE), gp(10), ln("l1", "Nhưng lại phải hỏi:", 42), qt("q1", "“Ngươi có quyền update\nPOST NÀY không?”", 48, RED)] },
  BEY5: { gap: 26, els: [bg("big", "Đây là lúc mọi chuyện\nbắt đầu vượt ra ngoài\nRBAC thuần túy.", 54, TEXT)] },
  BEY6: { gap: 18, els: [ln("l0", "Bởi quyền lúc này\nphụ thuộc vào:", 44), gp(8), rl("r0", "Resource.", 46, CYAN), rl("r1", "Ownership.", 46, CYAN), rl("r2", "Relationship.", 46, CYAN), rl("r3", "Context.", 46, CYAN)] },
  BEY7: { gap: 14, els: [ln("l0", "Ví dụ:", 40), qt("q0", "“Chỉ được sửa bài viết\ndo chính mình tạo.”", 40), gp(8), ln("l1", "Hoặc:", 40), qt("q1", "“Chỉ được truy cập dữ liệu\ncủa phòng ban mình.”", 40), gp(8), ln("l2", "Hoặc:", 40), qt("q2", "“Chỉ được duyệt giao dịch khi\ngiá trị dưới một hạn mức.”", 40)] },
  BEY8: { gap: 20, els: [ln("l0", "Những quyết định\nphức tạp như vậy...", 44), ln("l1", "có thể cần những\nmô hình khác như:", 44), gp(8), rl("r0", "ABAC.", 56, CYAN), ln("l2", "Hoặc:", 40), rl("r1", "ReBAC.", 56, CYAN)] },
  RECAP1: { gap: 24, els: [ln("l0", "Cho nên đừng hiểu RBAC thành:", 44), qt("q", "“Có Role là được làm\nmọi thứ trong hệ thống.”", 46, MUTE), bg("big", "KHÔNG.", 90, RED)] },
  RECAP2: { gap: 18, els: [ln("l0", "RBAC chỉ cung cấp\nmột cách có cấu trúc để:", 44), gp(10), ln("l1", "User được gán Role.", 46, GOLD, 700), ln("l2", "Role được gán Permission.", 46, GOLD, 700), ln("l3", "Permission đại diện cho\ncác thao tác trên tài nguyên.", 44, TEXT, 600)] },
  RECAP3: { gap: 26, els: [ln("l0", "Sau đó hệ thống dựa vào\nnhững quan hệ đó...", 44), bg("big", "để đưa ra quyết định\nauthorization.", 56, JADE)] },
  RECAP4: { gap: 16, els: [ln("l0", "Và trong mô hình\nđầy đủ hơn...", 44), ln("l1", "ta còn có:", 42), gp(8), rl("r0", "Hierarchy.", 46), rl("r1", "Session.", 46), rl("r2", "Constraints.", 46), rl("r3", "Separation of Duties.", 42)] },
  LEAST1: { gap: 26, els: [ln("l0", "Cuối cùng...", 46), ln("l1", "một nguyên tắc Security\nvẫn phải được giữ:", 44), bg("big", "LEAST PRIVILEGE", 62, GOLD)] },
  LEAST2: { gap: 20, els: [ln("l0", "Đừng vì lười...", 46), ln("l1", "mà ban cho một đệ tử:", 44), rl("r0", "Admin.", 54, RED), gp(10), ln("l2", "Chỉ vì hắn cần:", 44), cd("c0", "post:read", 48)] },
  LEAST3: { gap: 28, els: [ln("l0", "Bởi một ngày...", 48), bg("big", "tài khoản hắn\nBỊ ĐOẠT XÁ.", 66, RED)] },
  LEAST4: { gap: 22, els: [ln("l0", "Kẻ địch lúc đó...", 46), ln("l1", "không còn là một\nđệ tử bình thường.", 44), ln("l2", "Mà là:", 44), bg("big", "ADMIN.", 100, RED)] },
  LEAST5: { gap: 28, els: [ln("l0", "Và toàn bộ tông môn...", 46), bg("big", "có thể bị hắn\nLUYỆN THÀNH TRO BỤI.", 58, RED)] },
  KET1: { gap: 26, els: [ln("l0", "Cho nên các đại năng\nCode Đạo đều hiểu:", 44), bg("big", "RBAC không phải thuật\nbiến User thành Admin.", 54, TEXT)] },
  KET2: { gap: 24, els: [ln("l0", "Nó là công pháp\ntổ chức quyền hạn...", 46), ln("l1", "để khi tông môn\ncó hàng vạn đệ tử...", 44), ln("l2", "ngươi vẫn biết:", 48, TEXT, 700)] },
  KET3: { gap: 18, els: [ln("l0", "Ai đang tu.", 46, GOLD, 700), ln("l1", "Thuộc Role nào.", 46, GOLD, 700), ln("l2", "Được phép thi triển\ncông pháp gì.", 44, GOLD, 700), ln("l3", "Trong Session nào.", 46, GOLD, 700), ln("l4", "Có được kết hợp\nnhững quyền đó hay không.", 44, GOLD, 700)] },
  KET4: { gap: 24, els: [ln("l0", "Và quan trọng nhất...", 46), ln("l1", "khi một đạo hữu hỏi:", 44), qt("q", "“Tại sao ta không được\nlàm việc này?”", 50)] },
  KET5: { gap: 24, els: [ln("l0", "Tông môn không cần\ntrả lời bằng cảm tính.", 44), gp(8), ln("l1", "Chỉ cần truy ngược nhân quả:", 42), bg("big", "User → Role → Permission\n→ Operation/Object\n→ Constraints", 44, CYAN)] },
  KET6: { gap: 20, els: [ln("l0", "Nếu nhân quả hợp lệ...", 46), bg("ok", "MỞ CỬA.", 76, JADE), gp(14), ln("l1", "Nếu nhân quả không hợp lệ...", 46), bg("err", "403.", 88, RED)] },
  KET7: { gap: 26, els: [ln("l0", "Đạo hữu có thể không phục.", 46), ln("l1", "Nhưng thiên đạo...", 46), bg("big", "KHÔNG QUAN TÂM.", 70, TEXT)] },
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const spec = SCENES[name];
  const ec = E[name] ?? {};
  return (
    <Stage gap={spec.gap}>
      {spec.els.map((el, i) => {
        if (el.k === "gap") return <div key={i} style={{ height: el.h }} />;
        const e = Math.max(0, (ec[el.key!] ?? 0) + (el.delay ?? 0));
        if (el.k === "arrow") return <Arrow key={i} e={e} />;
        if (el.k === "code") return <Code key={i} e={e} size={el.size} color={el.color}>{el.t}</Code>;
        if (el.k === "role") return <RoleChip key={i} e={e} size={el.size} color={el.color}>{el.t}</RoleChip>;
        if (el.k === "quote") return <Quote key={i} e={e} size={el.size} color={el.color}>{el.t}</Quote>;
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
      <Line e={e.l0} size={48} color={CYAN} weight={700}>Để độ kiếp mỗi ngày</Line>
    </Stage>
  );
};

export const RbacDao: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("rbac/voice.mp3")} />
    {bgm ? <Audio src={staticFile("rbac/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    <Sequence from={at("CTA").from} durationInFrames={at("CTA").dur}>
      <Cta />
    </Sequence>
  </AbsoluteFill>
);
