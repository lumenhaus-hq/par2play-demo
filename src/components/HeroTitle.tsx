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
 * Larger-than-life sports lockups (BASEBALL / Hits Different energy):
 * Pulse — varsity block + overlapping Yellowtail script
 * Plate — Permanent Marker brush hit over Space Grotesk block
 * Drive — mega outlined word + small italic connector
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
  const label = "Indoor golf in Somerset, NJ";
  switch (concept) {
    case "pulse":
      return <h1 className="hero-location hero-location--pulse hero-stage hero-stage--location">{label}</h1>;
    case "plate":
      return <h1 className="hero-location hero-location--plate hero-stage hero-stage--location">{label}</h1>;
    case "drive":
      return <h1 className="hero-location hero-location--drive hero-stage hero-stage--location">{label}</h1>;
    default: {
      const exhaustive: never = concept;
      return exhaustive;
    }
  }
}

/** Varsity stack: outlined block + slanted script overlap. */
function PulseTitle() {
  return (
    <div className="hero-title hero-title--pulse hero-lockup min-w-0 max-w-full">
      <p className="hero-sticker hero-sticker--block hero-font-space text-[clamp(1.65rem,7.5cqi,2.55rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em]">
        <MaskLine>{"A home for all"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--script hero-font-yellowtail relative z-10 -mt-2 ml-1 w-fit text-[clamp(1.85rem,8.5cqi,2.85rem)] leading-none">
        <MaskLine delay={140}>{"golfers."}</MaskLine>
      </p>
    </div>
  );
}

/** Brush stamp energy — Marker script rides over a condensed block. */
function PlateTitle() {
  return (
    <div className="hero-title hero-title--plate hero-lockup min-w-0 max-w-full">
      <p className="hero-sticker hero-sticker--block hero-font-syne text-[clamp(1.55rem,7cqi,2.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.015em]">
        <MaskLine>{"A home for"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--brush hero-font-marker relative z-10 -mt-3 ml-2 w-fit rotate-[-3deg] text-[clamp(1.7rem,7.8cqi,2.6rem)] leading-none">
        <MaskLine delay={130}>{"all golfers."}</MaskLine>
      </p>
    </div>
  );
}

/** Mega block + tucked connector + script (THAT-under-BASEBALL pattern). */
function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive hero-lockup relative min-w-0 max-w-full pt-3">
      <p className="hero-sticker hero-sticker--connect hero-font-outfit absolute left-0 top-0 text-[clamp(0.7rem,2.8cqi,0.95rem)] font-bold uppercase italic tracking-[0.08em]">
        <MaskLine>{"a home"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--mega hero-font-space text-[clamp(2rem,10.5cqi,3.2rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em]">
        <MaskLine delay={80}>{"for all"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--script hero-font-yellowtail relative z-10 -mt-2 ml-3 w-fit rotate-[-3deg] text-[clamp(1.65rem,7.2cqi,2.4rem)] leading-none">
        <MaskLine delay={160}>{"golfers."}</MaskLine>
      </p>
    </div>
  );
}
