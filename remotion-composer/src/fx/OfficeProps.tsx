import React from "react";

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

export const Corridor: React.FC<{
  w?: number;
  len?: number;
  h?: number;
  floor?: string;
  wall?: string;
  ceiling?: string;
}> = ({
  w = 14,
  len = 90,
  h = 11,
  floor = "#B9AE97",
  wall = "#D9D2C4",
  ceiling = "#F2EFE6",
}) => (
  <group>
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, len]} />
      <meshLambertMaterial color={floor} />
    </mesh>
    <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, len]} />
      <meshLambertMaterial color={ceiling} />
    </mesh>
    <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[len, h]} />
      <meshLambertMaterial color={wall} />
    </mesh>
    <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[len, h]} />
      <meshLambertMaterial color={wall} />
    </mesh>
    <mesh position={[0, h / 2, -len / 2]}>
      <planeGeometry args={[w, h]} />
      <meshLambertMaterial color={wall} />
    </mesh>
    {Array.from({ length: Math.floor(len / 12) }).map((_, i) => (
      <Box
        key={i}
        size={[3.2, 0.2, 1.1]}
        position={[0, h - 0.12, len / 2 - 8 - i * 12]}
        color="#FFF6D8"
      />
    ))}
    {Array.from({ length: Math.floor(len / 10) }).map((_, i) => (
      <group key={"sk" + i}>
        <Box size={[0.18, 0.7, 9.6]} position={[-w / 2 + 0.1, 0.35, len / 2 - 5 - i * 10]} color="#8E8474" />
        <Box size={[0.18, 0.7, 9.6]} position={[w / 2 - 0.1, 0.35, len / 2 - 5 - i * 10]} color="#8E8474" />
      </group>
    ))}
  </group>
);

export const WallClock: React.FC<{
  position: [number, number, number];
  hour: number;
  minute: number;
  scale?: number;
  rotation?: [number, number, number];
}> = ({ position, hour, minute, scale = 1, rotation = [0, 0, 0] }) => {
  const hAng = ((hour % 12) + minute / 60) * 30 * (Math.PI / 180);
  const mAng = minute * 6 * (Math.PI / 180);
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.22, 24]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}>
        <cylinderGeometry args={[1.62, 1.62, 0.2, 24]} />
        <meshLambertMaterial color="#1F2226" />
      </mesh>
      {[0, 3, 6, 9].map((t) => {
        const a = t * 30 * (Math.PI / 180);
        return (
          <Box
            key={t}
            size={[0.14, 0.32, 0.05]}
            position={[Math.sin(a) * 1.16, Math.cos(a) * 1.16, 0.13]}
            color="#1F2226"
          />
        );
      })}
      <group rotation={[0, 0, -hAng]} position={[0, 0, 0.15]}>
        <Box size={[0.16, 0.86, 0.05]} position={[0, 0.43, 0]} color="#1F2226" />
      </group>
      <group rotation={[0, 0, -mAng]} position={[0, 0, 0.18]}>
        <Box size={[0.12, 1.2, 0.05]} position={[0, 0.6, 0]} color="#D22B2B" />
      </group>
      <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.06, 12]} />
        <meshLambertMaterial color="#1F2226" />
      </mesh>
    </group>
  );
};

export const Laptop: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  lid?: number;
  scale?: number;
}> = ({ position, rotation = [0, 0, 0], lid = 1.15, scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Box size={[1.9, 0.12, 1.3]} color="#5A6169" />
    <group position={[0, 0.06, -0.62]} rotation={[-lid, 0, 0]}>
      <Box size={[1.9, 1.25, 0.1]} position={[0, 0.62, 0]} color="#5A6169" />
      <Box size={[1.66, 1.0, 0.04]} position={[0, 0.62, 0.07]} color="#7FC7E8" />
    </group>
  </group>
);

export const OfficeChair: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}> = ({ position, rotation = [0, 0, 0], color = "#33383E" }) => (
  <group position={position} rotation={rotation}>
    <Box size={[1.7, 0.28, 1.7]} position={[0, 1.5, 0]} color={color} />
    <Box size={[1.7, 1.9, 0.26]} position={[0, 2.5, -0.72]} color={color} />
    <Box size={[0.24, 1.4, 0.24]} position={[0, 0.7, 0]} color="#22262B" />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2;
      return (
        <Box
          key={i}
          size={[0.2, 0.16, 1.5]}
          position={[Math.sin(a) * 0.6, 0.14, Math.cos(a) * 0.6]}
          rotation={[0, a, 0]}
          color="#22262B"
        />
      );
    })}
  </group>
);

export const Cup: React.FC<{
  position: [number, number, number];
  color?: string;
  scale?: number;
}> = ({ position, color = "#E8543F", scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh rotation={[0, 0, 0]}>
      <cylinderGeometry args={[0.34, 0.28, 0.8, 12]} />
      <meshLambertMaterial color={color} />
    </mesh>
    <Box size={[0.12, 0.34, 0.12]} position={[0.4, 0.05, 0]} color={color} />
  </group>
);

export const Sign: React.FC<{
  position: [number, number, number];
  w?: number;
  h?: number;
  color?: string;
}> = ({ position, w = 3.4, h = 1.1, color = "#2E7D5B" }) => (
  <group position={position}>
    <Box size={[w, h, 0.16]} color={color} />
    <Box size={[w - 0.28, h - 0.28, 0.06]} position={[0, 0, 0.1]} color="#FFFFFF" />
  </group>
);

export const Sweat: React.FC<{
  frame: number;
  origin: [number, number, number];
  count?: number;
  power?: number;
}> = ({ frame, origin, count = 10, power = 1 }) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const seed = i * 2.399963;
      const phase = ((frame * 0.05 + i / count) % 1 + 1) % 1;
      const dir = Math.cos(seed) > 0 ? 1 : -1;
      const x = dir * (0.6 + phase * 2.6 * power);
      const y = Math.sin(phase * Math.PI) * 1.5 * power - phase * 0.6;
      const z = Math.sin(seed) * 0.5;
      return (
        <mesh key={i} position={[x, y, z]} scale={0.9 - phase * 0.4}>
          <boxGeometry args={[0.2, 0.32, 0.2]} />
          <meshLambertMaterial color="#8FD4FF" transparent opacity={Math.max(0, 1 - phase)} />
        </mesh>
      );
    })}
  </group>
);

export const Sparkle: React.FC<{
  frame: number;
  origin: [number, number, number];
  count?: number;
  r?: number;
}> = ({ frame, origin, count = 8, r = 1.8 }) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2 + frame * 0.04;
      const pulse = 0.6 + Math.sin(frame * 0.22 + i) * 0.4;
      return (
        <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.6, 0.4]} scale={pulse}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshLambertMaterial color="#FFE45C" />
        </mesh>
      );
    })}
  </group>
);

export const PoopBurst: React.FC<{
  frame: number;
  origin: [number, number, number];
  power?: number;
  count?: number;
}> = ({ frame, origin, power = 1, count = 26 }) => (
  <group position={origin}>
    {Array.from({ length: count }).map((_, i) => {
      const seed = i * 2.399963;
      const phase = Math.min(1, frame / 26 + (i % 5) * 0.04);
      const ang = seed;
      const spread = 1.1 + (i % 4) * 0.5;
      const x = Math.cos(ang) * spread * phase * 2.2 * power;
      const z = -Math.abs(Math.sin(ang)) * spread * phase * 2.6 * power - phase * 1.4;
      const y = Math.sin(phase * Math.PI) * 2.1 * power - phase * phase * 2.0;
      const sc = (0.34 + (i % 3) * 0.16) * (1.15 - phase * 0.3);
      return (
        <mesh key={i} position={[x, Math.max(0.12, y), z]} rotation={[seed, seed * 1.7, 0]} scale={sc}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={i % 4 === 0 ? "#4E3218" : "#6B4423"} />
        </mesh>
      );
    })}
  </group>
);

export const BrownPuddle: React.FC<{
  position: [number, number, number];
  r: number;
}> = ({ position, r }) => (
  <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
    <circleGeometry args={[r, 18]} />
    <meshLambertMaterial color="#5A3A1C" />
  </mesh>
);

export const ImpactStar: React.FC<{
  position: [number, number, number];
  scale?: number;
  color?: string;
}> = ({ position, scale = 1, color = "#FFE45C" }) => (
  <group position={position} scale={scale}>
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <Box
          key={i}
          size={[0.34, 1.7, 0.34]}
          position={[Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0]}
          rotation={[0, 0, -a + Math.PI / 2]}
          color={color}
        />
      );
    })}
  </group>
);
