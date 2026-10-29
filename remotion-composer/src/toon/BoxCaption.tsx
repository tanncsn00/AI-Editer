import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["800"], subsets: ["vietnamese", "latin", "latin-ext"] });

export type CaptionLine = { t: string; start: number; end: number };

export const BoxCaption: React.FC<{ lines: CaptionLine[]; top: number; hold?: number }> = ({ lines, top, hold = 0.25 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = lines.find((l) => t >= l.start - 0.06 && t < l.end + hold);
  if (!active) return null;
  const p = spring({ frame: frame - (active.start - 0.06) * fps, fps, config: { damping: 13, stiffness: 260, mass: 0.4 } });
  return (
    <AbsoluteFill style={{ top, height: "auto", alignItems: "center" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 60px",
          padding: "14px 30px",
          background: "#fff",
          border: "6px solid #111",
          borderRadius: 22,
          boxShadow: "0 8px 0 #111",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1.2,
          color: "#111",
          textAlign: "center",
          transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
          opacity: p,
        }}
      >
        {active.t}
      </div>
    </AbsoluteFill>
  );
};
