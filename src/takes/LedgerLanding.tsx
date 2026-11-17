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

const CHAPTERS = [
  {
    id: "arrive",
    no: "01",
    title: "Arrive",
    line: "Walk into four enclosed Full Swing bays — no weather, no wait for daylight.",
    img: PHOTOS.storefront.webp,
    alt: PHOTOS.storefront.alt,
  },
  {
    id: "swing",
    no: "02",
    title: "Swing",
    line: `${COACH_LINE}. Shot data on every ball so progress is visible week to week.`,
    img: PHOTOS.gripLesson.webp,
    alt: PHOTOS.gripLesson.alt,
  },
  {
    id: "belong",
    no: "03",
    title: "Belong",
    line: `Member hours that bend around your day. Unlimited practice from $${PRICES.unlimitedMonthly}/mo.`,
    img: PHOTOS.lounge.webp,
    alt: PHOTOS.lounge.alt,
  },
] as const;

export function LedgerLanding() {
  const root = useGsapContext(() => {
    const chapters = gsap.utils.toArray<HTMLElement>("[data-ledger-chapter]");
    chapters.forEach((chapter) => {
      const media = chapter.querySelector("[data-ledger-media]");
      const copy = chapter.querySelector("[data-ledger-copy]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });
      tl.fromTo(media, { scale: 1.2, filter: "brightness(0.55)" }, { scale: 1, filter: "brightness(1)", ease: "none" }, 0)
        .fromTo(copy, { y: 80, opacity: 0.15 }, { y: 0, opacity: 1, ease: "none" }, 0)
        .to(copy, { y: -40, opacity: 0.35, ease: "none" }, 0.72);
    });

    gsap.utils.toArray<HTMLElement>("[data-ledger-peel]").forEach((card, index) => {
      gsap.fromTo(
        card,
        { rotateY: -28, x: index % 2 === 0 ? -80 : 80, opacity: 0 },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        },
      );
    });
  }, []);

  return (
    <div ref={root as never} className="take take--ledger" data-take-root="ledger">
      <TakeCursor kind="blob" />
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />
      <TakeNav />

      <section className="take-ledger-hero">
        <TakeEyebrow>Indoor golf · {NAP.city}</TakeEyebrow>
        <SplitLine as="h1" className="take-ledger-hero__title" immediate>
          The clubhouse that stays open after dark.
        </SplitLine>
        <p className="take-ledger-hero__sub">
          {SIMULATOR_COURSE_COUNT}+ courses. PGA coaching. Memberships that fit around school pickup and late meetings.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <MembershipLink>Become a Member</MembershipLink>
          </Magnetic>
          <Magnetic>
            <BookLink offer="bay" tone="line">
              Book a bay
            </BookLink>
          </Magnetic>
        </div>
        <p className="mt-8 text-sm tracking-[0.16em] uppercase opacity-70">
          {GOOGLE_RATING} stars · {GOOGLE_REVIEW_COUNT} reviews
        </p>
      </section>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} data-ledger-chapter className="take-ledger-chapter">
          <div data-ledger-media className="take-ledger-chapter__media">
            <img src={chapter.img} alt={chapter.alt} />
          </div>
          <div data-ledger-copy className="take-ledger-chapter__copy">
            <p className="take-ledger-chapter__no">{chapter.no}</p>
            <h2 className="take-ledger-chapter__title">{chapter.title}</h2>
            <p className="take-ledger-chapter__line">{chapter.line}</p>
          </div>
        </section>
      ))}

      <section className="take-ledger-peels">
        <TakeEyebrow>On the floor</TakeEyebrow>
        <SplitLine as="h2" className="take-display">
          Soft rooms. Hard data.
        </SplitLine>
        <div className="take-ledger-peels__grid">
          <article data-ledger-peel className="take-ledger-peel" data-cursor-grow="">
            <img src={PHOTOS.launchData.webp} alt={PHOTOS.launchData.alt} />
            <h3>Launch numbers</h3>
            <p>Carry, ball speed, and spin — readable after every swing.</p>
          </article>
          <article data-ledger-peel className="take-ledger-peel" data-cursor-grow="">
            <img src={PHOTOS.juniorSetup.webp} alt={PHOTOS.juniorSetup.alt} />
            <h3>Juniors</h3>
            <p>Supervised practice that builds the golfers of tomorrow.</p>
          </article>
          <article data-ledger-peel className="take-ledger-peel" data-cursor-grow="">
            <img src={PHOTOS.groupWave.webp} alt={PHOTOS.groupWave.alt} />
            <h3>Events</h3>
            <p>Teams, birthdays, and leagues across four enclosed bays.</p>
          </article>
        </div>
      </section>

      <section className="take-ledger-quote">
        <blockquote>
          “{REVIEW_QUOTES[0]?.line}”
          <footer>{REVIEW_QUOTES[0]?.name}</footer>
        </blockquote>
      </section>

      <section className="take-ledger-close">
        <SplitLine as="h2" className="take-display">
          Come see the bay.
        </SplitLine>
        <p className="mt-4 max-w-lg text-lg opacity-80">
          {ADDRESS_LINE} · {NAP.phoneDisplay}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <BookLink offer="bay">Book a bay</BookLink>
          </Magnetic>
          <Magnetic>
            <MembershipLink tone="line">Become a Member</MembershipLink>
          </Magnetic>
        </div>
      </section>

      <TakeFooter />
    </div>
  );
}
