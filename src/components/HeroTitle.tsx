import { DEFAULT_HERO_TYPE, type HeroTypeId } from "../data/heroType";

export type HeroConcept = HeroTypeId;

/** Resolve initial type from ?type= (legacy ?hero= maps onto recipes). */
export function heroConcept(): HeroConcept {
  const value = new URLSearchParams(window.location.search).get("type");
  if (value === "pulse" || value === "plate" || value === "drive") return value;
  if (value === "strike") return "drive";
  const legacy = new URLSearchParams(window.location.search).get("hero");
  if (legacy === "b" || legacy === "c") return "plate";
  if (legacy === "d" || legacy === "a") return "drive";
  return DEFAULT_HERO_TYPE;
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

/** Hand underline — taste-skill type moment, draws once with hero chrome. */
function ScriptMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`hero-mark ${className}`}
      viewBox="0 0 120 14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="hero-mark-stroke"
        pathLength={1}
        d="M2 9 C 22 2, 48 13, 68 6 S 102 3, 118 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Larger-than-life sports lockups (BASEBALL / Hits Different energy):
 * Pulse — two-line varsity block + overlapping Yellowtail
 * Plate — condensed Syne stack + Permanent Marker brush hit
 * Drive — mega outlined word + tucked connector + script
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
        <h1 className="hero-location hero-location--pulse hero-stage hero-stage--location">
          <span className="hero-location__lead">Indoor golf</span>
          <span className="hero-location__sep" aria-hidden="true">
            ·
          </span>
          <span className="hero-location__place">Somerset, NJ</span>
        </h1>
      );
    case "plate":
      return (
        <h1 className="hero-location hero-location--plate hero-stage hero-stage--location">
          <span className="hero-location__lead">Indoor golf</span>
          <span className="hero-location__sep" aria-hidden="true">
            ·
          </span>
          <span className="hero-location__place">Somerset, NJ</span>
        </h1>
      );
    case "drive":
      return (
        <h1 className="hero-location hero-location--drive hero-stage hero-stage--location">
          <span className="hero-location__lead">Indoor golf</span>
          <span className="hero-location__sep" aria-hidden="true">
            ·
          </span>
          <span className="hero-location__place">Somerset, NJ</span>
        </h1>
      );
    default: {
      const exhaustive: never = concept;
      return exhaustive;
    }
  }
}

/** Varsity stack: two outlined lines + slanted script (no overlap on phones). */
function PulseTitle() {
  return (
    <div className="hero-title hero-title--pulse hero-lockup min-w-0 max-w-full">
      <p className="hero-sticker hero-sticker--block hero-font-space text-[clamp(2.05rem,10.5cqi,3.65rem)] font-bold uppercase leading-[0.86] tracking-[-0.035em]">
        <MaskLine>{"A\u00A0HOME"}</MaskLine>
        <br />
        <MaskLine delay={70}>{"FOR\u00A0ALL"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--script hero-font-yellowtail hero-sticker--ride relative z-10 ml-2 w-fit text-[clamp(2.15rem,11cqi,3.75rem)] leading-none">
        <MaskLine delay={150}>{"golfers."}</MaskLine>
        <ScriptMark className="hero-mark--pulse" />
      </p>
    </div>
  );
}

/** Brush stamp energy — Marker script under condensed block (stacked on phones). */
function PlateTitle() {
  return (
    <div className="hero-title hero-title--plate hero-lockup min-w-0 max-w-full">
      <p className="hero-sticker hero-sticker--block hero-font-syne text-[clamp(1.95rem,9.8cqi,3.4rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em]">
        <MaskLine>{"A\u00A0HOME"}</MaskLine>
        <br />
        <MaskLine delay={70}>{"FOR"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--brush hero-font-marker hero-sticker--ride relative z-10 ml-1 w-fit text-[clamp(2rem,10cqi,3.45rem)] leading-none">
        <MaskLine delay={140}>{"all golfers."}</MaskLine>
        <ScriptMark className="hero-mark--plate" />
      </p>
    </div>
  );
}

/** Mega block + tucked connector + script (THAT-under-BASEBALL pattern). */
function DriveTitle() {
  return (
    <div className="hero-title hero-title--drive hero-lockup relative min-w-0 max-w-full pt-4">
      <p className="hero-sticker hero-sticker--connect hero-font-outfit absolute left-0.5 top-0 text-[clamp(0.78rem,3.2cqi,1.05rem)] font-bold uppercase italic tracking-[0.14em]">
        <MaskLine>{"a home for"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--mega hero-font-space text-[clamp(2.55rem,13.5cqi,4.35rem)] font-bold uppercase leading-[0.8] tracking-[-0.045em]">
        <MaskLine delay={80}>{"ALL"}</MaskLine>
      </p>
      <p className="hero-sticker hero-sticker--script hero-font-yellowtail hero-sticker--ride relative z-10 ml-4 w-fit text-[clamp(1.95rem,9.5cqi,3.2rem)] leading-none">
        <MaskLine delay={160}>{"golfers."}</MaskLine>
        <ScriptMark className="hero-mark--drive" />
      </p>
    </div>
  );
}
