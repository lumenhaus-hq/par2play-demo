import { HERO_MEDIA } from "../data/media";
import { MEMBERSHIP_POSTER } from "../data/films";

const BOOT_CLASS = "landing-booting";

function heroFilmSrc(): string {
  if (typeof window === "undefined") return HERO_MEDIA.mp4;
  return window.matchMedia("(max-width: 767px)").matches ? HERO_MEDIA.mp4Mobile : HERO_MEDIA.mp4;
}

function warmImage(src: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const img = new Image();
    let settled = false;
    const onDone = () => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      resolve();
    };
    const onAbort = () => {
      if (settled) return;
      settled = true;
      img.src = "";
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    img.onload = onDone;
    img.onerror = onDone;
    img.decoding = "async";
    img.src = src;
    if (img.complete) onDone();
  });
}

/** Decode enough of the hero cut that the first paint after reveal is not empty. */
function warmVideo(src: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");

    let settled = false;
    let timer = 0;

    const cleanup = () => {
      signal.removeEventListener("abort", onAbort);
      window.clearTimeout(timer);
      video.removeAttribute("src");
      video.load();
      video.remove();
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });

    const check = () => {
      if (settled || signal.aborted) return;
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) finish();
    };

    video.addEventListener("canplaythrough", finish, { once: true });
    video.addEventListener("loadeddata", check);
    video.addEventListener("error", finish, { once: true });
    video.src = src;
    video.load();
    // Cap wait so a stalled CDN cannot pin the loader forever.
    timer = window.setTimeout(finish, 8000);
  });
}

/**
 * Hold the landing under a plain boot plate until the hero film, membership
 * still, and fonts are warm. Then flip ticker/media on and lift the plate.
 * Offer ticker marks are inline SVG — fonts are the only ticker asset gate.
 */
export function runLandingBoot(): Promise<() => void> {
  if (typeof document === "undefined") return Promise.resolve(() => {});

  const params = new URLSearchParams(window.location.search);
  if (params.get("prerender") === "1") {
    document.documentElement.classList.add("ticker-on", "media-on");
    return Promise.resolve(() => {});
  }

  const html = document.documentElement;
  html.classList.add(BOOT_CLASS);
  html.classList.remove("ticker-on");
  window.scrollTo(0, 0);

  const controller = new AbortController();
  const { signal } = controller;

  const done = Promise.all([
    warmImage(MEMBERSHIP_POSTER.src, signal),
    warmVideo(heroFilmSrc(), signal),
    document.fonts?.ready ?? Promise.resolve(),
  ])
    .catch(() => undefined)
    .then(() => {
      if (signal.aborted) return;
      html.classList.add("ticker-on", "media-on");
      html.classList.remove(BOOT_CLASS);
    });

  return done.then(() => () => {
    controller.abort();
    html.classList.remove(BOOT_CLASS);
  });
}

export function isLandingBooting(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains(BOOT_CLASS);
}
