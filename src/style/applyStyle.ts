import { DEFAULT_STYLE, isStyleId, styleFromSearch, type StyleId } from "../data/styles";

const STORAGE_KEY = "par2play-style";

/**
 * Apply a style id on the preview layout (and a marker on <html>).
 * Tokens live on [data-testid="layout"] so the review chrome can keep its own plate.
 */
export function applyStyle(id: StyleId): void {
  document.documentElement.dataset.stylePreview = id;
  document.documentElement.style.colorScheme = id === "nocturne" ? "dark" : "light";
  for (const node of document.querySelectorAll<HTMLElement>("[data-testid='layout']")) {
    node.dataset.style = id;
  }
}

export function readStoredStyle(): StyleId | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isStyleId(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeStyle(id: StyleId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode */
  }
}

/**
 * Prefer ?style= when present, else the last picked style, else signal.
 * Call once before paint when possible, and again from React.
 */
export function resolveInitialStyle(): StyleId {
  const params = new URLSearchParams(window.location.search);
  if (params.has("style")) return styleFromSearch();
  return readStoredStyle() ?? DEFAULT_STYLE;
}

/** Write the active style into the URL without a navigation. */
export function syncStyleParam(id: StyleId): void {
  const url = new URL(window.location.href);
  if (id === DEFAULT_STYLE) url.searchParams.delete("style");
  else url.searchParams.set("style", id);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}
