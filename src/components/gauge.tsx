import type { CSSProperties, ReactNode } from "react";

const START = -135;
const SWEEP = 270;

function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: 250 + Math.sin(a) * r, y: 250 - Math.cos(a) * r };
}

export function needleAngle(value: number, max: number) {
  return START + SWEEP * Math.max(0, Math.min(1, value / max));
}

type DialProps = {
  value: number;
  max: number;
  /** Labelled every `major` units, a minor tick every `minor`. */
  major: number;
  minor: number;
  /** The big reading in the middle of the face. */
  readout: ReactNode;
  label: string;
  className?: string;
};

/**
 * A pressure gauge, the instrument Roger's first client makes, reading hours
 * instead of psi: chrome bezel, a dark glass face lit from below, a needle on
 * a spring. The face is drawn on the server, so it is complete without
 * JavaScript; the needle's angle comes from `value` and eases to every change.
 */
export function Gauge({ value, max, major, minor, readout, label, className = "" }: DialProps) {
  const steps = Math.round(max / minor);
  const every = Math.round(major / minor);
  const ticks = Array.from({ length: steps + 1 }, (_, i) => {
    const deg = START + (SWEEP / steps) * i;
    const isMajor = i % every === 0;
    return { a: polar(deg, isMajor ? 172 : 186), b: polar(deg, 200), isMajor, deg, value: i * minor };
  });

  return (
    <div className={`gauge ${className}`} role="img" aria-label={label}>
      <div className="gauge-face">
        <svg viewBox="0 0 500 500" aria-hidden="true">
          <path d={arc(START, START + SWEEP, 208)} fill="none" stroke="rgb(245 245 247 / .07)" strokeWidth="8" />
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.a.x}
              y1={t.a.y}
              x2={t.b.x}
              y2={t.b.y}
              stroke={t.isMajor ? "rgb(245 245 247 / .9)" : "rgb(245 245 247 / .4)"}
              strokeWidth={t.isMajor ? 4 : 2}
              strokeLinecap="round"
            />
          ))}
          {ticks
            .filter((t) => t.isMajor)
            .map((t) => {
              const p = polar(t.deg, 146);
              return (
                <text key={t.deg} x={p.x} y={p.y + 6} textAnchor="middle" fontSize="17" fontWeight="550" fill="rgb(245 245 247 / .6)" fontFamily="var(--font-mona), system-ui, sans-serif">
                  {t.value}
                </text>
              );
            })}
          <g className="gauge-needle" style={{ "--angle": `${needleAngle(value, max)}deg` } as CSSProperties}>
            <path d="M246 262 L250 66 L254 262 Z" fill="#f0b88f" />
            <circle cx="250" cy="250" r="16" fill="#e6e8ec" />
            <circle cx="250" cy="250" r="6" fill="#9a9ea6" />
          </g>
        </svg>
        <div className="gauge-read">{readout}</div>
      </div>
    </div>
  );
}

function arc(fromDeg: number, toDeg: number, r: number) {
  const a = polar(fromDeg, r);
  const b = polar(toDeg, r);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M${a.x} ${a.y} A${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}
