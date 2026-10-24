import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { hasDb, sql } from "./db";

/**
 * API keys Peter can paste into /admin instead of Vercel. Stored encrypted
 * (AES-256-GCM, keyed from ADMIN_SECRET). An env var of the same name always
 * wins, so anything set in Vercel keeps working.
 */
export const SECRETS = {
  X_BEARER_TOKEN: { label: "X API bearer token", help: "developer.x.com → your app → Keys and tokens → Bearer token. Lets the daily intake search X directly." },
  XAI_API_KEY: { label: "xAI API key", help: "console.x.ai → API keys. Lets the daily intake ask Grok to search X." },
  RESEND_API_KEY: { label: "Resend API key", help: "resend.com → API keys. Sends watch confirmations and alerts. Not needed if Resend is connected in Vercel." },
  PUSH_TOKEN: { label: "Webhook token", help: "The password your bot sends with posts. Make a new one any time." },
} as const;

export type SecretName = keyof typeof SECRETS;
export const isSecretName = (k: string): k is SecretName => k in SECRETS;

function key() {
  const s = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return createHash("sha256").update(`secrets:${s}`).digest();
}

function seal(plain: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), body].map((b) => b.toString("base64url")).join(".");
}

function open(sealed: string) {
  const [iv, tag, body] = sealed.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(body), d.final()]).toString("utf8");
}

async function stored(name: SecretName) {
  if (!hasDb()) return null;
  const rows = (await sql`select value from secrets where key = ${name}`) as { value: string }[];
  if (!rows[0]) return null;
  try {
    return open(rows[0].value);
  } catch {
    return null;
  }
}

/** The key to use: Vercel first, then what was saved in /admin. */
export async function getSecret(name: SecretName) {
  return process.env[name]?.trim() || (await stored(name)) || "";
}

export async function saveSecret(name: SecretName, value: string) {
  await sql`insert into secrets (key, value, updated_at) values (${name}, ${seal(value)}, now())
            on conflict (key) do update set value = excluded.value, updated_at = now()`;
}

export async function removeSecret(name: SecretName) {
  await sql`delete from secrets where key = ${name}`;
}

export type SecretStatus = { name: SecretName; label: string; help: string; from: "vercel" | "admin" | null; hint: string };

/** What /admin shows: where each key comes from and its last four characters, never the key. */
export async function secretStatus(): Promise<SecretStatus[]> {
  const out: SecretStatus[] = [];
  for (const [name, meta] of Object.entries(SECRETS) as [SecretName, (typeof SECRETS)[SecretName]][]) {
    const env = process.env[name]?.trim();
    const db = env ? null : await stored(name);
    const v = env || db || "";
    out.push({ name, ...meta, from: env ? "vercel" : db ? "admin" : null, hint: v ? `…${v.slice(-4)}` : "" });
  }
  return out;
}

export const newPushToken = () => `rgr_${randomBytes(18).toString("base64url")}`;
