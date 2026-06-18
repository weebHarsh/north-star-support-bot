# 06 — Sample Transcripts

Realistic end-to-end conversations for each flow, including edge paths, using the verified mock
data. `[Buttons]` show quick-reply options. Great for narrating the demo and for the client to
read without opening Voiceflow.

---

## A. Welcome

> **Sage:** Hi! I'm **Sage**, the Trailhead Outfitters assistant 🎒
> I can **track an order**, start a **return or exchange**, help you **find gear**, or connect
> you with a **teammate**. What can I do for you?
> `[📦 Track my order] [↩️ Returns & exchanges] [🧭 Recommendations] [💬 Ask a question] [🙋 Talk to a human]`

---

## B. Order tracking — happy path (Shipped, with delay note)

> **User:** track my order
> **Sage:** Sure — what's your order number? It looks like **TO-#####** and is in your
> confirmation email.
> **User:** to-10002
> **Sage:** 📦 Order **TO-10002** is on its way! Carrier: **UPS**, tracking **1Z999AA10123456784**.
> Estimated delivery **Jun 19**.
> Heads up — this shipped in 2 parcels: the jacket is on time for Jun 19; the socks are delayed
> in transit, new estimate **Jun 22**.
> `[Track another] [Start a return] [Done]`
> **User:** done
> **Sage:** Anything else I can help with? `[Main menu] [Talk to a human]`

*(Shows input normalization — lowercase accepted — and split-shipment handling.)*

---

## C. Order tracking — unknown number, then recovery

> **User:** where's my stuff, order 99999
> **Sage:** I couldn't find an order with **TO-99999**. Double-check your confirmation email, or
> I can connect you with a teammate. `[Try again] [Talk to a human]`
> **User:** try again
> **Sage:** No problem — what's the order number?
> **User:** TO 10003
> **Sage:** 🚚 Order **TO-10003** is **out for delivery** — expected by 8 PM today. Carrier
> **FedEx**, tracking **771234567890**. `[Track another] [Done]`

*(No fabricated data for the unknown order; "TO 10003" with a space still resolves.)*

---

## D. Returns — exchange (eligible, multi-item, confirm gate)

> **User:** I need to return something
> **Sage:** Happy to help. What's your order number? (**TO-#####**)
> **User:** TO-10004
> **Sage:** Found it — order **TO-10004**, delivered **Jun 6** (within our 30-day window 👍).
> Which item is this about?
> `[Aurora Down Jacket] [Cedar Fleece Pullover]`
> **User:** [Aurora Down Jacket]
> **Sage:** Got it. Return for a refund, or exchange for a different size/color?
> `[Return for refund] [Exchange]`
> **User:** [Exchange]
> **Sage:** What's the reason? `[Wrong size] [Doesn't fit] [Changed my mind] [Arrived damaged] [Wrong item] [Other]`
> **User:** [Doesn't fit]
> **Sage:** Which size would you like instead? `[XS] [S] [M] [L] [XL] [XXL]`
> **User:** [M]
> **Sage:** Just to confirm: **exchange** the **Aurora Down Jacket** (size **L → M**) from order
> **TO-10004**, reason **Doesn't fit**. Shall I set that up? `[Yes, set it up] [No, change something]`
> **User:** [Yes, set it up]
> **Sage:** Done ✅ Exchange set up — RMA **RMA-10004-FIT**. I've emailed a **free prepaid return
> label**. Pack the jacket with its tags and drop it off; your size **M** ships as soon as we
> scan the return. Anything else? `[Main menu] [Talk to a human]`

---

## E. Returns — final-sale item (ineligible, graceful)

> **User:** return my sun hoodie, TO-10007
> **Sage:** I'm sorry — the **Ridge Sun Hoodie** on order **TO-10007** was a **final-sale item**,
> so it can't be returned or exchanged. If it's **defective**, our 1-year warranty covers that —
> want me to connect you with a teammate? `[It's defective → human] [Done]`
> **User:** [Done]
> **Sage:** No worries. Anything else? `[Main menu] [Talk to a human]`

---

## F. Returns — outside the 30-day window

> **User:** I want to return TO-10005
> **Sage:** That order was delivered **53 days ago**, which is past our **30-day** return window,
> so I can't start a standard return. If the **Glacier 0°F Sleeping Bag** is **defective**, our
> **1-year warranty** still covers it — want help with that? `[It's defective → human] [Talk to a human] [Done]`

---

## G. Product recommendation — guided

> **User:** help me pick gear
> **Sage:** Happy to help you find the right gear! A couple quick questions.
> What are you shopping for? `[Apparel 🧥] [Camping gear ⛺] [Not sure]`
> **User:** [Camping gear ⛺]
> **Sage:** What kind of trip? `[Backpacking] [Car camping] [Day hiking]`
> **User:** [Backpacking]
> **Sage:** And your budget? `[Under $100] [$100–$250] [$250+] [No limit]`
> **User:** [$100–$250]
> **Sage:** Based on **backpacking** around **$100–$250**, two great picks:
> • **Nimbus 20°F Sleeping Bag** — $179. Lightweight do-it-all 3-season bag. [view]
> • **Vantage 55L Backpack** — $199. Comfy carry for multi-day trips. [view]
> Want more options, sizing help, or a teammate? `[More options] [Sizing help] [Start over] [Talk to a human]`

---

## H. Product recommendation — budget too low (no dead-end)

> **User:** [Camping gear ⛺] → [Car camping] → [Under $100]
> **Sage:** Our family tents start at **$329**, so they're above $100 — but here's great
> car-camping gear under $100:
> • **Beacon 350 Headlamp** — $39 • **Ember Stove** — $49 • **Clearflow Water Filter** — $39
> Want to **see tents anyway**, or stick with under-$100 picks? `[See tents] [Under-$100 gear] [Talk to a human]`

---

## I. Product recommendation — out of stock

> **User:** I need a sleeping bag for winter camping
> **Sage:** For deep cold you'd want the **Glacier 0°F Sleeping Bag**, but it's **out of stock**
> right now. The **Nimbus 20°F** ($179) is a great in-stock option for most 3-season trips, and
> I can **notify you** when the Glacier is back. `[Notify me about Glacier] [See the Nimbus] [Talk to a human]`

---

## J. Human handoff (in hours, with context)

> **User:** talk to a human
> **Sage:** Of course — I'll get you to a teammate 🙂 Quick — what's it about?
> **User:** my sleeping bag zipper broke
> **Sage:** Who am I connecting? (your name)
> **User:** Jordan
> **Sage:** Thanks, Jordan! And the best **email** to reach you?
> **User:** jordan@example.com
> **Sage:** Connecting you with a teammate now — hang tight. (If everyone's busy, we'll reply by
> email shortly.) I've opened ticket **TKT-4827**.
> Here's what I'll pass along: *"Possible defect — sleeping bag zipper broke; order TO-10005."*
> Anything to add? `[That's everything] [Add a note]`
> **User:** [That's everything]
> **Sage:** You're all set — ticket **TKT-4827**. Anything else in the meantime?

---

## K. FAQ / Knowledge Base + off-topic guardrail

> **User:** do you ship to Canada?
> **Sage:** Yes! We ship to Canada — note that import duties/taxes may be collected by the
> carrier at delivery. We don't ship elsewhere internationally yet. Did that help?
> `[Yes, thanks] [Ask another] [Talk to a human]`
> **User:** what's the stock market doing today
> **Sage:** That's outside what I can help with — I'm here for Trailhead Outfitters orders,
> returns, gear, and store questions. Want a hand with any of those? `[Main menu] [Talk to a human]`

---

## L. No-match ladder → handoff

> **User:** asdkjfh
> **Sage:** Sorry, I didn't quite catch that. Tap an option below or tell me in your own words.
> `[📦 Track] [↩️ Returns] [🧭 Recommendations] [🙋 Human]`
> **User:** blah blah
> **Sage:** Let me see if I can answer that… *(checks Knowledge Base, no confident answer)*
> **User:** still nonsense
> **Sage:** I want to get this right — let me connect you with a teammate. Who am I connecting?
> *(→ Human handoff)*
