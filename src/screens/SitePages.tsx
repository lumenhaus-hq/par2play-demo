import { CoachingPanel } from "../components/CoachingPanel";
import { EventsPanel } from "../components/EventsPanel";
import { JuniorsPanel } from "../components/JuniorsPanel";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { SwingEvaluation } from "../components/SwingEvaluation";
import { TournamentPanel } from "../components/TournamentPanel";
import { EventGallery, StillGrid } from "../components/PhotoStrips";
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
  { icon: "swing.png", title: "30 minutes", line: "On the cameras." },
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
        <Breadcrumbs current="Membership" />
        <DisplayTitle as="h1" className="offer-title play-title" text="Become a Member" accent="Member" />
        <MembershipCalculator />
        <WhatYouGet items={MEMBERSHIP_GET} />
        <p className="mt-8 text-lg">
          <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("coaching")}>
            Golf lessons in Somerset
          </a>
        </p>
      </article>
    </PageFrame>
  );
}

export function CoachingPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={coachingGraph()} />
        <Breadcrumbs current="Golf lessons" />
        <DisplayTitle as="h1" className="offer-title play-title" text="Golf lessons in Somerset, NJ" accent="lessons" />
        <CoachingPanel />
        <WhatYouGet items={COACHING_GET} />
        <p className="mt-10 text-lg">
          <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("membership")}>
            Indoor golf membership
          </a>
        </p>
      </article>
    </PageFrame>
  );
}

export function SwingEvaluationPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={swingEvaluationGraph()} />
        <Breadcrumbs current="Swing evaluation" />
        <DisplayTitle as="h1" className="offer-title play-title" text="Swing evaluation" accent="evaluation" />
        <SwingEvaluation />
        <WhatYouGet items={SWING_GET} />
      </article>
    </PageFrame>
  );
}

export function JuniorsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={juniorsGraph()} />
        <Breadcrumbs current="Golf for Kids" />
        <DisplayTitle as="h1" className="offer-title play-title" text="Golf for Kids" accent="Kids" />
        <JuniorsPanel />
        <WhatYouGet items={JUNIORS_GET} />
        <StillGrid photos={JUNIORS_GALLERY} />
      </article>
    </PageFrame>
  );
}

export function EventsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={eventsGraph()} />
        <Breadcrumbs current="Events" />
        <DisplayTitle
          as="h1"
          className="offer-title play-title"
          text="Golf simulator parties and events"
          accent="events"
        />
        <EventsPanel />
        <WhatYouGet items={EVENTS_GET} />
        <div className="mt-16">
          <EventTypeList />
        </div>
        <div className="mt-8">
          <EventGallery />
        </div>
        <p className="mt-8 text-lg text-[#4B5563]">2, 3, or 6 hour bookings. Package price on request.</p>
        <p className="mt-8">
          <a href={pageHref("")} className={`inline-flex min-h-11 items-center text-lg font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`}>
            Back to the landing page
          </a>
        </p>
      </article>
    </PageFrame>
  );
}

export function TournamentPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={tournamentGraph()} />
        <Breadcrumbs current="Fall League" />
        <TournamentPanel />
        <PageBento page="tournament" />
        <p className="mx-auto mt-10 max-w-xl text-center text-lg text-[#4B5563]">18 holes per round. Entry price on request.</p>
        <div className="mt-10">
          <TournamentForm />
        </div>
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
