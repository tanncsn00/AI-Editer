import React, { useMemo } from "react";
import * as THREE from "three";

export const useChecker = (a: string, b: string, rep: number) =>
  useMemo(() => {
    const ca = new THREE.Color(a);
    const cb = new THREE.Color(b);
    const px = (c: THREE.Color) => [c.r * 255, c.g * 255, c.b * 255, 255];
    const data = new Uint8Array([
      ...px(ca),
      ...px(cb),
      ...px(cb),
      ...px(ca),
    ]);
    const t = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep, rep);
    t.needsUpdate = true;
    return t;
  }, [a, b, rep]);

export const Room: React.FC<{
  w: number;
  d: number;
  h: number;
  floor: string;
  wall: string;
  tiled?: boolean;
}> = ({ w, d, h, floor, wall, tiled }) => {
  const tex = useChecker(floor, "#FFFFFF", 8);
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        {tiled ? (
          <meshLambertMaterial map={tex} />
        ) : (
          <meshLambertMaterial color={floor} />
        )}
      </mesh>
      <mesh position={[0, h / 2, -d / 2]}>
        <planeGeometry args={[w, h]} />
        <meshLambertMaterial color={wall} />
      </mesh>
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshLambertMaterial color={wall} />
      </mesh>
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshLambertMaterial color={wall} />
      </mesh>
      <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshLambertMaterial color="#F2EFE6" />
      </mesh>
    </group>
  );
};

export const Toilet: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  lidUp?: boolean;
  handlePull?: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], lidUp = true, handlePull = 0 }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1.15, 1.0, 1.35]} />
      <meshLambertMaterial color="#F7F7F4" />
    </mesh>
    <mesh position={[0, 1.02, 0]}>
      <boxGeometry args={[1.25, 0.16, 1.45]} />
      <meshLambertMaterial color="#EDEDE8" />
    </mesh>
    <mesh position={[0, 1.06, 0.04]}>
      <boxGeometry args={[0.82, 0.14, 0.95]} />
      <meshLambertMaterial color="#4A4A52" />
    </mesh>
    <mesh
      position={[0, lidUp ? 1.72 : 1.14, lidUp ? -0.72 : 0.02]}
      rotation={[lidUp ? -0.32 : 0, 0, 0]}
    >
      <boxGeometry args={[1.25, 0.14, 1.4]} />
      <meshLambertMaterial color="#EDEDE8" />
    </mesh>
    <mesh position={[0, 1.55, -0.86]}>
      <boxGeometry args={[1.3, 1.5, 0.55]} />
      <meshLambertMaterial color="#F7F7F4" />
    </mesh>
    <mesh position={[0.5, 2.05, -0.58]} rotation={[handlePull, 0, 0]}>
      <boxGeometry args={[0.34, 0.12, 0.3]} />
      <meshLambertMaterial color="#C9A227" />
    </mesh>
  </group>
);

export const Stall: React.FC<{
  position?: [number, number, number];
  doorAngle?: number;
  color?: string;
}> = ({ position = [0, 0, 0], doorAngle = 0, color = "#2E7D5B" }) => (
  <group position={position}>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 2.0, 2.4, -0.4]}>
        <boxGeometry args={[0.18, 4.2, 3.6]} />
        <meshLambertMaterial color={color} />
      </mesh>
    ))}
    <group position={[-1.9, 0, 1.4]} rotation={[0, doorAngle, 0]}>
      <mesh position={[1.85, 2.4, 0]}>
        <boxGeometry args={[3.7, 4.2, 0.18]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  </group>
);

export const Door: React.FC<{
  position?: [number, number, number];
  angle?: number;
  color?: string;
}> = ({ position = [0, 0, 0], angle = 0, color = "#8B5A2B" }) => (
  <group position={position}>
    <group rotation={[0, angle, 0]}>
      <mesh position={[1.5, 3.0, 0]}>
        <boxGeometry args={[3.0, 6.0, 0.22]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[2.7, 3.0, 0.2]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshLambertMaterial color="#C9A227" />
      </mesh>
    </group>
  </group>
);

export const Puff: React.FC<{
  position: [number, number, number];
  r: number;
  opacity: number;
  color?: string;
}> = ({ position, r, opacity, color = "#7BC043" }) => (
  <mesh position={position}>
    <icosahedronGeometry args={[r, 0]} />
    <meshLambertMaterial color={color} transparent opacity={opacity} />
  </mesh>
);

export const StinkCloud: React.FC<{
  frame: number;
  origin: [number, number, number];
  count?: number;
  spread?: number;
  rise?: number;
  scale?: number;
  intensity?: number;
}> = ({
  frame,
  origin,
  count = 14,
  spread = 1.6,
  rise = 3.4,
  scale = 1,
  intensity = 1,
}) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const seed = i * 2.399963;
      const phase = ((frame * 0.014 + i / count) % 1 + 1) % 1;
      const r = (0.42 + (i % 4) * 0.16) * scale * (0.55 + phase * 0.9);
      const ang = seed;
      const wob = Math.sin(frame * 0.09 + i) * 0.34;
      return (
        <Puff
          key={i}
          position={[
            Math.cos(ang) * spread * (0.3 + phase) + wob,
            phase * rise,
            Math.sin(ang) * spread * (0.3 + phase) * 0.7,
          ]}
          r={r}
          opacity={Math.min(0.72, (1 - phase) * 0.85 * intensity)}
          color={i % 3 === 0 ? "#9BD44F" : "#6FAF39"}
        />
      );
    })}
  </group>
);

export const Flies: React.FC<{
  frame: number;
  origin: [number, number, number];
  count?: number;
  radius?: number;
}> = ({ frame, origin, count = 7, radius = 1.5 }) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const sp = 0.16 + (i % 3) * 0.05;
      const t = frame * sp + i * 1.7;
      return (
        <mesh
          key={i}
          position={[
            Math.sin(t) * radius,
            Math.sin(t * 1.7 + i) * 0.6 + 0.9,
            Math.cos(t * 0.8 + i) * radius * 0.6,
          ]}
        >
          <boxGeometry args={[0.13, 0.09, 0.13]} />
          <meshLambertMaterial color="#141414" />
        </mesh>
      );
    })}
  </group>
);

export const StinkLines: React.FC<{ frame: number; origin: [number, number, number] }> = ({
  frame,
  origin,
}) => (
  <group position={origin}>
    {[-0.55, 0, 0.55].map((x, i) => {
      const t = ((frame * 0.03 + i * 0.33) % 1 + 1) % 1;
      return (
        <mesh key={x} position={[x + Math.sin(frame * 0.12 + i) * 0.2, t * 2.6, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshLambertMaterial color="#8FCB4A" transparent opacity={(1 - t) * 0.75} />
        </mesh>
      );
    })}
  </group>
);

export const Geyser: React.FC<{
  frame: number;
  origin: [number, number, number];
  power: number;
}> = ({ frame, origin, power }) => (
  <group position={origin}>
    <mesh position={[0, power * 3.2, 0]} scale={[1 + power * 0.5, Math.max(0.001, power * 6.4), 1 + power * 0.5]}>
      <boxGeometry args={[0.9, 1, 0.9]} />
      <meshLambertMaterial color="#BFE8FF" transparent opacity={0.85} />
    </mesh>
    {Array.from({ length: 22 }).map((_, i) => {
      const seed = i * 2.399963;
      const t = ((frame * 0.05 + i / 22) % 1 + 1) % 1;
      const spread = t * 4.2 * power;
      return (
        <mesh
          key={i}
          position={[
            Math.cos(seed) * spread,
            power * 6.5 * (1 - Math.pow(t * 2 - 1, 2)) + 0.5,
            Math.sin(seed) * spread,
          ]}
        >
          <boxGeometry args={[0.26, 0.26, 0.26]} />
          <meshLambertMaterial color="#DDF3FF" transparent opacity={power * (1 - t)} />
        </mesh>
      );
    })}
  </group>
);

export const Puddle: React.FC<{
  position: [number, number, number];
  r: number;
  color?: string;
}> = ({ position, r, color = "#7FB8D8" }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <circleGeometry args={[r, 12]} />
    <meshLambertMaterial color={color} transparent opacity={0.8} />
  </mesh>
);

export const Drips: React.FC<{
  frame: number;
  origin: [number, number, number];
  count?: number;
  color?: string;
}> = ({ frame, origin, count = 9, color = "#9BD44F" }) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const seed = i * 2.399963;
      const t = ((frame * 0.035 + i / count) % 1 + 1) % 1;
      return (
        <mesh
          key={i}
          position={[
            Math.cos(seed) * 1.1,
            2.6 - t * 3.4,
            Math.sin(seed) * 0.5 + 0.5,
          ]}
        >
          <boxGeometry args={[0.16, 0.42, 0.16]} />
          <meshLambertMaterial color={color} transparent opacity={0.9 - t * 0.5} />
        </mesh>
      );
    })}
  </group>
);
