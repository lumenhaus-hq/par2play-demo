import { trackAnchor } from "../analytics/track";
import { BookLink, PhoneLink, buttonFocus } from "./Cta";
import { BookingCheckout, appendCheckoutParams } from "./BookingCheckout";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

const BENEFITS = [
  { file: "flag.png", title: "Bay hour daily", line: "Keep a practice hour every day." },
  { file: "club-strike.png", title: "Shot data", line: "Track every swing in the bay." },
  { file: "bag.png", title: "Clubs on hand", line: "Premium sticks waiting when you arrive." },
  { file: "cart.png", title: "Priority times", line: "Hours that bend around your week." },
] as const;

export function MembershipCalculator() {
  const figure = `${money(PRICES.unlimitedMonthly)}/mo`;
  const heading = "Unlimited Practice";
  const live = `Unlimited Practice ${money(PRICES.unlimitedMonthly)} a month. Up to 1 hour a day.`;
  const line = "Practice Unlimited (monthly)";
  const totalLabel = figure;
  const note = "Members keep a bay hour every day for less than a few 10-packs.";

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 @3xl:gap-8">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="membership-pricing px-5 py-5 @3xl:px-7 @3xl:py-7">
        <span className="membership-pricing__orb membership-pricing__orb--a" aria-hidden="true" />
        <span className="membership-pricing__orb membership-pricing__orb--b" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--a" src={`${iconBase}/flag.png`} alt="" aria-hidden="true" width={64} height={50} />
        <img className="membership-pricing__glyph membership-pricing__glyph--b" src={`${iconBase}/ball.png`} alt="" aria-hidden="true" width={64} height={50} />
        <img className="membership-pricing__glyph membership-pricing__glyph--c" src={`${iconBase}/crossed-clubs.png`} alt="" aria-hidden="true" width={64} height={50} />

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
          <p className="mt-4 text-base font-semibold leading-snug text-white/90">{note}</p>

          <ul className="member-benefits" aria-label="Member benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="member-benefits__tile">
                <img src={`${iconBase}/${benefit.file}`} alt="" aria-hidden="true" width={64} height={50} />
                <p className="member-benefits__title">{benefit.title}</p>
                <p className="member-benefits__line">{benefit.line}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 @3xl:flex-row">
            <BookLink className="w-full" offer="practice-unlimited">
              Become a Member
            </BookLink>
            <BookLink className="w-full" offer="bay" tone="inverted">
              Experience a free Member Day
            </BookLink>
          </div>

          <div className="mt-8 border-t border-white/15 pt-8">
            <BookingCheckout
              summaryTitle={heading}
              rows={[
                { label: "Offer", value: line },
                { label: "Access", value: "Up to 1 hour a day" },
                { label: "Billing", value: "Monthly" },
                { label: "Membership", value: totalLabel },
              ]}
              totalLabel={totalLabel}
              orderRef="ord_p2p_practice_unlimited"
              checkoutHref={(fields) => appendCheckoutParams(OCLOCK.practiceUnlimited, fields, "practice_unlimited")}
            />
          </div>
        </div>
      </section>

      <section
        className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 text-center shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6"
        aria-labelledby="join-heading"
      >
        <h2 id="join-heading" className="offer-title text-3xl tracking-tight text-ink">
          compare plans
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-lg text-ink/80">Other bay offers are on GolfClock.</p>
        <div className="mt-6 flex justify-center">
          <a
            href={OCLOCK.memberships}
            target="_blank"
            rel="noopener noreferrer"
            data-membership="true"
            onClick={(event) => trackAnchor(event.currentTarget)}
            className={`cta-shell cta-line cta-lift inline-flex min-h-12 items-center justify-center rounded-full px-8 text-lg font-semibold ${buttonFocus}`}
          >
            <span className="cta-fill" aria-hidden="true" />
            <span className="cta-label">
              <span className="cta-label-text">compare plans</span>
            </span>
          </a>
        </div>
        <p className="mt-6 text-lg leading-snug text-ink/85">
          {NAP.street}
          <br />
          {`${NAP.city}, ${NAP.region} ${NAP.postalCode}`}
          <br />
          <PhoneLink className="aa-focus underline decoration-2 underline-offset-4">{NAP.phoneDisplay}</PhoneLink>
        </p>
      </section>
    </div>
  );
}
