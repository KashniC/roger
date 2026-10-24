export type ProspectImage = "office" | "plant" | "warehouse" | "map" | "needle" | "exterior";

/** A private "prepared for" page: unlisted, noindex, sent by Peter before a meeting. */
export type Prospect = {
  slug: string;
  company: string;
  meeting: { label: string; subject: string };
  hero: { kicker: string; headline: string; sub: string };
  heard: { heading: string; told: string[]; publicHeading: string; public: string[] };
  hypotheses: { heading: string; sub: string; items: { title: string; image: ProspectImage; body: string; ask: string }[] };
  session: { heading: string; room: string };
  prep: { heading: string; sub: string; items: string[] };
  close: { heading: string; sub: string };
};
