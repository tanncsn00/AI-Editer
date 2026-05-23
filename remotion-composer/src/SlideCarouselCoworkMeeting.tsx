import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

// Dark theme background
const BG_DEEP = "#0A0B14";
const BG_SURFACE = "#13141F";
const BG_ELEVATED = "#1A1B28";
const BORDER = "#2A2C3A";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9BA0B5";
const TEXT_MUTE = "#5A6075";

// Claude.ai brand
const CLAUDE_ORANGE = "#D97757";
const CLAUDE_ORANGE_DARK = "#B8612F";
const CLAUDE_CREAM = "#F4F1EA";
const CLAUDE_TEXT = "#1F1E1B";
const CLAUDE_BORDER = "#E5E0D6";
const CLAUDE_GRAY = "#6B6863";

// Browser chrome
const CHROME_BG = "#2A2A2E";
const CHROME_URL_BG = "#3F3F46";
const CHROME_TEXT = "#E5E5EA";

// Accents
const ACCENT_AMBER = "#F4B860";
const ACCENT_GREEN = "#3FD68A";
const ACCENT_RED = "#FF6B6B";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_VIOLET = "#B86FFF";

// App brand colors
const SLACK_PURPLE = "#4A154B";
const NOTION_BG = "#FFFFFF";
const NOTION_TEXT = "#37352F";
const LINEAR_PURPLE = "#5E6AD2";
const ASANA_RED = "#F06A6A";
const HUBSPOT_ORANGE = "#FF7A59";

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1);

// ============ COMMON ============
const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="cwbg1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={CLAUDE_ORANGE} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cwbg2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_AMBER} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cwbg3" cx="50%" cy="100%" r="50%">
        <stop offset="0%" stopColor={CLAUDE_ORANGE} stopOpacity="0.08" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="cwgrid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={CLAUDE_ORANGE} strokeWidth="1" opacity="0.04" />
      </pattern>
      <radialGradient id="cwmaskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="cwgm"><rect width={W} height={H} fill="url(#cwmaskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#cwgrid)" mask="url(#cwgm)" />
    <rect width={W} height={H} fill="url(#cwbg1)" />
    <rect width={W} height={H} fill="url(#cwbg2)" />
    <rect width={W} height={H} fill="url(#cwbg3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ ai weekly · cowork setup tutorial · non-tech
    </text>
  </g>
);

const StepHeader: React.FC<{ step: string; color: string; label: string }> = ({ step, color, label }) => (
  <g transform={`translate(${W / 2}, 130)`}>
    <rect x={-440} y={-46} width={880} height={92} rx={46} fill={BG_SURFACE} stroke={color} strokeWidth={3} />
    <g transform={`translate(-360, 0)`}>
      <rect x={-32} y={-26} width={64} height={52} rx={10} fill={color} />
      <text x={0} y={12} fontSize={26} fill={BG_DEEP} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        {step}
      </text>
    </g>
    <text x={20} y={12} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textAnchor="middle">
      {label}
    </text>
  </g>
);

// Browser window wrapper
const BrowserWindow: React.FC<{
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
  children?: React.ReactNode;
}> = ({ url, x, y, w, h, children }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Chrome top bar */}
    <rect x={0} y={0} width={w} height={70} rx={12} fill={CHROME_BG} />
    <rect x={0} y={56} width={w} height={14} fill={CHROME_BG} />
    {/* Window dots */}
    <circle cx={26} cy={35} r={9} fill="#FF5F56" />
    <circle cx={54} cy={35} r={9} fill="#FFBD2E" />
    <circle cx={82} cy={35} r={9} fill="#27C93F" />
    {/* URL bar */}
    <rect x={120} y={18} width={w - 240} height={36} rx={18} fill={CHROME_URL_BG} />
    <text x={140} y={42} fontSize={20} fill={CHROME_TEXT} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
      🔒 {url}
    </text>
    {/* Body */}
    <rect x={0} y={70} width={w} height={h - 70} fill={CLAUDE_CREAM} />
    {children}
  </g>
);

// Claude logo (asterisk-like)
const ClaudeLogo: React.FC<{ size: number; color?: string }> = ({ size, color = CLAUDE_ORANGE }) => (
  <g>
    <circle cx={0} cy={0} r={size} fill={color} />
    <text x={0} y={size * 0.35} fontSize={size * 1.5} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
      *
    </text>
  </g>
);

// ============ SLIDE 1: HOOK ============
const Slide1Hook: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 170)`}>
      <rect x={-360} y={-46} width={720} height={92} rx={46} fill={BG_SURFACE} stroke={CLAUDE_ORANGE} strokeWidth={3} />
      <text x={0} y={14} fontSize={30} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        🎯 SETUP COWORK · TUTORIAL
      </text>
    </g>

    {/* Mega title A → Z */}
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={260} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-12">
        A → Z
      </text>
    </g>

    <g transform={`translate(${W / 2}, 660)`}>
      <text x={0} y={0} fontSize={64} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
        từ ZERO đến CHẠY
      </text>
    </g>

    {/* 5 step preview */}
    <g transform={`translate(${W / 2}, 900)`}>
      <rect x={-490} y={-40} width={980} height={520} rx={20} fill={BG_SURFACE} stroke={CLAUDE_ORANGE} strokeWidth={3} />
      {[
        { n: 1, t: "Tải Desktop app (Mac/Win)", icon: "💾" },
        { n: 2, t: "Login + Pro plan ($20/mo đủ)", icon: "💳" },
        { n: 3, t: "Click tab Cowork (tải VM 2GB)", icon: "🖥️" },
        { n: 4, t: "Connect app: Slack/Notion/Linear", icon: "🔌" },
        { n: 5, t: "Paste prompt → xem result", icon: "✍️" },
      ].map((s, i) => (
        <g key={i} transform={`translate(-450, ${30 + i * 90})`}>
          <circle cx={0} cy={0} r={32} fill={CLAUDE_ORANGE} />
          <text x={0} y={11} fontSize={32} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            {s.n}
          </text>
          <text x={60} y={0} fontSize={36} textAnchor="start" fontFamily="'Inter', sans-serif">{s.icon}</text>
          <text x={130} y={12} fontSize={28} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
            {s.t}
          </text>
        </g>
      ))}
    </g>

    {/* Bottom badge */}
    <g transform={`translate(${W / 2}, 1620)`}>
      <rect x={-440} y={-60} width={880} height={120} rx={20} fill={BG_SURFACE} stroke={ACCENT_GREEN} strokeWidth={3} />
      <text x={0} y={-12} fontSize={32} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        0 CODE · 100% CLICK CHUỘT
      </text>
      <text x={0} y={28} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        Non-tech beginner · 2 phút setup
      </text>
    </g>
  </g>
);

// ============ SLIDE 2: STEP 1 - DOWNLOAD DESKTOP APP ============
const Slide2Signup: React.FC = () => (
  <g>
    <StepHeader step="1" color={CLAUDE_ORANGE} label="Download Claude Desktop" />

    <BrowserWindow url="claude.com/download" x={30} y={230} w={1020} h={1480}>
      {/* Page header */}
      <g transform={`translate(0, 130)`}>
        <g transform={`translate(510, 0)`}>
          <ClaudeLogo size={36} />
        </g>
        <text x={510} y={110} fontSize={46} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          Download Claude
        </text>
        <text x={510} y={150} fontSize={22} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          Chat, Cowork, Code · all in one app
        </text>
      </g>

      {/* DESKTOP section header */}
      <g transform={`translate(40, 350)`}>
        <text x={0} y={0} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={800}>
          🖥️ DESKTOP (có Cowork ✓)
        </text>
      </g>

      {/* 3 desktop platform cards - smaller */}
      <g transform={`translate(40, 380)`}>
        {/* macOS */}
        <g transform={`translate(0, 0)`}>
          <rect x={0} y={0} width={300} height={200} rx={16} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
          <text x={150} y={70} fontSize={48} textAnchor="middle"></text>
          <text x={150} y={120} fontSize={24} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            macOS
          </text>
          <rect x={40} y={150} width={220} height={40} rx={20} fill={CLAUDE_TEXT} />
          <text x={150} y={177} fontSize={18} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ⬇ .dmg · 120MB
          </text>
        </g>

        {/* Windows — HIGHLIGHTED */}
        <g transform={`translate(320, -10)`}>
          <rect x={0} y={0} width={300} height={220} rx={16} fill={CLAUDE_ORANGE} stroke={ACCENT_RED} strokeWidth={4} />
          <rect x={80} y={-15} width={140} height={30} rx={15} fill={CLAUDE_ORANGE_DARK} />
          <text x={150} y={5} fontSize={16} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            ⭐ POPULAR
          </text>
          <text x={150} y={75} fontSize={42} textAnchor="middle">⊞</text>
          <text x={150} y={130} fontSize={24} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            Windows
          </text>
          <rect x={40} y={160} width={220} height={46} rx={23} fill="white" />
          <text x={150} y={190} fontSize={20} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            ⬇ Setup · 120MB
          </text>
        </g>

        {/* Windows ARM */}
        <g transform={`translate(640, 0)`}>
          <rect x={0} y={0} width={300} height={200} rx={16} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
          <text x={150} y={70} fontSize={42} textAnchor="middle">⊞</text>
          <text x={150} y={120} fontSize={22} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            Win ARM64
          </text>
          <rect x={40} y={150} width={220} height={40} rx={20} fill={CLAUDE_TEXT} />
          <text x={150} y={177} fontSize={18} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ⬇ ARM · 120MB
          </text>
        </g>
      </g>

      {/* MOBILE section header */}
      <g transform={`translate(40, 660)`}>
        <text x={0} y={0} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={800}>
          📱 MOBILE — Dispatch task ✓
        </text>
      </g>

      {/* Mobile cards */}
      <g transform={`translate(40, 690)`}>
        {/* iOS */}
        <g transform={`translate(0, 0)`}>
          <rect x={0} y={0} width={300} height={180} rx={16} fill="white" stroke={ACCENT_GREEN} strokeWidth={2} />
          <text x={150} y={65} fontSize={42} textAnchor="middle">📱</text>
          <text x={150} y={108} fontSize={22} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            iOS · iPhone/iPad
          </text>
          <text x={150} y={134} fontSize={14} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ✓ Dispatch · 09/2025
          </text>
          <rect x={40} y={145} width={220} height={28} rx={14} fill="#F0EBE0" />
          <text x={150} y={164} fontSize={15} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            App Store
          </text>
        </g>

        {/* Android */}
        <g transform={`translate(320, 0)`}>
          <rect x={0} y={0} width={300} height={180} rx={16} fill="white" stroke={ACCENT_GREEN} strokeWidth={2} />
          <text x={150} y={65} fontSize={42} textAnchor="middle">🤖</text>
          <text x={150} y={108} fontSize={22} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            Android
          </text>
          <text x={150} y={134} fontSize={14} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ✓ Dispatch · 04/2026 beta
          </text>
          <rect x={40} y={145} width={220} height={28} rx={14} fill="#F0EBE0" />
          <text x={150} y={164} fontSize={15} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            Google Play
          </text>
        </g>

        {/* Linux - not supported */}
        <g transform={`translate(640, 0)`}>
          <rect x={0} y={0} width={300} height={180} rx={16} fill="#FEEAE9" stroke={ACCENT_RED} strokeWidth={2} strokeDasharray="6 6" />
          <text x={150} y={70} fontSize={42} textAnchor="middle">🐧</text>
          <text x={150} y={115} fontSize={22} fill={ACCENT_RED} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            Linux
          </text>
          <text x={150} y={155} fontSize={16} fill={ACCENT_RED} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ❌ Chưa support
          </text>
        </g>
      </g>

      {/* Important note: Dispatch model */}
      <g transform={`translate(40, 920)`}>
        <rect x={0} y={0} width={940} height={130} rx={12} fill="#FFF8E7" stroke={ACCENT_AMBER} strokeWidth={3} />
        <text x={30} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          💡 Mobile = giao task · Desktop = execute
        </text>
        <text x={30} y={75} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          📱 Nhắn task từ iPhone đi đường → 🖥️ Desktop làm việc
        </text>
        <text x={30} y={105} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Pair 2 thiết bị · Desktop phải BẬT + Cowork mở
        </text>
      </g>

      {/* Step instruction */}
      <g transform={`translate(40, 1090)`}>
        <rect x={0} y={0} width={940} height={150} rx={12} fill="#F0EBE0" stroke={CLAUDE_BORDER} strokeWidth={2} />
        <text x={30} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          📋 3 bước cài đặt Desktop:
        </text>
        <text x={30} y={72} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          1. Click download cho HĐH (Mac/Win)
        </text>
        <text x={30} y={100} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          2. Mở installer · next-next-finish
        </text>
        <text x={30} y={128} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          3. Mở từ Start menu / Applications
        </text>
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 3: STEP 2 - LOGIN + PRO PLAN ============
const Slide3Open: React.FC = () => (
  <g>
    <StepHeader step="2" color={CLAUDE_ORANGE} label="Login + chọn Pro $20" />

    <BrowserWindow url="claude.ai/upgrade" x={30} y={230} w={1020} h={1480}>
      <g transform={`translate(0, 110)`}>
        <g transform={`translate(510, 0)`}>
          <ClaudeLogo size={32} />
        </g>
        <text x={510} y={90} fontSize={42} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          Upgrade your plan
        </text>
        <text x={510} y={130} fontSize={22} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          Pro đã đủ Cowork · không cần Max
        </text>
      </g>

      {/* 3 pricing cards — Pro highlighted */}
      <g transform={`translate(40, 360)`}>
        {/* Pro card — HIGHLIGHTED (đủ Cowork) */}
        <g transform={`translate(0, -20)`}>
          <rect x={0} y={0} width={300} height={560} rx={16} fill={CLAUDE_ORANGE} stroke={ACCENT_RED} strokeWidth={4} />
          <rect x={70} y={-20} width={160} height={36} rx={18} fill={CLAUDE_ORANGE_DARK} />
          <text x={150} y={3} fontSize={16} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            ⭐ ĐỦ XÀI COWORK
          </text>
          <text x={30} y={70} fontSize={28} fill="white" fontFamily="'Inter', sans-serif" fontWeight={800}>Pro</text>
          <text x={30} y={130} fontSize={48} fill="white" fontFamily="'Inter', sans-serif" fontWeight={900}>$20</text>
          <text x={150} y={130} fontSize={20} fill="white" fontFamily="'Inter', sans-serif" fontWeight={500}>/month</text>
          {["✓ Cowork access", "✓ 5x free chat", "✓ Connectors", "✓ Projects"].map((f, i) => (
            <text key={i} x={30} y={190 + i * 36} fontSize={18} fill="white" fontFamily="'Inter', sans-serif" fontWeight={600}>
              {f}
            </text>
          ))}
          <rect x={30} y={460} width={240} height={56} rx={28} fill="white" />
          <text x={150} y={494} fontSize={22} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            ✓ Subscribe Pro
          </text>
        </g>

        {/* Max card */}
        <g transform={`translate(320, 0)`}>
          <rect x={0} y={0} width={300} height={520} rx={16} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
          <text x={30} y={50} fontSize={26} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>Max</text>
          <text x={30} y={110} fontSize={40} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={800}>$100</text>
          <text x={130} y={110} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>/month</text>
          {["✓ Cowork access", "✓ 5x Pro usage", "✓ Connectors", "✓ Heavy user"].map((f, i) => (
            <text key={i} x={30} y={170 + i * 36} fontSize={18} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {f}
            </text>
          ))}
        </g>

        {/* Max 20x card */}
        <g transform={`translate(640, 0)`}>
          <rect x={0} y={0} width={300} height={520} rx={16} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
          <text x={30} y={50} fontSize={26} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>Max 20x</text>
          <text x={30} y={110} fontSize={40} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={800}>$200</text>
          <text x={130} y={110} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>/month</text>
          {["✓ Cowork access", "✓ 20x Pro usage", "✓ Connectors", "✓ Power user"].map((f, i) => (
            <text key={i} x={30} y={170 + i * 36} fontSize={18} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {f}
            </text>
          ))}
        </g>
      </g>

      {/* Free not enough */}
      <g transform={`translate(40, 980)`}>
        <rect x={0} y={0} width={940} height={90} rx={12} fill="#FEEAE9" stroke={ACCENT_RED} strokeWidth={2} />
        <text x={30} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          🚫 Free plan KHÔNG có Cowork
        </text>
        <text x={30} y={72} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Bắt buộc upgrade Pro trở lên
        </text>
      </g>

      {/* Payment note */}
      <g transform={`translate(40, 1110)`}>
        <rect x={0} y={0} width={940} height={130} rx={12} fill="#FFF8E7" stroke={ACCENT_AMBER} strokeWidth={2} />
        <text x={30} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          ⚠️ Payment cho VN:
        </text>
        <text x={30} y={75} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          ✓ Visa quốc tế  ✓ PayPal  ✓ Mastercard
        </text>
        <text x={30} y={105} fontSize={20} fill={ACCENT_RED} fontFamily="'Inter', sans-serif" fontWeight={500}>
          ✗ Momo/ZaloPay chưa hỗ trợ
        </text>
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 4: STEP 3 - CONNECT APPS ============
const Slide4Connect: React.FC = () => (
  <g>
    <StepHeader step="3" color={ACCENT_BLUE} label="Connect app · OAuth" />

    <BrowserWindow url="claude.ai/settings/connectors" x={30} y={230} w={1020} h={1480}>
      {/* Settings sidebar mini */}
      <g transform={`translate(0, 100)`}>
        <rect x={20} y={0} width={220} height={1320} rx={12} fill="white" stroke={CLAUDE_BORDER} strokeWidth={1} />
        {["Profile", "Billing", "Connectors", "Privacy", "API keys"].map((m, i) => (
          <g key={i} transform={`translate(40, ${50 + i * 60})`}>
            <text x={0} y={0} fontSize={20} fill={m === "Connectors" ? CLAUDE_ORANGE : CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={m === "Connectors" ? 800 : 500}>
              {m === "Connectors" ? "🔌 " : ""}{m}
            </text>
            {m === "Connectors" && (
              <rect x={-20} y={-20} width={4} height={40} fill={CLAUDE_ORANGE} />
            )}
          </g>
        ))}
      </g>

      {/* Main area */}
      <g transform={`translate(260, 120)`}>
        <text x={0} y={0} fontSize={36} fill={CLAUDE_TEXT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          Connectors
        </text>
        <text x={0} y={36} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Connect external apps to use in Cowork
        </text>
      </g>

      {/* Connector cards */}
      <g transform={`translate(260, 220)`}>
        {[
          { app: "Slack", color: SLACK_PURPLE, status: "connected", desc: "Workspace messaging" },
          { app: "Notion", color: NOTION_TEXT, status: "connected", desc: "Docs and databases" },
          { app: "Linear", color: LINEAR_PURPLE, status: "connected", desc: "Issue tracking" },
          { app: "Asana", color: ASANA_RED, status: "available", desc: "Project management" },
          { app: "HubSpot", color: HUBSPOT_ORANGE, status: "available", desc: "CRM and marketing" },
          { app: "Gmail", color: "#EA4335", status: "available", desc: "Email & calendar" },
        ].map((c, i) => {
          const connected = c.status === "connected";
          return (
            <g key={i} transform={`translate(0, ${i * 120})`}>
              <rect x={0} y={0} width={760} height={100} rx={12} fill="white" stroke={CLAUDE_BORDER} strokeWidth={1} />
              {/* App icon */}
              <rect x={20} y={20} width={60} height={60} rx={12} fill={c.color} />
              <text x={50} y={64} fontSize={32} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
                {c.app[0]}
              </text>
              {/* App name */}
              <text x={100} y={42} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
                {c.app}
              </text>
              <text x={100} y={72} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
                {c.desc}
              </text>
              {/* Button */}
              {connected ? (
                <g transform={`translate(640, 50)`}>
                  <rect x={-80} y={-22} width={160} height={44} rx={22} fill="#E6F4EA" stroke={ACCENT_GREEN} strokeWidth={2} />
                  <text x={0} y={6} fontSize={18} fill="#1B7A3F" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
                    ✓ Connected
                  </text>
                </g>
              ) : (
                <g transform={`translate(640, 50)`}>
                  <rect x={-80} y={-22} width={160} height={44} rx={22} fill={CLAUDE_ORANGE} />
                  <text x={0} y={6} fontSize={18} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
                    + Connect
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* OAuth popup overlay */}
      <g transform={`translate(580, 350)`}>
        <rect x={-200} y={-80} width={400} height={300} rx={16} fill="white" stroke={SLACK_PURPLE} strokeWidth={4} filter="drop-shadow(0 8px 24px rgba(0,0,0,0.3))" />
        <rect x={-200} y={-80} width={400} height={50} rx={16} fill={SLACK_PURPLE} />
        <text x={0} y={-44} fontSize={20} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          🔐 Slack OAuth
        </text>
        <text x={0} y={0} fontSize={22} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
          Claude wants access to:
        </text>
        <text x={0} y={40} fontSize={18} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          ✓ Read channel messages
        </text>
        <text x={0} y={70} fontSize={18} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          ✓ Post in channels
        </text>
        <g transform={`translate(0, 140)`}>
          <rect x={-150} y={-30} width={300} height={60} rx={30} fill={SLACK_PURPLE} />
          <text x={0} y={8} fontSize={22} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>
            Allow
          </text>
        </g>
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 4 NEW: STEP 3 - DESKTOP APP COWORK TAB ============
const Slide4Tab: React.FC = () => (
  <g>
    <StepHeader step="3" color={CLAUDE_ORANGE} label="Click tab Cowork · Desktop" />

    {/* Desktop app window mock — NOT browser, native app */}
    <g transform={`translate(40, 230)`}>
      {/* App title bar */}
      <rect x={0} y={0} width={1000} height={50} rx={12} fill={CHROME_BG} />
      <circle cx={26} cy={25} r={9} fill="#FF5F56" />
      <circle cx={54} cy={25} r={9} fill="#FFBD2E" />
      <circle cx={82} cy={25} r={9} fill="#27C93F" />
      <text x={500} y={32} fontSize={18} fill={CHROME_TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
        Claude Desktop
      </text>

      {/* App body */}
      <rect x={0} y={50} width={1000} height={1400} fill={CLAUDE_CREAM} />

      {/* Sidebar */}
      <rect x={0} y={50} width={220} height={1400} fill="#EDE7DA" />
      <g transform={`translate(20, 90)`}>
        <g transform={`translate(10, 0)`}>
          <ClaudeLogo size={16} />
        </g>
        <text x={40} y={6} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={800}>
          Claude
        </text>
      </g>

      <g transform={`translate(20, 160)`}>
        <rect x={0} y={0} width={180} height={50} rx={8} fill="transparent" />
        <text x={20} y={32} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          💬 Chat
        </text>
      </g>
      <g transform={`translate(20, 220)`}>
        <rect x={0} y={0} width={180} height={50} rx={8} fill={CLAUDE_ORANGE} />
        <text x={20} y={32} fontSize={20} fill="white" fontFamily="'Inter', sans-serif" fontWeight={700}>
          🤝 Cowork
        </text>
      </g>
      <g transform={`translate(20, 280)`}>
        <text x={20} y={32} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          💻 Code
        </text>
      </g>
      <g transform={`translate(20, 340)`}>
        <text x={20} y={32} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          📁 Projects
        </text>
      </g>
      <g transform={`translate(20, 400)`}>
        <text x={20} y={32} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
          ⚙️ Settings
        </text>
      </g>

      {/* Arrow to Cowork tab */}
      <g transform={`translate(225, 245)`}>
        <text x={0} y={0} fontSize={40} fill={ACCENT_RED}>👈</text>
        <text x={50} y={5} fontSize={20} fill={ACCENT_RED} fontFamily="'Inter', sans-serif" fontWeight={700}>Click đây</text>
      </g>

      {/* Main content — VM download progress */}
      <g transform={`translate(370, 150)`}>
        <text x={250} y={0} fontSize={36} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          Setting up Cowork...
        </text>
        <text x={250} y={40} fontSize={20} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          Lần đầu tải VM image (1 lần duy nhất)
        </text>

        {/* VM download progress */}
        <g transform={`translate(0, 110)`}>
          <rect x={0} y={0} width={500} height={250} rx={16} fill="white" stroke={CLAUDE_ORANGE} strokeWidth={3} />
          <text x={20} y={45} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
            📦 Downloading sandbox VM
          </text>
          <text x={20} y={75} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            ubuntu-cowork-v2.image
          </text>

          {/* Progress bar */}
          <rect x={20} y={110} width={460} height={20} rx={10} fill={CLAUDE_BORDER} />
          <rect x={20} y={110} width={300} height={20} rx={10} fill={CLAUDE_ORANGE} />
          <text x={250} y={156} fontSize={20} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            1.32 / 2.04 GB · 65%
          </text>
          <text x={250} y={185} fontSize={16} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            ~ 1 phút 20 giây còn lại
          </text>

          {/* Spinner */}
          <text x={250} y={220} fontSize={20} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ⏳ Đang tải · vui lòng đợi
          </text>
        </g>

        {/* Info */}
        <g transform={`translate(0, 400)`}>
          <rect x={0} y={0} width={500} height={170} rx={12} fill="#F0EBE0" stroke={CLAUDE_BORDER} strokeWidth={2} />
          <text x={20} y={40} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
            🖥️ VM 2GB này là gì?
          </text>
          <text x={20} y={75} fontSize={18} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            • Máy ảo Linux Cowork chạy task
          </text>
          <text x={20} y={105} fontSize={18} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            • Sandbox bảo mật, tách biệt máy bạn
          </text>
          <text x={20} y={135} fontSize={18} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            • Tải 1 lần · xài cả đời
          </text>
        </g>
      </g>
    </g>
  </g>
);

// ============ SLIDE 5: STEP 4 - CHOOSE APPS ============
const Slide5Choose: React.FC = () => (
  <g>
    <StepHeader step="4" color={ACCENT_GREEN} label="Tick app cho session" />

    <BrowserWindow url="claude.ai/cowork/new" x={30} y={230} w={1020} h={1480}>
      {/* Chat area */}
      <g transform={`translate(0, 100)`}>
        <text x={510} y={50} fontSize={36} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          New Cowork session
        </text>
        <text x={510} y={90} fontSize={20} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
          Pick apps you allow Cowork to use
        </text>
      </g>

      {/* Big input area */}
      <g transform={`translate(40, 320)`}>
        <rect x={0} y={0} width={940} height={280} rx={16} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />

        {/* Apps section highlighted */}
        <g transform={`translate(20, 20)`}>
          <rect x={0} y={0} width={900} height={70} rx={10} fill="#F4F1EA" stroke={ACCENT_RED} strokeWidth={3} />
          <text x={20} y={28} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={700}>
            🔌 APPS FOR THIS SESSION
          </text>
          <text x={20} y={52} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={600}>
            ✓ Slack  ✓ Notion  ✓ Linear  ☐ Asana  ☐ Gmail  + Add more
          </text>
        </g>

        {/* Prompt placeholder */}
        <g transform={`translate(20, 120)`}>
          <text x={0} y={0} fontSize={20} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Ask Cowork to do something...
          </text>
        </g>

        {/* Send button */}
        <g transform={`translate(890, 240)`}>
          <circle cx={0} cy={0} r={26} fill={CLAUDE_ORANGE} />
          <text x={0} y={9} fontSize={26} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
            ↑
          </text>
        </g>
      </g>

      {/* Arrow callout */}
      <g transform={`translate(880, 380)`}>
        <text x={0} y={0} fontSize={48} fill={ACCENT_RED}>👈</text>
        <text x={20} y={56} fontSize={20} fill={ACCENT_RED} fontFamily="'Inter', sans-serif" fontWeight={700}>
          Tick apps
        </text>
      </g>

      {/* App picker dropdown — visual */}
      <g transform={`translate(40, 700)`}>
        <text x={0} y={0} fontSize={26} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          Bạn chọn:
        </text>
        {[
          { app: "Slack", color: SLACK_PURPLE, checked: true },
          { app: "Notion", color: NOTION_TEXT, checked: true },
          { app: "Linear", color: LINEAR_PURPLE, checked: true },
          { app: "Asana", color: ASANA_RED, checked: false },
          { app: "Gmail", color: "#EA4335", checked: false },
          { app: "HubSpot", color: HUBSPOT_ORANGE, checked: false },
        ].map((a, i) => (
          <g key={i} transform={`translate(0, ${40 + i * 80})`}>
            <rect x={0} y={0} width={940} height={64} rx={10} fill={a.checked ? "#E6F4EA" : "white"} stroke={a.checked ? ACCENT_GREEN : CLAUDE_BORDER} strokeWidth={a.checked ? 2 : 1} />
            <rect x={20} y={14} width={36} height={36} rx={8} fill={a.color} />
            <text x={38} y={40} fontSize={20} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
              {a.app[0]}
            </text>
            <text x={80} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={600}>
              {a.app}
            </text>
            <g transform={`translate(880, 32)`}>
              <rect x={-22} y={-18} width={44} height={36} rx={6} fill={a.checked ? ACCENT_GREEN : "white"} stroke={a.checked ? ACCENT_GREEN : CLAUDE_BORDER} strokeWidth={2} />
              {a.checked && (
                <text x={0} y={6} fontSize={22} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>
                  ✓
                </text>
              )}
            </g>
          </g>
        ))}
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 6: STEP 5 - PASTE PROMPT ============
const Slide6Prompt: React.FC = () => (
  <g>
    <StepHeader step="5" color={ACCENT_AMBER} label="Paste prompt → Enter" />

    <BrowserWindow url="claude.ai/cowork/new" x={30} y={230} w={1020} h={1480}>
      {/* Session header */}
      <g transform={`translate(0, 100)`}>
        <rect x={20} y={0} width={980} height={60} rx={12} fill="white" stroke={CLAUDE_BORDER} strokeWidth={1} />
        <text x={40} y={38} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          📋 Standup summary 22/05
        </text>
        <text x={920} y={38} fontSize={18} fill={ACCENT_GREEN} textAnchor="end" fontFamily="'Inter', sans-serif" fontWeight={700}>
          ● 3 apps connected
        </text>
      </g>

      {/* Apps active row */}
      <g transform={`translate(40, 200)`}>
        <text x={0} y={0} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={600}>
          Active in session:
        </text>
        {[
          { app: "Slack", color: SLACK_PURPLE },
          { app: "Notion", color: NOTION_TEXT },
          { app: "Linear", color: LINEAR_PURPLE },
        ].map((a, i) => (
          <g key={i} transform={`translate(${180 + i * 130}, -15)`}>
            <rect x={0} y={0} width={120} height={36} rx={18} fill={a.color} />
            <text x={60} y={24} fontSize={16} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>
              {a.app}
            </text>
          </g>
        ))}
      </g>

      {/* BIG prompt input area highlighted */}
      <g transform={`translate(40, 270)`}>
        <rect x={0} y={0} width={940} height={680} rx={16} fill="white" stroke={ACCENT_AMBER} strokeWidth={4} />
        <text x={20} y={40} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={700}>
          📝 PROMPT (paste vô đây):
        </text>

        <g transform={`translate(20, 90)`}>
          <text x={0} y={0} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Đọc Slack channel #daily-standup hôm nay
          </text>
          <text x={0} y={42} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            từ 8h đến 17h.
          </text>
          <text x={0} y={100} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Tổng hợp thành Notion page với 3 section:
          </text>
          <text x={20} y={150} fontSize={22} fill={CLAUDE_ORANGE} fontFamily="'Inter', sans-serif" fontWeight={700}>
            • TL;DR (3 dòng quan trọng nhất)
          </text>
          <text x={20} y={186} fontSize={22} fill={CLAUDE_ORANGE} fontFamily="'Inter', sans-serif" fontWeight={700}>
            • Decision log (table)
          </text>
          <text x={20} y={222} fontSize={22} fill={CLAUDE_ORANGE} fontFamily="'Inter', sans-serif" fontWeight={700}>
            • Action items (table)
          </text>

          <text x={0} y={290} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Sau đó tạo 1 ticket Linear cho mỗi
          </text>
          <text x={0} y={332} fontSize={24} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
            action item. Auto assign owner + due date.
          </text>

          <text x={0} y={410} fontSize={22} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            ↩ Cuối cùng notify lại channel với link.
          </text>
        </g>

        {/* Send button highlighted */}
        <g transform={`translate(880, 620)`}>
          <circle cx={0} cy={0} r={32} fill={ACCENT_AMBER} stroke={ACCENT_RED} strokeWidth={4} />
          <text x={0} y={11} fontSize={32} fill="white" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>
            ↑
          </text>
        </g>
        <g transform={`translate(820, 670)`}>
          <text x={0} y={0} fontSize={20} fill={ACCENT_RED} fontFamily="'Inter', sans-serif" fontWeight={700} textAnchor="end">
            Enter ⏎
          </text>
        </g>
      </g>

      {/* Info note */}
      <g transform={`translate(40, 1000)`}>
        <rect x={0} y={0} width={940} height={130} rx={12} fill="#F0EBE0" stroke={CLAUDE_BORDER} strokeWidth={2} />
        <text x={30} y={40} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
          💡 Tip cho non-tech:
        </text>
        <text x={30} y={75} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Viết prompt như nói chuyện với assistant người
        </text>
        <text x={30} y={105} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Cụ thể hơn = kết quả tốt hơn · không cần biết code
        </text>
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 7: STEP 6 - RESULT ============
const Slide7Result: React.FC = () => (
  <g>
    <StepHeader step="6" color={ACCENT_GREEN} label="Xem result + links" />

    <BrowserWindow url="claude.ai/cowork/session-22-05" x={30} y={230} w={1020} h={1480}>
      {/* User message */}
      <g transform={`translate(40, 110)`}>
        <rect x={0} y={0} width={940} height={90} rx={12} fill="#F4F1EA" />
        <text x={20} y={32} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={700}>
          you · 09:02
        </text>
        <text x={20} y={68} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={500}>
          Đọc Slack #daily-standup, tổng hợp Notion, tạo Linear ticket...
        </text>
      </g>

      {/* Cowork response */}
      <g transform={`translate(40, 230)`}>
        <rect x={0} y={0} width={940} height={1080} rx={12} fill="white" stroke={CLAUDE_ORANGE} strokeWidth={2} />

        {/* Bot identity */}
        <g transform={`translate(20, 30)`}>
          <ClaudeLogo size={16} />
          <text x={30} y={6} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
            Cowork
          </text>
          <text x={130} y={6} fontSize={16} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            09:02 · 3 phút trước
          </text>
        </g>

        {/* Progress log */}
        <g transform={`translate(20, 90)`}>
          {[
            { icon: "✓", txt: "Connected Slack workspace", c: ACCENT_GREEN },
            { icon: "✓", txt: "Read 312 messages from #daily-standup", c: ACCENT_GREEN },
            { icon: "✓", txt: "Analyzed: 5 topics · 8 decisions · 12 actions", c: ACCENT_GREEN },
            { icon: "✓", txt: "Created Notion page 'Standup 22/05'", c: ACCENT_GREEN },
            { icon: "✓", txt: "Created 12 Linear tickets · auto assigned", c: ACCENT_GREEN },
            { icon: "✓", txt: "Posted notification to #daily-standup", c: ACCENT_GREEN },
          ].map((p, i) => (
            <text key={i} x={0} y={i * 36} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
              <tspan fill={p.c} fontWeight={800}>{p.icon}</tspan>  {p.txt}
            </text>
          ))}
        </g>

        {/* Summary card */}
        <g transform={`translate(20, 380)`}>
          <rect x={0} y={0} width={900} height={160} rx={12} fill="#F0F9F1" stroke={ACCENT_GREEN} strokeWidth={2} />
          <text x={20} y={36} fontSize={24} fill="#1B7A3F" fontFamily="'Inter', sans-serif" fontWeight={800}>
            ✅ Done in 2 phút 47 giây
          </text>
          <text x={20} y={74} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={600}>
            312 messages analyzed · 12 tickets created
          </text>
          <text x={20} y={108} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Tiết kiệm ~2h vs làm tay
          </text>
          <text x={20} y={138} fontSize={18} fill={CLAUDE_GRAY} fontFamily="'Inter', sans-serif" fontWeight={500}>
            Cost: ~$0.40 · ROI siêu cao
          </text>
        </g>

        {/* Link cards */}
        <g transform={`translate(20, 580)`}>
          <text x={0} y={0} fontSize={22} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
            🔗 Click vào để xem kết quả:
          </text>

          {/* Notion link */}
          <g transform={`translate(0, 30)`}>
            <rect x={0} y={0} width={900} height={90} rx={10} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
            <rect x={20} y={20} width={50} height={50} rx={10} fill={NOTION_TEXT} />
            <text x={45} y={56} fontSize={26} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
              N
            </text>
            <text x={90} y={38} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
              📄 Standup 22/05 · Notion page
            </text>
            <text x={90} y={66} fontSize={16} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              notion.so/tvk/standup-22-05
            </text>
            <text x={860} y={50} fontSize={24} fill={CLAUDE_GRAY} textAnchor="middle">↗</text>
          </g>

          {/* Linear link */}
          <g transform={`translate(0, 140)`}>
            <rect x={0} y={0} width={900} height={90} rx={10} fill="white" stroke={CLAUDE_BORDER} strokeWidth={2} />
            <rect x={20} y={20} width={50} height={50} rx={10} fill={LINEAR_PURPLE} />
            <text x={45} y={56} fontSize={26} fill="white" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
              L
            </text>
            <text x={90} y={38} fontSize={20} fill={CLAUDE_TEXT} fontFamily="'Inter', sans-serif" fontWeight={700}>
              🎫 12 tickets in Linear · Q2-2026
            </text>
            <text x={90} y={66} fontSize={16} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
              linear.app/tvk/project/q2-2026
            </text>
            <text x={860} y={50} fontSize={24} fill={CLAUDE_GRAY} textAnchor="middle">↗</text>
          </g>
        </g>

        {/* Coffee status */}
        <g transform={`translate(20, 900)`}>
          <rect x={0} y={0} width={900} height={140} rx={12} fill="#FFF8E7" stroke={ACCENT_AMBER} strokeWidth={2} />
          <text x={450} y={50} fontSize={32} fill={CLAUDE_TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            ☕ Bạn vẫn đang uống coffee
          </text>
          <text x={450} y={95} fontSize={22} fill={CLAUDE_GRAY} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            Cowork làm xong rồi · click link xem
          </text>
        </g>
      </g>
    </BrowserWindow>
  </g>
);

// ============ SLIDE 8: CTA ============
const Slide8CTA: React.FC = () => (
  <g>
    <g transform={`translate(${W / 2}, 220)`}>
      <rect x={-360} y={-46} width={720} height={92} rx={46} fill={BG_SURFACE} stroke={CLAUDE_ORANGE} strokeWidth={3} />
      <text x={0} y={14} fontSize={30} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        🎯 SETUP 1 LẦN · XÀI CẢ ĐỜI
      </text>
    </g>

    {/* Recap 5 steps */}
    <g transform={`translate(${W / 2}, 450)`}>
      <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
        DONE!
      </text>
      <text x={0} y={70} fontSize={32} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Cowork ready · không cần dev
      </text>
    </g>

    {/* CTA buttons */}
    <g transform={`translate(${W / 2}, 800)`}>
      {[
        "💾  Save tutorial setup",
        "💬  Comment app muốn connect",
        "🔗  Follow · weekly Cowork use case",
      ].map((ln, i) => (
        <g key={i} transform={`translate(0, ${i * 130})`}>
          <rect x={-440} y={-48} width={880} height={96} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
          <text x={0} y={14} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            {ln}
          </text>
        </g>
      ))}
    </g>

    {/* Bottom info */}
    <g transform={`translate(${W / 2}, 1380)`}>
      <rect x={-440} y={-80} width={880} height={160} rx={20} fill={BG_SURFACE} stroke={CLAUDE_ORANGE} strokeWidth={3} />
      <text x={0} y={-30} fontSize={26} fill={CLAUDE_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        Next tutorial · weekly:
      </text>
      <text x={0} y={10} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        📊 Excel report · 📄 Client proposal
      </text>
      <text x={0} y={42} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
        📋 CV review · 💼 Sales pipeline · ...
      </text>
    </g>

    <g transform={`translate(${W / 2}, 1640)`}>
      <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
        gửi đồng nghiệp PM cùng setup · save signal cao
      </text>
    </g>
  </g>
);

export const SlideCarouselCoworkMeeting: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const slideNum = idx + 1;

  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {slideNum === 1 && <Slide1Hook />}
        {slideNum === 2 && <Slide2Signup />}
        {slideNum === 3 && <Slide3Open />}
        {slideNum === 4 && <Slide4Tab />}
        {slideNum === 5 && <Slide4Connect />}
        {slideNum === 6 && <Slide6Prompt />}
        {slideNum === 7 && <Slide7Result />}
        {slideNum === 8 && <Slide8CTA />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
