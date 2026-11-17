/** Hero offer type recipes — color, weight, and pairing only. */
export type HeroTypeId = "pulse" | "plate" | "drive";

export type HeroTypeMeta = {
  id: HeroTypeId;
  label: string;
  blurb: string;
};

export const HERO_TYPES: readonly HeroTypeMeta[] = [
  {
    id: "pulse",
    label: "Pulse",
    blurb: "Syne 700 + Manrope caption + ring mark",
  },
  {
    id: "plate",
    label: "Plate",
    blurb: "Outfit + Space Grotesk + Yellowtail hit",
  },
  {
    id: "drive",
    label: "Drive",
    blurb: "Barlow eyebrow + Sora 700 impact line",
  },
] as const;

const HERO_TYPE_IDS = new Set<string>(HERO_TYPES.map((item) => item.id));

export function isHeroTypeId(value: string | null | undefined): value is HeroTypeId {
  return Boolean(value && HERO_TYPE_IDS.has(value));
}

export function heroTypeFromSearch(search = window.location.search): HeroTypeId {
  const value = new URLSearchParams(search).get("type");
  return isHeroTypeId(value) ? value : "pulse";
}

export function heroTypeMeta(id: HeroTypeId): HeroTypeMeta {
  return HERO_TYPES.find((item) => item.id === id) ?? HERO_TYPES[0];
}
