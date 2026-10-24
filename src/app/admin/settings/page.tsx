import { connection } from "next/server";
import { SettingsEditor } from "@/components/admin-ui";
import { getSettings } from "@/lib/settings";

export default async function AdminSettings() {
  await connection();
  const s = await getSettings();
  return (
    <section className="max-w-[52rem]">
      <h1 className="text-h3">Settings</h1>
      <p className="mt-2 mb-8 text-small text-ink-2">Changes go live on the site within a minute. Keys and passwords stay in Vercel, not here.</p>
      <SettingsEditor s={s} />
    </section>
  );
}
