import type { BookingOffer } from "../data/business";
import { ANALYTICS_EVENTS } from "../data/analytics";
import { hasConsent } from "./consent";

export type TrackParams = {
  cta_label: string;
  cta_location: string;
  link_url?: string;
  booking_type?: string;
  form_name?: string;
  contact_method?: "phone";
  lead_interest?: string;
};

const META_MAP: Record<string, [string, Record<string, string> | undefined]> = {
  membership_click: ["Lead", { content_category: "membership" }],
  book_bay_click: ["Schedule", { content_category: "bay_rental" }],
  book_lesson_click: ["Schedule", undefined],
  event_availability_click: ["Lead", { content_category: "events" }],
  league_join_click: ["Lead", { content_category: "league" }],
  contact: ["Contact", undefined],
  golfclock_click: ["ViewContent", undefined],
  generate_lead: ["CompleteRegistration", undefined],
};

export function ctaLocation(element: Element): string {
  const marked = element.closest("[data-cta-location]");
  if (marked instanceof HTMLElement && marked.dataset.ctaLocation) return marked.dataset.ctaLocation;
  const section = element.closest("section[id]");
  if (section instanceof HTMLElement && section.id) return section.id;
  if (element.closest("footer")) return "footer";
  if (element.closest("header")) return "header";
  return "page";
}

export function track(event: string, params: TrackParams) {
  const url = params.link_url ? new URL(params.link_url, location.href) : null;
  const http = url?.protocol === "http:" || url?.protocol === "https:";
  const payload = {
    event,
    ...params,
    page_path: location.pathname,
    link_domain: http ? url?.hostname : undefined,
    outbound: Boolean(http && url && url.hostname !== location.hostname),
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);

  if (!hasConsent("marketing") || typeof window.fbq !== "function") return;
  const mapped = META_MAP[event];
  if (!mapped) return;
  const [name, extra] = mapped;
  const metaName = event === "generate_lead" && params.form_name === "enquiry" ? "Lead" : name;
  const content =
    extra ??
    (params.booking_type ? { content_category: params.booking_type } : {});
  window.fbq("track", metaName, { ...content, content_name: params.cta_label });
}

const LESSON_TYPES: Record<string, string> = {
  lesson: "lesson",
  "lesson-pack": "lesson_pack",
  "swing-evaluation": "swing_evaluation",
  "swing-lab": "swing_evaluation",
  junior: "junior",
  "junior-plus": "junior",
  fitting: "fitting",
};

function golfclockType(href: string): string {
  if (href.includes("prod_lesson_packs")) return "store_lesson_packs";
  if (href.includes("prod_practice_unlimited")) return "store_practice_unlimited";
  if (href.includes("category=Memberships")) return "store_memberships";
  if (href.includes("flow_bf_bay_rental")) return "bay_rental";
  if (href.includes("flow_bf_lessons")) return "lesson";
  if (href.includes("flow_bf_fitting")) return "fitting";
  if (href.includes("flow_bf_league")) return "league";
  if (href.includes("/events")) return "group_event";
  return "golfclock";
}

export function trackAnchor(element: HTMLAnchorElement, extra: Partial<TrackParams> = {}) {
  const label = (element.textContent ?? "").replace(/\s+/g, " ").trim();
  const href = element.href;
  const base: TrackParams = {
    cta_label: label,
    cta_location: ctaLocation(element),
    link_url: href,
    ...extra,
  };
  if (element.matches('a[href^="tel:"]')) {
    track(ANALYTICS_EVENTS.contact, { ...base, contact_method: "phone", link_url: "tel:+17324482769" });
    return;
  }
  const offer = element.dataset.offer as BookingOffer | undefined;
  if (offer === "bay") {
    track(ANALYTICS_EVENTS.bookBayClick, { ...base, booking_type: "bay_rental" });
    return;
  }
  if (offer && offer in LESSON_TYPES) {
    track(ANALYTICS_EVENTS.bookLessonClick, { ...base, booking_type: LESSON_TYPES[offer] });
    return;
  }
  if (offer === "group") {
    track(ANALYTICS_EVENTS.eventAvailabilityClick, { ...base, booking_type: "group_event" });
    return;
  }
  if (offer === "tournament") {
    track(ANALYTICS_EVENTS.leagueJoinClick, { ...base, booking_type: "league" });
    return;
  }
  if (element.dataset.membership === "true" || /become a member/i.test(label)) {
    track(ANALYTICS_EVENTS.membershipClick, base);
    return;
  }
  if (href.includes("par2play.oclock.app")) {
    track(ANALYTICS_EVENTS.golfclockClick, { ...base, booking_type: golfclockType(href) });
  }
}

export function trackLead(formName: string, leadInterest?: string) {
  track(ANALYTICS_EVENTS.generateLead, {
    cta_label: formName === "tournament" ? "Reserve your tournament spot" : "Send",
    cta_location: formName === "tournament" ? "tournament" : "page",
    form_name: formName,
    lead_interest: leadInterest,
  });
}
