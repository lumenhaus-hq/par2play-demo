import { useState } from "react";
import { OfferSheet } from "./OfferSheet";
import { PriceInvoice } from "./PriceInvoice";
import { PRICES, type BookingOffer } from "../data/business";
import { money } from "../data/membershipEstimate";

const PLANS = [
  { value: "once", label: "Once a week", price: `${money(PRICES.juniorOneLessonWeekly)}/mo` },
  { value: "twice", label: "Twice a week", price: `${money(PRICES.juniorTwoLessonsWeekly)}/mo` },
] as const;

type PlanId = (typeof PLANS)[number]["value"];

export function JuniorsPanel() {
  const [planId, setPlanId] = useState<PlanId>("twice");
  const plan = PLANS.find((item) => item.value === planId) ?? PLANS[1];
  const offer: BookingOffer = planId === "once" ? "junior" : "junior-plus";
  const live = `${plan.label} ${plan.price}. Once a week ${money(PRICES.juniorOneLessonWeekly)} a month. Twice a week ${money(PRICES.juniorTwoLessonsWeekly)} a month.`;

  return (
    <OfferSheet
      id="juniors-offer"
      toggleLabel="Junior plan"
      value={planId}
      onChange={setPlanId}
      offer={offer}
      options={PLANS}
      invoice={
        <PriceInvoice
          title={plan.label}
          rows={[
            { label: "Offer", value: "Golf for Kids" },
            { label: "Cadence", value: plan.label },
            { label: "Billing", value: "Monthly" },
          ]}
          totalLabel={plan.price}
          live={live}
        />
      }
    />
  );
}
