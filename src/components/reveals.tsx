"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sections marked data-reveal bring their parts in once, as they enter the
 * screen. Content is only hidden after this observer is running, so a page
 * whose script fails stays fully readable. Sections that stream in after the
 * first paint (anything inside Suspense) are picked up as they arrive.
 */
export function Reveals() {
  const path = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    const watch = (root: ParentNode) => {
      if (root instanceof Element && root.matches("[data-reveal]:not(.is-in)")) io.observe(root);
      root.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && watch(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    document.documentElement.classList.add("reveal-ready");
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [path]);
  return null;
}
