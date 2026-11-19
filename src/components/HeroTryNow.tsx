/**
 * Top-right cue: glowing Try now + dotted looped arrow climbing into Book a Bay.
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
        viewBox="0 0 180 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* From under the label → loop → climb up-right to Book a Bay */}
        <path
          className="hero-try-now__stroke"
          d="M 42 168
             C 22 148, 18 118, 38 102
             C 58 86, 86 108, 78 132
             C 70 156, 40 150, 48 122
             C 58 88, 88 62, 118 42
             C 138 28, 152 16, 168 6"
          stroke="currentColor"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <path
          className="hero-try-now__head"
          d="M 152 2 L 174 2 L 166 22"
          stroke="currentColor"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength="1"
        />
      </svg>
    </div>
  );
}
