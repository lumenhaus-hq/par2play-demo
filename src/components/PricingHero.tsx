import type { ReactNode } from "react";
import { AskUsLink } from "./AskUsLink";
import { BookLink, CtaAnchor, CtaPair } from "./Cta";
import { ReserveTime } from "./ReserveTime";
import { DisplayTitle } from "./DisplayTitle";
import { VideoSlot } from "./VideoSlot";
import type { BookingOffer } from "../data/business";

type PricingCta = {
  label: string;
  offer?: BookingOffer;
  href?: string;
  /** Subpage checkout opens the inline reserve step instead of leaving the page. */
  reserve?: boolean;
};

const figureClass =
  "mt-3 max-w-full font-display text-[clamp(2.25rem,14cqi,6rem)] font-semibold leading-none tracking-tight text-white @3xl:text-8xl";

function PricingCtaLink({ action, tone }: { action: PricingCta; tone: "brand" | "inverted" }) {
  if (action.href) {
    return (
      <CtaAnchor
        className="w-full"
        href={action.href}
        tone={tone}
        offer={action.offer}
        external={action.href.startsWith("http")}
      >
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
  accent,
  figure,
  live,
  selector,
  comparison,
  primary,
  secondary,
  film,
  invoice,
}: {
  id: string;
  pageTitle: string;
  accent?: string;
  selector?: ReactNode;
  comparison?: ReactNode;
  primary: PricingCta;
  secondary?: PricingCta;
  film: { src: string; srcMobile?: string; poster: string; posterAvif?: string; posterWebp?: string; width?: number; height?: number };
  /** Itemised price summary. When set, it replaces the standalone figure. */
  invoice?: ReactNode;
  heading?: string;
  figure?: string;
  live?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="@container min-w-0 overflow-hidden rounded-3xl bg-void">
      <div className="@3xl:grid @3xl:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-center bg-[radial-gradient(120%_80%_at_0%_0%,rgb(20_212_94/0.16),transparent_52%)] px-5 pt-8 pb-8 @3xl:px-12 @3xl:py-14">
          <DisplayTitle
            as="h1"
            id={`${id}-heading`}
            className="offer-title display-title--on-dark display-title--panel"
            text={pageTitle}
            accent={accent ?? pageTitle}
          />
          {invoice && selector ? <div className="mt-6 min-w-0">{selector}</div> : null}
          {invoice ? <div className="mt-5 min-w-0">{invoice}</div> : null}
          {!invoice && figure != null && heading != null && live != null ? (
            <>
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
            </>
          ) : null}
          {!invoice && selector ? <div className="mt-6 min-w-0">{selector}</div> : null}
          {!invoice && comparison ? <div className="mt-6 min-w-0">{comparison}</div> : null}
          {primary.reserve && primary.offer ? (
            <ReserveTime
              offer={primary.offer}
              beside={secondary ? <PricingCtaLink action={secondary} tone="inverted" /> : undefined}
            />
          ) : secondary ? (
            <CtaPair className="mt-6">
              <PricingCtaLink action={primary} tone="brand" />
              <PricingCtaLink action={secondary} tone="inverted" />
            </CtaPair>
          ) : (
            <div className="mt-6 min-w-0">
              <PricingCtaLink action={primary} tone="brand" />
            </div>
          )}
          <AskUsLink />
        </div>
        <div className="offer-film relative flex min-h-72 w-full min-w-0 flex-col justify-end overflow-hidden @3xl:min-h-full">
          <VideoSlot
            src={film.src}
            srcMobile={film.srcMobile}
            poster={film.poster}
            posterAvif={film.posterAvif}
            posterWebp={film.posterWebp}
            posterWidth={film.width}
            posterHeight={film.height}
            className="absolute inset-0 h-full w-full"
            pausable
            priority
          />
        </div>
      </div>
    </section>
  );
}
