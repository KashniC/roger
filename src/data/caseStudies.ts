/**
 * Named, measured pilot setups. A case study renders only when `permission`
 * is literally true. Never add one without the client's written permission.
 */
export type CaseStudy = {
  id: string;
  name: string;
  role: string;
  business: string;
  businessType: string;
  photo?: string;
  logo?: string;
  for: "home" | "work";
  /** The problem, in their words. */
  before: string;
  /** Menu ids from data/menu.ts. */
  setUp: string[];
  /** At least one, from the setup report. */
  metrics: { label: string; before: string; after: string }[];
  quote: string;
  permission: true;
  date: string;
};

export const caseStudies: CaseStudy[] = [];
