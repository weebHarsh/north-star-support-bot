/*
 * North Star Support Bot — conversation brain (intent recognition + dialog manager).
 *
 * Pure logic, dual-use: runs in the browser (window.NSBot) and in Node (module.exports)
 * so the same code that ships is the code that's unit-tested (see bot.test.js).
 *
 * Public API:
 *   NSBot.greeting()            -> first turn { messages, buttons, state }
 *   NSBot.handle(state, text)   -> next turn  { messages, buttons, state }
 *   NSBot.recognize(text)       -> intent name | null   (exposed for tests)
 *   NSBot.extractOrder(text)    -> "111" | null         (exposed for tests)
 */
(function (root) {
  var NS = (typeof require !== "undefined" && typeof module !== "undefined") ? require("./data.js") : root.NS;

  var MENU = [
    { label: "📦 Track my order",       send: "track my order" },
    { label: "↩️ Returns & exchanges",  send: "returns and exchanges" },
    { label: "🧭 Product recommendations", send: "recommend gear" },
    { label: "🙋 Talk to a human",      send: "talk to a human" }
  ];

  // Intent keyword sets (checked by substring; ordered by priority for tie-breaks).
  var INTENTS = [
    { name: "human",     kws: ["agent", "human", "representative", "real person", "talk to someone", "talk to a person", "live agent", "speak to", "customer service", "support rep"] },
    { name: "track",     kws: ["track", "tracking", "where is my order", "where's my order", "where is my package", "where's my package", "order status", "status of my order", "wismo", "my order", "my package", "has it shipped", "has my order shipped", "when will my order", "when will it arrive"] },
    { name: "returns",   kws: ["return", "returns", "refund", "exchange", "send it back", "send back", "money back", "return policy"] },
    { name: "shipping",  kws: ["shipping", "how long does shipping", "delivery time", "how fast", "expedited", "standard shipping", "shipping cost", "shipping option", "shipping take"] },
    { name: "recommend", kws: ["recommend", "recommendation", "suggest", "what should i buy", "help me find", "looking for", "need a", "need some", "which product", "best gear", "shopping for", "gift idea"] },
    { name: "menu",      kws: ["menu", "start over", "restart", "main menu", "home screen", "go back to start"] },
    { name: "greeting",  kws: ["hi", "hello", "hey", "yo", "good morning", "good afternoon", "good evening", "help", "what can you do"] }
  ];

  function normalize(t) {
    return " " + String(t == null ? "" : t).toLowerCase().replace(/[^\w\s#']/g, " ").replace(/\s+/g, " ").trim() + " ";
  }

  function recognize(text) {
    var n = normalize(text), best = null, bestScore = 0;
    for (var i = 0; i < INTENTS.length; i++) {
      var score = 0;
      for (var k = 0; k < INTENTS[i].kws.length; k++) {
        if (n.indexOf(INTENTS[i].kws[k]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = INTENTS[i].name; }
    }
    return bestScore > 0 ? best : null;
  }

  // Pull an order number out of "#111", "order 111", "my order is 111", or a lone "111".
  function extractOrder(text) {
    var m = String(text == null ? "" : text).match(/#\s*(\d+)|order\s*(?:number|no\.?|#)?\s*(\d+)|\b(\d{2,6})\b/i);
    if (!m) return null;
    return (m[1] || m[2] || m[3] || "").trim();
  }

  function st(name, extra) {
    var s = { name: name, fails: 0, data: {} };
    if (extra) for (var k in extra) s[k] = extra[k];
    return s;
  }

  function greeting() {
    return {
      messages: ["Hi! I'm the " + NS.BOT + " ⭐ I can track an order, help with returns & exchanges, recommend gear, or connect you with a live agent. What do you need?"],
      buttons: MENU,
      state: st("MAIN")
    };
  }

  function answerOrder(ord, state) {
    var o = NS.ORDERS[ord];
    if (o) {
      if (ord === "333") {
        return {
          messages: ["✅ Order #333 was Delivered. Did everything arrive in good shape? I can help with a return or connect you to a live agent."],
          buttons: [
            { label: "Start a return", send: "returns and exchanges" },
            { label: "Talk to a human", send: "talk to a human" },
            { label: "Back to menu", send: "menu" }
          ],
          state: st("MAIN")
        };
      }
      var line = ord === "111"
        ? "📦 Order #111 is Shipped and arriving tomorrow! (Standard shipping runs " + NS.SHIPPING.standard + "; expedited " + NS.SHIPPING.expedited + ".)"
        : "⏳ Order #222 is Processing and ships within 24 hours. You'll get tracking by email once it's on its way.";
      return { messages: [line, "Anything else?"], buttons: MENU, state: st("MAIN") };
    }
    // invalid order
    var fails = (state.fails || 0) + 1;
    if (fails >= 2) {
      return {
        messages: ["I still can't find an order with that number. Let me connect you with a live agent who can dig deeper."],
        buttons: [{ label: "Talk to a human", send: "talk to a human" }, { label: "Menu", send: "menu" }],
        state: st("ASK_ORDER", { fails: fails })
      };
    }
    return {
      messages: ["Hmm, I couldn't find an order with that number. Our order numbers look like 111, 222, or 333 — want to try again?"],
      buttons: [{ label: "Talk to a human", send: "talk to a human" }],
      state: st("ASK_ORDER", { fails: fails })
    };
  }

  function liveAgent() {
    return {
      messages: ["Connecting you to a live agent… 🧑‍💼", "You're now with a " + NS.STORE + " support specialist (simulated) — they'll take it from here. Want to come back to the bot?"],
      buttons: [{ label: "↩︎ Back to the bot", send: "back to bot" }],
      state: st("LIVE_AGENT")
    };
  }

  function returnsAnswer() {
    return {
      messages: [
        "Here's our return & exchange policy: " + NS.RETURNS.policy,
        "Start a return or exchange here: " + NS.RETURNS.link + " 🧾",
        "Anything else?"
      ],
      buttons: MENU,
      state: st("MAIN")
    };
  }

  function shippingAnswer() {
    return {
      messages: ["Shipping options: Standard is " + NS.SHIPPING.standard + ", and Expedited is " + NS.SHIPPING.expedited + ".", "Anything else?"],
      buttons: MENU,
      state: st("MAIN")
    };
  }

  function fallback(state) {
    var fails = (state.fails || 0) + 1;
    if (fails >= 2) return liveAgent();
    return {
      messages: ["Sorry, I didn't understand that. I can help with a few things — pick one below, or tell me in your own words:"],
      buttons: MENU,
      state: st("MAIN", { fails: fails })
    };
  }

  function handle(state, text) {
    state = state || st("MAIN");
    var raw = String(text == null ? "" : text).trim();
    var n = normalize(raw);
    var intent = recognize(raw);

    // --- Live Agent state: only a return-to-bot brings them back ---
    if (state.name === "LIVE_AGENT") {
      if (/back|bot|menu|return|exit/.test(n)) {
        return { messages: ["Welcome back! 👋 What can I help you with?"], buttons: MENU, state: st("MAIN") };
      }
      return {
        messages: ["You're connected to a live agent (simulated) — they'll follow up shortly. Tap below to return to the bot anytime."],
        buttons: [{ label: "↩︎ Back to the bot", send: "back to bot" }],
        state: state
      };
    }

    // --- Global commands (work from anywhere) ---
    if (intent === "menu") return greeting();
    if (intent === "human") return liveAgent();

    // --- Awaiting an order number ---
    if (state.name === "ASK_ORDER") {
      // let the user bail out to another task instead of being trapped
      if (intent && intent !== "track" && intent !== "greeting") return route(intent, raw, st("MAIN"));
      var ord = extractOrder(raw);
      if (!ord) {
        return {
          messages: ["I didn't catch an order number — it looks like 111, 222, or 333. What's yours?"],
          buttons: [{ label: "Talk to a human", send: "talk to a human" }],
          state: state
        };
      }
      return answerOrder(ord, state);
    }

    // --- Recommendation slot-filling (max 2 questions) ---
    if (state.name === "REC_Q1") return recQ1(raw, state);
    if (state.name === "REC_Q2") return recQ2(raw, state);

    // --- MAIN routing ---
    if (intent) return route(intent, raw, state);

    // lone order number typed at the menu ("111", "#111")
    if (/^#?\s*\d{2,6}$/.test(raw)) return answerOrder(extractOrder(raw), state);

    if (!raw) return fallback(state);
    return fallback(state);
  }

  function route(intent, raw, state) {
    if (intent === "human") return liveAgent();
    if (intent === "greeting") return greeting();
    if (intent === "returns") return returnsAnswer();
    if (intent === "shipping") return shippingAnswer();
    if (intent === "recommend") {
      return {
        messages: ["Happy to help you find gear! Are you shopping for apparel or camping gear?"],
        buttons: [{ label: "Apparel", send: "apparel" }, { label: "Camping gear", send: "camping gear" }],
        state: st("REC_Q1")
      };
    }
    if (intent === "track") {
      var ord = extractOrder(raw);
      if (ord) return answerOrder(ord, st("ASK_ORDER"));
      return { messages: ["Sure — what's your order number? (e.g., 111)"], buttons: [], state: st("ASK_ORDER") };
    }
    return fallback(state);
  }

  function recQ1(raw, state) {
    var n = normalize(raw);
    if (/apparel|clothing|clothes|jacket|layer|wear|shirt|pants/.test(n)) {
      return {
        messages: ["Got it. Will you be staying warm in cold weather, or staying dry in the rain?"],
        buttons: [{ label: "Cold weather", send: "cold weather" }, { label: "Rain", send: "rain" }],
        state: st("REC_Q2", { data: { cat: "apparel" } })
      };
    }
    if (/camp|gear|tent|sleep|stove|backpack|hik|outdoor/.test(n)) {
      return {
        messages: ["Nice. Is this for your sleep setup, or shelter & cooking?"],
        buttons: [{ label: "Sleeping", send: "sleeping" }, { label: "Shelter & cooking", send: "shelter" }],
        state: st("REC_Q2", { data: { cat: "camping" } })
      };
    }
    // unclear → re-offer the two choices (still within 1-2 questions)
    return {
      messages: ["No problem — apparel (clothing) or camping gear?"],
      buttons: [{ label: "Apparel", send: "apparel" }, { label: "Camping gear", send: "camping gear" }],
      state: state
    };
  }

  function recQ2(raw, state) {
    var n = normalize(raw);
    var cat = state.data && state.data.cat;
    var rec;
    if (cat === "apparel") rec = /rain|wet|dry|waterproof/.test(n) ? NS.RECOMMEND.apparel.rain : NS.RECOMMEND.apparel.cold;
    else rec = /shelter|cook|tent|stove/.test(n) ? NS.RECOMMEND.camping.shelter : NS.RECOMMEND.camping.sleeping;
    return {
      messages: ["Based on that, I'd recommend checking out our " + rec + " category. 🏔️", "Anything else?"],
      buttons: MENU,
      state: st("MAIN")
    };
  }

  var API = { greeting: greeting, handle: handle, recognize: recognize, extractOrder: extractOrder, MENU: MENU };
  root.NSBot = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
