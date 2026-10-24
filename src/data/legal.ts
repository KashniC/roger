import { siteConfig } from "./config";

export type LegalDoc = { title: string; intro: string; sections: { heading: string; body: string[] }[]; updated: string };

const email = siteConfig.contactEmail;

export const terms: LegalDoc = {
  title: "Terms",
  updated: "October 2026",
  intro:
    "These terms cover the setups we sell on this site. We’ve kept them short and plain. “We”, “us” and “our” means Roger, run from Toronto, Ontario. “You” means the person or business buying a setup.",
  sections: [
    {
      heading: "What you are buying",
      body: [
        "A setup service. We set up an AI assistant on your own accounts and connect it to the tools you choose, as described on the page you bought from. Your receipt and that page together describe what is included.",
        "It’s a service, not software we own or host. Once it’s set up, the assistant and its accounts are yours.",
      ],
    },
    {
      heading: "Your accounts and the assistant’s provider",
      body: [
        "The assistant runs on your own account with a third-party AI provider. You pay that provider directly, under its own terms. We don’t control its prices, its uptime or how it changes its product.",
        "You decide what we can access during setup, and you can remove our access at any time.",
      ],
    },
    {
      heading: "Payment",
      body: ["Prices are in Canadian dollars and paid through Stripe. Both the work setup and the home setup are paid in full when you book. No HST is charged."],
    },
    {
      heading: "The guarantee",
      body: [
        "If your setup isn’t working within the guarantee window, you get your money back. The Refunds page sets out exactly what “working” means and how to claim. It’s the whole policy.",
      ],
    },
    {
      heading: "What the assistant does, and what you still check",
      body: [
        "AI assistants make mistakes. Read anything important before you rely on it or send it, especially anything about money, health, allergies, legal matters or your customers.",
        "You are responsible for what is sent from your accounts and for following the rules that apply to your business, like privacy and anti-spam law.",
      ],
    },
    {
      heading: "Limits",
      body: [
        "As far as the law allows, our total responsibility for anything to do with a setup is limited to what you paid us for it. We’re not responsible for losses caused by the AI provider, your other tools, or how the assistant’s output is used.",
        "Nothing here takes away rights you have under consumer protection law that cannot be waived.",
      ],
    },
    {
      heading: "Changes and the law that applies",
      body: [
        "If we change these terms, the version on this page when you paid applies to your setup.",
        "These terms are governed by the laws of Ontario and the federal laws of Canada that apply there.",
      ],
    },
    { heading: "Questions", body: [`Email us at ${email}.`] },
  ],
};

export const privacy: LegalDoc = {
  title: "Privacy",
  updated: "October 2026",
  intro: "Roger is run from Toronto. We’re responsible for the personal information this site collects. Here is all of it, in plain language.",
  sections: [
    {
      heading: "What the forms collect",
      body: [
        "The newsletter form collects your email address and which page you signed up from (business or home).",
        "The workshop request form collects what you type into it: your organisation, name, email, phone, group type, expected size, preferred month, in person or Zoom, and any notes.",
        "Both forms also send the campaign tags from the link you arrived on, if it had any (like utm_source=newsletter), so we know which link brought you. Forms are delivered to us by a form service, Formspree.",
      ],
    },
    {
      heading: "Payments and bookings",
      body: [
        "Payments are handled by Stripe and bookings by Cal.com, each under its own privacy policy. We never see your card number.",
        "From Stripe we receive what you enter at checkout, like your name, email, phone and, for a work setup, your business name. From Cal.com we receive what you enter when you book. The checkout and booking links also carry the helpers or jobs you picked, a workshop code if you have one, and the campaign tag you arrived with.",
      ],
    },
    { heading: "Analytics", body: ["This site doesn’t run analytics right now. If we turn it on, this page will say so first."] },
    {
      heading: "What stays in your browser",
      body: [
        "The site keeps your picks, any workshop code and your campaign tags in your browser’s session storage so they carry through to checkout. They stay in that tab only and are cleared when you close it. The site itself sets no cookies.",
      ],
    },
    {
      heading: "What we do with it",
      body: [
        "We use it to reply to you, run your setup, send the newsletter you asked for, and see which links bring people here. We don’t sell or rent your personal information, and we share it only with the services named on this page that run the site.",
        "You can unsubscribe from the newsletter at any time. You can ask us what we hold about you, or ask us to correct or delete it, by email.",
      ],
    },
    { heading: "Questions", body: [`Email us at ${email}.`] },
  ],
};

export const refunds: LegalDoc = {
  title: "Refunds and the guarantee",
  updated: "October 2026",
  intro: "Every setup comes with a guarantee: if it isn’t working, you get your money back. This is exactly what that means.",
  sections: [
    {
      heading: "What “working” means",
      body: [
        "Working means every helper or job you picked has run on its own at least once and produced output you would use.",
        "It’s checked together at the end of the week of running (work) or at day 7 (home), and recorded in your setup report.",
        "If we disagree, you decide.",
      ],
    },
    {
      heading: "The windows",
      body: ["14 days from Session 1 for a work setup, or from your session for a home setup. The refund is the full amount you paid."],
    },
    {
      heading: "How to claim",
      body: [
        `Send us one email at ${email} within the window. Say which setup it’s for. You don’t need to argue your case: if we disagree about whether it’s working, you decide.`,
        "We refund to the original card through Stripe within 10 business days.",
      ],
    },
    { heading: "Your accounts", body: ["When a refund happens, you keep your accounts. We remove our access."] },
    { heading: "Questions", body: [`Email us at ${email}.`] },
  ],
};
