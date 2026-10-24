/**
 * The company offer: Roger Partner, for family-owned companies.
 * Every string on `/` lives here. Terms are Peter's draft until he confirms
 * them (flags.companyTermsConfirmed in config.ts).
 */

export const partner = {
  name: "Roger Partner",
  price: 10000,
  priceLabel: "$10,000",
  per: "a month",
  termLine: "Month-to-month after the first 90 days",
  includes: [
    { text: "The two-hour Map session and your written Map", strong: true },
    { text: "New automations built every month, on your own systems", strong: true },
    { text: "Everything that’s running, watched and tuned" },
    { text: "Staff training and a written how-to for every automation" },
    { text: "A one-page report to the owners each month, in hours" },
    { text: "Peter as your one point of contact, same-day replies on business days" },
  ],
  subscriptions:
    "Any AI or software subscriptions are paid by your company directly. We tell you what they will be before anything is bought.",
};

/** Who Peter is, on the company pages. Facts only; photo, full name, phone and bio come from config. */
export const peter = {
  heading: "Who you’ll work with.",
  lines: [
    "Peter runs every account himself, from the Map to the monthly report. No account managers, no ticket queue.",
    "He runs his own week with an AI Chief of Staff and a few helpers, and sets up the same thing for others, on their own systems.",
  ],
  wontDoHeading: "What we won’t do",
};

export const companyWontDo = [
  "We won’t connect anything that sends to a customer or moves money without a rule your team approves.",
  "We won’t build on a platform you don’t own. Everything runs in your company’s accounts.",
  "We won’t promise an automation the tools can’t do reliably yet. If it’s shaky, you’ll hear it in the Map.",
];

export const goAhead = {
  heading: "If you’d like to go ahead.",
  steps: [
    { title: "Agreement and NDA", body: "A one-page agreement and an NDA, signed before we see any of your documents." },
    { title: "Pick the Map date", body: "Two hours with your leadership, in the next two weeks." },
    { title: "Month one begins", body: "Invoiced when the Map is booked. The first three automations go live within the month." },
  ],
  pending: "Terms to confirm together on Wednesday.",
};

export const companyHero = {
  kicker: "AI and automation for family-owned companies · Toronto",
  headline: "The AI team you don’t hire",
  sub: "No new hires. In one two-hour session we map where your company’s hours go, then every month we build and run the automations that give them back: quotes, orders, customer questions, invoices. On your own systems.",
  secondary: "How the Map works",
  fine: `From ${partner.priceLabel} ${partner.per} · ${partner.termLine.toLowerCase()}`,
  imageAlt: "An industrial pressure gauge on a steel workbench in early-morning light",
  /** A week in month 3 of the example: report hours ÷ 4.33, rounded. */
  week: {
    label: "Hours back in a week",
    tag: "Example · month 3",
  },
};

export const mapSession = {
  lines: ["Two hours.", "Every department."],
  card: {
    title: "The Map session",
    body: "Your leadership and Peter, around one table. You leave with every department’s busywork written down and ranked by the hours it costs you.",
  },
  imageAlt: "A boardroom table in morning light with a hand-drawn map of a company’s processes, sticky notes and coffee",
  agenda: [
    { at: "0:00", title: "How the company really runs", body: "Orders in, product out, money in. Who touches what, and where work waits." },
    { at: "0:20", title: "Department by department", body: "Sales and quotes, customer service, orders, purchasing, production, quality, finance, people. Every repeated task, and roughly how many hours it takes a week." },
    { at: "1:20", title: "Rank it", body: "By hours saved, by effort, and by what happens if it goes wrong. Anything that touches money or customers starts as a draft a person approves." },
    { at: "1:50", title: "Pick the first three", body: "The three automations we build first, and how we’ll measure them." },
  ],
  deliverable: "Your written Map arrives within 3 business days.",
  room: "Who should be in the room: the owner or president, whoever runs operations, and the leads for sales or customer service, and finance.",
};

export type Candidate = { task: string; how: string; hours: number };
export type Department = { id: string; name: string; image: "office" | "plant" | "warehouse" | "map" | "needle" | "exterior"; candidates: Candidate[] };

/** An example Map for a mid-size manufacturer and distributor. Illustration, labelled as one. */
export const exampleMap: { heading: string; sub: string; note: string; departments: Department[] } = {
  heading: "What a Map looks like.",
  sub: "An example for a mid-size manufacturer that sells through distributors. Turn departments on and watch the hours add up.",
  note: "Example hours. Your Map is built from your own week.",
  departments: [
    {
      id: "sales",
      name: "Sales and quotes",
      image: "office",
      candidates: [
        { task: "Technical RFQ drafts", how: "Reads each RFQ, pulls the matching specs, approvals and lead times, and drafts the reply for an engineer to check.", hours: 12 },
        { task: "Quote follow-ups", how: "Chases open quotes after 3 and 10 days, in the salesperson’s name.", hours: 4 },
      ],
    },
    {
      id: "service",
      name: "Customer and distributor service",
      image: "office",
      candidates: [
        { task: "Inbox triage", how: "Sorts every email into stock, price, order status, technical and complaint, and drafts the routine replies.", hours: 10 },
        { task: "“Where’s my order?”", how: "Looks up the order and the shipment, and answers with the tracking number.", hours: 5 },
      ],
    },
    {
      id: "orders",
      name: "Orders",
      image: "map",
      candidates: [
        { task: "Purchase order entry", how: "Reads POs from PDFs and emails, checks part numbers and prices, and stages them for entry.", hours: 11 },
        { task: "Order acknowledgements", how: "Sends each confirmation with the promised ship date.", hours: 3 },
      ],
    },
    {
      id: "purchasing",
      name: "Purchasing and inventory",
      image: "warehouse",
      candidates: [
        { task: "Supplier invoice matching", how: "Matches invoices to POs and receipts, and flags every difference.", hours: 7 },
        { task: "Low-stock note", how: "A morning note on what’s low, where it’s sitting, and what to move or reorder.", hours: 3 },
      ],
    },
    {
      id: "quality",
      name: "Quality and certificates",
      image: "needle",
      candidates: [
        { task: "Certificate packs", how: "Attaches the right calibration certificates and approvals to each order.", hours: 5 },
        { task: "Returns and complaints", how: "Logs each one, routes it, and keeps the customer updated.", hours: 2 },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      image: "office",
      candidates: [
        { task: "Overdue invoice reminders", how: "Polite reminders at 7, 14 and 30 days, stopped the moment payment lands.", hours: 3 },
        { task: "Month-end pack", how: "Collects the month’s numbers into one report for the owners.", hours: 4 },
      ],
    },
    {
      id: "production",
      name: "Production",
      image: "plant",
      candidates: [
        { task: "Morning schedule brief", how: "What’s due, what’s late and what’s missing, on the supervisor’s phone before 7.", hours: 4 },
        { task: "Shift notes", how: "Turns voice notes at the end of a shift into the shift log.", hours: 2 },
      ],
    },
    {
      id: "people",
      name: "People",
      image: "exterior",
      candidates: [
        { task: "New-hire onboarding", how: "The pack, the accounts and the first-week checklist, ready before day one.", hours: 2 },
        { task: "Handbook answers", how: "Staff ask a question; it answers from your handbook, with the page.", hours: 2 },
      ],
    },
  ],
};

export const ninetyDays = {
  heading: "Your first 90 days.",
  sub: "Nothing to install and no engineers to hire. Your team keeps working in the tools it already knows.",
  steps: [
    { when: "Week 1", title: "The Map.", body: "Two hours with your leadership. Your written Map within 3 business days." },
    { when: "Weeks 2–4", title: "The first three, live.", body: "Built on your systems, tested on real work, switched on with your team.", emphasis: "Live in the first month." },
    { when: "Months 2–3", title: "Down the Map.", body: "New automations every month. Staff trained. What’s running, watched and tuned." },
    { when: "Every month", title: "A report in hours.", body: "What ran, what it saved, what broke and what we’ll build next. One page, to the owners." },
    { when: "After 90 days", title: "Month-to-month.", body: "Keep going, or stop. Everything we built is documented and stays yours." },
  ],
};

export type ReportRow = { task: string; runs: number; before: number; after: number; wrong: string };

/** Example month-3 report. Before = that task's hours a month on the Map (weekly × 4.33). */
export const measured = {
  heading: "Measured in hours, every month.",
  sub: "Each automation is timed before and after it goes live. If one doesn’t earn its keep, we switch it off. This is the page the owners get.",
  title: "Example report · Month 3",
  rows: [
    { task: "Technical RFQ drafts", runs: 212, before: 52, after: 13, wrong: "Two drafts quoted an old lead time. Fixed the source." },
    { task: "Purchase order entry", runs: 380, before: 48, after: 10, wrong: "One handwritten change, sent to a person." },
    { task: "Inbox triage and replies", runs: 1240, before: 43, after: 11, wrong: "Nothing this month." },
    { task: "Supplier invoice matching", runs: 290, before: 30, after: 6, wrong: "Freight lines flagged as differences. Rule added." },
    { task: "“Where’s my order?” answers", runs: 410, before: 22, after: 2, wrong: "Nothing this month." },
    { task: "Quote follow-ups", runs: 160, before: 17, after: 6, wrong: "Paused for one customer, on request." },
  ] satisfies ReportRow[],
  next: "Next month: certificate packs and the morning low-stock note.",
};

export const hoursBack = (r: ReportRow) => r.before - r.after;
export const reportTotal = measured.rows.reduce((t, r) => t + hoursBack(r), 0);
/** The hero's week: each report row ÷ 4.33, rounded. */
export const weekRows = measured.rows.map((r) => ({ task: r.task, hours: Math.round(hoursBack(r) / 4.33) }));
export const weekTotal = weekRows.reduce((t, r) => t + r.hours, 0);

/** What the partnership has to beat, at an example loaded hourly cost. Peter confirms the rate. */
export const breakEven = {
  hourly: 60,
  line: (price: number, hourly: number) =>
    `${"$"}${price.toLocaleString("en-CA")} a month is about ${Math.round(price / hourly)} staff hours, at an example loaded cost of ${"$"}${hourly} an hour. The Map shows you, before month two, whether we’ll beat it.`,
};

export const trust = {
  heading: "Built for companies with history",
  imageAlt: "An old red-brick factory building on an industrial street at dawn, with the Toronto skyline behind it",
  points: [
    { title: "Your systems, your data.", body: "We work inside what you already run: Microsoft 365 or Google, your ERP, your shared drives. Nothing moves to a platform we own." },
    { title: "Nothing sends or spends on its own.", body: "Everything starts as a draft a person approves. It runs on its own only when your team agrees it has earned it." },
    { title: "One person accountable.", body: "Peter runs your account and answers the phone. No ticket queue." },
    { title: "No engineers needed.", body: "Your team uses what we build in the tools they know. We handle the rest." },
    { title: "You can stop.", body: "Month-to-month after the first 90 days. Everything is documented and stays yours." },
  ],
};

export const companyFaqs = [
  { q: "We don’t have any software people. Is that a problem?", a: "No. That’s who this is for. We build and run everything; your team uses it in the tools they already know." },
  { q: "What systems do you work with?", a: "Whatever you run: Microsoft 365 or Google Workspace, your ERP and accounting system, shared drives, website forms and inboxes. We confirm yours in the Map session." },
  { q: "Where does our data go?", a: "It stays in your company’s accounts. We use business-grade AI services under your company’s own account, with training on your data switched off, and we document every connection we make." },
  { q: "Will this replace people?", a: "It replaces the copy-and-paste part of their week. In most companies those hours go back into customers and the work only people can do." },
  { q: "How fast do we see something?", a: "The first three automations go live in the first month." },
  { q: "What if an automation gets something wrong?", a: "Everything starts as a draft a person approves. Something runs on its own only after it has been right long enough that your team agrees, and anything it gets wrong goes into that month’s report." },
  { q: "What does it cost?", a: `${partner.priceLabel} ${partner.per}, including the Map session. ${partner.termLine}. ${partner.subscriptions}` },
  { q: "We’re not that big. Is there something smaller?", a: "Yes. For an owner or a small team, the work setup is a one-time $2,000. For families, the home setup is $500." },
];

export const companyFinal = {
  heading: "Start with the two hours.",
  imageAlt: "A boardroom table in morning light with a hand-drawn process map, sticky notes and coffee",
  sub: "A 20-minute intro call first, to see if it’s a fit. Then the Map.",
};
