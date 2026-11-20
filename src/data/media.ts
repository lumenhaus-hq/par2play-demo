/**
 * Hero film paths. The current cut is v3 (29.3s, 1920×1080) with the
 * approved soundtrack muxed in: AAC on the mp4, Opus on the webm.
 * The aerial is fully generated, so there is no satellite-imagery credit.
 * The poster is unchanged and is also the Open Graph / Twitter image.
 * The opening Earth frame plays from hero.mp4 with a CSS zoom. The separate
 * NY→NJ map files are not requested.
 *   public/media/hero.mp4
 *   public/media/hero.webm
 *   public/media/hero-poster.jpg
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
