import { BookLink } from "./Cta";
import { BentoGrid, BentoTile } from "./MembershipBento";
import { VideoSlot } from "./VideoSlot";
import { ADDRESS_LINE, NAP, PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { HOURS_LABEL } from "../data/site";
import { money } from "../data/membershipEstimate";

const FACTS = [
  {
    eyebrow: "The cameras",
    title: "Swing-evaluation cameras",
    line: "Thirty minutes on Full Swing simulators.",
  },
  {
    eyebrow: "The coach",
    title: "PGA professionals",
    line: "A clear place to start before a lesson pack.",
  },
  {
    eyebrow: "The room",
    title: "Four enclosed bays",
    line: `Clubs are on hand. More than ${SIMULATOR_COURSE_COUNT} courses are loaded.`,
  },
  {
    eyebrow: "Somerset",
    title: HOURS_LABEL,
    line: `${ADDRESS_LINE}. Call ${NAP.phoneDisplay}.`,
  },
] as const;

export function SwingEvaluation() {
  const price = money(PRICES.swingEvaluation);
  return (
    <div className="swing-page">
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
        <p className="swing-hero__mark">{`${PRICES.swingEvaluationMinutes} min`}</p>
        <h1 className="offer-title play-title swing-hero__title">Swing evaluation</h1>
        <p className="swing-hero__lead">PGA professionals. Full Swing cameras.</p>
        <p className="swing-hero__price" data-swing-price={price}>
          {price}
        </p>
        <p className="swing-hero__length">{`${PRICES.swingEvaluationMinutes} minutes`}</p>
        <div className="swing-hero__cta">
          <BookLink className="w-full" offer="swing-evaluation">
            Book swing evaluation
          </BookLink>
        </div>
      </header>
      <div className="swing-hero__film">
        <VideoSlot
          src={COACHING_FILM.src}
          srcMobile={COACHING_FILM.srcMobile}
          poster={COACHING_FILM.poster}
          posterAlt="An adult golfer reviewing shot data in a Par2Play simulator bay"
          className="aspect-video"
          pausable
        />
      </div>
      <section className="page-bento swing-get" aria-labelledby="swing-get-heading">
        <h2 id="swing-get-heading" className="offer-title text-4xl tracking-tight">
          What you get
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          {`${PRICES.swingEvaluationMinutes} minutes on the swing-evaluation cameras. ${price}.`}
        </p>
        <div className="mt-8">
          <BentoGrid>
            {FACTS.map((fact) => (
              <BentoTile key={fact.title} label={fact.title}>
                <p className="membership-bento__eyebrow">{fact.eyebrow}</p>
                <h3 className="membership-bento__title">{fact.title}</h3>
                <p className="membership-bento__line">{fact.line}</p>
              </BentoTile>
            ))}
          </BentoGrid>
        </div>
      </section>
    </div>
  );
}
