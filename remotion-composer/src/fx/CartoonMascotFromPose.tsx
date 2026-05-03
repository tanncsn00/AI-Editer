/**
 * CartoonMascotFromPose — chibi cartoon character driven by MediaPipe pose.
 *
 * Anatomy (proper rig, not stick lines):
 *  - Head: filled circle with face features (sigma sunglasses + smug mouth)
 *  - Torso: filled rounded rect (shirt) following spine
 *  - Arms: thick rounded tubes, 2 segments each
 *  - Legs: thick rounded tubes, 2 segments each
 *  - Hands: filled circles (skin tone)
 *  - Feet: filled ovals (shoe)
 *
 * Style: meme bựa (Sigma face). Body proportion chibi (head 1.5x normal).
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Tracking } from "./PoseAttachedFX";

type Pt = { x: number; y: number; z: number; v: number } | null;

const pickAt = (frameLandmarks: any[], name: string): Pt => {
  const lm = frameLandmarks?.find?.((l: any) => l.name === name);
  if (!lm) return null;
  return { x: lm.x, y: lm.y, z: lm.z, v: lm.visibility ?? 1 };
};

export type CartoonStyle = {
  /** chibi head size multiplier — 1.0 normal, 1.6 chibi */
  headSize?: number;
  /** body fill tone */
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  shoeColor?: string;
  hairColor?: string;
  /** outline */
  outlineColor?: string;
  outlineWidth?: number;
  /** face style — "sigma" | "derp" | "wojak" */
  face?: "sigma" | "derp" | "wojak";
};

const SigmaFace: React.FC<{ cx: number; cy: number; r: number; outline: string; outlineW: number }> = ({
  cx, cy, r, outline, outlineW,
}) => (
  <g>
    {/* Sunglasses bar */}
    <line x1={cx - r * 0.85} y1={cy - r * 0.05} x2={cx + r * 0.85} y2={cy - r * 0.05} stroke={outline} strokeWidth={outlineW * 1.4} strokeLinecap="round" />
    {/* Left lens */}
    <ellipse cx={cx - r * 0.42} cy={cy + r * 0.05} rx={r * 0.32} ry={r * 0.22} fill="#0A0A0F" stroke={outline} strokeWidth={outlineW} />
    <ellipse cx={cx - r * 0.42} cy={cy + r * 0.05} rx={r * 0.32} ry={r * 0.22} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.4} />
    {/* Right lens */}
    <ellipse cx={cx + r * 0.42} cy={cy + r * 0.05} rx={r * 0.32} ry={r * 0.22} fill="#0A0A0F" stroke={outline} strokeWidth={outlineW} />
    <ellipse cx={cx + r * 0.42} cy={cy + r * 0.05} rx={r * 0.32} ry={r * 0.22} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.4} />
    {/* Highlight on lens — sigma stare */}
    <line x1={cx - r * 0.55} y1={cy - r * 0.05} x2={cx - r * 0.32} y2={cy + r * 0.15} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
    <line x1={cx + r * 0.30} y1={cy - r * 0.05} x2={cx + r * 0.55} y2={cy + r * 0.15} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
    {/* Smug mouth — slight smirk */}
    <path d={`M ${cx - r * 0.28} ${cy + r * 0.40} Q ${cx} ${cy + r * 0.55} ${cx + r * 0.36} ${cy + r * 0.32}`}
      stroke={outline} strokeWidth={outlineW} fill="none" strokeLinecap="round" />
    {/* Stubble hint */}
    <path d={`M ${cx - r * 0.45} ${cy + r * 0.55} Q ${cx} ${cy + r * 0.72} ${cx + r * 0.45} ${cy + r * 0.55}`}
      stroke={outline} strokeWidth={1.5} fill="none" opacity={0.4} strokeDasharray="2 2" />
  </g>
);

const DerpFace: React.FC<{ cx: number; cy: number; r: number; outline: string; outlineW: number }> = ({
  cx, cy, r, outline, outlineW,
}) => (
  <g>
    {/* Wonky derp eyes */}
    <circle cx={cx - r * 0.38} cy={cy - r * 0.05} r={r * 0.22} fill="#FFFFFF" stroke={outline} strokeWidth={outlineW} />
    <circle cx={cx + r * 0.38} cy={cy - r * 0.05} r={r * 0.22} fill="#FFFFFF" stroke={outline} strokeWidth={outlineW} />
    <circle cx={cx - r * 0.30} cy={cy - r * 0.10} r={r * 0.10} fill="#0A0A0F" />
    <circle cx={cx + r * 0.46} cy={cy} r={r * 0.10} fill="#0A0A0F" />
    {/* Open derp mouth */}
    <ellipse cx={cx} cy={cy + r * 0.45} rx={r * 0.20} ry={r * 0.14} fill="#9B2D2D" stroke={outline} strokeWidth={outlineW} />
    {/* Tongue */}
    <path d={`M ${cx - r * 0.10} ${cy + r * 0.50} Q ${cx} ${cy + r * 0.60} ${cx + r * 0.10} ${cy + r * 0.50}`} fill="#E07070" />
  </g>
);

const WojakFace: React.FC<{ cx: number; cy: number; r: number; outline: string; outlineW: number }> = ({
  cx, cy, r, outline, outlineW,
}) => (
  <g>
    {/* Squinty crying eyes */}
    <path d={`M ${cx - r * 0.55} ${cy - r * 0.10} Q ${cx - r * 0.38} ${cy + r * 0.05} ${cx - r * 0.20} ${cy - r * 0.10}`}
      stroke={outline} strokeWidth={outlineW} fill="none" strokeLinecap="round" />
    <path d={`M ${cx + r * 0.20} ${cy - r * 0.10} Q ${cx + r * 0.38} ${cy + r * 0.05} ${cx + r * 0.55} ${cy - r * 0.10}`}
      stroke={outline} strokeWidth={outlineW} fill="none" strokeLinecap="round" />
    {/* Eyebrows pleading */}
    <path d={`M ${cx - r * 0.62} ${cy - r * 0.30} Q ${cx - r * 0.38} ${cy - r * 0.42} ${cx - r * 0.18} ${cy - r * 0.20}`}
      stroke={outline} strokeWidth={outlineW * 0.9} fill="none" strokeLinecap="round" />
    <path d={`M ${cx + r * 0.18} ${cy - r * 0.20} Q ${cx + r * 0.38} ${cy - r * 0.42} ${cx + r * 0.62} ${cy - r * 0.30}`}
      stroke={outline} strokeWidth={outlineW * 0.9} fill="none" strokeLinecap="round" />
    {/* Frown mouth */}
    <path d={`M ${cx - r * 0.22} ${cy + r * 0.45} Q ${cx} ${cy + r * 0.32} ${cx + r * 0.22} ${cy + r * 0.45}`}
      stroke={outline} strokeWidth={outlineW} fill="none" strokeLinecap="round" />
  </g>
);

export const CartoonMascotFromPose: React.FC<{
  tracking: Tracking;
  style?: CartoonStyle;
}> = ({ tracking, style = {} }) => {
  const {
    headSize = 1.5,
    shirtColor = "#3D6BB8",
    pantsColor = "#2A2A38",
    skinColor = "#F2C8A0",
    shoeColor = "#1A1820",
    hairColor = "#0A0A0F",
    outlineColor = "#0A0A0F",
    outlineWidth = 6,
    face = "sigma",
  } = style;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(tracking.frames.length - 1, Math.round(t * tracking.fps));
  const f = tracking.frames[idx];
  if (!f?.landmarks?.length) return null;

  const W = tracking.width;
  const H = tracking.height;
  const visMin = 0.3;

  const get = (n: string) => pickAt(f.landmarks, n);
  const nose = get("nose");
  const sL = get("left_shoulder"), sR = get("right_shoulder");
  const eL = get("left_elbow"), eR = get("right_elbow");
  const wL = get("left_wrist"), wR = get("right_wrist");
  const hL = get("left_hip"), hR = get("right_hip");
  const kL = get("left_knee"), kR = get("right_knee");
  const aL = get("left_ankle"), aR = get("right_ankle");

  const px = (p: Pt) => (p ? p.x * W : 0);
  const py = (p: Pt) => (p ? p.y * H : 0);

  const midShoulder: Pt = sL && sR ? { x: (sL.x + sR.x) / 2, y: (sL.y + sR.y) / 2, z: 0, v: Math.min(sL.v, sR.v) } : null;
  const midHip: Pt = hL && hR ? { x: (hL.x + hR.x) / 2, y: (hL.y + hR.y) / 2, z: 0, v: Math.min(hL.v, hR.v) } : null;

  // Body scale: distance shoulder→hip determines how big to draw character
  let bodyScale = 1;
  if (midShoulder && midHip) {
    const dx = (midShoulder.x - midHip.x) * W;
    const dy = (midShoulder.y - midHip.y) * H;
    bodyScale = Math.sqrt(dx * dx + dy * dy) / 350; // baseline ~350px = scale 1
  }

  // Head: extend nose toward top of head, scale by chibi multiplier
  const headBaseR = 70 * bodyScale;
  const headR = headBaseR * headSize;
  let headCx = px(nose), headCy = py(nose);
  if (nose && midShoulder) {
    const dirX = nose.x - midShoulder.x;
    const dirY = nose.y - midShoulder.y;
    headCx = (nose.x + dirX * 0.4) * W;
    headCy = (nose.y + dirY * 0.4) * H - headBaseR * 0.3 * headSize;
  }

  // Limb tube: filled rounded line
  const Tube = ({ a, b, color, width }: { a: Pt; b: Pt; color: string; width: number }) =>
    a && b && a.v > visMin && b.v > visMin ? (
      <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
        stroke={color} strokeWidth={width} strokeLinecap="round" />
    ) : null;

  // Outline tube (drawn first below the colored fill)
  const TubeOutline = ({ a, b, width }: { a: Pt; b: Pt; width: number }) =>
    a && b && a.v > visMin && b.v > visMin ? (
      <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
        stroke={outlineColor} strokeWidth={width + outlineWidth * 1.5} strokeLinecap="round" />
    ) : null;

  const armWidth = 36 * bodyScale;
  const legWidth = 46 * bodyScale;
  const handR = 26 * bodyScale;
  const footRx = 32 * bodyScale;
  const footRy = 18 * bodyScale;

  // Torso: rounded rect from midShoulder → midHip
  const renderTorso = () => {
    if (!midShoulder || !midHip || !sL || !sR) return null;
    const sx = px(midShoulder), sy = py(midShoulder);
    const hx = px(midHip), hy = py(midHip);
    const torsoLen = Math.hypot(hx - sx, hy - sy);
    const shoulderWidth = Math.abs(px(sL) - px(sR));
    const torsoWidth = Math.max(shoulderWidth * 0.95, 80 * bodyScale);
    const angle = Math.atan2(hy - sy, hx - sx) * 180 / Math.PI - 90;
    const cx = (sx + hx) / 2, cy = (sy + hy) / 2;
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
        <rect x={-torsoWidth / 2 - outlineWidth} y={-torsoLen / 2 - outlineWidth}
          width={torsoWidth + outlineWidth * 2} height={torsoLen + outlineWidth * 2}
          rx={torsoWidth * 0.25} fill={outlineColor} />
        <rect x={-torsoWidth / 2} y={-torsoLen / 2}
          width={torsoWidth} height={torsoLen}
          rx={torsoWidth * 0.22} fill={shirtColor} />
        {/* Shirt button line */}
        <line x1={0} y1={-torsoLen / 2 + 10} x2={0} y2={torsoLen / 2 - 10} stroke={outlineColor} strokeWidth={2.5} opacity={0.55} strokeDasharray="6 4" />
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ position: "absolute", inset: 0 }}>
      {/* Outlines first (back layer) */}
      <TubeOutline a={sL} b={eL} width={armWidth} />
      <TubeOutline a={eL} b={wL} width={armWidth} />
      <TubeOutline a={sR} b={eR} width={armWidth} />
      <TubeOutline a={eR} b={wR} width={armWidth} />
      <TubeOutline a={hL} b={kL} width={legWidth} />
      <TubeOutline a={kL} b={aL} width={legWidth} />
      <TubeOutline a={hR} b={kR} width={legWidth} />
      <TubeOutline a={kR} b={aR} width={legWidth} />

      {renderTorso()}

      {/* Color fills */}
      <Tube a={sL} b={eL} color={shirtColor} width={armWidth} />
      <Tube a={eL} b={wL} color={skinColor} width={armWidth * 0.85} />
      <Tube a={sR} b={eR} color={shirtColor} width={armWidth} />
      <Tube a={eR} b={wR} color={skinColor} width={armWidth * 0.85} />
      <Tube a={hL} b={kL} color={pantsColor} width={legWidth} />
      <Tube a={kL} b={aL} color={pantsColor} width={legWidth * 0.9} />
      <Tube a={hR} b={kR} color={pantsColor} width={legWidth} />
      <Tube a={kR} b={aR} color={pantsColor} width={legWidth * 0.9} />

      {/* Hands */}
      {wL && wL.v > visMin && (
        <circle cx={px(wL)} cy={py(wL)} r={handR} fill={skinColor} stroke={outlineColor} strokeWidth={outlineWidth * 0.6} />
      )}
      {wR && wR.v > visMin && (
        <circle cx={px(wR)} cy={py(wR)} r={handR} fill={skinColor} stroke={outlineColor} strokeWidth={outlineWidth * 0.6} />
      )}
      {/* Feet */}
      {aL && aL.v > visMin && (
        <ellipse cx={px(aL)} cy={py(aL) + footRy * 0.5} rx={footRx} ry={footRy} fill={shoeColor} stroke={outlineColor} strokeWidth={outlineWidth * 0.6} />
      )}
      {aR && aR.v > visMin && (
        <ellipse cx={px(aR)} cy={py(aR) + footRy * 0.5} rx={footRx} ry={footRy} fill={shoeColor} stroke={outlineColor} strokeWidth={outlineWidth * 0.6} />
      )}

      {/* Head with hair + face */}
      {nose && nose.v > visMin && (
        <g>
          {/* Head outline */}
          <circle cx={headCx} cy={headCy} r={headR + outlineWidth} fill={outlineColor} />
          {/* Skin */}
          <circle cx={headCx} cy={headCy} r={headR} fill={skinColor} />
          {/* Hair: simple top dome */}
          <path d={`M ${headCx - headR} ${headCy - headR * 0.15}
                    Q ${headCx - headR} ${headCy - headR * 1.2}
                      ${headCx} ${headCy - headR * 1.05}
                    Q ${headCx + headR * 0.5} ${headCy - headR * 1.05}
                      ${headCx + headR} ${headCy - headR * 0.6}
                    L ${headCx + headR} ${headCy - headR * 0.15}
                    Q ${headCx + headR * 0.6} ${headCy - headR * 0.55}
                      ${headCx} ${headCy - headR * 0.45}
                    Q ${headCx - headR * 0.6} ${headCy - headR * 0.55}
                      ${headCx - headR} ${headCy - headR * 0.15} Z`}
            fill={hairColor} stroke={outlineColor} strokeWidth={outlineWidth * 0.4} />
          {/* Face */}
          {face === "sigma" && <SigmaFace cx={headCx} cy={headCy + headR * 0.05} r={headR} outline={outlineColor} outlineW={outlineWidth * 0.7} />}
          {face === "derp" && <DerpFace cx={headCx} cy={headCy + headR * 0.05} r={headR} outline={outlineColor} outlineW={outlineWidth * 0.7} />}
          {face === "wojak" && <WojakFace cx={headCx} cy={headCy + headR * 0.05} r={headR} outline={outlineColor} outlineW={outlineWidth * 0.7} />}
        </g>
      )}
    </svg>
  );
};
