"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A horizontal gallery that snaps card by card (the Apple "get to know"
 * shelf). Scrolls with touch, trackpad and keyboard; the arrows are a
 * convenience for mouse users.
 */
export function Rail({ children, label, inset = true }: { children: React.ReactNode; label: string; inset?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={ref}
        aria-label={label}
        tabIndex={0}
        className={`${inset ? "rail" : ""} relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none focus-visible:outline-offset-4`}
      >
        {children}
      </ul>
      <div className={`${inset ? "wrap" : ""} mt-4 hidden justify-end gap-3 md:flex`}>
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => page(dir)}
            disabled={dir === -1 ? edge.start : edge.end}
            className="grid size-11 place-items-center rounded-full border border-transparent bg-[#e8e8ed] text-ink transition-colors hover:bg-[#dedee3] disabled:opacity-40"
          >
            <span className="sr-only">{dir === -1 ? "Previous" : "Next"}</span>
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={dir === -1 ? "M12 4 6 10l6 6" : "m8 4 6 6-6 6"} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RailItem({ children }: { children: React.ReactNode }) {
  return <li className="w-[min(82vw,360px)] shrink-0 snap-start">{children}</li>;
}
