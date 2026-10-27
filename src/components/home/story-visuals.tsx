import { Icon } from "@/components/icons";
import type { Entry } from "./live-search";

/** Chapter 1: the morning's reading. Kept entries are real; the rest show the kinds of post left out. */
export function IntakeVisual({ kept }: { kept: Entry[] }) {
  const left = [
    { t: "A launch announcement for a new assistant", why: "Ad" },
    { t: "A thread of predictions about AI", why: "Opinion" },
    { t: "A coding agent fixing a build", why: "Off topic" },
    { t: "A screenshot with no detail", why: "Can’t verify" },
  ];
  return (
    <div className="window-light">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <span className="flex items-center gap-2.5 text-[0.9375rem] font-[600]">
          <Icon name="sunrise" className="size-5 text-accent" /> This morning’s reading
        </span>
        <span className="tag bg-ground-2 text-ink-2">Illustration</span>
      </div>
      <div className="grid sm:grid-cols-2">
        <div className="border-rule p-4 sm:border-r">
          <p className="kicker flex items-center gap-2 text-ok">
            <Icon name="check" className="size-4" strokeWidth={2.2} /> Kept
          </p>
          <ul className="mt-3 grid gap-2">
            {kept.slice(0, 4).map((e) => (
              <li key={e.id} className="rounded-[10px] bg-ground px-3.5 py-3">
                <p className="text-[0.9375rem] font-[600] leading-snug">{e.title}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-2">
                  {e.tool || "Any agent"} · {e.handle}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <p className="kicker flex items-center gap-2 text-[#9a3a26]">
            <Icon name="x" className="size-4" strokeWidth={2.2} /> Left out
          </p>
          <ul className="mt-3 grid gap-2">
            {left.map((x) => (
              <li key={x.t} className="flex items-center justify-between gap-3 rounded-[10px] border border-dashed border-rule-strong px-3.5 py-3">
                <span className="text-[0.875rem] text-ink-2 line-through decoration-ink/25">{x.t}</span>
                <span className="tag shrink-0 bg-[#fbeee9] text-[#9a3a26]">{x.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Chapter 2: where it lands. Real shelf counts, and one real entry as it's filed. */
export function ShelfVisual({ shelves, entry, total }: { shelves: { id: string; label: string; n: number }[]; entry?: Entry; total: number }) {
  const top = shelves.slice(0, 7);
  const home = shelves.find((s) => s.id === entry?.category);
  const max = Math.max(1, ...top.map((s) => s.n));
  return (
    <div className="relative">
      <div className="window-light p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker text-ink-2">The library</p>
            <p className="display mt-2 text-[clamp(3rem,6vw,4.5rem)] tabular-nums">{total.toLocaleString("en-CA")}</p>
          </div>
          <p className="pb-2 text-right text-[0.875rem] text-ink-2">use cases on {shelves.length} shelves</p>
        </div>
        <ul className="mt-6 grid gap-2.5">
          {top.map((s) => (
            <li key={s.label} className="grid grid-cols-[8.5rem_minmax(0,1fr)_3rem] items-center gap-3 text-[0.875rem]">
              <span className={s.id === home?.id ? "font-[650]" : "text-ink-2"}>{s.label}</span>
              <span className="h-3 overflow-hidden rounded-full bg-ground-2">
                <span className={`block h-full rounded-full ${s.id === home?.id ? "bg-accent" : "bg-ink/20"}`} style={{ width: `${(s.n / max) * 100}%` }} />
              </span>
              <span className="mono text-right tabular-nums text-ink-2">{s.n.toLocaleString("en-CA")}</span>
            </li>
          ))}
        </ul>
      </div>
      {entry && (
        <div className="relative z-10 -mt-10 ml-auto w-[min(26rem,92%)] rounded-[14px] bg-night p-5 text-night-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] sm:-mr-6">
          <p className="flex items-center justify-between gap-2">
            <span className="tag bg-white/[0.07] text-night-ink-2">{entry.tool || "Any agent"}</span>
            {home && <span className="kicker text-accent-night">Filed · {home.label}</span>}
          </p>
          <p className="mt-3 text-[1.125rem] font-[620] leading-snug tracking-[-0.02em]">{entry.title}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-night-ink-2">
            <span className="flex items-center gap-1.5"><Icon name="pen" className="size-3.5" /> In our words</span>
            <span className="flex items-center gap-1.5"><Icon name="external" className="size-3.5" /> {entry.handle}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/** Chapter 3: running on someone's own agent. The guide page every setup ends with (from /setup). */
export function AgentVisual() {
  const rows: [string, string, boolean?][] = [
    ["Runs", "Weekdays at 6:45am"],
    ["Reads", "Your email, calendar and task list"],
    ["Sends you", "One screen: meetings, replies owed, what’s overdue, one thing first"],
    ["Never", "Replies, books or pays on its own", true],
    ["To change it", "Tell it in plain words: “skip Fridays”"],
  ];
  return (
    <div className="relative">
      <div className="window-light">
        <div className="flex items-center justify-between gap-3 border-b border-rule px-6 py-4">
          <span className="kicker text-ink-2">Your agents · page 1 of 6</span>
          <span className="flex gap-1.5">
            {["Muse", "Grok Bot", "Hark"].map((t) => (
              <span key={t} className="tag bg-ground-2 text-ink-2">{t}</span>
            ))}
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="display text-[clamp(2rem,3.4vw,2.75rem)]">Morning brief</p>
          <dl className="mt-6 grid gap-0 border-t border-rule">
            {rows.map(([k, v, strong]) => (
              <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-rule py-3.5 text-[1rem] sm:grid-cols-[9rem_minmax(0,1fr)]">
                <dt className="text-ink-2">{k}</dt>
                <dd className={strong ? "flex items-center gap-2 font-[650]" : ""}>
                  {strong && <Icon name="shield" className="size-4 shrink-0 text-accent" />}
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[0.875rem] text-ink-2">
        <Icon name="file" className="size-4" /> A page from the guide you keep after a setup.
      </p>
    </div>
  );
}
