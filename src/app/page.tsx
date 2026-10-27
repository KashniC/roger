import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Icon, type IconName } from "@/components/icons";
import { AgentDemo } from "@/components/home/agent-demo";
import { Journey } from "@/components/home/journey";
import { LibraryBrowse, type Entry } from "@/components/home/library-browse";
import { pickStories, Stories } from "@/components/home/stories";
import { WatchSentence } from "@/components/home/watch-sentence";
import { Interest } from "@/components/pack-cards";
import { siteConfig } from "@/data/config";
import { credits } from "@/data/credits";
import { setupFaqs } from "@/data/faq";
import { categories, categoryLabel, type UseCase } from "@/data/library";
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

/** Three plain facts from the setup terms; the answers behind them sit under "The details". */
const principles: { icon: IconName; title: string; line: string; q: string }[] = [
  { icon: "pen", title: "Drafts first", line: "By default it drafts, and you approve.", q: "Does it send or buy things on its own?" },
  { icon: "user", title: "Your accounts", line: "It runs on your logins, and stays yours.", q: "Do I own it?" },
  { icon: "key", title: "No passwords kept", line: "You sign in yourself during setup.", q: "What about my passwords?" },
];
/** What's left of the FAQ once the free version and access questions have homes of their own. */
const START_QS = ["Which agent do you set up?", "What does it cost after the setup?"];

function H2({ id, children, className = "", size = "display-m" }: { id: string; children: React.ReactNode; className?: string; size?: string }) {
  return (
    <h2 id={id} className={`display ${size} ${className}`}>
      {children}
    </h2>
  );
}

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));
  const stories = pickStories(sorted);
  const storyIds = new Set(stories.map((s) => s.id));
  // the three stories have their own section; the library below doesn't repeat them
  const shelves = byShelf(sorted.filter((u) => !storyIds.has(u.id)));
  const total = all.length;
  const [, setupPlan, monthly] = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const answer = (q: string) => faqs.find((f) => f.q === q)?.a ?? "";
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;

  return (
    <>
      {/* A · What Roger is, and the one product scene */}
      <section aria-labelledby="hero-title" data-header-tone="night" className="on-night relative isolate overflow-clip bg-night text-night-ink">
        <div className="stage-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="glow-copper pointer-events-none absolute left-1/2 top-[72%] -z-10 size-[min(1400px,170vw)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="wrap pb-24 pt-14 md:pb-32 md:pt-16">
          <div className="text-center">
            <h1 id="hero-title" className="lines display mx-auto text-[clamp(3rem,6.6vw,6rem)]">
              <span className="line block">
                <span data-line className="block" style={{ "--i": 0 } as React.CSSProperties}>What people’s</span>
              </span>
              <span className="line block">
                <span data-line className="block" style={{ "--i": 1 } as React.CSSProperties}>AI agents</span>
              </span>
              <span className="line block">
                <span data-line className="block text-accent-night" style={{ "--i": 2 } as React.CSSProperties}>actually do.</span>
              </span>
            </h1>
            <div className="after-lines">
              <p className="mx-auto mt-6 max-w-[30rem] text-lead text-night-ink-2">
                Real things people’s agents did, collected every morning, ready to set up on yours.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free 10-agent pack
                </Link>
                <Link href="#library" className="tlink chev py-2 text-[1rem]">
                  Browse the library
                </Link>
              </div>
            </div>
          </div>
          <div className="after-lines mx-auto mt-14 max-w-[64rem] md:mt-16">
            <AgentDemo />
          </div>
        </div>
      </section>

      {/* B · What it makes possible: three real results */}
      <section aria-labelledby="stories-title" className="section bg-ground">
        <div className="wrap" data-reveal>
          <H2 id="stories-title">
            Three things
            <span className="block text-ink/40">agents did.</span>
          </H2>
          <div className="mt-14">
            <Stories stories={stories} shelfLabel={categoryLabel} />
          </div>
        </div>
      </section>

      {/* C · How it works, as one line */}
      <section id="how" aria-labelledby="how-title" className="section scroll-mt-16 bg-ground-2">
        <div className="wrap" data-reveal>
          <H2 id="how-title" className="text-center">
            From their post
            <span className="block text-ink/40">to your agent.</span>
          </H2>
          <div className="mx-auto mt-16 max-w-[64rem] md:mt-24">
            <Journey />
          </div>
        </div>
      </section>

      {/* D · The library: the one place to browse and search */}
      <section id="library" aria-labelledby="library-title" className="section scroll-mt-16 bg-ground">
        <div className="wrap" data-reveal>
          <H2 id="library-title">
            <span className="tabular-nums">{total.toLocaleString("en-CA")}</span>
            <span className="block text-ink/40">use cases, and counting.</span>
          </H2>
          <div className="mt-12">
            <LibraryBrowse shelves={shelves} total={total} />
          </div>
        </div>
      </section>

      {/* E · Trust and control, in three facts */}
      <section aria-labelledby="trust-title" data-header-tone="night" className="on-night section bg-night text-night-ink">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16" data-reveal>
          <H2 id="trust-title" size="text-[clamp(2.4rem,4vw,3.75rem)] leading-[0.95]">
            Your accounts.
            <span className="block text-accent-night">Your rules.</span>
          </H2>
          <ul className="border-t border-white/15">
            {principles.map((p) => (
              <li key={p.title} className="border-b border-white/10">
                <details className="group">
                  <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-5 py-6 [&::-webkit-details-marker]:hidden">
                    <Icon name={p.icon} className="size-7 text-accent-night" strokeWidth={1.4} />
                    <span>
                      <span className="block text-[clamp(1.375rem,2vw,1.75rem)] font-[650] tracking-[-0.03em]">{p.title}</span>
                      <span className="mt-1 block text-[1rem] text-night-ink-2">{p.line}</span>
                    </span>
                    <Icon name="plus" className="size-4 text-night-ink-2 transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="pb-6 pl-[3.75rem] pr-8 text-small text-night-ink-2">{answer(p.q)}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* F · Start: free, once, or monthly */}
      <section id="pricing" aria-labelledby="start-title" className="section scroll-mt-16 bg-ground-2">
        <div className="wrap" data-reveal>
          <H2 id="start-title">
            Start free.
            <span className="block text-ink/40">Or have it done.</span>
          </H2>
          <div className="mt-14 grid gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* the free pack */}
            <div className="on-night flex flex-col rounded-[24px] bg-night p-8 text-night-ink sm:p-10">
              <p className="text-[1.25rem] font-[640] tracking-[-0.02em]">Starter pack</p>
              <p className="display mt-6 text-[clamp(4rem,8vw,6.5rem)]">Free</p>
              <p className="mt-5 max-w-[24rem] text-[1.0625rem] text-night-ink-2">
                Ten agents for a business of one, with the instructions to paste in. {OPEN_IN_PACK} open now, the rest with your email.
              </p>
              <div className="mt-auto pt-10">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free pack
                </Link>
              </div>
              {next.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="text-[0.9375rem] text-night-ink-2">Next packs, when they’re ready:</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {next.map((p) => (
                      <li key={p.id} className="grid gap-2">
                        <span className="font-[600]">{p.persona}</span>
                        <Interest persona={p.id} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* or have it done */}
            <ol className="grid gap-3">
              {[setupPlan, monthly].map((p) => (
                <li key={p.name} className="flex flex-col rounded-[24px] bg-surface p-8 shadow-[0_0_0_1px_rgb(27_26_24/0.08)] sm:p-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <p className="text-[1.25rem] font-[640] tracking-[-0.02em]">{p.name}</p>
                    <p className="flex items-baseline gap-2">
                      <span className="display text-[clamp(3rem,5vw,4rem)] tabular-nums">{p.price}</span>
                      {p.per && <span className="text-ink-2">{p.per}</span>}
                    </p>
                  </div>
                  <p className="mt-4 max-w-[30rem] text-[1rem] text-ink-2">{p.body}</p>
                  <Link href={p.href} className="btn btn-m btn-ink mt-6 self-start">
                    {p.cta}
                  </Link>
                  <details className="group mt-5 border-t border-rule">
                    <summary className="tlink-quiet flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 text-[0.9375rem] [&::-webkit-details-marker]:hidden">
                      What’s included
                      <Icon name="plus" className="size-3.5 transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <ul className="grid gap-2.5 pb-1 text-[0.9375rem]">
                      {p.includes.map((x) => (
                        <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                          <Icon name="check" className="mt-0.5 size-[18px] text-accent" strokeWidth={2} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
          </div>

          {/* what's left to ask */}
          <div className="mt-12 grid gap-x-10 border-t border-rule md:grid-cols-2">
            {START_QS.map((q) => (
              <details key={q} className="group border-b border-rule">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] font-[600] [&::-webkit-details-marker]:hidden">
                  {q}
                  <Icon name="plus" className="size-4 shrink-0 text-ink-2 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pb-5 pr-10 text-small text-ink-2">{answer(q)}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-small text-ink-2">
            Prices in CAD, no HST charged. Running a whole company?{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
            {siteConfig.contactEmail && (
              <>
                {" "}· Anything else:{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="tlink">
                  {siteConfig.contactEmail}
                </a>
              </>
            )}
          </p>
        </div>
      </section>

      {/* G · Close */}
      <section id="watch" aria-labelledby="watch-title" data-header-tone="night" className="on-night relative isolate scroll-mt-16 overflow-clip bg-night text-night-ink">
        <Image src={dawn} alt="" fill sizes="100vw" placeholder="blur" className="drift -z-10 object-cover object-[50%_62%] opacity-70" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_14_13/0.95)_0%,rgb(15_14_13/0.5)_50%,rgb(15_14_13/0.9)_100%)]" aria-hidden="true" />
        <div className="wrap grid gap-16 pb-10 pt-28 md:pt-40 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end" data-reveal>
          <div>
            <h2 id="watch-title" className="display display-l max-w-[12ch]">
              Find what your agent could do <span className="text-accent-night">next.</span>
            </h2>
            <Link href={`/packs/${pack.id}`} className="btn btn-l mt-10">
              Get the free 10-agent pack
            </Link>
          </div>
          <div>
            <p className="flex items-center gap-2 text-[0.9375rem] text-night-ink-2">
              <Icon name="bell" className="size-4 text-accent-night" /> Not in the library yet? Watch for it.
            </p>
            <div className="mt-4 rounded-[18px] bg-ground p-5 text-ink sm:p-7">
              <WatchSentence />
            </div>
          </div>
        </div>
        <p className="wrap pb-6 pt-10 text-[0.8125rem] text-night-ink-2">
          Toronto from Sam Smith Park, just after sunrise. Photo:{" "}
          <a href={dawnCredit.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            {dawnCredit.by}
          </a>
          ,{" "}
          <a href={dawnCredit.licenceUrl} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            {dawnCredit.licence}
          </a>
        </p>
      </section>
    </>
  );
}
