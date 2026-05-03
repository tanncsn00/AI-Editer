/**
 * IsseiMascotFromPose — cartoon dancer in Issei style:
 *  - Bowl-cut black hair with thick bangs over forehead/eyebrows
 *  - Oversized black football-style jersey with red/yellow #11 graphic
 *  - Baggy gray cargo pants
 *  - White sneakers
 *  - Pale skin, slim Asian features
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Tracking } from "./PoseAttachedFX";

type Pt = { x: number; y: number; z: number; v: number } | null;

const pickAt = (frameLandmarks: any[], name: string): Pt => {
  const lm = frameLandmarks?.find?.((l: any) => l.name === name);
  if (!lm) return null;
  return { x: lm.x, y: lm.y, z: lm.z, v: lm.visibility ?? 1 };
};

const SKIN = "#F8DAB8";
const HAIR = "#1A1208";
const JERSEY = "#0F0F14";
const JERSEY_RED = "#D11B2C";
const JERSEY_YELLOW = "#FFC72C";
const JERSEY_NUM = "#FFFFFF";
const PANTS = "#3A3A40";
const PANTS_DARK = "#2A2A30";
const SHOE = "#F5F5F2";
const SHOE_SOLE = "#1A1A20";
const OUTLINE = "#0A0612";

export const IsseiMascotFromPose: React.FC<{
  tracking: Tracking;
}> = ({ tracking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(tracking.frames.length - 1, Math.round(t * tracking.fps));
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

  const headBaseR = 70 * bodyScale * 1.25;
  let headCx = px(nose), headCy = py(nose);
  if (nose && midShoulder) {
    const dirX = nose.x - midShoulder.x;
    const dirY = nose.y - midShoulder.y;
    headCx = (nose.x + dirX * 0.30) * W;
    headCy = (nose.y + dirY * 0.30) * H - headBaseR * 0.20;
  }

  const armWidth = 56 * bodyScale; // jersey: oversized shoulders
  const forearmWidth = 36 * bodyScale; // bare forearm (short sleeves)
  const legWidth = 60 * bodyScale; // baggy cargo
  const lowerLegWidth = 54 * bodyScale;
  const handR = 22 * bodyScale;
  const footRx = 36 * bodyScale;
  const footRy = 18 * bodyScale;
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

  // Jersey torso: oversized rounded rect with red/yellow graphic and big white #11
  const renderJerseyTorso = () => {
    if (!midShoulder || !midHip || !sL || !sR) return null;
    const sx = px(midShoulder), sy = py(midShoulder);
    const hx = px(midHip), hy = py(midHip);
    const torsoLen = Math.hypot(hx - sx, hy - sy);
    const shoulderWidth = Math.abs(px(sL) - px(sR));
    const torsoWidth = Math.max(shoulderWidth * 1.45, 130 * bodyScale); // oversized
    const angle = Math.atan2(hy - sy, hx - sx) * 180 / Math.PI - 90;
    const cx = (sx + hx) / 2, cy = (sy + hy) / 2;
    const rx = torsoWidth * 0.10;
    return (
      <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
        {/* Outline */}
        <rect x={-torsoWidth / 2 - outlineW} y={-torsoLen / 2 - outlineW}
          width={torsoWidth + outlineW * 2} height={torsoLen * 1.10 + outlineW * 2}
          rx={rx} fill={OUTLINE} />
        {/* Jersey body */}
        <rect x={-torsoWidth / 2} y={-torsoLen / 2}
          width={torsoWidth} height={torsoLen * 1.10}
          rx={rx} fill={JERSEY} />
        {/* Collar V-neck */}
        <path d={`M ${-torsoWidth * 0.18} ${-torsoLen / 2}
                  L 0 ${-torsoLen / 2 + 38}
                  L ${torsoWidth * 0.18} ${-torsoLen / 2}`}
          fill={SKIN} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
        {/* Collar trim */}
        <path d={`M ${-torsoWidth * 0.22} ${-torsoLen / 2 + 4}
                  L 0 ${-torsoLen / 2 + 44}
                  L ${torsoWidth * 0.22} ${-torsoLen / 2 + 4}`}
          fill="none" stroke={JERSEY_YELLOW} strokeWidth={4} strokeLinejoin="round" />
        {/* Red diagonal stripe accent */}
        <path d={`M ${-torsoWidth * 0.45} ${-torsoLen * 0.10}
                  L ${torsoWidth * 0.45} ${torsoLen * 0.10}`}
          stroke={JERSEY_RED} strokeWidth={18} opacity={0.85} />
        {/* Big yellow shoulder block */}
        <path d={`M ${-torsoWidth * 0.48} ${-torsoLen / 2 + 18}
                  L ${-torsoWidth * 0.20} ${-torsoLen / 2 + 8}
                  L ${-torsoWidth * 0.18} ${-torsoLen / 2 + 70}
                  L ${-torsoWidth * 0.48} ${-torsoLen / 2 + 80} Z`}
          fill={JERSEY_YELLOW} opacity={0.9} stroke={OUTLINE} strokeWidth={outlineW * 0.4} />
        {/* Big white number "11" */}
        <text x={0} y={torsoLen * 0.22} textAnchor="middle"
          fontSize={torsoLen * 0.42} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="900"
          fill={JERSEY_NUM} stroke={OUTLINE} strokeWidth={3}>
          11
        </text>
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ position: "absolute", inset: 0 }}>
      {/* Limb outlines back layer */}
      <TubeOutline a={sL} b={eL} width={armWidth} />
      <TubeOutline a={eL} b={wL} width={forearmWidth} />
      <TubeOutline a={sR} b={eR} width={armWidth} />
      <TubeOutline a={eR} b={wR} width={forearmWidth} />
      <TubeOutline a={hL} b={kL} width={legWidth} />
      <TubeOutline a={kL} b={aL} width={lowerLegWidth} />
      <TubeOutline a={hR} b={kR} width={legWidth} />
      <TubeOutline a={kR} b={aR} width={lowerLegWidth} />

      {renderJerseyTorso()}

      {/* Jersey upper sleeves (short, dark) */}
      <Tube a={sL} b={eL} color={JERSEY} width={armWidth} />
      <Tube a={sR} b={eR} color={JERSEY} width={armWidth} />
      {/* Bare skin forearms */}
      <Tube a={eL} b={wL} color={SKIN} width={forearmWidth} />
      <Tube a={eR} b={wR} color={SKIN} width={forearmWidth} />
      {/* Cargo pants — baggy */}
      <Tube a={hL} b={kL} color={PANTS} width={legWidth} />
      <Tube a={kL} b={aL} color={PANTS_DARK} width={lowerLegWidth} />
      <Tube a={hR} b={kR} color={PANTS} width={legWidth} />
      <Tube a={kR} b={aR} color={PANTS_DARK} width={lowerLegWidth} />

      {/* Hands */}
      {wL && wL.v > visMin && (
        <circle cx={px(wL)} cy={py(wL)} r={handR} fill={SKIN} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}
      {wR && wR.v > visMin && (
        <circle cx={px(wR)} cy={py(wR)} r={handR} fill={SKIN} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
      )}

      {/* White sneakers with dark sole */}
      {aL && aL.v > visMin && (
        <g>
          <ellipse cx={px(aL)} cy={py(aL) + footRy * 0.5} rx={footRx} ry={footRy} fill={SHOE} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
          <ellipse cx={px(aL)} cy={py(aL) + footRy * 0.95} rx={footRx * 0.95} ry={footRy * 0.35} fill={SHOE_SOLE} />
        </g>
      )}
      {aR && aR.v > visMin && (
        <g>
          <ellipse cx={px(aR)} cy={py(aR) + footRy * 0.5} rx={footRx} ry={footRy} fill={SHOE} stroke={OUTLINE} strokeWidth={outlineW * 0.6} />
          <ellipse cx={px(aR)} cy={py(aR) + footRy * 0.95} rx={footRx * 0.95} ry={footRy * 0.35} fill={SHOE_SOLE} />
        </g>
      )}

      {/* Head + face */}
      {nose && nose.v > visMin && (
        <g>
          {/* Outline */}
          <circle cx={headCx} cy={headCy} r={headBaseR + outlineW} fill={OUTLINE} />
          {/* Skin */}
          <circle cx={headCx} cy={headCy} r={headBaseR} fill={SKIN} />

          {/* Bowl cut hair — covers top + sides + bangs to brow */}
          <path d={`M ${headCx - headBaseR * 1.05} ${headCy + headBaseR * 0.10}
                    L ${headCx - headBaseR * 1.02} ${headCy - headBaseR * 0.30}
                    Q ${headCx - headBaseR * 0.95} ${headCy - headBaseR * 1.05}
                      ${headCx} ${headCy - headBaseR * 1.10}
                    Q ${headCx + headBaseR * 0.95} ${headCy - headBaseR * 1.05}
                      ${headCx + headBaseR * 1.02} ${headCy - headBaseR * 0.30}
                    L ${headCx + headBaseR * 1.05} ${headCy + headBaseR * 0.10}
                    L ${headCx + headBaseR * 0.85} ${headCy + headBaseR * 0.05}
                    Q ${headCx + headBaseR * 0.55} ${headCy - headBaseR * 0.10}
                      ${headCx + headBaseR * 0.10} ${headCy + headBaseR * 0.05}
                    Q ${headCx - headBaseR * 0.55} ${headCy - headBaseR * 0.10}
                      ${headCx - headBaseR * 0.85} ${headCy + headBaseR * 0.05} Z`}
            fill={HAIR} stroke={OUTLINE} strokeWidth={outlineW * 0.5} />
          {/* Bangs hairline strands across forehead */}
          {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((d, i) => (
            <line key={i}
              x1={headCx + headBaseR * d}
              y1={headCy - headBaseR * 0.35}
              x2={headCx + headBaseR * (d + 0.06)}
              y2={headCy + headBaseR * 0.02}
              stroke={HAIR} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          ))}

          {/* Eyes (slim, peeking under bangs) */}
          <ellipse cx={headCx - headBaseR * 0.34} cy={headCy + headBaseR * 0.10}
            rx={headBaseR * 0.13} ry={headBaseR * 0.05} fill={OUTLINE} />
          <ellipse cx={headCx + headBaseR * 0.34} cy={headCy + headBaseR * 0.10}
            rx={headBaseR * 0.13} ry={headBaseR * 0.05} fill={OUTLINE} />

          {/* Nose tiny */}
          <path d={`M ${headCx - headBaseR * 0.05} ${headCy + headBaseR * 0.32}
                    Q ${headCx} ${headCy + headBaseR * 0.40}
                      ${headCx + headBaseR * 0.05} ${headCy + headBaseR * 0.32}`}
            stroke={OUTLINE} strokeWidth={outlineW * 0.5} fill="none" strokeLinecap="round" />

          {/* Mouth — neutral cool */}
          <line x1={headCx - headBaseR * 0.14} y1={headCy + headBaseR * 0.58}
            x2={headCx + headBaseR * 0.14} y2={headCy + headBaseR * 0.58}
            stroke={OUTLINE} strokeWidth={outlineW * 0.7} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
