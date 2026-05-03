/**
 * JustinMascotFromPose — Bieber-coded cartoon singer (signifiers, not photoreal):
 *  - buzz-cut short hair
 *  - earring + nose ring
 *  - oversized red/pink hoodie
 *  - in-ear monitor white cable
 *  - mic in right hand
 *  - face: chill smug
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Tracking } from "./PoseAttachedFX";

type Pt = { x: number; y: number; z: number; v: number } | null;

const pickAt = (frameLandmarks: any[], name: string): Pt => {
  const lm = frameLandmarks?.find?.((l: any) => l.name === name);
  if (!lm) return null;
  return { x: lm.x, y: lm.y, z: lm.z, v: lm.visibility ?? 1 };
};

const SKIN = "#F5C9A8";
const HAIR = "#3A2A1E";
const HOODIE = "#D94872";
const HOODIE_DARK = "#A52F54";
const PANTS = "#1C1C24";
const SHOE = "#0A0A12";
const OUTLINE = "#0A0612";
const EAR_GOLD = "#FFD400";
const RING_SILVER = "#C8C8D0";
const MIC = "#0A0A12";
const MIC_HEAD = "#3A3A48";

export const JustinMascotFromPose: React.FC<{
  tracking: Tracking;
  showMic?: boolean;
}> = ({ tracking, showMic = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(tracking.frames.length - 1, Math.round(t * tracking.fps));
  // Fallback: hold last detected pose if current frame has no landmarks (up to 30 frames lookback ≈ 1s)
  let f = tracking.frames[idx];
  if (!f?.landmarks?.length) {
    for (let k = 1; k <= 30; k++) {
      const pf = tracking.frames[idx - k];
      if (pf?.landmarks?.length) { f = pf; break; }
    }
  }
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
  const earL = get("left_ear");

  const px = (p: Pt) => (p ? p.x * W : 0);
  const py = (p: Pt) => (p ? p.y * H : 0);

  const midShoulder: Pt = sL && sR ? { x: (sL.x + sR.x) / 2, y: (sL.y + sR.y) / 2, z: 0, v: Math.min(sL.v, sR.v) } : null;
  const midHip: Pt = hL && hR ? { x: (hL.x + hR.x) / 2, y: (hL.y + hR.y) / 2, z: 0, v: Math.min(hL.v, hR.v) } : null;

  let bodyScale = 1;
  if (midShoulder && midHip) {
    const dx = (midShoulder.x - midHip.x) * W;
    const dy = (midShoulder.y - midHip.y) * H;
    bodyScale = Math.sqrt(dx * dx + dy * dy) / 350;
  }
  bodyScale = Math.max(0.4, Math.min(2.5, bodyScale));

  const headBaseR = 70 * bodyScale * 1.3;
  let headCx = px(nose), headCy = py(nose);
  if (nose && midShoulder) {
    const dirX = nose.x - midShoulder.x;
    const dirY = nose.y - midShoulder.y;
    headCx = (nose.x + dirX * 0.35) * W;
    headCy = (nose.y + dirY * 0.35) * H - headBaseR * 0.25;
  }

  const armWidth = 52 * bodyScale; // hoodie sleeves wide
  const legWidth = 40 * bodyScale;
  const handR = 22 * bodyScale;
  const footRx = 28 * bodyScale;
  const footRy = 16 * bodyScale;
  const outlineW = 5;

  const Tube = ({ a, b, color, width }: { a: Pt; b: Pt; color: string; width: number }) =>
    a && b && a.v > visMin && b.v > visMin ? (
      <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
        stroke={color} strokeWidth={width} strokeLinecap="round" />
    ) : null;

  const TubeOutline = ({ a, b, width }: { a: Pt; b: Pt; width: number }) =>
    a && b && a.v > visMin && b.v > visMin ? (
      <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)}
        stroke={OUTLINE} strokeWidth={width + outlineW * 1.5} strokeLinecap="round" />
    ) : null;

  // Hoodie torso: rounded rect from midShoulder → midHip + extended hood drop
  const renderHoodieTorso = () => {
    if (!midShoulder || !midHip || !sL || !sR) return null;
    const sx = px(midShoulder), sy = py(midShoulder);
    const hx = px(midHip), hy = py(midHip);
    const torsoLen = Math.hypot(hx - sx, hy - sy);
    const shoulderWidth = Math.abs(px(sL) - px(sR));
    const torsoWidth = Math.max(shoulderWidth * 1.25, 100 * bodyScale); // oversized
    const angle = Math.atan2(hy - sy, hx - sx) * 180 / Math.PI - 90;
    const cx = (sx + hx) / 2, cy = (sy + hy) / 2;
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
        {/* Outline */}
        <rect x={-torsoWidth / 2 - outlineW} y={-torsoLen / 2 - outlineW}
          width={torsoWidth + outlineW * 2} height={torsoLen + outlineW * 2}
          rx={torsoWidth * 0.18} fill={OUTLINE} />
        {/* Hoodie body */}
        <rect x={-torsoWidth / 2} y={-torsoLen / 2}
          width={torsoWidth} height={torsoLen}
          rx={torsoWidth * 0.16} fill={HOODIE} />
        {/* Hood drop down back/front */}
        <ellipse cx={0} cy={-torsoLen / 2 + 10} rx={torsoWidth * 0.45} ry={torsoLen * 0.18}
          fill={HOODIE_DARK} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
        {/* Drawstrings */}
        <line x1={-torsoWidth * 0.08} y1={-torsoLen / 2 + 18} x2={-torsoWidth * 0.06} y2={-torsoLen / 2 + 60}
          stroke={OUTLINE} strokeWidth={3} />
        <line x1={torsoWidth * 0.08} y1={-torsoLen / 2 + 18} x2={torsoWidth * 0.06} y2={-torsoLen / 2 + 60}
          stroke={OUTLINE} strokeWidth={3} />
        <circle cx={-torsoWidth * 0.06} cy={-torsoLen / 2 + 62} r={4} fill={OUTLINE} />
        <circle cx={torsoWidth * 0.06} cy={-torsoLen / 2 + 62} r={4} fill={OUTLINE} />
        {/* Hoodie pocket front */}
        <path d={`M ${-torsoWidth * 0.32} ${torsoLen * 0.05}
                  L ${torsoWidth * 0.32} ${torsoLen * 0.05}
                  L ${torsoWidth * 0.25} ${torsoLen * 0.30}
                  L ${-torsoWidth * 0.25} ${torsoLen * 0.30} Z`}
          fill={HOODIE_DARK} stroke={OUTLINE} strokeWidth={outlineW * 0.5} />
      </g>
    );
  };

  // Mic in right wrist (or visible wrist with arm extended toward face)
  const renderMic = () => {
    if (!showMic) return null;
    const wristNearMouth = wR && wR.v > visMin ? wR :
                           (wL && wL.v > visMin ? wL : null);
    if (!wristNearMouth) return null;
    const x = px(wristNearMouth);
    const y = py(wristNearMouth);
    const s = bodyScale;
    return (
      <g transform={`translate(${x}, ${y - 18 * s})`}>
        {/* mic head */}
        <ellipse cx={0} cy={-32 * s} rx={20 * s} ry={26 * s} fill={MIC_HEAD} stroke={OUTLINE} strokeWidth={outlineW * 0.5} />
        {/* grille mesh dots */}
        {[-8, 0, 8].map((dx) => [-22, -14, -6, 2, 10, -38].map((dy) =>
          <circle key={`${dx}-${dy}`} cx={dx * s * 0.6} cy={(dy - 8) * s} r={1.5 * s} fill="#0F1018" opacity={0.7} />
        ))}
        {/* handle */}
        <rect x={-7 * s} y={-12 * s} width={14 * s} height={50 * s} rx={5 * s} fill={MIC} stroke={OUTLINE} strokeWidth={outlineW * 0.5} />
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ position: "absolute", inset: 0 }}>
      {/* Limb outlines back layer */}
      <TubeOutline a={sL} b={eL} width={armWidth} />
      <TubeOutline a={eL} b={wL} width={armWidth * 0.8} />
      <TubeOutline a={sR} b={eR} width={armWidth} />
      <TubeOutline a={eR} b={wR} width={armWidth * 0.8} />
      <TubeOutline a={hL} b={kL} width={legWidth} />
      <TubeOutline a={kL} b={aL} width={legWidth * 0.95} />
      <TubeOutline a={hR} b={kR} width={legWidth} />
      <TubeOutline a={kR} b={aR} width={legWidth * 0.95} />

      {renderHoodieTorso()}

      {/* Hoodie sleeves (full arm covered) */}
      <Tube a={sL} b={eL} color={HOODIE} width={armWidth} />
      <Tube a={eL} b={wL} color={HOODIE} width={armWidth * 0.8} />
      <Tube a={sR} b={eR} color={HOODIE} width={armWidth} />
      <Tube a={eR} b={wR} color={HOODIE} width={armWidth * 0.8} />
      {/* Pants */}
      <Tube a={hL} b={kL} color={PANTS} width={legWidth} />
      <Tube a={kL} b={aL} color={PANTS} width={legWidth * 0.95} />
      <Tube a={hR} b={kR} color={PANTS} width={legWidth} />
      <Tube a={kR} b={aR} color={PANTS} width={legWidth * 0.95} />

      {/* Hands (skin emerging from sleeve cuff) */}
      {wL && wL.v > visMin && (
        <circle cx={px(wL)} cy={py(wL)} r={handR} fill={SKIN} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}
      {wR && wR.v > visMin && (
        <circle cx={px(wR)} cy={py(wR)} r={handR} fill={SKIN} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}

      {/* Feet */}
      {aL && aL.v > visMin && (
        <ellipse cx={px(aL)} cy={py(aL) + footRy * 0.5} rx={footRx} ry={footRy} fill={SHOE} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}
      {aR && aR.v > visMin && (
        <ellipse cx={px(aR)} cy={py(aR) + footRy * 0.5} rx={footRx} ry={footRy} fill={SHOE} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}

      {/* Head + face */}
      {nose && nose.v > visMin && (
        <g>
          {/* Outline */}
          <circle cx={headCx} cy={headCy} r={headBaseR + outlineW} fill={OUTLINE} />
          {/* Skin */}
          <circle cx={headCx} cy={headCy} r={headBaseR} fill={SKIN} />
          {/* Buzz cut hair: thin band on top half */}
          <path d={`M ${headCx - headBaseR * 0.95} ${headCy - headBaseR * 0.05}
                    Q ${headCx - headBaseR * 0.55} ${headCy - headBaseR * 1.02}
                      ${headCx} ${headCy - headBaseR * 0.95}
                    Q ${headCx + headBaseR * 0.55} ${headCy - headBaseR * 1.02}
                      ${headCx + headBaseR * 0.95} ${headCy - headBaseR * 0.05}
                    Q ${headCx + headBaseR * 0.55} ${headCy - headBaseR * 0.30}
                      ${headCx} ${headCy - headBaseR * 0.40}
                    Q ${headCx - headBaseR * 0.55} ${headCy - headBaseR * 0.30}
                      ${headCx - headBaseR * 0.95} ${headCy - headBaseR * 0.05} Z`}
            fill={HAIR} stroke={OUTLINE} strokeWidth={outlineW * 0.4} />
          {/* Hairline shadow stubble */}
          <path d={`M ${headCx - headBaseR * 0.85} ${headCy + headBaseR * 0.05}
                    Q ${headCx} ${headCy + headBaseR * 0.20}
                      ${headCx + headBaseR * 0.85} ${headCy + headBaseR * 0.05}`}
            stroke={HAIR} strokeWidth={2.5} fill="none" opacity={0.3} strokeDasharray="3 3" />

          {/* Eyebrows */}
          <path d={`M ${headCx - headBaseR * 0.55} ${headCy - headBaseR * 0.18}
                    Q ${headCx - headBaseR * 0.38} ${headCy - headBaseR * 0.25}
                      ${headCx - headBaseR * 0.20} ${headCy - headBaseR * 0.18}`}
            stroke={OUTLINE} strokeWidth={outlineW * 0.7} fill="none" strokeLinecap="round" />
          <path d={`M ${headCx + headBaseR * 0.20} ${headCy - headBaseR * 0.18}
                    Q ${headCx + headBaseR * 0.38} ${headCy - headBaseR * 0.25}
                      ${headCx + headBaseR * 0.55} ${headCy - headBaseR * 0.18}`}
            stroke={OUTLINE} strokeWidth={outlineW * 0.7} fill="none" strokeLinecap="round" />

          {/* Eyes (chill half-lid) */}
          <ellipse cx={headCx - headBaseR * 0.36} cy={headCy - headBaseR * 0.05} rx={headBaseR * 0.13} ry={headBaseR * 0.06} fill={OUTLINE} />
          <ellipse cx={headCx + headBaseR * 0.36} cy={headCy - headBaseR * 0.05} rx={headBaseR * 0.13} ry={headBaseR * 0.06} fill={OUTLINE} />

          {/* Nose with nose ring */}
          <path d={`M ${headCx - headBaseR * 0.06} ${headCy + headBaseR * 0.18}
                    Q ${headCx} ${headCy + headBaseR * 0.30}
                      ${headCx + headBaseR * 0.06} ${headCy + headBaseR * 0.18}`}
            stroke={OUTLINE} strokeWidth={outlineW * 0.6} fill="none" strokeLinecap="round" />
          {/* Septum nose ring */}
          <ellipse cx={headCx} cy={headCy + headBaseR * 0.32} rx={headBaseR * 0.07} ry={headBaseR * 0.04}
            fill="none" stroke={RING_SILVER} strokeWidth={2.5} />

          {/* Mouth — slight smile / open singing */}
          <ellipse cx={headCx} cy={headCy + headBaseR * 0.50} rx={headBaseR * 0.18} ry={headBaseR * 0.10}
            fill="#5C1A1A" stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
          {/* Teeth hint */}
          <line x1={headCx - headBaseR * 0.12} y1={headCy + headBaseR * 0.45} x2={headCx + headBaseR * 0.12} y2={headCy + headBaseR * 0.45}
            stroke="#FFFFFF" strokeWidth={3} />

          {/* Earring + in-ear monitor */}
          <circle cx={headCx + headBaseR * 0.92} cy={headCy + headBaseR * 0.15} r={headBaseR * 0.07} fill={EAR_GOLD} stroke={OUTLINE} strokeWidth={2} />
          {/* In-ear monitor cable hanging */}
          <path d={`M ${headCx + headBaseR * 0.95} ${headCy + headBaseR * 0.18}
                    Q ${headCx + headBaseR * 1.10} ${headCy + headBaseR * 0.55}
                      ${headCx + headBaseR * 0.85} ${headCy + headBaseR * 0.95}`}
            stroke="#FFFFFF" strokeWidth={2.5} fill="none" />
        </g>
      )}

      {renderMic()}
    </svg>
  );
};
