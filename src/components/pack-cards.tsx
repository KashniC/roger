"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { saveLead, type ActionState } from "@/app/library-actions";
import type { Pack } from "@/data/packs";
import { trackEvent } from "@/lib/session";

/** Each persona owns one colour, used only on its card. */
const grounds: Record<string, string> = {
  solopreneur: "radial-gradient(70% 60% at 82% 102%, rgb(240 160 100 / 0.55), transparent 70%), linear-gradient(160deg, #7b4a33, #3a2218)",
  household: "radial-gradient(70% 60% at 82% 102%, rgb(170 200 140 / 0.3), transparent 70%), linear-gradient(160deg, #55674f, #2c372a)",
  caregiving: "radial-gradient(70% 60% at 82% 102%, rgb(150 175 230 / 0.32), transparent 70%), linear-gradient(160deg, #4d5a78, #262d40)",
  "small-team": "radial-gradient(70% 60% at 82% 102%, rgb(220 160 210 / 0.3), transparent 70%), linear-gradient(160deg, #6e5a6e, #352a35)",
};

const idle: ActionState = { status: "idle" };

function Interest({ persona }: { persona: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(saveLead, idle);
  if (state.status === "ok") return <p role="status" className="text-small font-[560]">You’re on the list.</p>;
  if (!open)
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("persona_interest", { persona });
        }}
        className="chip min-h-10 rounded-full border border-white/50 px-4 text-small font-[600] text-white transition-colors hover:bg-white/10"
      >
        Tell me when
      </button>
    );
  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor={`${id}-e`} className="sr-only">
        Email
      </label>
      <input id={`${id}-e`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="h-10 rounded-full border border-white/40 bg-white/10 px-4 text-small text-white outline-none placeholder:text-white/60 focus:border-white" />
      <input type="hidden" name="persona" value={persona} />
      <input type="hidden" name="kind" value="interest" />
      <button type="submit" disabled={pending} className="min-h-10 rounded-full bg-white px-4 text-small font-[600] text-[#191816]">
        {pending ? "Saving…" : "Tell me when it’s ready"}
      </button>
      {state.status === "error" && <p className="text-meta text-white">{state.message}</p>}
    </form>
  );
}

export function PackCards({ packs }: { packs: Pack[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {packs.map((p) => (
        <li key={p.id} className="flex min-h-[17rem] flex-col justify-between rounded-[var(--radius-object)] p-6 text-white" style={{ background: grounds[p.id] }}>
          <div>
            <p className="text-meta font-[560] text-white/70">{p.status === "live" ? "Free starter pack" : "Coming soon"}</p>
            <h3 className="mt-2 text-h3">{p.persona}</h3>
            <p className="mt-2 text-small text-white/80">{p.status === "live" ? `${p.agents.length} agents: morning brief, inbox drafts, invoice chaser and more.` : p.blurb}</p>
          </div>
          <div className="mt-6">
            {p.status === "live" ? (
              <Link href={`/packs/${p.id}`} className="btn btn-m btn-light" onClick={() => trackEvent("pack_open", { persona: p.id })}>
                Get the free pack
              </Link>
            ) : (
              <Interest persona={p.id} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
