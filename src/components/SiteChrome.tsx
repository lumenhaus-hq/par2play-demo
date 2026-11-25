import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Mark } from "./Chrome";
import { BookLink, PhoneLink, buttonFocus } from "./Cta";
import { LayoutToggle } from "./LayoutToggle";
import { SiteMenu } from "./SiteMenu";
import { MotionToggle } from "./MotionToggle";
import { PageAtmosphere, type AtmosphereIntensity } from "./PageAtmosphere";
import { SoundToggle } from "./SoundToggle";
import { openCookieSettings } from "../analytics/consent";
import { golfClockBookingReady, NAP } from "../data/business";
import { SITE_NAV, currentRoute, pageHref, type SiteRoute } from "../data/routes";
import { HOURS_LABEL, INSTAGRAM_URL, MAPS_URL, showDemoChrome } from "../data/site";
import { useFlow } from "../state/flow";

function atmosphereFor(route: SiteRoute): AtmosphereIntensity {
  switch (route) {
    case "membership":
    case "coaching":
    case "swing-evaluation":
    case "juniors":
    case "events":
    case "members-day":
    case "junior-golf-experience":
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

const navClass = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-white ${buttonFocus}`;

/** Dark toolbar shared by every page, at rest and after scroll. */
export function SiteHeader({
  active,
  ready = true,
}: {
  /** Homepage section in view. Other pages mark the current route. */
  active?: string | null;
  ready?: boolean;
} = {}) {
  const route = currentRoute();
  const current = active === undefined ? route : active;

  return (
    <header
      className={`site-header hero-toolbar relative sticky top-0 z-30 shrink-0 py-3 ${
        ready ? (route === "home" ? "hero-chrome-in" : "") : "pointer-events-none opacity-0"
      }`}
      aria-hidden={ready ? undefined : true}
    >
      <div className="site-header__row">
        <a href={pageHref("")} className={`inline-flex min-h-11 items-center ${buttonFocus}`}>
          <Mark light />
        </a>
        <div className="site-header__tools">
          {showDemoChrome() ? <LayoutToggle className="text-white" /> : null}
          <SoundToggle className="text-white" />
          <BookLink offer="bay" tone="brand" className="cta-raised shrink-0">
            Book a Bay
          </BookLink>
          <SiteMenu
            className="text-white"
            linkClass={navClass}
            panelClass="bg-ink text-white"
            items={SITE_NAV.map((item) => ({
              slug: item.slug,
              label: item.label,
              href: pageHref(item.slug),
              current: current === item.slug,
            }))}
          />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ className = "" }: { className?: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <footer className={`site-footer ${className}`.trim()}>
      <div className="site-footer__main">
        <a href={pageHref("")} className="site-footer__logo">
          <Mark light />
        </a>
        <address className="site-footer__nap">
          {`${NAP.name} · ${NAP.street}, ${NAP.city}, ${NAP.region} ${NAP.postalCode} · `}
          <PhoneLink className="site-footer__link">{NAP.phoneDisplay}</PhoneLink>
          {` · Open ${HOURS_LABEL}.`}
        </address>
        <nav className="site-footer__quick" aria-label="Footer">
          <a className="site-footer__link" href={MAPS_URL}>
            Directions
          </a>
          <a className="site-footer__link" href={INSTAGRAM_URL}>
            Instagram
          </a>
        </nav>
        <button
          type="button"
          className="site-footer__toggle"
          aria-expanded={moreOpen}
          aria-controls="site-footer-more"
          onClick={() => setMoreOpen((open) => !open)}
        >
          {moreOpen ? "Hide links" : "More links"}
        </button>
        <div id="site-footer-more" className={`site-footer__extra${moreOpen ? " is-open" : ""}`}>
        <div className="site-footer__grid">
          <div>
            <h2 className="site-footer__label">Visit</h2>
            <address className="site-footer__address">
              <p>{NAP.name}</p>
              <p>{`${NAP.street}, ${NAP.city}, ${NAP.region} ${NAP.postalCode}`}</p>
              <p>{`Open ${HOURS_LABEL}.`}</p>
              <a className="site-footer__link" href={MAPS_URL}>
                Directions
              </a>
            </address>
          </div>
          <div>
            <h2 className="site-footer__label">Contact</h2>
            <p>
              <PhoneLink className="site-footer__link">{NAP.phoneDisplay}</PhoneLink>
            </p>
            <p>
              <a className="site-footer__link" href={`mailto:${NAP.email}`}>
                {NAP.email}
              </a>
            </p>
          </div>
          <nav aria-label="Explore">
            <h2 className="site-footer__label">Explore</h2>
            <ul className="site-footer__list">
              {SITE_NAV.map((item) => (
                <li key={item.slug}>
                  <a className="site-footer__link" href={pageHref(item.slug)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="site-footer__label">Follow</h2>
            <a className="site-footer__link" href={INSTAGRAM_URL}>
            Instagram
          </a>
          </div>
        </div>
        <div className="site-footer__mobile-actions">
          <a className="site-footer__link" href={pageHref("privacy-policy")}>
            Privacy policy
          </a>
          <button type="button" className="site-footer__link" onClick={openCookieSettings}>
            Cookie settings
          </button>
          <MotionToggle className="site-footer__link" />
        </div>
        </div>
      </div>
      <div className="site-footer__bar">
        <p className="site-footer__copy">© 2026 Par2Play</p>
        <a className="site-footer__link" href={pageHref("privacy-policy")}>
          Privacy policy
        </a>
        <button type="button" className="site-footer__link" onClick={openCookieSettings}>
          Cookie settings
        </button>
        <MotionToggle className="site-footer__link" />
      </div>
      {!golfClockBookingReady() && (
        <p className="site-footer__note">GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.</p>
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
