"use client";

import { menuTitle } from "@/data/menu";
import { siteConfig } from "@/data/config";
import { usePicks } from "@/lib/session";
import { ActionLink } from "./action-link";

type Props = {
  offer: "work" | "home";
  book: string;
  timing: string;
  picksLabel: string;
  checklistHeading: string;
  checklist: string[];
};

/** After Stripe: book the session, with the picks carried through. */
export function Thanks({ offer, book, timing, picksLabel, checklistHeading, checklist }: Props) {
  const picks = usePicks(offer);
  const kind = offer === "work" ? "workSession1" : "homeSession";
  const subject = offer === "work" ? "Booking Session 1" : "Booking my home session";
  return (
    <div className="wrap grid gap-14 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-28">
      <div>
        <p className="text-small font-[600] text-ink-2">Thank you</p>
        <h1 className="mt-3 text-h2 text-stretch-display">Payment received.</h1>
        <p className="mt-5 text-lead text-ink-2">Your receipt is on its way from Stripe. One step left: pick your time.</p>
        <div className="mt-9">
          <ActionLink kind={kind} location="thanks">
            {book}
          </ActionLink>
          <p className="mt-3 text-small text-ink-2">{timing}</p>
          {picks.length > 0 && (
            <p className="mt-6 text-small">
              <span className="text-ink-2">{picksLabel} </span>
              {picks.map(menuTitle).join(", ")}
            </p>
          )}
          <p className="mt-8 text-small text-ink-2">
            Trouble booking? Email{" "}
            <a className="tlink" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`}>
              {siteConfig.contactEmail}
            </a>{" "}
            and we’ll book it with you within 1 business day.
          </p>
        </div>
      </div>
      <div className="self-start rounded-[var(--radius-object)] border border-rule bg-surface p-7 sm:p-9">
        <h2 className="text-title">{checklistHeading}</h2>
        <ol className="mt-5 divide-y divide-rule border-t border-rule">
          {checklist.map((c, i) => (
            <li key={c} className="flex py-4 text-body">
              <span className="w-7 shrink-0 text-small font-[600] text-ink-2">{i + 1}</span>
              {c}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
