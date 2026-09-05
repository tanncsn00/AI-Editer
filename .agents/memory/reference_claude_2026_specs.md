---
name: reference-claude-2026-specs
description: "Current Claude model specs 2026 — context window, pricing, model lineup. Update khi có release mới."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 780a4d41-622e-45e3-9904-fbbb632f4a4e
---

Snapshot tại 2026-05-18 — Verify before quoting in scripts/videos:

**Context window:**
- **Claude Opus 4.7 / Sonnet 4.6 / Haiku 4.5: 1M tokens default** (NOT 200k)
- Attention degradation observable sau ~300k tokens (lost-in-the-middle)
- Cost scales linearly với context length

**Model lineup (2026):**
- **Opus 4.7** — heavy reasoning, slowest, most expensive
- **Sonnet 4.6** — balanced default
- **Haiku 4.5** — fast/cheap (~5x cheaper than Opus)

**Pricing approx (Anthropic API, 2026):**
- Opus 4.x: ~$15/M input, ~$75/M output
- Sonnet 4.x: ~$3/M input, ~$15/M output
- Haiku 4.x: ~$1/M input, ~$5/M output
- Prompt caching: ~10% cost cho cached tokens

**Knowledge cutoff:**
- Most recent: knowledge cutoff ~January 2026

**Features 2026:**
- Computer Use (general availability)
- Plugins/skill system formalized
- Multi-MCP per project (.mcp.json)
- Plan Mode, Output Style, hooks (PreToolUse/PostToolUse/Stop)

**How to apply:**
- Khi viết script video/blog về Claude, dùng số liệu trên — KHÔNG quote 200k context outdated
- Khi user hỏi "model nào dùng cho task X" — recommend theo cost/perf curve trên
- Verify bằng web/anthropic.com nếu cần latest (model có thể release mới)
- Related: [[feedback_tts_tech_phonetic]]
