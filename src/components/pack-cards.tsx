"use client";

import { useActionState, useId, useState } from "react";
import { saveLead, type ActionState } from "@/app/library-actions";
import { trackEvent } from "@/lib/session";

const idle: ActionState = { status: "idle" };

/** "Tell me when" for a pack that isn't out yet. Dark by default; light for paper sections. */
export function Interest({ persona, tone = "dark" }: { persona: string; tone?: "dark" | "light" }) {
  const light = tone === "light";
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
        className={`chip min-h-11 rounded-full border px-4 text-small font-[600] transition-colors ${light ? "border-ink/30 text-ink hover:bg-ink/5" : "border-white/50 text-white hover:bg-white/10"}`}
      >
        Tell me when
      </button>
    );
  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor={`${id}-e`} className="sr-only">
        Email
      </label>
      <input id={`${id}-e`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={`h-11 rounded-full border px-4 text-small outline-none ${light ? "border-rule-strong bg-surface text-ink placeholder:text-ink-2 focus:border-ink" : "border-white/40 bg-white/10 text-white placeholder:text-white/60 focus:border-white"}`} />
      <input type="hidden" name="persona" value={persona} />
      <input type="hidden" name="kind" value="interest" />
      <button type="submit" disabled={pending} className={`min-h-11 rounded-full px-4 text-small font-[600] ${light ? "bg-ink text-ground" : "bg-white text-[#191816]"}`}>
        {pending ? "Saving…" : "Tell me when it’s ready"}
      </button>
      {state.status === "error" && <p className={`text-meta ${light ? "text-error" : "text-white"}`}>{state.message}</p>}
    </form>
  );
}
