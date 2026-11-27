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
import { PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { money } from "../data/membershipEstimate";
import { membersDayGraph } from "../data/schema";

const DAY_GET: readonly [GetCard, GetCard, GetCard, GetCard] = [
  { icon: "flag.png", title: "Arrive", line: "Come in and meet the members." },
  { icon: "bag.png", title: "Pick up a club", line: "Premium clubs are on hand." },
  { icon: "swing.png", title: "Play the sim", line: `Full Swing simulators and ${SIMULATOR_COURSE_COUNT}+ courses.` },
  { icon: "club-strike.png", title: "Shot data", line: "Every swing shows up on the screen." },
];

const DAY_TITLE = "Experience a Member's Day";

type DayChoice = "day";

function MembersDayOffer() {
  const [choice, setChoice] = useState<DayChoice>("day");
  const was = PRICES.membersDayValue == null ? undefined : money(PRICES.membersDayValue);
  const live = was
    ? `${DAY_TITLE}. You pay zero dollars. Regular price: ${was}.`
    : `${DAY_TITLE}. You pay zero dollars.`;

  return (
    <OfferSheet
      id="members-day-offer"
      toggleLabel="Members day"
      value={choice}
      onChange={setChoice}
      offer="bay"
      options={[{ value: "day", label: "Member’s Day" }]}
      invoice={
        <>
          <CouponConfetti />
          <PriceInvoice
            title={DAY_TITLE}
            rows={[
              { label: "Offer", value: DAY_TITLE },
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
              <Breadcrumbs current="Member’s Day" />
              <DisplayTitle as="h1" className="offer-title play-title" text={DAY_TITLE} accent="Member's Day" />
            </>
          }
          buy={<MembersDayOffer />}
          story={
            <>
              <WhatYouGet items={DAY_GET} />
              <OfferFacts
                heading="Before you come"
                items={[
                  { q: "Just show up", a: "Walk in for your visit. No membership yet — just curiosity." },
                  { q: "Settle in", a: "Take your time getting comfortable in the bay. Staff help you start." },
                  {
                    q: "Then you get it",
                    a: "A ton of courses, clubs, and unique experiences — the joyful aha that makes membership make sense.",
                  },
                ]}
              />
            </>
          }
        />
      </article>
    </PageFrame>
  );
}
