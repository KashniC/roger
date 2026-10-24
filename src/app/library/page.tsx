import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StickyCta } from "@/components/client-boot";
import { WatchSentence } from "@/components/home/watch-sentence";
import { LibraryBrowser, LibraryStatic } from "@/components/library-browser";
import { getUseCases } from "@/lib/library-source";

export const metadata: Metadata = {
  title: { absolute: "Real AI agent use cases · Roger" },
  description:
    "What people’s AI agents are actually doing: meal plans, school forms, forgotten gift cards, invoices and customer messages. Read from public posts every morning, each linked to the original.",
  alternates: { canonical: "/library" },
  openGraph: { url: "/library" },
};

function SetUpBand() {
  return (
    <div className="on-night grid gap-8 rounded-[8px] bg-night p-8 text-night-ink sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
      <h2 className="text-h3">Want these working for you?</h2>
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

  return (
    <>
      <section aria-labelledby="library-title" className="wrap grid grid-cols-[minmax(0,1fr)] gap-6 pb-10 pt-10 md:pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-end lg:gap-16">
        <h1 id="library-title" className="lines text-h2 text-stretch-display">
          <span className="line">
            <span data-line style={{ "--i": 0 } as React.CSSProperties}>
              The use-case
            </span>
          </span>
          <span className="line">
            <span data-line style={{ "--i": 1 } as React.CSSProperties}>
              library
            </span>
          </span>
        </h1>
        <div className="after-lines">
          <p className="text-lead">
            {items.length.toLocaleString("en-CA")} real things people’s agents did, in our words, each linked to the person’s own post. Read from public posts every morning. None of them are Roger clients.
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/packs/solopreneur" className="btn btn-m">
              Get the free starter pack
            </Link>
            <Link href="#watch" className="tlink chev">
              Watch for what you need
            </Link>
          </p>
        </div>
      </section>

      <Suspense fallback={<LibraryStatic items={items} />}>
        <LibraryBrowser items={items} band={<SetUpBand />} />
      </Suspense>

      <section id="watch" aria-labelledby="watch-title" className="wrap scroll-mt-32 pb-8 pt-16 md:pt-24">
        <div id="final-cta" data-reveal>
        <h2 id="watch-title" className="text-h2">
          Not in the library yet?
        </h2>
        <div className="mt-6">
          <WatchSentence />
        </div>
        <p className="mt-6 max-w-[36rem] text-small text-ink-2">The morning someone’s agent does it, you get one email with the link. Every email has a link to stop.</p>
        </div>
      </section>

      <StickyCta actions={[{ kind: "setupCall", label: "Book a free setup call" }]} />
    </>
  );
}
