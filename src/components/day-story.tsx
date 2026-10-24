"use client";

import { useEffect, useRef, useState } from "react";
import { LockScreen } from "./phone/lock-screen";
import type { DayStep } from "@/data/home";
import type { SceneId } from "./phone/scenes";

const SCENES: SceneId[] = ["dawn", "morning", "noon", "afternoon", "night"];

/**
 * The signature: one example day told on a lock screen. On wide screens the
 * phone stays pinned while the day scrolls past it; the clock advances, the
 * Toronto light changes, and each job's message arrives on top of the last.
 * On phones the same day is a set of time tabs above one phone.
 */
export function DayStory({ steps, date, header }: { steps: DayStep[]; date: string; header: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let io: IntersectionObserver | null = null;
    const start = () => {
      io?.disconnect();
      if (!mq.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
          }
        },
        { rootMargin: "-48% 0px -48% 0px" },
      );
      stepRefs.current.forEach((el) => el && io!.observe(el));
    };
    start();
    mq.addEventListener("change", start);
    return () => {
      io?.disconnect();
      mq.removeEventListener("change", start);
    };
  }, []);

  const step = steps[active];
  const notes = steps
    .slice(0, active + 1)
    .map((s) => ({ id: s.id, title: s.job, time: s.clock, body: s.note }))
    .reverse();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-16 md:gap-y-0 lg:gap-x-24">
      <div className="md:col-start-1 md:row-start-1">{header}</div>

      {/* Phone: under the heading on small screens, pinned on the right on wide ones */}
      <div className="flex justify-center md:col-start-2 md:row-span-2 md:row-start-1 md:block">
        <div className="[--phone-w:248px] xs:[--phone-w:272px] md:sticky md:top-[76px] md:[--phone-w:min(320px,calc((100svh-150px)*0.462))] lg:[--phone-w:min(340px,calc((100svh-150px)*0.462))]">
          <LockScreen
            scene={step.scene}
            scenesToRender={SCENES}
            date={date}
            time={step.clock}
            notes={notes}
            expanded={2}
            arrive="latest"
            uid="day"
            label={`Example lock screen at ${step.time}: ${step.note}`}
          />
        </div>
      </div>

      {/* Phones and tablets: time tabs drive the phone above */}
      <div className="md:hidden">
        <div role="tablist" aria-label="Times of day" className="relative -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6">
          {steps.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              id={`day-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="day-panel"
              onClick={() => setActive(i)}
              className={`chip min-h-11 shrink-0 snap-start rounded-full border px-4 text-small font-[560] transition-colors ${
                i === active ? "border-ink bg-ink text-ground" : "border-rule-strong bg-surface text-ink"
              }`}
            >
              {s.time}
            </button>
          ))}
        </div>
        <div id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${step.id}`} className="mt-6">
          <StepText step={step} />
        </div>
      </div>

      {/* Wide screens: the day scrolls past the pinned phone */}
      <ol className="hidden md:col-start-1 md:row-start-2 md:block">
        {steps.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[72svh] items-center first:min-h-[46svh] first:items-start first:pt-12 last:min-h-[86svh]"
          >
            <StepText step={s} active={i === active} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepText({ step, active = true }: { step: DayStep; active?: boolean }) {
  return (
    <article className="max-w-[30rem]">
      <p className={`text-small font-[600] transition-colors duration-500 ${active ? "text-ink" : "text-ink-2"}`}>
        {step.time} · {step.job}
      </p>
      <h3
        className={`mt-3 text-h3 transition-colors duration-500 ${
          active ? "text-ink" : "text-ink-2"
        }`}
      >
        {step.after}
      </h3>
      <dl className="mt-6 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 border-t border-rule pt-4 text-small">
        <dt className="text-ink-2">Before</dt>
        <dd className="text-ink-2">{step.before}</dd>
      </dl>
    </article>
  );
}
