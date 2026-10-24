import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { confirmWatch } from "@/lib/watches";

export const metadata: Metadata = { title: "Watch confirmed", robots: { index: false } };

async function Result({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const query = t ? await confirmWatch(t) : null;
  return query ? (
    <>
      <h1 className="text-h2">You’re watching for it.</h1>
      <p className="mt-4 max-w-[34rem] text-lead">
        We’ll email you the day someone’s agent does <strong className="font-[600] text-ink">“{query}”</strong>. The library checks new posts every morning.
      </p>
    </>
  ) : (
    <>
      <h1 className="text-h2">That link has expired.</h1>
      <p className="mt-4 max-w-[34rem] text-lead">Set the watch again from the library and we’ll send a fresh link.</p>
    </>
  );
}

export default function Page({ searchParams }: PageProps<"/watch/confirm">) {
  return (
    <section className="wrap py-24 md:py-32">
      <Suspense fallback={<p className="text-lead">Confirming…</p>}>
        <Result searchParams={searchParams as Promise<{ t?: string }>} />
      </Suspense>
      <p className="mt-10">
        <Link className="tlink chev" href="/">
          Back to the library
        </Link>
      </p>
    </section>
  );
}
