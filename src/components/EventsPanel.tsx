import { useState } from "react";
import { OfferSheet } from "./OfferSheet";
import { PriceInvoice } from "./PriceInvoice";
import { PRICES } from "../data/business";
import { formatPrice } from "../data/membershipEstimate";

const HOURS = ["2", "3", "6"] as const;

type EventHours = (typeof HOURS)[number];

const PRICE = formatPrice(PRICES.eventPackage);

function hoursLabel(hours: EventHours): string {
  switch (hours) {
    case "2":
      return "2 hours";
    case "3":
      return "3 hours";
    case "6":
      return "6 hours";
    default: {
      const exhaustive: never = hours;
      return exhaustive;
    }
  }
}

export function EventsPanel() {
  const [hours, setHours] = useState<EventHours>("2");
  const label = hoursLabel(hours);
  const live = `${label}. ${PRICE}.`;

  return (
    <OfferSheet
      id="events-offer"
      toggleLabel="Event length"
      value={hours}
      onChange={setHours}
      offer="group"
      options={HOURS.map((choice) => ({
        value: choice,
        label: hoursLabel(choice),
        price: PRICE,
      }))}
      invoice={
        <PriceInvoice
          title={label}
          rows={[
            { label: "Offer", value: "Event package" },
            { label: "Length", value: label },
            { label: "Price", value: PRICE },
          ]}
          totalLabel={PRICE}
          live={live}
        />
      }
    />
  );
}
