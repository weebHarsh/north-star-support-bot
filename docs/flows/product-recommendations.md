# Flow Diagram — Product Recommendations

```mermaid
flowchart TD
  A["Intro"] --> Cat{"rec_category"}
  Cat -->|Not sure| Clar["Clarify: wear vs camp"]
  Cat -->|Unsupported| Uns["We don't carry that: options / human"]
  Clar --> Cat
  Cat -->|Apparel| UA{"use-case: warm / dry / layers / pants"}
  Cat -->|Camping gear| UC{"use-case: backpacking / car / day"}
  UA --> Bud{"rec_budget"}
  UC --> Bud
  Bud --> Map["Condition tree to 2-3 curated picks"]
  Map --> Edge{"edge case?"}
  Edge -->|budget too low| Low["Show best-value + offer see-anyway"]
  Edge -->|out of stock| OOS["Label OOS + alternative + notify"]
  Edge -->|good match| Show["Present picks + reason + links"]
  Low --> Show
  OOS --> Show
  Show --> End["More options / sizing / human / menu"]
```

Picks come from the curated mapping table in the conversation-design doc, sourced from
`products.json`. The optional Response AI step only phrases a rationale; it never invents specs.
