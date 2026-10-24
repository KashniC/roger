import type { CSSProperties } from "react";
import "./phone.css";
import { scenes, type SceneId } from "./scenes";
import { Wallpaper } from "./wallpaper";

/** One message from the assistant. `title` is the job it came from. */
export type Note = { id: string; title: string; time: string; body: string; app?: string };

type Props = {
  /** One scene, or several stacked so the active one can cross-fade. */
  scene: SceneId;
  scenesToRender?: SceneId[];
  date: string;
  time: string;
  notes: Note[];
  /** Notes past this index tuck behind the newest ones. */
  expanded?: number;
  /** Staggered arrival on first paint (the hero), or only the newest. */
  arrive?: "stagger" | "latest" | "none";
  /** "device": the whole phone. "crop": the top of the screen only, no bezel, fading out. */
  variant?: "device" | "crop";
  width?: number;
  label: string;
  /** Shown as a single quiet plate when there are no notes. */
  empty?: string;
  /** Unique per phone on a page (keeps SVG gradient ids distinct). */
  uid: string;
  className?: string;
};

/** The assistant's app glyph: a sun clearing the horizon. Neutral, not any vendor's. */
export function AssistantGlyph() {
  return (
    <span className="ph-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 15.5a7 7 0 0 1 14 0" stroke="#f1c29a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3.5 18.5h17" stroke="#f5f5f7" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * The product, shown where it lives: an assistant's messages arriving on a
 * phone's lock screen over a painted Toronto skyline. Notes are newest first.
 */
export function LockScreen({
  scene,
  scenesToRender,
  date,
  time,
  notes,
  expanded = 4,
  arrive = "none",
  variant = "device",
  width,
  label,
  empty,
  uid,
  className = "",
}: Props) {
  const sc = scenes[scene];
  const layers = scenesToRender ?? [scene];
  // the crop shows the top of the wallpaper: sky, the tower crossing the clock
  const preserve = variant === "crop" ? "xMidYMin slice" : undefined;
  const screen = (
    <div className={`ph-screen ${sc.glass === "dark" ? "ph-dark" : "ph-light"} ${variant === "crop" ? "ph-screen-crop" : ""} ${arrive === "stagger" ? "ph-stagger" : ""}`}>
      {layers.map((id) => (
        <div key={id} className="ph-layer" style={{ opacity: id === scene ? 1 : 0 }}>
          <Wallpaper id={id} uid={uid} className="ph-layer" preserve={preserve} />
        </div>
      ))}
      <div className="ph-clock" style={{ "--clock": sc.clock } as CSSProperties} aria-hidden="true">
        <p className="ph-date">{date}</p>
        <p className="ph-time">
          <span key={time} className={`ph-time-inner ${arrive !== "none" ? "ph-tick" : ""}`}>
            {time}
          </span>
        </p>
      </div>
      {variant === "device" && <span className="ph-island" />}
      <ol className={`ph-stack ${variant === "crop" ? "ph-stack-top" : ""}`} aria-hidden="true">
        {notes.length === 0 && empty && (
          <li className="ph-note ph-note-empty">
            <p className="ph-note-body">{empty}</p>
          </li>
        )}
        {notes.map((n, i) => {
          const collapsed = i >= expanded;
          const animate = arrive === "stagger" || (arrive === "latest" && i === 0);
          return (
            <li
              key={n.id}
              className={`ph-note ${collapsed ? "ph-collapsed" : ""} ${animate ? "ph-arrive" : ""}`}
              style={arrive === "stagger" ? ({ "--delay": `${350 + (notes.length - 1 - i) * 850}ms` } as CSSProperties) : undefined}
            >
              <AssistantGlyph />
              <p className="ph-note-app">
                {n.app ?? "Assistant"} <span>{n.time}</span>
              </p>
              <p className="ph-note-title">{n.title}</p>
              <p className="ph-note-body">{n.body}</p>
            </li>
          );
        })}
      </ol>
      {variant === "device" && (
        <>
          <div className="ph-shortcuts" aria-hidden="true">
            <span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M7 2h6l-1 5H8L7 2zM8 7h4v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7z" />
              </svg>
            </span>
            <span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h2l1.5-2h3L13 5h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                <circle cx="10" cy="10.5" r="3" />
              </svg>
            </span>
          </div>
          <span className="ph-homebar" />
        </>
      )}
    </div>
  );

  return (
    <figure className={`m-0 ${variant === "crop" ? "h-full" : ""} ${className}`}>
      {variant === "device" ? (
        <div className="ph-device" style={width ? ({ "--w": `${width}px` } as CSSProperties) : undefined} role="img" aria-label={label}>
          {screen}
        </div>
      ) : (
        <div className="ph-crop" role="img" aria-label={label}>
          {screen}
        </div>
      )}
    </figure>
  );
}
