import { useState } from "react";
import { JointToggle } from "./JointToggle";
import { PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

type Mode = "evaluation" | "lessons";

const OPTIONS = [
  { value: "evaluation", label: "Swing evaluation" },
  { value: "lessons", label: "Lessons" },
] as const;

export function CoachingPanel() {
  const [mode, setMode] = useState<Mode>("evaluation");
  const evaluation = mode === "evaluation";
  const figure = evaluation ? money(PRICES.swingEvaluation) : money(PRICES.lessonSingle);
  const heading = evaluation ? "Swing evaluation" : "Private lesson";
  const live = evaluation
    ? `Swing evaluation ${figure}. 50 to 60 minutes with a PGA professional.`
    : `Private lesson ${figure}. ${PRICES.lessonMinutes} minutes with a PGA professional.`;

  return (
    <PricingHero
      id="coaching-offer"
      pageTitle="Golf lessons in Somerset, NJ"
      heading={heading}
      figure={figure}
      live={live}
      film={COACHING_FILM}
      primary={
        evaluation
          ? { offer: "swing-evaluation", label: "Evaluate my Swing" }
          : { offer: "lesson", label: "Schedule a Lesson" }
      }
      secondary={{ offer: "bay", label: "Book a Bay" }}
      selector={<JointToggle value={mode} options={OPTIONS} onChange={setMode} label="Coaching offer" tone="dark" />}
    />
  );
}
