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
    <ol className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-y-8 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)]">
      <Stage n={1} title="Someone posts it">
        <a href={entry.url} target="_blank" rel="noopener noreferrer nofollow" className="group flex items-center gap-3" aria-label={`${entry.handle}’s original post${where ? ` on ${where}` : ""}`}>
          <span className="grid size-9 place-items-center rounded-full bg-night text-[0.9375rem] font-[700] text-night-ink">{initial}</span>
          <span className="text-[0.9375rem] font-[600] group-hover:text-accent">{entry.handle}</span>
          <Icon name="external" className="ml-auto size-4 text-ink-2 group-hover:text-accent" />
        </a>
        <span className="mt-5 grid gap-2" aria-hidden="true">
          <span className="h-2.5 w-full rounded-full bg-ink/10" />
          <span className="h-2.5 w-[88%] rounded-full bg-ink/10" />
          <span className="h-2.5 w-[60%] rounded-full bg-ink/10" />
        </span>
      </Stage>

      <Arrow />

      <Stage n={2} title="We file it">
        <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-accent">{categoryLabel(entry.category)}</p>
        <p className="mt-2 text-[1.375rem] font-[650] leading-snug tracking-[-0.02em]">{entry.title}</p>
      </Stage>

      <Arrow />

      <Stage n={3} title="You run it">
        <p className="mono text-[0.6875rem] uppercase tracking-[0.08em] text-accent">{agent.name}</p>
        <p className="mono mt-2 rounded-[6px] border border-ink/15 bg-ground p-3 text-[0.8125rem] leading-relaxed">“{firstSentence(agent.prompt)}”</p>
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

/** The instruction's opening clause, so the card shows the idea without the whole prompt. */
function firstSentence(text: string) {
  const cut = [text.indexOf(": "), text.indexOf(". ")].filter((n) => n > 0);
  return cut.length ? `${text.slice(0, Math.min(...cut))} …` : text;
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
