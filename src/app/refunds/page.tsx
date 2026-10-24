import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { refunds } from "@/data/legal";

export const metadata: Metadata = {
  title: "Refunds and the guarantee",
  description: "Working, or you pay nothing: exactly what working means and how to claim a refund.",
  alternates: { canonical: "/refunds" },
};

export default function Page() {
  return <LegalPage doc={refunds} />;
}
