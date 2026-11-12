export type HeroConcept = "current" | "a" | "b" | "c" | "d";

export function heroConcept(): HeroConcept {
  const value = new URLSearchParams(window.location.search).get("hero");
  if (value === "a" || value === "b" || value === "c" || value === "d") return value;
  return "current";
}

const green = "text-[#14D45E]";

function Swoosh() {
  return (
    <svg viewBox="0 0 140 18" className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full" aria-hidden="true">
      <path className="draw-stroke" pathLength="1" d="M2 12 C 28 4, 70 16, 138 6" fill="none" stroke="#14D45E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Marker() {
  return (
    <svg viewBox="0 0 160 36" className="pointer-events-none absolute -inset-x-1 bottom-0 h-[0.7em] w-[110%]" aria-hidden="true">
      <path d="M4 20 C 36 8, 78 28, 120 14 C 136 10, 148 16, 156 18" fill="none" stroke="#7DFFB0" strokeWidth="16" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function Scribble() {
  return (
    <svg viewBox="0 0 120 64" className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[140%] w-[130%]" aria-hidden="true">
      <path
        className="draw-stroke"
        pathLength="1"
        d="M18 34 C 14 14, 48 8, 78 16 C 108 24, 112 48, 78 54 C 40 62, 8 48, 20 28"
        fill="none"
        stroke="#14D45E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
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

/** Default title. Concepts A–D are review options and do not replace this. */
export function HeroTitle({ concept }: { concept: HeroConcept }) {
  if (concept === "a") return <ConceptA />;
  if (concept === "b") return <ConceptB />;
  if (concept === "c") return <ConceptC />;
  if (concept === "d") return <ConceptD />;
  return (
    <p className="min-w-0 max-w-full font-display text-[1.35rem] font-semibold leading-[1.05] tracking-tight text-white @3xl:text-[2rem]">
      <MaskLine>A home for </MaskLine>
      <MaskLine delay={90} className="hero-poppy font-accent text-[1.45em] leading-none">
        all golfers.
      </MaskLine>
    </p>
  );
}

function ConceptA() {
  return (
    <p className="min-w-0 max-w-full font-sans text-lg font-semibold leading-tight text-white @3xl:text-2xl">
      {"A home for "}
      <span className={`relative inline-block font-caveat text-[1.85em] leading-none ${green}`}>
        all golfers.
        <Swoosh />
      </span>
    </p>
  );
}

function ConceptB() {
  return (
    <div className="min-w-0 max-w-full">
      <p className="font-sans text-sm font-semibold text-white @3xl:text-base">A home for</p>
      <p className={`min-w-0 font-caveat text-[clamp(2.5rem,13cqi,4.5rem)] leading-none ${green}`}>all golfers.</p>
    </div>
  );
}

function ConceptC() {
  return (
    <p className="min-w-0 max-w-full font-sans text-xl font-bold leading-tight text-white @3xl:text-3xl">
      {"A home for "}
      <span className="relative inline-block">
        <Marker />
        <span className="relative">all golfers.</span>
      </span>
    </p>
  );
}

function ConceptD() {
  return (
    <p className="min-w-0 max-w-full font-sans text-[clamp(1.15rem,5.4cqi,1.65rem)] font-bold uppercase leading-tight tracking-tight text-white">
      {"A home for "}
      <span className={`relative inline-block font-caveat text-[1.45em] leading-none normal-case ${green}`}>
        all golfers.
        <Scribble />
      </span>
    </p>
  );
}
