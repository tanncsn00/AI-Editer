import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";

const { fontFamily } = loadFont("normal", { weights: ["900"], subsets: ["vietnamese", "latin", "latin-ext"] });

const INK = "#111";

const Tag: React.FC<{ bg: string; color?: string; size: number; rot: number; children: React.ReactNode }> = ({ bg, color = INK, size, rot, children }) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 36px",
      background: bg,
      color,
      border: `9px solid ${INK}`,
      borderRadius: 28,
      boxShadow: `0 12px 0 ${INK}`,
      fontFamily,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.1,
      textAlign: "center",
      transform: `rotate(${rot}deg)`,
    }}
  >
    {children}
  </div>
);

export const ToonGiaoHangThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#3E4A63" }}>
    <Img src={staticFile("toon_giao_hang/thumb_art.png")} style={{ width: 1080, height: 1920 }} />
    <AbsoluteFill style={{ top: 110, height: "auto", alignItems: "center", gap: 34 }}>
      <Tag bg="#FFD24A" size={128} rot={-3}>CHỬI SHIPPER</Tag>
      <Tag bg="#fff" size={70} rot={2}>vì giao trễ 2 tiếng…</Tag>
    </AbsoluteFill>
    <AbsoluteFill style={{ top: 1610, height: "auto", alignItems: "center" }}>
      <Tag bg="#E4473C" color="#fff" size={120} rot={-2}>VÀ CÁI KẾT</Tag>
    </AbsoluteFill>
  </AbsoluteFill>
);
