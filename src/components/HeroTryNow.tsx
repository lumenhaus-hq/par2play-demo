/** Neon hand-drawn “Try now” cue that points up at Book a Bay in the toolbar. */
export function HeroTryNow({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-try-now ${className}`.trim()} aria-hidden="true">
      <p className="hero-try-now__label">Try now</p>
      <img
        className="hero-try-now__arrow"
        src={`${import.meta.env.BASE_URL}media/try-now-arrow.png`}
        alt=""
        width={204}
        height={79}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
