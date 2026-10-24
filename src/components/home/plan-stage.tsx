"use client";

import Link from "next/link";
import { useState } from "react";

export type Plan = { name: string; price: string; per: string; body: string; cta: string; href: string };

function Stage({ p }: { p: Plan }) {
  return (
    <div key={p.name} className="stage-swap">
      <p className="flex items-baseline gap-3">
        <span className="text-[clamp(4.5rem,9vw,8.5rem)] font-[650] leading-[0.9] tracking-[-0.05em] tabular-nums">{p.price}</span>
        {p.per && <span className="text-lead text-ink-2">{p.per}</span>}
      </p>
      <p className="mt-6 max-w-[30rem] text-lead">{p.body}</p>
      <Link href={p.href} className="btn btn-l mt-8">
        {p.cta}
      </Link>
    </div>
  );
}

/** Plans as a list of names; the price shown belongs to the one selected. */
export function PlanStage({ plans, start = 1 }: { plans: Plan[]; start?: number }) {
  const [sel, setSel] = useState(start);
  const current = plans[sel] ?? plans[0];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:items-start">
      <ul className="space-y-1">
        {plans.map((p, i) => {
          const on = i === sel;
          return (
            <li key={p.name}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setSel(i)}
                onFocus={() => setSel(i)}
                className={`flex items-center gap-[0.35em] rounded-[8px] border border-transparent text-left text-[clamp(2.5rem,4.6vw,4.5rem)] font-[640] leading-[1.1] tracking-[-0.04em] transition-colors duration-[180ms] ${on ? "text-ink" : "text-ink/35 hover:text-ink/60"}`}
              >
                <span aria-hidden="true" className={`size-[0.3em] shrink-0 rounded-full bg-accent transition-opacity duration-[180ms] ${on ? "opacity-100" : "opacity-0"}`} />
                {p.name}
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite">
        <Stage p={current} />
      </div>
    </div>
  );
}
