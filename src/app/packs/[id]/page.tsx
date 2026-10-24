import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AgentOutput, hasSample } from "@/components/agent-output";
import { CopyPrompt, PackGate } from "@/components/pack-gate";
import { categoryLabel, type UseCase } from "@/data/library";
import { packs, type Agent } from "@/data/packs";
import { getUseCases } from "@/lib/library-source";

const OPEN = 3;

export function generateStaticParams() {
  return packs.filter((p) => p.status === "live").map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = packs.find((x) => x.id === id);
  return p
    ? {
        title: `${p.persona} starter pack: ${p.title}`,
        description: p.blurb,
        alternates: { canonical: `/packs/${p.id}` },
      }
    : {};
}

function PromptBox({ a }: { a: Agent }) {
  return (
    <div data-ui className="rounded-[8px] bg-surface p-5">
      <p className="text-[0.875rem] font-[600] text-ink-2">
        Paste into your agent
      </p>
      <p className="mt-2 text-small">{a.prompt}</p>
      <div className="mt-4">
        <CopyPrompt text={a.prompt} />
      </div>
    </div>
  );
}

function AgentRow({
  a,
  examples,
  shade,
}: {
  a: Agent;
  examples: UseCase[];
  shade: boolean;
}) {
  return (
    <li
      id={`agent-${a.id}`}
      className={`scroll-mt-24 rounded-[8px] px-5 py-7 sm:px-6 ${shade ? "bg-[#ececef]" : "bg-ground-2"}`}
    >
      <div data-reveal>
        <h3 className="text-h3">{a.name}</h3>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="max-w-[34rem] text-body">{a.does}</p>
            <p className="mt-3 text-small">
              <span className="font-[600]">Connect: </span>
              {a.connect.join(", ")}
            </p>
            {examples.length > 0 && (
              <p className="mt-2 text-small">
                <span className="font-[600]">Seen in the library: </span>
                {examples.map((u, i) => (
                  <span key={u.id}>
                    {i > 0 && " · "}
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="tlink inline-block py-1"
                    >
                      {u.title}
                    </a>
                  </span>
                ))}
              </p>
            )}
            <div className="mt-5">
              <PromptBox a={a} />
            </div>
          </div>
          {hasSample(a.id) && <AgentOutput id={a.id} />}
        </div>
      </div>
    </li>
  );
}

async function Agents({ id }: { id: string }) {
  const p = packs.find((x) => x.id === id)!;
  const unlocked = (await cookies()).get(`roger-pack-${id}`)?.value === "1";
  const library = await getUseCases();
  // Closest library entries by shared words, each shown under one agent only.
  const words = (s: string) =>
    new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const used = new Set<string>();
  const examplesFor = (a: Agent) => {
    const want = words(`${a.name} ${a.does} ${a.prompt}`);
    const picks = library
      .filter((u) => a.categories.includes(u.category) && !used.has(u.id))
      .map((u) => ({
        u,
        score: [...words(`${u.title} ${u.summary}`)].filter((w) => want.has(w))
          .length,
      }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 2)
      .map((x) => x.u);
    picks.forEach((u) => used.add(u.id));
    return picks;
  };
  const examples = new Map(p.agents.map((a) => [a.id, examplesFor(a)]));
  const visible = unlocked ? p.agents : p.agents.slice(0, OPEN);
  return (
    <>
      <ol className="mt-14 space-y-1 md:-mx-6">
        {visible.map((a, i) => (
          <AgentRow
            key={a.id}
            a={a}
            examples={examples.get(a.id) ?? []}
            shade={i % 2 === 1}
          />
        ))}
      </ol>
      {!unlocked && (
        <div id="all-ten" className="mt-1 scroll-mt-24 md:-mx-6" data-reveal>
          <PackGate
            persona={id}
            locked={p.agents.slice(OPEN).map((a) => a.name)}
          />
        </div>
      )}
      {unlocked && (
        <p className="mt-8 text-small">
          Shelves these come from:{" "}
          {[...new Set(p.agents.flatMap((a) => a.categories))].map((c, i) => (
            <span key={c}>
              {i > 0 && " · "}
              <Link className="tlink" href={`/library?cat=${c}`}>
                {categoryLabel(c)}
              </Link>
            </span>
          ))}
        </p>
      )}
    </>
  );
}

export default async function PackPage({ params }: PageProps<"/packs/[id]">) {
  const { id } = await params;
  const p = packs.find((x) => x.id === id && x.status === "live");
  if (!p) notFound();
  const cut = p.title.indexOf(" for ");
  const lines =
    cut > 0 ? [p.title.slice(0, cut + 4), p.title.slice(cut + 5)] : [p.title];
  return (
    <>
      <section className="wrap pb-24 pt-12 md:pb-32 md:pt-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <h1 className="lines text-[clamp(2.5rem,4.8vw,4.5rem)] font-[650] leading-[1] tracking-[-0.045em] text-stretch-display">
              {lines.map((l, i) => (
                <span key={l} className="line">
                  <span data-line style={{ "--i": i } as React.CSSProperties}>
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <div className="after-lines">
              <p className="mt-8 max-w-[38rem] text-lead">{p.blurb}</p>
              <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href="#all-ten" className="btn btn-l">
                  Get all {p.agents.length}, free
                </a>
                <span className="text-small text-ink-2">
                  {OPEN} are open below. The {p.persona.toLowerCase()} pack is
                  free.
                </span>
              </p>
            </div>
          </div>
          <ol data-ui className="after-lines space-y-1">
            {p.agents.map((a, i) => {
              const open = i < OPEN;
              const row = (
                <>
                  <span className="text-[1.0625rem] font-[560]">{a.name}</span>
                  <span
                    className={`rounded-[6px] px-2.5 py-1 text-[0.8125rem] font-[600] ${open ? "bg-accent-night text-night" : "bg-white/[0.08] text-night-ink-2"}`}
                  >
                    {open ? "Open" : "With email"}
                  </span>
                </>
              );
              const cls =
                "flex min-h-11 items-center justify-between gap-4 rounded-[6px] bg-night-2 px-4 text-night-ink";
              return (
                <li key={a.id}>
                  {open ? (
                    <a
                      href={`#agent-${a.id}`}
                      className={`${cls} transition-colors duration-[180ms] hover:bg-[#232327]`}
                    >
                      {row}
                    </a>
                  ) : (
                    <span className={cls}>{row}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <Suspense
          fallback={<p className="mt-12 text-small">Loading the pack…</p>}
        >
          <Agents id={p.id} />
        </Suspense>
      </section>
      <section aria-labelledby="setup-title" className="bg-ground-2">
        <div
          className="wrap grid gap-8 py-24 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-32"
          data-reveal
        >
          <div>
            <h2 id="setup-title" className="max-w-[18ch] text-h2">
              Rather have it set up for you?
            </h2>
            <p className="mt-3 max-w-[34rem] text-lead">
              Peter picks the right agents for how you work and installs them on
              your accounts, with you, in one session.
            </p>
          </div>
          <Link href="/setup" className="btn btn-l">
            Book a $500 custom setup
          </Link>
        </div>
      </section>
    </>
  );
}
