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
                  { q: "Just show up", a: "Walk in whenever you like. No bag required — clubs are waiting." },
                  { q: "Settle in", a: "Take your time getting comfortable in the bay. No rush, no pressure." },
                  {
                    q: "Then it opens up",
                    a: `A ton of courses, clubs, and unique experiences to choose from — that first pure strike hits different.`,
                  },
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
                  { q: "Just show up", a: "Come as you are. Clubs are on hand, and your coach meets you at the bay." },
                  { q: "Ease into it", a: "Take a few warm swings. Get comfortable before the real work starts." },
                  {
                    q: "Then it clicks",
                    a: "One clean strike with the numbers to prove it — the kind of aha that makes you want the next lesson.",
                  },
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
                  { q: "Just show up", a: "Kids walk in, pick a club, and meet their coach. No fuss." },
                  { q: "Settle in", a: "Take your time getting comfortable — staff stay with them in the bay." },
                  {
                    q: "Then the spark",
                    a: "Courses, games, and that first joyful strike when golf suddenly feels like theirs.",
                  },
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
                  { q: "Just show up", a: "Your group walks in together. Clubs are complimentary — no gear stress." },
                  { q: "Settle in", a: "Take your time getting comfortable across the bays. Music on, snacks welcome." },
                  {
                    q: "Then the room lights up",
                    a: "Courses, mini-lessons, and contests — that moment when the whole group erupts on one great shot.",
                  },
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
                  { q: "Just show up", a: "Walk in for your round. Clubs on hand if you leave the bag at home." },
                  { q: "Find your rhythm", a: "Take your time getting comfortable — eighteen holes, your pace." },
                  {
                    q: "Then the rush",
                    a: `A ton of courses and that huge aha when a perfect strike decides the leaderboard.`,
                  },
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
