# Conversation Design — North Star Support Bot

Supporting design doc for the functional chatbot in [`/app`](../app). Implementation is plain JS:
data in `app/data.js`, brain (intents + dialog) in `app/bot.js`, UI in `app/index.html`.

## Persona (1)
- **Bot:** North Star Support Bot · **Store:** North Star Outfitters (outdoor apparel + camping gear).
- **Tone:** friendly, helpful, outdoorsy, concise. **Audience:** North American outdoor consumers.

## Intents & variations (3.a)
Priority-ordered keyword recognizer — `recognize()` in `app/bot.js`:

| Intent | Example phrasings |
|---|---|
| `human` | "talk to a human", "agent", "representative", "live agent" |
| `track` | "track my order", "where is my order", "where's my package", "order status", "WISMO" |
| `returns` | "return", "refund", "exchange", "return policy", "send it back" |
| `shipping` | "how long is shipping", "shipping options", "expedited", "delivery time" |
| `recommend` | "recommend", "suggest", "looking for", "what should I buy", "need a …" |
| `menu` (global) | "menu", "start over", "restart" |
| `greeting` | "hi", "hello", "help" |

Order numbers are pulled by `extractOrder()` from `#111`, "order 111", or a lone `111`.

## Provided data (3.c + 4 — `app/data.js`, "use provided data only")
- **Orders:** `111` → Shipped, arriving tomorrow · `222` → Processing, ships in 24h ·
  `333` → Delivered · **any other → invalid**.
- **Shipping:** Standard **3–5** days · Expedited **1–2** days.
- **Returns:** 30 days, unused, original packaging · link `https://northstaroutfitters.example/returns`.
- **Recommendation categories:** Apparel → {cold: *Insulated Jackets & Base Layers*, rain:
  *Rain Shells & Waterproof Gear*}; Camping → {sleeping: *Sleeping Bags & Pads*, shelter:
  *Tents & Camp Stoves*}.

## Flows (2.a + 3.b — guided, returns to main after each resolution)
Greeting shows the 4 options. After every resolution → "Anything else?" → back to main. Global
`menu`/`agent` work anywhere; user may switch topics mid-flow.

1. **Order tracking** — ask for order # (unless already given) → look up → status reply.
   `333` adds a follow-up (return / agent). Invalid → "couldn't find… looks like 111/222/333" →
   retry; **2nd invalid → offer a live agent**.
2. **Returns & exchanges** — explain the 30-day policy + provide the returns link.
3. **Product recommendations** — Q1 (apparel/camping) → Q2 (cold/rain | sleeping/shelter) →
   recommend a **category**. (**≤2 questions**.)
4. **Human handoff** — explicit request **or** repeated fallback → **"Live Agent" state**
   (simulated); "Back to the bot" returns to the main flow.

## Fallback (3.d)
Unrecognized input → "Sorry, I didn't understand that." + the 4 options. **Repeated (2×) →
escalate to a Live Agent.**

## Edge cases handled
- Order input: `#` / "order" / spaces normalized; non-numeric / 1–2-digit / 4+-digit / unknown →
  invalid; lone number at the menu → tracked; repeated invalid → live agent.
- Mid-flow topic switch (e.g., asked for an order, then "talk to a human") is honored.
- Empty/whitespace, very long input, mixed case & punctuation tolerated.
- Live Agent state holds until the user chooses to return.

## Verification
`node app/bot.test.js` → **29 checks** covering every use case, intent variation, and edge case above.
