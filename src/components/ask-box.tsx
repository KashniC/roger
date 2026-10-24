"use client";

import { useRouter } from "next/navigation";
import { useActionState, useId, useState } from "react";
import { saveWatch, type ActionState } from "@/app/library-actions";
import { trackEvent } from "@/lib/session";

const idle: ActionState = { status: "idle" };

/**
 * One box, two answers. "Search" finds what people's agents already do;
 * "Watch for it" saves the wish and emails the day someone's agent does it.
 */
export function AskBox({ count, examples, tone = "light" }: { count: number; examples: string[]; tone?: "light" | "night" }) {
  const id = useId();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [watching, setWatching] = useState(false);
  const [state, action, pending] = useActionState(saveWatch, idle);
  const night = tone === "night";

  const search = (query: string) => {
    const v = query.trim();
    trackEvent("library_search", { q: v.slice(0, 60) });
    router.push(v ? `/library?q=${encodeURIComponent(v)}` : "/library");
  };

  if (state.status === "ok") {
    return (
      <div role="status" className={`rounded-[var(--radius-object)] border p-6 ${night ? "border-white/15 bg-white/[0.06]" : "border-rule bg-surface"}`}>
        <p className="text-title">You’re on the watch list for “{q}”.</p>
        <p className={`mt-2 text-small ${night ? "text-night-ink-2" : "text-ink-2"}`}>
          {state.emailed ? "Check your email to confirm it." : "We’ll email you to confirm, then the day someone’s agent does it."}
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!watching) {
          e.preventDefault();
          search(q);
        } else {
          trackEvent("watch_submit");
        }
      }}
      className={`rounded-[var(--radius-object)] border p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.35)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 ${night ? "border-white/15 bg-[#17181f] focus-within:outline-[var(--color-accent-night)]" : "border-rule-strong bg-surface focus-within:outline-[var(--color-accent)]"}`}
    >
      <label htmlFor={`${id}-q`} className={`block px-4 pt-3 text-meta font-[560] ${night ? "text-night-ink-2" : "text-ink-2"}`}>
        I want my agent to…
      </label>
      <input
        id={`${id}-q`}
        name="query"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        maxLength={160}
        placeholder="chase overdue invoices"
        autoComplete="off"
        className={`w-full border border-transparent bg-transparent px-4 pb-3 pt-1 text-[1.375rem] tracking-[-0.02em] outline-none ${night ? "placeholder:text-white/35" : "placeholder:text-ink-2/60"}`}
      />
      {watching && (
        <div className="px-4 pb-3">
          <label htmlFor={`${id}-e`} className={`block text-meta font-[560] ${night ? "text-night-ink-2" : "text-ink-2"}`}>
            Email me when someone’s agent does it
          </label>
          <input
            id={`${id}-e`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`mt-1 h-11 w-full rounded-[var(--radius-control)] border px-3 text-body outline-none ${night ? "border-white/20 bg-transparent focus:border-white" : "border-rule-strong focus:border-ink"}`}
          />
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
        {watching ? (
          <>
            <button type="submit" disabled={pending || q.trim().length < 3} className="btn btn-m disabled:opacity-50">
              {pending ? "Saving…" : "Watch for it"}
            </button>
            <button type="button" onClick={() => setWatching(false)} className={`min-h-11 rounded-full px-4 text-small ${night ? "text-night-ink-2" : "text-ink-2"}`}>
              Back to search
            </button>
          </>
        ) : (
          <>
            <button type="submit" className={`btn btn-m ${night ? "btn-light" : "btn-ink"}`}>
              Search {count} use cases
            </button>
            <button
              type="button"
              onClick={() => setWatching(true)}
              className={`min-h-11 rounded-full border px-5 text-small font-[560] transition-colors ${night ? "border-white/25 hover:border-white" : "border-rule-strong hover:border-ink"}`}
            >
              Watch for it
            </button>
          </>
        )}
      </div>
      {state.status === "error" && (
        <p role="alert" className="px-4 pb-3 text-small text-error">
          {state.message}
        </p>
      )}
      {!watching && (
        <p className={`flex flex-wrap gap-2 px-4 pb-3 text-meta ${night ? "text-night-ink-2" : "text-ink-2"}`}>
          {examples.map((x) => (
            <button key={x} type="button" onClick={() => search(x)} className={`min-h-8 rounded-full border px-3 transition-colors ${night ? "border-white/15 hover:border-white/40" : "border-rule hover:border-rule-strong hover:text-ink"}`}>
              {x}
            </button>
          ))}
        </p>
      )}
    </form>
  );
}
