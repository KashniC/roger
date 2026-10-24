"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { saveLead, type ActionState } from "@/app/library-actions";
import { readUtm, trackEvent, useMounted } from "@/lib/session";

const idle: ActionState = { status: "idle" };

/** Email unlocks the rest of the pack; the page re-renders with all ten. */
export function PackGate({ persona, remaining }: { persona: string; remaining: number }) {
  const id = useId();
  const router = useRouter();
  const [state, action, pending] = useActionState(saveLead, idle);
  const mounted = useMounted();
  const u = mounted ? readUtm() : {};
  const utm = [u.utm_source, u.utm_medium, u.utm_campaign].filter(Boolean).join("/");
  useEffect(() => {
    if (state.status === "ok") {
      trackEvent("pack_signup", { persona });
      router.refresh();
    }
  }, [state.status, persona, router]);

  return (
    <form action={action} className="lit-card rounded-[32px] p-7 sm:p-9">
      <h2 className="text-h3">Get the other {remaining}.</h2>
      <p className="mt-2 max-w-[30rem] text-small text-white/75">Free. We’ll also send the pack to your inbox and one new use case a week that fits it. Unsubscribe any time.</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-e`} className="sr-only">
          Email
        </label>
        <input
          id={`${id}-e`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-12 min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-body text-white outline-none placeholder:text-white/55 focus:border-white"
        />
        <input type="hidden" name="persona" value={persona} />
        <input type="hidden" name="kind" value="pack" />
        <input type="hidden" name="utm" value={utm} />
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" disabled={pending} className="btn btn-m btn-light">
          {pending ? "Unlocking…" : "Unlock the pack"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-small text-white">
          {state.message}
        </p>
      )}
    </form>
  );
}

export function CopyPrompt({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard blocked: the text is on screen to copy by hand */
        }
      }}
      className="min-h-9 rounded-full border border-rule-strong px-3 text-meta font-[560] transition-colors hover:border-ink"
    >
      {done ? "Copied" : label}
    </button>
  );
}
