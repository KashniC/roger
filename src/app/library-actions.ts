"use server";

import { cookies } from "next/headers";
import { hasDb, sql } from "@/lib/db";
import { createWatch } from "@/lib/watches";

export type ActionState = { status: "idle" | "ok" | "error"; message?: string; emailed?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: FormDataEntryValue | null, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "Tell me when someone's agent can do this." */
export async function saveWatch(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (clean(fd.get("_gotcha"))) return { status: "ok" };
  const email = clean(fd.get("email"), 254);
  const query = clean(fd.get("query"), 160);
  if (query.length < 3) return { status: "error", message: "Describe what you want an agent to do, in a few words." };
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!hasDb()) return { status: "error", message: "Watches aren’t switched on yet. Try again soon." };
  const { emailed } = await createWatch(email, query);
  return { status: "ok", emailed };
}

/** A starter pack (kind "pack") or a coming-soon persona (kind "interest"). */
export async function saveLead(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (clean(fd.get("_gotcha"))) return { status: "ok" };
  const email = clean(fd.get("email"), 254);
  const persona = clean(fd.get("persona"), 40);
  const kind = clean(fd.get("kind"), 20) === "interest" ? "interest" : "pack";
  if (!EMAIL.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!hasDb()) return { status: "error", message: "Sign-ups aren’t switched on yet. Try again soon." };
  const utm = clean(fd.get("utm"), 200);
  await sql`insert into leads (email, kind, persona, utm) values (${email}, ${kind}, ${persona}, ${utm}) on conflict do nothing`;
  if (kind === "pack") {
    (await cookies()).set(`roger-pack-${persona}`, "1", { maxAge: 60 * 60 * 24 * 365, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  }
  return { status: "ok" };
}
