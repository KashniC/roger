import { chiefWindow as w } from "@/data/business";
import { Panorama } from "./phone/wallpaper";

/**
 * The work setup's evidence: the Chief of Staff's Monday, as an app window
 * over the Toronto skyline at dawn. An example, and labelled as one.
 */
export function ChiefWindow({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`relative m-0 ${compact ? "h-full overflow-hidden [--h:120px] [mask-image:linear-gradient(#000_70%,transparent)]" : "[--h:clamp(300px,36vw,480px)]"}`}
    >
      <div className="h-[var(--h)] overflow-hidden rounded-[var(--radius-object)] bg-[#e9b48c]">
        <Panorama id="dawn" className="h-full w-full" />
      </div>
      <div className={`relative px-2 sm:px-8 md:px-14 lg:px-20 ${compact ? "-mt-[64px]" : "-mt-[calc(var(--h)*0.36)]"}`}>
          <div
            role="img"
            aria-label={`Example: a Chief of Staff assistant’s window on ${w.day}. ${w.greeting} ${w.items.map((i) => `${i.title}: ${i.detail}.`).join(" ")} It asks: ${w.ask}`}
            className="cw overflow-hidden rounded-[14px] border border-black/10 bg-[#fcfcfd] text-[#1d1d1f] shadow-[0_40px_90px_-30px_rgba(60,25,10,0.5),0_10px_30px_-12px_rgba(0,0,0,0.18)]"
          >
            {/* title bar */}
            <div aria-hidden="true" className="flex h-10 items-center gap-2 border-b border-[#ececef] px-4">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="mx-auto truncate pr-12 text-meta font-[560] text-[#6e6e73]">
                {w.title}
                <span className="hidden sm:inline"> · {w.day}</span>
              </span>
            </div>

            <div aria-hidden="true" className="grid min-h-[25rem] grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,1fr)_320px]">
              <nav className="hidden border-r border-[#ececef] bg-[#f6f6f8] p-3 md:block">
                {w.nav.map((n, i) => (
                  <p key={n.label} className={`flex items-center justify-between rounded-lg px-3 py-2 text-[0.8125rem] ${i === 0 ? "bg-[#e8e8ed] font-[600]" : "text-[#3a3a3e]"}`}>
                    {n.label}
                    {n.count && <span className="text-[0.75rem] text-[#6e6e73]">{n.count}</span>}
                  </p>
                ))}
              </nav>

              <div className="p-5 sm:p-7">
                <p className="text-meta text-[#6e6e73]">{w.day} · Example</p>
                <p className="mt-1 text-[1.25rem] font-[620] tracking-[-0.02em] sm:text-[1.375rem]">{w.greeting}</p>
                <ul className="mt-5 border-t border-[#ececef]">
                  {w.items.map((it, i) => (
                    <li key={it.title} className="cw-row flex items-center gap-4 border-b border-[#ececef] py-3.5" style={{ "--i": i } as React.CSSProperties}>
                      <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#1d1d1f] text-white">
                        <svg viewBox="0 0 16 16" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9375rem] font-[600]">{it.title}</span>
                        <span className="block text-meta text-[#5d5d63]">{it.detail}</span>
                      </span>
                      <span className="hidden rounded-full border border-[#dcdce1] px-3 py-1 text-[0.75rem] font-[560] sm:inline">{it.action}</span>
                    </li>
                  ))}
                </ul>
                <div className="cw-ask mt-5 max-w-[30rem] rounded-2xl bg-[#f2f2f5] p-4">
                  <p className="text-[0.9375rem]">{w.ask}</p>
                  <p className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#1d1d1f] px-3.5 py-1.5 text-[0.8125rem] font-[560] text-white">{w.buttons[0]}</span>
                    <span className="rounded-full border border-[#dcdce1] bg-white px-3.5 py-1.5 text-[0.8125rem] font-[560]">{w.buttons[1]}</span>
                  </p>
                </div>
              </div>

              <aside className="hidden border-l border-[#ececef] p-6 xl:block">
                <p className="text-meta font-[600] text-[#5d5d63]">{w.draft.status}</p>
                <p className="mt-3 text-meta text-[#6e6e73]">{w.draft.to}</p>
                <p className="mt-1 text-[0.9375rem] font-[600]">{w.draft.subject}</p>
                <p className="mt-4 text-[0.875rem] leading-[1.55] text-[#3a3a3e]">{w.draft.body}</p>
                <p className="mt-6 flex gap-2">
                  <span className="rounded-full bg-[#1d1d1f] px-3.5 py-1.5 text-[0.8125rem] font-[560] text-white">Approve &amp; send</span>
                  <span className="rounded-full border border-[#dcdce1] px-3.5 py-1.5 text-[0.8125rem] font-[560]">Edit</span>
                </p>
              </aside>
            </div>
          </div>
      </div>
      <figcaption className={compact ? "sr-only" : "mt-4 text-meta text-ink-2"}>Example Monday. Your Chief of Staff, on your own accounts.</figcaption>
    </figure>
  );
}
