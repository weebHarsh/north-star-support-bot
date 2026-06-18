# Trailhead Outfitters — Customer Support Chatbot (Voiceflow)

A complete, ready-to-assemble customer-support chatbot for **Trailhead Outfitters**, a small
e-commerce store selling outdoor apparel and camping gear. Built as a **Voiceflow** conversation
design with all supporting content and mock data included.

This package is everything needed to produce the two project deliverables:
1. **A working chatbot** — assemble it in Voiceflow from this spec and export the `.vf` file.
2. **A 2–3 minute demo video** — follow the ready-made script.

> **Why a spec package and not a `.vf`?** Voiceflow is a visual GUI tool with no reliable way to
> hand-author an importable project file. So this repo gives you directly-uploadable content
> (Knowledge Base docs, mock data, the JavaScript lookup) **plus** a click-by-click build guide,
> exact message copy, diagrams, and a QA matrix — so assembling it in Voiceflow is fast and the
> result is consistent and tested.

## Cost: $0
Everything fits Voiceflow's **free "Sandbox" plan** (canvas, intents/entities, JavaScript step,
Knowledge Base, and the prototype runner for recording). Mock data is self-contained (no API, no
hosting). See cost details in the plan; building is free, and you only spend free monthly credits
when you *run* the prototype — batch your testing.

## The four core use cases
- 📦 **Order tracking** — by order number, with status-specific replies, split-shipment/delay
  handling, and input normalization.
- ↩️ **Returns & exchanges** — automatic 30-day eligibility, item picker, exchange flow,
  confirm-before-RMA.
- 🧭 **Product recommendations** — guided by category → use-case → budget, from the real catalog.
- 🙋 **Human handoff** — context-aware escalation with in-hours vs. ticket logic.
Plus a **Knowledge Base FAQ** (shipping, sizing, warranty, payment) answered by a grounded LLM.

## Quick start
1. Read [`docs/01-business-context.md`](docs/01-business-context.md) (brand, persona, policies).
2. Open [`docs/03-voiceflow-build-guide.md`](docs/03-voiceflow-build-guide.md) and build the
   agent step-by-step (~2–4 hrs). It uses the copy in
   [`docs/02-conversation-design.md`](docs/02-conversation-design.md).
3. Upload `knowledge-base/*.md` to the Voiceflow Knowledge Base; paste `mock-data/orders-lookup.js`
   into the JavaScript step.
4. Test against [`docs/05-edge-cases-and-qa.md`](docs/05-edge-cases-and-qa.md).
5. **Export** the `.vf` and **record** the demo with [`docs/04-demo-script.md`](docs/04-demo-script.md).

## Demo video — record it today (no Voiceflow build needed)
An animated, auto-playing demo of the assistant lives in [`demo/index.html`](demo/index.html) —
open it in any browser and screen-record it for an instant 2–3 min demo video, complete with
on-screen captions. AI voiceover clips are in [`demo/voiceover/`](demo/voiceover/), and
[`demo/AI-VIDEO-GUIDE.md`](demo/AI-VIDEO-GUIDE.md) walks through recording, syncing the
voiceover, and optionally adding an AI presenter intro/outro.

## Repository structure
| Path | What it is |
|---|---|
| [`docs/01-business-context.md`](docs/01-business-context.md) | Brand, policies, persona "Sage", tone & voice |
| [`docs/02-conversation-design.md`](docs/02-conversation-design.md) | Intents, entities, variables, every flow step + exact copy + guardrails |
| [`docs/03-voiceflow-build-guide.md`](docs/03-voiceflow-build-guide.md) | Click-by-click Voiceflow build & export |
| [`docs/04-demo-script.md`](docs/04-demo-script.md) | 2–3 min video script with exact inputs |
| [`docs/05-edge-cases-and-qa.md`](docs/05-edge-cases-and-qa.md) | Edge-case reference, QA matrix, fallback copy, metrics |
| [`docs/06-sample-transcripts.md`](docs/06-sample-transcripts.md) | Full sample dialogues per flow (incl. edge paths) |
| [`docs/flows/`](docs/flows/) | Mermaid flow diagrams (one per flow) |
| [`knowledge-base/`](knowledge-base/) | 5 FAQ/policy docs — upload to the Voiceflow Knowledge Base |
| [`mock-data/products.json`](mock-data/products.json) | 16-product catalog (apparel + gear) |
| [`mock-data/orders.json`](mock-data/orders.json) | 7 sample orders covering every status/edge case |
| [`mock-data/orders-lookup.js`](mock-data/orders-lookup.js) | Voiceflow JS step: lookup, eligibility, business hours (+ self-test) |
| [`demo/index.html`](demo/index.html) | Animated, auto-playing demo of the bot — open & screen-record |
| [`demo/voiceover/`](demo/voiceover/) | AI voiceover clips (per scene) + full narration track |
| [`demo/voiceover-script.md`](demo/voiceover-script.md) | Timed narration script + sync cues |
| [`demo/AI-VIDEO-GUIDE.md`](demo/AI-VIDEO-GUIDE.md) | How to record, add voiceover, add an AI presenter, and export |

## What makes this a strong submission
- **Real conversation design**, not just a happy path: retry caps, no-match ladder, timeout
  re-engagement, variable hygiene, and conversation repair.
- **No dead-ends** — every ineligible / not-found / out-of-stock branch offers a next step.
- **Trust & safety** — light PII verification, a grounded KB prompt that won't invent
  policies/prices, off-topic & prompt-injection refusal, and abuse → handoff.
- **Verified data layer** — the lookup/eligibility logic ships with a passing test suite.
- **Polished extras** — proactive next-best-action, personalization, confirm-before-action,
  context-passing handoff, CSAT capture, and an analytics plan.

## Verify the data layer (optional, ~5 seconds)
```bash
cd mock-data
node orders-lookup.js     # runs the self-test; prints a per-order summary
```
You should see **"✅ ALL CHECKS PASSED"** and a one-line status for each of the 7 orders.

## Sample data for testing/demo
| Order | Use it to show |
|---|---|
| `TO-10002` | Shipped + split-shipment delay |
| `TO-10004` | Returnable (within 30 days), multi-item → exchange |
| `TO-10007` | Final-sale item → return refused gracefully |
| `TO-10005` | Outside 30-day window → warranty path |
| `TO-99999` | Unknown order → no fabricated data |

## Out of scope
Live deployment/hosting; a hand-authored `.vf` import; real carrier/payment APIs (the
self-contained mock is built to swap for a real `fetch()` later); multi-language support.
