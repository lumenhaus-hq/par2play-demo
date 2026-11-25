import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, Shield, Target, UserRound } from "lucide-react";
import { bindHeroWatch } from "../audio/soundtrack";
import { CtaAnchor, CtaPair, HeroMembershipAction, MembershipLink } from "../components/Cta";
import { HeroProof } from "../components/HeroProof";
import { HeroTryNow } from "../components/HeroTryNow";
import { MembershipBand } from "../components/MembershipBand";
import { HeroVideo, type HeroIntroPhase } from "../components/Media";
import { PageAtmosphere } from "../components/PageAtmosphere";
import { ScrollReveal } from "../components/ScrollReveal";
import { TournamentForm } from "../components/TournamentForm";
import { EventTypeList } from "../components/EventTypeList";
import { OfferTicker } from "../components/OfferTicker";
import { VideoSlot } from "../components/VideoSlot";
import { ValuePoint } from "../components/ValuePoint";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { HERO_TICKER } from "../data/heroTicker";
import { DisplayTitle } from "../components/DisplayTitle";
import { HeroLocation, HeroTitle } from "../components/HeroTitle";
import type { HeroTypeId } from "../data/heroType";
import { JsonLd } from "../components/JsonLd";
import { FaqSection } from "../components/FaqSection";
import { faqGraph, homeGraph } from "../data/schema";
import { JUNIORS_FILM, MEMBERSHIP_POSTER } from "../data/films";
import { SITE_NAV, pageHref } from "../data/routes";
import { useFlow } from "../state/flow";

const sectionSpace = "scroll-mt-32 px-6 py-20 @3xl:px-12 @3xl:py-24";

export function Landing({ heroType = "plate" }: { heroType?: HeroTypeId }) {
  const flow = useFlow();
  const [active, setActive] = useState<string | null>(null);
  const [intro, setIntro] = useState<HeroIntroPhase>("arrived");
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobile = flow.layout === "mobile";
  const scroll = mobile ? "h-full overflow-y-auto" : "";
  const chromeReady = intro === "expand" || intro === "arrived";

  const onPhase = useCallback((phase: HeroIntroPhase) => {
    setIntro(phase);
  }, []);

  useEffect(() => bindHeroWatch("hero", mobile ? scrollRef.current : null), [mobile]);

  useEffect(() => {
    const root = mobile ? scrollRef.current : null;
    if (!chromeReady) {
      if (root) root.scrollTo(0, 0);
      else window.scrollTo(0, 0);
      return;
    }
    const nodes = SITE_NAV.map((item) => document.getElementById(item.slug)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best?.target.id) setActive(best.target.id);
      },
      { root, rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const node of nodes) observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [mobile, chromeReady]);

  useEffect(() => {
    if (chromeReady) {
      document.documentElement.classList.remove("hero-scroll-lock");
      return;
    }
    document.documentElement.classList.add("hero-scroll-lock");
    return () => document.documentElement.classList.remove("hero-scroll-lock");
  }, [chromeReady]);

  return (
    <div
      ref={scrollRef}
      data-smooth-root={mobile ? "" : undefined}
      className={`@container page-grid text-base text-ink ${scroll} ${chromeReady ? "" : "overflow-hidden"}`}
    >
      <PageAtmosphere scrollRoot={mobile ? scrollRef : undefined} intensity="base" />
      <div
        data-smooth-content={mobile ? "" : undefined}
        className={`relative z-10 ${mobile ? "flex min-h-full flex-col" : ""}`}
      >
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />
      <SiteHeader active={active} ready={chromeReady} />
      <section
        id="hero"
        className={`hero-shell relative -mt-[4.5rem] flex flex-col overflow-visible bg-ink ${
          mobile ? "min-h-full shrink-0" : "h-svh"
        }`}
        aria-busy={chromeReady ? undefined : true}
      >
        <HeroVideo onPhase={onPhase} />
        <div className="hero-top-shade pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
        <HeroTryNow visible={chromeReady} />
        <div
          data-hero-offer
          className={`hero-offer-dock relative z-10 flex items-end justify-end px-6 pb-3 pt-2 @3xl:px-12 @3xl:pb-6 @3xl:pt-[4.5rem] ${
            chromeReady ? "hero-chrome-in" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={chromeReady ? undefined : true}
        >
          <div className="hero-panel hero-panel-depth hero-offer-card pointer-events-auto flex max-h-full w-full max-w-[36rem] flex-col overflow-hidden rounded-[1.35rem] px-4 py-3 @3xl:px-7 @3xl:py-6">
            <div className="hero-offer-sheen" aria-hidden="true" />
            {/* Body can shrink; CTA stays pinned so phones never crop Bay Rental. */}
            <div className="hero-offer-body relative flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden @3xl:gap-5">
              <div className="hero-stage hero-stage--copy min-w-0 max-w-full shrink" data-hero-type={heroType}>
                <HeroTitle concept={heroType} />
                <HeroLocation concept={heroType} />
              </div>
              <div className="hero-stage hero-stage--proof shrink-0">
                <HeroProof />
              </div>
            </div>
            <div className="hero-stage hero-stage--cta relative z-[1] shrink-0 pt-2 @3xl:pt-3">
              <HeroMembershipAction className="w-full" />
            </div>
          </div>
        </div>
        <div
          className={`relative z-20 shrink-0 ${chromeReady ? "hero-chrome-in hero-chrome-in--late" : "pointer-events-none opacity-0"}`}
          aria-hidden={chromeReady ? undefined : true}
        >
          <OfferTicker items={HERO_TICKER} />
        </div>
      </section>

      <MembershipBand />

      <section id="coaching" className={sectionSpace}>
        <div className="grid items-start gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <ScrollReveal tone="tilt">
            <img
              src={MEMBERSHIP_POSTER.src}
              alt={MEMBERSHIP_POSTER.alt}
              width={MEMBERSHIP_POSTER.width}
              height={MEMBERSHIP_POSTER.height}
              decoding="async"
              className="aspect-video h-auto w-full rounded-[1.15rem] object-cover"
            />
          </ScrollReveal>
          <ScrollReveal tone="rise" delay={80}>
            <DisplayTitle
              as="h2"
              className="section-title offer-title"
              text="Get fitted and swinging!"
              accent="swinging"
            />
            <p className="mt-8 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
              PGA professional coaches for 1:1 lessons and swing evaluations.
            </p>
            <div className="mt-8 grid gap-5">
              <ValuePoint icon={Target} label="1:1 lessons" line="A plan you can track month to month." />
              <ValuePoint
                icon={Activity}
                label="Swing evaluation"
                line="50 minutes on the Full Swing cameras for $100. You leave with the shot data."
              />
            </div>
            <CtaPair className="mt-8">
              <CtaAnchor href={pageHref("swing-evaluation")} className="w-full">
                Swing evaluation
              </CtaAnchor>
              <CtaAnchor href={pageHref("coaching")} tone="line" className="w-full">
                Lessons
              </CtaAnchor>
            </CtaPair>
          </ScrollReveal>
        </div>
      </section>

      <section id="juniors" className={sectionSpace}>
        <div className="grid items-start gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <ScrollReveal tone="rise">
            <VideoSlot
              src={JUNIORS_FILM.src}
              srcMobile={JUNIORS_FILM.srcMobile}
              poster={JUNIORS_FILM.poster}
              posterAlt="A junior golfer swinging in a Par2Play simulator bay"
              className="aspect-video"
              pausable
              framed
              label="Juniors"
            />
          </ScrollReveal>
          <ScrollReveal tone="tilt" delay={80}>
            <DisplayTitle as="h2" className="section-title offer-title" text="Golf for kids" accent="kids" />
            <p className="mt-8 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
              Building the golfers of tomorrow.
            </p>
            <div className="mt-8 grid gap-5">
              <ValuePoint
                icon={UserRound}
                label="Future pros"
                line="1:1 coaching with PGA professionals, once or twice a week."
              />
              <ValuePoint
                icon={Shield}
                label="Supervised care"
                line="Juniors practise under staff supervision in a safe, friendly bay."
              />
              <ValuePoint
                icon={Activity}
                label="Technology-assisted development"
                line="Shot data on every swing shows progress week to week."
              />
            </div>
            <CtaPair className="mt-8">
              <CtaAnchor href={pageHref("juniors")} className="w-full">
                Become a Junior Member
              </CtaAnchor>
              <CtaAnchor href={pageHref("junior-golf-experience")} tone="line" className="w-full">
                Experience golf for juniors
              </CtaAnchor>
            </CtaPair>
          </ScrollReveal>
        </div>
      </section>

      <section id="events" className={sectionSpace}>
        <ScrollReveal tone="sheen">
          <DisplayTitle as="h2" className="section-title offer-title" text="Events" accent="Events" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            Four enclosed bays, with a golf pro for mini-lessons and casual games.
          </p>
          <div className="mt-6">
            <EventTypeList />
          </div>
          <CtaPair className="mt-8">
            <CtaAnchor href={pageHref("events")} className="w-full">
              See events
            </CtaAnchor>
            <CtaAnchor href={pageHref("events")} tone="line" className="w-full">
              Check availability
            </CtaAnchor>
          </CtaPair>
        </ScrollReveal>
      </section>

      <section id="tournament" className={`${sectionSpace} text-center`}>
        <ScrollReveal tone="rise">
          <DisplayTitle
            as="h2"
            className="section-title offer-title mx-auto max-w-xl"
            text="Par2Play Fall League Coming Soon!"
            accent="League"
          />
          <div className="mt-10">
            <TournamentForm />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-void px-6 py-24 text-white @3xl:px-12 @3xl:py-28">
        <ScrollReveal className="mx-auto max-w-3xl text-center" tone="tilt">
          <DisplayTitle
            as="h2"
            className="section-title section-title--on-dark offer-title display-title--on-dark"
            text="Your bay is waiting."
            accent="bay"
          />
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/85">
            Book a simulator bay or become a member — Somerset’s indoor golf clubhouse is ready when you are.
          </p>
          <CtaPair className="mx-auto mt-10 justify-center">
            <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
            <CtaAnchor href="#hero" tone="inverted" className="w-full">
              Book a Bay
            </CtaAnchor>
          </CtaPair>
        </ScrollReveal>
      </section>

      <FaqSection />

      <SiteFooter />
      </div>
    </div>
  );
}
