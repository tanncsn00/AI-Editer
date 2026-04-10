import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface WordRevealCardProps {
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  wordsPerSecond?: number;
}

export const WordRevealCard: React.FC<WordRevealCardProps> = ({
  text,
  fontSize = 52,
  color = "#FFFFFF",
  backgroundColor = "transparent",
  wordsPerSecond = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lines = text.split("\n");
  const framesPerWord = Math.round(fps / wordsPerSecond);

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let globalWordIndex = 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: backgroundColor,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "85%",
          display: "flex",
          flexDirection: "column",
          gap: fontSize * 0.3,
        }}
      >
        {lines.map((line, lineIdx) => {
          if (line.trim() === "") {
            return <div key={lineIdx} style={{ height: fontSize * 0.4 }} />;
          }

          const words = line.split(/\s+/).filter(Boolean);

          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: `0 ${fontSize * 0.25}px`,
              }}
            >
              {words.map((word, wordIdx) => {
                const wordFrame = globalWordIndex * framesPerWord;
                globalWordIndex++;

                const wordSpring = spring({
                  frame: frame - wordFrame,
                  fps,
                  config: { damping: 14, stiffness: 120, mass: 0.8 },
                });

                const translateY = interpolate(
                  wordSpring,
                  [0, 1],
                  [25, 0],
                );

                return (
                  <span
                    key={wordIdx}
                    style={{
                      display: "inline-block",
                      fontSize,
                      color,
                      fontFamily:
                        "'Be Vietnam Pro', 'Montserrat', Inter, system-ui, sans-serif",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      opacity: wordSpring,
                      transform: `translateY(${translateY}px)`,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
