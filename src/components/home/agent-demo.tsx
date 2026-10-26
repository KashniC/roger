"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon, connectIcon } from "@/components/icons";
import { demoScenarios, demoSteps } from "@/data/demo";
import { livePack } from "@/data/packs";

const STEP_MS = 4200;

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
/** Reduced motion turns the walkthrough into a plain, click-through sequence. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

const scenarios = demoScenarios.map((s) => ({ ...s, agent: livePack.agents.find((a) => a.id === s.agentId)! }));

/**
 * One agent from the free pack, followed from the moment it runs to the moment
 * you approve what it drafted. Plays on its own while on screen; any click
 * hands control to the visitor. Example data, labelled as such.
 */
export function AgentDemo() {
  const reduced = useReducedMotion();
  const [sc, setSc] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = auto && !reduced && inView;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step < demoSteps.length - 1) setStep(step + 1);
      else {
        setSc((sc + 1) % scenarios.length);
        setStep(0);
      }
    }, step === demoSteps.length - 1 ? STEP_MS + 1600 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, sc]);

  const s = scenarios[sc];
  const take = () => setAuto(false);
  const goStep = (i: number) => {
    take();
    setStep(i);
  };

  return (
    <div ref={ref} className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
      {/* Controls: which agent, which step */}
      <div className="flex min-w-0 flex-col gap-8">
        <div>
          <p id="demo-agents" className="mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-2">
            Pick an agent from the free pack
          </p>
          <div role="tablist" aria-labelledby="demo-agents" className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:flex-wrap lg:px-0">
            {scenarios.map((x, i) => {
              const on = i === sc;
              return (
                <button
                  key={x.agentId}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="demo-stage"
                  onClick={() => {
                    take();
                    setSc(i);
                    setStep(0);
                  }}
                  className={`chip min-h-11 shrink-0 rounded-full border px-4 text-[0.9375rem] font-[560] transition-colors duration-[180ms] ${
                    on ? "border-ink bg-ink text-ground" : "border-rule-strong bg-surface text-ink hover:border-ink/50"
                  }`}
                >
                  {x.agent.name}
                </button>
              );
            })}
          </div>
        </div>

        <ol className="grid grid-cols-5 gap-1.5 lg:grid-cols-1 lg:gap-0">
          {demoSteps.map((d, i) => {
            const on = i === step;
            const done = i < step;
            return (
              <li key={d.id} className="relative">
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => goStep(i)}
                  className={`group relative flex w-full flex-col items-center gap-1 rounded-[10px] px-1 py-2 text-center transition-colors duration-[180ms] lg:flex-row lg:items-start lg:gap-4 lg:px-4 lg:py-4 lg:text-left ${
                    on ? "bg-surface shadow-[0_0_0_1px_rgb(0_0_0/0.07),0_10px_30px_-18px_rgb(0_0_0/0.35)]" : "hover:bg-ground-2"
                  }`}
                >
                  <span
                    className={`mono grid size-8 shrink-0 place-items-center rounded-full text-[0.8125rem] transition-colors duration-200 ${
                      on ? "bg-accent text-accent-ink" : done ? "bg-ink text-ground" : "bg-ground-2 text-ink-2 ring-1 ring-rule-strong"
                    }`}
                  >
                    {done ? <Icon name="check" className="size-4" strokeWidth={2} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[0.75rem] font-[600] leading-tight sm:text-[0.8125rem] lg:text-[1.0625rem] lg:tracking-[-0.01em] ${on ? "text-ink" : "text-ink-2 group-hover:text-ink"}`}>
                      {d.label}
                    </span>
                    <span className={`mt-0.5 hidden text-[0.9375rem] text-ink-2 lg:block`}>{d.line}</span>
                  </span>
                  {on && playing && (
                    <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-rule lg:inset-x-4 lg:bottom-1.5 lg:left-16">
                      <span key={`${sc}-${step}`} className="progress-bar progress-run block h-full bg-accent" style={{ "--dur": `${STEP_MS}ms` } as React.CSSProperties} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="-mt-4 text-center text-[0.9375rem] text-ink-2 lg:hidden">{demoSteps[step].line}</p>

        {!reduced && (
          <button
            type="button"
            onClick={() => setAuto(!auto)}
            className="tlink-quiet -mt-2 inline-flex min-h-10 items-center gap-2 self-center text-[0.875rem] lg:self-start lg:px-4"
          >
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-full ring-1 ring-rule-strong">
              {auto ? (
                <svg viewBox="0 0 12 12" className="size-2.5" fill="currentColor"><rect x="2.5" y="2" width="2.5" height="8" rx="0.6" /><rect x="7" y="2" width="2.5" height="8" rx="0.6" /></svg>
              ) : (
                <svg viewBox="0 0 12 12" className="ml-px size-2.5" fill="currentColor"><path d="M3 2v8l7-4z" /></svg>
              )}
            </span>
            {auto ? "Pause the walkthrough" : "Play the walkthrough"}
          </button>
        )}
      </div>

      {/* The stage: what the agent is doing at this step */}
      <div className="min-w-0">
        <div id="demo-stage" role="tabpanel" aria-live={playing ? "off" : "polite"} className="window">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-accent-night text-night">
                <Icon name="bolt" className="size-4" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.9375rem] font-[600]">{s.agent.name}</span>
                <span className="mono block truncate text-[0.6875rem] uppercase tracking-[0.06em] text-night-ink-2">Agent · free solopreneur pack</span>
              </span>
            </div>
            <span className="tag shrink-0 bg-white/[0.06] text-night-ink-2">Illustration</span>
          </div>

          <div className="relative min-h-[21rem] p-4 sm:min-h-[24rem] sm:p-6">
            <Stage key={`${sc}-${step}`} s={s} step={step} onApprove={() => goStep(4)} onEdit={() => goStep(2)} />
          </div>

          <div className="flex items-start gap-3 border-t border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[0.8125rem] text-night-ink-2 sm:px-5">
            <Icon name="shield" className="mt-px size-4 shrink-0 text-accent-night" />
            <span>
              <span className="text-night-ink">Rule:</span> {s.rule}
            </span>
          </div>
        </div>

        <figure className="mt-5 rounded-[12px] border border-rule bg-surface p-5 sm:p-6">
          <figcaption className="flex flex-wrap items-center justify-between gap-2">
            <span className="mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-2">The instruction you paste in</span>
            <Link href={`/packs/${livePack.id}`} className="tlink chev text-[0.9375rem]">
              From the free pack
            </Link>
          </figcaption>
          <blockquote className="mt-3 text-[1rem] leading-relaxed text-ink">“{s.agent.prompt}”</blockquote>
        </figure>
        <p className="mt-3 text-[0.875rem] text-ink-2">
          An illustration with made-up names and times, not a real account. The instruction is the pack’s own.
        </p>
      </div>
    </div>
  );
}

type S = (typeof scenarios)[number];

function Stage({ s, step, onApprove, onEdit }: { s: S; step: number; onApprove: () => void; onEdit: () => void }) {
  if (step === 0)
    return (
      <div className="swap-in grid gap-5">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-white/[0.06] text-accent-night ring-1 ring-white/10">
            <Icon name="clock" className="size-7" />
          </span>
          <div>
            <p className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">Runs</p>
            <p className="text-[clamp(1.5rem,3vw,2rem)] font-[620] leading-tight tracking-[-0.03em]">{s.runs.when}</p>
            <p className="text-[0.9375rem] text-night-ink-2">{s.runs.detail}</p>
          </div>
        </div>
        {s.runs.event ? (
          <div className="swap-in-late rounded-[12px] bg-night-3 p-4 ring-1 ring-white/[0.08]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.875rem] font-[600]">{s.runs.event.from}</span>
              <span className="tag bg-accent-night/15 text-accent-night">New</span>
            </div>
            <p className="mt-2 text-[1.0625rem]">“{s.runs.event.text}”</p>
          </div>
        ) : (
          <div className="swap-in-late grid grid-cols-7 gap-1.5" aria-hidden="true">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
              const on = s.agentId === "invoices" ? i === 0 : i < 5;
              return (
                <div key={i} className={`rounded-[8px] px-2 py-3 text-center ${on ? "bg-accent-night/15 text-accent-night ring-1 ring-accent-night/30" : "bg-white/[0.04] text-night-ink-2"}`}>
                  <span className="mono text-[0.75rem]">{d}</span>
                  <span className={`mx-auto mt-2 block size-1.5 rounded-full ${on ? "bg-accent-night" : "bg-white/15"}`} />
                </div>
              );
            })}
          </div>
        )}
        <p className="text-[0.9375rem] text-night-ink-2">
          {s.agent.does}
        </p>
      </div>
    );

  if (step === 1)
    return (
      <div className="swap-in grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono mr-1 text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">Connected</span>
          {s.agent.connect.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] ring-1 ring-white/[0.08]">
              <Icon name={connectIcon(c)} className="size-3.5 text-accent-night" />
              {c}
            </span>
          ))}
        </div>
        <ul className="grid gap-2">
          {s.reads.map((r, i) => (
            <li
              key={i}
              className="swap-in flex items-center gap-3 rounded-[10px] bg-night-3 px-4 py-3 ring-1 ring-white/[0.06]"
              style={{ animationDelay: `${120 + i * 220}ms` }}
            >
              <Icon name={r.icon} className="size-5 shrink-0 text-night-ink-2" />
              <span className="min-w-0 flex-1">
                <span className="mono block text-[0.6875rem] uppercase tracking-[0.06em] text-night-ink-2">{r.source}</span>
                <span className="block text-[0.9375rem]">{r.text}</span>
              </span>
              <Icon name="check" className="size-4 shrink-0 text-ok-night" strokeWidth={2} />
            </li>
          ))}
        </ul>
        <p className="text-[0.875rem] text-night-ink-2">It only sees the accounts you connected yourself, on your own login.</p>
      </div>
    );

  if (step === 2)
    return (
      <div className="swap-in">
        <Draft s={s} />
        <p className="mt-4 flex items-center gap-2 text-[0.875rem] text-night-ink-2">
          <Icon name="pen" className="size-4" /> Drafted in your voice. Unsent.
        </p>
      </div>
    );

  if (step === 3)
    return (
      <div className="swap-in grid gap-4">
        <Draft s={s} compact />
        <div className="swap-in-late rounded-[12px] bg-night-3 p-4 ring-1 ring-wait-night/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[0.9375rem] font-[600]">
              <span className="size-2 rounded-full bg-wait-night" aria-hidden="true" />
              Waiting for you
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={onEdit} className="btn btn-s btn-ghost border-white/20 text-night-ink hover:bg-white/[0.07]">
                Edit first
              </button>
              <button type="button" onClick={onApprove} className="btn btn-s bg-ok-night text-night hover:bg-[#9fe0b8]">
                <Icon name="check" className="size-3.5" strokeWidth={2.2} /> Approve
              </button>
            </div>
          </div>
          <p className="mt-2 text-[0.875rem] text-night-ink-2">Try it: approve the draft. In real life this lands in your own email or phone.</p>
        </div>
      </div>
    );

  return (
    <div className="swap-in grid gap-5">
      <div className="flex items-center gap-3 rounded-[12px] bg-ok-night/10 px-4 py-3 ring-1 ring-ok-night/30">
        <span className="grid size-8 place-items-center rounded-full bg-ok-night text-night">
          <Icon name="check" className="size-4" strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-[1rem] font-[600]">Approved by you</span>
          <span className="block text-[0.875rem] text-night-ink-2">{s.draft.subject}</span>
        </span>
      </div>
      <div>
        <p className="mono text-[0.75rem] uppercase tracking-[0.08em] text-night-ink-2">What happened, in order</p>
        <ol className="mt-3 grid gap-0">
          {s.trail.map((t, i) => {
            const last = i === s.trail.length - 1;
            return (
              <li key={i} className="swap-in grid grid-cols-[3.25rem_1rem_minmax(0,1fr)] items-start gap-2" style={{ animationDelay: `${i * 140}ms` }}>
                <span className="mono pt-[3px] text-right text-[0.8125rem] text-night-ink-2">{t.time}</span>
                <span className="relative flex h-full justify-center" aria-hidden="true">
                  <span className={`relative z-10 mt-[7px] size-2.5 rounded-full ${last ? "bg-ok-night" : "bg-white/25"}`} />
                  {!last && <span className="absolute top-[14px] bottom-0 w-px bg-white/12" />}
                </span>
                <span className={`pb-4 text-[0.9375rem] ${last ? "font-[600] text-night-ink" : "text-night-ink-2"}`}>{t.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Draft({ s, compact = false }: { s: S; compact?: boolean }) {
  return (
    <div className="rounded-[12px] bg-ground text-ink shadow-[0_20px_40px_-24px_rgb(0_0_0/0.8)]">
      <div className="grid gap-1 border-b border-rule px-4 py-3 text-[0.875rem]">
        <p className="flex gap-2">
          <span className="w-14 shrink-0 text-ink-2">To</span>
          <span className="min-w-0 truncate font-[560]">{s.draft.to}</span>
        </p>
        <p className="flex gap-2">
          <span className="w-14 shrink-0 text-ink-2">Subject</span>
          <span className="min-w-0 truncate">{s.draft.subject}</span>
        </p>
      </div>
      <p className={`px-4 py-4 text-[0.9375rem] leading-relaxed ${compact ? "line-clamp-2" : ""}`}>{s.draft.body}</p>
      <div className="flex items-center justify-between border-t border-rule px-4 py-2.5">
        <span className="tag bg-ground-2 text-ink-2">Draft · unsent</span>
        <span className="mono text-[0.75rem] text-ink-2">from your account</span>
      </div>
    </div>
  );
}
