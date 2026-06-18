# Making the Demo Video — with AI voiceover + optional AI avatar

A complete demo video in ~15 minutes, all with free tools.

## ✅ What's already generated for you
- **[`index.html`](index.html)** — a polished, auto-playing animated demo of the chatbot (all
  four use cases + an edge case + human handoff), with on-screen captions. **This is your
  screen-recordable demo** — no Voiceflow build required to produce a video.
- **[`voiceover/`](voiceover/)** — AI voiceover clips (one per scene) + `full-narration.m4a`,
  matching [`voiceover-script.md`](voiceover-script.md).

## 🎬 Your steps
A final stitched `.mp4` (and a talking-head avatar clip) can't be rendered for you here, so you
assemble the pieces — it's quick.

### Step 1 — Record the animated demo
1. Open the demo: double-click `index.html` (any browser). Make the window large / full-screen.
2. Press **H** to hide the on-screen controls for a clean capture. Press **R** to replay from the top, **Space** to pause.
3. Screen-record just the browser window:
   - **macOS:** ⌘⇧5 → *Record Selected Portion*, or **QuickTime → New Screen Recording**.
   - **Free alternatives:** **OBS Studio**, or **Loom** (free tier — also gives a shareable link).
4. The demo auto-plays start-to-finish in ~2.5–3 min and ends on a recap card. Record one clean take.
   - The **speed** control (1× / 1.5×) tightens runtime; **1× pairs best** with the voiceover timing.

### Step 2 — Add the AI voiceover
Import the recording into a free editor — **iMovie** (Mac), **CapCut**, **DaVinci Resolve**, or
**Clipchamp** (Windows) — then:
- **Easiest:** drop each `voiceover/N-*.m4a` clip onto the timeline where its scene starts (use
  the on-screen "01 · …" / "02 · …" labels as cue points; order is in `voiceover-script.md`).
- **Or:** place the single `full-narration.m4a` at the start.
- The macOS "Samantha" voice is clear and free. **For a more natural AI voice,** paste the
  script into **ElevenLabs** (free tier) / Google / Microsoft TTS and use those files instead.

⚡ **Advanced (one command)** — mux the full narration onto a silent screen recording with ffmpeg:
```bash
ffmpeg -i screen-recording.mov -i voiceover/full-narration.m4a \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest demo-final.mp4
```

### Step 3 (optional) — Add an "AI video" presenter intro/outro
For an actual AI avatar / talking-head host, use a free AI-video tool — these generate the clip
from a script for you:
- **HeyGen** (free tier) · **D-ID** (free trial) · **Synthesia** (free trial) · **Canva → AI avatar** (free).
- Paste the scripts below, generate two short (~10–15s) clips, and place them at the start/end.

**Intro (~12s):**
> "Hi! Here's a quick look at a customer-support chatbot I designed for an outdoor-gear store,
> Trailhead Outfitters. It handles order tracking, returns, product recommendations, and human
> handoff — let's see it in action."

**Outro (~10s):**
> "That's the Trailhead Outfitters assistant — built in Voiceflow, with clear conversation flows
> and graceful edge-case handling. Thanks for watching!"

### Final assembly order
`[AI avatar intro] → [screen recording + voiceover] → [AI avatar outro]` → export **1080p MP4**,
keep it **under 3 minutes**.

## Don't want to assemble anything?
The **screen recording from Step 1 alone** — with its built-in captions — is already a complete,
submittable demo video. The voiceover and avatar are enhancements, not requirements.
