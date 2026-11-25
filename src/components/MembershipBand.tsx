import { AskUsLink } from "./AskUsLink";
import { CtaAnchor, MembershipLink } from "./Cta";
import { pageHref } from "../data/routes";
import { DisplayTitle } from "./DisplayTitle";
import { MembershipBento } from "./MembershipBento";
import { MEMBERSHIP_POSTER } from "../data/films";

function MembershipStill() {
  return (
    <div className="membership-film__still">
      <img
        src={MEMBERSHIP_POSTER.src}
        alt={MEMBERSHIP_POSTER.alt}
        width={MEMBERSHIP_POSTER.width}
        height={MEMBERSHIP_POSTER.height}
        decoding="async"
        className="membership-film__still-img"
      />
    </div>
  );
}

/** Title, benefit grid, CTAs, then the phone line, over the membership still. */
function MembershipStage() {
  return (
    <div className="membership-film relative overflow-hidden bg-void text-white">
      <MembershipStill />
      <div className="membership-film__shade" aria-hidden="true" />
      <div className="membership-film__overlay pointer-events-none relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 @3xl:gap-8 @3xl:px-10 @3xl:py-14">
        <div className="pointer-events-auto">
          <DisplayTitle
            as="h2"
            className="section-title section-title--on-dark offer-title display-title--on-dark"
            text="Membership"
            accent="Membership"
          />
        </div>
        <div className="pointer-events-auto membership-film__grid w-full">
          <MembershipBento />
        </div>
        <div className="pointer-events-auto membership-film__intro w-full max-w-md">
          <div className="grid w-full grid-cols-1 gap-3">
            <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
            <CtaAnchor href={pageHref("members-day")} tone="inverted" className="w-full">
              Try a free members day
            </CtaAnchor>
          </div>
        </div>
        <AskUsLink className="pointer-events-auto" />
      </div>
    </div>
  );
}

export function MembershipBand() {
  return (
    <section id="membership" className="membership-band scroll-mt-32">
      <MembershipStage />
    </section>
  );
}
