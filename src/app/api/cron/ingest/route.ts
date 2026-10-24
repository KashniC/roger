import { revalidateTag } from "next/cache";
import { ingest } from "@/lib/ingest/run";

export const maxDuration = 300;

/** Daily (vercel.json): pull new posts, keep the real use cases, refresh the library. */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await ingest();
  if (result.accepted > 0) revalidateTag("library", "max");
  return Response.json(result);
}
