"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, connectIcon } from "@/components/icons";
import type { Agent } from "@/data/packs";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/**
 * Where each agent sits in the week, read from its own instruction in
 * data/packs.ts. Instructions that give no time ("each morning", "every
 * Monday") sit in the any-time rows, the way a calendar shows all-day events.
 */
const timed: { id: string; row: "any1" | "any2" | "t645" | "t800"; days: number[] }[] = [
  { id: "inbox", row: "any1", days: [0, 1, 2, 3, 4] },
  { id: "invoices", row: "any2", days: [0] },
  { id: "content", row: "any2", days: [4] },
  { id: "brief", row: "t645", days: [0, 1, 2, 3, 4] },
  { id: "numbers", row: "t800", days: [0] },
];
const triggers: Record<string, string> = {
  leads: "A new enquiry arrives",
  reviews: "A new review comes in",
  meetings: "A meeting ends",
  subscriptions: "3 days before a renewal",
  receipts: "A receipt lands in email",
};
const ROWS = { any1: 1, any2: 2, t645: 3, t800: 4 } as const;

export function PackCalendar({ agents, openCount, packHref }: { agents: Agent[]; openCount: number; packHref: string }) {
  const [sel, setSel] = useState("brief");
  const [day, setDay] = useState(0);
  const byId = new Map(agents.map((a, i) => [a.id, { a, free: i < openCount }]));
  const current = byId.get(sel);

  const block = (id: string, extra = "", style?: React.CSSProperties) => {
    const hit = byId.get(id);
    if (!hit) return null;
    const on = sel === id;
    return (
      <button
        key={`${id}-${extra}`}
        type="button"
        aria-pressed={on}
        onClick={() => setSel(id)}
        style={style}
        className={`flex min-h-10 min-w-0 items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[0.8125rem] font-[600] leading-tight transition-all duration-200 ${
          hit.free ? "bg-accent-night text-night hover:brightness-105" : "bg-white/[0.07] text-night-ink ring-1 ring-inset ring-white/10 hover:bg-white/[0.11]"
        } ${on ? "outline-2 outline-offset-2 outline-night-ink" : ""}`}
      >
        <span className={`size-1.5 shrink-0 rounded-full ${hit.free ? "bg-night/50" : "bg-accent-night"}`} aria-hidden="true" />
        <span className="line-clamp-2">{hit.a.name}</span>
      </button>
    );
  };

  return (
    <div className="window rounded-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
        <span className="flex items-center gap-4">
          <span className="chrome-dots" aria-hidden="true"><span /><span /><span /></span>
          <span className="text-[0.875rem] font-[600]">A week with the free pack</span>
        </span>
        <span className="flex items-center gap-4 text-[0.75rem] text-night-ink-2">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-accent-night" />Open now</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-white/20" />With your email</span>
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_17rem]">
        {/* the week (tablet and up) */}
        <div className="hidden p-4 sm:block sm:p-5">
          <div className="grid grid-cols-[4.5rem_repeat(5,minmax(0,1fr))] gap-x-1.5">
            <span />
            {DAYS.map((d) => (
              <span key={d} className="kicker pb-3 text-center text-night-ink-2">{d}</span>
            ))}
          </div>
          <div className="relative grid grid-cols-[4.5rem_repeat(5,minmax(0,1fr))] grid-rows-[repeat(4,minmax(3.5rem,auto))] gap-x-1.5 gap-y-1.5">
            {/* row labels and lines */}
            {[
              ["Any time", 1],
              ["", 2],
              ["6:45 am", 3],
              ["8:00 am", 4],
            ].map(([l, r]) => (
              <span key={r} className="mono self-center text-[0.6875rem] text-night-ink-2" style={{ gridRow: r as number, gridColumn: 1 }}>
                {l}
              </span>
            ))}
            {[1, 2, 3, 4, 5].map((c) => (
              <span key={c} aria-hidden="true" className="rounded-[8px] bg-white/[0.02] ring-1 ring-inset ring-white/[0.04]" style={{ gridColumn: c + 1, gridRow: "1 / span 4" }} />
            ))}
            {timed.map((t) => {
              const contiguous = t.days.length > 1 && t.row === "any1";
              if (contiguous)
                return block(t.id, "span", { gridRow: ROWS[t.row], gridColumn: `${t.days[0] + 2} / span ${t.days.length}`, alignSelf: "center" });
              return t.days.map((d) => block(t.id, String(d), { gridRow: ROWS[t.row], gridColumn: d + 2, alignSelf: "center" }));
            })}
          </div>
        </div>

        {/* one day at a time (phones) */}
        <div className="p-4 sm:hidden">
          <div role="tablist" aria-label="Day" className="grid grid-cols-5 gap-1">
            {DAYS.map((d, i) => (
              <button key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)} className={`min-h-10 rounded-[8px] text-[0.8125rem] font-[600] ${day === i ? "bg-night-ink text-night" : "bg-white/[0.05] text-night-ink-2"}`}>
                {d}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-1.5">
            {timed
              .filter((t) => t.days.includes(day))
              .sort((a, b) => ROWS[a.row] - ROWS[b.row])
              .map((t) => (
                <div key={t.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2">
                  <span className="mono text-[0.6875rem] text-night-ink-2">{t.row === "t645" ? "6:45 am" : t.row === "t800" ? "8:00 am" : "Any time"}</span>
                  {block(t.id, "m")}
                </div>
              ))}
          </div>
        </div>

        {/* agents that wait for something */}
        <div className="border-t border-white/[0.07] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="kicker flex items-center gap-2 text-night-ink-2">
            <Icon name="bolt" className="size-3.5 text-accent-night" /> When something happens
          </p>
          <ul className="mt-3 grid gap-1.5">
            {Object.entries(triggers).map(([id, when]) => (
              <li key={id} className="grid gap-1">
                {block(id, "t")}
                <span className="pl-6 text-[0.75rem] text-night-ink-2">{when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {current && (
        <div key={sel} className="swap-in grid gap-5 border-t border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center md:gap-10">
          <div>
            <p className="flex items-center gap-3">
              <span className="text-[1.375rem] font-[650] tracking-[-0.03em]">{current.a.name}</span>
              <span className={`tag ${current.free ? "bg-ok-night/15 text-ok-night" : "bg-white/[0.07] text-night-ink-2"}`}>{current.free ? "Open now" : "With your email"}</span>
            </p>
            <p className="mt-2 text-[1rem] leading-relaxed text-night-ink-2">{current.a.does}</p>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {current.a.connect.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.75rem]">
                <Icon name={connectIcon(c)} className="size-3.5 text-accent-night" />
                {c}
              </li>
            ))}
          </ul>
          <Link href={packHref} className="btn btn-m whitespace-nowrap">
            {current.free ? "Get its instruction" : "Unlock all ten"}
          </Link>
        </div>
      )}
    </div>
  );
}
