import { AskUsLink } from "./AskUsLink";
import { CtaAnchor, CtaPair, MembershipLink } from "./Cta";
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
    <div className="membership-film membership-film--contrast relative overflow-hidden bg-void text-ink">
      <MembershipStill />
      <div className="membership-film__shade" aria-hidden="true" />
      <div className="membership-film__overlay pointer-events-none relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 @3xl:gap-8 @3xl:px-10 @3xl:py-14">
        <div className="pointer-events-auto membership-film__heading">
          <DisplayTitle
            as="h2"
            className="section-title offer-title"
            text="Membership"
            accent="Membership"
          />
          <p className="membership-film__lead mt-3 max-w-sm font-display text-xl font-semibold leading-snug tracking-tight">
            Bay priority. Shot data. Hours that bend around your day.
          </p>
        </div>
        <div className="pointer-events-auto membership-film__grid w-full">
          <MembershipBento />
        </div>
        <div className="pointer-events-auto membership-film__intro w-full max-w-lg">
          <CtaPair>
            <MembershipLink className="cta-sheen w-full min-w-[12rem]">Become a Member</MembershipLink>
            <CtaAnchor href={pageHref("members-day")} tone="line" className="w-full min-w-[12rem]">
              Free members day
            </CtaAnchor>
          </CtaPair>
        </div>
        <AskUsLink className="pointer-events-auto membership-film__ask" />
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
