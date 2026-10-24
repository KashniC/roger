import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CopyPrompt, PackGate } from "@/components/pack-gate";
import { categoryLabel, type UseCase } from "@/data/library";
import { packs, type Agent } from "@/data/packs";
import { getUseCases } from "@/lib/library-source";

const OPEN = 3;

export function generateStaticParams() {
  return packs.filter((p) => p.status === "live").map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/packs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = packs.find((x) => x.id === id);
  return p ? { title: `${p.persona} starter pack: ${p.title}`, description: p.blurb, alternates: { canonical: `/packs/${p.id}` } } : {};
}

function AgentRow({ a, n, examples, locked }: { a: Agent; n: number; examples: UseCase[]; locked?: boolean }) {
  return (
    <li className={`grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-10 ${locked ? "select-none opacity-40 blur-[3px]" : ""}`} aria-hidden={locked || undefined}>
      <p className="text-h3 text-ink-2">{n}</p>
      <div>
        <h3 className="text-title">{a.name}</h3>
        <p className="mt-2 max-w-[34rem] text-body text-ink-2">{a.does}</p>
        <p className="mt-3 text-small text-ink-2">
          <span className="font-[600] text-ink">Connect: </span>
          {a.connect.join(", ")}
        </p>
        {examples.length > 0 && !locked && (
          <p className="mt-3 text-small text-ink-2">
            <span className="font-[600] text-ink">Seen in the library: </span>
            {examples.map((u, i) => (
              <span key={u.id}>
                {i > 0 && " · "}
                <a href={u.url} target="_blank" rel="noopener noreferrer nofollow" className="tlink inline-block py-1">
                  {u.title}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="col-start-2 mt-5 rounded-[var(--radius-inner)] bg-ground-2 p-5 lg:col-start-auto lg:mt-0">
        <p className="text-meta font-[600] text-ink-2">Paste into your agent</p>
        <p className="mt-2 text-small">{a.prompt}</p>
        {!locked && (
          <div className="mt-3">
            <CopyPrompt text={a.prompt} />
          </div>
        )}
      </div>
    </li>
  );
}

async function Agents({ id }: { id: string }) {
  const p = packs.find((x) => x.id === id)!;
  const unlocked = (await cookies()).get(`roger-pack-${id}`)?.value === "1";
  const library = await getUseCases();
  // Closest library entries by shared words, each shown under one agent only.
  const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const used = new Set<string>();
  const examplesFor = (a: Agent) => {
    const want = words(`${a.name} ${a.does} ${a.prompt}`);
    const picks = library
      .filter((u) => a.categories.includes(u.category) && !used.has(u.id))
      .map((u) => ({ u, score: [...words(`${u.title} ${u.summary}`)].filter((w) => want.has(w)).length }))
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
      <ol className="mt-12 border-t border-ink">
        {visible.map((a, i) => (
          <AgentRow key={a.id} a={a} n={i + 1} examples={examples.get(a.id) ?? []} />
        ))}
        {!unlocked && p.agents.slice(OPEN, OPEN + 1).map((a) => <AgentRow key={a.id} a={a} n={OPEN + 1} examples={[]} locked />)}
      </ol>
      {!unlocked && (
        <div className="relative -mt-16">
          <PackGate persona={id} remaining={p.agents.length - OPEN} />
        </div>
      )}
      {unlocked && (
        <p className="mt-8 text-small text-ink-2">
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
  return (
    <>
      <section className="wrap pb-24 pt-8 md:pb-32 md:pt-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
          <div>
            <p className="text-small font-[560] text-ink-2">Free starter pack · {p.persona}</p>
            <h1 className="mt-3 max-w-[18ch] text-h2 text-stretch-display">{p.title}</h1>
            <p className="mt-6 max-w-[38rem] text-lead text-ink-2">{p.blurb}</p>
          </div>
          <div className="lit-card lit-card-calm hidden rounded-[28px] p-6 lg:block">
            <p className="text-meta text-white/70">In this pack</p>
            <ol className="mt-3 space-y-1.5 text-small">
              {p.agents.map((a, i) => (
                <li key={a.id} className={i < OPEN ? "text-white" : "text-white/60"}>
                  <span className="inline-block w-6 tabular-nums text-white/50">{i + 1}</span>{a.name}
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-white/15 pt-3 text-meta text-white/65">{OPEN} open now, the rest with your email.</p>
          </div>
        </div>
        <Suspense fallback={<p className="mt-12 text-small text-ink-2">Loading the pack…</p>}>
          <Agents id={p.id} />
        </Suspense>
      </section>
      <section className="border-t border-rule bg-ground-2">
        <div className="wrap grid gap-8 py-20 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="max-w-[18ch] text-h2">Rather have it set up for you?</h2>
            <p className="mt-3 max-w-[34rem] text-lead text-ink-2">Peter picks the right agents for how you work and installs them on your accounts, with you, in one session.</p>
          </div>
          <Link href="/setup" className="btn btn-l">
            Book a $500 custom setup
          </Link>
        </div>
      </section>
    </>
  );
}
