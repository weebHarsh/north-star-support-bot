/**
 * Trailhead Outfitters — self-contained order lookup for Voiceflow's JavaScript step.
 *
 * WHY THIS EXISTS
 *   "No live deployment required" — so instead of calling a real backend, the bot ships with a
 *   small embedded order table and computes everything (status, tracking, returns eligibility,
 *   business hours) in one JavaScript step. Swap `ORDERS` for a fetch() to a real API later and
 *   nothing else in the flows has to change.
 *
 * HOW TO USE IN VOICEFLOW
 *   See the "VOICEFLOW GLUE" block at the very bottom of this file, and
 *   docs/03-voiceflow-build-guide.md (step "Order Lookup JavaScript block").
 *
 * HOW TO VERIFY LOCALLY
 *   node "orders-lookup.js"   ->  runs the self-test and prints a per-order summary.
 *   The self-test block is guarded so Voiceflow ignores it.
 *
 * Keep this in sync with orders.json (same 7 orders).
 */

// ---------------------------------------------------------------------------
// Embedded order data (mirror of orders.json)
// ---------------------------------------------------------------------------
var ORDERS = {
  "TO-10001": {
    email: "alex.morgan@example.com", customer_name: "Alex Morgan",
    order_date: "2026-06-16", status: "Processing",
    items: [{ name: "Ridgeline 2P Tent", qty: 1, size: null, color: "Orange/Grey" }],
    carrier: null, tracking_number: null, estimated_delivery: "2026-06-24", delivered_date: null,
    shipping_city_state: "Boulder, CO", final_sale: false,
    tracking_note: "We're packing your order now. You'll get tracking by email once it ships (usually within 1 business day).",
    refund_status: null
  },
  "TO-10002": {
    email: "jamie.lee@example.com", customer_name: "Jamie Lee",
    order_date: "2026-06-12", status: "Shipped",
    items: [
      { name: "Summit Rain Jacket", qty: 1, size: "M", color: "Forest Green" },
      { name: "Summit Wool Hiking Socks (2-pack)", qty: 1, size: "M", color: "Grey" }
    ],
    carrier: "UPS", tracking_number: "1Z999AA10123456784", estimated_delivery: "2026-06-19", delivered_date: null,
    shipping_city_state: "Denver, CO", final_sale: false,
    tracking_note: "Shipped in 2 parcels. Parcel 1 (jacket) is on time for Jun 19; parcel 2 (socks) is delayed in transit — new estimate Jun 22.",
    refund_status: null
  },
  "TO-10003": {
    email: "priya.patel@example.com", customer_name: "Priya Patel",
    order_date: "2026-06-10", status: "Out for delivery",
    items: [{ name: "Vantage 55L Backpack", qty: 1, size: null, color: "Charcoal" }],
    carrier: "FedEx", tracking_number: "771234567890", estimated_delivery: "2026-06-17", delivered_date: null,
    shipping_city_state: "Salt Lake City, UT", final_sale: false,
    tracking_note: "Out for delivery — expected by 8 PM today.",
    refund_status: null
  },
  "TO-10004": {
    email: "chris.nguyen@example.com", customer_name: "Chris Nguyen",
    order_date: "2026-06-02", status: "Delivered",
    items: [
      { name: "Aurora Down Jacket", qty: 1, size: "L", color: "Black" },
      { name: "Cedar Fleece Pullover", qty: 1, size: "L", color: "Navy" }
    ],
    carrier: "USPS", tracking_number: "9400100000000000000000", estimated_delivery: "2026-06-06", delivered_date: "2026-06-06",
    shipping_city_state: "Portland, OR", final_sale: false,
    tracking_note: "Delivered — left at front door.",
    refund_status: null
  },
  "TO-10005": {
    email: "morgan.reed@example.com", customer_name: "Morgan Reed",
    order_date: "2026-04-20", status: "Delivered",
    items: [{ name: "Glacier 0°F Sleeping Bag", qty: 1, size: null, color: "Burnt Orange" }],
    carrier: "UPS", tracking_number: "1Z999AA10987654321", estimated_delivery: "2026-04-25", delivered_date: "2026-04-25",
    shipping_city_state: "Flagstaff, AZ", final_sale: false,
    tracking_note: "Delivered.",
    refund_status: null
  },
  "TO-10006": {
    email: "sam.taylor@example.com", customer_name: "Sam Taylor",
    order_date: "2026-06-08", status: "Cancelled",
    items: [{ name: "Basecamp 4P Family Tent", qty: 1, size: null, color: "Spruce" }],
    carrier: null, tracking_number: null, estimated_delivery: null, delivered_date: null,
    shipping_city_state: "Seattle, WA", final_sale: false,
    tracking_note: "Order cancelled on Jun 9 at customer request.",
    refund_status: "Refunded $329.00 to original payment on 2026-06-09 (allow 3–5 business days to appear)."
  },
  "TO-10007": {
    email: "dana.kim@example.com", customer_name: "Dana Kim",
    order_date: "2026-05-30", status: "Delivered",
    items: [{ name: "Ridge Sun Hoodie", qty: 1, size: "M", color: "Sand" }],
    carrier: "USPS", tracking_number: "9400100000000000000001", estimated_delivery: "2026-06-03", delivered_date: "2026-06-03",
    shipping_city_state: "Austin, TX", final_sale: true,
    tracking_note: "Delivered.",
    refund_status: null
  }
};

var RETURN_WINDOW_DAYS = 30;

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

// Accepts messy input: "to-10001", " #TO-10001 ", "TO 10001", "TO10001", "10001"
function normalizeOrderNumber(raw) {
  var s = String(raw == null ? "" : raw).trim().toUpperCase();
  s = s.replace(/\s+/g, "");          // drop spaces
  s = s.replace(/^ORDER#?/, "");      // drop a leading "ORDER" / "ORDER#"
  s = s.replace(/^#/, "");            // drop leading #
  if (/^\d{5}$/.test(s)) return "TO-" + s;          // bare 5 digits
  if (/^TO\d{5}$/.test(s)) return "TO-" + s.slice(2); // missing dash
  return s;                                          // TO-##### or something invalid
}

function isValidOrderFormat(normalized) {
  return /^TO-\d{5}$/.test(normalized);
}

function daysBetween(fromISO, toISO) {
  var a = new Date(fromISO + "T00:00:00Z").getTime();
  var b = new Date(toISO + "T00:00:00Z").getTime();
  return Math.floor((b - a) / 86400000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email == null ? "" : email).trim());
}

// Business hours: Mon–Fri 9:00–18:00. NOTE: uses the runtime clock in UTC for simplicity —
// for the demo you can hard-set within_hours = true. Swap to an ET conversion for production.
function computeWithinHours(nowDateOrISO) {
  var d = nowDateOrISO ? new Date(nowDateOrISO) : new Date();
  var day = d.getUTCDay();   // 0 Sun .. 6 Sat
  var hour = d.getUTCHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// The one function the flows call. Returns every variable the bot needs.
function computeOrderResult(orderNumberRaw, emailRaw, nowISO) {
  var now = nowISO || new Date().toISOString().slice(0, 10);
  var normalized = normalizeOrderNumber(orderNumberRaw);
  var r = {
    normalized_order_number: normalized,
    valid_format: isValidOrderFormat(normalized),
    found: false,
    customer_name: null,
    email_match: null,
    order_status: null,
    carrier: null,
    tracking: null,
    eta: null,
    order_items: null,
    item_count: 0,
    order_date: null,
    delivered_date: null,
    days_since_delivery: null,
    final_sale: false,
    tracking_note: null,
    refund_status: null,
    shipping_city_state: null,
    return_eligible: false,
    ineligible_reason: "not_found"
  };

  var o = ORDERS[normalized];
  if (!o) return r;

  r.found = true;
  r.customer_name = o.customer_name;
  r.order_status = o.status;
  r.carrier = o.carrier;
  r.tracking = o.tracking_number;
  r.eta = o.estimated_delivery;
  r.order_date = o.order_date;
  r.delivered_date = o.delivered_date;
  r.final_sale = !!o.final_sale;
  r.tracking_note = o.tracking_note;
  r.refund_status = o.refund_status;
  r.shipping_city_state = o.shipping_city_state;
  r.item_count = o.items.length;
  r.order_items = o.items.map(function (i) {
    return i.qty + "× " + i.name + (i.size ? " (size " + i.size + ")" : "") + (i.color ? ", " + i.color : "");
  }).join("; ");

  // Email verification only runs if the user supplied an email.
  if (emailRaw != null && String(emailRaw).trim() !== "") {
    r.email_match = String(emailRaw).trim().toLowerCase() === String(o.email).toLowerCase();
  }

  // Returns eligibility
  if (o.status === "Cancelled") {
    r.return_eligible = false; r.ineligible_reason = "cancelled";
  } else if (o.status !== "Delivered") {
    r.return_eligible = false; r.ineligible_reason = "not_delivered";
  } else {
    r.days_since_delivery = o.delivered_date ? daysBetween(o.delivered_date, now) : null;
    if (o.final_sale) {
      r.return_eligible = false; r.ineligible_reason = "final_sale";
    } else if (r.days_since_delivery == null) {
      // Delivered but no delivery date on file — don't auto-approve; route to a human.
      r.return_eligible = false; r.ineligible_reason = "needs_review";
    } else if (r.days_since_delivery > RETURN_WINDOW_DAYS) {
      r.return_eligible = false; r.ineligible_reason = "outside_window";
    } else {
      r.return_eligible = true; r.ineligible_reason = null;
    }
  }
  return r;
}

// ---------------------------------------------------------------------------
// Node self-test (Voiceflow ignores this block: `require`/`module` are undefined there)
// ---------------------------------------------------------------------------
if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  var TODAY = "2026-06-17";
  var failures = 0;
  function check(label, actual, expected) {
    var ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (!ok) { failures++; console.log("  ✗ FAIL " + label + " — got " + JSON.stringify(actual) + ", expected " + JSON.stringify(expected)); }
    else { console.log("  ✓ " + label); }
  }

  console.log("\n=== normalizeOrderNumber ===");
  check("to-10001 -> TO-10001", normalizeOrderNumber("to-10001"), "TO-10001");
  check("' #TO-10002 ' -> TO-10002", normalizeOrderNumber(" #TO-10002 "), "TO-10002");
  check("'TO 10003' -> TO-10003", normalizeOrderNumber("TO 10003"), "TO-10003");
  check("TO10004 -> TO-10004", normalizeOrderNumber("TO10004"), "TO-10004");
  check("'10005' -> TO-10005", normalizeOrderNumber("10005"), "TO-10005");
  check("'order #TO-10006' -> TO-10006", normalizeOrderNumber("order #TO-10006"), "TO-10006");
  check("garbage 'hello' stays invalid", isValidOrderFormat(normalizeOrderNumber("hello")), false);

  console.log("\n=== eligibility & status (as of " + TODAY + ") ===");
  check("TO-10001 status Processing", computeOrderResult("TO-10001", null, TODAY).order_status, "Processing");
  check("TO-10001 not returnable (not_delivered)", computeOrderResult("TO-10001", null, TODAY).ineligible_reason, "not_delivered");
  check("TO-10002 status Shipped", computeOrderResult("TO-10002", null, TODAY).order_status, "Shipped");
  check("TO-10003 out for delivery", computeOrderResult("TO-10003", null, TODAY).order_status, "Out for delivery");
  check("TO-10004 delivered 11 days ago", computeOrderResult("TO-10004", null, TODAY).days_since_delivery, 11);
  check("TO-10004 return eligible", computeOrderResult("TO-10004", null, TODAY).return_eligible, true);
  check("TO-10004 item count 2", computeOrderResult("TO-10004", null, TODAY).item_count, 2);
  check("TO-10005 delivered 53 days ago", computeOrderResult("TO-10005", null, TODAY).days_since_delivery, 53);
  check("TO-10005 outside_window", computeOrderResult("TO-10005", null, TODAY).ineligible_reason, "outside_window");
  check("TO-10006 cancelled", computeOrderResult("TO-10006", null, TODAY).ineligible_reason, "cancelled");
  check("TO-10006 has refund_status", !!computeOrderResult("TO-10006", null, TODAY).refund_status, true);
  check("TO-10007 final_sale ineligible", computeOrderResult("TO-10007", null, TODAY).ineligible_reason, "final_sale");
  check("unknown TO-99999 not found", computeOrderResult("TO-99999", null, TODAY).found, false);
  check("no Delivered order misfires needs_review (all have a delivery date)", Object.keys(ORDERS).filter(function (k) { return computeOrderResult(k, null, TODAY).ineligible_reason === "needs_review"; }).length, 0);

  console.log("\n=== email verification ===");
  check("TO-10004 correct email matches (case-insensitive)", computeOrderResult("TO-10004", "CHRIS.NGUYEN@example.com", TODAY).email_match, true);
  check("TO-10004 wrong email rejected", computeOrderResult("TO-10004", "nope@example.com", TODAY).email_match, false);
  check("TO-10004 no email -> null", computeOrderResult("TO-10004", null, TODAY).email_match, null);
  check("isValidEmail rejects 'abc'", isValidEmail("abc"), false);
  check("isValidEmail accepts a@b.co", isValidEmail("a@b.co"), true);

  console.log("\n=== what the bot would say (sample) ===");
  Object.keys(ORDERS).forEach(function (k) {
    var r = computeOrderResult(k, null, TODAY);
    console.log("  " + k + " | " + r.order_status +
      " | items: " + r.order_items +
      " | eta: " + (r.eta || "—") +
      " | returnable: " + r.return_eligible + (r.ineligible_reason ? " (" + r.ineligible_reason + ")" : ""));
  });

  console.log("\n" + (failures === 0
    ? "✅ ALL CHECKS PASSED"
    : "❌ " + failures + " CHECK(S) FAILED"));
  process.exit(failures === 0 ? 0 : 1);
}

/* =========================================================================
   VOICEFLOW GLUE — paste EVERYTHING above this comment into the JavaScript
   step, then add the lines below. (The Node self-test block above is inert in
   Voiceflow because `require`/`module` don't exist there — safe to leave in.)
   Create all of these variables in your agent first (see the build guide).

     var __r = computeOrderResult(order_number, email, null); // null => today's date at runtime

     normalized_order_number = __r.normalized_order_number;
     valid_format            = __r.valid_format;
     found                   = __r.found;
     email_match             = __r.email_match;
     customer_name           = __r.customer_name;
     order_status            = __r.order_status;
     carrier                 = __r.carrier;
     tracking                = __r.tracking;
     eta                     = __r.eta;
     order_items             = __r.order_items;
     item_count              = __r.item_count;
     order_date              = __r.order_date;
     delivered_date          = __r.delivered_date;
     days_since_delivery     = __r.days_since_delivery;
     final_sale              = __r.final_sale;
     tracking_note           = __r.tracking_note;
     refund_status           = __r.refund_status;
     shipping_city_state     = __r.shipping_city_state;
     return_eligible         = __r.return_eligible;
     ineligible_reason       = __r.ineligible_reason;
     within_hours            = computeWithinHours(null); // or hard-set true for the demo
   ========================================================================= */
