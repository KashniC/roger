import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Icon } from "@/components/icons";
import { LibraryBrowse, type Entry } from "@/components/home/library-browse";
import { pickStories, Stories } from "@/components/home/stories";
import { WatchSentence } from "@/components/home/watch-sentence";
import { Interest } from "@/components/pack-cards";
import { siteConfig } from "@/data/config";
import { credits } from "@/data/credits";
import { setupFaqs } from "@/data/faq";
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

/** Three facts from the setup terms; each opens to the FAQ answer behind it. */
const principles = [
  { title: "By default, it drafts and you approve.", q: "Does it send or buy things on its own?" },
  { title: "It runs on your accounts.", q: "Do I own it?" },
  { title: "We keep no passwords.", q: "What about my passwords?" },
];
/** The rest of the FAQ, kept with the prices it's about. */
const START_QS = ["Which agent do you set up?", "What does it cost after the setup?"];

/** A page from the guide every setup ends with, as on /setup. */
const guide: [string, string][] = [
  ["Runs", "Weekdays at 6:45am"],
  ["Reads", "Your email, calendar and task list"],
  ["Never", "Replies, books or pays on its own"],
];

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));

  // One home per entry: the three stories, the one example in "how it works",
  // then the library shelves, which leave out the four already shown.
  const stories = pickStories(sorted);
  const brief = livePack.agents.find((a) => a.id === "brief")!;
  const example = sorted.find((u) => u.tool && brief.categories.includes(u.category) && !stories.includes(u)) ?? null;
  const shown = new Set([...stories, ...(example ? [example] : [])].map((u) => u.id));
  const shelves = byShelf(sorted.filter((u) => !shown.has(u.id)));

  const total = all.length;
  const [free, setupPlan, monthly] = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const answer = (q: string) => faqs.find((f) => f.q === q)?.a ?? "";
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;
  const offers = [
    { ...free, who: "You set it up", body: `Ten agents for a business of one, with the instructions to paste in. ${OPEN_IN_PACK} open now, the rest with your email.` },
    { ...setupPlan, who: "Peter sets it up, with you" },
    { ...monthly, who: "After a setup" },
  ];

  return (
    <>
      {/* 1 · What Roger is: the headline on dark, the real library breaking out of it */}
      <section aria-labelledby="hero-title" className="on-night bg-night text-night-ink">
        <div className="wrap pb-[12rem] pt-14 md:pb-[14rem] md:pt-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4.4fr)] lg:items-end lg:gap-14">
            <h1 id="hero-title" className="display text-[clamp(3rem,6.6vw,6rem)]">
              What people’s AI agents <span className="text-accent-night">actually do.</span>
            </h1>
            <div className="lg:pb-2">
              <p className="text-lead text-night-ink-2">
                Real use cases from public posts, read every morning. Set one up yourself with a free pack, or have Peter set it up for you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free 10-agent pack
                </Link>
                <Link href="/setup" className="btn btn-l btn-ghost">
                  Book a custom setup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="library" aria-label="The library" className="flow-root scroll-mt-16 bg-ground pb-24 md:pb-32">
        <div className="wrap">
          <div className="-mt-[9.5rem] rounded-[18px] bg-surface p-5 text-ink shadow-[0_0_0_1px_rgb(27_26_24/0.06),0_40px_80px_-40px_rgb(0_0_0/0.55)] sm:p-8 md:-mt-[11rem]">
            <LibraryBrowse
              shelves={shelves}
              total={total}
              heading={
                <p>
                  <span className="block text-[1.25rem] font-[640] tracking-[-0.02em]">The library</span>
                  <span className="text-[0.9375rem] text-ink-2 tabular-nums">{total.toLocaleString("en-CA")} use cases, new ones every morning</span>
                </p>
              }
            />
          </div>
        </div>
      </section>

      {/* 2 · Three results, large */}
      <section aria-labelledby="stories-title" className="bg-ground pb-28 md:pb-36">
        <div className="wrap">
          <h2 id="stories-title" className="display display-m">
            Three things <span className="text-accent">agents did.</span>
          </h2>
          <div className="mt-12">
            <Stories stories={stories} />
          </div>
        </div>
      </section>

      {/* 3 · How it works, with real pieces of the product; and the rules it runs by */}
      <section aria-labelledby="how-title" className="bg-forest py-28 text-night-ink md:py-36">
        <div className="wrap">
          <h2 id="how-title" className="display display-m max-w-[16ch]">
            From someone’s post <span className="text-accent-night">to your agent.</span>
          </h2>

          <ol className="mt-16 grid gap-px overflow-hidden rounded-[18px] bg-white/10 lg:grid-cols-3">
            <li className="flex flex-col bg-forest p-7 sm:p-8">
              <Step n={1} title="Find it" line="Someone’s agent did it, and it’s in the library." />
              {example && (
                <a href={example.url} target="_blank" rel="noopener noreferrer nofollow" className="group mt-8 block rounded-[12px] bg-ground p-5 text-ink transition-transform duration-200 hover:-translate-y-0.5">
                  <span className="text-[0.8125rem] text-ink-2">{example.tool}</span>
                  <span className="mt-1 block text-[1.125rem] font-[620] leading-snug tracking-[-0.02em]">{example.title}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-[0.875rem] text-ink-2 group-hover:text-accent">
                    {example.handle} <Icon name="external" className="size-3.5" />
                  </span>
                </a>
              )}
            </li>
            <li className="flex flex-col bg-forest p-7 sm:p-8">
              <Step n={2} title="Take the instruction" line={`Each agent in the free pack comes ready to paste in. This is ${brief.name.toLowerCase()}.`} />
              <blockquote className="mono mt-8 rounded-[12px] bg-forest-2 p-5 text-[0.875rem] leading-relaxed text-night-ink">“{brief.prompt}”</blockquote>
            </li>
            <li className="flex flex-col bg-forest p-7 sm:p-8">
              <Step n={3} title="Set it up" line="Yourself, or with Peter. A setup ends with a guide to every agent." />
              <dl className="mt-8 rounded-[12px] bg-ground p-5 text-[0.9375rem] text-ink">
                <p className="text-[0.8125rem] text-ink-2">Your agents · {brief.name}</p>
                {guide.map(([k, v]) => (
                  <div key={k} className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-t border-rule pt-3">
                    <dt className="text-ink-2">{k}</dt>
                    <dd className={k === "Never" ? "font-[650] text-accent" : ""}>{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ol>

          <div className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
            <h3 className="display text-[clamp(1.875rem,3vw,2.5rem)] leading-[0.95]">
              Your accounts. <span className="block text-accent-night">Your rules.</span>
            </h3>
            <ul className="border-t border-white/15">
              {principles.map((p) => (
                <li key={p.title} className="border-b border-white/10">
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[1.125rem] font-[600] tracking-[-0.015em] [&::-webkit-details-marker]:hidden">
                      {p.title}
                      <Icon name="plus" className="size-4 shrink-0 text-forest-ink-2 transition-transform duration-200 group-open:rotate-45" />
                    </summary>
                    <p className="pb-5 pr-8 text-small text-forest-ink-2">{answer(p.q)}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 · Three ways to start, side by side */}
      <section id="pricing" aria-labelledby="start-title" className="scroll-mt-16 bg-ground py-28 md:py-36">
        <div className="wrap">
          <h2 id="start-title" className="display display-m">
            Do it yourself, <span className="text-accent">or have it done.</span>
          </h2>
          <ol className="mt-12 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            {offers.map((p, i) => {
              const dark = i === 0;
              return (
                <li key={p.name} className={`flex flex-col rounded-[18px] p-7 sm:p-8 ${dark ? "on-night bg-night text-night-ink" : "bg-surface shadow-[0_0_0_1px_rgb(27_26_24/0.08)]"}`}>
                  <p className={`text-[0.9375rem] ${dark ? "text-accent-night" : "text-accent"}`}>{p.who}</p>
                  <p className="mt-2 text-[1.25rem] font-[640] tracking-[-0.02em]">{p.name}</p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="display text-[clamp(3.25rem,5vw,4.5rem)] tabular-nums">{p.price}</span>
                    {p.per && <span className={dark ? "text-night-ink-2" : "text-ink-2"}>{p.per}</span>}
                  </p>
                  <p className={`mt-4 text-[1rem] ${dark ? "text-night-ink-2" : "text-ink-2"}`}>{p.body}</p>
                  <details className="group mt-5">
                    <summary className={`flex min-h-11 cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-[560] [&::-webkit-details-marker]:hidden ${dark ? "text-night-ink-2 hover:text-night-ink" : "text-ink-2 hover:text-ink"}`}>
                      What’s included
                      <Icon name="plus" className="size-3.5 transition-transform duration-200 group-open:rotate-45" />
                    </summary>
                    <ul className="mt-1 grid gap-2 text-[0.9375rem]">
                      {p.includes.map((x) => (
                        <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2.5">
                          <Icon name="check" className={`mt-0.5 size-4 ${dark ? "text-accent-night" : "text-accent"}`} strokeWidth={2} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="mt-auto pt-8">
                    <Link href={p.href} className={`btn btn-m ${dark ? "" : i === 1 ? "btn-ink" : "btn-ghost"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          {next.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 border-y border-rule py-6">
              <p className="text-[1rem] text-ink-2">More free packs are coming. Hear when yours is ready:</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-4">
                {next.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="font-[600]">{p.persona}</span>
                    <Interest persona={p.id} tone="light" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 grid gap-x-10 md:grid-cols-2">
            {START_QS.map((q) => (
              <details key={q} className="group border-b border-rule">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] font-[600] [&::-webkit-details-marker]:hidden">
                  {q}
                  <Icon name="plus" className="size-4 shrink-0 text-ink-2 transition-transform duration-200 group-open:rotate-45" />
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

      {/* 5 · Close */}
      <section id="watch" aria-labelledby="watch-title" className="on-night relative isolate scroll-mt-16 overflow-clip bg-night text-night-ink">
        <Image src={dawn} alt="" fill sizes="100vw" placeholder="blur" className="-z-10 object-cover object-[50%_62%] opacity-60" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_14_13/0.92)_0%,rgb(15_14_13/0.55)_55%,rgb(15_14_13/0.9)_100%)]" aria-hidden="true" />
        <div className="wrap grid gap-14 pb-10 pt-28 md:pt-36 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <h2 id="watch-title" className="display display-l max-w-[12ch]">
              Find what your agent could do <span className="text-accent-night">next.</span>
            </h2>
            <Link href={`/packs/${pack.id}`} className="btn btn-l mt-10">
              Get the free 10-agent pack
            </Link>
          </div>
          <div>
            <p className="text-[1rem] text-night-ink-2">Not in the library yet? Watch for it.</p>
            <div className="mt-4 rounded-[14px] bg-ground p-5 text-ink sm:p-7">
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

function Step({ n, title, line }: { n: number; title: string; line: string }) {
  return (
    <div>
      <p className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-accent-night text-[0.875rem] font-[650] text-night">{n}</span>
        <span className="text-[1.375rem] font-[640] tracking-[-0.025em]">{title}</span>
      </p>
      <p className="mt-3 text-[1rem] text-forest-ink-2">{line}</p>
    </div>
  );
}
