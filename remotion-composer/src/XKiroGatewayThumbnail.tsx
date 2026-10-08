import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#05090A";
const GREEN = "#22C55E";
const GOLD = "#F0B23C";
const TEXT = "#E8F2EC";
const MUTE = "#4E635A";

const Chip: React.FC<{ name: string }> = ({ name }) => (
  <div
    style={{
      fontFamily: "JetBrains Mono",
      fontSize: 42,
      fontWeight: 700,
      color: TEXT,
      border: "3px solid " + GREEN + "55",
      background: GREEN + "12",
      borderRadius: 16,
      padding: "14px 26px",
      letterSpacing: 1,
    }}
  >
    {name}
  </div>
);

export const XKiroGatewayThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(90deg, " + GREEN + "0C 1px, transparent 1px), linear-gradient(0deg, " + GREEN + "09 1px, transparent 1px)",
        backgroundSize: "140px 140px",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 26%, " + GREEN + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 82%, " + GOLD + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 66, marginBottom: 10 }}>🏯</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 25, color: MUTE, letterSpacing: 8, marginBottom: 18 }}>THIÊN CƠ CÁC</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 120, fontWeight: 900, color: GOLD, lineHeight: 1.32, letterSpacing: -3, whiteSpace: "pre-line" }}>
          {"30 TRIỆU\nTOKEN"}
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 800, color: TEXT, marginTop: 16 }}>
          cho người mới · 1 tháng
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        <Chip name="Claude" />
        <Chip name="GPT" />
        <Chip name="Gemini" />
        <Chip name="DeepSeek" />
      </div>

      <div
        style={{
          alignSelf: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 44,
          fontWeight: 900,
          color: BG,
          background: GREEN,
          borderRadius: 999,
          padding: "20px 44px",
          letterSpacing: 0.5,
        }}
      >
        MỘT API KEY · GỌI HẾT
      </div>

      <div style={{ textAlign: "center", fontFamily: "Be Vietnam Pro", fontSize: 96, fontWeight: 900, color: GREEN, letterSpacing: -2 }}>
        xKiro
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
