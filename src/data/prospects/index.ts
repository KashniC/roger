import type { Prospect } from "./types";
import { winters } from "./winters";

/** Add a prospect: write its file next to winters.ts and list it here. */
export const prospects: Prospect[] = [winters];

export function prospectBySlug(slug: string) {
  return prospects.find((p) => p.slug === slug);
}

export type { Prospect } from "./types";
