"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useDeferredValue, useEffect, useMemo, useState } from "react";
import { categories, type UseCase, type UseCaseCategory } from "@/data/library";
import { trackEvent } from "@/lib/session";
import { UseCaseCard } from "./use-case-card";

type For = "all" | "home" | "work";

const PAGE = 60;

export function LibraryBrowser({ items, band }: { items: UseCase[]; band: React.ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const forParam = params.get("for");
  const audience: For = forParam === "home" || forParam === "work" ? forParam : "all";
  const catParam = params.get("cat") as UseCaseCategory | null;
  const cat = categories.some((c) => c.id === catParam) ? catParam : null;
  const [q, setQ] = useState(params.get("q") ?? "");
  const query = useDeferredValue(q);

  const update = (next: { for?: For; cat?: string | null; q?: string }) => {
    const sp = new URLSearchParams(params.toString());
    const set = (k: string, v: string | null | undefined) => (v ? sp.set(k, v) : sp.delete(k));
    if ("for" in next) set("for", next.for === "all" ? null : next.for);
    if ("cat" in next) set("cat", next.cat ?? null);
    if ("q" in next) set("q", next.q || null);
    const s = sp.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  // keep ?q= in step with typing, without a history entry per keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) update({ q });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const visibleCats = categories.filter((c) => (audience === "all" || c.for === audience) && items.some((u) => u.category === c.id));

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(
      (u) =>
        (audience === "all" || u.for === audience) &&
        (!cat || u.category === cat) &&
        (!needle || `${u.title} ${u.summary} ${u.tool} ${u.handle} ${u.category}`.toLowerCase().includes(needle)),
    );
  }, [items, audience, cat, query]);

  // a page at a time: thousands of cards at once is slow on a phone
  // (back to one page whenever the filters change)
  const filterKey = `${audience}|${cat}|${query}`;
  const [page, setPage] = useState({ key: filterKey, shown: PAGE });
  const shown = page.key === filterKey ? page.shown : PAGE;

  const chip = (on: boolean) =>
    `chip inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-small font-[540] transition-colors ${
      on ? "border-ink bg-ink text-ground" : "border-rule-strong bg-surface text-ink hover:border-ink-2"
    }`;

  return (
    <>
      <div className="sticky top-[52px] z-20 border-y border-rule bg-ground/90 backdrop-blur-xl">
        <div className="wrap flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:gap-6">
          <div role="group" aria-label="Who it’s for" className="flex shrink-0 self-start rounded-full bg-[#e8e8ed] p-1 lg:self-auto">
            {(["all", "home", "work"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={audience === f}
                onClick={() => {
                  update({ for: f, cat: null });
                  trackEvent("library_filter", { cat: "all", for: f });
                }}
                className={`min-h-9 rounded-full border border-transparent px-4 text-small font-[560] transition-colors ${audience === f ? "bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : "text-ink-2 hover:text-ink"}`}
              >
                {f === "all" ? "Everything" : f === "home" ? "Home" : "Work"}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Category" className="relative -mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 scrollbar-none [mask-image:linear-gradient(to_right,#000_90%,transparent)] lg:mx-0 lg:flex-1 lg:px-0 xl:flex-wrap xl:overflow-visible xl:[mask-image:none]">
            <button type="button" aria-pressed={!cat} onClick={() => update({ cat: null })} className={chip(!cat)}>
              All topics
            </button>
            {visibleCats.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => {
                  update({ cat: cat === c.id ? null : c.id });
                  trackEvent("library_filter", { cat: c.id, for: audience });
                }}
                className={chip(cat === c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative lg:w-60 lg:shrink-0">
            <label htmlFor="library-search" className="sr-only">
              Search use cases
            </label>
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3 3" />
            </svg>
            <input
              id="library-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search use cases"
              className="h-10 w-full rounded-full border border-rule-strong bg-surface pl-10 pr-4 text-small outline-none placeholder:text-ink-2 focus:border-ink"
            />
          </div>
        </div>
      </div>

      <div
        className="wrap py-12 md:py-16"
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest("a");
          if (!a) return;
          if (a.dataset.outbound) trackEvent("library_outbound", { id: a.dataset.outbound });
          if (a.dataset.toOffer) trackEvent("library_to_offer", { id: a.dataset.toOffer });
        }}
      >
        <p aria-live="polite" className="text-small text-ink-2">
          {results.length === items.length ? `${items.length} use cases.` : `${results.length} of ${items.length} use cases match.`}
        </p>

        {results.length === 0 ? (
          <div className="mt-10 rounded-[var(--radius-object)] border border-dashed border-rule-strong p-10">
            <h2 className="text-title">Nothing matches yet.</h2>
            <p className="mt-2 text-body text-ink-2">New use cases are added every week. Try another word, or clear the filters.</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                update({ for: "all", cat: null, q: "" });
              }}
              className="btn btn-m btn-ink mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, shown).map((u, i) => (
              <Fragment key={u.id}>
                <li>
                  <UseCaseCard u={u} />
                </li>
                {i === 8 && results.length > 12 && <li className="sm:col-span-2 lg:col-span-3">{band}</li>}
              </Fragment>
            ))}
          </ul>
        )}
        {results.length > shown && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setPage({ key: filterKey, shown: shown + PAGE })} className="btn btn-m btn-ink">
              Show {Math.min(PAGE, results.length - shown)} more
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/** Rendered while the filters wake up, and for anyone without JavaScript: every card, unfiltered. */
export function LibraryStatic({ items }: { items: UseCase[] }) {
  return (
    <div className="wrap py-12 md:py-16">
      <p className="text-small text-ink-2">{items.length > PAGE ? `Showing the newest ${PAGE} of ${items.length} use cases.` : `Showing all ${items.length} use cases.`}</p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, PAGE).map((u) => (
          <li key={u.id}>
            <UseCaseCard u={u} />
          </li>
        ))}
      </ul>
    </div>
  );
}
