"use client";

import { useEffect } from "react";
import { siteConfig } from "@/data/config";
import { offerNow } from "@/lib/offer";
import { calHref, stripeHref, trackEvent, useMounted, usePicks, useWorkshopCode } from "@/lib/session";
import type { ClientSettings } from "@/lib/settings-shared";
import { useSettings } from "./settings-provider";

export type ActionKind = "setupCall" | "setupCheckout" | "planCheckout" | "companyCall" | "fitCall" | "workCheckout" | "homeCheckout" | "workSession1" | "homeSession";

const meta: Record<ActionKind, { offer: "work" | "home"; event: string; cta: string }> = {
  setupCall: { offer: "work", event: "setupcall_open", cta: "setup_call" },
  setupCheckout: { offer: "work", event: "checkout_open", cta: "setup_checkout" },
  planCheckout: { offer: "work", event: "checkout_open", cta: "plan_checkout" },
  companyCall: { offer: "work", event: "companycall_open", cta: "company_call" },
  fitCall: { offer: "work", event: "fitcall_open", cta: "fitcall" },
  workCheckout: { offer: "work", event: "checkout_open", cta: "work_checkout" },
  homeCheckout: { offer: "home", event: "checkout_open", cta: "home_checkout" },
  workSession1: { offer: "work", event: "session_open", cta: "work_session1" },
  homeSession: { offer: "home", event: "session_open", cta: "home_session" },
};

function baseFor(kind: ActionKind, s: ClientSettings): string {
  switch (kind) {
    case "setupCall":
      return s.setupCall;
    case "setupCheckout":
      return s.setupCheckout;
    case "planCheckout":
      return s.planCheckout;
    case "companyCall":
      return s.companyCall;
    case "fitCall":
      return siteConfig.cal.fitCall;
    case "workSession1":
      return siteConfig.cal.workSession1;
    case "homeSession":
      return siteConfig.cal.homeSession;
    case "workCheckout":
      return offerNow("work").checkout;
    case "homeCheckout":
      return offerNow("home").checkout;
  }
}

type Props = {
  kind: ActionKind;
  children: React.ReactNode;
  /** Where on the page, for analytics. */
  location: string;
  variant?: "button" | "text";
  size?: "l" | "m" | "s";
  tone?: "accent" | "ink" | "light";
  className?: string;
  /** Picks from a different offer than the link's own (the fit call books work). */
  picksFor?: "work" | "home";
};

/**
 * Every booking and checkout link on the site. The server renders the plain
 * link; on the client it gains the visitor's picks, workshop code and source.
 * An empty link in config renders a disabled "Opening soon" control instead.
 */
export function ActionLink({ kind, children, location, variant = "button", size = "l", tone = "accent", className = "", picksFor }: Props) {
  const m = meta[kind];
  const settings = useSettings();
  const base = baseFor(kind, settings);
  const picks = usePicks(picksFor ?? m.offer);
  const code = useWorkshopCode();
  const mounted = useMounted();
  const isStripe = kind === "workCheckout" || kind === "homeCheckout" || kind === "setupCheckout" || kind === "planCheckout";
  // The server renders the plain link; once mounted it carries picks, code and source.
  const href = !base || !mounted ? base : isStripe ? stripeHref(base, m.offer, picks, code) : calHref(base, picks);

  useEffect(() => {
    if (!base && process.env.NODE_ENV !== "production") {
      console.warn(`[roger] "${kind}" has no link in data/config.ts, so it shows "Opening soon".`);
    }
  }, [base, kind]);

  const cls =
    variant === "button"
      ? `btn btn-${size} ${tone === "ink" ? "btn-ink" : tone === "light" ? "btn-light" : ""} ${className}`
      : `tlink chev ${className}`;

  if (!base) {
    return (
      <span className={cls} aria-disabled="true" role="link">
        Opening soon
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      onClick={() => {
        trackEvent("cta_click", { cta: m.cta, location });
        trackEvent(m.event, { offer: m.offer, picks: picks.join(",") || "none" });
      }}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
