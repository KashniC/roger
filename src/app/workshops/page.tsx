import type { Metadata } from "next";
import Image from "next/image";
import mapTable from "@/assets/img/map-table.webp";
import dawn from "@/assets/img/toronto-dawn.jpg";
import { WorkshopForm } from "@/components/forms";
import { VideoLoop } from "@/components/video-loop";
import { siteConfig } from "@/data/config";
import { credits } from "@/data/credits";

export const metadata: Metadata = {
  title: { absolute: "Free AI agent workshop for your members · Roger" },
  description:
    "In 60 minutes we set up a real AI agent live, start to finish, and show your members what it can take off their plate. Free for Toronto BIAs, associations, chambers and school communities.",
  alternates: { canonical: "/workshops" },
  openGraph: { url: "/workshops" },
};

const gets = [
  { title: "The live build", body: "We set up one real AI agent in front of the room, start to finish, and answer questions as we go." },
  { title: "The free starter pack", body: "Ten agents with the instructions to paste in, so they can set up their own that evening." },
  { title: "A member code", body: "Fourteen days to book a custom setup at the member rate, if anyone wants it done for them." },
];

const formats = ["60 or 90 minutes", "In person in Toronto, or on Zoom", "Evenings or breakfast", "10 to 40 people"];

/** The agent from the live build sending its first two messages. */
function FirstMessages() {
  const notes = [
    { from: "Morning brief", at: "7:44pm", body: "Your first brief is set for 6:45 tomorrow. I’ll start with Saturday’s messages." },
    { from: "Customer messages", at: "7:42pm", body: "Connected to your inbox. 11 customer messages are waiting; I’ve drafted replies to 8." },
  ];
  return (
    <figure>
      <div data-ui className="space-y-2 rounded-[8px] bg-night p-4 text-night-ink sm:p-5">
        <p className="px-1 pb-1 text-[0.8125rem] text-night-ink-2">Thursday, 7:44pm · built in the room</p>
        {notes.map((n) => (
          <div key={n.from} className="rounded-[8px] bg-night-2 p-4">
            <p className="flex justify-between gap-4 text-[0.8125rem] text-night-ink-2">
              <span className="font-[600] text-night-ink">{n.from}</span>
              <span>{n.at}</span>
            </p>
            <p className="mt-1.5 text-[0.9375rem]">{n.body}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-small text-ink-2">Example: an agent’s first two messages, set up live in the room.</figcaption>
    </figure>
  );
}

export default function WorkshopsPage() {
  const { endorsements, counter } = siteConfig.proof;
  const aerial = credits.torontoAerial;
  const dawnCredit = credits.torontoDawn;
  return (
    <>
      <section aria-labelledby="hero-title" className="wrap grid grid-cols-[minmax(0,1fr)] items-end gap-14 pb-24 pt-14 md:pt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <h1 id="hero-title" className="lines text-[clamp(2.125rem,4.2vw,4rem)] md:whitespace-nowrap font-[650] leading-[1] tracking-[-0.045em] text-stretch-display">
            <span className="line">
              <span data-line style={{ "--i": 0 } as React.CSSProperties}>
                A free AI workshop
              </span>
            </span>
            <span className="line">
              <span data-line style={{ "--i": 1 } as React.CSSProperties}>
                for your members
              </span>
            </span>
          </h1>
          <div className="after-lines">
            <p className="mt-8 max-w-[34rem] text-lead">
              In 60 minutes we set up a real AI agent live, start to finish, and show your members what it can take off their plate. Free for Toronto BIAs, associations and school communities.
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
        </div>
        <div className="after-lines">
          <FirstMessages />
        </div>
      </section>

      <section aria-labelledby="gets-title" className="bg-ground-2">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 py-28 md:py-40 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16" data-reveal>
          <div>
            <h2 id="gets-title" className="text-h2">
              What your members get
            </h2>
            <ul className="mt-12 space-y-1">
              {gets.map((g, i) => (
                <li key={g.title} className={`rounded-[8px] px-5 py-6 sm:px-6 ${i % 2 ? "bg-[#e9e9ec]" : "bg-ground"}`}>
                  <h3 className="text-title">{g.title}</h3>
                  <p className="mt-2 text-body">{g.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure>
            <div className="relative aspect-[4/5] overflow-clip rounded-[8px] bg-night">
              <Image src={mapTable} alt="A meeting table with a printed map, sticky notes and a laptop" fill sizes="(min-width: 1024px) 460px, 100vw" placeholder="blur" className="drift object-cover" />
            </div>
            <figcaption className="mt-3 text-small text-ink-2">A table, a screen and your members’ questions are all it takes.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="provide-title" className="bg-ground">
        <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 py-28 md:py-40 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16" data-reveal>
          <figure className="order-2 lg:order-none">
            <div className="aspect-[16/10] overflow-clip rounded-[8px] bg-night">
              <VideoLoop webm="/media/toronto-aerial.webm" mp4="/media/toronto-aerial.mp4" poster="/media/toronto-aerial.jpg" label="Aerial view of downtown Toronto" className="size-full object-cover" />
            </div>
            <figcaption className="mt-3 text-small text-ink-2">
              Anywhere in Toronto, or on Zoom. Video:{" "}
              <a href={aerial.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                {aerial.by}
              </a>
              ,{" "}
              <a href={aerial.licenceUrl} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                {aerial.licence}
              </a>
            </figcaption>
          </figure>
          <div>
            <h2 id="provide-title" className="text-h2">
              What you provide
            </h2>
            <p className="mt-4 text-lead">A room or a Zoom link, and 10 to 40 people. We bring the rest, and a blurb for your newsletter.</p>
            <ul className="mt-8 space-y-1">
              {formats.map((f, i) => (
                <li key={f} className={`rounded-[8px] px-5 py-4 text-lead ${i % 2 ? "bg-[#ececef]" : "bg-ground-2"}`}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(endorsements.length > 0 || counter.workshops > 0) && (
        <section aria-labelledby="hosts-title" className="bg-ground">
          <div className="wrap pb-28" data-reveal>
            <h2 id="hosts-title" className="text-h2">
              {counter.workshops > 0 ? `${counter.workshops} workshops so far` : "What hosts say"}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {endorsements.map((e) => (
                <figure key={e.person}>
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

      <figure>
        <div className="relative h-[44svh] min-h-[18rem] overflow-clip bg-night">
          <Image src={dawn} alt="Toronto’s skyline and the CN Tower at sunrise, seen across Lake Ontario" fill sizes="100vw" placeholder="blur" className="drift object-cover object-[50%_60%]" />
        </div>
        <figcaption className="wrap mt-4 flex flex-wrap justify-between gap-x-8 gap-y-1 text-small">
          <span>Toronto from Sam Smith Park. Breakfast and evening sessions, across the city.</span>
          <span className="text-ink-2">
            Photo:{" "}
            <a href={dawnCredit.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {dawnCredit.by}
            </a>
            ,{" "}
            <a href={dawnCredit.licenceUrl} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {dawnCredit.licence}
            </a>
          </span>
        </figcaption>
      </figure>

      <section id="request" aria-labelledby="request-title" className="mt-28 scroll-mt-16 bg-ground-2 md:mt-40">
        <div id="final-cta" className="wrap grid gap-12 py-28 md:grid-cols-[0.8fr_1.2fr] md:py-40" data-reveal>
          <div>
            <h2 id="request-title" className="text-h2">
              Request a date
            </h2>
            <p className="mt-4 text-lead">Tell us a little about your group and we’ll reply within 1 business day to find a date that works.</p>
          </div>
          <WorkshopForm />
        </div>
      </section>
    </>
  );
}
