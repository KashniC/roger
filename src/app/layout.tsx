import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import { siteConfig } from "@/data/config";
import { offerNow } from "@/lib/offer";
import { SiteHeader } from "@/components/site-header";
import { MinimalFooter, SiteFooter } from "@/components/site-footer";
import { FooterSwitch } from "@/components/footer-switch";
import { ClientBoot, CodeBanner } from "@/components/client-boot";
import { Reveals } from "@/components/reveals";
import { SettingsProvider } from "@/components/settings-provider";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

const description =
  "AI and automation for family-owned companies in Toronto. We map where your company’s hours go in one two-hour session, then build and run the automations every month, on your own systems. Smaller setups for owners and families.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Roger: AI and automation for family-owned companies · Toronto",
    template: "%s · Roger",
  },
  description,
  applicationName: "Roger",
  openGraph: {
    type: "website",
    siteName: "Roger",
    locale: "en_CA",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfd",
  colorScheme: "light",
};

function jsonLd() {
  const work = offerNow("work");
  const home = offerNow("home");
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.productName,
    description: "AI and automation for family-owned companies in Toronto, on their own systems. Also setups for owners and families.",
    url: siteConfig.domain,
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    areaServed: { "@type": "City", name: "Toronto" },
    priceRange: `${home.priceLabel}–${work.priceLabel} ${siteConfig.prices.currency}`,
    makesOffer: [
      { "@type": "Offer", name: "Home setup", price: String(home.price), priceCurrency: siteConfig.prices.currency, url: `${siteConfig.domain}/` },
      { "@type": "Offer", name: "Work setup", price: String(work.price), priceCurrency: siteConfig.prices.currency, url: `${siteConfig.domain}/business` },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  return (
    <html lang="en-CA" className={mona.variable} suppressHydrationWarning>
      <head>
        {/* Entrances play only with JavaScript; without it the final, complete state renders. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('settled')},3200)" }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
        <SettingsProvider value={{ setupCall: s.setupCall, setupCheckout: s.setupCheckout, planCheckout: s.planCheckout, companyCall: s.companyCall }}>
          <ClientBoot />
          <Reveals />
          <SiteHeader />
          <CodeBanner />
          <main id="main" className="flex-1">
            {children}
          </main>
          <FooterSwitch full={<SiteFooter />} minimal={<MinimalFooter />} />
        </SettingsProvider>
      </body>
    </html>
  );
}
