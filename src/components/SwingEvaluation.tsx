import { useState } from "react";
import { OfferSheet } from "./OfferSheet";
import { PriceInvoice } from "./PriceInvoice";
import { PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";

type Mode = "session";

/** $100 for 30 minutes. The invoice matches the membership and coaching scorecard. */
export function SwingEvaluation() {
  const [mode, setMode] = useState<Mode>("session");
  const price = money(PRICES.swingEvaluation);
  const minutes = `${PRICES.swingEvaluationMinutes} minutes`;
  const live = `Swing evaluation. ${minutes} on the Full Swing cameras. You pay ${price}.`;

  return (
    <OfferSheet
      id="swing-offer"
      toggleLabel="Swing evaluation"
      value={mode}
      onChange={setMode}
      offer="swing-evaluation"
      options={[{ value: "session", label: minutes, price }]}
      invoice={
        <PriceInvoice
          title="Swing evaluation"
          rows={[
            { label: "Offer", value: "Swing evaluation" },
            { label: "Time", value: minutes },
            { label: "Cameras", value: "Full Swing" },
          ]}
          totalLabel={price}
          live={live}
        />
      }
    />
  );
}
