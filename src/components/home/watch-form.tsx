"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { saveWatch, type ActionState } from "@/app/library-actions";
import { trackEvent } from "@/lib/session";

const idle: ActionState = { status: "idle" };

/**
 * The watch, as a form with a preview of the email it leads to. The preview
 * follows the real watch email (lib/watches.ts): its subject, its layout, its
 * stop link. The match in it is a real search of the library for whatever is
 * typed, so it only shows what a watch could actually find.
 */
const SAMPLE = "gift cards";
type Hit = { title: string; summary: string };

export function WatchForm() {
  const id = useId();
  const [state, action, pending] = useActionState(saveWatch, idle);
  const [query, setQuery] = useState("");
  const shown = query.trim() || SAMPLE;
  const [match, setMatch] = useState<{ q: string; hit: Hit | null } | null>(null);

  useEffect(() => {
    if (shown.length < 3) return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/library/search?${new URLSearchParams({ q: shown })}`, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { items: Hit[] } | null) => d && setMatch({ q: shown, hit: d.items[0] ?? null }))
        .catch(() => {});
    }, 300);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [shown]);
  const hit = match?.q === shown ? match.hit : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      {state.status === "ok" ? (
        <p role="status" className="self-center text-[1.5rem] font-[620] leading-snug tracking-[-0.02em]">
          You’re on the list. {state.emailed ? "Confirm from your inbox and we’ll take it from there." : "The morning someone’s agent does it, you’ll get the link."}
        </p>
      ) : (
        <form action={action} onSubmit={() => trackEvent("watch_submit")} className="grid content-start gap-4">
          <div>
            <label htmlFor={`${id}-q`} className="block text-[0.9375rem] font-[600]">
              Your agent should…
            </label>
            <input
              id={`${id}-q`}
              name="query"
              required
              minLength={3}
              maxLength={160}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SAMPLE}
              className="mt-2 h-13 w-full rounded-full bg-ground px-6 text-[1.0625rem] text-ink outline-none placeholder:text-ink-2/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ground"
            />
          </div>
          <div>
            <label htmlFor={`${id}-e`} className="block text-[0.9375rem] font-[600]">
              Email
            </label>
            <input
              id={`${id}-e`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 h-13 w-full rounded-full bg-ground px-6 text-[1.0625rem] text-ink outline-none placeholder:text-ink-2/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ground"
            />
          </div>
          <div aria-hidden="true" className="sr-only">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={pending} className="btn btn-l btn-ink mt-2 w-full disabled:opacity-60 sm:w-auto sm:justify-self-start">
            {pending ? "Saving…" : "Watch for it"}
          </button>
          {state.status === "error" && (
            <p role="alert" className="text-[0.9375rem] font-[600] text-ground">
              {state.message}
            </p>
          )}
        </form>
      )}

      {/* what lands in the inbox */}
      <figure aria-label="What the email looks like">
        <div className="overflow-hidden rounded-[10px] bg-surface text-ink">
          <div className="border-b border-ink/10 px-5 py-3.5 text-[0.8125rem]">
            <p className="flex justify-between gap-3">
              <span>
                <span className="text-ink-2">From</span> <span className="font-[600]">Roger</span> <span className="text-ink-2">&lt;library@meetroger.ai&gt;</span>
              </span>
              <span className="text-ink-2">7:30am</span>
            </p>
            <p className="mt-1 truncate font-[650] text-[0.9375rem]">Someone’s agent did it: {hit ? hit.title : "…"}</p>
          </div>
          <div className="px-5 py-4 text-[0.9375rem] leading-relaxed">
            <p>
              New for your watch <strong>“{shown}”</strong>:
            </p>
            <div className="mt-3 border-l-2 border-cobalt pl-3">
              {hit ? (
                <>
                  <p className="font-[600]">{hit.title}</p>
                  <p className="line-clamp-2 text-ink-2">{hit.summary}</p>
                </>
              ) : (
                <p className="text-ink-2">{hit === null ? "Nothing in the library yet. This email comes the morning one appears." : "Looking in the library…"}</p>
              )}
            </div>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem]">
              <span className="text-cobalt underline underline-offset-4">Want it set up for you?</span>
              <span className="text-ink-2 underline underline-offset-4">Stop this watch</span>
            </p>
          </div>
        </div>
        <figcaption className="mt-3 text-[0.8125rem] text-cobalt-ink-2">The email you’d get, matched live from the library</figcaption>
      </figure>
    </div>
  );
}
