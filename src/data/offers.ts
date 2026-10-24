import { siteConfig } from "./config";
import { money, offerNow, type OfferId } from "@/lib/offer";

const work = offerNow("work");
const home = offerNow("home");

export const working =
  "Every helper or job you picked has run on its own at least once and produced something you’d actually use. We check it together, and it’s written into your setup report. If we disagree, you decide.";

export const pricing: Record<
  OfferId,
  {
    heading: string;
    sub: string;
    name: string;
    includes: { text: string; strong?: boolean }[];
    speed: string;
    guarantee: string;
  }
> = {
  home: {
    heading: "One price, everything it takes to get it working.",
    sub: "Paid once. Your assistant keeps running on your own account after we hand it over.",
    name: "Home setup",
    includes: [
      { text: "60-minute session, by video or in person in Toronto" },
      { text: "Your first assistant, chosen for you, doing 5 jobs you pick", strong: true },
      { text: "Setup report: what it does, the rules it follows, what to try next" },
      { text: "Day-7 check-in" },
      { text: "30 days of email support" },
      { text: "Founding bonus: a 60-day tune-up session" },
    ],
    speed: "Session within 3 business days of payment · live the same day",
    guarantee: `Working within 14 days, or a full ${home.priceLabel} refund`,
  },
  work: {
    heading: "One setup, priced once.",
    sub: "Paid in full to book. Your assistants keep running on your own accounts after we hand them over.",
    name: "Work setup",
    includes: [
      { text: "Free 20-minute fit call" },
      { text: "Two sessions: Chief of Staff first, then your helpers" },
      { text: "Chief of Staff + 3 helpers, on your own accounts", strong: true },
      { text: "Setup report with your before and after numbers", strong: true },
      { text: "30 days of email support" },
      { text: "Founding bonus: a 60-day tune-up session" },
    ],
    speed: "Fit call within 1 business day · live within 5 days",
    guarantee: `Working within 14 days of Session 1, or a full ${work.priceLabel} refund`,
  },
};

export const guarantee: Record<OfferId, { heading: string; body: string; claim: string; accounts: string }> = {
  home: {
    heading: "Working, or you pay nothing.",
    body: `If your assistant isn’t doing your 5 jobs within 14 days of your session, we refund the full ${home.priceLabel}. If we disagree on whether it’s working, you decide.`,
    claim: "One email. No forms, no questions about why.",
    accounts: "Your accounts stay yours. We never keep your passwords, and we remove our access when we’re done.",
  },
  work: {
    heading: "Working, or you pay nothing.",
    body: `You pay ${work.priceLabel} to book. If your Chief of Staff and 3 helpers aren’t working within 14 days of Session 1, we refund the full ${work.priceLabel}.`,
    claim: "One email. No forms, no questions about why.",
    accounts: "Your accounts stay yours. We never keep your passwords, and we remove our access when we’re done.",
  },
};

export const providerLine =
  "You’ll also subscribe to the assistant itself (for example Grok Bot, Muse or Hark), paid directly to that provider" +
  (siteConfig.providerCostRange ? `, usually ${siteConfig.providerCostRange} a month` : "") +
  ". We recommend the plan; our setup is a separate line item.";

export const diy: Record<OfferId, { label: string; diy: string; roger: string }[]> = {
  home: [
    { label: "Cost", diy: "Your assistant’s subscription", roger: `${home.priceLabel} once, plus the same subscription` },
    { label: "Choosing an assistant", diy: "You compare them", roger: "We pick, and tell you why" },
    { label: "Connecting email and calendar", diy: "Your evenings, trial and error", roger: "Done in your session" },
    { label: "Time to working", diy: "Usually weeks", roger: "The same day" },
    { label: "When something breaks in week 1", diy: "Forums", roger: "Us, for 30 days" },
    { label: "If it doesn’t work", diy: "Your time is gone", roger: "You pay nothing" },
  ],
  work: [
    { label: "Cost", diy: "Your assistant’s subscription", roger: `${work.priceLabel} once, plus the same subscription` },
    { label: "Choosing an assistant", diy: "You compare them", roger: "We pick, and tell you why" },
    { label: "Connecting email, calendar, tools", diy: "Your evenings, trial and error", roger: "Done in Session 1" },
    { label: "Time to live", diy: "Usually weeks", roger: "5 days" },
    { label: "When something breaks in week 1", diy: "Forums", roger: "Us, for 30 days" },
    { label: "If it doesn’t work", diy: "Your time is gone", roger: "You pay nothing" },
  ],
};

export const wontDo: Record<OfferId, string[]> = {
  work: [
    "We won’t set up anything that sends money or messages on its own unless you write the rule.",
    "We won’t promise a task the assistant can’t do reliably yet. If it’s shaky, we’ll tell you on the fit call.",
    "We won’t keep your passwords.",
  ],
  home: [
    "We won’t set up anything that buys, pays or sends on its own unless you write the rule.",
    "We won’t promise a job the assistant can’t do reliably yet. If one you picked is shaky, we’ll tell you before we set it up.",
    "We won’t keep your passwords.",
  ],
};

export const about = {
  heading: "Set up by Peter, in Toronto.",
  body: "Peter runs his own week with an AI Chief of Staff and a few helpers. Roger is how he sets up the same thing for Toronto families and small businesses: on your accounts, with the tools you already use, working within days.",
};

export type Faq = { q: string; a: string };

const shared = {
  own: { q: "Do I own it?", a: "Yes. It runs on your accounts. If we stop working together, everything keeps running." },
  passwords: {
    q: "What about passwords and private information?",
    a: "You sign in yourself during the session. We don’t store passwords, and we remove our access at handover.",
  },
  remote: { q: "Remote or in person?", a: "Remote by default. In person anywhere in Toronto on request." },
  hst: { q: "Do you charge HST?", a: siteConfig.taxNote },
};

export const faqs: Record<OfferId, Faq[]> = {
  home: [
    { q: "Which AI do you use?", a: "Whichever fits your family. We’re not tied to one company. We’ll recommend one in your session and tell you why." },
    shared.own,
    {
      q: "What does it cost after setup?",
      a: `Only your assistant’s own subscription, paid directly to the provider${siteConfig.providerCostRange ? ` (usually ${siteConfig.providerCostRange} a month)` : ""}. We recommend the plan; you never pay us for it.`,
    },
    shared.passwords,
    { q: "Does it buy or send things without asking?", a: "Only if you set a rule that it can. By default it drafts and you approve. Nothing is ordered until you’ve checked the cart." },
    {
      q: "We have allergies and picky eaters. Will the meal plan cope?",
      a: "Yes. We write your family’s rules into the plan in the session: allergies, dislikes, the dinners that always work. Still check labels yourself; assistants can make mistakes.",
    },
    {
      q: "Do I need a grocery delivery account?",
      a: "It helps. The assistant builds the cart in the grocery app you already use for pickup or delivery. If you don’t use one, it sends a shopping list instead.",
    },
    { q: "Can my partner use it too?", a: "Yes. We can set it up so you both get the brief and can ask it things. We’ll sort out who sees what in the session." },
    { q: "What if it doesn’t work?", a: `${guarantee.home.body} How to claim: one email. No forms, no questions about why.` },
    shared.remote,
    shared.hst,
  ],
  work: [
    { q: "Which AI do you use?", a: "Whichever fits your business. We’re not tied to one company. We’ll recommend one on the fit call and tell you why." },
    shared.own,
    {
      q: "What does it cost after setup?",
      a: `Your assistant’s own subscription, paid directly to the provider${siteConfig.providerCostRange ? ` (usually ${siteConfig.providerCostRange} a month)` : ""}. Care plans are available if you want us to keep tuning it.`,
    },
    { q: "What about my passwords and customer data?", a: "You sign in yourself during our session. We don’t store passwords, and we remove our access at handover." },
    { q: "Does it send things without asking?", a: "Only if you set a rule that it can. By default it drafts, and you approve." },
    { q: "What if it doesn’t work?", a: `${guarantee.work.body} What “working” means: ${working}` },
    {
      q: "What if I skip the call?",
      a: `The first 15 minutes of Session 1 is the fit check. If we can’t help, you get the full ${work.priceLabel} back.`,
    },
    { q: "Can my staff use it?", a: "Yes. Helpers can serve your team. We’ll set out who sees what in Session 1." },
    shared.remote,
    shared.hst,
  ],
};

export { money };
