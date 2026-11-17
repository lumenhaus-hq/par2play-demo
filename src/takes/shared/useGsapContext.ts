import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "../../motion/smoothScroll";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Builder = () => void;

/**
 * Scoped GSAP context that cleans up on unmount and refreshes ScrollTrigger
 * against Lenis when smooth scroll is live.
 */
export function useGsapContext(builder: Builder, deps: unknown[] = []) {
  const root = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reduce) return;
    const lenis = getLenis();
    const onScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onScroll);

    const ctx = gsap.context(() => {
      builder();
      ScrollTrigger.refresh();
    }, root);

    return () => {
      lenis?.off("scroll", onScroll);
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearScrollMemory?.();
      document.documentElement.classList.remove("take-cursor-on");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns deps
  }, [reduce, ...deps]);

  return root;
}
