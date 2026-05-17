import React from 'react';
import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080, H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

const Teacher = () => (
  <g>
    <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
    <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
    <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
    <rect x={-22} y={-25} width={44} height={58} rx={10} fill="#4A7AC8" stroke={INK} strokeWidth={3.5} />
    <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
    <line x1={22} y1={-12} x2={55} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
    <line x1={22} y1={-12} x2={55} y2={-40} stroke={INK} strokeWidth={2.5} />
    <circle cx={58} cy={-44} r={6} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
    <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
    <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
    <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
    <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
    <circle cx={-8} cy={-48} r={3} fill={INK} />
    <circle cx={8} cy={-48} r={3} fill={INK} />
    <ellipse cx={0} cy={-36} rx={4} ry={3} fill="#C04030" stroke={INK} strokeWidth={2} />
  </g>
);

export const AgiConspiracyThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <svg width={W} height={H}>
        <defs>
          <filter id="pn">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="vig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#pn)" />
        <rect width={W} height={H} fill="url(#vig)" />

        {/* Top bar */}
        <rect x={60} y={80} width={W - 120} height={140} rx={18} fill={ACCENT} stroke={INK} strokeWidth={5} />
        <text x={W / 2} y={160} fontSize={78} fill="#FFF" textAnchor="middle" fontWeight={800} letterSpacing="6">THUYẾT ÂM MƯU</text>
        <text x={W / 2} y={200} fontSize={22} fill="#FFF" textAnchor="middle" fontWeight={600} opacity={0.9}>AI VƯỢT MẶT CON NGƯỜI</text>

        {/* Big Hook */}
        <g transform={`translate(${W / 2}, 450)`}>
          <text fontSize={110} fill={INK} textAnchor="middle" fontWeight={800} letterSpacing="2">BỊ CHE GIẤU</text>
          <text y={120} fontSize={110} fill={ACCENT} textAnchor="middle" fontWeight={800} letterSpacing="2">BỞI BIG TECH?</text>
        </g>

        {/* Visual Element */}
        <g transform="translate(140, 700)">
          <rect x={0} y={0} width={800} height={400} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
          <text x={400} y={150} fontSize={120} textAnchor="middle">🚪</text>
          <text x={400} y={260} fontSize={50} fill={INK} textAnchor="middle" fontWeight={800}>CÁNH CỬA</text>
          <text x={400} y={320} fontSize={50} fill={ACCENT} textAnchor="middle" fontWeight={800}>ĐÓNG KÍN</text>
        </g>

        {/* Arrow down */}
        <g transform={`translate(${W / 2}, 1200)`}>
          <path d="M -40 -10 L 0 30 L 40 -10 Z" fill={ACCENT} stroke={INK} strokeWidth={3} />
        </g>

        {/* Mascot + speech */}
        <g transform={`translate(${W / 2 - 180}, 1460) scale(2.6)`}>
          <Teacher />
        </g>

        {/* Speech bubble */}
        <g transform={`translate(${W / 2 + 160}, 1380)`}>
          <rect x={-220} y={-70} width={440} height={140} rx={20} fill="#FFF" stroke={INK} strokeWidth={4} />
          <polygon points="-160,70 -180,120 -130,70" fill="#FFF" stroke={INK} strokeWidth={4} />
          <line x1={-159} y1={68} x2={-131} y2={68} stroke="#FFF" strokeWidth={6} />
          <text x={0} y={-20} fontSize={30} fill={INK} textAnchor="middle" fontWeight={800}>Anh Hai chia sẻ</text>
          <text x={0} y={20} fontSize={30} fill={ACCENT} textAnchor="middle" fontWeight={800}>SỰ THẬT 👇</text>
        </g>

        {/* Bottom CTA bar */}
        <rect x={60} y={1740} width={W - 120} height={120} rx={18} fill={INK} stroke={GOLD} strokeWidth={5} />
        <text x={W / 2} y={1788} fontSize={22} fill={GOLD} textAnchor="middle" fontWeight={700}>Bình luận ý kiến của bạn 👇</text>
        <text x={W / 2} y={1830} fontSize={28} fill="#FFF" textAnchor="middle" fontWeight={800}>Có Thật Hay Không?</text>
      </svg>
    </AbsoluteFill>
  );
};
