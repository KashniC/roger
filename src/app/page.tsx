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
  ["Sends you", "One screen: meetings, replies owed, what’s overdue, one thing first"],
  ["Never", "Replies, books or pays on its own"],
  ["To change it", "Tell it in plain words: “skip Fridays”"],
];

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));
  const stories = pickStories(sorted);
  const storyIds = new Set(stories.map((s) => s.id));
  // the three stories have their own section; the library doesn't repeat them
  const shelves = byShelf(sorted.filter((u) => !storyIds.has(u.id)));
  const total = all.length;
  const [free, setupPlan, monthly] = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const answer = (q: string) => faqs.find((f) => f.q === q)?.a ?? "";
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;
  const offers = [
    { ...free, body: `Ten agents for a business of one, with the instructions to paste in. ${OPEN_IN_PACK} open now, the rest with your email.`, primary: true },
    { ...setupPlan, primary: false },
    { ...monthly, primary: false },
  ];

  return (
    <>
      {/* 1 · What Roger is, with the real library as the picture */}
      <section id="library" aria-labelledby="hero-title" className="scroll-mt-16 bg-ground pb-24 pt-14 md:pb-32 md:pt-20">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4.2fr)] lg:items-end lg:gap-12">
            <h1 id="hero-title" className="display text-[clamp(3rem,6.4vw,5.75rem)]">
              What people’s AI agents <span className="text-accent">actually do.</span>
            </h1>
            <div className="lg:pb-2">
              <p className="text-lead text-ink-2">
                Real use cases from public posts, read every morning. Find one, then set it up yourself or have it done.
              </p>
              <Link href={`/packs/${pack.id}`} className="btn btn-l mt-7">
                Get the free 10-agent pack
              </Link>
            </div>
          </div>

          <div className="mt-14 rounded-[18px] border border-rule bg-surface p-5 shadow-[0_24px_48px_-36px_rgb(27_26_24/0.35)] sm:p-8 md:mt-16">
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

      {/* 2 · Three results worth stopping for */}
      <section aria-labelledby="stories-title" className="section bg-ground-2">
        <div className="wrap">
          <h2 id="stories-title" className="display display-m">
            Three things agents did.
          </h2>
          <div className="mt-12">
            <Stories stories={stories} />
          </div>
        </div>
      </section>

      {/* 3 · Trust and control, shown with the guide every setup ends with */}
      <section aria-labelledby="trust-title" className="on-night section bg-night text-night-ink">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-20">
          <div>
            <h2 id="trust-title" className="display text-[clamp(2.4rem,4.4vw,4rem)] leading-[0.95]">
              Your accounts. <span className="block text-accent-night">Your rules.</span>
            </h2>
            <ul className="mt-10 border-t border-white/15">
              {principles.map((p) => (
                <li key={p.title} className="border-b border-white/10">
                  <details className="group">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.1875rem] font-[620] tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                      {p.title}
                      <Icon name="plus" className="size-4 shrink-0 text-night-ink-2 transition-transform duration-200 group-open:rotate-45" />
                    </summary>
                    <p className="pb-5 pr-8 text-small text-night-ink-2">{answer(p.q)}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>

          <figure>
            <div className="rounded-[14px] bg-ground p-7 text-ink sm:p-10">
              <p className="text-[0.875rem] text-ink-2">Your agents · page 1 of 6</p>
              <p className="display mt-4 text-[clamp(2rem,3.4vw,2.75rem)]">Morning brief</p>
              <dl className="mt-7 border-t border-rule">
                {guide.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-rule py-3.5 text-[1rem] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                    <dt className="text-ink-2">{k}</dt>
                    <dd className={k === "Never" ? "font-[650] text-accent" : ""}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figcaption className="mt-4 text-[0.9375rem] text-night-ink-2">
              A page from the guide you keep after a{" "}
              <Link href="/setup" className="tlink">
                custom setup
              </Link>
              .
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 4 · Three ways to start */}
      <section id="pricing" aria-labelledby="start-title" className="section scroll-mt-16 bg-ground">
        <div className="wrap">
          <h2 id="start-title" className="display display-m">
            Do it yourself, <span className="block text-ink/40">or have it done.</span>
          </h2>
          <ol className="mt-12 grid border-t border-ink lg:grid-cols-3">
            {offers.map((p, i) => (
              <li key={p.name} className={`flex flex-col border-b border-rule py-8 lg:border-b-0 lg:py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i < 2 ? "lg:pr-8" : ""}`}>
                <p className="text-[1.125rem] font-[620]">{p.name}</p>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="display text-[clamp(3.25rem,5vw,4.5rem)] tabular-nums">{p.price}</span>
                  {p.per && <span className="text-ink-2">{p.per}</span>}
                </p>
                <p className="mt-4 max-w-[24rem] text-[1rem] text-ink-2">{p.body}</p>
                <details className="group mt-5">
                  <summary className="tlink-quiet flex min-h-11 cursor-pointer list-none items-center gap-2 text-[0.9375rem] [&::-webkit-details-marker]:hidden">
                    What’s included
                    <Icon name="plus" className="size-3.5 transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <ul className="mt-1 grid gap-2 text-[0.9375rem]">
                    {p.includes.map((x) => (
                      <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2.5">
                        <Icon name="check" className="mt-0.5 size-4 text-accent" strokeWidth={2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="mt-auto pt-8">
                  <Link href={p.href} className={`btn btn-m ${p.primary ? "" : "btn-ghost"}`}>
                    {p.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ol>

          {next.length > 0 && (
            <div className="mt-10 flex flex-col gap-5 rounded-[14px] bg-night p-6 text-night-ink sm:p-7">
              <p className="text-[1rem]">More free packs are coming. Want to hear when yours is ready?</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-4">
                {next.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="font-[600]">{p.persona}</span>
                    <Interest persona={p.id} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 grid gap-x-10 border-t border-rule md:grid-cols-2">
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
