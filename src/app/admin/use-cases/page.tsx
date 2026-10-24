import { connection } from "next/server";
import { AddCase, EditCase } from "@/components/admin-ui";
import { categoryLabel, type UseCaseCategory } from "@/data/library";
import { sql } from "@/lib/db";
import { deleteUseCase, toggleFeatured } from "../actions";

type Row = { id: string; title: string; summary: string; category: string; persona: string; for_: string; tool: string; handle: string; url: string; outcome: string | null; source: string; featured: boolean; created_at: string };

export default async function AdminUseCases({ searchParams }: PageProps<"/admin/use-cases">) {
  await connection();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rows = (q
    ? await sql`select * from use_cases where search @@ websearch_to_tsquery('english', ${q}) or title ilike ${"%" + q + "%"} order by created_at desc limit 200`
    : await sql`select * from use_cases order by created_at desc limit 200`) as Row[];
  const [{ n }] = (await sql`select count(*)::int n from use_cases`) as { n: number }[];
  const rejected = (await sql`select source, url, handle, text, reason, fetched_at from raw_posts where status = 'rejected' order by fetched_at desc limit 20`) as { source: string; url: string; handle: string; text: string; reason: string; fetched_at: string }[];

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-h3">Use cases · {n}</h1>
          <form className="flex gap-2">
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <input id="q" name="q" defaultValue={q} placeholder="Search" className="h-10 w-56 rounded-full border border-rule-strong bg-surface px-4 text-small outline-none focus:border-ink" />
            <button className="btn btn-s btn-ink">Search</button>
          </form>
        </div>
        <ul className="mt-6 divide-y divide-rule border-y border-rule">
          {rows.map((u) => (
            <li key={u.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-[44rem]">
                  <p className="text-meta text-ink-2">
                    {categoryLabel(u.category as UseCaseCategory)} · {u.persona} · {u.tool || "no agent named"} · from {u.source} · {new Date(u.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                    {u.featured && <span className="font-[600] text-accent"> · featured</span>}
                  </p>
                  <p className="mt-1 text-title">{u.title}</p>
                  <p className="mt-1 text-small text-ink-2">{u.summary}</p>
                  <a href={u.url} target="_blank" rel="noopener noreferrer" className="tlink mt-1 inline-block text-meta">
                    {u.handle} ↗
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="min-h-9 rounded-full border border-rule-strong px-3 text-meta font-[560] hover:border-ink">{u.featured ? "Unfeature" : "Feature"}</button>
                  </form>
                  <form action={deleteUseCase}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="min-h-9 rounded-full border border-rule-strong px-3 text-meta font-[560] text-error hover:border-error">Remove</button>
                  </form>
                </div>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-meta font-[560] text-ink-2 hover:text-ink">Edit</summary>
                <EditCase u={u} />
              </details>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-10">
        <section className="rounded-[var(--radius-object)] border border-rule bg-surface p-6">
          <h2 className="text-title">Add one by hand</h2>
          <p className="mt-1 mb-5 text-small text-ink-2">Found a good post? Write it in our words and link the original.</p>
          <AddCase />
        </section>
        <section>
          <h2 className="text-title">Recently turned down by the intake</h2>
          <p className="mt-1 text-small text-ink-2">If one of these is a real use case, add it by hand.</p>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {rejected.map((r) => (
              <li key={r.url} className="py-3 text-small">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="tlink">
                  {r.handle} on {r.source} ↗
                </a>
                <p className="mt-1 line-clamp-2 text-ink-2">{r.text}</p>
                <p className="mt-1 text-meta text-ink-2">Why: {r.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
