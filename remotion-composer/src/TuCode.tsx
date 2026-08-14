import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tc_beats.json";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const INK = "#04070A";
const MIST = "#0B1218";
const JADE = "#4ADE80";
const JADE_DIM = "#1F6F45";
const PAPER = "#DCE8E0";
const FAINT = "#5C6F66";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};

const GLYPHS = "01{}<>/;=()[]&|+*#$_".split("");

const CodeRain: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 26;
  return (
    <AbsoluteFill style={{ opacity: 0.16 }}>
      {new Array(cols).fill(0).map((_, c) => {
        const seed = random(`col-${c}`);
        const speed = 26 + seed * 46;
        const len = 9 + Math.floor(random(`len-${c}`) * 9);
        const x = (c / cols) * W + 12;
        const yBase = ((f * speed) / FPS) % (H + 700) - 350;
        return (
          <div key={c} style={{ position: "absolute", left: x, top: 0 }}>
            {new Array(len).fill(0).map((__, i) => {
              const g = GLYPHS[Math.floor(random(`g-${c}-${i}-${Math.floor(f / 7)}`) * GLYPHS.length)];
              const fade = 1 - i / len;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: yBase - i * 40,
                    fontFamily: "JetBrains Mono",
                    fontSize: 26,
                    color: JADE,
                    opacity: fade * fade,
                  }}
                >
                  {g}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Mountains: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 120) * 12;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <svg width={W} height={760} viewBox={`0 0 ${W} 760`} style={{ opacity: 0.55 }}>
        <defs>
          <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={JADE_DIM} stopOpacity={0.5} />
            <stop offset="100%" stopColor={INK} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E2A1C" stopOpacity={0.95} />
            <stop offset="100%" stopColor={INK} stopOpacity={1} />
          </linearGradient>
        </defs>
        <path d={`M${-40 + drift} 470 L200 250 L360 400 L520 210 L700 420 L900 260 L${W + 40} 450 L${W + 40} 760 L${-40} 760 Z`} fill="url(#far)" />
        <path d={`M${-40 - drift} 600 L180 430 L400 570 L620 400 L860 560 L${W + 40} 470 L${W + 40} 760 L${-40} 760 Z`} fill="url(#near)" />
      </svg>
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin(f / 90);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 1000px 900px at 50% 38%, ${MIST} 0%, ${INK} 68%)` }} />
      <CodeRain />
      <Mountains />
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse 760px 620px at 50% 40%, ${JADE}${breathe > 0.5 ? "12" : "0A"} 0%, transparent 64%)` }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${INK} 0%, transparent 22%, transparent 74%, ${INK} 100%)` }} />
    </AbsoluteFill>
  );
};

const Verse: React.FC<{ six: React.ReactNode; eight: React.ReactNode }> = ({ six, eight }) => {
  const f = useCurrentFrame();
  const reveal = (e: number, d: number) => {
    const o = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const blur = interpolate(f, [e, e + d], [9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const ty = interpolate(f, [e, e + d], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { opacity: o, filter: `blur(${blur}px)`, transform: `translateY(${ty}px)` };
  };
  const drift = Math.sin(f / 100) * 4;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ transform: `translateY(${drift}px)`, textAlign: "center", display: "flex", flexDirection: "column", gap: 30 }}>
        <div
          style={{
            ...reveal(4, 22),
            fontFamily: "EB Garamond",
            fontSize: 64,
            fontWeight: 500,
            color: PAPER,
            lineHeight: 1.3,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            textShadow: `0 0 40px ${INK}, 0 2px 30px rgba(0,0,0,0.8)`,
          }}
        >
          {six}
        </div>
        <div
          style={{
            ...reveal(34, 22),
            fontFamily: "EB Garamond",
            fontSize: 53,
            fontWeight: 400,
            color: PAPER,
            lineHeight: 1.32,
            letterSpacing: 0.3,
            whiteSpace: "nowrap",
            textShadow: `0 0 40px ${INK}, 0 2px 30px rgba(0,0,0,0.8)`,
          }}
        >
          {eight}
        </div>
        <div style={{ ...reveal(52, 20), display: "flex", justifyContent: "center", marginTop: 12 }}>
          <div style={{ width: 96, height: 2, background: `linear-gradient(90deg, transparent, ${JADE}66, transparent)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const J: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: JADE, textShadow: `0 0 34px ${JADE}66` }}>{children}</span>
);

const Cau1: React.FC = () => <Verse six={<><J>Code</J> xanh phủ lối ngàn năm,</>} eight={<>Bóng hình đạo pháp âm thầm bước qua.</>} />;
const Cau2: React.FC = () => <Verse six={<>Càn khôn vạn <J>code</J> bao la,</>} eight={<><J>Bug</J> trong cảnh động, lòng ta chẳng màng.</>} />;
const Cau3: React.FC = () => <Verse six={<><J>AI</J> khơi sáng tâm quang,</>} eight={<>Nhất chiêu phá giải vạn hàng lỗi sai.</>} />;
const Cau4: React.FC = () => <Verse six={<>Đạo trường sóng gió miệt mài,</>} eight={<><J>Tu code</J> há dễ, ai người thấu sâu.</>} />;

const RubberDuck: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [e, e + 6, e + 11], [0, 1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin((f - e) / 5) * 7;
  const rot = Math.sin((f - e) / 7) * 4;
  return (
    <div style={{ transform: `scale(${pop}) translateY(${bob}px) rotate(${rot}deg)`, filter: `drop-shadow(0 0 44px #FFD54A55)` }}>
      <svg width={280} height={250} viewBox="0 0 280 250">
        <ellipse cx="140" cy="182" rx="96" ry="54" fill="#FFC93C" />
        <ellipse cx="196" cy="176" rx="52" ry="40" fill="#FFD75E" />
        <circle cx="188" cy="104" r="62" fill="#FFD54A" />
        <path d="M240 104 L286 118 L240 132 Z" fill="#FF8A3D" />
        <circle cx="206" cy="92" r="9" fill="#1A1206" />
        <circle cx="209" cy="89" r="3" fill="#FFF" />
        <path d="M78 172 Q52 150 62 128" stroke="#F0B429" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Quack: React.FC = () => {
  const f = useCurrentFrame();
  const still = interpolate(f, [0, 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label = interpolate(f, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ position: "absolute", opacity: still, fontFamily: "EB Garamond", fontSize: 66, color: FAINT }}>...</div>
      <RubberDuck e={12} />
      <div
        style={{
          opacity: label,
          fontFamily: "JetBrains Mono",
          fontSize: 34,
          color: JADE,
          letterSpacing: 5,
          textAlign: "center",
        }}
      >
        RUBBER DUCK DEBUGGING
      </div>
      <div style={{ opacity: label, fontFamily: "EB Garamond", fontSize: 46, color: PAPER, fontStyle: "italic" }}>
        chân đạo, hoá ra ở đây.
      </div>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const kicker = interpolate(f, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gate = interpolate(f, [16, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(f, [66, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = interpolate(f, [16, 50], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, opacity: out }}>
      <div style={{ opacity: gate, transform: `translateY(${rise}px)`, fontSize: 96 }}>🏯</div>
      <div
        style={{
          opacity: kicker,
          fontFamily: "JetBrains Mono",
          fontSize: 30,
          color: JADE,
          letterSpacing: 10,
          textShadow: `0 0 30px ${JADE}55`,
        }}
      >
        THƠ ĐẠO LÝ · GIỚI IT
      </div>
      <div style={{ opacity: gate, width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${JADE}66, transparent)` }} />
    </AbsoluteFill>
  );
};

const Footer: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 74,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: "JetBrains Mono",
      fontSize: 23,
      color: FAINT,
      letterSpacing: 4,
      opacity: 0.5,
    }}
  >
    ĐỘ KIẾP CÙNG GIỚI IT
  </div>
);

export const TuCode: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const SEQ: [string, React.FC][] = [
    ["INTRO", Intro],
    ["CAU1", Cau1],
    ["CAU2", Cau2],
    ["CAU3", Cau3],
    ["CAU4", Cau4],
    ["QUACK", Quack],
  ];
  const quackAt = at("QUACK");
  const voiceFrom = at("CAU1").from;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Backdrop />
      <Sequence from={voiceFrom}>
        <Audio src={staticFile("tucode/voice.mp3")} />
      </Sequence>
      {bgm ? <Audio src={staticFile("tucode/bgm.mp3")} volume={0.2} /> : null}
      <Sequence from={quackAt.from + 12}>
        <Audio src={staticFile("tucode/quack.mp3")} volume={0.85} />
      </Sequence>
      {SEQ.map(([name, C]) => {
        const { from, dur } = at(name);
        return (
          <Sequence key={name} from={from} durationInFrames={dur}>
            <C />
          </Sequence>
        );
      })}
      <Footer />
    </AbsoluteFill>
  );
};
