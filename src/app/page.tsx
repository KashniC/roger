import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { LibraryAgenda } from "@/components/home/library-agenda";
import { LiveSearch, type Entry } from "@/components/home/live-search";
import { PackBoard } from "@/components/home/pack-board";
import { PlanStage } from "@/components/home/plan-stage";
import { WatchSentence } from "@/components/home/watch-sentence";
import { Interest } from "@/components/pack-cards";
import { VideoLoop } from "@/components/video-loop";
import { credits } from "@/data/credits";
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

export default async function LibraryHome() {
  const [all, settings] = await Promise.all([getUseCases(), getSettings()]);
  const sorted = [...all].sort((a, b) =>
    (b.addedAt ?? b.weekOf).localeCompare(a.addedAt ?? a.weekOf),
  );
  const shelves = byShelf(sorted);
  const total = all.length;
  const plans = ladderFor(settings).rungs;
  const pack = livePack;
  const next = packs.filter((p) => p.status === "soon");
  const dawnCredit = credits.torontoDawn;
  const aerial = credits.torontoAerial;
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
      {/* What is this, and can I use it right now? The library, working. */}
      <section
        aria-labelledby="hero-title"
        className="on-night bg-night text-night-ink"
      >
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 pb-24 pt-14 md:pt-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-start lg:gap-14 lg:pb-32 lg:pt-28">
          <div>
            <h1
              id="hero-title"
              className="lines text-[clamp(2.75rem,4.6vw,4.5rem)] md:whitespace-nowrap font-[650] leading-[0.98] tracking-[-0.045em] text-stretch-display"
            >
              <span className="line">
                <span data-line style={{ "--i": 0 } as React.CSSProperties}>
                  What people’s
                </span>
              </span>
              <span className="line">
                <span data-line style={{ "--i": 1 } as React.CSSProperties}>
                  AI agents do
                </span>
              </span>
            </h1>
            <div className="after-lines">
              <p className="mt-8 max-w-[28rem] text-lead text-night-ink">
                Real wins from Muse, Grok Bot, Hark and more, read from public
                posts every morning. Type what you want yours to do.
              </p>
              {newest && (
                <p className="mt-6 max-w-[28rem] text-small text-night-ink-2">
                  {total.toLocaleString("en-CA")} so far, the newest added{" "}
                  {newest}. New posts are read first thing every morning.
                </p>
              )}
              {pack && (
                <Link
                  href={`/packs/${pack.id}`}
                  className="btn btn-l btn-light mt-10"
                >
                  Get the free 10-agent pack
                </Link>
              )}
            </div>
          </div>
          <div className="after-lines">
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
        </div>
      </section>

      {/* Browse it: one shelf at a time */}
      <section
        aria-labelledby="shelf-title"
        className="bg-ground py-28 md:py-40"
      >
        <div className="wrap" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="shelf-title" className="text-h2">
              <span className="block text-ink-2">Every use case,</span>
              <span className="block">by what it does.</span>
            </h2>
            <Link href="/library" className="btn btn-m btn-ink">
              See all {total.toLocaleString("en-CA")}
            </Link>
          </div>
          <div className="mt-14">
            <LibraryAgenda shelves={shelves} />
          </div>
        </div>
      </section>

      {/* Start today: the free pack, agent by agent */}
      {pack && (
        <section
          aria-labelledby="pack-title"
          className="on-night bg-night py-28 text-night-ink md:py-40"
        >
          <div className="wrap" data-reveal>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-14">
              <h2 id="pack-title" className="text-h2">
                Ten agents for a business of one
              </h2>
              <div>
                <p className="text-lead text-night-ink">
                  The free solopreneur pack, each agent with the instruction to
                  paste in. {OPEN_IN_PACK} are open now, the rest with your
                  email.
                </p>
                <Link
                  href={`/packs/${pack.id}`}
                  className="btn btn-l btn-light mt-6"
                >
                  Get the free pack
                </Link>
              </div>
            </div>
            <div className="mt-14">
              <PackBoard agents={pack.agents} openCount={OPEN_IN_PACK} />
            </div>
            {next.length > 0 && (
              <div className="mt-20 grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
                <h3 className="text-h2">Packs coming next</h3>
                <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
                  {next.map((p) => (
                    <li key={p.id}>
                      <p className="text-title">{p.persona}</p>
                      <p className="mt-1 text-small text-night-ink-2">
                        {p.blurb}
                      </p>
                      <div className="mt-4">
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

      {/* Or have it done: three plans, one figure */}
      <section
        aria-labelledby="plans-title"
        className="bg-ground py-28 md:py-40"
      >
        <div className="wrap" data-reveal>
          <h2 id="plans-title" className="text-h2">
            Free, once, or monthly.
          </h2>
          <div className="mt-14">
            <PlanStage plans={plans} />
          </div>
          <p className="mt-16 text-small text-ink-2">
            Prices in CAD, no HST charged. Running a whole company?{" "}
            <Link href="/companies" className="tlink chev">
              Roger for companies
            </Link>
          </p>
        </div>
      </section>

      {/* The morning: where the library is read */}
      <figure>
        <div className="relative h-[56svh] min-h-[22rem] overflow-clip bg-night">
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
          <span>
            Toronto from Sam Smith Park, just after sunrise. The library reads
            the night’s posts first thing each morning.
          </span>
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

      {/* Nothing yet? We'll tell you the morning there is. */}
      <section
        id="watch"
        aria-labelledby="watch-title"
        className="scroll-mt-16 bg-ground pt-28 md:pt-40"
      >
        <div
          className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16"
          data-reveal
        >
          <div>
            <h2 id="watch-title" className="text-h2">
              Not in the library yet?
            </h2>
            <div className="mt-6">
              <WatchSentence />
            </div>
            <p className="mt-6 max-w-[36rem] text-small text-ink-2">
              We read new posts every morning. The day one matches, you get one
              email with the link, and every email has a link to stop.
            </p>
          </div>
          <figure>
            <div className="aspect-[16/10] overflow-clip rounded-[8px] bg-night">
              <VideoLoop
                webm="/media/toronto-aerial.webm"
                mp4="/media/toronto-aerial.mp4"
                poster="/media/toronto-aerial.jpg"
                label="Aerial view of downtown Toronto and the CN Tower at first light"
                className="size-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-small">
              Downtown Toronto from the air, lights still on.{" "}
              <span className="text-ink-2">
                Video:{" "}
                <a
                  href={aerial.source}
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {aerial.by}
                </a>
                ,{" "}
                <a
                  href={aerial.licenceUrl}
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {aerial.licence}
                </a>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
