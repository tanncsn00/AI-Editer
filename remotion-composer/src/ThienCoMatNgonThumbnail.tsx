import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const MUTE = "#6E6780";

const Decode: React.FC<{ said: string; means: string }> = ({ said, means }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
    <div
      style={{
        fontFamily: "Be Vietnam Pro",
        fontSize: 56,
        fontWeight: 800,
        color: GOLD,
        border: "3px solid " + GOLD + "66",
        background: GOLD + "14",
        borderRadius: 20,
        padding: "22px 30px",
        textAlign: "center",
      }}
    >
      {said}
    </div>
    <div style={{ textAlign: "center", fontSize: 40, color: MUTE, lineHeight: 1 }}>▼</div>
    <div
      style={{
        fontFamily: "Be Vietnam Pro",
        fontSize: 52,
        fontWeight: 900,
        color: RED,
        border: "3px solid " + RED,
        background: RED + "18",
        borderRadius: 20,
        padding: "22px 30px",
        textAlign: "center",
        lineHeight: 1.18,
        whiteSpace: "pre-line",
      }}
    >
      {means}
    </div>
  </div>
);

export const ThienCoMatNgonThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)",
        backgroundSize: "120px 100%",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 24%, " + GOLD + "24 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 80%, " + RED + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 46 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 82, marginBottom: 10 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, color: MUTE, letterSpacing: 8, marginBottom: 18 }}>TRUYỀN KỲ CÔNG SỞ</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 96, fontWeight: 900, color: GOLD, lineHeight: 1.04, letterSpacing: -3, whiteSpace: "pre-line" }}>
          {"THIÊN CƠ\nMẬT NGÔN"}
        </div>
      </div>

      <Decode said="“EM CÓ RẢNH KHÔNG?”" means={"“NHẬN THÊM\nMỘT KIẾP NẠN KHÔNG?”"} />

      <div
        style={{
          alignSelf: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 44,
          fontWeight: 900,
          color: TEXT,
          border: "3px solid " + TEXT + "40",
          borderRadius: 999,
          padding: "18px 44px",
          letterSpacing: 1,
        }}
      >
        5 CÂU SẾP HAY NÓI
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 48,
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
