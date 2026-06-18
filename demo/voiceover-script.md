# Demo Voiceover — Script & Timing

Per-scene AI narration for the demo video. The audio clips live in [`voiceover/`](voiceover/)
(generated locally with the macOS **"Samantha"** voice). The demo (`index.html`) already shows
these lines as **on-screen captions**, so the video reads clearly with *or* without audio.

> **Want a more natural voice?** Paste the lines below into **ElevenLabs** (free tier) or any TTS
> and drop the new files in over these. The script is voice-agnostic.

| # | On-screen cue | Clip | ~Dur | Narration |
|---|---|---|---|---|
| 0 | Title card → Welcome | `0-intro.m4a` | 11s | "This is the customer-support assistant I built in Voiceflow for Trailhead Outfitters, a small outdoor-gear store. It handles order tracking, returns, recommendations, and human handoff." |
| 1 | **01 · Order tracking** | `1-tracking.m4a` | 9s | "First, order tracking. Notice that it accepts a lowercased, messy order number, returns the live status, and even flags a delayed second parcel." |
| 2 | **02 · Recommendations** | `2-recommendations.m4a` | 9s | "Next, product recommendations. The bot narrows things down by category, trip type, and budget, then suggests real items from the catalog." |
| 3 | **03 · Returns & exchanges** | `3-returns.m4a` | 8s | "Now a return. It checks the 30-day window automatically, lets the customer pick which item, and confirms before it creates anything." |
| 4 | **04 · Edge case** | `4-edgecase.m4a` | 10s | "Here's the important part. When something can't be returned, like this final-sale item, the bot explains why and offers the warranty path — instead of hitting a dead end." |
| 5 | **05 · Human handoff** | `5-handoff.m4a` | 9s | "And at any point, it hands off to a human — collecting contact details and passing along full context, so the customer never has to repeat themselves." |
| 6 | End card | `6-outro.m4a` | 9s | "Order tracking, recommendations, returns with edge-case handling, and a clean human handoff — all built in Voiceflow. Thanks for watching." |

**Total narration ≈ 65s** across a ~2.5–3 min demo, so let it breathe — drop each clip at the
moment its scene chip ("01 · …", "02 · …") appears on screen; the labels are your sync cues.
`full-narration.m4a` is the same script as one continuous ~70s track if you prefer a single file.

See [`AI-VIDEO-GUIDE.md`](AI-VIDEO-GUIDE.md) for how to record, sync, and (optionally) add an AI
presenter intro/outro.
