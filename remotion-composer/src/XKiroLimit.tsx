import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";
import tl from "./xkiro-limit_timeline.json";

loadJakarta("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["500", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadJetBrains("normal", { weights: ["400", "600"], subsets: ["latin"] });
loadBeVietnam("normal", { weights: ["600", "800"], subsets: ["vietnamese", "latin"] });

const FPS = 30;
const SLUG = "xkiro-limit";
const LEAD = 4;
const TAIL_SEC = 1.2;
const FADE = 6;

const TECH = "#0A0B0A";
const GOLD = "#86EFAC";
const PAPER = "#E6F4EA";
const SEAL = "#C8312B";
const GREEN = "#22C55E";
const GREEN_DEEP = "#16A34A";
const RED = "#F87171";
const TEXT = "#F3F5F2";
const MUTED = "#8A938C";
const CARD = "#111412";
const BORDER = "#ffffff1a";

const SERIF = "'EB Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const CAPTION_FONT = "'Be Vietnam Pro', system-ui, sans-serif";

type Line = { t: string; kind: string; start: number; end: number };
type Timeline = { total: number; beats: { pages: { lines: Line[] }[] }[] };
const TL = tl as Timeline;
const LINES: Line[] = TL.beats.flatMap((b) => b.pages.flatMap((p) => p.lines));

export const XKIRO_LIMIT_FRAMES = Math.ceil((TL.total + TAIL_SEC) * FPS);

const entry = (i: number) => Math.max(0, Math.round(LINES[i].start * FPS) - LEAD);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const SNAPPY = { damping: 14, stiffness: 190, mass: 0.6 };
const SOFT = { damping: 18, stiffness: 90, mass: 0.9 };

type Ctx = { f: number; dur: number; at: (i: number) => number; sp: (i: number, delay?: number, cfg?: typeof SNAPPY) => number };
type Shot = { first: number; render: (c: Ctx) => React.ReactNode };

const lerp = (v: number, a: number, b: number) => a + (b - a) * v;
const appear = (v: number, dy = 40) => ({ opacity: Math.min(1, v * 1.4), transform: `translateY(${lerp(v, dy, 0)}px)` });
const popIn = (v: number) => ({ opacity: Math.min(1, v * 1.6), transform: `scale(${lerp(v, 0.6, 1)})` });

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <AbsoluteFill style={{ top: 150, bottom: 640, height: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, padding: "0 70px" }}>
    {children}
  </AbsoluteFill>
);

const SerifTitle: React.FC<{ v: number; size?: number; color?: string; children: React.ReactNode }> = ({ v, size = 120, color = GOLD, children }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, textAlign: "center", letterSpacing: 2, textShadow: `0 0 40px ${color}55, 0 8px 24px #000c`, filter: `blur(${lerp(v, 10, 0)}px)`, ...appear(v, 30) }}>
    {children}
  </div>
);

const Label: React.FC<{ v: number; color?: string; size?: number; children: React.ReactNode }> = ({ v, color = MUTED, size = 34, children }) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, color, letterSpacing: 6, textTransform: "uppercase", textAlign: "center", ...appear(v, 20) }}>{children}</div>
);

const Seal: React.FC<{ v: number; text: string; size?: number }> = ({ v, text, size = 220 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `10px solid ${SEAL}`,
      borderRadius: 18,
      color: SEAL,
      fontFamily: SERIF,
      fontWeight: 800,
      fontSize: size * 0.26,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      lineHeight: 1.05,
      whiteSpace: "pre-line",
      background: "#C8312B12",
      opacity: Math.min(1, v * 2),
      transform: `rotate(-10deg) scale(${lerp(v, 2.4, 1)})`,
    }}
  >
    {text}
  </div>
);

const Gem: React.FC<{ size?: number; hue?: string; style?: React.CSSProperties }> = ({ size = 80, hue = "#7FE3C4", style }) => (
  <div style={{ width: size, height: size, transform: "rotate(45deg)", background: `linear-gradient(135deg, #ffffffcc 0%, ${hue} 35%, #0d6b52 100%)`, borderRadius: size * 0.12, boxShadow: `0 0 ${size * 0.5}px ${hue}88`, ...style }} />
);

const Gate: React.FC<{ name: string; width?: number; closed?: number; dim?: number }> = ({ name, width = 760, closed = 0, dim = 0 }) => {
  const h = width * 0.92;
  return (
    <div style={{ position: "relative", width, height: h, filter: `grayscale(${dim}) brightness(${1 - dim * 0.5})` }}>
      <svg width={width} height={h} viewBox="0 0 760 700" style={{ position: "absolute", inset: 0 }}>
        <path d="M20 150 Q380 60 740 150 L700 190 Q380 120 60 190 Z" fill="#14532D" stroke={GOLD} strokeWidth="4" />
        <path d="M80 250 Q380 190 680 250 L650 280 Q380 230 110 280 Z" fill="#14532D" stroke={GOLD} strokeWidth="3" />
        <rect x="120" y="180" width="44" height="520" fill="#0F3D22" stroke={GOLD} strokeWidth="3" />
        <rect x="596" y="180" width="44" height="520" fill="#0F3D22" stroke={GOLD} strokeWidth="3" />
        <rect x="170" y="196" width="420" height="70" rx="6" fill="#07160E" stroke={GOLD} strokeWidth="3" />
        <rect x="164" y="300" width={216 * closed} height="400" fill="#0B2A18" stroke={GOLD} strokeWidth="2" />
        <rect x={596 - 216 * closed} y="300" width={216 * closed} height="400" fill="#0B2A18" stroke={GOLD} strokeWidth="2" />
      </svg>
      <div style={{ position: "absolute", top: h * 0.295, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: width * 0.042, lineHeight: 1, color: GOLD, letterSpacing: 2 }}>{name}</div>
    </div>
  );
};

const Clock: React.FC<{ hour: number; minute: number; size?: number }> = ({ hour, minute, size = 460 }) => {
  const ha = ((hour % 12) + minute / 60) * 30;
  const ma = minute * 6;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="#111412" stroke={GOLD} strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="100" y1="16" x2="100" y2={i % 3 === 0 ? 30 : 24} stroke={GOLD} strokeWidth={i % 3 === 0 ? 4 : 2} transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <line x1="100" y1="100" x2="100" y2="52" stroke={PAPER} strokeWidth="7" strokeLinecap="round" transform={`rotate(${ha} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="30" stroke={GOLD} strokeWidth="4" strokeLinecap="round" transform={`rotate(${ma} 100 100)`} />
      <circle cx="100" cy="100" r="6" fill={GOLD} />
    </svg>
  );
};

const Card: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties; glow?: boolean }> = ({ children, width = 900, style, glow }) => (
  <div style={{ width, background: CARD, border: `2px solid ${glow ? GREEN + "88" : BORDER}`, borderRadius: 28, boxShadow: `0 0 60px ${GREEN_DEEP}22, 0 30px 60px #000a`, overflow: "hidden", ...style }}>{children}</div>
);

const WindowBar: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px", borderBottom: `1px solid ${BORDER}` }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
      <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
    ))}
    <div style={{ flex: 1, textAlign: "center", fontFamily: SANS, fontSize: 26, color: MUTED }}>{title}</div>
  </div>
);

const Bubble: React.FC<{ v: number; text: string; right?: boolean; color?: string }> = ({ v, text, right, color = "#1A1D1B" }) => (
  <div style={{ alignSelf: right ? "flex-end" : "flex-start", maxWidth: 700, padding: "26px 34px", borderRadius: 34, background: color, fontFamily: SANS, fontWeight: 600, fontSize: 44, color: TEXT, ...appear(v, 30) }}>{text}</div>
);

const DocPage: React.FC<{ fill: number; crack?: number; done?: boolean; blink: boolean }> = ({ fill, crack = 0, done, blink }) => {
  const rows = 11;
  return (
    <div style={{ position: "relative", width: 640, height: 820, background: "#F7F4EC", borderRadius: 14, boxShadow: "0 30px 80px #000c", padding: "70px 64px", overflow: "hidden" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#1A1714", display: "flex", alignItems: "center", gap: 18 }}>
        CHƯƠNG 3
        {done ? <span style={{ fontFamily: SANS, fontSize: 40, color: "#fff", background: GREEN, borderRadius: 30, padding: "4px 20px" }}>✓ xong</span> : null}
      </div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 26 }}>
        {Array.from({ length: rows }).map((_, i) => {
          const w = interpolate(fill * rows - i, [0, 1], [0, i % 4 === 3 ? 62 : 100], clamp);
          return <div key={i} style={{ height: 16, width: `${w}%`, background: "#C9C2B3", borderRadius: 8 }} />;
        })}
      </div>
      {fill === 0 ? <div style={{ position: "absolute", top: 196, left: 64, width: 5, height: 52, background: "#1A1714", opacity: blink ? 1 : 0 }} /> : null}
      {crack > 0 ? (
        <svg width="640" height="820" viewBox="0 0 640 820" style={{ position: "absolute", inset: 0 }}>
          <path d="M320 0 L300 160 L360 260 L280 400 L340 520 L260 700 L300 820" fill="none" stroke={SEAL} strokeWidth="7" strokeDasharray="1200" strokeDashoffset={1200 * (1 - crack)} />
          <path d="M300 160 L180 230 M360 260 L480 300 M280 400 L150 470 M340 520 L470 600" fill="none" stroke={SEAL} strokeWidth="4" strokeDasharray="700" strokeDashoffset={700 * (1 - crack)} />
        </svg>
      ) : null}
    </div>
  );
};

const ModelRow: React.FC<{ v: number; logo: string; name: string; id: string; badge: string; hot?: number }> = ({ v, logo, name, id, badge, hot = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 34px", borderBottom: `1px solid ${BORDER}`, background: `rgba(34,197,94,${0.12 * hot})`, ...appear(v, 30) }}>
    <Img src={staticFile(`${SLUG}/${logo}`)} style={{ width: 56, height: 56, objectFit: "contain" }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: TEXT }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, marginTop: 4 }}>{id}</div>
    </div>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: TECH, background: GREEN, borderRadius: 10, padding: "6px 14px" }}>{badge}</div>
  </div>
);

const SHOTS: Shot[] = [
  {
    first: 0,
    render: ({ f, at, sp }) => {
      const slam = spring({ frame: f + 3, fps: FPS, config: { damping: 12, stiffness: 260, mass: 0.6 } });
      const flash = interpolate(f, [0, 2, 9], [0.9, 0.6, 0], clamp);
      const n = Math.round(interpolate(f, [at(0), at(0) + 24], [0, 520000], clamp));
      return (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 600px at 50% 20%, #16A34A55 0%, transparent 70%)" }} />
          <AbsoluteFill style={{ background: "#ffffff", opacity: flash * 0.45 }} />
          <Stage gap={40}>
            <div style={{ position: "relative", width: 900, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${lerp(slam, 1.25, 1)}) rotate(${lerp(slam, -4, 0)}deg)` }}>
              <div style={{ width: 960, height: 44, borderRadius: 22, background: "linear-gradient(#1F7A45, #0F3D22)", boxShadow: "0 6px 16px #000a" }} />
              <div style={{ width: 880, height: 420, background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 50px", boxSizing: "border-box" }}>
                <div style={{ fontFamily: MONO, fontSize: 34, color: "#15803D", letterSpacing: 4 }}>⚠ CLAUDE</div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 78, color: "#1A1714", textAlign: "center", lineHeight: 1.1 }}>5-hour limit reached</div>
                <div style={{ fontFamily: MONO, fontSize: 48, color: SEAL }}>Resets 9:50 PM</div>
              </div>
              <div style={{ width: 960, height: 44, borderRadius: 22, background: "linear-gradient(#1F7A45, #0F3D22)", boxShadow: "0 6px 16px #000a" }} />
              <div style={{ position: "absolute", right: -10, bottom: 30 }}>
                <Seal v={sp(0, 50)} text={"HẾT\nLƯỢT"} size={210} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: GOLD, textShadow: `0 0 50px ${GOLD}66`, ...appear(sp(0)) }}>{n.toLocaleString("vi-VN")}đ</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: RED, ...popIn(sp(0, 40)) }}>2 câu</div>
            </div>
          </Stage>
        </>
      );
    },
  },
  {
    first: 1,
    render: ({ sp }) => (
      <Stage>
        <Label v={sp(1)} color={MUTED}>dịch cabin</Label>
        <SerifTitle v={sp(1, 4)} size={150} color={RED}>HẾT LINH LỰC</SerifTitle>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 64, color: PAPER, ...appear(sp(1, 16)) }}>
          quay lại lúc <span style={{ color: GOLD, fontFamily: MONO }}>9:50</span>
        </div>
      </Stage>
    ),
  },
  {
    first: 2,
    render: ({ f, sp }) => (
      <Stage>
        <div style={{ width: 420, borderRadius: 26, overflow: "hidden", background: PAPER, boxShadow: "0 30px 80px #000c", ...popIn(sp(2)) }}>
          <div style={{ background: GREEN_DEEP, color: PAPER, fontFamily: SANS, fontWeight: 800, fontSize: 44, textAlign: "center", padding: 18, letterSpacing: 8 }}>CÒN</div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 300, color: "#1A1714", textAlign: "center", lineHeight: 1.1 }}>3</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "#1A1714", textAlign: "center", paddingBottom: 26, letterSpacing: 6 }}>NGÀY</div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, color: TEXT, ...appear(sp(2, 44)) }}>
          Chương 3: <span style={{ color: RED }}>0 chữ</span>
          <span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>|</span>
        </div>
      </Stage>
    ),
  },
  {
    first: 3,
    render: ({ f, at, sp }) => (
      <Stage>
        <div style={{ position: "relative", ...popIn(sp(3, 0, SOFT)) }}>
          <Gate name="CHATGPT PHÁI" width={700} closed={interpolate(f, [at(3) + 30, at(3) + 42], [0, 1], clamp)} />
          <div style={{ position: "absolute", right: 30, bottom: 80 }}>
            <Seal v={sp(3, 44)} text={"HẾT\nLƯỢT"} size={190} />
          </div>
        </div>
      </Stage>
    ),
  },
  {
    first: 4,
    render: ({ f, at, sp }) => {
      const flip = interpolate(f, [at(4) + 70, at(4) + 90], [0, 180], clamp);
      const front = flip < 90;
      return (
        <Stage>
          <div style={{ perspective: 1800, ...popIn(sp(4)) }}>
            <div style={{ width: 760, height: 470, transform: `rotateY(${flip}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 40, background: "linear-gradient(135deg, #9FE8C8 0%, #2E8B6A 50%, #0F4D3A 100%)", boxShadow: "0 0 90px #3FBF8F88", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `6px solid ${GOLD}` }}>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 150, color: "#0B2E22", letterSpacing: 10 }}>LỆNH</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: "#0B2E22" }}>vạn tông thông hành</div>
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 40, background: CARD, border: `3px solid ${GREEN}`, boxShadow: `0 0 90px ${GREEN}55`, padding: 50, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <Img src={staticFile(`${SLUG}/logo-xKiro-green.png`)} style={{ width: 70, height: 70 }} />
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: TEXT }}>xKiro</div>
                  <div style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 26, color: GREEN, border: `2px solid ${GREEN}`, borderRadius: 20, padding: "4px 16px" }}>API KEY</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 50, color: TEXT, letterSpacing: 2 }}>sk-xt-••••••••4a1c</div>
                <div style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>Base URL api.xkiro.com/v1</div>
              </div>
            </div>
          </div>
          <Label v={front ? sp(4, 6) : 1} color={front ? GOLD : GREEN}>{front ? "một tấm lệnh bài" : "một API key"}</Label>
        </Stage>
      );
    },
  },
  {
    first: 5,
    render: ({ f, dur, sp }) => {
      const tilt = interpolate(f, [0, 20, dur - 10], [16, 8, 0], clamp);
      return (
        <Stage>
          <div style={{ perspective: 2000 }}>
            <div style={{ ...appear(sp(5, 0, SOFT), 60), transform: `${appear(sp(5, 0, SOFT), 60).transform} rotateX(${tilt}deg) rotateY(${-tilt * 0.6}deg)` }}>
              <Card width={880}>
                <WindowBar title="App chat · 1 lệnh bài" />
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 34px", borderBottom: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 28, ...appear(sp(5, 2), 20) }}>
                  <span style={{ color: MUTED }}>Base URL</span>
                  <span style={{ color: TEXT }}>api.xkiro.com/v1</span>
                  <span style={{ marginLeft: "auto", color: GREEN }}>✓</span>
                </div>
                <ModelRow v={sp(5, 6)} logo="OpenAI_dark.svg" name="GPT-6.1 Sol" id="openai/gpt-6.1-sol" badge="Up to −96%" hot={sp(5, 30)} />
                <ModelRow v={sp(5, 10)} logo="gemini.svg" name="Gemini 3.8 Flash" id="google/gemini-3.8-flash" badge="−35%" hot={sp(5, 44)} />
                <ModelRow v={sp(5, 14)} logo="deepseek.svg" name="DeepSeek V4 Pro" id="deepseek/deepseek-v4-pro-0813" badge="−35%" hot={sp(5, 58)} />
                <div style={{ padding: "22px 34px", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: GREEN }}>Browse all 103 models →</div>
              </Card>
            </div>
          </div>
        </Stage>
      );
    },
  },
  {
    first: 6,
    render: ({ sp }) => (
      <Stage gap={40}>
        <div style={{ display: "flex", gap: 34, alignItems: "flex-end", height: 200 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...popIn(sp(6, i * 4)) }}>
              <Gem size={80 + (i % 2) * 36} />
            </div>
          ))}
        </div>
        <SerifTitle v={sp(6, 6)} size={96} color={GOLD}>Linh thạch miễn phí</SerifTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#0F1F15", border: `2px solid ${GREEN}`, borderRadius: 50, padding: "18px 36px", ...popIn(sp(6, 18)) }}>
          <Img src={staticFile(`${SLUG}/Qwen-Ai-Logo.png`)} style={{ width: 50, height: 50 }} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: TEXT }}>Qwen · Cohere · free mỗi ngày</span>
        </div>
      </Stage>
    ),
  },
  {
    first: 7,
    render: ({ f, at }) => {
      const marks = [0, 26, 50];
      const nums = [3, 10, 30];
      const k = marks.filter((m) => f >= at(7) + m).length - 1;
      const pop = k >= 0 ? spring({ frame: f - at(7) - marks[k], fps: FPS, config: { damping: 10, stiffness: 220, mass: 0.5 } }) : 0;
      const still = spring({ frame: f - at(7) - 72, fps: FPS, config: SNAPPY });
      return (
        <Stage gap={30}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, color: MUTED }}>Câu thứ</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 320, color: TEXT, lineHeight: 1, textShadow: `0 0 70px ${GREEN}77`, transform: `scale(${lerp(pop, 0.6, 1)})`, opacity: Math.min(1, pop * 1.5) }}>{k >= 0 ? nums[k] : ""}</div>
          <div style={{ display: "flex", gap: 20 }}>
            {nums.map((n, i) => (
              <div key={n} style={{ fontFamily: MONO, fontSize: 40, color: i <= k ? GREEN : BORDER, border: `2px solid ${i <= k ? GREEN : BORDER}`, borderRadius: 20, padding: "8px 22px" }}>✓ {n}</div>
            ))}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: GOLD, ...appear(still) }}>ta vẫn đang hỏi</div>
        </Stage>
      );
    },
  },
  {
    first: 8,
    render: ({ f, at, sp }) => {
      const sweep = interpolate(f, [at(9) + 6, at(9) + 30], [-120, 120], clamp);
      return (
        <Stage>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: MUTED, ...appear(sp(8)) }}>Người đời gọi nó là</div>
          {f >= at(9) - 2 ? (
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 36, ...popIn(sp(9, 0, { damping: 11, stiffness: 160, mass: 0.7 })) }}>
              <Img src={staticFile(`${SLUG}/logo-xKiro-green.png`)} style={{ width: 210, height: 210, filter: `drop-shadow(0 0 40px ${GREEN})` }} />
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 200, color: TEXT, letterSpacing: -4 }}>xKiro</div>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${50 + sweep - 12}%, #ffffff66 ${50 + sweep}%, transparent ${50 + sweep + 12}%)`, mixBlendMode: "overlay" }} />
            </div>
          ) : null}
        </Stage>
      );
    },
  },
  {
    first: 10,
    render: ({ f, at, sp }) => (
      <Stage gap={20}>
        <div style={{ fontFamily: MONO, fontSize: 120, color: TEXT, ...appear(sp(10)) }}>21:50</div>
        <div style={{ height: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...popIn(sp(10, 8, SOFT)), scale: "0.82" }}>
            <DocPage fill={interpolate(f, [at(10) + 40, at(10) + 90], [0, 1], clamp)} done={f >= at(10) + 90} blink={false} />
          </div>
        </div>
      </Stage>
    ),
  },
  {
    first: 11,
    render: ({ f, at, sp }) => (
      <Stage>
        <Card width={920} glow style={{ padding: 50, boxSizing: "border-box", ...appear(sp(11, 0, SOFT), 50) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: TEXT, color: TECH, borderRadius: 30, padding: "8px 22px", fontFamily: SANS, fontWeight: 700, fontSize: 28 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, opacity: f % 30 < 18 ? 1 : 0.3 }} />
            Live event
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: TEXT, marginTop: 26 }}>Welcome Drop</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: GOLD, marginTop: 6 }}>cơ duyên cho người mới nhập môn</div>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 24 }}>
            {["Tạo tài khoản", "Xác nhận Telegram", "Mở Welcome Drop"].map((s, i) => {
              const done = f >= at(11) + 24 + i * 16;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 22, ...appear(sp(11, 10 + i * 5), 20) }}>
                  <div style={{ width: 54, height: 54, borderRadius: 27, border: `2px solid ${done ? GREEN : BORDER}`, background: done ? GREEN : "transparent", color: done ? TECH : MUTED, fontFamily: SANS, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 42, color: done ? TEXT : MUTED }}>{s}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, ...popIn(sp(11, 84)) }}>
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, color: TEXT, letterSpacing: -4, textShadow: `0 0 60px ${GREEN}77` }}>
            {Math.round(interpolate(f, [at(11) + 84, at(11) + 110], [0, 50], clamp))}M
            <span style={{ color: MUTED, fontSize: 90 }}>–100M</span>
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: GREEN }}>tokens</span>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: TEXT, border: `2px solid ${BORDER}`, background: CARD, borderRadius: 40, padding: "16px 40px", ...appear(sp(11, 120), 20) }}>
          Khép lại <span style={{ color: RED }}>22/11</span>
        </div>
      </Stage>
    ),
  },
  {
    first: 12,
    render: ({ f, at, sp }) => {
      const orbit = (f - at(13)) / 30;
      const logos = ["OpenAI_dark.svg", "gemini.svg", "deepseek.svg", "Qwen-Ai-Logo.png", "Claude_ai.svg"];
      return (
        <Stage gap={60}>
          <div style={{ textAlign: "center", ...appear(sp(12)) }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: MUTED }}>Kẻ yếu</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: MUTED }}>thờ một vị đại năng</div>
          </div>
          {f >= at(13) - 2 ? (
            <div style={{ position: "relative", width: 900, height: 560, display: "flex", alignItems: "center", justifyContent: "center", ...appear(sp(13)) }}>
              {logos.map((l, i) => {
                const a = orbit + (i / logos.length) * Math.PI * 2;
                return <Img key={l} src={staticFile(`${SLUG}/${l}`)} style={{ position: "absolute", width: 74, height: 74, objectFit: "contain", left: 450 - 37 + Math.cos(a) * 400, top: 280 - 37 + Math.sin(a) * 240, opacity: sp(13, 8 + i * 3) }} />;
              })}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: GOLD, textShadow: `0 0 40px ${GOLD}66` }}>Kẻ mạnh</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: GREEN }}>một lệnh bài · cả thiên hạ</div>
              </div>
            </div>
          ) : null}
        </Stage>
      );
    },
  },
  {
    first: 14,
    render: ({ f, at, sp }) => {
      const q = "Đạo hữu từng bị AI bỏ rơi lúc nào?";
      const typed = f >= at(15) ? q.slice(0, Math.max(0, Math.floor((f - at(15)) / 1.6))) : "";
      const pulse = f >= at(15) + 50 ? 1 + 0.06 * Math.sin((f - at(15)) / 3) : 1;
      return (
        <Stage gap={40}>
          <Card width={900} style={{ ...appear(sp(14)) }}>
            <div style={{ display: "flex", gap: 22, padding: 34, alignItems: "flex-start" }}>
              <Img src={staticFile(`${SLUG}/logo-xKiro-green.png`)} style={{ width: 64, height: 64 }} />
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: MUTED }}>📌 Ghim · bần đạo</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: TEXT, marginTop: 8 }}>Lệnh bài ở đây 👉 xkiro.com</div>
              </div>
            </div>
          </Card>
          {f >= at(15) - 2 ? (
            <div style={{ width: 900, padding: "28px 34px", borderRadius: 50, background: "#1A1D1B", border: `2px solid ${BORDER}`, fontFamily: SANS, fontSize: 40, color: TEXT, minHeight: 50, ...appear(sp(15)) }}>
              {typed || <span style={{ color: MUTED }}>Thêm bình luận…</span>}
            </div>
          ) : null}
          {f >= at(15) + 48 ? (
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: TECH, background: GREEN, borderRadius: 60, padding: "26px 90px", boxShadow: `0 0 60px ${GREEN}88`, transform: `scale(${pulse * lerp(sp(15, 50), 0.6, 1)})`, opacity: sp(15, 50) }}>+ FOLLOW</div>
          ) : null}
        </Stage>
      );
    },
  },
];

const SHOT_START = SHOTS.map((s, i) => (i === 0 ? 0 : entry(s.first)));

type Sfx = { line: number; offset: number; src: string; vol: number };
const SFX: Sfx[] = [
  { line: 0, offset: 0.55, src: "sfx/win/cash-register.mp3", vol: 0.22 },
  { line: 0, offset: 1.6, src: "sfx/punch/bonk.mp3", vol: 0.18 },
  { line: 2, offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.35 },
  { line: 3, offset: 1.45, src: "sfx/punch/bonk.mp3", vol: 0.4 },
  { line: 4, offset: 2.4, src: "sfx/win/angelic.mp3", vol: 0.35 },
  { line: 5, offset: 0.1, src: "sfx/ui/whoosh.mp3", vol: 0.35 },
  { line: 6, offset: 0.4, src: "sfx/win/cash-register.mp3", vol: 0.3 },
  { line: 7, offset: 0, src: "sfx/ui/discord-ping.mp3", vol: 0.25 },
  { line: 7, offset: 0.87, src: "sfx/ui/discord-ping.mp3", vol: 0.25 },
  { line: 7, offset: 1.67, src: "sfx/ui/discord-ping.mp3", vol: 0.25 },
  { line: 9, offset: 0.05, src: "sfx/win/level-up.mp3", vol: 0.4 },
  { line: 10, offset: 3.0, src: "sfx/win/ding-correct.mp3", vol: 0.4 },
  { line: 11, offset: 0.8, src: "sfx/ui/discord-ping.mp3", vol: 0.3 },
  { line: 11, offset: 3.0, src: "sfx/win/cash-register.mp3", vol: 0.35 },
  { line: 13, offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.35 },
  { line: 15, offset: 1.7, src: "sfx/ui/iphone-ding.mp3", vol: 0.4 },
];

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 48;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: TECH }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${GREEN_DEEP}40 2px, transparent 2px)`, backgroundSize: "48px 48px", backgroundPosition: `${drift}px ${drift}px` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 700px at 50% 35%, ${GREEN_DEEP}30 0%, transparent 65%)` }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 80px #000000cc" }} />
    </AbsoluteFill>
  );
};

const ShotLayer: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const start = SHOT_START[index];
  const end = index + 1 < SHOTS.length ? SHOT_START[index + 1] : XKIRO_LIMIT_FRAMES;
  if (frame < start || frame >= end + FADE) return null;
  const f = frame - start;
  const dur = end - start;
  const at = (i: number) => entry(i) - start;
  const sp = (i: number, delay = 0, cfg = SNAPPY) => spring({ frame: f - at(i) - delay, fps: FPS, config: cfg });
  const inV = index === 0 ? 1 : spring({ frame: f, fps: FPS, config: SNAPPY });
  const out = interpolate(frame, [end, end + FADE], [1, 0], clamp);
  const push = interpolate(f, [0, dur], [1, 1.045], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, transform: `scale(${push * lerp(inV, 0.97, 1) * lerp(out, 1.04, 1)})`, filter: `blur(${lerp(Math.min(inV, out), 6, 0)}px)` }}>
      {SHOTS[index].render({ f, dur, at, sp })}
    </AbsoluteFill>
  );
};

const EMPH = /^(Claude|Pro|ChatGPT|Gemini|GPT,?|DeepSeek\.?"?|xKiro\.?|MiniMax|Telegram,?|linh|lực,?|thạch\.?|lệnh|bài\.?|miễn|phí\.?"?|Vạn|Tông|Nhất|Lệnh\.?|triệu|token\.?|mạnh|"?5-hour|limit|reached\.?|9:50|PM\."?)$/;

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = LINES.findIndex((l, i) => {
    const s = entry(i);
    const next = i + 1 < LINES.length ? entry(i + 1) : Math.round((l.end + 0.8) * FPS);
    return frame >= s && frame < next;
  });
  if (idx < 0) return null;
  const words = LINES[idx].t.split(/\s+/);
  const base = entry(idx);
  return (
    <AbsoluteFill style={{ top: 1300, bottom: 360, height: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 940 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - base - i * 2, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const emph = EMPH.test(w);
                    return (
            <span key={i} style={{ display: "inline-block", fontFamily: CAPTION_FONT, fontWeight: emph ? 800 : 600, fontSize: emph ? 56 : 50, color: emph ? GREEN : TEXT, lineHeight: 1.32, opacity: s, transform: `translateY(${lerp(s, 12, 0)}px)`, filter: `blur(${lerp(s, 4, 0)}px)`, textShadow: "0 3px 12px #000000f2" }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const XKiroLimit: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  const frame = useCurrentFrame();
  const fadeAll = interpolate(frame, [XKIRO_LIMIT_FRAMES - 12, XKIRO_LIMIT_FRAMES], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: TECH }}>
      <AbsoluteFill style={{ opacity: fadeAll }}>
        <Backdrop />
        {SHOTS.map((_, i) => (
          <ShotLayer key={i} index={i} />
        ))}
        <Caption />
      </AbsoluteFill>
      {bgm ? <Audio src={staticFile(`${SLUG}/bgm.mp3`)} volume={0.32} loop /> : null}
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round((LINES[s.line].start + s.offset) * FPS)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
