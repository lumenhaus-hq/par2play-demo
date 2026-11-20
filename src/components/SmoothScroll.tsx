import { useEffect } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { prefersNativeScroll } from "../motion/nativeScroll";
import { bindSmoothScroll, unbindSmoothScroll } from "../motion/smoothScroll";
import { useFlow } from "../state/flow";

/**
 * Site-wide Lenis smooth scroll. Window scroll on desktop; the phone-frame
 * scroller on mobile preview. Off when OS reduce or Pause motion is on.
 */
export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();
  const layout = useFlow().layout;

  useEffect(() => {
    // Prefer the live media query so hydration's reduce=false snapshot cannot
    // leave Lenis running when the OS (or Playwright) asks for reduce.
    const osReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || osReduce || prefersNativeScroll()) {
      unbindSmoothScroll();
      return;
    }

    let cancel = false;
    let dispose: (() => void) | undefined;
    let tries = 0;

    const mount = () => {
      if (cancel || prefersNativeScroll()) return;
      const arm = (options: Parameters<typeof bindSmoothScroll>[0]) => {
        void bindSmoothScroll(options).then((stop) => {
          if (cancel || prefersNativeScroll()) {
            stop();
            unbindSmoothScroll();
            return;
          }
          dispose = stop;
        });
      };
      if (layout === "mobile") {
        const wrapper = document.querySelector<HTMLElement>("[data-smooth-root]");
        const content = wrapper?.querySelector<HTMLElement>("[data-smooth-content]") ?? wrapper;
        if (!wrapper || !content) {
          if (tries++ < 40) {
            requestAnimationFrame(mount);
          }
          return;
        }
        arm({ wrapper, content });
        return;
      }
      arm({});
    };

    mount();
    const coarse = window.matchMedia("(pointer: coarse)");
    const hoverNone = window.matchMedia("(hover: none)");
    const onPointer = () => {
      if (!prefersNativeScroll()) return;
      cancel = true;
      dispose?.();
      unbindSmoothScroll();
    };
    coarse.addEventListener("change", onPointer);
    hoverNone.addEventListener("change", onPointer);
    return () => {
      cancel = true;
      dispose?.();
      unbindSmoothScroll();
      coarse.removeEventListener("change", onPointer);
      hoverNone.removeEventListener("change", onPointer);
    };
  }, [reduce, layout]);

  return null;
}
