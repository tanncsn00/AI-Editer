import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";

loadJakarta("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });

const BG = "#0A0B0A";
const GREEN = "#22C55E";
const GREEN_DEEP = "#16A34A";
const MINT = "#86EFAC";
const RED = "#F87171";
const TEXT = "#F3F5F2";
const SANS = "'Plus Jakarta Sans', sans-serif";
const SERIF = "'EB Garamond', serif";

const Gem: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, transform: "rotate(45deg)", background: "linear-gradient(135deg, #ffffffcc 0%, #7FE3C4 35%, #0d6b52 100%)", borderRadius: size * 0.12, boxShadow: `0 0 ${size * 0.5}px #7FE3C488` }} />
);

export const XKiroDropThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG, alignItems: "center" }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${GREEN_DEEP}40 2px, transparent 2px)`, backgroundSize: "48px 48px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 800px at 50% 38%, ${GREEN_DEEP}40 0%, transparent 65%)` }} />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
        {[90, 130, 90, 130, 90].map((s, i) => (
          <Gem key={i} size={s} />
        ))}
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 96, color: MINT, textShadow: `0 0 40px ${MINT}66` }}>Đạo môn phát linh thạch</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 156, color: TEXT, letterSpacing: -5, lineHeight: 1, textShadow: `0 0 70px ${GREEN}99` }}>50.000.000</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: MINT, letterSpacing: 10 }}>TOKEN · MỖI NGƯỜI</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 120, color: TEXT, lineHeight: 1 }}>Túi nào cũng trúng</div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ padding: "16px 34px", borderRadius: 40, border: `3px solid ${RED}88`, background: "#ffffff08", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: RED }}>Không cần thẻ</div>
        <div style={{ padding: "16px 34px", borderRadius: 40, border: `3px solid ${GREEN}88`, background: "#ffffff08", fontFamily: SANS, fontWeight: 800, fontSize: 42, color: GREEN }}>tới 22/11</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 30, padding: "24px 44px", borderRadius: 30, background: "#111412", border: `3px solid ${GREEN}`, boxShadow: `0 0 70px ${GREEN}55` }}>
        <Img src={staticFile("xkiro-drop/logo-xKiro-green.png")} style={{ width: 90, height: 90 }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, color: TEXT }}>xKiro</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
