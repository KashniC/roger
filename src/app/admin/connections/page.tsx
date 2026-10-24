import { connection } from "next/server";
import { headers } from "next/headers";
import { removeSecretAction, rotatePushToken } from "@/app/admin/actions";
import { SecretForm } from "@/components/admin-ui";
import { CopyPrompt } from "@/components/pack-gate";
import { sql } from "@/lib/db";
import { getSecret, secretStatus } from "@/lib/secrets";

const card = "rounded-[var(--radius-object)] border border-rule bg-surface p-6 sm:p-8";
const code = "mt-2 overflow-x-auto whitespace-pre-wrap [overflow-wrap:anywhere] rounded-[var(--radius-inner)] bg-ground-2 p-4 font-mono text-meta";

function botPrompt(endpoint: string, token: string) {
  return `Every morning at 7am, search X for posts from the last 24 hours where a real person describes something specific their personal AI agent or assistant did for them (Muse, Grok Bot, Hark, Poke, ChatGPT agent, Claude or similar): money saved, errands done, inboxes cleared, family logistics, small-business chores. Skip coding, developer tools, announcements, ads and threads selling a course.

Pick up to 25 of the best. Then send their links in one request:

POST ${endpoint}
Authorization: Bearer ${token}
Content-Type: application/json

{"urls": ["https://x.com/…/status/…", "…"]}

If you can only open links, open this once per post instead:
${endpoint}?key=${token}&url=<the post's link>

Reply with how many it added.`;
}

export default async function AdminConnections() {
  await connection();
  const [keys, token, rows] = await Promise.all([
    secretStatus(),
    getSecret("PUSH_TOKEN"),
    sql`select started_at, fetched, accepted from ingest_runs where notes like 'push%' order by started_at desc limit 8`,
  ]);
  const pushes = rows as { started_at: string; fetched: number; accepted: number }[];
  // The address this admin is open on, so the bot posts to the site that's live (not a domain still pointing elsewhere).
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const endpoint = `${host?.startsWith("localhost") ? "http" : "https"}://${host}/api/push`;
  const apiKeys = keys.filter((k) => k.name !== "PUSH_TOKEN");
  const curl = `curl -X POST ${endpoint} \\\n  -H "Authorization: Bearer ${token || "<token>"}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"urls":["https://x.com/someone/status/123"]}'`;

  return (
    <div className="max-w-[52rem] space-y-10">
      <section>
        <h1 className="text-h3">Connections</h1>
        <p className="mt-2 text-small text-ink-2">Where new use cases come from, and the keys that switch each source on. Keys are stored encrypted and never shown again; a key set in Vercel always wins.</p>
      </section>

      <section aria-labelledby="bot-title" className={card}>
        <h2 id="bot-title" className="text-title">
          Let your own agent add posts
        </h2>
        <p className="mt-2 text-small text-ink-2">
          Give Grok Bot (or any agent that can browse X) the prompt below. It finds posts each morning and sends the links here. The site opens every X link itself, so a made-up link never gets in, then judges and rewrites each post like the daily intake does. No X key needed.
        </p>
        {token ? (
          <>
            <div className="mt-6 grid gap-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-meta font-[600] text-ink-2">Prompt for your agent</p>
                  <CopyPrompt text={botPrompt(endpoint, token)} />
                </div>
                <p className="mt-2 whitespace-pre-wrap rounded-[var(--radius-inner)] bg-ground-2 p-4 text-small [overflow-wrap:anywhere]">{botPrompt(endpoint, token)}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-meta font-[600] text-ink-2">Webhook</p>
                    <CopyPrompt text={endpoint} label="Copy" />
                  </div>
                  <pre className={code}>{endpoint}</pre>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-meta font-[600] text-ink-2">Token</p>
                    <CopyPrompt text={token} label="Copy" />
                  </div>
                  <pre className={code}>{token}</pre>
                </div>
              </div>
              <details>
                <summary className="cursor-pointer text-small font-[560]">For developers: test it from a terminal</summary>
                <pre className={code}>{curl}</pre>
                <p className="mt-2 text-meta text-ink-2">
                  Also accepted: {"{"}&quot;posts&quot;:[{"{"}&quot;url&quot;,&quot;text&quot;,&quot;handle&quot;{"}"}]{"}"} for links outside X (send the post’s words in text), or plain text with links in it. Up to 25 per call.
                </p>
              </details>
            </div>
            <form action={rotatePushToken} className="mt-6 flex flex-wrap items-center gap-3 border-t border-rule pt-5">
              <button type="submit" className="min-h-11 rounded-full border border-rule-strong px-5 text-small font-[560] hover:border-ink">
                Make a new token
              </button>
              <p className="text-meta text-ink-2">The old one stops working at once. Update your agent’s prompt after.</p>
            </form>
          </>
        ) : (
          <form action={rotatePushToken} className="mt-6">
            <button type="submit" className="btn btn-m btn-ink">
              Switch on the webhook
            </button>
          </form>
        )}

        {pushes.length > 0 && (
          <table className="mt-8 w-full border-collapse text-left text-small">
            <caption className="mb-2 text-left text-meta font-[600] text-ink-2">Recent pushes</caption>
            <thead>
              <tr className="border-b border-ink text-ink-2">
                <th className="py-2 pr-4 font-[500]">When</th>
                <th className="py-2 pr-4 text-right font-[500]">New</th>
                <th className="py-2 text-right font-[500]">Added</th>
              </tr>
            </thead>
            <tbody>
              {pushes.map((r) => (
                <tr key={r.started_at} className="border-b border-rule">
                  <td className="py-2 pr-4">{new Date(r.started_at).toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{r.fetched}</td>
                  <td className="py-2 text-right tabular-nums">{r.accepted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section aria-labelledby="keys-title" className={card}>
        <h2 id="keys-title" className="text-title">
          API keys
        </h2>
        <p className="mt-2 text-small text-ink-2">Each one is optional. With none, the library still grows from Hacker News and from your agent’s pushes.</p>
        <ul className="mt-2 divide-y divide-rule">
          {apiKeys.map((k) => (
            <li key={k.name} className="py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-small font-[620]">{k.label}</h3>
                <p className={`text-meta font-[560] ${k.from ? "text-ink" : "text-ink-2"}`}>
                  {k.from === "vercel" ? `Set in Vercel ${k.hint}` : k.from === "admin" ? `Saved ${k.hint}` : "Not set"}
                </p>
              </div>
              <p className="mt-1 text-meta text-ink-2">{k.help}</p>
              {k.from === "vercel" ? (
                <p className="mt-3 text-meta text-ink-2">To change it, edit {k.name} in the Vercel project settings.</p>
              ) : (
                <>
                  <SecretForm name={k.name} label={k.label} set={k.from === "admin"} />
                  {k.from === "admin" && (
                    <form action={removeSecretAction} className="mt-2">
                      <input type="hidden" name="name" value={k.name} />
                      <button type="submit" className="inline-block py-1 text-meta text-ink-2 underline underline-offset-2 hover:text-ink">
                        Remove this key
                      </button>
                    </form>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
