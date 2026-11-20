import { useState } from "react";
import { CouponConfetti } from "../components/CouponConfetti";
import { DisplayTitle } from "../components/DisplayTitle";
import { JsonLd } from "../components/JsonLd";
import { OfferFacts } from "../components/OfferFacts";
import { OfferLayout } from "../components/OfferLayout";
import { OfferSheet } from "../components/OfferSheet";
import { PriceInvoice } from "../components/PriceInvoice";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import { WhatYouGet, type GetCard } from "../components/WhatYouGet";
import { ADDRESS_LINE, PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { money } from "../data/membershipEstimate";
import { membersDayGraph } from "../data/schema";
import { HOURS_LABEL } from "../data/site";

const DAY_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "flag.png", title: "Arrive", line: "Come in and meet the members." },
  { icon: "bag.png", title: "Pick up a club", line: "Premium clubs are on hand." },
  { icon: "swing.png", title: "Play the sim", line: `Full Swing simulators and ${SIMULATOR_COURSE_COUNT}+ courses.` },
  { icon: "club-strike.png", title: "Shot data", line: "Every swing shows up on the screen." },
];

type DayChoice = "day";

function MembersDayOffer() {
  const [choice, setChoice] = useState<DayChoice>("day");
  const was = PRICES.membersDayValue == null ? undefined : money(PRICES.membersDayValue);
  const live = was
    ? `Free members day. You pay FREE. ${was} is struck through.`
    : "Free members day. You pay FREE.";

  return (
    <OfferSheet
      id="members-day-offer"
      toggleLabel="Members day"
      value={choice}
      onChange={setChoice}
      offer="bay"
      options={[{ value: "day", label: "Members day", price: "Free", note: "FREE", noteIcon: "gift" }]}
      invoice={
        <>
          <CouponConfetti />
          <PriceInvoice
            title="Free members day"
            rows={[
              { label: "Offer", value: "Free members day" },
              { label: "Time", value: "Up to one hour" },
              { label: "Bay", value: "Full Swing simulator" },
            ]}
            totalLabel="FREE"
            was={was}
            live={live}
          />
        </>
      }
    />
  );
}

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
          buy={<MembersDayOffer />}
          story={
            <>
              <WhatYouGet items={DAY_GET} />
              <OfferFacts
                heading="Before you come"
                items={[
                  { q: "The hour", a: "Members play up to an hour a day." },
                  { q: "Where", a: `${ADDRESS_LINE}.` },
                  { q: "When", a: `Open ${HOURS_LABEL}.` },
                ]}
              />
            </>
          }
        />
      </article>
    </PageFrame>
  );
}
