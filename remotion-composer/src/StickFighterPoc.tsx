/**
 * StickFighterPoc — replace the boxer with an Alan-Becker-style stick figure
 * driven by his real movement (MediaPipe pose).
 *
 * Mode 1 (default): stick figure on white whiteboard
 * Mode 2 (showSource=true): stick figure overlay on top of the source video
 * Mode 3 (sideBySide=true): split-screen — source left, stick figure right
 */

import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { StickFigureFromPose } from "./fx/StickFigureFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./human_vfx_poc_tracking.json";

const T = tracking as Tracking;

const MODE: "whiteboard" | "overlay" | "split" = "overlay";

export const StickFighterPoc: React.FC = () => {
  if (MODE === "whiteboard") {
    return (
      <AbsoluteFill style={{ background: "#FAFAF5" }}>
        {/* Subtle grid for whiteboard feel */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1A1820" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <StickFigureFromPose
          tracking={T}
          style={{ color: "#1A1820", bodyWidth: 16, headRadius: 50, jointDot: 10 }}
        />
      </AbsoluteFill>
    );
  }
  // overlay + split modes for comparison renders
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("human_vfx_poc/source.mp4")} muted />
      <StickFigureFromPose
        tracking={T}
        style={{ color: "#FF3D0A", bodyWidth: 14, headRadius: 42, jointDot: 9 }}
      />
    </AbsoluteFill>
  );
};
