import { useState } from "react";
import { DisplayTitle } from "../components/DisplayTitle";
import { JsonLd } from "../components/JsonLd";
import { OfferFacts } from "../components/OfferFacts";
import { OfferLayout } from "../components/OfferLayout";
import { OfferSheet } from "../components/OfferSheet";
import { Photo } from "../components/Media";
import { PriceInvoice } from "../components/PriceInvoice";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { WhatYouGet, type GetCard } from "../components/WhatYouGet";
import { PRICES } from "../data/business";
import { money } from "../data/membershipEstimate";
import { PHOTOS } from "../data/photos";
import { juniorExperienceGraph } from "../data/schema";

const JUNIOR_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "swing.png", title: "The bay", line: "A Full Swing simulator." },
  { icon: "bag.png", title: "Clubs", line: "Premium clubs are on hand." },
  { icon: "club-strike.png", title: "Coaches", line: "PGA professionals on site." },
  { icon: "flag.png", title: "Shot data", line: "Every swing shows up on the screen." },
];

type Visit = "visit";

function JuniorExperienceOffer() {
  const [choice, setChoice] = useState<Visit>("visit");
  const was = PRICES.juniorSessionValue == null ? undefined : money(PRICES.juniorSessionValue);
  const live = was
    ? `Junior golf experience. You pay FREE. ${was} is struck through.`
    : "Junior golf experience. You pay FREE.";

  return (
    <OfferSheet
      id="junior-experience-offer"
      toggleLabel="Junior session"
      value={choice}
      onChange={setChoice}
      offer="junior-experience"
      options={[{ value: "visit", label: "Junior session", price: "Free" }]}
      invoice={
        <PriceInvoice
          title="Junior golf experience"
          rows={[
            { label: "Offer", value: "Junior golf experience" },
            { label: "Bay", value: "Full Swing simulator" },
            { label: "Clubs", value: "Premium clubs on hand" },
          ]}
          totalLabel="FREE"
          was={was}
          live={live}
        />
      }
    />
  );
}

export function JuniorExperiencePage() {
  return (
    <PageFrame>
      <article className={pageSpace}>
        <JsonLd data={juniorExperienceGraph()} />
        <OfferLayout
          title={
            <>
              <Breadcrumbs current="Junior experience" />
              <div className="free-hero">
                <span className="free-hero__gift" aria-hidden="true">
                  <Gift />
                </span>
                <span className="free-hero__bits" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <DisplayTitle as="h1" className="offer-title play-title" text="Experience golf for juniors" accent="juniors" />
              </div>
            </>
          }
          buy={<JuniorExperienceOffer />}
          story={
            <>
              <OfferFacts
                heading="What to expect"
                items={[
                  { q: "Just show up", a: "Kids walk in, grab a club, and meet the coach. Easy from the start." },
                  { q: "Settle in", a: "Take your time getting comfortable — staff stay close in the bay." },
                  {
                    q: "Then the spark",
                    a: "Courses, games, and that 10x joyful moment when a clean strike lights up their face.",
                  },
                ]}
              />
              <WhatYouGet items={JUNIOR_GET} />
              <figure className="offer-still">
                <Photo photo={PHOTOS.juniorGroup} />
              </figure>
            </>
          }
        />
      </article>
    </PageFrame>
  );
}

function Gift() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path
        fill="currentColor"
        d="M12 7.2c.8-1.7 3.2-2 4-.7.5.8.2 1.6-.4 2.1h2.2c.7 0 1.2.6 1.2 1.3v1.6H5V9.9c0-.7.5-1.3 1.2-1.3h2.2c-.6-.5-.9-1.3-.4-2.1.8-1.3 3.2-1 4 .7ZM5.4 13h6.1v7.2H6.6c-.7 0-1.2-.6-1.2-1.3V13Zm7.1 0h6.1v5.9c0 .7-.5 1.3-1.2 1.3h-4.9V13Z"
      />
    </svg>
  );
}
