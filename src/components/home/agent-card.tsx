"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { livePack } from "@/data/packs";

const agent = livePack.agents.find((a) => a.id === "inbox")!;

/**
 * One agent from the free pack holding a reply for you. Approving shows the
 * outcome. The agent and its rule are the pack's own; the reply is made up,
 * and the caption says so.
 */
export function AgentCard() {
  const [approved, setApproved] = useState(false);
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-[8px] bg-surface shadow-[0_0_0_1px_rgb(27_26_24/0.12),0_30px_60px_-30px_rgb(27_26_24/0.45)]">
        <div className="flex items-center justify-between gap-3 bg-night px-6 py-4 text-night-ink">
          <span className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-[5px] bg-accent text-accent-ink">
              <Icon name="mail" className="size-4" />
            </span>
            <span className="text-[1.125rem] font-[600]">{agent.name}</span>
          </span>
          <span className="mono text-[0.75rem] text-night-ink-2">6:30am</span>
        </div>

        <div className="px-6 py-7">
          <p className="text-[0.9375rem] text-ink-2">To Dana, Northside Florist</p>
          <p className="mt-3 text-[clamp(1.1875rem,1.6vw,1.4375rem)] font-[560] leading-snug tracking-[-0.015em]">Yes, the 14th works. I’m free Thursday 2 to 4, and I’ve attached our price list.</p>
        </div>

        <div aria-live="polite" className={`flex min-h-[4.5rem] items-center justify-between gap-3 border-t px-6 py-3 transition-colors duration-200 ${approved ? "border-ok/20 bg-ok/[0.07]" : "border-ink/10 bg-ground"}`}>
          {approved ? (
            <>
              <span className="flex items-center gap-2 text-[1rem] font-[600] text-ok">
                <Icon name="check" className="size-4" strokeWidth={2.4} /> Sent, because you said yes
              </span>
              <button type="button" onClick={() => setApproved(false)} className="min-h-10 text-[0.875rem] text-ink-2 underline underline-offset-4 hover:text-ink">
                Undo
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-2 text-[1rem] font-[600]">
                <span className="size-2 rounded-full bg-accent" aria-hidden="true" /> Waiting for you
              </span>
              <button type="button" onClick={() => setApproved(true)} className="btn btn-s min-h-10 px-4">
                <Icon name="check" className="size-3.5" strokeWidth={2.4} /> Approve
              </button>
            </>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-[0.8125rem] text-ink-2">Illustration of an agent from the free pack</figcaption>
    </figure>
  );
}
