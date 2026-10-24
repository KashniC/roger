"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/data/config";
import { menuTitle } from "@/data/menu";
import type { OfferId } from "./offer";

/**
 * Everything that carries a visitor's choices from the page into Stripe and
 * Cal.com lives in sessionStorage (this tab only, gone when it closes, no
 * cookies). Every access is guarded: private windows and blocked storage throw.
 */
const KEYS = { picks: "roger.picks", code: "roger.code", utm: "roger.utm" } as const;

function read(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the page still works, choices just don't carry */
  }
}

// --- a tiny store so every CTA re-renders when picks change --------------
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let picksCache: { raw: string | null; value: string[] } = { raw: null, value: [] };
function getPicksSnapshot(): string[] {
  const raw = read(KEYS.picks);
  if (raw !== picksCache.raw) {
    let value: string[] = [];
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) value = parsed.filter((x) => typeof x === "string").slice(0, 20);
    } catch {
      value = [];
    }
    picksCache = { raw, value };
  }
  return picksCache.value;
}
const EMPTY: string[] = [];

export function usePicks(offer: OfferId) {
  const all = useSyncExternalStore(subscribe, getPicksSnapshot, () => EMPTY);
  const prefix = offer === "work" ? "work-" : "home-";
  return all.filter((id) => id.startsWith(prefix) && id !== "work-cos");
}

export function setPicks(offer: OfferId, ids: string[]) {
  const prefix = offer === "work" ? "work-" : "home-";
  const others = getPicksSnapshot().filter((id) => !id.startsWith(prefix));
  write(KEYS.picks, JSON.stringify([...others, ...ids]));
  emit();
}

/** False on the server and during hydration, true after: safe gate for reading browser storage in render. */
const noop = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// --- workshop codes --------------------------------------------------------
export function normaliseCode(input: string | null | undefined) {
  return (input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
}

/** A code counts only if Peter listed its group in config.workshopCodes. */
export function validCode(input: string | null | undefined) {
  const code = normaliseCode(input);
  if (!code) return null;
  return siteConfig.workshopCodes.some((c) => normaliseCode(c) === code) ? code : null;
}

let codeCache: string | null | undefined;
function getCodeSnapshot() {
  const v = validCode(read(KEYS.code));
  if (v !== codeCache) codeCache = v;
  return codeCache ?? null;
}
export function useWorkshopCode() {
  return useSyncExternalStore(subscribe, getCodeSnapshot, () => null);
}
export function storeCode(code: string) {
  write(KEYS.code, code);
  emit();
}

// --- campaign tags ---------------------------------------------------------
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtm(search: URLSearchParams) {
  const found: Utm = {};
  for (const k of UTM_KEYS) {
    const v = search.get(k);
    if (v) found[k] = v.slice(0, 80);
  }
  if (Object.keys(found).length) write(KEYS.utm, JSON.stringify(found));
}
export function readUtm(): Utm {
  try {
    const raw = read(KEYS.utm);
    return raw ? (JSON.parse(raw) as Utm) : {};
  } catch {
    return {};
  }
}

// --- link builders -----------------------------------------------------------
function sanitiseRef(s: string) {
  return s.replace(/[^A-Za-z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 200);
}

/** Stripe Payment Link with the workshop code and a client_reference_id that carries picks + source. */
export function stripeHref(base: string, offer: OfferId, picks: string[], code: string | null) {
  if (!base) return "";
  try {
    const url = new URL(base);
    const short = picks.map((id) => id.replace(/^(work|home)-/, "")).join("-");
    const source = readUtm().utm_source || "direct";
    url.searchParams.set(
      "client_reference_id",
      sanitiseRef(`${offer === "work" ? "w" : "h"}${short ? `-${short}` : ""}__${source}`),
    );
    if (code) url.searchParams.set("prefilled_promo_code", `${code}${offer === "work" ? "WORK" : "HOME"}`);
    return url.toString();
  } catch {
    return base;
  }
}

/** Cal.com link with the picks prefilled into the booking question whose identifier is "picks". */
export function calHref(base: string, picks: string[]) {
  if (!base) return "";
  try {
    const url = new URL(base);
    if (picks.length) url.searchParams.set("picks", picks.map(menuTitle).join(", "));
    const utm = readUtm();
    if (utm.utm_source) url.searchParams.set("utm_source", utm.utm_source);
    return url.toString();
  } catch {
    return base;
  }
}

// --- analytics ---------------------------------------------------------------
type Plausible = (event: string, opts?: { props?: Record<string, string | number> }) => void;

export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (!siteConfig.analytics.enabled) return;
  try {
    const w = window as unknown as { plausible?: Plausible };
    w.plausible?.(name, props ? { props } : undefined);
  } catch {
    /* never let analytics break a click */
  }
}
