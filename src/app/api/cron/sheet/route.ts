import { revalidateTag } from "next/cache";
import { syncSheet } from "@/lib/sheet/sync";

export const maxDuration = 300;

/** Hourly (vercel.json): mirror Lomax's sheet into the library. The first runs work through the backlog. */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // ?budget=<seconds> keeps a manual run short; the cron uses the full 240
  const budget = Number(new URL(request.url).searchParams.get("budget"));
  const result = await syncSheet({ budgetMs: (budget > 0 ? Math.min(budget, 240) : 240) * 1000 });
  if (result.libraryChanged) revalidateTag("library", "max");
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
