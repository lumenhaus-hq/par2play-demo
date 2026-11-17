import { Clock3, Layers3 } from "lucide-react";
import { CoachingPanel } from "../components/CoachingPanel";
import { EventsPanel } from "../components/EventsPanel";
import { JuniorsPanel } from "../components/JuniorsPanel";
import { MembershipCalculator } from "../components/MembershipCalculator";
import { TournamentPanel } from "../components/TournamentPanel";
import { EventGallery, StillGrid } from "../components/PhotoStrips";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { trackAnchor } from "../analytics/track";
import { BookLink, CtaPair, buttonFocus } from "../components/Cta";
import { TournamentForm } from "../components/TournamentForm";
import { OCLOCK, PRICES } from "../data/business";
import { formatPrice, money } from "../data/membershipEstimate";
import { PUBLISHED_COACHES } from "../data/coaches";
import { EventTypeList } from "../components/EventTypeList";
import { JUNIORS_GALLERY } from "../data/gallery";
import { pageHref } from "../data/routes";
import { JsonLd } from "../components/JsonLd";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { coachingGraph, eventsGraph, juniorsGraph, membershipGraph, tournamentGraph } from "../data/schema";

function CheckoutLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => trackAnchor(event.currentTarget)}
      className={`inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-base font-semibold text-accent-foreground hover:bg-accent-hot hover:text-ink active:bg-accent visited:bg-accent visited:text-ink ${buttonFocus}`}
    >
      {children}
    </a>
  );
}

export function MembershipPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={membershipGraph()} />
        <Breadcrumbs current="Membership" />
        <MembershipCalculator />
        <p className="mt-8 text-base">
          <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("coaching")}>
            Golf lessons in Somerset
          </a>
        </p>
      </article>
    </PageFrame>
  );
}

const lessonTiers = [
  { count: "5 lessons", price: PRICES.lessonPack5 },
  { count: "10 lessons", price: PRICES.lessonPack10 },
  { count: "20 lessons", price: PRICES.lessonPack20 },
  { count: "30 lessons", price: PRICES.lessonPack30 },
  { count: "50 lessons", price: PRICES.lessonPack50 },
] as const;

const fittingChoices = ["Driver", "Irons", "Wedges", "Full bag"] as const;

export function CoachingPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={coachingGraph()} />
        <Breadcrumbs current="Golf lessons" />
        <CoachingPanel />
        <p className="mt-10 max-w-2xl text-base leading-relaxed">Two PGA professional coaches, Nick Schiavo and Nick Monticello.</p>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Lesson packs</h2>
        <ul aria-label="Lesson pack prices" className="mt-6 grid auto-rows-fr grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-5">
          {lessonTiers.map((tier) => (
            <li key={tier.count} className="rounded-3xl border border-ink/15 bg-white p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#E4F3E8] text-[#17743B]"><Layers3 aria-hidden="true" className="size-5" strokeWidth={1.7} /></span>
              <p className="mt-5 text-sm font-semibold text-[#4B5563]">{tier.count}</p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">{money(tier.price)}</p>
              <p className="mt-5 flex items-center gap-2 border-t border-ink/10 pt-4 text-sm text-[#4B5563]"><Clock3 aria-hidden="true" className="size-4 shrink-0" />{PRICES.lessonMinutes} min / lesson</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <CheckoutLink href={OCLOCK.lessonPacks}>See lesson packs</CheckoutLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Club fitting</h2>
        <p className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight">{formatPrice(PRICES.fitting)}</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
          {fittingChoices.map((choice) => (
            <li key={choice} className="text-base font-semibold">
              {choice}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <BookLink offer="fitting">Get fitted</BookLink>
        </div>
        <h2 className="mt-16 font-display text-3xl font-semibold tracking-tight">Instructors on par2play.com</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed">
          The live site publishes these two biographies. It does not publish a biography for Sean.{" "}
          <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("membership")}>
            Indoor golf membership
          </a>
        </p>
        <div className="mt-6 grid gap-6 @3xl:grid-cols-2">
          {PUBLISHED_COACHES.map((coach) => (
            <article id={coach.id} key={coach.id} className="border-2 border-ink bg-white p-5">
              <h3 className="font-display text-2xl font-semibold">{coach.name}</h3>
              <p className="mt-3 text-base leading-relaxed">{coach.line}</p>
            </article>
          ))}
        </div>
      </article>
    </PageFrame>
  );
}

export function JuniorsPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={juniorsGraph()} />
        <Breadcrumbs current="Junior golf" />
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
        <div className="mt-16">
          <EventTypeList />
        </div>
        <div className="mt-8">
          <EventGallery />
        </div>
        <p className="mt-8 text-base text-[#4B5563]">2-hour or 3-hour bookings. Package price on request.</p>
        <p className="mt-8">
          <a href={pageHref("")} className={`inline-flex min-h-11 items-center text-base font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`}>
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
        <p className="mx-auto mt-10 max-w-xl text-center text-base text-[#4B5563]">18 holes per round. Entry price on request.</p>
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
        <p className="mt-4 max-w-xl text-base leading-relaxed">Try the membership page, or go back to the start.</p>
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
