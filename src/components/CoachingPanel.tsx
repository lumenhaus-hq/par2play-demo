import { useId, useState } from "react";
import { CompareBoxes, PricingHero } from "./PricingHero";
import { PRICES } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

const PACKS = [
  { count: 1, price: PRICES.lessonSingle },
  { count: 5, price: PRICES.lessonPack5 },
  { count: 10, price: PRICES.lessonPack10 },
  { count: 20, price: PRICES.lessonPack20 },
  { count: 30, price: PRICES.lessonPack30 },
  { count: 50, price: PRICES.lessonPack50 },
] as const;

type Mode = "lessons" | "evaluation";

export function CoachingPanel() {
  const sliderId = useId();
  const [mode, setMode] = useState<Mode>("evaluation");
  const [index, setIndex] = useState(1);
  const pack = PACKS[index] ?? PACKS[1];
  const lessonWord = pack.count === 1 ? "lesson" : "lessons";
  const phrase = `${pack.count} ${lessonWord} in the pack`;
  const singleTotal = pack.count * PRICES.lessonSingle;
  const figure = mode === "evaluation" ? money(PRICES.swingEvaluation) : money(pack.price);
  const heading = mode === "evaluation" ? "Swing evaluation" : pack.count === 1 ? "Single lesson" : `${pack.count}-lesson pack`;
  const live =
    mode === "evaluation"
      ? `Swing evaluation ${money(PRICES.swingEvaluation)}. 50 to 60 minutes.`
      : `${heading} ${money(pack.price)}. Single lessons ${money(singleTotal)}.`;

  return (
    <PricingHero
      id="coaching-offer"
      pageTitle="Golf lessons in Somerset, NJ"
      heading={heading}
      figure={figure}
      live={live}
      film={COACHING_FILM}
      facts={[
        { label: "Minutes / session", value: mode === "evaluation" ? "50–60" : String(PRICES.lessonMinutes), icon: "clock" },
        { label: "Sessions", value: String(mode === "evaluation" ? 1 : pack.count), icon: "sessions" },
      ]}
      primary={{ offer: "swing-evaluation", label: "Evaluate my swing" }}
      secondary={{ offer: "bay", label: "Try it out" }}
      selector={
        <div>
          <div className="grid grid-cols-1 gap-1 rounded-3xl bg-white/10 p-1 @3xl:grid-cols-2 @3xl:rounded-full" role="group" aria-label="Coaching offer">
            <ModeButton pressed={mode === "evaluation"} onClick={() => setMode("evaluation")}>
              Swing evaluation
            </ModeButton>
            <ModeButton pressed={mode === "lessons"} onClick={() => setMode("lessons")}>
              Lessons
            </ModeButton>
          </div>
          {mode === "lessons" ? (
            <div className="mt-6">
              <label htmlFor={sliderId} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base font-semibold text-white">
                <output htmlFor={sliderId} className="font-display text-5xl font-semibold leading-none text-mint tabular-nums">
                  {pack.count}
                </output>
                {lessonWord} in the pack
              </label>
              <input
                id={sliderId}
                className="pace-slider pace-slider-on-dark mt-3 w-full"
                type="range"
                min={0}
                max={PACKS.length - 1}
                step={1}
                value={index}
                aria-valuetext={phrase}
                onChange={(event) => setIndex(Number(event.target.value))}
              />
            </div>
          ) : null}
        </div>
      }
      comparison={
        mode === "lessons" && pack.count > 1 ? (
          <CompareBoxes
            mutedLabel="Single lessons"
            muted={money(singleTotal)}
            highlightLabel="Lesson pack"
            highlight={money(pack.price)}
          />
        ) : null
      }
    />
  );
}

function ModeButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      className={`aa-focus-ink min-h-11 rounded-full px-3 text-base font-semibold ${pressed ? "bg-white text-ink" : "text-white"}`}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
