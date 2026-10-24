import { sql } from "../db";
import { extract } from "./extract";
import { fromGrok, fromHackerNews, fromX, type RawPost } from "./sources";

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/**
 * Store posts we haven't seen, have the model judge and rewrite them, and add
 * the real use cases to the library. Shared by the daily job and /api/push.
 */
export async function addPosts(posts: RawPost[], notes: string[]) {
  // only posts we haven't stored before
  const fresh: RawPost[] = [];
  for (const p of posts) {
    const rows = (await sql`
      insert into raw_posts (source, external_id, url, author, handle, text, posted_at)
      values (${p.source}, ${p.externalId}, ${p.url}, ${p.author}, ${p.handle}, ${p.text}, ${p.postedAt})
      on conflict do nothing returning external_id`) as unknown[];
    if (rows.length) fresh.push(p);
  }

  let accepted = 0;
  for (let i = 0; i < fresh.length; i += 15) {
    const batch = fresh.slice(i, i + 15);
    try {
      const verdicts = await extract(batch);
      for (const v of verdicts) {
        const post = batch.find((p) => p.externalId === v.externalId);
        if (!post) continue;
        if (!v.isUseCase) {
          await sql`update raw_posts set status = 'rejected', reason = ${v.reason} where source = ${post.source} and external_id = ${post.externalId}`;
          continue;
        }
        const id = `${slug(v.title)}-${post.externalId.slice(-6)}`;
        const added = (await sql`
          insert into use_cases (id, title, summary, category, persona, for_, tool, handle, author, url, source, outcome, posted_at, week_of)
          values (${id}, ${v.title}, ${v.summary}, ${v.category}, ${v.persona}, ${v.forHome ? "home" : "work"}, ${v.tool}, ${post.handle}, ${post.author},
                  ${post.url}, ${post.source}, ${v.outcome}, ${post.postedAt}, coalesce(${post.postedAt}::timestamptz, now())::date)
          on conflict (url) do nothing returning id`) as unknown[];
        await sql`update raw_posts set status = 'accepted', reason = ${v.reason} where source = ${post.source} and external_id = ${post.externalId}`;
        if (added.length) accepted++;
      }
    } catch (e) {
      notes.push(`extract failed: ${(e as Error).message.slice(0, 120)}`);
      for (const p of batch) await sql`update raw_posts set status = 'error' where source = ${p.source} and external_id = ${p.externalId} and status = 'pending'`;
    }
  }
  return { fresh: fresh.length, accepted };
}

/**
 * The daily job: fetch new posts from every configured source, keep the ones
 * we haven't seen, have the model judge and rewrite them, and add the real use
 * cases to the library. Returns what happened, for the run log.
 */
export async function ingest() {
  const [run] = (await sql`insert into ingest_runs default values returning id`) as { id: number }[];
  const notes: string[] = [];
  const fetched: RawPost[] = [];

  for (const [name, fn] of [
    ["x", fromX],
    ["grok", fromGrok],
    ["hn", fromHackerNews],
  ] as const) {
    try {
      const posts = await fn();
      fetched.push(...posts);
      notes.push(`${name}: ${posts.length}`);
    } catch (e) {
      notes.push(`${name} failed: ${(e as Error).message.slice(0, 120)}`);
    }
  }

  const { fresh, accepted } = await addPosts(fetched, notes);

  await sql`update ingest_runs set finished_at = now(), fetched = ${fresh}, accepted = ${accepted}, notes = ${notes.join("; ")} where id = ${run.id}`;
  return { fetched: fetched.length, fresh, accepted, notes };
}

/** Posts pushed in by Peter's own agent. Logged as a run so they show in /admin. */
export async function ingestPushed(posts: RawPost[], from: string) {
  const [run] = (await sql`insert into ingest_runs default values returning id`) as { id: number }[];
  const notes = [`push (${from}): ${posts.length}`];
  const { fresh, accepted } = await addPosts(posts, notes);
  await sql`update ingest_runs set finished_at = now(), fetched = ${fresh}, accepted = ${accepted}, notes = ${notes.join("; ")} where id = ${run.id}`;
  return { fresh, accepted, notes };
}
