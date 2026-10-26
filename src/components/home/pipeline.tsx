import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

/**
 * How the library is made, as the code does it (lib/ingest): public posts come
 * in from a few sources, a model reads them every morning and keeps only real
 * use cases, rewritten in our words and linked to the original, and the
 * library reaches people four ways.
 */
const sources: { icon: IconName; label: string; note: string }[] = [
  { icon: "chat", label: "Posts on X", note: "People describing what their agent did" },
  { icon: "search", label: "Grok’s X search", note: "A second way into the same posts" },
  { icon: "globe", label: "Hacker News", note: "Read through its public search" },
  { icon: "bolt", label: "Peter’s own agent", note: "Sends links; the site opens each one itself" },
  { icon: "pen", label: "Added by hand", note: "From Peter’s reading" },
];

const uses: { icon: IconName; label: string; note: string; href: string }[] = [
  { icon: "search", label: "Search it", note: "Type what you want your agent to do", href: "/library" },
  { icon: "bell", label: "Watch for it", note: "One email the morning it shows up", href: "#watch" },
  { icon: "shelves", label: "Start with a pack", note: "Ten agents, instructions included", href: "/packs/solopreneur" },
  { icon: "user", label: "Have it set up", note: "Designed from what’s working", href: "/setup" },
];

function Fan({ from, to }: { from: number; to: number }) {
  // curves from `from` evenly spaced points on the left to `to` points on the right
  const ys = (n: number) => Array.from({ length: n }, (_, i) => ((i + 0.5) / n) * 100);
  const a = ys(from);
  const b = ys(to);
  const pairs = from >= to ? a.map((y) => [y, b[0]]) : b.map((y) => [a[0], y]);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="hidden h-full w-full xl:block" aria-hidden="true">
      {pairs.map(([y1, y2], i) => (
        <path
          key={i}
          d={`M0 ${y1} C 55 ${y1}, 45 ${y2}, 100 ${y2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          className="flow text-accent/60"
        />
      ))}
    </svg>
  );
}

function Down() {
  return (
    <div className="flex justify-center py-1 md:hidden" aria-hidden="true">
      <svg viewBox="0 0 12 44" className="h-11 w-3">
        <path d="M6 0v38" stroke="currentColor" strokeWidth="1.25" className="flow text-accent/60" fill="none" />
        <path d="M2 35l4 5 4-5" stroke="currentColor" strokeWidth="1.25" fill="none" className="text-accent/70" />
      </svg>
    </div>
  );
}

function Step({ n, title }: { n: string; title: string }) {
  return (
    <p className="mb-3 flex items-baseline gap-2">
      <span className="mono text-[0.75rem] text-accent">{n}</span>
      <span className="mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-2">{title}</span>
    </p>
  );
}

export function Pipeline({ total, shelves }: { total: number; shelves: { label: string; n: number }[] }) {
  const top = shelves.slice(0, 5);
  const max = Math.max(1, ...top.map((s) => s.n));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 md:gap-x-6 md:gap-y-12 xl:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.05fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)] xl:items-stretch xl:gap-0">
      {/* 1 · sources */}
      <div>
        <Step n="01" title="Public posts" />
        <ul className="grid gap-2">
          {sources.map((s) => (
            <li key={s.label} className="flex items-start gap-3 rounded-[12px] bg-surface px-4 py-3 shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
              <Icon name={s.icon} className="mt-0.5 size-[18px] shrink-0 text-ink-2" />
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-[600] leading-snug">{s.label}</span>
                <span className="block text-[0.8125rem] leading-snug text-ink-2">{s.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:hidden xl:block xl:pt-8"><Fan from={5} to={1} /><Down /></div>

      {/* 2 · read and judged */}
      <div className="flex flex-col">
        <Step n="02" title="Read every morning" />
        <div className="window flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-accent-night/15 text-accent-night">
              <Icon name="sunrise" className="size-5" />
            </span>
            <p className="text-[1.0625rem] font-[600] leading-snug">Did someone’s agent actually do this?</p>
          </div>
          <div className="mt-5 grid gap-4">
            <div>
              <p className="flex items-center gap-2 text-[0.8125rem] font-[600] text-ok-night">
                <Icon name="check" className="size-4" strokeWidth={2} /> Kept
              </p>
              <p className="mt-1 text-[0.875rem] text-night-ink-2">A specific thing an agent did for its owner, or honestly failed to do.</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[0.8125rem] font-[600] text-[#ffa99c]">
                <Icon name="x" className="size-4" strokeWidth={2} /> Left out
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {["Ads", "Launches", "Opinions", "Coding agents", "Anything unverifiable"].map((x) => (
                  <li key={x} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.75rem] text-night-ink-2 line-through decoration-white/25">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-auto pt-5 text-[0.8125rem] text-night-ink-2">
            Every one kept is rewritten in our words. No quotes, no invented details.
          </p>
        </div>
      </div>
      <div className="md:hidden xl:block xl:pt-8"><Fan from={1} to={1} /><Down /></div>

      {/* 3 · the library */}
      <div className="flex flex-col">
        <Step n="03" title="Filed in the library" />
        <div className="flex flex-1 flex-col rounded-[14px] bg-surface p-5 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_24px_50px_-30px_rgb(0_0_0/0.3)]">
          <p className="text-[clamp(2.5rem,4vw,3.25rem)] font-[650] leading-none tracking-[-0.045em] tabular-nums">
            {total.toLocaleString("en-CA")}
          </p>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            use cases on {shelves.length} shelves, each linked to its original post
          </p>
          <ul className="mt-5 grid gap-2.5" aria-label="Biggest shelves">
            {top.map((s) => (
              <li key={s.label} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_auto] items-center gap-2.5 text-[0.8125rem]">
                <span className="truncate">{s.label}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-ground-2">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(s.n / max) * 100}%` }} />
                </span>
                <span className="mono tabular-nums text-ink-2">{s.n.toLocaleString("en-CA")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:hidden xl:block xl:pt-8"><Fan from={1} to={4} /><Down /></div>

      {/* 4 · out to people */}
      <div>
        <Step n="04" title="Out to you" />
        <ul className="grid gap-2">
          {uses.map((u) => (
            <li key={u.label}>
              <Link
                href={u.href}
                className="group flex min-h-[4.5rem] items-center gap-3 rounded-[12px] bg-surface px-4 py-3 shadow-[0_0_0_1px_rgb(0_0_0/0.06)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-accent)]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-wash text-accent">
                  <Icon name={u.icon} className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-[600] leading-snug">{u.label}</span>
                  <span className="block text-[0.8125rem] leading-snug text-ink-2">{u.note}</span>
                </span>
                <Icon name="arrow" className="size-4 shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
