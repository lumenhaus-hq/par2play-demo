import { NAP, OCLOCK, PRICES } from "./business";
import { absoluteUrl, MAPS_URL, OPENING_HOURS_SPEC, SAME_AS, siteOrigin } from "./site";

const origin = () => siteOrigin();

/**
 * TODO(geo): 40.49134, -74.47402 comes from a Google listing via Exa, not from
 * par2play.com. The spec does not mark those coordinates verified, so geo is omitted.
 */

export const FAQS = [
  {
    question: "Where is Par2Play?",
    answer: "Par2Play is at 695 Hamilton Street, Suite G, Somerset, NJ 08873. Call (732) 448-2769 or email info@par2play.com.",
  },
  {
    question: "What are Par2Play's hours?",
    answer: "Par2Play is open 10am to 10pm, seven days a week.",
  },
  {
    question: "What golf simulators does Par2Play use?",
    answer: "Par2Play uses Full Swing golf simulators with swing-evaluation cameras, in four enclosed bays.",
  },
  {
    question: "Do I need my own golf clubs?",
    answer: "No. Complimentary premium golf clubs are included, or you can bring your own.",
  },
  {
    question: "Who teaches golf lessons at Par2Play?",
    answer: "Lessons are taught by PGA professionals on Full Swing simulators with swing-evaluation cameras.",
  },
  {
    question: "How much is a golf lesson in Somerset at Par2Play?",
    answer: "A Swing Evaluation session is $100 for 50 to 60 minutes. Single lesson pricing is confirmed at booking.",
  },
  {
    question: "Are lessons good for beginners?",
    answer:
      "Yes. Par2Play offers private and semi-private lessons for beginner and advanced players. A Swing Evaluation session ($100, 50 to 60 minutes) is the place to start.",
  },
  {
    question: "Does Par2Play offer junior golf?",
    answer:
      "Yes. Junior coaching is $249 a month once a week, or $399 a month for age-group sessions twice a week, one hour each.",
  },
  {
    question: "How does Par2Play membership work?",
    answer:
      "Silver membership is $200 a month, Gold is $250 a month, and Platinum is $4,500 a year. A single bay rental is the way to try Par2Play first.",
  },
  {
    question: "Can I host a party or company event at Par2Play?",
    answer:
      "Yes. Par2Play hosts events from 50+ person corporate events to birthday, bachelor and bachelorette parties. Event pricing includes a golf pro for mini-lessons and contests. Request a quote for package pricing.",
  },
  {
    question: "How do I book a bay or lesson?",
    answer: "Book online at par2play.oclock.app or call (732) 448-2769.",
  },
] as const;

function id(fragment: string): string {
  return `${origin()}${fragment}`;
}

function breadcrumb(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl() },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}

function offer(name: string, price: number, url: string, unit?: "MONTH" | "YEAR") {
  return {
    "@type": "Offer",
    name,
    price: String(price),
    priceCurrency: "USD",
    url,
    ...(unit
      ? {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(price),
            priceCurrency: "USD",
            unitText: unit,
          },
        }
      : {}),
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id("/#org"),
        name: "Par2Play",
        url: absoluteUrl(),
        logo: absoluteUrl("brand/logo.png"),
        email: NAP.email,
        telephone: NAP.phoneE164,
        founder: { "@type": "Person", name: NAP.founder },
        sameAs: [...SAME_AS],
      },
      {
        "@type": ["SportsActivityLocation", "LocalBusiness"],
        "@id": id("/#location"),
        name: "Par2Play",
        alternateName: "Par2Play Indoor Golf",
        description:
          "Indoor golf studio in Somerset, NJ with four enclosed Full Swing golf simulator bays, private golf lessons with PGA professionals, junior coaching, memberships, and private events.",
        url: absoluteUrl(),
        image: [absoluteUrl("media/hero-poster.jpg")],
        logo: absoluteUrl("brand/logo.png"),
        telephone: NAP.phoneE164,
        email: NAP.email,
        sport: "Golf",
        parentOrganization: { "@id": id("/#org") },
        address: {
          "@type": "PostalAddress",
          streetAddress: NAP.street,
          addressLocality: NAP.city,
          addressRegion: NAP.region,
          postalCode: NAP.postalCode,
          addressCountry: NAP.country,
        },
        hasMap: MAPS_URL,
        openingHoursSpecification: [OPENING_HOURS_SPEC],
        areaServed: [
          { "@type": "City", name: "Somerset, NJ" },
          { "@type": "City", name: "Franklin Township, NJ" },
          { "@type": "City", name: "New Brunswick, NJ" },
        ],
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Full Swing golf simulators", value: true },
          { "@type": "LocationFeatureSpecification", name: "Enclosed simulator bays", value: 4 },
          { "@type": "LocationFeatureSpecification", name: "Complimentary premium golf clubs", value: true },
        ],
        employee: [{ "@id": id("/coaching/#nick-schiavo") }, { "@id": id("/coaching/#nick-monticello") }],
        potentialAction: { "@type": "ReserveAction", target: OCLOCK.book, name: "Book a bay or lesson" },
        sameAs: [...SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": id("/#website"),
        url: absoluteUrl(),
        name: "Par2Play",
        publisher: { "@id": id("/#org") },
      },
    ],
  };
}

export function faqGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function coachingGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("coaching/"),
        name: "Golf lessons in Somerset, NJ",
        about: { "@id": id("/#location") },
      },
      {
        "@type": "Service",
        "@id": id("/coaching/#lessons"),
        name: "Private golf lessons in Somerset, NJ",
        serviceType: "Golf instruction",
        provider: { "@id": id("/#location") },
        areaServed: "Somerset, NJ",
        description:
          "Private golf lessons and swing evaluations with PGA professionals on Full Swing simulators with swing-evaluation cameras.",
        offers: [
          offer("Swing Evaluation Session (50–60 min)", PRICES.swingEvaluation, OCLOCK.lessons),
          offer("Golf Improvement Bundle", PRICES.golfImprovementBundle, OCLOCK.golfImprovementBundle),
        ],
      },
      breadcrumb("Golf lessons", "coaching/"),
    ],
  };
}

export function membershipGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("membership/"),
        name: "Indoor golf membership in Somerset, NJ",
        about: { "@id": id("/#location") },
      },
      {
        "@type": "Service",
        name: "Indoor golf membership in Somerset, NJ",
        provider: { "@id": id("/#location") },
        offers: [
          offer("Silver membership", 200, OCLOCK.memberships, "MONTH"),
          offer("Gold membership", 250, OCLOCK.memberships, "MONTH"),
          offer("Platinum membership", 4500, OCLOCK.memberships, "YEAR"),
        ],
      },
      breadcrumb("Membership", "membership/"),
    ],
  };
}

export function juniorsGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("juniors/"),
        name: "Junior golf in Somerset, NJ",
        about: { "@id": id("/#location") },
      },
      {
        "@type": "Service",
        name: "Junior golf coaching in Somerset, NJ",
        serviceType: "Junior golf instruction",
        provider: { "@id": id("/#location") },
        description: "Age-group junior golf sessions: lessons, training, leagues, tournaments, practice time and fitting.",
        offers: [
          offer("Junior coaching, once a week", PRICES.juniorOneLessonWeekly, OCLOCK.lessons, "MONTH"),
          offer("Junior Golf Membership (twice a week)", PRICES.juniorTwoLessonsWeekly, OCLOCK.lessons, "MONTH"),
        ],
      },
      breadcrumb("Junior golf", "juniors/"),
    ],
  };
}

export function eventsGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("events/"),
        name: "Golf simulator parties and events in Somerset, NJ",
        about: { "@id": id("/#location") },
      },
      {
        "@type": "Service",
        name: "Golf simulator parties and private events in Somerset, NJ",
        serviceType: "Private event venue",
        provider: { "@id": id("/#location") },
        description:
          "Private events in four enclosed simulator bays, from 50+ person corporate events to birthday, bachelor and bachelorette parties. Event pricing includes a golf pro who runs mini-lessons, simulator help and casual contests.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Event types",
          itemListElement: [
            "Holiday parties",
            "Company events and team building",
            "Birthday parties",
            "Kids and teens parties",
            "Tournaments and fundraisers",
            "Field trips",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
        url: OCLOCK.events,
      },
      breadcrumb("Events", "events/"),
    ],
  };
}

export function tournamentGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("tournament/"),
        name: "Par2Play Fall League",
        about: { "@id": id("/#location") },
      },
      breadcrumb("Fall League", "tournament/"),
    ],
  };
}

export function privacyGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: absoluteUrl("privacy-policy/"),
        name: "Privacy Policy",
        about: { "@id": id("/#location") },
      },
      breadcrumb("Privacy policy", "privacy-policy/"),
    ],
  };
}
