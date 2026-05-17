import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import wordsData from "./vibe_ep2_words.json";
import beatsData from "./vibe_ep2_beats.json";

loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadCaveat("normal", { weights: ["400","700"], subsets: ["latin"] });
loadRobotoMono("normal", { weights: ["400","500","700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const BLUE = "#4A7AC8";
const GREEN = "#3B8A5C";
const IVORY = "#F5F5F0";
const FONT_VN = "Be Vietnam Pro, sans-serif";
const FONT_HAND = "Caveat, cursive";
const FONT_MONO = "Roboto Mono, monospace";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const B = (i: number) => {
  const b = beats[i];
  return [b.start, b.start + b.duration] as const;
};

// ═══ Background ═══
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="ep2PN"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" /></filter>
      <radialGradient id="ep2Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ep2PN)" />
    <rect width={W} height={H} fill="url(#ep2Vig)" />
  </svg>
);

// ═══ Caption (sentence-based spring reveal from Ep1) ═══
const EMPH = new Set<string>([
  "IDE", "IDE.", "IDE,", "ây", "ai", "ai.", "ai,",
  "Antigravity", "Antigravity.", "Cursor", "Cursor.", "Claude", "Code", "Code.",
  "FREE", "free", "MIỄN", "PHÍ",
  "README", "README.", "MỘT",
  "Git", "Git,", "Node", "Python", "FFmpeg",
  "FAL", "FAL.", "EverAI", "EverAI.", "Pexels", "Pexels.",
  "skill", "skill.", "skill,", "preset",
  "THE", "REVIEW",
  "video", "video.", "video,",
  ".env", ".env.", "key", "key.", "key,",
  "repo", "repo.",
  "xong.", "xong,",
]);

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => { if (buf.length) { out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end }); buf = []; } };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) { flush(); continue; }
    if (/,$/.test(w.word) && buf.length >= 8) flush();
  }
  flush();
  return out;
})();

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.6;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - 0.1);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const emph = EMPH.has(w.word);
          return (
            <span key={`${active!.start}-${i}`} style={{
              display: "inline-block", fontFamily: FONT_VN,
              fontWeight: emph ? 800 : 600, fontSize: emph ? 62 : 52,
              color: emph ? GOLD : IVORY,
              textShadow: emph ? "0 0 26px rgba(229,165,59,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${interpolate(sp, [0, 1], [12, 0])}px)`,
              filter: `blur(${interpolate(sp, [0, 1], [4, 0])}px)`,
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══ LIVE Badge ═══
const LiveBadge: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = Math.sin(f / 10) > 0 ? 1 : 0.6;
  return (
    <div style={{
      position: "absolute", top: 50, right: 40,
      background: INK, color: "#FFF", padding: "14px 28px", borderRadius: 12,
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 24, border: `3px solid ${GOLD}`,
      opacity: pulse,
    }}>🔴 REAL · LIVE</div>
  );
};

// ═══ Slide components ═══
const SlideIntro: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill>
    <Bg />
    <div style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 100, color: ACCENT, lineHeight: 1.1, padding: "0 60px",
    }}>{title}</div>
    <div style={{ position: "absolute", top: 750, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: INK, opacity: 0.7,
    }}>{sub}</div>
  </AbsoluteFill>
);

const SlideIdeCards: React.FC = () => {
  const f = useCurrentFrame();
  const ides = [
    { name: "Antigravity", price: "FREE giới hạn", color: "#34A853", url: "antigravity.google" },
    { name: "Cursor", price: "$20/tháng", color: "#7C3AED", url: "cursor.com" },
    { name: "Claude Code", price: "$20/tháng", color: "#D97706", url: "claude.ai/code" },
  ];
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_VN, fontWeight: 800, fontSize: 72, color: INK }}>CHỌN AI IDE</div>
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_HAND, fontSize: 42, color: ACCENT }}>chọn 1 thôi · tải về cài</div>
      {ides.map((ide, i) => {
        const show = f > i * 12;
        const sp = show ? spring({ frame: f - i * 12, fps: FPS, config: { damping: 12, stiffness: 200 } }) : 0;
        return (
          <div key={i} style={{
            position: "absolute", top: 480 + i * 380, left: 80, right: 80,
            background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 24,
            padding: "36px 40px", opacity: sp,
            transform: `translateY(${interpolate(sp, [0, 1], [30, 0])}px) rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
            boxShadow: "0 8px 0 rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 16, background: ide.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_VN, fontWeight: 800, fontSize: 32, color: "#FFF",
              }}>{ide.name[0]}</div>
              <div>
                <div style={{ fontFamily: FONT_VN, fontWeight: 800, fontSize: 52, color: INK }}>{ide.name}</div>
                <div style={{ fontFamily: FONT_VN, fontWeight: 700, fontSize: 30, color: ACCENT }}>{ide.price}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: BLUE, marginTop: 4 }}>→ {ide.url}</div>
              </div>
            </div>
            {i === 0 && (
              <div style={{ position: "absolute", top: -18, right: -10, background: GOLD,
                color: INK, padding: "6px 16px", border: `3px solid ${INK}`, borderRadius: 8,
                fontFamily: FONT_VN, fontWeight: 800, fontSize: 22, transform: "rotate(6deg)" }}>💰 TIẾT KIỆM</div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SlideEnvCreate: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 80, color: INK }}>TẠO FILE .env</div>
    <div style={{ position: "absolute", top: 500, left: 80, right: 80, display: "flex", gap: 30 }}>
      {[
        { icon: "📝", title: "Cách 1", sub: "Copy file rename", detail: ".env.example → .env" },
        { icon: "🤖", title: "Cách 2", sub: "Bảo AI tạo hộ", detail: "\"Tạo .env từ .env.example\"" },
      ].map((c, i) => (
        <div key={i} style={{
          flex: 1, background: i === 1 ? "#FFF8E0" : "#FFFEFB",
          border: `5px solid ${i === 1 ? GOLD : INK}`, borderRadius: 22, padding: "40px 30px", textAlign: "center",
          transform: `rotate(${i === 0 ? -1.5 : 1.5}deg)`,
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{c.icon}</div>
          <div style={{ fontFamily: FONT_VN, fontWeight: 800, fontSize: 48, color: INK }}>{c.title}</div>
          <div style={{ fontFamily: FONT_HAND, fontSize: 38, color: ACCENT, margin: "10px 0" }}>{c.sub}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: INK, opacity: 0.7 }}>{c.detail}</div>
          {i === 1 && (
            <div style={{ marginTop: 16, background: GOLD, color: INK, padding: "8px 20px",
              borderRadius: 10, fontFamily: FONT_VN, fontWeight: 800, fontSize: 24, display: "inline-block" }}>LƯỜI THÌ XÀI CÁI NÀY</div>
          )}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const Slide3ApiKey: React.FC = () => {
  const f = useCurrentFrame();
  const keys = [
    { emoji: "🎨", name: "FAL", url: "fal.ai", desc: "ảnh + video AI" },
    { emoji: "🎙️", name: "EverAI", url: "everai.vn", desc: "giọng tiếng Việt" },
    { emoji: "📷", name: "Pexels", url: "pexels.com/api", desc: "footage free" },
  ];
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_VN, fontWeight: 800, fontSize: 76, color: INK }}>3 CHÌA KHOÁ FREE</div>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_HAND, fontSize: 42, color: GREEN }}>cả 3 đều FREE TIER · không tốn xu</div>
      {keys.map((k, i) => {
        const sp = spring({ frame: f - i * 15, fps: FPS, config: { damping: 12 } });
        return (
          <div key={i} style={{
            position: "absolute", top: 500 + i * 360, left: 80, right: 80,
            background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 22,
            padding: "30px 36px", opacity: Math.max(0, sp),
            transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)`,
            boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ fontSize: 56 }}>{k.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_VN, fontWeight: 800, fontSize: 52, color: ACCENT }}>{k.name}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 30, color: BLUE }}>→ {k.url}</div>
                <div style={{ fontFamily: FONT_HAND, fontSize: 34, color: INK, opacity: 0.7 }}>{k.desc}</div>
              </div>
              <div style={{ background: GREEN, color: "#FFF", padding: "10px 20px", borderRadius: 10,
                fontFamily: FONT_VN, fontWeight: 800, fontSize: 24, transform: "rotate(4deg)" }}>FREE</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ═══ Mini overlays for Beat 5 ═══
const MiniOverlay: React.FC<{ text: string; color: string; emoji: string }> = ({ text, color, emoji }) => (
  <div style={{
    position: "absolute", bottom: 280, left: 60, right: 60,
    background: color, border: `4px solid ${INK}`, borderRadius: 18,
    padding: "20px 30px", textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  }}>
    <div style={{ fontFamily: FONT_VN, fontWeight: 800, fontSize: 36, color: "#FFF" }}>{emoji} {text}</div>
  </div>
);

// ═══ Screen clip with Ken Burns + crop to 9:16 ═══
const ScreenClip: React.FC<{ src: string; showBadge?: boolean }> = ({ src, showBadge = false }) => (
  <>
    <AbsoluteFill style={{ background: "#111" }}>
      <OffthreadVideo src={staticFile(src)} muted style={{
        width: "100%", height: "100%", objectFit: "contain",
      }} />
    </AbsoluteFill>
    {showBadge && <LiveBadge />}
  </>
);

// ═══ Main Composition ═══
export const VibeEditingEp2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Beat boundaries
  const b0 = B(0); // hook 0-20
  const b1 = B(1); // intro slide
  const b2 = B(2); // IDE cards
  const b3 = B(3); // screen rec README
  const b4 = B(4); // env check + slides
  const b5 = B(5); // meta demo debate

  const inClipBeat = (t >= b0[0] && t < b0[1]) ||
                     (t >= b3[0] && t < b3[1]) ||
                     (t >= b4[0] && t < b4[1]) ||
                     (t >= b5[0] && t < b5[1]);

  // Beat 4 sub-timing
  const b4Start = b4[0];
  const b4SlideIntro = b4Start;        // 0-8s slide
  const b4Clip = b4Start + 8;          // 8-53s clip
  const b4EnvSlide = b4Start + 53;     // 53-65s env create
  const b4ApiSlide = b4Start + 65;     // 65-95s 3 api keys

  // Beat 5 sub-timing
  const b5Start = b5[0];
  const b5SlideIntro = b5Start;        // 0-10s slide
  const b5Clips = b5Start + 10;        // 10-75s debate clips
  const b5Seg1End = b5Clips + 35;
  const b5Seg2End = b5Seg1End + 30;
  const b5Seg3End = b5Seg2End + 17;
  const b5MentionStart = b5Start + 75; // 75-95s mention overlays
  const b5Outro = b5Start + 95;        // 95-105s

  // Check if we're in a clip section
  const showPaper = (t >= b1[0] && t < b1[1]) ||
                    (t >= b2[0] && t < b2[1]) ||
                    (t >= b4SlideIntro && t < b4Clip) ||
                    (t >= b4EnvSlide && t < b4ApiSlide) ||
                    (t >= b4ApiSlide && t < b4[1]) ||
                    (t >= b5SlideIntro && t < b5Clips);

  return (
    <AbsoluteFill>
      {/* ── Beat 0: Hook face cam ── */}
      <Sequence from={Math.round(b0[0] * FPS)} durationInFrames={Math.round((b0[1] - b0[0]) * FPS)}>
        <AbsoluteFill style={{ background: "#000" }}>
          <OffthreadVideo src={staticFile("vibe-ep2/hook.mp4")} style={{
            width: "100%", height: "100%", objectFit: "cover",
          }} />
        </AbsoluteFill>
      </Sequence>

      {/* ── Beat 1: Intro slide ── */}
      <Sequence from={Math.round(b1[0] * FPS)} durationInFrames={Math.round((b1[1] - b1[0]) * FPS)}>
        <SlideIntro title="VỢ CHỈ KÉO THẢ" sub="AI LO HẾT · Ep2" />
      </Sequence>

      {/* ── Beat 2: IDE cards ── */}
      <Sequence from={Math.round(b2[0] * FPS)} durationInFrames={Math.round((b2[1] - b2[0]) * FPS)}>
        <SlideIdeCards />
      </Sequence>

      {/* ── Beat 3: Screen rec README ── */}
      <Sequence from={Math.round(b3[0] * FPS)} durationInFrames={Math.round((b3[1] - b3[0]) * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat3.mp4" showBadge />
      </Sequence>

      {/* ── Beat 4: Sub-sequences ── */}
      {/* 4a: Slide intro */}
      <Sequence from={Math.round(b4SlideIntro * FPS)} durationInFrames={Math.round(8 * FPS)}>
        <SlideIntro title="BƯỚC 3" sub="AI TỰ CÀI HẾT · 1 câu lệnh" />
      </Sequence>
      {/* 4b: Env check clip */}
      <Sequence from={Math.round(b4Clip * FPS)} durationInFrames={Math.round(45 * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat4.mp4" showBadge />
      </Sequence>
      {/* 4c: Env create slide */}
      <Sequence from={Math.round(b4EnvSlide * FPS)} durationInFrames={Math.round(12 * FPS)}>
        <SlideEnvCreate />
      </Sequence>
      {/* 4d: 3 API keys */}
      <Sequence from={Math.round(b4ApiSlide * FPS)} durationInFrames={Math.round(30 * FPS)}>
        <Slide3ApiKey />
      </Sequence>

      {/* ── Beat 5: Meta demo ── */}
      {/* 5a: Slide intro */}
      <Sequence from={Math.round(b5SlideIntro * FPS)} durationInFrames={Math.round(10 * FPS)}>
        <SlideIntro title="BƯỚC 4" sub="DÙNG SKILL ĐẺ VIDEO" />
      </Sequence>
      {/* 5b: Debate clips */}
      <Sequence from={Math.round(b5Clips * FPS)} durationInFrames={Math.round(35 * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat5_s1.mp4" showBadge />
      </Sequence>
      <Sequence from={Math.round(b5Seg1End * FPS)} durationInFrames={Math.round(30 * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat5_s2.mp4" showBadge />
      </Sequence>
      <Sequence from={Math.round(b5Seg2End * FPS)} durationInFrames={Math.round(17 * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat5_s3.mp4" showBadge />
      </Sequence>
      <Sequence from={Math.round(b5Seg3End * FPS)} durationInFrames={Math.round(15 * FPS)}>
        <ScreenClip src="vibe-ep2/clips/beat5_s4.mp4" showBadge />
      </Sequence>
      {/* 5c: Mini overlays during mention */}
      <Sequence from={Math.round(b5MentionStart * FPS)} durationInFrames={Math.round(8 * FPS)}>
        <MiniOverlay text="PASTE LINK YT/TT/FB → AI TẢI SẠCH LOGO" color={BLUE} emoji="📥" />
      </Sequence>
      <Sequence from={Math.round((b5MentionStart + 8) * FPS)} durationInFrames={Math.round(5 * FPS)}>
        <MiniOverlay text="ĐỪNG ĂN CẮP — BANNED ACCOUNT" color="#C44536" emoji="❌" />
      </Sequence>
      <Sequence from={Math.round((b5MentionStart + 13) * FPS)} durationInFrames={Math.round(5 * FPS)}>
        <MiniOverlay text="CHẤT LIỆU → VIẾT LẠI GIỌNG MÌNH" color={GREEN} emoji="✅" />
      </Sequence>

      {/* ── Background Music ── */}
      {/* ── Voice-over audio ── */}
      <Sequence from={Math.round(b1[0] * FPS)}><Audio src={staticFile("vibe-ep2/beat_1.mp3")} volume={1.0} /></Sequence>
      <Sequence from={Math.round(b2[0] * FPS)}><Audio src={staticFile("vibe-ep2/beat_2.mp3")} volume={1.0} /></Sequence>
      <Sequence from={Math.round(b3[0] * FPS)}><Audio src={staticFile("vibe-ep2/beat_3.mp3")} volume={1.0} /></Sequence>
      <Sequence from={Math.round(b4[0] * FPS)}><Audio src={staticFile("vibe-ep2/beat_4.mp3")} volume={1.0} /></Sequence>
      <Sequence from={Math.round(b5[0] * FPS)}><Audio src={staticFile("vibe-ep2/beat_5.mp3")} volume={1.0} /></Sequence>

      {/* ── Captions ── */}
      <Caption />
    </AbsoluteFill>
  );
};