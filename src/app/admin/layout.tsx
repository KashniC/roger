import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { AdminTabs, LoginForm } from "@/components/admin-ui";
import { isAdmin } from "@/lib/admin-auth";
import { hasDb } from "@/lib/db";
import { signOutAction } from "./actions";

export const metadata: Metadata = { title: { absolute: "Admin · Roger" }, robots: { index: false, follow: false } };

/** Behind a login: it renders per request, so there is no instant shell to keep. */
export const instant = false;

async function Gate({ children }: { children: React.ReactNode }) {
  await connection(); // always per request: the session is checked live
  if (!hasDb() || !process.env.ADMIN_PASSWORD)
    return (
      <section className="wrap max-w-[40rem] py-24">
        <h1 className="text-h3">Admin isn’t switched on yet</h1>
        <p className="mt-3 text-small text-ink-2">Add DATABASE_URL, ADMIN_PASSWORD, ADMIN_SECRET and CRON_SECRET in the Vercel project’s environment variables, then redeploy. The README lists what each one does.</p>
      </section>
    );
  if (!(await isAdmin())) return <LoginForm />;
  return (
    <div className="wrap pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
        <AdminTabs />
        <form action={signOutAction}>
          <button type="submit" className="min-h-10 rounded-full px-3 text-small text-ink-2 hover:text-ink">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<p className="wrap py-24 text-small text-ink-2">Loading…</p>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
