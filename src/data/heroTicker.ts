import { SIMULATOR_COURSE_COUNT } from "./business";

/** Words only. No prices and no percents. The course count is the one number. */
export const HERO_TICKER = [
  { id: "analytics", label: "Shot analytics", icon: "camera" },
  { id: "courses", label: `${SIMULATOR_COURSE_COUNT}+ courses`, icon: "flag" },
  { id: "clubs", label: "Top brand clubs", icon: "club" },
  { id: "vibes", label: "Guaranteed good vibes", icon: "party" },
  { id: "indoor", label: "Year-round indoor golf", icon: "calendar" },
  { id: "community", label: "Community", icon: "people" },
  { id: "clubhouse", label: "The clubhouse", icon: "ball" },
  { id: "juniors", label: "Junior coaching", icon: "people" },
  { id: "leagues", label: "Leagues and events", icon: "trophy" },
] as const;