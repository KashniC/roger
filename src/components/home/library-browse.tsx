"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/icons";
import { ExternalIcon } from "@/components/use-case-card";
import type { UseCase } from "@/data/library";
import { trackEvent } from "@/lib/session";

export type Entry = Pick<UseCase, "id" | "title" | "summary" | "category" | "tool" | "handle" | "url">;
type Shelf = { id: string; label: string; n: number; items: Entry[] };

const FIRST = 5;

/**
 * The library on the home page: pick a shelf and see its newest five, open a
 * few more, or type to search all of it (on the server, since it runs to
 * thousands). The library page has everything else.
 */
export function LibraryBrowse({ shelves, total }: { shelves: Shelf[]; total: number }) {
  const id = useId();
  const [open, setOpen] = useState(shelves[0]?.id);
  const [more, setMore] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ q: string; total: number; items: Entry[] } | null>(null);
  const shelf = shelves.find((s) => s.id === open) ?? shelves[0];

  const query = q.trim();
  useEffect(() => {
    if (!query) return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/library/search?${new URLSearchParams({ q: query })}`, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { total: number; items: Entry[] } | null) => d && setHits({ q: query, ...d }))
        .catch(() => {});
    }, 180);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [query]);

  if (!shelf) return null;
  const searching = query.length > 0;
  const current = searching && hits?.q === query ? hits : null;
  const list = searching ? (current?.items ?? []) : more ? shelf.items : shelf.items.slice(0, FIRST);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Shelves" className={`-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 scrollbar-none transition-opacity sm:mx-0 sm:flex-wrap sm:px-0 ${searching ? "opacity-40" : ""}`}>
          {shelves.map((s) => {
            const on = !searching && s.id === shelf.id;
            return (
              <button
                key={s.id}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`${id}-list`}
                onClick={() => {
                  setOpen(s.id);
                  setMore(false);
                  setQ("");
                }}
                className={`chip min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-[560] transition-colors duration-200 ${
                  on ? "bg-ink text-ground" : "text-ink-2 hover:bg-ground-2 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <form
          role="search"
          action="/library"
          onSubmit={() => trackEvent("library_search", { q: query.slice(0, 60) })}
          className="relative w-full shrink-0 lg:w-[20rem]"
        >
          <label htmlFor={`${id}-q`} className="sr-only">
            Search all {total.toLocaleString("en-CA")} use cases
          </label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-2" />
          <input
            id={`${id}-q`}
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={120}
            autoComplete="off"
            placeholder="Search, e.g. invoices"
            className="h-12 w-full rounded-full border border-rule-strong bg-surface pl-11 pr-4 text-[1rem] outline-none transition-colors placeholder:text-ink-2/80 focus:border-ink"
          />
        </form>
      </div>

      <div id={`${id}-list`} role="tabpanel" aria-live="polite" className="mt-10 border-t border-ink/80">
        {searching && !current ? (
          <p className="py-6 text-ink-2">Searching…</p>
        ) : list.length === 0 ? (
          <p className="py-8 text-[1.125rem]">
            Nobody’s agent does that yet.{" "}
            <Link href="#watch" className="tlink chev">
              Watch for it
            </Link>
          </p>
        ) : (
          <ol>
            {list.map((u, i) => (
              <li key={u.id} className={!searching && i >= FIRST ? "swap-in" : ""}>
                <a
                  href={u.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-rule py-5 sm:grid-cols-[3rem_minmax(0,1fr)_10rem_auto] sm:py-6"
                >
                  <span className="mono hidden text-[0.8125rem] text-ink-2 sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[clamp(1.25rem,2.2vw,1.625rem)] font-[620] leading-tight tracking-[-0.03em] transition-colors group-hover:text-accent">{u.title}</span>
                  <span className="col-start-1 text-[0.875rem] text-ink-2 sm:col-start-auto">{u.tool || "Any agent"}</span>
                  <ExternalIcon className="col-start-2 row-start-1 size-3.5 self-center text-ink-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:col-start-auto sm:row-start-auto" />
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {searching ? (
          current && current.total > 0 && (
            <Link href={`/library?q=${encodeURIComponent(query)}`} className="tlink chev py-2 text-[1rem]">
              All {current.total.toLocaleString("en-CA")} matches
            </Link>
          )
        ) : (
          <>
            {!more && shelf.items.length > FIRST && (
              <button type="button" onClick={() => setMore(true)} className="btn btn-m btn-ghost">
                <Icon name="plus" className="size-4" /> Show {shelf.items.length - FIRST} more
              </button>
            )}
            <Link href={`/library?cat=${shelf.id}`} className="tlink chev py-2 text-[1rem]">
              All {shelf.n.toLocaleString("en-CA")} in {shelf.label}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
