import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

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
}: {
  src: string;
  srcMobile?: string;
  poster: string;
  posterAlt?: string;
  className?: string;
  pausable?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const playable = src.trim().length > 0 && !reduce;

  useEffect(() => {
    const node = box.current;
    const video = videoRef.current;
    if (!node || !video || !playable) return;
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
  }, [paused, playable]);

  return (
    <div ref={box} className={`overflow-hidden bg-bay ${className}`}>
      <div className="relative h-full w-full">
        <img src={poster} alt={posterAlt} decoding="async" className="h-full w-full object-cover" />
        {playable ? (
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
      </div>
    </div>
  );
}
