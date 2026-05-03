/**
 * StickFigureFromPose — render an Alan-Becker-style SVG stick figure
 * driven by a MediaPipe tracking.json.
 *
 * Each frame: lookup landmarks, draw head circle + torso + arms + legs as <line>/<circle>.
 * Includes EMA smoothing to reduce jitter between frames.
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import type { Tracking } from "./PoseAttachedFX";

type Pt = { x: number; y: number; v: number } | null;

const pickPt = (frameLandmarks: any[], name: string): Pt => {
  const lm = frameLandmarks.find((l: any) => l.name === name);
  if (!lm) return null;
  return { x: lm.x, y: lm.y, v: lm.visibility ?? 1 };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => {
  if (!a) return b;
  if (!b) return a;
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), v: Math.max(a.v, b.v) };
};

/** Sample landmark from tracking with optional EMA smoothing across N frames back. */
const useSmoothedPoint = (
  tracking: Tracking,
  name: string,
  smoothFrames = 3,
): Pt => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(tracking.frames.length - 1, Math.round((frame / fps) * tracking.fps));
  let cur = pickPt(tracking.frames[idx]?.landmarks ?? [], name);
  for (let k = 1; k <= smoothFrames; k++) {
    const prev = pickPt(tracking.frames[Math.max(0, idx - k)]?.landmarks ?? [], name);
    cur = lerpPt(cur, prev, 0.3);
  }
  return cur;
};

export type StickStyle = {
  /** stroke color */
  color?: string;
  /** body line stroke width (px in SVG units) */
  bodyWidth?: number;
  /** head radius (px) */
  headRadius?: number;
  /** hand/foot dot radius */
  jointDot?: number;
  /** background — null = transparent over video, "#fff" for whiteboard look */
  bg?: string | null;
  /** visibility threshold to draw a joint */
  visMin?: number;
};

export const StickFigureFromPose: React.FC<{
  tracking: Tracking;
  style?: StickStyle;
}> = ({ tracking, style = {} }) => {
  const {
    color = "#1A1820",
    bodyWidth = 14,
    headRadius = 36,
    jointDot = 8,
    bg = null,
    visMin = 0.35,
  } = style;

  const W = tracking.width;
  const H = tracking.height;

  const nose = useSmoothedPoint(tracking, "nose");
  const sL = useSmoothedPoint(tracking, "left_shoulder");
  const sR = useSmoothedPoint(tracking, "right_shoulder");
  const eL = useSmoothedPoint(tracking, "left_elbow");
  const eR = useSmoothedPoint(tracking, "right_elbow");
  const wL = useSmoothedPoint(tracking, "left_wrist");
  const wR = useSmoothedPoint(tracking, "right_wrist");
  const hL = useSmoothedPoint(tracking, "left_hip");
  const hR = useSmoothedPoint(tracking, "right_hip");
  const kL = useSmoothedPoint(tracking, "left_knee");
  const kR = useSmoothedPoint(tracking, "right_knee");
  const aL = useSmoothedPoint(tracking, "left_ankle");
  const aR = useSmoothedPoint(tracking, "right_ankle");

  const px = (p: Pt) => (p ? p.x * W : 0);
  const py = (p: Pt) => (p ? p.y * H : 0);

  // Spine: midpoint of shoulders → midpoint of hips
  const midShoulder: Pt = useMemo(
    () => (sL && sR ? { x: (sL.x + sR.x) / 2, y: (sL.y + sR.y) / 2, v: Math.min(sL.v, sR.v) } : null),
    [sL, sR],
  );
  const midHip: Pt = useMemo(
    () => (hL && hR ? { x: (hL.x + hR.x) / 2, y: (hL.y + hR.y) / 2, v: Math.min(hL.v, hR.v) } : null),
    [hL, hR],
  );

  // Head position: extend from midShoulder past nose, OR fall back to nose itself
  const headCenter: Pt = useMemo(() => {
    if (nose && midShoulder) {
      // Head sits a bit above nose (toward top of head)
      const dx = nose.x - midShoulder.x;
      const dy = nose.y - midShoulder.y;
      return { x: nose.x + dx * 0.25, y: nose.y + dy * 0.25, v: nose.v };
    }
    return nose;
  }, [nose, midShoulder]);

  const Line = ({ a, b }: { a: Pt; b: Pt }) =>
    a && b && a.v > visMin && b.v > visMin ? (
      <line
        x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
        stroke={color} strokeWidth={bodyWidth} strokeLinecap="round"
      />
    ) : null;

  const Dot = ({ p, r }: { p: Pt; r?: number }) =>
    p && p.v > visMin ? <circle cx={px(p)} cy={py(p)} r={r ?? jointDot} fill={color} /> : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, background: bg ?? "transparent" }}
    >
      {/* Spine */}
      <Line a={midShoulder} b={midHip} />
      {/* Shoulders bar */}
      <Line a={sL} b={sR} />
      {/* Hips bar */}
      <Line a={hL} b={hR} />
      {/* Arms */}
      <Line a={sL} b={eL} />
      <Line a={eL} b={wL} />
      <Line a={sR} b={eR} />
      <Line a={eR} b={wR} />
      {/* Legs */}
      <Line a={hL} b={kL} />
      <Line a={kL} b={aL} />
      <Line a={hR} b={kR} />
      <Line a={kR} b={aR} />
      {/* Joint dots (hands + feet) */}
      <Dot p={wL} r={jointDot * 1.4} />
      <Dot p={wR} r={jointDot * 1.4} />
      <Dot p={aL} r={jointDot * 1.4} />
      <Dot p={aR} r={jointDot * 1.4} />
      {/* Head */}
      {headCenter && headCenter.v > visMin && (
        <circle
          cx={px(headCenter)} cy={py(headCenter)}
          r={headRadius}
          fill="none" stroke={color} strokeWidth={bodyWidth}
        />
      )}
    </svg>
  );
};
