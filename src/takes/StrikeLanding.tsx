import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookLink, MembershipLink } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { ADDRESS_LINE, COACH_LINE, NAP, PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { PHOTOS } from "../data/photos";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, REVIEW_QUOTES } from "../data/reviews";
import { faqGraph, homeGraph } from "../data/schema";
import { Magnetic } from "./shared/Magnetic";
import { SplitLine, TakeEyebrow } from "./shared/SplitLine";
import { TakeCursor } from "./shared/TakeCursor";
import { TakeFooter, TakeNav } from "./shared/TakeChrome";
import { useGsapContext } from "./shared/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const RECORDS = [
  { label: "Google", value: String(GOOGLE_RATING), unit: "★", note: `${GOOGLE_REVIEW_COUNT} reviews` },
  { label: "Courses", value: `${SIMULATOR_COURSE_COUNT}+`, unit: "", note: "Full Swing library" },
  { label: "Bays", value: "4", unit: "", note: "Enclosed · year-round" },
  { label: "Practice", value: `$${PRICES.unlimitedMonthly}`, unit: "/mo", note: "Unlimited membership" },
] as const;

export function StrikeLanding() {
  const root = useGsapContext(() => {
    gsap.utils.toArray<HTMLElement>("[data-strike-wipe]").forEach((panel) => {
      gsap.fromTo(
        panel,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: panel,
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        },
      );
    });

    const marquee = document.querySelector("[data-strike-marquee]");
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50,
        ease: "none",
        duration: 28,
        repeat: -1,
      });
    }

    gsap.utils.toArray<HTMLElement>("[data-strike-stat]").forEach((stat, index) => {
      gsap.fromTo(
        stat,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: stat, start: "top 88%", once: true },
        },
      );
    });

    const kinetic = document.querySelectorAll("[data-strike-kinetic]");
    kinetic.forEach((node) => {
      gsap.fromTo(
        node,
        { letterSpacing: "0.35em", opacity: 0.2 },
        {
          letterSpacing: "0.02em",
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 80%", end: "top 40%", scrub: true },
        },
      );
    });
  }, []);

  return (
    <div ref={root as never} className="take take--strike" data-take-root="strike">
      <TakeCursor kind="trail" />
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />
      <TakeNav light />

      <section className="take-strike-hero">
        <p data-strike-kinetic className="take-strike-hero__kicker">
          IMPACT INDOORS
        </p>
        <SplitLine as="h1" className="take-strike-hero__title" immediate>
          Hit it. Read it. Repeat.
        </SplitLine>
        <p className="take-strike-hero__sub">
          Par2Play · {NAP.city}. Full Swing simulators, PGA coaches, and memberships that keep you swinging after work.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic strength={0.4}>
            <MembershipLink>Become a Member</MembershipLink>
          </Magnetic>
          <Magnetic strength={0.4}>
            <BookLink offer="bay" tone="inverted">
              Book a bay
            </BookLink>
          </Magnetic>
        </div>
      </section>

      <div className="take-strike-marquee" aria-hidden="true">
        <div data-strike-marquee className="take-strike-marquee__track">
          <span>SHOT ANALYTICS · {SIMULATOR_COURSE_COUNT}+ COURSES · PGA COACHING · JUNIORS · EVENTS · MEMBERSHIP · </span>
          <span>SHOT ANALYTICS · {SIMULATOR_COURSE_COUNT}+ COURSES · PGA COACHING · JUNIORS · EVENTS · MEMBERSHIP · </span>
        </div>
      </div>

      <section data-strike-wipe className="take-strike-panel">
        <div className="take-strike-panel__media">
          <img src={PHOTOS.bays.webp} alt={PHOTOS.bays.alt} />
        </div>
        <div className="take-strike-panel__copy">
          <TakeEyebrow>The room</TakeEyebrow>
          <h2 data-strike-kinetic className="take-strike-panel__title">
            FOUR BAYS. ZERO WEATHER.
          </h2>
          <p>Enclosed simulator bays with top brand clubs and launch data on every swing.</p>
          <Magnetic className="mt-8 inline-flex">
            <BookLink offer="bay">Book a bay</BookLink>
          </Magnetic>
        </div>
      </section>

      <section data-strike-wipe className="take-strike-panel take-strike-panel--flip">
        <div className="take-strike-panel__media">
          <img src={PHOTOS.coachAndPlayer.webp} alt={PHOTOS.coachAndPlayer.alt} />
        </div>
        <div className="take-strike-panel__copy">
          <TakeEyebrow>Coaching</TakeEyebrow>
          <h2 data-strike-kinetic className="take-strike-panel__title">
            TWO PGA PROS.
          </h2>
          <p>{COACH_LINE}. Lessons and swing evaluations you can track month to month.</p>
          <Magnetic className="mt-8 inline-flex">
            <BookLink offer="swing-evaluation">Evaluate my swing</BookLink>
          </Magnetic>
        </div>
      </section>

      <section className="take-strike-records">
        <TakeEyebrow>Record book</TakeEyebrow>
        <SplitLine as="h2" className="take-display">
          Numbers that clear the lip.
        </SplitLine>
        <div className="take-strike-records__grid">
          {RECORDS.map((record) => (
            <article key={record.label} data-strike-stat className="take-strike-stat" data-cursor-grow="">
              <p className="take-strike-stat__label">{record.label}</p>
              <p className="take-strike-stat__value">
                {record.value}
                <span>{record.unit}</span>
              </p>
              <p className="take-strike-stat__note">{record.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section data-strike-wipe className="take-strike-panel">
        <div className="take-strike-panel__media">
          <img src={PHOTOS.juniorGroup.webp} alt={PHOTOS.juniorGroup.alt} />
        </div>
        <div className="take-strike-panel__copy">
          <TakeEyebrow>Juniors & events</TakeEyebrow>
          <h2 data-strike-kinetic className="take-strike-panel__title">
            FILL THE CARD.
          </h2>
          <p>Kids programs, corporate nights, parties, and leagues — booked by the bay.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <BookLink offer="junior">Schedule kids golf</BookLink>
            </Magnetic>
            <Magnetic>
              <BookLink offer="bay" tone="line">
                Check availability
              </BookLink>
            </Magnetic>
          </div>
        </div>
      </section>

      <section className="take-strike-quote">
        <blockquote>
          “{REVIEW_QUOTES[0]?.line}”
          <footer>— {REVIEW_QUOTES[0]?.name}</footer>
        </blockquote>
      </section>

      <section className="take-strike-close">
        <p data-strike-kinetic className="take-strike-close__kicker">
          YOUR BAY IS WAITING
        </p>
        <p className="mt-4 text-lg opacity-80">
          {ADDRESS_LINE} · {NAP.phoneDisplay}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic strength={0.4}>
            <MembershipLink>Become a Member</MembershipLink>
          </Magnetic>
          <Magnetic strength={0.4}>
            <BookLink offer="bay" tone="inverted">
              Book a bay
            </BookLink>
          </Magnetic>
        </div>
      </section>

      <TakeFooter />
    </div>
  );
}
