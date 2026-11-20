import { useState } from "react";
import { JointToggle } from "./JointToggle";
import { PriceChoice } from "./PriceChoice";
import { PriceInvoice } from "./PriceInvoice";
import { PricingHero } from "./PricingHero";
import { PRICES, bookingHref, type BookingOffer } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

type Product = "swing" | "lessons";
type Mode = "single" | "pack";

const LESSONS = [
  { value: "single", label: "1 Lesson", price: money(PRICES.lessonSingle) },
  { value: "pack", label: "10 Pack", price: money(PRICES.lessonPack10) },
] as const;

export function CoachingPanel() {
  const [product, setProduct] = useState<Product>("lessons");
  const [mode, setMode] = useState<Mode>("pack");
  const pack = mode === "pack";
  const lessonFigure = pack ? money(PRICES.lessonPack10) : money(PRICES.lessonSingle);
  const swingFigure = `${money(PRICES.swingEvaluation)} / ${PRICES.swingEvaluationMinutes} min`;
  const swing = product === "swing";
  const figure = swing ? money(PRICES.swingEvaluation) : lessonFigure;
  const heading = swing ? "Swing evaluation" : pack ? "10 Pack" : "Single lesson";
  const access = swing ? `${PRICES.swingEvaluationMinutes} minutes` : pack ? "10 private lessons" : `${PRICES.lessonMinutes} minutes`;
  const billing = swing || !pack ? "One-time" : "One-time pack";
  const offer: BookingOffer = swing ? "swing-evaluation" : pack ? "lesson-pack" : "lesson";
  const orderRef = swing ? undefined : pack ? "ord_p2p_lesson_pack_10" : "ord_p2p_private_lesson";
  const note = swing
    ? `${PRICES.swingEvaluationMinutes}-minute swing evaluation.`
    : pack
      ? "Save more by buying a 10 pack."
      : `${PRICES.lessonMinutes}-minute private lesson.`;
  const live = swing
    ? `Swing evaluation ${figure}. ${PRICES.swingEvaluationMinutes} minutes.`
    : pack
      ? `10 Pack ${figure}. Ten private lessons. Save more by buying a 10 pack.`
      : `Single lesson ${figure}. ${PRICES.lessonMinutes} minutes with a PGA professional.`;

  return (
    <PricingHero
      id="coaching-offer"
      pageTitle="Golf lessons in Somerset, NJ"
      film={COACHING_FILM}
      primary={{ href: bookingHref(offer), offer, label: "Complete booking" }}
      selector={
        <div className="grid min-w-0 gap-4">
          <PriceChoice
            label="Coaching offer"
            value={product}
            onChange={setProduct}
            options={[
              { value: "swing", label: "Book swing evaluation", price: swingFigure },
              { value: "lessons", label: "Book lessons", price: lessonFigure },
            ]}
          />
          {swing ? null : (
            <JointToggle
              value={mode}
              options={LESSONS}
              onChange={setMode}
              label="Lesson offer"
              tone="dark"
            />
          )}
        </div>
      }
      invoice={
        <PriceInvoice
          title={heading}
          rows={[
            { label: "Offer", value: heading },
            { label: "Session", value: access },
            { label: "Billing", value: billing },
            { label: "Price", value: figure },
          ]}
          totalLabel={figure}
          orderRef={orderRef}
          live={live}
          note={note}
        />
      }
    />
  );
}
