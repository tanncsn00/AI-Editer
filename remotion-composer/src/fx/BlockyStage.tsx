import { HEAD, SHOULDER_Y } from "./BlockyRig";

export const CHAR_HEIGHT = SHOULDER_Y + HEAD;
export const ASPECT = 1080 / 1920;
export const TITLE_SAFE = 0.28;

export type Vec3 = [number, number, number];

export type Framing = {
  pos: Vec3;
  look: Vec3;
  fov: number;
  distance: number;
  visibleHeight: number;
};

export const frameSubject = ({
  subject,
  height = CHAR_HEIGHT,
  width,
  coverage = 0.55,
  azimuth = 0.35,
  elevation = 0.6,
  fov = 44,
  centerAt = TITLE_SAFE + (1 - TITLE_SAFE) / 2,
}: {
  subject: Vec3;
  height?: number;
  width?: number;
  coverage?: number;
  azimuth?: number;
  elevation?: number;
  fov?: number;
  centerAt?: number;
}): Framing => {
  const vhVertical = height / coverage;
  const vhHorizontal = width ? width / 0.85 / ASPECT : 0;
  const visibleHeight = Math.max(vhVertical, vhHorizontal);
  const distance = visibleHeight / (2 * Math.tan((fov * Math.PI) / 360));
  const centerY = subject[1] + height / 2;
  const lookY = centerY + (centerAt - 0.5) * visibleHeight;
  return {
    pos: [
      subject[0] + distance * Math.sin(azimuth),
      lookY + elevation,
      subject[2] + distance * Math.cos(azimuth),
    ],
    look: [subject[0], lookY, subject[2]],
    fov,
    distance,
    visibleHeight,
  };
};

export const centroid = (points: Vec3[]): Vec3 => [
  points.reduce((a, p) => a + p[0], 0) / points.length,
  points.reduce((a, p) => a + p[1], 0) / points.length,
  points.reduce((a, p) => a + p[2], 0) / points.length,
];

export const spreadX = (points: Vec3[], pad = 2.2) =>
  Math.max(...points.map((p) => p[0])) -
  Math.min(...points.map((p) => p[0])) +
  pad;

export const faceCamera = (char: Vec3, cam: Vec3, offset = 0) =>
  Math.atan2(cam[0] - char[0], cam[2] - char[2]) + offset;

export const tumble = ({
  position,
  height = CHAR_HEIGHT,
  pitch = 0,
  yaw = 0,
  roll = 0,
}: {
  position: Vec3;
  height?: number;
  pitch?: number;
  yaw?: number;
  roll?: number;
}) => ({
  group: {
    position: [position[0], position[1] + height / 2, position[2]] as Vec3,
    rotation: [pitch, yaw, roll] as Vec3,
  },
  child: [0, -height / 2, 0] as Vec3,
});
