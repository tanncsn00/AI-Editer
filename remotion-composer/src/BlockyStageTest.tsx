import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockyCam, BlockyChar, WOLF, GIRL, BEAVER } from "./fx/BlockyRig";
import { Room } from "./fx/BlockyProps";
import {
  CHAR_HEIGHT,
  TITLE_SAFE,
  Vec3,
  centroid,
  faceCamera,
  frameSubject,
  spreadX,
  tumble,
} from "./fx/BlockyStage";

const W = 1080;
const H = 1920;

export const BLOCKY_STAGE_TEST_DURATION = 160;

const Stage: React.FC = () => (
  <Room w={26} d={26} h={12} floor="#8FD97A" wall="#E3D9C4" />
);

const SectionA: React.FC = () => {
  const subject: Vec3 = [3.5, 0, -2];
  const cam = frameSubject({ subject, azimuth: 0.4, coverage: 0.55 });
  return (
    <group>
      <BlockyCam pos={cam.pos} look={cam.look} fov={cam.fov} />
      <Stage />
      <BlockyChar
        skin={WOLF}
        face="angry"
        position={subject}
        pose={{ bodyYaw: faceCamera(subject, cam.pos) }}
      />
    </group>
  );
};

const SectionB: React.FC = () => {
  const subject: Vec3 = [-4.2, 0, 3.5];
  const cam = frameSubject({
    subject,
    azimuth: -2.3,
    coverage: 0.62,
    fov: 40,
  });
  return (
    <group>
      <BlockyCam pos={cam.pos} look={cam.look} fov={cam.fov} />
      <Stage />
      <BlockyChar
        skin={GIRL}
        face="shock"
        position={subject}
        pose={{ bodyYaw: faceCamera(subject, cam.pos, 0.35) }}
      />
    </group>
  );
};

const SectionC: React.FC = () => {
  const subjects: Vec3[] = [
    [-4.0, 0, 0],
    [0.4, 0, -1.2],
    [4.6, 0, 0.6],
  ];
  const cam = frameSubject({
    subject: centroid(subjects),
    width: spreadX(subjects),
    azimuth: 0.2,
    coverage: 0.5,
    fov: 46,
  });
  const skins = [WOLF, GIRL, BEAVER];
  return (
    <group>
      <BlockyCam pos={cam.pos} look={cam.look} fov={cam.fov} />
      <Stage />
      {subjects.map((s, i) => (
        <BlockyChar
          key={i}
          skin={skins[i]}
          face="grin"
          position={s}
          pose={{ bodyYaw: faceCamera(s, cam.pos) }}
        />
      ))}
    </group>
  );
};

const SectionD: React.FC<{ f: number }> = ({ f }) => {
  const fly = interpolate(f, [0, 39], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arc = Math.sin(fly * Math.PI) * 4.6;
  const base: Vec3 = [0, 0, 0];
  const cam = frameSubject({
    subject: base,
    height: CHAR_HEIGHT + 5.2,
    coverage: 0.62,
    azimuth: 0.3,
    fov: 48,
  });
  const t = tumble({
    position: [0, 0.8 + arc, 0],
    pitch: fly * 1.5,
    yaw: fly * 5.2,
    roll: fly * 3.4,
  });
  return (
    <group>
      <BlockyCam pos={cam.pos} look={cam.look} fov={cam.fov} />
      <Stage />
      <group position={t.group.position} rotation={t.group.rotation}>
        <BlockyChar
          skin={BEAVER}
          face="shock"
          position={t.child}
          pose={{ armLPitch: -2.2, armRPitch: -2.2, legLPitch: -0.8 }}
        />
      </group>
    </group>
  );
};

const LABELS = [
  "A · frameSubject + faceCamera",
  "B · camera on the far side",
  "C · frameGroup, 3 subjects",
  "D · tumble about centre",
];

export const BlockyStageTest: React.FC = () => {
  const frame = useCurrentFrame();
  const section = Math.min(3, Math.floor(frame / 40));
  const f = frame - section * 40;
  return (
    <AbsoluteFill style={{ backgroundColor: "#BFE3F5" }}>
      <ThreeCanvas
        width={W}
        height={H}
        camera={{ position: [0, 3, 10], fov: 40 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.86} />
        <directionalLight position={[6, 12, 8]} intensity={0.7} />
        <directionalLight position={[-7, 6, 4]} intensity={0.24} />
        {section === 0 ? <SectionA /> : null}
        {section === 1 ? <SectionB /> : null}
        {section === 2 ? <SectionC /> : null}
        {section === 3 ? <SectionD f={f} /> : null}
      </ThreeCanvas>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect
          x={0}
          y={0}
          width={W}
          height={H * TITLE_SAFE}
          fill="#D12B2B"
          opacity={0.26}
        />
        <line
          x1={0}
          y1={H * TITLE_SAFE}
          x2={W}
          y2={H * TITLE_SAFE}
          stroke="#D12B2B"
          strokeWidth={6}
        />
        <text
          x={W / 2}
          y={250}
          textAnchor="middle"
          fontFamily="Montserrat, Arial Black, sans-serif"
          fontWeight={900}
          fontSize={54}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={12}
          paintOrder="stroke"
        >
          TITLE SAFE ZONE
        </text>
        <text
          x={W / 2}
          y={H - 90}
          textAnchor="middle"
          fontFamily="Montserrat, Arial Black, sans-serif"
          fontWeight={900}
          fontSize={44}
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth={11}
          paintOrder="stroke"
        >
          {LABELS[section]}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
