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
          <p role="note" className="mb-8 rounded-[8px] bg-accent-wash px-4 py-3 text-small">
            Draft, under review.
          </p>
        )}
        <p className="text-lead">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="text-title">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-body">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="mt-12 text-small text-ink-2">Last updated {doc.updated}.</p>
      </div>
    </article>
  );
}
