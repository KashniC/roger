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
        <h1 className="text-h2 text-stretch-display">Thank you, payment received</h1>
        <p className="mt-5 text-lead">Your receipt is on its way from Stripe. One step left: pick your time.</p>
        <div className="mt-9">
          <ActionLink kind={kind} location="thanks">
            {book}
          </ActionLink>
          <p className="mt-3 text-small">{timing}</p>
          {picks.length > 0 && (
            <p className="mt-6 text-small">
              <span className="text-ink-2">{picksLabel} </span>
              {picks.map(menuTitle).join(", ")}
            </p>
          )}
          <p className="mt-8 text-small">
            Trouble booking? Email{" "}
            <a className="tlink" href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`}>
              {siteConfig.contactEmail}
            </a>{" "}
            and we’ll book it with you within 1 business day.
          </p>
        </div>
      </div>
      <div className="self-start rounded-[8px] bg-ground-2 p-7 sm:p-9">
        <h2 className="text-title">{checklistHeading}</h2>
        <ol className="mt-5 space-y-1">
          {checklist.map((c) => (
            <li key={c} className="rounded-[6px] bg-surface px-4 py-3 text-body">
              {c}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
