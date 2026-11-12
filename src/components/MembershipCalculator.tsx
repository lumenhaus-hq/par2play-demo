import { useState, type FormEvent } from "react";
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

function MembershipCheckout({ mode }: { mode: PracticeMode }) {
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<Partial<CheckoutFields>>({});

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
    trackAnchor(probe, { membership_tier: mode === "unlimited" ? "gold" : "silver" });
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const fieldClass =
    "aa-focus-ink mt-2 w-full rounded-2xl border border-white/25 bg-white/5 px-3 py-3 text-base text-white outline-none placeholder:text-white/45 focus-visible:border-[#7DFFB0]";

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-[#0A0F0B] px-5 py-8 text-white shadow-[0_24px_60px_rgb(10_15_11/0.35)] @3xl:px-10"
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="membership-checkout-heading"
    >
      <h2 id="membership-checkout-heading" className="font-display text-2xl font-semibold tracking-tight @3xl:text-3xl">
        Checkout details
      </h2>
      <p className="mt-2 max-w-xl text-base text-white/70">
        We’ll carry these into GolfClock when you continue. Nothing is charged on this page.
      </p>
      <div className="mt-6 grid gap-4 @3xl:grid-cols-3">
        <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/80">
          Name
          <input
            className={fieldClass}
            name="name"
            autoComplete="name"
            value={fields.name}
            aria-invalid={errors.name ? true : undefined}
            onChange={(event) => set("name", event.target.value)}
          />
          {errors.name ? <span className="mt-2 block text-xs normal-case tracking-normal text-[#ffb4b4]">{errors.name}</span> : null}
        </label>
        <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/80">
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
          {errors.email ? <span className="mt-2 block text-xs normal-case tracking-normal text-[#ffb4b4]">{errors.email}</span> : null}
        </label>
        <label className="block text-sm font-semibold uppercase tracking-[0.12em] text-white/80">
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
          {errors.phone ? <span className="mt-2 block text-xs normal-case tracking-normal text-[#ffb4b4]">{errors.phone}</span> : null}
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className={`cta-shell cta-brand cta-lift inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold text-[#0A0F0B] ${buttonFocus}`}
        >
          <span className="cta-fill" aria-hidden="true" />
          <span className="cta-label">
            <span className="cta-label-text">Continue to checkout</span>
          </span>
        </button>
        <p className="text-sm text-white/60">Opens GolfClock with your details attached.</p>
      </div>
    </form>
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
