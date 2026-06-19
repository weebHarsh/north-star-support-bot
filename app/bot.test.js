/* Node self-test for the North Star Support Bot brain. Run: node app/bot.test.js */
var Bot = require("./bot.js");
var fails = 0, n = 0;
function ok(cond, label) { n++; if (!cond) { fails++; console.log("  ✗ FAIL: " + label); } else console.log("  ✓ " + label); }
function J(r) { return r.messages.join(" || "); }
function fresh() { return Bot.greeting().state; }

console.log("=== greeting ===");
var g = Bot.greeting();
ok(/North Star Support Bot/.test(J(g)), "greeting names the bot");
ok(g.buttons.length === 4, "greeting shows the 4 core options");

console.log("\n=== order tracking (3.c data) ===");
var r = Bot.handle(fresh(), "track my order");
ok(/order number/i.test(J(r)), "track asks for an order number");
r = Bot.handle(r.state, "111");
ok(/Shipped/.test(J(r)) && /tomorrow/.test(J(r)), "#111 -> Shipped, arriving tomorrow");

r = Bot.handle(fresh(), "where's my order 222");
ok(/Processing/.test(J(r)) && /24 hours/.test(J(r)), "#222 inline+variation -> Processing, ships 24h");

r = Bot.handle(fresh(), "track package");
r = Bot.handle(r.state, "333");
ok(/Delivered/.test(J(r)), "#333 -> Delivered");
ok(/return|human|agent/i.test(J(r)), "#333 offers a follow-up");

console.log("\n=== invalid orders + escalation ===");
r = Bot.handle(fresh(), "track my order");
r = Bot.handle(r.state, "1111");
ok(/couldn't find|look like 111/i.test(J(r)), "4-digit '1111' -> invalid");
r = Bot.handle(r.state, "abc");
ok(/didn't catch|couldn't find|111, 222/i.test(J(r)), "non-numeric -> reprompt/invalid");
r = Bot.handle(r.state, "9999");
ok(/live agent/i.test(J(r)) || r.buttons.some(function (b) { return /human/i.test(b.label); }), "repeated invalid -> escalate to human");

console.log("\n=== returns & exchanges (2.a.ii + 4.a) ===");
r = Bot.handle(fresh(), "I want to return something");
ok(/30 days/.test(J(r)) && /northstaroutfitters\.example\/returns/.test(J(r)), "returns -> 30-day policy + returns link");
r = Bot.handle(fresh(), "can I exchange this jacket");
ok(/30 days/.test(J(r)), "exchange keyword -> returns policy");

console.log("\n=== shipping (4.b) ===");
r = Bot.handle(fresh(), "how long does shipping take");
ok(/3–5 business days/.test(J(r)) && /1–2 business days/.test(J(r)), "shipping -> Standard 3-5 / Expedited 1-2");

console.log("\n=== recommendations (2.a.iii: <=2 Qs -> category) ===");
r = Bot.handle(fresh(), "recommend gear");
ok(/apparel or camping/i.test(J(r)), "Q1 asked");
r = Bot.handle(r.state, "apparel");
ok(/cold weather|rain/i.test(J(r)), "Q2 asked (apparel)");
r = Bot.handle(r.state, "cold weather");
ok(/Insulated Jackets/.test(J(r)), "-> Insulated Jackets & Base Layers category");
r = Bot.handle(fresh(), "I'm looking for gear");
r = Bot.handle(r.state, "camping gear");
r = Bot.handle(r.state, "shelter");
ok(/Tents & Camp Stoves/.test(J(r)), "camping/shelter -> Tents & Camp Stoves category");

console.log("\n=== human handoff (2.a.iv) ===");
r = Bot.handle(fresh(), "talk to a human");
ok(/live agent/i.test(J(r)) && r.state.name === "LIVE_AGENT", "human -> Live Agent state");
var r2 = Bot.handle(r.state, "where is my order");
ok(r2.state.name === "LIVE_AGENT", "stays in Live Agent until user returns");
r2 = Bot.handle(r.state, "back to bot");
ok(r2.state.name === "MAIN", "'back to bot' returns to main flow");

console.log("\n=== fallback (3.d) ===");
r = Bot.handle(fresh(), "asdkjfh qwoo");
ok(/didn't understand/i.test(J(r)) && r.buttons.length === 4, "fallback -> 'I didn't understand' + options");
r = Bot.handle(r.state, "more gibberish zzz");
ok(/live agent/i.test(J(r)), "repeated fallback -> escalate to live agent");

console.log("\n=== intent recognition + extraction (3.a) ===");
ok(Bot.recognize("track my package") === "track", "variation: 'track my package' -> track");
ok(Bot.recognize("where is my order") === "track", "variation: 'where is my order' -> track");
ok(Bot.recognize("agent please") === "human", "'agent please' -> human");
ok(Bot.extractOrder("#111") === "111", "extractOrder('#111')");
ok(Bot.extractOrder("order number 333") === "333", "extractOrder('order number 333')");

console.log("\n=== global commands + lone number ===");
r = Bot.handle({ name: "ASK_ORDER", fails: 0, data: {} }, "start over");
ok(/North Star Support Bot/.test(J(r)) && r.state.name === "MAIN", "'start over' resets to main menu");
r = Bot.handle(fresh(), "111");
ok(/Shipped/.test(J(r)), "lone '111' at menu -> tracked");

console.log("\n" + (fails === 0 ? "✅ ALL " + n + " CHECKS PASSED" : "❌ " + fails + "/" + n + " FAILED"));
process.exit(fails ? 1 : 0);
