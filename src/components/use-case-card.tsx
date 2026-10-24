import Link from "next/link";
import { categoryLabel, type UseCase } from "@/data/library";

export function ExternalIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 3.5h6.5V10M12.5 3.5 4 12" />
    </svg>
  );
}

/** Keep "2–3" and "$20–$40" together on one line. */
function keepRanges(s: string) {
  return s.replace(/(\d)–(\$?\d)/g, "$1\u2060–\u2060$2");
}

function offerHref(u: UseCase) {
  return `/setup?from=${encodeURIComponent(u.id)}`;
}

/**
 * A use case from the weekly radar, in our words. Always credits the author,
 * links the original post, and says what it would take to get the same thing.
 */
export function UseCaseCard({ u, figure, size = "grid", headingLevel = 3 }: { u: UseCase; figure?: { value: string; label: string }; size?: "grid" | "rail"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const miss = u.outcome === "honest-miss";
  return (
    <article
      className={`flex h-full flex-col rounded-[var(--radius-object)] border border-rule bg-surface ${
        size === "rail" ? "p-7 sm:p-8" : "p-6 sm:p-7"
      }`}
    >
      <p className="text-meta font-[560] text-ink-2">
        {miss ? <span className="text-ink">Didn’t go as planned</span> : categoryLabel(u.category)}
        {u.tool && <span> · {u.tool}</span>}
      </p>

      {figure ? (
        <H className="mt-6">
          <span className="block text-h2 leading-none text-stretch-display">{figure.value}</span>
          <span className="mt-3 block text-title">{keepRanges(figure.label)}</span>
        </H>
      ) : (
        <H className="mt-4 text-title">{keepRanges(u.title)}</H>
      )}

      <p className="mt-3 text-small text-ink-2">{keepRanges(u.summary)}</p>

      <div className="mt-auto pt-6">
        <div className="flex flex-col items-start gap-2 border-t border-rule pt-4 text-small">
          <a
            href={u.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 rounded text-ink hover:underline hover:underline-offset-4"
            data-outbound={u.id}
          >
            {u.handle}
            <ExternalIcon />
            <span className="sr-only">Read the original post on X (opens in a new tab)</span>
          </a>
          <Link href={offerHref(u)} className="tlink-quiet chev" data-to-offer={u.id}>
            We can set this up
          </Link>
        </div>
      </div>
    </article>
  );
}
