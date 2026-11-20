import { PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { EVENTS_HERO_FILM } from "../data/films";
import { formatPrice } from "../data/membershipEstimate";

export function TournamentPanel() {
  return (
    <PricingHero
      id="tournament-offer"
      pageTitle="Par2Play Fall League"
      heading="Fall league"
      figure={formatPrice(PRICES.leagueEntry)}
      live={`${formatPrice(PRICES.leagueEntry)}. League booking is 18 holes. A League Player tag is required.`}
      film={EVENTS_HERO_FILM}
      primary={{ offer: "tournament", label: "Join the league" }}
      secondary={{ offer: "bay", label: "Try it out" }}
    />
  );
}
