import { useEffect, useState } from "react";
import { GOOGLE_RATING, REVIEW_QUOTES, REVIEW_TODO_SLOTS } from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const quotes = REVIEW_QUOTES.length > 0 ? REVIEW_QUOTES : REVIEW_TODO_SLOTS;

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 ${className ?? ""}`} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 1.6 12.4 7l5.9.5-4.5 3.8 1.4 5.7L10 14.2 4.8 17l1.4-5.7L1.7 7.5 7.6 7 10 1.6Z"
      />
    </svg>
  );
}

function Stars() {
  const fill = GOOGLE_RATING / 5;
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((star) => {
        const amount = Math.min(1, Math.max(0, fill * 5 - star));
        return (
          <span key={star} className="relative inline-block h-4 w-4">
            <Star className="text-white/30" />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${amount * 100}%` }}>
              <Star className="text-accent" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function ReviewCarousel() {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const count = quotes.length;
  const active = quotes[index] ?? quotes[0];
  const paused = reduce || holding || manualPause || navigator.webdriver;

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (!active) return null;

  const go = (next: number) => {
    setIndex((next + count) % count);
  };

  return (
    <div
      className="max-w-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Google reviews"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) return;
        setHolding(false);
      }}
    >
      <p className="flex items-center gap-3 text-sm text-white">
        <Stars />
        <span>
          <span className="font-semibold">{GOOGLE_RATING}</span>
          <span className="sr-only"> out of 5. </span>
          <span className="ml-2 uppercase tracking-[0.16em] text-white/80">Google reviews</span>
        </span>
      </p>
      <blockquote className="mt-5" aria-live="polite" aria-atomic="true">
        <p className="font-display text-2xl leading-snug text-white @3xl:text-3xl">“{active.excerpt}”</p>
        <footer className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75">
          {active.name}
        </footer>
      </blockquote>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 hover:text-white"
          onClick={() => go(index - 1)}
        >
          Prev
        </button>
        <button
          type="button"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 hover:text-white"
          onClick={() => go(index + 1)}
        >
          Next
        </button>
        {!reduce && (
          <button
            type="button"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 hover:text-white"
            aria-pressed={manualPause}
            onClick={() => setManualPause((value) => !value)}
          >
            {manualPause ? "Play" : "Pause"}
          </button>
        )}
        <span className="text-[11px] uppercase tracking-[0.16em] text-white/60">
          {index + 1} / {count}
        </span>
        <span className="flex gap-2">
          {quotes.map((quote, quoteIndex) => (
            <button
              key={quote.id}
              type="button"
              aria-label={`Show review from ${quote.name}`}
              aria-current={quoteIndex === index ? "true" : undefined}
              className={`h-1.5 w-6 rounded-full ${quoteIndex === index ? "bg-accent" : "bg-white/30"}`}
              onClick={() => setIndex(quoteIndex)}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
