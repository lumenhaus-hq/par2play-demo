import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type RevealTone = "rise" | "tilt" | "sheen";

/**
 * Scroll-triggered entrance. Uses IntersectionObserver so Lenis remains the
 * scroll owner; reduced / paused motion shows content immediately.
 */
export function ScrollReveal({
  children,
  className = "",
  tone = "rise",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  tone?: RevealTone;
  delay?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce || navigator.webdriver) return;
    // Phones get an earlier trigger so copy is readable before the thumb stops.
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const view = window.innerHeight || document.documentElement.clientHeight;
    const box = node.getBoundingClientRect();
    // Already on screen: stay visible. Never start a title at opacity 0.
    if (box.top < view * 0.94 && box.bottom > 0) return;
    node.dataset.reveal = "out";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset.reveal = "in";
        observer.disconnect();
      },
      { rootMargin: mobile ? "0px 0px -6% 0px" : "0px 0px -12% 0px", threshold: mobile ? 0.08 : 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={`reveal-block reveal-block--${tone} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      data-reveal="in"
    >
      {children}
    </div>
  );
}
