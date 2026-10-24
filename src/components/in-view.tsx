"use client";

import { useEffect, useRef } from "react";

/** Adds `is-live` once the child is mostly on screen, so its motion plays when someone can see it. */
export function InView({ children, className = "", threshold = 0.45 }: { children: React.ReactNode; className?: string; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-live");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
