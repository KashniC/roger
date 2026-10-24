import { connection } from "next/server";
import { sql } from "@/lib/db";

export default async function AdminLeads() {
  await connection();
  const rows = (await sql`select email, kind, persona, utm, created_at from leads order by created_at desc limit 500`) as { email: string; kind: string; persona: string; utm: string; created_at: string }[];
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-h3">Sign-ups · {rows.length}</h1>
        <a href="/admin/export/leads" className="btn btn-s btn-ink">
          Download CSV
        </a>
      </div>
      <p className="mt-2 text-small text-ink-2">“Pack” got a free starter pack. “Interest” asked to hear when a coming-soon pack is ready.</p>
      <table className="mt-6 w-full border-collapse text-left text-small">
        <thead>
          <tr className="border-b border-ink text-ink-2">
            <th className="py-2 pr-4 font-[500]">Email</th>
            <th className="py-2 pr-4 font-[500]">Kind</th>
            <th className="py-2 pr-4 font-[500]">Persona</th>
            <th className="py-2 pr-4 font-[500]">Came from</th>
            <th className="py-2 font-[500]">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.email}-${r.kind}-${r.persona}`} className="border-b border-rule">
              <td className="py-3 pr-4">{r.email}</td>
              <td className="py-3 pr-4">{r.kind}</td>
              <td className="py-3 pr-4">{r.persona}</td>
              <td className="py-3 pr-4 text-ink-2">{r.utm || "direct"}</td>
              <td className="py-3 whitespace-nowrap text-ink-2">{new Date(r.created_at).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="mt-6 text-small text-ink-2">No sign-ups yet. They appear here as soon as someone unlocks a pack.</p>}
    </section>
  );
}
