import type Lenis from "lenis";

type BindOptions = {
  /** Element scroller (phone frame). Omit for window scroll. */
  wrapper?: HTMLElement | null;
  content?: HTMLElement | null;
};

let lenis: Lenis | null = null;
let lockObserver: MutationObserver | null = null;
let generation = 0;

/** Expo out — the usual Awwwards / Studio Freight curve. */
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function syncLock() {
  if (!lenis) return;
  if (document.documentElement.classList.contains("hero-scroll-lock")) lenis.stop();
  else lenis.start();
}

function watchLock() {
  lockObserver?.disconnect();
  lockObserver = new MutationObserver(syncLock);
  lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncLock();
}

function destroy() {
  lockObserver?.disconnect();
  lockObserver = null;
  lenis?.destroy();
  lenis = null;
  // Lenis should clear these; force-remove so reduced-motion never leaves a sticky class.
  document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling", "lenis-stopped");
}

/** Active Lenis instance, if smooth scroll is live. */
export function getLenis() {
  return lenis;
}

/**
 * Smooth-scroll to a target. Falls back to native scrollIntoView when Lenis is off.
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options: { offset?: number; immediate?: boolean } = {},
) {
  const offset = options.offset ?? -96;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: options.immediate, duration: 1.35, easing: easeOutExpo });
    return;
  }
  if (typeof target === "string") {
    const node = document.querySelector(target);
    node?.scrollIntoView({ behavior: options.immediate ? "auto" : "smooth", block: "start" });
    return;
  }
  if (typeof target === "number") {
    const root = document.scrollingElement ?? document.documentElement;
    root.scrollTo({ top: target, behavior: options.immediate ? "auto" : "smooth" });
    return;
  }
  target.scrollIntoView({ behavior: options.immediate ? "auto" : "smooth", block: "start" });
}

/**
 * Create or replace the site Lenis instance. Pass null wrapper for window scroll.
 * Lenis is loaded on demand so coarse pointers never parse it or attach
 * non-passive touch/wheel listeners.
 */
export function bindSmoothScroll({ wrapper, content }: BindOptions = {}): Promise<() => void> {
  const token = ++generation;
  return Promise.all([import("lenis"), import("lenis/dist/lenis.css")]).then(([{ default: LenisCtor }]) => {
    if (token !== generation) return () => {};
    destroy();
    const isElement = wrapper instanceof HTMLElement;
    lenis = new LenisCtor({
      wrapper: isElement ? wrapper : window,
      content: isElement ? (content ?? wrapper!) : document.documentElement,
      eventsTarget: isElement ? wrapper! : window,
      autoRaf: true,
      anchors: { offset: -96, duration: 1.35, easing: easeOutExpo },
      // Lerp (not duration) for wheel inertia — duration is reserved for scrollTo / anchors.
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: isElement,
      syncTouchLerp: 0.08,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.35,
      overscroll: true,
      autoToggle: false,
      prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
    });
    watchLock();
    return () => {
      if (token !== generation) return;
      destroy();
    };
  });
}

/** Tear down Lenis (reduced motion / Pause motion / coarse pointer / unmount). */
export function unbindSmoothScroll() {
  generation += 1;
  destroy();
}
