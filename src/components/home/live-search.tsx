"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState } from "react";
import { saveWatch, type ActionState } from "@/app/library-actions";
import { Icon } from "@/components/icons";
import { ExternalIcon } from "@/components/use-case-card";
import type { UseCase } from "@/data/library";
import { trackEvent } from "@/lib/session";

export type Entry = Pick<
  UseCase,
  "id" | "title" | "summary" | "category" | "tool" | "handle" | "url"
>;

const idle: ActionState = { status: "idle" };

/**
 * The library itself, working on the first screen: type what you want your
 * agent to do and the real posts filter as you type (searched on the server,
 * since the library runs to thousands). When nothing matches, the same box
 * becomes a watch.
 */
export function LiveSearch({
  newest,
  total,
  shelves,
}: {
  newest: Entry[];
  total: number;
  shelves: { id: string; label: string; n: number }[];
}) {
  const id = useId();
  const [q, setQ] = useState("");
  const [shelf, setShelf] = useState<string | null>(null);
  const [state, action, pending] = useActionState(saveWatch, idle);
  const [result, setResult] = useState<{
    key: string;
    total: number;
    items: Entry[];
  } | null>(null);

  const key = `${q.trim().toLowerCase()}|${shelf ?? ""}`;
  useEffect(() => {
    if (key === "|") return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (shelf) sp.set("cat", shelf);
      fetch(`/api/library/search?${sp}`, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then(
          (d: { total: number; items: Entry[] } | null) =>
            d && setResult({ key, ...d }),
        )
        .catch(() => {});
    }, 160);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [key, q, shelf]);

  // the newest until something is typed or picked; the last answer while the next one loads
  const current =
    key === "|"
      ? { total, items: newest }
      : (result ?? { total, items: newest });
  const shown = current.items;
  const href = q.trim()
    ? `/library?q=${encodeURIComponent(q.trim())}`
    : shelf
      ? `/library?cat=${shelf}`
      : "/library";

  return (
    <div data-ui className="text-night-ink">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          trackEvent("library_search", { q: q.slice(0, 60) });
          window.location.assign(href);
        }}
        className="px-4 pb-3 pt-5 sm:px-5"
      >
        <label
          htmlFor={`${id}-q`}
          className="mono block text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2"
        >
          I want my agent to…
        </label>
        <div className="relative mt-2">
        <Icon name="search" className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-night-ink-2" />
        <input
          id={`${id}-q`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={160}
          autoComplete="off"
          placeholder="chase overdue invoices"
          className="w-full border-b border-white/15 bg-transparent pb-2.5 pl-8 pt-1 text-[clamp(1.25rem,2.4vw,1.5rem)] font-[520] tracking-[-0.02em] text-night-ink outline-none transition-colors placeholder:text-white/30 focus:border-accent-night"
        />
        </div>
      </form>

      <div
        role="group"
        aria-label="Shelves"
        className="flex gap-1.5 overflow-x-auto px-4 pb-3 scrollbar-none sm:flex-wrap sm:px-5"
      >
        {[
          { id: "", label: "Everything", n: total },
          ...shelves.slice(0, 6),
        ].map((s) => {
          const on = (shelf ?? "") === s.id;
          return (
            <button
              key={s.id || "all"}
              type="button"
              aria-pressed={on}
              onClick={() => setShelf(s.id || null)}
              className={`chip min-h-9 shrink-0 rounded-full px-3.5 text-[0.8125rem] transition-colors duration-[180ms] ${on ? "bg-night-ink text-night" : "bg-white/[0.06] text-night-ink-2 hover:bg-white/[0.1] hover:text-night-ink"}`}
            >
              {s.label}{" "}
              <span className="tabular-nums opacity-70">
                {s.n.toLocaleString("en-CA")}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length > 0 ? (
        <ul aria-live="polite" className="min-h-[19.5rem] border-t border-white/[0.06] px-2 py-2">
          {shown.map((e) => (
            <li key={e.id}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 rounded-[8px] px-3 py-2.5 transition-colors duration-[180ms] hover:bg-white/[0.06]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[1rem] font-[560] tracking-[-0.01em]">
                    {e.title}
                  </span>
                  <span className="block truncate text-[0.875rem] text-night-ink-2">
                    {e.summary}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] text-night-ink-2">
                  {e.tool && (
                    <span className="hidden sm:inline">{e.tool} ·</span>
                  )}
                  <span className="hidden sm:inline">{e.handle}</span>
                  <ExternalIcon className="size-3" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : result?.key !== key ? (
        <p className="min-h-[19.5rem] border-t border-white/[0.06] px-5 py-5 text-[1rem] text-night-ink-2">Searching…</p>
      ) : state.status === "ok" ? (
        <p role="status" className="min-h-[19.5rem] border-t border-white/[0.06] px-5 py-5 text-[1rem]">
          You’re on the watch list for “{q}”.{" "}
          {state.emailed
            ? "Check your email to confirm it."
            : "We’ll email you the day someone’s agent does it."}
        </p>
      ) : (
        <form
          action={action}
          onSubmit={() => trackEvent("watch_submit")}
          className="min-h-[19.5rem] border-t border-white/[0.06] px-5 py-5"
        >
          <p className="text-[1rem]">
            Nobody’s agent does that yet. Want an email the morning one does?
          </p>
          <input type="hidden" name="query" value={q} />
          <div aria-hidden="true" className="sr-only">
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label htmlFor={`${id}-e`} className="sr-only">
              Your email
            </label>
            <input
              id={`${id}-e`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 min-w-0 flex-1 basis-56 rounded-[6px] border border-white/20 bg-transparent px-3 text-[1rem] outline-none focus:border-accent-night"
            />
            <button
              type="submit"
              disabled={pending || q.trim().length < 3}
              className="btn btn-m btn-light disabled:opacity-50"
            >
              {pending ? "Saving…" : "Watch for it"}
            </button>
          </div>
          {state.status === "error" && (
            <p role="alert" className="mt-2 text-[0.875rem] text-[#ffb4a8]">
              {state.message}
            </p>
          )}
        </form>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[0.875rem] text-night-ink-2 sm:px-5">
        <span className="tabular-nums" aria-live="polite">
          {key === "|"
            ? `${total.toLocaleString("en-CA")} in the library`
            : `${current.total.toLocaleString("en-CA")} of ${total.toLocaleString("en-CA")} match`}
        </span>
        <Link
          href={href}
          className="font-[560] text-accent-night hover:underline hover:underline-offset-4"
        >
          Open in the library ›
        </Link>
      </div>
    </div>
  );
}
