import { AskUsLink } from "../components/AskUsLink";
import { BookLink } from "../components/Cta";
import { DaySteps } from "../components/DaySteps";
import { DisplayTitle } from "../components/DisplayTitle";
import { JsonLd } from "../components/JsonLd";
import { OfferFacts } from "../components/OfferFacts";
import { OfferLayout } from "../components/OfferLayout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { WhatYouGet, type GetCard } from "../components/WhatYouGet";
import { SIMULATOR_COURSE_COUNT } from "../data/business";
import { PHOTOS } from "../data/photos";
import { membersDayGraph } from "../data/schema";
import { HOURS_LABEL } from "../data/site";

const DAY_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "swing.png", title: "Full Swing", line: "A simulator bay for the visit." },
  { icon: "flag.png", title: "Courses", line: `${SIMULATOR_COURSE_COUNT}+ courses on the sim.` },
  { icon: "bag.png", title: "Clubs", line: "Premium clubs are on hand." },
  { icon: "club-strike.png", title: "Shot data", line: "Every swing shows up on the screen." },
];

export function MembersDayPage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={membersDayGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Free members day" />
              <DisplayTitle as="h1" className="offer-title play-title" text="Try a free members day" accent="free" />
            </>
          }
          buy={
            <header className="swing-hero">
              <p className="swing-hero__price">Free</p>
              <p className="swing-hero__length">One members day. Somerset, NJ.</p>
              <div className="swing-hero__cta">
                <BookLink className="w-full" offer="bay">
                  Complete booking
                </BookLink>
                <AskUsLink />
              </div>
            </header>
          }
          story={
            <>
              <DaySteps
                steps={[
                  {
                    photo: PHOTOS.storefront,
                    title: "Arrive",
                    line: "Come in and meet the members. The day runs like a member visit.",
                  },
                  {
                    photo: PHOTOS.clubRack,
                    title: "Pick up a club",
                    line: "Premium clubs are on hand. Bring your own if you prefer.",
                  },
                  {
                    photo: PHOTOS.bays,
                    title: "Play the sim",
                    line: `Full Swing simulators and ${SIMULATOR_COURSE_COUNT}+ courses.`,
                  },
                  {
                    photo: PHOTOS.range,
                    title: "Watch the shots",
                    line: "Shot data is on the screen for every swing.",
                  },
                  {
                    photo: PHOTOS.lounge,
                    title: "Use the hour",
                    line: `Members play up to an hour a day. The studio is open ${HOURS_LABEL}.`,
                  },
                ]}
              />
              <WhatYouGet items={DAY_GET} />
              <OfferFacts
                heading="Before you come"
                items={[
                  { q: "Where", a: "695 Hamilton Street, Suite G, Somerset, NJ 08873." },
                  { q: "When", a: `Open ${HOURS_LABEL}.` },
                  { q: "Call", a: "(732) 448-2769." },
                ]}
              />
            </>
          }
        />
      </article>
    </PageFrame>
  );
}
