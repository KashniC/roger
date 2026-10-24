import { generateText, Output } from "ai";
import { z } from "zod";
import type { RawPost } from "./sources";

export const CATEGORIES = [
  "chief-of-staff",
  "money",
  "marketing",
  "solo",
  "customers",
  "bookkeeping",
  "travel",
  "household",
  "errands",
  "kids",
  "caregiving",
  "health",
  "learning",
  "staff",
  "shop-ops",
] as const;

export const PERSONAS = ["solopreneur", "household", "caregiving", "business", "everyone"] as const;

const Verdict = z.object({
  externalId: z.string(),
  isUseCase: z.boolean().describe("True only if the post describes a concrete thing a personal AI agent or assistant actually did, or honestly failed to do, for the author."),
  reason: z.string().describe("One short sentence on why it was accepted or rejected."),
  title: z.string().max(80).describe("Our own words, max 70 characters, sentence case, no hype. Example: 'Booked an oil change from a screenshot'."),
  summary: z.string().max(260).describe("Our own words, one or two sentences on what the agent did and the result. Never copy the post's wording."),
  category: z.enum(CATEGORIES),
  persona: z.enum(PERSONAS).describe("Who this is most useful for."),
  forHome: z.boolean().describe("True for personal or family life, false for work."),
  tool: z.string().describe("The agent named in the post (Muse, Grok Bot, Hark, Poke, ChatGPT, Claude, OpenClaw…) or empty if none is named."),
  outcome: z.enum(["win", "honest-miss"]),
});

export type Extracted = z.infer<typeof Verdict>;

/** Reads a batch of raw posts and keeps only the real use cases, rewritten in our words. */
export async function extract(posts: RawPost[]): Promise<Extracted[]> {
  if (!posts.length) return [];
  const { output } = await generateText({
    model: process.env.INGEST_MODEL ?? "anthropic/claude-haiku-4.5",
    output: Output.object({ schema: z.object({ verdicts: z.array(Verdict) }) }),
    system:
      "You curate a public library of real-world AI agent use cases. Accept a post only when its author describes something specific their own AI agent or assistant did (or failed to do) for them. The library is about personal agents (Muse, Grok Bot, Hark, Poke and similar) running someone's life or small business: email, calendar, money, errands, family, customers, marketing, travel, health, learning. Reject software development, coding agents, devops, security research and AI-industry commentary, plus announcements, ads, product launches, opinions, jokes, questions, and anything you cannot verify from the text. Rewrite accepted ones fully in your own words: never quote or paraphrase closely, never invent details or numbers that aren't in the post. Plain punctuation: no em dashes.",
    prompt: `Return one verdict per post, in order.\n\n${posts
      .map((p) => `<post id="${p.externalId}" source="${p.source}" author="${p.handle}">\n${p.text.slice(0, 1500)}\n</post>`)
      .join("\n\n")}`,
  });
  return output.verdicts;
}
