import type { ReactNode } from "react";
import { useState } from "react";
import { Mark } from "./Chrome";
import { MembershipLink, buttonFocus } from "./Cta";
import { MotionToggle } from "./MotionToggle";
import { SoundToggle } from "./SoundToggle";
import { membershipCheckoutHref, golfClockBookingReady, NAP } from "../data/business";
import { VisitLine } from "./VisitLine";
import { SITE_NAV, currentRoute, pageHref } from "../data/routes";
import { useFlow } from "../state/flow";

const navClass = `nav-link inline-flex min-h-11 items-center px-1 text-base font-semibold text-[#0A0F0B] ${buttonFocus}`;

export function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const route = currentRoute();
  const mobile = useFlow().layout === "mobile";

  return (
    <header className={`header-bar sticky z-30 px-6 py-3 @5xl:px-12 ${mobile ? "top-0" : "top-[4.25rem]"}`}>
      <div className="flex items-center justify-between gap-4">
        <a href={pageHref("")} className={`inline-flex min-h-11 items-center ${buttonFocus}`}>
          <Mark />
        </a>
        <nav className="hidden items-center gap-3 @3xl:flex @5xl:gap-6" aria-label="Page">
          {SITE_NAV.map((item) => (
            <a
              key={item.slug}
              href={pageHref(item.slug)}
              className={`${navClass} ${route === item.slug ? "is-active" : ""}`}
              aria-current={route === item.slug ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SoundToggle className="text-[#0A0F0B]" />
          <span className="hidden @3xl:contents">
            <MembershipLink href={route === "membership" ? membershipCheckoutHref() : undefined} className="shrink-0">
              Become a Member
            </MembershipLink>
          </span>
          <button
            type="button"
            className={`${navClass} @3xl:hidden`}
            aria-expanded={menu}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="mt-2 flex flex-col items-start gap-1 @3xl:hidden" aria-label="Page" data-cta-location="mobile_menu">
          {SITE_NAV.map((item) => (
            <a
              key={item.slug}
              href={pageHref(item.slug)}
              className={navClass}
              aria-current={route === item.slug ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
          <MembershipLink href={route === "membership" ? membershipCheckoutHref() : undefined} className="mt-2 w-fit">
            Become a Member
          </MembershipLink>
        </nav>
      )}
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
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
        <p>© 2026 Par2Play</p>
        <MotionToggle className="text-[#0A0F0B]" />
        <a href={pageHref("privacy-policy")} className={navClass}>
          Privacy
        </a>
      </div>
      {!golfClockBookingReady() && (
        <p className="mt-2 max-w-xl text-base text-slate-700">
          GolfClock booking link: TODO. Book calls {NAP.phoneDisplay}.
        </p>
      )}
    </footer>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  const mobile = useFlow().layout === "mobile";
  return (
    <div
      data-smooth-root={mobile ? "" : undefined}
      className={`@container page-grid text-base text-[#0A0F0B] ${mobile ? "h-full overflow-y-auto" : "min-h-screen"}`}
    >
      <div data-smooth-content={mobile ? "" : undefined}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

export const pageSpace = "px-6 py-16 @3xl:px-12 @3xl:py-24";
