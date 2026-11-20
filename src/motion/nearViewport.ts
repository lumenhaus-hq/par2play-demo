/**
 * Shrink the bottom of the observer root so a section that is only peeking
 * under the first screen does not count as near. The block counts once its
 * top has entered the upper ~60% of the viewport.
 */
export const NEAR_VIEWPORT: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -38% 0px",
  threshold: 0,
};
