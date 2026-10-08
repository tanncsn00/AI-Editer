import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { Sfx } from "./Sfx";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const FPS = 30;
export const LEAD_IN = 18;

export const BG = "#0B0A12";
export const GOLD = "#E5B54C";
export const JADE = "#4FD1A5";
export const RED = "#FF4D5E";
export const TEXT = "#F2ECE0";
export const SEC = "#A79FB8";
export const MUTE = "#6E6780";
export const PHONE = "#15131F";
export const HER = "#2A2638";
export const HIM = "#3B6FE0";

type BeatInfo = { index: number; name: string; start: number; duration: number };
export type Timings = Record<string, Record<string, number>>;

export const makeAt = (beatsData: unknown) => {
  const beats = (beatsData as { beats: BeatInfo[] }).beats;
  return (name: string) => {
    const b = beats.find((x) => x.name === name)!;
    return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
  };
};


export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const fadeUp = (f: number, e: number, d = 7, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
export const pop = (f: number, e: number, d = 8) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.6, e + d], [0.8, 1.05, 1], clamp) + ")",
});

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.22) % 120;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(90deg, " + GOLD + "0A 2px, transparent 2px)",
          backgroundSize: "120px 100%",
          backgroundPosition: drift + "px 0",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 22%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 82%, " + RED + "12 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 90px " + BG }} />
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <AbsoluteFill style={{ padding: "0 74px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

export const Line: React.FC<{ e: number; size?: number; color?: string; weight?: number; children: React.ReactNode }> = ({ e, size = 46, color = SEC, weight = 500, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...fadeUp(f, e), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: weight, color, lineHeight: 1.34, whiteSpace: "pre-line" }}>{children}</div>;
};

export const Big: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 78, color = RED, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...pop(f, e, 8), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "pre-line", textShadow: "0 0 46px " + color + "44" }}>
      {children}
    </div>
  );
};

export const Quote: React.FC<{ e: number; size?: number; color?: string; children: React.ReactNode }> = ({ e, size = 58, color = GOLD, children }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...pop(f, e, 9),
        fontFamily: "Be Vietnam Pro",
        fontSize: size,
        fontWeight: 800,
        color,
        lineHeight: 1.22,
        letterSpacing: -0.5,
        whiteSpace: "pre-line",
        border: "2px solid " + color + "59",
        background: color + "12",
        borderRadius: 22,
        padding: "26px 34px",
      }}
    >
      {children}
    </div>
  );
};

export const Emoji: React.FC<{ e: number; size?: number; children: React.ReactNode }> = ({ e, size = 72, children }) => {
  const f = useCurrentFrame();
  return <div style={{ ...pop(f, e, 7), fontSize: size }}>{children}</div>;
};

export const Says: React.FC<{ e: number; eWho: number; who: string; text: string; color: string; size?: number; align?: "flex-start" | "flex-end" }> = ({ e, eWho, who, text, color, size = 46, align = "flex-start" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: align, gap: 10, textAlign: align === "flex-end" ? "right" : "left" }}>
      <div style={{ ...fadeUp(f, eWho), fontFamily: "JetBrains Mono", fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{who}</div>
      <div
        style={{
          ...pop(f, e, 8),
          fontFamily: "Be Vietnam Pro",
          fontSize: size,
          fontWeight: 800,
          color,
          lineHeight: 1.26,
          border: "2px solid " + color + "45",
          background: color + "0F",
          borderRadius: 20,
          padding: "20px 28px",
          maxWidth: 900,
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Bubble: React.FC<{ e: number; mine?: boolean; size?: number; children: React.ReactNode }> = ({ e, mine = false, size = 52, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
      <div
        style={{
          ...pop(f, e, 7),
          transformOrigin: mine ? "right bottom" : "left bottom",
          fontFamily: "Be Vietnam Pro",
          fontSize: size,
          fontWeight: 600,
          color: "#FFFFFF",
          background: mine ? HIM : HER,
          borderRadius: mine ? "34px 34px 8px 34px" : "34px 34px 34px 8px",
          padding: "22px 34px",
          maxWidth: 820,
          lineHeight: 1.25,
          textAlign: "left",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Typing: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ display: "flex", gap: 12, background: HIM + "66", borderRadius: 30, padding: "22px 30px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#FFFFFF", opacity: 0.35 + 0.65 * Math.abs(Math.sin((f - from) / 5 + i * 0.9)) }} />
        ))}
      </div>
    </div>
  );
};

export const Bolt: React.FC<{ x: number; flip?: boolean; e: number }> = ({ x, flip = false, e }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [e, e + 2, e + 6, e + 9, e + 14], [0, 1, 0.2, 1, 0], clamp);
  return (
    <svg width={220} height={520} viewBox="0 0 220 520" style={{ position: "absolute", top: 0, left: x, opacity: o, transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 0 24px " + GOLD + ")" }}>
      <polygon points="120,0 40,240 110,240 30,520 190,190 115,190 170,0" fill="#FFF3C4" />
    </svg>
  );
};


export const shortFrames = (beatsData: unknown, cta: boolean) => {
  const data = beatsData as { beats: BeatInfo[]; total_duration: number };
  const end = cta ? data.total_duration : data.beats.find((b) => b.name === "CTA")!.start;
  return LEAD_IN + Math.round(end * FPS);
};

export const ShortShell: React.FC<{
  slug: string;
  beatsData: unknown;
  hook: React.FC;
  scenes: Array<[string, React.FC]>;
  booms: number[];
  bgm: boolean;
  cta: boolean;
}> = ({ slug, beatsData, hook: Hook, scenes, booms, bgm, cta }) => {
  const at = makeAt(beatsData);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      {bgm ? <Audio src={staticFile(slug + "/bgm.mp3")} /> : null}
      <Audio src={staticFile("mndl1/rumble.mp3")} volume={0.5} />
      {booms.map((b) => (
        <Sfx key={b} name="punch/vine-boom" at={b / FPS} volume={0.55} />
      ))}
      <Sequence from={0} durationInFrames={LEAD_IN + at("HEAD").from}>
        <Hook />
      </Sequence>
      <Sequence from={LEAD_IN}>
        <Audio src={staticFile(slug + "/voice.mp3")} />
        {scenes
          .filter(([name]) => cta || name !== "CTA")
          .map(([name, C]) => {
            const { from, dur } = at(name);
            return (
              <Sequence key={name} from={from} durationInFrames={dur}>
                <C />
              </Sequence>
            );
          })}
      </Sequence>
    </AbsoluteFill>
  );
};
