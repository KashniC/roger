import { siteConfig } from "@/data/config";
import { caseStudies } from "@/data/caseStudies";
import { menuTitle } from "@/data/menu";
import type { OfferId } from "@/lib/offer";

/**
 * Every kind of proof Roger will collect, each in its own slot. A slot with
 * no data renders nothing, so the page grows more convincing as Peter fills
 * data/caseStudies.ts and siteConfig.proof, without blank headings.
 */
export function Proof({ offer }: { offer: OfferId }) {
  const studies = caseStudies.filter((c) => c.for === offer && c.permission === true && c.metrics.length > 0);
  const p = siteConfig.proof;
  const showCounter = p.counter.setups >= 3;
  const any =
    studies.length || showCounter || p.endorsements.length || p.videos.length || p.screenshots.length || p.stats.length || p.sampleReport || p.reviewsUrl;
  if (!any) return null;

  return (
    <section aria-labelledby="proof-title" className="border-t border-rule bg-ground">
      <div className="wrap py-24 md:py-28">
        <h2 id="proof-title" className="text-h2">
          {offer === "work" ? "Set up for real Toronto businesses." : "Set up for real Toronto homes."}
        </h2>
        {showCounter && (
          <p className="mt-4 text-lead text-ink-2">
            {p.counter.setups} setups · {p.counter.workshops} workshops · {p.counter.refunds} refunds
          </p>
        )}

        {studies.length > 0 && (
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {studies.map((c) => (
              <article key={c.id} className="rounded-[var(--radius-object)] border border-rule bg-surface p-7 sm:p-9">
                <div className="flex items-center gap-4">
                  {(c.photo || c.logo) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo || c.logo} alt="" width={56} height={56} loading="lazy" className="size-14 rounded-full object-cover" />
                  )}
                  <div>
                    <h3 className="text-title">{c.name}</h3>
                    <p className="text-small text-ink-2">
                      {c.role}, {c.business} · {c.businessType}
                    </p>
                  </div>
                </div>
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="text-meta font-[600] text-ink-2">{m.label}</dt>
                      <dd className="mt-2 flex items-baseline gap-3">
                        <span className="text-title text-ink-2">{m.before}</span>
                        <span aria-hidden="true" className="text-ink-2">→</span>
                        <span className="sr-only">to</span>
                        <span className="text-h3 leading-none">{m.after}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-small text-ink-2">Set up: {c.setUp.map(menuTitle).join(", ")}</p>
                <blockquote className="mt-6 border-t border-rule pt-6 text-lead">“{c.quote}”</blockquote>
              </article>
            ))}
          </div>
        )}

        {p.endorsements.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {p.endorsements.map((e) => (
              <figure key={e.person} className="border-t border-ink pt-6">
                <blockquote className="text-lead">“{e.quote}”</blockquote>
                <figcaption className="mt-4 text-small text-ink-2">
                  {e.person}, {e.title}, {e.org}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {p.videos.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {p.videos.map((v) => (
              <figure key={v.src}>
                <video controls preload="none" poster={v.poster} className="aspect-video w-full rounded-[var(--radius-inner)] bg-ink">
                  <source src={v.src} type="video/mp4" />
                  {v.captionsVtt && <track kind="captions" src={v.captionsVtt} srcLang="en" label="English" default />}
                </video>
                <figcaption className="mt-3 text-small text-ink-2">{v.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}

        {(p.screenshots.length > 0 || p.stats.length > 0) && (
          <div className="mt-14">
            <h3 className="text-title">We run our own business this way</h3>
            {p.stats.length > 0 && (
              <p className="mt-3 text-small text-ink-2">{p.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}</p>
            )}
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {p.screenshots.map((s) => (
                <figure key={s.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.caption} width={s.width} height={s.height} loading="lazy" className="w-full rounded-[var(--radius-inner)] border border-rule" />
                  <figcaption className="mt-3 text-small text-ink-2">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {(p.sampleReport || p.reviewsUrl) && (
          <p className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {p.sampleReport && (
              <a className="tlink chev" href={p.sampleReport}>
                See exactly what you get: a sample setup report
              </a>
            )}
            {p.reviewsUrl && (
              <a className="tlink" href={p.reviewsUrl} target="_blank" rel="noopener noreferrer">
                Read independent reviews ↗
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
