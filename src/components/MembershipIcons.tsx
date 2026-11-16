import type { ReactNode } from "react";

export type MembershipStepId = "availability" | "progress" | "day";

/**
 * Badge is #10281A. Both greens clear 3:1 against it
 * (#14D45E ≈ 7.9:1, #7DFFB0 ≈ 12.5:1). Dark cutouts sit on the brand green.
 */
const badge =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-bay text-accent";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      {children}
    </svg>
  );
}

function Glyph({ id }: { id: MembershipStepId }) {
  switch (id) {
    case "availability":
      return (
        <Mark>
          <rect x="4.5" y="8" width="23" height="19.5" rx="3" fill="currentColor" />
          <path fill="var(--mint)" d="M7.5 8h17a3 3 0 0 1 3 3v2.2h-23V11a3 3 0 0 1 3-3Z" />
          <rect x="9.2" y="4.2" width="2.4" height="6.2" rx="1.1" fill="var(--mint)" />
          <rect x="20.4" y="4.2" width="2.4" height="6.2" rx="1.1" fill="var(--mint)" />
          <rect x="8.4" y="16.6" width="15.2" height="3.1" rx="1" fill="var(--bay)" />
          <rect x="8.4" y="21.6" width="9.4" height="2.6" rx="1" fill="var(--mint)" />
        </Mark>
      );
    case "progress":
      return (
        <Mark>
          <rect x="4" y="18" width="5" height="8" rx="1.4" fill="var(--mint)" />
          <rect x="11.2" y="13.2" width="5" height="12.8" rx="1.4" fill="var(--mint)" />
          <rect x="18.4" y="8.2" width="5" height="17.8" rx="1.4" fill="currentColor" />
          <circle cx="26.2" cy="7.2" r="2.5" fill="currentColor" />
          <path
            d="M6.2 16.6c4.2-4.6 9.2-6.4 16.2-5.2"
            fill="none"
            stroke="var(--mint)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Mark>
      );
    case "day":
      return (
        <Mark>
          <circle cx="16" cy="18.6" r="8.1" fill="currentColor" />
          <circle cx="16" cy="18.6" r="1.45" fill="var(--bay)" />
          <path d="M16 18.6V13.2" stroke="var(--bay)" strokeWidth="2.15" strokeLinecap="round" />
          <path d="M16 18.8 20.6 21.2" stroke="var(--bay)" strokeWidth="2.15" strokeLinecap="round" />
          <path fill="var(--mint)" d="M15.15 2.6h1.7V6.8h-1.7z" />
          <path fill="var(--mint)" d="M16.85 2.6h5.6L20.6 4.8l1.85 2.2h-5.6z" />
        </Mark>
      );
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function MembershipStepIcon({ id }: { id: MembershipStepId }) {
  return (
    <span className={badge}>
      <Glyph id={id} />
    </span>
  );
}
