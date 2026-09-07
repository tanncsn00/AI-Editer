import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const RED = "#FF4D5E";
const AMBER = "#FF9F45";
const VIOLET = "#B18CFF";
const BLUE = "#6FA8FF";
const TEXT = "#F2ECE0";
const MUTE = "#6E6780";

const ROWS: Array<[string, string, string]> = [
  ["⚔️", "“TÙY NGƯƠI”", VIOLET],
  ["👁️", "THIÊN LÝ TRUYỀN ÂM", BLUE],
  ["⏳", "“KHÔNG GẤP”", AMBER],
  ["🧙", "“CÁI NÀY DỄ MÀ”", RED],
  ["🔥", "TRƯỞNG LÃO HỘ ĐẠO", GOLD],
];

const Row: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, border: "3px solid " + color + "55", background: color + "12", borderRadius: 18, padding: "14px 24px" }}>
    <div style={{ fontSize: 46 }}>{icon}</div>
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 900, color, letterSpacing: -1 }}>{label}</div>
  </div>
);

export const CanhGioiTruongLaoThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)", backgroundSize: "120px 100%" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 20%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 84%, " + BLUE + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 66, marginBottom: 44 }}>🏯</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 108, fontWeight: 900, color: GOLD, lineHeight: 0.96, letterSpacing: -5 }}>5 CẢNH GIỚI</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 82, fontWeight: 900, color: TEXT, lineHeight: 1.04, letterSpacing: -2.5, marginTop: 6 }}>TRƯỞNG LÃO</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 38, fontWeight: 800, color: MUTE, lineHeight: 1.1, letterSpacing: -0.5, marginTop: 10 }}>MÀ DÂN TU TIÊN ĐI LÀM ĐỀU GẶP</div>
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
          fontSize: 40,
          fontWeight: 900,
          color: BG,
          background: GOLD,
          borderRadius: 999,
          padding: "18px 40px",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        SẾP MÀY Ở CẢNH GIỚI NÀO?
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 23, color: MUTE, letterSpacing: 5, opacity: 0.65 }}>
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
