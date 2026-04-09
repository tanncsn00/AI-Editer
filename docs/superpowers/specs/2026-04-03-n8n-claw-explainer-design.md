# n8n-claw 60-Second Explainer Video — Design Spec

## Overview

A 60-second animated explainer video for **n8n-claw**, a self-hosted AI agent positioned as "your AI employee" for small business owners. The video follows a "Day in the Life" narrative structure, grounding each feature in a relatable business moment.

**CTA:** griffingroup.vn

## Audience

Small business owners — non-technical, value-driven. No jargon. Focus on what the agent does for them, not how it works under the hood.

## Visual Style

- **Palette:** Dark navy (#1a1a2e) backgrounds, white (#ffffff) text, accent blue (#4361ee) for highlights and interactive elements, soft linear gradients
- **Typography:** Sans-serif (Inter), large headlines (60-80px), minimal body text (32-40px)
- **Motion:** Spring physics animations, smooth fade-ins, subtle parallax on background elements. No flashy or jarring transitions.
- **Illustrations:** Abstract UI elements — floating notification cards, task lists, chat bubbles, server icons. Not literal screenshots.
- **Camera:** Ken Burns drift on background layers for depth
- **Particles:** Subtle floating orbs or soft light rays — minimal, not distracting

## Audio

- **Voice:** Professional, warm, measured pace (~140 wpm). Male or female — provider default (ElevenLabs or OpenAI TTS).
- **Music:** Soft ambient corporate track. Builds subtly toward the CTA beat. Ducked under narration (-18dB).
- **No SFX** unless a natural notification chime fits (beat 2 morning briefing).

## Output

- **Resolution:** 1920x1080 (16:9)
- **Duration:** 60 seconds
- **FPS:** 30
- **Format:** MP4 (H.264)

## Pipeline

Animated Explainer pipeline (`pipeline_defs/animated-explainer.yaml`). Remotion Explainer composition with TextCard, HeroTitle, CalloutBox, SectionTitle, CaptionOverlay components.

## Script

~140 words total. Professional tone — confident, warm, no hype.

### Beat 1 — Hook (0:00–0:08)

**Visual:** Screen fills with floating notifications, email icons, calendar alerts, task items — visual chaos that fades to overwhelm. Then a clean wipe to dark navy.

**Narration:** "Running a business means juggling a hundred things at once. What if you didn't have to?"

### Beat 2 — Morning Briefing (0:08–0:18)

**Visual:** A clean notification card slides in — "Good morning. Here's your day." Below it, a summary list animates in: 3 tasks due, 2 new emails, 1 reminder. Subtle phone outline framing.

**Narration:** "Meet your AI employee. Every morning, it starts your day with a briefing — tasks, emails, and what needs your attention."

### Beat 3 — Task Management (0:18–0:28)

**Visual:** Animated task list — items check off, new ones appear, a reminder pops up. Clean card UI with progress indicators.

**Narration:** "It manages your tasks. Sends reminders. Follows up so nothing falls through the cracks."

### Beat 4 — Smart Monitoring (0:28–0:38)

**Visual:** Split scene — left side shows a search query with results appearing, right side shows a monitoring alert card ("Price changed — notifying you"). Smooth transition between the two.

**Narration:** "It searches the web for you. Monitors what matters. And only alerts you when something changes."

### Beat 5 — Trust & Privacy (0:38–0:48)

**Visual:** Centered server icon with a shield/lock overlay. Subtle glow pulse. Text card: "Your server. Your data." Floating data particles drift inward toward the server (data stays with you).

**Narration:** "It runs entirely on your server. Your data never leaves your hands. No third parties. No compromises."

### Beat 6 — CTA (0:48–1:00)

**Visual:** Clean fade to center. n8n-claw logo animates in (spring). Tagline appears below: "Your AI employee." URL fades in at bottom: griffingroup.vn. Hold for 4 seconds.

**Narration:** "n8n-claw. Your AI employee. Learn more at griffin group dot v-n."

## Remotion Scene Plan

Each beat maps to a Remotion scene sequence:

| Scene | Duration (frames @30fps) | Components |
|-------|--------------------------|------------|
| 1 — Hook | 0–240 (8s) | AnimatedBackground, ParticleOverlay (chaos → calm), TextCard |
| 2 — Morning | 240–540 (10s) | CalloutBox (briefing card), TextCard (summary list), CaptionOverlay |
| 3 — Tasks | 540–840 (10s) | TextCard (task list), ProgressBar, CaptionOverlay |
| 4 — Monitor | 840–1140 (10s) | ComparisonCard (search vs monitor), CalloutBox (alert), CaptionOverlay |
| 5 — Trust | 1140–1440 (10s) | SectionTitle, TextCard (your server your data), ParticleOverlay (inward drift) |
| 6 — CTA | 1440–1800 (12s) | HeroTitle (logo + tagline), TextCard (URL), CaptionOverlay |

## Captions

Word-by-word animated captions (CaptionOverlay / WordCaption) throughout. White text, slight drop shadow for readability on dark backgrounds. Positioned lower-third.

## Budget Estimate

| Asset | Provider | Est. Cost |
|-------|----------|-----------|
| Voiceover | OpenAI TTS or ElevenLabs | $0.05–$0.30 |
| Background music | Pixabay (free) or ElevenLabs Music | $0.00–$0.50 |
| Images (icons/illustrations) | FLUX via fal.ai | $0.15–$0.50 |
| Remotion render | Local | $0.00 |
| **Total** | | **$0.20–$1.30** |

## Success Criteria

1. Video is exactly 60 seconds (within 1s tolerance)
2. All narration is audible and properly ducked against music
3. Captions are synced to narration (word-level)
4. Visual transitions are smooth — no jarring cuts
5. CTA (griffingroup.vn) is clearly visible for at least 4 seconds
6. No technical jargon in narration or on-screen text
