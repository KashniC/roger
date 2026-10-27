"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icon } from "@/components/icons";
import { ExternalIcon } from "@/components/use-case-card";
import type { Entry } from "./live-search";

type Shelf = { id: string; label: string; n: number; items: Entry[] };

const FIRST = 5;

/**
 * The library, a little at a time: pick a shelf, see its newest five, open a
 * few more, then go to the full library for the rest. Searching hands over to
 * the library page, which searches all of it.
 */
export function LibraryBrowse({ shelves }: { shelves: Shelf[] }) {
  const id = useId();
  const [open, setOpen] = useState(shelves[0]?.id);
  const [more, setMore] = useState(false);
  const shelf = shelves.find((s) => s.id === open) ?? shelves[0];
  if (!shelf) return null;
  const shown = more ? shelf.items : shelf.items.slice(0, FIRST);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Shelves" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {shelves.map((s) => {
            const on = s.id === shelf.id;
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
        <form action="/library" role="search" className="relative w-full shrink-0 lg:w-[19rem]">
          <label htmlFor={`${id}-q`} className="sr-only">
            Search the whole library
          </label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-2" />
          <input
            id={`${id}-q`}
            name="q"
            maxLength={120}
            placeholder="Search all of it"
            className="h-12 w-full rounded-full border border-rule-strong bg-surface pl-11 pr-4 text-[1rem] outline-none transition-colors placeholder:text-ink-2/80 focus:border-ink"
          />
        </form>
      </div>

      <ol id={`${id}-list`} role="tabpanel" aria-live="polite" className="mt-10 border-t border-ink/80">
        {shown.map((u, i) => (
          <li key={u.id} className={i >= FIRST ? "swap-in" : ""}>
            <a
              href={u.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-rule py-5 transition-colors duration-200 sm:grid-cols-[3rem_minmax(0,1fr)_11rem_auto] sm:py-6"
            >
              <span className="mono hidden text-[0.8125rem] text-ink-2 sm:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.25rem,2.2vw,1.625rem)] font-[620] leading-tight tracking-[-0.03em] transition-colors group-hover:text-accent">{u.title}</span>
              <span className="col-start-1 text-[0.875rem] text-ink-2 sm:col-start-auto">{u.tool || "Any agent"}</span>
              <ExternalIcon className="col-start-2 row-start-1 size-3.5 self-center text-ink-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:col-start-auto sm:row-start-auto" />
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {!more && shelf.items.length > FIRST && (
          <button type="button" onClick={() => setMore(true)} className="btn btn-m btn-ghost">
            <Icon name="plus" className="size-4" /> Show {shelf.items.length - FIRST} more
          </button>
        )}
        <Link href={`/library?cat=${shelf.id}`} className="tlink chev py-2 text-[1rem]">
          All {shelf.n.toLocaleString("en-CA")} in {shelf.label}
        </Link>
      </div>
    </div>
  );
}
