import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { Measured, NinetyDays, PartnerPricing, PeterSection } from "@/components/company";
import { companyWontDo, goAhead, mapSession } from "@/data/company";
import { siteConfig } from "@/data/config";
import { getSettings } from "@/lib/settings";
import { prospectBySlug, prospects } from "@/data/prospects";
import gaugeCutout from "@/assets/img/gauge-cutout.webp";
import mapTable from "@/assets/img/map-table.webp";

export function generateStaticParams() {
  return prospects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/for/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = prospectBySlug(slug);
  return {
    title: { absolute: p ? `Prepared for ${p.company} · Roger` : "Roger" },
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

function mailto(subject: string) {
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`;
}

export default async function ProspectPage({ params }: PageProps<"/for/[slug]">) {
  const { slug } = await params;
  const p = prospectBySlug(slug);
  if (!p) notFound();
  const settings = await getSettings();

  return (
    <>
      {/* 1 · Who this is for, and what it is: the instrument on a copper block */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-ground">
        <div className="wrap relative grid grid-cols-[minmax(0,1fr)] pb-0 pt-10 md:min-h-[min(760px,calc(100svh-120px))] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:pb-16">
          <div className="relative z-10">
            <h1 id="hero-title" className="max-w-[12ch] text-display text-stretch-display">
              {p.hero.headline}
            </h1>
            <p className="mt-6 max-w-[32rem] text-lead lg:max-w-[30rem]">{p.hero.sub}</p>
            <div id="hero-cta" className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a className="btn btn-l" href={mailto(p.meeting.subject)}>
                Email Peter
              </a>
              <a className="tlink chev" href="#look">
                Where we’d look first
              </a>
            </div>
            <p className="mt-6 text-small">
              {p.hero.kicker}, for {p.meeting.label}
            </p>
          </div>
          {/* Cut-out on a colour block (finish.md §2, move 5): the gauge breaks out above the copper */}
          <div className="relative mt-14 h-[340px] sm:h-[420px] md:mt-0 md:h-[560px]">
            <div className="absolute bottom-0 left-[-4%] right-[-40%] h-[64%] rounded-[8px] bg-accent md:left-[4%] md:right-[-30vw]" aria-hidden="true" />
            <Image
              src={gaugeCutout}
              alt="A generic industrial pressure gauge with a steel bezel and brass stem"
              sizes="(min-width: 768px) 420px, 70vw"
              preload
              className="absolute bottom-[6%] left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain md:left-[54%]"
            />
          </div>
        </div>
      </section>

      {/* 2 · What we heard */}
      <section aria-labelledby="heard-title" className="bg-night text-night-ink on-night">
        <div className="wrap grid gap-14 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div>
            <h2 id="heard-title" className="text-h2">
              {p.heard.heading}
            </h2>
            <p className="mt-3 text-small text-night-ink">From our first conversation.</p>
            <ul className="mt-8 space-y-1">
              {p.heard.told.map((t) => (
                <li key={t} className="rounded-[8px] bg-night-2 px-5 py-4 text-title">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h2">{p.heard.publicHeading}</h2>
            <p className="mt-3 text-small text-night-ink">From winters.com, October 2026.</p>
            <ul className="mt-8 space-y-1">
              {p.heard.public.map((t) => (
                <li key={t} className="rounded-[8px] bg-night-2 px-5 py-4 text-title">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 · Where we'd look first */}
      <section id="look" aria-labelledby="look-title" className="scroll-mt-14 bg-ground">
        <div className="wrap py-24 md:py-32">
          <div className="max-w-[46rem]">
            <h2 id="look-title" className="text-h2">
              {p.hypotheses.heading}
            </h2>
            <p className="mt-4 text-lead">{p.hypotheses.sub}</p>
          </div>
          <ol className="mt-12 space-y-1 md:-mx-6" data-reveal>
            {p.hypotheses.items.map((h, i) => (
              <li key={h.title} className={`grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-4 rounded-[8px] px-5 py-7 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] ${i % 2 ? "bg-[#ececef]" : "bg-ground-2"}`}>
                <div>
                  <h3 className="text-h3">{h.title}</h3>
                  <p className="mt-2 max-w-[36rem] text-small">{h.body}</p>
                </div>
                <p className="text-small">
                  <span className="block font-[600]">To ask on Wednesday</span>
                  <span className="mt-1 block">{h.ask}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · The two hours */}
      <section aria-labelledby="session-title" className="bg-ground-2">
        <div className="wrap grid gap-12 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-32">
          <div>
            <h2 id="session-title" className="text-h2">
              {p.session.heading}
            </h2>
            <div className="grain relative mt-8 h-64 overflow-hidden rounded-[8px] md:h-80">
              <Image src={mapTable} alt={mapSession.imageAlt} fill sizes="(min-width: 768px) 520px, 100vw" placeholder="blur" className="photo-grade object-cover" />
            </div>
            <p className="mt-6 text-small">{p.session.room}</p>
          </div>
          <ol className="space-y-1 self-end" data-reveal>
            {mapSession.agenda.map((a, i) => (
              <li key={a.at} className={`grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 rounded-[8px] px-5 py-5 ${i % 2 ? "bg-[#e9e9ec]" : "bg-ground"}`}>
                <p className="text-small font-[600] text-ink-2">{a.at}</p>
                <div>
                  <h3 className="text-title">{a.title}</h3>
                  <p className="mt-2 text-small">{a.body}</p>
                </div>
              </li>
            ))}
            <li className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 rounded-[8px] bg-ink px-5 py-5 text-ground">
              <p className="text-small font-[600] text-ground/70">After</p>
              <p className="text-title">{mapSession.deliverable}</p>
            </li>
          </ol>
        </div>
      </section>

      {/* 5 · The first 90 days, and how it's measured */}
      <NinetyDays />
      <Measured />

      {/* 6 · Who they'd work with, and what it costs */}
      <PeterSection wontDo={companyWontDo} />
      <PartnerPricing
        smaller={false}
        note={settings.companyTermsConfirmed ? undefined : goAhead.pending}
        cta={
          <>
            <ActionLink kind="companyCall" location="prospect-pricing">
              Book the Map session
            </ActionLink>
            <a className="tlink chev" href={mailto(p.meeting.subject)}>
              Email Peter
            </a>
          </>
        }
        aside={
          <>
            <h3 className="text-title">{goAhead.heading}</h3>
            <ol className="mt-5 space-y-1">
              {goAhead.steps.map((st) => (
                <li key={st.title} className="rounded-[8px] bg-night-2 px-5 py-4">
                  <p className="text-small font-[600]">{st.title}</p>
                  <p className="mt-1 text-small text-night-ink">{st.body}</p>
                </li>
              ))}
            </ol>
          </>
        }
      />

      {/* 7 · Before Wednesday */}
      <section id="final-cta" aria-labelledby="prep-title" className="bg-ground">
        <div className="wrap grid gap-12 py-24 md:grid-cols-2 md:gap-16 md:py-32">
          <div>
            <h2 id="prep-title" className="text-h2">
              {p.prep.heading}
            </h2>
            <p className="mt-4 text-lead">{p.prep.sub}</p>
            <ol className="mt-8 space-y-1">
              {p.prep.items.map((item, i) => (
                <li key={item} className={`rounded-[8px] px-5 py-4 text-body ${i % 2 ? "bg-[#ececef]" : "bg-ground-2"}`}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div className="self-end rounded-[8px] bg-night p-8 text-night-ink on-night sm:p-10">
            <h2 className="text-h3">{p.close.heading}</h2>
            <p className="mt-3 text-body text-night-ink">{p.close.sub}</p>
            <a className="btn btn-l mt-8" href={mailto(p.meeting.subject)}>
              Email Peter
            </a>
            <p className="mt-4 text-small text-night-ink-2">{siteConfig.contactEmail}</p>
          </div>
        </div>
      </section>
    </>
  );
}
