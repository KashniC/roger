"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toque } from "./toque";
import { ActionLink, type ActionKind } from "./action-link";

type NavSet = {
  links: { href: string; label: string }[];
  cta: { kind?: ActionKind; href?: string; label: string; short: string; picksFor?: "work" | "home" } | null;
};

const library: NavSet = {
  links: [
    { href: "/library", label: "Use cases" },
    { href: "/packs/solopreneur", label: "Starter packs" },
    { href: "/setup", label: "Setup" },
    { href: "/companies", label: "For companies" },
  ],
  cta: { href: "/packs/solopreneur", label: "Get the free pack", short: "Free pack" },
};

const company: NavSet = {
  links: [
    { href: "/companies#map", label: "The Map" },
    { href: "/companies#how", label: "How it works" },
    { href: "/companies#pricing", label: "Pricing" },
    { href: "/library", label: "Use cases" },
  ],
  cta: { kind: "companyCall", label: "Book an intro call", short: "Book a call" },
};

function navFor(path: string): NavSet {
  if (path.startsWith("/companies")) return company;
  // A page prepared for one company: no navigation, nothing to sell around it
  if (path.startsWith("/for/")) return { links: [], cta: null };
  // After paying, the only job left is booking: no button competing with it
  if (path.startsWith("/thanks") || path.startsWith("/admin")) return { ...library, cta: null };
  return library;
}

/**
 * Dark sections are marked data-header-tone="night"; the header goes dark
 * while one of them is passing under it.
 */
function useNightUnder(path: string) {
  const [state, setState] = useState<{ path: string; night: boolean } | null>(null);
  useEffect(() => {
    const dark = [...document.querySelectorAll<HTMLElement>('[data-header-tone="night"]')];
    if (!dark.length) return;
    // dark whenever a dark section meets the header's bottom edge
    let frame = 0;
    const check = () => {
      frame = 0;
      const night = dark.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 64 && r.bottom > 64;
      });
      setState({ path, night });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [path]);
  // before the first measurement, the home page starts under its dark hero
  return state?.path === path ? state.night : path === "/";
}

export function SiteHeader() {
  const path = usePathname() || "/";
  const nav = navFor(path);
  const dark = useNightUnder(path);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const setOpen = (next: boolean) => setOpenOn(next ? path : null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${
        dark ? "on-night border-white/[0.07] bg-night/80 text-night-ink" : "border-rule/70 bg-ground/85 text-ink"
      }`}
    >
      <a href="#main" className="sr-only-focusable absolute left-4 top-2 z-50 rounded-full bg-ink px-4 py-2 text-small text-ground">
        Skip to content
      </a>
      <div className="wrap flex h-[60px] items-center gap-6">
        <Link href="/" className="-ml-1 flex items-center gap-2 rounded-md px-1 py-1 text-[1.0625rem] font-[620] tracking-[-0.015em]">
          <Toque className={`size-[22px] ${dark ? "text-accent-night" : "text-accent"}`} />
          Roger
        </Link>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className={`flex items-center gap-5 whitespace-nowrap text-[0.9375rem] lg:gap-7 ${dark ? "text-night-ink-2" : "text-ink-2"}`}>
            {nav.links.map((l) => {
              const active = l.href === path;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-0.5 py-1 transition-colors duration-[180ms] ${dark ? "hover:text-night-ink" : "hover:text-ink"} ${active ? (dark ? "text-night-ink" : "text-ink") : ""}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`ml-auto flex items-center gap-2 md:ml-0 ${nav.cta ? "" : "md:hidden"}`}>
          {nav.cta && (
            <span className="header-cta">
              {nav.cta.href ? (
                <Link href={nav.cta.href} className="btn btn-m">
                  <span className="hidden sm:inline">{nav.cta.label}</span>
                  <span className="sm:hidden">{nav.cta.short}</span>
                </Link>
              ) : (
                <ActionLink kind={nav.cta.kind!} location="header" size="m" picksFor={nav.cta.picksFor}>
                  <span className="hidden sm:inline">{nav.cta.label}</span>
                  <span className="sm:hidden">{nav.cta.short}</span>
                </ActionLink>
              )}
            </span>
          )}
          <button
            ref={buttonRef}
            type="button"
            className="-mr-2 grid size-11 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 7h14M3 13h14" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={menuRef} className={`border-t md:hidden ${dark ? "border-white/[0.07]" : "border-rule/70"}`}>
          <nav aria-label="Main" className="wrap pb-6 pt-2">
            <ul>
              {nav.links.map((l) => (
                <li key={l.href} className={`border-b ${dark ? "border-white/[0.07]" : "border-rule/70"}`}>
                  <Link href={l.href} className="flex min-h-14 items-center justify-between text-title" onClick={() => setOpen(false)}>
                    {l.label}
                    <span aria-hidden="true" className={dark ? "text-night-ink-2" : "text-ink-2"}>›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
