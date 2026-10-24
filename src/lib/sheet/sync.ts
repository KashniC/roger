import { categories, type UseCaseCategory } from "@/data/library";
import { sql } from "../db";
import { readSheet, type SheetRow } from "./read";
import { rewrite, type ToRewrite } from "./rewrite";

/** Tags that become library entries; everything else stays in the sheet. */
const LIBRARY_TAGS: Record<string, "win" | "honest-miss"> = { "USE CASE": "win", CAUTION: "honest-miss" };

const BATCH = 20;
const PARALLEL = 4;

type Tracked = {
  post_id: string;
  url: string;
  tab: string;
  category: string | null;
  tag: string;
  handle: string;
  agent: string;
  summary: string;
  posted_at: string | null;
  likes: number | null;
  views: number | null;
  reposts: number | null;
  used_in_post: string;
  state: "pending" | "live" | "excluded" | "hidden" | "error";
  use_case_id: string | null;
};

const eligible = (r: { category: string | null; tag: string }) => Boolean(r.category && LIBRARY_TAGS[r.tag]);
const forOf = (c: string) => categories.find((x) => x.id === c)?.for ?? "work";

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function toTracked(r: SheetRow, state: Tracked["state"], useCaseId: string | null): Tracked {
  return {
    post_id: r.postId,
    url: r.url,
    tab: r.tab,
    category: r.category,
    tag: r.tag,
    handle: r.handle,
    agent: r.agent,
    summary: r.summary,
    posted_at: r.postedAt,
    likes: r.likes,
    views: r.views,
    reposts: r.reposts,
    used_in_post: r.usedInPost,
    state,
    use_case_id: useCaseId,
  };
}

const same = (a: Tracked, b: Tracked) =>
  (Object.keys(b) as (keyof Tracked)[]).every((k) => (k === "posted_at" ? (a[k] ? new Date(a[k]!).toISOString() : null) === b[k] : a[k] === b[k]));

/** Upserts in chunks, one round trip each. */
async function save(rows: Tracked[]) {
  for (let i = 0; i < rows.length; i += 400) {
    await sql.query(
      `insert into sheet_posts (post_id, url, tab, category, tag, handle, agent, summary, posted_at, likes, views, reposts, used_in_post, state, use_case_id)
       select post_id, url, tab, category, tag, handle, agent, summary, posted_at, likes, views, reposts, used_in_post, state, use_case_id
       from json_populate_recordset(null::sheet_posts, $1::json)
       on conflict (post_id) do update set url = excluded.url, tab = excluded.tab, category = excluded.category, tag = excluded.tag,
         handle = excluded.handle, agent = excluded.agent, summary = excluded.summary, posted_at = excluded.posted_at, likes = excluded.likes,
         views = excluded.views, reposts = excluded.reposts, used_in_post = excluded.used_in_post, state = excluded.state,
         use_case_id = excluded.use_case_id, error = null, updated_at = now()`,
      [JSON.stringify(rows.slice(i, i + 400))],
    );
  }
}

/**
 * Brings sheet_posts (and the library entries it owns) in line with the
 * sheet. Cheap: one read of everything, then only changed rows are written.
 */
async function reconcile(sheet: SheetRow[], notes: string[]) {
  // an entry deleted in /admin stays deleted
  await sql`update sheet_posts sp set state = 'hidden', use_case_id = null where sp.state = 'live'
            and not exists (select 1 from use_cases u where u.id = sp.use_case_id)`;

  const tracked = new Map(((await sql`select * from sheet_posts`) as Tracked[]).map((t) => [t.post_id, t]));
  const writes: Tracked[] = [];
  const unlist: string[] = [];
  const moves: { id: string; category: string; outcome: string }[] = [];
  let added = 0;

  for (const r of sheet) {
    const t = tracked.get(r.postId);
    tracked.delete(r.postId);
    const ok = eligible(r);
    if (!t) {
      writes.push(toTracked(r, ok ? "pending" : "excluded", null));
      if (ok) added++;
      continue;
    }
    let state = t.state;
    let useCaseId = t.use_case_id;
    if (state === "hidden") {
      // leave it alone
    } else if (!ok) {
      if (useCaseId) unlist.push(useCaseId);
      state = "excluded";
      useCaseId = null;
    } else if (state === "excluded" || state === "error" || (state === "live" && t.summary !== r.summary)) {
      state = "pending";
    } else if (state === "live" && useCaseId && (t.category !== r.category || t.tag !== r.tag)) {
      moves.push({ id: useCaseId, category: r.category!, outcome: LIBRARY_TAGS[r.tag] });
    }
    const next = toTracked(r, state, useCaseId);
    if (!same(t, next)) writes.push(next);
  }

  // whatever's left is gone from the sheet
  const gone = [...tracked.values()];
  const live = [...tracked.values()].filter((t) => t.state === "live" && t.use_case_id).map((t) => t.use_case_id!);
  const eligibleBefore = (await sql`select count(*)::int as n from sheet_posts where state <> 'excluded'`) as { n: number }[];
  const eligibleNow = sheet.filter(eligible).length;
  const tooMany = eligibleBefore[0].n > 50 && eligibleNow < eligibleBefore[0].n * 0.8;
  if (tooMany && gone.length) {
    notes.push(`sheet has ${eligibleNow} library rows vs ${eligibleBefore[0].n} before, so ${gone.length} missing row(s) were kept, not removed`);
  } else if (gone.length) {
    unlist.push(...live);
    await sql.query(`delete from sheet_posts where post_id = any($1)`, [gone.map((t) => t.post_id)]);
  }

  await save(writes);
  for (const m of moves) {
    await sql`update use_cases set category = ${m.category}, for_ = ${forOf(m.category)}, outcome = ${m.outcome} where id = ${m.id} and source = 'sheet'`;
  }
  if (unlist.length) await sql.query(`delete from use_cases where id = any($1) and source = 'sheet'`, [unlist]);

  return { added, removed: unlist.length, moved: moves.length, changed: writes.length };
}

/** Writes the AI's words for pending rows into the library, until the time budget runs out. */
async function rewritePending(deadline: number, notes: string[]) {
  const pending = (await sql`select * from sheet_posts where state = 'pending' order by posted_at desc nulls last`) as Tracked[];
  const batches: Tracked[][] = [];
  for (let i = 0; i < pending.length; i += BATCH) batches.push(pending.slice(i, i + BATCH));

  let written = 0;
  let failed = 0;
  let next = 0;
  let stop = false; // one failure ends the run; the rest wait for the next hour
  async function worker() {
    while (!stop && next < batches.length && Date.now() < deadline) {
      const batch = batches[next++];
      try {
        const out = await rewrite(
          batch.map<ToRewrite>((t) => ({ postId: t.post_id, category: t.category as UseCaseCategory, miss: t.tag === "CAUTION", handle: t.handle, agent: t.agent, summary: t.summary })),
        );
        for (const e of out) {
          const t = batch.find((b) => b.post_id === e.postId);
          if (!t || !t.category) continue;
          if (t.use_case_id) {
            // already in the library: the sheet's note changed, so refresh the words in place
            await sql`update use_cases set title = ${e.title.slice(0, 80)}, summary = ${e.summary.slice(0, 300)}, category = ${t.category}, persona = ${e.persona},
                      for_ = ${forOf(t.category)}, tool = ${e.tool.slice(0, 40)}, handle = ${t.handle}, outcome = ${LIBRARY_TAGS[t.tag]} where id = ${t.use_case_id}`;
            await sql`update sheet_posts set state = 'live', error = null, updated_at = now() where post_id = ${t.post_id}`;
            written++;
            continue;
          }
          const id = `${slug(e.title)}-${t.post_id.slice(-6)}`;
          const [row] = (await sql`
            insert into use_cases (id, title, summary, category, persona, for_, tool, handle, url, source, outcome, posted_at, week_of)
            values (${id}, ${e.title.slice(0, 80)}, ${e.summary.slice(0, 300)}, ${t.category}, ${e.persona}, ${forOf(t.category)}, ${e.tool.slice(0, 40)},
                    ${t.handle}, ${t.url}, 'sheet', ${LIBRARY_TAGS[t.tag]}, ${t.posted_at}, coalesce(${t.posted_at}::timestamptz, now())::date)
            on conflict (url) do update set title = excluded.title, summary = excluded.summary, category = excluded.category, persona = excluded.persona,
              for_ = excluded.for_, tool = excluded.tool, handle = excluded.handle, source = 'sheet', outcome = excluded.outcome
            returning id`) as { id: string }[];
          await sql`update sheet_posts set state = 'live', use_case_id = ${row.id}, error = null, updated_at = now() where post_id = ${t.post_id}`;
          written++;
        }
      } catch (e) {
        const msg = (e as Error).message.slice(0, 200);
        // a garbled answer only costs this batch; anything else (credits, outage) ends the run
        if (!/no object generated/i.test(msg)) stop = true;
        if (!failed) notes.push(`rewrite failed: ${msg.slice(0, 120)}`);
        failed += batch.length;
        await sql.query(`update sheet_posts set state = 'error', error = $2, updated_at = now() where post_id = any($1) and state = 'pending'`, [batch.map((b) => b.post_id), msg]);
      }
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  const left = pending.length - written - failed;
  return { written, failed, left };
}

/**
 * The hourly job: read the sheet, reconcile, rewrite what's new. Logged in
 * ingest_runs (shown in /admin) whenever something happened.
 */
export async function syncSheet({ budgetMs = 240_000 } = {}) {
  const started = Date.now();
  const notes: string[] = [];
  let read;
  try {
    read = await readSheet();
  } catch (e) {
    const msg = `sheet failed: ${(e as Error).message.slice(0, 200)}`;
    await sql`insert into ingest_runs (finished_at, notes) values (now(), ${msg})`;
    return { ok: false as const, error: msg, libraryChanged: false };
  }
  notes.push(...read.notes);

  const r = await reconcile(read.rows, notes);
  const w = await rewritePending(started + budgetMs, notes);

  const libraryChanged = r.removed + r.moved + w.written > 0;
  const summary = `sheet: ${read.rows.length} rows; ${r.added} new, ${w.written} written, ${r.moved} moved, ${r.removed} removed${w.failed ? `, ${w.failed} failed` : ""}${w.left ? `, ${w.left} waiting for the next run` : ""}`;
  if (libraryChanged || r.added || w.failed || notes.length) {
    await sql`insert into ingest_runs (started_at, finished_at, fetched, accepted, notes)
              values (${new Date(started).toISOString()}, now(), ${r.added}, ${w.written}, ${[summary, ...notes].join("; ")})`;
  }
  return { ok: true as const, rows: read.rows.length, ...r, ...w, notes, libraryChanged };
}
