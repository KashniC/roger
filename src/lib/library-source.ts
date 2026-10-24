import { cacheLife, cacheTag } from "next/cache";
import { seedUseCases, type Persona, type UseCase, type UseCaseCategory } from "@/data/library";
import { hasDb, sql } from "./db";

type Row = {
  id: string;
  title: string;
  summary: string;
  category: UseCaseCategory;
  persona: Persona;
  for_: "home" | "work";
  tool: string;
  handle: string;
  author: string;
  url: string;
  source: string;
  outcome: "win" | "honest-miss" | null;
  featured: boolean;
  week_of: string | Date;
  created_at: string | Date;
};

/**
 * The library, from Postgres (the daily ingest keeps it growing). Cached for an
 * hour and tagged "library" so the ingest job can refresh it the moment new
 * use cases land. Falls back to the seed if the database isn't configured.
 */
export async function getUseCases(): Promise<UseCase[]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 604800 });
  cacheTag("library");

  if (!hasDb()) return sortUseCases(seedUseCases);
  try {
    const rows = (await sql`select id, title, summary, category, persona, for_, tool, handle, author, url, source, outcome, featured, week_of, created_at from use_cases`) as Row[];
    return sortUseCases(
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        category: r.category,
        persona: r.persona,
        for: r.for_,
        tool: r.tool,
        handle: r.handle,
        author: r.author,
        url: r.url,
        source: r.source,
        outcome: r.outcome ?? undefined,
        featured: r.featured,
        weekOf: typeof r.week_of === "string" ? r.week_of.slice(0, 10) : r.week_of.toISOString().slice(0, 10),
        addedAt: new Date(r.created_at).toISOString(),
      })),
    );
  } catch (err) {
    console.error("[library] database unavailable, using seed:", err);
    return sortUseCases(seedUseCases);
  }
}

export function sortUseCases(list: UseCase[]) {
  return [...list].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.weekOf.localeCompare(a.weekOf) || a.title.localeCompare(b.title),
  );
}
