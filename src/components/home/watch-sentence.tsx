"use client";

import { useActionState, useId } from "react";
import { saveWatch, type ActionState } from "@/app/library-actions";
import { trackEvent } from "@/lib/session";

const idle: ActionState = { status: "idle" };
const blank =
  "inline-block h-[1.3em] rounded-[6px] border border-transparent bg-ground-2 px-[0.3em] align-baseline text-ink outline-none placeholder:text-ink-2/70 focus:bg-[#e9e9ec] focus-visible:outline-2 focus-visible:outline-accent";

/** The closing sentence has two gaps, and the gaps are the form. */
export function WatchSentence() {
  const id = useId();
  const [state, action, pending] = useActionState(saveWatch, idle);

  if (state.status === "ok")
    return (
      <p role="status" className="max-w-[40rem] text-[clamp(1.5rem,2.6vw,2.25rem)] font-[560] leading-[1.25] tracking-[-0.025em]">
        You’re on the list. {state.emailed ? "Confirm from your inbox and we’ll take it from there." : "The morning someone’s agent does it, you’ll get the link."}
      </p>
    );

  return (
    <form action={action} onSubmit={() => trackEvent("watch_submit")}>
      <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-[560] leading-[1.5] tracking-[-0.025em]">
        <label htmlFor={`${id}-e`}>Email</label>{" "}
        <input id={`${id}-e`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={`${blank} w-[9.5em] max-w-full`} />{" "}
        <label htmlFor={`${id}-q`}>the morning someone’s agent can</label>{" "}
        <input id={`${id}-q`} name="query" required minLength={3} maxLength={160} placeholder="book a table" className={`${blank} w-[8.5em] max-w-full`} />{" "}
        <button type="submit" disabled={pending} className="inline-block h-[1.3em] rounded-[6px] border border-transparent bg-accent px-[0.4em] align-baseline text-accent-ink transition-colors duration-[180ms] hover:bg-accent-hover disabled:opacity-60">
          {pending ? "Saving…" : "Watch"}
        </button>
      </p>
      <div aria-hidden="true" className="sr-only">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-small text-error">
          {state.message}
        </p>
      )}
    </form>
  );
}
