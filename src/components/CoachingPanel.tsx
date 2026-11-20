import { useState } from "react";
import { BookingCheckout, appendCheckoutParams } from "./BookingCheckout";
import { JointToggle } from "./JointToggle";
import { PricingHero } from "./PricingHero";
import { OCLOCK, PRICES } from "../data/business";
import { COACHING_FILM } from "../data/films";
import { money } from "../data/membershipEstimate";

type Mode = "single" | "pack";

const OPTIONS = [
  { value: "single", label: "1 Lesson" },
  { value: "pack", label: "10 Pack" },
] as const;

export function CoachingPanel() {
  const [mode, setMode] = useState<Mode>("pack");
  const pack = mode === "pack";
  const figure = pack ? money(PRICES.lessonPack10) : money(PRICES.lessonSingle);
  const heading = pack ? "10 Pack" : "Single lesson";
  const live = pack
    ? `10 Pack ${figure}. Ten private lessons. Save more by buying a 10 pack.`
    : `Single lesson ${figure}. ${PRICES.lessonMinutes} minutes with a PGA professional.`;
  const access = pack ? "10 private lessons" : `${PRICES.lessonMinutes} minutes`;
  const offerParam = pack ? "lesson_pack_10" : "private_lesson";
  const orderRef = pack ? "ord_p2p_lesson_pack_10" : "ord_p2p_private_lesson";
  const checkoutBase = pack ? OCLOCK.lessonPacks : OCLOCK.lessons;
  const note = pack ? "Save more by buying a 10 pack." : `${PRICES.lessonMinutes}-minute private lesson.`;

  return (
    <PricingHero
      id="coaching-offer"
      pageTitle="Golf lessons in Somerset, NJ"
      heading={heading}
      figure={figure}
      live={live}
      film={COACHING_FILM}
      primary={{ offer: "swing-evaluation", label: "Book swing evaluation" }}
      secondary={{ offer: pack ? "lesson-pack" : "lesson", label: "Book lessons" }}
      selector={<JointToggle value={mode} options={OPTIONS} onChange={setMode} label="Lesson offer" tone="dark" />}
      comparison={<p className="text-lg font-semibold text-white/85">{note}</p>}
      checkout={
        <BookingCheckout
          summaryTitle={heading}
          rows={[
            { label: "Offer", value: heading },
            { label: "Session", value: access },
            { label: "Billing", value: pack ? "One-time pack" : "One-time" },
            { label: "Price", value: figure },
          ]}
          totalLabel={figure}
          orderRef={orderRef}
          checkoutHref={(fields) => appendCheckoutParams(checkoutBase, fields, offerParam)}
        />
      }
    />
  );
}
