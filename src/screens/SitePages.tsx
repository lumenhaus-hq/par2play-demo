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
import { coachingGraph, eventsGraph, juniorsGraph, membershipGraph, swingEvaluationGraph, tournamentGraph } from "../data/schema";

function PageTitle({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="play-intro">
      <h1 className="offer-title play-title">{title}</h1>
      <p className="play-lead">{lead}</p>
    </header>
  );
}

export function MembershipPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={membershipGraph()} />
        <Breadcrumbs current="Membership" />
        <PageTitle title="Become a Member" lead="Unlimited Practice. Up to one hour a day." />
        <PageBento page="membership" />
        <MembershipCalculator />
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
        <PageTitle title="Golf lessons in Somerset, NJ" lead="A private lesson, or a 10-pack." />
        <PageBento page="coaching" />
        <CoachingPanel />
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
        <SwingEvaluation />
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
        <PageTitle title="Golf for Kids" lead="Once a week, or twice." />
        <PageBento page="juniors" />
        <JuniorsPanel />
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
        <EventsPanel />
        <PageBento page="events" />
        <div className="mt-16">
          <EventTypeList />
        </div>
        <div className="mt-8">
          <EventGallery />
        </div>
        <p className="mt-8 text-lg text-[#4B5563]">2-hour or 3-hour bookings. Package price on request.</p>
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
