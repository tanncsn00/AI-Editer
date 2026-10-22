import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import timeline from "./pov_bds_timeline.json";

loadBeVietnamPro("normal", { weights: ["500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext", "vietnamese"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const LEAD = 4;
const PAGE_LEAD = 0.18;
const TAIL = 0.6;

const BG_NAVY = "#0F1B2E";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";

type Kind = "narr" | "red" | "gold" | "jade" | "amber" | "cta" | "cue" | "term";
type Line = { t: string; kind: Kind; start: number; end: number };
type Page = { start: number; lines: Line[] };
type Beat = { name: string; header: string; start: number; end: number; pages: Page[] };
const TL = timeline as { title: string; total: number; beats: Beat[] };

export const POV_BDS_FRAMES = Math.ceil((TL.total + TAIL) * FPS);

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fr = (s: number) => Math.round(s * FPS);

const fadeUp = (f: number, e: number, d = 8) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: `translateY(${interpolate(f, [e, e + d], [22, 0], clamp)}px)`,
});
const pop = (f: number, e: number, d = 14) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: `scale(${interpolate(f, [e, e + d * 0.6, e + d], [0.8, 1.06, 1], clamp)})`,
});

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="bdsgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="bdsgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="bdsglow" cx="50%" cy="46%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.07" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bdsscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#bdsgrid)" />
        <rect width={W} height={H} fill="url(#bdsgrid2)" />
        <rect width={W} height={H} fill="url(#bdsglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#bdsscan)" />
        <g stroke={AMBER} strokeWidth={1.5} opacity={0.5}>
          <path d="M 30 30 L 30 60 M 30 30 L 60 30" fill="none" />
          <path d={`M ${W - 30} 30 L ${W - 30} 60 M ${W - 30} 30 L ${W - 60} 30`} fill="none" />
          <path d={`M 30 ${H - 30} L 30 ${H - 60} M 30 ${H - 30} L 60 ${H - 30}`} fill="none" />
          <path d={`M ${W - 30} ${H - 30} L ${W - 30} ${H - 60} M ${W - 30} ${H - 30} L ${W - 60} ${H - 30}`} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const Chrome: React.FC<{ idx: number; header: string }> = ({ idx, header }) => {
  const f = useCurrentFrame();
  const num = String(idx + 1).padStart(2, "0");
  const total = String(TL.beats.length).padStart(2, "0");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 110, right: 80 }}>
        <div style={{ ...fadeUp(f, 0, 10), ...mono, fontSize: 26, fontWeight: 700, color: AMBER, letterSpacing: 4 }}>[{num} / {total}]</div>
        <div style={{ ...fadeUp(f, 4, 10), height: 1, background: AMBER, opacity: 0.5, margin: "16px 0 18px" }} />
        <div style={{ ...fadeUp(f, 8, 10), ...mono, fontSize: 28, fontWeight: 700, color: TEXT_SEC, letterSpacing: 5 }}>{header}</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 96, textAlign: "center" }}>
        <div style={{ height: 1, background: AMBER, opacity: 0.4, marginBottom: 20 }} />
        <div style={{ ...mono, fontSize: 20, fontWeight: 500, color: TEXT_MUTE, letterSpacing: 3 }}>fig.{idx + 1} · {header.toLowerCase()}</div>
        <div style={{ ...mono, fontSize: 18, fontWeight: 500, color: TEXT_MUTE, letterSpacing: 4, marginTop: 12 }}>⚡ truyền kỳ · địa ốc tông · 2026</div>
      </div>
    </AbsoluteFill>
  );
};

const Corners: React.FC<{ color: string }> = ({ color }) => {
  const arm = { position: "absolute" as const, background: color };
  const L = 26;
  return (
    <>
      <div style={{ ...arm, left: -8, top: -8, width: L, height: 3 }} />
      <div style={{ ...arm, left: -8, top: -8, width: 3, height: L }} />
      <div style={{ ...arm, right: -8, top: -8, width: L, height: 3 }} />
      <div style={{ ...arm, right: -8, top: -8, width: 3, height: L }} />
      <div style={{ ...arm, left: -8, bottom: -8, width: L, height: 3 }} />
      <div style={{ ...arm, left: -8, bottom: -8, width: 3, height: L }} />
      <div style={{ ...arm, right: -8, bottom: -8, width: L, height: 3 }} />
      <div style={{ ...arm, right: -8, bottom: -8, width: 3, height: L }} />
    </>
  );
};

const withQuotes = (t: string) =>
  t.split('"').map((seg, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: AMBER_BRIGHT, fontStyle: "italic" }}>“{seg}”</span>
    ) : (
      <span key={i}>{seg}</span>
    )
  );

const LOOK: Record<Exclude<Kind, "cue" | "term" | "cta">, { size: number; weight: number; color: string; glow?: boolean }> = {
  narr: { size: 54, weight: 700, color: TEXT_PRI },
  amber: { size: 54, weight: 800, color: AMBER },
  red: { size: 56, weight: 800, color: WARNING_RED, glow: true },
  jade: { size: 56, weight: 800, color: JADE, glow: true },
  gold: { size: 62, weight: 900, color: AMBER_BRIGHT, glow: true },
};

const LineView: React.FC<{ line: Line; beatStart: number }> = ({ line, beatStart }) => {
  const f = useCurrentFrame();
  const e = fr(line.start - beatStart) - LEAD;
  const base = { fontFamily: "'Be Vietnam Pro'", lineHeight: 1.28, textAlign: "center" as const };
  if (line.kind === "cue") {
    return <div style={{ ...fadeUp(f, e), ...mono, fontSize: 34, fontWeight: 700, color: TEXT_SEC, letterSpacing: 3 }}>// {line.t}</div>;
  }
  if (line.kind === "term") {
    return (
      <div style={{ ...pop(f, e, 10), position: "relative", border: `3px solid ${AMBER}`, background: AMBER + "14", padding: "30px 54px", marginTop: 10 }}>
        <Corners color={AMBER} />
        <div style={{ ...base, fontSize: 92, fontWeight: 900, color: AMBER, letterSpacing: -1.5, textShadow: `0 0 50px ${AMBER}66` }}>{line.t.replace(/\.$/, "")}</div>
      </div>
    );
  }
  if (line.kind === "cta") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ ...pop(f, e, 10), fontFamily: "'Be Vietnam Pro'", fontSize: 54, fontWeight: 900, color: BG_NAVY, background: AMBER, padding: "24px 64px", letterSpacing: 2, boxShadow: `0 0 60px ${AMBER}55` }}>
          ▶ THEO DÕI
        </div>
        <div style={{ ...fadeUp(f, e), ...base, fontSize: 48, fontWeight: 700, color: TEXT_PRI }}>{line.t}</div>
      </div>
    );
  }
  const look = LOOK[line.kind];
  const anim = line.kind === "gold" ? pop(f, e, 10) : fadeUp(f, e);
  return (
    <div style={{ ...anim, ...base, fontSize: look.size, fontWeight: look.weight, color: look.color, textShadow: look.glow ? `0 0 34px ${look.color}44` : undefined }}>
      {withQuotes(line.t)}
    </div>
  );
};

const PageView: React.FC<{ page: Page; beatStart: number; until: number }> = ({ page, beatStart, until }) => {
  const f = useCurrentFrame();
  const a = fr(page.start - PAGE_LEAD - beatStart) - LEAD;
  const z = fr(until - beatStart);
  const opacity = Math.min(interpolate(f, [z - 7, z], [1, 0], clamp), f >= a ? 1 : 0);
  if (f < a || f >= z) return null;
  return (
    <AbsoluteFill style={{ opacity, padding: "300px 80px 260px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 38 }}>
      {page.lines.map((line, i) => (
        <LineView key={i} line={line} beatStart={beatStart} />
      ))}
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ beat: Beat; idx: number }> = ({ beat, idx }) => {
  const f = useCurrentFrame();
  const dur = fr(beat.end - beat.start);
  const zoom = interpolate(f, [0, dur], [1, 1.03], clamp);
  const fadeOut = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Chrome idx={idx} header={beat.header} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {beat.pages.map((p, i) => (
          <PageView key={i} page={p} beatStart={beat.start} until={i + 1 < beat.pages.length ? beat.pages[i + 1].start - PAGE_LEAD - LEAD / FPS : beat.end} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PovBds: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG />
    {bgm ? <Audio src={staticFile("pov_bds/bgm.mp3")} /> : null}
    <Audio src={staticFile("pov_bds/voice.mp3")} />
    {TL.beats.map((b, i) => {
      const from = Math.max(0, fr(b.start - PAGE_LEAD) - LEAD);
      const end = i === TL.beats.length - 1 ? POV_BDS_FRAMES : fr(b.end);
      return (
        <Sequence key={b.name} from={from} durationInFrames={end - from}>
          <BeatView beat={{ ...b, start: from / FPS, end: end / FPS }} idx={i} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
