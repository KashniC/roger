import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Roger collects, why, and what stays in your browser.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage doc={privacy} />;
}
