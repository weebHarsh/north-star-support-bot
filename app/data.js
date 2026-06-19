/*
 * North Star Outfitters — provided data (single source of truth).
 *
 * Everything here comes straight from the client brief ("use provided data only").
 * Pure data, no network/fetch — so the bot runs by simply opening index.html (file://).
 * Works in the browser (attaches to window.NS) and in Node (module.exports) for testing.
 */
(function (root) {
  var NS = {
    BOT: "North Star Support Bot",
    STORE: "North Star Outfitters",

    // 3.c Mock Data Handling — exact statuses from the brief
    ORDERS: {
      "111": { id: "111", status: "Shipped",    detail: "Shipped — arriving tomorrow 🚚" },
      "222": { id: "222", status: "Processing", detail: "Processing — ships within 24 hours ⏳" },
      "333": { id: "333", status: "Delivered",  detail: "Delivered ✅" }
    },

    // 4.b Shipping (provided)
    SHIPPING: { standard: "3–5 business days", expedited: "1–2 business days" },

    // 4.a Returns (provided) + returns link
    RETURNS: {
      policy: "You have 30 days to return or exchange unused items in their original packaging.",
      link: "https://northstaroutfitters.example/returns"
    },

    // 2.a.iii Recommendations — category-level only (no invented inventory)
    RECOMMEND: {
      apparel: { cold: "Insulated Jackets & Base Layers", rain: "Rain Shells & Waterproof Gear" },
      camping: { sleeping: "Sleeping Bags & Pads", shelter: "Tents & Camp Stoves" }
    }
  };

  root.NS = NS;
  if (typeof module !== "undefined" && module.exports) module.exports = NS;
})(typeof window !== "undefined" ? window : globalThis);
