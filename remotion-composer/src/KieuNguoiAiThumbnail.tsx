import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const MUTE = "#6E6780";

const ROWS: Array<[string, string, string]> = [
  ["🙏", "NỮ TU LỄ NGHI", JADE],
  ["👔", "TỔNG TÀI BÁ ĐẠO", GOLD],
  ["😤", "BỐ ĐỜI CỤC SÚC", RED],
  ["🔍", "ĐẠO SĨ ĐA NGHI", TEXT],
  ["😴", "MA TÔN LƯỜI BIẾNG", "#A78BFA"],
];

const Row: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      border: "3px solid " + color + "55",
      background: color + "12",
      borderRadius: 18,
      padding: "16px 26px",
    }}
  >
    <div style={{ fontSize: 52 }}>{icon}</div>
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 900, color, letterSpacing: -1 }}>{label}</div>
  </div>
);

export const KieuNguoiAiThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)",
        backgroundSize: "120px 100%",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 22%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 82%, " + RED + "16 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 64, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 30 }}>📜</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 118, fontWeight: 900, color: GOLD, lineHeight: 0.98, letterSpacing: -4 }}>
          5 KIỂU
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 60, fontWeight: 900, color: TEXT, lineHeight: 1.1, letterSpacing: -1.5, marginTop: 6 }}>
          NGƯỜI KHI DÙNG AI
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
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
        }}
      >
        NGƯƠI THUỘC CẢNH GIỚI NÀO?
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 46,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: MUTE,
        letterSpacing: 5,
        opacity: 0.65,
      }}
    >
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
