export const businessHero = {
  kicker: "Work setup · Toronto",
  /** A/B: swap for headlines.B or headlines.C. */
  headline: "Start every day with nothing waiting.",
  headlines: {
    B: "Close the laptop at six. Your business keeps answering.",
    C: "Stop being the bottleneck in your own business.",
  },
  sub: "We set your business up with an AI Chief of Staff and 3 helpers that answer customers, chase invoices and draft every email, on your own accounts, live within 5 days.",
  micro: "Next available: within 1 business day.",
};

/** The example window in the hero. Labelled as an example on the page. */
export const chiefWindow = {
  title: "Chief of Staff",
  day: "Monday 6:48 AM",
  greeting: "Good morning. Here’s your day, prepared.",
  nav: [
    { label: "Today", count: "" },
    { label: "Drafts", count: "23" },
    { label: "Customers", count: "6" },
    { label: "Invoices", count: "2" },
    { label: "Tasks", count: "7" },
  ],
  items: [
    { title: "23 replies drafted", detail: "Ready for your review. 9 are routine.", action: "Review" },
    { title: "Saturday’s messages answered", detail: "4 DMs and 2 emails flagged, replies drafted", action: "Open" },
    { title: "2 invoices overdue", detail: "Chased Friday. One paid at 6:12 this morning", action: "See" },
    { title: "2 meetings prepped", detail: "Briefs from your notes and last month’s numbers", action: "Read" },
  ],
  draft: {
    to: "To: Saturday booking enquiry",
    subject: "Re: Party of 8 this Saturday?",
    body: "Hi, thanks for asking. We can seat 8 at 7:30 on Saturday. I’ve held the back table until noon tomorrow; reply here to confirm and we’ll send the menu.",
    status: "Draft · waiting for you",
  },
  ask: "I can clear 9 of the routine replies before your 9:30. Want me to?",
  buttons: ["Yes, send those", "Show me first"],
};

export const exampleMonday = {
  heading: "You’re the bottleneck in your own business.",
  label: "An example Monday. An illustration, not a client result.",
  before: {
    title: "6:30 AM, catching up before you open",
    rows: [
      "Customer messages from Saturday, across email and Instagram, unanswered",
      "Two invoices overdue; you’ll chase them “later”",
      "Forty-odd unread emails",
      "You start the day behind",
    ],
  },
  after: {
    title: "6:48 AM, your brief is ready",
    rows: [
      "Every customer message flagged, with a reply drafted",
      "Overdue invoices chased Friday; one already paid",
      "Every email that needs you already has a draft",
      "You approve over coffee in about 10 minutes and open with nothing waiting",
    ],
  },
  closing: "Same business. Same tools. One less job: yours.",
};

export const workShowcase = {
  heading: "Owners are already running this way.",
  sub: "From the weekly radar of public posts. Not our clients; each one links to the original.",
  ids: ["solo-race", "cos-gmail-clean", "solo-20-calls", "cust-dms", "cos-printed-brief", "cust-drafts", "solo-rooms", "solo-backoffice"],
};

export const workWhatYouGet = {
  heading: "One Chief of Staff. Three helpers. Your accounts.",
  sub: "The Chief of Staff is always included. Pick the 3 helpers that would take the most off your plate.",
  note: "Works with the tools you already use: email, calendar, accounting, booking and messaging apps. We’ll confirm yours on the fit call.",
};

export const workTimeline = {
  heading: "Live in 5 days, with your first win in the first hour.",
  footnote: "Remote by default; in person in Toronto on request.",
  steps: [
    { when: "Day 0", title: "Fit call.", body: "20 minutes, within 1 business day of booking. If it’s a fit, you pay and book Session 1 before you hang up." },
    { when: "Day 1–2", title: "Session 1.", body: "Accounts connected, Chief of Staff live.", emphasis: "First brief and drafts within the hour." },
    { when: "Day 3–5", title: "Session 2.", body: "Your 3 helpers go live.", emphasis: "Fully live by day 5." },
    { when: "Day 5–12", title: "A full week of running.", body: "We check it’s working together, and the numbers go into your setup report." },
    { when: "Day 30", title: "Support ends, it keeps running.", body: "Email support for 30 days. Your setup report is in your inbox." },
  ],
};

export const workFinal = {
  heading: "Hand it off. Get the hours back.",
  homeDoor: {
    lead: "Setting up your home instead?",
    body: "Your family’s first assistant, doing 5 jobs you pick. Live the same day.",
    link: "See the home setup",
  },
};
