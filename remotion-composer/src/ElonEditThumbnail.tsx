import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const FACE_SCALE = 1.5;
const FACE_LEFT = -540;
const FACE_TOP = -117;
const INSET_W = 440;
const INSET_H = 250;
const INSET_TOP = 1330;
const ACCENT = "#FF5A36";
const SHADOW = "0 4px 24px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)";

const Inset: React.FC<{ src: string; left: number; label: string; color: string; zoom: number }> = ({ src, left, label, color, zoom }) => (
  <div style={{ position: "absolute", left, top: INSET_TOP, width: INSET_W }}>
    <div style={{ width: INSET_W, height: INSET_H, overflow: "hidden", border: `3px solid ${color}`, borderRadius: 6 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "contrast(1.08) saturate(0.9)" }} />
    </div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 52, color, textAlign: "center", marginTop: 12, letterSpacing: "0.08em", textShadow: SHADOW }}>{label}</div>
  </div>
);

export const ElonEditThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img
      src={staticFile("elon/thumb_face.jpg")}
      style={{ position: "absolute", left: FACE_LEFT, top: FACE_TOP, width: 1920 * FACE_SCALE, filter: "contrast(1.1) saturate(0.8) brightness(0.85)" }}
    />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 22%, transparent 42%, rgba(0,0,0,0.85) 62%, #000 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 55% at 50% 35%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
    <div style={{ position: "absolute", top: 150, width: W, textAlign: "center", fontFamily, fontWeight: 500, fontSize: 46, letterSpacing: "0.3em", color: "#E9E1D2", textShadow: SHADOW }}>
      ELON MUSK
    </div>
    <div style={{ position: "absolute", top: 900, width: W, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 112, lineHeight: 1.08, color: "#FFFFFF", textShadow: SHADOW }}>
      TÔI KHÔNG
      <br />
      BAO GIỜ
      <br />
      <span style={{ color: ACCENT }}>BỎ CUỘC.</span>
    </div>
    <Inset src="elon/thumb_boom.jpg" left={70} label="2008" color={ACCENT} zoom={1.6} />
    <Inset src="elon/thumb_catch.jpg" left={W - 70 - INSET_W} label="2024" color="#FFFFFF" zoom={1} />
    <div style={{ position: "absolute", top: INSET_TOP + INSET_H / 2 - 50, width: W, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 80, color: "#FFFFFF", textShadow: SHADOW }}>→</div>
    <div style={{ position: "absolute", top: 1730, width: W, textAlign: "center", fontFamily, fontWeight: 300, fontSize: 40, letterSpacing: "0.08em", color: "#E9E1D2", textShadow: SHADOW }}>
      ~ 3 lần nổ. Hết tiền. Vẫn không dừng. ~
    </div>
  </AbsoluteFill>
);
