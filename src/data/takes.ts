/** Full homepage rebuilds — distinct interaction languages, not theme skins. */
export type TakeId = "classic" | "orbit" | "ledger" | "strike";

export type TakeMeta = {
  id: TakeId;
  label: string;
  blurb: string;
};

export const TAKES: readonly TakeMeta[] = [
  {
    id: "classic",
    label: "Classic",
    blurb: "Current production landing",
  },
  {
    id: "orbit",
    label: "Orbit",
    blurb: "Cinema bay — magnetic, scrubbed horizontal tour",
  },
  {
    id: "ledger",
    label: "Ledger",
    blurb: "Pinned chapters — soft cursor, peel cards",
  },
  {
    id: "strike",
    label: "Strike",
    blurb: "Impact wipes — trail cursor, brass kinetic type",
  },
] as const;

const TAKE_IDS = new Set<string>(TAKES.map((take) => take.id));

export function isTakeId(value: string | null | undefined): value is TakeId {
  return Boolean(value && TAKE_IDS.has(value));
}

export function takeFromSearch(search = window.location.search): TakeId {
  const value = new URLSearchParams(search).get("take");
  return isTakeId(value) ? value : "classic";
}

export function takeMeta(id: TakeId): TakeMeta {
  return TAKES.find((take) => take.id === id) ?? TAKES[0];
}
