/**
 * One line-icon family for the site: a 24 grid, 1.6 stroke, round joins.
 * Decorative by default; give the surrounding text the meaning.
 */
const paths = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  tasks: <path d="M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17" />,
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </>
  ),
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  notes: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" />,
  bank: <path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  bell: <path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  shield: <path d="M12 3.5 19 6v6c0 4.2-3 7.4-7 8.5-4-1.1-7-4.3-7-8.5V6zM9 12l2 2 4-4" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5" />
    </>
  ),
  pen: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  sunrise: (
    <>
      <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
      <path d="M12 5v3M5.3 9.3l1.6 1.6M18.7 9.3l-1.6 1.6M3 17h18M7 20.5h10" />
    </>
  ),
  filter: <path d="M4 5h16l-6 7.5V19l-4 1.5v-8z" />,
  shelves: <path d="M3.5 4h4v16h-4zM9.5 4h4v16h-4zM15.3 5.3l3.4-.9 2.9 14.9-3.4.9z" />,
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16 7l2.5 2.5M18.5 4.5 21 7" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", strokeWidth = 1.6 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** The accounts the pack's agents connect to, each with its icon. */
export function connectIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("email")) return "mail";
  if (l.includes("calendar")) return "calendar";
  if (l.includes("task")) return "tasks";
  if (l.includes("files")) return "file";
  if (l.includes("accounting")) return "receipt";
  if (l.includes("card")) return "card";
  if (l.includes("bank")) return "bank";
  if (l.includes("recorder")) return "mic";
  if (l.includes("notes")) return "notes";
  if (l.includes("social")) return "chat";
  if (l.includes("google business")) return "star";
  if (l.includes("website")) return "globe";
  return "plus";
}
