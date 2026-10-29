import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";

const useLottie = (file: string) => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`load ${file}`));
  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle]);
  return data;
};

const Cell: React.FC<{ file: string; w: number; h: number; filter?: string }> = ({ file, w, h, filter }) => {
  const data = useLottie(file);
  return <div style={{ width: w, height: h, filter }}>{data && <Lottie animationData={data} style={{ width: w, height: h }} />}</div>;
};

export const LottieTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#8FD3F4", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    <Cell file="dog/angry-97495.json" w={540} h={958} />
    <Cell file="dog/excuse-me-97501.json" w={540} h={958} filter="hue-rotate(110deg) saturate(1.4)" />
    <Cell file="dog/very-sad-97546.json" w={540} h={958} />
    <Cell file="dog/hurt-97505.json" w={540} h={958} />
  </AbsoluteFill>
);
