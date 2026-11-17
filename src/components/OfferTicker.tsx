import type { ReactNode } from "react";

export type OfferIcon =
  | "ball"
  | "club"
  | "calendar"
  | "flag"
  | "trophy"
  | "camera"
  | "party"
  | "people"
  | "clock"
  | "tag";

export type OfferBenefit = { id: string; label: string; icon: OfferIcon };

const badge = "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bay text-accent";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      {children}
    </svg>
  );
}

function Glyph({ icon }: { icon: OfferIcon }) {
  switch (icon) {
    case "ball":
      return (
        <Mark>
          <circle cx="16" cy="16" r="9" fill="currentColor" />
          <circle cx="16" cy="16" r="4.2" fill="var(--mint)" />
          <circle cx="12.2" cy="12.4" r="1.6" fill="var(--bay)" />
        </Mark>
      );
    case "club":
      return (
        <Mark>
          <path fill="currentColor" d="M7.2 4.5h3.6l1.1 9.2H8.3L7.2 4.5Z" />
          <path fill="var(--mint)" d="M10.4 13.4 17.8 22l2.4-2.1-7.4-8.6-2.4 2.1Z" />
          <path fill="currentColor" d="M16.6 20.6c2.6-1 6.2 0 7.4 1.8 1.1 1.7.1 3.4-2.4 4-3.2.8-6.8-.4-7.8-2-.9-1.4.2-3 2.8-3.8Z" />
        </Mark>
      );
    case "calendar":
      return (
        <Mark>
          <rect x="5" y="8" width="22" height="18" rx="3" fill="currentColor" />
          <path fill="var(--mint)" d="M5 8h22v5H5Z" />
          <rect x="10" y="5" width="2.4" height="6" rx="1" fill="var(--mint)" />
          <rect x="19.6" y="5" width="2.4" height="6" rx="1" fill="var(--mint)" />
        </Mark>
      );
    case "flag":
      return (
        <Mark>
          <path fill="currentColor" d="M8 4h3.2v24H8V4Z" />
          <path fill="var(--mint)" d="M11.2 5.5 24 10.2 11.2 16.2V5.5Z" />
        </Mark>
      );
    case "trophy":
      return (
        <Mark>
          <path fill="currentColor" d="M10 7h12v7.2a6 6 0 0 1-12 0V7Z" />
          <path fill="var(--mint)" d="M10 9H7.2a3.4 3.4 0 0 0 3.2 4.4V9Zm12 0h2.8a3.4 3.4 0 0 1-3.2 4.4V9Z" />
          <path fill="var(--mint)" d="M10 23.2h12v3.2a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1v-3.2Z" />
        </Mark>
      );
    case "camera":
      return (
        <Mark>
          <rect x="4" y="10" width="24" height="15" rx="3" fill="currentColor" />
          <path fill="var(--mint)" d="M11 10 13.2 6h5.6L21 10H11Z" />
          <circle cx="16" cy="17.5" r="4" fill="var(--mint)" />
        </Mark>
      );
    case "party":
      return (
        <Mark>
          <path fill="currentColor" d="M7 25.5 15.2 13.2l5.2 3.6L7 25.5Z" />
          <path fill="var(--mint)" d="M15.6 12.6 19.4 15l2.2-2.4-3.6-2.6-2.4 2.6Z" />
          <circle cx="23.2" cy="8.2" r="1.7" fill="var(--mint)" />
          <circle cx="26.4" cy="13.4" r="1.5" fill="currentColor" />
        </Mark>
      );
    case "people":
      return (
        <Mark>
          <circle cx="12" cy="11" r="3.2" fill="currentColor" />
          <circle cx="20.5" cy="12" r="2.6" fill="var(--mint)" />
          <path fill="currentColor" d="M6 23.5c.6-3.6 3.2-5.5 6-5.5s5.4 1.9 6 5.5H6Z" />
          <path fill="var(--mint)" d="M16.5 23.5c.4-2.8 2.2-4.4 4.2-4.4 2.1 0 3.8 1.6 4.2 4.4h-8.4Z" />
        </Mark>
      );
    case "clock":
      return (
        <Mark>
          <circle cx="16" cy="16" r="9" fill="currentColor" />
          <path fill="var(--mint)" d="M15 9.5h2.2V16l4.2 2.4-1.1 1.9-5.3-3V9.5Z" />
        </Mark>
      );
    case "tag":
      return (
        <Mark>
          <path fill="currentColor" d="M6 8h10l10 10-8 8L6 16V8Z" />
          <circle cx="12" cy="14" r="2" fill="var(--mint)" />
        </Mark>
      );
    default: {
      const exhaustive: never = icon;
      return exhaustive;
    }
  }
}

function Item({ icon, label }: { icon: OfferIcon; label: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3 pr-10">
      <span className={badge}>
        <Glyph icon={icon} />
      </span>
      <span className="font-sans text-lg font-semibold leading-none tracking-tight text-white">{label}</span>
    </li>
  );
}

export function OfferTicker({ items }: { items: readonly OfferBenefit[] }) {
  return (
    <div className="relative z-20 border-t border-white/10 bg-void">
      <ul className="benefit-static flex flex-wrap gap-x-8 gap-y-3 px-4 py-3">
        {items.map((item) => (
          <Item key={item.id} icon={item.icon} label={item.label} />
        ))}
      </ul>
      <div className="benefit-marquee overflow-hidden py-3">
        <ul className="sr-only">
          {items.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
        <ul aria-hidden="true" className="benefit-track flex w-max items-center">
          {items.map((item) => (
            <Item key={item.id} icon={item.icon} label={item.label} />
          ))}
          {items.map((item) => (
            <Item key={`${item.id}-loop`} icon={item.icon} label={item.label} />
          ))}
        </ul>
      </div>
    </div>
  );
}
