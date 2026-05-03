/**
 * IsseiDanceProcedural — Soldier driven by hand-authored joint positions per
 * keyframe (world space). Uses the same aim-bone retargeting as the SMPL path
 * — easier to author than Euler angles, works with any Mixamo rig.
 *
 * Coordinate convention (in world space, character origin at hips):
 *   x: subject's right (positive)
 *   y: up (positive)
 *   z: forward toward camera (positive)
 *
 * Hip is roughly at y=0.95m. Shoulder at y=1.45m. Wrist rest at y=1.0m, x=±0.55m.
 */

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GlbAimedPolished } from "./fx/GlbAimedPolished";

const W = 1080;
const H = 1920;
const FPS = 30;
const FRAMES = 427;

// SMPL joint name set we drive (subset)
type Joint = { name: string; x: number; y: number; z: number };
type KeyPose = { frame: number; joints: Record<string, [number, number, number]> };

// Helper builders for poses (world-space target positions in meters)
const idle = (): KeyPose["joints"] => ({
  // Pelvis-relative anchor coords (character hip at world ~y=0.95)
  pelvis: [0, 0.95, 0],
  spine1: [0, 1.05, 0],
  spine2: [0, 1.20, 0],
  spine3: [0, 1.35, 0],
  neck: [0, 1.45, 0],
  head: [0, 1.65, 0],
  left_hip: [-0.10, 0.95, 0],
  right_hip: [0.10, 0.95, 0],
  left_shoulder: [-0.20, 1.50, 0],
  right_shoulder: [0.20, 1.50, 0],
  left_elbow: [-0.45, 1.10, 0],
  right_elbow: [0.45, 1.10, 0],
  left_wrist: [-0.55, 0.75, 0],
  right_wrist: [0.55, 0.75, 0],
  left_knee: [-0.10, 0.50, 0],
  right_knee: [0.10, 0.50, 0],
  left_ankle: [-0.10, 0.05, 0],
  right_ankle: [0.10, 0.05, 0],
  left_foot: [-0.10, 0.0, 0.10],
  right_foot: [0.10, 0.0, 0.10],
});

// Pose generators — apply changes on top of idle
const armsUpY = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.40, 1.85, 0],
  right_elbow: [0.40, 1.85, 0],
  left_wrist: [-0.55, 2.20, 0],
  right_wrist: [0.55, 2.20, 0],
  spine1: [0, 1.06, -0.02],
  neck: [0, 1.47, -0.02],
  head: [0, 1.68, -0.02],
});

const handsHips = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.42, 1.05, 0.05],
  right_elbow: [0.42, 1.05, 0.05],
  left_wrist: [-0.18, 0.95, 0.10],
  right_wrist: [0.18, 0.95, 0.10],
});

const armsWide = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.55, 1.50, 0],
  right_elbow: [0.55, 1.50, 0],
  left_wrist: [-0.95, 1.50, 0],
  right_wrist: [0.95, 1.50, 0],
});

const pointForwardR = (): KeyPose["joints"] => ({
  ...idle(),
  right_elbow: [0.20, 1.45, 0.30],
  right_wrist: [0.20, 1.45, 0.70],
  left_elbow: [-0.42, 1.10, -0.10],
  left_wrist: [-0.20, 0.95, -0.10],
  spine1: [0.05, 1.05, 0],
  neck: [0.05, 1.45, 0],
  head: [0.05, 1.65, 0.05],
});

const pointForwardL = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.20, 1.45, 0.30],
  left_wrist: [-0.20, 1.45, 0.70],
  right_elbow: [0.42, 1.10, -0.10],
  right_wrist: [0.20, 0.95, -0.10],
  spine1: [-0.05, 1.05, 0],
  neck: [-0.05, 1.45, 0],
  head: [-0.05, 1.65, 0.05],
});

const squatLow = (): KeyPose["joints"] => ({
  ...idle(),
  pelvis: [0, 0.55, 0],
  spine1: [0, 0.65, 0.02],
  spine2: [0, 0.80, 0.04],
  spine3: [0, 0.95, 0.05],
  neck: [0, 1.05, 0.06],
  head: [0, 1.25, 0.06],
  left_hip: [-0.12, 0.55, 0],
  right_hip: [0.12, 0.55, 0],
  left_knee: [-0.18, 0.30, 0.20],
  right_knee: [0.18, 0.30, 0.20],
  left_ankle: [-0.10, 0.05, 0.05],
  right_ankle: [0.10, 0.05, 0.05],
  left_shoulder: [-0.20, 1.10, 0.05],
  right_shoulder: [0.20, 1.10, 0.05],
  left_elbow: [-0.40, 0.95, 0.20],
  right_elbow: [0.40, 0.95, 0.20],
  left_wrist: [-0.50, 0.85, 0.45],
  right_wrist: [0.50, 0.85, 0.45],
});

const jumpHigh = (): KeyPose["joints"] => {
  const j = idle();
  // Jump: lift everything up and slight tuck
  const up = 0.35;
  Object.keys(j).forEach((k) => { j[k][1] += up; });
  j.left_knee[1] -= 0.10;
  j.right_knee[1] -= 0.10;
  j.left_knee[2] = 0.10;
  j.right_knee[2] = 0.10;
  j.left_ankle[1] -= 0.15;
  j.right_ankle[1] -= 0.15;
  j.left_ankle[2] = 0.10;
  j.right_ankle[2] = 0.10;
  j.left_elbow = [-0.40, j.left_shoulder[1] + 0.30, 0];
  j.right_elbow = [0.40, j.right_shoulder[1] + 0.30, 0];
  j.left_wrist = [-0.55, j.left_shoulder[1] + 0.65, 0];
  j.right_wrist = [0.55, j.right_shoulder[1] + 0.65, 0];
  return j;
};

const waveR = (): KeyPose["joints"] => ({
  ...idle(),
  right_elbow: [0.55, 1.65, 0],
  right_wrist: [0.65, 2.10, 0.05],
  left_elbow: [-0.42, 1.10, 0],
  left_wrist: [-0.30, 0.85, 0.05],
});

const waveL = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.55, 1.65, 0],
  left_wrist: [-0.65, 2.10, 0.05],
  right_elbow: [0.42, 1.10, 0],
  right_wrist: [0.30, 0.85, 0.05],
});

const cross = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [0.05, 1.30, 0.20],
  left_wrist: [0.30, 1.20, 0.25],
  right_elbow: [-0.05, 1.30, 0.20],
  right_wrist: [-0.30, 1.20, 0.25],
});

const finalPose = (): KeyPose["joints"] => ({
  ...idle(),
  left_elbow: [-0.55, 1.55, 0],
  right_elbow: [0.55, 1.55, 0],
  left_wrist: [-0.85, 1.80, 0],
  right_wrist: [0.85, 1.80, 0],
  head: [0, 1.70, -0.05],
});

const KEYPOSES: KeyPose[] = [
  { frame: 0,   joints: idle() },
  { frame: 25,  joints: armsUpY() },
  { frame: 60,  joints: handsHips() },
  { frame: 95,  joints: pointForwardR() },
  { frame: 130, joints: pointForwardL() },
  { frame: 165, joints: armsWide() },
  { frame: 200, joints: jumpHigh() },
  { frame: 235, joints: squatLow() },
  { frame: 270, joints: waveR() },
  { frame: 305, joints: waveL() },
  { frame: 340, joints: cross() },
  { frame: 375, joints: armsUpY() },
  { frame: 410, joints: finalPose() },
  { frame: 426, joints: idle() },
];

// Build the polished JSON shape that GlbAimedPolished consumes
// (world_landmarks per frame + identity root_quat + zero transl).
const buildMotionJSON = () => {
  const frames: any[] = [];
  for (let f = 0; f < FRAMES; f++) {
    // Find surrounding keyposes
    let kA = KEYPOSES[0], kB = KEYPOSES[0];
    for (let i = 0; i < KEYPOSES.length - 1; i++) {
      if (f >= KEYPOSES[i].frame && f <= KEYPOSES[i + 1].frame) {
        kA = KEYPOSES[i];
        kB = KEYPOSES[i + 1];
        break;
      }
    }
    if (f >= KEYPOSES[KEYPOSES.length - 1].frame) kA = kB = KEYPOSES[KEYPOSES.length - 1];
    const span = Math.max(1, kB.frame - kA.frame);
    let t = (f - kA.frame) / span;
    t = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));
    const wls: Joint[] = [];
    const allNames = new Set([...Object.keys(kA.joints), ...Object.keys(kB.joints)]);
    allNames.forEach((name) => {
      const a = kA.joints[name] || kB.joints[name];
      const b = kB.joints[name] || kA.joints[name];
      const x = a[0] + (b[0] - a[0]) * t;
      const y = a[1] + (b[1] - a[1]) * t;
      const z = a[2] + (b[2] - a[2]) * t;
      wls.push({ name, x, y, z });
    });
    frames.push({
      world_landmarks: wls,
      root_quat: [0, 0, 0, 1],
      transl: [0, 0, 0],
    });
  }
  return { fps: FPS, frame_count: FRAMES, frames };
};

const PROCEDURAL_MOTION = buildMotionJSON();

const LedStage: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = (frame % 16) / 16;
  const beatPulse = 1 - Math.pow(beat, 2.5);
  const slowSweep = (Math.sin(frame * 0.04) + 1) * 0.5;
  const ledColors = ["#FF1A8C", "#1AFFE0", "#FFD400", "#7B3FE4", "#FF5A1F"];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="pdBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02020A" />
          <stop offset="60%" stopColor="#06061A" />
          <stop offset="100%" stopColor="#0A0814" />
        </linearGradient>
        <linearGradient id="pdFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="pdSpot" cx="50%" cy="55%" r="38%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.45 * beatPulse + 0.15} />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pdBeam1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD400" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFD400" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD400" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#pdBg)" />
      <rect x={W * 0.06} y={H * 0.05} width={W * 0.88} height={H * 0.55}
        fill="#180A2A" stroke="#1A1A2A" strokeWidth={3} rx={6} />
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => {
          const ci = (row * 14 + col + Math.floor(frame / 5)) % ledColors.length;
          const o = 0.22 + ((Math.sin((frame * 0.12) + row + col * 0.6) + 1) * 0.5) * 0.45 * (0.6 + beatPulse * 0.4);
          return (<rect key={`${row}-${col}`}
            x={W * 0.07 + col * (W * 0.062)} y={H * 0.06 + row * (H * 0.058)}
            width={W * 0.058} height={H * 0.054} rx={3} fill={ledColors[ci]} opacity={o} />);
        })
      )}
      <text x={W / 2} y={H * 0.22} textAnchor="middle"
        fontSize="120" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="900"
        fill="#FFFFFF" stroke="#FF1A8C" strokeWidth="4" letterSpacing="6">DANCE</text>
      <text x={W / 2} y={H * 0.30} textAnchor="middle"
        fontSize="38" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="700"
        fill="#FFD400" letterSpacing="14">PROCEDURAL · 2026</text>
      <rect x={0} y={0} width={W} height={H * 0.04} fill="#1A1A24" />
      {[0.1, 0.22, 0.34, 0.5, 0.66, 0.78, 0.9].map((x, i) => {
        const c = ledColors[(i + Math.floor(frame / 8)) % ledColors.length];
        return (<g key={i}>
          <line x1={W * x} y1={H * 0.04} x2={W * x} y2={H * 0.07} stroke="#1A1A24" strokeWidth={3} />
          <circle cx={W * x} cy={H * 0.085} r={9} fill={c} opacity={0.9} />
        </g>);
      })}
      {[
        { angle: -28 + slowSweep * 30, x: W * 0.18 },
        { angle: 22 - slowSweep * 30, x: W * 0.5 },
        { angle: -12 + slowSweep * 16, x: W * 0.82 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${H * 0.085}) rotate(${b.angle})`}>
          <polygon points={`-30,0 30,0 220,${H * 0.62} -220,${H * 0.62}`}
            fill="url(#pdBeam1)" opacity={0.55 + beatPulse * 0.25} />
        </g>
      ))}
      <ellipse cx={W * 0.5} cy={H * 0.55} rx={W * 0.42} ry={H * 0.32} fill="url(#pdSpot)" />
      <rect x={0} y={H * 0.78} width={W} height={H * 0.22} fill="#01010A" />
      <rect y={H * 0.78} width={W} height={H * 0.22} fill="url(#pdFloor)" />
      <line x1={0} y1={H * 0.78} x2={W} y2={H * 0.78} stroke="#FFD400" strokeWidth={4} opacity={0.7 * beatPulse + 0.3} />
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i / 19) * W;
        const headSize = 14 + (i % 3) * 4;
        const sway = Math.sin((frame + i * 7) * 0.12) * 3;
        return (<g key={i}>
          <circle cx={x + sway} cy={H * 0.86} r={headSize} fill="#000" opacity={0.95} />
        </g>);
      })}
    </svg>
  );
};

export const IsseiDanceProcedural: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#02020A" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <LedStage />
      <ThreeCanvas width={W} height={H}
        camera={{ position: [0, 1.1, 3.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <directionalLight position={[-3, 3, 2]} intensity={0.5} color="#FFD9A0" />
        <directionalLight position={[0, 8, -2]} intensity={0.4} color="#7B3FE4" />
        <GlbAimedPolished
          url={staticFile("Dying.glb")}
          motion={PROCEDURAL_MOTION as any}
          scale={1.2}
          position={[0, -1.0, 0]}
          applyRootRotation={false}
          applyTransl={false}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
