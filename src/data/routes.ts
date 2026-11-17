export type SiteRoute =
  | "home"
  | "membership"
  | "coaching"
  | "juniors"
  | "events"
  | "tournament"
  | "privacy"
  | "notfound";

export const SITE_NAV = [
  { slug: "membership", label: "Membership" },
  { slug: "coaching", label: "Coaching" },
  { slug: "juniors", label: "Golf for Kids" },
  { slug: "events", label: "Events" },
  { slug: "tournament", label: "Tournament" },
] as const;

export type SiteSlug = (typeof SITE_NAV)[number]["slug"];

export function pageHref(slug: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  if (!slug) return base;
  return `${base}${slug}/`;
}

export function currentRoute(): SiteRoute {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let path = window.location.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length);
  const slug = path.replace(/^\/+|\/+$/g, "").replace(/index\.html$/, "");
  switch (slug) {
    case "":
      return "home";
    case "membership":
      return "membership";
    case "coaching":
      return "coaching";
    case "juniors":
      return "juniors";
    case "events":
      return "events";
    case "tournament":
      return "tournament";
    case "privacy-policy":
      return "privacy";
    case "404.html":
      return "notfound";
    default:
      return "notfound";
  }
}
