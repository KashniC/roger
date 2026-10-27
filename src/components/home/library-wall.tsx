"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon, shelfIcon } from "@/components/icons";
import { ExternalIcon } from "@/components/use-case-card";
import type { Entry } from "./live-search";

type Shelf = { id: string; label: string; n: number; items: Entry[] };

/** Big shelves get big tiles: the wall shows the shape of the library at a glance. */
function span(i: number) {
  if (i === 0) return "col-span-2 sm:row-span-2";
  if (i < 3) return "col-span-2";
  return "";
}

/** Phones show the biggest shelves first; the rest are a tap away. */
const PHONE_SHOWS = 7;

// literal class names, so Tailwind sees them
const FILL = {
  base: ["", "col-span-1", "col-span-2"],
  sm: ["", "sm:col-span-1", "sm:col-span-2", "sm:col-span-3", "sm:col-span-4"],
  lg: ["", "lg:col-span-1", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4", "lg:col-span-5", "lg:col-span-6"],
};

/** The last tile widens to close the row, at every column count. */
function fillLast(n: number) {
  if (n < 4) return "";
  const used = 8 + (n - 3); // the 2×2 tile, two 2-wide tiles, then singles
  const phone = 6 + (n - 3); // on phones the first tile is one row tall
  const at = (cols: number, u = used) => 1 + ((cols - (u % cols)) % cols);
  return `${FILL.base[at(2, phone)]} ${FILL.sm[at(4)]} ${FILL.lg[at(6)]}`;
}

/**
 * The library as a wall of shelves sized by how much is on them. Pick one and
 * its newest use cases come up as a deck you can flick through; each opens
 * the original post.
 */
export function LibraryWall({ shelves }: { shelves: Shelf[] }) {
  const [open, setOpen] = useState(shelves[0]?.id);
  const [all, setAll] = useState(false);
  const shelf = shelves.find((s) => s.id === open) ?? shelves[0];
  const deck = useRef<HTMLUListElement>(null);
  if (!shelf) return null;
  const max = shelves[0]?.n || 1;

  const nudge = (dir: 1 | -1) => deck.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div>
      <div className="wrap">
      <div role="group" aria-label="Shelves" className="grid auto-rows-[5.5rem] grid-cols-2 sm:auto-rows-[6.25rem] gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {shelves.map((s, i) => {
          const on = s.id === shelf.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              aria-controls="shelf-deck"
              onClick={() => {
                setOpen(s.id);
                deck.current?.scrollTo({ left: 0 });
              }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[14px] p-4 text-left transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 ${span(i)} ${i === shelves.length - 1 ? fillLast(shelves.length) : ""} ${i >= PHONE_SHOWS && !all ? "max-sm:hidden" : ""} ${
                on
                  ? "bg-night text-night-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]"
                  : "bg-surface text-ink shadow-[0_0_0_1px_rgb(27_26_24/0.07)] hover:shadow-[0_0_0_1px_rgb(27_26_24/0.18),0_14px_30px_-20px_rgb(0_0_0/0.35)]"
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className={`font-[620] leading-tight tracking-[-0.015em] ${i === 0 ? "text-[1.375rem]" : "text-[0.9375rem]"}`}>{s.label}</span>
                <Icon name={shelfIcon[s.id] ?? "shelves"} className={`shrink-0 ${i === 0 ? "size-6" : "size-[18px]"} ${on ? "text-accent-night" : "text-ink-2"}`} />
              </span>
              <span className="flex items-end justify-between gap-2">
                <span className={`display tabular-nums ${i === 0 ? "text-[clamp(3rem,6vw,5rem)]" : i < 3 ? "text-[2.25rem]" : "text-[1.75rem]"} ${on ? "text-accent-night" : ""}`}>
                  {s.n.toLocaleString("en-CA")}
                </span>
                {i === 0 && <span className={`pb-2 text-[0.8125rem] ${on ? "text-night-ink-2" : "text-ink-2"}`}>use cases</span>}
              </span>
              <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${on ? "bg-white/10" : "bg-ink/[0.05]"}`}>
                <span className={`block h-full ${on ? "bg-accent-night" : "bg-accent/50"}`} style={{ width: `${(s.n / max) * 100}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      {shelves.length > PHONE_SHOWS && !all && (
        <button type="button" onClick={() => setAll(true)} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-rule-strong text-[0.9375rem] font-[600] sm:hidden">
          <Icon name="plus" className="size-4" /> All {shelves.length} shelves
        </button>
      )}

      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <p aria-live="polite">
          <span className="kicker text-ink-2">Newest on the shelf</span>
          <span className="mt-1 block text-[1.75rem] font-[650] tracking-[-0.03em]">{shelf.label}</span>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => nudge(-1)} className="grid size-11 place-items-center rounded-full border border-rule-strong transition-colors hover:bg-surface" aria-label="Previous use cases">
            <Icon name="arrow" className="size-4 rotate-180" />
          </button>
          <button type="button" onClick={() => nudge(1)} className="grid size-11 place-items-center rounded-full border border-rule-strong transition-colors hover:bg-surface" aria-label="More use cases">
            <Icon name="arrow" className="size-4" />
          </button>
        </div>
      </div>
      </div>

      <ul
        id="shelf-deck"
        ref={deck}
        key={shelf.id}
        className="rail swap-in mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-none"
      >
        {shelf.items.map((u) => {
          const tone = u.tool === "Muse" ? "copper" : u.tool === "Grok Bot" ? "night" : "paper";
          return (
            <li key={u.id} className="w-[min(19rem,82vw)] shrink-0 snap-start">
              <a
                href={u.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`group flex h-full min-h-[13rem] flex-col rounded-[16px] p-5 transition-transform duration-300 hover:-translate-y-1 ${
                  tone === "night"
                    ? "bg-night text-night-ink"
                    : tone === "copper"
                      ? "bg-accent-wash text-ink shadow-[0_0_0_1px_rgb(154_82_38/0.12)]"
                      : "bg-surface text-ink shadow-[0_0_0_1px_rgb(27_26_24/0.08)]"
                }`}
              >
                <span className={`tag self-start ${tone === "night" ? "bg-white/[0.08] text-night-ink-2" : tone === "copper" ? "bg-accent/10 text-accent" : "bg-ground-2 text-ink-2"}`}>
                  {u.tool || "Any agent"}
                </span>
                <span className="mt-4 line-clamp-3 text-[1.25rem] font-[640] leading-[1.18] tracking-[-0.025em]">{u.title}</span>
                <span className={`mt-2 line-clamp-2 text-[0.875rem] leading-snug ${tone === "night" ? "text-night-ink-2" : "text-ink-2"}`}>{u.summary}</span>
                <span className={`mt-auto flex items-center gap-1.5 pt-6 text-[0.8125rem] font-[560] ${tone === "night" ? "text-night-ink-2 group-hover:text-accent-night" : "text-ink-2 group-hover:text-accent"}`}>
                  {u.handle} <ExternalIcon className="size-3" />
                </span>
              </a>
            </li>
          );
        })}
        <li className="w-[min(15rem,70vw)] shrink-0 snap-start">
          <Link href={`/library?cat=${shelf.id}`} className="group flex h-full min-h-[13rem] flex-col justify-between rounded-[16px] bg-accent p-5 text-accent-ink transition-colors hover:bg-accent-hover">
            <Icon name="shelves" className="size-6" />
            <span>
              <span className="display block text-[3rem] tabular-nums">{shelf.n.toLocaleString("en-CA")}</span>
              <span className="mt-2 flex items-center gap-2 text-[1rem] font-[600]">
                See all in {shelf.label}
                <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
