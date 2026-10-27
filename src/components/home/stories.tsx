import type { UseCase } from "@/data/library";

/** The figure a title opens with ("$650 saved…", "2,000 emails…"), when it has one. */
const LEAD = /^(~?\$[\d,.]+K?|\d[\d,]*(?:\.\d+)?\+?)\s+(.+)$/;

/**
 * Three entries from the library, picked for a concrete result in their own
 * title: featured first, then the newest, one per shelf so the three cover
 * different ground. Nothing here is written for the page; it is the library.
 */
export function pickStories(list: UseCase[]) {
  const ranked = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const out: UseCase[] = [];
  for (const u of ranked) {
    if (out.length === 3) break;
    if (!u.tool || !LEAD.test(u.title) || u.outcome === "honest-miss") continue;
    if (out.some((o) => o.category === u.category)) continue;
    out.push(u);
  }
  for (const u of ranked) if (out.length < 3 && !out.includes(u) && u.tool) out.push(u);
  return out;
}

/**
 * The front page's lead stories, set like a newspaper: one lead across the
 * wide column, two beside it, column rules between. The figure is the headline.
 */
export function Leads({ stories }: { stories: UseCase[] }) {
  return (
    <ul className="grid lg:grid-cols-[minmax(0,6fr)_minmax(0,3fr)_minmax(0,3fr)]">
      {stories.map((u, i) => {
        const [, figure, after] = u.title.match(LEAD) ?? [null, null, u.title];
        const lead = i === 0;
        return (
          <li key={u.id} className={`border-ink/15 ${i > 0 ? "border-t lg:border-l lg:border-t-0 lg:pl-8" : "lg:pr-8"} ${i === 1 ? "lg:pr-8" : ""}`}>
            <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="group block py-8 lg:py-10">
              {figure && (
                <span className={`display block tabular-nums text-accent ${lead ? "text-[clamp(5.5rem,13vw,11rem)]" : "text-[clamp(3.5rem,6vw,5rem)]"}`}>{figure}</span>
              )}
              <span className={`mt-3 block font-[640] leading-tight tracking-[-0.02em] ${lead ? "text-[clamp(1.5rem,2.6vw,2.125rem)]" : "text-[1.25rem]"}`}>{after}</span>
              <span className="mono mt-4 block text-[0.8125rem] text-ink-2 transition-colors duration-150 group-hover:text-accent">
                {u.tool} · {u.handle} ↗
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
