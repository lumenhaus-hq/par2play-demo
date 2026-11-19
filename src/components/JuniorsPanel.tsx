import { useState } from "react";
import { BookingCheckout, appendCheckoutParams } from "./BookingCheckout";
import { CompareBoxes, PricingHero } from "./PricingHero";
import { JointToggle } from "./JointToggle";
import { OCLOCK, PRICES } from "../data/business";
import { JUNIORS_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

const PLANS = [
  { value: "once", label: "Once a week", price: PRICES.juniorOneLessonWeekly },
  { value: "twice", label: "Twice a week", price: PRICES.juniorTwoLessonsWeekly },
] as const;

type PlanId = (typeof PLANS)[number]["value"];

export function JuniorsPanel() {
  const [planId, setPlanId] = useState<PlanId>("twice");
  const plan = PLANS.find((item) => item.value === planId) ?? PLANS[1];
  const figure = `${money(plan.price)}/mo`;
  const live = `${plan.label} ${figure}. Once a week ${money(PRICES.juniorOneLessonWeekly)} a month. Twice a week ${money(PRICES.juniorTwoLessonsWeekly)} a month.`;
  const offerParam = planId === "once" ? "junior_once_weekly" : "junior_twice_weekly";
  const orderRef = planId === "once" ? "ord_p2p_junior_once" : "ord_p2p_junior_twice";

  return (
    <PricingHero
      id="juniors-offer"
      pageTitle="Golf for Kids"
      heading={plan.label}
      figure={figure}
      live={live}
      film={JUNIORS_FILM}
      primary={{ offer: "junior", label: "Become a Junior Member" }}
      secondary={{ offer: "junior-plus", label: "Experience a Junior Class" }}
      selector={
        <JointToggle
          value={planId}
          options={[
            { value: "once", label: "Once a week" },
            { value: "twice", label: "Twice a week" },
          ]}
          onChange={setPlanId}
          label="Junior plan"
          tone="dark"
        />
      }
      comparison={
        <CompareBoxes
          mutedLabel="Once a week"
          muted={`${money(PRICES.juniorOneLessonWeekly)}/mo`}
          highlightLabel="Twice a week"
          highlight={`${money(PRICES.juniorTwoLessonsWeekly)}/mo`}
          emphasized={planId === "once" ? "left" : "right"}
        />
      }
      checkout={
        <BookingCheckout
          summaryTitle={plan.label}
          rows={[
            { label: "Offer", value: "Golf for Kids" },
            { label: "Cadence", value: plan.label },
            { label: "Billing", value: "Monthly" },
            { label: "Membership", value: figure },
          ]}
          totalLabel={figure}
          orderRef={orderRef}
          checkoutHref={(fields) => appendCheckoutParams(OCLOCK.lessons, fields, offerParam)}
        />
      }
    />
  );
}
