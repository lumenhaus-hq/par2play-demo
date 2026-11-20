import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const PIECES: readonly { x: string; y: string; r: string; color: string }[] = [
  { x: "-4.6rem", y: "-2.4rem", r: "-32deg", color: "#e8ff66" },
  { x: "-3.1rem", y: "-3.4rem", r: "18deg", color: "#14d45e" },
  { x: "-1.2rem", y: "-3.6rem", r: "-12deg", color: "#ffffff" },
  { x: "1.4rem", y: "-3.3rem", r: "28deg", color: "#e8ff66" },
  { x: "3.4rem", y: "-2.6rem", r: "-24deg", color: "#7dffb0" },
  { x: "4.8rem", y: "-1.2rem", r: "16deg", color: "#14d45e" },
  { x: "-4.8rem", y: "-0.4rem", r: "22deg", color: "#ffffff" },
  { x: "4.4rem", y: "0.6rem", r: "-18deg", color: "#e8ff66" },
  { x: "-2.4rem", y: "-1.6rem", r: "36deg", color: "#14d45e" },
  { x: "2.2rem", y: "-1.5rem", r: "-28deg", color: "#7dffb0" },
];

/** One burst when the price card enters the view. Absolutely positioned, so it does not shift layout. */
export function CouponConfetti() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce || navigator.webdriver) return;
    const motionOff = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("motion-paused");
    if (motionOff()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || motionOff()) return;
        setPlay(true);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} className={`coupon-burst${play ? " is-on" : ""}`} aria-hidden="true">
      {PIECES.map((piece) => (
        <span
          key={`${piece.x}-${piece.y}`}
          style={{ "--x": piece.x, "--y": piece.y, "--r": piece.r, background: piece.color } as CSSProperties}
        />
      ))}
    </div>
  );
}
