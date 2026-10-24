"use client";

import { useState } from "react";
import type { Agent } from "@/data/packs";

/**
 * The free pack's ten agents as a board. One row is open and shows what the
 * agent does; click another to open that one instead.
 */
export function PackBoard({ agents, openCount }: { agents: Agent[]; openCount: number }) {
  const [open, setOpen] = useState(agents[3]?.id ?? agents[0]?.id);

  return (
    <ol data-ui className="space-y-1">
      {agents.map((a, i) => {
        const isOpen = a.id === open;
        const free = i < openCount;
        return (
          <li key={a.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(a.id)}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 rounded-[8px] border border-transparent px-5 text-left transition-colors duration-[240ms] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] ${
                isOpen ? "bg-accent-night py-6 text-night" : "min-h-[72px] bg-night-2 text-night-ink hover:bg-[#232327]"
              }`}
            >
              <span className="text-lead font-[600] md:text-[2rem] md:tracking-[-0.03em]">{a.name}</span>
              <span className={`hidden text-[1rem] md:block ${isOpen ? "text-night/80" : "text-night-ink-2"}`}>{a.connect.join(" · ")}</span>
              <span
                className={`rounded-[6px] px-3 py-1.5 text-[0.875rem] font-[600] ${
                  isOpen ? "bg-night text-night-ink" : free ? "bg-accent-night text-night" : "bg-white/[0.08] text-night-ink-2"
                }`}
              >
                {free ? "Open" : "With email"}
              </span>
              {isOpen && (
                <span className="col-span-full mt-3 block max-w-[48rem] text-lead">
                  {a.does}
                  <span className="mt-1 block text-night/75 md:hidden">Connects: {a.connect.join(", ")}</span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
