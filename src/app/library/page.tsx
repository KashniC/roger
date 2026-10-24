import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StickyCta } from "@/components/client-boot";
import { NewsletterForm } from "@/components/forms";
import { LockScreen } from "@/components/phone/lock-screen";
import { LibraryBrowser, LibraryStatic } from "@/components/library-browser";
import { getUseCases } from "@/lib/library-source";

export const metadata: Metadata = {
  title: { absolute: "Real AI assistant use cases · Roger" },
  description:
    "What people’s AI assistants are actually doing: meal plans, school forms, forgotten gift cards, invoices and customer messages. Collected weekly from public posts, each linked to the original.",
  alternates: { canonical: "/library" },
  openGraph: { url: "/library" },
};

function shortDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function longDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });
}

function SetUpBand() {
  return (
    <div className="on-night grid gap-8 rounded-[var(--radius-object)] bg-night p-8 text-night-ink sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
      <h2 className="text-h3">Want some of these working for you this week?</h2>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link href="/packs/solopreneur" className="btn btn-m btn-light">
          Get the free pack
        </Link>
        <Link href="/setup" className="tlink chev">
          Or a $500 custom setup
        </Link>
      </div>
    </div>
  );
}

export default async function LibraryPage() {
  const items = await getUseCases();
  const latest = items.reduce((m, u) => (u.weekOf > m ? u.weekOf : m), "0000-00-00");
  const newest = items.filter((u) => u.weekOf === latest && u.outcome !== "honest-miss").slice(0, 3);

  return (
    <>
      <section aria-labelledby="library-title" className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 pb-10 pt-10 md:pb-14 md:pt-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
        <div>
          <p className="text-small font-[560] text-ink-2">
            {items.length} use cases · <span className="sm:hidden">updated {shortDate(latest)}</span>
            <span className="hidden sm:inline">last added the week of {longDate(latest)}</span>
          </p>
          <h1 id="library-title" className="mt-3 max-w-[16ch] text-h2 text-stretch-display sm:mt-4 sm:text-display">
            Real-world AI assistant use cases.
          </h1>
          <p className="mt-4 max-w-[36rem] text-lead text-ink-2 sm:mt-6">
            Collected weekly from public posts. Not Roger clients.<span className="hidden sm:inline"> Each one is in our words, credits its author and links to the original.</span>
          </p>
          <p id="hero-cta" className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-small sm:mt-7">
            <Link href="/packs/solopreneur" className="btn btn-m">
              Get the free starter pack
            </Link>
            <Link href="/#watch" className="tlink chev">
              Watch for what you need
            </Link>
          </p>
        </div>
        <div className="hidden h-[400px] lg:block">
          <LockScreen
            variant="crop"
            scene="morning"
            date={`Week of ${longDate(latest).replace(/, \d{4}$/, "")}`}
            time="9:41"
            uid="library"
            arrive="stagger"
            expanded={3}
            notes={newest.map((u) => ({ id: u.id, app: u.tool || "Assistant", title: u.title, time: u.handle, body: u.summary }))}
            label={`This week’s newest use cases: ${newest.map((u) => u.title).join("; ")}`}
          />
        </div>
      </section>

      <Suspense fallback={<LibraryStatic items={items} />}>
        <LibraryBrowser items={items} band={<SetUpBand />} />
      </Suspense>

      <section id="final-cta" aria-label="Keep up" className="wrap pb-24 md:pb-32">
        <div className="grid gap-8 border-t border-rule pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <NewsletterForm forValue="home" />
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-small">
            <Link href="/packs/solopreneur" className="tlink chev">
              Free starter pack
            </Link>
            <Link href="/setup" className="tlink chev">
              Custom setup, $500
            </Link>
          </p>
        </div>
      </section>

      <StickyCta actions={[{ kind: "setupCall", label: "Book a free setup call" }]} />
    </>
  );
}
