import type { ReactNode } from "react";
import { BookLink, CtaAnchor, CtaPair } from "./Cta";
import { Banknote } from "lucide-react";
import { VideoSlot } from "./VideoSlot";
import type { BookingOffer } from "../data/business";

type PricingCta = {
  label: string;
  offer?: BookingOffer;
  href?: string;
};

const figureClass =
  "mt-3 max-w-full font-display text-[clamp(2.25rem,14cqi,6rem)] font-semibold leading-none tracking-tight text-white @3xl:text-8xl";

function PricingCtaLink({ action, tone }: { action: PricingCta; tone: "brand" | "inverted" }) {
  if (action.href) {
    return (
      <CtaAnchor className="w-full" href={action.href} tone={tone} offer={action.offer}>
        {action.label}
      </CtaAnchor>
    );
  }
  if (!action.offer) {
    throw new Error("Pricing CTA needs an offer or href.");
  }
  return (
    <BookLink className="w-full" offer={action.offer} tone={tone}>
      {action.label}
    </BookLink>
  );
}

export function PricingHero({
  id,
  heading,
  pageTitle,
  figure,
  live,
  selector,
  comparison,
  primary,
  secondary,
  film,
  checkout,
}: {
  id: string;
  heading: string;
  pageTitle: string;
  figure: string;
  live: string;
  selector?: ReactNode;
  comparison?: ReactNode;
  primary: PricingCta;
  secondary?: PricingCta;
  film: { src: string; srcMobile?: string; poster: string };
  checkout?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="@container min-w-0 overflow-hidden rounded-3xl bg-void">
      <div className="@3xl:grid @3xl:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center bg-[radial-gradient(120%_80%_at_0%_0%,rgb(20_212_94/0.16),transparent_52%)] px-5 pt-8 pb-8 @3xl:px-12 @3xl:py-14">
          <h1 id={`${id}-heading`} className="offer-title text-2xl tracking-tight text-white @3xl:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-mint">{heading}</p>
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            <p className="sr-only">{live}</p>
            <p
              className={
                figure.startsWith("$")
                  ? figureClass
                  : "mt-3 max-w-full font-display text-3xl font-semibold leading-tight tracking-tight text-white @3xl:text-5xl"
              }
            >
              {figure}
            </p>
          </div>
          {selector ? <div className="mt-6 min-w-0">{selector}</div> : null}
          {comparison ? <div className="mt-6 min-w-0">{comparison}</div> : null}
          <CtaPair className="mt-6">
            <PricingCtaLink action={primary} tone="brand" />
            {secondary ? <PricingCtaLink action={secondary} tone="inverted" /> : null}
          </CtaPair>
        </div>
        <div className="relative flex min-h-72 w-full min-w-0 flex-col justify-end overflow-hidden @3xl:min-h-full">
          <VideoSlot src={film.src} srcMobile={film.srcMobile} poster={film.poster} className="absolute inset-0 h-full w-full" pausable />
        </div>
      </div>
      {checkout ? <div className="border-t border-white/15 px-5 py-8 @3xl:px-12 @3xl:py-10">{checkout}</div> : null}
    </section>
  );
}

function PriceCell({ label, value, hot }: { label: string; value: string; hot: boolean }) {
  return (
    <div
      className={
        hot
          ? "min-w-0 rounded-2xl border-2 border-accent bg-bay p-3 shadow-[0_0_36px_rgb(20_212_94/0.22)] @3xl:p-4"
          : "min-w-0 rounded-2xl border-2 border-white/25 bg-white/5 p-3 @3xl:p-4"
      }
    >
      <p
        className={`flex min-h-8 items-center gap-2 text-sm font-semibold uppercase leading-tight tracking-[0.04em] @3xl:text-base ${hot ? "text-mint" : "text-[#E5E7EB]"}`}
      >
        <Banknote aria-hidden="true" className="size-4 shrink-0" />
        {label}
      </p>
      <p className={`mt-3 font-display text-2xl font-semibold leading-none tabular-nums @3xl:text-4xl ${hot ? "text-mint" : "text-[#E5E7EB]"}`}>
        {value}
      </p>
    </div>
  );
}

export function CompareBoxes({
  mutedLabel,
  muted,
  highlightLabel,
  highlight,
  note,
  emphasized = "right",
}: {
  mutedLabel: string;
  muted: string;
  highlightLabel: string;
  highlight: string;
  note?: string;
  emphasized?: "left" | "right";
}) {
  return (
    <div>
      <div className="grid min-w-0 grid-cols-2 gap-3">
        <PriceCell label={mutedLabel} value={muted} hot={emphasized === "left"} />
        <PriceCell label={highlightLabel} value={highlight} hot={emphasized === "right"} />
      </div>
      {note ? <p className="mt-3 border-t border-dashed border-white/40 pt-3 text-xl font-semibold text-white">{note}</p> : null}
    </div>
  );
}
