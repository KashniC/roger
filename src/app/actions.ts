"use server";

import { siteConfig } from "@/data/config";

export type FormState = { status: "idle" | "ok" | "error"; message?: string; fieldErrors?: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: FormDataEntryValue | null, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function forward(endpoint: string, payload: Record<string, string>): Promise<FormState> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Form service answered ${res.status}`);
    return { status: "ok" };
  } catch (err) {
    console.error("[forms]", err);
    return { status: "error", message: `Something went wrong. Try again, or email ${siteConfig.contactEmail}.` };
  }
}

function utm(fd: FormData) {
  return {
    utm_source: clean(fd.get("utm_source"), 80),
    utm_medium: clean(fd.get("utm_medium"), 80),
    utm_campaign: clean(fd.get("utm_campaign"), 80),
  };
}

export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  if (clean(fd.get("_gotcha"))) return { status: "ok" }; // a bot filled the hidden field
  const email = clean(fd.get("email"), 254);
  if (!EMAIL.test(email)) return { status: "error", fieldErrors: { email: "Enter a valid email address, like name@example.ca." } };
  const endpoint = siteConfig.forms.newsletterEndpoint;
  if (!endpoint) return { status: "error", message: `Sign-up isn’t open yet. Email ${siteConfig.contactEmail} and we’ll add you.` };
  return forward(endpoint, { email, for: clean(fd.get("for"), 10), ...utm(fd), _subject: "Weekly use cases sign-up" });
}

export async function requestWorkshop(_prev: FormState, fd: FormData): Promise<FormState> {
  if (clean(fd.get("_gotcha"))) return { status: "ok" };
  const v = {
    organisation: clean(fd.get("organisation"), 160),
    name: clean(fd.get("name"), 120),
    email: clean(fd.get("email"), 254),
    phone: clean(fd.get("phone"), 40),
    groupType: clean(fd.get("groupType"), 60),
    size: clean(fd.get("size"), 20),
    month: clean(fd.get("month"), 40),
    format: clean(fd.get("format"), 20),
    notes: clean(fd.get("notes"), 2000),
  };
  const fieldErrors: Record<string, string> = {};
  if (!v.organisation) fieldErrors.organisation = "Add your organisation’s name.";
  if (!v.name) fieldErrors.name = "Add your name.";
  if (!EMAIL.test(v.email)) fieldErrors.email = "Enter a valid email address, like name@example.ca.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const endpoint = siteConfig.forms.workshopEndpoint;
  if (!endpoint) return { status: "error", message: `Requests aren’t open online yet. Email ${siteConfig.contactEmail} and we’ll reply within 1 business day.` };
  return forward(endpoint, { ...v, ...utm(fd), _subject: `Workshop request: ${v.organisation}` });
}
