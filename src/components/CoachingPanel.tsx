import { PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

export function CoachingPanel() {
  const figure = money(PRICES.swingEvaluation);
  const live = `Swing evaluation ${figure}. 50 to 60 minutes with a PGA professional.`;

  return (
    <PricingHero
      id="coaching-offer"
      pageTitle="Golf lessons in Somerset, NJ"
      heading="Swing evaluation"
      figure={figure}
      live={live}
      film={COACHING_FILM}
      primary={{ offer: "swing-evaluation", label: "Evaluate my swing" }}
      secondary={{ offer: "bay", label: "Try it out" }}
    />
  );
}
