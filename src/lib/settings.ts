import { cacheLife, cacheTag } from "next/cache";
import { flags, siteConfig } from "@/data/config";
import { hasDb, sql } from "./db";

/**
 * The values Peter edits in /admin. Defaults come from data/config.ts; anything
 * saved in the admin overrides them. Cached and tagged "settings", so a save
 * refreshes every page that shows them.
 */
export type Settings = {
  founderFullName: string;
  founderPhone: string;
  founderPhoto: string;
  founderBio: string[];
  bioApproved: boolean;
  setupPrice: number;
  planPrice: number;
  setupCall: string;
  setupCheckout: string;
  planCheckout: string;
  companyCall: string;
  companyTermsConfirmed: boolean;
};

export const defaultSettings: Settings = {
  founderFullName: siteConfig.founder.fullName,
  founderPhone: siteConfig.founder.phone,
  founderPhoto: siteConfig.founder.photo,
  founderBio: [...siteConfig.founder.bio],
  bioApproved: flags.bioApproved,
  setupPrice: siteConfig.ladder.setupPrice,
  planPrice: siteConfig.ladder.planPrice,
  setupCall: siteConfig.ladder.setupCall,
  setupCheckout: siteConfig.ladder.setupCheckout,
  planCheckout: siteConfig.ladder.planCheckout,
  companyCall: siteConfig.cal.companyCall,
  companyTermsConfirmed: flags.companyTermsConfirmed,
};

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 86400 });
  cacheTag("settings");
  if (!hasDb()) return defaultSettings;
  try {
    const rows = (await sql`select key, value from settings`) as { key: keyof Settings; value: unknown }[];
    const out = { ...defaultSettings } as Record<string, unknown>;
    for (const r of rows) if (r.key in defaultSettings) out[r.key] = r.value;
    return out as Settings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(patch: Partial<Settings>) {
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in defaultSettings)) continue;
    await sql`insert into settings (key, value, updated_at) values (${k}, ${JSON.stringify(v)}::jsonb, now())
              on conflict (key) do update set value = excluded.value, updated_at = now()`;
  }
}
