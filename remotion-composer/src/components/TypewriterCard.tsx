import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TypewriterCardProps {
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  charsPerSecond?: number;
  cursorBlinkRate?: number;
}

export const TypewriterCard: React.FC<TypewriterCardProps> = ({
  text,
  fontSize = 42,
  color = "#E5E5E5",
  backgroundColor = "#000000",
  charsPerSecond = 15,
  cursorBlinkRate = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const timeSeconds = frame / fps;
  const totalChars = text.length;
  const typingDuration = totalChars / charsPerSecond;

  // Characters visible at current frame
  const charsVisible = Math.min(
    Math.floor(timeSeconds * charsPerSecond),
    totalChars
  );

  const displayText = text.slice(0, charsVisible);
  const doneTyping = charsVisible >= totalChars;

  // Cursor blinks while typing, stays 0.5s after done, then disappears
  const cursorGracePeriod = 0.5; // seconds after typing finishes
  const showCursorPhase = !doneTyping || timeSeconds < typingDuration + cursorGracePeriod;
  const blinkCycle = Math.floor(frame / (fps / cursorBlinkRate / 2)) % 2;
  const showCursor = showCursorPhase && blinkCycle === 0;

  // Fade out at end of scene
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
          fontSize,
          color,
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 400,
          textAlign: "center",
          maxWidth: "85%",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          letterSpacing: "0.02em",
        }}
      >
        {displayText}
        <span
          style={{
            opacity: showCursor ? 1 : 0,
            color,
            fontWeight: 300,
          }}
        >
          |
        </span>
      </div>
    </AbsoluteFill>
  );
};
