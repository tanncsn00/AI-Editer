import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0B0A12";
const PANEL = "#141221";
const GOLD = "#E5B54C";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const AMBER = "#FF9F45";
const VIOLET = "#B18CFF";
const TEXT = "#F2ECE0";
const MUTE = "#6E6780";

const ROWS: Array<[string, string, string]> = [
  ["⚔️", "ĐẠI ĐẾ BÙNG KÈO", RED],
  ["🍜", "THAO THIẾT ĐẠO NHÂN", AMBER],
  ["🕵️", "THIÊN CƠ CÁC CHỦ", VIOLET],
  ["🗿", "MIỆNG ĐỘC TÂM THIỆN", JADE],
  ["🔥", "ĐẠI NĂNG “ĐỂ TA LO”", GOLD],
];

const Row: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, border: "3px solid " + color + "55", background: color + "12", borderRadius: 18, padding: "14px 24px" }}>
    <div style={{ fontSize: 46 }}>{icon}</div>
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 900, color, letterSpacing: -1 }}>{label}</div>
  </div>
);

export const BanThanTuTienThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)", backgroundSize: "120px 100%" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 20%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 84%, " + RED + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 66, marginBottom: 44 }}>🏯</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 124, fontWeight: 900, color: GOLD, lineHeight: 0.96, letterSpacing: -5 }}>5 KIỂU</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 78, fontWeight: 900, color: TEXT, lineHeight: 1.04, letterSpacing: -2.5, marginTop: 4 }}>BẠN THÂN</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 800, color: MUTE, lineHeight: 1.1, letterSpacing: -0.5, marginTop: 8 }}>TRONG TU TIÊN GIỚI</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {ROWS.map(([icon, label, color]) => (
          <Row key={label} icon={icon} label={label} color={color} />
        ))}
      </div>

      <div
        style={{
          alignSelf: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 38,
          fontWeight: 900,
          color: BG,
          background: GOLD,
          borderRadius: 999,
          padding: "18px 38px",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        THẰNG BẠN MÀY Ở CẢNH GIỚI NÀO?
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 23, color: MUTE, letterSpacing: 5, opacity: 0.65 }}>
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
