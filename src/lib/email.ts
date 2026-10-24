import { siteConfig } from "@/data/config";
import { getSecret } from "./secrets";

/** Resend's REST API. Without RESEND_API_KEY nothing is sent and the caller is told so. */
export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  const key = await getSecret("RESEND_API_KEY");
  if (!key) return { sent: false as const, reason: "no-key" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM ?? `Roger <library@meetroger.ai>`, to, subject, html, text, reply_to: siteConfig.contactEmail }),
  });
  if (!res.ok) return { sent: false as const, reason: `resend ${res.status}` };
  return { sent: true as const };
}

export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function siteUrl(path: string) {
  const base = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : siteConfig.domain);
  return `${base}${path}`;
}
