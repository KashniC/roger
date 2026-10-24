// Creates the tables and loads the seed use cases. Run: node --env-file=.env.local db/setup.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
for (const stmt of schema.split(/;\s*\n/).map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("schema ok");

const seed = JSON.parse(readFileSync(new URL("./seed.json", import.meta.url), "utf8"));
let n = 0;
for (const u of seed) {
  await sql.query(
    `insert into use_cases (id, title, summary, category, persona, for_, tool, handle, url, source, outcome, featured, week_of)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'seed',$10,$11,$12) on conflict (id) do nothing`,
    [u.id, u.title, u.summary, u.category, u.persona, u.for, u.tool || "", u.handle, u.url, u.outcome ?? null, !!u.featured, u.weekOf],
  );
  n++;
}
const [{ count }] = await sql.query("select count(*)::int as count from use_cases");
console.log(`seeded ${n}; library has ${count}`);
