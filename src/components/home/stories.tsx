import { Icon } from "@/components/icons";
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

/** Three rows, ruled: the figure large on the left, what it was on the right. */
export function Stories({ stories }: { stories: UseCase[] }) {
  return (
    <ul className="border-t border-ink">
      {stories.map((u) => {
        const [, figure, after] = u.title.match(LEAD) ?? [null, null, u.title];
        return (
          <li key={u.id} className="border-b border-rule">
            <a
              href={u.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group grid gap-x-10 gap-y-2 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:py-10"
            >
              <span className="display text-[clamp(3.5rem,8vw,6.5rem)] tabular-nums text-accent">{figure ?? "—"}</span>
              <span>
                <span className="block text-[clamp(1.375rem,2.4vw,2rem)] font-[620] leading-snug tracking-[-0.03em]">{after}</span>
                <span className="mt-3 flex items-center gap-2 text-[0.9375rem] text-ink-2 transition-colors duration-150 group-hover:text-accent">
                  {u.tool} · {u.handle}
                  <Icon name="external" className="size-3.5" />
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
