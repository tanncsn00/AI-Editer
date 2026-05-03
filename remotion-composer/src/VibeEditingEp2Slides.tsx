import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadRobotoMono } from "@remotion/google-fonts/RobotoMono";
import slidesData from "../../projects/vibe-editing-ep2/slides_content.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadCaveat("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadRobotoMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const BLUE = "#4A7AC8";
const GREEN = "#3B8A5C";
const RED_WARN = "#C44536";
const FONT_VN = "Be Vietnam Pro, sans-serif";
const FONT_HAND = "Caveat, cursive";
const FONT_MONO = "Roboto Mono, monospace";

// =====================================================================
// SHARED PIECES
// =====================================================================

const PaperBg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="ep2PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="ep2Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ep2PN)" />
    <rect width={W} height={H} fill="url(#ep2Vig)" />
  </svg>
);

const InkFrame: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <rect x={32} y={32} width={W - 64} height={H - 64} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={48} y={48} width={W - 96} height={H - 96} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="2 12" opacity={0.45} />
  </svg>
);

const ChannelBadge: React.FC = () => (
  <div style={{
    position: "absolute", top: 70, left: 70,
    fontFamily: FONT_HAND, fontSize: 38, color: INK, lineHeight: 1,
  }}>
    <div style={{ color: GOLD, fontWeight: 700 }}>vai bờ ê đít tinh</div>
    <div style={{ fontSize: 22, opacity: 0.6, marginTop: 4 }}>tutorial · ep2</div>
  </div>
);

const PageNum: React.FC<{ n: number; total: number }> = ({ n, total }) => (
  <div style={{
    position: "absolute", top: 70, right: 80,
    fontFamily: FONT_HAND, fontSize: 38, color: INK, opacity: 0.55,
  }}>
    {n} / {total}
  </div>
);

const Footer: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 60, left: 0, right: 0,
    textAlign: "center", fontFamily: FONT_HAND, fontSize: 30, color: INK, opacity: 0.55,
  }}>
    @vibeediting · github.com/calesthio/OpenMontage
  </div>
);

// =====================================================================
// MASCOT — simplified static for slides
// =====================================================================

const Mascot: React.FC<{
  pose?: "wave" | "point" | "thumbs" | "wink" | "explain";
  scale?: number;
  flip?: boolean;
}> = ({ pose = "explain", scale = 1, flip = false }) => {
  return (
    <svg width={300 * scale} height={460 * scale} viewBox="-100 -250 200 310" style={{ overflow: "visible" }}>
      <g transform={flip ? "scale(-1, 1)" : ""}>
        {/* Legs */}
        <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
        <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
        <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
        <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
        {/* Body */}
        <rect x={-22} y={-25} width={44} height={58} rx={10} fill={BLUE} stroke={INK} strokeWidth={3.5} />
        <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
        {/* Arms by pose */}
        {pose === "wave" && (
          <>
            <g transform="rotate(20, 22, -12)">
              <line x1={22} y1={-12} x2={50} y2={-50} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
              <line x1={22} y1={-12} x2={50} y2={-50} stroke={INK} strokeWidth={2.5} />
              <circle cx={54} cy={-55} r={8} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
            </g>
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          </>
        )}
        {pose === "point" && (
          <>
            <line x1={22} y1={-12} x2={62} y2={-30} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-12} x2={62} y2={-30} stroke={INK} strokeWidth={2.5} />
            <circle cx={66} cy={-32} r={7} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          </>
        )}
        {pose === "thumbs" && (
          <>
            <line x1={22} y1={-12} x2={42} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-12} x2={42} y2={-40} stroke={INK} strokeWidth={2.5} />
            <circle cx={46} cy={-44} r={10} fill="#F8E0D0" stroke={INK} strokeWidth={2.5} />
            <line x1={46} y1={-44} x2={48} y2={-58} stroke="#F8E0D0" strokeWidth={6} strokeLinecap="round" />
            <line x1={46} y1={-44} x2={48} y2={-58} stroke={INK} strokeWidth={2} />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          </>
        )}
        {(pose === "explain" || pose === "wink") && (
          <>
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-8} x2={38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
            <line x1={22} y1={-8} x2={38} y2={18} stroke={INK} strokeWidth={2.5} />
          </>
        )}
        {/* Head */}
        <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
        {/* Hair */}
        <path d="M -22 -54 Q -10 -72 0 -68 Q 10 -72 22 -54 L 22 -50 Q 0 -60 -22 -50 Z" fill="#3A3028" stroke={INK} strokeWidth={2} />
        {/* Eyes */}
        {pose === "wink" ? (
          <>
            <ellipse cx={-8} cy={-44} rx={2.5} ry={2.5} fill={INK} />
            <line x1={4} y1={-44} x2={12} y2={-44} stroke={INK} strokeWidth={3} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={-8} cy={-44} rx={2.5} ry={2.5} fill={INK} />
            <ellipse cx={8} cy={-44} rx={2.5} ry={2.5} fill={INK} />
          </>
        )}
        {/* Glasses */}
        <circle cx={-8} cy={-44} r={7} fill="none" stroke={INK} strokeWidth={2} />
        <circle cx={8} cy={-44} r={7} fill="none" stroke={INK} strokeWidth={2} />
        <line x1={-1} y1={-44} x2={1} y2={-44} stroke={INK} strokeWidth={2} />
        {/* Mouth */}
        <ellipse cx={0} cy={-32} rx={4} ry={3} fill={INK} />
      </g>
    </svg>
  );
};

// =====================================================================
// SLIDE 1 — COVER
// =====================================================================

const SlideCover: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <div style={{ position: "absolute", top: 290, left: 0, right: 0, textAlign: "center" }}>
      <div style={{
        display: "inline-block", padding: "10px 32px", border: `4px solid ${INK}`,
        background: GOLD, color: INK, fontFamily: FONT_VN, fontWeight: 800,
        fontSize: 38, transform: "rotate(-3deg)",
      }}>{data.badge} · CHỒNG DẠY VỢ</div>
    </div>
    <div style={{
      position: "absolute", top: 430, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 110, color: INK, lineHeight: 1.05,
      letterSpacing: -2, padding: "0 60px",
    }}>
      {data.title}
    </div>
    <div style={{
      position: "absolute", top: 700, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 180, color: ACCENT, lineHeight: 1,
      letterSpacing: -4,
    }}>
      {data.subtitle}
    </div>
    {/* Mascot center */}
    <div style={{ position: "absolute", top: 980, left: "50%", transform: "translateX(-50%)" }}>
      <Mascot pose="point" scale={1.6} />
    </div>
    <div style={{
      position: "absolute", bottom: 220, left: 80, right: 80,
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: INK, textAlign: "center",
      lineHeight: 1.2,
    }}>
      "{data.tagline}"
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 2 — CHECKLIST
// =====================================================================

const SlideChecklist: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={2} total={13} />
    <div style={{
      position: "absolute", top: 220, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 84, color: INK,
    }}>{data.title}</div>
    <div style={{
      position: "absolute", top: 350, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontSize: 42, color: INK, opacity: 0.6,
    }}>checklist · pin tab này lại</div>

    <div style={{ position: "absolute", top: 490, left: 120, right: 120 }}>
      {data.items.map((it: any, i: number) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", marginBottom: 32,
          background: "#FFFEFB", border: `4px solid ${INK}`, borderRadius: 18,
          padding: "20px 28px",
          transform: `rotate(${(i % 2 === 0 ? -0.6 : 0.6)}deg)`,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: GOLD,
            border: `4px solid ${INK}`, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: FONT_VN, fontWeight: 800, fontSize: 50, color: INK, marginRight: 28,
          }}>{it.n}</div>
          <div style={{ fontFamily: FONT_VN, fontWeight: 700, fontSize: 64, color: INK }}>
            {it.name}
          </div>
        </div>
      ))}
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 3 — OS
// =====================================================================

const SlideOs: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={3} total={13} />
    <div style={{
      position: "absolute", top: 240, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 86, color: INK,
    }}>{data.title}</div>

    <div style={{ position: "absolute", top: 460, left: 80, right: 80, display: "flex", gap: 30, justifyContent: "center" }}>
      {[data.win, data.mac].map((os: any, i: number) => (
        <div key={i} style={{
          flex: 1, background: "#FFFEFB", border: `5px solid ${INK}`,
          borderRadius: 24, padding: 40, textAlign: "center",
          transform: `rotate(${i === 0 ? -1.5 : 1.5}deg)`,
        }}>
          <div style={{
            fontFamily: FONT_VN, fontWeight: 800, fontSize: 56, color: INK,
            background: i === 0 ? "#0078D4" : "#000",
            color: "#FFF", padding: "12px 0", borderRadius: 12, marginBottom: 32,
          }}>{os.label}</div>
          <div style={{ fontFamily: FONT_HAND, fontSize: 38, color: INK, opacity: 0.6, marginBottom: 12 }}>
            dùng package manager
          </div>
          <div style={{
            fontFamily: FONT_MONO, fontWeight: 600, fontSize: 80, color: ACCENT,
            background: "#FFF8E0", padding: "20px 30px", border: `3px solid ${INK}`,
            borderRadius: 14, display: "inline-block",
          }}>{os.tool}</div>
        </div>
      ))}
    </div>

    <div style={{
      position: "absolute", top: 1200, left: 80, right: 80,
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: INK, textAlign: "center",
      background: GOLD, padding: "30px 40px", border: `4px solid ${INK}`, borderRadius: 16,
    }}>{data.note}</div>

    <div style={{ position: "absolute", bottom: 360, left: "50%", transform: "translateX(-50%)" }}>
      <Mascot pose="explain" scale={1.0} />
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 4, 5 — TOOL (single source)
// =====================================================================

const SlideTool: React.FC<{ data: any; n: number }> = ({ data, n }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={n} total={13} />

    {/* Step number top */}
    <div style={{
      position: "absolute", top: 220, left: "50%", transform: "translateX(-50%)",
      width: 130, height: 130, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 90, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 140, color: INK, letterSpacing: -3,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 580, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 50, color: ACCENT,
    }}>vào trang này tải về</div>

    <div style={{
      position: "absolute", top: 660, left: 80, right: 80,
      background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 18,
      padding: "30px 40px", textAlign: "center",
      transform: "rotate(-1deg)",
    }}>
      <div style={{ fontFamily: FONT_MONO, fontWeight: 600, fontSize: 64, color: BLUE }}>
        {data.url}
      </div>
    </div>

    <div style={{
      position: "absolute", top: 850, left: 80, right: 80,
      fontFamily: FONT_VN, fontWeight: 600, fontSize: 44, color: INK,
      textAlign: "center", lineHeight: 1.3,
    }}>{data.step}</div>

    <div style={{
      position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 42, color: GREEN,
    }}>kiểm tra cài thành công ✓</div>

    <div style={{
      position: "absolute", top: 1100, left: 100, right: 100,
      background: INK, borderRadius: 16, padding: "30px 40px",
      fontFamily: FONT_MONO, fontWeight: 600, fontSize: 50, color: "#7CDF8C",
      textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.25)",
    }}>$ {data.verify}</div>

    <div style={{
      position: "absolute", top: 1310, left: 80, right: 80,
      fontFamily: FONT_HAND, fontSize: 42, color: INK, textAlign: "center", opacity: 0.7,
    }}>{data.note}</div>

    <div style={{ position: "absolute", bottom: 220, left: 60 }}>
      <Mascot pose="point" scale={0.85} />
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 6 — TOOL DUAL (FFmpeg)
// =====================================================================

const SlideToolDual: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={6} total={13} />

    <div style={{
      position: "absolute", top: 220, left: "50%", transform: "translateX(-50%)",
      width: 130, height: 130, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 90, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 140, color: INK, letterSpacing: -3,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 590, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 50, color: ACCENT,
    }}>1 lệnh terminal là xong</div>

    {[
      { label: "WINDOWS", color: "#0078D4", cmd: data.win_cmd, top: 700 },
      { label: "MAC", color: "#000", cmd: data.mac_cmd, top: 950 },
    ].map((row, i) => (
      <div key={i} style={{ position: "absolute", top: row.top, left: 80, right: 80 }}>
        <div style={{
          display: "inline-block", background: row.color, color: "#FFF",
          fontFamily: FONT_VN, fontWeight: 800, fontSize: 36, padding: "8px 24px",
          borderRadius: 8, marginBottom: 10,
        }}>{row.label}</div>
        <div style={{
          background: INK, borderRadius: 16, padding: "26px 36px",
          fontFamily: FONT_MONO, fontWeight: 600, fontSize: 46, color: "#FFE08A",
          boxShadow: "0 6px 0 rgba(0,0,0,0.22)",
        }}>$ {row.cmd}</div>
      </div>
    ))}

    <div style={{
      position: "absolute", top: 1200, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 42, color: GREEN,
    }}>kiểm tra:</div>
    <div style={{
      position: "absolute", top: 1270, left: 100, right: 100,
      background: INK, borderRadius: 16, padding: "26px 40px",
      fontFamily: FONT_MONO, fontWeight: 600, fontSize: 46, color: "#7CDF8C",
      textAlign: "center",
    }}>$ {data.verify}</div>

    <div style={{
      position: "absolute", top: 1450, left: 80, right: 80,
      fontFamily: FONT_HAND, fontSize: 42, color: INK, textAlign: "center", opacity: 0.7,
    }}>{data.note}</div>

    <div style={{ position: "absolute", bottom: 200, right: 60 }}>
      <Mascot pose="thumbs" scale={0.85} flip />
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 7 — TOOL WARN (Python)
// =====================================================================

const SlideToolWarn: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={7} total={13} />

    <div style={{
      position: "absolute", top: 220, left: "50%", transform: "translateX(-50%)",
      width: 130, height: 130, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 90, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 140, color: INK, letterSpacing: -3,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 600, left: 80, right: 80,
      background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 18,
      padding: "26px 40px", textAlign: "center",
      transform: "rotate(-1deg)",
    }}>
      <div style={{ fontFamily: FONT_MONO, fontWeight: 600, fontSize: 60, color: BLUE }}>
        {data.url}
      </div>
    </div>

    {/* WARNING BLOCK — biggest visual */}
    <div style={{
      position: "absolute", top: 800, left: 60, right: 60,
      background: RED_WARN, border: `6px solid ${INK}`, borderRadius: 24,
      padding: "44px 36px", textAlign: "center",
      transform: "rotate(1.2deg)",
      boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
    }}>
      <div style={{
        fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: "#FFF8E0", marginBottom: 16,
      }}>⚠️ QUAN TRỌNG ⚠️</div>
      <div style={{
        fontFamily: FONT_VN, fontWeight: 800, fontSize: 64, color: "#FFF", lineHeight: 1.15,
      }}>{data.warn}</div>
      <div style={{
        fontFamily: FONT_HAND, fontWeight: 700, fontSize: 44, color: "#FFE08A", marginTop: 18,
      }}>{data.warn_sub}</div>
    </div>

    <div style={{
      position: "absolute", top: 1280, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 42, color: GREEN,
    }}>kiểm tra:</div>
    <div style={{
      position: "absolute", top: 1350, left: 100, right: 100,
      background: INK, borderRadius: 16, padding: "26px 40px",
      fontFamily: FONT_MONO, fontWeight: 600, fontSize: 50, color: "#7CDF8C",
      textAlign: "center",
    }}>$ {data.verify}</div>

    <div style={{
      position: "absolute", top: 1520, left: 80, right: 80,
      fontFamily: FONT_HAND, fontSize: 42, color: INK, textAlign: "center", opacity: 0.7,
    }}>{data.note}</div>

    <div style={{ position: "absolute", bottom: 180, left: 60 }}>
      <Mascot pose="point" scale={0.75} />
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 8 — IDE GRID
// =====================================================================

const SlideIdeGrid: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={8} total={13} />

    <div style={{
      position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)",
      width: 110, height: 110, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 78, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 340, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 76, color: INK, letterSpacing: -2,
      padding: "0 60px",
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 480, left: 60, right: 60,
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26,
    }}>
      {data.options.map((opt: any, i: number) => (
        <div key={i} style={{
          background: opt.star ? "#FFF8E0" : "#FFFEFB",
          border: `5px solid ${opt.star ? GOLD : INK}`,
          borderRadius: 20, padding: "26px 22px",
          transform: `rotate(${(i % 2 === 0 ? -1 : 1)}deg)`,
          position: "relative",
          boxShadow: opt.star ? "0 8px 0 rgba(229,165,59,0.4)" : "0 4px 0 rgba(0,0,0,0.15)",
        }}>
          {opt.star && (
            <div style={{
              position: "absolute", top: -22, right: -16,
              background: GOLD, color: INK, padding: "6px 14px", border: `3px solid ${INK}`,
              borderRadius: 8, fontFamily: FONT_VN, fontWeight: 800, fontSize: 22,
              transform: "rotate(8deg)",
            }}>⭐ CHỒNG CHỌN</div>
          )}
          <div style={{
            display: "inline-block", background: BLUE, color: "#FFF",
            fontFamily: FONT_VN, fontWeight: 700, fontSize: 22, padding: "4px 12px",
            borderRadius: 6, marginBottom: 10,
          }}>{opt.kind}</div>
          <div style={{
            fontFamily: FONT_VN, fontWeight: 800, fontSize: 42, color: INK, lineHeight: 1.05,
            marginBottom: 8,
          }}>{opt.name}</div>
          <div style={{
            fontFamily: FONT_VN, fontWeight: 700, fontSize: 28, color: ACCENT, marginBottom: 12,
          }}>{opt.price}</div>
          <div style={{
            fontFamily: FONT_HAND, fontSize: 30, color: INK, opacity: 0.75, lineHeight: 1.15,
            marginBottom: 12,
          }}>"{opt.pro}"</div>
          <div style={{
            fontFamily: FONT_MONO, fontWeight: 600, fontSize: 24, color: BLUE,
          }}>→ {opt.url}</div>
        </div>
      ))}
    </div>

    <div style={{
      position: "absolute", bottom: 180, left: 80, right: 80,
      background: GOLD, border: `4px solid ${INK}`, borderRadius: 16,
      padding: "24px 30px", textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 46, color: INK,
    }}>chỉ chọn 1 thằng. Vợ mới — chọn Antigravity (free).</div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 9 — CLONE
// =====================================================================

const SlideClone: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={9} total={13} />

    <div style={{
      position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)",
      width: 110, height: 110, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 78, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 340, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 110, color: INK, letterSpacing: -2,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 510, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 44, color: ACCENT,
    }}>chạy 3 lệnh trong terminal</div>

    {data.cmds.map((cmd: string, i: number) => (
      <div key={i} style={{
        position: "absolute", top: 620 + i * 220, left: 60, right: 60,
      }}>
        <div style={{
          display: "inline-block", background: GOLD, color: INK,
          fontFamily: FONT_VN, fontWeight: 800, fontSize: 32, padding: "6px 18px",
          border: `3px solid ${INK}`, borderRadius: 8, marginBottom: 10,
        }}>BƯỚC {i + 1}</div>
        <div style={{
          background: INK, borderRadius: 16, padding: "26px 30px",
          fontFamily: FONT_MONO, fontWeight: 600, fontSize: 32, color: "#7CDF8C",
          boxShadow: "0 6px 0 rgba(0,0,0,0.22)", lineHeight: 1.3,
          wordBreak: "break-all",
        }}>$ {cmd}</div>
      </div>
    ))}

    <div style={{
      position: "absolute", bottom: 180, left: 80, right: 80,
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 38, color: INK, textAlign: "center", opacity: 0.7,
    }}>{data.credit}</div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 10 — ENV
// =====================================================================

const SlideEnv: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={10} total={13} />

    <div style={{
      position: "absolute", top: 200, left: "50%", transform: "translateX(-50%)",
      width: 110, height: 110, borderRadius: "50%", background: GOLD,
      border: `5px solid ${INK}`, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 78, color: INK,
    }}>{data.n}</div>

    <div style={{
      position: "absolute", top: 340, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 120, color: INK, letterSpacing: -2,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 520, left: 80, right: 80,
      background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 14,
      padding: "20px 28px", textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 42, color: ACCENT,
      transform: "rotate(-0.8deg)",
    }}>{data.step}</div>

    <div style={{ position: "absolute", top: 660, left: 60, right: 60 }}>
      {data.keys.map((k: any, i: number) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", marginBottom: 24,
          background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 18,
          padding: "22px 24px",
          transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)`,
        }}>
          <div style={{
            fontSize: 44, marginRight: 20, filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))",
          }}>🔑</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: FONT_MONO, fontWeight: 600, fontSize: 38, color: ACCENT, lineHeight: 1.05,
            }}>{k.name}</div>
            <div style={{
              fontFamily: FONT_VN, fontWeight: 600, fontSize: 26, color: INK, opacity: 0.65,
              marginTop: 6,
            }}>{k.purpose}</div>
            <div style={{
              fontFamily: FONT_MONO, fontWeight: 600, fontSize: 26, color: BLUE, marginTop: 4,
            }}>→ {k.url}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{
      position: "absolute", bottom: 180, left: 80, right: 80,
      background: GOLD, border: `4px solid ${INK}`, borderRadius: 16,
      padding: "20px 28px", textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 38, color: INK, lineHeight: 1.2,
    }}>{data.note}</div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 11 — TEST
// =====================================================================

const SlideTest: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={11} total={13} />

    <div style={{
      position: "absolute", top: 240, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 110, color: INK, letterSpacing: -2,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 410, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 50, color: ACCENT,
    }}>mở AI IDE — gõ y nguyên câu này:</div>

    <div style={{
      position: "absolute", top: 530, left: 60, right: 60,
      background: "#FFF8E0", border: `5px solid ${INK}`, borderRadius: 22,
      padding: "44px 36px",
      transform: "rotate(-0.8deg)",
      boxShadow: "0 10px 0 rgba(0,0,0,0.22)",
    }}>
      <div style={{
        fontFamily: FONT_HAND, fontSize: 36, color: GOLD, fontWeight: 700, marginBottom: 14,
      }}>📝 prompt:</div>
      <div style={{
        fontFamily: FONT_VN, fontWeight: 700, fontSize: 50, color: INK, lineHeight: 1.25,
      }}>"{data.prompt}"</div>
    </div>

    <div style={{
      position: "absolute", top: 950, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 48, color: GREEN,
    }}>kết quả mong đợi:</div>

    <div style={{
      position: "absolute", top: 1040, left: 80, right: 80,
      background: GREEN, color: "#FFF", border: `5px solid ${INK}`,
      borderRadius: 18, padding: "30px 36px", textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 56,
      transform: "rotate(0.6deg)",
    }}>{data.expect}</div>

    <div style={{
      position: "absolute", top: 1230, left: 80, right: 80,
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 44, color: INK, textAlign: "center",
      lineHeight: 1.25,
    }}>{data.note}</div>

    <div style={{ position: "absolute", bottom: 200, left: "50%", transform: "translateX(-50%)" }}>
      <Mascot pose="thumbs" scale={1.0} />
    </div>
    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 12 — TROUBLESHOOT
// =====================================================================

const SlideTrouble: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={12} total={13} />

    <div style={{
      position: "absolute", top: 240, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 96, color: INK, letterSpacing: -2,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 380, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 46, color: ACCENT,
    }}>3 lỗi hay gặp · cách fix</div>

    {data.issues.map((iss: any, i: number) => (
      <div key={i} style={{
        position: "absolute", top: 500 + i * 360, left: 60, right: 60,
        background: "#FFFEFB", border: `5px solid ${INK}`, borderRadius: 20,
        padding: "26px 30px",
        transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)`,
        boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
      }}>
        <div style={{
          display: "inline-block", background: RED_WARN, color: "#FFF",
          padding: "8px 18px", border: `3px solid ${INK}`, borderRadius: 8,
          fontFamily: FONT_HAND, fontWeight: 700, fontSize: 30, marginBottom: 14,
        }}>LỖI {i + 1}</div>
        <div style={{
          fontFamily: FONT_MONO, fontWeight: 600, fontSize: 30, color: RED_WARN,
          marginBottom: 14, wordBreak: "break-word",
        }}>{iss.err}</div>
        <div style={{
          fontFamily: FONT_VN, fontWeight: 600, fontSize: 30, color: INK, lineHeight: 1.3,
          whiteSpace: "pre-wrap",
        }}>
          <span style={{ color: GREEN, fontWeight: 800 }}>→ FIX:</span> {iss.fix}
        </div>
      </div>
    ))}

    <Footer />
  </AbsoluteFill>
);

// =====================================================================
// SLIDE 13 — OUTRO
// =====================================================================

const SlideOutro: React.FC<{ data: any }> = ({ data }) => (
  <AbsoluteFill>
    <PaperBg />
    <InkFrame />
    <ChannelBadge />
    <PageNum n={13} total={13} />

    <div style={{
      position: "absolute", top: 240, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 110, color: INK, letterSpacing: -3,
    }}>{data.title}</div>

    <div style={{
      position: "absolute", top: 430, left: 60, right: 60,
      background: ACCENT, color: "#FFF", border: `5px solid ${INK}`,
      borderRadius: 22, padding: "36px 30px", textAlign: "center",
      transform: "rotate(-1.5deg)",
      boxShadow: "0 10px 0 rgba(0,0,0,0.25)",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 70,
    }}>{data.save_cta}</div>

    <div style={{
      position: "absolute", top: 720, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_HAND, fontWeight: 700, fontSize: 56, color: INK, opacity: 0.7,
    }}>Tuần sau · tập tới</div>

    <div style={{
      position: "absolute", top: 820, left: 60, right: 60,
      background: "#FFF8E0", border: `5px solid ${INK}`, borderRadius: 22,
      padding: "36px 30px", textAlign: "center",
      transform: "rotate(1.2deg)",
    }}>
      <div style={{
        fontFamily: FONT_VN, fontWeight: 800, fontSize: 76, color: INK, marginBottom: 14,
      }}>{data.next_ep}</div>
      <div style={{
        fontFamily: FONT_HAND, fontWeight: 700, fontSize: 44, color: GOLD, lineHeight: 1.2,
      }}>{data.next_sub}</div>
    </div>

    <div style={{ position: "absolute", top: 1190, left: "50%", transform: "translateX(-50%)" }}>
      <Mascot pose="wink" scale={1.3} />
    </div>

    <div style={{
      position: "absolute", bottom: 180, left: 0, right: 0, textAlign: "center",
      fontFamily: FONT_VN, fontWeight: 800, fontSize: 80, color: GOLD,
      textShadow: `4px 4px 0 ${INK}`,
    }}>{data.handle}</div>
  </AbsoluteFill>
);

// =====================================================================
// MAIN — explicit-index slide renderer (no frame coupling)
// =====================================================================

export const Ep2Slide: React.FC<{ idx: number }> = ({ idx }) => {
  const safeIdx = Math.max(0, Math.min(idx, slidesData.slides.length - 1));
  const slide = slidesData.slides[safeIdx];

  switch (slide.type) {
    case "cover":      return <SlideCover data={slide} />;
    case "checklist":  return <SlideChecklist data={slide} />;
    case "os":         return <SlideOs data={slide} />;
    case "tool":       return <SlideTool data={slide} n={slide.id} />;
    case "tool_dual":  return <SlideToolDual data={slide} />;
    case "tool_warn":  return <SlideToolWarn data={slide} />;
    case "ide_grid":   return <SlideIdeGrid data={slide} />;
    case "clone":      return <SlideClone data={slide} />;
    case "env":        return <SlideEnv data={slide} />;
    case "test":       return <SlideTest data={slide} />;
    case "trouble":    return <SlideTrouble data={slide} />;
    case "outro":      return <SlideOutro data={slide} />;
    default: return <PaperBg />;
  }
};

// Frame-driven picker for still-image batch render — 1 frame = 1 slide
export const VibeEditingEp2Slides: React.FC = () => {
  const frame = useCurrentFrame();
  return <Ep2Slide idx={frame} />;
};
