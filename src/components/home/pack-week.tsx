"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, connectIcon } from "@/components/icons";
import type { Agent } from "@/data/packs";

/** When each agent runs, read from its own instruction in data/packs.ts. */
const when: Record<string, { days?: number[]; at?: string; on?: string }> = {
  brief: { days: [0, 1, 2, 3, 4], at: "6:45" },
  inbox: { days: [0, 1, 2, 3, 4], at: "Each morning" },
  numbers: { days: [0], at: "Mon 8:00" },
  invoices: { days: [0], at: "Mondays" },
  content: { days: [4], at: "Fridays" },
  leads: { on: "When an enquiry arrives" },
  reviews: { on: "When a review comes in" },
  meetings: { on: "After each meeting" },
  subscriptions: { on: "3 days before a renewal" },
  receipts: { on: "As receipts arrive" },
};

const DAYS = ["M", "T", "W", "T", "F"];

/**
 * The free pack as a week: five agents on a schedule, five that wait for
 * something to happen. Open a row to see what it does and what it connects.
 */
export function PackWeek({ agents, openCount, packHref }: { agents: Agent[]; openCount: number; packHref: string }) {
  const [open, setOpen] = useState<string | null>("invoices");
  const scheduled = agents.filter((a) => when[a.id]?.days);
  const triggered = agents.filter((a) => !when[a.id]?.days);
  const index = new Map(agents.map((a, i) => [a.id, i]));

  const row = (a: Agent) => {
    const w = when[a.id] ?? {};
    const isOpen = open === a.id;
    const free = (index.get(a.id) ?? 99) < openCount;
    return (
      <li key={a.id} className={`rounded-[12px] transition-colors duration-200 ${isOpen ? "bg-night-3 ring-1 ring-white/10" : ""}`}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`agent-${a.id}`}
          onClick={() => setOpen(isOpen ? null : a.id)}
          className="grid min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.04] sm:grid-cols-[minmax(0,1fr)_16rem_7rem] sm:gap-6 sm:px-4"
        >
          <span className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-1">
            <span className={`grid size-6 shrink-0 place-items-center rounded-full transition-transform duration-200 ${isOpen ? "rotate-45 bg-accent-night text-night" : "bg-white/[0.07] text-night-ink-2"}`} aria-hidden="true">
              <Icon name="plus" className="size-3.5" strokeWidth={2} />
            </span>
            <span className="truncate text-[1rem] font-[600] tracking-[-0.01em] sm:text-[1.0625rem]">{a.name}</span>
          </span>

          {w.days ? (
            <span className="ml-9 grid w-[10.5rem] grid-cols-5 gap-1 sm:ml-0 sm:w-auto" aria-label={`Runs ${w.at}`}>
              {DAYS.map((d, i) => {
                const on = w.days!.includes(i);
                return (
                  <span key={i} className={`grid h-7 place-items-center rounded-[6px] sm:h-8 ${on ? "bg-accent-night text-night" : "bg-white/[0.04] text-white/25"}`} aria-hidden="true">
                    <span className="mono text-[0.6875rem]">{d}</span>
                  </span>
                );
              })}
            </span>
          ) : (
            <span className="ml-9 flex h-7 min-w-0 items-center gap-1.5 justify-self-start rounded-[6px] border border-dashed border-white/20 px-2 sm:ml-0 sm:h-8 sm:justify-self-stretch">
              <Icon name="bolt" className="size-3.5 shrink-0 text-accent-night" />
              <span className="mono truncate text-[0.6875rem] text-night-ink-2">{w.on}</span>
            </span>
          )}

          <span className={`tag justify-self-end ${free ? "bg-ok-night/15 text-ok-night" : "bg-white/[0.06] text-night-ink-2"}`}>
            {free ? "Open" : "With email"}
          </span>
        </button>

        {isOpen && (
          <div id={`agent-${a.id}`} className="swap-in grid gap-4 px-3 pb-5 pt-1 sm:px-4 sm:pl-[3.25rem] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8">
            <div>
              <p className="text-[1.0625rem] leading-relaxed text-night-ink">{a.does}</p>
              <p className="mono mt-4 text-[0.6875rem] uppercase tracking-[0.08em] text-night-ink-2">Connects</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {a.connect.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.8125rem]">
                    <Icon name={connectIcon(c)} className="size-3.5 text-accent-night" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[10px] bg-night p-4 ring-1 ring-white/[0.06]">
              <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-night-ink-2">
                {free ? "The instruction, open now" : "The instruction, with your email"}
              </p>
              {free ? (
                <p className="mt-2 text-[0.875rem] leading-relaxed text-night-ink">{a.prompt}</p>
              ) : (
                <span className="mt-3 grid gap-2" aria-hidden="true">
                  <span className="h-2.5 w-full rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-11/12 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2/3 rounded-full bg-white/[0.08]" />
                </span>
              )}
              {!free && (
                <Link href={packHref} className="tlink chev mt-3 inline-block text-[0.875rem]">
                  Unlock all ten
                </Link>
              )}
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-3 grid grid-cols-[minmax(0,1fr)] gap-3 px-3 sm:grid-cols-[minmax(0,1fr)_16rem_7rem] sm:gap-6 sm:px-4">
          <span className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">On a schedule</span>
          <span className="mono hidden text-[0.75rem] text-night-ink-2 sm:block">Mon to Fri</span>
        </p>
        <ol className="grid gap-1">{scheduled.map(row)}</ol>
      </div>
      <div>
        <p className="mb-3 px-3 sm:px-4">
          <span className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">When something happens</span>
        </p>
        <ol className="grid gap-1">{triggered.map(row)}</ol>
      </div>
    </div>
  );
}
