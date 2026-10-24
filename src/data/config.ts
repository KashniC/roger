/**
 * Everything Peter edits by hand lives here. Anything in this file ships to the
 * browser, so never put a secret or the work-balance Payment Link in it.
 *
 * Empty strings hide the element that uses them (see README → "Empty values").
 */
export const siteConfig = {
  productName: "Roger",
  domain: "https://meetroger.ai",
  founder: {
    name: "Peter",
    /** Full name for the company pages, e.g. "Peter K…". Falls back to name. */
    fullName: "" as string,
    /** A direct line for company clients, e.g. "+1 416 555 0100". Hidden while empty. */
    phone: "" as string,
    /** Three or four true lines about what Peter has built. Shown once flags.bioApproved is true. */
    bio: [
      "A background in coding education: years teaching people to build with new tools.",
    ] as string[],
    photo: "" as string, // e.g. "/peter.jpg" (square, at least 480px). Hidden while empty.
    city: "Toronto",
    links: [] as { label: string; href: string }[], // e.g. { label: "X", href: "https://x.com/…" }
  },
  contactEmail: "hello@meetroger.ai",

  prices: {
    work: 2000,
    home: 500,
    regularWork: 3000,
    regularHome: 750,
    currency: "CAD",
  },
  /** The v1 ladder. Payment links stay empty until Peter creates them; booking works now. */
  ladder: {
    setupPrice: 500,
    planPrice: 50,
    setupCheckout: "" as string, // Stripe Payment Link for the $500 setup
    planCheckout: "" as string, // Stripe Payment Link for the $50/mo plan
    setupCall: "https://cal.com/peter.k/roger-fit-call",
  },
  founding: { total: 10, spotsLeft: 10, perk: "a free 60-day tune-up session" },
  capacityLine: "We take 3 setups a week",
  speed: { fitCallDays: 1, session1Days: 2, liveDays: 5, homeSessionLeadDays: 3 },

  /** e.g. "$20–$40". Hidden while empty. */
  providerCostRange: "",
  /** Sourced Toronto admin hourly rate. The admin-cost anchor hides while 0. */
  anchor: { adminHourly: 0, source: "" },
  taxNote: "Prices in CAD. No HST is charged.",

  stripe: {
    /** Full $2,000 work setup (founding). Stripe redirects to /thanks/work. */
    workCheckout: "https://buy.stripe.com/eVq28keXBgxScuT8Zx8g00n",
    /** Full $500 home setup (founding). Stripe redirects to /thanks/home. */
    homeCheckout: "https://buy.stripe.com/14AcMY8zda9u1Qf3Fd8g00o",
    /** Swap in once founding spots hit 0. */
    workCheckoutRegular: "",
    homeCheckoutRegular: "",
  },
  cal: {
    /** Intro call for companies. Until Peter makes a dedicated event, it uses the fit call. */
    companyCall: "https://cal.com/peter.k/roger-fit-call",
    fitCall: "https://cal.com/peter.k/roger-fit-call",
    workSession1: "https://cal.com/peter.k/roger-session-1-90-minutes",
    homeSession: "https://cal.com/peter.k/roger-session-1-60-minutes",
  },
  /** Formspree (or similar) endpoints. While empty, the forms fall back to email. */
  forms: { workshopEndpoint: "", newsletterEndpoint: "" },
  /** Workshop groups whose ?code= is honoured, e.g. ["OSSINGTON"]. Stripe codes are GROUP+WORK / GROUP+HOME. */
  workshopCodes: [] as string[],

  proof: {
    counter: { setups: 0, workshops: 0, refunds: 0 },
    endorsements: [] as { org: string; person: string; title: string; quote: string; logo?: string }[],
    videos: [] as { src: string; poster: string; caption: string; captionsVtt: string; kind: "demo" | "testimonial" }[],
    screenshots: [] as { src: string; caption: string; width: number; height: number }[],
    stats: [] as { value: string; label: string }[],
    sampleReport: "", // "/sample-setup-report.pdf"
    reviewsUrl: "",
  },
  workshopHostPack: "", // "/workshop-host-pack.pdf"
  analytics: { enabled: false, provider: "plausible" as "plausible" | "ga4" },
} as const;

/**
 * Launch flags. Copy that depends on an unconfirmed fact checks its flag and
 * falls back (or hides) while it is false.
 */
export const flags = {
  legalReviewed: true,
  hstConfirmed: true,
  futurePriceCommitted: true,
  bioApproved: false,
  foundingPerkConfirmed: true,
  homeSessionLeadConfirmed: true,
  libraryVerified: false,
  /** The $10K/month partnership terms (data/company.ts) are Peter’s to confirm. */
  companyTermsConfirmed: false,
} as const;

export type SiteConfig = typeof siteConfig;
