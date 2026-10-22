import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import timeline from "./mnme_timeline.json";

loadBeVietnamPro("normal", { weights: ["500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext", "vietnamese"] });

const FPS = 30;
const LEAD = 4;
const PAGE_LEAD = 0.18;
const TAIL = 0.6;

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const JADE = "#4FD1A5";
const RED = "#FF4D5E";
const AMBER = "#FF9F45";
const TEXT = "#F2ECE0";
const SEC = "#A79FB8";
const MUTE = "#6E6780";
const PINK = "#FF8FAB";
const BLUSH = "#FFE3EA";
const WARM_BEATS = ["LOICHUC", "CTA"];
const WARM_FADE = 10;
const WARM_LEAD = 5;
const SERIES_LABEL = "THIÊN CƠ MẬT NGÔN · TỪ MẪU";

type Kind = "narr" | "red" | "gold" | "jade" | "amber" | "cta" | "cue" | "term" | "scroll";
type Line = { t: string; kind: Kind; start: number; end: number };
type Page = { start: number; lines: Line[] };
type Beat = { name: string; header: string; start: number; end: number; pages: Page[] };
const TL = timeline as { title: string; total: number; beats: Beat[] };

export const MAT_NGON_ME_FRAMES = Math.ceil((TL.total + TAIL) * FPS);

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const fr = (s: number) => Math.round(s * FPS);
const viet = { fontFamily: "'Be Vietnam Pro'" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const fadeUp = (f: number, e: number, d = 8) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: `translateY(${interpolate(f, [e, e + d], [22, 0], clamp)}px)`,
});
const pop = (f: number, e: number, d = 10) => ({
  opacity: interpolate(f, [e, e + d], [0, 1], clamp),
  transform: `scale(${interpolate(f, [e, e + d * 0.6, e + d], [0.8, 1.06, 1], clamp)})`,
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.22) % 120;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(90deg, ${GOLD}0A 2px, transparent 2px)`, backgroundSize: "120px 100%", backgroundPosition: `${drift}px 0` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 760px at 50% 22%, ${GOLD}1C 0%, transparent 62%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 820px 760px at 50% 82%, ${RED}12 0%, transparent 62%)` }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 300px 90px ${BG}` }} />
    </AbsoluteFill>
  );
};

const Chrome: React.FC<{ header: string }> = ({ header }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ ...fadeUp(f, 0, 10), position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", ...mono, fontSize: 26, fontWeight: 700, color: MUTE, letterSpacing: 7 }}>
        {header.startsWith("ĐỆ") ? `📜 ${header}` : header === "LỜI CHÚC 20/10" ? `🌸 ${header}` : SERIES_LABEL}
      </div>
      <div style={{ position: "absolute", top: 46, right: 54, ...viet, fontSize: 30, fontWeight: 800, color: PINK, border: `2px solid ${PINK}88`, background: `${PINK}18`, borderRadius: 999, padding: "8px 22px" }}>🌸 20/10</div>
      <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, textAlign: "center", ...mono, fontSize: 22, fontWeight: 500, color: MUTE, letterSpacing: 6 }}>ĐỘ KIẾP CÙNG BẦN ĐẠO</div>
    </AbsoluteFill>
  );
};

const withQuotes = (t: string, quoteColor = GOLD) =>
  t.split('"').map((seg, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: quoteColor, fontStyle: "italic", paddingRight: "0.18em" }}>“{seg}”</span>
    ) : (
      <span key={i}>{seg}</span>
    )
  );

const LOOK: Record<"narr" | "amber" | "red" | "jade" | "gold", { size: number; weight: number; color: string; glow?: boolean }> = {
  narr: { size: 54, weight: 700, color: TEXT },
  amber: { size: 54, weight: 800, color: AMBER },
  red: { size: 56, weight: 800, color: RED, glow: true },
  jade: { size: 56, weight: 800, color: JADE, glow: true },
  gold: { size: 62, weight: 900, color: GOLD, glow: true },
};

const LineView: React.FC<{ line: Line; beatStart: number; warm: boolean }> = ({ line, beatStart, warm }) => {
  const f = useCurrentFrame();
  const e = fr(line.start - beatStart) - (warm ? WARM_LEAD : LEAD);
  const base = { ...viet, lineHeight: 1.28, textAlign: "center" as const };
  if (line.kind === "scroll" && line.t.includes('"')) {
    return (
      <div style={{ ...pop(f, e), ...base, fontSize: 70, fontWeight: 900, color: GOLD, textTransform: "uppercase", lineHeight: 1.14, letterSpacing: -1, border: `2px solid ${GOLD}66`, background: `${GOLD}12`, borderRadius: 22, padding: "30px 40px", textShadow: `0 0 46px ${GOLD}44` }}>
        “{line.t.replace(/"/g, "")}”
      </div>
    );
  }
  if (line.kind === "scroll") {
    return (
      <div style={{ ...fadeUp(f, e), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ fontSize: 64 }}>📜</div>
        <div style={{ ...mono, fontSize: 38, fontWeight: 700, color: GOLD, letterSpacing: 7, textTransform: "uppercase" }}>{line.t.replace(/\.$/, "")}</div>
        <div style={{ width: 200, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}88, transparent)` }} />
      </div>
    );
  }
  if (line.kind === "cue") {
    return <div style={{ ...fadeUp(f, e), ...base, fontSize: 50, fontWeight: 600, color: SEC }}>{line.t}</div>;
  }
  if (line.kind === "term") {
    return (
      <div style={{ ...pop(f, e), ...base, fontSize: 96, fontWeight: 900, color: RED, letterSpacing: -2, lineHeight: 1.06, textShadow: `0 0 60px ${RED}55`, marginTop: 6 }}>
        {line.t.replace(/\.$/, "")}
      </div>
    );
  }
  if (line.kind === "cta") {
    if (/Follow/.test(line.t)) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ ...pop(f, e), ...viet, fontSize: 50, fontWeight: 900, color: BG, background: GOLD, borderRadius: 999, padding: "24px 56px", letterSpacing: 1 }}>▶ FOLLOW BẦN ĐẠO</div>
          <div style={{ ...fadeUp(f, e), ...base, fontSize: 46, fontWeight: 700, color: SEC }}>{line.t}</div>
        </div>
      );
    }
    return <div style={{ ...fadeUp(f, e), ...base, fontSize: 56, fontWeight: 800, color: GOLD }}>{line.t}</div>;
  }
  const look = warm ? { ...LOOK[line.kind], color: line.kind === "narr" ? BLUSH : line.kind === "jade" ? GOLD : PINK } : LOOK[line.kind];
  const anim = warm ? fadeUp(f, e, WARM_FADE) : line.kind === "gold" ? pop(f, e) : fadeUp(f, e);
  return (
    <div style={{ ...anim, ...base, fontSize: look.size, fontWeight: look.weight, color: look.color, textShadow: look.glow ? `0 0 34px ${look.color}44` : undefined }}>
      {withQuotes(line.t, line.kind === "gold" ? TEXT : GOLD)}
    </div>
  );
};

const PageView: React.FC<{ page: Page; beatStart: number; until: number; warm: boolean }> = ({ page, beatStart, until, warm }) => {
  const f = useCurrentFrame();
  const a = fr(page.start - PAGE_LEAD - beatStart) - LEAD;
  const z = fr(until - beatStart);
  if (f < a || f >= z) return null;
  const opacity = interpolate(f, [z - 7, z], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity, padding: "260px 74px 240px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 38 }}>
      {page.lines.map((line, i) => (
        <LineView key={i} line={line} beatStart={beatStart} warm={warm} />
      ))}
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{ beat: Beat }> = ({ beat }) => {
  const f = useCurrentFrame();
  const warm = WARM_BEATS.includes(beat.name);
  const dur = fr(beat.end - beat.start);
  const zoom = interpolate(f, [0, dur], [1, 1.03], clamp);
  const fadeOut = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {warm ? <AbsoluteFill style={{ opacity: interpolate(f, [0, 30], [0, 1], clamp), background: `radial-gradient(ellipse 900px 900px at 50% 45%, ${PINK}22 0%, transparent 65%)` }} /> : null}
      <Chrome header={beat.header} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {beat.pages.map((p, i) => (
          <PageView key={i} page={p} warm={warm} beatStart={beat.start} until={i + 1 < beat.pages.length ? beat.pages[i + 1].start - PAGE_LEAD - LEAD / FPS : beat.end} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MatNgonMe: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    {bgm ? <Audio src={staticFile("mnme/bgm.mp3")} /> : null}
    <Audio src={staticFile("mnme/voice.mp3")} />
    {TL.beats.map((b, i) => {
      const from = Math.max(0, fr(b.start - PAGE_LEAD) - LEAD);
      const end = i === TL.beats.length - 1 ? MAT_NGON_ME_FRAMES : fr(b.end);
      return (
        <Sequence key={b.name} from={from} durationInFrames={end - from}>
          <BeatView beat={{ ...b, start: from / FPS, end: end / FPS }} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
