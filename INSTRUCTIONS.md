# Setup & Run Instructions — North Star Support Bot

## What you need

| Requirement | Details |
|---|---|
| Web browser | Chrome, Firefox, Safari, or Edge (any modern version) |
| Node.js *(optional)* | v14+ — only needed to run the test suite or the local server |

No installation, no build step, no internet connection required.

---

## Option A — Open directly in a browser (simplest)

1. Download or clone the repository:
   ```
   git clone https://github.com/weebHarsh/north-star-support-bot.git
   ```
   Or unzip `North-Star-Support-Bot.zip` if you received the archive.

2. Open the `app/` folder.

3. Double-click **`index.html`** — it opens in your default browser.

4. The chatbot loads immediately. Type a message or click one of the four quick-reply buttons to start.

> The data is inlined in JavaScript (no backend, no API calls), so the `file://` path works without any server.

---

## Option B — Run via a local server (optional)

If you prefer to serve it over `http://`:

```bash
# Using npx (comes with Node.js — no separate install)
npx serve app
```

Open the URL printed in the terminal (e.g. `http://localhost:3000`).

---

## Option C — Run the automated test suite

Verifies all 29 checks: every use case, intent variation, order lookup, fallback, and escalation path.

```bash
node app/bot.test.js
```

Expected output ends with:

```
✅ All 29 checks passed
```

---

## Testing each use case manually

Once the chatbot is open in a browser, try these inputs to verify each feature:

### 1. Order tracking
- Type: `Where's my order?`
- Bot asks for an order number.
- Enter `555` → bot says it couldn't find that order (invalid).
- Enter `111` → **Shipped, arriving tomorrow**.
- Enter `222` → **Processing, ships within 24 hours**.
- Enter `333` → **Delivered** (bot offers to help with a return or connect support).

### 2. Returns & exchanges
- Type: `I'd like to return a jacket`
- Bot replies with the **30-day policy** and provides the returns link.

### 3. Product recommendations
- Type: `Recommend some gear`
- Bot asks: *Apparel or camping gear?* → type `Camping gear`
- Bot asks: *Shelter & cooking or sleeping?* → type `Shelter`
- Bot recommends the **Tents & Camp Stoves** category.

### 4. Shipping FAQ
- Type: `How long does shipping take?`
- Bot replies: **Standard 3–5 business days · Expedited 1–2 business days**.

### 5. Human handoff
- Type: `I need to speak to a human`
- Bot transitions to the **Live Agent** state.
- Type: `Back to the bot` to return to the main menu.

### 6. Fallback
- Type: `asdfghjkl ????`
- Bot replies: *"Sorry, I didn't understand that"* and shows the four quick-reply options.
- Type nonsense a second time → bot escalates to a **Live Agent**.

---

## Project structure

```
app/
  index.html        ← open this to run the chatbot
  bot.js            ← intent recognizer + dialog manager
  data.js           ← all mock data (orders, shipping, returns, recommendations)
  bot.test.js       ← automated test suite (29 checks)

demo/
  North-Star-demo.mp4   ← ~2 min video walkthrough of all use cases

docs/
  conversation-design.md
  flows/conversation-flow.md

knowledge-base/
  shipping.md
  returns-and-exchanges.md

submission-images/    ← labeled scenario screenshots (Image 1–6)
README.md
SUBMISSION.md         ← scenario table, video timestamps, requirements checklist
INSTRUCTIONS.md       ← this file
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank page on open | Make sure you're opening `app/index.html`, not the root folder |
| Font looks different | The Fraunces font loads from Google Fonts; a system serif is used as fallback — layout is unaffected |
| `node: command not found` | Install Node.js from [nodejs.org](https://nodejs.org) (only needed for the test suite) |
| Bot gives wrong order | Ensure you type a bare number: `111`, `222`, or `333` — or prefix with `#` (e.g. `#111`) |
