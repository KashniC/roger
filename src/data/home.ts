import type { Note } from "@/components/phone/lock-screen";
import type { SceneId } from "@/components/phone/scenes";

export const homeHero = {
  kicker: "Home setup · Toronto",
  headline: "Your family’s first AI assistant, set\u00a0up for you.",
  sub: "In one 60-minute session we set up an assistant on your own account, doing 5 jobs you pick: dinners, school emails, forgotten bills. Live the same day.",
  secondary: "See what assistants already do",
  phone: {
    date: "Tuesday, October 13",
    time: "6:48",
    caption: "Example morning. Your assistant, on your own accounts.",
    notes: [
      { id: "n1", title: "Meal plan", time: "6:48", body: "This week’s dinners are planned. Tuesday is soccer, so that one is 20 minutes. The cart’s ready." },
      { id: "n2", title: "School digest", time: "6:41", body: "Maya’s field-trip form is due Thursday. I’ve filled in what I can; it needs your signature." },
      { id: "n3", title: "Bill check", time: "6:33", body: "The streaming plan renews Friday. Nobody has opened it since June. Cancel it?" },
      { id: "n4", title: "Money finder", time: "6:21", body: "Found $86.40 left on two gift cards in old emails. Added them to your list." },
    ] satisfies Note[],
  },
};

export type DayStep = {
  id: string;
  scene: SceneId;
  time: string;
  clock: string;
  jobId: string;
  job: string;
  before: string;
  after: string;
  note: string;
};

/** "A day, handled": one example Tuesday, one job per moment. */
export const dayStory = {
  heading: "What a Tuesday looks like once it’s set up.",
  sub: "An example day for a family with two kids. Each moment is one of the 12 jobs you can pick.",
  date: "Tuesday, October 13",
  closing: "Same family. Same week. Five fewer jobs.",
  steps: [
    {
      id: "brief",
      scene: "dawn",
      time: "6:48 AM",
      clock: "6:48",
      jobId: "home-family-brief",
      job: "Family brief",
      before: "Everyone asking where everything is before 8.",
      after: "Who’s where, what’s due and the weather, before breakfast.",
      note: "Good morning. Maya has swimming at 4:15, so pack the green bag. Rain after 3.",
    },
    {
      id: "school",
      scene: "morning",
      time: "7:20 AM",
      clock: "7:20",
      jobId: "home-school-digest",
      job: "School digest",
      before: "A form buried in the third school email this week.",
      after: "Forms, dates and deadlines pulled out for you.",
      note: "Field-trip form for Maya is due Thursday. I’ve filled in what I can; it needs your signature.",
    },
    {
      id: "bills",
      scene: "noon",
      time: "12:10 PM",
      clock: "12:10",
      jobId: "home-bills",
      job: "Bill check",
      before: "A subscription you forgot to cancel.",
      after: "Flagged before it renews.",
      note: "Your streaming plan renews Friday at $18.99. Nobody has opened it since June. Cancel it?",
    },
    {
      id: "dinner",
      scene: "afternoon",
      time: "4:35 PM",
      clock: "4:35",
      jobId: "home-meal-plan",
      job: "Meal plan",
      before: "“What’s for dinner?” asked all week.",
      after: "Dinners picked in 5 minutes, the cart built with your brands.",
      note: "Tonight: sheet-pan lemon chicken, 25 minutes. Pickup at 5:30 is booked, with the kids’ usual snacks.",
    },
    {
      id: "money",
      scene: "night",
      time: "8:30 PM",
      clock: "8:30",
      jobId: "home-money-finder",
      job: "Money finder",
      before: "Refunds and gift cards lost in old email.",
      after: "Money you’re already owed, found and chased.",
      note: "Found $86.40 on two old gift cards, and a $5 refund the store never sent. Want me to ask for it?",
    },
  ] satisfies DayStep[],
};

export const homeShowcase = {
  heading: "It’s already working for real people.",
  sub: "Collected every week from public posts. These aren’t our clients: each one credits its author and links to the original.",
  ids: ["kids-worksheets", "money-650", "care-scam-guard", "home-meal-plan", "money-gift-cards", "cos-car-search", "home-leave-by", "kids-shoes-miss"],
};

export const homePicker = {
  heading: "Pick the 5 jobs you want off your plate.",
  sub: "Not sure yet? Skip it, and we’ll choose together in your session.",
  note: "Works with the email, calendar and grocery apps you already use. We confirm yours in the session.",
};

export const homeTimeline = {
  heading: "From booking to working in one afternoon.",
  footnote: "Days count from your session.",
  steps: [
    { when: "Today", title: "Pay, then pick a time.", body: "Choose a 60-minute slot in the next 3 business days. Your picks come with you." },
    { when: "Session day", title: "We set it up together.", body: "By video, or in person in Toronto. Your assistant goes live on your own account, doing your 5 jobs.", emphasis: "Live the same day." },
    { when: "Day 7", title: "Check-in.", body: "We look at each job together, and it goes into your setup report." },
    { when: "Day 14", title: "Guarantee window closes.", body: "If it isn’t doing your 5 jobs, you get a full refund." },
    { when: "Day 30", title: "Email support ends.", body: "Questions and tweaks by email until then. Your assistant keeps running." },
  ],
};

export const homeFinal = {
  heading: "Get your Sundays back.",
  businessDoor: {
    lead: "Running a business?",
    body: "An AI Chief of Staff and 3 helpers, live in 5 days.",
    link: "See the work setup",
  },
};
