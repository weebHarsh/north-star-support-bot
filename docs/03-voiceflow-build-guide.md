# 03 — Voiceflow Build Guide (click-by-click)

This turns [`02-conversation-design.md`](02-conversation-design.md) into a working Voiceflow
agent. Voiceflow occasionally renames UI elements — where a name might differ, the closest
current label is given with "(or similar)". Total build time: roughly **2–4 hours**.

> **Conserve free credits:** building costs nothing. Credits are only spent when you *run* the
> agent in the prototype. Build everything first, then test in focused passes (see the QA matrix
> in [`05-edge-cases-and-qa.md`](05-edge-cases-and-qa.md)).

---

## Step 0 — Create the agent
1. Sign in at **voiceflow.com** (free "Sandbox" plan is fine).
2. **Create new Agent** → type **Chat** → name it **"Trailhead Outfitters Support"**.
3. You'll land on the **Canvas**. The left rail has the **CMS** (Intents, Entities, Knowledge
   Base, Variables) and your **Flows**.

## Step 1 — Create variables
Open **CMS → Variables** (or the Variables panel) and add every variable from
[§3 of the design doc](02-conversation-design.md#3-variables). Quick list to paste/create:

```
user_name, nomatch_count, within_hours,
order_number, email, normalized_order_number, valid_format, found, email_match,
customer_name, order_status, carrier, tracking, eta, order_items, item_count,
order_date, delivered_date, days_since_delivery, final_sale, tracking_note,
refund_status, shipping_city_state,
return_eligible, ineligible_reason, return_type, return_item, return_reason,
desired_size, desired_color, rma_number,
rec_category, rec_usecase, rec_budget,
handoff_reason, ticket_number
```
Set `nomatch_count` default to `0`.

## Step 2 — Create entities
**CMS → Entities** → add `product_category`, `use_case`, `size`, `color` as **custom** entities
with the values/synonyms from [§2](02-conversation-design.md#2-entities). `budget` = built-in
**number**. You do **not** need an `order_number` entity — capture it as text and validate in
JavaScript (more robust to messy input).

## Step 3 — Create intents + utterances
**CMS → Intents** → create `track_order`, `start_return`, `product_recommendation`,
`talk_to_human`, `faq_general`, `main_menu`. Paste the 8–12 utterances each from
[§1](02-conversation-design.md#1-intents--training-utterances). Mark `talk_to_human` and
`main_menu` for **global** listening (see Step 11).

## Step 4 — Upload the Knowledge Base + guardrail prompt
1. **CMS → Knowledge Base → Add data source → Upload** the 5 files from `knowledge-base/`:
   `shipping.md`, `returns-and-exchanges.md`, `sizing-guide.md`, `warranty-and-care.md`,
   `store-info.md`. (Free plan allows ~50 sources — plenty.)
2. Open **Knowledge Base → Settings**. Set the **system prompt / persona** to the guardrail
   prompt in [§10.3](02-conversation-design.md#10--faq--knowledge-base-flow):
   warm, concise, **answer only from the KB**, never invent, decline off-topic, offer human when
   unsure.
3. (Free tier uses a basic model — fine for this. Don't switch to a premium model unless you
   want to spend on it.)

## Step 5 — Build the Root / Welcome flow
On the **Home** flow (the start block):
1. **Set** step → reset variables per [§4.1](02-conversation-design.md#41-session-start--variable-hygiene)
   (`nomatch_count = 0`; clear `order_number`, `email`, `return_*`, `rec_*`).
2. **JavaScript** step → `within_hours = computeWithinHours(null);` (paste the helper — see Step 6).
3. **Message** steps → the two welcome lines.
4. **Buttons** step → the 5 menu buttons, each wired to its flow ([§5](02-conversation-design.md#5--root--welcome-flow)).
5. Add a **"Listen for intents"** path so typed input routes to the matching flow; fallback → KB.

## Step 6 — Build Order Tracking (with the JavaScript step)
Follow [§6](02-conversation-design.md#6-flow-1--order-tracking). The key piece is the **lookup**:

1. **Message:** ask for the order number → **Capture** into `order_number`.
2. Add a **JavaScript** step (the "Code"/"JS" step under Logic/Developer). Open
   `mock-data/orders-lookup.js`, **copy the whole file**, paste it into the step, then **append
   the VOICEFLOW GLUE** lines from the bottom of that file (they map the result onto your
   variables). The embedded `ORDERS` table means no API or hosting is needed.
   - The Node self-test block in the file is **inert in Voiceflow** (it checks for `require`),
     so it's safe to leave in.
3. **Condition** step branching on `valid_format`, then `found`, then `order_status` exactly as
   [§6.1–6.3](02-conversation-design.md#61-optional-email-verification-privacy). Use **Message**
   steps with variable interpolation like `{order_status}`, `{eta}`, `{tracking}`,
   `{order_items}`, `{tracking_note}`.
4. End with the **"Anything else?"** Buttons loop back to Home.

> **Demo tip:** to force business hours on for a clean handoff demo, set `within_hours = true`
> in a Set step (or in the glue) while recording.

## Step 7 — Build Returns & Exchanges
Follow [§7](02-conversation-design.md#7--flow-2--returns--exchanges). Reuse the same JS lookup
(either jump to a shared **Component** that runs it, or copy the JS step). Branch on
`ineligible_reason` (`not_delivered`, `cancelled`, `final_sale`, `outside_window`) and on
`return_eligible`. Build the **item picker** (show only if `item_count > 1`), the
**type/reason** Buttons, the **exchange size/color** capture with a stock check, the
**confirmation** Buttons, and only then a **Set/JS** step to generate `rma_number`. Wire
**damaged / wrong item** reasons straight to Handoff.

## Step 8 — Build Product Recommendations
Follow [§8](02-conversation-design.md#8--flow-3--product-recommendations). Three **Buttons**
steps capture `rec_category` → `rec_usecase` → `rec_budget`. Then a **Condition** tree
implements the [mapping table (§8.1)](02-conversation-design.md#81-recommendation-mapping-curated-from-the-catalog),
each branch ending in a **Message** with 2–3 picks (name, price, one-line reason, link) + the
follow-up Buttons. Add the **budget-too-low**, **out-of-stock**, and **unsupported-category**
branches ([§8.2](02-conversation-design.md#82-recommendation-edge-cases)) so there are no
dead-ends. *(Optional: a Response AI step to phrase the "why this fits" line — grounded only in
the catalog.)*

## Step 9 — Build Human Handoff
Follow [§9](02-conversation-design.md#9--flow-4--human-handoff). Acknowledge → set
`handoff_reason` → **Capture** `user_name` → **Capture + validate** `email` (use the
`isValidEmail` helper or Voiceflow's email entity) → **Condition** on `within_hours` for the
in-hours vs. ticket message → set a mock `ticket_number` → **context summary** → close.
For a real deployment you'd connect a **live-agent / handoff integration** here; for the demo the
simulated ticket message is enough.

## Step 10 — Build the FAQ / Knowledge Base flow
Follow [§10](02-conversation-design.md#10--faq--knowledge-base-flow). **Message** → **Capture**
question → **Knowledge Base** (Response AI) step → **Condition** on whether it answered →
"Did that help?" Buttons, with low-confidence → Handoff.

## Step 11 — Global handlers
1. **Global intents:** in each global intent (`talk_to_human`, `main_menu`), enable "available
   globally" (or add them as **Triggers** on the agent) so they fire from any step.
2. **No-match ladder:** in **Agent settings → No match** (or per-capture **No match** paths),
   implement the 3-step ladder using `nomatch_count`
   ([§4.2](02-conversation-design.md#42-no-match-ladder-dont-trap-the-user)). Increment with a
   Set step; reset to 0 on success.
3. **No-reply:** set a **No Reply** timeout (~30–45s) on key capture steps with the re-engage
   message ([§4.4](02-conversation-design.md#44-no-reply--timeout)).
4. **Capture retry cap:** give each Capture a **reprompt count of 2**, then route to menu/human.

## Step 12 — Test in the prototype
Click **Run / Test** (top right). Work through the **QA matrix** in
[`05-edge-cases-and-qa.md`](05-edge-cases-and-qa.md) — every happy path and edge case has exact
inputs and expected responses. Use the sample order numbers:
`TO-10002` (shipped), `TO-10004` (returnable), `TO-10005` (outside window), `TO-10007`
(final sale), `TO-99999` (not found). Fix any wiring before recording.

## Step 13 — Export the deliverable
1. **Project menu (top-left, the agent name) → Export → Agent file (.vf)** (or "Export project").
2. Save the `.vf` next to this repo as **`Trailhead-Outfitters-Support.vf`** — that's your
   "working chatbot export" deliverable.
3. (Optional) Also **Publish** to get a shareable web demo link.

## Troubleshooting
- **JS step throws:** make sure all variables it assigns exist (Step 1) and that you pasted the
  glue lines. Voiceflow's JS sandbox supports ES5/ES6 used here (`var`, arrow funcs, regex).
- **Variables show blank:** the Condition ran before the JS step — check step order.
- **KB answers off-topic:** tighten the KB system prompt (Step 4.2).
- **Credits running low:** test in fewer, deliberate runs; the pool resets monthly.
