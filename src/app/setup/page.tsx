import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Suspense } from "react";
import { ActionLink } from "@/components/action-link";
import { FaqSection } from "@/components/sections";
import { siteConfig } from "@/data/config";
import { credits } from "@/data/credits";
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
  {
    when: "Day 0",
    title: "A free 20-minute call.",
    body: "What eats your week, which agent you use (or should), and the setups from the library that fit. You pay once you’ve agreed the plan.",
  },
  {
    when: "Within a week",
    title: "The setup session.",
    body: "Peter installs your agents on your own accounts, with you, by video. You leave with them running and a page explaining each one.",
  },
  {
    when: "A week later",
    title: "Check-in.",
    body: "What worked, what didn’t, and the one or two changes that make it stick.",
  },
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

async function FromUseCase({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "";
  if (!from) return null;
  const u = (await getUseCases()).find((x) => x.id === from);
  if (!u) return null;
  return (
    <p className="mt-6 max-w-[36rem] rounded-[8px] bg-ground-2 p-4 text-small">
      You came from{" "}
      <a
        className="tlink"
        href={u.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {u.title}
      </a>
      . Say so on the call and we’ll start with that one.
    </p>
  );
}

/** A sample page from the guide every setup ends with. */
function GuideSample() {
  return (
    <figure>
      <div
        data-ui
        className="rounded-[8px] bg-surface p-6 text-[0.9375rem] sm:p-7 lg:-mr-7"
      >
        <p className="text-[0.8125rem] font-[600] text-ink-2">
          Your agents · page 1 of 6
        </p>
        <p className="mt-3 text-[1.25rem] font-[620] tracking-[-0.02em]">
          Morning brief
        </p>
        <dl className="mt-4 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-2">
          <dt className="text-ink-2">Runs</dt>
          <dd>Weekdays at 6:45am</dd>
          <dt className="text-ink-2">Reads</dt>
          <dd>Your email, calendar and task list</dd>
          <dt className="text-ink-2">Sends you</dt>
          <dd>
            One screen: meetings, replies owed, what’s overdue, one thing first
          </dd>
          <dt className="text-ink-2">Never</dt>
          <dd>Replies, books or pays on its own</dd>
          <dt className="text-ink-2">To change it</dt>
          <dd>Tell it in plain words: “skip Fridays”</dd>
        </dl>
      </div>
      <figcaption className="mt-3 text-small text-ink-2">
        A sample page from the guide you keep after the session.
      </figcaption>
    </figure>
  );
}

/** The monthly plan's note: library finds matched to one setup. */
function MonthlyNote({
  picks,
}: {
  picks: { title: string; handle: string }[];
}) {
  return (
    <figure>
      <div
        data-ui
        className="rounded-[8px] bg-night-2 p-6 text-[0.9375rem] text-night-ink sm:p-7 lg:-mr-7"
      >
        <p className="text-[0.8125rem] text-night-ink-2">From Peter · to you</p>
        <p className="mt-2 text-[1.125rem] font-[600] tracking-[-0.015em]">
          This month: {picks.length} new things your agents could do
        </p>
        <ul className="mt-4 space-y-1">
          {picks.map((p) => (
            <li
              key={p.title}
              className="flex justify-between gap-4 rounded-[6px] bg-white/[0.05] px-3 py-2.5"
            >
              <span>{p.title}</span>
              <span className="whitespace-nowrap text-night-ink-2">
                {p.handle}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-night-ink-2">
          Reply with the ones you want and I’ll add them on our next check-in.
        </p>
      </div>
      <figcaption className="mt-3 text-small text-night-ink-2">
        An example note, built from this week’s library.
      </figcaption>
    </figure>
  );
}

export default async function SetupPage({ searchParams }: PageProps<"/setup">) {
  const [s, library] = await Promise.all([getSettings(), getUseCases()]);
  const { planCheckout } = s;
  const picks = library
    .filter((u) =>
      ["solo", "chief-of-staff", "customers", "bookkeeping"].includes(
        u.category,
      ),
    )
    .slice(0, 3);
  const dawnCredit = credits.torontoDawn;
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 pb-24 pt-14 md:pt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16"
      >
        <div>
          <h1
            id="hero-title"
            className="lines text-display text-stretch-display"
          >
            <span className="line">
              <span data-line style={{ "--i": 0 } as React.CSSProperties}>
                Your agents,
              </span>
            </span>
            <span className="line">
              <span data-line style={{ "--i": 1 } as React.CSSProperties}>
                set up for you
              </span>
            </span>
          </h1>
          <div className="after-lines">
            <p className="mt-8 max-w-[36rem] text-lead">
              Peter designs a set of agents for how you work, from what’s
              actually working in the library, and installs them on your own
              accounts with you.
            </p>
            <div
              id="hero-cta"
              className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            >
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
        </div>
        <div className="after-lines rounded-[8px] bg-ground-2 p-7 sm:p-8 lg:-mr-8">
          <p className="flex items-baseline gap-2">
            <span className="text-[clamp(4rem,7vw,6rem)] font-[650] leading-none tracking-[-0.05em]">
              ${s.setupPrice}
            </span>
            <span className="text-lead text-ink-2">once</span>
          </p>
          <ul className="mt-6 space-y-2.5 text-small">
            {includes.map((i) => (
              <li key={i} className="flex gap-3">
                <svg
                  viewBox="0 0 16 16"
                  className="mt-[0.25em] size-4 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-small text-ink-2">
            Paid on the call, once you’ve agreed what we’ll set up. Prices in
            CAD, no HST charged.
          </p>
        </div>
      </section>

      <section aria-labelledby="how-title" className="bg-ground-2">
        <div
          className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 py-28 md:py-40 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
          data-reveal
        >
          <div>
            <h2 id="how-title" className="text-h2">
              How it works
            </h2>
            <ol className="mt-12 space-y-1">
              {steps.map((st, i) => (
                <li
                  key={st.when}
                  className={`grid gap-x-6 gap-y-1 rounded-[8px] px-5 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-6 ${i % 2 ? "bg-[#e9e9ec]" : "bg-ground"}`}
                >
                  <p className="text-lead font-[560] text-ink-2">{st.when}</p>
                  <div>
                    <h3 className="text-title">{st.title}</h3>
                    <p className="mt-1 text-small">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:pt-24">
            <GuideSample />
          </div>
        </div>
      </section>

      <figure>
        <div className="relative h-[48svh] min-h-[20rem] overflow-clip bg-night">
          <Image
            src={dawn}
            alt="Toronto’s skyline and the CN Tower at sunrise, seen across Lake Ontario"
            fill
            sizes="100vw"
            placeholder="blur"
            className="drift object-cover object-[50%_60%]"
          />
        </div>
        <figcaption className="wrap mt-4 flex flex-wrap justify-between gap-x-8 gap-y-1 text-small">
          <span>Sessions run by video from Toronto, on your own accounts.</span>
          <span className="text-ink-2">
            Photo:{" "}
            <a
              href={dawnCredit.source}
              className="underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dawnCredit.by}
            </a>
            ,{" "}
            <a
              href={dawnCredit.licenceUrl}
              className="underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dawnCredit.licence}
            </a>
          </span>
        </figcaption>
      </figure>

      <section
        id="plan"
        aria-labelledby="plan-title"
        className="on-night mt-28 scroll-mt-16 bg-night text-night-ink md:mt-40"
      >
        <div
          className="wrap grid gap-12 py-28 md:py-40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
          data-reveal
        >
          <div>
            <h2 id="plan-title" className="max-w-[16ch] text-h2">
              The monthly plan, after your setup
            </h2>
            <p className="mt-4 max-w-[30rem] text-lead text-night-ink">
              Your setup keeps getting better as the library grows. Optional,
              and only for people who’ve had a setup.
            </p>
            <p className="mt-8 flex items-baseline gap-2">
              <span className="text-h2 leading-none">${s.planPrice}</span>
              <span className="text-small text-night-ink-2">a month</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-small">
              {plan.map((p) => (
                <li key={p} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent-night"
                  />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {planCheckout ? (
                <ActionLink
                  kind="planCheckout"
                  location="setup-plan"
                  size="m"
                  tone="light"
                >
                  Start the plan
                </ActionLink>
              ) : (
                <p className="text-small text-night-ink-2">
                  Add it on your setup call.
                </p>
              )}
            </div>
          </div>
          <MonthlyNote
            picks={picks.map((u) => ({ title: u.title, handle: u.handle }))}
          />
        </div>
      </section>

      <FaqSection offer="work" items={faqs} />

      <section
        id="final-cta"
        aria-labelledby="final-title"
        className="bg-ground"
      >
        <div
          className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 pt-28 md:pt-40 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16"
          data-reveal
        >
          <h2 id="final-title" className="text-h2 lg:max-w-[16ch]">
            Twenty minutes to find your setup
          </h2>
          <div
            data-ui
            className="rounded-[8px] bg-ground-2 p-6 sm:p-7 lg:-mr-7"
          >
            <p className="text-title">Free setup call</p>
            <p className="mt-1 text-small text-ink-2">
              20 minutes · video · with Peter
            </p>
            <ul className="mt-4 space-y-1.5 text-small">
              <li>What eats your week, and which agent you use</li>
              <li>The library setups that fit</li>
              <li>A plan and a price before anything is paid</li>
            </ul>
            <div className="mt-6">
              <ActionLink kind="setupCall" location="setup-final">
                Pick a time
              </ActionLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
