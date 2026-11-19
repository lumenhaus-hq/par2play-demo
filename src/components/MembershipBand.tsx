import { useEffect, useRef, useState } from "react";
import { BookLink, MembershipLink } from "./Cta";
import { MembershipBento } from "./MembershipBento";
import { MEMBERSHIP_MONTAGE } from "../data/films";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

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

function MembershipIntro({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <header className={className}>
      <h2
        className={`section-title offer-title text-4xl @5xl:text-6xl${onDark ? " section-title--on-dark" : ""}`}
      >
        Membership
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-3">
        <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
        <BookLink className="w-full" offer="bay" tone={onDark ? "inverted" : "dark"}>
          Experience a free Member Day
        </BookLink>
      </div>
    </header>
  );
}

function MembershipFilm() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const toggle = () => setPaused((value) => !value);

  return (
    <div className="membership-film relative aspect-video w-full overflow-hidden @3xl:aspect-[21/9] @3xl:max-h-[32rem]">
      <MontageFilm paused={paused} reduce={reduce} />
      <div className="membership-film__shade" aria-hidden="true" />
      {reduce ? null : <FilmToggle paused={paused} onToggle={toggle} />}
      <div className="membership-film__overlay pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 py-10">
        <MembershipIntro
          onDark
          className="pointer-events-auto membership-film__card mx-auto w-full max-w-md text-center"
        />
      </div>
    </div>
  );
}

export function MembershipBand() {
  return (
    <section id="membership" className="scroll-mt-32">
      <div className="membership-bento-stage @3xl:hidden">
        <div className="membership-bento pb-0">
          <MembershipIntro className="membership-bento__intro" />
        </div>
      </div>
      <div className="hidden bg-void text-white @3xl:block">
        <MembershipFilm />
      </div>
      <div className="membership-bento-stage">
        <div className="membership-bento membership-bento--grid-only">
          <MembershipBento />
        </div>
      </div>
    </section>
  );
}
