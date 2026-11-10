import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";

loadAnton("normal", { weights: ["400"], subsets: ["vietnamese", "latin"] });
loadBeVietnam("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });

const DIR = "azbot-brand";
const ORANGE = "#FF8A00";
const CREAM = "#FFF6E8";
const STROKE = "#3B1D06";
const SERIES_RED = "#E5322D";
const TITLE_FONT = "'Anton', Impact, sans-serif";
const UI_FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const SAFE_3x4_TOP = 240;
const SAFE_3x4_BOTTOM_Y = 1680;
const DEFAULT_BUBBLE = "Gặp khách khó?\nCó AZ lo!";

export type ThumbnailMascot = "an_mung" | "doi_dich_vu_co_le";

export type AZbotThumbnailProps = {
  series: string;
  hookTop: string;
  hookBottom: string;
  mascot: ThumbnailMascot;
  bubble?: string;
  children: React.ReactNode;
};

const HookLine: React.FC<{ text: string; color: string; size: number }> = ({ text, color, size }) => (
  <div style={{ fontFamily: TITLE_FONT, fontSize: size, lineHeight: 1.02, color, WebkitTextStroke: `${size * 0.12}px ${STROKE}`, paintOrder: "stroke fill", textTransform: "uppercase", textAlign: "center", whiteSpace: "nowrap", textShadow: "0 10px 0 #3b1d0630" }}>
    {text}
  </div>
);

export const AZbotThumbnail: React.FC<AZbotThumbnailProps> = ({ series, hookTop, hookBottom, mascot, bubble = DEFAULT_BUBBLE, children }) => (
  <AbsoluteFill style={{ background: "#E4DDCC" }}>
    <Img src={staticFile(`${DIR}/paper.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 760px 700px at 50% 45%, #FFB34730 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", top: SAFE_3x4_TOP + 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ background: SERIES_RED, color: "#fff", fontFamily: UI_FONT, fontWeight: 800, fontSize: 42, letterSpacing: 2, padding: "12px 40px", borderRadius: 999, textTransform: "uppercase", boxShadow: "0 8px 0 #8f1512" }}>{series}</div>
      <HookLine text={hookTop} color={CREAM} size={hookTop.length > 14 ? 118 : 138} />
      <HookLine text={hookBottom} color={ORANGE} size={hookBottom.length > 12 ? 134 : 156} />
      <div style={{ position: "relative", marginTop: 26 }}>{children}</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: SAFE_3x4_BOTTOM_Y - 430, padding: "26px 34px", background: "#fff", borderRadius: 40, border: `6px solid ${STROKE}`, boxShadow: "0 12px 0 #3b1d0630", fontFamily: UI_FONT, fontWeight: 800, fontSize: 46, lineHeight: 1.2, color: STROKE, whiteSpace: "pre-line" }}>
      {bubble}
      <div style={{ position: "absolute", right: -34, top: 64, width: 0, height: 0, borderTop: "22px solid transparent", borderBottom: "22px solid transparent", borderLeft: `40px solid ${STROKE}` }} />
    </div>
    <Img src={staticFile(`${DIR}/azbot_logo.png`)} style={{ position: "absolute", left: 64, top: SAFE_3x4_BOTTOM_Y - 150, width: 270 }} />
    <Img src={staticFile(`${DIR}/azbot_${mascot}.png`)} style={{ position: "absolute", right: 30, top: SAFE_3x4_BOTTOM_Y - 520, height: 500, transform: "rotate(5deg)", filter: "drop-shadow(0 22px 26px #5a3a1a55)" }} />
  </AbsoluteFill>
);
