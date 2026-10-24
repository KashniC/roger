import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ActionLink } from "./action-link";
import {
  breakEven,
  companyFinal,
  companyHero,
  hoursBack,
  mapSession,
  measured,
  ninetyDays,
  partner,
  peter,
  reportTotal,
  trust,
  weekRows,
  weekTotal,
} from "@/data/company";
import { siteConfig } from "@/data/config";
import { getSettings } from "@/lib/settings";
import exterior from "@/assets/img/exterior.webp";
import gaugeCutout from "@/assets/img/gauge-cutout.webp";
import gaugeHero from "@/assets/img/gauge-hero.webp";
import mapTable from "@/assets/img/map-table.webp";
import needle from "@/assets/img/needle-macro.webp";

/** A week in month 3 of the example report, lit from inside. */
export function WeekCard({ className = "" }: { className?: string }) {
  const w = companyHero.week;
  const top = weekRows.slice(0, 4);
  const rest = weekRows.slice(4);
  const restHours = rest.reduce((t, r) => t + r.hours, 0);
  return (
    <aside data-ui aria-label={`${w.tag}: ${weekTotal} ${w.label.toLowerCase()}`} className={`rounded-[8px] bg-[#1d1a18] p-7 text-white sm:p-8 ${className}`}>
      <p className="flex justify-between gap-4 text-meta text-white/70">
        <span>{w.label}</span>
        <span>{w.tag}</span>
      </p>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-[5.5rem] font-[600] leading-none tracking-[-0.055em]">{weekTotal}</span>
        <span className="text-title text-white/75">hours</span>
      </p>
      <ul className="mt-5 space-y-1 text-small">
        {top.map((r) => (
          <li key={r.task} className="flex justify-between gap-6 rounded-[6px] bg-white/[0.05] px-3 py-2.5">
            <span>{r.task}</span>
            <span className="text-white/70">{r.hours} h</span>
          </li>
        ))}
        {rest.length > 0 && (
          <li className="flex justify-between gap-6 px-3 py-2.5 text-white/70">
            <span>{rest.length} more automations</span>
            <span>{restHours} h</span>
          </li>
        )}
      </ul>
    </aside>
  );
}

export function CompanyHero() {
  return (
    <section aria-labelledby="hero-title" className="on-night relative isolate bg-[#0f0d0c] text-night-ink">
      <div className="grain absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden sm:h-[520px] md:inset-0 md:h-auto">
        <Image
          src={gaugeHero}
          alt={companyHero.imageAlt}
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          className="photo-grade photo-drift object-cover object-[80%_45%] md:object-[90%_50%] xl:object-[72%_50%]"
        />
        {/* the photo's dark side is the headline's ground; the scrim only deepens it */}
        <div /* taste-skill-ignore: neutral scrim over a photo */ className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,13,12,0)_0%,rgba(15,13,12,0.25)_40%,rgba(15,13,12,0.92)_78%,#0f0d0c_100%)] md:bg-[linear-gradient(90deg,rgba(12,10,9,0.93)_0%,rgba(12,10,9,0.82)_58%,rgba(12,10,9,0.25)_88%),linear-gradient(0deg,rgba(12,10,9,0.6),transparent_32%)] xl:bg-[linear-gradient(90deg,rgba(12,10,9,0.9)_0%,rgba(12,10,9,0.72)_40%,rgba(12,10,9,0.08)_70%),linear-gradient(0deg,rgba(12,10,9,0.55),transparent_32%)]" />
      </div>

      <div className="wrap relative flex flex-col pt-[270px] sm:pt-[360px] md:min-h-[min(880px,calc(100svh-52px))] md:justify-center md:pt-16 xl:pb-24">
        <h1 id="hero-title" className="text-display text-stretch-display md:max-w-[14ch]">
          {companyHero.headline}
        </h1>
        <p className="order-3 mt-6 max-w-[31rem] text-lead text-night-ink md:order-none">{companyHero.sub}</p>
        <div id="hero-cta" className="order-2 mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 md:order-none md:mt-9">
          <ActionLink kind="companyCall" location="hero">
            Book an intro call
          </ActionLink>
          <a href="#map" className="tlink chev">
            {companyHero.secondary}
          </a>
        </div>
        <p className="order-4 mt-6 text-small text-night-ink-2 md:order-none">{companyHero.fine}</p>

        {/* Float: after the copy until 1280px, then on the photo; either way it crosses into the next section */}
        <WeekCard className="relative z-10 order-5 -mb-[7.5rem] mt-12 w-full max-w-[32.5rem] md:order-none xl:absolute xl:bottom-[-7rem] xl:right-6 xl:mb-0 xl:mt-0 xl:w-[25rem]" />
      </div>
    </section>
  );
}

export function MapSession() {
  const l = mapSession.lines;
  return (
    <section id="map" aria-labelledby="map-title" className="scroll-mt-14 bg-ground pb-24 pt-[11.5rem] md:pb-32 xl:pt-40">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-14">
        <h2 id="map-title" className="text-[clamp(2rem,4.4vw,4rem)] font-[700] leading-[0.95] tracking-[-0.05em] text-stretch-display">
          {l.map((line) => (
            <span key={line} className="block md:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h2>
        <article className="w-full max-w-[26rem] overflow-hidden rounded-[8px] bg-ground-2 lg:mb-2">
          <div className="grain relative h-44 sm:h-52">
            <Image src={mapTable} alt={mapSession.imageAlt} fill sizes="(min-width: 768px) 420px, 88vw" placeholder="blur" className="photo-grade object-cover" />
          </div>
          <div className="p-6 sm:p-7">
            <h3 className="text-title">{mapSession.card.title}</h3>
            <p className="mt-2 text-small">{mapSession.card.body}</p>
            <ActionLink kind="companyCall" location="map-card" size="m" className="mt-5">
              Book an intro call
            </ActionLink>
          </div>
        </article>
      </div>

      <div className="wrap mt-16 md:mt-20">
        <ol className="space-y-1 md:-mx-6" data-reveal>
          {mapSession.agenda.map((a, i) => (
            <li key={a.at} className={`grid gap-x-8 gap-y-1 rounded-[8px] px-5 py-6 sm:px-6 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.4fr)] ${i % 2 ? "bg-[#ececef]" : "bg-ground-2"}`}>
              <p className="text-lead font-[560] text-ink-2">{a.at}</p>
              <h3 className="text-title">{a.title}</h3>
              <p className="text-small">{a.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-10">
          <p className="text-title">{mapSession.deliverable}</p>
          <p className="text-small">{mapSession.room}</p>
        </div>
      </div>
    </section>
  );
}

export function NinetyDays() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-14 bg-ground-2">
      {/* The band carries the heading: the needle photo is the section's ground */}
      <div className="grain relative h-[300px] overflow-hidden bg-night sm:h-[420px]">
        <Image src={needle} alt="" fill sizes="100vw" placeholder="blur" className="photo-grade object-cover object-[70%_50%]" />
        <div /* taste-skill-ignore: neutral scrim over a photo */ className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.88)_0%,rgba(10,9,8,0.5)_50%,transparent_75%)]" />
        <div className="wrap relative flex h-full items-end pb-10 sm:pb-14">
          <h2 id="how-title" className="max-w-[11ch] text-poster text-stretch-display text-white">
            {ninetyDays.heading}
          </h2>
        </div>
      </div>
      <div className="wrap pb-20 pt-12 md:pb-28 md:pt-16">
        <p className="max-w-[40rem] text-lead">{ninetyDays.sub}</p>
        <ol className="mt-12 space-y-1 md:-mx-6" data-reveal>
          {ninetyDays.steps.map((s, i) => (
            <li key={s.when} className={`grid gap-x-8 gap-y-1 rounded-[8px] px-5 py-6 sm:px-6 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.4fr)] ${i === 0 ? "bg-ink text-ground" : i % 2 ? "bg-[#e9e9ec]" : "bg-ground"}`}>
              <p className={`text-lead font-[560] ${i === 0 ? "text-ground/70" : "text-ink-2"}`}>{s.when}</p>
              <h3 className="text-title">{s.title}</h3>
              <p className="text-small">
                {s.body} {s.emphasis && <strong className="font-[600]">{s.emphasis}</strong>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The page the owners get every month, set in the site's own type. */
export function Measured() {
  const rows = measured.rows;
  const before = rows.reduce((t, r) => t + r.before, 0);
  const after = rows.reduce((t, r) => t + r.after, 0);
  return (
    <section aria-labelledby="measured-title" className="bg-ground">
      <div className="wrap py-24 md:py-32">
        <div className="max-w-[46rem]">
          <h2 id="measured-title" className="text-h2">
            {measured.heading}
          </h2>
          <p className="mt-4 text-lead">{measured.sub}</p>
        </div>

        <div className="mt-12">
          <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-4">
            <span className="text-title">{measured.title}</span>
            <span className="text-small text-ink-2">Hours a month</span>
          </p>

          {/* Phones: one block per automation */}
          <dl className="space-y-1 md:hidden">
            {rows.map((r, i) => (
              <div key={r.task} className={`rounded-[8px] p-5 ${i % 2 ? "bg-[#ececef]" : "bg-ground-2"}`}>
                <dt className="flex justify-between gap-4 text-title">
                  <span>{r.task}</span>
                  <span className="whitespace-nowrap">{hoursBack(r)} h</span>
                </dt>
                <dd className="mt-2 text-small text-ink-2">
                  {r.runs.toLocaleString("en-CA")} runs · {r.before} h before, {r.after} h after
                </dd>
                <dd className="mt-1 text-small text-ink-2">{r.wrong}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 p-5 text-title">
              <span>Hours back</span>
              <span>{reportTotal} h</span>
            </div>
          </dl>

          <table className="hidden w-full border-collapse text-left text-small md:table">
            <caption className="sr-only">{measured.title}</caption>
            <thead>
              <tr className="border-b border-rule text-ink-2">
                <th scope="col" className="py-3 pr-6 font-[500]">Automation</th>
                <th scope="col" className="w-20 py-3 pr-6 text-right font-[500]">Runs</th>
                <th scope="col" className="w-20 py-3 pr-6 text-right font-[500]">Before</th>
                <th scope="col" className="w-20 py-3 pr-6 text-right font-[500]">After</th>
                <th scope="col" className="w-24 py-3 pr-8 text-right font-[600] text-ink">Hours back</th>
                <th scope="col" className="py-3 font-[500]">What went wrong</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.task} className="border-b border-rule align-top">
                  <th scope="row" className="py-4 pr-6 text-body font-[560]">{r.task}</th>
                  <td className="py-4 pr-6 text-right text-ink-2">{r.runs.toLocaleString("en-CA")}</td>
                  <td className="py-4 pr-6 text-right text-ink-2">{r.before} h</td>
                  <td className="py-4 pr-6 text-right text-ink-2">{r.after} h</td>
                  <td className="py-4 pr-8 text-right text-body font-[600]">{hoursBack(r)} h</td>
                  <td className="py-4 text-ink-2">{r.wrong}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-ink">
                <th scope="row" className="py-4 pr-6 text-title">Total</th>
                <td className="py-4 pr-6" />
                <td className="py-4 pr-6 text-right text-ink-2">{before} h</td>
                <td className="py-4 pr-6 text-right text-ink-2">{after} h</td>
                <td className="py-4 pr-8 text-right text-title">{reportTotal} h</td>
                <td className="py-4 text-ink-2">{measured.next}</td>
              </tr>
            </tfoot>
          </table>
          <p className="mt-4 text-small text-ink-2">Example. Before is each task’s hours a month on the example Map; your report uses your own timings.</p>
        </div>
      </div>
    </section>
  );
}

export function TrustBand() {
  return (
    <section aria-labelledby="trust-title" className="bg-ground">
      <div className="grain relative h-[420px] overflow-hidden bg-night sm:h-[560px]">
        <Image src={exterior} alt={trust.imageAlt} fill sizes="100vw" placeholder="blur" className="photo-grade object-cover object-[40%_60%]" />
        <div /* taste-skill-ignore: neutral scrim over a photo */ className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,8,7,0.88)_0%,rgba(10,8,7,0.5)_38%,transparent_64%)]" />
        <div className="wrap relative flex h-full items-end pb-10 sm:pb-14">
          <h2 id="trust-title" className="max-w-[16ch] text-h2 text-white">
            {trust.heading}
          </h2>
        </div>
      </div>
      <div className="wrap grid gap-x-10 gap-y-10 py-20 sm:grid-cols-2 md:py-28 lg:grid-cols-5" data-reveal>
        {trust.points.map((p) => (
          <div key={p.title}>
            <h3 className="text-title">{p.title}</h3>
            <p className="mt-2 text-small">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Peter, plainly: who answers the phone. Photo, full name, phone and bio appear when Peter supplies them. */
export async function PeterSection({ wontDo }: { wontDo: string[] }) {
  const s = await getSettings();
  const f = { ...siteConfig.founder, fullName: s.founderFullName, phone: s.founderPhone, photo: s.founderPhoto };
  const name = f.fullName || f.name;
  const bio = s.bioApproved ? s.founderBio : [];
  return (
    <section aria-labelledby="peter-title" className="bg-ground-2">
      <div className="wrap grid gap-14 py-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-20 md:py-32">
        <div className={f.photo ? "grid gap-8 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]" : ""}>
          {f.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.photo} alt={name} width={440} height={550} loading="lazy" className="photo-grade aspect-[4/5] w-full rounded-[8px] object-cover" />
          )}
          <div>
            <h2 id="peter-title" className="text-h2">
              {peter.heading}
            </h2>
            <p className="mt-6 text-title">
              {name}, {f.city}
            </p>
            <div className="mt-4 max-w-[34rem] space-y-3 text-lead">
              {[...peter.lines, ...bio].map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-body">
              {siteConfig.contactEmail && (
                <a className="tlink" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>
              )}
              {f.phone && (
                <a className="tlink" href={`tel:${f.phone.replace(/[^+\d]/g, "")}`}>
                  {f.phone}
                </a>
              )}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-title">{peter.wontDoHeading}</h3>
          <ul className="mt-5 space-y-1">
            {wontDo.map((w, i) => (
              <li key={w} className={`rounded-[8px] px-5 py-4 text-body ${i % 2 ? "bg-[#e9e9ec]" : "bg-ground"}`}>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[0.2em] size-4 shrink-0 text-accent-night" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export function PartnerPricing({ smaller = true, cta, aside, note }: { smaller?: boolean; cta?: ReactNode; aside?: ReactNode; note?: ReactNode }) {
  const includes = (
    <ul className="grid gap-3">
      {partner.includes.map((i) => (
        <li key={i.text} className="flex gap-3 text-small">
          <Check />
          <span className={i.strong ? "font-[600]" : ""}>{i.text}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="on-night scroll-mt-14 bg-night text-night-ink">
      <div className="wrap py-24 md:py-40">
        <div className="max-w-[34rem]">
          <h2 id="pricing-title" className="text-h2">
            One partnership, priced by the month.
          </h2>
          <p className="mt-4 text-lead text-night-ink">It starts with the Map, and you can stop after the first 90 days.</p>
        </div>

        <div className="mt-24 grid gap-5 md:mt-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8">
          <div className="relative rounded-[8px] bg-night-2 p-7 sm:p-10">
            {/* the instrument itself, standing on the card's corner */}
            <Image
              src={gaugeCutout}
              alt=""
              width={220}
              height={280}
              sizes="(min-width: 1024px) 200px, 120px"
              className="pointer-events-none absolute -right-2 -top-16 h-auto w-[110px] sm:-right-6 sm:-top-24 sm:w-[160px] lg:-right-12 lg:-top-[6.875rem] lg:w-[200px]"
            />
            <h3 className="flex flex-wrap items-baseline gap-3">
              <span className="text-display leading-none text-stretch-display">{partner.priceLabel}</span>
              <span className="text-lead text-night-ink">
                CAD {partner.per}, {partner.name}
              </span>
            </h3>
            <p className="mt-3 max-w-[30rem] text-small text-night-ink">{partner.termLine}. The Map session is included in month one.</p>
            <p className="mt-8 max-w-[32rem] text-body text-night-ink">{breakEven.line(partner.price, breakEven.hourly)}</p>
            {aside && <div className="mt-8">{includes}</div>}
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              {cta ?? (
                <>
                  <ActionLink kind="companyCall" location="pricing">
                    Book an intro call
                  </ActionLink>
                  {siteConfig.contactEmail && (
                    <a className="tlink chev" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Roger Partner")}`}>
                      Or email Peter
                    </a>
                  )}
                </>
              )}
            </div>
            <p className="mt-6 max-w-[40rem] text-small text-night-ink-2">{partner.subscriptions}</p>
            {note && <p className="mt-2 text-small text-night-ink-2">{note}</p>}
          </div>

          <div className="lg:pt-4">
            {aside ?? (
              <>
                <h3 className="text-title">Every month</h3>
                <div className="mt-5">{includes}</div>
              </>
            )}
          </div>
        </div>

        {smaller && (
          <p className="mt-12 text-small text-night-ink">
            Just you, not a whole company?{" "}
            <Link href="/setup" className="tlink">
              A custom setup is $500, once
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}

/** The last screen: the table where it starts, with the action on it. */
export function ClosingPhoto({ children }: { children: ReactNode }) {
  return (
    <section id="final-cta" aria-labelledby="final-title" className="on-night relative isolate overflow-hidden bg-night text-night-ink">
      <div className="grain absolute inset-0 -z-10">
        <Image src={mapTable} alt={companyFinal.imageAlt} fill sizes="100vw" placeholder="blur" className="photo-grade object-cover object-[60%_50%]" />
        <div /* taste-skill-ignore: neutral scrim over a photo */ className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,9,0.94)_0%,rgba(12,10,9,0.82)_45%,rgba(12,10,9,0.25)_80%)] max-md:bg-[linear-gradient(0deg,rgba(12,10,9,0.94)_0%,rgba(12,10,9,0.8)_60%,rgba(12,10,9,0.45)_100%)]" />
      </div>
      <div className="wrap py-28 md:py-40">{children}</div>
    </section>
  );
}
