"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Department } from "@/data/company";
import exterior from "@/assets/img/exterior.webp";
import mapTable from "@/assets/img/map-table.webp";
import needle from "@/assets/img/needle-macro.webp";
import office from "@/assets/img/office-dawn.webp";
import plant from "@/assets/img/plant-dawn.webp";
import warehouse from "@/assets/img/warehouse.webp";
import { Gauge } from "./gauge";

const photos: Record<Department["image"], StaticImageData> = { office, plant, warehouse, map: mapTable, needle, exterior };
const MAX = 80;

const hoursOf = (d: Department) => d.candidates.reduce((t, c) => t + c.hours, 0);

/** Count a readout from one number to another in step with the needle (instant under reduced motion). */
function countTo(node: HTMLElement | null, from: number, to: number, shown: { current: number | null }) {
  if (!node) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.textContent = String(to);
    shown.current = to;
    return;
  }
  const start = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - start) / 700);
    const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
    node.textContent = String(v);
    shown.current = v;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * The company page's signature: a small Map you make yourself. Turn a
 * department on and the brass gauge swings up by the hours its busywork
 * costs a week; its room comes up behind the dial and its candidate
 * automations are listed. Starts with Sales and quotes on.
 */
export function MapGauge({ departments, heading, sub, note }: { departments: Department[]; heading: string; sub: string; note: string }) {
  const [on, setOn] = useState<string[]>([departments[0].id]);
  const [focus, setFocus] = useState(departments[0].id);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<number | null>(null);

  const total = departments.filter((d) => on.includes(d.id)).reduce((t, d) => t + hoursOf(d), 0);
  const focused = departments.find((d) => d.id === focus) ?? departments[0];

  // The needle waits at zero until the gauge is on screen, then springs up.
  useEffect(() => {
    const el = gaugeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.remove("gauge-idle");
          io.disconnect();
          countTo(readRef.current, 0, Number(readRef.current?.textContent ?? 0), shown);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
     
  }, []);

  // The readout counts to each new total in step with the needle.
  useEffect(() => {
    if (shown.current !== null) countTo(readRef.current, shown.current, total, shown);
     
  }, [total]);

  const toggle = (id: string) => {
    setFocus(id);
    setOn((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  return (
    <section aria-labelledby="map-gauge-title" className="on-night relative isolate overflow-hidden bg-[#121218] text-night-ink">
      {/* Ground: the focused department's room, under a dusk */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {(Object.keys(photos) as Department["image"][]).map((k) => (
          <Image
            key={k}
            src={photos[k]}
            alt=""
            fill
            sizes="100vw"
            className="photo-grade object-cover transition-opacity duration-700 ease-[var(--ease-out)]"
            style={{ opacity: k === focused.image ? 1 : 0 }}
          />
        ))}
        <div /* taste-skill-ignore: neutral scrim over a photo */ className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,20,0.9)_0%,rgba(18,18,20,0.86)_46%,rgba(12,12,14,0.95)_100%)]" />
      </div>

      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
        <div className="lg:col-start-1">
          <h2 id="map-gauge-title" className="text-h2">
            {heading}
          </h2>
          <p className="mt-4 max-w-[34rem] text-lead text-night-ink">{sub}</p>
        </div>

        {/* The instrument: under the heading on phones, pinned beside the list on wide screens */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <div ref={gaugeRef} className="gauge-idle mx-auto w-[min(78vw,20rem)] lg:w-full lg:max-w-[28rem]">
              <Gauge
                value={total}
                max={MAX}
                major={10}
                minor={2}
                label={`Example: a gauge reading ${total} hours a week, for the departments turned on`}
                readout={
                  <>
                    <p className="text-[13cqw] font-[600] leading-none tracking-[-0.05em]">
                      <span ref={readRef}>{total}</span>
                      <span className="ml-1 text-[0.38em] tracking-[-0.01em] text-night-ink-2">h</span>
                    </p>
                    <p className="mt-1.5 text-[max(0.8125rem,3.4cqw)] text-night-ink-2">a week · example</p>
                  </>
                }
              />
            </div>
            <p className="mt-5 text-center text-small text-night-ink-2" aria-live="polite">
              {total} hours a week across {on.length} {on.length === 1 ? "department" : "departments"}
            </p>
          </div>
        </div>

        <div className="lg:col-start-1">
          <div data-ui role="group" aria-label="Departments" className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-0 lg:overflow-visible lg:border-t lg:border-white/15 lg:px-0">
            {departments.map((d) => {
              const isOn = on.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => toggle(d.id)}
                  className={`chip flex min-h-11 shrink-0 items-center gap-3 rounded-full border px-4 text-left text-small font-[560] transition-colors lg:min-h-14 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:px-1 lg:odd:pr-6 lg:even:pl-6 ${
                    isOn ? "border-white bg-white text-[#121218] lg:border-white/15 lg:bg-transparent lg:text-night-ink" : "border-white/25 text-night-ink/80 lg:border-white/15 lg:hover:text-night-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`hidden size-[18px] shrink-0 place-items-center rounded-[5px] border lg:grid ${isOn ? "border-[#f0b88f] bg-[#f0b88f] text-[#121218]" : "border-white/35"}`}
                  >
                    {isOn && (
                      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                    )}
                  </span>
                  <span className="whitespace-nowrap lg:flex-1 lg:whitespace-normal">{d.name}</span>
                  <span className="hidden whitespace-nowrap lg:inline">{hoursOf(d)} h</span>
                </button>
              );
            })}
          </div>

          <div data-ui className="mt-10" aria-live="polite">
            <p className="text-small font-[600] text-night-ink-2">
              {focused.name} · {hoursOf(focused)} hours a week
            </p>
            <ul key={focused.id} className="mt-3 divide-y divide-white/12 border-y border-white/12">
              {focused.candidates.map((c) => (
                <li key={c.task} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1.5 py-5">
                  <p className="text-title">{c.task}</p>
                  <p className="text-title">{c.hours} h</p>
                  <p className="col-span-2 max-w-[36rem] text-small text-night-ink/75">{c.how}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-small text-night-ink-2">{note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
