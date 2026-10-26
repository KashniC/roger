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
  trail: { time: string; text: string }[];
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
    trail: [
      { time: "6:30", text: "Ran: each morning" },
      { time: "6:31", text: "Read email, calendar and files" },
      { time: "6:32", text: "Drafted 3 replies, sent none" },
      { time: "7:12", text: "You approved the reply to Dana" },
    ],
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
    trail: [
      { time: "2:14", text: "Ran: new enquiry from Sam R." },
      { time: "2:14", text: "Read the form, calendar and email" },
      { time: "2:15", text: "Drafted a reply with two times" },
      { time: "2:40", text: "You approved; a nudge is drafted if Sam is quiet for 3 days" },
    ],
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
    trail: [
      { time: "8:00", text: "Ran: every Monday" },
      { time: "8:00", text: "Found 1 overdue, skipped 1 paid" },
      { time: "8:01", text: "Drafted a reminder in your voice" },
      { time: "9:05", text: "You approved the reminder for 1042" },
    ],
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
    trail: [
      { time: "11:02", text: "Ran: new review from Priya K." },
      { time: "11:02", text: "Read the review and your email" },
      { time: "11:03", text: "Drafted a reply naming what she said" },
      { time: "12:20", text: "You approved and posted the reply" },
    ],
  },
];
