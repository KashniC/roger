"use client";

import { useActionState, useEffect, useId } from "react";
import { requestWorkshop, subscribe, type FormState } from "@/app/actions";
import { siteConfig } from "@/data/config";
import { readUtm, trackEvent, useMounted } from "@/lib/session";

const idle: FormState = { status: "idle" };

function UtmFields() {
  const mounted = useMounted();
  const utm = mounted ? readUtm() : {};
  return (
    <>
      {Object.entries(utm).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
    </>
  );
}

function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function mailto(subject: string, body = "") {
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}

// ---------------------------------------------------------------------------

export function NewsletterForm({ forValue, night = false }: { forValue: "home" | "work"; night?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, idle);
  const id = useId();
  const prompt = "Not ready? Get 5 real AI-assistant use cases every week.";

  useEffect(() => {
    if (state.status === "ok") trackEvent("newsletter_submit", { for: forValue });
  }, [state.status, forValue]);

  const muted = night ? "text-night-ink-2" : "text-ink-2";

  if (!siteConfig.forms.newsletterEndpoint) {
    return (
      <p className={`text-small ${muted}`}>
        {prompt}{" "}
        <a className="tlink chev" href={mailto("Weekly AI-assistant use cases", "Please add me to the weekly AI-assistant use cases.")}>
          Email us to get them
        </a>
      </p>
    );
  }

  if (state.status === "ok") {
    return (
      <p role="status" className={`text-small font-[560] ${night ? "text-night-ink" : "text-ink"}`}>
        You’re in. First one lands next week.
      </p>
    );
  }

  const err = state.fieldErrors?.email;
  return (
    <form action={action} className="relative max-w-[30rem]" noValidate>
      <label htmlFor={`${id}-email`} className={`block text-small ${muted}`}>
        {prompt}
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.ca"
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          className={`h-11 min-w-0 flex-1 rounded-full border px-4 text-body outline-none transition-colors ${
            night ? "border-night-rule bg-night-2 text-night-ink placeholder:text-night-ink-2 focus:border-night-ink" : "border-rule-strong bg-surface placeholder:text-ink-2 focus:border-ink"
          }`}
        />
        <input type="hidden" name="for" value={forValue} />
        <UtmFields />
        <Honeypot />
        <button type="submit" disabled={pending} className={`btn btn-m ${night ? "btn-light" : "btn-ink"}`}>
          {pending ? "Sending…" : "Send me them"}
        </button>
      </div>
      {err && (
        <p id={`${id}-err`} className="mt-2 text-small text-error">
          {err}
        </p>
      )}
      {state.message && (
        <p role="alert" className="mt-2 text-small text-error">
          {state.message}
        </p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------

const groupTypes = ["BIA", "Business association", "Chamber", "School or parent community", "Other"];

export function WorkshopForm() {
  const [state, action, pending] = useActionState(requestWorkshop, idle);
  const id = useId();

  useEffect(() => {
    if (state.status === "ok") trackEvent("workshop_request_submit");
  }, [state.status]);

  if (!siteConfig.forms.workshopEndpoint) {
    return (
      <div className="rounded-[8px] bg-surface p-7 sm:p-10">
        <h3 className="text-title">Email us to request a date</h3>
        <p className="mt-3 max-w-[34rem] text-body text-ink-2">
          Send your group’s name, roughly how many people, and a month that works. We’ll reply within 1 business day to find a date.
        </p>
        <a
          className="btn btn-l mt-7"
          href={mailto("Workshop request", "Organisation:\nYour name:\nGroup type (BIA, association, chamber, school or parent community):\nExpected size:\nPreferred month:\nIn person or Zoom:\nNotes:")}
          onClick={() => trackEvent("cta_click", { cta: "workshop_request", location: "workshops" })}
        >
          Email {siteConfig.contactEmail}
        </a>
      </div>
    );
  }

  if (state.status === "ok") {
    return (
      <div role="status" className="rounded-[8px] bg-surface p-7 sm:p-10">
        <h3 className="text-title">Thanks. We’ll reply within 1 business day to find a date.</h3>
      </div>
    );
  }

  const fe = state.fieldErrors ?? {};
  const field = "mt-2 h-12 w-full rounded-[var(--radius-control)] border border-rule-strong bg-surface px-4 text-body outline-none focus:border-ink aria-[invalid=true]:border-error";
  const label = "block text-small font-[560]";
  const err = (k: string) =>
    fe[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 text-small text-error">
        {fe[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": !!fe[k], "aria-describedby": fe[k] ? `${id}-${k}-err` : undefined });

  return (
    <form action={action} noValidate className="relative grid gap-6 rounded-[8px] bg-surface p-7 sm:grid-cols-2 sm:p-10">
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-org`} className={label}>
          Organisation <span className="text-ink-2">(required)</span>
        </label>
        <input id={`${id}-org`} name="organisation" required autoComplete="organization" className={field} {...aria("organisation")} />
        {err("organisation")}
      </div>
      <div>
        <label htmlFor={`${id}-name`} className={label}>
          Your name <span className="text-ink-2">(required)</span>
        </label>
        <input id={`${id}-name`} name="name" required autoComplete="name" className={field} {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={label}>
          Email <span className="text-ink-2">(required)</span>
        </label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className={field} {...aria("email")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>
          Phone
        </label>
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-type`} className={label}>
          Group type
        </label>
        <select id={`${id}-type`} name="groupType" className={field} defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {groupTypes.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-size`} className={label}>
          Expected size
        </label>
        <input id={`${id}-size`} name="size" inputMode="numeric" placeholder="10–40" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-month`} className={label}>
          Preferred month
        </label>
        <input id={`${id}-month`} name="month" placeholder="e.g. November" className={field} />
      </div>
      <fieldset className="sm:col-span-2">
        <legend className={label}>Format</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {["In person", "Zoom", "Either"].map((f) => (
            <label key={f} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-rule-strong px-4 text-small has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ground">
              <input type="radio" name="format" value={f} className="accent-[var(--color-accent)]" defaultChecked={f === "Either"} />
              {f}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-notes`} className={label}>
          Notes
        </label>
        <textarea id={`${id}-notes`} name="notes" rows={4} className={`${field} h-auto py-3`} />
      </div>
      <UtmFields />
      <Honeypot />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn btn-l">
          {pending ? "Sending…" : "Request a date"}
        </button>
        {state.message && (
          <p role="alert" className="text-small text-error">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
