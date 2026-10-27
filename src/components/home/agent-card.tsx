"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { livePack } from "@/data/packs";

const agent = livePack.agents.find((a) => a.id === "inbox")!;

/** What the agent read this morning. Made-up details, labelled as an illustration on the card. */
const read: { icon: IconName; source: string; found: string }[] = [
  { icon: "mail", source: "Email", found: "14 new overnight, 3 need you" },
  { icon: "calendar", source: "Calendar", found: "Free Thursday, 2 to 4pm" },
  { icon: "file", source: "Files", found: "Spring price list.pdf" },
];

/**
 * One agent from the free pack, mid-morning: what it ran, what it read, the
 * reply it drafted and is holding for you. Approving shows the outcome. The
 * agent and its rule are the pack's own; the names and times are illustrative.
 */
export function AgentCard() {
  const [approved, setApproved] = useState(false);
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-[8px] bg-surface shadow-[0_0_0_1px_rgb(27_26_24/0.12),0_30px_60px_-30px_rgb(27_26_24/0.45)]">
        {/* what it is */}
        <div className="flex items-center justify-between gap-3 bg-night px-4 py-3 text-night-ink">
          <span className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-[5px] bg-accent text-accent-ink">
              <Icon name="mail" className="size-4" />
            </span>
            <span className="text-[0.9375rem] font-[600]">{agent.name}</span>
          </span>
          <span className="mono text-[0.6875rem] uppercase tracking-[0.06em] text-night-ink-2">Ran 6:30am · your Muse</span>
        </div>

        {/* what it read */}
        <ul className="grid grid-cols-3 border-b border-ink/10">
          {read.map((r, i) => (
            <li key={r.source} className={`px-3 py-3 sm:px-4 ${i > 0 ? "border-l border-ink/10" : ""}`}>
              <span className="flex items-center gap-1.5 text-[0.75rem] text-ink-2">
                <Icon name={r.icon} className="size-3.5 text-accent" /> {r.source}
              </span>
              <span className="mt-1 block text-[0.8125rem] font-[560] leading-snug">{r.found}</span>
            </li>
          ))}
        </ul>

        {/* what it drafted */}
        <div className="px-4 py-4 sm:px-5">
          <p className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
            <span>
              <span className="text-ink-2">To</span> <span className="font-[600]">Dana, Northside Florist</span>
            </span>
            <span className={`mono text-[0.6875rem] uppercase tracking-[0.06em] ${approved ? "text-ok" : "text-ink-2"}`}>{approved ? "Sent" : "Draft"}</span>
          </p>
          <p className="mt-2 text-[1rem] font-[640] tracking-[-0.01em]">Re: Order for the 14th</p>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/85">
            Hi Dana, yes, the 14th works. I’m free Thursday between 2 and 4 if you’d like to go over the arrangements, and I’ve attached our spring price list.
          </p>
        </div>

        {/* your call */}
        <div aria-live="polite" className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 transition-colors duration-200 sm:px-5 ${approved ? "border-ok/20 bg-ok/[0.07]" : "border-ink/10 bg-ground"}`}>
          {approved ? (
            <>
              <span className="flex items-center gap-2 text-[0.9375rem] font-[600] text-ok">
                <Icon name="check" className="size-4" strokeWidth={2.4} /> Approved by you · sent from your account at 7:12
              </span>
              <button type="button" onClick={() => setApproved(false)} className="min-h-10 text-[0.875rem] text-ink-2 underline underline-offset-4 hover:text-ink">
                Reset
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2 text-[0.9375rem] font-[600]">
                <span className="size-2 rounded-full bg-accent" aria-hidden="true" /> Waiting for you
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => setApproved(true)} className="btn btn-s min-h-10 px-4">
                  <Icon name="check" className="size-3.5" strokeWidth={2.4} /> Approve
                </button>
              </span>
            </>
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[0.8125rem] text-ink-2">
        <span className="flex items-center gap-1.5">
          <Icon name="shield" className="size-3.5 text-accent" /> Rule: leaves every draft unsent for you to approve
        </span>
        <span>Illustration: an agent from the free pack</span>
      </figcaption>
    </figure>
  );
}
