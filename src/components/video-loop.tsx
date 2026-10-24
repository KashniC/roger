"use client";

import { useEffect, useRef } from "react";

/**
 * A silent loop that only plays while on screen, and never under reduced
 * motion (the poster frame shows instead).
 */
export function VideoLoop({ webm, mp4, poster, label, className = "" }: { webm: string; mp4: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} muted loop playsInline preload="metadata" poster={poster} aria-label={label} className={className}>
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
