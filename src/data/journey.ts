import {
  type Answers,
  type Billing,
  type PlanId,
  type Term,
  type Product,
  CANCEL_RULE,
  SATURDAY,
  membershipCharge,
  membershipLabel,
  money,
  partyCount,
  planById,
  productLabel,
  recommendedPlan,
  slotById,
  annualPrice,
  annualRack,
  defaultProduct,
} from "./catalog";

export type Step =
  | "landing"
  | "intent"
  | "experience"
  | "place"
  | "cadence"
  | "recommend"
  | "register"
  | "plan"
  | "book"
  | "visit-place"
  | "visit-party"
  | "visit-time"
  | "guest-choice"
  | "pay"
  | "confirm"
  | "clubhouse"
  | "journey";

export type FunnelStage =
  | "Arrive"
  | "Qualify"
  | "Recommend"
  | "Commit"
  | "Book"
  | "Pay"
  | "Confirm"
  | "Return";

export type OfferId =
  | "first-swing"
  | "social-credit"
  | "annual"
  | "lesson-series"
  | "guest-round";

export type OfferState = {
  step: Step;
  buyingMembership: boolean;
  billing: Billing;
  term: Term;
  foursome: boolean;
  plan: PlanId | null;
  product: Product | null;
  acceptPack: boolean;
  answers: Answers;
  profileFirst: string;
  slotId: string | null;
};

const OFFER_NAMES: Record<OfferId, string> = {
  "first-swing": "First swing",
  "social-credit": "Simulator credit",
  annual: "Annual",
  "lesson-series": "Lesson series",
  "guest-round": "Guest round",
};

export function offerName(id: OfferId): string {
  return OFFER_NAMES[id];
}

export function offerDetail(id: OfferId, plan: PlanId | null): string {
  const chosen = planById(plan ?? "unlimited");
  switch (id) {
    case "first-swing":
      return `${chosen.name} is ${money(chosen.monthly)} a month, tax included. A bay session is included while the membership is active.`;
    case "social-credit":
      return "There is no separate social credit. A bay is $70 a session, tax included.";
    case "annual":
      return `${chosen.name} has no minimum term and no prepaid discount. Twelve months would be ${money(annualPrice(chosen))}, the same as ${money(annualRack(chosen))} at the monthly rate.`;
    case "lesson-series":
      return "A pack of three 30-minute lessons is $240, tax included. The single-lesson price and the 5, 10, and 20 packs are still TBD.";
    case "guest-round":
      return "A bay is $70 a session, tax included, for the group in that bay.";
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function resolveOffer(state: OfferState): {
  visible: OfferId | null;
  suppressed: OfferId | null;
} {
  const plan = state.plan ?? recommendedPlan(state.answers);
  const buying = state.buyingMembership;
  const product = state.product ?? defaultProduct(state.answers, buying ? plan : null);
  const none = { visible: null, suppressed: null };

  if (state.step === "recommend" || state.step === "register") {
    return { visible: "first-swing", suppressed: null };
  }

  if (state.step === "plan") {
    return { visible: null, suppressed: "annual" };
  }

  const visitOffer = (): { visible: OfferId | null; suppressed: OfferId | null } => {
    if (product === "coaching") {
      return { visible: "lesson-series", suppressed: buying ? "first-swing" : null };
    }
    return { visible: "first-swing", suppressed: null };
  };

  if (
    state.step === "book" ||
    state.step === "pay" ||
    state.step === "visit-time" ||
    state.step === "guest-choice"
  ) {
    return visitOffer();
  }

  return none;
}

export function stageFor(step: Step): FunnelStage {
  switch (step) {
    case "landing":
    case "clubhouse":
    case "journey":
      return "Arrive";
    case "intent":
    case "experience":
    case "place":
    case "cadence":
    case "visit-place":
    case "visit-party":
      return "Qualify";
    case "recommend":
    case "guest-choice":
      return "Recommend";
    case "register":
    case "plan":
      return "Commit";
    case "book":
    case "visit-time":
      return "Book";
    case "pay":
      return "Pay";
    case "confirm":
      return "Confirm";
  }
}

export function objectiveFor(step: Step): string {
  switch (step) {
    case "landing":
      return "Two doors. Membership, or a single visit.";
    case "clubhouse":
      return "A Tuesday league. Free to join. The bay is still paid.";
    case "intent":
      return "Learn the reason before a price.";
    case "experience":
      return "Hear how much golf is already there.";
    case "place":
      return "Course, simulator, or both. This picks the first visit.";
    case "cadence":
      return "How often decides a bay session or unlimited practice.";
    case "recommend":
      return "Name one plan. Hold the annual price for the next commit.";
    case "register":
      return "Save the person. The card waits.";
    case "plan":
      return "Annual is the offer. The hour credit waits for the visit.";
    case "book":
      return "One visit, one offer, the 24-hour rule beside the total.";
    case "visit-place":
      return "A guest can book before a membership exists.";
    case "visit-party":
      return "Party size sets the guest total, and whether a guest rate can apply later.";
    case "visit-time":
      return "A Saturday time. The join offer is the next screen.";
    case "guest-choice":
      return "Pay the guest total, or join and reprice this visit.";
    case "pay":
      return "Name, mobile, and card. Nothing is charged.";
    case "confirm":
      return "The receipt, then the three notes that would follow. Nothing sends.";
    case "journey":
      return "Every stage, message, and offer in one map.";
  }
}

export function titleFor(step: Step): string {
  switch (step) {
    case "landing":
      return "Home";
    case "clubhouse":
      return "Par2Play Clubhouse";
    case "intent":
      return "What they want";
    case "experience":
      return "Experience";
    case "place":
      return "Where they play";
    case "cadence":
      return "How often";
    case "recommend":
      return "The plan";
    case "register":
      return "Registration";
    case "plan":
      return "Plan and billing";
    case "book":
      return "First visit";
    case "visit-place":
      return "Reserve a visit";
    case "visit-party":
      return "Who is coming";
    case "visit-time":
      return "Saturday time";
    case "guest-choice":
      return "Guest or member";
    case "pay":
      return "Pay";
    case "confirm":
      return "Confirmation";
    case "journey":
      return "Journey map";
  }
}

export function screenLine(state: OfferState): string {
  const name = state.profileFirst || "there";
  const plan = planById(state.plan ?? recommendedPlan(state.answers));
  const slot = slotById(state.slotId);
  switch (state.step) {
    case "landing":
      return "Indoor golf at 695 Hamilton Street, Suite G, Somerset. Lessons with PGA professionals.";
    case "clubhouse":
      return "Every other Tuesday. One hole on the screen. Points when someone you bring comes back.";
    case "intent":
      return "What do you want from the club?";
    case "experience":
      return "How much golf is already in your hands?";
    case "place":
    case "visit-place":
      return "Where will you play?";
    case "cadence":
      return "How often will you be here?";
    case "recommend":
      return `${plan.name} is the plan. The first visit stays attached.`;
    case "register":
      return "Save this plan. The card is the next screens, and the hour stays attached.";
    case "plan": {
      const chosen = planById(plan.id);
      const charge = membershipCharge(chosen, state.term, state.foursome);
      return `${membershipLabel(chosen, state.term, state.foursome)} is ${money(charge.amount)}${charge.against ? ` against ${money(charge.against)}` : ""}.`;
    }
    case "book":
      return `${SATURDAY}. The time you pick is held on this screen only.`;
    case "visit-party":
      return "How many people is this visit?";
    case "visit-time":
      return `${SATURDAY}. Pick a time, then decide guest or member.`;
    case "guest-choice":
      return "Pay as a guest, or join and this visit reprices.";
    case "pay":
      return `${CANCEL_RULE} ${"Membership cancels anytime. The paid month stays."}`;
    case "confirm":
      return `You're booked at Par2Play, ${name}. ${SATURDAY} at ${slot.time}.`;
    case "journey":
      return "The map is the strategy. The rail is the step you are on.";
  }
}

export type LaterNote = {
  id: string;
  title: string;
  email: string;
  sms: string;
};

export function laterNotes(state: OfferState): LaterNote[] {
  const plan = state.plan ? planById(state.plan) : null;
  const product = state.product ?? "round";
  const slot = slotById(state.slotId);
  const party = partyCount(state.answers);
  const visit = `${productLabel(product).toLowerCase()}`;

  const morning = morningAfter(state, plan?.name ?? null, product, party);
  const credit = unusedCredit(state, plan?.name ?? null, product);

  return [
    {
      id: "day-before",
      title: "The day before",
      email: `Tomorrow at Par2Play: ${slot.time}, ${visit}, ${party} ${party === 1 ? "person" : "people"}. ${CANCEL_RULE} No offer in this note.`,
      sms: `Par2Play tomorrow ${slot.time}. ${productLabel(product)}. Cancel free until 24 hours before.`,
    },
    {
      id: "morning-after",
      title: "The morning after",
      email: morning.email,
      sms: morning.sms,
    },
    {
      id: "unused-credit",
      title: "Unused credit",
      email: credit.email,
      sms: credit.sms,
    },
  ];
}

function morningAfter(
  state: OfferState,
  planName: string | null,
  product: Product,
  party: number,
): { email: string; sms: string } {
  if (!state.buyingMembership && product === "simulator") {
    return {
      email: "Yesterday at Par2Play. A bay is $70, tax included. Unlimited practice is $200 a month if the bay becomes the habit. No minimum term.",
      sms: "Par2Play: unlimited practice is $200 a month, tax included.",
    };
  }
  if (state.buyingMembership && planName) {
    return {
      email: `Yesterday at Par2Play. ${planName} is ready for the next visit. No second offer today.`,
      sms: `Par2Play: ${planName} is ready when you book the next visit.`,
    };
  }
  return {
    email: `Yesterday at Par2Play. A bay for the group is $70, tax included. Unlimited practice is $200 a month if this becomes a habit. Party size on the booking was ${party}.`,
    sms: "Par2Play: unlimited practice is $200 a month, tax included, with no minimum term.",
  };
}

function unusedCredit(
  state: OfferState,
  planName: string | null,
  product: Product,
): { email: string; sms: string } {
  if (state.acceptPack && product === "coaching") {
    return {
      email: "You have lessons left on the 3-pack. They come off the next lesson. A single 30-minute price is still TBD.",
      sms: "Par2Play: lessons left on the 3-pack.",
    };
  }
  if (planName === "Unlimited practice") {
    return {
      email: "Bay time stays on unlimited practice. The membership is $200 a month, tax included, with no minimum term.",
      sms: "Par2Play: unlimited practice stays at $200 a month.",
    };
  }
  if (planName === "Junior") {
    return {
      email: "Junior is $249 a month: one weekly 1:1 lesson and supervised unlimited access. There is no age range.",
      sms: "Par2Play: Junior includes supervised unlimited access.",
    };
  }
  return {
    email: "No credit is on the profile. A lesson pack or a membership is how a balance gets left behind.",
    sms: "Par2Play: no credit on the profile yet.",
  };
}

export function receipt(state: OfferState, total: number, last4: string | null): { email: string; sms: string } {
  const slot = slotById(state.slotId);
  const product = state.product ? productLabel(state.product) : "Visit";
  const plan = state.buyingMembership && state.plan ? planById(state.plan).name : "Guest";
  const party = partyCount(state.answers);
  const card = last4 ? ` Card ending ${last4}.` : "";
  return {
    email: `You're booked at Par2Play. ${plan}. ${SATURDAY} at ${slot.time}. ${product}. ${party} ${party === 1 ? "person" : "people"}. ${money(total)}.${card} ${CANCEL_RULE}`,
    sms: `Par2Play: ${SATURDAY} ${slot.time}, ${product}. ${money(total)}. Cancel free until 24 hours before.`,
  };
}

export type MapRow = {
  path: string;
  stage: FunnelStage;
  title: string;
  objective: string;
  screen: string;
  message: string;
  offer: string;
};

export const JOURNEY_MAP: MapRow[] = [
  {
    path: "Both",
    stage: "Arrive",
    title: "Home",
    objective: "Choose a door.",
    screen: "Hero, facilities, training, and the monthly prices.",
    message: "No email or SMS.",
    offer: "Monthly prices only. Annual waits until the plan step.",
  },
  {
    path: "Join",
    stage: "Qualify",
    title: "Four questions",
    objective: "Intent, experience, place, then how often.",
    screen: "One question a screen. No price.",
    message: "No email or SMS.",
    offer: "The quiz matches unlimited practice at $200 a month. The junior membership is chosen on the pricing section, not by these questions.",
  },
  {
    path: "Join",
    stage: "Recommend",
    title: "The plan",
    objective: "Say one plan out loud.",
    screen: "The match, what it includes, and the hour that stays attached.",
    message: "On screen only.",
    offer: "Unlimited practice at $200 a month.",
  },
  {
    path: "Join",
    stage: "Commit",
    title: "Registration",
    objective: "Name, email, and mobile. No card.",
    screen: "Save this plan. The hour stays attached.",
    message: "On screen only.",
    offer: "The same hour credit. Annual is still held.",
  },
  {
    path: "Join",
    stage: "Commit",
    title: "Plan and billing",
    objective: "Monthly or the year.",
    screen: "Unlimited practice and the junior membership. The matched one is selected.",
    message: "On screen only.",
    offer: "Annual: two months included. The hour credit is held for the visit.",
  },
  {
    path: "Join",
    stage: "Book",
    title: "First visit",
    objective: "A Saturday time and one offer.",
    screen: "Product, party, time, total, and the 24-hour rule.",
    message: "On screen only.",
    offer: "A 3-lesson pack, or a bay included with membership.",
  },
  {
    path: "Visit",
    stage: "Qualify",
    title: "Place and party",
    objective: "Book before an account exists.",
    screen: "Outdoor, simulator, or both. Then 1, 2, or 4.",
    message: "No email or SMS.",
    offer: "None yet.",
  },
  {
    path: "Visit",
    stage: "Book",
    title: "Saturday time",
    objective: "Hold a time on the screen.",
    screen: "Three times. The total updates before a name.",
    message: "On screen only.",
    offer: "A guest bay is $70. Unlimited practice at $200 a month is the other door.",
  },
  {
    path: "Visit",
    stage: "Recommend",
    title: "Guest or member",
    objective: "Pay the guest total, or join and reprice.",
    screen: "Two totals. One offer.",
    message: "On screen only.",
    offer: "Bay included with membership if they join. A guest bay stays at $70.",
  },
  {
    path: "Both",
    stage: "Pay",
    title: "Card",
    objective: "Record the step. Charge nothing.",
    screen: "Name, mobile, card, total, and the cancellation sentence.",
    message: "The receipt is written on the next screen. It does not send.",
    offer: "The visit offer stays. Annual is held if they kept the monthly price and no visit offer replaced it.",
  },
  {
    path: "Both",
    stage: "Confirm",
    title: "Receipt",
    objective: "Show the booking and the three notes that follow.",
    screen: "Time, product, total, and the last four digits.",
    message: "Email and SMS copy for the receipt. Nothing sends.",
    offer: "No new offer. The later notes carry the next one.",
  },
  {
    path: "After",
    stage: "Return",
    title: "The day before",
    objective: "Prepare the arrival.",
    screen: "Not a page. It is listed under what happens next.",
    message: "Email and SMS. Time, visit, party, and the 24-hour rule.",
    offer: "None.",
  },
  {
    path: "After",
    stage: "Return",
    title: "The morning after",
    objective: "One next step, chosen from the visit.",
    screen: "Listed under what happens next.",
    message: "Email and SMS.",
    offer: "Unlimited practice if they were a guest on a bay. Otherwise the plan they already hold.",
  },
  {
    path: "After",
    stage: "Return",
    title: "Unused credit",
    objective: "Say what is still on the profile.",
    screen: "Listed under what happens next.",
    message: "Email and SMS.",
    offer: "Lessons left on a 3-pack. A single bay does not leave a session balance.",
  },
];
