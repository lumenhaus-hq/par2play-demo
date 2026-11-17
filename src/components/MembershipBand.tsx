import { useEffect, useRef, useState } from "react";
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

/** Desktop film strip under the shared bento grid. */
function MembershipFilm() {
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const toggle = () => setPaused((value) => !value);

  return (
    <div className="relative aspect-video w-full overflow-hidden @3xl:aspect-[21/9] @3xl:max-h-[28rem]">
      <MontageFilm paused={paused} reduce={reduce} />
      {reduce ? null : <FilmToggle paused={paused} onToggle={toggle} />}
    </div>
  );
}

export function MembershipBand() {
  return (
    <section id="membership" className="scroll-mt-32">
      <div className="membership-bento-stage">
        <MembershipBento />
      </div>
      <div className="hidden bg-void text-white @3xl:block">
        <MembershipFilm />
      </div>
    </section>
  );
}
