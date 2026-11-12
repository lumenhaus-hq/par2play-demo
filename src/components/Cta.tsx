import type { ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { bookingHref, membershipHref, NAP, type BookingOffer } from "../data/business";

/** Near-black inner ring (clears green and white) plus a white outer ring (clears dark grounds). */
export const buttonFocus = "aa-focus";

/** White inner ring for a near-black fill sitting on a light page. */
export const buttonFocusOnInk = "aa-focus-ink";

const shell = `cta-shell inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-center text-base font-semibold`;

const tones = {
  brand: `${shell} cta-brand ${buttonFocus}`,
  line: `${shell} cta-line ${buttonFocus}`,
  dark: `${shell} cta-line cta-line-muted ${buttonFocus}`,
  inverted: `${shell} cta-inverted ${buttonFocus}`,
  solid: `${shell} cta-solid ${buttonFocusOnInk}`,
  text: `inline-flex min-h-11 items-center text-base font-semibold text-[#0A0F0B] underline decoration-2 underline-offset-4 visited:text-[#0A0F0B] ${buttonFocus}`,
} as const;

type Tone = keyof typeof tones;

function externalProps(href: string) {
  if (!href.startsWith("http")) return {};
  return { target: "_blank", rel: "noopener noreferrer" } as const;
}

function CtaLabel({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  return (
    <span className="cta-label">
      <span className="cta-label-text">{children}</span>
    </span>
  );
}

/** Equal-width pair. Stacked full width in a narrow container, side by side once the container is wide. */
export function CtaPair({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container w-full max-w-full ${className}`}>
      <div className="grid w-full grid-cols-1 gap-3 @3xl:w-fit @3xl:max-w-full @3xl:grid-cols-2">{children}</div>
    </div>
  );
}

export function BookLink({
  offer,
  children,
  tone = "brand",
  className = "",
}: {
  offer: BookingOffer;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const href = bookingHref(offer);
  return (
    <a
      href={href}
      className={`${tones[tone]} ${className}`}
      {...externalProps(href)}
      data-offer={offer}
      onClick={(event) => trackAnchor(event.currentTarget)}
    >
      <span className="cta-fill" aria-hidden="true" />
      <CtaLabel>{children}</CtaLabel>
    </a>
  );
}

export function MembershipLink({
  children,
  tone = "brand",
  className = "",
  href,
  tier,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Overrides the on-site membership page. The membership page passes GolfClock. */
  href?: string;
  tier?: string;
}) {
  const target = href ?? membershipHref();
  return (
    <a
      href={target}
      className={`${tones[tone]} ${className}`}
      {...externalProps(target)}
      data-membership="true"
      onClick={(event) => trackAnchor(event.currentTarget, tier ? { membership_tier: tier as "silver" | "gold" | "platinum" } : {})}
    >
      <span className="cta-fill" aria-hidden="true" />
      <CtaLabel>{children}</CtaLabel>
    </a>
  );
}

export function PhoneLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a className={className} href={NAP.phoneTel} onClick={(event) => trackAnchor(event.currentTarget)}>
      {children}
    </a>
  );
}

/**
 * Home hero. Opens the on-site membership page so the visit sells Silver, Gold, and Platinum.
 */
export function HeroMembershipAction({ className = "" }: { className?: string }) {
  return (
    <MembershipLink tone="inverted" className={className}>
      Become a Member
    </MembershipLink>
  );
}

/** Pill CTA for routes that are not BookLink / MembershipLink. */
export function CtaAnchor({
  href,
  children,
  tone = "brand",
  className = "",
  offer,
  external = false,
}: {
  href: string;
  children: ReactNode;
  tone?: Exclude<Tone, "text">;
  className?: string;
  offer?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${tones[tone]} ${className}`}
      {...(external ? externalProps(href) : {})}
      data-offer={offer}
      onClick={(event) => trackAnchor(event.currentTarget)}
    >
      <span className="cta-fill" aria-hidden="true" />
      <CtaLabel>{children}</CtaLabel>
    </a>
  );
}
