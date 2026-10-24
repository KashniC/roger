/**
 * What an agent from the pack sends you, as an example. Shown beside the
 * prompt, so the page shows both halves: what you paste, what you get back.
 * The names and numbers are made up for the example.
 */
const samples: Record<
  string,
  {
    from: string;
    when: string;
    title: string;
    lines: { k?: string; v: string }[];
    foot: string;
  }
> = {
  brief: {
    from: "Morning brief",
    when: "Tue 6:45am",
    title: "Your Tuesday",
    lines: [
      {
        k: "9:30",
        v: "Call with Dana: renewal. She asked about pricing last week.",
      },
      { k: "2:00", v: "Dentist. Leave by 1:40." },
      { k: "Replies", v: "Marco is waiting on the kitchen quote (2 days)." },
      { k: "Overdue", v: "Invoice 1042 to Brightside, 12 days." },
    ],
    foot: "First thing: send Marco the quote.",
  },
  inbox: {
    from: "Inbox drafts",
    when: "Draft, not sent",
    title: "Re: Can we move Thursday?",
    lines: [
      {
        v: "Hi Sam, Thursday’s tricky, but Friday at 10 or 2 works on my end. Want me to send an invite for one of those?",
      },
      { v: "Alex" },
    ],
    foot: "Checked your calendar: both times are free.",
  },
  leads: {
    from: "Lead follow-up",
    when: "Today 11:12am",
    title: "New enquiry: Priya, bathroom reno",
    lines: [
      { k: "Asked", v: "A quote by Friday, photos attached." },
      {
        k: "Drafted",
        v: "Thanks Priya, I can come by Wednesday at 4 or Thursday at 9 to measure.",
      },
      {
        k: "Nudge",
        v: "If she hasn’t answered by Saturday, a short follow-up is ready.",
      },
    ],
    foot: "Waiting for your OK to send.",
  },
};

export function hasSample(id: string) {
  return id in samples;
}

export function AgentOutput({ id }: { id: string }) {
  const s = samples[id];
  if (!s) return null;
  return (
    <figure>
      <div
        data-ui
        className="rounded-[8px] bg-night-2 p-5 text-[0.9375rem] text-night-ink sm:p-6"
      >
        <p className="flex justify-between gap-4 text-[0.8125rem] text-night-ink-2">
          <span>{s.from}</span>
          <span>{s.when}</span>
        </p>
        <p className="mt-2 text-[1.125rem] font-[600] tracking-[-0.015em]">
          {s.title}
        </p>
        <dl className="mt-3 space-y-1.5">
          {s.lines.map((l, i) => (
            <div
              key={i}
              className={
                l.k ? "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3" : ""
              }
            >
              {l.k && <dt className="text-night-ink-2">{l.k}</dt>}
              <dd>{l.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-[6px] bg-white/[0.06] px-3 py-2 text-accent-night">
          {s.foot}
        </p>
      </div>
      <figcaption className="mt-2 text-[0.875rem] text-ink-2">
        An example of what it sends you. Names are made up.
      </figcaption>
    </figure>
  );
}
