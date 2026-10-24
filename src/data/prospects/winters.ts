import type { Prospect } from "./types";

/**
 * Prepared for Winters Instruments. Unlisted and noindex: Peter sends the link.
 * Facts come only from what Winters told Peter and from winters.com. Everything
 * else is a hypothesis for Wednesday, and the page says so.
 */
export const winters: Prospect = {
  slug: "winters",
  company: "Winters Instruments",
  meeting: { label: "Wednesday, October 28 · 9:00 AM ET", subject: "Winters · Wednesday, October 28" },
  hero: {
    kicker: "Prepared for Winters Instruments",
    headline: "An AI team for Winters",
    sub: "Without hiring one. A starting point for our two hours together: what we heard, where we expect to look first, how the first 90 days would run, and what it costs.",
  },
  heard: {
    heading: "What we heard.",
    told: [
      "A family company, now in its third generation.",
      "About 160 people across sales, engineering, the shop floor and the office.",
      "No in-house software team.",
      "You want to see, in one sitting, every part of the business where AI, automation and bots could help.",
    ],
    publicHeading: "What your website told us.",
    public: [
      "Making instruments in Toronto since 1953.",
      "Distribution in more than 90 countries.",
      "An engineering team that answers technical RFQs.",
      "Three stocking facilities in North America, and a configurator for distributors.",
    ],
  },
  hypotheses: {
    heading: "Where we expect to look first.",
    sub: "Hypotheses from your public website, to test together on Wednesday. They’re not findings: your Map is built from your real week.",
    items: [
      {
        title: "Technical RFQs",
        image: "office",
        body: "An assistant reads each RFQ, pulls the matching specs, approvals and lead times from your catalogue, and drafts the reply for an engineer to check.",
        ask: "How many RFQs a week, and how long does a typical one take?",
      },
      {
        title: "Distributor questions",
        image: "map",
        body: "Stock, lead-time, price and spec questions from more than 90 countries, answered from your own data, in the distributor’s language, for a person to approve.",
        ask: "Where do these questions arrive today: email, phone, the portal?",
      },
      {
        title: "Purchase orders",
        image: "exterior",
        body: "POs that arrive as PDFs and emails, read, checked against part numbers and price lists, and staged for entry.",
        ask: "Which system do orders go into, and who keys them in?",
      },
      {
        title: "Certificates and approvals",
        image: "needle",
        body: "The right calibration certificates and approvals pulled and attached to each order, without anyone searching a shared drive.",
        ask: "Where do certificates live, and how often are they requested?",
      },
      {
        title: "Stock across three facilities",
        image: "warehouse",
        body: "A morning note on what’s low, where it’s sitting, and what to move or reorder before anyone asks.",
        ask: "How is stock checked between facilities today?",
      },
      {
        title: "Configurator to quote",
        image: "plant",
        body: "A configured part turned into a priced quote and a polite follow-up, without retyping it.",
        ask: "What happens after a distributor configures a part?",
      },
    ],
  },
  session: {
    heading: "Wednesday’s two hours.",
    room: "Who we’d love in the room: the president, whoever runs operations, and the leads for sales and customer service, engineering, and finance. Two hours, in person or on video.",
  },
  prep: {
    heading: "Before Wednesday, if you can.",
    sub: "None of this is required. Each one makes the two hours go further.",
    items: [
      "The list of departments, and who leads each one.",
      "The systems you run: email, ERP, accounting, CRM, shared drives.",
      "The three things that eat the most time this month.",
      "One real example of each: an RFQ, a PO, a distributor email. We’ll sign an NDA first.",
    ],
  },
  close: {
    heading: "See you on Wednesday.",
    sub: "Questions before then go straight to Peter.",
  },
};
