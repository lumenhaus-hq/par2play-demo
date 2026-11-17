import type { ReactNode } from "react";

type BenefitId = "rollover" | "swing" | "bays" | "services" | "event" | "baytime";

const BENEFITS: readonly { id: BenefitId; label: string }[] = [
  { id: "rollover", label: "Hours that roll over" },
  { id: "swing", label: "Swing evaluation" },
  { id: "bays", label: "Member pricing on bays" },
  { id: "services", label: "Discounts on lessons & services" },
  { id: "event", label: "Free 3-hour event" },
  { id: "baytime", label: "Bay time every month" },
];

const badge = "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bay text-accent";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      {children}
    </svg>
  );
}

function Glyph({ id }: { id: BenefitId }) {
  switch (id) {
    case "rollover":
      return (
        <Mark>
          <path fill="currentColor" d="M16 5a11 11 0 0 1 9.2 5H21v4h8V6h-4.1A13 13 0 0 0 3.2 14l3.7 1.2A9.2 9.2 0 0 1 16 5Z" />
          <path fill="var(--mint)" d="M16 27a11 11 0 0 1-9.2-5H11v-4H3v8h4.1A13 13 0 0 0 28.8 18l-3.7-1.2A9.2 9.2 0 0 1 16 27Z" />
        </Mark>
      );
    case "swing":
      return (
        <Mark>
          <circle cx="16" cy="16" r="9" fill="currentColor" />
          <circle cx="16" cy="16" r="4.2" fill="var(--mint)" />
          <circle cx="12.2" cy="12.4" r="1.6" fill="var(--bay)" />
        </Mark>
      );
    case "bays":
      return (
        <Mark>
          <path fill="currentColor" d="M8 4h3.2v24H8V4Z" />
          <path fill="var(--mint)" d="M11.2 5.5 24 10.2 11.2 16.2V5.5Z" />
        </Mark>
      );
    case "services":
      return (
        <Mark>
          <path fill="currentColor" d="M10 7h12v7.2a6 6 0 0 1-12 0V7Z" />
          <path fill="var(--mint)" d="M10 9H7.2a3.4 3.4 0 0 0 3.2 4.4V9Zm12 0h2.8a3.4 3.4 0 0 1-3.2 4.4V9Z" />
          <path fill="currentColor" d="M14.4 20.2h3.2V23h-3.2z" />
          <path fill="var(--mint)" d="M10 23.2h12v3.2a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1v-3.2Z" />
        </Mark>
      );
    case "event":
      return (
        <Mark>
          <path fill="currentColor" d="M7 25.5 15.2 13.2l5.2 3.6L7 25.5Z" />
          <path fill="var(--mint)" d="M15.6 12.6 19.4 15l2.2-2.4-3.6-2.6-2.4 2.6Z" />
          <circle cx="23.2" cy="8.2" r="1.7" fill="var(--mint)" />
          <circle cx="26.4" cy="13.4" r="1.5" fill="currentColor" />
          <circle cx="20.2" cy="6.2" r="1.2" fill="currentColor" />
          <path fill="var(--mint)" d="M24.2 17.2h4.2v2.2h-4.2zm1.6 3.2h3.4v2.2h-3.4z" />
        </Mark>
      );
    case "baytime":
      return (
        <Mark>
          <rect x="5" y="8" width="22" height="18" rx="3" fill="currentColor" />
          <path fill="var(--mint)" d="M5 8h22v5H5Z" />
          <rect x="10" y="5" width="2.4" height="6" rx="1" fill="var(--mint)" />
          <rect x="19.6" y="5" width="2.4" height="6" rx="1" fill="var(--mint)" />
          <circle cx="16" cy="19" r="3.2" fill="var(--bay)" />
        </Mark>
      );
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function Item({ id, label }: { id: BenefitId; label: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3 pr-10">
      <span className={badge}>
        <Glyph id={id} />
      </span>
      <span className="text-base font-semibold text-white">{label}</span>
    </li>
  );
}

export function BenefitTicker() {
  return (
    <div className="relative z-20 border-t border-white/10 bg-void">
      <ul className="benefit-static flex flex-wrap gap-x-8 gap-y-3 px-4 py-3">
        {BENEFITS.map((item) => (
          <Item key={item.id} id={item.id} label={item.label} />
        ))}
      </ul>
      <div className="benefit-marquee overflow-hidden py-3">
        <ul className="sr-only">
          {BENEFITS.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
        <ul aria-hidden="true" className="benefit-track flex w-max items-center">
          {BENEFITS.map((item) => (
            <Item key={item.id} id={item.id} label={item.label} />
          ))}
          {BENEFITS.map((item) => (
            <Item key={`${item.id}-loop`} id={item.id} label={item.label} />
          ))}
        </ul>
      </div>
    </div>
  );
}
