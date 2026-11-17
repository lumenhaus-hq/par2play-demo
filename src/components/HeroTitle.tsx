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

/**
 * Pulse — one accent only: white display lead + restrained script.
 * Plate — editorial monochrome: weight does the hierarchy, no script green.
 * Drive — sport stack: quiet eyebrow, bold white line, green reserved for location.
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
        <h1 className="hero-location hero-location--pulse hero-stage hero-stage--location mt-1.5 @3xl:mt-2">
          Indoor golf in Somerset, NJ
        </h1>
      );
    case "plate":
      return (
        <h1 className="hero-location hero-location--plate hero-stage hero-stage--location mt-1.5 @3xl:mt-2">
          Indoor golf in Somerset, NJ
        </h1>
      );
    case "drive":
      return (
        <h1 className="hero-location hero-location--drive hero-stage hero-stage--location mt-1.5 @3xl:mt-2">
          Indoor golf in Somerset, NJ
        </h1>
      );
    default: {
      const exhaustive: never = concept;
      return exhaustive;
    }
  }
}

/** White display + single green script accent; location stays muted. */
function PulseTitle() {
  return (
    <p className="hero-title hero-title--pulse min-w-0 max-w-full font-display text-[1.35rem] font-semibold leading-[1.15] tracking-tight text-white @3xl:text-[1.85rem]">
      <MaskLine>A home for </MaskLine>
      <MaskLine delay={140} className="hero-accent hero-accent--pulse font-accent text-[1.18em] font-normal leading-none text-accent">
        all golfers.
      </MaskLine>
    </p>
  );
}

/** Two-weight white stack — hierarchy from weight, not hue. */
function PlateTitle() {
  return (
    <p className="hero-title hero-title--plate min-w-0 max-w-full text-[1.4rem] leading-[1.18] tracking-tight @3xl:text-[1.9rem]">
      <MaskLine className="font-sans font-medium text-white/70">A home for </MaskLine>
      <MaskLine delay={120} className="font-display font-bold text-white">
        all golfers.
      </MaskLine>
    </p>
  );
}

/** Sport eyebrow + bold white line; green lives on the location only. */
function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive min-w-0 max-w-full">
      <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/55 @3xl:text-xs">
        <MaskLine>A home for</MaskLine>
      </p>
      <p className="mt-1 font-display text-[1.55rem] font-bold leading-none tracking-tight text-white @3xl:text-[2.1rem]">
        <MaskLine delay={100}>all golfers.</MaskLine>
      </p>
    </div>
  );
}
