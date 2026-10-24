---
date: 2026-10-24
topic: sheet-sync
---

# Sync the Lomax use-case sheet into the Roger library

## Problem Frame

A separate daily job ("Lomax", running on Grok Bot) curates X posts about personal-agent use cases into a Google Sheet: 2,454 posts across 16 category tabs as of 2026-10-24, growing ~60–120 a day. Roger's public library holds 33 seed entries and its own intake has no X/xAI keys, so it barely grows. The sheet is the better-curated source; the library should reflect it automatically, every day, with no change to the Lomax job.

Sheet: `https://docs.google.com/spreadsheets/d/1DPOUO-25qQs1AFOqgjoxdktx4C-be1lXX1s35JH6zZw` (shared "anyone with the link can view"). Each category tab has the columns `Post ID, Post Date (ET), Author, Summary, Agent, Likes, Views, Reposts, Tag, URL, Date Added, Source, Used in Post`. Non-data tabs (`Run Log`, `Lomax`, `Studs`) are ignored.

```
Lomax (Grok Bot, daily) ──writes──▶ Google Sheet (source of truth)
                                          │  hourly, read-only CSV export
                                          ▼
                              Roger sync job ──▶ AI rewrite (new/changed rows) ──▶ use_cases ──▶ meetroger.ai
```

## Requirements

**Sync**
- R1. Every hour, Roger reads every category tab of the sheet and brings the library in line with it. No change to the Lomax job is needed.
- R2. The first run is the backfill: all ~2,340 eligible existing rows. Later runs pick up only new or changed rows.
- R3. A row is identified by its Post ID (falling back to URL). Re-running the sync never creates duplicates.
- R4. Tabs are discovered from the sheet, not hard-coded, so a renamed or reordered tab doesn't break the sync. A tab that maps to no Roger category is skipped and reported (R13).

**What goes in**
- R5. Only rows tagged `USE CASE` (shown as a win) or `CAUTION` (shown as an honest miss) enter the library. `NEWS`, `FRAMING`, `BIA ANGLE`, `DATA`, `DEMAND`, `ADOPTION` and any unknown tag stay sheet-only.
- R6. The sheet's tab decides the category and its tag decides whether the row is included. The AI does not re-judge inclusion.

**Categories (17)**
- R7. Roger gains two categories: **Teams** (work) and **Homework & School** (home). The mapping is 1:1: Chief of Staff, Household, Money, Bookkeeping, Shop Ops→Shop operations, Errands, Customers, Caregiving, Kids - General→Kids, Homework & School, Teams, Travel, Solo→Solo business, Health, Marketing, Staff. Learning stays for adult learning; no tab feeds it today.

**Wording**
- R8. For each new row, the AI writes a library title and summary in Roger's voice (own words, no hype, no em dashes, no invented details) from the sheet's summary. It also picks the persona and home/work and normalizes the agent name (for example "Meta Muse"→Muse; "Unspecified"/"AI agent"→empty).
- R9. A row is rewritten only when it's new or its sheet summary changed. Engagement-number refreshes alone never trigger a rewrite.

**Updates**
- R10. When Lomax moves a post to another tab, its library category follows. When its tag changes to an excluded one, it leaves the library; when it changes back, it returns.
- R11. When a row disappears from the sheet (deleted or de-duplicated by Lomax), its library entry is removed. This applies only to entries that came from the sheet, never to seed, push or Roger-intake entries.
- R12. When a sheet post's URL matches an entry Roger already has from another source, the sheet's category and tag win. The entry is not duplicated.

**Visibility**
- R13. Each sync appears in /admin's run log: rows read, added, updated, removed, skipped (by reason), and any tab or column problems. If the sheet can't be read or its columns change, the run fails loudly in the log and changes nothing.

## Success Criteria
- After the backfill, the library shows ~2,300 entries across 17 categories, each linking to its original X post, with readable titles and no "(274K views)"-style notes.
- The day after Lomax adds N eligible posts, the library has N more, with no manual step.
- Running the sync twice in a row changes nothing the second time.

## Scope Boundaries
- No writes back to the sheet.
- Engagement numbers (likes/views/reposts) and "Used in Post" are not shown on the site. They may be stored if that's free, but no ranking by them for now.
- No changes to the Lomax/Grok Bot job, `/api/push`, or Roger's own X/Grok/HN intake, which keeps running alongside.
- User accounts and per-user custom searches are a separate brainstorm.

## Key Decisions
- Roger pulls instead of Lomax pushing: no change to the bot, and the sheet stays the single source of truth.
- Trust the sheet's tab and tag; use AI for wording only. Lomax already curates, and a second judge would silently drop rows.
- CAUTION → honest miss: a sample confirmed these are mostly agents failing or misbehaving.
- 17 categories: every tab maps 1:1, and Learning is kept.

## Dependencies / Assumptions
- The sheet stays link-viewable. If it's made private, the sync fails visibly (R13) and the library keeps what it has.
- The AI Gateway is used for rewriting and needs paid credits (the free tier blocks Claude Haiku; credits were added 2026-10-24). The backfill costs about $1.50 once; daily runs cost cents.
- Lomax finishes its run before Roger syncs (it has been running mornings ET).

## Outstanding Questions

### Deferred to Planning
- Resolved in build: the sync runs hourly with a 4-minute rewrite budget per run, so the ~2,300-row backfill drains in the first couple of hours and no-op runs aren't logged.

## Next Steps
-> /ce:plan, then implement
