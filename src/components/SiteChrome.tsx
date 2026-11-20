import type { ReactNode } from "react";
import { useRef } from "react";
import { Mark } from "./Chrome";
import { BookLink, buttonFocus } from "./Cta";
import { LayoutToggle } from "./LayoutToggle";
import { SiteMenu } from "./SiteMenu";
import { MotionToggle } from "./MotionToggle";
import { PageAtmosphere, type AtmosphereIntensity } from "./PageAtmosphere";
import { SoundToggle } from "./SoundToggle";
import { golfClockBookingReady, NAP } from "../data/business";
import { VisitLine } from "./VisitLine";
import { SITE_NAV, currentRoute, pageHref, type SiteRoute } from "../data/routes";
import { showDemoChrome } from "../data/site";
import { useFlow } from "../state/flow";

function atmosphereFor(route: SiteRoute): AtmosphereIntensity {
  switch (route) {
    case "membership":
    case "coaching":
    case "juniors":
    case "events":
      return "strong";
    case "tournament":
    case "privacy":
    case "home":
    case "notfound":
      return "base";
    default: {
      const exhaustive: never = route;
      return exhaustive;
    }
  }
}

const navClass = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-ink ${buttonFocus}`;

export function SiteHeader() {
  const route = currentRoute();

  return (
    <header className="site-header header-bar relative sticky top-0 z-30 py-3">
      <div className="site-header__row">
        <a href={pageHref("")} className={`inline-flex min-h-11 items-center ${buttonFocus}`}>
          <Mark />
        </a>
        <div className="site-header__tools">
          {showDemoChrome() ? <LayoutToggle className="text-ink" /> : null}
          <SoundToggle className="text-ink" />
          <BookLink offer="bay" className="cta-raised shrink-0">
            Book a Bay
          </BookLink>
          <SiteMenu
            className="text-ink"
            linkClass={navClass}
            items={SITE_NAV.map((item) => ({
              slug: item.slug,
              label: item.label,
              href: pageHref(item.slug),
              current: route === item.slug,
            }))}
          />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 py-20 @3xl:px-12 @3xl:py-24">
      <div className="grid items-start gap-x-12 gap-y-8 @3xl:grid-cols-2 @5xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
        <VisitLine />
        <nav className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-1" aria-label="Footer">
          {SITE_NAV.map((item) => (
            <a key={item.slug} href={pageHref(item.slug)} className={navClass}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
        <p>© 2026 Par2Play</p>
        <MotionToggle className="text-ink" />
        <a href={pageHref("privacy-policy")} className={navClass}>
          Privacy
        </a>
      </div>
      {!golfClockBookingReady() && (
        <p className="mt-2 max-w-xl text-lg text-slate-700">
          GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
        </p>
      )}
    </footer>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  const mobile = useFlow().layout === "mobile";
  const scrollRef = useRef<HTMLDivElement>(null);
  const intensity = atmosphereFor(currentRoute());
  return (
    <div
      ref={scrollRef}
      data-smooth-root={mobile ? "" : undefined}
      className={`@container page-grid text-base text-ink ${mobile ? "h-full overflow-y-auto" : "min-h-screen"}`}
    >
      <PageAtmosphere scrollRoot={mobile ? scrollRef : undefined} intensity={intensity} />
      <div data-smooth-content={mobile ? "" : undefined} className="relative z-10">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

export const pageSpace = "px-6 py-16 @3xl:px-12 @3xl:py-24";
