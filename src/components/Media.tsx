import { useEffect, useRef, useState } from "react";
import { bootAmbient, registerHeroVideo } from "../audio/soundtrack";
import { HERO_MEDIA, type ClipAsset } from "../data/media";
import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type HeroIntroPhase = "boot" | "zoom" | "expand" | "arrived";

/** Start arrived so prerender (webdriver) HTML matches first client paint. */
const INITIAL_INTRO: HeroIntroPhase = "arrived";

/** Zoom-out duration; keep in sync with `--motion-expand` in index.css. */
const EXPAND_MS = 1400;

export function Photo({
  photo,
  className = "",
  priority = false,
  decorative = false,
}: {
  photo: PhotoAsset;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <picture className="block h-full w-full">
      <source srcSet={photo.avif} type="image/avif" />
      <source srcSet={photo.webp} type="image/webp" />
      <img
        src={photo.jpg}
        alt={decorative ? "" : photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}

const FRAME_W = 1920;
const FRAME_H = 1080;
/** Green Par2Play wordmark is on screen from here until the film loops. */
const END_CARD_AT = 26.45;
/**
 * The wordmark spans about x 0.27–0.73 of the 16:9 frame. Padding that to
 * 0.52 of the frame, then sizing it to 92% of the hero width, keeps the
 * whole mark inside a portrait phone. When that scale is larger than
 * object-cover (desktop), cover already shows the mark and stays in use.
 */
const WORDMARK_SPAN = 0.52;
const WORDMARK_TARGET = 0.92;

type EndCardFit = { width: number; height: number };

function endCardFit(box: { width: number; height: number }): EndCardFit | null {
  if (box.width <= 0 || box.height <= 0) return null;
  const cover = Math.max(box.width / FRAME_W, box.height / FRAME_H);
  const fitted = (WORDMARK_TARGET * box.width) / (WORDMARK_SPAN * FRAME_W);
  if (fitted >= cover - 0.001) return null;
  return { width: Math.round(FRAME_W * fitted), height: Math.round(FRAME_H * fitted) };
}

function hideLcpPoster() {
  const poster = document.getElementById("lcp-poster");
  if (poster) poster.setAttribute("data-bay", "1");
}

export function HeroVideo({ onPhase }: { onPhase?: (phase: HeroIntroPhase) => void } = {}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const bayRef = useRef<HTMLDivElement>(null);
  const fitReady = useRef(false);
  const [fit, setFit] = useState<EndCardFit | null>(null);
  const [phase, setPhase] = useState<HeroIntroPhase>(INITIAL_INTRO);

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    const skipIntro = reduce || navigator.webdriver;

    if (skipIntro) {
      fitReady.current = true;
      setPhase("arrived");
      hideLcpPoster();
      document.documentElement.classList.remove("hero-bay");
      if (reduce) {
        registerHeroVideo(null);
        bootAmbient();
        return;
      }
    }

    if (!skipIntro) {
      fitReady.current = false;
      document.documentElement.classList.add("hero-bay");
      hideLcpPoster();
      setPhase("zoom");
    } else {
      hideLcpPoster();
    }

    const video = ref.current;
    if (!video) return;
    registerHeroVideo(video);
    const frame = bayRef.current;
    let cancel = false;
    let expandTimer = 0;
    let arriveTimer = 0;

    const syncFit = () => {
      if (!fitReady.current) return;
      const onCard = video.currentTime >= END_CARD_AT;
      const box = frame?.getBoundingClientRect();
      const next = onCard && box ? endCardFit(box) : null;
      setFit((current) => {
        if (current === null && next === null) return current;
        if (current && next && current.width === next.width && current.height === next.height) return current;
        return next;
      });
    };

    const onVis = () => {
      if (document.hidden) video.pause();
      else if (document.documentElement.classList.contains("media-on")) void video.play().catch(() => undefined);
    };

    const armFit = () => {
      fitReady.current = true;
      setPhase("arrived");
      document.documentElement.classList.remove("hero-bay");
      video.addEventListener("timeupdate", syncFit);
      video.addEventListener("seeked", syncFit);
    };

    const startFilm = () => {
      if (cancel) return;
      document.documentElement.classList.add("media-on");
      // registerHeroVideo already starts playback (unmuted attempt → muted fallback).
      if (skipIntro) {
        armFit();
        return;
      }
      setPhase("expand");
      expandTimer = window.setTimeout(() => {
        if (cancel) return;
        armFit();
      }, EXPAND_MS);
    };

    const idle = () => {
      const schedule = window.requestIdleCallback?.bind(window);
      if (schedule) schedule(startFilm, { timeout: 1500 });
      else arriveTimer = window.setTimeout(startFilm, skipIntro ? 1 : 500);
    };

    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    document.addEventListener("visibilitychange", onVis);
    const observer = new ResizeObserver(syncFit);
    if (frame) observer.observe(frame);

    return () => {
      cancel = true;
      window.clearTimeout(expandTimer);
      window.clearTimeout(arriveTimer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("load", idle);
      video.removeEventListener("timeupdate", syncFit);
      video.removeEventListener("seeked", syncFit);
      observer.disconnect();
      video.pause();
      registerHeroVideo(null);
      document.documentElement.classList.remove("hero-bay");
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div className="hero-bay-frame hero-bay-frame--full absolute inset-0">
        <img
          src={HERO_MEDIA.poster}
          alt="Indoor golf at Par2Play in Somerset, NJ"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const frameClass =
    phase === "arrived"
      ? "hero-bay-frame hero-bay-frame--full"
      : phase === "expand"
        ? "hero-bay-frame hero-bay-frame--expand"
        : "hero-bay-frame hero-bay-frame--zoom";

  return (
    <div ref={bayRef} className={`absolute inset-0 overflow-hidden ${phase === "arrived" ? "" : "bg-[#0A0F0B]"}`}>
      <div className={frameClass}>
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(max-width: 767px)" srcSet={HERO_MEDIA.posterMobileAvif} type="image/avif" />
          <source media="(max-width: 767px)" srcSet={HERO_MEDIA.posterMobileWebp} type="image/webp" />
          <img
            src={HERO_MEDIA.poster}
            alt="Indoor golf at Par2Play in Somerset, NJ"
            width={780}
            height={439}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-black ${fit ? "opacity-100" : "opacity-0"}`}
        />
        <video
          ref={ref}
          className={
            fit
              ? "hero-video absolute max-w-none bg-black object-fill"
              : "hero-video absolute inset-0 h-full w-full object-cover"
          }
          style={
            fit
              ? {
                  width: fit.width,
                  height: fit.height,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : undefined
          }
          loop
          playsInline
          preload="none"
          muted
          aria-hidden="true"
        >
          <source src={HERO_MEDIA.mp4Mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={HERO_MEDIA.webm} type="video/webm" media="(min-width: 768px)" />
          <source src={HERO_MEDIA.mp4} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export function ClipTile({
  clip,
  className = "",
  caption,
}: {
  clip: ClipAsset;
  className?: string;
  caption?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "120px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <figure className={`overflow-hidden rounded-2xl bg-slate-950 ${className}`}>
      {reduce ? (
        <img src={clip.poster} alt={clip.label} className="aspect-video w-full object-cover" />
      ) : (
        <video
          ref={ref}
          className="aspect-video w-full object-cover"
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={clip.label}
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      )}
      <figcaption className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
        {caption ?? clip.caption}
      </figcaption>
    </figure>
  );
}
