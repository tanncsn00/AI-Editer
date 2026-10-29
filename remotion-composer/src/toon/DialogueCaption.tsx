import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["600", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const BODY = "#EEEEEA";
const LEAD = 0.1;

export type SpokenLine = { t: string; start: number; end: number };

const timedWords = (line: SpokenLine) => {
  const words = line.t.split(/\s+/);
  const total = words.reduce((n, w) => n + w.length, 0);
  let acc = 0;
  return words.map((word) => {
    const start = line.start + ((line.end - line.start) * acc) / total;
    acc += word.length;
    return { word, start };
  });
};

export const DialogueCaption: React.FC<{ lines: SpokenLine[]; top: number }> = ({ lines, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = lines.find((l, i) => t >= l.start - 0.15 && t < (lines[i + 1]?.start ?? l.end + 0.7));
  if (!active) return null;
  return (
    <AbsoluteFill style={{ top, height: "auto", alignItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 920, padding: "0 60px" }}>
        {timedWords(active).map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * fps, fps, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 54,
                color: BODY,
                textShadow: "0 3px 12px rgba(0,0,0,0.95)",
                opacity: t >= appearAt ? sp : 0,
                transform: `translateY(${interpolate(sp, [0, 1], [12, 0])}px)`,
                filter: `blur(${interpolate(sp, [0, 1], [4, 0])}px)`,
                lineHeight: 1.3,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
