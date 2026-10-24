import Link from "next/link";
import { siteConfig } from "@/data/config";
import { about, diy, faqs, guarantee, pricing, providerLine, working, wontDo } from "@/data/offers";
import { offerNow, type OfferId } from "@/lib/offer";
import { ActionLink } from "./action-link";
import { PaybackCalculator } from "./payback-calculator";
import { Toque } from "./toque";

export function SectionHead({ id, title, sub, className = "", night = false }: { id?: string; title: string; sub?: string; className?: string; night?: boolean }) {
  return (
    <div className={`max-w-[46rem] ${className}`}>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      {sub && <p className={`mt-4 text-lead ${night ? "text-night-ink-2" : "text-ink-2"}`}>{sub}</p>}
    </div>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------

export function Timeline({ steps, footnote }: { steps: { when: string; title: string; body: string; emphasis?: string }[]; footnote?: string }) {
  return (
    <>
      <ol className="relative mt-12 grid gap-0 md:grid-cols-5 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.when} className="relative border-l border-rule pb-9 pl-7 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pt-8">
            <span
              aria-hidden="true"
              className={`absolute -left-[5px] top-1 size-[9px] rounded-full md:-top-[5px] md:left-0 ${i === 0 ? "bg-ink" : "border border-rule-strong bg-ground"}`}
            />
            <p className="text-meta font-[600] text-ink-2">{s.when}</p>
            <h3 className="mt-2 text-title">{s.title}</h3>
            <p className="mt-2 text-small text-ink-2">
              {s.body} {s.emphasis && <strong className="font-[600] text-ink">{s.emphasis}</strong>}
            </p>
          </li>
        ))}
      </ol>
      {footnote && <p className="mt-8 text-meta text-ink-2">{footnote}</p>}
    </>
  );
}

// ---------------------------------------------------------------------------

export function PricingChapter({ offer }: { offer: OfferId }) {
  const now = offerNow(offer);
  const p = pricing[offer];
  const g = guarantee[offer];
  const other = offer === "home" ? offerNow("work") : offerNow("home");
  return (
    <section aria-labelledby="pricing-title" id="pricing" className="on-night scroll-mt-14 bg-night text-night-ink">
      <div className="wrap py-24 md:py-40">
        <SectionHead id="pricing-title" title={p.heading} sub={p.sub} night />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* The one card */}
          <div className="rounded-[var(--radius-object)] border border-night-rule bg-night-2 p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="text-small font-[600] text-night-ink-2">{p.name}</h3>
              {now.isFounding && (
                <p className="rounded-full border border-night-rule px-3 py-1 text-meta font-[560] text-night-ink/70">
                  {siteConfig.founding.spotsLeft} of {siteConfig.founding.total} founding spots left
                </p>
              )}
            </div>
            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-display leading-none text-stretch-display">{now.priceLabel}</span>
              <span className="text-small text-night-ink-2">CAD, one-time</span>
            </p>
            <p className="mt-3 text-small text-night-ink-2">
              About {now.monthlyLabel} a month over your first year.
              {now.isFounding && <> Founding price: becomes {now.regularLabel} after the first {siteConfig.founding.total} clients.</>}
            </p>

            <ul className="mt-8 grid gap-3 border-t border-night-rule pt-7 sm:grid-cols-2 sm:gap-x-8">
              {p.includes.map((i) => (
                <li key={i.text} className="flex gap-3 text-small">
                  <Check className="mt-[0.2em] text-night-ink-2" />
                  <span className={i.strong ? "font-[600] text-night-ink" : "text-night-ink"}>{i.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-small text-night-ink-2">{p.speed}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              {offer === "home" ? (
                <>
                  <ActionLink kind="homeCheckout" location="pricing">
                    Pay {now.priceLabel} &amp; book
                  </ActionLink>
                  <ActionLink kind="fitCall" location="pricing" variant="text" picksFor="home">
                    Questions first? Book a free call
                  </ActionLink>
                </>
              ) : (
                <>
                  <ActionLink kind="fitCall" location="pricing">
                    Book a free fit call
                  </ActionLink>
                  <ActionLink kind="workCheckout" location="pricing" variant="text">
                    Skip the call: pay {now.priceLabel} &amp; book
                  </ActionLink>
                </>
              )}
            </div>
            <p className="mt-5 text-meta text-night-ink-2">{siteConfig.capacityLine}.</p>
          </div>

          {/* The guarantee */}
          <div className="flex flex-col rounded-[var(--radius-object)] bg-accent-wash p-7 text-ink sm:p-10">
            <Toque className="size-9 text-accent" strokeWidth={1.5} />
            <h3 className="mt-6 text-h3">{g.heading}</h3>
            <p className="mt-4 text-body">{g.body}</p>
            <dl className="mt-6 space-y-4 border-t border-[#e6d3c4] pt-6 text-small">
              <div>
                <dt className="font-[600]">What “working” means</dt>
                <dd className="mt-1 text-ink-2">{working}</dd>
              </div>
              <div>
                <dt className="font-[600]">How to claim</dt>
                <dd className="mt-1 text-ink-2">{g.claim}</dd>
              </div>
            </dl>
            <p className="mt-auto pt-6 text-small text-ink-2">{g.accounts}</p>
            <Link href="/refunds" className="tlink chev mt-4 self-start text-small text-accent">
              Read the full refund policy
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 text-small text-night-ink-2 md:max-w-[52rem]">
          <p>{providerLine}</p>
          <p>Ongoing care plans available after setup. {siteConfig.taxNote}</p>
          <p>
            {offer === "home" ? "Setting up your business instead? " : "Setting up your home instead? "}
            <Link href={offer === "home" ? "/business" : "/families"} className="tlink chev">
              {offer === "home" ? `Work setup, ${other.priceLabel}` : `Home setup, ${other.priceLabel}`}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function ValueSection({ offer }: { offer: OfferId }) {
  const now = offerNow(offer);
  const rows = diy[offer];
  const { adminHourly, source } = siteConfig.anchor;
  return (
    <section aria-labelledby="value-title" className="bg-ground">
      <div className="wrap grid gap-16 py-24 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div className="min-w-0">
          <h2 id="value-title" className="text-h2">
            Do it yourself, or have it done.
          </h2>
          <p className="mt-4 max-w-[38rem] text-lead text-ink-2">The honest comparison. Plenty of people set these up on their own; this is what you’re paying to skip.</p>
          {/* Phones: each comparison as its own short block */}
          <dl className="mt-10 divide-y divide-rule border-y border-rule sm:hidden">
            {rows.map((r) => (
              <div key={r.label} className="py-4">
                <dt className="text-small text-ink-2">{r.label}</dt>
                <dd className="mt-2 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 text-small">
                  <span className="text-ink-2">Yourself</span>
                  <span>{r.diy}</span>
                  <span className="text-ink-2">With Roger</span>
                  <span className="font-[600]">{r.roger}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 hidden sm:block">
            <table className="w-full border-collapse text-left text-small">
              <caption className="sr-only">Do it yourself compared with Roger</caption>
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="w-[34%] py-3 pr-4 font-[500] text-ink-2">
                    <span className="sr-only">Compare</span>
                  </th>
                  <th scope="col" className="py-3 pr-4 font-[600]">
                    Do it yourself
                  </th>
                  <th scope="col" className="py-3 font-[600]">
                    With Roger
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-rule align-top">
                    <th scope="row" className="py-4 pr-4 font-[500] text-ink-2">
                      {r.label}
                    </th>
                    <td className="py-4 pr-4">{r.diy}</td>
                    <td className="py-4 font-[560]">{r.roger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {adminHourly > 0 && (
            <p className="mt-6 text-small text-ink-2">
              A part-time admin at ${adminHourly}/hour for 10 hours a week costs about ${(adminHourly * 10 * 52).toLocaleString("en-CA")} a year. This is {now.priceLabel} once.
              {source && <span className="block text-meta">Source: {source}</span>}
            </p>
          )}
        </div>
        <PaybackCalculator price={now.price} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function AboutSection({ offer, wontDoItems, className = "" }: { offer: OfferId; wontDoItems?: string[]; className?: string }) {
  const { founder } = siteConfig;
  const links = founder.links.filter((l) => l.href && l.label);
  return (
    <section aria-labelledby="about-title" className={`border-t border-rule bg-ground-2 ${className}`}>
      <div className="wrap grid gap-14 pb-16 pt-24 md:grid-cols-2 md:gap-20 md:pb-20 md:pt-32">
        <div className="flex gap-7">
          {founder.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={founder.photo} alt={founder.name} width={240} height={240} loading="lazy" className="size-28 shrink-0 rounded-full object-cover md:size-36" />
          )}
          <div>
            <h2 id="about-title" className="text-h2">
              {about.heading}
            </h2>
            <p className="mt-5 max-w-[34rem] text-lead text-ink-2">{about.body}</p>
            {links.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small">
                {links.map((l) => (
                  <li key={l.href}>
                    <a className="tlink" href={l.href} target="_blank" rel={`noopener noreferrer${/x\.com|twitter/.test(l.href) ? " nofollow" : ""}`}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-title">What we won’t do</h3>
          <ul className="mt-5 divide-y divide-rule border-y border-rule">
            {(wontDoItems ?? wontDo[offer]).map((w) => (
              <li key={w} className="py-4 text-body">
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export function FaqSection({ offer, items }: { offer: OfferId; items?: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-title" id="faq" className="scroll-mt-14 bg-ground-2">
      <div className="wrap">
      <div className="grid gap-10 border-t border-rule pb-24 pt-16 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pb-32 md:pt-20">
        <div>
          <h2 id="faq-title" className="text-h2 md:sticky md:top-24">
            Questions
          </h2>
        </div>
        <div className="divide-y divide-rule border-y border-rule">
          {(items ?? faqs[offer]).map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-title [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-ink-2 transition-transform duration-200 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 3v14M3 10h14" />
                </svg>
              </summary>
              <p className="max-w-[40rem] pb-6 text-body text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
