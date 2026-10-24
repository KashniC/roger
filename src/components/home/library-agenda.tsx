"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalIcon } from "@/components/use-case-card";
import type { Entry } from "./live-search";

/**
 * The library by shelf: one shelf open at a time, its use cases as banded
 * rows told apart by tone, never by lines.
 */
export function LibraryAgenda({
  shelves,
}: {
  shelves: { id: string; label: string; n: number; items: Entry[] }[];
}) {
  const [open, setOpen] = useState(shelves[0]?.id);
  const shelf = shelves.find((s) => s.id === open) ?? shelves[0];
  if (!shelf) return null;

  return (
    <div
      data-ui
      className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10"
    >
      <div
        role="tablist"
        aria-label="Shelves"
        aria-orientation="vertical"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 scrollbar-none md:mx-0 md:flex-col md:px-0"
      >
        {shelves.map((s) => {
          const on = s.id === shelf.id;
          return (
            <button
              key={s.id}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={on}
              aria-controls="shelf-panel"
              onClick={() => setOpen(s.id)}
              className={`chip flex min-h-16 w-[9.5rem] shrink-0 flex-col items-start justify-center rounded-[8px] px-4 text-left transition-colors duration-[180ms] md:w-full ${on ? "bg-ink text-ground" : "bg-ground-2 text-ink hover:bg-[#e9e9ec]"}`}
            >
              <span className="text-[1rem] font-[560] leading-tight">
                {s.label}
              </span>
              <span
                className={`text-[0.8125rem] tabular-nums ${on ? "text-ground/70" : "text-ink-2"}`}
              >
                {s.n.toLocaleString("en-CA")}{" "}
                {s.n === 1 ? "use case" : "use cases"}
              </span>
            </button>
          );
        })}
      </div>

      <div id="shelf-panel" role="tabpanel" aria-labelledby={`tab-${shelf.id}`}>
        <ul className="space-y-1">
          {shelf.items.map((u, i) => (
            <li key={u.id}>
              <a
                href={u.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`grid min-h-[76px] grid-cols-[minmax(0,1fr)] items-center gap-x-6 gap-y-1 rounded-[8px] px-5 py-4 transition-colors duration-[180ms] sm:grid-cols-[7rem_minmax(0,1fr)_auto] ${i % 2 ? "bg-[#ececef] hover:bg-[#e4e4e8]" : "bg-ground-2 hover:bg-[#e9e9ec]"}`}
              >
                <span className="text-lead font-[560] text-ink-2">
                  {u.tool || "Any agent"}
                </span>
                <span className="min-w-0">
                  <span className="block text-[1.0625rem] font-[600] leading-snug tracking-[-0.015em]">
                    {u.title}
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] text-ink-2">
                    {u.summary}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[0.875rem] text-ink">
                  {u.handle}
                  <ExternalIcon className="size-3" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        {shelf.n > shelf.items.length && (
          <p className="mt-4">
            <Link
              href={`/library?cat=${shelf.id}`}
              className="tlink chev inline-block py-1"
            >
              See all {shelf.n.toLocaleString("en-CA")} in {shelf.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
