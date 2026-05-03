import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { OrthographicCamera } from "@react-three/drei";
import { type Tracking } from "./fx/PoseAttachedFX";
import tracking from "./alan_vfx_poc_tracking.json";
import * as THREE from "three";

const T = tracking as Tracking;

const FXOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(T.frames.length - 1, Math.round(t * T.fps));
  const f = T.frames[idx];
  if (!f?.landmarks?.length) return null;

  const W = T.width, H = T.height;

  // 2D screen coords → ortho world (-W/2..W/2, -H/2..H/2)
  const toWorld = (x: number, y: number): [number, number, number] => [
    (x - 0.5) * W,
    -(y - 0.5) * H,
    0,
  ];

  const wristL = f.landmarks.find((l: any) => l.name === "left_wrist");
  const wristR = f.landmarks.find((l: any) => l.name === "right_wrist");
  const nose = f.landmarks.find((l: any) => l.name === "nose");

  const flicker = 1 + Math.sin(frame * 0.6) * 0.2;

  return (
    <>
      {wristL && wristL.visibility > 0.3 && (
        <mesh position={toWorld(wristL.x, wristL.y)}>
          <sphereGeometry args={[80 * flicker, 24, 24]} />
          <meshBasicMaterial color="#FF7A1A" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {wristR && wristR.visibility > 0.3 && (
        <mesh position={toWorld(wristR.x, wristR.y)}>
          <sphereGeometry args={[80 * flicker, 24, 24]} />
          <meshBasicMaterial color="#FF4D00" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {nose && nose.visibility > 0.3 && (
        <mesh position={toWorld(nose.x, nose.y)}>
          <sphereGeometry args={[40, 18, 18]} />
          <meshBasicMaterial color="#9DD7FF" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </>
  );
};

export const AlanVfxPoc: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile("alan_vfx_poc/source.mp4")} muted={false} />
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
      <FXOverlay />
    </ThreeCanvas>
  </AbsoluteFill>
);
