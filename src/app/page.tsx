import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { AgentCard } from "@/components/home/agent-card";
import { Journey } from "@/components/home/journey";
import { LibraryBrowse, type Entry } from "@/components/home/library-browse";
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
const PER_SHELF = 10;

const lean = (u: UseCase): Entry => ({
  id: u.id,
  title: u.title,
  summary: u.summary,
  category: u.category,
  tool: u.tool,
  handle: u.handle,
  url: u.url,
});

/** Each shelf with its count and its newest few; the library page has the rest. */
function byShelf(list: UseCase[]) {
  return categories
    .map((c) => {
      const all = list.filter((u) => u.category === c.id);
      return { id: c.id, label: c.label, n: all.length, items: all.slice(0, PER_SHELF).map(lean) };
    })
    .filter((s) => s.n > 0)
    .sort((a, b) => b.n - a.n);
}

/** The three facts about access; the detail lives on /setup. */
const facts = ["By default it drafts; you approve.", "It runs on your own accounts.", "We keep no passwords."];

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));

  // the lead stories have the front page; the index below leaves them out
  const leads = pickStories(sorted);
  // the journey follows one real entry from the Morning brief's own shelf to that agent's instruction
  const exampleAgent = livePack.agents.find((a) => a.id === "brief") ?? null;
  const example = exampleAgent ? (sorted.find((u) => u.tool && !leads.includes(u) && exampleAgent.categories.includes(u.category)) ?? null) : null;
  const shown = new Set([...leads, ...(example ? [example] : [])].map((u) => u.id));
  const shelves = byShelf(sorted.filter((u) => !shown.has(u.id)));

  const total = all.length;
  const plans = ladderFor(settings).rungs;
  const who = ["You set it up", "Peter sets it up, with you", "After a setup"];
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");

  return (
    <>
      {/* 1 · The front page: masthead, headline, the lead stories */}
      <section aria-labelledby="hero-title" className="bg-ground pb-6 pt-8 md:pt-10">
        <div className="wrap">
          <p className="mono flex flex-wrap justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-3 text-[0.75rem] uppercase tracking-[0.08em]">
            <span>The morning edition</span>
            <span className="tabular-nums">{total.toLocaleString("en-CA")} use cases</span>
          </p>

          <div className="grid gap-12 border-b border-ink/15 py-10 md:py-14 lg:grid-cols-[minmax(0,6.6fr)_minmax(0,5.4fr)] lg:items-center lg:gap-0">
            <div className="lg:pr-12">
              <h1 id="hero-title" className="display text-[clamp(3.5rem,8vw,7.75rem)]">
                What people’s AI agents <span className="text-accent">actually do.</span>
              </h1>
              <p className="mt-7 max-w-[26rem] text-lead">Real use cases from public posts, collected every morning.</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free 10-agent pack
                </Link>
              </div>
            </div>
            <div className="lg:border-l lg:border-ink/15 lg:pl-12">
              <AgentCard />
            </div>
          </div>

          <Leads stories={leads} />
        </div>
      </section>

      {/* 2 · The index: the whole library, on black */}
      <section id="library" aria-labelledby="library-title" className="on-night scroll-mt-16 bg-night py-24 text-night-ink md:py-32">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="library-title" className="display text-[clamp(3rem,6vw,5.5rem)]">
              <span className="tabular-nums">{total.toLocaleString("en-CA")}</span> things agents did.
            </h2>
            <Link href="/library" className="tlink chev mt-6 inline-block py-1">
              Open the full library
            </Link>
          </div>
          <LibraryBrowse shelves={shelves} total={total} />
        </div>
      </section>

      {/* 3 · How it works, and the rules: one band of the brand orange */}
      <section aria-labelledby="how-title" className="bg-accent py-24 text-accent-ink md:py-28">
        <div className="wrap">
          <h2 id="how-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
            From their post to your agent.
          </h2>
          {example && exampleAgent && (
            <div className="mt-12">
              <Journey entry={example} agent={exampleAgent} />
            </div>
          )}
          <p className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/30 pt-8 text-[1rem]">
            {facts.map((f) => (
              <span key={f} className="flex items-center gap-2">
                <Icon name="check" className="size-4" strokeWidth={2.2} /> {f}
              </span>
            ))}
            <Link href="/setup" className="ml-auto font-[600] underline underline-offset-4 hover:no-underline">
              How a setup works
            </Link>
          </p>
        </div>
      </section>

      {/* 4 · Prices, as a ruled table */}
      <section id="pricing" aria-labelledby="price-title" className="scroll-mt-16 bg-ground py-24 md:py-32">
        <div className="wrap">
          <h2 id="price-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
            Free, once, <span className="text-accent">or monthly.</span>
          </h2>
          <ol className="mt-12 border-t-2 border-ink">
            {plans.map((p, i) => (
              <li key={p.name} className="border-b border-ink/15">
                <div className="grid gap-x-8 gap-y-3 py-7 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)_minmax(0,4fr)_12.5rem] md:items-center">
                  <p>
                    <span className="block text-[1.375rem] font-[650] tracking-[-0.02em]">{p.name}</span>
                    <span className="mono text-[0.75rem] uppercase tracking-[0.06em] text-ink-2">{who[i]}</span>
                  </p>
                  <p className="flex items-baseline gap-2">
                    <span className={`display text-[clamp(3rem,5vw,4.25rem)] tabular-nums ${i === 0 ? "text-accent" : ""}`}>{p.price}</span>
                    {p.per && <span className="text-ink-2">{p.per}</span>}
                  </p>
                  <div className="text-[1rem] text-ink-2">
                    <details className="group">
                      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-[560] text-ink hover:text-accent [&::-webkit-details-marker]:hidden">
                        What’s included
                        <Icon name="plus" className="size-3.5 transition-transform duration-200 group-open:rotate-45" />
                      </summary>
                      <p className="mt-1 text-[0.9375rem]">{i === 0 ? `Ten agents with the instructions to paste in. ${OPEN_IN_PACK} open now, the rest with your email.` : p.body}</p>
                      <ul className="mt-2 grid gap-1.5 text-[0.9375rem]">
                        {p.includes.map((x) => (
                          <li key={x}>— {x}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                  <Link href={p.href} className={`btn btn-m justify-self-start md:justify-self-end ${i === 0 ? "" : "btn-ink"}`}>
                    {p.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            {next.length > 0 && (
              <div>
                <p className="text-[1rem] font-[600]">Free packs coming next</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
                  {next.map((p) => (
                    <li key={p.id} className="flex items-center gap-3">
                      <span className="font-[600]">{p.persona}</span>
                      <Interest persona={p.id} tone="light" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-10 text-small text-ink-2">
            Prices in CAD, no HST charged.{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
          </p>
        </div>
      </section>

      {/* 5 · Last word: watch for what isn't in the library yet */}
      <section id="watch" aria-labelledby="watch-title" className="on-night scroll-mt-16 border-b border-white/10 bg-night py-24 text-night-ink md:py-32">
        <div className="wrap">
          <h2 id="watch-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
            Not in the library <span className="text-accent-night">yet?</span>
          </h2>
          <div className="mt-12">
            <WatchForm />
          </div>
        </div>
      </section>
    </>
  );
}
