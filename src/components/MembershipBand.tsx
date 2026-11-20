import { MembershipLink } from "./Cta";
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

function MembershipIntro() {
  return (
    <header className="membership-film__intro">
      <h2 className="section-title section-title--on-dark offer-title text-4xl @5xl:text-6xl">Membership</h2>
      <div className="mt-5 grid w-full max-w-md grid-cols-1 gap-3">
        <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
        <MembershipLink className="w-full" tone="inverted">
          Experience a free Member Day
        </MembershipLink>
      </div>
    </header>
  );
}

/** Title, CTAs, and bento grid stacked over the membership still. */
function MembershipStage() {
  return (
    <div className="membership-film relative overflow-hidden bg-void text-white">
      <MembershipStill />
      <div className="membership-film__shade" aria-hidden="true" />
      <div className="membership-film__overlay pointer-events-none relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 @3xl:gap-8 @3xl:px-10 @3xl:py-14">
        <div className="pointer-events-auto w-full max-w-md">
          <MembershipIntro />
        </div>
        <div className="pointer-events-auto membership-film__grid w-full">
          <MembershipBento />
        </div>
      </div>
    </div>
  );
}

export function MembershipBand() {
  return (
    <section id="membership" className="scroll-mt-32">
      <MembershipStage />
    </section>
  );
}
