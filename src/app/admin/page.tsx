import { connection } from "next/server";
import Link from "next/link";
import { RunIngest } from "@/components/admin-ui";
import { sql } from "@/lib/db";

export default async function AdminOverview() {
  await connection();
  const [[c], [l], [w], runs, byPersona] = (await Promise.all([
    sql`select count(*)::int total, count(*) filter (where created_at > now() - interval '7 days' and source <> 'seed')::int week, count(*) filter (where source not in ('seed','admin'))::int found from use_cases`,
    sql`select count(*) filter (where kind = 'pack')::int packs, count(*) filter (where kind = 'interest')::int interest, count(*) filter (where created_at > now() - interval '7 days')::int week from leads`,
    sql`select count(*)::int total, count(*) filter (where confirmed_at is not null and unsubscribed_at is null)::int active from watches`,
    sql`select started_at, finished_at, fetched, accepted, notes from ingest_runs order by started_at desc limit 8`,
    sql`select persona, kind, count(*)::int n from leads group by persona, kind order by n desc`,
  ])) as [
    { total: number; week: number; found: number }[],
    { packs: number; interest: number; week: number }[],
    { total: number; active: number }[],
    { started_at: string; finished_at: string | null; fetched: number; accepted: number; notes: string }[],
    { persona: string; kind: string; n: number }[],
  ];

  const stat = (n: number, label: string, href: string) => (
    <Link href={href} className="group block py-2">
      <p className="text-h2 leading-none">{n}</p>
      <p className="mt-2 text-small text-ink-2 group-hover:text-ink">{label}</p>
    </Link>
  );

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-h3">This week</h1>
        <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {stat(c.total, `use cases in the library (${c.week} added this week)`, "/admin/use-cases")}
          {stat(l.packs, "starter-pack sign-ups", "/admin/leads")}
          {stat(l.interest, "asked for a coming-soon pack", "/admin/leads")}
          {stat(w.active, `active watches (${w.total} saved)`, "/admin/watches")}
        </div>
        {byPersona.length > 0 && (
          <p className="mt-4 text-small text-ink-2">
            By persona: {byPersona.map((b) => `${b.persona} ${b.kind === "pack" ? "packs" : "interest"} ${b.n}`).join(" · ")}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-h3">Daily intake</h2>
        <p className="mt-2 max-w-[44rem] text-small text-ink-2">
          Every morning the site reads new posts (X when a key is set in Connections, Hacker News, and anything your own agent pushes), keeps the real agent use cases and rewrites them in our words. {c.found} so far came from the intake.
        </p>
        <div className="mt-5">
          <RunIngest />
        </div>
        <table className="mt-6 w-full border-collapse text-left text-small">
          <thead>
            <tr className="border-b border-ink text-ink-2">
              <th className="py-2 pr-4 font-[500]">Run</th>
              <th className="py-2 pr-4 text-right font-[500]">New posts</th>
              <th className="py-2 pr-4 text-right font-[500]">Added</th>
              <th className="py-2 font-[500]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.started_at} className="border-b border-rule align-top">
                <td className="py-3 pr-4 whitespace-nowrap">{new Date(r.started_at).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" })}</td>
                <td className="py-3 pr-4 text-right">{r.fetched}</td>
                <td className="py-3 pr-4 text-right font-[600]">{r.accepted}</td>
                <td className="py-3 text-ink-2">{r.finished_at ? r.notes : "running…"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
