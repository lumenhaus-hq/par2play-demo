import Lenis from "lenis";

type BindOptions = {
  /** Element scroller (phone frame). Omit for window scroll. */
  wrapper?: HTMLElement | null;
  content?: HTMLElement | null;
};

let lenis: Lenis | null = null;
let lockObserver: MutationObserver | null = null;
let rafBound = false;

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
  rafBound = false;
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

/** Create or replace the site Lenis instance. Pass null wrapper for window scroll. */
export function bindSmoothScroll({ wrapper, content }: BindOptions = {}) {
  destroy();

  const isElement = wrapper instanceof HTMLElement;
  lenis = new Lenis({
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

  rafBound = true;
  watchLock();
  return () => {
    if (!rafBound) return;
    destroy();
  };
}

/** Tear down Lenis (reduced motion / Pause motion / unmount). */
export function unbindSmoothScroll() {
  destroy();
}
