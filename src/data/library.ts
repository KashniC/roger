export type UseCaseCategory =
  | "kids"
  | "household"
  | "chief-of-staff"
  | "solo"
  | "money"
  | "travel"
  | "caregiving"
  | "errands"
  | "customers"
  | "marketing"
  | "bookkeeping"
  | "staff"
  | "shop-ops"
  | "health"
  | "learning"
  | "teams"
  | "homework";

export type Persona = "solopreneur" | "household" | "caregiving" | "business" | "everyone";

export type UseCase = {
  id: string;
  /** Our words, 70 characters at most. */
  title: string;
  /** Our words, one or two sentences. Never the post text. */
  summary: string;
  category: UseCaseCategory;
  for: "home" | "work";
  /** Plain text, no logos. Empty when the post doesn't say. */
  tool: string;
  handle: string;
  /** The original public post. */
  url: string;
  /** ISO date of the radar week it was collected in. */
  weekOf: string;
  outcome?: "win" | "honest-miss";
  menuItemId?: string;
  featured?: boolean;
  persona?: Persona;
  author?: string;
  /** When it entered the library (ISO). */
  addedAt?: string;
  source?: string;
};

export const categories: { id: UseCaseCategory; label: string; for: "home" | "work" }[] = [
  { id: "chief-of-staff", label: "Chief of Staff", for: "work" },
  { id: "money", label: "Money", for: "home" },
  { id: "marketing", label: "Marketing", for: "work" },
  { id: "solo", label: "Solo business", for: "work" },
  { id: "customers", label: "Customers", for: "work" },
  { id: "bookkeeping", label: "Bookkeeping", for: "work" },
  { id: "travel", label: "Travel", for: "home" },
  { id: "household", label: "Household", for: "home" },
  { id: "errands", label: "Errands", for: "home" },
  { id: "kids", label: "Kids", for: "home" },
  { id: "caregiving", label: "Caregiving", for: "home" },
  { id: "health", label: "Health", for: "home" },
  { id: "learning", label: "Learning", for: "home" },
  { id: "homework", label: "Homework & School", for: "home" },
  { id: "staff", label: "Staff", for: "work" },
  { id: "shop-ops", label: "Shop operations", for: "work" },
  { id: "teams", label: "Teams", for: "work" },
];

export function categoryLabel(id: UseCaseCategory) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

/**
 * Seed from the weekly X radar (spec Appendix A). Peter's Google Sheet, when
 * LIBRARY_SHEET_CSV_URL is set, is merged over this by id (see lib/library-source.ts).
 */
export const seedUseCases: UseCase[] = [
  {
    id: "kids-worksheets",
    for: "home",
    category: "kids",
    tool: "Grok Bot",
    handle: "@Teslaconomics",
    title: "A custom math sheet every morning",
    summary: "Each morning the assistant makes and prints a worksheet for each kid based on what they missed at school the day before.",
    url: "https://x.com/Teslaconomics/status/2106412651395830250",
    weekOf: "2026-09-30",
    menuItemId: "home-kids-practice",
    featured: true
  },
  {
    id: "kids-job-fair",
    for: "home",
    category: "kids",
    tool: "Muse",
    handle: "@0xFrenchie",
    title: "Spotted a job fair for a teenager",
    summary: "The assistant flagged a local job fair to a parent, which helped their kid land a job.",
    url: "https://x.com/0xFrenchie/status/2105350282141925436",
    weekOf: "2026-09-30"
  },
  {
    id: "kids-shoes-miss",
    for: "home",
    category: "kids",
    tool: "Muse",
    handle: "@ViktorBunin",
    title: "Buying kids’ shoes took 5× longer",
    summary: "An honest miss: ordering shoes through the assistant was slower than doing it by hand.",
    url: "https://x.com/ViktorBunin/status/2102781970467987949",
    weekOf: "2026-09-23",
    outcome: "honest-miss"
  },
  {
    id: "kids-twelve-agents",
    for: "home",
    category: "kids",
    tool: "Grok Bot",
    handle: "@B_doong2daddy",
    title: "Twelve assistants, one household",
    summary: "One parent runs about 12 assistants covering email, taxes, his shop, an app and the kids’ school, and shares tips for staying within limits.",
    url: "https://x.com/B_doong2daddy/status/2103570985882464744",
    weekOf: "2026-09-23"
  },
  {
    id: "kids-piano",
    for: "home",
    category: "kids",
    tool: "Muse",
    handle: "@trevin",
    title: "Found a sale on a $650 piano",
    summary: "Researched and bought a digital piano for a daughter, catching a sale and a credit-card reward.",
    url: "https://x.com/trevin/status/2102947110769574173",
    weekOf: "2026-09-23",
    menuItemId: "home-big-purchase"
  },
  {
    id: "kids-own-bot",
    for: "home",
    category: "kids",
    tool: "Grok Bot",
    handle: "@dkmitc",
    title: "A kid-safe assistant for crafts",
    summary: "A parent let his daughter build her own kid-friendly assistant for craft ideas and tutorials.",
    url: "https://x.com/dkmitc/status/2104655131350548809",
    weekOf: "2026-09-23"
  },
  {
    id: "home-meal-plan",
    for: "home",
    category: "household",
    tool: "Grok Bot",
    handle: "@griswold",
    title: "Meal plan + groceries, 2–3 hours saved weekly",
    summary: "Weekly dinners planned and the grocery cart built automatically; friends immediately asked how to get the same thing.",
    url: "https://x.com/griswold/status/2106842506281599102",
    weekOf: "2026-09-30",
    menuItemId: "home-meal-plan",
    featured: true
  },
  {
    id: "home-not-techy",
    for: "home",
    category: "household",
    tool: "Muse",
    handle: "@StockSavvyShay",
    title: "Not techy, using it daily",
    summary: "A partner with an art background, not a tech one, now uses an assistant every day.",
    url: "https://x.com/StockSavvyShay/status/2107273042867175822",
    weekOf: "2026-09-30"
  },
  {
    id: "home-cart-review",
    for: "home",
    category: "household",
    tool: "Muse",
    handle: "@koomen",
    title: "Groceries: just review the cart",
    summary: "He now only opens the grocery app to approve carts his assistant filled.",
    url: "https://x.com/koomen/status/2104347497372246476",
    weekOf: "2026-09-23",
    menuItemId: "home-meal-plan"
  },
  {
    id: "home-car-cart",
    for: "home",
    category: "household",
    tool: "Grok Bot",
    handle: "@yunta_tsai",
    title: "Change the grocery order from the car",
    summary: "Edits the grocery cart and recipes by voice while driving.",
    url: "https://x.com/yunta_tsai/status/2107127881482829875",
    weekOf: "2026-09-30",
    menuItemId: "home-meal-plan"
  },
  {
    id: "home-leave-by",
    for: "home",
    category: "travel",
    tool: "Muse",
    handle: "@brad_or_bradley",
    title: "“When do we leave for the airport?”",
    summary: "Built a small leave-by tool that uses live traffic to answer the family’s most-asked travel question.",
    url: "https://x.com/brad_or_bradley/status/2103477594003829100",
    weekOf: "2026-09-23",
    menuItemId: "home-trip"
  },
  {
    id: "home-gluten-dairy",
    for: "home",
    category: "household",
    tool: "Grok Bot",
    handle: "@ChefMcMakin",
    title: "Dinner for a gluten- and dairy-free family",
    summary: "Handles “what’s for dinner” every week within strict dietary restrictions.",
    url: "https://x.com/ChefMcMakin/status/2103686005324710051",
    weekOf: "2026-09-23",
    menuItemId: "home-meal-plan"
  },
  {
    id: "cos-gmail-clean",
    for: "work",
    category: "chief-of-staff",
    tool: "Grok Bot",
    handle: "@Teslaconomics",
    title: "2,000 emails cleaned with plain instructions",
    summary: "Connected every Gmail account and cleared 2,000+ emails; he rarely opens Gmail now.",
    url: "https://x.com/Teslaconomics/status/2107681345178923367",
    weekOf: "2026-09-30",
    menuItemId: "work-cos",
    featured: true
  },
  {
    id: "cos-car-search",
    for: "home",
    category: "chief-of-staff",
    tool: "Grok Bot",
    handle: "@ibelevy",
    title: "A car search that runs every morning",
    summary: "Searches listings daily against real rules (price, owners, mileage) and reports matches.",
    url: "https://x.com/ibelevy/status/2104645898135638426",
    weekOf: "2026-09-23",
    menuItemId: "home-big-purchase"
  },
  {
    id: "cos-tickets",
    for: "home",
    category: "errands",
    tool: "Muse",
    handle: "@anandragn",
    title: "Bought game tickets end to end",
    summary: "The assistant completed a ticket purchase from start to checkout on its own.",
    url: "https://x.com/anandragn/status/2104735064575680977",
    weekOf: "2026-09-23",
    menuItemId: "home-errands"
  },
  {
    id: "cos-receipts-pricing",
    for: "home",
    category: "money",
    tool: "",
    handle: "@joonasvirtanen",
    title: "Priced used furniture from old receipts",
    summary: "Dug through email for the original receipts to price furniture for a sale.",
    url: "https://x.com/joonasvirtanen/status/2107576046468186447",
    weekOf: "2026-09-30",
    menuItemId: "home-money-finder"
  },
  {
    id: "cos-printed-brief",
    for: "work",
    category: "chief-of-staff",
    tool: "Grok Bot",
    handle: "@GrokBotRadar",
    title: "A printed one-page brief at 6:45 AM",
    summary: "Every weekday it prints the calendar, workouts, saved links and a space to journal, so there are no screens first thing.",
    url: "https://x.com/GrokBotRadar/status/2107492546217701773",
    weekOf: "2026-09-30",
    menuItemId: "work-cos"
  },
  {
    id: "solo-rooms",
    for: "work",
    category: "solo",
    tool: "Grok Bot",
    handle: "@jacob_luetzow",
    title: "A solo company run in “rooms”",
    summary: "One founder runs separate assistant rooms for copy, calendar, growth, video, support and finance.",
    url: "https://x.com/jacob_luetzow/status/2104035001969054075",
    weekOf: "2026-09-23"
  },
  {
    id: "solo-race",
    for: "work",
    category: "solo",
    tool: "Grok Bot",
    handle: "@whemohere",
    title: "Raced his assistant for 24 hours",
    summary: "It fixed a client site, booked a kickoff, chased an overdue invoice until it was paid and cleared the inbox: “me 2, bot 12.”",
    url: "https://x.com/whemohere/status/2107540284779430149",
    weekOf: "2026-09-30",
    menuItemId: "work-invoices",
    featured: true
  },
  {
    id: "solo-backoffice",
    for: "work",
    category: "solo",
    tool: "Grok Bot",
    handle: "@Noderunner_Hex",
    title: "Back-office handed off",
    summary: "Moved the back-end business tasks to an assistant and got hours back for content.",
    url: "https://x.com/Noderunner_Hex/status/2104878919383933307",
    weekOf: "2026-09-23"
  },
  {
    id: "solo-20-calls",
    for: "work",
    category: "solo",
    tool: "Grok Bot",
    handle: "@marioleads",
    title: "20 sales calls booked in 8 days",
    summary: "The assistant handled replies and bookings for a cold-email campaign.",
    url: "https://x.com/marioleads/status/2107422285992718579",
    weekOf: "2026-09-30",
    menuItemId: "work-leads"
  },
  {
    id: "money-card-charges",
    for: "home",
    category: "money",
    tool: "Muse",
    handle: "@aripap",
    title: "Found recurring charges to cancel",
    summary: "Surfaced forgotten subscriptions on a card.",
    url: "https://x.com/aripap/status/2104934152332329150",
    weekOf: "2026-09-23",
    menuItemId: "home-bills"
  },
  {
    id: "money-650",
    for: "home",
    category: "money",
    tool: "Muse",
    handle: "@RiddhiChopra96",
    title: "$650 saved in four weeks",
    summary: "Saved $650, made $100 and won two airline refunds she hadn’t asked for.",
    url: "https://x.com/RiddhiChopra96/status/2107311976816984505",
    weekOf: "2026-09-30",
    menuItemId: "home-money-finder",
    featured: true
  },
  {
    id: "money-hotel-claims",
    for: "home",
    category: "money",
    tool: "",
    handle: "@domwhyte42",
    title: "Claimed missing hotel loyalty stays",
    summary: "Found old hotel invoices in email and filed the missing-stay claims.",
    url: "https://x.com/domwhyte42/status/2104649952026898873",
    weekOf: "2026-09-23",
    menuItemId: "home-money-finder"
  },
  {
    id: "money-gift-cards",
    for: "home",
    category: "money",
    tool: "Muse",
    handle: "@Musecases",
    title: "$1,300 in forgotten gift cards",
    summary: "Found unused gift-card balances buried in old emails.",
    url: "https://x.com/Musecases/status/2104982812680155450",
    weekOf: "2026-09-23",
    menuItemId: "home-money-finder"
  },
  {
    id: "money-insurance",
    for: "home",
    category: "money",
    tool: "Muse",
    handle: "@sophiebakalar",
    title: "Negotiated ~$6K off medical bills",
    summary: "The assistant worked with the insurer to bring hospital bills down.",
    url: "https://x.com/sophiebakalar/status/2104648180034146806",
    weekOf: "2026-09-23"
  },
  {
    id: "money-5-refund",
    for: "home",
    category: "money",
    tool: "Muse",
    handle: "@ian_finlay",
    title: "Caught a $5 short refund",
    summary: "Noticed a return refunded $28 instead of $33 and emailed the store for the difference.",
    url: "https://x.com/ian_finlay/status/2103206219599274464",
    weekOf: "2026-09-23",
    menuItemId: "home-money-finder"
  },
  {
    id: "travel-hotel-direct",
    for: "home",
    category: "travel",
    tool: "Muse",
    handle: "@Musecases",
    title: "Booking direct beat the travel sites",
    summary: "Compared the hotel’s own site with the big travel sites: direct was 5–10% cheaper, with free cancellation and a credit.",
    url: "https://x.com/Musecases/status/2102882449554395317",
    weekOf: "2026-09-23",
    menuItemId: "home-trip"
  },
  {
    id: "care-scam-guard",
    for: "home",
    category: "caregiving",
    tool: "Muse / Instinct",
    handle: "@citrini",
    title: "A scam guard for your parents",
    summary: "Set parents up with an assistant that warns them about phishing, impersonation and invoice fraud.",
    url: "https://x.com/citrini/status/2104701820828529089",
    weekOf: "2026-09-23",
    menuItemId: "home-scam-guard",
    featured: true
  },
  {
    id: "errand-upgrades",
    for: "home",
    category: "errands",
    tool: "Muse",
    handle: "@rajeshsawhney",
    title: "Watches for upgrades and tough reservations",
    summary: "Monitors a seat map for free upgrades and checks a hard-to-get reservation every 30 minutes.",
    url: "https://x.com/rajeshsawhney/status/2102624529617211631",
    weekOf: "2026-09-23",
    menuItemId: "home-errands"
  },
  {
    id: "errand-oil-change",
    for: "home",
    category: "errands",
    tool: "",
    handle: "@desertdonkey31",
    title: "Booked an oil change from a screenshot",
    summary: "Took a coupon ad screenshot, booked the service and added it to the calendar.",
    url: "https://x.com/desertdonkey31/status/2106390784702320671",
    weekOf: "2026-09-30",
    menuItemId: "home-errands"
  },
  {
    id: "cust-dms",
    for: "work",
    category: "customers",
    tool: "",
    handle: "@robinstetic",
    title: "No more missed customer DMs",
    summary: "Checks the inbox and three messaging platforms every morning and flags anything missed.",
    url: "https://x.com/robinstetic/status/2104588353920500173",
    weekOf: "2026-09-23",
    menuItemId: "work-customers"
  },
  {
    id: "cust-drafts",
    for: "work",
    category: "customers",
    tool: "Grok Bot",
    handle: "@crisships",
    title: "Leads don’t go cold",
    summary: "Reads the inbox each morning and drafts replies to the emails that need the owner.",
    url: "https://x.com/crisships/status/2107480634730188976",
    weekOf: "2026-09-30",
    menuItemId: "work-customers"
  }
];
