# Submission — North Star Support Bot

**Deliverable:** a functional customer-support chatbot for **North Star Outfitters** (outdoor
apparel + camping gear), built per the project brief, with a demo video.

## Links & files
- **Code repository:** https://github.com/weebHarsh/north-star-support-bot
- **Working chatbot:** [`app/index.html`](app/index.html) — open in any browser (no install/deploy).
- **Demo video (2–3 min):** [`demo/North-Star-demo.mp4`](demo/North-Star-demo.mp4) (~1:53).
- **Scenario screenshots:** [`submission-images/`](submission-images/) (Image 1–6 below).

## How to run (no deployment)
Open `app/index.html` in a browser — that's it (pure HTML/CSS/JS, data inlined). Optional:
`npx serve app`. Run the test suite with `node app/bot.test.js` (29 checks).

---

## Demo scenarios (video walkthrough)

| Scenario | Use case | Video time | Screenshot |
|---|---|---|---|
| **Scenario 1** | Order tracking (invalid order + #111 #222 #333) | 0:03 | Image 1 |
| **Scenario 2** | Returns & exchanges (policy + link) | 0:37 | Image 2 |
| **Scenario 3** | Product recommendations (1–2 Qs → category) | 0:50 | Image 3 |
| **Scenario 4** | Human handoff (→ Live Agent) | 1:36 | Image 6 |
| **Scenario 5** | Fallback ("I didn't understand" + options) | 1:24 | Image 5 |
| *Bonus* | Shipping FAQ (3–5 / 1–2 days) | 1:13 | Image 4 |

### Scenario detail — inputs → expected responses
- **Scenario 1 — Order tracking.** "where's my order?" → asks for number → `555` → *"couldn't
  find… looks like 111, 222, or 333"* → `111` → *Shipped, arriving tomorrow* → `222` →
  *Processing, ships in 24h* → `333` → *Delivered* + follow-up (return / live agent).
- **Scenario 2 — Returns & exchanges.** "I'd like to return a jacket" → *30-day, unused, original
  packaging* + returns link `https://northstaroutfitters.example/returns`.
- **Scenario 3 — Product recommendations.** "recommend some gear" → "Camping gear" → "Shelter &
  cooking" → recommends the **Tents & Camp Stoves** category.
- **Scenario 4 — Human handoff.** "talk to a human" → transitions to the **Live Agent** state;
  "Back to the bot" returns to the main flow.
- **Scenario 5 — Fallback.** "asdfghjkl ????" → *"Sorry, I didn't understand that"* + the four
  options (escalates to a live agent on repeated misunderstanding).
- **Bonus — Shipping.** "how long does shipping take?" → *Standard 3–5 / Expedited 1–2 business days*.

### Images
- **Image 1** — `submission-images/scenario-1-order-tracking.png`
- **Image 2** — `submission-images/scenario-2-returns.png`
- **Image 3** — `submission-images/scenario-3-recommendations.png`
- **Image 4** — `submission-images/scenario-4-shipping.png`
- **Image 5** — `submission-images/scenario-5-fallback.png`
- **Image 6** — `submission-images/scenario-6-human-handoff.png`

---

## Requirements coverage checklist
| Brief item | Status | Where |
|---|---|---|
| 1a Name — North Star Support Bot | ✅ | UI header, `app/data.js` |
| 1b Tone (friendly/outdoorsy/concise) · 1c Audience | ✅ | bot copy in `app/bot.js` |
| 2.a.i Order tracking — ask #, simulated status | ✅ | Scenario 1 · `app/bot.js` |
| 2.a.ii Returns & exchanges — policy + returns link | ✅ | Scenario 2 |
| 2.a.iii Recommendations — 1–2 Qs → category | ✅ | Scenario 3 |
| 2.a.iv Human handoff — fallback/explicit → Live Agent | ✅ | Scenarios 4–5 |
| 3.a Intent recognition (variations) | ✅ | `recognize()`; "where is my order" vs "track my package" |
| 3.b Conversation flow — guided, returns to main | ✅ | dialog manager; "Anything else?" loop |
| 3.c Mock data — 111/222/333 + invalid | ✅ | `app/data.js`; Scenario 1 |
| 3.d Fallback — "I didn't understand" + options/escalation | ✅ | Scenario 5 |
| 4.a Return policy — 30-day, unused, original packaging | ✅ | `app/data.js`, KB |
| 4.b Shipping — Standard 3–5 / Expedited 1–2 | ✅ | Bonus scenario, KB |
| 5 Constraints — no deploy, provided data only, testable | ✅ | opens via file; data inlined; `bot.test.js` |
| 7.a Implementation — code repo with instructions | ✅ | this repo + README |
| 7.b Video — 2–3 min, all 4 use cases + fallback | ✅ | `demo/North-Star-demo.mp4` |
| 7.c Submission — organized, labeled (Scenario/Image) | ✅ | this document |

## Notes
- **Use provided data only:** every fact (orders, shipping, returns, categories) lives in
  `app/data.js`. Order statuses, the 30-day policy, and shipping windows match the brief exactly.
- **No deployment required:** the bot is a static page; mock data is in JavaScript (no backend).
- Supporting conversation-design docs are in [`docs/`](docs/).
