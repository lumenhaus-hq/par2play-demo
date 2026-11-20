import { PRICES } from "./business";
import { PHOTOS } from "./photos";

export type PlanId = "unlimited" | "junior" | "junior-plus";
export type Term = 1 | 3 | 6 | 12;
export type Billing = "monthly" | "annual";
export type Intent = "play" | "learn" | "socialize" | "compete";
export type Experience = "new" | "casual" | "competitive";
export type Place = "outdoor" | "simulator" | "both";
export type Cadence = "occasional" | "weekly" | "live";
export type Party = "1" | "2" | "4";
export type Product = "round" | "simulator" | "coaching";

export type Answers = {
  intent: Intent | null;
  experience: Experience | null;
  place: Place | null;
  cadence: Cadence | null;
  party: Party | null;
};

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  includes: string[];
  popular: boolean;
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "unlimited",
    name: "Unlimited practice",
    monthly: PRICES.unlimitedMonthly,
    popular: true,
    cta: "Join",
    includes: [
      "Unlimited simulator practice",
      "Putting green and lounge",
      "No minimum term",
      "Price includes tax",
    ],
  },
  {
    id: "junior",
    name: "Junior",
    monthly: PRICES.juniorOneLessonWeekly,
    popular: false,
    cta: "Enrol a junior",
    includes: [
      "One 1:1 lesson each week",
      "Supervised unlimited facility access",
      "No age range",
      "Price includes tax",
    ],
  },
  {
    id: "junior-plus",
    name: "Junior twice a week",
    monthly: PRICES.juniorTwoLessonsWeekly,
    popular: false,
    cta: "Enrol a junior",
    includes: [
      "Two lessons each week",
      "Unlimited facility access",
      "No age range",
      "Price includes tax",
    ],
  },
];

export const TERMS: Term[] = [1, 3, 6, 12];

export const RATES = {
  baySession: PRICES.baySession,
  lessonPack3: PRICES.lessonPack3,
  swingEvaluation: PRICES.swingEvaluation,
  swingLabMember: PRICES.swingLabMember,
  swingLabGuest: PRICES.swingLabGuest,
} as const;

export const SATURDAY = "Saturday, October 24";

export const SLOTS = [
  { id: "0800", time: "8:00", note: "Morning" },
  { id: "1000", time: "10:00", note: "Midday · off-peak" },
  { id: "1400", time: "2:00", note: "Afternoon" },
] as const;

export const CANCEL_RULE =
  "Cancel free until 24 hours before the start. Inside 24 hours the visit fee is kept.";

export const MEMBER_CANCEL = "Unlimited practice has no minimum term. The paid month stays.";

export const IMAGES = {
  hero: PHOTOS.bays.jpg,
  fairway: PHOTOS.range.jpg,
  green: PHOTOS.bays.jpg,
  swing: PHOTOS.gripLesson.jpg,
  clubhouse: PHOTOS.groupWave.jpg,
  outdoor: PHOTOS.storefront.jpg,
  simulator: PHOTOS.launchData.jpg,
  gallery: [PHOTOS.bays.jpg, PHOTOS.groupWave.jpg, PHOTOS.lounge.jpg],
};

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function planById(id: PlanId): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0];
}

export function annualPrice(plan: Plan): number {
  return plan.monthly * 12;
}

export function annualRack(plan: Plan): number {
  return plan.monthly * 12;
}

export function isTerm(value: number): value is Term {
  return value === 1 || value === 3 || value === 6 || value === 12;
}

export function termPrice(plan: Plan, term: Term): number {
  return plan.monthly * term;
}

/** Month-to-month. `foursome` is ignored: that discount was demo pricing. */
export function membershipCharge(plan: Plan, term: Term, foursome: boolean): {
  amount: number;
  against?: number;
} {
  void foursome;
  return { amount: termPrice(plan, term) };
}

export function membershipLabel(plan: Plan, term: Term, foursome: boolean): string {
  void foursome;
  const span = term === 1 ? "month" : term === 12 ? "year" : `${term} months`;
  return `${plan.name} · ${span}`;
}

export function recommendedPlan(answers: Answers): PlanId {
  switch (answers.intent) {
    case "play":
    case "learn":
    case "socialize":
    case "compete":
    case null:
      return "unlimited";
    default: {
      const exhaustive: never = answers.intent;
      return exhaustive;
    }
  }
}

export function defaultProduct(answers: Answers, plan: PlanId | null): Product {
  void plan;
  if (answers.intent === "learn") return "coaching";
  return "simulator";
}

export function partyCount(answers: Answers): number {
  if (answers.party) return Number(answers.party);
  if (answers.intent === "socialize") return 2;
  return 1;
}

export type Line = {
  label: string;
  amount: number;
  against?: number;
  /** Price is not confirmed. Excluded from the total. */
  pending?: boolean;
};

export type QuoteInput = {
  buyingMembership: boolean;
  term: Term;
  foursome: boolean;
  plan: PlanId | null;
  product: Product | null;
  acceptPack: boolean;
  answers: Answers;
  includeVisit: boolean;
};

export function quote(input: QuoteInput): { lines: Line[]; total: number } {
  const lines: Line[] = [];
  if (input.buyingMembership && input.plan) {
    const plan = planById(input.plan);
    const charge = membershipCharge(plan, input.term, input.foursome);
    lines.push({
      label: membershipLabel(plan, input.term, input.foursome),
      amount: charge.amount,
      against: charge.against,
    });
  }
  if (input.includeVisit && input.product) {
    lines.push(visitLine(input));
  }
  return {
    lines,
    total: lines.reduce((sum, line) => sum + (line.pending ? 0 : line.amount), 0),
  };
}

function visitLine(input: QuoteInput): Line {
  const plan = input.buyingMembership && input.plan ? input.plan : null;

  if (input.product === "coaching") {
    if (input.acceptPack) {
      return { label: "3-lesson pack · 30 minutes each", amount: RATES.lessonPack3 };
    }
    return {
      label: "30-minute lesson · price to be confirmed",
      amount: 0,
      pending: true,
    };
  }

  if (plan) {
    return {
      label: "Bay session · included with membership",
      amount: 0,
      against: RATES.baySession,
    };
  }
  return { label: "Bay session", amount: RATES.baySession };
}

export function slotById(id: string | null) {
  return SLOTS.find((slot) => slot.id === id) ?? SLOTS[1];
}

export function productLabel(product: Product): string {
  switch (product) {
    case "simulator":
    case "round":
      return "Bay session";
    case "coaching":
      return "Lesson";
    default: {
      const exhaustive: never = product;
      return exhaustive;
    }
  }
}

export function recommendReason(answers: Answers, plan: PlanId, hint: PlanId | null): string {
  let reason: string;
  switch (plan) {
    case "junior":
      reason =
        "Junior is $249 a month, tax included: one 1:1 lesson a week and unlimited facility access. There is no age range.";
      break;
    case "junior-plus":
      reason =
        "Junior twice a week is $399 a month, tax included: two lessons a week and unlimited facility access. There is no age range.";
      break;
    case "unlimited":
      if (answers.intent === "learn") {
        reason =
          "Start with a 30-minute swing evaluation, $100 tax included, once per golfer. Unlimited practice is $200 a month, up to 1 hour a day, if the bay becomes the habit. No minimum term.";
      } else if (answers.cadence === "occasional") {
        reason =
          "A bay is $70 a session, tax included. Unlimited practice is $200 a month and covers itself from the third session. No minimum term.";
      } else {
        reason =
          "Unlimited practice is $200 a month, tax included, with no minimum term. Full Swing bays, the putting green, and the lounge.";
      }
      break;
    default: {
      const exhaustive: never = plan;
      return exhaustive;
    }
  }
  if (hint && hint !== plan) {
    reason += ` You looked at ${planById(hint).name}.`;
  }
  return reason;
}
