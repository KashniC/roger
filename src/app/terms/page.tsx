import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms",
  description: "The plain-language terms for Roger setups.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage doc={terms} />;
}
