import { PRICES } from "./business";

/** A month in this estimate is four weeks, so the totals stay easy to check. */
export const WEEKS_PER_MONTH = 4;
export const SESSIONS_PER_PACK = 10;

export const PERIOD_MONTHS = [1, 2, 3, 6] as const;
export const VISITS_PER_WEEK = [1, 2, 3, 4] as const;

export type PeriodMonths = (typeof PERIOD_MONTHS)[number];
export type VisitsPerWeek = (typeof VISITS_PER_WEEK)[number];

export type EstimateColumn = {
  id: "membership" | "payg" | "pack";
  name: string;
  total: number;
  perSession: number;
  detail: string;
};

export type MembershipEstimate = {
  months: PeriodMonths;
  visitsPerWeek: VisitsPerWeek;
  sessions: number;
  membership: EstimateColumn;
  payg: EstimateColumn;
  pack: EstimateColumn;
  /** Positive when membership costs less than the cheaper alternative. */
  saveOverMonths: number;
  cheapestAlternative: "payg" | "pack";
};

function perSession(total: number, sessions: number): number {
  if (sessions <= 0) return 0;
  return total / sessions;
}

export function estimateMembership(months: PeriodMonths, visitsPerWeek: VisitsPerWeek): MembershipEstimate {
  const sessions = visitsPerWeek * WEEKS_PER_MONTH * months;
  const packs = Math.ceil(sessions / SESSIONS_PER_PACK);
  const unused = packs * SESSIONS_PER_PACK - sessions;
  const paygTotal = sessions * PRICES.baySession;
  const packTotal = packs * PRICES.tenPack;
  const memberTotal = months * PRICES.unlimitedMonthly;
  const packDetail =
    unused === 0
      ? `${packs} ${packs === 1 ? "pack" : "packs"} · $${PRICES.tenPack / SESSIONS_PER_PACK} a session`
      : `${packs} ${packs === 1 ? "pack" : "packs"} · ${unused} sessions left over`;

  const payg: EstimateColumn = {
    id: "payg",
    name: "Pay as you go",
    total: paygTotal,
    perSession: perSession(paygTotal, sessions),
    detail: `${sessions} sessions at $${PRICES.baySession}`,
  };
  const pack: EstimateColumn = {
    id: "pack",
    name: "10 Practice Pack",
    total: packTotal,
    perSession: perSession(packTotal, sessions),
    detail: packDetail,
  };
  const membership: EstimateColumn = {
    id: "membership",
    name: "Practice Unlimited",
    total: memberTotal,
    perSession: perSession(memberTotal, sessions),
    detail: "Up to 1 hour a day",
  };
  const cheapestAlternative = payg.total <= pack.total ? "payg" : "pack";
  const cheapestTotal = cheapestAlternative === "payg" ? payg.total : pack.total;

  return {
    months,
    visitsPerWeek,
    sessions,
    membership,
    payg,
    pack,
    saveOverMonths: cheapestTotal - memberTotal,
    cheapestAlternative,
  };
}

export function money(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.abs(rounded - Math.round(rounded)) < 0.001;
  return rounded.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
}

/** Do not invent a number when the price is not listed. */
export function formatPrice(amount: number | null): string {
  return amount == null ? "Price on request" : money(amount);
}

export function monthLabel(months: number): string {
  return months === 1 ? "1 month" : `${months} months`;
}

/** The comparison slider stops here. It is not a cap on daily play. */
export const COMPARE_HOURS_MAX = 16;

/** Membership allows up to 1 hour a day, so the week slider stops at 7. */
export const HOURS_PER_WEEK_MAX = 7;

/**
 * First hour in a month where pay-as-you-go costs at least as much as Practice Unlimited.
 * $200 / $70 is 2.86, so that hour is the 3rd.
 */
export function breakEvenHour(): number {
  return Math.ceil(PRICES.unlimitedMonthly / PRICES.baySession);
}

export type MonthPace = {
  hours: number;
  payg: number;
  pack: number;
  packs: number;
  membership: number;
  /** Pay-as-you-go minus membership. Negative when membership costs more. */
  saveVsPayg: number;
  breakEvenHour: number;
  perHourMembership: number;
  perHourPack: number;
  perHourPayg: number;
};

export type WeekPace = MonthPace & {
  hoursPerWeek: number;
  /** Pay-as-you-go minus membership, times 12. Same monthly rate, not a separate price. */
  savePerYear: number;
};

/** One hour a week, counted as 4 weeks in the month. */
export function estimateWeek(hoursPerWeek: number): WeekPace {
  const perWeek = Math.min(HOURS_PER_WEEK_MAX, Math.max(1, Math.round(hoursPerWeek)));
  const monthHours = perWeek * WEEKS_PER_MONTH;
  const packs = Math.ceil(monthHours / SESSIONS_PER_PACK);
  const payg = monthHours * PRICES.baySession;
  const pack = packs * PRICES.tenPack;
  const membership = PRICES.unlimitedMonthly;
  const saveVsPayg = payg - membership;
  return {
    hours: monthHours,
    hoursPerWeek: perWeek,
    payg,
    pack,
    packs,
    membership,
    saveVsPayg,
    savePerYear: saveVsPayg * 12,
    breakEvenHour: breakEvenHour(),
    perHourMembership: membership / monthHours,
    perHourPack: pack / monthHours,
    perHourPayg: PRICES.baySession,
  };
}

/** Cost to cover `hours` one-hour visits in a single month. */
export function estimateMonth(hours: number): MonthPace {
  const count = Math.min(COMPARE_HOURS_MAX, Math.max(1, Math.round(hours)));
  const packs = Math.ceil(count / SESSIONS_PER_PACK);
  const payg = count * PRICES.baySession;
  const pack = packs * PRICES.tenPack;
  const membership = PRICES.unlimitedMonthly;
  return {
    hours: count,
    payg,
    pack,
    packs,
    membership,
    saveVsPayg: payg - membership,
    breakEvenHour: breakEvenHour(),
    perHourMembership: membership / count,
    perHourPack: pack / count,
    perHourPayg: PRICES.baySession,
  };
}
