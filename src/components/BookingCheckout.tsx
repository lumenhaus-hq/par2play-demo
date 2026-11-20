import { useId, useState, type FormEvent, type ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { buttonFocus } from "./Cta";

export type CheckoutFields = {
  name: string;
  email: string;
  phone: string;
};

const emptyCheckout: CheckoutFields = { name: "", email: "", phone: "" };

export type CheckoutSummaryRow = {
  label: string;
  value: string;
};

function PaymentMark({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex h-10 min-w-[3.25rem] items-center justify-center rounded-md border border-white/20 bg-white/10 px-2 text-white/55 grayscale"
      title={label}
      role="img"
      aria-label={label}
    >
      {children}
    </span>
  );
}

function PaymentsAccepted() {
  return (
    <div aria-label="Payments accepted">
      <p className="text-base font-semibold text-white">Payments accepted</p>
      <p className="mt-1 text-sm text-white/65">Processed on GolfClock — icons shown for reference only.</p>
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

/**
 * Dark-panel checkout block shared by membership, coaching, and juniors pricing.
 */
export function BookingCheckout({
  title,
  summaryTitle,
  rows,
  totalLabel,
  orderRef,
  checkoutHref,
}: {
  title?: string;
  summaryTitle: string;
  rows: readonly CheckoutSummaryRow[];
  totalLabel: string;
  orderRef: string;
  checkoutHref: (fields: CheckoutFields) => string;
}) {
  const formId = useId();
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
    const href = checkoutHref(fields);
    const probe = document.createElement("a");
    probe.href = href;
    trackAnchor(probe);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const fieldClass =
    "aa-focus-ink mt-2 w-full rounded-xl border border-white/25 bg-white/10 px-3 py-3 text-base text-white outline-none placeholder:text-white/40 focus-visible:border-white";

  const cardClass = "rounded-2xl border border-white/15 bg-white/5 px-5 py-5 @3xl:px-6";

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate aria-labelledby={`${formId}-heading`}>
      <h2 id={`${formId}-heading`} className="offer-title text-2xl tracking-tight text-white @3xl:text-3xl">
        {title ?? "Finalize your booking"}
      </h2>

      <div className={cardClass}>
        <p className="text-lg font-bold text-white">{summaryTitle}</p>
        <div className="mt-3 divide-y divide-white/15">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-2 text-base">
              <span className="text-white/70">{row.label}</span>
              <span className="font-semibold tabular-nums text-white">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-white/20 pt-3">
          <span className="text-base font-bold text-white">Total</span>
          <span className="font-display text-2xl font-semibold tabular-nums text-white">{totalLabel}</span>
        </div>
        <p className="mt-4 text-right font-mono text-xs text-white/45">{orderRef}</p>
      </div>

      <div className={cardClass}>
        <p className="text-base font-semibold text-white">Your details</p>
        <p className="mt-1 text-sm text-white/65">Carried into GolfClock when you confirm. Nothing is charged here.</p>
        <div className="mt-4 grid gap-4 @3xl:grid-cols-3">
          <label className="block text-sm font-semibold text-white">
            Name
            <input
              className={fieldClass}
              name="name"
              autoComplete="name"
              value={fields.name}
              aria-invalid={errors.name ? true : undefined}
              onChange={(event) => set("name", event.target.value)}
            />
            {errors.name ? <span className="mt-2 block text-xs font-normal text-red-300">{errors.name}</span> : null}
          </label>
          <label className="block text-sm font-semibold text-white">
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
            {errors.email ? <span className="mt-2 block text-xs font-normal text-red-300">{errors.email}</span> : null}
          </label>
          <label className="block text-sm font-semibold text-white">
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
            {errors.phone ? <span className="mt-2 block text-xs font-normal text-red-300">{errors.phone}</span> : null}
          </label>
        </div>
      </div>

      <div className={cardClass}>
        <PaymentsAccepted />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className={`inline-flex min-h-12 items-center justify-center rounded-full bg-[#FF6B8A] px-8 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#ff5a7d] active:bg-[#f0486c] ${buttonFocus}`}
        >
          Confirm booking
        </button>
      </div>
    </form>
  );
}

export function appendCheckoutParams(base: string, fields: CheckoutFields, offer: string): string {
  const params = new URLSearchParams();
  if (fields.name.trim()) params.set("name", fields.name.trim());
  if (fields.email.trim()) params.set("email", fields.email.trim());
  if (fields.phone.trim()) params.set("phone", fields.phone.trim());
  params.set("offer", offer);
  const query = params.toString();
  return query ? `${base}${base.includes("?") ? "&" : "?"}${query}` : base;
}
