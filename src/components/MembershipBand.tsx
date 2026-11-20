import { useEffect, useRef, useState } from "react";
import { BookLink, MembershipLink } from "./Cta";
import { MembershipBento } from "./MembershipBento";
import { MEMBERSHIP_MONTAGE } from "../data/films";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { NEAR_VIEWPORT } from "../motion/nearViewport";

function MontageFilm({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node || reduce || mounted) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setMounted(true);
      observer.disconnect();
    }, NEAR_VIEWPORT);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, reduce]);

  useEffect(() => {
    const video = ref.current;
    const node = box.current;
    if (!video || !node || reduce || !mounted) return;
    video.muted = true;
    video.defaultMuted = true;
    video.preload = "none";
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
  }, [paused, reduce, mounted]);

  return (
    <div ref={box} className="absolute inset-0">
      <img
        src={MEMBERSHIP_MONTAGE.poster}
        alt="Golfers on a simulator at Par2Play"
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {!reduce && mounted ? (
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
      ) : null}
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

function MembershipIntro() {
  return (
    <header className="membership-film__intro">
      <h2 className="section-title section-title--on-dark offer-title text-4xl @5xl:text-6xl">Membership</h2>
      <div className="mt-5 grid w-full max-w-md grid-cols-1 gap-3">
        <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
        <BookLink className="w-full" offer="bay" tone="inverted">
          Experience a free Member Day
        </BookLink>
      </div>
    </header>
  );
}

/** Title, CTAs, and bento grid stacked over the membership montage. */
function MembershipStage() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const toggle = () => setPaused((value) => !value);

  return (
    <div className="membership-film relative overflow-hidden bg-void text-white">
      <MontageFilm paused={paused} reduce={reduce} />
      <div className="membership-film__shade" aria-hidden="true" />
      {reduce ? null : <FilmToggle paused={paused} onToggle={toggle} />}
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
