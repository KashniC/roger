import { sendWatchDigests } from "@/lib/watches";

export const maxDuration = 300;

/** Daily, after the ingest: email each confirmed watch the new use cases that match it. */
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(await sendWatchDigests());
}
