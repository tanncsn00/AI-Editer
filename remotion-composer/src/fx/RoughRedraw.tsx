/**
 * RoughRedraw — read a traced-paths JSON and render each color layer with
 * Rough.js hand-drawn style, then overlay the outline path as a black stroke.
 *
 * The result is a fully-code, AI-free, hand-drawn look that preserves the
 * source photo's composition.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { staticFile, delayRender, continueRender, useCurrentFrame } from "remotion";
import rough from "roughjs";

type Layer = { name: string; fill?: string; rgb?: [number, number, number]; paths: string[] };
type Traced = { width: number; height: number; layers: Layer[]; outline: string[] };

export const RoughRedraw: React.FC<{
  jsonUrl: string;
  outlineColor?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  showFills?: boolean;
}> = ({
  jsonUrl,
  outlineColor = "#1A0F14",
  strokeWidth = 2.2,
  roughness = 1.8,
  bowing = 1.4,
  showFills = true,
}) => {
  const [data, setData] = useState<Traced | null>(null);
  const [handle] = useState(() => delayRender(`fetch ${jsonUrl}`));
  const svgRef = useRef<SVGSVGElement | null>(null);
  const frame = useCurrentFrame();
  // "Seed" shifts each few frames to simulate the hand-drawn paper flicker.
  const seed = Math.floor(frame / 6) + 1;

  useEffect(() => {
    fetch(jsonUrl)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [jsonUrl, handle]);

  // Build rendered Rough.js SVG nodes each time seed or data changes.
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = svgRef.current;
    // clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg as unknown as SVGSVGElement);

    if (showFills) {
      for (const layer of data.layers) {
        const fill = layer.fill ?? "#EDE0C0";
        for (const d of layer.paths) {
          const node = rc.path(d, {
            fill,
            fillStyle: "solid",
            stroke: "none",
            roughness: roughness * 0.6,
            bowing: bowing * 0.5,
            seed,
          });
          svg.appendChild(node);
        }
      }
    }

    // outline on top
    for (const d of data.outline) {
      const node = rc.path(d, {
        stroke: outlineColor,
        strokeWidth,
        roughness,
        bowing,
        fill: "none",
        seed,
      });
      svg.appendChild(node);
    }
  }, [data, seed, showFills, roughness, bowing, strokeWidth, outlineColor]);

  if (!data) return null;
  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${data.width} ${data.height}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
