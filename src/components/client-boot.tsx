"use client";

import { useEffect, useState } from "react";
import { captureUtm, storeCode, usePicks, useWorkshopCode, validCode } from "@/lib/session";
import { ActionLink, type ActionKind } from "./action-link";

/** Reads ?utm_* and ?code= once per visit, then tidies the address bar. */
export function ClientBoot() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      captureUtm(url.searchParams);
      if (url.searchParams.has("code")) {
        const code = validCode(url.searchParams.get("code"));
        if (code) storeCode(code);
        url.searchParams.delete("code");
        window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
      }
    } catch {
      /* nothing to carry */
    }
  }, []);
  return null;
}

export function CodeBanner() {
  const code = useWorkshopCode();
  if (!code) return null;
  return (
    <div role="status" className="border-b border-[#e6d3c4] bg-accent-wash text-small">
      <p className="wrap py-2.5 text-center">
        Workshop code <strong className="font-[650]">{code}</strong> will be applied at checkout.
      </p>
    </div>
  );
}

type StickyAction = { kind: ActionKind; label: string; variant?: "button" | "text"; picksFor?: "work" | "home" };

/**
 * Phones only: once the hero's action has scrolled away, keep one tap to book.
 * Hides again over the closing band and while someone is typing in a form.
 */
export function StickyCta({ actions, summary }: { actions: StickyAction[]; summary?: { offer: "home" | "work"; max: number; price: string; name: string } }) {
  const [show, setShow] = useState(false);
  // the pick count only means something once the picker has been seen
  const [seenPicker, setSeenPicker] = useState(false);
  const picks = usePicks(summary?.offer ?? "home");

  // While the bar is up, the header's own button steps aside (one action per screen).
  useEffect(() => {
    document.documentElement.dataset.sticky = show ? "on" : "";
    return () => {
      document.documentElement.dataset.sticky = "";
    };
  }, [show]);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const end = document.getElementById("final-cta");
    let heroVisible = true;
    let endVisible = false;
    let typing = false;
    const apply = () => setShow(!heroVisible && !endVisible && !typing);

    const pick = document.getElementById("pick");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === end) endVisible = e.isIntersecting;
        if (e.target === pick && e.isIntersecting) setSeenPicker(true);
      }
      apply();
    });
    if (pick) io.observe(pick);
    if (hero) io.observe(hero);
    else heroVisible = false;
    if (end) io.observe(end);

    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      typing = !!t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
      apply();
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", () => {
      typing = false;
      apply();
    });
    apply();
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 bg-ground-2 transition-transform duration-300 ease-[var(--ease-out)] md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="wrap flex min-h-14 items-center justify-between gap-3 py-2">
        {summary && (
          <p className="text-small leading-tight">
            <span className="block font-[600]">{summary.price}</span>
            <span className="text-ink-2">{seenPicker || picks.length ? `${picks.length} of ${summary.max} picked` : summary.name}</span>
          </p>
        )}
        {actions.map((a) => (
          <ActionLink key={a.kind} kind={a.kind} location="sticky" size="m" variant={a.variant} picksFor={a.picksFor} className={a.variant === "text" ? "text-small" : summary ? "" : "flex-1"}>
            {a.label}
          </ActionLink>
        ))}
      </div>
    </div>
  );
}
