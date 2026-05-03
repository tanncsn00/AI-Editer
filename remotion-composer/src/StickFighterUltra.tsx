/**
 * StickFighterUltra — full-stack Alan-Becker-meets-VFX:
 *  - SVG stick figure with z-depth-aware bone width (closer = thicker)
 *  - Motion trail (last 6 frames as fading echo)
 *  - Fire palms via R3F overlay on wrists
 *  - Foot impact glow
 *  - Whiteboard/dark scene toggle
 */

import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { OrthographicCamera } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { type Tracking } from "./fx/PoseAttachedFX";
import tracking from "./human_vfx_poc_tracking.json";

const T = tracking as Tracking;

const SCENE: "whiteboard" | "darkArena" | "overlay" = "darkArena";
const TRAIL_FRAMES = 0; // set 4-6 for motion blur effect, 0 = clean

type Pt = { x: number; y: number; z: number; v: number } | null;

const pickAt = (frameIdx: number, name: string): Pt => {
  const fr = T.frames[frameIdx];
  const lm = fr?.landmarks?.find((l: any) => l.name === name);
  if (!lm) return null;
  return { x: lm.x, y: lm.y, z: lm.z, v: lm.visibility ?? 1 };
};

/** z → bone width multiplier: closer (negative z) = thicker. Range 0.5..1.6 */
const zToWidth = (z: number) => {
  const t = Math.max(-0.5, Math.min(0.5, z));
  return 1.6 - (t + 0.5) * 1.1; // -0.5 → 1.6 ; +0.5 → 0.5
};

const StickAtFrame: React.FC<{
  frameIdx: number;
  alpha?: number;
  color?: string;
  baseWidth?: number;
}> = ({ frameIdx, alpha = 1, color = "#1A1820", baseWidth = 18 }) => {
  const W = T.width;
  const H = T.height;
  const visMin = 0.3;

  const get = (n: string) => pickAt(frameIdx, n);
  const nose = get("nose");
  const sL = get("left_shoulder"), sR = get("right_shoulder");
  const eL = get("left_elbow"), eR = get("right_elbow");
  const wL = get("left_wrist"), wR = get("right_wrist");
  const hL = get("left_hip"), hR = get("right_hip");
  const kL = get("left_knee"), kR = get("right_knee");
  const aL = get("left_ankle"), aR = get("right_ankle");

  const px = (p: Pt) => (p ? p.x * W : 0);
  const py = (p: Pt) => (p ? p.y * H : 0);
  const avgZ = (a: Pt, b: Pt) => ((a?.z ?? 0) + (b?.z ?? 0)) / 2;

  const midShoulder: Pt = sL && sR ? { x: (sL.x + sR.x) / 2, y: (sL.y + sR.y) / 2, z: avgZ(sL, sR), v: Math.min(sL.v, sR.v) } : null;
  const midHip: Pt = hL && hR ? { x: (hL.x + hR.x) / 2, y: (hL.y + hR.y) / 2, z: avgZ(hL, hR), v: Math.min(hL.v, hR.v) } : null;
  const headCenter: Pt = nose && midShoulder ? {
    x: nose.x + (nose.x - midShoulder.x) * 0.25,
    y: nose.y + (nose.y - midShoulder.y) * 0.25,
    z: nose.z, v: nose.v,
  } : nose;

  const Bone: React.FC<{ a: Pt; b: Pt }> = ({ a, b }) => {
    if (!a || !b || a.v < visMin || b.v < visMin) return null;
    const w = baseWidth * zToWidth(avgZ(a, b));
    return <line x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={alpha} />;
  };
  const Joint: React.FC<{ p: Pt; r?: number }> = ({ p, r }) =>
    p && p.v > visMin ? <circle cx={px(p)} cy={py(p)} r={(r ?? baseWidth * 0.7) * zToWidth(p.z)} fill={color} opacity={alpha} /> : null;

  const headR = headCenter ? 56 * zToWidth(headCenter.z) : 0;

  return (
    <g>
      <Bone a={midShoulder} b={midHip} />
      <Bone a={sL} b={sR} />
      <Bone a={hL} b={hR} />
      <Bone a={sL} b={eL} /><Bone a={eL} b={wL} />
      <Bone a={sR} b={eR} /><Bone a={eR} b={wR} />
      <Bone a={hL} b={kL} /><Bone a={kL} b={aL} />
      <Bone a={hR} b={kR} /><Bone a={kR} b={aR} />
      <Joint p={wL} /><Joint p={wR} /><Joint p={aL} /><Joint p={aR} />
      {headCenter && headCenter.v > visMin && (
        <circle cx={px(headCenter)} cy={py(headCenter)} r={headR}
          fill="none" stroke={color} strokeWidth={baseWidth * 0.9 * zToWidth(headCenter.z)}
          opacity={alpha} />
      )}
    </g>
  );
};

const StickWithTrail: React.FC<{ color?: string }> = ({ color = "#1A1820" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(T.frames.length - 1, Math.round(t * T.fps));

  const trail = useMemo(() => {
    const out = [];
    for (let k = TRAIL_FRAMES; k > 0; k--) {
      const f = idx - k * 2;
      if (f >= 0) out.push({ idx: f, alpha: 0.08 + (1 - k / TRAIL_FRAMES) * 0.18 });
    }
    return out;
  }, [idx]);

  return (
    <svg viewBox={`0 0 ${T.width} ${T.height}`} width={T.width} height={T.height}
      style={{ position: "absolute", inset: 0 }}>
      {/* Trail (older = fainter) */}
      {trail.map((tr) => (
        <StickAtFrame key={tr.idx} frameIdx={tr.idx} alpha={tr.alpha} color={color} baseWidth={16} />
      ))}
      {/* Current frame, full opacity */}
      <StickAtFrame frameIdx={idx} alpha={1} color={color} baseWidth={20} />
    </svg>
  );
};

const FXLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(T.frames.length - 1, Math.round(t * T.fps));
  const f = T.frames[idx];
  if (!f?.landmarks?.length) return null;

  const W = T.width, H = T.height;
  const toWorld = (x: number, y: number): [number, number, number] => [(x - 0.5) * W, -(y - 0.5) * H, 0];
  const get = (n: string) => f.landmarks.find((l: any) => l.name === n);

  const wL = get("left_wrist"), wR = get("right_wrist");
  const aL = get("left_ankle"), aR = get("right_ankle");

  const flicker = 1 + Math.sin(frame * 0.7) * 0.18 + Math.sin(frame * 0.31) * 0.1;
  const orbit = frame * 0.12;

  const FirePalm = ({ pos, hue, core }: any) => (
    <group position={pos}>
      <mesh><sphereGeometry args={[140 * flicker, 24, 24]} /><meshBasicMaterial color={hue} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh><sphereGeometry args={[85 * flicker, 24, 24]} /><meshBasicMaterial color={hue} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <mesh><sphereGeometry args={[42 * flicker, 20, 20]} /><meshBasicMaterial color={core} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {[0,1,2,3,4,5].map((i) => {
        const a = orbit + (i / 6) * Math.PI * 2;
        const r = 100 + Math.sin(frame * 0.3 + i) * 22;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]}>
            <sphereGeometry args={[12, 8, 8]} />
            <meshBasicMaterial color="#FFE066" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );

  const FootGlow = ({ pos }: any) => (
    <mesh position={pos}>
      <sphereGeometry args={[60, 18, 18]} />
      <meshBasicMaterial color="#9DD7FF" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );

  return (
    <>
      {wL && wL.visibility > 0.4 && <FirePalm pos={toWorld(wL.x, wL.y)} hue="#FF6A1A" core="#FFD06A" />}
      {wR && wR.visibility > 0.4 && <FirePalm pos={toWorld(wR.x, wR.y)} hue="#FF3D0A" core="#FFC04A" />}
      {aL && aL.visibility > 0.4 && <FootGlow pos={toWorld(aL.x, aL.y)} />}
      {aR && aR.visibility > 0.4 && <FootGlow pos={toWorld(aR.x, aR.y)} />}
    </>
  );
};

export const StickFighterUltra: React.FC = () => {
  const bg = SCENE === "darkArena" ? "#0E0E14" : SCENE === "whiteboard" ? "#F5F0E0" : "#000";
  const stickColor = SCENE === "darkArena" ? "#F5F0E0" : SCENE === "whiteboard" ? "#1A1820" : "#FF3D0A";

  return (
    <AbsoluteFill style={{ background: bg }}>
      {SCENE === "overlay" && <OffthreadVideo src={staticFile("human_vfx_poc/source.mp4")} muted />}
      {SCENE === "darkArena" && (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="vig" cx="50%" cy="55%" r="65%">
              <stop offset="0%" stopColor="#1B1F2A" stopOpacity="1" />
              <stop offset="100%" stopColor="#0A0A12" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#vig)" />
        </svg>
      )}
      {SCENE === "whiteboard" && (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1A1820" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      )}

      <StickWithTrail color={stickColor} />

      <ThreeCanvas
        width={T.width} height={T.height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        gl={{ alpha: true }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={1}
          left={-T.width / 2} right={T.width / 2} top={T.height / 2} bottom={-T.height / 2}
          near={0.1} far={1000} />
        <ambientLight intensity={1} />
        <FXLayer />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
