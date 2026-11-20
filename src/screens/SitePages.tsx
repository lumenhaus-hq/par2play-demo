import { CoachingPanel } from "../components/CoachingPanel";
import { EventsPanel } from "../components/EventsPanel";
import { JuniorsPanel } from "../components/JuniorsPanel";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { SwingEvaluation } from "../components/SwingEvaluation";
import { TournamentPanel } from "../components/TournamentPanel";
import { EventGallery, StillGrid } from "../components/PhotoStrips";
import { OfferFacts } from "../components/OfferFacts";
import { OfferLayout } from "../components/OfferLayout";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { CtaPair, buttonFocus } from "../components/Cta";
import { TournamentForm } from "../components/TournamentForm";
import { EventTypeList } from "../components/EventTypeList";
import { JUNIORS_GALLERY } from "../data/gallery";
import { pageHref } from "../data/routes";
import { JsonLd } from "../components/JsonLd";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageBento } from "../components/PageBento";
import { DisplayTitle } from "../components/DisplayTitle";
import { WhatYouGet, type GetCard } from "../components/WhatYouGet";
import { PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { money } from "../data/membershipEstimate";
import { HOURS_LABEL } from "../data/site";
import { coachingGraph, eventsGraph, juniorsGraph, membershipGraph, swingEvaluationGraph, tournamentGraph } from "../data/schema";

const MEMBERSHIP_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "flag.png", title: "Ease of Mind", line: `One simple ${money(PRICES.unlimitedMonthly)}/mo plan. No surprises.` },
  { icon: "cart.png", title: "Flexible Schedule", line: `Open ${HOURS_LABEL}, up to an hour a day.` },
  { icon: "bag.png", title: "Top Equipment", line: "Premium clubs are on hand." },
  {
    icon: "swing.png",
    title: "Awesome Gaming Tech",
    line: `Full Swing simulators, ${SIMULATOR_COURSE_COUNT}+ courses, and shot analytics.`,
  },
];

const COACHING_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "swing.png", title: "30 minutes", line: "One private lesson." },
  { icon: "club-strike.png", title: "PGA coaches", line: "On Full Swing simulators." },
  { icon: "bag.png", title: "10-pack", line: "Ten private lessons." },
  { icon: "crossed-clubs.png", title: "Four bays", line: "Clubs on hand." },
];

const JUNIORS_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "flag.png", title: "Once a week", line: "$249 a month." },
  { icon: "swing.png", title: "Twice a week", line: "$399 a month." },
  { icon: "club-strike.png", title: "One hour", line: "Each session." },
  { icon: "bag.png", title: "Clubs on hand", line: "Same Full Swing bays." },
];

const SWING_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "swing.png", title: `${PRICES.swingEvaluationMinutes} minutes`, line: "On the cameras." },
  { icon: "club-strike.png", title: "Full Swing", line: "Swing-evaluation cameras." },
  { icon: "crossed-clubs.png", title: "PGA coaches", line: "Before a lesson pack." },
  { icon: "bag.png", title: "Four bays", line: "Clubs on hand." },
];

const EVENTS_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "flag.png", title: "Price on request", line: "Tell us the date and the group." },
  { icon: "club-strike.png", title: "Four enclosed bays", line: "Each bay holds up to 6 guests." },
  { icon: "swing.png", title: "A golf pro", line: "Mini-lessons and casual games." },
  { icon: "bag.png", title: "Clubs on hand", line: "Complimentary clubs. Food can be brought in." },
];

export function MembershipPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={membershipGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Membership" />
              <DisplayTitle as="h1" className="offer-title play-title" text="The membership that rewards your passion more!" accent="passion" />
            </>
          }
          buy={<MembershipCalculator />}
          story={
            <>
              <OfferFacts
                heading="How membership works"
                items={[
                  { q: "The plan", a: `Unlimited Practice is ${money(PRICES.unlimitedMonthly)} a month.` },
                  { q: "The hour", a: "Up to one hour a day, on a Full Swing bay." },
                  { q: "The studio", a: `${SIMULATOR_COURSE_COUNT}+ courses. Premium clubs on hand. Open ${HOURS_LABEL}.` },
                ]}
              />
              <WhatYouGet items={MEMBERSHIP_GET} />
              <p className="mt-8 text-lg">
                <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("coaching")}>
                  Golf lessons in Somerset
                </a>
              </p>
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

export function CoachingPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={coachingGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Golf lessons" />
              <DisplayTitle as="h1" className="offer-title play-title" text="Swing your way to your first birdie and hole in one!" accent="birdie" />
            </>
          }
          buy={<CoachingPanel />}
          story={
            <>
              <p className="text-lg leading-relaxed">
                {`A swing evaluation is ${money(PRICES.swingEvaluation)} for ${PRICES.swingEvaluationMinutes} minutes on the Full Swing cameras. Start there, or go straight to a lesson.`}
              </p>
              <p className="mt-3 text-lg">
                <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("swing-evaluation")}>
                  Swing evaluation
                </a>
              </p>
              <OfferFacts
                heading="How a lesson works"
                items={[
                  { q: "One lesson", a: `${money(PRICES.lessonSingle)} for ${PRICES.lessonMinutes} minutes with a PGA professional.` },
                  { q: "10-pack", a: `${money(PRICES.lessonPack10)} for ten private lessons.` },
                  { q: "Where", a: "On the Full Swing simulators. Premium clubs are on hand." },
                ]}
              />
              <WhatYouGet items={COACHING_GET} />
              <p className="mt-10 text-lg">
                <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("membership")}>
                  Indoor golf membership
                </a>
              </p>
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

export function SwingEvaluationPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={swingEvaluationGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Swing evaluation" />
              <DisplayTitle as="h1" className="offer-title play-title" text="Swing evaluation" accent="evaluation" />
            </>
          }
          buy={<SwingEvaluation />}
          story={<WhatYouGet items={SWING_GET} />}
        />
      </article>
    </PageFrame>
  );
}

export function JuniorsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={juniorsGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Golf for Kids" />
              <DisplayTitle as="h1" className="offer-title play-title" text="Golf for Kids" accent="Kids" />
            </>
          }
          buy={<JuniorsPanel />}
          story={
            <>
              <OfferFacts
                heading="How junior golf works"
                items={[
                  { q: "Once a week", a: `${money(PRICES.juniorOneLessonWeekly)} a month. One hour each session.` },
                  { q: "Twice a week", a: `${money(PRICES.juniorTwoLessonsWeekly)} a month. One hour each session.` },
                  { q: "The bay", a: "The same Full Swing simulators. Premium clubs on hand." },
                ]}
              />
              <WhatYouGet items={JUNIORS_GET} />
              <StillGrid photos={JUNIORS_GALLERY} />
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

export function EventsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={eventsGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Events" />
              <DisplayTitle
                as="h1"
                className="offer-title play-title"
                text="Golf simulator parties and events"
                accent="events"
              />
            </>
          }
          buy={<EventsPanel />}
          story={
            <>
              <OfferFacts
                heading="How an event works"
                items={[
                  { q: "Length", a: "2, 3, or 6 hours. Package price on request." },
                  { q: "The room", a: "Four enclosed bays. Each bay holds up to 6 guests." },
                  { q: "On site", a: "A golf pro for mini-lessons and casual games. Clubs are complimentary. Food can be brought in." },
                ]}
              />
              <WhatYouGet items={EVENTS_GET} />
              <div className="mt-16">
                <EventTypeList />
              </div>
              <div className="mt-8">
                <EventGallery />
              </div>
              <p className="mt-8">
                <a href={pageHref("")} className={`inline-flex min-h-11 items-center text-lg font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`}>
                  Back to the landing page
                </a>
              </p>
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

export function TournamentPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={tournamentGraph()} />
        <OfferLayout
          title={<Breadcrumbs current="Fall League" />}
          buy={<TournamentPanel />}
          story={
            <>
              <OfferFacts
                heading="How the league works"
                items={[
                  { q: "The round", a: "18 holes. Entry price on request." },
                  { q: "The tag", a: "A League Player tag is required." },
                  { q: "The bay", a: `Full Swing simulators, ${SIMULATOR_COURSE_COUNT}+ courses, open ${HOURS_LABEL}.` },
                ]}
              />
              <PageBento page="tournament" />
              <div className="mt-10">
                <TournamentForm />
              </div>
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

export function NotFoundPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <h1 className="font-display text-4xl font-semibold tracking-tight">That page is not here.</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed">Try the membership page, or go back to the start.</p>
        <CtaPair className="mt-8">
          <a
            href={pageHref("membership")}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 text-base font-semibold text-accent-foreground ${buttonFocus}`}
          >
            Membership
          </a>
          <a
            href={pageHref("")}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-ink bg-white px-5 text-base font-semibold text-ink ${buttonFocus}`}
          >
            Home
          </a>
        </CtaPair>
      </article>
    </PageFrame>
  );
}
