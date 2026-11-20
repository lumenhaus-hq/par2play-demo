import { useState } from "react";
import { OfferSheet } from "./OfferSheet";
import { PriceInvoice } from "./PriceInvoice";
import { PRICES, type BookingOffer } from "../data/business";
import { money } from "../data/membershipEstimate";

type Mode = "single" | "pack";

export function CoachingPanel() {
  const [mode, setMode] = useState<Mode>("pack");
  const pack = mode === "pack";
  const figure = pack ? money(PRICES.lessonPack10) : money(PRICES.lessonSingle);
  const packList = PRICES.lessonSingle * 10;
  const savePercent = Math.round(((packList - PRICES.lessonPack10) / packList) * 100);
  const packNote = `Save ${savePercent}% with 10 pack`;
  const heading = pack ? "10 Pack" : "Single lesson";
  const access = pack ? "10 private lessons" : `${PRICES.lessonMinutes} minutes`;
  const offer: BookingOffer = pack ? "lesson-pack" : "lesson";
  const live = pack
    ? `10 Pack ${figure}. Ten private lessons.`
    : `Single lesson ${figure}. ${PRICES.lessonMinutes} minutes with a PGA professional.`;

  return (
    <OfferSheet
      id="coaching-offer"
      toggleLabel="Lesson offer"
      value={mode}
      onChange={setMode}
      offer={offer}
      options={[
        { value: "single", label: "1 Lesson", price: money(PRICES.lessonSingle) },
        { value: "pack", label: "10 Pack", price: money(PRICES.lessonPack10), note: packNote },
      ]}
      invoice={
        <PriceInvoice
          title={heading}
          rows={[
            { label: "Offer", value: heading },
            { label: "Session", value: access },
            { label: "Billing", value: pack ? "One-time pack" : "One-time" },
          ]}
          totalLabel={figure}
          live={live}
        />
      }
    />
  );
}
