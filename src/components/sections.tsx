import { faqs } from "@/data/offers";
import type { OfferId } from "@/lib/offer";

export function SectionHead({ id, title, sub, className = "", night = false }: { id?: string; title: string; sub?: string; className?: string; night?: boolean }) {
  return (
    <div className={`max-w-[46rem] ${className}`}>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      {sub && <p className={`mt-4 text-lead ${night ? "text-night-ink" : "text-ink"}`}>{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function FaqSection({ offer, items }: { offer: OfferId; items?: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-title" id="faq" className="scroll-mt-14 bg-ground-2">
      <div className="wrap grid gap-10 py-28 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-40" data-reveal>
        <div>
          <h2 id="faq-title" className="text-h2 md:sticky md:top-24">
            What people ask
          </h2>
        </div>
        <div className="space-y-1">
          {(items ?? faqs[offer]).map((f) => (
            <details key={f.q} className="group rounded-[8px] bg-ground px-5 transition-colors duration-[180ms] open:bg-surface sm:px-6">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-title [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-ink-2 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 3v14M3 10h14" />
                </svg>
              </summary>
              <p className="max-w-[40rem] pb-6 text-body">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
