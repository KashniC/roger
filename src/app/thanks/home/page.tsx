import type { Metadata } from "next";
import { Thanks } from "@/components/thanks";

export const metadata: Metadata = {
  title: { absolute: "Payment received · Book your session · Roger" },
  robots: { index: false, follow: false },
};

export default function ThanksHomePage() {
  return (
    <Thanks
      offer="home"
      book="Pick your 60-min session"
      timing="Sessions are within 3 business days of payment."
      picksLabel="Your jobs:"
      checklistHeading="Before your session"
      checklist={[
        "Your phone and laptop, charged.",
        "The sign-ins for the email and calendar you want your assistant to use.",
        "The jobs you picked. Bring a recent example of each if you have one, like a school email or a bill.",
        "60 minutes somewhere you can talk.",
      ]}
    />
  );
}
