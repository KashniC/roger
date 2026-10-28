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

/** Three results side by side, ruled; the figure in the serif carries each one. */
export function Leads({ stories }: { stories: UseCase[] }) {
  return (
    <ul className="grid border-t border-ink md:grid-cols-3">
      {stories.map((u, i) => {
        const [, figure, after] = u.title.match(LEAD) ?? [null, null, u.title];
        return (
          <li key={u.id} className={`border-b border-ink/15 md:border-b-0 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}>
            <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="group block py-8 md:py-10">
              {figure && <span className="display block text-[clamp(4rem,8vw,7rem)] tabular-nums text-cobalt">{figure}</span>}
              <span className="mt-3 block text-[1.25rem] font-[600] leading-snug tracking-[-0.015em]">{after}</span>
              <span className="mt-4 block text-[0.875rem] text-ink-2 group-hover:text-cobalt">
                {u.tool} · original post ↗
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
