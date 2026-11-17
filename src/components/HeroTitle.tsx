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

/** Hand-drawn oval — one accent mark, not a filled script word. */
function AccentRing() {
  return (
    <svg
      viewBox="0 0 120 48"
      className="pointer-events-none absolute -inset-x-[0.2em] -inset-y-[0.14em] h-[1.4em] w-[118%]"
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

/** Hand-drawn underline mark. */
function AccentStroke() {
  return (
    <svg
      viewBox="0 0 140 18"
      className="pointer-events-none absolute -bottom-[0.06em] left-0 h-[0.3em] w-full"
      aria-hidden="true"
    >
      <path
        className="hero-mark-stroke"
        d="M3 12 C 32 5, 78 16, 137 7"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}

/**
 * Distinct font pairings (real 700 files — no fake-bold Chakra):
 * Pulse — Syne 700 + Manrope caption (geometric editorial)
 * Plate — Outfit lead + Space Grotesk + Yellowtail key word
 * Drive — Barlow eyebrow + Sora 700 mega line
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

/** Syne black stack + Manrope caption. Accent = drawn ring only. */
function PulseTitle() {
  return (
    <p className="hero-title hero-title--pulse hero-font-syne min-w-0 max-w-full text-[clamp(1.6rem,6.4cqi,2.4rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white">
      <MaskLine>A home for </MaskLine>
      <span className="relative inline-block whitespace-nowrap">
        <MaskLine delay={120}>all golfers.</MaskLine>
        <AccentRing />
      </span>
    </p>
  );
}

/** Outfit lead + Space Grotesk hit + Yellowtail accent word. */
function PlateTitle() {
  return (
    <p className="hero-title hero-title--plate min-w-0 max-w-full text-[clamp(1.45rem,5.8cqi,2.15rem)] leading-[1.02] tracking-[-0.02em]">
      <MaskLine className="hero-font-outfit font-semibold text-white/65">A home for </MaskLine>
      <span className="relative inline-block whitespace-nowrap">
        <MaskLine delay={90} className="hero-font-space font-bold text-white">
          {"all "}
        </MaskLine>
        <MaskLine delay={160} className="hero-font-yellowtail text-[1.35em] font-normal leading-none text-accent">
          {"golfers."}
        </MaskLine>
        <AccentStroke />
      </span>
    </p>
  );
}

/** Barlow micro eyebrow + Sora oversized line. */
function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive min-w-0 max-w-full">
      <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.3em] text-white/48 @3xl:text-[0.68rem]">
        <MaskLine>A home for</MaskLine>
      </p>
      <p className="hero-font-sora mt-1 max-w-full text-[clamp(1.9rem,9cqi,3rem)] font-bold leading-[0.86] tracking-[-0.05em] text-white">
        <MaskLine delay={80}>all golfers.</MaskLine>
      </p>
    </div>
  );
}
