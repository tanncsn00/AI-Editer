import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { PeepActor } from "./PeepActor";
import { MouthCue } from "./Character";

export type DialogueLine = { t: string; start: number; end: number; speaker: string; mouth: MouthCue[] };

const SequenceOffset = React.createContext<number>(0);

export const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const { fps } = useVideoConfig();
  const start = Math.round(from * fps);
  return (
    <Sequence from={start} durationInFrames={Math.max(1, Math.round(to * fps) - start)} layout="none">
      <SequenceOffset.Provider value={start / fps}>{children}</SequenceOffset.Provider>
    </Sequence>
  );
};

export const useAbsoluteTime = () => {
  const { fps } = useVideoConfig();
  return useCurrentFrame() / fps + React.useContext(SequenceOffset);
};

export const Speaker: React.FC<Omit<React.ComponentProps<typeof PeepActor>, "line" | "time"> & { lines: DialogueLine[] }> = ({ lines, ...props }) => {
  const time = useAbsoluteTime();
  const line = lines.find((l) => time >= l.start - 0.05 && time <= l.end + 0.05);
  return <PeepActor {...props} line={line} time={time} />;
};
