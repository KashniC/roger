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


const tones = [
  "bg-night text-night-ink lg:row-span-2",
  "bg-accent text-accent-ink",
  "bg-surface text-ink shadow-[0_0_0_1px_rgb(27_26_24/0.08)]",
];

export function Stories({ stories, shelfLabel }: { stories: UseCase[]; shelfLabel: (id: UseCase["category"]) => string }) {
  return (
    <ul className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-2">
      {stories.map((u, i) => {
        const [, figure, after] = u.title.match(LEAD) ?? [null, null, u.title];
        const big = i === 0;
        const muted = i === 0 ? "text-night-ink-2" : i === 1 ? "text-accent-ink/75" : "text-ink-2";
        return (
          <li key={u.id} className={tones[i]} style={{ borderRadius: 24 }}>
            <a
              href={u.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`group flex h-full flex-col justify-between gap-10 rounded-[24px] p-7 sm:p-9 ${big ? "lg:min-h-[34rem]" : "lg:min-h-[16.5rem]"}`}
            >
              <span className={`kicker flex items-center justify-between gap-3 ${muted}`}>
                <span>
                  {u.tool} · {shelfLabel(u.category)}
                </span>
                <Icon name="external" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span>
                {figure && (
                  <span className={`display block tabular-nums ${big ? "text-[clamp(5rem,12vw,10rem)]" : "text-[clamp(3.5rem,6vw,5rem)]"} ${i === 0 ? "text-accent-night" : ""}`}>
                    {figure}
                  </span>
                )}
                <span className={`mt-4 block font-[640] leading-[1.1] tracking-[-0.03em] ${big ? "text-[clamp(1.5rem,2.6vw,2.25rem)]" : "text-[1.375rem]"}`}>{after}</span>
                <span className={`mt-3 block text-[0.9375rem] ${muted}`}>{u.handle} · the original post</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
