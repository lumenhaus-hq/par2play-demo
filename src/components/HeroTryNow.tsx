/**
 * Larger-than-life cue over the storefront centre — dotted looped arrow toward Book a Bay.
 */
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
        viewBox="0 0 160 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Start low-left → loop → climb up-right toward Book a Bay */}
        <path
          className="hero-try-now__stroke"
          d="M 28 128
             C 18 108, 22 88, 42 78
             C 62 68, 78 92, 72 108
             C 66 124, 42 118, 48 96
             C 56 68, 78 48, 108 36
             C 126 28, 138 18, 148 8"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__head"
          d="M 136 4 L 152 4 L 146 20"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength="1"
        />
      </svg>
    </div>
  );
}
