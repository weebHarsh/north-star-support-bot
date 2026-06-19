# North Star Support Bot

A **functional** customer-support chatbot for **North Star Outfitters**, a small e-commerce store
selling outdoor apparel and camping gear. Built for the Upwork simulated project — delivered as a
**code repository with instructions** (deliverable 7.a).

## ▶️ Run it (no install, no deployment)
**Open [`app/index.html`](app/index.html) in any web browser.** That's the whole thing — plain
HTML/CSS/JS with the data inlined, so it works straight from the file (no server, no build).
Optional local server: `npx serve app` then open the printed URL.

## What it does — all 4 core use cases + fallback
- **Order tracking** — asks for an order number and returns the status
  (`111` → Shipped/arriving tomorrow · `222` → Processing/ships in 24h · `333` → Delivered ·
  any other → invalid).
- **Returns & exchanges** — explains the 30-day policy and provides the returns link.
- **Product recommendations** — asks 1–2 questions, then recommends a product category.
- **Human handoff** — on explicit request or repeated confusion, transitions to a **"Live Agent"** state.
- **Fallback** — clear "I didn't understand" + options/escalation; handles intent variations
  ("Where is my order?" vs "Track my package").

## Provided data only
All facts live in [`app/data.js`](app/data.js): orders 111/222/333, shipping (Standard 3–5 /
Expedited 1–2 days), the 30-day return policy + link, and the recommendation category map.

## Project structure
```
app/        index.html · bot.js · data.js · bot.test.js   ← the functional chatbot
docs/       conversation-design.md · flows/conversation-flow.md   ← supporting design
knowledge-base/   shipping.md · returns-and-exchanges.md   ← provided reference
demo/       North-Star-demo.mp4   ← 2–3 min demo video
SUBMISSION.md     ← organized submission: Scenario 1–5, screenshots, coverage checklist
```

## Test it
```bash
node app/bot.test.js
```
Runs 29 checks across every use case, intent variation, and edge case (invalid orders,
repeated-fallback escalation, mid-flow topic switching, etc.).

## Demo video
[`demo/North-Star-demo.mp4`](demo/North-Star-demo.mp4) — a ~2–3 minute walkthrough of all four
core use cases plus a fallback scenario. See [`SUBMISSION.md`](SUBMISSION.md) for the labeled
scenario breakdown and a full requirements-coverage checklist.
