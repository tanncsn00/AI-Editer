/**
 * IsseiDanceProceduralV2 — Soldier driven by hand-authored joint positions
 * with bigger amplitude choreography + virtual cinematographer (7 shots).
 *
 * Coordinate convention (character facing -Z natively, no scene rotation):
 *   x: subject's RIGHT (positive)        ←  caller's left in viewport
 *   y: up (positive)
 *   z: subject's BACK (positive)         ←  forward toward camera = -z
 *
 * Hip ~ y=0.95m. Shoulder y=1.50m. Arms rest at y=1.00m, x=±0.55m.
 *
 * Camera lives on -Z side (z negative) looking toward +Z to see character's
 * front. Director swings through wide → low hero → 3/4 right → top → 3/4 left
 * → close-up → pull-back wide.
 */

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GlbAimedV2 } from "./fx/GlbAimedV2";
import { MultiCameraDirector, CameraShot } from "./fx/MultiCameraDirector";

const W = 1080;
const H = 1920;
const FPS = 30;
const FRAMES = 427;

type Joint = { name: string; x: number; y: number; z: number };
type KeyPose = { frame: number; joints: Record<string, [number, number, number]> };

// --- baseline rest pose ---
const idle = (): KeyPose["joints"] => ({
  pelvis: [0, 0.95, 0],
  spine1: [0, 1.05, 0],
  spine2: [0, 1.20, 0],
  spine3: [0, 1.35, 0],
  neck:   [0, 1.45, 0],
  head:   [0, 1.65, 0],
  left_hip:  [-0.10, 0.95, 0],
  right_hip: [ 0.10, 0.95, 0],
  left_shoulder:  [-0.20, 1.50, 0],
  right_shoulder: [ 0.20, 1.50, 0],
  left_elbow:  [-0.45, 1.10, 0],
  right_elbow: [ 0.45, 1.10, 0],
  left_wrist:  [-0.55, 0.75, 0],
  right_wrist: [ 0.55, 0.75, 0],
  left_knee:  [-0.10, 0.50, 0],
  right_knee: [ 0.10, 0.50, 0],
  left_ankle:  [-0.10, 0.05, 0],
  right_ankle: [ 0.10, 0.05, 0],
  left_foot:  [-0.10, 0.0, -0.10],
  right_foot: [ 0.10, 0.0, -0.10],
});

// shift entire upper body by (dx, dy, dz)
const shiftUpper = (j: KeyPose["joints"], dx: number, dy: number, dz: number) => {
  const upper = ["pelvis","spine1","spine2","spine3","neck","head",
                 "left_shoulder","right_shoulder","left_elbow","right_elbow",
                 "left_wrist","right_wrist","left_hip","right_hip"];
  upper.forEach((k) => { j[k][0]+=dx; j[k][1]+=dy; j[k][2]+=dz; });
};

// --- big-amplitude poses ---

// Hands shot up to sky, big stretch, head back
const armsUpBig = (): KeyPose["joints"] => {
  const j = idle();
  shiftUpper(j, 0, 0.05, 0);
  j.left_elbow  = [-0.35, 1.95, -0.05];
  j.right_elbow = [ 0.35, 1.95, -0.05];
  j.left_wrist  = [-0.30, 2.40, -0.10];
  j.right_wrist = [ 0.30, 2.40, -0.10];
  j.head = [0, 1.72, -0.10];
  return j;
};

// Right hip popped, lean right, left hand on hip, right arm shoots up
const hipPopRight = (): KeyPose["joints"] => {
  const j = idle();
  shiftUpper(j, 0.18, 0, 0);
  j.pelvis[0] = 0.20;
  j.left_hip[0]  = 0.10;
  j.right_hip[0] = 0.30;
  j.right_knee = [ 0.30, 0.50, 0];
  j.left_knee  = [-0.05, 0.45, 0.05];
  j.left_elbow = [-0.10, 1.10, 0];
  j.left_wrist = [ 0.05, 0.95, 0];
  j.right_elbow = [ 0.45, 1.85, -0.10];
  j.right_wrist = [ 0.40, 2.25, -0.20];
  j.head = [0.10, 1.65, -0.05];
  return j;
};

// Mirror — left hip pop
const hipPopLeft = (): KeyPose["joints"] => {
  const j = idle();
  shiftUpper(j, -0.18, 0, 0);
  j.pelvis[0] = -0.20;
  j.right_hip[0] = -0.10;
  j.left_hip[0]  = -0.30;
  j.left_knee  = [-0.30, 0.50, 0];
  j.right_knee = [ 0.05, 0.45, 0.05];
  j.right_elbow = [ 0.10, 1.10, 0];
  j.right_wrist = [-0.05, 0.95, 0];
  j.left_elbow  = [-0.45, 1.85, -0.10];
  j.left_wrist  = [-0.40, 2.25, -0.20];
  j.head = [-0.10, 1.65, -0.05];
  return j;
};

// Power point — both arms shoot forward (toward camera = -z), left foot stomp
const powerPoint = (): KeyPose["joints"] => {
  const j = idle();
  j.right_elbow = [ 0.25, 1.45, -0.30];
  j.right_wrist = [ 0.20, 1.40, -0.75];
  j.left_elbow  = [-0.25, 1.45, -0.30];
  j.left_wrist  = [-0.20, 1.40, -0.75];
  j.left_knee  = [-0.10, 0.40, -0.15];
  j.left_ankle = [-0.10, 0.05, -0.20];
  j.head = [0, 1.65, -0.10];
  return j;
};

// T-pose to V-pose, big and wide
const armsWideBig = (): KeyPose["joints"] => {
  const j = idle();
  j.left_elbow  = [-0.65, 1.55, 0];
  j.right_elbow = [ 0.65, 1.55, 0];
  j.left_wrist  = [-1.10, 1.65, 0];
  j.right_wrist = [ 1.10, 1.65, 0];
  return j;
};

// Big jump — everything up, knees tucked
const jumpBig = (): KeyPose["joints"] => {
  const j = idle();
  const up = 0.50;
  Object.keys(j).forEach((k) => { j[k][1] += up; });
  j.left_knee[1]  -= 0.20;
  j.right_knee[1] -= 0.20;
  j.left_knee[2]  =  -0.20;
  j.right_knee[2] =  -0.20;
  j.left_ankle[1]  -= 0.30;
  j.right_ankle[1] -= 0.30;
  j.left_ankle[2]  =  -0.20;
  j.right_ankle[2] =  -0.20;
  j.left_elbow  = [-0.40, j.left_shoulder[1] + 0.35, 0];
  j.right_elbow = [ 0.40, j.right_shoulder[1] + 0.35, 0];
  j.left_wrist  = [-0.50, j.left_shoulder[1]  + 0.80, 0];
  j.right_wrist = [ 0.50, j.right_shoulder[1] + 0.80, 0];
  return j;
};

// Deep squat with arms forward
const squatBig = (): KeyPose["joints"] => {
  const j = idle();
  j.pelvis = [0, 0.50, 0];
  j.spine1 = [0, 0.62, -0.04];
  j.spine2 = [0, 0.78, -0.06];
  j.spine3 = [0, 0.95, -0.07];
  j.neck   = [0, 1.05, -0.08];
  j.head   = [0, 1.25, -0.08];
  j.left_hip  = [-0.14, 0.50, 0];
  j.right_hip = [ 0.14, 0.50, 0];
  j.left_knee  = [-0.22, 0.28, -0.25];
  j.right_knee = [ 0.22, 0.28, -0.25];
  j.left_ankle  = [-0.12, 0.05, -0.05];
  j.right_ankle = [ 0.12, 0.05, -0.05];
  j.left_shoulder  = [-0.20, 1.10, -0.03];
  j.right_shoulder = [ 0.20, 1.10, -0.03];
  j.left_elbow  = [-0.40, 1.00, -0.30];
  j.right_elbow = [ 0.40, 1.00, -0.30];
  j.left_wrist  = [-0.45, 0.95, -0.65];
  j.right_wrist = [ 0.45, 0.95, -0.65];
  return j;
};

// Spin pose — twisted shoulders, arms cross
const spinTwistR = (): KeyPose["joints"] => {
  const j = idle();
  j.left_shoulder  = [-0.05, 1.50, -0.20];
  j.right_shoulder = [ 0.30, 1.50,  0.15];
  j.left_elbow  = [ 0.20, 1.30, -0.40];
  j.right_elbow = [ 0.40, 1.30,  0.30];
  j.left_wrist  = [ 0.50, 1.10, -0.45];
  j.right_wrist = [ 0.10, 1.10,  0.50];
  j.head = [0.10, 1.65, -0.10];
  j.pelvis[0] = 0.05;
  return j;
};

const spinTwistL = (): KeyPose["joints"] => {
  const j = idle();
  j.right_shoulder = [ 0.05, 1.50, -0.20];
  j.left_shoulder  = [-0.30, 1.50,  0.15];
  j.right_elbow = [-0.20, 1.30, -0.40];
  j.left_elbow  = [-0.40, 1.30,  0.30];
  j.right_wrist = [-0.50, 1.10, -0.45];
  j.left_wrist  = [-0.10, 1.10,  0.50];
  j.head = [-0.10, 1.65, -0.10];
  j.pelvis[0] = -0.05;
  return j;
};

// Shoulder shimmy R — right shoulder forward
const shimmyR = (): KeyPose["joints"] => {
  const j = idle();
  j.right_shoulder = [ 0.18, 1.52, -0.15];
  j.left_shoulder  = [-0.22, 1.48,  0.05];
  j.right_elbow = [ 0.40, 1.10, -0.10];
  j.left_elbow  = [-0.45, 1.10,  0.05];
  j.right_wrist = [ 0.55, 0.80, -0.05];
  j.left_wrist  = [-0.55, 0.80,  0.05];
  j.pelvis[0] = -0.05;
  return j;
};

// Shoulder shimmy L — left shoulder forward
const shimmyL = (): KeyPose["joints"] => {
  const j = idle();
  j.left_shoulder  = [-0.18, 1.52, -0.15];
  j.right_shoulder = [ 0.22, 1.48,  0.05];
  j.left_elbow  = [-0.40, 1.10, -0.10];
  j.right_elbow = [ 0.45, 1.10,  0.05];
  j.left_wrist  = [-0.55, 0.80, -0.05];
  j.right_wrist = [ 0.55, 0.80,  0.05];
  j.pelvis[0] = 0.05;
  return j;
};

// Hands behind head — chill cool
const handsHead = (): KeyPose["joints"] => {
  const j = idle();
  j.left_elbow  = [-0.55, 1.60, 0.20];
  j.right_elbow = [ 0.55, 1.60, 0.20];
  j.left_wrist  = [-0.20, 1.70, 0.15];
  j.right_wrist = [ 0.20, 1.70, 0.15];
  return j;
};

// Final freeze — full V, head back, knees slightly bent for landing
const finalFreeze = (): KeyPose["joints"] => {
  const j = idle();
  j.left_elbow  = [-0.55, 1.65,  -0.05];
  j.right_elbow = [ 0.55, 1.65,  -0.05];
  j.left_wrist  = [-0.95, 2.00,  -0.10];
  j.right_wrist = [ 0.95, 2.00,  -0.10];
  j.head = [0, 1.72, -0.08];
  j.pelvis[1] = 0.92;
  return j;
};

// --- Beat-driven choreography (~30fps, 427 frames ≈ 14s) ---
// Beat every ~13 frames (assume ~135 BPM). Hard-cuts on beat for energy.
const KEYPOSES: KeyPose[] = [
  { frame:   0, joints: idle() },
  { frame:  18, joints: hipPopRight() },
  { frame:  36, joints: hipPopLeft() },
  { frame:  54, joints: shimmyR() },
  { frame:  72, joints: shimmyL() },
  { frame:  90, joints: armsUpBig() },
  { frame: 108, joints: powerPoint() },
  { frame: 126, joints: hipPopRight() },
  { frame: 144, joints: armsWideBig() },
  { frame: 162, joints: handsHead() },
  { frame: 180, joints: jumpBig() },
  { frame: 200, joints: squatBig() },
  { frame: 220, joints: spinTwistR() },
  { frame: 240, joints: spinTwistL() },
  { frame: 258, joints: shimmyR() },
  { frame: 276, joints: shimmyL() },
  { frame: 294, joints: hipPopLeft() },
  { frame: 312, joints: armsUpBig() },
  { frame: 330, joints: powerPoint() },
  { frame: 348, joints: jumpBig() },
  { frame: 368, joints: squatBig() },
  { frame: 386, joints: armsWideBig() },
  { frame: 404, joints: finalFreeze() },
  { frame: 426, joints: finalFreeze() },
];

const buildMotionJSON = () => {
  const frames: any[] = [];
  for (let f = 0; f < FRAMES; f++) {
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

// --- Cinematic shot list (camera on -Z side looking at +Z to see character front) ---
const SHOTS: CameraShot[] = [
  // 1) Wide front establishing
  { frame:   0, pos: [ 0.0, 1.10, -4.5], lookAt: [0, 1.0, 0], fov: 45 },
  // 2) Hero low angle (push in)
  { frame:  60, pos: [ 0.0, 0.45, -3.0], lookAt: [0, 1.4, 0], fov: 42 },
  // 3) 3/4 from camera-right (subject's left)
  { frame: 120, pos: [-2.4, 1.20, -2.6], lookAt: [0, 1.1, 0], fov: 40 },
  // 4) Top-down pull
  { frame: 180, pos: [ 0.0, 4.20, -1.2], lookAt: [0, 1.0, 0], fov: 50 },
  // 5) 3/4 from camera-left (subject's right)
  { frame: 240, pos: [ 2.4, 1.20, -2.6], lookAt: [0, 1.1, 0], fov: 40 },
  // 6) Close head/shoulders
  { frame: 300, pos: [ 0.0, 1.55, -1.7], lookAt: [0, 1.55, 0], fov: 32 },
  // 7) Pull back wide for finale
  { frame: 360, pos: [ 0.0, 1.80, -5.5], lookAt: [0, 1.1, 0], fov: 50 },
  { frame: 426, pos: [ 0.0, 1.80, -5.5], lookAt: [0, 1.1, 0], fov: 50 },
];

const LedStage: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = (frame % 16) / 16;
  const beatPulse = 1 - Math.pow(beat, 2.5);
  const slowSweep = (Math.sin(frame * 0.04) + 1) * 0.5;
  const ledColors = ["#FF1A8C", "#1AFFE0", "#FFD400", "#7B3FE4", "#FF5A1F"];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="pdv2Bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02020A" />
          <stop offset="60%" stopColor="#06061A" />
          <stop offset="100%" stopColor="#0A0814" />
        </linearGradient>
        <linearGradient id="pdv2Floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="pdv2Spot" cx="50%" cy="55%" r="38%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.45 * beatPulse + 0.15} />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pdv2Beam" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD400" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFD400" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD400" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#pdv2Bg)" />
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
        fill="#FFD400" letterSpacing="14">PROCEDURAL · V2</text>
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
        { angle:  22 - slowSweep * 30, x: W * 0.5 },
        { angle: -12 + slowSweep * 16, x: W * 0.82 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${H * 0.085}) rotate(${b.angle})`}>
          <polygon points={`-30,0 30,0 220,${H * 0.62} -220,${H * 0.62}`}
            fill="url(#pdv2Beam)" opacity={0.55 + beatPulse * 0.25} />
        </g>
      ))}
      <ellipse cx={W * 0.5} cy={H * 0.55} rx={W * 0.42} ry={H * 0.32} fill="url(#pdv2Spot)" />
      <rect x={0} y={H * 0.78} width={W} height={H * 0.22} fill="#01010A" />
      <rect y={H * 0.78} width={W} height={H * 0.22} fill="url(#pdv2Floor)" />
      <line x1={0} y1={H * 0.78} x2={W} y2={H * 0.78} stroke="#FFD400" strokeWidth={4} opacity={0.7 * beatPulse + 0.3} />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = (i / 21) * W;
        const headSize = 14 + (i % 3) * 4;
        const sway = Math.sin((frame + i * 7) * 0.12) * 3;
        return (<g key={i}>
          <circle cx={x + sway} cy={H * 0.86} r={headSize} fill="#000" opacity={0.95} />
        </g>);
      })}
    </svg>
  );
};

export const IsseiDanceProceduralV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#02020A" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <LedStage />
      <ThreeCanvas
        width={W}
        height={H}
        camera={{ position: [0, 1.1, -4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 5, -4]} intensity={1.5} />
        <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#FFD9A0" />
        <directionalLight position={[0, 8, 2]} intensity={0.4} color="#7B3FE4" />
        <MultiCameraDirector shots={SHOTS} />
        <GlbAimedV2
          url={staticFile("Dying.glb")}
          motion={PROCEDURAL_MOTION as any}
          scale={1.2}
          position={[0, -1.0, 0]}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
