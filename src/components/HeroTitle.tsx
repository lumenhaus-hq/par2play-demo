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

/** Hand-drawn oval — one accent mark. */
function AccentRing() {
  return (
    <svg
      viewBox="0 0 120 48"
      className="pointer-events-none absolute -inset-x-[0.18em] -inset-y-[0.12em] h-[1.35em] w-[116%]"
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
        strokeWidth="3"
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
      className="pointer-events-none absolute -bottom-[0.05em] left-0 h-[0.28em] w-full"
      aria-hidden="true"
    >
      <path
        className="hero-mark-stroke"
        d="M3 12 C 32 5, 78 16, 137 7"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}

/**
 * Spaces live INSIDE each MaskLine string — splitting “for”|“all” across
 * inline-blocks was collapsing into “forall”.
 *
 * Pulse — Syne phrase + ring on golfers + Manrope location
 * Plate — Outfit lead + Space “all” + Yellowtail golfers
 * Drive — Sora “A home for all” / “golfers.”
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

function PulseTitle() {
  return (
    <p className="hero-title hero-title--pulse hero-font-syne min-w-0 max-w-full text-[clamp(1.5rem,6cqi,2.2rem)] font-bold leading-[1.1] text-white">
      {/* nbsp joins — normal trailing spaces collapse between inline-blocks */}
      <MaskLine>{"A home for all\u00A0\u00A0"}</MaskLine>
      <span className="relative inline-block whitespace-nowrap">
        <MaskLine delay={120}>{"golfers."}</MaskLine>
        <AccentRing />
      </span>
    </p>
  );
}

function PlateTitle() {
  return (
    <p className="hero-title hero-title--plate min-w-0 max-w-full text-[clamp(1.35rem,5.4cqi,1.95rem)] leading-[1.15]">
      <MaskLine className="hero-font-outfit font-semibold text-white/72">{"A home for\u00A0\u00A0"}</MaskLine>
      <MaskLine delay={90} className="hero-font-space font-bold text-white">
        {"all\u00A0\u00A0"}
      </MaskLine>
      <span className="relative inline-block whitespace-nowrap">
        <MaskLine delay={150} className="hero-font-yellowtail text-[1.2em] font-normal leading-none text-accent">
          {"golfers."}
        </MaskLine>
        <AccentStroke />
      </span>
    </p>
  );
}

function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive min-w-0 max-w-full">
      <p className="hero-font-sora text-[clamp(1.3rem,5.2cqi,1.75rem)] font-bold leading-[1.12] text-white">
        <MaskLine>{"A home for all"}</MaskLine>
      </p>
      <p className="hero-font-sora mt-1 text-[clamp(1.75rem,8cqi,2.55rem)] font-bold leading-[0.92] text-white">
        <MaskLine delay={120}>{"golfers."}</MaskLine>
      </p>
    </div>
  );
}
