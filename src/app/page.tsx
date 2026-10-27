import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Icon, type IconName } from "@/components/icons";
import { AgentDemo } from "@/components/home/agent-demo";
import { Journey } from "@/components/home/journey";
import { LibraryBrowse } from "@/components/home/library-browse";
import { LiveSearch, type Entry } from "@/components/home/live-search";
import { pickStories, Stories } from "@/components/home/stories";
import { WatchSentence } from "@/components/home/watch-sentence";
import { Interest } from "@/components/pack-cards";
import { Toque } from "@/components/toque";
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

/** Three plain promises, each one a fact from the setup terms. */
const principles: { icon: IconName; title: string; line: string }[] = [
  { icon: "pen", title: "Drafts first", line: "By default it drafts, and you approve." },
  { icon: "user", title: "Your accounts", line: "It runs on your logins, and stays yours." },
  { icon: "key", title: "No passwords kept", line: "You sign in yourself during setup." },
];
/** The FAQ answers behind those three live with them; the rest stay in the FAQ. */
const ACCESS_QS = ["Do I own it?", "What about my passwords?", "Does it send or buy things on its own?"];

function H2({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 id={id} className={`display display-m ${className}`}>
      {children}
    </h2>
  );
}

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));
  const stories = pickStories(sorted);
  const storyIds = new Set(stories.map((s) => s.id));
  // the stories have their own place; nothing else on the page repeats them
  const rest = sorted.filter((u) => !storyIds.has(u.id));
  const shelves = byShelf(rest);
  const total = all.length;
  const [, setupPlan, monthly] = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const access = faqs.filter((f) => ACCESS_QS.includes(f.q));
  const otherFaqs = faqs.filter((f) => !ACCESS_QS.includes(f.q));
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;

  return (
    <>
      {/* 1 · One headline, one sentence, one button, and the library itself */}
      <section aria-labelledby="hero-title" data-header-tone="night" className="on-night relative isolate overflow-clip bg-night text-night-ink">
        <div className="stage-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="glow-copper pointer-events-none absolute left-1/2 top-[68%] -z-10 size-[min(1200px,150vw)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="wrap pb-24 pt-14 text-center md:pb-32 md:pt-16">
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
            <Link href={`/packs/${pack.id}`} className="btn btn-l mt-8">
              Get the free 10-agent pack
            </Link>
          </div>

          <div className="after-lines relative mx-auto mt-14 max-w-[56rem] text-left">
            <div className="window rounded-[20px] shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_60px_140px_-40px_rgb(0_0_0/0.95),0_0_120px_-30px_rgb(232_169_127/0.3)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3.5">
                <span className="flex items-center gap-3">
                  <span className="chrome-dots hidden sm:flex" aria-hidden="true"><span /><span /><span /></span>
                  <span className="flex items-center gap-2 text-[0.875rem] font-[600]">
                    <Toque className="size-[18px] text-accent-night" />
                    Roger library
                  </span>
                </span>
                <span className="tag bg-ok-night/10 text-ok-night">
                  <span className="breathe size-1.5 rounded-full bg-ok-night" aria-hidden="true" />
                  Live · try it
                </span>
              </div>
              <LiveSearch newest={rest.slice(0, 5).map(lean)} total={total} shelves={[]} chips={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Three results worth stopping for */}
      <section aria-labelledby="stories-title" className="section bg-ground">
        <div className="wrap" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <H2 id="stories-title">
              Three things
              <span className="block text-ink/40">agents did.</span>
            </H2>
            <Link href="#library" className="tlink chev py-2 text-[1.0625rem]">
              Explore all {total.toLocaleString("en-CA")}
            </Link>
          </div>
          <div className="mt-14">
            <Stories stories={stories} shelfLabel={categoryLabel} />
          </div>
        </div>
      </section>

      {/* 3 · Discover → Choose → Set up */}
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

      {/* 4 · The library, a shelf at a time */}
      <section id="library" aria-labelledby="library-title" className="section scroll-mt-16 bg-ground">
        <div className="wrap" data-reveal>
          <H2 id="library-title">
            <span className="tabular-nums">{total.toLocaleString("en-CA")}</span>
            <span className="block text-ink/40">use cases, and counting.</span>
          </H2>
          <div className="mt-12">
            <LibraryBrowse shelves={shelves} />
          </div>
        </div>
      </section>

      {/* 5 · The signature moment: an agent at work */}
      <section aria-labelledby="console-title" data-header-tone="night" className="on-night relative isolate overflow-clip bg-night py-28 text-night-ink md:py-40">
        <div className="stage-grid pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
        <div className="glow-copper pointer-events-none absolute left-1/2 top-[60%] -z-10 size-[min(1500px,170vw)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="wrap" data-reveal>
          <H2 id="console-title" className="text-center display-l">
            It does the work.
            <span className="block text-accent-night">You make the call.</span>
          </H2>
          <div className="mt-16 md:mt-24">
            <AgentDemo />
          </div>
        </div>
      </section>

      {/* 6 · The rules, in three lines */}
      <section aria-labelledby="trust-title" className="section bg-ground">
        <div className="wrap" data-reveal>
          <H2 id="trust-title">
            Your accounts.
            <span className="block text-ink/40">Your rules.</span>
          </H2>
          <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {principles.map((p) => (
              <li key={p.title}>
                <Icon name={p.icon} className="size-9 text-accent" strokeWidth={1.4} />
                <p className="mt-6 text-[clamp(1.5rem,2.2vw,1.875rem)] font-[650] tracking-[-0.035em]">{p.title}</p>
                <p className="mt-2 text-[1.0625rem] text-ink-2">{p.line}</p>
              </li>
            ))}
          </ul>
          <details className="group mt-14 border-y border-rule">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[1rem] font-[600] [&::-webkit-details-marker]:hidden">
              The details
              <Icon name="plus" className="size-4 transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <dl className="grid gap-8 pb-8 md:grid-cols-3 md:gap-10">
              {access.map((f) => (
                <div key={f.q}>
                  <dt className="font-[600]">{f.q}</dt>
                  <dd className="mt-1 text-small text-ink-2">{f.a}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </section>

      {/* 7 · Start free: the pack, by name */}
      <section aria-labelledby="pack-title" data-header-tone="night" className="on-night section bg-night text-night-ink">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20" data-reveal>
          <div>
            <H2 id="pack-title" className="display-l">
              Ten agents.
              <span className="block text-accent-night">Free.</span>
            </H2>
            <p className="mt-6 max-w-[24rem] text-lead text-night-ink-2">For a business of one. {OPEN_IN_PACK} open now, the rest with your email.</p>
            <Link href={`/packs/${pack.id}`} className="btn btn-l mt-9">
              Get the free pack
            </Link>
          </div>
          <ol className="grid border-t border-white/15 sm:grid-cols-2 sm:gap-x-10">
            {pack.agents.map((a, i) => (
              <li key={a.id} className="flex items-baseline justify-between gap-4 border-b border-white/10 py-4">
                <span className="flex items-baseline gap-4">
                  <span className="mono text-[0.75rem] text-night-ink-2">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.1875rem] font-[600] tracking-[-0.02em]">{a.name}</span>
                </span>
                {i < OPEN_IN_PACK && <span className="kicker text-ok-night">Open</span>}
              </li>
            ))}
          </ol>
        </div>
        {next.length > 0 && (
          <div className="wrap mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:gap-10">
            <p className="kicker shrink-0 text-night-ink-2">Next packs</p>
            <ul className="flex flex-wrap items-start gap-x-10 gap-y-5">
              {next.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-4">
                  <span className="text-[1.0625rem] font-[600]">{p.persona}</span>
                  <Interest persona={p.id} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 8 · Or have it done */}
      <section id="pricing" aria-labelledby="plans-title" className="section scroll-mt-16 bg-ground-2">
        <div className="wrap" data-reveal>
          <H2 id="plans-title">
            Or have it
            <span className="block text-ink/40">set up for you.</span>
          </H2>
          <ol className="mt-14 grid overflow-hidden rounded-[24px] bg-surface shadow-[0_0_0_1px_rgb(27_26_24/0.08)] md:grid-cols-2">
            {[setupPlan, monthly].map((p, i) => {
              const dark = i === 0;
              return (
                <li key={p.name} className={`flex flex-col p-8 sm:p-10 ${dark ? "on-night bg-night text-night-ink" : ""}`}>
                  <p className="text-[1.25rem] font-[640] tracking-[-0.02em]">{p.name}</p>
                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="display text-[clamp(4rem,8vw,6.5rem)] tabular-nums">{p.price}</span>
                    {p.per && <span className={dark ? "text-night-ink-2" : "text-ink-2"}>{p.per}</span>}
                  </p>
                  <p className={`mt-6 max-w-[26rem] text-[1rem] ${dark ? "text-night-ink-2" : "text-ink-2"}`}>{p.body}</p>
                  <details className={`group mt-6 border-t ${dark ? "border-white/10" : "border-rule"}`}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[0.9375rem] font-[600] [&::-webkit-details-marker]:hidden">
                      What’s included
                      <Icon name="plus" className="size-4 transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <ul className="grid gap-2.5 pb-2 text-[0.9375rem]">
                      {p.includes.map((x) => (
                        <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                          <Icon name="check" className={`mt-0.5 size-[18px] ${dark ? "text-accent-night" : "text-accent"}`} strokeWidth={2} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="mt-auto pt-10">
                    <Link href={p.href} className={`btn btn-l w-full ${dark ? "" : "btn-ghost"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-8 text-small text-ink-2">
            Prices in CAD, no HST charged. Running a whole company?{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
          </p>
        </div>
      </section>

      {/* 9 · What's left to ask */}
      <section aria-labelledby="faq-title" className="section bg-ground">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16" data-reveal>
          <H2 id="faq-title">Questions</H2>
          <div className="border-t border-ink/80">
            {otherFaqs.map((f) => (
              <details key={f.q} className="group border-b border-rule">
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.1875rem] font-[620] tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="plus" className="size-4 shrink-0 text-ink-2 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-[40rem] pb-6 pr-12 text-small text-ink-2">{f.a}</p>
              </details>
            ))}
            {siteConfig.contactEmail && (
              <p className="pt-6 text-small text-ink-2">
                Anything else:{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="tlink">
                  {siteConfig.contactEmail}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 10 · Close */}
      <section id="watch" aria-labelledby="watch-title" data-header-tone="night" className="on-night relative isolate scroll-mt-16 overflow-clip bg-night text-night-ink">
        <Image src={dawn} alt="" fill sizes="100vw" placeholder="blur" className="drift -z-10 object-cover object-[50%_62%] opacity-70" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_14_13/0.95)_0%,rgb(15_14_13/0.5)_50%,rgb(15_14_13/0.9)_100%)]" aria-hidden="true" />
        <div className="wrap pb-10 pt-28 md:pt-40" data-reveal>
          <h2 id="watch-title" className="display display-l max-w-[13ch]">
            Find what your agent could do <span className="text-accent-night">next.</span>
          </h2>
          <Link href={`/packs/${pack.id}`} className="btn btn-l mt-10">
            Get the free 10-agent pack
          </Link>
          <div className="mt-20 max-w-[44rem] md:mt-28">
            <p className="kicker flex items-center gap-2 text-night-ink-2">
              <Icon name="bell" className="size-4 text-accent-night" /> Not in the library yet? Watch for it.
            </p>
            <div className="mt-4 rounded-[18px] bg-ground p-5 text-ink sm:p-7">
              <WatchSentence />
            </div>
          </div>
          <p className="mt-16 text-[0.8125rem] text-night-ink-2">
            Toronto from Sam Smith Park, just after sunrise. Photo:{" "}
            <a href={dawnCredit.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {dawnCredit.by}
            </a>
            ,{" "}
            <a href={dawnCredit.licenceUrl} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {dawnCredit.licence}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
