import { useState } from "react";
import { PriceChoice } from "./PriceChoice";
import { PriceInvoice } from "./PriceInvoice";
import { PricingHero } from "./PricingHero";
import { PRICES, type BookingOffer } from "../data/business";
import { JUNIORS_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

const PLANS = [
  { value: "once", label: "Once a week", price: `${money(PRICES.juniorOneLessonWeekly)}/mo` },
  { value: "twice", label: "Twice a week", price: `${money(PRICES.juniorTwoLessonsWeekly)}/mo` },
] as const;

type PlanId = (typeof PLANS)[number]["value"];

export function JuniorsPanel() {
  const [planId, setPlanId] = useState<PlanId>("twice");
  const plan = PLANS.find((item) => item.value === planId) ?? PLANS[1];
  const figure = plan.price;
  const offer: BookingOffer = planId === "once" ? "junior" : "junior-plus";
  const live = `${plan.label} ${figure}. Once a week ${money(PRICES.juniorOneLessonWeekly)} a month. Twice a week ${money(PRICES.juniorTwoLessonsWeekly)} a month.`;
  const orderRef = planId === "once" ? "ord_p2p_junior_once" : "ord_p2p_junior_twice";

  return (
    <PricingHero
      id="juniors-offer"
      pageTitle="Golf for Kids"
      film={JUNIORS_FILM}
      primary={{ offer, label: "Complete booking" }}
      selector={
        <PriceChoice
          label="Junior plan"
          value={planId}
          options={PLANS}
          onChange={setPlanId}
        />
      }
      invoice={
        <PriceInvoice
          title={plan.label}
          rows={[
            { label: "Offer", value: "Golf for Kids" },
            { label: "Cadence", value: plan.label },
            { label: "Billing", value: "Monthly" },
            { label: "Membership", value: figure },
          ]}
          totalLabel={figure}
          orderRef={orderRef}
          live={live}
        />
      }
    />
  );
}
