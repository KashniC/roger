import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { HeroSearch, type Entry } from "@/components/home/hero-search";
import { Leads, pickStories } from "@/components/home/stories";
import { WatchForm } from "@/components/home/watch-form";
import { Interest } from "@/components/pack-cards";
import { categories, type UseCase } from "@/data/library";
import { ladderFor } from "@/data/ladder";
import { livePack, packs } from "@/data/packs";
import { getUseCases } from "@/lib/library-source";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: { absolute: "Roger: what people’s AI agents actually do" },
  description:
    "A growing library of real AI agent use cases from people running Muse, Grok Bot, Hark and more, read from public posts every morning. Search it, watch for what you need, and get a free starter pack.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const OPEN_IN_PACK = 3;

const lean = (u: UseCase): Entry => ({
  id: u.id,
  title: u.title,
  summary: u.summary,
  category: u.category,
  tool: u.tool,
  handle: u.handle,
  url: u.url,
});

/** Shelves by size, for the browse links under the search. */
function topShelves(list: UseCase[], n: number) {
  return categories
    .map((c) => ({ id: c.id, label: c.label, n: list.filter((u) => u.category === c.id).length }))
    .filter((s) => s.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, n);
}

/** What a setup promises about access, from the setup terms. */
const facts = ["It runs on your own accounts.", "By default it drafts; you approve.", "We keep no passwords."];
/** The setup, step by step, as /setup describes it. */
const steps = ["A free 20-minute call", "One setup session, by video", "A check-in a week later"];

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));

  // the three results have their own section; the newest list under the search leaves them out
  const leads = pickStories(sorted);
  const leadIds = new Set(leads.map((u) => u.id));
  const total = all.length;
  const [, setupPlan, monthly] = ladderFor(settings).rungs;
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");

  return (
    <>
      {/* 1 · Blue hour: what Roger is, and the library to try right there */}
      <section aria-labelledby="hero-title" className="on-night bg-cobalt text-ground">
        <div className="wrap grid gap-14 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          <div className="flex flex-col">
            <h1 id="hero-title" className="display text-[clamp(3.5rem,8.4vw,8rem)]">
              What people’s AI agents <em className="italic">actually</em> do.
            </h1>
            <p className="mt-8 max-w-[26rem] text-lead text-cobalt-ink-2">
              {total.toLocaleString("en-CA")} real use cases from public posts, collected every morning.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
              <Link href={`/packs/${pack.id}`} className="btn btn-l bg-ground text-ink hover:bg-white">
                Get the free 10-agent pack
              </Link>
              <a href={settings.setupCall} target="_blank" rel="noopener noreferrer" className="btn btn-l btn-ghost border-white/40 text-ground hover:bg-white/10">
                Book a free setup call
              </a>
            </div>
          </div>
          <HeroSearch newest={sorted.filter((u) => !leadIds.has(u.id)).slice(0, 4).map(lean)} total={total} shelves={topShelves(sorted, 6)} />
        </div>
      </section>

      {/* 2 · Three results, large */}
      <section aria-labelledby="leads-title" className="bg-ground py-24 md:py-32">
        <div className="wrap">
          <h2 id="leads-title" className="display text-[clamp(2.75rem,5.4vw,4.75rem)]">
            Three things agents <em className="italic">did</em>.
          </h2>
          <div className="mt-12">
            <Leads stories={leads} />
          </div>
        </div>
      </section>

      {/* 3 · Two ways to get yours running, side by side */}
      <section id="pricing" aria-labelledby="ways-title" className="scroll-mt-16">
        <h2 id="ways-title" className="sr-only">
          Two ways to get started
        </h2>
        <div className="grid lg:grid-cols-2">
          {/* do it yourself */}
          <div className="bg-ground-2 py-20 md:py-28">
            <div className="w-full px-4 sm:px-6 lg:ml-auto lg:max-w-[590px] lg:pr-14">
              <p className="text-[1rem] font-[600] text-cobalt">Do it yourself</p>
              <p className="display mt-4 text-[clamp(3.5rem,6vw,5.5rem)]">Free</p>
              <p className="mt-4 max-w-[26rem] text-lead text-ink-2">The starter pack: ten agents for a business of one, with the instructions to paste in.</p>
              <ol className="mt-8 grid border-t border-ink/15 sm:grid-cols-2 sm:gap-x-8">
                {pack.agents.map((a, i) => (
                  <li key={a.id} className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-2.5 text-[1rem]">
                    <span>{a.name}</span>
                    {i < OPEN_IN_PACK && <span className="text-[0.8125rem] text-cobalt">Open now</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[0.875rem] text-ink-2">{OPEN_IN_PACK} open now, the rest with your email.</p>
              <Link href={`/packs/${pack.id}`} className="btn btn-l mt-8 bg-cobalt text-ground hover:bg-cobalt-deep">
                Get the free pack
              </Link>
              {next.length > 0 && (
                <div className="mt-12 border-t border-ink/15 pt-6">
                  <p className="text-[0.9375rem] font-[600]">Packs coming next</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
                    {next.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <span className="text-[0.9375rem]">{p.persona}</span>
                        <Interest persona={p.id} tone="light" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* have it done */}
          <div className="on-night bg-night py-20 text-night-ink md:py-28">
            <div className="w-full px-4 sm:px-6 lg:max-w-[590px] lg:pl-14">
              <p className="text-[1rem] font-[600] text-cobalt-ink-2">Have it done</p>
              <p className="mt-4 flex items-baseline gap-3">
                <span className="display text-[clamp(3.5rem,6vw,5.5rem)] tabular-nums">{setupPlan.price}</span>
                <span className="text-lead text-night-ink-2">once</span>
              </p>
              <p className="mt-4 max-w-[26rem] text-lead text-night-ink-2">{setupPlan.body}</p>
              <ol className="mt-8 border-t border-white/15">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-baseline gap-4 border-b border-white/10 py-2.5 text-[1rem]">
                    <span className="display w-6 text-[1.5rem] text-cobalt-ink-2">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href={settings.setupCall} target="_blank" rel="noopener noreferrer" className="btn btn-l bg-ground text-ink hover:bg-white">
                  Book a free setup call
                </a>
                <Link href="/setup" className="tlink chev py-2 text-[1rem]" style={{ color: "var(--color-cobalt-ink-2)" }}>
                  What’s included
                </Link>
              </div>
              <ul className="mt-10 grid gap-2 text-[0.9375rem] text-night-ink-2">
                {facts.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Icon name="check" className="size-4 text-cobalt-ink-2" strokeWidth={2.2} /> {f}
                  </li>
                ))}
              </ul>
              <p className="mt-10 border-t border-white/15 pt-6 text-[0.9375rem] text-night-ink-2">
                <span className="font-[600] text-night-ink">
                  Then {monthly.price} {monthly.per}, if you want it.
                </span>{" "}
                {monthly.body}{" "}
                <Link href={monthly.href} className="underline underline-offset-4 hover:text-night-ink">
                  How the plan works
                </Link>
              </p>
              <p className="mt-6 text-[0.8125rem] text-night-ink-2">
                Prices in CAD, no HST charged. Your agent’s own subscription is paid to its provider.{" "}
                <Link href="/companies" className="underline underline-offset-4 hover:text-night-ink">
                  Roger for companies
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Last word, back in blue: watch for what isn't in the library yet */}
      <section id="watch" aria-labelledby="watch-title" className="scroll-mt-16 bg-cobalt py-24 text-ground md:py-32">
        <div className="wrap">
          <h2 id="watch-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
            Not in the library <em className="italic">yet?</em>
          </h2>
          <div className="mt-12">
            <WatchForm />
          </div>
        </div>
      </section>
    </>
  );
}
