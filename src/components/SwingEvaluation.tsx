import { AskUsLink } from "./AskUsLink";
import { BookLink } from "./Cta";
import { PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";

export function SwingEvaluation() {
  const price = money(PRICES.swingEvaluation);
  return (
    <header className="swing-hero">
      <img
        className="play-sheet__glyph play-sheet__glyph--a"
        src={`${import.meta.env.BASE_URL}media/membership-icons/swing.png`}
        alt=""
        aria-hidden="true"
        width={64}
        height={50}
        decoding="async"
      />
      <p className="swing-hero__price" data-swing-price={price}>
        {price}
      </p>
      <p className="swing-hero__length">{`${PRICES.swingEvaluationMinutes} minutes`}</p>
      <div className="swing-hero__cta">
        <BookLink className="w-full" offer="swing-evaluation">
          Book swing evaluation
        </BookLink>
        <AskUsLink />
      </div>
    </header>
  );
}
