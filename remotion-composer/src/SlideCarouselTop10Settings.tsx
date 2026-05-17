import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#08080F";
const BG_SURFACE = "#13131C";
const BG_ELEVATED = "#1A1A26";
const BORDER = "#252535";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9090A5";
const TEXT_MUTE = "#5A5A70";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_CYAN = "#3DD9D6";
const ACCENT_SOLID = "#7E5BFF";
const GOLD = "#F4B860";
const GREEN = "#34D399";
const ORANGE = "#FF9F4D";
const RED = "#FF6B6B";

type Slide = {
  kind: "hook" | "cmd" | "cta";
  icon?: string;
  cmdLabel?: string;
  title?: string;
  subtitle?: string;
  desc?: string[];
  demo?: string;
  punchline?: string;
  color?: string;
  hookTag?: string;
  hookNote?: string;
  ctaTitle?: string;
  ctaLines?: string[];
  ctaNote?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "hook",
    hookTag: "⚡ Claude Code · settings.json",
    hookNote: "1 file thay đổi cả cuộc đời chồng\n99% người bỏ qua · power-user lock · 2026",
    color: ACCENT_SOLID,
  },
  {
    kind: "cmd",
    icon: "🪝",
    cmdLabel: "hooks.PreToolUse",
    title: "PRE-TOOL HOOK",
    subtitle: "Chạy script TỰ ĐỘNG trước mỗi tool call",
    desc: [
      "Lifecycle hook trước khi Claude exec tool",
      "Auto format, auto lint, auto check security",
      "Block tool call nếu script return non-zero",
    ],
    demo: '"hooks": {\n  "PreToolUse": [{ "matcher": "Write|Edit",\n    "command": "./scripts/lint.sh" }]\n}',
    punchline: "Như chồng kiểm vợ trang điểm chưa rồi mới cho đi chơi!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cmd",
    icon: "📟",
    cmdLabel: "statusLine",
    title: "STATUS LINE LIVE",
    subtitle: "Custom status bar — token + cost + model",
    desc: [
      "Mặc định chỉ hiện model — quá nghèo nàn",
      "Set custom script → live token usage + $cost",
      "Coi tiền real-time, không hết tháng ngất",
    ],
    demo: '"statusLine": {\n  "type": "command",\n  "command": "~/.claude/statusline.sh"\n}',
    punchline: "Coi tiền liên tục — không hết tháng vợ ngất chồng ngất!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🔓",
    cmdLabel: "permissions.allow",
    title: "ALLOWLIST LỆNH",
    subtitle: "Skip pop-up yes/no phiền chết",
    desc: [
      "Liệt kê pattern lệnh an toàn",
      "Claude tự chạy không cần xin phép",
      "npm install, git status, ls, ... auto pass",
    ],
    demo: '"permissions": {\n  "allow": ["Bash(npm:*)", "Bash(git status)",\n           "Read(*)", "Bash(ls)"]\n}',
    punchline: "Như chồng cho vợ thẻ tín dụng — dưới 500 khỏi hỏi!",
    color: ACCENT_PINK,
  },
  {
    kind: "cmd",
    icon: "🧠",
    cmdLabel: "env.ANTHROPIC_MODEL",
    title: "LOCK MODEL DEFAULT",
    subtitle: "Khỏi gõ /model mỗi session",
    desc: [
      "Set ENV → Claude mặc định mở model đó",
      "Opus mãi mãi · Haiku mãi mãi tùy taste",
      "Đỡ phải nhớ switch mỗi lần",
    ],
    demo: '"env": {\n  "ANTHROPIC_MODEL": "claude-opus-4-7",\n  "ANTHROPIC_SMALL_FAST_MODEL": "haiku-4-5"\n}',
    punchline: "Cài một lần xài cả đời — như nhẫn cưới!",
    color: ACCENT_BLUE,
  },
  {
    kind: "cmd",
    icon: "🔑",
    cmdLabel: "apiKeyHelper",
    title: "API KEY AN TOÀN",
    subtitle: "Load key từ 1Password/op — không hard-code",
    desc: [
      "Trỏ tới script load key từ password manager",
      "Không bao giờ leak key lên GitHub",
      "Rotate key dễ — sửa 1 nơi",
    ],
    demo: '"apiKeyHelper": "/usr/local/bin/get-claude-key.sh"\n# script trả về API key từ 1Password',
    punchline: "An toàn hơn cả két sắt mẹ chồng giữ vàng cưới!",
    color: GOLD,
  },
  {
    kind: "cmd",
    icon: "✍️",
    cmdLabel: "includeCoAuthoredBy",
    title: "TẮT CO-AUTHORED",
    subtitle: "Git commit không kèm \"by Claude\"",
    desc: [
      "Default: git commit có tag Co-Authored-By: Claude",
      "Sếp nhìn thấy = biết vợ xài AI",
      "Set false → credit hết về vợ pro một mình",
    ],
    demo: '"includeCoAuthoredBy": false\n// commit msg sạch — không lộ Claude',
    punchline: "Ghi credit hết về vợ — vợ pờ rồ một mình!",
    color: RED,
  },
  {
    kind: "cmd",
    icon: "📂",
    cmdLabel: "additionalDirectories",
    title: "MULTI-FOLDER ACCESS",
    subtitle: "Claude truy cập folder ngoài CWD",
    desc: [
      "Mặc định chỉ thấy thư mục gốc project",
      "Set thêm → Documents, Downloads, multi-repo",
      "Không cần mở từng cửa sổ riêng",
    ],
    demo: '"additionalDirectories": [\n  "~/Documents/shared-notes",\n  "../other-repo/src"\n]',
    punchline: "Như chồng có chìa khoá nhà bố mẹ vợ — ra vô tự nhiên!",
    color: ACCENT_CYAN,
  },
  {
    kind: "cmd",
    icon: "✂️",
    cmdLabel: "outputStyle",
    title: "CLAUDE TRẢ NGẮN GỌN",
    subtitle: "Không lan man cô giáo dạy văn",
    desc: [
      "concise = cắt filler, vào thẳng vấn đề",
      "Tiết kiệm token + thời gian đọc",
      "Reply như bạn thân chat Telegram",
    ],
    demo: '"outputStyle": "concise"\n// hoặc "default" / "verbose" / custom path',
    punchline: "Tiết kiệm token, thời gian, sức khoẻ tâm thần — 3 in 1!",
    color: ORANGE,
  },
  {
    kind: "cmd",
    icon: "🔁",
    cmdLabel: "hooks.PostToolUse / Stop",
    title: "POST-TOOL AUTO",
    subtitle: "Auto commit / deploy / notify sau session",
    desc: [
      "Stop hook chạy khi Claude end session",
      "PostToolUse chạy sau mỗi tool",
      "Auto-test, auto-push, ping Telegram khi xong",
    ],
    demo: '"hooks": {\n  "Stop": [{ "command": "./scripts/notify.sh" }],\n  "PostToolUse": [{ "matcher": "Edit", ... }]\n}',
    punchline: "Như chồng tự dọn dẹp sau khi vợ nấu — không cần nhắc!",
    color: GREEN,
  },
  {
    kind: "cmd",
    icon: "🔌",
    cmdLabel: "enableAllProjectMcpServers",
    title: "AUTO-LOAD .mcp.json",
    subtitle: "Mở project = MCP servers tự load",
    desc: [
      "Repo có file .mcp.json → auto enable",
      "Khỏi gõ /mcp enable từng cái",
      "Per-project MCP scope — sạch sẽ",
    ],
    demo: '"enableAllProjectMcpServers": true\n// .mcp.json trong repo auto-load on open',
    punchline: "Chồng tự sắp xếp quy trình — vợ chỉ nhận thành quả!",
    color: ACCENT_VIOLET,
  },
  {
    kind: "cta",
    ctaTitle: "CẤU HÌNH BÁ ĐẠO?",
    ctaLines: ["💾  Save bài này", "💬  Comment cấu hình bá đạo nhất", "🔗  Follow tip Claude daily"],
    ctaNote: "Chồng giận thật nếu vợ không follow · 2026",
    color: ACCENT_SOLID,
  },
];

const BG: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="g1" cx="20%" cy="0%" r="60%">
        <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.18" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="90%" cy="10%" r="50%">
        <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.14" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="100%" r="40%">
        <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.10" />
        <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.05" />
      </pattern>
      <radialGradient id="maskg" cx="50%" cy="50%" r="70%">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="gm"><rect width={W} height={H} fill="url(#maskg)" /></mask>
    </defs>
    <rect width={W} height={H} fill={BG_DEEP} />
    <rect width={W} height={H} fill="url(#grid)" mask="url(#gm)" />
    <rect width={W} height={H} fill="url(#g1)" />
    <rect width={W} height={H} fill="url(#g2)" />
    <rect width={W} height={H} fill="url(#g3)" />
  </svg>
);

const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 80})`}>
    <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
      ⚡ claude-code · settings.json · tip series
    </text>
  </g>
);

const HookSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 280)`}>
      <rect x={-330} y={-44} width={660} height={88} rx={44} fill={BG_SURFACE} stroke={s.color} strokeWidth={2} />
      <text x={0} y={13} fontSize={30} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
        {s.hookTag}
      </text>
    </g>
    <g transform={`translate(${W / 2}, 720)`}>
      <text x={0} y={0} fontSize={260} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-10">
        10
      </text>
      <text x={0} y={140} fontSize={106} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
        SETTINGS
      </text>
      <text x={0} y={230} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        settings.json
      </text>
    </g>
    <g transform={`translate(${W / 2}, 1200)`}>
      <text x={0} y={0} fontSize={42} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        Claude Code · cấu hình giấu kín
      </text>
      <text x={0} y={62} fontSize={34} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="1">
        99% người bỏ qua · power-user lock
      </text>
    </g>
    {s.hookNote && (
      <g transform={`translate(${W / 2}, 1490)`}>
        <rect x={-420} y={-80} width={840} height={160} rx={20} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
        {s.hookNote.split("\n").map((ln, i) => (
          <text key={i} x={0} y={-16 + i * 44} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            {ln}
          </text>
        ))}
      </g>
    )}
  </g>
);

const CmdSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    {/* Top: setting key in code pill */}
    <g transform={`translate(${W / 2}, 200)`}>
      <rect x={-460} y={-50} width={920} height={100} rx={20} fill={BG_ELEVATED} stroke={s.color} strokeWidth={3} />
      <text x={0} y={18} fontSize={(s.cmdLabel || "").length > 22 ? 30 : (s.cmdLabel || "").length > 18 ? 36 : 44} fill={s.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
        {s.cmdLabel}
      </text>
    </g>

    {/* Big icon */}
    <g transform={`translate(${W / 2}, 460)`}>
      <text x={0} y={0} fontSize={180} textAnchor="middle">{s.icon}</text>
    </g>

    {/* Title */}
    <g transform={`translate(${W / 2}, 640)`}>
      <text x={0} y={0} fontSize={(s.title || "").length > 18 ? 52 : (s.title || "").length > 14 ? 62 : 70} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        {s.title}
      </text>
    </g>

    {/* Subtitle */}
    {s.subtitle && (
      <g transform={`translate(${W / 2}, 720)`}>
        <text x={0} y={0} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">
          {s.subtitle}
        </text>
      </g>
    )}

    {/* Description bullets */}
    {s.desc && (
      <g transform={`translate(${W / 2}, 820)`}>
        {s.desc.map((line, i) => (
          <g key={i} transform={`translate(-460, ${i * 60})`}>
            <circle cx={0} cy={-8} r={6} fill={s.color} />
            <text x={26} y={0} fontSize={28} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={500}>
              {line}
            </text>
          </g>
        ))}
      </g>
    )}

    {/* Code demo */}
    {s.demo && (
      <g transform={`translate(${W / 2}, 1340)`}>
        <rect x={-490} y={-130} width={980} height={260} rx={16} fill={BG_DEEP} stroke={s.color} strokeWidth={2} />
        <circle cx={-470} cy={-104} r={6} fill="#FF5F56" />
        <circle cx={-448} cy={-104} r={6} fill="#FFBD2E" />
        <circle cx={-426} cy={-104} r={6} fill="#27C93F" />
        <text x={-406} y={-98} fontSize={18} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">settings.json</text>
        {s.demo.split("\n").map((line, i) => (
          <text key={i} x={-470} y={-44 + i * 40} fontSize={22} fill={i === 0 || line.startsWith('"') ? s.color : TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            {line}
          </text>
        ))}
      </g>
    )}

    {/* Punchline */}
    {s.punchline && (
      <g transform={`translate(${W / 2}, 1720)`}>
        <text x={0} y={0} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">
          → {s.punchline}
        </text>
      </g>
    )}
  </g>
);

const CtaSlide: React.FC<{ s: Slide }> = ({ s }) => (
  <g>
    <g transform={`translate(${W / 2}, 580)`}>
      <text x={0} y={0} fontSize={104} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(0, -1).join(" ")}
      </text>
      <text x={0} y={130} fontSize={128} fill={s.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
        {s.ctaTitle?.split(" ").slice(-1)[0]}
      </text>
    </g>
    {s.ctaLines && (
      <g transform={`translate(${W / 2}, 1080)`}>
        {s.ctaLines.map((ln, i) => (
          <g key={i} transform={`translate(0, ${i * 120})`}>
            <rect x={-440} y={-45} width={880} height={90} rx={18} fill={BG_SURFACE} stroke={BORDER} strokeWidth={2} />
            <text x={0} y={14} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
              {ln}
            </text>
          </g>
        ))}
      </g>
    )}
    {s.ctaNote && (
      <g transform={`translate(${W / 2}, 1640)`}>
        <text x={0} y={0} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>
          {s.ctaNote}
        </text>
      </g>
    )}
  </g>
);

export const SlideCarouselTop10Settings: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(frame, SLIDES.length - 1);
  const s = SLIDES[idx];
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <BG />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {s.kind === "hook" && <HookSlide s={s} />}
        {s.kind === "cmd" && <CmdSlide s={s} />}
        {s.kind === "cta" && <CtaSlide s={s} />}
        <BrandMark />
      </svg>
    </AbsoluteFill>
  );
};
