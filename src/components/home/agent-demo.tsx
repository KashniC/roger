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
type S = (typeof scenarios)[number];

/**
 * An agent console: four agents from the free pack, each followed from the
 * moment it runs to the moment you approve what it drafted. Plays on its own
 * while on screen; any click hands control to the visitor. Example data,
 * labelled as such; the instructions are the pack's own.
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
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = auto && !reduced && inView;
  useEffect(() => {
    if (!playing) return;
    const last = step === demoSteps.length - 1;
    const t = setTimeout(() => {
      if (!last) setStep(step + 1);
      else {
        setSc((sc + 1) % scenarios.length);
        setStep(0);
      }
    }, last ? STEP_MS + 1600 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, sc]);

  const s = scenarios[sc];
  const take = () => setAuto(false);
  const goStep = (i: number) => {
    take();
    setStep(i);
  };
  const pick = (i: number) => {
    take();
    setSc(i);
    setStep(0);
  };

  return (
    <div ref={ref}>
      <div className="window rounded-[20px] shadow-[0_0_0_1px_rgb(255_255_255/0.09),0_60px_120px_-40px_rgb(0_0_0/0.9)]">
        {/* title bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3 sm:px-5">
          <span className="flex items-center gap-4">
            <span className="chrome-dots" aria-hidden="true"><span /><span /><span /></span>
            <span className="text-[0.875rem] font-[600]">Your agents</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="tag bg-white/[0.06] text-night-ink-2">Illustration</span>
            {!reduced && (
              <button
                type="button"
                onClick={() => setAuto(!auto)}
                className="grid size-8 place-items-center rounded-full bg-white/[0.06] text-night-ink transition-colors hover:bg-white/[0.12]"
                aria-label={auto ? "Pause the walkthrough" : "Play the walkthrough"}
              >
                {auto ? (
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2" width="2.5" height="8" rx="0.6" /><rect x="7" y="2" width="2.5" height="8" rx="0.6" /></svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="ml-px size-2.5" fill="currentColor" aria-hidden="true"><path d="M3 2v8l7-4z" /></svg>
                )}
              </button>
            )}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
          {/* sidebar: the agents */}
          <div className="border-b border-white/[0.07] p-3 lg:border-b-0 lg:border-r lg:p-4">
            <p className="kicker hidden px-2 pb-3 pt-1 text-night-ink-2 lg:block">From the free pack</p>
            <div role="tablist" aria-label="Agents" className="flex gap-1.5 overflow-x-auto scrollbar-none lg:flex-col lg:gap-1">
              {scenarios.map((x, i) => {
                const on = i === sc;
                return (
                  <button
                    key={x.agentId}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls="demo-stage"
                    onClick={() => pick(i)}
                    className={`flex shrink-0 items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-200 lg:w-full ${on ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                  >
                    <span className={`grid size-8 shrink-0 place-items-center rounded-[8px] ${on ? "bg-accent-night text-night" : "bg-white/[0.06] text-night-ink-2"}`}>
                      <Icon name={connectIcon(x.agent.connect[0])} className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-[0.9375rem] font-[600] ${on ? "text-night-ink" : "text-night-ink-2"}`}>{x.agent.name}</span>
                      <span className="hidden truncate text-[0.75rem] text-night-ink-2 lg:block">{x.runs.when}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <Link href={`/packs/${livePack.id}`} className="mt-3 hidden items-center gap-2 rounded-[10px] px-3 py-2.5 text-[0.8125rem] text-night-ink-2 transition-colors hover:text-accent-night lg:flex">
              <Icon name="plus" className="size-4" /> {livePack.agents.length - scenarios.length} more in the pack
            </Link>
          </div>

          {/* main: rail and stage */}
          <div className="min-w-0">
            <div className="px-4 pt-5 sm:px-7 sm:pt-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-[650] tracking-[-0.035em]">{s.agent.name}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {s.agent.connect.map((c) => (
                    <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.75rem] text-night-ink-2">
                      <Icon name={connectIcon(c)} className="size-3.5 text-accent-night" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* the rail */}
              <ol className="relative mt-7 grid grid-cols-5">
                <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[15px] h-px bg-white/10" />
                <span
                  aria-hidden="true"
                  className="absolute left-[10%] top-[15px] h-px bg-accent-night transition-[width] duration-700"
                  style={{ width: `${(step / (demoSteps.length - 1)) * 80}%` }}
                />
                {demoSteps.map((d, i) => {
                  const on = i === step;
                  const done = i < step;
                  return (
                    <li key={d.id} className="relative flex justify-center">
                      <button type="button" aria-current={on ? "step" : undefined} onClick={() => goStep(i)} className="group flex flex-col items-center gap-2 rounded-[8px] px-1 text-center">
                        <span
                          className={`grid size-[31px] place-items-center rounded-full text-[0.75rem] transition-all duration-300 ${
                            on ? "bg-accent-night text-night shadow-[0_0_0_6px_rgb(232_169_127/0.15)]" : done ? "bg-night-ink text-night" : "bg-night-3 text-night-ink-2 ring-1 ring-white/15 group-hover:ring-white/40"
                          }`}
                        >
                          {done ? <Icon name="check" className="size-3.5" strokeWidth={2.4} /> : <span className="mono">{i + 1}</span>}
                        </span>
                        <span className={`text-[0.6875rem] font-[600] leading-tight sm:text-[0.8125rem] ${on ? "text-night-ink" : "text-night-ink-2"}`}>{d.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div id="demo-stage" role="tabpanel" aria-live={playing ? "off" : "polite"} className="relative min-h-[17rem] px-4 pb-7 pt-7 sm:min-h-[22rem] sm:px-7">
              <Stage key={`${sc}-${step}`} s={s} step={step} onApprove={() => goStep(4)} onEdit={() => goStep(2)} />
              {playing && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.04]">
                  <span key={`${sc}-${step}`} className="progress-bar progress-run block h-full bg-accent-night/70" style={{ "--dur": `${STEP_MS}ms` } as React.CSSProperties} />
                </span>
              )}
            </div>
          </div>

        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/[0.07] px-4 py-3 text-[0.8125rem] text-night-ink-2 sm:px-5">
          <span className="flex items-center gap-2">
            <Icon name="shield" className="size-4 shrink-0 text-accent-night" />
            {s.rule}
          </span>
          <span>Made-up names and times; the agents are the free pack’s own.</span>
        </div>
      </div>
    </div>
  );
}

function Stage({ s, step, onApprove, onEdit }: { s: S; step: number; onApprove: () => void; onEdit: () => void }) {
  if (step === 0)
    return (
      <div className="swap-in grid gap-7">
        <div>
          <p className="kicker text-night-ink-2">Runs</p>
          <p className="display mt-3 text-[clamp(2.25rem,4vw,3.25rem)] leading-[0.95]">{s.runs.when}</p>
          <p className="mt-3 text-[1rem] text-night-ink-2">{s.runs.detail}</p>
        </div>
        {s.runs.event ? (
          <div className="swap-in-late rounded-[14px] bg-night-3 p-5 ring-1 ring-white/[0.08]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.875rem] font-[600]">{s.runs.event.from}</span>
              <span className="tag bg-accent-night/15 text-accent-night">New</span>
            </div>
            <p className="mt-3 text-[1.125rem] leading-snug">“{s.runs.event.text}”</p>
          </div>
        ) : (
          <div className="swap-in-late grid grid-cols-7 gap-1.5" aria-hidden="true">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
              const on = s.agentId === "invoices" ? i === 0 : i < 5;
              return (
                <div key={i} className={`rounded-[10px] px-1 py-4 text-center ${on ? "bg-accent-night/15 text-accent-night ring-1 ring-accent-night/30" : "bg-white/[0.04] text-night-ink-2"}`}>
                  <span className="mono text-[0.75rem]">{d}</span>
                  <span className={`mx-auto mt-3 block size-1.5 rounded-full ${on ? "bg-accent-night" : "bg-white/15"}`} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

  if (step === 1)
    return (
      <ul className="swap-in grid gap-2.5 sm:grid-cols-3">
        {s.reads.map((r, i) => (
          <li key={i} className="swap-in rounded-[14px] bg-night-3 p-4 ring-1 ring-white/[0.06]" style={{ animationDelay: `${120 + i * 200}ms` }}>
            <span className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-[10px] bg-white/[0.06] text-accent-night">
                <Icon name={r.icon} className="size-[18px]" />
              </span>
              <Icon name="check" className="size-4 text-ok-night" strokeWidth={2.2} />
            </span>
            <span className="kicker mt-4 block text-night-ink-2">{r.source}</span>
            <span className="mt-1 block text-[1rem] font-[560] leading-snug">{r.text}</span>
          </li>
        ))}
      </ul>
    );

  if (step === 2 || step === 3)
    return (
      <div className="swap-in grid gap-4">
        <Draft s={s} />
        {step === 3 && (
          <div className="swap-in-late flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-wait-night/10 px-4 py-3 ring-1 ring-wait-night/30">
            <span className="flex items-center gap-2 text-[0.9375rem] font-[600]">
              <span className="breathe size-2 rounded-full bg-wait-night" aria-hidden="true" />
              Waiting for you. Try it:
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={onEdit} className="btn btn-s btn-ghost">
                Edit first
              </button>
              <button type="button" onClick={onApprove} className="btn btn-s bg-ok-night text-night hover:bg-[#9fe0b8]">
                <Icon name="check" className="size-3.5" strokeWidth={2.2} /> Approve
              </button>
            </span>
          </div>
        )}
      </div>
    );

  return (
    <div className="swap-in grid gap-4">
      <Draft s={s} sent />
      <div className="flex items-center gap-3 rounded-[14px] bg-ok-night/10 px-4 py-3 ring-1 ring-ok-night/30">
        <span className="grid size-7 place-items-center rounded-full bg-ok-night text-night">
          <Icon name="check" className="size-3.5" strokeWidth={2.4} />
        </span>
        <span className="text-[0.9375rem] font-[600]">Approved by you. It goes from your own account.</span>
      </div>
    </div>
  );
}

function Draft({ s, sent = false }: { s: S; sent?: boolean }) {
  return (
    <div className="rounded-[14px] bg-ground text-ink shadow-[0_24px_50px_-28px_rgb(0_0_0/0.9)]">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <span className="min-w-0 text-[0.875rem]">
          <span className="text-ink-2">To </span>
          <span className="font-[600]">{s.draft.to}</span>
        </span>
        <span className={`tag shrink-0 ${sent ? "bg-ok/10 text-ok" : "bg-ground-2 text-ink-2"}`}>{sent ? "Approved" : "Draft · unsent"}</span>
      </div>
      <div className="px-5 py-4">
        <p className="text-[1.0625rem] font-[640] tracking-[-0.015em]">{s.draft.subject}</p>
        <p className="mt-2 text-[1rem] leading-relaxed text-ink/85">{s.draft.body}</p>
      </div>
    </div>
  );
}
