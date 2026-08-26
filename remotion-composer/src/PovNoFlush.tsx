import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  BlockyCam,
  BlockyChar,
  BlockySkin,
  FaceKind,
} from "./fx/BlockyRig";
import {
  Door,
  Drips,
  Flies,
  Geyser,
  Puddle,
  Room,
  Stall,
  StinkCloud,
  StinkLines,
  Toilet,
} from "./fx/BlockyProps";

const W = 1080;
const H = 1920;

export const POV_NOFLUSH_DURATION = 900;

const HERO: BlockySkin = {
  skin: "#E8B98A",
  shirt: "#FFFFFF",
  pants: "#2E3A59",
  vest: "#3E6FB5",
};

const CULPRIT: BlockySkin = {
  skin: "#9AA0A6",
  shirt: "#FFFFFF",
  pants: "#5C6268",
  earKind: "wolf",
  muzzle: "#B7BDC2",
  vest: "#16181C",
};

const BOSS: BlockySkin = {
  skin: "#C4622B",
  shirt: "#FFFFFF",
  pants: "#C4622B",
  earKind: "round",
  muzzle: "#F2E27A",
  vest: "#16181C",
};

const CUTS = [0, 105, 210, 315, 420, 540, 660, 780, 900];

const walk = (f: number, speed = 0.26, amp = 0.55) => ({
  legLPitch: Math.sin(f * speed) * amp,
  legRPitch: -Math.sin(f * speed) * amp,
  armLPitch: -Math.sin(f * speed) * amp * 0.8,
  armRPitch: Math.sin(f * speed) * amp * 0.8,
  bodyY: Math.abs(Math.sin(f * speed)) * 0.14,
});

const shake = (f: number, amp: number) => ({
  x: Math.sin(f * 1.9) * amp,
  y: Math.cos(f * 2.6) * amp * 0.7,
});

const CORRIDOR_FLOOR = "#B9A98C";
const CORRIDOR_WALL = "#E3D9C4";
const BATH_FLOOR = "#8FD0E8";
const BATH_WALL = "#F0E4D0";

const Corridor: React.FC = () => (
  <Room w={11} d={34} h={9} floor={CORRIDOR_FLOOR} wall={CORRIDOR_WALL} />
);

const Bathroom: React.FC = () => (
  <Room w={13} d={16} h={11} floor={BATH_FLOOR} wall={BATH_WALL} tiled />
);

const ToiletDoor: React.FC<{ angle: number }> = ({ angle }) => (
  <group position={[-5.4, 0, -2.6]} rotation={[0, Math.PI / 2, 0]}>
    <Door position={[0, 0, 0]} angle={angle} />
  </group>
);

const Shot1: React.FC<{ f: number }> = ({ f }) => {
  const z = interpolate(f, [0, 105], [8, -2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <group>
      <BlockyCam pos={[2.2, 4.7, z + 12.5]} look={[-1.0, 4.1, z - 2]} fov={42} />
      <Corridor />
      <ToiletDoor angle={0} />
      <Flies frame={f} origin={[-4.2, 1.8, -3.4]} count={6} radius={1.6} />
      <BlockyChar
        skin={HERO}
        face="neutral"
        position={[0, 0, z]}
        pose={{ ...walk(f), bodyYaw: Math.PI }}
      />
    </group>
  );
};

const Shot2: React.FC<{ f: number }> = ({ f }) => {
  const open = interpolate(f, [8, 26], [0, -2.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burst = interpolate(f, [22, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recoil = interpolate(f, [28, 48, 105], [0, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sk = shake(f, f > 26 ? 0.3 * burst : 0);
  const face: FaceKind = f < 27 ? "neutral" : "shock";
  return (
    <group>
      <BlockyCam
        pos={[5.6 + sk.x, 4.5 + sk.y, 6.6]}
        look={[-1.2, 3.4 + sk.y, -3.0]}
        fov={54}
      />
      <Corridor />
      <ToiletDoor angle={open} />
      <StinkCloud
        frame={f}
        origin={[-4.6, 0.4, -3.4]}
        count={22}
        spread={2.6}
        rise={6.0}
        scale={1.6 * (0.4 + burst)}
        intensity={burst}
      />
      <Flies frame={f} origin={[-3.6, 2.0, -3.2]} count={10} radius={2.4} />
      <BlockyChar
        skin={HERO}
        face={face}
        position={[-1.4 + recoil * 2.2, 0, -2.6 + recoil * 0.6]}
        pose={{
          bodyYaw: -Math.PI / 2 + recoil * 1.95,
          bodyLean: -recoil * 0.22,
          armLPitch: -recoil * 1.4,
          armRPitch: -recoil * 1.4,
          armLRoll: recoil * 0.5,
          armRRoll: -recoil * 0.5,
          legLPitch: recoil * 0.45,
          legRPitch: -recoil * 0.3,
        }}
      />
    </group>
  );
};

const Shot3: React.FC<{ f: number }> = ({ f }) => {
  const push = interpolate(f, [0, 105], [1.6, -1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sk = shake(f, 0.07);
  return (
    <group>
      <BlockyCam
        pos={[1.3 + sk.x, 4.1 + sk.y, push]}
        look={[-0.4, 2.6, -5.4]}
        fov={42}
      />
      <Bathroom />
      <Stall position={[-0.4, 0, -4.8]} doorAngle={-1.5} />
      <Toilet position={[-0.4, 0, -5.4]} lidUp />
      <StinkCloud
        frame={f}
        origin={[-0.4, 1.3, -5.3]}
        count={18}
        spread={1.5}
        rise={4.2}
        scale={0.95}
        intensity={0.72}
      />
      <StinkLines frame={f} origin={[-0.4, 2.1, -4.7]} />
      <Flies frame={f} origin={[-0.4, 1.9, -5.0]} count={12} radius={1.7} />
      <Drips frame={f} origin={[-0.4, 0.2, -4.8]} count={8} />
      <Puddle position={[-0.4, 0.03, -4.3]} r={1.6} color="#8FBF4A" />
    </group>
  );
};

const Shot4: React.FC<{ f: number }> = ({ f }) => {
  const z = interpolate(f, [0, 105], [0, -7.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glance = interpolate(f, [44, 62, 88], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sk = shake(f, 0.06);
  return (
    <group>
      <BlockyCam
        pos={[1.6 + sk.x, 4.7 + sk.y, 8.6]}
        look={[-0.4, 4.0, -2.0]}
        fov={42}
      />
      <Corridor />
      <ToiletDoor angle={-0.5} />
      <BlockyChar
        skin={CULPRIT}
        face={glance > 0.4 ? "smug" : "neutral"}
        position={[-0.6, 0, z]}
        pose={{
          ...walk(f, 0.22, 0.5),
          bodyYaw: Math.PI,
          headYaw: glance * 2.5,
        }}
      />
    </group>
  );
};

const Shot5: React.FC<{ f: number }> = ({ f }) => {
  const pull = interpolate(f, [34, 56], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lean = interpolate(f, [0, 34], [0.12, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <group>
      <BlockyCam pos={[6.4, 4.2, 7.4]} look={[0.4, 2.6, -4.0]} fov={46} />
      <Bathroom />
      <Stall position={[-0.4, 0, -4.8]} doorAngle={-1.5} />
      <Toilet position={[-0.4, 0, -4.6]} lidUp handlePull={pull} />
      <mesh position={[0.4, 2.3, -3.9]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[2.1, 0.08, 0.08]} />
        <meshLambertMaterial color="#D14A4A" />
      </mesh>
      <Flies frame={f} origin={[-0.4, 2.0, -4.4]} count={7} radius={1.5} />
      <StinkLines frame={f} origin={[-0.4, 1.9, -4.2]} />
      <BlockyChar
        skin={HERO}
        face="grin"
        position={[1.8, 0, -2.6]}
        pose={{
          bodyYaw: -0.45,
          bodyLean: lean * 0.35,
          armLPitch: -1.5,
          armRPitch: -1.7,
          armLRoll: 0.3,
          legLPitch: 0.5,
          legRPitch: -0.3,
          headYaw: 0.85,
        }}
      />
    </group>
  );
};

const Shot6: React.FC<{ f: number }> = ({ f }) => {
  const z = interpolate(f, [0, 46], [2.8, -3.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sit = interpolate(f, [50, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const walking = f < 48;
  return (
    <group>
      <BlockyCam pos={[4.6, 4.6, 6.8]} look={[-0.3, 3.7, -4.0]} fov={44} />
      <Bathroom />
      <Stall position={[-0.4, 0, -4.8]} doorAngle={-1.5} />
      <Toilet position={[-0.4, 0, -4.6]} lidUp handlePull={0.7} />
      <mesh position={[0.4, 2.3, -3.9]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[2.1, 0.08, 0.08]} />
        <meshLambertMaterial color="#D14A4A" />
      </mesh>
      <Flies frame={f} origin={[-0.4, 2.0, -4.4]} count={7} radius={1.5} />
      <BlockyChar
        skin={CULPRIT}
        face="smug"
        position={[-0.4, 0, walking ? z : -3.4 - sit * 0.8]}
        pose={{
          bodyYaw: Math.PI,
          ...(walking ? walk(f, 0.24, 0.5) : {}),
          bodyY: -sit * 0.95,
          legLPitch: sit * -1.35,
          legRPitch: sit * -1.35,
          armLPitch: sit * -0.5,
          armRPitch: sit * -0.5,
        }}
      />
    </group>
  );
};

const Shot7: React.FC<{ f: number }> = ({ f }) => {
  const power = interpolate(f, [14, 32, 96, 120], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fly = interpolate(f, [18, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arc = Math.sin(fly * Math.PI) * 4.2;
  const sk = shake(f, power * 0.4);
  return (
    <group>
      <BlockyCam
        pos={[4.6 + sk.x, 6.0 + sk.y, 8.8]}
        look={[-0.3 + sk.x, 4.8, -4.4]}
        fov={50}
      />
      <Bathroom />
      <Stall position={[-0.4, 0, -4.8]} doorAngle={-1.5} />
      <Toilet position={[-0.4, 0, -4.6]} lidUp handlePull={0.9} />
      <Geyser frame={f} origin={[-0.4, 1.1, -4.6]} power={power} />
      <group
        position={[-0.4, 1.2 + arc + 2.8, -4.6 + fly * 1.8]}
        rotation={[fly * 1.4, Math.PI + fly * 5.4, fly * 3.2]}
      >
        <BlockyChar
          skin={CULPRIT}
          face="shock"
          position={[0, -2.8, 0]}
          pose={{
            armLPitch: -2.3,
            armRPitch: -2.3,
            armLRoll: 0.8,
            armRRoll: -0.8,
            legLPitch: -0.9,
            legRPitch: 0.6,
          }}
        />
      </group>
      <Drips frame={f} origin={[-0.4, 1.6, -4.0]} count={12} color="#BFE8FF" />
    </group>
  );
};

const Shot8: React.FC<{ f: number }> = ({ f }) => {
  const peek = interpolate(f, [56, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <group>
      <BlockyCam pos={[2.6, 6.2, 10.8]} look={[-0.6, 2.6, -2.6]} fov={52} />
      <Bathroom />
      <Stall position={[-0.4, 0, -4.8]} doorAngle={-1.5} />
      <Toilet position={[-0.4, 0, -4.6]} lidUp handlePull={0.4} />
      <Puddle position={[-0.6, 0.03, -1.8]} r={3.2} color="#8FBF4A" />
      <Puddle position={[1.6, 0.04, -0.4]} r={1.6} color="#BFE8FF" />
      <group position={[-0.9, 0.46, -2.0]} rotation={[-Math.PI / 2, 0, 0.25]}>
        <BlockyChar skin={CULPRIT} face="dead" position={[0, 0, 0]} />
      </group>
      <Drips frame={f} origin={[-0.9, 0.7, -1.0]} count={9} color="#8FBF4A" />
      <Flies frame={f} origin={[-0.9, 1.2, -1.8]} count={12} radius={2.3} />
      <BlockyChar
        skin={BOSS}
        face="angry"
        position={[2.2, 0, -3.8]}
        pose={{ bodyYaw: 2.5, headPitch: 0.4, armLPitch: -0.5, armRPitch: -0.35 }}
      />
      <BlockyChar
        skin={HERO}
        face="grin"
        position={[-3.0, 0, 0.6]}
        pose={{
          bodyYaw: 1.1,
          headYaw: -0.5,
          bodyLean: 0.1,
          armLPitch: -0.3,
          armRPitch: -0.3,
        }}
        scale={peek}
      />
    </group>
  );
};

const Scene: React.FC<{ frame: number }> = ({ frame }) => {
  const i = Math.max(0, CUTS.findIndex((c, k) => k > 0 && frame < c) - 1);
  const f = frame - CUTS[i];
  if (i === 0) return <Shot1 f={f} />;
  if (i === 1) return <Shot2 f={f} />;
  if (i === 2) return <Shot3 f={f} />;
  if (i === 3) return <Shot4 f={f} />;
  if (i === 4) return <Shot5 f={f} />;
  if (i === 5) return <Shot6 f={f} />;
  if (i === 6) return <Shot7 f={f} />;
  return <Shot8 f={f} />;
};

const TITLE = ["POV: the guy who never", "flushes at work"];

export const PovNoFlush: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#CFE7F2" }}>
      <ThreeCanvas
        width={W}
        height={H}
        camera={{ position: [0, 3, 10], fov: 40 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.86} />
        <directionalLight position={[6, 12, 8]} intensity={0.7} />
        <directionalLight position={[-7, 6, 4]} intensity={0.24} />
        <Scene frame={frame} />
      </ThreeCanvas>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {TITLE.map((line, i) => (
          <text
            key={line}
            x={W / 2}
            y={196 + i * 88}
            textAnchor="middle"
            fontFamily="Montserrat, Arial Black, sans-serif"
            fontWeight={900}
            fontSize={74}
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth={14}
            paintOrder="stroke"
          >
            {line}
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
