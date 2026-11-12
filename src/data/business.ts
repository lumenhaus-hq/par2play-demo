import type { Answers } from "./catalog";
import { pageHref } from "./routes";

/**
 * Verified Par2Play facts for the public site.
 * Prices are tax-inclusive. Unknown figures stay null and render as TBD.
 */

export const NAP = {
  name: "Par2Play",
  street: "695 Hamilton Street, Suite G",
  city: "Somerset",
  region: "NJ",
  postalCode: "08873",
  country: "US",
  phoneDisplay: "(732) 448-2769",
  phoneTel: "tel:+17324482769",
  phoneE164: "+1-732-448-2769",
  email: "info@par2play.com",
  founder: "Atul Kakar",
} as const;

export const ADDRESS_LINE = `${NAP.street}, ${NAP.city}, ${NAP.region} ${NAP.postalCode}`;

export { HOURS_LABEL, SITE_URL } from "./site";

export const COACHES = [
  { id: "nick-schiavo", name: "Nick Schiavo" },
  { id: "nick-monticello", name: "Nick Monticello" },
] as const;

export const COACH_LINE = "Nick Schiavo and Nick Monticello, PGA professionals";

/**
 * Full Swing course library. The live bay-rental page says "more than 100
 * available courses". Raise this only if Chandan confirms a higher number.
 */
export const SIMULATOR_COURSE_COUNT = 100;

/** Chandan confirmed 10am–10pm every day. JSON-LD uses the same window. */

/** Demand windows. Not a price split, and not a published hours table. */
export const BAY_WINDOWS = {
  offPeak: "Midday is off-peak, and the easier time to get a bay.",
  onPeak: "Evenings, after about 4–5pm, are on-peak. Book those ahead.",
} as const;

export const PRICES = {
  taxIncluded: true,
  /**
   * 60-minute bay rental. Live GolfClock rule `rule_bay_rental` is 7000 cents
   * per resource hour on flow_bf_bay_rental. That flow offers 30, 60, 120, and
   * 180 minute variants; 30-minute slots show $35. par2play.com says "as low as
   * $40", which does not match those slots, so the calculator uses this rate.
   */
  baySession: 70,
  /**
   * TODO(pricing): Atul confirmed a 10-pack exists. No confirmed price is in
   * the repo. Do not publish a dollar amount for it.
   */
  /** Confirmed: 10 x 60-minute sessions. */
  tenPack: 400,
  unlimitedMonthly: 200,
  swingEvaluationMinutes: 50,
  swingEvaluation: 100,
  /**
   * 30-minute private lesson.
   * Source: https://par2play.com/golf-lessions/ “Single lesson session - $100”.
   */
  lessonSingle: 100,
  lessonMinutes: 30,
  lessonPack3Count: 3,
  /** In the repo only. The public lessons page does not list a 3-pack. */
  lessonPack3: 240,
  /**
   * Lesson packs. Source: https://par2play.com/golf-lessions/
   * Pack 5 $400, Pack 10 $750, Pack 20 $1400, Pack 30 $2000, Pack 50 $3000.
   */
  lessonPack5: 400,
  lessonPack10: 750,
  lessonPack20: 1400,
  lessonPack30: 2000,
  lessonPack50: 3000,
  /** Standalone club fitting fee is not published on par2play.com. */
  fitting: null as number | null,
  /** Event packages are not priced on par2play.com/events or the holiday page. */
  eventPackage: null as number | null,
  /** Fall league entry fee is not published. */
  leagueEntry: null as number | null,
  /**
   * Source: https://par2play.oclock.app/store/prod_golf_improvement_bundle ($599.00).
   * Includes a swing evaluation, a TPI assessment, five 30-minute lessons, a 2-hour practice session, a workout routine, workshop access, and coach check-ins.
   */
  golfImprovementBundle: 599,
  /** Once-a-week plan. In the repo only; the public membership carousel does not list it. */
  juniorOneLessonWeekly: 249,
  /**
   * Source: https://par2play.com/membership/ “Junior Golf Membership ($399 a Month)”, twice a week for 1 hour.
   */
  juniorTwoLessonsWeekly: 399,
  swingLabMember: 40,
  /**
   * TODO(pricing): confirm the non-member swing lab price.
   * Campaign copy and the video guidelines both say $100.
   */
  swingLabGuest: 100,
} as const;

export type BookingOffer =
  | "bay"
  | "ten-pack"
  | "practice-unlimited"
  | "lesson"
  | "swing-evaluation"
  | "swing-lab"
  | "fitting"
  | "group"
  | "junior"
  | "junior-plus"
  | "tournament";

/** Live GolfClock / oclock destinations. These replace the old phone fallback. */
export const OCLOCK = {
  bayRental: "https://par2play.oclock.app/book?flow=flow_bf_bay_rental",
  lessons: "https://par2play.oclock.app/book?flow=flow_bf_lessons",
  fitting: "https://par2play.oclock.app/book?flow=flow_bf_fitting",
  league: "https://par2play.oclock.app/book?flow=flow_bf_league",
  practiceUnlimited: "https://par2play.oclock.app/store/prod_practice_unlimited",
  /** Public membership carousel on par2play.com. The membership page now checks out on GolfClock. */
  liveMembership: "https://par2play.com/membership",
  tenPracticePack: "https://par2play.oclock.app/store/prod_10_practice_pack",
  lessonPacks: "https://par2play.oclock.app/store/prod_lesson_packs",
  golfImprovementBundle: "https://par2play.oclock.app/store/prod_golf_improvement_bundle",
  book: "https://par2play.oclock.app/book",
  store: "https://par2play.oclock.app/store",
  memberships: "https://par2play.oclock.app/store?category=Memberships",
  seriesPackages: "https://par2play.oclock.app/store?category=Series+Packages",
  events: "https://par2play.oclock.app/events",
} as const;

/**
 * Per-tier GolfClock product URLs. Empty until those products exist.
 * membershipCheckoutHref falls back to the Memberships category.
 */
export const TIER_CHECKOUT = {
  silver: "",
  gold: "",
  platinum: "",
} as const;

export type MemberTierCheckoutId = keyof typeof TIER_CHECKOUT;

export function membershipCheckoutHref(tier?: MemberTierCheckoutId): string {
  if (tier && TIER_CHECKOUT[tier]) return TIER_CHECKOUT[tier];
  return OCLOCK.memberships;
}

export const GOLF_CLOCK = {
  bookingUrl: OCLOCK.book,
  membershipUrl: OCLOCK.memberships,
} as const;

export function golfClockBookingReady(): boolean {
  return GOLF_CLOCK.bookingUrl.trim().length > 0;
}

export function golfClockMembershipReady(): boolean {
  return GOLF_CLOCK.membershipUrl.trim().length > 0;
}

export function bookingHref(offer: BookingOffer): string {
  switch (offer) {
    case "bay":
      return OCLOCK.bayRental;
    case "ten-pack":
      return OCLOCK.tenPracticePack;
    case "practice-unlimited":
      return OCLOCK.practiceUnlimited;
    case "lesson":
    case "swing-evaluation":
    case "swing-lab":
    case "junior":
    case "junior-plus":
      return OCLOCK.lessons;
    case "fitting":
      return OCLOCK.fitting;
    case "group":
      return OCLOCK.events;
    case "tournament":
      return OCLOCK.league;
    default: {
      const exhaustive: never = offer;
      return exhaustive;
    }
  }
}

export function membershipHref(): string {
  return pageHref("membership");
}

/**
 * TODO(enquiry): Paste a Formspree-style POST URL. Empty sends nothing.
 * TODO(enquiry): Paste the mailto inbox. Empty has no mail fallback.
 */
export const ENQUIRY = {
  endpoint: "",
  email: "",
} as const;

export type EnquiryInterest = "bays" | "membership" | "lessons" | "junior" | "events" | "tournament";

export const ENQUIRY_INTERESTS: { id: EnquiryInterest; label: string }[] = [
  { id: "bays", label: "Bays" },
  { id: "membership", label: "Membership" },
  { id: "lessons", label: "Lessons" },
  { id: "junior", label: "Junior" },
  { id: "events", label: "Events" },
  { id: "tournament", label: "Tournament" },
];

export type GolfClockProfileNote = {
  answers: Answers;
  plan: string | null;
  savedAt: string;
};

let pendingProfileNote: GolfClockProfileNote | null = null;

/**
 * TODO(golfclock): Write quiz answers onto the customer's GolfClock profile.
 * No GolfClock API client exists in this repo. The latest note is kept in
 * memory so a future client can post it with the booking. Nothing is sent.
 */
export function saveQuizToGolfClock(note: Omit<GolfClockProfileNote, "savedAt">): void {
  pendingProfileNote = { ...note, savedAt: new Date().toISOString() };
}

export function peekGolfClockProfileNote(): GolfClockProfileNote | null {
  return pendingProfileNote;
}
