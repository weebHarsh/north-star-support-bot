# 04 — Demo Video Script (2–3 minutes)

A tight, recordable walkthrough hitting all four core use cases **plus** an edge case and the
human handoff. Target length **~2:45**. Each scene gives the **exact input to type** and the
**gist of the expected reply** so you can rehearse and verify against
[`05-edge-cases-and-qa.md`](05-edge-cases-and-qa.md).

---

## Before you hit record
- In Voiceflow, open **Run / Test** (the prototype) and make the panel large; record just that
  area or full screen.
- **Force business hours on** for a clean handoff: set `within_hours = true` (Set step or in the
  JS glue) so the demo shows the live-connect path.
- Have these order numbers handy: **TO-10002** (shipped), **TO-10004** (returnable),
  **TO-10007** (final sale), and **TO-10005** (outside window, backup).
- Do **one dry run** first (also confirms credits are fine), then record in a single take.
- Optional: a 1-line intro slide — "Trailhead Outfitters — Customer Support Chatbot (Voiceflow)."

---

## Scene 1 — Intro & welcome  ⏱ 0:00–0:15
**Narration:** "This is the support assistant I built in Voiceflow for *Trailhead Outfitters*, a
small outdoor-gear store. It handles order tracking, returns, recommendations, and human
handoff. Here's the welcome."
**On screen:** start the chat → Sage's greeting + the 5-button menu appears.

## Scene 2 — Order tracking  ⏱ 0:15–0:45
**Narration:** "First, order tracking."
- **Type:** `Track my order` (or tap 📦 Track my order)
- **Bot:** asks for the order number.
- **Type:** `to-10002`  ← *(lowercase on purpose — show normalization)*
- **Bot:** "📦 Order **TO-10002** is on its way! Carrier **UPS**, tracking 1Z999AA10123456784,
  est. delivery **Jun 19**." + the **split-shipment / delayed-parcel** note.
**Narration:** "Notice it accepted a lowercased number and even flagged a delayed second parcel."

## Scene 3 — Product recommendation  ⏱ 0:45–1:25
**Narration:** "Next, recommendations — fully button-guided."
- **Type/tap:** `Product recommendations`
- **Tap:** `Camping gear ⛺` → `Backpacking` → `$100–$250`
- **Bot:** recommends **Nimbus 20°F Sleeping Bag $179** and **Vantage 55L Backpack $199** with a
  one-line reason each + links.
**Narration:** "It narrows by category, use-case, and budget, then suggests real items from the
catalog — no dead-ends."

## Scene 4 — Returns & exchange (happy path)  ⏱ 1:25–2:00
**Narration:** "Now a return — this one's an exchange."
- **Type/tap:** `Returns & exchanges` → **Type:** `TO-10004`
- **Bot:** confirms it's eligible (delivered 11 days ago); since it has 2 items, shows an **item
  picker**.
- **Tap:** `Aurora Down Jacket` → `Exchange` → reason `Doesn't fit` → size `M`
- **Bot:** **confirmation** step → tap `Yes, set it up` → returns **RMA number** + "free prepaid
  label emailed," exchange ships on scan.
**Narration:** "It checks the 30-day window, lets me pick the item, and confirms before creating
anything."

## Scene 5 — Edge case: ineligible return → graceful  ⏱ 2:00–2:25
**Narration:** "Here's how it handles an item that *can't* be returned."
- **Type/tap:** `Returns & exchanges` → **Type:** `TO-10007`
- **Bot:** "I'm sorry — the **Ridge Sun Hoodie** was a **final-sale item**, so it can't be
  returned. If it's **defective**, our warranty covers that — want me to connect you?"
**Narration:** "No dead-end — it explains *why* and offers the warranty/handoff path."
*(Backup edge case if you prefer: `TO-10005` → 'delivered 53 days ago, past the 30-day window…
warranty still covers defects.')*

## Scene 6 — Human handoff  ⏱ 2:25–2:50
**Narration:** "And any time, you can reach a person."
- **Tap:** `It's defective` (from Scene 5) — or **Type:** `talk to a human`
- **Bot:** asks name → **Type:** `Jordan` → asks email → **Type:** `jordan@example.com`
- **Bot:** "Connecting you now…" + a **ticket number** + a **context summary** of the issue and
  order to pass to the agent.
**Narration:** "It collects contact info, validates the email, and hands off with full context —
so the customer never repeats themselves."

## Scene 7 — Close  ⏱ 2:50–2:55
**Narration:** "Order tracking, recommendations, returns with edge-case handling, and a clean
human handoff — all in Voiceflow. Thanks for watching."

---

## Quick recording tips
- **Free screen recorders:** macOS **⌘⇧5** or QuickTime (File → New Screen Recording); **OBS**;
  or **Loom** free tier (also hosts the link).
- Record at **1080p**; keep the chat panel centered and large enough to read.
- Speak slowly; pause ~1s after each bot reply so viewers can read.
- If you fumble a step, just restart the chat — retakes are cheap (mind monthly credits).
- Keep it **under 3 minutes**; trim Scene 3 or 5 first if you run long.

## Coverage check (what the video proves)
✅ Order tracking · ✅ Product recommendations · ✅ Returns/exchanges · ✅ Human handoff ·
✅ Edge-case handling (final-sale/ineligible) · ✅ Input normalization · ✅ Context passed on handoff.
