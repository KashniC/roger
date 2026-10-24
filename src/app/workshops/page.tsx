import type { Metadata } from "next";
import { WorkshopForm } from "@/components/forms";
import { LockScreen } from "@/components/phone/lock-screen";
import { SectionHead } from "@/components/sections";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: { absolute: "Free AI assistant workshop for your members · Roger" },
  description:
    "In 60 minutes we set up a real AI assistant live, start to finish, and show your members what it can take off their plate. Free for Toronto BIAs, associations, chambers and school communities.",
  alternates: { canonical: "/workshops" },
  openGraph: { url: "/workshops" },
};

const gets = [
  { title: "The live build", body: "We set up one real AI assistant in front of the room, start to finish, and answer questions as we go." },
  { title: "A starter checklist", body: "A one-page checklist they can take home and work through on their own." },
  { title: "A 14-day member discount", body: "A code for your group that takes money off our business or home setup, if anyone wants us to do it for them." },
];

const formats = ["60 or 90 minutes", "In person in Toronto, or on Zoom", "Evenings or breakfast", "10–40 people"];

export default function WorkshopsPage() {
  const { endorsements, counter } = siteConfig.proof;
  return (
    <>
      <section aria-labelledby="hero-title" className="overflow-hidden">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-14 pb-20 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20">
          <div>
            <p className="text-small font-[560] text-ink-2">Free workshops · Toronto and Zoom</p>
            <h1 id="hero-title" className="mt-4 text-h2 text-stretch-display">
              Give your members a free, live AI assistant workshop.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lead text-ink-2">
              In 60 minutes we set up a real AI assistant live, start to finish, and show your members what it can take off their plate. Free for BIAs, associations and school communities.
            </p>
            <div id="hero-cta" className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#request" className="btn btn-l">
                Request a date
              </a>
              {siteConfig.workshopHostPack && (
                <a href={siteConfig.workshopHostPack} className="tlink chev">
                  Download the one-page host pack (PDF)
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="[--phone-w:min(74vw,280px)] md:[--phone-w:300px]">
              <LockScreen
                scene="afternoon"
                date="Thursday, November 5"
                time="7:44"
                arrive="stagger"
                uid="workshop"
                notes={[
                  { id: "w2", title: "Chief of Staff", time: "7:44", body: "Your first brief is set for 6:45 tomorrow. I’ll start with Saturday’s messages." },
                  { id: "w1", title: "Customer messages", time: "7:42", body: "Connected to your inbox. 11 customer messages are waiting; I’ve drafted replies to 8." },
                ]}
                label="Example: an assistant set up live at a workshop, sending its first two messages."
              />
              <p className="mt-5 text-center text-meta text-ink-2">Example: an assistant built live in the room.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="gets-title" className="border-t border-rule bg-ground-2">
        <div className="wrap py-24 md:py-28">
          <SectionHead id="gets-title" title="What your members get." />
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {gets.map((g, i) => (
              <li key={g.title} className="border-t border-ink pt-6">
                <p className="text-meta font-[600] text-ink-2">{String(i + 1)}</p>
                <h3 className="mt-2 text-title">{g.title}</h3>
                <p className="mt-3 text-body text-ink-2">{g.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="provide-title" className="bg-ground">
        <div className="wrap grid gap-12 py-24 md:grid-cols-2 md:py-28">
          <div>
            <h2 id="provide-title" className="text-h2">
              What you provide: a room, or a Zoom link, and 10–40 people.
            </h2>
            <p className="mt-4 text-lead text-ink-2">That’s it. We bring the rest, and a promo blurb for your newsletter.</p>
          </div>
          <ul className="divide-y divide-rule self-end border-y border-rule">
            {formats.map((f) => (
              <li key={f} className="py-4 text-lead">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {(endorsements.length > 0 || counter.workshops > 0) && (
        <section aria-labelledby="hosts-title" className="border-t border-rule bg-ground">
          <div className="wrap py-24">
            <h2 id="hosts-title" className="text-h2">
              {counter.workshops > 0 ? `${counter.workshops} workshops so far.` : "What hosts say."}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {endorsements.map((e) => (
                <figure key={e.person} className="border-t border-ink pt-6">
                  <blockquote className="text-lead">“{e.quote}”</blockquote>
                  <figcaption className="mt-4 text-small text-ink-2">
                    {e.person}, {e.title}, {e.org}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="request" aria-labelledby="request-title" className="scroll-mt-14 border-t border-rule bg-ground-2">
        <div id="final-cta" className="wrap grid gap-12 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-28">
          <div>
            <h2 id="request-title" className="text-h2">
              Request a date.
            </h2>
            <p className="mt-4 text-lead text-ink-2">Tell us a little about your group and we’ll reply within 1 business day to find a date that works.</p>
          </div>
          <WorkshopForm />
        </div>
      </section>
    </>
  );
}
