import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function bufferedSpan(loop: HTMLVideoElement): number {
  if (loop.buffered.length === 0) return 0;
  return loop.buffered.end(loop.buffered.length - 1) - loop.buffered.start(0);
}

/** canplaythrough, or enough decoded media to start without an empty fade. */
function bufferReady(loop: HTMLVideoElement): boolean {
  if (loop.readyState >= 4) return true;
  const span = bufferedSpan(loop);
  if (loop.readyState >= 3 && span >= 1.25) return true;
  if (loop.readyState >= 2 && Number.isFinite(loop.duration) && loop.duration > 0 && span / loop.duration >= 0.12) {
    return true;
  }
  return false;
}

function bufferFraction(loop: HTMLVideoElement): number | null {
  if (!Number.isFinite(loop.duration) || loop.duration <= 0 || loop.buffered.length === 0) return null;
  return Math.max(0, Math.min(1, loop.buffered.end(loop.buffered.length - 1) / loop.duration));
}

const BUFFER_RADIUS = 10;
const BUFFER_TURN = 2 * Math.PI * BUFFER_RADIUS;

/** Thin lime ring in the hero corner. Does not take hits or change layout. */
function HeroBuffer({ progress }: { progress: number | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const place = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      const box = hero.getBoundingClientRect();
      const visible = box.bottom > 72 && box.top < window.innerHeight;
      node.style.visibility = visible ? "visible" : "hidden";
      node.style.top = `${box.top + 84}px`;
      node.style.left = `${box.left + 16}px`;
    };
    place();
    const options = { passive: true } as const;
    window.addEventListener("scroll", place, options);
    window.addEventListener("resize", place, options);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  const indeterminate = progress === null;
  const offset = indeterminate ? BUFFER_TURN * 0.72 : BUFFER_TURN * (1 - progress);

  return createPortal(
    <div
      ref={ref}
      className={`hero-buffer${indeterminate ? " hero-buffer--wait" : ""}`}
      data-hero-loader
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 28" focusable="false">
        <circle className="hero-buffer__track" cx="14" cy="14" r={BUFFER_RADIUS} />
        <circle
          className="hero-buffer__value"
          cx="14"
          cy="14"
          r={BUFFER_RADIUS}
          strokeDasharray={`${BUFFER_TURN} ${BUFFER_TURN}`}
          strokeDashoffset={offset}
        />
      </svg>
    </div>,
    document.body,
  );
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

export function HeroVideo({
  onPhase,
  bootReady = true,
}: { onPhase?: (phase: HeroIntroPhase) => void; bootReady?: boolean } = {}) {
  const reduce = usePrefersReducedMotion();
  const loopRef = useRef<HTMLVideoElement>(null);
  const bayRef = useRef<HTMLDivElement>(null);
  const fitReady = useRef(false);
  const [fit, setFit] = useState<EndCardFit | null>(null);
  const [phase, setPhase] = useState<HeroIntroPhase>(INITIAL_INTRO);
  const [filmOn, setFilmOn] = useState(false);
  const [preloadMode, setPreloadMode] = useState<"none" | "metadata" | "auto">("none");
  const [buffering, setBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState<number | null>(null);

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    // Hold the film until the landing boot plate lifts — assets are already warm.
    if (!bootReady) return;
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
      hideLcpPoster();
      return;
    }

    const mobilePrimary = window.matchMedia("(max-width: 767px)").matches;
    const frame = bayRef.current;
    let cancel = false;
    let expandTimer = 0;
    let arriveTimer = 0;
    let seekTimer = 0;
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
      loop.removeEventListener("timeupdate", revealFilm);
      hideLcpPoster();
      setBuffering(false);
      scheduleExpand();
    };

    const publishBuffer = (loop: HTMLVideoElement) => {
      const next = bufferFraction(loop);
      setBufferProgress((current) => {
        if (current === next) return current;
        if (current !== null && next !== null && Math.abs(current - next) < 0.03) return current;
        return next;
      });
    };

    let stopBufferWait = () => {};
    const whenBuffered = (loop: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        const finish = () => {
          stopBufferWait();
          resolve();
        };
        const check = () => {
          if (cancel) {
            finish();
            return;
          }
          publishBuffer(loop);
          if (bufferReady(loop)) finish();
        };
        stopBufferWait = () => {
          loop.removeEventListener("canplaythrough", check);
          loop.removeEventListener("canplay", check);
          loop.removeEventListener("progress", check);
          loop.removeEventListener("loadeddata", check);
        };
        if (bufferReady(loop)) {
          finish();
          return;
        }
        loop.addEventListener("canplaythrough", check);
        loop.addEventListener("canplay", check);
        loop.addEventListener("progress", check);
        loop.addEventListener("loadeddata", check);
      });

    const playFilm = (waitForBuffer: boolean) => {
      const loop = loopEl();
      if (cancel || started || !loop) return;
      started = true;
      loop.setAttribute("fetchpriority", "low");
      if (loop.preload !== "auto") loop.preload = "metadata";
      const arm = () => {
        if (cancel) return;
        const start = () => {
          if (cancel || loop.classList.contains("is-live")) return;
          loop.addEventListener("playing", revealFilm);
          loop.addEventListener("timeupdate", revealFilm);
          registerHeroVideo(loop);
          document.documentElement.classList.add("media-on");
          revealFilm();
        };
        if (loop.readyState >= 2 && Math.abs(loop.currentTime - EARTH_FRAME_AT) <= 0.08) {
          start();
          return;
        }
        let opened = false;
        const open = () => {
          if (opened) return;
          opened = true;
          start();
        };
        loop.addEventListener("seeked", open, { once: true });
        try {
          loop.currentTime = EARTH_FRAME_AT;
        } catch {
          open();
          return;
        }
        seekTimer = window.setTimeout(() => {
          if (!opened && !cancel) open();
        }, 500);
      };
      const startArm = () => {
        if (cancel) return;
        if (loop.readyState >= 1) arm();
        else loop.addEventListener("loadedmetadata", arm, { once: true });
      };
      if (!waitForBuffer) {
        startArm();
        return;
      }
      void whenBuffered(loop).then(() => {
        if (!cancel) startArm();
      });
    };

    const armFit = () => {
      const loop = loopEl();
      fitReady.current = true;
      setPhase("arrived");
      document.documentElement.classList.remove("hero-bay");
      loop?.addEventListener("timeupdate", syncFit);
      loop?.addEventListener("seeked", syncFit);
    };

    // Boot plate already warmed the film. Start immediately after reveal.
    // ?intro=play still runs the Earth zoom; ?film=1 forces an eager cut.
    const eager = true;
    const forceZoom = forceIntro || params.get("film") === "1";

    const begin = () => {
      if (cancel) return;
      const zoom = forceZoom && !skipIntro;
      setPreloadMode(zoom ? "metadata" : "auto");
      setBuffering(false);
      setFilmOn(true);
      if (!zoom) {
        setPhase("arrived");
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            playFilm(Boolean(eager));
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
          playFilm(false);
        });
      });
    };

    begin();

    const observer = new ResizeObserver(syncFit);
    if (frame) observer.observe(frame);

    // Freeze decode on the first wheel/scroll — even while the bay still fills
    // the screen — then only resume when the visitor is parked back at the top.
    const heroNode = document.getElementById("hero");
    const filmShouldPlay = (ratio: number) =>
      !document.hidden && window.scrollY < 32 && ratio >= 0.55;

    const syncPlayback = (ratio = 1) => {
      const loop = loopEl();
      if (!loop || !started || cancel) return;
      if (filmShouldPlay(ratio)) void loop.play().catch(() => undefined);
      else loop.pause();
    };

    const onVis = () => syncPlayback();
    const onScrollFilm = () => syncPlayback();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScrollFilm, { passive: true });
    window.addEventListener("wheel", onScrollFilm, { passive: true });

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        syncPlayback(entry.intersectionRatio);
      },
      { threshold: [0, 0.2, 0.55, 0.75, 1] },
    );
    if (heroNode) viewObserver.observe(heroNode);

    return () => {
      cancel = true;
      stopBufferWait();
      window.clearTimeout(expandTimer);
      window.clearTimeout(arriveTimer);
      window.clearTimeout(seekTimer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScrollFilm);
      window.removeEventListener("wheel", onScrollFilm);
      const loop = loopEl();
      loop?.removeEventListener("playing", revealFilm);
      loop?.removeEventListener("seeked", revealFilm);
      loop?.removeEventListener("timeupdate", revealFilm);
      loop?.removeEventListener("timeupdate", syncFit);
      loop?.removeEventListener("seeked", syncFit);
      observer.disconnect();
      viewObserver.disconnect();
      loop?.pause();
      registerHeroVideo(null);
      document.documentElement.classList.remove("hero-bay");
    };
  }, [reduce, bootReady]);

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
        {buffering ? <HeroBuffer progress={bufferProgress} /> : null}
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
          preload={preloadMode}
          muted
          aria-hidden="true"
        >
          {/* Phones decode 720p; desktop keeps the 1080p webm/mp4 pair. */}
          <source src={HERO_MEDIA.mp4Mobile} type="video/mp4" media="(max-width: 767px)" />
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
