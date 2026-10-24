import { generateText, Output } from "ai";
import { z } from "zod";
import { categoryLabel, type UseCaseCategory } from "@/data/library";
import { PERSONAS } from "@/lib/ingest/extract";

export type ToRewrite = {
  postId: string;
  category: UseCaseCategory;
  miss: boolean;
  handle: string;
  agent: string;
  summary: string;
};

const Entry = z.object({
  postId: z.string(),
  title: z.string().describe("Our own words, max 70 characters, sentence case, no hype. Start with what got done, usually a past-tense verb; never start with 'Bot', 'Agent' or the product name. Examples: 'Booked an oil change from a screenshot', 'Caught a double charge on the water bill'."),
  summary: z.string().describe("Our own words, one or two sentences on what the agent did and the result."),
  persona: z.enum(PERSONAS).describe("Who this is most useful for."),
  tool: z.string().describe("The agent's product name, cleaned up, or empty if the note doesn't name one."),
});

export type Rewritten = z.infer<typeof Entry>;

/**
 * Turns Lomax's research notes into library entries. The sheet has already
 * decided these are use cases and where they go; this only writes the words.
 */
export async function rewrite(rows: ToRewrite[]): Promise<Rewritten[]> {
  if (!rows.length) return [];
  const { output } = await generateText({
    model: process.env.INGEST_MODEL ?? "anthropic/claude-haiku-4.5",
    output: Output.object({ schema: z.object({ entries: z.array(Entry) }) }),
    system:
      "You write entries for a public library of real-world AI agent use cases. Each input is a researcher's note about one public post where someone described what their personal AI agent did for them, or how it let them down. Write a short title and a one- or two-sentence summary in plain, warm, specific language, fully in your own words. Use only facts in the note: never invent details, names or numbers. Leave out the post's own view, like and repost counts (results the agent achieved, like views on a channel it runs, are fine). Titles: 70 characters at most, saying what got done, not 'Bot does X'. For a let-down, say plainly what went wrong without mocking anyone. Refer to the author as 'they' unless the note says otherwise. Plain punctuation: no em dashes, no exclamation marks. For tool, use the product's usual name (for example 'Meta Muse' becomes 'Muse', 'Grok' becomes 'Grok Bot'); several agents may be joined with ' + '; leave it empty for generic labels like 'AI agent', 'AI assistant' or 'Unspecified'.",
    prompt: `Return one entry per note, same postId.\n\n${rows
      .map(
        (r) =>
          `<note postId="${r.postId}" category="${categoryLabel(r.category)}" kind="${r.miss ? "let-down" : "win"}" author="${r.handle}" agent="${r.agent.replace(/"/g, "'")}">\n${r.summary.slice(0, 800)}\n</note>`,
      )
      .join("\n\n")}`,
  });
  return output.entries.map((e) => ({ ...e, tool: cleanTool(e.tool) }));
}

/** The model mostly gets this right; these are the slips seen in the sheet. */
function cleanTool(t: string) {
  return t
    .replace(/\bMeta Muse\b/gi, "Muse")
    .replace(/\bGrok\b(?! Bot)/g, "Grok Bot")
    .replace(/^(unspecified|unknown|none|n\/a|ai (agent|assistant)s?)$/i, "")
    .trim();
}
