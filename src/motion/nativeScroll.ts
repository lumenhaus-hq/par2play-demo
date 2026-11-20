/** Phones and other coarse pointers should use the browser's own scroll. */
export function prefersNativeScroll(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}
