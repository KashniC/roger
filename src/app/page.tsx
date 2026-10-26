import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { Icon, type IconName } from "@/components/icons";
import { AgentDemo } from "@/components/home/agent-demo";
import { LibraryAgenda } from "@/components/home/library-agenda";
import { LiveSearch, type Entry } from "@/components/home/live-search";
import { PackWeek } from "@/components/home/pack-week";
import { Pipeline } from "@/components/home/pipeline";
import { WatchSentence } from "@/components/home/watch-sentence";
import { Interest } from "@/components/pack-cards";
import { Toque } from "@/components/toque";
import { ExternalIcon } from "@/components/use-case-card";
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

const lean = (u: UseCase): Entry => ({
  id: u.id,
  title: u.title,
  summary: u.summary,
  category: u.category,
  tool: u.tool,
  handle: u.handle,
  url: u.url,
});

const PER_SHELF = 8;

/** Each shelf with its count and its newest few; the library page has the rest. */
function byShelf(list: UseCase[]) {
  return categories
    .map((c) => {
      const all = list.filter((u) => u.category === c.id);
      return {
        id: c.id,
        label: c.label,
        n: all.length,
        items: all.slice(0, PER_SHELF).map(lean),
      };
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

/** Three real entries for the proof stack: an honest miss among them when there is one. */
function proofFrom(list: UseCase[]) {
  const miss = list.find((u) => u.outcome === "honest-miss");
  const rest = list.filter((u) => u !== miss && u.tool).slice(0, miss ? 2 : 3);
  return (miss ? [rest[0], miss, rest[1]] : rest).filter(Boolean);
}

const principles: { icon: IconName; title: string; body: string }[] = [
  { icon: "pen", title: "Drafts by default", body: "Nothing sends or buys on its own unless you set a rule that it can. By default it drafts and you approve." },
  { icon: "user", title: "Your accounts, yours to keep", body: "Everything runs on your own accounts. If you stop working with us, it keeps running." },
  { icon: "key", title: "No passwords kept", body: "You sign in yourself during the session. We remove any access we used at the end." },
];

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) =>
    (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf),
  );
  const shelves = byShelf(sorted);
  const tools = byTool(sorted);
  const proof = proofFrom(sorted);
  const total = all.length;
  const plans = ladderFor(settings).rungs;
  const faqs = setupFaqs(settings.planPrice);
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;
  const latest = sorted[0];
  const newest =
    latest &&
    new Date(latest.addedAt ?? latest.weekOf).toLocaleDateString("en-CA", {
      month: "long",
      day: "numeric",
      timeZone: "America/Toronto",
    });

  return (
    <>
      {/* 1 · What this is, with the library itself working on the first screen */}
      <section
        aria-labelledby="hero-title"
        data-header-tone="night"
        className="on-night relative isolate overflow-clip bg-night text-night-ink"
      >
        <div className="hero-dawn" aria-hidden="true" />
        <div className="wrap relative grid grid-cols-[minmax(0,1fr)] gap-12 pb-16 pt-12 md:pt-16 lg:grid-cols-[minmax(0,5.2fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            {newest && (
              <p className="after-lines inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pl-3 pr-4 text-[0.8125rem] text-night-ink-2 ring-1 ring-white/10">
                <span className="live-dot" aria-hidden="true" />
                Read every morning · newest added {newest}
              </p>
            )}
            <h1
              id="hero-title"
              className="lines mt-7 text-[clamp(2.75rem,4.7vw,4.5rem)] font-[650] leading-[0.97] tracking-[-0.048em] text-stretch-display sm:whitespace-nowrap"
            >
              <span className="line block">
                <span data-line className="block" style={{ "--i": 0 } as React.CSSProperties}>
                  What people’s
                </span>
              </span>
              <span className="line block">
                <span data-line className="block" style={{ "--i": 1 } as React.CSSProperties}>
                  AI agents
                </span>
              </span>
              <span className="line block">
                <span data-line className="block text-accent-night" style={{ "--i": 2 } as React.CSSProperties}>
                  actually do.
                </span>
              </span>
            </h1>
            <div className="after-lines">
              <p className="mt-7 max-w-[30rem] text-lead text-night-ink-2">
                Real wins, and honest misses, from people running Muse, Grok Bot,
                Hark and more. Read from public posts every morning, so you can
                see what yours could do, then set it up.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href={`/packs/${pack.id}`} className="btn btn-l">
                  Get the free 10-agent pack
                </Link>
                <Link href="#how" className="btn btn-l btn-ghost">
                  See how an agent works
                </Link>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[0.875rem] text-night-ink-2">
                <Icon name="external" className="size-4" />
                Every entry links to the public post it came from.
              </p>
            </div>
          </div>

          <div className="after-lines relative">
            <div className="window">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
                <span className="flex items-center gap-2 text-[0.875rem] font-[600]">
                  <Toque className="size-[18px] text-accent-night" />
                  The Roger library
                </span>
                <span className="tag bg-ok-night/10 text-ok-night">
                  <span className="live-dot" aria-hidden="true" />
                  Live
                </span>
              </div>
              <LiveSearch
                newest={sorted.slice(0, 5).map(lean)}
                total={total}
                shelves={shelves.map((s) => ({
                  id: s.id,
                  label: s.label,
                  n: s.n,
                }))}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-night-ink-2">
              <Icon name="search" className="size-4" />
              Not a picture: this is the real library. Type to search it.
            </p>
          </div>
        </div>

        {/* the library in numbers, all counted from the library itself */}
        <div className="wrap relative">
          <dl className="grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
            {[
              { v: total.toLocaleString("en-CA"), k: "use cases, each linked to its post" },
              { v: String(shelves.length), k: "shelves, from Chief of Staff to Kids" },
              { v: String(tools.length), k: "different agents named so far" },
              { v: "Daily", k: "new public posts read every morning" },
            ].map((s, i) => (
              <div
                key={s.k}
                className={`py-7 pr-4 md:py-9 ${i % 2 ? "border-l border-white/10 pl-5" : ""} ${i > 1 ? "border-t border-white/10 md:border-t-0" : ""} ${i > 0 ? "md:border-l md:border-white/10 md:pl-6" : ""}`}
              >
                <dt className="sr-only">{s.k}</dt>
                <dd>
                  <span className="block text-[clamp(1.75rem,3vw,2.5rem)] font-[640] leading-none tracking-[-0.04em] tabular-nums">{s.v}</span>
                  <span className="mt-2 block text-[0.875rem] text-night-ink-2">{s.k}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {tools.length > 0 && (
          <div className="relative border-t border-white/10 py-5">
            <div className="wrap flex items-center gap-6">
              <p className="mono hidden shrink-0 text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2 sm:block">Agents in the library</p>
              <div className={`min-w-0 flex-1 overflow-hidden ${tools.length >= 8 ? "marquee" : ""}`}>
                <ul className={tools.length >= 8 ? "marquee-track gap-y-2" : "flex flex-wrap gap-y-2"}>
                  {(tools.length >= 8 ? [0, 1] : [0]).map((copy) =>
                    tools.slice(0, 14).map((t) => (
                      <li
                        key={`${copy}-${t.name}`}
                        aria-hidden={copy === 1 ? "true" : undefined}
                        className="flex shrink-0 items-baseline gap-2 pr-10 text-[1.0625rem] font-[600] tracking-[-0.01em]"
                      >
                        {t.name}
                        <span className="mono text-[0.75rem] font-normal text-night-ink-2 tabular-nums">{t.count.toLocaleString("en-CA")}</span>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="hero-horizon" aria-hidden="true" />
      </section>

      {/* 2 · How an agent works: the walkthrough */}
      <section id="how" aria-labelledby="how-title" className="section scroll-mt-16 bg-ground">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-14" data-reveal>
            <div>
              <p className="eyebrow">How an agent works</p>
              <h2 id="how-title" className="mt-5 text-h2">
                It does the work.
                <span className="block text-ink-2">You make the call.</span>
              </h2>
            </div>
            <p className="max-w-[32rem] text-lead text-ink-2">
              The agents in the free pack draft; you approve. Follow one from
              the moment it runs to the moment you say yes.
            </p>
          </div>
          <div className="mt-14 md:mt-16" data-reveal>
            <AgentDemo />
          </div>
        </div>
      </section>

      {/* 3 · How the library grows: the architecture */}
      <section aria-labelledby="pipeline-title" className="section bg-ground-2">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-14" data-reveal>
            <div>
              <p className="eyebrow">How the library grows</p>
              <h2 id="pipeline-title" className="mt-5 text-h2">
                Read every morning.
                <span className="block text-ink-2">Kept only if it’s real.</span>
              </h2>
            </div>
            <p className="max-w-[32rem] text-lead text-ink-2">
              New public posts are read first thing each day. Only the ones
              where someone’s agent actually did something make it in.
            </p>
          </div>
          <div className="mt-14 md:mt-16" data-reveal>
            <Pipeline total={total} shelves={shelves} />
          </div>
        </div>
      </section>

      {/* 4 · Browse it, one shelf at a time */}
      <section aria-labelledby="shelf-title" className="section bg-ground">
        <div className="wrap" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Browse the library</p>
              <h2 id="shelf-title" className="mt-5 text-h2">
                Every use case,
                <span className="block text-ink-2">by what it does.</span>
              </h2>
            </div>
            <Link href="/library" className="btn btn-m btn-ink">
              See all {total.toLocaleString("en-CA")}
            </Link>
          </div>
          <div className="mt-14">
            <LibraryAgenda shelves={shelves} />
          </div>
        </div>
      </section>

      {/* 5 · Start today: the free pack as a week */}
      {pack && (
        <section data-header-tone="night" aria-labelledby="pack-title" className="on-night section relative overflow-clip bg-night text-night-ink">
          <div className="wrap" data-reveal>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
              <div>
                <p className="eyebrow">The free starter pack</p>
                <h2 id="pack-title" className="mt-5 text-h2">
                  Ten agents for a
                  <span className="block text-accent-night">business of one.</span>
                </h2>
              </div>
              <div>
                <p className="max-w-[32rem] text-lead text-night-ink-2">
                  The ten setups that show up most for people who run
                  everything themselves, each with the instruction to paste in.{" "}
                  {OPEN_IN_PACK} are open now, the rest with your email.
                </p>
                <Link href={`/packs/${pack.id}`} className="btn btn-l mt-7">
                  Get the free pack
                </Link>
              </div>
            </div>
            <div className="mt-14 rounded-[18px] bg-night-2 p-3 ring-1 ring-white/[0.07] sm:p-5 md:mt-16">
              <PackWeek agents={pack.agents} openCount={OPEN_IN_PACK} packHref={`/packs/${pack.id}`} />
            </div>
            {next.length > 0 && (
              <div className="mt-16 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
                <div>
                  <h3 className="text-[1.75rem] font-[640] leading-tight tracking-[-0.03em]">Packs coming next</h3>
                  <p className="mt-2 text-[0.9375rem] text-night-ink-2">Leave your email and we’ll tell you when yours is ready.</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {next.map((p) => (
                    <li key={p.id} className="flex flex-col rounded-[14px] bg-white/[0.03] p-5 ring-1 ring-white/[0.07]">
                      <p className="text-title">{p.persona}</p>
                      <p className="mt-1 flex-1 text-small text-night-ink-2">{p.blurb}</p>
                      <div className="mt-5">
                        <Interest persona={p.id} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6 · Why trust it: proof you can click, rules you set */}
      <section aria-labelledby="trust-title" className="section bg-ground">
        <div className="wrap">
          <div className="max-w-[44rem]" data-reveal>
            <p className="eyebrow">Why trust it</p>
            <h2 id="trust-title" className="mt-5 text-h2">
              Proof you can click.
              <span className="block text-ink-2">Rules you set.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-14 md:mt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16" data-reveal>
            {/* real entries from the library, as they appear in it */}
            <figure>
              <ul className="relative grid gap-3">
                {proof.map((u, i) => (
                  <li key={u.id} className={i === 1 ? "lg:translate-x-8" : ""}>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group block rounded-[14px] bg-surface p-5 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_18px_40px_-28px_rgb(0_0_0/0.35)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-accent),0_18px_40px_-28px_rgb(0_0_0/0.35)] sm:p-6"
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="tag bg-ground-2 text-ink-2">{u.tool || "Any agent"}</span>
                        {u.outcome === "honest-miss" && <span className="tag bg-[#fbeee9] text-[#9a3a26]">Honest miss</span>}
                      </span>
                      <span className="mt-4 block text-[1.1875rem] font-[620] leading-snug tracking-[-0.02em]">{u.title}</span>
                      <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-2">{u.summary}</span>
                      <span className="mt-4 flex items-center gap-1.5 text-[0.875rem] font-[560] text-ink group-hover:text-accent">
                        {u.handle} · original post
                        <ExternalIcon className="size-3" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <figcaption className="mt-5 max-w-[34rem] text-small text-ink-2">
                Straight from the library. Each entry is rewritten in our words
                and links to the public post it came from. The misses stay in too.
              </figcaption>
            </figure>

            <div className="flex flex-col gap-10">
              <ul className="grid gap-7">
                {principles.map((p) => (
                  <li key={p.title} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4">
                    <span className="grid size-11 place-items-center rounded-full bg-accent-wash text-accent">
                      <Icon name={p.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block text-title">{p.title}</span>
                      <span className="mt-1 block text-small text-ink-2">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* the guide every setup ends with, as on /setup */}
              <figure>
                <div className="window-light p-6">
                  <p className="flex items-center justify-between gap-3">
                    <span className="mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-2">Your agents · page 1 of 6</span>
                    <Icon name="shield" className="size-5 text-accent" />
                  </p>
                  <p className="mt-3 text-[1.25rem] font-[620] tracking-[-0.02em]">Morning brief</p>
                  <dl className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[0.9375rem]">
                    <dt className="text-ink-2">Runs</dt>
                    <dd>Weekdays at 6:45am</dd>
                    <dt className="text-ink-2">Reads</dt>
                    <dd>Your email, calendar and task list</dd>
                    <dt className="text-ink-2">Never</dt>
                    <dd className="font-[600]">Replies, books or pays on its own</dd>
                    <dt className="text-ink-2">To change it</dt>
                    <dd>Tell it in plain words: “skip Fridays”</dd>
                  </dl>
                </div>
                <figcaption className="mt-3 text-[0.875rem] text-ink-2">
                  A sample page from the guide you keep after a{" "}
                  <Link href="/setup" className="tlink">custom setup</Link>.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Pricing: free, once, or monthly */}
      <section id="pricing" aria-labelledby="plans-title" className="section scroll-mt-16 bg-ground-2">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end lg:gap-14" data-reveal>
            <div>
              <p className="eyebrow">Pricing</p>
              <h2 id="plans-title" className="mt-5 text-h2">
                Free, once,
                <span className="block text-ink-2">or monthly.</span>
              </h2>
            </div>
            <p className="max-w-[32rem] text-lead text-ink-2">
              Set it up yourself with the free pack, or have Peter design and
              install yours. The monthly plan is optional.
            </p>
          </div>

          <ol className="mt-14 grid gap-4 md:mt-16 lg:grid-cols-3" data-reveal>
            {plans.map((p, i) => {
              const featured = i === 1;
              return (
                <li
                  key={p.name}
                  className={`flex flex-col rounded-[18px] p-6 sm:p-8 ${
                    featured
                      ? "on-night bg-night text-night-ink shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] lg:-my-4 lg:py-12"
                      : "bg-surface shadow-[0_0_0_1px_rgb(0_0_0/0.06)]"
                  }`}
                >
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-title">{p.name}</span>
                    <span className={`tag ${featured ? "bg-accent-night text-night" : "bg-ground-2 text-ink-2"}`}>{p.step}</span>
                  </p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="text-[clamp(3rem,5vw,4rem)] font-[650] leading-none tracking-[-0.05em] tabular-nums">{p.price}</span>
                    {p.per && <span className={featured ? "text-night-ink-2" : "text-ink-2"}>{p.per}</span>}
                  </p>
                  <p className={`mt-5 text-[1rem] ${featured ? "text-night-ink-2" : "text-ink-2"}`}>{p.body}</p>
                  <ul className={`mt-6 grid gap-3 border-t pt-6 text-[0.9375rem] ${featured ? "border-white/10" : "border-rule"}`}>
                    {p.includes.map((x) => (
                      <li key={x} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                        <Icon name="check" className={`mt-0.5 size-[18px] ${featured ? "text-accent-night" : "text-accent"}`} strokeWidth={2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Link href={p.href} className={`btn btn-l w-full ${featured ? "" : i === 0 ? "btn-ink" : "btn-ghost"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-10 text-small text-ink-2">
            Prices in CAD, no HST charged. Running a whole company?{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
          </p>
        </div>
      </section>

      {/* 8 · What people ask */}
      <section aria-labelledby="faq-title" className="section bg-ground">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16" data-reveal>
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="mt-5 text-h2">What people ask</h2>
            {siteConfig.contactEmail && (
              <p className="mt-6 text-small text-ink-2">
                Something else?{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="tlink">
                  {siteConfig.contactEmail}
                </a>
              </p>
            )}
          </div>
          <div className="border-t border-rule">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-rule">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.125rem] font-[600] tracking-[-0.015em] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ground-2 text-ink-2 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                    <Icon name="plus" className="size-4" strokeWidth={2} />
                  </span>
                </summary>
                <p className="max-w-[40rem] pb-6 pr-12 text-small text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Close: watch for it, or start now */}
      <section data-header-tone="night" id="watch" aria-labelledby="watch-title" className="on-night relative isolate scroll-mt-16 overflow-clip bg-night text-night-ink">
        <Image
          src={dawn}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          className="drift -z-10 object-cover object-[50%_60%] opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_12_14/0.92)_0%,rgb(12_12_14/0.55)_55%,rgb(12_12_14/0.85)_100%)]" aria-hidden="true" />
        <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16" data-reveal>
          <div>
            <p className="eyebrow">Not in the library yet?</p>
            <h2 id="watch-title" className="mt-5 text-[clamp(2.5rem,5vw,4.25rem)] font-[650] leading-[1] tracking-[-0.045em]">
              Tell us what you want your agent to do.
            </h2>
            <p className="mt-6 max-w-[30rem] text-lead text-night-ink-2">
              We read new posts every morning. The day one matches, you get one
              email with the link, and every email has a link to stop.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/packs/${pack.id}`} className="btn btn-l">
                Get the free pack
              </Link>
              <Link href="/setup" className="btn btn-l btn-ghost">
                Book a custom setup
              </Link>
            </div>
          </div>
          <div className="rounded-[18px] bg-ground p-6 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] sm:p-8">
            <p className="mb-5 flex items-center gap-2 text-[0.875rem] font-[600] text-ink-2">
              <Icon name="bell" className="size-[18px] text-accent" />
              Watch for a use case
            </p>
            <WatchSentence />
          </div>
        </div>
        <p className="wrap pb-6 text-[0.8125rem] text-night-ink-2">
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
