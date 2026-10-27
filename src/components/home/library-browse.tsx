"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/icons";
import { ExternalIcon } from "@/components/use-case-card";
import type { UseCase } from "@/data/library";
import { livePack } from "@/data/packs";
import { trackEvent } from "@/lib/session";

export type Entry = Pick<UseCase, "id" | "title" | "summary" | "category" | "tool" | "handle" | "url">;
type Shelf = { id: string; label: string; n: number; items: Entry[] };

const FIRST = 5;

const OPEN_IN_PACK = 3;

/** The free pack's agents filed on the same shelf as this entry (the pack's own shelf tags). */
function relatedAgents(u: Entry) {
  return livePack.agents.filter((a) => a.categories.includes(u.category)).slice(0, 3);
}

/**
 * The library on the home page: pick a shelf and see its newest five, open a
 * few more, or type to search all of it (on the server, since it runs to
 * thousands). The library page has everything else.
 */
export function LibraryBrowse({ shelves, total, heading }: { shelves: Shelf[]; total: number; heading?: React.ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(shelves[0]?.id);
  const [more, setMore] = useState(false);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {heading}
        <form
          role="search"
          action="/library"
          onSubmit={() => trackEvent("library_search", { q: query.slice(0, 60) })}
          className="relative w-full shrink-0 sm:w-[20rem]"
        >
          <label htmlFor={`${id}-q`} className="sr-only">
            Search all {total.toLocaleString("en-CA")} use cases
          </label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-night-ink-2" />
          <input
            id={`${id}-q`}
            name="q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPicked(null);
            }}
            maxLength={120}
            autoComplete="off"
            placeholder="Search, e.g. invoices"
            className="h-12 w-full rounded-[6px] border border-white/20 bg-night-2 pl-11 pr-4 text-[1rem] text-night-ink outline-none transition-colors placeholder:text-night-ink-2 focus:border-accent-night"
          />
        </form>
      </div>

      <div role="tablist" aria-label="Shelves" className={`-mx-5 mt-5 flex gap-6 overflow-x-auto px-5 scrollbar-none sm:mx-0 sm:flex-wrap sm:gap-x-7 sm:gap-y-1 sm:px-0 ${searching ? "opacity-50" : ""}`}>
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
              className={`min-h-11 shrink-0 border-b-2 text-[0.9375rem] font-[560] transition-colors duration-150 ${
                on ? "border-accent-night text-night-ink" : "border-transparent text-night-ink-2 hover:text-night-ink"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div id={`${id}-list`} role="tabpanel" aria-live="polite" className="border-t border-white/15">
        {searching && !current ? (
          <p className="py-6 text-night-ink-2">Searching…</p>
        ) : list.length === 0 ? (
          <p className="py-8 text-[1.125rem]">
            Nobody’s agent does that yet.{" "}
            <Link href="#watch" className="tlink chev">
              Watch for it
            </Link>
          </p>
        ) : (
          <ol key={searching ? `q:${query}` : `${shelf.id}:${more}`} className="fade-in">
            {list.map((u, i) => {
              const open = (picked ?? list[0]?.id) === u.id;
              const related = relatedAgents(u);
              return (
                <li key={u.id} className="border-b border-white/10">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${id}-p-${i}`}
                    onClick={() => setPicked(open ? "none" : u.id)}
                    className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-4 text-left sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:py-5"
                  >
                    <span className={`text-[clamp(1.125rem,1.8vw,1.375rem)] font-[600] leading-snug tracking-[-0.02em] transition-colors duration-150 ${open ? "text-accent-night" : "group-hover:text-accent-night"}`}>{u.title}</span>
                    <span className="mono col-start-1 text-[0.8125rem] text-night-ink-2 sm:col-start-auto">{u.tool || "Any agent"}</span>
                    <Icon name="plus" className={`col-start-2 row-start-1 size-4 self-center text-night-ink-2 transition-transform duration-200 sm:col-start-auto sm:row-start-auto ${open ? "rotate-45 text-accent-night" : ""}`} />
                  </button>
                  {open && (
                    <div id={`${id}-p-${i}`} className="fade-in grid gap-px overflow-hidden rounded-[8px] bg-white/10 mb-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="bg-night-2 p-5">
                        <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-ink-2">What happened</p>
                        <p className="mt-2 text-[1rem] leading-relaxed">{u.summary}</p>
                        <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex min-h-10 items-center gap-2 text-[0.9375rem] font-[600] text-accent-night hover:underline hover:underline-offset-4">
                          Original post by {u.handle} <ExternalIcon className="size-3" />
                        </a>
                      </div>
                      <div className="bg-night-2 p-5">
                        <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-ink-2">Get something like it running</p>
                        {related.length > 0 && (
                          <>
                            <p className="mt-2 text-[0.9375rem] text-night-ink-2">On this shelf in the free pack:</p>
                            <ul className="mt-2 grid gap-1.5">
                              {related.map((a) => (
                                <li key={a.id} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-1.5 text-[1rem] font-[560]">
                                  {a.name}
                                  <span className="mono text-[0.6875rem] uppercase tracking-[0.06em] text-night-ink-2">{livePack.agents.indexOf(a) < OPEN_IN_PACK ? "Open now" : "With email"}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem]">
                          {related.length > 0 && (
                            <Link href={`/packs/${livePack.id}`} className="tlink chev inline-block py-1">
                              Get the free pack
                            </Link>
                          )}
                          <Link href="/setup" className="tlink chev inline-block py-1">
                            Have Peter set this one up
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {searching ? (
          current && current.total > 0 && (
            <Link href={`/library?q=${encodeURIComponent(query)}`} className="tlink chev py-2 text-[1rem]">
              {current.total === 1 ? "Open it in the library" : `All ${current.total.toLocaleString("en-CA")} matches`}
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
