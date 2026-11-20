import type { ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { bookingHref, membershipHref, NAP, type BookingOffer } from "../data/business";

/** Near-black inner ring (clears green and white) plus a white outer ring (clears dark grounds). */
export const buttonFocus = "aa-focus";

/** White inner ring for a near-black fill sitting on a light page. */
export const buttonFocusOnInk = "aa-focus-ink";

const shell = `cta-shell inline-flex min-h-12 min-w-12 items-center justify-center rounded-full px-6 text-center text-lg font-extrabold tracking-tight`;

const tones = {
  brand: `${shell} cta-brand ${buttonFocus}`,
  line: `${shell} cta-line ${buttonFocus}`,
  dark: `${shell} cta-line cta-line-muted ${buttonFocus}`,
  inverted: `${shell} cta-inverted ${buttonFocus}`,
  solid: `${shell} cta-solid ${buttonFocusOnInk}`,
  text: `inline-flex min-h-11 items-center text-base font-semibold text-ink underline decoration-2 underline-offset-4 visited:text-ink ${buttonFocus}`,
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

function Stamped({ children }: { children: ReactNode }) {
  return <span className="cta-stamp">{children}</span>;
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
    <Stamped>
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
    </Stamped>
  );
}

export function MembershipLink({
  children,
  tone = "brand",
  className = "",
  href,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Overrides the on-site membership page. The membership page passes GolfClock. */
  href?: string;
}) {
  const target = href ?? membershipHref();
  return (
    <Stamped>
      <a
        href={target}
        className={`${tones[tone]} ${className}`}
        {...externalProps(target)}
        data-membership="true"
        onClick={(event) => trackAnchor(event.currentTarget)}
      >
        <span className="cta-fill" aria-hidden="true" />
        <CtaLabel>{children}</CtaLabel>
      </a>
    </Stamped>
  );
}

export function PhoneLink({
  className,
  children,
  offer,
}: {
  className: string;
  children: ReactNode;
  offer?: BookingOffer;
}) {
  return (
    <a
      className={className}
      href={NAP.phoneTel}
      data-offer={offer}
      onClick={(event) => trackAnchor(event.currentTarget)}
    >
      {children}
    </a>
  );
}

/** Home hero — membership primary plus the studio phone, equal width. */
export function HeroMembershipAction({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-cta-pair ${className}`}>
      <div className="hero-cta-pair__grid">
        <MembershipLink className="hero-cta-pair__button cta-sheen">Become a Member</MembershipLink>
        <Stamped>
          <PhoneLink className={`${tones.inverted} hero-cta-pair__button`} offer="bay">
            <span className="cta-fill" aria-hidden="true" />
            <span className="cta-label">
              <span className="cta-label-text hero-call-label">
                Call us at <span className="hero-call-number">{NAP.phoneDisplay}</span>
              </span>
            </span>
          </PhoneLink>
        </Stamped>
      </div>
    </div>
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
    <Stamped>
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
    </Stamped>
  );
}
