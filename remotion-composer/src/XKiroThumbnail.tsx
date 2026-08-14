import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["600", "700"], subsets: ["latin"] });

const BG = "#05090A";
const GREEN = "#22C55E";
const GOLD = "#F0B23C";
const TEXT = "#E8F2EC";
const SEC = "#8FA79A";

const LOGOS = ["Claude_ai.svg", "OpenAI_dark.svg", "gemini.svg", "deepseek.svg", "glm_logo.png", "Grok_dark.svg"];

export const XKiroThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${GREEN}12 1px, transparent 1px), linear-gradient(90deg, ${GREEN}12 1px, transparent 1px)`,
        backgroundSize: "96px 96px",
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1000px at 50% 40%, ${GREEN}26 0%, transparent 62%)` }} />

    <AbsoluteFill style={{ padding: 76, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 66, height: 6, background: GREEN, borderRadius: 3 }} />
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GREEN, letterSpacing: 6 }}>THIÊN CƠ CÁC</div>
      </div>

      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 112, fontWeight: 900, color: TEXT, lineHeight: 1.02, letterSpacing: -5, whiteSpace: "nowrap" }}>
        20 ĐẠI NĂNG AI
        <br />
        <span style={{ color: GREEN, textShadow: `0 0 60px ${GREEN}88` }}>1 ĐẠO API</span>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {LOGOS.map((l) => (
          <div
            key={l}
            style={{
              width: 116,
              height: 116,
              borderRadius: 26,
              background: "#101C18",
              border: `2px solid ${GREEN}3A`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img src={staticFile(`xkiro/${l}`)} style={{ width: 68, height: 68, objectFit: "contain" }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 16, alignItems: "stretch" }}>
        <div
          style={{
            padding: "22px 38px",
            borderRadius: 20,
            background: `${GOLD}18`,
            border: `3px solid ${GOLD}`,
            fontFamily: "Be Vietnam Pro",
            fontSize: 56,
            fontWeight: 900,
            color: GOLD,
            whiteSpace: "nowrap",
          }}
        >
          5 TRIỆU TOKEN / NGÀY
        </div>
        <div
          style={{
            padding: "22px 40px",
            borderRadius: 20,
            background: GREEN,
            fontFamily: "Be Vietnam Pro",
            fontSize: 56,
            fontWeight: 900,
            color: "#04140B",
            boxShadow: `0 0 50px ${GREEN}66`,
          }}
        >
          FREE
        </div>
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", top: 70, right: 76, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Img src={staticFile("xkiro/logo-xKiro-green.png")} style={{ width: 132, height: 132, filter: `drop-shadow(0 0 40px ${GREEN}99)` }} />
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 900, color: GREEN }}>xKiro</div>
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 62,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 30,
        color: SEC,
        letterSpacing: 5,
        opacity: 0.7,
      }}
    >
      ĐỘ KIẾP CÙNG GIỚI IT
    </div>
  </AbsoluteFill>
);
