import { Photo } from "./Media";
import type { PhotoAsset } from "../data/photos";

export type DayStep = {
  photo: PhotoAsset;
  title: string;
  line: string;
};

export function DaySteps({ steps }: { steps: readonly DayStep[] }) {
  return (
    <ol className="day-steps">
      {steps.map((step, index) => (
        <li key={step.title} className="day-steps__item">
          <div className="day-steps__media">
            <Photo photo={step.photo} />
          </div>
          <div className="min-w-0">
            <p className="day-steps__index">{index + 1}</p>
            <h3 className="day-steps__title">{step.title}</h3>
            <p className="day-steps__line">{step.line}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
