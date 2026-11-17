import { useState } from "react";
import { PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

type Mode = "evaluation" | "lessons";

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
      selector={
        <div
          className="grid grid-cols-1 gap-1 rounded-3xl bg-white/10 p-1 @3xl:grid-cols-2 @3xl:rounded-full"
          role="group"
          aria-label="Coaching offer"
        >
          <ModeButton pressed={evaluation} onClick={() => setMode("evaluation")}>
            Swing evaluation
          </ModeButton>
          <ModeButton pressed={!evaluation} onClick={() => setMode("lessons")}>
            Lessons
          </ModeButton>
        </div>
      }
    />
  );
}

function ModeButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      className={`aa-focus-ink min-h-11 rounded-full px-3 text-base font-semibold transition-[background-color,color] ${
        pressed ? "bg-white text-ink" : "text-white"
      }`}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
