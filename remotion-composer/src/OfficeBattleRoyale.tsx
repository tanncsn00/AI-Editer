import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockyCam, BlockyChar, BlockySkin, FaceKind } from "./fx/BlockyRig";
import {
  BrownPuddle,
  Corridor,
  Cup,
  ImpactStar,
  Laptop,
  OfficeChair,
  PoopBurst,
  Sign,
  Sparkle,
  Sweat,
  WallClock,
} from "./fx/OfficeProps";
import { Door, StinkCloud, StinkLines } from "./fx/BlockyProps";

const W = 1080;
const H = 1920;
export const OBR_DURATION = 1650;

const CUT = [0, 90, 180, 300, 420, 540, 660, 780, 900, 1020, 1110, 1200, 1320, 1440, 1560, 1650];

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ip = (f: number, a: number, b: number, c: number, d: number) =>
  interpolate(f, [a, b], [c, d], clamp);
const prog = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
const shake = (f: number, amt: number) => [
  Math.sin(f * 2.9) * amt,
  Math.cos(f * 3.7) * amt * 0.7,
];
const walk = (f: number, sp = 0.42, amp = 0.85) => ({
  legLPitch: Math.sin(f * sp) * amp,
  legRPitch: -Math.sin(f * sp) * amp,
  armLPitch: -Math.sin(f * sp) * amp * 0.7,
  armRPitch: Math.sin(f * sp) * amp * 0.7,
  bodyY: Math.abs(Math.sin(f * sp)) * 0.16,
});

const A_SKIN: BlockySkin = { skin: "#E8B98A", shirt: "#3E6FB5", pants: "#2E3A59" };
const A_DIRTY: BlockySkin = { ...A_SKIN, pants: "#5A3A1C" };
const BOSS: BlockySkin = { skin: "#D9A066", shirt: "#F2EFE6", pants: "#33383E", vest: "#8B1E2D" };
const JUMPER: BlockySkin = { skin: "#C98F5E", shirt: "#7BC043", pants: "#3A4A2E" };
const EXITER: BlockySkin = { skin: "#B87A4E", shirt: "#E8543F", pants: "#4A3B2E" };

const EMP: BlockySkin[] = [
  { skin: "#E8B98A", shirt: "#E0574A", pants: "#3A3F45" },
  { skin: "#C98F5E", shirt: "#4FA3D1", pants: "#2E3A59" },
  { skin: "#F0C89A", shirt: "#F2E27A", pants: "#5A6169" },
  { skin: "#A9713F", shirt: "#7BC043", pants: "#33383E" },
  { skin: "#D9A066", shirt: "#C79BE0", pants: "#3E4A5B" },
  { skin: "#E8B98A", shirt: "#F2EFE6", pants: "#22262B" },
  { skin: "#B87A4E", shirt: "#FF8C42", pants: "#3A4A2E" },
];

const DOOR_Z = -40;
const QUEUE = Array.from({ length: 30 }).map((_, i) => ({
  z: DOOR_Z + 5 + i * 1.9,
  x: -2.9 + (((i * 7) % 5) - 2) * 0.34,
  skin: EMP[i % EMP.length],
  yaw: Math.PI + (((i * 13) % 7) - 3) * 0.05,
  bob: (i % 6) * 1.7,
}));

const Lights: React.FC = () => (
  <>
    <ambientLight intensity={0.92} />
    <directionalLight position={[8, 20, 14]} intensity={0.62} />
    <directionalLight position={[-10, 10, -6]} intensity={0.26} />
  </>
);

const Hall: React.FC<{ doorAngle?: number; lightOff?: boolean }> = ({
  doorAngle = 0,
  lightOff = false,
}) => (
  <group>
    <Corridor w={14} len={100} h={11} />
    <Door position={[0, 0, DOOR_Z + 0.2]} angle={doorAngle} color={lightOff ? "#4A3320" : "#8B5A2B"} />
    <Sign position={[0, 8.4, DOOR_Z + 0.1]} w={3.6} h={1.2} color="#2E7D5B" />
    <mesh position={[0, 3.2, DOOR_Z - 0.4]}>
      <planeGeometry args={[5, 7]} />
      <meshLambertMaterial color={lightOff ? "#14110C" : "#FFF3C4"} />
    </mesh>
  </group>
);

const Queue: React.FC<{
  frame: number;
  n: number;
  offset?: number;
  faces?: FaceKind;
  backStep?: number;
  turned?: boolean;
}> = ({ frame, n, offset = 0, faces = "neutral", backStep = 0, turned = false }) => (
  <group>
    {QUEUE.slice(0, n).map((q, i) => (
      <BlockyChar
        key={i}
        skin={q.skin}
        face={faces}
        position={[q.x, 0, q.z + offset + backStep]}
        pose={{
          bodyYaw: turned ? q.yaw + Math.PI : q.yaw,
          bodyY: Math.sin(frame * 0.06 + q.bob) * 0.07,
          headYaw: Math.sin(frame * 0.03 + i) * 0.12,
          armLPitch: 0.06,
          armRPitch: 0.06,
        }}
      />
    ))}
  </group>
);

const Shot1: React.FC<{ f: number }> = ({ f }) => {
  const drop = prog(f, 46, 66);
  const zoom = prog(f, 62, 88);
  const camZ = ip(zoom, 0, 1, 32, 12.5);
  const fov = ip(zoom, 0, 1, 56, 26);
  const walkP = f < 40 ? walk(f) : {};
  const ax = 3.4;
  const az = f < 40 ? ip(f, 0, 40, 17, 9.5) : 9.5;
  return (
    <group>
      <BlockyCam
        pos={[4.4, ip(zoom, 0, 1, 8.8, 5.4), camZ]}
        look={[ip(zoom, 0, 1, -0.6, 3.2), ip(zoom, 0, 1, 3.0, 4.6), ip(zoom, 0, 1, -10, 6)]}
        fov={fov}
      />
      <Lights />
      <Hall />
      <Queue frame={f} n={28} />
      <BlockyChar
        skin={A_SKIN}
        face={f < 44 ? "neutral" : "shock"}
        position={[ax, 0, az]}
        pose={{
          bodyYaw: -0.5,
          headYaw: f < 44 ? 0 : -0.5,
          ...walkP,
          armRPitch: f < 46 ? -0.9 : ip(drop, 0, 1, -0.9, 0.3),
          armLPitch: f < 46 ? 0.1 : 0.25,
          squash: f > 44 ? 1 + Math.sin(f * 0.9) * 0.03 : 1,
        }}
      />
      <Laptop
        position={[ax + 1.5, ip(drop, 0, 1, 3.6, 0.14), az + 0.4]}
        rotation={[ip(drop, 0, 1, 0, 1.5), -0.5, ip(drop, 0, 1, 0, 0.7)]}
      />
    </group>
  );
};

const Shot2: React.FC<{ f: number }> = ({ f }) => {
  const beat = Math.floor(prog(f, 24, 62) * 4);
  const onFace = beat === 1 || beat === 3;
  const late = f > 62;
  const tremor = late ? Math.sin(f * 1.9) * 0.1 : 0;
  if (f < 24) {
    return (
      <group>
        <BlockyCam pos={[-3.6, 7.4, -19.6]} look={[6.75, 7.4, -19.6]} fov={40} />
        <Lights />
        <Hall />
        <WallClock position={[6.75, 7.4, -19.6]} rotation={[0, -Math.PI / 2, 0]} hour={11} minute={58} scale={1.15} />
      </group>
    );
  }
  if (onFace || late) {
    return (
      <group>
        <BlockyCam pos={[1.9 + tremor, 5.3, 8.0]} look={[1.9, 4.7, 4.5]} fov={30} />
        <Lights />
        <Hall />
        <BlockyChar
          skin={A_SKIN}
          face={late ? "strain" : "shock"}
          position={[1.9, 0, 4.5]}
          pose={{
            bodyYaw: -0.15,
            headYaw: beat === 1 ? -0.3 : 0.2,
            bodyLean: late ? 0.22 : 0,
            armLPitch: late ? -1.5 : 0.1,
            armLRoll: late ? 0.9 : 0,
            armRPitch: late ? -1.1 : 0.1,
            armRRoll: late ? -1.2 : 0,
            legLPitch: late ? Math.sin(f * 2.4) * 0.18 : 0,
            legRPitch: late ? -Math.sin(f * 2.4) * 0.18 : 0,
            bodyY: late ? Math.abs(Math.sin(f * 2.4)) * 0.1 : 0,
          }}
        />
      </group>
    );
  }
  return (
    <group>
      <BlockyCam pos={[2.6, 5.6, DOOR_Z + 22]} look={[-1.6, 3.6, DOOR_Z + 6]} fov={40} />
      <Lights />
      <Hall />
      <Queue frame={f} n={6} />
    </group>
  );
};

const Shot3: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, 0, 112);
  const camZ = ip(p, 0, 1, -32, 34);
  const fov = ip(p, 0, 1, 34, 62);
  const n = Math.round(ip(p, 0, 1, 2, 30));
  return (
    <group>
      <BlockyCam pos={[8.2, ip(p, 0, 1, 5.0, 9.4), camZ]} look={[0, 3.4, camZ - 12]} fov={fov} />
      <Lights />
      <Hall />
      <Queue frame={f} n={n} />
      <BlockyChar
        skin={EMP[2]}
        face="grin"
        position={[QUEUE[8].x, 5.6, QUEUE[8].z]}
        pose={{ bodyYaw: Math.PI, armLPitch: -2.4, armRPitch: -2.4, bodyY: Math.sin(f * 0.1) * 0.1 }}
      />
      <OfficeChair position={[QUEUE[14].x + 1.9, 0, QUEUE[14].z]} rotation={[0, 0.4, 0]} />
      <BlockyChar
        skin={EMP[4]}
        face="neutral"
        position={[QUEUE[14].x + 1.9, 1.5, QUEUE[14].z]}
        pose={{ bodyYaw: Math.PI + 0.4, legLPitch: -1.5, legRPitch: -1.5, armLPitch: -0.3, armRPitch: -0.3 }}
      />
      <BlockyChar
        skin={EMP[6]}
        face="dead"
        position={[QUEUE[20].x - 2.2, 0.1, QUEUE[20].z]}
        pose={{ bodyRoll: 1.5, bodyYaw: 0.4, bodyY: 0.9, armLPitch: -0.8, armRPitch: 0.8 }}
      />
      <BlockyChar
        skin={A_SKIN}
        face={p > 0.6 ? "despair" : "shock"}
        position={[3.4, 0, 30]}
        pose={{ bodyYaw: Math.PI, headYaw: 0.2, bodyLean: 0.18, armLPitch: -1.3, armLRoll: 0.9, armRPitch: -1.0, armRRoll: -1.0 }}
      />
    </group>
  );
};

const Shot4: React.FC<{ f: number }> = ({ f }) => {
  const clockPhase = f < 26;
  const sweat = prog(f, 40, 118);
  const boom = f > 74;
  const kick = boom ? Math.sin(f * 1.55) : 0;
  const [sx, sy] = shake(f, boom ? 0.24 : 0.05);
  if (clockPhase) {
    return (
      <group>
        <BlockyCam pos={[-1.6, 7.4, -19.6]} look={[6.75, 7.4, -19.6]} fov={40} />
        <Lights />
        <Hall />
        <WallClock position={[6.75, 7.4, -19.6]} rotation={[0, -Math.PI / 2, 0]} hour={11} minute={59} scale={1.15} />
      </group>
    );
  }
  return (
    <group>
      <BlockyCam pos={[1.9 + sx, 5.4 + sy, 7.4]} look={[1.9, 4.4, 4.5]} fov={30} />
      <Lights />
      <Hall />
      <BlockyChar
        skin={A_SKIN}
        face="strain"
        position={[1.9, 0, 4.5]}
        pose={{
          bodyYaw: -0.1,
          bodyLean: 0.1 + kick * 0.05,
          legLPitch: 0.04,
          legRPitch: -0.04,
          armLPitch: -1.55,
          armLRoll: 1.1,
          armRPitch: -1.5,
          armRRoll: -1.15,
          headPitch: boom ? 0.42 : 0.1,
          squash: 1 + kick * 0.09,
          bodyY: Math.abs(kick) * 0.12,
        }}
      />
      {sweat > 0 ? (
        <Sweat frame={f} origin={[1.9, 6.6, 4.7]} count={Math.round(4 + sweat * 14)} power={0.5 + sweat * 1.9} />
      ) : null}
      {boom ? <StinkLines frame={f} origin={[1.9, 3.4, 5.0]} /> : null}
    </group>
  );
};

const Shot5: React.FC<{ f: number }> = ({ f }) => {
  const sneak = prog(f, 6, 44);
  const turn = prog(f, 44, 60);
  const grab = prog(f, 62, 72);
  const yank = prog(f, 72, 88);
  const point = f > 92;
  const jz = ip(sneak, 0, 1, 9.0, 1.4) + ip(yank, 0, 1, 0, 6.4);
  const [sx] = shake(f, grab > 0 && yank < 1 ? 0.3 : 0);
  return (
    <group>
      <BlockyCam pos={[9.0 + sx, 6.6, 18.5]} look={[0.2, 3.9, 4.2]} fov={40} />
      <Lights />
      <Hall />
      <Queue frame={f} n={10} turned={f > 88} />
      <BlockyChar
        skin={A_SKIN}
        face={turn > 0.5 ? "rage" : "strain"}
        position={[1.9, 0, 4.5]}
        pose={{
          bodyYaw: ip(turn, 0, 1, -0.1, Math.PI * 0.92),
          headYaw: ip(turn, 0, 1, 0, 0.5),
          armLPitch: -1.5,
          armLRoll: 1.1,
          armRPitch: point ? -1.9 : ip(grab, 0, 1, -1.4, -2.2),
          armRRoll: point ? -0.5 : ip(grab, 0, 1, -1.1, -0.15),
          bodyLean: 0.1,
        }}
      />
      <BlockyChar
        skin={JUMPER}
        face={grab > 0.4 ? "shock" : "smug"}
        position={[-1.6, 0, jz]}
        pose={{
          bodyYaw: Math.PI + (grab > 0.4 ? 0.6 : 0),
          headYaw: sneak < 0.9 ? Math.sin(f * 0.22) * 0.6 : 0,
          bodyLean: grab > 0.4 ? -0.35 : 0.2,
          ...(sneak < 0.95 ? walk(f, 0.3, 0.6) : {}),
          armLPitch: grab > 0.4 ? -2.3 : 0.3,
          armRPitch: grab > 0.4 ? -2.3 : 0.3,
          bodyY: yank > 0 ? Math.sin(yank * Math.PI) * 0.8 : 0,
          bodyRoll: yank * 0.5,
        }}
      />
      {grab > 0.3 && yank < 0.6 ? <ImpactStar position={[0.2, 5.4, 3.2]} scale={0.8} /> : null}
    </group>
  );
};

const Shot6: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, 6, 34);
  const out = prog(f, 26, 70);
  const turn = prog(f, 40, 78);
  const hope = f > 84;
  return (
    <group>
      {f < 62 ? (
        <BlockyCam pos={[3.4, 6.4, DOOR_Z + 26]} look={[-0.6, 3.6, DOOR_Z + 4]} fov={48} />
      ) : (
        <BlockyCam pos={[3.4, 5.4, 12.5]} look={[1.9, 4.6, 4.5]} fov={34} />
      )}
      <Lights />
      <Hall doorAngle={open * 1.5} />
      <Queue frame={f} n={14} turned={turn > 0.4} />
      <BlockyChar
        skin={EXITER}
        face="grin"
        position={[0.4, 0, ip(out, 0, 1, DOOR_Z + 3, DOOR_Z + 11)]}
        pose={{ bodyYaw: 0, ...walk(f, 0.24, 0.6) }}
      />
      <BlockyChar
        skin={A_SKIN}
        face={hope ? "hope" : "strain"}
        position={[1.9, 0, 4.5]}
        pose={{
          bodyYaw: Math.PI * 0.02,
          headPitch: -0.12,
          armLPitch: -1.5,
          armLRoll: 1.1,
          armRPitch: -1.45,
          armRRoll: -1.1,
          bodyY: hope ? Math.abs(Math.sin(f * 0.5)) * 0.2 : 0,
        }}
      />
      {hope ? <Sparkle frame={f} origin={[1.9, 6.4, 5.2]} r={1.9} /> : null}
    </group>
  );
};

const Shot7: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, 0, 108);
  const [sx, sy] = shake(f, 0.5);
  const clash = f > 96;
  const rush = (i: number) => ip(p, 0, 1, QUEUE[i].z, DOOR_Z + 6 + (i % 4) * 1.2);
  return (
    <group>
      <BlockyCam pos={[1.5 + sx, 9.0 + sy, ip(p, 0, 1, 16, 2)]} look={[0, 3.0, -26]} fov={66} />
      <Lights />
      <Hall doorAngle={1.5} />
      {QUEUE.slice(0, 16).map((q, i) => (
        <BlockyChar
          key={i}
          skin={q.skin}
          face={i % 3 === 0 ? "rage" : "shock"}
          position={[q.x * 2.4, 0, rush(i)]}
          pose={{ bodyYaw: Math.PI, bodyLean: 0.4, ...walk(f + i * 3, 0.9, 1.5) }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <OfficeChair
          key={"c" + i}
          position={[(i - 1.5) * 3.2, 2 + Math.sin(f * 0.14 + i) * 2.6, ip(p, 0, 1, 6 - i * 4, -18 - i * 3)]}
          rotation={[f * 0.14 + i, f * 0.1, f * 0.08]}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Cup
          key={"u" + i}
          position={[(i - 1) * 4.4, 4 + Math.sin(f * 0.2 + i) * 2.2, ip(p, 0, 1, 2 - i * 5, -22 - i * 4)]}
          scale={1.6}
        />
      ))}
      <Laptop
        position={[-3.4, 5 + Math.sin(f * 0.17) * 2.4, ip(p, 0, 1, 4, -20)]}
        rotation={[f * 0.16, f * 0.11, 0.4]}
      />
      <BlockyChar
        skin={A_SKIN}
        face="rage"
        position={[1.4, 0, clash ? DOOR_Z + 8.6 : ip(p, 0, 1, 6, DOOR_Z + 9)]}
        pose={{
          bodyYaw: Math.PI,
          bodyLean: 1.2,
          bodyY: Math.abs(Math.sin(f * 0.85)) * 0.3,
          armLPitch: -2.6 + Math.sin(f * 0.85) * 0.8,
          armRPitch: -2.6 - Math.sin(f * 0.85) * 0.8,
          legLPitch: Math.sin(f * 0.85) * 1.3,
          legRPitch: -Math.sin(f * 0.85) * 1.3,
        }}
      />
      <BlockyChar
        skin={EMP[3]}
        face="rage"
        position={[-1.2, 0, clash ? DOOR_Z + 8.6 : ip(p, 0, 1, 2, DOOR_Z + 9)]}
        pose={{ bodyYaw: Math.PI, bodyLean: 1.1, ...walk(f + 5, 0.9, 1.5) }}
      />
      {clash ? <ImpactStar position={[0.1, 5.4, DOOR_Z + 8.6]} scale={1.5} color="#FF4D5E" /> : null}
    </group>
  );
};

const Shot8: React.FC<{ f: number }> = ({ f }) => {
  const fly = prog(f, 0, 26);
  const land = f > 26;
  const [sx, sy] = shake(f, land && f < 40 ? 0.6 : 0.05);
  const z = ip(fly, 0, 1, DOOR_Z + 8.6, DOOR_Z + 17);
  const y = land ? 0 : Math.sin(fly * Math.PI) * 3.4;
  return (
    <group>
      <BlockyCam pos={[6.4 + sx, 4.6 + sy, DOOR_Z + 29]} look={[1.0, 1.9, DOOR_Z + 14]} fov={48} />
      <Lights />
      <Hall doorAngle={1.5} />
      <Queue frame={f} n={6} offset={-16} turned />
      <group position={[1.2, y + (land ? 1.05 : 2.6), z]} rotation={[land ? -Math.PI / 2 : -fly * 2.2, 0.2, 0]}>
        <BlockyChar
          skin={A_SKIN}
          face={land ? "dead" : "shock"}
          position={[0, -2.6, 0]}
          pose={{
            legLPitch: land ? -1.2 : -0.4,
            legRPitch: land ? -1.4 : 0.4,
            armLPitch: land ? -2.2 : -2.6,
            armLRoll: land ? 0.8 : 0,
            armRPitch: land ? -2.2 : -2.6,
            armRRoll: land ? -0.8 : 0,
          }}
        />
      </group>
      {land && f < 44 ? <ImpactStar position={[1.2, 0.9, z]} scale={1.7} color="#FFE45C" /> : null}
    </group>
  );
};

const Shot9: React.FC<{ f: number }> = ({ f }) => {
  const p = prog(f, 4, 110);
  const z = ip(p, 0, 1, DOOR_Z + 16, DOOR_Z + 3.4);
  const crawl = Math.sin(f * 0.5);
  return (
    <group>
      <BlockyCam pos={[5.0, 3.4, z + 12]} look={[1.0, 1.2, z - 3]} fov={44} />
      <Lights />
      <Hall />
      <group position={[1.0, 1.15, z]} rotation={[-1.32, 0.06, 0]}>
        <BlockyChar
          skin={A_SKIN}
          face="despair"
          position={[0, -2.6, 0]}
          pose={{
            armLPitch: -2.5 + crawl * 0.9,
            armLRoll: 0.5,
            armRPitch: -1.4,
            armRRoll: -0.9,
            legLPitch: -0.5 + crawl * 0.5,
            legRPitch: -0.5 - crawl * 0.5,
            bodyRoll: crawl * 0.12,
          }}
        />
      </group>
      <Sweat frame={f} origin={[1.0, 2.6, z + 0.6]} count={10} power={1.5} />
    </group>
  );
};

const Shot10: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, 6, 30);
  const freeze = f > 58;
  const [sx] = shake(f, freeze ? 0.16 : 0);
  return (
    <group>
      <BlockyCam pos={[5.0 + sx, 3.4, DOOR_Z + 15.6]} look={[1.0, 1.2, DOOR_Z + 0.6]} fov={44} />
      <Lights />
      <Hall doorAngle={open * 1.5} />
      <mesh position={[0, 3.0, DOOR_Z - 0.2]}>
        <planeGeometry args={[5.4, 7.4]} />
        <meshLambertMaterial color="#FFF9DC" />
      </mesh>
      <group position={[1.0, 1.15, DOOR_Z + 3.6]} rotation={[-1.32, 0.06, 0]}>
        <BlockyChar
          skin={A_SKIN}
          face={freeze ? "shock" : "hope"}
          position={[0, -2.6, 0]}
          pose={{
            armLPitch: freeze ? -2.9 : -2.6,
            armLRoll: 0.4,
            armRPitch: -1.3,
            armRRoll: -0.9,
            legLPitch: -0.5,
            legRPitch: -0.6,
          }}
        />
      </group>
      {!freeze ? <Sparkle frame={f} origin={[1.0, 2.8, DOOR_Z + 4.4]} r={1.5} /> : null}
    </group>
  );
};

const Shot11: React.FC<{ f: number }> = ({ f }) => {
  const burst = f > 10;
  const bf = f - 10;
  const look = prog(f, 52, 88);
  const [sx, sy] = shake(f, burst && bf < 20 ? 0.5 : 0.04);
  return (
    <group>
      <BlockyCam pos={[3.2 + sx, 4.6 + sy, DOOR_Z + 13]} look={[0.9, 3.0, DOOR_Z + 3.6]} fov={40} />
      <Lights />
      <Hall doorAngle={1.5} />
      <BlockyChar
        skin={burst ? A_DIRTY : A_SKIN}
        face={burst ? "blank" : "shock"}
        position={[1.0, 0, DOOR_Z + 4.2]}
        pose={{
          bodyYaw: -0.25,
          headYaw: look > 0.33 ? (look > 0.66 ? 0.7 : -0.7) : 0,
          headPitch: look > 0 && look < 0.33 ? 0.5 : 0,
          armLPitch: 0.24,
          armRPitch: 0.24,
          legLPitch: 0.05,
          legRPitch: -0.05,
          squash: burst && bf < 12 ? 1 - Math.sin(bf * 0.5) * 0.12 : 1,
        }}
      />
      {burst ? (
        <>
          <PoopBurst frame={bf} origin={[1.0, 1.9, DOOR_Z + 3.4]} power={1.5} count={30} />
          <BrownPuddle position={[1.0, 0.04, DOOR_Z + 2.6]} r={Math.min(2.4, bf * 0.09)} />
          <StinkCloud
            frame={bf}
            origin={[1.0, 1.4, DOOR_Z + 3.2]}
            count={22}
            spread={2.0}
            rise={5.4}
            scale={1.5}
            intensity={1}
          />
          <StinkLines frame={bf} origin={[1.0, 3.0, DOOR_Z + 3.4]} />
        </>
      ) : null}
    </group>
  );
};

const Shot12: React.FC<{ f: number }> = ({ f }) => {
  const back = ip(prog(f, 34, 112), 0, 1, 0, 15);
  const nose = f > 18;
  return (
    <group>
      <BlockyCam pos={[6.0, 6.4, DOOR_Z + 30]} look={[0.6, 3.2, DOOR_Z + 9]} fov={52} />
      <Lights />
      <Hall doorAngle={1.5} />
      <Queue frame={f * 0.2} n={16} offset={-4} backStep={back} turned />
      <BlockyChar
        skin={EMP[1]}
        face="shock"
        position={[-2.6, 0, DOOR_Z + 9 + back * 0.6]}
        pose={{
          bodyYaw: 0.2,
          armLPitch: nose ? -2.5 : 0.1,
          armLRoll: nose ? 0.7 : 0,
          armRPitch: 0.1,
        }}
      />
      <BlockyChar
        skin={A_DIRTY}
        face="blank"
        position={[1.0, 0, DOOR_Z + 4.2]}
        pose={{ bodyYaw: -0.25, armLPitch: 0.24, armRPitch: 0.24 }}
      />
      <BrownPuddle position={[1.0, 0.04, DOOR_Z + 2.6]} r={2.4} />
      <StinkCloud frame={f} origin={[1.0, 1.4, DOOR_Z + 3.2]} count={20} spread={2.2} rise={5.6} scale={1.5} />
    </group>
  );
};

const Shot13: React.FC<{ f: number }> = ({ f }) => {
  const pointA = f > 10 && f < 46;
  const pointDoor = f >= 46 && f < 78;
  const close = prog(f, 78, 108);
  const off = f > 100;
  return (
    <group>
      <BlockyCam pos={[5.0, 6.0, DOOR_Z + 26]} look={[0.4, 4.2, DOOR_Z + 4]} fov={48} />
      <Lights />
      <Hall doorAngle={(1 - close) * 1.5} lightOff={off} />
      <Queue frame={f * 0.2} n={12} offset={10} turned />
      <BlockyChar
        skin={EMP[1]}
        face="angry"
        position={[-2.6, 0, DOOR_Z + 12]}
        pose={{
          bodyYaw: pointDoor ? Math.PI * 0.98 : 0.3,
          armRPitch: -1.75,
          armRRoll: pointA ? -0.5 : -0.05,
          headYaw: pointDoor ? 0.3 : -0.2,
        }}
      />
      <BlockyChar
        skin={A_DIRTY}
        face="blank"
        position={[1.0, 0, DOOR_Z + 4.2]}
        pose={{ bodyYaw: -0.25, headPitch: 0.28, armLPitch: 0.24, armRPitch: 0.24 }}
      />
      <BrownPuddle position={[1.0, 0.04, DOOR_Z + 2.6]} r={2.4} />
      <StinkCloud frame={f} origin={[1.0, 1.4, DOOR_Z + 3.2]} count={16} spread={2.2} rise={5.2} scale={1.4} />
    </group>
  );
};

const Shot14: React.FC<{ f: number }> = ({ f }) => {
  const walkIn = prog(f, 0, 34);
  const stare = f >= 34 && f < 86;
  const turn = prog(f, 86, 98);
  const run = prog(f, 98, 120);
  const bz = ip(walkIn, 0, 1, DOOR_Z + 30, DOOR_Z + 13) + ip(run, 0, 1, 0, 20);
  return (
    <group>
      <BlockyCam pos={[5.6, 5.6, DOOR_Z + 30]} look={[0.6, 3.6, DOOR_Z + 8]} fov={46} />
      <Lights />
      <Hall lightOff />
      <BlockyChar
        skin={BOSS}
        face={stare ? "shock" : run > 0 ? "despair" : "neutral"}
        position={[-2.4, 0, bz]}
        pose={{
          bodyYaw: ip(turn, 0, 1, Math.PI, 0),
          bodyLean: run > 0 ? 0.5 : 0,
          headPitch: stare && f > 60 ? 0.35 : 0,
          ...(walkIn < 1 || run > 0 ? walk(f, run > 0 ? 0.95 : 0.3, run > 0 ? 1.5 : 0.7) : {}),
        }}
      />
      <BlockyChar
        skin={A_DIRTY}
        face="blank"
        position={[1.0, 0, DOOR_Z + 4.2]}
        pose={{ bodyYaw: -0.5, headYaw: -0.4, headPitch: f > 110 ? 0.5 : 0.15, armLPitch: 0.24, armRPitch: 0.24 }}
      />
      <BrownPuddle position={[1.0, 0.04, DOOR_Z + 2.6]} r={2.4} />
      <StinkCloud frame={f} origin={[1.0, 1.4, DOOR_Z + 3.2]} count={16} spread={2.2} rise={5.2} scale={1.4} />
    </group>
  );
};

const Shot15: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, 10, 34);
  const zoom = prog(f, 42, 66);
  const camZ = ip(zoom, 0, 1, DOOR_Z + 16, DOOR_Z + 7.2);
  const fov = ip(zoom, 0, 1, 42, 20);
  return (
    <group>
      <BlockyCam pos={[2.6, ip(zoom, 0, 1, 5.2, 4.9), camZ]} look={[1.0, 4.4, DOOR_Z + 4]} fov={fov} />
      <Lights />
      <Hall doorAngle={open * 1.5} />
      {open > 0.7 ? (
        <BlockyChar
          skin={EMP[5]}
          face="neutral"
          position={[0.2, 0, DOOR_Z - 1.6]}
          pose={{ bodyYaw: 0.1, armLPitch: 0.08, armRPitch: 0.08 }}
        />
      ) : null}
      <BlockyChar
        skin={A_DIRTY}
        face="dead"
        position={[1.0, 0, DOOR_Z + 4.2]}
        pose={{ bodyYaw: -0.4, headYaw: -0.35, armLPitch: 0.2, armRPitch: 0.2 }}
      />
      <BrownPuddle position={[1.0, 0.04, DOOR_Z + 2.6]} r={2.4} />
      <StinkCloud frame={f} origin={[1.0, 1.4, DOOR_Z + 3.2]} count={14} spread={2.0} rise={4.8} scale={1.3} />
    </group>
  );
};

const SHOTS: Array<React.FC<{ f: number }>> = [
  Shot1, Shot2, Shot3, Shot4, Shot5, Shot6, Shot7, Shot8,
  Shot9, Shot10, Shot11, Shot12, Shot13, Shot14, Shot15,
];

const Card: React.FC<{ text: string; y: number; size?: number; fill?: string }> = ({
  text,
  y,
  size = 92,
  fill = "#FFFFFF",
}) => (
  <text
    x={W / 2}
    y={y}
    textAnchor="middle"
    fontFamily="Montserrat, Arial Black, sans-serif"
    fontWeight={900}
    fontSize={size}
    fill={fill}
    stroke="#000000"
    strokeWidth={Math.round(size * 0.19)}
    paintOrder="stroke"
  >
    {text}
  </text>
);

const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const hp = f >= 830 && f < 1020;
  const hpBlink = Math.sin(f * 0.55) > -0.2;
  const black = f >= 1608;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {f >= 96 && f < 176 ? <Card text="11:58" y={330} size={130} fill="#FFD400" /> : null}
        {f >= 306 && f < 386 ? <Card text="11:59" y={330} size={130} fill="#FF4D5E" /> : null}
        {f >= 196 && f < 216 ? <Card text="1 người" y={300} size={86} /> : null}
        {f >= 216 && f < 238 ? <Card text="3 người" y={300} size={92} /> : null}
        {f >= 238 && f < 258 ? <Card text="7 người" y={300} size={100} /> : null}
        {f >= 258 && f < 276 ? <Card text="15 người" y={300} size={110} fill="#FFD400" /> : null}
        {f >= 276 && f < 292 ? <Card text="20 người" y={300} size={120} fill="#FF8C42" /> : null}
        {f >= 292 && f < 300 ? <Card text="30 NGƯỜI" y={300} size={136} fill="#FF4D5E" /> : null}
        {f >= 930 && f < 950 ? <Card text="2m" y={1560} size={104} /> : null}
        {f >= 950 && f < 972 ? <Card text="1m" y={1560} size={110} /> : null}
        {f >= 972 && f < 992 ? <Card text="50cm" y={1560} size={116} fill="#FFD400" /> : null}
        {f >= 992 && f < 1006 ? <Card text="30cm" y={1560} size={122} fill="#FF8C42" /> : null}
        {f >= 1006 && f < 1020 ? <Card text="10cm" y={1560} size={130} fill="#FF4D5E" /> : null}
        {f >= 1122 && f < 1180 ? <Card text="PFFFFT" y={520} size={150} fill="#8B5A2B" /> : null}
        {hp ? (
          <g opacity={hpBlink ? 1 : 0.25}>
            <rect x={W / 2 - 250} y={1180} width={500} height={54} rx={10} fill="#000000" opacity={0.75} />
            <rect x={W / 2 - 242} y={1188} width={16} height={38} rx={4} fill="#FF2A2A" />
            <text
              x={W / 2}
              y={1224}
              textAnchor="middle"
              fontFamily="Montserrat, Arial Black, sans-serif"
              fontWeight={900}
              fontSize={40}
              fill="#FFFFFF"
            >
              HP 1%
            </text>
          </g>
        ) : null}
      </svg>
      {black ? (
        <AbsoluteFill style={{ background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
          <div
            style={{
              fontFamily: "Montserrat, Arial Black, sans-serif",
              fontWeight: 900,
              fontSize: 84,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.16,
            }}
          >
            11:59 AM
            <div style={{ color: "#FF4D5E", fontSize: 96 }}>OFFICE BATTLE ROYALE</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const OfficeBattleRoyale: React.FC<{ sfx?: boolean }> = ({ sfx = true }) => {
  const frame = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < CUT.length - 1; i++) {
    if (frame >= CUT[i] && frame < CUT[i + 1]) idx = i;
  }
  const Shot = SHOTS[idx];
  const f = frame - CUT[idx];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0C10" }}>
      <ThreeCanvas width={W} height={H} camera={{ position: [0, 4, 14], fov: 40 }} gl={{ antialias: true }}>
        <Shot f={f} />
      </ThreeCanvas>
      <Overlay />
      {sfx ? <Audio src={staticFile("obr/sfx.mp3")} /> : null}
    </AbsoluteFill>
  );
};
