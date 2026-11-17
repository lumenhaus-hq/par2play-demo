import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, Shield, Target, UserRound } from "lucide-react";
import { bindHeroWatch } from "../audio/soundtrack";
import { Mark } from "../components/Chrome";
import { BookLink, CtaAnchor, CtaPair, HeroMembershipAction, MembershipLink, buttonFocus } from "../components/Cta";
import { HeroProof } from "../components/HeroProof";
import { MembershipBand } from "../components/MembershipBand";
import { HeroVideo, type HeroIntroPhase } from "../components/Media";
import { LayoutToggle } from "../components/LayoutToggle";
import { MotionToggle } from "../components/MotionToggle";
import { ScrollReveal } from "../components/ScrollReveal";
import { SoundToggle } from "../components/SoundToggle";
import { TournamentForm } from "../components/TournamentForm";
import { EventTypeList } from "../components/EventTypeList";
import { OfferTicker } from "../components/OfferTicker";
import { VideoSlot } from "../components/VideoSlot";
import { ValuePoint } from "../components/ValuePoint";
import { NAP, OCLOCK, golfClockBookingReady } from "../data/business";
import { HERO_TICKER } from "../data/heroTicker";
import { HeroLocation, HeroTitle } from "../components/HeroTitle";
import type { HeroTypeId } from "../data/heroType";
import { JsonLd } from "../components/JsonLd";
import { FaqSection } from "../components/FaqSection";
import { VisitLine } from "../components/VisitLine";
import { faqGraph, homeGraph } from "../data/schema";
import { COACHING_FILM, JUNIORS_FILM } from "../data/films";
import { SITE_NAV, pageHref } from "../data/routes";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { useFlow } from "../state/flow";

const sectionSpace = "scroll-mt-32 px-6 py-20 @3xl:px-12 @3xl:py-24";

const navButton = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-ink ${buttonFocus}`;

export function Landing({ heroType = "plate" }: { heroType?: HeroTypeId }) {
  const flow = useFlow();
  const [menu, setMenu] = useState(false);
  const [onFilm, setOnFilm] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  // Match prerendered HTML (webdriver captures arrived); HeroVideo drives later phases.
  const [intro, setIntro] = useState<HeroIntroPhase>("arrived");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Desktop-only enrichment; touch devices skip tilt in the hook.
  const offerTiltRef = usePointerTilt<HTMLDivElement>(5);
  const mobile = flow.layout === "mobile";
  const scroll = mobile ? "h-full overflow-y-auto" : "";
  // Offer + toolbar appear as the bay expands — don't wait for expand to finish.
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
    const read = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      setOnFilm(hero.getBoundingClientRect().bottom > 72);
    };
    read();
    const target = root ?? window;
    target.addEventListener("scroll", read, { passive: true });
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
      target.removeEventListener("scroll", read);
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

  const filmLink = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold ${buttonFocus} ${
    onFilm ? "text-white" : "text-ink"
  }`;

  return (
    <div
      ref={scrollRef}
      data-smooth-root={mobile ? "" : undefined}
      className={`@container page-grid text-base text-ink ${scroll} ${chromeReady ? "" : "overflow-hidden"}`}
    >
      <div
        data-smooth-content={mobile ? "" : undefined}
        className={mobile ? "flex min-h-full flex-col" : undefined}
      >
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />
      <header
        className={`sticky z-30 shrink-0 px-6 py-3 @5xl:px-12 ${mobile ? "top-0" : "top-[4.25rem]"} ${onFilm ? "hero-toolbar" : "header-bar"} ${
          chromeReady ? "hero-chrome-in" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={chromeReady ? undefined : true}
      >
        <div className="flex items-center justify-between gap-4">
          <Mark light={onFilm} />
          <nav className="hidden items-center gap-3 @3xl:flex @5xl:gap-6" aria-label="Page">
            {SITE_NAV.map((item) => (
              <a
                key={item.slug}
                href={pageHref(item.slug)}
                className={`${filmLink} ${active === item.slug ? "is-active" : ""}`}
                aria-current={active === item.slug ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LayoutToggle className={onFilm ? "text-white" : "text-ink"} />
            <SoundToggle labeled={onFilm} className={onFilm ? "text-white" : "text-ink"} />
            <span className="hidden @3xl:contents">
              <MembershipLink className="shrink-0">Become a Member</MembershipLink>
            </span>
            <button
              type="button"
              className={`${filmLink} @3xl:hidden`}
              aria-expanded={menu}
              onClick={() => setMenu((open) => !open)}
            >
              {menu ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            className={`mt-2 flex flex-col items-start gap-1 @3xl:hidden ${onFilm ? "hero-panel rounded-2xl px-3 py-2" : ""}`}
            aria-label="Page"
          >
            {SITE_NAV.map((item) => (
              <a
                key={item.slug}
                href={pageHref(item.slug)}
                className={`${filmLink} ${active === item.slug ? "is-active" : ""}`}
                aria-current={active === item.slug ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <MembershipLink className="mt-2 w-fit">Become a Member</MembershipLink>
          </nav>
        )}
      </header>
      <section
        id="hero"
        className={`hero-shell relative -mt-[4.5rem] flex flex-col overflow-hidden bg-ink ${
          mobile ? "min-h-full shrink-0" : "h-[calc(100svh-5rem)]"
        }`}
        aria-busy={chromeReady ? undefined : true}
      >
        <HeroVideo onPhase={onPhase} />
        <div className="hero-top-shade pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
        <div
          data-hero-offer
          className={`hero-offer-dock relative z-10 flex items-end justify-end px-6 pb-3 pt-2 @3xl:px-12 @3xl:pb-6 @3xl:pt-[4.5rem] ${
            chromeReady ? "hero-chrome-in" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={chromeReady ? undefined : true}
        >
          <div
            ref={offerTiltRef}
            className="hero-panel hero-panel-depth hero-panel-tilt hero-offer-card pointer-events-auto max-h-full w-full max-w-[36rem] overflow-hidden rounded-[1.35rem] px-4 py-3 @3xl:overflow-y-auto @3xl:px-7 @3xl:py-6"
          >
            <div className="hero-offer-sheen" aria-hidden="true" />
            <div className="relative flex min-w-0 flex-col gap-2.5 @3xl:gap-5">
              <div className="hero-stage hero-stage--copy min-w-0 max-w-full" data-hero-type={heroType}>
                <HeroTitle concept={heroType} />
                <HeroLocation concept={heroType} />
              </div>
              <div className="hero-stage hero-stage--proof">
                <HeroProof />
              </div>
              <div className="hero-stage hero-stage--cta">
                <HeroMembershipAction className="cta-sheen w-full @3xl:w-auto" />
              </div>
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
            <VideoSlot
              src={COACHING_FILM.src}
              srcMobile={COACHING_FILM.srcMobile}
              poster={COACHING_FILM.poster}
              posterAlt="A golfer hitting a shot in a Par2Play simulator bay"
              className="aspect-video"
              pausable
            />
          </ScrollReveal>
          <ScrollReveal tone="rise" delay={80}>
            <h2 className="font-display text-3xl font-semibold leading-none tracking-tight @5xl:text-5xl">Get fitted and swinging!</h2>
            <p className="mt-8 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
              {"Two PGA professional coaches, "}
              <a className="underline decoration-2 underline-offset-4" href={`${pageHref("coaching")}#nick-schiavo`}>
                Nick Schiavo
              </a>
              {" and "}
              <a className="underline decoration-2 underline-offset-4" href={`${pageHref("coaching")}#nick-monticello`}>
                Nick Monticello
              </a>
            </p>
            <div className="mt-8 grid gap-5">
              <ValuePoint icon={Target} label="1:1 lessons" line="A plan you can track month to month." />
              <ValuePoint
                icon={Activity}
                label="Swing evaluation"
                line="Swing your way to your first hole in one with drill down analysis and personalised 1:1 coaching."
              />
            </div>
            <CtaPair className="mt-8">
              <BookLink className="w-full" offer="swing-evaluation">
                Evaluate my swing
              </BookLink>
              <BookLink className="w-full" offer="bay" tone="line">
                Try it out
              </BookLink>
            </CtaPair>
          </ScrollReveal>
        </div>
      </section>

      <section id="juniors" className={sectionSpace}>
        <div className="grid items-center gap-10 @3xl:grid-cols-2 @3xl:gap-16">
          <ScrollReveal className="@3xl:order-2" tone="rise" delay={80}>
            <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Golf for kids</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed">Building the golfers of tomorrow.</p>
            <div className="mt-8 grid gap-5">
              <ValuePoint
                icon={UserRound}
                label="Future pros"
                line="1:1 coaching with PGA pros Nick Schiavo and Nick Monticello, once or twice a week."
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
            <div className="mt-8">
              <BookLink offer="junior">Schedule kids golf</BookLink>
            </div>
          </ScrollReveal>
          <ScrollReveal className="@3xl:order-1" tone="tilt">
            <VideoSlot
              src={JUNIORS_FILM.src}
              srcMobile={JUNIORS_FILM.srcMobile}
              poster={JUNIORS_FILM.poster}
              posterAlt="A junior golfer swinging in a Par2Play simulator bay"
              className="aspect-video"
              pausable
            />
          </ScrollReveal>
        </div>
      </section>

      <section id="events" className={sectionSpace}>
        <ScrollReveal tone="sheen">
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Events</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed">
            Four enclosed bays, with a golf pro for mini-lessons and casual games.
          </p>
          <div className="mt-6">
            <EventTypeList />
          </div>
          <CtaPair className="mt-8">
            <CtaAnchor href={pageHref("events")} className="w-full">
              See events
            </CtaAnchor>
            <CtaAnchor href={OCLOCK.events} tone="line" className="w-full" offer="group" external>
              Check availability
            </CtaAnchor>
          </CtaPair>
        </ScrollReveal>
      </section>

      <section id="tournament" className={`${sectionSpace} text-center`}>
        <ScrollReveal tone="rise">
          <h2 className="mx-auto max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-5xl">
            Par2Play Fall League Coming Soon!
          </h2>
          <div className="mt-10">
            <TournamentForm />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-void px-6 py-24 text-white @3xl:px-12 @3xl:py-28">
        <ScrollReveal className="mx-auto max-w-3xl text-center" tone="tilt">
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Your bay is waiting.</h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/80">
            Book a simulator bay or become a member — Somerset’s indoor golf clubhouse is ready when you are.
          </p>
          <CtaPair className="mx-auto mt-10 justify-center">
            <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
            <BookLink className="w-full" offer="bay" tone="inverted">
              Book a bay
            </BookLink>
          </CtaPair>
        </ScrollReveal>
      </section>

      <FaqSection />

      <footer className="px-6 py-20 @3xl:px-12 @3xl:py-24">
        <div className="grid items-start gap-x-12 gap-y-8 @3xl:grid-cols-2 @5xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
          <VisitLine />
          <nav className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
            {SITE_NAV.map((item) => (
              <a key={item.slug} href={pageHref(item.slug)} className={navButton}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
          <p>© 2026 Par2Play</p>
          <MotionToggle className="text-ink" />
          <a href={pageHref("privacy-policy")} className={navButton}>
            Privacy
          </a>
        </div>
        {!golfClockBookingReady() && (
          <p className="mt-2 max-w-xl text-base text-slate-700">
            GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
          </p>
        )}
      </footer>
      </div>
    </div>
  );
}
