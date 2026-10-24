import { neon } from "@neondatabase/serverless";

/** Neon over HTTP: one round trip per query, fine for serverless functions. */
export const sql = neon(process.env.DATABASE_URL ?? "postgres://missing");

export const hasDb = () => Boolean(process.env.DATABASE_URL);
