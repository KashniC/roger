import type { UseCaseCategory } from "./library";

export type Agent = {
  id: string;
  name: string;
  does: string;
  connect: string[];
  /** A starting instruction to paste into the agent. */
  prompt: string;
  /** Library shelves with real examples of this agent at work. */
  categories: UseCaseCategory[];
};

export type Pack = {
  id: string;
  persona: string;
  title: string;
  status: "live" | "soon";
  blurb: string;
  agents: Agent[];
};

/** Free starter packs. The solopreneur pack is live; the others measure interest. */
export const packs: Pack[] = [
  {
    id: "solopreneur",
    persona: "Solopreneur",
    title: "Ten agents for a business of one",
    status: "live",
    blurb: "The ten setups that show up most often in the library for people who run everything themselves. Works with Muse, Grok Bot, Hark or any agent that can read your email and calendar.",
    agents: [
      {
        id: "brief",
        name: "Morning brief",
        does: "Before 7am: today’s calendar, the emails that need you, what’s overdue, and one thing to do first.",
        connect: ["Email", "Calendar", "Task list"],
        prompt: "Every weekday at 6:45, send me a one-screen brief: today’s meetings with a line of context each, emails that need a reply from me, anything overdue, and the one task I should do first. Keep it under 150 words.",
        categories: ["chief-of-staff"],
      },
      {
        id: "inbox",
        name: "Inbox drafts",
        does: "Every email that needs you already has a reply drafted, with your availability checked and attachments found.",
        connect: ["Email", "Calendar", "Files"],
        prompt: "Each morning, draft replies to every email that needs me. Check my calendar before proposing times, attach files I mention, and leave the drafts unsent for me to approve.",
        categories: ["chief-of-staff", "customers"],
      },
      {
        id: "leads",
        name: "Lead follow-up",
        does: "Every new enquiry hears back the same day, and quiet ones get a polite nudge after three days.",
        connect: ["Email", "Website form", "Calendar"],
        prompt: "When a new enquiry arrives, draft a reply the same day with two times I’m free. If they haven’t answered in three days, draft one short follow-up. Never send without my approval.",
        categories: ["solo", "customers"],
      },
      {
        id: "invoices",
        name: "Invoice chaser",
        does: "Invoices go out on time, and overdue ones get friendly reminders until they’re paid.",
        connect: ["Accounting app", "Email"],
        prompt: "Every Monday, list invoices that are 7, 14 or 30 days overdue and draft a friendly reminder for each, in my voice. Stop the moment one is paid.",
        categories: ["bookkeeping", "money"],
      },
      {
        id: "receipts",
        name: "Receipt filer",
        does: "Receipts from email are filed, named and matched to the right expense category for tax time.",
        connect: ["Email", "Files", "Accounting app"],
        prompt: "Find every receipt in my email, save it to my Receipts folder as date-vendor-amount, and tag the expense category. Send me a monthly total by category.",
        categories: ["bookkeeping", "money"],
      },
      {
        id: "subscriptions",
        name: "Subscription audit",
        does: "Finds recurring charges you forgot about and flags them before they renew.",
        connect: ["Email", "Card statements"],
        prompt: "Look through the last 12 months of receipts and statements for recurring charges. List each with its price and last use, and warn me three days before any of them renews.",
        categories: ["money"],
      },
      {
        id: "content",
        name: "Weekly content",
        does: "Three post drafts a week from what you actually did, in your voice, ready to approve.",
        connect: ["Notes", "Calendar", "Social accounts"],
        prompt: "Every Friday, read my notes and calendar from the week and draft three short posts about real work I did. Match my past posts’ tone. Don’t publish anything.",
        categories: ["marketing"],
      },
      {
        id: "reviews",
        name: "Review replies",
        does: "Every new review gets a thoughtful reply drafted within a day.",
        connect: ["Google Business Profile", "Email"],
        prompt: "When a new review comes in, draft a reply: thank them by name, mention something specific they said, and for anything critical, offer to fix it offline.",
        categories: ["marketing", "customers"],
      },
      {
        id: "meetings",
        name: "Meeting follow-through",
        does: "After every call, the decisions and next steps land on your task list, with a recap email drafted.",
        connect: ["Calendar", "Notes or recorder", "Task list", "Email"],
        prompt: "After each meeting, pull the decisions and action items from my notes, add mine to my task list with due dates, and draft a short recap email to the attendees.",
        categories: ["chief-of-staff"],
      },
      {
        id: "numbers",
        name: "Monday numbers",
        does: "A one-pager every Monday: money in, money owed, bookings, and how it compares with last week.",
        connect: ["Accounting app", "Bank", "Calendar"],
        prompt: "Every Monday at 8, send me one page: money in last week, invoices outstanding, bookings this week, and the change from the week before. No charts, just numbers and one sentence on what stands out.",
        categories: ["bookkeeping", "solo"],
      },
    ],
  },
  { id: "household", persona: "Household", title: "Agents for running a home", status: "soon", blurb: "Meals, school emails, bills and errands.", agents: [] },
  { id: "caregiving", persona: "Caregiving", title: "Agents for looking after a parent", status: "soon", blurb: "Appointments, medications and a scam guard.", agents: [] },
  { id: "small-team", persona: "Small team", title: "Agents for a team of five to twenty", status: "soon", blurb: "Shared inboxes, scheduling and handovers.", agents: [] },
];

export const livePack = packs.find((p) => p.status === "live")!;
