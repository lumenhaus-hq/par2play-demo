/**
 * Verbatim public review excerpts. Do not invent quotes.
 * An empty list makes the carousel render TODO slots instead.
 *
 * Jeric and Ali: Google reviews republished at
 * https://golfsim.co/venues/par2play-somerset/ ("Reviews from Google").
 * Jeric also appears on https://teebly.io/venue/6a180bcb-3e94-438a-b3b4-23ae611e6774
 * Tristan and Kenssy: named reviews on that Teebly page.
 * The 4.9 rating and the 152 count are owner-stated.
 * Google place link: golfsim.co’s “View on Google Maps” uses this CID for
 * 695 Hamilton St G, Somerset, NJ.
 */

export const GOOGLE_RATING = 4.9;

/** Owner-stated count. Do not replace this with a scraped number. */
export const GOOGLE_REVIEW_COUNT = 152;

export const GOOGLE_REVIEWS_URL = "https://maps.google.com/?cid=5382340333318241794";

export type ReviewQuote = {
  id: string;
  excerpt: string;
  /** One real sentence, at most 90 characters, cut on a word from the excerpt. */
  line: string;
  /** First name as published. */
  name: string;
  sourceUrl: string;
};

export const REVIEW_QUOTES: ReviewQuote[] = [
  {
    id: "jeric",
    excerpt:
      "Thank you for the best coaching experience and for helping me improve so much every lesson.",
    line: "Thank you for the best coaching experience and for helping me improve so much.",
    name: "Jeric",
    sourceUrl: "https://golfsim.co/venues/par2play-somerset/",
  },
  {
    id: "ali",
    excerpt: "The team was amazing at helping me plan my husband’s surprise 40th birthday party.",
    line: "The team was amazing at helping me plan my husband’s surprise 40th birthday party.",
    name: "Ali",
    sourceUrl: "https://golfsim.co/venues/par2play-somerset/",
  },
  {
    id: "tristan",
    excerpt: "Great place, great staff, amazing owners.",
    line: "Great place, great staff, amazing owners.",
    name: "Tristan",
    sourceUrl: "https://teebly.io/venue/6a180bcb-3e94-438a-b3b4-23ae611e6774",
  },
  {
    id: "kenssy",
    excerpt: "Had an amazing time at Par2Play.",
    line: "Had an amazing time at Par2Play.",
    name: "Kenssy",
    sourceUrl: "https://teebly.io/venue/6a180bcb-3e94-438a-b3b4-23ae611e6774",
  },
];

export const REVIEW_TODO_SLOTS: ReviewQuote[] = [
  {
    id: "todo-1",
    excerpt: "TODO: paste a verified Google review excerpt.",
    line: "TODO: paste a verified Google review excerpt.",
    name: "TODO",
    sourceUrl: "",
  },
  {
    id: "todo-2",
    excerpt: "TODO: paste a verified Google review excerpt.",
    line: "TODO: paste a verified Google review excerpt.",
    name: "TODO",
    sourceUrl: "",
  },
];
