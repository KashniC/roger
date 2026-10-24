"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { addUseCase, runIngestAction, saveSecretAction, saveSettingsAction, signInAction, updateUseCase, type AdminState } from "@/app/admin/actions";
import { categories } from "@/data/library";

const idle: AdminState = { status: "idle" };
const field = "mt-1.5 h-11 w-full rounded-[var(--radius-control)] border border-rule-strong bg-surface px-3 text-small outline-none focus:border-ink";
const label = "block text-meta font-[600] text-ink-2";

function Msg({ s }: { s: AdminState }) {
  if (s.status === "idle" || !s.message) return null;
  return (
    <p role={s.status === "error" ? "alert" : "status"} className={`text-small ${s.status === "error" ? "text-error" : "text-ink"}`}>
      {s.message}
    </p>
  );
}

export function LoginForm() {
  const [s, action, pending] = useActionState(signInAction, idle);
  return (
    <form action={action} className="mx-auto mt-24 max-w-sm rounded-[var(--radius-object)] border border-rule bg-surface p-8">
      <h1 className="text-h3">Roger admin</h1>
      <p className="mt-2 text-small text-ink-2">Sign in to manage the library, sign-ups and settings.</p>
      <label htmlFor="pw" className={`${label} mt-6`}>
        Password
      </label>
      <input id="pw" name="password" type="password" required autoComplete="current-password" className={field} />
      <button type="submit" disabled={pending} className="btn btn-m btn-ink mt-5 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <div className="mt-3">
        <Msg s={s} />
      </div>
    </form>
  );
}

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/use-cases", label: "Use cases" },
  { href: "/admin/leads", label: "Sign-ups" },
  { href: "/admin/watches", label: "Watches" },
  { href: "/admin/connections", label: "Connections" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1">
      {tabs.map((t) => {
        const on = t.href === "/admin" ? path === "/admin" : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined} className={`chip flex min-h-10 shrink-0 items-center rounded-full border px-4 text-small font-[560] ${on ? "border-ink bg-ink text-ground" : "border-transparent text-ink-2 hover:text-ink"}`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function RunIngest() {
  const [s, action, pending] = useActionState(runIngestAction, idle);
  return (
    <form action={action} className="flex flex-wrap items-center gap-4">
      <button type="submit" disabled={pending} className="btn btn-m btn-ink">
        {pending ? "Reading new posts…" : "Run the daily intake now"}
      </button>
      <Msg s={s} />
    </form>
  );
}

type Uc = { id: string; title: string; summary: string; category: string; persona: string; for_: string; tool: string; handle: string; url: string; outcome: string | null };

function CaseFields({ u }: { u?: Uc }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={label}>Title (our words, max 70)</label>
        <input name="title" defaultValue={u?.title} maxLength={80} required className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>Summary (our words, one or two sentences)</label>
        <textarea name="summary" defaultValue={u?.summary} maxLength={300} rows={3} required className={`${field} h-auto py-2`} />
      </div>
      <div>
        <label className={label}>Category</label>
        <select name="category" defaultValue={u?.category ?? "solo"} className={field}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Persona</label>
        <select name="persona" defaultValue={u?.persona ?? "solopreneur"} className={field}>
          {["solopreneur", "household", "caregiving", "business", "everyone"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Agent</label>
        <input name="tool" defaultValue={u?.tool} placeholder="Grok Bot, Muse, Hark…" className={field} />
      </div>
      <div>
        <label className={label}>Author handle</label>
        <input name="handle" defaultValue={u?.handle} placeholder="@handle" required className={field} />
      </div>
      {!u && (
        <div className="sm:col-span-2">
          <label className={label}>Link to the original post</label>
          <input name="url" type="url" placeholder="https://x.com/…/status/…" required className={field} />
        </div>
      )}
      <div>
        <label className={label}>Home or work</label>
        <select name="for" defaultValue={u?.for_ ?? "work"} className={field}>
          <option value="work">Work</option>
          <option value="home">Home</option>
        </select>
      </div>
      <div>
        <label className={label}>Outcome</label>
        <select name="outcome" defaultValue={u?.outcome ?? "win"} className={field}>
          <option value="win">Worked</option>
          <option value="honest-miss">Didn’t go as planned</option>
        </select>
      </div>
    </div>
  );
}

export function EditCase({ u }: { u: Uc }) {
  const [s, action, pending] = useActionState(updateUseCase, idle);
  return (
    <form action={action} className="mt-4 space-y-4 rounded-[var(--radius-inner)] bg-ground-2 p-5">
      <input type="hidden" name="id" value={u.id} />
      <CaseFields u={u} />
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-s btn-ink">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Msg s={s} />
      </div>
    </form>
  );
}

export function AddCase() {
  const [s, action, pending] = useActionState(addUseCase, idle);
  return (
    <form action={action} className="space-y-4">
      <CaseFields />
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-m btn-ink">
          {pending ? "Adding…" : "Add to the library"}
        </button>
        <Msg s={s} />
      </div>
    </form>
  );
}

export type SettingsForm = {
  founderFullName: string;
  founderPhone: string;
  founderPhoto: string;
  founderBio: string[];
  bioApproved: boolean;
  setupPrice: number;
  planPrice: number;
  setupCall: string;
  setupCheckout: string;
  planCheckout: string;
  companyCall: string;
  companyTermsConfirmed: boolean;
};

export function SettingsEditor({ s }: { s: SettingsForm }) {
  const [state, action, pending] = useActionState(saveSettingsAction, idle);
  const group = "rounded-[var(--radius-object)] border border-rule bg-surface p-6 sm:p-8";
  return (
    <form action={action} className="space-y-6">
      <fieldset className={group}>
        <legend className="px-1 text-title">About Peter</legend>
        <p className="text-small text-ink-2">Shown in “Who you’ll work with” on the company pages.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Full name</label>
            <input name="founderFullName" defaultValue={s.founderFullName} placeholder="Peter …" className={field} />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input name="founderPhone" defaultValue={s.founderPhone} placeholder="+1 416 …" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Photo link (https://, square or 4:5)</label>
            <input name="founderPhoto" defaultValue={s.founderPhoto} placeholder="https://…" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Bio, one true line per row (up to 6)</label>
            <textarea name="founderBio" defaultValue={s.founderBio.join("\n")} rows={4} className={`${field} h-auto py-2`} />
          </div>
          <label className="flex items-center gap-2 text-small sm:col-span-2">
            <input type="checkbox" name="bioApproved" defaultChecked={s.bioApproved} className="size-4 accent-[var(--color-accent)]" />
            Show the bio on the site
          </label>
        </div>
      </fieldset>

      <fieldset className={group}>
        <legend className="px-1 text-title">The ladder</legend>
        <p className="text-small text-ink-2">Prices on the home and setup pages. An empty payment link shows “Add it on your setup call” instead of a button.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Custom setup price ($)</label>
            <input name="setupPrice" inputMode="numeric" defaultValue={s.setupPrice} className={field} />
          </div>
          <div>
            <label className={label}>Monthly plan price ($)</label>
            <input name="planPrice" inputMode="numeric" defaultValue={s.planPrice} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Setup booking link (Cal.com)</label>
            <input name="setupCall" defaultValue={s.setupCall} className={field} />
          </div>
          <div>
            <label className={label}>Setup payment link (Stripe)</label>
            <input name="setupCheckout" defaultValue={s.setupCheckout} placeholder="https://buy.stripe.com/…" className={field} />
          </div>
          <div>
            <label className={label}>Monthly plan payment link (Stripe)</label>
            <input name="planCheckout" defaultValue={s.planCheckout} placeholder="https://buy.stripe.com/…" className={field} />
          </div>
        </div>
      </fieldset>

      <fieldset className={group}>
        <legend className="px-1 text-title">Companies</legend>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={label}>Company intro-call link</label>
            <input name="companyCall" defaultValue={s.companyCall} className={field} />
          </div>
          <label className="flex items-center gap-2 text-small">
            <input type="checkbox" name="companyTermsConfirmed" defaultChecked={s.companyTermsConfirmed} className="size-4 accent-[var(--color-accent)]" />
            The $10,000/month terms are confirmed (removes “Terms to confirm together on Wednesday” on prospect pages)
          </label>
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-l">
          {pending ? "Saving…" : "Save settings"}
        </button>
        <Msg s={state} />
      </div>
    </form>
  );
}

/** Paste one API key. The page never shows a saved key, only its last four characters. */
export function SecretForm({ name, label: title, set }: { name: string; label: string; set: boolean }) {
  const [s, action, pending] = useActionState(saveSecretAction, idle);
  return (
    <form action={action} className="mt-4 flex flex-wrap items-end gap-3">
      <input type="hidden" name="name" value={name} />
      <div className="min-w-0 flex-1 basis-64">
        <label htmlFor={`k-${name}`} className="sr-only">
          {title}
        </label>
        <input id={`k-${name}`} name="value" type="password" autoComplete="off" spellCheck={false} placeholder={set ? "Paste a new key to replace it" : "Paste the key"} className={`${field} mt-0 font-mono`} />
      </div>
      <button type="submit" disabled={pending} className="btn btn-m btn-ink">
        {pending ? "Saving…" : "Save"}
      </button>
      <div className="basis-full">
        <Msg s={s} />
      </div>
    </form>
  );
}
