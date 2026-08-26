import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockyChar, BlockyCam, WOLF, GIRL, BEAVER, FaceKind } from "./fx/BlockyRig";

const W = 1080;
const H = 1920;

const FACES: FaceKind[] = ["neutral", "angry", "shock", "smug", "grin", "dead"];

const Stage: React.FC = () => (
  <group>
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshLambertMaterial color="#8FD97A" />
    </mesh>
    <mesh position={[0, 9, -9]}>
      <boxGeometry args={[40, 18, 1]} />
      <meshLambertMaterial color="#E8C89A" />
    </mesh>
  </group>
);

export const BlockyCharSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const face = FACES[Math.floor(frame / 30) % FACES.length];
  const bob = Math.sin(frame * 0.12) * 0.12;
  const swing = Math.sin(frame * 0.12) * 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: "#BFE3F5" }}>
      <ThreeCanvas
        width={W}
        height={H}
        camera={{ position: [0, 3.4, 26], fov: 40 }}
        gl={{ antialias: true }}
      >
        <BlockyCam pos={[0, 2.9, 26]} look={[0, 2.9, 0]} fov={40} />
        <ambientLight intensity={0.82} />
        <directionalLight position={[5, 10, 8]} intensity={0.75} />
        <directionalLight position={[-6, 5, 4]} intensity={0.25} />
        <Stage />
        <BlockyChar
          skin={WOLF}
          face={face}
          position={[-3.9, 0, 0]}
          pose={{ bodyY: bob, armLPitch: swing, armRPitch: -swing, bodyYaw: 0.25 }}
        />
        <BlockyChar
          skin={GIRL}
          face={face}
          position={[0, 0, 0]}
          pose={{ bodyY: -bob, armLPitch: -swing, armRPitch: swing }}
        />
        <BlockyChar
          skin={BEAVER}
          face={face}
          position={[3.9, 0, 0]}
          pose={{ bodyY: bob, armLPitch: swing * 0.6, armRPitch: -swing * 0.6, bodyYaw: -0.25 }}
        />
      </ThreeCanvas>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <text
          x={W / 2}
          y={200}
          textAnchor="middle"
          fontFamily="Montserrat, Arial Black, sans-serif"
          fontWeight={900}
          fontSize={78}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={14}
          paintOrder="stroke"
        >
          {face.toUpperCase()}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
