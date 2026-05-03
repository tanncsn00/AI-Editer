/**
 * MultiCameraDirector — virtual cinematographer that lerps camera position,
 * lookAt target, and FOV between authored shots. Drop into a ThreeCanvas
 * to drive its perspective camera per Remotion frame.
 *
 * Usage:
 *   <ThreeCanvas camera={{position:[0,0,5]}}>
 *     <MultiCameraDirector shots={SHOTS} />
 *     ... scene ...
 *   </ThreeCanvas>
 */

import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

export type CameraShot = {
  /** Frame at which this shot starts (inclusive) */
  frame: number;
  pos: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));

const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export const MultiCameraDirector: React.FC<{ shots: CameraShot[] }> = ({ shots }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { camera, size } = useThree();

  // Find current and next shot
  let a = shots[0], b = shots[0];
  for (let i = 0; i < shots.length - 1; i++) {
    if (frame >= shots[i].frame && frame < shots[i + 1].frame) {
      a = shots[i];
      b = shots[i + 1];
      break;
    }
  }
  if (frame >= shots[shots.length - 1].frame) {
    a = b = shots[shots.length - 1];
  }
  const span = Math.max(1, b.frame - a.frame);
  const t = easeInOut((frame - a.frame) / span);

  const pos = lerp3(a.pos, b.pos, t);
  const look = lerp3(a.lookAt, b.lookAt, t);
  const fov = a.fov + (b.fov - a.fov) * t;

  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(look[0], look[1], look[2]);
  if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
    (camera as THREE.PerspectiveCamera).fov = fov;
    (camera as THREE.PerspectiveCamera).aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }

  return null;
};
