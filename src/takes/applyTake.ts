import { isTakeId, takeFromSearch, type TakeId } from "../data/takes";

const STORAGE_KEY = "par2play-take";

export function applyTake(id: TakeId): void {
  document.documentElement.dataset.take = id;
  for (const node of document.querySelectorAll<HTMLElement>("[data-testid='layout']")) {
    node.dataset.take = id;
  }
}

export function readStoredTake(): TakeId | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isTakeId(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTake(id: TakeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode */
  }
}

export function resolveInitialTake(): TakeId {
  const params = new URLSearchParams(window.location.search);
  if (params.has("take")) return takeFromSearch();
  return readStoredTake() ?? "classic";
}

export function syncTakeParam(id: TakeId): void {
  const url = new URL(window.location.href);
  if (id === "classic") url.searchParams.delete("take");
  else url.searchParams.set("take", id);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}
