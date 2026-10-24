"use client";

import { useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/session";

export function PaybackCalculator({ price }: { price: number }) {
  const [hours, setHours] = useState(3);
  const [rate, setRate] = useState("50");
  const used = useRef(false);
  const id = useId();

  const rateN = Number(rate);
  const valid = Number.isFinite(rateN) && rateN > 0;
  const weeks = valid ? Math.ceil(price / (hours * rateN)) : null;

  const touch = () => {
    if (!used.current) {
      used.current = true;
      trackEvent("calc_used");
    }
  };

  return (
    <div className="self-start rounded-[var(--radius-object)] border border-rule bg-surface p-7 sm:p-9">
      <h3 className="text-title">When does it pay for itself?</h3>
      <p className="mt-2 text-small text-ink-2">Your numbers, not a promise.</p>

      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${id}-h`} className="text-small font-[560]">
            Hours saved per week
          </label>
          <output htmlFor={`${id}-h`} className="text-small font-[600]">
            {hours} {hours === 1 ? "hour" : "hours"}
          </output>
        </div>
        <input
          id={`${id}-h`}
          type="range"
          min={1}
          max={10}
          step={1}
          value={hours}
          onChange={(e) => {
            setHours(Number(e.target.value));
            touch();
          }}
          className="mt-3 w-full accent-[var(--color-accent)]"
        />
      </div>

      <div className="mt-7">
        <label htmlFor={`${id}-r`} className="text-small font-[560]">
          Value of your hour (CAD)
        </label>
        <div className="mt-2 flex h-12 items-center rounded-[var(--radius-control)] border border-rule-strong bg-surface px-4 focus-within:border-ink">
          <span className="text-ink-2" aria-hidden="true">
            $
          </span>
          <input
            id={`${id}-r`}
            inputMode="decimal"
            value={rate}
            onChange={(e) => {
              setRate(e.target.value.replace(/[^0-9.]/g, "").slice(0, 6));
              touch();
            }}
            aria-invalid={!valid}
            aria-describedby={!valid ? `${id}-err` : undefined}
            className="ml-1 w-full border border-transparent bg-transparent text-body outline-none"
          />
        </div>
        {!valid && (
          <p id={`${id}-err`} className="mt-2 text-small text-error">
            Enter the value of your hour.
          </p>
        )}
      </div>

      <p className="mt-8 border-t border-rule pt-6 text-lead" aria-live="polite">
        {weeks !== null ? (
          <>
            At {hours} {hours === 1 ? "hour" : "hours"} a week, this pays for itself in about{" "}
            <strong className="font-[650]">
              {weeks} {weeks === 1 ? "week" : "weeks"}
            </strong>
            .
          </>
        ) : (
          "Add the value of your hour to see the payback."
        )}
      </p>
    </div>
  );
}
