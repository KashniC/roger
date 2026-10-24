import type { Metadata } from "next";
import Link from "next/link";
import { AskBox } from "@/components/ask-box";
import { PackCards } from "@/components/pack-cards";
import { Rail, RailItem } from "@/components/rail";
import { ExternalIcon, UseCaseCard } from "@/components/use-case-card";
import { categories, categoryLabel, type UseCase, type UseCaseCategory } from "@/data/library";
import { packs } from "@/data/packs";
import { ladderFor } from "@/data/ladder";
import { getSettings } from "@/lib/settings";
import { getUseCases } from "@/lib/library-source";

export const metadata: Metadata = {
  title: { absolute: "Roger: what people’s AI agents actually do" },
  description:
    "A growing library of real AI agent use cases from people running Muse, Grok Bot, Hark and more, collected from public posts every morning. Search it, watch for what you need, and get a free starter pack.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const examples = ["meal plans", "inbox clean-up", "gift cards", "lead follow-up", "scam guard"];
const waiting = ["Reconcile every line in QuickBooks, every time", "Book a table the moment one opens up", "Catch a refund that came back short"];

function newest(list: UseCase[], n: number) {
  return [...list].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf)).slice(0, n);
}

function shelves(list: UseCase[]) {
  const by = new Map<UseCaseCategory, UseCase[]>();
  for (const u of list) by.set(u.category, [...(by.get(u.category) ?? []), u]);
  return categories
    .map((c) => ({ id: c.id, label: c.label, items: by.get(c.id) ?? [] }))
    .filter((s) => s.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length);
}

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const ladder = ladderFor(settings);
  const fresh = newest(all, 3);
  const rows = shelves(all);
  const latest = fresh[0]?.addedAt ?? fresh[0]?.weekOf;

  return (
    <>
      {/* 1 · What is this, and can I use it right now? */}
      <section aria-labelledby="hero-title" className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end lg:gap-14 lg:pb-20">
        <div>
          <p className="text-small font-[560] text-ink-2">The Roger library · {all.length} use cases, more every morning</p>
          <h1 id="hero-title" className="mt-4 text-display text-stretch-display md:max-w-[15ch]">
            What are people’s AI agents actually doing?
          </h1>
          <p className="mt-6 max-w-[36rem] text-lead text-ink-2">
            Real things people get from Muse, Grok Bot, Hark and more, collected from public posts every day. Find yours, or tell us what you’re waiting for.
          </p>
          <div id="hero-cta" className="mt-8 max-w-[42rem]">
            <AskBox count={all.length} examples={examples} />
          </div>
        </div>

        {/* Float: the newest finds, lit like a notification stack */}
        <aside aria-labelledby="fresh-title" className="lit-card lit-card-calm rounded-[32px] p-6 sm:p-7">
          <p className="flex items-center justify-between text-meta text-white/70">
            <span id="fresh-title" className="flex items-center gap-2 font-[560] text-white">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#f0b88f] shadow-[0_0_0_4px_rgba(240,184,143,0.18)]" />
              Newest in the library
            </span>
            {latest && <span>{new Date(latest).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span>}
          </p>
          <ul className="rise-in mt-4 space-y-2">
            {fresh.map((u) => (
              <li key={u.id}>
                <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="block rounded-[18px] border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.1]">
                  <span className="block text-[1.0625rem] font-[600] leading-snug tracking-[-0.015em]">{u.title}</span>
                  <span className="mt-1.5 flex items-center gap-1.5 text-meta text-white/75">
                    {[u.tool, u.handle].filter(Boolean).join(" · ")}
                    <ExternalIcon className="size-3" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* 2 · Where do I start? A free pack for who I am */}
      <section aria-labelledby="packs-title" className="border-t border-rule bg-ground-2">
        <div className="wrap py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[40rem]">
              <h2 id="packs-title" className="text-h2">
                Start with a free pack.
              </h2>
              <p className="mt-3 text-lead text-ink-2">Ten agents to set up, picked from the library for how you work. Solopreneurs first; tell us which pack you want next.</p>
            </div>
          </div>
          <div className="mt-10">
            <PackCards packs={packs} />
          </div>
        </div>
      </section>

      {/* 3 · Browse: a shelf per category */}
      <section id="shelf" aria-labelledby="shelf-title" className="scroll-mt-14 bg-ground py-20 md:py-28">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2 id="shelf-title" className="text-h2 lg:text-h3">
              Browse the library
            </h2>
            <nav aria-label="Categories" className="mt-6 lg:sticky lg:top-24">
              <ul className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:block lg:px-0">
                {rows.map((r) => (
                  <li key={r.id} className="shrink-0 lg:border-b lg:border-rule">
                    <a href={`#cat-${r.id}`} className="chip flex min-h-10 items-center gap-3 whitespace-nowrap rounded-full border border-rule-strong px-4 text-small text-ink-2 transition-colors hover:text-ink lg:min-h-11 lg:justify-between lg:rounded-none lg:border-0 lg:px-0">
                      {r.label}
                      <span className="text-meta">{r.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="min-w-0 space-y-16">
            {rows.map((r) => (
              <div key={r.id} id={`cat-${r.id}`} className="scroll-mt-20">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h3">{categoryLabel(r.id)}</h3>
                  <Link href={`/library?cat=${r.id}`} className="tlink chev whitespace-nowrap text-small">
                    See all {r.items.length}
                  </Link>
                </div>
                <div className="mt-5">
                  <Rail label={`${r.label} use cases`} inset={false}>
                    {r.items.slice(0, 8).map((u) => (
                      <RailItem key={u.id}>
                        <UseCaseCard u={u} size="rail" />
                      </RailItem>
                    ))}
                  </Rail>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · What if nobody's agent does what I need yet? */}
      <section id="watch" aria-labelledby="watch-title" className="on-night scroll-mt-14 bg-night text-night-ink">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <h2 id="watch-title" className="max-w-[14ch] text-h2">
              Waiting for an agent that can do it?
            </h2>
            <p className="mt-4 max-w-[32rem] text-lead text-night-ink/80">
              Tell us what you want. The library reads new posts every morning, and the day someone’s agent does it, you get an email with the link.
            </p>
            <ul className="mt-8 space-y-2 text-small text-night-ink-2">
              {waiting.map((w) => (
                <li key={w} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#f0b88f]" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <AskBox count={all.length} examples={[]} tone="night" />
        </div>
      </section>

      {/* 5 · Can someone just set it up for me? */}
      <section aria-labelledby="ladder-title" className="bg-ground">
        <div className="wrap py-24 md:py-32">
          <h2 id="ladder-title" className="max-w-[20ch] text-h2">
            {ladder.heading}
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {ladder.rungs.map((r, i) => (
              <li key={r.name} className={`flex flex-col rounded-[var(--radius-object)] border p-7 ${i === 1 ? "border-ink bg-surface shadow-[0_30px_60px_-40px_rgba(0,0,0,0.4)]" : "border-rule bg-surface"}`}>
                <p className="text-small font-[600] text-ink-2">{r.step}</p>
                <h3 className="mt-2 text-title">{r.name}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-h2 leading-none">{r.price}</span>
                  <span className="text-small text-ink-2">{r.per}</span>
                </p>
                <p className="mt-4 text-small text-ink-2">{r.body}</p>
                <div className="mt-auto pt-7">
                  <Link href={r.href} className={i === 1 ? "btn btn-m" : "tlink chev text-small"}>
                    {r.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 border-t border-rule pt-6 text-small text-ink-2">
            Running a whole company?{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
