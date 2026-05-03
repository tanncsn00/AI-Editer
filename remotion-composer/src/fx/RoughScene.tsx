/**
 * RoughScene — render an array of primitives (path / ellipse / rect /
 * line / circle) through rough.js so everything comes out with a
 * hand-drawn wobble, like Camiks.
 *
 * Usage: <RoughScene viewBox="0 0 1080 1920" items={[...]} seedBase={2} />
 */

import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { useCurrentFrame } from "remotion";

export type RoughItem =
  | { kind: "path"; d: string; fill?: string; stroke?: string; strokeWidth?: number; roughness?: number; bowing?: number; fillStyle?: string; hachureGap?: number; hachureAngle?: number; }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill?: string; stroke?: string; strokeWidth?: number; roughness?: number; bowing?: number; fillStyle?: string; hachureGap?: number; hachureAngle?: number; }
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; strokeWidth?: number; roughness?: number; bowing?: number; fillStyle?: string; hachureGap?: number; }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke?: string; strokeWidth?: number; roughness?: number; bowing?: number; }
  | { kind: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; strokeWidth?: number; roughness?: number; bowing?: number; fillStyle?: string; };

export const RoughScene: React.FC<{
  viewBox: string;
  items: RoughItem[];
  seedBase?: number;
  shakePerFrame?: number; // shift seed every N frames (paper flicker)
}> = ({ viewBox, items, seedBase = 1, shakePerFrame = 0 }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const frame = useCurrentFrame();
  const seed = seedBase + (shakePerFrame > 0 ? Math.floor(frame / shakePerFrame) : 0);

  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg as unknown as SVGSVGElement);

    items.forEach((it, i) => {
      const itemSeed = seed + i * 7;
      const common = {
        roughness: it.roughness ?? 1.6,
        bowing: it.bowing ?? 1.2,
        seed: itemSeed,
      };
      let node: SVGGElement | null = null;
      if (it.kind === "path") {
        node = rc.path(it.d, {
          ...common,
          stroke: it.stroke ?? "none",
          strokeWidth: it.strokeWidth ?? 0,
          fill: it.fill ?? "none",
          fillStyle: it.fillStyle ?? "solid",
          hachureGap: it.hachureGap,
          hachureAngle: it.hachureAngle,
        });
      } else if (it.kind === "ellipse") {
        node = rc.ellipse(it.cx, it.cy, it.rx * 2, it.ry * 2, {
          ...common,
          stroke: it.stroke ?? "none",
          strokeWidth: it.strokeWidth ?? 0,
          fill: it.fill ?? "none",
          fillStyle: it.fillStyle ?? "solid",
          hachureGap: it.hachureGap,
          hachureAngle: it.hachureAngle,
        });
      } else if (it.kind === "rect") {
        node = rc.rectangle(it.x, it.y, it.w, it.h, {
          ...common,
          stroke: it.stroke ?? "none",
          strokeWidth: it.strokeWidth ?? 0,
          fill: it.fill ?? "none",
          fillStyle: it.fillStyle ?? "solid",
          hachureGap: it.hachureGap,
        });
      } else if (it.kind === "line") {
        node = rc.line(it.x1, it.y1, it.x2, it.y2, {
          ...common,
          stroke: it.stroke ?? "#000",
          strokeWidth: it.strokeWidth ?? 2,
        });
      } else if (it.kind === "circle") {
        node = rc.circle(it.cx, it.cy, it.r * 2, {
          ...common,
          stroke: it.stroke ?? "none",
          strokeWidth: it.strokeWidth ?? 0,
          fill: it.fill ?? "none",
          fillStyle: it.fillStyle ?? "solid",
        });
      }
      if (node) svg.appendChild(node);
    });
  }, [items, seed]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
