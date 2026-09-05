import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0A0913";
const GOLD = "#E5B54C";
const VIOLET = "#A78BFA";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const MUTE = "#6E6780";

const Side: React.FC<{ who: string; text: string; color: string; size: number; dashed?: boolean }> = ({ who, text, color, size, dashed = false }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, fontWeight: 700, color: MUTE, letterSpacing: 3, textAlign: "center" }}>{who}</div>
    <div
      style={{
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 900,
        color,
        border: "3px " + (dashed ? "dashed " : "solid ") + color + (dashed ? "" : "66"),
        background: color + "16",
        borderRadius: dashed ? 28 : 20,
        padding: "24px 30px",
        textAlign: "center",
        lineHeight: 1.16,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  </div>
);

export const ThaTamThongThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle 860px at 50% 26%, " + VIOLET + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 700px at 50% 84%, " + RED + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 38 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 25, color: GOLD, letterSpacing: 7, marginBottom: 20, opacity: 0.75 }}>
          📜 GIẢ THUYẾT TU TIÊN GIỚI
        </div>
        <div style={{ fontSize: 84, marginBottom: 14 }}>🧠</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 82, fontWeight: 900, color: GOLD, lineHeight: 1.06, letterSpacing: -2.5, whiteSpace: "pre-line" }}>
          {"NẾU SẾP ĐỌC ĐƯỢC\nSUY NGHĨ NHÂN VIÊN"}
        </div>
      </div>

      <Side who="NGOÀI MIỆNG" text={"“ĐỆ TỬ NGUYỆN Ý!”"} color={JADE} size={50} />
      <div style={{ textAlign: "center", fontSize: 44, color: MUTE, lineHeight: 0.6 }}>▼</div>
      <Side who="TRONG ĐẦU" text={"“NGUYỆN CÁI ĐẦU TA.”"} color={RED} size={58} dashed />

      <div
        style={{
          alignSelf: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 38,
          fontWeight: 900,
          color: VIOLET,
          border: "3px solid " + VIOLET + "55",
          borderRadius: 999,
          padding: "18px 38px",
          letterSpacing: 0.5,
        }}
      >
        7 LẦN HỎI · 7 SỰ THẬT
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
