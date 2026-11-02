import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadJakarta("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });
loadJetBrains("normal", { weights: ["600"], subsets: ["latin"] });

const GOLD = "#86EFAC";
const PAPER = "#E6F4EA";
const SEAL = "#C8312B";
const GREEN = "#22C55E";

export const XKiroLimitThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0B0A", alignItems: "center" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 700px at 50% 25%, ${GOLD}26 0%, transparent 65%)` }} />
    <AbsoluteFill style={{ top: 1100, background: "linear-gradient(#0A0B0A00, #0A0B0A 30%)" }} />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(#16A34A40 2px, transparent 2px)", backgroundSize: "48px 48px" }} />
    <AbsoluteFill style={{ top: 1150, background: `radial-gradient(ellipse 800px 500px at 50% 40%, #16A34A3A 0%, transparent 70%)` }} />

    <div style={{ position: "absolute", top: 170, fontFamily: "'EB Garamond', serif", fontWeight: 800, fontSize: 190, color: GOLD, lineHeight: 0.95, textAlign: "center", textShadow: `0 0 60px ${GOLD}66, 0 10px 30px #000` }}>
      HẾT LƯỢT
      <br />
      KIẾP
    </div>

    <div style={{ position: "absolute", top: 640, width: 900, display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-3deg)" }}>
      <div style={{ width: 960, height: 46, borderRadius: 23, background: "linear-gradient(#1F7A45, #0F3D22)" }} />
      <div style={{ width: 880, height: 330, background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 76, color: "#1A1714" }}>5-hour limit reached</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 52, color: SEAL }}>Resets 9:50 PM</div>
      </div>
      <div style={{ width: 960, height: 46, borderRadius: 23, background: "linear-gradient(#1F7A45, #0F3D22)" }} />
      <div style={{ position: "absolute", right: -40, bottom: -40, width: 230, height: 230, border: `12px solid ${SEAL}`, borderRadius: 20, color: SEAL, fontFamily: "'EB Garamond', serif", fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1, transform: "rotate(-8deg)", background: "#C8312B18" }}>
        HẾT
        <br />
        LƯỢT
      </div>
    </div>

    <div style={{ position: "absolute", top: 1180, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 84, color: "#F3F5F2", textAlign: "center", lineHeight: 1.15 }}>
      Mua Claude Pro,
      <br />
      hỏi 2 câu là <span style={{ color: SEAL }}>hết lượt?</span>
    </div>

    <div style={{ position: "absolute", top: 1450, display: "flex", alignItems: "center", gap: 24, padding: "26px 44px", borderRadius: 30, background: "#111412", border: `3px solid ${GREEN}`, boxShadow: `0 0 70px ${GREEN}55` }}>
      <Img src={staticFile("xkiro-limit/logo-xKiro-green.png")} style={{ width: 80, height: 80 }} />
      <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 800, fontSize: 64, color: GOLD }}>1 lệnh bài · gọi cả thiên hạ</div>
    </div>
  </AbsoluteFill>
);
