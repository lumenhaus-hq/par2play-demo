/** Squiggly cue pointing at the header Book a Bay CTA. Decorative only. */
export function HeroTryNow({ visible }: { visible: boolean }) {
  return (
    <div
      className={`hero-try-now${visible ? " hero-try-now--in" : ""}`}
      aria-hidden="true"
      data-testid="hero-try-now"
    >
      <span className="hero-try-now__label">Try now</span>
      <svg
        className="hero-try-now__arrow"
        viewBox="0 0 88 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="hero-try-now__stroke"
          d="M10 58 C 18 42, 28 22, 42 18 C 54 14, 62 28, 70 20 C 74 16, 76 10, 78 6"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__head"
          d="M68 4 L80 4 L76 16"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength="1"
        />
      </svg>
    </div>
  );
}
