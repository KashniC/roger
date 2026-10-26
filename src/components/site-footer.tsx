import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/data/config";
import { getSettings } from "@/lib/settings";
import { Toque } from "./toque";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Refunds" },
];

/** One quiet line: what this is, where to go, the year and the small print. */
function Line({ left, centre, year }: { left: React.ReactNode; centre: { href: string; label: string }[]; year: number }) {
  return (
    <footer className="text-small text-ink-2">
      <div className="wrap grid gap-2 pb-7 pt-[18svh] md:grid-cols-[1fr_auto_1fr] md:items-baseline md:gap-6">
        <p className="flex flex-wrap items-center gap-x-6 gap-y-1">{left}</p>
        {centre.length > 0 && (
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {centre.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-block py-1 text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[180ms] hover:decoration-current">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
          <span>© {year}</span>
          {legal.map((l) => (
            <Link key={l.label} href={l.href} className="inline-block py-1 text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[180ms] hover:decoration-current">
              {l.label}
            </Link>
          ))}
        </p>
      </div>
    </footer>
  );
}

/** The footer on a page prepared for one company: who to call, and the legal links. */
export async function MinimalFooter() {
  const year = await currentYear();
  const { contactEmail } = siteConfig;
  const founder = { phone: (await getSettings()).founderPhone };
  return (
    <Line
      year={year}
      centre={[]}
      left={
        <>
          <span className="text-ink">Roger, Toronto</span>
          {contactEmail && (
            <a className="tlink" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          )}
          {founder.phone && (
            <a className="tlink" href={`tel:${founder.phone.replace(/[^+\d]/g, "")}`}>
              {founder.phone}
            </a>
          )}
        </>
      }
    />
  );
}

const columns = [
  {
    title: "Library",
    links: [
      { href: "/library", label: "All use cases" },
      { href: "/packs/solopreneur", label: "Free starter pack" },
      { href: "/#watch", label: "Watch for a use case" },
    ],
  },
  {
    title: "Have it done",
    links: [
      { href: "/setup", label: "Custom setup" },
      { href: "/setup#plan", label: "Monthly plan" },
      { href: "/companies", label: "For companies" },
      { href: "/workshops", label: "Workshops" },
    ],
  },
];

export async function SiteFooter() {
  const year = await currentYear();
  const { contactEmail } = siteConfig;
  return (
    <footer data-header-tone="night" className="on-night bg-night text-night-ink">
      <div className="wrap grid gap-12 pb-10 pt-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:pt-24">
        <div>
          <Link href="/" className="-ml-1 inline-flex items-center gap-2 rounded-md px-1 py-1 text-[1.25rem] font-[620] tracking-[-0.02em]">
            <Toque className="size-[26px] text-accent-night" />
            Roger
          </Link>
          <p className="mt-4 max-w-[22rem] text-small text-night-ink-2">
            Real agent use cases, read every morning in Toronto. Search them,
            start with a free pack, or have yours set up.
          </p>
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="tlink mt-5 inline-block py-1 text-small">
              {contactEmail}
            </a>
          )}
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">{c.title}</p>
              <ul className="mt-4 grid gap-1">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="inline-block py-1.5 text-small text-night-ink/90 transition-colors duration-[180ms] hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">Legal</p>
            <ul className="mt-4 grid gap-1">
              {legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-block py-1.5 text-small text-night-ink/90 transition-colors duration-[180ms] hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 py-6 text-[0.875rem] text-night-ink-2">
        <span>© {year} Roger · Toronto</span>
        <span>Prices in CAD, no HST charged.</span>
      </div>
    </footer>
  );
}
