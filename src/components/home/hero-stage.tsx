import { Icon } from "@/components/icons";
import { Toque } from "@/components/toque";
import { LiveSearch, type Entry } from "./live-search";

/**
 * The hero's product stage, read left to right the way Roger works: public
 * posts come in each morning, the ones that hold up land in the library (the
 * real, working search in the middle), and a setup like it runs on someone's
 * own agent. The side panels are illustrations and say so; the centre is live.
 */
export function HeroStage({
  intake,
  newest,
  total,
  shelves,
}: {
  intake: Entry[];
  newest: Entry[];
  total: number;
  shelves: { id: string; label: string; n: number }[];
}) {
  return (
    <div className="relative">
      <div className="glow-copper pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_56px_minmax(0,1.42fr)_56px_minmax(0,1fr)] xl:items-center xl:gap-0">
        {/* 1 · posts arriving */}
        <div className="order-2 xl:order-none">
          <Panel title="This morning’s posts" tag="Illustration">
            <ul className="grid gap-2 p-3">
              {intake.slice(0, 3).map((e, i) => (
                <li key={e.id} className="rounded-[10px] bg-white/[0.035] p-3 ring-1 ring-white/[0.06]">
                  <p className="flex items-center justify-between gap-2 text-[0.75rem] text-night-ink-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/10 text-[0.625rem] font-[700] text-night-ink">𝕏</span>
                      <span className="truncate">{e.handle}</span>
                    </span>
                    <span className="mono shrink-0">{["6:02", "6:05", "6:11"][i]}</span>
                  </p>
                  <p className="mt-2 line-clamp-2 text-[0.875rem] font-[560] leading-snug text-night-ink">{e.title}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[0.75rem] font-[600] text-ok-night">
                    <Icon name="check" className="size-3.5" strokeWidth={2.2} /> Kept · {e.tool || "any agent"}
                  </p>
                </li>
              ))}
              <li className="rounded-[10px] border border-dashed border-white/10 p-3">
                <p className="text-[0.875rem] text-night-ink-2 line-through decoration-white/30">A product launch announcement</p>
                <p className="mt-2 flex items-center gap-1.5 text-[0.75rem] font-[600] text-[#ffa99c]">
                  <Icon name="x" className="size-3.5" strokeWidth={2.2} /> Left out · not a use case
                </p>
              </li>
            </ul>
          </Panel>
        </div>

        <Connector from={[96, 196, 300]} to={220} />

        {/* 2 · the library, live */}
        <div className="order-1 md:col-span-2 xl:order-none xl:col-span-1">
          <div className="window relative shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_50px_120px_-30px_rgb(0_0_0/0.9),0_0_80px_-20px_rgb(232_169_127/0.25)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
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
            <LiveSearch newest={newest} total={total} shelves={shelves} />
          </div>
        </div>

        <Connector from={[220]} to={[120, 220, 330]} />

        {/* 3 · running on someone's own agent */}
        <div className="order-3 xl:order-none">
          <Panel title="Inbox drafts · from the pack" tag="Illustration">
            <div className="grid gap-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[0.8125rem]">
                  <span className="breathe size-2 rounded-full bg-ok-night" aria-hidden="true" />
                  Ran at 6:30
                </span>
                <span className="mono text-[0.6875rem] text-night-ink-2">Muse · your account</span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {[
                  ["mail", "Email"],
                  ["calendar", "Calendar"],
                  ["file", "Files"],
                ].map(([i, l]) => (
                  <li key={l} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.75rem]">
                    <Icon name={i as "mail"} className="size-3.5 text-accent-night" />
                    {l}
                  </li>
                ))}
              </ul>
              <div className="rounded-[10px] bg-ground p-3.5 text-ink">
                <p className="flex items-center justify-between text-[0.75rem] text-ink-2">
                  <span>Re: Order for the 14th</span>
                  <span className="tag bg-ground-2 text-ink-2">Draft</span>
                </p>
                <p className="mt-2 text-[0.8125rem] leading-snug">Hi Dana, yes, the 14th works. I’m free Thursday between 2 and 4…</p>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-[10px] bg-wait-night/10 px-3 py-2.5 ring-1 ring-wait-night/25">
                <span className="text-[0.8125rem] font-[600]">3 drafts wait for you</span>
                <span className="rounded-full bg-ok-night px-3 py-1 text-[0.75rem] font-[650] text-night">Review</span>
              </div>
              <p className="flex items-center gap-2 text-[0.75rem] text-night-ink-2">
                <Icon name="shield" className="size-3.5 text-accent-night" />
                Never sends on its own
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="window h-full bg-night-2/90 xl:scale-[0.97] xl:opacity-95">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
        <span className="text-[0.8125rem] font-[600]">{title}</span>
        <span className="tag bg-white/[0.05] text-night-ink-2">{tag}</span>
      </div>
      {children}
    </div>
  );
}

/** Fine lines between the panels, with something always travelling along them. */
function Connector({ from, to }: { from: number[]; to: number | number[] }) {
  const ends = Array.isArray(to) ? to : from.map(() => to);
  const starts = Array.isArray(to) ? to.map(() => from[0]) : from;
  return (
    <svg viewBox="0 0 56 440" className="hidden h-[440px] w-14 overflow-visible text-accent-night xl:block" aria-hidden="true">
      {starts.map((y1, i) => {
        const y2 = ends[i];
        const d = `M0 ${y1} C 30 ${y1}, 26 ${y2}, 56 ${y2}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
            <circle r="2.5" fill="currentColor" className="packet-svg">
              <animateMotion dur={`${2.6 + i * 0.5}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
