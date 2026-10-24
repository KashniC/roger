import type { Metadata } from "next";
import { Thanks } from "@/components/thanks";

export const metadata: Metadata = {
  title: { absolute: "Payment received · Book Session 1 · Roger" },
  robots: { index: false, follow: false },
};

export default function ThanksWorkPage() {
  return (
    <Thanks
      offer="work"
      book="Book Session 1"
      timing="Times are in the next 2 business days."
      picksLabel="Your helpers:"
      checklistHeading="Before Session 1"
      checklist={[
        "Admin access to your email and calendar.",
        "A list of your tools: the apps and accounts you use to run the business.",
        "Who on the team should join Session 2.",
      ]}
    />
  );
}
