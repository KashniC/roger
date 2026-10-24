/**
 * Where raw posts come from. Each source is switched on by its own key, so the
 * daily job uses whatever is configured:
 *   X_BEARER_TOKEN  → X API v2 recent search (the main feed: Muse, Grok Bot, Hark, Poke…)
 *   XAI_API_KEY     → Grok with X search, as a second way into X
 *   (always on)     → Hacker News, via the free Algolia API
 * Keys come from Vercel or from /admin → Connections. Posts can also be pushed
 * in by Peter's own agent through /api/push.
 */
import { getSecret } from "../secrets";

export type RawPost = { source: string; externalId: string; url: string; author: string; handle: string; text: string; postedAt: string | null };

const AGENTS = ["Grok Bot", "Muse", "Hark", "Poke", "OpenClaw", "ChatGPT agent", "Claude"];

/** Phrases people use when they describe something their agent actually did. */
const DID_IT = ["my agent", "my assistant", "my AI", "had it", "set it up", "it booked", "it found", "every morning", "automatically"];

export async function fromX(sinceHours = 26): Promise<RawPost[]> {
  const token = await getSecret("X_BEARER_TOKEN");
  if (!token) return [];
  const start = new Date(Date.now() - sinceHours * 3600_000).toISOString();
  const queries = [
    `(${AGENTS.slice(0, 5).map((a) => `"${a}"`).join(" OR ")}) ("my agent" OR "my assistant" OR "set up" OR "every morning" OR "saved me") -is:retweet -is:reply lang:en`,
    `("my AI agent" OR "my AI assistant" OR "my personal agent") (booked OR found OR saved OR automated OR "every morning") -is:retweet lang:en`,
  ];
  const out: RawPost[] = [];
  for (const q of queries) {
    const url = new URL("https://api.x.com/2/tweets/search/recent");
    url.searchParams.set("query", q);
    url.searchParams.set("max_results", "100");
    url.searchParams.set("start_time", start);
    url.searchParams.set("tweet.fields", "created_at,author_id,lang");
    url.searchParams.set("expansions", "author_id");
    url.searchParams.set("user.fields", "username,name");
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`X search ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const body = (await res.json()) as {
      data?: { id: string; text: string; author_id: string; created_at: string }[];
      includes?: { users?: { id: string; username: string; name: string }[] };
    };
    const users = new Map((body.includes?.users ?? []).map((u) => [u.id, u]));
    for (const t of body.data ?? []) {
      const u = users.get(t.author_id);
      if (!u) continue;
      out.push({ source: "x", externalId: t.id, url: `https://x.com/${u.username}/status/${t.id}`, author: u.name, handle: `@${u.username}`, text: t.text, postedAt: t.created_at });
    }
  }
  return out;
}

/** Grok's X search, asked for posts as JSON. Used when there is an xAI key but no X token. */
export async function fromGrok(): Promise<RawPost[]> {
  const key = await getSecret("XAI_API_KEY");
  if (!key) return [];
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: "grok-4",
      tools: [{ type: "x_search" }],
      input: [
        {
          role: "user",
          content: `Search X for posts from the last 24 hours where a person describes a concrete thing their personal AI agent or assistant (${AGENTS.join(", ")}) did for them. Return only JSON: {"posts":[{"url":"https://x.com/<user>/status/<id>","handle":"@user","author":"Name","text":"the post text","posted_at":"ISO date"}]}. Up to 40 posts. No commentary.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Grok search ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const body = await res.json();
  const text: string =
    body.output_text ??
    (body.output ?? [])
      .flatMap((o: { content?: { text?: string }[] }) => o.content ?? [])
      .map((c: { text?: string }) => c.text ?? "")
      .join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const parsed = JSON.parse(json || "{}") as { posts?: { url: string; handle: string; author: string; text: string; posted_at?: string }[] };
  return (parsed.posts ?? [])
    .filter((p) => /^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+/.test(p.url))
    .map((p) => ({ source: "x", externalId: p.url.match(/status\/(\d+)/)![1], url: p.url.replace("twitter.com", "x.com"), author: p.author ?? "", handle: p.handle ?? "", text: p.text, postedAt: p.posted_at ?? null }));
}

/** HN is mostly developers; drop posts about building software before the model sees them. */
const DEV = /\b(docker|kubernetes|k8s|github|repo|pull request|deploy|terraform|codebase|refactor|api key|cli|ide|cursor|claude code|codex|copilot|typescript|python|rust|server|devops|homelab|minecraft)\b/i;

export async function fromHackerNews(sinceHours = 26): Promise<RawPost[]> {
  const since = Math.floor((Date.now() - sinceHours * 3600_000) / 1000);
  const queries = ["my AI agent", "my AI assistant", "my agent booked", "personal agent automated", "my assistant every morning"];
  const out: RawPost[] = [];
  for (const q of queries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=(story,comment)&numericFilters=created_at_i>${since}&hitsPerPage=30`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const body = (await res.json()) as { hits: { objectID: string; author: string; comment_text?: string; story_text?: string; title?: string; created_at: string }[] };
    for (const h of body.hits) {
      const text = stripHtml(h.comment_text || h.story_text || h.title || "");
      if (text.length < 60 || DEV.test(text) || !DID_IT.some((p) => text.toLowerCase().includes(p.toLowerCase()))) continue;
      out.push({ source: "hn", externalId: h.objectID, url: `https://news.ycombinator.com/item?id=${h.objectID}`, author: h.author, handle: h.author, text: text.slice(0, 2000), postedAt: h.created_at });
    }
  }
  return out;
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * One X post by its link, through the free fxtwitter API (no key). Lets a bot
 * push bare links: we fetch the words and the author ourselves.
 */
export async function fromXLink(link: string): Promise<RawPost | null> {
  const m = link.match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([^/?#]+)\/status\/(\d+)/i);
  if (!m) return null;
  const res = await fetch(`https://api.fxtwitter.com/${m[1]}/status/${m[2]}`, { headers: { "user-agent": "RogerLibrary/1.0" } });
  if (!res.ok) return null;
  const body = (await res.json()) as { tweet?: { id: string; text: string; created_timestamp?: number; author: { screen_name: string; name: string } } };
  const t = body.tweet;
  if (!t?.text) return null;
  return {
    source: "x",
    externalId: t.id,
    url: `https://x.com/${t.author.screen_name}/status/${t.id}`,
    author: t.author.name,
    handle: `@${t.author.screen_name}`,
    text: t.text.slice(0, 2000),
    postedAt: t.created_timestamp ? new Date(t.created_timestamp * 1000).toISOString() : null,
  };
}
