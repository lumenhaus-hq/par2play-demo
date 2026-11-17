const file = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;

export type TickerChip = {
  id: string;
  label: string;
  webp: string;
  jpg: string;
};

/** Square chips from the photo set, plus the existing stills where this set has no match. */
export const TICKER_CHIPS: readonly TickerChip[] = [
  {
    id: "indoor",
    label: "Year-round indoor golf",
    webp: file("ticker/indoor-golf.webp"),
    jpg: file("ticker/indoor-golf.jpg"),
  },
  {
    id: "data",
    label: "Tour-grade launch monitor data",
    webp: file("ticker/launch-monitor.webp"),
    jpg: file("ticker/launch-monitor.jpg"),
  },
  {
    id: "membership",
    label: "Unlimited membership",
    webp: file("ticker/regulars.webp"),
    jpg: file("ticker/regulars.jpg"),
  },
  {
    id: "community",
    label: "Community",
    webp: file("ticker/community.webp"),
    jpg: file("ticker/community.jpg"),
  },
  {
    id: "clubhouse",
    label: "The clubhouse",
    webp: file("ticker/clubhouse.webp"),
    jpg: file("ticker/clubhouse.jpg"),
  },
  {
    id: "groups",
    label: "Groups and corporate events",
    webp: file("ticker/groups.webp"),
    jpg: file("ticker/groups.jpg"),
  },
  {
    id: "coaches",
    label: "PGA professional coaching",
    webp: file("ticker/coaching.webp"),
    jpg: file("ticker/coaching.jpg"),
  },
  {
    id: "juniors",
    label: "Junior coaching",
    webp: file("ticker/junior-coaching.webp"),
    jpg: file("ticker/junior-coaching.jpg"),
  },
  {
    id: "events",
    label: "Leagues and events",
    webp: file("ticker/leagues-events.webp"),
    jpg: file("ticker/leagues-events.jpg"),
  },
];

export type GalleryPhoto = {
  id: string;
  alt: string;
  src800: string;
  src1600: string;
  width: number;
  height: number;
};

export const EVENT_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "group-cheer",
    alt: "A smiling group waving in front of a golf simulator screen",
    src800: file("events/event-group-cheer-800.webp"),
    src1600: file("events/event-group-cheer.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "group-photo",
    alt: "A large group posing together on the hitting mat in front of a simulator screen",
    src800: file("events/event-group-photo-800.webp"),
    src1600: file("events/event-group-photo.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "crowd",
    alt: "Event guests lined up watching a friend swing in the simulator lounge",
    src800: file("events/event-crowd-watching-swing-800.webp"),
    src1600: file("events/event-crowd-watching-swing.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "lounge",
    alt: "Guests gathered around a simulator bay watching a player during an event",
    src800: file("events/event-lounge-watching-800.webp"),
    src1600: file("events/event-lounge-watching.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "bays",
    alt: "Several simulator bays in use with golfers of different ages",
    src800: file("events/event-bays-in-use-800.webp"),
    src1600: file("events/event-bays-in-use.webp"),
    width: 1600,
    height: 900,
  },
];

export const COACHING_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "demo",
    alt: "A coach explaining a swing point to a student in front of the simulator screen",
    src800: file("coaching/coaching-demo-800.webp"),
    src1600: file("coaching/coaching-demo.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "grip",
    alt: "A coach crouching to adjust a young golfer's grip during a lesson",
    src800: file("coaching/coaching-grip-adjust-800.webp"),
    src1600: file("coaching/coaching-grip-adjust.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "setup",
    alt: "A coach checking a golfer's setup at address in a simulator bay",
    src800: file("coaching/coaching-setup-check-800.webp"),
    src1600: file("coaching/coaching-setup-check.webp"),
    width: 1600,
    height: 900,
  },
];

export const JUNIORS_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "clinic",
    alt: "Junior golfers lined up watching a coach's demonstration at a simulator bay",
    src800: file("juniors/juniors-clinic-line-800.webp"),
    src1600: file("juniors/juniors-clinic-line.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "group",
    alt: "A coach and a junior golfer at the front of a group lesson, with young players watching",
    src800: file("juniors/juniors-group-lesson-800.webp"),
    src1600: file("juniors/juniors-group-lesson.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "one",
    alt: "A coach helping a young golfer with setup in a simulator bay",
    src800: file("juniors/juniors-one-on-one-800.webp"),
    src1600: file("juniors/juniors-one-on-one.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "swing",
    alt: "A young golfer practising swings while a coach watches",
    src800: file("juniors/juniors-swing-practice-800.webp"),
    src1600: file("juniors/juniors-swing-practice.webp"),
    width: 1600,
    height: 900,
  },
];

export const FITTING_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "workshop",
    alt: "A staff member working on a golf club grip at the pro shop counter",
    src800: file("fitting/fitting-club-workshop-800.webp"),
    src1600: file("fitting/fitting-club-workshop.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "grip",
    alt: "A staff member checking a club grip at the pro shop counter",
    src800: file("fitting/fitting-grip-check-800.webp"),
    src1600: file("fitting/fitting-grip-check.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "cart",
    alt: "A fitting cart of interchangeable iron heads",
    src800: file("fitting/fitting-ping-cart-800.webp"),
    src1600: file("fitting/fitting-ping-cart.webp"),
    width: 1600,
    height: 900,
  },
  {
    id: "analysis",
    alt: "Swing analysis software showing a golfer's swing on monitors",
    src800: file("fitting/fitting-swing-analysis-800.webp"),
    src1600: file("fitting/fitting-swing-analysis.webp"),
    width: 1600,
    height: 900,
  },
];

/** community-8 is omitted. The frame is weak and is not shown. */
export const COMMUNITY_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "community-1",
    alt: "Two smiling men in the lounge, one giving a thumbs up",
    src800: file("community/community-1-800.webp"),
    src1600: file("community/community-1.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-2",
    alt: "Three women hugging and smiling on a lounge sofa",
    src800: file("community/community-2-800.webp"),
    src1600: file("community/community-2.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-3",
    alt: "Three men posing arm in arm and smiling at an evening gathering",
    src800: file("community/community-3-800.webp"),
    src1600: file("community/community-3.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-4",
    alt: "Three friends posing together and smiling at a party",
    src800: file("community/community-4-800.webp"),
    src1600: file("community/community-4.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-5",
    alt: "Man and woman posing together and smiling in the lounge",
    src800: file("community/community-5-800.webp"),
    src1600: file("community/community-5.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-6",
    alt: "Three guests smiling and raising drinks in the lounge",
    src800: file("community/community-6-800.webp"),
    src1600: file("community/community-6.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-7",
    alt: "Group relaxing on lounge sofas and chatting",
    src800: file("community/community-7-800.webp"),
    src1600: file("community/community-7.webp"),
    width: 1600,
    height: 1067,
  },
];
