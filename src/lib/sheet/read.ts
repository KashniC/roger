import { createHash } from "node:crypto";
import { categories, type UseCaseCategory } from "@/data/library";

/** Lomax's use-case sheet. Must be shared "anyone with the link can view". */
export const SHEET_ID = process.env.LIBRARY_SHEET_ID || "1DPOUO-25qQs1AFOqgjoxdktx4C-be1lXX1s35JH6zZw";

const COLUMNS = ["Post ID", "Post Date (ET)", "Author", "Summary", "Agent", "Likes", "Views", "Reposts", "Tag", "URL", "Used in Post"] as const;

/** Tab names that don't match a category label word for word. */
const TAB_ALIASES: Record<string, UseCaseCategory> = {
  shopops: "shop-ops",
  solo: "solo",
  kidsgeneral: "kids",
  homeworkandschool: "homework",
};

export type SheetRow = {
  postId: string;
  url: string;
  tab: string;
  category: UseCaseCategory | null;
  tag: string;
  handle: string;
  agent: string;
  summary: string;
  postedAt: string | null;
  likes: number | null;
  views: number | null;
  reposts: number | null;
  usedInPost: string;
};

export type SheetRead = { rows: SheetRow[]; notes: string[] };

const norm = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");

export function categoryForTab(name: string): UseCaseCategory | null {
  const n = norm(name);
  return TAB_ALIASES[n] ?? categories.find((c) => norm(c.label) === n || norm(c.id) === n)?.id ?? null;
}

/** RFC 4180-ish: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

/** "2026-10-04 16:22" in Toronto time → ISO UTC. */
export function etToIso(s: string): string | null {
  const m = s.trim().match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const wall = Date.UTC(+m[1].slice(0, 4), +m[1].slice(5, 7) - 1, +m[1].slice(8, 10), +(m[2] ?? 12), +(m[3] ?? 0));
  if (Number.isNaN(wall)) return null;
  // what Toronto's clock reads at that instant tells us its offset
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(wall))
      .map((p) => [p.type, p.value]),
  );
  const seen = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return new Date(wall + (wall - seen)).toISOString();
}

const num = (s: string | undefined) => {
  const n = parseInt((s ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

async function get(url: string) {
  const res = await fetch(url, { headers: { "user-agent": "RogerLibrary/1.0" }, cache: "no-store", redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok) throw new Error(`${res.status} from Google Sheets${res.status === 401 || res.status === 403 ? " (is the sheet still shared by link?)" : ""}`);
  return { text: await res.text(), type };
}

/** The sheet's tabs, from its public HTML view. */
async function tabs(): Promise<{ name: string; gid: string }[]> {
  const { text } = await get(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`);
  const found = [...text.matchAll(/\{name: "((?:[^"\\]|\\.)*)"[^}]*?gid: "(\d+)"/g)].map((m) => ({
    name: m[1].replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\(.)/g, "$1"),
    gid: m[2],
  }));
  if (!found.length) throw new Error("couldn't find the sheet's tabs (did Google change the page, or is it private?)");
  return found;
}

/**
 * Reads every tab. Throws, without a partial result, if any data tab can't be
 * read or has lost a column, so the sync never acts on half a sheet.
 */
export async function readSheet(): Promise<SheetRead> {
  const notes: string[] = [];
  const rows: SheetRow[] = [];
  const list = await tabs();

  const csvs = await Promise.all(
    list.map(async (t) => {
      const { text, type } = await get(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${t.gid}`);
      if (!type.includes("csv")) throw new Error(`tab “${t.name}” didn't come back as CSV (is the sheet still shared by link?)`);
      return { ...t, data: parseCsv(text) };
    }),
  );

  for (const t of csvs) {
    const [header = [], ...body] = t.data;
    const h = header.map((x) => x.trim());
    if (!h.includes("Post ID") || !h.includes("URL")) continue; // Run Log, Lomax, Studs and other notes tabs
    const missing = COLUMNS.filter((c) => !h.includes(c));
    if (missing.length) throw new Error(`tab “${t.name}” is missing column(s): ${missing.join(", ")}`);
    const col = (r: string[], c: (typeof COLUMNS)[number]) => (r[h.indexOf(c)] ?? "").trim();

    const category = categoryForTab(t.name);
    if (!category) notes.push(`tab “${t.name}” (${body.length} rows) matches no category, skipped`);

    for (const r of body) {
      const url = col(r, "URL");
      if (!/^https?:\/\//.test(url)) continue;
      rows.push({
        postId: col(r, "Post ID") || createHash("sha1").update(url).digest("hex").slice(0, 16),
        url,
        tab: t.name,
        category,
        tag: col(r, "Tag").toUpperCase(),
        handle: col(r, "Author").slice(0, 60),
        agent: col(r, "Agent").slice(0, 80),
        summary: col(r, "Summary").slice(0, 1000),
        postedAt: etToIso(col(r, "Post Date (ET)")),
        likes: num(col(r, "Likes")),
        views: num(col(r, "Views")),
        reposts: num(col(r, "Reposts")),
        usedInPost: col(r, "Used in Post").slice(0, 200),
      });
    }
  }

  // a post Lomax left in two tabs: keep the first, like Lomax's own clean-up does
  const seen = new Set<string>();
  const unique = rows.filter((r) => (seen.has(r.postId) ? false : (seen.add(r.postId), true)));
  if (unique.length < rows.length) notes.push(`${rows.length - unique.length} duplicate post(s) across tabs ignored`);
  return { rows: unique, notes };
}
