import { Icon, connectIcon } from "@/components/icons";
import { livePack } from "@/data/packs";

/** Every account the free pack's agents connect to, once each. */
const accounts = [...new Set(livePack.agents.flatMap((a) => a.connect))].filter((c) => c !== "Notes or recorder");

/**
 * Your agent in the middle, the accounts it reads around it, traffic moving
 * along the spokes. The names are the pack's own connections; Roger sets them
 * up on your logins rather than holding them.
 */
export function Ecosystem({ tools }: { tools: string[] }) {
  const n = accounts.length;
  const pos = accounts.map((label, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 33 : 44; // two orbits, so neighbours never collide
    return { label, x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
  });
  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[40rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-ink" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.25" />
          <g className="orbit-spin">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.25" strokeDasharray="0.6 1.6" />
          </g>
          
          {pos.map((p, i) => {
            const d = `M${p.x} ${p.y} L50 50`;
            return (
              <g key={p.label}>
                <path d={d} stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.25" />
                <circle r="0.7" className="packet-svg fill-accent">
                  <animateMotion dur={`${3 + (i % 4) * 0.6}s`} begin={`${(i * 0.37) % 3}s`} repeatCount="indefinite" path={i % 2 ? d : `M50 50 L${p.x} ${p.y}`} />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* the agent */}
        <div className="absolute left-1/2 top-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-night text-center text-night-ink shadow-[0_0_0_10px_rgb(154_82_38/0.08),0_30px_60px_-20px_rgb(0_0_0/0.6)]">
          <div className="px-4">
            <span className="breathe mx-auto block size-2 rounded-full bg-ok-night" aria-hidden="true" />
            <p className="mt-2 text-[clamp(0.9375rem,2.2vw,1.375rem)] font-[650] leading-tight tracking-[-0.02em]">Your agent</p>
            <p className="mt-1 hidden text-[0.75rem] text-night-ink-2 sm:block">{tools.filter((t) => !t.includes("/")).slice(0, 3).join(" · ")} or any agent</p>
          </div>
        </div>

        {/* the accounts */}
        <ul>
          {pos.map((p) => (
            <li key={p.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-surface p-2 text-[0.8125rem] font-[560] shadow-[0_0_0_1px_rgb(27_26_24/0.08),0_10px_24px_-14px_rgb(0_0_0/0.4)] sm:py-1.5 sm:pl-2 sm:pr-3.5">
                <span className="grid size-7 place-items-center rounded-full bg-accent-wash text-accent">
                  <Icon name={connectIcon(p.label)} className="size-4" />
                </span>
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{p.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-center text-[0.875rem] text-ink-2 sm:hidden">{accounts.join(" · ")}</p>
    </div>
  );
}
