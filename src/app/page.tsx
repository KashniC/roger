import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Icon, type IconName } from "@/components/icons";
import { AgentDemo } from "@/components/home/agent-demo";
import { Ecosystem } from "@/components/home/ecosystem";
import { HeroStage } from "@/components/home/hero-stage";
import { HowStory } from "@/components/home/how-story";
import { LibraryWall } from "@/components/home/library-wall";
import type { Entry } from "@/components/home/live-search";
import { PackCalendar } from "@/components/home/pack-calendar";
import { AgentVisual, IntakeVisual, ShelfVisual } from "@/components/home/story-visuals";
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

/** The agents named in the library, most often first. */
function byTool(list: UseCase[]) {
  const n = new Map<string, number>();
  for (const u of list) {
    const t = u.tool.trim();
    if (t) n.set(t, (n.get(t) ?? 0) + 1);
  }
  return [...n.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

const guardrails: { icon: IconName; title: string; body: string }[] = [
  { icon: "pen", title: "Drafts by default", body: "Nothing sends, books or buys unless you set a rule that it can." },
  { icon: "user", title: "Your own accounts", body: "It runs on your logins, and keeps running if you stop working with us." },
  { icon: "key", title: "No passwords kept", body: "You sign in yourself. Any access used during setup is removed after." },
];

function Head({ kicker, children, id, align = "left", night = false, size = "display-m" }: { kicker: string; children: React.ReactNode; id: string; align?: "left" | "center"; night?: boolean; size?: string }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[52rem] text-center" : "max-w-[52rem]"}>
      <p className={`kicker ${night ? "text-accent-night" : "text-accent"}`}>{kicker}</p>
      <h2 id={id} className={`display mt-5 ${size}`}>
        {children}
      </h2>
    </div>
  );
}

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) => (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf));
  const entries = sorted.map(lean);
  const withTool = entries.filter((e) => e.tool);
  const shelves = byShelf(sorted);
  const tools = byTool(sorted);
  const total = all.length;
  const plans = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;
  const latest = sorted[0];
  const newest =
    latest &&
    new Date(latest.addedAt ?? latest.weekOf).toLocaleDateString("en-CA", { month: "long", day: "numeric", timeZone: "America/Toronto" });
  const tickerA = entries.slice(0, 18);
  const tickerB = entries.slice(18, 36).length > 6 ? entries.slice(18, 36) : entries.slice(0, 18).reverse();

  return (
    <>
      {/* 1 · Hero: the product, working, before the reading starts */}
      <section aria-labelledby="hero-title" data-header-tone="night" className="on-night relative isolate overflow-clip bg-night text-night-ink">
        <div className="stage-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="hero-dawn -z-10" aria-hidden="true" />
        <div className="wrap pt-12 md:pt-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7.4fr)_minmax(0,4fr)] lg:items-end lg:gap-12">
            <div>
              {newest && (
                <p className="after-lines inline-flex items-center gap-2.5 text-[0.8125rem] text-night-ink-2">
                  <span className="live-dot" aria-hidden="true" />
                  Read every morning · newest added {newest}
                </p>
              )}
              <h1 id="hero-title" className="lines display mt-6 text-[clamp(3rem,7vw,6.5rem)]">
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
            </div>
            <div className="after-lines lg:pb-3">
              <p className="max-w-[22rem] text-lead text-night-ink-2">
                Real wins, and honest misses, from public posts. Find what yours could do, then set it up.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free 10-agent pack
                </Link>
                <Link href="#how" className="tlink chev py-2 text-[1rem]">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap-wide after-lines mt-14 pb-20 md:mt-16 md:pb-28">
          <HeroStage
            intake={withTool.slice(5, 8).length === 3 ? withTool.slice(5, 8) : withTool.slice(0, 3)}
            newest={entries.slice(0, 5)}
            total={total}
            shelves={shelves.map(({ id, label, n }) => ({ id, label, n }))}
          />
        </div>
        {tools.length > 0 && (
          <div className="border-t border-white/[0.08]">
            <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-2 py-5">
              <span className="kicker text-night-ink-2">Agents in the library</span>
              {tools.slice(0, 8).map((t) => (
                <span key={t.name} className="flex items-baseline gap-2 text-[1rem] font-[600] text-night-ink/90">
                  {t.name}
                  <span className="mono text-[0.75rem] font-normal text-night-ink-2">{t.count.toLocaleString("en-CA")}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2 · The breadth, in one glance: real titles, moving */}
      <section aria-label="Recent use cases" className="overflow-clip border-b border-rule bg-ground py-14 md:py-20">
        <p className="wrap kicker text-ink-2">
          <span className="text-accent">{total.toLocaleString("en-CA")}</span> things people’s agents have done, so far
        </p>
        <div className="ticker-wrap marquee mt-8 grid gap-3">
          {[tickerA, tickerB].map((row, r) => (
            <div key={r} className={`ticker ${r ? "ticker-rev" : ""}`} style={{ "--ticker-dur": `${110 + r * 20}s` } as React.CSSProperties}>
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1 || r === 1 ? "true" : undefined} className="flex shrink-0 items-center">
                  {row.map((e) => (
                    <li key={`${copy}-${e.id}`} className="flex shrink-0 items-center whitespace-nowrap text-[clamp(1.375rem,2.6vw,2.25rem)] font-[620] tracking-[-0.035em]">
                      <span className={r ? "text-ink/35" : ""}>{e.title}</span>
                      <span className="mx-6 size-2 rounded-full bg-accent/70 md:mx-9" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3 · How it works: one pinned interface, three chapters */}
      <section id="how" aria-labelledby="how-title" className="section scroll-mt-16 bg-ground">
        <div className="wrap">
          <div data-reveal>
            <Head kicker="How Roger works" id="how-title">
              From someone’s post
              <span className="block text-ink/40">to your agent.</span>
            </Head>
          </div>
          <div className="mt-6 lg:mt-0">
            <HowStory
              steps={[
                { n: "01", title: "Read every morning.", body: "New public posts are read first thing. Only real things someone’s agent did are kept.", visual: <IntakeVisual kept={withTool.slice(0, 4)} /> },
                { n: "02", title: "Filed where you’ll find it.", body: `Rewritten in our words, linked to the original post, put on one of ${shelves.length} shelves.`, visual: <ShelfVisual shelves={shelves} entry={withTool[0]} total={total} /> },
                { n: "03", title: "Running on your agent.", body: "Set up a free pack yourself, or have Peter install yours on your own accounts.", visual: <AgentVisual /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4 · The library: a wall of shelves, a deck of real entries */}
      <section aria-labelledby="library-title" className="section relative overflow-clip bg-ground-2">
        <div className="paper-grid pointer-events-none absolute inset-x-0 top-0 h-[36rem]" aria-hidden="true" />
        <div className="wrap relative" data-reveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end">
            <div>
              <p className="kicker text-accent">The library</p>
              <h2 id="library-title" className="display mt-5 text-[clamp(4.5rem,15vw,12rem)] tabular-nums">
                {total.toLocaleString("en-CA")}
              </h2>
            </div>
            <div className="lg:pb-6">
              <p className="text-lead text-ink-2">Use cases on {shelves.length} shelves. Pick one to flick through what’s newest.</p>
              <Link href="/library" className="tlink chev mt-4 inline-block py-1 text-[1rem]">
                Search all of them
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mt-12" data-reveal>
          <LibraryWall shelves={shelves} />
        </div>
      </section>

      {/* 5 · Inside an agent: the console */}
      <section aria-labelledby="console-title" data-header-tone="night" className="on-night section relative isolate overflow-clip bg-night text-night-ink">
        <div className="glow-copper pointer-events-none absolute left-1/2 top-[55%] -z-10 size-[min(1300px,160vw)] -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden="true" />
        <div className="wrap" data-reveal>
          <Head kicker="Inside an agent" id="console-title" align="center" night>
            It does the work.
            <span className="block text-night-ink/45">You make the call.</span>
          </Head>
          <div className="mt-14 md:mt-20">
            <AgentDemo />
          </div>
        </div>
      </section>

      {/* 6 · Your agent, your accounts, your rules */}
      <section aria-labelledby="eco-title" className="section bg-ground">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,5.2fr)_minmax(0,6.8fr)] lg:gap-14" data-reveal>
          <div>
            <Head kicker="Works with what you have" id="eco-title" size="text-[clamp(2.4rem,4vw,3.75rem)] leading-[0.95]">
              Your agent.
              <span className="block">Your accounts.</span>
              <span className="block text-accent">Your rules.</span>
            </Head>
            <ul className="mt-10 grid gap-0 border-t border-rule">
              {guardrails.map((g) => (
                <li key={g.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-rule py-5">
                  <Icon name={g.icon} className="mt-0.5 size-6 text-accent" />
                  <span>
                    <span className="block text-[1.125rem] font-[640] tracking-[-0.02em]">{g.title}</span>
                    <span className="mt-1 block text-[0.9375rem] text-ink-2">{g.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Ecosystem tools={tools.map((t) => t.name)} />
        </div>
      </section>

      {/* 7 · The free pack, as a week */}
      {pack && (
        <section aria-labelledby="pack-title" data-header-tone="night" className="on-night section relative overflow-clip bg-night text-night-ink">
          <div className="wrap" data-reveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end">
              <Head kicker="The free starter pack" id="pack-title" night>
                Ten agents for a
                <span className="block text-accent-night">business of one.</span>
              </Head>
              <div className="lg:pb-2">
                <p className="text-lead text-night-ink-2">{OPEN_IN_PACK} open now, the rest with your email. Each comes with the instruction to paste in.</p>
                <Link href={`/packs/${pack.id}`} className="btn btn-l mt-7">
                  Get the free pack
                </Link>
              </div>
            </div>
            <div className="mt-14 md:mt-16">
              <PackCalendar agents={pack.agents} openCount={OPEN_IN_PACK} packHref={`/packs/${pack.id}`} />
            </div>
            {next.length > 0 && (
              <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-start">
                <p className="kicker pt-1 text-night-ink-2">Packs coming next</p>
                <ul className="grid gap-px overflow-hidden rounded-[16px] bg-white/[0.07] sm:grid-cols-3">
                  {next.map((p) => (
                    <li key={p.id} className="flex flex-col gap-4 bg-night p-5">
                      <span>
                        <span className="block text-[1.25rem] font-[640] tracking-[-0.02em]">{p.persona}</span>
                        <span className="mt-1 block text-[0.9375rem] text-night-ink-2">{p.blurb}</span>
                      </span>
                      <Interest persona={p.id} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8 · Pricing: one panel, three ways in */}
      <section id="pricing" aria-labelledby="plans-title" className="section scroll-mt-16 bg-ground-2">
        <div className="wrap" data-reveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end">
            <Head kicker="Pricing" id="plans-title">
              Free, once,
              <span className="block text-ink/40">or monthly.</span>
            </Head>
            <p className="text-small text-ink-2 lg:pb-3">
              Prices in CAD, no HST charged. Running a whole company?{" "}
              <Link href="/companies" className="tlink chev">
                Roger for companies
              </Link>
            </p>
          </div>
          <ol className="mt-14 grid overflow-hidden rounded-[24px] bg-surface shadow-[0_0_0_1px_rgb(27_26_24/0.08),0_40px_80px_-50px_rgb(0_0_0/0.4)] lg:grid-cols-3">
            {plans.map((p, i) => {
              const featured = i === 1;
              return (
                <li key={p.name} className={`flex flex-col p-7 sm:p-9 ${featured ? "on-night bg-night text-night-ink" : ""} ${i === 2 ? "border-t border-rule lg:border-l lg:border-t-0" : ""}`}>
                  <p className={`kicker ${featured ? "text-accent-night" : "text-ink-2"}`}>{p.step}</p>
                  <p className="mt-4 text-[1.375rem] font-[640] tracking-[-0.025em]">{p.name}</p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="display text-[clamp(3.75rem,6vw,5.25rem)] tabular-nums">{p.price}</span>
                    {p.per && <span className={featured ? "text-night-ink-2" : "text-ink-2"}>{p.per}</span>}
                  </p>
                  <ul className={`mt-8 grid gap-3 text-[0.9375rem] ${featured ? "text-night-ink" : ""}`}>
                    {p.includes.map((x) => (
                      <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                        <Icon name="check" className={`mt-0.5 size-[18px] ${featured ? "text-accent-night" : "text-accent"}`} strokeWidth={2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <Link href={p.href} className={`btn btn-l w-full ${featured ? "" : i === 0 ? "btn-ink" : "btn-ghost"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 9 · Questions */}
      <section aria-labelledby="faq-title" className="section bg-ground">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16" data-reveal>
          <div>
            <Head kicker="Questions" id="faq-title">
              Good to know.
            </Head>
            {siteConfig.contactEmail && (
              <p className="mt-6 text-small text-ink-2">
                Something else?{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="tlink">
                  {siteConfig.contactEmail}
                </a>
              </p>
            )}
          </div>
          <div className="border-t border-ink/80">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-rule">
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.1875rem] font-[620] tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-rule-strong text-ink-2 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    <Icon name="plus" className="size-4" strokeWidth={2} />
                  </span>
                </summary>
                <p className="max-w-[40rem] pb-6 pr-14 text-small text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · Close: one obvious next step, or a watch */}
      <section id="watch" aria-labelledby="watch-title" data-header-tone="night" className="on-night relative isolate scroll-mt-16 overflow-clip bg-night text-night-ink">
        <Image src={dawn} alt="" fill sizes="100vw" placeholder="blur" className="drift -z-10 object-cover object-[50%_62%] opacity-70" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_14_13/0.95)_0%,rgb(15_14_13/0.5)_50%,rgb(15_14_13/0.9)_100%)]" aria-hidden="true" />
        <div className="wrap pb-10 pt-28 md:pt-40" data-reveal>
          <h2 id="watch-title" className="display display-l max-w-[13ch]">
            Find what your agent could do <span className="text-accent-night">next.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`/packs/${pack.id}`} className="btn btn-l">
              Get the free 10-agent pack
            </Link>
            <Link href="/setup" className="tlink chev py-2 text-[1rem]">
              Or have it set up for you
            </Link>
          </div>
          <div className="mt-20 grid gap-6 border-t border-white/15 pt-10 md:mt-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center">
            <p className="flex items-start gap-3 text-[1.0625rem] text-night-ink-2">
              <Icon name="bell" className="mt-1 size-5 shrink-0 text-accent-night" />
              Not in the library yet? Leave a watch. One email the morning it shows up, with a link to stop.
            </p>
            <div className="rounded-[18px] bg-ground p-5 text-ink sm:p-7">
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
