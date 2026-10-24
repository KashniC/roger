import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ActionLink } from "@/components/action-link";
import { FaqSection } from "@/components/sections";
import { siteConfig } from "@/data/config";
import { getUseCases } from "@/lib/library-source";
import { getSettings } from "@/lib/settings";

const { setupPrice, planPrice } = siteConfig.ladder;

export const metadata: Metadata = {
  title: { absolute: `A custom agent setup, $${setupPrice} · Roger` },
  description: `Peter designs a set of AI agents for how you work, from what's actually working in the Roger library, and installs them on your own accounts with you. $${setupPrice} once, then an optional $${planPrice}/month plan.`,
  alternates: { canonical: "/setup" },
  openGraph: { url: "/setup" },
};

const steps = [
  { when: "Day 0", title: "A free 20-minute call.", body: "What eats your week, which agent you use (or should), and the setups from the library that fit. You pay once you’ve agreed the plan." },
  { when: "Within a week", title: "The setup session.", body: "Peter installs your agents on your own accounts, with you, by video. You leave with them running and a page explaining each one." },
  { when: "A week later", title: "Check-in.", body: "What worked, what didn’t, and the one or two changes that make it stick." },
];

const includes = [
  "A set of agents designed for how you work, from what's working in the library",
  "Installed on your own accounts: your email, calendar and tools",
  "A one-page guide to every agent and the rules it follows",
  "A check-in a week later",
  "Email support for 30 days",
];

const plan = [
  "New use cases from the library matched to your setup, every month",
  "Your agents kept tuned when the tools change",
  "A short monthly note: what to add next",
  "Cancel any time",
];

const faqs = [
  { q: "Which agent do you set up?", a: "Whichever fits you. Muse, Grok Bot, Hark and others all show up in the library. We’ll recommend one on the call and tell you why." },
  { q: "Do I own it?", a: "Yes. Everything runs on your accounts. If you stop working with us, it keeps running." },
  { q: "What about my passwords?", a: "You sign in yourself during the session. We don’t keep passwords, and we remove any access we used at the end." },
  { q: "What does it cost after the setup?", a: `Your agent’s own subscription, paid to the provider. The $${planPrice}/month plan is optional.` },
  { q: "Does it send or buy things on its own?", a: "Only where you set a rule that it can. By default it drafts and you approve." },
  { q: "Is there a free version?", a: "Yes: the starter packs are free, with the instructions to set the agents up yourself." },
];

async function FromUseCase({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "";
  if (!from) return null;
  const u = (await getUseCases()).find((x) => x.id === from);
  if (!u) return null;
  return (
    <p className="mt-6 max-w-[36rem] rounded-[var(--radius-inner)] border border-rule bg-surface p-4 text-small">
      <span className="text-ink-2">You came from </span>
      <a className="tlink" href={u.url} target="_blank" rel="noopener noreferrer nofollow">
        {u.title}
      </a>
      <span className="text-ink-2">. Say so on the call and we’ll start with that one.</span>
    </p>
  );
}

export default async function SetupPage({ searchParams }: PageProps<"/setup">) {
  const s = await getSettings();
  const { planCheckout } = s;
  return (
    <>
      <section aria-labelledby="hero-title" className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-16">
        <div>
          <p className="text-small font-[560] text-ink-2">Custom setup</p>
          <h1 id="hero-title" className="mt-4 max-w-[13ch] text-display text-stretch-display">
            Your agents, set up for you.
          </h1>
          <p className="mt-6 max-w-[36rem] text-lead text-ink-2">
            Peter designs a set of agents for how you work, from what’s actually working in the library, and installs them on your own accounts with you.
          </p>
          <div id="hero-cta" className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ActionLink kind="setupCall" location="setup-hero">
              Book your free setup call
            </ActionLink>
            <Link href="/packs/solopreneur" className="tlink chev">
              Or start with the free pack
            </Link>
          </div>
          <Suspense fallback={null}>
            <FromUseCase searchParams={searchParams} />
          </Suspense>
        </div>
        <div className="lit-card lit-card-calm rounded-[32px] p-7 sm:p-8">
          <p className="text-meta text-white/70">Custom setup</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-[4.5rem] font-[600] leading-none tracking-[-0.05em]">${s.setupPrice}</span>
            <span className="text-small text-white/70">once</span>
          </p>
          <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-small">
            {includes.map((i) => (
              <li key={i} className="flex gap-3">
                <svg viewBox="0 0 16 16" className="mt-[0.2em] size-4 shrink-0 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-meta text-white/65">Paid on the call, once you’ve agreed what we’ll set up.</p>
        </div>
      </section>

      <section aria-labelledby="how-title" className="border-t border-rule bg-ground-2">
        <div className="wrap py-20 md:py-28">
          <h2 id="how-title" className="text-h2">
            How it works.
          </h2>
          <ol className="mt-12 grid gap-0 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.when} className="relative border-l border-rule pb-9 pl-7 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pt-8">
                <span aria-hidden="true" className={`absolute -left-[5px] top-1 size-[9px] rounded-full md:-top-[5px] md:left-0 ${i === 0 ? "bg-ink" : "border border-rule-strong bg-ground-2"}`} />
                <p className="text-meta font-[600] text-ink-2">{s.when}</p>
                <h3 className="mt-2 text-title">{s.title}</h3>
                <p className="mt-2 text-small text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="plan" aria-labelledby="plan-title" className="on-night scroll-mt-14 bg-night text-night-ink">
        <div className="wrap grid gap-12 py-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:py-32">
          <div>
            <p className="text-small font-[600] text-night-ink-2">After your setup</p>
            <h2 id="plan-title" className="mt-2 max-w-[14ch] text-h2">
              The monthly plan.
            </h2>
            <p className="mt-4 max-w-[30rem] text-lead text-night-ink/80">Your setup keeps getting better as the library grows. Optional, and only for people who’ve had a setup.</p>
          </div>
          <div className="rounded-[var(--radius-object)] border border-night-rule bg-night-2 p-7 sm:p-9">
            <p className="flex items-baseline gap-2">
              <span className="text-h2 leading-none">${s.planPrice}</span>
              <span className="text-small text-night-ink-2">a month</span>
            </p>
            <ul className="mt-6 space-y-2.5 border-t border-night-rule pt-5 text-small">
              {plan.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#f0b88f]" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              {planCheckout ? (
                <ActionLink kind="planCheckout" location="setup-plan" size="m" tone="light">
                  Start the plan
                </ActionLink>
              ) : (
                <p className="text-small text-night-ink-2">Add it on your setup call.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <FaqSection offer="work" items={faqs} />

      <section id="final-cta" className="bg-ground">
        <div className="wrap flex flex-wrap items-end justify-between gap-8 py-24">
          <h2 className="max-w-[16ch] text-h2">Twenty minutes to find your setup.</h2>
          <ActionLink kind="setupCall" location="setup-final">
            Book your free setup call
          </ActionLink>
        </div>
      </section>
    </>
  );
}
