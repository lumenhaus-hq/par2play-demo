import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { NEAR_VIEWPORT } from "../motion/nearViewport";

/**
 * Muted inline video. The mobile file is used under 768px.
 * Reduced motion shows the poster. Off-screen clips are not loaded.
 * When pausable, a transparent control over the picture toggles playback.
 */
export function VideoSlot({
  src,
  srcMobile,
  poster,
  posterAlt = "Par2Play indoor golf",
  className = "",
  pausable = false,
  framed = false,
  label = "",
  priority = false,
}: {
  src: string;
  srcMobile?: string;
  poster: string;
  posterAlt?: string;
  className?: string;
  pausable?: boolean;
  /** Sport frame for in-section films. Stills and full-bleed heroes stay plain. */
  framed?: boolean;
  label?: string;
  /** Poster is in the first viewport, so it loads with the document instead of lazily. */
  priority?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const playable = src.trim().length > 0 && !reduce;

  useEffect(() => {
    const node = box.current;
    if (!node || !playable || mounted) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setMounted(true);
      observer.disconnect();
    }, NEAR_VIEWPORT);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, playable]);

  useEffect(() => {
    const node = box.current;
    const video = videoRef.current;
    if (!node || !video || !playable || !mounted) return;
    let seen = false;
    const start = () => {
      if (!seen || paused) return;
      void video.play().catch(() => undefined);
    };
    const whenReady = () => {
      if (document.readyState === "complete") start();
      else window.addEventListener("load", start, { once: true });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause();
          return;
        }
        seen = true;
        whenReady();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [paused, playable, mounted]);

  return (
    <div ref={box} className={`${framed ? "clip-frame" : "overflow-hidden bg-bay"} ${className}`}>
      <div className="relative h-full w-full">
        <img
          src={poster}
          alt={posterAlt}
          width={1280}
          height={720}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
        {playable && mounted ? (
          <video
            ref={videoRef}
            className="hero-video absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            loop
            preload="none"
            aria-hidden="true"
          >
            {srcMobile ? <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" /> : null}
            <source src={src} type="video/mp4" />
          </video>
        ) : null}
        {pausable ? (
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-default bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            aria-pressed={paused}
            aria-label={paused ? "Play video" : "Pause video"}
            onClick={() => setPaused((value) => !value)}
          />
        ) : null}
        {framed ? (
          <>
            <span className="clip-frame__shade" aria-hidden="true" />
            <span className="clip-frame__brackets" aria-hidden="true" />
            {label ? (
              <span className="clip-frame__chip" aria-hidden="true">
                {label}
              </span>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
