const media = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/**
 * Client testimonial films for the membership background.
 * Desktop files are 1280×720. Mobile files are 720×406.
 * Order starts with the group countdown, then the earlier three clips.
 */
export type TestimonialFilm = {
  id: string;
  src: string;
  srcMobile: string;
  poster: string;
};

export const TESTIMONIAL_FILMS: readonly TestimonialFilm[] = [
  {
    id: "testimonial-4",
    src: media("media/testimonials/testimonial-4.mp4"),
    srcMobile: media("media/testimonials/testimonial-4-mobile.mp4"),
    poster: media("media/testimonials/testimonial-4-poster.jpg"),
  },
  {
    id: "testimonial-1",
    src: media("media/testimonials/testimonial-1.mp4"),
    srcMobile: media("media/testimonials/testimonial-1-mobile.mp4"),
    poster: media("media/testimonials/testimonial-1.jpg"),
  },
  {
    id: "testimonial-3",
    src: media("media/testimonials/testimonial-3.mp4"),
    srcMobile: media("media/testimonials/testimonial-3-mobile.mp4"),
    poster: media("media/testimonials/testimonial-3.jpg"),
  },
  {
    id: "testimonial-2",
    src: media("media/testimonials/testimonial-2.mp4"),
    srcMobile: media("media/testimonials/testimonial-2-mobile.mp4"),
    poster: media("media/testimonials/testimonial-2.jpg"),
  },
];

export const JUNIORS_FILM = {
  src: media("media/juniors/juniors-loop.mp4"),
  srcMobile: media("media/juniors/juniors-loop-mobile.mp4"),
  poster: media("media/juniors/juniors-loop-poster.jpg"),
} as const;

/** Still behind the home membership band. The montage video is not loaded. */
export const MEMBERSHIP_POSTER = {
  src: media("media/membership/montage-poster.jpg"),
  alt: "Golfers on a simulator at Par2Play",
  width: 1280,
  height: 720,
} as const;

export const EVENTS_HERO_FILM = {
  src: media("media/events/events-hero.mp4"),
  srcMobile: media("media/events/events-hero-mobile.mp4"),
  poster: media("media/events/events-hero-poster.jpg"),
  posterAvif: media("media/events/events-hero-poster.avif"),
  posterWebp: media("media/events/events-hero-poster.webp"),
  width: 800,
  height: 450,
} as const;
