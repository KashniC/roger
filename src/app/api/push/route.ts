import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { ingestPushed } from "@/lib/ingest/run";
import { fromXLink, type RawPost } from "@/lib/ingest/sources";
import { getSecret } from "@/lib/secrets";

export const maxDuration = 300;

const MAX = 25;

type Item = { url?: string; text?: string; author?: string; handle?: string; posted_at?: string };

async function authorized(request: Request, url: URL) {
  const expected = await getSecret("PUSH_TOKEN");
  if (!expected) return false;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-roger-token") ?? url.searchParams.get("key") ?? "";
  const a = Buffer.from(given.trim());
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Accepts {posts:[…]}, {urls:[…]}, a single {url,text}, an array, or plain text with links in it. */
async function readItems(request: Request): Promise<Item[]> {
  const raw = await request.text();
  try {
    const body = JSON.parse(raw);
    if (Array.isArray(body)) return body.map((x) => (typeof x === "string" ? { url: x } : x));
    if (Array.isArray(body.posts)) return body.posts;
    if (Array.isArray(body.urls)) return body.urls.map((u: string) => ({ url: u }));
    if (body.url) return [body];
  } catch {}
  return (raw.match(/https?:\/\/[^\s"'<>)\]]+/g) ?? []).map((u) => ({ url: u }));
}

/**
 * Turns what a bot sent into posts. X links are always looked up, so a link
 * the bot made up never reaches the library; other links need their words.
 */
async function toPosts(items: Item[]) {
  const posts: RawPost[] = [];
  const skipped: { url: string; why: string }[] = [];
  for (const it of items.slice(0, MAX)) {
    const link = typeof it.url === "string" ? it.url.trim() : "";
    if (!/^https?:\/\//.test(link)) {
      skipped.push({ url: link, why: "not a link" });
      continue;
    }
    if (/^https?:\/\/(www\.|mobile\.)?(x|twitter)\.com\//i.test(link)) {
      const p = await fromXLink(link).catch(() => null);
      if (p) posts.push(p);
      else skipped.push({ url: link, why: "couldn’t open that X post" });
      continue;
    }
    const text = typeof it.text === "string" ? it.text.trim() : "";
    if (text.length < 40) {
      skipped.push({ url: link, why: "send the post’s words in “text” for links outside X" });
      continue;
    }
    posts.push({
      source: "push",
      externalId: createHash("sha1").update(link).digest("hex").slice(0, 16),
      url: link,
      author: String(it.author ?? "").slice(0, 80),
      handle: String(it.handle ?? it.author ?? "").slice(0, 60),
      text: text.slice(0, 2000),
      postedAt: it.posted_at && !Number.isNaN(Date.parse(it.posted_at)) ? new Date(it.posted_at).toISOString() : null,
    });
  }
  if (items.length > MAX) skipped.push({ url: "", why: `only the first ${MAX} links are read per call` });
  return { posts, skipped };
}

async function handle(request: Request, items: Item[]) {
  const { posts, skipped } = await toPosts(items);
  if (!posts.length) return Response.json({ received: items.length, added: 0, skipped }, { status: items.length ? 200 : 400 });
  const r = await ingestPushed(posts, request.headers.get("user-agent")?.slice(0, 40) || "bot");
  if (r.accepted > 0) revalidateTag("library", "max");
  return Response.json({ received: items.length, new: r.fresh, added: r.accepted, alreadySeen: posts.length - r.fresh, skipped });
}

/** POST /api/push with "Authorization: Bearer <token>" and the posts in the body. */
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (!(await authorized(request, url))) return Response.json({ error: "Wrong or missing token." }, { status: 401 });
  return handle(request, await readItems(request));
}

/** For agents that can only open a link: GET /api/push?key=<token>&url=<post>&url=<post>… */
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!(await authorized(request, url))) return Response.json({ error: "Wrong or missing token." }, { status: 401 });
  const items = url.searchParams.getAll("url").map((u) => ({ url: u }));
  if (!items.length) return Response.json({ ok: true, hint: "Add &url=<link to a post> (repeat for more)." });
  return handle(request, items);
}
