/**
 * Hero film paths. The current cut is v3 (29.3s, 1920×1080) with the
 * approved soundtrack muxed in: AAC on the mp4, Opus on the webm.
 * The aerial is fully generated, so there is no satellite-imagery credit.
 * The poster is unchanged and is also the Open Graph / Twitter image.
 *   public/media/hero.mp4
 *   public/media/hero.webm
 *   public/media/hero-poster.jpg
 *
 * Short LP5-style storefront zoom intro (2.4s, same 1920×1080 / 30fps HD
 * pipeline) — see heroIntroZoom.ts. Silent; reduced-motion uses its poster.
 *   public/media/hero-intro-zoom.mp4
 *   public/media/hero-intro-zoom.webm
 *   public/media/hero-intro-zoom-poster.jpg
 */
const media = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const HERO_MEDIA = {
  mp4: media("media/hero.mp4"),
  mp4Mobile: media("media/hero-mobile.mp4"),
  webm: media("media/hero.webm"),
  poster: media("media/hero-poster.jpg"),
  posterMobileAvif: media("media/hero-poster-mobile.avif"),
  posterMobileWebp: media("media/hero-poster-mobile.webp"),
} as const;

/** Map→storefront zoom that plays once before the looping hero film. */
export const HERO_INTRO_MEDIA = {
  // Cache-bust when the cut changes (Pages CDN can keep stale hero-intro-zoom.*).
  mp4: media("media/hero-intro-zoom.mp4?v=world3"),
  webm: media("media/hero-intro-zoom.webm?v=world3"),
  poster: media("media/hero-intro-zoom-poster.jpg?v=world3"),
  /** Seconds — must stay ≤ HERO_INTRO_ZOOM.timing.maxSeconds. */
  durationS: 2.4,
  /** Seek the looping hero here so the handoff stays on the dusk storefront. */
  loopHandoffS: 6.2,
  alt: "Animated HD map of New York zooming into New Jersey with golf icons, ending on the Par2Play storefront in Somerset",
} as const;

/**
 * Bar-aligned background loop (35.41s). The m4a is the seamless Web Audio
 * source. The mp3 is a fallback only: encoder padding leaves a gap at the join.
 */
export const BG_LOOP = {
  m4a: media("media/bg_loop_A.m4a"),
  mp3: media("media/bg_loop_A.mp3"),
} as const;

export type ClipId = "venue" | "highfive" | "crew" | "junior" | "coaching";

export type ClipAsset = {
  id: ClipId;
  caption: string;
  label: string;
  mp4: string;
  webm: string;
  poster: string;
};

function clip(id: ClipId, caption: string, label: string): ClipAsset {
  return {
    id,
    caption,
    label,
    mp4: media(`media/clips/${id}.mp4`),
    webm: media(`media/clips/${id}.webm`),
    poster: media(`media/clips/${id}-poster.jpg`),
  };
}

/** Trimmed illustrative loops (about 1.6–2.2s). Not photographs of members. */
export const CLIPS: ClipAsset[] = [
  clip("venue", "Come for the game", "Illustrative loop of simulator bays at Par2Play"),
  clip("highfive", "Stay for the crew", "Illustrative loop of players celebrating a shot"),
  clip("crew", "The room after the round", "Illustrative loop of friends in the lounge"),
  clip("junior", "Juniors welcome", "Illustrative loop of a junior clinic"),
  clip("coaching", "Coaching by PGA pros", "Illustrative loop of a coach and a player reviewing a swing"),
];
