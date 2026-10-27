import { Icon } from "@/components/icons";
import { categoryLabel, type UseCase } from "@/data/library";
import type { Agent } from "@/data/packs";

/**
 * One real chain, left to right: someone's public post (linked, never
 * copied), the library entry it became, and the free pack's instruction for
 * that kind of task pasted into your own agent. Connected, on the copper band.
 */
export function Journey({ entry, agent }: { entry: UseCase; agent: Agent }) {
  const initial = entry.handle.replace("@", "").charAt(0).toUpperCase();
  const host = (() => {
    try {
      return new URL(entry.url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const where = /(^|\.)(x|twitter)\.com$/.test(host) ? "X" : host === "news.ycombinator.com" ? "Hacker News" : host;
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-y-10 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)]">
      <Stage n={1} title="Someone posts it">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-night text-[0.9375rem] font-[700] text-night-ink">{initial}</span>
          <span>
            <span className="block text-[0.9375rem] font-[600]">{entry.handle}</span>
            <span className="block text-[0.8125rem] text-ink-2">public post{where ? ` · ${where}` : ""}</span>
          </span>
        </div>
        <span className="mt-4 grid gap-2" aria-hidden="true">
          <span className="h-2.5 w-full rounded-full bg-ink/10" />
          <span className="h-2.5 w-[92%] rounded-full bg-ink/10" />
          <span className="h-2.5 w-[64%] rounded-full bg-ink/10" />
        </span>
        <a href={entry.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-auto inline-flex min-h-10 items-center gap-1.5 pt-4 text-[0.875rem] font-[600] text-accent hover:underline hover:underline-offset-4">
          Read it where it was posted <Icon name="external" className="size-3.5" />
        </a>
      </Stage>

      <Arrow />

      <Stage n={2} title="We file it">
        <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-accent">{categoryLabel(entry.category)} · {entry.tool}</p>
        <p className="mt-2 text-[1.25rem] font-[650] leading-snug tracking-[-0.02em]">{entry.title}</p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{entry.summary}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-[0.8125rem] text-ink-2">
          <Icon name="pen" className="size-3.5" /> In our words, linked to the post
        </p>
      </Stage>

      <Arrow />

      <Stage n={3} title="You run it">
        <p className="text-[0.8125rem] text-ink-2">Your agent · Muse, Grok Bot, Hark or any</p>
        <p className="mono mt-2 rounded-[6px] border border-ink/15 bg-ground p-3 text-[0.8125rem] leading-relaxed">“{agent.prompt}”</p>
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-[0.8125rem] font-[600]">
          <Icon name="shield" className="size-3.5 text-accent" /> {agent.name}, from the free pack, running on your own accounts.
        </p>
      </Stage>
    </ol>
  );
}

function Stage({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col">
      <p className="flex items-baseline gap-3 text-accent-ink">
        <span className="display text-[2.75rem] text-night/80">{n}</span>
        <span className="text-[1.25rem] font-[650] tracking-[-0.015em]">{title}</span>
      </p>
      <div className="mt-4 flex flex-1 flex-col rounded-[8px] bg-surface p-5 text-ink shadow-[0_24px_48px_-28px_rgb(0_0_0/0.55)]">{children}</div>
    </li>
  );
}

/** The join between two stages: across on wide screens, down on narrow ones. */
function Arrow() {
  return (
    <li aria-hidden="true" className="flex items-center justify-center text-accent-ink/80 lg:pt-16">
      <svg viewBox="0 0 48 16" className="hidden h-4 w-12 lg:block" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h42M37 2l7 6-7 6" />
      </svg>
      <svg viewBox="0 0 16 40" className="h-10 w-4 lg:hidden" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v34M2 29l6 7 6-7" />
      </svg>
    </li>
  );
}
