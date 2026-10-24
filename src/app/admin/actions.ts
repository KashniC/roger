"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signIn, signOut } from "@/lib/admin-auth";
import { sql } from "@/lib/db";
import { CATEGORIES, PERSONAS } from "@/lib/ingest/extract";
import { ingest } from "@/lib/ingest/run";
import { isSecretName, newPushToken, removeSecret, saveSecret } from "@/lib/secrets";
import { saveSettings, type Settings } from "@/lib/settings";

export type AdminState = { status: "idle" | "ok" | "error"; message?: string };

const str = (fd: FormData, k: string, max = 500) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

export async function signInAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  const ok = await signIn(str(fd, "password", 200));
  if (!ok) return { status: "error", message: "That password isn’t right." };
  redirect("/admin");
}

export async function signOutAction() {
  await signOut();
  redirect("/admin");
}

export async function runIngestAction(_p: AdminState): Promise<AdminState> {
  await requireAdmin();
  const r = await ingest();
  if (r.accepted) updateTag("library");
  return { status: "ok", message: `Fetched ${r.fetched}, ${r.fresh} new, ${r.accepted} added. ${r.notes.join("; ")}` };
}

export async function toggleFeatured(fd: FormData) {
  await requireAdmin();
  await sql`update use_cases set featured = not featured where id = ${str(fd, "id")}`;
  updateTag("library");
}

export async function deleteUseCase(fd: FormData) {
  await requireAdmin();
  await sql`delete from use_cases where id = ${str(fd, "id")}`;
  updateTag("library");
}

function fields(fd: FormData) {
  const category = str(fd, "category");
  const persona = str(fd, "persona");
  return {
    title: str(fd, "title", 90),
    summary: str(fd, "summary", 300),
    category: (CATEGORIES as readonly string[]).includes(category) ? category : "solo",
    persona: (PERSONAS as readonly string[]).includes(persona) ? persona : "everyone",
    forHome: str(fd, "for") === "home" ? "home" : "work",
    tool: str(fd, "tool", 40),
    handle: str(fd, "handle", 60),
    url: str(fd, "url", 400),
    outcome: str(fd, "outcome") === "honest-miss" ? "honest-miss" : "win",
  };
}

export async function updateUseCase(_p: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const f = fields(fd);
  if (!f.title || !f.summary) return { status: "error", message: "Title and summary are required." };
  await sql`update use_cases set title = ${f.title}, summary = ${f.summary}, category = ${f.category}, persona = ${f.persona}, for_ = ${f.forHome},
            tool = ${f.tool}, handle = ${f.handle}, outcome = ${f.outcome} where id = ${str(fd, "id")}`;
  updateTag("library");
  return { status: "ok", message: "Saved." };
}

export async function addUseCase(_p: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const f = fields(fd);
  if (!f.title || !f.summary || !/^https?:\/\//.test(f.url) || !f.handle) return { status: "error", message: "Title, summary, handle and the original post’s link are required." };
  const id = `${f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48)}-${Date.now().toString(36).slice(-5)}`;
  try {
    await sql`insert into use_cases (id, title, summary, category, persona, for_, tool, handle, url, source, outcome)
              values (${id}, ${f.title}, ${f.summary}, ${f.category}, ${f.persona}, ${f.forHome}, ${f.tool}, ${f.handle.startsWith("@") ? f.handle : `@${f.handle}`}, ${f.url}, 'admin', ${f.outcome})`;
  } catch {
    return { status: "error", message: "That post is already in the library." };
  }
  updateTag("library");
  return { status: "ok", message: "Added to the library." };
}

export async function saveSettingsAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const num = (k: string, fallback: number) => {
    const n = Number(str(fd, k, 10));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const url = (k: string) => {
    const v = str(fd, k, 400);
    return v === "" || /^https:\/\//.test(v) ? v : null;
  };
  const links = { setupCall: url("setupCall"), setupCheckout: url("setupCheckout"), planCheckout: url("planCheckout"), companyCall: url("companyCall"), founderPhoto: url("founderPhoto") };
  const bad = Object.entries(links).find(([, v]) => v === null);
  if (bad) return { status: "error", message: `“${bad[0]}” must be an https:// link, or empty.` };
  const patch: Partial<Settings> = {
    founderFullName: str(fd, "founderFullName", 80),
    founderPhone: str(fd, "founderPhone", 40),
    founderPhoto: links.founderPhoto ?? "",
    founderBio: str(fd, "founderBio", 1200).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 6),
    bioApproved: fd.get("bioApproved") === "on",
    setupPrice: num("setupPrice", 500),
    planPrice: num("planPrice", 50),
    setupCall: links.setupCall ?? "",
    setupCheckout: links.setupCheckout ?? "",
    planCheckout: links.planCheckout ?? "",
    companyCall: links.companyCall ?? "",
    companyTermsConfirmed: fd.get("companyTermsConfirmed") === "on",
  };
  await saveSettings(patch);
  updateTag("settings");
  return { status: "ok", message: "Saved. The site uses these now." };
}

export async function saveSecretAction(_p: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const name = str(fd, "name", 40);
  const value = str(fd, "value", 400);
  if (!isSecretName(name)) return { status: "error", message: "Unknown key." };
  if (value.length < 8 || /\s/.test(value)) return { status: "error", message: "That doesn’t look like a key. Paste it again, with nothing around it." };
  await saveSecret(name, value);
  revalidatePath("/admin/connections");
  return { status: "ok", message: "Saved. The next intake uses it." };
}

export async function removeSecretAction(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name", 40);
  if (isSecretName(name)) await removeSecret(name);
  revalidatePath("/admin/connections");
}

/** A new webhook token. The old one stops working at once. */
export async function rotatePushToken() {
  await requireAdmin();
  await saveSecret("PUSH_TOKEN", newPushToken());
  revalidatePath("/admin/connections");
}
