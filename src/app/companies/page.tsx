import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { ClosingPhoto, CompanyHero, MapSession, Measured, NinetyDays, PartnerPricing, PeterSection, TrustBand } from "@/components/company";
import { MapGauge } from "@/components/map-gauge";
import { FaqSection } from "@/components/sections";
import { companyFaqs, companyFinal, companyWontDo, exampleMap, partner } from "@/data/company";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: { absolute: "Roger: AI and automation for family-owned companies · Toronto" },
  description: `We map where your company’s hours go in one two-hour session, then build and run the automations every month: quotes, orders, customer questions, invoices. On your own systems. From ${partner.priceLabel} a month.`,
  alternates: { canonical: "/companies" },
  openGraph: { url: "/companies" },
};


export default function CompanyPage() {
  return (
    <>
      {/* 1 · What is this? */}
      <CompanyHero />

      {/* 2 · What happens in the two hours? */}
      <MapSession />

      {/* 3 · What would it find? (the signature: a Map you make, read on a gauge) */}
      <MapGauge departments={exampleMap.departments} heading={exampleMap.heading} sub={exampleMap.sub} note={exampleMap.note} />

      {/* 4 · How fast? */}
      <NinetyDays />

      {/* 5 · How do we know it’s working? */}
      <Measured />

      {/* 6 · Can we trust you with our company? */}
      <TrustBand />

      {/* 7 · Who would we work with? */}
      <PeterSection wontDo={companyWontDo} />

      {/* 8 · What does it cost? */}
      <PartnerPricing />

      {/* 9 · The rest of our questions */}
      <FaqSection offer="work" items={companyFaqs} />

      {/* 10 · The action, on the table where it starts */}
      <ClosingPhoto>
        <h2 id="final-title" className="max-w-[12ch] text-h2">
          {companyFinal.heading}
        </h2>
        <p className="mt-4 max-w-[30rem] text-lead text-night-ink/80">{companyFinal.sub}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <ActionLink kind="companyCall" location="final">
            Book an intro call
          </ActionLink>
          {siteConfig.contactEmail && (
            <a className="tlink chev" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Roger for our company")}`}>
              {siteConfig.contactEmail}
            </a>
          )}
        </div>
      </ClosingPhoto>

    </>
  );
}
