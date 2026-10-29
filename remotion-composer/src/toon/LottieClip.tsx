import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";

const cache = new Map<string, Promise<LottieAnimationData>>();

const load = (file: string) => {
  if (!cache.has(file)) cache.set(file, fetch(staticFile(file)).then((r) => r.json()));
  return cache.get(file)!;
};

export const LottieClip: React.FC<{ file: string; style?: React.CSSProperties; filter?: string; playbackRate?: number }> = ({ file, style, filter, playbackRate }) => {
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`lottie ${file}`));
  useEffect(() => {
    load(file)
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle]);
  return (
    <div style={{ ...style, filter }}>
      {data && <Lottie animationData={data} loop playbackRate={playbackRate} style={{ width: "100%", height: "100%" }} />}
    </div>
  );
};
