import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadJakarta("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["700", "800"], subsets: ["vietnamese", "latin"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });

const BG = "#0A0B0A";
const GREEN = "#22C55E";
const GREEN_DEEP = "#16A34A";
const GREEN_LIGHT = "#4ADE80";
const MINT = "#86EFAC";
const AMBER = "#F0B23C";
const BLUE = "#7DD3FC";
const TEXT = "#F3F5F2";
const MUTED = "#8A938C";
const SANS = "'Plus Jakarta Sans', sans-serif";
const SERIF = "'EB Garamond', serif";
const MONO = "'JetBrains Mono', monospace";

export const XKiroClaudeCodeThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG, alignItems: "center" }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${GREEN_DEEP}40 2px, transparent 2px)`, backgroundSize: "48px 48px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 800px at 50% 40%, ${GREEN_DEEP}40 0%, transparent 65%)` }} />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 96, color: MINT, textShadow: `0 0 40px ${MINT}66` }}>Khắc trận pháp</div>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Img src={staticFile("xkiro-claude-code/Claude_ai.svg")} style={{ width: 120, height: 120 }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 124, color: TEXT, letterSpacing: -5, lineHeight: 1, whiteSpace: "nowrap" }}>Claude Code</div>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: GREEN, lineHeight: 1 }}>+</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 50px", borderRadius: 30, background: "#111412", border: `3px solid ${GREEN}`, boxShadow: `0 0 70px ${GREEN}55` }}>
        <Img src={staticFile("xkiro-claude-code/logo-xKiro-green.png")} style={{ width: 110, height: 110 }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: TEXT }}>xKiro</div>
      </div>
      <div style={{ width: 940, background: "#111412", border: "2px solid #ffffff1a", borderRadius: 26, padding: "34px 36px", boxSizing: "border-box", fontFamily: MONO, fontSize: 34, lineHeight: 1.7 }}>
        <div style={{ color: MUTED }}>~/.claude/settings.json</div>
        <div style={{ color: BLUE }}>"ANTHROPIC_BASE_URL":</div>
        <div style={{ color: GREEN_LIGHT, borderLeft: `6px solid ${GREEN}`, paddingLeft: 18, background: `${GREEN}22` }}>"https://api.xkiro.com"</div>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: TEXT, lineHeight: 1 }}>
        Đổi <span style={{ color: AMBER }}>một dòng</span>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
