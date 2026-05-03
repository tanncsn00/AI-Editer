import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { OrthographicCamera } from "@react-three/drei";
import { type Tracking } from "./fx/PoseAttachedFX";
import tracking from "./human_vfx_poc_tracking.json";
import * as THREE from "three";

const T = tracking as Tracking;

const FXLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(T.frames.length - 1, Math.round(t * T.fps));
  const f = T.frames[idx];
  if (!f?.landmarks?.length) return null;

  const W = T.width, H = T.height;
  const toWorld = (x: number, y: number, z = 0): [number, number, number] => [
    (x - 0.5) * W, -(y - 0.5) * H, z,
  ];

  const pick = (n: string) => f.landmarks.find((l: any) => l.name === n);
  const wL = pick("left_wrist");
  const wR = pick("right_wrist");
  const aL = pick("left_ankle");
  const aR = pick("right_ankle");

  const flicker = 1 + Math.sin(frame * 0.7) * 0.18 + Math.sin(frame * 0.31) * 0.1;
  const orbit = frame * 0.12;

  const FirePalm = ({ pos, hue = "#FF6A1A", core = "#FFD06A" }: { pos: [number, number, number]; hue?: string; core?: string }) => (
    <group position={pos}>
      {/* outer flame halo */}
      <mesh>
        <sphereGeometry args={[120 * flicker, 24, 24]} />
        <meshBasicMaterial color={hue} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* mid */}
      <mesh>
        <sphereGeometry args={[75 * flicker, 24, 24]} />
        <meshBasicMaterial color={hue} transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* hot core */}
      <mesh>
        <sphereGeometry args={[38 * flicker, 20, 20]} />
        <meshBasicMaterial color={core} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* orbit sparks */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = orbit + (i / 5) * Math.PI * 2;
        const r = 90 + Math.sin(frame * 0.3 + i) * 18;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]}>
            <sphereGeometry args={[10, 8, 8]} />
            <meshBasicMaterial color="#FFE066" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );

  const FootGlow = ({ pos }: { pos: [number, number, number] }) => (
    <mesh position={pos}>
      <sphereGeometry args={[50, 18, 18]} />
      <meshBasicMaterial color="#9DD7FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );

  return (
    <>
      {wL && wL.visibility > 0.4 && <FirePalm pos={toWorld(wL.x, wL.y)} />}
      {wR && wR.visibility > 0.4 && <FirePalm pos={toWorld(wR.x, wR.y)} hue="#FF3D0A" core="#FFC04A" />}
      {aL && aL.visibility > 0.4 && <FootGlow pos={toWorld(aL.x, aL.y)} />}
      {aR && aR.visibility > 0.4 && <FootGlow pos={toWorld(aR.x, aR.y)} />}
    </>
  );
};

export const HumanVfxPoc: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile("human_vfx_poc/source.mp4")} muted />
    <ThreeCanvas
      width={T.width}
      height={T.height}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      gl={{ alpha: true }}
    >
      <OrthographicCamera
        makeDefault
        position={[0, 0, 100]}
        zoom={1}
        left={-T.width / 2}
        right={T.width / 2}
        top={T.height / 2}
        bottom={-T.height / 2}
        near={0.1}
        far={1000}
      />
      <ambientLight intensity={1} />
      <FXLayer />
    </ThreeCanvas>
  </AbsoluteFill>
);
