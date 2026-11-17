/** Visual brand variants for side-by-side review. Demo chrome ships Signal. */
export type StyleId = "fairway" | "signal" | "nocturne" | "mist";

export type StyleMeta = {
  id: StyleId;
  label: string;
  blurb: string;
};

export const DEFAULT_STYLE: StyleId = "signal";

/** Full token set — URL deep-links still resolve. */
export const STYLES: readonly StyleMeta[] = [
  {
    id: "fairway",
    label: "Fairway",
    blurb: "Live green — athletic and familiar",
  },
  {
    id: "signal",
    label: "Signal",
    blurb: "Navy + volt lime — range LED energy",
  },
  {
    id: "nocturne",
    label: "Nocturne",
    blurb: "Warm charcoal + brass — after-hours bay",
  },
  {
    id: "mist",
    label: "Mist",
    blurb: "Cool sage + teal — morning practice",
  },
] as const;

/** Review chrome — Classic homepage pairs with Signal. */
export const DEMO_STYLES: readonly StyleMeta[] = STYLES.filter((style) => style.id === "signal");

const STYLE_IDS = new Set<string>(STYLES.map((style) => style.id));

export function isStyleId(value: string | null | undefined): value is StyleId {
  return Boolean(value && STYLE_IDS.has(value));
}

/** Read ?style= from the URL. Missing or unknown → signal. */
export function styleFromSearch(search = window.location.search): StyleId {
  const value = new URLSearchParams(search).get("style");
  return isStyleId(value) ? value : DEFAULT_STYLE;
}

export function styleMeta(id: StyleId): StyleMeta {
  return STYLES.find((style) => style.id === id) ?? STYLES[0];
}
