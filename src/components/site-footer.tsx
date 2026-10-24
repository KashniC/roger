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

const columns = [
  {
    heading: "Setups",
    links: [
      { href: "/packs/solopreneur", label: "Free starter packs" },
      { href: "/setup", label: "Custom setup" },
      { href: "/companies", label: "For companies" },
      { href: "/workshops", label: "Free workshops" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { href: "/library", label: "Use-case library" },
      { href: "/#watch", label: "Watches" },
      { href: "/refunds", label: "The guarantee" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/refunds", label: "Refunds" },
    ],
  },
];

/** The footer on a page prepared for one company: who to call, and the legal links. */
export async function MinimalFooter() {
  const year = await currentYear();
  const { contactEmail } = siteConfig;
  const founder = { phone: (await getSettings()).founderPhone };
  return (
    <footer className="border-t border-rule bg-ground-2 text-small text-ink-2">
      <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2 text-[1.0625rem] font-[620] tracking-[-0.015em] text-ink">
            <Toque className="size-[22px] text-accent" />
            Roger
          </span>
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
        </p>
        <p className="flex gap-x-6">
          <span>© {year}</span>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="border-t border-rule bg-ground-2 text-small text-ink-2">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-md text-[1.0625rem] font-[620] tracking-[-0.015em] text-ink">
            <Toque className="size-[22px] text-accent" />
            Roger
          </Link>
          <p className="mt-3 max-w-[30ch]">Real things people’s AI agents do, collected every morning. Made in Toronto.</p>
          {siteConfig.contactEmail && (
            <p className="mt-4">
              <a className="tlink" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
          )}
        </div>
        {columns.map((c) => (
          <nav key={c.heading} aria-label={c.heading}>
            <h2 className="text-meta font-[600] text-ink">{c.heading}</h2>
            <ul className="mt-3 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="rounded transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-2 border-t border-rule py-6 text-meta sm:flex-row sm:justify-between">
        <p>
          © {year} {siteConfig.productName}. {siteConfig.taxNote}
        </p>
        <p>Use cases credit their authors and link to the original posts. They are not Roger clients.</p>
        </div>
      </div>
    </footer>
  );
}
