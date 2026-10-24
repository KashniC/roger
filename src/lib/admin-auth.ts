import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "roger-admin";
const DAYS = 14;

function secret() {
  const s = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return s;
}

function sign(expires: number) {
  return createHmac("sha256", secret()).update(`admin:${expires}`).digest("base64url");
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** True when the visitor holds a valid, unexpired admin session cookie. */
export async function isAdmin() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, mac] = raw.split(".");
  const expires = Number(exp);
  if (!expires || expires < Date.now() || !mac) return false;
  try {
    return same(mac, sign(expires));
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in");
}

export async function signIn(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || !same(password.trim(), expected)) return false;
  const expires = Date.now() + DAYS * 86400_000;
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}
