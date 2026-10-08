import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { InkScape, ScrollRule, BODY, CINNABAR, EMPHASIS } from "./codophong_ink";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300", "600", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

export const NgayDauNhapTongMonThumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#070505" }}>
    <InkScape />
    <ScrollRule />

    <div style={{
      position: "absolute", left: 76, top: 214,
      border: `5px solid ${CINNABAR}`, borderRadius: 10, padding: "20px 14px", width: 116,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      transform: "rotate(-4deg)", boxShadow: "0 0 34px rgba(178,58,46,0.45)",
    }}>
      {"NHẬPMÔN".split("").map((ch, i) => (
        <span key={i} style={{
          fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 44,
          color: CINNABAR, lineHeight: 1, textShadow: "0 0 16px rgba(178,58,46,0.55)",
        }}>{ch}</span>
      ))}
    </div>

    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 40,
        color: EMPHASIS, letterSpacing: "10px", textTransform: "uppercase",
        marginBottom: 40, textShadow: "0 0 24px rgba(201,162,39,0.5), 0 3px 12px rgba(0,0,0,0.95)",
      }}>truyện tu tiên</div>

      <div style={{
        fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 176,
        color: BODY, textAlign: "center", lineHeight: 1.02, letterSpacing: "3px",
        textTransform: "uppercase",
        textShadow: "0 0 60px rgba(237,228,206,0.3), 0 0 170px rgba(201,162,39,0.34), 0 12px 34px rgba(0,0,0,0.96)",
        whiteSpace: "pre-line",
      }}>Ngày đầu{"\n"}nhập tông môn</div>

      <div style={{
        height: 3, width: 560, marginTop: 46, marginBottom: 46,
        background: `linear-gradient(to right, rgba(178,58,46,0) 0%, ${CINNABAR} 50%, rgba(178,58,46,0) 100%)`,
        boxShadow: "0 0 22px rgba(178,58,46,0.65)",
      }} />

      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: 60,
        color: BODY, textAlign: "center", lineHeight: 1.3, maxWidth: 880,
        textShadow: "0 4px 18px rgba(0,0,0,0.95)",
        whiteSpace: "pre-line",
      }}>Luật sinh tồn{"\n"}cho người mới đi làm</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
