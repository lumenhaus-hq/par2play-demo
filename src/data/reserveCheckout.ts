import { bookingHref, type BookingOffer } from "./business";

const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 22 * 60;

export type DurationChoice = {
  id: string;
  label: string;
  minutes: number;
};

export type ReservePlan =
  | {
      kind: "slots";
      durations: readonly DurationChoice[];
      partyMax: number;
      step: number;
      /** Bay rental is the only flow where a crafted `tr` token restored the slot. */
      passTime: boolean;
      note: string;
    }
  | {
      kind: "start";
      note: string;
    };

const SLOT_NOTE = "These times are inside our 10am–10pm hours. GolfClock confirms the time on the next step.";

const BAY_DURATIONS: readonly DurationChoice[] = [
  { id: "var_bay_30m", label: "30m", minutes: 30 },
  { id: "var_bay_1h", label: "1h", minutes: 60 },
  { id: "var_bay_2h", label: "2h", minutes: 120 },
  { id: "var_bay_3h", label: "3h", minutes: 180 },
];

const LESSON_30: DurationChoice = { id: "var_lesson_30m", label: "Single Lesson 30 Min", minutes: 30 };
const SWING_50: DurationChoice = { id: "var_lesson_swing_eval", label: "Swing Evaluation", minutes: 50 };
const FITTING: readonly DurationChoice[] = [
  { id: "var_fitting_driver", label: "Club Fitting - Driver", minutes: 60 },
  { id: "var_fitting_irons", label: "Club Fitting - Irons", minutes: 60 },
  { id: "var_fitting_wedges", label: "Club Fitting - Wedges", minutes: 60 },
  { id: "var_fitting_full_bag", label: "Club Fitting - Full Bag", minutes: 120 },
];

const STORE_NOTE = "GolfClock sells this as a purchase, with no tee time. The start date is confirmed on the next step.";
const EVENTS_NOTE = "GolfClock’s events list has no open registration and no time grid. The start date is confirmed on the next step.";
const LEAGUE_NOTE =
  "This GolfClock link still opens the bay rental sheet. Pick a time inside 10am–10pm. GolfClock confirms it on the next step.";

export function reservePlan(offer: BookingOffer): ReservePlan {
  switch (offer) {
    case "bay":
      return { kind: "slots", durations: BAY_DURATIONS, partyMax: 6, step: 30, passTime: true, note: SLOT_NOTE };
    case "lesson":
    case "junior":
    case "junior-plus":
    case "junior-experience":
      return { kind: "slots", durations: [LESSON_30], partyMax: 2, step: 30, passTime: false, note: SLOT_NOTE };
    case "swing-evaluation":
    case "swing-lab":
      return { kind: "slots", durations: [SWING_50], partyMax: 2, step: 30, passTime: false, note: SLOT_NOTE };
    case "fitting":
      return { kind: "slots", durations: FITTING, partyMax: 2, step: 30, passTime: false, note: SLOT_NOTE };
    case "tournament":
      return { kind: "slots", durations: BAY_DURATIONS, partyMax: 6, step: 30, passTime: false, note: LEAGUE_NOTE };
    case "practice-unlimited":
    case "lesson-pack":
    case "ten-pack":
      return { kind: "start", note: STORE_NOTE };
    case "group":
      return { kind: "start", note: EVENTS_NOTE };
    default: {
      const exhaustive: never = offer;
      return exhaustive;
    }
  }
}

export function slotStarts(step: number, duration: number): number[] {
  const last = CLOSE_MINUTES - duration;
  const starts: number[] = [];
  for (let minute = OPEN_MINUTES; minute <= last; minute += step) starts.push(minute);
  return starts;
}

export function formatClock(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

export function todayIso(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year!, (month ?? 1) - 1, day);
  date.setDate(date.getDate() + days);
  return todayIso(date);
}

export function dayChip(iso: string): { weekday: string; day: string } {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year!, (month ?? 1) - 1, day);
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    day: String(date.getDate()),
  };
}

/** Wall-clock America/New_York time as an ISO instant. GolfClock stores startTime in UTC. */
export function newYorkStartIso(date: string, minutes: number): string {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  const wallAsUtc = new Date(`${date}T${hour}:${minute}:00Z`).getTime();
  const offset = newYorkOffsetMinutes(new Date(wallAsUtc));
  return new Date(wallAsUtc - offset * 60_000).toISOString();
}

function newYorkOffsetMinutes(instant: Date): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name ?? "");
  if (!match) return -300;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

export function handoffUrl(
  offer: BookingOffer,
  pick: { date: string; startMinutes?: number; duration?: DurationChoice },
): string {
  const href = bookingHref(offer);
  const url = new URL(href);
  if (!url.pathname.endsWith("/book")) return href;
  url.searchParams.set("date", pick.date);
  const plan = reservePlan(offer);
  if (plan.kind === "slots" && plan.passTime && pick.duration && pick.startMinutes != null) {
    const token = btoa(
      JSON.stringify({
        resources: { res_bay_1: "auto" },
        variant: { variantId: pick.duration.id, minutes: pick.duration.minutes },
        startTime: newYorkStartIso(pick.date, pick.startMinutes),
      }),
    );
    url.searchParams.set("tr", token);
  }
  return url.toString();
}
