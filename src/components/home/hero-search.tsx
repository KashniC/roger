"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/icons";
import type { UseCase } from "@/data/library";
import { trackEvent } from "@/lib/session";

export type Entry = Pick<UseCase, "id" | "title" | "summary" | "category" | "tool" | "handle" | "url">;
type Shelf = { id: string; label: string; n: number };

/**
 * The library as the first thing on the page: one search box, the newest
 * entries under it until something is typed, then the real matches (searched
 * on the server, since the library runs to thousands). Enter opens the full
 * library with the same search.
 */
export function HeroSearch({ newest, total, shelves }: { newest: Entry[]; total: number; shelves: Shelf[] }) {
  const id = useId();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ q: string; total: number; items: Entry[] } | null>(null);
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

  const current = query ? (hits?.q === query ? hits : null) : { total, items: newest };
  const list = current?.items.slice(0, 4) ?? [];

  return (
    <div>
      <form role="search" action="/library" onSubmit={() => trackEvent("library_search", { q: query.slice(0, 60) })}>
        <label htmlFor={`${id}-q`} className="block text-[1rem] text-cobalt-ink-2">
          I want my agent to…
        </label>
        <div className="relative mt-3">
          <input
            id={`${id}-q`}
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={120}
            autoComplete="off"
            placeholder="chase overdue invoices"
            className="h-16 w-full rounded-full bg-ground pl-7 pr-16 text-[clamp(1.125rem,2vw,1.375rem)] text-ink outline-none placeholder:text-ink-2/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ground sm:h-[4.5rem] sm:pl-8"
          />
          <button type="submit" aria-label="Search the library" className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ink text-ground transition-colors hover:bg-cobalt-deep sm:size-14">
            <Icon name="arrow" className="size-5" />
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-6 min-h-[17rem]">
        <p className="flex items-baseline justify-between gap-4 border-b border-white/25 pb-3 text-[0.875rem] text-cobalt-ink-2">
          <span className="tabular-nums">
            {query ? (current ? `${current.total.toLocaleString("en-CA")} found` : "Searching…") : "Newest in the library"}
          </span>
          <Link href={query ? `/library?q=${encodeURIComponent(query)}` : "/library"} className="font-[600] text-ground hover:underline hover:underline-offset-4">
            Open the library →
          </Link>
        </p>
        {current && list.length === 0 ? (
          <p className="py-6 text-[1.125rem] text-ground">
            Nobody’s agent does that yet.{" "}
            <Link href="#watch" className="underline underline-offset-4">
              Watch for it
            </Link>
          </p>
        ) : (
          <ul>
            {list.map((u) => (
              <li key={u.id}>
                <a
                  href={u.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-white/15 py-3.5"
                >
                  <span className="text-[1.0625rem] font-[560] text-ground group-hover:underline group-hover:underline-offset-4">{u.title}</span>
                  <span className="text-[0.8125rem] text-cobalt-ink-2">{u.tool || "Any agent"} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
        <span className="text-cobalt-ink-2">Browse:</span>
        {shelves.map((s) => (
          <Link key={s.id} href={`/library?cat=${s.id}`} className="text-ground underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
            {s.label}
          </Link>
        ))}
      </p>
    </div>
  );
}
