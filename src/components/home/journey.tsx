import { Icon, type IconName } from "@/components/icons";

const stages: { icon: IconName; label: string; line: string }[] = [
  { icon: "search", label: "Discover", line: "See what people’s agents actually did, read from public posts every morning." },
  { icon: "shelves", label: "Choose", line: "Pick what fits your week, or start with the free ten-agent pack." },
  { icon: "bolt", label: "Set up", line: "Paste in the instructions yourself, or have Peter install it on your accounts." },
];

/** Three stages on one line, with something always travelling along it. */
export function Journey() {
  return (
    <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
      {/* the line, behind the marks */}
      <span aria-hidden="true" className="absolute left-7 top-7 h-[calc(100%-3.5rem)] w-px bg-rule-strong md:left-[16.66%] md:right-[16.66%] md:h-px md:w-auto" />
      <span aria-hidden="true" className="journey-pulse absolute left-[16.66%] top-7 hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block" />
      {stages.map((s, i) => (
        <li key={s.label} className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-6 md:grid-cols-1 md:justify-items-center md:gap-0 md:text-center">
          <span className={`relative grid size-14 place-items-center rounded-full ${i === 2 ? "bg-accent text-accent-ink" : "bg-ink text-ground"} shadow-[0_0_0_10px_var(--color-ground-2)]`}>
            <Icon name={s.icon} className="size-6" />
          </span>
          <span className="md:mt-8">
            <span className="mono block text-[0.8125rem] text-ink-2">0{i + 1}</span>
            <span className="display mt-2 block text-[clamp(2.25rem,4vw,3.25rem)]">{s.label}</span>
            <span className="mt-3 block max-w-[20rem] text-[1rem] text-ink-2 md:mx-auto">{s.line}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
