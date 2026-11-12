import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
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
    if (reduce) {
      unbindSmoothScroll();
      return;
    }

    let cancel = false;
    let dispose: (() => void) | undefined;
    let tries = 0;

    const mount = () => {
      if (cancel) return;
      if (layout === "mobile") {
        const wrapper = document.querySelector<HTMLElement>("[data-smooth-root]");
        const content = wrapper?.querySelector<HTMLElement>("[data-smooth-content]") ?? wrapper;
        if (!wrapper || !content) {
          if (tries++ < 40) {
            requestAnimationFrame(mount);
          }
          return;
        }
        dispose = bindSmoothScroll({ wrapper, content });
        return;
      }
      dispose = bindSmoothScroll({});
    };

    mount();
    return () => {
      cancel = true;
      dispose?.();
      unbindSmoothScroll();
    };
  }, [reduce, layout]);

  return null;
}
