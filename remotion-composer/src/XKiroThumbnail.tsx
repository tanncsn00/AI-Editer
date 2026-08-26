import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["600", "700"], subsets: ["latin"] });

const BG = "#05090A";
const PANEL = "#0E1A16";
const GREEN = "#22C55E";
const GOLD = "#F0B23C";
const TEXT = "#E8F2EC";
const SEC = "#8FA79A";

const ORBIT = [
  "Claude_ai.svg",
  "OpenAI_dark.svg",
  "gemini.svg",
  "deepseek.svg",
  "glm_logo.png",
  "Grok_dark.svg",
  "Qwen-Ai-Logo.png",
  "Ollama_dark.svg",
];

const R = 372;

export const XKiroThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${GREEN}10 1px, transparent 1px), linear-gradient(90deg, ${GREEN}10 1px, transparent 1px)`,
        backgroundSize: "96px 96px",
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 820px at 50% 46%, ${GREEN}2E 0%, transparent 62%)` }} />

    <div style={{ position: "absolute", top: 132, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GREEN, letterSpacing: 11 }}>THIÊN CƠ CÁC</div>
    </div>

    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1080, height: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            width: R * 2 + 120,
            height: R * 2 + 120,
            borderRadius: "50%",
            border: `2px solid ${GREEN}22`,
          }}
        />
        {ORBIT.map((f, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * R;
          const y = Math.sin(a) * R * 0.9;
          return (
            <div
              key={f}
              style={{
                position: "absolute",
                transform: `translate(${x}px, ${y}px)`,
                width: 116,
                height: 116,
                borderRadius: 28,
                background: PANEL,
                border: `2px solid ${GREEN}3A`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 34px ${GREEN}1E`,
              }}
            >
              <Img src={staticFile(`xkiro/${f}`)} style={{ width: 68, height: 68, objectFit: "contain" }} />
            </div>
          );
        })}

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Img
            src={staticFile("xkiro/logo-xKiro-green.png")}
            style={{ width: 400, height: 400, filter: `drop-shadow(0 0 90px ${GREEN}AA) drop-shadow(0 0 180px ${GREEN}55)` }}
          />
          <div
            style={{
              fontFamily: "Be Vietnam Pro",
              fontSize: 138,
              fontWeight: 900,
              color: GREEN,
              letterSpacing: -4,
              lineHeight: 1,
              textShadow: `0 0 60px ${GREEN}66`,
            }}
          >
            xKiro
          </div>
        </div>
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", bottom: 246, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 68, fontWeight: 900, color: TEXT, letterSpacing: -2, whiteSpace: "nowrap", lineHeight: 1.18 }}>
        20 ĐẠI NĂNG AI · <span style={{ color: GREEN }}>1 ĐẠO API</span>
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 108, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
      <div
        style={{
          padding: "20px 34px",
          borderRadius: 18,
          background: `${GOLD}18`,
          border: `3px solid ${GOLD}`,
          fontFamily: "Be Vietnam Pro",
          fontSize: 50,
          fontWeight: 900,
          color: GOLD,
          whiteSpace: "nowrap",
        }}
      >
        5 TRIỆU TOKEN / NGÀY
      </div>
      <div
        style={{
          padding: "20px 36px",
          borderRadius: 18,
          background: GREEN,
          fontFamily: "Be Vietnam Pro",
          fontSize: 50,
          fontWeight: 900,
          color: "#04140B",
          boxShadow: `0 0 54px ${GREEN}66`,
        }}
      >
        FREE
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 42,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 25,
        color: SEC,
        letterSpacing: 5,
        opacity: 0.55,
      }}
    >
      ĐỘ KIẾP CÙNG GIỚI IT
    </div>
  </AbsoluteFill>
);
