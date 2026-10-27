/**
 * The home page's agent walkthrough. Four agents from the free solopreneur
 * pack, each followed from the moment it runs to the moment you approve.
 * Names, emails and times are made up and the page labels them as an
 * illustration; the instruction shown with each is the pack's real one.
 */
export type DemoScenario = {
  /** An agent id from the solopreneur pack (data/packs.ts). */
  agentId: string;
  runs: { when: string; detail: string; event?: { from: string; text: string } };
  reads: { icon: "mail" | "calendar" | "file" | "receipt" | "globe" | "star"; source: string; text: string }[];
  draft: { to: string; subject: string; body: string };
  rule: string;
};

export const demoSteps = [
  { id: "runs", label: "It runs", line: "On a schedule or when something arrives." },
  { id: "reads", label: "It reads", line: "Only the accounts you connected." },
  { id: "drafts", label: "It drafts", line: "In your voice, with the details checked." },
  { id: "waits", label: "It waits for you", line: "Nothing goes out on its own." },
  { id: "approve", label: "You approve", line: "Then it goes, from your own account." },
] as const;

export type DemoStepId = (typeof demoSteps)[number]["id"];

export const demoScenarios: DemoScenario[] = [
  {
    agentId: "inbox",
    runs: { when: "Each morning", detail: "6:30 am, before you’re up" },
    reads: [
      { icon: "mail", source: "Email", text: "14 new overnight · 3 need you" },
      { icon: "calendar", source: "Calendar", text: "Free Thursday, 2 to 4 pm" },
      { icon: "file", source: "Files", text: "Found “Spring price list.pdf”" },
    ],
    draft: {
      to: "Dana, Northside Florist",
      subject: "Re: Order for the 14th",
      body: "Hi Dana, yes, the 14th works. I’m free Thursday between 2 and 4 if you’d like to go over the arrangements, and I’ve attached our spring price list.",
    },
    rule: "Leaves every draft unsent for you to approve",
  },
  {
    agentId: "leads",
    runs: {
      when: "When an enquiry arrives",
      detail: "Your website form, 2:14 pm",
      event: { from: "Sam R. via your website", text: "Do you have any availability in May?" },
    },
    reads: [
      { icon: "globe", source: "Website form", text: "New enquiry from Sam R." },
      { icon: "calendar", source: "Calendar", text: "Free Tue 10 am and Wed 3 pm" },
      { icon: "mail", source: "Email", text: "No earlier thread with Sam" },
    ],
    draft: {
      to: "Sam R.",
      subject: "Re: Availability in May",
      body: "Hi Sam, thanks for getting in touch. I’d be glad to talk it through. Would Tuesday at 10 am or Wednesday at 3 pm work for a quick call?",
    },
    rule: "Never sends without your approval",
  },
  {
    agentId: "invoices",
    runs: { when: "Every Monday", detail: "Checks for 7, 14 and 30 days overdue" },
    reads: [
      { icon: "receipt", source: "Accounting app", text: "Invoice 1042 · 14 days overdue" },
      { icon: "receipt", source: "Accounting app", text: "Invoice 1038 · paid Sunday, skipped" },
      { icon: "mail", source: "Email", text: "Your last few reminders, for tone" },
    ],
    draft: {
      to: "Accounts, Harbour Studio",
      subject: "Invoice 1042, a friendly reminder",
      body: "Hi there, a gentle reminder that invoice 1042 was due two weeks ago. I’ve attached it again here. Just let me know if anything’s needed from my side.",
    },
    rule: "Stops the moment an invoice is paid",
  },
  {
    agentId: "reviews",
    runs: {
      when: "When a review comes in",
      detail: "Google Business Profile, 11:02 am",
      event: { from: "Priya K. · 4 stars", text: "Lovely service, just a bit of a wait." },
    },
    reads: [
      { icon: "star", source: "Google Business Profile", text: "New 4-star review from Priya K." },
      { icon: "mail", source: "Email", text: "No open conversation with Priya" },
    ],
    draft: {
      to: "Reply to Priya K.",
      subject: "Public reply on your profile",
      body: "Thanks so much, Priya. We’re glad you enjoyed it, and sorry about the wait. If you’d like to tell us more, email us and we’ll make it right.",
    },
    rule: "Drafts the reply; you’re the one who posts it",
  },
];
