import { useState } from "react";
import { trackAnchor } from "../analytics/track";
import { BookLink, PhoneLink, buttonFocus } from "./Cta";
import { BookingCheckout, appendCheckoutParams } from "./BookingCheckout";
import { JointToggle } from "./JointToggle";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

type PracticeMode = "unlimited" | "pack";

const PRACTICE_OPTIONS = [
  { value: "unlimited", label: "Unlimited Practice" },
  { value: "pack", label: "10 Sessions" },
] as const;

export function MembershipCalculator() {
  const [mode, setMode] = useState<PracticeMode>("unlimited");
  const unlimited = mode === "unlimited";
  const figure = unlimited ? `${money(PRICES.unlimitedMonthly)}/mo` : money(PRICES.tenPack);
  const heading = unlimited ? "Unlimited Practice" : "10 Sessions";
  const live = unlimited
    ? `Unlimited Practice ${money(PRICES.unlimitedMonthly)} a month. Up to 1 hour a day.`
    : `10 Sessions ${money(PRICES.tenPack)}. Ten 60-minute bay sessions.`;
  const line = unlimited ? "Practice Unlimited (monthly)" : "10 × 60-minute bay sessions";
  const totalLabel = unlimited ? `${money(PRICES.unlimitedMonthly)}/mo` : money(PRICES.tenPack);
  const primaryOffer = unlimited ? ("practice-unlimited" as const) : ("ten-pack" as const);
  const primaryLabel = unlimited ? "Become a Member" : "Buy 10 Sessions";
  const note = unlimited
    ? "Members keep a bay hour every day for less than a few 10-packs."
    : `${money(PRICES.tenPack / 10)} a session in the pack.`;
  const orderRef = unlimited ? "ord_p2p_practice_unlimited" : "ord_p2p_10_practice_pack";
  const checkoutBase = unlimited ? OCLOCK.practiceUnlimited : OCLOCK.tenPracticePack;
  const offerParam = unlimited ? "practice_unlimited" : "10_practice_pack";

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 @3xl:gap-8">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="membership-pricing px-5 py-5 @3xl:px-7 @3xl:py-7">
        <span className="membership-pricing__orb membership-pricing__orb--a" aria-hidden="true" />
        <span className="membership-pricing__orb membership-pricing__orb--b" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--a" src={`${iconBase}/flag.png`} alt="" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--b" src={`${iconBase}/ball.png`} alt="" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--c" src={`${iconBase}/crossed-clubs.png`} alt="" aria-hidden="true" />

        <div className="membership-pricing__body">
          <h1 id="why-membership-heading" className="offer-title text-2xl tracking-tight text-white @3xl:text-3xl">
            Become a Member
          </h1>
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-mint">{heading}</p>
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            <p className="sr-only">{live}</p>
            <p className="font-display text-[clamp(2.25rem,10cqi,3.75rem)] font-semibold leading-none tracking-tight text-white">
              {figure}
            </p>
          </div>

          <div className="mt-6">
            <JointToggle value={mode} options={PRACTICE_OPTIONS} onChange={setMode} label="Practice offer" tone="dark" />
          </div>

          <p className="mt-4 text-sm font-semibold leading-snug text-white/75">{note}</p>

          <div className="mt-6 flex flex-col gap-3 @3xl:flex-row">
            <BookLink className="w-full" offer={primaryOffer}>
              {primaryLabel}
            </BookLink>
            <BookLink className="w-full" offer="bay" tone="inverted">
              Try it out
            </BookLink>
          </div>

          <div className="mt-8 border-t border-white/15 pt-8">
            <BookingCheckout
              summaryTitle={heading}
              rows={[
                { label: "Offer", value: line },
                { label: "Access", value: unlimited ? "Up to 1 hour a day" : "10 sessions" },
                { label: "Billing", value: unlimited ? "Monthly" : "One-time" },
                { label: unlimited ? "Membership" : "Pack", value: totalLabel },
              ]}
              totalLabel={totalLabel}
              orderRef={orderRef}
              analyticsTier={unlimited ? "gold" : "silver"}
              checkoutHref={(fields) => appendCheckoutParams(checkoutBase, fields, offerParam)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 text-center shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6" aria-labelledby="join-heading">
        <h2 id="join-heading" className="offer-title text-3xl tracking-tight text-ink">
          compare plans
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-ink/70">
          Silver, Gold, and Platinum live on GolfClock. Pick the bay hours that fit your week.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={OCLOCK.memberships}
            target="_blank"
            rel="noopener noreferrer"
            data-membership="true"
            onClick={(event) => trackAnchor(event.currentTarget)}
            className={`cta-shell cta-line cta-lift inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold ${buttonFocus}`}
          >
            <span className="cta-fill" aria-hidden="true" />
            <span className="cta-label">
              <span className="cta-label-text">compare plans</span>
            </span>
          </a>
        </div>
        <p className="mt-6 text-base leading-snug text-ink/80">
          {NAP.street}
          <br />
          {NAP.city}, {NAP.region} {NAP.postalCode}
          <br />
          <PhoneLink className="aa-focus underline decoration-2 underline-offset-4">{NAP.phoneDisplay}</PhoneLink>
        </p>
      </section>
    </div>
  );
}
