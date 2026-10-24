"use client";

import { useActionState, useId, useState } from "react";
import { saveLead, type ActionState } from "@/app/library-actions";
import { trackEvent } from "@/lib/session";

const idle: ActionState = { status: "idle" };

export function Interest({ persona }: { persona: string }) {
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
