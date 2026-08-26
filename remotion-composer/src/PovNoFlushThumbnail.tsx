import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockyCam, BlockyChar, BlockySkin } from "./fx/BlockyRig";
import { Flies, StinkCloud, Toilet, Room } from "./fx/BlockyProps";

const W = 1080;
const H = 1920;

const HERO: BlockySkin = {
  skin: "#E8B98A",
  shirt: "#FFFFFF",
  pants: "#2E3A59",
  vest: "#3E6FB5",
};

export const PovNoFlushThumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F0E4D0" }}>
    <ThreeCanvas
      width={W}
      height={H}
      camera={{ position: [0, 3, 10], fov: 40 }}
      gl={{ antialias: true }}
    >
      <BlockyCam pos={[3.4, 4.6, 8.6]} look={[-0.8, 3.4, -3.2]} fov={46} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 12, 8]} intensity={0.72} />
      <directionalLight position={[-7, 6, 4]} intensity={0.26} />
      <Room w={13} d={16} h={11} floor="#8FD0E8" wall="#F0E4D0" tiled />
      <Toilet position={[-3.4, 0, -4.4]} lidUp />
      <StinkCloud
        frame={40}
        origin={[-3.4, 1.2, -4.3]}
        count={20}
        spread={1.7}
        rise={4.6}
        scale={1.25}
        intensity={0.95}
      />
      <Flies frame={30} origin={[-3.0, 2.0, -3.9]} count={12} radius={2.0} />
      <BlockyChar
        skin={HERO}
        face="shock"
        position={[0.9, 0, -1.6]}
        pose={{
          bodyYaw: 0.42,
          armLPitch: -0.55,
          armRPitch: -0.55,
          armLRoll: 1.05,
          armRRoll: -1.05,
          bodyLean: -0.16,
        }}
      />
    </ThreeCanvas>

    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={132} width={W} height={252} fill="#111111" opacity={0.34} />
      {["POV: THE GUY WHO", "NEVER FLUSHES"].map((line, i) => (
        <text
          key={line}
          x={W / 2}
          y={236 + i * 116}
          textAnchor="middle"
          fontFamily="Montserrat, Arial Black, sans-serif"
          fontWeight={900}
          fontSize={i === 0 ? 92 : 108}
          fill={i === 0 ? "#FFFFFF" : "#FFD400"}
          stroke="#000000"
          strokeWidth={18}
          paintOrder="stroke"
        >
          {line}
        </text>
      ))}
      <text
        x={W / 2}
        y={1720}
        textAnchor="middle"
        fontFamily="Montserrat, Arial Black, sans-serif"
        fontWeight={900}
        fontSize={78}
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth={16}
        paintOrder="stroke"
      >
        HE REGRETTED IT
      </text>
    </svg>
  </AbsoluteFill>
);
