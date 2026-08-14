import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

type SfxProps = {
  name: string;
  at: number;
  volume?: number;
  trim?: number;
};

export const Sfx: React.FC<SfxProps> = ({ name, at, volume = 0.7, trim }) => {
  const { fps } = useVideoConfig();
  const from = Math.round(at * fps);
  const duration = trim ? Math.round(trim * fps) : undefined;
  return (
    <Sequence from={from} durationInFrames={duration}>
      <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
    </Sequence>
  );
};
