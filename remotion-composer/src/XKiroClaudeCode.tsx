import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";
import tl from "./xkiro-claude-code_timeline.json";

loadJakarta("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["500", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadJetBrains("normal", { weights: ["400", "600", "700"], subsets: ["latin", "vietnamese"] });
loadBeVietnam("normal", { weights: ["600", "800"], subsets: ["vietnamese", "latin"] });

const FPS = 30;
const SLUG = "xkiro-claude-code";
const LEAD = 4;
const TAIL_SEC = 1.2;
const FADE = 6;

const TECH = "#0A0B0A";
const GOLD = "#86EFAC";
const AMBER = "#F0B23C";
const GREEN = "#22C55E";
const GREEN_LIGHT = "#4ADE80";
const GREEN_DEEP = "#16A34A";
const RED = "#F87171";
const BLUE = "#7DD3FC";
const TEXT = "#F3F5F2";
const MUTED = "#8A938C";
const CARD = "#111412";
const CARD2 = "#181B19";
const BORDER = "#ffffff1a";

const SERIF = "'EB Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const CAPTION_FONT = "'Be Vietnam Pro', system-ui, sans-serif";

type Line = { t: string; kind: string; start: number; end: number };
type Timeline = { total: number; beats: { pages: { lines: Line[] }[] }[] };
const TL = tl as Timeline;
const LINES: Line[] = TL.beats.flatMap((b) => b.pages.flatMap((p) => p.lines));

export const XKIRO_CLAUDE_CODE_FRAMES = Math.ceil((TL.total + TAIL_SEC) * FPS);

const entry = (i: number) => Math.max(0, Math.round(LINES[i].start * FPS) - LEAD);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const SNAPPY = { damping: 14, stiffness: 190, mass: 0.6 };
const SOFT = { damping: 18, stiffness: 90, mass: 0.9 };

type Ctx = { f: number; dur: number; at: (i: number) => number; sp: (i: number, delay?: number, cfg?: typeof SNAPPY) => number };
type Shot = { first: number; render: (c: Ctx) => React.ReactNode };

const lerp = (v: number, a: number, b: number) => a + (b - a) * v;
const appear = (v: number, dy = 40) => ({ opacity: Math.min(1, v * 1.4), transform: `translateY(${lerp(v, dy, 0)}px)` });
const popIn = (v: number) => ({ opacity: Math.min(1, v * 1.6), transform: `scale(${lerp(v, 0.6, 1)})` });
const typed = (text: string, f: number, from: number, perChar = 2) => text.slice(0, Math.max(0, Math.floor((f - from) / perChar)));

const MODEL_CYCLE = ["anthropic/claude-opus-5", "anthropic/claude-sonnet-5.5", "anthropic/claude-haiku-5.5", "z-ai/glm-5.2"];

const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <AbsoluteFill style={{ top: 150, bottom: 640, height: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, padding: "0 70px" }}>
    {children}
  </AbsoluteFill>
);

const StepHeader: React.FC<{ v: number; tag: string; title: string; accent: string; accentColor?: string }> = ({ v, tag, title, accent, accentColor = GREEN }) => (
  <div style={{ width: 940, ...appear(v, 30) }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: AMBER, letterSpacing: 6 }}>{tag}</div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, color: TEXT, lineHeight: 1.05, marginTop: 8 }}>
      {title}
      <br />
      <span style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}66` }}>{accent}</span>
    </div>
  </div>
);

const SerifTitle: React.FC<{ v: number; size?: number; color?: string; children: React.ReactNode }> = ({ v, size = 120, color = GOLD, children }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, textAlign: "center", letterSpacing: 2, textShadow: `0 0 40px ${color}55, 0 8px 24px #000c`, filter: `blur(${lerp(v, 10, 0)}px)`, ...appear(v, 30) }}>
    {children}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties; glow?: boolean }> = ({ children, width = 940, style, glow }) => (
  <div style={{ width, background: CARD, border: `2px solid ${glow ? GREEN + "88" : BORDER}`, borderRadius: 28, boxShadow: `0 0 60px ${GREEN_DEEP}22, 0 30px 60px #000a`, overflow: "hidden", position: "relative", ...style }}>{children}</div>
);

const WindowBar: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px", borderBottom: `1px solid ${BORDER}`, background: CARD2 }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
      <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
    ))}
    <div style={{ flex: 1, marginLeft: 16, fontFamily: MONO, fontSize: 26, color: MUTED }}>{title}</div>
  </div>
);

const Ok: React.FC<{ v: number; children: React.ReactNode; color?: string; mark?: string }> = ({ v, children, color = GREEN_LIGHT, mark = "✓" }) => (
  <div style={{ width: 940, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, background: `${color}1a`, border: `2px solid ${color}`, borderRadius: 22, padding: "26px 34px", fontFamily: SANS, fontWeight: 800, fontSize: 46, color, ...popIn(v) }}>
    <span style={{ fontSize: 56 }}>{mark}</span>
    {children}
  </div>
);

const XLogo: React.FC<{ size?: number }> = ({ size = 48 }) => <Img src={staticFile(`${SLUG}/logo-xKiro-green.png`)} style={{ width: size, height: size }} />;

const Brand: React.FC<{ title?: string }> = ({ title = "Quản lý xKiro" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: TEXT }}>
    <XLogo size={46} />
    {title}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: `${GREEN}26`, color: GREEN_LIGHT, fontFamily: SANS, fontWeight: 600, fontSize: 22, padding: "6px 14px", borderRadius: 8 }}>{children}</span>
);

const KeyRow: React.FC<{ v: number; name: string; tail: string; hot?: number }> = ({ v, name, tail, hot = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "24px 26px", borderTop: `2px solid ${BORDER}`, background: `rgba(34,197,94,${0.12 * hot})`, ...appear(v, 20) }}>
    <div style={{ width: 230, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: TEXT }}>{name}</div>
    <div style={{ flex: 1, fontFamily: MONO, fontSize: 25, color: "#bbb" }}>sk-xt-••••{tail}</div>
    <Pill>Đang hoạt động</Pill>
  </div>
);

const ApiKeysPage: React.FC<{ rows: { name: string; tail: string }[]; rowV: (i: number) => number; btnGlow?: number; hotRow?: number }> = ({ rows, rowV, btnGlow = 0, hotRow = 0 }) => (
  <div style={{ padding: "34px 34px 40px" }}>
    <Brand />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "30px 0 28px" }}>
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: TEXT }}>API Keys</div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: MUTED, marginTop: 8 }}>Giữ bí mật — coi chúng như mật khẩu.</div>
      </div>
      <div style={{ position: "relative", background: GREEN_LIGHT, color: "#04210F", fontFamily: SANS, fontWeight: 800, fontSize: 30, padding: "20px 28px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: `0 0 0 ${8 * btnGlow}px ${GREEN_LIGHT}40, 0 0 ${50 * btnGlow}px ${GREEN_LIGHT}99` }}>
        ＋ Tạo key mới
      </div>
    </div>
    <div style={{ border: `2px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "flex", padding: "18px 26px", background: "#0D0F0E", fontFamily: SANS, fontWeight: 600, fontSize: 22, color: MUTED }}>
        <div style={{ width: 230 }}>Tên</div>
        <div style={{ flex: 1 }}>Key</div>
        <div>Trạng thái</div>
      </div>
      {rows.map((r, i) => (
        <KeyRow key={r.name} v={rowV(i)} name={r.name} tail={r.tail} hot={i === 0 ? hotRow : 0} />
      ))}
    </div>
  </div>
);

const Code: React.FC<{ n?: number; v?: number; hl?: number; indent?: number; children?: React.ReactNode }> = ({ n, v = 1, hl = 0, indent = 0, children }) => (
  <div style={{ display: "flex", fontFamily: MONO, fontSize: 31, lineHeight: 1.75, color: TEXT, marginLeft: -30, paddingLeft: 24, borderLeft: `6px solid rgba(34,197,94,${hl})`, background: `rgba(34,197,94,${0.13 * hl})`, opacity: Math.min(1, v * 1.4), transform: `translateX(${lerp(v, -24, 0)}px)` }}>
    <span style={{ display: "inline-block", width: 50, color: "#4b4f4c" }}>{n ?? ""}</span>
    <span style={{ paddingLeft: indent * 30, whiteSpace: "pre" }}>{children}</span>
  </div>
);

const K: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: BLUE }}>{children}</span>;
const S: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = GREEN_LIGHT }) => <span style={{ color }}>{children}</span>;

const TermRow: React.FC<{ v: number; label: string; value: React.ReactNode; hl?: number }> = ({ v, label, value, hl = 0 }) => (
  <div style={{ display: "flex", fontFamily: MONO, fontSize: 31, lineHeight: 1.8, marginLeft: -34, paddingLeft: 28, borderLeft: `6px solid rgba(34,197,94,${hl})`, background: `rgba(34,197,94,${0.13 * hl})`, ...appear(v, 16) }}>
    <span style={{ width: 230, color: MUTED }}>{label}</span>
    <span style={{ color: TEXT }}>{value}</span>
  </div>
);

const ToolRow: React.FC<{ v: number; tool: string; arg: string; argColor?: string }> = ({ v, tool, arg, argColor = BLUE }) => (
  <div style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.8, color: TEXT, ...appear(v, 14) }}>
    <span style={{ color: GREEN_LIGHT }}>●</span> {tool} <span style={{ color: argColor }}>{arg}</span>
  </div>
);

const Cursor: React.FC<{ f: number }> = ({ f }) => <span style={{ display: "inline-block", width: 18, height: 34, background: TEXT, verticalAlign: "middle", opacity: Math.floor(f / 15) % 2 === 0 ? 1 : 0 }} />;

const SHOTS: Shot[] = [
  {
    first: 0,
    render: ({ f, sp }) => (
      <Stage gap={44}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, ...popIn(sp(0, 0, { damping: 12, stiffness: 160, mass: 0.7 })) }}>
          <Img src={staticFile(`${SLUG}/Claude_ai.svg`)} style={{ width: 120, height: 120, filter: "drop-shadow(0 0 30px #D9775788)" }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 122, color: TEXT, letterSpacing: -4, whiteSpace: "nowrap" }}>Claude Code</div>
        </div>
        <Card width={900} style={{ ...appear(sp(0, 14, SOFT), 50) }}>
          <WindowBar title="claude" />
          <div style={{ padding: "34px 36px", fontFamily: MONO, fontSize: 34, color: TEXT }}>
            <span style={{ color: AMBER }}>&gt;</span> <Cursor f={f} />
          </div>
        </Card>
        <SerifTitle v={sp(0, 30)} size={80} color={GOLD}>vẫn là Claude Code</SerifTitle>
      </Stage>
    ),
  },
  {
    first: 1,
    render: ({ f, at, sp }) => {
      const cycleFrom = at(2) + 24;
      const idx = f < cycleFrom ? 0 : Math.floor((f - cycleFrom) / 16) % MODEL_CYCLE.length;
      const ring = sp(1, 30);
      return (
        <Stage gap={40}>
          <StepHeader v={sp(1)} tag="TRẬN PHÁP CẤU HÌNH" title="Đổi" accent="một chỗ" />
          <Card width={940} style={{ ...appear(sp(1, 6, SOFT), 50) }}>
            <WindowBar title="~/.claude/settings.json" />
            <div style={{ padding: "30px 30px 36px" }}>
              <Code n={1}>{"{"}</Code>
              <Code n={2} indent={1}><K>"env"</K>: {"{"}</Code>
              <Code n={3} indent={2}><span style={{ color: MUTED }}>…</span></Code>
              <Code n={5} indent={2} hl={ring}><K>"ANTHROPIC_MODEL"</K>:</Code>
              <Code indent={3} hl={ring}><S color={AMBER}>"{MODEL_CYCLE[idx]}"</S></Code>
              <Code n={6} indent={1}>{"}"}</Code>
              <Code n={7}>{"}"}</Code>
            </div>
          </Card>
          {f >= at(3) - 2 ? <SerifTitle v={sp(3)} size={90} color={GOLD}>Cài lại từ đầu</SerifTitle> : null}
        </Stage>
      );
    },
  },
  {
    first: 4,
    render: ({ f, at, sp }) => {
      const pressed = f >= at(5) + 40;
      return (
        <Stage gap={40}>
          <StepHeader v={sp(4)} tag="BƯỚC 1" title="Đăng danh" accent="nhập môn" />
          <Card width={940} style={{ ...appear(sp(4, 20, SOFT), 40) }}>
            <div style={{ display: "flex", gap: 24, padding: 32, alignItems: "flex-start" }}>
              <XLogo size={64} />
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: MUTED }}>📌 Ghim · bần đạo</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: TEXT, marginTop: 8 }}>Cổng nhập môn xKiro ở đây 👇</div>
              </div>
            </div>
          </Card>
          {f >= at(5) - 2 ? (
            <Card width={940} glow={pressed} style={{ padding: "34px 40px 40px", boxSizing: "border-box", ...appear(sp(5, 0, SOFT), 40) }}>
              <Brand title="xKiro · Đăng ký" />
              {["Email", "Mật khẩu"].map((label, i) => (
                <div key={label} style={{ marginTop: i === 0 ? 30 : 18, padding: "22px 26px", border: `2px solid ${BORDER}`, borderRadius: 14, fontFamily: SANS, fontSize: 30, color: MUTED, ...appear(sp(5, 8 + i * 8), 14) }}>
                  {label}
                  <span style={{ float: "right", fontFamily: MONO, color: TEXT }}>{i === 0 ? typed("bandao@…", f, at(5) + 10) : typed("••••••••", f, at(5) + 24, 1)}</span>
                </div>
              ))}
              <div style={{ marginTop: 26, textAlign: "center", background: pressed ? GREEN : GREEN_LIGHT, color: "#04210F", fontFamily: SANS, fontWeight: 800, fontSize: 34, padding: "22px 0", borderRadius: 14, transform: `scale(${pressed ? lerp(sp(5, 40), 0.94, 1) : 1})` }}>
                {pressed ? "✓ Đã đăng danh" : "Đăng ký"}
              </div>
            </Card>
          ) : null}
        </Stage>
      );
    },
  },
  {
    first: 6,
    render: ({ f, at, sp }) => {
      const glow = interpolate(f, [at(6) + 40, at(6) + 52], [0, 1], clamp);
      const cx = interpolate(f, [at(6) + 20, at(6) + 46], [520, 0], clamp);
      const cy = interpolate(f, [at(6) + 20, at(6) + 46], [420, 0], clamp);
      return (
        <Stage gap={40}>
          <StepHeader v={sp(6)} tag="BƯỚC 2" title="Luyện" accent="lệnh bài" />
          <Card width={940} style={{ ...appear(sp(6, 6, SOFT), 50) }}>
            <WindowBar title="xKiro · API Keys" />
            <ApiKeysPage
              rows={[
                { name: "claude", tail: "7a81" },
                { name: "Test2", tail: "664d" },
                { name: "Test1", tail: "40be" },
              ]}
              rowV={(i) => sp(6, 14 + i * 5)}
              btnGlow={glow}
            />
            <div style={{ position: "absolute", right: 70, top: 260, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderBottom: "50px solid #fff", filter: "drop-shadow(0 4px 6px #000)", transform: `translate(${cx}px, ${cy}px) rotate(-30deg) scale(${f >= at(6) + 46 && f < at(6) + 52 ? 0.85 : 1})`, opacity: sp(6, 16) }} />
          </Card>
        </Stage>
      );
    },
  },
  {
    first: 7,
    render: ({ f, at, sp }) => {
      const blink = f >= at(7) + 30 ? 0.75 + 0.25 * Math.sin((f - at(7)) / 4) : 1;
      const copied = f >= at(7) + 52;
      return (
        <Stage gap={40}>
          <StepHeader v={sp(7)} tag="BƯỚC 2" title="Hiện" accent="một lần" accentColor={AMBER} />
          <div style={{ position: "relative", width: 940 }}>
            <Card width={940} style={{ opacity: 0.35 }}>
              <WindowBar title="xKiro · API Keys" />
              <ApiKeysPage
                rows={[
                  { name: "claude-code", tail: "9f2c" },
                  { name: "claude", tail: "7a81" },
                  { name: "Test2", tail: "664d" },
                ]}
                rowV={() => 1}
              />
            </Card>
            <div style={{ position: "absolute", left: 30, right: 30, top: 170, background: CARD2, border: "2px solid #3a3f3c", borderRadius: 24, padding: 40, boxShadow: "0 40px 100px #000", ...popIn(sp(7, 0, { damping: 13, stiffness: 170, mass: 0.7 })) }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: TEXT }}>Key mới đã tạo</div>
              <div style={{ fontFamily: SANS, fontSize: 26, color: MUTED, marginTop: 6 }}>claude-code</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0 24px", background: "#0B0D0C", border: `2px solid ${GREEN}`, borderRadius: 14, padding: 22 }}>
                <div style={{ flex: 1, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: GREEN_LIGHT }}>sk-xt-••••••••••••9f2c</div>
                <div style={{ background: copied ? GREEN_DEEP : GREEN, color: copied ? TEXT : "#04210F", fontFamily: SANS, fontWeight: 800, fontSize: 26, padding: "14px 22px", borderRadius: 10 }}>{copied ? "✓ Đã chép" : "Sao chép"}</div>
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: AMBER, opacity: blink }}>⚠ Chỉ hiển thị một lần</div>
            </div>
          </div>
        </Stage>
      );
    },
  },
  {
    first: 8,
    render: ({ f, at, sp }) => {
      const env = sp(9, 4);
      const url = f >= at(10) ? sp(10, 6) : 0;
      const bad = f >= at(11) ? sp(11) : 0;
      const auth = f >= at(12) ? sp(12, 6) : 0;
      const model = f >= at(13) ? sp(13, 6) : 0;
      const hlUrl = f >= at(10) && f < at(12) ? 1 : 0;
      const hlAuth = f >= at(12) && f < at(13) ? 1 : 0;
      const hlModel = f >= at(13) ? 1 : 0;
      return (
        <Stage gap={34}>
          <StepHeader v={sp(8)} tag="BƯỚC 3" title="Khắc" accent="trận pháp" />
          <Card width={940} style={{ ...appear(sp(8, 6, SOFT), 50) }}>
            <WindowBar title="~/.claude/settings.json" />
            <div style={{ padding: "30px 30px 36px", minHeight: 520 }}>
              <Code n={1}>{"{"}</Code>
              <Code n={2} v={env} indent={1}><K>"env"</K>: {"{"}</Code>
              <Code n={3} v={url} indent={2} hl={hlUrl * url}><K>"ANTHROPIC_BASE_URL"</K>:</Code>
              <Code v={url} indent={3} hl={hlUrl * url}>
                <S>"https://api.xkiro.com</S>
                {bad > 0 ? <span style={{ color: RED, textDecoration: "line-through", textDecorationThickness: 5, opacity: bad }}>/v1</span> : null}
                <S>"</S>,
              </Code>
              <Code n={4} v={auth} indent={2} hl={hlAuth * auth}><K>"ANTHROPIC_AUTH_TOKEN"</K>:</Code>
              <Code v={auth} indent={3} hl={hlAuth * auth}><S>"sk-xt-••••9f2c"</S>,</Code>
              <Code n={5} v={model} indent={2} hl={hlModel * model}><K>"ANTHROPIC_MODEL"</K>:</Code>
              <Code v={model} indent={3} hl={hlModel * model}><S color={AMBER}>"anthropic/claude-opus-5"</S></Code>
              <Code n={6} v={env} indent={1}>{"}"}</Code>
              <Code n={7}>{"}"}</Code>
            </div>
          </Card>
          <div style={{ height: 120, display: "flex", alignItems: "center" }}>
            {f >= at(11) - 2 && f < at(12) - 2 ? <Ok v={sp(11)} color={RED} mark="✗">Không thêm /v1</Ok> : null}
            {f >= at(9) - 2 && f < at(10) - 2 ?<SerifTitle v={sp(9)} size={70} color={GOLD}>khối env · ba dòng</SerifTitle> : null}
          </div>
        </Stage>
      );
    },
  },
  {
    first: 14,
    render: ({ f, at, sp }) => {
      const cmd = typed("/status", f, at(14) + 44, 3);
      const out = f >= at(15) ? 1 : 0;
      const swapped = f >= at(16) + 40;
      return (
        <Stage gap={40}>
          <StepHeader v={sp(14)} tag="BƯỚC 4" title="Thử" accent="trận" />
          <Card width={940} style={{ ...appear(sp(14, 6, SOFT), 50) }}>
            <WindowBar title="claude" />
            <div style={{ padding: "34px 34px 44px", minHeight: 300 }}>
              <div style={{ fontFamily: MONO, fontSize: 34, color: TEXT }}>
                <span style={{ color: AMBER }}>&gt;</span> {cmd}
                {out ? null : <Cursor f={f} />}
              </div>
              {out ? (
                <div style={{ marginTop: 26 }}>
                  <TermRow v={sp(15, 0)} label="Model" value={<span style={{ color: swapped ? AMBER : TEXT }}>{swapped ? "anthropic/claude-sonnet-5.5" : "anthropic/claude-opus-5"}</span>} hl={f >= at(16) ? 1 : 0} />
                  <TermRow v={sp(15)} label="Base URL" value={<S>https://api.xkiro.com</S>} hl={f >= at(16) ? 0 : sp(15)} />
                  <TermRow v={sp(15, 4)} label="Auth" value="ANTHROPIC_AUTH_TOKEN" />
                </div>
              ) : null}
            </div>
          </Card>
          <div style={{ height: 130, display: "flex", alignItems: "center" }}>
            {f >= at(15) - 2 && f < at(16) - 2 ? <Ok v={sp(15, 20)}>Trận pháp đã thông</Ok> : null}
            {f >= at(16) - 2 ? <Ok v={sp(16, 30)} color={AMBER} mark="↻">Đổi dòng model · mở lại</Ok> : null}
          </div>
        </Stage>
      );
    },
  },
  {
    first: 17,
    render: ({ f, at, sp }) => {
      const prompt = typed("Thêm nút chuyển chế độ tối", f, at(17) + 50, 2);
      const step = (k: number) => (f >= at(18) + k * 14 ? sp(18, k * 14) : 0);
      return (
        <Stage gap={40}>
          <StepHeader v={sp(17)} tag="TRẢI NGHIỆM" title="Đại năng" accent="ra tay" />
          <Card width={940} style={{ ...appear(sp(17, 6, SOFT), 50) }}>
            <WindowBar title="claude · my-shop" />
            <div style={{ padding: "32px 34px 40px", minHeight: 560 }}>
              <div style={{ fontFamily: MONO, fontSize: 31, color: TEXT, marginBottom: 22 }}>
                <span style={{ color: AMBER }}>&gt;</span> {prompt}
              </div>
              <ToolRow v={step(0)} tool="Read" arg="src/Header.tsx" />
              <ToolRow v={step(1)} tool="Read" arg="src/theme.css" />
              <ToolRow v={step(2)} tool="Edit" arg="src/Header.tsx" />
              <div style={{ margin: "6px 0 10px 40px", padding: "10px 20px", background: "#0B0D0C", borderRadius: 10, fontFamily: MONO, fontSize: 26, lineHeight: 1.7, color: GREEN_LIGHT, ...appear(step(3), 10) }}>
                <div>+ &lt;ThemeToggle /&gt;</div>
                <div>+ const [dark, setDark] = useState(false)</div>
              </div>
              <ToolRow v={step(4)} tool="Bash" arg="npm test" argColor={AMBER} />
              <div style={{ fontFamily: MONO, fontSize: 31, lineHeight: 1.8, color: GREEN_LIGHT, marginLeft: -34, paddingLeft: 28, borderLeft: `6px solid ${GREEN}`, background: `${GREEN}22`, ...appear(step(6), 10) }}>  ✓ 12 passed</div>
            </div>
          </Card>
        </Stage>
      );
    },
  },
  {
    first: 19,
    render: ({ f, at, sp }) => {
      const chosen = f >= at(19) + 36;
      return (
        <Stage gap={40}>
          <StepHeader v={sp(19)} tag="TRẢI NGHIỆM" title="Gật đầu" accent="là xong" />
          <Card width={940} style={{ ...appear(sp(19, 6, SOFT), 50) }}>
            <WindowBar title="claude · my-shop" />
            <div style={{ padding: "34px 34px 40px" }}>
              <div style={{ fontFamily: MONO, fontSize: 31, color: TEXT, marginBottom: 24 }}>
                Áp dụng thay đổi cho <span style={{ color: BLUE }}>src/Header.tsx</span>?
              </div>
              <TermRow v={1} label="❯ 1." value={<S>Yes</S>} hl={chosen ? 1 : 0.4} />
              <TermRow v={1} label="  2." value="No, sửa lại" />
            </div>
          </Card>
          <div style={{ height: 130, display: "flex", alignItems: "center" }}>{chosen ? <Ok v={sp(19, 40)}>Đã thêm chế độ tối</Ok> : null}</div>
        </Stage>
      );
    },
  },
  {
    first: 20,
    render: ({ sp }) => (
      <Stage gap={40}>
        <StepHeader v={sp(20)} tag="TRẢI NGHIỆM" title="Từng lượt" accent="ghi rõ" />
        <Card width={940} style={{ ...appear(sp(20, 6, SOFT), 50) }}>
          <WindowBar title="xKiro · Nhật ký yêu cầu" />
          <div style={{ padding: "32px 34px 40px" }}>
            <Brand />
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: TEXT, margin: "26px 0 24px" }}>Nhật ký yêu cầu</div>
            <div style={{ border: `2px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", padding: "18px 26px", background: "#0D0F0E", fontFamily: SANS, fontWeight: 600, fontSize: 22, color: MUTED }}>
                <div style={{ width: 220 }}>Thời gian</div>
                <div style={{ flex: 1 }}>Model</div>
                <div>Trạng thái</div>
              </div>
              {["10:42:18", "10:42:05", "10:41:51", "10:41:37"].map((t, i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", padding: "22px 26px", borderTop: `2px solid ${BORDER}`, ...appear(sp(20, 16 + i * 7), 16) }}>
                  <div style={{ width: 220, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: TEXT }}>{t}</div>
                  <div style={{ flex: 1, fontFamily: MONO, fontSize: 25, color: "#bbb" }}>claude-opus-5</div>
                  <Pill>200</Pill>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Stage>
    ),
  },
  {
    first: 21,
    render: ({ f, at, sp }) => {
      const spin = interpolate(f, [at(21) + 40, at(21) + 70], [0, 360], clamp);
      return (
        <Stage gap={44}>
          <StepHeader v={sp(21)} tag="ĐIỂM TRỪ" title="Đổi đại năng" accent="phải mở lại" accentColor={RED} />
          <Card width={940} style={{ ...appear(sp(21, 6, SOFT), 50) }}>
            <WindowBar title="~/.claude/settings.json" />
            <div style={{ padding: "30px 30px 36px" }}>
              <Code n={5} indent={1} hl={1}><K>"ANTHROPIC_MODEL"</K>:</Code>
              <Code indent={2} hl={1}><S color={AMBER}>"{f >= at(21) + 30 ? "anthropic/claude-sonnet-5.5" : "anthropic/claude-opus-5"}"</S></Code>
            </div>
          </Card>
          <div style={{ display: "flex", alignItems: "center", gap: 28, ...popIn(sp(21, 34)) }}>
            <div style={{ fontSize: 110, color: AMBER, transform: `rotate(${spin}deg)`, lineHeight: 1 }}>↻</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: TEXT }}>Mở lại Claude Code</div>
          </div>
        </Stage>
      );
    },
  },
  {
    first: 22,
    render: ({ f, at, sp }) => (
      <Stage gap={40}>
        <SerifTitle v={sp(22)} size={110} color={GOLD}>Lời dặn</SerifTitle>
        {f >= at(23) - 2 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 34, ...appear(sp(23), 30) }}>
              <Card width={420} style={{ padding: "34px 0", textAlign: "center" }}>
                <XLogo size={110} />
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: TEXT, marginTop: 14 }}>xKiro</div>
                <div style={{ fontFamily: SANS, fontSize: 28, color: MUTED, marginTop: 6 }}>đạo môn bên ngoài</div>
              </Card>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: RED }}>≠</div>
              <Card width={380} style={{ padding: "64px 0", textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: MUTED }}>Anthropic</div>
              </Card>
            </div>
            <Ok v={sp(23, 70)} color={AMBER} mark="→">Trục trặc · hỏi đội xKiro</Ok>
          </>
        ) : null}
      </Stage>
    ),
  },
  {
    first: 24,
    render: ({ f, at, sp }) => {
      const pulse = f >= at(25) + 30 ? 1 + 0.06 * Math.sin((f - at(25)) / 3) : 1;
      return (
        <Stage gap={44}>
          <Card width={940} style={{ ...appear(sp(24)) }}>
            <div style={{ display: "flex", gap: 22, padding: 34, alignItems: "flex-start" }}>
              <XLogo size={64} />
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: MUTED }}>📌 Ghim · bần đạo</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: TEXT, marginTop: 8 }}>Cổng nhập môn xKiro ở đây 👇</div>
              </div>
            </div>
          </Card>
          {f >= at(25) - 2 ? (
            <>
              <SerifTitle v={sp(25)} size={84} color={GOLD}>Độ kiếp cùng giới IT</SerifTitle>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: TECH, background: GREEN, borderRadius: 60, padding: "26px 90px", boxShadow: `0 0 60px ${GREEN}88`, transform: `scale(${pulse * lerp(sp(25, 28), 0.6, 1)})`, opacity: sp(25, 28) }}>+ FOLLOW</div>
            </>
          ) : null}
        </Stage>
      );
    },
  },
];

const SHOT_START = SHOTS.map((s, i) => (i === 0 ? 0 : entry(s.first)));

type Sfx = { line: number; offset: number; src: string; vol: number; dur?: number };
const SFX: Sfx[] = [
  { line: 2, offset: 0.9, src: "sfx/ui/typing.mp3", vol: 0.18, dur: 1.5 },
  { line: 4, offset: 0.05, src: "sfx/ui/whoosh.mp3", vol: 0.28 },
  { line: 5, offset: 1.4, src: "sfx/win/ding-correct.mp3", vol: 0.2 },
  { line: 6, offset: 1.6, src: "sfx/ui/discord-ping.mp3", vol: 0.25 },
  { line: 7, offset: 1.8, src: "sfx/ui/iphone-ding.mp3", vol: 0.22 },
  { line: 11, offset: 0.2, src: "sfx/fail/windows-error.mp3", vol: 0.2 },
  { line: 14, offset: 1.5, src: "sfx/ui/typing.mp3", vol: 0.18, dur: 1.5 },
  { line: 15, offset: 0.7, src: "sfx/win/level-up.mp3", vol: 0.28 },
  { line: 17, offset: 1.7, src: "sfx/ui/typing.mp3", vol: 0.18, dur: 1.5 },
  { line: 18, offset: 2.1, src: "sfx/win/ding-correct.mp3", vol: 0.2 },
  { line: 19, offset: 1.2, src: "sfx/win/ding-correct.mp3", vol: 0.2 },
  { line: 25, offset: 1.1, src: "sfx/ui/iphone-ding.mp3", vol: 0.35 },
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
  const end = index + 1 < SHOTS.length ? SHOT_START[index + 1] : XKIRO_CLAUDE_CODE_FRAMES;
  if (frame < start || frame >= end + FADE) return null;
  const f = frame - start;
  const dur = end - start;
  const at = (i: number) => entry(i) - start;
  const sp = (i: number, delay = 0, cfg = SNAPPY) => spring({ frame: f - at(i) - delay, fps: FPS, config: cfg });
  const inV = index === 0 ? 1 : spring({ frame: f, fps: FPS, config: SNAPPY });
  const out = interpolate(frame, [end, end + FADE], [1, 0], clamp);
  const push = interpolate(f, [0, dur], [1, 1.03], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, transform: `scale(${push * lerp(inV, 0.97, 1) * lerp(out, 1.04, 1)})`, filter: `blur(${lerp(Math.min(inV, out), 6, 0)}px)` }}>
      {SHOTS[index].render({ f, dur, at, sp })}
    </AbsoluteFill>
  );
};

const EMPH = /^(Claude|Code\.?,?|xKiro\.?,?|API|Keys,?|settings\.json|\.claude\.?|env,?|base|URL|v1\.?|auth|token,?|model,?|status\.?|dashboard|Anthropic\.?|lệnh|bài\.?|trận|pháp\.?|đại|năng\.?|test,?)$/;

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
    <AbsoluteFill style={{ top: 1320, bottom: 340, height: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 940 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - base - i * 2, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const emph = EMPH.test(w);
          return (
            <span key={i} style={{ display: "inline-block", fontFamily: CAPTION_FONT, fontWeight: emph ? 800 : 600, fontSize: emph ? 54 : 48, color: emph ? GREEN : TEXT, lineHeight: 1.32, opacity: s, transform: `translateY(${lerp(s, 12, 0)}px)`, filter: `blur(${lerp(s, 4, 0)}px)`, textShadow: "0 3px 12px #000000f2" }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const XKiroClaudeCode: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  const frame = useCurrentFrame();
  const fadeAll = interpolate(frame, [XKIRO_CLAUDE_CODE_FRAMES - 12, XKIRO_CLAUDE_CODE_FRAMES], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: TECH }}>
      <AbsoluteFill style={{ opacity: fadeAll }}>
        <Backdrop />
        {SHOTS.map((_, i) => (
          <ShotLayer key={i} index={i} />
        ))}
        <Caption />
      </AbsoluteFill>
      {bgm ? <Audio src={staticFile(`${SLUG}/bgm.mp3`)} volume={0.3} loop /> : null}
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round((LINES[s.line].start + s.offset) * FPS)} durationInFrames={s.dur ? Math.round(s.dur * FPS) : undefined} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
