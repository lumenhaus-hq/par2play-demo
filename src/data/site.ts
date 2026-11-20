/**
 * Launch origin for canonicals, Open Graph, JSON-LD, sitemap, robots, and llms.txt.
 * Asset paths still use Vite's BASE_URL, so the GitHub Pages demo can load.
 */
export const SITE_URL = "https://par2play.com/";

/**
 * Instagram is on the live site. Facebook is the page linked from the live
 * par2play.com footer and Yoast sameAs.
 * FLAG: a Google listing points at a different page, facebook.com/102565266099864.
 * Only the footer page is included here.
 */
export const SAME_AS = [
  "https://www.instagram.com/par2play/",
  "https://www.facebook.com/people/Par2play/100090440193611/",
] as const;

export const INSTAGRAM_URL = "https://www.instagram.com/par2play/";

/** Place link used for directions. Not a lat/long. */
export const MAPS_URL = "https://maps.google.com/?cid=5382340333318241794";

/** Chandan, 30 Oct 2026. Daily, no exceptions listed. */
export const HOURS_LABEL = "10am–10pm daily";

export const OPENING_HOURS_SPEC = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "10:00",
  closes: "22:00",
} as const;

/** Layout switcher for the GitHub Pages demo. Cutover sets VITE_DEMO=false. */
export function showDemoChrome(): boolean {
  return import.meta.env.VITE_DEMO !== "false";
}

export function siteOrigin(): string {
  return SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(path = ""): string {
  const base = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;
  if (!path) return base;
  return `${base}${path.replace(/^\//, "")}`;
}

