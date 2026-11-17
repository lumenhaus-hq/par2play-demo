import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookLink, MembershipLink } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { ADDRESS_LINE, COACH_LINE, NAP, PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { PHOTOS } from "../data/photos";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, REVIEW_QUOTES } from "../data/reviews";
import { faqGraph, homeGraph } from "../data/schema";
import { pageHref } from "../data/routes";
import { Magnetic } from "./shared/Magnetic";
import { SplitLine, TakeEyebrow } from "./shared/SplitLine";
import { TakeCursor } from "./shared/TakeCursor";
import { TakeFooter, TakeNav } from "./shared/TakeChrome";
import { useGsapContext } from "./shared/useGsapContext";

gsap.registerPlugin(ScrollTrigger);

const MOMENTS = [
  {
    id: "coach",
    title: "Get fitted and swinging",
    line: COACH_LINE,
    img: PHOTOS.coachAndPlayer.webp,
    alt: PHOTOS.coachAndPlayer.alt,
    href: "coaching",
  },
  {
    id: "kids",
    title: "Golf for kids",
    line: "Supervised practice with shot data every swing.",
    img: PHOTOS.juniorGroup.webp,
    alt: PHOTOS.juniorGroup.alt,
    href: "juniors",
  },
  {
    id: "events",
    title: "Events that fill a bay",
    line: "Corporate nights, parties, and leagues indoors.",
    img: PHOTOS.lounge.webp,
    alt: PHOTOS.lounge.alt,
    href: "events",
  },
  {
    id: "member",
    title: "Member benefits",
    line: `Unlimited practice from $${PRICES.unlimitedMonthly}/mo.`,
    img: PHOTOS.bays.webp,
    alt: PHOTOS.bays.alt,
    href: "membership",
  },
] as const;

const BAYS = [
  { id: "1", label: "Bay 01", line: "Full Swing · tour courses" },
  { id: "2", label: "Bay 02", line: "Launch data on every shot" },
  { id: "3", label: "Bay 03", line: "Top brand clubs ready" },
  { id: "4", label: "Bay 04", line: "Enclosed · all weather" },
] as const;

export function OrbitLanding() {
  const root = useGsapContext(() => {
    gsap.fromTo("[data-orbit-hero]", { scale: 1.18 }, {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: "[data-orbit-pin]", start: "top top", end: "bottom top", scrub: true },
    });

    const rail = document.querySelector<HTMLElement>("[data-orbit-rail]");
    const track = document.querySelector<HTMLElement>("[data-orbit-track]");
    if (rail && track) {
      const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: rail,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    gsap.utils.toArray<HTMLElement>("[data-orbit-card]").forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 120, rotateZ: index % 2 === 0 ? -4 : 4, opacity: 0 },
        {
          y: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        },
      );
    });
  }, []);

  const [boot, setBoot] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      setBoot(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, []);

  const booting = boot < 100;

  return (
    <div ref={root as never} className="take take--orbit" data-take-root="orbit">
      <TakeCursor kind="crosshair" />
      <JsonLd data={homeGraph()} />
      <JsonLd data={faqGraph()} />

      <div className={`take-boot ${booting ? "" : "take-boot--out"}`} aria-hidden={!booting}>
        <p className="take-boot__mark">PAR2PLAY</p>
        <p className="take-boot__pct tabular-nums">{boot}%</p>
      </div>

      <TakeNav light />

      <section data-orbit-pin className="take-orbit-hero">
        <div data-orbit-hero className="take-orbit-hero__media">
          <img src={PHOTOS.storefront.webp} alt={PHOTOS.storefront.alt} className="h-full w-full object-cover" />
          <div className="take-orbit-hero__shade" />
        </div>
        <div className="take-orbit-hero__copy">
          <TakeEyebrow>Somerset, NJ · Indoor</TakeEyebrow>
          <SplitLine as="h1" className="take-orbit-hero__title" immediate>
            A home for all golfers.
          </SplitLine>
          <p className="take-orbit-hero__sub">
            Four Full Swing bays. {SIMULATOR_COURSE_COUNT}+ courses. PGA coaching with {COACH_LINE}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic data-cursor-grow="">
              <MembershipLink>Become a Member</MembershipLink>
            </Magnetic>
            <Magnetic>
              <BookLink offer="bay" tone="inverted">
                Book a bay
              </BookLink>
            </Magnetic>
          </div>
          <p className="mt-8 text-sm tracking-[0.18em] text-white/75 uppercase">
            {GOOGLE_RATING} · {GOOGLE_REVIEW_COUNT} Google reviews
          </p>
        </div>
        <p className="take-orbit-knock" aria-hidden="true">
          PAR2PLAY
        </p>
      </section>

      <section data-orbit-rail className="take-orbit-rail" aria-label="Simulator bays">
        <div className="take-orbit-rail__head">
          <TakeEyebrow>The floor</TakeEyebrow>
          <SplitLine as="h2" className="take-display">
            Four enclosed bays. One clubhouse pace.
          </SplitLine>
        </div>
        <div data-orbit-track className="take-orbit-track">
          {BAYS.map((bay, index) => (
            <article key={bay.id} className="take-orbit-bay" data-cursor-grow="">
              <p className="take-orbit-bay__index">{String(index + 1).padStart(2, "0")}</p>
              <img src={PHOTOS.bays.webp} alt={PHOTOS.bays.alt} className="take-orbit-bay__img" />
              <h3 className="take-orbit-bay__title">{bay.label}</h3>
              <p className="take-orbit-bay__line">{bay.line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="take-orbit-moments">
        <div className="take-orbit-moments__head">
          <TakeEyebrow>Signature moments</TakeEyebrow>
          <SplitLine as="h2" className="take-display">
            Built for the swing you bring in.
          </SplitLine>
        </div>
        <div className="take-orbit-moments__grid">
          {MOMENTS.map((moment) => (
            <a
              key={moment.id}
              data-orbit-card
              href={pageHref(moment.href)}
              className="take-orbit-card"
              data-cursor-grow=""
            >
              <img src={moment.img} alt={moment.alt} className="take-orbit-card__img" />
              <div className="take-orbit-card__body">
                <h3>{moment.title}</h3>
                <p>{moment.line}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="take-orbit-proof">
        <TakeEyebrow>From the bay</TakeEyebrow>
        <blockquote className="take-orbit-quote">
          “{REVIEW_QUOTES[0]?.line ?? "Thank you for the best coaching experience."}”
          <footer>— {REVIEW_QUOTES[0]?.name ?? "Jeric"}</footer>
        </blockquote>
        <Magnetic className="mt-10 inline-flex">
          <BookLink offer="swing-evaluation">Evaluate my swing</BookLink>
        </Magnetic>
      </section>

      <section className="take-orbit-visit">
        <SplitLine as="h2" className="take-display">
          Your bay is waiting.
        </SplitLine>
        <p className="mt-4 max-w-xl text-lg opacity-80">
          {ADDRESS_LINE}. {NAP.phoneDisplay}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <MembershipLink>Become a Member</MembershipLink>
          </Magnetic>
          <Magnetic>
            <BookLink offer="bay" tone="line">
              Book a bay
            </BookLink>
          </Magnetic>
        </div>
      </section>

      <TakeFooter />
    </div>
  );
}
