import { useState } from "react";
import { CompareBoxes, PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { JUNIORS_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

const PLANS = [
  { id: "once", name: "Once a week", price: PRICES.juniorOneLessonWeekly },
  { id: "twice", name: "Twice a week", price: PRICES.juniorTwoLessonsWeekly },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

export function JuniorsPanel() {
  const [planId, setPlanId] = useState<PlanId>("twice");
  const plan = PLANS.find((item) => item.id === planId) ?? PLANS[1];
  const figure = `${money(plan.price)}/mo`;
  const live = `${plan.name} ${figure}. Once a week ${money(PRICES.juniorOneLessonWeekly)} a month. Twice a week ${money(PRICES.juniorTwoLessonsWeekly)} a month.`;

  return (
    <PricingHero
      id="juniors-offer"
      pageTitle="Junior golf in Somerset, NJ"
      heading={plan.name}
      figure={figure}
      live={live}
      film={JUNIORS_FILM}
      primary={{ offer: "junior", label: "Schedule junior coaching" }}
      secondary={{ offer: "bay", label: "Try it out" }}
      selector={
        <div className="grid grid-cols-1 gap-1 rounded-3xl bg-white/10 p-1 @3xl:grid-cols-2 @3xl:rounded-full" role="group" aria-label="Junior plan">
          {PLANS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`aa-focus-ink min-h-11 rounded-full px-3 text-base font-semibold ${item.id === planId ? "bg-accent text-ink" : "text-white"}`}
              aria-pressed={item.id === planId}
              onClick={() => setPlanId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
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
