import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Hand-drawn cue. The arrow tip sits just under the header Book a Bay edge.
 * Movement is transform-only so placing it does not score as layout shift.
 */
export function HeroTryNow({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let done = false;
    const targets: EventTarget[] = [window];
    const smooth = root.closest<HTMLElement>("[data-smooth-root]");
    if (smooth) targets.push(smooth);
    let parent = root.parentElement;
    while (parent) {
      const overflow = getComputedStyle(parent).overflowY;
      if (overflow === "auto" || overflow === "scroll") targets.push(parent);
      parent = parent.parentElement;
    }
    const onScroll = (event: Event) => {
      if (done) return;
      const current = event.currentTarget;
      const top = current === window ? window.scrollY : (current as HTMLElement).scrollTop;
      if (top <= 12) return;
      done = true;
      setRetired(true);
      for (const target of targets) target.removeEventListener("scroll", onScroll);
    };
    for (const target of targets) target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      for (const target of targets) target.removeEventListener("scroll", onScroll);
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
      <svg className="hero-try-now__arrow" viewBox="0 0 96 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 118 C 8 96, 44 102, 32 76 S 4 50, 38 34 C 50 28, 54 20, 52 10"
          stroke="#06110b"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="hero-try-now__stroke"
          d="M16 118 C 8 96, 44 102, 32 76 S 4 50, 38 34 C 50 28, 54 20, 52 10"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 26 C 42 16, 48 12, 52 8 M 52 8 C 60 16, 66 20, 74 30"
          stroke="#06110b"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="hero-try-now__head"
          d="M34 26 C 42 16, 48 12, 52 8 M 52 8 C 60 16, 66 20, 74 30"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle data-arrow-tip="" cx="52" cy="8" r="2.2" fill="transparent" />
      </svg>
      <span className="hero-try-now__label">Try now</span>
    </div>
  );
}
