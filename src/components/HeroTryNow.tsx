/**
 * Compact cue tucked under the header Book a Bay control — short static arrow.
 */
export function HeroTryNow({ visible }: { visible: boolean }) {
  return (
    <div
      className={`hero-try-now${visible ? " hero-try-now--in" : ""}`}
      aria-hidden="true"
      data-testid="hero-try-now"
    >
      <svg
        className="hero-try-now__arrow"
        viewBox="0 0 72 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Short climb up-right toward Book a Bay */}
        <path
          className="hero-try-now__stroke"
          d="M 10 54 C 18 40, 28 22, 52 10"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__head"
          d="M 42 6 L 56 6 L 52 18"
          stroke="currentColor"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="hero-try-now__label">Try now</span>
    </div>
  );
}
