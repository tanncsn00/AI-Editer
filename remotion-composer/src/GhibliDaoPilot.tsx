/**
 * GhibliDaoPilot — pilot for the "Ghibli + Tịnh Đạo" format.
 *
 * 7s Ghibli-stylized elderly-walking clip slowed to 21s to match the
 * VN philosophy narration. Sentence-based spring caption (reduced to
 * sentence-level timing — no per-word JSON). bh_music.mp3 under the
 * voiceover at low volume.
 */

import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", {
  weights: ["300", "400", "600", "700", "800"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

const FPS = 30;
const W = 1080;
const H = 1920;
const DUR = 21 * FPS; // 630 frames

const EMPHASIS = "#E8D9B5";  // warm cream for Ghibli palette
const BODY = "#F5EFD8";

type Sentence = { text: string; start: number; end: number; emph?: string[] };
const SENTENCES: Sentence[] = [
  { text: "Cuộc đời là một chuyến đi dài.",                      start: 0.3,  end: 3.4,  emph: ["chuyến", "đi", "dài."] },
  { text: "Người ta sinh ra, rồi bước từng bước...",             start: 3.6,  end: 7.2,  emph: ["từng", "bước..."] },
  { text: "chậm rãi, lặng lẽ, hướng về phía cuối con đường.",    start: 7.3,  end: 12.0, emph: ["chậm", "rãi,", "lặng", "lẽ,", "cuối", "đường."] },
  { text: "Có kẻ mải miết chạy, có người chọn dừng lại.",        start: 12.1, end: 16.0, emph: ["chạy,", "dừng", "lại."] },
  { text: "Nhưng dù đi nhanh hay chậm, cuối cùng...",            start: 16.1, end: 18.5, emph: ["cuối", "cùng..."] },
  { text: "ai cũng phải một mình, đối diện với chính mình.",     start: 18.6, end: 21.0, emph: ["một", "mình,", "chính", "mình."] },
];

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  let idx = -1;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.5;
    if (t >= s.start - 0.15 && t < boundary) { active = s; idx = i; break; }
  }
  if (!active) return null;
  const words = active.text.split(" ");
  const emphSet = new Set((active.emph || []).map((w) => w.toLowerCase()));
  const perWord = 0.07;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 18px", maxWidth: 920, padding: "0 60px",
      }}>
        {words.map((w, i) => {
          const appearAt = active!.start + i * perWord;
          const sp = spring({
            frame: frame - appearAt * FPS, fps: FPS,
            config: { damping: 14, stiffness: 230, mass: 0.4 },
          });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [14, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = emphSet.has(w.toLowerCase());
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph
                ? "0 0 26px rgba(232,217,181,0.5), 0 4px 14px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Video: React.FC = () => {
  // The source clip is 7.38s. Narration = 21s. Slow playback to 0.33x so
  // the 7s Ghibli elderly walking becomes 21s meditative.
  return (
    <AbsoluteFill>
      <div style={{ width: "100%", height: "100%",
                    transform: "scale(1.06)",
                    filter: "brightness(0.85) saturate(1.05) contrast(1.05)" }}>
        <OffthreadVideo src={staticFile("ghibli_elderly.mp4")}
          playbackRate={0.33}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* Gentle vignette for caption readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 80%)",
      }} />
    </AbsoluteFill>
  );
};

export const GhibliDaoPilot: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0808" }}>
    <Video />
    <Audio src={staticFile("ghibli_dao_narration.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.18} />
    <Caption />
  </AbsoluteFill>
);
