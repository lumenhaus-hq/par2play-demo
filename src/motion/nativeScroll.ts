/**
 * Prefer the browser's own scroll. Lenis + a live hero film made desktop wheel
 * feel frozen through membership; phones already used native. Keep this true
 * for every pointer so wheel notches map 1:1 to scroll.
 */
export function prefersNativeScroll(): boolean {
  return true;
}
