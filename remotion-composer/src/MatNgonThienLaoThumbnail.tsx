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

const Side: React.FC<{ who: string; text: string; color: string; size: number }> = ({ who, text, color, size }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 3, textAlign: "center" }}>{who}</div>
    <div
      style={{
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 900,
        color,
        border: "3px solid " + color + (color === RED ? "" : "66"),
        background: color + "16",
        borderRadius: 20,
        padding: "22px 30px",
        textAlign: "center",
        lineHeight: 1.16,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  </div>
);

export const MatNgonThienLaoThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)",
        backgroundSize: "120px 100%",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 24%, " + GOLD + "24 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 80%, " + RED + "16 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 38 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 74, marginBottom: 10 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 25, color: MUTE, letterSpacing: 8, marginBottom: 16 }}>THIÊN CƠ MẬT NGÔN</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 104, fontWeight: 900, color: GOLD, lineHeight: 1.02, letterSpacing: -3, whiteSpace: "pre-line" }}>
          {"MẬT NGÔN\nTÙ TỘI"}
        </div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, color: TEXT, letterSpacing: 3, marginTop: 16, opacity: 0.7 }}>
          THIÊN LAO DỰ BỊ CHÂN NHÂN
        </div>
      </div>

      <Side who="NGƯỜI NGOÀI NGHE" text={"“CUỐI THÁNG MÌNH\nCHỐT SỔ NHÉ.”"} color={TEXT} size={46} />
      <div style={{ textAlign: "center", fontSize: 42, color: MUTE, lineHeight: 0.6 }}>▼</div>
      <Side who="THIÊN LAO NGHE" text={"“ĐẠI KIẾP ĐÃ ĐẾN.”"} color={RED} size={62} />

      <div
        style={{
          alignSelf: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 38,
          fontWeight: 900,
          color: JADE,
          border: "3px solid " + JADE + "55",
          borderRadius: 999,
          padding: "18px 36px",
          letterSpacing: 0.5,
        }}
      >
        5 CÂU KẾ TOÁN NÀO CŨNG SỢ
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
