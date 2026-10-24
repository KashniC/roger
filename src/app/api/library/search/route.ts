import { categories, type UseCaseCategory } from "@/data/library";
import { hasDb, sql } from "@/lib/db";
import { getUseCases } from "@/lib/library-source";

const LIMIT = 5;

type Hit = { id: string; title: string; summary: string; category: UseCaseCategory; tool: string; handle: string; url: string };

/** "gift ca" → gift:* & ca:*, so results follow the typing. Only letters and digits reach the query. */
function prefixQuery(q: string) {
  const words = q.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return words
    .slice(0, 8)
    .map((w) => `${w}:*`)
    .join(" & ");
}

/**
 * The home page's live search: the newest few use cases matching what's been
 * typed so far, and how many match in all. The library is thousands of rows,
 * so the search runs here rather than in the browser.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 120);
  const catParam = url.searchParams.get("cat");
  const cat = categories.some((c) => c.id === catParam) ? catParam : null;
  const tsq = prefixQuery(q);

  if (!hasDb()) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const all = (await getUseCases()).filter((u) => (!cat || u.category === cat) && words.every((w) => `${u.title} ${u.summary} ${u.tool}`.toLowerCase().includes(w)));
    return Response.json({ total: all.length, items: all.slice(0, LIMIT).map(({ id, title, summary, category, tool, handle, url }) => ({ id, title, summary, category, tool, handle, url })) });
  }

  const [rows, [count]] = (await Promise.all([
    sql`select id, title, summary, category, tool, handle, url from use_cases
        where (${cat}::text is null or category = ${cat})
          and (${tsq} = '' or numnode(to_tsquery('english', ${tsq})) = 0 or search @@ to_tsquery('english', ${tsq}))
        order by created_at desc limit ${LIMIT}`,
    sql`select count(*)::int as n from use_cases
        where (${cat}::text is null or category = ${cat})
          and (${tsq} = '' or numnode(to_tsquery('english', ${tsq})) = 0 or search @@ to_tsquery('english', ${tsq}))`,
  ])) as [Hit[], { n: number }[]];

  return Response.json({ total: count.n, items: rows }, { headers: { "cache-control": "public, max-age=60, s-maxage=300" } });
}
