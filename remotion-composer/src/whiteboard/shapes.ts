export const BG = "#0B0A12";
export const INK = "#F2ECE0";
export const RED = "#FF4D5E";
export const GOLD = "#E5B54C";
export const JADE = "#4FD1A5";
export const AMBER = "#FF9F45";
export const BLUE = "#7FB2FF";
export const GREY = "#A79FB8";
export const YELLOW = "#F2C14E";
export const SKY = "#6EC1FF";

export type Sh =
  | { k: "c"; x: number; y: number; d: number; col?: string; fill?: string }
  | { k: "e"; x: number; y: number; w: number; h: number; col?: string; fill?: string }
  | { k: "r"; x: number; y: number; w: number; h: number; col?: string; fill?: string }
  | { k: "l"; x1: number; y1: number; x2: number; y2: number; col?: string }
  | { k: "p"; d: string; col?: string; fill?: string }
  | { k: "t"; x: number; y: number; size: number; text: string; col?: string }
  | { k: "a"; name: string; x: number; y: number; h: number; col?: string };
type Look = { col?: string; fill?: string };

export type Mark = Sh[] | "box" | "banner";
export type Scene = Record<number, Mark>;
export type Scenes = Record<string, Scene>;

export const C = (x: number, y: number, d: number, o: Look = {}): Sh => ({ k: "c", x, y, d, ...o });
export const E = (x: number, y: number, w: number, h: number, o: Look = {}): Sh => ({ k: "e", x, y, w, h, ...o });
export const R = (x: number, y: number, w: number, h: number, o: Look = {}): Sh => ({ k: "r", x, y, w, h, ...o });
export const L = (x1: number, y1: number, x2: number, y2: number, col?: string): Sh => ({ k: "l", x1, y1, x2, y2, col });
export const P = (d: string, o: Look = {}): Sh => ({ k: "p", d, ...o });
export const T = (x: number, y: number, size: number, text: string, col?: string): Sh => ({ k: "t", x, y, size, text, col });
export const A = (name: string, x: number, y: number, h: number, col?: string): Sh => ({ k: "a", name, x, y, h, col });

export const movePath = (d: string, dx: number, dy: number, s: number) =>
  d.replace(/(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (_, a, b) => `${(+a * s + dx).toFixed(1)},${(+b * s + dy).toFixed(1)}`);

export const place = (shapes: Sh[], dx: number, dy: number, s = 1): Sh[] =>
  shapes.map((sh) => {
    switch (sh.k) {
      case "c":
        return { ...sh, x: sh.x * s + dx, y: sh.y * s + dy, d: sh.d * s };
      case "e":
      case "r":
        return { ...sh, x: sh.x * s + dx, y: sh.y * s + dy, w: sh.w * s, h: sh.h * s };
      case "l":
        return { ...sh, x1: sh.x1 * s + dx, y1: sh.y1 * s + dy, x2: sh.x2 * s + dx, y2: sh.y2 * s + dy };
      case "p":
        return { ...sh, d: movePath(sh.d, dx, dy, s) };
      case "t":
        return { ...sh, x: sh.x * s + dx, y: sh.y * s + dy, size: sh.size * s };
      case "a":
        return { ...sh, x: sh.x * s + dx, y: sh.y * s + dy, h: sh.h * s };
    }
  });

export const tint = (shapes: Sh[], col: string): Sh[] => shapes.map((sh) => ({ ...sh, col: sh.col ?? col }));

export const polar = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r];

export const bubble = (w: number, h: number, text: string, size: number, col?: string): Sh[] => [
  R(-w / 2, -h / 2, w, h),
  P(`M${-w / 4},${h / 2} L${-w / 4 - 22},${h / 2 + 34} L${-w / 4 + 22},${h / 2}`),
  T(0, 0, size, text, col),
];

export const stairs = (): Sh[] => [P("M-250,120 L-250,80 L-150,80 L-150,40 L-50,40 L-50,0 L50,0 L50,-40 L150,-40 L150,-80 L250,-80 L250,120 Z")];

export const summon = (): Sh[] => {
  const runes: Sh[] = [];
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = polar(188, (i * Math.PI) / 4);
    const [x2, y2] = polar(200, (i * Math.PI) / 4 + 0.08);
    runes.push(L(x1, y1, x2, y2));
  }
  return tint([C(0, 0, 420), C(0, 0, 370), ...runes], RED);
};

export const sparkle = (col = YELLOW): Sh[] => [P("M0,-30 L8,-8 L30,0 L8,8 L0,30 L-8,8 L-30,0 L-8,-8 Z", { col: GOLD, fill: col })];

export const burst = (text: string): Sh[] => {
  const pts: string[] = [];
  for (let i = 0; i < 14; i++) {
    const [x, y] = polar(i % 2 ? 82 : 150, (i * Math.PI) / 7);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return [P(pts.join(" ") + " Z", { col: RED, fill: YELLOW }), T(0, 4, 70, text, RED)];
};

export const followButton = (): Sh[] => [R(-190, -52, 380, 104, { col: RED }), T(0, 0, 64, "FOLLOW", RED), P("M150,30 L150,110 L172,90 L190,124 L204,118 L186,84 L214,82 Z")];

export const speed = (): Sh[] => tint([L(-60, -30, -150, -30), L(-60, 0, -170, 0), L(-60, 30, -140, 30)], GREY);

export const cross = (): Sh[] => tint([L(-60, -60, 60, 60), L(60, -60, -60, 60)], RED);
