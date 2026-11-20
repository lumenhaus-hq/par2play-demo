import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Hand-drawn cue. The arrow tip sits just under the header Book a Bay edge.
 * Movement is transform-only so placing it does not score as layout shift.
 */
export function HeroTryNow({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    let done = false;
    const root = document.querySelector("[data-smooth-root]");
    const onScroll = () => {
      if (done) return;
      const nested = root instanceof HTMLElement ? root.scrollTop : 0;
      if (Math.max(window.scrollY, nested) <= 12) return;
      done = true;
      setRetired(true);
      window.removeEventListener("scroll", onScroll);
      root?.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    root?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      root?.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tip = root.querySelector<SVGGraphicsElement>("[data-arrow-tip]");
    const button = document.querySelector<HTMLElement>("header a[data-offer='bay']");
    const hero = root.closest<HTMLElement>("#hero");
    if (!tip || !button || !hero) return;

    const place = () => {
      root.style.transform = "none";
      const tipBox = tip.getBoundingClientRect();
      const btn = button.getBoundingClientRect();
      const rootBox = root.getBoundingClientRect();
      const targetX = btn.left + btn.width / 2;
      const targetY = btn.bottom + 1;
      const dx = targetX - (tipBox.left + tipBox.width / 2);
      const dy = targetY - (tipBox.top + tipBox.height / 2);
      const originX = tipBox.left + tipBox.width / 2 - rootBox.left;
      const originY = tipBox.top + tipBox.height / 2 - rootBox.top;
      root.style.transformOrigin = `${originX}px ${originY}px`;
      root.style.transform = `translate(${dx}px, ${dy}px) rotate(-6deg)`;
    };

    place();
    const header = button.closest("header");
    const onAnim = (event: AnimationEvent) => {
      if (event.animationName === "chrome-in") place();
    };
    header?.addEventListener("animationend", onAnim);
    window.addEventListener("resize", place, { passive: true });
    const observer = new ResizeObserver(place);
    observer.observe(button);
    observer.observe(hero);
    const fonts = document.fonts?.ready.then(() => place());
    return () => {
      header?.removeEventListener("animationend", onAnim);
      window.removeEventListener("resize", place);
      observer.disconnect();
      void fonts;
    };
  }, [visible]);

  return (
    <div
      ref={rootRef}
      className={`hero-try-now${visible && !retired ? " hero-try-now--in" : ""}${retired ? " hero-try-now--gone" : ""}`}
      aria-hidden="true"
      data-testid="hero-try-now"
      data-retired={retired ? "true" : "false"}
    >
      <svg className="hero-try-now__arrow" viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 14 100 C 22 72, 34 40, 40 18"
          stroke="#06110b"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__stroke"
          d="M 14 100 C 22 72, 34 40, 40 18"
          stroke="currentColor"
          strokeWidth="5.2"
          strokeLinecap="round"
          pathLength="1"
        />
        <path d="M 26 24 L 40 6 L 56 26" stroke="#06110b" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path
          className="hero-try-now__head"
          d="M 26 24 L 40 6 L 56 26"
          stroke="currentColor"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle data-arrow-tip="" cx="40" cy="6" r="2.2" fill="transparent" />
      </svg>
      <span className="hero-try-now__label">Try now!</span>
    </div>
  );
}
