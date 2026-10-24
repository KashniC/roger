"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import type { Department } from "@/data/company";
import exterior from "@/assets/img/exterior.webp";
import mapTable from "@/assets/img/map-table.webp";
import needle from "@/assets/img/needle-macro.webp";
import office from "@/assets/img/office-dawn.webp";
import plant from "@/assets/img/plant-dawn.webp";
import warehouse from "@/assets/img/warehouse.webp";

const photos: Record<Department["image"], { src: StaticImageData; alt: string; position: string }> = {
  office: { src: office, alt: "A quiet brick office at dawn with desks, binders and laptops", position: "50% 50%" },
  plant: { src: plant, alt: "A small instrument workshop at dawn with steel benches and bins", position: "40% 50%" },
  warehouse: { src: warehouse, alt: "A parts warehouse aisle with tall steel shelves in morning light", position: "50% 60%" },
  map: { src: mapTable, alt: "A boardroom table with a hand-drawn process map and sticky notes", position: "50% 50%" },
  needle: { src: needle, alt: "A close-up of a pressure gauge needle behind curved glass", position: "70% 50%" },
  exterior: { src: exterior, alt: "A brick factory building on an industrial street at dawn", position: "50% 50%" },
};

/**
 * The company page's signature: a Map you can read. Pick a department; its
 * room comes up, and the work an assistant could take off it floats over the
 * photo with the hours it costs a week.
 */
export function ExampleMap({ departments, note }: { departments: Department[]; note: string }) {
  const [active, setActive] = useState(0);
  const d = departments[active];
  const total = departments.reduce((sum, x) => sum + x.candidates.reduce((s, c) => s + c.hours, 0), 0);
  const deptHours = (x: Department) => x.candidates.reduce((s, c) => s + c.hours, 0);
  const maxHours = Math.max(...departments.flatMap((x) => x.candidates.map((c) => c.hours)));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-12">
      {/* Departments */}
      <div>
        <p className="text-small text-ink-2">
          <span className="text-h3 font-[640] text-ink">{total}</span> hours a week, across {departments.length} departments
        </p>
        <div role="tablist" aria-label="Departments" className="relative -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-rule lg:px-0">
          {departments.map((x, i) => {
            const on = i === active;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`dept-${x.id}`}
                aria-selected={on}
                aria-controls="dept-panel"
                onClick={() => setActive(i)}
                className={`chip flex min-h-11 shrink-0 items-center justify-between gap-6 rounded-full border px-4 text-left text-small font-[560] transition-colors lg:rounded-none lg:border-x-0 lg:border-t-0 lg:px-0 lg:py-3.5 ${
                  on ? "border-ink bg-ink text-ground lg:border-rule lg:bg-transparent lg:text-ink" : "border-rule-strong bg-surface text-ink lg:border-rule lg:bg-transparent lg:text-ink-2 lg:hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className={`hidden size-2 rounded-full lg:block ${on ? "bg-ink" : "bg-rule-strong"}`} />
                  {x.name}
                </span>
                <span className={`hidden whitespace-nowrap lg:inline ${on ? "text-ink" : ""}`}>{deptHours(x)} h</span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 hidden text-meta text-ink-2 lg:block">{note}</p>
      </div>

      {/* The department: its room, with the work floating over it */}
      <div id="dept-panel" role="tabpanel" aria-labelledby={`dept-${d.id}`} className="relative">
        <div className="grain relative h-[260px] overflow-hidden rounded-[var(--radius-object)] bg-night sm:h-[380px] lg:h-[460px]">
          {(Object.keys(photos) as Department["image"][]).map((k) => (
            <Image
              key={k}
              src={photos[k].src}
              alt={k === d.image ? photos[k].alt : ""}
              fill
              sizes="(min-width: 1024px) 780px, 100vw"
              className="photo-grade object-cover transition-opacity duration-700 ease-[var(--ease-out)]"
              style={{ objectPosition: photos[k].position, opacity: k === d.image ? 1 : 0 }}
              aria-hidden={k === d.image ? undefined : true}
            />
          ))}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
          <p className="absolute left-6 top-5 text-small font-[600] text-white sm:left-8 sm:top-7">
            {d.name} · {deptHours(d)} hours a week
          </p>
        </div>
        <ul key={d.id} className="rise-in relative z-10 mx-3 -mt-16 divide-y divide-rule rounded-[var(--radius-inner)] border border-rule bg-surface px-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] sm:mx-8 sm:-mt-24 sm:px-7" data-wd-float>
          {d.candidates.map((c) => (
            <li key={c.task} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 py-5">
              <p className="text-title">{c.task}</p>
              <p className="text-title text-ink">{c.hours} h</p>
              <p className="text-small text-ink-2">{c.how}</p>
              <span aria-hidden="true" className="col-span-2 h-1 overflow-hidden rounded-full bg-ground-2">
                <span className="block h-full rounded-full bg-ink transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${(c.hours / maxHours) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-meta text-ink-2 lg:hidden">{note}</p>
      </div>
    </div>
  );
}
