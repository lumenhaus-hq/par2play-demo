/**
 * Facts taken from https://par2play.com/events/ and https://par2play.com/holiday-party/.
 * Do not add packages, prices, or venues that those pages do not state.
 */
export type EventTypeId = "corporate" | "parties" | "leagues" | "outings";

/**
 * Four categories. Each line only restates a fact already on par2play.com/events
 * or the holiday page, and it is not a gallery caption.
 */
export const EVENT_TYPES: readonly { id: EventTypeId; label: string; line: string }[] = [
  { id: "corporate", label: "Corporate & team events", line: "Team building for groups of 50+." },
  { id: "parties", label: "Private parties", line: "Holidays & birthdays, groups of 6–40." },
  { id: "leagues", label: "Leagues & tournaments", line: "Fundraisers and contests on the sims." },
  { id: "outings", label: "Group outings", line: "Bachelor parties and small crews." },
];

export const EVENT_FACTS = [
  "Four enclosed bays with comfortable seating and HDTVs in the studio.",
  "Associates are there to help host the gathering.",
  "Event hosting includes a golf pro for mini-lessons, the simulators, and casual games.",
  "Packages are worked out around the request. The site does not publish a price list.",
] as const;

export const HOLIDAY_FACTS = [
  "The holiday page invites groups of 6 to 40, in a bay or across the venue.",
  "Food can be catered or brought in. Beers and wines are welcome; it is BYOB.",
  "Listed perks include 2 or 3 hours, reserved bays, SONOS music, complimentary clubs, and a karaoke system on the TVs.",
  "Each bay holds up to 6 guests. The events phone number is (732) 448-2769.",
] as const;
