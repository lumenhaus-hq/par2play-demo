/**
 * Locked HD delivery brief for the Par2Play hero intro: a single continuous
 * zoom from a LP5-style stylized city map into the Hamilton Street storefront.
 *
 * Reference motion: https://marseille.laphase5.com/ (Awwwards “Zoom in transition”).
 * End plate: public/photos/storefront.jpg (dusk, glass front, green “2”).
 * Site pipeline: FRAME_W/H 1920×1080 in Media.tsx; hero film is already 1080p/30.
 *
 * This module is the contract for generative / edit vendors. Do not ship a cut
 * that fails any MUST. Prefer fields below over ad-hoc prompts.
 */

export const HERO_INTRO_ZOOM = {
  id: "hero-intro-zoom-v1",
  title: "Par2Play storefront zoom intro",
  referenceUrl: "https://marseille.laphase5.com/",
  destination: {
    name: "Par2Play",
    address: "695 Hamilton Street, Suite G, Somerset, NJ 08873",
    /** Listing coords from schema.ts notes — not verified on par2play.com. */
    approxLatLng: { lat: 40.49134, lng: -74.47402 },
    endPlate: "public/photos/storefront.jpg",
  },

  /** Creative brief — one continuous push, no hard cuts. */
  shot: {
    style:
      "HD stylized map of New York diving west into New Jersey, with larger-than-life cartoon golf UI icons, then resolve into the real storefront photograph.",
    start:
      "Wide HD aerial of the NY metro (Manhattan + Hudson + NJ). Dark navy water, peach extruded NYC blocks, mint NJ suburbs. Oversized cartoon icons: golf ball, flag, crossed clubs, map pin.",
    middle:
      "Continuous ease-in-out dive from NYC toward New Jersey / Somerset. Icons stay large and crisp in HD; no LP5 peach-only abstract field without NY geography.",
    end:
      "Photoreal Par2Play storefront at dusk matching storefront.jpg: brick facade, lit PAR 2 PLAY channel letters (green 2), INDOOR GOLF on the transom, glass doors centered. Hold the last beat so the bay can expand.",
    forbidden: [
      "Satellite / Google Earth watermark or credit",
      "Cuts, whip pans, or mid-zoom strobing",
      "Soft upscaled tiny icons — icons must be HD-native and larger than life",
      "Abstract building field with no recognizable NY→NJ geography",
      "Purple neon / glow-slop grading",
      "Ending on an interior bay before the storefront is readable",
    ],
  },

  /** Timing — user brief: less than 2–3 seconds. */
  timing: {
    targetSeconds: 2.4,
    minSeconds: 2.0,
    maxSeconds: 2.8,
    hardFailAboveSeconds: 3.0,
    beats: [
      { at: "0.00–0.35s", beat: "Macro map establish + pin visible" },
      { at: "0.35–1.80s", beat: "Continuous zoom into the pin" },
      { at: "1.80–2.40s", beat: "Resolve to storefront; hold last 0.3–0.5s" },
    ],
  },

  /**
   * Master + web deliverables. Match the shipped hero.mp4 / hero.webm pipeline
   * so HeroVideo can swap or prepend without new layout math.
   */
  hd: {
    aspectRatio: "16:9",
    width: 1920,
    height: 1080,
    /** Optional generative master; always downscale to 1920×1080 for the site. */
    sourceMasterWidth: 3840,
    sourceMasterHeight: 2160,
    frameRate: 30,
    frameRateMode: "CFR",
    pixelAspect: "1:1",
    fieldOrder: "progressive",
    colorPrimaries: "bt709",
    colorTransfer: "bt709",
    colorSpace: "bt709",
    colorRange: "tv",
    pixFmt: "yuv420p",
    safeFraming: "full-bleed object-cover; keep the green 2 and doors inside the center 70% for phone crop",
  },

  encode: {
    mp4: {
      path: "public/media/hero-intro-zoom.mp4",
      videoCodec: "h264",
      profile: "High",
      level: "5.0",
      /** Short clip — prefer quality over size. */
      videoBitrateKbps: { min: 3500, target: 5000, max: 8000 },
      audioCodec: "aac",
      audioProfile: "LC",
      sampleRate: 48000,
      channels: 2,
      /** Silent is fine; soft whoosh only if it does not fight the soundtrack. */
      audioBitrateKbps: 160,
    },
    webm: {
      path: "public/media/hero-intro-zoom.webm",
      videoCodec: "vp9",
      audioCodec: "opus",
      sampleRate: 48000,
      channels: 2,
    },
    poster: {
      path: "public/media/hero-intro-zoom-poster.jpg",
      width: 1920,
      height: 1080,
      frame: "final storefront hold (not the black open)",
    },
  },

  /** How this cut plugs into the existing HeroVideo phases. */
  siteHandoff: {
    phases: "boot → wipe → zoom(film) → expand → arrived",
    note:
      "The film carries the LP5 dive. Keep CSS zoomHold brief; expand opens the bay once the storefront hold is on screen. Last frame must match the dusk storefront plate for a clean expand.",
    desktopCssMs: { wipe: 300, zoomHold: 60, expand: 620 },
    mobileCssMs: { wipe: 240, zoomHold: 40, expand: 480 },
  },

  acceptance: [
    "Duration ≤ 2.8s (fail if > 3.0s)",
    "1920×1080, 30fps CFR, yuv420p, bt709",
    "One continuous zoom — no cuts",
    "Storefront sign readable on a 390px-wide phone crop",
    "Green “2” and PAR 2 PLAY lockup match brand / storefront photo",
    "No satellite imagery credit required (fully generated or owned plates)",
    "mp4 + webm + poster paths above present",
  ],

  /**
   * WCAG notes for the shipped cut (silent decorative motion):
   * - 1.2.1 / 1.1.1: reduced-motion and Pause motion show the storefront poster + alt
   * - 1.4.2: intro is silent; soundtrack only arms on the looping hero
   * - 2.2.2: Pause motion / prefers-reduced-motion stop the film
   * - 2.3.1: single ease zoom + 0.35s fade — no flashes ≥3/sec
   */
  wcag: {
    silent: true,
    reducedMotionPoster: "public/media/hero-intro-zoom-poster.jpg",
    flashSafe: true,
    textAlternative:
      "Animated HD map of New York zooming into New Jersey with oversized golf icons, ending on the Par2Play storefront in Somerset",
  },

  shipped: true,
} as const;

export type HeroIntroZoomSpec = typeof HERO_INTRO_ZOOM;
