/** The v1 offer ladder (Peter's strategy brief, Oct 21). Prices are hypotheses to test. */
export const ladderFor = (prices: { setupPrice: number; planPrice: number }) => ({
  heading: "Do it yourself, or have it done for you.",
  rungs: [
    {
      step: "Start here",
      name: "Starter pack",
      price: "Free",
      per: "",
      body: "Ten agents to set up yourself, with the instructions to paste in. Solopreneurs first.",
      cta: "Get the free pack",
      href: "/packs/solopreneur",
      includes: ["Ten agents, each with the instruction to paste in", "Three open now, the rest with your email", "Works with Muse, Grok Bot, Hark or any agent that can read your email and calendar"],
    },
    {
      step: "Most people",
      name: "Custom setup",
      price: `$${prices.setupPrice}`,
      per: "once",
      body: "Peter designs your set of agents from the library and installs them on your own accounts, with you, in one session.",
      cta: "Book a custom setup",
      href: "/setup",
      includes: ["A set of agents designed from what’s working in the library", "Installed on your own accounts, with you, by video", "A one-page guide to every agent and the rules it follows", "A check-in a week later, and email support for 30 days"],
    },
    {
      step: "After setup",
      name: "Monthly plan",
      price: `$${prices.planPrice}`,
      per: "a month",
      body: "New use cases matched to how you work, every month, and your agents kept tuned as the tools change.",
      cta: "How the plan works",
      href: "/setup#plan",
      includes: ["New use cases from the library matched to your setup", "Your agents kept tuned when the tools change", "A short monthly note: what to add next", "Cancel any time"],
    },
  ],
});
