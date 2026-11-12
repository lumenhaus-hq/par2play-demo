import { useId, useState, type FormEvent, type ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { PhoneLink, buttonFocus } from "./Cta";
import { CompareBoxes, PricingHero } from "./PricingHero";
import { NAP, OCLOCK, PRICES } from "../data/business";
import { TESTIMONIAL_FILMS } from "../data/films";
import { money } from "../data/membershipEstimate";

const FILM = TESTIMONIAL_FILMS[0];
const PAYG_TEN = PRICES.baySession * 10;

type PracticeMode = "unlimited" | "pack";

type CheckoutFields = {
  name: string;
  email: string;
  phone: string;
};

const emptyCheckout: CheckoutFields = { name: "", email: "", phone: "" };

function ModeButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      className={`aa-focus-ink min-h-11 rounded-full border-2 px-3 text-base font-semibold transition-[border-color,background-color,color] ${
        pressed ? "border-[#7DFFB0] bg-white text-[#0A0F0B]" : "border-white/35 text-white"
      }`}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

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
      <span className="font-semibold text-[#0A0F0B] tabular-nums">{value}</span>
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
      <p className="text-base font-semibold text-[#0A0F0B]">Payments accepted</p>
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

function MembershipCheckout({ mode }: { mode: PracticeMode }) {
  const formId = useId();
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<Partial<CheckoutFields>>({});
  const unlimited = mode === "unlimited";
  const title = unlimited ? "Unlimited Practice" : "10 Sessions";
  const line = unlimited ? "Practice Unlimited (monthly)" : "10 × 60-minute bay sessions";
  const total = unlimited ? money(PRICES.unlimitedMonthly) : money(PRICES.tenPack);
  const totalLabel = unlimited ? `${total}/mo` : total;

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
    "aa-focus mt-2 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 py-3 text-base text-[#0A0F0B] outline-none placeholder:text-[#9CA3AF] focus-visible:border-[#0A0F0B]";

  return (
    <section className="mx-auto w-full max-w-3xl" aria-labelledby={`${formId}-heading`}>
      <h2 id={`${formId}-heading`} className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-[#0A0F0B] @3xl:text-3xl">
        Finalize your booking
      </h2>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6">
          <p className="text-lg font-bold text-[#0A0F0B]">{title}</p>
          <div className="mt-3 divide-y divide-[#E5E7EB]">
            <SummaryRow label="Offer" value={line} />
            <SummaryRow label="Access" value={unlimited ? "Up to 1 hour a day" : "10 sessions"} />
            <SummaryRow label="Billing" value={unlimited ? "Monthly" : "One-time"} />
            <SummaryRow label={unlimited ? "Membership" : "Pack"} value={totalLabel} />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#E5E7EB] pt-3">
            <span className="text-base font-bold text-[#0A0F0B]">Total</span>
            <span className="font-display text-2xl font-semibold tabular-nums text-[#0A0F0B]">{totalLabel}</span>
          </div>
          <p className="mt-4 text-right font-mono text-xs text-[#9CA3AF]">{orderRef(mode)}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6">
          <p className="text-base font-semibold text-[#0A0F0B]">Your details</p>
          <p className="mt-1 text-sm text-[#6B7280]">Carried into GolfClock when you confirm. Nothing is charged here.</p>
          <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
            <label className="block text-sm font-semibold text-[#0A0F0B]">
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
            <label className="block text-sm font-semibold text-[#0A0F0B]">
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
            <label className="block text-sm font-semibold text-[#0A0F0B]">
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

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 shadow-[0_8px_30px_rgb(10_15_11/0.06)] @3xl:px-7 @3xl:py-6">
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
    </section>
  );
}

export function MembershipCalculator() {
  const [mode, setMode] = useState<PracticeMode>("unlimited");
  const unlimited = mode === "unlimited";
  const figure = unlimited ? `${money(PRICES.unlimitedMonthly)}/mo` : money(PRICES.tenPack);
  const heading = unlimited ? "Unlimited Practice" : "10 Sessions";
  const live = unlimited
    ? `Unlimited Practice ${money(PRICES.unlimitedMonthly)} a month. Up to 1 hour a day.`
    : `10 Sessions ${money(PRICES.tenPack)}. Ten 60-minute bay sessions.`;
  const primaryOffer = unlimited ? ("practice-unlimited" as const) : ("ten-pack" as const);
  const primaryLabel = unlimited ? "Become a Member" : "Buy 10 Sessions";

  return (
    <div className="grid gap-16 @3xl:gap-24">
      <PricingHero
        id="why-membership"
        pageTitle="Indoor golf membership in Somerset, NJ"
        heading={heading}
        figure={figure}
        live={live}
        film={FILM}
        facts={
          unlimited
            ? [
                { label: "Bay access", value: "Daily", icon: "calendar" },
                { label: "Session length", value: "Up to 1 hr", icon: "clock" },
              ]
            : [
                { label: "Sessions", value: "10", icon: "sessions" },
                { label: "Minutes / session", value: "60", icon: "clock" },
              ]
        }
        primary={{ offer: primaryOffer, label: primaryLabel }}
        secondary={{ offer: "bay", label: "Try it out" }}
        selector={
          <div className="grid grid-cols-1 gap-1 rounded-3xl bg-white/10 p-1 @3xl:grid-cols-2 @3xl:rounded-full" role="group" aria-label="Practice offer">
            <ModeButton pressed={unlimited} onClick={() => setMode("unlimited")}>
              Unlimited Practice
            </ModeButton>
            <ModeButton pressed={!unlimited} onClick={() => setMode("pack")}>
              10 Sessions
            </ModeButton>
          </div>
        }
        comparison={
          unlimited ? (
            <CompareBoxes
              mutedLabel="10 Sessions"
              muted={money(PRICES.tenPack)}
              highlightLabel="Unlimited / mo"
              highlight={money(PRICES.unlimitedMonthly)}
              note="Members keep a bay hour every day for less than a few 10-packs."
            />
          ) : (
            <CompareBoxes
              mutedLabel="Pay as you go"
              muted={money(PAYG_TEN)}
              highlightLabel="10 Sessions"
              highlight={money(PRICES.tenPack)}
              note={`${money(PRICES.tenPack / 10)} a session in the pack.`}
            />
          )
        }
      />

      <MembershipCheckout mode={mode} />

      <section className="rounded-3xl bg-[#020806] px-6 py-12 text-center text-white @3xl:px-12" aria-labelledby="join-heading">
        <h2 id="join-heading" className="font-display text-4xl font-semibold tracking-tight">
          compare plans
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-white/75">
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
        <p className="mt-6 text-base leading-snug">
          {NAP.street}
          <br />
          {NAP.city}, {NAP.region} {NAP.postalCode}
          <br />
          <PhoneLink className="aa-focus-ink underline decoration-2 underline-offset-4">{NAP.phoneDisplay}</PhoneLink>
        </p>
      </section>
    </div>
  );
}
