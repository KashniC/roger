import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/data/config";
import { getSettings } from "@/lib/settings";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const links = [
  { href: "/library", label: "Use cases" },
  { href: "/packs/solopreneur", label: "Starter packs" },
  { href: "/setup", label: "Setup" },
  { href: "/companies", label: "Companies" },
  { href: "/workshops", label: "Workshops" },
];

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

export async function SiteFooter() {
  const year = await currentYear();
  return <Line year={year} centre={links} left={<span>Real agent use cases, read every morning in Toronto.</span>} />;
}
