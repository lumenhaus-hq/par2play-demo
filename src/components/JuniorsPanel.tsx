import { useState } from "react";
import { CompareBoxes, PricingHero } from "./PricingHero";
import { JointToggle } from "./JointToggle";
import { PRICES } from "../data/business";
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

  return (
    <PricingHero
      id="juniors-offer"
      pageTitle="Junior golf in Somerset, NJ"
      heading={plan.label}
      figure={figure}
      live={live}
      film={JUNIORS_FILM}
      primary={{ offer: "junior", label: "Schedule junior coaching" }}
      secondary={{ offer: "bay", label: "Book a Bay" }}
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
    />
  );
}
