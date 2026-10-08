import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./mngv_beats.json";
import T from "./mngv_timings.json";
import scenesData from "./mngv_scenes.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#0B0A12";
const COLORS: Record<string, string> = {
  GOLD: "#E5B54C",
  JADE: "#4FD1A5",
  RED: "#FF4D5E",
  TEXT: "#F2ECE0",
  SEC: "#A79FB8",
  MUTE: "#6E6780",
};
const { GOLD, JADE, MUTE } = COLORS;
const PANEL_H = 1040;

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};
const E = T as Record<string, Record<string, number>>;

type El = { type: string; k?: string; a?: string; t?: string; s?: number; c?: string; w?: number; who?: string; right?: boolean; h?: number };
type PanelShot = { k: string; src: string; focus: string };
type SceneSpec = { els: El[]; head?: { num: string; q: string }; panel?: PanelShot[] };
const SCENES = scenesData as unknown as Record<string, SceneSpec>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeUp = (f: number, e: number, d = 10, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
const pop = (f: number, e: number, d = 10) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.6, e + d], [0.8, 1.05, 1], clamp) + ")",
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.22) % 120;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, " + GOLD + "0A 2px, transparent 2px)", backgroundSize: "120px 100%", backgroundPosition: drift + "px 0" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 22%, " + GOLD + "1C 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 760px at 50% 82%, " + JADE + "12 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 90px " + BG }} />
    </AbsoluteFill>
  );
};

const Element: React.FC<{ el: El; e: Record<string, number> }> = ({ el, e }) => {
  const f = useCurrentFrame();
  const at0 = el.k ? e[el.k] ?? 0 : 0;
  const color = COLORS[el.c ?? "SEC"];
  const base = { fontFamily: "Be Vietnam Pro", whiteSpace: "pre-line" as const };
  switch (el.type) {
    case "gap":
      return <div style={{ height: el.h }} />;
    case "line":
      return <div style={{ ...fadeUp(f, at0), ...base, fontSize: el.s, fontWeight: el.w, color, lineHeight: 1.34 }}>{el.t}</div>;
    case "big":
      return <div style={{ ...pop(f, at0), ...base, fontSize: el.s, fontWeight: 900, color, lineHeight: 1.12, letterSpacing: -1.5, textShadow: "0 0 46px " + color + "44" }}>{el.t}</div>;
    case "quote":
      return (
        <div style={{ ...pop(f, at0), ...base, fontSize: el.s, fontWeight: 800, color, lineHeight: 1.22, letterSpacing: -0.5, border: "2px solid " + color + "59", background: color + "12", borderRadius: 22, padding: "26px 34px" }}>{el.t}</div>
      );
    case "item":
      return (
        <div style={{ ...fadeUp(f, at0, 10, 16), ...base, fontSize: el.s, fontWeight: 800, color, textAlign: "left", width: "100%", paddingLeft: 26, borderLeft: "3px solid " + COLORS.RED + "66", lineHeight: 1.3 }}>{el.t}</div>
      );
    case "says": {
      const align = el.right ? "flex-end" : "flex-start";
      return (
        <div style={{ ...fadeUp(f, at0), width: "100%", display: "flex", flexDirection: "column", alignItems: align, gap: 8, textAlign: el.right ? "right" : "left" }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, fontWeight: 700, color: MUTE, letterSpacing: 2 }}>{el.who}</div>
          <div style={{ ...base, fontSize: el.s, fontWeight: 700, color, lineHeight: 1.26, border: "2px solid " + color + "45", background: color + "0F", borderRadius: 20, padding: "16px 26px", maxWidth: 880 }}>{el.t}</div>
        </div>
      );
    }
    case "skull":
      return <div style={{ ...pop(f, at0 + 6), fontSize: 76 }}>💀</div>;
    case "emoji":
      return <div style={{ ...pop(f, at0), fontSize: 62 }}>{el.t}</div>;
    case "clock":
      return (
        <div style={{ ...pop(f, at0, 12), fontFamily: "JetBrains Mono", fontSize: 120, fontWeight: 700, color, letterSpacing: -2, textShadow: "0 0 50px " + color + "55" }}>{el.t}</div>
      );
    case "btn":
      return (
        <div style={{ ...pop(f, at0, 12), ...base, fontSize: 54, fontWeight: 900, color: BG, background: color, borderRadius: 28, padding: "26px 50px", lineHeight: 1.14, textAlign: "center" }}>{el.t}</div>
      );
    default:
      return null;
  }
};

const ChapterHead: React.FC<{ e: Record<string, number>; num: string; quote: string }> = ({ e, num, quote }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "0 74px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 38, textAlign: "center" }}>
      <div style={{ ...fadeUp(f, e.dot), display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 46 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 34, fontWeight: 700, color: GOLD, letterSpacing: 6 }}>{num}</div>
      </div>
      <div style={{ ...fadeUp(f, e.dot, 12, 0), width: 190, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "88, transparent)" }} />
      <Element el={{ type: "quote", k: "q", t: quote, s: 62, c: "GOLD" }} e={e} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ shots: PanelShot[]; e: Record<string, number> }> = ({ shots, e }) => {
  const f = useCurrentFrame();
  const active = shots.reduce((cur, s, i) => ((e[s.k] ?? 0) <= f ? i : cur), 0);
  const shot = shots[active];
  const since = f - (active === 0 ? 0 : e[shot.k] ?? 0);
  const flash = active === 0 ? 1 : interpolate(since, [0, 6], [0.4, 1], clamp);
  const scale = interpolate(since, [0, 300], [1.0, 1.12], clamp);
  const style: React.CSSProperties = { width: 1080, height: PANEL_H, objectFit: "cover", objectPosition: shot.focus, transform: "scale(" + scale + ")", transformOrigin: shot.focus };
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: PANEL_H, overflow: "hidden", opacity: flash }}>
        {shot.src.endsWith(".mp4") ? <OffthreadVideo key={shot.k} src={staticFile(shot.src)} muted style={style} /> : <Img src={staticFile(shot.src)} style={style} />}
      </div>
      <div style={{ position: "absolute", top: PANEL_H, left: 0, width: 1080, height: 3, background: "linear-gradient(90deg, transparent, " + GOLD + "AA, transparent)" }} />
    </>
  );
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const sc = SCENES[name];
  const e = E[name] ?? {};
  if (sc.head) return <ChapterHead e={e} num={sc.head.num} quote={sc.head.q} />;
  const els = sc.els.map((el, i) => <Element key={i} el={el} e={e} />);
  if (sc.panel) {
    return (
      <AbsoluteFill>
        <Panel shots={sc.panel} e={e} />
        <div style={{ position: "absolute", top: PANEL_H, left: 0, width: 1080, height: 1920 - PANEL_H, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 18, padding: "0 74px", textAlign: "center", boxSizing: "border-box" }}>
          {els}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ padding: "0 74px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 24, textAlign: "center" }}>
      {els}
    </AbsoluteFill>
  );
};

export const MatNgonGiaoVien: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("mngv/voice.mp3")} />
    {bgm ? <Audio src={staticFile("mngv/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
