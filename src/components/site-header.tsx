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

export function SiteHeader() {
  const path = usePathname() || "/";
  const nav = navFor(path);
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
    <header className="sticky top-0 z-40 bg-ground">
      <a href="#main" className="sr-only-focusable absolute left-4 top-2 z-50 rounded-full bg-ink px-4 py-2 text-small text-ground">
        Skip to content
      </a>
      <div className="wrap flex h-[60px] items-center gap-6">
        <Link href="/" className="-ml-1 flex items-center gap-2 rounded-md px-1 py-1 text-[1.0625rem] font-[620] tracking-[-0.015em]">
          <Toque className="size-[22px] text-accent" />
          Roger
        </Link>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-7 text-small text-ink-2">
            {nav.links.map((l) => {
              const active = l.href === path;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-0.5 py-1 transition-colors duration-[180ms] hover:text-ink ${active ? "text-ink" : ""}`}
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
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink md:hidden"
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
        <div id="mobile-menu" ref={menuRef} className="bg-ground-2 md:hidden">
          <nav aria-label="Main" className="wrap py-3">
            <ul>
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-12 items-center text-title" onClick={() => setOpen(false)}>
                    {l.label}
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
