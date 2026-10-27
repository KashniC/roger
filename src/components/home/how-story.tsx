"use client";

import { useEffect, useRef, useState } from "react";

export type StoryStep = { n: string; title: string; body: string; visual: React.ReactNode };

/**
 * Three short chapters scroll past on one side while their interface stays
 * pinned on the other and changes with them. On narrow screens each chapter
 * simply carries its own picture.
 */
export function HowStory({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,4.2fr)_minmax(0,7fr)] lg:gap-16">
      <ol>
        {steps.map((s, i) => (
          <li key={s.n}>
            <div
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
              className="flex flex-col justify-center py-14 lg:min-h-[78vh] lg:py-0"
            >
              <p className={`display text-[clamp(4rem,9vw,7.5rem)] tabular-nums transition-colors duration-500 ${active === i ? "text-accent" : "text-ink/15 max-lg:text-accent"}`}>
                {s.n}
              </p>
              <h3 className="mt-4 text-[clamp(1.875rem,3vw,2.75rem)] font-[650] leading-[1.02] tracking-[-0.04em]">{s.title}</h3>
              <p className="mt-4 max-w-[26rem] text-lead text-ink-2">{s.body}</p>
              <div className="mt-10 lg:hidden">{s.visual}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="relative hidden lg:block">
        <div className="sticky top-[calc(50vh-17rem)] h-[34rem]">
          {steps.map((s, i) => (
            <div key={s.n} data-on={active === i} aria-hidden={active !== i} className="story-frame absolute inset-0 flex items-center">
              <div className="w-full">{s.visual}</div>
            </div>
          ))}
          <div className="absolute -left-8 top-1/2 flex -translate-y-1/2 flex-col gap-2" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.n} className={`block w-1 rounded-full transition-all duration-500 ${active === i ? "h-8 bg-accent" : "h-3 bg-rule-strong"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
