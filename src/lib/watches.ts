import { randomBytes } from "node:crypto";
import { sql } from "./db";
import { esc, sendEmail, siteUrl } from "./email";

export type WatchMatch = { id: string; title: string; summary: string; url: string; handle: string; tool: string };

export async function createWatch(email: string, query: string) {
  const token = randomBytes(18).toString("base64url");
  await sql`insert into watches (email, query, token) values (${email}, ${query}, ${token})`;
  const confirm = siteUrl(`/watch/confirm?t=${token}`);
  const mail = await sendEmail({
    to: email,
    subject: `Confirm your watch: ${query}`,
    text: `You asked Roger to tell you when someone's AI agent can do this:\n\n  ${query}\n\nConfirm: ${confirm}\n\nIf you didn't ask, ignore this email.`,
    html: `<p>You asked Roger to tell you when someone’s AI agent can do this:</p><p><strong>${esc(query)}</strong></p><p><a href="${confirm}">Confirm the watch</a></p><p style="color:#666">If you didn’t ask, ignore this email.</p>`,
  });
  return { token, emailed: mail.sent };
}

export async function confirmWatch(token: string) {
  const rows = (await sql`update watches set confirmed_at = coalesce(confirmed_at, now()), last_checked_at = now() where token = ${token} and unsubscribed_at is null returning query`) as { query: string }[];
  return rows[0]?.query ?? null;
}

export async function stopWatch(token: string) {
  const rows = (await sql`update watches set unsubscribed_at = now() where token = ${token} returning query`) as { query: string }[];
  return rows[0]?.query ?? null;
}

/** Use cases that match a watch's words. Postgres full-text search, any-word if the exact phrase finds nothing. */
export async function matchesFor(query: string, since?: Date, limit = 12): Promise<WatchMatch[]> {
  const after = since ?? new Date(0);
  let rows = (await sql`
    select id, title, summary, url, handle, tool from use_cases
    where search @@ websearch_to_tsquery('english', ${query}) and created_at > ${after.toISOString()}
    order by created_at desc limit ${limit}`) as WatchMatch[];
  if (!rows.length) {
    const words = query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
    if (words.length) {
      rows = (await sql`
        select id, title, summary, url, handle, tool from use_cases
        where search @@ to_tsquery('english', ${words.join(" | ")}) and created_at > ${after.toISOString()}
        order by ts_rank(search, to_tsquery('english', ${words.join(" | ")})) desc limit ${limit}`) as WatchMatch[];
    }
  }
  return rows;
}

/** The daily digest: each confirmed watch gets the new use cases that match it, once. */
export async function sendWatchDigests() {
  const watches = (await sql`select id, email, query, token, last_checked_at from watches where confirmed_at is not null and unsubscribed_at is null`) as {
    id: string;
    email: string;
    query: string;
    token: string;
    last_checked_at: string;
  }[];
  let sent = 0;
  for (const w of watches) {
    const found = await matchesFor(w.query, new Date(w.last_checked_at));
    const already = new Set(((await sql`select use_case_id from watch_hits where watch_id = ${w.id}`) as { use_case_id: string }[]).map((r) => r.use_case_id));
    const fresh = found.filter((m) => !already.has(m.id));
    await sql`update watches set last_checked_at = now() where id = ${w.id}`;
    if (!fresh.length) continue;
    const stop = siteUrl(`/watch/stop?t=${w.token}`);
    const mail = await sendEmail({
      to: w.email,
      subject: `Someone’s agent did it: ${fresh[0].title}`,
      text: `New for your watch “${w.query}”:\n\n${fresh.map((m) => `• ${m.title}\n  ${m.summary}\n  ${m.url}`).join("\n\n")}\n\nWant it set up for you? ${siteUrl("/setup")}\nStop this watch: ${stop}`,
      html: `<p>New for your watch <strong>“${esc(w.query)}”</strong>:</p>${fresh
        .map((m) => `<p><strong>${esc(m.title)}</strong><br>${esc(m.summary)}<br><a href="${m.url}">${esc(m.handle)} on the original post</a></p>`)
        .join("")}<p><a href="${siteUrl("/setup")}">Want it set up for you?</a></p><p style="color:#666"><a href="${stop}">Stop this watch</a></p>`,
    });
    if (mail.sent) {
      for (const m of fresh) await sql`insert into watch_hits (watch_id, use_case_id) values (${w.id}, ${m.id}) on conflict do nothing`;
      sent++;
    }
  }
  return { watches: watches.length, sent };
}
