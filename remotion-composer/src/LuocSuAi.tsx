import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./luocsu_beats.json";
import scenesData from "./luocsu_scenes.json";
import T from "./luocsu_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const FPS = 30;

const BG = "#080A11";
const GOLD = "#D9A94E";
const INK = "#6E9BD8";
const JADE = "#4FD1A5";
const RED = "#E0576A";
const TEXT = "#F0E9DA";
const SEC = "#9AA3B5";
const MUTE = "#5D6478";

const PAL: Record<string, string> = { GOLD, INK, JADE, RED, TEXT, SEC, MUTE };
const col = (c?: string) => (c ? PAL[c] ?? c : SEC);

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const TOTAL = (beatsData as { total_duration: number }).total_duration;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};
const E = T as Record<string, Record<string, number>>;

type El = {
  k: string;
  key: string;
  t?: string;
  size?: number;
  color?: string;
  nums?: string[];
  org?: string;
  rest?: string;
  side?: number;
};
const SCENES = scenesData as Record<string, { kind: string; ch: string; els: El[] }>;

const ERA: Record<string, string> = {
  HK: "30 · 11 · 2022",
  C1: "TRƯỚC 2022",
  C2: "2023",
  C3: "2023",
  C4: "2024",
  C5: "2024",
  C6: "2025",
  C7: "2025",
  C8: "2025",
  C9: "HÔM NAY",
  CA: "HÔM NAY",
  CB: "NGÀY MAI",
};

const chSpans = beats.map((b) => ({ from: Math.round(b.start * FPS), to: Math.round((b.start + b.duration) * FPS), ch: b.name.slice(0, 2) }));
const chAt = (f: number) => chSpans.find((s) => f >= s.from && f < s.to)?.ch ?? "HK";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const fadeUp = (f: number, e: number, d = 12, dy = 22) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateY(" + interpolate(f, [e, e + d], [dy, 0], clamp) + "px)",
});
const pop = (f: number, e: number, d = 14) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.6, e + d], [0.84, 1.04, 1], clamp) + ")",
});
const slideIn = (f: number, e: number, d = 12, dx = -26) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: "translateX(" + interpolate(f, [e, e + d], [dx, 0], clamp) + "px)",
});

const STARS = Array.from({ length: 54 }, (_, i) => {
  const a = (i * 2654435761) % 1000;
  const b = (i * 40503) % 997;
  return { x: (a / 1000) * 100, y: (b / 997) * 100, r: 1 + ((i * 7) % 3) * 0.7, o: 0.1 + ((i * 13) % 5) * 0.045 };
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.16) % 96;
  const pulse = 0.5 + 0.5 * Math.sin(f / 92);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(0deg, " + GOLD + "0A 1px, transparent 1px)",
          backgroundSize: "100% 96px",
          backgroundPosition: "0 " + -drift + "px",
        }}
      />
      <AbsoluteFill>
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x + "%",
              top: s.y + "%",
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: "50%",
              background: TEXT,
              opacity: s.o * (0.6 + 0.4 * Math.sin(f / 40 + i)),
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 780px at 50% 26%, " + GOLD + (pulse > 0.5 ? "1E" : "18") + " 0%, transparent 64%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 700px at 50% 84%, " + INK + "14 0%, transparent 62%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px 96px " + BG }} />
    </AbsoluteFill>
  );
};

const RAIL_TOP = 200;
const RAIL_BOT = 1740;

const TimelineRail: React.FC = () => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / (TOTAL * FPS));
  const y = RAIL_TOP + (RAIL_BOT - RAIL_TOP) * p;
  const ticks = Object.keys(ERA).map((ch) => {
    const s = chSpans.find((x) => x.ch === ch);
    return s ? RAIL_TOP + (RAIL_BOT - RAIL_TOP) * (s.from / (TOTAL * FPS)) : null;
  });
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: RAIL_TOP, width: 2, height: RAIL_BOT - RAIL_TOP, background: GOLD + "22" }} />
      <div style={{ position: "absolute", left: 40, top: RAIL_TOP, width: 2, height: (RAIL_BOT - RAIL_TOP) * p, background: "linear-gradient(180deg, " + GOLD + "33, " + GOLD + "CC)" }} />
      {ticks.map((ty, i) =>
        ty === null ? null : <div key={i} style={{ position: "absolute", left: 34, top: ty, width: 14, height: 1, background: GOLD + "55" }} />
      )}
      <div style={{ position: "absolute", left: 34, top: y - 7, width: 14, height: 14, borderRadius: "50%", background: GOLD, boxShadow: "0 0 22px 5px " + GOLD + "77" }} />
    </>
  );
};

const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const era = ERA[chAt(f)] ?? "";
  return (
    <>
      <div style={{ position: "absolute", top: 74, left: 76, display: "flex", alignItems: "center", gap: 12, opacity: 0.5 }}>
        <div style={{ fontSize: 24 }}>📜</div>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 21, color: GOLD, letterSpacing: 5 }}>LƯỢC SỬ AI</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 64,
          fontFamily: "JetBrains Mono",
          fontSize: 20,
          color: INK,
          letterSpacing: 3,
          border: "1px solid " + INK + "44",
          borderRadius: 999,
          padding: "7px 18px",
          opacity: 0.85,
        }}
      >
        {era}
      </div>
    </>
  );
};

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <AbsoluteFill style={{ padding: "0 92px 0 104px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap, textAlign: "center" }}>
    {children}
  </AbsoluteFill>
);

const Num: React.FC<{ children: string }> = ({ children }) => (
  <span style={{ color: GOLD, fontWeight: 900, fontFamily: "JetBrains Mono", fontSize: "1.08em", letterSpacing: -0.5 }}>{children}</span>
);

const withNums = (t: string) =>
  t.split(/(\d[\d.]*%?)/g).map((part, i) => (/^\d/.test(part) ? <Num key={i}>{part}</Num> : <span key={i}>{part}</span>));

const Element: React.FC<{ el: El; e: number }> = ({ el, e }) => {
  const f = useCurrentFrame();
  const size = el.size ?? 46;
  const c = col(el.color);

  switch (el.k) {
    case "titlecard":
      return (
        <div style={{ ...pop(f, e, 18), textAlign: "center" }}>
          <div style={{ fontSize: 78, marginBottom: 22 }}>📜</div>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 122, fontWeight: 900, color: GOLD, letterSpacing: -4, lineHeight: 1 }}>
            {el.t!.replace("📜 ", "")}
          </div>
        </div>
      );
    case "sub":
      return (
        <div style={{ ...fadeUp(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: 40, fontWeight: 600, color: TEXT, lineHeight: 1.3, maxWidth: 880, letterSpacing: 0.5 }}>
          {el.t}
        </div>
      );
    case "stamp":
      return (
        <div
          style={{
            ...pop(f, e, 16),
            fontFamily: "JetBrains Mono",
            fontSize: 74,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: 2,
            border: "3px solid " + GOLD + "66",
            borderRadius: 18,
            padding: "20px 40px",
            background: GOLD + "10",
            boxShadow: "0 0 60px " + GOLD + "22",
          }}
        >
          {el.t}
        </div>
      );
    case "yearstamp":
      return (
        <div style={{ ...pop(f, e, 16), fontFamily: "JetBrains Mono", fontSize: 150, fontWeight: 700, color: GOLD, letterSpacing: -2, textShadow: "0 0 60px " + GOLD + "44" }}>
          {el.t}
        </div>
      );
    case "chnum":
      return (
        <div style={{ ...fadeUp(f, e, 10, 0), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, fontWeight: 700, color: GOLD, letterSpacing: 8 }}>{el.t}</div>
          <div style={{ width: 210, height: 2, background: "linear-gradient(90deg, transparent, " + GOLD + "99, transparent)" }} />
        </div>
      );
    case "openline":
      return (
        <div style={{ ...fadeUp(f, e, 14), fontFamily: "Be Vietnam Pro", fontSize: 58, fontWeight: 800, color: TEXT, lineHeight: 1.2, letterSpacing: -1, whiteSpace: "pre-line" }}>
          {el.t}
        </div>
      );
    case "big":
      return (
        <div
          style={{
            ...pop(f, e, 14),
            fontFamily: "Be Vietnam Pro",
            fontSize: size,
            fontWeight: 900,
            color: c,
            lineHeight: 1.14,
            letterSpacing: -1.5,
            whiteSpace: "pre-line",
            textShadow: "0 0 48px " + c + "44",
          }}
        >
          {el.t}
        </div>
      );
    case "quote":
      return (
        <div
          style={{
            ...pop(f, e, 16),
            fontFamily: "Be Vietnam Pro",
            fontSize: size,
            fontWeight: 800,
            color: GOLD,
            lineHeight: 1.26,
            letterSpacing: -0.5,
            whiteSpace: "pre-line",
            border: "2px solid " + GOLD + "55",
            background: GOLD + "10",
            borderRadius: 22,
            padding: "28px 36px",
            maxWidth: 880,
          }}
        >
          <span style={{ color: GOLD + "88" }}>“</span>
          {el.t}
          <span style={{ color: GOLD + "88" }}>”</span>
        </div>
      );
    case "row":
      return (
        <div style={{ ...slideIn(f, e, 12), display: "flex", alignItems: "flex-start", gap: 18, textAlign: "left", maxWidth: 900 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: GOLD, marginTop: size * 0.5, flexShrink: 0, boxShadow: "0 0 12px " + GOLD + "88" }} />
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{withNums(el.t!)}</div>
        </div>
      );
    case "pairq":
      return (
        <div style={{ ...slideIn(f, e, 10), fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 600, color: SEC, lineHeight: 1.25, textAlign: "left", width: 860 }}>
          {el.t}
        </div>
      );
    case "paira":
      return (
        <div style={{ ...slideIn(f, e, 10, 30), display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: 860, marginTop: -10, marginBottom: 8 }}>
          <div style={{ width: 26, height: 2, background: GOLD + "88", flexShrink: 0 }} />
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 800, color: TEXT, lineHeight: 1.25 }}>{el.t}</div>
        </div>
      );
    case "sectrow":
      return (
        <div style={{ ...slideIn(f, e, 12), display: "flex", alignItems: "baseline", gap: 16, textAlign: "left", maxWidth: 900 }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: size * 0.82,
              fontWeight: 700,
              color: BG,
              background: GOLD,
              borderRadius: 8,
              padding: "5px 13px",
              flexShrink: 0,
            }}
          >
            {el.org}
          </div>
          <div style={{ fontFamily: "Be Vietnam Pro", fontSize: size, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>{el.rest}</div>
        </div>
      );
    case "statline":
      return (
        <div
          style={{
            ...fadeUp(f, e, 12),
            fontFamily: "Be Vietnam Pro",
            fontSize: size,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.32,
            textAlign: "left",
            maxWidth: 900,
            borderLeft: "3px solid " + INK + "88",
            paddingLeft: 24,
          }}
        >
          {withNums(el.t!)}
        </div>
      );
    case "shiftbox":
      return (
        <div
          style={{
            ...pop(f, e, 13),
            fontFamily: "Be Vietnam Pro",
            fontSize: 48,
            fontWeight: 800,
            color: (el.side ?? 0) === 0 ? SEC : TEXT,
            lineHeight: 1.22,
            border: "2px solid " + ((el.side ?? 0) === 0 ? MUTE + "77" : GOLD + "77"),
            background: ((el.side ?? 0) === 0 ? MUTE : GOLD) + "12",
            borderRadius: 18,
            padding: "22px 32px",
            maxWidth: 860,
          }}
        >
          {el.t}
        </div>
      );
    case "arrow":
      return (
        <div style={{ ...fadeUp(f, e, 8, 8), fontFamily: "JetBrains Mono", fontSize: 34, color: GOLD, letterSpacing: 3, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 40 }}>↓</span>
          {el.t}
        </div>
      );
    case "ctabtn":
      return (
        <div
          style={{
            ...pop(f, e, 16),
            fontFamily: "Be Vietnam Pro",
            fontSize: 50,
            fontWeight: 900,
            color: BG,
            background: GOLD,
            borderRadius: 999,
            padding: "24px 56px",
            letterSpacing: 1,
          }}
        >
          {el.t}
        </div>
      );
    default:
      return (
        <div
          style={{
            ...fadeUp(f, e),
            fontFamily: "Be Vietnam Pro",
            fontSize: size,
            fontWeight: c === TEXT ? 600 : 500,
            color: c,
            lineHeight: 1.34,
            whiteSpace: "pre-line",
            maxWidth: 900,
          }}
        >
          {withNums(el.t!)}
        </div>
      );
  }
};

const GAPS: Record<string, number> = { casc: 18, pair: 12, sect: 20, stat: 22, shift: 20, open: 30, title: 34 };
const LISTKIND = new Set(["casc", "pair", "sect", "stat"]);

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const sc = SCENES[name];
  const e = E[name] ?? {};
  const gap = GAPS[sc.kind] ?? 26;
  const els = sc.els.map((el) => <Element key={el.key} el={el} e={e[el.key] ?? 0} />);
  if (LISTKIND.has(sc.kind)) {
    return (
      <Stage gap={gap}>
        <div style={{ display: "flex", flexDirection: "column", gap, alignItems: "flex-start", width: 884 }}>{els}</div>
      </Stage>
    );
  }
  return <Stage gap={gap}>{els}</Stage>;
};

export const LuocSuAi: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("luocsu/voice.mp3")} />
    {bgm ? <Audio src={staticFile("luocsu/bgm.mp3")} /> : null}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    <TimelineRail />
    <Chrome />
  </AbsoluteFill>
);
