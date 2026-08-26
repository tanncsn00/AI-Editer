import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export const BlockyCam: React.FC<{
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
}> = ({ pos, look, fov = 38 }) => {
  const { camera } = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.lookAt(new THREE.Vector3(look[0], look[1], look[2]));
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};

export const HEAD = 1.6;
export const TORSO_W = 2.0;
export const TORSO_H = 2.0;
export const TORSO_D = 1.0;
export const LIMB = 0.9;
export const ARM_H = 2.0;
export const LEG_H = 2.0;

export const HIP_Y = LEG_H;
export const SHOULDER_Y = LEG_H + TORSO_H;
export const SHOULDER_X = TORSO_W / 2 + LIMB / 2;
export const HIP_X = LIMB / 2 + 0.06;

export type FaceKind =
  | "neutral"
  | "angry"
  | "shock"
  | "smug"
  | "dead"
  | "grin"
  | "despair"
  | "hope"
  | "rage"
  | "blank"
  | "strain";

export type EarKind = "none" | "wolf" | "round";
export type HairKind = "none" | "long";

export type BlockySkin = {
  skin: string;
  shirt: string;
  pants: string;
  hair?: string;
  hairKind?: HairKind;
  earKind?: EarKind;
  muzzle?: string;
  bow?: string;
  vest?: string;
};

export type BlockyPose = {
  bodyY?: number;
  bodyYaw?: number;
  bodyLean?: number;
  bodyRoll?: number;
  headYaw?: number;
  headPitch?: number;
  armLPitch?: number;
  armLRoll?: number;
  armRPitch?: number;
  armRRoll?: number;
  legLPitch?: number;
  legRPitch?: number;
  squash?: number;
};

const Box: React.FC<{
  size: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}> = ({ size, position, rotation, color }) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={size} />
    <meshLambertMaterial color={color} />
  </mesh>
);

const FACE_Z = HEAD / 2 + 0.015;
const EYE_Y = HEAD * 0.62;
const EYE_X = HEAD * 0.24;

const Face: React.FC<{ kind: FaceKind; mouthY?: number; mouthZ?: number }> = ({
  kind,
  mouthY,
  mouthZ,
}) => {
  const dark = "#1A1A1A";
  const white = "#FFFFFF";
  const my = (d: number) => mouthY ?? d;
  const mz = mouthZ ?? FACE_Z;

  if (kind === "smug") {
    return (
      <group>
        <Box size={[HEAD * 0.78, 0.24, 0.06]} position={[0, EYE_Y, FACE_Z]} color={dark} />
        <Box size={[HEAD * 0.3, 0.1, 0.05]} position={[0, my(HEAD * 0.3), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "dead") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.34, 0.09, 0.05]} rotation={[0, 0, Math.PI / 4]} color={dark} />
            <Box size={[0.34, 0.09, 0.05]} rotation={[0, 0, -Math.PI / 4]} color={dark} />
          </group>
        ))}
        <Box size={[0.36, 0.14, 0.05]} position={[0, my(HEAD * 0.28), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "shock") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.34, 0.42, 0.04]} color={white} />
            <Box size={[0.17, 0.2, 0.05]} position={[0, 0, 0.02]} color={dark} />
          </group>
        ))}
        <Box size={[0.42, 0.44, 0.05]} position={[0, my(HEAD * 0.24), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "angry") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x, i) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.3, 0.22, 0.04]} color={white} />
            <Box size={[0.15, 0.15, 0.05]} position={[0, -0.02, 0.02]} color={dark} />
            <Box
              size={[0.38, 0.12, 0.05]}
              position={[0, 0.2, 0.03]}
              rotation={[0, 0, i === 0 ? -0.42 : 0.42]}
              color={dark}
            />
          </group>
        ))}
        <Box size={[0.34, 0.1, 0.05]} position={[0, my(HEAD * 0.28), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "grin") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <Box key={x} size={[0.16, 0.24, 0.05]} position={[x, EYE_Y, FACE_Z]} color={dark} />
        ))}
        <Box size={[0.62, 0.26, 0.05]} position={[0, my(HEAD * 0.26), mz]} color={dark} />
        <Box size={[0.56, 0.1, 0.06]} position={[0, my(HEAD * 0.26) + 0.07, mz + 0.01]} color={white} />
      </group>
    );
  }

  if (kind === "despair") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x, i) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.32, 0.4, 0.04]} color={white} />
            <Box size={[0.16, 0.16, 0.05]} position={[0, 0.09, 0.02]} color={dark} />
            <Box
              size={[0.36, 0.1, 0.05]}
              position={[0, 0.24, 0.03]}
              rotation={[0, 0, i === 0 ? 0.4 : -0.4]}
              color={dark}
            />
          </group>
        ))}
        <Box size={[0.42, 0.16, 0.05]} position={[0, my(HEAD * 0.24), mz]} color={dark} />
        <Box size={[0.42, 0.08, 0.06]} position={[0, my(HEAD * 0.24) - 0.07, mz + 0.01]} color={white} />
      </group>
    );
  }

  if (kind === "hope") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.38, 0.46, 0.04]} color={white} />
            <Box size={[0.24, 0.3, 0.05]} position={[0, -0.02, 0.02]} color={dark} />
            <Box size={[0.1, 0.12, 0.06]} position={[-0.06, 0.08, 0.04]} color={white} />
          </group>
        ))}
        <Box size={[0.4, 0.14, 0.05]} position={[0, my(HEAD * 0.26), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "rage") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x, i) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.34, 0.28, 0.04]} color="#FF2A2A" />
            <Box size={[0.15, 0.15, 0.05]} position={[0, -0.02, 0.02]} color={dark} />
            <Box
              size={[0.44, 0.14, 0.05]}
              position={[0, 0.22, 0.03]}
              rotation={[0, 0, i === 0 ? -0.52 : 0.52]}
              color={dark}
            />
          </group>
        ))}
        <Box size={[0.62, 0.24, 0.05]} position={[0, my(HEAD * 0.24), mz]} color={dark} />
        <Box size={[0.56, 0.06, 0.06]} position={[0, my(HEAD * 0.24), mz + 0.01]} color={white} />
      </group>
    );
  }

  if (kind === "blank") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <Box key={x} size={[0.3, 0.07, 0.05]} position={[x, EYE_Y, FACE_Z]} color={dark} />
        ))}
        <Box size={[0.26, 0.06, 0.05]} position={[0, my(HEAD * 0.28), mz]} color={dark} />
      </group>
    );
  }

  if (kind === "strain") {
    return (
      <group>
        {[-EYE_X, EYE_X].map((x) => (
          <group key={x} position={[x, EYE_Y, FACE_Z]}>
            <Box size={[0.26, 0.09, 0.05]} rotation={[0, 0, 0.5]} position={[-0.08, 0, 0]} color={dark} />
            <Box size={[0.26, 0.09, 0.05]} rotation={[0, 0, -0.5]} position={[0.08, 0, 0]} color={dark} />
          </group>
        ))}
        <Box size={[0.5, 0.2, 0.05]} position={[0, my(HEAD * 0.26), mz]} color={dark} />
        <Box size={[0.44, 0.05, 0.06]} position={[0, my(HEAD * 0.26), mz + 0.01]} color={white} />
      </group>
    );
  }

  return (
    <group>
      {[-EYE_X, EYE_X].map((x) => (
        <Box key={x} size={[0.17, 0.26, 0.05]} position={[x, EYE_Y, FACE_Z]} color={dark} />
      ))}
      <Box size={[0.3, 0.09, 0.05]} position={[0, my(HEAD * 0.3), mz]} color={dark} />
    </group>
  );
};

const Ears: React.FC<{ kind: EarKind; color: string }> = ({ kind, color }) => {
  if (kind === "none") return null;
  const y = HEAD + 0.16;
  const x = HEAD * 0.3;
  if (kind === "wolf") {
    return (
      <group>
        {[-x, x].map((px, i) => (
          <Box
            key={px}
            size={[0.4, 0.6, 0.28]}
            position={[px, y, 0]}
            rotation={[0, 0, i === 0 ? 0.22 : -0.22]}
            color={color}
          />
        ))}
      </group>
    );
  }
  return (
    <group>
      {[-x, x].map((px) => (
        <Box key={px} size={[0.42, 0.42, 0.24]} position={[px, y, 0]} color={color} />
      ))}
    </group>
  );
};

const Hair: React.FC<{ kind: HairKind; color: string; bow?: string }> = ({
  kind,
  color,
  bow,
}) => {
  if (kind === "none") return null;
  return (
    <group>
      <Box size={[HEAD + 0.14, 0.42, HEAD + 0.14]} position={[0, HEAD - 0.1, 0]} color={color} />
      <Box size={[HEAD + 0.14, HEAD * 0.9, 0.34]} position={[0, HEAD * 0.5, -HEAD / 2 - 0.1]} color={color} />
      {[-1, 1].map((s) => (
        <Box
          key={s}
          size={[0.3, HEAD * 0.78, HEAD * 0.62]}
          position={[s * (HEAD / 2 + 0.06), HEAD * 0.52, -0.12]}
          color={color}
        />
      ))}
      {bow ? (
        <group position={[HEAD * 0.16, HEAD + 0.24, 0.1]}>
          <Box size={[0.7, 0.34, 0.3]} color={bow} />
          <Box size={[0.24, 0.24, 0.32]} color="#FFFFFF" />
        </group>
      ) : null}
    </group>
  );
};

export const BlockyChar: React.FC<{
  skin: BlockySkin;
  pose?: BlockyPose;
  face?: FaceKind;
  position?: [number, number, number];
  scale?: number;
}> = ({ skin, pose = {}, face = "neutral", position = [0, 0, 0], scale = 1 }) => {
  const {
    bodyY = 0,
    bodyYaw = 0,
    bodyLean = 0,
    bodyRoll = 0,
    headYaw = 0,
    headPitch = 0,
    armLPitch = 0,
    armLRoll = 0,
    armRPitch = 0,
    armRRoll = 0,
    legLPitch = 0,
    legRPitch = 0,
    squash = 1,
  } = pose;

  const stretch = squash === 0 ? 1 : 1 / Math.sqrt(squash);

  return (
    <group position={position} scale={scale}>
      <group position={[0, bodyY, 0]} rotation={[bodyLean, bodyYaw, bodyRoll]} scale={[stretch, squash, stretch]}>
        <group position={[-HIP_X, HIP_Y, 0]} rotation={[legLPitch, 0, 0]}>
          <Box size={[LIMB, LEG_H, LIMB]} position={[0, -LEG_H / 2, 0]} color={skin.pants} />
        </group>
        <group position={[HIP_X, HIP_Y, 0]} rotation={[legRPitch, 0, 0]}>
          <Box size={[LIMB, LEG_H, LIMB]} position={[0, -LEG_H / 2, 0]} color={skin.pants} />
        </group>

        <Box
          size={[TORSO_W, TORSO_H, TORSO_D]}
          position={[0, HIP_Y + TORSO_H / 2, 0]}
          color={skin.shirt}
        />
        {skin.vest ? (
          <group>
            <Box
              size={[TORSO_W * 0.36, TORSO_H * 0.94, TORSO_D + 0.12]}
              position={[-TORSO_W * 0.32, HIP_Y + TORSO_H / 2, 0]}
              color={skin.vest}
            />
            <Box
              size={[TORSO_W * 0.36, TORSO_H * 0.94, TORSO_D + 0.12]}
              position={[TORSO_W * 0.32, HIP_Y + TORSO_H / 2, 0]}
              color={skin.vest}
            />
            <Box
              size={[0.22, TORSO_H * 0.62, 0.1]}
              position={[0, HIP_Y + TORSO_H * 0.62, TORSO_D / 2 + 0.09]}
              color="#111111"
            />
          </group>
        ) : null}

        <group position={[-SHOULDER_X, SHOULDER_Y, 0]} rotation={[armLPitch, 0, armLRoll]}>
          <Box size={[LIMB, ARM_H, LIMB]} position={[0, -ARM_H / 2, 0]} color={skin.skin} />
        </group>
        <group position={[SHOULDER_X, SHOULDER_Y, 0]} rotation={[armRPitch, 0, armRRoll]}>
          <Box size={[LIMB, ARM_H, LIMB]} position={[0, -ARM_H / 2, 0]} color={skin.skin} />
        </group>

        <group position={[0, SHOULDER_Y, 0]} rotation={[headPitch, headYaw, 0]}>
          <Box size={[HEAD, HEAD, HEAD]} position={[0, HEAD / 2, 0]} color={skin.skin} />
          {skin.muzzle ? (
            <Box
              size={[HEAD * 0.46, HEAD * 0.3, 0.34]}
              position={[0, HEAD * 0.32, HEAD / 2 + 0.14]}
              color={skin.muzzle}
            />
          ) : null}
          <Face
            kind={face}
            mouthY={skin.muzzle ? HEAD * 0.32 : undefined}
            mouthZ={skin.muzzle ? HEAD / 2 + 0.33 : undefined}
          />
          <Ears kind={skin.earKind ?? "none"} color={skin.skin} />
          <Hair kind={skin.hairKind ?? "none"} color={skin.hair ?? "#F5D000"} bow={skin.bow} />
        </group>
      </group>
    </group>
  );
};

export const WOLF: BlockySkin = {
  skin: "#9AA0A6",
  shirt: "#9AA0A6",
  pants: "#7C8288",
  earKind: "wolf",
  muzzle: "#B7BDC2",
};

export const GIRL: BlockySkin = {
  skin: "#C9A9D6",
  shirt: "#C79BE0",
  pants: "#FF3FA4",
  hair: "#F5D000",
  hairKind: "long",
  bow: "#FF2E8B",
};

export const BEAVER: BlockySkin = {
  skin: "#C4622B",
  shirt: "#FFFFFF",
  pants: "#C4622B",
  earKind: "round",
  muzzle: "#F2E27A",
  vest: "#16181C",
};
