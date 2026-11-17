import { useEffect, useRef, useState } from "react";
import { bootAmbient, registerHeroVideo } from "../audio/soundtrack";
import { HERO_MEDIA, type ClipAsset } from "../data/media";
import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type HeroIntroPhase = "boot" | "zoom" | "expand" | "arrived";

/** Start arrived so prerender (webdriver) HTML matches first client paint. */
const INITIAL_INTRO: HeroIntroPhase = "arrived";

/** Mobile is the primary device: shorter waits, quicker wipe / expand. */
type IntroTiming = {
  expandMs: number;
  zoomHoldMs: number;
  wipeMs: number;
  readyBufferS: number;
  stallMs: number;
};

function introTiming(): IntroTiming {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow =
    Boolean(connection?.saveData) ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";
  if (mobile || slow) {
    // Still shorter than desktop, but long enough to read the mark + %.
    return { expandMs: 1100, zoomHoldMs: 320, wipeMs: 560, readyBufferS: 1.15, stallMs: 3200 };
  }
  return { expandMs: 1400, zoomHoldMs: 420, wipeMs: 720, readyBufferS: 2.4, stallMs: 4500 };
}

function applyIntroMotionVars(timing: IntroTiming) {
  const root = document.documentElement.style;
  root.setProperty("--motion-expand", `${timing.expandMs}ms`);
  root.setProperty("--motion-wipe", `${timing.wipeMs}ms`);
}

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
 * End-card wordmark zoom. Prefer a light CSS scale on object-cover over
 * object-fill resize — fill upscales soft 540p/1080p and reads muddy.
 * Cap past-cover zoom so the closing frame stays sharp.
 */
const WORDMARK_SPAN = 0.52;
const WORDMARK_TARGET = 0.78;
const END_CARD_MAX_ZOOM = 1.22;
const END_CARD_MAX_ZOOM_MOBILE = 1.12;

type EndCardFit = { scale: number };

function endCardFit(box: { width: number; height: number }, mobile: boolean): EndCardFit | null {
  if (box.width <= 0 || box.height <= 0) return null;
  const cover = Math.max(box.width / FRAME_W, box.height / FRAME_H);
  const fitted = (WORDMARK_TARGET * box.width) / (WORDMARK_SPAN * FRAME_W);
  const ratio = fitted / cover;
  if (ratio <= 1.02) return null;
  const cap = mobile ? END_CARD_MAX_ZOOM_MOBILE : END_CARD_MAX_ZOOM;
  return { scale: Math.min(ratio, cap) };
}

function hideLcpPoster() {
  const poster = document.getElementById("lcp-poster");
  if (poster) poster.setAttribute("data-bay", "1");
}

function frameClassFor(phase: HeroIntroPhase): string {
  switch (phase) {
    case "arrived":
      return "hero-bay-frame hero-bay-frame--full hero-bay-frame--breathe";
    case "expand":
      return "hero-bay-frame hero-bay-frame--expand";
    case "zoom":
    case "boot":
      return "hero-bay-frame hero-bay-frame--zoom";
    default: {
      const _exhaustive: never = phase;
      return _exhaustive;
    }
  }
}

function bufferProgress(video: HTMLVideoElement, readyBufferS: number): number {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && Number.isFinite(video.duration) && video.duration > 0) {
    const end = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
    return Math.min(1, end / Math.min(video.duration, readyBufferS * 4));
  }
  if (video.buffered.length > 0) {
    const end = video.buffered.end(video.buffered.length - 1);
    return Math.min(1, end / readyBufferS);
  }
  return video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? 0.55 : 0.08;
}

function HeroFilmLoader({ progress, wiping }: { progress: number; wiping: boolean }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return (
    <div
      className={`hero-film-loader ${wiping ? "hero-film-loader--wipe" : ""}`}
      aria-hidden="true"
    >
      <div className="hero-film-loader__mark">
        <img
          src={`${import.meta.env.BASE_URL}brand/logo.png`}
          alt=""
          className="h-14 w-auto @3xl:h-16"
          decoding="async"
        />
        <p className="hero-film-loader__pct font-display text-sm font-semibold tracking-[0.18em] text-white/85">
          {`${pct}%`}
        </p>
      </div>
    </div>
  );
}

export function HeroVideo({ onPhase }: { onPhase?: (phase: HeroIntroPhase) => void } = {}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const bayRef = useRef<HTMLDivElement>(null);
  const fitReady = useRef(false);
  const [fit, setFit] = useState<EndCardFit | null>(null);
  const [phase, setPhase] = useState<HeroIntroPhase>(INITIAL_INTRO);
  const [loadProgress, setLoadProgress] = useState(0);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    // `?intro=play` forces the cinematic boot for visual QA even under webdriver.
    const forceIntro = new URLSearchParams(window.location.search).get("intro") === "play";
    const skipIntro = (reduce || navigator.webdriver) && !forceIntro;

    if (skipIntro) {
      fitReady.current = true;
      setPhase("arrived");
      setWiping(false);
      setLoadProgress(1);
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
      setPhase("boot");
      setWiping(false);
      setLoadProgress(0.04);
    } else {
      hideLcpPoster();
    }

    const video = ref.current;
    if (!video) return;
    if (skipIntro) registerHeroVideo(video);
    const timing = introTiming();
    const mobilePrimary = window.matchMedia("(max-width: 767px)").matches;
    applyIntroMotionVars(timing);
    const frame = bayRef.current;
    let cancel = false;
    let expandTimer = 0;
    let arriveTimer = 0;
    let wipeTimer = 0;
    let zoomTimer = 0;
    let primed = false;

    const syncFit = () => {
      if (!fitReady.current) return;
      const onCard = video.currentTime >= END_CARD_AT;
      const box = frame?.getBoundingClientRect();
      const next = onCard && box ? endCardFit(box, mobilePrimary) : null;
      setFit((current) => {
        if (current === null && next === null) return current;
        if (current && next && Math.abs(current.scale - next.scale) < 0.001) return current;
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

    const startExpand = () => {
      if (cancel) return;
      document.documentElement.classList.add("media-on");
      // Sound / unmute attempt starts as the bay expands into full bleed.
      registerHeroVideo(video);
      if (skipIntro) {
        armFit();
        return;
      }
      setPhase("expand");
      expandTimer = window.setTimeout(() => {
        if (cancel) return;
        armFit();
      }, timing.expandMs);
    };

    const leaveBoot = () => {
      if (cancel || primed) return;
      primed = true;
      setLoadProgress(1);
      setWiping(true);
      wipeTimer = window.setTimeout(() => {
        if (cancel) return;
        setPhase("zoom");
        setWiping(false);
        zoomTimer = window.setTimeout(() => {
          if (cancel) return;
          startExpand();
        }, timing.zoomHoldMs);
      }, timing.wipeMs);
    };

    const readProgress = () => {
      if (cancel || primed || skipIntro) return;
      const next = bufferProgress(video, timing.readyBufferS);
      setLoadProgress((current) => Math.max(current, next));
      const buffered =
        video.buffered.length > 0 && video.buffered.end(video.buffered.length - 1) >= timing.readyBufferS;
      // Phones leave on first playable frame; desktop waits for a short future buffer.
      const readyStateFloor = mobilePrimary
        ? HTMLMediaElement.HAVE_CURRENT_DATA
        : HTMLMediaElement.HAVE_FUTURE_DATA;
      if (buffered || video.readyState >= readyStateFloor) leaveBoot();
    };

    const idleSkip = () => {
      const schedule = window.requestIdleCallback?.bind(window);
      if (schedule) schedule(startExpand, { timeout: 1500 });
      else arriveTimer = window.setTimeout(startExpand, 1);
    };

    if (skipIntro) {
      if (document.readyState === "complete") idleSkip();
      else window.addEventListener("load", idleSkip, { once: true });
    } else {
      video.muted = true;
      video.preload = "auto";
      // Quiet muted play primes the buffer while the branded loader counts up.
      void video.play().catch(() => undefined);
      video.addEventListener("progress", readProgress);
      video.addEventListener("loadeddata", readProgress);
      video.addEventListener("canplay", readProgress);
      video.addEventListener("canplaythrough", leaveBoot);
      // Safety: never trap visitors on the loader if buffering stalls.
      arriveTimer = window.setTimeout(leaveBoot, timing.stallMs);
      readProgress();
    }

    document.addEventListener("visibilitychange", onVis);
    const observer = new ResizeObserver(syncFit);
    if (frame) observer.observe(frame);

    return () => {
      cancel = true;
      window.clearTimeout(expandTimer);
      window.clearTimeout(arriveTimer);
      window.clearTimeout(wipeTimer);
      window.clearTimeout(zoomTimer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("load", idleSkip);
      video.removeEventListener("progress", readProgress);
      video.removeEventListener("loadeddata", readProgress);
      video.removeEventListener("canplay", readProgress);
      video.removeEventListener("canplaythrough", leaveBoot);
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

  const showLoader = phase === "boot" || wiping;

  return (
    <div ref={bayRef} className={`absolute inset-0 overflow-hidden ${phase === "arrived" ? "" : "bg-ink"}`}>
      <div className={frameClassFor(phase)}>
        {/* Full 1920 poster — the tiny mobile poster looked muddy under load zoom. */}
        <picture className="absolute inset-0 block h-full w-full">
          <img
            src={HERO_MEDIA.poster}
            alt="Indoor golf at Par2Play in Somerset, NJ"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <video
          ref={ref}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          style={
            fit
              ? {
                  transform: `scale(${fit.scale})`,
                  transformOrigin: "50% 48%",
                }
              : undefined
          }
          loop
          playsInline
          preload={phase === "arrived" ? "metadata" : "auto"}
          muted
          aria-hidden="true"
        >
          {/* Hi-DPI phones get the 1080p cut so the end card stays sharp. */}
          <source src={HERO_MEDIA.mp4} type="video/mp4" media="(max-width: 767px) and (min-resolution: 2dppx)" />
          <source src={HERO_MEDIA.mp4Mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={HERO_MEDIA.webm} type="video/webm" media="(min-width: 768px)" />
          <source src={HERO_MEDIA.mp4} type="video/mp4" />
        </video>
      </div>
      {showLoader ? <HeroFilmLoader progress={loadProgress} wiping={wiping} /> : null}
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
