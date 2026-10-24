import { flags } from "@/data/config";
import type { LegalDoc } from "@/data/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="wrap grid gap-12 py-16 md:grid-cols-[0.75fr_1.25fr] md:py-24">
      <header>
        <h1 className="text-h2 text-stretch-display md:sticky md:top-24">{doc.title}</h1>
      </header>
      <div className="max-w-[42rem]">
        {!flags.legalReviewed && (
          <p role="note" className="mb-8 rounded-[var(--radius-control)] border border-[#e6d3c4] bg-accent-wash px-4 py-3 text-small">
            Draft, under review.
          </p>
        )}
        <p className="text-lead text-ink-2">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10 border-t border-rule pt-6">
            <h2 className="text-title">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-body text-ink-2">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="mt-12 text-meta text-ink-2">Last updated {doc.updated}.</p>
      </div>
    </article>
  );
}
