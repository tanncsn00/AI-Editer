import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";
import tl from "./xkiro-drop_timeline.json";

loadJakarta("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadGaramond("normal", { weights: ["500", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadJetBrains("normal", { weights: ["400", "600"], subsets: ["latin"] });
loadBeVietnam("normal", { weights: ["600", "800"], subsets: ["vietnamese", "latin"] });

const FPS = 30;
const SLUG = "xkiro-drop";
const LEAD = 4;
const TAIL_SEC = 1.2;
const FADE = 6;

const TECH = "#0A0B0A";
const GOLD = "#86EFAC";
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

export const XKIRO_DROP_FRAMES = Math.ceil((TL.total + TAIL_SEC) * FPS);

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

const Gem: React.FC<{ size?: number; hue?: string; style?: React.CSSProperties }> = ({ size = 80, hue = "#7FE3C4", style }) => (
  <div style={{ width: size, height: size, transform: "rotate(45deg)", background: `linear-gradient(135deg, #ffffffcc 0%, ${hue} 35%, #0d6b52 100%)`, borderRadius: size * 0.12, boxShadow: `0 0 ${size * 0.5}px ${hue}88`, ...style }} />
);

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
      const n = Math.round(interpolate(f, [at(0) + 30, at(0) + 70], [0, 50000000], clamp));
      const burst = spring({ frame: f + 2, fps: FPS, config: { damping: 11, stiffness: 220, mass: 0.6 } });
      const mark = interpolate(f, [at(2) + 10, at(2) + 70], [0, 1], clamp);
      return (
        <>
          <AbsoluteFill style={{ background: "#ffffff", opacity: interpolate(f, [0, 2, 9], [0.4, 0.25, 0], clamp) }} />
          <Stage gap={34}>
            <div style={{ display: "flex", gap: 34, alignItems: "flex-end", height: 190, transform: `scale(${lerp(burst, 1.3, 1)})` }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ opacity: Math.min(1, burst * 1.5), transform: `translateY(${lerp(burst, -60 - i * 20, 0)}px)` }}>
                  <Gem size={80 + (i % 2) * 40} />
                </div>
              ))}
            </div>
            <Label v={sp(0)} color={GREEN}>một đạo môn đang ban phát</Label>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 150, color: TEXT, letterSpacing: -4, textShadow: `0 0 60px ${GREEN}88`, ...popIn(sp(0, 26)) }}>{n.toLocaleString("vi-VN")}</div>
            <Label v={sp(0, 34)} color={GOLD}>token · mỗi người</Label>
            {f >= at(1) - 2 ? (
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 30 }}>
                <SerifTitle v={sp(1, 30)} size={92} color={GOLD}>Túi nào cũng trúng</SerifTitle>
              </div>
            ) : null}
            {f >= at(2) - 2 ? (
              <div style={{ width: 860, ...appear(sp(2)) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 34, color: MUTED, marginBottom: 14 }}>
                  <span>50M</span>
                  <span style={{ color: RED, fontFamily: SANS, fontWeight: 700 }}>không có ô trượt</span>
                  <span>100M</span>
                </div>
                <div style={{ position: "relative", height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${GREEN_DEEP}, ${GREEN})`, boxShadow: `0 0 30px ${GREEN}66` }}>
                  <div style={{ position: "absolute", top: -14, left: `calc(${mark * 72}% - 8px)`, width: 16, height: 54, borderRadius: 8, background: TEXT, boxShadow: `0 0 20px ${TEXT}` }} />
                </div>
              </div>
            ) : null}
          </Stage>
        </>
      );
    },
  },
  {
    first: 3,
    render: ({ f, at, sp }) => {
      const sweep = interpolate(f, [at(4) + 6, at(4) + 30], [-120, 120], clamp);
      return (
        <Stage>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, color: MUTED, ...appear(sp(3)) }}>Người đời gọi nó là</div>
          {f >= at(4) - 2 ? (
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 36, ...popIn(sp(4, 0, { damping: 11, stiffness: 160, mass: 0.7 })) }}>
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
    first: 5,
    render: ({ f, dur, sp }) => {
      const tilt = interpolate(f, [0, 20, dur - 10], [16, 8, 0], clamp);
      const base = appear(sp(5, 0, SOFT), 60);
      return (
        <Stage>
          <div style={{ perspective: 2000 }}>
            <div style={{ ...base, transform: `${base.transform} rotateX(${tilt}deg) rotateY(${-tilt * 0.6}deg)` }}>
              <Card width={880}>
                <WindowBar title="1 đạo API · 103 vị đại năng" />
                <ModelRow v={sp(5, 30)} logo="Claude_ai.svg" name="Claude Opus 5.5" id="anthropic/claude-opus-5.5" badge="Up to −96%" hot={sp(5, 50)} />
                <ModelRow v={sp(5, 36)} logo="OpenAI_dark.svg" name="GPT-6.1 Sol" id="openai/gpt-6.1-sol" badge="Up to −96%" hot={sp(5, 64)} />
                <ModelRow v={sp(5, 42)} logo="gemini.svg" name="Gemini 3.8 Flash" id="google/gemini-3.8-flash" badge="−35%" hot={sp(5, 78)} />
                <ModelRow v={sp(5, 48)} logo="deepseek.svg" name="DeepSeek V4 Pro" id="deepseek/deepseek-v4-pro-0813" badge="−35%" hot={sp(5, 92)} />
                <div style={{ padding: "22px 34px", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: GREEN }}>+ 99 vị khác →</div>
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
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 190, color: TEXT, lineHeight: 1, textShadow: `0 0 60px ${GREEN}88`, ...popIn(sp(6, 4)) }}>45 vị</div>
        <SerifTitle v={sp(6, 10)} size={86} color={GOLD}>mở cửa miễn phí mỗi ngày</SerifTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#0F1F15", border: `2px solid ${GREEN}`, borderRadius: 50, padding: "18px 36px", ...popIn(sp(6, 40)) }}>
          <Img src={staticFile(`${SLUG}/Qwen-Ai-Logo.png`)} style={{ width: 50, height: 50 }} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: TEXT }}>Không cần thẻ</span>
        </div>
      </Stage>
    ),
  },
  {
    first: 7,
    render: ({ f, at, sp }) => {
      const r1 = interpolate(f, [at(7) + 10, at(7) + 30], [0, 1], clamp);
      const r2 = interpolate(f, [at(7) + 44, at(7) + 64], [0, 1], clamp);
      return (
        <Stage gap={40}>
          <SerifTitle v={sp(7)} size={100} color={RED}>Tẩu hoả nhập ma</SerifTitle>
          <Card width={880} glow style={{ ...appear(sp(7, 6, SOFT), 50) }}>
            <div style={{ padding: "28px 34px", fontFamily: MONO, fontSize: 30, color: TEXT, borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "2px 10px", marginRight: 16 }}>POST</span>anthropic/claude-opus-5.5
            </div>
            {[
              { label: "route 1", p: r1, res: "503 upstream busy", c: RED },
              { label: "route 2", p: r2, res: "200 OK · streaming", c: GREEN },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 34px", fontFamily: MONO, fontSize: 30 }}>
                <span style={{ color: MUTED, width: 140 }}>{r.label}</span>
                <div style={{ flex: 1, height: 3, background: BORDER, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 3, width: `${r.p * 100}%`, background: r.c, boxShadow: `0 0 12px ${r.c}` }} />
                </div>
                <span style={{ color: r.c, opacity: r.p >= 1 ? 1 : 0, width: 330, textAlign: "right" }}>{r.res}</span>
              </div>
            ))}
          </Card>
          <Label v={sp(7, 66)} color={GREEN}>tự tìm đường khác mà đi</Label>
        </Stage>
      );
    },
  },
  {
    first: 8,
    render: ({ f, at, sp }) => {
      const swap = f >= at(8) + 60;
      return (
        <Stage gap={40}>
          <Label v={sp(8)} color={GOLD}>đang tu OpenAI SDK?</Label>
          <Card width={900} style={{ ...appear(sp(8, 6, SOFT), 50) }}>
            <WindowBar title="agent.ts" />
            <div style={{ padding: "30px 36px", fontFamily: MONO, fontSize: 32, lineHeight: 1.8, color: TEXT }}>
              <div style={{ color: MUTED }}>const client = new OpenAI({"{"}</div>
              <div style={{ paddingLeft: 36, background: swap ? "transparent" : "#3A141455", color: swap ? MUTED : RED, textDecoration: swap ? "line-through" : "none" }}>- baseURL: "api.openai.com/v1",</div>
              <div style={{ paddingLeft: 36, background: "#14532D66", color: GREEN, opacity: swap ? 1 : 0, transform: `translateX(${swap ? 0 : -20}px)` }}>+ baseURL: "api.xkiro.com/v1",</div>
              <div style={{ paddingLeft: 36, color: MUTED }}>  apiKey: "sk-xt-…",</div>
              <div style={{ color: MUTED }}>{"}"});</div>
            </div>
          </Card>
          <SerifTitle v={sp(8, 64)} size={80} color={GOLD}>đổi một dòng là nhập môn</SerifTitle>
        </Stage>
      );
    },
  },
  {
    first: 9,
    render: ({ f, at, sp }) => (
      <Stage gap={30}>
        <SerifTitle v={sp(9)} size={96} color={GOLD}>Ba bước nhập môn</SerifTitle>
        <Card width={900} glow style={{ padding: 46, boxSizing: "border-box", ...appear(sp(9, 6, SOFT), 50) }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {["Tạo tài khoản", "Xác nhận Telegram", "Mở túi linh thạch"].map((s, i) => {
              const done = f >= at(10) + 8 + i * 26;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 24, ...appear(sp(10, i * 26), 20) }}>
                  <div style={{ width: 60, height: 60, borderRadius: 30, border: `2px solid ${done ? GREEN : BORDER}`, background: done ? GREEN : "transparent", color: done ? TECH : MUTED, fontFamily: SANS, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: done ? TEXT : MUTED }}>{s}</div>
                </div>
              );
            })}
          </div>
        </Card>
        {f >= at(11) - 2 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, ...popIn(sp(11)) }}>
            <div style={{ fontFamily: MONO, fontSize: 52, color: MUTED }}>500K</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: GREEN }}>→</div>
            <div style={{ fontFamily: MONO, fontSize: 64, color: TEXT, textShadow: `0 0 30px ${GREEN}88` }}>1M</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: GOLD }}>token / ngày</div>
          </div>
        ) : null}
      </Stage>
    ),
  },
  {
    first: 12,
    render: ({ f, at, sp }) => {
      const paid = Math.round(interpolate(f, [at(13), at(13) + 16], [0, 5], clamp));
      const worth = Math.round(interpolate(f, [at(13) + 24, at(13) + 56], [0, 150], clamp));
      return (
        <Stage gap={40}>
          <Label v={sp(12)} color={MUTED}>bần đạo lật bảng giá</Label>
          <Card width={900} style={{ padding: "46px 50px", boxSizing: "border-box", ...appear(sp(12, 6, SOFT), 50) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: SANS, fontSize: 40, color: MUTED }}>Nạp</span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 110, color: TEXT }}>${paid}</span>
            </div>
            <div style={{ height: 18, borderRadius: 9, background: "#ffffff12", margin: "14px 0 30px" }}>
              <div style={{ width: `${(paid / 150) * 100}%`, height: "100%", borderRadius: 9, background: MUTED }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: SANS, fontSize: 40, color: MUTED }}>Dùng tới</span>
              <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 130, color: GREEN, textShadow: `0 0 50px ${GREEN}77` }}>${worth}</span>
            </div>
            <div style={{ height: 18, borderRadius: 9, background: "#ffffff12", marginTop: 14 }}>
              <div style={{ width: `${(worth / 150) * 100}%`, height: "100%", borderRadius: 9, background: GREEN, boxShadow: `0 0 20px ${GREEN}` }} />
            </div>
          </Card>
          {f >= at(14) - 2 ? <SerifTitle v={sp(14, 30)} size={100} color={GOLD}>Phát tài nguyên</SerifTitle> : null}
        </Stage>
      );
    },
  },
  {
    first: 15,
    render: ({ f, at, sp }) => {
      const drain = interpolate(f, [at(17) + 40, at(17) + 110], [1, 0.04], clamp);
      return (
        <Stage gap={34}>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { n: "22", u: "tháng 11" },
              { n: "00:00", u: "khép lại" },
            ].map((b, i) => (
              <div key={b.u} style={{ minWidth: 280, padding: "28px 36px", borderRadius: 28, border: `2px solid ${RED}66`, background: CARD, textAlign: "center", ...popIn(sp(15, 6 + i * 6)) }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 100, color: TEXT }}>{b.n}</div>
                <div style={{ fontFamily: SANS, fontSize: 34, color: MUTED }}>{b.u}</div>
              </div>
            ))}
          </div>
          {f >= at(16) - 2 ? (
            <div style={{ display: "flex", gap: 18, ...appear(sp(16)) }}>
              {["OpenAI_dark.svg", "Claude_ai.svg", "gemini.svg"].map((l, i) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", borderRadius: 20, border: `2px solid ${BORDER}`, background: CARD, ...popIn(sp(16, i * 6)) }}>
                  <Img src={staticFile(`${SLUG}/${l}`)} style={{ width: 44, height: 44 }} />
                  <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: RED }}>1 gói</span>
                </div>
              ))}
            </div>
          ) : null}
          {f >= at(17) - 2 ? (
            <>
              <SerifTitle v={sp(17)} size={110} color={RED}>Coi chừng</SerifTitle>
              <div style={{ width: 860, ...appear(sp(17, 30)) }}>
                <div style={{ fontFamily: SANS, fontSize: 38, color: MUTED, marginBottom: 12 }}>linh thạch chưa kịp phi thăng…</div>
                <div style={{ height: 30, borderRadius: 15, background: "#ffffff10", overflow: "hidden", border: `2px solid ${RED}44` }}>
                  <div style={{ height: "100%", width: `${drain * 100}%`, background: `linear-gradient(90deg, ${RED}, ${GOLD})` }} />
                </div>
              </div>
            </>
          ) : null}
        </Stage>
      );
    },
  },
  {
    first: 18,
    render: ({ f, at, sp }) => {
      const pulse = f >= at(19) + 30 ? 1 + 0.06 * Math.sin((f - at(19)) / 3) : 1;
      return (
        <Stage gap={44}>
          <Card width={900} style={{ ...appear(sp(18)) }}>
            <div style={{ display: "flex", gap: 22, padding: 34, alignItems: "flex-start" }}>
              <Img src={staticFile(`${SLUG}/logo-xKiro-green.png`)} style={{ width: 64, height: 64 }} />
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: MUTED }}>📌 Ghim · bần đạo</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: TEXT, marginTop: 8 }}>Cổng nhập môn ở đây 👉 xkiro.com</div>
              </div>
            </div>
          </Card>
          {f >= at(19) - 2 ? (
            <>
              <SerifTitle v={sp(19)} size={84} color={GOLD}>Độ kiếp cùng giới IT</SerifTitle>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: TECH, background: GREEN, borderRadius: 60, padding: "26px 90px", boxShadow: `0 0 60px ${GREEN}88`, transform: `scale(${pulse * lerp(sp(19, 28), 0.6, 1)})`, opacity: sp(19, 28) }}>+ FOLLOW</div>
            </>
          ) : null}
        </Stage>
      );
    },
  },

];

const SHOT_START = SHOTS.map((s, i) => (i === 0 ? 0 : entry(s.first)));

type Sfx = { line: number; offset: number; src: string; vol: number };
const SFX: Sfx[] = [
  { line: 0, offset: 1.0, src: "sfx/win/cash-register.mp3", vol: 0.22 },
  { line: 1, offset: 1.1, src: "sfx/punch/vine-boom.mp3", vol: 0.18 },
  { line: 4, offset: 0.05, src: "sfx/win/level-up.mp3", vol: 0.35 },
  { line: 5, offset: 0.1, src: "sfx/ui/whoosh.mp3", vol: 0.3 },
  { line: 7, offset: 0.5, src: "sfx/fail/windows-error.mp3", vol: 0.2 },
  { line: 7, offset: 2.1, src: "sfx/ui/discord-ping.mp3", vol: 0.3 },
  { line: 8, offset: 2.0, src: "sfx/ui/typing.mp3", vol: 0.2 },
  { line: 10, offset: 0.3, src: "sfx/win/ding-correct.mp3", vol: 0.2 },
  { line: 13, offset: 1.0, src: "sfx/win/cash-register.mp3", vol: 0.28 },
  { line: 14, offset: 1.1, src: "sfx/win/angelic.mp3", vol: 0.28 },
  { line: 19, offset: 1.1, src: "sfx/ui/iphone-ding.mp3", vol: 0.35 },
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
  const end = index + 1 < SHOTS.length ? SHOT_START[index + 1] : XKIRO_DROP_FRAMES;
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

export const XKiroDrop: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  const frame = useCurrentFrame();
  const fadeAll = interpolate(frame, [XKIRO_DROP_FRAMES - 12, XKIRO_DROP_FRAMES], [1, 0], clamp);
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
        <Sequence key={i} from={Math.round((LINES[s.line].start + s.offset) * FPS)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
