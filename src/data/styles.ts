/** Visual brand variants for side-by-side review. Default stays the live Fairway look. */
export type StyleId = "fairway" | "signal" | "nocturne" | "mist";

export type StyleMeta = {
  id: StyleId;
  label: string;
  blurb: string;
};

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

const STYLE_IDS = new Set<string>(STYLES.map((style) => style.id));

export function isStyleId(value: string | null | undefined): value is StyleId {
  return Boolean(value && STYLE_IDS.has(value));
}

/** Read ?style= from the URL. Missing or unknown → fairway. */
export function styleFromSearch(search = window.location.search): StyleId {
  const value = new URLSearchParams(search).get("style");
  return isStyleId(value) ? value : "fairway";
}

export function styleMeta(id: StyleId): StyleMeta {
  return STYLES.find((style) => style.id === id) ?? STYLES[0];
}
