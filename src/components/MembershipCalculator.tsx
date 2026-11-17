import { useId, useState, type FormEvent, type ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { BookLink, PhoneLink, buttonFocus } from "./Cta";
import { JointToggle } from "./JointToggle";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;
const checkoutCard =
  "rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6";

type PracticeMode = "unlimited" | "pack";

type CheckoutFields = {
  name: string;
  email: string;
  phone: string;
};

const emptyCheckout: CheckoutFields = { name: "", email: "", phone: "" };

const PRACTICE_OPTIONS = [
  { value: "unlimited", label: "Unlimited Practice" },
  { value: "pack", label: "10 Sessions" },
] as const;

function checkoutHref(mode: PracticeMode, fields: CheckoutFields): string {
  const base = mode === "unlimited" ? OCLOCK.practiceUnlimited : OCLOCK.tenPracticePack;
  const params = new URLSearchParams();
  if (fields.name.trim()) params.set("name", fields.name.trim());
  if (fields.email.trim()) params.set("email", fields.email.trim());
  if (fields.phone.trim()) params.set("phone", fields.phone.trim());
  params.set("offer", mode === "unlimited" ? "practice_unlimited" : "10_practice_pack");
  const query = params.toString();
  return query ? `${base}${base.includes("?") ? "&" : "?"}${query}` : base;
}

function orderRef(mode: PracticeMode): string {
  return mode === "unlimited" ? "ord_p2p_practice_unlimited" : "ord_p2p_10_practice_pack";
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 text-base">
      <span className="text-[#4B5563]">{label}</span>
      <span className="font-semibold text-ink tabular-nums">{value}</span>
    </div>
  );
}

function PaymentMark({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex h-10 min-w-[3.25rem] items-center justify-center rounded-md border border-[#D1D5DB] bg-[#F3F4F6] px-2 text-[#9CA3AF] grayscale opacity-70"
      title={label}
      aria-label={label}
    >
      {children}
    </span>
  );
}

function PaymentsAccepted() {
  return (
    <div aria-label="Payments accepted">
      <p className="text-base font-semibold text-ink">Payments accepted</p>
      <p className="mt-1 text-sm text-[#6B7280]">Processed on GolfClock — icons shown for reference only.</p>
      <ul className="mt-4 flex flex-wrap items-center gap-2">
        <li>
          <PaymentMark label="Visa">
            <span className="font-display text-sm font-bold tracking-wide">VISA</span>
          </PaymentMark>
        </li>
        <li>
          <PaymentMark label="Mastercard">
            <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden="true">
              <circle cx="13" cy="11" r="7.5" fill="#9CA3AF" />
              <circle cx="23" cy="11" r="7.5" fill="#D1D5DB" />
            </svg>
          </PaymentMark>
        </li>
        <li>
          <PaymentMark label="American Express">
            <span className="font-display text-[0.65rem] font-bold tracking-tight">AMEX</span>
          </PaymentMark>
        </li>
        <li>
          <PaymentMark label="Apple Pay">
            <span className="text-sm font-semibold tracking-tight">Apple Pay</span>
          </PaymentMark>
        </li>
        <li>
          <PaymentMark label="Google Pay">
            <span className="text-sm font-semibold tracking-tight">GPay</span>
          </PaymentMark>
        </li>
      </ul>
    </div>
  );
}

export function MembershipCalculator() {
  const formId = useId();
  const [mode, setMode] = useState<PracticeMode>("unlimited");
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<Partial<CheckoutFields>>({});
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

  const set = (key: keyof CheckoutFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<CheckoutFields> = {};
    if (fields.name.trim().length < 2) next.name = "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = "Add a valid email.";
    const digits = fields.phone.replace(/\D/g, "");
    if (digits.length < 10) next.phone = "Add a phone number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const href = checkoutHref(mode, fields);
    const probe = document.createElement("a");
    probe.href = href;
    trackAnchor(probe, { membership_tier: unlimited ? "gold" : "silver" });
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const fieldClass =
    "aa-focus mt-2 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-3 text-base text-ink outline-none placeholder:text-[#9CA3AF] focus-visible:border-ink";

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 @3xl:gap-8">
      <section id="why-membership" aria-labelledby="why-membership-heading" className="membership-pricing px-5 py-5 @3xl:px-7 @3xl:py-6">
        <span className="membership-pricing__orb membership-pricing__orb--a" aria-hidden="true" />
        <span className="membership-pricing__orb membership-pricing__orb--b" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--a" src={`${iconBase}/flag.png`} alt="" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--b" src={`${iconBase}/ball.png`} alt="" aria-hidden="true" />
        <img className="membership-pricing__glyph membership-pricing__glyph--c" src={`${iconBase}/crossed-clubs.png`} alt="" aria-hidden="true" />

        <div className="membership-pricing__body">
          <h1 id="why-membership-heading" className="font-display text-2xl font-semibold tracking-tight text-ink @3xl:text-3xl">
            Indoor golf membership in Somerset, NJ
          </h1>
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-[#17743B]">{heading}</p>
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            <p className="sr-only">{live}</p>
            <p className="font-display text-[clamp(2.25rem,10cqi,3.75rem)] font-semibold leading-none tracking-tight text-ink">
              {figure}
            </p>
          </div>

          <div className="mt-6">
            <JointToggle value={mode} options={PRACTICE_OPTIONS} onChange={setMode} label="Practice offer" tone="light" />
          </div>

          <p className="mt-4 text-sm font-semibold leading-snug text-ink/75">{note}</p>

          <div className="mt-6 flex flex-col gap-3 @3xl:flex-row">
            <BookLink className="w-full" offer={primaryOffer}>
              {primaryLabel}
            </BookLink>
            <BookLink className="w-full" offer="bay" tone="line">
              Try it out
            </BookLink>
          </div>
        </div>
      </section>

      <form className="grid gap-4" onSubmit={onSubmit} noValidate aria-labelledby={`${formId}-heading`}>
        <h2 id={`${formId}-heading`} className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-ink @3xl:text-3xl">
          Finalize your booking
        </h2>

        <div className={checkoutCard}>
          <p className="text-lg font-bold text-ink">{heading}</p>
          <div className="mt-3 divide-y divide-[#E5E7EB]">
            <SummaryRow label="Offer" value={line} />
            <SummaryRow label="Access" value={unlimited ? "Up to 1 hour a day" : "10 sessions"} />
            <SummaryRow label="Billing" value={unlimited ? "Monthly" : "One-time"} />
            <SummaryRow label={unlimited ? "Membership" : "Pack"} value={totalLabel} />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#E5E7EB] pt-3">
            <span className="text-base font-bold text-ink">Total</span>
            <span className="font-display text-2xl font-semibold tabular-nums text-ink">{totalLabel}</span>
          </div>
          <p className="mt-4 text-right font-mono text-xs text-[#9CA3AF]">{orderRef(mode)}</p>
        </div>

        <div className={checkoutCard}>
          <p className="text-base font-semibold text-ink">Your details</p>
          <p className="mt-1 text-sm text-[#6B7280]">Carried into GolfClock when you confirm. Nothing is charged here.</p>
          <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
            <label className="block text-sm font-semibold text-ink">
              Name
              <input
                className={fieldClass}
                name="name"
                autoComplete="name"
                value={fields.name}
                aria-invalid={errors.name ? true : undefined}
                onChange={(event) => set("name", event.target.value)}
              />
              {errors.name ? <span className="mt-2 block text-xs font-normal text-red-700">{errors.name}</span> : null}
            </label>
            <label className="block text-sm font-semibold text-ink">
              Email
              <input
                className={fieldClass}
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                aria-invalid={errors.email ? true : undefined}
                onChange={(event) => set("email", event.target.value)}
              />
              {errors.email ? <span className="mt-2 block text-xs font-normal text-red-700">{errors.email}</span> : null}
            </label>
            <label className="block text-sm font-semibold text-ink">
              Phone
              <input
                className={fieldClass}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={fields.phone}
                aria-invalid={errors.phone ? true : undefined}
                onChange={(event) => set("phone", event.target.value)}
              />
              {errors.phone ? <span className="mt-2 block text-xs font-normal text-red-700">{errors.phone}</span> : null}
            </label>
          </div>
        </div>

        <div className={checkoutCard}>
          <PaymentsAccepted />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`inline-flex min-h-12 items-center justify-center rounded-full bg-[#FF6B8A] px-8 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#ff5a7d] active:bg-[#f0486c] ${buttonFocus}`}
          >
            Confirm booking
          </button>
        </div>
      </form>

      <section className={`${checkoutCard} text-center`} aria-labelledby="join-heading">
        <h2 id="join-heading" className="font-display text-3xl font-semibold tracking-tight text-ink">
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
