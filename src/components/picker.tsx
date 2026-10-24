"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuItem } from "@/data/menu";
import { setPicks, trackEvent, usePicks } from "@/lib/session";
import { LockScreen } from "./phone/lock-screen";

type Props = {
  offer: "work" | "home";
  items: MenuItem[];
  max: number;
  /** Categories that have library examples; others link to the whole work or home shelf. */
  exampleCategories: string[];
  summaryTitle: string;
  /** e.g. "Chief of Staff" for work: always included, listed first. */
  included?: string;
  price: string;
  actions: React.ReactNode;
  note?: string;
  /** The summary's picture: a lock screen (home) or a Chief of Staff window (work). */
  preview: "lock" | "window";
};

export function Picker({ offer, items, max, exampleCategories, summaryTitle, included, price, actions, note, preview }: Props) {
  const picks = usePicks(offer);
  const [message, setMessage] = useState("");

  const toggle = (id: string) => {
    if (picks.includes(id)) {
      const next = picks.filter((p) => p !== id);
      setPicks(offer, next);
      setMessage("");
      trackEvent("picker_change", { offer, count: next.length });
      return;
    }
    if (picks.length >= max) {
      setMessage(`Pick up to ${max}. Swap one out first.`);
      return;
    }
    const next = [...picks, id];
    setPicks(offer, next);
    setMessage("");
    trackEvent("picker_change", { offer, count: next.length });
  };

  const chosen = items.filter((i) => picks.includes(i.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
      <div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const on = picks.includes(item.id);
            const examples = exampleCategories.includes(item.libraryCategory)
              ? `/library?cat=${item.libraryCategory}`
              : `/library?for=${offer}`;
            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(item.id)}
                  className={`chip group flex h-full w-full flex-col rounded-[var(--radius-inner)] border bg-surface p-4 text-left sm:p-5 sm:pb-12 transition-[border-color,box-shadow] duration-150 ${
                    on ? "border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-rule hover:border-rule-strong"
                  }`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="text-meta font-[600] text-ink-2">{item.title}</span>
                    <span
                      aria-hidden="true"
                      className={`grid size-[22px] shrink-0 place-items-center rounded-full border transition-colors ${
                        on ? "border-ink bg-ink text-ground" : "border-rule-strong text-transparent"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                    </span>
                  </span>
                  <span className="mt-2 block text-title">{item.outcome}</span>
                  <span className="mt-2 hidden text-small text-ink-2 sm:block">{item.how}</span>
                </button>
                <Link href={examples} className="tlink-quiet chev absolute bottom-4 left-5 hidden text-meta sm:inline">
                  See real examples
                </Link>
              </li>
            );
          })}
        </ul>
        <p aria-live="polite" className="mt-4 min-h-6 text-small font-[600] text-ink">
          {message}
        </p>
        {note && <p className="text-small text-ink-2">{note}</p>}
        <p className="mt-3 sm:hidden">
          <Link href={`/library?for=${offer}`} className="tlink chev text-small">
            See real examples in the library
          </Link>
        </p>
      </div>

      <aside aria-label="Your setup" className="lg:sticky lg:top-20 lg:self-start">
        <div className="overflow-hidden rounded-[var(--radius-object)] border border-rule bg-surface">
          {preview === "lock" ? (
            <div className="h-[340px] bg-ground-2">
              <LockScreen
                variant="crop"
                scene="dawn"
                date="Tuesday, October 13"
                time="6:48"
                uid="pick"
                arrive="latest"
                expanded={2}
                empty={`Pick up to ${max} jobs, or choose them in your session`}
                notes={[...chosen].reverse().map((item, i) => ({
                  id: item.id,
                  title: item.title,
                  time: i === 0 ? "now" : `${i * 3}m ago`,
                  body: item.outcome,
                }))}
                label={chosen.length ? `Your picks as messages from your assistant: ${chosen.map((c) => c.title).join(", ")}` : "No jobs picked yet"}
              />
            </div>
          ) : (
            <MiniWindow included={included} chosen={chosen.map((c) => c.title)} max={max} />
          )}
          <div className="p-7 pt-6">
            <h3 className="text-meta font-[600] text-ink-2">{summaryTitle}</h3>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-h3 leading-none">{price}</span>
              <span className="text-meta text-ink-2">
                one-time · {picks.length} of {max} picked
              </span>
            </p>
            <div className="mt-6 flex flex-col items-start gap-4">{actions}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/** The work setup's summary: a small Chief of Staff window filling with your helpers. */
function MiniWindow({ included, chosen, max }: { included?: string; chosen: string[]; max: number }) {
  return (
    <div className="border-b border-rule bg-[#f6f6f8] p-4" aria-hidden="true">
      <div className="overflow-hidden rounded-[12px] border border-black/10 bg-[#fcfcfd] shadow-[0_12px_30px_-16px_rgba(0,0,0,0.3)]">
        <div className="flex h-7 items-center gap-1.5 border-b border-[#ececef] px-3">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="mx-auto pr-8 text-[0.75rem] font-[560] text-[#6e6e73]">Your team</span>
        </div>
        <ul className="px-4 py-2 text-[0.8125rem]">
          {[included, ...chosen].filter(Boolean).map((t, i) => (
            <li key={t} className="flex items-center gap-2.5 border-b border-[#ececef] py-2 last:border-0">
              <span className="grid size-4 place-items-center rounded-full bg-[#1d1d1f] text-white">
                <svg viewBox="0 0 16 16" className="size-2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              </span>
              <span className="font-[560]">{t}</span>
              <span className="ml-auto text-[0.75rem] text-[#6e6e73]">{i === 0 ? "Always" : "Helper"}</span>
            </li>
          ))}
          {Array.from({ length: Math.max(0, max - chosen.length) }).map((_, i) => (
            <li key={`e${i}`} className="flex items-center gap-2.5 border-b border-[#ececef] py-2 text-[#8a8a90] last:border-0">
              <span className="size-4 rounded-full border border-dashed border-[#c7c7cd]" />
              Pick a helper, or choose on the call
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
