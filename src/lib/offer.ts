import { siteConfig } from "@/data/config";

export type OfferId = "work" | "home";

export function money(n: number) {
  return `$${n.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;
}

export function foundingOpen() {
  return siteConfig.founding.spotsLeft > 0;
}

/** The price a visitor pays today, the monthly framing, and the links that take it. */
export function offerNow(id: OfferId) {
  const p = siteConfig.prices;
  const open = foundingOpen();
  const price = id === "work" ? (open ? p.work : p.regularWork) : open ? p.home : p.regularHome;
  const regular = id === "work" ? p.regularWork : p.regularHome;
  const checkout =
    id === "work"
      ? open
        ? siteConfig.stripe.workCheckout
        : siteConfig.stripe.workCheckoutRegular
      : open
        ? siteConfig.stripe.homeCheckout
        : siteConfig.stripe.homeCheckoutRegular;
  return {
    id,
    price,
    priceLabel: money(price),
    regularLabel: money(regular),
    monthlyLabel: money(Math.round(price / 12)),
    isFounding: open,
    checkout,
  };
}

/** "10 of 10 founding spots left · We take 3 setups a week", or the full-up line. */
export function capacityLine() {
  const { founding, capacityLine } = siteConfig;
  if (founding.spotsLeft <= 0) return `Founding spots are full · ${capacityLine}`;
  return `${founding.spotsLeft} of ${founding.total} founding spots left · ${capacityLine}`;
}
