import { useEffect, useRef, useState } from "react";
import { BookLink, CtaPair, MembershipLink } from "./Cta";
import { MembershipStepIcon, type MembershipStepId } from "./MembershipIcons";
import { ScrollReveal } from "./ScrollReveal";
import { MEMBERSHIP_MONTAGE } from "../data/films";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useFlow } from "../state/flow";

const benefits: readonly {
  id: MembershipStepId;
  eyebrow: string;
  word: string;
  line: string;
}[] = [
  {
    id: "availability",
    eyebrow: "Availability",
    word: "Member benefits",
    line: "First in line for the times that suit you.",
  },
  {
    id: "progress",
    eyebrow: "Progress",
    word: "Track your progress",
    line: "Carry, ball speed, and spin.",
  },
  {
    id: "day",
    eyebrow: "Your day",
    word: "Fit it around your day",
    line: "Dentist visits and school pickup.",
  },
];

function MontageFilm({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = ref.current;
    const node = box.current;
    if (!video || !node || reduce) return;
    video.muted = true;
    video.defaultMuted = true;
    if (paused) {
      video.pause();
      return;
    }
    let visible = false;
    const start = () => {
      if (!visible) return;
      void video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (!visible) {
          video.pause();
          return;
        }
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });
      },
      { rootMargin: "0px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", start);
      video.pause();
    };
  }, [paused, reduce]);

  return (
    <div ref={box} className="absolute inset-0">
      <img
        src={MEMBERSHIP_MONTAGE.poster}
        alt="Golfers on a simulator at Par2Play"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {reduce ? null : (
        <video
          ref={ref}
          className="hero-video absolute inset-0 h-full w-full object-cover object-center"
          muted
          playsInline
          loop
          preload="none"
        >
          <source src={MEMBERSHIP_MONTAGE.srcMobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={MEMBERSHIP_MONTAGE.src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function FilmToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="absolute inset-0 z-10 cursor-default bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
      aria-pressed={paused}
      aria-label={paused ? "Play video" : "Pause video"}
      onClick={onToggle}
    />
  );
}

function ChapterList({ active, dimInactive }: { active: number; dimInactive: boolean }) {
  return (
    <ul className="mt-6 grid gap-3 @3xl:gap-4">
      {benefits.map((benefit, index) => {
        const on = index === active;
        return (
          <li key={benefit.id} data-chapter={index} aria-current={dimInactive && on ? "true" : undefined}>
            <ScrollReveal tone={index === 0 ? "tilt" : "rise"} delay={index * 70}>
              <article
                className={`benefit-card ${dimInactive ? (on ? "benefit-card--active" : "benefit-card--dim") : "benefit-card--active"}`}
              >
                <span className="benefit-card__sheen" aria-hidden="true" />
                <div className="relative flex gap-3.5">
                  <MembershipStepIcon id={benefit.id} />
                  <div className="min-w-0">
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-mint">
                      {`${String(index + 1).padStart(2, "0")} / ${String(benefits.length).padStart(2, "0")}`}
                    </p>
                    <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                      {benefit.eyebrow}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-tight text-white">
                      {benefit.word}
                    </h3>
                    <p className="mt-1.5 text-base leading-relaxed text-white/80">{benefit.line}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </li>
        );
      })}
    </ul>
  );
}

export function MembershipBand() {
  const reduce = usePrefersReducedMotion();
  const mobile = useFlow().layout === "mobile";
  const [paused, setPaused] = useState(false);
  const [chapter, setChapter] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const toggle = () => setPaused((value) => !value);
  const showControl = !reduce;
  const dimInactive = !mobile && !reduce;

  useEffect(() => {
    if (!dimInactive) return;
    const root = listRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-chapter]")];
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = Number((best.target as HTMLElement).dataset.chapter);
        if (Number.isFinite(index)) setChapter(index);
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: [0.2, 0.6, 1] },
    );
    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, [dimInactive]);

  return (
    <section id="membership" className="@container scroll-mt-32 bg-void text-white">
      <div className="relative overflow-hidden @3xl:min-h-[36rem]">
        <div className="relative aspect-video w-full overflow-hidden @3xl:absolute @3xl:inset-0 @3xl:aspect-auto @3xl:h-full">
          <MontageFilm paused={paused} reduce={reduce} />
          {showControl ? <FilmToggle paused={paused} onToggle={toggle} /> : null}
        </div>
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-void via-void/90 to-transparent @3xl:block"
          aria-hidden="true"
        />
        <div className="pointer-events-none relative z-20 px-6 pt-6 pb-10 @3xl:flex @3xl:min-h-[36rem] @3xl:items-center @3xl:px-12 @3xl:py-16">
          <div ref={listRef} className="pointer-events-auto max-w-lg">
            <ScrollReveal tone="rise">
              <h2 className="font-display text-4xl font-semibold leading-none tracking-tight @5xl:text-6xl">Membership</h2>
              <CtaPair className="mt-6">
                <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
                <BookLink className="w-full" offer="bay" tone="line">
                  Try it out
                </BookLink>
              </CtaPair>
            </ScrollReveal>
            <ChapterList active={chapter} dimInactive={dimInactive} />
          </div>
        </div>
      </div>
    </section>
  );
}
