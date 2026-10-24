import { connection } from "next/server";
import { sql } from "@/lib/db";

export default async function AdminWatches() {
  await connection();
  const rows = (await sql`
    select w.email, w.query, w.confirmed_at, w.unsubscribed_at, w.created_at, count(h.use_case_id)::int hits
    from watches w left join watch_hits h on h.watch_id = w.id
    group by w.id order by w.created_at desc limit 500`) as { email: string; query: string; confirmed_at: string | null; unsubscribed_at: string | null; created_at: string; hits: number }[];
  return (
    <section>
      <h1 className="text-h3">Watches · {rows.length}</h1>
      <p className="mt-2 max-w-[44rem] text-small text-ink-2">What people are waiting for an agent to do. Each confirmed watch gets an email the morning a matching use case lands. This list is also the best map of what to build next.</p>
      <table className="mt-6 w-full border-collapse text-left text-small">
        <thead>
          <tr className="border-b border-ink text-ink-2">
            <th className="py-2 pr-4 font-[500]">Waiting for</th>
            <th className="py-2 pr-4 font-[500]">Email</th>
            <th className="py-2 pr-4 font-[500]">Status</th>
            <th className="py-2 pr-4 text-right font-[500]">Sent</th>
            <th className="py-2 font-[500]">Saved</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.email}-${r.created_at}`} className="border-b border-rule align-top">
              <td className="py-3 pr-4 font-[560]">{r.query}</td>
              <td className="py-3 pr-4">{r.email}</td>
              <td className="py-3 pr-4 text-ink-2">{r.unsubscribed_at ? "stopped" : r.confirmed_at ? "active" : "not confirmed yet"}</td>
              <td className="py-3 pr-4 text-right">{r.hits}</td>
              <td className="py-3 whitespace-nowrap text-ink-2">{new Date(r.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="mt-6 text-small text-ink-2">No watches yet.</p>}
    </section>
  );
}
