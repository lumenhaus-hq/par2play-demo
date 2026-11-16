import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Subtle cursor-reactive 3D tilt. Fine pointer only; disabled for reduced /
 * paused motion and coarse touch.
 */
export function usePointerTilt<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T | null>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce || navigator.webdriver) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--tilt-x", `${(-y * strength).toFixed(2)}deg`);
        node.style.setProperty("--tilt-y", `${(x * strength).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      node.style.removeProperty("--tilt-x");
      node.style.removeProperty("--tilt-y");
    };
  }, [reduce, strength]);

  return ref;
}
