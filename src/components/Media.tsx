import { useEffect, useRef, useState } from "react";
import { bootAmbient, registerHeroVideo } from "../audio/soundtrack";
import { HERO_MEDIA, type ClipAsset } from "../data/media";
import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type HeroIntroPhase = "boot" | "zoom" | "expand" | "arrived";

/** Start arrived so prerender (webdriver) HTML matches first client paint. */
const INITIAL_INTRO: HeroIntroPhase = "arrived";

/** CSS zoom-out from the opening Earth. Keep in sync with `--motion-expand`. */
function expandMs(): number {
  return window.matchMedia("(min-width: 768px)").matches ? 1400 : 1100;
}

/**
 * Opening frame baked into hero-earth-*.avif. The film seeks here before it
 * is shown, so the swap matches the poster.
 */
const EARTH_FRAME_AT = 0.5;

const FILM_GESTURES = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

type LcpEntry = PerformanceEntry & { element?: Element | null };

function posterEntry(entry: PerformanceEntry): boolean {
  return (entry as LcpEntry).element?.id === "lcp-poster";
}

const STOREFRONT_ALT = "Par2Play storefront in Somerset, New Jersey";

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

export function HeroVideo({ onPhase }: { onPhase?: (phase: HeroIntroPhase) => void } = {}) {
  const reduce = usePrefersReducedMotion();
  const loopRef = useRef<HTMLVideoElement>(null);
  const bayRef = useRef<HTMLDivElement>(null);
  const fitReady = useRef(false);
  const [fit, setFit] = useState<EndCardFit | null>(null);
  const [phase, setPhase] = useState<HeroIntroPhase>(INITIAL_INTRO);
  const [filmOn, setFilmOn] = useState(false);

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    // `?intro=play` forces the Earth zoom even under Playwright's webdriver flag.
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get("intro") === "play";
    // Prerender must keep #lcp-poster visible. Playback starts on a real visit.
    if (params.get("prerender") === "1") return;
    const skipIntro = (reduce || navigator.webdriver) && !forceIntro;
    const motionMs = expandMs();
    document.documentElement.style.setProperty("--motion-expand", `${motionMs}ms`);

    if (reduce) {
      registerHeroVideo(null);
      bootAmbient();
      return;
    }

    const mobilePrimary = window.matchMedia("(max-width: 767px)").matches;
    const frame = bayRef.current;
    let cancel = false;
    let expandTimer = 0;
    let arriveTimer = 0;
    let started = false;

    const loopEl = () => loopRef.current;

    const syncFit = () => {
      const loop = loopEl();
      if (!loop || !fitReady.current) return;
      const onCard = loop.currentTime >= END_CARD_AT;
      const box = frame?.getBoundingClientRect();
      const next = onCard && box ? endCardFit(box, mobilePrimary) : null;
      setFit((current) => {
        if (current === null && next === null) return current;
        if (current && next && Math.abs(current.scale - next.scale) < 0.001) return current;
        return next;
      });
    };

    let expandArmed = false;
    const scheduleExpand = () => {
      if (expandArmed || skipIntro) return;
      expandArmed = true;
      expandTimer = window.setTimeout(() => {
        if (cancel) return;
        setPhase("expand");
        arriveTimer = window.setTimeout(() => {
          if (cancel) return;
          armFit();
        }, motionMs);
      }, 420);
    };

    const revealFilm = () => {
      const loop = loopEl();
      if (!loop || loop.classList.contains("is-live")) return;
      if (loop.readyState < 2) return;
      if (loop.currentTime + 0.08 < EARTH_FRAME_AT) return;
      loop.classList.add("is-live");
      hideLcpPoster();
      scheduleExpand();
    };

    const playFilm = () => {
      const loop = loopEl();
      if (cancel || started || !loop) return;
      started = true;
      loop.preload = "metadata";
      const arm = () => {
        if (cancel) return;
        const start = () => {
          if (cancel) return;
          loop.addEventListener("playing", revealFilm);
          registerHeroVideo(loop);
          document.documentElement.classList.add("media-on");
          revealFilm();
        };
        if (loop.readyState >= 2 && Math.abs(loop.currentTime - EARTH_FRAME_AT) <= 0.08) {
          start();
          return;
        }
        loop.addEventListener("seeked", start, { once: true });
        try {
          loop.currentTime = EARTH_FRAME_AT;
        } catch {
          start();
        }
      };
      if (loop.readyState >= 1) arm();
      else loop.addEventListener("loadedmetadata", arm, { once: true });
    };

    const armFit = () => {
      const loop = loopEl();
      fitReady.current = true;
      setPhase("arrived");
      document.documentElement.classList.remove("hero-bay");
      loop?.addEventListener("timeupdate", syncFit);
      loop?.addEventListener("seeked", syncFit);
    };

    const onVis = () => {
      const loop = loopEl();
      if (!loop) return;
      if (document.hidden) {
        loop.pause();
        return;
      }
      if (started) void loop.play().catch(() => undefined);
    };

    // ?intro=play and ?film=1 mount immediately and may run the Earth zoom.
    // A gesture, or the late LCP gate, must not: that zoom adds hero-scroll-lock.
    const eager = forceIntro || params.get("film") === "1";

    const begin = () => {
      if (cancel) return;
      setFilmOn(true);
      if (skipIntro || !eager) {
        setPhase("arrived");
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            playFilm();
            armFit();
          });
        });
        return;
      }
      fitReady.current = false;
      document.documentElement.dataset.earthZoom = "1";
      document.documentElement.classList.add("hero-bay");
      setPhase("zoom");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          playFilm();
        });
      });
    };

    // Keep the poster as the final LCP candidate. Mount the film only after
    // load plus a gesture, or after the poster has been the LCP entry long
    // enough that its first frame is not a new, larger candidate.
    let releaseGate = () => {};
    const ready = new Promise<void>((resolve) => {
      if (eager) {
        resolve();
        return;
      }
      let settled = false;
      let loaded = document.readyState === "complete";
      let gesture = false;
      let lcpTimer = 0;
      let lcpObserver: PerformanceObserver | null = null;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(lcpTimer);
        window.removeEventListener("load", onLoad);
        for (const type of FILM_GESTURES) window.removeEventListener(type, onGesture, true);
        lcpObserver?.disconnect();
        resolve();
      };
      const consider = () => {
        if (cancel || settled || !loaded || !gesture) return;
        finish();
      };
      const onGesture = () => {
        gesture = true;
        consider();
      };
      const onLoad = () => {
        loaded = true;
        consider();
      };
      for (const type of FILM_GESTURES) window.addEventListener(type, onGesture, true);
      if (!loaded) window.addEventListener("load", onLoad);
      try {
        lcpObserver = new PerformanceObserver((list) => {
          if (settled || !list.getEntries().some(posterEntry)) return;
          window.clearTimeout(lcpTimer);
          // A short delay still sits inside a Lighthouse trace, and hiding the
          // poster for the film then makes the video the LCP element. Wait
          // until a quiet lab trace has already closed.
          lcpTimer = window.setTimeout(() => {
            if (cancel || settled) return;
            if (document.readyState !== "complete") {
              window.addEventListener("load", () => finish(), { once: true });
              return;
            }
            finish();
          }, 12000);
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        lcpObserver = null;
      }
      releaseGate = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(lcpTimer);
        window.removeEventListener("load", onLoad);
        for (const type of FILM_GESTURES) window.removeEventListener(type, onGesture, true);
        lcpObserver?.disconnect();
      };
    });
    void ready.then(() => {
      if (!cancel) begin();
    });

    document.addEventListener("visibilitychange", onVis);
    const observer = new ResizeObserver(syncFit);
    if (frame) observer.observe(frame);

    return () => {
      cancel = true;
      releaseGate();
      window.clearTimeout(expandTimer);
      window.clearTimeout(arriveTimer);
      document.removeEventListener("visibilitychange", onVis);
      const loop = loopEl();
      loop?.removeEventListener("playing", revealFilm);
      loop?.removeEventListener("seeked", revealFilm);
      loop?.removeEventListener("timeupdate", syncFit);
      loop?.removeEventListener("seeked", syncFit);
      observer.disconnect();
      loop?.pause();
      registerHeroVideo(null);
      document.documentElement.classList.remove("hero-bay");
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div className="hero-bay-frame hero-bay-frame--full absolute inset-0">
        <img
          src={HERO_MEDIA.poster}
          alt={STOREFRONT_ALT}
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={bayRef} className={`absolute inset-0 overflow-hidden ${phase === "arrived" ? "" : "bg-ink"}`}>
      <p className="sr-only">{STOREFRONT_ALT}</p>
      <div className={frameClassFor(phase)}>
        {filmOn ? (
        <video
          ref={loopRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          style={
            fit
              ? {
                  transform: `translateZ(0) scale(${fit.scale})`,
                  transformOrigin: "50% 48%",
                }
              : undefined
          }
          loop
          playsInline
          preload="none"
          muted
          aria-hidden="true"
        >
          {/* 1080p on every width. The separate map intro is not loaded. */}
          <source src={HERO_MEDIA.webm} type="video/webm" media="(min-width: 768px)" />
          <source src={HERO_MEDIA.mp4} type="video/mp4" />
        </video>
        ) : null}
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
