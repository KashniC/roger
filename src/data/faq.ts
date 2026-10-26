/** What people ask about the setup. Shown on /setup and on the home page. */
export const setupFaqs = (planPrice: number) => [
  {
    q: "Which agent do you set up?",
    a: "Whichever fits you. Muse, Grok Bot, Hark and others all show up in the library. We’ll recommend one on the call and tell you why.",
  },
  {
    q: "Do I own it?",
    a: "Yes. Everything runs on your accounts. If you stop working with us, it keeps running.",
  },
  {
    q: "What about my passwords?",
    a: "You sign in yourself during the session. We don’t keep passwords, and we remove any access we used at the end.",
  },
  {
    q: "What does it cost after the setup?",
    a: `Your agent’s own subscription, paid to the provider. The $${planPrice}/month plan is optional.`,
  },
  {
    q: "Does it send or buy things on its own?",
    a: "Only where you set a rule that it can. By default it drafts and you approve.",
  },
  {
    q: "Is there a free version?",
    a: "Yes: the starter packs are free, with the instructions to set the agents up yourself.",
  },
];
