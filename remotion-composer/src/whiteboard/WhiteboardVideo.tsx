import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Sequence, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Pangolin";
import { getLength, getPointAtLength, getSubpaths } from "@remotion/paths";
import rough from "roughjs";
import { AMBER, BG, GOLD, GREY, INK, JADE, Mark, P, R, RED, Scenes, Sh, movePath, tint } from "./shapes";

export const { fontFamily: HAND_FONT, waitUntilDone: handFontReady } = loadFont("normal", { weights: ["400"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const LEAD = 4;
const PAGE_LEAD = 0.18;
const TAIL = 0.6;
const PAGE_FADE = 8;
const TEXT_MAX_W = 960;
const BANNER_MAX_W = 860;
const TEXT_TOP = 1080;
const TEXT_BOTTOM = 1790;
const ROW_GAP = 1.2;
const LINE_GAP = 16;
const DRAW_SPEED = 80;
const HAND_REST = { x: 1240, y: 2150 };
const HAND_GLIDE = 16;
const HAND_AWAY = 10;
const SCRIBBLE_VOLUME = 0.32;
const SCRIBBLE_SRC = "sfx/draw/scribble.mp3";
const INK_MASK_RATIO = 0.06;
const INK_FILL_FROM = 0.85;

type Kind = "narr" | "red" | "gold" | "jade" | "amber" | "cta" | "cue" | "term" | "scroll";
type Line = { t: string; kind: Kind; start: number; end: number };
type Page = { start: number; lines: Line[] };
type Beat = { name: string; header: string; start: number; end: number; pages: Page[] };
export type Timeline = { title: string; total: number; beats: Beat[] };
type DoodlePart = { fill: string; rule: string; subs: string[] };
export type Doodles = Record<string, { w: number; h: number; parts: DoodlePart[] }>;
export type Sfx = { line: string; offset?: number; src: string; vol: number };

export const whiteboardFrames = (tl: Timeline) => Math.ceil((tl.total + TAIL) * FPS);

const LOOK: Record<Kind, { size: number; col: string }> = {
  narr: { size: 52, col: INK },
  red: { size: 54, col: RED },
  gold: { size: 56, col: GOLD },
  jade: { size: 56, col: JADE },
  amber: { size: 54, col: AMBER },
  cta: { size: 52, col: GOLD },
  cue: { size: 48, col: GREY },
  term: { size: 96, col: RED },
  scroll: { size: 64, col: INK },
};

const curlyQuotes = (t: string) => {
  let open = true;
  return t.replace(/"/g, () => {
    const q = open ? "“" : "”";
    open = !open;
    return q;
  });
};

type Row = { text: string; x: number; y: number; w: number; size: number; col: string };
type Stroke =
  | { kind: "path"; d: string; col: string; width: number; len: number }
  | { kind: "label"; x: number; y: number; w: number; size: number; text: string; col: string; len: number }
  | { kind: "ink"; body: { d: string; rule: string }[]; ink: { d: string; rule: string }[]; subs: { d: string; len: number }[]; col: string; maskW: number; len: number };
type Task =
  | { kind: "text"; page: number; start: number; end: number; rows: Row[] }
  | { kind: "draw"; page: number; start: number; end: number; strokes: Stroke[]; total: number };
type PagePlan = { from: number; to: number; header: string };
type Plan = { pages: PagePlan[]; tasks: Task[] };
type Measure = (t: string, s: number) => number;

const fr = (s: number) => Math.round(s * FPS);
const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const makeMeasure = (): Measure => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  return (text, size) => {
    ctx.font = `${size}px "${HAND_FONT}"`;
    return ctx.measureText(text).width;
  };
};

const wrap = (text: string, size: number, measure: Measure) => {
  const rows: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && measure(next, size) > TEXT_MAX_W) {
      rows.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) rows.push(cur);
  return rows;
};

const layoutRows = (lines: Line[], measure: Measure) => {
  const perLine = lines.map((ln) => {
    const look = LOOK[ln.kind];
    let size = ln.kind === "scroll" && ln.t.includes('"') ? 92 : look.size;
    const text = curlyQuotes(ln.t);
    let rows = wrap(text, size, measure);
    if (ln.kind === "term" || ln.kind === "scroll") {
      const maxW = ln.kind === "scroll" ? BANNER_MAX_W : TEXT_MAX_W;
      while (measure(text, size) > maxW) size -= 4;
      rows = [text];
    }
    return { rows, size, col: look.col };
  });
  const height = perLine.reduce((h, l) => h + l.rows.length * l.size * ROW_GAP, 0) + LINE_GAP * (lines.length - 1);
  let y = TEXT_TOP + Math.max(0, (TEXT_BOTTOM - TEXT_TOP - height) / 2);
  return perLine.map((l) => {
    const rows = l.rows.map((text) => {
      const w = measure(text, l.size);
      const row = { text, x: W / 2 - w / 2, y, w, size: l.size, col: l.col };
      y += l.size * ROW_GAP;
      return row;
    });
    y += LINE_GAP;
    return rows;
  });
};

const ROUGH = rough.generator();

const compile = (shapes: Sh[], seedBase: number, measure: Measure, doodles: Doodles): Stroke[] => {
  const strokes: Stroke[] = [];
  shapes.forEach((sh, i) => {
    const col = sh.col ?? INK;
    if (sh.k === "t") {
      const w = measure(sh.text, sh.size);
      strokes.push({ kind: "label", x: sh.x, y: sh.y, w, size: sh.size, text: sh.text, col, len: w * 1.4 });
      return;
    }
    if (sh.k === "a") {
      const art = doodles[sh.name];
      if (!art) throw new Error(`whiteboard: doodle "${sh.name}" is not in the doodles json — add it to doodles.txt and rerun build_doodles.py`);
      const scale = sh.h / art.h;
      const isBody = (part: DoodlePart) => part.fill.toLowerCase() === "#ffffff";
      const toCanvas = (d: string) => movePath(d, sh.x, sh.y, scale);
      const body = art.parts.filter(isBody).map((part) => ({ d: part.subs.map(toCanvas).join(" "), rule: part.rule }));
      const inkParts = art.parts.filter((part) => !isBody(part));
      const ink = inkParts.map((part) => ({ d: part.subs.map(toCanvas).join(" "), rule: part.rule }));
      const subs = inkParts.flatMap((part) => part.subs.map(toCanvas)).map((d) => ({ d, len: getLength(d) })).filter((sp) => sp.len > 1);
      const len = subs.reduce((sum, sp) => sum + sp.len, 0);
      strokes.push({ kind: "ink", body, ink, subs, col, maskW: clampN(sh.h * INK_MASK_RATIO, 10, 40), len });
      return;
    }
    const fill = "fill" in sh ? sh.fill : undefined;
    const opts = { stroke: col, strokeWidth: 7, roughness: 0.9, bowing: 0.8, seed: seedBase + i + 1, ...(fill ? { fill, fillStyle: "hachure", hachureGap: 11, fillWeight: 3, hachureAngle: -41 } : {}) };
    const drawable =
      sh.k === "c"
        ? ROUGH.circle(sh.x, sh.y, sh.d, opts)
        : sh.k === "e"
          ? ROUGH.ellipse(sh.x, sh.y, sh.w, sh.h, opts)
          : sh.k === "r"
            ? ROUGH.rectangle(sh.x, sh.y, sh.w, sh.h, opts)
            : sh.k === "l"
              ? ROUGH.line(sh.x1, sh.y1, sh.x2, sh.y2, opts)
              : ROUGH.path(sh.d, opts);
    const infos = ROUGH.toPaths(drawable);
    const ordered = [...infos.filter((p) => p.stroke === col), ...infos.filter((p) => p.stroke !== col)];
    for (const info of ordered) {
      if (info.stroke === "none") continue;
      for (const d of getSubpaths(info.d)) {
        const len = getLength(d);
        if (len > 1) strokes.push({ kind: "path", d, col: info.stroke, width: info.strokeWidth, len });
      }
    }
  });
  return strokes;
};

const frameBox = (rows: Row[], kind: "box" | "banner"): Sh[] => {
  const x1 = Math.min(...rows.map((r) => r.x)) - 36;
  const x2 = Math.max(...rows.map((r) => r.x + r.w)) + 36;
  const y1 = rows[0].y - 14;
  const y2 = rows[rows.length - 1].y + rows[rows.length - 1].size * ROW_GAP + 6;
  if (kind === "box") return [R(x1, y1, x2 - x1, y2 - y1, { col: RED }), R(x1 + 10, y1 + 8, x2 - x1 - 20, y2 - y1 - 16, { col: RED })];
  const my = (y1 + y2) / 2;
  return tint(
    [R(x1, y1, x2 - x1, y2 - y1), P(`M${x1},${y1} Q${x1 - 50},${y1} ${x1 - 50},${my} Q${x1 - 50},${y2} ${x1},${y2}`), P(`M${x2},${y1} Q${x2 + 50},${y1} ${x2 + 50},${my} Q${x2 + 50},${y2} ${x2},${y2}`)],
    GOLD,
  );
};

const buildPlan = (tl: Timeline, scenes: Scenes, doodles: Doodles): Plan => {
  const measure = makeMeasure();
  const pages: PagePlan[] = [];
  const tasks: Task[] = [];
  const flat = tl.beats.flatMap((b) => b.pages.map((p, pi) => ({ b, p, pi })));
  const total = whiteboardFrames(tl);
  flat.forEach(({ b, p, pi }, gi) => {
    const from = Math.max(0, fr(p.start - PAGE_LEAD) - LEAD);
    const to = gi + 1 < flat.length ? Math.max(0, fr(flat[gi + 1].p.start - PAGE_LEAD) - LEAD) : total;
    pages.push({ from, to, header: b.header });
    const rows = layoutRows(p.lines, measure);
    const scene = scenes[`${b.name}:${pi}`] ?? {};
    p.lines.forEach((ln, i) => {
      const textStart = fr(ln.start) - LEAD;
      const nextText = i + 1 < p.lines.length ? fr(p.lines[i + 1].start) - LEAD : to - PAGE_FADE - 2;
      const textDur = clampN(Math.min(Math.round(ln.t.length * 0.5), nextText - textStart - 2), 4, 30);
      tasks.push({ kind: "text", page: gi, start: textStart, end: textStart + textDur, rows: rows[i] });
      const mark: Mark | undefined = scene[i];
      if (!mark) return;
      const shapes = mark === "box" || mark === "banner" ? frameBox(rows[i], mark) : mark;
      const strokes = compile(shapes, gi * 1000 + i * 100, measure, doodles);
      const sum = strokes.reduce((s, st) => s + st.len, 0);
      const drawStart = textStart + textDur + 1;
      const natural = clampN(Math.round(sum / DRAW_SPEED), 8, 60);
      const dur = Math.max(4, Math.min(natural, nextText - 2 - drawStart));
      tasks.push({ kind: "draw", page: gi, start: drawStart, end: drawStart + dur, strokes, total: sum });
    });
  });
  tasks.sort((a, b) => a.start - b.start);
  return { pages, tasks };
};

const sfxSeconds = (tl: Timeline, s: Sfx) => {
  const [beat, page, line] = s.line.split(":");
  const ln = tl.beats.find((b) => b.name === beat)?.pages[+page]?.lines[+line];
  if (!ln) throw new Error(`whiteboard: sfx anchor "${s.line}" does not match any BEAT:page:line in the timeline`);
  return ln.start + (s.offset ?? 0);
};

const progressOf = (task: Task, f: number) => clampN((f - task.start) / Math.max(1, task.end - task.start), 0, 1);

const textRowProgress = (rows: Row[], q: number) => {
  const totalW = rows.reduce((s, r) => s + r.w, 0);
  let acc = 0;
  return rows.map((r) => {
    const lo = acc / totalW;
    acc += r.w;
    const hi = acc / totalW;
    return clampN((q - lo) / (hi - lo), 0, 1);
  });
};

const inkTip = (st: Extract<Stroke, { kind: "ink" }>, at: number) => {
  let left = at;
  for (const sp of st.subs) {
    if (left <= sp.len) return getPointAtLength(sp.d, Math.max(0, left));
    left -= sp.len;
  }
  const lastSub = st.subs[st.subs.length - 1];
  return getPointAtLength(lastSub.d, lastSub.len);
};

const tipOf = (task: Task, q: number): { x: number; y: number } => {
  if (task.kind === "text") {
    const parts = textRowProgress(task.rows, q);
    const idx = Math.max(0, parts.findIndex((v) => v < 1));
    const r = task.rows[q >= 1 ? task.rows.length - 1 : idx];
    const lp = q >= 1 ? 1 : parts[idx];
    return { x: r.x + r.w * lp, y: r.y + r.size * 0.82 };
  }
  let left = q * task.total;
  for (const st of task.strokes) {
    if (left <= st.len) {
      if (st.kind === "label") return { x: st.x - st.w / 2 + st.w * (left / st.len), y: st.y + st.size * 0.3 };
      if (st.kind === "ink") return inkTip(st, left);
      const pt = getPointAtLength(st.d, Math.max(0, left));
      return { x: pt.x, y: pt.y };
    }
    left -= st.len;
  }
  const last = task.strokes[task.strokes.length - 1];
  if (last.kind === "label") return { x: last.x + last.w / 2, y: last.y + last.size * 0.3 };
  if (last.kind === "ink") return inkTip(last, last.len);
  const pt = getPointAtLength(last.d, last.len);
  return { x: pt.x, y: pt.y };
};

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: a.x + (b.x - a.x) * ease(t), y: a.y + (b.y - a.y) * ease(t) });

const handAt = (tasks: Task[], f: number) => {
  const active = tasks.find((t) => f >= t.start && f < t.end);
  if (active) return tipOf(active, progressOf(active, f));
  let prev: Task | undefined;
  let next: Task | undefined;
  for (const t of tasks) {
    if (t.end <= f && (!prev || t.end > prev.end)) prev = t;
    if (t.start > f && (!next || t.start < next.start)) next = t;
  }
  const from = prev ? tipOf(prev, 1) : HAND_REST;
  const to = next ? tipOf(next, 0) : HAND_REST;
  const prevEnd = prev ? prev.end : -1000;
  const nextStart = next ? next.start : f + 1000;
  const gap = nextStart - prevEnd;
  if (gap <= HAND_GLIDE) return lerp(from, to, (f - prevEnd) / gap);
  if (f - prevEnd < HAND_AWAY) return lerp(from, HAND_REST, (f - prevEnd) / HAND_AWAY);
  if (nextStart - f < HAND_AWAY) return lerp(HAND_REST, to, 1 - (nextStart - f) / HAND_AWAY);
  return HAND_REST;
};

export const Hand: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const skin = "#F2C4A0";
  const line = "#9C6248";
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x},${y}) rotate(-28)`} style={{ filter: "drop-shadow(10px 14px 10px rgba(0,0,0,0.18))" }}>
        <path d="M-10,150 L80,128 L330,880 L190,930 Z" fill={skin} stroke={line} strokeWidth={4} />
        <path d="M95,440 L215,400 L430,900 L270,960 Z" fill="#3F6FB0" stroke="#28497A" strokeWidth={4} />
        <path d="M0,0 L-10,26 L10,26 Z" fill="#1B1B1F" />
        <rect x={-15} y={24} width={30} height={18} fill="#5A5A66" />
        <rect x={-17} y={40} width={34} height={190} rx={7} fill="#2B2D42" />
        <rect x={-17} y={150} width={34} height={22} fill={RED} />
        <ellipse cx={30} cy={118} rx={62} ry={56} fill={skin} stroke={line} strokeWidth={4} />
        <ellipse cx={-14} cy={78} rx={24} ry={14} fill={skin} stroke={line} strokeWidth={4} />
        <ellipse cx={-18} cy={104} rx={24} ry={14} fill={skin} stroke={line} strokeWidth={4} />
        <ellipse cx={-14} cy={130} rx={22} ry={13} fill={skin} stroke={line} strokeWidth={4} />
        <ellipse cx={20} cy={64} rx={15} ry={30} transform="rotate(-24 20 64)" fill={skin} stroke={line} strokeWidth={4} />
      </g>
    </svg>
  );
};

const InkDrawing: React.FC<{ st: Extract<Stroke, { kind: "ink" }>; shown: number; id: string }> = ({ st, shown, id }) => {
  const q = shown / st.len;
  const fillIn = clampN((q - INK_FILL_FROM) / (1 - INK_FILL_FROM), 0, 1);
  let left = shown;
  return (
    <g>
      {st.body.map((b, i) => (
        <path key={`b${i}`} d={b.d} fill={BG} fillRule={b.rule as "nonzero" | "evenodd"} />
      ))}
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        {st.subs.map((sp, i) => {
          const part = clampN(left, 0, sp.len);
          left -= sp.len;
          if (part <= 0) return null;
          return <path key={i} d={sp.d} fill="none" stroke="white" strokeWidth={st.maskW} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${sp.len} ${sp.len}`} strokeDashoffset={sp.len - part} />;
        })}
        {fillIn > 0 ? st.ink.map((k, i) => <path key={`f${i}`} d={k.d} fill="white" fillRule={k.rule as "nonzero" | "evenodd"} opacity={fillIn} />) : null}
      </mask>
      {st.ink.map((k, i) => (
        <path key={`k${i}`} d={k.d} fill={st.col} fillRule={k.rule as "nonzero" | "evenodd"} mask={`url(#${id})`} />
      ))}
    </g>
  );
};

const TextRows: React.FC<{ task: Extract<Task, { kind: "text" }>; f: number }> = ({ task, f }) => {
  const parts = textRowProgress(task.rows, progressOf(task, f));
  return (
    <>
      {task.rows.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            fontFamily: HAND_FONT,
            fontSize: r.size,
            lineHeight: 1.2,
            color: r.col,
            whiteSpace: "nowrap",
            clipPath: `inset(-20% ${(1 - parts[i]) * 100}% -20% -2%)`,
          }}
        >
          {r.text}
        </div>
      ))}
    </>
  );
};

const Drawing: React.FC<{ task: Extract<Task, { kind: "draw" }>; f: number }> = ({ task, f }) => {
  let left = progressOf(task, f) * task.total;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {task.strokes.map((st, i) => {
        const shown = clampN(left, 0, st.len);
        left -= st.len;
        if (shown <= 0) return null;
        if (st.kind === "ink") return <InkDrawing key={i} st={st} shown={shown} id={`ink-${task.start}-${i}`} />;
        if (st.kind === "label") {
          const cut = st.x - st.w / 2 - 10 + (st.w + 20) * (shown / st.len);
          return (
            <g key={i}>
              <clipPath id={`lbl-${task.start}-${i}`}>
                <rect x={0} y={st.y - st.size} width={cut} height={st.size * 2} />
              </clipPath>
              <text x={st.x} y={st.y} fontFamily={HAND_FONT} fontSize={st.size} fill={st.col} textAnchor="middle" dominantBaseline="central" clipPath={`url(#lbl-${task.start}-${i})`}>
                {st.text}
              </text>
            </g>
          );
        }
        return <path key={i} d={st.d} fill="none" stroke={st.col} strokeWidth={st.width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${st.len} ${st.len}`} strokeDashoffset={st.len - shown} />;
      })}
    </svg>
  );
};

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

const Chrome: React.FC<{ header: string; footer: string; f: number; from: number }> = ({ header, footer, f, from }) => (
  <>
    <div style={{ position: "absolute", top: 96, left: 0, right: 0, textAlign: "center", fontFamily: HAND_FONT, fontSize: 44, color: GREY, letterSpacing: 4, opacity: interpolate(f - from, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {header}
    </div>
    <div style={{ position: "absolute", top: 162, left: 390, width: 300, height: 4, borderRadius: 4, background: `${GREY}55` }} />
    <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center", fontFamily: HAND_FONT, fontSize: 32, color: `${GREY}AA`, letterSpacing: 4 }}>{footer}</div>
  </>
);

const usePlan = (tl: Timeline, scenes: Scenes, doodles: Doodles) => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [handle] = useState(() => delayRender("whiteboard font + plan"));
  useEffect(() => {
    handFontReady()
      .then(() => {
        setPlan(buildPlan(tl, scenes, doodles));
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle, tl, scenes, doodles]);
  return plan;
};

export const WhiteboardVideo: React.FC<{ timeline: Timeline; scenes: Scenes; doodles: Doodles; sfx: Sfx[]; slug: string; footer: string; bgm: boolean }> = ({ timeline, scenes, doodles, sfx, slug, footer, bgm }) => {
  const f = useCurrentFrame();
  const plan = usePlan(timeline, scenes, doodles);
  const drawTasks = useMemo(() => (plan ? plan.tasks.filter((t) => t.kind === "draw") : []), [plan]);
  const sfxAt = useMemo(() => sfx.map((s) => ({ ...s, frame: fr(sfxSeconds(timeline, s)) })), [sfx, timeline]);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop />
      {bgm ? <Audio src={staticFile(`${slug}/bgm.mp3`)} /> : null}
      <Audio src={staticFile(`${slug}/voice.mp3`)} />
      {drawTasks.map((t) => (
        <Sequence key={`s${t.start}`} from={t.start} durationInFrames={t.end - t.start}>
          <Audio src={staticFile(SCRIBBLE_SRC)} volume={SCRIBBLE_VOLUME} />
        </Sequence>
      ))}
      {sfxAt.map((s, i) => (
        <Sequence key={`fx${i}`} from={s.frame}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      {plan
        ? plan.pages.map((pg, gi) => {
            if (f < pg.from || f >= pg.to) return null;
            const opacity = interpolate(f, [pg.to - PAGE_FADE, pg.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <AbsoluteFill key={gi} style={{ opacity }}>
                <Chrome header={pg.header} footer={footer} f={f} from={pg.from} />
                {plan.tasks
                  .filter((t) => t.page === gi && t.start <= f)
                  .map((t) => (t.kind === "text" ? <TextRows key={`t${t.start}`} task={t} f={f} /> : <Drawing key={`d${t.start}`} task={t} f={f} />))}
              </AbsoluteFill>
            );
          })
        : null}
      {plan ? <Hand {...handAt(plan.tasks, f)} /> : null}
    </AbsoluteFill>
  );
};
