import type { UseCaseCategory } from "./library";

export type MenuItem = {
  id: string;
  title: string;
  /** The headline: what life looks like once it runs. */
  outcome: string;
  /** One line on how. */
  how: string;
  libraryCategory: UseCaseCategory;
};

export const chiefOfStaff = {
  id: "work-cos",
  title: "Chief of Staff",
  outcome: "The day starts handled.",
  points: [
    "Morning brief before 7am: open loops from email, calendar and tasks.",
    "Every email starts as a draft, with your availability checked and attachments found.",
    "One task list, where the assistant logs what it's stuck on.",
    "After meetings, decisions and follow-ups go onto the list.",
  ],
} as const;

/** Work helpers: pick 3 of 8. */
export const workHelpers: MenuItem[] = [
  { id: "work-customers", title: "Customer messages", outcome: "No customer waits until Monday.", how: "Checks the inbox and every DM platform each morning, flags anything missed and drafts replies.", libraryCategory: "customers" },
  { id: "work-invoices", title: "Invoices and bookkeeping", outcome: "Get paid without chasing.", how: "Creates invoices, chases overdue ones and files receipts.", libraryCategory: "bookkeeping" },
  { id: "work-scheduling", title: "Scheduling and bookings", outcome: "A full calendar without the back-and-forth.", how: "Books, confirms, reschedules and fills cancellations.", libraryCategory: "customers" },
  { id: "work-leads", title: "Lead follow-up", outcome: "Every lead hears back the same day.", how: "Drafts replies and books calls.", libraryCategory: "solo" },
  { id: "work-social", title: "Social and reviews", outcome: "Show up online without giving up your evenings.", how: "Drafts posts and replies to Google reviews.", libraryCategory: "marketing" },
  { id: "work-staff", title: "Staff and shifts", outcome: "Shift swaps sorted without you in the middle.", how: "Shift schedules, swaps and onboarding documents.", libraryCategory: "staff" },
  { id: "work-suppliers", title: "Suppliers and inventory", outcome: "Never run out of what sells.", how: "Reorder reminders and supplier emails.", libraryCategory: "shop-ops" },
  { id: "work-numbers", title: "Weekly numbers", outcome: "Know where you stand by Monday at 8.", how: "A one-pager of sales, bookings and cash in, pulled from your tools.", libraryCategory: "bookkeeping" },
];

/** Home jobs: pick 5 of 12. */
export const homeJobs: MenuItem[] = [
  { id: "home-meal-plan", title: "Meal plan", outcome: "Never answer “what’s for dinner?” again.", how: "Dinners planned around your calendar; the cart built with your brands.", libraryCategory: "household" },
  { id: "home-family-brief", title: "Family brief", outcome: "Everyone out the door on time.", how: "Who’s where, what’s due and the weather, before breakfast.", libraryCategory: "chief-of-staff" },
  { id: "home-school-digest", title: "School digest", outcome: "Never miss a form or a pizza day.", how: "Forms, dates and deadlines pulled out of the school emails.", libraryCategory: "kids" },
  { id: "home-inbox", title: "Inbox clean-up", outcome: "An inbox you’re not afraid to open.", how: "Years of clutter sorted, then a daily triage.", libraryCategory: "chief-of-staff" },
  { id: "home-bills", title: "Bill check", outcome: "Stop paying for things you don’t use.", how: "Finds recurring charges you forgot about.", libraryCategory: "money" },
  { id: "home-money-finder", title: "Money finder", outcome: "Find money you’re already owed.", how: "Refunds, gift-card balances and loyalty claims buried in old email.", libraryCategory: "money" },
  { id: "home-maintenance", title: "Home maintenance", outcome: "Know your filter size without climbing into the basement.", how: "Photograph each appliance once; get manuals, schedules and parts.", libraryCategory: "household" },
  { id: "home-errands", title: "Errands and bookings", outcome: "Appointments booked from a screenshot.", how: "Oil changes, appointments and reservations.", libraryCategory: "errands" },
  { id: "home-trip", title: "Trip planning", outcome: "Better trips, less tab-hopping.", how: "Compares prices; builds the itinerary and leave-by alerts.", libraryCategory: "travel" },
  { id: "home-scam-guard", title: "Scam guard", outcome: "Peace of mind about Mom’s inbox.", how: "Flags phishing, impersonation and fake invoices.", libraryCategory: "caregiving" },
  { id: "home-kids-practice", title: "Kids’ practice", outcome: "Practice that matches what they missed today.", how: "A custom worksheet each morning.", libraryCategory: "kids" },
  { id: "home-big-purchase", title: "Big-purchase search", outcome: "The right deal finds you.", how: "Searches every morning against your rules (e.g. a car under $35K).", libraryCategory: "chief-of-staff" },
];

export const allMenuItems = [...workHelpers, ...homeJobs];

export function menuTitle(id: string) {
  if (id === chiefOfStaff.id) return chiefOfStaff.title;
  return allMenuItems.find((m) => m.id === id)?.title ?? id;
}
