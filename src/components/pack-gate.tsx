"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { saveLead, type ActionState } from "@/app/library-actions";
import { readUtm, trackEvent, useMounted } from "@/lib/session";

const idle: ActionState = { status: "idle" };

/** Email unlocks the rest of the pack; the page re-renders with all ten. */
export function PackGate({ persona, locked }: { persona: string; locked: string[] }) {
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
    <form action={action} className="on-night grid gap-8 rounded-[8px] bg-night p-7 text-night-ink sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <h2 className="text-h2">Get the other {locked.length}</h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-small text-night-ink">
          {locked.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      <div className="lg:self-end">
        <p className="max-w-[30rem] text-small text-night-ink">Free. We’ll also send the pack to your inbox, and one new use case a week that fits it. Unsubscribe any time.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
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
          className="h-12 min-w-0 flex-1 rounded-[8px] border border-white/25 bg-white/[0.06] px-4 text-body text-white outline-none placeholder:text-white/55 focus:border-white"
        />
        <input type="hidden" name="persona" value={persona} />
        <input type="hidden" name="kind" value="pack" />
        <input type="hidden" name="utm" value={utm} />
        <div aria-hidden="true" className="sr-only">
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" disabled={pending} className="btn btn-l btn-light">
          {pending ? "Sending…" : "Send me all ten"}
        </button>
        </div>
        {state.status === "error" && (
          <p role="alert" className="mt-3 text-small text-white">
            {state.message}
          </p>
        )}
      </div>
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
