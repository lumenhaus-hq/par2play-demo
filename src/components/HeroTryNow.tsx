import { useLayoutEffect, useRef } from "react";

/**
 * Hand-drawn cue whose arrow tip stays on the header Book a Bay control.
 * Position and rotation are measured from that button, not from viewport offsets.
 */
export function HeroTryNow({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tip = root.querySelector<SVGGraphicsElement>("[data-arrow-tip]");
    const button = document.querySelector<HTMLElement>("header a[data-offer='bay']");
    const hero = root.closest<HTMLElement>("#hero");
    if (!tip || !button || !hero) return;

    const place = () => {
      root.style.left = "0px";
      root.style.top = "0px";
      root.style.transform = "none";
      const tipBox = tip.getBoundingClientRect();
      const btn = button.getBoundingClientRect();
      const rootBox = root.getBoundingClientRect();
      const targetX = btn.left + btn.width / 2;
      const targetY = btn.bottom - 3;
      const dx = targetX - (tipBox.left + tipBox.width / 2);
      const dy = targetY - (tipBox.top + tipBox.height / 2);
      const originX = tipBox.left + tipBox.width / 2 - rootBox.left;
      const originY = tipBox.top + tipBox.height / 2 - rootBox.top;
      root.style.left = `${dx}px`;
      root.style.top = `${dy}px`;
      root.style.transformOrigin = `${originX}px ${originY}px`;
      root.style.transform = "rotate(-8deg)";
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
      className={`hero-try-now${visible ? " hero-try-now--in" : ""}`}
      aria-hidden="true"
      data-testid="hero-try-now"
    >
      <svg className="hero-try-now__arrow" viewBox="0 0 64 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className="hero-try-now__stroke"
          d="M 12 70 C 16 50, 22 32, 32 16"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__head"
          d="M 22 20 L 32 6 L 44 22"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle data-arrow-tip="" cx="32" cy="6" r="1.4" fill="transparent" />
      </svg>
      <span className="hero-try-now__label">Try now</span>
    </div>
  );
}
