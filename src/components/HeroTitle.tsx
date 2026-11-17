import type { HeroTypeId } from "../data/heroType";

export type HeroConcept = HeroTypeId;

/** Resolve initial type from ?type= (legacy ?hero= maps onto recipes). */
export function heroConcept(): HeroConcept {
  const value = new URLSearchParams(window.location.search).get("type");
  if (value === "pulse" || value === "plate" || value === "drive") return value;
  if (value === "strike") return "drive";
  const legacy = new URLSearchParams(window.location.search).get("hero");
  if (legacy === "b" || legacy === "c") return "plate";
  if (legacy === "d" || legacy === "a") return "drive";
  return "pulse";
}

function MaskLine({ children, delay = 0, className = "" }: { children: string; delay?: number; className?: string }) {
  return (
    <span className={`hero-mask inline-block overflow-hidden align-bottom ${className}`}>
      <span className="word-in inline-block" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

/** Hand-drawn oval — benchmark “research” mark, one accent only. */
function AccentRing() {
  return (
    <svg
      viewBox="0 0 120 48"
      className="pointer-events-none absolute -inset-x-[0.18em] -inset-y-[0.12em] h-[1.35em] w-[115%]"
      aria-hidden="true"
    >
      <ellipse
        className="hero-mark-stroke"
        cx="60"
        cy="24"
        rx="54"
        ry="18"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}

/** Hand-drawn underline — benchmark “purpose” mark. */
function AccentStroke() {
  return (
    <svg
      viewBox="0 0 140 18"
      className="pointer-events-none absolute -bottom-[0.08em] left-0 h-[0.28em] w-full"
      aria-hidden="true"
    >
      <path
        className="hero-mark-stroke"
        d="M4 11 C 28 6, 72 15, 136 8"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.4"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}

/**
 * Benchmark-led recipes (8/10 targets):
 * Pulse — tight black stack + one drawn accent mark (research/purpose pattern)
 * Plate — same-family weight hierarchy, no script, quiet location
 * Drive — micro eyebrow + oversized bold line (Sweet Tape scale)
 */
export function HeroTitle({ concept }: { concept: HeroConcept }) {
  switch (concept) {
    case "pulse":
      return <PulseTitle />;
    case "plate":
      return <PlateTitle />;
    case "drive":
      return <DriveTitle />;
    default: {
      const exhaustive: never = concept;
      return exhaustive;
    }
  }
}

export function HeroLocation({ concept }: { concept: HeroConcept }) {
  switch (concept) {
    case "pulse":
      return (
        <h1 className="hero-location hero-location--pulse hero-stage hero-stage--location mt-2 @3xl:mt-2.5">
          Indoor golf in Somerset, NJ
        </h1>
      );
    case "plate":
      return (
        <h1 className="hero-location hero-location--plate hero-stage hero-stage--location mt-2 @3xl:mt-2.5">
          Indoor golf in Somerset, NJ
        </h1>
      );
    case "drive":
      return (
        <h1 className="hero-location hero-location--drive hero-stage hero-stage--location mt-2 @3xl:mt-2.5">
          Indoor golf in Somerset, NJ
        </h1>
      );
    default: {
      const exhaustive: never = concept;
      return exhaustive;
    }
  }
}

/** Tight bold stack + one accent ring on the key word. */
function PulseTitle() {
  return (
    <p className="hero-title hero-title--pulse min-w-0 max-w-full font-display text-[clamp(1.55rem,6.2cqi,2.35rem)] font-bold leading-[0.95] tracking-[-0.035em] text-white">
      <MaskLine>A home for </MaskLine>
      <span className="relative inline-block whitespace-nowrap">
        <MaskLine delay={120}>all golfers.</MaskLine>
        <AccentRing />
      </span>
    </p>
  );
}

/** Same-family weight climb — medium lead, black finish, drawn underline. */
function PlateTitle() {
  return (
    <p className="hero-title hero-title--plate min-w-0 max-w-full font-display text-[clamp(1.5rem,6cqi,2.25rem)] leading-[0.96] tracking-[-0.03em]">
      <MaskLine className="font-semibold text-white/72">A home for </MaskLine>
      <span className="relative inline-block whitespace-nowrap font-bold text-white">
        <MaskLine delay={100}>all golfers.</MaskLine>
        <AccentStroke />
      </span>
    </p>
  );
}

/** Micro eyebrow + oversized impact line — Sweet Tape scale contrast. */
function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive min-w-0 max-w-full">
      <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/50 @3xl:text-[0.7rem]">
        <MaskLine>A home for</MaskLine>
      </p>
      <p className="mt-1.5 max-w-full font-display text-[clamp(1.85rem,8.5cqi,2.85rem)] font-bold leading-[0.88] tracking-[-0.045em] text-white">
        <MaskLine delay={80}>all golfers.</MaskLine>
      </p>
    </div>
  );
}
